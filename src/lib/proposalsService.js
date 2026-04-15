import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, project_id, opportunity_id, company_id, title, summary, content,
  total_amount, currency, valid_until, status,
  sent_at, viewed_at, decided_at, decision_notes,
  created_by, created_at, updated_at
`;

export const listProposals = async ({ companyId, projectId, opportunityId, status, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("proposals").select(SELECT_FIELDS).order("updated_at", { ascending: false }).limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (projectId) query = query.eq("project_id", projectId);
  if (opportunityId) query = query.eq("opportunity_id", opportunityId);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getProposal = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase.from("proposals").select(SELECT_FIELDS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
};

export const createProposal = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("proposals").insert({ ...payload, created_by: payload.created_by ?? user?.id ?? null }).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateProposal = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("proposals").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const sendProposal = async (id) => updateProposal(id, { status: "sent", sent_at: new Date().toISOString() });
export const markViewed = async (id) => {
  const existing = await getProposal(id);
  if (existing?.viewed_at) return existing;
  return updateProposal(id, { status: "viewed", viewed_at: new Date().toISOString() });
};
export const acceptProposal = async (id, notes = null) => updateProposal(id, { status: "accepted", decided_at: new Date().toISOString(), decision_notes: notes });
export const rejectProposal = async (id, notes = null) => updateProposal(id, { status: "rejected", decided_at: new Date().toISOString(), decision_notes: notes });

export const deleteProposal = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) throw error;
  return true;
};
