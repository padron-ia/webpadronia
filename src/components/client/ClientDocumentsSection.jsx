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
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
};

const iconFor = (mime = "") => {
    if (mime.startsWith("image/")) return "🖼️";
    if (mime === "application/pdf") return "📄";
    if (mime.includes("sheet") || mime.includes("excel") || mime.includes("csv")) return "📊";
    if (mime.includes("word") || mime.includes("document")) return "📝";
    if (mime.includes("zip") || mime.includes("rar")) return "🗜️";
    return "📎";
};

export default function ClientDocumentsSection({ companyId, userId }) {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);
    const fileInputRef = useRef(null);

    const reload = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const list = await listDocuments({ companyId });
            setDocs(list);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { reload(); }, [companyId]);

    const handleFiles = async (fileList) => {
        const files = Array.from(fileList || []);
        if (!files.length || !companyId) return;
        setError("");
        setUploading(true);
        try {
            for (const file of files) {
                if (file.size > 50 * 1024 * 1024) {
                    throw new Error(`${file.name} supera el límite de 50 MB`);
                }
                await uploadClientFile({ file, companyId, clientVisible: true });
            }
            await reload();
        } catch (err) {
            setError(err.message || "No se pudo subir el archivo");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDownload = async (doc) => {
        const url = await getClientFileUrl(doc.file_url);
        if (!url) {
            setError("No se pudo generar el enlace de descarga");
            return;
        }
        window.open(url, "_blank", "noopener");
    };

    const handleDelete = async (doc) => {
        try {
            await removeClientFile({ id: doc.id, path: doc.file_url });
            setConfirmDelete(null);
            await reload();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="grid gap-6">
            <div className="rounded-3xl bg-white shadow-sm border border-stone-200/60 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Documentos</p>
                        <h2 className="mt-1 text-2xl text-stone-900" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Comparte tus archivos con nosotros</h2>
                        <p className="mt-2 text-sm text-stone-600 max-w-xl">Sube aquí lo que necesitemos para avanzar: logos, facturas, credenciales, briefings… Todo queda guardado y disponible en tu portal.</p>
                    </div>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 hover:bg-stone-800"
                        >
                            {uploading ? "Subiendo…" : "+ Subir archivo"}
                        </button>
                    </div>
                </div>

                <div
                    className="mt-5 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-8 text-center"
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                >
                    <p className="text-sm text-stone-600">Arrastra archivos aquí o pulsa <strong>Subir archivo</strong>. Máximo 50 MB por archivo.</p>
                </div>

                {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
            </div>

            <div className="rounded-3xl bg-white shadow-sm border border-stone-200/60">
                <div className="border-b border-stone-200/60 px-6 py-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-stone-600">
                        {loading ? "Cargando…" : `${docs.length} archivo${docs.length === 1 ? "" : "s"}`}
                    </h3>
                </div>

                {loading ? null : docs.length === 0 ? (
                    <div className="p-10 text-center text-sm text-stone-500">
                        Aún no has compartido ningún archivo.
                    </div>
                ) : (
                    <ul className="divide-y divide-stone-100">
                        {docs.map((doc) => {
                            const isMine = doc.uploaded_by === userId;
                            return (
                                <li key={doc.id} className="flex items-center gap-4 px-6 py-4">
                                    <div className="text-2xl">{iconFor(doc.mime_type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-stone-900">{doc.title}</p>
                                        <p className="mt-0.5 text-xs text-stone-500">
                                            {formatSize(doc.file_size)}
                                            {doc.file_size ? " · " : ""}
                                            {formatDate(doc.created_at)}
                                            {isMine ? " · Subido por ti" : " · Compartido por Padrón IA"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(doc)}
                                            className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:border-stone-900"
                                        >
                                            Ver / descargar
                                        </button>
                                        {isMine ? (
                                            <button
                                                type="button"
                                                onClick={() => setConfirmDelete(doc)}
                                                className="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        ) : null}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {confirmDelete ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setConfirmDelete(null)}>
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <p className="text-sm font-semibold text-stone-900">¿Eliminar archivo?</p>
                        <p className="mt-1 text-sm text-stone-600">Se borrará <strong>{confirmDelete.title}</strong> y ya no estará disponible.</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={() => setConfirmDelete(null)} className="rounded-full px-4 py-2 text-xs font-semibold text-stone-600">Cancelar</button>
                            <button onClick={() => handleDelete(confirmDelete)} className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white">Eliminar</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
