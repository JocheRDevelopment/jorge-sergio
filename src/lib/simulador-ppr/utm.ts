// CTAs del Simulador PPR → /agenda/ con los UTMs de la tabla "CTAs y medición"
// del brief (docs/seo/simulador-ppr/simulador-ppr.brief.md).
export type UbicacionCta = 'header' | 'resultado' | 'sticky' | 'ejemplo' | 'final';

export function agendaUrl(ubicacion: UbicacionCta): string {
  const utm = new URLSearchParams({
    utm_source: 'simulador-ppr',
    utm_medium: 'herramienta',
    utm_campaign: 'regalo-jorge',
    utm_content: ubicacion,
  });
  return `/agenda/?${utm}`;
}
