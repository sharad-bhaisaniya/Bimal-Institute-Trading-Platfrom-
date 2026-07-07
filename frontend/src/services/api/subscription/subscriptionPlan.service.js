import api from "../api";
import { endpoints } from "../endpoints";

export const subscriptionPlanService = {
    getAll: (params) =>
        api.get(endpoints.subscriptionPlans.getAll, { params }),

    getById: (id) =>
        api.get(endpoints.subscriptionPlans.getById(id)),

    create: (data) =>
        api.post(endpoints.subscriptionPlans.create, data),

    update: (id, data) =>
        api.put(endpoints.subscriptionPlans.update(id), data),

    updateStatus: (id, data) =>
        api.patch(endpoints.subscriptionPlans.updateStatus(id), data),

    toggleFeatured: (id) =>
        api.patch(endpoints.subscriptionPlans.toggleFeatured(id)),

    delete: (id) =>
        api.delete(endpoints.subscriptionPlans.delete(id)),
};