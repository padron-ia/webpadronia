import { ContentLayout, Section, Callout, CheckList, StatGrid } from "../../components/ContentBlocks";

export default function MarcoLegal() {
  return (
    <ContentLayout title="Marco Legal y Regulatorio" subtitle="Todo lo propuesto en este informe es legal, factible y ejecutable. Aquí se detalla el marco normativo aplicable y las garantías.">
      <StatGrid items={[
        { label: "📜 RGPD", value: "Cumplido", detail: "Consentimiento + DPIA donde aplique" },
        { label: "🌿 EFSA", value: "Claims autorizados", detail: "Reg. CE 1924/2006 + 432/2012" },
        { label: "🤖 EU AI Act", value: "Fuera alto riesgo", detail: "No diagnóstica, no prescribe" },
        { label: "⚕️ MDR", value: "No aplica", detail: "Descartado software sanitario" }
      ]} />

      <Section title="Normativas aplicables">
        <CheckList items={[
          "RGPD y datos de salud: consentimiento explícito, base jurídica clara, retención mínima y DPIA donde corresponda",
          "Claims EFSA: toda comunicación ajustada al Reglamento CE 1924/2006 y lista autorizada CE 432/2012",
          "AESAN: no se hacen alegaciones terapéuticas, se mantienen advertencias de no sustitución de dieta",
          "Convenio UAPO: requiere acuerdo formal con la Fundación para uso comercial de marca y cifras",
          "EU AI Act: guardrails que mantienen IA fuera de categoría alto riesgo (no diagnostica, no prescribe, deriva al profesional)",
          "MDR (dispositivos médicos): descartada toda funcionalidad que pudiera clasificarse como software sanitario"
        ]} />
      </Section>

      <Section title="Qué ha quedado expresamente fuera del plan">
        <CheckList type="cross" items={[
          "Análisis automatizado de analíticas de sangre: se considera software de apoyo a decisión clínica (MDR Clase IIa)",
          "Detección de interacciones entre suplementos por foto: función propia de software médico certificado"
        ]} />
        <Callout type="info"><p>En su lugar se proponen alternativas educativas y organizativas (Configurador visual de rutina + Academia OFM) que cubren la misma necesidad sin tocar territorio regulatorio sanitario.</p></Callout>
      </Section>

      <Callout type="success" title="En claro">
        <p>Todo lo que aparece en este informe es legal, factible y ejecutable con plataformas estándar del mercado. Los 3 puntos a cuidar durante implementación: claims autorizados EFSA en toda comunicación, marco de privacidad documentado para usos de IA, y convenio sólido con UAPO.</p>
      </Callout>
    </ContentLayout>
  );
}
