const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  thumbnail: { type: String }, // Path to uploaded image
  type: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  certificateEnabled: { type: Boolean, default: false },
  // YouTube Import specific fields
  playlistId: { type: String, sparse: true },
  playlistTitle: { type: String },
  playlistDescription: { type: String },
  importedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
