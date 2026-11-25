import Link from "next/link";

export const metadata = {
    title: "No encontrado"
};

export default function NoEncontrado() {
    return (
        <main className="contenedor detalle">
            <div style={{ padding: "80px 0", textAlign: "center" }}>
                <h1>404 · Recurso no encontrado</h1>
                <p style={{ margin: "14px 0 26px", color: "var(--suave)" }}>
                    La solicitud o página que buscas no existe o fue removida.
                </p>
                <Link href="/solicitudes" className="boton">
                    Volver al listado
                </Link>
            </div>
        </main>
    );
}
