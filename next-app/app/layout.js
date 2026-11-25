import Link from "next/link";
import { obtenerSesion } from "@/lib/sesion";
import "./globals.css";

export const metadata = {
    title: {
        default: "Gestión Académica · PA4",
        template: "%s · Gestión Académica"
    },
    description:
        "Plataforma de Gestión de Solicitudes Académicas — PA4 Programación Web II (ISIL). Next.js con SSR, SSG, rutas dinámicas y despliegue en Vercel."
};

export default async function RootLayout({ children }) {
    const sesion = await obtenerSesion();

    return (
        <html lang="es">
            <body>
                <nav className="barra">
                    <div className="contenedor">
                        <Link href="/" className="marca">
                            <span className="punto" />
                            Gestión Académica
                        </Link>

                        <div className="nav-enlaces">
                            <Link href="/">Inicio</Link>
                            <Link href="/solicitudes">Solicitudes</Link>
                            {sesion ? (
                                <Link href="/panel">Panel</Link>
                            ) : (
                                <Link href="/login">Iniciar sesión</Link>
                            )}
                        </div>
                    </div>
                </nav>

                {children}

                <footer className="pie">
                    <div className="contenedor">
                        <span>
                            PA4 · Programación Web II (30690) · ISIL 202620
                        </span>
                        <span>
                            Next.js + SSR/SSG · desplegado en Vercel ·{" "}
                            <code>/api/health</code>
                        </span>
                    </div>
                </footer>
            </body>
        </html>
    );
}
