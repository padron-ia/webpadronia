import { lazy } from "react";

/**
 * Registry de contenido interno para deliverables.
 *
 * Mapea content_ref (string guardado en la BD) → componente React (lazy-loaded).
 * Al añadir un nuevo deliverable con content_type = "internal", registra aquí
 * su content_ref y el import dinámico correspondiente.
 */
const registry = {
  // ===== OFM Health — Auditoría Digital Integral =====
  "ofm-health/auditoria-seo": lazy(() => import("./deliverables/ofm-health/AuditoriaSEO")),
  "ofm-health/auditoria-seguridad": lazy(() => import("./deliverables/ofm-health/AuditoriaSeguridad")),
  "ofm-health/analisis-competitivo": lazy(() => import("./deliverables/ofm-health/AnalisisCompetitivo")),
  "ofm-health/ventaja-uapo": lazy(() => import("./deliverables/ofm-health/VentajaUAPO")),
  "ofm-health/vision-ofm-care": lazy(() => import("./deliverables/ofm-health/VisionOFMCare")),
  "ofm-health/marco-legal": lazy(() => import("./deliverables/ofm-health/MarcoLegal")),
  "ofm-health/proximos-pasos": lazy(() => import("./deliverables/ofm-health/ProximosPasos")),
  "ofm-health/test-perfil-quiz": lazy(() => import("./prototypes/ofm-health/TestPerfilQuiz"))
};

export default registry;
