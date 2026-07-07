// subscriptionPayment.controller.js (Part 1 of 2)

const mongoose = require('mongoose');
// import SubscriptionPayment from '../../models/subscription/SubscriptionPayment.js';
const SubscriptionPayment = require("../../models/subscription/SubscriptionPayment");
const UserSubscription = require("../../models/subscription/UserSubscription");
const SubscriptionPlan = require("../../models/subscription/SubscriptionPlan");

// Helper: parse pagination parameters with defaults
const getPagination = (query) => {
    const page = parseInt(query.page, 10) > 0 ? parseInt(query.page, 10) : 1;
    const limit = parseInt(query.limit, 10) > 0 ? parseInt(query.limit, 10) : 20;
    const skip = (page - 1) * limit;
    const sortField = query.sortBy || 'createdAt';
    const order = query.order === 'asc' ? 1 : -1;
    return { page, limit, skip, sort: { [sortField]: order } };
};

// Create a new SubscriptionPayment (and activate subscription if successful)
const createSubscriptionPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { user, subscription, subscription_plan, amount, currency, payment_gateway, order_id, payment_id, transaction_id, payment_status, gateway_response, invoice_number, refund_amount, refund_reason, paid_at, notes } = req.body;
        if (!user || !subscription || !subscription_plan || amount == null) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'User, subscription, subscription_plan, and amount are required' });
        }
        // Validate related records
        const subs = await UserSubscription.findById(subscription).session(session);
        if (!subs) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'UserSubscription not found' });
        }
        const plan = await SubscriptionPlan.findById(subscription_plan).session(session);
        if (!plan) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Subscription plan not found' });
        }
        // Create payment document
        const newPayment = new SubscriptionPayment({
            user,
            subscription,
            subscription_plan,
            amount,
            currency: currency || plan.currency,
            payment_gateway: payment_gateway || 'razorpay',
            order_id: order_id || '',
            payment_id: payment_id || '',
            transaction_id: transaction_id || '',
            payment_status: payment_status || 'pending',
            gateway_response: gateway_response || null,
            invoice_number: invoice_number || '',
            refund_amount: refund_amount || 0,
            refund_reason: refund_reason || '',
            paid_at: paid_at ? new Date(paid_at) : null,
            notes: notes || '',
            created_by: req.user?._id || null,
        });
        const savedPayment = await newPayment.save({ session });
        // If payment is successful, activate the subscription
        if (savedPayment.payment_status === 'paid' || savedPayment.payment_status === 'success') {
            subs.status = 'active';
            subs.payment_status = 'paid';
            await subs.save({ session });
        }
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ success: true, data: savedPayment });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all SubscriptionPayments (pagination, sorting, filtering)
const getAllSubscriptionPayments = async (req, res) => {
    try {
        const filter = {};
        if (req.query.user) filter.user = req.query.user;
        if (req.query.subscription) filter.subscription = req.query.subscription;
        if (req.query.subscription_plan) filter.subscription_plan = req.query.subscription_plan;
        if (req.query.payment_status) filter.payment_status = req.query.payment_status;
        if (req.query.payment_gateway) filter.payment_gateway = req.query.payment_gateway;
        // Additional filters can be applied here
        const { page, limit, skip, sort } = getPagination(req.query);
        const total = await SubscriptionPayment.countDocuments(filter);
        const payments = await SubscriptionPayment.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email')
            .populate({ path: 'subscription', select: 'user status start_date end_date' })
            .populate('subscription_plan', 'name price currency')
            .lean();
        res.json({ success: true, data: payments, meta: { total, page, limit } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// subscriptionPayment.controller.js (Part 2 of 2)



// Get a single SubscriptionPayment by ID
const getSubscriptionPaymentById = async (req, res) => {
    try {
        const pay = await SubscriptionPayment.findById(req.params.id)
            .populate('user', 'name email')
            .populate({ path: 'subscription', select: 'user status start_date end_date' })
            .populate('subscription_plan', 'name price currency');
        if (!pay) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, data: pay });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a SubscriptionPayment by ID (e.g., change status or add refund info)
const updateSubscriptionPayment = async (req, res) => {
    try {
        const updates = req.body;
        // If marked refunded, update the related subscription
        if (updates.payment_status === 'refunded') {
            await UserSubscription.findByIdAndUpdate(req.body.subscription, { status: 'cancelled' });
        }
        const pay = await SubscriptionPayment.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!pay) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, data: pay });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a SubscriptionPayment by ID
const deleteSubscriptionPayment = async (req, res) => {
    try {
        const pay = await SubscriptionPayment.findByIdAndDelete(req.params.id);
        if (!pay) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, data: pay });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update only the payment_status of a SubscriptionPayment
const updateSubscriptionPaymentStatus = async (req, res) => {
    try {
        const { payment_status } = req.body;
        if (!payment_status) {
            return res.status(400).json({ success: false, message: 'Payment status is required' });
        }
        const pay = await SubscriptionPayment.findByIdAndUpdate(req.params.id, { payment_status }, { new: true });
        if (!pay) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, data: pay });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createSubscriptionPayment,
    getAllSubscriptionPayments,
    getSubscriptionPaymentById,
    updateSubscriptionPayment,
    deleteSubscriptionPayment,
    updateSubscriptionPaymentStatus,
};