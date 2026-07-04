import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

const ProfitLossChart = () => {
  const data = [
    { month: 'Jan', profit: 2500, loss: -1200 },
    { month: 'Feb', profit: 3200, loss: -800 },
    { month: 'Mar', profit: 1800, loss: -2100 },
    { month: 'Apr', profit: 4100, loss: -900 },
    { month: 'May', profit: 2800, loss: -1500 },
    { month: 'Jun', profit: 3500, loss: -700 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <DollarSign className="text-primary" size={16} />
          </div>
          <CardTitle>Monthly Profit & Loss</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #222',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => [`$${value.toLocaleString()}`, value > 0 ? 'Profit' : 'Loss']}
              />
              <Bar dataKey="profit" fill="#74b723" radius={[2, 2, 0, 0]} />
              <Bar dataKey="loss" fill="#FF5252" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitLossChart;
