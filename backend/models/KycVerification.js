const mongoose = require('mongoose');

const KycVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  digio_document_id: {
    type: String,
    index: true,
    sparse: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  customer_mobile: {
    type: String,
    required: true,
    index: true,
  },
  customer_email: {
    type: String,
  },
  reference_id: {
    type: String,
    required: true,
    index: true,
  },
  transaction_id: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending',
    index: true,
  },
  kyc_details: {
    type: Object,
  },
  aadhaar_details: {
    type: Object,
  },
  aadhaar_image: {
    type: String,
  },
  selfie_image: {
    type: String,
  },
  signature_image: {
    type: String,
  },
  pan_image: {
    type: String,
  },
  kyc_completed_at: {
    type: Date,
  },
  kyc_expires_at: {
    type: Date,
  },
  raw_response: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

KycVerificationSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('KycVerification', KycVerificationSchema);
