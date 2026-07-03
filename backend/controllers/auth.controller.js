const User = require('../models/User');
const Otp = require('../models/Otp');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 mins expiry

    // Save OTP to DB
    await Otp.findOneAndUpdate(
      { phone },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    const { sendOtpSms } = require('../utils/smsService');
    const smsSent = await sendOtpSms(phone, otp);

    if (!smsSent) {
      console.warn('SMS sending failed, but OTP was generated.');
    }

    res.status(200).json({ message: 'OTP sent successfully' }); // Removed otp from response
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }
};

exports.verifyAndRegister = async (req, res) => {
  try {
    const { phone, otp, firstName, lastName, email, password, roleName } = req.body;

    const otpRecord = await Otp.findOne({ phone });
    if (!otpRecord) {
      return res.status(400).json({ message: 'No OTP requested for this number' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get requested role or default to Student
    let assignedRole = await Role.findOne({ name: roleName || 'Student' });
    if (!assignedRole) {
      assignedRole = await Role.findOne({ name: 'Student' }); // fallback
    }

    const newUser = new User({
      phone,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: assignedRole ? assignedRole._id : undefined
    });

    await newUser.save();
    
    // Delete OTP after successful registration
    await Otp.deleteOne({ phone });

    // Send Welcome Email using the active SMTP settings
    if (email) {
      await sendEmail({
        to: email,
        subject: 'Welcome to Bimal Institute',
        html: `<h1>Welcome ${firstName}!</h1><p>Your account has been created successfully.</p>`
      });
    }

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        accessToken: token,
        user: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          email: newUser.email,
          role: assignedRole,
          profileImage: newUser.profileImage
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying and registering', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    
    // Allow login by either phone or email
    const user = await User.findOne({ $or: [{ phone }, { email }] }).populate('role');
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
};
