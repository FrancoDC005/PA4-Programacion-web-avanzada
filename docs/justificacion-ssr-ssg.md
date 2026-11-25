# Justificación técnica de las estrategias de renderizado (Actividad 2)

La aplicación Next.js aplica una estrategia distinta por cada vista, según la
naturaleza de sus datos (Sesión 12: SSR vs. SSG vs. ISR).

## Resumen

| Vista | Estrategia | Mecanismo en el código | Motivo |
|---|---|---|---|
| `/` (Inicio) | **SSG** | `export const dynamic = "force-static"` + datos locales | Contenido informativo y estable, no depende del usuario |
| `/solicitudes` | **SSR** | `export const dynamic = "force-dynamic"` | El estado de las solicitudes cambia en cada petición |
| `/panel` | **SSR** | `force-dynamic` + validación de JWT en servidor | Contenido privado, personalizado por usuario |
| `/solicitudes/[codigo]` | **ISR** (SSG + revalidación) | `generateStaticParams` + `revalidate = 60` | Ruta dinámica: se pre-genera cada página y se refresca cada 60 s |
| `/login` | Dinámica | Lectura de cookie de sesión | Redirige al panel si ya hay sesión válida |

## 1. Inicio — Static Site Generation (SSG)

**Decisión:** generar la página una sola vez durante `next build`.

**Justificación:** la portada es informativa: presenta la plataforma, el resumen
del periodo y las estrategias de renderizado. No depende de la sesión ni de
datos que cambien minuto a minuto. Al generar HTML estático:

- el tiempo de respuesta es el mínimo posible (se sirve desde la CDN de Vercel);
- el SEO es óptimo porque el contenido ya está en el HTML inicial;
- el costo de cómputo es cero por visita.

Evidencia: en `docs/evidencias/build-next.txt` la ruta `/` aparece marcada como
`○ (Static)` y en `docs/evidencias/verificacion-rutas-next.txt` responde en
~8 ms.

## 2. Listado `/solicitudes` — Server Side Rendering (SSR)

**Decisión:** renderizar en el servidor en cada petición (`force-dynamic`).

**Justificación:** el estado de las solicitudes (Pendiente → En revisión →
Aprobada/Rechazada) cambia con el trabajo de la coordinación académica. Si se
sirviera estático, un estudiante vería estados desactualizados. Con SSR cada
visita recibe el estado real. Además, los filtros por estado llegan como
`searchParams` y se resuelven en el servidor, de modo que el HTML llega listo
para mostrarse (sin parpadeo de carga en el cliente).

Evidencia: la página imprime la fecha/hora de generación en cada petición, y el
build la marca como `ƒ (Dynamic)`.

## 3. Panel `/panel` — SSR + protección con middleware

**Decisión:** SSR con validación del JWT en el servidor, más `middleware.js`
que intercepta `/panel/:path*`.

**Justificación:** el panel muestra datos privados y personalizados. No puede
ser estático (depende del usuario). La protección ocurre antes de renderizar:
el middleware verifica la cookie httpOnly con `jose` y redirige a `/login` si no
hay sesión válida. Así el contenido protegido nunca se genera para un visitante
anónimo.

## 4. Ruta dinámica `/solicitudes/[codigo]` — ISR

**Decisión:** ruta dinámica con `generateStaticParams` (pre-genera las seis
páginas de solicitud en el build) y `revalidate = 60`.

**Justificación:** es el caso ideal de ISR (Incremental Static Regeneration):
el contenido de una solicitud concreta no cambia a cada segundo, pero sí puede
cambiar a lo largo del día. ISR entrega HTML estático (rápido, cacheado en CDN)
y regenera en segundo plano como máximo cada 60 segundos. Si se usara SSR puro,
cada visita costaría una ejecución de servidor; si se usara SSG puro sin
revalidación, el estado quedaría congelado desde el build.

Evidencia: el build lista las seis rutas pre-generadas
(`/solicitudes/SOL-2026-001` … `006`), marcadas como `● (SSG)`, y la ficha
muestra su fecha de render.

## 5. Comparación de rendimiento observada

Medición local con `next start` (ver `verificacion-rutas-next.txt`):

- `/` (SSG): ~0.009 s
- `/solicitudes` (SSR): ~0.033 s
- `/solicitudes/SOL-2026-002` (ISR): ~0.014 s

La página estática es la más rápida; la SSR es la más costosa, lo que confirma
que solo debe usarse cuando la frescura del dato lo justifica.
