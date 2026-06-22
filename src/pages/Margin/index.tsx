import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Percent, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  X, 
  Edit, 
  Check, 
  FileDown, 
  RefreshCw, 
  Sparkles, 
  Info,
  Calendar,
  Layers,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

const THEME = {
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#932c2e',
  dustyBlue: '#7a8b95',
  bgSoftRed: '#fdf2f2',
  textSoftRed: '#c81e1e',
  bgSoftGreen: '#f3faf7',
  textSoftGreen: '#046c4e'
};

const MONTH_LABELS_MAPPING = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

// Exact match Seed Data from screenshots
const INITIAL_CATEGORIES: CategoryData[] = [
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
  },
  {
    category: 'Folding Table',
    categoryTh: 'โต๊ะพับ',
    months: {
      'Jan-2026': { sales: 2351658, pcs: 12900, varCost: 0 },
      'Feb-2026': { sales: 2286388, pcs: 7811, varCost: 0 },
      'Mar-2026': { sales: 2636388, pcs: 9529, varCost: 0 },
      'Apr-2026': { sales: 1860169, pcs: 15436, varCost: 0 },
      'May-2026': { sales: 1752081, pcs: 5128, varCost: 0 },
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
    category: 'Chair',
    categoryTh: 'เก้าอี้',
    months: {
      'Jan-2026': { sales: 1069135, pcs: 6366, varCost: 0 },
      'Feb-2026': { sales: 901450, pcs: 5740, varCost: 0 },
      'Mar-2026': { sales: 989000, pcs: 6012, varCost: 0 },
      'Apr-2026': { sales: 775510, pcs: 4826, varCost: 0 },
      'May-2026': { sales: 1012288, pcs: 6272, varCost: 0 },
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
    category: 'Hammock',
    categoryTh: 'เปล',
    months: {
      'Jan-2026': { sales: 499630, pcs: 1098, varCost: 0 },
      'Feb-2026': { sales: 323680, pcs: 806, varCost: 0 },
      'Mar-2026': { sales: 565180, pcs: 1332, varCost: 0 },
      'Apr-2026': { sales: 305520, pcs: 745, varCost: 0 },
      'May-2026': { sales: 265419, pcs: 664, varCost: 0 },
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
    category: 'Water Bar Shelf',
    categoryTh: 'ชั้นบาร์น้ำ',
    months: {
      'Jan-2026': { sales: 138730, pcs: 637, varCost: 0 },
      'Feb-2026': { sales: 112510, pcs: 527, varCost: 0 },
      'Mar-2026': { sales: 87020, pcs: 410, varCost: 0 },
      'Apr-2026': { sales: 73770, pcs: 338, varCost: 0 },
      'May-2026': { sales: 58085, pcs: 266, varCost: 0 },
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
    category: 'Others',
    categoryTh: 'อื่นๆ',
    months: {
      'Jan-2026': { sales: 371461, pcs: 4267, varCost: 0 },
      'Feb-2026': { sales: 930893, pcs: 17112, varCost: 0 },
      'Mar-2026': { sales: 912339, pcs: 36200, varCost: 0 },
      'Apr-2026': { sales: 372960, pcs: 19164, varCost: 0 },
      'May-2026': { sales: 430857, pcs: 23322, varCost: 0 },
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

const INITIAL_FIXED_COSTS: Record<string, number> = {
  'Jan-2026': 3333100,
  'Feb-2026': 2716300,
  'Mar-2026': 3015800,
  'Apr-2026': 1870400,
  'May-2026': 2976900,
  'Jun-2026': 0,
  'Jul-2026': 0,
  'Aug-2026': 0,
  'Sep-2026': 0,
  'Oct-2026': 0,
  'Nov-2026': 0,
  'Dec-2026': 0,
};

function MarginUserGuidePanel({ isOpen, onClose, t }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div 
        id="margin-guide-backdrop"
        className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div 
        id="margin-guide-modal"
        className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div id="margin-guide-header" className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg">
              <HelpCircle size={22} className="text-[#b7a159]"/> {t('MARGIN GUIDE', 'คู่มือกำไรขั้นต้น')}
            </h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">{t('Gross Margin & Cost Analyst', 'โมดูลวิเคราะห์กำไรขั้นต้น')}</p>
          </div>
          <button id="margin-guide-close-btn" onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors">
            <X size={24}/>
          </button>
        </div>
        
        <div id="margin-guide-content" className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Layers size={18} className="text-[#b7a159]"/> {t('1. Calculation Logic', '1. สูตรคำนวณกำไรและต้นทุน')}
            </h4>
            <div className="space-y-3 font-normal text-[#414757] leading-relaxed">
              <p>
                <strong>{t('Revenue / ยอดขาย:', 'Revenue / ยอดขาย:')}</strong> {t('Total sales for all products in the category.', 'ยอดขายรวมของทุกสินค้าย่อยในหมวดหมู่นั้นๆ ในกรอบเวลา 1 เดือน (ดึงจากเมนู Sale Revenue)')}
              </p>
              <p>
                <strong>{t('Variable Cost / ต้นทุนแปรผันรายสินค้า:', 'Variable Cost / ต้นทุนแปรผันรายสินค้า:')}</strong> {t('Calculated via weighted average of known product costs.', 'คำนวณจาก (pcs. × avg. Cost/pcs.) โดย avg. Cost/pcs. มาจากการหาค่าเฉลี่ยแบบถ่วงน้ำหนัก (Weighted Average) ของต้นทุนสินค้าย่อยที่มีข้อมูลในกลุ่มนั้น')}
              </p>
              <p>
                <strong>{t('Fix Cost / ค่าใช้จ่ายปฏิบัติการ (คงที่):', 'Fix Cost / ค่าใช้จ่ายปฏิบัติการ (คงที่):')}</strong> {t('Total factory expense derived from Cost menu minus total variable costs.', 'ค่าใช้จ่ายรวมทั้งโรงงาน (ดึงจากเมนู Cost & Expense) นำมาหักลบด้วย Variable Cost รวมทั้งหมดในเดือนนั้น')}
              </p>
              <p>
                <strong>{t('Margin / กำไรขั้นต้นสุทธิ:', 'Margin / กำไรสุทธิ:')}</strong> {t('Revenue - Variable Cost - Fix Cost.', 'คำนวณจาก (Revenue รวม) - (Variable Cost รวม) - (Fix Cost)')}
              </p>
            </div>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Edit size={18} className="text-[#3f809e]"/> {t('2. Interactive Simulation', '2. จำลองและแก้ไขตัวเลข (Simulation)')}
            </h4>
            <p className="text-[12px] text-[#414757] leading-relaxed">
              {t('Toggle "Edit Mode" to dynamically override Sales values, quantity (pcs), or Fixed Costs. The backend matrix automatically recalculates percentages, averages, and gross totals in real-time.', 'สลับไปที่ "โหมดแก้ไข" เพื่อทดลองเปลี่ยนตัวเล ยอดงานขาย, จำนวนชิ้น หรือ ค่าใช้จ่ายคงที่ ระบบจะทำการวิเคราะห์และแสดงผลลัพธ์แบบเรียลไทม์ทันที')}
            </p>
          </section>
        </div>
        
        <div id="margin-guide-footer" className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button 
            id="margin-guide-gotit-btn"
            onClick={onClose} 
            className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]"
          >
            {t('Got it', 'รับทราบ')}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

export default function Margin() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState('2026');
  
  const MONTH_LABELS = useMemo(() => 
    MONTH_LABELS_MAPPING.map(m => `${m}-${selectedYear}`), 
  [selectedYear]);
  
  // State for operational category records
  const [categories, setCategories] = useState<CategoryData[]>(() => {
    const saved = localStorage.getItem('margin_categories_v1');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // State for monthly fixed overheads
  const [fixedCosts, setFixedCosts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('margin_fixed_costs_v1');
    return saved ? JSON.parse(saved) : INITIAL_FIXED_COSTS;
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const isEditMode = false; // EDIT MODE is strictly disabled per request

  // Sync Data from SaleRevenue and CostExpense
  const handleSyncBaseData = async (isSilent = false) => {
    try {
      setIsSyncing(true);
      const [salesRes, costRes] = await Promise.all([
        api.post('read', 'SaleRevenue'),
        api.post('read', 'CostExpense')
      ]);

      const salesData = salesRes?.data?.items || [];
      const costData = costRes?.data?.items || [];

      // Helper for Parsing Dates
      const getParsedMonthYear = (rawDate: any) => {
        let d: Date | null = null;
        if (typeof rawDate === 'number' || !isNaN(Number(rawDate))) {
          const serialDate = Number(rawDate);
          if (serialDate > 20000) d = new Date((serialDate - (25567 + 1)) * 86400 * 1000);
        }
        if (!d) {
          const dateStr = String(rawDate);
          const matches = dateStr.match(/^(\d+)-([A-Za-z]+)-(\d+)$/);
          if (matches) return `${matches[2]}-${matches[3]}`;
          d = new Date(rawDate);
        }
        if (d && !isNaN(d.getTime())) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${months[d.getMonth()]}-${d.getFullYear()}`;
        }
        return 'Unknown-2026';
      };

      // Create new Categories state based on INITIAL_CATEGORIES struct
      const newCategories: CategoryData[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
      // Reset all months to 0 to safely accumulate newly synced data
      newCategories.forEach(cat => {
        Object.keys(cat.months).forEach(m => {
          cat.months[m] = { sales: 0, pcs: 0, varCost: 0 };
        });
      });

      // 1. Process SaleRevenue per Category, per Month
      const knownCostsTracker: Record<string, { qty: number, costSum: number }> = {}; 
      // track known costs per category/monthkey
      salesData.forEach((row: any) => {
        const dateVal = row['Date'] || row['วันที่'] || row['date'] || Object.values(row)[0] || '';
        const mKey = getParsedMonthYear(dateVal);
        const qty = parseFloat(String(row['ยอดขาย (ชิ้น)'] || row['ยอดขาย(ชิ้น)'] || row['Qty'] || row['จำนวน'] || Object.values(row)[3] || 0).replace(/,/g, '')) || 0;
        const price = parseFloat(String(row['ราคาขาย'] || row['ราคาขาย(บาท)'] || row['Price'] || Object.values(row)[4] || 0).replace(/,/g, '')) || 0;
        const revenue = parseFloat(String(row['มูลค่าขาย'] || row['มูลค่าขาย(บาท)'] || row['Revenue'] || row['Total'] || Object.values(row)[5] || 0).replace(/,/g, '')) || (qty * price);
        const cost = parseFloat(String(row['ราคาทุน'] || row['Cost'] || '0').replace(/,/g, '')) || 0;
        
        let category = String(row['กลุ่มสินค้า'] || row['ประเภท'] || row['Category'] || Object.values(row)[1] || 'Others');
        // Map common Th names back to tracking category if it deviates slightly, or just find it. We'll find by categoryTh or name
        let targetCat = newCategories.find(c => c.category === category || c.categoryTh === category);
        if (!targetCat) targetCat = newCategories.find(c => c.category === 'Others'); // fallback

        if (targetCat) {
          if (!targetCat.months[mKey]) targetCat.months[mKey] = { sales: 0, pcs: 0, varCost: 0 };
          targetCat.months[mKey].sales += revenue;
          targetCat.months[mKey].pcs += qty;
          
          if (cost > 0 && qty > 0) {
            const trackKey = `${targetCat.category}_${mKey}`;
            if (!knownCostsTracker[trackKey]) knownCostsTracker[trackKey] = { qty: 0, costSum: 0 };
            knownCostsTracker[trackKey].qty += qty;
            knownCostsTracker[trackKey].costSum += (cost * qty);
          }
        }
      });

      // Calc Variable Cost (varCost)
      newCategories.forEach(cat => {
        Object.keys(cat.months).forEach(m => {
          const mData = cat.months[m];
          const trackKey = `${cat.category}_${m}`;
          const tracker = knownCostsTracker[trackKey];
          
          let avgCost = 0;
          if (tracker && tracker.qty > 0) {
            avgCost = tracker.costSum / tracker.qty;
          }
          mData.varCost = mData.pcs * avgCost;
        });
      });

      // 2. Process CostExpense to get Fix Costs - Reset to 0 so we only count database rows, not old hardcoded ones
      const newFixedCosts: Record<string, number> = {};
      MONTH_LABELS.forEach(m => {
        newFixedCosts[m] = 0;
      });

      costData.forEach((row: any) => {
        const dateVal = row['วันที่'] || row['Date'] || row['date'] || Object.values(row)[0] || '';
        const mKey = getParsedMonthYear(dateVal);
        const totalExpense = parseFloat(String(row['ต้นทุนและค่าใช้จ่ายรวม'] || row['Total Cost'] || row['TOTAL'] || Object.values(row)[6] || 0).replace(/,/g, '')) || 0;
        
        if (newFixedCosts[mKey] === undefined) newFixedCosts[mKey] = 0;
        newFixedCosts[mKey] += totalExpense;
      });

      // Fix Cost = (Total Factory Cost) - (Total calculated Variable Cost for all categories in that month)
      Object.keys(newFixedCosts).forEach(m => {
        const sumVarCost = newCategories.reduce((acc, cat) => acc + (cat.months[m]?.varCost || 0), 0);
        let actualFixCost = newFixedCosts[m] - sumVarCost;
        if (actualFixCost < 0) actualFixCost = 0; // Prevent negative fixed cost if variable exceeds? Typically factory cost > variable
        newFixedCosts[m] = actualFixCost;
      });

      handleSaveData(newCategories, newFixedCosts);
      if (!isSilent) {
        alert(t('Synced data with Database', 'ดึงข้อมูลสำเร็จ!'));
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

  // Automatically sync on page load / selectedYear change!
  useEffect(() => {
    handleSyncBaseData(true);
  }, [selectedYear]);

  // Helper function to update state and save to local storage
  const handleSaveData = (updatedCats: CategoryData[], updatedFix: Record<string, number>) => {
    setCategories(updatedCats);
    setFixedCosts(updatedFix);
    localStorage.setItem('margin_categories_v1', JSON.stringify(updatedCats));
    localStorage.setItem('margin_fixed_costs_v1', JSON.stringify(updatedFix));
  };

  // Export to CSV
  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Header values
      csvContent += "Category," + MONTH_LABELS.join(",") + "\n";
      
      // 1. Revenue
      csvContent += "Revenue," + MONTH_LABELS.map(m => {
        const sumVal = categories.reduce((acc, cat) => acc + (cat.months[m]?.sales || 0), 0);
        return (sumVal / 1000000).toFixed(4) + " MB";
      }).join(",") + "\n";

      // 2. Variable Cost
      csvContent += "Variable Cost," + MONTH_LABELS.map(m => {
        const sumVarProd = categories.reduce((acc, cat) => acc + (cat.months[m]?.varCost || 0), 0);
        const totalVC = sumVarProd + (fixedCosts[m] || 0);
        return (totalVC / 1000000).toFixed(4) + " MB";
      }).join(",") + "\n";

      // 3. Fix Cost
      csvContent += "Fix Cost," + MONTH_LABELS.map(m => {
        return ((fixedCosts[m] || 0) / 1000000).toFixed(4) + " MB";
      }).join(",") + "\n";

      // 4. Margin
      csvContent += "Margin," + MONTH_LABELS.map(m => {
        const rev = categories.reduce((acc, cat) => acc + (cat.months[m]?.sales || 0), 0);
        const sumVarProd = categories.reduce((acc, cat) => acc + (cat.months[m]?.varCost || 0), 0);
        const totalVC = sumVarProd + (fixedCosts[m] || 0);
        const marg = rev - totalVC;
        return (marg / 1000000).toFixed(4) + " MB";
      }).join(",") + "\n";

      // Detailed categories
      categories.forEach(cat => {
        const name = t(cat.category, cat.categoryTh);
        csvContent += `"${name} (Sales)",` + MONTH_LABELS.map(m => cat.months[m]?.sales || 0).join(",") + "\n";
        csvContent += `"${name} (pcs)",` + MONTH_LABELS.map(m => cat.months[m]?.pcs || 0).join(",") + "\n";
        csvContent += `"${name} (Variable Cost)",` + MONTH_LABELS.map(m => cat.months[m]?.varCost || 0).join(",") + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "ceo_portal_margin_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch(err) {
      console.error('Failed to export:', err);
    }
  };

  // Matrix calculations
  const calculatedMonthlyTotals = useMemo(() => {
    const totals: Record<string, {
      revenue: number;
      productVarCost: number;
      totalVarCost: number;
      fixCost: number;
      margin: number;
      pctMargin: number;
    }> = {};

    MONTH_LABELS.forEach(m => {
      // 1. Revenue is sum of category sales
      const rev = categories.reduce((sum, cat) => sum + (cat.months[m]?.sales || 0), 0);
      
      // 2. Product Variable Cost is sum of category varCost
      const prodVarCost = categories.reduce((sum, cat) => sum + (cat.months[m]?.varCost || 0), 0);
      
      // 3. Fix Cost Row
      const fix = fixedCosts[m] || 0;

      // 4. Summary Variable Cost (Actually just product variable cost + fixed cost to represent total Cost)
      const totalVarCost = prodVarCost + fix;

      // 5. Margin = Revenue - Total Cost (which is prodVarCost + fix)
      const marginVal = rev - totalVarCost;

      // 6. %Margin = (Margin / Revenue) * 100
      const pctMarginVal = rev > 0 ? (marginVal / rev) * 100 : 0;

      totals[m] = {
        revenue: rev,
        productVarCost: prodVarCost,
        totalVarCost,
        fixCost: fix,
        margin: marginVal,
        pctMargin: pctMarginVal
      };
    });

    return totals;
  }, [categories, fixedCosts, MONTH_LABELS]);

  // Overall KPIs for quick visualization (Sum of active months)
  const statsKPI = useMemo(() => {
    let totalRev = 0;
    let totalVC = 0;
    let totalFC = 0;
    let totalMarginVal = 0;

    MONTH_LABELS.forEach(m => {
      const monthData = calculatedMonthlyTotals[m];
      totalRev += monthData.revenue;
      totalVC += monthData.totalVarCost;
      totalFC += monthData.fixCost;
      totalMarginVal += monthData.margin;
    });

    const averagePctMargin = totalRev > 0 ? (totalMarginVal / totalRev) * 100 : 0;

    return {
      revenue: totalRev,
      varCost: totalVC,
      fixCost: totalFC,
      margin: totalMarginVal,
      pctMargin: averagePctMargin
    };
  }, [calculatedMonthlyTotals, MONTH_LABELS]);

  // Format utility
  const formatMB = (val: number) => {
    const mbValue = val / 1000000;
    // Format to 4 decimal places as shown in the screenshot
    return mbValue.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + ' MB';
  };

  return (
    <div id="margin-page-container" className="flex flex-col w-full animate-fadeIn bg-transparent pb-10">
      
      {/* USER GUIDE FLOATING TAB */}
      <button 
        id="margin-guide-floating-btn"
        onClick={() => setIsGuideOpen(true)} 
        className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group"
      >
        <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
        <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">{t('MARGIN GUIDE', 'คู่มือใช้งาน')}</span>
      </button>

      <MarginUserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} t={t} />

      {/* HEADER SECTION */}
      <div id="margin-header-container" className="h-14 px-4 sm:px-8 mt-[2px] mb-4 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 w-10 h-10 border border-[#3f809e]/40 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <DollarSign size={22} strokeWidth={2.5} className="text-[#3f809e]" />
            </div>
          </div>
          <div className="mt-0.5">
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header text-[24px]">
              {t('MARGIN METRIC', 'ผลวิเคราะห์กำไรขั้นต้น')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">{t('PROFIT', 'โครงสร้างกำไร')}</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
              {t('REALTIME GROSS MARGIN ANALYSIS & OPERATIONAL FORECAST GRID', 'วิเคราะห์กำไรขั้นต้นแยกตามหมวดหมู่และจำลองทิศทางผลประกอบการ')}
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div id="margin-action-toolbar" className="flex items-center gap-2.5 bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner">
          <div className="flex items-center bg-white border border-[#eaeaec] rounded-lg px-2 h-9 shadow-sm">
             <Calendar size={14} className="text-[#3f809e] mr-2" />
             <select 
               value={selectedYear}
               onChange={(e) => setSelectedYear(e.target.value)}
               className="bg-transparent text-[12px] font-black uppercase text-[#212c46] focus:outline-none cursor-pointer"
             >
               <option value="2024">2024</option>
               <option value="2025">2025</option>
               <option value="2026">2026</option>
               <option value="2027">2027</option>
             </select>
          </div>
          
          <button 
            onClick={() => handleSyncBaseData(false)}
            disabled={isSyncing}
            className={`flex items-center gap-2 h-9 px-4 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm transition-all border ${isSyncing ? 'bg-indigo-50 border-indigo-200 text-indigo-400 opacity-70 cursor-not-allowed' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700'}`}
          >
             <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> {t('SYNC', 'ซิงค์ข้อมูล')}
          </button>

          <button 
            id="margin-export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-2 h-9 px-4 bg-[#212c46] hover:bg-[#343e5c] text-white rounded-lg text-[11px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95"
          >
            <FileDown size={14} /> {t('EXPORT CSV', 'ส่งออกข้อมูล')}
          </button>
        </div>
      </div>

      {/* KPI CARDS (Interactive Summaries) */}
      <div id="margin-kpis-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-8 mb-6">
        {/* KPI 1 */}
        <div id="margin-kpi-1" className="bg-white px-5 py-4 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#b58c4f] transition-all min-h-[100px]">
          <div className="absolute -right-4 -bottom-6 opacity-[0.04] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <TrendingUp size={90} color={THEME.success} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('TOTAL NET REVENUE', 'ยอดขายสะสมสุทธิ')}</p>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#657f4d]">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatMB(statsKPI.revenue)}</h4>
            <span className="text-[9px] font-black uppercase text-[#657f4d] tracking-widest">12 {t('Months', 'เดือน')}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div id="margin-kpi-2" className="bg-white px-5 py-4 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#b58c4f] transition-all min-h-[100px]">
          <div className="absolute -right-4 -bottom-6 opacity-[0.04] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <BarChart3 size={90} color={THEME.danger} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('TOTAL COMBINED COST', 'ต้นทุนแปรผันรวม')}</p>
            <div className="h-7 w-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#932c2e]">
              <BarChart3 size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className="text-[20px] font-black text-[#212c46] tracking-tight">{formatMB(statsKPI.varCost)}</h4>
            <span className="text-[9px] font-black uppercase text-[#932c2e] tracking-widest">12 {t('Months', 'เดือน')}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div id="margin-kpi-3" className="bg-white px-5 py-4 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#b58c4f] transition-all min-h-[100px]">
          <div className="absolute -right-4 -bottom-6 opacity-[0.04] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            {statsKPI.margin >= 0 ? <TrendingUp size={90} color={THEME.primaryLight} /> : <TrendingDown size={90} color={THEME.accent} />}
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('ACCUMULATED MARGIN', 'กำไรสะสม (MARGIN)')}</p>
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${statsKPI.margin >= 0 ? 'bg-sky-50 text-sky-600 border border-sky-100' : 'bg-red-50 text-[#a94228] border border-red-100'}`}>
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className={`text-[20px] font-black tracking-tight ${statsKPI.margin >= 0 ? 'text-[#212c46]' : 'text-[#a94228]'}`}>
              {formatMB(statsKPI.margin)}
            </h4>
            <span className={`text-[9px] font-black uppercase tracking-widest ${statsKPI.margin >= 0 ? 'text-sky-600' : 'text-[#a94228]'}`}>
              {statsKPI.margin >= 0 ? t('GAIN', 'เป็นกำไร') : t('LOSS', 'ติดลบ')}
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div id="margin-kpi-4" className="bg-white px-5 py-4 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#b58c4f] transition-all min-h-[100px]">
          <div className="absolute -right-4 -bottom-6 opacity-[0.04] transform group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <Percent size={90} color={THEME.brightGold} />
          </div>
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('AVERAGE MARGIN %', 'เปอร์เซ็นต์กำไรเฉลี่ย')}</p>
            <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#b58c4f]">
              <Percent size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between z-10">
            <h4 className={`text-[20px] font-black tracking-tight ${statsKPI.pctMargin >= 0 ? 'text-[#657f4d]' : 'text-[#932c2e]'}`}>
              {statsKPI.pctMargin.toFixed(2)} %
            </h4>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{t('OF SALES', 'ของยอดขาย')}</span>
          </div>
        </div>
      </div>

      {/* DETAILED INTERACTIVE BOARD */}
      <div id="margin-interactive-grid" className="px-4 sm:px-8 w-full">
        <div className="bg-white rounded-2xl shadow-md border border-[#eaeaec] overflow-hidden flex flex-col">
          
          {/* Subheader and notification banner on mode */}
          <div id="margin-card-subheader" className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#eaeaec] bg-[#fdfdfd]">
            <div className="flex items-center gap-2 bg-[#212c46]/5 px-3 py-1.5 rounded-lg border border-[#212c46]/10">
              <Sparkles size={14} className="text-[#b58c4f] animate-pulse" />
              <p className="text-[11px] font-black text-[#212c46] tracking-[0.05em] uppercase">
                {isEditMode ? t('SIMULATION ENABLED: EDITS UPDATE FORMULAS LIVE', 'โหมดแก้ไขจำลอง: การแก้ค่าหน่วยราคากลาง / ยอดจะคำนวณสูตรแปรผันเรียลไทม์') : t('COMPREHENSIVE VIEW: REAL TIME VERIFIED VALUES', 'มุมมองรายงานหลัก: ดึงข้อมูลสรุปวิเคราะห์ตามงวดงบประมาณ')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Info size={14} className="text-slate-400" />
              <span>{t('Value in Million Baht (MB) is calculated as standard Thai executive metrics.', 'หน่วยเป็นล้านบาท (MB) คำนวณเพื่อความสากลบนศูนย์จัดการข้อมูล')}</span>
            </div>
          </div>

          {/* MAIN MATRIX COMPONENT */}
          <div id="margin-table-scroll-container" className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left font-sans border-collapse table-fixed min-w-[1400px]">
              {/* Outer Section 1: Summary Table matching Screenshot Top portion */}
              <thead>
                {/* REVENUE ROW */}
                <tr className="border-b border-[#eaeaec] bg-[#fafafa]">
                  <th className="px-4 py-3 text-[12px] font-black text-[#212c46] tracking-wider uppercase font-mono w-[200px] border-r border-[#eaeaec]">
                    <span className="text-[#657f4d]">{t('Revenue', 'Revenue')}</span>
                  </th>
                  {MONTH_LABELS.map(m => {
                    const val = calculatedMonthlyTotals[m].revenue;
                    return (
                      <td key={'rev-' + m} className="px-3 py-2 text-[12px] font-black text-right border-r border-[#eaeaec] font-mono text-[#657f4d]">
                        {val > 0 ? formatMB(val) : '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* VARIABLE COST ROW */}
                <tr className="border-b border-[#eaeaec] bg-[#fafafa]">
                  <th className="px-4 py-3 text-[12px] font-black text-[#212c46] tracking-wider uppercase font-mono border-r border-[#eaeaec]">
                    <span className="text-[#932c2e]">{t('Variable Cost', 'Variable Cost')}</span>
                  </th>
                  {MONTH_LABELS.map(m => {
                    const val = calculatedMonthlyTotals[m].totalVarCost;
                    return (
                      <td key={'vc-' + m} className="px-3 py-2 text-[12px] font-black text-right border-r border-[#eaeaec] font-mono text-[#932c2e]">
                        {val > 0 ? formatMB(val) : '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* FIX COST ROW */}
                <tr className="border-b border-[#eaeaec] bg-[#fafafa]">
                  <th className="px-4 py-3 text-[12px] font-black text-[#212c46] tracking-wider uppercase font-mono border-r border-[#eaeaec]">
                    <span className="text-[#932c2e]">{t('Fix Cost', 'Fix Cost')}</span>
                  </th>
                  {MONTH_LABELS.map(m => {
                    const val = calculatedMonthlyTotals[m].fixCost;
                    return (
                      <td key={'fc-' + m} className="px-3 py-1 text-[12px] font-black text-right border-r border-[#eaeaec] font-mono text-[#932c2e]">
                        {val > 0 ? formatMB(val) : '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* MARGIN ROW */}
                <tr className="border-b border-[#eaeaec] bg-sky-50/20">
                  <th className="px-4 py-3 text-[12px] font-black text-[#212c46] tracking-wider uppercase font-mono border-r border-[#eaeaec]">
                    <span className="text-sky-600">{t('Margin', 'Magin')}</span>
                  </th>
                  {MONTH_LABELS.map(m => {
                    const val = calculatedMonthlyTotals[m].margin;
                    const isPositive = val >= 0;
                    return (
                      <td key={'marg-' + m} className={`px-3 py-2 text-[12px] font-black text-right border-r border-[#eaeaec] font-mono ${isPositive ? 'text-sky-600' : 'text-[#a94228]'}`}>
                        {val !== 0 ? formatMB(val) : '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* %MARGIN ROW */}
                <tr className="border-b-[2px] border-[#932c2e]/30 bg-sky-50/10">
                  <th className="px-4 py-3 text-[12px] font-black text-[#212c46] tracking-wider uppercase font-mono border-r border-[#eaeaec]">
                    <span className="text-amber-800">{t('%Margin', '%Margin')}</span>
                  </th>
                  {MONTH_LABELS.map(m => {
                    const val = calculatedMonthlyTotals[m].pctMargin;
                    const isPositive = val >= 0;
                    return (
                      <td key={'pct-' + m} className={`px-3 py-2 text-[12px] font-bold text-right border-r border-[#eaeaec] font-mono ${isPositive ? 'text-[#657f4d]' : 'text-[#932c2e]'}`}>
                        {val !== 0 ? val.toFixed(2) + '%' : '-'}
                      </td>
                    );
                  })}
                </tr>

                {/* SECTION BREAK HEADER: Month Column Grid Headers */}
                <tr className="bg-[#212c46] border-b-2 border-[#b7a159] text-white">
                  <th className="px-4 py-3.5 text-[12px] font-black uppercase tracking-widest font-mono border-r border-white/10">{t('Category', 'Category')}</th>
                  {MONTH_LABELS.map(m => (
                    <th key={'col-' + m} className="px-3 py-3.5 text-[12px] font-black text-center tracking-widest font-mono border-r border-white/10 uppercase min-w-[105px]">
                      {t(m.substring(0, 3).toUpperCase() + m.substring(3), m)}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* DETAILED CATEGORY MATRIX */}
              <tbody className="divide-y divide-[#eaeaec]">
                {categories.map((cat, catIdx) => {
                  const displayName = t(cat.category, cat.categoryTh);
                  return (
                    <React.Fragment key={'frag-' + catIdx}>
                      {/* Row Group Header / Main Name and Sales figures */}
                      <tr className="bg-[#fcfcff] font-sans border-b border-[#eaeaec]/80">
                        {/* Title of Row block */}
                        <td className="px-4 py-2.5 text-[12px] font-black text-[#212c46] border-r border-[#eaeaec] bg-slate-50 sticky left-0 z-10 shadow-sm flex items-center gap-1.5 h-full">
                          <Layers size={13} className="text-[#b58c4f]" />
                          <span>{displayName}</span>
                        </td>
                        
                        {/* Row 1: Sales values for each month */}
                        {MONTH_LABELS.map(m => {
                          const val = cat.months[m]?.sales || 0;
                          return (
                            <td key={'sales-' + catIdx + m} className="px-3 py-2 text-[12px] font-black text-right border-r border-[#eaeaec] font-mono text-slate-800">
                              {val > 0 ? val.toLocaleString() : '-'}
                            </td>
                          );
                        })}
                      </tr>

                        {/* Row 2: pcs. (quantity in pieces) */}
                        <tr className="bg-white/80 text-slate-500 hover:bg-slate-50/40 border-b border-[#eaeaec]/40">
                          <td className="px-4 py-1.5 text-[12px] font-medium text-right text-teal-600 border-r border-[#eaeaec] pr-4 bg-slate-50/50">
                            {t('pcs.', 'pcs.')}
                          </td>
                          {MONTH_LABELS.map(m => {
                            const val = cat.months[m]?.pcs || 0;
                            return (
                              <td key={'pcs-' + catIdx + m} className="px-3 py-1.5 text-[12px] font-bold text-right border-r border-[#eaeaec]/30 font-mono text-[#4d87a8]">
                                {val > 0 ? val.toLocaleString() : '-'}
                              </td>
                            );
                          })}
                        </tr>

                      {/* Row 3: avg. Price/pcs. */}
                      <tr className="bg-white/50 text-slate-500 hover:bg-slate-50/40 border-b border-[#eaeaec]/40">
                        <td className="px-4 py-1.5 text-[12px] font-medium text-right text-slate-500 border-r border-[#eaeaec] pr-4 bg-slate-50/30">
                          {t('avg. Price/pcs.', 'avg. Price/pcs.')}
                        </td>
                        {MONTH_LABELS.map(m => {
                          const sData = cat.months[m];
                          const avg = sData && sData.pcs > 0 ? sData.sales / sData.pcs : 0;
                          return (
                            <td key={'avgp-' + catIdx + m} className="px-3 py-1.5 text-[12px] font-medium text-right border-r border-[#eaeaec]/30 font-mono text-slate-600">
                              {avg > 0 ? avg.toFixed(2) : '-'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Row 4: %Sale */}
                      <tr className="bg-white/30 text-slate-500 hover:bg-slate-50/40 border-b border-[#eaeaec]/40">
                        <td className="px-4 py-1.5 text-[12px] font-bold text-right text-amber-700 border-r border-[#eaeaec] pr-4 bg-slate-50/20">
                          {t('%Sale', '%Sale')}
                        </td>
                        {MONTH_LABELS.map(m => {
                          const sData = cat.months[m];
                          const monRev = calculatedMonthlyTotals[m].revenue;
                          const pct = monRev > 0 && sData ? (sData.sales / monRev) * 100 : 0;
                          return (
                            <td key={'pcts-' + catIdx + m} className="px-3 py-1.5 text-[12px] font-bold text-right border-r border-[#eaeaec]/30 font-mono text-amber-700">
                              {pct > 0 ? pct.toFixed(2) + '%' : '-'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Row 5: Variable Cost (light crimson red background area) */}
                      <tr className="bg-[#fcf3f3] hover:bg-red-50/80 border-b border-[#eaeaec]/40 text-[#c81e1e]">
                        <td className="px-4 py-1.5 text-[12px] font-bold text-right border-r border-[#eaeaec] pr-4 bg-red-50/30 font-mono">
                          {t('Variable Cost', 'Variable Cost')}
                        </td>
                        {MONTH_LABELS.map(m => {
                          const val = cat.months[m]?.varCost || 0;
                          return (
                            <td key={'vccost-' + catIdx + m} className="px-3 py-1.5 text-[12px] font-bold text-right border-r border-[#eaeaec]/35 font-mono text-[#c81e1e]">
                              {val > 0 ? val.toLocaleString() : '0'}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Row 6: avg. Cost/pcs. */}
                      <tr className="bg-[#fcf3f3]/60 hover:bg-red-50/60 border-b-[2px] border-slate-300/40 text-[#c81e1e]/90">
                        <td className="px-4 py-1.5 text-[12px] font-medium text-right border-r border-[#eaeaec] pr-4 bg-red-50/15">
                          {t('avg. Cost/pcs.', 'avg. Cost/pcs.')}
                        </td>
                        {MONTH_LABELS.map(m => {
                          const sData = cat.months[m];
                          const avg = sData && sData.pcs > 0 ? sData.varCost / sData.pcs : 0;
                          return (
                            <td key={'avgc-' + catIdx + m} className="px-3 py-1.5 text-[12px] font-medium text-right border-r border-[#eaeaec]/35 font-mono text-[#c81e1e]">
                              {avg > 0 ? avg.toFixed(2) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER / CONTROLS SUMMARY */}
          <div id="margin-table-footer" className="px-6 py-4 bg-[#212c46]/5 border-t-[1.5px] border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-[#7a8b95] uppercase tracking-wider">
              <span className="bg-white px-3 py-1.5 rounded-lg border border-[#eaeaec] shadow-sm">
                {t('Months loaded:', 'จำนวนช่วงเวลาที่วิเคราะห์:')} 12 Months
              </span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-[#eaeaec] shadow-sm">
                {t('Validated Categories:', 'กลุ่มสินค้ารวม:')} {categories.length} {t('Categories', 'รายการ')}
              </span>
            </div>
            
            <p className="text-[11px] font-black text-[#b58c4f] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              {t('Interactive Spreadsheet Board Active', 'ระบบสารสนเทศวิเคราะห์ความคุ้มค่ากำลังแสดงผลแบบเรียลไทม์')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
