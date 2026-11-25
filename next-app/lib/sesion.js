// Sesión JWT almacenada en cookie httpOnly (Tema 11: almacenamiento seguro).
// El token nunca es accesible desde JavaScript del navegador; solo el
// servidor de Next.js lo lee y valida.
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NOMBRE_COOKIE, opcionesCookie } from "./constantes";

export { NOMBRE_COOKIE, opcionesCookie };

const secreto = () =>
    new TextEncoder().encode(
        process.env.JWT_SECRET || "secreto_desarrollo_pa4"
    );

export const crearToken = async (usuario) => {
    return await new SignJWT({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secreto());
};

export const verificarToken = async (token) => {
    try {
        const { payload } = await jwtVerify(token, secreto());
        return payload;
    } catch {
        return null;
    }
};

export const obtenerSesion = async () => {
    const almacen = await cookies();
    const token = almacen.get(NOMBRE_COOKIE)?.value;

    if (!token) return null;

    return await verificarToken(token);
};
