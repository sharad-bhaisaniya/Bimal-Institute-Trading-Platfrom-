const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { getAllMedia, deleteMedia } = require('../controllers/media.controller');

// Media library routes
router.get('/', getAllMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
