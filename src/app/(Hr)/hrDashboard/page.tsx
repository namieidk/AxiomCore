'use client';

import React, { useState, useEffect } from 'react';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { NavbarWrapper } from '../../../components/(Employee)/Dashboard/NavbarWrapper';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight,
  Briefcase,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  metrics: {
    headcount: string;
    requisitions: string;
    applicants: string;
    attrition: string;
  };
  recentApplicants: Array<{
    name: string;
    role: string;
    date: string;
    source: string;
  }>;
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Dashboard`;

export default function HRDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_BASE}/hr-stats`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Dashboard Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] italic font-black">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-[10px] text-indigo-400 tracking-[0.5em] uppercase">Initializing Command Center...</p>
      </div>
    );
  }

  const stats = [
    { label: 'ACTIVE HEADCOUNT',  val: data?.metrics.headcount   || '0',  icon: Users,     color: 'text-white' },
    { label: 'OPEN REQUISITIONS', val: data?.metrics.requisitions || '0',  icon: Briefcase, color: 'text-indigo-400' },
    { label: 'NEW APPLICANTS',    val: data?.metrics.applicants   || '0',  icon: UserPlus,  color: 'text-emerald-500' },
    { label: 'ATTRITION RATE',    val: data?.metrics.attrition    || '0%', icon: TrendingUp, color: 'text-orange-400' },
  ];

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic">
      <HRSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
        <NavbarWrapper />

        <div className="p-6 md:p-12 max-w-[1600px] w-full mx-auto space-y-8 md:space-y-10">

          {/* HR COMMAND METRICS - RESPONSIVE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-between backdrop-blur-3xl group hover:border-indigo-500/30 transition-all shadow-xl">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center mb-4 md:mb-6 ${stat.color} shadow-lg shadow-black/20`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[8px] md:text-[9px] font-black text-slate-600 tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-2xl md:text-3xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">

            {/* RECENT APPLICANTS LIST - RESPONSIVE CONTAINER */}
            <div className="xl:col-span-2 bg-slate-900/20 border border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center bg-white/5 gap-4">
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white text-center sm:text-left">Pending Talent Pipeline</h3>
                <Link href="/hr/applicants" className="text-[8px] md:text-[9px] font-black text-indigo-500 hover:text-indigo-400 transition-colors tracking-widest uppercase border border-indigo-500/20 px-4 py-2 rounded-full hover:bg-indigo-500/5">
                  View All Applicants
                </Link>
              </div>
              
              <div className="divide-y divide-white/5 overflow-x-auto">
                {data?.recentApplicants.map((applicant, i) => (
                  <div key={i} className="px-6 md:px-10 py-5 md:py-6 flex justify-between items-center hover:bg-white/5 transition-all group min-w-[500px] sm:min-w-full">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/10 flex items-center justify-center text-indigo-500 text-[10px] font-black shadow-inner">
                        {applicant.name[0]}{applicant.name.split(' ')[1]?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white tracking-tight uppercase">{applicant.name}</p>
                        <p className="text-[8px] md:text-[9px] font-bold text-slate-500 tracking-widest">{applicant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-10">
                      <div className="text-right">
                        <p className="text-[7px] md:text-[8px] font-black text-slate-600 tracking-widest">{applicant.source}</p>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400">{applicant.date}</p>
                      </div>
                      <div className="p-2 md:p-2.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all cursor-pointer">
                        <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500 group-hover:text-indigo-400" />
                      </div>
                    </div>
                  </div>
                ))}
                {(!data || data.recentApplicants.length === 0) && (
                  <div className="p-16 md:p-20 text-center text-slate-600 text-[10px] font-black tracking-widest">
                    SYSTEM SYNCED // NO PENDING PIPELINE
                  </div>
                )}
              </div>
            </div>

            {/* CRITICAL COMPLIANCE ALERTS - RESPONSIVE LIST */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] px-4 md:px-6">Compliance Radar</h3>
              <div className="space-y-4">
                {[
                  { title: 'PAYROLL FINALIZATION', body: 'Q1 Payroll logs require sign-off by EOD.',              urgent: true  },
                  { title: 'LEAVE CONFLICT',       body: '3 Managers applied for overlapping leave dates.',       urgent: false },
                  { title: 'SECURITY AUDIT',       body: '5 Employees missing biometric re-verification.',       urgent: true  },
                ].map((alert, i) => (
                  <div key={i} className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all shadow-xl hover:scale-[1.02] ${
                    alert.urgent ? 'bg-red-500/5 border-red-500/20 shadow-red-500/5' : 'bg-slate-900/40 border-white/5'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-2 h-2 rounded-full ${alert.urgent ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'}`} />
                      <h4 className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase ${alert.urgent ? 'text-red-400' : 'text-white'}`}>
                        {alert.title}
                      </h4>
                    </div>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed">
                      {alert.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Spacer for bottom navigation / scroll */}
          <div className="h-10" />
        </div>
      </section>
    </main>
  );
}