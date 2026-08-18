# Analítica de padron-ia.es

> 18-ago-2026. Antes de esto la web **no medía nada**, y encima `src/lib/analytics.js`
> empujaba los eventos a `dataLayer`, `gtag()` y `fbq()`, que no existían en la página:
> cada clic de WhatsApp y cada envío de formulario se perdía.

## Qué se usa y por qué

**Umami autoalojado**, instancia propia: `https://monitorizacion-umami.pqtiji.easypanel.host`
Panel del sitio: `/websites/a7c240cd-f901-4a2f-a636-a9821e28fb21`

Se eligió frente a Google Analytics porque **no usa cookies ni guarda datos personales**:
no hace falta pedir consentimiento y el banner puede seguir declarando solo cookies técnicas.
Con GA4 habría que bloquear el script hasta la aceptación y volver a montar el consentimiento.

La instancia tiene **un único usuario (`admin`)**: nadie del ecosistema OFM ve estos datos.

## Cómo se manda un evento

```js
import { trackLeadEvent } from "../lib/analytics";
trackLeadEvent("lead_whatsapp_click", { placement: "hero" });
```

Eventos que ya se registran: `lead_whatsapp_click` (hero, footer, botón flotante,
consultoría) y `lead_form_submit` (con `lead_grade`).

## Comprobar que sigue midiendo

Panel → pestaña **Realtime**. Ahí se ven las visitas y los eventos según ocurren; los
contadores del resumen agregan con retraso y pueden marcar 0 aunque esté entrando tráfico.

Verificado el 18-ago: visita + evento `prueba_verificacion` registrados en vivo.

## Pendiente

- **Google Search Console**: dar de alta `padron-ia.es` y enviar el sitemap. Necesita la
  cuenta de Google de Jesús.
- Datos estructurados (`Organization`, `FAQPage`) y meta por ruta: la SPA sirve un solo
  `<title>` para todas las páginas.
