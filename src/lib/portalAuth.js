import { supabase } from "./supabaseClient";

export const getAdminEmails = () =>
    (import.meta.env.VITE_ADMIN_EMAILS || "")
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);

export const fetchOrCreateProfile = async (userId) => {
    if (!supabase || !userId) return null;

    const { data } = await supabase.from("profiles").select("id, role, full_name").eq("id", userId).maybeSingle();
    if (data) return data;

    const { data: inserted } = await supabase.from("profiles").insert({ id: userId, role: "client" }).select("id, role, full_name").maybeSingle();
    return inserted || null;
};

export const resolveRole = async (user) => {
    if (!user) return "client";

    const profile = await fetchOrCreateProfile(user.id);
    if (profile?.role) return profile.role;

    const adminEmails = getAdminEmails();
    return adminEmails.includes((user.email || "").toLowerCase()) ? "admin" : "client";
};

/**
 * Devuelve las empresas vinculadas al usuario actual (vía client_users).
 * Usado para renderizar el área de cliente y filtrar proyectos.
 */
export const resolveUserCompanies = async (userId) => {
    if (!supabase || !userId) return [];
    const { data, error } = await supabase
        .from("client_users")
        .select(`
            id, user_id, company_id, contact_id, access_level, accepted_at,
            company:company_id (id, legal_name, commercial_name, logo_url, lifecycle_stage),
            contact:contact_id (id, full_name, email, job_title)
        `)
        .eq("user_id", userId);
    if (error) return [];
    return (data || []).map((row) => ({
        ...row,
        company: row.company,
        contact: row.contact
    }));
};

/**
 * Devuelve la empresa "activa" del usuario cliente.
 * En el MVP, simplemente la primera; en el futuro permitir elegir si tiene varias.
 */
export const resolvePrimaryCompany = async (userId) => {
    const companies = await resolveUserCompanies(userId);
    return companies[0] || null;
};
