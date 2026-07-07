const Broker = require('../models/broker.model');

// 1. Create a new broker
exports.createBroker = async (req, res) => {
    try {
        const broker = new Broker(req.body);
        await broker.save();
        res.status(201).json({ success: true, message: "Broker added successfully", data: broker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get All Brokers (Admin Panel ke liye)
exports.getAllBrokers = async (req, res) => {
    try {
        const brokers = await Broker.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: brokers.length, data: brokers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get Active Brokers (Frontend Dropdown ke liye)
exports.getActiveBrokers = async (req, res) => {
    try {
        const brokers = await Broker.find({ is_active: true }).select('name logo options_charge equity_intraday_charge');
        res.status(200).json({ success: true, count: brokers.length, data: brokers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Get Single Broker by ID
exports.getBrokerById = async (req, res) => {
    try {
        const broker = await Broker.findById(req.params.id);
        if (!broker) return res.status(404).json({ success: false, message: "Broker not found" });
        res.status(200).json({ success: true, data: broker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Edit/Update Broker Details
exports.updateBroker = async (req, res) => {
    try {
        const broker = await Broker.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Returns updated document
            runValidators: true
        });
        if (!broker) return res.status(404).json({ success: false, message: "Broker not found" });

        res.status(200).json({ success: true, message: "Broker updated successfully", data: broker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Update Broker Status (Active/Inactive Toggle)
exports.updateBrokerStatus = async (req, res) => {
    try {
        const { is_active } = req.body;
        const broker = await Broker.findByIdAndUpdate(
            req.params.id,
            { is_active },
            { new: true }
        );
        if (!broker) return res.status(404).json({ success: false, message: "Broker not found" });

        res.status(200).json({ success: true, message: `Broker status changed to ${is_active ? 'Active' : 'Inactive'}`, data: broker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Delete Broker
// Note: Real world me aam taur par broker ko soft-delete (inactive) karte hain taaki purane trades ka relation na tute. 
exports.deleteBroker = async (req, res) => {
    try {
        const broker = await Broker.findByIdAndDelete(req.params.id);
        if (!broker) return res.status(404).json({ success: false, message: "Broker not found" });

        res.status(200).json({ success: true, message: "Broker deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};