import { useEffect, useRef, useState } from "react";
import { listDocuments, uploadClientFile, getClientFileUrl, removeClientFile } from "../../lib/documentsService";

const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const iconFor = (mime = "") => {
    if (mime.startsWith("image/")) return "🖼️";
    if (mime === "application/pdf") return "📄";
    if (mime.includes("sheet") || mime.includes("excel") || mime.includes("csv")) return "📊";
    if (mime.includes("word") || mime.includes("document")) return "📝";
    if (mime.includes("zip") || mime.includes("rar")) return "🗜️";
    return "📎";
};

export default function DocumentsManager({ companyId, projectId = null }) {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const fileInputRef = useRef(null);

    const reload = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const list = await listDocuments({ companyId, projectId: projectId || undefined });
            setDocs(list);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { reload(); }, [companyId, projectId]);

    const handleFiles = async (fileList) => {
        const files = Array.from(fileList || []);
        if (!files.length || !companyId) return;
        setError("");
        setUploading(true);
        try {
            for (const file of files) {
                if (file.size > 50 * 1024 * 1024) throw new Error(`${file.name} supera 50 MB`);
                await uploadClientFile({
                    file,
                    companyId,
                    projectId: projectId || null,
                    category: "admin_share",
                    clientVisible: true
                });
            }
            await reload();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDownload = async (doc) => {
        const url = await getClientFileUrl(doc.file_url);
        if (!url) { setError("No se pudo generar enlace"); return; }
        window.open(url, "_blank", "noopener");
    };

    const handleDelete = async (doc) => {
        if (!confirm(`¿Eliminar ${doc.title}?`)) return;
        try {
            await removeClientFile({ id: doc.id, path: doc.file_url });
            await reload();
        } catch (err) { setError(err.message); }
    };

    const filtered = filter === "client"
        ? docs.filter((d) => d.category === "client_upload" || d.category === "info_request_reply")
        : filter === "admin"
            ? docs.filter((d) => d.category === "admin_share")
            : docs;

    return (
        <div className="grid gap-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Documentos</h3>
                    <p className="text-xs text-slate-500">Archivos compartidos entre la empresa y vosotros.</p>
                </div>
                <div className="flex items-center gap-2">
                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-slate-800">
                        {uploading ? "Subiendo…" : "+ Subir archivo"}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
                {[
                    { id: "all", label: `Todos (${docs.length})` },
                    { id: "client", label: `Subidos por cliente (${docs.filter((d) => d.category === "client_upload" || d.category === "info_request_reply").length})` },
                    { id: "admin", label: `Compartidos por nosotros (${docs.filter((d) => d.category === "admin_share").length})` }
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`rounded-full border px-3 py-1 font-semibold ${filter === f.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-600 hover:border-slate-900"}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {loading ? (
                <p className="text-sm text-slate-500">Cargando…</p>
            ) : filtered.length === 0 ? (
                <div
                    className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                >
                    Arrastra archivos aquí o pulsa <strong>Subir archivo</strong>.
                </div>
            ) : (
                <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
                    {filtered.map((doc) => {
                        const fromClient = doc.category === "client_upload" || doc.category === "info_request_reply";
                        return (
                            <li key={doc.id} className="flex items-center gap-4 px-4 py-3">
                                <div className="text-2xl">{iconFor(doc.mime_type)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-900">{doc.title}</p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {formatSize(doc.file_size)}
                                        {doc.file_size ? " · " : ""}
                                        {formatDate(doc.created_at)}
                                        {" · "}
                                        <span className={fromClient ? "text-amber-700 font-semibold" : "text-slate-500"}>
                                            {fromClient ? "Subido por el cliente" : "Compartido por nosotros"}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleDownload(doc)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-900">Ver / descargar</button>
                                    <button onClick={() => handleDelete(doc)} className="text-xs font-semibold text-slate-500 hover:text-red-600">Eliminar</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
