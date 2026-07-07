const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/trade.controller');

// Create & Get Trades
router.post('/', tradeController.createTrade);
router.get('/', tradeController.getAllTrades);

// ID based operations
router.get('/:id', tradeController.getTradeById);
router.put('/:id', tradeController.updateTrade);
router.patch('/:id/status', tradeController.updateTradeStatus); // Specifically for status and P&L exit logic
router.delete('/:id', tradeController.deleteTrade);

module.exports = router;