'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { HRSidebar } from '../Dashboard/sidebar';
import { Shield, CalendarDays, FileText } from 'lucide-react';
import { ViewType } from './Type';

// ─── Shell ────────────────────────────────────────────────────────────────────

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    /* Changed: Removed 'flex' on mobile to allow vertical stacking if needed, 
       though HRSidebar usually handles its own hidden/visible state.
       Added responsive padding-bottom for mobile if using a bottom nav.
    */
    <main className="h-screen w-full flex flex-col md:flex-row bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic">
      <Toaster richColors position="top-right" theme="dark" />
      
      {/* Sidebar - Assumed to handle its own mobile responsiveness (e.g., drawer) */}
      <HRSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scroll-smooth">
        {children}
      </section>
    </main>
  );
}

// ─── NavTabs ──────────────────────────────────────────────────────────────────

interface NavTabsProps {
  view: ViewType;
  onNavigate: (view: ViewType) => void;
}

const TABS = [
  { key: 'dashboard' as ViewType, label: 'Roster',      icon: <Shield      className="w-3 h-3" /> },
  { key: 'periods'   as ViewType, label: 'Pay Periods',  icon: <CalendarDays className="w-3 h-3" /> },
  { key: 'payslips'  as ViewType, label: 'Payslips',     icon: <FileText    className="w-3 h-3" /> },
] as const;

export function NavTabs({ view, onNavigate }: NavTabsProps) {
  return (
    /* Changed: 
       1. Added 'overflow-x-auto' and 'scrollbar-hide' for mobile swiping.
       2. Changed 'px-12' to 'px-6 md:px-12' for better mobile spacing.
       3. Adjusted 'top' value to handle smaller mobile headers.
    */
    <nav className="flex items-center border-b border-white/5 bg-[#020617]/60 backdrop-blur-md sticky top-0 md:top-[89px] z-30 w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-1 px-6 md:px-12 min-w-max">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            className={`flex items-center gap-2 px-4 md:px-6 py-4 md:py-5 text-[8px] md:text-[9px] font-black tracking-widest border-b-2 transition-all uppercase whitespace-nowrap ${
              view === tab.key
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-600 hover:text-slate-400 hover:bg-white/5'
            }`}
          >
            <span className="shrink-0">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}