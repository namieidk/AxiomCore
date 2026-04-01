'use client';

import React from 'react';
import Image from 'next/image';

// --- BACKGROUND AMBIANCE (Pulses) ---
export const LoginBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 md:w-96 md:h-96 bg-blue-900 rounded-full blur-[80px] md:blur-[120px] opacity-20 animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-56 h-56 md:w-80 md:h-80 bg-emerald-900 rounded-full blur-[70px] md:blur-[100px] opacity-10" />
  </div>
);

// --- HEADER WITH LOGO ---
export const LoginHeader = () => (
  <div className="text-center mb-6 md:mb-8 flex flex-col items-center italic font-black">
    {/* LOGO PEDESTAL */}
    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-xl shadow-indigo-600/5 mb-4 md:mb-6 overflow-hidden border border-slate-200">
      <Image 
        src="/logo.png" 
        alt="Axiom Logo" 
        width={40} 
        height={40} 
        priority 
        className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] md:w-[48px] md:h-[48px]"
      />
    </div>

    {/* MAIN TITLES */}
    <h1 className="text-2xl md:text-3xl tracking-tighter text-white uppercase italic">
      Axiom <span className="font-light text-indigo-500 not-italic">Core</span>
    </h1>
    
    {/* SUBTITLE */}
    <div className="flex items-center gap-3 mt-2">
        <div className="h-[1px] w-3 md:w-4 bg-slate-800" />
        <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-500 font-black">
            Secure ERP Access
        </p>
        <div className="h-[1px] w-3 md:w-4 bg-slate-800" />
    </div>
  </div>
);