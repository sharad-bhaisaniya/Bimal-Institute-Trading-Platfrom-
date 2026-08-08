const express = require('express');
const router = express.Router();
const zoomController = require('../controllers/zoom.controller');
const { protect } = require('../middlewares/auth.middleware');

// We apply authentication middleware to all routes
router.use(protect);

router.post('/create-meeting', zoomController.createMeeting);
router.post('/start-instant-meeting', zoomController.startInstantMeeting);
router.post('/generate-signature', zoomController.generateSignature);
router.get('/meetings', zoomController.getAllMeetings);
router.get('/meeting/:id', zoomController.getMeeting);
router.patch('/meeting/:id', zoomController.updateMeeting);
router.delete('/meeting/:id', zoomController.deleteMeeting);

module.exports = router;
