import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { resolveRole } from "../lib/portalAuth";
import { getProject } from "../lib/projectsService";
import { listDeliverablesByProject } from "../lib/deliverablesService";
import registry from "../content/registry";

export default function PresenterPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(null);
  const [project, setProject] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const containerRef = useRef(null);

  // --- Auth guard: solo admin ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) { setAuthorized(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (mounted) setAuthorized(false); return; }
      const role = await resolveRole(user);
      if (mounted) setAuthorized(role === "admin");
    })();
    return () => { mounted = false; };
  }, []);

  // --- Carga proyecto + deliverables ---
  useEffect(() => {
    if (!authorized || !projectId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [p, d] = await Promise.all([
          getProject(projectId),
          listDeliverablesByProject(projectId)
        ]);
        if (!mounted) return;
        setProject(p);
        setDeliverables(d.filter((item) => item.content_type === "internal" && registry[item.content_ref]));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [authorized, projectId]);

  const total = deliverables.length;
  const active = deliverables[current];

  const go = (delta) => {
    setCurrent((c) => {
      const next = c + delta;
      if (next < 0 || next >= total) return c;
      return next;
    });
  };

  const toggleFullscreen = () => {
    const el = containerRef.current || document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // --- Keyboard ---
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      else if (e.key === "Home") { e.preventDefault(); setCurrent(0); }
      else if (e.key === "End") { e.preventDefault(); setCurrent(total - 1); }
      else if (e.key === "f" || e.key === "F") { toggleFullscreen(); }
      else if (e.key === "i" || e.key === "I") { setIndexOpen((v) => !v); }
      else if (e.key === "Escape") {
        if (document.fullscreenElement) document.exitFullscreen?.();
        else if (indexOpen) setIndexOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, indexOpen]);

  // Reset al cambiar de slide, scroll al top
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [current]);

  // --- Render ---
  if (authorized === null) return <FullScreenMessage>Verificando acceso…</FullScreenMessage>;
  if (authorized === false) return (
    <FullScreenMessage>
      Acceso solo para administradores.
      <button onClick={() => navigate("/portal/login")} className="mt-4 rounded-full bg-stone-900 px-6 py-2 text-sm font-semibold text-white">Ir a login</button>
    </FullScreenMessage>
  );
  if (loading) return <FullScreenMessage>Cargando presentación…</FullScreenMessage>;
  if (!project) return <FullScreenMessage>Proyecto no encontrado.</FullScreenMessage>;
  if (total === 0) return (
    <FullScreenMessage>
      No hay deliverables internos renderizables en este proyecto.
      <button onClick={() => navigate("/portal/admin")} className="mt-4 rounded-full bg-stone-900 px-6 py-2 text-sm font-semibold text-white">Volver al panel</button>
    </FullScreenMessage>
  );

  const Component = registry[active.content_ref];
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#F2F0E9" }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-3 border-b border-stone-200 bg-white/70 backdrop-blur">
        <button onClick={() => navigate(`/portal/admin?project=${projectId}`)} className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-500 hover:text-stone-900">
          ← Salir
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 truncate">Modo presentación · {project.title}</p>
          <p className="text-sm font-semibold text-stone-900 truncate">{active.title}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-stone-500 tabular-nums">{current + 1} / {total}</span>
          <button onClick={() => setIndexOpen((v) => !v)} title="Índice (I)"
            className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100">
            Índice
          </button>
          <button onClick={toggleFullscreen} title="Pantalla completa (F)"
            className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100">
            ⛶
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-stone-200">
        <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: "#2E4036" }} />
      </div>

      {/* Slide content */}
      <main ref={containerRef} className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Suspense fallback={<p className="text-sm text-stone-500 text-center py-12">Cargando…</p>}>
            <Component />
          </Suspense>
        </div>
      </main>

      {/* Footer nav */}
      <footer className="flex items-center justify-between px-6 py-3 border-t border-stone-200 bg-white/70 backdrop-blur">
        <button onClick={() => go(-1)} disabled={current === 0}
          className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-semibold text-stone-700 disabled:opacity-30 hover:bg-stone-100">
          ← Anterior
        </button>
        <p className="text-[10px] text-stone-400 hidden sm:block">
          ← / → navegar · F pantalla completa · I índice · Esc salir fullscreen
        </p>
        <button onClick={() => go(1)} disabled={current === total - 1}
          className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-30 hover:bg-stone-800">
          Siguiente →
        </button>
      </footer>

      {/* Index drawer */}
      {indexOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-stone-900/30" onClick={() => setIndexOpen(false)} />
          <aside className="relative w-full max-w-sm bg-white shadow-2xl overflow-auto">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">Índice</p>
              <button onClick={() => setIndexOpen(false)} className="text-stone-500 hover:text-stone-900 text-xl leading-none">×</button>
            </div>
            <ul className="p-3">
              {deliverables.map((d, i) => (
                <li key={d.id}>
                  <button
                    onClick={() => { setCurrent(i); setIndexOpen(false); }}
                    className={`w-full text-left rounded-xl px-3 py-2.5 text-sm transition ${i === current ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"}`}>
                    <span className="text-xs font-bold opacity-60 mr-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {d.title}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function FullScreenMessage({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center p-8" style={{ background: "#F2F0E9" }}>
      <div className="text-sm text-stone-600 max-w-md">{children}</div>
    </div>
  );
}
