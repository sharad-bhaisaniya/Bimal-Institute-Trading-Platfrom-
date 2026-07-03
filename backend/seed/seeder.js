require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bimalinstitute';

const seedAdminUser = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    
    const adminEmail = 'admin@example.com';
    const adminPhone = '9876543210';
    
    // Check if user already exists
    const existingAdmin = await User.findOne({ $or: [{ email: adminEmail }, { phone: adminPhone }] });
    
    if (existingAdmin) {
      console.log('Super Admin user already exists. Seeding skipped.');
      process.exit(0);
      return;
    }

    // Check if Super Admin role exists
    let adminRole = await Role.findOne({ name: 'Super Admin' });
    if (!adminRole) {
      adminRole = new Role({
        name: 'Super Admin',
        description: 'Has all permissions',
        isSystem: true,
        permissions: [] 
      });
      await adminRole.save();
      console.log('Super Admin role created.');
    }

    // Create the Super Admin user
    const hashedPassword = await bcrypt.hash('11111111', 10);
    const newAdmin = new User({
      firstName: 'Super',
      lastName: 'admin',
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: adminRole._id,
      isActive: true
    });

    await newAdmin.save();
    console.log('Super Admin user created successfully.');
    
    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
    process.exit(1);
  }
};

seedAdminUser();
