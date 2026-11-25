const logger = require("../utils/logger");

// 404 para rutas inexistentes
const noEncontrado = (req, res) => {
    res.status(404).json({
        mensaje: "Recurso no encontrado"
    });
};

// Manejo centralizado de errores no controlados
// eslint-disable-next-line no-unused-vars
const manejadorErrores = (error, req, res, next) => {
    logger.error("Error no controlado", {
        mensaje: error.message,
        ruta: req.originalUrl
    });

    res.status(error.status || 500).json({
        mensaje: error.message || "Error interno del servidor"
    });
};

module.exports = { noEncontrado, manejadorErrores };
