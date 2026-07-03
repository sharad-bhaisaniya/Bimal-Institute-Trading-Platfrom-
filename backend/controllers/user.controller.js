const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role').select('-password');
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role').select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      role,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check authorization: only super admin or the user themselves can update
    if (req.user.role.name !== 'Super Admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
    }

    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password').populate('role');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ data: { message: 'User deleted successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
