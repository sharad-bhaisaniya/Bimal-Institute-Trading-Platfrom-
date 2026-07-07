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
const createTradeEntry = asyncHandler(async (req, res) => {
    const {
        date,
        symbol,
        market,
        broker,
        type,
        quantity,
        entryPrice, // UI camelCase fields mapping
        exitPrice,
        strategy,
        preTradeEmotion,
        postTradeEmotion,
        mistakeTag,
        notes
    } = req.body;

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
        strategy_used: strategy,
        pre_trade_emotion: preTradeEmotion,
        post_trade_emotion: postTradeEmotion,
        mistake_tag: mistakeTag,
        notes
    });

    // Save calculates P&L automatically through the pre-save hook we defined earlier
    await newTrade.save();

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