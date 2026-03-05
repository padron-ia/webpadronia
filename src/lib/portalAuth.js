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
