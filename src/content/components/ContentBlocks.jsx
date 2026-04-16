/**
 * Bloques reutilizables para páginas de contenido de deliverables.
 * Se usan dentro de las páginas de auditoría, informes, etc.
 */

export function ContentLayout({ title, subtitle, children }) {
  return (
    <article className="grid gap-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-2 text-base text-slate-600 max-w-3xl">{subtitle}</p> : null}
      </header>
      {children}
    </article>
  );
}

export function Section({ title, children }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">{title}</h2>
      {children}
    </section>
  );
}

export function Finding({ title, severity = "media", effort = null, impact = null, children }) {
  const sevColor = {
    alta: "bg-red-100 text-red-800 border-red-300",
    media: "bg-amber-100 text-amber-800 border-amber-300",
    baja: "bg-emerald-100 text-emerald-800 border-emerald-300"
  };
  const borderColor = { alta: "border-l-red-500", media: "border-l-amber-500", baja: "border-l-emerald-500" };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 border-l-4 ${borderColor[severity]}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="flex gap-2 flex-wrap">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${sevColor[severity]}`}>
            {severity === "alta" ? "Severidad alta" : severity === "media" ? "Severidad media" : "Severidad baja"}
          </span>
          {effort ? <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">Esfuerzo {effort}</span> : null}
          {impact ? <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">Impacto {impact}</span> : null}
        </div>
      </div>
      <div className="grid gap-3 text-sm text-slate-700 leading-relaxed">{children}</div>
    </div>
  );
}

export function Callout({ type = "info", title, children }) {
  const styles = {
    info: "bg-sky-50 border-l-sky-500 text-sky-900",
    warn: "bg-amber-50 border-l-amber-500 text-amber-900",
    danger: "bg-red-50 border-l-red-500 text-red-900",
    success: "bg-emerald-50 border-l-emerald-500 text-emerald-900",
    gold: "bg-amber-50/50 border-l-amber-400 text-amber-900"
  };
  return (
    <div className={`rounded-r-xl border-l-4 px-4 py-3 ${styles[type]}`}>
      {title ? <p className="font-semibold text-sm mb-1">{title}</p> : null}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function DataTable({ headers, rows, highlight }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-800 text-white text-xs uppercase tracking-wider">
          <tr>{headers.map((h, i) => <th key={i} className="px-4 py-2.5">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={`border-t border-slate-200 ${ri === highlight ? "bg-emerald-50 font-semibold" : ri % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
              {row.map((cell, ci) => <td key={ci} className="px-4 py-2.5" dangerouslySetInnerHTML={typeof cell === "string" && cell.includes("<") ? { __html: cell } : undefined}>{typeof cell === "string" && cell.includes("<") ? undefined : cell}</td>)}
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
      {label ? <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p> : null}
      <pre className="rounded-xl bg-slate-900 text-emerald-300 px-4 py-3 text-sm overflow-x-auto leading-relaxed whitespace-pre-wrap">{children}</pre>
    </div>
  );
}

export function MockupComparison({ beforeTitle = "Antes", afterTitle = "Después", before, after }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border-2 border-red-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2">{beforeTitle}</p>
        <div className="text-sm text-slate-700 font-mono leading-relaxed">{before}</div>
      </div>
      <div className="rounded-xl border-2 border-emerald-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">{afterTitle}</p>
        <div className="text-sm text-slate-700 font-mono leading-relaxed">{after}</div>
      </div>
    </div>
  );
}

export function CheckList({ items, type = "check" }) {
  const icon = type === "check" ? "✓" : "✗";
  const color = type === "check" ? "text-emerald-600" : "text-red-500";
  return (
    <ul className="grid gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
          <span className={`font-bold shrink-0 mt-0.5 ${color}`}>{icon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function StatGrid({ items }) {
  return (
    <div className={`grid gap-3 grid-cols-2 md:grid-cols-${Math.min(items.length, 4)}`}>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{item.value}</p>
          {item.detail ? <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p> : null}
        </div>
      ))}
    </div>
  );
}
