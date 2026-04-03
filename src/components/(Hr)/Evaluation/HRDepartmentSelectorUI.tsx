'use client';

import React from 'react';
import { Building2, ChevronRight, ArrowLeft } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'OPERATIONS', count: 'ALL AGENTS' },
  { id: 'HUMAN RESOURCES', count: 'ALL AGENTS' },
  { id: 'MARKETING', count: 'ALL AGENTS' },
  { id: 'IT', count: 'ALL AGENTS' },
  { id: 'FINANCE', count: 'ALL AGENTS' },
];

interface Props {
  onSelect: (dept: string) => void;
  onBack: () => void;
}

export const HRDepartmentSelectorUI = ({ onSelect, onBack }: Props) => {
  return (
    <section className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#020617] font-sans uppercase scrollbar-hide">
      <header className="mb-8 md:mb-12 border-l-2 border-emerald-600 pl-4 md:pl-6">
        <button onClick={onBack} className="text-[9px] md:text-[10px] font-black text-emerald-500 mb-4 hover:underline tracking-widest flex items-center gap-2">
          <ArrowLeft size={10} /> BACK TO HUB
        </button>
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter">
          SELECT <span className="text-emerald-600">DEPARTMENT</span>
        </h1>
        <p className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-[0.2em] md:tracking-[0.3em] mt-2">CHOOSE AN ARCHIVE TO AUDIT</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelect(dept.id)}
            className="group relative bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] hover:border-emerald-500/50 transition-all text-left overflow-hidden active:scale-[0.98]"
          >
            <Building2 className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg md:text-xl font-black text-white mb-1 tracking-tight truncate pr-8">{dept.id}</h3>
            <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest">{dept.count}</p>
            <ChevronRight className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-slate-800 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
          </button>
        ))}
      </div>
    </section>
  );
};