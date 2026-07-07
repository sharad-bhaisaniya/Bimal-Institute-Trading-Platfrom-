const express = require('express');

const {
    createSubscriptionPayment,
    getAllSubscriptionPayments,
    getSubscriptionPaymentById,
    updateSubscriptionPayment,
    deleteSubscriptionPayment,
    updateSubscriptionPaymentStatus,
} = require("../../controllers/subscription/subscriptionPayment.controller.js");

const router = express.Router();

// Create
router.post("/", createSubscriptionPayment);

// Get All
router.get("/", getAllSubscriptionPayments);

// Get By ID
router.get("/:id", getSubscriptionPaymentById);

// Update
router.put("/:id", updateSubscriptionPayment);

// Delete
router.delete("/:id", deleteSubscriptionPayment);

// Update Status
router.patch("/:id/status", updateSubscriptionPaymentStatus);

module.exports = router;