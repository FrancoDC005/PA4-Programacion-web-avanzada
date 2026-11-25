const express = require("express");
const cors = require("cors");
require("dotenv").config();

const logger = require("./utils/logger");
const registrarPeticion = require("./middleware/loggerMiddleware");
const { noEncontrado, manejadorErrores } = require("./middleware/errorHandler");
const { sembrarUsuariosDemo } = require("./data/usuarios");

const authRoutes = require("./routes/authRoutes");
const solicitudesRoutes = require("./routes/solicitudesRoutes");

const app = express();

// Orígenes permitidos configurables por variable de entorno (Tema 13)
const origenesPermitidos = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000")
    .split(",")
    .map((origen) => origen.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Permitir peticiones sin origin (curl, Postman, server-to-server)
        if (!origin || origenesPermitidos.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true
}));

app.use(express.json());
app.use(registrarPeticion);

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Gestión de Solicitudes Académicas funcionando correctamente",
        version: "1.0.0",
        entorno: process.env.NODE_ENV || "development"
    });
});

// Ruta de salud (usada por monitoreo)
app.get("/api/health", (req, res) => {
    res.json({
        estado: "OK",
        mensaje: "Servidor conectado correctamente",
        fecha: new Date().toISOString(),
        uptimeSegundos: Number(process.uptime().toFixed(1))
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/solicitudes", solicitudesRoutes);

// Manejo de rutas inexistentes y errores centralizados
app.use(noEncontrado);
app.use(manejadorErrores);

const PORT = process.env.PORT || 3000;

const iniciar = async () => {
    await sembrarUsuariosDemo();

    app.listen(PORT, () => {
        logger.info("Servidor iniciado", {
            puerto: PORT,
            entorno: process.env.NODE_ENV || "development",
            origenesPermitidos
        });
    });
};

iniciar();

module.exports = app;
