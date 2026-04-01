'use client';

import React from 'react';
import {
  User, ShieldCheck, Settings, Mail, Phone,
  MapPin, Briefcase, Lock, ChevronRight, Fingerprint, Loader2, X, Save, Camera
} from 'lucide-react';

export interface DirectReport { name: string; role: string; status: string; }

export interface UserData {
  name:          string;
  employeeId:    string;
  role:          string;
  department:    string;
  email:         string;
  phone:         string;
  workstation:   string;
  status:        string;
  teamSize:      number;
  directReports: DirectReport[];
  profileImage?: string; 
  bannerImage?:  string; 
}

export interface EditForm {
  email:       string;
  phone:       string;
  workstation: string;
}

interface ManagerProfileUIProps {
  data:          UserData;
  showModal:     boolean;
  saving:        boolean;
  saveError:     string | null;
  editForm:      EditForm;
  onOpenModal:   () => void;
  onCloseModal:  () => void;
  onSave:        () => void;
  onEditChange:  (field: keyof EditForm, value: string) => void;
  onAvatarClick: () => void;
  onBannerClick: () => void; 
}

export const ManagerProfileUI = ({
  data, showModal, saving, saveError, editForm,
  onOpenModal, onCloseModal, onSave, onEditChange,
  onAvatarClick, onBannerClick
}: ManagerProfileUIProps) => {
  
  const formFields: (keyof EditForm)[] = ['email', 'phone', 'workstation'];
  const directReports: DirectReport[] = Array.isArray(data.directReports) ? data.directReports : [];

  return (
    <>
      <section className="flex-1 flex flex-col overflow-y-auto bg-[#020617] relative italic">

        {/* ── BANNER SECTION ────────────────────────────────────────── */}
        <div 
          onClick={onBannerClick}
          className="h-40 md:h-64 bg-slate-900 border-b border-white/5 relative shrink-0 cursor-pointer group overflow-hidden"
        >
          {data.bannerImage ? (
            <img src={data.bannerImage} className="w-full h-full object-cover" alt="Banner" />
          ) : (
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-blue-900/20" />
          )}
          
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/20">
              <Camera className="w-4 h-4 text-white" />
              <span className="text-[8px] md:text-[9px] font-black text-white tracking-[0.3em] uppercase">Update Banner</span>
            </div>
          </div>
        </div>

        {/* ── PROFILE HEADER (Positioned to overlap banner) ─────────── */}
        <div className="px-6 md:px-12 relative z-20 -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          {/* AVATAR */}
          <div 
            onClick={(e) => { e.stopPropagation(); onAvatarClick(); }}
            className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] md:rounded-[2.5rem] bg-slate-800 border-[6px] md:border-[8px] border-[#020617] flex items-center justify-center shadow-2xl relative group overflow-hidden cursor-pointer shrink-0"
          >
            {data.profileImage ? (
              <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
                <User className="w-16 h-16 md:w-24 md:h-24 text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <Camera className="w-5 h-5 md:w-6 md:h-6 text-white mb-1" />
              <span className="text-[6px] md:text-[7px] font-black text-white tracking-widest uppercase">Update Bio</span>
            </div>
          </div>

          {/* NAME & ACCESS DETAILS */}
          <div className="mb-4 md:mb-6 uppercase text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-2">
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-none italic">{data.name}</h1>
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-blue-400" />
                 <span className="text-[7px] md:text-[8px] font-black text-blue-400 tracking-widest uppercase">Level 4 Access</span>
              </div>
            </div>
            <p className="text-xs md:text-sm font-black text-slate-500 tracking-[0.2em] md:tracking-[0.3em] uppercase">{data.role} · {data.department}</p>
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
        <div className="p-6 md:p-12 mt-4 md:mt-8 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          
          {/* Biometrics Card */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-3xl">
              <h3 className="text-[9px] md:text-[10px] font-black text-blue-500 mb-6 md:mb-8 flex items-center gap-2 tracking-[0.3em] md:tracking-[0.4em] uppercase italic">
                <Fingerprint className="w-4 h-4" /> Personnel Biometrics
              </h3>
              <div className="space-y-5 md:space-y-6 uppercase">
                {[
                  { icon: Lock, label: 'Employee ID', val: data.employeeId },
                  { icon: Mail, label: 'Email Address', val: data.email },
                  { icon: Phone, label: 'Direct Line', val: data.phone },
                  { icon: MapPin, label: 'Workstation', val: data.workstation }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 rounded-lg text-slate-600 shrink-0"><item.icon className="w-4 h-4" /></div>
                    <div className="min-w-0">
                      <p className="text-[7px] md:text-[8px] font-black text-slate-600 tracking-widest uppercase">{item.label}</p>
                      <p className="text-[10px] md:text-[11px] font-black text-white truncate italic">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={onOpenModal} className="w-full mt-8 py-4 bg-white/5 border border-white/5 hover:bg-blue-600 hover:text-white text-slate-400 rounded-2xl text-[8px] md:text-[9px] font-black tracking-[0.3em] transition-all uppercase italic">
                Modify Biometric Data
              </button>
            </div>
          </div>

          {/* Direct Reports Card */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden uppercase italic">
               <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 tracking-widest text-white text-[9px] md:text-[10px] font-black">
                <span className="uppercase">Direct Reports // {data.department}</span>
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase className="w-4 h-4" />
                  <span className="uppercase">Total Strength: {data.teamSize ?? 0}</span>
                </div>
               </div>
               <div className="divide-y divide-white/5">
                {directReports.length > 0 ? directReports.map((report, i) => (
                  <div key={i} className="px-6 md:px-10 py-5 md:py-6 flex justify-between items-center hover:bg-white/5 transition-all font-black group">
                    <div className="flex items-center gap-3 md:gap-4 text-white min-w-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-[8px] md:text-[10px] uppercase shrink-0">
                        {report.name[0]}{report.name.split(' ')[1]?.[0] || ''}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] md:text-xs uppercase truncate italic">{report.name}</p>
                        <p className="text-[8px] md:text-[9px] text-slate-500 tracking-widest uppercase truncate">{report.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 shrink-0">
                      <span className={`text-[7px] md:text-[8px] tracking-widest uppercase ${report.status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {report.status === 'ACTIVE' ? 'ON-SHIFT' : 'OFF-SHIFT'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-800 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                )) : (
                  <div className="px-10 py-12 text-center text-[9px] font-black text-slate-600 tracking-widest uppercase">
                    No direct reports assigned
                  </div>
                )}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 uppercase italic">
          <div className="bg-[#0a0f1e] border border-white/10 rounded-[2rem] md:rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
             <div className="px-8 md:px-10 py-6 md:py-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h2 className="text-xs md:text-sm font-black text-white tracking-tight italic uppercase">System Settings</h2>
                <X onClick={onCloseModal} className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
             </div>
             <div className="p-8 md:p-10 space-y-6">
                {formFields.map((field) => (
                  <div key={field}>
                    <label className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-[0.2em] md:tracking-[0.3em] block mb-2 uppercase">{field.toUpperCase()}</label>
                    <input 
                      type="text" 
                      value={editForm[field]} 
                      onChange={(e) => onEditChange(field, e.target.value)}
                      className="w-full bg-slate-900 border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white text-[11px] md:text-xs font-bold outline-none focus:border-blue-500/50 transition-all uppercase italic"
                    />
                  </div>
                ))}
                {saveError && <p className="text-[8px] md:text-[9px] font-black text-red-500 tracking-widest uppercase">⚠ {saveError}</p>}
                <button 
                  onClick={onSave} 
                  disabled={saving}
                  className="w-full py-4 md:py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] tracking-widest transition-all uppercase italic shadow-lg shadow-blue-600/20"
                >
                  {saving ? 'UPDATING CORE...' : 'COMMIT CHANGES'}
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};