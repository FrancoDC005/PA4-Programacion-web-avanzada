import api from "./axios";
import { validarRespuesta } from "../utils/validarRespuesta";

// Listado público de solicitudes (permite filtros por estado y tipo)
export const listarSolicitudes = async (filtros = {}) => {
    try {
        const respuesta = await api.get("/solicitudes", { params: filtros });

        validarRespuesta(respuesta.data, ["solicitudes"], "listado");

        if (!Array.isArray(respuesta.data.solicitudes)) {
            throw new Error("La respuesta no tiene el formato esperado");
        }

        return respuesta.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            (error.request ? "No se pudo conectar con el servidor" : null) ||
            "Error al listar las solicitudes"
        );
    }
};

// Detalle de una solicitud por código
export const obtenerSolicitud = async (codigo) => {
    try {
        const respuesta = await api.get(`/solicitudes/${codigo}`);

        validarRespuesta(respuesta.data, ["solicitud"], "detalle");

        return respuesta.data.solicitud;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            (error.request ? "No se pudo conectar con el servidor" : null) ||
            "Error al obtener la solicitud"
        );
    }
};

// Crear solicitud (requiere token JWT)
export const crearSolicitud = async (datos) => {
    try {
        const respuesta = await api.post("/solicitudes", datos);

        validarRespuesta(respuesta.data, ["solicitud"], "creación");

        return respuesta.data.solicitud;
    } catch (error) {
        throw new Error(
            error.response?.data?.mensaje ||
            (error.request ? "No se pudo conectar con el servidor" : null) ||
            "Error al crear la solicitud"
        );
    }
};
