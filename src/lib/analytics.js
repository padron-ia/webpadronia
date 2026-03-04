const pushDataLayer = (event, payload) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
};

export const trackLeadEvent = (event, payload = {}) => {
    if (typeof window === "undefined") return;

    pushDataLayer(event, payload);

    if (typeof window.gtag === "function") {
        window.gtag("event", event, payload);
    }

    if (typeof window.fbq === "function") {
        window.fbq("trackCustom", event, payload);
    }
};
