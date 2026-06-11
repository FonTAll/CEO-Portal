import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Activity, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LogEntry {
  id: string;
  timestamp: string;
  employeeId?: string;
  name?: string;
  action: string;
  role?: string;
  details?: string;
  userAgent?: string;
}

const RecentActivityWidget: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    try {
      const logsRef = collection(db, 'AccessLogs');
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(5));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedLogs = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          } as LogEntry;
        });
        setLogs(fetchedLogs);
        setLoading(false);
      }, (error) => {
        setLoading(false);
        import('../../services/api').then(({ handleFirestoreError, OperationType }) => {
          handleFirestoreError(error, OperationType.LIST, 'AccessLogs');
        });
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase module or db not available:", error);
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-white/90 rounded-2xl p-5 shadow-sm border border-[#f3f3f1] relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
          <Activity size={16} className="text-[#a94228]" /> 
          {t('RECENT ACTIVITY', 'กิจกรรมล่าสุด')}
        </h3>
        <span className="text-[10px] bg-[#f3f3f1] text-[#7a8b95] px-2 py-1 rounded font-bold uppercase tracking-wider">
          {t('LIVE FEED', 'ฟีดสด')}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-5 h-5 border-2 border-[#3f809e] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#eaeaec] before:to-transparent">
            {/* Fallback Mock Data */}
            {[
              { id: '1', action: 'Leave request submitted', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), name: 'พิมพพรรณ สวยงาม', role: 'UX/UI DESIGNER' },
              { id: '2', action: 'Profile updated', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), name: 'ธนวัฒน์ มาดี', role: 'FULLSTACK DEV' },
              { id: '3', action: 'Document signed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), name: 'เกริกพล ขยันงาน', role: 'HR SPECIALIST' },
              { id: '4', action: 'Login successful', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), name: 'สมชาย ใจดี', role: 'MANAGER' }
            ].map((log, index) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-[#eaeaec] group-hover:bg-[#3f809e] text-[#a94228] group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                  <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-[#f8f9fa] border border-[#eaeaec]/50 shadow-sm group-hover:shadow-md transition-shadow opacity-70">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#212c46] uppercase tracking-wider">{log.action}</span>
                      <span className="text-[9px] font-bold text-[#7a8b95]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#4d87a8] truncate">{log.name}</p>
                    <p className="text-[9px] font-medium text-[#7a8b95] truncate">{log.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#eaeaec] before:to-transparent">
            {logs.map((log, index) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon */}
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-[#eaeaec] group-hover:bg-[#3f809e] text-[#a94228] group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                  <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-[#f8f9fa] border border-[#eaeaec]/50 shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#212c46] uppercase tracking-wider">{log.action}</span>
                      <span className="text-[9px] font-bold text-[#7a8b95]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {log.name && (
                      <p className="text-xs font-semibold text-[#4d87a8] truncate">{log.name}</p>
                    )}
                    {(log.role || log.employeeId) && (
                      <p className="text-[9px] font-medium text-[#7a8b95] truncate">
                        {log.role} {log.employeeId ? `(${log.employeeId})` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityWidget;
