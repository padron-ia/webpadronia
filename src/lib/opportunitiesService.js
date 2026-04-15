import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, company_id, primary_contact_id, name, description, stage, probability,
  estimated_value, currency, expected_close_date, actual_close_date,
  lost_reason, source, owner_id, created_at, updated_at
`;

export const listOpportunities = async ({ companyId, stage, ownerId, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("opportunities").select(`${SELECT_FIELDS}, companies:company_id (legal_name, commercial_name)`).order("updated_at", { ascending: false }).limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (stage) query = query.eq("stage", stage);
  if (ownerId) query = query.eq("owner_id", ownerId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getOpportunity = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase.from("opportunities").select(SELECT_FIELDS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
};

export const createOpportunity = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("opportunities").insert({ ...payload, owner_id: payload.owner_id ?? user?.id ?? null }).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateOpportunity = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("opportunities").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const moveStage = async (id, stage) => {
  const patch = { stage };
  if (stage === "won" || stage === "lost") patch.actual_close_date = new Date().toISOString().slice(0, 10);
  return updateOpportunity(id, patch);
};

export const deleteOpportunity = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("opportunities").delete().eq("id", id);
  if (error) throw error;
  return true;
};

export const pipelineSummary = async () => {
  if (!supabase) return {};
  const { data, error } = await supabase.from("opportunities").select("stage, estimated_value, probability").in("stage", ["qualification", "discovery", "proposal", "negotiation"]);
  if (error) throw error;
  return (data || []).reduce((acc, row) => {
    const stage = row.stage;
    acc[stage] = acc[stage] || { count: 0, value: 0, weighted: 0 };
    acc[stage].count += 1;
    acc[stage].value += Number(row.estimated_value || 0);
    acc[stage].weighted += Number(row.estimated_value || 0) * (row.probability / 100);
    return acc;
  }, {});
};
