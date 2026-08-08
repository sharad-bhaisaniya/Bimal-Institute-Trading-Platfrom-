import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Button } from '../../../components/trading-journal/Button';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { journalNoteService } from '../../../services/api/journal/journalNote.service';
import AddNoteModal from './AddNoteModal';

const JournalNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const response = await journalNoteService.getAll();
      if (response.data?.success) {
        setNotes(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching journal notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await journalNoteService.delete(id);
        fetchNotes(); // Refresh list
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      }
    }
  };

  const handleModalSuccess = () => {
    fetchNotes();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'lesson': return 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20';
      case 'observation': return 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20';
      default: return 'bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#10b981]/10 rounded-lg">
              <BookOpen className="text-[#10b981]" size={20} />
            </div>
            <CardTitle>Journal Notes</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddNote}>
            <Plus size={14} className="mr-2" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-gray-400 py-4">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-400 py-8 border border-dashed border-dark-border rounded-xl">
            No notes found. Click "Add Note" to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note._id} className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222222] hover:border-[#222222] transition-colors relative group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getTypeColor(note.type)} capitalize`}>
                      {note.type}
                    </span>
                    <h4 className="font-medium text-white">{note.title}</h4>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditNote(note)} className="p-1 rounded hover:bg-[#222222] text-gray-400 hover:text-white transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDeleteNote(note._id)} className="p-1 rounded hover:bg-danger/20 text-gray-400 hover:text-danger transition-colors ml-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">{note.content}</p>
                <span className="text-xs text-gray-500">{format(new Date(note.date), 'MMM dd, yyyy')}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <AddNoteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedNote}
        onSuccess={handleModalSuccess}
      />
    </Card>
  );
};

export default JournalNotes;
