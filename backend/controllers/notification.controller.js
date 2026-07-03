const Notification = require('../models/Notification');
const UserNotification = require('../models/UserNotification');
const User = require('../models/User');

// ============================================================
// ADMIN CONTROLLERS
// ============================================================

// POST /notifications — Create and dispatch a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, targetType, targetUsers, metadata } = req.body;

    const notification = new Notification({
      title,
      message,
      type: type || 'general',
      targetType: targetType || 'global',
      targetUsers: targetType === 'specific' ? targetUsers : [],
      createdBy: req.user._id,
      metadata: metadata || {},
    });
    await notification.save();

    // Determine which users receive this notification
    let recipients = [];
    if (targetType === 'global') {
      const allUsers = await User.find({}, '_id').lean();
      recipients = allUsers.map(u => u._id);
    } else {
      recipients = targetUsers || [];
    }

    // Bulk create UserNotification records
    if (recipients.length > 0) {
      const docs = recipients.map(userId => ({
        notificationId: notification._id,
        userId,
        isRead: false,
        isDeleted: false,
      }));
      // insertMany with ordered:false to skip duplicates gracefully
      await UserNotification.insertMany(docs, { ordered: false }).catch(() => {});
    }

    res.status(201).json({ message: 'Notification sent successfully', data: notification });
  } catch (error) {
    console.error('createNotification error:', error);
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
};

// GET /notifications/all — Admin: list all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = { isDeleted: false };
    if (type) filter.type = type;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate('createdBy', 'firstName lastName email')
        .populate('targetUsers', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments(filter),
    ]);

    // Attach delivery stats per notification
    const ids = notifications.map(n => n._id);
    const stats = await UserNotification.aggregate([
      { $match: { notificationId: { $in: ids } } },
      { $group: { _id: '$notificationId', total: { $sum: 1 }, read: { $sum: { $cond: ['$isRead', 1, 0] } } } }
    ]);
    const statsMap = {};
    stats.forEach(s => { statsMap[s._id.toString()] = s; });

    const enriched = notifications.map(n => ({
      ...n,
      stats: statsMap[n._id.toString()] || { total: 0, read: 0 }
    }));

    res.status(200).json({ data: { notifications: enriched, total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// GET /notifications/types — All unique type strings in DB (for autocomplete)
exports.getNotificationTypes = async (req, res) => {
  try {
    const types = await Notification.distinct('type', { isDeleted: false });
    res.status(200).json({ data: { types } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch types', error: error.message });
  }
};

// PUT /notifications/:id — Admin edit notification
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};

// DELETE /notifications/:id — Admin soft delete
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isDeleted: true });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};

// ============================================================
// USER CONTROLLERS
// ============================================================

// GET /notifications/my — User's inbox (global + targeted, not dismissed)
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    // Find UserNotification docs for this user that aren't dismissed
    const userNotifs = await UserNotification.find({ userId, isDeleted: false })
      .populate({
        path: 'notificationId',
        match: { isDeleted: false }, // exclude admin-deleted ones
        populate: { path: 'createdBy', select: 'firstName lastName' }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    // Filter out any where notificationId didn't populate (admin-deleted)
    const valid = userNotifs.filter(n => n.notificationId !== null);

    res.status(200).json({ data: { notifications: valid, total: valid.length } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// GET /notifications/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await UserNotification.countDocuments({
      userId: req.user._id,
      isRead: false,
      isDeleted: false,
    });
    res.status(200).json({ data: { count } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get unread count', error: error.message });
  }
};

// PUT /notifications/:id/read — Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    await UserNotification.findOneAndUpdate(
      { notificationId: req.params.id, userId: req.user._id },
      { isRead: true, readAt: new Date() }
    );
    res.status(200).json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark as read', error: error.message });
  }
};

// PUT /notifications/read-all — Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await UserNotification.updateMany(
      { userId: req.user._id, isRead: false, isDeleted: false },
      { isRead: true, readAt: new Date() }
    );
    res.status(200).json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark all as read', error: error.message });
  }
};

// DELETE /notifications/:id/dismiss — User soft-deletes from inbox
exports.dismissNotification = async (req, res) => {
  try {
    await UserNotification.findOneAndUpdate(
      { notificationId: req.params.id, userId: req.user._id },
      { isDeleted: true, deletedAt: new Date() }
    );
    res.status(200).json({ message: 'Notification dismissed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to dismiss notification', error: error.message });
  }
};
