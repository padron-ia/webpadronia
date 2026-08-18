// Eventos de la web. Hasta el 18-ago-2026 esto empujaba a dataLayer, gtag() y fbq(),
// y NINGUNO de los tres existia en la pagina: cada clic de WhatsApp y cada envio de
// formulario se perdia. Instrumentacion decorativa. Ahora va a Umami, que si esta cargado.
const enviarAUmami = (event, payload) => {
    if (typeof window.umami?.track === "function") {
        window.umami.track(event, payload);
        return true;
    }
    return false;
};

export const trackLeadEvent = (event, payload = {}) => {
    if (typeof window === "undefined") return;

    const registrado = enviarAUmami(event, payload);

    // Si algun dia se añade GTM o gtag, esto los aprovecha sin tocar los componentes.
    if (typeof window.gtag === "function") window.gtag("event", event, payload);
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...payload });

    if (!registrado && import.meta.env.DEV) {
        console.warn(`[analytics] "${event}" no se registro: Umami no esta cargado.`);
    }
};
