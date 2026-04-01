"use client";
import React, { useState } from "react";
import { MapPin, Clock, Briefcase, ChevronRight, CalendarDays, Filter } from "lucide-react";
import { Theme, Job, DeptIcon, jobs, allDepartments } from "./Types";

interface JobsSectionProps {
  t: Theme;
  onOpenDetails: (job: Job) => void;
}

export default function JobsSection({ t, onOpenDetails }: JobsSectionProps) {
  const [filterDept, setFilterDept] = useState<string>("All");

  const filtered: Job[] =
    filterDept === "All" ? jobs : jobs.filter((j) => j.department === filterDept);

  return (
    <section className="nx-wrap" id="jobs" style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="nx-eyebrow fu0" style={{ color: t.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
          Open Positions
        </div>
        <h2 className="nx-h2 fu1" style={{ color: t.text, fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
          Find Your Role
        </h2>
        <p className="nx-sub fu2" style={{ color: t.muted, maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.6 }}>
          We&apos;re actively hiring across all departments. Filter by team and apply directly below.
        </p>
      </div>

      {/* Filter Chips - Flex wrap for mobile accessibility */}
      <div className="nx-filter fu3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <span style={{ color: t.muted, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginRight: '0.5rem', fontWeight: 500 }}>
          <Filter size={14} /> Filter:
        </span>
        {allDepartments.map((d) => {
          const isActive = filterDept === d;
          return (
            <button
              key={d}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? t.accentSoft : 'transparent',
                border: `1px solid ${isActive ? t.accentBorder : t.border}`,
                color: isActive ? t.accent : t.muted,
              }}
              onClick={() => setFilterDept(d)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = t.accentBorder;
                  e.currentTarget.style.color = t.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = t.border;
                  e.currentTarget.style.color = t.muted;
                }
              }}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Job Cards Grid - Uses the nx-jobs class from globalStyles */}
      <div className="nx-jobs">
        {filtered.length > 0 ? (
          filtered.map((job) => (
            <JobCard key={job.id} job={job} t={t} onOpen={onOpenDetails} />
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '4rem', color: t.muted }}>
            No open roles found in this department. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Job Card ────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  t: Theme;
  onOpen: (job: Job) => void;
}

function JobCard({ job, t, onOpen }: JobCardProps) {
  return (
    <div
      className="nx-card"
      style={{ 
        background: t.surface, 
        border: `1px solid ${t.border}`,
        borderRadius: '20px',
        padding: '1.75rem',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => onOpen(job)}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-5px)';
        el.style.background = t.surface2;
        el.style.borderColor = t.accentBorder;
        el.style.boxShadow = `0 20px 40px ${t.shadow}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.background = t.surface;
        el.style.borderColor = t.border;
        el.style.boxShadow = 'none';
      }}
    >
      {/* Top Row: Icon & Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ 
          width: '42px', 
          height: '42px', 
          borderRadius: '12px', 
          background: t.accentSoft, 
          color: t.accent, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: `1px solid ${t.accentBorder}`
        }}>
          <DeptIcon dept={job.department} size={20} />
        </div>
        <span style={{ 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          padding: '0.35rem 0.75rem', 
          borderRadius: '6px', 
          background: `${job.badgeColor}15`, 
          color: job.badgeColor,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          border: `1px solid ${job.badgeColor}30`
        }}>
          {job.badge}
        </span>
      </div>

      {/* Title & Dept */}
      <h3 style={{ color: t.text, fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{job.title}</h3>
      <div style={{ color: t.muted, fontSize: '0.85rem', marginBottom: '1.25rem' }}>{job.department}</div>

      {/* Info Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { icon: <MapPin size={12} />, label: job.location },
          { icon: <Clock size={12} />, label: job.shift },
          { icon: <Briefcase size={12} />, label: job.type }
        ].map((tag, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: t.tagBg, 
            padding: '0.4rem 0.75rem', 
            borderRadius: '8px', 
            fontSize: '0.75rem', 
            color: t.muted,
            border: `1px solid ${t.border}`
          }}>
            {tag.icon} {tag.label}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div style={{ 
        marginTop: 'auto', 
        paddingTop: '1.25rem', 
        borderTop: `1px solid ${t.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: t.muted }}>
          <CalendarDays size={14} style={{ color: t.accentWarm }} />
          <span><strong style={{ color: t.text }}>{job.slots}</strong> slots open</span>
        </div>
        <div style={{ color: t.accent, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
          Details <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}