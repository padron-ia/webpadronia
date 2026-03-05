import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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

const sectionConfig = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Resumen ejecutivo con volumen, prioridad y estado del pipeline"
    },
    inbox: {
        title: "Inbox",
        subtitle: "Triage diario de nuevos leads y casos sin contacto"
    },
    leads: {
        title: "Leads",
        subtitle: "Base completa para filtrar, buscar y operar en escala"
    },
    pipeline: {
        title: "Pipeline",
        subtitle: "Vista comercial por etapas para mover oportunidades rapido"
    },
    actividades: {
        title: "Actividades",
        subtitle: "Seguimientos, proximas acciones y tareas pendientes"
    },
    reportes: {
        title: "Reportes",
        subtitle: "Rendimiento por etapa, conversion y responsables"
    },
    configuracion: {
        title: "Configuracion",
        subtitle: "Equipo, criterios operativos y checklist del sistema"
    }
};

const adminNavItems = [
    { label: "Dashboard", href: "/portal/admin/dashboard" },
    { label: "Inbox", href: "/portal/admin/inbox" },
    { label: "Leads", href: "/portal/admin/leads" },
    { label: "Pipeline", href: "/portal/admin/pipeline" },
    { label: "Actividades", href: "/portal/admin/actividades" },
    { label: "Reportes", href: "/portal/admin/reportes" },
    { label: "Configuracion", href: "/portal/admin/configuracion" }
];

const quickViews = [
    { id: "all", label: "Todo" },
    { id: "a_priority", label: "A prioridad" },
    { id: "unassigned", label: "Sin asignar" },
    { id: "stale_24h", label: "Sin contacto 24h" },
    { id: "follow_up_today", label: "Follow-up hoy" }
];

const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
};

const toInputDatetime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
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
    const [activeQuickView, setActiveQuickView] = useState(() => localStorage.getItem("padron_admin_quick_view") || "all");
    const [selectedLeadIds, setSelectedLeadIds] = useState([]);
    const [bulkStatusChoice, setBulkStatusChoice] = useState("contacted");
    const [bulkOwnerChoice, setBulkOwnerChoice] = useState("");
    const [bulkScheduleChoice, setBulkScheduleChoice] = useState("24");
    const [selectedLead, setSelectedLead] = useState(null);
    const [notes, setNotes] = useState([]);
    const [noteDraft, setNoteDraft] = useState("");
    const [nextActionDraft, setNextActionDraft] = useState("");
    const [estimatedValueDraft, setEstimatedValueDraft] = useState("");
    const [notesLoading, setNotesLoading] = useState(false);
    const [savingNote, setSavingNote] = useState(false);
    const [actionError, setActionError] = useState("");
    const [loading, setLoading] = useState(true);
    const [hasCrmColumns, setHasCrmColumns] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const rawSection = location.pathname.replace("/portal/admin", "").replace(/^\/+/, "") || "dashboard";
    const currentSection = sectionConfig[rawSection] ? rawSection : "dashboard";

    useEffect(() => {
        localStorage.setItem("padron_admin_quick_view", activeQuickView);
    }, [activeQuickView]);

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
            const { data, error } = await supabase.from("leads").select(fullLeadSelect).order("created_at", { ascending: false }).limit(300);

            if (!error) {
                setHasCrmColumns(true);
                setLeads(data || []);
                return;
            }

            const fallback = await supabase.from("leads").select(fallbackLeadSelect).order("created_at", { ascending: false }).limit(300);
            if (fallback.error) {
                setActionError(fallback.error.message || "No se pudieron cargar los leads.");
                return;
            }

            setHasCrmColumns(false);
            setLeads(fallback.data || []);
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

        setNextActionDraft(toInputDatetime(selectedLead.next_action_at));
        setEstimatedValueDraft(selectedLead.estimated_value ? String(selectedLead.estimated_value) : "");

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
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        return leads.filter((lead) => {
            const byStatus = statusFilter === "all" || (lead.status || "new") === statusFilter;
            const byGrade = gradeFilter === "all" || (lead.lead_grade || "C") === gradeFilter;
            const byOwner = ownerFilter === "all" || (ownerFilter === "unassigned" ? !lead.assigned_to : lead.assigned_to === ownerFilter);
            const bySearch = !term || [lead.name, lead.company, lead.contact].filter(Boolean).some((value) => value.toLowerCase().includes(term));
            const status = lead.status || "new";

            let byQuickView = true;
            if (activeQuickView === "a_priority") byQuickView = (lead.lead_grade || "C") === "A" && ["new", "contacted", "qualified"].includes(status);
            if (activeQuickView === "unassigned") byQuickView = !lead.assigned_to;
            if (activeQuickView === "stale_24h") byQuickView = ["new", "contacted"].includes(status) && !lead.last_contact_at && now - new Date(lead.created_at).getTime() > dayMs;
            if (activeQuickView === "follow_up_today") {
                byQuickView = Boolean(lead.next_action_at) && new Date(lead.next_action_at).getTime() <= endOfToday.getTime() && !["won", "lost"].includes(status);
            }

            return byStatus && byGrade && byOwner && bySearch && byQuickView;
        });
    }, [activeQuickView, gradeFilter, leads, ownerFilter, search, statusFilter]);

    useEffect(() => {
        setSelectedLeadIds((current) => current.filter((leadId) => filteredLeads.some((lead) => lead.id === leadId)));
    }, [filteredLeads]);

    const leadsByStatus = useMemo(() => {
        const groups = { new: [], contacted: [], qualified: [], proposal_sent: [], won: [], lost: [] };
        filteredLeads.forEach((lead) => {
            const key = lead.status || "new";
            if (groups[key]) groups[key].push(lead);
        });
        return groups;
    }, [filteredLeads]);

    const assignableMembers = useMemo(() => {
        const admins = teamMembers.filter((member) => member.role === "admin");
        return admins.length ? admins : teamMembers;
    }, [teamMembers]);

    const memberMap = useMemo(() => {
        const map = {};
        assignableMembers.forEach((member) => {
            map[member.id] = member.full_name || `${member.role || "user"} ${member.id.slice(0, 8)}`;
        });
        return map;
    }, [assignableMembers]);

    const kpis = useMemo(() => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const sevenDays = 7 * oneDay;
        return {
            createdToday: leads.filter((lead) => now - new Date(lead.created_at).getTime() <= oneDay).length,
            created7Days: leads.filter((lead) => now - new Date(lead.created_at).getTime() <= sevenDays).length,
            gradeA: leads.filter((lead) => lead.lead_grade === "A").length,
            pending: leads.filter((lead) => !lead.status || ["new", "contacted"].includes(lead.status)).length
        };
    }, [leads]);

    const priorityLeads = useMemo(() => leads.filter((lead) => lead.lead_grade === "A" && ["new", "contacted", null].includes(lead.status)).slice(0, 6), [leads]);
    const unattendedLeads = useMemo(() => {
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        return leads
            .filter((lead) => ["new", "contacted"].includes(lead.status || "new") && !lead.last_contact_at && now - new Date(lead.created_at).getTime() > dayMs)
            .slice(0, 10);
    }, [leads]);

    const inboxLeads = useMemo(
        () =>
            filteredLeads
                .filter((lead) => ["new", "contacted"].includes(lead.status || "new"))
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        [filteredLeads]
    );

    const activityLeads = useMemo(
        () =>
            filteredLeads
                .filter((lead) => !["won", "lost"].includes(lead.status || "new"))
                .sort((a, b) => {
                    const aDate = a.next_action_at ? new Date(a.next_action_at).getTime() : Infinity;
                    const bDate = b.next_action_at ? new Date(b.next_action_at).getTime() : Infinity;
                    return aDate - bDate;
                })
                .slice(0, 50),
        [filteredLeads]
    );

    const ownerStats = useMemo(() => {
        const map = {};
        leads.forEach((lead) => {
            const owner = lead.assigned_to || "unassigned";
            map[owner] = (map[owner] || 0) + 1;
        });
        return Object.entries(map)
            .map(([ownerId, count]) => ({ ownerId, count }))
            .sort((a, b) => b.count - a.count);
    }, [leads]);

    const getSlaBadge = (lead) => {
        const status = lead.status || "new";
        if (["won", "lost"].includes(status)) {
            return { label: "Cerrado", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
        }

        const reference = lead.last_contact_at || lead.created_at;
        const hours = (Date.now() - new Date(reference).getTime()) / (1000 * 60 * 60);

        if (hours > 48) return { label: ">48h", className: "border-red-200 bg-red-50 text-red-700" };
        if (hours > 24) return { label: ">24h", className: "border-amber-200 bg-amber-50 text-amber-700" };
        return { label: "En SLA", className: "border-slate-200 bg-slate-50 text-slate-700" };
    };

    const toggleLeadSelection = (leadId) => {
        setSelectedLeadIds((current) => (current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]));
    };

    const toggleAllVisible = (visibleIds) => {
        if (visibleIds.length === 0) return;
        const allSelected = visibleIds.every((id) => selectedLeadIds.includes(id));
        setSelectedLeadIds((current) => {
            if (allSelected) return current.filter((id) => !visibleIds.includes(id));
            return Array.from(new Set([...current, ...visibleIds]));
        });
    };

    const bulkUpdateLeads = async (ids, patch) => {
        if (!supabase || ids.length === 0) return;

        setActionError("");
        const updates = await Promise.all(ids.map((leadId) => supabase.from("leads").update(patch).eq("id", leadId)));
        const failed = updates.find((result) => result.error);

        if (failed?.error) {
            setActionError(failed.error.message || "No se pudo aplicar accion masiva.");
            return;
        }

        setLeads((current) => current.map((lead) => (ids.includes(lead.id) ? { ...lead, ...patch } : lead)));
        setSelectedLeadIds([]);
    };

    const applyBulkStatus = async () => {
        await bulkUpdateLeads(selectedLeadIds, { status: bulkStatusChoice, last_contact_at: new Date().toISOString() });
    };

    const applyBulkOwner = async () => {
        if (!hasCrmColumns) return;
        await bulkUpdateLeads(selectedLeadIds, { assigned_to: bulkOwnerChoice || null });
    };

    const applyBulkSchedule = async () => {
        if (!hasCrmColumns) return;
        const hours = Number(bulkScheduleChoice) || 24;
        const nextAction = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
        await bulkUpdateLeads(selectedLeadIds, { next_action_at: nextAction });
    };

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

    const scheduleNextAction = async (leadId, hours = 24) => {
        if (!hasCrmColumns) return;
        const date = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
        await updateLead(leadId, { next_action_at: date });
    };

    const saveLeadPlan = async () => {
        if (!selectedLead?.id || !hasCrmColumns) return;
        const nextActionValue = nextActionDraft ? new Date(nextActionDraft).toISOString() : null;
        const estimatedValue = estimatedValueDraft ? Number(estimatedValueDraft) : null;
        await updateLead(selectedLead.id, { next_action_at: nextActionValue, estimated_value: estimatedValue });
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

    const renderFilterBar = () => (
        <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <p className="mr-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Vistas rapidas</p>
                {quickViews.map((view) => (
                    <button
                        key={view.id}
                        onClick={() => setActiveQuickView(view.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
                            activeQuickView === view.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-600"
                        }`}
                    >
                        {view.label}
                    </button>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-slate-700">Filtros</p>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status === "all" ? "Estado: todos" : statusLabel[status]}
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
            </div>
        </>
    );

    const renderBulkBar = () => {
        if (selectedLeadIds.length === 0) return null;

        return (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-700">{selectedLeadIds.length} seleccionados</p>
                <select value={bulkStatusChoice} onChange={(event) => setBulkStatusChoice(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">
                    {statusOptions.filter((status) => status !== "all").map((status) => (
                        <option key={`bulk-status-${status}`} value={status}>{statusLabel[status]}</option>
                    ))}
                </select>
                <button onClick={applyBulkStatus} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">Cambiar estado</button>

                <select value={bulkOwnerChoice} onChange={(event) => setBulkOwnerChoice(event.target.value)} disabled={!hasCrmColumns} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50">
                    <option value="">Sin asignar</option>
                    {assignableMembers.map((member) => (
                        <option key={`bulk-owner-${member.id}`} value={member.id}>{member.full_name || `${member.role} ${member.id.slice(0, 8)}`}</option>
                    ))}
                </select>
                <button onClick={applyBulkOwner} disabled={!hasCrmColumns} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50">Asignar owner</button>

                <select value={bulkScheduleChoice} onChange={(event) => setBulkScheduleChoice(event.target.value)} disabled={!hasCrmColumns} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50">
                    <option value="24">+24h</option>
                    <option value="48">+48h</option>
                    <option value="72">+72h</option>
                </select>
                <button onClick={applyBulkSchedule} disabled={!hasCrmColumns} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50">Planificar</button>

                <button onClick={() => setSelectedLeadIds([])} className="ml-auto rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">Limpiar</button>
            </div>
        );
    };

    const renderDashboard = () => (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Nuevos hoy</p><p className="mt-2 text-3xl font-semibold text-slate-900">{kpis.createdToday}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Nuevos 7 dias</p><p className="mt-2 text-3xl font-semibold text-slate-900">{kpis.created7Days}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Leads grado A</p><p className="mt-2 text-3xl font-semibold text-slate-900">{kpis.gradeA}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Pendientes</p><p className="mt-2 text-3xl font-semibold text-slate-900">{kpis.pending}</p></div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-6">
                {statusOptions.filter((status) => status !== "all").map((status) => (
                    <div key={`status-${status}`} className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">{statusLabel[status]}</p>
                        <p className="mt-1 text-xl font-semibold text-slate-900">{leadsByStatus[status].length}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Prioridad de hoy</p>
                    {priorityLeads.length === 0 ? <p className="mt-2 text-sm text-slate-600">No hay leads A pendientes en este momento.</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        {priorityLeads.map((lead) => (
                            <button key={lead.id} onClick={() => setSelectedLead(lead)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-700">
                                {(lead.name || "Sin nombre") + " - " + (lead.company || "Sin empresa")}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-amber-700">Alertas de contacto</p>
                    {unattendedLeads.length === 0 ? <p className="mt-2 text-sm text-amber-700">No hay leads sin contacto mayor a 24h.</p> : null}
                    <div className="mt-2 space-y-2">
                        {unattendedLeads.slice(0, 5).map((lead) => (
                            <div key={`alert-${lead.id}`} className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm">
                                <p className="font-semibold text-slate-900">{lead.name || "Sin nombre"}</p>
                                <p className="text-slate-600">{lead.company || "Sin empresa"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    const renderInbox = () => (
        <>
            {renderFilterBar()}
            {renderBulkBar()}
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full min-w-[860px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={inboxLeads.length > 0 && inboxLeads.every((lead) => selectedLeadIds.includes(lead.id))}
                                    onChange={() => toggleAllVisible(inboxLeads.map((lead) => lead.id))}
                                />
                            </th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Lead</th>
                            <th className="px-4 py-3">Grade</th>
                            <th className="px-4 py-3">SLA</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Responsable</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inboxLeads.map((lead) => (
                            <tr key={`inbox-${lead.id}`} className="border-t border-slate-200">
                                <td className="px-4 py-3">
                                    <input type="checkbox" checked={selectedLeadIds.includes(lead.id)} onChange={() => toggleLeadSelection(lead.id)} />
                                </td>
                                <td className="px-4 py-3 text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => setSelectedLead(lead)} className="text-left">
                                        <p className="font-semibold text-slate-900">{lead.name || "Sin nombre"}</p>
                                        <p className="text-xs text-slate-600">{lead.company || "Sin empresa"} - {lead.contact || "-"}</p>
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{lead.lead_grade || "-"}</td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getSlaBadge(lead).className}`}>{getSlaBadge(lead).label}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <select value={lead.status || "new"} onChange={(event) => updateStatus(lead.id, event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">
                                        {statusOptions.filter((status) => status !== "all").map((status) => (
                                            <option key={`${lead.id}-${status}`} value={status}>{statusLabel[status]}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={lead.assigned_to || ""}
                                        onChange={(event) => updateAssignee(lead.id, event.target.value)}
                                        disabled={!hasCrmColumns}
                                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50"
                                    >
                                        <option value="">Sin asignar</option>
                                        {assignableMembers.map((member) => (
                                            <option key={`${lead.id}-${member.id}`} value={member.id}>{member.full_name || `${member.role} ${member.id.slice(0, 8)}`}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => updateStatus(lead.id, "contacted")} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700">Contactado</button>
                                        <button onClick={() => scheduleNextAction(lead.id, 24)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700">+24h</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {inboxLeads.length === 0 ? <p className="px-4 py-5 text-sm text-slate-500">No hay leads en inbox para este filtro.</p> : null}
            </div>
        </>
    );

    const renderLeadsTable = () => (
        <>
            {renderFilterBar()}
            {renderBulkBar()}
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[1020px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={filteredLeads.length > 0 && filteredLeads.every((lead) => selectedLeadIds.includes(lead.id))}
                                    onChange={() => toggleAllVisible(filteredLeads.map((lead) => lead.id))}
                                />
                            </th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Empresa</th>
                            <th className="px-4 py-3">Contacto</th>
                            <th className="px-4 py-3">Grade</th>
                            <th className="px-4 py-3">SLA</th>
                            <th className="px-4 py-3">Urgencia</th>
                            <th className="px-4 py-3">Responsable</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map((lead) => (
                            <tr key={`table-${lead.id}`} className="border-t border-slate-200">
                                <td className="px-4 py-3">
                                    <input type="checkbox" checked={selectedLeadIds.includes(lead.id)} onChange={() => toggleLeadSelection(lead.id)} />
                                </td>
                                <td className="px-4 py-3 text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-slate-900">{lead.name || "-"}</td>
                                <td className="px-4 py-3 text-slate-700">{lead.company || "-"}</td>
                                <td className="px-4 py-3 text-slate-700">{lead.contact || "-"}</td>
                                <td className="px-4 py-3 text-slate-700">{lead.lead_grade || "-"}</td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getSlaBadge(lead).className}`}>{getSlaBadge(lead).label}</span>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{lead.urgency || "-"}</td>
                                <td className="px-4 py-3">
                                    <select value={lead.assigned_to || ""} onChange={(event) => updateAssignee(lead.id, event.target.value)} disabled={!hasCrmColumns} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50">
                                        <option value="">Sin asignar</option>
                                        {assignableMembers.map((member) => (
                                            <option key={`${lead.id}-${member.id}`} value={member.id}>{member.full_name || `${member.role} ${member.id.slice(0, 8)}`}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <select value={lead.status || "new"} onChange={(event) => updateStatus(lead.id, event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">
                                        {statusOptions.filter((status) => status !== "all").map((status) => (
                                            <option key={`${lead.id}-status-${status}`} value={status}>{statusLabel[status]}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => setSelectedLead(lead)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700">Abrir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLeads.length === 0 ? <p className="px-4 py-5 text-sm text-slate-500">No hay leads para este filtro.</p> : null}
            </div>
        </>
    );

    const renderPipeline = () => (
        <>
            {renderFilterBar()}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                {statusOptions.filter((status) => status !== "all").map((status) => (
                    <div key={`pipeline-${status}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">{statusLabel[status]}</p>
                            <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600">{leadsByStatus[status].length}</span>
                        </div>
                        <div className="space-y-2">
                            {leadsByStatus[status].length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 px-2 py-3 text-center text-xs text-slate-500">Sin leads</p> : null}
                            {leadsByStatus[status].map((lead) => (
                                <article key={`pipeline-card-${lead.id}`} className="rounded-xl border border-slate-200 bg-white p-2">
                                    <button onClick={() => setSelectedLead(lead)} className="w-full text-left">
                                        <p className="text-sm font-semibold text-slate-900">{lead.name || "Sin nombre"}</p>
                                        <p className="mt-0.5 text-xs text-slate-600">{lead.company || "Sin empresa"}</p>
                                        <p className="mt-0.5 break-words text-xs text-slate-500">{lead.contact || "Sin contacto"}</p>
                                    </button>
                                    <div className="mt-2 flex items-center justify-between gap-2">
                                        <span className="rounded-full border border-slate-300 px-1.5 py-0.5 text-[11px] text-slate-600">Grade {lead.lead_grade || "-"}</span>
                                        <select value={lead.status || "new"} onChange={(event) => updateStatus(lead.id, event.target.value)} className="rounded-md border border-slate-300 bg-white px-1.5 py-1 text-[11px] text-slate-700">
                                            {statusOptions.filter((item) => item !== "all").map((item) => (
                                                <option key={`${lead.id}-${item}`} value={item}>{statusLabel[item]}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className={`mt-1 inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${getSlaBadge(lead).className}`}>{getSlaBadge(lead).label}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Owner: {memberMap[lead.assigned_to] || "Sin asignar"}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const renderActivities = () => (
        <>
            {renderFilterBar()}
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Lead</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Ultimo contacto</th>
                            <th className="px-4 py-3">Proxima accion</th>
                            <th className="px-4 py-3">Responsable</th>
                            <th className="px-4 py-3">Atajos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activityLeads.map((lead) => (
                            <tr key={`activity-${lead.id}`} className="border-t border-slate-200">
                                <td className="px-4 py-3">
                                    <button onClick={() => setSelectedLead(lead)} className="text-left">
                                        <p className="font-semibold text-slate-900">{lead.name || "Sin nombre"}</p>
                                        <p className="text-xs text-slate-600">{lead.company || "Sin empresa"}</p>
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{statusLabel[lead.status || "new"]}</td>
                                <td className="px-4 py-3 text-slate-700">{formatDate(lead.last_contact_at)}</td>
                                <td className="px-4 py-3 text-slate-700">{formatDate(lead.next_action_at)}</td>
                                <td className="px-4 py-3 text-slate-700">{memberMap[lead.assigned_to] || "Sin asignar"}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => updateLead(lead.id, { last_contact_at: new Date().toISOString() })} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700">Contacto hoy</button>
                                        <button onClick={() => scheduleNextAction(lead.id, 24)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700">+24h</button>
                                        <button onClick={() => scheduleNextAction(lead.id, 72)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700">+72h</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {activityLeads.length === 0 ? <p className="px-4 py-5 text-sm text-slate-500">No hay actividades para este filtro.</p> : null}
            </div>
        </>
    );

    const renderReportes = () => (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Conversion por etapa</p>
                <div className="mt-3 space-y-2">
                    {statusOptions.filter((status) => status !== "all").map((status) => {
                        const count = leadsByStatus[status].length;
                        const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
                        return (
                            <div key={`report-${status}`}>
                                <div className="mb-1 flex items-center justify-between text-sm text-slate-700"><span>{statusLabel[status]}</span><span>{count} ({pct}%)</span></div>
                                <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-slate-900" style={{ width: `${pct}%` }} /></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Carga por responsable</p>
                <div className="mt-3 space-y-2">
                    {ownerStats.map((item) => (
                        <div key={`owner-${item.ownerId}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                            <span>{item.ownerId === "unassigned" ? "Sin asignar" : memberMap[item.ownerId] || item.ownerId.slice(0, 8)}</span>
                            <span className="font-semibold text-slate-900">{item.count}</span>
                        </div>
                    ))}
                    {ownerStats.length === 0 ? <p className="text-sm text-slate-500">Sin datos de responsables todavia.</p> : null}
                </div>
            </div>
        </div>
    );

    const renderConfig = () => (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Equipo portal</p>
                <div className="mt-3 space-y-2">
                    {teamMembers.map((member) => (
                        <div key={`team-${member.id}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                            <p className="font-semibold text-slate-900">{member.full_name || "Sin nombre"}</p>
                            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{member.role || "client"}</p>
                        </div>
                    ))}
                    {teamMembers.length === 0 ? <p className="text-sm text-slate-500">No hay perfiles cargados.</p> : null}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Checklist de escalabilidad</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    <li>Definir SLA de primer contacto: 24h maximo.</li>
                    <li>Asignar owner en todo lead A o urgente.</li>
                    <li>Revisar Inbox dos veces al dia.</li>
                    <li>Actualizar estado y proxima accion en cada toque.</li>
                    <li>Correr `supabase/schema.sql` para habilitar todas las funciones CRM.</li>
                </ul>
            </div>
        </div>
    );

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

    if (!sectionConfig[rawSection]) {
        return <Navigate to="/portal/admin/dashboard" replace />;
    }

    return (
        <>
            <PortalShell
                email={session?.user?.email || ""}
                role="admin"
                title={sectionConfig[currentSection].title}
                subtitle={sectionConfig[currentSection].subtitle}
                onLogout={handleLogout}
                navItems={adminNavItems}
            >
                {actionError ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{actionError}</p> : null}
                {!hasCrmColumns ? (
                    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Faltan columnas CRM en la base de datos. Ejecuta `supabase/schema.sql` para habilitar asignaciones, notas y seguimiento.
                    </p>
                ) : null}

                {currentSection === "dashboard" ? renderDashboard() : null}
                {currentSection === "inbox" ? renderInbox() : null}
                {currentSection === "leads" ? renderLeadsTable() : null}
                {currentSection === "pipeline" ? renderPipeline() : null}
                {currentSection === "actividades" ? renderActivities() : null}
                {currentSection === "reportes" ? renderReportes() : null}
                {currentSection === "configuracion" ? renderConfig() : null}
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
                            <button onClick={() => setSelectedLead(null)} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm text-slate-700">Cerrar</button>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                                <p className="text-xs uppercase text-slate-500">Estado</p>
                                <select value={selectedLead.status || "new"} onChange={(event) => updateStatus(selectedLead.id, event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">
                                    {statusOptions.filter((item) => item !== "all").map((item) => (
                                        <option key={`modal-${item}`} value={item}>{statusLabel[item]}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                                <p className="text-xs uppercase text-slate-500">Responsable</p>
                                <select value={selectedLead.assigned_to || ""} onChange={(event) => updateAssignee(selectedLead.id, event.target.value)} disabled={!hasCrmColumns} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-50">
                                    <option value="">Sin asignar</option>
                                    {assignableMembers.map((member) => (
                                        <option key={`modal-owner-${member.id}`} value={member.id}>{member.full_name || `${member.role} ${member.id.slice(0, 8)}`}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"><p className="text-xs uppercase text-slate-500">Grade</p><p className="mt-1 font-semibold">{selectedLead.lead_grade || "-"}</p></div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"><p className="text-xs uppercase text-slate-500">Creado</p><p className="mt-1">{formatDate(selectedLead.created_at)}</p></div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="text-sm font-semibold text-slate-900">Contexto comercial</p>
                                <div className="mt-3 space-y-2 text-sm text-slate-700">
                                    <p><span className="text-slate-500">Sector:</span> {selectedLead.sector || "-"}</p>
                                    <p><span className="text-slate-500">Objetivo:</span> {selectedLead.objective || "-"}</p>
                                    <p><span className="text-slate-500">Urgencia:</span> {selectedLead.urgency || "-"}</p>
                                    <p><span className="text-slate-500">Presupuesto:</span> {selectedLead.budget_range || "-"}</p>
                                    <p><span className="text-slate-500">Volumen:</span> {selectedLead.lead_volume || "-"}</p>
                                    <p><span className="text-slate-500">Decision:</span> {selectedLead.decision_role || "-"}</p>
                                </div>
                                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                    <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Mensaje</p>
                                    <p className="mt-1 whitespace-pre-wrap">{selectedLead.message || "Sin mensaje"}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="text-sm font-semibold text-slate-900">Timeline interno</p>
                                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                        <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Proxima accion</p>
                                        <input type="datetime-local" value={nextActionDraft} onChange={(event) => setNextActionDraft(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700" disabled={!hasCrmColumns} />
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                        <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Valor estimado</p>
                                        <input type="number" value={estimatedValueDraft} onChange={(event) => setEstimatedValueDraft(event.target.value)} placeholder="0" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700" disabled={!hasCrmColumns} />
                                    </div>
                                </div>
                                <button onClick={saveLeadPlan} disabled={!hasCrmColumns} className="mt-2 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50">Guardar plan</button>

                                <div className="mt-3 max-h-56 space-y-2 overflow-auto pr-1">
                                    {notesLoading ? <p className="text-sm text-slate-500">Cargando notas...</p> : null}
                                    {!notesLoading && notes.length === 0 ? <p className="text-sm text-slate-500">Sin notas internas todavia.</p> : null}
                                    {notes.map((note) => (
                                        <article key={note.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700"><p className="whitespace-pre-wrap">{note.note}</p><p className="mt-1 text-xs text-slate-500">{formatDate(note.created_at)}</p></article>
                                    ))}
                                </div>

                                <div className="mt-3">
                                    <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} rows={3} placeholder="Escribe una nota interna, acuerdo o siguiente paso" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-500" />
                                    <button onClick={addNote} disabled={savingNote || !noteDraft.trim()} className="mt-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{savingNote ? "Guardando..." : "Guardar nota"}</button>
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
