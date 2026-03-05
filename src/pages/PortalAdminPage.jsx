import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PortalShell from "../components/portal/PortalShell";
import { resolveRole } from "../lib/portalAuth";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const statusOptions = ["all", "new", "contacted", "qualified", "proposal_sent", "won", "lost"];
const gradeOptions = ["all", "A", "B", "C"];

const fullLeadSelect =
    "id,name,company,contact,sector,objective,urgency,budget_range,lead_volume,decision_role,message,status,lead_grade,created_at,created_by,assigned_to,last_contact_at,next_action_at,estimated_value,lost_reason";
const fallbackLeadSelect = "id,name,company,contact,status,lead_grade,urgency,created_at,created_by";

const statusLabel = {
    new: "Nuevo",
    contacted: "Contactado",
    qualified: "Calificado",
    proposal_sent: "Propuesta",
    won: "Ganado",
    lost: "Perdido"
};

const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
};

function PortalAdminPage() {
    const [session, setSession] = useState(null);
    const [role, setRole] = useState(null);
    const [leads, setLeads] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [ownerFilter, setOwnerFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("pipeline");
    const [selectedLead, setSelectedLead] = useState(null);
    const [notes, setNotes] = useState([]);
    const [noteDraft, setNoteDraft] = useState("");
    const [notesLoading, setNotesLoading] = useState(false);
    const [savingNote, setSavingNote] = useState(false);
    const [actionError, setActionError] = useState("");
    const [loading, setLoading] = useState(true);
    const [hasCrmColumns, setHasCrmColumns] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        const boot = async () => {
            const {
                data: { session: activeSession }
            } = await supabase.auth.getSession();
            setSession(activeSession);

            if (!activeSession?.user) {
                setLoading(false);
                return;
            }

            const nextRole = await resolveRole(activeSession.user);
            setRole(nextRole);
            setLoading(false);
        };

        boot();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_, activeSession) => {
            setSession(activeSession);
            if (!activeSession?.user) {
                setRole(null);
                setLeads([]);
                setSelectedLead(null);
                return;
            }

            resolveRole(activeSession.user).then(setRole);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session?.user || role !== "admin" || !supabase) return;

        const fetchLeads = async () => {
            let query = supabase.from("leads").select(fullLeadSelect).order("created_at", { ascending: false }).limit(200);
            let { data, error } = await query;

            if (error) {
                const fallback = await supabase.from("leads").select(fallbackLeadSelect).order("created_at", { ascending: false }).limit(200);
                data = fallback.data;
                error = fallback.error;
                setHasCrmColumns(false);
            } else {
                setHasCrmColumns(true);
            }

            if (error) {
                setActionError(error.message || "No se pudieron cargar los leads.");
                return;
            }

            setLeads(data || []);
        };

        const fetchTeam = async () => {
            const { data } = await supabase.from("profiles").select("id, full_name, role").order("created_at", { ascending: true });
            setTeamMembers(data || []);
        };

        fetchLeads();
        fetchTeam();
    }, [session, role]);

    useEffect(() => {
        if (!selectedLead?.id || !supabase || role !== "admin") return;

        const fetchNotes = async () => {
            setNotesLoading(true);
            const { data, error } = await supabase
                .from("lead_notes")
                .select("id, note, created_at, author_id")
                .eq("lead_id", selectedLead.id)
                .order("created_at", { ascending: false });

            setNotesLoading(false);
            if (error) {
                setActionError("No se pudieron cargar las notas. Ejecuta el SQL de lead_notes en Supabase.");
                setNotes([]);
                return;
            }

            setNotes(data || []);
        };

        fetchNotes();
    }, [selectedLead, role]);

    const filteredLeads = useMemo(() => {
        const term = search.trim().toLowerCase();

        return leads.filter((lead) => {
            const byStatus = statusFilter === "all" || (lead.status || "new") === statusFilter;
            const byGrade = gradeFilter === "all" || (lead.lead_grade || "C") === gradeFilter;
            const byOwner =
                ownerFilter === "all" ||
                (ownerFilter === "unassigned"
                    ? !lead.assigned_to
                    : (lead.assigned_to || lead.created_by || "") === ownerFilter);
            const bySearch =
                !term ||
                [lead.name, lead.company, lead.contact]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(term));

            return byStatus && byGrade && byOwner && bySearch;
        });
    }, [gradeFilter, leads, ownerFilter, search, statusFilter]);

    const leadsByStatus = useMemo(() => {
        const base = {
            new: [],
            contacted: [],
            qualified: [],
            proposal_sent: [],
            won: [],
            lost: []
        };

        filteredLeads.forEach((lead) => {
            const key = lead.status || "new";
            if (base[key]) base[key].push(lead);
        });

        return base;
    }, [filteredLeads]);

    const memberMap = useMemo(() => {
        const map = {};
        teamMembers.forEach((member) => {
            map[member.id] = member.full_name || `${member.role || "user"} ${member.id.slice(0, 8)}`;
        });
        return map;
    }, [teamMembers]);

    const assignableMembers = useMemo(() => {
        const admins = teamMembers.filter((member) => member.role === "admin");
        return admins.length > 0 ? admins : teamMembers;
    }, [teamMembers]);

    const kpis = useMemo(() => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const sevenDays = 7 * oneDay;
        const createdToday = leads.filter((lead) => now - new Date(lead.created_at).getTime() <= oneDay).length;
        const created7Days = leads.filter((lead) => now - new Date(lead.created_at).getTime() <= sevenDays).length;
        const gradeA = leads.filter((lead) => lead.lead_grade === "A").length;
        const pending = leads.filter((lead) => !lead.status || ["new", "contacted"].includes(lead.status)).length;

        return {
            createdToday,
            created7Days,
            gradeA,
            pending
        };
    }, [leads]);

    const priorityLeads = useMemo(
        () => leads.filter((lead) => lead.lead_grade === "A" && ["new", "contacted", null].includes(lead.status)).slice(0, 5),
        [leads]
    );

    const updateLead = async (leadId, patch) => {
        if (!supabase) return;
        setActionError("");

        const { error } = await supabase.from("leads").update(patch).eq("id", leadId);
        if (error) {
            setActionError(error.message || "No se pudo actualizar el lead.");
            return;
        }

        setLeads((current) => current.map((lead) => (lead.id === leadId ? { ...lead, ...patch } : lead)));
        setSelectedLead((current) => (current?.id === leadId ? { ...current, ...patch } : current));
    };

    const updateStatus = async (leadId, nextStatus) => {
        await updateLead(leadId, { status: nextStatus, last_contact_at: new Date().toISOString() });
    };

    const updateAssignee = async (leadId, assignedTo) => {
        if (!hasCrmColumns) return;
        await updateLead(leadId, { assigned_to: assignedTo || null });
    };

    const addNote = async () => {
        if (!supabase || !selectedLead?.id || !noteDraft.trim() || !session?.user?.id) return;

        setSavingNote(true);
        const { data, error } = await supabase
            .from("lead_notes")
            .insert({ lead_id: selectedLead.id, author_id: session.user.id, note: noteDraft.trim() })
            .select("id, note, created_at, author_id")
            .single();

        setSavingNote(false);
        if (error) {
            setActionError(error.message || "No se pudo guardar la nota.");
            return;
        }

        setNotes((current) => [data, ...current]);
        setNoteDraft("");
    };

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        navigate("/portal/login", { replace: true });
    };

    if (!isSupabaseConfigured) {
        return (
            <main className="min-h-screen bg-slate-100 px-6 py-10">
                <div className="mx-auto w-full max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
                    Supabase no esta configurado para el portal.
                </div>
            </main>
        );
    }

    if (!loading && !session) return <Navigate to="/portal/login" replace />;
    if (!loading && session && role !== "admin") return <Navigate to="/portal/cliente" replace />;

    return (
        <>
            <PortalShell
                email={session?.user?.email || ""}
                role="admin"
                title="Panel Admin"
                subtitle="Vision clara del pipeline comercial, responsables y seguimiento interno"
                onLogout={handleLogout}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Nuevos hoy</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{kpis.createdToday}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Nuevos 7 dias</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{kpis.created7Days}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Leads grado A</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{kpis.gradeA}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Pendientes</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{kpis.pending}</p>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-slate-700">Filtros</p>
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status === "all" ? "Estado: todos" : statusLabel[status] || status}
                            </option>
                        ))}
                    </select>
                    <select value={gradeFilter} onChange={(event) => setGradeFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                        {gradeOptions.map((grade) => (
                            <option key={grade} value={grade}>
                                {grade === "all" ? "Grade: todos" : `Grade ${grade}`}
                            </option>
                        ))}
                    </select>
                    <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                        <option value="all">Responsable: todos</option>
                        <option value="unassigned">Sin asignar</option>
                        {assignableMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.full_name || `${member.role} ${member.id.slice(0, 8)}`}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nombre, empresa o contacto"
                        className="min-w-64 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                    />
                    <div className="ml-auto inline-flex overflow-hidden rounded-xl border border-slate-300 bg-white text-sm">
                        <button onClick={() => setViewMode("pipeline")} className={`px-3 py-2 ${viewMode === "pipeline" ? "bg-slate-900 text-white" : "text-slate-700"}`}>
                            Pipeline
                        </button>
                        <button onClick={() => setViewMode("tabla")} className={`px-3 py-2 ${viewMode === "tabla" ? "bg-slate-900 text-white" : "text-slate-700"}`}>
                            Tabla
                        </button>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Prioridad de hoy</p>
                    {priorityLeads.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-600">No hay leads A pendientes en este momento.</p>
                    ) : (
                        <div className="mt-2 flex flex-wrap gap-2 text-sm">
                            {priorityLeads.map((lead) => (
                                <button key={lead.id} onClick={() => setSelectedLead(lead)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-left text-slate-700">
                                    {(lead.name || "Sin nombre") + " - " + (lead.company || "Sin empresa")}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {actionError ? <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{actionError}</p> : null}
                {!hasCrmColumns ? (
                    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Faltan columnas CRM en la base de datos. Ejecuta `supabase/schema.sql` para habilitar asignaciones, notas y seguimiento.
                    </p>
                ) : null}

                {viewMode === "tabla" ? (
                    <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full min-w-[980px] text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Empresa</th>
                                    <th className="px-4 py-3">Contacto</th>
                                    <th className="px-4 py-3">Grade</th>
                                    <th className="px-4 py-3">Urgencia</th>
                                    <th className="px-4 py-3">Responsable</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="border-t border-slate-200">
                                        <td className="px-4 py-3 text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-slate-900">{lead.name || "-"}</td>
                                        <td className="px-4 py-3 text-slate-700">{lead.company || "-"}</td>
                                        <td className="px-4 py-3 text-slate-700">{lead.contact || "-"}</td>
                                        <td className="px-4 py-3 text-slate-700">{lead.lead_grade || "-"}</td>
                                        <td className="px-4 py-3 text-slate-700">{lead.urgency || "-"}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={lead.assigned_to || ""}
                                                onChange={(event) => updateAssignee(lead.id, event.target.value)}
                                                disabled={!hasCrmColumns}
                                                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50"
                                            >
                                                <option value="">Sin asignar</option>
                                                {assignableMembers.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.full_name || `${member.role} ${member.id.slice(0, 8)}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={lead.status || "new"}
                                                onChange={(event) => updateStatus(lead.id, event.target.value)}
                                                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                                            >
                                                {statusOptions
                                                    .filter((status) => status !== "all")
                                                    .map((status) => (
                                                        <option key={status} value={status}>
                                                            {statusLabel[status]}
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setSelectedLead(lead)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700">
                                                Abrir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredLeads.length === 0 ? <p className="px-4 py-5 text-sm text-slate-500">No hay leads para este filtro.</p> : null}
                    </div>
                ) : (
                    <div className="mt-4 overflow-x-auto">
                        <div className="grid min-w-[1160px] grid-cols-6 gap-4">
                            {statusOptions
                                .filter((status) => status !== "all")
                                .map((status) => (
                                    <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">{statusLabel[status]}</p>
                                            <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600">{leadsByStatus[status].length}</span>
                                        </div>

                                        <div className="space-y-2">
                                            {leadsByStatus[status].length === 0 ? (
                                                <p className="rounded-xl border border-dashed border-slate-300 px-2 py-3 text-center text-xs text-slate-500">Sin leads</p>
                                            ) : (
                                                leadsByStatus[status].map((lead) => (
                                                    <article key={lead.id} className="rounded-xl border border-slate-200 bg-white p-2">
                                                        <button onClick={() => setSelectedLead(lead)} className="w-full text-left">
                                                            <p className="text-sm font-semibold text-slate-900">{lead.name || "Sin nombre"}</p>
                                                            <p className="mt-0.5 text-xs text-slate-600">{lead.company || "Sin empresa"}</p>
                                                            <p className="mt-0.5 break-words text-xs text-slate-500">{lead.contact || "Sin contacto"}</p>
                                                        </button>
                                                        <div className="mt-2 flex items-center justify-between gap-2">
                                                            <span className="rounded-full border border-slate-300 px-1.5 py-0.5 text-[11px] text-slate-600">Grade {lead.lead_grade || "-"}</span>
                                                            <select
                                                                value={lead.status || "new"}
                                                                onChange={(event) => updateStatus(lead.id, event.target.value)}
                                                                className="rounded-md border border-slate-300 bg-white px-1.5 py-1 text-[11px] text-slate-700"
                                                            >
                                                                {statusOptions
                                                                    .filter((item) => item !== "all")
                                                                    .map((item) => (
                                                                        <option key={item} value={item}>
                                                                            {statusLabel[item]}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                        </div>
                                                        <p className="mt-1 text-[11px] text-slate-500">Owner: {memberMap[lead.assigned_to] || "Sin asignar"}</p>
                                                    </article>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </PortalShell>

            {selectedLead ? (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/55 px-4">
                    <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.3)] sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Ficha de lead</p>
                                <h2 className="mt-1 text-2xl text-slate-900">{selectedLead.name || "Sin nombre"}</h2>
                                <p className="mt-1 text-sm text-slate-600">{selectedLead.company || "Sin empresa"} - {selectedLead.contact || "Sin contacto"}</p>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm text-slate-700">
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                                <p className="text-xs uppercase text-slate-500">Estado</p>
                                <select
                                    value={selectedLead.status || "new"}
                                    onChange={(event) => updateStatus(selectedLead.id, event.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
                                >
                                    {statusOptions
                                        .filter((item) => item !== "all")
                                        .map((item) => (
                                            <option key={item} value={item}>
                                                {statusLabel[item]}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                                <p className="text-xs uppercase text-slate-500">Responsable</p>
                                <select
                                    value={selectedLead.assigned_to || ""}
                                    onChange={(event) => updateAssignee(selectedLead.id, event.target.value)}
                                    disabled={!hasCrmColumns}
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50"
                                >
                                    <option value="">Sin asignar</option>
                                    {assignableMembers.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.full_name || `${member.role} ${member.id.slice(0, 8)}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                <p className="text-xs uppercase text-slate-500">Grade</p>
                                <p className="mt-1 font-semibold">{selectedLead.lead_grade || "-"}</p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                <p className="text-xs uppercase text-slate-500">Creado</p>
                                <p className="mt-1">{formatDate(selectedLead.created_at)}</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="text-sm font-semibold text-slate-900">Contexto comercial</p>
                                <div className="mt-3 space-y-2 text-sm text-slate-700">
                                    <p>
                                        <span className="text-slate-500">Sector:</span> {selectedLead.sector || "-"}
                                    </p>
                                    <p>
                                        <span className="text-slate-500">Objetivo:</span> {selectedLead.objective || "-"}
                                    </p>
                                    <p>
                                        <span className="text-slate-500">Urgencia:</span> {selectedLead.urgency || "-"}
                                    </p>
                                    <p>
                                        <span className="text-slate-500">Presupuesto:</span> {selectedLead.budget_range || "-"}
                                    </p>
                                    <p>
                                        <span className="text-slate-500">Volumen:</span> {selectedLead.lead_volume || "-"}
                                    </p>
                                    <p>
                                        <span className="text-slate-500">Decision:</span> {selectedLead.decision_role || "-"}
                                    </p>
                                </div>
                                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                    <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Mensaje</p>
                                    <p className="mt-1 whitespace-pre-wrap">{selectedLead.message || "Sin mensaje"}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="text-sm font-semibold text-slate-900">Timeline interno</p>
                                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                    <p className="font-medium">Lead creado</p>
                                    <p className="text-xs text-slate-500">{formatDate(selectedLead.created_at)}</p>
                                </div>

                                <div className="mt-3 max-h-56 space-y-2 overflow-auto pr-1">
                                    {notesLoading ? <p className="text-sm text-slate-500">Cargando notas...</p> : null}
                                    {!notesLoading && notes.length === 0 ? <p className="text-sm text-slate-500">Sin notas internas todavia.</p> : null}
                                    {notes.map((note) => (
                                        <article key={note.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                                            <p className="whitespace-pre-wrap">{note.note}</p>
                                            <p className="mt-1 text-xs text-slate-500">{formatDate(note.created_at)}</p>
                                        </article>
                                    ))}
                                </div>

                                <div className="mt-3">
                                    <textarea
                                        value={noteDraft}
                                        onChange={(event) => setNoteDraft(event.target.value)}
                                        rows={3}
                                        placeholder="Escribe una nota interna, acuerdo o siguiente paso"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500"
                                    />
                                    <button
                                        onClick={addNote}
                                        disabled={savingNote || !noteDraft.trim()}
                                        className="mt-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                    >
                                        {savingNote ? "Guardando..." : "Guardar nota"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default PortalAdminPage;
