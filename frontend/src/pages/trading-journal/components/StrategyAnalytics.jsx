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

const StrategyAnalytics = ({ trades = [] }) => {
  const strategyStats = {};

  trades.forEach(trade => {
    const strategyName = trade.strategy_used || trade.strategy || 'Unknown';
    if (!strategyStats[strategyName]) {
      strategyStats[strategyName] = {
        name: strategyName,
        totalTrades: 0,
        winningTrades: 0,
        profit: 0,
        loss: 0,
        totalRR: 0,
        validRRCount: 0,
      };
    }
    const stat = strategyStats[strategyName];
    stat.totalTrades += 1;
    
    if (trade.pnl > 0 || trade.status === 'WIN' || trade.trade_result === 'Target') {
      stat.winningTrades += 1;
    }
    
    if (trade.pnl > 0) {
      stat.profit += trade.pnl;
    } else if (trade.pnl < 0) {
      stat.loss += Math.abs(trade.pnl);
    }

    if (trade.risk_reward) {
      const parts = String(trade.risk_reward).split(':');
      const val = parts.length === 2 ? parseFloat(parts[1]) : parseFloat(parts[0]);
      if (!isNaN(val)) {
        stat.totalRR += val;
        stat.validRRCount += 1;
      }
    }
  });

  const strategies = Object.values(strategyStats).map(stat => {
    const winRate = stat.totalTrades > 0 ? Math.round((stat.winningTrades / stat.totalTrades) * 100) : 0;
    const avgRRVal = stat.validRRCount > 0 ? (stat.totalRR / stat.validRRCount).toFixed(1) : '0.0';
    return {
      name: stat.name,
      winRate: winRate,
      profit: stat.profit,
      loss: stat.loss,
      avgRR: `1:${avgRRVal}`
    };
  }).sort((a, b) => b.profit - a.profit);

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
