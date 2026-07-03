const mongoose = require('mongoose');

const smsSettingSchema = new mongoose.Schema({
  user: { type: String, required: true },
  key: { type: String, required: true },
  senderId: { type: String, required: true },
  entityId: { type: String, required: true },
  templateId: { type: String, required: true },
  countryCode: { type: String, required: true },
  baseUrl: { type: String, required: true },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SmsSetting', smsSettingSchema);
