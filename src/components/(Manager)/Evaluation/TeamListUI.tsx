'use client';

import React, { useState } from 'react';
import { UserCircle, ChevronRight, Lock, ArrowLeft } from 'lucide-react';

export interface Agent {
  id:         string;
  name:       string;
  role:       string;
  peerScore:  string;
  department: string;
  alreadyEvaluated?: boolean;
}

interface TeamListUIProps {
  agents:        Agent[];
  mode:          'evaluate' | 'results';
  onSelectAgent: (agent: Agent) => void;
  onBack:        () => void;
}

export const TeamListUI = ({ agents, mode, onSelectAgent, onBack }: TeamListUIProps) => {

  const [dept] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          return String(parsed.department || '').trim().toUpperCase();
        }
      } catch (e) {
        console.error("Failed to parse user department", e);
      }
    }
    return 'UNKNOWN';
  });

  return (
    <section className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#020617] uppercase scrollbar-hide">
      <header className="mb-8 md:mb-12 border-l-2 border-indigo-600 pl-4 md:pl-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-indigo-500 mb-4 hover:underline tracking-widest block transition-all"
        >
          <ArrowLeft className="w-3 h-3" /> EXIT TO HUB
        </button>
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter italic">
          {mode === 'evaluate' ? 'TEAM' : 'PEER'}{' '}
          <span className="text-indigo-600">
            {mode === 'evaluate' ? 'EVALUATION' : 'ANALYSIS'}
          </span>
        </h1>
        <p className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-[0.2em] md:tracking-[0.3em] mt-2">
          SECTOR: <span className="text-slate-200">{dept}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 md:gap-4 max-w-4xl">
        {agents.length > 0 ? (
          agents.map((agent) => {
            const isLocked = agent.alreadyEvaluated && mode === 'evaluate';

            return (
              <button
                key={agent.id}
                disabled={isLocked}
                onClick={() => onSelectAgent(agent)}
                className={`relative overflow-hidden group flex items-center justify-between border p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] transition-all
                  ${isLocked 
                    ? 'bg-slate-900/20 border-red-500/20 opacity-60 cursor-not-allowed' 
                    : 'bg-slate-900/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-lg'}`}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-10 px-4">
                    <div className="bg-red-500/20 border border-red-500/40 px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-2">
                      <Lock size={10} className="text-red-400 shrink-0" />
                      <span className="text-[8px] md:text-[10px] font-black text-red-400 tracking-widest truncate uppercase">MONTHLY LIMIT REACHED</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 md:gap-6 min-w-0">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all shrink-0
                    ${isLocked 
                      ? 'bg-slate-800 text-slate-600' 
                      : 'bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white shadow-xl'}`}>
                    <UserCircle className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className={`text-base md:text-lg font-black tracking-tight truncate ${isLocked ? 'text-slate-500' : 'text-white'}`}>
                      {agent.name}
                    </h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-widest truncate uppercase">
                      {isLocked ? 'AUDIT ARCHIVED' : agent.role}
                    </p>
                  </div>
                </div>
                {!isLocked && (
                  <ChevronRight className="w-5 md:w-6 h-5 md:h-6 text-slate-700 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1 shrink-0" />
                )}
              </button>
            );
          })
        ) : (
          <div className="p-16 md:p-20 border border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem] text-center bg-slate-900/10">
            <p className="text-[9px] md:text-[10px] font-black text-slate-600 tracking-[0.5em] uppercase">
              NO PERSONNEL DETECTED
            </p>
          </div>
        )}
      </div>
    </section>
  );
};