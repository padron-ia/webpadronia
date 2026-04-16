// ============================================================================
// Operativa de proyectos — hitos, tareas, equipo, horas
// ============================================================================
// Agrupado en un solo archivo porque son entidades muy relacionadas y
// se usarán siempre desde la misma vista (ficha de proyecto).
// ============================================================================

import { supabase } from "./supabaseClient";

// ============ MILESTONES ============

export const listMilestones = async (projectId) => {
  if (!supabase || !projectId) return [];
  const { data, error } = await supabase
    .from("project_milestones")
    .select("id, project_id, title, description, due_date, completed_at, position, created_at")
    .eq("project_id", projectId)
    .order("position")
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data || [];
};

export const createMilestone = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.from("project_milestones").insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateMilestone = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("project_milestones").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const completeMilestone = async (id) => updateMilestone(id, { completed_at: new Date().toISOString() });
export const deleteMilestone = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("project_milestones").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ============ TASKS ============

export const listTasks = async ({ projectId, milestoneId, assigneeId, status, clientVisibleOnly = false, limit = 500 } = {}) => {
  if (!supabase) return [];
  let query = supabase
    .from("tasks")
    .select("id, project_id, milestone_id, title, description, assignee_id, status, priority, due_date, completed_at, client_visible, created_by, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (projectId) query = query.eq("project_id", projectId);
  if (milestoneId) query = query.eq("milestone_id", milestoneId);
  if (assigneeId) query = query.eq("assignee_id", assigneeId);
  if (status) query = query.eq("status", status);
  if (clientVisibleOnly) query = query.eq("client_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createTask = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("tasks").insert({ ...payload, created_by: payload.created_by ?? user?.id ?? null }).select().single();
  if (error) throw error;
  return data;
};

export const updateTask = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  if (patch.status === "done" && !patch.completed_at) patch.completed_at = new Date().toISOString();
  const { data, error } = await supabase.from("tasks").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteTask = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ============ PROJECT TEAM ============

export const listTeam = async (projectId) => {
  if (!supabase || !projectId) return [];
  const { data, error } = await supabase
    .from("project_team")
    .select(`id, project_id, user_id, role, allocation_pct, hourly_rate, created_at, profile:user_id (id, full_name)`)
    .eq("project_id", projectId);
  if (error) throw error;
  return data || [];
};

export const addTeamMember = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.from("project_team").insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const removeTeamMember = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("project_team").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ============ TIME ENTRIES ============

export const listTimeEntries = async ({ projectId, userId, taskId, from, to, billable, limit = 500 } = {}) => {
  if (!supabase) return [];
  let query = supabase
    .from("time_entries")
    .select("id, task_id, project_id, user_id, description, hours, entry_date, billable, billed, invoice_line_id, created_at")
    .order("entry_date", { ascending: false })
    .limit(limit);
  if (projectId) query = query.eq("project_id", projectId);
  if (userId) query = query.eq("user_id", userId);
  if (taskId) query = query.eq("task_id", taskId);
  if (from) query = query.gte("entry_date", from);
  if (to) query = query.lte("entry_date", to);
  if (billable !== undefined) query = query.eq("billable", billable);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createTimeEntry = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("time_entries").insert({ ...payload, user_id: payload.user_id ?? user?.id }).select().single();
  if (error) throw error;
  return data;
};

export const updateTimeEntry = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("time_entries").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteTimeEntry = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("time_entries").delete().eq("id", id);
  if (error) throw error;
  return true;
};

export const totalHoursByProject = async (projectId) => {
  if (!supabase || !projectId) return { total: 0, billable: 0, billed: 0 };
  const { data, error } = await supabase.from("time_entries").select("hours, billable, billed").eq("project_id", projectId);
  if (error) throw error;
  return (data || []).reduce(
    (acc, row) => ({
      total: acc.total + Number(row.hours || 0),
      billable: acc.billable + (row.billable ? Number(row.hours || 0) : 0),
      billed: acc.billed + (row.billed ? Number(row.hours || 0) : 0)
    }),
    { total: 0, billable: 0, billed: 0 }
  );
};
