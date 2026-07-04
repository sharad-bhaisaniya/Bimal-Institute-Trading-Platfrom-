const mongoose = require('mongoose');

const digioCredentialSchema = new mongoose.Schema({
  client_id:     { type: String, required: true },
  client_secret: { type: String, required: true },
  api_base_url:  { type: String, default: 'https://ext.digio.in' },
  workflow_name: { type: String },
  isActive:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('DigioCredential', digioCredentialSchema);
