import React, { useState, useMemo } from 'react';
import { GRAD, phaseColor, statusColor, taskSC } from '../lib/constants.js';
import { taskDS, CUR_WEEK, weekLabel, fmtDate, addDays } from '../lib/helpers.js';
import { SidePanel, Chip, Badge, Btn, iS } from './UI.jsx';
import { TaskForm } from './Forms.jsx';
import TaskPage from './TaskPage.jsx';

export default function PriorityPage({ p, onClose, onEditPriority, data }) {
  const [comment, setComment] = useState("");
  const [link, setLink] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewTaskId, setViewTaskId] = useState(null);

  const allOwners = useMemo(() => {
    const s = new Set();
    ["owner", "design", "implementare", "review"].forEach(r => { if (p.roles?.[r]) s.add(p.roles[r]); });
    (p.tasks || []).forEach(t => s.add(t.owner));
    return [...s].filter(Boolean).sort();
  }, [p]);

  const toggleTask = async (tid) => {
    const t = (p.tasks || []).find(t => t.id === tid);
    if (!t) return;
    await data.updateTask(p.id, { ...t, status: t.status === "done" ? "todo" : "done" });
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await data.addComment('priority', p.id, comment.trim());
    setComment("");
  };

  const handleAddLink = async () => {
    if (!link.trim()) return;
    await data.addLink('priority', p.id, link.trim(), linkLabel.trim() || link.trim());
    setLink(""); setLinkLabel("");
  };

  const handleRemoveLink = async (lid) => {
    await data.removeLink('priority', p.id, lid);
  };

  const saveTask = async (taskData) => {
    if (editingTask) {
      await data.updateTask(p.id, { ...editingTask, ...taskData });
      setEditingTask(null);
    } else {
      await data.addTask(p.id, taskData);
      setAddingTask(false);
    }
  };

  const deleteTask = async () => {
    if (!confirm("Ștergi task-ul?")) return;
    await data.deleteTask(p.id, editingTask.id);
    setEditingTask(null);
  };

  const done = (p.tasks || []).filter(t => t.status === "done").length;
  const total = (p.tasks || []).length;
  const sc = statusColor[p.status] || { bg: "#EDE9FE", text: "#5B21B6" };

  const grouped = useMemo(() => {
    const m = {};
    (p.tasks || []).forEach(t => {
      const ds = taskDS(t);
      const key = ds === "overdue" ? "__overdue" : t.week;
      if (!m[key]) m[key] = [];
      m[key].push({ ...t, ds });
    });
    return m;
  }, [p.tasks]);

  const viewTask = (p.tasks || []).find(t => t.id === viewTaskId);

  return (
    <React.Fragment>
      <SidePanel onClose={onClose}>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>{p.modul}</span>
              <Badge label={p.status} color={sc} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{p.name}</h2>
          </div>
          <button onClick={onEditPriority} title="Editează" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94A3B8", alignSelf: "flex-start" }}>✎</button>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94A3B8", alignSelf: "flex-start" }}>✕</button>
        </div>

        {p.description && <div style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", marginBottom: 16, fontSize: 13, lineHeight: 1.5, color: "#374151" }}>{p.description}</div>}

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {[["Owner", p.roles?.owner], ["Design", p.roles?.design], ["Impl.", p.roles?.implementare], ["Review", p.roles?.review]].filter(([, n]) => n).map(([l, n]) => (
            <div key={l}><div style={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", color: "#94A3B8", marginBottom: 2 }}>{l}</div><Chip name={n} size={13} /></div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Task-uri ({done}/{total})</div>
          <Btn variant="primary" onClick={() => setAddingTask(true)} style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12 }}>+ Task</Btn>
        </div>
        {total > 0 && <div style={{ height: 4, borderRadius: 4, background: "#F1F5F9", overflow: "hidden", marginBottom: 12 }}><div style={{ width: `${Math.round((done / total) * 100)}%`, height: "100%", background: GRAD, borderRadius: 4, transition: "width 0.3s" }} /></div>}

        {/* Overdue */}
        {grouped["__overdue"] && <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#B91C1C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", display: "inline-block" }}></span> Restante
          </div>
          {grouped["__overdue"].map(t => (
            <div key={t.id} className="hover-card" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, marginBottom: 3, background: "#FEF2F2", border: "1px solid #FCA5A5", cursor: "pointer" }} onClick={() => setViewTaskId(t.id)}>
              <input type="checkbox" checked={false} onChange={e => { e.stopPropagation(); toggleTask(t.id); }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.35 }}>{t.name}</div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "monospace", marginTop: 1 }}>{t.owner} · {t.phase}</div>
              </div>
              <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 999, background: "#FEE2E2", color: "#B91C1C", fontFamily: "monospace", flexShrink: 0 }}>{t.hours}h</span>
            </div>
          ))}
        </div>}

        {Object.entries(grouped).filter(([k]) => k !== "__overdue").sort(([a], [b]) => a.localeCompare(b)).map(([wkk, tasks]) => {
          const mon = new Date(wkk); const isCur = wkk === CUR_WEEK;
          return (
            <div key={wkk} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: isCur ? "#BE185D" : "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{isCur ? "▸ " : ""}Săpt. {weekLabel(mon)}</div>
              {tasks.map(t => { const tc = taskSC[t.ds] || taskSC.todo; return (
                <div key={t.id} className="hover-card" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, marginBottom: 3, background: t.ds === "done" ? "#F0FDF4" : "#F8FAFC", border: "1px solid #E2E8F0", cursor: "pointer" }} onClick={() => setViewTaskId(t.id)}>
                  <input type="checkbox" checked={t.ds === "done"} onChange={e => { e.stopPropagation(); toggleTask(t.id); }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: tc.text, textDecoration: t.ds === "done" ? "line-through" : "none", lineHeight: 1.35 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "monospace", marginTop: 1 }}>{t.owner} · {t.phase}</div>
                  </div>
                  <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 999, background: tc.bg, color: tc.text, fontFamily: "monospace", flexShrink: 0 }}>{t.hours}h</span>
                </div>
              ); })}
            </div>
          );
        })}

        {total === 0 && <div style={{ padding: 24, textAlign: "center", color: "#94A3B8", fontSize: 13, background: "#F8FAFC", borderRadius: 12 }}>Niciun task. Adaugă primul task sau importă o analiză.</div>}

        {/* Atașamente */}
        <div style={{ marginTop: 20, borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Atașamente</div>
          {(p.links || []).map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#F8FAFC", borderRadius: 8, marginBottom: 4, border: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: 12 }}>🔗</span>
              <a href={l.url.startsWith("http") ? l.url : "https://" + l.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#3B82F6", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.label || l.url}</a>
              <button onClick={() => handleRemoveLink(l.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#94A3B8" }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <input value={linkLabel} onChange={e => setLinkLabel(e.target.value)} placeholder="Titlu" style={{ width: 100, ...iS, padding: "6px 10px" }} />
            <input value={link} onChange={e => setLink(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddLink()} placeholder="URL..." style={{ flex: 1, ...iS, padding: "6px 10px" }} />
            <Btn onClick={handleAddLink}>+</Btn>
          </div>
        </div>

        {/* Comentarii */}
        <div style={{ marginTop: 20, borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Comentarii</div>
          {(p.comments || []).map(c => (
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
            <Btn onClick={handleAddComment} style={{ alignSelf: "flex-end" }}>↑</Btn>
          </div>
        </div>
      </SidePanel>

      {/* Task detail overlay */}
      {viewTask && <TaskPage
        task={viewTask}
        priorityName={p.name}
        onClose={() => setViewTaskId(null)}
        onToggle={() => toggleTask(viewTask.id)}
        onEdit={() => { setEditingTask(viewTask); setViewTaskId(null); }}
        onAddComment={(text) => data.addComment('task', viewTask.id, text)}
        onAddLink={(url, label) => data.addLink('task', viewTask.id, url, label)}
      />}
      {addingTask && <TaskForm allOwners={allOwners} onSave={saveTask} onClose={() => setAddingTask(false)} />}
      {editingTask && <TaskForm task={editingTask} allOwners={allOwners} onSave={saveTask} onDelete={deleteTask} onClose={() => setEditingTask(null)} />}
    </React.Fragment>
  );
}
