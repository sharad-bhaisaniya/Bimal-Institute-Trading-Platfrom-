import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiClock, FiVideo, FiPlayCircle, FiCopy, FiCheck, FiTv } from 'react-icons/fi';
import { zoomMeetingService } from '../../../services/api/zoomMeeting.service';
import axios from 'axios';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
const ZoomMeetingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  useEffect(() => {
    fetchMeetingDetails();
  }, [id]);

  const fetchMeetingDetails = async () => {
    try {
      const res = await zoomMeetingService.getById(id);
      setMeeting(res.data);
    } catch (error) {
      toast.error('Failed to fetch meeting details');
      navigate('/dashboard/zoom-meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (meeting?.joinUrl) {
      navigator.clipboard.writeText(meeting.joinUrl);
      setCopied(true);
      toast.success('Join link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Embedded Zoom Web Meeting SDK implementation
  const handleLaunchMeeting = async () => {
    try {
      setIsMeetingActive(true);
      console.log('ZoomMtgEmbedded Object:', ZoomMtgEmbedded);

      let client;
      if (typeof ZoomMtgEmbedded.createClient === 'function') {
        client = ZoomMtgEmbedded.createClient();
      } else if (ZoomMtgEmbedded.default && typeof ZoomMtgEmbedded.default.createClient === 'function') {
        client = ZoomMtgEmbedded.default.createClient();
      } else {
        throw new Error("createClient not found on ZoomMtgEmbedded object. Check console for object structure.");
      }

      // 1. Fetch signature from your existing backend API 
      // (Reuses your authentication and logic mapping to meeting ID and role)
      const signatureResponse = await zoomMeetingService.getSignature({
        meetingNumber: meeting.zoomMeetingId,
        role: meeting.startUrl ? 1 : 0 // 1 for Host, 0 for Attendee
      });

      if (!signatureResponse?.signature || !signatureResponse?.sdkKey) {
        throw new Error(`Invalid response from server: Missing signature or sdkKey. Check your backend zoom settings. Response: ${JSON.stringify(signatureResponse)}`);
      }

      const meetingSDKElement = document.getElementById('meetingSDKElement');

      // 2. Initialize the SDK inside our embedded layout container
      await client.init({
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        patchJsMedia: true,
        leaveUrl: window.location.href
      });

      // 3. Join the live stream canvas seamlessly
      await client.join({
        signature: signatureResponse.signature,
        meetingNumber: String(meeting.zoomMeetingId).replace(/\s/g, ''), // Must match backend sanitized Number exactly
        password: meeting.password || '',
        userName: 'Admin Host',
        userEmail: 'admin@metawish.com'
      });

      toast.success('Meeting launched successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to initialize Zoom Embedded SDK');
      setIsMeetingActive(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#888', textAlign: 'center' }}>Loading meeting details...</div>;
  }

  if (!meeting) return null;

  return (
    <div style={{ padding: '20px', maxWidth: isMeetingActive ? '100%' : '800px' }}>
      <button
        onClick={() => {
          if (isMeetingActive) {
            if (window.confirm("Are you sure you want to leave the active meeting room?")) {
              window.location.reload();
            }
          } else {
            navigate('/dashboard/zoom-meetings');
          }
        }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', marginBottom: '24px', padding: 0 }}
      >
        <FiArrowLeft /> {isMeetingActive ? 'Exit Live Screen' : 'Back to Meetings'}
      </button>

      {/* Main UI Container Toggle between Details & Live Call canvas */}
      {!isMeetingActive ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: meeting.status === 'Live' ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255,255,255,0.08)',
                  color: meeting.status === 'Live' ? '#ff6b6b' : '#aaa'
                }}>
                  {meeting.status}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#aaa', fontSize: '0.9rem' }}>
                  <FiClock size={14} /> {new Date(meeting.startTime).toLocaleString()}
                </span>
              </div>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '2rem', fontWeight: 700 }}>{meeting.topic}</h2>
            </div>

            {meeting.startUrl && (
              <button
                onClick={handleLaunchMeeting}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#00C853', color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '12px 24px', fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,200,83,0.3)', cursor: 'pointer'
                }}
              >
                <FiPlayCircle size={20} /> Start Meeting Here
              </button>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiVideo color="var(--primary)" /> Meeting Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Meeting ID</div>
                <div style={{ color: '#fff', fontSize: '1rem', fontFamily: 'monospace' }}>{meeting.zoomMeetingId}</div>

                <div style={{ color: '#888', fontSize: '0.95rem' }}>Password</div>
                <div style={{ color: '#fff', fontSize: '1rem' }}>{meeting.password || 'None'}</div>

                <div style={{ color: '#888', fontSize: '0.95rem' }}>Duration</div>
                <div style={{ color: '#fff', fontSize: '1rem' }}>{meeting.duration} Minutes</div>

                <div style={{ color: '#888', fontSize: '0.95rem' }}>Join URL</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#2D8CFF', wordBreak: 'break-all', fontSize: '0.95rem' }}>{meeting.joinUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Copy Link"
                  >
                    {copied ? <FiCheck color="#00C853" /> : <FiCopy />}
                  </button>
                </div>
              </div>

              {meeting.agenda && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: '8px' }}>Agenda</div>
                  <div style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.5', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                    {meeting.agenda}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '1.1rem' }}>Settings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { key: 'hostVideo', label: 'Host Video' },
                  { key: 'participantVideo', label: 'Participant Video' },
                  { key: 'waitingRoom', label: 'Waiting Room' },
                  { key: 'muteUponEntry', label: 'Mute on Entry' },
                  { key: 'joinBeforeHost', label: 'Join Before Host' },
                ].map(setting => (
                  <div key={setting.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: meeting.settings?.[setting.key] ? '#00C853' : '#ff4d4d'
                    }} />
                    <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{setting.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* The Embedded Canvas Window. Zoom Meeting SDK renders control layout, video streams, mute toggle, leaves, etc directly inside here */
        <div style={{ width: '100%', height: 'calc(100vh - 120px)', background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
          <div id="meetingSDKElement" style={{ width: '100%', height: '100%' }}></div>
        </div>
      )}
    </div>
  );
};

export default ZoomMeetingView;