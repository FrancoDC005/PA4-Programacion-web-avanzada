import { useCallback, useEffect, useState } from "react";
import FormularioLogin from "./components/FormularioLogin";
import FormularioSolicitud from "./components/FormularioSolicitud";
import TarjetaSolicitud from "./components/TarjetaSolicitud";
import DetalleSolicitud from "./components/DetalleSolicitud";
import {
  iniciarSesion,
  obtenerPerfil,
  registrarUsuario
} from "./api/authService";
import {
  listarSolicitudes,
  crearSolicitud
} from "./api/solicitudesService";
import { logger } from "./utils/logger";
import configuracion from "./config/configuracion";
import "./App.css";

const ESTADOS = ["Todos", "Pendiente", "En revisión", "Aprobada", "Rechazada"];

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargandoAuth, setCargandoAuth] = useState(false);
  const [validandoSesion, setValidandoSesion] = useState(true);

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(false);
  const [errorSolicitudes, setErrorSolicitudes] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [detalle, setDetalle] = useState(null);
  const [creando, setCreando] = useState(false);
  const [mensajeCreacion, setMensajeCreacion] = useState("");

  // ---------------------------------------------------------------
  // Sesión JWT: al recargar, se valida el token contra el backend
  // ---------------------------------------------------------------
  useEffect(() => {
    const validarSesion = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setValidandoSesion(false);
        return;
      }

      try {
        const respuesta = await obtenerPerfil();
        setUsuario(respuesta.usuario);
        logger.info("Sesión restaurada y validada por el servidor");
      } catch (error) {
        logger.warn("Sesión no válida, se limpia el almacenamiento", {
          motivo: error.message
        });
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
        setUsuario(null);
      } finally {
        setValidandoSesion(false);
      }
    };

    validarSesion();
  }, []);

  // Escucha el evento emitido por el interceptor de axios
  useEffect(() => {
    const manejarExpiracion = () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("usuario");
      setUsuario(null);
      setMensaje("Tu sesión expiró. Vuelve a iniciar sesión.");
    };

    window.addEventListener("sesion-expirada", manejarExpiracion);
    return () => window.removeEventListener("sesion-expirada", manejarExpiracion);
  }, []);

  // ---------------------------------------------------------------
  // Carga de solicitudes
  // ---------------------------------------------------------------
  const cargarSolicitudes = useCallback(async (estado = "Todos") => {
    setCargandoSolicitudes(true);
    setErrorSolicitudes("");

    try {
      const filtros = estado === "Todos" ? {} : { estado };
      const datos = await listarSolicitudes(filtros);

      setSolicitudes(datos.solicitudes);
      logger.info("Solicitudes cargadas desde la API", {
        total: datos.total,
        filtro: estado
      });
    } catch (error) {
      setErrorSolicitudes(error.message);
      logger.error("Error al cargar solicitudes", { mensaje: error.message });
    } finally {
      setCargandoSolicitudes(false);
    }
  }, []);

  useEffect(() => {
    cargarSolicitudes(filtroEstado);
  }, [filtroEstado, cargarSolicitudes]);

  // ---------------------------------------------------------------
  // Autenticación
  // ---------------------------------------------------------------
  const manejarLogin = async (credenciales) => {
    setMensaje("");
    setCargandoAuth(true);

    try {
      const respuesta = await iniciarSesion(credenciales);

      sessionStorage.setItem("token", respuesta.token);
      sessionStorage.setItem("usuario", JSON.stringify(respuesta.usuario));

      setUsuario(respuesta.usuario);
      logger.info("Inicio de sesión exitoso", { correo: respuesta.usuario.correo });
    } catch (error) {
      setMensaje(error.message);
      logger.error("Fallo de inicio de sesión", { mensaje: error.message });
    } finally {
      setCargandoAuth(false);
    }
  };

  const manejarRegistro = async (datos) => {
    setMensaje("");
    setCargandoAuth(true);

    try {
      const respuesta = await registrarUsuario(datos);

      sessionStorage.setItem("token", respuesta.token);
      sessionStorage.setItem("usuario", JSON.stringify(respuesta.usuario));

      setUsuario(respuesta.usuario);
      logger.info("Usuario registrado y sesión iniciada");
    } catch (error) {
      setMensaje(error.message);
      logger.error("Fallo de registro", { mensaje: error.message });
    } finally {
      setCargandoAuth(false);
    }
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    setUsuario(null);
    setMensaje("");
    setDetalle(null);
    logger.info("Sesión cerrada por el usuario");
  };

  // ---------------------------------------------------------------
  // Creación de solicitudes (ruta protegida con JWT)
  // ---------------------------------------------------------------
  const manejarCreacion = async (datos) => {
    setCreando(true);
    setMensajeCreacion("");

    try {
      const nueva = await crearSolicitud(datos);

      setMensajeCreacion(`Solicitud ${nueva.codigo} registrada correctamente.`);
      logger.info("Solicitud creada desde React", { codigo: nueva.codigo });
      await cargarSolicitudes(filtroEstado);
      return true;
    } catch (error) {
      setMensajeCreacion(error.message);
      logger.error("Error al crear la solicitud", { mensaje: error.message });
      return false;
    } finally {
      setCreando(false);
    }
  };

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  if (validandoSesion) {
    return (
      <main className="contenedor">
        <p className="cargando">Validando sesión...</p>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="contenedor">
        <FormularioLogin
          alIniciarSesion={manejarLogin}
          alRegistrar={manejarRegistro}
          cargando={cargandoAuth}
          mensaje={mensaje}
        />
      </main>
    );
  }

  return (
    <main className="contenedor-app">
      <header className="cabecera">
        <div>
          <h1>Gestión Académica</h1>
          <p className="subtitulo">
            Plataforma de Gestión de Solicitudes Académicas ·{" "}
            {configuracion.entorno}
          </p>
        </div>

        <div className="sesion">
          <span>
            {usuario.nombre} <small>({usuario.rol})</small>
          </span>
          <button type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="panel">
        <div className="filtros">
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              type="button"
              className={filtroEstado === estado ? "activo" : ""}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

        {cargandoSolicitudes && <p className="cargando">Cargando solicitudes...</p>}

        {errorSolicitudes && (
          <div className="mensaje error">
            {errorSolicitudes}{" "}
            <button type="button" onClick={() => cargarSolicitudes(filtroEstado)}>
              Reintentar
            </button>
          </div>
        )}

        {!cargandoSolicitudes && !errorSolicitudes && (
          <div className="lista-solicitudes">
            {solicitudes.length === 0 ? (
              <p className="cargando">No hay solicitudes con este filtro.</p>
            ) : (
              solicitudes.map((solicitud) => (
                <TarjetaSolicitud
                  key={solicitud.codigo}
                  solicitud={solicitud}
                  alVerDetalle={setDetalle}
                />
              ))
            )}
          </div>
        )}
      </section>

      <FormularioSolicitud
        alCrear={manejarCreacion}
        cargando={creando}
        mensaje={mensajeCreacion}
      />

      {detalle && (
        <DetalleSolicitud solicitud={detalle} alCerrar={() => setDetalle(null)} />
      )}
    </main>
  );
}

export default App;
