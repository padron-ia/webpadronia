/**
 * Bloques de contenido premium para deliverables.
 * Diseñados para transmitir calidad editorial, no informe técnico.
 * Paleta: moss-green #2E4036, cream #F2F0E9, coal #1A1A1A
 */

const MOSS = "#2E4036";
const CREAM = "#F2F0E9";

export function ContentLayout({ title, subtitle, children }) {
  return (
    <article className="grid gap-8 max-w-4xl mx-auto">
      {/* Hero header editorial */}
      <header className="rounded-2xl p-8 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${MOSS}, #3d5549)` }}>
        <div className="absolute top-0 right-0 w-72 h-72 opacity-[0.08]" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(40%, -40%)" }} />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{title}</h1>
          {subtitle ? <p className="mt-3 text-sm leading-relaxed opacity-85 max-w-2xl">{subtitle}</p> : null}
        </div>
      </header>
      {children}
    </article>
  );
}

export function Section({ title, children }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: MOSS }}>{title}</h2>
      {children}
    </section>
  );
}

export function Finding({ title, severity = "media", effort = null, impact = null, children }) {
  const config = {
    alta:  { border: "#dc2626", bg: "#fef2f2", badge: "bg-red-600 text-white",    label: "Alta" },
    media: { border: "#d97706", bg: "#fffbeb", badge: "bg-amber-500 text-white",   label: "Media" },
    baja:  { border: "#059669", bg: "#ecfdf5", badge: "bg-emerald-600 text-white",  label: "Baja" }
  };
  const c = config[severity];

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-stone-200/60">
      {/* Color bar top */}
      <div className="h-1" style={{ backgroundColor: c.border }} />
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold text-stone-900 flex-1">{title}</h3>
          <div className="flex gap-1.5 flex-wrap shrink-0">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${c.badge}`}>{c.label}</span>
            {effort ? <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600">Esfuerzo {effort}</span> : null}
            {impact ? <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: MOSS }}>Impacto {impact}</span> : null}
          </div>
        </div>
        <div className="grid gap-4 text-sm text-stone-700 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function Callout({ type = "info", title, children }) {
  const styles = {
    info:    { bg: "#f0f9ff", border: "#0284c7", icon: "💡", text: "#0c4a6e" },
    warn:    { bg: "#fffbeb", border: "#d97706", icon: "⚠️", text: "#78350f" },
    danger:  { bg: "#fef2f2", border: "#dc2626", icon: "🚨", text: "#7f1d1d" },
    success: { bg: "#ecfdf5", border: "#059669", icon: "✅", text: "#064e3b" },
    gold:    { bg: "#fefce8", border: "#ca8a04", icon: "💎", text: "#713f12" }
  };
  const s = styles[type];
  return (
    <div className="flex gap-4 rounded-xl p-4 border-l-4" style={{ backgroundColor: s.bg, borderLeftColor: s.border }}>
      <span className="text-xl shrink-0 mt-0.5">{s.icon}</span>
      <div className="flex-1 min-w-0">
        {title ? <p className="font-bold text-sm mb-1" style={{ color: s.text }}>{title}</p> : null}
        <div className="text-sm leading-relaxed" style={{ color: s.text }}>{children}</div>
      </div>
    </div>
  );
}

export function DataTable({ headers, rows, highlight }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200/60 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead>
          <tr style={{ backgroundColor: MOSS }}>
            {headers.map((h, i) => <th key={i} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={`border-t border-stone-100 ${ri === highlight ? "font-semibold" : ""}`}
                style={ri === highlight ? { backgroundColor: "#2E403612" } : ri % 2 === 0 ? {} : { backgroundColor: "#fafaf8" }}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3"
                    dangerouslySetInnerHTML={typeof cell === "string" && cell.includes("<") ? { __html: cell } : undefined}>
                  {typeof cell === "string" && cell.includes("<") ? undefined : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock({ children, label }) {
  return (
    <div>
      {label ? <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">{label}</p> : null}
      <pre className="rounded-xl p-4 text-sm overflow-x-auto leading-relaxed whitespace-pre-wrap border border-stone-800/10"
           style={{ backgroundColor: "#1a1a1a", color: "#a7f3d0" }}>
        {children}
      </pre>
    </div>
  );
}

export function MockupComparison({ beforeTitle = "Ahora", afterTitle = "Propuesta", before, after }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl overflow-hidden shadow-sm border-2 border-red-200">
        <div className="px-4 py-2 flex items-center gap-2 bg-red-50 border-b border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-600">{beforeTitle}</p>
        </div>
        <div className="p-4 bg-white text-sm text-stone-700">{before}</div>
      </div>
      <div className="rounded-xl overflow-hidden shadow-sm border-2 border-emerald-200">
        <div className="px-4 py-2 flex items-center gap-2 bg-emerald-50 border-b border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">{afterTitle}</p>
        </div>
        <div className="p-4 bg-white text-sm text-stone-700">{after}</div>
      </div>
    </div>
  );
}

export function CheckList({ items, type = "check" }) {
  const isCheck = type === "check";
  return (
    <ul className="grid gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
            isCheck ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
          }`}>
            {isCheck ? "✓" : "✗"}
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function StatGrid({ items }) {
  return (
    <div className={`grid gap-3 ${items.length <= 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl bg-white border border-stone-200/60 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-stone-900">{item.value}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400 mt-1">{item.label}</p>
          {item.detail ? <p className="text-[11px] text-stone-500 mt-0.5">{item.detail}</p> : null}
        </div>
      ))}
    </div>
  );
}
