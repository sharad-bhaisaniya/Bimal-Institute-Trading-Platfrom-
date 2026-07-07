import React, { useState } from 'react';
import { Modal } from '../../../components/trading-journal/Modal';
import { Button } from '../../../components/trading-journal/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { tradeJournalService } from '../../../services/api/journal/tradeJournal.service';

const AddTradeModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Defaults to today
    symbol: '',
    market: 'NSE',
    broker: 'Zerodha',
    type: 'BUY',
    entry: '',
    exit: '',
    quantity: '',
    strategy: 'Price Action',
    preTradeEmotion: 'Calm',
    postTradeEmotion: 'Disciplined',
    mistakeTag: 'None',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare payload by mapping UI keys to match the controller expectations
    const payload = {
      date: formData.date,
      symbol: formData.symbol,
      market: formData.market,
      broker: formData.broker,
      type: formData.type,
      quantity: Number(formData.quantity),
      entryPrice: Number(formData.entry),
      exitPrice: formData.exit !== '' ? Number(formData.exit) : undefined,
      strategy: formData.strategy,
      preTradeEmotion: formData.preTradeEmotion,
      postTradeEmotion: formData.postTradeEmotion,
      mistakeTag: formData.mistakeTag,
      notes: formData.notes,
    };

    try {
      const response = await tradeJournalService.create(payload);
      if (response.data?.success) {
        if (onSuccess) onSuccess(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Failed to save trade log:', error);
      alert(error.response?.data?.message || 'Something went wrong while saving your diary entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe handler utility for custom Select UI components that pass explicit option/values instead of raw event objects
  const handleSelectChange = (key, e) => {
    // Check if it's a standard event object or direct value string passed by custom Select components
    const val = e && e.target ? e.target.value : e;
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📓 Log Diary Trade" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* SECTION 1: Primary Metrics Layout Grid (Clean 5-Column alignment) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trade Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
            <Input
              type="text"
              placeholder="e.g., RELIANCE"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Market</label>
            <Select
              options={[
                { value: 'NSE', label: 'NSE' },
                { value: 'BSE', label: 'BSE' },
                { value: 'MCX', label: 'MCX' },
              ]}
              value={formData.market}
              onChange={(e) => handleSelectChange('market', e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Broker</label>
            <Select
              options={[
                { value: 'Zerodha', label: 'Zerodha' },
                { value: 'Upstox', label: 'Upstox' },
                { value: 'Groww', label: 'Groww' },
              ]}
              value={formData.broker}
              onChange={(e) => handleSelectChange('broker', e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <Select
              options={[
                { value: 'BUY', label: 'BUY' },
                { value: 'SELL', label: 'SELL' },
              ]}
              value={formData.type}
              onChange={(e) => handleSelectChange('type', e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
            <Input
              type="number"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.entry}
              onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Exit Price</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.exit}
              onChange={(e) => setFormData({ ...formData, exit: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Strategy Used</label>
            <Select
              options={[
                { value: 'Breakout', label: 'Breakout' },
                { value: 'Scalping', label: 'Scalping' },
                { value: 'Swing', label: 'Swing' },
                { value: 'Price Action', label: 'Price Action' },
                { value: 'EMA Cross', label: 'EMA Cross' },
              ]}
              value={formData.strategy}
              onChange={(e) => handleSelectChange('strategy', e)}
            />
          </div>
        </div>

        {/* Separator Section Header */}
        <div className="border-t border-[#222222] pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">Trading Psychology & Diary Analysis</h4>
        </div>

        {/* SECTION 2: Psychological Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Pre-Trade Emotion</label>
            <Select
              options={[
                { value: 'Calm', label: 'Calm / Neutral' },
                { value: 'FOMO', label: 'FOMO (Fear of Missing Out)' },
                { value: 'Greedy', label: 'Greedy / Aggressive' },
                { value: 'Anxious', label: 'Anxious / Scared' },
                { value: 'Revenge', label: 'Revenge Mentality' },
              ]}
              value={formData.preTradeEmotion}
              onChange={(e) => handleSelectChange('preTradeEmotion', e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Post-Trade Emotion</label>
            <Select
              options={[
                { value: 'Disciplined', label: 'Disciplined (Followed Plan)' },
                { value: 'Relieved', label: 'Relieved' },
                { value: 'Angry', label: 'Angry / Frustrated' },
                { value: 'Overconfident', label: 'Overconfident' },
              ]}
              value={formData.postTradeEmotion}
              onChange={(e) => handleSelectChange('postTradeEmotion', e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Behavioral Rules / Mistakes Tracker</label>
            <Select
              options={[
                { value: 'None', label: 'Perfect Execution (No Mistakes)' },
                { value: 'FOMO Entry', label: 'Early Entry (FOMO)' },
                { value: 'Chasing Market', label: 'Chasing a Running Candle' },
                { value: 'Moved SL', label: 'Moved or Removed Stop Loss' },
                { value: 'Overtrading', label: 'Overtrading / High Risk' },
                { value: 'Early Exit', label: 'Panic Exit (Cut profits early)' },
              ]}
              value={formData.mistakeTag}
              onChange={(e) => handleSelectChange('mistakeTag', e)}
            />
          </div>
        </div>

        {/* SECTION 3: Dedicated Full Width Row for Textarea Reflection */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-300 mb-2">Diary Notes & Reflection</label>
          <textarea
            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222222] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all resize-none"
            rows="4"
            placeholder="Why did you take this trade? What did the market teach you today?"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Modal Actions Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-[#222222]">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button className="animatedBtn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving Log...' : 'Save Diary Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTradeModal;