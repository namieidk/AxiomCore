'use client';

import React, { useState, useMemo } from 'react';
import {
  UserPlus, ShieldCheck, Zap, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { PayrollRecord, PayPeriod, ViewType } from './Type';
import { fmt } from './Utils';
import { NavTabs } from './Shell';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  valueClass?: string;
}

interface BatchPanelProps {
  payPeriods: PayPeriod[];
  selectedPeriod: PayPeriod | null;
  onSelectPeriod: (period: PayPeriod | null) => void;
  batchSelected: string[];
  batchProcessing: boolean;
  onBatchProcess: () => void;
}

interface RosterTableProps {
  loading: boolean;
  payrollList: PayrollRecord[];
  batchSelected: string[];
  onToggleBatchSelect: (id: string) => void;
  onToggleSelectAll: (visibleIds: string[]) => void;
}

interface RosterRowProps {
  row: PayrollRecord;
  checked: boolean;
  onToggle: () => void;
}

interface DashboardViewProps {
  view: ViewType;
  onNavigate: (view: ViewType) => void;
  loading: boolean;
  payrollList: PayrollRecord[];
  payPeriods: PayPeriod[];
  selectedPeriod: PayPeriod | null;
  onSelectPeriod: (period: PayPeriod | null) => void;
  batchSelected: string[];
  batchProcessing: boolean;
  onBatchProcess: () => void;
  onToggleBatchSelect: (id: string) => void;
  onToggleSelectAll: (visibleIds: string[]) => void;
}

// ─── Stat Card Component ──────────────────────────────────────────────────────

function StatCard({ label, value, valueClass = 'text-white' }: StatCardProps) {
  return (
    <div className="bg-slate-900/40 border border-white/5 px-5 py-4 rounded-2xl backdrop-blur-3xl flex items-center justify-between gap-4">
      <p className="text-[8px] font-black text-slate-500 tracking-[0.25em] uppercase">{label}</p>
      <h3 className={`text-xl font-black italic tracking-tighter shrink-0 ${valueClass}`}>{value}</h3>
    </div>
  );
}

// ─── Batch Process Panel ──────────────────────────────────────────────────────

export function BatchPanel({
  payPeriods,
  selectedPeriod,
  onSelectPeriod,
  batchSelected,
  batchProcessing,
  onBatchProcess,
}: BatchPanelProps) {
  return (
    <div className="bg-slate-900/40 border border-indigo-500/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
          <Zap className="w-4 h-4 shrink-0" /> Batch Process Payroll
        </h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <select
            value={selectedPeriod?.id ?? ''}
            onChange={e => {
              const p = payPeriods.find(x => x.id === Number(e.target.value)) ?? null;
              onSelectPeriod(p);
            }}
            className="bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-[9px] font-black text-white tracking-widest outline-none focus:border-indigo-500 uppercase cursor-pointer w-full sm:w-auto"
          >
            <option value="">-- SELECT PAY PERIOD --</option>
            {payPeriods.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>

          <button
            onClick={onBatchProcess}
            disabled={batchProcessing || !batchSelected.length || !selectedPeriod}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all ${
              batchProcessing || !batchSelected.length || !selectedPeriod
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            {batchProcessing
              ? <><RefreshCw className="w-3 h-3 animate-spin" /> Processing...</>
              : <><Zap className="w-3 h-3" /> Run Batch ({batchSelected.length})</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Roster Table Component ───────────────────────────────────────────────────

export function RosterTable({
  loading,
  payrollList,
  batchSelected,
  onToggleBatchSelect,
  onToggleSelectAll,
}: RosterTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(payrollList.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;

  const visibleRows = useMemo(() =>
    payrollList.slice(startIndex, startIndex + itemsPerPage),
    [payrollList, startIndex]
  );

  const processedOnPage = visibleRows.filter(e => e.status === 'PROCESSED').map(e => e.id);
  const allPageSelected = processedOnPage.length > 0 &&
    processedOnPage.every(id => batchSelected.includes(id));

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden">
      <div className="lg:hidden px-6 py-3 bg-indigo-500/5 text-[8px] font-black text-indigo-400 uppercase tracking-widest border-b border-white/5 italic">
        Swipe horizontally to view full ledger →
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-[8px] font-black text-slate-500 tracking-[0.25em]">
              <th className="px-6 py-5 w-16 text-center">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={() => onToggleSelectAll(processedOnPage)}
                  className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th className="px-6 py-5 uppercase">Personnel / Statutory IDs</th>
              <th className="px-6 py-5 text-center uppercase">Basic</th>
              <th className="px-6 py-5 text-center text-indigo-400 uppercase">Gross</th>
              <th className="px-6 py-5 text-center text-orange-500 uppercase">Deductions</th>
              <th className="px-6 py-5 text-center text-emerald-500 uppercase">Net Pay</th>
              <th className="px-6 py-5 text-right uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-20 text-center text-[9px] font-black tracking-widest animate-pulse italic uppercase">
                  Syncing Ledger...
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-20 text-center text-[8px] font-black text-slate-600 tracking-widest italic uppercase">
                  No records found
                </td>
              </tr>
            ) : (
              visibleRows.map(row => (
                <RosterRow
                  key={row.id}
                  row={row}
                  checked={batchSelected.includes(row.id)}
                  onToggle={() => onToggleBatchSelect(row.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <footer className="px-6 lg:px-8 py-4 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 italic">
        <p className="text-[8px] text-slate-500 tracking-widest uppercase">
          Showing{' '}
          <span className="text-indigo-400">{payrollList.length === 0 ? 0 : startIndex + 1}</span>
          {' '}–{' '}
          <span className="text-indigo-400">{Math.min(startIndex + itemsPerPage, payrollList.length)}</span>
          {' '}of{' '}
          <span className="text-indigo-400">{payrollList.length}</span> Units
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

// ─── Roster Row Component ─────────────────────────────────────────────────────

function RosterRow({ row, checked, onToggle }: RosterRowProps) {
  return (
    <tr className="hover:bg-indigo-600/5 transition-colors group">
      <td className="px-6 py-5 text-center">
        {row.status === 'PROCESSED' && (
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer"
          />
        )}
      </td>
      <td className="px-6 py-5">
        <p className="text-[10px] font-black italic text-white uppercase">{row.name}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          <p className="text-[7px] text-slate-500 font-bold tracking-widest uppercase">{row.dept} · {row.role}</p>
        </div>
        <p className="text-[7px] text-slate-600 font-bold mt-0.5 tracking-widest uppercase">
          SSS: {row.sssId} | PH: {row.philId} | PAGIBIG: {row.pagibigId}
        </p>
      </td>
      <td className="px-6 py-5 text-center text-[10px] font-black text-slate-400 italic">{fmt(row.basicSalary)}</td>
      <td className="px-6 py-5 text-center text-[10px] font-black text-indigo-400 italic">{fmt(row.grossPay)}</td>
      <td className="px-6 py-5 text-center text-[10px] font-black text-orange-500 italic">{fmt(row.estimatedDeductions)}</td>
      <td className="px-6 py-5 text-center text-[10px] font-black text-emerald-500 italic">{fmt(row.netTakeHome)}</td>
      <td className="px-6 py-5 text-right">
        <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border inline-block ${
          row.status === 'PROCESSED'
            ? 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5'
            : 'border-orange-500/20 text-orange-500 bg-orange-500/5'
        }`}>
          {row.status}
        </span>
      </td>
    </tr>
  );
}

// ─── Main Dashboard View Component ───────────────────────────────────────────

export function DashboardView({
  view,
  onNavigate,
  loading,
  payrollList,
  payPeriods,
  selectedPeriod,
  onSelectPeriod,
  batchSelected,
  batchProcessing,
  onBatchProcess,
  onToggleBatchSelect,
  onToggleSelectAll,
}: DashboardViewProps) {
  const totalDisbursement = payrollList.reduce((a, c) => a + c.basicSalary, 0);
  const enrolledCount     = payrollList.filter(e => e.status === 'PROCESSED').length;
  const pendingCount      = payrollList.filter(e => e.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#020617] italic font-black">
      {/* HEADER */}
      <header className="px-6 md:px-12 py-8 md:py-10 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-8 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-2 font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px]">
            <ShieldCheck className="w-4 h-4" /> Financial Governance
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase">
            Payroll <span className="text-indigo-600">Master</span>
          </h1>
        </div>
        <button
          onClick={() => onNavigate('enrollment')}
          className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-indigo-600 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all text-white w-full md:w-auto"
        >
          <UserPlus className="w-4 h-4" /> Enroll New Payroll
        </button>
      </header>

      <NavTabs view={view} onNavigate={onNavigate} />

      <div className="p-6 md:p-12 max-w-[1600px] w-full mx-auto space-y-8 md:space-y-10">
        {/* STAT CARDS — numbers on the right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Monthly Disbursement" value={fmt(totalDisbursement)} />
          <StatCard label="Active Roster"         value={`${payrollList.length} Units`}  valueClass="text-indigo-500" />
          <StatCard label="Enrolled"              value={`${enrolledCount} Active`}        valueClass="text-emerald-500" />
          <StatCard label="Pending Enrollment"    value={`${pendingCount} Pending`}        valueClass="text-orange-500" />
        </div>

        {/* BATCH PANEL */}
        <BatchPanel
          payPeriods={payPeriods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={onSelectPeriod}
          batchSelected={batchSelected}
          batchProcessing={batchProcessing}
          onBatchProcess={onBatchProcess}
        />

        {/* ROSTER TABLE */}
        <RosterTable
          loading={loading}
          payrollList={payrollList}
          batchSelected={batchSelected}
          onToggleBatchSelect={onToggleBatchSelect}
          onToggleSelectAll={onToggleSelectAll}
        />
      </div>
    </div>
  );
}