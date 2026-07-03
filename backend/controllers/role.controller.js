const Role = require('../models/Role');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.status(200).json({ data: roles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error });
  }
};

exports.getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json({ data: role });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching role', error });
  }
};

exports.createRole = async (req, res) => {
  try {
    const newRole = new Role(req.body);
    await newRole.save();
    res.status(201).json({ data: newRole });
  } catch (error) {
    res.status(500).json({ message: 'Error creating role', error });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRole) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json({ data: updatedRole });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    
    if (role.isSystem) {
      return res.status(400).json({ message: 'Cannot delete system roles' });
    }

    await role.deleteOne();
    res.status(200).json({ data: { message: 'Role deleted successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error });
  }
};
