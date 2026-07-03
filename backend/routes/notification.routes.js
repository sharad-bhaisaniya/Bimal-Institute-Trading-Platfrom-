const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/notification.controller');

// All routes require authentication
router.use(protect);

// ---- User Routes ----
router.get('/my', ctrl.getMyNotifications);
router.get('/unread-count', ctrl.getUnreadCount);
router.put('/read-all', ctrl.markAllAsRead);
router.put('/:id/read', ctrl.markAsRead);
router.delete('/:id/dismiss', ctrl.dismissNotification);

// ---- Admin Routes ----
router.get('/all', ctrl.getAllNotifications);
router.get('/types', ctrl.getNotificationTypes);
router.post('/', ctrl.createNotification);
router.put('/:id', ctrl.updateNotification);
router.delete('/:id', ctrl.deleteNotification);

module.exports = router;
