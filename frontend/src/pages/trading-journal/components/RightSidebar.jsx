import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Badge } from '../../../components/trading-journal/Badge';
import { Target, Bell, AlertTriangle, Lightbulb, Activity } from 'lucide-react';

const RightSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Upcoming Goals */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Target className="text-[#10b981]" size={18} />
            <CardTitle className="text-base">Upcoming Goals</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-[#1a1a1a] rounded-lg">
            <p className="text-sm font-medium text-white mb-1">Reach ₹100k Portfolio</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>₹68,220 / ₹100,000</span>
              <span className="text-[#10b981]">68%</span>
            </div>
            <div className="mt-2 h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden">
              <div className="h-full bg-[#10b981] rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
          <div className="p-3 bg-[#1a1a1a] rounded-lg">
            <p className="text-sm font-medium text-white mb-1">Maintain 65% Win Rate</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Current: 63.2%</span>
              <span className="text-[#f59e0b]">-1.8%</span>
            </div>
            <div className="mt-2 h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden">
              <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: '63%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Reminders */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bell className="text-[#10b981]" size={18} />
            <CardTitle className="text-base">Reminders</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start space-x-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-[#10b981] mt-1.5" />
            <p className="text-gray-300">Review Nifty levels at 9:15 AM</p>
          </div>
          <div className="flex items-start space-x-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6] mt-1.5" />
            <p className="text-gray-300">F&O expiry this Thursday</p>
          </div>
          <div className="flex items-start space-x-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-[#8b5cf6] mt-1.5" />
            <p className="text-gray-300">RBI policy meeting tomorrow</p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Warning */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-[#f59e0b]" size={18} />
            <CardTitle className="text-base">Risk Warning</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-lg">
            <p className="text-xs text-[#f59e0b] leading-relaxed">
              Current exposure is at 85%. Consider reducing positions to stay within risk limits.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Motivation */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Lightbulb className="text-[#10b981]" size={18} />
            <CardTitle className="text-base">Daily Motivation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <blockquote className="text-sm text-gray-300 italic border-l-2 border-[#10b981] pl-3">
            "The stock market is a device for transferring money from the impatient to the patient."
            <footer className="text-xs text-gray-500 mt-2 not-italic">— Warren Buffett</footer>
          </blockquote>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Activity className="text-[#10b981]" size={18} />
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="text-gray-400">Added trade</span>
            <span className="text-gray-500">• 2h ago</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            <span className="text-gray-400">Updated goal</span>
            <span className="text-gray-500">• 5h ago</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
            <span className="text-gray-400">Added note</span>
            <span className="text-gray-500">• 1d ago</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
