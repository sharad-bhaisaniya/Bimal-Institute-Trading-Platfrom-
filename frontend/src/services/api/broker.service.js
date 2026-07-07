import api from './api';
import { endpoints } from './endpoints';

export const brokerService = {
    getAll: () => api.get(endpoints.brokers.getAll),
    getActive: () => api.get(endpoints.brokers.getActive),
    getById: (id) => api.get(endpoints.brokers.getById(id)),
    create: (data) => api.post(endpoints.brokers.create, data),
    update: (id, data) => api.put(endpoints.brokers.update(id), data),
    // Note: We use patch here to match the backend route: router.patch('/:id/status')
    updateStatus: (id, data) => api.patch(endpoints.brokers.updateStatus(id), data),
    delete: (id) => api.delete(endpoints.brokers.delete(id)),
};