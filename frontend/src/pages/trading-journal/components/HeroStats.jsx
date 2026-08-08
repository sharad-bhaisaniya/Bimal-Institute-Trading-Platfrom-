import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../../components/trading-journal/Card';
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, Award, Zap, BarChart3 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const StatCard = ({ icon: Icon, label, value, change, positive, data }) => (
  <Card hover glass>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="text-primary" size={18} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
          <div className="text-xl font-bold text-white mb-1">{value}</div>
          <div className={`flex items-center text-xs ${positive ? 'text-primary' : 'text-danger'}`}>
            {positive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {change}
          </div>
        </div>
        <div className="h-14 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={positive ? '#74b723' : '#FF5252'}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip content={() => null} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardContent>
  </Card>
);

const HeroStats = ({ trades = [] }) => {
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.pnl > 0 || t.status === 'WIN' || t.trade_result === 'Target').length;
  const losingTrades = trades.filter(t => t.pnl < 0 || t.status === 'LOSS' || t.trade_result === 'Stoploss').length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  
  const totalProfit = trades.reduce((sum, t) => sum + (t.pnl > 0 ? t.pnl : 0), 0);
  const totalLoss = trades.reduce((sum, t) => sum + (t.pnl < 0 ? Math.abs(t.pnl) : 0), 0);
  const netPnL = totalProfit - totalLoss;

  let totalRR = 0;
  let validRRCount = 0;
  trades.forEach(t => {
    if (t.risk_reward) {
      const parts = String(t.risk_reward).split(':');
      let val = null;
      if (parts.length === 2) {
        val = parseFloat(parts[1]);
      } else {
        val = parseFloat(parts[0]);
      }
      if (!isNaN(val)) {
        totalRR += val;
        validRRCount++;
      }
    }
  });
  const avgRR = validRRCount > 0 ? (totalRR / validRRCount).toFixed(1) : '0.0';

  const defaultData = Array.from({ length: 10 }, () => ({ value: 0 }));

  const stats = [
    {
      icon: BarChart3,
      label: 'Total Trades',
      value: totalTrades.toString(),
      change: '-',
      positive: true,
      data: defaultData,
    },
    {
      icon: TrendingUp,
      label: 'Winning Trades',
      value: winningTrades.toString(),
      change: '-',
      positive: true,
      data: defaultData,
    },
    {
      icon: TrendingDown,
      label: 'Losing Trades',
      value: losingTrades.toString(),
      change: '-',
      positive: false,
      data: defaultData,
    },
    {
      icon: Target,
      label: 'Win Rate',
      value: `${winRate}%`,
      change: '-',
      positive: winRate >= 50,
      data: defaultData,
    },
    {
      icon: DollarSign,
      label: 'Total Profit',
      value: `₹${totalProfit.toLocaleString()}`,
      change: '-',
      positive: true,
      data: defaultData,
    },
    {
      icon: Activity,
      label: 'Total Loss',
      value: `₹${totalLoss.toLocaleString()}`,
      change: '-',
      positive: false,
      data: defaultData,
    },
    {
      icon: Award,
      label: 'Avg Risk/Reward',
      value: `1:${avgRR}`,
      change: '-',
      positive: avgRR >= 1.5,
      data: defaultData,
    },
    {
      icon: Zap,
      label: 'Net P&L',
      value: `₹${netPnL.toLocaleString()}`,
      change: '-',
      positive: netPnL >= 0,
      data: defaultData,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HeroStats;
