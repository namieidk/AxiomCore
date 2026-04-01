import { Theme } from "./Types";

/**
 * themes: Record<"dark" | "light", Theme>
 * * This ensures that the 'themes' object has exactly two keys: 'dark' and 'light',
 * and each value strictly adheres to the 'Theme' interface defined in your Types file.
 */
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