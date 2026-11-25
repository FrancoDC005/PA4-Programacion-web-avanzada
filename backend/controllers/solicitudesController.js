const { listar, buscarPorCodigo, crear } = require("../data/solicitudes");
const logger = require("../utils/logger");

const ESTADOS = ["Pendiente", "En revisión", "Aprobada", "Rechazada"];
const PRIORIDADES = ["Baja", "Media", "Alta"];
const TIPOS = [
    "Beca",
    "Convalidación",
    "Certificado",
    "Matrícula",
    "Cambio de sección",
    "Tutoría"
];

// GET /api/solicitudes
const listarSolicitudes = (req, res) => {
    const { estado, tipo } = req.query;
    const datos = listar({ estado, tipo });

    logger.info("Listado de solicitudes consultado", {
        estado: estado || "todos",
        cantidad: datos.length
    });

    res.json({ total: datos.length, solicitudes: datos });
};

// GET /api/solicitudes/:codigo
const obtenerSolicitud = (req, res) => {
    const solicitud = buscarPorCodigo(req.params.codigo);

    if (!solicitud) {
        return res.status(404).json({
            mensaje: "Solicitud no encontrada"
        });
    }

    res.json({ solicitud });
};

// POST /api/solicitudes (protegida con JWT)
const crearSolicitud = (req, res) => {
    const { titulo, tipo, descripcion, prioridad, solicitante } = req.body;

    if (!titulo || String(titulo).trim().length < 5) {
        return res.status(400).json({
            mensaje: "El título debe tener al menos 5 caracteres"
        });
    }

    if (!TIPOS.includes(tipo)) {
        return res.status(400).json({
            mensaje: `El tipo debe ser uno de: ${TIPOS.join(", ")}`
        });
    }

    if (!descripcion || String(descripcion).trim().length < 10) {
        return res.status(400).json({
            mensaje: "La descripción debe tener al menos 10 caracteres"
        });
    }

    if (prioridad && !PRIORIDADES.includes(prioridad)) {
        return res.status(400).json({
            mensaje: `La prioridad debe ser una de: ${PRIORIDADES.join(", ")}`
        });
    }

    const nueva = crear({
        titulo: String(titulo).trim(),
        tipo,
        descripcion: String(descripcion).trim(),
        prioridad,
        solicitante: solicitante || (req.usuario && req.usuario.nombre)
    });

    logger.info("Solicitud creada", {
        codigo: nueva.codigo,
        usuario: req.usuario && req.usuario.correo
    });

    res.status(201).json({
        mensaje: "Solicitud registrada correctamente",
        solicitud: nueva
    });
};

module.exports = {
    listarSolicitudes,
    obtenerSolicitud,
    crearSolicitud,
    ESTADOS,
    TIPOS,
    PRIORIDADES
};
