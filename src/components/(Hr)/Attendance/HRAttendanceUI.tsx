'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Search, Filter, Download, UserCheck, 
  AlertTriangle, Loader2,
  ChevronLeft, ChevronRight
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
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export const HRAttendanceUI = ({
  data,
  searchTerm,
  onSearchChange,
  onExport,
  filters,
  onFilterChange,
  onResetFilters,
  isLoading,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  onPageChange,
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

  const handlePrev = () => { if (onPageChange) onPageChange(currentPage - 1); };
  const handleNext = () => { if (onPageChange) onPageChange(currentPage + 1); };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black">

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
        
        {/* HEADER */}
        <header className="px-5 md:px-10 py-5 md:py-6 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-end backdrop-blur-md sticky top-0 z-30 bg-[#020617]/80 gap-4">
          <div className="mt-8 xl:mt-0">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-none">
              HR <span className="text-indigo-600">Intelligence</span>
            </h1>
            <p className="text-[8px] font-black text-slate-500 tracking-[0.3em] uppercase mt-1.5">{today}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-center">
            {/* SEARCH BAR */}
            <div className="relative group w-full sm:w-60 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="SEARCH GLOBAL AGENT..."
                className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[9px] font-black tracking-widest outline-none focus:border-indigo-500/50 transition-all w-full text-white uppercase italic"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {/* FILTER */}
              <div className="relative flex-1 sm:flex-none" ref={filterRef}>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                    isFilterActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Filter className="w-3 h-3" /> Filter
                </button>

                {showFilter && (
                  <div className="absolute right-0 top-12 z-[60] w-64 bg-[#0a0f1e] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Global Filters</span>
                      {isFilterActive && (
                        <button onClick={onResetFilters} className="text-[8px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300">Reset</button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Department</p>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-[9px] font-black text-white uppercase outline-none focus:border-indigo-500/40"
                          value={filters.department}
                          onChange={(e) => onFilterChange('department', e.target.value)}
                        >
                          <option value="ALL" className="bg-[#0a0f1e]">All Departments</option>
                          <option value="IT" className="bg-[#0a0f1e]">Information Technology</option>
                          <option value="HR" className="bg-[#0a0f1e]">Human Resources</option>
                          <option value="OP" className="bg-[#0a0f1e]">Operations</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Status</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {['ALL', 'PRESENT', 'LATE', 'ABSENT'].map((s) => (
                            <button
                              key={s}
                              onClick={() => onFilterChange('status', s)}
                              className={`py-2 rounded-lg text-[8px] font-black border transition-all ${
                                filters.status === s
                                  ? 'bg-indigo-600 border-indigo-500 text-white'
                                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowFilter(false)}
                      className="w-full py-2.5 bg-white/10 hover:bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Apply & Close
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={onExport}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 italic"
              >
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-10 max-w-[1600px] w-full mx-auto space-y-6">
          
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Global Workforce', val: totalItems    ?? 0, icon: UserCheck,    color: 'text-indigo-400',  bg: 'bg-indigo-500/10' },
              { label: 'Active Presence',  val: presentCount  ?? 0, icon: Users,        color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Late Exceptions',  val: lateCount     ?? 0, icon: AlertTriangle,color: 'text-orange-400',  bg: 'bg-orange-500/10' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-slate-900/40 border border-white/5 px-5 py-4 rounded-2xl flex items-center justify-between gap-4 backdrop-blur-3xl shadow-xl hover:bg-slate-900/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} shadow-md shadow-black/20`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-[8px] font-black text-slate-500 tracking-[0.25em] uppercase">{stat.label}</p>
                </div>
                <p className={`text-xl font-black ${stat.color} tracking-tighter italic shrink-0`}>{stat.val}</p>
              </div>
            ))}
          </div>

          {/* TABLE */}
          <div className="bg-slate-900/20 border border-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[8px] uppercase tracking-[0.25em] text-slate-500 font-black border-b border-white/5 bg-white/[0.02] italic">
                    <th className="px-6 py-4">Agent ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Clock In</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                          <p className="text-[8px] font-black text-indigo-500 tracking-[0.5em] italic">DECRYPTING REGISTRY...</p>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-[8px] font-black text-slate-600 tracking-[0.4em] uppercase italic">
                        No global records found in archive
                      </td>
                    </tr>
                  ) : (
                    data.map((agent, index) => (
                      <tr key={`${agent.id}-${index}`} className="hover:bg-white/[0.03] transition-all group">
                        <td className="px-6 py-4 text-[8px] font-black text-slate-500 tracking-widest font-mono italic">{agent.id}</td>
                        <td className="px-6 py-4 font-black text-white text-[9px] uppercase group-hover:text-indigo-400 transition-colors italic">{agent.name}</td>
                        <td className="px-6 py-4 font-black text-slate-400 text-[8px] tracking-[0.2em]">{agent.dept}</td>
                        <td className="px-6 py-4 font-mono text-white text-[9px] tracking-tighter">{agent.login}</td>
                        <td className="px-6 py-4 text-right">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-black tracking-widest uppercase italic ${
                            agent.status === 'LATE'
                              ? 'text-orange-400 border-orange-400/20 bg-orange-400/5'
                              : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                          }`}>
                            <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                            {agent.status}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <footer className="px-6 lg:px-8 py-4 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 italic">
              <p className="text-[8px] text-slate-500 tracking-widest uppercase">
                SHOWING <span className="text-indigo-400">{totalItems ?? 0}</span> AGENTS
              </p>
              <div className="flex items-center gap-4">
                <button
                  disabled={currentPage === 1 || !onPageChange}
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-[8px] text-white tracking-widest uppercase">
                  PAGE {currentPage} / {totalPages || 1}
                </span>
                <button
                  disabled={currentPage === totalPages || totalPages === 0 || !onPageChange}
                  onClick={handleNext}
                  className="p-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </footer>
          </div>

          <div className="h-8" />
        </div>
      </section>
    </main>
  );
};