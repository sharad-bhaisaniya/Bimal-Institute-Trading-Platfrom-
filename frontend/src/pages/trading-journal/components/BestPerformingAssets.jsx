import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Badge } from '../../../components/trading-journal/Badge';
import { Trophy } from 'lucide-react';

const BestPerformingAssets = ({ trades = [] }) => {
  const assetStats = {};

  trades.forEach(trade => {
    const assetName = trade.symbol || 'Unknown';
    if (!assetStats[assetName]) {
      assetStats[assetName] = {
        name: assetName,
        trades: 0,
        winningTrades: 0,
        profit: 0,
        totalRR: 0,
        validRRCount: 0,
      };
    }
    const stat = assetStats[assetName];
    stat.trades += 1;
    
    if (trade.pnl > 0 || trade.status === 'WIN' || trade.trade_result === 'Target') {
      stat.winningTrades += 1;
    }
    
    if (trade.pnl) {
      stat.profit += trade.pnl;
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

  const assets = Object.values(assetStats).map(stat => {
    const winRate = stat.trades > 0 ? Math.round((stat.winningTrades / stat.trades) * 100) : 0;
    const avgRRVal = stat.validRRCount > 0 ? (stat.totalRR / stat.validRRCount).toFixed(1) : '0.0';
    return {
      name: stat.name,
      trades: stat.trades,
      winRate: winRate,
      profit: stat.profit,
      avgRR: `1:${avgRRVal}`
    };
  })
  .sort((a, b) => b.profit - a.profit)
  .slice(0, 5); // Show top 5 best performing assets

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#10b981]/10 rounded-lg">
            <Trophy className="text-[#10b981]" size={20} />
          </div>
          <CardTitle>Best Performing Assets</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Asset</th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Trades</th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Win Rate</th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Profit</th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Avg RR</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={asset.name} className="border-b border-dark-border/50 hover:bg-dark-surface/50 transition-colors">
                  <td className="py-2 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-medium text-white">{asset.name}</span>
                      {index === 0 && <Badge variant="success" className="text-[10px]">Top</Badge>}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-300 text-center">{asset.trades}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`text-xs font-medium ${asset.winRate >= 70 ? 'text-primary' : asset.winRate >= 60 ? 'text-[#f59e0b]' : 'text-danger'}`}>
                      {asset.winRate}%
                    </span>
                  </td>
                  <td className={`py-2 px-3 text-xs font-medium text-right ${asset.profit >= 0 ? 'text-primary' : 'text-danger'}`}>
                    {asset.profit >= 0 ? '+' : ''}₹{asset.profit.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-300 text-center">{asset.avgRR}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BestPerformingAssets;
