const mongoose = require('mongoose');

const youtubeSettingSchema = new mongoose.Schema({
  apiKey: { type: String, required: true },
  label: { type: String, default: 'YouTube API Key' },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('YoutubeSetting', youtubeSettingSchema);
