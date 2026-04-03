'use client';

import React from 'react';
import { ArrowLeft, UserCircle, MessageSquareQuote, Shield } from 'lucide-react';
import { Agent } from './TeamListUI';

interface FeedbackItem {
  id: number;           
  peerDisplay: string;  
  score: string;        
  comment: string;
}

interface PeerResultsUIProps {
  agent: Agent;
  feedbacks: FeedbackItem[];
  onClose: () => void;
}

export const PeerResultsUI = ({ agent, feedbacks, onClose }: PeerResultsUIProps) => {
  return (
    <section className="flex-1 overflow-y-auto bg-[#020617] h-full uppercase scrollbar-hide">
      <div className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-6 md:py-8 flex items-center justify-between">
        <div className="min-w-0">
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 text-[9px] font-black text-indigo-500 hover:text-indigo-400 tracking-widest mb-1 md:mb-2 transition-all"
          >
            <ArrowLeft className="w-3 h-3" /> <span className="truncate">RETURN TO SELECTION</span>
          </button>
          <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter italic truncate">
            PERFORMANCE <span className="text-indigo-600">ANALYTICS</span>
          </h1>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest mb-1 uppercase">TOTAL REPORTS</p>
          <p className="text-xl md:text-2xl font-black text-white italic leading-none">{feedbacks.length}</p>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 md:py-10 max-w-5xl mx-auto">
        <div className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 mb-8 md:mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-2xl">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0">
            <UserCircle className="w-10 md:w-12 h-10 md:h-12 text-white" />
          </div>
          <div className="text-center md:text-left flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight truncate">{agent.name}</h2>
            <p className="text-[9px] md:text-[10px] font-bold text-indigo-400 tracking-[0.2em] md:tracking-[0.3em] uppercase">{agent.role} · ID: {agent.id}</p>
          </div>
          <div className="md:ml-auto text-center md:text-right border-t md:border-t-0 border-white/5 pt-4 md:pt-0 w-full md:w-auto">
            <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest mb-1 uppercase">AGGREGATE SCORE</p>
            <p className="text-3xl md:text-4xl font-black text-white italic leading-none">{agent.peerScore}</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[9px] md:text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">VERIFIED FEEDBACK LOGS</h3>
          </div>

          {feedbacks.length > 0 ? (
            feedbacks.map((item, index) => (
              <div 
                key={`feedback-${item.id}-${index}`} 
                className="group bg-slate-900/20 border border-white/5 hover:border-indigo-500/30 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase">
                      SOURCE: {item.peerDisplay}
                    </span>
                  </div>
                  <div className="bg-slate-950 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/5 flex items-baseline">
                    <span className="text-lg md:text-xl font-black text-white italic leading-none">{item.score}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-600 ml-2">/ 5.0</span>
                  </div>
                </div>

                <div className="relative">
                  <MessageSquareQuote className="absolute -top-1 -left-1 w-6 h-6 md:w-8 md:h-8 text-indigo-500/10" />
                  <p className="text-xs font-medium text-slate-300 leading-relaxed tracking-wide pl-6 italic">
                    {item.comment || "NO QUALITATIVE REMARKS PROVIDED."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 md:py-20 border border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem] text-center">
              <p className="text-[9px] md:text-[10px] font-black text-slate-600 tracking-[0.5em] uppercase">NO HISTORICAL DATA FOUND</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};