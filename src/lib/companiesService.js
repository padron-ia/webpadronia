import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, legal_name, commercial_name, tax_id, tax_id_type,
  billing_address, shipping_address, phone, email, website,
  sector, company_size, annual_revenue_range, tax_regime,
  default_vat, default_irpf, currency, logo_url, notes,
  lifecycle_stage, source, owner_id, created_at, updated_at
`;

export const listCompanies = async ({ lifecycleStage, search, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("companies").select(SELECT_FIELDS).order("created_at", { ascending: false }).limit(limit);
  if (lifecycleStage) query = query.eq("lifecycle_stage", lifecycleStage);
  if (search) query = query.or(`legal_name.ilike.%${search}%,commercial_name.ilike.%${search}%,tax_id.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getCompany = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase.from("companies").select(SELECT_FIELDS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
};

export const createCompany = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const insertPayload = { ...payload, owner_id: payload.owner_id ?? user?.id ?? null };
  const { data, error } = await supabase.from("companies").insert(insertPayload).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateCompany = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("companies").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const deleteCompany = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if (error) throw error;
  return true;
};

export const countByLifecycle = async () => {
  if (!supabase) return {};
  const { data, error } = await supabase.from("companies").select("lifecycle_stage");
  if (error) throw error;
  return (data || []).reduce((acc, row) => {
    acc[row.lifecycle_stage] = (acc[row.lifecycle_stage] || 0) + 1;
    return acc;
  }, {});
};
