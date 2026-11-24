const express = require("express");
const router = express.Router();

const {
    registrar,
    iniciarSesion
} = require("../controllers/authController");

const verificarToken = require("../middleware/authMiddleware");

router.post("/register", registrar);
router.post("/login", iniciarSesion);

// Ruta protegida mediante JWT
router.get("/perfil", verificarToken, (req, res) => {
    res.json({
        mensaje: "Acceso autorizado al perfil",
        usuario: req.usuario
    });
});

module.exports = router;