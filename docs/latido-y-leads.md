# Cómo llega un lead y por qué la base no se pausa

> 18-ago-2026. Nace de la auditoría de la web (ver el OS:
> `clients/_personal/padron-ia/projects/web-rework/2026-08-18-auditoria-web-completa.md`).

## El problema que resuelve

Hasta hoy el formulario escribía **solo** en Supabase. Con el proyecto pausado por
inactividad (plan free), cada envío acababa en el `localStorage` del visitante y
nadie se enteraba. Cero avisos, cero rastro.

## Cómo funciona ahora

1. El formulario (`src/lib/leadService.js`) hace POST a **`/api/lead`** de un servicio
   aparte: proyecto Vercel `recados` (`https://recados-sandy.vercel.app`).
2. Ese servicio **manda el correo primero** (Resend) y **después** guarda la fila en
   `leads`. Si Supabase está caído o pausado, el correo sale igual: el lead no se pierde.
3. Si el servicio no responde, la web cae al plan B: escribir directa en Supabase.
4. Si fallan los dos, el formulario lo dice claro y ofrece WhatsApp. Nunca finge éxito.

## El latido diario

- Supabase pausa los proyectos free que pasan **7 días sin actividad de usuario**.
- El cron de Vercel llama a **`/api/latido`** una vez al día (07:00 UTC) y este ejecuta
  `fn_latido()` en la base.
- `fn_latido()` actualiza la fila única de `public.latido`. La tabla tiene RLS y **cero
  políticas**: nadie la toca directamente. La función es `SECURITY DEFINER`, no acepta
  nada más que un texto de origen y solo devuelve su marca de tiempo.
- **Si el latido falla, manda un correo.** El vigilante corre en Vercel, fuera de
  Supabase y fuera del VPS: un corte de cualquiera de los dos no deja mudo al que avisa.

## Comprobar que sigue vivo

```sql
select ultimo, origen, now() - ultimo as hace from public.latido;
```

Si `hace` pasa de dos días, el cron está muerto y el proyecto va camino de pausarse.

## Variables de entorno del servicio `recados`

`RESEND_API_KEY` · `RESEND_FROM` · `LEAD_TO` · `SUPABASE_URL` · `SUPABASE_ANON_KEY`.

El código del servicio vive en `servicios/recados/`. Se despliega con
`npx vercel deploy --prod --yes` desde una copia de esa carpeta.

⚠️ **La clave está guardada en Vercel con el nombre `Resend`**, no `RESEND_API_KEY`: se creó
así y Vercel no deja renombrar las variables marcadas "Sensitive" ni leer su valor. El código
acepta los dos nombres. Al rotar la clave: crearla como `RESEND_API_KEY`, borrar la vieja y
quitar el alias de `api/lead.js` y `api/latido.js`.

**Verificado el 18-ago de extremo a extremo**: formulario en padron-ia.es → servicio → correo
`Delivered` en la bandeja + fila en `leads`. Las filas de prueba se borraron.
