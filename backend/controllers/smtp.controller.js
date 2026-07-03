const SmtpSetting = require('../models/SmtpSetting');

exports.getAllSmtp = async (req, res) => {
  try {
    const settings = await SmtpSetting.find();
    res.status(200).json({ data: { smtpConfigs: settings } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SMTP settings', error });
  }
};

exports.createSmtp = async (req, res) => {
  try {
    const { host, port, user, pass, isActive } = req.body;
    
    if (isActive) {
      await SmtpSetting.updateMany({}, { isActive: false });
    }

    const newSmtp = new SmtpSetting({ host, port, user, pass, isActive });
    await newSmtp.save();
    
    res.status(201).json({ data: newSmtp });
  } catch (error) {
    res.status(500).json({ message: 'Error creating SMTP setting', error });
  }
};

exports.updateSmtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive) {
      await SmtpSetting.updateMany({}, { isActive: false });
    }

    const updated = await SmtpSetting.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating SMTP setting', error });
  }
};

exports.deleteSmtp = async (req, res) => {
  try {
    const { id } = req.params;
    await SmtpSetting.findByIdAndDelete(id);
    res.status(200).json({ data: { message: 'SMTP setting deleted successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting SMTP setting', error });
  }
};
