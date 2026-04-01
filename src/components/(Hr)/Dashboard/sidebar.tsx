'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Clock, CheckSquare, MessageSquare, 
  UserPlus, Target, CreditCard, BarChart3, LogOut, 
  Menu, X 
} from 'lucide-react';

const hrMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/hrDashboard' },
  { name: 'Attendance', icon: Clock, path: '/hrAttendance' },
  { name: 'Schedule', icon: Clock, path: '/hrSchedule' },
  { name: 'Approvals', icon: CheckSquare, path: '/hrApproval' },
  { name: 'Message', icon: MessageSquare, path: '/hrMessage' },
  { name: 'Applicant List', icon: UserPlus, path: '/Applicants' },
  { name: 'Evaluation', icon: Target, path: '/hrEvaluate' },
  { name: 'Payroll', icon: CreditCard, path: '/hrPayroll' },
  { name: 'Reports', icon: BarChart3, path: '/hrReports' },
];

export const HRSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* MOBILE TRIGGER BUTTON - Matches Employee Style */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-6 left-6 z-[100] p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-[80] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR ASIDE - Reverted to w-64 and exact padding */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[90]
        w-64 h-screen bg-[#020617] border-r border-white/5 
        flex flex-col p-6 shrink-0 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* BRANDING SECTION - Reverted to h-9 w-9 and 10px spacing */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-12 lg:mt-0">
          <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 relative overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Axiom Logo" 
              width={40} 
              height={40}
              priority
              className="object-contain p-1" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-tighter text-lg leading-none uppercase italic">Axiom</span>
            <span className="text-indigo-500 font-bold text-[8px] tracking-[0.5em] uppercase whitespace-nowrap">HR Admin</span>
          </div>
        </div>

        {/* NAVIGATION SECTION - Reverted to 1.5 space-y */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2 scrollbar-hide">
          {hrMenuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all border ${
                  isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20' 
                  : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/5'
                }`}>
                <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] uppercase tracking-[0.15em] ${isActive ? 'font-black' : 'font-bold'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER SECTION - Matches Employee Footer exactly */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 hover:text-red-400 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};