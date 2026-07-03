import api from './api';
import { endpoints } from './endpoints';

export const roleService = {
  getAll: async () => {
    const response = await api.get(endpoints.roles.getAll);
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(endpoints.roles.getOne(id));
    return response.data;
  },
  create: async (data) => {
    const response = await api.post(endpoints.roles.create, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(endpoints.roles.update(id), data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(endpoints.roles.delete(id));
    return response.data;
  },
};
