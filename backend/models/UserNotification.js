const mongoose = require('mongoose');

const userNotificationSchema = new mongoose.Schema({
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  // User-level soft delete (dismiss from inbox)
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

// Compound index — one record per user per notification
userNotificationSchema.index({ notificationId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('UserNotification', userNotificationSchema);
