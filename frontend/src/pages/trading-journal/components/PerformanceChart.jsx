import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const PerformanceChart = () => {
  const [timeFilter, setTimeFilter] = useState('Month');

  const filters = ['Today', 'Week', 'Month', 'Year', 'Custom'];

  const data = [
    { date: 'Jan', equity: 50000 },
    { date: 'Feb', equity: 52500 },
    { date: 'Mar', equity: 51000 },
    { date: 'Apr', equity: 54500 },
    { date: 'May', equity: 56000 },
    { date: 'Jun', equity: 55200 },
    { date: 'Jul', equity: 58500 },
    { date: 'Aug', equity: 61000 },
    { date: 'Sep', equity: 59500 },
    { date: 'Oct', equity: 63000 },
    { date: 'Nov', equity: 65500 },
    { date: 'Dec', equity: 68220 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <TrendingUp className="text-primary" size={16} />
            </div>
            <CardTitle>Portfolio Equity Curve</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-2 py-1 text-xs rounded-lg transition-all ${
                  timeFilter === filter
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-surface'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #222',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Equity']}
              />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="#74b723"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#74b723' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
