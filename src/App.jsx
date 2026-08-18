import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingTienda from "./pages/LandingTienda";
import LandingEscuela from "./pages/LandingEscuela";
import LandingGestorias from "./pages/LandingGestorias";
import PortalAdminPage from "./pages/PortalAdminPage";
import PortalClientPage from "./pages/PortalClientPage";
import PortalIndexPage from "./pages/PortalIndexPage";
import PortalLoginPage from "./pages/PortalLoginPage";
import PortalSetPasswordPage from "./pages/PortalSetPasswordPage";
import PresenterPage from "./pages/PresenterPage";
import CentroPersonalPage from "./pages/CentroPersonalPage";
import LegalPage from "./pages/LegalPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tienda" element={<LandingTienda />} />
            <Route path="/escuela" element={<LandingEscuela />} />
            <Route path="/gestorias" element={<LandingGestorias />} />
            {/* /gimnasios, /entrenadores, /restaurantes (era fitness, fuera de ICP) jubilados 2026-07-14: el catch-all los manda a / */}
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
