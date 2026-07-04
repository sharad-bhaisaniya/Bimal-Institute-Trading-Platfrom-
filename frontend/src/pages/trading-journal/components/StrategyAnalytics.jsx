import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Badge } from '../../../components/trading-journal/Badge';
import { BarChart3 } from 'lucide-react';

const StrategyCard = ({ name, winRate, profit, loss, avgRR }) => (
  <div className="p-3 bg-dark-surface rounded-xl hover:bg-dark-border transition-colors">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-xs font-medium text-white">{name}</h4>
      <Badge variant={winRate >= 60 ? 'success' : winRate >= 50 ? 'warning' : 'danger'}>
        {winRate}% WR
      </Badge>
    </div>
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Profit</span>
        <span className="text-primary font-medium">₹{profit.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Loss</span>
        <span className="text-danger font-medium">₹{loss.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Avg RR</span>
        <span className="text-white font-medium">{avgRR}</span>
      </div>
    </div>
  </div>
);

const StrategyAnalytics = () => {
  const strategies = [
    { name: 'Breakout', winRate: 68, profit: 28500, loss: 12500, avgRR: '1:2.5' },
    { name: 'Scalping', winRate: 58, profit: 18200, loss: 15000, avgRR: '1:1.8' },
    { name: 'Swing', winRate: 72, profit: 32100, loss: 9800, avgRR: '1:2.8' },
    { name: 'Price Action', winRate: 65, profit: 24500, loss: 14200, avgRR: '1:2.2' },
    { name: 'EMA', winRate: 62, profit: 19800, loss: 13500, avgRR: '1:2.0' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#10b981]/10 rounded-lg">
            <BarChart3 className="text-[#10b981]" size={20} />
          </div>
          <CardTitle>Strategy Analytics</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {strategies.map((strategy) => (
            <StrategyCard key={strategy.name} {...strategy} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyAnalytics;
