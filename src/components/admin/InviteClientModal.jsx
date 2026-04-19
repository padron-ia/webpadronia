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
  const [copied, setCopied] = useState("");
  const [magicLink, setMagicLink] = useState("");

  const isProdHost = typeof window !== "undefined" && /padron-ia\.es$/i.test(window.location.hostname);
  const origin = isProdHost ? window.location.origin : "https://padron-ia.es";
  const portalUrl = `${origin}/portal`;
  const firstName = (contact?.full_name || "").split(" ")[0] || "";
  const companyName = company?.commercial_name || company?.legal_name || "Padron IA";
  const waMessage = magicLink
    ? [
        `Hola${firstName ? ` ${firstName}` : ""},`,
        ``,
        `Ya tienes listo tu espacio privado de ${companyName} en Padrón IA (${portalUrl}).`,
        ``,
        `Ahí vas a poder ver tu auditoría y todo lo que vayamos entregando.`,
        ``,
        `Para entrar la primera vez y crear tu contraseña, usa este enlace (válido 24 h):`,
        magicLink,
        ``,
        `Después de eso, entras siempre desde ${portalUrl} con tu email y contraseña.`,
        ``,
        `También te lo he enviado por email a ${email} por si lo prefieres desde ahí. Cualquier cosa, me dices.`
      ].join("\n")
    : [
        `Hola${firstName ? ` ${firstName}` : ""},`,
        ``,
        `Ya tienes listo tu espacio privado de ${companyName} en Padrón IA.`,
        ``,
        `Entra aquí: ${portalUrl}`,
        `Con tu email: ${email}`,
        `En el login pulsa "He olvidado mi contraseña" para crear la tuya en un segundo.`
      ].join("\n");

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    } catch {}
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!email.trim() || !company?.id) {
      setError("Falta email o empresa");
      return;
    }
    setSending(true);
    setError("");
    try {
      const result = await inviteClient({
        email: email.trim(),
        company_id: company.id,
        company_name: companyName,
        contact_id: contact?.id || null,
        contact_name: contact?.full_name || "",
        access_level: accessLevel
      });
      if (result?.magic_link) setMagicLink(result.magic_link);
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
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p className="font-semibold">Acceso generado ✓</p>
              <p className="mt-1">Se ha creado el acceso para <strong>{email}</strong>. También le hemos enviado un magic link por email, pero puedes pasárselo por WhatsApp con el mensaje de abajo.</p>
            </div>

            {magicLink ? (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-700">Magic link (acceso directo sin contraseña)</p>
                  <button type="button" onClick={() => handleCopy(magicLink, "magic")} className="rounded-full border border-indigo-300 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 hover:border-indigo-900">
                    {copied === "magic" ? "Copiado ✓" : "Copiar link"}
                  </button>
                </div>
                <p className="mt-2 break-all text-xs font-mono text-indigo-900">{magicLink}</p>
                <p className="mt-2 text-xs text-indigo-700">Caduca en 24 h. Un clic inicia sesión.</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Enlace al portal</p>
                  <button type="button" onClick={() => handleCopy(portalUrl, "url")} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-900">
                    {copied === "url" ? "Copiado ✓" : "Copiar enlace"}
                  </button>
                </div>
                <p className="mt-2 break-all text-sm font-mono text-slate-800">{portalUrl}</p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Mensaje para WhatsApp</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => handleCopy(waMessage, "msg")} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-900">
                    {copied === "msg" ? "Copiado ✓" : "Copiar mensaje"}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Abrir WhatsApp
                  </a>
                </div>
              </div>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-slate-700">{waMessage}</pre>
            </div>

            <div className="flex justify-end">
              <button onClick={onClose} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Cerrar</button>
            </div>
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
