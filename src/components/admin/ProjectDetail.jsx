import { useEffect, useState } from "react";
import { getProject, updateProject } from "../../lib/projectsService";
import { listDeliverablesByProject, createDeliverable, deleteDeliverable } from "../../lib/deliverablesService";
import { listMilestones, createMilestone, completeMilestone, deleteMilestone } from "../../lib/projectOperationsService";
import { listTasks, createTask, updateTask, deleteTask } from "../../lib/projectOperationsService";
import { listTeam, addTeamMember, removeTeamMember } from "../../lib/projectOperationsService";
import { listTimeEntries, createTimeEntry, totalHoursByProject } from "../../lib/projectOperationsService";
import { listActivity, logActivity } from "../../lib/activityService";
import { listRepositories, createRepository, deleteRepository, listCredentials, createCredential, decryptCredential, deleteCredential, listStack, createStackItem, deleteStackItem, listLinks, createLink, deleteLink } from "../../lib/projectHubService";
import { supabase } from "../../lib/supabaseClient";
import DeliverableViewer from "../../content/DeliverableViewer";

const STATUS_LABELS = { kickoff: "Kickoff", active: "Activo", paused: "Pausado", completed: "Completado", archived: "Archivado" };
const HEALTH_LABELS = { on_track: "En buen camino", at_risk: "En riesgo", off_track: "Fuera de plan" };
const HEALTH_COLORS = { on_track: "bg-emerald-100 text-emerald-800", at_risk: "bg-amber-100 text-amber-800", off_track: "bg-red-100 text-red-800" };
const TASK_STATUS = { todo: "Pendiente", in_progress: "En curso", review: "En revisión", done: "Hecho", blocked: "Bloqueado" };
const TASK_PRIORITY = { low: "Baja", normal: "Normal", high: "Alta", urgent: "Urgente" };
const DELIVERABLE_TYPES = { audit: "Auditoría", report: "Informe", prototype: "Prototipo", document: "Documento", presentation: "Presentación", dashboard: "Dashboard", training: "Formación" };

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "deliverables", label: "Entregables" },
  { id: "repos", label: "Repos" },
  { id: "credenciales", label: "Credenciales" },
  { id: "stack", label: "Stack" },
  { id: "links", label: "Links" },
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
      {tab === "repos" ? <ReposTab project={project} /> : null}
      {tab === "credenciales" ? <CredencialesTab project={project} /> : null}
      {tab === "stack" ? <StackTab project={project} /> : null}
      {tab === "links" ? <LinksTab project={project} /> : null}
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
  const [viewing, setViewing] = useState(null);
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

  if (viewing) {
    return <DeliverableViewer deliverable={viewing} onBack={() => setViewing(null)} />;
  }

  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">{items.length} entregable{items.length !== 1 ? "s" : ""} · Haz clic para abrir</p>
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
          <div key={d.id} onClick={() => setViewing(d)} className="cursor-pointer flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition">
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
            <button onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }} className="text-xs text-red-500 hover:text-red-700 shrink-0">Eliminar</button>
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

// =================== REPOS ===================
function ReposTab({ project }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", provider: "github", repo_url: "", branch: "main", deploy_url: "", environment: "production", notes: "" });

  const reload = async () => { setLoading(true); try { setItems(await listRepositories(project.id)); } finally { setLoading(false); } };
  useEffect(() => { reload(); }, [project.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createRepository({ project_id: project.id, ...form, notes: form.notes || null });
    setForm({ label: "", provider: "github", repo_url: "", branch: "main", deploy_url: "", environment: "production", notes: "" });
    setShowForm(false);
    reload();
  };

  const PROVIDER_ICON = { github: "GH", gitlab: "GL", bitbucket: "BB", other: "??" };
  const ENV_COLOR = { production: "bg-emerald-100 text-emerald-800", staging: "bg-amber-100 text-amber-800", dev: "bg-sky-100 text-sky-800", other: "bg-slate-100 text-slate-600" };

  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">{items.length} repositorio{items.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Repositorio</button>
      </div>
      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-3xl border bg-white p-6 grid gap-3 md:grid-cols-3">
          <label className="block"><Label>Etiqueta *</Label><input required className={inputClass} placeholder="Frontend, Backend, Mobile…" value={form.label} onChange={(e) => setForm(p => ({...p, label: e.target.value}))} /></label>
          <label className="block"><Label>Proveedor</Label>
            <select className={inputClass} value={form.provider} onChange={(e) => setForm(p => ({...p, provider: e.target.value}))}>
              <option value="github">GitHub</option><option value="gitlab">GitLab</option><option value="bitbucket">Bitbucket</option><option value="other">Otro</option>
            </select>
          </label>
          <label className="block"><Label>Entorno</Label>
            <select className={inputClass} value={form.environment} onChange={(e) => setForm(p => ({...p, environment: e.target.value}))}>
              <option value="production">Produccion</option><option value="staging">Staging</option><option value="dev">Dev</option><option value="other">Otro</option>
            </select>
          </label>
          <label className="block md:col-span-2"><Label>URL Repo *</Label><input required type="url" className={inputClass} placeholder="https://github.com/org/repo" value={form.repo_url} onChange={(e) => setForm(p => ({...p, repo_url: e.target.value}))} /></label>
          <label className="block"><Label>Branch</Label><input className={inputClass} value={form.branch} onChange={(e) => setForm(p => ({...p, branch: e.target.value}))} /></label>
          <label className="block md:col-span-2"><Label>URL Deploy</Label><input type="url" className={inputClass} placeholder="https://app.ejemplo.com" value={form.deploy_url} onChange={(e) => setForm(p => ({...p, deploy_url: e.target.value}))} /></label>
          <label className="block"><Label>Notas</Label><input className={inputClass} value={form.notes} onChange={(e) => setForm(p => ({...p, notes: e.target.value}))} /></label>
          <div className="md:col-span-3 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">Cancelar</button>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Crear</button>
          </div>
        </form>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : items.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin repositorios. Agrega uno para tener todo centralizado.</p> :
        <div className="grid gap-2">{items.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-2xl border bg-white p-4">
            <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shrink-0">{PROVIDER_ICON[r.provider]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{r.label}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ENV_COLOR[r.environment]}`}>{r.environment}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">{r.branch}</span>
              </div>
              <div className="mt-1 flex items-center gap-4 flex-wrap">
                <a href={r.repo_url} target="_blank" rel="noopener" className="text-xs text-blue-600 hover:underline truncate">{r.repo_url}</a>
                {r.deploy_url ? <a href={r.deploy_url} target="_blank" rel="noopener" className="text-xs text-emerald-600 hover:underline">Deploy &rarr;</a> : null}
              </div>
              {r.notes ? <p className="mt-1 text-xs text-slate-500">{r.notes}</p> : null}
            </div>
            <button onClick={async () => { if (confirm("¿Eliminar repositorio?")) { await deleteRepository(r.id); reload(); } }} className="text-xs text-red-500 shrink-0">✕</button>
          </div>
        ))}</div>
      }
    </div>
  );
}

// =================== CREDENCIALES ===================
function CredencialesTab({ project }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [form, setForm] = useState({ label: "", service: "", credential_type: "api_key", plain_value: "", environment: "production", notes: "" });

  const reload = async () => { setLoading(true); try { setItems(await listCredentials(project.id)); } finally { setLoading(false); } };
  useEffect(() => { reload(); }, [project.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createCredential({ project_id: project.id, ...form });
    setForm({ label: "", service: "", credential_type: "api_key", plain_value: "", environment: "production", notes: "" });
    setShowForm(false);
    reload();
  };

  const reveal = async (id) => {
    try {
      const val = await decryptCredential(id);
      setRevealed(p => ({ ...p, [id]: val }));
      setTimeout(() => setRevealed(p => { const n = {...p}; delete n[id]; return n; }), 8000);
    } catch { alert("No se pudo desencriptar"); }
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); };

  const TYPE_LABELS = { api_key: "API Key", password: "Password", token: "Token", oauth: "OAuth", secret: "Secret", other: "Otro" };
  const ENV_COLOR = { production: "bg-emerald-100 text-emerald-800", staging: "bg-amber-100 text-amber-800", dev: "bg-sky-100 text-sky-800", other: "bg-slate-100 text-slate-600" };

  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">{items.length} credencial{items.length !== 1 ? "es" : ""} encriptada{items.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Credencial</button>
      </div>
      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-3xl border bg-white p-6 grid gap-3 md:grid-cols-3">
          <label className="block"><Label>Etiqueta *</Label><input required className={inputClass} placeholder="Supabase Anon Key, Billin…" value={form.label} onChange={(e) => setForm(p => ({...p, label: e.target.value}))} /></label>
          <label className="block"><Label>Servicio</Label><input className={inputClass} placeholder="supabase, billin, vercel…" value={form.service} onChange={(e) => setForm(p => ({...p, service: e.target.value}))} /></label>
          <label className="block"><Label>Tipo</Label>
            <select className={inputClass} value={form.credential_type} onChange={(e) => setForm(p => ({...p, credential_type: e.target.value}))}>
              {Object.entries(TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="block md:col-span-2"><Label>Valor *</Label><input required type="password" className={inputClass} placeholder="Se guardara encriptado" value={form.plain_value} onChange={(e) => setForm(p => ({...p, plain_value: e.target.value}))} /></label>
          <label className="block"><Label>Entorno</Label>
            <select className={inputClass} value={form.environment} onChange={(e) => setForm(p => ({...p, environment: e.target.value}))}>
              <option value="production">Produccion</option><option value="staging">Staging</option><option value="dev">Dev</option><option value="other">Otro</option>
            </select>
          </label>
          <label className="block md:col-span-3"><Label>Notas</Label><input className={inputClass} value={form.notes} onChange={(e) => setForm(p => ({...p, notes: e.target.value}))} /></label>
          <div className="md:col-span-3 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">Cancelar</button>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Guardar encriptado</button>
          </div>
        </form>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : items.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin credenciales. Agrega API keys, tokens, passwords aqui de forma segura.</p> :
        <div className="grid gap-2">{items.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl border bg-white p-4">
            <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-amber-100 text-lg shrink-0">🔐</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{c.label}</p>
                {c.service ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">{c.service}</span> : null}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{TYPE_LABELS[c.credential_type]}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ENV_COLOR[c.environment]}`}>{c.environment}</span>
              </div>
              {revealed[c.id] ? (
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded bg-slate-900 px-3 py-1 text-xs text-emerald-400 font-mono">{revealed[c.id]}</code>
                  <button onClick={() => copyToClipboard(revealed[c.id])} className="text-xs text-blue-600 hover:underline">Copiar</button>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-400 font-mono">••••••••••••</p>
              )}
              {c.notes ? <p className="mt-1 text-xs text-slate-500">{c.notes}</p> : null}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              {!revealed[c.id] ? <button onClick={() => reveal(c.id)} className="text-xs text-blue-600 hover:underline">Mostrar</button> : null}
              <button onClick={async () => { if (confirm("¿Eliminar credencial?")) { await deleteCredential(c.id); reload(); } }} className="text-xs text-red-500">Eliminar</button>
            </div>
          </div>
        ))}</div>
      }
    </div>
  );
}

// =================== STACK ===================
function StackTab({ project }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "frontend", technology: "", version: "", notes: "" });

  const reload = async () => { setLoading(true); try { setItems(await listStack(project.id)); } finally { setLoading(false); } };
  useEffect(() => { reload(); }, [project.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createStackItem({ project_id: project.id, ...form, version: form.version || null, notes: form.notes || null });
    setForm({ category: "frontend", technology: "", version: "", notes: "" });
    setShowForm(false);
    reload();
  };

  const CATEGORY_LABELS = { frontend: "Frontend", backend: "Backend", database: "Base de datos", hosting: "Hosting", auth: "Auth", payments: "Pagos", analytics: "Analytics", ci_cd: "CI/CD", other: "Otro" };
  const CATEGORY_COLORS = { frontend: "bg-blue-100 text-blue-800", backend: "bg-purple-100 text-purple-800", database: "bg-emerald-100 text-emerald-800", hosting: "bg-orange-100 text-orange-800", auth: "bg-red-100 text-red-800", payments: "bg-amber-100 text-amber-800", analytics: "bg-cyan-100 text-cyan-800", ci_cd: "bg-slate-200 text-slate-800", other: "bg-slate-100 text-slate-600" };

  const grouped = items.reduce((acc, item) => { (acc[item.category] = acc[item.category] || []).push(item); return acc; }, {});

  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">{items.length} tecnologia{items.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Tecnologia</button>
      </div>
      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-3xl border bg-white p-6 grid gap-3 md:grid-cols-4">
          <label className="block"><Label>Categoria</Label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm(p => ({...p, category: e.target.value}))}>
              {Object.entries(CATEGORY_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="block"><Label>Tecnologia *</Label><input required className={inputClass} placeholder="React, Supabase, Vercel…" value={form.technology} onChange={(e) => setForm(p => ({...p, technology: e.target.value}))} /></label>
          <label className="block"><Label>Version</Label><input className={inputClass} placeholder="19.0.0" value={form.version} onChange={(e) => setForm(p => ({...p, version: e.target.value}))} /></label>
          <label className="block"><Label>Notas</Label><input className={inputClass} value={form.notes} onChange={(e) => setForm(p => ({...p, notes: e.target.value}))} /></label>
          <div className="md:col-span-4 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">Cancelar</button>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Crear</button>
          </div>
        </form>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : items.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin stack definido. Documenta las tecnologias del proyecto.</p> :
        <div className="grid gap-4">
          {Object.entries(grouped).map(([cat, techs]) => (
            <div key={cat}>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 mb-2">{CATEGORY_LABELS[cat] || cat}</p>
              <div className="flex flex-wrap gap-2">
                {techs.map(s => (
                  <div key={s.id} className={`group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${CATEGORY_COLORS[cat]}`}>
                    {s.technology}{s.version ? <span className="text-[10px] opacity-70">v{s.version}</span> : null}
                    <button onClick={async () => { await deleteStackItem(s.id); reload(); }} className="ml-1 opacity-0 group-hover:opacity-100 text-xs transition">✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// =================== LINKS ===================
function LinksTab({ project }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", url: "", link_type: "other", notes: "" });

  const reload = async () => { setLoading(true); try { setItems(await listLinks(project.id)); } finally { setLoading(false); } };
  useEffect(() => { reload(); }, [project.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createLink({ project_id: project.id, ...form, notes: form.notes || null });
    setForm({ label: "", url: "", link_type: "other", notes: "" });
    setShowForm(false);
    reload();
  };

  const TYPE_ICON = { drive: "📁", notion: "📝", figma: "🎨", docs: "📄", board: "📋", slack: "💬", whatsapp: "📱", other: "🔗" };
  const TYPE_LABELS = { drive: "Google Drive", notion: "Notion", figma: "Figma", docs: "Documentacion", board: "Board/Kanban", slack: "Slack", whatsapp: "WhatsApp", other: "Otro" };

  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">{items.length} enlace{items.length !== 1 ? "s" : ""} externo{items.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Link</button>
      </div>
      {showForm ? (
        <form onSubmit={handleCreate} className="rounded-3xl border bg-white p-6 grid gap-3 md:grid-cols-3">
          <label className="block"><Label>Etiqueta *</Label><input required className={inputClass} placeholder="Drive del proyecto, Notion board…" value={form.label} onChange={(e) => setForm(p => ({...p, label: e.target.value}))} /></label>
          <label className="block"><Label>Tipo</Label>
            <select className={inputClass} value={form.link_type} onChange={(e) => setForm(p => ({...p, link_type: e.target.value}))}>
              {Object.entries(TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="block"><Label>Notas</Label><input className={inputClass} value={form.notes} onChange={(e) => setForm(p => ({...p, notes: e.target.value}))} /></label>
          <label className="block md:col-span-3"><Label>URL *</Label><input required type="url" className={inputClass} placeholder="https://…" value={form.url} onChange={(e) => setForm(p => ({...p, url: e.target.value}))} /></label>
          <div className="md:col-span-3 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">Cancelar</button>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Crear</button>
          </div>
        </form>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : items.length === 0 ? <p className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Sin enlaces. Agrega links a Drive, Notion, Figma, docs…</p> :
        <div className="grid gap-2">{items.map((l) => (
          <a key={l.id} href={l.url} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-2xl border bg-white p-4 hover:border-slate-400 hover:shadow-sm transition group">
            <span className="text-2xl shrink-0">{TYPE_ICON[l.link_type]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900">{l.label}</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{TYPE_LABELS[l.link_type]}</span>
              </div>
              <p className="mt-1 text-xs text-blue-600 truncate">{l.url}</p>
              {l.notes ? <p className="mt-1 text-xs text-slate-500">{l.notes}</p> : null}
            </div>
            <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); if (confirm("¿Eliminar enlace?")) { await deleteLink(l.id); reload(); } }} className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition shrink-0">✕</button>
          </a>
        ))}</div>
      }
    </div>
  );
}

// =================== HELPERS ===================
const inputClass = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500";
function InfoCard({ label, value }) { return <div className="rounded-xl border bg-slate-50 p-3"><Label>{label}</Label><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>; }
function Label({ children }) { return <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{children}</span>; }
