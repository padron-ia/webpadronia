const services = [
    {
        title: "Captura Multicanal",
        description: "Unificamos formularios, WhatsApp y correo en un flujo centralizado para no perder oportunidades."
    },
    {
        title: "Seguimiento Comercial",
        description: "Disparamos recordatorios y tareas automáticas para mejorar tiempos de respuesta y cierre."
    },
    {
        title: "Postventa y Soporte",
        description: "Priorizamos incidencias y respuestas repetitivas con automatizaciones guiadas por estado."
    },
    {
        title: "Operaciones Internas",
        description: "Estandarizamos aprobaciones y solicitudes entre equipos con trazabilidad completa."
    },
    {
        title: "Integraciones",
        description: "Conectamos herramientas como CRM, email y hojas de cálculo sin rehacer tu stack."
    },
    {
        title: "Optimización Continua",
        description: "Medimos resultados y mejoramos procesos por fases para sostener impacto real."
    }
];

function ServicesGrid() {
    return (
        <section id="servicios" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-3xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Servicios</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">Automatización diseñada para escalar</h2>
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
