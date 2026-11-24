
import api from "./axios";

// Registrar un usuario
export const registrarUsuario = async (datos) => {
    try {
        const respuesta = await api.post("/auth/register", datos);
        return respuesta.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            "Error al registrar el usuario"
        );
    }
};

// Iniciar sesión
export const iniciarSesion = async (datos) => {
    try {
        const respuesta = await api.post("/auth/login", datos);
        return respuesta.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            "Error al iniciar sesión"
        );
    }
};

// Consultar perfil protegido
export const obtenerPerfil = async (token) => {
    try {
        const respuesta = await api.get("/auth/perfil", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return respuesta.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            "No se pudo obtener el perfil"
        );
    }
};
