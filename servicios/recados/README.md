# padron-ia-recados

Dos funciones sueltas que sostienen la web de Padrón IA sin depender de ella:

- `POST /api/lead` — recibe el formulario de padron-ia.es, **manda el correo primero**
  (canal independiente de Supabase) y guarda la fila en `leads` como secundaria.
  Si el correo sale, el lead está a salvo aunque la base esté caída o pausada.
- `GET /api/latido` — cron diario (07:00 UTC) que llama a `fn_latido()` en Supabase para que
  el plan free no pause el proyecto. Si falla, **avisa por correo**: el vigilante no cae mudo.

Variables de entorno: `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_TO`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

> Nota: la clave vive en Vercel como `Resend` (alias heredado; las variables "Sensitive"
> no se pueden renombrar). El codigo acepta `RESEND_API_KEY` y `Resend`. Al rotar la clave,
> crearla como `RESEND_API_KEY` y quitar el alias.
