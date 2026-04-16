import { useState } from "react";
import { createCompany, updateCompany } from "../../lib/companiesService";

const LIFECYCLE_STAGES = [
  { value: "prospect", label: "Prospect" },
  { value: "lead", label: "Lead" },
  { value: "opportunity", label: "Oportunidad" },
  { value: "client", label: "Cliente" },
  { value: "former", label: "Antiguo cliente" },
  { value: "partner", label: "Partner" },
  { value: "vendor", label: "Proveedor" }
];

const COMPANY_SIZES = [
  { value: "", label: "Sin especificar" },
  { value: "micro", label: "Micro (<10)" },
  { value: "small", label: "Pequeña (10-49)" },
  { value: "medium", label: "Mediana (50-249)" },
  { value: "large", label: "Grande (250+)" }
];

const SECTORS = [
  "Consultoría", "E-commerce", "Salud", "Formación", "Restauración",
  "Fitness / Deportes", "Servicios profesionales", "Tecnología",
  "Inmobiliaria", "Industria", "Educación", "Turismo", "Otro"
];

const emptyAddress = () => ({ street: "", number: "", floor: "", postal_code: "", city: "", province: "", country: "España" });

const makeInitialForm = (company) => ({
  legal_name: company?.legal_name || "",
  commercial_name: company?.commercial_name || "",
  tax_id: company?.tax_id || "",
  tax_id_type: company?.tax_id_type || "NIF",
  billing_address: company?.billing_address || emptyAddress(),
  phone: company?.phone || "",
  email: company?.email || "",
  website: company?.website || "",
  sector: company?.sector || "",
  company_size: company?.company_size || "",
  annual_revenue_range: company?.annual_revenue_range || "",
  default_vat: company?.default_vat ?? 21,
  default_irpf: company?.default_irpf ?? 0,
  currency: company?.currency || "EUR",
  lifecycle_stage: company?.lifecycle_stage || "prospect",
  source: company?.source || "",
  notes: company?.notes || ""
});

export default function CompanyForm({ company = null, onSaved, onCancel }) {
  const [form, setForm] = useState(() => makeInitialForm(company));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(company?.id);

  const setField = (key) => (event) => {
    const value = event.target?.type === "number" ? Number(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setAddress = (key) => (event) => {
    setForm((prev) => ({
      ...prev,
      billing_address: { ...prev.billing_address, [key]: event.target.value }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.legal_name.trim()) {
      setError("La razón social es obligatoria");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = isEditing
        ? await updateCompany(company.id, form)
        : await createCompany(form);
      onSaved?.(saved);
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Razón social *">
          <input className={inputClass} required value={form.legal_name} onChange={setField("legal_name")} />
        </Field>
        <Field label="Nombre comercial">
          <input className={inputClass} value={form.commercial_name} onChange={setField("commercial_name")} />
        </Field>
        <Field label="CIF / NIF">
          <input className={inputClass} value={form.tax_id} onChange={setField("tax_id")} />
        </Field>
        <Field label="Tipo identificación">
          <select className={inputClass} value={form.tax_id_type} onChange={setField("tax_id_type")}>
            <option value="NIF">NIF</option>
            <option value="CIF">CIF</option>
            <option value="VAT">VAT (intracomunitario)</option>
            <option value="EORI">EORI</option>
            <option value="OTHER">Otro</option>
          </select>
        </Field>
        <Field label="Email">
          <input type="email" className={inputClass} value={form.email} onChange={setField("email")} />
        </Field>
        <Field label="Teléfono">
          <input className={inputClass} value={form.phone} onChange={setField("phone")} />
        </Field>
        <Field label="Web">
          <input type="url" className={inputClass} placeholder="https://" value={form.website} onChange={setField("website")} />
        </Field>
        <Field label="Sector">
          <select className={inputClass} value={form.sector} onChange={setField("sector")}>
            <option value="">Sin especificar</option>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Tamaño empresa">
          <select className={inputClass} value={form.company_size} onChange={setField("company_size")}>
            {COMPANY_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Etapa del ciclo">
          <select className={inputClass} value={form.lifecycle_stage} onChange={setField("lifecycle_stage")}>
            {LIFECYCLE_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
      </div>

      <fieldset className="rounded-2xl border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-700">Dirección fiscal</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Calle">
            <input className={inputClass} value={form.billing_address?.street || ""} onChange={setAddress("street")} />
          </Field>
          <div className="grid gap-4 grid-cols-3">
            <Field label="Número">
              <input className={inputClass} value={form.billing_address?.number || ""} onChange={setAddress("number")} />
            </Field>
            <Field label="Piso">
              <input className={inputClass} value={form.billing_address?.floor || ""} onChange={setAddress("floor")} />
            </Field>
            <Field label="CP">
              <input className={inputClass} value={form.billing_address?.postal_code || ""} onChange={setAddress("postal_code")} />
            </Field>
          </div>
          <Field label="Ciudad">
            <input className={inputClass} value={form.billing_address?.city || ""} onChange={setAddress("city")} />
          </Field>
          <Field label="Provincia">
            <input className={inputClass} value={form.billing_address?.province || ""} onChange={setAddress("province")} />
          </Field>
          <Field label="País">
            <input className={inputClass} value={form.billing_address?.country || ""} onChange={setAddress("country")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-slate-700">Facturación por defecto</legend>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="IVA %">
            <input type="number" step="0.01" className={inputClass} value={form.default_vat} onChange={setField("default_vat")} />
          </Field>
          <Field label="IRPF %">
            <input type="number" step="0.01" className={inputClass} value={form.default_irpf} onChange={setField("default_irpf")} />
          </Field>
          <Field label="Moneda">
            <select className={inputClass} value={form.currency} onChange={setField("currency")}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </Field>
        </div>
      </fieldset>

      <Field label="Origen del contacto">
        <input className={inputClass} placeholder="landing, referido, evento…" value={form.source} onChange={setField("source")} />
      </Field>

      <Field label="Notas internas">
        <textarea rows={3} className={inputClass} value={form.notes} onChange={setField("notes")} />
      </Field>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center justify-end gap-3">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">Cancelar</button>
        ) : null}
        <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear empresa"}
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
