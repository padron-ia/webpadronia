import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, user_id, company_id, contact_id, access_level,
  invited_by, invited_at, accepted_at, created_at
`;

export const listClientUsersByCompany = async (companyId) => {
  if (!supabase || !companyId) return [];
  const { data, error } = await supabase
    .from("client_users")
    .select(SELECT_FIELDS)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const listCompaniesByUser = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from("client_users")
    .select(`${SELECT_FIELDS}, companies:company_id (id, legal_name, commercial_name, logo_url)`)
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const createClientUser = async ({ user_id, company_id, contact_id = null, access_level = "view" }) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const payload = {
    user_id,
    company_id,
    contact_id,
    access_level,
    invited_by: user?.id ?? null,
    invited_at: new Date().toISOString()
  };
  const { data, error } = await supabase.from("client_users").insert(payload).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const markAccepted = async (clientUserId) => {
  if (!supabase || !clientUserId) return null;
  const { data, error } = await supabase
    .from("client_users")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", clientUserId)
    .select(SELECT_FIELDS)
    .single();
  if (error) throw error;
  return data;
};

export const deleteClientUser = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("client_users").delete().eq("id", id);
  if (error) throw error;
  return true;
};
