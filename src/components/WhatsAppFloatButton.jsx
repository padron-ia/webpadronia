import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "../lib/contact";
import { trackLeadEvent } from "../lib/analytics";

function WhatsAppFloatButton() {
    return (
        <a
            href={buildWhatsAppUrl("Hola, quiero informacion sobre una consultoria.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLeadEvent("lead_whatsapp_click", { placement: "floating_button" })}
            className="whatsapp-float inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(37,211,102,0.45)]"
            aria-label="Consultar por WhatsApp"
        >
            <MessageCircle size={18} />
            <span className="hidden sm:inline">WhatsApp</span>
        </a>
    );
}

export default WhatsAppFloatButton;
