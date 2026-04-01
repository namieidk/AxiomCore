'use client';

import React, { useState } from 'react';
import {
  Globe, ShieldCheck, ShieldAlert, AlertTriangle,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
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
    <div className="space-y-6">
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl lg:rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-white/5 text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase border-b border-white/5">
              <tr>
                <th className="px-10 py-6 text-indigo-500/50">TIMESTAMP (PHT)</th>
                <th className="px-6 py-6 text-indigo-500/50">ACTOR IDENTIFIER</th>
                <th className="px-6 py-6 text-indigo-500/50">NETWORK IP</th>
                <th className="px-10 py-6 text-right text-indigo-500/50">SECURITY STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentLogs.map((log) => {
                const isSuccess = log.status?.toUpperCase() === 'SUCCESS';
                return (
                  <tr key={log.id} className="hover:bg-indigo-600/5 transition-colors group">
                    <td className="px-10 py-6 text-[9px] lg:text-[10px] font-black text-slate-500 font-mono italic">{toPHT(log.timestamp)}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {log.user?.toUpperCase().startsWith('UNKNOWN') && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
                        <div>
                          <p className="text-[11px] font-black text-white uppercase">{log.user}</p>
                          <p className="text-[7px] font-bold text-slate-600 tracking-widest uppercase">{log.role || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-indigo-400 font-mono text-[10px] font-black">
                      <div className="flex items-center gap-2"><Globe className="w-3 h-3" /> {log.ipAddress || '—'}</div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 uppercase">
                        {isSuccess ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <ShieldAlert className="w-3 h-3 text-red-500" />}
                        <span className={`text-[8px] font-black ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isSuccess ? 'VALIDATED' : 'BREACH'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sector: {startIndex + 1}–{Math.min(startIndex + itemsPerPage, logs.length)} of {logs.length}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(1)} className="p-2 text-slate-500 hover:text-white"><ChevronsLeft className="w-4 h-4" /></button>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-2 text-slate-500 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="p-2 text-slate-500 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => setCurrentPage(totalPages)} className="p-2 text-slate-500 hover:text-white"><ChevronsRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};