import { useState } from "react";

const FormularioLogin = ({ alIniciarSesion, alRegistrar, cargando, mensaje }) => {
    const [modo, setModo] = useState("login");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const enviar = (e) => {
        e.preventDefault();

        if (modo === "login") {
            alIniciarSesion({ correo, password });
        } else {
            alRegistrar({ nombre, correo, password });
        }
    };

    return (
        <section className="tarjeta">
            <h1>Gestión Académica</h1>
            <p className="subtitulo">
                Plataforma de Gestión de Solicitudes Académicas
            </p>

            <div className="tabs">
                <button
                    type="button"
                    className={modo === "login" ? "activo" : ""}
                    onClick={() => setModo("login")}
                >
                    Iniciar sesión
                </button>
                <button
                    type="button"
                    className={modo === "registro" ? "activo" : ""}
                    onClick={() => setModo("registro")}
                >
                    Registrarse
                </button>
            </div>

            <form className="formulario" onSubmit={enviar}>
                {modo === "registro" && (
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        minLength={3}
                    />
                )}

                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />

                <button type="submit" disabled={cargando}>
                    {cargando
                        ? "Procesando..."
                        : modo === "login"
                            ? "Iniciar sesión"
                            : "Crear cuenta"}
                </button>
            </form>

            {mensaje && <p className="mensaje error">{mensaje}</p>}

            <p className="nota-demo">
                Usuario demo: <code>estudiante@isil.edu.pe</code> / <code>Demo123</code>
            </p>
        </section>
    );
};

export default FormularioLogin;
