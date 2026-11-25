# Backend — API de Gestión de Solicitudes Académicas

API REST en Node.js + Express con autenticación JWT, logs estructurados y build
de producción con Webpack + Babel + Terser.

## Requisitos

- Node.js 22+
- npm

## Ejecutar

```bash
cp .env.example .env          # ajustar JWT_SECRET
npm install
npm run dev                   # desarrollo con nodemon (http://localhost:3000)
npm start                     # producción sin build
```

Usuarios sembrados al arrancar:

| Correo | Contraseña | Rol |
|---|---|---|
| `estudiante@isil.edu.pe` | `Demo123` | usuario |
| `admin@isil.edu.pe` | `Admin123` | admin |

## Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Público | Mensaje de bienvenida y entorno |
| GET | `/api/health` | Público | Estado, uptime y memoria (monitoreo) |
| POST | `/api/auth/register` | Público | Registro de usuario (devuelve JWT) |
| POST | `/api/auth/login` | Público | Inicio de sesión (devuelve JWT) |
| GET | `/api/auth/perfil` | JWT | Perfil del usuario autenticado |
| GET | `/api/solicitudes?estado=&tipo=` | Público | Listado con filtros |
| GET | `/api/solicitudes/:codigo` | Público | Detalle por código |
| POST | `/api/solicitudes` | JWT | Crear solicitud |

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto 3000) |
| `NODE_ENV` | `development` \| `production` |
| `JWT_SECRET` | Secreto para firmar los JWT (obligatorio en producción) |
| `JWT_EXPIRES_IN` | Duración del token (por defecto `1h`) |
| `LOG_LEVEL` | `error` \| `warn` \| `info` \| `debug` |
| `CORS_ORIGIN` | Orígenes permitidos, separados por coma |

## Verificación y build

```bash
npm run verify:api            # 13 pruebas automatizadas contra la API en ejecución
npm run build                 # build de producción (Webpack + Babel + Terser)
npm run preview               # ejecuta dist/server.js
```

## Logs

El logger emite líneas JSON por consola con nivel, servicio, entorno, mensaje y
datos. Ejemplo:

```json
{"fecha":"2026-11-25T00:00:00.000Z","nivel":"info","servicio":"pa4-backend","entorno":"development","mensaje":"Petición completada","datos":{"metodo":"GET","ruta":"/api/health","estado":200,"duracionMs":1.67}}
```
