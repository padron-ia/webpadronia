import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, legal_name, commercial_name, tax_id, address,
  phone, email, website, bank_account,
  default_vat, default_irpf, default_payment_terms,
  logo_url, brand_colors, updated_at
`;

export const getOrgSettings = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.from("org_settings").select(SELECT_FIELDS).limit(1).maybeSingle();
  if (error) throw error;
  return data;
};

export const updateOrgSettings = async (patch) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const existing = await getOrgSettings();
  if (!existing) {
    const { data, error } = await supabase.from("org_settings").insert(patch).select(SELECT_FIELDS).single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("org_settings").update(patch).eq("id", existing.id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};
