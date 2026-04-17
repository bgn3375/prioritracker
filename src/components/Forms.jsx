import React, { useState, useMemo, useRef } from 'react';
import { MODULES, STATUSES, ALL_PHASES } from '../lib/constants.js';
import { CUR_WEEK, genWeekOptions } from '../lib/helpers.js';
import { Field, iS, selS, Btn, Overlay } from './UI.jsx';

export function PriorityForm({ priority, allOwners, onSave, onDelete, onClose }) {
  const isEdit = !!priority;
  const [name, setName] = useState(priority?.name || "");
  const [modul, setModul] = useState(priority?.modul || MODULES[0]);
  const [status, setStatus] = useState(priority?.status || "Analiză");
  const [desc, setDesc] = useState(priority?.description || "");
  const [owner, setOwner] = useState(priority?.roles?.owner || "");
  const [design, setDesign] = useState(priority?.roles?.design || "");
  const [impl, setImpl] = useState(priority?.roles?.implementare || "");
  const [review, setReview] = useState(priority?.roles?.review || "");

  const owners = [...new Set([...allOwners, owner, design, impl, review].filter(Boolean))].sort();

  const save = () => {
    if (!name.trim()) return alert("Numele e obligatoriu.");
    if (!owner) return alert("Owner e obligatoriu.");
    if (!review) return alert("Review e obligatoriu.");
    onSave({ name: name.trim(), modul, status, description: desc, roles: { owner, design, implementare: impl, review } });
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{isEdit ? "Editează prioritate" : "Prioritate nouă"}</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94A3B8" }}>✕</button>
      </div>
      <Field label="Nume"><input value={name} onChange={e => setName(e.target.value)} style={iS} /></Field>
      <Field label="Descriere"><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} style={{ ...iS, minHeight: 60 }} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Modul"><select value={modul} onChange={e => setModul(e.target.value)} style={selS}>{MODULES.map(m => <option key={m}>{m}</option>)}</select></Field></div>
        <div style={{ flex: 1 }}><Field label="Status"><select value={status} onChange={e => setStatus(e.target.value)} style={selS}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field></div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}><Field label="Owner *"><select value={owner} onChange={e => setOwner(e.target.value)} style={selS}><option value="">—</option>{owners.map(o => <option key={o}>{o}</option>)}</select></Field></div>
        <div style={{ flex: 1 }}><Field label="Design"><select value={design} onChange={e => setDesign(e.target.value)} style={selS}><option value="">—</option>{owners.map(o => <option key={o}>{o}</option>)}</select></Field></div>
        <div style={{ flex: 1 }}><Field label="Impl."><select value={impl} onChange={e => setImpl(e.target.value)} style={selS}><option value="">—</option>{owners.map(o => <option key={o}>{o}</option>)}</select></Field></div>
        <div style={{ flex: 1 }}><Field label="Review *"><select value={review} onChange={e => setReview(e.target.value)} style={selS}><option value="">—</option>{owners.map(o => <option key={o}>{o}</option>)}</select></Field></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        {isEdit && <Btn variant="danger" onClick={onDelete}>Șterge</Btn>}
        <Btn onClick={onClose}>Anulează</Btn>
        <Btn variant="primary" onClick={save}>{isEdit ? "Salvează" : "Creează"}</Btn>
      </div>
    </Overlay>
  );
}

export function TaskForm({ task, allOwners, onSave, onDelete, onClose }) {
  const isEdit = !!task;
  const [name, setName] = useState(task?.name || "");
  const [owner, setOwner] = useState(task?.owner || "");
  const [hours, setHours] = useState(task?.hours || 2);
  const [phase, setPhase] = useState(task?.phase || ALL_PHASES[0]);
  const [week, setWeek] = useState(task?.week || CUR_WEEK);
  const [status, setStatus] = useState(task?.status || "todo");
  const [desc, setDesc] = useState(task?.description || "");

  const weeks = useMemo(() => genWeekOptions(), []);

  const save = () => {
    if (!name.trim()) return alert("Numele e obligatoriu.");
    if (!owner) return alert("Owner e obligatoriu.");
    onSave({ name: name.trim(), owner, hours: parseFloat(hours) || 1, phase, week, status, description: desc });
  };

  return (
    <Overlay onClose={onClose} width={440}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{isEdit ? "Editează task" : "Task nou"}</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94A3B8" }}>✕</button>
      </div>
      <Field label="Nume task"><input value={name} onChange={e => setName(e.target.value)} style={iS} /></Field>
      <Field label="Descriere"><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} style={{ ...iS, minHeight: 50 }} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 2 }}><Field label="Owner"><select value={owner} onChange={e => setOwner(e.target.value)} style={selS}><option value="">—</option>{allOwners.map(o => <option key={o}>{o}</option>)}</select></Field></div>
        <div style={{ flex: 1 }}><Field label="Ore"><input type="number" min="0.5" step="0.5" value={hours} onChange={e => setHours(e.target.value)} style={iS} /></Field></div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Fază"><select value={phase} onChange={e => setPhase(e.target.value)} style={selS}>{ALL_PHASES.map(p => <option key={p}>{p}</option>)}</select></Field></div>
        <div style={{ flex: 1 }}><Field label="Săptămâna"><select value={week} onChange={e => setWeek(e.target.value)} style={selS}>{weeks.map(w => <option key={w.key} value={w.key}>{w.label}</option>)}</select></Field></div>
      </div>
      {isEdit && <Field label="Status"><select value={status} onChange={e => setStatus(e.target.value)} style={selS}><option value="todo">Todo</option><option value="inlucru">În lucru</option><option value="done">Done</option></select></Field>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
        {isEdit && <Btn variant="danger" onClick={onDelete}>Șterge</Btn>}
        <Btn onClick={onClose}>Anulează</Btn>
        <Btn variant="primary" onClick={save}>{isEdit ? "Salvează" : "Adaugă"}</Btn>
      </div>
    </Overlay>
  );
}

export function ImportModal({ onImport, onClose }) {
  const [json, setJson] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => { setJson(ev.target.result); setError(""); };
    r.readAsText(f);
  };

  const doImport = () => {
    try {
      const d = JSON.parse(json);
      if (!d.priority || !d.tasks) throw new Error("Format invalid: lipsește 'priority' sau 'tasks'.");
      if (!d.priority.name) throw new Error("Prioritatea nu are nume.");
      if (!d.priority.roles?.owner) throw new Error("Lipsește owner.");
      if (!d.priority.roles?.review) throw new Error("Lipsește review.");
      onImport(d);
    } catch (err) { setError(err.message); }
  };

  return (
    <Overlay onClose={onClose} width={520}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Încarcă analiză</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94A3B8" }}>✕</button>
      </div>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16, lineHeight: 1.5 }}>Încarcă JSON-ul generat de <strong>bono-planificare</strong>.</p>
      <div style={{ marginBottom: 16 }}>
        <input ref={fileRef} type="file" accept=".json" onChange={handleFile} style={{ display: "none" }} />
        <Btn onClick={() => fileRef.current.click()} style={{ width: "100%", textAlign: "center" }}>Alege fișier JSON</Btn>
      </div>
      <Field label="Sau lipește JSON"><textarea value={json} onChange={e => { setJson(e.target.value); setError(""); }} rows={8} style={{ ...iS, minHeight: 120, fontFamily: "monospace", fontSize: 12 }} /></Field>
      {error && <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 12, padding: "8px 12px", background: "#FEF2F2", borderRadius: 8 }}>{error}</div>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn onClick={onClose}>Anulează</Btn>
        <Btn variant="primary" onClick={doImport}>Importă</Btn>
      </div>
    </Overlay>
  );
}
