'use client';

import React, { useState, useMemo } from 'react';
import { Send, ArrowLeft, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import { Agent } from './HRTeamList';

const CRITERIA = [
  { key: 'job_knowledge',       label: 'JOB KNOWLEDGE',            desc: 'Understanding of role responsibilities and technical requirements.' },
  { key: 'work_quality',        label: 'WORK QUALITY',             desc: 'Accuracy, thoroughness, and standard of output produced.' },
  { key: 'productivity',        label: 'PRODUCTIVITY',             desc: 'Volume of work completed within given timeframes.' },
  { key: 'initiative',          label: 'INITIATIVE',               desc: 'Proactively takes action without waiting to be directed.' },
  { key: 'reliability',         label: 'RELIABILITY',              desc: 'Consistently meets deadlines and fulfills commitments.' },
  { key: 'communication',       label: 'COMMUNICATION',            desc: 'Clarity and effectiveness in verbal and written communication.' },
  { key: 'teamwork',            label: 'TEAMWORK',                 desc: 'Collaborates effectively and supports team goals.' },
  { key: 'problem_solving',     label: 'PROBLEM SOLVING',          desc: 'Identifies issues and develops effective solutions.' },
  { key: 'adaptability',        label: 'ADAPTABILITY',             desc: 'Adjusts effectively to changing priorities and environments.' },
  { key: 'attendance',          label: 'ATTENDANCE & PUNCTUALITY', desc: 'Consistent presence and on-time reporting to work.' },
  { key: 'customer_service',    label: 'CUSTOMER SERVICE',         desc: 'Handles client or stakeholder interactions professionally.' },
  { key: 'compliance',          label: 'POLICY COMPLIANCE',        desc: 'Adherence to company rules, procedures, and regulations.' },
  { key: 'leadership',          label: 'LEADERSHIP POTENTIAL',     desc: 'Demonstrates ability to guide, influence, and mentor others.' },
  { key: 'professionalism',     label: 'PROFESSIONALISM',          desc: 'Conduct, appearance, and attitude in the workplace.' },
  { key: 'goal_achievement',    label: 'GOAL ACHIEVEMENT',         desc: 'Successfully meets individual KPIs and performance targets.' },
];

interface HREvaluationFormUIProps {
  agent:    Agent;
  onBack:   () => void;
  onSubmit: (score: number, comment: string) => void;
}

export const HREvaluationFormUI = ({ agent, onBack, onSubmit }: HREvaluationFormUIProps) => {
  const [scores,  setScores]  = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');

  const handleScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const totalScored = Object.keys(scores).length;
  const allScored   = totalScored === CRITERIA.length;
  
  const { displayScore, rawAverage } = useMemo(() => {
    if (totalScored === 0) return { displayScore: "0.00", rawAverage: 0 };
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    const avg = sum / CRITERIA.length;
    const scaled = (sum / (CRITERIA.length * 5)) * 15;
    return { displayScore: scaled.toFixed(2), rawAverage: avg };
  }, [scores]);

  const handleSubmit = () => {
    if (!allScored || comment.trim().length < 10) return;
    onSubmit(parseFloat(rawAverage.toFixed(2)), comment.toUpperCase());
  };

  return (
    <section className="flex-1 overflow-y-auto bg-[#020617] font-sans scrollbar-hide uppercase">
      <div className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-6 md:py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-indigo-500 hover:text-indigo-400 tracking-[0.2em] md:tracking-[0.3em] mb-2 transition-all">
            <ArrowLeft className="w-3 h-3" /> ABORT AUDIT
          </button>
          <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter italic">
            HR <span className="text-indigo-600">PERFORMANCE</span> AUDIT
          </h1>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-500 tracking-widest mt-1">
            SUBJECT: {agent.name} <span className="mx-2 text-slate-800">|</span> ID: {agent.id}
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-6 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none bg-white/5 border border-white/10 px-4 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl text-center md:text-right">
            <p className="text-[7px] md:text-[9px] font-black text-slate-500 tracking-widest mb-1 uppercase">PROGRESS</p>
            <p className="text-lg md:text-2xl font-black text-white italic tracking-tighter">
              {totalScored}<span className="text-indigo-600">/</span>{CRITERIA.length}
            </p>
          </div>
          <div className="flex-1 lg:flex-none bg-indigo-600/10 border border-indigo-500/20 px-4 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl text-center md:text-right shadow-2xl">
            <p className="text-[7px] md:text-[9px] font-black text-indigo-500 tracking-widest mb-1 uppercase">LIVE SCORE</p>
            <p className="text-lg md:text-2xl font-black text-white italic tracking-tighter truncate">
              {displayScore} <span className="text-[8px] md:text-[10px] text-slate-600">/ 15.00</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 md:py-10 max-w-5xl mx-auto space-y-4">
        {CRITERIA.map((criterion, index) => {
          const selected = scores[criterion.key];
          return (
            <div key={criterion.key} className={`group border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 transition-all duration-500 ${selected ? 'bg-indigo-600/5 border-indigo-500/30 shadow-lg' : 'bg-slate-900/20 border-white/5 opacity-80'}`}>
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex items-start gap-4 md:gap-6 flex-1">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-[10px] md:text-xs border shrink-0 transition-all ${selected ? 'bg-indigo-600 border-indigo-400 text-white rotate-6' : 'bg-slate-900 border-white/10 text-slate-600'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-black text-white tracking-tight italic mb-1 uppercase">{criterion.label}</p>
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-500 tracking-widest leading-relaxed">{criterion.desc}</p>
                  </div>
                </div>

                <div className="flex gap-1 md:gap-2 bg-black/40 p-1.5 md:p-2 rounded-2xl md:rounded-[1.8rem] border border-white/5 self-center xl:self-auto shrink-0">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => handleScore(criterion.key, num)} className={`w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xs md:text-sm transition-all ${selected === num ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-600 hover:text-white'}`}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {allScored && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4 shadow-xl">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
              </div>
              <div className="text-center md:text-left">
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] text-emerald-500 block mb-1">AUDIT VALIDATED</span>
                <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-widest uppercase italic">LOGGED & VERIFIED BY HR</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-5xl md:text-7xl font-black text-white tracking-tighter italic leading-none">{displayScore}</p>
              <p className="text-[8px] md:text-[10px] font-black text-emerald-500 tracking-[0.3em] mt-2 uppercase">COMPOSITE RESULT / 15.00</p>
            </div>
          </div>
        )}

        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-3 ml-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <label className="text-[9px] md:text-[10px] font-black text-indigo-500 tracking-[0.3em] md:tracking-[0.5em] uppercase">AUDIT REMARKS</label>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="PROVIDE DETAILED JUSTIFICATION..."
            className="w-full h-40 md:h-48 bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white focus:border-indigo-500/50 outline-none text-[10px] md:text-[11px] font-bold tracking-widest leading-relaxed placeholder:text-slate-800"
          />
          {comment.length > 0 && comment.length < 10 && (
            <div className="flex items-center gap-2 text-amber-500/80 ml-4">
              <AlertCircle size={12} />
              <p className="text-[8px] font-black tracking-widest uppercase">MINIMUM 10 CHARACTERS REQUIRED</p>
            </div>
          )}
        </div>

        <div className="pb-24 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!allScored || comment.trim().length < 10}
            className={`w-full py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.6em] flex items-center justify-center gap-4 transition-all duration-500 ${allScored && comment.trim().length >= 10 ? 'bg-indigo-600 text-white shadow-2xl active:scale-95' : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'}`}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate">{!allScored ? `DATA MISSING (${totalScored}/${CRITERIA.length})` : comment.trim().length < 10 ? 'REMARKS REQUIRED' : 'COMMIT AUDIT TO DATABASE'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};