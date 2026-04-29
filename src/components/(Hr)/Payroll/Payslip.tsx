'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, FileText, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { Payslip, ViewType } from './Type';
import { fmt, fmtD } from './Utils';
import { NavTabs } from './Shell';

// ─── Payslip Row ──────────────────────────────────────────────────────────────

interface PayslipRowProps {
  slip: Payslip;
  onView: (slip: Payslip) => void;
}

function PayslipRow({ slip, onView }: PayslipRowProps) {
  return (
    <tr className="hover:bg-indigo-600/5 transition-colors group">
      <td className="px-6 md:px-10 py-5">
        <p className="text-[10px] font-black italic text-white uppercase">{slip.employeeName ?? slip.employeeId}</p>
        <p className="text-[7px] text-slate-500 font-bold mt-0.5 tracking-widest uppercase truncate max-w-[150px]">
          {slip.department} · {slip.role}
        </p>
      </td>
      <td className="px-6 py-5 text-[9px] font-black text-slate-400 whitespace-nowrap">
        {fmtD(slip.periodStart)} – {fmtD(slip.periodEnd)}
      </td>
      <td className="px-6 py-5 text-[9px] font-black text-slate-400">{fmtD(slip.payDate)}</td>
      <td className="px-6 py-5 text-[10px] font-black italic text-indigo-400">{fmt(slip.grossPay)}</td>
      <td className="px-6 py-5 text-[10px] font-black italic text-orange-500">{fmt(slip.totalDeductions)}</td>
      <td className="px-6 py-5 text-[10px] font-black italic text-emerald-400">{fmt(slip.netPay)}</td>
      <td className="px-6 py-5 text-center">
        <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border inline-block ${
          slip.status === 'PROCESSED'
            ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
            : 'border-orange-500/20 text-orange-500 bg-orange-500/5'
        }`}>
          {slip.status}
        </span>
      </td>
      <td className="px-6 py-5">
        <button
          onClick={() => onView(slip)}
          className="flex items-center gap-1 text-[8px] font-black text-indigo-500 hover:text-indigo-400 tracking-widest uppercase transition-colors"
        >
          View <ChevronRight className="w-3 h-3" />
        </button>
      </td>
    </tr>
  );
}

// ─── Payslips List View ───────────────────────────────────────────────────────

interface PayslipsViewProps {
  view: ViewType;
  onNavigate: (view: ViewType) => void;
  payslips: Payslip[];
  slipFilter: string;
  onFilterChange: (val: string) => void;
  onViewSlip: (slip: Payslip) => void;
}

export function PayslipsView({
  view,
  onNavigate,
  payslips,
  slipFilter,
  onFilterChange,
  onViewSlip,
}: PayslipsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() =>
    payslips.filter(s =>
      !slipFilter ||
      s.employeeId.toLowerCase().includes(slipFilter.toLowerCase()) ||
      (s.employeeName ?? '').toLowerCase().includes(slipFilter.toLowerCase())
    ),
    [payslips, slipFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;

  const visibleSlips = useMemo(() =>
    filtered.slice(startIndex, startIndex + itemsPerPage),
    [filtered, startIndex]
  );

  // Reset to page 1 when filter changes
  React.useEffect(() => { setCurrentPage(1); }, [slipFilter]);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-screen bg-[#020617] italic font-black">
      <header className="px-6 md:px-12 py-6 md:py-8 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-1.5 font-black uppercase tracking-[0.4em] text-[8px] md:text-[9px]">
            <FileText className="w-3.5 h-3.5" /> Records Vault
          </div>
          <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase">
            Pay <span className="text-indigo-600">Slips</span>
          </h1>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
          <input
            value={slipFilter}
            onChange={e => onFilterChange(e.target.value)}
            placeholder="FILTER BY ID OR NAME..."
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[9px] font-black text-white outline-none focus:border-indigo-500 uppercase w-full"
          />
        </div>
      </header>

      <NavTabs view={view} onNavigate={onNavigate} />

      <div className="p-6 md:p-12 max-w-[1600px] w-full mx-auto">
        <div className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="lg:hidden px-6 py-3 bg-indigo-500/5 text-[8px] font-black text-indigo-400 uppercase tracking-widest border-b border-white/5">
            Swipe horizontally to view full records →
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[8px] font-black text-slate-500 tracking-[0.25em]">
                  <th className="px-6 md:px-10 py-5 uppercase">Employee</th>
                  <th className="px-6 py-5 uppercase">Period</th>
                  <th className="px-6 py-5 uppercase">Pay Date</th>
                  <th className="px-6 py-5 text-indigo-400 uppercase">Gross</th>
                  <th className="px-6 py-5 text-orange-500 uppercase">Deductions</th>
                  <th className="px-6 py-5 text-emerald-500 uppercase">Net Pay</th>
                  <th className="px-6 py-5 text-center uppercase">Status</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleSlips.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-20 text-center text-[8px] font-black text-slate-700 tracking-widest uppercase italic">
                      No Payslips Generated Yet
                    </td>
                  </tr>
                ) : (
                  visibleSlips.map(slip => (
                    <PayslipRow key={slip.id} slip={slip} onView={onViewSlip} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <footer className="px-6 lg:px-8 py-4 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 italic">
            <p className="text-[8px] text-slate-500 tracking-widest uppercase">
              Showing{' '}
              <span className="text-indigo-400">{filtered.length === 0 ? 0 : startIndex + 1}</span>
              {' '}–{' '}
              <span className="text-indigo-400">{Math.min(startIndex + itemsPerPage, filtered.length)}</span>
              {' '}of{' '}
              <span className="text-indigo-400">{filtered.length}</span> Records
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
      </div>
    </div>
  );
}

// ─── Payslip Detail View ──────────────────────────────────────────────────────

interface PayslipDetailViewProps {
  slip: Payslip;
  onBack: () => void;
}

export function PayslipDetailView({ slip, onBack }: PayslipDetailViewProps) {
  return (
    <div className="min-h-screen bg-[#020617] italic font-black">
      {/* HEADER */}
      <header className="px-6 md:px-12 py-5 md:py-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#020617]/80 flex items-center gap-4 md:gap-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-indigo-500 font-black text-[8px] md:text-[9px] tracking-widest hover:text-indigo-400 uppercase shrink-0 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <div className="min-w-0">
          <p className="text-[7px] md:text-[8px] font-black text-slate-500 tracking-widest uppercase">Payslip #{slip.id}</p>
          <h2 className="text-sm md:text-lg font-black italic tracking-tighter text-white uppercase truncate">
            {slip.employeeName ?? slip.employeeId}
          </h2>
        </div>
      </header>

      <div className="p-6 md:p-12 max-w-3xl mx-auto w-full space-y-5 md:space-y-6">
        {/* META CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Period',   value: `${fmtD(slip.periodStart)} – ${fmtD(slip.periodEnd)}` },
            { label: 'Pay Date', value: fmtD(slip.payDate) },
            { label: 'Status',   value: slip.status },
          ].map(item => (
            <div key={item.label} className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
              <p className="text-[7px] font-black text-slate-500 tracking-widest uppercase mb-1">{item.label}</p>
              <p className="text-[9px] font-black text-white uppercase">{item.value}</p>
            </div>
          ))}
        </div>

        {/* EARNINGS */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl">
          <div className="px-6 md:px-8 py-3 md:py-4 bg-white/5 border-b border-white/5">
            <p className="text-[8px] font-black text-indigo-400 tracking-[0.3em] uppercase">Earnings</p>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { label: 'Basic Salary', value: slip.basicSalary, color: 'text-white' },
              { label: 'Overtime Pay', value: slip.overtime,    color: 'text-indigo-400' },
              { label: 'Night Diff',   value: slip.nightDiff,   color: 'text-indigo-400' },
              { label: 'Allowances',   value: slip.allowances,  color: 'text-indigo-400' },
            ].map(item => (
              <div key={item.label} className="px-6 md:px-8 py-3.5 flex justify-between items-center gap-2">
                <p className="text-[8px] font-black text-slate-400 tracking-widest uppercase">{item.label}</p>
                <p className={`text-[10px] font-black italic shrink-0 ${item.color}`}>{fmt(item.value)}</p>
              </div>
            ))}
            <div className="px-6 md:px-8 py-3.5 flex justify-between items-center bg-indigo-600/5">
              <p className="text-[8px] font-black text-indigo-400 tracking-widest uppercase">Gross Pay</p>
              <p className="text-xs font-black text-indigo-400 italic shrink-0">{fmt(slip.grossPay)}</p>
            </div>
          </div>
        </div>

        {/* DEDUCTIONS */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl">
          <div className="px-6 md:px-8 py-3 md:py-4 bg-white/5 border-b border-white/5">
            <p className="text-[8px] font-black text-orange-400 tracking-[0.3em] uppercase">Deductions</p>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { label: 'SSS',             value: slip.sssDeduction },
              { label: 'PhilHealth',      value: slip.philHealthDeduction },
              { label: 'Pag-IBIG',        value: slip.pagIbigDeduction },
              { label: 'Withholding Tax', value: slip.withholdingTax },
            ].map(item => (
              <div key={item.label} className="px-6 md:px-8 py-3.5 flex justify-between items-center gap-2">
                <p className="text-[8px] font-black text-slate-400 tracking-widest uppercase">{item.label}</p>
                <p className="text-[10px] font-black italic text-orange-400 shrink-0">{fmt(item.value)}</p>
              </div>
            ))}
            <div className="px-6 md:px-8 py-3.5 flex justify-between items-center bg-orange-500/5">
              <p className="text-[8px] font-black text-orange-400 tracking-widest uppercase">Total Deductions</p>
              <p className="text-xs font-black text-orange-400 italic shrink-0">{fmt(slip.totalDeductions)}</p>
            </div>
          </div>
        </div>

        {/* NET PAY */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-[7px] font-black text-slate-500 tracking-widest uppercase mb-1">Net Take Home Pay</p>
            <p className="text-[8px] font-black text-slate-600 tracking-widest uppercase italic">After all statutory deductions</p>
          </div>
          <p className="text-2xl md:text-3xl font-black text-emerald-400 italic shrink-0">{fmt(slip.netPay)}</p>
        </div>

        {/* META */}
        <p className="text-center text-[7px] font-black text-slate-700 tracking-widest uppercase italic pb-10">
          Generated: {slip.generatedAt}
          {slip.notifiedAt && ` · Notified: ${slip.notifiedAt}`}
        </p>
      </div>
    </div>
  );
}