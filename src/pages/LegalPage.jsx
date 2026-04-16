import { useLocation, Link } from "react-router-dom";
import FloatingNavbar from "../components/FloatingNavbar";
import Footer from "../components/Footer";

const pages = {
    legal: {
        title: "Aviso legal",
        content: `
DATOS IDENTIFICATIVOS

En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se informa:

Titular: Jesús Martínez Padrón
NIF: 45714596A
Domicilio: Ronda del Santo Cristo del Perdón 5, 23486 Hinojares, Jaén
Email: hola@padronia.com
Teléfono: +34 664 40 13 28

OBJETO

Este sitio web tiene como finalidad la promoción de servicios de consultoría tecnológica y automatización con inteligencia artificial para empresas.

PROPIEDAD INTELECTUAL

Los contenidos de este sitio web (textos, imágenes, diseño, código fuente, logos) son propiedad de Jesús Martínez Padrón o de sus respectivos autores y están protegidos por la legislación de propiedad intelectual e industrial.

Queda prohibida su reproducción, distribución o transformación sin autorización expresa.

LIMITACIÓN DE RESPONSABILIDAD

Padrón IA no se hace responsable de los daños que pudieran derivarse del uso de la información contenida en esta web. Los enlaces a terceros son meramente informativos.

LEGISLACIÓN APLICABLE

Para la resolución de cualquier controversia, serán competentes los juzgados y tribunales de Jaén, con renuncia expresa a cualquier otro fuero.
        `
    },
    privacidad: {
        title: "Política de privacidad",
        content: `
RESPONSABLE DEL TRATAMIENTO

Jesús Martínez Padrón
NIF: 45714596A
Email: hola@padronia.com

FINALIDAD DEL TRATAMIENTO

Los datos personales recogidos a través del formulario de contacto se utilizan para:
- Responder a consultas y solicitudes de información
- Enviar presupuestos y propuestas comerciales
- Gestionar la relación comercial en caso de contratación

LEGITIMACIÓN

La base legal para el tratamiento es el consentimiento del interesado al enviar el formulario de contacto, así como el interés legítimo del responsable para la gestión comercial.

DESTINATARIOS

Los datos no se cederán a terceros salvo obligación legal. Se utilizan los siguientes encargados de tratamiento:
- Supabase (base de datos, servidores en EU)
- Billin (facturación electrónica)

CONSERVACIÓN

Los datos se conservarán mientras exista interés mutuo y, en todo caso, durante los plazos legales aplicables.

DERECHOS

Puedes ejercer tus derechos de acceso, rectificación, supresión, portabilidad, limitación y oposición escribiendo a hola@padronia.com, adjuntando copia de tu DNI.

Si consideras que el tratamiento no se ajusta a la normativa, puedes presentar reclamación ante la AEPD (www.aepd.es).
        `
    },
    cookies: {
        title: "Política de cookies",
        content: `
¿QUÉ SON LAS COOKIES?

Las cookies son pequeños archivos de texto que se almacenan en tu navegador al visitar un sitio web. Sirven para recordar preferencias y mejorar la experiencia de usuario.

COOKIES QUE UTILIZAMOS

Cookies técnicas (necesarias):
- Sesión de usuario (autenticación en el portal)
- Preferencias de navegación

Cookies analíticas:
- Google Analytics (GA4): para entender cómo se usa la web y mejorarla
- Facebook Pixel: para medir la efectividad de campañas publicitarias

GESTIÓN DE COOKIES

Puedes configurar tu navegador para rechazar cookies o eliminar las existentes. Ten en cuenta que desactivar las cookies técnicas puede afectar al funcionamiento del portal de clientes.

Para más información sobre cómo gestionar cookies en tu navegador:
- Chrome: chrome://settings/cookies
- Firefox: about:preferences#privacy
- Safari: Preferencias > Privacidad

ACTUALIZACIÓN

Esta política puede actualizarse. La fecha de última modificación aparece al final de este documento.

Última actualización: abril 2026.
        `
    }
};

export default function LegalPage() {
    const location = useLocation();
    const slug = location.pathname.replace("/", "");
    const page = pages[slug];

    if (!page) {
        return (
            <main className="min-h-screen bg-slate-50">
                <FloatingNavbar />
                <div className="px-6 pt-40 pb-20 text-center">
                    <h1 className="text-2xl text-slate-900">Página no encontrada</h1>
                    <Link to="/" className="mt-4 inline-block text-sm font-semibold text-slate-600 underline">Volver al inicio</Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <FloatingNavbar />
            <div className="px-6 pt-40 pb-20 sm:px-10 lg:px-16">
                <div className="mx-auto w-full max-w-3xl">
                    <Link to="/" className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 hover:text-slate-900">← Volver</Link>
                    <h1 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">{page.title}</h1>
                    <div className="mt-8 prose prose-slate prose-sm max-w-none">
                        {page.content.trim().split("\n\n").map((paragraph, i) => {
                            if (paragraph.trim().match(/^[A-ZÁÉÍÓÚÑ¿¡\s]+$/)) {
                                return <h2 key={i} className="mt-8 mb-3 text-lg font-semibold text-slate-900">{paragraph.trim()}</h2>;
                            }
                            if (paragraph.trim().startsWith("- ")) {
                                return (
                                    <ul key={i} className="mt-2 space-y-1 text-sm text-slate-600">
                                        {paragraph.trim().split("\n").map((item, j) => (
                                            <li key={j} className="flex gap-2">
                                                <span className="text-slate-400">-</span>
                                                <span>{item.replace(/^- /, "")}</span>
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }
                            return <p key={i} className="mt-3 text-sm leading-relaxed text-slate-600">{paragraph.trim()}</p>;
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
