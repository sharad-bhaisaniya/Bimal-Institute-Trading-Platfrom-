import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Badge } from '../../../components/trading-journal/Badge';
import { Trophy } from 'lucide-react';

const BestPerformingAssets = () => {
  const assets = [
    { name: 'RELIANCE', trades: 45, winRate: 72, profit: 45200, avgRR: '1:2.8' },
    { name: 'TCS', trades: 32, winRate: 68, profit: 38500, avgRR: '1:2.5' },
    { name: 'INFY', trades: 28, winRate: 65, profit: 32100, avgRR: '1:2.3' },
    { name: 'HDFC', trades: 38, winRate: 62, profit: 28900, avgRR: '1:2.1' },
    { name: 'ICICI', trades: 42, winRate: 70, profit: 26500, avgRR: '1:2.4' },
  ];

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
                  <td className="py-2 px-3 text-xs font-medium text-primary text-right">₹{asset.profit.toLocaleString()}</td>
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
