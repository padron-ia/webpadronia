import { useEffect } from "react";
import FloatingNavbar from "./components/FloatingNavbar";
import HeroSection from "./components/HeroSection";
import ServicesGrid from "./components/ServicesGrid";
import SolutionsBlueprint from "./components/SolutionsBlueprint";
import ConsultForm from "./components/ConsultForm";
import PortalSection from "./components/PortalSection";
import Footer from "./components/Footer";
import WhatsAppFloatButton from "./components/WhatsAppFloatButton";

function App() {
    useEffect(() => {
        const observed = new WeakSet();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
        );

        const observeRevealElements = () => {
            const revealElements = document.querySelectorAll("[data-reveal]");
            revealElements.forEach((el) => {
                if (!observed.has(el) && !el.classList.contains("is-visible")) {
                    observer.observe(el);
                    observed.add(el);
                }
            });
        };

        observeRevealElements();

        const mutationObserver = new MutationObserver(() => {
            observeRevealElements();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return (
        <main className="min-h-screen bg-slate-50">
            <FloatingNavbar />
            <HeroSection />
            <ServicesGrid />
            <SolutionsBlueprint />
            <ConsultForm />
            <PortalSection />
            <Footer />
            <WhatsAppFloatButton />
        </main>
    );
}

export default App;
