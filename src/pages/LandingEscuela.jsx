import { RefreshCcw, UserCheck, MessageSquareText } from "lucide-react";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";
import CookieBanner from "../components/CookieBanner";

const systems = [
    {
        icon: RefreshCcw,
        title: "Renovaciones que se gestionan solas",
        body: "Cuando a un alumno le toca renovar, el sistema se lo recuerda, le pone las opciones delante y registra cada paso. Tu equipo solo entra cuando hay una persona que atender, no para perseguir fechas."
    },
    {
        icon: UserCheck,
        title: "Seguimiento por alumno, sin hojas de cálculo",
        body: "Quién no ha entrado esta semana, quién no ha hecho su registro, a quién habría que escribir. El sistema lo mira cada día y te lo pone en una lista. Nadie se queda descolgado sin que lo sepas."
    },
    {
        icon: MessageSquareText,
        title: "Avisos y materiales que llegan solos",
        body: "Recordatorios de clase, grabaciones publicadas, mensajes de inicio de semana. Todo sale a su hora, por el canal de siempre, sin que nadie tenga que acordarse."
    }
];

function LandingEscuela() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum px-6 py-40 text-center sm:px-10 lg:px-16">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Escuelas y formación online</p>
                    <h1 className="mx-auto mt-5 max-w-4xl text-5xl leading-[0.95] text-ink lg:text-6xl">
                        Tus alumnos merecen tu atención. <br />
                        <span className="text-iris">Las renovaciones y los avisos, no.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-700">
                        Altas, renovaciones, recordatorios, seguimiento de quién entra y quién no… todo a mano, para cada alumno, cada semana. <strong>Eso es trabajo de máquina. Padrón IA lo automatiza y tú dedicas el tiempo a enseñar y acompañar.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button rounded-full bg-ink px-8 py-4 text-lg font-bold text-white">
                            Quiero dedicarme a mis alumnos
                        </a>
                        <p className="text-sm font-medium text-slate-500">Primero miramos tu operativa y te decimos qué automatizar primero. Sin humo.</p>
                    </div>
                </section>

                <section className="premium-gradient-rose px-6 py-20 sm:px-10 lg:px-16">
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Lo que montamos</p>
                            <h2 className="mt-4 text-3xl text-ink sm:text-4xl">Sistemas que ya funcionan en una escuela real</h2>
                            <p className="mt-4 text-slate-600">
                                No es teoría: esto está montado y funcionando cada día en una escuela online con cientos de alumnas. Sin nombres, por confidencialidad.
                            </p>
                        </div>
                        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                            {systems.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <article key={s.title} className="glow-card rounded-2xl border border-slate-200 bg-white/90 p-6">
                                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
                                            <Icon size={18} />
                                        </div>
                                        <h3 className="mt-4 text-xl text-ink">{s.title}</h3>
                                        <p className="mt-3 leading-relaxed text-slate-600">{s.body}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <ConsultForm />
            </main>
            <Footer />
            <WhatsAppFloatButton />
            <CookieBanner />
        </div>
    );
}

export default LandingEscuela;
