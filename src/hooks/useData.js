import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

export function useData(user) {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const { data: pRows, error: pErr } = await supabase.from('priorities').select('*').order('created_at', { ascending: true });
    if (pErr) { console.error('Load priorities:', pErr); setLoading(false); return; }
    const { data: tRows } = await supabase.from('tasks').select('*').order('sort_order');
    const { data: cRows } = await supabase.from('comments').select('*').order('created_at');
    const { data: lRows } = await supabase.from('links').select('*').order('created_at');
    const tasks = tRows || [], comments = cRows || [], links = lRows || [];
    const mapC = c => ({ id: c.id, author: c.author, text: c.body, time: c.created_at });
    const mapL = l => ({ id: l.id, url: l.url, label: l.label || l.url });
    const assembled = (pRows || []).map(p => ({
      id: p.id, modul: p.modul, name: p.name, status: p.status, description: p.description || '',
      roles: { owner: p.role_owner, design: p.role_design || '', implementare: p.role_implementare || '', review: p.role_review },
      tasks: tasks.filter(t => t.priority_id === p.id).map(t => ({
        id: t.id, name: t.name, owner: t.owner, hours: parseFloat(t.hours) || 2,
        status: t.status, phase: t.phase, week: t.week, description: t.description || '',
        comments: comments.filter(c => c.task_id === t.id).map(mapC),
        links: links.filter(l => l.task_id === t.id).map(mapL),
      })),
      comments: comments.filter(c => c.priority_id === p.id && !c.task_id).map(mapC),
      links: links.filter(l => l.priority_id === p.id && !l.task_id).map(mapL),
    }));
    setPriorities(assembled); setLoading(false);
  }, []);

  useEffect(() => { if (user) loadAll(); }, [user, loadAll]);

  async function addPriority(data) {
    const { data: row, error } = await supabase.from('priorities').insert({
      modul: data.modul, name: data.name, status: data.status, description: data.description || '',
      role_owner: data.roles.owner, role_design: data.roles.design || '',
      role_implementare: data.roles.implementare || '', role_review: data.roles.review,
      created_by: user?.id || null,
    }).select().single();
    if (error) { console.error('Add priority:', error); return null; }
    const newP = { id: row.id, modul: row.modul, name: row.name, status: row.status, description: row.description,
      roles: { owner: row.role_owner, design: row.role_design, implementare: row.role_implementare, review: row.role_review },
      tasks: [], comments: [], links: [] };
    setPriorities(prev => [...prev, newP]); return newP;
  }

  async function updatePriority(updated) {
    const { error } = await supabase.from('priorities').update({
      modul: updated.modul, name: updated.name, status: updated.status, description: updated.description || '',
      role_owner: updated.roles.owner, role_design: updated.roles.design || '',
      role_implementare: updated.roles.implementare || '', role_review: updated.roles.review,
    }).eq('id', updated.id);
    if (!error) setPriorities(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
  }

  async function deletePriority(id) {
    await supabase.from('priorities').delete().eq('id', id);
    setPriorities(prev => prev.filter(p => p.id !== id));
  }

  async function addTask(priorityId, data) {
    const { data: row, error } = await supabase.from('tasks').insert({
      priority_id: priorityId, name: data.name, owner: data.owner, hours: data.hours || 2,
      status: data.status || 'todo', phase: data.phase || 'Planificare AnalizÄ',
      week: data.week || null, description: data.description || '',
    }).select().single();
    if (error) return;
    const newT = { id: row.id, name: row.name, owner: row.owner, hours: parseFloat(row.hours),
      status: row.status, phase: row.phase, week: row.week, description: row.description, comments: [], links: [] };
    setPriorities(prev => prev.map(p => p.id === priorityId ? { ...p, tasks: [...p.tasks, newT] } : p));
  }

  async function updateTask(priorityId, updated) {
    await supabase.from('tasks').update({
      name: updated.name, owner: updated.owner, hours: updated.hours,
      status: updated.status, phase: updated.phase, week: updated.week, description: updated.description || '',
    }).eq('id', updated.id);
    setPriorities(prev => prev.map(p => p.id === priorityId
      ? { ...p, tasks: p.tasks.map(t => t.id === updated.id ? { ...t, ...updated } : t) } : p));
  }

  async function deleteTask(priorityId, taskId) {
    await supabase.from('tasks').delete().eq('id', taskId);
    setPriorities(prev => prev.map(p => p.id === priorityId ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } : p));
  }

  async function addComment(parentType, parentId, text) {
    const author = user?.display_name || user?.email?.split('@')[0] || '?';
    const ins = { author, body: text, ...(parentType === 'priority' ? { priority_id: parentId } : { task_id: parentId }) };
    const { data: row, error } = await supabase.from('comments').insert(ins).select().single();
    if (error) return;
    const newC = { id: row.id, author: row.author, text: row.body, time: row.created_at };
    if (parentType === 'priority') {
      setPriorities(prev => prev.map(p => p.id === parentId ? { ...p, comments: [...p.comments, newC] } : p));
    } else {
      setPriorities(prev => prev.map(p => ({ ...p, tasks: p.tasks.map(t => t.id === parentId ? { ...t, comments: [...t.comments, newC] } : t) })));
    }
  }

  async function addLink(parentType, parentId, url, label) {
    const ins = { url, label: label || url, ...(parentType === 'priority' ? { priority_id: parentId } : { task_id: parentId }) };
    const { data: row, error } = await supabase.from('links').insert(ins).select().single();
    if (error) return;
    const newL = { id: row.id, url: row.url, label: row.label };
    if (parentType === 'priority') {
      setPriorities(prev => prev.map(p => p.id === parentId ? { ...p, links: [...p.links, newL] } : p));
    } else {
      setPriorities(prev => prev.map(p => ({ ...p, tasks: p.tasks.map(t => t.id === parentId ? { ...t, links: [...t.links, newL] } : t) })));
    }
  }

  async function removeLink(parentType, parentId, linkId) {
    await supabase.from('links').delete().eq('id', linkId);
    if (parentType === 'priority') {
      setPriorities(prev => prev.map(p => p.id === parentId ? { ...p, links: p.links.filter(l => l.id !== linkId) } : p));
    } else {
      setPriorities(prev => prev.map(p => ({ ...p, tasks: p.tasks.map(t => t.id === parentId ? { ...t, links: t.links.filter(l => l.id !== linkId) } : t) })));
    }
  }

  async function importPriority(jsonData) {
    const d = jsonData;
    const np = await addPriority({ modul: d.priority.modul || 'Core â Conta', name: d.priority.name,
      status: d.priority.status || 'AnalizÄ', description: d.priority.description || '',
      roles: { owner: d.priority.roles.owner, design: d.priority.roles.design || '',
        implementare: d.priority.roles.implementare || '', review: d.priority.roles.review } });
    if (!np) return null;
    const tis = (d.tasks || []).map((t, i) => ({ priority_id: np.id, name: t.name, owner: t.owner,
      hours: t.hours || 1, status: 'todo', phase: t.phase || 'Planificare AnalizÄ',
      week: t.week || null, description: t.description || '', sort_order: i }));
    if (tis.length > 0) {
      const { data: rows, error } = await supabase.from('tasks').insert(tis).select();
      if (!error && rows) {
        const nt = rows.map(r => ({ id: r.id, name: r.name, owner: r.owner, hours: parseFloat(r.hours),
          status: r.status, phase: r.phase, week: r.week, description: r.description, comments: [], links: [] }));
        setPriorities(prev => prev.map(p => p.id === np.id ? { ...p, tasks: nt } : p));
      }
    }
    return np;
  }

  return { priorities, loading, loadAll, addPriority, updatePriority, deletePriority,
    addTask, updateTask, deleteTask, addComment, addLink, removeLink, importPriority };
}
