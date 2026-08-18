import { defineConfig } from "astro/config";

// Sitio público de Padrón IA: HTML estático, cero JavaScript por defecto.
// El portal de cliente y /centro NO viven aquí: siguen en la app Vite.
export default defineConfig({
    site: "https://padron-ia.es",
    build: { inlineStylesheets: "auto" },
    server: { host: true, port: 4321 }
});
