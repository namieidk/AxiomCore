'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Timer, Star, FileText, Loader2 } from 'lucide-react';

interface DashboardStats {
  attendanceRate: string;
  avgHandleTime: string;
  csatScore: string;
  kpiReports: string;
}

export const StatCards = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const { employeeId } = JSON.parse(stored);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Dashboard/stats/${employeeId}`);
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const statsConfig = [
    { label: 'Attendance', value: data?.attendanceRate, icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
    { label: 'Avg Handle Time', value: data?.avgHandleTime, icon: Timer, color: 'text-blue-400', bg: 'bg-blue-500/5' },
    { label: 'Evaluation Score', value: data?.csatScore, icon: Star, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
    { label: 'KPI Reports', value: data?.kpiReports, icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
      {statsConfig.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden bg-slate-900/30 border border-white/5 p-4 md:p-5 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-3xl hover:border-indigo-500/20 transition-all group uppercase italic font-black"
        >
          {/* Top row: icon + live metric badge */}
          <div className="flex justify-between items-start mb-3">
            <div className={`p-2 md:p-2.5 rounded-2xl ${stat.bg} border border-white/5 shrink-0`}>
              <stat.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${stat.color}`} />
            </div>
            <span className="text-[8px] md:text-[9px] text-slate-600 tracking-widest whitespace-nowrap ml-2">
              Live Metric
            </span>
          </div>

          {/* Bottom row: label left, value right */}
          <div className="flex items-end justify-between gap-2">
            <p className="text-[8px] md:text-[9px] tracking-[0.15em] text-slate-500 font-bold leading-tight shrink-0">
              {stat.label}
            </p>

            {loading ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />
                <span className="text-[9px] text-slate-700 tracking-tighter">Syncing...</span>
              </div>
            ) : (
              <p className="text-lg md:text-xl lg:text-2xl text-white tracking-tighter group-hover:text-indigo-400 transition-colors min-w-0 text-right">
                {stat.value || '0.0%'}
              </p>
            )}
          </div>

          {/* Hover decoration */}
          <div className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
            <stat.icon size={70} />
          </div>
        </div>
      ))}
    </div>
  );
};