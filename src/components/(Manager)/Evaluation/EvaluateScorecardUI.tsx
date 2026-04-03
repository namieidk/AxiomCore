'use client';

import React, { useState } from 'react';
import { ShieldCheck, Save } from 'lucide-react';
import { Agent } from './TeamListUI';

const RUBRICS = [
  { key: 'technical', label: 'TECHNICAL PROFICIENCY', description: 'ASSIGN VALUE BASED ON QUARTERLY METRICS.' },
  { key: 'security', label: 'SECURITY COMPLIANCE', description: 'ASSIGN VALUE BASED ON QUARTERLY METRICS.' },
  { key: 'communication', label: 'COMMUNICATION', description: 'ASSIGN VALUE BASED ON QUARTERLY METRICS.' },
];

interface EvaluateScorecardUIProps {
  agent: Agent;
  onClose: () => void;
  onSubmit: (agentId: string, scores: Record<string, number>) => void;
}

export const EvaluateScorecardUI = ({ agent, onClose, onSubmit }: EvaluateScorecardUIProps) => {
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const allScored = RUBRICS.every((r) => scores[r.key] !== undefined);

  const handleSubmit = () => {
    if (allScored) onSubmit(agent.id, scores);
  };

  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <header className="px-6 md:px-12 py-6 md:py-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center bg-[#020617] gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-base md:text-lg shrink-0">
            {agent.name[0]}
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tighter uppercase line-clamp-1">
              {agent.name} — SCORECARD
            </h2>
            <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-[0.2em] md:tracking-[0.3em]">
              SECURE ACCESS ID: {agent.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white/5 rounded-2xl font-black text-[9px] md:text-[10px] tracking-widest text-slate-400 hover:text-white transition-all"
        >
          CLOSE SESSION
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 md:space-y-12">
        <div className="flex items-center gap-3 text-blue-500">
          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-[10px] md:text-xs font-black tracking-[0.4em]">EXECUTIVE SCORING MODULE</h3>
        </div>

        <div className="space-y-4 md:space-y-6">
          {RUBRICS.map((rubric) => (
            <div
              key={rubric.key}
              className="bg-slate-900/20 border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              <div className="max-w-xl">
                <p className="text-xs md:text-sm font-black text-white tracking-tight mb-2 uppercase">
                  {rubric.label}
                </p>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-widest">
                  {rubric.description}
                </p>
              </div>
              <div className="flex gap-1 md:gap-2 bg-slate-950 p-1.5 md:p-2 rounded-2xl border border-white/5 w-full sm:w-auto justify-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleScore(rubric.key, num)}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                      scores[rubric.key] === num
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-blue-600/20 hover:text-blue-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 pb-8">
          <button
            onClick={handleSubmit}
            disabled={!allScored}
            className={`w-full py-5 md:py-6 rounded-2xl md:rounded-3xl font-black tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-4 transition-all ${
              allScored
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4 md:w-5 md:h-5" />
            <span className="uppercase text-center">
              {allScored ? 'COMMIT SCORECARD TO HR DATABASE' : 'SCORE ALL CATEGORIES'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};