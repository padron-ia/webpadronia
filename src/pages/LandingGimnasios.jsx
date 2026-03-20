import SolutionsBlueprint from "../components/SolutionsBlueprint";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";

function LandingGimnasios() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum py-40 px-6 sm:px-10 lg:px-16 text-center">
                    <h1 className="text-5xl lg:text-7xl text-slate-900 leading-[0.92]">
                        Más socios, menos bajas <br /> y un gimnasio que funciona solo
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        Automatizamos captación de leads, seguimiento de inactivos y reactivación de bajas por WhatsApp para que no pierdas socios por falta de atención. <strong>Tú te centras en entrenar y dirigir; el sistema retiene y capta por ti.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg">
                            Quiero automatizar mi gimnasio
                        </a>
                        <p className="text-sm font-medium text-slate-500">En la primera fase medimos leads captados, socios reactivados y tiempo ahorrado en seguimiento manual.</p>
                    </div>
                </section>

                <section className="px-6 py-20 sm:px-10 lg:px-16">
                    <div className="mx-auto w-full max-w-6xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Lo que automatizamos en tu gimnasio</p>
                        <h2 className="mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">
                            Tu software de gestión hace su parte. Nosotros hacemos todo lo demás.
                        </h2>
                        <p className="mt-5 max-w-3xl text-slate-600">
                            Timp, Harbiz o el software que uses gestiona socios y cobros. Nosotros conectamos todo lo que queda fuera: captación, seguimiento, reactivación e inteligencia de negocio.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Captación automática de leads</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Alguien pregunta por Instagram, web o WhatsApp y recibe respuesta inmediata + seguimiento hasta que reserva su clase de prueba.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Reactivación de inactivos</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Detectamos socios que llevan +15 días sin venir y lanzamos secuencias personalizadas antes de que se den de baja.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Onboarding de nuevos socios</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Bienvenida automática, horarios, normas, primera cita con entrenador. Sin que nadie tenga que acordarse de hacerlo.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Seguimiento post-clase de prueba</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Si vino a probar y no se apuntó, el sistema le contacta con la oferta adecuada en el momento justo.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Dashboard de retención</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Métricas que tu software no te da: ratio de conversión de pruebas, tasa de inactividad temprana, motivos de baja reales.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Campañas de recuperación de bajas</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Secuencias automatizadas para ex-socios con ofertas de vuelta segmentadas por motivo de baja y antigüedad.</p>
                            </article>
                        </div>
                    </div>
                </section>

                <SolutionsBlueprint />
                <ConsultForm />
            </main>
            <Footer />
            <WhatsAppFloatButton />
        </div>
    );
}

export default LandingGimnasios;
