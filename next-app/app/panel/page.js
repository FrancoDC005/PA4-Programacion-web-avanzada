import Link from "next/link";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/sesion";
import { obtenerSolicitudes } from "@/lib/api";
import BotonLogout from "../components/BotonLogout";

// PANEL PRIVADO con renderizado en el servidor (SSR).
// Contenido personalizado por usuario + datos siempre actualizados;
// la sesión se valida en el servidor leyendo la cookie httpOnly.
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Panel"
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

export default async function PanelPage() {
    const sesion = await obtenerSesion();

    if (!sesion) {
        redirect("/login");
    }

    const solicitudes = await obtenerSolicitudes();

    const conteo = {
        total: solicitudes.length,
        pendientes: solicitudes.filter(
            (s) => s.estado === "Pendiente" || s.estado === "En revisión"
        ).length,
        aprobadas: solicitudes.filter((s) => s.estado === "Aprobada").length,
        rechazadas: solicitudes.filter((s) => s.estado === "Rechazada").length
    };

    const generado = new Date().toISOString();

    return (
        <main className="contenedor panel">
            <header className="panel-cabecera">
                <div>
                    <h1>Panel de {sesion.nombre}</h1>
                    <p>
                        {sesion.correo} · rol <code>{sesion.rol}</code> · vista SSR
                        generada {generado}
                    </p>
                </div>

                <div className="usuario">
                    <BotonLogout />
                </div>
            </header>

            <p className="aviso demo">
                Panel privado protegido por middleware y validación de JWT en el
                servidor (cookie httpOnly). Si cierras sesión o la cookie expira,
                el acceso redirige a /login.
            </p>

            <section className="metricas">
                <article className="metrica">
                    <div className="valor">{conteo.total}</div>
                    <div className="nombre">Solicitudes totales</div>
                </article>
                <article className="metrica">
                    <div className="valor">{conteo.pendientes}</div>
                    <div className="nombre">Pendientes / en revisión</div>
                </article>
                <article className="metrica">
                    <div className="valor">{conteo.aprobadas}</div>
                    <div className="nombre">Aprobadas</div>
                </article>
                <article className="metrica">
                    <div className="valor">{conteo.rechazadas}</div>
                    <div className="nombre">Rechazadas</div>
                </article>
            </section>

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
                            <span>{solicitud.solicitante}</span>
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
        </main>
    );
}
