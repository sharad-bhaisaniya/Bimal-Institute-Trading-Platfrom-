import api from '../axios'; // Aapki wrapper centralized custom instance configuration file
import { endpoints } from '../endpoints'; // Target path to endpoints file context

export const tradeJournalService = {
    /**
     * Fetch the user's complete trading journal collection with filters & parameters
     * @param {Object} params - Query objects (symbol, market, status, page, limit)
     */
    getAll: async (params = {}) => {
        return await api.get(endpoints.tradeJournals.getAll, { params });
    },

    /**
     * Fetch a single trade journal entry context metrics via specific ID mapping
     * @param {String} id - Trade Log UUID string parameter
     */
    getById: async (id) => {
        return await api.get(endpoints.tradeJournals.getById(id));
    },

    /**
     * Submit a fresh trading journal profile form layout payload log parameters
     * @param {Object} payload - The form fields containing data parameters
     */
    create: async (payload) => {
        return await api.post(endpoints.tradeJournals.create, payload);
    },

    /**
     * Edit or modify parameters of an existing processed trade journal entry
     * @param {String} id - Target Trade Log ID parameter
     * @param {Object} payload - Corrected schema values mapping object parameters
     */
    update: async (id, payload) => {
        return await api.put(endpoints.tradeJournals.update(id), payload);
    },

    /**
     * Purge an entry completely from the system tracking matrix database context
     * @param {String} id - Unique target item transaction log string entry mapping
     */
    delete: async (id) => {
        return await api.delete(endpoints.tradeJournals.delete(id));
    }
};