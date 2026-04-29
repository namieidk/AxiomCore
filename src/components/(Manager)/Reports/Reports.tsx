'use client';

import React, { useState } from 'react';
import { ManagerSidebar } from '../../(Manager)/Dashboard/ManagerSidebar';
import {
  BarChart3, Download, TrendingUp, Users,
  Clock, FileText, ChevronRight, PieChart,
  Activity, ShieldCheck, AlertCircle,
  CalendarDays, Check, X, Loader2,
  ChevronLeft
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

export default function ManagerReportsView({
  reports, isLoading, managerName, department, leaveRequests,
  leaveLoading, actionId, kpis, onLeaveAction, onAuditDownload
}: ManagerReportsViewProps) {

  const weekBars = buildWeekBars(reports);

  // Archive pagination
  const [archivePage, setArchivePage] = useState(1);
  const archivePerPage = 5;
  const archiveTotalPages = Math.ceil(reports.length / archivePerPage) || 1;
  const archiveAdjusted = Math.min(archivePage, archiveTotalPages);
  const archiveItems = reports.slice(
    (archiveAdjusted - 1) * archivePerPage,
    archiveAdjusted * archivePerPage
  );

  // Leave queue pagination
  const [leavePage, setLeavePage] = useState(1);
  const leavePerPage = 10;
  const leaveTotalPages = Math.ceil(leaveRequests.length / leavePerPage) || 1;
  const leaveAdjusted = Math.min(leavePage, leaveTotalPages);
  const paginatedLeave = leaveRequests.slice(
    (leaveAdjusted - 1) * leavePerPage,
    leaveAdjusted * leavePerPage
  );

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic">
      <ManagerSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617] custom-scrollbar">

        {/* HEADER */}
        <header className="px-6 md:px-12 py-6 md:py-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Data Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
              Operations <span className="text-blue-600">Analytics</span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="text-left md:text-right">
              <p className="text-[7px] md:text-[8px] text-slate-600 tracking-widest mb-1 uppercase">Authenticated Manager</p>
              <p className="text-[9px] md:text-[10px] text-blue-400 tracking-widest uppercase font-black">
                {managerName} <span className="hidden sm:inline opacity-30 mx-1">|</span> <span className="block sm:inline">{department}</span>
              </p>
            </div>
            <button
              onClick={onAuditDownload}
              className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Download className="w-4 h-4" /> Generate Full Audit
            </button>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-[1600px] w-full mx-auto space-y-8 md:space-y-12">

          {/* KPI GRID — number on the right */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {kpis.map((metric, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest mb-3 uppercase">{metric.label}</p>
                <div className="flex items-end justify-between gap-2">
                  <span className={`text-[8px] md:text-[9px] font-black tracking-widest uppercase ${metric.isPositive ? 'text-emerald-500' : 'text-amber-400'}`}>
                    {metric.trend}
                  </span>
                  {isLoading ? (
                    <div className="h-8 w-16 bg-slate-800 rounded-lg animate-pulse" />
                  ) : (
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">{metric.value}</h2>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">

            {/* CHART PANEL */}
            <div className="lg:col-span-2 bg-slate-900/20 border border-white/5 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[10px] md:text-xs font-black text-white tracking-[0.3em] mb-1 uppercase">REPORT ACTIVITY</h3>
                  <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest uppercase">
                    {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} — DOCUMENTS
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-end gap-1.5 md:gap-3 pt-12 md:pt-16">
                {isLoading ? (
                  [40, 65, 30, 80, 50, 70, 45, 60, 75, 35, 55, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-800/40 rounded-t-md md:rounded-t-xl animate-pulse" style={{ height: `${h}%` }} />
                  ))
                ) : weekBars.every(v => v === 0) ? (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-20 gap-2">
                    <Activity className="w-8 h-8" />
                    <p className="text-[8px] md:text-[10px] tracking-widest font-black uppercase">Data Stream Offline</p>
                  </div>
                ) : (
                  weekBars.map((height, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-t-md md:rounded-t-xl relative group/bar">
                      <div className="absolute bottom-0 left-0 w-full bg-blue-600/40 group-hover/bar:bg-blue-500 transition-all rounded-t-md md:rounded-t-xl" style={{ height: `${Math.max(height, 6)}%` }} />
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-between pt-6 text-[7px] md:text-[8px] font-black text-slate-600 tracking-widest uppercase italic">
                <span>WEEK 01</span><span className="hidden sm:inline">WEEK 02</span><span>WEEK 03</span><span className="hidden sm:inline">WEEK 04</span>
              </div>
            </div>

            {/* ARCHIVE PANEL with pagination */}
            <div className="space-y-4">
              <h3 className="text-[10px] md:text-xs font-black text-blue-500 tracking-[0.3em] md:tracking-[0.4em] px-2 flex items-center gap-3 uppercase italic">
                <FileText className="w-4 h-4" /> Archive Retrieval
              </h3>

              <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] overflow-hidden">
                <div className="space-y-0 divide-y divide-white/5">
                  {isLoading ? (
                    [1,2,3,4].map(i => (
                      <div key={i} className="bg-slate-900/40 p-6 animate-pulse h-20" />
                    ))
                  ) : archiveItems.length === 0 ? (
                    <div className="p-10 text-center text-[9px] font-black text-slate-600 tracking-widest uppercase italic">
                      No reports found
                    </div>
                  ) : archiveItems.map((report) => {
                    const Icon = typeIcon(report.type);
                    return (
                      <div key={report.id} className="p-4 md:p-5 flex items-center justify-between group hover:bg-white/[0.03] transition-all cursor-pointer">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className="p-2 md:p-2.5 rounded-xl bg-white/5 text-slate-500 group-hover:text-blue-500 shrink-0">
                            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] md:text-[10px] font-black text-white tracking-tight truncate pr-2 uppercase italic">{report.name}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-[7px] font-black text-slate-600 tracking-widest uppercase">{typeSize(report.type)} PDF</span>
                              <span className={`text-[7px] font-black tracking-widest uppercase ${report.status?.toUpperCase() === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}`}>{report.status}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-800 group-hover:text-white transition-colors shrink-0" />
                      </div>
                    );
                  })}
                </div>

                {/* Archive Pagination */}
                <footer className="px-4 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between italic">
                  <p className="text-[9px] text-slate-500 tracking-widest uppercase font-black">
                    <span className="text-blue-400">{reports.length}</span> TOTAL
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      disabled={archiveAdjusted === 1}
                      onClick={() => setArchivePage(prev => Math.max(1, prev - 1))}
                      className="p-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-blue-400 disabled:opacity-20 transition-all bg-white/5 active:scale-95"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-black text-white tracking-widest uppercase">
                      {archiveAdjusted} / {archiveTotalPages}
                    </span>
                    <button
                      disabled={archiveAdjusted === archiveTotalPages}
                      onClick={() => setArchivePage(prev => Math.min(archiveTotalPages, prev + 1))}
                      className="p-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-blue-400 disabled:opacity-20 transition-all bg-white/5 active:scale-95"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          </div>

          {/* LEAVE QUEUE with pagination */}
          <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden backdrop-blur-3xl mb-12 shadow-2xl">
            <div className="px-6 md:px-10 py-5 md:py-7 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3 md:gap-4">
                <CalendarDays className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                <h3 className="text-[10px] md:text-xs font-black text-white tracking-[0.3em] uppercase italic">LEAVE APPROVAL QUEUE</h3>
              </div>
              {leaveRequests.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[7px] md:text-[8px] font-black tracking-widest uppercase">
                  {leaveRequests.length} PENDING
                </span>
              )}
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              {leaveLoading ? (
                <div className="p-6 md:p-10 space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-20 bg-slate-800/40 rounded-xl md:rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : leaveRequests.length === 0 ? (
                <div className="p-16 md:p-20 flex flex-col items-center gap-4 opacity-40">
                  <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
                  <p className="text-[9px] md:text-[10px] tracking-[0.4em] font-black uppercase">All clear: No pending requests</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5 min-w-[700px] lg:min-w-0">
                  {paginatedLeave.map((req) => (
                    <div key={req.id} className="px-6 md:px-10 py-5 md:py-6 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                      <div className="flex items-center gap-4 md:gap-5 min-w-0">
                        <div className={`w-1 h-10 md:h-12 rounded-full shrink-0 ${req.priority === 'HIGH' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-[10px] md:text-[11px] font-black text-white uppercase italic truncate">{req.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[6px] md:text-[7px] font-black border uppercase tracking-widest ${req.priority === 'HIGH' ? 'text-red-400 border-red-500/20' : 'text-blue-400 border-blue-500/20'}`}>
                              {req.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[7px] md:text-[8px] font-black text-slate-500 tracking-widest uppercase truncate">
                            <span className="text-blue-400">{req.type}</span>
                            <span>•</span>
                            <span>{req.date}</span>
                            <span>•</span>
                            <span className="truncate max-w-[200px] md:max-w-[300px]">{req.reason}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-4">
                        {actionId === req.id ? (
                          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() => onLeaveAction(req.id, 'APPROVED')}
                              className="px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[7px] md:text-[8px] font-black tracking-widest transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                            >
                              <Check className="w-3 md:w-3.5 h-3 md:h-3.5 inline mr-1 md:mr-1.5" /> APPROVE
                            </button>
                            <button
                              onClick={() => onLeaveAction(req.id, 'REJECTED')}
                              className="px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-[7px] md:text-[8px] font-black tracking-widest transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
                            >
                              <X className="w-3 md:w-3.5 h-3 md:h-3.5 inline mr-1 md:mr-1.5" /> REJECT
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leave Queue Pagination */}
            {leaveRequests.length > 0 && (
              <footer className="px-6 lg:px-10 py-6 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 italic">
                <p className="text-[9px] text-slate-500 tracking-widest uppercase font-black">
                  SHOWING <span className="text-blue-400">{leaveRequests.length}</span> REQUESTS
                </p>
                <div className="flex items-center gap-6">
                  <button
                    disabled={leaveAdjusted === 1}
                    onClick={() => setLeavePage(prev => Math.max(1, prev - 1))}
                    className="p-2 lg:p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-blue-400 disabled:opacity-20 transition-all bg-white/5 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[9px] lg:text-[10px] font-black text-white tracking-widest uppercase">
                    PAGE {leaveAdjusted} / {leaveTotalPages}
                  </span>
                  <button
                    disabled={leaveAdjusted === leaveTotalPages}
                    onClick={() => setLeavePage(prev => Math.min(leaveTotalPages, prev + 1))}
                    className="p-2 lg:p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-blue-400 disabled:opacity-20 transition-all bg-white/5 active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </footer>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}