'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HRSidebar } from '../Dashboard/sidebar';
import { 
  Users, Search, Filter, Download, UserCheck, 
  AlertTriangle, Clock, X, Building2, Loader2 
} from 'lucide-react';

export interface HRAttendanceRecord {
  id: string;
  name: string;
  dept: string; 
  shift: string;
  login: string;
  status: string;
}

export interface HRFilterState {
  status: string;
  department: string;
  shift: string;
}

interface HRAttendanceUIProps {
  data: HRAttendanceRecord[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  filters: HRFilterState;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

export const HRAttendanceUI = ({
  data,
  searchTerm,
  onSearchChange,
  onExport,
  filters,
  onFilterChange,
  onResetFilters,
  isLoading
}: HRAttendanceUIProps) => {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFilterActive = filters.status !== 'ALL' || filters.department !== 'ALL' || filters.shift !== 'ALL';
  const lateCount = data.filter(a => a.status === 'LATE').length;
  const presentCount = data.filter(a => a.status === 'PRESENT').length;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black">
      <HRSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
        
        {/* HEADER SECTION */}
        <header className="px-6 md:px-12 py-8 md:py-10 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-end backdrop-blur-md sticky top-0 z-30 bg-[#020617]/80 gap-6">
          <div className="mt-10 xl:mt-0">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              HR <span className="text-indigo-600">Intelligence</span>
            </h1>
            <p className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase mt-3">{today}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-center">
            {/* SEARCH BAR */}
            <div className="relative group w-full sm:w-72 lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="SEARCH GLOBAL AGENT..."
                className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-indigo-500/50 transition-all w-full text-white uppercase italic"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {/* FILTER SYSTEM */}
              <div className="relative flex-1 sm:flex-none" ref={filterRef}>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    isFilterActive ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Filter className="w-4 h-4" /> Filter
                </button>

                {showFilter && (
                  <div className="absolute right-0 top-16 z-[60] w-72 md:w-80 bg-[#0a0f1e] border border-white/10 rounded-[2.5rem] shadow-2xl p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Filters</span>
                      {isFilterActive && (
                        <button onClick={onResetFilters} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300">Reset</button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Department</p>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[10px] font-black text-white uppercase outline-none focus:border-indigo-500/40"
                          value={filters.department}
                          onChange={(e) => onFilterChange('department', e.target.value)}
                        >
                          <option value="ALL" className="bg-[#0a0f1e]">All Departments</option>
                          <option value="IT" className="bg-[#0a0f1e]">Information Technology</option>
                          <option value="HR" className="bg-[#0a0f1e]">Human Resources</option>
                          <option value="OP" className="bg-[#0a0f1e]">Operations</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</p>
                        <div className="grid grid-cols-2 gap-2">
                          {['ALL', 'PRESENT', 'LATE', 'ABSENT'].map((s) => (
                            <button
                              key={s}
                              onClick={() => onFilterChange('status', s)}
                              className={`py-3 rounded-xl text-[9px] font-black border transition-all ${filters.status === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button onClick={() => setShowFilter(false)} className="w-full py-4 bg-white/10 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Apply & Close</button>
                  </div>
                )}
              </div>

              <button onClick={onExport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 italic">
                <Download className="w-4 h-4" /> Export 
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-[1600px] w-full mx-auto space-y-10">
          
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Global Workforce', val: data.length, icon: UserCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { label: 'Active Presence', val: presentCount, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Late Exceptions', val: lateCount, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 backdrop-blur-3xl shadow-xl hover:bg-slate-900/60 transition-all">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-lg shadow-black/20`}><stat.icon className="w-7 h-7" /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase mb-1">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color} tracking-tighter italic`}>{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GLOBAL ATTENDANCE TABLE */}
          <div className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black border-b border-white/5 bg-white/[0.02] italic">
                    <th className="px-10 py-7">Agent ID</th>
                    <th className="px-10 py-7">Name</th>
                    <th className="px-10 py-7">Department</th>
                    <th className="px-10 py-7">Clock In</th>
                    <th className="px-10 py-7 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                          <p className="text-[10px] font-black text-indigo-500 tracking-[0.5em] italic">DECRYPTING REGISTRY...</p>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr><td colSpan={5} className="px-10 py-24 text-center text-[10px] font-black text-slate-600 tracking-[0.4em] uppercase italic">No global records found in archive</td></tr>
                  ) : (
                    data.map((agent, index) => (
                      <tr key={`${agent.id}-${index}`} className="hover:bg-white/[0.03] transition-all group">
                        <td className="px-10 py-7 text-[10px] font-black text-slate-500 tracking-widest font-mono italic">{agent.id}</td>
                        <td className="px-10 py-7 font-black text-white text-xs uppercase group-hover:text-indigo-400 transition-colors italic">{agent.name}</td>
                        <td className="px-10 py-7 font-black text-slate-400 text-[10px] tracking-[0.2em]">{agent.dept}</td>
                        <td className="px-10 py-7 font-mono text-white text-sm tracking-tighter">{agent.login}</td>
                        <td className="px-10 py-7 text-right">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black tracking-widest uppercase italic ${
                            agent.status === 'LATE' 
                              ? 'text-orange-400 border-orange-400/20 bg-orange-400/5' 
                              : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {agent.status}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="h-10" />
        </div>
      </section>
    </main>
  );
};