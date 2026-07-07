import api from './api';
import { endpoints } from './endpoints';

export const tradeService = {
    // Accepts params for filtering (e.g., ?status=OPEN&exchange=NSE)
    getAll: (params) => api.get(endpoints.trades.getAll, { params }),
    getById: (id) => api.get(endpoints.trades.getById(id)),
    create: (data) => api.post(endpoints.trades.create, data),
    update: (id, data) => api.put(endpoints.trades.update(id), data),
    updateStatus: (id, data) => api.patch(endpoints.trades.updateStatus(id), data),
    delete: (id) => api.delete(endpoints.trades.delete(id)),
};