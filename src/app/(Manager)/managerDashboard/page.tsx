'use client';

import React, { useState, useEffect } from 'react';
import { ManagerSidebar } from '../../../components/(Manager)/Dashboard/ManagerSidebar';
import { NavbarWrapper } from '../../../components/(Employee)/Dashboard/NavbarWrapper';
import { useAutoLogout } from '../../../hooks/useAutoLogout';
import {
  Users,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Activity
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PendingApproval {
  name: string;
  type: string;
  date: string;
}

interface ManagerStats {
  headcount:        string;
  pendingLeaves:    string;
  teamSla:          string;
  pendingApprovals: PendingApproval[];
}

export default function ManagerDashboard() {
  useAutoLogout();

  const [stats, setStats]         = useState<ManagerStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stored = localStorage.getItem('user');
        if (!stored) return;
        const { employeeId } = JSON.parse(stored);

        const res = await fetch(`${API_BASE}/api/Dashboard/manager-stats/${employeeId}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch manager stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const approvals = stats?.pendingApprovals ?? [];
  const totalPages = Math.ceil(approvals.length / itemsPerPage) || 1;
  const paginatedApprovals = approvals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const kpiCards = [
    {
      label: 'Active Headcount',
      val:   loading ? '...' : stats?.headcount ?? '0',
      sub:   'DEPARTMENT TOTAL',
      icon:  Users,
      color: 'text-indigo-400',
    },
    {
      label: 'Pending Leaves',
      val:   loading ? '...' : stats?.pendingLeaves ?? '0',
      sub:   'ACTION REQUIRED',
      icon:  AlertCircle,
      color: 'text-orange-400',
    },
    {
      label: 'Team SLA',
      val:   loading ? '...' : stats?.teamSla ?? '0%',
      sub:   'ATTENDANCE RATE',
      icon:  Activity,
      color: 'text-emerald-400',
    },
  ];

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic">
      <ManagerSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">

        <NavbarWrapper />

        <div className="p-6 md:p-12 max-w-[1600px] w-full mx-auto space-y-8 md:space-y-12">

          {/* TOP KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {kpiCards.map((s, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group hover:border-indigo-500/20 transition-all shadow-2xl shadow-black/20">
                <s.icon className={`absolute top-6 right-8 w-10 h-10 md:w-12 md:h-12 ${s.color} opacity-10 group-hover:scale-125 transition-transform duration-500`} />
                <p className="text-[8px] md:text-[10px] font-black text-slate-500 tracking-[0.3em] mb-2 uppercase">{s.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className={`text-[8px] md:text-[9px] font-black ${s.color} tracking-widest uppercase`}>{s.sub}</p>
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">{s.val}</h2>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

            {/* LEFT: PENDING APPROVALS LIST */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden backdrop-blur-sm">

                {/* Table Header */}
                <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="text-[10px] md:text-xs font-black text-white tracking-[0.3em] uppercase italic">Urgent Approvals</h3>
                  <span className="px-3 md:px-4 py-1 bg-orange-500/10 text-orange-400 text-[8px] md:text-[9px] font-black rounded-full border border-orange-500/20 uppercase">
                    {loading ? '...' : `${stats?.pendingLeaves ?? 0} PENDING`}
                  </span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                  {loading ? (
                    <div className="px-10 py-8 text-center text-[9px] font-black text-slate-600 tracking-widest uppercase italic">
                      Loading...
                    </div>
                  ) : paginatedApprovals.length ? (
                    paginatedApprovals.map((req, i) => (
                      <div key={i} className="px-6 md:px-10 py-5 md:py-6 flex justify-between items-center hover:bg-white/5 transition-all group">
                        <div className="flex gap-3 md:gap-4 items-center min-w-0">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-500 text-[10px] border border-white/5 group-hover:border-indigo-500/30 transition-all shrink-0">
                            {req.name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] md:text-xs font-black text-white tracking-tight uppercase italic truncate">{req.name}</p>
                            <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest uppercase truncate">{req.type} — {req.date}</p>
                          </div>
                        </div>
                        <button className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[9px] font-black text-indigo-400 hover:text-white transition-colors tracking-widest uppercase group/btn shrink-0">
                          REVIEW <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="px-10 py-8 text-center text-[9px] font-black text-slate-600 tracking-widest uppercase italic">
                      No Pending Approvals
                    </div>
                  )}
                </div>

                {/* Pagination Footer */}
                <footer className="px-6 lg:px-10 py-6 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 italic">
                  <p className="text-[9px] text-slate-500 tracking-widest uppercase">
                    SHOWING <span className="text-indigo-400">{approvals.length}</span> RECORDS
                  </p>
                  <div className="flex items-center gap-6">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-2 lg:p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5 active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] lg:text-[10px] text-white tracking-widest uppercase">
                      PAGE {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="p-2 lg:p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5 active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </footer>

              </div>
            </div>

            {/* RIGHT: ANALYTICS & STATUS */}
            <div className="space-y-6 md:space-y-8">
              <div className="bg-indigo-600 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                <TrendingUp className="absolute top-[-10px] right-[-10px] md:top-[-20px] md:right-[-20px] w-24 h-24 md:w-32 md:h-32 opacity-20" />
                <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Shift Analytics</h3>
                <p className="text-2xl md:text-3xl font-black tracking-tighter mb-6 md:mb-8 leading-none uppercase italic">
                  Team SLA this month: {loading ? '...' : stats?.teamSla ?? '0%'}
                </p>
                <button className="w-full py-3 md:py-4 bg-slate-950 text-white rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:scale-105 transition-transform shadow-lg">
                  View Full Report
                </button>
              </div>

              <div className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-4 md:space-y-6">
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Resource Status</h3>
                {[
                  { label: 'Workstations', val: '98%',    color: 'bg-emerald-500' },
                  { label: 'Network Load', val: '42%',    color: 'bg-indigo-500'  },
                  { label: 'AVAYA Status', val: 'ONLINE', color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/[0.02] p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                    <span className="text-[9px] md:text-[10px] font-black text-white tracking-widest uppercase italic">{item.label}</span>
                    <span className={`px-2 md:px-3 py-1 rounded-lg text-[8px] md:text-[9px] font-black ${item.color} text-slate-950 uppercase`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}