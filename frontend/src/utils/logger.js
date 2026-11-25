// Logger con niveles (Tema 13: logs y monitoreo).
// En desarrollo muestra info/debug; en producción solo warn/error.
import configuracion from "../config/configuracion";

const niveles = {
    info: "INFO",
    warn: "ADVERTENCIA",
    error: "ERROR",
    debug: "DEPURACIÓN"
};

const formatear = (nivel, mensaje) =>
    `[${new Date().toISOString()}] [${niveles[nivel]}] ${mensaje}`;

export const logger = {
    info: (mensaje, datos = {}) => {
        if (configuracion.caracteristicas.habilitarLogs) {
            console.info(formatear("info", mensaje), datos);
        }
    },
    warn: (mensaje, datos = {}) => {
        console.warn(formatear("warn", mensaje), datos);
    },
    error: (mensaje, datos = {}) => {
        console.error(formatear("error", mensaje), datos);
    },
    debug: (mensaje, datos = {}) => {
        if (configuracion.caracteristicas.modoDebug) {
            console.debug(formatear("debug", mensaje), datos);
        }
    }
};
