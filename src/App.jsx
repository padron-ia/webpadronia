import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingEntrenadores from "./pages/LandingEntrenadores";
import LandingRestaurantes from "./pages/LandingRestaurantes";
import LandingGestorias from "./pages/LandingGestorias";
import LandingGimnasios from "./pages/LandingGimnasios";
import PortalAdminPage from "./pages/PortalAdminPage";
import PortalClientPage from "./pages/PortalClientPage";
import PortalIndexPage from "./pages/PortalIndexPage";
import PortalLoginPage from "./pages/PortalLoginPage";
import PortalSetPasswordPage from "./pages/PortalSetPasswordPage";
import PresenterPage from "./pages/PresenterPage";
import CentroPersonalPage from "./pages/CentroPersonalPage";
import LegalPage from "./pages/LegalPage";

// Redireccion dura al sitio publico. No usa <Navigate> porque el destino es otro dominio.
function ExternalRedirect({ to }) {
    if (typeof window !== "undefined") window.location.replace(to);
    return null;
}

function App() {
    return (
        <Routes>
            {/* Tras el corte del dominio (ago-2026) el sitio publico vive en Astro y esta
                app solo sirve el portal y /centro, en portal.padron-ia.es. Ahi la raiz
                no debe enseñar la landing vieja: manda al sitio nuevo.
                La condicion es por hostname, asi que esto es seguro ANTES y DESPUES del
                corte: mientras la app siga sirviendo padron-ia.es, la landing se ve igual. */}
            <Route
                path="/"
                element={
                    typeof window !== "undefined" && window.location.hostname.startsWith("portal.")
                        ? <ExternalRedirect to="https://padron-ia.es/" />
                        : <LandingPage />
                }
            />
            <Route path="/entrenadores" element={<LandingEntrenadores />} />
            <Route path="/restaurantes" element={<LandingRestaurantes />} />
            <Route path="/gestorias" element={<LandingGestorias />} />
            <Route path="/gimnasios" element={<LandingGimnasios />} />
            <Route path="/portal/login" element={<PortalLoginPage />} />
            <Route path="/portal/set-password" element={<PortalSetPasswordPage />} />
            <Route path="/portal/admin/presenter/:projectId" element={<PresenterPage />} />
            <Route path="/portal/admin/*" element={<PortalAdminPage />} />
            <Route path="/portal/cliente/*" element={<PortalClientPage />} />
            <Route path="/portal" element={<PortalIndexPage />} />
            <Route path="/centro" element={<CentroPersonalPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/privacidad" element={<LegalPage />} />
            <Route path="/cookies" element={<LegalPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
