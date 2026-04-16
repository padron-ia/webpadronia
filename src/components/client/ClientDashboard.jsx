import { useEffect, useState } from "react";
import { listProjectsForCurrentClient } from "../../lib/projectsService";
import { listDeliverablesByProject } from "../../lib/deliverablesService";
import { listClientVisibleActivity } from "../../lib/activityService";
import { listMilestones } from "../../lib/projectOperationsService";

const STATUS_LABEL = { kickoff: "Arrancando", active: "En curso", paused: "En pausa", completed: "Completado", archived: "Archivado" };
const HEALTH_ICON = { on_track: "🟢", at_risk: "🟡", off_track: "🔴" };
const HEALTH_TEXT = { on_track: "Todo va bien", at_risk: "Requiere atención", off_track: "Fuera de plan" };
const TYPE_ICON = { audit: "🔍", report: "📊", prototype: "🧪", document: "📄", presentation: "📽️", dashboard: "📈", training: "🎓" };

export default function ClientDashboard({ contactName, onOpenProject }) {
    const [projects, setProjects] = useState([]);
    const [projectDetails, setProjectDetails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const projs = await listProjectsForCurrentClient();
                setProjects(projs);

                // Cargar detalles del primer proyecto (deliverables, milestones, activity)
                if (projs.length > 0) {
                    const p = projs[0];
                    const [deliverables, milestones, activity] = await Promise.all([
                        listDeliverablesByProject(p.id, { onlyPublished: true, onlyClientVisible: true }),
                        listMilestones(p.id).catch(() => []),
                        listClientVisibleActivity({ projectId: p.id, limit: 5 }).catch(() => [])
                    ]);
                    setProjectDetails({
                        [p.id]: { deliverables, milestones, activity }
                    });
                }
            } catch (err) {
                console.error("Error cargando dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const firstName = contactName?.split(" ")[0] || "";
    const greeting = getGreeting();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-sm text-stone-500">Cargando tu portal…</p>
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-stone-200/60">
                <p className="text-4xl mb-4">👋</p>
                <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {firstName ? `${greeting}, ${firstName}` : `${greeting}`}
                </h2>
                <p className="mt-3 text-stone-600 max-w-md mx-auto">
                    Bienvenida a tu portal de cliente. Aquí verás el estado de tus proyectos, los entregables y toda la información de nuestra colaboración. Estamos preparando todo.
                </p>
            </div>
        );
    }

    const mainProject = projects[0];
    const details = projectDetails[mainProject.id] || { deliverables: [], milestones: [], activity: [] };
    const completedMilestones = details.milestones.filter(m => m.completed_at).length;
    const totalMilestones = details.milestones.length;
    const progressPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : null;

    return (
        <div className="grid gap-6">

            {/* BIENVENIDA */}
            <div className="rounded-3xl p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2E4036, #3d5549)" }}>
                <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%, -30%)" }} />
                <div className="relative z-10">
                    <p className="text-sm font-medium opacity-80">{greeting}</p>
                    <h1 className="mt-1 text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                        {firstName ? `Hola, ${firstName}` : "Bienvenida a tu portal"}
                    </h1>
                    <p className="mt-2 text-sm opacity-80 max-w-xl">
                        Aquí puedes ver el estado de tu proyecto, los entregables que vamos produciendo y el progreso general de nuestra colaboración.
                    </p>
                </div>
            </div>

            {/* PROYECTO PRINCIPAL */}
            <div className="rounded-3xl bg-white shadow-sm border border-stone-200/60 overflow-hidden">

                {/* Header del proyecto */}
                <div className="p-6 pb-4 cursor-pointer hover:bg-stone-50/50 transition" onClick={() => onOpenProject(mainProject)}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{mainProject.title}</h2>
                                <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: "#2E4036" }}>{STATUS_LABEL[mainProject.status]}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-stone-500">
                                <span>{HEALTH_ICON[mainProject.health]}</span>
                                <span>{HEALTH_TEXT[mainProject.health]}</span>
                                {mainProject.start_date ? <span className="ml-2">· Desde {formatDate(mainProject.start_date)}</span> : null}
                            </div>
                        </div>
                        <span className="text-stone-400 text-xl">→</span>
                    </div>

                    {/* Barra de progreso */}
                    {progressPct !== null ? (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-xs font-semibold text-stone-500">Progreso del proyecto</p>
                                <p className="text-sm font-bold text-stone-900">{progressPct}%</p>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, backgroundColor: "#2E4036" }} />
                            </div>
                            <p className="mt-1 text-[11px] text-stone-400">{completedMilestones} de {totalMilestones} hitos completados</p>
                        </div>
                    ) : null}
                </div>

                {/* ENTREGABLES */}
                {details.deliverables.length > 0 ? (
                    <div className="border-t border-stone-100 px-6 py-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-stone-900">{details.deliverables.length} entregable{details.deliverables.length !== 1 ? "s" : ""} disponible{details.deliverables.length !== 1 ? "s" : ""}</h3>
                            <button onClick={() => onOpenProject(mainProject)} className="text-xs font-semibold hover:underline" style={{ color: "#2E4036" }}>Ver todos →</button>
                        </div>
                        <div className="grid gap-2">
                            {details.deliverables.slice(0, 4).map((d) => (
                                <div key={d.id} onClick={() => onOpenProject(mainProject)} className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3 cursor-pointer hover:bg-stone-100 transition">
                                    <span className="text-xl shrink-0">{TYPE_ICON[d.type] || "📦"}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-stone-900 truncate">{d.title}</p>
                                        {d.description ? <p className="text-xs text-stone-500 truncate">{d.description}</p> : null}
                                    </div>
                                    <span className="text-xs text-stone-400 shrink-0">→</span>
                                </div>
                            ))}
                            {details.deliverables.length > 4 ? (
                                <p className="text-center text-xs text-stone-400 pt-1">y {details.deliverables.length - 4} más…</p>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                {/* ACTIVIDAD RECIENTE */}
                {details.activity.length > 0 ? (
                    <div className="border-t border-stone-100 px-6 py-5">
                        <h3 className="text-sm font-bold text-stone-900 mb-3">Actividad reciente</h3>
                        <div className="space-y-3">
                            {details.activity.slice(0, 3).map((a) => (
                                <div key={a.id} className="flex gap-3">
                                    <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        {a.type === "deliverable_added" ? "📦" : a.type === "project_created" ? "🚀" : "📌"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-stone-800">{a.title}</p>
                                        <p className="text-[11px] text-stone-400">{timeAgo(a.created_at)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* PROYECTOS ADICIONALES (si hay más de 1) */}
            {projects.length > 1 ? (
                <div className="grid gap-3">
                    <h3 className="text-sm font-bold text-stone-900">Otros proyectos</h3>
                    {projects.slice(1).map((p) => (
                        <div key={p.id} onClick={() => onOpenProject(p)} className="rounded-2xl bg-white border border-stone-200/60 p-4 cursor-pointer hover:border-stone-300 transition shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-stone-900">{p.title}</p>
                                    <p className="text-xs text-stone-500 mt-1">{HEALTH_ICON[p.health]} {HEALTH_TEXT[p.health]} · {STATUS_LABEL[p.status]}</p>
                                </div>
                                <span className="text-stone-400">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 7) return "Buenas noches";
    if (h < 13) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
}

function formatDate(d) {
    return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}

function timeAgo(date) {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Ahora mismo";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Hace ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return "Ayer";
    if (diffD < 7) return `Hace ${diffD} días`;
    return then.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}
