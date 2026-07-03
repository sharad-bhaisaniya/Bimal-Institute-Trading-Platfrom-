const Permission = require('../models/Permission');

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ data: permissions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permissions', error });
  }
};
