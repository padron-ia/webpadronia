import HeroSection from "../components/HeroSection";
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
                {/* Aquí irán los componentes específicos de Entrenadores */}
                <section className="premium-gradient-plum py-40 px-6 sm:px-10 lg:px-16 text-center">
                    <h1 className="text-5xl lg:text-7xl text-slate-900 leading-[0.92]">
                        Ayudo a Entrenadores a escalar a 100+ alumnos <br /> y recuperar sus tardes libres
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        Cualificamos al 100% de tus leads por WhatsApp en menos de 1 minuto <strong>sin que tú toques el teléfono.</strong> Consigue resultados en 7 días sin mover un dedo.
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg">
                            Quiero mi sistema llave en mano
                        </a>
                        <p className="text-sm font-medium text-slate-500">Garantía: Si no ahorras 10 horas la primera semana, no pagas nada.</p>
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
