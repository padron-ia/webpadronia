import HeroSection from "../components/HeroSection";
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
                        Llena tu restaurante <br /> sin descolgar el teléfono
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        IA que gestiona reservas por WhatsApp e Instagram, envía tu carta y reduce los "no-shows" automáticamente.
                    </p>
                    <div className="mt-10">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold">
                            Automatizar mis reservas
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

export default LandingRestaurantes;
