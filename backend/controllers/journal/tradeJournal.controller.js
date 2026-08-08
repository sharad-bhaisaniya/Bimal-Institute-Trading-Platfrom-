const TradeJournal = require('../../models/journal/TradeJournal');

/**
 * Async handler utility to eliminate repetitive try-catch blocks.
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @desc Create a new trade diary entry
 * @route POST /api/trade-journals
 */
const createTradeEntry = asyncHandler(async (req, res, next) => {
    const {
        date,
        symbol,
        market,
        broker,
        type,
        quantity,
        entryPrice, // UI camelCase fields mapping
        exitPrice,
        day,
        segment,
        tradeType,
        stopLoss,
        targetPrice,
        riskReward,
        tradeResult,
        tradeEntryTime,
        tradeExitTime,
        remark1,
        remark2,
        pnl,
        strategy,
        preTradeEmotion,
        postTradeEmotion,
        mistakeTag,
        notes
    } = req.body;

    // 1. Log req.body and req.user for debugging incoming payload context
    console.log("=== [CREATE TRADE ENTRY] Incoming Request Debug ===");
    console.log("req.body:", JSON.stringify(req.body, null, 2));
    console.log("req.user:", req.user ? JSON.stringify(req.user, null, 2) : "Undefined/Missing (Auth Middleware verification check required)");

    // Fallback and user auth handling (Make sure req.user is set via auth middleware)
    const userId = req.user?._id || req.body.user_id;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User context is required to log a diary entry."
        });
    }

    // Mapping incoming frontend camelCase properties into Mongoose Schema snake_case fields
    const newTrade = new TradeJournal({
        user_id: userId,
        date: date || new Date(),
        symbol,
        market,
        broker,
        type,
        quantity,
        entry_price: entryPrice,
        exit_price: exitPrice !== undefined && exitPrice !== '' ? exitPrice : null,
        day,
        segment,
        trade_type: tradeType,
        stop_loss: stopLoss,
        target_price: targetPrice,
        risk_reward: riskReward,
        trade_result: tradeResult,
        trade_entry_time: tradeEntryTime,
        trade_exit_time: tradeExitTime,
        remark_1: remark1,
        remark_2: remark2,
        pnl: pnl !== undefined && pnl !== '' ? Number(pnl) : undefined,
        manual_pnl: pnl !== undefined && pnl !== '',
        strategy_used: strategy,
        pre_trade_emotion: preTradeEmotion,
        post_trade_emotion: postTradeEmotion,
        mistake_tag: mistakeTag,
        notes
    });

    // 2. Wrap save execution inside a localized try-catch block for exact database/validation inspection
    try {
        // Save calculates P&L automatically through the pre-save hook we defined earlier
        await newTrade.save();
    } catch (saveError) {
        // Log the complete error stack in the server console
        console.error("=== [CREATE TRADE ENTRY] Database Save Validation Error ===");
        console.error(saveError.stack || saveError);

        // Collect distinct Mongoose field validation error keys if applicable
        const validationErrors = saveError.errors
            ? Object.keys(saveError.errors).reduce((acc, key) => {
                acc[key] = saveError.errors[key].message;
                return acc;
            }, {})
            : null;

        return res.status(400).json({
            success: false,
            message: saveError.message || "Database validation failed while processing the entry.",
            errors: validationErrors,
            rawErrorName: saveError.name
        });
    }

    res.status(201).json({
        success: true,
        data: newTrade,
        message: "Trade diary entry logged successfully."
    });
});

/**
 * @desc Get all trade diary entries with optional filters and pagination
 * @route GET /api/trade-journals
 */
const getAllTradeEntries = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.query.user_id;
    const { symbol, market, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (userId) filter.user_id = userId;
    if (symbol) filter.symbol = new RegExp(symbol.trim(), 'i');
    if (market) filter.market = market;
    if (status) filter.status = status;

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));

    const [trades, total] = await Promise.all([
        TradeJournal.find(filter)
            .sort({ date: -1 }) // Newest trades first
            .skip(skip)
            .limit(parseInt(limit)),
        TradeJournal.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        data: trades,
        meta: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        },
        message: "Trade journal collection fetched successfully."
    });
});

/**
 * @desc Get a single trade entry by ID
 * @route GET /api/trade-journals/:id
 */
const getTradeEntryById = asyncHandler(async (req, res) => {
    const trade = await TradeJournal.findById(req.params.id);

    if (!trade) {
        return res.status(404).json({
            success: false,
            message: "Trade entry not found."
        });
    }

    res.status(200).json({
        success: true,
        data: trade
    });
});

/**
 * @desc Update/Edit an existing trade journal entry
 * @route PUT /api/trade-journals/:id
 */
const updateTradeEntry = asyncHandler(async (req, res) => {
    const trade = await TradeJournal.findById(req.params.id);

    if (!trade) {
        return res.status(404).json({
            success: false,
            message: "Trade entry not found."
        });
    }

    // Remap UI updates to target DB fields conditionally if provided
    const updates = { ...req.body };
    if (req.body.entryPrice !== undefined) updates.entry_price = req.body.entryPrice;
    if (req.body.exitPrice !== undefined) updates.exit_price = req.body.exitPrice === '' ? null : req.body.exitPrice;
    if (req.body.day !== undefined) updates.day = req.body.day;
    if (req.body.segment !== undefined) updates.segment = req.body.segment;
    if (req.body.tradeType !== undefined) updates.trade_type = req.body.tradeType;
    if (req.body.stopLoss !== undefined) updates.stop_loss = req.body.stopLoss;
    if (req.body.targetPrice !== undefined) updates.target_price = req.body.targetPrice;
    if (req.body.riskReward !== undefined) updates.risk_reward = req.body.riskReward;
    if (req.body.tradeResult !== undefined) updates.trade_result = req.body.tradeResult;
    if (req.body.tradeEntryTime !== undefined) updates.trade_entry_time = req.body.tradeEntryTime;
    if (req.body.tradeExitTime !== undefined) updates.trade_exit_time = req.body.tradeExitTime;
    if (req.body.remark1 !== undefined) updates.remark_1 = req.body.remark1;
    if (req.body.remark2 !== undefined) updates.remark_2 = req.body.remark2;
    if (req.body.pnl !== undefined && req.body.pnl !== '') {
        updates.pnl = Number(req.body.pnl);
        updates.manual_pnl = true;
    }
    if (req.body.strategy !== undefined) updates.strategy_used = req.body.strategy;
    if (req.body.preTradeEmotion !== undefined) updates.pre_trade_emotion = req.body.preTradeEmotion;
    if (req.body.postTradeEmotion !== undefined) updates.post_trade_emotion = req.body.postTradeEmotion;
    if (req.body.mistakeTag !== undefined) updates.mistake_tag = req.body.mistakeTag;

    // Use save() instead of findByIdAndUpdate to trigger the pre('save') calculation hook safely
    Object.assign(trade, updates);
    await trade.save();

    res.status(200).json({
        success: true,
        data: trade,
        message: "Trade entry parameters updated successfully."
    });
});

/**
 * @desc Hard delete a trade log entry
 * @route DELETE /api/trade-journals/:id
 */
const deleteTradeEntry = asyncHandler(async (req, res) => {
    const trade = await TradeJournal.findByIdAndDelete(req.params.id);

    if (!trade) {
        return res.status(404).json({
            success: false,
            message: "Trade entry not found or already deleted."
        });
    }

    res.status(200).json({
        success: true,
        message: "Trade log successfully deleted from system journal."
    });
});

module.exports = {
    createTradeEntry,
    getAllTradeEntries,
    getTradeEntryById,
    updateTradeEntry,
    deleteTradeEntry
};