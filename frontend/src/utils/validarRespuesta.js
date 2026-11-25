// Validación de la estructura de las respuestas de la API (Tema 11).
export const validarRespuesta = (datos, camposRequeridos, contexto = "API") => {
    if (!datos || typeof datos !== "object") {
        throw new Error(`La respuesta de ${contexto} está vacía o no es válida`);
    }

    for (const campo of camposRequeridos) {
        if (!(campo in datos)) {
            throw new Error(
                `La respuesta de ${contexto} no tiene el formato esperado (falta "${campo}")`
            );
        }
    }

    return datos;
};
