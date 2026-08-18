import SolutionsBlueprint from "../components/SolutionsBlueprint";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";
import CookieBanner from "../components/CookieBanner";

function LandingRestaurantes() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum py-40 px-6 sm:px-10 lg:px-16 text-center">
                    <h1 className="text-5xl lg:text-7xl text-slate-900 leading-[0.92]">
                        Mesas vacías por cancelaciones. <br /> Teléfono que nadie coge en hora punta.
                    </h1>
                    <p className="mt-6 text-xl text-slate-700 max-w-2xl mx-auto">
                        Mientras tu equipo sirve mesas, pierdes reservas porque nadie contesta el teléfono. Y las que tienes se cancelan porque nadie confirmó. <strong>Hacemos que las reservas se confirmen solas, las cancelaciones se repongan al instante y tu equipo sirva en vez de contestar llamadas.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg">
                            Quiero más mesas llenas y menos cancelaciones
                        </a>
                        <p className="text-sm font-medium text-slate-500">En el primer mes medimos: reservas confirmadas, cancelaciones reducidas y llamadas que ya no tiene que coger nadie.</p>
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

export default LandingRestaurantes;
