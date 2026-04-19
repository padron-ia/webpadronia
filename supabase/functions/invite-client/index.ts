import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const FROM = "Padrón IA <hola@padron-ia.es>";
const REPLY_TO = "jesusmartinezpadron@gmail.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors }
  });

const renderEmail = ({ portalUrl, magicLink, companyName, firstName }: { portalUrl: string; magicLink: string; companyName: string; firstName: string; }) => `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Acceso a tu portal</title></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5f7;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.06);">
        <tr><td style="padding:32px 36px 8px;">
          <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#64748b;font-weight:600;">Padrón IA</div>
          <h1 style="margin:12px 0 0;font-size:24px;line-height:1.25;color:#0f172a;font-weight:700;">Hola${firstName ? " " + firstName : ""}, tu portal ya está listo</h1>
        </td></tr>
        <tr><td style="padding:16px 36px 8px;font-size:15px;line-height:1.6;color:#334155;">
          <p style="margin:0 0 14px;">Te hemos preparado un espacio privado para <strong>${companyName}</strong>, donde podrás ver tu auditoría y todo lo que vayamos entregando.</p>
        </td></tr>
        <tr><td align="center" style="padding:20px 36px;">
          <a href="${magicLink}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600;font-size:15px;">Entrar al portal</a>
        </td></tr>
        <tr><td style="padding:0 36px 8px;font-size:13px;line-height:1.6;color:#64748b;">
          <p style="margin:0 0 6px;">Este enlace te inicia sesión directamente (sin contraseña) y caduca en 24 h.</p>
          <p style="margin:0;">Si prefieres acceder manualmente, ve a <a href="${portalUrl}" style="color:#0f172a;">${portalUrl}</a> y pulsa "He olvidado mi contraseña" para crearte una.</p>
        </td></tr>
        <tr><td style="padding:28px 36px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
          Si no esperabas este email, puedes ignorarlo. Cualquier duda, responde a este mensaje.
        </td></tr>
      </table>
      <div style="margin-top:18px;font-size:11px;color:#94a3b8;">© Padrón IA · padron-ia.es</div>
    </td></tr>
  </table>
</body></html>`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) return json(500, { error: "RESEND_API_KEY no configurado" });

    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace("Bearer ", "");
    if (!jwt) return json(401, { error: "Falta Authorization" });

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) return json(401, { error: "Token inválido" });

    const { data: profile } = await admin.from("profiles").select("role").eq("id", userData.user.id).single();
    if (!profile || profile.role !== "admin") return json(403, { error: "Solo admins" });

    const body = await req.json().catch(() => ({}));
    const { email, company_name, contact_name, redirect_to } = body as { email?: string; company_name?: string; contact_name?: string; redirect_to?: string; };
    if (!email) return json(400, { error: "email requerido" });

    const basePortal = (redirect_to || "https://padron-ia.es/portal").replace(/\/$/, "");
    const portalUrl = basePortal;
    const firstLoginUrl = `${basePortal}/set-password`;
    const firstName = (contact_name || "").split(" ")[0] || "";
    const companyName = company_name || "tu empresa";

    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: firstLoginUrl }
    });
    if (linkErr) return json(500, { error: `No se pudo generar link: ${linkErr.message}` });

    const magicLink = linkData?.properties?.action_link;
    if (!magicLink) return json(500, { error: "Link vacío" });

    const subject = `${firstName ? firstName + ", tu" : "Tu"} portal de ${companyName} está listo`;
    const html = renderEmail({ portalUrl, magicLink, companyName, firstName });

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        reply_to: REPLY_TO,
        subject,
        html
      })
    });

    const resendJson = await resendRes.json().catch(() => ({}));
    if (!resendRes.ok) return json(502, { error: `Resend: ${resendJson?.message || resendRes.status}`, link: magicLink });

    return json(200, { ok: true, link: magicLink, email_id: resendJson?.id || null });
  } catch (e) {
    return json(500, { error: (e as Error).message });
  }
});
