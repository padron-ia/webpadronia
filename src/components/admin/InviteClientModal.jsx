import { useState } from "react";
import { inviteClient } from "../../lib/inviteService";

/**
 * Modal para invitar a un contacto como usuario del portal cliente.
 *
 * El flujo:
 *   1. Email + company_id + contact_id
 *   2. Envía magic link vía Supabase Auth (crea usuario si no existe)
 *   3. Registra invitación pendiente en localStorage
 *   4. Cuando el cliente acepta y entra, el admin puede "finalizar" la
 *      invitación desde la ficha de la empresa para crear el client_users.
 */
export default function InviteClientModal({ company, contact, onClose, onInvited }) {
  const [email, setEmail] = useState(contact?.email || "");
  const [accessLevel, setAccessLevel] = useState("view");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (event) => {
    event.preventDefault();
    if (!email.trim() || !company?.id) {
      setError("Falta email o empresa");
      return;
    }
    setSending(true);
    setError("");
    try {
      await inviteClient({
        email: email.trim(),
        company_id: company.id,
        contact_id: contact?.id || null,
        access_level: accessLevel
      });
      setSent(true);
      onInvited?.(email);
    } catch (err) {
      setError(err.message || "No se pudo enviar la invitación");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Invitar cliente</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">{company?.legal_name}</h3>
            {contact?.full_name ? <p className="text-sm text-slate-600">{contact.full_name} · {contact.job_title || "-"}</p> : null}
          </div>
          <button onClick={onClose} className="rounded-full px-2 text-slate-400 hover:text-slate-700">✕</button>
        </div>

        {sent ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">Invitación enviada ✓</p>
            <p className="mt-1">Se ha enviado un magic link a <strong>{email}</strong>. Cuando el cliente haga clic y acceda por primera vez, vuelve a la ficha de esta empresa y pulsa <em>Finalizar invitación</em> para asociar su usuario al portal.</p>
            <button onClick={onClose} className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Email del cliente *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                placeholder="cliente@empresa.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Nivel de acceso</span>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
              >
                <option value="view">Solo lectura (view)</option>
                <option value="edit">Puede editar (edit)</option>
                <option value="admin_company">Administrador empresa</option>
              </select>
            </label>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <p className="font-semibold">Cómo funciona</p>
              <ul className="mt-1 list-disc pl-4 space-y-0.5">
                <li>Se enviará un magic link de Supabase al email indicado.</li>
                <li>Si el usuario no existe, se creará automáticamente al hacer clic.</li>
                <li>Después, desde la ficha de la empresa, podrás finalizar la invitación para asociarle el acceso.</li>
              </ul>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600">Cancelar</button>
              <button type="submit" disabled={sending} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {sending ? "Enviando…" : "Enviar invitación"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
