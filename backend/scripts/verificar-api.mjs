// Verificación automatizada de la API (evidencia de pruebas).
// Uso: node scripts/verificar-api.mjs [URL_BASE]
const BASE = process.argv[2] || process.env.API_URL || "http://localhost:3000/api";

let pasadas = 0;
let fallidas = 0;

const verificar = async (nombre, fn) => {
    try {
        await fn();
        pasadas += 1;
        console.log(`✔ ${nombre}`);
    } catch (error) {
        fallidas += 1;
        console.error(`✘ ${nombre}: ${error.message}`);
    }
};

const assert = (condicion, mensaje) => {
    if (!condicion) throw new Error(mensaje);
};

const json = async (respuesta) => {
    const cuerpo = await respuesta.json();
    return { estado: respuesta.status, cuerpo };
};

const ejecutar = async () => {
    console.log(`Verificando API en ${BASE}\n`);

    const correo = `prueba${Date.now()}@isil.edu.pe`;
    let token = "";

    await verificar("Health check responde OK", async () => {
        const { estado, cuerpo } = await json(await fetch(`${BASE}/health`));
        assert(estado === 200, `estado ${estado}`);
        assert(cuerpo.estado === "OK", "campo estado distinto de OK");
    });

    await verificar("Listado público de solicitudes", async () => {
        const { estado, cuerpo } = await json(await fetch(`${BASE}/solicitudes`));
        assert(estado === 200, `estado ${estado}`);
        assert(Array.isArray(cuerpo.solicitudes) && cuerpo.solicitudes.length >= 6, "sin datos");
    });

    await verificar("Detalle público de solicitud por código", async () => {
        const { estado, cuerpo } = await json(await fetch(`${BASE}/solicitudes/SOL-2026-001`));
        assert(estado === 200, `estado ${estado}`);
        assert(cuerpo.solicitud.codigo === "SOL-2026-001", "código incorrecto");
    });

    await verificar("Solicitud inexistente devuelve 404", async () => {
        const { estado } = await json(await fetch(`${BASE}/solicitudes/SOL-9999-999`));
        assert(estado === 404, `estado ${estado}`);
    });

    await verificar("Registro de usuario devuelve token", async () => {
        const { estado, cuerpo } = await json(await fetch(`${BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: "Prueba PA4", correo, password: "Secreta123" })
        }));
        assert(estado === 201, `estado ${estado}`);
        assert(typeof cuerpo.token === "string" && cuerpo.token.split(".").length === 3, "token JWT inválido");
        token = cuerpo.token;
    });

    await verificar("Registro duplicado devuelve 409", async () => {
        const { estado } = await json(await fetch(`${BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: "Prueba PA4", correo, password: "Secreta123" })
        }));
        assert(estado === 409, `estado ${estado}`);
    });

    await verificar("Login con credenciales correctas", async () => {
        const { estado, cuerpo } = await json(await fetch(`${BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password: "Secreta123" })
        }));
        assert(estado === 200, `estado ${estado}`);
        assert(cuerpo.usuario.correo === correo, "usuario incorrecto");
    });

    await verificar("Login con contraseña incorrecta devuelve 401", async () => {
        const { estado } = await json(await fetch(`${BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password: "incorrecta" })
        }));
        assert(estado === 401, `estado ${estado}`);
    });

    await verificar("Perfil sin token devuelve 401", async () => {
        const { estado } = await json(await fetch(`${BASE}/auth/perfil`));
        assert(estado === 401, `estado ${estado}`);
    });

    await verificar("Perfil con token devuelve el usuario", async () => {
        const { estado, cuerpo } = await json(await fetch(`${BASE}/auth/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        }));
        assert(estado === 200, `estado ${estado}`);
        assert(cuerpo.usuario.correo === correo, "correo incorrecto");
    });

    await verificar("Crear solicitud sin token devuelve 401", async () => {
        const { estado } = await json(await fetch(`${BASE}/solicitudes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo: "Prueba", tipo: "Beca", descripcion: "descripción válida" })
        }));
        assert(estado === 401, `estado ${estado}`);
    });

    await verificar("Crear solicitud con token devuelve 201", async () => {
        const { estado, cuerpo } = await json(await fetch(`${BASE}/solicitudes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                titulo: "Solicitud creada desde prueba automatizada",
                tipo: "Beca",
                descripcion: "Descripción de prueba con longitud suficiente.",
                prioridad: "Alta"
            })
        }));
        assert(estado === 201, `estado ${estado}`);
        assert(cuerpo.solicitud.estado === "Pendiente", "estado inicial incorrecto");
    });

    await verificar("Validación de campos en creación", async () => {
        const { estado } = await json(await fetch(`${BASE}/solicitudes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ titulo: "abc", tipo: "Otro", descripcion: "corta" })
        }));
        assert(estado === 400, `estado ${estado}`);
    });

    console.log(`\nResultado: ${pasadas} pruebas pasadas, ${fallidas} fallidas`);
    process.exit(fallidas === 0 ? 0 : 1);
};

ejecutar();
