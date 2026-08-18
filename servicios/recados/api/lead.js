// POST /api/lead — recoge un lead de padron-ia.es y lo entrega POR CORREO.
//
// Regla de diseño: el lead NO puede depender de la base de datos. Primero se manda
// el correo (canal independiente de Supabase); la fila en `leads` es secundaria.
// Si el correo sale, el lead está a salvo aunque la base esté caída o pausada.

// La clave de Resend: el nombre bueno es RESEND_API_KEY. `Resend` es un alias heredado
// (se guardó así en Vercel y las variables "Sensitive" no se pueden renombrar ni leer).
// Al rotar la clave: borrarla, crearla como RESEND_API_KEY y quitar este alias.
const claveResend = () => process.env.RESEND_API_KEY || process.env.Resend;

const ORIGENES_PERMITIDOS = [
    "https://padron-ia.es",
    "https://www.padron-ia.es",
    "http://localhost:4197",
    "http://localhost:5173"
];

const CAMPOS = {
    nombre: 120,
    empresa: 120,
    contacto: 160,
    sector: 60,
    objetivo: 60,
    urgencia: 60,
    presupuesto: 60,
    volumen: 60,
    decisor: 60,
    mensaje: 4000,
    leadGrade: 2,
    leadScore: 4
};

const limpiar = (valor, tope) =>
    typeof valor === "string" ? valor.trim().slice(0, tope) : "";

const escapar = (texto) =>
    String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const cors = (req, res) => {
    const origen = req.headers.origin;
    if (ORIGENES_PERMITIDOS.includes(origen)) {
        res.setHeader("Access-Control-Allow-Origin", origen);
    }
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

async function mandarCorreo(datos) {
    const clave = claveResend();
    if (!clave) return { ok: false, motivo: "RESEND_API_KEY sin configurar" };

    const filas = [
        ["Nombre", datos.nombre],
        ["Empresa", datos.empresa],
        ["Contacto", datos.contacto],
        ["Sector", datos.sector],
        ["Qué necesita", datos.objetivo],
        ["Cuándo quiere empezar", datos.urgencia],
        ["Presupuesto", datos.presupuesto],
        ["Volumen", datos.volumen],
        ["Quién decide", datos.decisor],
        ["Prioridad estimada", `${datos.leadGrade || "-"} (${datos.leadScore || 0})`]
    ]
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${escapar(k)}</td><td style="padding:4px 0"><strong>${escapar(v)}</strong></td></tr>`)
        .join("");

    const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1b1e3a;max-width:600px">
      <p style="font-size:18px;margin:0 0 4px"><strong>${escapar(datos.nombre || "Alguien")}</strong> ha pedido una consultoría.</p>
      <p style="margin:0 0 18px;color:#64748b">Desde el formulario de padron-ia.es</p>
      <table style="border-collapse:collapse;font-size:14px">${filas}</table>
      ${datos.mensaje ? `<p style="margin:18px 0 6px;color:#64748b">Qué le come el tiempo:</p><blockquote style="margin:0;padding:12px 16px;background:#f2f3fb;border-left:3px solid #5a67e8;white-space:pre-wrap">${escapar(datos.mensaje)}</blockquote>` : ""}
      ${datos.contacto && /^[^@\s]+@[^@\s]+$/.test(datos.contacto) ? `<p style="margin:18px 0 0"><a href="mailto:${escapar(datos.contacto)}">Responder a ${escapar(datos.contacto)}</a></p>` : ""}
    </div>`;

    const texto = [
        `${datos.nombre || "Alguien"} ha pedido una consultoría desde padron-ia.es`,
        "",
        ...[
            ["Nombre", datos.nombre], ["Empresa", datos.empresa], ["Contacto", datos.contacto],
            ["Sector", datos.sector], ["Objetivo", datos.objetivo], ["Urgencia", datos.urgencia],
            ["Presupuesto", datos.presupuesto], ["Volumen", datos.volumen], ["Decide", datos.decisor],
            ["Prioridad", `${datos.leadGrade || "-"} (${datos.leadScore || 0})`]
        ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
        "",
        datos.mensaje ? `Necesidad:\n${datos.mensaje}` : ""
    ].join("\n");

    const respuesta = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            from: process.env.RESEND_FROM || "Padrón IA <onboarding@resend.dev>",
            to: [process.env.LEAD_TO],
            reply_to: /^[^@\s]+@[^@\s]+$/.test(datos.contacto || "") ? datos.contacto : undefined,
            subject: `Lead ${datos.leadGrade || "?"} · ${datos.nombre || "sin nombre"}${datos.empresa ? ` (${datos.empresa})` : ""}`,
            html,
            text: texto
        })
    });

    if (!respuesta.ok) {
        return { ok: false, motivo: `Resend ${respuesta.status}: ${(await respuesta.text()).slice(0, 300)}` };
    }
    return { ok: true };
}

async function guardarEnBase(datos) {
    const url = process.env.SUPABASE_URL;
    const clave = process.env.SUPABASE_ANON_KEY;
    if (!url || !clave) return { ok: false, motivo: "Supabase sin configurar" };

    const respuesta = await fetch(`${url}/rest/v1/leads`, {
        method: "POST",
        headers: {
            apikey: clave,
            Authorization: `Bearer ${clave}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
        },
        body: JSON.stringify({
            name: datos.nombre, company: datos.empresa, contact: datos.contacto,
            sector: datos.sector, objective: datos.objetivo, urgency: datos.urgencia,
            budget_range: datos.presupuesto, lead_volume: datos.volumen,
            decision_role: datos.decisor, message: datos.mensaje,
            lead_score: Number(datos.leadScore) || null, lead_grade: datos.leadGrade,
            source: "landing", status: "new"
        })
    });

    if (!respuesta.ok) {
        return { ok: false, motivo: `Supabase ${respuesta.status}: ${(await respuesta.text()).slice(0, 300)}` };
    }
    return { ok: true };
}

export default async function handler(req, res) {
    cors(req, res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Solo POST" });

    const cuerpo = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    // Trampa para bots: campo oculto que un humano nunca rellena.
    if (cuerpo.website) return res.status(200).json({ ok: true });

    const datos = {};
    for (const [campo, tope] of Object.entries(CAMPOS)) {
        datos[campo] = limpiar(String(cuerpo[campo] ?? ""), tope);
    }

    if (!datos.nombre || !datos.contacto) {
        return res.status(400).json({ error: "Faltan nombre o contacto" });
    }

    // El correo primero: es el canal que no depende de la base.
    const correo = await mandarCorreo(datos).catch((e) => ({ ok: false, motivo: String(e) }));
    const base = await guardarEnBase(datos).catch((e) => ({ ok: false, motivo: String(e) }));

    if (!correo.ok && !base.ok) {
        console.error("LEAD PERDIDO", { correo: correo.motivo, base: base.motivo, datos });
        return res.status(502).json({ error: "No pudimos registrar la solicitud", correo: correo.motivo, base: base.motivo });
    }

    if (!correo.ok) console.error("Lead guardado en base pero SIN correo:", correo.motivo);
    if (!base.ok) console.error("Lead enviado por correo pero SIN fila en base:", base.motivo);

    return res.status(200).json({ ok: true, correo: correo.ok, base: base.ok });
}
