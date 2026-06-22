import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  TrendingDown, 
  Target, 
  Truck, 
  BarChart2, 
  Settings, 
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  Building2,
  Clock,
  PackageCheck,
  PhoneCall,
  Mail,
  Calendar,
  Library,
  DollarSign,
  PieChart as PieChartIcon,
  Award,
  Globe,
  Bell,
  Sparkles,
  Factory,
  CheckCircle2,
  FileText,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Container,
  Database,
  FileSearch,
  Scale,
  Shield,
  CreditCard,
  Zap,
  Handshake,
  Filter,
  Megaphone,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Percent,
  UserPlus,
  PartyPopper,
  Send,
  CheckSquare,
  GraduationCap,
  Info,
  User,
  AlertTriangle,
  Activity,
  Plus,
  BrainCircuit,
  Heart,
  CalendarDays,
  Banknote,
  Network
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DraggableModal } from '../../components/shared/DraggableModal';
import KpiCard from '../../components/shared/KpiCard';
import { ShortcutsHub } from '../../components/shared/ShortcutsHub';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';
import { RefreshCcw, LayoutGrid } from 'lucide-react';

// --- Theme Configuration (Vibrant Palette) ---
const THEME = {
    bgMain: '#f3f3f1',
    bgGradient: 'linear-gradient(135deg, #f3f3f1 0%, #f3f3f1 100%)',
    sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#212c46',
    primaryLight: '#4d87a8',
    accent: '#a94228',
    gold: '#b58c4f',
    brightGold: '#b7a159',
    success: '#657f4d',
    danger: '#932c2e',
    warning: '#a94228',
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
    coolGray: '#f3f3f1',
    c1: '#b22026',
    c2: '#932c2e',
    c3: '#851c24',
    c4: '#a94228',
    c5: '#d96245',
    c6: '#b58c4f',
    c7: '#b7a159',
    c8: '#8e9141',
    c9: '#5f7ab7',
    c10: '#bceadf',
    c11: '#f91a47',
    c12: '#fdda04',
    c13: '#e7dedd',
    c14: '#a74353',
    c15: '#c3924c',
    c16: '#ffa64a',
    c17: '#e8cec2',
    c18: '#f46e61',
    c19: '#972956',
    c20: '#9293c3',
    c21: '#ca649f',
    c22: '#dba1c2',
    c23: '#214573',
    c24: '#091d38',
};

// --- System Modules Data ---

const MOCK_STATS = [
    { 
        label: 'Total Revenue', 
        value: '฿45.2M', 
        sub: '+12.5% from last month', 
        icon: TrendingUp, 
        color: THEME.c11,
        trendData: [{ value: 40 }, { value: 42 }, { value: 41 }, { value: 43 }, { value: 44.5 }, { value: 45.2 }]
    },
    { 
        label: 'Gross Margin', 
        value: '32.4%', 
        sub: 'Up 2.1% from target', 
        icon: Briefcase, 
        color: THEME.c2,
        trendData: [{ value: 28 }, { value: 29 }, { value: 30 }, { value: 31.5 }, { value: 32 }, { value: 32.4 }]
    },
    { 
        label: 'Total Expenses', 
        value: '฿28.4M', 
        sub: '-5% vs budget', 
        icon: BarChart2, 
        color: THEME.c16,
        trendData: [{ value: 30 }, { value: 29.5 }, { value: 29 }, { value: 28.8 }, { value: 28.5 }, { value: 28.4 }]
    },
    { 
        label: 'Net Profit', 
        value: '฿16.8M', 
        sub: '+4.2% this quarter', 
        icon: Banknote, 
        color: THEME.c21,
        trendData: [{ value: 14.2 }, { value: 14.8 }, { value: 15.3 }, { value: 15.9 }, { value: 16.2 }, { value: 16.8 }]
    },
];

const GlassCard = ({ children, className = '', hoverEffect = true, style = {} }: any) => (
    <div className={`rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`}
        style={{ backgroundColor: THEME.glassWhite, ...style }}>
        {children}
    </div>
);

const HeroBanner = () => {
    const bgImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000";
    return (
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl group bg-[#212c46] border border-[#414757] font-exception-hero">
        <div className="absolute inset-0 transform transition-transform duration-[2000ms] group-hover:scale-105">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 35%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#212c46]/95 via-[#212c46]/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-4 md:p-6 w-full gap-6">
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={12} className="text-[#b7a159]" />
              <span className="text-[9px] text-[#b7a159] font-black uppercase tracking-[0.2em] drop-shadow-sm">Executive Dashboard</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md">
              CEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#f3e5ab]">PORTAL</span>
            </h2>
            <div className="mb-6">
              <p className="text-white/90 text-xs font-medium leading-relaxed max-w-2xl">
                "ภาพรวมผลประกอบการ ทิศทางกลยุทธ์ และข้อมูลสำคัญสำหรับการตัดสินใจระดับบริหาร" <br/><span className="text-[#b7a159] font-bold">Enterprise Management System</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-[#b58c4f] hover:bg-[#8e9141] border border-[#b7a159]/30 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(181,140,79,0.5)]">
                <Building2 size={12} /> Strategy Map
              </button>
              <div className="bg-white/5 border border-white/10 px-4 py-2 text-center rounded-xl flex items-center gap-2 shadow-inner backdrop-blur-md">
                <ShieldCheck size={14} className="text-[#657f4d]" />
                <span className="text-white font-black tracking-tighter text-sm">SECURE</span>
                <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-none mt-0.5">Exec Access</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <a 
              href="/copilot"
              className="bg-gradient-to-br from-[#1d2636] to-[#2d2c4a] border border-[#b7a159]/40 p-1 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(181,140,79,0.3)] hover:-translate-y-1 transition-all group/ai"
            >
              <div className="bg-[#1d2636] border border-white/10 rounded-xl px-8 py-5 flex flex-col items-center gap-2">
                <div className="relative">
                   <div className="absolute inset-0 bg-[#b7a159]/20 blur-xl rounded-full scale-150 animate-pulse" />
                   <BrainCircuit size={40} className="text-[#b7a159] relative z-10 group-hover/ai:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[#b7a159] text-[13px] font-black uppercase tracking-[0.2em] mt-1">CEO COPILOT</span>
                <span className="text-[8px] text-white/40 font-bold tracking-[0.4em]">EXECUTIVE A.I.</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
};

const CorporateAnnouncementsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const announcements = [
        { id: 1, type: "COMPANY UPDATE", issue: "Q1 Townhall Summary", subject: "Review the key takeaways and targets from our recent townhall.", date: "12 May 2026", isNew: true, image: "https://images.unsplash.com/photo-1542382156909-923bea7b0a72?q=80&w=500" },
        { id: 2, type: "HR ANNOUNCEMENT", issue: "New Hybrid Work Policy", subject: "Review the updated guidelines for remote working and flexible hours.", date: "14 May 2026", isNew: true, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=500" },
        { id: 3, type: "EVENT", issue: "Annual Team Building", subject: "Join us for our annual retreat. Details and registration inside.", date: "20 May 2026", isNew: false, image: "https://images.unsplash.com/photo-1511632765486-a01c80cf59af?q=80&w=500" },
        { id: 4, type: "TRAINING", issue: "Leadership Workshop", subject: "Mandatory training for all mid-level managers next month.", date: "02 Jun 2026", isNew: false, image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=500" },
        { id: 5, type: "WELLNESS", issue: "Health Checkup Camp", subject: "Annual free health checkup for employees and dependents.", date: "15 Jun 2026", isNew: false, image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=500" },
        { id: 6, type: "IT UPDATE", issue: "New HR System Portal", subject: "We are migrating to a new performance tracking system. Read more.", date: "01 Jul 2026", isNew: false, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=500" },
    ];

    const nextSlide = () => setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));

    // Show up to 4 items on large screens
    const visibleAnnouncements = [];
    for (let i = 0; i < 4; i++) {
        visibleAnnouncements.push(announcements[(currentIndex + i) % announcements.length]);
    }

    return (
        <div className="w-full bg-[#f6f5f3] py-5 rounded-2xl relative overflow-hidden shadow-inner border border-[#e5e5e5]">
            <div className="flex items-center absolute top-1/2 -translate-y-1/2 left-2 z-20">
                <button onClick={prevSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors">
                    <ChevronLeft size={24} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 px-14">
                {visibleAnnouncements.map((ann, idx) => (
                    <div key={`${ann.id}-${idx}`} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col relative h-[145px] border border-gray-100 group transition-all hover:shadow-md justify-between">
                        {ann.isNew && (
                            <div className="absolute -left-10 top-5 bg-[#a73527] text-white font-black px-11 py-1 -rotate-45 z-20 shadow-md text-[11px] tracking-wider">
                                NEW
                            </div>
                        )}
                        
                        <div className="p-2 pt-3 text-center z-10 relative">
                            <h3 className="font-extrabold text-[#3a4454] leading-tight text-[12px] drop-shadow-sm">{ann.type}</h3>
                            <h4 className="font-bold text-[#56657a] text-[10px] mt-0.5">{ann.issue}</h4>
                            <h2 className="font-black text-[#1e4e6d] text-[13px] mt-2 drop-shadow-sm leading-tight line-clamp-2">{ann.subject}</h2>
                        </div>
                        
                        <div className="bg-[#364b5e] text-white py-1.5 px-2 mx-2 mb-2 rounded-lg text-center flex items-center justify-center gap-1 z-10 shadow-sm relative shrink-0">
                            <span className="text-[9px] font-medium tracking-wide">Date</span>
                            <span className="flex items-center gap-0.5 mx-1 text-white/50"><span className="w-0.5 h-0.5 bg-white/50 rounded-full"></span><span className="w-1 h-1 bg-white/80 rounded-full"></span></span>
                            <span className="text-[10px] font-black tracking-wide">{ann.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center absolute top-1/2 -translate-y-1/2 right-2 z-20">
                <button onClick={nextSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                {announcements.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#1e4e6d] ring-2 ring-[#1e4e6d]/30 ring-offset-2' : 'bg-gray-400 hover:bg-gray-500'}`}
                    />
                ))}
            </div>
        </div>
    );
};



const SalesChartArea = () => {
  const data = [
    { name: "Quality Manuals", target: 60, actual: 64, color: THEME.c2 },
    { name: "Procedures", target: 25, actual: 20, color: THEME.c11 },
    { name: "Work Instructions", target: 15, actual: 16, color: THEME.c16 },
  ];
  return (
    <GlassCard className="lg:col-span-2 bg-gradient-to-br from-white to-[#f3f3f1] border-[#f3f3f1]">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-base font-black text-[#212c46] flex items-center gap-2 uppercase tracking-tight">
            <BarChart2 size={16} className="text-[#932c2e]" /> Document Distribution
        </h2>
        <span className="text-[8px] text-white font-black bg-[#3f809e] px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Real-time</span>
      </div>
      <div className="space-y-4 relative z-10">
        {data.map((item, i) => (
            <div key={i} className="flex items-center gap-4 group/bar">
              <div className="w-28 text-[9px] font-black text-[#435665] uppercase truncate tracking-tight">{item.name}</div>
              <div className="flex-1 h-4 rounded-lg relative flex items-center bg-[#f3f3f1]/40 shadow-inner overflow-hidden">
                <div className="h-full transition-all duration-1000 relative z-10 rounded-lg"
                  style={{ width: `${item.actual}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)` }} />
              </div>
              <div className="w-10 text-right">
                <span className="text-[10px] font-black text-[#212c46]">{item.actual}%</span>
              </div>
            </div>
        ))}
      </div>
    </GlassCard>
  );
};

const UrgentTasks = () => (
  <GlassCard className="bg-gradient-to-b from-white to-[#f3f3f1]/20 border-[#7a8b95]/30">
    <div className="flex justify-between items-center mb-4 relative z-10">
      <h2 className="text-base font-black text-[#212c46] flex items-center gap-2 uppercase tracking-tight">
          <AlertCircle size={16} className="text-[#932c2e]" /> Critical Action
      </h2>
      <span className="text-[8px] font-black bg-[#932c2e]/10 text-[#932c2e] px-3 py-1 rounded-full uppercase tracking-widest">3 Tasks</span>
    </div>
    <div className="space-y-2.5 relative z-10">
        {[
          { title: "Approve Quality Manual - ISO9001", type: "Document Approval", icon: ShoppingCart, urgent: true, color: 'text-[#932c2e]', bg: 'bg-[#932c2e]/10' },
          { title: "Review Audit Report - Q1", type: "Audit Review", icon: Target, urgent: true, color: 'text-[#d96245]', bg: 'bg-[#d96245]/10' },
          { title: "Review Q3 Management Cycle", type: "Management Review", icon: Megaphone, urgent: false, color: 'text-[#3f809e]', bg: 'bg-[#3f809e]/10' },
        ].map((task, i) => (
          <div key={i} className="p-3 bg-white/70 rounded-xl border border-[#f3f3f1]/30 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
            <div className={`p-2 rounded-lg ${task.bg} ${task.color} shrink-0`}>
                <task.icon size={12}/>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-[#1f2a44] tracking-tight truncate">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[8px] text-[#7a8b95] font-bold uppercase">{task.type}</p>
                    {task.urgent && <span className="text-[7px] font-black text-[#a94228] uppercase animate-pulse">Critical</span>}
                </div>
            </div>
          </div>
        ))}
    </div>
    <button className="w-full mt-4 py-3 bg-[#1f2a44] text-white text-[9px] font-bold uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-widest hover:bg-[#254268]">
        <Calendar size={12} /> Schedule
    </button>
  </GlassCard>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#212c46] border border-[#b58c4f]/40 p-3 rounded-xl shadow-lg font-sans text-white text-[11px] z-50">
        <p className="font-extrabold text-[10px] uppercase tracking-wider text-[#f3e5ab] border-b border-white/10 pb-1 mb-1.5">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="font-semibold flex items-center gap-1.5" style={{ color: item.color || '#fff' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: item.color || '#3f809e' }} />
            <span className="font-bold text-gray-300">{item.name || 'Value'}:</span> {item.value.toLocaleString()}{item.name === 'Attendance Rate' ? '%' : ' Employees'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};



const NewFamilyMembers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    const members = [
      { name: 'พิมพพรรณ สวยงาม', role: 'UX/UI DESIGNER', dept: 'Innovation', joinDate: '01 Jan', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
      { name: 'ธนวัฒน์ มาดี', role: 'FULLSTACK DEV', dept: 'Digital Tech', joinDate: '02 Jan', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { name: 'เกริกพล ขยันงาน', role: 'HR SPECIALIST', dept: 'People', joinDate: '05 Jan', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
    ];

    const openWelcome = (m: any) => {
      setSelectedMember(m);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] pointer-events-none transform rotate-12 z-0">
          <Users size={240} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
           <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
             <UserPlus size={16} className="text-[#3f809e]" /> OUR NEW FAMILY MEMBERS
           </h2>
           <span className="text-[9px] font-black text-[#3f809e] bg-[#3f809e]/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#3f809e]/20 hover:bg-[#3f809e] hover:text-white transition-colors cursor-pointer">WELCOME HOME</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {members.map((m, i) => (
            <div key={i} onClick={() => openWelcome(m)} className="bg-white rounded-2xl border border-[#f3f3f1]/30 hover:border-[#3f809e]/60 p-5 flex flex-col items-center relative shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="relative mb-4">
                <img src={m.img} alt={m.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div className="absolute -bottom-2 -right-2 bg-[#4d87a8] p-1.5 rounded-lg text-white shadow-sm border-2 border-white group-hover:scale-110 transition-transform">
                  <Sparkles size={12} />
                </div>
              </div>
              <h3 className="text-[#212c46] font-bold text-sm mb-1">{m.name}</h3>
              <p className="text-[#4d87a8] text-[9px] font-black uppercase tracking-widest">{m.role}</p>
              <p className="text-[#7a8b95] text-[10px] font-medium mt-0.5">{m.dept}</p>
              <div className="w-full h-px bg-[#f3f3f1] my-4" />
              <div className="w-full flex justify-between items-center text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">
                <span>JOIN</span>
                <span className="text-[#212c46]">{m.joinDate}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><Sparkles size={16} className="text-[#b58c4f]"/> Welcome to the Team</span>}
        width="max-w-md"
      >
        <div className="p-6">
          {selectedMember && (
             <div className="text-center mb-6">
               <img src={selectedMember.img} alt={selectedMember.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#3f809e]/20 shadow-md mx-auto mb-4" />
               <h3 className="text-xl font-black text-[#212c46] mb-1">{selectedMember.name}</h3>
               <p className="text-[#4d87a8] text-xs font-black uppercase tracking-widest mb-1">{selectedMember.role}</p>
               <p className="text-[#7a8b95] text-xs font-medium">{selectedMember.dept}</p>
             </div>
          )}
          
          <div className="mb-6 shrink-0">
            <label className="block text-[10px] font-black text-[#212c46] uppercase tracking-widest mb-2 text-center">Say Hello & Welcome</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 p-3 pr-12 border border-[#cdd0db] rounded-xl text-sm focus:border-[#4d87a8] focus:ring-1 focus:ring-[#4d87a8] outline-none transition-all resize-none bg-[#f3f3f1]/50 font-medium shadow-inner"
                placeholder="Type a welcome message..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#4d87a8] hover:bg-[#3f809e] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-3 border-b border-[#f3f3f1] pb-2">Recent Greetings (3)</h4>
             <div className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-[#212c46]">วิชัย สุขใจ</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">10 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Welcome to the team! Glad to have you here.</p>
                </div>
                <div className="bg-[#f0f7fa] p-3 rounded-xl border border-[#bce0f0] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-[#212c46]">LAW Team</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">20 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">We are excited to see your impact in the Innovation department!</p>
                </div>
             </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};

const BirthdayWishes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);

    const birthdays = [
      { name: 'อภิรดี มีสุข', dept: 'Accounting', date: '10 Jan', img: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop' },
      { name: 'ชวาล ยิ่งใหญ่', dept: 'Logistics', date: '12 Jan', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop' },
    ];

    const openGreeting = (person?: any) => {
      setSelectedPerson(person || birthdays[0]);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#eaeaec] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <PartyPopper size={200} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <PartyPopper size={20} className="text-[#d96245]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            BIRTHDAY<br/>WISHES
          </h2>
        </div>
        <div className="space-y-3 flex-1 relative z-10">
          {birthdays.map((b, i) => (
            <div key={i} onClick={() => openGreeting(b)} className="flex items-center gap-4 bg-white border border-[#f3f3f1]/30 hover:border-[#d96245]/60 rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <img src={b.img} alt={b.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shadow-black/10 group-hover:scale-105 transition-transform" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[#212c46] font-bold text-xs truncate">{b.name}</h3>
                <p className="text-[#7a8b95] text-[10px] font-medium truncate">{b.dept}</p>
              </div>
              <div className="text-[10px] font-black text-[#d96245] tracking-widest shrink-0">
                {b.date}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => openGreeting()} className="mt-4 w-full bg-[#b7a159] hover:bg-[#a94228] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-md relative z-10">
          <Send size={14} /> POST GREETING CARD
        </button>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><PartyPopper size={16} className="text-[#d96245]"/> Birthday Wishes</span>}
        width="max-w-md"
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col bg-[#fdfbf7] relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f9ecd3] to-transparent z-0 opacity-50"></div>
          {selectedPerson && (
             <div className="flex flex-col items-center gap-3 mb-6 relative z-10 pt-4">
               <img src={selectedPerson.img} alt={selectedPerson.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
               <div className="text-center">
                  <p className="text-[10px] text-[#b7a159] font-bold uppercase tracking-[0.2em] mb-1">Happy Birthday</p>
                  <h3 className="text-xl font-serif font-black text-[#212c46]">{selectedPerson.name}</h3>
                  <p className="text-[11px] font-medium text-[#7a8b95] mt-1">{selectedPerson.dept} • {selectedPerson.date}</p>
               </div>
             </div>
          )}
          
          <div className="mb-6 shrink-0 relative z-10">
            <label className="block text-[10px] font-black text-[#b7a159] uppercase tracking-widest mb-2 text-center">Post a Greeting</label>
            <div className="relative shadow-sm rounded-xl overflow-hidden border border-[#e8dcc4]">
              <textarea 
                className="w-full h-24 p-3 pr-12 text-sm focus:outline-none resize-none bg-white font-medium placeholder:text-[#d3ccc0] font-serif"
                placeholder="Write your wishes here..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#d96245] hover:bg-[#b7a159] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 relative z-10">
             <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-3 text-center opacity-60">Greetings Board</h4>
             <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full bg-[#f3f3f1] border border-[#f3f3f1] overflow-hidden shrink-0">
                        <img src="https://i.pravatar.cc/150?u=10" alt="User" />
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-[#212c46]">วิชัย สุขใจ</span>
                        <span className="block text-[9px] text-[#7a8b95]">10 mins ago</span>
                     </div>
                  </div>
                  <p className="text-xs text-[#554e4c] leading-relaxed font-serif text-center italic">"Wishing you a fantastic birthday and a wonderful year ahead! 🎉"</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full bg-[#f3f3f1] border border-[#f3f3f1] overflow-hidden shrink-0">
                        <img src="https://i.pravatar.cc/150?u=11" alt="User" />
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-[#212c46]">สมศรี ยินดี</span>
                        <span className="block text-[9px] text-[#7a8b95]">1 hr ago</span>
                     </div>
                  </div>
                  <p className="text-xs text-[#554e4c] leading-relaxed font-serif text-center italic">"Happy Birthday! May all your dreams come true! 🎂🥳"</p>
                </div>
                 <div className="bg-[#fffdf7] p-4 rounded-xl border border-[#fce9aa] shadow-sm relative">
                  <div className="absolute -top-3 -right-3 text-[#fce9aa] opacity-40 rotate-[15deg]">
                    <PartyPopper size={60} strokeWidth={1} />
                  </div>
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                     <div className="w-8 h-8 rounded-full bg-[#f3f3f1] border border-[#eaeaec] overflow-hidden shrink-0">
                        <img src="https://i.pravatar.cc/150?u=12" alt="User" />
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-[#212c46]">CEO Office</span>
                        <span className="block text-[9px] text-[#7a8b95]">2 hrs ago</span>
                     </div>
                  </div>
                  <p className="text-xs text-[#d98145] leading-relaxed font-serif font-medium text-center italic relative z-10">"สุขสันต์วันเกิด ขอให้มีความสุขความเจริญ เป็นสมาชิกที่น่ารักของครอบครัวเราตลอดไป 🎁"</p>
                </div>
             </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};

const CorporateNews = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);

    const news = [
      { category: 'COMPANY UPDATE', title: 'ประกาศผลประกอบการ ไตรมาส 1 / 2026', date: '08 May 2026', preview: 'ผลประกอบการไตรมาสแรกเติบโตขึ้น 15% ขอบคุณพนักงานทุกท่านที่ช่วย...', fullText: '', author: 'CEO OFFICE', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' },
      { category: 'HR ANNOUNCEMENT', title: 'อัปเดตนโยบาย Work from Anywhere', date: '05 May 2026', preview: 'นโยบายการทำงานจากที่ใดก็ได้ได้ถูกปรับปรุงเพื่อเพิ่มความยืดหยุ่นให้...', fullText: '', author: 'PEOPLE TEAM', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800' },
      { category: 'EVENT', title: 'เชิญร่วมงาน Townhall ประจำเดือน', date: '01 May 2026', preview: 'พบปะพูดคุยกับผู้บริหารและรับฟังทิศทางของบริษัท พร้อมกิจกรรม...', fullText: '', author: 'INTERNAL COMMS', image: 'https://images.unsplash.com/photo-1511632765486-a01c80cf59af?q=80&w=800' },
    ];

    const openNews = (n: any) => {
      setSelectedNews(n);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 flex flex-col relative overflow-hidden">
        <div className="absolute left-[35%] top-[-30%] opacity-[0.02] pointer-events-none transform rotate-12 z-0">
          <Globe size={380} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
            <Globe size={16} className="text-[#3f809e]" /> CORPORATE NEWS BOARD
          </h2>
          <div className="flex gap-2">
            <button className="text-[10px] font-black text-white bg-gradient-to-r from-[#d96245] to-[#b7a159] hover:from-[#c25035] hover:to-[#a38e4a] px-4 py-2 rounded-lg uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 outline-none hover:scale-105 active:scale-95 border border-[#d96245]/20">
              <Plus size={14} /> ADD UPDATE
            </button>
            <button className="text-[10px] font-black text-[#212c46] bg-white px-4 py-2 rounded-lg uppercase tracking-widest border border-[#f3f3f1] hover:bg-[#f3f3f1] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3f809e]">ALL</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {news.map((n, i) => (
            <div key={i} onClick={() => openNews(n)} className="flex flex-col bg-white border border-[#f3f3f1] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="relative h-36 w-full overflow-hidden">
                <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-2.5 py-1 rounded-md shadow-sm">{n.category}</span>
                   <span className="text-white/90 text-[10px] font-bold tracking-wider drop-shadow-md">{n.date}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[#212c46] font-bold text-sm mb-2 line-clamp-2 leading-snug group-hover:text-[#3f809e] transition-colors">{n.title}</h3>
                <p className="text-[#7a8b95] text-[11px] font-medium line-clamp-2 leading-relaxed flex-1">{n.preview}</p>
                <div className="mt-4 pt-3 border-t border-[#f3f3f1] flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#a0abb2] uppercase tracking-widest flex items-center gap-1.5"><User size={10}/> {n.author}</span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#d96245] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                    READ <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2"><Globe size={16} className="text-[#3f809e]"/> Corporate News</span>}
        width="max-w-2xl"
      >
        <div className="p-0 overflow-hidden flex flex-col max-h-[85vh]">
          {selectedNews && (
             <>
                <div className="relative h-48 w-full shrink-0">
                   <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-3 py-1 rounded-md shadow-sm">{selectedNews.category}</span>
                        <span className="text-white/80 text-xs font-bold">{selectedNews.date}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
                   </div>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="whitespace-pre-wrap text-[#4a5568] text-sm leading-relaxed mb-8">
                    {selectedNews.fullText}
                  </div>
                  <div className="bg-[#f3f3f1] rounded-xl p-4 border border-[#f3f3f1] flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#f3f3f1] rounded-full flex items-center justify-center border border-[#f3f3f1] shrink-0">
                        <User size={18} className="text-[#7a8b95]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Published By</p>
                       <p className="text-sm font-bold text-[#212c46]">{selectedNews.author}</p>
                     </div>
                  </div>
                </div>
             </>
          )}
        </div>
      </DraggableModal>
      </>
    );
};

const CorporateAlert = () => {
    const alerts = [
      { title: 'การประเมินผลงานรอบครึ่งปี', desc: 'Mid-year review starts Monday. Ensure all self-evaluations are done.', icon: CalendarDays, color: '#932c2e', bg: '#932c2e26' },
      { title: 'สวัสดิการประกันกลุ่มใหม่', desc: 'Update on group insurance plan for FY2025 available now.', icon: Info, color: '#3f809e', bg: '#3f809e26' },
    ];

    return (
      <GlassCard className="bg-white border-[#f3f3f1] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.02] pointer-events-none transform -rotate-12 z-0">
          <Megaphone size={220} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <Megaphone size={20} className="text-[#932c2e]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            CORPORATE<br/>ALERT
          </h2>
        </div>
        <div className="space-y-4 flex-1 relative z-10">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 border border-transparent rounded-xl p-4 transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: alert.bg }}>
              <alert.icon size={16} className={`shrink-0 mt-0.5`} style={{ color: alert.color }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[13px] mb-1 leading-tight" style={{ color: alert.color }}>{alert.title}</h3>
                <p className="text-[10px] font-medium leading-relaxed font-sans" style={{ color: alert.color, opacity: 0.85 }}>{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
};

const CEODashboard = () => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revRes, expRes] = await Promise.all([
          api.post('read', 'SaleRevenue', null, { limit: 2000, offset: 0 }),
          api.post('read', 'CostExpense', null, { limit: 2000, offset: 0 })
        ]);
        if (revRes?.data?.items) setRevenueData(revRes.data.items);
        else {
          const c = localStorage.getItem('saleRevenueCache');
          if (c) setRevenueData(JSON.parse(c));
        }
        if (expRes?.data?.items) setExpenseData(expRes.data.items);
        else {
          const c = localStorage.getItem('costExpenseCache');
          if (c) setExpenseData(JSON.parse(c));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const metrics = useMemo(() => {
    let totalRev = 0;
    let totalCogs = 0;
    let totalExp = 0;

    revenueData.forEach(row => {
      const val = parseFloat((row['มูลค่าขาย(บาท)'] || '0').toString().replace(/,/g, ''));
      if (!isNaN(val)) totalRev += val;
      
      const qty = parseFloat((row['ยอดขาย (ชิ้น)'] || '0').toString().replace(/,/g, ''));
      const cost = parseFloat((row['ราคาทุน'] || '0').toString().replace(/,/g, ''));
      if (!isNaN(qty) && !isNaN(cost)) totalCogs += (qty * cost);
    });

    expenseData.forEach(row => {
      const e = parseFloat((row['ต้นทุนและค่าใช้จ่ายรวม'] || '0').toString().replace(/,/g, ''));
      if (!isNaN(e)) totalExp += e;
    });

    const totalMargin = totalRev - totalCogs;
    const netProfit = totalMargin - totalExp;

    // Monthly Grouping
    const monthlyRev: Record<string, number> = {};
    const monthlyExp: Record<string, number> = {};
    
    revenueData.forEach(row => {
      const d = new Date(row['วันที่'] || row['Date'] || new Date());
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleString('en-US', { month: 'short' });
      monthlyRev[key] = (monthlyRev[key] || 0) + parseFloat((row['มูลค่าขาย(บาท)'] || '0').toString().replace(/,/g, '')) || 0;
    });

    expenseData.forEach(row => {
      const d = new Date(row['mm/dd/yyyy'] || row['วันที่'] || new Date());
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleString('en-US', { month: 'short' });
      monthlyExp[key] = (monthlyExp[key] || 0) + parseFloat((row['ต้นทุนและค่าใช้จ่ายรวม'] || '0').toString().replace(/,/g, '')) || 0;
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const outputChart = months.filter(m => monthlyRev[m] || monthlyExp[m]).map(m => ({
      name: m,
      output: monthlyRev[m] || 0,
      target: monthlyExp[m] || 0
    }));

    const barChart = [
      { name: 'COGS', value: totalCogs, fill: '#9e2d26' },
      { name: 'OPEX', value: totalExp, fill: '#c1451f' }
    ];

    const healthScore = totalRev > 0 ? Math.min(100, Math.max(0, (netProfit / totalRev) * 100)) : 0;
    const gauge = [
      { name: 'Score', value: Number(healthScore.toFixed(1)) },
      { name: 'Remaining', value: Number((100 - healthScore).toFixed(1)) }
    ];

    return { totalRev, totalMargin, totalExp, netProfit, outputChart, barChart, gauge, healthScore };
  }, [revenueData, expenseData]);

  const outputData = metrics.outputChart.length ? metrics.outputChart : [
    { name: 'Jan', output: 4200, target: 4000 },
    { name: 'Feb', output: 4500, target: 4100 },
    { name: 'Mar', output: 4800, target: 4400 },
  ];

  const gaugeData = metrics.totalRev > 0 ? metrics.gauge : [
    { name: 'Score', value: 99.4 },
    { name: 'Remaining', value: 0.6 }
  ];

  const barData = metrics.totalRev > 0 ? metrics.barChart : [
    { name: 'COGS', value: 45, fill: '#9e2d26' },
    { name: 'OPEX', value: 25, fill: '#c1451f' }
  ];

  return (
    <div className="w-full mt-2 mb-2 font-mono flex flex-col gap-6">
      {/* Executive Summary Widget (Minimal) */}
      <div className="mb-8 font-sans">
        <h2 className="text-[13px] font-black text-[#2f3946] mb-4 uppercase tracking-[0.1em] flex items-center gap-2 font-mono">
          <Briefcase size={16} className="text-[#b58c4f]" /> Executive Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard 
            title="Total Sale Margin" 
            value={`฿ ${(metrics.totalMargin / 1000000).toFixed(2)}M`} 
            color="#657f4d" 
            icon={TrendingUp} 
            description="+8.2% vs Last Quarter" 
          />
          <KpiCard 
            title="Total Expenses" 
            value={`฿ ${(metrics.totalExp / 1000000).toFixed(2)}M`} 
            color="#932c2e" 
            icon={AlertCircle} 
            description="+1.5% vs Budget" 
          />
          <KpiCard 
            title="Net Profit (EBITDA)" 
            value={`฿ ${(metrics.netProfit / 1000000).toFixed(2)}M`} 
            color="#0ea5e9" 
            icon={DollarSign} 
            description="+12.4% vs Target" 
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end pb-1 mb-1 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <LayoutGrid size={24} className="text-[#d2963f]" />
            <h1 className="text-xl md:text-2xl font-bold font-sans text-[#2f3946] tracking-widest uppercase">CEO PORTAL <span className="text-[#899ca8]">DASHBOARD</span></h1>
          </div>
          <p className="text-[9px] md:text-[10px] text-[#718698] tracking-[0.2em] font-black uppercase">REAL-TIME D3 VISUALIZATIONS COMPARING BUSINESS KPIS & OPERATIONS</p>
        </div>
        <div className="flex items-end gap-6 shrink-0">
          <div className="flex flex-col items-end gap-1 mb-1">
            <span className="text-[9px] text-[#718698] uppercase font-black tracking-widest">Last Integrity Scan</span>
            <span className="text-[13px] font-bold text-[#2f3946] tracking-widest">10:11:33</span>
          </div>
          <button className="flex items-center gap-2 bg-[#f2f4f7] hover:bg-[#e4e9f0] transition-colors border border-[#dce0e6] text-[#2f3946] px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] shadow-sm">
            <RefreshCcw size={14} /> Scan Systems
          </button>
        </div>
      </div>

      {/* Grid of 3 panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: Gauge */}
        <div className="bg-[#f5f7f9] rounded-xl p-5 border border-[#eceef2] flex flex-col items-center justify-center relative min-h-[220px]">
          <div className="absolute top-2 w-full h-[240px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={gaugeData}
                   cx="50%"
                   cy="55%"
                   startAngle={180}
                   endAngle={0}
                   innerRadius={80}
                   outerRadius={110}
                   dataKey="value"
                   stroke="none"
                 >
                   <Cell fill="url(#colorGauge)" />
                   <Cell fill="#a2b3aa" /> 
                 </Pie>
                 <defs>
                   <linearGradient id="colorGauge" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#d59a43" />
                     <stop offset="100%" stopColor="#879f8b" />
                   </linearGradient>
                 </defs>
               </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full mt-2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#192739] font-sans tracking-tight">{revenueData.length ? metrics.healthScore.toFixed(1) : '99.4'}%</h2>
            <p className="text-[10px] text-[#718698] font-bold uppercase mt-2 tracking-widest font-sans">BUSINESS HEALTH SCORE</p>
          </div>
        </div>

        {/* Panel 2: Bar Chart */}
        <div className="bg-[#f5f7f9] rounded-xl p-5 border border-[#eceef2] flex flex-col items-center justify-center relative min-h-[220px]">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#2f3946] mb-2 text-center absolute top-5 w-full leading-tight">EXPENSES BY<br/>CATEGORY (MB)</h3>
          <div className="mt-10 w-full h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="none" vertical={false} stroke="#dce0e6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#718698', fontWeight: 'bold' }} axisLine={{ stroke: '#dce0e6' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#718698', fontWeight: 'bold' }} axisLine={false} tickLine={false} tickCount={4} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #eaeaec', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'monospace' }} 
                  formatter={(val: number) => [`฿ ${(val/1000000).toFixed(2)} MB`, 'Value']}
                />
                <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={32}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 3: Line Chart */}
        <div className="bg-[#f5f7f9] rounded-xl p-5 border border-[#eceef2] flex flex-col items-center justify-center relative min-h-[220px]">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#2f3946] mb-2 text-center absolute top-5 w-full leading-tight">MONTHLY REVENUE<br/>VS TARGET</h3>
          <div className="mt-10 w-full h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outputData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce0e6" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#718698', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#718698', fontWeight: 'bold' }} axisLine={false} tickLine={false} tickCount={4} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #eaeaec', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  formatter={(val: number) => [`฿ ${(val/1000000).toFixed(2)} MB`]}
                />
                <Line type="monotone" dataKey="output" name="Revenue" stroke="#1e3f5a" strokeWidth={3} dot={{ r: 3, fill: '#1e3f5a', stroke: 'white' }} activeDot={{ r: 5 }} />
                <Line type="step" dataKey="target" name="Target (Expense)" stroke="#c1451f" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Home() {
  const { user } = useAuth();

  const currentUser = {
      name: user?.name || 'SMART LAW Developer',
      position: user?.role || 'LEAD COUNSEL',
      avatar: user?.avatar || 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  };

  // --- FLOATING QUICK ACTIONS MENU STATE ---
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'leave' | 'payslip' | 'appraisal' | 'approve' | null>(null);

  // Leave Form State Variables
  const [leaveType, setLeaveType] = useState('Annual Leave (ลาพักร้อน)');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [fileAttached, setFileAttached] = useState<File | null>(null);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);
  const [leaveId, setLeaveId] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  // Payslip Month Selection
  const [payslipMonth, setPayslipMonth] = useState('May 2026');

  // Manager Approve Leave Mock State
  const [pendingLeaves, setPendingLeaves] = useState([
    { id: 'LV-772983', employee: 'วรรณิศา ขยันดี', type: 'Sick Leave (ลาป่วย)', dates: '05 Jun - 06 Jun 2026', reason: 'อาหารเป็นพิษเฉียบพลัน มีใบรับรองแพทย์' },
    { id: 'LV-449102', employee: 'ทนงศักดิ์ วงศ์ดี', type: 'Annual Leave (ลาพักร้อน)', dates: '10 Jun - 12 Jun 2026', reason: 'พาครอบครัวไปกรองฝุ่นและพักผ่อนที่สังขละบุรี' },
    { id: 'LV-102930', employee: 'ณัฐพงษ์ ทองแท้', type: 'Personal Leave (ลากิจ)', dates: '15 Jun 2026', reason: 'ติดต่อธุระจดทะเบียนโอนกรรมสิทธิ์ที่ดินกรมที่ดิน' }
  ]);

  // Drag and Drop support
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileAttached(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileAttached(e.target.files[0]);
    }
  };

  // Submit Leave Request to actual Database (Calendar table in GAS and Firebase)
  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      alert('กรุณากรอกวันที่ และระบุเหตุผลการลาให้ครบถ้วนด้วยค่ะ');
      return;
    }
    setIsSubmittingLeave(true);
    
    const generatedId = `LV-${Math.floor(100000 + Math.random() * 900000)}`;
    setLeaveId(generatedId);

    const payload = {
      id: generatedId,
      startDate: startDate,
      endDate: endDate,
      title: `[ใบลา] ${currentUser.name} (${leaveType})`,
      type: 'Holiday',
      category: 'Leave',
      status: 'Pending',
      assignee: 'HR Operations',
      description: `ประเภท: ${leaveType} | เหตุผลการลา: ${reason} | ไฟล์แนบหลักฐาน: ${fileAttached ? fileAttached.name : 'ไม่มี'}`,
      createdBy: currentUser.name,
      color: 'bg-gradient-to-r from-[#ffe8e8] to-[#ffdcdc] text-[#932c2e] border-[#932c2e]/40'
    };

    try {
      // 1. Submit to Google Sheets (Calendar Table) & Sync to Firebase
      await api.post('write', 'Calendar', [payload]);

      // 2. Log this request inside AccessLogs
      const auditPayload = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        employeeId: user?.employeeId || 'EMP-1450',
        name: currentUser.name,
        action: 'LEAVE_SUBMIT',
        details: `Submitted Leave Request ${generatedId} from ${startDate} to ${endDate} (${leaveType})`
      };
      await api.post('write', 'AccessLogs', [auditPayload]);

      setLeaveSuccess(true);
    } catch (err) {
      console.error('System error submitting leave:', err);
      // Fallback works locally to ensure rich desktop demonstration
      setLeaveSuccess(true);
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const handleActionApproveLeave = (id: string, action: 'Approve' | 'Reject') => {
    setPendingLeaves(prev => prev.filter(item => item.id !== id));
    // Log the approval inside database
    const logDetails = `${action} leave request with ticket identifier: ${id}`;
    api.post('write', 'AccessLogs', [{
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      employeeId: user?.employeeId || 'MGR-2001',
      name: currentUser.name,
      action: action === 'Approve' ? 'LEAVE_APPROVED' : 'LEAVE_REJECTED',
      details: logDetails
    }]).catch(e => console.error('Failed to log leave approval:', e));
  };

  const resetLeaveForm = () => {
    setStartDate('');
    setEndDate('');
    setReason('');
    setFileAttached(null);
    setLeaveSuccess(false);
    setActiveModal(null);
  };

  return (
    <div className="pt-4 flex flex-col gap-5 animate-fadeIn px-4 sm:px-8 w-full relative">
      <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl text-[#212c46] tracking-tight uppercase font-exception-greeting leading-none">
                  Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141] font-medium">{currentUser.name}!</span>
              </h1>
              <p className="text-[#748ea1] text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1.5 leading-none">
                  <TrendingUp size={14} className="text-[#d96245]" /> Revenue Target: <span className="text-[#3f809e]">On Track (98.2%)</span>
              </p>
          </div>
          <div className="flex flex-row gap-3">
              <button className="bg-white text-[#212c46] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md border border-[#cdd0db]/50 transition-all flex items-center gap-2 hover:-translate-y-0.5 whitespace-nowrap">
                  <BarChart2 size={16} className="text-[#3f809e]" /> <span className="hidden sm:inline">Monthly Report</span>
              </button>
              <button className="bg-gradient-to-r from-[#3f809e] via-[#4d87a8] to-[#748ea1] text-white px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap">
                  <TrendingUp size={16} /> <span className="hidden sm:inline">Forecast</span>
              </button>
          </div>
      </div>

      {/* CEO PORTAL BOARD */}
      <CEODashboard />
    </div>
  );
}
