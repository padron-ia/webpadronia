import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { resolveRole } from "../lib/portalAuth";

function PortalLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) return;

        const checkSession = async () => {
            const {
                data: { session }
            } = await supabase.auth.getSession();

            if (!session?.user) return;
            const role = await resolveRole(session.user);
            navigate(role === "admin" ? "/portal/admin/dashboard" : "/portal/cliente", { replace: true });
        };

        checkSession();
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!supabase) return;

        setStatus("loading");
        setError("");

        const { error: loginError, data } = await supabase.auth.signInWithPassword({ email, password });

        if (loginError) {
            setStatus("idle");
            setError(loginError.message);
            return;
        }

        const role = await resolveRole(data.user);
        setStatus("success");
        navigate(role === "admin" ? "/portal/admin/dashboard" : "/portal/cliente", { replace: true });
    };

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-8">
            <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.07)] sm:p-8">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-700">
                    <img src="/assets/logo-padron-ia-clean.png" alt="Padron IA" className="h-11 w-auto object-contain" />
                </Link>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Portal interno</p>
                <h1 className="mt-2 text-3xl text-slate-900">Acceso CRM</h1>
                <p className="mt-3 text-slate-600">Inicia sesion para entrar al panel de gestion de leads y seguimiento de clientes.</p>

                {!isSupabaseConfigured && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Supabase no esta configurado. Define `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
                    </div>
                )}

                <form onSubmit={handleLogin} className="mt-6 grid gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                        required
                    />

                    <button type="submit" disabled={status === "loading" || !isSupabaseConfigured} className="premium-button mt-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                        {status === "loading" ? "Accediendo..." : "Entrar al portal"}
                    </button>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}
                </form>
            </div>
        </main>
    );
}

export default PortalLoginPage;
