import { useMemo, useState } from "react";
import { buildWhatsAppUrl } from "../lib/contact";
import { submitLead } from "../lib/leadService";
import { trackLeadEvent } from "../lib/analytics";

const initialState = {
    nombre: "",
    empresa: "",
    contacto: "",
    sector: "",
    objetivo: "",
    urgencia: "",
    presupuesto: "",
    volumen: "",
    decisor: "",
    mensaje: ""
};

const scoreLead = (data) => {
    let points = 0;

    if (data.urgencia === "esta_semana") points += 3;
    else if (data.urgencia === "este_mes") points += 2;
    else if (data.urgencia === "uno_tres_meses") points += 1;

    if (data.presupuesto === "mas_3000") points += 3;
    else if (data.presupuesto === "1500_3000") points += 2;
    else if (data.presupuesto === "500_1500") points += 1;

    if (data.decisor === "si") points += 2;
    if (data.volumen === "mas_50") points += 2;
    else if (data.volumen === "20_50") points += 1;
    if (data.mensaje.trim().length > 30) points += 1;

    if (points >= 7) return { points, grade: "A" };
    if (points >= 4) return { points, grade: "B" };
    return { points, grade: "C" };
};

const createWhatsAppMessage = (data, score) => {
    const lines = [
        "Hola, quiero solicitar una consultoría con Padrón IA.",
        `Nombre: ${data.nombre || "-"}`,
        `Empresa: ${data.empresa || "-"}`,
        `Contacto: ${data.contacto || "-"}`,
        `Sector: ${data.sector || "-"}`,
        `Objetivo: ${data.objetivo || "-"}`,
        `Urgencia: ${data.urgencia || "-"}`,
        `Presupuesto: ${data.presupuesto || "-"}`,
        `Consultas mensuales: ${data.volumen || "-"}`,
        `Decisión: ${data.decisor || "-"}`,
        `Necesidad: ${data.mensaje || "-"}`,
        `Prioridad estimada: ${score.grade} (${score.points})`
    ];
    return lines.join("\n");
};

function ConsultForm() {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle");
    const [submitMessage, setSubmitMessage] = useState("");
    const [leadScore, setLeadScore] = useState(null);
    const [step, setStep] = useState(1);

    const computedScore = useMemo(() => scoreLead(formData), [formData]);
    const whatsappUrl = useMemo(() => buildWhatsAppUrl(createWhatsAppMessage(formData, computedScore)), [formData, computedScore]);

    const validateStep1 = () => {
        const next = {};
        if (!formData.nombre.trim()) next.nombre = "Indica tu nombre.";
        if (!formData.empresa.trim()) next.empresa = "Indica tu empresa.";
        if (!formData.contacto.trim()) next.contacto = "Indica tu email o WhatsApp.";
        if (!formData.sector) next.sector = "Selecciona tu sector.";
        if (!formData.mensaje.trim()) next.mensaje = "Describe tu necesidad principal.";
        return next;
    };

    const validateStep2 = () => {
        const next = {};
        if (!formData.objetivo) next.objetivo = "Selecciona tu objetivo principal.";
        if (!formData.urgencia) next.urgencia = "Indica tu urgencia.";
        if (!formData.presupuesto) next.presupuesto = "Selecciona una opción.";
        if (!formData.decisor) next.decisor = "Indica quién toma la decisión.";
        return next;
    };

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const goToStep2 = () => {
        const validation = validateStep1();
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        setErrors({});
        setStep(2);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const hiddenField = event.currentTarget.website?.value;
        if (hiddenField) return;

        const validation = validateStep2();
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        const score = scoreLead(formData);
        setLeadScore(score);
        setStatus("loading");
        setSubmitMessage("");

        try {
            const result = await submitLead({ ...formData, leadScore: score.points, leadGrade: score.grade });
            trackLeadEvent("lead_form_submit", { channel: "form", lead_grade: score.grade });

            if (result.storage === "supabase") {
                setStatus("success");
                setSubmitMessage("Solicitud recibida. Te contactamos en breve.");
            } else {
                setStatus("warning");
                setSubmitMessage("Guardado en modo local. Revisa la conexión con Supabase para no perder leads.");
            }

            setFormData(initialState);
            setErrors({});
            setStep(1);
        } catch (error) {
            if (error?.fallbackSaved) {
                setStatus("warning");
                setSubmitMessage("No se pudo guardar en Supabase. Se guardó en local como respaldo.");
            } else {
                setStatus("error");
                setSubmitMessage(error?.message || "No pudimos enviar el formulario.");
            }
        }
    };

    const inputClass = "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500";
    const selectClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500";

    return (
        <section id="consultoria" className="px-6 py-20 sm:px-10 lg:px-16">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                <div data-reveal className="fade-in-section">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Da el primer paso</p>
                    <h2 className="mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">Cuéntanos dónde se te están escapando ventas y te diremos cómo corregirlo</h2>
                    <p className="mt-5 max-w-xl text-slate-600">
                        Con estos datos preparamos una propuesta específica para tu negocio. Sin plantillas genéricas. Si prefieres ir al grano, escríbenos por WhatsApp.
                    </p>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackLeadEvent("lead_whatsapp_click", { placement: "consultoria" })}
                        className="premium-button mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
                    >
                        Consultar por WhatsApp
                    </a>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">¿Cómo funciona?</p>
                        <p className="mt-2">Priorizamos empresas con necesidad clara y capacidad de implementación. Si tu caso encaja, te respondemos en menos de 24 horas.</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="fade-in-section rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.07)] sm:p-8" data-reveal>
                    <div className="mb-6 flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${step >= 1 ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-500"}`}>1</div>
                        <div className={`h-px flex-1 transition ${step >= 2 ? "bg-slate-900" : "bg-slate-200"}`} />
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${step >= 2 ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-500"}`}>2</div>
                    </div>

                    {step === 1 && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <input type="text" name="nombre" value={formData.nombre} onChange={onChange} placeholder="Nombre y apellido" className={inputClass} />
                                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                            </div>
                            <div>
                                <input type="text" name="empresa" value={formData.empresa} onChange={onChange} placeholder="Empresa" className={inputClass} />
                                {errors.empresa && <p className="mt-1 text-sm text-red-600">{errors.empresa}</p>}
                            </div>
                            <div>
                                <input type="text" name="contacto" value={formData.contacto} onChange={onChange} placeholder="Email o WhatsApp" className={inputClass} />
                                {errors.contacto && <p className="mt-1 text-sm text-red-600">{errors.contacto}</p>}
                            </div>
                            <div>
                                <select name="sector" value={formData.sector} onChange={onChange} className={selectClass}>
                                    <option value="">Sector</option>
                                    <option value="servicios_b2b">Servicios a empresas</option>
                                    <option value="clinica_estetica">Clínicas y estética</option>
                                    <option value="inmobiliaria">Inmobiliaria</option>
                                    <option value="ecommerce">Tienda online</option>
                                    <option value="educacion">Formación y cursos</option>
                                    <option value="operaciones">Soporte y operaciones</option>
                                    <option value="otro">Otro</option>
                                </select>
                                {errors.sector && <p className="mt-1 text-sm text-red-600">{errors.sector}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <textarea name="mensaje" value={formData.mensaje} onChange={onChange} rows={4} placeholder="¿Qué proceso te está costando más tiempo o dinero hoy?" className={inputClass} />
                                {errors.mensaje && <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <button type="button" onClick={goToStep2} className="premium-button mt-2 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <p className="md:col-span-2 text-sm text-slate-600">Estos datos nos ayudan a preparar una respuesta útil para ti.</p>
                            <div>
                                <select name="objetivo" value={formData.objetivo} onChange={onChange} className={selectClass}>
                                    <option value="">¿Qué necesitas mejorar?</option>
                                    <option value="captar_mas_leads">Captar más oportunidades</option>
                                    <option value="cerrar_mas_ventas">Cerrar más ventas</option>
                                    <option value="mejorar_soporte">Mejorar la atención al cliente</option>
                                    <option value="optimizar_operaciones">Organizar mejor mi operación</option>
                                </select>
                                {errors.objetivo && <p className="mt-1 text-sm text-red-600">{errors.objetivo}</p>}
                            </div>
                            <div>
                                <select name="urgencia" value={formData.urgencia} onChange={onChange} className={selectClass}>
                                    <option value="">¿Cuándo quieres empezar?</option>
                                    <option value="esta_semana">Esta semana</option>
                                    <option value="este_mes">Este mes</option>
                                    <option value="uno_tres_meses">En 1-3 meses</option>
                                    <option value="explorando">Solo estoy mirando</option>
                                </select>
                                {errors.urgencia && <p className="mt-1 text-sm text-red-600">{errors.urgencia}</p>}
                            </div>
                            <div>
                                <select name="presupuesto" value={formData.presupuesto} onChange={onChange} className={selectClass}>
                                    <option value="">¿Tienes presupuesto asignado?</option>
                                    <option value="menos_500">Menos de 500 €</option>
                                    <option value="500_1500">500 – 1.500 €</option>
                                    <option value="1500_3000">1.500 – 3.000 €</option>
                                    <option value="mas_3000">Más de 3.000 €</option>
                                    <option value="no_seguro">Aún no lo tengo claro</option>
                                </select>
                                {errors.presupuesto && <p className="mt-1 text-sm text-red-600">{errors.presupuesto}</p>}
                            </div>
                            <div>
                                <select name="volumen" value={formData.volumen} onChange={onChange} className={selectClass}>
                                    <option value="">¿Cuántas consultas recibes al mes?</option>
                                    <option value="menos_20">Menos de 20</option>
                                    <option value="20_50">Entre 20 y 50</option>
                                    <option value="mas_50">Más de 50</option>
                                    <option value="no_aplica">No lo sé</option>
                                </select>
                            </div>
                            <div>
                                <select name="decisor" value={formData.decisor} onChange={onChange} className={selectClass}>
                                    <option value="">¿Quién toma la decisión?</option>
                                    <option value="si">Yo decido</option>
                                    <option value="con_equipo">Lo decido con mi equipo</option>
                                    <option value="no">No soy quien decide</option>
                                </select>
                                {errors.decisor && <p className="mt-1 text-sm text-red-600">{errors.decisor}</p>}
                            </div>

                            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

                            <div className="flex gap-3 md:col-span-2">
                                <button type="button" onClick={() => setStep(1)} className="mt-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700">
                                    ← Volver
                                </button>
                                <button type="submit" disabled={status === "loading"} className="premium-button mt-2 flex-1 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
                                    {status === "loading" ? "Enviando..." : "Enviar solicitud"}
                                </button>
                            </div>

                            {status === "success" && (
                                <p className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {submitMessage || "Solicitud recibida."}
                                    {leadScore?.grade === "A" ? " Priorizamos tu caso para responder rápido." : " Te escribimos con los siguientes pasos según prioridad."}
                                </p>
                            )}

                            {status === "warning" && (
                                <p className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                    {submitMessage || "Guardado en modo local. Revisa la configuración de Supabase."}
                                </p>
                            )}

                            {status === "error" && (
                                <p className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                    {submitMessage || "No pudimos enviar el formulario. Usa WhatsApp para contacto inmediato."}
                                </p>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}

export default ConsultForm;
