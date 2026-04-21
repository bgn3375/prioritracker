import React, { useState, useEffect, useRef } from 'react';
import { GRAD } from '../lib/constants.js';
import { Overlay, Field, iS, Btn } from './UI.jsx';

export default function UserMenu({ user, displayName, onSignOut, onUpdateName }) {
  const [open, setOpen] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const Avatar = ({ size = 26, border = "2px solid rgba(255,255,255,0.5)" }) => user.avatar_url
    ? <img src={user.avatar_url} style={{ width: size, height: size, borderRadius: "50%", border }} alt="" referrerPolicy="no-referrer" />
    : <div style={{ width: size, height: size, borderRadius: "50%", background: GRAD, border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.round(size * 0.38), fontWeight: 700, color: "#fff" }}>{user.initials || "U"}</div>;

  return (
    <>
      <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            marginLeft: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "3px 12px 3px 4px",
            borderRadius: 999,
            background: open ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
          onMouseLeave={e => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
        >
          <Avatar />
          <span style={{ fontSize: 12, fontWeight: 500, color: "#fff", whiteSpace: "nowrap" }}>
            {displayName || user.display_name}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.7, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
            <path d="M2 3.5 L5 6.5 L8 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>

        {open && (
          <div className="fade-in" style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: 240,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            zIndex: 100,
          }}>
            {/* Header with avatar + info */}
            <div style={{ padding: "14px 16px", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid #F1F5F9" }}>
              <Avatar size={40} border="2px solid #EDE9FE" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {displayName || user.display_name}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div style={{ padding: "6px 0" }}>
              <MenuItem
                icon="✎"
                label="Schimbă numele afișat"
                onClick={() => { setOpen(false); setShowNameModal(true); }}
              />
              <MenuItem
                icon="↗"
                label="Deschide Google Profile"
                onClick={() => { setOpen(false); window.open('https://myaccount.google.com/', '_blank', 'noreferrer'); }}
              />
            </div>

            <div style={{ padding: "6px 0", borderTop: "1px solid #F1F5F9" }}>
              <MenuItem
                icon="⎋"
                label="Deconectare"
                danger
                onClick={() => { setOpen(false); onSignOut(); }}
              />
            </div>
          </div>
        )}
      </div>

      {showNameModal && (
        <NameModal
          currentName={displayName || user.display_name}
          onSave={async (n) => { await onUpdateName(n); setShowNameModal(false); }}
          onClose={() => setShowNameModal(false)}
        />
      )}
    </>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 16px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        color: danger ? "#B91C1C" : "#334155",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? "#FEF2F2" : "#F8FAFC"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <span style={{ width: 18, fontSize: 14, textAlign: "center", opacity: 0.8 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function NameModal({ currentName, onSave, onClose }) {
  const [name, setName] = useState(currentName || "");
  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };
  return (
    <Overlay onClose={onClose} width={400}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Schimbă numele afișat</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94A3B8" }}>✕</button>
      </div>
      <p style={{ fontSize: 12, color: "#64748B", marginBottom: 14, lineHeight: 1.5 }}>
        Cum vrei să te vadă ceilalți în board și în task-uri. Ex: "BGN", "Cristi", "Octav".
      </p>
      <Field label="Nume afișat">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && save()}
          autoFocus
          style={iS}
        />
      </Field>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <Btn onClick={onClose}>Anulează</Btn>
        <Btn variant="primary" onClick={save}>Salvează</Btn>
      </div>
    </Overlay>
  );
}
