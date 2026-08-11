import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).toString();

  const body = `# Jorge Sergio Ramírez Lizárraga

> Coach de liderazgo comercial y planeación patrimonial y de retiro en México. Más de 40 años de trayectoria formando equipos comerciales (Coca-Cola, Cervecería Cuauhtémoc, Emyco, Sandler Training, NEXE, Grupo Jezreel GNP) y diseñando estrategias de retiro. El sitio permite agendar una sesión de diagnóstico gratuita 24/7.

## Servicios

- [Liderazgo Comercial — Método CMV](${url('/liderazgo-comercial-cmv/')}): Coaching de liderazgo comercial y formación de equipos de venta para empresas (B2B). Crecimiento, Mentoría y Ventas.
- [Planeación Patrimonial y de Retiro (PPR)](${url('/planeacion-patrimonial-retiro/')}): Estrategia personalizada de ahorro para el retiro y protección patrimonial ante la inflación, para profesionales y empresarios de 35 a 65 años.
- [Agenda tu sesión](${url('/agenda/')}): Reserva automática 24/7 de una sesión de Diagnóstico Comercial o Estrategia Patrimonial, sin costo.

## Sobre Jorge Sergio

- [Sobre Jorge Sergio Ramírez Lizárraga](${url('/sobre-jorge-sergio/')}): Historia, principios de liderazgo y trayectoria profesional.

## Otros

- [Inicio](${url('/')}): Panorama general de ambos servicios.
- [Aviso de Privacidad](${url('/aviso-de-privacidad/')}): Tratamiento de datos personales conforme a la LFPDPPP.
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
