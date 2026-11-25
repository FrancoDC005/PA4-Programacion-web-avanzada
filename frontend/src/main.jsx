import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { inicializarMonitoreo } from "./monitoring/globalErrorHandler";

// Monitoreo global de errores del navegador (Tema 13)
inicializarMonitoreo();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
