/**
 * Fuente única de configuración del sitio. Todo lo que dependa de dominio,
 * cuenta de Calendly o slugs de evento debe importar de aquí — nunca
 * hardcodear estos valores en un componente o página.
 */

// TODO: reemplazar cuando exista dominio final. Mientras tanto se despliega
// a Cloudflare Pages y este valor se sobreescribe con PUBLIC_SITE_URL en
// build (mismo valor que `site` en astro.config.mjs).
export const SITE_URL =
  import.meta.env.PUBLIC_SITE_URL || 'https://jorge-sergio-ramirez.pages.dev';

export const SITE_NAME = 'Jorge Sergio Ramírez Lizárraga';

export const SITE_DESCRIPTION =
  'Coaching de liderazgo comercial y planeación patrimonial y de retiro. Más de 40 años de trayectoria. Agenda tu diagnóstico o estrategia sin costo.';

// TODO: reemplazar por la cuenta real de Calendly del cliente. La
// integración completa (lazy-load, deep-link, UTM, fallback) ya está lista
// para apuntar aquí — cambiar estos tres valores es suficiente.
export const CALENDLY_BASE = 'https://calendly.com/jorge-sergio-ramirez';

export const CALENDLY_EVENTS = {
  cmv: 'diagnostico-comercial',
  ppr: 'estrategia-patrimonial',
} as const;

export type EventType = keyof typeof CALENDLY_EVENTS;

export function calendlyUrl(tipo: EventType): string {
  return `${CALENDLY_BASE}/${CALENDLY_EVENTS[tipo]}`;
}

export const CONTACT = {
  // TODO: correo/teléfono real de contacto para el aviso de privacidad y JSON-LD.
  email: 'contacto@jorgesergioramirez.com',
};

export const NAV_LINKS = [
  { href: '/liderazgo-comercial-cmv/', label: 'Liderazgo Comercial' },
  { href: '/planeacion-patrimonial-retiro/', label: 'Planeación Patrimonial' },
  { href: '/sobre-jorge-sergio/', label: 'Sobre Jorge' },
] as const;

export const CAREER_HISTORY = [
  'Coca-Cola',
  'Cervecería Cuauhtémoc',
  'Emyco',
  'Sandler Training',
  'NEXE',
  'Grupo Jezreel GNP',
] as const;
