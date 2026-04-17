import React from 'react';
import { GRAD } from '../lib/constants.js';
import { ownerColor } from '../lib/helpers.js';

export const iS = { width: "100%", padding: "8px 12px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13, outline: "none", background: "#F8FAFC" };
export const selS = { ...iS, cursor: "pointer" };

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
    </div>
  );
}

export function Chip({ name, size }) {
  const c = ownerColor(name);
  return <span style={{ fontSize: size || 12, padding: "2px 8px", borderRadius: 999, background: c.bg, color: c.text, fontWeight: 500, whiteSpace: "nowrap" }}>{name}</span>;
}

export function Badge({ label, color }) {
  return <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: color.bg, color: color.text, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}

export function Btn({ children, onClick, variant, style: sx }) {
  const base = { padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "opacity 0.15s", ...sx };
  if (variant === "primary") Object.assign(base, { background: GRAD, color: "#fff" });
  else if (variant === "danger") Object.assign(base, { background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FCA5A5" });
  else Object.assign(base, { background: "#F1F5F9", color: "#374151", border: "1px solid #E2E8F0" });
  return <button onClick={onClick} style={base} onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>{children}</button>;
}

export function Overlay({ children, onClose, width }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div className="fade-in" style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", width: width || 460, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export function SidePanel({ children, onClose, zIndex }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: zIndex || 1000, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div className="slide-in" style={{ width: 540, height: "100vh", background: "#fff", overflowY: "auto", padding: "24px 22px", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}
