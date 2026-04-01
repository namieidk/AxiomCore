'use client';

import React from 'react';
import {
  Download, PlusCircle, UserMinus, ShieldCheck,
  LogIn, LogOut, FileText, Trash2, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  dept: string;
  action: string;
  module: string;
  target: string;
  ipAddress: string;
  timestamp: string;
}

interface Props {
  logs: ActivityLog[];
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

function toPHT(utcString: string): string {
  try {
    const date = new Date(utcString.replace(' ', 'T') + 'Z');
    return date.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year:     'numeric',
      month:    '2-digit',
      day:      '2-digit',
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
      hour12:   false,
    }).replace(',', '');
  } catch {
    return utcString;
  }
}

function moduleColor(module: string): string {
  switch (module?.toUpperCase()) {
    case 'LEAVE':       return 'text-sky-400 border-sky-500/20 bg-sky-500/5';
    case 'REPORTS':     return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
    case 'EVALUATIONS': return 'text-violet-400 border-violet-500/20 bg-violet-500/5';
    case 'PAYROLL':     return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    case 'ATTENDANCE':  return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    case 'ACCOUNTS':    return 'text-red-400 border-red-500/20 bg-red-500/5';
    default:            return 'text-slate-400 border-white/10 bg-white/5';
  }
}

function ActionIcon({ action }: { action: string }) {
  const a = action?.toUpperCase();
  if (a?.includes('DELETE') || a?.includes('REVOKE'))   return <Trash2     className="w-3 h-3 text-red-400"      />;
  if (a?.includes('APPROVE') || a?.includes('RELEASE')) return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
  if (a?.includes('REJECT'))                            return <UserMinus   className="w-3 h-3 text-red-400"      />;
  if (a?.includes('DOWNLOAD'))                          return <Download    className="w-3 h-3 text-indigo-400"   />;
  if (a?.includes('CLOCK_IN'))                          return <LogIn       className="w-3 h-3 text-emerald-400"  />;
  if (a?.includes('CLOCK_OUT'))                         return <LogOut      className="w-3 h-3 text-amber-400"    />;
  if (a?.includes('RESET') || a?.includes('UPDATE'))    return <RefreshCw   className="w-3 h-3 text-sky-400"      />;
  return                                                       <PlusCircle  className="w-3 h-3 text-emerald-500"  />;
}

export const ActivityLogTable = ({ logs, page, totalPages, total, onPrev, onNext }: Props) => {
  if (logs.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 opacity-40">
      <FileText className="w-10 h-10 text-indigo-500 mb-4" />
      <p className="text-[10px] font-black tracking-[0.4em]">NO ACTIVITY RECORDED</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl lg:rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-white/5 text-[9px] lg:text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase border-b border-white/5">
              <tr>
                <th className="px-10 py-6 text-indigo-500/50">TIMESTAMP (PHT)</th>
                <th className="px-6 py-6 text-indigo-500/50">ACTOR</th>
                <th className="px-6 py-6 text-indigo-500/50">MODULE</th>
                <th className="px-6 py-6 text-indigo-500/50">ACTION</th>
                <th className="px-10 py-6 text-right text-indigo-500/50">TARGET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-indigo-600/5 transition-colors group">
                  <td className="px-10 py-5 text-[9px] lg:text-[10px] font-black text-slate-500 font-mono">{toPHT(log.timestamp)}</td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-black text-white uppercase truncate max-w-[150px]">{log.user}</p>
                    <p className="text-[7px] font-bold text-slate-600 tracking-widest uppercase">{log.role} • {log.dept}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[8px] font-black tracking-widest px-3 py-1 rounded-full border uppercase ${moduleColor(log.module)}`}>
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <ActionIcon action={log.action} />
                      <span className="text-[10px] font-black uppercase text-slate-300 transition-colors group-hover:text-white">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <span className="text-[10px] font-black text-white bg-indigo-500/5 px-3 py-1 rounded-lg border border-indigo-500/10 group-hover:border-indigo-500/30 transition-all uppercase whitespace-nowrap">
                      {log.target}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <button onClick={onPrev} disabled={page === 1} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-widest text-slate-500 hover:text-white disabled:opacity-30 transition-all">
          <ChevronLeft className="w-3 h-3" /> PREV
        </button>
        <span className="text-[9px] font-black text-slate-700 tracking-[0.2em] uppercase">PAGE {page} OF {totalPages}</span>
        <button onClick={onNext} disabled={page === totalPages} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-widest text-slate-500 hover:text-white disabled:opacity-30 transition-all">
          NEXT <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};