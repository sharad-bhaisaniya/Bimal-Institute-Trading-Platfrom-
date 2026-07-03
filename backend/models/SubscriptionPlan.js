const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR', enum: ['INR', 'USD', 'EUR', 'GBP'] },

  // Duration: e.g. duration=1, durationType='months' → 1 month plan
  duration: { type: Number, required: true, min: 0 },
  durationType: {
    type: String,
    enum: ['days', 'months', 'years', 'lifetime'],
    default: 'months'
  },

  // Dynamic feature list — each string is one bullet point
  features: [{ type: String, trim: true }],

  // Optional badge e.g. "Most Popular", "Best Value"
  badge: { type: String, trim: true },
  badgeColor: { type: String, default: '#bfff00' }, // brand green default

  // Optional free trial
  trialDays: { type: Number, default: 0 },

  // -1 = unlimited users on this plan
  maxUsers: { type: Number, default: -1 },

  // Display ordering
  sortOrder: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
