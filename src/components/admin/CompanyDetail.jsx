import { useEffect, useState } from "react";
import { getCompany } from "../../lib/companiesService";
import { listContacts, deleteContact } from "../../lib/contactsService";
import { listProjects, createProject } from "../../lib/projectsService";
import { listActivity, logActivity } from "../../lib/activityService";
import { listClientUsersByCompany, createClientUser } from "../../lib/clientUsersService";
import { listPendingInvites, finalizeInvite } from "../../lib/inviteService";
import { supabase } from "../../lib/supabaseClient";
import CompanyForm from "./CompanyForm";
import ContactForm from "./ContactForm";
import InviteClientModal from "./InviteClientModal";

const TABS = [
  { id: "info", label: "Información" },
  { id: "contacts", label: "Contactos" },
  { id: "projects", label: "Proyectos" },
  { id: "access", label: "Acceso al portal" },
  { id: "activity", label: "Actividad" }
];

export default function CompanyDetail({ companyId, onBack }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("info");
  const [editing, setEditing] = useState(false);

  const reload = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const c = await getCompany(companyId);
      setCompany(c);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [companyId]);

  if (loading) return <p className="text-sm text-slate-500">Cargando empresa…</p>;
  if (!company) return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
      Empresa no encontrada.
      <button onClick={onBack} className="ml-3 underline">Volver</button>
    </div>
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={onBack} className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 hover:text-slate-900">
            ← Volver a empresas
          </button>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{company.legal_name}</h2>
          {company.commercial_name && company.commercial_name !== company.legal_name ? (
            <p className="text-sm text-slate-600">{company.commercial_name}</p>
          ) : null}
        </div>
        <button onClick={() => setEditing(true)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900">
          Editar empresa
        </button>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {editing ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Editar empresa</h3>
            <button onClick={() => setEditing(false)} className="text-sm text-slate-500">✕ Cerrar</button>
          </div>
          <CompanyForm company={company} onSaved={() => { setEditing(false); reload(); }} onCancel={() => setEditing(false)} />
        </div>
      ) : null}

      {tab === "info" ? <InfoTab company={company} /> : null}
      {tab === "contacts" ? <ContactsTab company={company} /> : null}
      {tab === "projects" ? <ProjectsTab company={company} /> : null}
      {tab === "access" ? <AccessTab company={company} /> : null}
      {tab === "activity" ? <ActivityTab company={company} /> : null}
    </div>
  );
}

// =================== INFO TAB ===================
function InfoTab({ company }) {
  const addr = company.billing_address || {};
  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-2">
      <Row label="Razón social" value={company.legal_name} />
      <Row label="Nombre comercial" value={company.commercial_name} />
      <Row label={`${company.tax_id_type} / Identificación fiscal`} value={company.tax_id} />
      <Row label="Etapa" value={company.lifecycle_stage} />
      <Row label="Email" value={company.email} />
      <Row label="Teléfono" value={company.phone} />
      <Row label="Web" value={company.website} />
      <Row label="Sector" value={company.sector} />
      <Row label="Tamaño" value={company.company_size} />
      <Row label="Origen" value={company.source} />
      <Row label="IVA por defecto" value={company.default_vat + "%"} />
      <Row label="IRPF por defecto" value={company.default_irpf + "%"} />
      <Row label="Moneda" value={company.currency} />
      <div className="md:col-span-2">
        <Label>Dirección fiscal</Label>
        <p className="mt-1 text-sm text-slate-700">
          {[addr.street, addr.number, addr.floor].filter(Boolean).join(", ") || "-"}
          {addr.postal_code || addr.city ? <br /> : null}
          {[addr.postal_code, addr.city, addr.province].filter(Boolean).join(" ")}
          {addr.country ? `, ${addr.country}` : ""}
        </p>
      </div>
      {company.notes ? (
        <div className="md:col-span-2">
          <Label>Notas internas</Label>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{company.notes}</p>
        </div>
      ) : null}
    </div>
  );
}

// =================== CONTACTS TAB ===================
function ContactsTab({ company }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [inviteTarget, setInviteTarget] = useState(null);

  const reload = async () => {
    setLoading(true);
    try {
      setContacts(await listContacts({ companyId: company.id }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [company.id]);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este contacto?")) return;
    await deleteContact(id);
    reload();
  };

  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button onClick={() => { setEditingContact(null); setShowForm(true); }} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          + Añadir contacto
        </button>
      </div>

      {showForm ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{editingContact ? "Editar contacto" : "Nuevo contacto"}</h3>
            <button onClick={() => setShowForm(false)} className="text-sm text-slate-500">✕</button>
          </div>
          <ContactForm
            contact={editingContact}
            companyId={company.id}
            onSaved={() => { setShowForm(false); setEditingContact(null); reload(); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Email / Teléfono</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">Cargando…</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">Sin contactos. Añade el primero.</td></tr>
            ) : contacts.map((c) => (
              <tr key={c.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-900">{c.full_name}</td>
                <td className="px-4 py-3 text-slate-700">{c.job_title || "-"}</td>
                <td className="px-4 py-3 text-slate-700">
                  {c.email || "-"}
                  {c.phone_mobile ? <div className="text-xs text-slate-500">{c.phone_mobile}</div> : null}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {c.is_primary ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">Principal</span> : null}
                    {c.is_decision_maker ? <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800">Decisor</span> : null}
                    {c.is_signer ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">Firmante</span> : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setInviteTarget(c)} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-900">
                      Invitar al portal
                    </button>
                    <button onClick={() => { setEditingContact(c); setShowForm(true); }} className="text-xs font-semibold text-slate-600 hover:text-slate-900">Editar</button>
                    <button onClick={() => handleDelete(c.id)} className="text-xs font-semibold text-red-600 hover:text-red-800">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inviteTarget ? (
        <InviteClientModal
          company={company}
          contact={inviteTarget}
          onClose={() => setInviteTarget(null)}
          onInvited={() => setInviteTarget(null)}
        />
      ) : null}
    </div>
  );
}

// =================== PROJECTS TAB ===================
function ProjectsTab({ company }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "active" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reload = async () => {
    setLoading(true);
    try {
      setProjects(await listProjects({ companyId: company.id }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [company.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("El título es obligatorio"); return; }
    setSaving(true);
    setError("");
    try {
      const project = await createProject({
        company_id: company.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status
      });
      await logActivity({
        company_id: company.id,
        project_id: project.id,
        type: "project_created",
        title: `Proyecto creado: ${project.title}`,
        client_visible: false
      });
      setForm({ title: "", description: "", status: "active" });
      setShowForm(false);
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">+ Nuevo proyecto</button>
      </div>

      {showForm ? (
        <form onSubmit={handleCreate} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">Nuevo proyecto</h3>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Título *</span>
            <input required className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Descripción</span>
            <textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Estado</span>
            <select className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              <option value="kickoff">Kickoff</option>
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
            </select>
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full px-4 py-2 text-sm text-slate-600">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? "Creando…" : "Crear"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-3">
        {loading ? <p className="text-sm text-slate-500">Cargando…</p> :
         projects.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Sin proyectos todavía.</p> :
         projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-semibold text-slate-900">{p.title}</p>
                {p.description ? <p className="mt-1 text-sm text-slate-600">{p.description}</p> : null}
                <p className="mt-2 text-xs text-slate-500">Creado {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{p.status}</span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  p.health === "on_track" ? "bg-emerald-100 text-emerald-800" :
                  p.health === "at_risk" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                }`}>{p.health}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== ACCESS TAB ===================
function AccessTab({ company }) {
  const [clientUsers, setClientUsers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [finalizeEmail, setFinalizeEmail] = useState("");
  const [finalizeError, setFinalizeError] = useState("");

  const reload = async () => {
    setLoading(true);
    try {
      setClientUsers(await listClientUsersByCompany(company.id));
      setPendingInvites(listPendingInvites().filter((p) => p.company_id === company.id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [company.id]);

  const handleFinalize = async () => {
    setFinalizeError("");
    if (!finalizeEmail.trim()) { setFinalizeError("Introduce el email del usuario"); return; }
    try {
      // Buscar el user por email en auth.users (requiere SQL directo via supabase)
      const { data: user, error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);
      if (error) throw error;
      if (!user?.length) {
        setFinalizeError("El usuario aún no ha accedido. Pídele que abra el magic link primero.");
        return;
      }
      // Nota: esta búsqueda es imperfecta; idealmente habría un endpoint admin.
      // Para MVP, el admin introduce manualmente el user_id.
      setFinalizeError("Para finalizar, introduce el user_id (lo puedes ver en Supabase Auth).");
    } catch (err) {
      setFinalizeError(err.message);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Usuarios con acceso al portal</h3>
        <button onClick={() => setShowInvite(true)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          + Invitar usuario
        </button>
      </div>

      {loading ? <p className="text-sm text-slate-500">Cargando…</p> : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white">
            <p className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
              Usuarios activos ({clientUsers.length})
            </p>
            {clientUsers.length === 0 ? (
              <p className="px-4 py-4 text-sm text-slate-500">No hay usuarios con acceso todavía.</p>
            ) : clientUsers.map((cu) => (
              <div key={cu.id} className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 first:border-t-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">User ID: <code className="text-xs">{cu.user_id.slice(0, 8)}…</code></p>
                  <p className="text-xs text-slate-500">Acceso: {cu.access_level} · Aceptado: {cu.accepted_at ? new Date(cu.accepted_at).toLocaleDateString() : "Pendiente"}</p>
                </div>
              </div>
            ))}
          </div>

          {pendingInvites.length > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-amber-800">Invitaciones pendientes (este navegador)</p>
              {pendingInvites.map((inv) => (
                <div key={inv.email + inv.company_id} className="flex items-center justify-between gap-2 py-1 text-sm text-amber-900">
                  <span>{inv.email} · {inv.status}</span>
                  <span className="text-xs">{new Date(inv.invited_at).toLocaleString()}</span>
                </div>
              ))}
              <p className="mt-2 text-xs text-amber-800">
                Cuando el usuario acepte el magic link y entre al portal, se creará un `profiles` automáticamente.
                Para asociarlo a esta empresa, ve a Supabase Auth, copia el user_id y usa <code>createClientUser</code>.
              </p>
            </div>
          ) : null}
        </>
      )}

      {showInvite ? (
        <InviteClientModal company={company} onClose={() => setShowInvite(false)} onInvited={() => { setShowInvite(false); reload(); }} />
      ) : null}
    </div>
  );
}

// =================== ACTIVITY TAB ===================
function ActivityTab({ company }) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");

  const reload = async () => {
    setLoading(true);
    try {
      setActivity(await listActivity({ companyId: company.id, limit: 50 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [company.id]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    await logActivity({
      company_id: company.id,
      type: "note",
      title: "Nota",
      body: newNote.trim(),
      client_visible: false
    });
    setNewNote("");
    reload();
  };

  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Añadir nota</span>
          <textarea
            rows={2}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Lo que has hablado, decisión tomada, seguimiento pendiente…"
          />
        </label>
        <div className="mt-2 flex justify-end">
          <button onClick={addNote} disabled={!newNote.trim()} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            Añadir
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        {loading ? <p className="text-sm text-slate-500">Cargando…</p> :
         activity.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Sin actividad registrada.</p> :
         activity.map((a) => (
          <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                {a.body ? <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{a.body}</p> : null}
                <p className="mt-1 text-xs text-slate-500">{new Date(a.created_at).toLocaleString()} · {a.type}</p>
              </div>
              {a.client_visible ? <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800">Visible cliente</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== Helpers de render ===================
function Row({ label, value }) {
  return (
    <div>
      <Label>{label}</Label>
      <p className="mt-1 text-sm text-slate-800">{value || "-"}</p>
    </div>
  );
}
function Label({ children }) {
  return <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{children}</span>;
}
