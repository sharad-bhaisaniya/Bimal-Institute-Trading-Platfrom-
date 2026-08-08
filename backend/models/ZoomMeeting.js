const mongoose = require('mongoose');

const zoomMeetingSchema = new mongoose.Schema({
  meetingId: { 
    type: String, 
    required: true,
    unique: true
  },
  zoomMeetingId: {
    type: Number,
    required: true
  },
  topic: { 
    type: String, 
    required: true 
  },
  agenda: { 
    type: String 
  },
  hostId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinUrl: { 
    type: String 
  },
  startUrl: { 
    type: String 
  },
  password: { 
    type: String 
  },
  startTime: { 
    type: Date 
  },
  duration: { 
    type: Number, // in minutes
    default: 60
  },
  timezone: { 
    type: String,
    default: 'Asia/Kolkata'
  },
  status: { 
    type: String,
    enum: ['Scheduled', 'Live', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  settings: {
    hostVideo: { type: Boolean, default: true },
    participantVideo: { type: Boolean, default: true },
    joinBeforeHost: { type: Boolean, default: false },
    muteUponEntry: { type: Boolean, default: true },
    waitingRoom: { type: Boolean, default: true },
    autoRecording: { type: String, enum: ['local', 'cloud', 'none'], default: 'none' }
  }
}, { timestamps: true });

module.exports = mongoose.model('ZoomMeeting', zoomMeetingSchema);
