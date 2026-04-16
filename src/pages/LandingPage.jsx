import { useEffect } from "react";
import FloatingNavbar from "../components/FloatingNavbar";
import HeroSection from "../components/HeroSection";
import SocialProof from "../components/SocialProof";
import ServicesGrid from "../components/ServicesGrid";
import PortfolioSection from "../components/PortfolioSection";
import SolutionsBlueprint from "../components/SolutionsBlueprint";
import FAQSection from "../components/FAQSection";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";
import CookieBanner from "../components/CookieBanner";

function LandingPage() {
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
            <SocialProof />
            <ServicesGrid />
            <PortfolioSection />
            <SolutionsBlueprint />
            <FAQSection />
            <ConsultForm />
            <Footer />
            <WhatsAppFloatButton />
            <CookieBanner />
        </main>
    );
}

export default LandingPage;
