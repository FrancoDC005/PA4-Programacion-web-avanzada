"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Cierra la sesión eliminando la cookie httpOnly desde el servidor.
export default function BotonLogout() {
    const router = useRouter();
    const [saliendo, setSaliendo] = useState(false);

    const cerrarSesion = async () => {
        setSaliendo(true);

        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } finally {
            setSaliendo(false);
        }
    };

    return (
        <button
            type="button"
            className="boton secundario"
            onClick={cerrarSesion}
            disabled={saliendo}
        >
            {saliendo ? "Saliendo..." : "Cerrar sesión"}
        </button>
    );
}
