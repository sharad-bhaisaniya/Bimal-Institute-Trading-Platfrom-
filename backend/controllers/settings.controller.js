const SmsSetting = require('../models/SmsSetting');
const RazorpaySetting = require('../models/RazorpaySetting');
const DigioSetting = require('../models/DigioSetting');
const YoutubeSetting = require('../models/YoutubeSetting');

const createCrudController = (Model, configKey) => ({
  getAll: async (req, res) => {
    try {
      const items = await Model.find();
      res.status(200).json({ data: { [configKey]: items } });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching settings', error });
    }
  },
  create: async (req, res) => {
    try {
      const { isActive } = req.body;
      if (isActive) {
        await Model.updateMany({}, { isActive: false });
      }
      const newItem = new Model(req.body);
      await newItem.save();
      res.status(201).json({ data: newItem });
    } catch (error) {
      res.status(500).json({ message: 'Error creating setting', error });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      if (isActive) {
        await Model.updateMany({}, { isActive: false });
      }
      const updated = await Model.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ data: updated });
    } catch (error) {
      res.status(500).json({ message: 'Error updating setting', error });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Model.findByIdAndDelete(id);
      res.status(200).json({ data: { message: 'Setting deleted successfully' } });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting setting', error });
    }
  }
});

exports.sms = createCrudController(SmsSetting, 'smsConfigs');
exports.razorpay = createCrudController(RazorpaySetting, 'razorpayConfigs');
exports.digio = createCrudController(DigioSetting, 'digioConfigs');
exports.youtube = createCrudController(YoutubeSetting, 'youtubeConfigs');
