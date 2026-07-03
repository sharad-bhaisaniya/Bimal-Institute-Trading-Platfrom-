const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Apply protection to all settings routes
router.use(protect, authorize('manage_settings'));

// SMS Settings
router.get('/sms', settingsController.sms.getAll);
router.post('/sms', settingsController.sms.create);
router.put('/sms/:id', settingsController.sms.update);
router.delete('/sms/:id', settingsController.sms.delete);

// Razorpay Settings
router.get('/razorpay', settingsController.razorpay.getAll);
router.post('/razorpay', settingsController.razorpay.create);
router.put('/razorpay/:id', settingsController.razorpay.update);
router.delete('/razorpay/:id', settingsController.razorpay.delete);

// Digio Settings
router.get('/digio', settingsController.digio.getAll);
router.post('/digio', settingsController.digio.create);
router.put('/digio/:id', settingsController.digio.update);
router.delete('/digio/:id', settingsController.digio.delete);

// YouTube Settings
router.get('/youtube', settingsController.youtube.getAll);
router.post('/youtube', settingsController.youtube.create);
router.put('/youtube/:id', settingsController.youtube.update);
router.delete('/youtube/:id', settingsController.youtube.delete);

module.exports = router;
