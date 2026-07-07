import api from "../api";
import { endpoints } from "../endpoints";

export const userSubscriptionService = {
    getAll: (params) =>
        api.get(endpoints.userSubscriptions.getAll, { params }),

    getById: (id) =>
        api.get(endpoints.userSubscriptions.getById(id)),

    create: (data) =>
        api.post(endpoints.userSubscriptions.create, data),

    update: (id, data) =>
        api.put(endpoints.userSubscriptions.update(id), data),

    updateStatus: (id, data) =>
        api.patch(endpoints.userSubscriptions.updateStatus(id), data),

    delete: (id) =>
        api.delete(endpoints.userSubscriptions.delete(id)),
};