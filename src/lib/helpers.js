import { COLORS, NAME_ALIASES } from './constants.js';

export const TODAY = new Date();
export const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
export const fmtDate = d => d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
export const isoDate = d => d.toISOString().split("T")[0];

export const weekMonday = d => {
  const r = new Date(d);
  const day = r.getDay();
  r.setDate(r.getDate() + (day === 0 ? -6 : 1 - day));
  r.setHours(0, 0, 0, 0);
  return r;
};

export const weekLabel = mon => `${fmtDate(mon)} — ${fmtDate(addDays(mon, 4))}`;
export const weekKey = mon => isoDate(mon);
export const CUR_WEEK = weekKey(weekMonday(TODAY));
export const wk = offset => weekKey(addDays(weekMonday(TODAY), offset * 7));

export const genWeekOptions = () => {
  const ws = [];
  for (let i = -4; i < 12; i++) {
    const m = addDays(weekMonday(TODAY), i * 7);
    ws.push({ key: weekKey(m), label: weekLabel(m) });
  }
  return ws;
};

export const ownerColor = name => COLORS[name?.split(" ")[0]] || { bg: "#F1F5F9", text: "#475569" };

export function taskDS(t) {
  if (t.status === "done") return "done";
  if (t.week && t.week < CUR_WEEK) return "overdue";
  if (t.status === "inlucru") return "inlucru";
  return "todo";
}

export function getAllOwners(priorities) {
  const s = new Set();
  priorities.forEach(p => {
    ["owner", "design", "implementare", "review"].forEach(r => {
      if (p.roles?.[r]) s.add(p.roles[r]);
    });
    (p.tasks || []).forEach(t => { if (t.owner) s.add(t.owner); });
  });
  return [...s].sort();
}

export function resolveMyName(user, allOwners) {
  if (!user) return "";
  if (allOwners.includes(user.display_name)) return user.display_name;
  const prefix = user.email?.split("@")[0]?.toLowerCase() || "";
  if (NAME_ALIASES[prefix] && allOwners.includes(NAME_ALIASES[prefix])) return NAME_ALIASES[prefix];
  const match = allOwners.find(o => o.toLowerCase().startsWith(prefix));
  if (match) return match;
  return user.display_name || user.email?.split("@")[0] || "";
}
