const Trade = require('../models/trade.model');
const Broker = require('../models/broker.model');

// 1. Create/Log a new trade
exports.createTrade = async (req, res) => {
    try {
        const trade = new Trade(req.body);
        await trade.save();
        res.status(201).json({ success: true, message: "Trade logged successfully", data: trade });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get All Trades (with optional filters like ?status=OPEN & ?market_type=NSE)
exports.getAllTrades = async (req, res) => {
    try {
        // Query filters (Aap URL me ?status=OPEN bhejenge to sirf open trades aayenge)
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.exchange) filter.exchange = req.query.exchange;
        // if (req.user) filter.user_id = req.user._id; // Real scenario me current user ka filter lagana

        const trades = await Trade.find(filter)
            .populate('broker_id', 'name logo') // Broker ka naam aur logo fetch karega
            .sort({ trade_date: -1 }); // Latest trades pehle aayenge

        res.status(200).json({ success: true, count: trades.length, data: trades });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get Single Trade by ID
exports.getTradeById = async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.id).populate('broker_id', 'name logo');
        if (!trade) return res.status(404).json({ success: false, message: "Trade not found" });

        res.status(200).json({ success: true, data: trade });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Edit/Update General Trade Details (e.g., Update Stop Loss, Target, Notes, Tags)
exports.updateTrade = async (req, res) => {
    try {
        const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!trade) return res.status(404).json({ success: false, message: "Trade not found" });

        res.status(200).json({ success: true, message: "Trade details updated", data: trade });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Update Trade Status & Exits (P&L Calculation Logic)
exports.updateTradeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { exit_price, exit_quantity, status, trade_result } = req.body;

        const trade = await Trade.findById(id);
        if (!trade) return res.status(404).json({ success: false, message: "Trade not found" });

        trade.exit_price = exit_price || trade.exit_price;
        trade.exit_quantity = exit_quantity || trade.exit_quantity;
        trade.status = status || trade.status;
        if (trade_result) trade.trade_result = trade_result;

        // Auto P&L Calculation if status is CLOSED
        if (status === 'CLOSED' && trade.exit_price && trade.exit_quantity) {
            const pnlMultiplier = trade.trade_type === 'BUY' ? 1 : -1;
            trade.gross_pnl = (trade.exit_price - trade.entry_price) * trade.exit_quantity * pnlMultiplier;

            // Calculate basic brokerage dynamically
            const broker = await Broker.findById(trade.broker_id);
            if (broker) {
                // Aap is logic ko segment ke hisaab se (Intraday/Options) modify kar sakte hain
                trade.brokerage_charges = broker.options_charge * 2; // Default assume Option Buy & Sell
                trade.net_pnl = trade.gross_pnl - trade.brokerage_charges;
            }

            // Auto define Trade Result (Profit/Loss)
            if (trade.net_pnl > 0) trade.trade_result = 'PROFIT';
            else if (trade.net_pnl < 0) trade.trade_result = 'LOSS';
            else trade.trade_result = 'BREAK_EVEN';
        }

        await trade.save();
        res.status(200).json({ success: true, message: "Trade status updated successfully", data: trade });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Delete Trade
exports.deleteTrade = async (req, res) => {
    try {
        const trade = await Trade.findByIdAndDelete(req.params.id);
        if (!trade) return res.status(404).json({ success: false, message: "Trade not found" });

        res.status(200).json({ success: true, message: "Trade deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};