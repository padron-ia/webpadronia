import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingEntrenadores from "./pages/LandingEntrenadores";
import LandingRestaurantes from "./pages/LandingRestaurantes";
import LandingGestorias from "./pages/LandingGestorias";
import PortalAdminPage from "./pages/PortalAdminPage";
import PortalClientPage from "./pages/PortalClientPage";
import PortalIndexPage from "./pages/PortalIndexPage";
import PortalLoginPage from "./pages/PortalLoginPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/entrenadores" element={<LandingEntrenadores />} />
            <Route path="/restaurantes" element={<LandingRestaurantes />} />
            <Route path="/gestorias" element={<LandingGestorias />} />
            <Route path="/portal/login" element={<PortalLoginPage />} />
            <Route path="/portal/admin/*" element={<PortalAdminPage />} />
            <Route path="/portal/cliente" element={<PortalClientPage />} />
            <Route path="/portal" element={<PortalIndexPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
