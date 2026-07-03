const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtube.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/preview', protect, youtubeController.previewPlaylist);
router.post('/sync', protect, youtubeController.syncPlaylist);

module.exports = router;
