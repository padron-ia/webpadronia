import { Link, NavLink } from "react-router-dom";

export default function ClientShell({ email, companyName, contactName, onLogout, children }) {
    const navItems = [
        { label: "Mis proyectos", href: "/portal/cliente", icon: "📋" },
        { label: "Documentos", href: "/portal/cliente/documentos", icon: "📁" },
        { label: "Facturas", href: "/portal/cliente/facturas", icon: "🧾" }
    ];

    const firstName = contactName?.split(" ")[0] || "";

    return (
        <main className="min-h-screen bg-cream px-4 py-6 sm:px-8 sm:py-8" style={{ backgroundColor: "#F2F0E9" }}>
            <div className="mx-auto flex w-full max-w-7xl gap-6">

                {/* SIDEBAR */}
                <aside className="hidden w-60 shrink-0 lg:block">
                    <div className="sticky top-8 space-y-4">

                        {/* Logo + empresa */}
                        <div className="rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60">
                            <Link to="/">
                                <img src="/assets/logo-padron-ia-clean.png" alt="Padrón IA" className="h-9 w-auto object-contain" />
                            </Link>
                            {companyName ? (
                                <div className="mt-4 rounded-xl px-3 py-2.5" style={{ backgroundColor: "#2E403612" }}>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "#2E4036" }}>Tu empresa</p>
                                    <p className="mt-0.5 text-sm font-semibold text-stone-900 truncate">{companyName}</p>
                                </div>
                            ) : null}
                        </div>

                        {/* Navegación */}
                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-stone-200/60">
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        to={item.href}
                                        end={item.href === "/portal/cliente"}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                                isActive
                                                    ? "text-white shadow-sm"
                                                    : "text-stone-600 hover:bg-stone-50"
                                            }`
                                        }
                                        style={({ isActive }) => isActive ? { backgroundColor: "#2E4036" } : {}}
                                    >
                                        <span className="text-base">{item.icon}</span>
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>

                        {/* Tu consultor */}
                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-stone-200/60">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">Tu consultor</p>
                            <div className="mt-2 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: "#2E4036" }}>J</div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-900">Jesús Martínez</p>
                                    <p className="text-[11px] text-stone-500">Padrón IA</p>
                                </div>
                            </div>
                            <a href="https://wa.me/34664401328" target="_blank" rel="noopener noreferrer"
                                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-400 transition">
                                💬 Contactar por WhatsApp
                            </a>
                        </div>

                        {/* Sesión */}
                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-stone-200/60">
                            <p className="text-[11px] text-stone-400 break-all">{email}</p>
                            <button onClick={onLogout} className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-500 hover:text-stone-700 hover:border-stone-400 transition">
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <section className="min-w-0 flex-1">
                    {/* Mobile header */}
                    <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
                        <Link to="/"><img src="/assets/logo-padron-ia-clean.png" alt="Padrón IA" className="h-8 w-auto" /></Link>
                        <div className="flex items-center gap-2">
                            <a href="https://wa.me/34664401328" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600">💬</a>
                            <button onClick={onLogout} className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600">Salir</button>
                        </div>
                    </div>
                    <nav className="mb-6 flex flex-wrap gap-2 lg:hidden">
                        {navItems.map((item) => (
                            <NavLink key={`m-${item.href}`} to={item.href} end={item.href === "/portal/cliente"}
                                className={({ isActive }) => `rounded-full border px-3 py-1.5 text-xs font-semibold ${isActive ? "text-white border-transparent" : "border-stone-200 bg-white text-stone-600"}`}
                                style={({ isActive }) => isActive ? { backgroundColor: "#2E4036" } : {}}>
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
