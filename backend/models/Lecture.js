const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  videoType: { type: String, enum: ['upload', 'url', 'none'], default: 'none' },
  videoUrl: { type: String },
  videoFile: { type: String }, // Path to uploaded video
  notes: { type: String }, // Rich text for lecture notes
  // YouTube Import specific fields
  videoId: { type: String, sparse: true },
  embedUrl: { type: String },
  watchUrl: { type: String },
  thumbnail: { type: String },
  duration: { type: String },
  publishedAt: { type: Date },
  channelTitle: { type: String },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);
