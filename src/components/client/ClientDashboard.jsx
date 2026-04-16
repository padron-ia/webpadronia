import { useEffect, useState } from "react";
import { listProjectsForCurrentClient } from "../../lib/projectsService";

const STATUS_LABEL = { kickoff: "Arrancando", active: "En curso", paused: "Pausado", completed: "Completado", archived: "Archivado" };
const STATUS_COLOR = { kickoff: "bg-sky-100 text-sky-800", active: "bg-emerald-100 text-emerald-800", paused: "bg-amber-100 text-amber-800", completed: "bg-slate-100 text-slate-600", archived: "bg-slate-100 text-slate-400" };
const HEALTH_LABEL = { on_track: "En buen camino", at_risk: "En riesgo", off_track: "Fuera de plan" };
const HEALTH_COLOR = { on_track: "text-emerald-600", at_risk: "text-amber-600", off_track: "text-red-600" };

export default function ClientDashboard({ onOpenProject }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setProjects(await listProjectsForCurrentClient());
            } catch (err) {
                console.error("Error cargando proyectos del cliente:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-slate-500">Cargando tus proyectos…</p>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-4xl mb-4">📋</p>
                <h2 className="text-xl font-semibold text-slate-900">Bienvenida a tu portal</h2>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                    Aquí verás el estado de tus proyectos, los entregables que vayamos produciendo y toda la información relevante de nuestra colaboración. De momento no hay proyectos activos.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Tus proyectos</h1>
                <p className="mt-1 text-sm text-slate-600">Haz clic en cualquier proyecto para ver los entregables y el seguimiento.</p>
            </div>

            <div className="grid gap-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => onOpenProject(project)}
                        className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
                    >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">{project.title}</h3>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[project.status]}`}>{STATUS_LABEL[project.status]}</span>
                                </div>
                                {project.description ? (
                                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{project.description}</p>
                                ) : null}
                                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                                    {project.code ? <span className="font-mono">{project.code}</span> : null}
                                    {project.start_date ? <span>Inicio: {project.start_date}</span> : null}
                                    <span className={`font-semibold ${HEALTH_COLOR[project.health]}`}>{HEALTH_LABEL[project.health]}</span>
                                </div>
                            </div>
                            <span className="text-slate-400 group-hover:text-slate-600 text-xl transition">→</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
