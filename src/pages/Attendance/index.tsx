import React from 'react';
import { Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#212c46] border border-[#b58c4f]/40 p-3 rounded-xl shadow-lg font-sans text-white text-[11px] z-50">
        <p className="font-extrabold text-[10px] uppercase tracking-wider text-[#f3e5ab] border-b border-white/10 pb-1 mb-1.5">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="font-semibold flex items-center gap-1.5" style={{ color: item.color || '#fff' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: item.color || '#3f809e' }} />
            <span className="font-bold text-gray-300">{item.name || 'Value'}:</span> {item.value.toLocaleString()}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Attendance() {
  const attendanceData = [
    { month: 'Dec 25', rate: 95.4 },
    { month: 'Jan 26', rate: 96.8 },
    { month: 'Feb 26', rate: 94.2 },
    { month: 'Mar 26', rate: 97.9 },
    { month: 'Apr 26', rate: 98.5 },
    { month: 'May 26', rate: 98.2 },
  ];

  return (
    <div className="px-8 pb-8 pt-4 w-full h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-widest text-[#212c46] flex items-center gap-3">
          <Activity className="text-[#932c2e]" /> Attendance Core
        </h1>
        <p className="text-[10px] text-[#7a8b95] font-black tracking-[0.2em] uppercase mt-1">
          TRACK AND MONITOR EMPLOYEE ATTENDANCE RECORDS
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaeaec] flex flex-col relative overflow-hidden min-h-[400px] w-full">
        <div className="absolute right-[-5%] top-[-5%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <Activity size={180} className="text-[#3f809e]" />
        </div>
        <div className="flex justify-between items-center mb-5 relative z-10 border-b border-[#eaeaec] pb-4">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
            Monthly Attendance Trends
          </h2>
          <span className="text-[10px] font-black bg-[#3f809e]/10 text-[#3f809e] px-4 py-1.5 rounded-full uppercase tracking-widest">
            Target 95.0%
          </span>
        </div>
        <div className="flex-1 w-full relative z-10 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="attendanceColorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3f809e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3f809e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#435665', fontSize: 11, fontWeight: 700 }} 
                line={false} 
                tickLine={false} 
              />
              <YAxis 
                domain={[90, 100]}
                tick={{ fill: '#7a8b95', fontSize: 10, fontWeight: 600 }} 
                axisLine={false} 
                tickLine={false}
                unit="%"
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="rate" 
                name="Attendance Rate" 
                stroke="#3f809e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#attendanceColorGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
