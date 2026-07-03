const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/subscriptionPlan.controller');

// Public — active plans (for landing page / user purchase)
router.get('/', ctrl.getActivePlans);

// Protected — admin operations
router.get('/all', protect, ctrl.getAllPlans);
router.get('/:id', protect, ctrl.getPlan);
router.post('/', protect, ctrl.createPlan);
router.put('/:id', protect, ctrl.updatePlan);
router.put('/:id/toggle', protect, ctrl.togglePlan);
router.delete('/:id', protect, ctrl.deletePlan);

module.exports = router;
