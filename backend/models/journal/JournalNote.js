const mongoose = require('mongoose');

const journalNoteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required for a journal note']
    },
    type: {
        type: String,
        enum: ['lesson', 'observation', 'note'],
        default: 'note'
    },
    content: {
        type: String,
        required: [true, 'Content is required for a journal note']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('JournalNote', journalNoteSchema);
