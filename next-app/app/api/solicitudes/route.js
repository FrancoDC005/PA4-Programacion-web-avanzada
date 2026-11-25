import { NextResponse } from "next/server";
import { obtenerSolicitudes } from "@/lib/api";
import { logger } from "@/lib/logger";

// GET /api/solicitudes?estado=... — API route que reexpone el listado
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado") || undefined;

    try {
        const solicitudes = await obtenerSolicitudes({ estado });

        logger.info("API route de solicitudes consultada", {
            estado: estado || "todos",
            total: solicitudes.length
        });

        return NextResponse.json({
            total: solicitudes.length,
            solicitudes
        });
    } catch (error) {
        logger.error("Error en API route de solicitudes", {
            mensaje: error.message
        });

        return NextResponse.json(
            { mensaje: "Error al obtener las solicitudes" },
            { status: 500 }
        );
    }
}
