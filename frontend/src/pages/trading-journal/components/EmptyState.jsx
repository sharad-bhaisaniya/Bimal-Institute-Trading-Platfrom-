import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus } from 'lucide-react';
import { Button } from '../../../components/trading-journal/Button';

const EmptyState = ({ onAddTrade }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#10b981]/20 to-[#047857]/20 rounded-full flex items-center justify-center">
            <TrendingUp className="text-[#10b981]" size={64} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-white mb-4"
        >
          No trades yet
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-gray-400 mb-8"
        >
          Start your first trade journal to unlock powerful analytics and insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button variant="primary" size="lg" onClick={onAddTrade} className="shadow-glow">
            <Plus size={20} className="mr-2" />
            Add Your First Trade
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-6"
        >
          {[
            { icon: '📊', label: 'Track Performance' },
            { icon: '🎯', label: 'Set Goals' },
            { icon: '📝', label: 'Journal Notes' },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <p className="text-sm text-gray-400">{feature.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmptyState;
