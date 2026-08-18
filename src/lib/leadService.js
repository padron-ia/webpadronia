import { isSupabaseConfigured, supabase } from "./supabaseClient";

// El lead sale primero por un servicio que NO depende de esta base de datos
// (Vercel + Resend): manda el correo y guarda la fila. Así un corte o una pausa
// de Supabase deja de significar "lead perdido en silencio".
// Ver clients/_personal/padron-ia/projects/web-rework/ (auditoría 18-ago-2026).
const ENDPOINT_LEADS =
    import.meta.env.VITE_LEAD_ENDPOINT || "https://recados-sandy.vercel.app/api/lead";

const enviarAlServicio = async (payload) => {
    const respuesta = await fetch(ENDPOINT_LEADS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!respuesta.ok) {
        throw new Error(`El servicio de leads respondió ${respuesta.status}`);
    }

    return respuesta.json();
};

// Último recurso: escribir directo en la base. Si el servicio está caído pero la
// base responde, el lead se guarda igual (aunque no llegue el aviso por correo).
const guardarDirectoEnBase = async (payload) => {
    if (!isSupabaseConfigured || !supabase) throw new Error("Supabase no configurado");

    const { error } = await supabase.from("leads").insert({
        name: payload.nombre,
        company: payload.empresa,
        contact: payload.contacto,
        sector: payload.sector,
        objective: payload.objetivo,
        urgency: payload.urgencia,
        budget_range: payload.presupuesto,
        lead_volume: payload.volumen,
        decision_role: payload.decisor,
        message: payload.mensaje,
        lead_score: payload.leadScore,
        lead_grade: payload.leadGrade,
        source: "landing",
        status: "new"
    });

    if (error) throw new Error(error.message || "No se pudo guardar en Supabase.");
};

export const submitLead = async (payload) => {
    const lead = { ...payload, source: "landing", createdAt: new Date().toISOString() };

    try {
        const resultado = await enviarAlServicio(lead);
        return {
            ...lead,
            storage: "servicio",
            aviso: Boolean(resultado?.correo),
            enBase: Boolean(resultado?.base)
        };
    } catch (errorServicio) {
        try {
            await guardarDirectoEnBase(lead);
            return { ...lead, storage: "base_directa", aviso: false, enBase: true };
        } catch (errorBase) {
            const fallo = new Error(
                "No hemos podido registrar tu solicitud. Escríbenos por WhatsApp y la recogemos al momento."
            );
            fallo.code = "LEAD_NO_ENTREGADO";
            fallo.detalles = { servicio: String(errorServicio), base: String(errorBase) };
            throw fallo;
        }
    }
};
