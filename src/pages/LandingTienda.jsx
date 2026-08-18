import { PackageSearch, BellRing, ClipboardCheck } from "lucide-react";
import ConsultForm from "../components/ConsultForm";
import Footer from "../components/Footer";
import FloatingNavbar from "../components/FloatingNavbar";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";
import CookieBanner from "../components/CookieBanner";

const systems = [
    {
        icon: PackageSearch,
        title: "El inventario se cuadra solo, cada noche",
        body: "Un sistema cuenta lo que hay, lo compara con lo que dice tu web y detecta descuadres antes de que abras. Se acabó sentarse a cuadrar stock a mano cada semana."
    },
    {
        icon: BellRing,
        title: "Avisos al móvil de lo que importa",
        body: "Verde si todo va bien, rojo si hay que mirar algo: stock que no encaja, pedidos parados, productos a punto de agotarse. Te enteras sin ir a buscar."
    },
    {
        icon: ClipboardCheck,
        title: "Pedidos que no se atascan",
        body: "Del pedido al envío sin pasos a mano: preparación priorizada, incidencias detectadas a tiempo y el equipo del almacén trabajando con listas claras, no con memoria."
    }
];

function LandingTienda() {
    return (
        <div className="min-h-screen bg-white">
            <FloatingNavbar />
            <main>
                <section className="premium-gradient-plum px-6 py-40 text-center sm:px-10 lg:px-16">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Tiendas online / Ecommerce</p>
                    <h1 className="mx-auto mt-5 max-w-4xl text-5xl leading-[0.95] text-ink lg:text-6xl">
                        Tu tienda vende sola. <br />
                        <span className="text-iris">¿Por qué el inventario lo cuadras tú a mano?</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-700">
                        Cientos de pedidos al mes y alguien de tu equipo contando botes, cuadrando hojas de cálculo y persiguiendo descuadres. <strong>Eso es trabajo de máquina. Padrón IA lo automatiza y tu gente vuelve a hacer trabajo de persona.</strong>
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <a href="#consultoria" className="premium-button rounded-full bg-ink px-8 py-4 text-lg font-bold text-white">
                            Quiero dejar de cuadrar a mano
                        </a>
                        <p className="text-sm font-medium text-slate-500">Primero miramos tu operativa y te decimos qué automatizar primero. Sin humo.</p>
                    </div>
                </section>

                <section className="premium-gradient-rose px-6 py-20 sm:px-10 lg:px-16">
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Lo que montamos</p>
                            <h2 className="mt-4 text-3xl text-ink sm:text-4xl">Sistemas que ya funcionan en una tienda real</h2>
                            <p className="mt-4 text-slate-600">
                                No es teoría: esto está montado y funcionando cada noche en una tienda online con cientos de pedidos al mes. Sin nombres, por confidencialidad.
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

export default LandingTienda;
