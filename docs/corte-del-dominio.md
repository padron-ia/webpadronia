# El corte: `padron-ia.es` pasa al sitio nuevo

> Preparado el 18-ago-2026. **Nada de esto se ejecuta solo**: es el guion para el día que
> Jesús diga. La web actual sigue intacta hasta el paso 4, y el paso 4 se deshace en un minuto.

## Qué cambia

| | Antes | Después |
|---|---|---|
| `padron-ia.es` | app Vite (SPA) servida con `vite preview` | sitio Astro estático servido con nginx |
| `portal.padron-ia.es` | no existe | la app Vite: portal de cliente y `/centro` |
| Portal dentro del bundle público | sí, cualquiera se descargaba el CRM | no: son dos servicios distintos |
| Cabeceras de seguridad | ninguna | HSTS, CSP, nosniff, Referrer-Policy, Permissions-Policy |
| Caché | `no-cache` en todo | `/_astro/` inmutable un año, HTML revalidado |
| Redirecciones 301 | imposibles | `/gimnasios`, `/entrenadores`, `/restaurantes` → `/` · `/gestorias` → `/despachos` |

## Antes de empezar

- El sitio compila: `cd sitio && npm run build` → 8 páginas.
- La app Vite compila: `npm run build` en la raíz.
- ⚠️ La configuración de nginx **no se ha podido probar en local** (no hay Docker en la
  máquina de Jesús). Se valida en el paso 2, antes de tocar el dominio.

## Los pasos, en orden

**1. DNS en Hostinger.**
Crear un registro para el subdominio del portal, apuntando al mismo sitio que el dominio:

```
Tipo: A     Nombre: portal     Valor: <misma IP que padron-ia.es>     TTL: 300
```

Comprobar antes de seguir:

```bash
nslookup portal.padron-ia.es 8.8.8.8
```

**2. Servicio nuevo en EasyPanel** (proyecto `nuevo`, nombre sugerido `sitio_padron_ia`):
- Fuente: el repo `padron-ia/webpadronia`, rama `master`, **carpeta de build `sitio/`**.
- Modo: Dockerfile (el que hay en `sitio/Dockerfile`).
- Dominio temporal: el `*.easypanel.host` que asigne el panel.

Verificar **en el dominio temporal**, sin tocar todavía el de verdad:

```bash
curl -I https://<temporal>.easypanel.host/            # 200, y mirar Cache-Control
curl -I https://<temporal>.easypanel.host/_astro/     # debe decir immutable
curl -sI https://<temporal>.easypanel.host/gimnasios  # 301 a /
curl -s  https://<temporal>.easypanel.host/ | grep -c "Almacén nocturno"   # el panel, ≥1
```

**3. El portal se muda.** En el servicio actual (`web_padron_ia`), añadir el dominio
`portal.padron-ia.es`. Comprobar que `https://portal.padron-ia.es/portal/login` carga.
La raíz de ese subdominio redirige sola al sitio nuevo: está resuelto por hostname en
`src/App.jsx`, así que funciona igual antes y después del corte.

**4. El corte.** En el servicio nuevo, añadir `padron-ia.es` y `www.padron-ia.es`; en el
antiguo, quitarlos. Es el único paso con efecto visible, y dura lo que tarde el router.

```bash
curl -sI https://padron-ia.es/ | head -3
curl -s  https://padron-ia.es/ | grep -o "<title>[^<]*"
curl -sI https://padron-ia.es/portal/login | grep -i location   # 301 al subdominio
```

**5. Después del corte.**
- Search Console: enviar `sitemap-index.xml` y retirar el `sitemap.xml` viejo.
- Comprobar que el fichero `google58eac17d1f5dfb06.html` sigue sirviéndose: **está en
  `public/` del sitio nuevo**, así que la verificación no se pierde. Confirmarlo igualmente.
- Umami: el mismo identificador de sitio sigue valiendo, no hay que tocar nada.
- El formulario nuevo apunta a `recados-sandy.vercel.app/api/lead`, que ya acepta el origen
  `https://padron-ia.es`.

## Cómo se deshace

Volver a poner `padron-ia.es` en el servicio antiguo y quitarlo del nuevo. Un minuto. La app
Vite no se ha tocado más que para la redirección por hostname, así que sigue sirviendo la
landing anterior tal cual.

## Lo que queda pendiente después

- Las tildes del vídeo (`Automatizacion`, `vende mas`) si se decide reutilizarlo.
- Los importes de la sección de precios, que hoy salen como `PENDIENTE €`.
- Los números reales de los tres casos.
- El panel en vivo puede pasar de «responde / no responde» a «qué han hecho»: eso requiere
  decidir qué cifra concreta se publica de cada cliente.
