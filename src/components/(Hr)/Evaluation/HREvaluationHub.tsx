'use client';

import React from 'react';
import { ClipboardCheck, Users, ShieldCheck, Activity } from 'lucide-react';

interface HREvaluationHubUIProps {
  onNavigate: (view: 'evaluate' | 'results') => void;
}

export const HREvaluationHubUI = ({ onNavigate }: HREvaluationHubUIProps) => {
  return (
    <section className="flex-1 p-6 md:p-12 flex flex-col justify-center items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
      <div className="text-center mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-center gap-3 text-indigo-500 mb-4">
          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
          <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] uppercase">ADMINISTRATIVE OVERWATCH</span>
        </div>
        <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-4 italic">
          PERFORMANCE <span className="text-indigo-600">AUDIT</span>
        </h1>
        <p className="text-[8px] md:text-[10px] font-black text-slate-500 tracking-[0.3em] md:tracking-[0.5em] uppercase px-4">
          GLOBAL PERSONNEL & MANAGEMENT EVALUATION MODULE
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl uppercase">
        <button
          onClick={() => onNavigate('evaluate')}
          className="group relative bg-slate-900/40 border border-white/5 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] hover:border-indigo-500/50 transition-all duration-500 text-left backdrop-blur-md overflow-hidden active:scale-95"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
            <Activity size={120} />
          </div>
          <ClipboardCheck className="w-10 h-10 md:w-14 md:h-14 text-indigo-500 mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform" />
          <h3 className="text-xl md:text-3xl font-black text-white mb-3 tracking-tighter italic uppercase truncate">LEADERSHIP <span className="text-indigo-600">AUDIT</span></h3>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed uppercase">
            EXECUTE FORMAL PERFORMANCE REVIEWS FOR <span className="text-indigo-400">MANAGEMENT PERSONNEL</span>.
          </p>
          <div className="mt-6 md:mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-[8px] md:text-[9px] font-black text-indigo-500 tracking-widest uppercase">INITIALIZE PROTOCOL</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('results')}
          className="group relative bg-slate-900/40 border border-white/5 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] hover:border-emerald-500/50 transition-all duration-500 text-left backdrop-blur-md overflow-hidden active:scale-95"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
            <Users size={120} />
          </div>
          <Users className="w-10 h-10 md:w-14 md:h-14 text-emerald-500 mb-6 md:mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform" />
          <h3 className="text-xl md:text-3xl font-black text-white mb-3 tracking-tighter italic uppercase truncate">DATA <span className="text-emerald-600">ARCHIVE</span></h3>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed uppercase">
            MONITOR FEEDBACK METRICS ACROSS <span className="text-emerald-400">ALL DEPARTMENTS</span>.
          </p>
          <div className="mt-6 md:mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[8px] md:text-[9px] font-black text-emerald-500 tracking-widest uppercase">ACCESS DATABASE</span>
          </div>
        </button>
      </div>
    </section>
  );
};