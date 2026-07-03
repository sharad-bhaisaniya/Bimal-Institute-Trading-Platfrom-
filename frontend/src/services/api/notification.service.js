import api from './api';
import { endpoints } from './endpoints';

export const notificationService = {
  // User
  getMyNotifications: (page = 1, limit = 20) =>
    api.get(endpoints.notifications.my, { params: { page, limit } }),

  getUnreadCount: () =>
    api.get(endpoints.notifications.unreadCount),

  markAsRead: (id) =>
    api.put(endpoints.notifications.read(id)),

  markAllAsRead: () =>
    api.put(endpoints.notifications.readAll),

  dismissNotification: (id) =>
    api.delete(endpoints.notifications.dismiss(id)),

  // Admin
  getAllNotifications: (params = {}) =>
    api.get(endpoints.notifications.all, { params }),

  getNotificationTypes: () =>
    api.get(endpoints.notifications.types),

  createNotification: (data) =>
    api.post(endpoints.notifications.create, data),

  updateNotification: (id, data) =>
    api.put(endpoints.notifications.update(id), data),

  deleteNotification: (id) =>
    api.delete(endpoints.notifications.delete(id)),
};
