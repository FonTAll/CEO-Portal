import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../../services/api';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Clock, 
  List, 
  LayoutGrid, 
  HelpCircle, 
  X, 
  Eye, 
  Pencil, 
  Trash2, 
  Save, 
  CalendarDays, 
  BookOpen,
  ShoppingCart, 
  AlertTriangle, 
  ShieldCheck,
  Database,
  CheckCircle,
  Zap,
  Palmtree
} from 'lucide-react';

// --- Theme Configuration (Synced Palette) ---
const THEME = {
  bgGradient: 'linear-gradient(135deg, #f8f9fa 50%, #eaeaec 100%)',
  primary: '#212c46', 
  primaryLight: '#4d87a8', 
  accent: '#b58c4f', 
  gold: '#b7a159',
  brightGold: '#b58c4f',
  success: '#932c2e', 
  danger: '#d96245', 
  mainRed: '#932c2e', 
  skyBlue: '#4d87a8',
  dustyBlue: '#7a8b95',
  indigo: '#212c46',
  softPurple: '#4d87a8',
  deepPurple: '#212c46',
  pinkAccent: '#d96245',
  mutedSlate: '#7a8b95',
  darkSlate: '#212c46',
  silver: '#eaeaec',
  deepNavy: '#212c46',
  brownGold: '#b58c4f',
  vibrantPurple: '#212c46',
  burntOrange: '#d96245',
  slateBlue: '#4d87a8',
  coolGray: '#7a8b95'
};

// --- Helper Components ---
const KPICard = ({ title, val, color, icon: IconComponent, desc }: any) => (
  <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-[#eaeaec] relative overflow-hidden group h-full transition-all hover:border-[#b7a159] animate-fadeIn">
    <div className="absolute -right-6 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0">
        <IconComponent size={100} color={color} />
    </div>
    <div className="relative z-10 flex justify-between items-center h-full">
        <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-[#7691ad] uppercase tracking-widest opacity-90 truncate">{title}</p>
            <h4 className="text-3xl font-black tracking-tighter mt-0.5 text-[#212c46]">{val}</h4>
            <p className="text-[10px] text-[#5a4e70] font-bold mt-1.5 flex items-center gap-1.5 bg-white/40 w-fit px-2 py-0.5 rounded-full border border-black/5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: color}}></span>
                {desc}
            </p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-[#eaeaec] shadow-sm transition-all group-hover:rotate-6" 
            style={{backgroundColor: color + '10', color: color}}>
            <IconComponent size={20} />
        </div>
    </div>
  </div>
);

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-8 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-xl"><BookOpen size={24} className="text-[#b7a159]"/> CALENDAR GUIDE</h3>
            <p className="text-[12px] font-bold text-[#eaeaec] uppercase tracking-widest mt-1.5">Operational Schedule Management</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#d96245] hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 text-[#435665] text-[12px] leading-relaxed">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-2 font-mono">
              <ShoppingCart size={18} className="text-[#b7a159]"/> 1. Sales Planning
            </h4>
            <p className="mb-3">ใช้เพื่อติดตามและนัดหมายกิจกรรมสำคัญในระบบจัดซื้อ เช่น:</p>
            <ul className="list-disc pl-5 space-y-2">
               <li><strong className="text-[#5372ba]">Audit:</strong> การเข้าตรวจประเมินโรงงานผู้ขาย (Supplier Audit)</li>
               <li><strong className="text-[#ce870a]">Quality:</strong> ติดตามและทบทวนเอกสาร SCAR หรือปัญหาคุณภาพ</li>
               <li><strong className="text-[#596c33]">Contract:</strong> วันครบกำหนดสัญญาจ้าง หรือรอบการต่อสัญญาประจำปี</li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-2 font-mono">
              <AlertTriangle size={18} className="text-[#d96245]"/> 2. Priority Management
            </h4>
            <p className="mb-2">ระบบจะใช้สีเพื่อจำแนกระดับความสำคัญของงาน (Priority Level) เพื่อง่ายต่อการจัดลำดับความเร่งด่วน:</p>
            <ul className="list-none pl-0 space-y-2 mt-3">
               <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#d96245] animate-pulse"></div><strong className="text-[#d96245]">Critical:</strong> งานด่วนมาก / ต้องดำเนินการทันที</li>
               <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ce870a]"></div><strong className="text-[#ce870a]">High:</strong> งานสำคัญ / เตรียมดำเนินการ</li>
               <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#5372ba]"></div><strong className="text-[#5372ba]">Normal:</strong> งานปกติตามรอบระยะเวลา</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-2 font-mono">
              <LayoutGrid size={18} className="text-[#6293b9]"/> 3. Views & Navigation
            </h4>
            <p>
              คุณสามารถสลับมุมมองระหว่าง <b>Calendar View</b> (แบบปฏิทินรายเดือน) เพื่อดูภาพรวม และ <b>List View</b> (แบบตาราง) เพื่อจัดการข้อมูล ค้นหา หรือแก้ไขรายละเอียดเชิงลึกได้อย่างสะดวกสบาย
            </p>
          </section>
        </div>
        
        <div className="p-6 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end">
          <button onClick={onClose} className="px-10 py-3 bg-[#212c46] text-[#b7a159] font-black rounded-xl uppercase text-[12px] hover:bg-[#254268] hover:text-white transition-all shadow-md tracking-[0.1em]">เข้าใจแล้ว (Got it)</button>
        </div>
      </div>
    </>,
    document.body
  );
}

// --- Main App Component ---
export default function LawCalendar() {
  const [activeTab, setActiveTab] = useState('calendar'); 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [holidayModalMode, setHolidayModalMode] = useState('create');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  
  const [events, setEvents] = useState<any[]>([]);

  // Fetch events from database
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('read', 'Calendar', null, { limit: 1000, offset: 0 });
      if (res.status === 'success' && res.data?.items) {
        setEvents(res.data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const [eventForm, setEventForm] = useState({
    id: '', date: '', title: '', time: '', type: 'Meeting', priority: 'Normal', status: 'Scheduled'
  });

  const [holidayForm, setHolidayForm] = useState({
    id: '', date: '', title: '', isRecurring: true
  });

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    // ...

    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ day: null });
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ 
        day: i, dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isSunday: new Date(year, month, i).getDay() === 0,
        isSaturday: new Date(year, month, i).getDay() === 6
      });
    }
    while (days.length < 42) days.push({ day: null });
    return days;
  }, [currentDate]);

  const recurringHolidays = useMemo(() => {
    // Generate holidays for previous, current, and next year relative to selected calendar date
    const years = [currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1];
    
    // System holidays (always recurring)
    const H_LIST = [
      { m: 1, d: 1, t: 'วันขึ้นปีใหม่' },
      { m: 3, d: 3, t: 'วันมาฆบูชา' },
      { m: 4, d: 13, t: 'วันสงกรานต์' },
      { m: 4, d: 14, t: 'วันสงกรานต์' },
      { m: 4, d: 15, t: 'วันสงกรานต์' },
      { m: 5, d: 1, t: 'วันแรงงานแห่งชาติ' },
      { m: 6, d: 3, t: 'วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าสุทิดา พัชรสุธาพิมลลักษณ พระบรมราชินี' },
      { m: 7, d: 28, t: 'วันเฉลิมพระชนมพรรษา พระบาทสมเด็จพระปรเมนทรรามาธิบดี ศรีสินทรมหาวชิราลงกรณ พระวชิรเกล้าเจ้าอยู่หัว (รัชกาลที่ 10)' },
      { m: 8, d: 12, t: 'วันแม่แห่งชาติ' },
      { m: 10, d: 13, t: 'วันหยุดชดเชย วันนวมินทรมหาราช' },
      { m: 10, d: 23, t: 'วันปิยมหาราช' },
      { m: 12, d: 5, t: 'วันพ่อแห่งชาติ' },
      { m: 12, d: 31, t: 'วันสิ้นปี' }
    ];
    
    // Custom recurring holidays from DB
    const customRecurring = events.filter(e => e.type === 'Holiday_Recurring');
    
    let items: any[] = [];
    years.forEach(y => {
        H_LIST.forEach((h, i) => {
            const dateStr = `${y}-${String(h.m).padStart(2, '0')}-${String(h.d).padStart(2, '0')}`;
            items.push({
                id: `HOLIDAY_SYS-${y}-${h.m}-${h.d}-${i}`,
                date: dateStr,
                title: h.t,
                time: '00:00',
                type: 'Holiday_System',
                priority: 'Normal',
                status: 'Confirmed',
                color: 'bg-[url(/holiday-bg.jpg)] bg-gradient-to-r from-[#d96245]/20 to-[#ce870a]/20 text-[#d96245] border-[#d96245]/40 font-bold'
            });
        });
        
        customRecurring.forEach(ch => {
            if(ch.date) {
               const [_, m, d] = ch.date.split('-');
               items.push({
                 ...ch,
                 id: `HOLIDAY_CUSTOM-${ch.id}-${y}`,
                 dbId: ch.id, // reference to real database ID for editing
                 date: `${y}-${m}-${d}`,
               });
            }
        });
    });
    return items;
  }, [currentDate, events]);

  const baseEvents = useMemo(() => events.filter(e => e.type !== 'Holiday_Recurring'), [events]);
  const allEvents = useMemo(() => [...baseEvents, ...recurringHolidays], [baseEvents, recurringHolidays]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(ev => {
      const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.type.toLowerCase().includes(searchQuery.toLowerCase());
      const evMonth = ev.date ? ev.date.substring(0, 7) : '';
      const currMonth = currentDate.toISOString().substring(0, 7);
      return matchSearch && (activeTab === 'list' ? true : evMonth === currMonth);
    }).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, searchQuery, currentDate, activeTab]);

  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;

  const handleOpenModal = (mode: string, event: any = null, prefillDate: any = null) => {
    if (event?.id?.toString().startsWith('HOLIDAY_SYS-')) return; 
    
    if (event?.id?.toString().startsWith('HOLIDAY_CUSTOM-')) {
       const originalEvent = events.find(e => e.id === event.dbId);
       if(originalEvent) {
           setHolidayModalMode(mode);
           setHolidayForm({
             id: originalEvent.id,
             date: originalEvent.date,
             title: originalEvent.title,
             isRecurring: originalEvent.type === 'Holiday_Recurring'
           });
           setIsHolidayModalOpen(true);
       }
       return;
    }
    
    if (event?.type === 'Holiday_Custom' || event?.type === 'Holiday_Recurring' || event?.type === 'Holiday') {
        setHolidayModalMode(mode);
        let origId = event.dbId || event.id;
        const originalEvent = events.find(e => e.id === origId) || event;
        setHolidayForm({
            id: originalEvent.id,
            date: originalEvent.date,
            title: originalEvent.title,
            isRecurring: originalEvent.type === 'Holiday_Recurring'
        });
        setIsHolidayModalOpen(true);
        return;
    }

    setModalMode(mode);
    setEventForm(event ? { ...event } : {
      id: `EV-${currentDate.getFullYear().toString().substring(2)}${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(events.length + 1).padStart(3, '0')}`,
      date: prefillDate || new Date().toISOString().split('T')[0],
      title: '', time: '09:00', type: 'Meeting', priority: 'Normal', status: 'Scheduled'
    });
    setIsModalOpen(true);
  };

  const handleSaveHoliday = async (e: any) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const isCreate = holidayModalMode === 'create' || !holidayForm.id;
    const finalId = isCreate 
        ? `HOL-${Math.floor(Math.random()*1000000)}`
        : holidayForm.id;

    const payload = { 
        id: finalId,
        date: holidayForm.date,
        title: holidayForm.title,
        time: '00:00',
        type: holidayForm.isRecurring ? 'Holiday_Recurring' : 'Holiday_Custom',
        priority: 'Normal',
        status: 'Confirmed',
        color: 'bg-[url(/holiday-bg.jpg)] bg-gradient-to-r from-[#d96245]/20 to-[#ce870a]/20 text-[#d96245] border-[#d96245]/40 font-bold',
        createdAt: isCreate ? now : now, 
        updatedAt: now
    };

    setIsLoading(true);
    try {
        if (isCreate) {
            const res = await api.post('write', 'Calendar', [payload]);
            if (res.status === 'success') {
                setEvents([...events, payload]);
            }
        } else {
            const res = await api.post('update', 'Calendar', [payload]);
            if (res.status === 'success') {
                setEvents(events.map(ev => ev.id === payload.id ? payload : ev));
            }
        }
        setIsHolidayModalOpen(false);
    } catch(err) {
        console.error("Save error", err);
        alert("Failed to save holiday");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveEvent = async (e: any) => {
    e.preventDefault();
    const typeColors: any = {
      'Meeting': 'bg-[#5372ba]/10 text-[#5372ba] border-[#5372ba]/20',
      'Audit': 'bg-[#ce870a]/10 text-[#ce870a] border-[#ce870a]/20',
      'Finance': 'bg-[#b84530]/10 text-[#b84530] border-[#b84530]/20',
      'Quality': 'bg-[#d96245]/10 text-[#d96245] border-[#d96245]/20',
      'Contract': 'bg-[#6293b9]/10 text-[#6293b9] border-[#6293b9]/20',
      'Holiday': 'bg-gradient-to-r from-[#d96245]/20 to-[#ce870a]/20 text-[#d96245] border-[#d96245]/40'
    };
    
    // Setup ID and ISO datetimes
    const now = new Date().toISOString();
    const isCreate = modalMode === 'create' || !eventForm.id;
    const finalId = isCreate 
        ? `EV-${Math.floor(Math.random()*1000000)}` // simple unique id generator
        : eventForm.id;

    const payload = { 
        ...eventForm, 
        id: finalId,
        color: typeColors[eventForm.type] || 'bg-[#f8f9fa] text-[#435665] border-[#eaeaec]',
        createdAt: isCreate ? now : (eventForm as any).createdAt || now,
        updatedAt: now
    };

    setIsLoading(true);
    try {
        if (isCreate) {
            const res = await api.post('write', 'Calendar', [payload]);
            if (res.status === 'success') {
                setEvents([...events, payload]);
            }
        } else {
            const res = await api.post('update', 'Calendar', [payload]);
            if (res.status === 'success') {
                setEvents(events.map(ev => ev.id === payload.id ? payload : ev));
            }
        }
        setIsModalOpen(false);
    } catch(err) {
        console.error("Save error", err);
        alert("Failed to save event");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (id.startsWith('HOLIDAY_SYS-')) return; 
    let realId = id;
    if (id.startsWith('HOLIDAY_CUSTOM-')) {
        const ev = allEvents.find(e => e.id === id);
        if (ev && ev.dbId) realId = ev.dbId;
    }
    
    if(window.confirm('ยืนยันการลบนัดหมายนี้?')) {
        try {
            setIsLoading(true);
            const res = await api.post('delete', 'Calendar', [{ id: realId }]);
            if (res.status === 'success') {
                setEvents(events.filter(e => e.id !== realId));
            }
        } catch(err) {
            console.error("Delete error", err);
            alert("Failed to delete event");
        } finally {
            setIsLoading(false);
        }
    }
  };

  return (
    <div className="flex flex-1 w-full flex-col pb-5 animate-fadeIn bg-transparent space-y-6">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] bg-white border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#d96245] hover:text-white hover:border-[#d96245] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#d96245] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION */}
      <div className="h-14 px-4 sm:px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <CalendarDays size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      LAW <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">CALENDAR</span> HUB
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      STRATEGIC OPERATIONAL SCHEDULE & SALES PLAN
                  </p>
              </div>
          </div>

          <div className="flex bg-[#f8f9fa] border border-[#eaeaec] p-1 rounded-full shadow-sm inline-flex">
              <button onClick={() => setActiveTab('calendar')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${activeTab === 'calendar' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}>
                <LayoutGrid size={14} /> Calendar View
              </button>
              <button onClick={() => setActiveTab('list')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}>
                <List size={14} /> List View
              </button>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 mt-[2px] pb-6">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 shrink-0">
                <KPICard title="Scheduled Tasks" val={filteredEvents.length} icon={Database} color={THEME.primaryLight} desc="Current View" />
                <KPICard title="Critical Priorities" val={allEvents.filter(e => e.priority === 'Critical').length} icon={AlertTriangle} color={THEME.danger} desc="Action Required" />
                <KPICard title="Supplier Audits" val={allEvents.filter(e => e.type === 'Audit').length} icon={ShieldCheck} color={THEME.accent} desc="Verification Node" />
                <KPICard title="Sync Status" val={isLoading ? "Syncing..." : "Live"} icon={CheckCircle} color={THEME.success} desc="System Synced" />
            </div>

            {/* CONTENT BLOCK - CALENDAR OR LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec]/60 overflow-hidden flex flex-col animate-fadeIn">
                <div className="px-8 py-4 bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#eaeaec]/60 shrink-0">
                    {/* MONTH/YEAR NAVIGATION BAR */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-xl border border-[#eaeaec] shadow-sm min-w-[220px]">
                            <button 
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} 
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5372ba] hover:bg-[#f8f9fa] transition-colors"
                            >
                                <ChevronLeft size={18}/>
                            </button>
                            <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest">
                                {currentDate.toLocaleString('en-US', { month: 'long' })} {currentDate.getFullYear()}
                            </h4>
                            <button 
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} 
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5372ba] hover:bg-[#f8f9fa] transition-colors"
                            >
                                <ChevronRight size={18}/>
                            </button>
                        </div>
                        <button onClick={() => setCurrentDate(new Date())} className="bg-white border border-[#eaeaec] text-[#212c46] px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-[#f8f9fa] transition-colors">
                            TODAY
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                        <div className="relative flex-1 md:w-72 min-w-[200px]">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7691ad]" />
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search activities..." className="w-full pl-12 pr-4 py-2.5 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                        </div>
                        <button onClick={() => handleOpenModal('create')} className="bg-[#212c46] text-[#b7a159] hover:bg-[#254268] hover:text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 border border-[#212c46] shrink-0">
                            <Plus size={16} strokeWidth={3} /> Add Task
                        </button>
                        <button onClick={() => {
                           const dt = new Date().toISOString().split('T')[0];
                           setHolidayModalMode('create');
                           setHolidayForm({ id: '', date: dt, title: '', isRecurring: true });
                           setIsHolidayModalOpen(true);
                        }} className="bg-white text-[#d96245] px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-[#d96245] hover:text-white transition-all flex items-center gap-2 border border-[#eaeaec] hover:border-[#d96245] shrink-0">
                            <Palmtree size={16} /> Holiday
                        </button>
                    </div>
                </div>

                <div className="overflow-auto custom-scrollbar">
                    {activeTab === 'calendar' ? (
                        <div className="grid grid-cols-7 border-b border-[#eaeaec]">
                            {daysOfWeek.map(d => {
                                let bgClass = "bg-[#212c46] text-[#eaeaec]";
                                if (d === 'SUN') bgClass = "bg-[#d96245] text-white";
                                else if (d === 'SAT') bgClass = "bg-[#999dc7] text-white";
                                return (
                                    <div key={d} className={`py-3 text-center text-[12px] font-black tracking-widest border-r border-[#ffffff20] last:border-r-0 ${bgClass}`}>
                                        {d}
                                    </div>
                                );
                            })}
                            {calendarDays.map((d, i) => {
                                const dayEvents = allEvents.filter(e => e.date === d.dateStr);
                                return (
                                    <div key={i} className={`min-h-[135px] border-r border-b border-[#eaeaec]/50 p-2.5 group transition-all relative ${!d.day ? 'bg-[#f8f9fa]/50 opacity-40' : 'bg-white hover:bg-[#f8f9fa]'}`}>
                                        {d.day && (
                                            <div className="h-full flex flex-col relative">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenModal('create', null, d.dateStr); }}
                                                    className="absolute -top-1 -right-1 w-6 h-6 bg-[#212c46] text-[#b7a159] rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-[#b7a159] hover:text-[#212c46] z-20"
                                                    title="Add Task to this date"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                </button>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-[14px] font-black ${d.isToday ? 'bg-[#212c46] text-[#b7a159] w-8 h-8 flex items-center justify-center rounded-xl shadow-md transform rotate-3' : d.isSunday ? 'text-[#d96245]' : 'text-[#7691ad]'}`}>
                                                        {d.day}
                                                    </span>
                                                    {dayEvents.length > 0 && <span className="text-[9px] font-black text-[#212c46] bg-[#eaeaec] px-1.5 py-0.5 rounded-md uppercase border border-[#b7a159] mr-6">{dayEvents.length} Tasks</span>}
                                                </div>
                                                <div className="space-y-1.5 overflow-y-auto custom-scrollbar flex-1 max-h-[90px]">
                                                    {dayEvents.map(ev => (
                                                        <div key={ev.id} onClick={(e) => { e.stopPropagation(); if(!ev.id.startsWith('HOLIDAY-')) handleOpenModal('view', ev); }} className={`px-2.5 py-1.5 rounded-md text-[11px] font-black border truncate ${!ev.id.startsWith('HOLIDAY-') ? 'cursor-pointer hover:brightness-95' : 'cursor-default'} transition-all shadow-sm ${ev.color}`}>
                                                            {ev.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#212c46] text-white sticky top-0 z-10 border-b-2 border-[#b58c4f]">
                                <tr>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ID Code</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Schedule Info</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Activity Description</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center">Category</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center">Priority</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec]">
                                {paginatedEvents.length > 0 ? paginatedEvents.map(ev => (
                                    <tr key={ev.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                        <td className="py-3 px-6 font-mono font-black text-[#7691ad] uppercase text-[12px]">{ev.id}</td>
                                        <td className="py-3 px-6 text-[12px]">
                                            <div className="flex flex-col">
                                                <span className="font-black text-[#212c46]">{new Date(ev.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                <span className="text-[11px] text-[#ce870a] font-black flex items-center gap-1.5 uppercase tracking-tight mt-0.5"><Clock size={12}/> {ev.time} HRS</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 font-black text-[#212c46] uppercase tracking-tight text-[12px]">{ev.title}</td>
                                        <td className="py-3 px-6 text-center text-[12px]">
                                            <span className={`px-4 py-1 rounded-md text-[11px] font-black border uppercase tracking-widest ${ev.color}`}>{ev.type}</span>
                                        </td>
                                        <td className="py-3 px-6 text-center text-[12px]">
                                            <div className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase border tracking-widest ${ev.priority==='Critical' ? 'bg-[#d96245]/10 text-[#d96245] border-[#d96245]/30' : ev.priority==='High' ? 'bg-[#ce870a]/10 text-[#ce870a] border-[#ce870a]/30' : 'bg-[#5372ba]/10 text-[#5372ba] border-[#5372ba]/30'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${ev.priority==='Critical' ? 'bg-[#d96245] animate-pulse' : 'bg-current'}`}></div>
                                                {ev.priority}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center text-[12px]">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                {!ev.id.startsWith('HOLIDAY_SYS-') && (
                                                    <>
                                                        <button onClick={() => handleOpenModal('view', ev)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#eaeaec] text-[#5372ba] hover:border-[#212c46] hover:text-[#212c46] hover:bg-[#212c46]/5 bg-white transition-all shadow-sm active:scale-90" title="View"><Eye size={16}/></button>
                                                        <button onClick={() => handleOpenModal('edit', ev)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#eaeaec] text-[#ce870a] hover:border-[#212c46] hover:text-[#212c46] hover:bg-[#212c46]/5 bg-white transition-all shadow-sm active:scale-90" title="Edit"><Pencil size={16}/></button>
                                                        <button onClick={() => handleDeleteEvent(ev.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#eaeaec] text-[#d96245] hover:border-[#212c46] hover:text-[#212c46] hover:bg-[#212c46]/5 bg-white transition-all shadow-sm active:scale-90" title="Delete"><Trash2 size={16}/></button>
                                                    </>
                                                )}
                                                {ev.id.startsWith('HOLIDAY_SYS-') && (
                                                    <span className="text-gray-400 text-[10px] italic">System</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center text-[#7691ad] font-black uppercase tracking-widest text-[12px] opacity-60">No scheduled events found for this criteria</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PAGINATION */}
                {activeTab === 'list' && (
                    <div className="px-8 py-3 bg-[#d7d7d7] border-t-[1.5px] border-slate-300 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                        <div className="flex items-center gap-6 text-[11px] font-black text-[#7691ad] uppercase tracking-widest">
                            <div className="flex items-center gap-3">
                                <span>Display Rows:</span>
                                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#eaeaec] rounded-lg px-3 py-1.5 outline-none focus:border-[#b7a159] text-[#212c46] cursor-pointer shadow-sm font-black text-[12px]">
                                    {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <p className="bg-white px-4 py-2 rounded-xl border border-[#eaeaec] shadow-sm">Total Activities: {filteredEvents.length}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 border border-[#eaeaec] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-[#b7a159] shadow-md active:scale-90'}`}>
                                <ChevronLeft size={18}/>
                            </button>
                            <div className="bg-[#212c46] text-[#b7a159] px-8 py-2.5 rounded-xl shadow-md font-black text-[11px] min-w-[140px] text-center uppercase tracking-widest border border-[#212c46]">
                                Page {currentPage} / {totalPages || 1}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`w-10 h-10 border border-[#eaeaec] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-[#b7a159] shadow-md active:scale-90'}`}>
                                <ChevronRight size={18}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
      </div>

      {/* MODAL SYSTEM */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#212c46]/80 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-[#f8f9fa] rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative border border-[#b7a159]">
                <div className="bg-[#212c46] px-8 py-6 flex justify-between items-center shrink-0 border-b-4 border-[#b7a159] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150"><CalendarDays size={120} className="text-white"/></div>
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#b7a159] flex items-center justify-center border border-white/20 shadow-md backdrop-blur-md">
                        <CalendarIcon size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#eaeaec] uppercase tracking-widest leading-none">{modalMode === 'create' ? 'Schedule Activity' : modalMode === 'view' ? 'Activity Record' : 'Modify Schedule'}</h3>
                        <p className="text-[12px] font-bold text-[#7691ad] uppercase tracking-widest mt-1.5 flex items-center gap-2">
                           <Zap size={12} className="text-[#b7a159]" /> Strategic Operations Planning
                        </p>
                      </div>
                    </div>
                    <button onClick={()=>setIsModalOpen(false)} className="text-[#9094ac] hover:text-[#d96245] transition-all bg-white/5 hover:bg-white/10 p-2.5 rounded-full active:scale-90 relative z-10"><X size={20} /></button>
                </div>
                
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <form id="calendarForm" onSubmit={handleSaveEvent} className="space-y-6 bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm">
                        <div>
                          <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Activity Description <span className="text-[#d96245]">*</span></label>
                          <input required disabled={modalMode==='view'} value={eventForm.title} onChange={e=>setEventForm({...eventForm, title: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] uppercase outline-none focus:border-[#b7a159] transition-all shadow-sm disabled:bg-[#f8f9fa]" placeholder="e.g. Audit Vendor Premises" />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Target Date <span className="text-[#d96245]">*</span></label>
                              <input type="date" required disabled={modalMode==='view'} value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] transition-all shadow-sm disabled:bg-[#f8f9fa] font-mono" />
                            </div>
                            <div>
                              <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Execution Time <span className="text-[#d96245]">*</span></label>
                              <input type="time" required disabled={modalMode==='view'} value={eventForm.time} onChange={e=>setEventForm({...eventForm, time: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] transition-all shadow-sm disabled:bg-[#f8f9fa] font-mono" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Workstream Category <span className="text-[#d96245]">*</span></label>
                              <select disabled={modalMode==='view'} value={eventForm.type} onChange={e=>setEventForm({...eventForm, type: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none cursor-pointer focus:border-[#b7a159] transition-all shadow-sm disabled:bg-[#f8f9fa]">
                                  <option value="Meeting">Meeting</option>
                                  <option value="Audit">Audit</option>
                                  <option value="Quality">Quality</option>
                                  <option value="Finance">Finance</option>
                                  <option value="Contract">Contract</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Priority Level <span className="text-[#d96245]">*</span></label>
                              <select disabled={modalMode==='view'} value={eventForm.priority} onChange={e=>setEventForm({...eventForm, priority: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none cursor-pointer focus:border-[#b7a159] transition-all shadow-sm disabled:bg-[#f8f9fa]">
                                  <option value="Normal">Normal</option>
                                  <option value="High">High</option>
                                  <option value="Critical">Critical</option>
                              </select>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="p-6 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={()=>setIsModalOpen(false)} className="px-8 py-2.5 bg-white border border-[#eaeaec] text-[#435665] rounded-xl font-bold text-[12px] uppercase tracking-widest hover:bg-[#eaeaec]/30 transition-all shadow-sm">Cancel</button>
                    {modalMode !== 'view' ? (
                      <button type="submit" form="calendarForm" className="bg-[#212c46] text-[#b7a159] px-8 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#254268] hover:text-white transition-all flex items-center gap-2 border border-[#212c46]">
                        <Save size={16}/> {modalMode === 'create' ? 'Register' : 'Save Update'}
                      </button>
                    ) : (
                      <button type="button" onClick={()=>setModalMode('edit')} className="bg-[#212c46] text-[#b7a159] px-8 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#254268] hover:text-white transition-all flex items-center gap-2 border border-[#212c46]">
                        <Pencil size={16}/> Modify Activity
                      </button>
                    )}
                </div>
            </div>
        </div>, document.body
      )}
      {/* HOLIDAY MODAL SYSTEM */}
      {isHolidayModalOpen && createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#212c46]/80 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-[#f8f9fa] rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative border border-[#d96245]">
                <div className="bg-[#d96245] px-8 py-6 flex justify-between items-center shrink-0 border-b-4 border-[#ce870a] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150"><Palmtree size={120} className="text-white"/></div>
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-md backdrop-blur-md">
                        <Palmtree size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none">{holidayModalMode === 'create' ? 'Add Holiday' : holidayModalMode === 'view' ? 'Holiday Detail' : 'Edit Holiday'}</h3>
                        <p className="text-[12px] font-bold text-white/80 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                           <Zap size={12} className="text-[#ce870a]" /> Company Holidays Setup
                        </p>
                      </div>
                    </div>
                    <button onClick={()=>setIsHolidayModalOpen(false)} className="text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2.5 rounded-full active:scale-90 relative z-10"><X size={20} /></button>
                </div>
                
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <form id="holidayForm" onSubmit={handleSaveHoliday} className="space-y-6 bg-white p-6 rounded-2xl border border-[#eaeaec] shadow-sm">
                        <div>
                          <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Holiday Name <span className="text-[#d96245]">*</span></label>
                          <input required disabled={holidayModalMode==='view'} value={holidayForm.title} onChange={e=>setHolidayForm({...holidayForm, title: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] uppercase outline-none focus:border-[#d96245] transition-all shadow-sm disabled:bg-[#f8f9fa]" placeholder="e.g. Company Anniversary" />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block mb-2">Holiday Date <span className="text-[#d96245]">*</span></label>
                              <input type="date" required disabled={holidayModalMode==='view'} value={holidayForm.date} onChange={e=>setHolidayForm({...holidayForm, date: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#d96245] transition-all shadow-sm disabled:bg-[#f8f9fa] font-mono" />
                            </div>
                            <div className="flex flex-col justify-center pt-5">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        disabled={holidayModalMode==='view'} 
                                        checked={holidayForm.isRecurring} 
                                        onChange={e=>setHolidayForm({...holidayForm, isRecurring: e.target.checked})} 
                                        className="w-5 h-5 rounded border-[#eaeaec] text-[#d96245] focus:ring-[#d96245]"
                                    />
                                    <span className={`text-[12px] font-black uppercase tracking-widest ${holidayForm.isRecurring ? 'text-[#d96245]' : 'text-[#7691ad]'}`}>
                                        ซ้ำทุกปี (Repeats Annually)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="p-6 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={()=>setIsHolidayModalOpen(false)} className="px-8 py-2.5 bg-white border border-[#eaeaec] text-[#435665] rounded-xl font-bold text-[12px] uppercase tracking-widest hover:bg-[#eaeaec]/30 transition-all shadow-sm">Cancel</button>
                    {holidayModalMode !== 'view' ? (
                      <button type="submit" form="holidayForm" className="bg-[#d96245] text-white px-8 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#b84530] transition-all flex items-center gap-2 border border-[#d96245]">
                        <Save size={16}/> {holidayModalMode === 'create' ? 'Register' : 'Save Update'}
                      </button>
                    ) : (
                      <button type="button" onClick={()=>setHolidayModalMode('edit')} className="bg-[#d96245] text-white px-8 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#b84530] transition-all flex items-center gap-2 border border-[#d96245]">
                        <Pencil size={16}/> Modify Holiday
                      </button>
                    )}
                </div>
            </div>
        </div>, document.body
      )}

    </div>
  );
}
