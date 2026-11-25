// Configuración centralizada desde variables de entorno (Tema 13).
// En Vite solo las variables con prefijo VITE_ se exponen al cliente.
const configuracion = {
    api: {
        urlBase: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
        timeout: 15000
    },
    entorno: import.meta.env.VITE_ENTORNO || import.meta.env.MODE,
    caracteristicas: {
        habilitarLogs: import.meta.env.VITE_HABILITAR_LOGS !== "false",
        modoDebug: import.meta.env.DEV
    },
    app: {
        nombre: "Gestión Académica",
        version: "1.0.0"
    }
};

export default configuracion;
