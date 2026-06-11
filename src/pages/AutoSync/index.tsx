import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import UserGuideButton from '../../components/shared/UserGuideButton';
import { Database, RefreshCw, Settings2, ShieldAlert, Play, Clock, Activity, CheckCircle2, XCircle, BookOpen, X, AlertTriangle } from 'lucide-react';
import { SyncStatusBadge, SyncState } from '../../components/shared/SyncStatusBadge';

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-[#f8f9fa] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-4 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-[16px] xl:text-lg"><BookOpen size={22} className="text-[#b7a159]"/> USER GUIDE</h3>
            <p className="text-[10px] xl:text-[11px] font-bold text-white/70 uppercase tracking-widest mt-1.5">AUTO-SYNC GUIDE</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 xl:p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-[#f8f9fa]">
            <section className="animate-fadeIn">
                <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
                    <RefreshCw size={18} className="text-emerald-600" /> 1. BACKGROUND AUTO-SYNC SYSTEM
                </h4>
                <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm">
                    <p className="text-[12px] text-[#414757] leading-relaxed">ระบบ Background Auto-Sync ทำงานเบื้องหลังด้วยการส่ง/ตรวจสอบข้อมูลระหว่างเว็บ Smart HR และคลังสเปรดชีต Google Sheets ที่ลงทะเบียนไว้ผ่าน Google Apps Script API:</p>
                    <ul className="list-disc pl-5 space-y-3 font-medium text-[12px]">
                        <li>
                            <strong className="text-[#212c46]">Active Synchronization:</strong> ทุกการทำรายการของพนักงานในระบบ (เช่น ขออนุมัติลา, บันทึกประวัติ หรือลงเวลา) ข้อมูลจะส่งต่อไปบันทึกใน Google Sheets โดยอัตโนมัติหากเปิดสวิตช์ toggle ไว้
                        </li>
                        <li>
                            <strong className="text-[#212c46]">Manual Queue Testing:</strong> คุณสามารถกดทดสอบการสื่อสารแบบรายตารางได้ฟรีด้วยปุ่ม <strong className="text-[#3f809e]">Test Connection</strong> ดึงชุดข้อมูลทดลองและบันทึกในเวลานั้น
                        </li>
                    </ul>
                </div>
            </section>

            <section className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
                    <ShieldAlert size={18} className="text-rose-600" /> 2. TOGGLE INDICATORS & STATUS
                </h4>
                <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm text-[12px]">
                    <div className="flex items-start gap-3">
                        <span className="inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-widest min-w-[90px] justify-center">CONNECTED</span>
                        <div className="text-slate-600 font-medium">ตารางนั้นเชื่อมต่อด้วยระบบออโต้ บันทึกข้อมูลและตอบสนองได้อย่างดีเยี่ยม</div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700 uppercase tracking-widest min-w-[90px] justify-center">TESTING</span>
                        <div className="text-slate-600 font-medium">ระบบกำลังทดลองคุยกับ Google Apps Script Web App พอร์ต 3000 หรือ URL ที่เกี่ยวข้อง</div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700 uppercase tracking-widest min-w-[90px] justify-center">ERROR</span>
                        <div className="text-slate-600 font-medium">ไม่สามารถติดต่อ Google sheets ได้เนื่องจากคีย์ไม่ถูกต้อง ข้ามสิทธิ์ หรือขาดการเปิดใช้เว็บแอปพลิเคชัน</div>
                    </div>
                </div>
            </section>

            <section className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-3 font-mono">
                    <Database size={18} className="text-[#b58c4f]" /> 3. SYSTEM IMPACT & RECOMMENDATIONS
                </h4>
                <div className="bg-white p-5 rounded-2xl border border-[#eaeaec] space-y-4 shadow-sm">
                    <p className="text-[12px] text-[#414757] font-bold">คำแนะนำสำหรับการดูแลทรัพยากร API ของแอปพลิเคชัน:</p>
                    <ul className="list-disc pl-5 space-y-3 font-medium text-[12px] text-slate-600">
                        <li>
                            <strong className="text-[#212c46]">Employees / SystemConfig</strong> แนะนำให้สวิตช์ Toggle ON ไว้เสมอเพื่อหลีกเลี่ยงความล่าช้าในการดึงข้อมูลหลักและค่ากำหนดทางธุรกรรม
                        </li>
                        <li>
                            <strong className="text-[#212c46]">ProductionRecords / QualityMetrics</strong> หากระบบไม่ได้ใช้กลุ่มงานผลิตหรือคิวโปรดักชั่นเป็นประจำ สามารถเลือกปิดซิงค์เพื่อลดภาระงานเขียนแผ่นสเปรดชีตและประหยัด API Limit ของทางฝั่ง Google Cloud ได้
                        </li>
                    </ul>
                </div>
            </section>
            
            <section className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-2 mb-4 font-mono pb-3 border-b-2 border-[#eaeaec]">
                    <Clock size={18} className="text-[#8b5cf6]" />
                    <h4 className="text-[13px] font-black text-[#212c46] uppercase">4. SYNC INTERVAL SETTINGS</h4>
                </div>
                <div className="space-y-4">
                    <p className="text-[12px] text-[#414757] font-bold">กำหนดความถี่ที่ระบบจะทำงานตรวจสอบและเชื่อมข้อมูลโดยอัตโนมัติ:</p>
                    <ul className="list-disc pl-5 space-y-3 font-medium text-[12px] text-[#414757]">
                        <li>
                            <strong className="text-[#212c46]">30 Mins:</strong> เหมาะสำหรับเวลาทำการปกติที่มีการเคลื่อนไหวของธุรกรรมสูง
                        </li>
                        <li>
                            <strong className="text-[#212c46]">Hourly:</strong> ระดับพื้นฐาน แนะนำสำหรับระบบที่มีผู้ใช้น้อยลง
                        </li>
                        <li>
                            <strong className="text-[#212c46]">Daily:</strong> สำหรับข้อมูลประเภทเก็บถาวรหรือระบบสำรองเท่านั้น
                        </li>
                    </ul>
                </div>
            </section>

            <section className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2 mb-4 font-mono pb-3 border-b-2 border-[#eaeaec]">
                    <AlertTriangle size={18} className="text-[#eab308]" />
                    <h4 className="text-[13px] font-black text-[#212c46] uppercase">5. CONFLICT RESOLUTION</h4>
                </div>
                <div className="space-y-4">
                    <p className="text-[12px] text-[#414757] font-bold">เมื่อพบว่ามีการแก้ไขข้อมูลที่จุดเดียวกัน ทั้งบนเว็บแอปพลิเคชันและใน Google Sheets ระบบจะแสดงรายการข้อขัดแย้ง (Data Conflicts) เพื่อให้คุณตัดสินใจเลือก:</p>
                    <ul className="list-disc pl-5 space-y-3 font-medium text-[12px] text-[#414757]">
                        <li>
                            <strong className="text-[#212c46]">Keep Local:</strong> บังคับใช้ข้อมูลบนเว็บนี้ และไปเขียนทับแผ่นงานบน Sheets
                        </li>
                        <li>
                            <strong className="text-[#212c46]">Overwrite:</strong> ดึงข้อมูลดั้งเดิมจาก Sheets มาเขียนทับประวัติที่ขัดแย้งบนเว็บ
                        </li>
                    </ul>
                </div>
            </section>
        </div>
        
        <div className="p-6 border-t border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">SYSTEM MANUAL V4.0</span>
            <button onClick={onClose} className="px-8 py-3 bg-[#212c46] text-white font-black rounded-xl uppercase tracking-widest text-[11px] shadow-md hover:bg-[#b58c4f] transition-all duration-300">รับทราบ (Got it)</button>
        </div>
      </div>
    </>,
    document.body
  );
}

export default function BackgroundAutoSync() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [syncConfig, setSyncConfig] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('cfg_sync_toggles');
    return saved ? JSON.parse(saved) : {
      'Employees': true,
      'CalendarEvents': true,
      'Leaves': true,
      'SystemConfig': true,
      'ProductionRecords': false,
      'QualityMetrics': false
    };
  });

  const [sheetStatuses, setSheetStatuses] = useState<Record<string, SyncState>>({});
  const [activityLogs, setActivityLogs] = useState<{ id: string; sheet: string; status: 'success' | 'failure'; timestamp: Date }[]>([
      { id: 'mock-1', sheet: 'Employees', status: 'success', timestamp: new Date(Date.now() - 1000 * 60 * 5) }
  ]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());
  const [pendingItemsCount, setPendingItemsCount] = useState(3);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [syncInterval, setSyncInterval] = useState('1h');
  const [dataConflicts, setDataConflicts] = useState<any[]>([
    { id: 'c1', sheet: 'Employees', recordName: 'EMP-001 (John Doe)', localValue: 'Software Engineer', remoteValue: 'Senior Software Engineer' },
    { id: 'c2', sheet: 'SystemConfig', recordName: 'Default Tax Rate', localValue: '7%', remoteValue: '7.5%' }
  ]);

  const handleResolveConflict = (id: string, action: 'keep_local' | 'overwrite') => {
    setDataConflicts(prev => prev.filter(c => c.id !== id));
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Conflict resolved (${action === 'keep_local' ? 'Kept Local' : 'Overwritten from Remote'})`,
      showConfirmButton: false,
      timer: 2000,
      background: '#f8f9fa'
    });
  };

  const handleRefreshAll = () => {
    setIsRefreshingAll(true);
    let delays = 0;
    
    Object.keys(syncConfig).forEach((sheetName, index) => {
      setTimeout(() => {
        handleTestConnection(sheetName);
      }, delays);
      delays += 800; // stagger the checks
    });

    setTimeout(() => {
       setIsRefreshingAll(false);
    }, delays + 1500);
  };

  const handleToggleSync = (sheetName: string, value: boolean) => {
    const newConfig = { ...syncConfig, [sheetName]: value };
    setSyncConfig(newConfig);
    localStorage.setItem('cfg_sync_toggles', JSON.stringify(newConfig));
    
    if (!value) {
        setSheetStatuses(prev => ({ ...prev, [sheetName]: 'disconnected' }));
    }

    // Optional notification
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: value ? 'success' : 'info',
      title: `${value ? 'Enabled' : 'Disabled'} auto-sync for ${sheetName}`,
      showConfirmButton: false,
      timer: 2000,
      background: '#f8f9fa'
    });
  };

  const handleTestConnection = (sheetName: string) => {
    setSheetStatuses(prev => ({ ...prev, [sheetName]: 'testing' }));
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% chance of success for demo
      setSheetStatuses(prev => ({ ...prev, [sheetName]: isSuccess ? 'connected' : 'error' }));
      
      setActivityLogs(prev => [{
        id: Math.random().toString(36).substring(2, 9),
        sheet: sheetName,
        status: isSuccess ? 'success' : 'failure',
        timestamp: new Date()
      }, ...prev].slice(0, 10)); // keep last 10
      
      if (isSuccess) {
         setLastSyncTime(new Date());
         setPendingItemsCount(prev => Math.max(0, prev - 1));
      }
    }, 1500);
  };


  return (
    <div className="flex flex-1 w-full flex-col pb-5 animate-fadeIn bg-transparent space-y-4">
      {/* USER GUIDE FLOATING TAB */}
      <UserGuideButton onClick={() => setIsGuideOpen(true)} />

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Title Header */}
      <div className="h-14 px-4 sm:px-8 mt-[2px] flex flex-row items-center justify-between gap-4 z-20 shrink-0">
        <div className="text-left">
          <h1 className="text-2xl font-black text-[#212c46] tracking-tight uppercase flex items-center gap-3">
            <RefreshCw size={28} className="text-emerald-600 shrink-0" />
            <span>Background Auto-Sync / การซิงค์อัตโนมัติ</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-1">
            MANAGE BACKGROUND AUTOMATION AND DATA SYNCHRONIZATION SCHEDULES.
          </p>
        </div>
        <button 
           onClick={handleRefreshAll}
           disabled={isRefreshingAll}
           className="hidden sm:flex items-center gap-2 bg-[#1d2636] hover:bg-[#3f809e] text-white px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <RefreshCw size={14} className={isRefreshingAll ? "animate-spin" : ""} />
           {isRefreshingAll ? "Syncing..." : "Refresh All"}
        </button>
      </div>

      <div className="w-full px-4 sm:px-8 mt-[2px] pb-6 flex flex-col space-y-4">


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden group hover:border-emerald-500 transition-all md:col-span-1">
          <div className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none transform group-hover:scale-105 transition-transform duration-700 text-emerald-600">
            <RefreshCw size={110} />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-wider">Configured Modules</p>
            <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 bg-emerald-50 border-emerald-200 text-emerald-600`}>
              <Database size={18} />
            </div>
          </div>
          <div className="relative z-10 mt-3">
            <p className="text-2xl font-black text-[#212c46] leading-none">
              {Object.keys(syncConfig).length}
            </p>
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase mt-1 tracking-wider">
              Total Sheets Configured
            </p>
          </div>
        </div>

        <div className="bg-white px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden group hover:border-[#b58c4f] transition-all md:col-span-1">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none transform group-hover:scale-105 transition-transform duration-700 text-[#b58c4f]">
              <Clock size={110} />
            </div>
            <div className="relative z-10 flex justify-between items-start">
              <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-wider">Last Sync Time</p>
              <div className="p-2.5 rounded-xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 text-amber-600">
                <Clock size={18} />
              </div>
            </div>
            <div className="relative z-10 mt-3 text-left">
              <p className="text-xl font-black text-[#212c46] leading-none">
                {lastSyncTime ? format(lastSyncTime, 'HH:mm:ss') : '--:--:--'}
              </p>
              <p className="text-[10px] font-bold text-[#7a8b95] uppercase mt-1 tracking-wider max-w-sm">
                System Time UTC+7
              </p>
            </div>
        </div>

        <div className="bg-white px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden group hover:border-[#3f809e] transition-all md:col-span-1">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none transform group-hover:scale-105 transition-transform duration-700 text-[#3f809e]">
              <Activity size={110} />
            </div>
            <div className="relative z-10 flex justify-between items-start">
              <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-wider">Pending Items</p>
              <div className="p-2.5 rounded-xl border flex items-center justify-center shrink-0 bg-blue-50 border-blue-200 text-[#3f809e]">
                <Activity size={18} />
              </div>
            </div>
            <div className="relative z-10 mt-3 text-left">
              <p className="text-xl font-black text-[#212c46] leading-none">
                {pendingItemsCount} queues
              </p>
              <p className="text-[10px] font-bold text-[#7a8b95] uppercase mt-1 tracking-wider max-w-sm">
                Awaiting Next Cycle
              </p>
            </div>
        </div>
      </div>

      <div className="w-full mt-4">
        {/* BACKGROUND AUTOMATION CONTROL */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#eaeaec] shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0 shadow-sm">
              <RefreshCw size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-[14px] sm:text-[16px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-2">
                <span>Background Auto-Sync</span>
              </h3>
              <p className="text-[12px] font-bold text-[#7a8b95] mt-1 leading-relaxed">
                การตั้งค่าแผนงานเชื่อมโยงไปยัง Google Sheets
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50/50 p-4 rounded-xl border border-[#eaeaec]/60 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-wider">Automated Sync Interval</h4>
                <p className="text-[10px] font-bold text-[#7a8b95] mt-1">ตั้งค่าความถี่ในการซิงค์ข้อมูลเบื้องหลังอัตโนมัติ</p>
             </div>
             <div className="flex items-center gap-2 shrink-0">
                 <Clock size={16} className="text-[#3f809e] hidden sm:block" />
                 <select 
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(e.target.value)}
                    className="bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] focus:outline-none focus:border-[#3f809e] shadow-sm cursor-pointer w-full sm:w-auto"
                 >
                    <option value="15m">Every 15 minutes</option>
                    <option value="30m">Every 30 minutes</option>
                    <option value="1h">Hourly</option>
                    <option value="12h">Every 12 hours</option>
                    <option value="24h">Daily</option>
                 </select>
             </div>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-xl border border-[#eaeaec]/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(syncConfig).map(([sheetName, isEnabled]) => {
                const status = sheetStatuses[sheetName];
                return (
                  <div key={sheetName} className="flex flex-col gap-3 p-4 bg-white border border-[#eaeaec] rounded-xl shadow-sm transition-all hover:border-[#b58c4f]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database size={16} className={isEnabled ? "text-emerald-500" : "text-slate-300"} />
                        <span className={`text-[12px] font-black uppercase tracking-wider ${isEnabled ? "text-[#212c46]" : "text-slate-400"}`}>
                          {sheetName}
                        </span>
                        
                        {/* Status Badges */}
                        <SyncStatusBadge status={status || 'idling'} className="hidden sm:inline-flex" />
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isEnabled}
                          onChange={(e) => handleToggleSync(sheetName, e.target.checked)}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button 
                        onClick={() => handleTestConnection(sheetName)} 
                        disabled={status === 'testing'}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#3f809e] hover:text-white border-[#3f809e] border hover:bg-[#3f809e] transition-all flex items-center gap-1.5 px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         {status === 'testing' ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                         Test Connection
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sync Activity Log Table */}
      <div className="mt-4 bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#eaeaec]">
          <h3 className="text-[14px] sm:text-[16px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-2">
             <Activity size={18} className="text-[#3f809e]" />
             <span>Sync Activity Log</span>
          </h3>
          <p className="text-[12px] font-bold text-[#7a8b95] uppercase mt-1">ประวัติการซิงโครไนซ์ข้อมูลล่าสุด</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#eaeaec]">
                <th className="py-3 px-5 text-[12px] font-black uppercase tracking-widest text-[#7a8b95]">Timestamp</th>
                <th className="py-3 px-5 text-[12px] font-black uppercase tracking-widest text-[#7a8b95]">Sheet / Module</th>
                <th className="py-3 px-5 text-[12px] font-black uppercase tracking-widest text-[#7a8b95]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeaec] bg-white">
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-5 whitespace-nowrap text-[12px] font-bold text-[#414757]">
                      {format(log.timestamp, 'dd MMM yyyy, HH:mm:ss')}
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap text-[12px] font-bold text-[#212c46]">
                      {log.sheet}
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-widest">
                          <CheckCircle2 size={12} /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] font-bold bg-rose-50 border border-rose-100 text-rose-700 uppercase tracking-widest">
                          <XCircle size={12} /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-[12px] font-bold text-[#7a8b95] uppercase tracking-widest">
                    No activity logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 bg-[#fffbfa] rounded-2xl border border-rose-100 shadow-sm overflow-hidden auto-sync-conflicts">
        <div className="p-5 border-b border-rose-100 bg-rose-50/30">
          <h3 className="text-[14px] sm:text-[16px] font-black text-rose-700 uppercase tracking-wider flex items-center gap-2">
             <ShieldAlert size={18} className="text-rose-500" />
             <span>Data Conflicts Resolution</span>
          </h3>
          <p className="text-[12px] font-bold text-rose-400 uppercase mt-1">ตรวจพบข้อมูลที่ขัดแย้งกันขณะซิงค์ โปรดตรวจสอบและยืนยันการแก้ไข</p>
        </div>
        <div className="p-5">
           {dataConflicts.length === 0 ? (
              <div className="text-center py-6">
                 <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} className="text-emerald-500" />
                 </div>
                 <h4 className="text-[13px] font-black text-[#212c46] uppercase tracking-wider">No Conflicts Found</h4>
                 <p className="text-[11px] font-bold text-[#7a8b95] mt-1">ข้อมูลทุกระบบสอดคล้องกันดีเยี่ยม</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 gap-4">
                 {dataConflicts.map((conflict) => (
                    <div key={conflict.id} className="p-4 bg-white border border-rose-100 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest">{conflict.sheet}</span>
                              <span className="text-[12px] font-black text-[#212c46] uppercase tracking-wider">{conflict.recordName}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                              <div className="bg-[#f8f9fa] p-3 rounded-lg border border-[#eaeaec]">
                                  <div className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-1 flex items-center gap-1.5"><Activity size={12}/> Local Web Application</div>
                                  <div className="text-[12px] font-medium text-rose-600 line-through opacity-80">{conflict.localValue}</div>
                              </div>
                              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Database size={12}/> Google Sheets (Remote)</div>
                                  <div className="text-[12px] font-black text-emerald-700">{conflict.remoteValue}</div>
                              </div>
                          </div>
                       </div>
                       <div className="flex md:flex-col gap-2 shrink-0">
                           <button onClick={() => handleResolveConflict(conflict.id, 'keep_local')} className="flex-1 md:flex-none px-4 py-2 bg-white border-2 border-[#212c46] text-[#212c46] hover:bg-[#212c46] hover:text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                               Keep Local
                           </button>
                           <button onClick={() => handleResolveConflict(conflict.id, 'overwrite')} className="flex-1 md:flex-none px-4 py-2 bg-[#932c2e] text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-rose-800 flex items-center justify-center gap-1.5 shadow-md border-2 border-[#932c2e]">
                               <RefreshCw size={14} /> Overwrite Local
                           </button>
                       </div>
                    </div>
                 ))}
             </div>
           )}
        </div>
      </div>
      </div>
    </div>
  );
}
