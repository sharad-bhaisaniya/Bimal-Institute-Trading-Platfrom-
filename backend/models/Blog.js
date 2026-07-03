const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
  metaDescription: { type: String },
  description: { type: String, required: true }, // Rich text from CKEditor
  featuredImage: { type: String }, // Store the URL directly for easy access
  isFeatured: { type: Boolean, default: false },
  readTime: { type: String },
  likes: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
