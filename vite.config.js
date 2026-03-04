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
            "nuevo-web-padron-ia.3pkgp0.easypanel.host"
        ]
    }
});
