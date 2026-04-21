import { ContentLayout, Section, Callout } from "../../components/ContentBlocks";

const PRIORITY = {
  blocker: { label: "Bloqueante", className: "bg-rose-100 text-rose-700 border-rose-200" },
  important: { label: "Importante", className: "bg-amber-100 text-amber-700 border-amber-200" },
  later: { label: "Cuando toque", className: "bg-stone-100 text-stone-600 border-stone-200" },
};

const SECTIONS = [
  {
    n: 1,
    title: "Accesos web y hosting",
    priority: "blocker",
    items: [
      "URL de la web principal y subdominios",
      "Acceso admin al WordPress / CMS (o invitación a jesus@padron.ai)",
      "Panel de hosting (Hostinger, cPanel, Plesk…): usuario + password",
      "Registrador del dominio: acceso a DNS",
      "FTP/SFTP: host, usuario, password, puerto",
      "Base de datos si procede (phpMyAdmin / MySQL)",
    ],
  },
  {
    n: 2,
    title: "Google y analítica",
    priority: "blocker",
    items: [
      "Google Analytics 4: añadir jesus@padron.ai como admin",
      "Google Search Console: propietario delegado",
      "Google Tag Manager si lo usa",
      "Google Business Profile (Maps)",
      "Google Ads + MCC para linkeo (si invierte en paga)",
    ],
  },
  {
    n: 3,
    title: "SEO y herramientas",
    priority: "important",
    items: [
      "Herramienta SEO actual (Semrush / Ahrefs / Sistrix / ninguna)",
      "Palabras clave objetivo actuales",
      "4 competidores directos a analizar (si no los tiene, los propongo)",
      "Geografía target: España, ciudades, internacional",
      "Backlinks conocidos o campañas de linkbuilding previas",
    ],
  },
  {
    n: 4,
    title: "Legal RGPD / LSSI",
    priority: "blocker",
    items: [
      "Aviso legal, política de privacidad y de cookies actuales",
      "Registro de Actividades de Tratamiento (ROPA) si existe",
      "DPO designado (si aplica) — contacto",
      "Contratos con encargados del tratamiento (hosting, email, CRM)",
      "Formularios de la web: cuáles, qué datos, dónde se almacenan",
      "Banner de cookies: herramienta (Cookiebot / Iubenda / custom)",
      "Incidencias de seguridad pasadas (brechas conocidas)",
    ],
  },
  {
    n: 5,
    title: "Seguridad técnica",
    priority: "important",
    items: [
      "Certificado SSL: Let's Encrypt auto-renovación, dominio válido",
      "Plugin de seguridad WP (Wordfence, Sucuri, iThemes): credenciales",
      "Backups: dónde, frecuencia, último testado",
      "Lista de usuarios admin de la web (para auditar y limpiar)",
      "2FA activada en admin (sí/no)",
    ],
  },
  {
    n: 6,
    title: "Redes sociales y presencia",
    priority: "important",
    items: [
      "Instagram: acceso o invitación como editor",
      "Facebook + Meta Business Suite: acceso al Business Manager",
      "TikTok, YouTube, LinkedIn según uso",
      "Perfiles profesionales (colegio médico, directorios salud)",
    ],
  },
  {
    n: 7,
    title: "Email marketing y CRM",
    priority: "important",
    items: [
      "Plataforma email (Mailchimp / ActiveCampaign / MailerLite / Brevo): acceso",
      "CRM actual (HubSpot / GHL / Excel): acceso",
      "Tamaño de lista y consentimientos documentados sí/no",
      "Flujos automatizados montados: qué hacen, cuándo disparan",
    ],
  },
  {
    n: 8,
    title: "Prototipo Test de Perfil",
    priority: "blocker",
    items: [
      "Objetivo del test: captar leads, segmentar pacientes, diagnóstico orientativo",
      "Preguntas que quiere incluir (las que ya tenga pensadas)",
      "Resultados / perfiles a devolver al usuario",
      "Qué pasa después: email, cita, descarga PDF",
      "Diseño de referencia (links a tests que le gusten)",
      "Integraciones necesarias: CRM, email, Calendly",
      "Dónde lo aloja: su web o subdominio propio",
    ],
  },
  {
    n: 9,
    title: "Branding y diseño",
    priority: "important",
    items: [
      "Logo en SVG + PNG (versiones light/dark)",
      "Manual de marca (tipografías, colores, tono)",
      "Fotos profesionales (headshots, consulta, producto)",
      "Vídeos ya grabados reutilizables",
      "Referencias visuales de webs que le gusten (3-5 ejemplos)",
    ],
  },
  {
    n: 10,
    title: "Negocio y contenido",
    priority: "later",
    items: [
      "Servicios/productos actuales con precios",
      "Buyer persona principal",
      "Propuesta de valor única frente a competidores",
      "Objetivos a 6-12 meses (tráfico, leads, ventas)",
      "Presupuesto mensual de marketing/paid",
      "Contenido existente: blog, ebooks, lead magnets",
    ],
  },
  {
    n: 11,
    title: "Decisiones que tiene que cerrar Odile",
    priority: "important",
    items: [
      "¿Seguir con el CMS actual o migrar?",
      "Quién responde cambios durante la auditoría (ella directa / equipo)",
      "Canal de comunicación oficial (WhatsApp / email / portal)",
      "Fecha límite realista del informe final",
      "¿Incluir presupuesto de implementación en el informe o por separado?",
    ],
  },
  {
    n: 12,
    title: "Legal administrativo",
    priority: "later",
    items: [
      "Contrato de servicios firmado (con cláusula RGPD encargado)",
      "DPA entre Padrón IA y OFM",
      "Factura pro-forma aceptada / anticipo cobrado",
      "NDA si hay información sensible",
    ],
  },
];

function Pill({ priority }) {
  const p = PRIORITY[priority];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${p.className}`}>
      {p.label}
    </span>
  );
}

export default function ChecklistAccesosOdile() {
  return (
    <ContentLayout
      title="Checklist de accesos, stack e info a pedir a Odile"
      subtitle="Lo que necesito que Odile entregue para ejecutar la Auditoría Digital Integral. Priorizado por bloqueante / importante / cuando toque. Uso interno — no visible para el cliente."
    >
      <Callout type="info" title="Cómo usar esta checklist">
        <p>
          En la llamada con Odile priorizar las secciones marcadas como <strong>Bloqueantes</strong> (1, 2, 4 y 8): sin ellas no se puede avanzar.
          Las <strong>Importantes</strong> se piden por email/WhatsApp esta misma semana. Las <strong>Cuando toque</strong> se recogen antes del
          entregable final. Marca los ítems conforme los recibas.
        </p>
      </Callout>

      <Section title="Secciones priorizadas">
        <div className="grid gap-4">
          {SECTIONS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {s.n}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-stone-900">{s.title}</h3>
                    <Pill priority={s.priority} />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {s.items.map((it, i) => (
                      <li key={i} className="flex gap-2 text-sm text-stone-700 leading-relaxed">
                        <span className="mt-1 h-3 w-3 shrink-0 rounded-sm border border-stone-300 bg-white" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Callout type="success" title="Orden sugerido de trabajo">
        <p>
          <strong>Hoy en la llamada:</strong> secciones 1, 2, 4 y 8 (bloqueantes).<br />
          <strong>Esta semana:</strong> 3, 5, 11 (importantes, mandar por email).<br />
          <strong>Antes del entregable final:</strong> 6, 7, 9, 10, 12 (contexto y cierre).
        </p>
      </Callout>

      <Callout type="info" title="Mis compromisos en la llamada">
        <ul className="mt-2 ml-5 list-disc space-y-1">
          <li>Confirmar plazo de entrega final del informe</li>
          <li>Mandar esta checklist por email/WhatsApp como recordatorio</li>
          <li>Crear carpeta compartida (Drive/Notion) donde Odile suelte material</li>
          <li>Enviar link de login al portal de cliente de Padrón IA</li>
        </ul>
      </Callout>
    </ContentLayout>
  );
}
