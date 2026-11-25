// Capa de acceso a datos de Next.js.
// - En el servidor (SSR/SSG) intenta consultar el backend Node.js.
// - Si el backend no está disponible, usa el dataset semilla local para que
//   el despliegue en Vercel siga siendo funcional.
// - Incluye validación de la estructura de las respuestas (Tema 11).
import { solicitudesSemilla } from "./datos";

const API_URL = process.env.API_URL || "";
const TIMEOUT_MS = 3500;
const esBuild = process.env.NEXT_PHASE === "phase-production-build";

const validarListado = (datos) => {
    if (!datos || !Array.isArray(datos.solicitudes)) {
        throw new Error("Respuesta de listado con formato inesperado");
    }
    return datos.solicitudes;
};

const conTimeout = (promesa) => {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIMEOUT_MS);
    return promesa(control.signal).finally(() => clearTimeout(temporizador));
};

export const obtenerSolicitudes = async ({ estado } = {}) => {
    if (API_URL) {
        try {
            const datos = await conTimeout(async (signal) => {
                const url = new URL(`${API_URL}/api/solicitudes`);
                if (estado) url.searchParams.set("estado", estado);

                // Durante el build (ISR) se usa revalidate; en peticiones
                // normales se consulta siempre al backend (no-store).
                const respuesta = await fetch(url, {
                    signal,
                    ...(esBuild
                        ? { next: { revalidate: 60 } }
                        : { cache: "no-store" })
                });

                if (!respuesta.ok) {
                    throw new Error(`La API respondió ${respuesta.status}`);
                }

                return respuesta.json();
            });

            return validarListado(datos);
        } catch (error) {
            console.warn(
                `[api] Backend no disponible (${error.message}); se usa dataset local`
            );
        }
    }

    let resultado = [...solicitudesSemilla];

    if (estado) {
        resultado = resultado.filter(
            (s) => s.estado.toLowerCase() === estado.toLowerCase()
        );
    }

    return resultado;
};

export const obtenerSolicitud = async (codigo) => {
    if (API_URL) {
        try {
            const datos = await conTimeout(async (signal) => {
                const respuesta = await fetch(
                    `${API_URL}/api/solicitudes/${encodeURIComponent(codigo)}`,
                    {
                        signal,
                        ...(esBuild
                            ? { next: { revalidate: 60 } }
                            : { cache: "no-store" })
                    }
                );

                if (!respuesta.ok) {
                    throw new Error(`La API respondió ${respuesta.status}`);
                }

                return respuesta.json();
            });

            if (!datos || !datos.solicitud) {
                throw new Error("Respuesta de detalle con formato inesperado");
            }

            return datos.solicitud;
        } catch (error) {
            console.warn(
                `[api] Backend no disponible (${error.message}); se usa dataset local`
            );
        }
    }

    return (
        solicitudesSemilla.find(
            (s) => s.codigo.toLowerCase() === codigo.toLowerCase()
        ) || null
    );
};

export const listarCodigos = () => solicitudesSemilla.map((s) => s.codigo);
