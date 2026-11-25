// Captura global de errores del navegador (Tema 13: monitoreo de frontend).
// En un entorno profesional estos registros se enviarían a Sentry, Datadog, etc.
import { logger } from "../utils/logger";

export const inicializarMonitoreo = () => {
    window.onerror = (mensaje, origen, linea, columna, error) => {
        logger.error("[MONITOREO] Error global detectado", {
            mensaje,
            origen,
            linea,
            columna,
            pila: error && error.stack
        });
    };

    window.onunhandledrejection = (evento) => {
        logger.error("[MONITOREO] Promesa rechazada sin manejar", {
            motivo: String(evento.reason)
        });
    };

    logger.info("Monitoreo global inicializado");
};
