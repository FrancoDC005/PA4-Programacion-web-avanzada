const claseEstado = (estado) => {
    const mapa = {
        "Pendiente": "estado pendiente",
        "En revisión": "estado revision",
        "Aprobada": "estado aprobada",
        "Rechazada": "estado rechazada"
    };
    return mapa[estado] || "estado";
};

const TarjetaSolicitud = ({ solicitud, alVerDetalle }) => (
    <article className="tarjeta-solicitud">
        <header>
            <span className="codigo">{solicitud.codigo}</span>
            <span className={claseEstado(solicitud.estado)}>{solicitud.estado}</span>
        </header>

        <h3>{solicitud.titulo}</h3>

        <p className="meta">
            <span>{solicitud.tipo}</span>
            <span>Prioridad: {solicitud.prioridad}</span>
            <span>{solicitud.fechaSolicitud}</span>
        </p>

        <button type="button" onClick={() => alVerDetalle(solicitud)}>
            Ver detalle
        </button>
    </article>
);

export default TarjetaSolicitud;
