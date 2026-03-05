import { Link } from "react-router-dom";

function PortalShell({ email, role, title, subtitle, onLogout, children }) {
    return (
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl gap-6">
                <aside className="hidden w-64 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] lg:block">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-900">
                        <img src="/assets/logo-padron-ia-clean.png" alt="Padron IA" className="h-10 w-auto object-contain" />
                    </Link>

                    <div className="mt-8 space-y-2">
                        <p className="px-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Portal</p>
                        <Link to={role === "admin" ? "/portal/admin" : "/portal/cliente"} className="block rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                            Dashboard
                        </Link>
                    </div>

                    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                        <p className="font-semibold text-slate-900">Sesion</p>
                        <p className="mt-1 break-all">{email}</p>
                        <p className="mt-1 uppercase tracking-[0.08em]">Rol: {role}</p>
                    </div>

                    <button onClick={onLogout} className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
                        Cerrar sesion
                    </button>
                </aside>

                <section className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Padron IA CRM</p>
                            <h1 className="mt-2 text-2xl text-slate-900 sm:text-3xl">{title}</h1>
                            {subtitle ? <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p> : null}
                        </div>
                        <button onClick={onLogout} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden">
                            Cerrar sesion
                        </button>
                    </div>

                    <div className="mt-6">{children}</div>
                </section>
            </div>
        </main>
    );
}

export default PortalShell;
