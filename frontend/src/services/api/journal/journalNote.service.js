import api from '../api';
import { endpoints } from '../endpoints';

class JournalNoteService {
  async getAll(params = {}) {
    return await api.get(endpoints.journalNotes.getAll, { params });
  }

  async getById(id) {
    return await api.get(endpoints.journalNotes.getById(id));
  }

  async create(data) {
    return await api.post(endpoints.journalNotes.create, data);
  }

  async update(id, data) {
    return await api.put(endpoints.journalNotes.update(id), data);
  }

  async delete(id) {
    return await api.delete(endpoints.journalNotes.delete(id));
  }
}

export const journalNoteService = new JournalNoteService();
