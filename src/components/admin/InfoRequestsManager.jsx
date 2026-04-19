import { useEffect, useState } from "react";
import { listInfoRequests, createInfoRequest, deleteInfoRequest, reopenInfoRequest } from "../../lib/infoRequestsService";
import { getClientFileUrl } from "../../lib/documentsService";

const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
};

export default function InfoRequestsManager({ companyId, projectId = null }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", due_date: "" });
    const [saving, setSaving] = useState(false);

    const reload = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const list = await listInfoRequests({ companyId, projectId: projectId || undefined });
            setRequests(list);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { reload(); }, [companyId, projectId]);

    const handleCreate = async (event) => {
        event.preventDefault();
        if (!form.title.trim()) return;
        setSaving(true);
        setError("");
        try {
            await createInfoRequest({
                company_id: companyId,
                project_id: projectId || null,
                title: form.title.trim(),
                description: form.description.trim() || null,
                due_date: form.due_date || null
            });
            setForm({ title: "", description: "", due_date: "" });
            setShowForm(false);
            await reload();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar esta solicitud?")) return;
        try {
            await deleteInfoRequest(id);
            await reload();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReopen = async (id) => {
        try {
            await reopenInfoRequest(id);
            await reload();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDownload = async (path) => {
        const url = await getClientFileUrl(path);
        if (url) window.open(url, "_blank", "noopener");
    };

    const pending = requests.filter((r) => r.status === "pending");
    const received = requests.filter((r) => r.status === "received");

    return (
        <div className="grid gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Solicitudes de información</h3>
                    <p className="text-xs text-slate-500">Pide archivos concretos al cliente. Verá la lista en su portal y podrá adjuntar cada uno.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    {showForm ? "Cancelar" : "+ Nueva solicitud"}
                </button>
            </div>

            {showForm ? (
                <form onSubmit={handleCreate} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Ej: Logo en SVG, Última factura emitida…"
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                    />
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Detalle opcional: formato, dónde encontrarlo, etc."
                        rows={3}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                    />
                    <label className="text-xs text-slate-600 grid gap-1">
                        Fecha límite (opcional)
                        <input
                            type="date"
                            value={form.due_date}
                            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                    </label>
                    <div className="flex justify-end">
                        <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                            {saving ? "Guardando…" : "Crear solicitud"}
                        </button>
                    </div>
                </form>
            ) : null}

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {loading ? (
                <p className="text-sm text-slate-500">Cargando…</p>
            ) : (
                <>
                    {pending.length > 0 ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50">
                            <p className="border-b border-amber-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-amber-800">Pendientes ({pending.length})</p>
                            <ul className="divide-y divide-amber-200/70">
                                {pending.map((req) => (
                                    <li key={req.id} className="flex items-start justify-between gap-3 px-4 py-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900">{req.title}</p>
                                            {req.description ? <p className="text-sm text-slate-600">{req.description}</p> : null}
                                            {req.due_date ? <p className="text-xs text-amber-700">Límite: {formatDate(req.due_date)}</p> : null}
                                        </div>
                                        <button onClick={() => handleDelete(req.id)} className="text-xs font-semibold text-slate-500 hover:text-red-600">Eliminar</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {received.length > 0 ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50">
                            <p className="border-b border-emerald-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800">Entregadas ({received.length})</p>
                            <ul className="divide-y divide-emerald-200/70">
                                {received.map((req) => (
                                    <li key={req.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900 truncate">{req.title}</p>
                                            <p className="text-xs text-emerald-700">Recibido {formatDate(req.received_at)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {req.document?.file_url ? (
                                                <button onClick={() => handleDownload(req.document.file_url)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-900">
                                                    Ver archivo
                                                </button>
                                            ) : null}
                                            <button onClick={() => handleReopen(req.id)} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Reabrir</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {pending.length === 0 && received.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                            Aún no hay solicitudes. Crea una para pedirle algo concreto al cliente.
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}
