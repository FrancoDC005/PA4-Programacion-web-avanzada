import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerSolicitud, listarCodigos } from "@/lib/api";

// RUTA DINÁMICA con generación estática incremental (ISR).
// - generateStaticParams genera en el build una página por cada código.
// - revalidate = 60 permite regenerar la página en segundo plano si el
//   estado de la solicitud cambia, combniando velocidad de SSG con frescura.
export const revalidate = 60;

export async function generateStaticParams() {
    return listarCodigos().map((codigo) => ({ codigo }));
}

export async function generateMetadata({ params }) {
    const { codigo } = await params;
    const solicitud = await obtenerSolicitud(codigo);

    return {
        title: solicitud ? `${solicitud.codigo} — ${solicitud.titulo}` : "Solicitud"
    };
}

const claseEstado = (estado) => {
    const mapa = {
        "Pendiente": "pendiente",
        "En revisión": "revision",
        "Aprobada": "aprobada",
        "Rechazada": "rechazada"
    };
    return mapa[estado] || "";
};

export default async function DetalleSolicitudPage({ params }) {
    const { codigo } = await params;
    const solicitud = await obtenerSolicitud(codigo);

    if (!solicitud) {
        notFound();
    }

    const generado = new Date().toISOString();

    return (
        <main className="contenedor detalle">
            <p className="migaja">
                <Link href="/solicitudes">Solicitudes</Link> / {solicitud.codigo}
            </p>

            <header className="detalle-cabecera">
                <span className={`estado ${claseEstado(solicitud.estado)}`}>
                    {solicitud.estado}
                </span>
                <h1>{solicitud.titulo}</h1>
                <p>
                    Ruta dinámica <code>/solicitudes/[codigo]</code> generada con
                    ISR (revalidación cada 60 s). Render de esta vista:{" "}
                    <code>{generado}</code>
                </p>
            </header>

            <section className="detalle-cuadro">
                <dl>
                    <dt>Código</dt>
                    <dd>{solicitud.codigo}</dd>
                    <dt>Tipo</dt>
                    <dd>{solicitud.tipo}</dd>
                    <dt>Estado</dt>
                    <dd>{solicitud.estado}</dd>
                    <dt>Prioridad</dt>
                    <dd>{solicitud.prioridad}</dd>
                    <dt>Solicitante</dt>
                    <dd>{solicitud.solicitante}</dd>
                    <dt>Fecha de solicitud</dt>
                    <dd>{solicitud.fechaSolicitud}</dd>
                </dl>

                <p className="descripcion">{solicitud.descripcion}</p>
            </section>
        </main>
    );
}
