
const bcrypt = require("bcryptjs");
const generarToken = require("../utils/generateToken");

// Almacenamiento temporal de usuarios
const usuarios = [];

// REGISTRAR USUARIO
const registrar = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        const existeUsuario = usuarios.find(
            usuario => usuario.correo === correo.toLowerCase()
        );

        if (existeUsuario) {
            return res.status(409).json({
                mensaje: "El correo ya está registrado"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = {
            id: Date.now(),
            nombre,
            correo: correo.toLowerCase(),
            password: passwordHash,
            rol: "usuario"
        };

        usuarios.push(nuevoUsuario);

        const token = generarToken(nuevoUsuario);

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
                rol: nuevoUsuario.rol
            },
            token
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar usuario"
        });
    }
};

// INICIAR SESIÓN
const iniciarSesion = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                mensaje: "Correo y contraseña son obligatorios"
            });
        }

        const usuario = usuarios.find(
            usuario => usuario.correo === correo.toLowerCase()
        );

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const token = generarToken(usuario);

        res.json({
            mensaje: "Inicio de sesión exitoso",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            },
            token
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });
    }
};

module.exports = {
    registrar,
    iniciarSesion
};
