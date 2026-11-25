# Frontend React (Vite) — PA4

Aplicación SPA de la Plataforma de Gestión de Solicitudes Académicas.

## Requisitos

- Node.js 22 o superior
- Backend de `../backend` ejecutándose en `http://localhost:3000`

## Ejecutar

```bash
cp .env.example .env.development
npm install
npm run dev        # http://localhost:5173
npm run build      # build de producción en dist/
npm run preview    # sirve el build de producción
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API del backend |
| `VITE_ENTORNO` | `development` \| `production` |
| `VITE_HABILITAR_LOGS` | `true` para logs `info`/`debug` en consola |
