const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true // e.g., ZERODHA, GROWW
    },
    logo: {
        type: String,
        default: null
    },
    equity_delivery_charge: {
        type: Number,
        default: 0.00
    },
    equity_intraday_charge: {
        type: Number,
        default: 20.00
    },
    options_charge: {
        type: Number,
        default: 20.00
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Broker', brokerSchema);