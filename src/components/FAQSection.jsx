import { useState } from "react";

const faqs = [
    {
        q: "No entiendo de tecnología. ¿Puedo usar esto?",
        a: "Si sabes usar WhatsApp, puedes usar esto. Nosotros lo montamos todo, tú solo ves los resultados. Si algo se rompe, lo arreglamos nosotros."
    },
    {
        q: "¿Cuánto tarda en funcionar?",
        a: "Depende de lo que necesites. Un problema concreto lo resolvemos en 7-10 días. Un sistema completo de captación, en 2-4 semanas. Te lo decimos en la primera llamada."
    },
    {
        q: "¿Y si no funciona?",
        a: "Medimos todo. Si algo no da resultados, ajustamos. No te vamos a cobrar por algo que no funciona. Si en 30 días no ves mejora, hablamos."
    },
    {
        q: "¿Cuánto cuesta?",
        a: "Cada negocio es distinto. No es lo mismo montar un chatbot para un gym que automatizar la gestión de 200 clientes. Cuéntanos qué necesitas y te damos un número concreto."
    },
    {
        q: "Ya uso [software X]. ¿Se integra?",
        a: "Trabajamos con lo que ya tengas: Timp, Harbiz, tu CRM, tu web, tu WhatsApp Business. No tiramos lo que funciona, lo conectamos."
    },
    {
        q: "¿Vais a reemplazar a mi equipo?",
        a: "No. Vamos a liberar a tu equipo del trabajo que no requiere cerebro para que hagan lo que sí lo requiere: vender, atender, fidelizar."
    },
    {
        q: "¿Qué pasa con los datos de mis clientes?",
        a: "Tus datos son tuyos. Cumplimos RGPD, usamos servidores en Europa y no compartimos nada con terceros. Si dejas de trabajar con nosotros, te llevas todo."
    },
    {
        q: "Soy autónomo y no tengo equipo. ¿Me sirve?",
        a: "Especialmente. Si estás solo, cada minuto cuenta más. La IA hace el trabajo de ese empleado que no puedes permitirte contratar."
    }
];

function FAQSection() {
    const [open, setOpen] = useState(null);

    return (
        <section id="faq" className="px-6 py-20 sm:px-10 lg:px-16 bg-white">
            <div className="mx-auto w-full max-w-3xl">
                <div className="text-center">
                    <p data-reveal className="fade-in-section text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        Preguntas frecuentes
                    </p>
                    <h2 data-reveal className="fade-in-section mt-4 text-3xl text-slate-900 sm:text-4xl">
                        Lo que nos preguntan siempre
                    </h2>
                </div>

                <div className="mt-10 space-y-2">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            data-reveal
                            className="fade-in-section rounded-2xl border border-slate-200 bg-white overflow-hidden"
                        >
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                            >
                                <span className="text-base font-semibold text-slate-900">{faq.q}</span>
                                <span className={`shrink-0 text-xl text-slate-400 transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
                            </button>
                            {open === i ? (
                                <div className="px-6 pb-5">
                                    <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQSection;
