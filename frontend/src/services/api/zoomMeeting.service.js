import api from './api';
import { endpoints } from './endpoints';

export const zoomMeetingService = {
  getAll: async (status) => {
    const url = status 
      ? `${endpoints.zoomMeetings.getAll}?status=${status}` 
      : endpoints.zoomMeetings.getAll;
    const res = await api.get(url);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(endpoints.zoomMeetings.getById(id));
    return res.data;
  },
  create: async (data) => {
    const res = await api.post(endpoints.zoomMeetings.create, data);
    return res.data;
  },
  startInstant: async (topic) => {
    const res = await api.post(endpoints.zoomMeetings.startInstant, { topic });
    return res.data;
  },
  getSignature: async (data) => {
    const res = await api.post(endpoints.zoomMeetings.getSignature, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(endpoints.zoomMeetings.update(id), data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(endpoints.zoomMeetings.delete(id));
    return res.data;
  }
};
