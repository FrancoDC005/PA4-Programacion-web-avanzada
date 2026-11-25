import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { NOMBRE_COOKIE } from "@/lib/constantes";

// Middleware de protección de rutas privadas (Tema 11 + seguridad).
// Verifica el JWT de la cookie httpOnly antes de permitir el acceso a
// /panel; si no hay sesión válida, redirige a /login.
const secreto = () =>
    new TextEncoder().encode(process.env.JWT_SECRET || "secreto_desarrollo_pa4");

export async function middleware(request) {
    const token = request.cookies.get(NOMBRE_COOKIE)?.value;

    if (token) {
        try {
            await jwtVerify(token, secreto());
            return NextResponse.next();
        } catch {
            // Token inválido o expirado: continúa al redirect
        }
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("motivo", "sesion-requerida");

    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/panel/:path*"]
};
