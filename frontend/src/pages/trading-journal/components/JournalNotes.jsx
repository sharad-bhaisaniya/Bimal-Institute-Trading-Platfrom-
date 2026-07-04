import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Button } from '../../../components/trading-journal/Button';
import { BookOpen, Plus, Edit } from 'lucide-react';
import { format } from 'date-fns';

const JournalNotes = () => {
  const [notes] = useState([
    {
      id: 1,
      type: 'lesson',
      title: "Today's Lesson",
      content: 'Patience is key. Wait for proper setup before entering trades. Avoid FOMO entries.',
      date: '2024-01-15',
    },
    {
      id: 2,
      type: 'observation',
      title: 'Market Observation',
      content: 'Nifty showing strong resistance at 22000 levels. Watch for breakout or rejection.',
      date: '2024-01-14',
    },
    {
      id: 3,
      type: 'note',
      title: 'Quick Note',
      content: 'Reduce position size during high volatility events.',
      date: '2024-01-13',
    },
  ]);

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
          <Button variant="outline" size="sm">
            <Plus size={14} className="mr-2" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="p-4 bg-[#1a1a1a] rounded-xl border border-[#222222] hover:border-[#222222] transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getTypeColor(note.type)}`}>
                    {note.type}
                  </span>
                  <h4 className="font-medium text-white">{note.title}</h4>
                </div>
                <button className="p-1 rounded hover:bg-[#222222] text-gray-400 hover:text-white transition-colors">
                  <Edit size={14} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-2">{note.content}</p>
              <span className="text-xs text-gray-500">{format(new Date(note.date), 'MMM dd, yyyy')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalNotes;
