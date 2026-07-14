import { BriefcaseBusiness, GraduationCap, ShoppingCart } from "lucide-react";

// Casos reales, anonimizados por confidencialidad (regla de marca: casos SIN nombres de cliente).
const cases = [
    {
        tag: "Tienda online",
        icon: ShoppingCart,
        subject: "Una tienda online con cientos de pedidos al mes",
        problem: "Cada semana una persona cuadraba el inventario a mano —la web contra el almacén—. Horas, y aun así se colaban errores.",
        solution: "Un sistema que cuenta y compara cada noche, y avisa al equipo en el móvil si algo no cuadra, antes de abrir.",
        results: ["Recuento semanal a mano → 0", "Descuadres detectados antes de abrir", "Avisos cada noche"]
    },
    {
        tag: "Escuela online",
        icon: GraduationCap,
        subject: "Una escuela de formación online con cientos de alumnas",
        problem: "Renovaciones y seguimiento de cada alumna a mano. Se escapaba quién no entraba y a quién le tocaba renovar.",
        solution: "Renovaciones, avisos y seguimiento automáticos, con cada paso trazado. El equipo habla con quien de verdad lo necesita.",
        results: ["Renovaciones sin perseguir", "Seguimiento por alumna", "Nada se cae entre grietas"]
    },
    {
        tag: "Despacho profesional",
        icon: BriefcaseBusiness,
        subject: "Un despacho con clientes y casos repartidos por todas partes",
        problem: "Clientes y casos entre hojas de cálculo, correos y cabezas. Buscar algo costaba media mañana.",
        solution: "Un CRM a medida que centraliza clientes, casos y documentación en un sitio, con avisos de lo que vence.",
        results: ["Menos trabajo de secretaría", "Todo en un sitio", "Nada se pierde"]
    }
];

function PortfolioSection() {
    return (
        <section id="portfolio" className="premium-gradient-plum relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-3xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        Casos reales
                    </p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-ink sm:text-4xl lg:text-5xl">
                        Sistemas funcionando en negocios reales
                    </h2>
                    <p data-reveal className="fade-in-section mt-5 text-slate-600">
                        No vendemos humo: esto ya está montado y funcionando cada día. Sin nombres, por confidencialidad de cada negocio.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {cases.map((c) => {
                        const Icon = c.icon;
                        return (
                            <article
                                key={c.subject}
                                data-reveal
                                className="fade-in-section glow-card flex flex-col rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(27,30,58,0.05)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-ink text-white">
                                        <Icon size={18} />
                                    </div>
                                    <span className="rounded-full border border-lavender/40 bg-lavender/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
                                        {c.tag}
                                    </span>
                                </div>

                                <h3 className="mt-4 text-lg leading-snug text-ink">{c.subject}</h3>

                                <p className="mt-3 text-sm text-slate-500">
                                    <span className="font-semibold text-slate-600">El problema:</span> {c.problem}
                                </p>
                                <p className="mt-2 text-sm text-slate-700">
                                    <span className="font-semibold text-ink">Lo que montamos:</span> {c.solution}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                    {c.results.map((r) => (
                                        <span
                                            key={r}
                                            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                                        >
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default PortfolioSection;
