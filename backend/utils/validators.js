// Validaciones reutilizables de entradas (Tema 11: validación de respuestas y datos)
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarCorreo = (correo) => CORREO_REGEX.test(correo);

const validarPassword = (password) => typeof password === "string" && password.length >= 6;

module.exports = { validarCorreo, validarPassword };
