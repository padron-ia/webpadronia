import { BriefcaseBusiness, GraduationCap, ShoppingCart } from "lucide-react";

const stageLabels = {
    Captacion: "Captar",
    Conversion: "Convertir",
    Nurturing: "Fidelizar",
    Operacion: "Operar mejor"
};

const sectorPlaybooks = [
    {
        sector: "Tienda online / Ecommerce",
        stage: "Operacion",
        icon: ShoppingCart,
        focus: "Cada semana alguien cuadra el inventario a mano —lo que dice la web contra lo que hay en el almacén— y aun así se cuelan errores: stock que no encaja, pedidos parados, avisos que no salen.",
        result: "El almacén se cuenta y se cuadra solo cada noche. Si algo no encaja, salta un aviso al móvil antes de que abras la tienda.",
        kpis: ["Stock cuadrado a diario", "0 recuentos a mano", "Avisos automáticos"]
    },
    {
        sector: "Escuela / Formación online",
        stage: "Nurturing",
        icon: GraduationCap,
        focus: "Altas, renovaciones y seguimiento de cada alumno a mano. Se te escapa quién no ha entrado, a quién le toca renovar y a quién habría que escribir esta semana.",
        result: "Renovaciones, avisos y seguimiento funcionando solos. Tú hablas con quien de verdad lo necesita, no persiguiendo a todos.",
        kpis: ["Renovaciones sin perseguir", "Seguimiento por alumno", "Menos bajas silenciosas"]
    },
    {
        sector: "Despachos y gestorías",
        stage: "Operacion",
        icon: BriefcaseBusiness,
        focus: "Tu equipo pierde horas al día contestando las mismas preguntas de siempre y persiguiendo documentación que no llega a tiempo.",
        result: "Menos trabajo de secretaría, la documentación entra sola y te queda capacidad para facturar más sin contratar.",
        kpis: ["Menos consultas repetidas", "Docs a tiempo", "Capacidad sin contratar"]
    }
];

const stageStyles = {
    Captacion: "border-lavender/40 bg-lavender/10 text-ink",
    Conversion: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Nurturing: "border-violet-200 bg-violet-50 text-violet-700",
    Operacion: "border-amber-200 bg-amber-50 text-amber-700"
};

const discoveryScript = [
    "Nos cuentas qué te come más tiempo cada semana.",
    "Vemos qué parte se está haciendo a mano y no debería.",
    "Te decimos qué automatizar primero para notar el cambio.",
    "Lo montamos mientras tu negocio sigue funcionando.",
    "Medimos: si no mejora, ajustamos.",
    "Cuando funciona, ampliamos al siguiente proceso."
];

const offers = [
    {
        name: "Resultado rápido",
        timeline: "7-10 días",
        idealFor: "Un problema concreto, resuelto en días. Lo urgente primero.",
        outcomes: ["Problema principal resuelto", "Primeros resultados medibles", "Tu negocio no para"]
    },
    {
        name: "Un proceso en automático",
        timeline: "2-4 semanas",
        idealFor: "Un proceso entero funcionando solo: inventario, renovaciones, atención… lo que más te come.",
        outcomes: ["Menos trabajo manual", "El proceso no falla", "Tu equipo, liberado"]
    },
    {
        name: "Tu operativa en piloto automático",
        timeline: "1-2 meses",
        idealFor: "Varios procesos conectados y midiéndose. Tú decides, los sistemas ejecutan.",
        outcomes: ["Operación automatizada", "Decides dónde pones tu tiempo", "Creces sin más carga"]
    }
];

function SolutionsBlueprint() {
    return (
        <section id="sectores" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-14">
                <div className="max-w-4xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Tu sector</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-ink sm:text-4xl lg:text-5xl">
                        ¿Qué parte de tu negocio se hace a mano y debería hacerse sola?
                    </h2>
                    <p data-reveal className="fade-in-section mt-5 text-slate-600">
                        Cada sector se atasca por un sitio distinto. Mira el tuyo y lo que cambia cuando la parte repetitiva se automatiza.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {sectorPlaybooks.map((item) => {
                        const Icon = item.icon;
                        const badgeClass = stageStyles[item.stage] || "border-slate-300 bg-slate-50 text-slate-700";

                        return (
                            <article key={item.sector} data-reveal className="fade-in-section glow-card rounded-2xl border border-slate-200 bg-white/90 p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-ink text-white">
                                        <Icon size={18} />
                                    </div>
                                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${badgeClass}`}>
                                        {stageLabels[item.stage] || item.stage}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-xl text-ink">{item.sector}</h3>
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

                <p data-reveal className="fade-in-section text-center text-slate-600">
                    ¿Tu sector no está aquí? Da igual: la parte repetitiva se automatiza en cualquier negocio.{" "}
                    <a href="#consultoria" className="font-semibold text-ink underline decoration-lavender decoration-2 underline-offset-4 hover:text-iris">Cuéntanos el tuyo</a>.
                </p>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div data-reveal className="fade-in-section rounded-3xl border border-slate-200 bg-white/95 p-7 shadow-[0_14px_45px_rgba(27,30,58,0.07)]">
                        <h3 className="text-2xl text-ink">15 minutos para ver qué se puede automatizar en tu negocio</h3>
                        <ul className="mt-5 space-y-3 text-slate-700">
                            {discoveryScript.map((step, idx) => (
                                <li key={step} className="flex gap-3">
                                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">{idx + 1}</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        {offers.map((offer) => (
                            <article key={offer.name} data-reveal className="fade-in-section glow-card rounded-2xl border border-slate-200 bg-white/95 p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 font-mono">{offer.timeline}</p>
                                <h3 className="mt-2 text-2xl text-ink">{offer.name}</h3>
                                <p className="mt-3 text-slate-700">{offer.idealFor}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {offer.outcomes.map((item) => (
                                        <span key={item} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <a href="#consultoria" className="premium-button mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                                    Cuéntanos qué te come el tiempo
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
