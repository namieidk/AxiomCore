'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ExternalLink, ShieldCheck, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ReportSummaryItem {
  id: string;
  reportNumber: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
}

function typeColor(type: string): string {
  const t = type?.toUpperCase();
  if (t?.includes('EVALUATION')) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  if (t?.includes('ATTENDANCE')) return 'text-blue-400   bg-blue-500/10   border-blue-500/20';
  if (t?.includes('PAYROLL'))    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (t?.includes('KPI'))        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
  return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
}

function typeIcon(type: string) {
  const t = type?.toUpperCase();
  if (t?.includes('EVALUATION')) return <ShieldCheck className="w-4 h-4" />;
  if (t?.includes('ATTENDANCE')) return <Clock className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

function statusDot(status: string) {
  const s = status?.toUpperCase();
  if (s === 'APPROVED') return 'bg-emerald-400';
  if (s === 'PENDING')  return 'bg-amber-400';
  if (s === 'REJECTED') return 'bg-red-400';
  return 'bg-slate-500';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

export const PerformanceFeed = () => {
  const router = useRouter();
  const [reports, setReports]     = useState<ReportSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts]       = useState({ total: 0, approved: 0, pending: 0 });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const stored     = localStorage.getItem('user');
        const token      = localStorage.getItem('token');
        const employeeId = stored ? JSON.parse(stored).employeeId : '';
        if (!employeeId) return;

        const headers: HeadersInit = {
          'X-Employee-Id': employeeId,
          'Authorization': `Bearer ${token}`,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Reports/my-reports`, { headers });
        if (!res.ok) return;

        const data: ReportSummaryItem[] = await res.json();

        setReports(data.slice(0, 4));
        setCounts({
          total:    data.length,
          approved: data.filter(r => r.status?.toUpperCase() === 'APPROVED').length,
          pending:  data.filter(r => r.status?.toUpperCase() === 'PENDING').length,
        });
      } catch (err) {
        console.error('PerformanceFeed fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-10 backdrop-blur-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <FileText className="w-24 h-24 lg:w-40 lg:h-40 text-indigo-500" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
            Performance Analytics Feed
          </h3>
          <p className="text-[8px] text-slate-600 tracking-widest mt-1 font-bold not-italic">
            LATEST DOCUMENT ACTIVITY
          </p>
        </div>
        <button
          onClick={() => router.push('/Reports')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white text-[8px] font-black tracking-widest transition-all w-full sm:w-auto justify-center"
        >
          VIEW ALL <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Metrics Row - Responsive Wrap */}
      <div className="flex flex-wrap gap-2 lg:gap-3 mb-7 relative z-10">
        <div className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[8px] text-slate-500 tracking-widest font-bold not-italic">TOTAL</span>
          <span className="text-[10px] text-white font-black">{counts.total}</span>
        </div>
        <div className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[8px] text-emerald-400 tracking-widest font-bold not-italic">APPROVED</span>
          <span className="text-[10px] text-white font-black">{counts.approved}</span>
        </div>
        <div className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[8px] text-amber-400 tracking-widest font-bold not-italic">PENDING</span>
          <span className="text-[10px] text-white font-black">{counts.pending}</span>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-5 p-4 lg:p-5 bg-white/5 rounded-3xl border border-white/5 animate-pulse">
              <div className="h-10 w-10 rounded-2xl bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 bg-slate-800 rounded-full w-2/3" />
                <div className="h-2 bg-slate-800 rounded-full w-1/3" />
              </div>
            </div>
          ))
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
            <AlertCircle className="w-8 h-8 text-indigo-500" />
            <p className="text-[9px] tracking-[0.3em] text-slate-500">NO REPORTS YET</p>
            <p className="text-[8px] text-center tracking-widest text-slate-600 not-italic font-bold px-4">
              Clock out, submit an evaluation, or run payroll to generate reports.
            </p>
          </div>
        ) : (
          reports.map((report) => {
            const colorClass = typeColor(report.type);
            return (
              <div
                key={report.id}
                onClick={() => router.push('/Reports')}
                className="flex items-center justify-between p-4 lg:p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.07] transition-all cursor-pointer group/item gap-4"
              >
                <div className="flex items-center gap-4 lg:gap-5 min-w-0">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center border shrink-0 ${colorClass}`}>
                    {typeIcon(report.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-white uppercase tracking-tight group-hover/item:text-indigo-400 transition-colors truncate">
                      {report.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[8px] font-black tracking-widest truncate ${colorClass.split(' ')[0]}`}>
                        {report.type}
                      </span>
                      <span className="text-slate-700 text-[8px] hidden sm:inline">•</span>
                      <span className="font-mono text-[8px] text-slate-600 not-italic hidden sm:inline">
                        {report.reportNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(report.status)}`} />
                      <span className={`text-[8px] font-black tracking-widest ${
                        report.status?.toUpperCase() === 'APPROVED' ? 'text-emerald-400' :
                        report.status?.toUpperCase() === 'PENDING'  ? 'text-amber-400'  : 'text-red-400'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-[8px] text-slate-600 tracking-widest not-italic font-bold">
                      {timeAgo(report.createdAt)}
                    </p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-700 group-hover/item:text-indigo-500 transition-colors hidden sm:block" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isLoading && reports.length > 0 && (
        <button
          onClick={() => router.push('/Reports')}
          className="mt-6 w-full py-3 rounded-2xl border border-white/5 text-[8px] text-slate-600 font-black tracking-[0.3em] hover:border-indigo-500/30 hover:text-indigo-400 transition-all relative z-10"
        >
          VIEW FULL REPORT HISTORY →
        </button>
      )}
    </div>
  );
};