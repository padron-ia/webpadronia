import { ContentLayout, Section, Callout, StatGrid, DataTable, CheckList } from "../../components/ContentBlocks";

export default function VisionOFMCare() {
  return (
    <ContentLayout title="Visión OFM Care — de tienda a ecosistema" subtitle="La propuesta más potente no es ninguna feature aislada. Es integrar todo bajo una marca paraguas que convierte OFM Health en una plataforma de salud consciente.">
      <StatGrid items={[
        { label: "🎁 Programa", value: "Puntos", detail: "Fidelización + donación" },
        { label: "🤖 IA", value: "Asistente", detail: "\"Cuida\" en web + WhatsApp" },
        { label: "🧬 Test", value: "90 seg", detail: "Perfil personalizado con IA" },
        { label: "📱 App", value: "Móvil", detail: "Diario + recordatorios" },
        { label: "🎙️ Podcast", value: "Semanal", detail: "Salud consciente" },
        { label: "👥 Comunidad", value: "Objetivos", detail: "Por grupos de interés" },
        { label: "💎 Solidaridad", value: "UAPO", detail: "Gamificada + transparente" },
        { label: "🤝 B2B", value: "Red", detail: "Profesionales de salud" }
      ]} />

      <Callout type="gold" title="La idea en una frase">
        <p>"La primera plataforma de salud natural de España que combina suplementación formulada con ciencia, un asistente de IA personalizado, una comunidad de cuidado y un propósito solidario real. No somos una tienda. Somos un ecosistema."</p>
      </Callout>

      <Section title="Por qué esta visión ahora (y no un catálogo más bonito)">
        <p className="text-sm text-stone-700 leading-relaxed">El análisis competitivo confirma que el mercado español de suplementación está maduro en producto y precio, pero inmaduro en experiencia. HSN compite en volumen, Life Pro en fabricación, Belevels en UX de carrito. IVB Wellness Lab es el competidor más parecido a OFM — autoridad médica, test de perfil, planificador visual, podcast — pero su modelo sigue siendo "tienda experta". Nadie en España ha construido un ecosistema de salud integrado con IA conversacional, app, comunidad y propósito real. Esa es la ventana.</p>
      </Section>

      <Section title="Los 8 pilares del ecosistema">
        <DataTable headers={["Pilar", "Qué es", "Para qué", "Prioridad"]} rows={[
          ["🎁 Programa de puntos", "Cada euro = 1 punto OFM Care. Canjeables en descuento o en donación extra a UAPO.", "Fidelización con doble propósito. Convierte compra en acto.", "Fase 1"],
          ["🤖 Asistente IA \"Cuida\"", "Chat conversacional en web y WhatsApp. Responde dudas, recomienda, recuerda pautas, deriva a nutricionista.", "Elimina fricción 24/7. Reduce carga de atención al cliente.", "Fase 2"],
          ["🧬 Test de perfil 90 seg", "Cuestionario inteligente con recomendación IA dinámica (no árbol estático). Salida: pack personalizado + rutina diaria.", "Conversión 15-35% vs 2-3% de tienda plana. Supera al test IVB por IA real.", "Fase 2"],
          ["📱 App OFM Care", "Diario de toma, recordatorios, seguimiento de objetivos, integración con Apple Health/Google Fit, donaciones UAPO visibles.", "LTV x3. Convierte producto en hábito y hábito en comunidad.", "Fase 3"],
          ["🎙️ Podcast + YouTube", "Canal propio producido con apoyo IA (transcripción, highlights, shorts). 1 ep/semana.", "Autoridad editorial + canal orgánico barato. Formato que IVB ya usa pero con escala IA.", "Fase 2"],
          ["👥 Comunidad OFM", "Grupos por objetivo (energía, descanso, mujer, deporte). Retos mensuales. Tabla de impacto UAPO colectiva.", "Foso defensivo. Retención emocional, no transaccional.", "Fase 3"],
          ["💎 Solidaridad UAPO gamificada", "Medidor público en vivo: cuánto se ha donado, cuántas familias, qué proyectos. Medallas por hitos personales.", "Ángulo único incopiable. Diferencia real frente a IVB y al resto.", "Transversal"],
          ["🤝 Red B2B", "Nutricionistas, coaches y entrenadores con código propio, comisión y formación. Descuento para sus clientes.", "Canal de adquisición con autoridad prestada. Acelera credibilidad clínica.", "Fase 3"]
        ]} />
      </Section>

      <Section title="Roadmap por fases (sin plazos rígidos)">
        <div className="grid gap-4">
          {[
            { fase: "Fase 0 — Cimientos (semanas)", desc: "Arreglar SEO y seguridad básica (ver Auditorías). Sin esto, cualquier visión construye sobre arena.", color: "#6b7280" },
            { fase: "Fase 1 — Palancas comerciales", desc: "Puntos OFM Care, plan de referidos, navegación por beneficios, smart cart gamificado, monodosis. Paridad con HSN/Belevels.", color: "#d97706" },
            { fase: "Fase 2 — Inteligencia y contenido", desc: "Asistente IA \"Cuida\" en web + WhatsApp, test de perfil con IA dinámica, podcast y YouTube con producción asistida por IA. Aquí superamos a IVB.", color: "#2E4036" },
            { fase: "Fase 3 — Ecosistema", desc: "App OFM Care, comunidad segmentada, red B2B de profesionales, medidor solidario UAPO público. Aquí nadie nos alcanza.", color: "#7c3aed" },
            { fase: "Fase 4 — Expansión", desc: "Internacionalización selectiva (Portugal, LatAm), edición B2B corporativa (bienestar para empresas), ampliación de UAPO a más causas.", color: "#0891b2" }
          ].map((p, i) => (
            <div key={i} className="flex gap-4 items-start rounded-2xl border border-stone-200 bg-white p-5">
              <div className="w-2 self-stretch rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <div>
                <h3 className="font-semibold text-stone-900">{p.fase}</h3>
                <p className="mt-1 text-sm text-stone-600 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Qué hace esta visión no comparable">
        <CheckList items={[
          "No competimos en precio: competimos en categoría (ecosistema vs tienda).",
          "No competimos en catálogo: competimos en experiencia personalizada con IA real.",
          "No competimos en autoridad prestada: la construimos con podcast, nutricionistas y comunidad propia.",
          "No competimos en marketing: convertimos cada compra en un acto solidario medible.",
          "Cuando IVB u otro quiera copiar alguna pieza, OFM ya estará en la siguiente.",
          "El único foso verdaderamente incopiable es el propósito UAPO — y ya lo tenéis."
        ]} />
      </Section>

      <Callout type="gold" title="Por qué funciona">
        <p>Esta visión no se construye en un día. Se construye por capas, en el orden correcto. Y justamente porque es ambiciosa, convierte la propuesta en no comparable con HSN, Paleobull, Belevels, Life Pro ni IVB. Se pasa de competir en precio a competir en categoría — y en esa liga solo juega quien la crea.</p>
      </Callout>
    </ContentLayout>
  );
}
