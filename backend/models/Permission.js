const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'create_users'
  module: { type: String, required: true }, // e.g., 'Users'
  action: { type: String, required: true }, // e.g., 'create'
  desc: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);
