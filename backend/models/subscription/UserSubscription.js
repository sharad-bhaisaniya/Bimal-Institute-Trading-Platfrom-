const mongoose = require("mongoose");

const userSubscriptionSchema = new mongoose.Schema(
    {
        // User
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            index: true,
        },

        // Purchased Plan
        subscription_plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubscriptionPlan",
            required: [true, "Subscription plan is required"],
            index: true,
        },

        // Subscription Dates
        start_date: {
            type: Date,
            required: true,
            default: Date.now,
        },

        end_date: {
            type: Date,
            default: null, // Lifetime plan = null
        },

        // Status
        status: {
            type: String,
            enum: [
                "pending",
                "active",
                "expired",
                "cancelled",
            ],
            default: "pending",
            index: true,
        },

        // Payment Status
        payment_status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded",
            ],
            default: "pending",
            index: true,
        },

        // Auto Renew
        auto_renew: {
            type: Boolean,
            default: false,
        },

        // Trial
        is_trial: {
            type: Boolean,
            default: false,
        },

        // Amount Paid
        amount_paid: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Currency
        currency: {
            type: String,
            default: "INR",
            uppercase: true,
            trim: true,
        },

        // Notes (Optional)
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

userSubscriptionSchema.index({ user: 1 });
userSubscriptionSchema.index({ subscription_plan: 1 });
userSubscriptionSchema.index({ status: 1 });
userSubscriptionSchema.index({ payment_status: 1 });
userSubscriptionSchema.index({ start_date: 1 });
userSubscriptionSchema.index({ end_date: 1 });

/* Compound index */
userSubscriptionSchema.index({
    user: 1,
    subscription_plan: 1,
});

/* -------------------- Virtual -------------------- */

userSubscriptionSchema.virtual("isExpired").get(function () {
    if (!this.end_date) return false; // Lifetime

    return this.end_date < new Date();
});

/* -------------------- Validation -------------------- */

userSubscriptionSchema.pre("save", function (next) {
    if (
        this.end_date &&
        this.start_date &&
        this.end_date <= this.start_date
    ) {
        return next(
            new Error("End date must be greater than start date.")
        );
    }

    next();
});

const UserSubscription = mongoose.model(
    "UserSubscription",
    userSubscriptionSchema
);

module.exports = UserSubscription;