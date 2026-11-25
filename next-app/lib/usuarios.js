// Usuarios de demostración para la autenticación de la app Next.js.
// El backend Node.js es la fuente principal; este módulo permite que el
// despliegue de Vercel funcione de forma autónoma y segura.
import bcrypt from "bcryptjs";

const usuarios = [
    {
        id: 1,
        nombre: "Estudiante Demo",
        correo: "estudiante@isil.edu.pe",
        // Hash bcrypt de "Demo123"
        passwordHash:
            "$2b$10$vrzJly2y3zzi2J5RJewTEup3XkZkF35fOcB2rI0y.8pjUQC2yKKHa",
        rol: "usuario"
    },
    {
        id: 2,
        nombre: "Admin Académico",
        correo: "admin@isil.edu.pe",
        passwordHash:
            "$2b$10$JCJGpipKqg.a7nEzmtc1Qud0.61ZfQmgGdIUzNgMAMtSJKGtdcpve",
        rol: "admin"
    }
];

export const buscarUsuario = (correo) =>
    usuarios.find((u) => u.correo === correo.toLowerCase());

export const verificarCredenciales = async (correo, password) => {
    const usuario = buscarUsuario(correo);

    if (!usuario) return null;

    const valida = await bcrypt.compare(password, usuario.passwordHash);

    return valida ? usuario : null;
};

export const datosPublicos = (usuario) => ({
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol
});
