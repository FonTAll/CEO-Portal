import React from 'react';
import { Database, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

export type SyncState = 'idling' | 'testing' | 'connected' | 'error' | 'disconnected';

export function SyncStatusBadge({ status, className = '' }: { status: SyncState; className?: string }) {
  switch (status) {
    case 'connected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-widest ${className}`}>
          <Database size={12} /> Connected
        </span>
      );
    case 'testing':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 border border-amber-100 text-amber-700 uppercase tracking-widest ${className}`}>
          <RefreshCw size={12} className="animate-spin" /> Testing...
        </span>
      );
    case 'error':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700 uppercase tracking-widest ${className}`}>
          <AlertCircle size={12} /> Error
        </span>
      );
    case 'disconnected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 border border-neutral-200 text-neutral-600 uppercase tracking-widest ${className}`}>
          <XCircle size={12} /> Disabled
        </span>
      );
    case 'idling':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-500 uppercase tracking-widest ${className}`}>
          <Database size={12} /> Ready
        </span>
      );
  }
}
