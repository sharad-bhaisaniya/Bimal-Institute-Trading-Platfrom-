const mongoose = require('mongoose');

const tradeJournalSchema = new mongoose.Schema(
    {
        // User Relationship
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "User assignment is required"],
            index: true,
        },

        // Primary Metrics (Row 1 & 2 inputs from form)
        date: {
            type: Date,
            required: [true, "Trade date is required"],
            default: Date.now,
        },

        symbol: {
            type: String,
            required: [true, "Trading symbol is required"],
            trim: true,
            uppercase: true,
        },

        market: {
            type: String,
            required: true,
            enum: ['NSE', 'BSE', 'MCX'],
            default: 'NSE',
        },

        broker: {
            type: String,
            required: true,
            enum: ['Zerodha', 'Upstox', 'Groww'],
            default: 'Zerodha',
        },

        type: {
            type: String,
            required: true,
            enum: ['BUY', 'SELL'],
            default: 'BUY',
        },

        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be at least 1"],
        },

        entry_price: {
            type: Number,
            required: [true, "Entry price is required"],
            min: [0, "Entry price cannot be negative"],
        },

        exit_price: {
            type: Number,
            default: null,
            min: [0, "Exit price cannot be negative"],
        },

        strategy_used: {
            type: String,
            required: true,
            enum: ['Breakout', 'Scalping', 'Swing', 'Price Action', 'EMA Cross'],
            default: 'Price Action',
        },

        // Trading Psychology & Diary Analysis Metrics
        pre_trade_emotion: {
            type: String,
            required: true,
            enum: ['Calm', 'FOMO', 'Greedy', 'Anxious', 'Revenge'],
            default: 'Calm',
        },

        post_trade_emotion: {
            type: String,
            required: true,
            enum: ['Disciplined', 'Relieved', 'Angry', 'Overconfident'],
            default: 'Disciplined',
        },

        mistake_tag: {
            type: String,
            required: true,
            enum: ['None', 'FOMO Entry', 'Chasing Market', 'Moved SL', 'Overtrading', 'Early Exit'],
            default: 'None',
        },

        // Diary Notes & Reflections
        notes: {
            type: String,
            trim: true,
            default: "",
        },

        // Automated Calculated Outputs (Backend computation storage)
        pnl: {
            type: Number,
            default: 0, // Auto calculated pre-save or pre-response
        },

        status: {
            type: String,
            enum: ['WIN', 'LOSS', 'BREAKEVEN', 'OPEN'],
            default: 'OPEN',
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Indexes for fast searching & analytics compilation
tradeJournalSchema.index({ user_id: 1, date: -1 });
tradeJournalSchema.index({ symbol: 1 });
tradeJournalSchema.index({ status: 1 });

// Automatically compute P&L and status right before saving the diary document
tradeJournalSchema.pre('save', function (next) {
    // If the trade is not closed yet (no exit price), leave it as OPEN
    if (this.exit_price === null || this.exit_price === undefined) {
        this.pnl = 0;
        this.status = 'OPEN';
        return next();
    }

    // Dynamic Calculation Logic based on Transaction Type
    if (this.type === 'BUY') {
        this.pnl = (this.exit_price - this.entry_price) * this.quantity;
    } else if (this.type === 'SELL') {
        this.pnl = (this.entry_price - this.exit_price) * this.quantity;
    }

    // Clean decimals up to 2 decimal points
    this.pnl = parseFloat(this.pnl.toFixed(2));

    // Assign operational win/loss status parameters
    if (this.pnl > 0) {
        this.status = 'WIN';
    } else if (this.pnl < 0) {
        this.status = 'LOSS';
    } else {
        this.status = 'BREAKEVEN';
    }

    next();
});

const TradeJournal = mongoose.model('TradeJournal', tradeJournalSchema);

module.exports = TradeJournal;