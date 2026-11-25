import api from "./axios";
import { validarRespuesta } from "../utils/validarRespuesta";

// Registrar un usuario
export const registrarUsuario = async (datos) => {
    try {
        const respuesta = await api.post("/auth/register", datos);

        validarRespuesta(respuesta.data, ["token", "usuario"], "registro");

        return respuesta.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            (error.request ? "No se pudo conectar con el servidor" : null) ||
            "Error al registrar el usuario"
        );
    }
};

// Iniciar sesión
export const iniciarSesion = async (datos) => {
    try {
        const respuesta = await api.post("/auth/login", datos);

        validarRespuesta(respuesta.data, ["token", "usuario"], "login");

        if (typeof respuesta.data.token !== "string") {
            throw new Error("El token recibido no es válido");
        }

        return respuesta.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            (error.request ? "No se pudo conectar con el servidor" : null) ||
            "Error al iniciar sesión"
        );
    }
};

// Consultar perfil protegido
export const obtenerPerfil = async () => {
    try {
        const respuesta = await api.get("/auth/perfil");

        validarRespuesta(respuesta.data, ["usuario"], "perfil");

        return respuesta.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            (error.request ? "No se pudo conectar con el servidor" : null) ||
            "No se pudo obtener el perfil"
        );
    }
};
