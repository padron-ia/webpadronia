import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, company_id, project_id, entity_type, entity_id,
  title, file_url, file_size, mime_type, category,
  client_visible, uploaded_by, created_at
`;

export const listDocuments = async ({ companyId, projectId, entityType, entityId, clientVisibleOnly = false, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("documents").select(SELECT_FIELDS).order("created_at", { ascending: false }).limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (projectId) query = query.eq("project_id", projectId);
  if (entityType) query = query.eq("entity_type", entityType);
  if (entityId) query = query.eq("entity_id", entityId);
  if (clientVisibleOnly) query = query.eq("client_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createDocument = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("documents").insert({ ...payload, uploaded_by: payload.uploaded_by ?? user?.id ?? null }).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateDocument = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("documents").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const deleteDocument = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw error;
  return true;
};
