import { NextResponse } from "next/server";

// GET /api/health — endpoint de monitoreo (usado por Vercel y verificaciones)
export async function GET() {
    return NextResponse.json({
        estado: "OK",
        servicio: "pa4-next",
        entorno: process.env.NODE_ENV || "development",
        fecha: new Date().toISOString(),
        uptimeSegundos: Number(process.uptime().toFixed(1)),
        memoriaMB: Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1))
    });
}
