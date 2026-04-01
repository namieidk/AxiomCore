'use client';

import React from 'react';
import { ManagerSidebar } from '../../(Manager)/Dashboard/ManagerSidebar';
import {
  BarChart3, Download, TrendingUp, Users,
  Clock, FileText, ChevronRight, PieChart,
  Activity, ShieldCheck, AlertCircle,
  CalendarDays, Check, X, Loader2
} from 'lucide-react';
import { Report, KpiMetric, LeaveRequest } from '../../../app/(Manager)/managerReports/page';

interface ManagerReportsViewProps {
  reports: Report[];
  isLoading: boolean;
  managerName: string;
  department: string;
  leaveRequests: LeaveRequest[];
  leaveLoading: boolean;
  actionId: number | null;
  kpis: KpiMetric[];
  onLeaveAction: (id: number, action: 'APPROVED' | 'REJECTED') => void;
  onAuditDownload: () => void;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const typeIcon = (type: string) => {
  const t = type?.toUpperCase();
  if (t?.includes('PAYROLL')) return Activity;
  if (t?.includes('EVALUATION')) return PieChart;
  if (t?.includes('ATTENDANCE')) return Clock;
  return FileText;
};

const typeSize = (type: string) => {
  const t = type?.toUpperCase();
  if (t?.includes('PAYROLL')) return '2.4 MB';
  if (t?.includes('EVALUATION')) return '1.1 MB';
  if (t?.includes('ATTENDANCE')) return '840 KB';
  return '512 KB';
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const buildWeekBars = (reports: Report[]) => {
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const bars = Array(12).fill(0);
  reports.forEach(r => {
    const d = new Date(r.createdAt);
    const day = Math.floor((d.getTime() - start.getTime()) / 86400000);
    const slot = Math.min(Math.floor(day / 2.5), 11);
    if (slot >= 0) bars[slot]++;
  });
  const max = Math.max(...bars, 1);
  return bars.map(v => Math.round((v / max) * 100));
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function ManagerReportsView({
  reports, isLoading, managerName, department, leaveRequests,
  leaveLoading, actionId, kpis, onLeaveAction, onAuditDownload
}: ManagerReportsViewProps) {

  const weekBars = buildWeekBars(reports);
  const archiveItems = reports.slice(0, 5);

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <ManagerSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]">

        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <BarChart3 className="w-4 h-4" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Data Intelligence</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Operations <span className="text-blue-600">Analytics</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[8px] text-slate-600 tracking-widest mb-1">Authenticated Manager</p>
              <p className="text-[10px] text-blue-400 tracking-widest uppercase font-black">
                {managerName} {department ? `| ${department}` : ''}
              </p>
            </div>
            <button
              onClick={onAuditDownload}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
            >
              <Download className="w-4 h-4" /> Generate Full Audit
            </button>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] w-full mx-auto space-y-10">
          {/* KPI ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {kpis.map((metric, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-[9px] font-black text-slate-500 tracking-widest mb-3">{metric.label}</p>
                <div className="flex items-end justify-between">
                  {isLoading ? <div className="h-8 w-16 bg-slate-800 rounded-lg animate-pulse" /> : <h2 className="text-3xl font-black text-white tracking-tighter">{metric.value}</h2>}
                  <span className={`text-[9px] font-black tracking-widest ${metric.isPositive ? 'text-emerald-500' : 'text-amber-400'}`}>{metric.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* CHART */}
            <div className="lg:col-span-2 bg-slate-900/20 border border-white/5 rounded-[3.5rem] p-10 flex flex-col justify-between min-h-[500px]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-black text-white tracking-[0.3em] mb-1">REPORT ACTIVITY</h3>
                  <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">
                    {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} — DOCUMENTS
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-end gap-3 pt-12">
                {isLoading ? (
                  [40, 65, 30, 80, 50, 70, 45, 60, 75, 35, 55, 85].map((h, i) => <div key={i} className="flex-1 bg-slate-800 rounded-t-xl animate-pulse" style={{ height: `${h}%` }} />)
                ) : weekBars.every(v => v === 0) ? (
                  <div className="flex-1 flex items-center justify-center opacity-30"><p className="text-[10px] tracking-widest">No activity</p></div>
                ) : (
                  weekBars.map((height, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-t-xl relative group/bar">
                      <div className="absolute bottom-0 left-0 w-full bg-blue-600/40 group-hover/bar:bg-blue-500 transition-all rounded-t-xl" style={{ height: `${Math.max(height, 4)}%` }} />
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-between pt-6 text-[8px] font-black text-slate-600 tracking-widest">
                <span>WEEK 01</span><span>WEEK 02</span><span>WEEK 03</span><span>WEEK 04</span>
              </div>
            </div>

            {/* ARCHIVE PANEL */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-blue-500 tracking-[0.4em] px-4 flex items-center gap-3"><FileText className="w-4 h-4" /> Archive Retrieval</h3>
              <div className="space-y-4">
                {isLoading ? (
                  [1,2,3,4].map(i => <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] animate-pulse h-20" />)
                ) : archiveItems.map((report) => {
                  const Icon = typeIcon(report.type);
                  return (
                    <div key={report.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5 text-slate-500 group-hover:text-blue-500"><Icon className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[10px] font-black text-white tracking-tight truncate max-w-[160px]">{report.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[7px] font-black text-slate-600 tracking-widest">{typeSize(report.type)} PDF</span>
                            <span className={`text-[7px] font-black tracking-widest ${report.status?.toUpperCase() === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}`}>{report.status}</span>
                            <span className="text-[7px] text-slate-600 font-bold">{timeAgo(report.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LEAVE QUEUE */}
          <div className="bg-slate-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl">
            <div className="px-10 py-7 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <CalendarDays className="w-5 h-5 text-blue-400" />
                <h3 className="text-xs font-black text-white tracking-[0.3em]">LEAVE APPROVAL QUEUE</h3>
              </div>
              {leaveRequests.length > 0 && <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black tracking-widest">{leaveRequests.length} PENDING</span>}
            </div>

            {leaveLoading ? (
              <div className="p-10 space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse" />)}</div>
            ) : leaveRequests.length === 0 ? (
              <div className="p-20 flex flex-col items-center gap-4 opacity-40"><CalendarDays className="w-10 h-10 text-blue-500" /><p className="text-[10px] tracking-[0.4em]">NO PENDING REQUESTS</p></div>
            ) : (
              <div className="divide-y divide-white/5">
                {leaveRequests.map((req) => (
                  <div key={req.id} className="px-10 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`w-1 h-12 rounded-full ${req.priority === 'HIGH' ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-[11px] font-black text-white uppercase">{req.name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[7px] font-black border ${req.priority === 'HIGH' ? 'text-red-400 border-red-500/20' : 'text-blue-400 border-blue-500/20'}`}>{req.priority}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[8px] font-black text-slate-500 tracking-widest uppercase">
                          <span className="text-blue-400">{req.type}</span><span>•</span><span>{req.date}</span><span>•</span><span className="truncate max-w-[260px]">{req.reason}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {actionId === req.id ? <Loader2 className="w-5 h-5 text-blue-400 animate-spin" /> : (
                        <>
                          <button onClick={() => onLeaveAction(req.id, 'APPROVED')} className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[8px] font-black tracking-widest transition-all"><Check className="w-3.5 h-3.5 inline mr-1" /> APPROVE</button>
                          <button onClick={() => onLeaveAction(req.id, 'REJECTED')} className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-[8px] font-black tracking-widest transition-all"><X className="w-3.5 h-3.5 inline mr-1" /> REJECT</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}