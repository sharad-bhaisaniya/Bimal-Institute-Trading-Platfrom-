const mongoose = require('mongoose');

const razorpaySettingSchema = new mongoose.Schema({
  keyId: { type: String, required: true },
  keySecret: { type: String, required: true },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('RazorpaySetting', razorpaySettingSchema);
