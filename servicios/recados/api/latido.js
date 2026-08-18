// GET /api/latido — latido diario contra Supabase.
//
// Supabase pausa los proyectos del plan free que pasan 7 días sin actividad de usuario.
// Este cron llama a fn_latido() una vez al día: basta para que no se pause.
//
// Y el vigilante NO puede caer en silencio: si el latido falla, manda un correo.
// (Vercel corre esto fuera del VPS y fuera de Supabase, así que un corte de cualquiera
// de los dos no se lleva por delante al que avisa.)

// La clave de Resend: el nombre bueno es RESEND_API_KEY. `Resend` es un alias heredado
// (se guardó así en Vercel y las variables "Sensitive" no se pueden renombrar ni leer).
// Al rotar la clave: borrarla, crearla como RESEND_API_KEY y quitar este alias.
const claveResend = () => process.env.RESEND_API_KEY || process.env.Resend;

async function avisar(asunto, detalle) {
    const clave = claveResend();
    if (!clave || !process.env.LEAD_TO) return false;

    const respuesta = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            from: process.env.RESEND_FROM || "Padrón IA <onboarding@resend.dev>",
            to: [process.env.LEAD_TO],
            subject: asunto,
            text: detalle
        })
    });
    return respuesta.ok;
}

export default async function handler(req, res) {
    const url = process.env.SUPABASE_URL;
    const clave = process.env.SUPABASE_ANON_KEY;

    if (!url || !clave) {
        return res.status(500).json({ ok: false, error: "Supabase sin configurar" });
    }

    try {
        const respuesta = await fetch(`${url}/rest/v1/rpc/fn_latido`, {
            method: "POST",
            headers: { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
            body: JSON.stringify({ p_origen: "cron-vercel" })
        });

        if (!respuesta.ok) {
            const detalle = (await respuesta.text()).slice(0, 400);
            await avisar(
                "🔴 El latido de la web no llega a Supabase",
                [
                    "El cron diario que mantiene despierta la base de padron-ia.es ha fallado.",
                    "",
                    `Respuesta: HTTP ${respuesta.status}`,
                    detalle,
                    "",
                    "Si esto se repite 7 días seguidos, Supabase pausa el proyecto:",
                    "el portal de cliente deja de funcionar y el formulario pierde su copia en base",
                    "(el correo del lead seguiría llegando: ese camino no depende de Supabase).",
                    "",
                    "Panel: https://supabase.com/dashboard/project/tfhmeoiryhuivdnpwpjs"
                ].join("\n")
            );
            return res.status(502).json({ ok: false, status: respuesta.status, detalle });
        }

        const ultimo = await respuesta.json();
        return res.status(200).json({ ok: true, ultimo });
    } catch (error) {
        await avisar(
            "🔴 El latido de la web ni siquiera pudo salir",
            `No se pudo contactar con Supabase.\n\n${String(error)}`
        );
        return res.status(502).json({ ok: false, error: String(error) });
    }
}
