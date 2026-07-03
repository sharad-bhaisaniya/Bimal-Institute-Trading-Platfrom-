import api from './api';
import { endpoints } from './endpoints';

export const blogCategoryService = {
  getAllCategories: async () => {
    const response = await api.get(endpoints.blogCategories.getAll);
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(endpoints.blogCategories.getById(id));
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post(endpoints.blogCategories.create, data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(endpoints.blogCategories.update(id), data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(endpoints.blogCategories.delete(id));
    return response.data;
  }
};
