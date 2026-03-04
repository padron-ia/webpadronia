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
        "Hola, quiero solicitar una consultoria con Padron IA.",
        `Nombre: ${data.nombre || "-"}`,
        `Empresa: ${data.empresa || "-"}`,
        `Contacto: ${data.contacto || "-"}`,
        `Sector: ${data.sector || "-"}`,
        `Objetivo: ${data.objetivo || "-"}`,
        `Urgencia: ${data.urgencia || "-"}`,
        `Presupuesto: ${data.presupuesto || "-"}`,
        `Volumen de leads: ${data.volumen || "-"}`,
        `Decision: ${data.decisor || "-"}`,
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

    const computedScore = useMemo(() => scoreLead(formData), [formData]);
    const whatsappUrl = useMemo(() => buildWhatsAppUrl(createWhatsAppMessage(formData, computedScore)), [formData, computedScore]);

    const validate = () => {
        const next = {};
        if (!formData.nombre.trim()) next.nombre = "Indica tu nombre.";
        if (!formData.empresa.trim()) next.empresa = "Indica tu empresa.";
        if (!formData.contacto.trim()) next.contacto = "Indica tu email o WhatsApp.";
        if (!formData.sector) next.sector = "Selecciona tu sector.";
        if (!formData.objetivo) next.objetivo = "Selecciona tu objetivo principal.";
        if (!formData.urgencia) next.urgencia = "Indica tu urgencia.";
        if (!formData.presupuesto) next.presupuesto = "Selecciona un rango de inversion.";
        if (!formData.decisor) next.decisor = "Indica si participas en la decision.";
        if (!formData.mensaje.trim()) next.mensaje = "Describe tu necesidad principal.";
        return next;
    };

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const hiddenField = event.currentTarget.website?.value;
        if (hiddenField) return;

        const validation = validate();
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
                setSubmitMessage("Solicitud recibida en CRM. Te contactamos en breve.");
            } else {
                setStatus("warning");
                setSubmitMessage("Guardado en modo local. Revisa la conexion con Supabase para no perder leads.");
            }

            setFormData(initialState);
            setErrors({});
        } catch (error) {
            if (error?.fallbackSaved) {
                setStatus("warning");
                setSubmitMessage("No se pudo guardar en Supabase. Se guardo en local como respaldo.");
            } else {
                setStatus("error");
                setSubmitMessage(error?.message || "No pudimos enviar el formulario.");
            }
        }
    };

    return (
        <section id="consultoria" className="px-6 py-20 sm:px-10 lg:px-16">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                <div data-reveal className="fade-in-section">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Consultoria inicial</p>
                    <h2 className="mt-4 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">Cuéntanos tu contexto y priorizamos tu solicitud</h2>
                    <p className="mt-5 max-w-xl text-slate-600">
                        Te pedimos algunos datos de negocio para darte una respuesta util y evitar propuestas genericas. Si prefieres, puedes ir directo por WhatsApp.
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
                        <p className="font-semibold text-slate-900">Como priorizamos respuestas</p>
                        <p className="mt-2">Priorizamos implementaciones con urgencia clara, presupuesto definido y capacidad de decision.</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="fade-in-section rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.07)] sm:p-8" data-reveal>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={onChange}
                                placeholder="Nombre y apellido"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            />
                            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="empresa"
                                value={formData.empresa}
                                onChange={onChange}
                                placeholder="Empresa"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            />
                            {errors.empresa && <p className="mt-1 text-sm text-red-600">{errors.empresa}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="contacto"
                                value={formData.contacto}
                                onChange={onChange}
                                placeholder="Email o WhatsApp"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            />
                            {errors.contacto && <p className="mt-1 text-sm text-red-600">{errors.contacto}</p>}
                        </div>

                        <div>
                            <select
                                name="sector"
                                value={formData.sector}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            >
                                <option value="">Sector</option>
                                <option value="servicios_b2b">Servicios B2B</option>
                                <option value="clinica_estetica">Clinicas y estetica</option>
                                <option value="inmobiliaria">Inmobiliaria</option>
                                <option value="ecommerce">Ecommerce</option>
                                <option value="educacion">Infoproducto y educacion</option>
                                <option value="operaciones">Soporte y operaciones</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errors.sector && <p className="mt-1 text-sm text-red-600">{errors.sector}</p>}
                        </div>

                        <div>
                            <select
                                name="objetivo"
                                value={formData.objetivo}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            >
                                <option value="">Objetivo principal</option>
                                <option value="captar_mas_leads">Captar mas leads</option>
                                <option value="cerrar_mas_ventas">Cerrar mas ventas</option>
                                <option value="mejorar_soporte">Mejorar soporte</option>
                                <option value="optimizar_operaciones">Optimizar operaciones</option>
                            </select>
                            {errors.objetivo && <p className="mt-1 text-sm text-red-600">{errors.objetivo}</p>}
                        </div>

                        <div>
                            <select
                                name="urgencia"
                                value={formData.urgencia}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            >
                                <option value="">Urgencia</option>
                                <option value="esta_semana">Esta semana</option>
                                <option value="este_mes">Este mes</option>
                                <option value="uno_tres_meses">1-3 meses</option>
                                <option value="explorando">Solo explorando</option>
                            </select>
                            {errors.urgencia && <p className="mt-1 text-sm text-red-600">{errors.urgencia}</p>}
                        </div>

                        <div>
                            <select
                                name="presupuesto"
                                value={formData.presupuesto}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            >
                                <option value="">Inversion mensual estimada</option>
                                <option value="menos_500">Menos de 500 EUR</option>
                                <option value="500_1500">500-1.500 EUR</option>
                                <option value="1500_3000">1.500-3.000 EUR</option>
                                <option value="mas_3000">Mas de 3.000 EUR</option>
                                <option value="no_seguro">No estoy seguro</option>
                            </select>
                            {errors.presupuesto && <p className="mt-1 text-sm text-red-600">{errors.presupuesto}</p>}
                        </div>

                        <div>
                            <select
                                name="volumen"
                                value={formData.volumen}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            >
                                <option value="">Volumen de leads mensual</option>
                                <option value="menos_20">Menos de 20</option>
                                <option value="20_50">20-50</option>
                                <option value="mas_50">Mas de 50</option>
                                <option value="no_aplica">No aplica</option>
                            </select>
                        </div>

                        <div>
                            <select
                                name="decisor"
                                value={formData.decisor}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            >
                                <option value="">Decision</option>
                                <option value="si">Soy quien decide</option>
                                <option value="con_equipo">Lo reviso con mi equipo</option>
                                <option value="no">No soy decisor final</option>
                            </select>
                            {errors.decisor && <p className="mt-1 text-sm text-red-600">{errors.decisor}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <textarea
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={onChange}
                                rows={4}
                                placeholder="¿Que proceso te esta costando mas tiempo o dinero hoy?"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                            />
                            {errors.mensaje && <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>}
                        </div>

                        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="premium-button mt-2 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                {status === "loading" ? "Enviando..." : "Enviar solicitud"}
                            </button>
                        </div>

                        {status === "success" && (
                            <p className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {submitMessage || "Solicitud recibida."}
                                {leadScore?.grade === "A" ? " Priorizamos tu caso para respuesta rapida." : " Te respondemos con siguientes pasos segun prioridad."}
                            </p>
                        )}

                        {status === "warning" && (
                            <p className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                {submitMessage || "Guardado en modo local. Revisa la configuracion de Supabase."}
                            </p>
                        )}

                        {status === "error" && (
                            <p className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                {submitMessage || "No pudimos enviar el formulario. Usa WhatsApp para contacto inmediato."}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ConsultForm;
