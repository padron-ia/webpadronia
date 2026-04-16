import { useState, useEffect } from "react";

function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) setVisible(true);
    }, []);

    const accept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem("cookie_consent", "declined");
        setVisible(false);
        // Disable analytics if declined
        window["ga-disable-GA_MEASUREMENT_ID"] = true;
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_-8px_30px_rgba(15,23,42,0.1)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">Esta web usa cookies</p>
                        <p className="mt-1 text-xs text-slate-600">
                            Usamos cookies técnicas (necesarias) y analíticas (Google Analytics, Facebook Pixel) para mejorar tu experiencia.{" "}
                            <a href="/cookies" className="underline text-slate-900">Más info</a>
                        </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={decline} className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                            Solo necesarias
                        </button>
                        <button onClick={accept} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition">
                            Aceptar todo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CookieBanner;
