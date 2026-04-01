'use client';

import React from 'react';
import { AdminSidebar } from '../../../components/(Admin)/Sidebar';
import {
  Database, Download, FileJson, FileSpreadsheet, FileText,
  Calendar, Lock, ChevronRight, Activity, Clock, 
  AlertCircle, Users, HardDrive
} from 'lucide-react';
import { Report, AdminStats, OrgSummary } from '../../../app/(Admin)/adminReports/page';

interface AdminReportsUIProps {
  reports: Report[];
  stats: AdminStats | null;
  summary: OrgSummary | null;
  isLoading: boolean;
  statsLoading: boolean;
  adminName: string;
  onExportCSV: () => void;
}

// ── Visual Helpers ──
const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

const typeIcon = (type: string) => {
  const t = type?.toUpperCase();
  if (t?.includes('PAYROLL')) return FileSpreadsheet;
  if (t?.includes('JSON')) return FileJson;
  if (t?.includes('ATTENDANCE')) return Clock;
  return FileText;
};

const downloadReportPDF = (report: Report) => {
  if (report.downloadUrl && report.downloadUrl !== '#') {
    window.open(report.downloadUrl, '_blank');
    return;
  }
  const html = `
    <!DOCTYPE html><html><head><title>${report.reportNumber}</title>
    <style>
      body{font-family:sans-serif;padding:50px;color:#333;}
      .header{border-bottom:2px solid #dc2626;padding-bottom:20px;margin-bottom:30px;}
      .badge{padding:4px 10px;border-radius:20px;font-size:10px;text-transform:uppercase;font-weight:bold;background:#fee2e2;color:#991b1b;}
      table{width:100%;border-collapse:collapse;}
      td{padding:12px;border-bottom:1px solid #eee;}
    </style></head><body>
    <div class="header"><h1>Admin Global Repository</h1><p>${report.reportNumber} • ${report.department}</p></div>
    <h2>${report.name}</h2>
    <table>
      <tr><td>Status</td><td><span class="badge">${report.status}</span></td></tr>
      <tr><td>Employee ID</td><td>${report.employeeId}</td></tr>
      <tr><td>Timestamp</td><td>${new Date(report.createdAt).toLocaleString()}</td></tr>
    </table>
    </body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) setTimeout(() => { win.print(); URL.revokeObjectURL(url); }, 800);
};

export const AdminReportsUI = ({
  reports, stats, summary, isLoading, statsLoading, adminName, onExportCSV
}: AdminReportsUIProps) => {
  const now = new Date();

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <AdminSidebar />
      <section className="flex-1 flex flex-col overflow-y-auto bg-[#020617]">
        
        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-[0.4em]">Master Data Access</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Global <span className="text-indigo-600">Repository</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onExportCSV} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3">
              <Download className="w-4 h-4" /> Export Full Audit
            </button>
            <div className="text-right hidden md:block">
              <p className="text-[8px] text-slate-600 tracking-widest mb-1">Authenticated Admin</p>
              <p className="text-[10px] text-indigo-400 tracking-widest uppercase font-black">{adminName}</p>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] w-full mx-auto space-y-10">
          {/* Integrity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'TOTAL ACCOUNTS', val: statsLoading ? '—' : stats?.totalAccounts, icon: Users },
              { label: 'DATA BREACHES', val: '0', icon: Lock },
              { label: 'STORAGE USED', val: statsLoading ? '—' : stats?.storageUsedGB, icon: HardDrive }
            ].map((card, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] relative group overflow-hidden transition-all hover:border-indigo-500/30">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all" />
                <card.icon className="w-5 h-5 text-indigo-400 mb-6" />
                <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">{card.label}</p>
                <p className="text-3xl font-black text-white tracking-tighter">{card.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Export Center */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-black text-indigo-500 tracking-[0.4em] px-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> SECURE EXPORT CENTER
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.slice(0, 6).map((report) => {
                  const Icon = typeIcon(report.type);
                  return (
                    <div key={report.id} onClick={() => downloadReportPDF(report)} className="bg-slate-900/20 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white truncate max-w-[140px]">{report.name}</h4>
                          <p className="text-[7px] text-slate-500 mt-1 font-bold tracking-widest">{report.department} • {timeAgo(report.createdAt)}</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                  );
                })}
              </div>

              {/* Data Visuals - Progress Bars */}
              {summary && (
                <div className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-500 tracking-[0.3em] mb-6 uppercase">Departmental Distribution</h4>
                    {summary.byDepartment.slice(0, 4).map(bd => (
                      <div key={bd.department} className="mb-4">
                         <div className="flex justify-between text-[8px] font-black mb-1">
                           <span className="text-indigo-400">{bd.department}</span>
                           <span className="text-white">{bd.count}</span>
                         </div>
                         <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${(bd.count/summary.total)*100}%` }} />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Activity */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-slate-500 tracking-[0.4em] px-4 uppercase">System Activity</h3>
               <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 space-y-6">
                  {reports.slice(0, 5).map(r => (
                    <div key={r.id} className="border-b border-white/5 pb-4 last:border-0">
                      <p className="text-[10px] text-white font-black truncate">{r.name}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-[8px] text-slate-600">EMP {r.employeeId}</span>
                        <span className="text-[8px] text-indigo-500">{timeAgo(r.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                  
                  {!isLoading && summary && (
                    <div className="pt-4 grid grid-cols-3 text-center border-t border-white/5">
                      <div><p className="text-xl font-black text-white">{summary.total}</p><p className="text-[7px] text-slate-600">TOTAL</p></div>
                      <div><p className="text-xl font-black text-emerald-400">{summary.approved}</p><p className="text-[7px] text-slate-600">APR</p></div>
                      <div><p className="text-xl font-black text-amber-400">{summary.pending}</p><p className="text-[7px] text-slate-600">PND</p></div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};