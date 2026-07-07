const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/broker.controller');

// Create a new broker
router.post('/', brokerController.createBroker);

// Get lists
router.get('/', brokerController.getAllBrokers);
// Note: '/active' route must be placed before '/:id' to prevent 'active' being treated as an ID string
router.get('/active', brokerController.getActiveBrokers);

// ID based operations
router.get('/:id', brokerController.getBrokerById);
router.put('/:id', brokerController.updateBroker);
router.patch('/:id/status', brokerController.updateBrokerStatus); // PATCH is better for single field update
router.delete('/:id', brokerController.deleteBroker);

module.exports = router;