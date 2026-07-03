import api from './api';
import { endpoints } from './endpoints';

export const mediaService = {
  getAllMedia: async () => {
    const response = await api.get(endpoints.media.getAll);
    return response.data;
  },

  deleteMedia: async (id) => {
    const response = await api.delete(endpoints.media.delete(id));
    return response.data;
  },

  uploadMedia: async (formData) => {
    const response = await api.post(endpoints.media.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
