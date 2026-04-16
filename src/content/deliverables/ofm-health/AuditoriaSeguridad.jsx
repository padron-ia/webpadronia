import { ContentLayout, Section, Finding, Callout, CodeBlock, CheckList, DataTable, StatGrid } from "../../components/ContentBlocks";

export default function AuditoriaSeguridad() {
  return (
    <ContentLayout
      title="Auditoría de Seguridad y Cumplimiento"
      subtitle="DKIM/DMARC, cabeceras HTTP, cookies RGPD, terceros no declarados, security.txt, endpoints expuestos y certificado SSL."
    >
      <StatGrid items={[
        { label: "Hallazgos", value: "7", detail: "3 críticos, 3 medios, 1 bajo" },
        { label: "Cifrado TLS", value: "Correcto", detail: "Let's Encrypt vía Cloudflare" },
        { label: "DKIM", value: "Ausente", detail: "Riesgo de suplantación de correo" },
        { label: "Cookies sin consentimiento", value: "Sí", detail: "GTM activo antes de aceptar" }
      ]} />

      <Finding title="1. Falta DKIM y DMARC incompleto — riesgo de phishing" severity="alta" effort="bajo">
        <p>Sin DKIM, cualquier atacante puede falsificar emails que parezcan venir de info@ofm-health.com. Gmail y Outlook pueden aceptarlos como legítimos. El DMARC está a quarantine pero sin informes de reporting (rua/ruf): si hay phishing activo, nadie lo sabría.</p>
        <CodeBlock label="Estado actual del DNS de correo">{`SPF:   v=spf1 include:_spf.mail.hostinger.com ~all     [OK]
DMARC: v=DMARC1; p=quarantine                          [INCOMPLETO]
DKIM:  NO ENCONTRADO                                   [CRÍTICO]
MX:    mx1.hostinger.com, mx2.hostinger.com             [OK]`}</CodeBlock>
        <CheckList type="cross" items={[
          "Cualquier atacante puede suplantar info@ofm-health.com",
          "Sin informes DMARC, no se detectan intentos de phishing",
          "Riesgo directo sobre +1.600 clientes verificados",
          "Emails legítimos de OFM Health pueden acabar en spam"
        ]} />
        <Callout type="gold" title="Solución">
          <p>Generar DKIM en Hostinger, publicar registro TXT en DNS, ampliar DMARC con reporting y verificar con mxtoolbox + Google Postmaster Tools.</p>
        </Callout>
      </Finding>

      <Finding title="2. Terceros no declarados en política de privacidad (RGPD)" severity="alta">
        <p>La web carga GTM, GA4, Facebook Pixel, Klaviyo, Judge.me, Shopify Web Pixels y Cloudflare. La política de privacidad solo menciona Google Analytics. El RGPD (Art. 13) obliga a informar de todos los encargados de tratamiento.</p>
        <DataTable headers={["Servicio", "Función", "Datos que recoge"]} rows={[
          ["Google Tag Manager", "Orquestador de scripts", "Metadatos navegación"],
          ["Google Analytics 4", "Analítica", "IP, identificadores, comportamiento"],
          ["Facebook Pixel", "Publicidad/remarketing", "ID Facebook, conversiones"],
          ["Klaviyo", "Email marketing", "Email, comportamiento, carrito"],
          ["Judge.me", "Reseñas", "Email, historial de compra"],
          ["Cloudflare", "CDN/seguridad", "IP, huella de navegador"]
        ]} />
        <Callout type="danger" title="Riesgo">
          <p>Facebook Pixel y Klaviyo implican transferencias internacionales a EEUU (requieren garantías específicas tras Schrems II). Sanciones AEPD a e-commerce por este incumplimiento: entre varios miles y decenas de miles de euros.</p>
        </Callout>
      </Finding>

      <Finding title="3. Cookies cargadas sin consentimiento previo" severity="alta">
        <p>Google Tag Manager está activo desde el primer byte de carga, antes de que el usuario interactúe con ningún banner. La Guía de Cookies 2023 de la AEPD exige consentimiento previo, granular, informado e inequívoco.</p>
        <Callout type="gold" title="Solución">
          <p>Instalar CMP certificada (Cookiebot, CookieYes, Usercentrics u OneTrust — todas con app Shopify). Configurar bloqueo de GTM/Pixel/Klaviyo hasta aceptación. Banner con "Aceptar", "Rechazar" y "Configurar" con el mismo peso visual.</p>
        </Callout>
      </Finding>

      <Finding title="4. Cabeceras HTTP de seguridad parciales" severity="media">
        <CheckList items={[
          "HSTS activo (strict-transport-security)",
          "X-Frame-Options: DENY (previene clickjacking)",
          "X-Content-Type-Options: nosniff",
          "Content-Security-Policy básica"
        ]} />
        <CheckList type="cross" items={[
          "Referrer-Policy: ausente — fuga de URLs hacia terceros",
          "Permissions-Policy: ausente — APIs de navegador sin restricción",
          "CSP completo: muy básico — un XSS podría llamar a cualquier dominio",
          "HSTS preload: no declarado"
        ]} />
        <Callout type="gold" title="Solución"><p>Aplicar desde Cloudflare (ya en uso) mediante Transform Rules. Sin tocar Shopify.</p></Callout>
      </Finding>

      <Finding title="5. Ausencia de security.txt" severity="media" effort="bajo">
        <p>El archivo /.well-known/security.txt (RFC 9116) permite a investigadores reportar vulnerabilidades de forma responsable. Sin él, un fallo detectado puede acabar publicado o explotado. Crear buzón security@ofm-health.com y publicar el archivo.</p>
      </Finding>

      <Finding title="6. Catálogo expuesto vía /products.json" severity="media">
        <p>Shopify expone endpoints con el catálogo completo en JSON. Cualquier competidor puede descargar títulos, precios, variantes, descripciones e imágenes en un segundo. Se mitiga con reglas de Cloudflare y Bot Fight Mode.</p>
      </Finding>

      <Finding title="7. Monitorización del certificado SSL" severity="baja" effort="bajo">
        <p>Let's Encrypt vía Cloudflare, renovación automática cada 90 días. Configurar monitorización con Uptime Robot para alertas 14, 7 y 1 días antes de expiración.</p>
      </Finding>

      <Section title="Lo que sí está bien configurado">
        <CheckList items={[
          "HTTPS forzado con redirección 301 desde HTTP",
          "Redirección canónica ofm-health.com → www.ofm-health.com",
          "Cifrado TLS moderno gestionado por Cloudflare",
          "Aviso legal completo (razón social, NIF, registro mercantil, registro sanitario)",
          "Política de privacidad con derechos RGPD",
          "Condiciones generales con derecho de desistimiento 14 días",
          "No se detectan rutas sensibles (.git, .env, admin, backups)",
          "Cookies esenciales con HttpOnly, Secure, SameSite=Lax"
        ]} />
      </Section>
    </ContentLayout>
  );
}
