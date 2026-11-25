const express = require("express");
const router = express.Router();

const {
    listarSolicitudes,
    obtenerSolicitud,
    crearSolicitud
} = require("../controllers/solicitudesController");

const verificarToken = require("../middleware/authMiddleware");

// Rutas públicas de consulta
router.get("/", listarSolicitudes);
router.get("/:codigo", obtenerSolicitud);

// Ruta protegida mediante JWT
router.post("/", verificarToken, crearSolicitud);

module.exports = router;
