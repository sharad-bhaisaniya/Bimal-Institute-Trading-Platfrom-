const SubscriptionPlan = require('../models/SubscriptionPlan');

// POST /subscription-plans — Create
exports.createPlan = async (req, res) => {
  try {
    const plan = new SubscriptionPlan(req.body);
    await plan.save();
    res.status(201).json({ message: 'Plan created successfully', data: plan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create plan', error: error.message });
  }
};

// GET /subscription-plans — Public (active plans only, sorted)
exports.getActivePlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({ sortOrder: 1, price: 1 });
    res.status(200).json({ data: { plans } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plans', error: error.message });
  }
};

// GET /subscription-plans/all — Admin (all plans including inactive)
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ data: { plans } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plans', error: error.message });
  }
};

// GET /subscription-plans/:id — Single plan
exports.getPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.status(200).json({ data: plan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plan', error: error.message });
  }
};

// PUT /subscription-plans/:id — Update
exports.updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.status(200).json({ message: 'Plan updated', data: plan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update plan', error: error.message });
  }
};

// PUT /subscription-plans/:id/toggle — Toggle active/inactive
exports.togglePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    plan.isActive = !plan.isActive;
    await plan.save();
    res.status(200).json({ message: `Plan ${plan.isActive ? 'activated' : 'deactivated'}`, data: plan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle plan', error: error.message });
  }
};

// DELETE /subscription-plans/:id — Hard delete
exports.deletePlan = async (req, res) => {
  try {
    await SubscriptionPlan.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete plan', error: error.message });
  }
};
