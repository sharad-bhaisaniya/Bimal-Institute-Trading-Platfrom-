import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiSearch, FiCircle, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './AdminChat.module.scss';
import { chatService } from '../../../services/api/chat.service';

const AdminChat = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isUserTyping, setIsUserTyping] = useState(false);

    const chatEndRef = useRef(null);

    // Fetch conversations on component mount and set online status
    useEffect(() => {
        fetchConversations();
        // Set user as online
        chatService.updateOnlineStatus(true);
        
        // Handle visibility change - set offline when tab is hidden
        const handleVisibilityChange = () => {
            if (document.hidden) {
                chatService.updateOnlineStatus(false);
            } else {
                chatService.updateOnlineStatus(true);
                fetchConversations();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Poll for new messages every 3 seconds to get real-time online status
        const interval = setInterval(fetchConversations, 3000);
        
        // Cleanup: set user as offline when leaving
        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            chatService.updateOnlineStatus(false);
        };
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await chatService.getConversations();
            const conversationsData = res.data.data || [];
            setConversations(conversationsData);

            // Auto-select first conversation if none selected
            if (!selectedUserId && conversationsData.length > 0) {
                setSelectedUserId(conversationsData[0].user._id);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const res = await chatService.getMessages(userId);
            const messagesData = res.data.data.messages || [];
            const chatId = res.data.data.chatId;
            setMessages(messagesData);
            setCurrentChatId(chatId);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    // Fetch messages when selected user changes
    useEffect(() => {
        if (selectedUserId) {
            fetchMessages(selectedUserId);
            // Poll for new messages every 3 seconds when chat is open
            const interval = setInterval(() => fetchMessages(selectedUserId), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedUserId]);

    // Extract active user data object details
    const currentConversation = conversations.find(c => c.user._id === selectedUserId);
    const currentUser = currentConversation?.user;

    // Filter conversations via the top panel input search bar
    const filteredConversations = conversations.filter(c =>
        `${c.user.firstName} ${c.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Auto-scroll chat body view port down when switching targets or sending text notes
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedUserId, messages?.length]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedUserId) return;

        setIsSending(true);
        try {
            await chatService.sendMessage({
                recipientId: selectedUserId,
                text: inputValue
            });
            
            // Refresh messages and conversations
            await fetchMessages(selectedUserId);
            await fetchConversations();
            setInputValue('');
            toast.success('Message sent successfully');
        } catch (error) {
            toast.error('Failed to send message');
            console.error('Send message error:', error);
        } finally {
            setIsSending(false);
        }
    };

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
        if (msg.sender !== 'admin') return null;
        
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
    const getOnlineStatus = (conv) => {
        if (conv.isOnline) return 'Online';
        if (conv.lastSeen) {
            const lastSeen = new Date(conv.lastSeen);
            const now = new Date();
            const diffMins = Math.floor((now - lastSeen) / 60000);
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `Last seen ${diffMins} min ago`;
            if (diffMins < 1440) return `Last seen ${Math.floor(diffMins / 60)}h ago`;
            return `Last seen ${lastSeen.toLocaleDateString()}`;
        }
        return 'Offline';
    };

    if (isLoading) {
        return <div style={{ padding: '3rem', textAlign: 'center', color: '#4ade80' }}>Loading user chat profiles directory...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2>Customer Support Desk</h2>
                    <p>Real-time client inquiries and dynamic backend system logs.</p>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Left Column Sidebar: Live database entries */}
                <div className={styles.card}>
                    <h3>Conversations</h3>

                    <div className={styles.searchBox}>
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search active users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.customerList}>
                        {filteredConversations.map(conv => {
                            const isSelected = conv.user._id === selectedUserId;

                            return (
                                <div
                                    key={conv.id}
                                    className={`${styles.customerItem} ${isSelected ? styles.activeItem : ''}`}
                                    onClick={() => setSelectedUserId(conv.user._id)}
                                >
                                    <div className={styles.avatarWrapper}>
                                        <div className={styles.avatar}>
                                            {conv.user.firstName.charAt(0).toUpperCase()}
                                        </div>
                                        <FiCircle className={`${styles.onlineDot} ${conv.isOnline ? styles.online : styles.offline}`} />
                                        {conv.unreadCount > 0 && (
                                            <span className={styles.unreadBadge}>{conv.unreadCount}</span>
                                        )}
                                    </div>

                                    <div className={styles.itemContent}>
                                        <div className={styles.itemHeader}>
                                            <h4>{conv.user.firstName} {conv.user.lastName}</h4>
                                        </div>
                                        <p className={styles.lastMsgSnippet}>{conv.lastMessage}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredConversations.length === 0 && (
                            <div className={styles.emptyState}>No conversations found</div>
                        )}
                    </div>
                </div>

                {/* Right Column Workspace Area */}
                <div className={`${styles.card} ${styles.chatWorkspace}`}>
                    {currentUser ? (
                        <>
                            <div className={styles.chatTargetHeader}>
                                <div className={styles.targetMeta}>
                                    <h4>{currentUser.firstName} {currentUser.lastName}</h4>
                                    <span className={styles.emailText}>{currentUser.email}</span>
                                    <span className={styles.onlineStatus}>
                                        {currentConversation?.isOnline ? (
                                            <><FiCircle className={styles.onlineDotSmall} /> <span className={styles.onlineText}>Online</span></>
                                        ) : (
                                            <span className={styles.offlineText}>{getOnlineStatus(currentConversation)}</span>
                                        )}
                                    </span>
                                </div>
                                <span className={`${styles.statusBadge} ${currentUser.isActive ? styles.success : styles.neutral}`}>
                                    {currentUser.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>

                            <div className={styles.chatBody}>
                                {dateGroups.map(dateGroup => (
                                    <div key={dateGroup}>
                                        <div className={styles.dateHeader}>{dateGroup}</div>
                                        {groupedMessages[dateGroup].map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`${styles.messageRow} ${msg.sender === 'admin' ? styles.adminRow : styles.userRow}`}
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
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className={styles.chatInputArea}>
                                <input
                                    type="text"
                                    placeholder={`Send message to ${currentUser.firstName}...`}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={isSending}
                                />
                                <button type="submit" disabled={!inputValue.trim() || isSending}>
                                    <FiSend />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.noSelectScreen}>
                            <FiMessageSquare size={48} />
                            <p>Select a conversation to start messaging.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChat;