// backend/server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// Configure CORS to specifically allow your Vercel frontend
const corsOptions = {
  origin: [
      'https://stragerhub.vercel.app',    // Your Vercel URL
      'https://ipufriendlist.com',      // Your new custom domain
      'https://www.ipufriendlist.com' ,
      'http://localhost:5173'  // The 'www' version as well
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

let waitingPool = [];
const activeRooms = new Map(); 
const onlineUsers = new Map(); 

io.use((socket, next) => {
    // ... (this logic is unchanged)
    const token = socket.handshake.auth.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            next();
        } catch (error) {
            next(new Error("Authentication error"));
        }
    } else {
        next(new Error("Authentication error"));
    }
});

io.on('connection', (socket) => {
    // ... (most of this logic is unchanged)
    const userId = socket.userId;
    onlineUsers.set(userId, socket.id);
    io.emit('update_online_count', onlineUsers.size);
    console.log(`User ${userId} connected. Online: ${onlineUsers.size}`);

    socket.on('find_chat', async () => {
        // ... (this logic is unchanged)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || waitingPool.some(u => u.id === userId)) return;

        const blockedUserRecords = await prisma.block.findMany({
            where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
        });
        const blockedUserIds = new Set(blockedUserRecords.flatMap(b => [b.blockerId, b.blockedId]));

        const potentialPartner = waitingPool.find(
            (partner) => !blockedUserIds.has(partner.id)
        );

        if (potentialPartner) {
            waitingPool = waitingPool.filter(p => p.id !== potentialPartner.id);
            const user1 = { socketId: socket.id, ...user };
            const user2 = potentialPartner;
            
            const roomId = `${user1.socketId}-${user2.socketId}`;
            activeRooms.set(roomId, { user1, user2, chatHistory: [] });
            
            const socket1 = io.sockets.sockets.get(user1.socketId);
            const socket2 = io.sockets.sockets.get(user2.socketId);

            if (socket1 && socket2) {
                socket1.join(roomId);
                socket2.join(roomId);
                io.to(user1.socketId).emit('chat_started', { roomId, partner: { id: user2.id, fake_name: user2.fake_name, gender: user2.gender, averageRating: user2.averageRating, ratingCount: user2.ratingCount } });
                io.to(user2.socketId).emit('chat_started', { roomId, partner: { id: user1.id, fake_name: user1.fake_name, gender: user1.gender, averageRating: user1.averageRating, ratingCount: user1.ratingCount } });
            }
        } else {
            waitingPool.push({ socketId: socket.id, ...user });
        }
    });

    socket.on('cancel_find_chat', () => {
        // ... (this logic is unchanged)
        waitingPool = waitingPool.filter(user => user.userId !== userId);
    });

    socket.on('send_message', async ({ roomId, message, persistent }) => {
        // ... (this logic is unchanged)
        const room = activeRooms.get(roomId);
        if (room && !persistent) {
            const sender = room.user1.socketId === socket.id ? room.user1 : room.user2;
            room.chatHistory.push({ sender: sender, text: message });
        }

        if (persistent) {
            try {
                await prisma.message.create({
                    data: { content: message, chatroom_id: roomId, sender_id: userId }
                });
            } catch(e) { console.error("Failed to save persistent message.", e)}
        }
        socket.to(roomId).emit('new_message', message);
    });

    // --- NEW: TYPING INDICATOR LOGIC ---
    socket.on('start_typing', ({ roomId }) => {
        socket.to(roomId).emit('partner_started_typing');
    });

    socket.on('stop_typing', ({ roomId }) => {
        socket.to(roomId).emit('partner_stopped_typing');
    });

    socket.on('join_persistent_room', (roomId) => socket.join(roomId));
    socket.on('send_connect_request', (roomId) => socket.to(roomId).emit('receive_connect_request'));

    socket.on('accept_connect_request', async (roomId) => {
        // ... (this logic is unchanged)
        const room = activeRooms.get(roomId);
        if (room) {
            const newChatroom = await prisma.chatroom.create({
                data: {
                    is_private: true,
                    participants: { connect: [{ id: room.user1.id }, { id: room.user2.id }] }
                }
            });

            if (room.chatHistory.length > 0) {
                const messagesToCreate = room.chatHistory.map(msg => ({
                    content: msg.text,
                    sender_id: msg.sender.id,
                    chatroom_id: newChatroom.id
                }));
                await prisma.message.createMany({
                    data: messagesToCreate,
                });
            }

            io.to(roomId).emit('connect_success', 'You are now connected!');
        }
    });

    const endChatAndLog = async (roomId) => {
        // ... (this logic is unchanged)
        const room = activeRooms.get(roomId);
        if (room) {
            if (room.chatHistory.length > 0) {
                await prisma.report.create({
                    data: {
                        reporterId: room.user1.id,
                        reportedId: room.user2.id,
                        logType: 'CHAT_LOG',
                        chatHistory: room.chatHistory.map(msg => ({ sender: msg.sender.fake_name, text: msg.text })),
                        reason: `Chat log between ${room.user1.fake_name || room.user1.name} and ${room.user2.fake_name || room.user2.name}`
                    }
                }).catch(console.error);
            }

            io.to(room.user1.socketId).emit('chat_ended', { partnerId: room.user2.id });
            io.to(room.user2.socketId).emit('chat_ended', { partnerId: room.user1.id });
            activeRooms.delete(roomId);
        }
    };

    socket.on('leave_chat', (roomId) => {
        endChatAndLog(roomId);
    });

    socket.on('disconnect', () => {
        // ... (this logic is unchanged)
        onlineUsers.delete(userId);
        io.emit('update_online_count', onlineUsers.size);
        console.log(`User ${userId} disconnected. Online: ${onlineUsers.size}`);
        
        let roomIdToEnd;
        for (const [roomId, room] of activeRooms.entries()) {
            if (room.user1.socketId === socket.id || room.user2.socketId === socket.id) {
                roomIdToEnd = roomId;
                break;
            }
        }
        if (roomIdToEnd) {
            endChatAndLog(roomIdToEnd);
        }
        
        waitingPool = waitingPool.filter(user => user.id !== userId);
    });
});

// --- NEW: AUTOMATED TASK FOR UNFREEZING ---
const checkAndUnfreezeUsers = async () => {
    try {
        const now = new Date();
        const usersToUnfreeze = await prisma.user.findMany({
            where: {
                status: 'FROZEN',
                unfreezeAt: {
                    lte: now,
                },
            },
        });

        if (usersToUnfreeze.length > 0) {
            const userIds = usersToUnfreeze.map(user => user.id);
            await prisma.user.updateMany({
                where: {
                    id: { in: userIds },
                },
                data: {
                    status: 'ACTIVE',
                    unfreezeAt: null,
                },
            });
            console.log(`Auto-unfroze ${usersToUnfreeze.length} user(s).`);
        }
    } catch (error) {
        console.error('Error in unfreeze job:', error);
    }
};

// Run the unfreeze check every hour
setInterval(checkAndUnfreezeUsers, 3600 * 1000); 

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});