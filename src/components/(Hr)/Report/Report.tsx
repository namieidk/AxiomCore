'use client';

import React from 'react';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import {
  BarChart3, Download, PieChart, Users, FileSpreadsheet, FileText, 
  Calendar, ChevronRight, Activity, CalendarDays, Check, X, 
  Loader2, ShieldCheck, AlertCircle, Clock
} from 'lucide-react';
import { Report, LeaveRequest, SummaryStats } from '../../../app/(Hr)/hrReports/page';

interface HRReportsUIProps {
  reports: Report[];
  summary: SummaryStats | null;
  isLoading: boolean;
  leaveRequests: LeaveRequest[];
  leaveLoading: boolean;
  actionId: number | null;
  hrName: string;
  onLeaveAction: (id: number, action: 'APPROVED' | 'REJECTED') => void;
  onExportCSV: () => void;
}

// ── Helpers ──
const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const typeIcon = (type: string) => {
  const t = type?.toUpperCase();
  if (t?.includes('PAYROLL')) return FileSpreadsheet;
  if (t?.includes('EVALUATION')) return PieChart;
  if (t?.includes('ATTENDANCE')) return Clock;
  return FileText;
};

const downloadReportPDF = (report: Report) => {
  if (report.downloadUrl && report.downloadUrl !== '#') {
    window.open(report.downloadUrl, '_blank');
    return;
  }
  // ... (Keep your PDF logic here as it's UI/Formatting related)
  const html = `
    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
    <title>${report.reportNumber}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'IBM Plex Sans',sans-serif;background:#fff;color:#0a0a0a;padding:56px 64px;font-size:13px;}
      .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:32px;border-bottom:3px solid #0a0a0a;margin-bottom:40px;}
      .header h1{font-size:28px;font-weight:700;letter-spacing:-1px;font-family:'IBM Plex Mono',monospace;}
      .sub{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#666;margin-top:6px;}
      .badge{display:inline-block;padding:3px 12px;border-radius:99px;font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
      .badge-type{background:#e0e7ff;color:#3730a3;}
      .badge-approved{background:#d1fae5;color:#065f46;}
      .badge-pending{background:#fef3c7;color:#92400e;}
      table{width:100%;border-collapse:collapse;margin-top:32px;}
      th{text-align:left;padding:10px 16px;font-size:8px;letter-spacing:3px;text-transform:uppercase;color:#9ca3af;background:#f9fafb;border-bottom:1.5px solid #e5e7eb;}
      td{padding:14px 16px;border-bottom:1px solid #f3f4f6;font-size:13px;}
      .footer{margin-top:48px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:8px;color:#d1d5db;letter-spacing:3px;text-transform:uppercase;font-family:'IBM Plex Mono',monospace;}
    </style></head><body>
    <div class="header">
      <div><h1>HR Operational Reports</h1>
      <div class="sub">HR View &nbsp;•&nbsp; ${report.department}</div></div>
      <div style="text-align:right;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;color:#4f46e5;letter-spacing:2px;">${report.reportNumber}</div>
        <div style="font-size:9px;color:#999;margin-top:4px;">${new Date(report.createdAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
        <div style="margin-top:8px;"><span class="badge badge-type">${report.type}</span> &nbsp;<span class="badge ${report.status?.toUpperCase()==='APPROVED'?'badge-approved':'badge-pending'}">${report.status}</span></div>
      </div>
    </div>
    <div style="font-size:18px;font-weight:700;margin-bottom:32px;">${report.name}</div>
    <table>
      <thead><tr><th>Field</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td>Report ID</td><td>${report.id}</td></tr>
        <tr><td>Report Number</td><td>${report.reportNumber}</td></tr>
        <tr><td>Type</td><td><span class="badge badge-type">${report.type}</span></td></tr>
        <tr><td>Status</td><td><span class="badge ${report.status?.toUpperCase()==='APPROVED'?'badge-approved':'badge-pending'}">${report.status}</span></td></tr>
        <tr><td>Employee ID</td><td>${report.employeeId}</td></tr>
        <tr><td>Department</td><td>${report.department}</td></tr>
        <tr><td>Created At</td><td>${new Date(report.createdAt).toLocaleString('en-US',{dateStyle:'full',timeStyle:'short'})}</td></tr>
      </tbody>
    </table>
    <div class="footer">
      <span>HR Operational Reports &nbsp;•&nbsp; Confidential</span>
      <span>Printed ${new Date().toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'})}</span>
    </div></body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) setTimeout(() => { win.print(); URL.revokeObjectURL(url); }, 800);
};

export const HRReportsUI = ({
  reports, summary, isLoading, leaveRequests, leaveLoading, 
  actionId, hrName, onLeaveAction, onExportCSV
}: HRReportsUIProps) => {
  const now = new Date();
  const approvedCount = reports.filter(r => r.status?.toUpperCase() === 'APPROVED').length;
  const pendingCount = reports.filter(r => r.status?.toUpperCase() === 'PENDING').length;
  const thisMonthCount = reports.filter(r => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const statCards = [
    { label: 'TOTAL REPORTS', val: isLoading ? '—' : reports.length.toString(), icon: Activity, color: 'text-emerald-500' },
    { label: 'APPROVED', val: isLoading ? '—' : approvedCount.toString(), icon: ShieldCheck, color: 'text-indigo-400' },
    { label: 'PENDING REVIEW', val: isLoading ? '—' : pendingCount.toString(), icon: Clock, color: 'text-amber-400' },
    { label: 'THIS MONTH', val: isLoading ? '—' : thisMonthCount.toString(), icon: Calendar, color: 'text-blue-400' },
  ];

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <HRSidebar />
      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        
        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <BarChart3 className="w-4 h-4" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Analytics & Intelligence</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Operational <span className="text-indigo-600">Reports</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onExportCSV} className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
              <Download className="w-4 h-4" /> Export Full Audit
            </button>
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-indigo-400 tracking-widest uppercase font-black">{hrName}</p>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] w-full mx-auto space-y-10">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black tracking-tighter text-white">{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Grid Layout for Archive and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-black text-indigo-500 tracking-[0.4em]">Document Archive</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.slice(0, 6).map((report) => {
                  const Icon = typeIcon(report.type);
                  return (
                    <div key={report.id} onClick={() => downloadReportPDF(report)} className="bg-slate-900/20 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer">
                      <div className="flex items-center gap-5">
                        <Icon className="w-6 h-6 text-indigo-500" />
                        <div>
                          <h4 className="text-xs font-black text-white truncate max-w-[140px]">{report.name}</h4>
                          <p className="text-[7px] text-slate-500 uppercase">{timeAgo(report.createdAt)}</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xs font-black text-indigo-500 tracking-[0.4em]">Recent System Activity</h3>
               <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 space-y-4">
                 {reports.slice(0, 5).map(r => (
                   <div key={r.id} className="flex justify-between border-b border-white/5 pb-4">
                     <div>
                       <p className="text-[10px] text-white font-black">{r.name}</p>
                       <p className="text-[7px] text-slate-500">EMP {r.employeeId}</p>
                     </div>
                     <span className="text-[8px] text-indigo-400">{timeAgo(r.createdAt)}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* HR Leave Queue */}
          <div className="bg-slate-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="px-10 py-7 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xs font-black text-white tracking-[0.3em]">HR LEAVE FINAL APPROVAL</h3>
            </div>
            {leaveLoading ? (
              <div className="p-10"><Loader2 className="animate-spin w-6 h-6 text-indigo-500 mx-auto" /></div>
            ) : (
              <div className="divide-y divide-white/5">
                {leaveRequests.map((req) => (
                  <div key={req.id} className="px-10 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="text-[11px] font-black text-white uppercase">{req.name}</p>
                        <p className="text-[8px] text-indigo-400 tracking-widest">{req.type} • {req.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {actionId === req.id ? <Loader2 className="animate-spin w-4 h-4" /> : (
                        <>
                          <button onClick={() => onLeaveAction(req.id, 'APPROVED')} className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black">APPROVE & DEDUCT</button>
                          <button onClick={() => onLeaveAction(req.id, 'REJECTED')} className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-black">REJECT</button>
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
};