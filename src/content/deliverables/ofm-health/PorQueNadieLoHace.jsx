import { ContentLayout, Section, Callout, CheckList } from "../../components/ContentBlocks";

export default function PorQueNadieLoHace() {
  return (
    <ContentLayout
      title="Por qué nadie más lo está haciendo"
      subtitle="Análisis estratégico: por qué los competidores no implementan estas mejoras, qué oportunidad real supone y por qué el momento es ahora."
    >
      <Callout type="gold" title="La pregunta clave">
        <p>Si estas propuestas son tan buenas, ¿por qué HSN Store, Paleobull, Belevels o Life Pro no las tienen ya? La respuesta no es que no sean rentables — es que hay 7 barreras que juegan a vuestro favor.</p>
      </Callout>

      <Section title="1. Son empresas de producto, no de tecnología">
        <p className="text-sm text-slate-700">Todas las empresas analizadas nacieron como marcas de suplementos. Su fortaleza es formular, fabricar y distribuir. Su equipo digital se reduce a 1-2 personas manteniendo la plantilla de Shopify y alguien gestionando campañas de publicidad.</p>
        <p className="text-sm text-slate-700">No tienen product managers, ni desarrolladores internos, ni estrategas digitales que piensen en experiencias de usuario. Para ellos la web es un catálogo con carrito de compra, no una plataforma de relación con el cliente.</p>
      </Section>

      <Section title="2. El retorno de la innovación digital no es inmediato">
        <p className="text-sm text-slate-700">Si le propones a una empresa de suplementos invertir en un quiz con IA, su primera reacción es: <em>"¿Y cuántas ventas me da? Con ese presupuesto en Google Ads tengo resultados mañana."</em></p>
        <p className="text-sm text-slate-700">Y es verdad: los anuncios pagados son inmediatos y medibles. Pero un quiz genera leads cualificados, sube el ticket medio, fideliza, recoge emails y posiciona como marca innovadora. Su efecto se mide en meses, no en días. La mayoría de propietarios de e-commerce prefieren lo urgente a lo importante.</p>
        <Callout type="info" title="La ventaja de actuar diferente">
          <p>Quien invierte en infraestructura digital (plataforma, IA, experiencia) mientras los demás siguen comprando tráfico pagado, construye un activo que <strong>se acumula</strong>. Los anuncios paran cuando dejas de pagar. La plataforma sigue generando valor.</p>
        </Callout>
      </Section>

      <Section title="3. Las grandes tienen inercia, las pequeñas no tienen recursos">
        <p className="text-sm text-slate-700"><strong>HSN Store</strong> factura probablemente +50M€ al año. Cualquier cambio en su web pasa por varios departamentos, proveedores externos, revisión legal y ciclos de QA. Un quiz que nosotros montamos en días, a ellos les costaría un trimestre y una inversión desproporcionada.</p>
        <p className="text-sm text-slate-700"><strong>Paleobull y Belevels</strong> son equipos de 5-10 personas haciendo de todo. No tienen ancho de banda para innovar: están ocupados sobreviviendo operativamente.</p>
        <Callout type="success" title="Dónde está la oportunidad">
          <p>El hueco está en el medio: marcas con producto sólido y ambición de crecer, pero sin el partner tecnológico adecuado. Exactamente el perfil de OFM Health.</p>
        </Callout>
      </Section>

      <Section title="4. Nadie les ha enseñado que es posible y asequible">
        <p className="text-sm text-slate-700">Este es probablemente el punto más importante. La mayoría de empresas del sector no saben que:</p>
        <CheckList items={[
          "Un asistente IA cuesta entre 50 y 150€/mes en API, no cientos de miles de euros",
          "Un quiz con motor de recomendación se construye en días, no en meses",
          "Un portal de cliente puede estar funcionando en semanas",
          "Un programa de puntos es una app de Shopify de 20€/mes",
          "La suscripción inteligente existe como módulo integrable, no hay que inventarla desde cero"
        ]} />
        <p className="text-sm text-slate-700 mt-3">Creen que "IA" y "plataforma" significan proyectos de Silicon Valley con presupuestos de millones. Y las agencias que les venden servicios refuerzan esa percepción porque cobran por complejidad. Nadie les ha demostrado que se puede hacer de forma ágil, asequible y en su escala.</p>
      </Section>

      <Section title="5. Miedo regulatorio (justificado pero paralizante)">
        <p className="text-sm text-slate-700">En el sector salud, el miedo a cometer un error legal paraliza la innovación. <em>"¿Y si el quiz recomienda algo y nos denuncian?"</em> <em>"¿Y si el chatbot da un consejo médico?"</em></p>
        <p className="text-sm text-slate-700">Es un miedo real (por eso hemos incluido un análisis de marco legal detallado en este informe). Pero la mayoría de empresas no distinguen entre lo que es legalmente arriesgado (análisis clínicos con IA) y lo que es perfectamente legal (quiz orientativo con claims autorizados por EFSA). Se quedan quietas por no saber dónde está la línea.</p>
        <Callout type="info">
          <p>Nosotros ya hemos trazado esa línea: todo lo propuesto en este proyecto está dentro del marco legal. Lo que no lo está, lo hemos descartado expresamente y documentado por qué.</p>
        </Callout>
      </Section>

      <Section title="6. El compromiso solidario NO se puede copiar">
        <p className="text-sm text-slate-700">Las mejoras técnicas (quiz, programa de puntos, smart cart) sí se pueden copiar con tiempo y presupuesto. Pero el compromiso con la Fundación UAPO es incopiable porque:</p>
        <CheckList items={[
          "Requiere un propósito auténtico construido durante años, no una decisión de marketing",
          "Si un competidor lo copia sin historia detrás, parece oportunismo y genera rechazo",
          "Es una barrera emocional y reputacional, no técnica: la más difícil de replicar",
          "Convierte a los clientes en partícipes de una causa, no solo en compradores"
        ]} />
        <p className="text-sm text-slate-700 mt-3">OFM Health ya tiene ese activo. No hay que crearlo, solo hay que activarlo como palanca estratégica visible.</p>
      </Section>

      <Section title="7. El mercado español va 3-5 años por detrás">
        <p className="text-sm text-slate-700">Care/of (quiz + suscripción personalizada de vitaminas) facturó más de 200M$ y fue comprada por Bayer. Persona Nutrition, Baze, Ritual — todas hicieron exactamente lo que estamos proponiendo. Pero en Estados Unidos, hace 3-5 años.</p>
        <p className="text-sm text-slate-700">En España, en el sector de suplementación natural, nadie lo ha ejecutado bien todavía. No es una idea teórica: es un modelo validado en mercados maduros que aún no ha llegado aquí. La ventana de oportunidad es real y tiene fecha de caducidad.</p>
      </Section>

      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white p-8 mt-4">
        <h3 className="text-xl font-bold mb-3">En resumen</h3>
        <p className="text-sm leading-relaxed opacity-90 mb-4">
          Los competidores no hacen esto porque las grandes son lentas, las pequeñas no tienen recursos, las agencias venden complejidad, nadie les ha demostrado que es posible y asequible, y el miedo regulatorio les paraliza.
        </p>
        <p className="text-sm leading-relaxed opacity-90 mb-4">
          OFM Health tiene la combinación perfecta: producto con historia, comunidad leal de +1.600 clientes verificados, propósito solidario auténtico, y ahora un partner que sabe dónde está la línea legal y puede ejecutar rápido.
        </p>
        <p className="text-sm font-semibold text-amber-300">El que se mueva primero, gana. Y el momento es ahora.</p>
      </div>
    </ContentLayout>
  );
}
