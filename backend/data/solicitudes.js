// Catálogo de solicitudes académicas de demostración
const solicitudes = [
    {
        id: 1,
        codigo: "SOL-2026-001",
        titulo: "Solicitud de beca por rendimiento académico",
        tipo: "Beca",
        estado: "En revisión",
        prioridad: "Alta",
        solicitante: "Estudiante Demo",
        fechaSolicitud: "2026-11-03",
        descripcion:
            "Solicito la evaluación de mi expediente para acceder a la beca por rendimiento académico correspondiente al ciclo 2026-II."
    },
    {
        id: 2,
        codigo: "SOL-2026-002",
        titulo: "Convalidación del curso Base de Datos",
        tipo: "Convalidación",
        estado: "Aprobada",
        prioridad: "Media",
        solicitante: "Estudiante Demo",
        fechaSolicitud: "2026-10-21",
        descripcion:
            "Solicito la convalidación del curso Base de Datos cursado en otra institución, adjuntando récord académico y sílabo."
    },
    {
        id: 3,
        codigo: "SOL-2026-003",
        titulo: "Certificado de estudios parcial",
        tipo: "Certificado",
        estado: "Pendiente",
        prioridad: "Baja",
        solicitante: "María Fernández",
        fechaSolicitud: "2026-11-10",
        descripcion:
            "Solicito la emisión de un certificado de estudios parcial para trámite laboral externo."
    },
    {
        id: 4,
        codigo: "SOL-2026-004",
        titulo: "Reserva de matrícula 2027-I",
        tipo: "Matrícula",
        estado: "Pendiente",
        prioridad: "Alta",
        solicitante: "Luis Ramírez",
        fechaSolicitud: "2026-11-12",
        descripcion:
            "Solicito la reserva de matrícula para el periodo 2027-I por motivos de salud debidamente sustentados."
    },
    {
        id: 5,
        codigo: "SOL-2026-005",
        titulo: "Cambio de sección en Programación Web II",
        tipo: "Cambio de sección",
        estado: "Aprobada",
        prioridad: "Media",
        solicitante: "Estudiante Demo",
        fechaSolicitud: "2026-10-30",
        descripcion:
            "Solicito el cambio a la sección nocturna por incompatibilidad con mi horario laboral."
    },
    {
        id: 6,
        codigo: "SOL-2026-006",
        titulo: "Solicitud de tutoría académica",
        tipo: "Tutoría",
        estado: "Rechazada",
        prioridad: "Baja",
        solicitante: "Carlos Mendoza",
        fechaSolicitud: "2026-10-15",
        descripcion:
            "Solicito sesiones de tutoría para reforzar los temas de JavaScript y React previos al examen final."
    }
];

let siguienteId = solicitudes.length + 1;

const listar = ({ estado, tipo } = {}) => {
    let resultado = [...solicitudes];

    if (estado) {
        resultado = resultado.filter(
            (s) => s.estado.toLowerCase() === String(estado).toLowerCase()
        );
    }

    if (tipo) {
        resultado = resultado.filter(
            (s) => s.tipo.toLowerCase() === String(tipo).toLowerCase()
        );
    }

    return resultado;
};

const buscarPorCodigo = (codigo) =>
    solicitudes.find((s) => s.codigo.toLowerCase() === codigo.toLowerCase());

const crear = ({ titulo, tipo, descripcion, prioridad, solicitante }) => {
    const id = siguienteId++;
    const nueva = {
        id,
        codigo: `SOL-2026-${String(id).padStart(3, "0")}`,
        titulo,
        tipo,
        estado: "Pendiente",
        prioridad: prioridad || "Media",
        solicitante: solicitante || "Estudiante Demo",
        fechaSolicitud: new Date().toISOString().slice(0, 10),
        descripcion
    };

    solicitudes.push(nueva);
    return nueva;
};

module.exports = { solicitudes, listar, buscarPorCodigo, crear };
