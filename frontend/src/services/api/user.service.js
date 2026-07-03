import api from './api';
import { endpoints } from './endpoints';

export const userService = {
  getAll: async () => {
    const response = await api.get(endpoints.users.getAll);
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(endpoints.users.getOne(id));
    return response.data;
  },
  create: async (data) => {
    const response = await api.post(endpoints.users.create, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(endpoints.users.update(id), data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(endpoints.users.delete(id));
    return response.data;
  },
};
