import React, { useState, useMemo } from 'react';
import { GRAD, phaseColor, statusColor, taskSC } from './lib/constants.js';
import { TODAY, addDays, fmtDate, weekMonday, weekKey, weekLabel, CUR_WEEK, taskDS, getAllOwners, resolveMyName, ownerColor } from './lib/helpers.js';
import { useAuth } from './hooks/useAuth.js';
import { useData } from './hooks/useData.js';
import LoginScreen from './components/LoginScreen.jsx';
import UserMenu from './components/UserMenu.jsx';
import { Chip, Badge, Btn } from './components/UI.jsx';
import { PriorityForm, ImportModal } from './components/Forms.jsx';
import PriorityPage from './components/PriorityPage.jsx';

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut, updateDisplayName } = useAuth();
  const data = useData(user);
  const { priorities } = data;

  const [view, setView] = useState("board");
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterOwner, setFilterOwner] = useState("Toți");
  const [filterWeek, setFilterWeek] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddP, setShowAddP] = useState(false);
  const [editingP, setEditingP] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const allOwners = useMemo(() => getAllOwners(priorities), [priorities]);
  const myName = useMemo(() => resolveMyName(user, allOwners), [user, allOwners]);
  const boardCols = useMemo(() => {
    let cols = allOwners.filter(o => filterOwner === "Toți" || o === filterOwner);
    if (myName && cols.includes(myName)) cols = [myName, ...cols.filter(o => o !== myName)];
    return cols;
  }, [allOwners, filterOwner, myName]);

  const selected = priorities.find(p => p.id === selectedId);

  const addPriority = async (d) => {
    const np = await data.addPriority(d);
    if (np) setShowAddP(false);
  };

  const editPriority = async (d) => {
    await data.updatePriority({ ...editingP, ...d });
    setEditingP(null);
  };

  const deletePriority = async () => {
    if (!confirm(`Ștergi "${editingP.name}"?`)) return;
    await data.deletePriority(editingP.id);
    setEditingP(null);
    setSelectedId(null);
  };

  const handleImport = async (jsonData) => {
    const np = await data.importPriority(jsonData);
    if (np) { setShowImport(false); setSelectedId(np.id); }
  };

  // Loading states
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#FDF2F8 0%,#EDE9FE 50%,#E0F2FE 100%)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: GRAD, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>P</span>
          </div>
          <div style={{ fontSize: 14, color: "#64748B" }}>Se încarcă...</div>
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={signInWithGoogle} loading={authLoading} />;

  const boardWeek = filterWeek || CUR_WEEK;
  const getBoard = owner => {
    return priorities.flatMap(p => (p.tasks || []).filter(t => {
      if (t.owner !== owner) return false;
      if (t.status === "done") return false;
      const isOverdue = t.week && t.week < CUR_WEEK;
      const isThisWeek = t.week === boardWeek;
      return isOverdue || isThisWeek;
    }).map(t => ({ ...t, priorityId: p.id, priorityName: p.name, ds: taskDS(t) }))).sort((a, b) => {
      if (a.ds === "overdue" && b.ds !== "overdue") return -1;
      if (b.ds === "overdue" && a.ds !== "overdue") return 1;
      return 0;
    });
  };

  const COL_W = 280, GAP = 12;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#F8FAFC", minHeight: "100vh", color: "#0F172A" }}>

      {/* TOP BAR */}
      <div style={{ background: GRAD, height: 52, display: "flex", alignItems: "center", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>P</span></div>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>PrioriTracker</span>
        </div>
        <div style={{ marginLeft: 24, display: "flex", background: "rgba(0,0,0,0.15)", borderRadius: 999, padding: 2, flexShrink: 0 }}>
          {[{ id: "board", label: "Board" }, { id: "list", label: "List" }, { id: "qview", label: "Priorități" }].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{ padding: "4px 12px", borderRadius: 999, border: "none", cursor: "pointer", background: view === v.id ? "#fff" : "transparent", color: view === v.id ? "#BE185D" : "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: view === v.id ? 600 : 400, transition: "all 0.15s", whiteSpace: "nowrap" }}>{v.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: 20, flexShrink: 0 }}>
          <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} style={{ padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, cursor: "pointer", outline: "none" }}>
            <option value="Toți" style={{ color: "#0F172A", background: "#fff" }}>Toți colegii</option>
            {allOwners.map(o => <option key={o} value={o} style={{ color: "#0F172A", background: "#fff" }}>{o}{o === myName ? " (eu)" : ""}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <button onClick={() => setWeekOffset(w => w - 1)} style={{ padding: "4px 9px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13 }}>←</button>
          {[-1, 0, 1].map(off => {
            const mon = addDays(weekMonday(TODAY), (weekOffset + off) * 7);
            const wkk = weekKey(mon);
            const isSel = filterWeek === wkk;
            const isCur = wkk === CUR_WEEK;
            return (
              <button key={wkk} onClick={() => setFilterWeek(isSel ? null : wkk)} style={{ padding: "5px 12px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap", border: isSel ? "2px solid #fff" : isCur ? "1.5px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.3)", background: isSel ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: isCur ? 13 : 12, fontWeight: isCur ? 700 : 400, transition: "all 0.15s" }}>{fmtDate(mon)} – {fmtDate(addDays(mon, 4))}</button>
            );
          })}
          <button onClick={() => setWeekOffset(w => w + 1)} style={{ padding: "4px 9px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13 }}>→</button>
          {filterWeek && <button onClick={() => setFilterWeek(null)} style={{ padding: "3px 7px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 11 }}>✕</button>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <button onClick={() => setShowImport(true)} style={{ padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>↑ Import</button>
          <button onClick={() => setShowAddP(true)} style={{ padding: "5px 14px", borderRadius: 999, border: "none", background: "#fff", color: "#374151", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>+ Prioritate</button>
        </div>
        <UserMenu
          user={user}
          displayName={myName}
          onSignOut={signOut}
          onUpdateName={updateDisplayName}
        />
      </div>

      {/* Data loading */}
      {data.loading && <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>Se încarcă datele...</div>}

      {/* ═══ BOARD ═══ */}
      {!data.loading && view === "board" && <div>
        <div id="boardHeader" style={{ overflowX: "hidden", padding: "16px 24px 0 24px", background: "#F8FAFC", position: "sticky", top: 52, zIndex: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", gap: GAP, minWidth: boardCols.length * (COL_W + GAP), paddingBottom: 8 }}>
            {boardCols.map(owner => {
              const c = ownerColor(owner); const isMe = owner === myName; const cnt = getBoard(owner).length;
              return (
                <div key={"h-" + owner} style={{ width: COL_W, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: isMe ? GRAD : c.bg, color: isMe ? "#fff" : c.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, border: isMe ? "2px solid #fff" : "none" }}>{owner.slice(0, 2).toUpperCase()}</div>
                  <span style={{ fontSize: 15, fontWeight: isMe ? 700 : 500 }}>{owner}{isMe ? " (eu)" : ""}</span>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>({cnt})</span>
                </div>
              );
            })}
          </div>
        </div>
        <div id="boardScroll" style={{ overflowX: "auto", padding: "8px 24px 40px" }} onScroll={e => { const h = document.getElementById('boardHeader'); if (h) h.scrollLeft = e.target.scrollLeft; }}>
          <div style={{ display: "flex", gap: GAP, minWidth: boardCols.length * (COL_W + GAP) }}>
            {boardCols.map(owner => {
              const tasks = getBoard(owner);
              return (
                <div key={owner} style={{ width: COL_W, flexShrink: 0 }}>
                  {tasks.length === 0
                    ? <div style={{ padding: "20px", textAlign: "center", color: "#94A3B8", fontSize: 13, background: "#fff", borderRadius: 12, border: "1px solid #F1F5F9" }}>Niciun task activ</div>
                    : tasks.map(t => {
                      const tc = taskSC[t.ds] || taskSC.todo;
                      const pc = phaseColor[t.phase] || { bg: "#F1F5F9", text: "#475569" };
                      return (
                        <div key={t.priorityId + "-" + t.id} onClick={() => setSelectedId(t.priorityId)} className="hover-card"
                          style={{ background: t.ds === "overdue" ? "#FEF2F2" : "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 8, cursor: "pointer",
                            borderTop: t.ds === "overdue" ? "1px solid #FCA5A5" : "1px solid #E2E8F0", borderRight: t.ds === "overdue" ? "1px solid #FCA5A5" : "1px solid #E2E8F0", borderBottom: t.ds === "overdue" ? "1px solid #FCA5A5" : "1px solid #E2E8F0", borderLeft: `3px solid ${tc.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 11, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 6 }}>{t.priorityName}</span>
                            <div style={{ display: "flex", gap: 4 }}>
                              {t.ds === "overdue" && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 999, background: "#FEE2E2", color: "#B91C1C", fontWeight: 700 }}>RESTANT</span>}
                              <Badge label={t.phase?.split(" ").pop() || "?"} color={pc} />
                            </div>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 9, color: "#0F172A" }}>{t.name}</div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><Chip name={t.owner} /><span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{t.hours}h</span></div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      </div>}

      {/* ═══ Q-VIEW ═══ */}
      {!data.loading && view === "qview" && <div>
        <div style={{ overflowX: "hidden", padding: "16px 24px 0 24px", background: "#F8FAFC", position: "sticky", top: 52, zIndex: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", gap: GAP, minWidth: boardCols.length * (COL_W + GAP), paddingBottom: 8 }}>
            {boardCols.map(owner => {
              const c = ownerColor(owner); const isMe = owner === myName;
              return (
                <div key={"h-" + owner} style={{ width: COL_W, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: isMe ? GRAD : c.bg, color: isMe ? "#fff" : c.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{owner.slice(0, 2).toUpperCase()}</div>
                  <span style={{ fontSize: 15, fontWeight: isMe ? 700 : 500 }}>{owner}{isMe ? " (eu)" : ""}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ overflowX: "auto", padding: "8px 24px 40px" }}>
          <div style={{ display: "flex", gap: GAP, minWidth: boardCols.length * (COL_W + GAP) }}>
            {boardCols.map(owner => {
              const myP = priorities.filter(p => p.roles?.owner === owner || p.roles?.implementare === owner || p.roles?.design === owner);
              return (
                <div key={owner} style={{ width: COL_W, flexShrink: 0 }}>
                  {myP.length === 0
                    ? <div style={{ padding: "20px", textAlign: "center", color: "#94A3B8", fontSize: 13, background: "#fff", borderRadius: 12, border: "1px solid #F1F5F9" }}>Nicio prioritate</div>
                    : myP.map(p => {
                      const sc = statusColor[p.status] || { bg: "#EDE9FE", text: "#5B21B6" };
                      const done = (p.tasks || []).filter(t => t.status === "done").length;
                      const total = (p.tasks || []).length;
                      const overdue = (p.tasks || []).filter(t => taskDS(t) === "overdue").length;
                      return (
                        <div key={p.id} onClick={() => setSelectedId(p.id)} className="hover-card"
                          style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "14px 16px", marginBottom: 8, cursor: "pointer" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 6 }}>{p.modul}</span>
                            <Badge label={p.status} color={sc} />
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 10 }}>{p.name}</div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Chip name={p.roles?.owner || "?"} />
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              {overdue > 0 && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 999, background: "#FEE2E2", color: "#B91C1C", fontWeight: 700 }}>{overdue} restant{overdue > 1 ? "e" : ""}</span>}
                              {total > 0 && <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{done}/{total}</span>}
                            </div>
                          </div>
                          {total > 0 && <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: "#F1F5F9", overflow: "hidden" }}><div style={{ width: `${Math.round((done / total) * 100)}%`, height: "100%", background: GRAD, borderRadius: 4 }} /></div>}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      </div>}

      {/* ═══ LIST ═══ */}
      {!data.loading && view === "list" && <div style={{ padding: "24px" }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#F8FAFC" }}>
              {["Modul", "Prioritate", "Status", "Owner", "Design", "Impl.", "Review", "Tasks", "Restante"].map((h, i) => (
                <th key={i} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 500, borderBottom: "2px solid #E2E8F0" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {priorities.filter(p => filterOwner === "Toți" || [p.roles?.owner, p.roles?.implementare, p.roles?.design].includes(filterOwner)).map(p => {
                const sc = statusColor[p.status] || { bg: "#EDE9FE", text: "#5B21B6" };
                const done = (p.tasks || []).filter(t => t.status === "done").length;
                const total = (p.tasks || []).length;
                const overdue = (p.tasks || []).filter(t => taskDS(t) === "overdue").length;
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"} onMouseLeave={e => e.currentTarget.style.background = ""} onClick={() => setSelectedId(p.id)}>
                    <td style={{ padding: "9px 12px", fontSize: 11, color: "#64748B" }}>{p.modul}</td>
                    <td style={{ padding: "9px 12px", fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: "9px 12px" }}><Badge label={p.status} color={sc} /></td>
                    <td style={{ padding: "9px 12px" }}>{p.roles?.owner && <Chip name={p.roles.owner} />}</td>
                    <td style={{ padding: "9px 12px" }}>{p.roles?.design && <Chip name={p.roles.design} />}</td>
                    <td style={{ padding: "9px 12px" }}>{p.roles?.implementare && <Chip name={p.roles.implementare} />}</td>
                    <td style={{ padding: "9px 12px" }}>{p.roles?.review && <Chip name={p.roles.review} />}</td>
                    <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11, color: "#64748B" }}>{total > 0 ? `${done}/${total}` : "-"}</td>
                    <td style={{ padding: "9px 12px" }}>{overdue > 0 && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 999, background: "#FEE2E2", color: "#B91C1C", fontWeight: 700 }}>{overdue}</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Empty state */}
      {!data.loading && priorities.length === 0 && (
        <div style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Nicio prioritate încă</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Adaugă prima prioritate sau importă o analiză din bono-planificare.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Btn variant="primary" onClick={() => setShowAddP(true)}>+ Prioritate nouă</Btn>
            <Btn onClick={() => setShowImport(true)}>↑ Import JSON</Btn>
          </div>
        </div>
      )}

      {/* MODALS */}
      {selected && <PriorityPage p={selected} onClose={() => setSelectedId(null)} data={data} onEditPriority={() => setEditingP(selected)} />}
      {showAddP && <PriorityForm allOwners={allOwners} onSave={addPriority} onClose={() => setShowAddP(false)} />}
      {editingP && <PriorityForm priority={editingP} allOwners={allOwners} onSave={editPriority} onDelete={deletePriority} onClose={() => setEditingP(null)} />}
      {showImport && <ImportModal onImport={handleImport} onClose={() => setShowImport(false)} />}
    </div>
  );
}
