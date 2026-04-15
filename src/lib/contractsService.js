import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, project_id, company_id, proposal_id, title, type,
  total_amount, currency, start_date, end_date, auto_renewal,
  status, signed_at, document_url, notes, created_at, updated_at
`;

export const listContracts = async ({ companyId, projectId, status, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("contracts").select(SELECT_FIELDS).order("created_at", { ascending: false }).limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (projectId) query = query.eq("project_id", projectId);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getContract = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase.from("contracts").select(SELECT_FIELDS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
};

export const createContract = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.from("contracts").insert(payload).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateContract = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("contracts").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const signContract = async (id, documentUrl = null) => updateContract(id, { status: "active", signed_at: new Date().toISOString(), document_url: documentUrl });

export const deleteContract = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("contracts").delete().eq("id", id);
  if (error) throw error;
  return true;
};
