import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, ComposedChart, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, BarChart3, Activity, Layers, ArrowUpRight, 
  Percent, DollarSign, BookOpen, Scale, Landmark
} from 'lucide-react';

// Color themes corresponding to CEO Portal
const CHARTS_THEME = {
  primary: '#212c46',
  secondary: '#b58c4f', // gold/amber branding accent
  success: '#657f4d',   // green margin
  danger: '#932c2e',    // crimson/red cost
  indigo: '#4f46e5',
  neutral: '#7a8b95'
};

const MONTH_LABELS = [
  'Jan-2026', 'Feb-2026', 'Mar-2026', 'Apr-2026', 'May-2026', 'Jun-2026',
  'Jul-2026', 'Aug-2026', 'Sep-2026', 'Oct-2026', 'Nov-2026', 'Dec-2026'
];

interface CellData {
  sales: number;
  pcs: number;
  varCost: number;
}

interface CategoryData {
  category: string;
  categoryTh: string;
  months: Record<string, CellData>;
}

// Fallback initial data in case localstorage hasn't been instantiated yet
const FALLBACK_CATEGORIES: CategoryData[] = [
  {
    category: 'Ironing Table',
    categoryTh: 'โต๊ะรีดผ้า',
    months: {
      'Jan-2026': { sales: 4705664, pcs: 40710, varCost: 4559520 },
      'Feb-2026': { sales: 3273033, pcs: 33848, varCost: 3790976 },
      'Mar-2026': { sales: 5472679, pcs: 55059, varCost: 6166608 },
      'Apr-2026': { sales: 4327815, pcs: 38540, varCost: 4316480 },
      'May-2026': { sales: 9698316, pcs: 94010, varCost: 10529120 },
      'Jun-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Jul-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Aug-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Sep-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Oct-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Nov-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Dec-2026': { sales: 0, pcs: 0, varCost: 0 },
    }
  },
  {
    category: 'Rack A',
    categoryTh: 'ราวA',
    months: {
      'Jan-2026': { sales: 4079643, pcs: 27505, varCost: 3135570 },
      'Feb-2026': { sales: 2426982, pcs: 20300, varCost: 2314200 },
      'Mar-2026': { sales: 2486494, pcs: 22261, varCost: 2537754 },
      'Apr-2026': { sales: 3105950, pcs: 24416, varCost: 2807840 },
      'May-2026': { sales: 4816623, pcs: 41298, varCost: 4604727 },
      'Jun-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Jul-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Aug-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Sep-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Oct-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Nov-2026': { sales: 0, pcs: 0, varCost: 0 },
      'Dec-2026': { sales: 0, pcs: 0, varCost: 0 },
    }
  }
];

const FALLBACK_FIXED_COSTS: Record<string, number> = {
  'Jan-2026': 3333100,
  'Feb-2026': 2716300,
  'Mar-2026': 3015800,
  'Apr-2026': 1870400,
  'May-2026': 2976900,
  'Jun-2026': 0, 'Jul-2026': 0, 'Aug-2026': 0, 'Sep-2026': 0, 'Oct-2026': 0, 'Nov-2026': 0, 'Dec-2026': 0
};

export default function MarginAnalysis() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState('2026');

  // Load live values synchronized with simulation page in real-time!
  const categories: CategoryData[] = useMemo(() => {
    const saved = localStorage.getItem('margin_categories_v1');
    return saved ? JSON.parse(saved) : FALLBACK_CATEGORIES;
  }, []);

  const fixedCosts: Record<string, number> = useMemo(() => {
    const saved = localStorage.getItem('margin_fixed_costs_v1');
    return saved ? JSON.parse(saved) : FALLBACK_FIXED_COSTS;
  }, []);

  // Compute calculated values per month corresponding to rules
  const calculatedMonthlyTotals = useMemo(() => {
    const monthlyTotals: Record<string, {
      monthKey: string;
      revenue: number;
      varCost: number;
      fixedCost: number;
      grossMargin: number; // Revenue - VarCost
      netMargin: number;   // Revenue - VarCost - FixedCost
      pctMargin: number;   // (GrossMargin / Revenue) * 100
      pctNetMargin: number;// (NetMargin / Revenue) * 100
      isProfitable: boolean;
    }> = {};

    MONTH_LABELS.forEach(m => {
      let monthRev = 0;
      let monthVC = 0;

      categories.forEach(cat => {
        const monData = cat.months[m];
        if (monData) {
          monthRev += monData.sales || 0;
          monthVC += monData.varCost || 0;
        }
      });

      const fixedCost = fixedCosts[m] || 0;
      const grossMargin = monthRev - monthVC;
      const netMargin = grossMargin - fixedCost;
      const pctMargin = monthRev > 0 ? (grossMargin / monthRev) * 100 : 0;
      const pctNetMargin = monthRev > 0 ? (netMargin / monthRev) * 100 : 0;

      monthlyTotals[m] = {
        monthKey: m,
        revenue: monthRev,
        varCost: monthVC,
        fixedCost,
        grossMargin,
        netMargin,
        pctMargin,
        pctNetMargin,
        isProfitable: netMargin >= 0
      };
    });

    return monthlyTotals;
  }, [categories, fixedCosts]);

  // Clean data structured specifically for Area / Bar Charts
  const chartData = useMemo(() => {
    return MONTH_LABELS.map(m => {
      const data = calculatedMonthlyTotals[m];
      const label = m.split('-')[0];
      return {
        month: t(label, label),
        revenue: data.revenue,
         varCost: data.varCost,
         fixedCost: data.fixedCost,
         grossMargin: data.grossMargin,
         netMargin: data.netMargin,
         pctMargin: parseFloat(data.pctMargin.toFixed(2)),
         pctNetMargin: parseFloat(data.pctNetMargin.toFixed(2))
      };
    }).filter(d => d.revenue > 0 || d.varCost > 0 || d.fixedCost > 0); // Hide months with no data for clean visual focus
  }, [calculatedMonthlyTotals, t]);

  // Overall Cumulative Summaries
  const cumulativeStats = useMemo(() => {
    let rev = 0;
    let vc = 0;
    let fc = 0;

    Object.keys(calculatedMonthlyTotals).forEach(key => {
      const v = calculatedMonthlyTotals[key];
      rev += v.revenue;
      vc += v.varCost;
      fc += v.fixedCost;
    });

    const grossMargin = rev - vc;
    const netMargin = grossMargin - fc;
    const pctMargin = rev > 0 ? (grossMargin / rev) * 100 : 0;
    const pctNetMargin = rev > 0 ? (netMargin / rev) * 100 : 0;

    return {
      revenue: rev,
      varCost: vc,
      fixedCost: fc,
      grossMargin,
      netMargin,
      pctMargin,
      pctNetMargin
    };
  }, [calculatedMonthlyTotals]);

  const formatTHB = (val: number) => {
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ฿';
  };

  const formatMillions = (val: number) => {
    return (val / 1000000).toFixed(2) + ' MB';
  };

  return (
    <div className="flex flex-col w-full pb-10 bg-transparent min-h-screen">
      
      {/* PAGE HEADER */}
      <div className="h-14 px-4 sm:px-8 mt-[2px] mb-4 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#657f4d] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 border border-[#657f4d]/40 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Scale size={22} className="text-[#657f4d]" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-[24px]">
              {t('MARGIN ANALYSIS', 'วิเคราะห์โครงสร้างกำไร')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#657f4d] to-[#b58c4f]">{t('PROFITABILITY', 'ผลประกอบการ')}</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              {t('NET OPERATIONAL PROFITABILITY, CONTRIBUTION MARGINS & OVERHEAD MATRIX', 'วิเคราะห์กำไรสะสมหลังหักค่าใช้จ่ายส่วนกลางและงบต้นทุนทุนแปรผันผวน')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#eaeaec] rounded-xl px-2 py-1 shadow-sm h-9">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">{t('YEAR:', 'ปี:')}</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-[11px] font-black text-[#212c46] outline-none bg-transparent cursor-pointer"
            >
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-8 mb-6">
        
        {/* Revenue */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#212c46] transition-all">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('CUMULATIVE SALES VALUE', 'ยอดจำหน่ายสะสมรวม')}</p>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatMillions(cumulativeStats.revenue)}</h4>
            <span className="text-[12px] font-bold text-slate-400">100%</span>
          </div>
        </div>

        {/* Contribution Margin */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#b58c4f] transition-all">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('GROSS MARGINS', 'กำไรขั้นต้นสะสม')}</p>
            <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#b58c4f]">
              <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatMillions(cumulativeStats.grossMargin)}</h4>
            <span className="text-[12px] font-black text-[#b58c4f] bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded text-[10px] font-mono">{cumulativeStats.pctMargin.toFixed(1)}%</span>
          </div>
        </div>

        {/* Total Overheads */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-red-600 transition-all">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('TOTAL FIXED COST OVERHEAD', 'ต้นทุนคงที่จำลองรวม')}</p>
            <div className="h-7 w-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <Landmark size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatMillions(cumulativeStats.fixedCost)}</h4>
            <span className="text-[12px] font-bold text-red-500 font-mono">{( (cumulativeStats.fixedCost / (cumulativeStats.revenue || 1)) * 100 ).toFixed(1)}%</span>
          </div>
        </div>

        {/* Net Operational Margin */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#657f4d] transition-all">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('NET OPERATIONAL INCOME', 'กำไรสะสมสุทธิ (P/L)')}</p>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#657f4d]">
              <Percent size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className={`text-[20px] font-black tracking-tight ${cumulativeStats.netMargin >= 0 ? 'text-[#657f4d]' : 'text-[#932c2e]'}`}>{formatMillions(cumulativeStats.netMargin)}</h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${cumulativeStats.netMargin >= 0 ? 'bg-emerald-50 text-[#657f4d] border-emerald-100' : 'bg-red-50 text-[#932c2e] border-red-100'}`}>
              {cumulativeStats.pctNetMargin.toFixed(1)}%
            </span>
          </div>
        </div>

      </div>

      {/* RECHARTS PLOTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-8 mb-6">
        
        {/* Composed Chart: Income Statement Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={16} className="text-[#212c46]" />
              {t('INCOME STATEMENT PROGRESSIVE GRAPH', 'โครงสร้างรายรับ-รายจ่ายผันแปรและกำไรประจำงวด')}
            </h4>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f1f3f5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#414757' }} />
                <YAxis tick={{ fontSize: 11, fontWeight: 'bold', fill: '#414757' }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="revenue" name={t('Revenue', 'รายรับรวม')} fill={CHARTS_THEME.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="varCost" name={t('Variable Cost', 'ต้นทุนผันแปร')} fill={CHARTS_THEME.danger} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="netMargin" name={t('Net Income', 'กำไรสุทธิสุทธิ')} stroke={CHARTS_THEME.success} strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stacked Cost Allocation share */}
        <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <Percent size={16} className="text-[#516cb0]" />
              {t('MARGIN RATIOS (%) TRENDS', 'ปริมาณสัดส่วนเปอร์เซ็นต์อัตรากำไร')}
            </h4>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f1f3f5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#414757', fontWeight: 'bold' }} />
                <YAxis unit="%" domain={[-20, 100]} tick={{ fontSize: 11, fill: '#414757', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend />
                <Area type="monotone" dataKey="pctMargin" name={t('Gross Margin %', 'เปอร์เซ็นต์กำไรขั้นต้น')} stroke={CHARTS_THEME.secondary} fill={CHARTS_THEME.secondary} fillOpacity={0.15} strokeWidth={2.5} />
                <Area type="monotone" dataKey="pctNetMargin" name={t('Net Margin %', 'เปอร์เซ็นต์กำไรสุทธิ')} stroke={CHARTS_THEME.success} fill={CHARTS_THEME.success} fillOpacity={0.15} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* MATRIX TABLE (CRITICAL REQUIREMENT: 12PX FOR HEADERS AND CELLS) */}
      <div className="px-4 sm:px-8 w-full mt-4">
        <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden flex flex-col">
          
          <div className="px-6 py-4 border-b border-[#eaeaec] flex items-center justify-between bg-[#fafafa]">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} className="text-emerald-700" />
              {t('CUMULATIVE MATRIX SPREADSHEER REPORT', 'ตารางวิเคราะห์สัดส่วนอัตรากำไรแยกตามบัญชีรายเดือน')}
            </h4>
            <span className="text-[12px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">FINANCE MODEL</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans border-collapse">
              <thead className="bg-[#212c46] text-white">
                <tr className="border-b-2 border-[#b7a159]">
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest uppercase">{t('PERIOD', 'งวดบัญชี')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('REVENUE (฿)', 'รายรับร่วม')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('VAR. COST (฿)', 'ต้นทุนผันแปร')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('CONTRIB. MARGIN (฿)', 'กำไรขั้นต้น')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('% MARGIN', '% ขั้นต้น')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('FIXED COST (฿)', 'ค่าบริการคงที่')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('NET PROFIT (฿)', 'กำไรสุทธิ')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('% NET MARGIN', '% กำไรสุทธิ')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaec]">
                {chartData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-[12px] font-black text-slate-500 uppercase tracking-widest">
                      {t('No operational matrix rows tracked yet', 'ไม่พบคระจัดเก็บในระบบข้อมูลสำหรับรอบงวดนี้')}
                    </td>
                  </tr>
                ) : (
                  chartData.map((row) => {
                    const isProfitable = row.netMargin >= 0;
                    return (
                      <tr key={row.month} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-4 py-3 text-[12px] font-black text-[#212c46]">{row.month}</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-right text-indigo-900 font-semibold">{formatTHB(row.revenue)}</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-right text-rose-800">{formatTHB(row.varCost)}</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-right text-amber-900 font-bold">{formatTHB(row.grossMargin)}</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-right text-amber-700 font-bold">{row.pctMargin.toFixed(2)} %</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-right text-slate-600">{formatTHB(row.fixedCost)}</td>
                        <td className={`px-4 py-3 text-[12px] font-mono text-right font-black ${isProfitable ? 'text-emerald-700 bg-emerald-50/10' : 'text-rose-700 bg-rose-50/10'}`}>{formatTHB(row.netMargin)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-3 py-1 rounded-md text-[12px] font-black font-mono border ${isProfitable ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-rose-800 border-red-100'}`}>
                            {row.pctNetMargin.toFixed(1)} %
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
