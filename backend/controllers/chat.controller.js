const Chat = require('../models/Chat');
const User = require('../models/User');
const Role = require('../models/Role');
const Notification = require('../models/Notification');
const UserNotification = require('../models/UserNotification');

// Helper: Check if user is Super Admin
const isSuperAdmin = async (userId) => {
  const user = await User.findById(userId).populate('role');
  if (!user || !user.role) return false;
  return user.role.name === 'Super Admin';
};

// Helper: Find or create chat between two users
const findOrCreateChat = async (user1Id, user2Id) => {
  let chat = await Chat.findOne({
    participants: { $all: [user1Id, user2Id] },
    isDeleted: false
  }).populate('participants', 'firstName lastName email profileImage isActive');

  if (!chat) {
    chat = new Chat({
      participants: [user1Id, user2Id],
      messages: [],
      unreadBy: [user2Id]
    });
    await chat.save();
    await chat.populate('participants', 'firstName lastName email profileImage isActive');
  }

  return chat;
};

// GET /chats/conversations — Get all conversations (Super Admin: all, User: only with admin)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const superAdmin = await isSuperAdmin(userId);

    let chats;
    if (superAdmin) {
      // Super Admin sees all conversations
      chats = await Chat.find({
        isDeleted: false,
        participants: { $size: 2 } // Only direct chats
      })
        .populate('participants', 'firstName lastName email profileImage isActive isOnline lastSeen')
        .sort({ lastMessageAt: -1 });
    } else {
      // Regular users only see their chat with Super Admin
      // Find Super Admin user
      const superAdminRole = await Role.findOne({ name: 'Super Admin' });
      if (!superAdminRole) {
        return res.status(404).json({ message: 'Super Admin role not found' });
      }

      const superAdminUser = await User.findOne({ role: superAdminRole._id });
      if (!superAdminUser) {
        return res.status(404).json({ message: 'Super Admin user not found' });
      }

      chats = await Chat.find({
        isDeleted: false,
        participants: { $all: [userId, superAdminUser._id] }
      })
        .populate('participants', 'firstName lastName email profileImage isActive isOnline lastSeen')
        .sort({ lastMessageAt: -1 });
    }

    // Format response for frontend
    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p._id.toString() !== userId.toString());
      const lastMessage = chat.messages[chat.messages.length - 1];
      const unreadCount = chat.unreadBy.includes(userId) ? 
        chat.messages.filter(m => m.sender.toString() !== userId.toString() && !m.isRead).length : 0;

      return {
        id: chat._id,
        user: otherParticipant,
        lastMessage: lastMessage ? lastMessage.text : 'No messages yet',
        lastMessageTime: chat.lastMessageAt,
        unreadCount,
        isActive: otherParticipant?.isActive || true,
        isOnline: otherParticipant?.isOnline || false,
        lastSeen: otherParticipant?.lastSeen
      };
    });

    res.status(200).json({ data: formattedChats });
  } catch (error) {
    console.error('getConversations error:', error);
    res.status(500).json({ message: 'Failed to fetch conversations', error: error.message });
  }
};

// GET /chats/:userId/messages — Get messages between current user and specific user
exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    const chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
      isDeleted: false
    }).populate('messages.sender', 'firstName lastName');

    if (!chat) {
      // Return empty array if no chat exists yet
      return res.status(200).json({ data: { messages: [], chatId: null } });
    }

    // Mark messages as delivered and read for current user
    const now = new Date();
    chat.messages.forEach(msg => {
      // Mark as delivered if recipient is fetching messages
      if (msg.sender.toString() !== currentUserId.toString() && msg.status === 'sent') {
        msg.status = 'delivered';
        msg.deliveredAt = now;
      }
      // Mark as read if unread
      if (msg.sender.toString() !== currentUserId.toString() && !msg.isRead) {
        msg.isRead = true;
        msg.status = 'read';
        msg.readAt = now;
      }
    });
    chat.unreadBy = chat.unreadBy.filter(id => id.toString() !== currentUserId.toString());
    await chat.save();

    const formattedMessages = chat.messages.map(msg => ({
      id: msg._id,
      text: msg.text,
      sender: msg.sender._id.toString() === currentUserId.toString() ? 'user' : 'admin',
      senderId: msg.sender._id,
      senderName: msg.sender.firstName,
      timestamp: msg.timestamp,
      isRead: msg.isRead,
      status: msg.status,
      deliveredAt: msg.deliveredAt,
      readAt: msg.readAt
    }));

    const isOtherTyping = chat.typingBy.includes(currentUserId) ? false : chat.typingBy.length > 0;

    res.status(200).json({ data: { messages: formattedMessages, chatId: chat._id, isTyping: isOtherTyping } });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

// POST /chats/send — Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, text } = req.body;
    const senderId = req.user._id;

    if (!recipientId || !text) {
      return res.status(400).json({ message: 'Recipient ID and message text are required' });
    }

    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
      isDeleted: false
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, recipientId],
        messages: [],
        unreadBy: [recipientId]
      });
    }

    // Add new message
    const newMessage = {
      sender: senderId,
      text,
      timestamp: new Date(),
      isRead: false
    };

    chat.messages.push(newMessage);
    chat.lastMessageAt = new Date();
    
    // Add recipient to unread if not already there
    if (!chat.unreadBy.includes(recipientId)) {
      chat.unreadBy.push(recipientId);
    }

    await chat.save();

    // Create notification for recipient
    const sender = await User.findById(senderId, 'firstName lastName');
    const notification = new Notification({
      title: 'New Message',
      message: `${sender.firstName} ${sender.lastName}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      type: 'chat',
      targetType: 'specific',
      targetUsers: [recipientId],
      createdBy: senderId,
      metadata: {
        chatId: chat._id,
        senderId,
        recipientId
      }
    });
    await notification.save();

    // Create user notification record
    const userNotification = new UserNotification({
      notificationId: notification._id,
      userId: recipientId,
      isRead: false,
      isDeleted: false
    });
    await userNotification.save();

    // Populate and return
    await chat.populate('messages.sender', 'firstName lastName');
    const populatedMessage = chat.messages[chat.messages.length - 1];

    res.status(201).json({
      message: 'Message sent successfully',
      data: {
        id: populatedMessage._id,
        text: populatedMessage.text,
        sender: populatedMessage.sender._id.toString() === senderId.toString() ? 'user' : 'admin',
        senderId: populatedMessage.sender._id,
        senderName: populatedMessage.sender.firstName,
        timestamp: populatedMessage.timestamp,
        isRead: populatedMessage.isRead,
        status: populatedMessage.status,
        deliveredAt: populatedMessage.deliveredAt,
        readAt: populatedMessage.readAt
      }
    });
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// PUT /chats/:chatId/read — Mark chat as read
exports.markChatAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all messages from other participants as read
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== userId.toString()) {
        msg.isRead = true;
      }
    });

    // Remove user from unreadBy
    chat.unreadBy = chat.unreadBy.filter(id => id.toString() !== userId.toString());
    await chat.save();

    res.status(200).json({ message: 'Chat marked as read' });
  } catch (error) {
    console.error('markChatAsRead error:', error);
    res.status(500).json({ message: 'Failed to mark chat as read', error: error.message });
  }
};

// GET /chats/super-admin — Get Super Admin user info
exports.getSuperAdmin = async (req, res) => {
  try {
    const superAdminRole = await Role.findOne({ name: 'Super Admin' });
    if (!superAdminRole) {
      return res.status(404).json({ message: 'Super Admin role not found' });
    }

    const superAdminUser = await User.findOne({ role: superAdminRole._id }, 'firstName lastName email profileImage isActive isOnline lastSeen');
    if (!superAdminUser) {
      return res.status(404).json({ message: 'Super Admin user not found' });
    }

    res.status(200).json({ data: superAdminUser });
  } catch (error) {
    console.error('getSuperAdmin error:', error);
    res.status(500).json({ message: 'Failed to fetch Super Admin', error: error.message });
  }
};

// PUT /chats/online — Update user online status
exports.updateOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    const userId = req.user._id;

    const updateData = { isOnline };
    if (!isOnline) {
      updateData.lastSeen = new Date();
    }

    await User.findByIdAndUpdate(userId, updateData);

    res.status(200).json({ message: 'Online status updated' });
  } catch (error) {
    console.error('updateOnlineStatus error:', error);
    res.status(500).json({ message: 'Failed to update online status', error: error.message });
  }
};

// POST /chats/typing — Set typing status
exports.setTypingStatus = async (req, res) => {
  try {
    const { recipientId, isTyping } = req.body;
    const senderId = req.user._id;

    const chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
      isDeleted: false
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (isTyping) {
      if (!chat.typingBy.includes(senderId)) {
        chat.typingBy.push(senderId);
      }
    } else {
      chat.typingBy = chat.typingBy.filter(id => id.toString() !== senderId.toString());
    }

    await chat.save();

    res.status(200).json({ message: 'Typing status updated' });
  } catch (error) {
    console.error('setTypingStatus error:', error);
    res.status(500).json({ message: 'Failed to update typing status', error: error.message });
  }
};
