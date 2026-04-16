import SolutionsBlueprint from "../components/SolutionsBlueprint";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";
import CookieBanner from "../components/CookieBanner";

function LandingEntrenadores() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum py-40 px-6 sm:px-10 lg:px-16 text-center">
                    <h1 className="text-5xl lg:text-7xl text-slate-900 leading-[0.92]">
                        Te escriben 20 interesados al mes. <br /> ¿Cuántos se te escapan por no contestar a tiempo?
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        Estás entrenando a un cliente y te llegan 3 mensajes. Cuando contestas, 2 ya han preguntado en otro sitio. <strong>Hacemos que cada interesado reciba respuesta en segundos, seguimiento hasta que cierre y tú no pierdas ni un minuto en perseguir a nadie.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg">
                            Quiero llenar mi agenda sin perseguir a nadie
                        </a>
                        <p className="text-sm font-medium text-slate-500">En el primer mes medimos: respuestas en tiempo, entrevistas cerradas y altas nuevas. Si no mejora, algo estamos haciendo mal.</p>
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

export default LandingEntrenadores;
