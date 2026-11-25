import { useState } from "react";

const TIPOS = [
    "Beca",
    "Convalidación",
    "Certificado",
    "Matrícula",
    "Cambio de sección",
    "Tutoría"
];

const FormularioSolicitud = ({ alCrear, cargando, mensaje }) => {
    const [titulo, setTitulo] = useState("");
    const [tipo, setTipo] = useState(TIPOS[0]);
    const [prioridad, setPrioridad] = useState("Media");
    const [descripcion, setDescripcion] = useState("");

    const enviar = async (e) => {
        e.preventDefault();
        const exito = await alCrear({ titulo, tipo, prioridad, descripcion });

        if (exito) {
            setTitulo("");
            setDescripcion("");
            setPrioridad("Media");
            setTipo(TIPOS[0]);
        }
    };

    return (
        <section className="tarjeta formulario-solicitud">
            <h2>Nueva solicitud académica</h2>

            <form className="formulario" onSubmit={enviar}>
                <input
                    type="text"
                    placeholder="Título de la solicitud"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    minLength={5}
                />

                <div className="fila">
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        {TIPOS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <select
                        value={prioridad}
                        onChange={(e) => setPrioridad(e.target.value)}
                    >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>

                <textarea
                    placeholder="Descripción (mínimo 10 caracteres)"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    minLength={10}
                    rows={3}
                />

                <button type="submit" disabled={cargando}>
                    {cargando ? "Enviando..." : "Registrar solicitud"}
                </button>
            </form>

            {mensaje && <p className="mensaje">{mensaje}</p>}
        </section>
    );
};

export default FormularioSolicitud;
