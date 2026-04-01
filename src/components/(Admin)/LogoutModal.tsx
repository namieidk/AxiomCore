'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#020617] border border-white/10 rounded-[2rem] p-8 lg:p-10 shadow-2xl text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-black text-white uppercase mb-2 italic">Terminate Session?</h2>
        <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-8">Links will be severed. re-auth required.</p>
        <div className="flex flex-col gap-3 font-sans">
          <button onClick={onConfirm} className="w-full py-4 rounded-xl bg-red-600 text-white text-[10px] font-black tracking-widest uppercase">Terminate</button>
          <button onClick={onClose} className="w-full py-4 rounded-xl bg-white/5 text-slate-400 text-[10px] font-black tracking-widest uppercase">Maintain</button>
        </div>
      </div>
    </div>
  );
};