import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, Box, Target, Bell, Globe, AlertTriangle, CheckCircle2, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [metricAlert, setMetricAlert] = useState<{type: 'spike' | 'drop', prev: number, curr: number, amount: number, isReady: boolean}>({type: 'spike', prev: 0, curr: 0, amount: 0, isReady: false});
  const notificationRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    // Check local storage for revenue data to compute drops/spikes
    const checkMetrics = () => {
      try {
        const cached = localStorage.getItem('saleRevenueCache');
        if (cached) {
          const revenueData = JSON.parse(cached);
          const monthlyRev: Record<string, number> = {};
          
          revenueData.forEach((row: any) => {
            const d = new Date(row['วันที่'] || row['Date'] || new Date());
            if (isNaN(d.getTime())) return;
            // Group by year-month for sorting
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyRev[key] = (monthlyRev[key] || 0) + parseFloat((row['มูลค่าขาย(บาท)'] || '0').toString().replace(/,/g, '')) || 0;
          });

          const sortedMonths = Object.keys(monthlyRev).sort();
          if (sortedMonths.length >= 2) {
            const currKey = sortedMonths[sortedMonths.length - 1];
            const prevKey = sortedMonths[sortedMonths.length - 2];
            const curr = monthlyRev[currKey];
            const prev = monthlyRev[prevKey];
            const diff = curr - prev;
            const percent = (Math.abs(diff) / prev) * 100;
            
            if (percent > 5) { // 5% threshold for significant drop/spike
              setMetricAlert({
                type: diff > 0 ? 'spike' : 'drop',
                prev: prev,
                curr: curr,
                amount: percent,
                isReady: true
              });
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkMetrics();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <header className="h-24 px-4 sm:px-8 flex flex-row items-center justify-between z-10 shrink-0 bg-transparent w-full">
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center shrink-0">
          <svg width="0" height="0" className="absolute">
            <linearGradient id="themeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop stopColor="#b58c4f" offset="0%" />
              <stop stopColor="#3f809e" offset="50%" />
              <stop stopColor="#4d87a8" offset="100%" />
            </linearGradient>
          </svg>
          <Target size={42} stroke="url(#themeGrad)" strokeWidth={2.6} className="drop-shadow-sm" />
        </div>
        <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 font-exception-header">
                <span className="font-black text-[#212c46] text-[25px] tracking-wide uppercase leading-none">{t('CEO', 'ผู้บริหารระดับสูง')}</span>
                <span className="font-bold text-[#4d87a8] text-[25px] tracking-wide uppercase leading-none">{t('PORTAL', 'พอร์ทัล')}</span>
                <span className="bg-[#b58c4f] hidden xl:block text-white text-[10px] font-black uppercase px-2 py-0.5 rounded ml-2 tracking-wider">{t('EXEC ENGINE', 'แกนผู้บริหาร')}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 font-exception-header">
                <div className="w-10 h-[2px] bg-[#b58c4f]"></div>
                <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.2em] leading-none">{t('EXECUTIVE MANAGEMENT DASHBOARD', 'กระดานข้อมูลการจัดการระดับสูง')}</span>
            </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-full shadow-sm p-1 pr-1.5 pl-6 gap-5 border border-[#cdd0db]/50 h-11">
              <div className="flex flex-col justify-center items-center">
                  <span className="text-[9px] font-black text-[#5f7ab7] uppercase tracking-[0.1em] leading-none mb-0.5">{currentTime.toLocaleDateString(language === 'en' ? 'en-US' : 'th-TH', { weekday: 'long' })}</span>
                  <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#022d41] to-[#214573] leading-none">{currentTime.toLocaleDateString(language === 'en' ? 'en-US' : 'th-TH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="bg-[#212c46] text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner h-full">
                  <Clock size={14} className="text-[#b58c4f]" strokeWidth={2.5} />
                  <span className="text-[12px] font-black font-mono tracking-widest mt-0.5">
                      {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
              </div>
          </div>
          <button 
              onClick={toggleLanguage}
              className="relative w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3f809e] hover:bg-[#f8f9fa] transition-all group border border-[#cdd0db]/50 hover:scale-105 shrink-0"
              title="Toggle Language"
          >
              <Globe size={18} className="group-hover:rotate-12 transition-transform" strokeWidth={2} />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-[#212c46] text-white px-1.5 py-0.5 rounded-full uppercase">
                 {language}
              </span>
          </button>
          <div className="relative hidden md:block" ref={notificationRef}>
              <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3f809e] hover:bg-[#f8f9fa] transition-all group border border-[#cdd0db]/50 hover:scale-105 shrink-0"
              >
                  <Bell size={18} className={clsx("transition-transform", showNotifications ? "text-[#b58c4f]" : "group-hover:rotate-12")} strokeWidth={2} />
                  <span className={clsx("absolute top-2.5 right-2.5 w-2 h-2 rounded-full shadow-[0_0_0_2px_#ffffff]", metricAlert.isReady && metricAlert.type === 'drop' ? 'bg-[#932c2e] animate-pulse' : 'bg-[#b58c4f]')}></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-[#eaeaec] overflow-hidden z-50 flex flex-col"
                  >
                    <div className="bg-[#f8f9fa] px-4 py-3 border-b border-[#eaeaec] flex justify-between items-center">
                      <span className="text-xs font-black text-[#212c46] uppercase tracking-widest">{t('NOTIFICATIONS', 'การแจ้งเตือน')}</span>
                      <span className="text-[10px] font-bold bg-[#3f809e] text-white px-1.5 py-0.5 rounded">3 {t('NEW', 'ใหม่')}</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar flex flex-col">
                        {metricAlert.isReady && (
                           <div className="p-4 border-b border-[#eaeaec]/50 hover:bg-[#f8f9fa] transition-colors cursor-pointer flex gap-3 items-start group">
                             <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", metricAlert.type === 'spike' ? "bg-[#657f4d]/10" : "bg-[#932c2e]/10")}>
                               {metricAlert.type === 'spike' ? (
                                  <TrendingUp size={14} className="text-[#657f4d] group-hover:rotate-12 transition-transform" />
                               ) : (
                                  <TrendingDown size={14} className="text-[#932c2e] group-hover:-rotate-12 transition-transform" />
                               )}
                             </div>
                             <div className="flex flex-col gap-1 w-full">
                               <div className="flex justify-between items-start">
                                 <span className={clsx("text-xs font-black uppercase tracking-wider", metricAlert.type === 'spike' ? 'text-[#657f4d]' : 'text-[#932c2e]')}>
                                   {metricAlert.type === 'spike' ? 'REVENUE SPIKE DETECTED' : 'REVENUE DROP DETECTED'}
                                 </span>
                                 <span className="text-[9px] font-bold text-[#b58c4f]">Just Now</span>
                               </div>
                               <span className="text-[10px] font-medium text-[#7a8b95] leading-relaxed">
                                 Revenue shows a significant {metricAlert.type} of {metricAlert.amount.toFixed(1)}% compared to the previous month.
                               </span>
                             </div>
                           </div>
                        )}
                        <div className="p-4 border-b border-[#eaeaec]/50 hover:bg-[#f8f9fa] transition-colors cursor-pointer flex gap-3 items-start group">
                          <div className="w-8 h-8 rounded-full bg-[#932c2e]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertTriangle size={14} className="text-[#932c2e]" />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-black text-[#212c46] uppercase tracking-wider">{t('SYSTEM ALERT', 'การแจ้งเตือนระบบ')}</span>
                              <span className="text-[9px] font-bold text-[#b58c4f]">10m ago</span>
                            </div>
                            <span className="text-[10px] font-medium text-[#7a8b95] leading-relaxed">{t('Payroll processing delayed due to server maintenance.', 'การประมวลผลเงินเดือนล่าช้าเนื่องจากการบำรุงรักษาเซิร์ฟเวอร์')}</span>
                          </div>
                        </div>
                        <div className="p-4 border-b border-[#eaeaec]/50 hover:bg-[#f8f9fa] transition-colors cursor-pointer flex gap-3 items-start group">
                          <div className="w-8 h-8 rounded-full bg-[#3f809e]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={14} className="text-[#3f809e]" />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-black text-[#212c46] uppercase tracking-wider">{t('PENDING APPROVAL', 'รอการอนุมัติ')}</span>
                              <span className="text-[9px] font-bold text-[#b58c4f]">1h ago</span>
                            </div>
                            <span className="text-[10px] font-medium text-[#7a8b95] leading-relaxed">{t('Leave request from UX/UI parameter needs your review.', 'คำขอลาหยุดโปรดตรวจสอบ')}</span>
                          </div>
                        </div>
                        <div className="p-4 hover:bg-[#f8f9fa] transition-colors cursor-pointer flex gap-3 items-start group">
                          <div className="w-8 h-8 rounded-full bg-[#b58c4f]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Info size={14} className="text-[#b58c4f]" />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-black text-[#212c46] uppercase tracking-wider">{t('SYSTEM UPDATE', 'อัปเดตระบบ')}</span>
                              <span className="text-[9px] font-bold text-[#b58c4f]">2h ago</span>
                            </div>
                            <span className="text-[10px] font-medium text-[#7a8b95] leading-relaxed">{t('New HR policies and documents have been uploaded to the portal.', 'อัปโหลดนโยบาย HR และเอกสารใหม่')}</span>
                          </div>
                        </div>
                    </div>
                    <div className="bg-[#f8f9fa] px-4 py-2.5 border-t border-[#eaeaec] flex justify-center items-center">
                      <button className="text-[10px] font-black text-[#3f809e] hover:text-[#212c46] uppercase tracking-widest transition-colors flex items-center gap-1">
                        {t('MARK ALL AS READ', 'ทำเครื่องหมายว่าอ่านแล้วทั้งหมด')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
      </div>
    </header>
  );
}
