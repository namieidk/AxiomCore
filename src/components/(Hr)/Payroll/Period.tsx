'use client';

import React, { useState, useMemo } from 'react';
import { CalendarDays, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { PayPeriod, PpForm, ViewType } from './Type';
import { fmtD } from './Utils';
import { NavTabs } from './Shell';

// ─── Pay Period Form ──────────────────────────────────────────────────────────

interface PeriodFormProps {
  form: PpForm;
  onChange: (key: keyof PpForm, value: string) => void;
  onSave: () => void;
}

const FORM_FIELDS: { key: keyof PpForm; label: string; type: string; placeholder: string }[] = [
  { key: 'label',       label: 'Period Label', type: 'text', placeholder: 'e.g. June 2026 - 1st Cut' },
  { key: 'periodStart', label: 'Period Start',  type: 'date', placeholder: '' },
  { key: 'periodEnd',   label: 'Period End',    type: 'date', placeholder: '' },
  { key: 'cutoffDate',  label: 'Cutoff Date',   type: 'date', placeholder: '' },
  { key: 'payDate',     label: 'Pay Date',      type: 'date', placeholder: '' },
];

function PeriodForm({ form, onChange, onSave }: PeriodFormProps) {
  return (
    <div className="bg-slate-900/40 border border-indigo-500/10 rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-10 space-y-8">
      <h3 className="text-[9px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
        <CalendarDays className="w-3.5 h-3.5 shrink-0" /> Schedule New Pay Period
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {FORM_FIELDS.map(f => (
          <div key={f.key} className="space-y-1.5">
            <label className="text-[8px] font-black text-slate-500 tracking-widest ml-1 uppercase">
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => onChange(f.key, e.target.value)}
              className="w-full bg-[#020617] border border-white/10 rounded-xl p-3 text-[9px] font-black text-white outline-none focus:border-indigo-500 transition-all uppercase"
            />
          </div>
        ))}

        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20 text-white"
          >
            <Save className="w-3 h-3" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pay Periods Table ────────────────────────────────────────────────────────

interface PeriodsTableProps {
  payPeriods: PayPeriod[];
}

function PeriodsTable({ payPeriods }: PeriodsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(payPeriods.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;

  const visiblePeriods = useMemo(() =>
    payPeriods.slice(startIndex, startIndex + itemsPerPage),
    [payPeriods, startIndex]
  );

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
      {/* Mobile swipe hint */}
      <div className="lg:hidden px-6 py-3 bg-indigo-500/5 text-[8px] font-black text-indigo-400 uppercase tracking-widest border-b border-white/5 italic">
        Swipe horizontally to view full schedule →
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-[8px] font-black text-slate-500 tracking-[0.25em]">
              <th className="px-6 md:px-10 py-5 uppercase">Label</th>
              <th className="px-6 py-5 uppercase">Period Range</th>
              <th className="px-6 py-5 uppercase">Cutoff</th>
              <th className="px-6 py-5 text-emerald-500 uppercase">Est. Pay Date</th>
              <th className="px-6 py-5 text-right uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payPeriods.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-16 text-center text-[8px] font-black text-slate-700 tracking-widest uppercase italic">
                  No Pay Periods Scheduled
                </td>
              </tr>
            ) : (
              visiblePeriods.map(p => (
                <tr key={p.id} className="hover:bg-indigo-600/5 transition-colors group">
                  <td className="px-6 md:px-10 py-5">
                    <p className="text-[10px] font-black text-white italic uppercase tracking-tighter">{p.label}</p>
                    <p className="text-[7px] text-slate-600 font-bold tracking-widest mt-0.5 uppercase">System ID: {p.id}</p>
                  </td>
                  <td className="px-6 py-5 text-[9px] font-black text-slate-400">
                    {fmtD(p.periodStart)} – {fmtD(p.periodEnd)}
                  </td>
                  <td className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">{fmtD(p.cutoffDate)}</td>
                  <td className="px-6 py-5 text-[9px] font-black text-emerald-400 uppercase tracking-widest">{fmtD(p.payDate)}</td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border inline-block ${
                      p.status === 'PROCESSED'
                        ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                        : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <footer className="px-6 lg:px-8 py-4 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 italic font-black">
        <p className="text-[8px] text-slate-500 tracking-widest uppercase">
          Showing{' '}
          <span className="text-indigo-400">{payPeriods.length === 0 ? 0 : startIndex + 1}</span>
          {' '}–{' '}
          <span className="text-indigo-400">{Math.min(startIndex + itemsPerPage, payPeriods.length)}</span>
          {' '}of{' '}
          <span className="text-indigo-400">{payPeriods.length}</span> Periods
        </p>
        <div className="flex items-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <span className="text-[8px] text-white tracking-widest uppercase">
            Page {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </footer>
    </div>
  );
}

// ─── Pay Periods View ─────────────────────────────────────────────────────────

interface PeriodsViewProps {
  view: ViewType;
  onNavigate: (view: ViewType) => void;
  payPeriods: PayPeriod[];
  form: PpForm;
  onFormChange: (key: keyof PpForm, value: string) => void;
  onSave: () => void;
}

export function PeriodsView({
  view,
  onNavigate,
  payPeriods,
  form,
  onFormChange,
  onSave,
}: PeriodsViewProps) {
  return (
    <div className="min-h-screen bg-[#020617] italic">
      <header className="px-6 md:px-12 py-6 md:py-8 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
        <div className="flex items-center gap-2 text-indigo-500 mb-1.5 font-black uppercase tracking-[0.4em] text-[8px] md:text-[9px]">
          <CalendarDays className="w-3.5 h-3.5" /> Schedule Management
        </div>
        <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase">
          Pay <span className="text-indigo-600">Periods</span>
        </h1>
      </header>

      <NavTabs view={view} onNavigate={onNavigate} />

      <div className="p-6 md:p-12 max-w-[1500px] w-full mx-auto space-y-8 md:space-y-10">
        <PeriodForm form={form} onChange={onFormChange} onSave={onSave} />
        <PeriodsTable payPeriods={payPeriods} />
      </div>
    </div>
  );
}