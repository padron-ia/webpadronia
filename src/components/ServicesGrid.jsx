const services = [
    {
        title: "Dejas de perder clientes por tardar en contestar",
        description: "La IA responde, filtra quién va en serio y te lo pasa listo. Tú solo cierras."
    },
    {
        title: "Cierras más sin perseguir a nadie",
        description: "Seguimientos que parecen tuyos, en el momento justo. Sin que tú muevas un dedo."
    },
    {
        title: "Tus clientes no se van sin avisar",
        description: "Sabemos quién está a punto de irse. Una llamada a tiempo vale más que diez anuncios."
    },
    {
        title: "Tu equipo deja de hacer trabajo de robot",
        description: "Lo que hoy lleva 3 horas, la IA lo hace en segundos. Tu gente se dedica a vender."
    },
    {
        title: "Tu equipo rinde el doble",
        description: "Las horas que hoy pierden en tareas mecánicas las dedican a lo que de verdad genera dinero."
    },
    {
        title: "Facturas más sin echar más horas",
        description: "Más leads atendidos, menos fugas. Resultado: más dinero, misma jornada."
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
