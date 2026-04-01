'use client';

import React from 'react';
import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import { 
  TrendingUp, ShieldCheck, ArrowDownRight, 
  Wallet, Receipt, History, Ghost, ChevronLeft, ChevronRight 
} from 'lucide-react';

// 1. DATA CONTRACT
export interface PayslipData {
  id: number;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  basicSalary: number;
  nightDiff: number;
  overtime: number;
  allowances: number;
  grossPay: number;
  sssDeduction: number;
  philHealthDeduction: number;
  pagIbigDeduction: number;
  withholdingTax: number;
  totalDeductions: number;
  netPay: number;
  status: string;
  generatedAt: string;
}

// 2. PROPS INTERFACE
interface PayrollViewProps {
  activeSlip: PayslipData | null;
  visibleHistory: PayslipData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectSlip: (slip: PayslipData) => void;
}

export function PayrollView({
  activeSlip,
  visibleHistory,
  currentPage,
  totalPages,
  onPageChange,
  onSelectSlip
}: PayrollViewProps) {
  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black">
      <Sidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
        
        {/* RESPONSIVE HEADER */}
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
        </header>

        <div className="p-6 lg:p-12 max-w-[1400px] w-full mx-auto space-y-8 lg:space-y-10">
          {!activeSlip ? (
            <EmptyState />
          ) : (
            <>
              {/* HERO CARD - RESPONSIVE STACKING */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] lg:rounded-[3.5rem] p-8 lg:p-12 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
                
                <div className="z-10 w-full">
                  <p className="text-[9px] lg:text-[10px] font-black text-slate-500 tracking-[0.4em] mb-3">NET TAKE-HOME PAY</p>
                  <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter italic break-all">
                    ₱ {activeSlip.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-6 text-indigo-500">
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[8px] lg:text-[9px] font-black tracking-widest uppercase whitespace-nowrap">
                       <ShieldCheck className="w-3 h-3" /> VERIFIED BY FIN-AUDIT
                    </div>
                    <p className="text-[8px] lg:text-[10px] font-black tracking-widest text-slate-400">
                      PERIOD: {activeSlip.periodStart} – {activeSlip.periodEnd}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] text-left xl:text-center w-full xl:min-w-[280px] backdrop-blur-md">
                    <p className="text-[8px] lg:text-[10px] font-black text-slate-500 tracking-widest mb-2">PAY RELEASE DATE</p>
                    <p className="text-xl lg:text-2xl font-black text-white italic">{activeSlip.payDate}</p>
                    <div className="mt-4 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[8px] lg:text-[9px] font-black text-indigo-400 inline-block">
                        PS-{activeSlip.id} · {activeSlip.status}
                    </div>
                </div>
              </div>

              {/* EARNINGS & DEDUCTIONS - GRID TO COLUMN TRANSITION */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
                
                {/* EARNINGS */}
                <DataCard title="Earnings" icon={<TrendingUp className="w-4 h-4"/>} color="text-indigo-500">
                    <div className="space-y-3">
                        <Row label="Basic Salary" val={activeSlip.basicSalary} />
                        <Row label="Night Differential" val={activeSlip.nightDiff} />
                        <Row label="Overtime Pay" val={activeSlip.overtime} />
                        <Row label="Allowances" val={activeSlip.allowances} />
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center px-2">
                        <span className="text-[9px] lg:text-[10px] font-black text-indigo-400 tracking-widest">TOTAL GROSS</span>
                        <span className="text-lg lg:text-xl font-black text-indigo-400 italic">₱ {activeSlip.grossPay.toLocaleString()}</span>
                    </div>
                </DataCard>

                {/* DEDUCTIONS */}
                <DataCard title="Deductions" icon={<ArrowDownRight className="w-4 h-4"/>} color="text-orange-400">
                    <div className="space-y-3">
                        <Row label="SSS PREMIUM" val={activeSlip.sssDeduction} isNeg />
                        <Row label="PhilHealth" val={activeSlip.philHealthDeduction} isNeg />
                        <Row label="Pag-IBIG FUND" val={activeSlip.pagIbigDeduction} isNeg />
                        <Row label="WITHHOLDING TAX" val={activeSlip.withholdingTax} isNeg />
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center px-2">
                        <span className="text-[9px] lg:text-[10px] font-black text-orange-400 tracking-widest">TOTAL DEDUCTIONS</span>
                        <span className="text-lg lg:text-xl font-black text-orange-400 italic">₱ {activeSlip.totalDeductions.toLocaleString()}</span>
                    </div>
                </DataCard>
              </div>

              {/* HISTORY LEDGER */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="p-6 lg:p-8 border-b border-white/5 flex items-center gap-4 bg-white/5">
                    <History className="w-4 h-4 lg:w-5 lg:h-5 text-slate-500" />
                    <h3 className="text-[10px] lg:text-xs font-black text-white tracking-[0.3em]">HISTORICAL LEDGER</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {visibleHistory.map((slip) => (
                        <div 
                          key={slip.id} 
                          onClick={() => onSelectSlip(slip)} 
                          className={`px-6 lg:px-10 py-5 lg:py-6 flex justify-between items-center hover:bg-indigo-600/5 cursor-pointer transition-all active:scale-[0.99] ${activeSlip.id === slip.id ? 'bg-indigo-600/10 border-l-4 border-indigo-500' : ''}`}
                        >
                            <span className="text-[10px] lg:text-xs font-black tracking-tight uppercase">{slip.periodStart} - {slip.periodEnd}</span>
                            <div className="flex items-center gap-4 lg:gap-6">
                                <span className="text-[10px] lg:text-xs font-black text-emerald-400 italic whitespace-nowrap">₱ {slip.netPay.toLocaleString()}</span>
                                <Receipt className="w-4 h-4 lg:w-5 lg:h-5 text-slate-500 hidden sm:block" />
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 lg:px-10 pb-10">
                  <p className="text-[8px] lg:text-[9px] font-black text-slate-500 tracking-widest italic uppercase">Page {currentPage} of {totalPages}</p>
                  <div className="flex gap-2">
                      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 disabled:opacity-20 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
                      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 disabled:opacity-20 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
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

// ─── STATED HELPER COMPONENTS ───

const EmptyState = () => (
    <div className="h-[50vh] lg:h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] lg:rounded-[4rem] p-10 text-center">
        <Ghost className="w-12 h-12 lg:w-16 lg:h-16 text-slate-800 mb-6" />
        <h2 className="text-lg lg:text-xl font-black text-slate-600 tracking-widest uppercase">NO ARCHIVED RECORDS FOUND</h2>
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
}

const Row = ({ label, val, isNeg }: RowProps) => (
    <div className="flex justify-between items-center p-4 lg:p-5 bg-white/5 rounded-xl lg:rounded-2xl border border-white/5">
        <span className="text-[8px] lg:text-[10px] font-black text-slate-300 tracking-widest uppercase truncate mr-4">{label}</span>
        <span className={`text-xs lg:text-sm font-black ${isNeg ? 'text-orange-400' : 'text-white'} italic whitespace-nowrap`}>
            {isNeg ? '- ' : ''}₱ {val.toLocaleString()}
        </span>
    </div>
);