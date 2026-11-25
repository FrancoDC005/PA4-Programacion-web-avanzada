const bcrypt = require("bcryptjs");
const generarToken = require("../utils/generateToken");
const { buscarPorCorreo, agregarUsuario } = require("../data/usuarios");
const { validarCorreo, validarPassword } = require("../utils/validators");
const logger = require("../utils/logger");

// REGISTRAR USUARIO
const registrar = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        if (!validarCorreo(correo)) {
            return res.status(400).json({
                mensaje: "El correo no tiene un formato válido"
            });
        }

        if (!validarPassword(password)) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        const existeUsuario = buscarPorCorreo(correo);

        if (existeUsuario) {
            return res.status(409).json({
                mensaje: "El correo ya está registrado"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = agregarUsuario({
            id: Date.now(),
            nombre,
            correo: correo.toLowerCase(),
            password: passwordHash,
            rol: "usuario"
        });

        const token = generarToken(nuevoUsuario);

        logger.info("Usuario registrado", { correo: nuevoUsuario.correo });

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
        logger.error("Error al registrar usuario", { mensaje: error.message });
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

        const usuario = buscarPorCorreo(correo);

        if (!usuario) {
            logger.warn("Intento de login con correo inexistente", { correo });
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            logger.warn("Intento de login con contraseña inválida", { correo });
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const token = generarToken(usuario);

        logger.info("Inicio de sesión exitoso", { correo: usuario.correo });

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
        logger.error("Error al iniciar sesión", { mensaje: error.message });
        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });
    }
};

module.exports = { registrar, iniciarSesion };
