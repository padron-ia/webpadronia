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
        sector: "Gimnasios y Centros Deportivos",
        stage: "Captacion",
        type: "Fitness",
        icon: LifeBuoy,
        focus: "Pierdes socios cada mes porque nadie les hace seguimiento. Mientras tanto, los leads que te escriben se van a la competencia",
        result: "Más altas, menos bajas y clientes que se quedan meses, no semanas.",
        kpis: ["+30% retención", "Leads respondidos en <2 min", "Bajas reducidas"]
    },
    {
        sector: "Entrenadores Personales",
        stage: "Conversion",
        type: "Fitness",
        icon: BriefcaseBusiness,
        focus: "Te escriben 20 interesados al mes pero solo cierras 3 porque tardas en contestar y se te olvida hacer seguimiento",
        result: "Más alumnos con la misma inversión en publicidad. Sin perseguir a nadie.",
        kpis: ["x2 tasa de cierre", "0 leads perdidos", "Agenda llena"]
    },
    {
        sector: "Restaurantes y Hostelería",
        stage: "Captacion",
        type: "Servicios",
        icon: Building2,
        focus: "Mesas vacías por cancelaciones, teléfono que nadie coge en hora punta y reservas que se pierden por WhatsApp",
        result: "Más mesas llenas, menos cancelaciones y tu equipo centrado en servir, no en contestar.",
        kpis: ["-40% cancelaciones", "+25% reservas", "0 llamadas perdidas"]
    },
    {
        sector: "Gestorías y Despachos",
        stage: "Operacion",
        type: "B2B",
        icon: BriefcaseBusiness,
        focus: "Tu equipo pierde 3 horas al día contestando las mismas preguntas y persiguiendo documentación que no llega",
        result: "Menos trabajo de secretaría, más capacidad para facturar sin contratar.",
        kpis: ["-60% consultas repetidas", "Docs recibidos a tiempo", "+20% capacidad"]
    },
    {
        sector: "Inmobiliaria",
        stage: "Captacion",
        type: "Servicios",
        icon: Building2,
        focus: "Haces 15 visitas a la semana pero solo 2 tienen intención real. El resto te ha hecho perder la mañana",
        result: "Solo visitas a gente cualificada. Más cierres con menos kilómetros.",
        kpis: ["-70% visitas inútiles", "Leads filtrados", "+30% cierres"]
    },
    {
        sector: "Ecommerce",
        stage: "Captacion",
        type: "Ecommerce",
        icon: ShoppingCart,
        focus: "El 70% de tus carritos se abandonan y no haces nada al respecto. Ese dinero se va cada día",
        result: "Recuperas ventas que hoy pierdes sin mover un dedo.",
        kpis: ["+15% carritos recuperados", "Seguimiento 24/7", "+20% facturación"]
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
    "Nos cuentas qué te come más tiempo cada semana.",
    "Vemos dónde estás dejando dinero en la mesa.",
    "Te decimos qué tocar primero para notar el cambio.",
    "Lo montamos mientras tu negocio sigue funcionando.",
    "Medimos: si no mejora, ajustamos.",
    "Cuando funciona, ampliamos."
];

const offers = [
    {
        name: "Resultado rápido",
        timeline: "7-10 días",
        idealFor: "Un problema concreto resuelto en días. Lo urgente primero.",
        outcomes: ["Problema principal resuelto", "Primeros resultados medibles", "Tu negocio no para"]
    },
    {
        name: "Máquina de clientes",
        timeline: "2-4 semanas",
        idealFor: "Captación + seguimiento funcionando en automático.",
        outcomes: ["Más cierres", "Seguimiento que no falla", "Ingresos predecibles"]
    },
    {
        name: "Tu negocio en piloto automático",
        timeline: "1-2 meses",
        idealFor: "Ventas, operaciones y datos conectados. Tú decides, la IA ejecuta.",
        outcomes: ["Operaciones automatizadas", "Tú decides dónde pones tu tiempo", "Creces sin más carga"]
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
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Tu sector</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">
                        ¿Dónde está perdiendo dinero tu negocio ahora mismo?
                    </h2>
                    <p data-reveal className="fade-in-section mt-5 text-slate-600">
                        Cada sector sangra por un sitio distinto. Encuentra el tuyo y mira qué resultados puedes esperar.
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
                        <h3 className="text-2xl text-slate-900">15 minutos para saber cuánto dinero estás perdiendo</h3>
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
                                    Quiero saber cuánto estoy perdiendo
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
