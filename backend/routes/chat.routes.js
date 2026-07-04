const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/chat.controller');

// All routes require authentication
router.use(protect);

// Get all conversations (Super Admin: all, User: only with admin)
router.get('/conversations', ctrl.getConversations);

// Get messages between current user and specific user
router.get('/:userId/messages', ctrl.getMessages);

// Send a message
router.post('/send', ctrl.sendMessage);

// Mark chat as read
router.put('/:chatId/read', ctrl.markChatAsRead);

// Get Super Admin user info
router.get('/super-admin/info', ctrl.getSuperAdmin);

// Update online status
router.put('/online', ctrl.updateOnlineStatus);

// Set typing status
router.post('/typing', ctrl.setTypingStatus);

module.exports = router;
