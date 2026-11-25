"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Formulario de login del App Router (Client Component).
// Envía las credenciales al route handler, que responde con una cookie
// httpOnly; el token JWT nunca se expone a JavaScript del navegador.
export default function FormularioLogin() {
    const router = useRouter();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const enviar = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
            const respuesta = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, password })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || "No se pudo iniciar sesión");
            }

            router.push("/panel");
            router.refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <form onSubmit={enviar}>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit" className="boton" disabled={cargando}>
                {cargando ? "Ingresando..." : "Iniciar sesión"}
            </button>

            {error && <p className="error">{error}</p>}

            <p className="nota">
                Usuario demo: <code>estudiante@isil.edu.pe</code> /{" "}
                <code>Demo123</code>
            </p>
        </form>
    );
}
