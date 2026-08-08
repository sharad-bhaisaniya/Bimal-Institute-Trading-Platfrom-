const JournalNote = require('../../models/journal/JournalNote');
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @desc Create a new journal note
 * @route POST /api/v1/journal-notes
 */
const createNote = asyncHandler(async (req, res) => {
    const { title, type, content, date } = req.body;
    const userId = req.user?._id || req.body.user_id;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User context is required to create a note." });
    }

    const newNote = new JournalNote({
        user_id: userId,
        title,
        type,
        content,
        date: date || new Date()
    });

    try {
        await newNote.save();
        res.status(201).json({
            success: true,
            data: newNote,
            message: "Journal note created successfully."
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create journal note."
        });
    }
});

/**
 * @desc Get all journal notes
 * @route GET /api/v1/journal-notes
 */
const getAllNotes = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.query.user_id;
    const filter = userId ? { user_id: userId } : {};

    const notes = await JournalNote.find(filter).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
        success: true,
        data: notes,
        message: "Journal notes fetched successfully."
    });
});

/**
 * @desc Update a journal note
 * @route PUT /api/v1/journal-notes/:id
 */
const updateNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const note = await JournalNote.findById(id);
    if (!note) {
        return res.status(404).json({ success: false, message: "Journal note not found." });
    }

    const updatedNote = await JournalNote.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: updatedNote,
        message: "Journal note updated successfully."
    });
});

/**
 * @desc Delete a journal note
 * @route DELETE /api/v1/journal-notes/:id
 */
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const note = await JournalNote.findById(id);
    if (!note) {
        return res.status(404).json({ success: false, message: "Journal note not found." });
    }

    await JournalNote.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Journal note deleted successfully."
    });
});

module.exports = {
    createNote,
    getAllNotes,
    updateNote,
    deleteNote
};
