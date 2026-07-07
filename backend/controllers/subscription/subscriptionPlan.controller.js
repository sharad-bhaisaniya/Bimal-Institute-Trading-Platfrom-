// controllers/subscription/subscriptionPlan.controller.js

// import SubscriptionPlan from "../../models/subscription/SubscriptionPlan.js";
const SubscriptionPlan = require("../../models/subscription/SubscriptionPlan");

/**
 * Async handler to wrap controller functions and forward errors.
 * (Similar to catchAsync pattern in Express best practices.)
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Parse pagination params from query string.
 * Defaults: page=1, limit=10. Returns { page, limit, skip }.
 */
function parsePagination(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 10);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}

/**
 * Build MongoDB filter object from query parameters.
 * Supports: search (name or slug, regex, case-insensitive), 
 * is_active, is_featured (booleans), plan_duration (string), and price range.
 */
function buildFilterFromQuery(query) {
    const filter = {};

    // Text search on name or slug
    if (query.search) {
        const regex = new RegExp(query.search, "i");
        filter.$or = [{ name: regex }, { slug: regex }];
    }

    // Boolean filters (passed as 'true' or 'false')
    if (query.is_active !== undefined) {
        filter.is_active = query.is_active === 'true';
    }
    if (query.is_featured !== undefined) {
        filter.is_featured = query.is_featured === 'true';
    }

    // Filter by plan_duration (exact match or multiple comma-separated)
    if (query.plan_duration) {
        // Allow comma-separated values
        const durations = query.plan_duration.split(',').map(s => s.trim());
        filter.plan_duration = durations.length > 1 ? { $in: durations } : query.plan_duration;
    }

    // Price range filter: min_price and/or max_price
    if (query.min_price || query.max_price) {
        filter.price = {};
        if (query.min_price) {
            filter.price.$gte = parseFloat(query.min_price);
        }
        if (query.max_price) {
            filter.price.$lte = parseFloat(query.max_price);
        }
    }

    return filter;
}

/**
 * @desc Create a new subscription plan
 * @route POST /subscriptionPlans
 * @returns {JSON} 201 with created plan
 */
const createSubscriptionPlan = asyncHandler(async (req, res) => {
    const {
        name,
        planName, // Frontend mapping fallback
        slug,
        description,
        price,
        sale_price,
        currency = 'INR',
        plan_duration,
        billingCycle, // Frontend mapping fallback
        trial_days = 0,
        badge = '',
        is_featured = false,
        display_order = 0,
        features = [],
        created_by = null,
        updated_by = null,

    } = req.body;

    // Resolve structural keys seamlessly from form inputs
    const finalName = (name || planName || '').trim();
    const finalDuration = plan_duration || billingCycle;

    if (!finalName) {
        return res.status(400).json({
            success: false,
            message: "Plan name is required."
        });
    }

    if (!finalDuration) {
        return res.status(400).json({
            success: false,
            message: "Plan duration is required."
        });
    }

    // Auto-generate slug cleanly from verified name fallback
    let planSlug = slug;
    if (!planSlug && finalName) {
        planSlug = finalName.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    // Validation: sale_price should not exceed price
    if (sale_price != null && price != null && Number(sale_price) > Number(price)) {
        return res.status(400).json({
            success: false,
            message: "Sale price cannot be greater than price."
        });
    }

    // Create and save new plan
    const newPlan = new SubscriptionPlan({
        name: finalName,
        slug: planSlug,
        description,
        price,
        sale_price: sale_price || 0,
        currency,
        plan_duration: finalDuration,
        trial_days,
        badge,
        is_featured,
        display_order,
        is_active: true,
        features,
        created_by,
        updated_by,
    });

    await newPlan.save();

    res.status(201).json({
        success: true,
        data: newPlan,
        message: "Subscription plan created successfully."
    });
});



/**
 * @desc Get all subscription plans with filtering, sorting, and pagination
 * @route GET /subscriptionPlans
 * @returns {JSON} 200 with list of plans and meta
 */
const getAllSubscriptionPlans = asyncHandler(async (req, res) => {
    // Parse pagination and filters from query
    const { page, limit, skip } = parsePagination(req.query);
    const filter = buildFilterFromQuery(req.query);

    // Sort parameter (default: newest first)
    const sortBy = req.query.sort_by || 'createdAt';
    const sortOrder = req.query.sort_order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute query with pagination and sorting (indexes on name/slug/is_active help speed up filters)
    const [plans, total] = await Promise.all([
        SubscriptionPlan.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort),
        SubscriptionPlan.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
        success: true,
        data: plans,
        meta: { total, page, totalPages, limit },
        message: "Subscription plans retrieved."
    });
});

/**
 * @desc Get a subscription plan by ID
 * @route GET /subscriptionPlans/:id
 * @returns {JSON} 200 with plan data or 404 if not found
 */
const getSubscriptionPlanById = asyncHandler(async (req, res) => {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
        return res.status(404).json({
            success: false,
            message: "Subscription plan not found."
        });
    }
    res.json({
        success: true,
        data: plan,
        message: "Subscription plan details."
    });
});

/**
 * @desc Update a subscription plan by ID
 * @route PUT /subscriptionPlans/:id
 * @returns {JSON} 200 with updated plan or 404/400 on error
 */
const updateSubscriptionPlan = asyncHandler(async (req, res) => {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
        return res.status(404).json({
            success: false,
            message: "Subscription plan not found."
        });
    }

    // Extract raw payload variants
    const incomingName = req.body.name || req.body.planName;
    const incomingDuration = req.body.plan_duration || req.body.billingCycle;

    const finalName = incomingName ? incomingName.trim() : plan.name;

    // Prevent duplicate names
    if (incomingName && finalName !== plan.name) {
        const exists = await SubscriptionPlan.findOne({ name: finalName, _id: { $ne: plan._id } });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Subscription plan name already exists."
            });
        }
    }

    // Normalize payload variables inside req.body for Mongoose pass-through operations
    req.body.name = finalName;
    if (incomingDuration) req.body.plan_duration = incomingDuration;

    // Handle auto-generated slug processing matrix
    if (!req.body.slug) {
        req.body.slug = finalName.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    // Prevent duplicate slugs
    const existsSlug = await SubscriptionPlan.findOne({ slug: req.body.slug, _id: { $ne: plan._id } });
    if (existsSlug) {
        return res.status(400).json({
            success: false,
            message: "Slug already in use."
        });
    }

    // Validate prices safely
    const targetPrice = req.body.price !== undefined ? req.body.price : plan.price;
    const targetSalePrice = req.body.sale_price !== undefined ? req.body.sale_price : plan.sale_price;

    if (targetSalePrice != null && targetPrice != null && Number(targetSalePrice) > Number(targetPrice)) {
        return res.status(400).json({
            success: false,
            message: "Sale price cannot be greater than price."
        });
    }

    // 🌟 ADD THIS BLOCK HERE TO UPDATE FEATURES
    // If the frontend sends features, assign it directly so Mongoose saves the array
    if (req.body.features !== undefined) {
        req.body.features = Array.isArray(req.body.features) ? req.body.features : [];
    }

    // Update and return the modified plan
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json({
        success: true,
        data: updatedPlan,
        message: "Subscription plan updated successfully."
    });
});

/**
 * @desc Delete a subscription plan (soft delete by default, hard if requested)
 * @route DELETE /subscriptionPlans/:id
 * @returns {JSON} 200 on success or 404 if not found
 */
const deleteSubscriptionPlan = asyncHandler(async (req, res) => {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
        return res.status(404).json({
            success: false,
            message: "Subscription plan not found."
        });
    }

    // Hard delete if query param hard=true
    if (req.query.hard === 'true') {
        await SubscriptionPlan.findByIdAndDelete(req.params.id);
        return res.json({
            success: true,
            message: "Subscription plan permanently deleted."
        });
    }

    // Otherwise soft delete (deactivate)
    plan.is_active = false;
    await plan.save();
    res.json({
        success: true,
        data: plan,
        message: "Subscription plan deactivated (soft delete)."
    });
});

/**
 * @desc Toggle active status of a subscription plan
 * @route PATCH /subscriptionPlans/:id/status
 * @returns {JSON} 200 with updated status or 404 if not found
 */
const updateSubscriptionPlanStatus = asyncHandler(async (req, res) => {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
        return res.status(404).json({
            success: false,
            message: "Subscription plan not found."
        });
    }
    plan.is_active = !plan.is_active;
    await plan.save();
    res.json({
        success: true,
        data: plan,
        message: "Subscription plan status updated."
    });
});

/**
 * @desc Toggle featured flag of a subscription plan
 * @route PATCH /subscriptionPlans/:id/featured
 * @returns {JSON} 200 with updated flag or 404 if not found
 */
const toggleFeaturedPlan = asyncHandler(async (req, res) => {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
        return res.status(404).json({
            success: false,
            message: "Subscription plan not found."
        });
    }
    plan.is_featured = !plan.is_featured;
    await plan.save();
    res.json({
        success: true,
        data: plan,
        message: "Subscription plan featured status updated."
    });
});

// Export all handlers
module.exports = {
    createSubscriptionPlan,
    getAllSubscriptionPlans,
    getSubscriptionPlanById,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    updateSubscriptionPlanStatus,
    toggleFeaturedPlan
};