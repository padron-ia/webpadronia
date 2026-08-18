import { useState } from "react";

const navItems = [
    { label: "Inicio", href: "/#hero" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Sectores", href: "/#sectores" },
    { label: "Casos", href: "/#portfolio" },
    { label: "Portal", href: "/portal/login" },
    { label: "Contacto", href: "/#contacto" }
];

function FloatingNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <header className="fixed inset-x-0 top-5 z-50 px-4 sm:px-6">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/40 bg-[rgba(242,243,251,0.65)] px-4 py-3 shadow-[0_10px_30px_rgba(27,30,58,0.10)] backdrop-blur-xl sm:px-6">
                <a href="/" className="flex items-center gap-3" onClick={closeMenu} aria-label="Padrón IA — inicio">
                    {/* Logotipo tipográfico (identidad v0 índigo): PADRÓN·IA con ·IA en acento */}
                    <span className="text-lg font-extrabold tracking-[0.12em] text-ink">
                        PADRÓN<span className="text-iris">·IA</span>
                    </span>
                </a>

                <nav className="hidden items-center gap-7 lg:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-slate-700 transition-colors duration-300 hover:-translate-y-0.5 hover:text-ink"
                            onClick={closeMenu}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <button
                    type="button"
                    className="inline-flex rounded-full border border-slate-300 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 lg:hidden"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-controls="mobile-nav"
                >
                    Menú
                </button>

                <a
                    href="/#consultoria"
                    className="premium-button hidden rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white lg:inline-flex"
                >
                    Consultoría
                </a>
            </div>

            {isOpen && (
                <div id="mobile-nav" className="mx-auto mt-2 w-full max-w-6xl rounded-2xl border border-white/40 bg-white/95 p-4 shadow-[0_10px_30px_rgba(27,30,58,0.10)] backdrop-blur-xl lg:hidden">
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={closeMenu}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default FloatingNavbar;
