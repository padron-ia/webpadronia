import { Link, NavLink } from "react-router-dom";

function PortalShell({ email, role, title, subtitle, onLogout, navItems = [], children }) {
    return (
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl gap-6">
                <aside className="hidden w-64 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] lg:block">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-900">
                        <img src="/assets/logo-padron-ia-clean.png" alt="Padrón IA" className="h-10 w-auto object-contain" />
                    </Link>

                    <div className="mt-6 space-y-1">
                        {navItems.map((item, idx) =>
                            item.type === "group" ? (
                                <p
                                    key={`group-${idx}`}
                                    className={`px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 ${idx > 0 ? "mt-5 pt-4 border-t border-slate-100" : "mt-2"}`}
                                >
                                    {item.label}
                                </p>
                            ) : (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                            isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                                        }`
                                    }
                                >
                                    {item.icon ? <span className="mr-2">{item.icon}</span> : null}
                                    {item.label}
                                </NavLink>
                            )
                        )}
                    </div>

                    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                        <p className="font-semibold text-slate-900">Sesión</p>
                        <p className="mt-1 break-all">{email}</p>
                        <p className="mt-1 uppercase tracking-[0.08em]">Rol: {role}</p>
                    </div>

                    <button onClick={onLogout} className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
                        Cerrar sesión
                    </button>
                </aside>

                <section className="min-w-0 w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Padrón IA CRM</p>
                            <h1 className="mt-2 text-2xl text-slate-900 sm:text-3xl">{title}</h1>
                            {subtitle ? <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p> : null}
                        </div>
                        <button onClick={onLogout} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden">
                            Cerrar sesión
                        </button>
                    </div>

                    {navItems.length > 0 ? (
                        <nav className="mt-5 flex flex-wrap gap-2 lg:hidden">
                            {navItems
                                .filter((item) => item.type !== "group")
                                .map((item) => (
                                    <NavLink
                                        key={`mobile-${item.href}`}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
                                                isActive ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-600"
                                            }`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                        </nav>
                    ) : null}

                    <div className="mt-6">{children}</div>
                </section>
            </div>
        </main>
    );
}

export default PortalShell;
