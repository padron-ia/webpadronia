const services = [
    {
        title: "Dejas de perder clientes por no contestar",
        description: "Cada persona que te escribe recibe respuesta en segundos. Tú no tocas nada. Ellos compran antes de que tu competencia les coja el teléfono."
    },
    {
        title: "Cierras más sin perseguir a nadie",
        description: "Los interesados reciben seguimiento hasta que compran o dicen que no. Sin que tú mandes un solo mensaje manual."
    },
    {
        title: "Tus clientes no se van",
        description: "Detectamos cuándo un cliente se está enfriando y actuamos antes de que se largue. Menos bajas, más ingresos recurrentes."
    },
    {
        title: "Tu equipo deja de hacer trabajo de robot",
        description: "Las horas que hoy pierden en copiar datos, mandar recordatorios y rellenar Excel las dedican a lo que genera dinero."
    },
    {
        title: "Te ahorras un sueldo (o dos)",
        description: "Lo que antes necesitaba una persona a jornada completa ahora se hace solo. Mismo resultado, fracción del coste."
    },
    {
        title: "Facturas más sin trabajar más horas",
        description: "Tu negocio crece pero tus horas no. Más clientes, más ingresos, misma o menos carga para ti."
    }
];

function ServicesGrid() {
    return (
        <section id="servicios" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-3xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Resultados</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">Esto es lo que cambia en tu negocio desde el primer mes</h2>
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
