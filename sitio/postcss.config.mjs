// Vacío a propósito: sin esto, Astro hereda el postcss/tailwind del proyecto padre
// (la app Vite) e inyecta CSS que aquí no queremos.
export default { plugins: {} };
