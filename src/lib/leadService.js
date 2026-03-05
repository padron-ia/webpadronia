import { isSupabaseConfigured, supabase } from "./supabaseClient";

const saveLocalFallback = (lead) => {
    const current = JSON.parse(localStorage.getItem("padron_leads") || "[]");
    localStorage.setItem("padron_leads", JSON.stringify([lead, ...current].slice(0, 100)));
};

export const submitLead = async (payload) => {
    const baseLead = {
        ...payload,
        source: "landing",
        createdAt: new Date().toISOString()
    };

    if (!isSupabaseConfigured || !supabase) {
        saveLocalFallback(baseLead);
        await new Promise((resolve) => setTimeout(resolve, 400));
        return { ...baseLead, storage: "local_fallback" };
    }

    const {
        data: { user }
    } = await supabase.auth.getUser();

    const dbPayload = {
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
        status: "new",
        created_by: user?.id ?? null
    };

    const { error } = await supabase.from("leads").insert(dbPayload);

    if (error) {
        saveLocalFallback(baseLead);
        const fallbackError = new Error(error.message || "No se pudo guardar en Supabase.");
        fallbackError.code = "SUPABASE_INSERT_FAILED";
        fallbackError.fallbackSaved = true;
        fallbackError.fallbackLead = baseLead;
        throw fallbackError;
    }

    return { ...baseLead, storage: "supabase" };
};
