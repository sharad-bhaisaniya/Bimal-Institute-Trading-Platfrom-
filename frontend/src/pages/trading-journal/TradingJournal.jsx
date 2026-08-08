import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroStats from './components/HeroStats';
import PerformanceChart from './components/PerformanceChart';
import ProfitLossChart from './components/ProfitLossChart';
import CalendarHeatmap from './components/CalendarHeatmap';
import RecentTrades from './components/RecentTrades';
import TradingPsychology from './components/TradingPsychology';
import Goals from './components/Goals';
import BestPerformingAssets from './components/BestPerformingAssets';
import StrategyAnalytics from './components/StrategyAnalytics';
import JournalNotes from './components/JournalNotes';
import RightSidebar from './components/RightSidebar';
import AddTradeModal from './components/AddTradeModal';
import EmptyState from './components/EmptyState';
import { Plus } from 'lucide-react';
import { Button } from '../../components/trading-journal/Button';
import { tradeJournalService } from '../../services/api/journal/tradeJournal.service';
import { toast } from 'react-toastify';
import AIAnalyzerSection from './components/AIAnalyzerSection';
import { Sparkles } from 'lucide-react';

const TradingJournal = () => {
  const [isAddTradeModalOpen, setIsAddTradeModalOpen] = useState(false);
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState(null);

  const fetchTrades = async () => {
    setIsLoading(true);
    try {
      const response = await tradeJournalService.getAll();
      if (response.data?.success) {
        setTrades(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast.error('Failed to load trading journal.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleEditTrade = (trade) => {
    setSelectedTrade(trade);
    setIsAddTradeModalOpen(true);
  };

  const handleDeleteTrade = async (tradeId) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;
    
    try {
      const response = await tradeJournalService.delete(tradeId);
      if (response.data?.success) {
        toast.success('Trade deleted successfully');
        fetchTrades();
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast.error('Failed to delete trade.');
    }
  };

  const handleModalClose = () => {
    setIsAddTradeModalOpen(false);
    setSelectedTrade(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <EmptyState onAddTrade={() => setIsAddTradeModalOpen(true)} />
        <AddTradeModal
          isOpen={isAddTradeModalOpen}
          onClose={handleModalClose}
          onSuccess={fetchTrades}
          initialData={selectedTrade}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* <Navbar /> */}

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 min-w-0 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Hero Statistics */}
            <HeroStats trades={trades} />

            {/* Performance Chart */}
            <PerformanceChart trades={trades} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfitLossChart trades={trades} />
              <CalendarHeatmap trades={trades} />
            </div>

            {/* Recent Trades */}
            <RecentTrades 
              trades={trades} 
              onEdit={handleEditTrade} 
              onDelete={handleDeleteTrade} 
            />

            {/* AI Analyzer Section inline above Psychology and Goals */}
            <AIAnalyzerSection trades={trades} />

            {/* Psychology and Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingPsychology trades={trades} />
              <Goals trades={trades} />
            </div>

            {/* Assets and Strategies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BestPerformingAssets trades={trades} />
              <StrategyAnalytics trades={trades} />
            </div>

            {/* Journal Notes */}
            <JournalNotes trades={trades} />
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 p-6 border-l border-dark-border">
          <RightSidebar />
        </div>
      </div>

      {/* Floating Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-8 right-8 z-40 flex flex-col gap-4 items-end"
      >
        <Button
          onClick={() => setIsAddTradeModalOpen(true)}
          className="animatedBtn"
        >
          <Plus className="mr-2" size={20} />
          Add Trade
        </Button>
      </motion.div>

      {/* Add Trade Modal */}
      <AddTradeModal
        isOpen={isAddTradeModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchTrades}
        initialData={selectedTrade}
      />
    </div>
  );
};

export default TradingJournal;
