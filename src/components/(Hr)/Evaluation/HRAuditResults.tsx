'use client';

import React from 'react';
import { BarChart, ShieldAlert, X, Calendar, Database, Hash } from 'lucide-react';
import { Agent } from './HRTeamList';

export interface PeerFeedback {
  id: number;
  peerDisplay: string; 
  score: string;
  comment: string;
  date?: string;
}

interface HRAuditResultsUIProps {
  agent: Agent;
  feedbacks: PeerFeedback[];
  onClose: () => void;
}

export const HRAuditResultsUI = ({ agent, feedbacks, onClose }: HRAuditResultsUIProps) => {
  return (
    <section className="flex-1 flex flex-col overflow-hidden bg-[#020617] uppercase font-sans">
      <header className="px-6 md:px-12 py-6 md:py-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-slate-950/50 backdrop-blur-xl z-10 gap-6">
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-500 text-xl md:text-3xl shrink-0">
            {agent.name[0]}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
              <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter italic uppercase truncate">
                {agent.name}
              </h2>
              <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[7px] md:text-[9px] font-black text-indigo-500 tracking-widest uppercase shrink-0">
                {agent.role}
              </div>
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 tracking-[0.2em] md:tracking-[0.4em] truncate">
              ID: <span className="text-indigo-500/80">{agent.id}</span> • DEPT: {agent.department}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="group w-full md:w-auto flex items-center justify-center gap-4 px-6 md:px-8 py-3 md:py-4 bg-red-500/5 border border-red-500/20 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] tracking-[0.3em] text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <X size={14} className="group-hover:rotate-90 transition-transform" />
          TERMINATE AUDIT
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 md:space-y-8 scrollbar-hide">
        <div className="bg-amber-500/5 border border-amber-500/10 p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4 text-center md:text-left">
             <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
             <p className="text-[8px] md:text-[10px] font-black text-amber-500 tracking-[0.2em] md:tracking-[0.3em] leading-relaxed">
               ENCRYPTION ACTIVE: PEER IDENTITIES ARE MASKED FOR INTEGRITY
             </p>
           </div>
           <div className="flex items-center gap-6 text-[9px] md:text-[10px] font-black text-slate-600 tracking-widest">
              <div className="flex items-center gap-2">
                <Database size={12} /> RECORDS: {feedbacks.length}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {feedbacks.length > 0 ? feedbacks.map((feedback) => (
            <div 
              key={feedback.id} 
              className="bg-slate-900/40 border border-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] group hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash size={10} className="text-indigo-500" />
                    <span className="text-[9px] md:text-[10px] font-black text-indigo-500 tracking-[0.2em] md:tracking-[0.3em] truncate">
                      {feedback.peerDisplay}
                    </span>
                  </div>
                  {feedback.date && (
                    <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-bold text-slate-600 tracking-widest uppercase">
                      <Calendar size={10} /> {feedback.date}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[7px] md:text-[8px] font-black text-slate-600 tracking-widest mb-1">RATING</span>
                  <div className="flex items-center gap-2 md:gap-3 text-emerald-500">
                    <BarChart className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
                    <span className="text-2xl md:text-3xl font-black tracking-tighter italic">{feedback.score}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <p className="text-[10px] md:text-[11px] font-bold text-slate-300 tracking-[0.1em] md:tracking-[0.15em] leading-relaxed italic uppercase relative z-10">
                  &quot;{feedback.comment}&quot;
                </p>
                <span className="absolute -top-4 -left-2 text-5xl md:text-6xl font-black text-white/5 pointer-events-none group-hover:text-indigo-500/10 transition-colors">“</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 md:py-40 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] md:rounded-[4rem] bg-slate-900/10">
               <Database className="w-8 h-8 text-slate-700 mx-auto mb-6" />
               <p className="text-[9px] md:text-[11px] font-black text-slate-600 tracking-[0.3em] md:tracking-[0.5em] uppercase px-4">
                 NO ANALYTIC DATA CAPTURED FOR THIS CYCLE
               </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};