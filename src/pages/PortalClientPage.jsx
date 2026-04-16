import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ClientShell from "../components/client/ClientShell";
import ClientDashboard from "../components/client/ClientDashboard";
import ClientProjectView from "../components/client/ClientProjectView";
import { resolveRole, resolvePrimaryCompany } from "../lib/portalAuth";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

function PortalClientPage() {
    const [session, setSession] = useState(null);
    const [role, setRole] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        const boot = async () => {
            const {
                data: { session: activeSession }
            } = await supabase.auth.getSession();
            setSession(activeSession);

            if (!activeSession?.user) {
                setLoading(false);
                return;
            }

            const nextRole = await resolveRole(activeSession.user);
            setRole(nextRole);

            // Cargar empresa vinculada al usuario
            const primaryCompany = await resolvePrimaryCompany(activeSession.user.id);
            setCompany(primaryCompany?.company || null);

            setLoading(false);
        };

        boot();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_, activeSession) => {
            setSession(activeSession);
            if (!activeSession?.user) {
                setRole(null);
                setCompany(null);
                return;
            }
            resolveRole(activeSession.user).then(setRole);
            resolvePrimaryCompany(activeSession.user.id).then((pc) => setCompany(pc?.company || null));
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        navigate("/portal/login", { replace: true });
    };

    if (!isSupabaseConfigured) {
        return (
            <main className="min-h-screen bg-slate-100 px-6 py-10">
                <div className="mx-auto w-full max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
                    Supabase no está configurado para el portal.
                </div>
            </main>
        );
    }

    if (!loading && !session) return <Navigate to="/portal/login" replace />;
    if (!loading && role === "admin") return <Navigate to="/portal/admin/dashboard" replace />;

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">Cargando tu portal…</p>
            </main>
        );
    }

    return (
        <ClientShell
            email={session?.user?.email || ""}
            companyName={company?.commercial_name || company?.legal_name || null}
            onLogout={handleLogout}
        >
            {selectedProjectId ? (
                <ClientProjectView
                    projectId={selectedProjectId}
                    onBack={() => setSelectedProjectId(null)}
                />
            ) : (
                <ClientDashboard
                    onOpenProject={(project) => setSelectedProjectId(project.id)}
                />
            )}
        </ClientShell>
    );
}

export default PortalClientPage;
