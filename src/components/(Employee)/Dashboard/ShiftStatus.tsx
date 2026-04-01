'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, Clock } from 'lucide-react';

export const ShiftStatus = () => {
  const [time, setTime] = useState('--:--:--');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ reg: 0, ot: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { employeeId } = JSON.parse(storedUser);
      fetchStats(String(employeeId));
      const savedStatus = localStorage.getItem(`isClockedIn_${employeeId}`);
      if (savedStatus === 'true') setIsClockedIn(true);
    }
  }, []);

  const fetchStats = useCallback(async (empId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/attendance/weekly-summary/${empId}`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          reg: data.totalRegular || 0,
          ot: data.totalOT || 0,
        });
      } else {
        setStats({ reg: 0, ot: 0 });
      }
    } catch (err) {
      console.error("Attendance API unreachable", err);
    }
  }, []);

  const handleToggleShift = async () => {
    setIsLoading(true);
    setError(null);

    const stored = localStorage.getItem('user');
    if (!stored) {
      setIsLoading(false);
      return;
    }

    const parsed = JSON.parse(stored);
    const employeeId = String(parsed.employeeId);
    const endpoint = isClockedIn ? 'clockout' : 'clockin';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/attendance/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId }),
      });

      const rawText = await res.text();

      let message: string | null = null;
      if (rawText) {
        try {
          const body = JSON.parse(rawText);
          message = body.message ?? null;
        } catch {
          message = rawText;
        }
      }

      if (res.ok) {
        const newStatus = !isClockedIn;
        setIsClockedIn(newStatus);
        localStorage.setItem(`isClockedIn_${employeeId}`, String(newStatus));
        fetchStats(employeeId);
      } else {
        setError(message?.toUpperCase() || `SHIFT ACTION DENIED (${res.status})`);
      }
    } catch (err) {
      setError('COMMUNICATION ERROR: SYSTEM OFFLINE');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-indigo-950/40 p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-indigo-500/10 backdrop-blur-xl uppercase italic font-black relative overflow-hidden h-full flex flex-col justify-between">
      
      {/* Background Decorative Icon */}
      <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none">
        <Clock className="w-32 h-32 text-indigo-500" />
      </div>

      {error && (
        <div className="absolute inset-0 z-20 bg-[#020617]/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
          <p className="text-[10px] text-white tracking-[0.2em] leading-relaxed mb-6 px-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-8 py-3 bg-white text-black rounded-full text-[9px] font-black tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all active:scale-90"
          >
            DISMISS
          </button>
        </div>
      )}

      <div>
        <div className="text-center mb-8 relative z-10">
          <p className="text-[8px] lg:text-[9px] text-indigo-400 tracking-[0.4em] mb-2 font-normal not-italic opacity-60">System Synchronized Time</p>
          <div className="text-3xl lg:text-4xl text-white font-mono tracking-tighter text-shadow-glow">
            {time}
          </div>
        </div>

        <button
          onClick={handleToggleShift}
          disabled={isLoading}
          className={`w-full py-4 lg:py-5 rounded-2xl text-[9px] lg:text-[10px] tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center relative z-10 ${
            isClockedIn
              ? 'bg-red-600/90 text-white hover:bg-red-500 shadow-xl shadow-red-600/20 border border-red-400/20'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 border border-indigo-400/20'
          }`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : isClockedIn ? (
            'TERMINATE CURRENT SHIFT'
          ) : (
            'BEGIN OPERATIONAL SHIFT'
          )}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:gap-4 relative z-10">
        <div className="bg-white/5 p-4 lg:p-5 rounded-2xl border border-white/5 group hover:border-indigo-500/20 transition-colors">
          <p className="text-[7px] lg:text-[8px] text-slate-500 tracking-widest mb-1 not-italic font-normal uppercase">Regular Period</p>
          <p className="text-lg lg:text-xl text-indigo-400 tracking-tighter">{stats.reg}H</p>
        </div>
        <div className="bg-emerald-500/5 p-4 lg:p-5 rounded-2xl border border-emerald-500/10 group hover:border-emerald-500/30 transition-colors">
          <p className="text-[7px] lg:text-[8px] text-emerald-500/50 tracking-widest mb-1 not-italic font-normal uppercase">Overtime Accumulated</p>
          <p className="text-lg lg:text-xl text-emerald-400 tracking-tighter">+{stats.ot}H</p>
        </div>
      </div>

      {/* Connection Pulse */}
      <div className="mt-6 flex justify-center items-center gap-2 opacity-30">
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
        <span className="text-[7px] tracking-[0.3em] font-normal not-italic text-indigo-400">ENCRYPTED UPLINK ACTIVE</span>
      </div>
    </div>
  );
};