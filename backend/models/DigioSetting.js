const mongoose = require('mongoose');

const digioSettingSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  templateName: { type: String }, // Optional depending on Digio template requirements
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('DigioSetting', digioSettingSchema);
