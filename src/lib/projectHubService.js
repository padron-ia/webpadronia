import { supabase } from "./supabaseClient";

// ─── Repositories ────────────────────────────────────────────
const REPO_FIELDS = `id, project_id, label, provider, repo_url, branch, deploy_url, environment, notes, created_at, updated_at`;

export const listRepositories = async (projectId) => {
  if (!supabase || !projectId) return [];
  const { data, error } = await supabase
    .from("project_repositories")
    .select(REPO_FIELDS)
    .eq("project_id", projectId)
    .order("label");
  if (error) throw error;
  return data || [];
};

export const createRepository = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase
    .from("project_repositories")
    .insert(payload)
    .select(REPO_FIELDS)
    .single();
  if (error) throw error;
  return data;
};

export const updateRepository = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase
    .from("project_repositories")
    .update(patch)
    .eq("id", id)
    .select(REPO_FIELDS)
    .single();
  if (error) throw error;
  return data;
};

export const deleteRepository = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("project_repositories").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ─── Credentials (encrypted) ────────────────────────────────
const CRED_FIELDS = `id, project_id, label, service, credential_type, environment, notes, created_at, updated_at`;

export const listCredentials = async (projectId) => {
  if (!supabase || !projectId) return [];
  const { data, error } = await supabase
    .from("project_credentials")
    .select(CRED_FIELDS)
    .eq("project_id", projectId)
    .order("service, label");
  if (error) throw error;
  return data || [];
};

export const createCredential = async ({ project_id, label, service, credential_type, plain_value, environment, notes }) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.rpc("insert_encrypted_credential", {
    p_project_id: project_id,
    p_label: label,
    p_service: service || null,
    p_credential_type: credential_type || "api_key",
    p_plain_value: plain_value,
    p_environment: environment || "production",
    p_notes: notes || null,
  });
  if (error) throw error;
  return data;
};

export const decryptCredential = async (credentialId) => {
  if (!supabase || !credentialId) throw new Error("ID requerido");
  const { data, error } = await supabase.rpc("decrypt_credential", {
    credential_id: credentialId,
  });
  if (error) throw error;
  return data;
};

export const deleteCredential = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("project_credentials").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ─── Stack ──────────────────────────────────────────────────
const STACK_FIELDS = `id, project_id, category, technology, version, notes, created_at, updated_at`;

export const listStack = async (projectId) => {
  if (!supabase || !projectId) return [];
  const { data, error } = await supabase
    .from("project_stack")
    .select(STACK_FIELDS)
    .eq("project_id", projectId)
    .order("category, technology");
  if (error) throw error;
  return data || [];
};

export const createStackItem = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase
    .from("project_stack")
    .insert(payload)
    .select(STACK_FIELDS)
    .single();
  if (error) throw error;
  return data;
};

export const updateStackItem = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase
    .from("project_stack")
    .update(patch)
    .eq("id", id)
    .select(STACK_FIELDS)
    .single();
  if (error) throw error;
  return data;
};

export const deleteStackItem = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("project_stack").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ─── Links ──────────────────────────────────────────────────
const LINK_FIELDS = `id, project_id, label, url, link_type, notes, created_at, updated_at`;

export const listLinks = async (projectId) => {
  if (!supabase || !projectId) return [];
  const { data, error } = await supabase
    .from("project_links")
    .select(LINK_FIELDS)
    .eq("project_id", projectId)
    .order("link_type, label");
  if (error) throw error;
  return data || [];
};

export const createLink = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase
    .from("project_links")
    .insert(payload)
    .select(LINK_FIELDS)
    .single();
  if (error) throw error;
  return data;
};

export const updateLink = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase
    .from("project_links")
    .update(patch)
    .eq("id", id)
    .select(LINK_FIELDS)
    .single();
  if (error) throw error;
  return data;
};

export const deleteLink = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("project_links").delete().eq("id", id);
  if (error) throw error;
  return true;
};
