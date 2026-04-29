'use client';

import React, { useState } from 'react';
import {
  Globe, ShieldCheck, ShieldAlert, AlertTriangle,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

export interface LoginLog {
  id:        number;
  user:      string;
  role:      string | null;
  ipAddress: string | null;
  device:    string | null;
  timestamp: string;
  status:    string | null;
}

interface Props {
  logs: LoginLog[];
}

function toPHT(utcString: string): string {
  if (!utcString) return '—';
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

export const LoginLogTable = ({ logs }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages  = Math.max(1, Math.ceil(logs.length / itemsPerPage));
  const startIndex  = (currentPage - 1) * itemsPerPage;
  const currentLogs = logs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-0">
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl lg:rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">

        {/* Scrollable table */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[9px] lg:text-[10px] text-slate-500 tracking-[0.3em]">
                <th className="px-10 py-6 text-indigo-500/50 uppercase">Timestamp (PHT)</th>
                <th className="px-6 py-6 text-indigo-500/50 uppercase">Actor Identifier</th>
                <th className="px-6 py-6 text-indigo-500/50 uppercase">Network IP</th>
                <th className="px-10 py-6 text-right text-indigo-500/50 uppercase">Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentLogs.length > 0 ? currentLogs.map((log) => {
                const isSuccess = log.status?.toUpperCase() === 'SUCCESS';
                return (
                  <tr key={log.id} className="hover:bg-indigo-600/5 transition-colors group">
                    <td className="px-10 py-5 text-[9px] lg:text-[10px] font-black text-slate-500 font-mono italic whitespace-nowrap">
                      {toPHT(log.timestamp)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {log.user?.toUpperCase().startsWith('UNKNOWN') && (
                          <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse shrink-0" />
                        )}
                        <div>
                          <p className="text-[11px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase truncate max-w-[160px]">
                            {log.user}
                          </p>
                          <p className="text-[7px] font-bold text-slate-600 tracking-widest uppercase">
                            {log.role || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-indigo-400 font-mono text-[10px] font-black">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 shrink-0" />
                        {log.ipAddress || '—'}
                      </div>
                    </td>
                    <td className="px-10 py-5 text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 uppercase">
                        {isSuccess
                          ? <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          : <ShieldAlert className="w-3 h-3 text-red-500" />
                        }
                        <span className={`text-[8px] font-black ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isSuccess ? 'VALIDATED' : 'BREACH'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-slate-600 text-[10px] tracking-widest uppercase italic">
                    No login records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer — matches AccountList style */}
        <footer className="px-6 lg:px-10 py-6 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 italic">
          <p className="text-[9px] text-slate-500 tracking-widest uppercase">
            SHOWING <span className="text-indigo-400">{logs.length}</span> RECORDS
          </p>
          <div className="flex items-center gap-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 lg:p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[9px] lg:text-[10px] text-white tracking-widest uppercase">
              PAGE {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 lg:p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};