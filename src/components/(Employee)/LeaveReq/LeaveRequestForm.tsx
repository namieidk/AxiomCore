'use client';

import React, { useMemo } from 'react';
import { FilePlus, Calendar, Info, ChevronRight, LucideIcon, Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';

interface LeaveHistoryItem {
  type: string;
  date: string;
  status: string;
  color: string; 
  icon: LucideIcon;
}

interface LeaveRequestProps {
  credits: number;
  history: LeaveHistoryItem[];
  requestedDays: number;
  dates: { start: string; end: string };
  onDateChange: (type: 'start' | 'end', value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const LeaveRequestForm = ({ 
  credits, 
  history, 
  requestedDays, 
  dates,
  onDateChange, 
  onSubmit
}: LeaveRequestProps) => {

  const todayLimit = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  return (
    <section className="relative flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-[#050510] scrollbar-hide uppercase italic font-black">
      
      <Toaster 
        position="top-right" 
        expand={false} 
        richColors 
        theme="dark"
        toastOptions={{
          style: { 
            background: '#0a0a20', 
            border: '1px solid rgba(79, 70, 229, 0.2)',
            color: '#fff',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            fontSize: '10px',
            fontWeight: '900',
            letterSpacing: '0.1em',
            borderRadius: '1rem'
          },
        }}
      />

      {/* RESPONSIVE HEADER */}
      <header className="px-6 lg:px-12 py-6 lg:py-10 border-b border-indigo-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 backdrop-blur-xl sticky top-0 z-30 bg-[#050510]/80">
        <div className="mt-12 sm:mt-0">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <FilePlus className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />
            <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em]">Request Submission</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic">
            Apply For <span className="text-indigo-500">Leave</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 p-3 lg:p-4 rounded-2xl shadow-lg w-full sm:w-auto">
          <div className="text-left sm:text-right flex-1 sm:flex-none">
            <p className="text-[7px] lg:text-[8px] font-black text-indigo-400/50 tracking-widest uppercase">Available Credits</p>
            <p className="text-md lg:text-lg font-black text-white italic">{credits} DAYS</p>
          </div>
          <div className="h-8 w-px bg-indigo-500/20"></div>
          <Calendar className="text-indigo-400 w-5 h-5 lg:w-6 lg:h-6" />
        </div>
      </header>

      <div className="p-6 lg:p-12 max-w-[1200px] w-full mx-auto space-y-8 lg:space-y-10">
        
        {/* MAIN FORM */}
        <form onSubmit={onSubmit} className="bg-indigo-950/20 border border-indigo-500/10 rounded-[2rem] lg:rounded-[3.5rem] p-6 lg:p-12 shadow-2xl backdrop-blur-3xl space-y-8 lg:space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-end">
            <div className="space-y-3 lg:space-y-4">
              <label className="block text-[9px] lg:text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase ml-1">Leave Category</label>
              <select name="leaveType" required className="w-full h-[56px] lg:h-[62px] bg-indigo-950/40 border border-indigo-500/10 rounded-2xl px-6 text-[10px] font-black text-white outline-none focus:border-indigo-500/50 appearance-none cursor-pointer">
                <option value="SICK LEAVE">SICK LEAVE</option>
                <option value="VACATION LEAVE">VACATION LEAVE</option>
                <option value="EMERGENCY LEAVE">EMERGENCY LEAVE</option>
              </select>
            </div>

            <div className="space-y-3 lg:space-y-4">
              <label className="block text-[9px] lg:text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase ml-1">Inclusive Dates</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1.5">
                  <p className="text-[7px] font-black text-indigo-500/50 tracking-widest ml-1">START</p>
                  <input name="startDate" type="date" required min={todayLimit} value={dates.start} onChange={(e) => onDateChange('start', e.target.value)} 
                    className="w-full h-[56px] lg:h-[62px] bg-indigo-950/40 border border-indigo-500/10 rounded-2xl px-6 text-[10px] font-black text-white outline-none focus:border-indigo-500/50 [color-scheme:dark] cursor-pointer" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="text-[7px] font-black text-indigo-500/50 tracking-widest ml-1">END</p>
                  <input name="endDate" type="date" required min={dates.start || todayLimit} value={dates.end} onChange={(e) => onDateChange('end', e.target.value)} 
                    className="w-full h-[56px] lg:h-[62px] bg-indigo-950/40 border border-indigo-500/10 rounded-2xl px-6 text-[10px] font-black text-white outline-none focus:border-indigo-500/50 [color-scheme:dark] cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:space-y-4">
            <label className="block text-[9px] lg:text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase ml-1">Reason / Remarks</label>
            <textarea 
              name="reason" 
              required 
              placeholder="PLEASE PROVIDE DETAILED REASON..." 
              className="w-full h-32 lg:h-40 bg-indigo-950/40 border border-indigo-500/10 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 text-[11px] lg:text-xs font-black text-white outline-none focus:border-indigo-500/50 resize-none uppercase placeholder:opacity-30" 
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-indigo-500/10 gap-6">
            <div className="flex items-center gap-3 text-indigo-400">
               <Info className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-500" />
               <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest">Requested: {requestedDays} Days</span>
            </div>
            <button type="submit" className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-xl active:scale-95 italic border border-indigo-400/20">
              Apply Request
            </button>
          </div>
        </form>

        {/* LOGS SECTION */}
        <div className="space-y-6 pb-20">
          <h3 className="text-[10px] lg:text-xs font-black text-white tracking-[0.4em] uppercase px-2 lg:px-6 italic">Request Logs</h3>
          <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-[1.5rem] lg:rounded-[3rem] overflow-hidden backdrop-blur-xl">
            {history.length > 0 ? history.map((log, i) => (
              <div key={i} className="px-6 lg:px-10 py-5 lg:py-6 flex justify-between items-center border-b border-indigo-500/5 last:border-0 group hover:bg-indigo-500/5 transition-colors">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="p-2.5 lg:p-3 rounded-xl lg:rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 shrink-0">
                    <log.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] lg:text-xs font-black text-white uppercase truncate">{log.type}</p>
                    <p className="text-[8px] lg:text-[9px] font-black text-indigo-400/30 uppercase mt-0.5">Date: {log.date}</p>
                  </div>
                </div>
                <div className="text-[9px] lg:text-[10px] font-black text-indigo-500 italic uppercase flex items-center whitespace-nowrap ml-4">
                  {log.status}
                  <ChevronRight className="w-3 h-3 ml-1 lg:ml-2 text-indigo-900" />
                </div>
              </div>
            )) : (
              <div className="p-16 lg:p-20 text-center text-[9px] lg:text-[10px] font-black text-indigo-900 tracking-[0.5em] uppercase">No active records found</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};