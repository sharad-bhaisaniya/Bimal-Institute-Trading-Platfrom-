const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const RazorpaySetting = require('../../models/RazorpaySetting');
const SubscriptionPlan = require('../../models/subscription/SubscriptionPlan');
const UserSubscription = require('../../models/subscription/UserSubscription');
const SubscriptionPayment = require('../../models/subscription/SubscriptionPayment');
const KycVerification = require('../../models/KycVerification');

const getRazorpayInstance = async () => {
    const setting = await RazorpaySetting.findOne({ isActive: true });
    
    const key_id = setting?.keyId || process.env.RAZORPAY_KEY_ID;
    const key_secret = setting?.keySecret || process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        throw new Error('Razorpay settings not found or not active. Please configure them in the admin dashboard or .env file.');
    }

    return new Razorpay({
        key_id,
        key_secret,
    });
};

const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // 1. Check KYC
        const kyc = await KycVerification.findOne({ user: userId }).sort({ createdAt: -1 });
        if (!kyc || (kyc.status !== 'approved' && kyc.status !== 'verified')) {
            return res.status(403).json({ success: false, message: 'KYC not approved. Cannot purchase subscription.' });
        }

        // 2. Get Plan
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Subscription plan not found' });
        }

        // 3. Calculate Amount (Discount logic)
        let finalAmount = plan.price;
        if (plan.sale_price > 0 && plan.sale_price < plan.price) {
            finalAmount = plan.sale_price; // Discount applied
        }

        // Handle free plans or trials if finalAmount is 0
        if (finalAmount === 0) {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const startDate = new Date();
                let endDate = new Date();
                if (plan.plan_duration === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
                else if (plan.plan_duration === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);
                else if (plan.plan_duration === 'quarterly') endDate.setMonth(endDate.getMonth() + 3);
                else endDate = null;

                const userSubscription = new UserSubscription({
                    user: userId,
                    subscription_plan: plan._id,
                    start_date: startDate,
                    end_date: endDate,
                    status: 'active',
                    payment_status: 'paid',
                    is_trial: plan.trial_days > 0,
                    amount_paid: 0,
                    currency: plan.currency || "INR",
                });
                await userSubscription.save({ session });

                const subscriptionPayment = new SubscriptionPayment({
                    user: userId,
                    subscription: userSubscription._id,
                    subscription_plan: plan._id,
                    amount: 0,
                    currency: plan.currency || "INR",
                    payment_gateway: 'manual',
                    payment_status: 'success',
                    paid_at: new Date(),
                });
                await subscriptionPayment.save({ session });

                await session.commitTransaction();
                session.endSession();
                return res.json({ success: true, isFree: true, message: 'Free subscription activated successfully.' });
            } catch (err) {
                await session.abortTransaction();
                session.endSession();
                throw err;
            }
        }

        // 4. Create Razorpay Order
        const razorpay = await getRazorpayInstance();
        
        const options = {
            amount: Math.round(finalAmount * 100), // amount in the smallest currency unit (paise)
            currency: plan.currency || "INR",
            receipt: `receipt_subs_${new Date().getTime()}`,
            notes: {
                planId: plan._id.toString(),
                userId: userId.toString()
            }
        };

        const order = await razorpay.orders.create(options);
        
        const setting = await RazorpaySetting.findOne({ isActive: true });
        const keyId = setting?.keyId || process.env.RAZORPAY_KEY_ID;

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: keyId // needed for frontend
        });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

const verifyPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const setting = await RazorpaySetting.findOne({ isActive: true });
        const keySecret = setting?.keySecret || process.env.RAZORPAY_KEY_SECRET;

        if (!keySecret) {
            throw new Error('Razorpay settings not found');
        }

        // Verify signature
        const shasum = crypto.createHmac('sha256', keySecret);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Transaction not legit!' });
        }

        // Signature is valid. Create UserSubscription and SubscriptionPayment.
        const plan = await SubscriptionPlan.findById(planId).session(session);
        if (!plan) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Subscription plan not found' });
        }

        let finalAmount = plan.price;
        if (plan.sale_price > 0 && plan.sale_price < plan.price) {
            finalAmount = plan.sale_price;
        }

        // Calculate end date based on duration
        const startDate = new Date();
        let endDate = new Date();
        if (plan.plan_duration === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.plan_duration === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else if (plan.plan_duration === 'quarterly') {
            endDate.setMonth(endDate.getMonth() + 3);
        } else {
            // Lifetime
            endDate = null;
        }

        // 1. Create UserSubscription
        const userSubscription = new UserSubscription({
            user: userId,
            subscription_plan: plan._id,
            start_date: startDate,
            end_date: endDate,
            status: 'active',
            payment_status: 'paid',
            is_trial: false, // Or based on plan logic if trial comes first
            amount_paid: finalAmount,
            currency: plan.currency || "INR",
        });

        await userSubscription.save({ session });

        // 2. Create SubscriptionPayment
        const subscriptionPayment = new SubscriptionPayment({
            user: userId,
            subscription: userSubscription._id,
            subscription_plan: plan._id,
            amount: finalAmount,
            currency: plan.currency || "INR",
            payment_gateway: 'razorpay',
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            payment_status: 'success',
            paid_at: new Date(),
        });

        await subscriptionPayment.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ success: true, message: 'Payment verified and subscription activated.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

module.exports = {
    createOrder,
    verifyPayment
};
