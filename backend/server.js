
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Importar rutas
const authRoutes = require("./routes/authRoutes");

// Configuración CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Procesar JSON
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Gestión de Solicitudes Académicas funcionando correctamente"
    });
});

// Ruta de salud
app.get("/api/health", (req, res) => {
    res.json({
        estado: "OK",
        mensaje: "Servidor conectado correctamente"
    });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
