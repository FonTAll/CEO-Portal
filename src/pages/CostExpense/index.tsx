import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CsvUpload } from '../../components/shared/CsvUpload';
import { api } from '../../services/api';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { BarChart3, Upload, Plus, List, Search, ChevronLeft, ChevronRight, Calculator, Activity, DollarSign, HelpCircle, X, LayoutGrid, Briefcase, Zap, Database, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

const THEME = {
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#932c2e',
  dustyBlue: '#7a8b95',
};

function UserGuidePanel({ isOpen, onClose, t }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><HelpCircle size={22} className="text-[#b7a159]"/> {t('COST & EXPENSE GUIDE', 'คู่มือต้นทุนและค่าใช้จ่าย')}</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">{t('Expense Management Hub', 'ระบบจัดทำรายการและวิเคราะห์ต้นทุน')}</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Upload size={18} className="text-[#b7a159]"/> {t('1. Data Import (CSV/Excel)', '1. นำเข้าข้อมูล (CSV/Excel)')}
            </h4>
            <div className="space-y-3 text-[12px] text-[#414757] font-normal leading-relaxed">
              <p>{t('You can import standard operational cost figures and electricity/water/gas utility worksheets.', 'สามารถนำเข้าข้อมูลค่าใช้จ่ายและค่าสาธารณูปโภคต่างๆ ด้วยโครงสร้างชีตที่กำหนด')}</p>
            </div>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Search size={18} className="text-[#3f809e]"/> {t('2. Advanced Filtering', '2. การค้นหาและกรองข้อมูล')}
            </h4>
            <p className="text-[12px] text-[#414757] leading-relaxed mb-3">
              {t('Utilize the header month-selector to dynamically reload statistics and keep historical trends pristine.', 'เลือกใช้แถบเดือนจากหัวข้อเพจเพื่อสรุปมูลค่าสะสมแบบแยกย่อยได้อย่างเป็นระเบียบ')}
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

export default function CostExpense() {
  const { t } = useLanguage();
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [mapping, setMapping] = useState(() => {
    const saved = localStorage.getItem('costExpenseMapping');
    if (saved) return JSON.parse(saved);
    return {
      dateCol: 'mm/dd/yyyy',
      headcountCol: 'จำนวนพนักงาน (คน)',
      laborCol: 'ค่าจ้างแรงงานรวม',
      waterCol: 'ค่าน้ำประปา',
      electricCol: 'ค่าไฟฟ้า',
      gasCol: 'ค่าแก๊ส/น้ำมัน',
      totalCol: 'ต้นทุนและค่าใช้จ่ายรวม'
    };
  });

  // Pull expense transactions from Google Sheets and Firebase database
  useEffect(() => {
    const loadExpenseData = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('read', 'CostExpense', null, { limit: 2000, offset: 0 });
        if (response && response.status === 'success' && response.data) {
          const items = response.data.items || [];
          setData(items);
          localStorage.setItem('costExpenseCache', JSON.stringify(items));
        } else {
          const cached = localStorage.getItem('costExpenseCache');
          if (cached) setData(JSON.parse(cached));
        }
      } catch (err) {
        console.error('Failed to load CostExpense from cloud, using cache:', err);
        const cached = localStorage.getItem('costExpenseCache');
        if (cached) setData(JSON.parse(cached));
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenseData();
  }, []);

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleClearData = async () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3000);
      return;
    }
    
    try {
      setIsLoading(true);
      if (data.length > 0) {
        await api.post('delete', 'CostExpense', data);
      }
      localStorage.removeItem('costExpenseCache');
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
      // Find the date column, avoid using the first column blindly if it might be headcount
      const dateVal = row[mapping.dateCol] || row['Date'] || row['วันที่'] || row['Month'] || row['month'] || row['Date/Time'] || '';
      const trimDateVal = String(dateVal).trim();

      // Find if a row with the same date already exists in the existing database rows
      const existingRowIndex = updatedDataList.findIndex(existingRow => {
        const existingDateVal = String(existingRow[mapping.dateCol] || existingRow['Date'] || existingRow['วันที่'] || '').trim();
        return existingDateVal !== '' && existingDateVal === trimDateVal;
      });

      // Construct a standardized mapped row so that it maps correctly to the Google Sheet columns
      const mappedRow: any = {};
      mappedRow[mapping.dateCol] = dateVal;
      mappedRow[mapping.headcountCol] = row['จน.พนักงาน'] || row['จำนวนพนักงาน'] || row['จำนวนพนักงาน (คน)'] || row['headcount'] || Object.values(row)[0] || '';
      mappedRow[mapping.laborCol] = row['ค่าแรง (บาท)'] || row['ค่าจ้างแรงงานรวม'] || row['Labor Cost'] || Object.values(row)[1] || '';
      mappedRow[mapping.waterCol] = row['ค่าน้ำประปา'] || row['ค่าน้ำ (บาท)'] || row['ค่าน้ำประปา (บาท)'] || row['Water Bill'] || Object.values(row)[2] || '';
      mappedRow[mapping.electricCol] = row['ค่าไฟฟ้า'] || row['ค่าไฟฟ้า (บาท)'] || row['Electric Bill'] || Object.values(row)[3] || '';
      mappedRow[mapping.gasCol] = row['ค่าแก๊ส/น้ำมัน'] || row['ค่าแก๊ส (บาท)'] || row['ค่าน้ำมัน (บาท)'] || row['Gas/Fuel Cost'] || Object.values(row)[4] || '';
      mappedRow[mapping.totalCol] = row['TOTAL'] || row['ต้นทุนและค่าใช้จ่ายรวม'] || row['Total Cost'] || row['รวม'] || Object.values(row)[5] || '';

      if (existingRowIndex !== -1) {
        // Date matches existing row, so overwrite it
        const existingRow = updatedDataList[existingRowIndex];
        const updatedRow = {
          ...existingRow,
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
          id: row.id ? String(row.id) : `CE-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: row.createdAt || timestamp,
          updatedAt: timestamp
        };
        rowsToWrite.push(newRow);
        updatedDataList.push(newRow); // Append to local state list
      }
    });

    const previousData = data;
    // Local state display (Snappy UI feedback)
    setData(updatedDataList);
    setIsModalOpen(false);
    setAlertInfo(null);

    // Save batch to cloud datastores (Firebase + Sheets)
    try {
      setIsLoading(true);
      
      // Perform updates for matching dates
      if (rowsToUpdate.length > 0) {
        await api.post('update', 'CostExpense', rowsToUpdate);
      }
      
      // Perform writes for non-duplicate/new dates
      if (rowsToWrite.length > 0) {
        await api.post('write', 'CostExpense', rowsToWrite);
      }

      localStorage.setItem('costExpenseCache', JSON.stringify(updatedDataList));
      setAlertInfo({
        type: 'success',
        message: t('Successfully uploaded and synchronized cost & expense data with Google Sheet & Firestore.', 'อัปโหลดและบันทึกข้อมูลต้นทุนค่าใช้จ่ายลง Google Sheet เรียบร้อยแล้ว!')
      });
      console.log('Successfully written CostExpense data batch (Dual Write).');
    } catch (err) {
      console.error('Error while saving uploaded cost data batch:', err);
      // Rollback UI update on failure
      setData(previousData);
      setAlertInfo({
        type: 'error',
        message: t('Failed to save cost & expense data. Rollback applied. Error: ', 'เกิดข้อผิดพลาดในการบันทึกข้อมูลต้นทุนค่าใช้จ่าย (ทำการย้อนกลับแล้ว): ') + (err instanceof Error ? err.message : String(err))
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

    // Find date column based on known formats or fallback to first column
  const getDateFromRow = React.useCallback((row: any) => {
    return row[mapping.dateCol] || row['Date'] || row['วันที่'] || row['Month'] || row['month'] || row['Date/Time'] || '-';
  }, [mapping]);

  const filteredData = React.useMemo(() => {
    let result = data;
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      result = result.filter(row => {
        const d = getParsedDate(getDateFromRow(row));
        if (!d || isNaN(d.getTime())) return false;
        return d.getFullYear() === Number(year) && (d.getMonth() + 1) === Number(month);
      });
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(row => 
        String(getDateFromRow(row)).toLowerCase().includes(term) ||
        String(row[mapping.totalCol] || '').toLowerCase().includes(term) ||
        String(row[mapping.laborCol] || '').toLowerCase().includes(term)
      );
    }
    return result;
  }, [data, selectedMonth, searchTerm, mapping, getDateFromRow]);

  const calculateSum = (key: string) => {
    return filteredData.reduce((sum, row) => {
      const val = parseFloat((row[key] || '0').toString().replace(/,/g, ''));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const totalCost = calculateSum(mapping.totalCol);
  const totalLabor = calculateSum(mapping.laborCol);
  const totalUtilities = calculateSum('ค่าน้ำ (บาท)') + calculateSum('ค่าไฟฟ้า (บาท)');

  const formatMB = (val: number) => {
    return '฿ ' + (val / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MB';
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB' }).format(val).replace('THB', '฿');
  };

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

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
                  <div className="absolute inset-0 bg-[#d96245] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 w-10 h-10 border border-[#d96245]/40 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm flex items-center justify-center">
                      <LayoutGrid size={22} strokeWidth={2.5} className="text-[#d96245]" />
                  </div>
              </div>
              <div className="mt-0.5">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header text-[24px]">
                      {t('COST & EXPENSE', 'ต้นทุนและค่าใช้จ่าย')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96245] to-[#b58c4f]">{t('HUB', 'ศูนย์ข้อมูล')}</span>
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-0.5 leading-none">
                      {t('FINANCIAL OPERATIONS & EXPENSE TRACKING', 'ข้อมูลต้นทุนและรายงานวิเคราะห์ค่าใช้จ่ายในการดำเนินงาน')}
                  </p>
              </div>
          </div>

          {/* Upper Toolbar Month selector in Cost Header */}
          <div className="flex items-center bg-white border border-[#eaeaec] rounded-xl px-3 py-1 shadow-sm h-[38px]">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">{t('MONTH:', 'เดือน:')}</span>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
              className="text-[11px] font-black text-[#212c46] outline-none bg-transparent select-none cursor-pointer"
            />
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
            <KpiCard label={t('OVERALL COST', 'ต้นทุนรวมทั้งหมด')} value={formatMB(totalCost)} icon={Briefcase} colorAccent={THEME.danger} colorValue={THEME.danger} desc={t('TOTAL THB', 'ต้นทุนรวมสุทธิ (บาท)')} />
            <KpiCard label={t('LABOR WAGES', 'ค่าแรงและค่าจ้างพนักงาน')} value={formatMB(totalLabor)} icon={Activity} colorAccent={THEME.primaryLight} colorValue={THEME.primaryLight} desc={t('WAGES THB', 'ค่าแรง/ค่าจ้างสะสม (บาท)')} />
            <KpiCard label={t('WATER & ELECTRICITY', 'ค่าน้ำและค่าไฟฟ้า')} value={formatMB(totalUtilities)} icon={Zap} colorAccent={THEME.gold} colorValue={THEME.gold} desc={t('UTILITIES THB', 'สาธารณูปโภคสะสม (บาท)')} />
            <KpiCard label={t('SYNCED MONTHS', 'จำนวนบันทึกซิงค์')} value={filteredData.length} icon={Database} colorAccent={THEME.success} colorValue={THEME.success} desc={t('ACTIVE RECORDS', 'รายการบันทึก')} />
        </div>

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
              <div className="text-[#d96245]"><List size={18} /></div>
              <h3 className="text-[12px] font-black tracking-[0.15em] text-[#212c46] uppercase">{t('Active Expense Records', 'รายการบันทึกต้นทุนและค่าใช้จ่าย')}</h3>
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
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#212c46] hover:bg-[#414757] text-white px-4 h-[38px] rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md transition-all">
                <Plus size={14} strokeWidth={3} /> {t('Add Data', 'เพิ่มข้อมูล')}
              </button>
              <button onClick={handleClearData} className={`flex items-center gap-2 px-4 h-[38px] rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all border ${isConfirmingClear ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'}`}>
                <Trash2 size={14} strokeWidth={3} /> {isConfirmingClear ? t('CONFIRM?', 'ยืนยัน?') : t('Clear', 'ลบข้อมูล')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans border-collapse">
              <thead className="bg-[#212c46] text-white">
                <tr className="border-b-2 border-[#b7a159]">
                  <th className="px-4 py-4 text-[12px] font-black tracking-widest uppercase whitespace-nowrap">{t('DATE', 'วันที่')}</th>
                  <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('HEADCOUNT', 'จำนวนพนักงาน (คน)')}</th>
                  <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('LABOR COST', 'ค่าจ้างแรงงานรวม')}</th>
                  <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('WATER', 'ค่าน้ำประปา')}</th>
                  <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('POWER', 'ค่าไฟฟ้า')}</th>
                  <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('FUEL/GAS', 'ค่าแก๊ส/น้ำมัน')}</th>
                  <th className="px-4 py-4 text-[12px] font-black tracking-widest text-right uppercase whitespace-nowrap">{t('TOTAL COST', 'ต้นทุนและค่าใช้จ่ายรวม')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaec] bg-white">
                {filteredData.length === 0 ? (
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
                        <td className="px-4 py-2.5 text-[12px] font-black text-[#212c46] whitespace-nowrap">{getDateFromRow(row)}</td>
                        <td className="px-4 py-2.5 text-right whitespace-nowrap">
                           <span className="bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1 rounded-md text-[12px] font-black text-[#4d87a8]">{row[mapping.headcountCol] || row['จน.พนักงาน'] || '-'}</span>
                        </td>
                        <td className="px-4 py-2.5 text-[12px] font-mono font-medium text-[#7a8b95] text-right whitespace-nowrap">{row[mapping.laborCol] || '-'}</td>
                        <td className="px-4 py-2.5 text-[12px] font-mono font-medium text-[#7a8b95] text-right whitespace-nowrap">{row[mapping.waterCol] || row['ค่าน้ำ (บาท)'] || '-'}</td>
                        <td className="px-4 py-2.5 text-[12px] font-mono font-medium text-[#7a8b95] text-right whitespace-nowrap">{row[mapping.electricCol] || row['ค่าไฟฟ้า (บาท)'] || '-'}</td>
                        <td className="px-4 py-2.5 text-[12px] font-mono font-medium text-[#7a8b95] text-right whitespace-nowrap">{row[mapping.gasCol] || row['ค่าแก๊ส (บาท)'] || row['ค่าน้ำมัน (บาท)'] || '-'}</td>
                        <td className="px-4 py-2.5 text-[12px] font-black text-[#d96245] text-right whitespace-nowrap font-mono">{row[mapping.totalCol] || '-'}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
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
                  <p className="bg-white px-4 py-2 rounded-xl border border-[#eaeaec] shadow-sm">{t('Total Records:', 'บันทึกรวมทั้งหมด:')} {filteredData.length}</p>
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
                        <h3 className="text-[12px] font-black text-[#d7d7d7] uppercase tracking-widest leading-none">{t('Import Cost Data', 'นำเข้าข้อมูลต้นทุนและค่าใช้จ่าย')}</h3>
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
            requiredHeaders={['จน.พนักงาน', 'ค่าแรง (บาท)', 'ค่าไฟฟ้า (บาท)', 'TOTAL']}
            instructions={[
              t("Import Excel (.xlsx) or CSV (Cost & Expense)", "นำเข้าไฟล์ Excel (.xlsx) หรือ CSV (Cost & Expense)"),
              t("First row must be the columns table header", "บรรทัดแรกต้องเป็นชื่อคอลัมน์ (Header)"),
              t("Verify numeric accuracy before submission", "ตรวจสอบความถูกต้องของตัวเลขก่อนนำเข้า")
            ]}
          />
        </div>
      </DraggableModal>
    </div>
  );
}