import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Badge } from '../../../components/trading-journal/Badge';
import { Button } from '../../../components/trading-journal/Button';
import { Eye, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';

const RecentTrades = () => {
  const trades = [
    {
      id: 'TRD-001',
      date: '2024-01-15',
      market: 'NSE',
      broker: 'Zerodha',
      symbol: 'RELIANCE',
      type: 'BUY',
      entry: 2450.50,
      exit: 2580.75,
      quantity: 100,
      pnl: 13025,
      riskReward: '1:2.5',
      strategy: 'Breakout',
      status: 'WIN',
    },
    {
      id: 'TRD-002',
      date: '2024-01-14',
      market: 'NSE',
      broker: 'Zerodha',
      symbol: 'TCS',
      type: 'SELL',
      entry: 3850.00,
      exit: 3780.25,
      quantity: 50,
      pnl: -3487.5,
      riskReward: '1:1.2',
      strategy: 'Scalping',
      status: 'LOSS',
    },
    {
      id: 'TRD-003',
      date: '2024-01-13',
      market: 'NSE',
      broker: 'Upstox',
      symbol: 'INFY',
      type: 'BUY',
      entry: 1420.00,
      exit: 1485.50,
      quantity: 150,
      pnl: 9825,
      riskReward: '1:2.0',
      strategy: 'Swing',
      status: 'WIN',
    },
    {
      id: 'TRD-004',
      date: '2024-01-12',
      market: 'NSE',
      broker: 'Zerodha',
      symbol: 'HDFC',
      type: 'BUY',
      entry: 1650.25,
      exit: 1620.00,
      quantity: 75,
      pnl: -2268.75,
      riskReward: '1:0.8',
      strategy: 'Price Action',
      status: 'LOSS',
    },
    {
      id: 'TRD-005',
      date: '2024-01-11',
      market: 'NSE',
      broker: 'Zerodha',
      symbol: 'ICICI',
      type: 'BUY',
      entry: 980.00,
      exit: 1045.50,
      quantity: 200,
      pnl: 13100,
      riskReward: '1:2.8',
      strategy: 'EMA',
      status: 'WIN',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Trades</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Trade ID</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Symbol</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Entry</th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Exit</th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">P&L</th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-center py-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-dark-border/50 hover:bg-dark-surface/50 transition-colors">
                  <td className="py-2 px-3 text-xs text-gray-300">{trade.id}</td>
                  <td className="py-2 px-3 text-xs text-gray-300">{format(new Date(trade.date), 'MMM dd')}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-medium text-white">{trade.symbol}</span>
                      <Badge variant="secondary" className="text-[10px]">{trade.market}</Badge>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className={`flex items-center ${trade.type === 'BUY' ? 'text-primary' : 'text-danger'}`}>
                      {trade.type === 'BUY' ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                      <span className="text-xs font-medium">{trade.type}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-300 text-right">₹{trade.entry.toFixed(2)}</td>
                  <td className="py-2 px-3 text-xs text-gray-300 text-right">₹{trade.exit.toFixed(2)}</td>
                  <td className={`py-2 px-3 text-xs font-medium text-right ${trade.pnl >= 0 ? 'text-primary' : 'text-danger'}`}>
                    {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <Badge variant={trade.status === 'WIN' ? 'success' : 'danger'}>
                      {trade.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center justify-center space-x-1">
                      <button className="p-1 rounded-lg hover:bg-dark-surface text-gray-400 hover:text-white transition-colors">
                        <Eye size={12} />
                      </button>
                      <button className="p-1 rounded-lg hover:bg-dark-surface text-gray-400 hover:text-white transition-colors">
                        <Edit size={12} />
                      </button>
                      <button className="p-1 rounded-lg hover:bg-dark-surface text-gray-400 hover:text-danger transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTrades;
