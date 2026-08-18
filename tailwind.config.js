/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                moss: {
                    green: "#2E4036",
                },
                clay: "#2563EB",
                cream: "#F2F0E9",
                coal: "#1A1A1A",
            },
            fontFamily: {
                sans: ["'Plus Jakarta Sans'", "sans-serif"],
                outfit: ["Outfit", "sans-serif"],
                serif: ["'Cormorant Garamond'", "serif"],
                mono: ["'Space Mono'", "monospace"], // Using Space Mono for telemetry as it feels premium
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
