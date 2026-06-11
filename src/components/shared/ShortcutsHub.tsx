import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, BrainCircuit, ShieldAlert,
  Calendar as CalendarIcon, Zap, Users, FileText,
  Gift, Database, Briefcase, Settings, ArrowRightLeft
} from 'lucide-react';

const THEME = {
    bgMain: '#f3f3f1',
    primary: '#212c46',
    accent: '#a94228',
    gold: '#b58c4f',
    skyBlue: '#3f809e',
    dustyBlue: '#7a8b95',
    danger: '#932c2e',
};

const SHORTCUTS = [
  {
    icon: Heart,
    title: "HEALTH CLEARANCE",
    subtitle: "ประวัติ/จำหน่ายสุขภาพ",
    color: THEME.danger,
    path: "/health",
    isRed: false
  },
  {
    icon: BrainCircuit,
    title: "AI HR COPILOT",
    subtitle: "ปัญญาประดิษฐ์สืบค้น",
    color: THEME.danger,
    path: "/copilot",
    isRed: false
  },
  {
    icon: ArrowRightLeft,
    title: "LEAVE & ABSENCES",
    subtitle: "คำขอลาและประวัติ",
    color: THEME.danger,
    path: "/leaves",
    isRed: false
  },
  {
    icon: ShieldAlert,
    title: "SAFETY & RISKS",
    subtitle: "การอนุมัติ/ความปลอดภัย",
    color: THEME.danger,
    path: "/safety",
    isRed: false
  },
  {
    icon: CalendarIcon,
    title: "CALENDAR GRID",
    subtitle: "รอบวันกิจกรรมบริษัท",
    color: THEME.danger,
    path: "/calendar",
    isRed: false
  },
  {
    icon: Zap,
    title: "ATTENDANCE NODE",
    subtitle: "ระบบลงเวลาเข้าทำงาน",
    color: THEME.danger,
    path: "/attendance",
    isRed: false
  },
  {
    icon: Users,
    title: "STAFF DIRECTORY",
    subtitle: "สำรวจแผนกรายพนักงาน",
    color: THEME.danger,
    path: "/employees",
    isRed: false
  },
  {
    icon: FileText,
    title: "LEGAL DIGEST AI",
    subtitle: "วิเคราะห์กฎหมาย/ข้อตกลง",
    color: THEME.danger,
    path: "/legal",
    isRed: false
  },
  {
    icon: Gift,
    title: "PAYROLL & MASTER",
    subtitle: "สิทธิประโยชน์พนักงาน",
    color: THEME.danger,
    path: "/payroll",
    isRed: false
  },
  {
    icon: Database,
    title: "CONFIG PANEL",
    subtitle: "ตั้งค่าโครงสร้างฐานข้อมูล",
    color: THEME.danger,
    path: "/config",
    isRed: false
  },
  {
    icon: Briefcase,
    title: "ONBOARDING PORTAL",
    subtitle: "ต้อนรับพนักงานเข้ามาใหม่",
    color: THEME.danger,
    path: "/onboarding",
    isRed: false
  },
  {
    icon: Settings,
    title: "CONTRACT MANAGER",
    subtitle: "สัญญาจ้างและสิ่งพิมพ์",
    color: THEME.danger,
    path: "/contracts",
    isRed: false
  }
];

export const ShortcutsHub = () => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eaeaec] shadow-sm mb-5">
            <div className="mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#932c2e]/20 flex items-center justify-center bg-[#932c2e]/5">
                    <span className="text-[#932c2e] font-black italic text-lg leading-none">@</span>
                </div>
                <div>
                   <h2 className="text-[#212c46] font-black text-sm uppercase tracking-widest leading-none drop-shadow-sm flex items-center gap-2">
                       EXPLORE BY SECTOR <span className="text-[#7a8b95] text-xs font-medium normal-case tracking-normal">/</span> <span className="text-[#7a8b95] text-xs font-bold font-sans">สำรวจแยกตามหมวดหมู่</span>
                   </h2>
                   <p className="text-[10px] text-[#7a8b95] font-black tracking-[0.2em] uppercase mt-1">QUICK SHORTCUT HUBS TO CENTRAL DATABASE SECTORS AND PROCESSES</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {SHORTCUTS.map((sc, i) => (
                    <button 
                       key={i} 
                       onClick={() => navigate(sc.path)}
                       className="flex flex-col items-center justify-center p-4 md:p-5 rounded-3xl border border-[#eaeaec] bg-white transition-all duration-300 hover:-translate-y-1 group hover:bg-[#3f809e] hover:border-[#3f809e] hover:shadow-lg hover:shadow-[#3f809e]/20"
                    >
                        <sc.icon 
                            size={32} 
                            strokeWidth={1.5}
                            className="mb-3 transition-transform duration-300 group-hover:scale-110 text-[#932c2e] group-hover:text-white" 
                        />
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-center leading-tight text-[#212c46] group-hover:text-white transition-colors">{sc.title}</span>
                        <span className="text-[8px] md:text-[9px] font-bold mt-1.5 text-center leading-none text-[#7a8b95] group-hover:text-white/80 transition-colors">{sc.subtitle}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
