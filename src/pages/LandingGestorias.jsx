import HeroSection from "../components/HeroSection";
import SolutionsBlueprint from "../components/SolutionsBlueprint";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";

function LandingGestorias() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum py-40 px-6 sm:px-10 lg:px-16 text-center">
                    <h1 className="text-5xl lg:text-7xl text-slate-900 leading-[0.92]">
                        Tu gestoría en piloto automático <br /> Adiós al caos de facturas
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        Clasificación inteligente de documentos, respuesta automática a dudas fiscales y reclamación de facturas por WhatsApp.
                    </p>
                    <div className="mt-10">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold">
                            Digitalizar mi despacho
                        </a>
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

export default LandingGestorias;
