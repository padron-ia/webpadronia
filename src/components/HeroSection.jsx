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
                    Asistentes de IA que gestionan tu WhatsApp y agendan citas por ti 24/7
                </h1>
                <p data-reveal className="fade-in-section mt-6 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                    Deja que la tecnología atienda a tus clientes, clasifique interesados y llene tu agenda. Sin que tengas que aprender nada técnico.
                </p>

                <div data-reveal className="fade-in-section mt-10">
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Selecciona tu tipo de negocio:</p>
                    <div className="flex flex-wrap gap-3">
                        <a href="/entrenadores" className="premium-button inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-900 transition-all">
                            🏋️ Entrenadores
                        </a>
                        <a href="/restaurantes" className="premium-button inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-900 transition-all">
                            🍽️ Restaurantes
                        </a>
                        <a href="/gestorias" className="premium-button inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-900 transition-all">
                            💼 Gestorías
                        </a>
                        <a href="#consultoria" className="premium-button inline-flex items-center justify-center rounded-xl border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                            Otros sectores
                        </a>
                    </div>
                </div>

                <div data-reveal className="fade-in-section mt-10 flex flex-col gap-4 sm:flex-row border-t border-slate-100 pt-8">
                    <a
                        href={buildWhatsAppUrl(quickMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackLeadEvent("lead_whatsapp_click", { placement: "hero" })}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                        <span>O hablemos directamente por WhatsApp</span>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.237 3.483 8.42-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.233-3.803c1.635.971 3.559 1.484 5.519 1.485 5.832 0 10.577-4.745 10.58-10.58 0-2.825-1.1-5.482-3.098-7.48s-4.653-3.098-7.478-3.098c-5.83 0-10.575 4.745-10.578 10.58-.001 2.006.528 3.963 1.532 5.672l-1.02 3.733 3.823-.992zm11.088-7.554c-.199-.1-1.176-.58-1.358-.646-.182-.065-.315-.1-.448.1-.133.199-.514.646-.631.779-.116.133-.232.15-.431.05-.199-.1-.84-.31-1.599-.987-.59-.527-.989-1.177-1.105-1.376-.116-.199-.012-.307.088-.406.089-.089.199-.232.299-.348.1-.117.133-.199.199-.332.066-.133.033-.25-.017-.349-.05-.1-.448-1.079-.614-1.478-.162-.389-.339-.335-.465-.342l-.398-.008c-.133 0-.348.05-.53.25-.182.199-.696.68-.696 1.66 0 .979.713 1.925.813 2.058.1.133 1.399 2.137 3.39 3.001.473.205.843.326 1.129.418.475.15.908.128 1.25.078.381-.055 1.176-.481 1.341-.946.166-.465.166-.863.116-.946-.05-.083-.182-.133-.381-.233z" /></svg>
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
