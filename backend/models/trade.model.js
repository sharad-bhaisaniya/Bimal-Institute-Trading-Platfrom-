const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    broker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broker',
        required: true
    },
    exchange: {
        type: String,
        enum: ['NSE', 'BSE', 'MCX'],
        required: true
    },
    segment: {
        type: String,
        enum: ['EQUITY', 'FUTURES', 'OPTIONS'],
        required: true
    },
    symbol: {
        type: String,
        required: true,
        trim: true,
        uppercase: true // e.g., RELIANCE, NIFTY
    },
    trade_date: {
        type: Date,
        default: Date.now
    },
    trade_type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    entry_price: {
        type: Number,
        required: true
    },
    stop_loss: {
        type: Number,
        required: true
    },

    // Targets
    target_1: { type: Number, required: true },
    target_1_qty: { type: Number, required: true },
    target_2: { type: Number, default: null },
    target_2_qty: { type: Number, default: null },

    // Exits & Tracking
    exit_price: { type: Number, default: null },
    exit_quantity: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['OPEN', 'PARTIAL_EXIT', 'CLOSED', 'CANCELLED'],
        default: 'OPEN'
    },
    trade_result: {
        type: String,
        enum: ['PROFIT', 'LOSS', 'BREAK_EVEN', 'PENDING'],
        default: 'PENDING'
    },

    // Financials
    gross_pnl: { type: Number, default: 0 },
    brokerage_charges: { type: Number, default: 0 },
    net_pnl: { type: Number, default: 0 },

    // Psychology & Review
    emotion: { type: String, trim: true },
    tags: { type: String, trim: true },
    notes: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);