import api from './api';
import { endpoints } from './endpoints';

export const permissionService = {
  getAll: async () => {
    const response = await api.get(endpoints.permissions.getAll);
    return response.data;
  },
};
