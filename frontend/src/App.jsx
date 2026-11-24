
import { useEffect, useState } from "react";
import {
  iniciarSesion,
  obtenerPerfil
} from "./api/authService";
import "./App.css";

function App() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);

  // Recuperar la sesión guardada
  const [usuario, setUsuario] = useState(() => {
    try {
      const usuarioGuardado = sessionStorage.getItem("usuario");

      return usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : null;
    } catch (error) {
      sessionStorage.removeItem("usuario");
      sessionStorage.removeItem("token");
      return null;
    }
  });
  // Validar automáticamente la sesión con el backend
  useEffect(() => {
    const validarSesion = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setUsuario(null);
        setPerfil(null);
        sessionStorage.removeItem("usuario");
        return;
      }

      try {
        const respuesta = await obtenerPerfil(token);

        setUsuario(respuesta.usuario);
        setPerfil(respuesta.usuario);

      } catch (error) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");

        setUsuario(null);
        setPerfil(null);
      }
    };

    validarSesion();
  }, []);

  // Iniciar sesión
  const manejarLogin = async (e) => {
    e.preventDefault();

    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await iniciarSesion({
        correo,
        password
      });

      // Guardar token y usuario
      sessionStorage.setItem("token", respuesta.token);

      sessionStorage.setItem(
        "usuario",
        JSON.stringify(respuesta.usuario)
      );

      setUsuario(respuesta.usuario);
      setPassword("");

      setMensaje(
        "Inicio de sesión exitoso. Bienvenido, " +
        respuesta.usuario.nombre
      );

    } catch (error) {
      setMensaje(error.message);

    } finally {
      setCargando(false);
    }
  };
  // Consultar perfil protegido con JWT

  const consultarPerfil = async () => {
    setCargandoPerfil(true);
    setMensaje("");
    setPerfil(null);

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de sesión");
      }

      const respuesta = await obtenerPerfil(token);

      setPerfil(respuesta.usuario);
      setMensaje("Perfil protegido consultado correctamente");

    } catch (error) {
      setMensaje(error.message);

    } finally {
      setCargandoPerfil(false);
    }
  };
  // Cerrar sesión
  const cerrarSesion = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    setUsuario(null);
    setPerfil(null);
    setCorreo("");
    setPassword("");
    setMensaje("");
  };

  return (
    <main className="contenedor">
      <section className="tarjeta-login">

        {usuario ? (
          <>
            <h1>Gestión Académica</h1>

            <p className="subtitulo">
              Plataforma de Gestión de Solicitudes Académicas
            </p>

            <h2>¡Bienvenido, {usuario.nombre}!</h2>

            <p>
              Correo: {usuario.correo}
            </p>

            <p>
              Rol: {usuario.rol}
            </p>

            <p className="mensaje">
              Sesión iniciada correctamente.
            </p>
            <button
              onClick={consultarPerfil}
              disabled={cargandoPerfil}
            >
              {cargandoPerfil
                ? "Consultando perfil..."
                : "Consultar mi perfil"}
            </button>

            {perfil && (
              <div className="mensaje">
                <h3>Perfil validado por el servidor</h3>
                <p>Nombre: {perfil.nombre}</p>
                <p>Correo: {perfil.correo}</p>
                <p>Rol: {perfil.rol}</p>
              </div>
            )}

            <button onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <h1>Gestión Académica</h1>

            <p className="subtitulo">
              Plataforma de Gestión de Solicitudes Académicas
            </p>

            <form
              className="formulario"
              onSubmit={manejarLogin}
            >
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

              <button type="submit" disabled={cargando}>
                {cargando
                  ? "Ingresando..."
                  : "Iniciar sesión"}
              </button>
            </form>

            {mensaje && (
              <p className="mensaje">{mensaje}</p>
            )}
          </>
        )}

      </section>
    </main>
  );
}

export default App;
