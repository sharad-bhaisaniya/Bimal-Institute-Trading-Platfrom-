// routes/journal/tradeJournal.routes.js
const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const router = express.Router();
const {
    createTradeEntry,
    getAllTradeEntries,
    getTradeEntryById,
    updateTradeEntry,
    deleteTradeEntry
} = require('../../controllers/journal/tradeJournal.controller');



router.route('/')
    .post(protect, createTradeEntry)
    .get(protect, getAllTradeEntries);

router.route('/:id')
    .get(protect, getTradeEntryById)
    .put(protect, updateTradeEntry)
    .delete(protect, deleteTradeEntry);

module.exports = router;