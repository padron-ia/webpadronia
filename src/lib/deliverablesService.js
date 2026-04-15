import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, project_id, type, title, slug, description,
  content_type, content_ref, status, position, client_visible,
  created_at, updated_at
`;

export const listDeliverablesByProject = async (projectId, { onlyPublished = false, onlyClientVisible = false } = {}) => {
  if (!supabase || !projectId) return [];
  let query = supabase.from("deliverables").select(SELECT_FIELDS).eq("project_id", projectId).order("position").order("created_at", { ascending: false });
  if (onlyPublished) query = query.eq("status", "published");
  if (onlyClientVisible) query = query.eq("client_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getDeliverable = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase.from("deliverables").select(SELECT_FIELDS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
};

export const getDeliverableBySlug = async (projectId, slug) => {
  if (!supabase || !projectId || !slug) return null;
  const { data, error } = await supabase.from("deliverables").select(SELECT_FIELDS).eq("project_id", projectId).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
};

export const createDeliverable = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.from("deliverables").insert(payload).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateDeliverable = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("deliverables").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const deleteDeliverable = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("deliverables").delete().eq("id", id);
  if (error) throw error;
  return true;
};

export const reorderDeliverables = async (projectId, orderedIds) => {
  if (!supabase || !projectId || !Array.isArray(orderedIds)) return;
  await Promise.all(
    orderedIds.map((id, idx) => supabase.from("deliverables").update({ position: idx }).eq("id", id).eq("project_id", projectId))
  );
};
