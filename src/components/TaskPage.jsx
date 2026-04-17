import React, { useState } from 'react';
import { GRAD, phaseColor, taskSC } from '../lib/constants.js';
import { taskDS } from '../lib/helpers.js';
import { SidePanel, Chip, Badge, Btn, iS } from './UI.jsx';

export default function TaskPage({ task, priorityName, onClose, onToggle, onEdit, onAddComment, onAddLink }) {
  const ds = taskDS(task);
  const tc = taskSC[ds] || taskSC.todo;
  const pc = phaseColor[task.phase] || { bg: "#F1F5F9", text: "#475569" };
  const [comment, setComment] = useState("");
  const [link, setLink] = useState("");

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onAddComment(comment.trim());
    setComment("");
  };

  const handleAddLink = () => {
    if (!link.trim()) return;
    onAddLink(link.trim(), link.trim());
    setLink("");
  };

  return (
    <SidePanel onClose={onClose} zIndex={1050}>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#94A3B8" }}>â Ãnapoi</button>
        <div style={{ flex: 1 }} />
        <button onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#94A3B8" }}>â EditeazÄ</button>
      </div>
      <div style={{ borderLeft: `3px solid ${tc.border}`, paddingLeft: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>{priorityName}</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, color: ds === "done" ? "#94A3B8" : "#0F172A", textDecoration: ds === "done" ? "line-through" : "none" }}>{task.name}</h2>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <Chip name={task.owner} /> <Badge label={task.phase} color={pc} />
        {ds === "overdue" && <Badge label="RESTANT" color={taskSC.overdue} />}
        <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace", marginLeft: "auto" }}>{task.hours}h</span>
      </div>
      {task.description && <div style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", marginBottom: 16, fontSize: 13, lineHeight: 1.5, color: "#374151" }}>{task.description}</div>}

      <button onClick={onToggle} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", cursor: "pointer", background: ds === "done" ? "#F0FDF4" : GRAD, color: ds === "done" ? "#15803D" : "#fff", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
        {ds === "done" ? "â Done â click pentru a anula" : "MarcheazÄ Done"}
      </button>

      {/* Links */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>AtaÈamente</div>
        {(task.links || []).map(l => (
          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#F8FAFC", borderRadius: 8, marginBottom: 4, border: "1px solid #E2E8F0" }}>
            <span style={{ fontSize: 12 }}>ð</span>
            <a href={l.url.startsWith("http") ? l.url : "https://" + l.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#3B82F6", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.label || l.url}</a>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <input value={link} onChange={e => setLink(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddLink()} placeholder="AdaugÄ link..." style={{ flex: 1, ...iS, padding: "6px 10px" }} />
          <Btn onClick={handleAddLink}>+</Btn>
        </div>
      </div>

      {/* Comments */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Comentarii</div>
        {(task.comments || []).map(c => (
          <div key={c.id} style={{ padding: "9px 12px", background: "#F8FAFC", borderRadius: 8, marginBottom: 6, border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{c.author}</span>
              <span style={{ fontSize: 10, color: "#94A3B8" }}>{new Date(c.time).toLocaleString("ro-RO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{c.text}</div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <textarea value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleAddComment())} placeholder="Comentariu..." rows={2} style={{ flex: 1, ...iS, padding: "6px 10px", resize: "none" }} />
          <Btn onClick={handleAddComment} style={{ alignSelf: "flex-end" }}>â</Btn>
        </div>
      </div>
    </SidePanel>
  );
}
