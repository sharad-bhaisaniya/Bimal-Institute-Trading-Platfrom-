// routes/journal/tradeJournal.routes.js
const express = require('express');
const router = express.Router();
const {
    createTradeEntry,
    getAllTradeEntries,
    getTradeEntryById,
    updateTradeEntry,
    deleteTradeEntry
} = require('../../controllers/journal/tradeJournal.controller');

// Agar user session verification strict karni ho, toh yahan middleware laga sakte hain
// const { protect } = require('../../middlewares/auth.middleware');

router.route('/')
    .post(createTradeEntry)
    .get(getAllTradeEntries);

router.route('/:id')
    .get(getTradeEntryById)
    .put(updateTradeEntry)
    .delete(deleteTradeEntry);

module.exports = router;