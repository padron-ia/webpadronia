// GET /api/panel — el pulso de los sistemas, en vivo.
//
// Esto es lo que ninguna agencia puede copiar en un fin de semana: enseñar tus propios
// sistemas respondiendo ahora mismo. Por eso hay una regla dura aquí dentro:
// NO se inventa ni un número. Si algo no se puede medir, no sale.
//
// Cada sistema se identifica por lo que HACE, nunca por de quién es. Los nombres de
// cliente no salen de aquí.

// Reglas de esta lista:
//  1. La etiqueta dice lo que el sistema HACE. Nunca de quién es. Los dominios no salen
//     en la respuesta pública: solo viajan etiqueta, si responde y en cuántos ms.
//  2. Solo GET, y solo contra páginas o endpoints de salud. Nunca contra algo que ejecute
//     trabajo: llamar a un cron para "comprobar" es ejecutarlo.
//  3. Se usan los hosts internos, no los dominios de cara al público, para no meter una
//     visita por minuto en las analíticas de los clientes.
const SISTEMAS = [
    { id: "almacen", etiqueta: "Almacén nocturno", url: "https://ofm-ofm-health.pqtiji.easypanel.host/api/shopify/health" },
    { id: "renovaciones", etiqueta: "Renovaciones", url: "https://escuelacuidarte-gestiondeleads.pqtiji.easypanel.host/" },
    { id: "despacho", etiqueta: "Documentación del despacho", url: "https://nuevo-crm-torres-olmo.3pkgp0.easypanel.host/" },
    { id: "web", etiqueta: "Este mismo sitio", url: "https://padron-ia.es/" },
    { id: "recados", etiqueta: "Recogida de mensajes", url: "https://recados-sandy.vercel.app/api/latido" }
];

const TIEMPO_MAXIMO = 6000;

async function medir(sistema) {
    const arranque = Date.now();
    try {
        const control = new AbortController();
        const corte = setTimeout(() => control.abort(), TIEMPO_MAXIMO);
        const respuesta = await fetch(sistema.url, {
            method: "GET",
            signal: control.signal,
            headers: { "User-Agent": "padron-ia-panel/1.0" }
        });
        clearTimeout(corte);
        return {
            id: sistema.id,
            etiqueta: sistema.etiqueta,
            responde: respuesta.ok,
            ms: Date.now() - arranque
        };
    } catch (error) {
        return { id: sistema.id, etiqueta: sistema.etiqueta, responde: false, ms: null };
    }
}

async function ultimoLatido() {
    const url = process.env.SUPABASE_URL;
    const clave = process.env.SUPABASE_ANON_KEY;
    if (!url || !clave) return null;

    try {
        // fn_latido devuelve la marca de tiempo del latido que acaba de escribir.
        // Lo llamamos con origen 'panel' para distinguirlo del cron diario en la traza.
        const respuesta = await fetch(`${url}/rest/v1/rpc/fn_latido`, {
            method: "POST",
            headers: { apikey: clave, Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
            body: JSON.stringify({ p_origen: "panel-web" })
        });
        if (!respuesta.ok) return null;
        return await respuesta.json();
    } catch {
        return null;
    }
}

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Un minuto de caché en el borde: el panel se ve en vivo sin castigar a los sistemas.
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

    const [medidas, latido] = await Promise.all([
        Promise.all(SISTEMAS.map(medir)),
        ultimoLatido()
    ]);

    const vivos = medidas.filter((m) => m.responde).length;
    const tiempos = medidas.filter((m) => m.responde && m.ms != null).map((m) => m.ms);

    return res.status(200).json({
        comprobado: new Date().toISOString(),
        sistemas: medidas,
        resumen: {
            vivos,
            total: medidas.length,
            respuesta_media_ms: tiempos.length
                ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
                : null
        },
        base_de_datos: latido ? { ultimo_latido: latido } : null
    });
}
