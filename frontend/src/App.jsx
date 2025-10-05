import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://192.168.0.197:3000/api';
const SOCKET_URL = 'http://192.168.0.197:3000';

const api = axios.create({ baseURL: API_URL });

function Spinner() {
    return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
}

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl">&times;</button>
                {children}
            </div>
        </div>
    );
}

function LoginScreen({ handleLogin, enrollmentNo, setEnrollmentNo, message, isLoading }) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-6 text-center">Login to StrangerHub</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="enrollmentNo" className="block mb-2 text-sm font-medium text-gray-300">Enrollment Number</label>
                        <input type="text" id="enrollmentNo" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} placeholder="Enter your number" required className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full p-3 rounded bg-blue-600 font-bold hover:bg-blue-700 transition-colors flex justify-center items-center disabled:bg-blue-800 disabled:cursor-not-allowed">
                        {isLoading ? <Spinner /> : 'Get OTP'}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}
            </div>
        </div>
    );
}

function OtpScreen({ handleVerify, otp, setOtp, message, loginUserInfo, setView, isLoading }) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm text-center relative">
                <button onClick={() => setView('login')} className="absolute top-4 left-4 text-blue-400 hover:underline">&larr; Back</button>
                <h1 className="text-2xl font-bold mb-2">Check your Email</h1>
                {loginUserInfo && (
                    <>
                        <p className="text-gray-300">Hi, <span className="font-bold">{loginUserInfo.name}</span>!</p>
                        <p className="text-gray-400 mb-6 text-sm">We've sent a One-Time Password to <br /> <span className="font-semibold">{loginUserInfo.email}</span></p>
                    </>
                )}
                <form onSubmit={handleVerify}>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" required className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-center tracking-[1em]" />
                    <button type="submit" disabled={isLoading} className="w-full p-3 rounded bg-blue-600 font-bold hover:bg-blue-700 flex justify-center items-center disabled:bg-blue-800">
                        {isLoading ? <Spinner /> : 'Verify'}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}
            </div>
        </div>
    );
}

function FrozenScreen({ userInfo }) {
    const unfreezeDate = new Date(userInfo.unfreezeAt).toLocaleString();
    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4 text-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4 text-yellow-400">Account Frozen</h1>
                <p className="text-gray-300">Your account is currently frozen due to a violation of community guidelines.</p>
                <p className="text-gray-400 mt-2">You will be able to log in again after:</p>
                <p className="text-2xl font-bold mt-4 text-white">{unfreezeDate}</p>
            </div>
        </div>
    );
}

function AboutScreen({ setView }) {
    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
            <div className="w-full max-w-3xl mx-auto">
                <button onClick={() => setView('home')} className="mb-6 text-blue-400 hover:underline">&larr; Back to Home</button>
                <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg space-y-6 text-gray-300">
                    
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-2 text-white">Welcome to StrangerHub!</h1>
                        <p className="text-lg font-semibold text-blue-400">Hey, GTBIT!</p>
                    </div>

                    <p>If you're a fresher who hasn't had the chance to make new friends yet, or if you're just a bit shy about starting conversations in person, our team has built something amazing just for you.</p>
                    <p><strong className="text-white">StrangerHub is a completely free, anonymous chat app built exclusively for the students of our college.</strong></p>
                    <p>After analyzing other chat apps, we realized that fake accounts are a huge problem that ruins the user experience. At the same time, we know that not everyone is comfortable revealing their real identity right away.</p>
                    <p>Our solution is a unique system that guarantees both <strong className="text-white">Authenticity and Anonymity</strong>. You can chat with a verified fellow student without revealing who you are, and only choose to connect when you're both comfortable.</p>

                    <div className="pt-4 border-t border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Getting Started: A Quick Guide</h2>
                        
                        <h3 className="text-xl font-semibold text-white mb-2">One-Time Registration (Choose Your Method)</h3>
                        <p>To ensure our community is 100% genuine, we have a simple, one-time verification process. You can register in one of two ways:</p>
                        <ul className="list-disc list-inside space-y-3 pl-4 mt-2">
                            <li><strong className="text-white">Offline (Recommended):</strong> Find one of our team members on campus for instant, in-person verification.</li>
                            <li><strong className="text-white">Online:</strong> Send an email to <span className="text-blue-400">airaworld28@gmail.com</span> with a clear photo of the front of your College ID card and your details (Enrollment No, Full Name, Phone No, Email ID, Gender) typed in the email.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">Simple & Secure Login</h3>
                        <p>Once you are registered, you can log in at any time using your unique Enrollment Number. A One-Time Password (OTP) will be sent to your registered email address to verify your identity.</p>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">Create Your Alias</h3>
                        <p><strong className="text-yellow-400">Important:</strong> On your first login, you will be asked to create a "fake name" or username. This name is permanent and cannot be changed. It's how others will see you in random chats, so choose wisely!</p>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">How It All Works: App Features</h2>
                        <ul className="space-y-4">
                            <li><strong className="text-white">Find a Chat:</strong> The main feature. Click this button to be instantly and randomly connected with another online student from our college.</li>
                            <li><strong className="text-white">See User Ratings:</strong> When you connect with a stranger, you will see their public rating (out of 5 stars) and their gender, which helps you know if they are a good person to talk to.</li>
                            <li><strong className="text-white">End Chat:</strong> Not feeling the conversation? No problem. Just click "End Chat" at any time to immediately end the conversation and return to the home screen.</li>
                            <li><strong className="text-white">Rate, Review, Block, & Report:</strong> After every random chat, you will be taken to a feedback screen. This is your power to help build a safe community:
                                <ul className="list-disc list-inside space-y-2 pl-6 mt-2 text-gray-400">
                                    <li><strong className="text-gray-300">Rate & Review:</strong> Leave an honest star rating and an optional review about your conversation partner.</li>
                                    <li><strong className="text-gray-300">Block:</strong> If you don't want to be matched with that person again, you can block them.</li>
                                    <li><strong className="text-gray-300">Report:</strong> If someone is being disrespectful or breaking the rules, please report them immediately. Your report, along with the chat history, will be sent to the admin for review.</li>
                                </ul>
                            </li>
                            <li><strong className="text-white">Connect Request:</strong> Had a great conversation? Send a "Connect" request! If the other person accepts, your chat will be permanently saved.</li>
                            <li><strong className="text-white">Saved Chats:</strong> You can access all your saved conversations in the "Saved Chats" tab. From there, you can view your chat history and continue the conversation anytime.</li>
                            <li><strong className="text-white">Delete Saved Chats:</strong> You have full control. You can delete any of your saved chats at any time. This action is permanent and will delete the chat for both users.</li>
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-700 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">A Final Word</h2>
                        <p>This is the first test launch of our app. We are counting on your support and honest feedback to make it better. Our goal is to create a fun, safe, and exciting new way for all of us at GTBIT to connect.</p>
                        <p className="font-semibold text-white mt-2">We hope you enjoy it!</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

function SetupScreen({ handleSetup, fakeName, setFakeName, isLoading }) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-2 text-center">Create Your Alias</h1>
                <p className="text-center text-gray-400 mb-6">This name is permanent and cannot be changed.</p>
                <form onSubmit={handleSetup}>
                    <input type="text" value={fakeName} onChange={(e) => setFakeName(e.target.value)} placeholder="Enter your unique alias" required className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />
                    <button type="submit" disabled={isLoading} className="w-full p-3 rounded bg-blue-600 font-bold hover:bg-blue-700 transition-colors flex justify-center items-center disabled:bg-blue-800">
                        {isLoading ? <Spinner /> : 'Save Alias'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function HomeScreen({ onlineCount, findChat, setView, isAdmin, handleLogout }) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
            <div className="absolute top-4 right-4">
                <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-600 text-sm font-bold hover:bg-red-700">Logout</button>
            </div>
            <h1 className="text-5xl font-bold mb-4">Welcome to StrangerHub!</h1>
            <p className="text-gray-400 mb-8 text-lg">There are currently {onlineCount} users online.</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={findChat} className="px-10 py-4 rounded-lg bg-blue-600 text-xl font-bold hover:bg-blue-700 transition-transform transform hover:scale-105">Find a Chat</button>
                <button onClick={() => setView('saved_chats')} className="px-10 py-4 rounded-lg bg-gray-600 text-xl font-bold hover:bg-gray-700 transition-transform transform hover:scale-105">Saved Chats</button>
                <button onClick={() => setView('about')} className="px-10 py-4 rounded-lg bg-teal-600 text-xl font-bold hover:bg-teal-700 transition-transform transform hover:scale-105">About & Rules</button>
                {isAdmin && (
                    <button onClick={() => setView('admin')} className="px-10 py-4 rounded-lg bg-purple-600 text-xl font-bold hover:bg-purple-700 transition-transform transform hover:scale-105">Admin</button>
                )}
            </div>
        </div>
    );
}

function ChatScreen({ partnerInfo, isPersistentChat, chatMessages, chatEndRef, currentMessage, handleMessageChange, handleSendMessage, handleSkip, connectRequestSent, connectRequestReceived, handleConnect, handleAcceptConnect, isPartnerTyping }) {
    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col p-0 sm:p-4">
            <div className="bg-gray-800 rounded-lg shadow-lg w-full h-full flex flex-col">
                <div className="text-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Chatting with <span className="text-blue-400">{partnerInfo?.fake_name || 'a stranger'}</span></h2>
                    {!isPersistentChat && (
                        <p className="text-sm text-gray-400">{partnerInfo?.gender || 'N/A'} - ★ {partnerInfo?.averageRating.toFixed(1)} ({partnerInfo?.ratingCount} ratings)</p>
                    )}
                </div>
                <div className="flex-grow overflow-y-auto p-4 bg-gray-700">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl mb-2 ${msg.sender === 'me' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-600 rounded-bl-none'}`}>{msg.text}</div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="h-6 px-4 text-sm text-gray-400 italic">
                    {isPartnerTyping && `${partnerInfo?.fake_name || 'Stranger'} is typing...`}
                </div>
                <div className="p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input type="text" value={currentMessage} onChange={handleMessageChange} placeholder="Type a message..." className="flex-grow p-3 rounded-full bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-5" />
                        <button type="submit" className="p-3 w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 font-bold hover:bg-blue-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                        </button>
                    </form>
                    <div className="mt-4 flex gap-2">
                        <button onClick={handleSkip} className="flex-grow p-2 rounded-lg bg-yellow-600 font-bold hover:bg-yellow-700 transition-colors">{isPersistentChat ? 'Back to Home' : 'End Chat'}</button>
                        {!isPersistentChat && !connectRequestSent && !connectRequestReceived && (
                            <button onClick={handleConnect} className="flex-grow p-2 rounded-lg bg-green-600 font-bold hover:bg-green-700 transition-colors">Connect</button>
                        )}
                    </div>
                    {!isPersistentChat && connectRequestSent && <p className="mt-2 text-center text-gray-400">Connection request sent...</p>}
                    {!isPersistentChat && connectRequestReceived && (
                        <div className="mt-4 text-center bg-gray-700 p-3 rounded-lg">
                            <p className="font-semibold">Stranger wants to connect!</p>
                            <button onClick={handleAcceptConnect} className="mt-2 w-full p-2 rounded bg-green-600 font-bold hover:bg-green-700 transition-colors">Accept</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function WaitingScreen({ onlineCount, setView }) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
            <button onClick={() => setView('home')} className="absolute top-4 left-4 text-blue-400 hover:underline">&larr; Back to Home</button>
            <h1 className="text-3xl font-bold mb-4 animate-pulse">Waiting for another user...</h1>
            <p className="text-gray-400">Online Users: {onlineCount}</p>
        </div>
    );
}

function RateChatScreen({ handleRateSubmit, rating, setRating, review, setReview, handleBlock, handleReport }) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
                <h1 className="text-3xl font-bold mb-4">Chat Over!</h1>
                <p className="text-gray-400 mb-6">How was your conversation?</p>
                <form onSubmit={handleRateSubmit}>
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button type="button" key={star} onClick={() => setRating(star)} className={`text-4xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'}`}>
                                ★
                            </button>
                        ))}
                    </div>
                    <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Leave an optional review..." className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-24 resize-none" />
                    <button type="submit" className="w-full p-3 rounded bg-blue-600 font-bold hover:bg-blue-700 transition-colors">
                        Submit and Go Home
                    </button>
                </form>
                <div className="mt-4 border-t border-gray-700 pt-4 flex flex-col gap-2">
                    <button type="button" onClick={handleBlock} className="w-full p-3 rounded bg-orange-700 font-bold hover:bg-orange-800 transition-colors">
                        Block User and Go Home
                    </button>
                    <button type="button" onClick={handleReport} className="w-full p-3 rounded bg-red-700 font-bold hover:bg-red-800 transition-colors">
                        Report User and Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}

function SavedChatsScreen({ setView, openPersistentChat }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // This logic is now self-contained within the component
    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error("Not authenticated");
                }
                
                const { data } = await api.get('/chats', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const formattedChats = data.map((chat) => ({
                    id: chat.id,
                    partnerName: chat.participants[0]?.fake_name || 'A Stranger',
                }));
                setChats(formattedChats);
                setError('');
            } catch (err) {
                setError('Failed to load your chats.');
                toast.error('Failed to load chats.');
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const handleDeleteChat = async (chatId) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p>Delete this chat permanently?</p>
                <div className="flex gap-2">
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            // The fetchChats function is not available here, so we will reload the page
                            // This is a simple and effective way to refresh the data
                            window.location.reload(); 
                        }}
                    >
                        Confirm
                    </button>
                    <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded" onClick={() => toast.dismiss(t.id)}>Cancel</button>
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 pt-8">
            <div className="w-full max-w-lg mx-auto">
                <button onClick={() => setView('home')} className="mb-4 text-blue-400 hover:underline">&larr; Back to Home</button>
                <h1 className="text-4xl font-bold mb-6">Your Saved Chats</h1>
                <div className="bg-gray-800 rounded-lg shadow-lg">
                    {loading && <p className="p-4 text-center text-gray-400">Loading...</p>}
                    {error && <p className="p-4 text-center text-red-400">{error}</p>}
                    {!loading && !error && chats.length === 0 && (<p className="p-4 text-center text-gray-400">You have no saved chats yet.</p>)}
                    {!loading && !error && (
                        <ul className="divide-y divide-gray-700">
                            {chats.map((chat) => (
                                <li key={chat.id} className="p-4 hover:bg-gray-700 transition-colors flex justify-between items-center group">
                                    <div onClick={() => openPersistentChat(chat.id, chat.partnerName)} className="cursor-pointer flex-grow">
                                        Chat with <span className="font-bold text-blue-400">{chat.partnerName}</span>
                                    </div>
                                    <button onClick={() => handleDeleteChat(chat.id)} className="ml-4 p-2 rounded-full bg-red-800 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function AdminDashboardScreen({ setView }) {
    const [adminView, setAdminView] = useState('reports');
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [userChats, setUserChats] = useState([]);
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [newUser, setNewUser] = useState({ enrollment_no: '', name: '', email: '', phone_no: '', gender: '' });
    const [registerMessage, setRegisterMessage] = useState('');
    const [modal, setModal] = useState({ type: null, data: null });
    const [freezeDuration, setFreezeDuration] = useState(7);
    const [messageContent, setMessageContent] = useState('');

    const fetchData = async (type) => {
        setSelectedItem(null);
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await api.get(`/admin/${type}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (type === 'reports') setReports(data);
            if (type === 'users') setUsers(data);
        } catch (error) {
            console.error(`Failed to fetch ${type}`, error);
            toast.error(`Failed to fetch ${type}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(adminView);
    }, [adminView]);

    const handleBanUser = async (userId, fakeName) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p>Ban <b>{fakeName}</b> permanently?</p>
                <div className="flex gap-2">
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const token = localStorage.getItem('authToken');
                            await toast.promise(
                                api.post('/admin/ban', { userId }, { headers: { Authorization: `Bearer ${token}` } }),
                                {
                                    loading: 'Banning user...',
                                    success: `${fakeName} has been banned.`,
                                    error: 'Failed to ban user.',
                                }
                            );
                            setSelectedItem(null);
                            fetchData(adminView);
                        }}
                    >
                        Confirm
                    </button>
                    <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded" onClick={() => toast.dismiss(t.id)}>Cancel</button>
                </div>
            </div>
        ), { duration: 10000 });
    };

    const handleDeleteLog = async (reportId) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p>Delete this log permanently?</p>
                <div className="flex gap-2">
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const token = localStorage.getItem('authToken');
                            await toast.promise(
                                api.delete(`/admin/reports/${reportId}`, { headers: { Authorization: `Bearer ${token}` } }),
                                {
                                    loading: 'Deleting log...',
                                    success: 'Log has been deleted.',
                                    error: 'Failed to delete log.',
                                }
                            );
                            fetchData('reports');
                        }}
                    >
                        Confirm
                    </button>
                    <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded" onClick={() => toast.dismiss(t.id)}>Cancel</button>
                </div>
            </div>
        ), { duration: 10000 });
    };

    const handleFreezeUser = async (e) => {
        e.preventDefault();
        const { userId, fakeName } = modal.data;
        const token = localStorage.getItem('authToken');
        await toast.promise(
            api.post('/admin/freeze', { userId, durationInDays: freezeDuration }, { headers: { Authorization: `Bearer ${token}` } }),
            {
                loading: 'Updating freeze status...',
                success: `Freeze status updated for ${fakeName}.`,
                error: 'Failed to update status.',
            }
        );
        setModal({ type: null, data: null });
        fetchData('users');
    };

    const handleSendMessageToUser = async (e) => {
        e.preventDefault();
        const { userId, fakeName } = modal.data;
        const token = localStorage.getItem('authToken');
        await toast.promise(
            api.post('/admin/message', { targetUserId: userId, content: messageContent }, { headers: { Authorization: `Bearer ${token}` } }),
            {
                loading: `Sending message to ${fakeName}...`,
                success: `Message sent.`,
                error: 'Failed to send message.',
            }
        );
        setMessageContent('');
        setModal({ type: null, data: null });
    };

    const handleRegisterUser = async (e) => {
        e.preventDefault();
        setRegisterMessage('Registering...');
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await api.post('/admin/register', newUser, { headers: { Authorization: `Bearer ${token}` } });
            setRegisterMessage(data.message);
            toast.success(data.message);
            setNewUser({ enrollment_no: '', name: '', email: '', phone_no: '', gender: '' });
            fetchData('users');
        } catch (error) {
            const err = error.response?.data?.error || 'Registration failed.';
            setRegisterMessage(err);
            toast.error(err);
        }
    };

    const handleViewUserChats = async (user) => {
        setSelectedItem(user);
        setUserChats([]);
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await api.get(`/admin/chats/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
            setUserChats(data);
        } catch (error) {
            console.error("Failed to fetch user chats", error);
            toast.error("Failed to fetch user chats");
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setUploadMessage('Please select a file first.');
            return;
        }
        const formData = new FormData();
        formData.append('userFile', file);
        try {
            const token = localStorage.getItem('authToken');
            setUploadMessage('Uploading...');
            const { data } = await api.post('/admin/users/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            setUploadMessage(data.message);
            toast.success(data.message);
            fetchData('users');
        } catch (error) {
            const err = error.response?.data?.error || 'File upload failed.';
            setUploadMessage(err);
            toast.error(err);
        }
    };

    if (selectedItem) {
        return (
            <div className="bg-gray-900 text-white min-h-screen p-4 pt-8">
                <div className="w-full max-w-2xl mx-auto">
                    <button onClick={() => setSelectedItem(null)} className="mb-4 text-blue-400 hover:underline">&larr; Back to List</button>
                    {adminView === 'reports' ? (
                        <>
                            <h1 className="text-3xl font-bold mb-4">Report Details</h1>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p><strong>Reporter:</strong> {selectedItem.reporter?.fake_name || 'System'}</p>
                                <p><strong>Reported User:</strong> {selectedItem.reported?.fake_name || 'N/A'}</p>
                                <p><strong>Reason:</strong> {selectedItem.reason || 'N/A'}</p>
                                <p><strong>Type:</strong> {selectedItem.logType}</p>
                                <p><strong>Date:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</p>
                                <h2 className="text-xl font-bold mt-4 mb-2">Chat History</h2>
                                <div className="bg-gray-700 p-3 rounded h-80 overflow-y-auto">
                                    {Array.isArray(selectedItem.chatHistory) && selectedItem.chatHistory.map((msg, i) => (
                                        <p key={i} className="mb-1"><strong>{msg.sender}:</strong> {msg.text}</p>
                                    ))}
                                </div>
                                {selectedItem.reported && (
                                    <button onClick={() => handleBanUser(selectedItem.reportedId, selectedItem.reported.fake_name)} className="w-full mt-4 p-3 rounded bg-red-700 font-bold hover:bg-red-800">
                                        Ban {selectedItem.reported.fake_name}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold mb-4">User Details</h1>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p><strong>Username:</strong> {selectedItem.fake_name}</p>
                                <p><strong>Full Name:</strong> {selectedItem.name}</p>
                                <p><strong>Enrollment No:</strong> {selectedItem.enrollment_no}</p>
                                <p><strong>Status:</strong> {selectedItem.status}</p>
                                <h2 className="text-xl font-bold mt-4 mb-2">Friend List ({userChats.length})</h2>
                                <div className="bg-gray-700 p-3 rounded h-48 overflow-y-auto">
                                    {userChats.length > 0 ? (
                                        <ul>{userChats.map(chat => <li key={chat.id}>{chat.participants[0]?.fake_name}</li>)}</ul>
                                    ) : <p>No saved chats.</p>}
                                </div>
                                <button onClick={() => handleBanUser(selectedItem.id, selectedItem.fake_name)} className="w-full mt-4 p-3 rounded bg-red-700 font-bold hover:bg-red-800">
                                    Ban {selectedItem.fake_name}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 pt-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <div>
                        <button onClick={() => fetchData(adminView)} className="mr-4 px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">Refresh Data</button>
                        <button onClick={() => setView('home')} className="text-blue-400 hover:underline">Back to Home &rarr;</button>
                    </div>
                </div>

                <div className="flex border-b border-gray-700 mb-4">
                    <button onClick={() => setAdminView('reports')} className={`py-2 px-4 ${adminView === 'reports' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Reports & Logs</button>
                    <button onClick={() => setAdminView('users')} className={`py-2 px-4 ${adminView === 'users' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Users</button>
                </div>

                {loading && <p>Loading...</p>}

                {adminView === 'reports' && !loading && (
                    <div className="bg-gray-800 rounded-lg shadow-lg">
                        <ul className="divide-y divide-gray-700">
                            {reports.map(report => (
                                <li key={report.id} className="p-4 hover:bg-gray-700">
                                    <div className="flex justify-between items-center">
                                        <div onClick={() => setSelectedItem(report)} className="flex-grow cursor-pointer">
                                            <p><strong>{report.reporter?.fake_name || 'System'}</strong> &rarr; <strong>{report.reported?.fake_name || 'N/A'}</strong></p>
                                            <p className="text-sm text-gray-400">{report.reason || 'No review given.'}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div>
                                                <p className={`text-sm font-bold ${report.logType === 'USER_REPORT' ? 'text-yellow-400' : 'text-gray-500'}`}>{report.logType}</p>
                                                <p className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <button onClick={() => handleDeleteLog(report.id)} className="p-2 rounded-full bg-red-800 hover:bg-red-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {adminView === 'users' && !loading && (
                    <div>
                        <div className="bg-gray-800 p-4 rounded-lg mb-6">
                            <h2 className="text-xl font-bold mb-2">Upload User Data (.xlsx)</h2>
                            <form onSubmit={handleFileUpload} className="flex gap-4 items-center">
                                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".xlsx, .xls" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                <button type="submit" className="px-4 py-2 rounded bg-blue-600 font-bold hover:bg-blue-700">Upload</button>
                            </form>
                            {uploadMessage && <p className="mt-2 text-sm">{uploadMessage}</p>}
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg mb-6">
                            <h2 className="text-xl font-bold mb-4">Register New User</h2>
                            <form onSubmit={handleRegisterUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input value={newUser.enrollment_no} onChange={e => setNewUser({ ...newUser, enrollment_no: e.target.value })} placeholder="Enrollment No" className="p-2 bg-gray-700 rounded" required />
                                <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Full Name" className="p-2 bg-gray-700 rounded" required />
                                <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" type="email" className="p-2 bg-gray-700 rounded" required />
                                <input value={newUser.phone_no} onChange={e => setNewUser({ ...newUser, phone_no: e.target.value })} placeholder="Phone No" className="p-2 bg-gray-700 rounded" required />
                                <input value={newUser.gender} onChange={e => setNewUser({ ...newUser, gender: e.target.value })} placeholder="Gender" className="p-2 bg-gray-700 rounded" required />
                                <button type="submit" className="p-2 rounded bg-green-600 font-bold hover:bg-green-700">Register User</button>
                            </form>
                            {registerMessage && <p className="mt-2 text-sm">{registerMessage}</p>}
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Full Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium">{user.name}</div>
                                                <div className="text-xs text-gray-400">{user.enrollment_no}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user.fake_name || 'Not Set'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'BANNED' ? 'bg-red-900 text-red-300' :
                                                        user.status === 'FROZEN' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                ★ {user.averageRating.toFixed(1)} ({user.ratingCount})
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                                                <button onClick={() => handleViewUserChats(user)} className="text-indigo-400 hover:text-indigo-600">View</button>
                                                <button onClick={() => setModal({ type: 'freeze', data: { userId: user.id, fakeName: user.fake_name || user.name } })} className="text-blue-400 hover:text-blue-600">Freeze/Unfreeze</button>
                                                <button onClick={() => setModal({ type: 'message', data: { userId: user.id, fakeName: user.fake_name || user.name } })} className="text-green-400 hover:text-green-600">Message</button>
                                                <button onClick={() => handleBanUser(user.id, user.fake_name || user.name)} className="text-red-400 hover:text-red-600">Ban</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={modal.type === 'freeze'} onClose={() => setModal({ type: null, data: null })}>
                <h2 className="text-2xl font-bold mb-4">Freeze User</h2>
                <p className="mb-4">Select the duration to freeze <b>{modal.data?.fakeName}</b>.</p>
                <form onSubmit={handleFreezeUser}>
                    <select value={freezeDuration} onChange={e => setFreezeDuration(e.target.value)} className="w-full p-2 bg-gray-700 rounded mb-4">
                        <option value="7">7 Days</option>
                        <option value="30">1 Month</option>
                        <option value="90">3 Months</option>
                    </select>
                    <button type="submit" className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 font-bold">Confirm Freeze</button>
                </form>
            </Modal>

            <Modal isOpen={modal.type === 'message'} onClose={() => setModal({ type: null, data: null })}>
                <h2 className="text-2xl font-bold mb-4">Message User</h2>
                <p className="mb-4">Send a direct message to <b>{modal.data?.fakeName}</b>.</p>
                <form onSubmit={handleSendMessageToUser}>
                    <textarea value={messageContent} onChange={e => setMessageContent(e.target.value)} required className="w-full p-2 bg-gray-700 rounded mb-4 h-32 resize-none" placeholder="Your message..."></textarea>
                    <button type="submit" className="w-full p-2 rounded bg-green-600 hover:bg-green-700 font-bold">Send Message</button>
                </form>
            </Modal>
        </div>
    );
}


function App() {
    const [enrollmentNo, setEnrollmentNo] = useState('');
    const [otp, setOtp] = useState('');
    const [fakeName, setFakeName] = useState('');
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [view, setView] = useState('loading');
    const [message, setMessage] = useState('');
    const [onlineCount, setOnlineCount] = useState(0);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [partnerInfo, setPartnerInfo] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [isPersistentChat, setIsPersistentChat] = useState(false);
    const [connectRequestSent, setConnectRequestSent] = useState(false);
    const [connectRequestReceived, setConnectRequestReceived] = useState(false);
    const [lastPartnerId, setLastPartnerId] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [lastChatHistory, setLastChatHistory] = useState([]);
    const [loginUserInfo, setLoginUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const { data } = await api.get('/auth/me');
                    if (data.status === 'FROZEN') {
                        setUserInfo(data);
                        setView('frozen');
                        return;
                    }
                    setUserId(data.id);
                    setIsAdmin(data.isAdmin);
                    setUserInfo(data);
                    connectSocket(token);
                    if (data.fake_name) {
                        setView('home');
                    } else {
                        setView('setup');
                    }
                } catch (error) {
                    localStorage.removeItem('authToken');
                    delete api.defaults.headers.common['Authorization'];
                    setView('login');
                }
            } else {
                setView('login');
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const resetChatState = () => {
        setChatMessages([]);
        setCurrentMessage('');
        setPartnerInfo(null);
        setRoomId(null);
        setIsPersistentChat(false);
        setConnectRequestSent(false);
        setConnectRequestReceived(false);
        setLastChatHistory([]);
        setIsPartnerTyping(false);
    };

    const setupSocketListeners = (socket) => {
        socket.on('update_online_count', setOnlineCount);
        socket.on('chat_started', ({ roomId, partner }) => {
            setRoomId(roomId);
            setPartnerInfo(partner);
            setIsPersistentChat(false);
            setView('in_chat');
        });
        socket.on('new_message', (message) => {
            const messageData = { text: message, sender: 'partner' };
            setChatMessages((prev) => [...prev, messageData]);
            if (!isPersistentChat) {
                setLastChatHistory((prev) => [...prev, messageData]);
            }
        });
        socket.on('chat_ended', ({ partnerId }) => {
            const historyToSave = [...lastChatHistory];
            resetChatState();
            if (partnerId) {
                setLastPartnerId(partnerId);
                setLastChatHistory(historyToSave);
                setView('rate_chat');
                toast('Your chat has ended.');
            } else {
                setView('home');
            }
        });
        socket.on('receive_connect_request', () => setConnectRequestReceived(true));
        socket.on('connect_success', (successMessage) => {
            toast.success(successMessage);
            setConnectRequestSent(false);
            setConnectRequestReceived(false);
        });
        socket.on('partner_started_typing', () => setIsPartnerTyping(true));
        socket.on('partner_stopped_typing', () => setIsPartnerTyping(false));
    };

    const connectSocket = (token) => {
        if (socketRef.current) socketRef.current.disconnect();
        const newSocket = io(SOCKET_URL, { auth: { token } });
        setupSocketListeners(newSocket);
        socketRef.current = newSocket;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const { data } = await api.post('/auth/login', { enrollment_no: enrollmentNo });
            setLoginUserInfo(data.user);
            setView('otp');
            toast.success('OTP sent to your email!');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred.';
            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const { data } = await api.post('/auth/verify', { enrollment_no: enrollmentNo, otp });
            const token = data.token;
            localStorage.setItem('authToken', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            if (data.user.status === 'FROZEN') {
                setUserInfo(data.user);
                setView('frozen');
                return;
            }

            setUserId(data.user.id);
            setIsAdmin(data.user.isAdmin);
            setUserInfo(data.user);
            connectSocket(token);

            if (data.user.fake_name) {
                setView('home');
            } else {
                setView('setup');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred.';
            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        if (socketRef.current) socketRef.current.disconnect();
        setUserId(null);
        setIsAdmin(false);
        setView('login');
        setMessage('');
        setEnrollmentNo('');
        setOtp('');
    };

    const openPersistentChat = async (chatId, partnerName) => {
        const token = localStorage.getItem('authToken');
        try {
            const { data } = await api.get(`/chats/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const formattedMessages = data.map(msg => ({
                text: msg.content,
                sender: msg.sender_id === userId ? 'me' : 'partner'
            }));
            setChatMessages(formattedMessages);
            setRoomId(chatId);
            setPartnerInfo({ fake_name: partnerName });
            setIsPersistentChat(true);
            socketRef.current.emit('join_persistent_room', chatId);
            setView('in_chat');
        } catch (error) {
            toast.error('Could not open chat.');
        }
    };

    const handleSetup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            await api.post('/auth/setup-profile', { fake_name: fakeName }, { headers: { Authorization: `Bearer ${token}` } });
            setView('home');
            toast.success('Alias saved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const findChat = () => {
        setLastChatHistory([]);
        socketRef.current.emit('find_chat', userId);
        setView('waiting');
    };

    const handleMessageChange = (e) => {
        setCurrentMessage(e.target.value);
        if (socketRef.current && roomId) {
            if (!isTyping) {
                setIsTyping(true);
                socketRef.current.emit('start_typing', { roomId });
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
                socketRef.current.emit('stop_typing', { roomId });
            }, 2000);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (currentMessage.trim()) {
            const messageData = { text: currentMessage, sender: 'me' };
            socketRef.current.emit('send_message', {
                roomId,
                message: currentMessage,
                persistent: isPersistentChat
            });
            setChatMessages((prev) => [...prev, messageData]);
            if (!isPersistentChat) {
                setLastChatHistory((prev) => [...prev, messageData]);
            }
            setCurrentMessage('');

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (isTyping) {
                setIsTyping(false);
                socketRef.current.emit('stop_typing', { roomId });
            }
        }
    };

    const handleSkip = () => {
        if (isPersistentChat) {
            resetChatState();
            setView('saved_chats');
        } else {
            socketRef.current.emit('leave_chat', roomId);
        }
    };

    const handleRateSubmit = async (e) => {
        e.preventDefault();
        if (lastPartnerId && (rating > 0 || review.trim() !== '')) {
            try {
                const token = localStorage.getItem('authToken');
                await api.post('/ratings',
                    { score: rating > 0 ? rating : null, rateeId: lastPartnerId, review: review },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Rating submitted!");
            } catch (error) {
                console.error("Failed to submit rating", error);
                toast.error("Failed to submit rating.");
            }
        }
        setRating(0);
        setReview('');
        setLastPartnerId(null);
        setLastChatHistory([]);
        setView('home');
    };

    const handleBlock = async () => {
        if (!lastPartnerId) {
            setView('home');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            await api.post('/users/block',
                { blockedId: lastPartnerId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('User has been blocked.');
        } catch (error) {
            toast.error('Failed to block user.');
        } finally {
            setRating(0);
            setReview('');
            setLastPartnerId(null);
            setLastChatHistory([]);
            setView('home');
        }
    };

    const handleReport = async () => {
        if (!lastPartnerId) {
            setView('home');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const formattedHistory = lastChatHistory.map(msg => ({ sender: msg.sender, text: msg.text }));
            await api.post('/reports',
                { reportedId: lastPartnerId, chatHistory: formattedHistory, reason: review },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Report has been submitted for review.');
        } catch (error) {
            toast.error('Failed to submit report.');
        } finally {
            setRating(0);
            setReview('');
            setLastPartnerId(null);
            setLastChatHistory([]);
            setView('home');
        }
    };

    const handleConnect = () => {
        socketRef.current.emit('send_connect_request', roomId);
        setConnectRequestSent(true);
    };

    const handleAcceptConnect = () => {
        socketRef.current.emit('accept_connect_request', roomId);
    };

    function SavedChatsScreenWrapper() {
        const [chats, setChats] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        const fetchChats = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const { data } = await api.get('/chats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formattedChats = data.map((chat) => ({
                    id: chat.id,
                    partnerName: chat.participants[0]?.fake_name || 'A Stranger',
                }));
                setChats(formattedChats);
                setError('');
            } catch (err) {
                setError('Failed to load your chats.');
                toast.error('Failed to load chats.');
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchChats();
        }, []);

        const handleDeleteChat = async (chatId) => {
            toast((t) => (
                <div className="flex flex-col gap-2">
                    <p>Delete this chat permanently?</p>
                    <div className="flex gap-2">
                        <button
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                try {
                                    await api.delete(`/chats/${chatId}`);
                                    toast.success('Chat deleted.');
                                    fetchChats();
                                } catch (err) {
                                    toast.error('Failed to delete chat.');
                                }
                            }}
                        >
                            Confirm
                        </button>
                        <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded" onClick={() => toast.dismiss(t.id)}>Cancel</button>
                    </div>
                </div>
            ));
        };

        return <SavedChatsScreen setView={setView} openPersistentChat={openPersistentChat} chats={chats} loading={loading} error={error} handleDeleteChat={handleDeleteChat} />;
    }

    if (view === 'loading') {
        return <div className="bg-gray-900 min-h-screen flex items-center justify-center"><h1 className="text-white text-3xl animate-pulse">Loading...</h1></div>;
    }

    const renderView = () => {
        switch (view) {
            case 'login':
                return <LoginScreen handleLogin={handleLogin} enrollmentNo={enrollmentNo} setEnrollmentNo={setEnrollmentNo} message={message} isLoading={isLoading} />;
            case 'otp':
                return <OtpScreen handleVerify={handleVerify} otp={otp} setOtp={setOtp} message={message} loginUserInfo={loginUserInfo} setView={setView} isLoading={isLoading} />;
            case 'frozen':
                return <FrozenScreen userInfo={userInfo} />;
            case 'setup':
                return <SetupScreen handleSetup={handleSetup} fakeName={fakeName} setFakeName={setFakeName} isLoading={isLoading} />;
            case 'home':
                return <HomeScreen onlineCount={onlineCount} findChat={findChat} setView={setView} isAdmin={isAdmin} handleLogout={handleLogout} />;
            case 'about':
                return <AboutScreen setView={setView} />;
            case 'admin':
                return <AdminDashboardScreen setView={setView} />;
            case 'saved_chats':
                return <SavedChatsScreenWrapper />;
            case 'rate_chat':
                return <RateChatScreen handleRateSubmit={handleRateSubmit} rating={rating} setRating={setRating} review={review} setReview={setReview} handleBlock={handleBlock} handleReport={handleReport} />;
            case 'waiting':
                return <WaitingScreen onlineCount={onlineCount} setView={setView} />;
            case 'in_chat':
                return <ChatScreen partnerInfo={partnerInfo} isPersistentChat={isPersistentChat} chatMessages={chatMessages} chatEndRef={chatEndRef} currentMessage={currentMessage} handleMessageChange={handleMessageChange} handleSendMessage={handleSendMessage} handleSkip={handleSkip} connectRequestSent={connectRequestSent} connectRequestReceived={connectRequestReceived} handleConnect={handleConnect} handleAcceptConnect={handleAcceptConnect} isPartnerTyping={isPartnerTyping} />;
            default:
                return <LoginScreen handleLogin={handleLogin} enrollmentNo={enrollmentNo} setEnrollmentNo={setEnrollmentNo} message={message} isLoading={isLoading} />;
        }
    };

    return (
        <>
            <Toaster position="top-center" toastOptions={{
                className: 'bg-gray-800 text-white',
                duration: 4000,
            }} />
            {renderView()}
        </>
    )
}

export default App;