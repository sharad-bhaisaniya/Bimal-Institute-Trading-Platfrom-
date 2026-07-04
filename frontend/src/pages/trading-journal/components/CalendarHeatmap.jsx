import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/trading-journal/Card';
import { Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const CalendarHeatmap = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Mock data for P&L per day
  const dailyPnL = {};
  days.forEach(day => {
    const randomValue = Math.random() > 0.4 ? Math.random() * 1000 : -Math.random() * 500;
    dailyPnL[format(day, 'yyyy-MM-dd')] = randomValue;
  });

  const getIntensity = (value) => {
    if (value > 500) return 'bg-emerald-500';
    if (value > 200) return 'bg-emerald-400';
    if (value > 0) return 'bg-emerald-300';
    if (value > -200) return 'bg-red-300';
    if (value > -500) return 'bg-red-400';
    return 'bg-red-500';
  };

  const weeks = [];
  let currentWeek = [];
  
  days.forEach((day, index) => {
    currentWeek.push(day);
    if (day.getDay() === 6 || index === days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#10b981]/10 rounded-lg">
            <Calendar className="text-[#10b981]" size={20} />
          </div>
          <CardTitle>Trading Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{format(monthStart, 'MMM yyyy')}</span>
            <div className="flex items-center space-x-2">
              <span className="flex items-center"><span className="w-3 h-3 bg-[#10b981] rounded mr-1"></span>High</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-[#6ee7b7] rounded mr-1"></span>Low</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-[#ef4444] rounded mr-1"></span>Loss</span>
            </div>
          </div>
          
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex space-x-1">
              {week.map((day, dayIndex) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const pnl = dailyPnL[dateStr] || 0;
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                
                return (
                  <button
                    key={dayIndex}
                    onClick={() => setSelectedDate(day)}
                    disabled={!isCurrentMonth}
                    className={`
                      flex-1 aspect-square rounded-md transition-all hover:scale-110
                      ${isCurrentMonth ? getIntensity(pnl) : 'bg-[#1a1a1a]/30'}
                      ${selectedDate && isSameDay(selectedDate, day) ? 'ring-2 ring-white' : ''}
                    `}
                    title={`${format(day, 'MMM dd')}: $${pnl.toFixed(2)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {selectedDate && (
          <div className="mt-4 p-3 bg-dark-surface rounded-lg">
            <p className="text-sm text-gray-400">
              {format(selectedDate, 'MMMM dd, yyyy')}: 
              <span className={`ml-2 font-semibold ${dailyPnL[format(selectedDate, 'yyyy-MM-dd')] >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${dailyPnL[format(selectedDate, 'yyyy-MM-dd')]?.toFixed(2) || '0.00'}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarHeatmap;
