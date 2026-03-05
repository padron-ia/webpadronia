import { buildWhatsAppUrl } from "../lib/contact";
import { trackLeadEvent } from "../lib/analytics";

function Footer() {
    return (
        <footer id="contacto" className="border-t border-slate-200 bg-white px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div data-reveal className="fade-in-section">
                    <img src="/assets/logo-padron-ia-clean.png" alt="Padron IA" className="h-14 w-auto object-contain" />
                    <p className="mt-3 text-sm text-slate-600">
                        Automatización orientada a resultados para pequeñas y medianas empresas.
                    </p>
                </div>

                <div data-reveal className="fade-in-section text-sm text-slate-600">
                    <p>
                        WhatsApp:{" "}
                        <a
                            className="premium-link font-semibold text-slate-900"
                            href={buildWhatsAppUrl("Hola, tengo un negocio y me gustaría saber si podéis ayudarme a automatizar parte de mi operación. ¿Podemos hablar?")}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackLeadEvent("lead_whatsapp_click", { placement: "footer" })}
                        >
                            +34 664 40 13 28
                        </a>
                    </p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <a href="#" className="premium-link">Aviso legal</a>
                        <a href="#" className="premium-link">Privacidad</a>
                        <a href="#" className="premium-link">Cookies</a>
                    </p>
                    <p className="mt-2">© 2026 Padron IA. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
