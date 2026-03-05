import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PortalShell from "../components/portal/PortalShell";
import { resolveRole } from "../lib/portalAuth";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

function PortalClientPage() {
    const [session, setSession] = useState(null);
    const [role, setRole] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
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
            setLoading(false);
        };

        boot();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_, activeSession) => {
            setSession(activeSession);
            if (!activeSession?.user) {
                setRole(null);
                setLeads([]);
                return;
            }
            resolveRole(activeSession.user).then(setRole);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session?.user || role === "admin" || !supabase) return;

        const fetchLeads = async () => {
            const { data } = await supabase
                .from("leads")
                .select("id, name, company, contact, status, lead_grade, created_at")
                .eq("created_by", session.user.id)
                .order("created_at", { ascending: false })
                .limit(100);

            setLeads(data || []);
        };

        fetchLeads();
    }, [session, role]);

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        navigate("/portal/login", { replace: true });
    };

    const openItems = leads.filter((lead) => !lead.status || ["new", "contacted", "qualified", "proposal_sent"].includes(lead.status)).length;
    const closedItems = leads.filter((lead) => ["won", "lost"].includes(lead.status || "")).length;

    if (!isSupabaseConfigured) {
        return (
            <main className="min-h-screen bg-slate-100 px-6 py-10">
                <div className="mx-auto w-full max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
                    Supabase no esta configurado para el portal.
                </div>
            </main>
        );
    }

    if (!loading && !session) return <Navigate to="/portal/login" replace />;
    if (!loading && role === "admin") return <Navigate to="/portal/admin/dashboard" replace />;

    return (
        <PortalShell
            email={session?.user?.email || ""}
            role="client"
            title="Area de Cliente"
            subtitle="Seguimiento de solicitudes y estado de tus registros"
            onLogout={handleLogout}
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Registros</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{leads.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">En seguimiento</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{openItems}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Cerrados</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{closedItems}</p>
                </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Esta area ya esta lista para mostrar progreso de implementaciones, archivos y reportes. Por ahora ves tus registros del formulario.
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Empresa</th>
                            <th className="px-4 py-3">Contacto</th>
                            <th className="px-4 py-3">Grade</th>
                            <th className="px-4 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id} className="border-t border-slate-200">
                                <td className="px-4 py-3 text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-slate-900">{lead.name || "-"}</td>
                                <td className="px-4 py-3 text-slate-700">{lead.company || "-"}</td>
                                <td className="px-4 py-3 text-slate-700">{lead.contact || "-"}</td>
                                <td className="px-4 py-3 text-slate-700">{lead.lead_grade || "-"}</td>
                                <td className="px-4 py-3 text-slate-700">{lead.status || "new"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leads.length === 0 ? <p className="px-4 py-5 text-sm text-slate-500">No hay registros todavia.</p> : null}
            </div>
        </PortalShell>
    );
}

export default PortalClientPage;
