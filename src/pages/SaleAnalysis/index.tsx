import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, BarChart3, PieChart as PieIcon, Activity, 
  Calendar, Layers, ArrowUpRight, DollarSign, RefreshCw, ChevronLeft, ChevronRight, List
} from 'lucide-react';
import { motion } from 'motion/react';

const CHARTS_THEME = {
  primary: '#212c46',
  secondary: '#4d87a8',
  success: '#657f4d',
  danger: '#932c2e',
  warning: '#b58c4f',
  neutral: '#7a8b95',
  violet: '#6366f1',
  purples: ['#1e1b4b', '#312e81', '#3730a3', '#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc']
};

export default function SaleAnalysis() {
  const { t } = useLanguage();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('read', 'SaleRevenue', null, { limit: 2000, offset: 0 });
        if (response && response.status === 'success' && response.data) {
          const items = response.data.items || [];
          if (items.length > 0) {
            setData(items);
            localStorage.setItem('saleRevenueCache', JSON.stringify(items));
          } else {
            const cached = localStorage.getItem('saleRevenueCache');
            if (cached) setData(JSON.parse(cached));
          }
        }
      } catch (err) {
        console.error('Failed to load SaleRevenue data for analysis:', err);
        const cached = localStorage.getItem('saleRevenueCache');
        if (cached) setData(JSON.parse(cached));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Format Helper
  const formatTHB = (val: number) => {
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ฿';
  };

  const formatMillions = (val: number) => {
    return (val / 1000000).toFixed(2) + ' MB';
  };

  // Helper to parse dates like "25-Jan-2026" or "2026-01-25" or similar
  const getParsedMonthYear = (rawDate: string) => {
    if (!rawDate) return { month: 'Unknown', year: 'Unknown', monthKey: 'Unknown' };
    const dateStr = String(rawDate);
    
    // Check format like DD-MMM-YYYY (e.g. 25-Jan-2026)
    const matches = dateStr.match(/^(\d+)-([A-Za-z]+)-(\d+)$/);
    if (matches) {
      return {
        month: matches[2],
        year: matches[3],
        monthKey: `${matches[2]}-${matches[3]}`
      };
    }
    
    // Try browser parsing
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          month: months[d.getMonth()],
          year: String(d.getFullYear()),
          monthKey: `${months[d.getMonth()]}-${d.getFullYear()}`
        };
      }
    } catch (e) {}

    return { month: 'Unknown', year: '2026', monthKey: 'Unknown-2026' };
  };

  // Clean and filter transactions
  const cleanTransactions = useMemo(() => {
    return data.map(item => {
      const { month, year, monthKey } = getParsedMonthYear(item['Date'] || item['วันที่'] || item['date']);
      const qty = parseFloat(String(item['ยอดขาย (ชิ้น)'] || item['Qty'] || 0).replace(/,/g, '')) || 0;
      const price = parseFloat(String(item['ราคาขาย'] || item['Price'] || 0).replace(/,/g, '')) || 0;
      const revenue = parseFloat(String(item['มูลค่าขาย'] || item['Revenue'] || item['Total'] || 0).replace(/,/g, '')) || (qty * price);
      const product = String(item['ชื่อสินค้า'] || item['Product'] || '-');
      const category = String(item['ประเภท'] || item['Category'] || 'Others');
      return {
        ...item,
        parsedMonth: month,
        parsedYear: year,
        parsedMonthKey: monthKey,
        qty,
        rev: revenue,
        product,
        category
      };
    }).filter(t => t.parsedYear === selectedYear);
  }, [data, selectedYear]);

  // Categories list
  const categoriesList = useMemo(() => {
    const list = new Set<string>();
    cleanTransactions.forEach(t => {
      if (t.category) list.add(t.category);
    });
    return ['ALL', ...Array.from(list)];
  }, [cleanTransactions]);

  // Filtered dataset
  const filteredTransactions = useMemo(() => {
    if (selectedCategory === 'ALL') return cleanTransactions;
    return cleanTransactions.filter(t => t.category === selectedCategory);
  }, [cleanTransactions, selectedCategory]);

  // 1. Monthly Revenue Analysis Data
  const monthlyRevenueData = useMemo(() => {
    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map: Record<string, { month: string, revenue: number, quantity: number }> = {};
    
    monthsOrder.forEach(m => {
      map[m] = { month: t(m, m), revenue: 0, quantity: 0 };
    });

    filteredTransactions.forEach(t => {
      if (map[t.parsedMonth]) {
        map[t.parsedMonth].revenue += t.rev;
        map[t.parsedMonth].quantity += t.qty;
      }
    });

    return monthsOrder.map(m => map[m]);
  }, [filteredTransactions, t]);

  // 2. Product Rankings Data
  const productRankingData = useMemo(() => {
    const map: Record<string, { name: string, revenue: number, qty: number }> = {};
    filteredTransactions.forEach(t => {
      const name = t.product;
      if (!map[name]) {
        map[name] = { name, revenue: 0, qty: 0 };
      }
      map[name].revenue += t.rev;
      map[name].qty += t.qty;
    });

    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 Products
  }, [filteredTransactions]);

  // 3. Category Split Data (For Pie Chart)
  const categorySplitData = useMemo(() => {
    const map: Record<string, { name: string, value: number }> = {};
    cleanTransactions.forEach(t => {
      const name = t.category;
      if (!map[name]) {
        map[name] = { name, value: 0 };
      }
      map[name].value += t.rev;
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [cleanTransactions]);

  // Overall statistics
  const totalStats = useMemo(() => {
    let sales = 0;
    let items = 0;
    filteredTransactions.forEach(t => {
      sales += t.rev;
      items += t.qty;
    });
    const avgPrice = items > 0 ? (sales / items) : 0;
    return {
      revenue: sales,
      qty: items,
      avgPrice,
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('read', 'SaleRevenue', null, { limit: 2000, offset: 0 });
      if (response && response.status === 'success' && response.data) {
        const items = response.data.items || [];
        setData(items);
        localStorage.setItem('saleRevenueCache', JSON.stringify(items));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 bg-transparent min-h-screen">
      
      {/* HEADER BAR */}
      <div className="h-14 px-4 sm:px-8 mt-[2px] mb-4 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#212c46] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 border border-[#212c46]/40 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <TrendingUp size={22} className="text-[#212c46]" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-[24px]">
              {t('SALE ANALYSIS', 'วิเคราะห์สถิติงานขาย')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#212c46] to-[#4d87a8]">{t('INSIGHTS', 'แดชบอร์ด')}</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              {t('REVENUE TRENDS, PRODUCT RANKINGS & CATEGORY BREAKDOWN', 'วิเคราะห์ทิศทางรายได้ ยอดขายแยกตามสายผลิตภัณฑ์และหมวดหมู่')}
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
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
            className="flex items-center justify-center w-9 h-9 bg-white border border-[#eaeaec] hover:border-[#b58c4f] rounded-xl transition-all shadow-sm active:scale-95"
            title={t('Refresh Data', 'โหลดซิงค์ข้อมูล')}
          >
            <RefreshCw size={14} className={`${isLoading ? 'animate-spin text-[#b58c4f]' : 'text-[#212c46]'}`} />
          </button>
        </div>
      </div>

      {/* KPI SUMMARIES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-8 mb-6">
        {/* KPI 1 */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#212c46] transition-all">
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <TrendingUp size={90} color={CHARTS_THEME.primary} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('TOTAL SALES VALUE', 'รายได้สุทธิรวม')}</p>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#212c46]">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatMillions(totalStats.revenue)}</h4>
            <span className="text-[11px] font-medium text-slate-400 capitalize">{selectedCategory.toLowerCase()}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#b58c4f] transition-all">
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <BarChart3 size={90} color={CHARTS_THEME.warning} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('TOTAL PIECES SOLD', 'ยอดขายจํานวนรวม')}</p>
            <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#b58c4f]">
              <Layers size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{totalStats.qty.toLocaleString()} {t('pcs.', 'ชิ้น')}</h4>
            <span className="text-[11px] font-medium text-slate-400 capitalize">{selectedCategory.toLowerCase()}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#657f4d] transition-all">
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <Activity size={90} color={CHARTS_THEME.success} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('AVERAGE UNIT PRICE', 'ราคากลางต่อชิ้น')}</p>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#657f4d]">
              <ArrowUpRight size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatTHB(totalStats.avgPrice)}</h4>
            <span className="text-[11px] font-medium text-slate-400 capitalize">{t('Avg', 'เฉลี่ย')}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#4d87a8] transition-all">
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <PieIcon size={90} color={CHARTS_THEME.secondary} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('RECORD COUNT', 'จำนวนธุรกรรมงานขาย')}</p>
            <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4d87a8]">
              <List size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{totalStats.count} {t('records', 'รายการ')}</h4>
            <span className="text-[11px] font-medium text-[#4d87a8] uppercase tracking-widest font-mono">{t('Synced', 'ซิงค์สำเสร็จ')}</span>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS & MAIN TABS */}
      <div className="px-4 sm:px-8 mb-6 flex flex-wrap gap-2">
        {categoriesList.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-sm transition-all ${
              selectedCategory === cat 
                ? 'bg-[#212c46] text-white' 
                : 'bg-white border border-[#eaeaec] hover:border-[#212c46] text-[#212c46]'
            }`}
          >
            {t(cat, cat)}
          </button>
        ))}
      </div>

      {/* VISUALIZATION CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-8 mb-6">
        
        {/* LINE & BAR CHART: Monthly Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-[#212c46]" />
              {t('MONTHLY REVENUE TRENDS', 'แนวโน้มความเติบโตรายได้ประจำปี')}
            </h4>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHARTS_THEME.secondary} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={CHARTS_THEME.secondary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#414757' }} />
                <YAxis tick={{ fontSize: 11, fontWeight: 'bold', fill: '#414757' }} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: any) => [formatTHB(Number(value || 0)), t('Revenue', 'รายได้')]} 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', borderColor: '#eaeaec', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name={t('Revenue', 'รายได้')} stroke={CHARTS_THEME.primary} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART: Category Split */}
        <div className="bg-white rounded-2xl border border-[#eaeaec] p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <PieIcon size={16} className="text-[#b58c4f]" />
              {t('REVENUE SHARE BY CATEGORY', 'สัดส่วนตามสินค้า')}
            </h4>
          </div>

          <div className="h-[250px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categorySplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHARTS_THEME.purples[index % CHARTS_THEME.purples.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [formatTHB(Number(value || 0)), entry => entry.name]} 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] mt-4 font-black uppercase text-[#414757]">
            {categorySplitData.slice(0, 4).map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: CHARTS_THEME.purples[idx % CHARTS_THEME.purples.length] }} />
                <span className="truncate text-[12px]">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* DETAILED STATS TABLE (ALL FONT SIZES IN THEAD AND TBODY ARE STRICTLY 12PX) */}
      <div className="px-4 sm:px-8 w-full mt-4">
        <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden flex flex-col">
          
          <div className="px-6 py-4 border-b border-[#eaeaec] flex items-center justify-between bg-[#fafafa]">
            <h4 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" />
              {t('TOP PERFORMING PRODUCTS', 'สินค้าขายดีอันดับเด่น')}
            </h4>
            <span className="text-[12px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-3 py-1 rounded-lg">LIVE TRACKING</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans border-collapse">
              <thead className="bg-[#212c46] text-white">
                <tr className="border-b-2 border-[#b7a159]">
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('RANK', 'อันดับ')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('PRODUCT NAME', 'ชื่อสินค้า')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('QTY SOLD', 'ยอดขาย (ชิ้น)')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('REVENUE GENERATED', 'รายรับรวม (บาท)')}</th>
                  <th className="px-4 py-3.5 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('% REVENUE SHARE', 'สัดส่วนรายได้')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaec]">
                {productRankingData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-[#7a8b95] text-[12px] font-black uppercase tracking-widest">
                      {t('No Analytics Assets Available', 'ไม่มีข้อมูลสรุปสถิติในหมวดหมู่นี้')}
                    </td>
                  </tr>
                ) : (
                  productRankingData.map((prod, idx) => {
                    const pct = totalStats.revenue > 0 ? (prod.revenue / totalStats.revenue) * 100 : 0;
                    return (
                      <tr key={prod.name} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-4 py-3 text-[12px] font-black text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-[12px] font-black text-[#212c46]">{prod.name}</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-right text-emerald-700 font-bold">{prod.qty.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-right text-indigo-900 font-bold">{formatTHB(prod.revenue)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1 rounded-md text-[12px] font-black text-[#4d87a8]">{pct.toFixed(2)} %</span>
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
