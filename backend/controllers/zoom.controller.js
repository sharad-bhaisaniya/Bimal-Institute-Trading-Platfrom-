const zoomService = require('../services/zoom.service');
const ZoomMeeting = require('../models/ZoomMeeting');
const ZoomSetting = require('../models/ZoomSetting');

exports.createMeeting = async (req, res) => {
  try {
    const { topic, agenda, startTime, duration, timezone, password, settings } = req.body;

    const meetingData = {
      topic: topic || 'New Zoom Meeting',
      type: 2, // Scheduled meeting
      start_time: startTime || new Date().toISOString(),
      duration: duration || 60,
      timezone: timezone || 'Asia/Kolkata',
      password: password || '',
      agenda: agenda || '',
      settings: {
        host_video: settings?.hostVideo ?? true,
        participant_video: settings?.participantVideo ?? true,
        join_before_host: settings?.joinBeforeHost ?? false,
        mute_upon_entry: settings?.muteUponEntry ?? true,
        watermark: false,
        use_pmi: false,
        approval_type: 2, // No registration required
        waiting_room: settings?.waitingRoom ?? true,
        auto_recording: settings?.autoRecording ?? 'none'
      }
    };

    // Call Zoom API
    const zoomResponse = await zoomService.createMeeting(meetingData);

    // Save to DB
    const newMeeting = new ZoomMeeting({
      meetingId: zoomResponse.uuid,
      zoomMeetingId: zoomResponse.id,
      topic: zoomResponse.topic,
      agenda: zoomResponse.agenda,
      hostId: req.user._id, // Assuming req.user is populated via auth middleware
      joinUrl: zoomResponse.join_url,
      startUrl: zoomResponse.start_url,
      password: zoomResponse.password,
      startTime: zoomResponse.start_time,
      duration: zoomResponse.duration,
      timezone: zoomResponse.timezone,
      status: 'Scheduled',
      settings: {
        hostVideo: zoomResponse.settings.host_video,
        participantVideo: zoomResponse.settings.participant_video,
        joinBeforeHost: zoomResponse.settings.join_before_host,
        muteUponEntry: zoomResponse.settings.mute_upon_entry,
        waitingRoom: zoomResponse.settings.waiting_room,
        autoRecording: zoomResponse.settings.auto_recording
      }
    });

    await newMeeting.save();

    res.status(201).json({
      message: 'Meeting scheduled successfully',
      data: newMeeting
    });

  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    res.status(500).json({ message: 'Error scheduling meeting', error: error.message });
  }
};

exports.startInstantMeeting = async (req, res) => {
  try {
    const { topic } = req.body;

    const meetingData = {
      topic: topic || 'Instant Zoom Meeting',
      type: 1, // Instant meeting
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: false
      }
    };

    // Call Zoom API
    const zoomResponse = await zoomService.createMeeting(meetingData);

    // Save to DB
    const newMeeting = new ZoomMeeting({
      meetingId: zoomResponse.uuid,
      zoomMeetingId: zoomResponse.id,
      topic: zoomResponse.topic,
      hostId: req.user._id,
      joinUrl: zoomResponse.join_url,
      startUrl: zoomResponse.start_url,
      password: zoomResponse.password,
      startTime: new Date(),
      duration: 60,
      status: 'Live'
    });

    await newMeeting.save();

    res.status(201).json({
      message: 'Instant meeting started',
      data: newMeeting
    });

  } catch (error) {
    console.error('Error starting instant meeting:', error);
    res.status(500).json({ message: 'Error starting instant meeting', error: error.message });
  }
};

exports.generateSignature = async (req, res) => {
  try {
    const { meetingNumber, role } = req.body;
    
    if (!meetingNumber) {
      return res.status(400).json({ message: 'Meeting number is required' });
    }

    const signature = await zoomService.generateSdkSignature(meetingNumber, role || 0);

    // We also return the active Zoom Settings client key (SDK key) to initialize the client
    const credentials = await ZoomSetting.findOne({ isActive: true });
    const sdkKey = credentials?.sdkKey || credentials?.clientId || '';

    res.status(200).json({
      signature,
      sdkKey
    });

  } catch (error) {
    console.error('Error generating SDK signature:', error);
    res.status(500).json({ message: 'Error generating signature', error: error.message });
  }
};

exports.getMeeting = async (req, res) => {
  try {
    const meeting = await ZoomMeeting.findById(req.params.id).populate('hostId', 'firstName lastName email profileImage');
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.status(200).json({ data: meeting });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meeting details', error: error.message });
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    
    const meetings = await ZoomMeeting.find(filter)
      .populate('hostId', 'firstName lastName email profileImage')
      .sort({ startTime: -1 });

    res.status(200).json({ data: meetings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meetings', error: error.message });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    // We only update our local DB records for this simplified implementation
    // For production, you would also PATCH https://api.zoom.us/v2/meetings/:id
    const updated = await ZoomMeeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.status(200).json({ message: 'Meeting updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating meeting', error: error.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const deleted = await ZoomMeeting.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    // Note: To be fully compliant, also call Zoom API to DELETE the meeting on their servers
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meeting', error: error.message });
  }
};
