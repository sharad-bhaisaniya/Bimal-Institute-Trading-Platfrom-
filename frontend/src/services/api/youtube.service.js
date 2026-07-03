import api from './api';
import { endpoints } from './endpoints';

export const youtubeService = {
  previewPlaylist: async (playlistUrl) => {
    return await api.post(endpoints.youtube.preview, { playlistUrl });
  },
  syncPlaylist: async (playlistId, courseTitle, videos) => {
    return await api.post(endpoints.youtube.sync, { playlistId, courseTitle, videos });
  }
};
