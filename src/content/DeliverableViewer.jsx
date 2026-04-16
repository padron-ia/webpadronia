import { Suspense } from "react";
import registry from "./registry";

/**
 * Renderiza el contenido de un deliverable según su content_type y content_ref.
 *
 * - internal: busca en el registry y renderiza el componente React correspondiente
 * - external_url: muestra un botón para abrir en nueva pestaña
 * - iframe: embebe en un iframe
 * - file: enlace de descarga
 * - markdown: renderiza texto plano (futuro: usar react-markdown)
 */
export default function DeliverableViewer({ deliverable, onBack }) {
  if (!deliverable) return null;

  const { content_type, content_ref, title } = deliverable;

  return (
    <div className="grid gap-4">
      <button onClick={onBack} className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 hover:text-slate-900 justify-self-start">
        ← Volver a entregables
      </button>

      {content_type === "internal" ? (
        <InternalContent contentRef={content_ref} title={title} />
      ) : content_type === "external_url" ? (
        <ExternalContent url={content_ref} title={title} />
      ) : content_type === "iframe" ? (
        <IframeContent url={content_ref} title={title} />
      ) : content_type === "file" ? (
        <FileContent url={content_ref} title={title} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">Tipo de contenido no soportado: {content_type}</p>
        </div>
      )}
    </div>
  );
}

function InternalContent({ contentRef, title }) {
  const Component = registry[contentRef];

  if (!Component) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-lg font-semibold text-amber-900">Contenido en desarrollo</p>
        <p className="mt-2 text-sm text-amber-700">
          El entregable "{title}" está registrado pero su contenido aún no se ha migrado al portal.
          <br />Referencia: <code className="bg-amber-100 px-1 rounded">{contentRef}</code>
        </p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-500">Cargando contenido…</p>
        </div>
      }
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <Component />
      </div>
    </Suspense>
  );
}

function ExternalContent({ url, title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <p className="text-2xl mb-3">🔗</p>
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-600">Este entregable está alojado externamente.</p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
        Abrir en nueva pestaña →
      </a>
    </div>
  );
}

function IframeContent({ url, title }) {
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-600">{title}</p>
      </div>
      <iframe src={url} className="w-full min-h-[80vh] border-none" title={title} />
    </div>
  );
}

function FileContent({ url, title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <p className="text-2xl mb-3">📥</p>
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-600">Archivo disponible para descarga.</p>
      <a href={url} download className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
        Descargar archivo ↓
      </a>
    </div>
  );
}
