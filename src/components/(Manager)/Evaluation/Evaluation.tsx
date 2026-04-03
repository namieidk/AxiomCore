'use client';

import React from 'react';
import { ClipboardCheck, Users } from 'lucide-react';

interface EvaluationHubUIProps {
  onNavigate: (view: 'evaluate' | 'results') => void;
}

export const EvaluationHubUI = ({ onNavigate }: EvaluationHubUIProps) => {
  return (
    <section className="flex-1 p-6 md:p-12 flex flex-col justify-center items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
          PERFORMANCE <span className="text-indigo-600">HUB</span>
        </h1>
        <p className="text-[8px] md:text-[10px] font-black text-slate-500 tracking-[0.3em] md:tracking-[0.5em]">SELECT OPERATIONAL MODULE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl">
        <button
          onClick={() => onNavigate('evaluate')}
          className="bg-slate-900/40 border border-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] hover:border-indigo-500/50 transition-all group text-left"
        >
          <ClipboardCheck className="w-10 h-10 md:w-12 md:h-12 text-indigo-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl md:text-2xl font-black text-white mb-2">EVALUATE TEAM</h3>
          <p className="text-[8px] md:text-[9px] font-bold text-slate-500 tracking-widest uppercase">SUBMIT OFFICIAL PERFORMANCE SCORES</p>
        </button>

        <button
          onClick={() => onNavigate('results')}
          className="bg-slate-900/40 border border-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] hover:border-emerald-500/50 transition-all group text-left"
        >
          <Users className="w-10 h-10 md:w-12 md:h-12 text-emerald-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl md:text-2xl font-black text-white mb-2">EMPLOYEE RESULTS</h3>
          <p className="text-[8px] md:text-[9px] font-bold text-slate-500 tracking-widest uppercase">VIEW ANONYMIZED PEER EVALUATIONS</p>
        </button>
      </div>
    </section>
  );
};