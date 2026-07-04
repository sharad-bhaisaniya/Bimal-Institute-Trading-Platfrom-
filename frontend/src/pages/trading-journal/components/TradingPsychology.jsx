import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Brain } from 'lucide-react';

const RadialProgress = ({ value, label, color }) => {
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#222"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="mt-1.5 text-[10px] text-gray-400">{label}</span>
    </div>
  );
};

const TradingPsychology = () => {
  const metrics = [
    { label: 'Fear', value: 25, color: '#ef4444' },
    { label: 'Greed', value: 30, color: '#f59e0b' },
    { label: 'FOMO', value: 20, color: '#8b5cf6' },
    { label: 'Confidence', value: 75, color: '#74b723' },
    { label: 'Discipline', value: 80, color: '#3b82f6' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Brain className="text-primary" size={16} />
          </div>
          <CardTitle>Trading Psychology</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {metrics.map((metric) => (
            <RadialProgress key={metric.label} {...metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingPsychology;
