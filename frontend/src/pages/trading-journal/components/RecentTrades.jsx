import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Badge } from '../../../components/trading-journal/Badge';
import { Button } from '../../../components/trading-journal/Button';
import { Eye, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';

const RecentTrades = ({ trades = [], onEdit, onDelete }) => {

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
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">S.no</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Day</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Segment</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Script</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Trade Type</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Buy / Sell</th>
                <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Entry Price</th>
                <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Stop Loss</th>
                <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Target Price</th>
                <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Risk : Reward</th>
                <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Quantity</th>
                <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">PROFIT/LOSS</th>
                <th className="text-center py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Result</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Strategy Name</th>
                <th className="text-center py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Entry Time</th>
                <th className="text-center py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Exit Time</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Remark 1</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Remark 2</th>
                <th className="text-center py-1.5 px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr key={trade._id || index} className="border-b border-dark-border/50 hover:bg-dark-surface/50 transition-colors">
                  <td className="py-1.5 px-2 text-xs text-gray-300 whitespace-nowrap">{index + 1}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 whitespace-nowrap">{format(new Date(trade.date), 'MMM dd')}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 whitespace-nowrap">{trade.day}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 whitespace-nowrap">{trade.segment || trade.market}</td>
                  <td className="py-1.5 px-2 whitespace-nowrap">
                    <span className="text-xs font-medium text-white">{trade.symbol}</span>
                  </td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 whitespace-nowrap">{trade.trade_type}</td>
                  <td className="py-1.5 px-2 whitespace-nowrap">
                    <div className={`flex items-center ${trade.type?.toUpperCase() === 'BUY' ? 'text-primary' : 'text-danger'}`}>
                      {trade.type?.toUpperCase() === 'BUY' ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                      <span className="text-xs font-medium">{trade.type}</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 text-right whitespace-nowrap">₹{trade.entry_price?.toFixed(2)}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 text-right whitespace-nowrap">₹{trade.stop_loss?.toFixed(2) || '-'}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 text-right whitespace-nowrap">₹{trade.target_price?.toFixed(2) || '-'}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 text-right whitespace-nowrap">{trade.risk_reward}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 text-right whitespace-nowrap">{trade.quantity}</td>
                  <td className={`py-1.5 px-2 text-xs font-medium text-right whitespace-nowrap ${trade.pnl >= 0 ? 'text-primary' : 'text-danger'}`}>
                    {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl?.toLocaleString()}
                  </td>
                  <td className="py-1.5 px-2 text-center whitespace-nowrap">
                    <Badge variant={
                      trade.status === 'WIN' || trade.trade_result === 'Target' ? 'success' : 
                      (trade.status === 'LOSS' || trade.trade_result === 'Stoploss' ? 'danger' : 'secondary')
                    }>
                      {(trade.status && trade.status !== 'OPEN') ? trade.status : (trade.trade_result || 'Pending')}
                    </Badge>
                  </td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 whitespace-nowrap">{trade.strategy_used || trade.strategy}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 text-center whitespace-nowrap">{trade.trade_entry_time}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 text-center whitespace-nowrap">{trade.trade_exit_time}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 whitespace-nowrap">{trade.remark_1}</td>
                  <td className="py-1.5 px-2 text-xs text-gray-300 whitespace-nowrap">{trade.remark_2}</td>
                  <td className="py-1.5 px-2">
                    <div className="flex items-center justify-center space-x-1">
                      <button className="p-1 rounded-lg hover:bg-dark-surface text-gray-400 hover:text-white transition-colors">
                        <Eye size={12} />
                      </button>
                      <button 
                        onClick={() => onEdit && onEdit(trade)}
                        className="p-1 rounded-lg hover:bg-dark-surface text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        onClick={() => onDelete && onDelete(trade._id)}
                        className="p-1 rounded-lg hover:bg-dark-surface text-gray-400 hover:text-danger transition-colors"
                      >
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
