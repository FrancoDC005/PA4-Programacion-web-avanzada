# Preparación para producción (Actividad 3 y Tema 13)

Este documento resume qué se configuró para producción y por qué.

## 1. Minificación y optimización

| Proyecto | Herramienta | Configuración | Evidencia |
|---|---|---|---|
| `backend/` | Webpack 5 + Babel + Terser | `webpack.config.js`: `mode: production`, `passes: 2`, `drop_debugger`, `extractComments: false` | `docs/evidencias/build-backend.txt` (1 asset, 262 módulos) |
| `frontend/` | Vite (esbuild/Rollup) | minificación por defecto, contenthash, tree-shaking ES modules | `docs/evidencias/build-frontend.txt` (JS 288.94 kB → 93.20 kB gzip) |
| `next-app/` | SWC + Terser + splitChunks | `next.config.js`: `removeConsole` en producción, `splitChunks` con chunk `vendor` separado | `docs/evidencias/build-next.txt` (vendor 196 kB compartido) |

### Decisiones

- **`drop_console`/`removeConsole`:** en el cliente se eliminan `console.log` e
  `console.info` de producción para no filtrar información ni inflar el bundle;
  se conservan `warn` y `error` porque alimentan el monitoreo.
- **Chunk `vendor`:** separar React del código de la aplicación permite que el
  navegador cachee el vendor entre despliegues (cache busting por hash solo en
  los chunks que cambian).
- **`productionBrowserSourceMaps: false`:** no se publican source maps en
  producción para no exponer el código fuente.

## 2. Webpack y Babel

- **Backend:** `webpack.config.js` con `target: "node"`, `babel-loader` y
  `@babel/preset-env` (`.babelrc`). Resultado: un único `dist/server.js`
  minificado y ejecutable con `npm run preview`.
- **Next.js:** `next.config.js` personaliza `optimization.splitChunks` del
  cliente.
- **Frontend Vite:** el pipeline usa ES modules + Rollup (heredero conceptual
  de Webpack); se documenta la equivalencia en el README.

## 3. Variables de entorno

| Proyecto | Archivo de ejemplo | Variables |
|---|---|---|
| `backend/` | `.env.example` | `PORT`, `NODE_ENV`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `LOG_LEVEL`, `CORS_ORIGIN` |
| `frontend/` | `.env.example`, `.env.development`, `.env.production` | `VITE_API_URL`, `VITE_ENTORNO`, `VITE_HABILITAR_LOGS` |
| `next-app/` | `.env.example` | `API_URL`, `JWT_SECRET` |

Ningún `.env` real se versiona: `.gitignore` excluye `.env`, `.env.*` y solo
permite `!.env.example`. En Vercel, `JWT_SECRET` se configura en
**Settings → Environment Variables** (producción y preview).

## 4. Logs y monitoreo

### Backend

- `utils/logger.js`: logger estructurado en JSON con niveles
  (`error` > `warn` > `info` > `debug`) y `LOG_LEVEL` configurable.
- `middleware/loggerMiddleware.js`: registra método, ruta, código de estado,
  duración en ms e IP de cada petición.
- Evidencia: `docs/evidencias/logs-backend-peticiones.txt` y
  `logs-backend-servidor.txt`.

### Next.js

- `lib/logger.js`: mismo formato JSON; en Vercel los registros aparecen en
  **Deployments → Functions → Logs**.
- `app/api/health/route.js`: endpoint de monitoreo con estado, uptime y memoria.
- `next.config.js` conserva `console.warn`/`console.error` en producción.

### Frontend React

- `src/utils/logger.js`: logger por niveles; en producción solo `warn`/`error`.
- `src/monitoring/globalErrorHandler.js`: captura `window.onerror` y
  `unhandledrejection` (punto de integración para Sentry/Datadog).
- `src/api/axios.js`: interceptores que registran peticiones y detectan
  `401` (sesión expirada) y errores de red.

## 5. Seguridad de sesión

- El JWT de la app Next.js viaja en una cookie **httpOnly**, `sameSite=lax` y
  `secure` en producción: JavaScript del navegador no puede leerla (mitiga XSS).
- El backend Express mantiene el contrato clásico `Authorization: Bearer` para
  la SPA de React, con `sessionStorage` en el cliente.
- `middleware.js` protege `/panel` antes del render.
