import { useMemo, useState } from "react";
import { BriefcaseBusiness, GraduationCap, Hospital, Building2, ShoppingCart, LifeBuoy } from "lucide-react";

const sectorPlaybooks = [
    {
        sector: "Servicios B2B",
        stage: "Conversion",
        type: "B2B",
        icon: BriefcaseBusiness,
        focus: "Prospeccion asistida y seguimiento estructurado",
        result: "Prospeccion mas inteligente y operacion comercial ordenada.",
        kpis: ["Reuniones calificadas", "Win rate"]
    },
    {
        sector: "Clinicas y estetica",
        stage: "Conversion",
        type: "Servicios",
        icon: Hospital,
        focus: "Agenda inteligente y seguimiento",
        result: "Mas citas asistidas y menos huecos perdidos.",
        kpis: ["Tasa de agenda", "Asistencia", "Coste por cita"]
    },
    {
        sector: "Inmobiliaria",
        stage: "Captacion",
        type: "Servicios",
        icon: Building2,
        focus: "Cualificacion automatica y priorizacion",
        result: "Agenda mas limpia y visitas con mejor probabilidad de cierre.",
        kpis: ["Tiempo de respuesta", "Visitas agendadas", "Cierre"]
    },
    {
        sector: "Ecommerce",
        stage: "Captacion",
        type: "Ecommerce",
        icon: ShoppingCart,
        focus: "WhatsApp comercial y recuperacion de oportunidades",
        result: "Mas conversaciones de compra y mejor rendimiento de campanas.",
        kpis: ["CTR", "Conversion conversacion-venta", "ROAS"]
    },
    {
        sector: "Infoproducto y educacion",
        stage: "Nurturing",
        type: "Info",
        icon: GraduationCap,
        focus: "Captacion continua y nurturing automatico",
        result: "Pipeline continuo de leads con nurturing automatico.",
        kpis: ["CPL", "Asistencia", "Conversion"]
    },
    {
        sector: "Soporte y operaciones",
        stage: "Operacion",
        type: "Operaciones",
        icon: LifeBuoy,
        focus: "Ticketing inteligente con escalado hibrido",
        result: "Menor carga operativa y mejor SLA.",
        kpis: ["Tiempo de resolucion", "Tickets reabiertos"]
    }
];

const stageStyles = {
    Captacion: "border-sky-200 bg-sky-50 text-sky-700",
    Conversion: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Nurturing: "border-violet-200 bg-violet-50 text-violet-700",
    Operacion: "border-amber-200 bg-amber-50 text-amber-700"
};

const stageFilters = ["Todos", "Captacion", "Conversion", "Nurturing", "Operacion"];

const discoveryScript = [
    "Objetivo de negocio en 90 dias y canal principal.",
    "Bloqueo principal: captacion, respuesta, cierre o seguimiento.",
    "Stack actual y tareas manuales que mas tiempo consumen.",
    "Criterios de lead cualificado, ticket medio y margen.",
    "Restricciones reales: presupuesto, equipo y aprobacion.",
    "Cierre: roadmap por fases con KPI y proxima accion."
];

const offers = [
    {
        name: "Starter Conversion",
        timeline: "2-3 semanas",
        idealFor: "Negocios que necesitan responder y convertir leads rapido.",
        outcomes: ["Canal de entrada ordenado", "Seguimiento inicial automatico", "Visibilidad basica de conversion"]
    },
    {
        name: "Growth Comercial",
        timeline: "4-6 semanas",
        idealFor: "Equipos con volumen de leads medio-alto que buscan escalar cierres.",
        outcomes: ["Cualificacion automatica", "Agenda comercial limpia", "Nurturing y reportes semanales"]
    },
    {
        name: "Scale Operativo",
        timeline: "8-12 semanas",
        idealFor: "Empresas con operaciones complejas y necesidad de trazabilidad total.",
        outcomes: ["Operacion multicanal integrada", "Automatizacion de soporte y procesos", "Control de costes y mejora continua"]
    }
];

function SolutionsBlueprint() {
    const [activeFilter, setActiveFilter] = useState("Todos");

    const filteredPlaybooks = useMemo(() => {
        if (activeFilter === "Todos") return sectorPlaybooks;
        return sectorPlaybooks.filter((item) => item.stage === activeFilter);
    }, [activeFilter]);

    return (
        <section id="blueprint" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-14">
                <div className="max-w-4xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Blueprint comercial</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">
                        Catalogo modular de flujos por sector
                    </h2>
                    <p data-reveal className="fade-in-section mt-5 text-slate-600">
                        Estructuramos cada proyecto en captacion, cualificacion, conversion, operacion y optimizacion para acelerar resultados sin rehacer todo desde cero.
                    </p>
                </div>

                <div data-reveal className="fade-in-section flex flex-wrap gap-2">
                    {stageFilters.map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                                    isActive
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-300 bg-white/80 text-slate-700 hover:border-slate-400"
                                }`}
                            >
                                {filter}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredPlaybooks.map((item) => {
                        const Icon = item.icon;
                        const badgeClass = stageStyles[item.stage] || "border-slate-300 bg-slate-50 text-slate-700";

                        return (
                        <article key={item.sector} data-reveal className="fade-in-section glow-card rounded-2xl border border-slate-200 bg-white/90 p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                                    <Icon size={18} />
                                </div>
                                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${badgeClass}`}>
                                    {item.stage}
                                </span>
                            </div>
                            <h3 className="mt-4 text-xl text-slate-900">{item.sector}</h3>
                            <p className="mt-2 text-sm font-medium text-slate-500">Enfoque: {item.focus}</p>
                            <p className="mt-3 text-slate-700">{item.result}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.kpis.map((kpi) => (
                                    <span
                                        key={kpi}
                                        className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                                    >
                                        {kpi}
                                    </span>
                                ))}
                            </div>
                        </article>
                    );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div data-reveal className="fade-in-section rounded-3xl border border-slate-200 bg-white/95 p-7 shadow-[0_14px_45px_rgba(15,23,42,0.07)]">
                        <h3 className="text-2xl text-slate-900">Guion discovery (15 min)</h3>
                        <ul className="mt-5 space-y-3 text-slate-700">
                            {discoveryScript.map((step, idx) => (
                                <li key={step} className="flex gap-3">
                                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">{idx + 1}</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        {offers.map((offer) => (
                            <article key={offer.name} data-reveal className="fade-in-section glow-card rounded-2xl border border-slate-200 bg-white/95 p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{offer.timeline}</p>
                                <h3 className="mt-2 text-2xl text-slate-900">{offer.name}</h3>
                                <p className="mt-3 text-slate-700">{offer.idealFor}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {offer.outcomes.map((item) => (
                                        <span key={item} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <a href="#consultoria" className="premium-button mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                                    Ver si encaja
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SolutionsBlueprint;
