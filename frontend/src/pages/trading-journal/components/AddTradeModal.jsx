import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal } from '../../../components/trading-journal/Modal';
import { Button } from '../../../components/trading-journal/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import { tradeJournalService } from '../../../services/api/journal/tradeJournal.service';
import { brokerService } from '../../../services/api/broker.service';

const AddTradeModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [isLoadingBrokers, setIsLoadingBrokers] = useState(false);

  const defaultState = {
    date: new Date(),
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    segment: 'Cash',
    symbol: '',
    market: 'NSE',
    broker: '',
    type: 'BUY',
    tradeType: 'Intraday',
    quantity: '',
    entry: '',
    stopLoss: '',
    targetPrice: '',
    riskReward: '',
    exit: '',
    pnlType: 'Profit',
    pnlValue: '',
    tradeResult: 'Pending',
    tradeEntryTime: '',
    tradeExitTime: '',
    strategy: '',
    remark1: '',
    remark2: '',
    preTradeEmotion: 'Calm',
    postTradeEmotion: 'Disciplined',
    mistakeTag: 'None',
    notes: '',
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        date: new Date(initialData.date),
        day: initialData.day || new Date(initialData.date).toLocaleDateString('en-US', { weekday: 'long' }),
        segment: initialData.segment || 'Cash',
        symbol: initialData.symbol || '',
        market: initialData.market || 'NSE',
        broker: initialData.broker || '',
        type: initialData.type || 'BUY',
        tradeType: initialData.trade_type || 'Intraday',
        quantity: initialData.quantity || '',
        entry: initialData.entry_price || '',
        stopLoss: initialData.stop_loss || '',
        targetPrice: initialData.target_price || '',
        riskReward: initialData.risk_reward || '',
        exit: initialData.exit_price || '',
        pnlType: initialData.pnl < 0 ? 'Loss' : 'Profit',
        pnlValue: initialData.pnl !== null && initialData.pnl !== undefined ? Math.abs(initialData.pnl) : '',
        tradeResult: initialData.trade_result || 'Pending',
        tradeEntryTime: initialData.trade_entry_time || '',
        tradeExitTime: initialData.trade_exit_time || '',
        strategy: initialData.strategy_used || '',
        remark1: initialData.remark_1 || '',
        remark2: initialData.remark_2 || '',
        preTradeEmotion: initialData.pre_trade_emotion || 'Calm',
        postTradeEmotion: initialData.post_trade_emotion || 'Disciplined',
        mistakeTag: initialData.mistake_tag || 'None',
        notes: initialData.notes || '',
      });
    } else if (!isOpen) {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);
  // Fetch active brokers dynamically when the modal opens
  useEffect(() => {
    const fetchBrokers = async () => {
      if (!isOpen) return;

      setIsLoadingBrokers(true);
      try {
        const response = await brokerService.getActive();
        const brokerList = response.data?.data || response.data || [];
        setBrokers(brokerList);

        // Fallback default selection to the first dynamic broker returned from the database
        if (brokerList.length > 0) {
          setFormData(prev => ({ ...prev, broker: brokerList[0].name }));
        }
      } catch (error) {
        console.error('Failed to fetch admin brokers:', error);
      } finally {
        setIsLoadingBrokers(false);
      }
    };

    fetchBrokers();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format the date back to standard YYYY-MM-DD string format expected by your controller
    const formattedDate = formData.date instanceof Date
      ? formData.date.toISOString().split('T')[0]
      : formData.date;
      
    // Prepare payload by mapping UI keys to match the controller expectations
    const payload = {
      date: formattedDate,
      day: formData.day,
      symbol: formData.symbol,
      segment: formData.segment,
      market: formData.market,
      broker: formData.broker,
      type: formData.type,
      tradeType: formData.tradeType,
      quantity: Number(formData.quantity),
      entryPrice: Number(formData.entry),
      stopLoss: Number(formData.stopLoss),
      targetPrice: Number(formData.targetPrice),
      riskReward: formData.riskReward !== '' ? Number(formData.riskReward) : undefined,
      exitPrice: formData.exit !== '' ? Number(formData.exit) : undefined,
      pnl: formData.pnlValue !== '' ? (formData.pnlType === 'Loss' ? -Math.abs(Number(formData.pnlValue)) : Math.abs(Number(formData.pnlValue))) : undefined,
      tradeResult: formData.tradeResult,
      tradeEntryTime: formData.tradeEntryTime,
      tradeExitTime: formData.tradeExitTime,
      remark1: formData.remark1,
      remark2: formData.remark2,
      strategy: formData.strategy,
      preTradeEmotion: formData.preTradeEmotion,
      postTradeEmotion: formData.postTradeEmotion,
      mistakeTag: formData.mistakeTag,
      notes: formData.notes,
    };

    try {
      let response;
      if (initialData && initialData._id) {
        response = await tradeJournalService.update(initialData._id, payload);
      } else {
        response = await tradeJournalService.create(payload);
      }
      
      if (response.data?.success) {
        if (onSuccess) onSuccess(response.data.data);
        onClose();
      }
    } catch (error) {
      // 1. Detailed error telemetry mapping inside client console
      console.error('--- [HANDLESUBMIT ERROR ANCHOR] ---');
      console.error('Error Object:', error);
      console.error('Error Response Metadata:', error.response);
      console.error('Error Response Data Context:', error.response?.data);
      console.error('-------------------------------------');

      // 2. Extract API validation string mapping if returned by the backend update
      const backendErrorMessage = error.response?.data?.message;

      alert(backendErrorMessage || 'Something went wrong while saving your diary entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe handler utility for custom Select UI components that pass explicit option/values instead of raw event objects
  const handleSelectChange = (key, e) => {
    const val = e && e.target ? e.target.value : e;
    console.log("Selected Key:", key);
    console.log("Selected Value:", val);
    console.log("Raw Event/Option:", e);
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  // Map dynamic backend broker values to dropdown structure ({ value, label })
  const brokerOptions = brokers.map(b => ({
    value: b.name,
    label: b.name
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📓 Log Diary Trade" size="lg">
      {/* ─── DOCK CUSTOM DARK STYLE INTERCEPTOR FOR CALENDAR UI ─── */}
      <style>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .custom-dark-datepicker {
          width: 100%;
          padding: 0.5rem 1rem;
          background-color: #1a1a1a !important;
          border: 1px solid #222222 !important;
          border-radius: 0.75rem !important;
          color: #ffffff !important;
          outline: none;
          transition: all 0.2s;
        }
        .custom-dark-datepicker:focus {
          border-color: transparent !important;
          box-shadow: 0 0 0 2px #10b981 !important;
        }
        .react-datepicker {
          background-color: #141414 !important;
          border: 1px solid #222222 !important;
          border-radius: 0.75rem !important;
          font-family: inherit !important;
          color: #ffffff !important;
          overflow: hidden;
        }
        .react-datepicker__header {
          background-color: #1a1a1a !important;
          border-bottom: 1px solid #222222 !important;
          padding-top: 12px !important;
        }
        .react-datepicker__current-month, 
        .react-datepicker__day-name {
          color: #9ca3af !important;
        }
        .react-datepicker__day {
          color: #e5e7eb !important;
        }
        .react-datepicker__day:hover {
          background-color: #222222 !important;
          border-radius: 0.375rem !important;
          color: #ffffff !important;
        }
        .react-datepicker__day--selected {
          background-color: #10b981 !important;
          color: #ffffff !important;
          border-radius: 0.375rem !important;
          font-weight: bold;
        }
        .react-datepicker__day--outside-month {
          color: #4b5563 !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #9ca3af !important;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* SECTION 1: Primary Metrics Layout Grid (Clean 5-Column alignment) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trade Date</label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ 
                ...formData, 
                date: date,
                day: date ? date.toLocaleDateString('en-US', { weekday: 'long' }) : ''
              })}
              dateFormat="dd-MM-yyyy"
              className="custom-dark-datepicker"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Symbol (Script)</label>
            <Input
              type="text"
              placeholder="e.g., RELIANCE"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
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

          {/* <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Broker</label>
            <Select
              options={brokerOptions}
              value={formData.broker}
              onChange={(e) => handleSelectChange('broker', e)}
              disabled={isLoadingBrokers}
              placeholder={isLoadingBrokers ? "Loading..." : "Select Broker"}
            />
          </div> */}

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

          {/* <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Exit Price</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.exit}
              onChange={(e) => setFormData({ ...formData, exit: e.target.value })}
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Strategy Used</label>
            <Input
              type="text"
              placeholder="Enter strategy name"
              value={formData.strategy}
              onChange={(e) => {
                const val = e.target.value;
                const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                setFormData({ ...formData, strategy: capitalized });
              }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Day</label>
            <Input
              type="text"
              placeholder="e.g., Friday"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              disabled
              className="opacity-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Segment</label>
            <Select
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'Crypto', label: 'Crypto' },
                { value: 'Futures', label: 'Futures' },
                { value: 'Options', label: 'Options' },
              ]}
              value={formData.segment}
              onChange={(e) => handleSelectChange('segment', e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trade Type</label>
            <Select
              options={[
                { value: 'Intraday', label: 'Intraday' },
                { value: 'Delivery', label: 'Delivery' },
              ]}
              value={formData.tradeType}
              onChange={(e) => handleSelectChange('tradeType', e)}
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
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Price</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.targetPrice}
              onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Risk : Reward</label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 2"
              value={formData.riskReward}
              onChange={(e) => setFormData({ ...formData, riskReward: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">P&L Type</label>
            <Select
              options={[
                { value: 'Profit', label: 'Profit' },
                { value: 'Loss', label: 'Loss' },
              ]}
              value={formData.pnlType}
              onChange={(e) => handleSelectChange('pnlType', e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">P&L Value</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.pnlValue}
              onChange={(e) => setFormData({ ...formData, pnlValue: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Result</label>
            <Select
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Target', label: 'Target' },
                { value: 'Stoploss', label: 'Stoploss' },
              ]}
              value={formData.tradeResult}
              onChange={(e) => handleSelectChange('tradeResult', e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Entry Time</label>
            <Input
              type="time"
              value={formData.tradeEntryTime}
              onChange={(e) => setFormData({ ...formData, tradeEntryTime: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Exit Time</label>
            <Input
              type="time"
              value={formData.tradeExitTime}
              onChange={(e) => setFormData({ ...formData, tradeExitTime: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Remark 1</label>
            <Input
              type="text"
              placeholder="e.g., GG/BG"
              value={formData.remark1}
              onChange={(e) => setFormData({ ...formData, remark1: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Remark 2</label>
            <Input
              type="text"
              placeholder=""
              value={formData.remark2}
              onChange={(e) => setFormData({ ...formData, remark2: e.target.value })}
            />
          </div>
        </div>

        {/* Separator Section Header
        <div className="border-t border-[#222222] pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">Trading Psychology & Diary Analysis</h4>
        </div>

        SECTION 2: Psychological Metrics Row
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
        </div> */}

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
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Entry' : 'Save Diary Entry')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTradeModal;