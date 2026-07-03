import api from './api';
import { endpoints } from './endpoints';

export const blogService = {
  getAllBlogs: async () => {
    const response = await api.get(endpoints.blogs.getAll);
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(endpoints.blogs.getById(id));
    return response.data;
  },

  createBlog: async (data) => {
    const response = await api.post(endpoints.blogs.create, data);
    return response.data;
  },

  updateBlog: async (id, data) => {
    const response = await api.put(endpoints.blogs.update(id), data);
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(endpoints.blogs.delete(id));
    return response.data;
  }
};
