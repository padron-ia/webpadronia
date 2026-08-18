import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: true
    },
    preview: {
        host: true,
        allowedHosts: [
            // Tras el corte del dominio (ago-2026) esta app vive aqui:
            "portal.padron-ia.es",
            // Se mantienen hasta que el corte este hecho y verificado.
            "padron-ia.es",
            "www.padron-ia.es",
            "nuevo-web-padron-ia.3pkgp0.easypanel.host"
        ]
    }
});
