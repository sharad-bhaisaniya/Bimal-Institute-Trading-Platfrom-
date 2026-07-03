const axios = require('axios');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const YoutubeSetting = require('../models/YoutubeSetting');

// Helper to extract playlist ID from URL
const extractPlaylistId = (url) => {
  const match = url.match(/[?&]list=([^#\&\?]+)/);
  return match ? match[1] : url;
};

// Helper to get the active API key from the database
const getApiKey = async () => {
  // First try the active setting
  const setting = await YoutubeSetting.findOne({ isActive: true });
  if (setting && setting.apiKey) return setting.apiKey;
  // Fallback: try any saved setting
  const any = await YoutubeSetting.findOne();
  if (any && any.apiKey) return any.apiKey;
  // Last resort: .env
  return process.env.YOUTUBE_API_KEY || null;
};

exports.previewPlaylist = async (req, res) => {
  try {
    const { playlistUrl } = req.body;
    const apiKey = await getApiKey();

    if (!apiKey) {
      return res.status(500).json({ message: 'YouTube API Key not configured. Please add it in Settings > YouTube API.' });
    }

    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId || playlistId.length < 5) {
      return res.status(400).json({ message: 'Invalid Playlist URL or ID' });
    }

    let allPlaylistItems = [];
    let nextPageToken = '';
    
    // 1. Fetch Playlist Items (Pagination)
    do {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet,contentDetails',
          maxResults: 50,
          playlistId: playlistId,
          pageToken: nextPageToken,
          key: apiKey
        }
      });
      
      allPlaylistItems = allPlaylistItems.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    if (allPlaylistItems.length === 0) {
      return res.status(404).json({ message: 'No videos found in playlist' });
    }

    // 2. Extract Video IDs
    const videoIds = allPlaylistItems.map(item => item.contentDetails.videoId);

    // 3. Fetch Video Details in chunks of 50
    const videoDetails = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      const chunk = videoIds.slice(i, i + 50);
      const statsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'contentDetails,statistics',
          id: chunk.join(','),
          key: apiKey
        }
      });
      videoDetails.push(...statsRes.data.items);
    }

    // 4. Map them together
    const videos = allPlaylistItems.map((item, index) => {
      const videoId = item.contentDetails.videoId;
      const details = videoDetails.find(v => v.id === videoId);
      
      // Determine highest res thumbnail
      const snippet = item.snippet;
      const thumbs = snippet.thumbnails || {};
      const thumbnail = thumbs.maxres?.url || thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || '';

      return {
        videoId,
        title: snippet.title,
        description: snippet.description,
        thumbnail,
        publishedAt: snippet.publishedAt,
        position: snippet.position,
        channelTitle: snippet.videoOwnerChannelTitle,
        duration: details ? details.contentDetails.duration : '',
        viewCount: details ? parseInt(details.statistics.viewCount) || 0 : 0,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`
      };
    });

    // We can also fetch the playlist title if we want, but for now we'll just return videos.
    res.status(200).json({
      message: 'Playlist fetched successfully',
      data: {
        playlistId,
        totalVideos: videos.length,
        videos
      }
    });

  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error fetching playlist from YouTube', 
      error: error.response?.data?.error?.message || error.message 
    });
  }
};

exports.syncPlaylist = async (req, res) => {
  try {
    const { playlistId, courseTitle, videos } = req.body;

    if (!videos || videos.length === 0) {
      return res.status(400).json({ message: 'No videos provided for sync' });
    }

    // 1. Find or create Course
    let course = await Course.findOne({ playlistId });
    if (!course) {
      // Create new course
      let slug = (courseTitle || `YouTube Course ${playlistId}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await Course.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      course = new Course({
        title: courseTitle || 'Imported YouTube Course',
        slug,
        playlistId,
        type: 'Free',
        status: 'Draft',
        thumbnail: videos[0]?.thumbnail || '',
        importedAt: new Date()
      });
      await course.save();
    } else {
      // Update importedAt
      course.importedAt = new Date();
      await course.save();
    }

    // 2. Fetch existing lectures for this course to prevent duplicates
    const existingLectures = await Lecture.find({ courseId: course._id }).lean();
    const existingVideoIds = existingLectures.map(l => l.videoId).filter(id => id);

    // 3. Separate new vs existing videos
    const newVideos = videos.filter(v => !existingVideoIds.includes(v.videoId));
    const videosToUpdate = videos.filter(v => existingVideoIds.includes(v.videoId));

    // 4. Bulk insert new lectures
    if (newVideos.length > 0) {
      // We need to figure out 'order'. Let's append them.
      const currentMaxOrder = existingLectures.length > 0 ? Math.max(...existingLectures.map(l => l.order)) : -1;
      
      const newLectures = newVideos.map((v, idx) => ({
        courseId: course._id,
        title: v.title,
        order: currentMaxOrder + 1 + idx,
        videoType: 'url',
        videoUrl: v.watchUrl, // fallback to standard watch URL
        videoId: v.videoId,
        embedUrl: v.embedUrl,
        watchUrl: v.watchUrl,
        thumbnail: v.thumbnail,
        duration: v.duration,
        publishedAt: v.publishedAt,
        channelTitle: v.channelTitle,
        viewCount: v.viewCount
      }));

      await Lecture.insertMany(newLectures);
    }

    // 5. Update existing lectures (optional, but good for syncing titles/views)
    for (const v of videosToUpdate) {
      await Lecture.updateOne(
        { courseId: course._id, videoId: v.videoId },
        {
          $set: {
            title: v.title,
            thumbnail: v.thumbnail,
            duration: v.duration,
            viewCount: v.viewCount
          }
        }
      );
    }

    res.status(200).json({
      message: 'Sync completed successfully',
      data: {
        courseId: course._id,
        importedCount: newVideos.length,
        updatedCount: videosToUpdate.length
      }
    });

  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ message: 'Error syncing playlist', error: error.message });
  }
};
