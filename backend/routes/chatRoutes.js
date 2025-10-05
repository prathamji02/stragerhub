// backend/routes/chatRoutes.js

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Middleware to protect routes
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.userId };
            next();
        } catch (error) {
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// GET /api/chats - Fetch all private chatrooms for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const chatrooms = await prisma.chatroom.findMany({
            // UPDATED: Added a condition to hide chats the user has "soft deleted"
            where: {
                is_private: true,
                participants: {
                    some: {
                        id: req.user.id,
                    },
                },
                hiddenFor: {
                    none: {
                        id: req.user.id
                    }
                }
            },
            include: {
                participants: {
                    where: {
                        id: {
                            not: req.user.id,
                        },
                    },
                    select: {
                        fake_name: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            }
        });

        res.status(200).json(chatrooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chats.' });
    }
});

// GET /api/chats/:id/messages - Fetch message history for a chatroom
router.get('/:id/messages', protect, async (req, res) => {
    const { id } = req.params;
    try {
        // UPDATED: Added a check to ensure the user hasn't soft-deleted this chat
        const chatroom = await prisma.chatroom.findFirst({
            where: {
                id,
                participants: { some: { id: req.user.id } },
                hiddenFor: { none: { id: req.user.id } }
            }
        });

        if (!chatroom) {
            return res.status(404).json({ error: 'Chatroom not found or you do not have access.' });
        }

        const messages = await prisma.message.findMany({
            where: { chatroom_id: id },
            orderBy: { created_at: 'asc' }
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// DELETE /api/chats/:id - Soft deletes a saved chatroom for the current user
router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;
    try {
        // First, verify the user is a participant of the chatroom
        const chatroom = await prisma.chatroom.findFirst({
            where: {
                id,
                participants: { some: { id: req.user.id } }
            }
        });

        if (!chatroom) {
            return res.status(403).json({ error: 'You are not authorized to perform this action.' });
        }

        // UPDATED: Instead of deleting, update the chatroom to mark it as hidden for the user
        await prisma.chatroom.update({
            where: { id },
            data: {
                hiddenFor: {
                    connect: { id: req.user.id }
                }
            }
        });

        res.status(200).json({ message: 'Chat removed successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove chat.' });
    }
});

export default router;