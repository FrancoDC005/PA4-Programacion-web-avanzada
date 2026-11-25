import Link from "next/link";
import { obtenerSolicitudes } from "@/lib/api";
import { ESTADOS } from "@/lib/datos";

// Listado renderizado en el SERVIDOR en cada petición (SSR).
// El estado de las solicitudes cambia constantemente (aprobaciones,
// revisiones), por lo que no conviene servir una versión estática.
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Solicitudes"
};

const claseEstado = (estado) => {
    const mapa = {
        "Pendiente": "pendiente",
        "En revisión": "revision",
        "Aprobada": "aprobada",
        "Rechazada": "rechazada"
    };
    return mapa[estado] || "";
};

export default async function SolicitudesPage({ searchParams }) {
    const params = await searchParams;
    const estadoSeleccionado = params?.estado || "Todos";

    const solicitudes = await obtenerSolicitudes(
        estadoSeleccionado === "Todos" ? {} : { estado: estadoSeleccionado }
    );

    const generado = new Date().toISOString();

    return (
        <main className="contenedor">
            <header className="encabezado-pagina">
                <h1>Solicitudes académicas</h1>
                <p>
                    Página renderizada en el servidor en cada petición (SSR).
                    Generada: <code>{generado}</code>
                </p>
            </header>

            <nav className="filtros" aria-label="Filtrar por estado">
                {["Todos", ...ESTADOS].map((estado) => (
                    <Link
                        key={estado}
                        href={
                            estado === "Todos"
                                ? "/solicitudes"
                                : `/solicitudes?estado=${encodeURIComponent(estado)}`
                        }
                        className={estadoSeleccionado === estado ? "activo" : ""}
                    >
                        {estado}
                    </Link>
                ))}
            </nav>

            {solicitudes.length === 0 ? (
                <p>No hay solicitudes con el filtro seleccionado.</p>
            ) : (
                <div className="lista">
                    {solicitudes.map((solicitud) => (
                        <article className="tarjeta-solicitud" key={solicitud.codigo}>
                            <div className="cabecera-tarjeta">
                                <span className="codigo">{solicitud.codigo}</span>
                                <span className={`estado ${claseEstado(solicitud.estado)}`}>
                                    {solicitud.estado}
                                </span>
                            </div>

                            <h3>{solicitud.titulo}</h3>

                            <p className="meta">
                                <span>{solicitud.tipo}</span>
                                <span>Prioridad: {solicitud.prioridad}</span>
                                <span>{solicitud.fechaSolicitud}</span>
                            </p>

                            <Link
                                className="boton secundario"
                                style={{ marginTop: "auto", textAlign: "center" }}
                                href={`/solicitudes/${solicitud.codigo}`}
                            >
                                Ver detalle
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
