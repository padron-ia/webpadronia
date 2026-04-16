import { ContentLayout, Section, Finding, Callout, DataTable, CheckList, StatGrid } from "../../components/ContentBlocks";

export default function AnalisisCompetitivo() {
  return (
    <ContentLayout title="Análisis Competitivo" subtitle="Benchmark contra HSN Store, Paleobull, Belevels y Life Pro Nutrition. Qué copiar, qué mejorar y territorios libres.">
      <Section title="Competidores analizados">
        <StatGrid items={[
          { label: "HSN Store", value: "Gigante", detail: "4 sub-marcas, puntos, plan amigo, promos agresivas" },
          { label: "Paleobull", value: "Nicho", detail: "Filosofía paleo, navegación por beneficios" },
          { label: "Belevels", value: "Smart UX", detail: "Smart cart con rewards escalonadas" },
          { label: "Life Pro", value: "Fabricación", detail: "Lab propio, outlet, ediciones limitadas, SeQura" }
        ]} />
      </Section>

      <Section title="Benchmark comparativo">
        <DataTable headers={["Elemento", "HSN", "Paleobull", "Belevels", "Life Pro", "OFM"]} rows={[
          ["Programa de puntos", "✓", "✗", "◐", "✗", "✗"],
          ["Plan de referidos", "✓", "✗", "✗", "✗", "✗"],
          ["Navegación por beneficios", "✗", "✓", "✗", "✗", "✗"],
          ["Smart cart con rewards", "✗", "✗", "✓", "✗", "✗"],
          ["Outlet / liquidación", "✗", "✗", "✗", "✓", "✗"],
          ["Ediciones limitadas", "✗", "✗", "✗", "✓", "✗"],
          ["Pago fraccionado", "✗", "✗", "✗", "✓", "✗"],
          ["Blog activo profundo", "✗", "✗", "✗", "✓", "◐"],
          ["Chat IA / asistente", "✗", "✗", "✗", "✗", "✗"],
          ["Test de perfil", "✗", "✗", "✗", "✗", "✗"],
          ["App móvil", "✗", "✗", "✗", "✗", "✗"],
          ["Propósito solidario real", "✗", "◐", "✗", "✗", "★"]
        ]} />
        <Callout type="gold" title="Conclusión clave"><p>Nadie hace IA, nadie tiene comunidad real, nadie tiene app, y OFM Health tiene un ángulo único (solidario UAPO) que no está explotando.</p></Callout>
      </Section>

      <Section title="Lo que incorporar ya (copiar de competidores)">
        <CheckList items={[
          "Programa de puntos: cada euro = 1 punto, canjeables en descuento o donación extra a UAPO",
          "Plan de referidos: 10€ para ti y 10€ para tu amigo en la primera compra",
          "Navegación por beneficios (Energía, Defensas, Huesos, Descanso, Piel, Mujer...)",
          "Smart cart gamificado: añade X€ más y llévate regalo",
          "Outlet permanente: caducidades cortas, stock cerrado",
          "Ediciones limitadas temáticas: Octubre Rosa con donación 100% UAPO",
          "Monodosis y sachets: formato para probar sin compromiso",
          "Pago fraccionado: SeQura o Klarna",
          "Blog activo: 2-4 posts/mes de 1.500+ palabras con fuentes y CTA"
        ]} />
      </Section>

      <Section title="Territorios libres — lo que nadie hace">
        <DataTable headers={["#", "Propuesta", "Impacto"]} rows={[
          ["01", "Asistente IA conversacional en web + WhatsApp", "Convierte la fricción en conversación"],
          ["02", "Test de perfil en 90 segundos con recomendación IA", "Conversión 15-35% vs 2-3%"],
          ["03", "Configurador visual de rutina diaria", "Organiza suplementos por momento del día"],
          ["04", "Academia OFM — formación gamificada", "Engagement + autoridad + fidelización"],
          ["05", "App móvil OFM Care", "LTV x3 vs cliente puntual"],
          ["06", "Podcast + YouTube con producción IA", "Canal infrautilizado en salud natural"],
          ["07", "Configurador visual de pack drag & drop", "Experiencia de compra interactiva"],
          ["08", "Suscripción inteligente (adapta cantidades)", "LTV x3, permite swap entre productos"],
          ["09", "Red de profesionales B2B", "Nutricionistas + coaches con código propio"],
          ["10", "Comunidad + gamificación solidaria UAPO", "Foso defensivo incopiable"]
        ]} />
      </Section>
    </ContentLayout>
  );
}
