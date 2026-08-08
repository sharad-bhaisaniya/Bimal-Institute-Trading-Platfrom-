import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiVideo } from 'react-icons/fi';
import { zoomMeetingService } from '../../../services/api/zoomMeeting.service';

const ZoomMeetingForm = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    topic: '',
    agenda: '',
    duration: 60,
    startTime: '',
    password: '',
    settings: {
      hostVideo: true,
      participantVideo: true,
      joinBeforeHost: false,
      muteUponEntry: true,
      waitingRoom: true
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setForm(prev => ({
      ...prev,
      settings: { ...prev.settings, [name]: checked }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic) {
      toast.error('Meeting topic is required');
      return;
    }

    try {
      setSaving(true);
      const data = {
        ...form,
        // Convert local datetime to ISO if provided, else backend will handle
        startTime: form.startTime ? new Date(form.startTime).toISOString() : new Date().toISOString()
      };
      await zoomMeetingService.create(data);
      toast.success('Meeting scheduled successfully');
      navigate('/dashboard/zoom-meetings');
    } catch (error) {
      toast.error('Failed to schedule meeting');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '0.95rem',
    width: '100%', boxSizing: 'border-box', outline: 'none'
  };

  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#aaa', fontWeight: 500 };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <button
        onClick={() => navigate('/dashboard/zoom-meetings')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', marginBottom: '24px', padding: 0 }}
      >
        <FiArrowLeft /> Back to Meetings
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(45,140,255,0.1)', border: '1px solid rgba(45,140,255,0.2)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiVideo color="#2D8CFF" size={20} />
        </div>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Schedule Zoom Meeting</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '32px' }}>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Topic <span style={{ color: '#ff4d4d' }}>*</span></label>
          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g. React Native Masterclass"
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Agenda (Optional)</label>
          <textarea
            name="agenda"
            value={form.agenda}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            placeholder="Brief description of the meeting"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={labelStyle}>Date & Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Duration (Minutes)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              style={inputStyle}
              min="15"
              step="15"
            />
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={labelStyle}>Meeting Password (Optional)</label>
          <input
            type="text"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Leave blank for auto-generated"
          />
        </div>

        <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Security & Settings</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {[
            { name: 'hostVideo', label: 'Host Video On' },
            { name: 'participantVideo', label: 'Participant Video On' },
            { name: 'waitingRoom', label: 'Enable Waiting Room' },
            { name: 'muteUponEntry', label: 'Mute Participants Upon Entry' },
            { name: 'joinBeforeHost', label: 'Allow Join Before Host' }
          ].map(setting => (
            <label key={setting.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                name={setting.name}
                checked={form.settings[setting.name]}
                onChange={handleSettingChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              {setting.label}
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard/zoom-meetings')}
            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '8px', padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}
          >
            <FiSave size={18} /> {saving ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZoomMeetingForm;
