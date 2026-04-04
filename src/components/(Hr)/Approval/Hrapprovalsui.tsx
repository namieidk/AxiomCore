'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  Calendar,
  User,
  ChevronDown,
  Loader2,
} from 'lucide-react';

export interface ApprovalRequest {
  id: number;
  employeeId: number;
  name: string;
  type: string;
  date: string;
  reason: string;
  priority: 'HIGH' | 'NORMAL';
}

interface HRApprovalsUIProps {
  requests: ApprovalRequest[];
  onAction: (id: number, type: 'APPROVED' | 'REJECTED') => void;
  loading?: boolean;
}

export const HRApprovalsUI = ({ requests, onAction, loading = false }: HRApprovalsUIProps) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH'>('ALL');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const highPriorityCount = requests.filter((r) => r.priority === 'HIGH').length;
  const filtered = filter === 'HIGH' ? requests.filter((r) => r.priority === 'HIGH') : requests;

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black">
    

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
        
        {/* HEADER */}
        <header className="px-6 md:px-12 py-8 md:py-10 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-end backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80 gap-6">
          <div className="mt-10 xl:mt-0">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                Governance &amp; Compliance
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Final <span className="text-indigo-600">Authorizations</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-center">
            <div className="w-full sm:w-auto px-5 py-3 bg-indigo-600/10 border border-indigo-600/30 rounded-xl text-[10px] font-black text-indigo-400 tracking-widest uppercase text-center">
              {requests.length} AWAITING DECISION
            </div>
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 w-full sm:w-auto">
              {(['ALL', 'HIGH'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[9px] font-black tracking-[0.2em] transition-all ${
                    filter === t ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {t === 'HIGH' ? 'URGENT' : 'ALL'}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-[1400px] w-full mx-auto space-y-6">
          
          {loading ? (
            <div className="flex flex-col items-center py-20 italic">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-[10px] font-black tracking-[0.3em] text-slate-500">Syncing Ledger...</p>
            </div>
          ) : (
            <>
              {/* Pre-approval notice */}
              <div className="bg-indigo-600/5 border border-indigo-600/20 p-5 rounded-[2rem] flex items-start gap-5 shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/40">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white tracking-widest mb-1 uppercase">
                    Attention Required
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider leading-relaxed uppercase italic">
                    All requests below have been pre-approved by their managers. Your decision is final.
                    {highPriorityCount > 0 &&
                      ` ${highPriorityCount} high priority request${highPriorityCount > 1 ? 's require' : ' requires'} immediate sign-off.`}
                  </p>
                </div>
              </div>

              {/* High priority alert */}
              {highPriorityCount > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-[1.5rem] flex items-center gap-4 animate-pulse">
                  <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center text-slate-950 shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-black text-orange-400 tracking-widest uppercase">
                    {highPriorityCount} High Priority Request{highPriorityCount > 1 ? 's' : ''} — Immediate Action Required
                  </p>
                </div>
              )}

              {/* REQUESTS LIST */}
              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[3rem]">
                    <p className="text-slate-600 font-black tracking-[0.5em] text-[10px] uppercase italic">
                      System Synchronized // No Pending HR Actions
                    </p>
                  </div>
                ) : (
                  filtered.map((req) => {
                    const isExpanded = expandedIds.has(req.id);
                    return (
                      <div
                        key={req.id}
                        className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/20 transition-all group overflow-hidden shadow-2xl backdrop-blur-3xl"
                      >
                        {/* Urgent stripe */}
                        {req.priority === 'HIGH' && (
                          <div className="h-[4px] w-full bg-gradient-to-r from-red-500 via-orange-500 to-indigo-600" />
                        )}

                        {/* MAIN CONTENT */}
                        <div className="px-6 md:px-8 py-6 flex flex-col xl:flex-row items-center gap-6 xl:gap-8">

                          {/* Avatar & ID */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all shadow-lg ${
                            req.priority === 'HIGH'
                              ? 'bg-red-500/10 border-red-500/30 shadow-red-500/5'
                              : 'bg-slate-800 border-white/5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20'
                          }`}>
                            <User className={`w-6 h-6 ${
                              req.priority === 'HIGH' ? 'text-red-400' : 'text-slate-500 group-hover:text-indigo-400'
                            }`} />
                          </div>

                          {/* Identity & Type */}
                          <div className="flex-1 min-w-0 text-center xl:text-left w-full">
                            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3 mb-2">
                              <span className="text-[10px] font-black text-indigo-500 tracking-widest">#{req.id}</span>
                              <span className="text-xl font-black text-white tracking-tighter italic uppercase">{req.name}</span>
                              <div className="flex gap-2">
                                <span className="text-[8px] font-black px-2 py-1 rounded-lg border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase">
                                  MGR APPROVED
                                </span>
                                {req.priority === 'HIGH' && (
                                  <span className="text-[8px] font-black px-2 py-1 rounded-lg border bg-red-500/10 text-red-400 border-red-500/20 uppercase animate-bounce">
                                    URGENT
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap justify-center xl:justify-start items-center gap-5">
                              <span className="text-[11px] font-black text-indigo-400 tracking-[0.2em] uppercase">{req.type}</span>
                              <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                                <Calendar className="w-3.5 h-3.5 text-indigo-500" />{req.date}
                              </span>
                            </div>
                          </div>

                          {/* Actions - Stacks on Mobile */}
                          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto pt-6 xl:pt-0 border-t xl:border-t-0 xl:border-l border-white/5 xl:pl-8">
                            <button
                              onClick={() => toggleExpand(req.id)}
                              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-[9px] font-black tracking-widest uppercase transition-all ${
                                isExpanded
                                  ? 'bg-indigo-600/10 border-indigo-600/30 text-indigo-400'
                                  : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              REASON
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            <button
                              onClick={() => onAction(req.id, 'REJECTED')}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-red-500/20 text-red-400 font-black text-[9px] tracking-[0.2em] hover:bg-red-500 hover:text-white hover:border-transparent transition-all uppercase active:scale-95"
                            >
                              <XCircle className="w-4 h-4" />
                              DENY
                            </button>

                            <button
                              onClick={() => onAction(req.id, 'APPROVED')}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-black text-[9px] tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 uppercase active:scale-95 italic"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              FINAL APPROVE
                            </button>
                          </div>
                        </div>

                        {/* EXPANDABLE REASON */}
                        {isExpanded && (
                          <div className="px-6 md:px-8 pb-8">
                            <div className="bg-white/[0.02] border border-indigo-500/10 rounded-3xl p-6 shadow-inner">
                              <p className="text-[9px] font-black text-indigo-500/60 tracking-[0.3em] uppercase mb-3">
                                Case Justification
                              </p>
                              <p className="text-[11px] font-bold text-slate-300 tracking-[0.1em] leading-relaxed uppercase italic">
                                {req.reason}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          <div className="h-10" />
        </div>
      </section>
    </main>
  );
};