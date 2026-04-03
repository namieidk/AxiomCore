'use client';

import React, { useState } from 'react';
import { UserCircle, ChevronRight, Search, Users, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  peerScore: string;
  alreadyEvaluated?: boolean;
}

interface HRTeamListUIProps {
  agents: Agent[];
  mode: 'evaluate' | 'results';
  onSelectAgent: (agent: Agent) => void;
  onBack: () => void;
}

export const HRTeamListUI = ({ agents, mode, onSelectAgent, onBack }: HRTeamListUIProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#020617] uppercase font-sans scrollbar-hide">
      <header className="mb-8 md:mb-12 border-l-2 border-indigo-600 pl-4 md:pl-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="min-w-0">
          <button onClick={onBack} className="text-[9px] md:text-[10px] font-black text-indigo-500 mb-4 hover:text-indigo-400 tracking-[0.3em] flex items-center gap-2 transition-colors">
            <ArrowLeft size={10} /> RETURN TO AUDIT HUB
          </button>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter italic uppercase truncate">
            {mode === 'evaluate' ? 'PERSONNEL' : 'DATA'}{' '}
            <span className="text-indigo-600">{mode === 'evaluate' ? 'ROSTER' : 'ARCHIVE'}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="w-3 h-3" />
              <span className="text-[8px] md:text-[10px] font-bold tracking-widest">TOTAL: {agents.length}</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-800" />
            <div className="flex items-center gap-2 text-indigo-500/60">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase">ENCRYPTION ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="relative group w-full xl:w-80 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="FILTER BY NAME OR ID..."
            className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-6 text-[9px] md:text-[10px] font-black text-white w-full focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 md:gap-4 max-w-5xl">
        {filtered.length > 0 ? (
          filtered.map((agent) => {
            const isLocked = agent.alreadyEvaluated && mode === 'evaluate';
            return (
              <button
                key={agent.id}
                disabled={isLocked}
                onClick={() => onSelectAgent(agent)}
                className={`relative overflow-hidden group flex items-center justify-between border p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-300 ${isLocked ? 'bg-slate-900/20 border-red-500/20 opacity-60' : 'bg-slate-900/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-lg active:scale-[0.98]'}`}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-10 p-4">
                    <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                      <Lock size={10} className="text-red-500 shrink-0" />
                      <span className="text-[7px] md:text-[10px] font-black text-red-500 tracking-[0.2em] uppercase truncate">AUDIT LIMIT REACHED</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 md:gap-6 min-w-0 relative z-0">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all ${isLocked ? 'bg-slate-800 text-slate-600' : 'bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3'}`}>
                    <UserCircle className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className={`text-base md:text-xl font-black tracking-tight truncate ${isLocked ? 'text-slate-600' : 'text-white'}`}>{agent.name}</h3>
                    <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-500 tracking-widest uppercase">ID: {agent.id}</p>
                      <div className="w-1 h-1 rounded-full bg-slate-800 hidden sm:block" />
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-500 tracking-widest uppercase truncate">{agent.department}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6 shrink-0">
                   <div className="text-right hidden sm:block">
                      <p className="text-[7px] md:text-[8px] font-black text-slate-600 tracking-widest mb-1 uppercase">AVG SCORE</p>
                      <p className={`text-base md:text-lg font-black italic ${isLocked ? 'text-slate-700' : 'text-indigo-500'}`}>{agent.peerScore}</p>
                   </div>
                   <ChevronRight className={`w-5 h-5 md:w-6 md:h-6 transition-transform ${isLocked ? 'text-slate-800' : 'text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1'}`} />
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-20 md:p-32 border border-dashed border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] text-center bg-slate-900/5 px-4">
            <p className="text-[9px] md:text-[10px] font-black text-slate-600 tracking-[0.3em] md:tracking-[0.5em] uppercase">NO PERSONNEL DETECTED</p>
          </div>
        )}
      </div>
    </section>
  );
};