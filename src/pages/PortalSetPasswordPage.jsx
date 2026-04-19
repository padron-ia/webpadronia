import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { resolveRole } from "../lib/portalAuth";

function PortalSetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [status, setStatus] = useState("checking");
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setStatus("no-config");
            return;
        }
        const check = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setStatus("no-session");
                return;
            }
            setUser(session.user);
            setStatus("ready");
        };
        check();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (password !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setStatus("saving");
        const { error: updateErr } = await supabase.auth.updateUser({ password });
        if (updateErr) {
            setStatus("ready");
            setError(updateErr.message);
            return;
        }
        const role = await resolveRole(user);
        navigate(role === "admin" ? "/portal/admin/dashboard" : "/portal/cliente", { replace: true });
    };

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-8">
            <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.07)] sm:p-8">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-700">
                    <img src="/assets/logo-padron-ia-clean.png" alt="Padrón IA" className="h-11 w-auto object-contain" />
                </Link>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Portal privado</p>
                <h1 className="mt-2 text-3xl text-slate-900">Crea tu contraseña</h1>
                <p className="mt-3 text-slate-600">
                    {user?.email
                        ? <>Elige una contraseña para entrar cuando quieras a <strong>{user.email}</strong>. La usarás para ver tus proyectos y entregables.</>
                        : "Elige una contraseña para entrar al portal."}
                </p>

                {status === "checking" ? (
                    <p className="mt-6 text-sm text-slate-500">Comprobando sesión…</p>
                ) : null}

                {status === "no-session" ? (
                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <p>Para establecer tu contraseña necesitas entrar primero desde el enlace que te hemos enviado por email.</p>
                        <Link to="/portal/login" className="mt-2 inline-block font-semibold text-amber-900 underline">Ir al login</Link>
                    </div>
                ) : null}

                {status === "no-config" ? (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Supabase no está configurado.
                    </div>
                ) : null}

                {(status === "ready" || status === "saving") ? (
                    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                        <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Nueva contraseña</span>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Repetir contraseña</span>
                            <input
                                type="password"
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={status === "saving"}
                            className="premium-button mt-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {status === "saving" ? "Guardando…" : "Guardar contraseña y entrar"}
                        </button>

                        {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    </form>
                ) : null}
            </div>
        </main>
    );
}

export default PortalSetPasswordPage;
