const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema(
    {
        // Basic Information
        name: {
            type: String,
            required: [true, "Plan name is required"],
            trim: true,
            unique: true,
            maxlength: 100,
        },

        slug: {
            type: String,
            required: [true, "Slug is required"],
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        // Pricing
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },

        sale_price: {
            type: Number,
            default: 0,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true,
            trim: true,
        },

        // Plan Duration
        plan_duration: {
            type: String,
            required: true,
            enum: [
                "monthly",
                "quarterly",
                "half_yearly",
                "yearly",
                "lifetime",
            ],
            default: "monthly",
        },

        trial_days: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Display
        badge: {
            type: String,
            trim: true,
            default: "",
        },

        is_featured: {
            type: Boolean,
            default: false,
        },

        display_order: {
            type: Number,
            default: 0,
        },

        // Status
        is_active: {
            type: Boolean,
            default: true,
        },

        features: {
            type: [String],
            default: [],
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

// Indexes
subscriptionPlanSchema.index({ name: 1 });
subscriptionPlanSchema.index({ slug: 1 });
subscriptionPlanSchema.index({ is_active: 1 });
subscriptionPlanSchema.index({ is_featured: 1 });
subscriptionPlanSchema.index({ display_order: 1 });

// Auto-generate slug from name
subscriptionPlanSchema.pre("validate", function () {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }
});

// Ensure sale price is not greater than actual price
subscriptionPlanSchema.pre("save", function () {
    if (this.sale_price > this.price) {
        throw new Error(
            "Sale price cannot be greater than the original price."
        );
    }
});

const SubscriptionPlan = mongoose.model(
    "SubscriptionPlan",
    subscriptionPlanSchema
);

module.exports = SubscriptionPlan;