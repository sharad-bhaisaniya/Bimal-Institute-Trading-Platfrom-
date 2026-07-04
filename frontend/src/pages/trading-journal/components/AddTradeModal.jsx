import React, { useState } from 'react';
import { Modal } from '../../../components/trading-journal/Modal';
import { Button } from '../../../components/trading-journal/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';

const AddTradeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    market: 'NSE',
    broker: 'Zerodha',
    type: 'BUY',
    entry: '',
    exit: '',
    quantity: '',
    stopLoss: '',
    strategy: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Trade data:', formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Trade" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onChange={(e) => setFormData({ ...formData, market: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Stop Loss</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.stopLoss}
              onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
            <Select
              options={[
                { value: 'Breakout', label: 'Breakout' },
                { value: 'Scalping', label: 'Scalping' },
                { value: 'Swing', label: 'Swing' },
                { value: 'Price Action', label: 'Price Action' },
                { value: 'EMA', label: 'EMA' },
              ]}
              value={formData.strategy}
              onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222222] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all resize-none"
              rows="3"
              placeholder="Add any notes about this trade..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-[#222222]">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Trade
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTradeModal;
