const mongoose = require('mongoose');

const subscriptionPaymentSchema = new mongoose.Schema(
    {
        // User
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            index: true,
        },

        // User Subscription
        subscription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserSubscription",
            required: [true, "Subscription is required"],
            index: true,
        },

        // Purchased Plan
        subscription_plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubscriptionPlan",
            required: [true, "Subscription plan is required"],
            index: true,
        },

        // Pricing
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true,
            trim: true,
        },

        // Payment Gateway
        payment_gateway: {
            type: String,
            enum: [
                "razorpay",
                "stripe",
                "paypal",
                "cash",
                "bank_transfer",
                "manual",
            ],
            default: "razorpay",
            index: true,
        },

        // Gateway IDs
        order_id: {
            type: String,
            trim: true,
            default: "",
            index: true,
        },

        payment_id: {
            type: String,
            trim: true,
            default: "",
            index: true,
        },

        transaction_id: {
            type: String,
            trim: true,
            default: "",
            index: true,
        },

        // Payment Status
        payment_status: {
            type: String,
            enum: [
                "pending",
                "success",
                "failed",
                "cancelled",
                "refunded",
            ],
            default: "pending",
            index: true,
        },

        // Gateway Response (Optional)
        gateway_response: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        // Invoice
        invoice_number: {
            type: String,
            trim: true,
            default: "",
            unique: true,
            sparse: true,
        },

        // Refund
        refund_amount: {
            type: Number,
            default: 0,
            min: 0,
        },

        refund_reason: {
            type: String,
            trim: true,
            default: "",
        },

        // Payment Time
        paid_at: {
            type: Date,
            default: null,
        },

        // Notes
        notes: {
            type: String,
            trim: true,
            default: "",
        },

        // Audit
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/* -------------------- Indexes -------------------- */

subscriptionPaymentSchema.index({ user: 1 });
subscriptionPaymentSchema.index({ subscription: 1 });
subscriptionPaymentSchema.index({ subscription_plan: 1 });

subscriptionPaymentSchema.index({
    payment_status: 1,
    payment_gateway: 1,
});

subscriptionPaymentSchema.index({ paid_at: -1 });

/* -------------------- Validation -------------------- */

subscriptionPaymentSchema.pre("save", function (next) {
    if (this.refund_amount > this.amount) {
        return next(
            new Error("Refund amount cannot be greater than paid amount.")
        );
    }

    next();
});

const SubscriptionPayment = mongoose.model(
    "SubscriptionPayment",
    subscriptionPaymentSchema
);

module.exports = SubscriptionPayment;