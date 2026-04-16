import { ContentLayout, Section, Callout, StatGrid } from "../../components/ContentBlocks";

export default function VisionOFMCare() {
  return (
    <ContentLayout title="Visión OFM Care — de tienda a ecosistema" subtitle="La propuesta más potente no es ninguna feature aislada. Es integrar todo bajo una marca paraguas que convierte OFM Health en una plataforma de salud consciente.">
      <StatGrid items={[
        { label: "🎁 Programa", value: "Puntos", detail: "Fidelización + donación" },
        { label: "🤖 IA", value: "Asistente", detail: "\"Cuida\" en web + WhatsApp" },
        { label: "🧬 Test", value: "90 seg", detail: "Perfil personalizado" },
        { label: "📱 App", value: "Móvil", detail: "Diario + recordatorios" },
        { label: "🎙️ Podcast", value: "Semanal", detail: "Salud consciente" },
        { label: "👥 Comunidad", value: "Objetivos", detail: "Por grupos de interés" },
        { label: "💎 Solidaridad", value: "UAPO", detail: "Gamificada + transparente" },
        { label: "🤝 B2B", value: "Red", detail: "Profesionales de salud" }
      ]} />

      <Callout type="gold" title="La idea en una frase">
        <p>"La primera plataforma de salud natural de España que combina suplementación formulada con ciencia, un asistente de IA personalizado, una comunidad de cuidado y un propósito solidario real. No somos una tienda. Somos un ecosistema."</p>
      </Callout>

      <Section title="Por qué funciona">
        <p className="text-sm text-slate-700">Esta visión no se construye en un día. Se construye por capas, en el orden correcto. Y justamente porque es ambiciosa, convierte la propuesta en no comparable con HSN, Paleobull, Belevels ni Life Pro. Se pasa de competir en precio a competir en categoría.</p>
      </Section>
    </ContentLayout>
  );
}
