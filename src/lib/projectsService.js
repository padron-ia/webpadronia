import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, company_id, opportunity_id, code, title, slug, description,
  status, health, start_date, end_date, manager_id,
  budget_hours, budget_amount, currency, created_at, updated_at,
  project_type, domain, domain_expires_at, logo_url, primary_contact_id
`;

const slugify = (text) =>
  text
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60) || "proyecto";

export const listProjects = async ({ companyId, status, managerId, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase
    .from("projects")
    .select(`${SELECT_FIELDS}, companies:company_id (legal_name, commercial_name, logo_url), primary_contact:primary_contact_id (full_name, email, phone_mobile)`)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (status) query = query.eq("status", status);
  if (managerId) query = query.eq("manager_id", managerId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const listProjectsForCurrentClient = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select(`${SELECT_FIELDS}, companies:company_id (legal_name, commercial_name, logo_url), primary_contact:primary_contact_id (full_name, email, phone_mobile)`)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getProjectBySlug = async (companyId, slug) => {
  if (!supabase || !companyId || !slug) return null;
  const { data, error } = await supabase
    .from("projects")
    .select(`${SELECT_FIELDS}, companies:company_id (id, legal_name, commercial_name, logo_url)`)
    .eq("company_id", companyId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const getProject = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase
    .from("projects")
    .select(`${SELECT_FIELDS}, companies:company_id (id, legal_name, commercial_name, logo_url)`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const createProject = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const slug = payload.slug || slugify(payload.title);
  const insertPayload = { ...payload, slug, manager_id: payload.manager_id ?? user?.id ?? null };
  const { data, error } = await supabase.from("projects").insert(insertPayload).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateProject = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("projects").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const deleteProject = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  return true;
};
