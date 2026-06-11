import React from 'react';
import { Users } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#212c46] border border-[#b58c4f]/40 p-3 rounded-xl shadow-lg font-sans text-white text-[11px] z-50">
        <p className="font-extrabold text-[10px] uppercase tracking-wider text-[#f3e5ab] border-b border-white/10 pb-1 mb-1.5">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="font-semibold flex items-center gap-1.5" style={{ color: item.color || '#fff' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: item.color || '#3f809e' }} />
            <span className="font-bold text-gray-300">{item.name || 'Value'}:</span> {item.value.toLocaleString()} Employees
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Employees() {
  const departmentalData = [
    { name: 'Quality Control Planning', count: 680, fill: '#212c46', short: 'QC & Prod' },
    { name: 'Cold Logistics & Delivery', count: 340, fill: '#3f809e', short: 'Logistics' },
    { name: 'Sales & Corp Marketing', count: 225, fill: '#b58c4f', short: 'Sales' },
    { name: 'HR Operations & Recruiting', count: 120, fill: '#657f4d', short: 'HR Ops' },
    { name: 'Legal & Corp Compliance', count: 85, fill: '#932c2e', short: 'Legal' },
  ];

  return (
    <div className="px-8 pb-8 pt-4 w-full h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-widest text-[#212c46] flex items-center gap-3">
          <Users className="text-[#3f809e]" /> Employees Directory
        </h1>
        <p className="text-[10px] text-[#7a8b95] font-black tracking-[0.2em] uppercase mt-1">
          MANAGE AND VIEW ALL EMPLOYEES ACROSS DEPARTMENTS
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaeaec] flex flex-col relative overflow-hidden min-h-[400px] w-full mb-8">
        <div className="absolute right-[-5%] top-[-5%] opacity-[0.03] pointer-events-none transform rotate-12 z-0">
          <Users size={180} className="text-[#212c46]" />
        </div>
        <div className="flex justify-between items-center mb-5 relative z-10 border-b border-[#eaeaec] pb-4">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
             Headcount by Department
          </h2>
          <span className="text-[10px] font-black bg-[#212c46]/10 text-[#212c46] px-4 py-1.5 rounded-full uppercase tracking-widest">
            1,450 Total Staff
          </span>
        </div>
        <div className="flex-1 w-full relative z-10 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentalData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
              <XAxis 
                dataKey="short" 
                tick={{ fill: '#435665', fontSize: 11, fontWeight: 700 }} 
                line={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fill: '#7a8b95', fontSize: 10, fontWeight: 600 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f3f3f1', opacity: 0.5 }} />
              <Bar 
                dataKey="count" 
                name="Headcount" 
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              >
                {departmentalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
