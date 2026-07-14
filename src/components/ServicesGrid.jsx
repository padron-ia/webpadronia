const services = [
    {
        title: "Recuperas las horas que se van en lo repetitivo",
        description: "Cuadrar, copiar datos de un sitio a otro, contestar siempre lo mismo. Todo eso pasa a hacerse solo."
    },
    {
        title: "Dejas de perder cosas por hacerlas a mano",
        description: "Menos descuadres, menos pedidos parados, menos «se me pasó». El sistema no se despista."
    },
    {
        title: "Te enteras de lo que importa sin ir a mirar",
        description: "Un aviso al móvil cuando algo necesita tu atención. Verde si todo va bien, rojo si hay que mirar algo."
    },
    {
        title: "Tu equipo hace trabajo de persona, no de robot",
        description: "Lo aburrido lo hace la máquina. Tu gente se dedica a lo que de verdad requiere cabeza: vender, atender, cuidar."
    },
    {
        title: "Creces sin ampliar estructura",
        description: "Más volumen con la misma plantilla. La operativa aguanta porque ya no depende de manos disponibles."
    },
    {
        title: "Todo con sus números a la vista",
        description: "Medimos lo que ahorras. Si un sistema no da resultado, se ajusta. Sin humo y sin cifras infladas."
    }
];

function ServicesGrid() {
    return (
        <section id="servicios" className="premium-gradient-rose relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer premium-parallax-layer-soft" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-3xl">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Resultados</p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-ink sm:text-4xl lg:text-5xl">Lo que cambia cuando la parte repetitiva se automatiza</h2>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {services.map((service) => (
                        <article
                            key={service.title}
                            data-reveal
                            className="fade-in-section glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]"
                        >
                            <h3 className="text-xl text-ink">{service.title}</h3>
                            <p className="mt-3 leading-relaxed text-slate-600">{service.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesGrid;
