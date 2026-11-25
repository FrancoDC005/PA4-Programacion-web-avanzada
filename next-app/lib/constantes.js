// Constantes compartidas entre middleware (Edge Runtime) y servidor.
// Este archivo NO importa next/headers para poder usarse en el middleware.
export const NOMBRE_COOKIE = "sesion_pa4";

export const opcionesCookie = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60
};
