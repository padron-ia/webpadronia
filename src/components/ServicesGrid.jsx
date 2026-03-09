const services = [
    {
        title: "Más oportunidades atendidas",
        description: "Cada contacto recibe respuesta y seguimiento para que no se enfríe antes de comprar."
    },
    {
        title: "Más cierres, menos persecución manual",
        description: "Tu equipo deja de perseguir chats y se centra en conversaciones con intención real de compra."
    },
    {
        title: "Clientes mejor atendidos",
        description: "Respuestas rápidas y flujo claro para que el cliente avance sin bloqueos ni esperas eternas."
    },
    {
        title: "Menos caos interno",
        description: "Procesos ordenados y tareas claras para dejar de apagar fuegos todos los días."
    },
    {
        title: "Menos gasto por ineficiencias",
        description: "Reducimos trabajo duplicado y errores operativos que hoy te cuestan tiempo y margen."
    },
    {
        title: "Crecimiento con control",
        description: "Mejoras continuas para escalar sin perder calidad ni depender de más horas tuyas."
    }
];

function ServicesGrid() {
    return (
        <section id="servicios" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-3xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Servicios</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">Lo que gana tu negocio: más ventas, más tiempo y menos costes</h2>
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
