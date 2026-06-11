import React from 'react';
import { Users, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  Cell
} from 'recharts';

const THEME = {
    bgMain: '#f3f3f1',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#212c46',
    primaryLight: '#4d87a8',
    accent: '#a94228',
    gold: '#b58c4f',
    brightGold: '#b7a159',
    success: '#657f4d',
    danger: '#932c2e',
    warning: '#a94228',
    skyBlue: '#3f809e',
    dustyBlue: '#7a8b95',
    indigo: '#414757',
};

const GlassCard = ({ children, className = '', hoverEffect = true, style = {} }: any) => (
    <div className={`rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`}
        style={{ backgroundColor: THEME.glassWhite, ...style }}>
        {children}
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#212c46] border border-[#b58c4f]/40 p-3 rounded-xl shadow-lg font-sans text-white text-[11px] z-50">
        <p className="font-extrabold text-[10px] uppercase tracking-wider text-[#f3e5ab] border-b border-white/10 pb-1 mb-1.5">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="font-semibold flex items-center gap-1.5" style={{ color: item.color || '#fff' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: item.color || '#3f809e' }} />
            <span className="font-bold text-gray-300">{item.name || 'Value'}:</span> {item.value.toLocaleString()}{item.name === 'Attendance Rate' ? '%' : ' Employees'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const HRAnalyticsDashboard = () => {
  const departmentalData = [
    { name: 'Quality Control Planning', count: 680, fill: '#212c46', short: 'QC & Prod' },
    { name: 'Cold Logistics & Delivery', count: 340, fill: '#3f809e', short: 'Logistics' },
    { name: 'Sales & Corp Marketing', count: 225, fill: '#b58c4f', short: 'Sales' },
    { name: 'HR Operations & Recruiting', count: 120, fill: '#657f4d', short: 'HR Ops' },
    { name: 'Legal & Corp Compliance', count: 85, fill: '#932c2e', short: 'Legal' },
  ];

  const attendanceData = [
    { month: 'Dec 25', rate: 95.4 },
    { month: 'Jan 26', rate: 96.8 },
    { month: 'Feb 26', rate: 94.2 },
    { month: 'Mar 26', rate: 97.9 },
    { month: 'Apr 26', rate: 98.5 },
    { month: 'May 26', rate: 98.2 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full mb-5">
      {/* Headcount by Department */}
      <GlassCard className="bg-white border-[#f3f3f1] flex flex-col relative overflow-hidden min-h-[360px] w-full">
        <div className="absolute right-[-5%] top-[-5%] opacity-[0.03] pointer-events-none transform rotate-12 z-0">
          <Users size={180} className="text-[#212c46]" />
        </div>
        <div className="flex justify-between items-center mb-5 relative z-10">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
            <Users size={16} className="text-[#3f809e]" /> Headcount by Department
          </h2>
          <span className="text-[8px] font-black bg-[#212c46]/10 text-[#212c46] px-3 py-1 rounded-full uppercase tracking-widest">
            1,450 Total Staff
          </span>
        </div>
        <div className="flex-1 w-full relative z-10 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentalData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
              <XAxis 
                dataKey="short" 
                tick={{ fill: '#435665', fontSize: 9, fontWeight: 700 }} 
                line={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fill: '#7a8b95', fontSize: 9, fontWeight: 600 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f3f3f1', opacity: 0.5 }} />
              <Bar 
                dataKey="count" 
                name="Headcount" 
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              >
                {departmentalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Monthly Attendance Trends */}
      <GlassCard className="bg-white border-[#f3f3f1] flex flex-col relative overflow-hidden min-h-[360px] w-full">
        <div className="absolute right-[-5%] top-[-5%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <Activity size={180} className="text-[#3f809e]" />
        </div>
        <div className="flex justify-between items-center mb-5 relative z-10">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
            <Activity size={16} className="text-[#932c2e]" /> Monthly Attendance Trends
          </h2>
          <span className="text-[8px] font-black bg-[#3f809e]/10 text-[#3f809e] px-3 py-1 rounded-full uppercase tracking-widest">
            Target 95.0%
          </span>
        </div>
        <div className="flex-1 w-full relative z-10 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="attendanceColorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3f809e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3f809e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#435665', fontSize: 9, fontWeight: 700 }} 
                line={false} 
                tickLine={false} 
              />
              <YAxis 
                domain={[90, 100]}
                tick={{ fill: '#7a8b95', fontSize: 9, fontWeight: 600 }} 
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
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#attendanceColorGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
