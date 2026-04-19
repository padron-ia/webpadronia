import { supabase } from "./supabaseClient";

const SELECT_FIELDS = `
  id, company_id, project_id, entity_type, entity_id,
  title, file_url, file_size, mime_type, category,
  client_visible, uploaded_by, created_at
`;

export const listDocuments = async ({ companyId, projectId, entityType, entityId, clientVisibleOnly = false, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("documents").select(SELECT_FIELDS).order("created_at", { ascending: false }).limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (projectId) query = query.eq("project_id", projectId);
  if (entityType) query = query.eq("entity_type", entityType);
  if (entityId) query = query.eq("entity_id", entityId);
  if (clientVisibleOnly) query = query.eq("client_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createDocument = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("documents").insert({ ...payload, uploaded_by: payload.uploaded_by ?? user?.id ?? null }).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateDocument = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("documents").update(patch).eq("id", id).select(SELECT_FIELDS).single();
  if (error) throw error;
  return data;
};

export const deleteDocument = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw error;
  return true;
};

const BUCKET = "client-files";

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);

export const uploadClientFile = async ({ file, companyId, projectId = null, category = "client_upload", clientVisible = true, title }) => {
  if (!supabase) throw new Error("Supabase no configurado");
  if (!file || !companyId) throw new Error("file y companyId requeridos");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const safeName = slugify(file.name) || "archivo";
  const path = `${companyId}/${Date.now()}-${safeName}`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined
  });
  if (upErr) throw upErr;

  try {
    const doc = await createDocument({
      company_id: companyId,
      project_id: projectId,
      title: title || file.name,
      file_url: path,
      file_size: file.size,
      mime_type: file.type || null,
      category,
      client_visible: clientVisible,
      uploaded_by: user.id
    });
    return doc;
  } catch (err) {
    await supabase.storage.from(BUCKET).remove([path]).catch(() => {});
    throw err;
  }
};

export const getClientFileUrl = async (path, { expiresIn = 300 } = {}) => {
  if (!supabase || !path) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl || null;
};

export const removeClientFile = async ({ id, path }) => {
  if (!supabase) throw new Error("Supabase no configurado");
  if (path) {
    await supabase.storage.from(BUCKET).remove([path]).catch(() => {});
  }
  if (id) {
    await deleteDocument(id);
  }
  return true;
};
