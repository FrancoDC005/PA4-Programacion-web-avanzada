const DetalleSolicitud = ({ solicitud, alCerrar }) => (
    <div className="modal-fondo" onClick={alCerrar}>
        <section className="modal" onClick={(e) => e.stopPropagation()}>
            <header>
                <h2>{solicitud.codigo}</h2>
                <button type="button" onClick={alCerrar} aria-label="Cerrar">
                    ✕
                </button>
            </header>

            <h3>{solicitud.titulo}</h3>

            <dl>
                <dt>Tipo</dt><dd>{solicitud.tipo}</dd>
                <dt>Estado</dt><dd>{solicitud.estado}</dd>
                <dt>Prioridad</dt><dd>{solicitud.prioridad}</dd>
                <dt>Solicitante</dt><dd>{solicitud.solicitante}</dd>
                <dt>Fecha de solicitud</dt><dd>{solicitud.fechaSolicitud}</dd>
            </dl>

            <p className="descripcion">{solicitud.descripcion}</p>
        </section>
    </div>
);

export default DetalleSolicitud;
