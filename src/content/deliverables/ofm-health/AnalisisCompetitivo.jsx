import { ContentLayout, Section, Finding, Callout, DataTable, CheckList, StatGrid } from "../../components/ContentBlocks";

export default function AnalisisCompetitivo() {
  return (
    <ContentLayout title="Análisis Competitivo" subtitle="Benchmark contra HSN Store, Paleobull, Belevels, Life Pro Nutrition e IVB Wellness Lab. Qué copiar, qué mejorar y territorios libres.">
      <Section title="Competidores analizados">
        <StatGrid items={[
          { label: "HSN Store", value: "Gigante", detail: "4 sub-marcas, puntos, plan amigo, promos agresivas" },
          { label: "Paleobull", value: "Nicho", detail: "Filosofía paleo, navegación por beneficios" },
          { label: "Belevels", value: "Smart UX", detail: "Smart cart con rewards escalonadas" },
          { label: "Life Pro", value: "Fabricación", detail: "Lab propio, outlet, ediciones limitadas, SeQura" },
          { label: "IVB Wellness", value: "Referente", detail: "Autoridad médica (Dra. Viña), test 3 min, planificador visual, podcast propio" }
        ]} />
        <Callout type="gold" title="IVB Wellness: el competidor más parecido a OFM">
          <p>Marca española de suplementación liderada por la Dra. Isabel Viña (presencia en Vogue, Elle, Marie Claire). Catálogo por líneas (Esencial, Avanzada, Fertilidad, GO & START), protocolos por etapas, podcast "Tus amigas las hormonas", blog activo, consultas con nutricionistas y programa de puntos de recogida. <strong>Ya ejecuta dos de los territorios que marcábamos como libres: test de perfil en 3 min y planificador visual de compatibilidades.</strong> Es la referencia a batir en tono, credibilidad y UX — no en precio ni en volumen.</p>
        </Callout>
      </Section>

      <Section title="Benchmark comparativo">
        <DataTable headers={["Elemento", "HSN", "Paleobull", "Belevels", "Life Pro", "IVB", "OFM"]} rows={[
          ["Programa de puntos", "✓", "✗", "◐", "✗", "◐", "✗"],
          ["Plan de referidos", "✓", "✗", "✗", "✗", "✗", "✗"],
          ["Navegación por beneficios", "✗", "✓", "✗", "✗", "✓", "✗"],
          ["Smart cart con rewards", "✗", "✗", "✓", "✗", "✗", "✗"],
          ["Outlet / liquidación", "✗", "✗", "✗", "✓", "✗", "✗"],
          ["Ediciones limitadas", "✗", "✗", "✗", "✓", "◐", "✗"],
          ["Pago fraccionado", "✗", "✗", "✗", "✓", "✗", "✗"],
          ["Blog activo profundo", "✗", "✗", "✗", "✓", "✓", "◐"],
          ["Podcast propio", "✗", "✗", "✗", "✗", "✓", "✗"],
          ["Autoridad médica / experta", "✗", "✗", "✗", "✗", "★", "◐"],
          ["Protocolos por etapas vitales", "✗", "✗", "✗", "✗", "✓", "✗"],
          ["Chat IA / asistente", "✗", "✗", "✗", "✗", "✗", "✗"],
          ["Test de perfil", "✗", "✗", "✗", "✗", "✓", "✗"],
          ["Configurador/planificador visual", "✗", "✗", "✗", "✗", "✓", "✗"],
          ["Consultas con nutricionista", "✗", "✗", "✗", "✗", "✓", "✗"],
          ["App móvil", "✗", "✗", "✗", "✗", "✗", "✗"],
          ["Comunidad gamificada", "✗", "✗", "✗", "✗", "✗", "✗"],
          ["Propósito solidario real", "✗", "◐", "✗", "✗", "✗", "★"]
        ]} />
        <Callout type="gold" title="Conclusión clave — ajustada tras incorporar IVB">
          <p>IVB cubre el flanco de credibilidad médica, test de perfil, planificador y podcast. Pero <strong>sigue sin haber nadie con IA conversacional, app móvil, comunidad gamificada ni propósito solidario real</strong>. El foso defensivo de OFM se estrecha en UX básica (hay que alcanzar a IVB) y se ensancha en ecosistema (IA + app + UAPO). La batalla ya no es "¿qué nadie hace?" sino "¿qué hace IVB mejor que nosotros y qué podemos hacer que IVB no se atreva a hacer?".</p>
        </Callout>
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

      <Section title="Territorios libres — lo que nadie hace (revisado tras IVB)">
        <DataTable headers={["#", "Propuesta", "Estado", "Impacto"]} rows={[
          ["01", "Asistente IA conversacional en web + WhatsApp", "Libre", "Convierte la fricción en conversación"],
          ["02", "Test de perfil con recomendación IA dinámica", "Ocupado por IVB (sin IA)", "Hay que superarlo con IA real, no solo lógica estática"],
          ["03", "Configurador visual de rutina diaria", "Ocupado por IVB", "Hay que alcanzar paridad como mínimo"],
          ["04", "Academia OFM — formación gamificada", "Libre", "Engagement + autoridad + fidelización"],
          ["05", "App móvil OFM Care", "Libre", "LTV x3 vs cliente puntual"],
          ["06", "Podcast + YouTube con producción IA", "IVB tiene podcast (sin IA)", "Diferenciación por formato y escalabilidad IA"],
          ["07", "Configurador visual de pack drag & drop", "Libre", "Experiencia de compra interactiva"],
          ["08", "Suscripción inteligente (adapta cantidades)", "Libre", "LTV x3, permite swap entre productos"],
          ["09", "Red de profesionales B2B con código propio", "Libre", "Nutricionistas + coaches"],
          ["10", "Comunidad + gamificación solidaria UAPO", "Libre — foso defensivo", "Incopiable por quien no tenga propósito real"]
        ]} />
      </Section>
    </ContentLayout>
  );
}
