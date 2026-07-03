import api from './api';
import { endpoints } from './endpoints';

export const authService = {
  login: async (data) => {
    const response = await api.post(endpoints.auth.login, data);
    return response.data;
  },
  sendOtp: async (data) => {
    const response = await api.post(endpoints.auth.sendOtp, data);
    return response.data;
  },
  verifyAndRegister: async (data) => {
    const response = await api.post(endpoints.auth.verifyAndRegister, data);
    return response.data;
  },
};

