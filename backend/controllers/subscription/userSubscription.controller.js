// userSubscription.controller.js (Part 1 of 2)
const mongoose = require('mongoose');
// import UserSubscription from '../../models/subscription/UserSubscription.js';
// import SubscriptionPlan from '../../models/subscription/SubscriptionPlan.js';
const UserSubscription = require("../../models/subscription/UserSubscription.js");
const SubscriptionPlan = require("../../models/subscription/SubscriptionPlan.js");

// Helper: parse pagination parameters with defaults
const getPagination = (query) => {
    const page = parseInt(query.page, 10) > 0 ? parseInt(query.page, 10) : 1;
    const limit = parseInt(query.limit, 10) > 0 ? parseInt(query.limit, 10) : 20;
    const skip = (page - 1) * limit;
    const sortField = query.sortBy || 'createdAt';
    const order = query.order === 'asc' ? 1 : -1;
    return { page, limit, skip, sort: { [sortField]: order } };
};

// Create a new UserSubscription
const createUserSubscription = async (req, res) => {
    try {
        const { user, subscription_plan, start_date, auto_renew, is_trial, amount_paid, currency, notes } = req.body;
        if (!user || !subscription_plan) {
            return res.status(400).json({ success: false, message: 'User ID and subscription_plan ID are required' });
        }
        // Validate subscription plan exists
        const plan = await SubscriptionPlan.findById(subscription_plan);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Subscription plan not found' });
        }
        // Prevent duplicate active subscription for the same user and plan
        const existing = await UserSubscription.findOne({ user, subscription_plan, status: 'active' });
        if (existing) {
            return res.status(409).json({ success: false, message: 'User already has an active subscription for this plan' });
        }
        // Set start and end dates (end_date = start_date + plan.duration_months)
        const startDate = start_date ? new Date(start_date) : new Date();
        let endDate = null;
        if (plan.duration_months) {
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + plan.duration_months);
        }
        // Create subscription document
        const newSub = new UserSubscription({
            user,
            subscription_plan,
            start_date: startDate,
            end_date: endDate,
            status: 'pending',
            payment_status: 'pending',
            auto_renew: auto_renew || false,
            is_trial: is_trial || false,
            amount_paid: amount_paid || 0,
            currency: currency || plan.currency,
            notes: notes || '',
            created_by: req.user?._id || null,  // optionally set from authenticated user
        });
        const savedSub = await newSub.save();
        res.status(201).json({ success: true, data: savedSub });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all UserSubscriptions (pagination, sorting, filtering)
const getAllUserSubscriptions = async (req, res) => {
    try {
        const filter = {};
        if (req.query.user) filter.user = req.query.user;
        if (req.query.subscription_plan) filter.subscription_plan = req.query.subscription_plan;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.payment_status) filter.payment_status = req.query.payment_status;
        // Additional filters (e.g. date range) can be added here
        const { page, limit, skip, sort } = getPagination(req.query);
        const total = await UserSubscription.countDocuments(filter);
        const subs = await UserSubscription.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email')                        // populate referenced fields
            .populate('subscription_plan', 'name price currency duration_months')
            .lean();
        res.json({ success: true, data: subs, meta: { total, page, limit } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}



// Get a single UserSubscription by ID
const getUserSubscriptionById = async (req, res) => {
    try {
        const sub = await UserSubscription.findById(req.params.id)
            .populate('user', 'name email')
            .populate('subscription_plan', 'name price currency duration_months');
        if (!sub) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.json({ success: true, data: sub });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a UserSubscription by ID
const updateUserSubscription = async (req, res) => {
    try {
        const updates = req.body;
        // If changing plan, ensure it exists
        if (updates.subscription_plan) {
            const plan = await SubscriptionPlan.findById(updates.subscription_plan);
            if (!plan) {
                return res.status(404).json({ success: false, message: 'New subscription plan not found' });
            }
        }
        // Check date logic
        if (updates.start_date && updates.end_date && new Date(updates.end_date) <= new Date(updates.start_date)) {
            return res.status(400).json({ success: false, message: 'End date must be after start date' });
        }
        const sub = await UserSubscription.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!sub) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.json({ success: true, data: sub });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a UserSubscription by ID
const deleteUserSubscription = async (req, res) => {
    try {
        const sub = await UserSubscription.findByIdAndDelete(req.params.id);
        if (!sub) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.json({ success: true, data: sub });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update the status of a UserSubscription (e.g., activate or cancel)
const updateUserSubscriptionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required' });
        }
        const sub = await UserSubscription.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!sub) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        res.json({ success: true, data: sub });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    createUserSubscription,
    getAllUserSubscriptions,
    getUserSubscriptionById,
    updateUserSubscription,
    deleteUserSubscription,
    updateUserSubscriptionStatus,
};