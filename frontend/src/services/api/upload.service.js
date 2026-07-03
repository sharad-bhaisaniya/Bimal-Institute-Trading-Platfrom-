import api from './api';
import { endpoints } from './endpoints';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post(endpoints.upload.image, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await api.post(endpoints.upload.video, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
};
