import { supabase } from "./supabaseClient";
import { createClientUser } from "./clientUsersService";

/**
 * Flujo de invitación de cliente al portal.
 *
 * NOTA IMPORTANTE sobre la creación de usuarios:
 *
 * Supabase tiene DOS formas de invitar usuarios:
 *
 *  1) `supabase.auth.admin.inviteUserByEmail(email)` — requiere service_role key,
 *     NO se puede usar desde el frontend de forma segura. Es el método "correcto"
 *     pero exige un backend (Edge Function) que lo ejecute.
 *
 *  2) `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })`
 *     — usa la anon key, funciona desde el frontend, envía un magic link que
 *     crea el usuario al hacer clic si no existía. Es el enfoque recomendado
 *     para una primera iteración sin backend.
 *
 * Este servicio implementa la opción (2). Cuando el usuario haga clic en el
 * enlace recibido, accederá al portal. Al detectarse la primera sesión, se debe
 * crear el registro `client_users` vinculándolo a la empresa y contacto.
 *
 * Flujo completo:
 *   1. Admin llama a `inviteClient({ email, company_id, contact_id })`
 *   2. Se envía magic link al email
 *   3. Cuando el cliente entra, llamamos a `finalizeClientInvite(user, invitation)`
 *      pasando los datos preparados en localStorage o en una tabla de invitaciones.
 *
 * Para simplificar la primera versión, guardamos las invitaciones pendientes
 * en localStorage del admin y el admin las procesa manualmente cuando confirme
 * que el cliente ha accedido.
 */

const PENDING_INVITES_KEY = "padron_pending_invites";

const readPending = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_INVITES_KEY) || "[]");
  } catch {
    return [];
  }
};

const writePending = (list) => {
  localStorage.setItem(PENDING_INVITES_KEY, JSON.stringify(list.slice(0, 100)));
};

/**
 * Envía magic link al cliente y registra la invitación pendiente.
 */
export const inviteClient = async ({ email, company_id, contact_id = null, access_level = "view", redirectTo }) => {
  if (!supabase) throw new Error("Supabase no configurado");
  if (!email || !company_id) throw new Error("email y company_id son obligatorios");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: redirectTo || `${window.location.origin}/portal/cliente`
    }
  });

  if (error) throw error;

  const pending = readPending();
  const invite = {
    email: email.toLowerCase(),
    company_id,
    contact_id,
    access_level,
    invited_at: new Date().toISOString(),
    status: "pending"
  };
  writePending([invite, ...pending.filter((p) => p.email !== email.toLowerCase() || p.company_id !== company_id)]);

  return invite;
};

/**
 * Lista de invitaciones pendientes guardadas localmente (en el navegador del admin).
 */
export const listPendingInvites = () => readPending();

/**
 * Marca una invitación como completada y crea el client_user correspondiente.
 * Se llama cuando el admin confirma que el cliente ya entró al portal.
 */
export const finalizeInvite = async ({ email, user_id }) => {
  const pending = readPending();
  const invite = pending.find((p) => p.email === email.toLowerCase() && p.status === "pending");
  if (!invite) throw new Error("No hay invitación pendiente para ese email");

  const clientUser = await createClientUser({
    user_id,
    company_id: invite.company_id,
    contact_id: invite.contact_id,
    access_level: invite.access_level
  });

  const updated = pending.map((p) =>
    p.email === invite.email && p.company_id === invite.company_id
      ? { ...p, status: "completed", completed_at: new Date().toISOString(), user_id }
      : p
  );
  writePending(updated);

  return clientUser;
};

/**
 * Borra una invitación pendiente del registro local.
 */
export const removePendingInvite = ({ email, company_id }) => {
  const pending = readPending();
  writePending(pending.filter((p) => !(p.email === email.toLowerCase() && p.company_id === company_id)));
};
