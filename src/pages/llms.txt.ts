import type { APIRoute } from 'astro';
import { getPublishedPosts, postPath } from '../lib/blog';

export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).toString();

  // Solo artículos publicados (en build se excluyen los borradores). Sin
  // artículos, la sección no aparece.
  const posts = await getPublishedPosts();
  const blogSection = posts.length
    ? `
## Blog

${posts.map((p) => `- [${p.data.title}](${url(postPath(p))}): ${p.data.description}`).join('\n')}
`
    : '';

  const body = `# Jorge Sergio Ramírez Lizárraga

> Coach de liderazgo comercial y planeación patrimonial y de retiro en México. Más de 40 años de trayectoria formando equipos comerciales (Coca-Cola, Cervecería Cuauhtémoc, Emyco, Sandler Training, NEXE, Grupo Jezreel GNP) y diseñando estrategias de retiro. El sitio permite agendar una sesión de diagnóstico gratuita 24/7.

## Servicios

- [Coaching de Ventas — Método CMV](${url('/coaching-de-ventas/')}): Coaching de ventas y formación de equipos comerciales para empresas (B2B). Crecimiento, Mentoría y Ventas.
- [Plan Personal de Retiro (PPR)](${url('/plan-personal-de-retiro-ppr/')}): Estrategia personalizada de ahorro para el retiro y protección patrimonial ante la inflación, para profesionales y empresarios de 35 a 65 años.
- [Agenda tu sesión](${url('/agenda/')}): Reserva automática 24/7 de una sesión de Diagnóstico Comercial o Estrategia Patrimonial, sin costo.

## Sobre Jorge Sergio

- [Sobre Jorge Sergio Ramírez Lizárraga](${url('/sobre-jorge-sergio/')}): Historia, principios de liderazgo y trayectoria profesional.
${blogSection}
## Otros

- [Inicio](${url('/')}): Panorama general de ambos servicios.
- [Aviso de Privacidad](${url('/aviso-de-privacidad/')}): Tratamiento de datos personales conforme a la LFPDPPP.
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
