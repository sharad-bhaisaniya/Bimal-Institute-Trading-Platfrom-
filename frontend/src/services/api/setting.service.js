import api from './api';
import { endpoints } from './endpoints';

export const settingService = {
  // SMTP
  getAllSmtp: async () => {
    const res = await api.get(endpoints.settings.smtp.getAll);
    return res.data;
  },
  createSmtp: async (data) => {
    const res = await api.post(endpoints.settings.smtp.create, data);
    return res.data;
  },
  updateSmtp: async (id, data) => {
    const res = await api.put(endpoints.settings.smtp.update(id), data);
    return res.data;
  },
  deleteSmtp: async (id) => {
    const res = await api.delete(endpoints.settings.smtp.delete(id));
    return res.data;
  },

  // SMS
  getAllSms: async () => {
    const res = await api.get(endpoints.settings.sms.getAll);
    return res.data;
  },
  createSms: async (data) => {
    const res = await api.post(endpoints.settings.sms.create, data);
    return res.data;
  },
  updateSms: async (id, data) => {
    const res = await api.put(endpoints.settings.sms.update(id), data);
    return res.data;
  },
  deleteSms: async (id) => {
    const res = await api.delete(endpoints.settings.sms.delete(id));
    return res.data;
  },

  // Razorpay
  getAllRazorpay: async () => {
    const res = await api.get(endpoints.settings.razorpay.getAll);
    return res.data;
  },
  createRazorpay: async (data) => {
    const res = await api.post(endpoints.settings.razorpay.create, data);
    return res.data;
  },
  updateRazorpay: async (id, data) => {
    const res = await api.put(endpoints.settings.razorpay.update(id), data);
    return res.data;
  },
  deleteRazorpay: async (id) => {
    const res = await api.delete(endpoints.settings.razorpay.delete(id));
    return res.data;
  },

  // Digio
  getAllDigio: async () => {
    const res = await api.get(endpoints.settings.digio.getAll);
    return res.data;
  },
  createDigio: async (data) => {
    const res = await api.post(endpoints.settings.digio.create, data);
    return res.data;
  },
  updateDigio: async (id, data) => {
    const res = await api.put(endpoints.settings.digio.update(id), data);
    return res.data;
  },
  deleteDigio: async (id) => {
    const res = await api.delete(endpoints.settings.digio.delete(id));
    return res.data;
  },

  // YouTube
  getAllYoutube: async () => {
    const res = await api.get(endpoints.settings.youtube.getAll);
    return res.data;
  },
  createYoutube: async (data) => {
    const res = await api.post(endpoints.settings.youtube.create, data);
    return res.data;
  },
  updateYoutube: async (id, data) => {
    const res = await api.put(endpoints.settings.youtube.update(id), data);
    return res.data;
  },
  deleteYoutube: async (id) => {
    const res = await api.delete(endpoints.settings.youtube.delete(id));
    return res.data;
  },
};
