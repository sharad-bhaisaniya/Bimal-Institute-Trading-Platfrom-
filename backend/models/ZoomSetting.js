const mongoose = require('mongoose');

const zoomSettingSchema = new mongoose.Schema({
  accountId: { 
    type: String, 
    required: true 
  },
  clientId: { 
    type: String, 
    required: true 
  },
  clientSecret: { 
    type: String, 
    required: true 
  },
  credentialType: { 
    type: String, 
    enum: ['Normal', 'SDK'], 
    default: 'Normal',
    description: "Indicates whether these credentials are for a regular Server-to-Server OAuth app or an SDK app"
  },
  sdkKey: { 
    type: String, 
    default: '' 
  },
  sdkSecret: { 
    type: String, 
    default: '' 
  },
  label: { 
    type: String, 
    default: 'Zoom Credentials' 
  },
  isActive: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('ZoomSetting', zoomSettingSchema);
