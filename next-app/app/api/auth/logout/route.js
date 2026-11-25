import { NextResponse } from "next/server";
import { NOMBRE_COOKIE, opcionesCookie } from "@/lib/sesion";

// POST /api/auth/logout — elimina la cookie de sesión
export async function POST() {
    const respuesta = NextResponse.json({
        mensaje: "Sesión cerrada correctamente"
    });

    respuesta.cookies.set(NOMBRE_COOKIE, "", {
        ...opcionesCookie,
        maxAge: 0
    });

    return respuesta;
}
