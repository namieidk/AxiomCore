'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  UserCircle2, 
  Clock, 
  Check, 
  X, 
  Settings2, 
  Loader2, 
  Sunrise, 
  Moon 
} from 'lucide-react';

export interface ScheduleDetails {
  start: string;
  end: string;
  days: string;
}

export interface EmployeeSchedule {
  id: string;
  name: string;
  dept: string;
  profileImage?: string;
  currentShift: string;
  details?: ScheduleDetails;
}

export interface ScheduleSavePayload {
  employeeId: string;
  start: string;
  workingDays: string;
}

interface HRScheduleUIProps {
  employees: EmployeeSchedule[];
  onSave: (data: ScheduleSavePayload) => Promise<void>;
  isLoading: boolean;
}

export const HRScheduleUI = ({ employees, onSave, isLoading }: HRScheduleUIProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeSchedule | null>(null);
  
  const [startTime, setStartTime] = useState<string>('08:00');
  const [days, setDays] = useState<string>('Mon,Tue,Wed,Thu,Fri');

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.id.includes(searchTerm)
  );

  const handleOpenModal = (emp: EmployeeSchedule) => {
    setSelectedEmp(emp);
    setStartTime(emp.details?.start ?? '08:00');
    setDays(emp.details?.days ?? 'Mon,Tue,Wed,Thu,Fri');
  };

  return (
    <div className="p-6 md:p-12 max-w-[1600px] w-full mx-auto space-y-6 md:space-y-10 uppercase font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 md:pb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em]">Fleet Deployment</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic">
            Schedule <span className="text-indigo-600">Grid</span>
          </h1>
        </div>
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="SEARCH AGENT ID OR NAME..."
            className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-indigo-500/50 w-full md:min-w-[320px] text-white transition-all"
          />
        </div>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 md:py-40 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-[10px] font-black text-indigo-500 tracking-[0.5em]">Synchronizing Roster...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 md:py-40 text-center text-slate-500 font-black tracking-widest text-[10px]">
            No Personnel Found in Registry
          </div>
        ) : (
          filtered.map((emp) => (
            <div 
              key={emp.id}
              onClick={() => handleOpenModal(emp)}
              className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-md shadow-xl"
            >
              <Settings2 className="absolute top-6 right-6 w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500 transition-all mb-4 overflow-hidden relative">
                  {emp.profileImage ? (
                    <img 
                      src={emp.profileImage}
                      alt={emp.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <UserCircle2 className="w-8 h-8 md:w-10 md:h-10 text-indigo-500 group-hover:text-white transition-colors" />
                  )}
                </div>
                <h3 className="text-xs md:text-sm font-black text-white group-hover:text-indigo-400 transition-colors tracking-tighter uppercase italic">
                  {emp.name}
                </h3>
                <p className="text-[8px] md:text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1">
                  ID: {emp.id} • {emp.dept}
                </p>
              </div>

              <div className={`text-center py-2 rounded-xl text-[8px] md:text-[9px] font-black tracking-widest border transition-all ${
                emp.currentShift === 'UNASSIGNED' 
                  ? 'border-rose-500/20 bg-rose-500/10 text-rose-500' 
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              }`}>
                {emp.currentShift}
              </div>
              
              {emp.details && (
                <div className="mt-4 bg-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5 text-center space-y-1">
                   <div className="flex items-center justify-center gap-2 text-indigo-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[9px] md:text-[10px] font-black font-mono tracking-tighter">
                        {emp.details.start} - {emp.details.end}
                      </span>
                   </div>
                   <p className="text-[7px] md:text-[8px] text-slate-500 font-black tracking-tighter opacity-60 uppercase">
                     {emp.details.days}
                   </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ASSIGNMENT MODAL */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="bg-[#020617] border border-white/10 w-full max-w-lg rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-6 md:mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
                  Shift <span className="text-indigo-500">Config</span>
                </h2>
                <p className="text-[8px] md:text-[10px] text-slate-500 font-black tracking-widest mt-1 uppercase">
                  DEPLOYING AGENT: {selectedEmp.name}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEmp(null)} 
                className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <button 
                  onClick={() => setStartTime('08:00')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all ${
                    startTime === '08:00' 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/50'
                  }`}
                >
                  <Sunrise className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-[8px] md:text-[10px] font-black tracking-widest">MORNING (08:00)</span>
                </button>
                <button 
                  onClick={() => setStartTime('22:00')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all ${
                    startTime === '22:00' 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/50'
                  }`}
                >
                  <Moon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-[8px] md:text-[10px] font-black tracking-widest">EVENING (22:00)</span>
                </button>
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest ml-1 uppercase">MANUAL START TIME</label>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-indigo-500 font-mono text-white text-lg md:text-xl transition-all" 
                />
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-widest ml-1 uppercase">WORKING DAYS</label>
                <input 
                  type="text" 
                  value={days} 
                  onChange={(e) => setDays(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-indigo-500 font-mono text-white text-xs md:text-sm tracking-[0.1em] md:tracking-[0.2em] uppercase" 
                  placeholder="MON,TUE,WED..." 
                />
              </div>

              <div className="pt-2 md:pt-4">
                <button 
                  onClick={() => onSave({ 
                    employeeId: selectedEmp.id, 
                    start: startTime, 
                    workingDays: days 
                  }).then(() => setSelectedEmp(null))}
                  className="w-full py-4 md:py-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl md:rounded-[2rem] text-[10px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.3em] text-white transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 uppercase"
                >
                  <Check className="w-4 h-4 md:w-5 md:h-5" /> COMMIT DEPLOYMENT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};