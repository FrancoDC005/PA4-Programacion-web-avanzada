import { NextResponse } from "next/server";
import { obtenerSolicitud } from "@/lib/api";

// GET /api/solicitudes/:codigo — detalle por código
export async function GET(request, { params }) {
    const { codigo } = await params;
    const solicitud = await obtenerSolicitud(codigo);

    if (!solicitud) {
        return NextResponse.json(
            { mensaje: "Solicitud no encontrada" },
            { status: 404 }
        );
    }

    return NextResponse.json({ solicitud });
}
