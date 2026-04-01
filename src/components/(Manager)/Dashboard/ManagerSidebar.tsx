'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Clock, MessageSquare, 
  Target, BarChart3, UserCircle, LogOut, 
  CheckSquare, Menu, X 
} from 'lucide-react';

const managerItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/managerDashboard' },
  { name: 'Attendance', icon: Clock, path: '/managerAttendance' },
  { name: 'Approvals', icon: CheckSquare, path: '/Approvals' },
  { name: 'Messages', icon: MessageSquare, path: '/managerMessage' },
  { name: 'Evaluation', icon: Target, path: '/managerEvaluation' },
  { name: 'Reports', icon: BarChart3, path: '/managerReports' },
  { name: 'Profile', icon: UserCircle, path: '/managerProfile' },
];

export const ManagerSidebar = () => {
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
      {/* MOBILE TRIGGER - Positioned to not overlap content */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-5 left-5 z-[70] p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/40 text-white active:scale-95 transition-all"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[50] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[60]
        w-72 h-screen bg-[#020617] border-r border-white/5 
        flex flex-col p-6 shrink-0 italic
        transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* BRANDING SECTION - Logo visibility prioritized */}
        <div className="flex items-center gap-3 mb-12 px-2 mt-16 lg:mt-0">
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 overflow-hidden relative shrink-0 border border-white/10">
            <Image 
              src="/logo.png" 
              alt="Axiom Logo" 
              width={40}
              height={40}
              className="object-cover scale-125 transition-transform group-hover:scale-150" 
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-tighter text-xl leading-none uppercase italic">Axiom</span>
            <span className="text-indigo-500 font-bold text-[8px] tracking-[0.5em] uppercase">Manager</span>
          </div>
        </div>

        {/* NAVIGATION SECTION */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          {managerItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all border group ${
                  isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20 shadow-lg' 
                  : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/5 hover:border-white/5'
                }`}
              >
                <item.icon 
                  className={`w-4 h-4 transition-all group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`} 
                  strokeWidth={isActive ? 3 : 2} 
                />
                <span className={`text-[10px] uppercase tracking-[0.2em] italic transition-colors ${isActive ? 'font-black' : 'font-bold group-hover:text-white'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER SECTION */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 text-slate-500 hover:text-red-400 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Terminate Session</span>
          </button>
          
         
        </div>
      </aside>
    </>
  );
};