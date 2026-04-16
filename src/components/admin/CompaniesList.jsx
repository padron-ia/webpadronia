import { useEffect, useMemo, useState } from "react";
import { listCompanies, countByLifecycle } from "../../lib/companiesService";
import CompanyForm from "./CompanyForm";

const STAGE_LABELS = {
  prospect: "Prospect",
  lead: "Lead",
  opportunity: "Oportunidad",
  client: "Cliente",
  former: "Antiguo",
  partner: "Partner",
  vendor: "Proveedor"
};

const STAGE_BADGE = {
  prospect: "bg-slate-100 text-slate-700",
  lead: "bg-sky-100 text-sky-800",
  opportunity: "bg-amber-100 text-amber-800",
  client: "bg-emerald-100 text-emerald-800",
  former: "bg-slate-100 text-slate-500",
  partner: "bg-purple-100 text-purple-800",
  vendor: "bg-stone-100 text-stone-700"
};

export default function CompaniesList({ onSelectCompany }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [summary, setSummary] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const [items, counts] = await Promise.all([
        listCompanies({ limit: 500 }),
        countByLifecycle()
      ]);
      setCompanies(items);
      setSummary(counts);
    } catch (err) {
      console.error("Error cargando empresas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (stageFilter !== "all" && c.lifecycle_stage !== stageFilter) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        (c.legal_name || "").toLowerCase().includes(q) ||
        (c.commercial_name || "").toLowerCase().includes(q) ||
        (c.tax_id || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.sector || "").toLowerCase().includes(q)
      );
    });
  }, [companies, search, stageFilter]);

  const onCreated = (company) => {
    setShowForm(false);
    load();
    if (company?.id && onSelectCompany) onSelectCompany(company);
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {["prospect", "lead", "opportunity", "client", "partner"].map((stage) => (
          <div key={stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{STAGE_LABELS[stage]}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{summary[stage] || 0}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
        <input
          className="flex-1 min-w-[220px] rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          placeholder="Buscar por razón social, CIF, email, sector…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        >
          <option value="all">Todas las etapas</option>
          {Object.entries(STAGE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          + Crear empresa
        </button>
      </div>

      {showForm ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Nueva empresa</h3>
            <button onClick={() => setShowForm(false)} className="text-sm text-slate-500">✕ Cerrar</button>
          </div>
          <CompanyForm onSaved={onCreated} onCancel={() => setShowForm(false)} />
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">CIF</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Etapa</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Creada</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">Cargando…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">No hay empresas que coincidan.</td></tr>
            ) : filtered.map((c) => (
              <tr
                key={c.id}
                className="cursor-pointer border-t border-slate-200 hover:bg-slate-50"
                onClick={() => onSelectCompany?.(c)}
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{c.legal_name}</p>
                  {c.commercial_name && c.commercial_name !== c.legal_name ? (
                    <p className="text-xs text-slate-500">{c.commercial_name}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-slate-700">{c.tax_id || "-"}</td>
                <td className="px-4 py-3 text-slate-700">{c.sector || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STAGE_BADGE[c.lifecycle_stage] || "bg-slate-100"}`}>
                    {STAGE_LABELS[c.lifecycle_stage] || c.lifecycle_stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {c.email || c.phone || "-"}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
