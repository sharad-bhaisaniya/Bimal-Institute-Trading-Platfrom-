const mongoose = require('mongoose');

const smtpSettingSchema = new mongoose.Schema({
  host: { type: String, required: true },
  port: { type: Number, required: true },
  user: { type: String, required: true },
  pass: { type: String, required: true },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SmtpSetting', smtpSettingSchema);
