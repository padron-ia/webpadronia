import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const getAdminEmails = () =>
    (import.meta.env.VITE_ADMIN_EMAILS || "")
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);

function PortalSection() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [leads, setLeads] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const adminEmails = useMemo(() => getAdminEmails(), []);

    const role = useMemo(() => {
        if (profile?.role) return profile.role;
        const userEmail = session?.user?.email?.toLowerCase();
        if (userEmail && adminEmails.includes(userEmail)) return "admin";
        return "client";
    }, [adminEmails, profile, session]);

    const fetchProfile = async (userId) => {
        if (!supabase) return;
        const { data } = await supabase.from("profiles").select("id, role, full_name").eq("id", userId).maybeSingle();
        if (data) {
            setProfile(data);
            return;
        }

        const { data: inserted } = await supabase
            .from("profiles")
            .insert({ id: userId, role: "client" })
            .select("id, role, full_name")
            .maybeSingle();

        if (inserted) setProfile(inserted);
    };

    const fetchLeads = async (user) => {
        if (!supabase) return;

        const isAdmin = adminEmails.includes((user?.email || "").toLowerCase()) || profile?.role === "admin";
        let query = supabase.from("leads").select("id, name, company, contact, status, lead_grade, created_at").order("created_at", { ascending: false }).limit(50);

        if (!isAdmin) {
            query = query.eq("created_by", user.id);
        }

        const { data } = await query;
        setLeads(data || []);
    };

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) return;

        const boot = async () => {
            const {
                data: { session: activeSession }
            } = await supabase.auth.getSession();
            setSession(activeSession);
            if (activeSession?.user) {
                await fetchProfile(activeSession.user.id);
            }
        };

        boot();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_, activeSession) => {
            setSession(activeSession);
            setProfile(null);
            if (!activeSession) setLeads([]);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session?.user) return;
        fetchProfile(session.user.id);
    }, [session]);

    useEffect(() => {
        if (!session?.user) return;
        fetchLeads(session.user);
    }, [session, profile]);

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!supabase) return;
        setStatus("loading");
        setError("");

        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

        if (loginError) {
            setStatus("idle");
            setError(loginError.message);
            return;
        }

        setStatus("success");
    };

    const handleSignUp = async () => {
        if (!supabase || !email || !password) return;
        setStatus("loading");
        setError("");

        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
            setStatus("idle");
            setError(signUpError.message);
            return;
        }

        setStatus("success");
    };

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        setStatus("idle");
    };

    return (
        <section id="portal" className="px-6 py-20 sm:px-10 lg:px-16">
            <div className="mx-auto w-full max-w-6xl">
                <div className="max-w-3xl" data-reveal>
                    <p className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Acceso privado</p>
                    <h2 className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">Portal Admin y Clientes</h2>
                    <p className="fade-in-section mt-4 text-slate-600">
                        Accede con tu usuario para revisar leads y preparar el area de clientes. El rol se gestiona desde Supabase.
                    </p>
                </div>

                {!isSupabaseConfigured && (
                    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
                        Supabase no esta configurado. Crea un archivo `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
                    </div>
                )}

                {isSupabaseConfigured && !session && (
                    <form
                        onSubmit={handleLogin}
                        data-reveal
                        className="fade-in-section mt-8 grid max-w-2xl grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.07)]"
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        />

                        <div className="flex flex-wrap gap-3">
                            <button type="submit" className="premium-button rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white" disabled={status === "loading"}>
                                {status === "loading" ? "Accediendo..." : "Iniciar sesion"}
                            </button>
                            <button
                                type="button"
                                onClick={handleSignUp}
                                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
                                disabled={status === "loading"}
                            >
                                Crear usuario
                            </button>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </form>
                )}

                {isSupabaseConfigured && session && (
                    <div data-reveal className="fade-in-section mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.07)]">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Sesion activa</p>
                                <p className="text-lg font-semibold text-slate-900">{session.user.email}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.08em] text-slate-500">Rol: {role}</p>
                            </div>
                            <button onClick={handleLogout} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                                Cerrar sesion
                            </button>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-xl text-slate-900">{role === "admin" ? "Leads recientes" : "Tus registros"}</h3>
                            {leads.length === 0 ? (
                                <p className="mt-3 text-sm text-slate-500">No hay datos todavia para mostrar en este rol.</p>
                            ) : (
                                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-600">
                                            <tr>
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
                                                    <td className="px-4 py-3 text-slate-800">{lead.name || "-"}</td>
                                                    <td className="px-4 py-3 text-slate-600">{lead.company || "-"}</td>
                                                    <td className="px-4 py-3 text-slate-600">{lead.contact || "-"}</td>
                                                    <td className="px-4 py-3 text-slate-600">{lead.lead_grade || "-"}</td>
                                                    <td className="px-4 py-3 text-slate-600">{lead.status || "new"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default PortalSection;
