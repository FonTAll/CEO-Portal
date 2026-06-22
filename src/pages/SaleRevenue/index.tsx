import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CsvUpload } from '../../components/shared/CsvUpload';
import { api } from '../../services/api';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { TrendingUp, Upload, Settings, Plus, List, Search, ChevronLeft, ChevronRight, BarChart2, DollarSign, Package, HelpCircle, X, LayoutGrid, Zap, Database, Briefcase, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const THEME = {
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#6b8e23',
  danger: '#d96245',
  dustyBlue: '#7a8b95',
  revenueBlue: '#0ea5e9'
};

const COMPARISON_MONTHS = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25'];

interface ComparisonCell {
  qty: number | null;
  val: number | null;
}

interface ComparisonProduct {
  category: string;
  name: string;
  cost: number | null;
  price: number;
  months: Record<string, ComparisonCell>;
}

const INITIAL_COMPARISON_PRODUCTS: ComparisonProduct[] = [
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะรีดผ้า 6 ระดับ',
    cost: 84.50,
    price: 127,
    months: {
      'Jan-25': { qty: 24115, val: 3162086 },
      'Feb-25': { qty: 21440, val: 2720560 },
      'Mar-25': { qty: 18704, val: 2414264 },
      'Apr-25': { qty: 24461, val: 3026450 },
      'May-25': { qty: 43532, val: 5403276 },
      'Jun-25': { qty: 39435, val: 4968987 },
      'Jul-25': { qty: 40835, val: 5222425 }
    }
  },
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะรีดผ้า นั่งรีดขายู',
    cost: 45.87,
    price: 60,
    months: {
      'Jan-25': { qty: 12160, val: 729600 },
      'Feb-25': { qty: 9976, val: 598560 },
      'Mar-25': { qty: 14232, val: 853920 },
      'Apr-25': { qty: 12120, val: 727200 },
      'May-25': { qty: 21558, val: 1293480 },
      'Jun-25': { qty: 27554, val: 1653240 },
      'Jul-25': { qty: 16138, val: 968280 }
    }
  },
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะรีดผ้า ML',
    cost: 94.96,
    price: 127,
    months: {
      'Jan-25': { qty: 3032, val: 399508 },
      'Feb-25': { qty: 2454, val: 326912 },
      'Mar-25': { qty: 1848, val: 239320 },
      'Apr-25': { qty: 2224, val: 272588 },
      'May-25': { qty: 5494, val: 680180 },
      'Jun-25': { qty: 5534, val: 718740 },
      'Jul-25': { qty: 3298, val: 391604 }
    }
  },
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะรีดผ้า จัมโบ้',
    cost: 111.31,
    price: 200,
    months: {
      'Jan-25': { qty: 72, val: 14400 },
      'Feb-25': { qty: 100, val: 20000 },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: 596, val: 119200 },
      'May-25': { qty: 2796, val: 559200 },
      'Jun-25': { qty: 780, val: 156000 },
      'Jul-25': { qty: 500, val: 100000 }
    }
  },
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะรีดผ้า 3 ระดับ',
    cost: null,
    price: 105,
    months: {
      'Jan-25': { qty: 1608, val: 168840 },
      'Feb-25': { qty: 228, val: 23940 },
      'Mar-25': { qty: 456, val: 47880 },
      'Apr-25': { qty: 978, val: 102690 },
      'May-25': { qty: 1932, val: 202860 },
      'Jun-25': { qty: 2892, val: 303660 },
      'Jul-25': { qty: 2400, val: 252000 }
    }
  },
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะรีดผ้าไอน้ำ',
    cost: null,
    price: 378,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: 5, val: 4750 },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: 480, val: 230400 },
      'Jun-25': { qty: 388, val: 186240 },
      'Jul-25': { qty: 2528, val: 838080 }
    }
  },
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะรีดผ้า 12 ระดับ',
    cost: null,
    price: 250,
    months: {
      'Jan-25': { qty: 554, val: 138500 },
      'Feb-25': { qty: 76, val: 19000 },
      'Mar-25': { qty: 598, val: 149500 },
      'Apr-25': { qty: 144, val: 36000 },
      'May-25': { qty: 306, val: 76500 },
      'Jun-25': { qty: 766, val: 191500 },
      'Jul-25': { qty: 1048, val: 262000 }
    }
  },
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะรีดผ้า นั่งรีดขาหนีบ',
    cost: null,
    price: 115,
    months: {
      'Jan-25': { qty: 1098, val: 126270 },
      'Feb-25': { qty: 516, val: 59340 },
      'Mar-25': { qty: 1157, val: 133055 },
      'Apr-25': { qty: 738, val: 84870 },
      'May-25': { qty: 1532, val: 176180 },
      'Jun-25': { qty: 1602, val: 184230 },
      'Jul-25': { qty: 1292, val: 148580 }
    }
  },
  {
    category: 'โต๊ะรีดผ้า',
    name: 'โต๊ะกึ่งบอร์ดรีดแขน',
    cost: null,
    price: 35,
    months: {
      'Jan-25': { qty: 300, val: 10500 },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: null, val: null },
      'Jun-25': { qty: 499, val: 17465 },
      'Jul-25': { qty: null, val: null }
    }
  },
  {
    category: 'ราวA',
    name: 'ราว A มินิ',
    cost: 85.47,
    price: 115,
    months: {
      'Jan-25': { qty: 5727, val: 658485 },
      'Feb-25': { qty: 8802, val: 1012230 },
      'Mar-25': { qty: 10176, val: 1169940 },
      'Apr-25': { qty: 4884, val: 561660 },
      'May-25': { qty: 11724, val: 1348260 },
      'Jun-25': { qty: 8469, val: 973935 },
      'Jul-25': { qty: 17538, val: 2016870 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราว A',
    cost: 101.24,
    price: 110,
    months: {
      'Jan-25': { qty: 8523, val: 937530 },
      'Feb-25': { qty: 5352, val: 588720 },
      'Mar-25': { qty: 5194, val: 571340 },
      'Apr-25': { qty: 6163, val: 677930 },
      'May-25': { qty: 7706, val: 847660 },
      'Jun-25': { qty: 8185, val: 900350 },
      'Jul-25': { qty: 7120, val: 783200 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราวAคู่',
    cost: 95.66,
    price: 115,
    months: {
      'Jan-25': { qty: 1546, val: 177790 },
      'Feb-25': { qty: 2805, val: 322575 },
      'Mar-25': { qty: 2304, val: 264960 },
      'Apr-25': { qty: 1706, val: 196190 },
      'May-25': { qty: 2247, val: 258405 },
      'Jun-25': { qty: 2913, val: 334995 },
      'Jul-25': { qty: 3276, val: 376740 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราว บาร์เดี่ยว',
    cost: null,
    price: 102,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: 5244, val: 534888 },
      'Apr-25': { qty: 3810, val: 388620 },
      'May-25': { qty: 9294, val: 947988 },
      'Jun-25': { qty: 5694, val: 580788 },
      'Jul-25': { qty: 5178, val: 528156 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราว A จัมโบ้',
    cost: 103.72,
    price: 135,
    months: {
      'Jan-25': { qty: 1677, val: 209625 },
      'Feb-25': { qty: 1362, val: 170250 },
      'Mar-25': { qty: 906, val: 113250 },
      'Apr-25': { qty: 1221, val: 152625 },
      'May-25': { qty: 1356, val: 169500 },
      'Jun-25': { qty: 1159, val: 144875 },
      'Jul-25': { qty: 1086, val: 135750 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราว T มินิ',
    cost: 68.78,
    price: 98,
    months: {
      'Jan-25': { qty: 858, val: 86010 },
      'Feb-25': { qty: 392, val: 39220 },
      'Mar-25': { qty: 1298, val: 124090 },
      'Apr-25': { qty: 756, val: 76380 },
      'May-25': { qty: 888, val: 85320 },
      'Jun-25': { qty: 720, val: 71880 },
      'Jul-25': { qty: 3161, val: 304615 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราวบีสัส',
    cost: null,
    price: 297,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: null, val: null },
      'Jun-25': { qty: 790, val: 234630 },
      'Jul-25': { qty: 1661, val: 493317 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราว ตะแกรง 2 ชั้น',
    cost: null,
    price: 160,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: 2666, val: 426560 },
      'Jun-25': { qty: 1230, val: 196800 },
      'Jul-25': { qty: 564, val: 90240 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราวทรง L',
    cost: null,
    price: 197,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: 2284, val: 449948 },
      'Jun-25': { qty: 320, val: 63040 },
      'Jul-25': { qty: 1060, val: 208820 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราวขาโชว์พับได้อเนกประสงค์',
    cost: null,
    price: 169,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: 924, val: 156156 },
      'Jun-25': { qty: 1554, val: 262626 },
      'Jul-25': { qty: 492, val: 83148 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราวสนาม',
    cost: null,
    price: 382,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: null, val: null },
      'Jun-25': { qty: null, val: null },
      'Jul-25': { qty: 243, val: 99144 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราววินเพลัส',
    cost: null,
    price: 278,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: 8, val: 2224 },
      'Jun-25': { qty: 324, val: 90072 },
      'Jul-25': { qty: 824, val: 229072 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราว 407',
    cost: null,
    price: 330,
    months: {
      'Jan-25': { qty: 5, val: 1650 },
      'Feb-25': { qty: 300, val: 99000 },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: 294, val: 97020 },
      'May-25': { qty: null, val: null },
      'Jun-25': { qty: 50, val: 16500 },
      'Jul-25': { qty: 195, val: 64350 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราว V 2 ชั้น',
    cost: null,
    price: 171,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: 611, val: 104176 },
      'Jun-25': { qty: 1376, val: 234608 },
      'Jul-25': { qty: 612, val: 104346 }
    }
  },
  {
    category: 'ราวA',
    name: 'ราวตะขอ',
    cost: null,
    price: 258,
    months: {
      'Jan-25': { qty: null, val: null },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: 4, val: 1030 },
      'Jun-25': { qty: 512, val: 131840 },
      'Jul-25': { qty: 820, val: 211150 }
    }
  },
  {
    category: 'ราวA',
    name: 'มือ2',
    cost: null,
    price: 60,
    months: {
      'Jan-25': { qty: 360, val: 21600 },
      'Feb-25': { qty: null, val: null },
      'Mar-25': { qty: null, val: null },
      'Apr-25': { qty: null, val: null },
      'May-25': { qty: null, val: null },
      'Jun-25': { qty: 6, val: 360 },
      'Jul-25': { qty: null, val: null }
    }
  }
];

function UserGuidePanel({ isOpen, onClose, t }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><HelpCircle size={22} className="text-[#b7a159]"/> {t('SALE REVENUE GUIDE', 'คู่มือรายได้จากการขาย')}</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">{t('Revenue Management Hub', 'โมดูลจัดการข้อมูลรายได้')}</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Upload size={18} className="text-[#b7a159]"/> {t('1. Data Import (CSV/Excel)', '1. นำเข้าข้อมูล (CSV/Excel)')}
            </h4>
            <div className="space-y-3 text-[12px] text-[#414757] font-normal leading-relaxed">
              <p>{t('You can import sale revenue data from standard .csv or .xlsx spreadsheets.', 'สามารถนำเข้าข้อมูลจากไฟล์ .csv หรือ .xlsx ที่กำหนดได้โดยตรงผ่านหน้านี้')}</p>
            </div>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Search size={18} className="text-[#3f809e]"/> {t('2. Advanced Filtering', '2. การกรองข้อมูลขั้นสูง')}
            </h4>
            <p className="text-[12px] text-[#414757] leading-relaxed mb-3">
              {t('Use the month selector and search field in the page header to control active visual scopes dynamically.', 'สามารถใช้ตัวเลือกเดือนและช่องค้นหาที่อยู่ในแถบเดียวกับหัวข้อหลักของเพจเพื่อเรียกดูข้อมูลสรุปรายเดือนอย่างรวดเร็ว')}
            </p>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]">{t('Got it', 'รับทราบ')}</button>
        </div>
      </div>
    </>,
    document.body
  );
}

const KpiCard = ({ icon: Icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Icon size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <Icon size={20} />
            </div>
        </div>
        <div className="relative z-10 mt-2 flex items-end justify-between">
            <p className="text-[28px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[11px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

export default function SaleRevenue() {
  const { t } = useLanguage();
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ITEM' | 'CATEGORY' | 'COMPARISON'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>(() => {
    const saved = localStorage.getItem('saleRevenueComparisonProducts');
    if (saved) return JSON.parse(saved);
    return INITIAL_COMPARISON_PRODUCTS;
  });

  const [editingCell, setEditingCell] = useState<{productIndex: number, month: string, type: 'qty' | 'val'} | null>(null);

  // Load data from Google Sheets & Firebase on component load (with fallback caching)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('read', 'SaleRevenue', null, { limit: 2000, offset: 0 });
        if (response && response.status === 'success' && response.data) {
          const items = response.data.items || [];
          setData(items);
          localStorage.setItem('saleRevenueCache', JSON.stringify(items));
        } else {
          const cached = localStorage.getItem('saleRevenueCache');
          if (cached) setData(JSON.parse(cached));
        }
      } catch (err) {
        console.error('Failed to load SaleRevenue from cloud:', err);
        const cached = localStorage.getItem('saleRevenueCache');
        if (cached) setData(JSON.parse(cached));
      }

      // Load comparison product overrides from cloud database
      try {
        const compRes = await api.post('read', 'SaleComparison', null, { limit: 500 });
        if (compRes && compRes.status === 'success' && compRes.data && compRes.data.items && compRes.data.items.length > 0) {
          const fetchedComp: ComparisonProduct[] = compRes.data.items.map((row: any) => ({
            category: row.category,
            name: row.name,
            cost: row.cost != null ? Number(row.cost) : null,
            price: Number(row.price),
            months: typeof row.months === 'string' ? JSON.parse(row.months) : row.months
          }));
          setComparisonProducts(fetchedComp);
          localStorage.setItem('saleRevenueComparisonProducts', JSON.stringify(fetchedComp));
        }
      } catch (err) {
        console.error('Failed to load comparative benchmarks, using cache:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredComparisonProducts = useMemo(() => {
    let result = comparisonProducts;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    return result;
  }, [comparisonProducts, searchTerm]);

  const handleCellEdit = async (index: number, month: string, type: 'qty' | 'val', newValue: string) => {
    const updated = [...comparisonProducts];
    const valFloat = newValue.trim() === '' ? null : parseFloat(newValue.replace(/,/g, ''));
    
    const productItem = filteredComparisonProducts[index];
    const actualIndex = comparisonProducts.findIndex(p => p.name === productItem.name);
    
    if (actualIndex !== -1) {
      if (!updated[actualIndex].months[month]) {
        updated[actualIndex].months[month] = { qty: null, val: null };
      }
      updated[actualIndex].months[month][type] = valFloat;
      setComparisonProducts(updated);
      localStorage.setItem('saleRevenueComparisonProducts', JSON.stringify(updated));

      // Save comparison edit synchronously to both Firebase & Google Sheets
      try {
        const payload = {
          id: String(updated[actualIndex].name),
          category: updated[actualIndex].category,
          name: updated[actualIndex].name,
          cost: updated[actualIndex].cost,
          price: updated[actualIndex].price,
          months: JSON.stringify(updated[actualIndex].months)
        };
        await api.post('write', 'SaleComparison', [payload]);
      } catch (err) {
        console.error('Failed to write SaleComparison to cloud database:', err);
      }
    }
  };
  
  const [mapping, setMapping] = useState(() => {
    const saved = localStorage.getItem('saleRevenueMapping');
    if (saved) return JSON.parse(saved);
    return {
      dateCol: 'mm/dd/yyyy',
      productCol: 'ชื่อสินค้า',
      revenueCol: 'มูลค่าขาย(บาท)'
    };
  });

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleClearData = async () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3000);
      return;
    }
    
    try {
      setIsLoading(true);
      // Delete via API, passing all existing items
      if (data.length > 0) {
        await api.post('delete', 'SaleRevenue', data);
      }
      localStorage.removeItem('saleRevenueCache');
      setData([]);
      setAlertInfo({ type: 'success', message: 'ลบข้อมูลทั้งหมดเรียบร้อยแล้ว' });
    } catch (err) {
      console.error(err);
      setAlertInfo({ type: 'error', message: 'ลบข้อมูลล้มเหลว' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (uploadedData: any[]) => {
    const timestamp = new Date().toISOString();
    
    // We will separate operations into WRITES (new records) and UPDATES (existing records with matching dates)
    const rowsToUpdate: any[] = [];
    const rowsToWrite: any[] = [];
    const updatedDataList = [...data];

    uploadedData.forEach((row, index) => {
      const dateVal = row[mapping.dateCol] || row['Date'] || row['วันที่'] || '';
      const trimDateVal = String(dateVal).trim();

      // Find if a row with the same date already exists in the existing database rows
      const existingRowIndex = updatedDataList.findIndex(existingRow => {
        const existingDateVal = String(existingRow[mapping.dateCol] || existingRow['Date'] || existingRow['วันที่'] || '').trim();
        return existingDateVal !== '' && existingDateVal === trimDateVal;
      });

      const mappedRow = { ...row };
      if (dateVal) {
        mappedRow[mapping.dateCol] = dateVal;
      }

      if (existingRowIndex !== -1) {
        // Date matches existing row, so overwrite it
        const existingRow = updatedDataList[existingRowIndex];
        const updatedRow = {
          ...mappedRow,
          id: existingRow.id,
          createdAt: existingRow.createdAt || timestamp,
          updatedAt: timestamp
        };
        rowsToUpdate.push(updatedRow);
        updatedDataList[existingRowIndex] = updatedRow; // Update in-place locally
      } else {
        // Date not found, so create a new record
        const newRow = {
          ...mappedRow,
          id: row.id ? String(row.id) : `SR-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: row.createdAt || timestamp,
          updatedAt: timestamp
        };
        rowsToWrite.push(newRow);
        updatedDataList.push(newRow); // Append to local state list
      }
    });

    const previousData = data;
    // Optimistic UI update
    setData(updatedDataList);
    setIsModalOpen(false);
    setAlertInfo(null);

    // Synchronous Dual Write to both Google Sheet & Firebase
    try {
      setIsLoading(true);
      
      // Perform updates for matching dates
      if (rowsToUpdate.length > 0) {
        await api.post('update', 'SaleRevenue', rowsToUpdate);
      }
      
      // Perform writes for non-duplicate/new dates
      if (rowsToWrite.length > 0) {
        await api.post('write', 'SaleRevenue', rowsToWrite);
      }

      localStorage.setItem('saleRevenueCache', JSON.stringify(updatedDataList));
      setAlertInfo({
        type: 'success',
        message: t('Successfully uploaded and synchronized data with Google Sheet & Firestore.', 'อัปโหลดและบันทึกข้อมูลลง Google Sheet เรียบร้อยแล้ว!')
      });
      console.log('Successfully completed batch export to Sheets & Firestore.');
    } catch (err) {
      console.error('Failed to dual write uploaded sale revenue list:', err);
      // Rollback UI update on failure
      setData(previousData);
      setAlertInfo({
        type: 'error',
        message: t('Failed to save data. Rollback applied. Error: ', 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลงฐานข้อมูล (ทำการย้อนกลับแล้ว): ') + (err instanceof Error ? err.message : String(err))
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getParsedDate = (rawDate: any) => {
    if (!rawDate) return null;
    if (typeof rawDate === 'number' || !isNaN(Number(rawDate))) {
        const serialDate = Number(rawDate);
        return new Date((serialDate - (25567 + 1)) * 86400 * 1000);
    }
    const strDate = String(rawDate);
    const parts = strDate.split('/');
    if (parts.length === 3) {
       return new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}T00:00:00`);
    }
    return new Date(strDate);
  };

  const filteredData = React.useMemo(() => {
    let result = data;
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      result = result.filter(row => {
        const d = getParsedDate(row[mapping.dateCol] || row['Date'] || row['วันที่']);
        if (!d || isNaN(d.getTime())) return false;
        return d.getFullYear() === Number(year) && (d.getMonth() + 1) === Number(month);
      });
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(row => 
        String(row[mapping.productCol] || '').toLowerCase().includes(term) ||
        String(row['ประเภท'] || '').toLowerCase().includes(term) ||
        String(row[mapping.dateCol] || row['Date'] || row['วันที่'] || '').toLowerCase().includes(term)
      );
    }
    return result;
  }, [data, selectedMonth, searchTerm, mapping]);

  const groupedData = React.useMemo(() => {
    if (activeTab === 'ALL') return filteredData;
    
    const groupBy = activeTab === 'ITEM' ? mapping.productCol : 'ประเภท';
    
    const groups = filteredData.reduce((acc, row) => {
      const key = row[groupBy] || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
           name: key,
           qty: 0,
           cost: 0,
           revenue: 0,
           type: row['ประเภท'] || '-'
        };
      }
      
      const qty = parseFloat((row['ยอดขาย (ชิ้น)'] || '0').toString().replace(/,/g, ''));
      const revenue = parseFloat((row[mapping.revenueCol] || '0').toString().replace(/,/g, ''));
      const costRaw = parseFloat((row['ราคาทุน'] || '0').toString().replace(/,/g, ''));
      
      acc[key].qty += (isNaN(qty) ? 0 : qty);
      acc[key].revenue += (isNaN(revenue) ? 0 : revenue);
      acc[key].cost += ((isNaN(costRaw) ? 0 : costRaw) * (isNaN(qty) ? 0 : qty));
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(groups).sort((a: any, b: any) => b.revenue - a.revenue);
  }, [filteredData, activeTab]);

  const totalRevenue = filteredData.reduce((sum, row) => {
    const val = parseFloat((row[mapping.revenueCol] || '0').toString().replace(/,/g, ''));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
  
  const totalCost = filteredData.reduce((sum, row) => {
    const cost = parseFloat((row['ราคาทุน'] || '0').toString().replace(/,/g, ''));
    const qty = parseFloat((row['ยอดขาย (ชิ้น)'] || '0').toString().replace(/,/g, ''));
    return sum + ((isNaN(cost) ? 0 : cost) * (isNaN(qty) ? 0 : qty));
  }, 0);

  const totalQty = filteredData.reduce((sum, row) => {
    const qty = parseFloat((row['ยอดขาย (ชิ้น)'] || '0').toString().replace(/,/g, ''));
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  const monthlyTrendData = useMemo(() => {
    const groups = filteredData.reduce((acc, row) => {
      const rawDate = row[mapping.dateCol] || row['Date'] || row['วันที่'];
      if (!rawDate) return acc;
      
      const d = getParsedDate(rawDate);
      if (!d || isNaN(d.getTime())) return acc;
      
      const monthKey = d.toLocaleString('en-US', { month: 'short', year: '2-digit' }); // e.g. "Jan 25"
      if (!acc[monthKey]) {
        acc[monthKey] = { label: monthKey, revenue: 0, sortKey: d.getTime() };
      }
      const revenue = parseFloat((row[mapping.revenueCol] || '0').toString().replace(/,/g, ''));
      if (!isNaN(revenue)) {
        acc[monthKey].revenue += revenue;
      }
      return acc;
    }, {} as Record<string, { label: string, revenue: number, sortKey: number }>);
    
    return Object.values(groups).sort((a: any, b: any) => a.sortKey - b.sortKey);
  }, [filteredData, mapping]);

  const formatMB = (val: number) => {
    return '฿ ' + (val / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MB';
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB' }).format(val).replace('THB', '฿');
  };

  const comparisonPaginated = filteredComparisonProducts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const paginatedData = activeTab === 'COMPARISON' ? [] : groupedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const displayLength = activeTab === 'COMPARISON' ? filteredComparisonProducts.length : groupedData.length;
  const totalPages = Math.max(1, Math.ceil(displayLength / rowsPerPage));

  return (
    <div className="flex flex-col w-full animate-fadeIn bg-transparent">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">{t('USER GUIDE', 'คู่มือผู้ใช้')}</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} t={t} />

      {/* HEADER SECTION */}
      <div className="h-14 px-4 sm:px-8 mt-[2px] mb-4 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#6b8e23] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 w-10 h-10 border border-[#6b8e23]/40 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
                      <TrendingUp size={22} strokeWidth={2.5} className="text-[#6b8e23]" />
                  </div>
              </div>
              <div className="mt-0.5">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header text-[24px]">
                      {t('SALE REVENUE', 'รายได้จากการขาย')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6b8e23] to-[#b58c4f]">{t('HUB', 'ศูนย์ข้อมูล')}</span>
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
                      {t('SALE REVENUE STATUS & CORE SYSTEM READY-STAGE ENGINE', 'ข้อมูลรายได้จากการขายและรายงานสรุปสถานะการขาย')}
                  </p>
              </div>
          </div>

          {/* Upper Toolbar: Filter & Tabs on same row as Page Header */}
          <div className="flex items-center gap-3 bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner">
              {/* Date Filtering (Month Selection) */}
              <div className="flex items-center bg-white border border-[#eaeaec] rounded-lg px-3 py-1 shadow-sm h-[38px]">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">{t('MONTH:', 'เดือน:')}</span>
                <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                  className="text-[11px] font-black text-[#212c46] outline-none bg-transparent select-none cursor-pointer"
                />
              </div>

               {/* Tabs (Revenue Categories & Grouping) */}
               <div className="flex items-center gap-1 p-0.5 bg-[#f8f9fa] rounded-lg border border-[#eaeaec] h-[38px]">
                {(['ALL', 'ITEM', 'CATEGORY', 'COMPARISON'] as const).map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest uppercase transition-all h-full flex items-center ${activeTab === tab ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:bg-white hover:text-[#212c46]'}`}
                  >
                    {tab === 'ALL' ? t('ALL REVENUE', 'รายได้ทั้งหมด') : tab === 'ITEM' ? t('BY ITEM', 'ตามสินค้า') : tab === 'CATEGORY' ? t('BY CATEGORY', 'ตามหมวดหมู่') : t('COMPARE SALES', 'ยอดขายแบบเปรียบเทียบ')}
                  </button>
                ))}
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 mt-4 mb-4">
        
        {/* Notification Alert Banner */}
        <AnimatePresence>
          {alertInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 p-4 rounded-xl flex items-center justify-between gap-3 shadow-sm border ${
                alertInfo.type === 'success'
                  ? 'bg-emerald-50 border-emerald-100/80 text-emerald-800'
                  : 'bg-rose-50 border-rose-100/80 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {alertInfo.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span className="text-[12px] font-bold uppercase tracking-wider">{alertInfo.message}</span>
              </div>
              <button
                onClick={() => setAlertInfo(null)}
                className="p-1.5 rounded-full hover:bg-black/5 transition-colors text-current opacity-70 hover:opacity-100"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* KPI STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 shrink-0">
            <KpiCard label={t('TOTAL REVENUE', 'รายได้รวมทั้งหมด')} value={formatMB(totalRevenue)} icon={DollarSign} colorAccent={THEME.revenueBlue} colorValue={THEME.revenueBlue} desc={t('OVERALL INCOME', 'รายได้สะสม')} />
            <KpiCard label={t('COST OF GOODS SOLD', 'ต้นทุนรวมสินค้าขาย')} value={formatMB(totalCost)} icon={BarChart2} colorAccent={THEME.danger} colorValue={THEME.danger} desc={t('TOTAL COST', 'ต้นทุนสะสม')} />
            <KpiCard label={t('TOTAL QUANTITY', 'จำนวนสินค้าขายรวม')} value={totalQty.toLocaleString()} icon={Package} colorAccent={THEME.gold} colorValue={THEME.gold} desc={t('ITEMS SOLD', 'จำนวนชิ้นที่ขาย')} />
            <KpiCard label={t('TOTAL RECORDS', 'จำนวนบันทึกซิงค์')} value={filteredData.length} icon={List} colorAccent={THEME.success} colorValue={THEME.success} desc={t('SYNCED RECORDS', 'รายการบันทึก')} />
        </div>

        {/* HISTORICAL PERFORMANCE TREND CHART OVER TIME */}
        {monthlyTrendData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] p-6 mt-4 flex flex-col shrink-0 animate-fadeIn">
            <h4 className="text-[14px] font-black tracking-widest text-[#212c46] uppercase mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#b58c4f]" /> 
              {t('HISTORICAL PERFORMANCE TREND', 'แนวโน้มรายได้สะสมรายเดือน')}
            </h4>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#7a8b95' }} dy={10} />
                  <YAxis hide={true} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eaeaec', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#212c46' }}
                    formatter={(value: any) => [`฿ ${(Number(value) / 1000000).toFixed(2)} MB`, t('Revenue', 'รายได้')]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col mt-4 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-50">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-4 border-t-[#212c46] border-[#212c46]/20 animate-spin"></div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#212c46]">{t('SYNCING DATA...', 'กำลังซิงค์ข้อมูลกับระบบ...')}</p>
              </div>
            </div>
          )}

          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#eaeaec] bg-white">
            <div className="flex items-center gap-3">
              <div className="text-[#6b8e23]"><List size={18} /></div>
              <h3 className="text-[12px] font-black tracking-[0.15em] text-[#212c46] uppercase">{t('Active Sale Revenue', 'รายการรายได้จากการขาย')}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative h-[38px] flex items-center">
                <Search size={14} className="absolute left-4 text-[#7a8b95]" />
                <input 
                  type="text" 
                  placeholder={t('Search...', 'ค้นหาข้อมูล...')} 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 pr-5 py-2 h-full border border-[#eaeaec] rounded-xl text-[11px] font-bold text-[#212c46] w-[200px] focus:outline-none focus:border-[#4d87a8] transition-all bg-[#f8f9fa] focus:bg-white placeholder-[#7a8b95]" 
                />
              </div>
              {activeTab === 'ALL' && (
                <>
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#212c46] hover:bg-[#414757] text-white px-4 h-[38px] rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md transition-all">
                    <Plus size={14} strokeWidth={3} /> {t('Add Data', 'เพิ่มข้อมูล')}
                  </button>
                  <button onClick={handleClearData} className={`flex items-center gap-2 px-4 h-[38px] rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all border ${isConfirmingClear ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'}`}>
                    <Trash2 size={14} strokeWidth={3} /> {isConfirmingClear ? t('CONFIRM?', 'ยืนยัน?') : t('Clear', 'ลบข้อมูล')}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans border-collapse">
              {activeTab === 'ALL' && (
                <thead className="bg-[#212c46] text-white">
                  <tr className="border-b-2 border-[#b7a159]">
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('DATE', 'วันที่')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('TYPE', 'ประเภท')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('PRODUCT', 'ชื่อสินค้า')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('COST', 'ราคาทุน')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('PRICE', 'ราคาขาย')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('QTY', 'ยอดขาย')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('TOTAL', 'มูลค่าขาย')}</th>
                  </tr>
                </thead>
              )}
              {activeTab === 'ITEM' && (
                <thead className="bg-[#212c46] text-white">
                  <tr className="border-b-2 border-[#b7a159]">
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('PRODUCT', 'ชื่อสินค้า')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('TYPE', 'ประเภท')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('QTY', 'ยอดขาย')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('TOTAL COST', 'ราคาต้นทุนรวม')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('TOTAL REVENUE', 'มูลค่าขายรวม')}</th>
                  </tr>
                </thead>
              )}
              {activeTab === 'CATEGORY' && (
                <thead className="bg-[#212c46] text-white">
                  <tr className="border-b-2 border-[#b7a159]">
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('CATEGORY', 'หมวดหมู่สินค้า')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('QTY', 'ยอดขาย')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('TOTAL COST', 'ราคาต้นทุนรวม')}</th>
                    <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('TOTAL REVENUE', 'มูลค่าขายรวม')}</th>
                  </tr>
                </thead>
              )}
              {activeTab === 'COMPARISON' && (
                <thead className="bg-[#212c46] text-white select-none">
                  <tr className="border-b border-[#b7a159]/40">
                    <th rowSpan={2} className="px-4 py-3 text-[12px] font-black tracking-wider uppercase text-center border-r border-[#b7a159]/20 align-middle whitespace-nowrap bg-[#212c46]">{t('TYPE', 'ประเภท')}</th>
                    <th rowSpan={2} className="px-4 py-3 text-[12px] font-black tracking-wider uppercase text-left border-r border-[#b7a159]/20 align-middle min-w-[200px] whitespace-nowrap bg-[#212c46]">{t('PRODUCT', 'ชื่อสินค้า')}</th>
                    {COMPARISON_MONTHS.map(m => (
                      <th key={m} colSpan={2} className="px-4 py-1.5 text-[12px] font-black tracking-wider text-center border-r border-[#b7a159]/20 bg-[#2d3a5a] whitespace-nowrap">
                        {m}
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b-2 border-[#b7a159] bg-[#1d273f]">
                    {COMPARISON_MONTHS.map(m => (
                      <React.Fragment key={'sub-' + m}>
                        <th className="px-3 py-1 text-[12px] font-extrabold text-center border-r border-[#b7a159]/10 text-cyan-200/90 whitespace-nowrap uppercase tracking-tight">
                          {t('Qty (pcs)', 'ยอดขาย (ชิ้น)')}
                        </th>
                        <th className="px-3 py-1 text-[12px] font-extrabold text-center border-r border-[#b7a159]/10 text-amber-200/90 whitespace-nowrap uppercase tracking-tight">
                          {t('Value (฿)', 'มูลค่าขาย (บาท)')}
                        </th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-[#eaeaec] bg-white">
                {activeTab === 'COMPARISON' ? (
                  filteredComparisonProducts.length === 0 ? (
                    <tr>
                      <td colSpan={18} className="px-4 py-20 text-center text-[#7a8b95] font-black uppercase tracking-widest text-[12px]">
                        {t('No Matching Products Found', 'ไม่พบรายชื่อสินค้าตามการค้นหา')}
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {comparisonPaginated.map((prod, idx) => {
                        const globalIdx = (currentPage - 1) * rowsPerPage + idx;
                        return (
                          <motion.tr
                            key={prod.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hover:bg-[#f8f9fa] transition-colors border-b border-[#eaeaec]"
                          >
                            <td className="px-4 py-2.5 text-[12px] font-black text-[#5e6a75] text-center bg-[#f1f3f5] border-r border-[#eaeaec] whitespace-nowrap">{prod.category}</td>
                            <td className="px-4 py-2.5 text-[12px] font-black text-[#212c46] border-r border-[#eaeaec] truncate max-w-[220px] whitespace-nowrap" title={prod.name}>{prod.name}</td>
                            {COMPARISON_MONTHS.map(m => {
                              const cell = prod.months[m] || { qty: null, val: null };
                              const isEditingQty = editingCell && editingCell.productIndex === globalIdx && editingCell.month === m && editingCell.type === 'qty';
                              const isEditingVal = editingCell && editingCell.productIndex === globalIdx && editingCell.month === m && editingCell.type === 'val';

                              return (
                                <React.Fragment key={m}>
                                  {/* QTY CELL */}
                                  <td 
                                    className="px-2 py-1.5 text-center border-r border-[#eaeaec] cursor-pointer hover:bg-cyan-50/50 transition-colors group/cell min-w-[75px]"
                                    onClick={() => setEditingCell({ productIndex: globalIdx, month: m, type: 'qty' })}
                                  >
                                    {isEditingQty ? (
                                      <input
                                        type="text"
                                        defaultValue={cell.qty !== null ? cell.qty.toString() : ''}
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleCellEdit(idx, m, 'qty', e.currentTarget.value);
                                            setEditingCell(null);
                                          } else if (e.key === 'Escape') {
                                            setEditingCell(null);
                                          }
                                        }}
                                        onBlur={(e) => {
                                          handleCellEdit(idx, m, 'qty', e.currentTarget.value);
                                          setEditingCell(null);
                                        }}
                                        className="w-full text-center text-[12px] font-mono font-bold text-[#212c46] border border-[#cbd5e1] rounded px-1 py-0.5 outline-none bg-white shadow-sm"
                                      />
                                    ) : (
                                      <span className="text-[12px] font-mono font-semibold text-slate-700">
                                        {cell.qty !== null ? cell.qty.toLocaleString() : '-'}
                                      </span>
                                    )}
                                  </td>

                                  {/* VAL CELL */}
                                  <td 
                                    className="px-2 py-1.5 text-right border-r border-[#eaeaec] cursor-pointer hover:bg-amber-50/50 transition-colors group/cell min-w-[95px]"
                                    onClick={() => setEditingCell({ productIndex: globalIdx, month: m, type: 'val' })}
                                  >
                                    {isEditingVal ? (
                                      <input
                                        type="text"
                                        defaultValue={cell.val !== null ? cell.val.toString() : ''}
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleCellEdit(idx, m, 'val', e.currentTarget.value);
                                            setEditingCell(null);
                                          } else if (e.key === 'Escape') {
                                            setEditingCell(null);
                                          }
                                        }}
                                        onBlur={(e) => {
                                          handleCellEdit(idx, m, 'val', e.currentTarget.value);
                                          setEditingCell(null);
                                        }}
                                        className="w-full text-right text-[12px] font-mono font-bold text-[#b58c4f] border border-[#cbd5e1] rounded px-1 py-0.5 outline-none bg-white shadow-sm"
                                      />
                                    ) : (
                                      <span className="text-[12px] font-mono font-bold text-[#6b8e23]">
                                        {cell.val !== null ? cell.val.toLocaleString() : '-'}
                                      </span>
                                    )}
                                  </td>
                                </React.Fragment>
                              );
                            })}
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  )
                ) : (
                  groupedData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-20 text-center text-[#7a8b95] font-black uppercase tracking-widest text-[12px]">
                        {t('No Active Records Found', 'ไม่พบรายชื่อบันทึกข้อมูล')}
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {paginatedData.map((row, idx) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                          key={idx} 
                          className="hover:bg-[#f8f9fa] transition-colors group cursor-default"
                        >
                          {activeTab === 'ALL' ? (
                            <>
                              <td className="px-4 py-2.5 text-[12px] font-black text-[#212c46] whitespace-nowrap">
                                {(()=>{
                                  const rawDate = row[mapping.dateCol] || row['Date'] || row['วันที่'];
                                  if (!rawDate) return '-';
                                  const d = getParsedDate(rawDate);
                                  if (!d || isNaN(d.getTime())) return String(rawDate);
                                  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                                })()}
                              </td>
                              <td className="px-4 py-2.5 text-[12px] font-black text-[#b58c4f] whitespace-nowrap">{row['ประเภท'] || '-'}</td>
                              <td className="px-4 py-2.5 text-[12px] font-black text-[#212c46] whitespace-nowrap max-w-[250px] truncate">{row[mapping.productCol] || '-'}</td>
                              <td className="px-4 py-2.5 text-[12px] font-mono font-medium text-[#7a8b95] text-right whitespace-nowrap">{row['ราคาทุน'] || '-'}</td>
                              <td className="px-4 py-2.5 text-[12px] font-mono font-medium text-[#7a8b95] text-right whitespace-nowrap">{row['ราคาขาย'] || '-'}</td>
                              <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                 <span className="bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1 rounded-md text-[12px] font-black text-[#4d87a8]">{row['ยอดขาย (ชิ้น)'] || '-'}</span>
                              </td>
                              <td className="px-4 py-2.5 text-[12px] font-black text-[#0ea5e9] text-right whitespace-nowrap font-mono">{row[mapping.revenueCol] || '-'}</td>
                            </>
                          ) : activeTab === 'ITEM' ? (
                            <>
                             <td className="px-4 py-2.5 text-[12px] font-black text-[#212c46] whitespace-nowrap max-w-[250px] truncate">{row.name}</td>
                             <td className="px-4 py-2.5 text-[12px] font-black text-[#b58c4f] whitespace-nowrap">{row.type}</td>
                             <td className="px-4 py-2.5 text-right whitespace-nowrap"><span className="bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1 rounded-md text-[12px] font-black text-[#4d87a8]">{row.qty}</span></td>
                             <td className="px-4 py-2.5 text-[12px] font-mono font-medium text-[#7a8b95] text-right whitespace-nowrap">{formatCurrency(row.cost)}</td>
                             <td className="px-4 py-2.5 text-[12px] font-black text-[#0ea5e9] text-right whitespace-nowrap font-mono">{formatCurrency(row.revenue)}</td>
                            </>
                          ) : (
                            <>
                             <td className="px-4 py-2.5 text-[12px] font-black text-[#b58c4f] whitespace-nowrap">{row.name}</td>
                             <td className="px-4 py-2.5 text-right whitespace-nowrap"><span className="bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1 rounded-md text-[12px] font-black text-[#4d87a8]">{row.qty}</span></td>
                             <td className="px-4 py-2.5 text-[12px] font-mono font-medium text-[#7a8b95] text-right whitespace-nowrap">{formatCurrency(row.cost)}</td>
                             <td className="px-4 py-2.5 text-[12px] font-black text-[#0ea5e9] text-right whitespace-nowrap font-mono">{formatCurrency(row.revenue)}</td>
                            </>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-3 bg-[#f0eae1]/80 border-t-[1.5px] border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-6 text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                      <span>{t('Display Rows:', 'แถวที่แสดง:')}</span>
                      <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#eaeaec] rounded-lg px-3 py-1.5 outline-none font-black text-[#212c46] cursor-pointer shadow-sm">
                          {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                  </div>
                  <p className="bg-white px-4 py-2 rounded-xl border border-[#eaeaec] shadow-sm">{t('Total Records:', 'บันทึกรวมทั้งหมด:')} {activeTab === 'COMPARISON' ? filteredComparisonProducts.length : groupedData.length}</p>
              </div>
              <div className="flex items-center gap-3">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-lg flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white shadow-md active:scale-90'}`}>
                      <ChevronLeft size={16}/>
                  </button>
                  <div className="bg-[#212c46] text-white px-6 py-2 rounded-lg shadow-md font-black text-[11px] min-w-[120px] text-center uppercase tracking-widest">
                      {t('Page', 'หน้า')} {currentPage} / {totalPages || 1}
                  </div>
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-lg flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white shadow-md active:scale-90'}`}>
                      <ChevronRight size={16}/>
                  </button>
              </div>
          </div>

        </div>
      </div>

      {/* Upload Modal */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customHeader={
            <div className="bg-[#212c46] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-[#d7d7d7] flex items-center justify-center border border-white/20 shadow-sm">
                        <Upload size={16} />
                    </div>
                    <div>
                        <h3 className="text-[12px] font-black text-[#d7d7d7] uppercase tracking-widest leading-none">{t('Import Sale Revenue Data', 'นำเข้าข้อมูลรายได้การขาย')}</h3>
                        <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1">{t('Upload CSV or XLSX', 'อัปโหลดไฟล์ CSV หรือ XLSX')}</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-[#932c2e] transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full"><X size={16} /></button>
            </div>
        }
        width="max-w-2xl"
      >
        <div className="p-6 bg-white min-h-[300px]">
          <CsvUpload
            onUpload={handleUpload}
            requiredHeaders={['mm/dd/yyyy', 'ประเภท', 'ชื่อสินค้า', 'ราคาทุน', 'ราคาขาย', 'ยอดขาย (ชิ้น)', 'มูลค่าขาย(บาท)']}
            instructions={[
              t("Import Excel (.xlsx) or CSV (Sale Revenue)", "นำเข้าไฟล์ Excel (.xlsx) หรือ CSV (Sale Revenue)"),
              t("First row must be the columns table header", "บรรทัดแรกต้องเป็นชื่อคอลัมน์ (Header)"),
              t("Verify numeric accuracy before submission", "ตรวจสอบความถูกต้องของตัวเลขและข้อมูลสำคัญก่อนนำเข้า")
            ]}
          />
        </div>
      </DraggableModal>
    </div>
  );
}

