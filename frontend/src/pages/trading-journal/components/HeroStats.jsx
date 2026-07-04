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

const HeroStats = () => {
  const stats = [
    {
      icon: BarChart3,
      label: 'Total Trades',
      value: '247',
      change: '+12.5%',
      positive: true,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 200 + Math.random() * 50 })),
    },
    {
      icon: TrendingUp,
      label: 'Winning Trades',
      value: '156',
      change: '+8.3%',
      positive: true,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 130 + Math.random() * 30 })),
    },
    {
      icon: TrendingDown,
      label: 'Losing Trades',
      value: '91',
      change: '-4.2%',
      positive: false,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 80 + Math.random() * 20 })),
    },
    {
      icon: Target,
      label: 'Win Rate',
      value: '63.2%',
      change: '+2.1%',
      positive: true,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 55 + Math.random() * 15 })),
    },
    {
      icon: DollarSign,
      label: 'Month Profit',
      value: '$12,450',
      change: '+18.7%',
      positive: true,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 10000 + Math.random() * 5000 })),
    },
    {
      icon: Activity,
      label: 'Month Loss',
      value: '$4,230',
      change: '-12.3%',
      positive: false,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 3000 + Math.random() * 2000 })),
    },
    {
      icon: Award,
      label: 'Avg Risk/Reward',
      value: '1:2.5',
      change: '+0.3',
      positive: true,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 2 + Math.random() * 1 })),
    },
    {
      icon: Zap,
      label: 'Net P&L',
      value: '$8,220',
      change: '+15.4%',
      positive: true,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 6000 + Math.random() * 4000 })),
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
