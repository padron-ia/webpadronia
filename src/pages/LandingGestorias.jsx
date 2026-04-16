import SolutionsBlueprint from "../components/SolutionsBlueprint";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";
import CookieBanner from "../components/CookieBanner";

function LandingGestorias() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum py-40 px-6 sm:px-10 lg:px-16 text-center">
                    <h1 className="text-5xl lg:text-7xl text-slate-900 leading-[0.92]">
                        Tu equipo pierde 3 horas al día <br /> contestando las mismas preguntas de siempre.
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        "¿Ya habéis presentado mi trimestral?" "¿Me podéis mandar la factura?" "¿Qué documentos necesitáis?" Lo mismo, todos los días, de todos los clientes. <strong>Hacemos que esas respuestas se den solas, la documentación llegue a tiempo y tu equipo trabaje en lo que factura, no en lo que repite.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg">
                            Quiero que mi equipo deje de hacer trabajo de robot
                        </a>
                        <p className="text-sm font-medium text-slate-500">En el primer mes medimos: consultas repetidas eliminadas, tiempo recuperado y capacidad liberada para nuevo trabajo facturable.</p>
                    </div>
                </section>
                <SolutionsBlueprint />
                <ConsultForm />
            </main>
            <Footer />
            <WhatsAppFloatButton />
            <CookieBanner />
        </div>
    );
}

export default LandingGestorias;
