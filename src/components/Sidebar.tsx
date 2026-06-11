import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Library,
  Shield,
  Scale
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { useVisibility } from '../context/ModuleVisibilityContext';
import { useLanguage } from '../context/LanguageContext';
import { MENU_ITEMS, MenuItem } from '../config/menu';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const CATEGORIES = [
  'ADMINISTRATION'
];

const CATEGORIES_TH: Record<string, string> = {
  'ADMINISTRATION': 'การจัดการระบบ'
};

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const { visibility } = useVisibility();
  const { t } = useLanguage();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCollapsed]);

  // Determine if a parent should be active based on current path and its subitems
  const isItemActive = (item: MenuItem) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(sub => sub.path && location.pathname === sub.path);
    }
    return false;
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (isCollapsed) return; // Don't allow expanding when collapsed
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // When expanding sidebar, maybe show active parents
  useEffect(() => {
    if (!isCollapsed) {
      const newExpanded = { ...expandedItems };
      MENU_ITEMS.forEach(item => {
        if (isItemActive(item) && item.subItems) {
          newExpanded[item.id] = true;
        }
      });
      setExpandedItems(newExpanded);
    }
  }, [location.pathname, isCollapsed]); // Only recompute on significant changes

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 300 }}
      className="relative flex h-screen flex-col bg-gradient-to-b from-[#1d2636] to-[#0F172A] shadow-2xl z-20 custom-scrollbar font-technical"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-[#212c46] text-[#b58c4f] shadow-lg border border-[#b58c4f]/20 hover:bg-[#b58c4f] hover:text-[#212c46] hover:shadow-[0_0_15px_rgba(181,140,79,0.5)] transition-all focus:outline-none active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo Area */}
      <div className="flex h-24 items-center justify-start px-6 shrink-0">
        <div className="flex items-center gap-3 pr-2">
          <div className="relative flex h-10 w-10 items-center justify-center transition-transform duration-500 hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] shrink-0">
            <img src="https://cdn-icons-png.freepik.com/512/17086/17086643.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" referrerPolicy="no-referrer" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-[4px] text-[24px] font-black tracking-tighter font-exception-system transform scale-x-105 origin-left leading-none" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                <span className="text-white">CEO</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]">PORTAL</span>
              </div>
              <div className="flex items-center mt-2 group" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="w-3 h-[2px] bg-gradient-to-r from-[#0ea5e9] to-transparent mr-2" />
                <span className="text-[9px] font-bold text-[#7a8b95] group-hover:text-[#0ea5e9] transition-colors tracking-[0.2em] uppercase leading-none drop-shadow-md">
                  {t('EXECUTIVE DASHBOARD', 'ศูนย์ข้อมูลผู้บริหาร')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-6 sidebar-scrollbar">
        
        {/* TOP LEVEL BUTTONS */}
        <div className="space-y-2">
          {MENU_ITEMS.filter(item => item.category === 'TOP' && visibility[item.id] !== false).map(item => {
            const Icon = item.icon || LayoutDashboard;
            const active = isItemActive(item);
            const itemName = t(item.name, item.nameTh || item.name);
            return (
              <NavLink
                key={item.id}
                to={item.path || '/'}
                className={twMerge(clsx(
                  "group flex items-center rounded-xl px-4 py-2.5 text-[13px] font-black uppercase tracking-widest transition-all",
                  active
                    ? "bg-gradient-to-r from-[#3f809e] to-[#4d87a8] text-white shadow-md shadow-[#3f809e]/20" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                  isCollapsed && "justify-center px-0"
                ))}
                title={isCollapsed ? itemName : undefined}
              >
                <Icon size={18} className={clsx("shrink-0", isCollapsed ? "mr-0" : "mr-4")} />
                {!isCollapsed && <span>{itemName}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Categories Level */}
        {CATEGORIES.map(catName => {
          const catItems = MENU_ITEMS.filter(item => item.category === catName && visibility[item.id] !== false);
          if (catItems.length === 0) return null;

          return (
            <div key={catName} className="space-y-2">
              {!isCollapsed && (
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2 tracking-widest">
                  {t(catName, CATEGORIES_TH[catName] || catName)}
                </h3>
              )}
              <div className="space-y-1">
                {catItems.map((item) => {
                  const Icon = item.icon || Users;
                  const active = isItemActive(item);
                  const isExpanded = !!expandedItems[item.id] && !isCollapsed;
                  const itemName = t(item.name, item.nameTh || item.name);
                  
                  const visibleSubItems = item.subItems?.filter(s => visibility[s.id] !== false) || [];

                  return (
                    <div key={item.id} className="flex flex-col">
                      {/* Parent Item */}
                      {visibleSubItems.length > 0 ? (
                        <div
                          onClick={(e) => toggleExpand(item.id, e)}
                          className={twMerge(clsx(
                            "cursor-pointer group flex items-center rounded-xl px-4 py-2 text-[12px] font-bold uppercase tracking-widest transition-all",
                            active 
                              ? "text-white bg-white/5" 
                              : "text-slate-300 hover:bg-white/5 hover:text-white",
                            isCollapsed && "justify-center px-0"
                          ))}
                          title={isCollapsed ? itemName : undefined}
                        >
                          <Icon size={16} className={clsx("shrink-0", "text-slate-400 group-hover:text-white", isCollapsed ? "mr-0" : "mr-4", active && "text-white")} />
                          
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 truncate">{itemName}</span>
                              <div className="w-5 h-5 flex items-center justify-center">
                                {isExpanded ? <ChevronUp size={14} className={active ? "text-white/80" : "text-slate-500"} /> : <ChevronDown size={14} className={active ? "text-white/80" : "text-slate-500"} />}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <NavLink
                          to={item.path || '/'}
                          className={twMerge(clsx(
                            "group flex items-center rounded-xl px-4 py-2 text-[12px] font-bold uppercase tracking-widest transition-all",
                            active 
                              ? "bg-gradient-to-r from-[#3f809e] to-[#4d87a8] text-white shadow-md shadow-[#3f809e]/20" 
                              : "text-slate-300 hover:bg-white/5 hover:text-white",
                            isCollapsed && "justify-center px-0"
                          ))}
                          title={isCollapsed ? itemName : undefined}
                        >
                          <Icon size={16} className={clsx("shrink-0", "text-slate-400 group-hover:text-white", isCollapsed ? "mr-0" : "mr-4", active && "text-white")} />
                          {!isCollapsed && <span className="flex-1 truncate">{itemName}</span>}
                        </NavLink>
                      )}

                      {/* Sub Items */}
                      <AnimatePresence>
                        {isExpanded && visibleSubItems.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col overflow-hidden ml-9 mt-1 space-y-0.5"
                          >
                            {visibleSubItems.map((subItem) => (
                              <NavLink
                                key={subItem.id}
                                to={subItem.path}
                                className={({ isActive }) => twMerge(clsx(
                                  "group flex items-center gap-2 py-1.5 px-3 rounded-lg text-[11px] font-bold uppercase transition-all tracking-[0.05em]",
                                  isActive 
                                    ? "bg-gradient-to-r from-[#3f809e] to-[#4d87a8] text-white shadow-md shadow-[#3f809e]/20" 
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                ))}
                              >
                                {({ isActive }) => (
                                  <>
                                    <div className={twMerge(clsx(
                                      "w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300",
                                      isActive ? "bg-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-[#b58c4f] group-hover:scale-125"
                                    ))} />
                                    <span className="truncate">{t(subItem.name, subItem.nameTh || subItem.name)}</span>
                                  </>
                                )}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Actual User Profile Area */}
      {user && (
        <div className="p-4 shrink-0">
          <div className={clsx("flex items-center justify-between", isCollapsed ? "justify-center" : "gap-3")}>
            <div className="flex items-center gap-3 overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-10 w-10 shrink-0 rounded-full object-cover border border-[#b58c4f]/40"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#3f809e] to-[#4d87a8] text-white font-black uppercase text-[16px]">
                  {user.name.charAt(0)}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-[12px] font-black text-white uppercase tracking-widest">{user.name}</span>
                  <span className="truncate text-[9px] text-[#b58c4f] font-black uppercase tracking-[0.1em] mt-0.5">{user.role || 'LEAD DEVELOPER'}</span>
                  <span className="truncate text-[9px] text-slate-500 font-medium tracking-tight mt-0.5">{user.email || 'tallintelligence.dcc@gmail.com'}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button 
                onClick={logout} 
                className="p-2 text-slate-400 hover:text-[#932c2e] hover:bg-[#932c2e]/10 rounded-lg transition-colors shrink-0" 
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button 
              onClick={logout} 
              className="mt-4 w-full flex justify-center p-2 text-slate-400 hover:text-[#932c2e] hover:bg-[#932c2e]/10 rounded-lg transition-colors" 
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}

    </motion.aside>
  );
}

