const services = [
    {
        title: "Todo en un mismo sitio",
        description: "Tus mensajes de WhatsApp, formularios web y correos llegan a un solo lugar. Nada se pierde, nadie se olvida."
    },
    {
        title: "Seguimiento que no depende de ti",
        description: "El sistema recuerda por ti: envía mensajes, crea tareas y avisa a tu equipo si un cliente lleva días sin respuesta."
    },
    {
        title: "Clientes contentos sin esfuerzo extra",
        description: "Las preguntas repetidas se contestan solas. Las urgencias se escalan al instante. Tu equipo solo interviene cuando de verdad hace falta."
    },
    {
        title: "Menos papeleo entre equipos",
        description: "Aprobaciones, solicitudes y procesos internos funcionan solos, con registro de quién hizo qué y cuándo."
    },
    {
        title: "Conectamos lo que ya usas",
        description: "Tus hojas de cálculo, tu email, tu calendario y tus herramientas actuales trabajan juntos sin que tengas que cambiar nada."
    },
    {
        title: "Mejoramos cada mes",
        description: "Revisamos qué funciona, qué no, y lo ajustamos. No te dejamos con algo montado y nos vamos."
    }
];

function ServicesGrid() {
    return (
        <section id="servicios" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-3xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Servicios</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">Automatización diseñada para que tu negocio crezca</h2>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {services.map((service) => (
                        <article
                            key={service.title}
                            data-reveal
                            className="fade-in-section glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]"
                        >
                            <h3 className="text-xl text-slate-900">{service.title}</h3>
                            <p className="mt-3 leading-relaxed text-slate-600">{service.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesGrid;
