import axios from "axios";
import configuracion from "../config/configuracion";
import { logger } from "../utils/logger";

const api = axios.create({
    baseURL: configuracion.api.urlBase,
    timeout: configuracion.api.timeout,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor de peticiones: adjunta el token JWT automáticamente
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        logger.debug(`→ ${config.method?.toUpperCase()} ${config.url}`);

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuestas: logging y detección de sesión expirada
api.interceptors.response.use(
    (respuesta) => {
        logger.debug(`← ${respuesta.status} ${respuesta.config.url}`);
        return respuesta;
    },
    (error) => {
        const estado = error.response?.status;

        if (estado === 401) {
            logger.warn("Sesión expirada o token inválido", {
                ruta: error.config?.url
            });

            // Avisa a la aplicación para que limpie la sesión
            window.dispatchEvent(new CustomEvent("sesion-expirada"));
        } else if (error.request && !error.response) {
            logger.error("Error de conexión con la API", {
                ruta: error.config?.url,
                mensaje: error.message
            });
        }

        return Promise.reject(error);
    }
);

export default api;
