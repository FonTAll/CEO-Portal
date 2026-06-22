import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { 
  DollarSign, 
  RefreshCw, 
  TrendingUp, 
  Scale, 
  HelpCircle,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Percent,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface MonthData {
  sales: number;
  qty: number;
  varCost: number;
}

interface CategoryData {
  category: string;
  categoryTh: string;
  months: Record<string, MonthData>;
}

export default function BreakEvenAnalysis() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [fixedCosts, setFixedCosts] = useState<Record<string, number>>({});

  // 12 month labels for the selected year
  const MONTH_LABELS_MAPPING = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MONTH_LABELS = useMemo(() => 
    MONTH_LABELS_MAPPING.map(m => `${m}-${selectedYear}`), 
  [selectedYear]);

  // Load from LocalStorage cache on mount
  useEffect(() => {
    const cachedCategories = localStorage.getItem('margin_categories_v1');
    const cachedFixedCosts = localStorage.getItem('margin_fixed_costs_v1');
    if (cachedCategories) {
      setCategories(JSON.parse(cachedCategories));
    }
    if (cachedFixedCosts) {
      setFixedCosts(JSON.parse(cachedFixedCosts));
    }
  }, []);

  // Sync / Fetch actual Database values and calculate Break-even limits
  const handleSyncData = async (isSilent = false) => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const [salesRes, costRes] = await Promise.all([
        api.post('read', 'SaleRevenue', null, { limit: 2000, offset: 0 }),
        api.post('read', 'CostExpense', null, { limit: 2000, offset: 0 })
      ]);

      const salesData = salesRes?.data?.items || [];
      const costData = costRes?.data?.items || [];

      // Helper for Parsing Dates
      const getParsedMonthYear = (rawDate: any) => {
        if (!rawDate) return 'Unknown-2026';
        let d: Date | null = null;
        if (rawDate instanceof Date) {
          if (!isNaN(rawDate.getTime())) {
            d = rawDate;
          }
        } else if (typeof rawDate === 'number' || !isNaN(Number(rawDate))) {
          const serialDate = Number(rawDate);
          if (serialDate > 20000) {
            d = new Date((serialDate - (25567 + 1)) * 86400 * 1000);
          }
        }

        if (!d) {
          const strDate = String(rawDate).trim();
          const parts = strDate.split(/[\/\-]/);
          if (parts.length === 3) {
             let year = 0;
             let month = 0;
             let day = 1;

             const p0 = Number(parts[0]);
             const p1 = Number(parts[1]);
             const p2 = Number(parts[2]);

             if (p0 > 1000) {
               year = p0;
               month = p1;
               day = p2;
             } else if (p2 > 1000) {
               year = p2;
               if (p0 > 12) {
                 day = p0;
                 month = p1;
               } else if (p1 > 12) {
                 month = p0;
                 day = p1;
               } else {
                 day = p0;
                 month = p1;
               }
             } else {
               d = new Date(strDate);
             }

             if (year > 2400) {
               year -= 543;
             }

             if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
               d = new Date(year, month - 1, day);
             }
          } else {
            d = new Date(strDate);
          }
        }

        if (d && !isNaN(d.getTime())) {
          let yr = d.getFullYear();
          if (yr > 2400) {
            yr -= 543;
          }
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${months[d.getMonth()]}-${yr}`;
        }
        return 'Unknown-2026';
      };

      // Define default category blueprint if caching is empty
      const DEFAULT_BLUEPRINT = [
        { category: 'Ironing Table', categoryTh: 'โต๊ะรีดผ้า' },
        { category: 'Rack A', categoryTh: 'ราวA' },
        { category: 'Folding Table', categoryTh: 'โต๊ะพับ' },
        { category: 'Chair', categoryTh: 'เก้าอี้' },
        { category: 'Hammock', categoryTh: 'เปล' },
        { category: 'Water Bar Shelf', categoryTh: 'ชั้นบาร์น้ำ' },
        { category: 'Others', categoryTh: 'อื่นๆ' }
      ];

      const newCategories: CategoryData[] = DEFAULT_BLUEPRINT.map(blueprint => {
        const monthsObj: Record<string, MonthData> = {};
        MONTH_LABELS.forEach(m => {
          monthsObj[m] = { sales: 0, qty: 0, varCost: 0 };
        });
        return {
          category: blueprint.category,
          categoryTh: blueprint.categoryTh,
          months: monthsObj
        };
      });

      const knownCostsTracker: Record<string, { qty: number, costSum: number }> = {};

      salesData.forEach((row: any) => {
        const dateVal = row['Date'] || row['วันที่'] || row['date'] || '';
        const mKey = getParsedMonthYear(dateVal);
        const qty = parseFloat(String(row['ยอดขาย (ชิ้น)'] || row['ยอดขาย(ชิ้น)'] || row['Qty'] || row['จำนวน'] || 0).replace(/,/g, '')) || 0;
        const price = parseFloat(String(row['ราคาขาย'] || row['ราคาขาย(บาท)'] || row['Price'] || 0).replace(/,/g, '')) || 0;
        const revenue = parseFloat(String(row['มูลค่าขาย'] || row['มูลค่าขาย(บาท)'] || row['Revenue'] || row['Total'] || 0).replace(/,/g, '')) || (qty * price);
        const cost = parseFloat(String(row['ราคาทุน'] || row['Cost'] || '0').replace(/,/g, '')) || 0;

        let category = String(row['กลุ่มสินค้า'] || row['ประเภท'] || row['Category'] || 'Others');
        let targetCat = newCategories.find(c => c.category === category || c.categoryTh === category);
        if (!targetCat) targetCat = newCategories.find(c => c.category === 'Others');

        if (targetCat) {
          if (!targetCat.months[mKey]) {
            targetCat.months[mKey] = { sales: 0, qty: 0, varCost: 0 };
          }
          targetCat.months[mKey].sales += revenue;
          targetCat.months[mKey].qty += qty;

          if (cost > 0 && qty > 0) {
            const trackKey = `${targetCat.category}_${mKey}`;
            if (!knownCostsTracker[trackKey]) knownCostsTracker[trackKey] = { qty: 0, costSum: 0 };
            knownCostsTracker[trackKey].qty += qty;
            knownCostsTracker[trackKey].costSum += (cost * qty);
          }
        }
      });

      // Calculate Variable Costs using known averages or actual items
      newCategories.forEach(cat => {
        Object.keys(cat.months).forEach(m => {
          const mData = cat.months[m];
          const trackKey = `${cat.category}_${m}`;
          const tracker = knownCostsTracker[trackKey];

          let avgCost = 0;
          if (tracker && tracker.qty > 0) {
            avgCost = tracker.costSum / tracker.qty;
          }
          mData.varCost = mData.qty * avgCost;
        });
      });

      // Create new Fixed Costs state
      const newFixedCosts: Record<string, number> = {};
      MONTH_LABELS.forEach(m => {
        newFixedCosts[m] = 0;
      });

      costData.forEach((row: any) => {
        const dateVal = row['วันที่'] || row['Date'] || row['date'] || '';
        const mKey = getParsedMonthYear(dateVal);
        const totalExpense = parseFloat(String(row['ต้นทุนและค่าใช้จ่ายรวม'] || row['Total Cost'] || row['TOTAL'] || 0).replace(/,/g, '')) || 0;

        if (newFixedCosts[mKey] === undefined) newFixedCosts[mKey] = 0;
        newFixedCosts[mKey] += totalExpense;
      });

      // Calculate operational Fixed Costs (Total Operating Expenses - total product variable costs)
      Object.keys(newFixedCosts).forEach(m => {
        const sumVarCost = newCategories.reduce((acc, cat) => acc + (cat.months[m]?.varCost || 0), 0);
        let actualFixCost = newFixedCosts[m] - sumVarCost;
        if (actualFixCost < 0) actualFixCost = 0;
        newFixedCosts[m] = actualFixCost;
      });

      setCategories(newCategories);
      setFixedCosts(newFixedCosts);
      localStorage.setItem('margin_categories_v1', JSON.stringify(newCategories));
      localStorage.setItem('margin_fixed_costs_v1', JSON.stringify(newFixedCosts));

      if (!isSilent) {
        alert(t('Synced data with Database', 'ดึงข้อมูลและจำลองต้นทุนสำเร็จ!'));
      }
    } catch (e) {
      console.error(e);
      if (!isSilent) {
        alert(t('Failed to sync. Make sure SaleRevenue & CostExpense have data.', 'ซิงค์ข้อมูลล้มเหลว โปรดตรวจสอบข้อมูลฐาน'));
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleSyncData(true);
  }, [selectedYear]);

  // Compute calculated values per month corresponding to Break-Even rules
  const monthlyCalculations = useMemo(() => {
    return MONTH_LABELS.map(m => {
      let monthRev = 0;
      let monthVC = 0;

      categories.forEach((cat: any) => {
        const monData = cat.months[m];
        if (monData) {
          monthRev += monData.sales || 0;
          monthVC += monData.varCost || 0;
        }
      });

      const fixedCost = fixedCosts[m] || 0;
      const margin = monthRev - monthVC;
      const marginRatio = monthRev > 0 ? (margin / monthRev) : 0;

      // Break Even point in sales value = Fixed Cost / CM Ratio %
      // If marginRatio <= 0, we assume a standard 30% contribution ratio to predict break-even
      const appliedCMRatio = marginRatio > 0.05 ? marginRatio : 0.30;
      const breakEvenSales = fixedCost / appliedCMRatio;

      const label = m.split('-')[0];
      const surplus = monthRev - breakEvenSales;

      return {
        monthKey: m,
        monthName: t(label, label),
        actualSales: monthRev,
        variableCost: monthVC,
        contributionMargin: margin,
        marginRatioPct: Number((marginRatio * 100).toFixed(1)),
        fixedCost,
        breakEvenSales: Math.round(breakEvenSales),
        surplus: Math.round(surplus),
        isProfitable: surplus >= 0
      };
    });
  }, [categories, fixedCosts, MONTH_LABELS, t]);

  // Extract cumulative stats for metrics summary
  const summaryKPIs = useMemo(() => {
    let totalSales = 0;
    let totalVC = 0;
    let totalFC = 0;
    let activeMonthsCount = 0;

    monthlyCalculations.forEach(m => {
      if (m.actualSales > 0 || m.fixedCost > 0) {
        totalSales += m.actualSales;
        totalVC += m.variableCost;
        totalFC += m.fixedCost;
        activeMonthsCount++;
      }
    });

    const totalCM = totalSales - totalVC;
    const cmRatio = totalSales > 0 ? totalCM / totalSales : 0;
    const overallBreakEven = cmRatio > 0.05 ? totalFC / cmRatio : 0;
    const totalMarginSurplus = totalSales - overallBreakEven;

    return {
      totalSales,
      totalFC,
      cmRatioPct: Number((cmRatio * 100).toFixed(1)),
      breakEvenTarget: Math.round(overallBreakEven),
      surplus: Math.round(totalMarginSurplus),
      isProfitable: totalMarginSurplus >= 0,
      activeMonthsCount
    };
  }, [monthlyCalculations]);

  const formatTHB = (val: number) => {
    return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ฿';
  };

  return (
    <div id="breakeven-module" className="flex flex-col w-full pb-10 bg-transparent min-h-screen">
      
      {/* PAGE HEADER */}
      <div className="h-14 px-4 sm:px-8 mt-[2px] mb-4 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#c1451f] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 border border-[#c1451f]/40 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Scale size={22} className="text-[#c1451f]" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none text-[24px]">
              {t('BREAK-EVEN TARGET', 'เป้ายอดขายขั้นต่ำเพื่อป้องกันการขาดทุน')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c1451f] to-[#b58c4f]">{t('ANALYSIS', 'วิเคราะห์จุดคุ้มทุน')}</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              {t('MONTHLY MINIMUM SALES REQUIRED TO COVER TOTAL OPERATIONAL OVERHEAD & COSTS', 'ยอดผลิต/ยอดขายเป้าหมายขั้นต่ำรายเดือน สำหรับหักลบค่าใช้จ่ายคงที่และค่าดำเนินการทั้งหมด')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#eaeaec] rounded-xl px-2 py-1 shadow-sm h-9">
             <select 
               value={selectedYear} 
               onChange={(e) => setSelectedYear(e.target.value)}
               className="text-[11px] font-black uppercase text-[#212c46] outline-none bg-transparent cursor-pointer"
             >
               <option value="2024">2024</option>
               <option value="2025">2025</option>
               <option value="2026">2026</option>
               <option value="2027">2027</option>
             </select>
          </div>
          
          <button 
            onClick={() => handleSyncData(false)}
            disabled={isSyncing}
            className={`flex items-center gap-2 h-9 px-4 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm transition-all border ${isSyncing ? 'bg-indigo-50 border-indigo-200 text-indigo-400 opacity-70 cursor-not-allowed' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700'}`}
          >
             <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> {t('SYNC', 'ซิงค์สูตรคุ้มทุน')}
          </button>
        </div>
      </div>

      {/* KPI GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 sm:px-8 mb-6">
        
        {/* Actual Sales */}
        <div className="bg-white border border-[#eaeaec] p-5 rounded-2xl flex flex-col relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('YTD TOTAL SALES', 'ยอดขายรวมสะสม')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <span className="text-xl font-black text-[#212c46] truncate">{formatTHB(summaryKPIs.totalSales)}</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1">
            {t('Total calculated volume', 'ประมวลผลจากใบเสร็จรับเงินจริง')}
          </span>
        </div>

        {/* Operating Fixed Cost */}
        <div className="bg-white border border-[#eaeaec] p-5 rounded-2xl flex flex-col relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('YTD FIXED OVERHEADS', 'ค่าใช้จ่ายดำเนินการสะสม')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Briefcase size={16} />
            </div>
          </div>
          <span className="text-xl font-black text-[#212c46] truncate">{formatTHB(summaryKPIs.totalFC)}</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase mt-1">
            {t('Fixed Operational Overheads', 'ค่าเช่า แขนจ้าง และงานส่วนกลาง')}
          </span>
        </div>

        {/* Minimum sales required (Break even) */}
        <div className="bg-white border border-[#eaeaec] p-5 rounded-2xl flex flex-col relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-[#c1451f]">{t('MINIMUM BREAK-EVEN TARGET', 'จุดเป้ายอดขายขั้นต่ำสุด')}</span>
            <div className="w-8 h-8 rounded-lg bg-[#c1451f]/10 border border-[#c1451f]/20 flex items-center justify-center text-[#c1451f]">
              <Scale size={16} />
            </div>
          </div>
          <span className="text-xl font-black text-[#c1451f] truncate">{formatTHB(summaryKPIs.breakEvenTarget)}</span>
          <span className="text-[10px] font-black text-rose-500 uppercase mt-1 flex items-center gap-1">
            <AlertTriangle size={11} /> {t('Yields 0% profit threshold', 'ยอดขายห้ามต่ำกว่านี้เพื่อไม่ให้ขาดทุน')}
          </span>
        </div>

        {/* Safe Margin Surplus */}
        <div className={`border p-5 rounded-2xl flex flex-col relative overflow-hidden shadow-sm ${summaryKPIs.isProfitable ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-rose-50/50 border-[#932c2e]/20 text-[#932c2e]'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{t('SAFE SURPLUS', 'กำไรส่วนเกินความปลอดภัย')}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${summaryKPIs.isProfitable ? 'bg-emerald-100/50 border-emerald-300 text-emerald-600' : 'bg-rose-100 border-rose-300 text-[#932c2e]'}`}>
              {summaryKPIs.isProfitable ? <ShieldCheck size={16} /> : <TrendingDown size={16} />}
            </div>
          </div>
          <span className="text-xl font-black truncate">{formatTHB(Math.abs(summaryKPIs.surplus))}</span>
          <span className="text-[10px] font-bold uppercase mt-1">
            {summaryKPIs.isProfitable ? t('Operating above break-even boundary', 'ยอดขายสูงกว่าจุดคุ้มทุน มีกำไรส่วนล้น') : t('CRITICAL DEFICIT - UNDER LIMIT', 'ยอดขายจริงต่ำกว่าจุดคุ้มทุน ขาดทุน')}
          </span>
        </div>

      </div>

      {/* CORE GRAPH VISUALIZATION */}
      <div className="px-4 sm:px-8 mb-6">
        <div className="bg-white border border-[#eaeaec] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('REAL-TIME BUSINESS BREAK-EVEN CHRONOLOGY', 'ลำดับเปรียบเทียบยอดจริงกับจุดเป้าคุ้มทุนรายเดือน')}</span>
              <h4 className="text-md font-bold text-[#212c46] tracking-tight mt-0.5">
                {t('Actual Revenue vs. Minimum Break-Even Boundary', 'กราฟวิเคราะห์ส่วนต่างยอดขายเป้าหมายกับรายได้จริง')}
              </h4>
            </div>
            
            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#c1451f]/20 border border-[#c1451f]/40 rounded-full inline-block"></span>{t('BREAK-EVEN REGION', 'ขอบเขตขั้นต่ำจุดคุ้มทุน')}</span>
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-0.5 bg-[#4f6bb5] inline-block"></span>{t('ACTUAL REVENUE', 'ยอดขายจริง')}</span>
            </div>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyCalculations.filter(d => d.actualSales > 0 || d.fixedCost > 0)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1f3" />
                <XAxis 
                  dataKey="monthName" 
                  tick={{ fontSize: 10, fill: '#6c778c', fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6c778c' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  tickFormatter={(val) => (val / 1000000).toFixed(1) + 'M'}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (typeof value === 'number') {
                      return [value.toLocaleString() + ' ฿', t(name, name)];
                    }
                    return [value, t(name, name)];
                  }}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f5', borderRadius: '12px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                
                {/* Break-Even Area */}
                <Area 
                  type="monotone" 
                  dataKey="breakEvenSales" 
                  name="Break-even Sales"
                  fill="#c1451f" 
                  fillOpacity={0.06} 
                  stroke="#c1451f" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />

                {/* Actual Sales Line */}
                <Line 
                  type="monotone" 
                  dataKey="actualSales" 
                  name="Actual Revenue"
                  stroke="#4f6bb5" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: '#4f6bb5', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MATRIX DETAILED TABLE REPORT */}
      <div className="px-4 sm:px-8">
        <div className="bg-white border border-[#eaeaec] rounded-2xl shadow-sm overflow-hidden">
          
          <div className="px-6 py-4 border-b border-[#f1f1f3] bg-[#fafbfc]">
            <h4 className="text-xs font-black uppercase text-[#212c46] tracking-wider">
              {t('BREAK-EVEN MULTIVARIATE MATRIX REPORT', 'รายงานเมทริกซ์รายละเอียดความคุ้มทุนจำแนกรายเดือน')}
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-slate-50 border-b border-[#eaeaec] text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="px-6 py-3 font-black text-[10px]">{t('MONTH', 'เดือน')}</th>
                  <th className="px-6 py-3 font-black text-[10px] text-right">{t('ACTUAL REVENUE', 'ยอดขายจริง')}</th>
                  <th className="px-6 py-3 font-black text-[10px] text-right">{t('VARIABLE COSTS', 'ต้นทุนแปรผัน')}</th>
                  <th className="px-6 py-3 font-black text-[10px] text-center">{t('MARGIN RATIO', 'สัดส่วนกำไรผันแปร')}</th>
                  <th className="px-6 py-3 font-black text-[10px] text-right">{t('FIXED OPERATING COSTS', 'ค่าใช้จ่ายคงที่')}</th>
                  <th className="px-6 py-3 font-black text-[10px] text-right text-[#c1451f] bg-[#c1451f]/5">{t('MINIMUM SALES TO BREAK-EVEN', 'เป้ายอดขายขั้นต่ำ (คุ้มทุน)')}</th>
                  <th className="px-6 py-3 font-black text-[10px] text-right">{t('SURPLUS / SAFETY BUFFER', 'กำไรส่วนเกินความปลอดภัย')}</th>
                  <th className="px-6 py-3 font-black text-[10px] text-center">{t('STATUS', 'สถานะจุดคุ้มทุน')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f1f3]">
                {monthlyCalculations.filter(d => d.actualSales > 0 || d.fixedCost > 0).map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#212c46]">{row.monthName}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">{formatTHB(row.actualSales)}</td>
                    <td className="px-6 py-4 text-right text-slate-500 font-medium">{formatTHB(row.variableCost)}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-0.5">
                        <Percent size={11} className="text-slate-400" /> {row.marginRatioPct} %
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 font-medium">{formatTHB(row.fixedCost)}</td>
                    <td className="px-6 py-4 text-right font-black text-[#c1451f] bg-[#c1451f]/5">{formatTHB(row.breakEvenSales)}</td>
                    <td className={`px-6 py-4 text-right font-bold ${row.surplus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {row.surplus >= 0 ? '+' : ''}{formatTHB(row.surplus)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.isProfitable ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-[#932c2e] border border-rose-200'}`}>
                        {row.isProfitable ? t('PROFITABLE', 'ปลอดภัย (มีกำไร)') : t('DEFICIT', 'วิกฤต (ขาดทุน)')}
                      </span>
                    </td>
                  </tr>
                ))}
                {monthlyCalculations.filter(d => d.actualSales > 0 || d.fixedCost > 0).length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium uppercase tracking-widest bg-slate-50/30">
                      {t('No synchronized records found. Click SYNC on toolbar.', 'ไม่พบข้อมูล กรุณากดปุ่ม ซิงค์สูตรคุ้มทุน ด้านบนเครื่องมือด้วยค่ะ')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
