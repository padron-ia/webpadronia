import { Link, NavLink } from "react-router-dom";

export default function ClientShell({ email, companyName, onLogout, children }) {
    const navItems = [
        { label: "Mis proyectos", href: "/portal/cliente", icon: "📋" },
        { label: "Documentos", href: "/portal/cliente/documentos", icon: "📁" },
        { label: "Facturas", href: "/portal/cliente/facturas", icon: "🧾" }
    ];

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto flex w-full max-w-7xl gap-6">
                <aside className="hidden w-56 shrink-0 lg:block">
                    <div className="sticky top-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <img src="/assets/logo-padron-ia-clean.png" alt="Padrón IA" className="h-9 w-auto object-contain" />
                        </Link>

                        {companyName ? (
                            <div className="mt-5 rounded-xl bg-slate-50 px-3 py-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Tu empresa</p>
                                <p className="mt-0.5 text-sm font-semibold text-slate-900 truncate">{companyName}</p>
                            </div>
                        ) : null}

                        <nav className="mt-5 space-y-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    end={item.href === "/portal/cliente"}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                            isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                                        }`
                                    }
                                >
                                    <span>{item.icon}</span>
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="mt-6 border-t border-slate-100 pt-4">
                            <p className="break-all text-xs text-slate-500">{email}</p>
                            <button onClick={onLogout} className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-slate-400">
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </aside>

                <section className="min-w-0 flex-1">
                    {/* Mobile nav */}
                    <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
                        <Link to="/"><img src="/assets/logo-padron-ia-clean.png" alt="Padrón IA" className="h-8 w-auto" /></Link>
                        <button onClick={onLogout} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">Salir</button>
                    </div>
                    <nav className="mb-6 flex flex-wrap gap-2 lg:hidden">
                        {navItems.map((item) => (
                            <NavLink key={`m-${item.href}`} to={item.href} end={item.href === "/portal/cliente"}
                                className={({ isActive }) => `rounded-full border px-3 py-1.5 text-xs font-semibold ${isActive ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600"}`}>
                                {item.icon} {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {children}
                </section>
            </div>
        </main>
    );
}
