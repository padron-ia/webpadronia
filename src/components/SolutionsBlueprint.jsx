import { useMemo, useState } from "react";
import { BriefcaseBusiness, GraduationCap, Hospital, Building2, ShoppingCart, LifeBuoy } from "lucide-react";

const stageLabels = {
    Todos: "Todos",
    Captacion: "Captar clientes",
    Conversion: "Convertir oportunidades",
    Nurturing: "Fidelizar",
    Operacion: "Operar mejor"
};

const sectorPlaybooks = [
    {
        sector: "Entrenadores Personales",
        stage: "Conversion",
        type: "Fitness",
        icon: BriefcaseBusiness,
        focus: "Evita que los interesados se enfríen entre mensajes y seguimientos manuales",
        result: "Más entrevistas cerradas, agenda ordenada y mejor ratio de alta.",
        kpis: ["Entrevistas cerradas", "Tasa de respuesta", "Altas semanales"]
    },
    {
        sector: "Restaurantes y Hostelería",
        stage: "Captacion",
        type: "Servicios",
        icon: Building2,
        focus: "Gestiona reservas y confirmaciones sin saturar al equipo en horas punta",
        result: "Más reservas confirmadas y menos cancelaciones de última hora.",
        kpis: ["Reservas confirmadas", "Cancelaciones", "Carga telefónica"]
    },
    {
        sector: "Gestorías y Despachos",
        stage: "Operacion",
        type: "B2B",
        icon: BriefcaseBusiness,
        focus: "Ordena entradas de documentación y reduce consultas repetidas de clientes",
        result: "Menos tiempo en tareas administrativas y más capacidad para trabajo de valor.",
        kpis: ["Documentos procesados", "Tiempo de gestión", "Consultas resueltas"]
    },
    {
        sector: "Inmobiliaria",
        stage: "Captacion",
        type: "Servicios",
        icon: Building2,
        focus: "Filtra contactos con intención real para priorizar visitas con potencial",
        result: "Menos visitas improductivas y más oportunidades bien calificadas.",
        kpis: ["Tiempo de respuesta", "Visitas útiles", "Tasa de cierre"]
    },
    {
        sector: "Ecommerce",
        stage: "Captacion",
        type: "Ecommerce",
        icon: ShoppingCart,
        focus: "Activa seguimiento comercial para recuperar carritos y dudas de compra",
        result: "Más conversaciones con intención y mayor conversión en campañas.",
        kpis: ["Recuperación de carritos", "Conversaciones de venta", "Conversión"]
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
    "Detectamos dónde estás perdiendo ventas, tiempo y margen.",
    "Definimos el cambio con mayor impacto económico inmediato.",
    "Lo ponemos en marcha sin frenar la operación diaria.",
    "Medimos resultados reales en respuesta, conversión y carga del equipo.",
    "Ajustamos hasta que el proceso sea estable y rentable.",
    "Cuando funciona, lo escalamos sin aumentar complejidad innecesaria."
];

const offers = [
    {
        name: "Sprint de arranque",
        timeline: "7-10 días",
        idealFor: "Para salir del modo urgencia y recuperar control rápido.",
        outcomes: ["Cuello de botella identificado", "Primer cambio aplicado", "Impacto inicial medible"]
    },
    {
        name: "Sistema comercial",
        timeline: "2-4 semanas",
        idealFor: "Para vender más sin que tu equipo viva saturado.",
        outcomes: ["Mejor seguimiento", "Más oportunidades cerradas", "Proceso comercial predecible"]
    },
    {
        name: "Escalado operativo y de ventas",
        timeline: "1-2 meses",
        idealFor: "Para crecer con orden y sin depender de más horas del dueño.",
        outcomes: ["Operación estandarizada", "Visibilidad de indicadores", "Mejora continua del margen"]
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
                        Cada sector pierde dinero de una forma distinta. Lo resolvemos según tu realidad.
                    </h2>
                    <p data-reveal className="fade-in-section mt-5 text-slate-600">
                        El objetivo es el mismo en todos los casos: más ingresos, menos carga y una operación que no dependa de apagar fuegos.
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
                                    Quiero evaluar mi caso
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
