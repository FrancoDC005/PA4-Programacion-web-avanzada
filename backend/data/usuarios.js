const bcrypt = require("bcryptjs");

// Almacenamiento temporal en memoria.
// Según el alcance de la PA4 (corte Sesión 13), la persistencia con
// MongoDB Atlas corresponde a la Evaluación Integral; por eso los datos
// viven en memoria durante la ejecución del servidor.
const usuarios = [];

const sembrarUsuariosDemo = async () => {
    const semilla = [
        {
            id: 1,
            nombre: "Estudiante Demo",
            correo: "estudiante@isil.edu.pe",
            password: "Demo123",
            rol: "usuario"
        },
        {
            id: 2,
            nombre: "Admin Académico",
            correo: "admin@isil.edu.pe",
            password: "Admin123",
            rol: "admin"
        }
    ];

    for (const usuario of semilla) {
        usuarios.push({
            ...usuario,
            password: await bcrypt.hash(usuario.password, 10)
        });
    }
};

const buscarPorCorreo = (correo) =>
    usuarios.find((usuario) => usuario.correo === correo.toLowerCase());

const agregarUsuario = (usuario) => {
    usuarios.push(usuario);
    return usuario;
};

module.exports = { usuarios, sembrarUsuariosDemo, buscarPorCorreo, agregarUsuario };
