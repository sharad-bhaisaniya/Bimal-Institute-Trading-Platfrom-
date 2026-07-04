import api from './api';
import { endpoints } from './endpoints';

export const chatService = {
  // Get all conversations (Super Admin: all, User: only with admin)
  getConversations: () =>
    api.get(endpoints.chats.conversations),

  // Get messages between current user and specific user
  getMessages: (userId) =>
    api.get(endpoints.chats.messages(userId)),

  // Send a message
  sendMessage: (data) =>
    api.post(endpoints.chats.send, data),

  // Mark chat as read
  markAsRead: (chatId) =>
    api.put(endpoints.chats.markAsRead(chatId)),

  // Get Super Admin user info
  getSuperAdmin: () =>
    api.get(endpoints.chats.superAdmin),

  // Update online status
  updateOnlineStatus: (isOnline) =>
    api.put(endpoints.chats.updateOnlineStatus, { isOnline }),

  // Set typing status
  setTypingStatus: (recipientId, isTyping) =>
    api.post(endpoints.chats.setTypingStatus, { recipientId, isTyping }),
};
