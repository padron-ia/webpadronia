import { ContentLayout, Section, Callout, CheckList, DataTable, StatGrid } from "../../components/ContentBlocks";

export default function BriefingInternoOdile() {
  return (
    <ContentLayout
      title="Briefing interno · Reunión Odile"
      subtitle="Guion de trabajo para la reunión. No compartir con cliente. Cuatro bloques, doce procesos, lo que pedimos el día uno y respuestas preparadas."
    >
      <Callout type="warn" title="Solo uso interno">
        <p>Este documento está marcado como no visible para cliente. Contiene guion táctico, precio, posicionamiento frente a competidores y respuestas preparadas. No compartir pantalla con Odile sobre este documento — sí con los otros 9 deliverables del proyecto.</p>
      </Callout>

      <Section title="Cómo contar el plan en 30 segundos">
        <Callout type="gold">
          <p>"Tenemos cuatro bloques. El primero sanea lo que ya existe (SEO, seguridad, legal). El segundo alcanza a los competidores en palancas comerciales básicas. El tercero supera a IVB con IA real. El cuarto construye el ecosistema OFM Care, que ya nadie puede copiar. Cada bloque entrega valor por sí solo, y cada uno desbloquea el siguiente."</p>
        </Callout>
      </Section>

      <Section title="Bloque 1 — Estabilización (semanas 1-4)">
        <p className="text-sm text-stone-700">Procesos sin los cuales nada de lo demás tiene sentido. Riesgo reputacional y legal si se dejan.</p>

        <Process
          num="P1"
          title="Higienización técnica urgente"
          resuelve="Placeholder 'My store / 123 John Doe Street' en contacto y fichas, datos estructurados incompletos, invisibilidad de las 1.666 reseñas en Google."
          pasos={[
            "Auditoría de páginas afectadas en Shopify Admin.",
            "Edición de ubicación real (Granada) y desactivación del módulo de disponibilidad.",
            "Instalación app JSON-LD — schemas Product, Review, Article, FAQ, Breadcrumbs, Organization.",
            "Verificación en Search Console + Rich Results Test."
          ]}
          necesitamos="Accesos a Shopify Admin, Search Console y Cloudflare. Dirección física confirmada. Validación de bio corporativa."
          stack="Shopify apps (JSON-LD for SEO o Smart SEO), Search Console, Rich Results Test, mxtoolbox."
          duracion="1-2 semanas"
          kpi="0 placeholders visibles · estrellas en SERP para productos top · CTR home +15%"
        />

        <Process
          num="P2"
          title="Seguridad correo y cabeceras"
          resuelve="Ausencia de DKIM (riesgo de phishing contra +1.600 clientes), DMARC sin reporting, cabeceras HTTP parciales, sin security.txt."
          pasos={[
            "Generar DKIM en Hostinger y publicar TXT en DNS.",
            "Ampliar DMARC con rua/ruf a buzón dedicado.",
            "Transform Rules en Cloudflare para Referrer-Policy, Permissions-Policy y CSP completo.",
            "Crear security@ofm-health.com y publicar /.well-known/security.txt.",
            "Monitorización SSL con Uptime Robot."
          ]}
          necesitamos="Accesos DNS (Hostinger), Cloudflare y creación de alias security@."
          stack="Hostinger DNS, Cloudflare Transform Rules, mxtoolbox, Google Postmaster, Uptime Robot."
          duracion="3-5 días"
          kpi="DKIM alineado · DMARC con reporting activo · Mozilla Observatory B+ o superior"
        />

        <Process
          num="P3"
          title="Cumplimiento RGPD (cookies + política)"
          resuelve="GTM/Pixel/Klaviyo cargando antes de consentimiento. Política que solo menciona GA. Sanciones AEPD potenciales."
          pasos={[
            "Instalar CMP certificada (Cookiebot o CookieYes — app oficial Shopify).",
            "Configurar bloqueo de GTM, Pixel, Klaviyo, Judge.me hasta aceptación.",
            "Reescribir política listando todos los encargados y transferencias a EEUU (Schrems II).",
            "Banner 'Aceptar / Rechazar / Configurar' con igual peso visual.",
            "Registro documental del consentimiento."
          ]}
          necesitamos="Revisión jurídica (asesor de Odile) del texto final. Decisión sobre nivel de bloqueo."
          stack="Cookiebot o CookieYes, Shopify, redactor legal."
          duracion="1 semana"
          kpi="0 cookies no esenciales antes de consentimiento · registro auditable"
        />
      </Section>

      <Section title="Bloque 2 — Paridad comercial (semanas 4-12)">
        <p className="text-sm text-stone-700">Alcanzamos a HSN, Belevels y Life Pro en palancas básicas. Sin esto, la visión queda en humo.</p>

        <Process
          num="P4"
          title="Programa de puntos OFM Care (con ángulo UAPO)"
          resuelve="Fidelización y retención. Ningún competidor une puntos + donación."
          pasos={[
            "Elección de plataforma (Smile.io, LoyaltyLion o Yotpo Loyalty).",
            "Reglas: 1€ = 1 punto, bonus por referido, bonus por reseña.",
            "Canje dual: descuento personal o donación extra a UAPO.",
            "Landing 'Cómo funciona OFM Care' con explicación del doble propósito.",
            "Migración de histórico si la plataforma lo permite."
          ]}
          necesitamos="Convenio firmado con UAPO que autorice uso comercial de marca y cifras. Decisión sobre ratios de canje."
          stack="Smile.io (~50-200€/mes), Shopify, Klaviyo."
          duracion="2-3 semanas"
          kpi="AOV +20% · repetición +25% · % puntos canjeados como donación"
        />

        <Process
          num="P5"
          title="Plan de referidos"
          resuelve="'10€ para ti, 10€ para tu amigo' — palanca comercial que sí tiene HSN, nadie más."
          pasos={[
            "Motor de referidos (integrable con Smile o ReferralCandy).",
            "Link único por cliente + código.",
            "Email de invitación automatizado en Klaviyo.",
            "Dashboard de recompensas por cliente."
          ]}
          necesitamos="Definir cuantía del incentivo y tope mensual."
          stack="Smile / ReferralCandy, Klaviyo."
          duracion="1 semana"
          kpi="Referidos activos > 5% de base de clientes"
        />

        <Process
          num="P6"
          title="Navegación por beneficios + Smart Cart + Outlet"
          resuelve="Organización por problema del usuario (Energía, Defensas, Descanso, Piel, Deporte, Mujer...) en lugar de por categoría."
          pasos={[
            "Taxonomía de beneficios (6-8 colecciones transversales).",
            "Mapeo producto → beneficios (matriz).",
            "Smart cart gamificado: 'Te faltan 12€ para envío gratis'.",
            "Sección outlet con caducidades cortas o lotes cerrados."
          ]}
          necesitamos="Validación de Odile del mapeo producto↔beneficio (decisión editorial)."
          stack="Shopify collections, Slide Cart o RebuyEngine."
          duracion="2 semanas"
          kpi="Páginas/sesión +30% · conversión colección→carrito +15%"
        />

        <Process
          num="P7"
          title="Estrategia editorial del blog"
          resuelve="43.500 búsquedas/mes en solo 6 keywords que hoy no capturamos. Blog actual: 150-200 palabras, sin citas."
          pasos={[
            "Keyword research completo (200+ términos, 4 pilares).",
            "Calendario editorial: 2-4 posts/mes de 1.500-2.500 palabras.",
            "Plantilla con citas a fuentes (EFSA, PubMed), enlaces internos y CTA.",
            "Reescritura de 'Quiénes somos' + páginas nuevas 'Cómo formulamos' y 'Certificaciones'."
          ]}
          necesitamos="Acceso al equipo técnico/científico para validación claims EFSA. Decisión budget redactor."
          stack="Ahrefs/Semrush, Claude para borradores (revisión humana obligatoria), Shopify blog."
          duracion="Estrategia 2 sem · ejecución continua"
          kpi="Orgánico +40% en 6 meses · tiempo lectura > 2 min · top-10 para 20+ keywords"
        />
      </Section>

      <Section title="Bloque 3 — Superar a IVB con IA (semanas 8-20)">
        <p className="text-sm text-stone-700">IVB marca el listón en credibilidad y UX. Aquí dejamos de copiar y pasamos a diferenciarnos.</p>

        <Process
          num="P8"
          title="Test de perfil 90 seg con IA dinámica"
          resuelve="IVB usa árbol estático. Nosotros añadimos IA que reinterpreta respuestas, personaliza copy y genera rutina diaria."
          estado="Prototipo funcional ya construido (10 preguntas, 10 productos, scoring, filtros dietéticos, bundle)."
          pasos={[
            "Integración real con catálogo Shopify (Storefront API).",
            "Capa IA (Claude Haiku 4.5) que reescribe resultado con tono OFM.",
            "Captura email antes del resultado → Klaviyo → flujo 5 emails.",
            "Generación automática de pack en carrito con descuento bundle.",
            "Aviso EFSA/AESAN + derivación a nutricionista si hay bandera médica.",
            "A/B test vs tienda plana."
          ]}
          necesitamos="Catálogo consolidado (nombre, tags, dietary, precios), claim EFSA aprobado por producto, decisión descuento bundle."
          stack="React, Shopify Storefront API, Anthropic API (Haiku 4.5), Klaviyo."
          duracion="2-3 semanas desde prototipo"
          kpi="Conversión test > 15% (vs 2-3% tienda plana) · email capture > 60%"
        />

        <Process
          num="P9"
          title='Asistente IA conversacional "Cuida" (web + WhatsApp)'
          resuelve="Nadie en España de suplementación lo tiene. IVB ofrece consulta nutricionista (cuello de botella humano); nosotros 24/7."
          pasos={[
            "Corpus de conocimiento: fichas, claims EFSA, FAQs, políticas, histórico dudas.",
            "Guardrails legales: no diagnostica, no prescribe, deriva a profesional. Fuera categoría EU AI Act alto riesgo.",
            "Embebido en web + WhatsApp Business con webhook.",
            "Escalado a humano cuando hay bandera médica o insatisfacción.",
            "Logs auditables y dashboard de conversaciones."
          ]}
          necesitamos="Acceso a fichas técnicas/FAQs, decisión sobre nutricionista que actúa como escalado, WhatsApp Business API."
          stack="Anthropic API (Sonnet 4.6), RAG con Supabase/Pinecone, Twilio o 360dialog."
          duracion="4-6 semanas"
          kpi="Tiempo respuesta < 3s · resolución sin humano > 70% · derivación a venta > 15%"
        />

        <Process
          num="P10"
          title="Podcast + YouTube con producción IA"
          resuelve="IVB tiene podcast artesanal. Nosotros entramos con escala IA."
          pasos={[
            "Formato definido (20-30 min, 1 ep/sem, tema + invitado).",
            "Pipeline IA: transcripción (Whisper), show notes, fragmentos Reels/Shorts, miniaturas, newsletter.",
            "Distribución en Spotify, Apple, YouTube, web OFM.",
            "Integración con blog: cada episodio genera un post largo."
          ]}
          necesitamos="Persona presentadora (Odile o figura médica), calendario editorial, equipo mínimo (micro + cámara)."
          stack="Descript, Whisper, Claude para show notes y fragmentos, Buzzsprout/Transistor, YouTube."
          duracion="2 sem setup + continuo"
          kpi="1 ep/sem sin fallo · +500 descargas/ep en mes 6 · tráfico desde YouTube"
        />
      </Section>

      <Section title="Bloque 4 — Ecosistema OFM Care (trimestres 4+)">
        <p className="text-sm text-stone-700">Aquí nadie nos alcanza. Se construye cuando los bloques anteriores funcionan.</p>

        <Process
          num="P11"
          title="Programa solidario UAPO gamificado"
          resuelve="Convertir UAPO de 'nota a pie de página' a pilar visible y medible. Foso defensivo incopiable."
          pasos={[
            "Convenio formal con UAPO (uso comercial + acceso a cifras).",
            "Medidor público en vivo en home: €donados, familias, proyectos.",
            "Certificado PDF semestral personalizado por cliente.",
            "'Árbol de donaciones' en perfil del cliente (gamification emocional).",
            "Retos mensuales: 'Este mes cada magnesio aporta 2€ extra a UAPO'.",
            "Ediciones solidarias limitadas (Octubre Rosa → 100% a UAPO)."
          ]}
          necesitamos="Convenio UAPO firmado y vigente, auditoría contable de donaciones, revisión Autocontrol."
          stack="Shopify Theme extension + Supabase backend, PDFKit/Sharp."
          duracion="4-6 semanas tras convenio"
          kpi="Donaciones trazables y públicas · NPS +10 · % canje-donación > 20%"
        />

        <Process
          num="P12"
          title="App móvil OFM Care"
          resuelve="Producto → hábito → comunidad. LTV x3. Nadie lo tiene en España."
          pasos={[
            "MVP: diario de toma, recordatorios, integración Apple Health/Google Fit.",
            "v1.1: pedidos one-tap, puntos OFM Care, medidor UAPO personal.",
            "v1.2: comunidad segmentada por objetivos, retos mensuales.",
            "v1.3: derivación a nutricionista y acceso a Academia."
          ]}
          necesitamos="Decisión estratégica (inversión mayor), cuentas App Store + Play Store, política privacidad específica datos salud."
          stack="React Native o Flutter, Supabase, OneSignal."
          duracion="3-4 meses hasta MVP en tienda"
          kpi="5k descargas en 6 meses · retención día-30 > 40% · LTV x2 mínimo"
        />
      </Section>

      <Section title="Lo que necesitamos de Odile el día 1">
        <DataTable headers={["#", "Qué pedimos", "Por qué"]} rows={[
          ["1", "Accesos: Shopify, Cloudflare, Hostinger DNS, Search Console, Klaviyo, Judge.me, GA4, Meta Business", "Bloque 1 arranca el mismo día"],
          ["2", "Contacto directo con responsable de producto (fichas, claims, composiciones)", "Alimenta blog, quiz, asistente IA"],
          ["3", "Estado convenio UAPO (firmado / borrador / verbal)", "Bloquea P4 y P11 si no está"],
          ["4", "Asesoría legal que revise textos (privacidad, convenio, claims)", "RGPD + Autocontrol + EFSA"],
          ["5", "Interlocutor único para decisiones rápidas", "Evita ciclos de validación lentos"],
          ["6", "Baseline: facturación media, AOV, recurrencia, CAC si se conoce", "Sin baseline no hay KPI medible"],
          ["7", "Activos gráficos: logos vectoriales, guía de marca, paleta", "Cualquier entregable con identidad"]
        ]} />
      </Section>

      <Section title="Respuestas preparadas">
        <QA
          q="¿Por dónde empezamos?"
          a="Bloque 1 en paralelo. En 2 semanas tiene placeholder corregido, DKIM activo, CMP legal y estrellas apareciendo en Google. Eso demuestra ritmo antes de pedir nada más grande."
        />
        <QA
          q="¿Cuánto cuesta esto?"
          a="Modelo por paquetes cerrados (no por horas), uno por bloque, con entregables verificables. Empezamos con Bloque 1 como prueba de trabajo acotada. Si el ritmo y la calidad son los que espera, abrimos el 2. Así controla el riesgo."
        />
        <QA
          q="¿Por qué vosotros y no una agencia?"
          a="Una agencia tradicional vende complejidad (lo vimos en el informe 'Por qué nadie lo hace'). Nosotros montamos con IA lo que antes requería equipos de 10 personas, y conocemos dónde está la línea legal. Entregamos en semanas lo que a una agencia le llevaría un trimestre."
        />
        <QA
          q="¿Qué pasa con IVB? Son muy parecidos a nosotros."
          a="Exactamente por eso nos interesa. IVB marca el listón en credibilidad médica y UX básica — su test y su planificador son el estándar a alcanzar. No tienen app, ni IA conversacional real, ni comunidad, ni propósito solidario. Alcanzarlos en paridad (Bloque 2), superarlos con IA real y ecosistema (Bloques 3-4)."
        />
        <QA
          q="¿Qué pasa si el quiz recomienda algo mal?"
          a="Cubierto en el informe legal. Todo son claims EFSA autorizados, es orientativo y siempre deriva a profesional cuando hay bandera médica. Lo que sí es riesgoso (análisis de sangre con IA, interacciones por foto) lo hemos descartado expresamente."
        />
        <QA
          q="¿En cuánto tiempo se ve ROI?"
          a="Bloque 1 da ROI indirecto (reputación, cumplimiento, evitar sanciones). Bloque 2 da ROI directo en 3 meses (+AOV, +retención). Bloque 3 es el que más conversión aporta (quiz bien hecho multiplica x5-10 la conversión del tráfico). Bloque 4 es inversión a LTV."
        />
      </Section>

      <Section title="Stack general (resumen para la mesa)">
        <StatGrid items={[
          { label: "Plataforma", value: "Shopify", detail: "Se mantiene" },
          { label: "Frontend", value: "React + Vite", detail: "Tailwind" },
          { label: "Backend", value: "Supabase", detail: "Auth + datos + edge functions" },
          { label: "IA", value: "Anthropic", detail: "Sonnet 4.6 + Haiku 4.5" },
          { label: "Email", value: "Klaviyo", detail: "Ya existe" },
          { label: "Reseñas", value: "Judge.me", detail: "Ya existe" },
          { label: "CMP", value: "Cookiebot", detail: "O CookieYes" },
          { label: "WhatsApp", value: "Twilio", detail: "O 360dialog" }
        ]} />
      </Section>

      <Section title="Lo que NO prometemos">
        <CheckList type="cross" items={[
          "Plazos milimétricos: prometemos entregables por paquete y demo cada 2 semanas.",
          "Multiplicadores de facturación sin baseline: primero medir, luego proyectar.",
          "Territorio sanitario (MDR): análisis clínicos, interacciones por foto — fuera y documentado.",
          "Claims no autorizados por EFSA: si un producto no puede comunicar un beneficio, no se comunica."
        ]} />
      </Section>

      <Section title="Checklist mental pre-reunión">
        <CheckList items={[
          "Portal navegable con los 9 deliverables abiertos en pestañas.",
          "Quiz funcionando en vivo (mejor argumento).",
          "Lista de 7 accesos a pedir impresa o en móvil.",
          "Preguntar por UAPO pronto — si no hay convenio, cambia el orden del plan.",
          "NO cerrar precio el primer día. Cerrar alcance del Bloque 1 como prueba.",
          "Escuchar más que hablar la primera media hora. Lo que a Odile le duele hoy probablemente no sea exactamente lo que dice el informe."
        ]} />
      </Section>
    </ContentLayout>
  );
}

function Process({ num, title, resuelve, estado, pasos, necesitamos, stack, duracion, kpi }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 grid gap-3">
      <div className="flex items-start gap-3">
        <span className="rounded-full bg-stone-900 text-white text-xs font-bold px-2.5 py-1 shrink-0">{num}</span>
        <h3 className="text-lg font-bold text-stone-900">{title}</h3>
      </div>
      <p className="text-sm text-stone-600"><strong className="text-stone-800">Qué resuelve:</strong> {resuelve}</p>
      {estado ? <p className="text-sm text-emerald-700"><strong>Estado:</strong> {estado}</p> : null}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400 mb-1.5">Pasos</p>
        <ol className="grid gap-1.5 text-sm text-stone-700 list-decimal pl-5">
          {pasos.map((p, i) => <li key={i} className="leading-relaxed">{p}</li>)}
        </ol>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 text-xs">
        <Info label="Necesitamos" value={necesitamos} />
        <Info label="Stack" value={stack} />
        <Info label="Duración" value={duracion} />
        <Info label="KPI" value={kpi} />
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-stone-50 border border-stone-100 p-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400 mb-0.5">{label}</p>
      <p className="text-xs text-stone-700 leading-relaxed">{value}</p>
    </div>
  );
}

function QA({ q, a }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="text-sm font-bold text-stone-900">— {q}</p>
      <p className="mt-1.5 text-sm text-stone-700 leading-relaxed">{a}</p>
    </div>
  );
}
