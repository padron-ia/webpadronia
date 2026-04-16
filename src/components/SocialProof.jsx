function SocialProof() {
    return (
        <section className="px-6 py-14 sm:px-10 lg:px-16 border-y border-slate-100 bg-slate-50/50">
            <div className="mx-auto w-full max-w-6xl">
                <div data-reveal className="fade-in-section flex flex-col items-center gap-8 md:flex-row md:justify-between">
                    <div className="flex items-center gap-8 flex-wrap justify-center">
                        <Stat number="8+" label="Proyectos activos" />
                        <div className="w-px h-8 bg-slate-200 hidden md:block" />
                        <Stat number="3" label="Sectores" />
                        <div className="w-px h-8 bg-slate-200 hidden md:block" />
                        <Stat number="2026" label="Desde" />
                        <div className="w-px h-8 bg-slate-200 hidden md:block" />
                        <Stat number="100%" label="Clientes repiten" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {["EC", "AD", "LM"].map((initials, i) => (
                                <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[10px] font-bold text-white">
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-600">
                            Clientes que ya trabajan con nosotros
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
            <p className="text-2xl font-bold text-slate-900">{number}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        </div>
    );
}

export default SocialProof;
