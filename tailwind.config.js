/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Identidad índigo v0 (Padrón IA) — 2026-07-14
                ink: "#1B1E3A",        // índigo profundo: brand dark, fondos oscuros, texto fuerte
                indigo: {
                    deep: "#1B1E3A",
                    soft: "#252A52",   // partner de degradado
                },
                lavender: "#8F9BFF",   // acento sobre fondo OSCURO + decoración (sobre claro falla contraste: usar iris)
                iris: "#5A67E8",       // acento de TEXTO sobre fondo claro (4.18:1 sobre bone, pasa WCAG texto grande)
                pearl: "#C9A86A",      // acento secundario (cuentagotas)
                bone: "#F2F3FB",       // blanco roto: fondos claros
                // Aliases legacy → mapeados a índigo para reskin sin tocar componentes:
                clay: "#8F9BFF",       // era azul #2563EB → ahora lavanda (selection, scrollbar, acentos)
                cream: "#F2F3FB",      // era crema → ahora blanco roto
                coal: "#1B1E3A",       // era negro → ahora índigo
                moss: { green: "#1B1E3A" },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                outfit: ["Inter", "sans-serif"],   // alias: titulares usan Inter (fuera Outfit)
                serif: ["Inter", "sans-serif"],     // alias: fuera Cormorant
                mono: ["'Space Mono'", "monospace"], // se conserva para cifras/telemetría (ángulo "sistemas reales con números")
            },
            borderRadius: {
                '3xl': '2rem',
                '4xl': '3rem',
            },
            backgroundImage: {
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            }
        },
    },
    plugins: [],
}
