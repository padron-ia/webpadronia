import { buildWhatsAppUrl } from "../lib/contact";
import { trackLeadEvent } from "../lib/analytics";

function HeroSection() {
    const quickMessage = "Hola, tengo un negocio y creo que estoy perdiendo clientes por no responder a tiempo. ¿Podéis ayudarme?";

    return (
        <section id="hero" className="premium-gradient-plum relative overflow-hidden px-6 pb-20 pt-40 sm:px-10 lg:px-16">
            <div className="premium-parallax-layer" aria-hidden="true" />
            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Para negocios que quieren crecer sin contratar más</p>
                <h1 data-reveal className="fade-in-section mt-5 max-w-4xl text-5xl leading-[0.92] text-slate-900 sm:text-6xl lg:text-7xl">
                    Tu negocio pierde clientes mientras tu equipo repite las mismas tareas cada día
                </h1>
                <p data-reveal className="fade-in-section mt-6 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                    Hacemos que tu WhatsApp conteste solo, que tu agenda se llene sin llamar uno a uno, y que ningún cliente potencial se quede sin respuesta. Sin cambiar tus herramientas.
                </p>
                <div data-reveal className="fade-in-section mt-10 flex flex-col gap-4 sm:flex-row">
                    <a
                        href="#consultoria"
                        className="premium-button inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white"
                    >
                        Quiero dejar de perder clientes
                    </a>
                    <a
                        href={buildWhatsAppUrl(quickMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackLeadEvent("lead_whatsapp_click", { placement: "hero" })}
                        className="premium-button inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-7 py-3 text-sm font-semibold text-slate-900"
                    >
                        Hablemos por WhatsApp
                    </a>
                </div>

                <div data-reveal className="fade-in-section mt-12 max-w-5xl">
                    <div className="intro-video-frame overflow-hidden rounded-3xl bg-[#431844]">
                        <video
                            className="w-full"
                            src="/assets/padron-intro.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                            preload="metadata"
                        >
                            Tu navegador no soporta video HTML5.
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
