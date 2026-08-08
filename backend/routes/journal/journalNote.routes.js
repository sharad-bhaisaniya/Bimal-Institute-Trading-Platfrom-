const express = require('express');
const router = express.Router();
const {
    createNote,
    getAllNotes,
    updateNote,
    deleteNote
} = require('../../controllers/journal/journalNote.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Protect all routes with auth middleware
router.use(protect);

router.route('/')
    .post(createNote)
    .get(getAllNotes);

router.route('/:id')
    .put(updateNote)
    .delete(deleteNote);

module.exports = router;
