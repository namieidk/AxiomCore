'use client';

import React from 'react';
import {
  User, Mail, Phone, MapPin,
  ShieldCheck, Fingerprint, Camera, Edit3, Award, Loader2, Lock, X,
  CreditCard
} from 'lucide-react';

// ── TYPES & INTERFACES ────────────────────────────────────────────────────────

export interface EmployeeData {
  name: string;
  employeeId: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  workstation: string;
  profileImage?: string;
  bannerImage?: string;
  sssId?: string;
  philHealthId?: string;
  pagIbigId?: string;
}

export interface EditForm {
  email: string;
  phone: string;
  workstation: string;
  sssId: string;
  philHealthId: string;
  pagIbigId: string;
}

interface EmployeeProfileUIProps {
  data: EmployeeData;
  showModal: boolean;
  saving: boolean;
  editForm: EditForm;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSave: () => void;
  onEditChange: (field: keyof EditForm, value: string) => void;
  onAvatarClick: () => void;
  onBannerClick: () => void;
}

interface FieldConfig {
  key: keyof EditForm;
  label: string;
}

const CONTACT_FIELDS: FieldConfig[] = [
  { key: 'email',       label: 'CONTACT EMAIL'  },
  { key: 'phone',       label: 'DIRECT LINE'    },
  { key: 'workstation', label: 'WORKSTATION'    },
];

const GOVID_FIELDS: FieldConfig[] = [
  { key: 'sssId',        label: 'SSS ID'        },
  { key: 'philHealthId', label: 'PHILHEALTH ID' },
  { key: 'pagIbigId',    label: 'PAG-IBIG ID'   },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export const EmployeeProfileUI = ({
  data, showModal, saving, editForm,
  onOpenModal, onCloseModal, onSave, onEditChange,
  onAvatarClick, onBannerClick,
}: EmployeeProfileUIProps) => {

  return (
    <section className="flex-1 flex flex-col overflow-y-auto bg-[#020617] uppercase italic font-black scrollbar-hide">

      {/* ── BANNER ── */}
      <div
        onClick={onBannerClick}
        className="h-48 lg:h-64 bg-slate-900 border-b border-white/5 relative shrink-0 cursor-pointer group overflow-hidden"
      >
        {data.bannerImage ? (
          <img src={data.bannerImage} className="w-full h-full object-cover opacity-60" alt="Banner" />
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-indigo-900" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <Camera className="w-4 h-4 text-white" />
            <span className="text-[9px] font-black text-white tracking-[0.3em]">Update Banner</span>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="px-6 lg:px-12 -mt-20 lg:-mt-24 relative z-20 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 lg:gap-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 lg:gap-10 text-center lg:text-left w-full lg:w-auto">

          {/* Avatar */}
          <div className="relative group shrink-0">
            <div
              onClick={onAvatarClick}
              className="w-40 h-40 lg:w-48 lg:h-48 rounded-[2.5rem] lg:rounded-[3.5rem] bg-slate-800 border-[6px] lg:border-[8px] border-[#020617] flex items-center justify-center overflow-hidden cursor-pointer shadow-2xl transition-transform hover:scale-105"
            >
              {data.profileImage
                ? <img src={data.profileImage} className="w-full h-full object-cover" alt="Avatar" />
                : <User className="w-16 h-16 lg:w-24 lg:h-24 text-slate-600" />}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            {saving && (
              <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] lg:rounded-[3.5rem] flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" />
              </div>
            )}
          </div>

          <div className="mb-2 lg:mb-6 space-y-3 w-full">
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-3 lg:gap-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none break-words uppercase italic">
                {data.name}
              </h1>
              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center gap-2 shrink-0">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span className="text-[7px] lg:text-[8px] font-black text-indigo-400 tracking-widest uppercase">Verified Personnel</span>
              </div>
            </div>
            <p className="text-xs lg:text-sm font-black text-slate-500 tracking-[0.3em] uppercase">
              {data.role} <span className="text-indigo-900 mx-2">/</span> {data.department}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          className="mb-8 flex items-center justify-center gap-2 w-full lg:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] lg:text-[10px] font-black tracking-widest hover:bg-indigo-600 transition-all active:scale-95 italic"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      {/* ── INFO GRID ── */}
      <div className="p-6 lg:p-12 max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        
        <InfoCard title="Personnel Dossier" icon={<Fingerprint className="w-4 h-4" />} color="text-indigo-500">
            <InfoRow label="Email" val={data.email} icon={<Mail className="w-4 h-4 text-indigo-500" />} />
            <InfoRow label="Phone" val={data.phone} icon={<Phone className="w-4 h-4 text-indigo-500" />} />
            <InfoRow label="Workstation" val={data.workstation} icon={<MapPin className="w-4 h-4 text-indigo-500" />} />
        </InfoCard>

        <InfoCard title="System Identity" icon={<Award className="w-4 h-4" />} color="text-indigo-400">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[8px] lg:text-[9px] font-black text-slate-600 tracking-[0.2em] uppercase">Serial Number</p>
                <p className="text-xs lg:text-sm font-black text-white tracking-widest italic">{data.employeeId}</p>
              </div>
              <Lock className="w-4 h-4 text-slate-700" />
            </div>
            <div className="space-y-1">
              <p className="text-[8px] lg:text-[9px] font-black text-slate-600 tracking-[0.2em] uppercase">Status</p>
              <p className="text-xs lg:text-sm font-black text-emerald-500 tracking-widest flex items-center gap-3 italic uppercase">
                <ShieldCheck className="w-4 h-4" /> Active Personnel
              </p>
            </div>
        </InfoCard>

        <InfoCard title="Government IDs" icon={<CreditCard className="w-4 h-4" />} color="text-amber-500" className="md:col-span-2 lg:col-span-1">
            <InfoRow label="SSS ID" val={data.sssId || 'NOT CONFIGURED'} icon={<CreditCard className="w-4 h-4 text-amber-500" />} highlight={!!data.sssId} />
            <InfoRow label="PhilHealth ID" val={data.philHealthId || 'NOT CONFIGURED'} icon={<CreditCard className="w-4 h-4 text-amber-500" />} highlight={!!data.philHealthId} />
            <InfoRow label="Pag-IBIG ID" val={data.pagIbigId || 'NOT CONFIGURED'} icon={<CreditCard className="w-4 h-4 text-amber-500" />} highlight={!!data.pagIbigId} />
        </InfoCard>
      </div>

      {/* ── EDIT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-6 overflow-hidden">
          <div className="bg-[#0a0f1e] border border-white/10 rounded-[2rem] lg:rounded-[3rem] w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
            
            <div className="px-8 py-6 lg:px-10 lg:py-8 border-b border-white/5 flex justify-between items-center shrink-0">
              <h2 className="text-xs lg:text-sm font-black text-white uppercase italic tracking-widest">Edit Dossier</h2>
              <button onClick={onCloseModal} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-8 lg:p-10 space-y-8 overflow-y-auto scrollbar-hide">
              <ModalSection title="Contact Information" color="text-indigo-500" fields={CONTACT_FIELDS} editForm={editForm} onChange={onEditChange} />
              <ModalSection title="Government IDs" color="text-amber-500" fields={GOVID_FIELDS} editForm={editForm} onChange={onEditChange} isId />

              <button
                onClick={onSave}
                disabled={saving}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] lg:text-[11px] tracking-[0.3em] transition-all active:scale-95 disabled:opacity-50 italic uppercase shadow-xl shadow-indigo-500/20"
              >
                {saving ? 'Syncing...' : 'Commit Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// ── HELPER COMPONENTS (STRICTLY TYPED) ────────────────────────────────────────

interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  className?: string;
}

const InfoCard = ({ title, icon, color, children, className = "" }: InfoCardProps) => (
  <div className={`space-y-6 ${className}`}>
    <h3 className={`text-[10px] lg:text-xs font-black ${color} tracking-[0.4em] px-4 flex items-center gap-3 uppercase italic`}>
      {icon} {title}
    </h3>
    <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-10 space-y-8 backdrop-blur-sm">
      {children}
    </div>
  </div>
);

interface InfoRowProps {
  label: string;
  val: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const InfoRow = ({ label, val, icon, highlight = true }: InfoRowProps) => (
  <div className="space-y-1.5">
    <p className="text-[8px] lg:text-[9px] font-black text-slate-600 tracking-[0.2em] uppercase">{label}</p>
    <p className={`text-[11px] lg:text-xs font-black tracking-widest flex items-center gap-3 italic break-all ${highlight ? 'text-white' : 'text-slate-700'}`}>
      <span className="shrink-0">{icon}</span> {val}
    </p>
  </div>
);

interface ModalSectionProps {
  title: string;
  color: string;
  fields: FieldConfig[];
  editForm: EditForm;
  onChange: (field: keyof EditForm, value: string) => void;
  isId?: boolean;
}

const ModalSection = ({ title, color, fields, editForm, onChange, isId = false }: ModalSectionProps) => (
  <div className="space-y-5">
    <p className={`text-[8px] lg:text-[9px] font-black ${color} tracking-[0.4em] uppercase italic`}>{title}</p>
    {fields.map(({ key, label }) => (
      <div key={key}>
        <label className="text-[8px] lg:text-[9px] font-black text-slate-500 tracking-[0.3em] block mb-2 uppercase">{label}</label>
        <input
          type="text"
          value={editForm[key]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(key, e.target.value)}
          placeholder={isId ? "ENTER ID NUMBER" : ""}
          className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white text-[11px] lg:text-xs font-black outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800 uppercase italic"
        />
      </div>
    ))}
  </div>
);