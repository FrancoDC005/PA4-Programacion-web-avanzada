import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/sesion";
import FormularioLogin from "../components/FormularioLogin";

export const metadata = {
    title: "Iniciar sesión"
};

// Página de login renderizada en el servidor: si ya hay una sesión válida
// en la cookie httpOnly, redirige al panel sin mostrar el formulario.
export default async function LoginPage() {
    const sesion = await obtenerSesion();

    if (sesion) {
        redirect("/panel");
    }

    return (
        <main className="pagina-login">
            <section className="tarjeta-login">
                <h1>Gestión Académica</h1>
                <p className="subtitulo">
                    Plataforma de Gestión de Solicitudes Académicas
                </p>
                <FormularioLogin />
            </section>
        </main>
    );
}
