import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/trading-journal/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { Button } from '../../../components/trading-journal/Button';
import { journalNoteService } from '../../../services/api/journal/journalNote.service';

const AddNoteModal = ({ isOpen, onClose, initialData = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'note',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        type: initialData.type || 'note',
        content: initialData.content || ''
      });
    } else {
      setFormData({
        title: '',
        type: 'note',
        content: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (key, e) => {
    const val = e && e.target ? e.target.value : e;
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let response;
      if (initialData && initialData._id) {
        response = await journalNoteService.update(initialData._id, formData);
      } else {
        response = await journalNoteService.create(formData);
      }
      
      if (response.data?.success) {
        if (onSuccess) onSuccess(response.data.data);
        onClose();
      }
    } catch (error) {
      const backendErrorMessage = error.response?.data?.message;
      alert(backendErrorMessage || 'Something went wrong while saving your note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Journal Note" : "📝 Add Journal Note"} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Market Observation"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
          <Select
            options={[
              { value: 'lesson', label: 'Lesson' },
              { value: 'observation', label: 'Observation' },
              { value: 'note', label: 'Quick Note' }
            ]}
            value={formData.type}
            onChange={(e) => handleSelectChange('type', e)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors min-h-[120px]"
            placeholder="Write your note here..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-dark-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Note' : 'Save Note')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddNoteModal;
