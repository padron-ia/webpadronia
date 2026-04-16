import { useEffect, useState } from "react";
import { getProject } from "../../lib/projectsService";
import { listDeliverablesByProject } from "../../lib/deliverablesService";
import { listClientVisibleActivity } from "../../lib/activityService";
import { listMilestones } from "../../lib/projectOperationsService";
import { listTasks } from "../../lib/projectOperationsService";
import DeliverableViewer from "../../content/DeliverableViewer";

const STATUS_LABEL = { kickoff: "Arrancando", active: "En curso", paused: "Pausado", completed: "Completado" };
const HEALTH_LABEL = { on_track: "En buen camino", at_risk: "En riesgo", off_track: "Fuera de plan" };
const HEALTH_COLOR = { on_track: "bg-emerald-100 text-emerald-800", at_risk: "bg-amber-100 text-amber-800", off_track: "bg-red-100 text-red-800" };
const TYPE_ICON = { audit: "🔍", report: "📊", prototype: "🧪", document: "📄", presentation: "📽️", dashboard: "📈", training: "🎓" };
const TYPE_LABEL = { audit: "Auditoría", report: "Informe", prototype: "Prototipo", document: "Documento", presentation: "Presentación", dashboard: "Dashboard", training: "Formación" };

const TABS = [
    { id: "entregables", label: "Entregables" },
    { id: "progreso", label: "Progreso" },
    { id: "actividad", label: "Actividad" }
];

export default function ClientProjectView({ projectId, onBack }) {
    const [project, setProject] = useState(null);
    const [deliverables, setDeliverables] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("entregables");
    const [selectedDeliverable, setSelectedDeliverable] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [p, d, m, t, a] = await Promise.all([
                    getProject(projectId),
                    listDeliverablesByProject(projectId, { onlyPublished: true, onlyClientVisible: true }),
                    listMilestones(projectId),
                    listTasks({ projectId, clientVisibleOnly: true }),
                    listClientVisibleActivity({ projectId })
                ]);
                setProject(p);
                setDeliverables(d);
                setMilestones(m);
                setTasks(t);
                setActivity(a);
            } catch (err) {
                console.error("Error cargando proyecto:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [projectId]);

    if (loading) return <div className="flex justify-center py-20"><p className="text-sm text-slate-500">Cargando proyecto…</p></div>;
    if (!project) return <div className="rounded-2xl border bg-slate-50 p-6 text-sm text-slate-600">Proyecto no encontrado. <button onClick={onBack} className="underline ml-2">Volver</button></div>;

    if (selectedDeliverable) {
        return <DeliverableViewer deliverable={selectedDeliverable} onBack={() => setSelectedDeliverable(null)} />;
    }

    const completedMilestones = milestones.filter(m => m.completed_at).length;
    const totalMilestones = milestones.length;
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const totalTasks = tasks.length;

    return (
        <div className="grid gap-6">
            {/* Header */}
            <div>
                <button onClick={onBack} className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 hover:text-slate-900">← Volver a proyectos</button>
                <div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{project.title}</h1>
                        {project.description ? <p className="mt-1 text-sm text-slate-600 max-w-2xl">{project.description}</p> : null}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${HEALTH_COLOR[project.health]}`}>{HEALTH_LABEL[project.health]}</span>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Estado" value={STATUS_LABEL[project.status]} />
                <StatCard label="Entregables" value={`${deliverables.length}`} />
                <StatCard label="Hitos" value={totalMilestones > 0 ? `${completedMilestones}/${totalMilestones}` : "—"} />
                <StatCard label="Tareas visibles" value={totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "—"} />
            </div>

            {/* Progress bar */}
            {totalMilestones > 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-slate-900">Progreso general</p>
                        <p className="text-sm font-semibold text-slate-700">{totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%</p>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }} />
                    </div>
                </div>
            ) : null}

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200">
                {TABS.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tab === "entregables" ? (
                <div className="grid gap-3">
                    {deliverables.length === 0 ? (
                        <p className="rounded-2xl border bg-slate-50 p-6 text-center text-sm text-slate-600">Los entregables aparecerán aquí conforme vayamos avanzando.</p>
                    ) : deliverables.map((d) => (
                        <div key={d.id} onClick={() => setSelectedDeliverable(d)} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                            <div className="flex items-start gap-4">
                                <span className="text-3xl shrink-0">{TYPE_ICON[d.type] || "📦"}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base font-semibold text-slate-900">{d.title}</h3>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500">{TYPE_LABEL[d.type] || d.type}</span>
                                    </div>
                                    {d.description ? <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{d.description}</p> : null}
                                    <p className="mt-2 text-xs text-slate-400">{new Date(d.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {tab === "progreso" ? (
                <div className="grid gap-4">
                    {/* Milestones */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                        <h3 className="text-base font-semibold text-slate-900 mb-4">Hitos del proyecto</h3>
                        {milestones.length === 0 ? (
                            <p className="text-sm text-slate-500">Los hitos se irán definiendo conforme avance el proyecto.</p>
                        ) : (
                            <div className="space-y-3">
                                {milestones.map((m, idx) => (
                                    <div key={m.id} className="flex items-start gap-3">
                                        <div className="relative flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${m.completed_at ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                                                {m.completed_at ? "✓" : idx + 1}
                                            </div>
                                            {idx < milestones.length - 1 ? <div className="w-0.5 h-6 bg-slate-200 mt-1" /> : null}
                                        </div>
                                        <div className="pt-1">
                                            <p className={`text-sm font-semibold ${m.completed_at ? "text-emerald-700" : "text-slate-900"}`}>{m.title}</p>
                                            {m.description ? <p className="mt-0.5 text-xs text-slate-500">{m.description}</p> : null}
                                            <div className="mt-1 flex gap-3 text-xs text-slate-400">
                                                {m.due_date ? <span>Fecha: {m.due_date}</span> : null}
                                                {m.completed_at ? <span className="text-emerald-600">Completado {new Date(m.completed_at).toLocaleDateString()}</span> : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Visible tasks */}
                    {tasks.length > 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                            <h3 className="text-base font-semibold text-slate-900 mb-4">Tareas en curso</h3>
                            <div className="space-y-2">
                                {tasks.map((t) => (
                                    <div key={t.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 ${t.status === "done" ? "border-emerald-500 bg-emerald-500 text-white" : t.status === "in_progress" ? "border-sky-500 bg-sky-50" : "border-slate-300"}`}>
                                            {t.status === "done" ? "✓" : ""}
                                        </div>
                                        <p className={`text-sm flex-1 ${t.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>{t.title}</p>
                                        <span className="text-[10px] font-semibold uppercase text-slate-400">
                                            {t.status === "todo" ? "Pendiente" : t.status === "in_progress" ? "En curso" : t.status === "review" ? "En revisión" : t.status === "done" ? "Hecho" : t.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}

            {tab === "actividad" ? (
                <div className="grid gap-3">
                    {activity.length === 0 ? (
                        <p className="rounded-2xl border bg-slate-50 p-6 text-center text-sm text-slate-600">Las actualizaciones del proyecto aparecerán aquí.</p>
                    ) : activity.map((a) => (
                        <div key={a.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">
                                {a.type === "deliverable_added" ? "📦" : a.type === "project_created" ? "🚀" : a.type === "note" ? "💬" : "📌"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                                {a.body ? <p className="mt-1 text-sm text-slate-600">{a.body}</p> : null}
                                <p className="mt-1.5 text-xs text-slate-400">
                                    {new Date(a.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
        </div>
    );
}
