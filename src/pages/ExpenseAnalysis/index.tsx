import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  TrendingUp, BarChart3, Activity, Calendar, Layers, ArrowDownRight, 
  RefreshCw, DollarSign, Lightbulb, Users, Droplet, Flame
} from 'lucide-react';

const CHARTS_THEME = {
  primary: '#212c46',
  secondary: '#d96245', // expense red accent
  success: '#657f4d',
  blue: '#3b82f6',
  cyan: '#06b6d4',
  amber: '#d97706',
  indigo: '#4f46e5'
};

export default function ExpenseAnalysis() {
  const { t } = useLanguage();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026');

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('read', 'CostExpense', null, { limit: 2000, offset: 0 });
        if (response && response.status === 'success' && response.data) {
          const items = response.data.items || [];
          if (items.length > 0) {
            setData(items);
            localStorage.setItem('costExpenseCache', JSON.stringify(items));
          } else {
            const cached = localStorage.getItem('costExpenseCache');
            if (cached) setData(JSON.parse(cached));
          }
        }
      } catch (err) {
        console.error('Failed to load CostExpense data for analysis:', err);
        const cached = localStorage.getItem('costExpenseCache');
        if (cached) setData(JSON.parse(cached));
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const formatTHB = (val: number) => {
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ฿';
  };

  const formatMillions = (val: number) => {
    return (val / 1000000).toFixed(2) + ' MB';
  };

  // Safe number parsing
  const cleanVal = (input: any): number => {
    if (!input) return 0;
    return parseFloat(String(input).replace(/,/g, '')) || 0;
  };

  // Mapping columns
  const mapping = {
    dateCol: 'วันที่', 
    headcountCol: 'จน.พนักงาน',
    laborCol: 'ค่าจ้างแรงงาน (บาท)',
    waterCol: 'ค่าน้ำ (บาท)',
    electricCol: 'ค่าไฟฟ้า (บาท)',
    gasCol: 'ค่าแก๊ส (บาท)',  // support alternative naming like ค่าน้ำมัน (บาท)
    totalCol: 'รวมค่าใช้จ่ายส่วนกลาง (บาท)'
  };

  // Helper inside loop to parse year/month safely
  const getParsedMonthYear = (rawDate: string) => {
    if (!rawDate) return { month: 'Unknown', year: 'Unknown' };
    const dateStr = String(rawDate);
    const matches = dateStr.match(/^(\d+)-([A-Za-z]+)-(\d+)$/);
    if (matches) {
      return { month: matches[2], year: matches[3] };
    }
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return { month: months[d.getMonth()], year: String(d.getFullYear()) };
      }
    } catch (e) {}
    return { month: 'Unknown', year: '2026' };
  };

  // Pre-process and filter CostExpense data for the selected year
  const processedExpenses = useMemo(() => {
    return data.map(row => {
      const { month, year } = getParsedMonthYear(row[mapping.dateCol] || row['Date'] || row['date']);
      const headcount = cleanVal(row[mapping.headcountCol]);
      const labor = cleanVal(row[mapping.laborCol] || row['Labor Cost'] || row['ค่าจ้างแรงงาน']);
      const water = cleanVal(row[mapping.waterCol] || row['Water Bill'] || row['ค่าน้ำ']);
      const electric = cleanVal(row[mapping.electricCol] || row['Electric Bill'] || row['ค่าไฟฟ้า']);
      const gas = cleanVal(row[mapping.gasCol] || row['ค่าน้ำมัน (บาท)'] || row['Gas/Fuel Cost'] || row['ค่าแก๊ส']);
      const total = cleanVal(row[mapping.totalCol] || row['Total Cost'] || row['รวมค่าใช้จ่ายส่วนกลาง']);

      return {
        ...row,
        parsedMonth: month,
        parsedYear: year,
        headcount,
        labor,
        water,
        electric,
        gas,
        total
      };
    }).filter(e => e.parsedYear === selectedYear);
  }, [data, selectedYear]);

  // Aggregate monthly averages and totals
  const monthlyAggregatedData = useMemo(() => {
    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map: Record<string, { 
      month: string, 
      labor: number, 
      water: number, 
      electric: number, 
      gas: number, 
      total: number, 
      headcount: number,
      count: number
    }> = {};

    monthsOrder.forEach(m => {
      map[m] = { month: t(m, m), labor: 0, water: 0, electric: 0, gas: 0, total: 0, headcount: 0, count: 0 };
    });

    processedExpenses.forEach(e => {
      if (map[e.parsedMonth]) {
        map[e.parsedMonth].labor += e.labor;
        map[e.parsedMonth].water += e.water;
        map[e.parsedMonth].electric += e.electric;
        map[e.parsedMonth].gas += e.gas;
        map[e.parsedMonth].total += e.total;
        map[e.parsedMonth].headcount += e.headcount;
        map[e.parsedMonth].count += 1;
      }
    });

    return monthsOrder.map(m => {
      const record = map[m];
      const avgHeadcount = record.count > 0 ? Math.round(record.headcount / record.count) : 0;
      return {
        ...record,
        avgHeadcount
      };
    });
  }, [processedExpenses, t]);

  // Summarized total values
  const totalSummaries = useMemo(() => {
    let laborSum = 0;
    let waterSum = 0;
    let electricSum = 0;
    let gasSum = 0;
    let totalSum = 0;
    let count = 0;

    processedExpenses.forEach(e => {
      laborSum += e.labor;
      waterSum += e.water;
      electricSum += e.electric;
      gasSum += e.gas;
      totalSum += e.total;
      count += 1;
    });

    return {
      labor: laborSum,
      water: waterSum,
      electric: electricSum,
      gas: gasSum,
      total: totalSum,
      count
    };
  }, [processedExpenses]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('read', 'CostExpense', null, { limit: 2000, offset: 0 });
      if (response && response.status === 'success' && response.data) {
        setData(response.data.items || []);
        localStorage.setItem('costExpenseCache', JSON.stringify(response.data.items || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 bg-transparent min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="h-14 px-4 sm:px-8 mt-[2px] mb-4 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#d96245] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 border border-[#d96245]/40 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Activity size={22} className="text-[#d96245]" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-[24px]">
              {t('EXPENSE ANALYSIS', 'วิเคราะห์สถิติงานต้นทุน')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96245] to-[#b58c4f]">{t('FLOW', 'ระบบค่าใช้จ่าย')}</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              {t('UTILITY CONSUMPTION, OPERATIVE LABOR COSTS & STAFFING LEVEL', 'วิเคราะห์ปริมาณค่าไฟฟ้า ค่าน้ำมันเชื้อเพลิง ค่าล่วงเวลาแรงงาน และจำนวนบุคลากร')}
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
              <option value="2025">2025</option>
            </select>
          </div>

          <button 
            onClick={handleRefresh}
            className="flex items-center justify-center w-9 h-9 bg-white border border-[#eaeaec] hover:border-[#d96245] rounded-xl transition-all shadow-sm active:scale-95"
            title={t('Refresh Data', 'โหลดบราวส์ใหม่')}
          >
            <RefreshCw size={14} className={`${isLoading ? 'animate-spin text-orange-600' : 'text-[#212c46]'}`} />
          </button>
        </div>
      </div>

      {/* KPI DASHBOARD SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-8 mb-6">
        
        {/* Total Labor */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#212c46] transition-all">
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <Users size={90} color={CHARTS_THEME.primary} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('TOTAL LABOR COST', 'ค่าขนส่ง-โอทีแรงงานรวม')}</p>
            <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#212c46]">
              <Users size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatPercentDecimal(totalSummaries.labor)}</h4>
            <span className="text-[11px] font-bold text-slate-400 capitalize">{t('Labor', 'โอทีสุทธิ')}</span>
          </div>
        </div>

        {/* Electricity */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-yellow-500 transition-all">
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <Lightbulb size={90} color={CHARTS_THEME.amber} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('ELECTRICITY COST', 'ค่าบริการกระแสไฟฟ้า')}</p>
            <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <Lightbulb size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatPercentDecimal(totalSummaries.electric)}</h4>
            <span className="text-[11px] font-bold text-amber-600 capitalize">{t('Power', 'ค่าไฟ')}</span>
          </div>
        </div>

        {/* Gas & Fuel */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-red-500 transition-all">
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <Flame size={90} color={CHARTS_THEME.secondary} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('GAS & FUEL COST', 'ค่าน้ำมันเชื้อเพลิง-แก๊ส')}</p>
            <div className="h-7 w-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <Flame size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatPercentDecimal(totalSummaries.gas)}</h4>
            <span className="text-[11px] font-bold text-red-600 capitalize">{t('Fuel', 'ค่าน้ำมัน')}</span>
          </div>
        </div>

        {/* Total Cost Of Operations */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-indigo-600 transition-all">
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <DollarSign size={90} color={CHARTS_THEME.indigo} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('TOTAL FIXED COST', 'ค่าใช้จ่ายส่วนกลางสะสม')}</p>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatMillions(totalSummaries.total)}</h4>
            <span className="text-[11px] font-bold text-indigo-700 uppercase">{t('T.FC', 'ยอดสุทธิ')}</span>
          </div>
        </div>

      </div>

      {/* DETAILED CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-8 mb-6">
        
        {/* Composed Chart: Staffing vs Labor Costs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <Users size={16} className="text-slate-800" />
              {t('STAFFING LEVEL VS LABOR COST TRENDS', 'สัดส่วนชั่วโมงผู้ปฏิบัติงานและอัตราจ้างงานสะสม')}
            </h4>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyAggregatedData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f1f3f5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#414757' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#414757' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#414757' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="labor" name={t('Labor Cost (฿)', 'ค่าใช้จ่ายแรงงาน')} fill={CHARTS_THEME.primary} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="avgHeadcount" name={t('Avg Headcount', 'จำนวนวิชาชีพแรงงาน')} stroke={CHARTS_THEME.secondary} strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stacked Area Chart: Utilities Breakdowns */}
        <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-600" />
              {t('UTILITIES CONSUMPTION SHARE', 'ค่าสิ่งอำนวยความสะดวกสะสม')}
            </h4>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAggregatedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f1f3f5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#414757', fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 11, fill: '#414757', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend />
                <Area type="monotone" stackId="1" dataKey="electric" name={t('Electricity', 'ไฟฟ้า')} stroke={CHARTS_THEME.amber} fill={CHARTS_THEME.amber} fillOpacity={0.6} />
                <Area type="monotone" stackId="1" dataKey="water" name={t('Water', 'น้ำประปา')} stroke={CHARTS_THEME.cyan} fill={CHARTS_THEME.cyan} fillOpacity={0.6} />
                <Area type="monotone" stackId="1" dataKey="gas" name={t('Gas & Fuel', 'น้ำมัน/แก๊ส')} stroke={CHARTS_THEME.secondary} fill={CHARTS_THEME.secondary} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* MONTHLY RECORD DATA (STRICT 12PX HEADERS AND CELLS) */}
      <div className="px-4 sm:px-8 w-full mt-4">
        <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden flex flex-col">
          
          <div className="px-6 py-4 border-b border-[#eaeaec] flex items-center justify-between bg-[#fafafa]">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <Layers size={16} className="text-orange-600" />
              {t('MONTHLY FIXED COST breakdown', 'วิเคราะห์สถิติต้นทุนแยกรายเดือน')}
            </h4>
            <span className="text-[12px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-lg uppercase">OPERATIONS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans border-collapse">
              <thead className="bg-[#212c46] text-white">
                <tr className="border-b-2 border-orange-500">
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest uppercase">{t('MONTH', 'เดือน')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('HEADCOUNT', 'จน.ผู้ทำงาน')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('LABOR (฿)', 'ชั่วโมงจ้าง (บาท)')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('ELECTRIC (฿)', 'ค่าไฟ (บาท)')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('WATER (฿)', 'ค่าน้ำ (บาท)')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('GAS/FUEL (฿)', 'น้ำมัน/แก๊ส')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase">{t('TOTAL (฿)', 'รวมสะสม')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaec]">
                {monthlyAggregatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-[12px] font-black text-slate-500 uppercase tracking-widest">
                      {t('No Operations Data Registered', 'ไม่มีข้อมูลค่าใช้จ่ายสำหรับรายงานในปีนี้')}
                    </td>
                  </tr>
                ) : (
                  monthlyAggregatedData.map((row) => (
                    <tr key={row.month} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-4 py-3 text-[12px] font-black text-[#212c46]">{row.month}</td>
                      <td className="px-4 py-3 text-[12px] font-bold text-center text-sky-800">
                        <span className="bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-lg font-black text-[12px]">{row.avgHeadcount}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] font-mono text-right text-slate-600">{formatPercentDecimal(row.labor)}</td>
                      <td className="px-4 py-3 text-[12px] font-mono text-right text-slate-600">{formatPercentDecimal(row.electric)}</td>
                      <td className="px-4 py-3 text-[12px] font-mono text-right text-slate-600">{formatPercentDecimal(row.water)}</td>
                      <td className="px-4 py-3 text-[12px] font-mono text-right text-slate-600">{formatPercentDecimal(row.gas)}</td>
                      <td className="px-4 py-3 text-[12px] font-mono font-black text-right text-rose-700 bg-red-50/20">{formatPercentDecimal(row.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );

  function formatPercentDecimal(val: number) {
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ฿';
  }
}
