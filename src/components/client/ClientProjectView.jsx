import { useEffect, useState } from "react";
import { getProject } from "../../lib/projectsService";
import { listDeliverablesByProject } from "../../lib/deliverablesService";
import { listClientVisibleActivity } from "../../lib/activityService";
import { listMilestones } from "../../lib/projectOperationsService";
import { listTasks } from "../../lib/projectOperationsService";
import DeliverableViewer from "../../content/DeliverableViewer";

const HEALTH_ICON = { on_track: "🟢", at_risk: "🟡", off_track: "🔴" };
const HEALTH_TEXT = { on_track: "Todo va bien", at_risk: "Requiere atención", off_track: "Fuera de plan" };
const STATUS_LABEL = { kickoff: "Arrancando", active: "En curso", paused: "En pausa", completed: "Completado" };
const TYPE_ICON = { audit: "🔍", report: "📊", prototype: "🧪", document: "📄", presentation: "📽️", dashboard: "📈", training: "🎓" };
const TYPE_LABEL = { audit: "Auditoría", report: "Informe", prototype: "Prototipo", document: "Documento", presentation: "Presentación", dashboard: "Dashboard", training: "Formación" };

const TABS = [
    { id: "entregables", label: "Entregables", icon: "📦" },
    { id: "progreso", label: "Progreso", icon: "📈" },
    { id: "actividad", label: "Actividad", icon: "🔔" }
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
                    listMilestones(projectId).catch(() => []),
                    listTasks({ projectId, clientVisibleOnly: true }).catch(() => []),
                    listClientVisibleActivity({ projectId }).catch(() => [])
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

    if (loading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin"></div></div>;
    if (!project) return (
        <div className="rounded-3xl bg-white border border-stone-200/60 p-8 text-center shadow-sm">
            <p className="text-2xl mb-3">🔍</p>
            <p className="text-stone-600">No hemos podido cargar este proyecto.</p>
            <button onClick={onBack} className="mt-4 text-sm font-semibold underline" style={{ color: "#2E4036" }}>Volver a mis proyectos</button>
        </div>
    );

    if (selectedDeliverable) {
        return <DeliverableViewer deliverable={selectedDeliverable} onBack={() => setSelectedDeliverable(null)} />;
    }

    const completedMilestones = milestones.filter(m => m.completed_at).length;
    const totalMilestones = milestones.length;
    const progressPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : null;

    return (
        <div className="grid gap-6">

            {/* HEADER */}
            <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2E4036, #3d5549)" }}>
                <button onClick={onBack} className="text-xs font-medium opacity-70 hover:opacity-100 transition">← Volver a mis proyectos</button>
                <h1 className="mt-3 text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{project.title}</h1>
                <div className="mt-2 flex items-center gap-4 text-sm opacity-80 flex-wrap">
                    <span>{HEALTH_ICON[project.health]} {HEALTH_TEXT[project.health]}</span>
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-white/20">{STATUS_LABEL[project.status]}</span>
                </div>

                {progressPct !== null ? (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs opacity-70 mb-1">
                            <span>Progreso</span>
                            <span className="font-bold opacity-100">{progressPct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                            <div className="h-full rounded-full bg-white/80 transition-all" style={{ width: `${progressPct}%` }} />
                        </div>
                    </div>
                ) : null}
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-3">
                <StatCard label="Entregables" value={deliverables.length} />
                <StatCard label="Hitos" value={totalMilestones > 0 ? `${completedMilestones}/${totalMilestones}` : "—"} />
                <StatCard label="Actualizaciones" value={activity.length} />
            </div>

            {/* TABS */}
            <div className="flex gap-1 rounded-2xl bg-white p-1 shadow-sm border border-stone-200/60">
                {TABS.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            tab === t.id ? "text-white shadow-sm" : "text-stone-500 hover:text-stone-900"
                        }`}
                        style={tab === t.id ? { backgroundColor: "#2E4036" } : {}}>
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            {tab === "entregables" ? (
                <div className="grid gap-3">
                    {deliverables.length === 0 ? (
                        <EmptyState icon="📦" text="Los entregables aparecerán aquí conforme vayamos avanzando." />
                    ) : deliverables.map((d) => (
                        <div key={d.id} onClick={() => setSelectedDeliverable(d)}
                            className="group cursor-pointer rounded-2xl bg-white border border-stone-200/60 p-5 shadow-sm hover:shadow-md hover:border-stone-300 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: "#2E403610" }}>
                                    {TYPE_ICON[d.type] || "📦"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base font-semibold text-stone-900 group-hover:text-stone-700">{d.title}</h3>
                                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-stone-500 bg-stone-100">{TYPE_LABEL[d.type]}</span>
                                    </div>
                                    {d.description ? <p className="mt-1.5 text-sm text-stone-500 leading-relaxed line-clamp-2">{d.description}</p> : null}
                                </div>
                                <span className="text-stone-300 group-hover:text-stone-600 text-lg transition shrink-0 mt-1">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {tab === "progreso" ? (
                <div className="grid gap-4">
                    {milestones.length > 0 ? (
                        <div className="rounded-3xl bg-white border border-stone-200/60 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-stone-900 mb-5">Hitos del proyecto</h3>
                            <div className="space-y-0">
                                {milestones.map((m, idx) => (
                                    <div key={m.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${m.completed_at ? "text-white" : "bg-stone-100 text-stone-500"}`}
                                                style={m.completed_at ? { backgroundColor: "#2E4036" } : {}}>
                                                {m.completed_at ? "✓" : idx + 1}
                                            </div>
                                            {idx < milestones.length - 1 ? <div className="w-0.5 h-8 bg-stone-200 my-1" /> : null}
                                        </div>
                                        <div className="pb-6">
                                            <p className={`text-sm font-semibold ${m.completed_at ? "text-stone-400" : "text-stone-900"}`} style={m.completed_at ? { textDecoration: "line-through" } : {}}>{m.title}</p>
                                            {m.description ? <p className="mt-0.5 text-xs text-stone-400">{m.description}</p> : null}
                                            {m.due_date ? <p className="mt-1 text-[11px] text-stone-400">{m.completed_at ? `Completado` : `Fecha: ${m.due_date}`}</p> : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <EmptyState icon="🏁" text="Los hitos se irán definiendo conforme avance el proyecto." />}

                    {tasks.length > 0 ? (
                        <div className="rounded-3xl bg-white border border-stone-200/60 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-stone-900 mb-4">Tareas en curso</h3>
                            <div className="space-y-2">
                                {tasks.map((t) => (
                                    <div key={t.id} className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-2.5">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 ${t.status === "done" ? "border-emerald-500 bg-emerald-500 text-white" : t.status === "in_progress" ? "border-amber-400 bg-amber-50" : "border-stone-300"}`}>
                                            {t.status === "done" ? "✓" : ""}
                                        </div>
                                        <p className={`text-sm flex-1 ${t.status === "done" ? "line-through text-stone-400" : "text-stone-800"}`}>{t.title}</p>
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
                        <EmptyState icon="🔔" text="Las actualizaciones del proyecto aparecerán aquí." />
                    ) : activity.map((a) => (
                        <div key={a.id} className="flex gap-4 rounded-2xl bg-white border border-stone-200/60 p-4 shadow-sm">
                            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-sm shrink-0">
                                {a.type === "deliverable_added" ? "📦" : a.type === "project_created" ? "🚀" : "📌"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-stone-900">{a.title}</p>
                                {a.body ? <p className="mt-1 text-sm text-stone-500 line-clamp-2">{a.body}</p> : null}
                                <p className="mt-1.5 text-[11px] text-stone-400">{timeAgo(a.created_at)}</p>
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
        <div className="rounded-2xl bg-white border border-stone-200/60 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-stone-900">{value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-400 mt-1">{label}</p>
        </div>
    );
}

function EmptyState({ icon, text }) {
    return (
        <div className="rounded-3xl bg-white border border-stone-200/60 p-10 text-center shadow-sm">
            <p className="text-3xl mb-3">{icon}</p>
            <p className="text-sm text-stone-500">{text}</p>
        </div>
    );
}

function timeAgo(date) {
    const now = new Date(); const then = new Date(date);
    const diffMs = now - then; const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Ahora mismo";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Hace ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return "Ayer";
    if (diffD < 7) return `Hace ${diffD} días`;
    return then.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}
