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
                        Cada mes pierdes socios que podrías haber retenido. <br /> Y leads que nunca contestaste.
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        Mientras tú estás entrenando, te están escribiendo. Y cuando lees el mensaje, ya se han apuntado en otro sitio. <strong>Hacemos que cada lead reciba respuesta en segundos, cada socio inactivo reciba seguimiento y cada baja se intente recuperar. Sin que toques nada.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg">
                            Quiero dejar de perder socios
                        </a>
                        <p className="text-sm font-medium text-slate-500">En el primer mes medimos: leads respondidos, socios reactivados y bajas evitadas. Números reales, no promesas.</p>
                    </div>
                </section>

                <section className="px-6 py-20 sm:px-10 lg:px-16">
                    <div className="mx-auto w-full max-w-6xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Qué cambia en tu gimnasio</p>
                        <h2 className="mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">
                            Tu software gestiona socios. Nosotros te conseguimos más y evitamos que se vayan.
                        </h2>
                        <p className="mt-5 max-w-3xl text-slate-600">
                            Timp, Harbiz o lo que uses te cobra las cuotas y gestiona horarios. Pero no capta clientes por ti, no retiene a los que se van enfriando ni recupera a los que ya se fueron. Eso es lo que hacemos nosotros.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">No pierdes ni un lead más</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Te escriben por Instagram, web o WhatsApp a las 11 de la noche. Reciben respuesta en segundos y seguimiento hasta que reservan su clase de prueba. Tú te enteras cuando ya están apuntados.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Los inactivos vuelven antes de darse de baja</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">¿Un socio lleva 15 días sin aparecer? Recibe un mensaje personalizado antes de que decida irse. Tú no haces nada. El sistema lo detecta y actúa.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">El nuevo socio se siente atendido desde el minuto 1</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Bienvenida, horarios, normas, primera cita con entrenador. Todo llega solo. Sin que nadie de tu equipo tenga que acordarse.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Si probó y no se apuntó, no se pierde</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Vino a la clase de prueba pero no pagó la cuota. En vez de olvidarlo, recibe la oferta adecuada en el momento justo. Sin que tú muevas un dedo.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Sabes exactamente por qué se van (y cómo evitarlo)</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Ratio de conversión de pruebas, quién se está enfriando, por qué se dan de baja. Datos que tu software de gestión no te da y que valen dinero.</p>
                            </article>
                            <article className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
                                <h3 className="text-xl text-slate-900">Ex-socios que vuelven a pagar</h3>
                                <p className="mt-3 leading-relaxed text-slate-600">Gente que se fue hace meses recibe ofertas de vuelta personalizadas según por qué se fueron y cuánto tiempo estuvieron. Algunos vuelven. Y no te ha costado nada.</p>
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
