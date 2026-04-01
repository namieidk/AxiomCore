'use client';

import React from 'react';
import { CheckSquare, XCircle, CheckCircle2, User, Filter, AlertCircle, Calendar, ChevronDown } from 'lucide-react';

export interface ApprovalRequest {
  id: number;
  employeeId: number;
  name: string;
  type: string;
  date: string;
  reason: string;
  priority: 'HIGH' | 'NORMAL';
}

interface ManagerApprovalsUIProps {
  requests: ApprovalRequest[];
  onAction: (id: number, type: 'APPROVED' | 'REJECTED') => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
}

export const ManagerApprovalsUI = ({ 
  requests, onAction, typeFilter, setTypeFilter, priorityFilter, setPriorityFilter 
}: ManagerApprovalsUIProps) => {
  
  const highPriorityCount = requests.filter(r => r.priority === 'HIGH').length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
      
      <header className="px-12 py-10 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/90">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <CheckSquare className="w-4 h-4" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Administrative Queue</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Pending <span className="text-indigo-600">Approvals</span>
          </h1>
        </div>

        {/* ── FILTER CONTROLS ── */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-[9px] font-black tracking-widest text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer transition-all"
            >
              <option value="ALL">ALL TYPES</option>
              <option value="SICK">SICK LEAVE</option>
              <option value="VACATION">VACATION</option>
              <option value="EMERGENCY">EMERGENCY</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
          </div>

          <div className="relative">
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-[9px] font-black tracking-widest text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer transition-all"
            >
              <option value="ALL">ALL PRIORITIES</option>
              <option value="HIGH">HIGH ONLY</option>
              <option value="NORMAL">NORMAL ONLY</option>
            </select>
          </div>

          <div className="px-6 py-3 bg-indigo-600/10 border border-indigo-600/30 rounded-xl text-[9px] font-black text-indigo-400 tracking-widest">
            {requests.length} MATCHES
          </div>
        </div>
      </header>

      <div className="p-12 max-w-[1400px] w-full mx-auto space-y-8">
        
        {highPriorityCount > 0 && priorityFilter !== 'NORMAL' && (
          <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-[2.5rem] flex items-center gap-5 animate-pulse">
            <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-black text-orange-400 tracking-widest uppercase leading-tight">
              Action Required: {highPriorityCount} High priority requests in current view.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-slate-600 font-black tracking-[1em] text-[10px] uppercase italic">No Requests Match Filter Criteria</p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:border-indigo-500/30 transition-all group">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 border border-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                    <User className="w-8 h-8 text-slate-600 group-hover:text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-black text-white tracking-tight">{req.name}</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                        req.priority === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-800 text-slate-500 border-white/5'
                      }`}>
                        {req.priority} PRIORITY
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-indigo-400 tracking-tighter mb-2">{req.type}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {req.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-md bg-white/5 p-5 rounded-2xl border border-white/5 group-hover:border-indigo-500/10 transition-all">
                  <p className="text-[9px] font-black text-slate-600 tracking-[0.2em] mb-1 italic">JUSTIFICATION</p>
                  <p className="text-[10px] font-bold text-slate-300 tracking-widest leading-relaxed uppercase">{req.reason}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => onAction(req.id, 'REJECTED')} className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-red-400 hover:bg-red-500 hover:text-white transition-all tracking-widest">
                    <XCircle className="w-4 h-4" /> REJECT
                  </button>
                  <button onClick={() => onAction(req.id, 'APPROVED')} className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-slate-950 rounded-2xl text-[10px] font-black tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" /> APPROVE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};