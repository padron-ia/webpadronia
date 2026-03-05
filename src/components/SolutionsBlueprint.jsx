import { useMemo, useState } from "react";
import { BriefcaseBusiness, GraduationCap, Hospital, Building2, ShoppingCart, LifeBuoy } from "lucide-react";

const stageLabels = {
    Todos: "Todos",
    Captacion: "Atraer clientes",
    Conversion: "Cerrar ventas",
    Nurturing: "Fidelizar",
    Operacion: "Organizar"
};

const sectorPlaybooks = [
    {
        sector: "Servicios B2B",
        stage: "Conversion",
        type: "B2B",
        icon: BriefcaseBusiness,
        focus: "Encontrar empresas interesadas y no perderlas por el camino",
        result: "Más reuniones con clientes que de verdad quieren comprar.",
        kpis: ["Reuniones conseguidas", "Ventas cerradas"]
    },
    {
        sector: "Clínicas y estética",
        stage: "Conversion",
        type: "Servicios",
        icon: Hospital,
        focus: "Que tu agenda se llene sola y los pacientes no falten",
        result: "Menos huecos en agenda, más pacientes que vuelven.",
        kpis: ["Citas confirmadas", "Pacientes que asisten", "Coste por paciente"]
    },
    {
        sector: "Inmobiliaria",
        stage: "Captacion",
        type: "Servicios",
        icon: Building2,
        focus: "Filtrar los que solo miran de los que quieren comprar",
        result: "Menos visitas perdidas, más firmados.",
        kpis: ["Tiempo de respuesta", "Visitas agendadas", "Cierre"]
    },
    {
        sector: "Ecommerce",
        stage: "Captacion",
        type: "Ecommerce",
        icon: ShoppingCart,
        focus: "WhatsApp comercial y recuperación de oportunidades",
        result: "Más conversaciones de compra y mejor rendimiento de campañas.",
        kpis: ["Clics que compran", "Conversaciones que venden", "Rentabilidad de campañas"]
    },
    {
        sector: "Infoproducto y educación",
        stage: "Nurturing",
        type: "Info",
        icon: GraduationCap,
        focus: "Atraer interesados y convertirlos en alumnos sin perseguirlos",
        result: "Más inscripciones con seguimiento automático.",
        kpis: ["Coste por interesado", "Asistencia", "Ventas"]
    },
    {
        sector: "Soporte y operaciones",
        stage: "Operacion",
        type: "Operaciones",
        icon: LifeBuoy,
        focus: "Gestión de incidencias inteligente con escalado automático",
        result: "Menor carga operativa y mejor tiempo de respuesta.",
        kpis: ["Tiempo de resolución", "Incidencias reabiertas"]
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
    "Nos cuentas qué quieres conseguir en los próximos 3 meses.",
    "Identificamos dónde se te escapan clientes hoy.",
    "Vemos qué herramientas usas y qué tareas te comen el día.",
    "Entendemos tu cliente ideal y cómo facturas.",
    "Hablamos de lo que puedes invertir y quién decide.",
    "Te proponemos un plan por fases con resultados medibles."
];

const offers = [
    {
        name: "Empieza a responder rápido",
        timeline: "2-3 semanas",
        idealFor: "Para negocios que pierden clientes porque tardan en contestar.",
        outcomes: ["Mensajes centralizados", "Respuesta automática", "Sabes quién te escribe"]
    },
    {
        name: "Vende más sin más esfuerzo",
        timeline: "4-6 semanas",
        idealFor: "Para equipos que reciben muchas consultas pero cierran pocas.",
        outcomes: ["Filtro automático de interesados", "Agenda comercial limpia", "Seguimiento + informes semanales"]
    },
    {
        name: "Tu negocio funciona solo",
        timeline: "8-12 semanas",
        idealFor: "Para empresas que necesitan que todo esté conectado y controlado.",
        outcomes: ["Todo integrado en un sistema", "Soporte y procesos automáticos", "Control de costes y mejora continua"]
    }
];

function SolutionsBlueprint() {
    const [activeFilter, setActiveFilter] = useState("Todos");

    const filteredPlaybooks = useMemo(() => {
        if (activeFilter === "Todos") return sectorPlaybooks;
        return sectorPlaybooks.filter((item) => item.stage === activeFilter);
    }, [activeFilter]);

    return (
        <section id="sectores" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-14">
                <div className="max-w-4xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Soluciones por sector</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">
                        Cada negocio tiene su forma de perder clientes. Nosotros tenemos una solución para cada una.
                    </h2>
                    <p data-reveal className="fade-in-section mt-5 text-slate-600">
                        Hemos diseñado sistemas probados para los sectores donde más impacto generamos. Busca el tuyo.
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
                                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition ${isActive
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-300 bg-white/80 text-slate-700 hover:border-slate-400"
                                    }`}
                            >
                                {stageLabels[filter] || filter}
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
                                        {stageLabels[item.stage] || item.stage}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-xl text-slate-900">{item.sector}</h3>
                                <p className="mt-2 text-sm font-medium text-slate-500">{item.focus}</p>
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
                        <h3 className="text-2xl text-slate-900">Así funciona la primera conversación (15 min)</h3>
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
                                    Quiero saber si es para mí
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
