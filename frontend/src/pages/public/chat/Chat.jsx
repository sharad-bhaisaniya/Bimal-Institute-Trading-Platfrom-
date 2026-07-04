import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiArrowLeft, FiCircle, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './Chat.module.scss';
import { chatService } from '../../../services/api/chat.service';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [superAdmin, setSuperAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const chatEndRef = useRef(null);

    // Helper function to format date for grouping
    const formatDateForGroup = (date) => {
        const msgDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (msgDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (msgDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(msg => {
            const dateKey = formatDateForGroup(msg.timestamp);
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(msg);
        });
        return groups;
    };

    const groupedMessages = groupMessagesByDate(messages);
    const dateGroups = Object.keys(groupedMessages).sort((a, b) => {
        // Sort: Today > Yesterday > older dates
        if (a === 'Today') return -1;
        if (b === 'Today') return 1;
        if (a === 'Yesterday') return -1;
        if (b === 'Yesterday') return 1;
        return new Date(b) - new Date(a);
    });

    // Render message status tick
    const renderMessageStatus = (msg) => {
        if (msg.sender !== 'user') return null;
        
        if (msg.status === 'read') {
            return (
                <span className={styles.readTick}>
                    <FiCheck /><FiCheck />
                </span>
            );
        } else if (msg.status === 'delivered') {
            return (
                <span className={styles.deliveredTick}>
                    <FiCheck /><FiCheck />
                </span>
            );
        } else {
            return <FiCheck className={styles.sentTick} />;
        }
    };

    // Format online status
    const getOnlineStatus = () => {
        if (superAdmin?.isOnline) return 'Online';
        if (superAdmin?.lastSeen) {
            const lastSeen = new Date(superAdmin.lastSeen);
            const now = new Date();
            const diffMins = Math.floor((now - lastSeen) / 60000);
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `Last seen ${diffMins} min ago`;
            if (diffMins < 1440) return `Last seen ${Math.floor(diffMins / 60)}h ago`;
            return `Last seen ${lastSeen.toLocaleDateString()}`;
        }
        return 'Offline';
    };

    // Fetch Super Admin info and messages on component mount and set online status
    useEffect(() => {
        fetchSuperAdmin();
        // Set user as online
        chatService.updateOnlineStatus(true);
        
        // Handle visibility change - set offline when tab is hidden
        const handleVisibilityChange = () => {
            if (document.hidden) {
                chatService.updateOnlineStatus(false);
            } else {
                chatService.updateOnlineStatus(true);
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Cleanup: set user as offline when leaving
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            chatService.updateOnlineStatus(false);
        };
    }, []);

    // Poll for messages when Super Admin is loaded
    useEffect(() => {
        if (superAdmin) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [superAdmin]);

    // Poll for Super Admin status updates
    useEffect(() => {
        const interval = setInterval(fetchSuperAdmin, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchSuperAdmin = async () => {
        try {
            const res = await chatService.getSuperAdmin();
            setSuperAdmin(res.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch Super Admin:', error);
            toast.error('Failed to load admin information');
            setIsLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!superAdmin) return;
        try {
            const res = await chatService.getMessages(superAdmin._id);
            const messagesData = res.data.data.messages || [];
            setMessages(messagesData);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAdminTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !superAdmin) return;

        setIsSending(true);
        try {
            await chatService.sendMessage({
                recipientId: superAdmin._id,
                text: inputValue
            });
            
            // Refresh messages
            await fetchMessages();
            setInputValue('');
            toast.success('Message sent to admin');
        } catch (error) {
            toast.error('Failed to send message');
            console.error('Send message error:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="user-page-container">
            <section className={styles.chatContainerSection}>
                <motion.div
                    className={styles.chatBox}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Chat Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.adminInfo}>
                            <div className={styles.avatarWrapper}>
                                <FiUser className={styles.avatarIcon} />
                                <FiCircle className={`${styles.statusDot} ${superAdmin?.isOnline ? styles.online : styles.offline}`} />
                            </div>
                            <div>
                                <h3>{superAdmin ? `${superAdmin.firstName} ${superAdmin.lastName}` : 'Admin Support'}</h3>
                                <span className={styles.statusText}>
                                    {superAdmin?.isOnline ? (
                                        <><FiCircle className={styles.onlineDotSmall} /> <span className={styles.onlineText}>Online</span></>
                                    ) : (
                                        <span className={styles.offlineText}>{getOnlineStatus()}</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages Body */}
                    <div className={styles.chatBody}>
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading chat...</div>
                        ) : messages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                <p>No messages yet. Start a conversation with the admin!</p>
                            </div>
                        ) : (
                            dateGroups.map(dateGroup => (
                                <div key={dateGroup}>
                                    <div className={styles.dateHeader}>{dateGroup}</div>
                                    {groupedMessages[dateGroup].map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`${styles.messageRow} ${msg.sender === 'user' ? styles.userRow : styles.adminRow}`}
                                        >
                                            <div className={styles.messageBubble}>
                                                <p>{msg.text}</p>
                                                <div className={styles.messageFooter}>
                                                    <span className={styles.timestamp}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </span>
                                                    {renderMessageStatus(msg)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}

                        {/* Admin Typing Indicator */}
                        <AnimatePresence>
                            {isAdminTyping && (
                                <motion.div
                                    className={`${styles.messageRow} ${styles.adminRow}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className={`${styles.messageBubble} ${styles.typingBubble}`}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input Field */}
                    <form onSubmit={handleSendMessage} className={styles.chatInputArea}>
                        <input
                            type="text"
                            placeholder="Type your message to the admin..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isSending || isLoading}
                        />
                        <button type="submit" disabled={!inputValue.trim() || isSending || isLoading}>
                            <FiSend />
                        </button>
                    </form>
                </motion.div>
            </section>
        </div>
    );
};

export default Chat;