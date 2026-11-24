
const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    try {
        // Obtener el token del encabezado
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                mensaje: "Acceso denegado. No se proporcionó un token."
            });
        }

        // Extraer el token
        const token = authHeader.split(" ")[1];

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guardar los datos del usuario en la solicitud
        req.usuario = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido o expirado."
        });
    }
};

module.exports = verificarToken;
