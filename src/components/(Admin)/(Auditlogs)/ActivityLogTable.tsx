'use client';

import React from 'react';
import {
  Download, PlusCircle, UserMinus, ShieldCheck,
  LogIn, LogOut, FileText, Calendar, CreditCard,
  Clock, User, Trash2, RefreshCw, ChevronLeft, ChevronRight
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
  // Pagination
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

// ── Convert UTC timestamp string → Philippine Standard Time (UTC+8) ────────
function toPHT(utcString: string): string {
  try {
    // Backend sends "yyyy-MM-dd HH:mm:ss" — treat as UTC
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
    }).replace(',', ''); // "04/01/2025 14:32:00"
  } catch {
    return utcString;
  }
}

// ── Map module → color accent ──────────────────────────────────────────────
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

// ── Map action → icon ──────────────────────────────────────────────────────
function ActionIcon({ action }: { action: string }) {
  const a = action?.toUpperCase();
  if (a?.includes('DELETE') || a?.includes('REVOKE'))   return <Trash2     className="w-3 h-3 text-red-400"      />;
  if (a?.includes('APPROVE') || a?.includes('RELEASE')) return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
  if (a?.includes('REJECT'))                            return <UserMinus   className="w-3 h-3 text-red-400"      />;
  if (a?.includes('DOWNLOAD'))                          return <Download    className="w-3 h-3 text-indigo-400"   />;
  if (a?.includes('CLOCK_IN'))                          return <LogIn       className="w-3 h-3 text-emerald-400"  />;
  if (a?.includes('CLOCK_OUT'))                         return <LogOut      className="w-3 h-3 text-amber-400"    />;
  if (a?.includes('RESET'))                             return <RefreshCw   className="w-3 h-3 text-amber-400"    />;
  if (a?.includes('UPDATE'))                            return <RefreshCw   className="w-3 h-3 text-sky-400"      />;
  return                                                       <PlusCircle  className="w-3 h-3 text-emerald-500"  />;
}

// ── Is this a critical/destructive action? ─────────────────────────────────
function isCritical(action: string): boolean {
  const a = action?.toUpperCase();
  return !!(a?.includes('DELETE') || a?.includes('REVOKE') ||
            a?.includes('REJECT') || a?.includes('RESET'));
}

export const ActivityLogTable = ({ logs, page, totalPages, total, onPrev, onNext }: Props) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-40">
        <FileText className="w-10 h-10 text-indigo-500" />
        <p className="text-[10px] font-black tracking-[0.4em] text-slate-500">
          NO ACTIVITY RECORDED YET
        </p>
        <p className="text-[8px] font-bold text-slate-700 tracking-widest not-italic">
          Actions across all modules will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── TABLE ── */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase border-b border-white/5">
            <tr>
              <th className="px-10 py-6 text-indigo-500/50">TIMESTAMP (PHT)</th>
              <th className="px-6  py-6 text-indigo-500/50">ACTOR</th>
              <th className="px-6  py-6 text-indigo-500/50">MODULE</th>
              <th className="px-6  py-6 text-indigo-500/50">ACTION</th>
              <th className="px-10 py-6 text-right text-indigo-500/50">TARGET</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => {
              const critical = isCritical(log.action);
              const modColor = moduleColor(log.module);

              return (
                <tr
                  key={log.id}
                  className={`hover:bg-indigo-600/5 transition-colors group ${
                    critical ? 'bg-red-500/[0.02]' : ''
                  }`}
                >
                  {/* Timestamp — PHT */}
                  <td className="px-10 py-5 text-[10px] font-black text-slate-500 font-mono tracking-tight whitespace-nowrap">
                    {toPHT(log.timestamp)}
                  </td>

                  {/* Actor */}
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight uppercase truncate max-w-[160px]">
                      {log.user}
                    </p>
                    <p className="text-[8px] font-bold text-slate-600 tracking-widest uppercase not-italic">
                      {log.role}&nbsp;&nbsp;•&nbsp;&nbsp;{log.dept}
                    </p>
                  </td>

                  {/* Module badge */}
                  <td className="px-6 py-5">
                    <span className={`text-[8px] font-black tracking-widest px-3 py-1 rounded-full border ${modColor}`}>
                      {log.module}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <ActionIcon action={log.action} />
                      <span className={`text-[10px] font-black uppercase tracking-wide transition-colors ${
                        critical
                          ? 'text-red-400/70 group-hover:text-red-400'
                          : 'text-slate-300 group-hover:text-slate-100'
                      }`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>

                  {/* Target */}
                  <td className="px-10 py-5 text-right">
                    <span className="text-[10px] font-black text-white bg-indigo-500/5 px-3 py-1 rounded-lg border border-indigo-500/10 group-hover:border-indigo-500/30 transition-all shadow-inner uppercase whitespace-nowrap">
                      {log.target}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <button
            onClick={onPrev}
            disabled={page === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-widest text-slate-500 hover:text-white hover:border-indigo-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-3 h-3" /> PREV
          </button>

          {/* Page number pills */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - page) <= 1
              )
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                  acc.push('...');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="text-[9px] font-black text-slate-600 px-1">
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => {
                      if (p < page) onPrev();
                      else if (p > page) onNext();
                    }}
                    className={`w-8 h-8 rounded-lg text-[9px] font-black tracking-widest transition-all border ${
                      p === page
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                        : 'bg-white/5 text-slate-500 border-white/5 hover:text-white hover:border-indigo-500/30'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          <button
            onClick={onNext}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black tracking-widest text-slate-500 hover:text-white hover:border-indigo-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            NEXT <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── RECORD COUNT ── */}
      <p className="text-center text-[8px] font-black text-slate-700 tracking-widest">
        PAGE {page} OF {totalPages} &nbsp;•&nbsp; {total} TOTAL RECORD{total !== 1 ? 'S' : ''}
      </p>
    </div>
  );
};