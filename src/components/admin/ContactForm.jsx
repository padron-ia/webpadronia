import { useState } from "react";
import { createContact, updateContact } from "../../lib/contactsService";

const makeInitialForm = (contact, companyId) => ({
  company_id: contact?.company_id || companyId || "",
  full_name: contact?.full_name || "",
  email: contact?.email || "",
  phone_mobile: contact?.phone_mobile || "",
  phone_landline: contact?.phone_landline || "",
  job_title: contact?.job_title || "",
  department: contact?.department || "",
  is_primary: contact?.is_primary || false,
  is_decision_maker: contact?.is_decision_maker || false,
  is_signer: contact?.is_signer || false,
  linkedin_url: contact?.linkedin_url || "",
  notes: contact?.notes || ""
});

export default function ContactForm({ contact = null, companyId, onSaved, onCancel }) {
  const [form, setForm] = useState(() => makeInitialForm(contact, companyId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(contact?.id);

  const setField = (key) => (event) => {
    const v = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: v }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.full_name.trim()) { setError("El nombre es obligatorio"); return; }
    setSaving(true);
    setError("");
    try {
      const saved = isEditing
        ? await updateContact(contact.id, form)
        : await createContact(form);
      onSaved?.(saved);
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre completo *">
          <input className={inputClass} required value={form.full_name} onChange={setField("full_name")} />
        </Field>
        <Field label="Cargo">
          <input className={inputClass} value={form.job_title} onChange={setField("job_title")} />
        </Field>
        <Field label="Email">
          <input type="email" className={inputClass} value={form.email} onChange={setField("email")} />
        </Field>
        <Field label="Departamento">
          <input className={inputClass} value={form.department} onChange={setField("department")} />
        </Field>
        <Field label="Teléfono móvil">
          <input className={inputClass} value={form.phone_mobile} onChange={setField("phone_mobile")} />
        </Field>
        <Field label="Teléfono fijo">
          <input className={inputClass} value={form.phone_landline} onChange={setField("phone_landline")} />
        </Field>
        <Field label="LinkedIn">
          <input type="url" className={inputClass} placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChange={setField("linkedin_url")} />
        </Field>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-600">Roles</p>
        <div className="grid gap-2 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_primary} onChange={setField("is_primary")} />
            Contacto principal
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_decision_maker} onChange={setField("is_decision_maker")} />
            Decisor
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_signer} onChange={setField("is_signer")} />
            Firmante
          </label>
        </div>
      </div>

      <Field label="Notas">
        <textarea rows={2} className={inputClass} value={form.notes} onChange={setField("notes")} />
      </Field>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center justify-end gap-3">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600">Cancelar</button>
        ) : null}
        <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Guardando..." : isEditing ? "Guardar" : "Añadir contacto"}
        </button>
      </div>
    </form>
  );
}

const inputClass = "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}
