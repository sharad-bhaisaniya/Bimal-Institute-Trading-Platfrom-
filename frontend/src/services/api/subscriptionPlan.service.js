import api from './api'; // Or your common axios base instance setup
import { endpoints } from './endpoints';

export const subscriptionPlanService = {
    getActivePlans: async () => {
        const response = await api.get(endpoints.subscriptionPlans.getActive);
        return response.data;
    },

    getAllPlans: async () => {
        const response = await api.get(endpoints.subscriptionPlans.getAll);
        return response.data;
    },

    getPlanById: async (id) => {
        const response = await api.get(endpoints.subscriptionPlans.getById(id));
        return response.data;
    },

    createPlan: async (data) => {
        const response = await api.post(endpoints.subscriptionPlans.create, data);
        return response.data;
    },

    updatePlan: async (id, data) => {
        const response = await api.put(endpoints.subscriptionPlans.update(id), data);
        return response.data;
    },

    togglePlan: async (id) => {
        const response = await api.put(endpoints.subscriptionPlans.toggle(id));
        return response.data;
    },

    deletePlan: async (id) => {
        const response = await api.delete(endpoints.subscriptionPlans.delete(id));
        return response.data;
    }
};