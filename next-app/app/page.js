import Link from "next/link";
import { solicitudesSemilla } from "@/lib/datos";

// Página principal generada de forma ESTÁTICA (SSG) en el build.
// El contenido es informativo y estable: no depende del usuario ni cambia
// entre peticiones, por lo que se genera una sola vez y se sirve desde CDN.
export const dynamic = "force-static";

export const metadata = {
    title: "Inicio"
};

export default function Home() {
    // Se usa el dataset local directamente: la página no depende de datos
    // remotos ni de la sesión, por eso puede generarse 100% en el build.
    const solicitudes = solicitudesSemilla;

    const aprobadas = solicitudes.filter((s) => s.estado === "Aprobada").length;
    const pendientes = solicitudes.filter(
        (s) => s.estado === "Pendiente" || s.estado === "En revisión"
    ).length;

    return (
        <main>
            <section className="heroe">
                <div className="contenedor">
                    <span className="etiqueta">PA4 · Programación Web II</span>
                    <h1>Plataforma de Gestión de Solicitudes Académicas</h1>
                    <p className="descripcion">
                        Consulta el estado de tus solicitudes de beca,
                        convalidación, matrícula y certificados en un solo lugar.
                        Esta página se genera de forma estática (SSG) en el build y
                        se sirve desde la red de Vercel.
                    </p>

                    <div className="acciones">
                        <Link href="/solicitudes" className="boton">
                            Ver solicitudes
                        </Link>
                        <Link href="/login" className="boton secundario">
                            Acceder al panel
                        </Link>
                    </div>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor">
                    <h2>Resumen del periodo 2026-II</h2>
                    <p className="introduccion">
                        Datos calculados durante el build a partir del catálogo de
                        solicitudes, como evidencia de la generación estática.
                    </p>

                    <div className="rejilla">
                        <article className="tarjeta-info">
                            <h3>{solicitudes.length}</h3>
                            <p>Solicitudes registradas en el periodo</p>
                        </article>
                        <article className="tarjeta-info">
                            <h3>{pendientes}</h3>
                            <p>En revisión o pendientes de atención</p>
                        </article>
                        <article className="tarjeta-info">
                            <h3>{aprobadas}</h3>
                            <p>Aprobadas por la coordinación académica</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor">
                    <h2>Estrategias de renderizado aplicadas</h2>
                    <p className="introduccion">
                        Cada vista usa la estrategia que mejor se adapta a la
                        naturaleza de sus datos, según lo trabajado en la sesión 12.
                    </p>

                    <div className="rejilla">
                        <article className="tarjeta-info">
                            <span className="insignia ssg">SSG</span>
                            <h3>Inicio (esta página)</h3>
                            <p>
                                Contenido informativo y estable. Se genera una sola
                                vez en el build y se sirve como HTML estático desde
                                la CDN: máxima velocidad y SEO.
                            </p>
                        </article>

                        <article className="tarjeta-info">
                            <span className="insignia ssr">SSR</span>
                            <h3>/solicitudes y /panel</h3>
                            <p>
                                El listado y el panel muestran información que debe
                                estar siempre actualizada y depende del usuario
                                autenticado; se renderizan en el servidor en cada
                                petición.
                            </p>
                        </article>

                        <article className="tarjeta-info">
                            <span className="insignia isr">ISR</span>
                            <h3>/solicitudes/[codigo]</h3>
                            <p>
                                Ruta dinámica generada con
                                <code> generateStaticParams</code> y revalidación
                                incremental cada 60 segundos: rápida como SSG y con
                                datos frescos.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}
