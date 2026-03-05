import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { resolveRole } from "../lib/portalAuth";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

function PortalIndexPage() {
    const [target, setTarget] = useState(null);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setTarget("/portal/login");
            return;
        }

        const routeBySession = async () => {
            const {
                data: { session }
            } = await supabase.auth.getSession();

            if (!session?.user) {
                setTarget("/portal/login");
                return;
            }

            const role = await resolveRole(session.user);
            setTarget(role === "admin" ? "/portal/admin" : "/portal/cliente");
        };

        routeBySession();
    }, []);

    if (!target) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-sm text-slate-600">Cargando portal...</p>
            </main>
        );
    }

    return <Navigate to={target} replace />;
}

export default PortalIndexPage;
