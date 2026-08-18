function SocialProof() {
    return (
        <section className="px-6 py-14 sm:px-10 lg:px-16 border-y border-slate-100 bg-slate-50/50">
            <div className="mx-auto w-full max-w-6xl">
                <div data-reveal className="fade-in-section flex flex-col items-center gap-8 md:flex-row md:justify-between">
                    <div className="flex items-center gap-8 flex-wrap justify-center">
                        <Stat number="8+" label="Sistemas en producción" />
                        <div className="w-px h-8 bg-slate-200 hidden md:block" />
                        <Stat number="3" label="Sectores" />
                        <div className="w-px h-8 bg-slate-200 hidden md:block" />
                        <Stat number="24/7" label="Funcionando solos" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {["🛒 Tienda online", "🎓 Escuela online", "💼 Despacho"].map((label, i) => (
                                <span key={i} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                                    {label}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-slate-600 whitespace-nowrap">
                            ya lo tienen funcionando
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Stat({ number, label }) {
    return (
        <div className="text-center">
            <p className="text-2xl font-bold text-ink">{number}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        </div>
    );
}

export default SocialProof;
