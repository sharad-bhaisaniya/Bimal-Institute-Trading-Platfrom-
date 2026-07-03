import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiYoutube, FiDownloadCloud, FiCheckCircle, FiPlayCircle, FiClock, FiCalendar } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { youtubeService } from '../../../services/api/youtube.service';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { CustomToast } from '../../../components/common/CustomToast';

const YouTubeImport = () => {
  const navigate = useNavigate();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [playlistData, setPlaylistData] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const playlistUrl = watch('playlistUrl');
  const courseTitle = watch('courseTitle');

  const onPreview = async (data) => {
    setIsPreviewLoading(true);
    setPlaylistData(null);
    setSelectedVideos([]);
    try {
      const res = await youtubeService.previewPlaylist(data.playlistUrl);
      const videos = res.data.data.videos;
      setPlaylistData(res.data.data);
      // Auto-select all by default
      setSelectedVideos(videos.map(v => v.videoId));
      toast.success(<CustomToast title="Preview Loaded" message={`Found ${videos.length} videos in playlist.`} />);
    } catch (error) {
      toast.error(<CustomToast title="Error" message={error.response?.data?.message || 'Failed to fetch playlist'} />);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked && playlistData) {
      setSelectedVideos(playlistData.videos.map(v => v.videoId));
    } else {
      setSelectedVideos([]);
    }
  };

  const handleSelectVideo = (videoId) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };

  const onSync = async () => {
    if (selectedVideos.length === 0) {
      return toast.warning(<CustomToast title="Warning" message="Please select at least one video to import." />);
    }

    setIsSyncing(true);
    try {
      const videosToSync = playlistData.videos.filter(v => selectedVideos.includes(v.videoId));
      const res = await youtubeService.syncPlaylist(playlistData.playlistId, courseTitle, videosToSync);
      const { courseId, importedCount, updatedCount } = res.data.data;
      
      toast.success(<CustomToast title="Sync Complete" message={`Imported ${importedCount} new, updated ${updatedCount}.`} />);
      navigate(`/dashboard/courses/builder/${courseId}`);
    } catch (error) {
      toast.error(<CustomToast title="Error" message={error.response?.data?.message || 'Failed to sync playlist'} />);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDuration = (isoDuration) => {
    // Basic ISO 8601 duration parser (PT1H2M3S -> 1:02:03)
    if (!isoDuration) return '0:00';
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const h = match[1] ? parseInt(match[1]) : 0;
    const m = match[2] ? parseInt(match[2]) : 0;
    const s = match[3] ? parseInt(match[3]) : 0;
    
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/dashboard/courses')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiYoutube color="#ff0000" /> YouTube Playlist Import
          </h1>
          <p style={{ color: '#888', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Auto-sync entire playlists into your LMS effortlessly.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        
        {/* Input Form */}
        <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <form onSubmit={handleSubmit(onPreview)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 2 }}>
                <Input 
                  label="YouTube Playlist URL *" 
                  placeholder="https://www.youtube.com/playlist?list=..." 
                  {...register('playlistUrl', { required: 'Playlist URL is required' })} 
                  error={errors.playlistUrl?.message} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input 
                  label="Course Title (Optional)" 
                  placeholder="Overrides playlist title..." 
                  {...register('courseTitle')} 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" isLoading={isPreviewLoading} icon={FiDownloadCloud}>
                Preview Videos
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Results */}
        {playlistData && (
          <div style={{ backgroundColor: '#111', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Found {playlistData.totalVideos} Videos</h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#888', fontSize: '0.85rem' }}>Select the videos you want to import.</p>
              </div>
              <Button onClick={onSync} isLoading={isSyncing} icon={FiCheckCircle}>
                Sync Selected ({selectedVideos.length})
              </Button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '1rem', width: '50px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedVideos.length === playlistData.videos.length && playlistData.videos.length > 0} 
                        onChange={handleSelectAll} 
                        style={{ accentColor: 'var(--primary)' }}
                      />
                    </th>
                    <th style={{ padding: '1rem', color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Thumbnail</th>
                    <th style={{ padding: '1rem', color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Title</th>
                    <th style={{ padding: '1rem', color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Duration</th>
                    <th style={{ padding: '1rem', color: '#888', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Published</th>
                  </tr>
                </thead>
                <tbody>
                  {playlistData.videos.map((video, index) => (
                    <tr key={video.videoId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: selectedVideos.includes(video.videoId) ? 'rgba(255,255,255,0.03)' : 'transparent', transition: 'all 0.2s' }}>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedVideos.includes(video.videoId)} 
                          onChange={() => handleSelectVideo(video.videoId)} 
                          style={{ accentColor: 'var(--primary)' }}
                        />
                      </td>
                      <td style={{ padding: '1rem', width: '150px' }}>
                        <div style={{ width: '120px', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', position: 'relative', background: '#000' }}>
                          <img src={video.thumbnail} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '4px' }}>
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: '#fff', fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.title}</div>
                        <div style={{ color: '#666', fontSize: '0.8rem' }}>{video.channelTitle}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#aaa', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FiClock size={14} /> {formatDuration(video.duration)}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#aaa', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FiCalendar size={14} /> {new Date(video.publishedAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeImport;
