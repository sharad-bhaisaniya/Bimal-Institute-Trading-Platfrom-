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
            required: [true, "Broker is required"],
            trim: true,
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

        day: {
            type: String,
            trim: true,
        },

        segment: {
            type: String,
            enum: ['Cash', 'Crypto', 'Futures', 'Options'],
            default: 'Cash',
        },

        trade_type: {
            type: String,
            enum: ['Intraday', 'Delivery'],
            default: 'Intraday',
        },

        stop_loss: {
            type: Number,
            required: [true, "Stop loss is required"],
        },

        target_price: {
            type: Number,
            required: [true, "Target price is required"],
        },

        risk_reward: {
            type: Number,
        },

        trade_entry_time: {
            type: String,
        },

        trade_exit_time: {
            type: String,
        },

        remark_1: {
            type: String,
            trim: true,
        },

        remark_2: {
            type: String,
            trim: true,
        },

        strategy_used: {
            type: String,
            required: true,
            trim: true,
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

        manual_pnl: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ['WIN', 'LOSS', 'BREAKEVEN', 'OPEN'],
            default: 'OPEN',
        },

        trade_result: {
            type: String,
            enum: ['Target', 'Stoploss', 'Pending'],
            default: 'Pending',
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
tradeJournalSchema.pre('save', async function () {
    if (!this.manual_pnl) {
        if (this.exit_price == null) {
            this.pnl = 0;
            this.status = 'OPEN';
            return;
        }

        if (this.type === 'BUY') {
            this.pnl = (this.exit_price - this.entry_price) * this.quantity;
        } else {
            this.pnl = (this.entry_price - this.exit_price) * this.quantity;
        }
    }

    this.pnl = Number(this.pnl.toFixed(2));

    if (this.pnl > 0) {
        this.status = 'WIN';
    } else if (this.pnl < 0) {
        this.status = 'LOSS';
    } else {
        this.status = 'BREAKEVEN';
    }
});

const TradeJournal = mongoose.model('TradeJournal', tradeJournalSchema);

module.exports = TradeJournal;