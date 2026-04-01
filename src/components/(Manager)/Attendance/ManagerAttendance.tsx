'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Users, Search, Filter, Download, UserCheck, AlertTriangle, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface AttendanceRecord {
  id: string;
  name: string;
  shift: string;
  login: string;
  status: string;
  health: 'GOOD' | 'WARNING' | 'CRITICAL';
}

export type StatusFilter = 'ALL' | 'PRESENT' | 'LATE' | 'ABSENT';
export type DateFilter = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH';
export type ShiftFilter = 'ALL' | 'MORNING' | 'AFTERNOON' | 'NIGHT';

export interface FilterState {
  status: StatusFilter;
  date: DateFilter;
  shift: ShiftFilter;
}

interface ManagerAttendanceUIProps {
  attendanceData: AttendanceRecord[];
  totalItems: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ManagerAttendanceUI = ({
  attendanceData,
  totalItems,
  searchTerm,
  onSearchChange,
  onExport,
  filters,
  onFilterChange,
  onResetFilters,
  currentPage,
  totalPages,
  onPageChange,
}: ManagerAttendanceUIProps) => {

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

  const isFilterActive = filters.status !== 'ALL' || filters.date !== 'TODAY' || filters.shift !== 'ALL';
  const lateCount = attendanceData.filter(a => a.status === 'LATE').length;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-4 md:p-12 max-w-[1600px] w-full mx-auto space-y-6 md:space-y-10 uppercase italic">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-6 md:pb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <Clock className="w-4 h-4" strokeWidth={3} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Live Department Stream</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
            Roster <span className="text-indigo-600">Attendance</span>
          </h1>
          <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest uppercase mt-2">{today}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SEARCH AGENT..."
              className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-indigo-500/50 transition-all w-full sm:min-w-[280px] text-white uppercase italic"
            />
          </div>

          <div className="relative w-full sm:w-auto" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isFilterActive ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' : 'bg-white/5 text-slate-400 border-white/10 hover:border-indigo-500/50 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {isFilterActive && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
            </button>

            {showFilter && (
              <div className="absolute right-0 lg:right-0 top-14 z-50 w-full sm:w-80 bg-[#0a0f1e] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Filter Options</span>
                  <div className="flex items-center gap-3">
                    {isFilterActive && <button onClick={onResetFilters} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Reset</button>}
                    <button onClick={() => setShowFilter(false)}><X className="w-4 h-4 text-slate-500 hover:text-white transition-colors" /></button>
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Status</p>
                   <div className="grid grid-cols-2 gap-2">
                     {(['ALL', 'PRESENT', 'LATE', 'ABSENT'] as const).map((s) => (
                       <button key={s} onClick={() => onFilterChange({ ...filters, status: s })} className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${filters.status === s ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-400 border-white/5 hover:border-indigo-500/30'}`}>{s}</button>
                     ))}
                   </div>
                </div>

                <button onClick={() => setShowFilter(false)} className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Apply Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Displaying Agents', val: attendanceData.length, icon: UserCheck, color: 'text-indigo-400' },
          { label: 'Matched Records', val: totalItems, icon: Users, color: 'text-emerald-500' },
          { label: 'Late Flags', val: lateCount, icon: AlertTriangle, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-5 backdrop-blur-3xl">
            <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 ${stat.color} shrink-0`}><stat.icon className="w-5 h-5 md:w-6 md:h-6" /></div>
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest uppercase">{stat.label}</p>
              <p className={`text-xl md:text-2xl font-black ${stat.color} tracking-tighter italic`}>{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE / MOBILE CARDS */}
      <div className="bg-slate-900/20 border border-white/5 rounded-[1.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Desktop View */}
        <table className="hidden md:table w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black border-b border-white/5 bg-white/[0.02]">
              <th className="px-10 py-6">Agent ID</th>
              <th className="px-10 py-6">Name</th>
              <th className="px-10 py-6">Clock In</th>
              <th className="px-10 py-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {attendanceData.length === 0 ? (
              <tr><td colSpan={4} className="px-10 py-20 text-center text-[10px] font-black text-slate-600 tracking-widest uppercase italic">No records found on this page</td></tr>
            ) : (
              attendanceData.map((agent, index) => (
                <tr key={`${agent.id}-${index}`} className="hover:bg-white/5 transition-all group">
                  <td className="px-10 py-7 text-[10px] font-black text-slate-500 tracking-widest font-mono">{agent.id}</td>
                  <td className="px-10 py-7 font-black text-white text-xs uppercase group-hover:text-indigo-400 transition-colors italic">{agent.name}</td>
                  <td className="px-10 py-7 font-mono text-white text-sm">{agent.login}</td>
                  <td className="px-10 py-7">
                    <span className={`text-[10px] font-black tracking-widest uppercase italic ${agent.status === 'LATE' ? 'text-orange-400' : 'text-emerald-500'}`}>
                      ● {agent.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-white/5">
          {attendanceData.length === 0 ? (
            <div className="p-10 text-center text-[10px] font-black text-slate-600 tracking-widest uppercase italic">No records found</div>
          ) : (
            attendanceData.map((agent, index) => (
              <div key={index} className="p-6 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 tracking-widest font-mono uppercase">ID: {agent.id}</p>
                    <h4 className="text-xs font-black text-white uppercase italic">{agent.name}</h4>
                  </div>
                  <span className={`text-[9px] font-black tracking-widest uppercase italic ${agent.status === 'LATE' ? 'text-orange-400' : 'text-emerald-500'}`}>
                    ● {agent.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-mono">{agent.login}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION FOOTER */}
        <div className="px-6 md:px-10 py-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[9px] font-black text-slate-500 tracking-widest uppercase italic">
            Showing <span className="text-indigo-400">{attendanceData.length}</span> of {totalItems} Agents
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex gap-2">
              <button 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center px-4 bg-white/5 border border-white/5 rounded-xl">
                <span className="text-[9px] md:text-[10px] font-black text-indigo-400 tracking-widest uppercase italic whitespace-nowrap">
                  P. {currentPage} <span className="text-slate-600 mx-1">/</span> {totalPages || 1}
                </span>
              </div>

              <button 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-3 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};