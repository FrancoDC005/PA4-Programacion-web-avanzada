// Dataset semilla compartido por las vistas de Next.js.
// Cuando el backend Node.js responde (API_URL), los datos se obtienen de la
// API real; este conjunto actúa como respaldo para que el build/SSG y la
// demo desplegada en Vercel funcionen incluso sin el backend encendido.
export const solicitudesSemilla = [
    {
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

export const ESTADOS = ["Pendiente", "En revisión", "Aprobada", "Rechazada"];
export const TIPOS = [
    "Beca",
    "Convalidación",
    "Certificado",
    "Matrícula",
    "Cambio de sección",
    "Tutoría"
];
