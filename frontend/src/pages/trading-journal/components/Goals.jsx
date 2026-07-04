import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Target, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

const Goals = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#10b981]/10 rounded-lg">
            <Target className="text-[#10b981]" size={20} />
          </div>
          <CardTitle>Goals & Streaks</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Monthly Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Monthly Goal</span>
            <span className="text-xs font-medium text-white">₹15,000 / ₹20,000</span>
          </div>
          <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500" style={{ width: '75%' }} />
          </div>
          <span className="text-[10px] text-primary">75% Complete</span>
        </div>

        {/* Winning Streak */}
        <div className="flex items-center justify-between p-2 bg-dark-surface rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <TrendingUp className="text-primary" size={14} />
            </div>
            <div>
              <p className="text-xs font-medium text-white">Winning Streak</p>
              <p className="text-[10px] text-gray-400">Current streak</p>
            </div>
          </div>
          <span className="text-lg font-bold text-primary">8</span>
        </div>

        {/* Losing Streak */}
        <div className="flex items-center justify-between p-2 bg-dark-surface rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-danger/10 rounded-lg">
              <TrendingDown className="text-danger" size={14} />
            </div>
            <div>
              <p className="text-xs font-medium text-white">Losing Streak</p>
              <p className="text-[10px] text-gray-400">Current streak</p>
            </div>
          </div>
          <span className="text-lg font-bold text-danger">2</span>
        </div>

        {/* Completion */}
        <div className="flex items-center justify-between p-2 bg-dark-surface rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#3b82f6]/10 rounded-lg">
              <CheckCircle className="text-[#3b82f6]" size={14} />
            </div>
            <div>
              <p className="text-xs font-medium text-white">Monthly Completion</p>
              <p className="text-[10px] text-gray-400">Trades executed</p>
            </div>
          </div>
          <span className="text-lg font-bold text-[#3b82f6]">92%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Goals;
