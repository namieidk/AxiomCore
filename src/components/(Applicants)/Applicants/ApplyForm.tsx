"use client";
import React, { RefObject } from "react";
import {
  User, Mail, Phone, FileText, ChevronLeft, 
  CheckCircle2, X, Loader2, AlertCircle, Upload
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormDataState {
  firstName: string;
  lastName: string;
  age: string;
  sex: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  resume: File | null;
  coverLetter: string;
}

interface ApplyFormUIProps {
  form: FormDataState;
  errors: Record<string, string>;
  loading: boolean;
  submitted: boolean;
  refCode: string;
  progress: number;
  jobTitle: string;
  dragOver: boolean;
  fileRef: RefObject<HTMLInputElement | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  handlers: {
    handleChange: (key: keyof FormDataState, value: string | File | null) => void;
    handleFile: (file: File | null) => void;
    handleSubmit: () => void;
    setDragOver: (val: boolean) => void;
    onBack: () => void;
  };
}

const applyStyles = `
  .ap-page { min-height: 100vh; font-family: 'Outfit', sans-serif; padding: 0 0 4rem; transition: background .3s; }
  .ap-header { position: sticky; top: 0; z-index: 100; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
  .ap-back-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .45rem .75rem; border-radius: 9px; font-size: .75rem; cursor: pointer; transition: 0.2s; background: transparent; }
  .ap-header-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 0.9rem; display: none; }
  .ap-job-pill { display: inline-flex; align-items: center; padding: .35rem .75rem; border-radius: 999px; font-size: .65rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
  
  .ap-progress-wrap { max-width: 780px; margin: 0 auto; padding: 1.5rem 1.25rem 0; }
  .ap-progress-bar { height: 6px; border-radius: 999px; overflow: hidden; margin-bottom: .5rem; }
  .ap-progress-fill { height: 100%; transition: width .4s ease; }
  
  .ap-card { max-width: 780px; margin: 1rem 1.25rem; border-radius: 20px; padding: 1.5rem; transition: 0.3s; }
  .ap-section-title { font-weight: 800; font-size: 1.1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: .75rem; }
  .ap-section-icon { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  
  .ap-grid-2 { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  .ap-grid-3 { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  
  .ap-field { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1rem; }
  .ap-label { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .ap-input, .ap-select, .ap-textarea { padding: .75rem 1rem; border-radius: 12px; font-size: .9rem; outline: none; width: 100%; transition: 0.2s; }
  .ap-textarea { min-height: 100px; resize: vertical; }
  
  .ap-upload-zone { border-radius: 16px; padding: 2rem 1rem; text-align: center; cursor: pointer; border: 2px dashed; transition: 0.2s; }
  .ap-upload-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
  .ap-file-chosen { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 12px; margin-top: 1rem; border: 1px solid; }
  
  .ap-btn-submit { width: 100%; border: none; padding: 1rem; border-radius: 12px; font-weight: 800; font-size: 0.85rem; letter-spacing: 1px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: 0.2s; }
  .ap-error-msg { font-size: .7rem; color: #ef4444; margin-top: 0.25rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; }

  @media (min-width: 640px) {
    .ap-header { padding: 1rem 2rem; }
    .ap-header-title { display: block; font-size: 1.1rem; }
    .ap-job-pill { font-size: .75rem; max-width: none; }
    .ap-card { margin: 1.5rem auto 0; padding: 2.5rem; border-radius: 24px; }
    .ap-grid-2 { grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    .ap-grid-3 { grid-template-columns: 1fr 1fr 1fr; gap: 1.2rem; }
    .ap-page { padding: 0 0 6rem; }
    .ap-btn-submit { font-size: 0.9rem; }
  }
`;

export const ApplyFormUI: React.FC<ApplyFormUIProps> = (props) => {
  const { form, errors, loading, submitted, refCode, progress, jobTitle, dragOver, fileRef, t, handlers } = props;

  if (submitted) {
    return (
      <div className="ap-page" style={{ background: t.bg, color: t.text }}>
        <style dangerouslySetInnerHTML={{ __html: applyStyles }} />
        <div className="ap-success" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div className="ap-success-icon" style={{ background: t.accentSoft, width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <CheckCircle2 size={32} style={{ color: t.accent }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Success!</h1>
          <p style={{ color: t.muted, maxWidth: '400px', margin: '0 auto 2rem', fontSize: '0.9rem' }}>Application for <b>{jobTitle}</b> received.</p>
          <div style={{ background: t.surface, padding: '0.75rem 1.5rem', borderRadius: '99px', display: 'inline-block', border: `1px solid ${t.accentBorder}`, color: t.accent, fontWeight: 700, letterSpacing: '1px', fontSize: '0.8rem', marginBottom: '2rem' }}>
            REF: {refCode}
          </div>
          <br />
          <button className="ap-btn-submit" style={{ background: t.accent, maxWidth: '300px', margin: '0 auto', color: '#fff' }} onClick={handlers.onBack}>
            Return to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-page" style={{ background: t.bg, color: t.text }}>
      <style dangerouslySetInnerHTML={{ __html: applyStyles }} />

      <div className="ap-header" style={{ background: t.navBg }}>
        <button type="button" className="ap-back-btn" style={{ border: `1px solid ${t.border}`, color: t.muted }} onClick={handlers.onBack}>
          <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
        </button>
        <div className="ap-header-title" style={{ color: t.text }}>Axiom Recruitment</div>
        <div className="ap-job-pill" style={{ background: t.accentSoft, color: t.accent, border: `1px solid ${t.accentBorder}` }}>
          {jobTitle}
        </div>
      </div>

      <div className="ap-progress-wrap">
        <div className="ap-progress-bar" style={{ background: t.surface2 }}>
          <div className="ap-progress-fill" style={{ width: `${progress}%`, background: t.accent }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.65rem', color: t.muted, fontWeight: 800 }}>{progress}% COMPLETE</div>
      </div>

      <div className="ap-card" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
        <h3 className="ap-section-title" style={{ color: t.text }}>
           <div className="ap-section-icon" style={{ background: t.accentSoft, color: t.accent }}><User size={16}/></div>
           Personal Information
        </h3>
        
        <div className="ap-grid-2">
          <div className="ap-field">
            <label className="ap-label">First Name</label>
            <input className="ap-input" placeholder="e.g. John" style={{ background: t.surface2, border: `1px solid ${errors.firstName ? '#ef4444' : t.border}`, color: t.text }} value={form.firstName} onChange={(e) => handlers.handleChange("firstName", e.target.value)} />
            {errors.firstName && <span className="ap-error-msg">{errors.firstName}</span>}
          </div>
          <div className="ap-field">
            <label className="ap-label">Last Name</label>
            <input className="ap-input" placeholder="e.g. Doe" style={{ background: t.surface2, border: `1px solid ${errors.lastName ? '#ef4444' : t.border}`, color: t.text }} value={form.lastName} onChange={(e) => handlers.handleChange("lastName", e.target.value)} />
            {errors.lastName && <span className="ap-error-msg">{errors.lastName}</span>}
          </div>
        </div>

        <div className="ap-grid-2">
          <div className="ap-field">
            <label className="ap-label">Age</label>
            <input type="number" className="ap-input" style={{ background: t.surface2, border: `1px solid ${errors.age ? '#ef4444' : t.border}`, color: t.text }} value={form.age} onChange={(e) => handlers.handleChange("age", e.target.value)} />
            {errors.age && <span className="ap-error-msg">{errors.age}</span>}
          </div>
          <div className="ap-field">
            <label className="ap-label">Sex</label>
            <select className="ap-select" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: form.sex ? t.text : t.muted }} value={form.sex} onChange={(e) => handlers.handleChange("sex", e.target.value)}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ap-card" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
        <h3 className="ap-section-title" style={{ color: t.text }}>
           <div className="ap-section-icon" style={{ background: t.accentSoft, color: t.accent }}><Mail size={16}/></div>
           Contact & Address
        </h3>
        <div className="ap-grid-2">
          <div className="ap-field">
            <label className="ap-label">Email Address</label>
            <input type="email" className="ap-input" placeholder="name@email.com" style={{ background: t.surface2, border: `1px solid ${errors.email ? '#ef4444' : t.border}`, color: t.text }} value={form.email} onChange={(e) => handlers.handleChange("email", e.target.value)} />
            {errors.email && <span className="ap-error-msg">{errors.email}</span>}
          </div>
          <div className="ap-field">
            <label className="ap-label">Phone Number</label>
            <input className="ap-input" placeholder="0912 345 6789" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.phone} onChange={(e) => handlers.handleChange("phone", e.target.value)} />
          </div>
        </div>
        <div className="ap-field">
          <label className="ap-label">Street Address</label>
          <input className="ap-input" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.address} onChange={(e) => handlers.handleChange("address", e.target.value)} />
        </div>
        <div className="ap-grid-3">
          <input className="ap-input" placeholder="City" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.city} onChange={(e) => handlers.handleChange("city", e.target.value)} />
          <input className="ap-input" placeholder="Province" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.province} onChange={(e) => handlers.handleChange("province", e.target.value)} />
          <input className="ap-input" placeholder="Zip" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.zipCode} onChange={(e) => handlers.handleChange("zipCode", e.target.value)} />
        </div>
      </div>

      <div className="ap-card" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
        <h3 className="ap-section-title" style={{ color: t.text }}>
           <div className="ap-section-icon" style={{ background: t.accentSoft, color: t.accent }}><FileText size={16}/></div>
           Documents
        </h3>
        
        <div 
          className="ap-upload-zone"
          style={{ 
            background: dragOver ? t.accentSoft : t.surface2, 
            borderColor: errors.resume ? '#ef4444' : (dragOver ? t.accent : t.border),
            color: t.muted 
          }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); handlers.setDragOver(true); }}
          onDragLeave={() => handlers.setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            handlers.setDragOver(false);
            if (e.dataTransfer.files?.[0]) handlers.handleFile(e.dataTransfer.files[0]);
          }}
        >
          <div className="ap-upload-icon" style={{ background: t.accentSoft, color: t.accent }}><Upload size={20}/></div>
          <div style={{ color: t.text, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Upload Resume</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>PDF or Word (Max 5MB)</div>
          <input ref={fileRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => handlers.handleFile(e.target.files?.[0] || null)} />
        </div>

        {form.resume && (
          <div className="ap-file-chosen" style={{ background: t.accentSoft, borderColor: t.accentBorder }}>
            <FileText size={18} style={{ color: t.accent }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.resume.name}</div>
            </div>
            <X size={16} style={{ cursor: 'pointer', color: t.muted }} onClick={(e) => { e.stopPropagation(); handlers.handleChange("resume", null); }} />
          </div>
        )}
        {errors.resume && <div className="ap-error-msg"><AlertCircle size={12}/> {errors.resume}</div>}

        <div className="ap-field" style={{ marginTop: '1.5rem' }}>
          <label className="ap-label">Cover Letter (Optional)</label>
          <textarea className="ap-textarea" placeholder="Tell us why you are a great fit..." style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.coverLetter} onChange={(e) => handlers.handleChange("coverLetter", e.target.value)} />
        </div>

        {errors.submit && <div className="ap-error-msg" style={{ justifyContent: 'center', marginBottom: '1rem', textAlign: 'center' }}>{errors.submit}</div>}

        <button 
          type="button" 
          className="ap-btn-submit" 
          style={{ background: t.accent, boxShadow: `0 8px 20px ${t.accentGlow}`, color: '#fff' }} 
          onClick={handlers.handleSubmit} 
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <>SUBMIT APPLICATION <CheckCircle2 size={18} /></>}
        </button>
      </div>
    </div>
  );
};