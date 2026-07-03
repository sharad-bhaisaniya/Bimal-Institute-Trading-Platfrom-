const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  // Fully dynamic type string — no enum restriction
  type: { type: String, required: true, default: 'general', trim: true },
  // 'global' = all users; 'specific' = only targetUsers
  targetType: { type: String, enum: ['global', 'specific'], default: 'global' },
  targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Optional flexible metadata (e.g. { courseId, orderId, url })
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  // Admin-level soft delete
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
