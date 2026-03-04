export const WHATSAPP_PHONE = "34664401328";

export const buildWhatsAppUrl = (message) => {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
};
