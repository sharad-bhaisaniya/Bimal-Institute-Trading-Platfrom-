const express = require('express');
const {
    createUserSubscription,
    getAllUserSubscriptions,
    getUserSubscriptionById,
    updateUserSubscription,
    deleteUserSubscription,
    updateUserSubscriptionStatus,
} = require("../../controllers/subscription/userSubscription.controller.js");

const router = express.Router();

// Create
router.post("/", createUserSubscription);

// Get All
router.get("/", getAllUserSubscriptions);

// Get By ID
router.get("/:id", getUserSubscriptionById);

// Update
router.put("/:id", updateUserSubscription);

// Delete
router.delete("/:id", deleteUserSubscription);

// Update Status
router.patch("/:id/status", updateUserSubscriptionStatus);

module.exports = router;