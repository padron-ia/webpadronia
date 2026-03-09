const services = [
    {
        title: "Todos tus contactos en un solo flujo",
        description: "WhatsApp, formularios y correo entran en el mismo sistema para que ningún lead se quede sin respuesta."
    },
    {
        title: "Seguimiento automático de oportunidades",
        description: "El sistema envía recordatorios, crea tareas y avisa al equipo cuando una oportunidad se enfría."
    },
    {
        title: "Atención rápida incluso fuera de horario",
        description: "Respondemos preguntas frecuentes al instante y escalamos casos clave para que no pierdas ventas por demora."
    },
    {
        title: "Procesos internos sin cuellos de botella",
        description: "Automatizamos aprobaciones y tareas repetitivas con trazabilidad para que el equipo trabaje con foco comercial."
    },
    {
        title: "Conectamos lo que ya usas",
        description: "Integramos CRM, calendario, hojas de cálculo y herramientas actuales para evitar trabajo duplicado."
    },
    {
        title: "Mejora continua con foco en ventas",
        description: "Medimos qué mensajes y procesos convierten mejor, y ajustamos cada mes para seguir escalando resultados."
    }
];

function ServicesGrid() {
    return (
        <section id="servicios" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-3xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Servicios</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">Automatización comercial para captar, responder y cerrar más</h2>
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
