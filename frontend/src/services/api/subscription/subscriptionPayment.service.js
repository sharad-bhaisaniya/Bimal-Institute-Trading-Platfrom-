import api from "../api";
import { endpoints } from "../endpoints";

export const subscriptionPaymentService = {
    getAll: (params) =>
        api.get(endpoints.subscriptionPayments.getAll, { params }),

    getById: (id) =>
        api.get(endpoints.subscriptionPayments.getById(id)),

    create: (data) =>
        api.post(endpoints.subscriptionPayments.create, data),

    update: (id, data) =>
        api.put(endpoints.subscriptionPayments.update(id), data),

    updateStatus: (id, data) =>
        api.patch(endpoints.subscriptionPayments.updateStatus(id), data),

    delete: (id) =>
        api.delete(endpoints.subscriptionPayments.delete(id)),
};