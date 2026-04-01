'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import { EvaluationForm } from './EvaluationForm';
import { Users, UserCheck, ShieldAlert, ChevronRight, ArrowLeft, User, Lock, Menu, X } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  alreadyEvaluated?: boolean;
}

interface EvaluationViewProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  agents: Agent[];
  targetAgent: Agent | null;
  setTargetAgent: (agent: Agent | null) => void;
  loading: boolean;
  onSubmit: (avg: number, comm: string) => void;
  isSubmitting: boolean;
}

const TYPE_TO_FORM: Record<string, 'peer' | 'manager' | 'hr'> = {
  peer:       'peer',
  managerial: 'manager',
  hr:         'hr',
};

export function EvaluationView({
  selectedType, setSelectedType, agents, targetAgent,
  setTargetAgent, loading, onSubmit, isSubmitting
}: EvaluationViewProps) {

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const userRole = (user.role || '').toLowerCase();
  const isManager = userRole === 'manager';
  const isHR      = userRole === 'hr';

  const formType = selectedType ? (TYPE_TO_FORM[selectedType] ?? 'peer') : 'peer';

  if (selectedType && targetAgent) {
    return (
      <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans">
        <Sidebar />
        <section className="flex-1 overflow-y-auto scrollbar-hide">
          <EvaluationForm
            type={formType}
            targetName={targetAgent.name}
            targetId={targetAgent.id}
            isSubmitting={isSubmitting}
            onBack={() => setTargetAgent(null)}
            onFinish={(avg, comm) => onSubmit(avg, comm)}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <Sidebar />
      
      {/* Content Section with Responsive Padding */}
      <section className="flex-1 p-6 lg:p-12 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
        
        {/* Top Spacer for Mobile Toggle button area */}
        <div className="h-16 lg:hidden" />

        <div className="max-w-[1400px] mx-auto">
          {selectedType ? (
            <>
              <button 
                onClick={() => setSelectedType(null)} 
                className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white mb-6 lg:mb-8 transition-all group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> BACK TO HUB
              </button>
              
              <header className="mb-8 lg:mb-12">
                <h2 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter">
                  SELECT <span className="text-indigo-500">SUBJECT</span>
                </h2>
                {!loading && (
                  <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 tracking-[0.2em] mt-2 italic opacity-60">
                    DEPT: {user.department} • CATEGORY: {selectedType.toUpperCase()}
                  </p>
                )}
              </header>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-indigo-500 tracking-[0.5em]">SCANNING DATABASE...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {agents.map((agent) => {
                    const isLocked = agent.alreadyEvaluated;
                    return (
                      <button
                        key={agent.id}
                        disabled={isLocked}
                        onClick={() => setTargetAgent(agent)}
                        className={`relative overflow-hidden bg-slate-900/40 border p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] text-left transition-all flex items-center gap-4 lg:gap-5 group
                          ${isLocked ? 'border-red-500/20 opacity-60 cursor-not-allowed' : 'border-white/5 hover:border-indigo-500/50 hover:bg-slate-900/60'}`}
                      >
                        {isLocked && (
                          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <div className="bg-red-500/20 border border-red-500/40 px-3 py-1 rounded-full flex items-center gap-2">
                              <Lock size={10} className="text-red-400" />
                              <span className="text-[8px] font-black text-red-400 tracking-tighter">LIMIT REACHED</span>
                            </div>
                          </div>
                        )}
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0 transition-all
                          ${isLocked ? 'bg-slate-800 text-slate-500' : 'bg-white/5 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-slate-950'}`}>
                          <User size={20} className="lg:w-6 lg:h-6"/>
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-black italic tracking-tighter truncate ${isLocked ? 'text-slate-500' : 'text-white'}`}>{agent.name}</h4>
                          <p className="text-[8px] lg:text-[9px] font-bold text-slate-500 tracking-widest truncate">{isLocked ? 'AUDIT COMPLETE' : `${agent.role} • ${agent.id}`}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <header className="mb-8 lg:mb-12">
                <p className="text-[9px] lg:text-[10px] font-black text-indigo-500 tracking-[0.4em] mb-2 uppercase">PERFORMANCE OVERSIGHT</p>
                <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic">EVALUATION <span className="text-indigo-500">CENTER</span></h1>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-6xl">
                <TypeCard
                  id="peer"
                  title={isManager ? 'SUBORDINATES' : 'PEER-TO-PEER'}
                  desc="AUDIT: TEAM DYNAMICS & SYNERGY"
                  icon={Users}
                  color="text-blue-400"
                  onClick={setSelectedType}
                />

                {!isManager && !isHR && (
                  <TypeCard
                    id="managerial"
                    title="MANAGERIAL"
                    desc="AUDIT: LEADERSHIP & STRATEGIC EXECUTION"
                    icon={UserCheck}
                    color="text-indigo-400"
                    onClick={setSelectedType}
                  />
                )}

                <TypeCard
                  id="hr"
                  title="HR COMPLIANCE"
                  desc="AUDIT: ETHICS & POLICY ADHERENCE"
                  icon={ShieldAlert}
                  color="text-purple-400"
                  onClick={setSelectedType}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypeCard = ({ id, title, desc, icon: Icon, color, onClick }: any) => (
  <button 
    onClick={() => onClick(id)} 
    className="group bg-slate-900/40 border border-white/5 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3.5rem] text-left hover:border-indigo-500 transition-all flex flex-col justify-between h-[280px] lg:h-[320px] shadow-2xl relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-6 lg:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-20 h-20 lg:w-[120px] lg:h-[120px]" />
    </div>
    <div>
      <div className={`${color} mb-4 lg:mb-6 transition-transform duration-500 group-hover:scale-110`}>
        <Icon className="w-10 h-10 lg:w-12 lg:h-12" />
      </div>
      <h3 className="text-lg lg:text-xl font-black text-white mb-2 italic tracking-tighter">{title}</h3>
      <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed">{desc}</p>
    </div>
    <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-indigo-500 tracking-widest group-hover:gap-4 transition-all uppercase">
      INITIATE AUDIT <ChevronRight size={14} />
    </div>
  </button>
);