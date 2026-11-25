import { NextResponse } from "next/server";
import { obtenerSesion } from "@/lib/sesion";

// GET /api/auth/perfil — devuelve el usuario autenticado (requiere JWT)
export async function GET() {
    const sesion = await obtenerSesion();

    if (!sesion) {
        return NextResponse.json(
            { mensaje: "Acceso denegado. Token ausente o inválido." },
            { status: 401 }
        );
    }

    return NextResponse.json({
        mensaje: "Acceso autorizado al perfil",
        usuario: {
            id: sesion.id,
            nombre: sesion.nombre,
            correo: sesion.correo,
            rol: sesion.rol
        }
    });
}
