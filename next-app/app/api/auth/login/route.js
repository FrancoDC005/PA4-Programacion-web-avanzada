import { NextResponse } from "next/server";
import { verificarCredenciales, datosPublicos } from "@/lib/usuarios";
import { crearToken, NOMBRE_COOKIE, opcionesCookie } from "@/lib/sesion";
import { logger } from "@/lib/logger";

// POST /api/auth/login — valida credenciales y emite el JWT en cookie httpOnly
export async function POST(request) {
    try {
        const { correo, password } = await request.json();

        if (!correo || !password) {
            return NextResponse.json(
                { mensaje: "Correo y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        const usuario = await verificarCredenciales(correo, password);

        if (!usuario) {
            logger.warn("Login fallido en Next.js", { correo });
            return NextResponse.json(
                { mensaje: "Credenciales incorrectas" },
                { status: 401 }
            );
        }

        const token = await crearToken(usuario);

        logger.info("Login exitoso en Next.js", { correo: usuario.correo });

        const respuesta = NextResponse.json({
            mensaje: "Inicio de sesión exitoso",
            usuario: datosPublicos(usuario)
        });

        respuesta.cookies.set(NOMBRE_COOKIE, token, opcionesCookie);

        return respuesta;
    } catch (error) {
        logger.error("Error en login", { mensaje: error.message });
        return NextResponse.json(
            { mensaje: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
