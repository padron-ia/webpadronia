import SolutionsBlueprint from "../components/SolutionsBlueprint";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";

function LandingEntrenadores() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum py-40 px-6 sm:px-10 lg:px-16 text-center">
                    <h1 className="text-5xl lg:text-7xl text-slate-900 leading-[0.92]">
                        Más alumnos, menos chats sin cerrar <br /> y una agenda comercial ordenada
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        Automatizamos captación, calificación y seguimiento por WhatsApp para que no se enfríen tus oportunidades. <strong>Tú te centras en entrenar y vender; el sistema hace el resto operativo.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg">
                            Quiero mi sistema llave en mano
                        </a>
                        <p className="text-sm font-medium text-slate-500">En la primera fase medimos tiempo de respuesta, entrevistas cerradas y altas para validar avance real.</p>
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

export default LandingEntrenadores;
