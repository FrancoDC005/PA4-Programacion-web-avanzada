// Logger estructurado del servidor Next.js (Tema 13: logs y monitoreo).
// En Vercel, todo lo que se escribe por consola queda disponible en
// Dashboard → Deployments → Functions → Logs.
const NIVELES = { error: 0, warn: 1, info: 2, debug: 3 };

const nivelConfigurado = () => {
    if (process.env.LOG_LEVEL && NIVELES[process.env.LOG_LEVEL] !== undefined) {
        return NIVELES[process.env.LOG_LEVEL];
    }
    return process.env.NODE_ENV === "production" ? NIVELES.info : NIVELES.debug;
};

const emitir = (nivel, mensaje, datos) => {
    if (NIVELES[nivel] > nivelConfigurado()) return;

    const registro = {
        fecha: new Date().toISOString(),
        nivel,
        servicio: "pa4-next",
        entorno: process.env.NODE_ENV || "development",
        mensaje,
        ...(datos && Object.keys(datos).length > 0 ? { datos } : {})
    };

    const linea = JSON.stringify(registro);

    if (nivel === "error") console.error(linea);
    else if (nivel === "warn") console.warn(linea);
    else console.log(linea);
};

export const logger = {
    error: (mensaje, datos) => emitir("error", mensaje, datos),
    warn: (mensaje, datos) => emitir("warn", mensaje, datos),
    info: (mensaje, datos) => emitir("info", mensaje, datos),
    debug: (mensaje, datos) => emitir("debug", mensaje, datos)
};
