import api from '../api';
import { endpoints } from '../endpoints';

export const aiAnalyzerService = {
  analyzeTrades: async (trades) => {
    return await api.post(endpoints.aiAnalyzer.analyze, { trades });
  },
};
