import { ContentLayout, Callout, StatGrid } from "../../components/ContentBlocks";

/**
 * Placeholder para el quiz de perfil OFM Care.
 * El quiz completo funcional está en Quiz_OFM_Health.html (standalone).
 * Aquí mostramos una descripción y un enlace para probarlo externamente
 * hasta que se porte la lógica completa a React.
 */
export default function TestPerfilQuiz() {
  return (
    <ContentLayout title="Test de Perfil OFM Care" subtitle="Prototipo funcional: 10 preguntas, motor de recomendación, 3 productos personalizados, pack bundle y captura de email.">
      <StatGrid items={[
        { label: "Preguntas", value: "10", detail: "Estilo de vida y bienestar" },
        { label: "Duración", value: "90 seg", detail: "Rápido y visual" },
        { label: "Resultado", value: "3 productos", detail: "Con % de afinidad" },
        { label: "Legal", value: "Compliant", detail: "Claims EFSA + disclaimer" }
      ]} />

      <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-4xl mb-4">🧬</p>
        <h3 className="text-xl font-semibold text-slate-900">Prototipo construido y funcional</h3>
        <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
          El test completo con las 10 preguntas, el motor de scoring, la recomendación de 3 productos y el pack bundle está construido como prototipo standalone. Cuando se integre en Shopify, se conectará con el catálogo real de productos.
        </p>

        <div className="mt-6 grid gap-3 max-w-md mx-auto text-left">
          <Feature icon="❓" title="10 preguntas de estilo de vida" desc="Prioridades, energía, sueño, sol, alimentación, ejercicio, estrés, edad, preferencias y supervisión médica." />
          <Feature icon="🧠" title="Motor de recomendación" desc="Cada respuesta puntúa etiquetas. Filtros automáticos para veganos, sin gluten o sin lactosa." />
          <Feature icon="🎯" title="3 productos con afinidad" desc="Porcentaje de match, explicación del porqué, badges de dieta." />
          <Feature icon="📧" title="Captura de email" desc="PDF personalizado a cambio del email, con consentimiento RGPD explícito." />
          <Feature icon="⚖️" title="Marco legal integrado" desc="Claims autorizados por EFSA, disclaimer visible, derivación médica." />
        </div>
      </div>

      <Callout type="info" title="Siguiente paso">
        <p>Portar la lógica del quiz a un componente React integrado en la web y conectarlo con el catálogo real de Shopify para que los botones "Añadir al carrito" funcionen directamente.</p>
      </Callout>
    </ContentLayout>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex gap-3 rounded-xl bg-white p-3 border border-slate-200">
      <span className="text-xl shrink-0">{icon}</span>
      <div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="text-xs text-slate-600">{desc}</p></div>
    </div>
  );
}
