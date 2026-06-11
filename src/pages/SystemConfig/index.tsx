import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { 
  Settings2, 
  Building2, 
  Layers, 
  Tag, 
  Users, 
  Printer, 
  Barcode, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Database, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Award, 
  Zap, 
  Globe, 
  Bell, 
  LogOut, 
  ChevronDown, 
  Check,
  LayoutGrid,
  FileText,
  Handshake,
  ShieldCheck,
  Key
} from 'lucide-react';
import * as Icons from 'lucide-react';

// --- Theme Configuration (Synced with Home Palette) ---
const THEME = {
  bgMain: '#f3f3f1',
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
  glassWhite: 'rgba(255, 255, 255, 0.88)',
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#932c2e',
  skyBlue: '#3f809e',
  dustyBlue: '#7a8b95',
  indigo: '#414757',
  softPurple: '#ab7d82',
  deepPurple: '#2d2c4a',
  pinkAccent: '#a54f6b',
  mutedSlate: '#606a5f',
  darkSlate: '#2f2926',
  silver: '#d7d7d7',
  deepNavy: '#212c46',
  brownGold: '#b58c4f',
  vibrantPurple: '#2d2c4a',
  burntOrange: '#d96245',
  slateBlue: '#748ea1',
  coolGray: '#eaeaec'
};

// --- Mock Data ---
const INITIAL_DATA = {
  departments: [
    { id: 1, name: 'Management', code: 'MGT' },
    { id: 2, name: 'Human Resources', code: 'HR' },
    { id: 3, name: 'Information Technology', code: 'IT' },
    { id: 4, name: 'Production', code: 'PROD' },
    { id: 5, name: 'Quality Assurance', code: 'QA' },
    { id: 6, name: 'Quality Control', code: 'QC' },
    { id: 7, name: 'Warehouse', code: 'WH' },
  ],
  categories: [
    { id: 1, name: 'Sausage' },
    { id: 2, name: 'Meatball' },
    { id: 3, name: 'Bologna' },
    { id: 4, name: 'Ham' },
    { id: 5, name: 'Sliced' },
    { id: 6, name: 'Loaf' },
    { id: 7, name: 'Batter' },
    { id: 8, name: 'SFG' },
    { id: 9, name: 'NPD' },
  ],
  brands: [
    { id: 1, name: 'AFM' },
    { id: 2, name: 'CJ' },
    { id: 3, name: 'ARO' },
    { id: 4, name: 'MAKRO' },
    { id: 5, name: 'Betagro' },
    { id: 6, name: 'Generic' },
    { id: 7, name: 'No Brand' },
    { id: 8, name: 'Internal' },
    { id: 9, name: 'Test' },
  ],
  customers: [
    { id: 1, name: 'Makro' },
    { id: 2, name: 'CP All' },
    { id: 3, name: 'Lotus' },
    { id: 4, name: 'Big C' },
    { id: 5, name: 'Tops' },
    { id: 6, name: 'Foodland' },
    { id: 7, name: 'MaxValu' },
    { id: 8, name: 'CJ Express' },
  ],
  pdfTemplates: [
    { id: 1, name: 'DAR FORM', dept: 'DC CENTER', code: 'FM-DC01-01', revision: 'REV. 02' },
    { id: 2, name: 'DESTRUCTION REPORT', dept: 'DC CENTER', code: 'FM-DC03-01', revision: 'REV. 01' },
    { id: 3, name: 'DISTRIBUTION REPORT', dept: 'DC CENTER', code: 'FM-DC04-01', revision: 'REV. 01' },
  ],
  idFormats: [
    {
      id: 1,
      pages: ['Plan from Planning', 'Production Planning'],
      prefix: 'PL',
      format: 'YYMMDD',
      sequenceDigit: 3,
      reset: 'Daily',
      note: 'Replacement format: PLYYMMDD/R.1'
    },
    {
      id: 2,
      pages: ['Daily Problem'],
      prefix: 'DF',
      format: 'YYMMDD',
      sequenceDigit: 3,
      reset: 'Daily',
      note: ''
    }
  ]
};

const TABS = [
  { id: 'departments', label: 'Departments', icon: 'Building2', title: 'Departments Registry', desc: 'Manage organizational units and coding structures.' },
  { id: 'categories', label: 'Category & Sub-Cat', icon: 'Layers', title: 'Categories', desc: 'Manage product classification and groupings.' },
  { id: 'brands', label: 'Brand', icon: 'Tag', title: 'Brands', desc: 'Manage manufacturing and OEM branding.' },
  { id: 'customers', label: 'Customer', icon: 'Users', title: 'Customers', desc: 'Manage external client and partner profiles.' },
  { id: 'pdfTemplates', label: 'PDF Templates', icon: 'Printer', title: 'PDF FORM TEMPLATES', desc: 'Configure official document layouts and compliance headers.' },
  { id: 'idFormats', label: 'ID Formats', icon: 'Barcode', title: 'ID FORMAT CONFIG', desc: 'Define auto-generation rules for system identifiers.' },
  { id: 'mappingConfig', label: 'Data Mapping', icon: 'Settings2', title: 'IMPORT DATA MAPPING', desc: 'Configure column mappings between imported Excel files and system.' }
];

const AVAILABLE_PAGES = ['Plan from Planning', 'Production Planning', 'Daily Problem', 'Master Item', 'Equipment Registry', 'STD Process'];

// --- Helper Components ---
const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    if (!name) return null;
    const IconComponent = Icons[name as keyof typeof Icons] || Icons.CircleHelp;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2} />;
};

const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={20} />
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

// --- User Guide Panel ---
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Settings2 size={22} className="text-[#b7a159]"/> CONFIG GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">System Master Data Configuration</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Database size={18} className="text-[#b7a159]"/> 1. Master Data Management
            </h4>
            <div className="space-y-3 text-[12px] text-[#414757] font-normal leading-relaxed">
              <p>หน้านี้คือศูนย์กลางการควบคุมข้อมูลพื้นฐานของระบบ (Global Master Data Node) สำหรับใช้งานร่วมกันทุกโมดูล</p>
              <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4d87a8] mt-1.5 shrink-0"></div>
                    <div><strong className="text-[#4d87a8]">Departments:</strong> กำหนดรหัสแผนกเพื่อใช้จัดหมวดหมู่พนักงาน การอนุมัติ และสิทธิ์การเข้าถึง</div>
                </li>
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d96245] mt-1.5 shrink-0"></div>
                    <div><strong className="text-[#d96245]">Categories & Brands:</strong> จัดกลุ่มสินค้าหลักและจัดการแบรนด์สินค้า (ทั้งแบรนด์ภายในและ OEM) เพื่อความแม่นยำในการทำรายงาน Inventory และ Sales</div>
                </li>
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#657f4d] mt-1.5 shrink-0"></div>
                    <div><strong className="text-[#657f4d]">Customers:</strong> ฐานข้อมูลคู่ค้าหลักสำหรับการอ้างอิงใบสั่งซื้อและระบบการจัดส่ง</div>
                </li>
              </ul>
            </div>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Barcode size={18} className="text-[#3f809e]"/> 2. ID Generation Rules
            </h4>
            <p className="text-[12px] text-[#414757] leading-relaxed mb-3">
              กำหนดรูปแบบรหัสเอกสารอัตโนมัติ (Document Auto-Numbering) ในระบบ คุณสามารถตั้งค่าตัวแปรดังนี้:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#212c46]">Prefix:</strong> ตัวอักษรคำนำหน้าเอกสาร เช่น PO, PR, INV</li>
                <li><strong className="text-[#212c46]">Date Format:</strong> รูปแบบวันที่ที่ต้องการแทรก (เช่น YYMMDD, YYYYMM)</li>
                <li><strong className="text-[#212c46]">Sequence Digits:</strong> จำนวนหลักของตัวเลขรันนิ่งลำดับ เช่น 3 หลัก คือ 001</li>
                <li><strong className="text-[#212c46]">Reset Cycle:</strong> รอบในการเริ่มนับ 1 ใหม่ (เช่น รีเซ็ตรายวัน, รายเดือน)</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Printer size={18} className="text-[#ca649f]"/> 3. PDF Compliance Header
            </h4>
            <p className="text-[12px] text-[#414757] leading-relaxed">
              จัดการ Header ข้อมูลในฟอร์ม PDF มาตรฐาน ISO/GMP โดยคุณสามารถกำหนดเลขที่ฟอร์ม (Form Code) และครั้งที่แก้ไข (Revision) เพื่อให้เอกสารที่ถูก Print ออกจากระบบมีความถูกต้องตามมาตรฐานการควบคุมเอกสารขององค์กร
            </p>
          </section>

          <div className="p-4 bg-[#932c2e]/10 rounded-xl border border-[#932c2e]/30 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
             <div className="flex gap-3 items-start">
                <AlertTriangle size={18} className="text-[#932c2e] shrink-0 mt-0.5" />
                <p className="text-[12px] font-bold text-[#212c46] leading-relaxed">
                  <strong className="text-[#932c2e]">ข้อควรระวัง:</strong> การลบข้อมูล Master Data ที่มีการผูกกับข้อมูล Transaction ไปแล้ว (เช่น ลบแผนกที่มีพนักงานอยู่) อาจส่งผลให้รายงานและข้อมูลย้อนหลังแสดงผลผิดพลาด โปรดตรวจสอบให้แน่ใจก่อนทำการลบ
                </p>
             </div>
          </div>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]">รับทราบ (Got it)</button>
        </div>
      </div>
    </>,
    document.body
  );
}

function MappingConfigView() {
  const [saleMapping, setSaleMapping] = useState(() => {
    const saved = localStorage.getItem('saleRevenueMapping');
    if (saved) return JSON.parse(saved);
    return { dateCol: 'mm/dd/yyyy', productCol: 'ชื่อสินค้า', revenueCol: 'มูลค่าขาย(บาท)' };
  });

  const [costMapping, setCostMapping] = useState(() => {
    const saved = localStorage.getItem('costExpenseMapping');
    if (saved) return JSON.parse(saved);
    return { dateCol: 'mm/dd/yyyy', laborCol: 'ค่าแรง (บาท)', totalCol: 'TOTAL' };
  });

  const handleSaveSale = () => {
    localStorage.setItem('saleRevenueMapping', JSON.stringify(saleMapping));
    alert('Sale Revenue Mapping Saved! Please reload the Sale Revenue page to see changes.');
  };

  const handleSaveCost = () => {
    localStorage.setItem('costExpenseMapping', JSON.stringify(costMapping));
    alert('Cost & Expense Mapping Saved! Please reload the Cost & Expense page to see changes.');
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#f8f9fa] flex flex-col gap-8">
       {/* Sale Revenue Settings */}
       <div className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
           <div>
               <h3 className="text-lg font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3"><Tag size={20} className="text-[#3f809e]" /> Sale Revenue Data Mapping</h3>
               <p className="text-[12px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1">Configure columns for sale revenue imported files</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               <div>
                   <label className="text-[11px] font-black text-[#212c46] block mb-2 uppercase tracking-tight">Date Field</label>
                   <input type="text" value={saleMapping.dateCol} onChange={e => setSaleMapping({...saleMapping, dateCol: e.target.value})} className="w-full bg-white border border-[#eaeaec] text-[#212c46] px-4 py-2 text-[12px] rounded-lg font-black outline-none focus:border-[#3f809e] shadow-sm" />
               </div>
               <div>
                   <label className="text-[11px] font-black text-[#212c46] block mb-2 uppercase tracking-tight">Product Field</label>
                   <input type="text" value={saleMapping.productCol} onChange={e => setSaleMapping({...saleMapping, productCol: e.target.value})} className="w-full bg-white border border-[#eaeaec] text-[#212c46] px-4 py-2 text-[12px] rounded-lg font-black outline-none focus:border-[#3f809e] shadow-sm" />
               </div>
               <div>
                   <label className="text-[11px] font-black text-[#212c46] block mb-2 uppercase tracking-tight">Revenue Field</label>
                   <input type="text" value={saleMapping.revenueCol} onChange={e => setSaleMapping({...saleMapping, revenueCol: e.target.value})} className="w-full bg-white border border-[#eaeaec] text-[#212c46] px-4 py-2 text-[12px] rounded-lg font-black outline-none focus:border-[#3f809e] shadow-sm" />
               </div>
           </div>
           <div className="flex justify-end pt-2 border-t border-[#eaeaec]">
               <button onClick={handleSaveSale} className="bg-[#3f809e] hover:bg-[#2d5f75] text-white px-6 py-2.5 rounded-xl font-black text-[12px] tracking-widest uppercase flex items-center gap-2 shadow-md transition-all active:scale-95">
                   <Save size={16} /> Save Sale Mapping
               </button>
           </div>
       </div>

       {/* Cost & Expense Settings */}
       <div className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
           <div>
               <h3 className="text-lg font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3"><Layers size={20} className="text-[#a94228]" /> Cost & Expense Data Mapping</h3>
               <p className="text-[12px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1">Configure columns for execution imported files</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               <div>
                   <label className="text-[11px] font-black text-[#212c46] block mb-2 uppercase tracking-tight">Date Field</label>
                   <input type="text" value={costMapping.dateCol} onChange={e => setCostMapping({...costMapping, dateCol: e.target.value})} className="w-full bg-white border border-[#eaeaec] text-[#212c46] px-4 py-2 text-[12px] rounded-lg font-black outline-none focus:border-[#a94228] shadow-sm" />
               </div>
               <div>
                   <label className="text-[11px] font-black text-[#212c46] block mb-2 uppercase tracking-tight">Labor Cost Field</label>
                   <input type="text" value={costMapping.laborCol} onChange={e => setCostMapping({...costMapping, laborCol: e.target.value})} className="w-full bg-white border border-[#eaeaec] text-[#212c46] px-4 py-2 text-[12px] rounded-lg font-black outline-none focus:border-[#a94228] shadow-sm" />
               </div>
               <div>
                   <label className="text-[11px] font-black text-[#212c46] block mb-2 uppercase tracking-tight">Total Field</label>
                   <input type="text" value={costMapping.totalCol} onChange={e => setCostMapping({...costMapping, totalCol: e.target.value})} className="w-full bg-white border border-[#eaeaec] text-[#212c46] px-4 py-2 text-[12px] rounded-lg font-black outline-none focus:border-[#a94228] shadow-sm" />
               </div>
           </div>
           <div className="flex justify-end pt-2 border-t border-[#eaeaec]">
               <button onClick={handleSaveCost} className="bg-[#a94228] hover:bg-[#7e311e] text-white px-6 py-2.5 rounded-xl font-black text-[12px] tracking-widest uppercase flex items-center gap-2 shadow-md transition-all active:scale-95">
                   <Save size={16} /> Save Cost Mapping
               </button>
           </div>
       </div>
    </div>
  );
}

// --- Main Component ---
export default function SystemConfig() {
  const [activeTab, setActiveTab] = useState('departments'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [data, setData] = useState<any>(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); 
  const [formData, setFormData] = useState<any>({ 
      name: '', code: '', dept: '', revision: '', 
      pages: [], prefix: '', format: 'YYMMDD', sequenceDigit: 3, reset: 'Daily', note: '' 
  });

  const activeTabData: any = TABS.find(t => t.id === activeTab);
  const currentList = data[activeTab] || [];

  const filteredList = useMemo(() => {
      return currentList.filter((item: any) => {
          const s = search.toLowerCase();
          if (activeTab === 'idFormats') {
              return (item.prefix?.toLowerCase().includes(s) || 
                      item.pages?.join(',').toLowerCase().includes(s));
          }
          return (item.name?.toLowerCase().includes(s) || 
                  item.code?.toLowerCase().includes(s) || 
                  item.dept?.toLowerCase().includes(s));
      });
  }, [currentList, search, activeTab]);

  const paginatedData = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); setSearch(''); }, [activeTab]);

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : { 
      name: '', code: '', dept: '', revision: '',
      pages: [], prefix: '', format: 'YYMMDD', sequenceDigit: 3, reset: 'Daily', note: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    if (editingItem) {
      setData((prev: any) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item: any) => item.id === editingItem.id ? { ...item, ...formData } : item)
      }));
    } else {
      const newId = currentList.length > 0 ? Math.max(...currentList.map((i: any) => i.id)) + 1 : 1;
      setData((prev: any) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { id: newId, ...formData }]
      }));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: any) => {
    if(window.confirm('Are you sure you want to delete this configuration?')) {
      setData((prev: any) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item: any) => item.id !== id)
      }));
    }
  };

  const togglePageSelection = (page: string) => {
      setFormData((prev: any) => {
          const pages = prev.pages || [];
          if (pages.includes(page)) return { ...prev, pages: pages.filter((p: string) => p !== page) };
          return { ...prev, pages: [...pages, page] };
      });
  };

  return (
    <div className="flex flex-1 w-full flex-col pb-5 animate-fadeIn bg-transparent space-y-6">
      
      {/* USER GUIDE TAB BUTTON */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION */}
      <div className="h-14 px-4 sm:px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Settings2 size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h1 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                      CONFIG <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">CENTER</span>
                  </h1>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      GLOBAL MASTER DATA & SYSTEM CONFIGURATION NODE
                  </p>
              </div>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3 bg-[#212c46] text-white px-5 py-2.5 rounded-xl shadow-lg border border-[#b7a159]/30">
                  <ShieldCheck size={16} />
                  <div className="text-[10px] font-black font-mono tracking-widest uppercase">
                      Admin Access Verified
                  </div>
              </div>
          </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="w-full px-4 sm:px-8 mt-[2px] pb-6">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 shrink-0">
                <KpiCard label="Total Records" value={filteredList.length} icon="Database" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc={`Active in ${activeTabData.label}`} />
                <KpiCard label="System Node" value={activeTab.charAt(0).toUpperCase() + activeTab.slice(1, 5)} icon="LayoutGrid" colorAccent={THEME.accent} colorValue={THEME.primary} desc="Master Data Module" />
                <KpiCard label="Last Modified" value="Now" icon="Clock" colorAccent={THEME.gold} colorValue={THEME.primary} desc={new Date().toLocaleTimeString()} />
                <KpiCard label="Sync Status" value="Active" icon="CheckCircle" colorAccent={THEME.success} colorValue={THEME.success} desc="Database Connected" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* SIDEBAR TABS */}
                <div className="lg:col-span-3 space-y-2 bg-white/90 p-6 rounded-3xl border border-[#eaeaec] shadow-lg h-fit">
                    <p className="text-[12px] font-black text-[#212c46] uppercase tracking-widest mb-4 border-b-2 border-[#b7a159] pb-2">Control Nodes</p>
                    {TABS.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${activeTab === tab.id ? 'bg-[#212c46] text-white shadow-md' : 'bg-white text-[#7a8b95] hover:bg-[#f8f9fa] hover:text-[#a94228] border border-[#eaeaec]'}`}
                        >
                            <div className={`p-2 rounded-xl shrink-0 ${activeTab === tab.id ? 'bg-[#b7a159]/20 text-[#b7a159]' : 'bg-[#f8f9fa] text-[#4d87a8] border border-[#eaeaec]'}`}>
                                <LucideIcon name={tab.icon} size={18} />
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className={`text-[13px] font-black uppercase tracking-tight truncate ${activeTab === tab.id ? 'text-[#d7d7d7]' : 'text-[#212c46]'}`}>{tab.label}</p>
                                <p className={`text-[11px] font-bold uppercase tracking-widest mt-0.5 truncate ${activeTab === tab.id ? 'text-[#b7a159]' : 'text-[#7a8b95]'}`}>
                                   {tab.id === 'mappingConfig' ? '2 Modules' : `${(data[tab.id] || []).length} Items`}
                                </p>
                            </div>
                            {activeTab === tab.id && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#b7a159] shadow-[0_0_8px_#b7a159]"></div>}
                        </button>
                    ))}
                </div>

                {/* CONTENT LIST */}
                <div className="lg:col-span-9 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn min-h-[500px]">
                    {activeTab === 'mappingConfig' ? (
                        <MappingConfigView />
                    ) : (
                      <>
                        <div className="px-8 py-5 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h4 className="text-[18px] font-black uppercase text-[#212c46] tracking-tight flex items-center gap-3">
                                    <LucideIcon name={activeTabData?.icon} size={22} className="text-[#b7a159]"/> {activeTabData?.title}
                                </h4>
                                <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1">{activeTabData?.desc}</p>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                    <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder={`Search ${activeTabData?.label}...`} className="w-full pl-12 pr-4 py-2.5 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                                </div>
                                <button onClick={() => handleOpenModal()} className="bg-[#212c46] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#212c46]">
                                    <Plus size={16} /> New Record
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar flex-1">
                            <table className="w-full text-left font-sans border-collapse">
                                <thead className="bg-[#212c46] border-b-2 border-[#b7a159] text-white uppercase tracking-widest text-[12px] font-black sticky top-0 z-10">
                                    <tr>
                                        {activeTab === 'idFormats' ? (
                                            <>
                                                <th className="py-4 px-6 whitespace-nowrap text-[12px]">Pages</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Prefix</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Format</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Rule</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Actions</th>
                                            </>
                                        ) : activeTab === 'pdfTemplates' ? (
                                            <>
                                                <th className="py-4 px-6 whitespace-nowrap text-[12px]">Template</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Department</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Code</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Revision</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Actions</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="py-4 px-6 whitespace-nowrap text-[12px]">Identification</th>
                                                {activeTab === 'departments' && <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Sys Code</th>}
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Status</th>
                                                <th className="py-4 px-6 text-center whitespace-nowrap text-[12px]">Actions</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#eaeaec]">
                                    {paginatedData.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                            {activeTab === 'idFormats' ? (
                                                <>
                                                    <td className="py-3 px-6 text-[12px]">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {item.pages?.map((p: any, i: any) => (
                                                                <span key={i} className="px-2.5 py-1 bg-[#212c46]/5 text-[#212c46] rounded-lg text-[11px] font-black border border-[#eaeaec] uppercase">{p}</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-6 text-center font-black text-[#4d87a8] text-[12px] font-mono">{item.prefix}</td>
                                                    <td className="py-3 px-6 text-center text-[12px]">
                                                        <span className="bg-[#f8f9fa] text-[#212c46] px-3 py-1.5 rounded-lg font-mono font-black text-[12px] border border-[#eaeaec]">{item.format}</span>
                                                    </td>
                                                    <td className="py-3 px-6 text-center text-[12px]">
                                                        <p className="text-[12px] font-black text-[#212c46]">{item.sequenceDigit} Digits</p>
                                                        <p className="text-[11px] font-bold text-[#7a8b95] uppercase mt-0.5">{item.reset} Reset</p>
                                                    </td>
                                                </>
                                            ) : activeTab === 'pdfTemplates' ? (
                                                <>
                                                    <td className="py-3 px-6 font-black text-[#212c46] text-[12px] uppercase tracking-tight">{item.name}</td>
                                                    <td className="py-3 px-6 text-center font-bold text-[#7a8b95] text-[12px] uppercase tracking-widest">{item.dept}</td>
                                                    <td className="py-3 px-6 text-center font-mono font-black text-[#212c46] text-[12px]">{item.code}</td>
                                                    <td className="py-3 px-6 text-center font-black text-[#d96245] text-[12px]">{item.revision}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="py-3 px-6 text-[12px]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-[#b7a159] shrink-0"></div>
                                                            <span className="font-black text-[#212c46] text-[12px] uppercase tracking-tight">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    {activeTab === 'departments' && <td className="py-3 px-6 text-center font-mono font-black text-[#4d87a8] text-[12px]">{item.code}</td>}
                                                    <td className="py-3 px-6 text-center text-[12px]">
                                                       <span className="px-3 py-1 bg-[#657f4d]/10 text-[#657f4d] border border-[#657f4d]/20 rounded-full text-[11px] font-black uppercase tracking-widest">Active</span>
                                                    </td>
                                                </>
                                            )}
                                            <td className="py-3 px-6 text-center text-[12px]">
                                                <div className="flex justify-center items-center gap-[0.5px]">
                                                    <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#eaeaec] text-[#4d87a8] hover:border-[#212c46] hover:text-[#a94228] hover:bg-[#212c46]/5 transition-all shadow-sm bg-white active:scale-90" title="Edit">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#eaeaec] text-[#932c2e] hover:border-[#932c2e] hover:bg-[#932c2e]/10 transition-all shadow-sm bg-white active:scale-90" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="px-8 py-3 bg-[#f8f9fa] border-t-[1.5px] border-slate-300 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-6 text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                                <div className="flex items-center gap-3">
                                    <span>Display Rows:</span>
                                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#eaeaec] rounded-lg px-3 py-1.5 outline-none font-black text-[#212c46] cursor-pointer shadow-sm">
                                        {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <p className="bg-white px-4 py-2 rounded-xl border border-[#eaeaec] shadow-sm">Total Records: {filteredList.length}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 border border-[#eaeaec] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white shadow-md active:scale-90'}`}>
                                    <ChevronLeft size={18}/>
                                </button>
                                <div className="bg-[#212c46] text-white px-8 py-2.5 rounded-xl shadow-md font-black text-[11px] min-w-[140px] text-center uppercase tracking-widest">
                                    Page {currentPage} / {totalPages || 1}
                                </div>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`w-10 h-10 border border-[#eaeaec] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white shadow-md active:scale-90'}`}>
                                    <ChevronRight size={18}/>
                                </button>
                            </div>
                        </div>
                      </>
                    )}
                </div>
            </div>
            
        </div>
      </div>

      {/* MODAL SYSTEM */}
      <DraggableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        width="max-w-2xl"
        customHeader={
            <div className="bg-[#212c46] px-6 py-4 flex justify-between items-center shrink-0 border-b-4 border-[#b7a159]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 text-[#b7a159] flex items-center justify-center border border-white/20 shadow-md backdrop-blur-md">
                        <LucideIcon name={activeTabData.icon} size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#d7d7d7] uppercase tracking-widest leading-none">{editingItem ? `Modify` : `Create`} {activeTabData.label}</h3>
                        <p className="text-[11px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1 flex items-center gap-2">
                          <Zap size={10} className="text-[#b7a159]" /> Strategic Config Node Management
                        </p>
                    </div>
                </div>
                <button onClick={()=>setIsModalOpen(false)} className="text-white/70 hover:text-[#932c2e] transition-all bg-white/10 hover:bg-white/20 p-2 rounded-full relative z-10 active:scale-90"><X size={18} /></button>
            </div>
        }
      >
             <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#f8f9fa]">
                <form id="configForm" onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm space-y-6">
                    {activeTab === 'idFormats' ? (
                      <div className="space-y-6">
                        <div>
                          <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Connect to System Pages <span className="text-[#932c2e]">*</span></label>
                          <div className="grid grid-cols-2 gap-3 bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec]">
                              {AVAILABLE_PAGES.map(page => (
                                  <label key={page} className="flex items-center gap-3 cursor-pointer group p-1">
                                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.pages.includes(page) ? 'bg-[#212c46] border-[#212c46] text-[#b7a159]' : 'bg-white border-[#eaeaec] group-hover:border-[#212c46]'}`} onClick={() => togglePageSelection(page)}>
                                          {formData.pages.includes(page) && <Check size={12} strokeWidth={4} />}
                                      </div>
                                      <span className="text-[12px] font-bold text-[#414757] uppercase tracking-tight group-hover:text-[#a94228] transition-colors">{page}</span>
                                  </label>
                              ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Prefix Header <span className="text-[#932c2e]">*</span></label>
                                <input type="text" required value={formData.prefix} onChange={(e) => setFormData({...formData, prefix: e.target.value.toUpperCase()})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] font-mono outline-none focus:border-[#b7a159] transition-all uppercase placeholder:opacity-30 shadow-sm" placeholder="e.g. PO" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Date Signature <span className="text-[#932c2e]">*</span></label>
                                <select required value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] transition-all font-mono cursor-pointer shadow-sm">
                                    <option value="YYMMDD">YYMMDD (Standard)</option>
                                    <option value="YYYYMMDD">YYYYMMDD (Extended)</option>
                                    <option value="YYMM">YYMM (Monthly)</option>
                                    <option value="YYYYMM">YYYYMM (Full Monthly)</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Sequence Digits <span className="text-[#932c2e]">*</span></label>
                                <input type="number" min="1" max="10" required value={formData.sequenceDigit} onChange={(e) => setFormData({...formData, sequenceDigit: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Reset Cycle <span className="text-[#932c2e]">*</span></label>
                                <select required value={formData.reset} onChange={(e) => setFormData({...formData, reset: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] transition-all cursor-pointer shadow-sm">
                                    <option value="Daily">Daily Reset</option>
                                    <option value="Monthly">Monthly Reset</option>
                                    <option value="Yearly">Yearly Reset</option>
                                    <option value="Never">Never Reset</option>
                                </select>
                            </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                            <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">{activeTab.slice(0, -1).toUpperCase()} Title/Name <span className="text-[#932c2e]">*</span></label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] transition-all uppercase shadow-sm" placeholder={`Enter ${activeTab.slice(0, -1)} description...`} />
                        </div>
                        {activeTab === 'departments' && (
                            <div>
                                <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">System Routing Code <span className="text-[#932c2e]">*</span></label>
                                <input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] font-mono outline-none focus:border-[#b7a159] transition-all uppercase shadow-sm" placeholder="e.g. FIN" />
                            </div>
                        )}
                        {activeTab === 'pdfTemplates' && (
                          <div className="grid grid-cols-3 gap-4">
                             <div className="col-span-2">
                                <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Form Code (ISO)</label>
                                <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] shadow-sm" placeholder="FM-XX-XX" />
                             </div>
                             <div>
                                <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Revision</label>
                                <input type="text" value={formData.revision} onChange={(e) => setFormData({...formData, revision: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] shadow-sm" placeholder="REV 00" />
                             </div>
                          </div>
                        )}
                      </div>
                    )}
                </form>
             </div>

             <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end items-center gap-3 shrink-0">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="px-6 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                <button type="submit" form="configForm" className="bg-[#212c46] text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2">
                    <Save size={14}/> Save Config
                </button>
             </div>
      </DraggableModal>
    </div>
  );
}
