"use client";
import React from "react";
import { 
  Settings, 
  Monitor, 
  Wallet, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  ClipboardList,
  Headset
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Job {
  id: number;
  title: string;
  department: string;
  type: string;
  shift: string;
  location: string;
  slots: number;
  description: string;
  requirements: string[];
  badge: string;
  badgeColor: string;
}

/** * This interface defines what ONE theme looks like.
 * The error happened because TS thought 'dark' was a required property INSIDE the theme,
 * rather than a key in the themes object.
 */
export interface Theme {
  isDark: boolean; // Renamed from 'dark' to avoid confusion with the themes.dark key
  accent: string;
  accentSoft: string;
  accentBorder: string;
  accentGlow: string;
  accentWarm: string;
  text: string;
  muted: string;
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  tagBg: string;
  shadow: string;
  heroBg: string;
  navBg: string;
  navBorder: string;
  chipBg: string;
  chipBorder: string;
  orb1: string;
  orb2: string;
  gridline: string;
}

// ─── THEME CONFIGURATION ──────────────────────────────────────────────────────

export const themes: Record<"dark" | "light", Theme> = {
  dark: {
    isDark: true,
    bg: "#020617",
    surface: "#0f172a",
    surface2: "#1e293b",
    text: "#f8fafc",
    muted: "#94a3b8",
    border: "rgba(255,255,255,0.06)",
    accent: "#6366f1",
    accentGlow: "rgba(99,102,241,0.35)",
    accentSoft: "rgba(99,102,241,0.12)",
    accentBorder: "rgba(99,102,241,0.4)",
    accentWarm: "#f59e0b",
    heroBg: "#020617",
    navBg: "rgba(2,6,23,0.8)",
    navBorder: "rgba(255,255,255,0.08)",
    orb1: "#1e1b4b",
    orb2: "#312e81",
    gridline: "rgba(255,255,255,0.03)",
    tagBg: "rgba(255,255,255,0.03)",
    chipBg: "rgba(99,102,241,0.08)",
    chipBorder: "rgba(99,102,241,0.2)",
    shadow: "rgba(0,0,0,0.4)",
  },
  light: {
    isDark: false,
    bg: "#f8fafc",
    surface: "#ffffff",
    surface2: "#f1f5f9",
    text: "#0f172a",
    muted: "#64748b",
    border: "rgba(0,0,0,0.08)",
    accent: "#4f46e5",
    accentGlow: "rgba(79,70,229,0.2)",
    accentSoft: "rgba(79,70,229,0.08)",
    accentBorder: "rgba(79,70,229,0.3)",
    accentWarm: "#d97706",
    heroBg: "#ffffff",
    navBg: "rgba(255,255,255,0.8)",
    navBorder: "rgba(0,0,0,0.05)",
    orb1: "#e0e7ff",
    orb2: "#f5f3ff",
    gridline: "rgba(0,0,0,0.02)",
    tagBg: "#f1f5f9",
    chipBg: "rgba(79,70,229,0.05)",
    chipBorder: "rgba(79,70,229,0.15)",
    shadow: "rgba(0,0,0,0.05)",
  }
};

// ─── JOB DATA ─────────────────────────────────────────────────────────────────

export const jobs: Job[] = [
  {
    id: 1,
    title: "Operations Manager",
    department: "Operations",
    type: "Full-time",
    shift: "Day Shift (8AM - 5PM)",
    location: "Davao City",
    slots: 2,
    description: "Oversee daily business operations, improve organizational processes, and work to improve quality, productivity, and efficiency.",
    requirements: [
      "Bachelor's degree in Business Administration or related field",
      "5+ years of experience in operations management",
      "Strong budget management and forecasting skills",
      "Excellent leadership and conflict resolution abilities",
    ],
    badge: "Urgent",
    badgeColor: "#ef4444",
  },
  {
    id: 2,
    title: "Senior IT Systems Administrator",
    department: "IT Service",
    type: "Full-time",
    shift: "Night Shift (10PM - 6AM)",
    location: "Davao City",
    slots: 3,
    description: "Maintain, upgrade, and manage our software, hardware, and networks.",
    requirements: [
      "BS in Computer Science, Information Technology or related",
      "Experience with cloud services (AWS/Azure) and virtualization",
      "Strong knowledge of system security and data backup/recovery",
      "Relevant certifications (MCSE, CCNA) are a major plus",
    ],
    badge: "Night Shift",
    badgeColor: "#6366f1",
  },
  {
    id: 3,
    title: "Financial Analyst",
    department: "Finance",
    type: "Full-time",
    shift: "Day Shift (9AM - 6PM)",
    location: "Davao City",
    slots: 4,
    description: "Consolidate and analyze financial data, taking into account company’s goals and financial standing.",
    requirements: [
      "Degree in Finance, Accounting, or Economics",
      "Proven working experience as a Financial Analyst",
      "Proficient in spreadsheets, databases, and financial software",
    ],
    badge: "New Role",
    badgeColor: "#10b981",
  },
  {
    id: 4,
    title: "Service Desk Lead",
    department: "IT Service",
    type: "Full-time",
    shift: "Shifting",
    location: "Davao City",
    slots: 5,
    description: "Supervise the IT service desk team and ensure high-quality technical support.",
    requirements: [
      "College Graduate in an IT-related field",
      "At least 3 years of experience in technical support",
      "Familiarity with ITIL foundations",
    ],
    badge: "IT Service",
    badgeColor: "#f59e0b",
  },
  {
    id: 5,
    title: "Accounts Payable Specialist",
    department: "Finance",
    type: "Full-time",
    shift: "Day Shift (8AM - 5PM)",
    location: "Davao City",
    slots: 2,
    description: "Process and monitor payments and expenditures.",
    requirements: [
      "BS degree in Accounting or Finance",
      "High degree of accuracy and attention to detail",
      "Experience with ERP systems (SAP or Oracle)",
    ],
    badge: "Finance",
    badgeColor: "#8b5cf6",
  },
];

export const allDepartments: string[] = ["All", "Operations", "IT Service", "Finance"];

// ─── DEPT ICON HELPER ─────────────────────────────────────────────────────────

export function DeptIcon({ dept, size = 18 }: { dept: string; size?: number }) {
  const props = { size, strokeWidth: 1.75 };
  
  switch (dept) {
    case "Operations": return <Settings {...props} />;
    case "IT Service": return <Monitor {...props} />;
    case "Finance": return <Wallet {...props} />;
    case "HR / Admin": return <ClipboardList {...props} />;
    case "Quality Assurance": return <ShieldCheck {...props} />;
    case "Customer Support": return <Headset {...props} />;
    default: return <Briefcase {...props} />;
  }
}