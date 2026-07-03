import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCalendar, FiVideo, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { courseService } from '../../../services/api/course.service';
import { BASE_URL } from '../../../services/api/api';
import { CustomToast } from '../../../components/common/CustomToast';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, currRes] = await Promise.all([
          courseService.getCourse(id),
          courseService.getCurriculum(id)
        ]);
        setCourse(courseRes.data.data);
        const lectures = currRes.data.data || [];
        setCurriculum(lectures);
        
        // Auto-select first video if available
        if (lectures.length > 0) {
          setActiveVideo(lectures[0]);
        }
      } catch (error) {
        toast.error(<CustomToast title="Error" message="Failed to load playlist" />);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const formatDuration = (isoDuration) => {
    if (!isoDuration) return '0:00';
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const h = match[1] ? parseInt(match[1]) : 0;
    const m = match[2] ? parseInt(match[2]) : 0;
    const s = match[3] ? parseInt(match[3]) : 0;
    
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <div style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>Loading playlist...</div>;
  }

  if (!course) {
    return <div style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>Course not found.</div>;
  }

  return (
    <div style={{ padding: '0', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexShrink: 0 }}>
        <button onClick={() => navigate('/dashboard/courses')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>{course.title}</h1>
          <p style={{ color: '#888', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>{curriculum.length} Videos • {course.playlistId ? 'Imported from YouTube' : 'Manual Course'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        {/* Main Video Player Area */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {activeVideo ? (
            <div style={{ backgroundColor: '#111', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
                {activeVideo.embedUrl ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={activeVideo.embedUrl} 
                    title={activeVideo.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : activeVideo.videoFile ? (
                  <video 
                    width="100%" 
                    height="100%" 
                    controls 
                   src={`${BASE_URL}${activeVideo.videoFile}`}
                  ></video>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    No playable video available
                  </div>
                )}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.25rem' }}>{activeVideo.title}</h2>
                <div style={{ display: 'flex', gap: '1.5rem', color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {activeVideo.channelTitle && <span>Channel: <span style={{ color: '#fff' }}>{activeVideo.channelTitle}</span></span>}
                  {activeVideo.viewCount > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiEye /> {parseInt(activeVideo.viewCount).toLocaleString()} views</span>}
                  {activeVideo.publishedAt && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiCalendar /> {new Date(activeVideo.publishedAt).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', border: '1px solid rgba(255,255,255,0.05)' }}>
              Select a video from the playlist to watch
            </div>
          )}
        </div>

        {/* Playlist Sidebar */}
        <div style={{ flex: '1', backgroundColor: '#111', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', minWidth: '350px' }}>
          <div style={{ padding: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Playlist Videos</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {curriculum.length === 0 ? (
              <div style={{ color: '#666', textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem' }}>No videos found in this course.</div>
            ) : (
              curriculum.map((video, index) => {
                const isActive = activeVideo?._id === video._id;
                return (
                  <div 
                    key={video._id} 
                    onClick={() => setActiveVideo(video)}
                    style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      padding: '0.75rem', 
                      borderRadius: '0.75rem', 
                      cursor: 'pointer',
                      background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '120px', flexShrink: 0, aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', position: 'relative', backgroundColor: '#000' }}>
                      {video.thumbnail ? (
                        <img src={video.thumbnail.startsWith('http') ? video.thumbnail : `${BASE_URL}${video.thumbnail}`} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#222' }}>
                          <FiVideo color="#555" />
                        </div>
                      )}
                      {video.duration && (
                        <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.65rem', padding: '2px 4px', borderRadius: '4px' }}>
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <div style={{ color: isActive ? 'var(--primary)' : '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.2' }}>
                        {index + 1}. {video.title}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.75rem' }}>
                        {video.channelTitle}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
