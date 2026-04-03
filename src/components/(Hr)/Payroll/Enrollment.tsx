'use client';

import React from 'react';
import {
  ArrowLeft, Save, ChevronDown,
  Shield, ShieldCheck, Landmark, CreditCard, Search,
} from 'lucide-react';
import { PayrollRecord } from './Type';
import { fmt, calcDeductions } from './Utils';

interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isDropdownOpen: boolean;
  onDropdownOpen: () => void;
  payrollList: PayrollRecord[];
  onSelectEmployee: (emp: PayrollRecord) => void;
  salary: number;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

function EmployeeSearch({
  searchTerm,
  onSearchChange,
  isDropdownOpen,
  onDropdownOpen,
  payrollList,
  onSelectEmployee,
  salary,
  dropdownRef,
}: EmployeeSearchProps) {

  const filtered = payrollList.filter(e =>
    e.status !== 'PROCESSED' &&
    e.sssId && e.pagibigId && e.philId &&
    (
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 w-full" ref={dropdownRef}>
      <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
        <Search className="w-4 h-4" /> Personnel Selection
      </h3>

      <div className="space-y-4 relative">
        <div className="space-y-2">
          <label className="text-[8px] font-black text-slate-500 tracking-widest ml-2 italic uppercase">
            Search Account
          </label>
          <div className="relative">
            <input
              value={searchTerm}
              onChange={e => { onSearchChange(e.target.value); onDropdownOpen(); }}
              onFocus={onDropdownOpen}
              placeholder="SELECT TARGET..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 transition-all uppercase pr-12"
            />
            <ChevronDown className={`absolute right-4 top-4 w-4 h-4 text-slate-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute z-[100] w-full mt-2 bg-[#0a0f24] border border-white/10 rounded-2xl shadow-2xl max-h-60 md:max-h-72 overflow-y-auto backdrop-blur-2xl">
              {filtered.length > 0 ? (
                filtered.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className="p-4 md:p-5 hover:bg-indigo-600/20 cursor-pointer border-b border-white/5 flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[10px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase truncate">{emp.name}</p>
                      <p className="text-[8px] font-bold text-slate-500 mt-1 italic tracking-widest uppercase truncate">{emp.id}</p>
                    </div>
                    <span className="text-[7px] shrink-0 font-black px-2 py-1 rounded border border-slate-500/30 text-slate-500 uppercase tracking-widest">{emp.role}</span>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center space-y-1">
                  <p className="text-[8px] font-black text-slate-500 uppercase italic tracking-widest">No Eligible Personnel Found</p>
                  <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Statutory IDs Required Before Enrollment</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 md:pt-4">
          <label className="text-[8px] font-black text-slate-500 tracking-widest ml-2 italic uppercase">Auto-Calc Monthly Basic</label>
          <div className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 md:p-5 text-lg md:text-xl font-black text-indigo-400 italic flex justify-between items-center shadow-inner shadow-indigo-900/40">
            <span>{fmt(salary)}</span>
            <Shield className="w-4 h-4 text-indigo-600/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatutoryPanel({ targetEmployee, salary }: { targetEmployee: PayrollRecord | null, salary: number }) {
  const deductions = calcDeductions(salary);
  return (
    <div className="space-y-6 w-full">
      <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
        <CreditCard className="w-4 h-4" /> Statutory IDs & Deductions
      </h3>
      <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 flex flex-col justify-center min-h-[250px] md:min-h-[300px] space-y-4">
        {!targetEmployee ? (
          <div className="text-center py-10"><p className="text-[8px] font-black text-slate-700 tracking-[0.3em] uppercase italic">Awaiting Selection...</p></div>
        ) : (
          <>
            {[
              { icon: <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />, label: 'SSS ID', id: targetEmployee.sssId, note: '4.5% Share', val: deductions.sss },
              { icon: <Landmark className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />, label: 'Pag-IBIG ID', id: targetEmployee.pagibigId, note: '2% (Max ₱100)', val: deductions.pagibig },
              { icon: <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-rose-400" />, label: 'PhilHealth ID', id: targetEmployee.philId, note: '2.5% Share', val: deductions.philhealth },
            ].map(item => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                <div className="shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[7px] font-black text-slate-500 mb-0.5 md:mb-1">{item.label}</p>
                  <p className="text-[9px] md:text-[10px] font-black text-white truncate">{item.id}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[7px] font-black text-slate-500 mb-0.5 md:mb-1">{item.note}</p>
                  <p className="text-xs md:text-sm font-black text-orange-400 italic">{fmt(item.val)}</p>
                </div>
              </div>
            ))}
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-[8px] font-black text-slate-400 uppercase">Total Monthly Deduction</p>
              <p className="text-sm md:text-base font-black text-orange-400 italic">{fmt(deductions.total)}</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-[8px] font-black text-slate-400 uppercase">Est. Net Take Home</p>
              <p className="text-sm md:text-base font-black text-emerald-400 italic">{fmt(salary - deductions.total)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface EnrollmentViewProps {
  onCancel: () => void;
  payrollList: PayrollRecord[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isDropdownOpen: boolean;
  onDropdownOpen: () => void;
  targetEmployee: PayrollRecord | null;
  onSelectEmployee: (emp: PayrollRecord) => void;
  salary: number;
  onEnroll: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function EnrollmentView({
  onCancel,
  payrollList,
  searchTerm,
  onSearchChange,
  isDropdownOpen,
  onDropdownOpen,
  targetEmployee,
  onSelectEmployee,
  salary,
  onEnroll,
  dropdownRef,
}: EnrollmentViewProps) {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      <header className="p-6 md:p-12 border-b border-white/5 flex justify-between items-center sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md">
        <button onClick={onCancel} className="flex items-center gap-2 text-indigo-500 font-black text-[9px] md:text-[10px] tracking-widest hover:text-indigo-400 uppercase transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Cancel</span>
        </button>
        <h2 className="text-sm md:text-xl font-black text-white tracking-tighter uppercase italic truncate px-4 text-center">Payroll Onboarding</h2>
        <div className="w-10 sm:w-24" />
      </header>

      <div className="p-6 md:p-12 max-w-5xl mx-auto w-full space-y-8 md:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-start">
          <EmployeeSearch
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            isDropdownOpen={isDropdownOpen}
            onDropdownOpen={onDropdownOpen}
            payrollList={payrollList}
            onSelectEmployee={onSelectEmployee}
            salary={salary}
            dropdownRef={dropdownRef}
          />
          <StatutoryPanel targetEmployee={targetEmployee} salary={salary} />
        </div>

        <div className="bg-indigo-600/5 border border-indigo-600/20 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 transition-all">
          <div className="flex items-center gap-4 text-center md:text-left">
            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 opacity-50 shrink-0" />
            <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest italic">
              Secure Enrollment Portal <br className="sm:hidden" /> | Ledger v2.0
            </p>
          </div>
          <button
            onClick={onEnroll}
            disabled={!targetEmployee}
            className={`w-full md:w-auto px-10 md:px-16 py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] transition-all uppercase flex items-center justify-center ${!!targetEmployee ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 active:scale-95' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
          >
            <Save className="w-4 h-4 mr-2" /> Secure Record
          </button>
        </div>
      </div>
    </div>
  );
}