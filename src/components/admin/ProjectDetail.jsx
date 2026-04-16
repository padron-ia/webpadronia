import { useEffect, useState } from "react";
import { getProject, updateProject } from "../../lib/projectsService";
import { listDeliverablesByProject, createDeliverable, deleteDeliverable } from "../../lib/deliverablesService";
import { listMilestones, createMilestone, completeMilestone, deleteMilestone } from "../../lib/projectOperationsService";
import { listTasks, createTask, updateTask, deleteTask } from "../../lib/projectOperationsService";
import { listTeam, addTeamMember, removeTeamMember } from "../../lib/projectOperationsService";
import { listTimeEntries, createTimeEntry, totalHoursByProject } from "../../lib/projectOperationsService";
import { listActivity, logActivity } from "../../lib/activityService";
import { supabase } from "../../lib/supabaseClient";

const STATUS_LABELS = { kickoff: "Kickoff", active: "Activo", paused: "Pausado", completed: "Completado", archived: "Archivado" };
const HEALTH_LABELS = { on_track: "En buen camino", at_risk: "En riesgo", off_track: "Fuera de plan" };
const HEALTH_COLORS = { on_track: "bg-emerald-100 text-emerald-800", at_risk: "bg-amber-100 text-amber-800", off_track: "bg-red-100 text-red-800" };
const TASK_STATUS = { todo: "Pendiente", in_progress: "En curso", review: "En revisión", done: "Hecho", blocked: "Bloqueado" };
const TASK_PRIORITY = { low: "Baja", normal: "Normal", high: "Alta", urgent: "Urgente" };
const DELIVERABLE_TYPES = { audit: "Auditoría", report: "Informe", prototype: "Prototipo", document: "Documento", presentation: "Presentación", dashboard: "Dashboard", training: "Formación" };

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "deliverables", label: "Entregables" },
  { id: "hitos", label: "Hitos" },
  { id: "tareas", label: "Tareas" },
  { id: "equipo", label: "Equipo" },
  { id: "horas", label: "Horas" },
  { id: "actividad", label: "Actividad" }
];

export default function ProjectDetail({ projectId, onBack }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("resumen");

  const reload = async () => {
    setLoading(true);
    try { setProject(await getProject(projectId)); } finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, [projectId]);

  if (loading) return <p className="text-sm text-slate-500">Cargando proyecto…</p>;
  if (!project) return <div className="rounded-2xl border bg-slate-50 p-6 text-sm text-slate-600">Proyecto no encontrado. <button onClick={onBack} className="underline ml-2">Volver</button></div>;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={onBack} className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 hover:text-slate-900">← Volver</button>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-semibold text-slate-900">{project.title}</h2>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{project.code || project.slug}</span>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${HEALTH_COLORS[project.health]}`}>{HEALTH_LABELS[project.health]}</span>
          </div>
          {project.companies ? <p className="mt-1 text-sm text-slate-500">{project.companies.legal_name}</p> : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "resumen" ? <ResumenTab project={project} onUpdated={reload} /> : null}
      {tab === "deliverables" ? <DeliverablesTab project={project} /> : null}
      {tab === "hitos" ? <HitosTab project={project} /> : null}
      {tab === "tareas" ? <TareasTab project={project} /> : null}
      {tab === "equipo" ? <EquipoTab project={project} /> : null}
      {tab === "horas" ? <HorasTab project={project} /> : null}
      {tab === "actividad" ? <ActividadTab project={project} /> : null}
    </div>
  );
}

// =================== RESUMEN ===================
function ResumenTab({ project, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const startEdit = () => { setForm({ status: project.status, health: project.health, description: project.description || "" }); setEditing(true); };

  const save = async () => {
    await updateProject(project.id, form);
    setEditing(false);
    onUpdated();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:col-span-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-slate-900">Información del proyecto</h3>
          <button onClick={editing ? save : startEdit} className="rounded-full border border-slate-300 px-4 py-1 text-sm font-semibold text-slate-700">{editing ? "Guardar" : "Editar"}</button>
        </div>
        {editing ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="block"><span className="text-xs font-semibold uppercase text-slate-500">Estado</span>
              <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm(p => ({...p, status: e.target.value}))}>
                {Object.entries(STATUS_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="block"><span className="text-xs font-semibold uppercase text-slate-500">Salud</span>
              <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.health} onChange={(e) => setForm(p => ({...p, health: e.target.value}))}>
                {Object.entries(HEALTH_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="block md:col-span-3"><span className="text-xs font-semibold uppercase text-slate-500">Descripción</span>
              <textarea rows={3} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))} />
            </label>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <InfoCard label="Estado" value={STATUS_LABELS[project.status]} />
            <InfoCard label="Salud" value={HEALTH_LABELS[project.health]} />
            <InfoCard label="Inicio" value={project.start_date || "-"} />
            <InfoCard label="Fin" value={project.end_date || "-"} />
            {project.description ? <div className="md:col-span-4"><Label>Descripción</Label><p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{project.description}</p></div> : null}
          </div>
        )}
      </div>
    </div>
  );
}

// =================== DELIVERABLES ===================
function DeliverablesTab({ project }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "report", description: "", content_type: "internal", content_ref: "", slug: "" });

  const reload = async () => { setLoading(true); try { setItems(await listDeliverablesByProject(project.id)); } finally { setLoading(false); } };
  useEffect(() => { reload(); }, [project.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const slug = form.slug || form.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").slice(0,60);
    await createDeliverable({ project_id: project.id, ...form, slug });
    setForm({ title: "", type: "report", description: "", content_type: "internal", content_ref: "", slug: "" });
    setShowForm(false);
    reload();
  };

  const handleDelete = async (id) => { if (!confirm("¿Eliminar este entregable?")) return; await deleteDeliverable(id); reload(); };

  const TYPE_ICON = { audit: "🔍", report: "📊", prototype: "🧪", document: "📄", presentation: "📽️", dashboard: "📈", training: "🎓" };

  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">{items.length} entregable{items.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Añadir</button>
      </div>

      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-3xl border border-slate-200 bg-white p-6 grid gap-3 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="text-xs font-semibold uppercase text-slate-500">Título *</span>
            <input required className={inputClass} value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} />
          </label>
          <label className="block"><span className="text-xs font-semibold uppercase text-slate-500">Tipo</span>
            <select className={inputClass} value={form.type} onChange={(e) => setForm(p => ({...p, type: e.target.value}))}>
              {Object.entries(DELIVERABLE_TYPES).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="block"><span className="text-xs font-semibold uppercase text-slate-500">Tipo contenido</span>
            <select className={inputClass} value={form.content_type} onChange={(e) => setForm(p => ({...p, content_type: e.target.value}))}>
              <option value="internal">Página interna</option>
              <option value="external_url">URL externa</option>
              <option value="iframe">iFrame</option>
              <option value="file">Archivo</option>
              <option value="markdown">Markdown</option>
            </select>
          </label>
          <label className="block md:col-span-2"><span className="text-xs font-semibold uppercase text-slate-500">Referencia contenido</span>
            <input className={inputClass} placeholder="slug interno, URL o ruta" value={form.content_ref} onChange={(e) => setForm(p => ({...p, content_ref: e.target.value}))} />
          </label>
          <label className="block md:col-span-2"><span className="text-xs font-semibold uppercase text-slate-500">Descripción</span>
            <textarea rows={2} className={inputClass} value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))} />
          </label>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600">Cancelar</button>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Crear</button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-2">
        {loading ? <p className="text-sm text-slate-500">Cargando…</p> :
         items.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin entregables.</p> :
         items.map((d) => (
          <div key={d.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition">
            <span className="text-2xl">{TYPE_ICON[d.type] || "📦"}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{d.title}</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">{DELIVERABLE_TYPES[d.type] || d.type}</span>
                {d.client_visible ? <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800">Visible cliente</span> : null}
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${d.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{d.status}</span>
              </div>
              {d.description ? <p className="mt-1 text-sm text-slate-600">{d.description}</p> : null}
              {d.content_ref ? <p className="mt-1 text-xs text-slate-400 font-mono">{d.content_ref}</p> : null}
            </div>
            <button onClick={() => handleDelete(d.id)} className="text-xs text-red-500 hover:text-red-700 shrink-0">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== HITOS ===================
function HitosTab({ project }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", due_date: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  const reload = async () => { setLoading(true); try { setItems(await listMilestones(project.id)); } finally { setLoading(false); } };
  useEffect(() => { reload(); }, [project.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMilestone({ project_id: project.id, title: form.title, due_date: form.due_date || null, description: form.description || null });
    setForm({ title: "", due_date: "", description: "" });
    setShowForm(false);
    reload();
  };

  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Añadir hito</button>
      </div>
      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-3xl border bg-white p-6 grid gap-3 md:grid-cols-3">
          <label className="block md:col-span-2"><span className="text-xs font-semibold uppercase text-slate-500">Título *</span><input required className={inputClass} value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} /></label>
          <label className="block"><span className="text-xs font-semibold uppercase text-slate-500">Fecha límite</span><input type="date" className={inputClass} value={form.due_date} onChange={(e) => setForm(p => ({...p, due_date: e.target.value}))} /></label>
          <label className="block md:col-span-3"><span className="text-xs font-semibold uppercase text-slate-500">Descripción</span><textarea rows={2} className={inputClass} value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))} /></label>
          <div className="md:col-span-3 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">Cancelar</button>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Crear</button>
          </div>
        </form>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : items.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin hitos definidos.</p> :
        <div className="grid gap-2">{items.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-2xl border bg-white p-4">
            <button onClick={async () => { if (!m.completed_at) { await completeMilestone(m.id); reload(); } }} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs ${m.completed_at ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-slate-500"}`}>{m.completed_at ? "✓" : ""}</button>
            <div className="flex-1">
              <p className={`font-semibold ${m.completed_at ? "line-through text-slate-400" : "text-slate-900"}`}>{m.title}</p>
              {m.description ? <p className="text-sm text-slate-600">{m.description}</p> : null}
            </div>
            {m.due_date ? <span className="text-xs text-slate-500">{m.due_date}</span> : null}
            <button onClick={async () => { if (confirm("¿Eliminar?")) { await deleteMilestone(m.id); reload(); } }} className="text-xs text-red-500">✕</button>
          </div>
        ))}</div>
      }
    </div>
  );
}

// =================== TAREAS ===================
function TareasTab({ project }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", priority: "normal", status: "todo" });
  const [showForm, setShowForm] = useState(false);

  const reload = async () => { setLoading(true); try { setItems(await listTasks({ projectId: project.id })); } finally { setLoading(false); } };
  useEffect(() => { reload(); }, [project.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createTask({ project_id: project.id, ...form });
    setForm({ title: "", priority: "normal", status: "todo" });
    setShowForm(false);
    reload();
  };

  const changeStatus = async (id, status) => { await updateTask(id, { status }); reload(); };

  const PRIORITY_COLOR = { low: "text-slate-400", normal: "text-slate-600", high: "text-amber-600", urgent: "text-red-600" };

  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Añadir tarea</button>
      </div>
      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-3xl border bg-white p-6 grid gap-3 md:grid-cols-3">
          <label className="block md:col-span-2"><span className="text-xs font-semibold uppercase text-slate-500">Título *</span><input required className={inputClass} value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} /></label>
          <label className="block"><span className="text-xs font-semibold uppercase text-slate-500">Prioridad</span>
            <select className={inputClass} value={form.priority} onChange={(e) => setForm(p => ({...p, priority: e.target.value}))}>
              {Object.entries(TASK_PRIORITY).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <div className="md:col-span-3 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">Cancelar</button>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Crear</button>
          </div>
        </form>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : items.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin tareas.</p> :
        <div className="grid gap-2">{items.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-2xl border bg-white p-3">
            <select value={t.status} onChange={(e) => changeStatus(t.id, e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">
              {Object.entries(TASK_STATUS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <p className={`flex-1 text-sm ${t.status === "done" ? "line-through text-slate-400" : "text-slate-900"}`}>{t.title}</p>
            <span className={`text-xs font-semibold ${PRIORITY_COLOR[t.priority]}`}>{TASK_PRIORITY[t.priority]}</span>
            {t.due_date ? <span className="text-xs text-slate-500">{t.due_date}</span> : null}
            <button onClick={async () => { if (confirm("¿Eliminar?")) { await deleteTask(t.id); reload(); } }} className="text-xs text-red-500">✕</button>
          </div>
        ))}</div>
      }
    </div>
  );
}

// =================== EQUIPO ===================
function EquipoTab({ project }) {
  const [team, setTeam] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      setTeam(await listTeam(project.id));
      const { data } = await supabase.from("profiles").select("id, full_name, role");
      setProfiles(data || []);
    } finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, [project.id]);

  const addMember = async (userId) => {
    await addTeamMember({ project_id: project.id, user_id: userId, role: "member" });
    reload();
  };

  const ROLE_LABELS = { owner: "Owner", manager: "Manager", member: "Miembro", reviewer: "Revisor" };

  const assignedIds = team.map(t => t.user_id);
  const available = profiles.filter(p => !assignedIds.includes(p.id));

  return (
    <div className="grid gap-3">
      {available.length > 0 ? (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-slate-600">Añadir miembro:</span>
          {available.map(p => (
            <button key={p.id} onClick={() => addMember(p.id)} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-900">
              + {p.full_name || p.id.slice(0,8)}
            </button>
          ))}
        </div>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : team.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin equipo asignado.</p> :
        <div className="grid gap-2">{team.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-2xl border bg-white p-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
              {(m.profile?.full_name || "?")[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{m.profile?.full_name || m.user_id.slice(0,8)}</p>
              <p className="text-xs text-slate-500">{ROLE_LABELS[m.role]} · {m.allocation_pct}%{m.hourly_rate ? ` · ${m.hourly_rate}€/h` : ""}</p>
            </div>
            <button onClick={async () => { await removeTeamMember(m.id); reload(); }} className="text-xs text-red-500">Quitar</button>
          </div>
        ))}</div>
      }
    </div>
  );
}

// =================== HORAS ===================
function HorasTab({ project }) {
  const [entries, setEntries] = useState([]);
  const [totals, setTotals] = useState({ total: 0, billable: 0, billed: 0 });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ description: "", hours: "", entry_date: new Date().toISOString().slice(0,10) });
  const [showForm, setShowForm] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const [e, t] = await Promise.all([listTimeEntries({ projectId: project.id, limit: 100 }), totalHoursByProject(project.id)]);
      setEntries(e); setTotals(t);
    } finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, [project.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createTimeEntry({ project_id: project.id, description: form.description, hours: Number(form.hours), entry_date: form.entry_date });
    setForm({ description: "", hours: "", entry_date: new Date().toISOString().slice(0,10) });
    setShowForm(false);
    reload();
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border bg-slate-50 p-3"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Total horas</p><p className="mt-1 text-2xl font-semibold">{totals.total.toFixed(1)}</p></div>
        <div className="rounded-2xl border bg-slate-50 p-3"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Facturables</p><p className="mt-1 text-2xl font-semibold">{totals.billable.toFixed(1)}</p></div>
        <div className="rounded-2xl border bg-slate-50 p-3"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Facturadas</p><p className="mt-1 text-2xl font-semibold">{totals.billed.toFixed(1)}</p></div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Registrar horas</button>
      </div>
      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-3xl border bg-white p-6 grid gap-3 md:grid-cols-4">
          <label className="block md:col-span-2"><span className="text-xs font-semibold uppercase text-slate-500">Descripción</span><input className={inputClass} value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))} /></label>
          <label className="block"><span className="text-xs font-semibold uppercase text-slate-500">Horas *</span><input required type="number" step="0.25" min="0.25" className={inputClass} value={form.hours} onChange={(e) => setForm(p => ({...p, hours: e.target.value}))} /></label>
          <label className="block"><span className="text-xs font-semibold uppercase text-slate-500">Fecha</span><input type="date" className={inputClass} value={form.entry_date} onChange={(e) => setForm(p => ({...p, entry_date: e.target.value}))} /></label>
          <div className="md:col-span-4 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">Cancelar</button>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Registrar</button>
          </div>
        </form>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : entries.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin horas registradas.</p> :
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-2">Fecha</th><th className="px-4 py-2">Descripción</th><th className="px-4 py-2">Horas</th><th className="px-4 py-2">Facturable</th></tr></thead>
            <tbody>{entries.map(e => (
              <tr key={e.id} className="border-t"><td className="px-4 py-2 text-slate-500">{e.entry_date}</td><td className="px-4 py-2">{e.description || "-"}</td><td className="px-4 py-2 font-semibold">{e.hours}h</td><td className="px-4 py-2">{e.billable ? "✓" : "-"}</td></tr>
            ))}</tbody>
          </table>
        </div>
      }
    </div>
  );
}

// =================== ACTIVIDAD ===================
function ActividadTab({ project }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  const reload = async () => { setLoading(true); try { setItems(await listActivity({ projectId: project.id })); } finally { setLoading(false); } };
  useEffect(() => { reload(); }, [project.id]);

  const addNote = async () => {
    if (!note.trim()) return;
    await logActivity({ company_id: project.company_id, project_id: project.id, type: "note", title: "Nota", body: note.trim(), client_visible: false });
    setNote(""); reload();
  };

  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border bg-white p-4">
        <textarea rows={2} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Añadir nota de seguimiento…" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="mt-2 flex justify-end">
          <button onClick={addNote} disabled={!note.trim()} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Añadir</button>
        </div>
      </div>
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : items.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin actividad.</p> :
        <div className="grid gap-2">{items.map(a => (
          <div key={a.id} className="rounded-2xl border bg-white p-3">
            <p className="text-sm font-semibold text-slate-900">{a.title}</p>
            {a.body ? <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{a.body}</p> : null}
            <p className="mt-1 text-xs text-slate-500">{new Date(a.created_at).toLocaleString()} · {a.type}{a.client_visible ? " · Visible cliente" : ""}</p>
          </div>
        ))}</div>
      }
    </div>
  );
}

// =================== HELPERS ===================
const inputClass = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500";
function InfoCard({ label, value }) { return <div className="rounded-xl border bg-slate-50 p-3"><Label>{label}</Label><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>; }
function Label({ children }) { return <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{children}</span>; }
