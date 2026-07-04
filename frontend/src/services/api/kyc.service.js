import api from './api';

export const kycService = {
  /**
   * POST /api/v1/kyc/initiate
   * Starts a Digio KYC session. Returns { document_id, redirect_url }.
   */
  initiate: async (data = {}) => {
    const response = await api.post('/kyc/initiate', data);
    return response.data;
  },

  /**
   * GET /api/v1/kyc/status
   * Fetches & updates the KYC status for the logged-in user from Digio.
   */
  getStatus: async () => {
    const response = await api.get('/kyc/status');
    return response.data;
  },

  /**
   * GET /api/v1/kyc/full-details
   * Returns full user + KYC record with aadhaar, pan, selfie, signature details.
   */
  getFullDetails: async () => {
    const response = await api.get('/kyc/full-details');
    return response.data;
  },
};

