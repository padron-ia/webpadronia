import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PortalShell from "../components/portal/PortalShell";
import { resolveRole } from "../lib/portalAuth";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import {
    getDashboard,
    listProjects,
    listTasks,
    createTask,
    changeStatus,
    updateTask,
    deleteTask
} from "../lib/centroPersonalService";

const navItems = [
    { type: "group", label: "Personal" },
    { label: "Centro de Mando", href: "/centro", icon: "🧭" },
    { type: "group", label: "Negocio" },
    { label: "CRM (clientes)", href: "/portal/admin/dashboard", icon: "🏢" }
];

const PRIORIDADES = [
    { value: "urgente", label: "Urgente" },
    { value: "alta", label: "Alta" },
    { value: "normal", label: "Normal" },
    { value: "baja", label: "Baja" }
];

const PRIO_STYLE = {
    urgente: "bg-red-100 text-red-700 border-red-200",
    alta: "bg-amber-100 text-amber-700 border-amber-200",
    normal: "bg-slate-100 text-slate-600 border-slate-200",
    baja: "bg-slate-50 text-slate-400 border-slate-200"
};

// Acciones (transiciones) disponibles por estado — reflejan la matriz del backend
const ACCIONES = {
    idea: [
        { estado: "por_hacer", label: "Aceptar", primary: true },
        { estado: "descartada", label: "Descartar" }
    ],
    por_hacer: [
        { estado: "en_curso", label: "▶ Empezar", primary: true },
        { estado: "hecho", label: "✓ Hecho" },
        { estado: "aparcada", label: "Aparcar" }
    ],
    en_curso: [
        { estado: "hecho", label: "✓ Hecho", primary: true },
        { estado: "aparcada", label: "Aparcar" },
        { estado: "por_hacer", label: "Pausar" }
    ],
    aparcada: [
        { estado: "por_hacer", label: "Reactivar", primary: true },
        { estado: "descartada", label: "Descartar" }
    ],
    hecho: [{ estado: "en_curso", label: "Reabrir" }],
    descartada: [{ estado: "por_hacer", label: "Recuperar" }]
};

const hoyISO = () => new Date().toISOString().slice(0, 10);

const fmtFecha = (value) => {
    if (!value) return null;
    const d = new Date(value + "T00:00:00");
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

const diasHasta = (value) => {
    if (!value) return null;
    const hoy = new Date(hoyISO() + "T00:00:00");
    const f = new Date(value + "T00:00:00");
    return Math.round((f - hoy) / (1000 * 60 * 60 * 24));
};

function TaskCard({ tarea, proyectos, onAccion, onGuardar, onBorrar, mostrarProyecto = true }) {
    const [editando, setEditando] = useState(false);
    const [fecha, setFecha] = useState(tarea.fecha_limite || "");
    const [prioridad, setPrioridad] = useState(tarea.prioridad);
    const [proyectoId, setProyectoId] = useState(tarea.proyecto_id || "");
    const [abierto, setAbierto] = useState(false);

    const dias = diasHasta(tarea.fecha_limite);
    const acciones = ACCIONES[tarea.estado] || [];

    const guardar = async () => {
        await onGuardar(tarea.id, {
            fecha_limite: fecha || "",
            prioridad,
            proyecto_id: proyectoId || ""
        });
        setEditando(false);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${PRIO_STYLE[tarea.prioridad]}`}>
                            {tarea.prioridad}
                        </span>
                        {mostrarProyecto && tarea.proyecto_nombre ? (
                            <span className="shrink-0 text-xs text-slate-500">
                                {tarea.proyecto_emoji} {tarea.proyecto_nombre}
                            </span>
                        ) : null}
                        {tarea.fecha_limite ? (
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tarea.vencida ? "bg-red-50 text-red-600" : dias === 0 ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}>
                                {tarea.vencida ? `hace ${Math.abs(dias)}d` : dias === 0 ? "hoy" : `${fmtFecha(tarea.fecha_limite)} · ${dias}d`}
                            </span>
                        ) : null}
                    </div>

                    <button onClick={() => setAbierto((v) => !v)} className="mt-1.5 block text-left">
                        <p className="text-sm font-semibold text-slate-900">{tarea.titulo}</p>
                    </button>
                    {abierto && tarea.descripcion ? (
                        <p className="mt-1 whitespace-pre-wrap text-xs text-slate-500">{tarea.descripcion}</p>
                    ) : null}
                </div>
            </div>

            {editando ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs" />
                    <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs">
                        {PRIORIDADES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                    <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs">
                        <option value="">Sin proyecto</option>
                        {proyectos.map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.nombre}</option>)}
                    </select>
                    <button onClick={guardar} className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Guardar</button>
                    <button onClick={() => setEditando(false)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-500">Cancelar</button>
                </div>
            ) : (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                    {acciones.map((a) => (
                        <button
                            key={a.estado}
                            onClick={() => onAccion(tarea.id, a.estado)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${a.primary ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                        >
                            {a.label}
                        </button>
                    ))}
                    <button onClick={() => setEditando(true)} className="ml-auto rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-400 hover:text-slate-700">Editar</button>
                    <button onClick={() => onBorrar(tarea.id)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-300 hover:text-red-600">Borrar</button>
                </div>
            )}
        </div>
    );
}

function CentroPersonalPage() {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [role, setRole] = useState(null);
    const [booting, setBooting] = useState(true);

    const [dash, setDash] = useState(null);
    const [proyectos, setProyectos] = useState([]);
    const [vista, setVista] = useState("hoy"); // hoy | proyectos | ideas
    const [proyectoSel, setProyectoSel] = useState(null);
    const [tareasProyecto, setTareasProyecto] = useState([]);
    const [verCerradas, setVerCerradas] = useState(false);
    const [error, setError] = useState("");

    // Quick add
    const [nuevoTitulo, setNuevoTitulo] = useState("");
    const [nuevoProyecto, setNuevoProyecto] = useState("");
    const [nuevaPrioridad, setNuevaPrioridad] = useState("normal");
    const [nuevaFecha, setNuevaFecha] = useState("");
    const [comoIdea, setComoIdea] = useState(false);
    const [guardandoNuevo, setGuardandoNuevo] = useState(false);

    // ── Auth boot ───────────────────────────────────────────────
    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setBooting(false);
            return;
        }
        const boot = async () => {
            const { data: { session: s } } = await supabase.auth.getSession();
            setSession(s);
            if (s?.user) setRole(await resolveRole(s.user));
            setBooting(false);
        };
        boot();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
            setSession(s);
            if (s?.user) resolveRole(s.user).then(setRole);
            else setRole(null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // ── Cargar dashboard + proyectos ────────────────────────────
    const recargarDash = async () => {
        try {
            const [d, p] = await Promise.all([getDashboard(), listProjects()]);
            setDash(d);
            setProyectos(p || []);
        } catch (e) {
            setError(e.message || "No se pudo cargar el centro.");
        }
    };

    useEffect(() => {
        if (role === "admin") recargarDash();
    }, [role]);

    // ── Cargar tareas del proyecto seleccionado ─────────────────
    const recargarProyecto = async (pid, cerradas = verCerradas) => {
        if (!pid) return;
        try {
            const t = await listTasks({ proyecto: pid, incluirCerradas: cerradas });
            setTareasProyecto(t || []);
        } catch (e) {
            setError(e.message || "No se pudieron cargar las tareas.");
        }
    };

    useEffect(() => {
        if (proyectoSel) recargarProyecto(proyectoSel, verCerradas);
    }, [proyectoSel, verCerradas]);

    // ── Acciones ────────────────────────────────────────────────
    const refrescar = async () => {
        await recargarDash();
        if (proyectoSel) await recargarProyecto(proyectoSel, verCerradas);
    };

    const onAccion = async (id, estado) => {
        setError("");
        try { await changeStatus(id, estado); await refrescar(); }
        catch (e) { setError(e.message || "No se pudo cambiar el estado."); }
    };

    const onGuardar = async (id, patch) => {
        setError("");
        try { await updateTask(id, patch); await refrescar(); }
        catch (e) { setError(e.message || "No se pudo guardar."); }
    };

    const onBorrar = async (id) => {
        setError("");
        try { await deleteTask(id); await refrescar(); }
        catch (e) { setError(e.message || "No se pudo borrar."); }
    };

    const onCrear = async (e) => {
        e.preventDefault();
        if (!nuevoTitulo.trim()) return;
        setGuardandoNuevo(true);
        setError("");
        try {
            await createTask({
                titulo: nuevoTitulo,
                proyectoId: nuevoProyecto || null,
                prioridad: nuevaPrioridad,
                fechaLimite: nuevaFecha || null,
                estado: comoIdea ? "idea" : "por_hacer"
            });
            setNuevoTitulo("");
            setNuevaFecha("");
            await refrescar();
        } catch (e2) {
            setError(e2.message || "No se pudo crear la tarea.");
        } finally {
            setGuardandoNuevo(false);
        }
    };

    const handleLogout = async () => {
        if (supabase) await supabase.auth.signOut();
        navigate("/portal/login", { replace: true });
    };

    const hoy = useMemo(() => dash?.hoy || [], [dash]);
    const vencidas = useMemo(() => hoy.filter((t) => t.vencida), [hoy]);
    const paraHoy = useMemo(() => hoy.filter((t) => !t.vencida), [hoy]);
    const proximas = useMemo(() => dash?.proximas || [], [dash]);

    const [ideasList, setIdeasList] = useState([]);
    useEffect(() => {
        if (vista === "ideas" && role === "admin") {
            listTasks({ estado: "idea" }).then((t) => setIdeasList(t || [])).catch(() => {});
        }
    }, [vista, role, dash]);

    // ── Render gates ────────────────────────────────────────────
    if (booting) {
        return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">Cargando…</div>;
    }
    if (!session?.user || role !== "admin") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 text-slate-600">
                <p>Zona privada del operador.</p>
                <button onClick={() => navigate("/portal/login")} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Iniciar sesión</button>
            </div>
        );
    }

    const quickAdd = (
        <form onSubmit={onCrear} className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
                <input
                    value={nuevoTitulo}
                    onChange={(e) => setNuevoTitulo(e.target.value)}
                    placeholder="Nueva tarea o idea…"
                    className="min-w-[220px] flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
                <select value={nuevoProyecto} onChange={(e) => setNuevoProyecto(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                    <option value="">Sin proyecto</option>
                    {proyectos.map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.nombre}</option>)}
                </select>
                <select value={nuevaPrioridad} onChange={(e) => setNuevaPrioridad(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                    {PRIORIDADES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700" />
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <input type="checkbox" checked={comoIdea} onChange={(e) => setComoIdea(e.target.checked)} /> Idea
                </label>
                <button type="submit" disabled={guardandoNuevo || !nuevoTitulo.trim()} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
                    {guardandoNuevo ? "…" : "Añadir"}
                </button>
            </div>
        </form>
    );

    const tabs = (
        <div className="mb-6 flex flex-wrap gap-2">
            {[
                { id: "hoy", label: `Hoy${dash?.vencidas_total ? ` · ${dash.vencidas_total} vencidas` : ""}` },
                { id: "proyectos", label: "Proyectos" },
                { id: "ideas", label: `Ideas${dash?.ideas ? ` · ${dash.ideas}` : ""}` }
            ].map((t) => (
                <button
                    key={t.id}
                    onClick={() => { setVista(t.id); setProyectoSel(null); }}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${vista === t.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-600"}`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );

    const listaTareas = (arr, mostrarProyecto = true) =>
        arr.length ? (
            <div className="grid gap-2">
                {arr.map((t) => (
                    <TaskCard key={t.id} tarea={t} proyectos={proyectos} mostrarProyecto={mostrarProyecto}
                        onAccion={onAccion} onGuardar={onGuardar} onBorrar={onBorrar} />
                ))}
            </div>
        ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">Nada por aquí.</p>
        );

    return (
        <PortalShell
            email={session.user.email}
            role={role}
            title="Centro de Mando Personal"
            subtitle="Tus proyectos fuera de OFM: tareas, recordatorios y bandeja de ideas."
            onLogout={handleLogout}
            navItems={navItems}
        >
            {error ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            {quickAdd}
            {tabs}

            {vista === "hoy" ? (
                <div className="space-y-6">
                    {vencidas.length ? (
                        <section>
                            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-red-600">Vencidas ({vencidas.length})</h2>
                            {listaTareas(vencidas)}
                        </section>
                    ) : null}
                    <section>
                        <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Para hoy / en curso</h2>
                        {listaTareas(paraHoy)}
                    </section>
                    <section>
                        <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Próximos 7 días</h2>
                        {listaTareas(proximas)}
                    </section>
                </div>
            ) : null}

            {vista === "proyectos" ? (
                proyectoSel ? (
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <button onClick={() => setProyectoSel(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600">← Proyectos</button>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {proyectos.find((p) => p.id === proyectoSel)?.emoji} {proyectos.find((p) => p.id === proyectoSel)?.nombre}
                            </h2>
                            <label className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <input type="checkbox" checked={verCerradas} onChange={(e) => setVerCerradas(e.target.checked)} /> Ver hechas/descartadas
                            </label>
                        </div>
                        {listaTareas(tareasProyecto, false)}
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {(dash?.proyectos || []).map((p) => (
                            <button key={p.id} onClick={() => setProyectoSel(p.id)}
                                className="rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-slate-400 hover:shadow-sm transition">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{p.emoji}</span>
                                    <p className="font-semibold text-slate-900">{p.nombre}</p>
                                </div>
                                <div className="mt-3 flex gap-3 text-xs text-slate-500">
                                    <span><b className="text-slate-900">{p.abiertas}</b> abiertas</span>
                                    {p.en_curso ? <span><b className="text-slate-900">{p.en_curso}</b> en curso</span> : null}
                                    {p.vencidas ? <span className="text-red-600"><b>{p.vencidas}</b> vencidas</span> : null}
                                </div>
                            </button>
                        ))}
                    </div>
                )
            ) : null}

            {vista === "ideas" ? (
                <section>
                    <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Bandeja de ideas</h2>
                    {listaTareas(ideasList)}
                </section>
            ) : null}
        </PortalShell>
    );
}

export default CentroPersonalPage;
