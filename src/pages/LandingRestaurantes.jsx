import SolutionsBlueprint from "../components/SolutionsBlueprint";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";

function LandingRestaurantes() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum py-40 px-6 sm:px-10 lg:px-16 text-center">
                    <h1 className="text-5xl lg:text-7xl text-slate-900 leading-[0.92]">
                        Llena más mesas sin saturar al equipo <br /> con llamadas y confirmaciones manuales
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        Automatizamos reservas, confirmaciones y recordatorios por WhatsApp para que cada turno llegue más lleno. <strong>Menos pérdidas por no respuesta y menos cancelaciones de última hora.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg">
                            Automatizar mis reservas ahora
                        </a>
                        <p className="text-sm font-medium text-slate-500">En la fase inicial validamos impacto en reservas confirmadas y tiempo de atención del equipo.</p>
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

export default LandingRestaurantes;
