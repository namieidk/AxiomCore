'use client';

import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';

export const Navbar = () => {
  const [userData] = useState(() => {
    if (typeof window === 'undefined') {
      return { name: '', role: '', department: '', initials: '' };
    }

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return { name: '', role: '', department: '', initials: '' };

      const user = JSON.parse(storedUser);
      const nameParts: string[] = user.name?.split(' ') ?? [];
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0]?.slice(0, 2) ?? '';

      return {
        name: user.name ?? '',
        role: user.role ?? '',
        department: user.department ?? '',
        initials: initials.toUpperCase(),
      };
    } catch {
      return { name: '', role: '', department: '', initials: '' };
    }
  });

  return (
    <header className="px-6 md:px-10 py-4 md:py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80 italic">
      {/* LEFT SECTION: DEPARTMENT */}
      <div className="flex items-center gap-4 md:gap-6 min-w-0">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2 truncate">
            <span className="text-white truncate">{userData.department || 'OPERATIONS'}</span>
            <span className="text-indigo-600 not-italic shrink-0">UNIT</span>
          </h1>
        </div>
      </div>

      {/* RIGHT SECTION: ACTIONS & PROFILE */}
      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <button className="relative p-2 text-slate-400 hover:text-indigo-400 transition-colors group">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617]"></span>
        </button>

        <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6 border-l border-white/10">
          {/* USER INFO - Hidden on mobile, visible on small screens up */}
          <div className="text-right hidden sm:block">
            <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-tight truncate max-w-[120px] md:max-w-none">
              {userData.name}
            </p>
            <p className="text-[8px] md:text-[9px] font-bold text-indigo-500 uppercase tracking-widest">
              {userData.role}
            </p>
          </div>

        </div>
      </div>
    </header>
  );
};