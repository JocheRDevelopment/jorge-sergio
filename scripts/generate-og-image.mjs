// Genera public/og/og-default.jpg a partir de un SVG con los tokens reales
// de marca (navy + dorado, Source Serif 4). No depende de fotografía —
// mientras no exista una imagen de marca real, esta es la imagen OG/Twitter
// por defecto del sitio. Re-ejecutar con `node scripts/generate-og-image.mjs`
// si cambia el copy o los colores.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1b30" />
      <stop offset="65%" stop-color="#142a4a" />
      <stop offset="100%" stop-color="#1a3358" />
    </linearGradient>
    <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c9a227" stop-opacity="0" />
      <stop offset="50%" stop-color="#c9a227" stop-opacity="1" />
      <stop offset="100%" stop-color="#c9a227" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <g opacity="0.08" stroke="#c9a227" stroke-width="1">
    ${Array.from({ length: 18 }, (_, i) => {
      const x = -200 + i * 90;
      return `<line x1="${x}" y1="${HEIGHT}" x2="${x + 260}" y2="0" />`;
    }).join('\n    ')}
  </g>
  <rect x="90" y="90" width="64" height="4" fill="#c9a227" />
  <text x="90" y="270" font-family="Georgia, 'Source Serif 4', serif" font-size="64" font-weight="700" fill="#f7f5f1">Jorge Sergio</text>
  <text x="90" y="345" font-family="Georgia, 'Source Serif 4', serif" font-size="64" font-weight="700" fill="#f7f5f1">Ramírez Lizárraga</text>
  <text x="90" y="410" font-family="Arial, sans-serif" font-size="26" fill="#b9c2d1">Liderazgo Comercial &#183; Planeación Patrimonial y de Retiro</text>
  <rect x="90" y="450" width="420" height="1" fill="url(#line)" />
  <text x="90" y="500" font-family="Arial, sans-serif" font-size="22" letter-spacing="2" fill="#e4c766">+40 AÑOS DE TRAYECTORIA COMERCIAL</text>
</svg>
`;

await mkdir('public/og', { recursive: true });
await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile('public/og/og-default.jpg');
console.log('OG image generado en public/og/og-default.jpg');
