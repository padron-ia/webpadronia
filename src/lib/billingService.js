// ============================================================================
// Facturación — catálogo, series, facturas, líneas, pagos, gastos
// ============================================================================
// Todo agrupado en un solo archivo porque son entidades muy acopladas.
// ============================================================================

import { supabase } from "./supabaseClient";

// ============ CATALOG ITEMS ============

export const listCatalogItems = async ({ activeOnly = false, search, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("catalog_items").select("*").order("name").limit(limit);
  if (activeOnly) query = query.eq("active", true);
  if (search) query = query.ilike("name", `%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createCatalogItem = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.from("catalog_items").insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateCatalogItem = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("catalog_items").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteCatalogItem = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("catalog_items").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ============ INVOICE SERIES ============

export const listInvoiceSeries = async ({ year, activeOnly = true } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("invoice_series").select("*").order("code");
  if (year) query = query.eq("year", year);
  if (activeOnly) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createInvoiceSeries = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.from("invoice_series").insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateInvoiceSeries = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("invoice_series").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

const pickNextInvoiceNumber = async (series) => {
  // Patrón: reservar next_number y luego incrementar. No es atómico al 100% sin
  // transacción server-side, pero es suficiente mientras sea un solo admin operando.
  if (!supabase || !series) throw new Error("Serie requerida");
  const current = series.next_number ?? 1;
  await supabase.from("invoice_series").update({ next_number: current + 1 }).eq("id", series.id);
  return current;
};

const buildFullNumber = (series, number) => {
  const prefix = series.prefix ? `${series.prefix}-` : "";
  return `${prefix}${series.year}-${String(number).padStart(4, "0")}`;
};

// ============ INVOICES ============

const INVOICE_FIELDS = `
  id, series_id, number, full_number, company_id, project_id, contract_id,
  issue_date, due_date, payment_terms, currency,
  subtotal, vat_amount, irpf_amount, total_amount, paid_amount,
  status, notes, internal_notes, pdf_url, rectifies_invoice_id,
  created_by, created_at, updated_at
`;

export const listInvoices = async ({ companyId, status, year, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase
    .from("invoices")
    .select(`${INVOICE_FIELDS}, companies:company_id (legal_name, commercial_name, tax_id)`)
    .order("issue_date", { ascending: false })
    .limit(limit);
  if (companyId) query = query.eq("company_id", companyId);
  if (status) query = query.eq("status", status);
  if (year) {
    query = query.gte("issue_date", `${year}-01-01`).lte("issue_date", `${year}-12-31`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getInvoice = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase
    .from("invoices")
    .select(`${INVOICE_FIELDS}, companies:company_id (legal_name, commercial_name, tax_id, billing_address, email)`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const createInvoiceDraft = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("invoices").insert({ ...payload, status: "draft", created_by: payload.created_by ?? user?.id ?? null }).select(INVOICE_FIELDS).single();
  if (error) throw error;
  return data;
};

export const updateInvoice = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("invoices").update(patch).eq("id", id).select(INVOICE_FIELDS).single();
  if (error) throw error;
  return data;
};

export const issueInvoice = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const invoice = await getInvoice(id);
  if (!invoice) throw new Error("Factura no encontrada");
  if (invoice.status !== "draft") throw new Error("Solo se pueden emitir facturas en borrador");
  if (!invoice.series_id) throw new Error("La factura debe tener una serie asignada");

  const { data: series, error: seriesError } = await supabase.from("invoice_series").select("*").eq("id", invoice.series_id).single();
  if (seriesError) throw seriesError;

  const number = await pickNextInvoiceNumber(series);
  const full_number = buildFullNumber(series, number);

  return updateInvoice(id, { number, full_number, status: "issued" });
};

export const deleteInvoice = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const inv = await getInvoice(id);
  if (inv?.status !== "draft") throw new Error("Solo se pueden eliminar borradores");
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ============ INVOICE LINES ============

export const listInvoiceLines = async (invoiceId) => {
  if (!supabase || !invoiceId) return [];
  const { data, error } = await supabase
    .from("invoice_lines")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("position");
  if (error) throw error;
  return data || [];
};

export const addInvoiceLine = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.from("invoice_lines").insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateInvoiceLine = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("invoice_lines").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteInvoiceLine = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("invoice_lines").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ============ PAYMENTS ============

export const listPayments = async ({ invoiceId, from, to, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("payments").select("*").order("payment_date", { ascending: false }).limit(limit);
  if (invoiceId) query = query.eq("invoice_id", invoiceId);
  if (from) query = query.gte("payment_date", from);
  if (to) query = query.lte("payment_date", to);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createPayment = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("payments").insert({ ...payload, created_by: payload.created_by ?? user?.id ?? null }).select().single();
  if (error) throw error;
  return data;
};

export const deletePayment = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ============ EXPENSES ============

export const listExpenses = async ({ projectId, from, to, billableOnly = false, limit = 200 } = {}) => {
  if (!supabase) return [];
  let query = supabase.from("expenses").select("*").order("expense_date", { ascending: false }).limit(limit);
  if (projectId) query = query.eq("project_id", projectId);
  if (from) query = query.gte("expense_date", from);
  if (to) query = query.lte("expense_date", to);
  if (billableOnly) query = query.eq("billable", true);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createExpense = async (payload) => {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("expenses").insert({ ...payload, created_by: payload.created_by ?? user?.id ?? null }).select().single();
  if (error) throw error;
  return data;
};

export const updateExpense = async (id, patch) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { data, error } = await supabase.from("expenses").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteExpense = async (id) => {
  if (!supabase || !id) throw new Error("ID requerido");
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// ============ DASHBOARD FINANCIERO ============

export const financialSummary = async ({ year = new Date().getFullYear() } = {}) => {
  if (!supabase) return null;
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  const [invoices, payments, expenses] = await Promise.all([
    supabase.from("invoices").select("total_amount, status, issue_date").gte("issue_date", start).lte("issue_date", end),
    supabase.from("payments").select("amount, payment_date").gte("payment_date", start).lte("payment_date", end),
    supabase.from("expenses").select("amount, expense_date").gte("expense_date", start).lte("expense_date", end)
  ]);

  const billed = (invoices.data || []).filter((i) => i.status !== "draft" && i.status !== "void").reduce((acc, i) => acc + Number(i.total_amount || 0), 0);
  const pending = (invoices.data || []).filter((i) => ["issued", "sent", "viewed", "partial", "overdue"].includes(i.status)).reduce((acc, i) => acc + Number(i.total_amount || 0), 0);
  const collected = (payments.data || []).reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const spent = (expenses.data || []).reduce((acc, e) => acc + Number(e.amount || 0), 0);

  return {
    year,
    billed,
    pending,
    collected,
    spent,
    net: collected - spent
  };
};
