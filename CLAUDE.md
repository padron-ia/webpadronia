# CLAUDE.md — Guía rápida del repo Padrón IA

Notas para agentes (Claude Code, Copilot, etc.) trabajando en este proyecto.

## Stack

- **Frontend:** Vite + React (JSX, no TypeScript)
- **Backend:** Supabase (Postgres + RLS + Auth + Storage)
- **Hosting:** ver `vercel.json` / deploy manual
- **Scripts:** `npm run dev` (Vite dev), `npm run build` (genera `dist/`)

## Convenciones críticas

### 1. Entregables del portal (deliverables)

Cada entregable vive en la tabla `public.deliverables` y se renderiza según su `content_type`:

- `internal` — componente React registrado en [src/content/registry.js](src/content/registry.js). El `content_ref` es la key del registry (ej. `ofm-health/checklist-accesos-odile`).
- `external_url` — link externo
- `iframe` — embed
- `file` — descarga directa
- **NO existe `markdown`** — si se usa, el viewer muestra "Tipo de contenido no soportado".

**Flujo para añadir un deliverable interno:**

1. Crear componente en `src/content/deliverables/<cliente>/<Nombre>.jsx` usando `ContentLayout`, `Section`, `Callout` de `src/content/components/ContentBlocks`.
2. Registrarlo en `src/content/registry.js` con una key estable (`<cliente>/<slug>`).
3. Insertar el row en `public.deliverables` con `content_type='internal'` y `content_ref` = la key del registry.
4. **Ejecutar `npm run build`** — el registry se bundlea, no basta con editar el fichero. En dev basta con recargar (Vite HMR); en producción hay que desplegar el `dist/`.

### 2. Storage bucket

- Bucket único: `client-files` (privado).
- Convención de path: `projects/<project_id>/<filename>`.
- Registro en `public.documents` con `file_url` = path relativo (no URL completa).
- `client_visible=false` para material interno, `true` para material que ve el cliente desde el portal.

### 3. Multi-cliente (single-tenant por company)

- Toda la data está scoped por `company_id`. Los clientes solo ven su company.
- Visibilidad del cliente controlada con el flag `client_visible` en `deliverables` y `documents`.
- Briefings internos y checklists operativas → siempre `client_visible=false`.

### 4. Seguridad y secretos

- `.env.local` contiene claves públicas (`VITE_*`). **Nunca commitear claves privadas** (`SUPABASE_SERVICE_ROLE_KEY`, tokens API).
- Si se necesita una key privada para un script temporal, añadirla, usar, borrar.

### 5. Schema

- Esquema maestro: [supabase/schema.sql](supabase/schema.sql).
- Migraciones ad-hoc vía SQL directo (MCP Supabase) para cambios pequeños. Para cambios estructurales, actualizar también `schema.sql`.

## Proyectos internos activos

- **OFM Health — Auditoría Digital Integral** (`company_id=8973e2b5…`, `project_id=aba5fb4f…`): SEO + seguridad + RGPD/LSSI + análisis competitivo + prototipo test de perfil.
- **Padrón IA — KPI Command Center** (`company_id=391094e4…`, `project_id=ed1f99ed…`): producto interno para vender a clientes high-ticket. Basado en PRD público de Nicolás Sosa adaptado con capa IA propia. Ubicación código: `C:/Users/jmart/Desktop/KPI Command Center/`.

## Errores recurrentes a evitar

- Usar `content_type='markdown'` en deliverables (no soportado, usar `internal` con componente o subir el `.md` como documento).
- Olvidar el `npm run build` tras editar `registry.js`.
- Confundir rutas: documentos van a `projects/<project_id>/...` siempre, no a `company/<company_id>/...`.
- Subir archivos a Storage sin crear el row correspondiente en `public.documents` (no aparece en el CRM).
