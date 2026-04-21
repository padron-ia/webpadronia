# Briefing reunión Odile — OFM Health

**Objetivo de la reunión:** pasar de "informe entregado" a "plan de trabajo conjunto". Odile quiere colaboración, no presentación. Cerrar alcance, orden, requisitos y responsables.

---

## Cómo contar el plan en 30 segundos

> "Tenemos cuatro bloques. El primero sanea lo que ya existe (SEO, seguridad, legal). El segundo alcanza a los competidores en palancas comerciales básicas. El tercero supera a IVB con IA real. El cuarto construye el ecosistema OFM Care, que ya nadie puede copiar. Cada bloque entrega valor por sí solo, y cada uno desbloquea el siguiente."

---

## Bloque 1 — Estabilización (semanas 1-4)

Son procesos **sin los cuales nada de lo demás tiene sentido**. Riesgo reputacional y legal si se dejan.

### P1. Higienización técnica urgente
- **Qué resuelve:** placeholder "My store / 123 John Doe Street" en contacto y fichas, datos estructurados incompletos, invisibilidad de las 1.666 reseñas en Google.
- **Pasos:**
  1. Auditoría de páginas afectadas en Shopify Admin.
  2. Edición de ubicación real (Granada) y desactivación del módulo de disponibilidad.
  3. Instalación app JSON-LD (Smart SEO o JSON-LD for SEO) — schemas Product, Review, Article, FAQ, Breadcrumbs, Organization.
  4. Verificación en Search Console + Rich Results Test.
- **Necesitamos de Odile:** accesos a Shopify Admin (colaborador), Search Console y Cloudflare. Dirección física y fiscal confirmada. Validación de bio corporativa.
- **Nuestro stack:** Shopify apps, Search Console, Rich Results Test, mxtoolbox.
- **Duración estimada:** 1-2 semanas.
- **KPI:** 0 placeholders visibles, estrellas en SERP para productos top, CTR home +15%.

### P2. Seguridad correo y cabeceras
- **Qué resuelve:** ausencia de DKIM (riesgo de phishing contra +1.600 clientes), DMARC sin reporting, cabeceras HTTP parciales, sin security.txt.
- **Pasos:**
  1. Generar DKIM en Hostinger y publicar TXT en DNS.
  2. Ampliar DMARC con rua/ruf a buzón dedicado.
  3. Transform Rules en Cloudflare para Referrer-Policy, Permissions-Policy y CSP completo.
  4. Crear security@ofm-health.com y publicar `/.well-known/security.txt`.
  5. Monitorización SSL con Uptime Robot.
- **Necesitamos:** accesos DNS (Hostinger), Cloudflare y creación de alias security@.
- **Stack:** Hostinger, Cloudflare Transform Rules, mxtoolbox, Google Postmaster, Uptime Robot.
- **Duración:** 3-5 días.
- **KPI:** DKIM alineado, DMARC con reporting activo, Mozilla Observatory B+ o superior.

### P3. Cumplimiento RGPD (cookies + política)
- **Qué resuelve:** GTM/Pixel/Klaviyo cargando antes de consentimiento, política que solo menciona GA. Sanciones AEPD potenciales.
- **Pasos:**
  1. Instalar CMP certificada (Cookiebot o CookieYes — app oficial Shopify).
  2. Configurar bloqueo de GTM, Pixel, Klaviyo, Judge.me hasta aceptación.
  3. Reescribir política de privacidad listando todos los encargados y transferencias a EEUU (Schrems II).
  4. Banner con "Aceptar / Rechazar / Configurar" con igual peso visual.
  5. Registro documental del consentimiento.
- **Necesitamos:** revisión jurídica (asesor de Odile) del texto final, decisión sobre nivel de bloqueo.
- **Stack:** Cookiebot/CookieYes, Shopify, redactor legal.
- **Duración:** 1 semana.
- **KPI:** 0 cookies no esenciales antes de consentimiento, registro auditable.

---

## Bloque 2 — Paridad comercial (semanas 4-12)

Alcanzamos a HSN, Belevels y Life Pro en palancas básicas. Sin esto, la visión queda en humo.

### P4. Programa de puntos OFM Care (con ángulo UAPO)
- **Qué resuelve:** fidelización y retención. Ningún competidor une puntos + donación.
- **Pasos:**
  1. Elección de plataforma (Smile.io, LoyaltyLion o Yotpo Loyalty).
  2. Reglas: 1€ = 1 punto OFM Care, bonus por referido, bonus por reseña.
  3. Canje dual: descuento personal **o** donación extra a UAPO.
  4. Landing "Cómo funciona OFM Care" con explicación del doble propósito.
  5. Migración de histórico de clientes (si la plataforma lo permite).
- **Necesitamos:** convenio firmado con UAPO que autorice uso comercial de marca y cifras. Decisión sobre ratios de canje.
- **Stack:** Smile.io (~50-200€/mes), Shopify, Klaviyo para comunicación.
- **Duración:** 2-3 semanas.
- **KPI:** AOV +20%, tasa de repetición +25%, % de puntos canjeados como donación (métrica de propósito).

### P5. Plan de referidos ("10 para ti, 10 para tu amigo")
- **Pasos:**
  1. Configurar motor de referidos (integrable con Smile o ReferralCandy).
  2. Link único por cliente + código.
  3. Email de invitación automatizado en Klaviyo.
  4. Dashboard de recompensas por cliente.
- **Necesitamos:** definir cuantía del incentivo y tope mensual.
- **Stack:** Smile / ReferralCandy, Klaviyo.
- **Duración:** 1 semana.
- **KPI:** referidos activos > 5% de base de clientes.

### P6. Navegación por beneficios + Smart Cart + Outlet
- **Qué resuelve:** organización del catálogo por problema del usuario (Energía, Defensas, Descanso, Piel, Deporte, Mujer…) en lugar de por categoría de ingrediente.
- **Pasos:**
  1. Taxonomía de beneficios (6-8 colecciones transversales).
  2. Mapeo producto → beneficios (matriz).
  3. Smart cart gamificado: "Te faltan 12€ para envío gratis / regalo".
  4. Sección outlet con caducidades cortas o lotes cerrados.
- **Necesitamos:** validación de Odile del mapeo producto↔beneficio (es decisión editorial).
- **Stack:** Shopify collections, Slide Cart o RebuyEngine, tema base.
- **Duración:** 2 semanas.
- **KPI:** páginas/sesión +30%, conversión colección→carrito +15%.

### P7. Estrategia editorial del blog
- **Qué resuelve:** 43.500 búsquedas/mes en solo 6 keywords que hoy no capturamos. Blog actual: 150-200 palabras por post, sin citas.
- **Pasos:**
  1. Keyword research completo (200+ términos, 4 pilares).
  2. Calendario editorial: 2-4 posts/mes de 1.500-2.500 palabras.
  3. Plantilla con citas a fuentes (EFSA, PubMed), enlaces internos y CTA a producto.
  4. Reescritura de "Quiénes somos" (800-1.200 palabras) + páginas nuevas "Cómo formulamos" y "Certificaciones".
- **Necesitamos:** acceso al equipo técnico/científico de OFM para validación de contenido (claims EFSA). Budget para redactor freelance o decisión de asumirlo in-house.
- **Stack:** Ahrefs/Semrush (keyword research), Google Docs, Shopify blog. IA de soporte (Claude/GPT) para borradores — nunca publicar sin revisión humana.
- **Duración:** estrategia en 2 semanas, ejecución continua.
- **KPI:** tráfico orgánico +40% en 6 meses, tiempo de lectura > 2 min, ranking top-10 para 20+ keywords.

---

## Bloque 3 — Superar a IVB con IA (semanas 8-20)

IVB marca el listón en credibilidad y UX. Aquí es donde dejamos de copiar y pasamos a diferenciarnos.

### P8. Test de perfil 90 segundos con IA dinámica
- **Estado:** prototipo funcional ya construido (10 preguntas, 10 productos, scoring, filtros dietéticos, bundle). Ver `src/content/prototypes/ofm-health/TestPerfilQuiz.jsx`.
- **Qué nos diferencia de IVB:** IVB usa árbol de decisión estático. Nosotros añadimos recomendación IA que reinterpreta respuestas, personaliza el copy del resultado y genera una rutina diaria.
- **Pasos restantes:**
  1. Integración real con catálogo Shopify (API Storefront).
  2. Añadir capa IA (Claude Haiku 4.5) que reescribe el resultado con el tono de OFM y matiza por combinación de respuestas.
  3. Captura de email antes del resultado → Klaviyo → flujo educativo 5 emails.
  4. Generación automática de pack en carrito con descuento bundle.
  5. Aviso EFSA/AESAN y derivación a nutricionista si hay bandera médica.
  6. A/B test vs tienda plana.
- **Necesitamos:** catálogo consolidado (nombre, tags, dietary, precios), claim EFSA aprobado por producto, decisión sobre descuento bundle (-10%/-15%).
- **Stack:** React, Shopify Storefront API, Anthropic API (Haiku 4.5), Klaviyo.
- **Coste operativo IA:** 30-80€/mes en API con volumen realista.
- **Duración:** 2-3 semanas desde prototipo.
- **KPI:** conversión test > 15% (vs 2-3% tienda plana), email capture > 60%.

### P9. Asistente IA conversacional "Cuida" (web + WhatsApp)
- **Qué resuelve:** nadie en España de suplementación tiene esto. IVB ofrece consulta con nutricionista (cuello de botella humano); nosotros ofrecemos 24/7.
- **Pasos:**
  1. Corpus de conocimiento: fichas de producto, claims EFSA, FAQs, políticas, histórico de dudas frecuentes.
  2. Guardrails legales: no diagnostica, no prescribe, deriva a profesional. Cumplimiento EU AI Act fuera de categoría alto riesgo.
  3. Embebido en web (widget discreto) + número WhatsApp Business con webhook.
  4. Escalado a humano (nutricionista o atención) cuando hay bandera médica o insatisfacción.
  5. Logs auditables y dashboard de conversaciones.
- **Necesitamos:** acceso a base de conocimiento (fichas técnicas, FAQs), decisión sobre nutricionista que actúa como escalado, WhatsApp Business API.
- **Stack:** Anthropic API (Sonnet 4.6 para conversación), RAG con Supabase/Pinecone, Twilio/360dialog para WhatsApp Business.
- **Coste operativo:** 80-200€/mes según volumen.
- **Duración:** 4-6 semanas.
- **KPI:** tiempo respuesta < 3s, tasa resolución sin humano > 70%, derivación a venta > 15%.

### P10. Podcast + YouTube con producción IA
- **Qué resuelve:** IVB tiene podcast ("Tus amigas las hormonas") con producción artesanal. Nosotros entramos con escala IA.
- **Pasos:**
  1. Formato definido (20-30 min, 1 ep/semana, tema + invitado o en solitario).
  2. Pipeline IA: transcripción (Whisper), show notes, fragmentos cortos para Reels/Shorts, miniaturas, newsletter automática.
  3. Distribución en Spotify, Apple, YouTube, web OFM.
  4. Integración con blog: cada episodio genera un post largo.
- **Necesitamos:** persona presentadora (Odile o figura médica), calendario editorial, equipo mínimo (micro + cámara).
- **Stack:** Descript o similar, Whisper, Claude para show notes y fragmentos, Buzzsprout/Transistor, YouTube.
- **Duración:** 2 semanas setup + continuo.
- **KPI:** 1 ep/semana sin fallo, +500 descargas/ep en mes 6, tráfico orgánico procedente de YouTube.

---

## Bloque 4 — Ecosistema OFM Care (trimestres 4+)

Aquí nadie nos alcanza. Se construye cuando los bloques anteriores funcionan.

### P11. Programa solidario UAPO gamificado
- **Qué resuelve:** convertir la colaboración con UAPO de "nota a pie de página" a pilar visible y medible. Foso defensivo incopiable.
- **Pasos:**
  1. Convenio formal con UAPO que autorice uso comercial y acceso a cifras verificables.
  2. Medidor público en vivo en home: €donados, familias impactadas, proyectos.
  3. Certificado PDF semestral personalizado por cliente con su aporte.
  4. "Árbol de donaciones" en perfil del cliente (gamification emocional).
  5. Retos mensuales: "Este mes cada magnesio aporta 2€ extra a UAPO".
  6. Ediciones solidarias limitadas (Octubre Rosa → 100% a UAPO).
- **Necesitamos:** convenio UAPO firmado y vigente, auditoría contable de donaciones, revisión Autocontrol de la comunicación.
- **Stack:** desarrollo a medida sobre Shopify (Theme extension + backend ligero Supabase), generación PDF con Sharp/PDFKit.
- **Duración:** 4-6 semanas tras convenio.
- **KPI:** donaciones UAPO trazables y públicas, NPS +10 puntos, % clientes que eligen canje-donación > 20%.

### P12. App móvil OFM Care
- **Qué resuelve:** producto → hábito → comunidad. LTV x3. Nadie lo tiene en España.
- **Pasos:**
  1. MVP con 3 funciones: diario de toma, recordatorios, integración Apple Health/Google Fit.
  2. v1.1: pedidos con un toque, puntos OFM Care, medidor UAPO personal.
  3. v1.2: comunidad segmentada por objetivos, retos mensuales.
  4. v1.3: derivación a nutricionista y acceso a contenido Academia.
- **Necesitamos:** decisión estratégica (es inversión mayor), cuentas App Store + Play Store de OFM, política de privacidad específica para datos de salud.
- **Stack:** React Native o Flutter, Supabase (backend + auth), OneSignal (push).
- **Duración:** 3-4 meses hasta MVP en tienda.
- **KPI:** 5k descargas en 6 meses, retención día-30 > 40%, LTV vs no-usuarios x2 mínimo.

---

## Lo que necesitamos de Odile el día 1 (lista para pedir en reunión)

| Nº | Qué pedimos | Por qué |
|----|-------------|---------|
| 1 | Accesos: Shopify (colaborador), Cloudflare, Hostinger DNS, Search Console, Klaviyo, Judge.me, GA4, Meta Business | Bloque 1 arranca el mismo día |
| 2 | Contacto directo con persona responsable del producto (fichas, claims, composiciones) | Alimenta blog, quiz, asistente IA |
| 3 | Estado del convenio con Fundación UAPO (firmado, borrador, verbal) | Bloquea P4 y P11 si no está |
| 4 | Acceso a asesoría legal que revise textos (política privacidad, convenio, claims) | Cumplimiento RGPD + Autocontrol + EFSA |
| 5 | Interlocutor único por su parte para decisiones rápidas | Evita ciclos de validación lentos |
| 6 | Datos actuales: facturación media, AOV, tasa de recurrencia, CAC si lo conoce | Sin baseline no hay KPI medible |
| 7 | Activos gráficos: logos vectoriales, guía de marca si existe, paleta definitiva | Cualquier entregable con identidad |

---

## Respuestas a preguntas probables de Odile

**"¿Por dónde empezamos?"**
Bloque 1 en paralelo. En 2 semanas tiene placeholder corregido, DKIM activo, CMP legal y estrellas apareciendo en Google. Eso demuestra ritmo antes de pedir nada más grande.

**"¿Cuánto cuesta esto?"**
El modelo que proponemos es por **paquetes cerrados** (no por horas), uno por bloque, con entregables verificables. Empezamos con Bloque 1 como prueba de trabajo acotada. Si el ritmo y la calidad son los que espera, abrimos el 2. Así controla el riesgo.

**"¿Por qué vosotros y no una agencia?"**
Una agencia tradicional vende complejidad (lo vimos en el informe "Por qué nadie lo hace"). Nosotros montamos con IA lo que antes requería equipos de 10 personas, y conocemos dónde está la línea legal. Entregamos en semanas lo que a una agencia le llevaría un trimestre.

**"¿Qué pasa con IVB? Son muy parecidos a nosotros."**
Exactamente por eso nos interesa tanto. IVB marca el listón en credibilidad médica y UX básica — su test y su planificador son el estándar a alcanzar. Pero no tienen app, ni IA conversacional real, ni comunidad, ni propósito solidario. El plan es alcanzarlos en paridad (Bloque 2) y superarlos con IA real y ecosistema (Bloques 3-4).

**"¿Qué pasa si el quiz recomienda algo mal?"**
Cubierto en el informe legal. Todo son claims EFSA autorizados, es orientativo y siempre deriva a profesional cuando hay bandera médica. Lo que sí es riesgoso (análisis de sangre con IA, interacciones por foto) lo hemos descartado expresamente.

**"¿En cuánto tiempo se ve ROI?"**
Bloque 1 da ROI indirecto (reputación, cumplimiento, evitar sanciones). Bloque 2 da ROI directo en 3 meses (+AOV, +retención). Bloque 3 es el que más conversión aporta (quiz bien hecho multiplica x5-10 la conversión del tráfico). Bloque 4 es inversión a LTV.

---

## Stack general (resumen para la mesa)

- **Plataforma base:** Shopify (se mantiene).
- **Frontend:** React + Vite + Tailwind (lo que ya tenemos nosotros para entregables y prototipos).
- **Backend ligero:** Supabase (auth, datos, storage, edge functions).
- **IA:** Anthropic API (Claude Sonnet 4.6 conversación, Haiku 4.5 tareas rápidas y baratas).
- **Email:** Klaviyo.
- **Reseñas:** Judge.me (ya lo tienen).
- **CMP cookies:** Cookiebot o CookieYes.
- **WhatsApp Business:** Twilio o 360dialog.
- **Monitorización:** Uptime Robot, Google Postmaster, mxtoolbox.

Todo probado, todo asequible, todo con salida si hubiera que cambiar.

---

## Lo que NO prometemos

Importante decirlo en la reunión para construir confianza, no expectativas infladas:

- No prometemos plazos milimétricos: prometemos entregables por paquete y demo funcional cada 2 semanas.
- No prometemos multiplicadores de facturación sin baseline: primero medimos, luego proyectamos.
- No tocamos territorio sanitario (MDR): análisis clínicos, interacciones farmacológicas por foto — quedan fuera y documentado por qué.
- No hacemos publicidad engañosa ni claims no autorizados por EFSA. Si un producto no puede comunicar un beneficio, no se comunica.

---

## Checklist mental antes de entrar a la reunión

- [ ] Llevar el proyecto navegable (portal con los 9 deliverables abiertos en pestañas).
- [ ] Tener el quiz funcionando para demostrarlo en vivo (es el mejor argumento).
- [ ] Llevar lista de accesos a pedir impresa o en móvil.
- [ ] Preguntar por UAPO pronto — si no hay convenio firmado, cambia el orden del plan.
- [ ] No cerrar precio el primer día. Cerrar alcance del Bloque 1 como prueba y presupuestar eso solo.
- [ ] Escuchar más de lo que hablas en la primera media hora: lo que a Odile le duele hoy probablemente no sea exactamente lo que dice el informe.
