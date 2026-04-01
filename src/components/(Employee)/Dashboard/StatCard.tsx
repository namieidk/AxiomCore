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
    /* RESPONSIVE GRID: 
       - 1 column on mobile 
       - 2 columns on small tablets (sm)
       - 4 columns on large screens (lg)
    */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
      {statsConfig.map((stat) => (
        <div 
          key={stat.label} 
          className="relative overflow-hidden bg-slate-900/30 border border-white/5 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-3xl hover:border-indigo-500/20 transition-all group uppercase italic font-black"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 md:p-3 rounded-2xl ${stat.bg} border border-white/5`}>
              <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
            </div>
            <span className="text-[9px] md:text-[10px] text-slate-600 tracking-widest whitespace-nowrap">
              Live Metric
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              <span className="text-[10px] text-slate-700 tracking-tighter">Syncing...</span>
            </div>
          ) : (
            /* Using truncate to prevent long values from breaking the layout on small screens */
            <p className="text-2xl md:text-3xl text-white tracking-tighter group-hover:text-indigo-400 transition-colors truncate">
              {stat.value || '0.0%'}
            </p>
          )}
          
          <p className="text-[9px] md:text-[10px] tracking-[0.2em] text-slate-500 mt-1 font-bold">
            {stat.label}
          </p>

          {/* Subtle background decoration that appears on hover for that high-tech feel */}
          <div className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
            <stat.icon size={80} />
          </div>
        </div>
      ))}
    </div>
  );
};