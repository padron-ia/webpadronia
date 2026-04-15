import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, company_id, project_id, opportunity_id, contact_id,
  actor_id, type, title, body, meta, client_visible, created_at
`;

export const listActivity = async ({ companyId, projectId, opportunityId, limit = 100 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("activity_log").select(SELECT_FIELDS).order("created_at", { ascending: false }).limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (projectId) query = query.eq("project_id", projectId);
  if (opportunityId) query = query.eq("opportunity_id", opportunityId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const listClientVisibleActivity = async ({ companyId, projectId, limit = 50 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("activity_log").select(SELECT_FIELDS).eq("client_visible", true).order("created_at", { ascending: false }).limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (projectId) query = query.eq("project_id", projectId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const logActivity = async ({ company_id = null, project_id = null, opportunity_id = null, contact_id = null, type, title, body = null, meta = null, client_visible = false }) => {
  if (!supabase || !type || !title) return null;
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("activity_log").insert({
    company_id, project_id, opportunity_id, contact_id,
    actor_id: user?.id ?? null,
    type, title, body, meta, client_visible
  }).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const deleteActivity = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("activity_log").delete().eq("id", id);
  if (error) throw error;
  return true;
};
