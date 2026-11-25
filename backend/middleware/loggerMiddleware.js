const logger = require("../utils/logger");

// Registra cada petición HTTP con su duración y código de estado.
const registrarPeticion = (req, res, next) => {
    const inicio = process.hrtime.bigint();

    res.on("finish", () => {
        const duracionMs = Number(process.hrtime.bigint() - inicio) / 1e6;
        const datos = {
            metodo: req.method,
            ruta: req.originalUrl,
            estado: res.statusCode,
            duracionMs: Number(duracionMs.toFixed(2)),
            ip: req.ip
        };

        if (res.statusCode >= 500) {
            logger.error("Petición con error del servidor", datos);
        } else if (res.statusCode >= 400) {
            logger.warn("Petición rechazada", datos);
        } else {
            logger.info("Petición completada", datos);
        }
    });

    next();
};

module.exports = registrarPeticion;
