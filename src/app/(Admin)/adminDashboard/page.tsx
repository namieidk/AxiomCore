'use client';

import React from 'react';

import { AdminSidebar } from '../../../components/(Admin)/Sidebar';
import { SessionGuard } from '../../../components/SessionGuard';
import { 
  ShieldAlert, Activity, Users, Server, Lock, 
  Database, Cpu, Globe, ArrowUpRight, AlertCircle, Search, Bell
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <SessionGuard allowedRoles={['ADMIN']}>
      {/* Changed flex to flex-col on mobile, flex-row on desktop */}
      <main className="h-screen w-full flex flex-col lg:flex-row bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
        <AdminSidebar />

        {/* Added pb-20 for mobile bottom nav spacing */}
        <section className="flex-1 flex flex-col overflow-y-auto scrollbar-hide bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] pb-20 lg:pb-0">
          
          {/* TOP NAV: Responsive padding and search width */}
          <header className="px-6 lg:px-12 py-6 lg:py-8 border-b border-white/5 flex justify-between items-center backdrop-blur-md sticky top-0 z-30 bg-[#020617]/80">
            <div className="relative w-full max-w-[180px] md:max-w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                placeholder="SEARCH..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 lg:py-4 pl-12 pr-6 text-[8px] lg:text-[10px] font-black tracking-widest outline-none focus:border-indigo-500/50"
              />
            </div>
            
            <div className="flex items-center gap-4 lg:gap-6">
              <button className="relative p-2 lg:p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                <Bell className="w-4 h-4 lg:w-5 h-5 text-slate-400" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
              </button>
              
              {/* Profile info hidden on very small screens */}
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2 justify-end text-indigo-500 mb-0.5">
                  <ShieldAlert className="w-3 h-3" />
                  <p className="text-[8px] font-black tracking-[0.3em]">ROOT</p>
                </div>
                <p className="text-[10px] font-black text-white uppercase">Admin</p>
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-12 max-w-[1600px] w-full mx-auto space-y-6 lg:space-y-10">
            
            {/* SYSTEM HEALTH METRICS: 2 columns on mobile, 4 on desktop */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
  {[
    { label: 'CPU LOAD',        val: '12%',   icon: Cpu,      color: 'text-indigo-400' },
    { label: 'MEM USAGE',       val: '4.2GB', icon: Database, color: 'text-white' },
    { label: 'ACTIVE SESSIONS', val: '842',   icon: Globe,    color: 'text-indigo-400' },
    { label: 'SECURITY ALERTS', val: '0',     icon: Lock,     color: 'text-emerald-500' },
  ].map((stat, i) => (
    <div key={i} className="bg-slate-900/40 border border-white/5 p-5 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] backdrop-blur-3xl flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
      {/* Icon Section */}
      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/5 flex items-center justify-center mb-4 lg:mb-6">
        <stat.icon className={`w-5 h-5 lg:w-6 h-6 ${stat.color}`} />
      </div>

      {/* Stats Section: Label on left, Value on right */}
      <div className="flex justify-between items-end gap-2">
        <div className="flex flex-col">
          <p className="text-[7px] lg:text-[9px] font-black text-slate-500 tracking-widest uppercase">
            {stat.label}
          </p>
        </div>
        
        <p className="text-xl lg:text-3xl font-black text-white tracking-tighter leading-none">
          {stat.val}
        </p>
      </div>
    </div>
  ))}
</div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              
              {/* CORE ACTIONS */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                <h3 className="text-[10px] lg:text-xs font-black text-indigo-500 tracking-[0.4em] px-4 flex items-center gap-3">
                  <Server className="w-4 h-4" /> Infrastructure Management
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div className="bg-slate-900/20 border border-white/5 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] hover:border-indigo-500/30 transition-all group">
                    <Users className="w-8 h-8 lg:w-10 lg:h-10 text-indigo-500 mb-4 lg:mb-6" />
                    <h4 className="text-lg lg:text-xl font-black text-white mb-2 uppercase">Manage Accounts</h4>
                    <p className="text-[8px] lg:text-[9px] font-bold text-slate-500 tracking-widest leading-relaxed mb-6 uppercase">
                      Provision roles, reset credentials, and audit user permissions.
                    </p>
                    <button className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-indigo-500 tracking-widest group-hover:gap-4 transition-all">
                      ENTER MODULE <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-900/20 border border-white/5 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] hover:border-indigo-500/30 transition-all group">
                    <Activity className="w-8 h-8 lg:w-10 lg:h-10 text-indigo-500 mb-4 lg:mb-6" />
                    <h4 className="text-lg lg:text-xl font-black text-white mb-2 uppercase">Audit Logs</h4>
                    <p className="text-[8px] lg:text-[9px] font-bold text-slate-500 tracking-widest leading-relaxed mb-6 uppercase">
                      Forensic tracking of database transactions and system modifications.
                    </p>
                    <button className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-indigo-500 tracking-widest group-hover:gap-4 transition-all">
                      VIEW LOGS <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* SECURITY OVERVIEW: Flex-col on mobile */}
                <div className="bg-indigo-600/5 border border-indigo-600/20 p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 lg:gap-6">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                      <AlertCircle className="w-6 h-6 lg:w-8 lg:h-8" />
                    </div>
                    <div>
                      <h4 className="text-[9px] lg:text-xs font-black text-white tracking-widest uppercase mb-1">Patch: Mar 25, 2026</h4>
                      <p className="text-[7px] lg:text-[9px] font-bold text-slate-500 tracking-widest uppercase">System kernel secure.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* NETWORK TRAFFIC */}
              <div className="space-y-6 lg:space-y-8">
                <h3 className="text-[10px] lg:text-xs font-black text-slate-500 tracking-[0.4em] px-4">Network Traffic</h3>
                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] lg:rounded-[3rem] p-8 lg:p-10 space-y-8 lg:space-y-10">
                  {[
                    { label: 'Uptime',    val: '99.99%', sub: '365 DAYS' },
                    { label: 'Latency',   val: '14MS',   sub: 'CLOUDFLARE EDGE' },
                    { label: 'API Calls', val: '1.2M',   sub: 'LAST 24H' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[8px] lg:text-[9px] font-black text-slate-500 tracking-widest">{item.label}</span>
                        <span className="text-md lg:text-lg font-black text-white tracking-tighter">{item.val}</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-3/4" />
                      </div>
                      <p className="text-[7px] lg:text-[8px] font-black text-indigo-500 tracking-[0.2em]">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </SessionGuard>
  );
}