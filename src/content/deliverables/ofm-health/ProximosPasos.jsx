import { ContentLayout, Section, Callout } from "../../components/ContentBlocks";

const PHASES = [
  { num: 1, title: "Estabilización inmediata", desc: "Corregir placeholder, configurar DKIM/DMARC, instalar CMP de cookies, actualizar política de privacidad, redactar titles y meta descriptions optimizados para home + colecciones + productos top." },
  { num: 2, title: "Activos técnicos", desc: "Activar schema Product + AggregateRating (estrellas en Google), reforzar cabeceras HTTP desde Cloudflare, publicar security.txt, optimizar velocidad, mejorar alt texts." },
  { num: 3, title: "Estrategia de contenido y autoridad", desc: "Plan editorial del blog (4 pilares), reescribir \"Quiénes somos\", crear páginas \"Cómo formulamos\" y \"Certificaciones\". Construcción de autoridad E-E-A-T." },
  { num: 4, title: "Diferenciación competitiva", desc: "Programa de puntos OFM Care, plan de referidos, navegación por beneficios, smart cart gamificado, outlet, pago fraccionado, formato monodosis." },
  { num: 5, title: "Visión OFM Care", desc: "Asistente IA en web y WhatsApp, test de perfil, programa solidario gamificado con UAPO, red B2B de profesionales, app móvil, podcast y YouTube." }
];

export default function ProximosPasos() {
  return (
    <ContentLayout title="Próximos pasos sugeridos" subtitle="Un plan por fases, sin plazos rígidos. Lo que importa es el orden: primero estabilizar, después activar palancas, finalmente construir la visión.">
      <Section title="Plan de acción por fases">
        <div className="grid gap-4">
          {PHASES.map((phase) => (
            <div key={phase.num} className="flex gap-4 items-start rounded-2xl border border-slate-200 bg-white p-5">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">{phase.num}</div>
              <div>
                <h3 className="font-semibold text-slate-900">{phase.title}</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{phase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Callout type="success" title="Cómo empezar">
        <p>Mi propuesta sería ejecutar la primera fase como prueba de trabajo, con métricas claras y visibles, para que veas resultados antes de decidir cualquier compromiso mayor. Cuando quieras, lo hablamos y cuadramos.</p>
      </Callout>
    </ContentLayout>
  );
}
