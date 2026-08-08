import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiVideo, FiPlus, FiTrash2, FiEye, FiClock, FiPlayCircle } from 'react-icons/fi';
import { zoomMeetingService } from '../../../services/api/zoomMeeting.service';

const ZoomMeetingsList = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingInstant, setStartingInstant] = useState(false);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await zoomMeetingService.getAll();
      setMeetings(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch Zoom meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await zoomMeetingService.delete(id);
      toast.success('Meeting deleted successfully');
      fetchMeetings();
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to delete meeting';
      toast.error(msg);
    }
  };

  const handleStartInstant = async () => {
    try {
      setStartingInstant(true);
      const res = await zoomMeetingService.startInstant('Instant Admin Meeting');
      if (res.data) {
        toast.success('Instant meeting started');
        navigate(`/dashboard/zoom-meetings/${res.data._id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to start instant meeting';
      toast.error(msg);
    } finally {
      setStartingInstant(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(45,140,255,0.1)', border: '1px solid rgba(45,140,255,0.2)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiVideo color="#2D8CFF" size={20} />
          </div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Live Meetings</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleStartInstant}
            disabled={startingInstant}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,200,83,0.1)', color: '#00C853', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}
          >
            {startingInstant ? <span style={{ fontSize: '14px' }}>Starting...</span> : <><FiPlayCircle size={16} /> Start Instant</>}
          </button>
          <button
            onClick={() => navigate('/dashboard/zoom-meetings/schedule')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}
          >
            <FiPlus size={16} /> Schedule Meeting
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>
            <FiVideo size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '1.1rem' }}>No meetings found</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>Schedule a new meeting to get started.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', color: '#aaa', fontWeight: 500, fontSize: '0.85rem' }}>TOPIC</th>
                <th style={{ padding: '16px', color: '#aaa', fontWeight: 500, fontSize: '0.85rem' }}>MEETING ID</th>
                <th style={{ padding: '16px', color: '#aaa', fontWeight: 500, fontSize: '0.85rem' }}>DATE & TIME</th>
                <th style={{ padding: '16px', color: '#aaa', fontWeight: 500, fontSize: '0.85rem' }}>STATUS</th>
                <th style={{ padding: '16px', color: '#aaa', fontWeight: 500, fontSize: '0.85rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <motion.tr
                  key={meeting._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <td style={{ padding: '16px', color: '#fff' }}>{meeting.topic}</td>
                  <td style={{ padding: '16px', color: '#ccc', fontFamily: 'monospace' }}>{meeting.zoomMeetingId}</td>
                  <td style={{ padding: '16px', color: '#ccc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiClock size={14} color="#888" />
                      {new Date(meeting.startTime).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: meeting.status === 'Live' ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255,255,255,0.08)',
                      color: meeting.status === 'Live' ? '#ff6b6b' : '#aaa'
                    }}>
                      {meeting.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button
                      onClick={() => navigate(`/dashboard/zoom-meetings/${meeting._id}`)}
                      style={{ background: 'transparent', border: 'none', color: '#2D8CFF', cursor: 'pointer', marginRight: '16px' }}
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(meeting._id)}
                      style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                      title="Delete Meeting"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ZoomMeetingsList;
