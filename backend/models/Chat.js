const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  // Participants in the chat
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  // Messages array
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    // Message status: sent, delivered, read
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    },
    deliveredAt: {
      type: Date
    },
    readAt: {
      type: Date
    }
  }],
  // Last activity timestamp for sorting
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  // Track which users have unread messages
  unreadBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Track typing status
  typingBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for efficient queries
chatSchema.index({ participants: 1, isDeleted: 1 });
chatSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
