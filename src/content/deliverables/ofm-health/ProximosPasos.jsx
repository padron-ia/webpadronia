import { ContentLayout, Section, Callout } from "../../components/ContentBlocks";

const PHASES = [
  { num: 1, title: "Estabilización inmediata", desc: "Corregir placeholder, configurar DKIM/DMARC, instalar CMP de cookies, actualizar política de privacidad, redactar titles y meta descriptions optimizados para home + colecciones + productos top.", kpi: "0 placeholders visibles · DMARC alineado · CMP activo · CTR home +15%" },
  { num: 2, title: "Activos técnicos", desc: "Activar schema Product + AggregateRating (estrellas en Google), reforzar cabeceras HTTP desde Cloudflare, publicar security.txt, optimizar velocidad, mejorar alt texts.", kpi: "Estrellas en SERP · LCP < 2.5s · 100% productos con schema · alt texts > 90%" },
  { num: 3, title: "Estrategia de contenido y autoridad", desc: "Plan editorial del blog (4 pilares), reescribir \"Quiénes somos\", crear páginas \"Cómo formulamos\" y \"Certificaciones\". Construcción de autoridad E-E-A-T.", kpi: "2-4 posts/mes · tráfico orgánico +40% en 6 meses · tiempo de lectura > 2 min" },
  { num: 4, title: "Paridad competitiva", desc: "Programa de puntos OFM Care, plan de referidos, navegación por beneficios, smart cart gamificado, outlet, pago fraccionado, formato monodosis. Alcanzar a HSN y Belevels en palancas comerciales básicas.", kpi: "AOV +20% · tasa de repetición +25% · referidos activos > 5% de clientes" },
  { num: 5, title: "Superar a IVB en inteligencia", desc: "Asistente IA \"Cuida\" en web y WhatsApp, test de perfil 90 seg con recomendación IA dinámica (no árbol estático), configurador visual de rutina, podcast y YouTube con producción asistida por IA.", kpi: "Conversión test > 15% · tiempo respuesta IA < 3s · 1 episodio/semana · CTR email +30%" },
  { num: 6, title: "Visión OFM Care — ecosistema", desc: "App móvil con diario y recordatorios, programa solidario gamificado con UAPO (medidor público), red B2B de profesionales con código propio, comunidad segmentada por objetivos.", kpi: "App > 5k descargas · LTV x3 vs cliente puntual · 50+ profesionales B2B · donaciones UAPO trazables" }
];

export default function ProximosPasos() {
  return (
    <ContentLayout title="Próximos pasos sugeridos" subtitle="Un plan por fases, sin plazos rígidos. Lo que importa es el orden: primero estabilizar, después alcanzar paridad, después superar a IVB con IA y, finalmente, construir el ecosistema que nadie puede copiar.">
      <Callout type="info" title="Lectura estratégica tras incorporar a IVB">
        <p>IVB Wellness Lab marca el listón en credibilidad médica, test y planificador visual. No es enemigo: es el benchmark. Las fases 1-4 buscan <strong>paridad</strong> con el mercado. La fase 5 busca <strong>superar a IVB</strong> añadiendo IA real donde ellos tienen lógica estática. La fase 6 construye el <strong>ecosistema diferencial</strong> (app + comunidad + UAPO gamificado) donde nadie compite hoy.</p>
      </Callout>

      <Section title="Plan de acción por fases">
        <div className="grid gap-4">
          {PHASES.map((phase) => (
            <div key={phase.num} className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center text-sm font-bold shrink-0">{phase.num}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-900">{phase.title}</h3>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">{phase.desc}</p>
                  <div className="mt-3 rounded-lg bg-stone-50 border border-stone-100 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400 mb-1">KPIs de éxito</p>
                    <p className="text-xs text-stone-700 leading-relaxed">{phase.kpi}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Callout type="success" title="Cómo empezar">
        <p>Sugerimos ejecutar la fase 1 como prueba de trabajo acotada, con métricas visibles desde el primer día, para validar ritmo y resultados antes de abrir el resto del plan. Cuando quieras, lo hablamos y cuadramos.</p>
      </Callout>
    </ContentLayout>
  );
}
