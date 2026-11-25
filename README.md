# PA4 — Plataforma de Gestión de Solicitudes Académicas

**Programación Web II (30690) · ISIL · Periodo 202620 · Sesiones 11–13 · Ponderación 15 %**

Proyecto de la **PA4 — Proceso de Aprendizaje 4** del curso Programación Web II.
Continúa el caso práctico **"Plataforma de Gestión de Solicitudes Académicas"**
integrando el frontend con la API de Node.js (JWT), una implementación en
Next.js con SSR/SSG y ruta dinámica, el despliegue en Vercel y la preparación
del proyecto para producción (minificación, Webpack/Babel, variables de entorno
y logs/monitoreo).

---

## Integrantes y participación

| # | Integrante | Rol (según la consigna) | Participación |
|---|---|---|---|
| 1 | **Franco Andrés Díaz Carreal** | React, API y JWT — Backend de integración | Implementó y documentó la integración de React con la API de Node.js (Fetch/Axios), la autenticación JWT, la gestión de sesiones con almacenamiento seguro (`sessionStorage` + interceptor), la validación de respuestas y el manejo de errores de conexión y autenticación. Desarrolló los endpoints de autenticación y solicitudes del backend Express. |
| 2 | **Rodrigo Adrián Salas Sandoval** | Next.js y Vercel — Desarrollo y despliegue | Implementó la aplicación Next.js (App Router): páginas con SSG (`/`) y SSR (`/solicitudes`, `/panel`), la ruta dinámica `/solicitudes/[codigo]` con `generateStaticParams` e ISR, y la justificación técnica SSR/SSG. Coordinó el despliegue del frontend en Vercel y la verificación de las rutas publicadas. |
| 3 | **Angel Fernando Reyes Moreno** | Producción y documentación — Configuración y entrega | Configuró la minificación y optimización (Webpack + Babel + Terser en el backend, `next.config.js` con `removeConsole` y `splitChunks`), revisó la configuración de Webpack/Babel, definió las variables de entorno de los tres proyectos, implementó los logs estructurados y el monitoreo (`/api/health`, `window.onerror`), organizó el repositorio y elaboró este README y la documentación de evidencias. Coordinó la grabación y publicación del video en YouTube. |

---

## Descripción

La **Plataforma de Gestión de Solicitudes Académicas** permite a los
estudiantes consultar el estado de sus solicitudes (becas, convalidaciones,
certificados, matrículas, cambios de sección y tutorías), autenticarse con JWT
y acceder a un panel privado con métricas y el detalle de cada solicitud.

El repositorio contiene **tres proyectos** que cubren las tres actividades
técnicas de la PA4:

| Carpeta | Proyecto | Actividad que evidencia |
|---|---|---|
| `backend/` | API REST con Node.js + Express, JWT, logs estructurados, build de producción con Webpack/Babel | Actividad 1 (y soporte de producción) |
| `frontend/` | SPA en **React + Vite** con Axios, JWT, gestión de sesión, validación de respuestas y monitoreo | **Actividad 1: Consumo de APIs y manejo de sesiones en React** |
| `next-app/` | Aplicación **Next.js (App Router)** con SSG, SSR, ruta dinámica con ISR, autenticación con cookie httpOnly y middleware | **Actividades 2 y 3: SSR/SSG, rutas dinámicas y despliegue en Vercel** |

La preparación para producción (**Actividad 4**) se aplica de forma transversal
a los tres proyectos y se documenta en [`docs/produccion.md`](docs/produccion.md).

---

## Objetivo

Evidenciar la integración de APIs y sesiones JWT en React, la optimización
mediante Next.js con SSR/SSG y rutas dinámicas, el despliegue en Vercel y la
preparación del código para producción con minificación, Webpack/Babel,
variables de entorno, logs y monitoreo, según lo trabajado en las sesiones 11 a
13 del curso.

Objetivos específicos:

1. Consumir una API REST desde React con Axios, validando respuestas y manejando
   errores de red y de autenticación.
2. Implementar autenticación JWT y una estrategia de sesión y almacenamiento
   acorde con la sesión 11.
3. Aplicar SSG, SSR e ISR donde la naturaleza de cada vista lo justifica, con al
   menos una ruta dinámica.
4. Desplegar el frontend en Vercel y verificar las rutas publicadas.
5. Preparar la aplicación para producción: minificación, Webpack/Babel,
   variables de entorno y evidencias de logs/monitoreo.

---

## Desarrollo

### Arquitectura general

```
┌──────────────────────┐      HTTPS/JSON       ┌──────────────────────┐
│  SPA React (Vite)    │ ────────────────────▶ │  API Node.js/Express │
│  · Axios + JWT       │   Authorization:      │  · /api/auth/*       │
│  · sessionStorage    │   Bearer <token>      │  · /api/solicitudes  │
│  · logger + onerror  │                       │  · logger JSON       │
└──────────────────────┘                       │  · Webpack/Babel     │
                                               └──────────────────────┘
┌──────────────────────┐      fetch server-side      ▲
│  Next.js (Vercel)    │ ────────────────────────────┘ (opcional: API_URL)
│  · /  (SSG)          │   si el backend no responde, Next.js usa el
│  · /solicitudes (SSR)│   dataset semilla de lib/datos.js como respaldo
│  · /solicitudes/[c]  │
│  · /panel (SSR+JWT)  │   Sesión: cookie httpOnly firmada con jose
│  · /login            │
└──────────────────────┘
```

### Tecnologías

- **Backend:** Node.js 22, Express 5, bcryptjs, jsonwebtoken, dotenv, CORS,
  Webpack 5, Babel y Terser para el build de producción.
- **Frontend React:** React 19, Vite 8, Axios (interceptores), CSS propio sin
  dependencias de UI.
- **Next.js:** Next.js 15 (App Router), React 19, `jose` (JWT en el Edge),
  bcryptjs, middleware de protección de rutas.
- **Despliegue:** Vercel (frontend Next.js).

### Sesiones evaluadas y su relación con el código

| Sesión | Contenido | Dónde se aplica |
|---|---|---|
| 11 | Fetch/Axios, manejo de errores, validación de respuestas, JWT en React, gestión de sesiones y almacenamiento seguro | `frontend/src/api/*`, `frontend/src/utils/validarRespuesta.js`, `frontend/src/utils/logger.js`, `backend/controllers/*`, `next-app/lib/sesion.js` (cookie httpOnly) |
| 12 | Next.js, SSR vs. SSG, rutas dinámicas, despliegue en Vercel | `next-app/app/**` y [`docs/justificacion-ssr-ssg.md`](docs/justificacion-ssr-ssg.md) |
| 13 | Minificación/optimización, Webpack/Babel, variables de entorno, logs y monitoreo | `backend/webpack.config.js`, `backend/.babelrc`, `next-app/next.config.js`, `.env.example` de cada proyecto, `*/logger.js`, `/api/health` y [`docs/produccion.md`](docs/produccion.md) |

### Actividad 1 — Consumo de APIs y manejo de sesiones en React (3 pts)

Implementado en `frontend/`:

- **Axios con interceptores** (`src/api/axios.js`): adjunta automáticamente el
  JWT en `Authorization: Bearer`, registra cada petición y detecta sesión
  expirada (`401`) y errores de red.
- **Validación de respuestas** (`src/utils/validarRespuesta.js`): comprueba que
  la respuesta tenga la estructura esperada antes de usarla.
- **Manejo de errores** (`src/api/*Service.js`): distingue error del servidor
  (`error.response`), error de red (`error.request`) y errores de validación,
  mostrando un mensaje claro en la interfaz.
- **Sesión JWT** (`src/App.jsx`): inicio de sesión y registro; el token y el
  usuario se guardan en `sessionStorage`; al recargar se valida el token contra
  `/api/auth/perfil`; un evento `sesion-expirada` limpia la sesión ante un 401.
- **Funcionalidad demostrada:** listar solicitudes con filtros por estado,
  consultar el detalle, crear una solicitud autenticada y cerrar sesión.

Además, la app Next.js implementa una variante de mayor seguridad para la
sesión: el JWT viaja en una **cookie httpOnly**, `sameSite=lax` y `secure` en
producción (ver `lib/sesion.js`), de modo que JavaScript del navegador no puede
leer el token (mitigación de XSS). El panel se protege con `middleware.js`.

### Actividad 2 — Optimización con Next.js: SSR, SSG y rutas dinámicas (3 pts)

Implementado en `next-app/` con App Router. La justificación completa está en
[`docs/justificacion-ssr-ssg.md`](docs/justificacion-ssr-ssg.md) y se resume así:

| Vista | Estrategia | Implementación |
|---|---|---|
| `/` | **SSG** | `dynamic = "force-static"`; portada informativa que no depende de la sesión ni de datos remotos |
| `/solicitudes` | **SSR** | `dynamic = "force-dynamic"`; el estado de las solicitudes cambia por petición |
| `/panel` | **SSR** | `force-dynamic` + sesión validada en servidor; contenido privado y personalizado |
| `/solicitudes/[codigo]` | **ISR** | `generateStaticParams` + `revalidate = 60`; ruta dinámica pre-generada y refrescada en segundo plano |

Las tres estrategias aparecen marcadas en el build (`○ Static`, `ƒ Dynamic`,
`● SSG`) en [`docs/evidencias/build-next.txt`](docs/evidencias/build-next.txt).

### Actividad 3 — Despliegue del frontend en Vercel (3 pts)

El proyecto `next-app/` se despliega en Vercel con:

- **Root Directory:** `next-app`
- **Framework:** Next.js (detectado automáticamente)
- **Variable de entorno:** `JWT_SECRET` en *Settings → Environment Variables*
  (Production y Preview). `API_URL` es opcional; si no se configura, la app usa
  el dataset semilla, tal como se explica en "Cómo ejecutar".

La URL pública y la verificación de rutas se documentan al final de este README
en la sección **Evidencias** y en
[`docs/evidencias/verificacion-rutas-next.txt`](docs/evidencias/verificacion-rutas-next.txt).

### Actividad 4 — Preparación para producción (3 pts)

Resumen (detalle y evidencia en [`docs/produccion.md`](docs/produccion.md)):

- **Minificación:** Terser en el build del backend (`webpack.config.js`), Vite
  en el frontend y `removeConsole` + Terser en Next.js.
- **Webpack/Babel:** `webpack.config.js` + `.babelrc` en el backend;
  `splitChunks` personalizado en `next.config.js`; pipeline ES modules de Vite.
- **Variables de entorno:** `.env.example` en los tres proyectos; ningún `.env`
  real se versiona.
- **Logs y monitoreo:** loggers JSON con niveles en backend y Next.js,
  middleware de peticiones, `/api/health`, `window.onerror` +
  `unhandledrejection` en React.

---

## Cómo ejecutar o revisar

### Requisitos previos

- Node.js 22 o superior y npm.
- Los comandos se ejecutan desde la raíz del repositorio.

### 1. Backend (API Node.js)

```bash
cd backend
cp .env.example .env          # ajustar JWT_SECRET
npm install
npm run dev                   # http://localhost:3000
```

El servidor siembra dos usuarios de demostración al arrancar:

- `estudiante@isil.edu.pe` / `Demo123`
- `admin@isil.edu.pe` / `Admin123`

Verificación automatizada de la API (13 pruebas):

```bash
npm run verify:api
```

Build de producción (Webpack + Babel + Terser):

```bash
npm run build                 # genera dist/server.js
npm run preview               # ejecuta el bundle minificado
```

### 2. Frontend React (SPA, Actividad 1)

```bash
cd frontend
cp .env.example .env.development
npm install
npm run dev                   # http://localhost:5173
```

Con el backend encendido, iniciar sesión con el usuario demo y probar el
listado, los filtros, el detalle y la creación de solicitudes.

Build de producción:

```bash
npm run build                 # genera dist/
npm run preview
```

### 3. Aplicación Next.js (Actividades 2 y 3)

```bash
cd next-app
cp .env.example .env.local    # opcional: API_URL y JWT_SECRET
npm install
npm run dev                   # http://localhost:3001
npm run build && npm start    # build y ejecución de producción
```

Por defecto usa el dataset semilla (`lib/datos.js`). Si el backend del paso 1
está encendido y se define `API_URL=http://localhost:3000` en `.env.local`, las
vistas consultan la API real.

### 4. Despliegue en Vercel

1. Importar el repositorio en Vercel.
2. Configurar **Root Directory** = `next-app`.
3. Añadir `JWT_SECRET` en *Environment Variables*.
4. Deploy. Verificar `/`, `/solicitudes`, `/solicitudes/SOL-2026-001`,
   `/panel` (redirige a `/login`) y `/api/health`.

---

## Solución propuesta

Se construyó una solución en **tres capas** que responde a las cuatro
actividades de la PA4:

1. **Capa de datos y autenticación (backend Express).** API REST con endpoints
   públicos (`GET /api/solicitudes`, `GET /api/solicitudes/:codigo`,
   `GET /api/health`) y protegidos con JWT (`POST /api/solicitudes`,
   `GET /api/auth/perfil`). Incluye validación de entradas, manejo centralizado
   de errores, CORS configurable, logger estructurado y build de producción con
   Webpack + Babel + Terser.

2. **Capa de interacción (SPA React con Vite).** Evidencia la Actividad 1:
   Axios con interceptores, validación de respuestas, manejo de errores de red y
   autenticación, sesión JWT con `sessionStorage` y validación contra el
   servidor, monitoreo global de errores y una interfaz completa para listar,
   filtrar, consultar y crear solicitudes.

3. **Capa optimizada y desplegable (Next.js).** Evidencia las Actividades 2 y 3:
   cada vista usa la estrategia de renderizado adecuada (SSG, SSR, ISR), la ruta
   dinámica `/solicitudes/[codigo]` se pre-genera con `generateStaticParams`, la
   sesión usa cookie httpOnly y `middleware.js` protege `/panel`. Se despliega en
   Vercel y se verifica ruta por ruta.

**Decisiones de diseño relevantes**

- **Dos mecanismos de sesión complementarios:** la SPA usa `sessionStorage` +
  Bearer (contrato clásico de la sesión 11) y Next.js usa cookie httpOnly
  (práctica recomendada en la misma sesión para mitigar XSS). Se documenta la
  diferencia y el porqué.
- **Respaldo local en Next.js:** para que la demo desplegada en Vercel funcione
  sin el backend encendido, `lib/api.js` consulta la API si `API_URL` está
  definida y, si no responde, usa el dataset semilla. La validación de la
  estructura de las respuestas se mantiene igual.
- **Una sola fuente de verdad de los datos:** el backend y el dataset semilla
  de Next.js comparten los mismos códigos y campos, de modo que la interfaz y
  las pruebas son consistentes en los tres proyectos.

---

## Evidencias

Todas las evidencias están en [`docs/`](docs/):

### Capturas de pantalla

| Archivo | Descripción |
|---|---|
| [`docs/capturas/vite-login.png`](docs/capturas/vite-login.png) | Login de la SPA React (Actividad 1) |
| [`docs/capturas/vite-panel.png`](docs/capturas/vite-panel.png) | Panel autenticado con solicitudes cargadas desde la API |
| [`docs/capturas/vite-detalle.png`](docs/capturas/vite-detalle.png) | Detalle de solicitud en modal |
| [`docs/capturas/vite-filtro.png`](docs/capturas/vite-filtro.png) | Filtro por estado |
| [`docs/capturas/vite-creacion.png`](docs/capturas/vite-creacion.png) | Creación de solicitud autenticada |
| [`docs/capturas/next-home.png`](docs/capturas/next-home.png) | Home Next.js (SSG) |
| [`docs/capturas/next-solicitudes-ssr.png`](docs/capturas/next-solicitudes-ssr.png) | Listado Next.js (SSR) con fecha de render |
| [`docs/capturas/next-detalle-dinamico.png`](docs/capturas/next-detalle-dinamico.png) | Ruta dinámica `/solicitudes/[codigo]` (ISR) |
| [`docs/capturas/next-login.png`](docs/capturas/next-login.png) | Login Next.js |
| [`docs/capturas/next-panel-ssr.png`](docs/capturas/next-panel-ssr.png) | Panel privado Next.js (SSR + cookie httpOnly) |
| [`docs/capturas/next-movil.png`](docs/capturas/next-movil.png) | Vista móvil del listado |

### Evidencias de ejecución y pruebas

| Archivo | Contenido |
|---|---|
| [`docs/evidencias/pruebas-api.txt`](docs/evidencias/pruebas-api.txt) | Resultado de las 13 pruebas automatizadas de la API (Todas ✔) |
| [`docs/evidencias/verificacion-rutas-next.txt`](docs/evidencias/verificacion-rutas-next.txt) | Verificación de rutas Next.js en producción: SSG, SSR, ISR, 404, middleware y cookie |
| [`docs/evidencias/build-backend.txt`](docs/evidencias/build-backend.txt) | Build de producción del backend (Webpack) |
| [`docs/evidencias/build-frontend.txt`](docs/evidencias/build-frontend.txt) | Build de producción del frontend (Vite, tamaños gzip) |
| [`docs/evidencias/build-next.txt`](docs/evidencias/build-next.txt) | Build de Next.js con tabla de rutas y estrategias |
| [`docs/evidencias/logs-backend-servidor.txt`](docs/evidencias/logs-backend-servidor.txt) | Logs estructurados JSON del backend |
| [`docs/evidencias/logs-backend-peticiones.txt`](docs/evidencias/logs-backend-peticiones.txt) | Registro de peticiones con duración y estado |
| [`docs/evidencias/logs-next-produccion.txt`](docs/evidencias/logs-next-produccion.txt) | Logs del servidor Next.js en producción |

### Documentos técnicos

- [`docs/justificacion-ssr-ssg.md`](docs/justificacion-ssr-ssg.md): justificación
  técnica de SSR, SSG e ISR con comparación de rendimiento.
- [`docs/produccion.md`](docs/produccion.md): configuración de producción
  (minificación, Webpack/Babel, variables de entorno, logs y monitoreo).

### Despliegue en Vercel

- **URL de producción:** [PEGAR AQUÍ LA URL DE VERCEL]
- **Estado:** pendiente de completar tras el despliegue.

---

## Conclusiones

1. **La elección de la estrategia de renderizado debe responder a la naturaleza
   del dato.** La misma aplicación se beneficia de SSG en la portada, SSR en el
   listado y el panel, e ISR en el detalle. Forzar una sola estrategia
   desperdicia rendimiento o sirve datos obsoletos.
2. **JWT en el cliente exige una decisión de almacenamiento consciente.**
   `sessionStorage` es aceptable para una SPA de práctica (y es lo trabajado en
   la sesión 11), pero una cookie httpOnly elimina la superficie de XSS en el
   manejo del token; la solución muestra ambas y justifica cuándo usar cada una.
3. **La preparación para producción es transversal.** Minificar, separar
   vendors, externalizar variables y registrar logs estructurados no es un paso
   final: condiciona el rendimiento y la capacidad de diagnóstico desde el
   primer despliegue.
4. **Las evidencias verificables son parte del producto.** Los scripts de
   verificación (`npm run verify:api`), las capturas y los archivos de build
   permiten reproducir y auditar cada afirmación de este README.

---

## Video público de YouTube

**Video público de YouTube:** [PEGAR AQUÍ EL ENLACE]

> La exposición debe explicar el problema, el procedimiento, la solución, las
> decisiones y su justificación técnica, con todos los integrantes frente a
> cámara. Duración sugerida: 8 a 12 minutos.

---

## Estructura del repositorio

```
PA4-Programacion-web-avanzada/
├── backend/                  # API Node.js + Express (JWT, logs, build)
│   ├── controllers/          # auth y solicitudes
│   ├── data/                 # usuarios y solicitudes en memoria
│   ├── middleware/           # auth JWT, logger, errores
│   ├── routes/               # rutas /api/auth y /api/solicitudes
│   ├── scripts/              # verificación automatizada de la API
│   ├── utils/                # logger, generación de JWT, validadores
│   ├── webpack.config.js     # build de producción
│   ├── .babelrc
│   └── .env.example
├── frontend/                 # SPA React + Vite (Actividad 1)
│   ├── src/
│   │   ├── api/              # axios con interceptores y servicios
│   │   ├── components/       # login, solicitudes, detalle
│   │   ├── config/           # configuración por variables de entorno
│   │   ├── monitoring/       # captura global de errores
│   │   └── utils/            # logger y validación de respuestas
│   ├── .env.example
│   └── vite.config.js
├── next-app/                 # Next.js (Actividades 2 y 3)
│   ├── app/                  # App Router (páginas y API routes)
│   ├── lib/                  # api, sesión JWT, logger, datos semilla
│   ├── middleware.js         # protección de /panel
│   ├── next.config.js        # optimización de producción
│   └── .env.example
├── docs/                     # evidencias, capturas y documentos técnicos
└── README.md
```
