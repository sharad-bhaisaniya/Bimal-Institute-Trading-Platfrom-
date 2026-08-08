const express = require('express');
const router = express.Router();
const { analyzeTrades } = require('../../controllers/journal/aiAnalyzer.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Protect all AI routes
router.use(protect);

router.post('/analyze-trades', analyzeTrades);

module.exports = router;
