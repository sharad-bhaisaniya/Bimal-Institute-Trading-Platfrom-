import React, { useState } from 'react';
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

const TradingJournal = () => {
  const [isAddTradeModalOpen, setIsAddTradeModalOpen] = useState(false);
  const [hasTrades, setHasTrades] = useState(true); // Set to false to test empty state

  if (!hasTrades) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* <Navbar /> */}
        <EmptyState onAddTrade={() => setIsAddTradeModalOpen(true)} />
        <AddTradeModal
          isOpen={isAddTradeModalOpen}
          onClose={() => setIsAddTradeModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* <Navbar /> */}

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Hero Statistics */}
            <HeroStats />

            {/* Performance Chart */}
            <PerformanceChart />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfitLossChart />
              <CalendarHeatmap />
            </div>

            {/* Recent Trades */}
            <RecentTrades />

            {/* Psychology and Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingPsychology />
              <Goals />
            </div>

            {/* Assets and Strategies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BestPerformingAssets />
              <StrategyAnalytics />
            </div>

            {/* Journal Notes */}
            <JournalNotes />
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 p-6 border-l border-dark-border">
          <RightSidebar />
        </div>
      </div>

      {/* Floating Add Trade Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Button
          // variant="primary"
          // size="lg"
          onClick={() => setIsAddTradeModalOpen(true)}
          className=" animatedBtn"

        >
          <Plus className="mr-2" size={20} />
          Add Trade
        </Button>
      </motion.div>

      {/* Add Trade Modal */}
      <AddTradeModal
        isOpen={isAddTradeModalOpen}
        onClose={() => setIsAddTradeModalOpen(false)}
      />
    </div>
  );
};

export default TradingJournal;
