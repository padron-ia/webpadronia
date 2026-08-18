import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const HEALTH_DOT = { on_track: "bg-emerald-500", at_risk: "bg-amber-500", off_track: "bg-red-500" };
const TYPE_LABEL = { client: "Cliente", internal: "Interno" };

function PortfolioSection() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!supabase) return;
        supabase
            .from("projects")
            .select("id, title, description, status, health, project_type, domain, companies:company_id (commercial_name)")
            .in("status", ["active", "completed"])
            .order("updated_at", { ascending: false })
            .limit(6)
            .then(({ data }) => setProjects(data || []))
            .catch(() => {});
    }, []);

    if (projects.length === 0) return null;

    return (
        <section id="portfolio" className="premium-gradient-plum relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-3xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        Portfolio
                    </p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">
                        Proyectos en los que estamos trabajando
                    </h2>
                    <p data-reveal className="fade-in-section mt-5 text-slate-600">
                        No vendemos humo. Estos son proyectos reales en los que estamos metidos ahora mismo.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((p) => (
                        <article
                            key={p.id}
                            data-reveal
                            className="fade-in-section glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <h3 className="text-xl text-slate-900 truncate">{p.title}</h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {p.companies?.commercial_name || ""}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className={`w-2.5 h-2.5 rounded-full ${HEALTH_DOT[p.health] || "bg-slate-300"}`} />
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                        {TYPE_LABEL[p.project_type] || p.project_type}
                                    </span>
                                </div>
                            </div>
                            {p.description ? (
                                <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">{p.description}</p>
                            ) : null}
                            {p.domain ? (
                                <p className="mt-3 text-xs font-mono text-slate-400">{p.domain}</p>
                            ) : null}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PortfolioSection;
