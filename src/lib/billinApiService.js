import { supabase } from "./supabaseClient";

const getProjectUrl = () => import.meta.env.VITE_SUPABASE_URL;

async function billinCall(action, params = {}, body = null) {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No autenticado");

  const url = new URL(`${getProjectUrl()}/functions/v1/billin-api`);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const opts = {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url.toString(), opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.billinError?.message || `Billin error: ${res.status}`);
  return data;
}

// ─── Invoices ───────────────────────────────────────────────
export const listBillinInvoices = (limit = 100) => billinCall("list-invoices", { limit: String(limit) });
export const getBillinInvoice = (id) => billinCall("get-invoice", { id });

export const createBillinInvoice = ({ contact, lines, serialCode, issuedDate, currency = "EUR", comments, retentionPercentage, isPaid }) => {
  const body = {
    currency,
    contact,
    lines,
    ...(serialCode && { serialCode }),
    ...(issuedDate && { issuedDate }),
    ...(comments && { comments }),
    ...(retentionPercentage && { retentionPercentage }),
    ...(isPaid !== undefined && { isPaid }),
  };
  return billinCall("create-invoice", {}, body);
};

// ─── Expenses ───────────────────────────────────────────────
export const listBillinExpenses = (limit = 100) => billinCall("list-expenses", { limit: String(limit) });

export const createBillinExpense = ({ contact, lines, identifier, issuedDate, currency = "EUR", comments }) => {
  const body = {
    currency,
    identifier,
    issuedDate,
    contact,
    lines,
    ...(comments && { comments }),
  };
  return billinCall("create-expense", {}, body);
};

// ─── Payments ───────────────────────────────────────────────
export const listBillinPayments = (limit = 100) => billinCall("list-payments", { limit: String(limit) });
export const createBillinPayment = (body) => billinCall("create-payment", {}, body);

// ─── Contacts ───────────────────────────────────────────────
export const listBillinContacts = (limit = 100) => billinCall("list-contacts", { limit: String(limit) });

export const createBillinContact = ({ fiscalName, vatNumber, vatNumberType = "NIF", email, isCustomer = true, isProvider = false, address, taxKey = "IVA_21" }) => {
  const body = {
    fiscalName,
    vatNumber,
    vatNumberType,
    isCustomer,
    isProvider,
    taxKey,
    ...(email && { email }),
    ...(address && { address }),
  };
  return billinCall("create-contact", {}, body);
};

// ─── Products ───────────────────────────────────────────────
export const createBillinProduct = (body) => billinCall("create-product", {}, body);
