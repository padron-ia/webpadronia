import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, company_id, project_id, title, description, status, due_date,
  requested_by, document_id, received_at, created_at, updated_at,
  document:document_id (id, title, file_url, mime_type, file_size),
  project:project_id (id, title)
`;

export const listInfoRequests = async ({ companyId, projectId, status } = {}) => {
    if (!supabase) return [];
    let query = supabase.from("info_requests").select(SELECT_FIELDS).order("created_at", { ascending: false });
    if (companyId) query = query.eq("company_id", companyId);
    if (projectId) query = query.eq("project_id", projectId);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

export const createInfoRequest = async (payload) => {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from("info_requests")
        .insert({ ...payload, requested_by: payload.requested_by ?? user?.id ?? null })
        .select(SELECT_FIELDS)
        .single();
    if (error) throw error;
    return data;
};

export const updateInfoRequest = async (id, patch) => {
    if (!supabase || !id) throw new Error("ID requerido");
    const { data, error } = await supabase
        .from("info_requests")
        .update(patch)
        .eq("id", id)
        .select(SELECT_FIELDS)
        .single();
    if (error) throw error;
    return data;
};

export const deleteInfoRequest = async (id) => {
    if (!supabase || !id) throw new Error("ID requerido");
    const { error } = await supabase.from("info_requests").delete().eq("id", id);
    if (error) throw error;
    return true;
};

export const markInfoRequestReceived = async (id, documentId) => {
    return updateInfoRequest(id, {
        status: "received",
        document_id: documentId || null,
        received_at: new Date().toISOString()
    });
};

export const reopenInfoRequest = async (id) => {
    return updateInfoRequest(id, {
        status: "pending",
        document_id: null,
        received_at: null
    });
};
