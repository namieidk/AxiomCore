'use client';

import React from 'react';
import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import {
  TrendingUp, ShieldCheck, ArrowDownRight,
  Wallet, Receipt, History, Ghost, ChevronLeft, ChevronRight,
  Moon, Clock, Banknote
} from 'lucide-react';
import { PayslipData } from '../../../app/(Employee)/Payroll/page';

// PROPS INTERFACE
interface PayrollViewProps {
  activeSlip: PayslipData | null;
  visibleHistory: PayslipData[];
  currentPage: number;
  totalPages: number;
  isFirstPayroll: boolean | null;
  onPageChange: (page: number) => void;
  onSelectSlip: (slip: PayslipData) => void;
}

export function PayrollView({
  activeSlip,
  visibleHistory,
  currentPage,
  totalPages,
  isFirstPayroll,
  onPageChange,
  onSelectSlip,
}: PayrollViewProps) {
  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black">
      <Sidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">

        {/* HEADER */}
        <header className="px-6 lg:px-12 py-6 lg:py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-xl sticky top-0 z-30 bg-[#020617]/80">
          <div className="mt-12 lg:mt-0">
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <Wallet className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-[8px] lg:text-[10px] font-black tracking-[0.4em]">Official Records</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tighter italic">
              Payslip <span className="text-indigo-600">Archive</span>
            </h1>
          </div>

          {/* PAYROLL CYCLE BADGE */}
          {activeSlip && isFirstPayroll !== null && (
            <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border text-[8px] lg:text-[9px] font-black tracking-widest uppercase
              ${isFirstPayroll
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
              <Banknote className="w-3 h-3" />
              {isFirstPayroll ? '1st Payroll · Benefits Deducted' : '2nd Payroll · Tax Deducted'}
            </div>
          )}
        </header>

        <div className="p-6 lg:p-12 max-w-[1400px] w-full mx-auto space-y-8 lg:space-y-10">
          {!activeSlip ? (
            <EmptyState />
          ) : (
            <>
              {/* HERO CARD */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] lg:rounded-[3.5rem] p-8 lg:p-12 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />

                <div className="z-10 w-full">
                  <p className="text-[9px] lg:text-[10px] font-black text-slate-500 tracking-[0.4em] mb-3">NET TAKE-HOME PAY</p>
                  <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter italic break-all">
                    ₱ {activeSlip.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-6 text-indigo-500">
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[8px] lg:text-[9px] font-black tracking-widest uppercase whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3" /> Verified by Fin-Audit
                    </div>
                    <p className="text-[8px] lg:text-[10px] font-black tracking-widest text-slate-400">
                      Period: {activeSlip.periodStart} – {activeSlip.periodEnd}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] text-left xl:text-center w-full xl:min-w-[280px] backdrop-blur-md">
                  <p className="text-[8px] lg:text-[10px] font-black text-slate-500 tracking-widest mb-2">Pay Release Date</p>
                  <p className="text-xl lg:text-2xl font-black text-white italic">{activeSlip.payDate}</p>
                  <div className="mt-4 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[8px] lg:text-[9px] font-black text-indigo-400 inline-block">
                    PS-{activeSlip.id} · {activeSlip.status}
                  </div>
                </div>
              </div>

              {/* EARNINGS & DEDUCTIONS */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">

                {/* EARNINGS */}
                <DataCard title="Earnings" icon={<TrendingUp className="w-4 h-4" />} color="text-indigo-500">
                  <div className="space-y-3">
                    <Row label="Basic Salary (Half-Month)" val={activeSlip.basicSalary} />
                    <Row
                      label="Night Differential (+10%/hr · 10PM–6AM)"
                      val={activeSlip.nightDiff}
                      icon={<Moon className="w-3 h-3 text-indigo-400" />}
                    />
                    <Row
                      label="Overtime Pay (×1.25/hr)"
                      val={activeSlip.overtime}
                      icon={<Clock className="w-3 h-3 text-indigo-400" />}
                    />
                    <Row label="Allowances" val={activeSlip.allowances} />
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center px-2">
                    <span className="text-[9px] lg:text-[10px] font-black text-indigo-400 tracking-widest">Total Gross</span>
                    <span className="text-lg lg:text-xl font-black text-indigo-400 italic">
                      ₱ {activeSlip.grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </DataCard>

                {/* DEDUCTIONS */}
                <DataCard title="Deductions" icon={<ArrowDownRight className="w-4 h-4" />} color="text-orange-400">
                  {isFirstPayroll ? (
                    // 1st payroll: show benefits, tax is 0
                    <div className="space-y-3">
                      <Row label="SSS Premium (4.5%)" val={activeSlip.sssDeduction} isNeg />
                      <Row label="PhilHealth (2.5%)" val={activeSlip.philHealthDeduction} isNeg />
                      <Row label="Pag-IBIG Fund (2%, max ₱100)" val={activeSlip.pagIbigDeduction} isNeg />
                      <ZeroRow label="Withholding Tax" note="Deducted on 2nd Payroll" />
                    </div>
                  ) : (
                    // 2nd payroll: show tax only, benefits are 0
                    <div className="space-y-3">
                      <ZeroRow label="SSS Premium" note="Deducted on 1st Payroll" />
                      <ZeroRow label="PhilHealth" note="Deducted on 1st Payroll" />
                      <ZeroRow label="Pag-IBIG Fund" note="Deducted on 1st Payroll" />
                      <Row
                        label={activeSlip.withholdingTax === 0
                          ? 'Withholding Tax (Tax-Exempt · ≤ ₱20,833/mo)'
                          : 'Withholding Tax (BIR TRAIN Law)'}
                        val={activeSlip.withholdingTax}
                        isNeg
                      />
                    </div>
                  )}
                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center px-2">
                    <span className="text-[9px] lg:text-[10px] font-black text-orange-400 tracking-widest">Total Deductions</span>
                    <span className="text-lg lg:text-xl font-black text-orange-400 italic">
                      ₱ {activeSlip.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </DataCard>
              </div>

              {/* PAYROLL RULES LEGEND */}
              <div className="bg-slate-900/20 border border-white/5 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <LegendItem
                  icon={<Clock className="w-4 h-4 text-indigo-400" />}
                  title="Overtime Pay"
                  desc="Regular OT = Hourly Rate × 1.25 per hour worked beyond 8 hrs/day"
                />
                <LegendItem
                  icon={<Moon className="w-4 h-4 text-indigo-400" />}
                  title="Night Differential"
                  desc="10 PM – 6 AM hours earn +10% of hourly rate per hour (DOLE)"
                />
                <LegendItem
                  icon={<Banknote className="w-4 h-4 text-indigo-400" />}
                  title="Withholding Tax"
                  desc="Tax-exempt if monthly gross ≤ ₱20,833 (₱250K/yr). BIR TRAIN Law brackets apply above."
                />
              </div>

              {/* HISTORY LEDGER */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="p-6 lg:p-8 border-b border-white/5 flex items-center gap-4 bg-white/5">
                  <History className="w-4 h-4 lg:w-5 lg:h-5 text-slate-500" />
                  <h3 className="text-[10px] lg:text-xs font-black text-white tracking-[0.3em]">Historical Ledger</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {visibleHistory.map((slip) => {
                    const isFirst = new Date(slip.periodStart).getDate() <= 15;
                    return (
                      <div
                        key={slip.id}
                        onClick={() => onSelectSlip(slip)}
                        className={`px-6 lg:px-10 py-5 lg:py-6 flex justify-between items-center hover:bg-indigo-600/5 cursor-pointer transition-all active:scale-[0.99] ${activeSlip.id === slip.id ? 'bg-indigo-600/10 border-l-4 border-indigo-500' : ''}`}
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-[10px] lg:text-xs font-black tracking-tight uppercase truncate">
                            {slip.periodStart} – {slip.periodEnd}
                          </span>
                          <span className={`text-[7px] lg:text-[8px] font-black tracking-widest uppercase
                            ${isFirst ? 'text-indigo-400' : 'text-amber-400'}`}>
                            {isFirst ? '1st Payroll · Benefits' : '2nd Payroll · Tax'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 lg:gap-6 ml-4">
                          <span className="text-[10px] lg:text-xs font-black text-emerald-400 italic whitespace-nowrap">
                            ₱ {slip.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <Receipt className="w-4 h-4 lg:w-5 lg:h-5 text-slate-500 hidden sm:block" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 lg:px-10 pb-10">
                  <p className="text-[8px] lg:text-[9px] font-black text-slate-500 tracking-widest italic uppercase">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="h-[50vh] lg:h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] lg:rounded-[4rem] p-10 text-center">
    <Ghost className="w-12 h-12 lg:w-16 lg:h-16 text-slate-800 mb-6" />
    <h2 className="text-lg lg:text-xl font-black text-slate-600 tracking-widest uppercase">No Archived Records Found</h2>
  </div>
);

interface DataCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}

const DataCard = ({ title, icon, color, children }: DataCardProps) => (
  <div className="space-y-4 lg:space-y-6">
    <h3 className={`text-[10px] lg:text-xs font-black ${color} tracking-[0.4em] flex items-center gap-3 uppercase`}>
      {icon} {title}
    </h3>
    <div className="bg-slate-900/20 border border-white/5 rounded-[1.5rem] lg:rounded-[3rem] p-6 lg:p-8">
      {children}
    </div>
  </div>
);

interface RowProps {
  label: string;
  val: number;
  isNeg?: boolean;
  icon?: React.ReactNode;
}

const Row = ({ label, val, isNeg, icon }: RowProps) => (
  <div className="flex justify-between items-center p-4 lg:p-5 bg-white/5 rounded-xl lg:rounded-2xl border border-white/5">
    <span className="flex items-center gap-2 text-[8px] lg:text-[10px] font-black text-slate-300 tracking-widest uppercase truncate mr-4">
      {icon} {label}
    </span>
    <span className={`text-xs lg:text-sm font-black ${isNeg ? 'text-orange-400' : 'text-white'} italic whitespace-nowrap`}>
      {isNeg ? '– ' : ''}₱ {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </span>
  </div>
);

// Row for items that are ₱0 with a note explaining why
interface ZeroRowProps {
  label: string;
  note: string;
}

const ZeroRow = ({ label, note }: ZeroRowProps) => (
  <div className="flex justify-between items-center p-4 lg:p-5 bg-white/[0.03] rounded-xl lg:rounded-2xl border border-white/5 opacity-40">
    <div className="min-w-0 mr-4">
      <span className="text-[8px] lg:text-[10px] font-black text-slate-400 tracking-widest uppercase truncate block">{label}</span>
      <span className="text-[7px] font-black text-slate-600 tracking-widest uppercase">{note}</span>
    </div>
    <span className="text-xs lg:text-sm font-black text-slate-600 italic whitespace-nowrap">₱ 0.00</span>
  </div>
);

interface LegendItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const LegendItem = ({ icon, title, desc }: LegendItemProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black text-white tracking-widest uppercase">
      {icon} {title}
    </div>
    <p className="text-[7px] lg:text-[8px] font-black text-slate-500 tracking-wider normal-case not-italic leading-relaxed">{desc}</p>
  </div>
);