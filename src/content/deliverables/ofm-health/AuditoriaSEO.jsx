import { ContentLayout, Section, Finding, Callout, DataTable, CodeBlock, MockupComparison, CheckList, StatGrid } from "../../components/ContentBlocks";

export default function AuditoriaSEO() {
  return (
    <ContentLayout
      title="Auditoría SEO"
      subtitle="Análisis on-page, titles, metas, schema, blog, E-E-A-T, velocidad e imágenes. Hallazgos concretos con propuestas de mejora."
    >
      <StatGrid items={[
        { label: "Hallazgos", value: "8", detail: "3 críticos, 3 medios, 2 bajos" },
        { label: "Reseñas Judge.me", value: "1.666", detail: "4,81★ — invisibles en Google" },
        { label: "Posts blog", value: "6", detail: "En 5 meses, ~150 palabras/post" },
        { label: "Schemas activos", value: "2 de 7", detail: "Faltan Product, Review, Article, FAQ, Breadcrumbs" }
      ]} />

      <Finding title="1. Títulos y meta descripciones sin personalizar" severity="alta" effort="bajo" impact="alto">
        <p>El title tag y la meta description son los dos elementos on-page que más influyen en cómo aparece la web en Google. Actualmente ambos están sin personalizar.</p>
        <CodeBlock label="Title actual de la home">
          ofm-health.com - Suplementos solidarios. – OFM Health
        </CodeBlock>
        <CheckList type="cross" items={[
          "Empieza con el dominio (no aporta nada, consume caracteres)",
          "La marca se repite dos veces",
          "No contiene keywords por las que la gente busca (\"comprar vitamina D\", \"colágeno vegano\", \"magnesio natural\")",
          "No transmite propuesta de valor diferencial",
          "No existe meta description personalizada — Google genera snippet automático"
        ]} />
        <MockupComparison
          before={
            <div>
              <p className="text-blue-700 font-medium">ofm-health.com - Suplementos solidarios. – OFM Health</p>
              <p className="text-xs text-green-700">www.ofm-health.com</p>
              <p className="text-slate-600 text-xs mt-1">Suplementos alimenticios. Fórmulas con ciencia, consciencia y compromiso solidario...</p>
            </div>
          }
          after={
            <div>
              <p className="text-blue-700 font-medium">Suplementos Naturales con Conciencia | Vitamina D, Magnesio, Colágeno – OFM Health</p>
              <p className="text-xs text-green-700">www.ofm-health.com</p>
              <p className="text-amber-600 text-xs">★★★★★ 4,8 · 1.666 opiniones</p>
              <p className="text-slate-600 text-xs mt-1">Suplementos formulados con rigor científico y compromiso solidario. Opciones veganas y sin alérgenos. Envío 24-48h.</p>
            </div>
          }
        />
        <Callout type="success" title="Qué ganamos al corregirlo">
          <p>Aparición en búsquedas donde hoy no estamos, mejora significativa del CTR cuando salimos en Google, y control directo sobre cómo se presenta la web.</p>
        </Callout>
      </Finding>

      <Finding title="2. Placeholder &quot;My store / 123 John Doe Street&quot;" severity="alta" effort="bajo" impact="alto">
        <p>En la página de contacto y en cada ficha de producto aparece el contenido por defecto de Shopify sin editar.</p>
        <CodeBlock>
          My store{"\n"}Free. Usually ready in 24 hrs{"\n"}123 John Doe Street{"\n"}Your Town, YT 12345
        </CodeBlock>
        <CheckList type="cross" items={[
          "Señal negativa de confianza para el usuario",
          "Google lo indexa y contamina el SEO local de Granada",
          "Textos en inglés en una tienda española",
          "Convive con los datos reales (Granada, +34 604 83 73 18)"
        ]} />
        <Callout type="gold" title="Solución">
          <p>Shopify Admin → Configuración → Ubicaciones → editar "My store" con datos reales de Granada o desactivar. En la plantilla de producto, desactivar "Consultar disponibilidad" si no aplica.</p>
        </Callout>
      </Finding>

      <Finding title="3. Las 1.666 reseñas verificadas invisibles para Google" severity="alta" effort="bajo" impact="alto">
        <p>OFM Health tiene Judge.me con 1.666 reseñas verificadas y 4,81★. Es un activo enorme: la mayoría de competidores tienen entre 50 y 300. Pero Google no las ve porque no están conectadas como datos estructurados (schema).</p>
        <MockupComparison
          beforeTitle="Sin schema (actual)"
          afterTitle="Con schema activado"
          before={
            <div>
              <p className="text-blue-700 font-medium">Vitamina D3 Complex Vegana – OFM Health</p>
              <p className="text-xs text-green-700">www.ofm-health.com › products</p>
              <p className="text-slate-600 text-xs mt-1">Vitamina D3 vegana de alta absorción...</p>
            </div>
          }
          after={
            <div>
              <p className="text-blue-700 font-medium">Vitamina D3 Complex Vegana – OFM Health</p>
              <p className="text-amber-600 text-xs">★★★★★ 4,9 · 247 opiniones · 22,90 € · En stock</p>
              <p className="text-xs text-green-700">www.ofm-health.com › products</p>
              <p className="text-slate-600 text-xs mt-1">Vitamina D3 vegana de alta absorción, con vitamina K2...</p>
            </div>
          }
        />
        <Callout type="success" title="Impacto estimado">
          <p>Las estrellas en resultados de Google suben el CTR entre un 20% y un 35%. En salud el efecto puede llegar al 40%. Se resuelve con una app de Shopify tipo "Smart SEO" o "JSON-LD for SEO".</p>
        </Callout>
      </Finding>

      <Finding title="4. Blog infrautilizado y sin estrategia editorial" severity="media" effort="alto (continuo)" impact="alto">
        <p>En suplementación, el tráfico informacional ("para qué sirve...", "beneficios de...") representa entre el 40% y el 70% del tráfico total de las tiendas que trabajan bien el blog.</p>
        <DataTable
          headers={["Métrica", "OFM Health (actual)", "Estándar sector"]}
          rows={[
            ["Frecuencia", "~1 post/mes", "4-8 posts/mes"],
            ["Longitud media", "150-200 palabras", "1.500-3.000 palabras"],
            ["Enlaces a producto", "0", "3-7 por post"],
            ["Citas científicas", "No", "Imprescindible en salud"],
            ["CTAs a producto", "No", "Mín. 1-2 por post"]
          ]}
        />
        <Section title="Volumen de búsqueda disponible (muestra)">
          <DataTable
            headers={["Palabra clave", "Búsquedas/mes España"]}
            highlight={6}
            rows={[
              ["para qué sirve la vitamina D", "14.800"],
              ["beneficios del magnesio", "9.900"],
              ["colágeno marino para qué sirve", "6.600"],
              ["vitamina D3 dosis recomendada", "4.400"],
              ["cuándo tomar magnesio", "3.600"],
              ["tipos de magnesio y para qué sirven", "2.900"],
              ["TOTAL (solo estas 6)", "43.500 búsquedas/mes"]
            ]}
          />
        </Section>
        <Callout type="info" title="Estrategia editorial propuesta">
          <p>4 pilares: por ingrediente (guías completas), comparativas (decisión de compra), síntomas/problemas (capta a quien no sabe que necesita el producto) y estilo de vida (branding). Cada post entre 1.500 y 2.500 palabras con citas a fuentes y enlaces internos.</p>
        </Callout>
      </Finding>

      <Finding title="5. Datos estructurados (schema) incompletos" severity="media" effort="bajo" impact="alto">
        <p>Los datos estructurados le dicen a Google qué es cada elemento de la web. Sin schema, Google adivina. Con schema, sabe y puede mostrar resultados enriquecidos.</p>
        <DataTable
          headers={["Schema", "Presente", "Observación"]}
          rows={[
            ["WebSite", "◐ Parcial", "Falta potentialAction de búsqueda"],
            ["Organization", "◐ Parcial", "Sin logo, sameAs, address"],
            ["BreadcrumbList", "◐ Solo home", "Falta en colecciones y productos"],
            ["Product", "✗ NO", "CRÍTICO: ausente"],
            ["Review / AggregateRating", "✗ NO", "CRÍTICO (con 1.666 reseñas)"],
            ["Article", "✗ NO", "Falta en blog"],
            ["FAQPage", "✗ NO", "Falta"]
          ]}
        />
      </Finding>

      <Finding title="6. Autoridad de marca y E-E-A-T" severity="media" effort="medio" impact="alto a medio plazo">
        <p>Google evalúa páginas de salud con especial rigor (YMYL). OFM Health tiene buenos elementos pero no los está explotando.</p>
        <CheckList items={[
          "Nueva página \"Cómo formulamos\" con proceso real, laboratorios, certificaciones",
          "Página \"Certificaciones y análisis\" con PDFs descargables de análisis de pureza",
          "Ampliar contenido del compromiso con Fundación UAPO",
          "Reescribir \"Quiénes somos\" (actualmente 300-400 palabras, llevarlo a 800-1.200)"
        ]} />
      </Finding>

      <Finding title="7. Velocidad y Core Web Vitals" severity="media" effort="medio">
        <p>Se cargan simultáneamente GTM, GA4, Facebook Pixel, Klaviyo, Judge.me, Shopify Analytics y web pixels manager. Google penaliza la lentitud desde 2021.</p>
        <CheckList items={[
          "Auditar con PageSpeed Insights (home + 1 producto + 1 colección)",
          "Diferir Klaviyo y Judge.me hasta interacción del usuario",
          "Convertir imágenes a WebP/AVIF (30-40% menos de peso)",
          "Activar lazy loading en listados de colecciones largas"
        ]} />
      </Finding>

      <Finding title="8. Imágenes y Google Imágenes" severity="baja" effort="bajo">
        <p>Google Imágenes puede aportar 5-10% del tráfico en nichos de salud y nutrición.</p>
        <CheckList items={[
          "Alt text descriptivo con keyword en cada imagen de producto",
          "Nombres de archivo semánticos (vitamina-d3-complex-vegana.jpg en lugar de IMG_8472.jpg)",
          "Conversión masiva a WebP",
          "Implementar srcset responsive para móvil/desktop"
        ]} />
      </Finding>
    </ContentLayout>
  );
}
