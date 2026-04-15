import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, company_id, full_name, email, phone_mobile, phone_landline,
  job_title, department, is_primary, is_decision_maker, is_signer,
  linkedin_url, notes, created_at, updated_at
`;

export const listContacts = async ({ companyId, search, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("contacts").select(SELECT_FIELDS).order("created_at", { ascending: false }).limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getContact = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase.from("contacts").select(SELECT_FIELDS).eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
};

export const createContact = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  // Si se marca is_primary, desmarcar los demás de la misma empresa
  if (payload.is_primary && payload.company_id) {
    await supabase.from("contacts").update({ is_primary: false }).eq("company_id", payload.company_id);
  }
  const { data, error } = await supabase.from("contacts").insert(payload).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateContact = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  if (patch.is_primary === true) {
    const { data: contact } = await supabase.from("contacts").select("company_id").eq("id", id).single();
    if (contact?.company_id) {
      await supabase.from("contacts").update({ is_primary: false }).eq("company_id", contact.company_id).neq("id", id);
    }
  }
  const { data, error } = await supabase.from("contacts").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const deleteContact = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw error;
  return true;
};
