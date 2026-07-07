const express = require("express");

const {
    createSubscriptionPlan,
    getAllSubscriptionPlans,
    getSubscriptionPlanById,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    updateSubscriptionPlanStatus,
    toggleFeaturedPlan,
} = require("../../controllers/subscription/subscriptionPlan.controller");

const router = express.Router();

// Create
router.post("/", createSubscriptionPlan);

// Get All
router.get("/", getAllSubscriptionPlans);

// Get By ID
router.get("/:id", getSubscriptionPlanById);

// Update
router.put("/:id", updateSubscriptionPlan);

// Delete
router.delete("/:id", deleteSubscriptionPlan);

// Update Status
router.patch("/:id/status", updateSubscriptionPlanStatus);

// Toggle Featured
router.patch("/:id/featured", toggleFeaturedPlan);

module.exports = router;