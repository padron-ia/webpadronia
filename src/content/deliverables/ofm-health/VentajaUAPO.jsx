import { ContentLayout, Section, Callout, CheckList } from "../../components/ContentBlocks";

export default function VentajaUAPO() {
  return (
    <ContentLayout title="Vuestra ventaja competitiva única" subtitle="El ángulo solidario como foso defensivo que ningún competidor ocupa.">
      <Callout type="gold" title="Por qué es vuestro foso defensivo">
        <p>Los competidores no pueden "copiar" un propósito solidario sin que parezca oportunismo. Vosotros ya tenéis la colaboración con Fundación UAPO como parte genuina de la marca. El reto es convertirla en pilar visible, gamificado y medible, no en nota a pie de página.</p>
      </Callout>

      <Section title="Cómo convertirlo en palanca estratégica">
        <CheckList items={[
          "Certificado personal de impacto: cada cliente recibe PDF personalizado cada 6 meses con su aporte a UAPO",
          "Árbol de donaciones visual: en el perfil del cliente, un árbol que crece con cada compra (gamification emocional)",
          "Monedero solidario: los puntos OFM Care se canjean como descuento personal o donación extra a UAPO",
          "Retos de comunidad: \"Este mes, cada compra de magnesio aporta 2€ extra a UAPO\"",
          "Ediciones solidarias limitadas: \"Edición Octubre Rosa\" con 100% de beneficios a UAPO",
          "Portal de transparencia: página pública con acumulado donado, proyectos financiados, testimonios reales"
        ]} />
      </Section>

      <Callout type="info" title="Requisito legal">
        <p>La gamificación del compromiso solidario requiere un convenio formal con la Fundación UAPO que autorice expresamente el uso comercial de su marca y cifras. La transparencia sobre cantidades donadas debe ser verificable, conforme a normativa publicitaria y Autocontrol.</p>
      </Callout>
    </ContentLayout>
  );
}
