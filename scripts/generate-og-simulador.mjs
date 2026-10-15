// Genera public/og/og-simulador-ppr.jpg (1200×630) para /simulador-ppr/:
// caja de regalo azul marino con moño dorado y el texto "Simulador PPR gratis ·
// Un regalo de Jorge Sergio". Mismos tokens y método que generate-og-image.mjs.
// Re-ejecutar con `node scripts/generate-og-simulador.mjs` si cambia el copy.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const WIDTH = 1200;
const HEIGHT = 630;

// Caja de regalo centrada en (cx, base): tapa, cuerpo, listón y moño.
const cx = 905;
const gift = `
  <g>
    <ellipse cx="${cx}" cy="545" rx="190" ry="18" fill="#000" opacity="0.25" />
    <rect x="${cx - 165}" y="300" width="330" height="240" rx="10" fill="#0a1728" stroke="#1a3358" stroke-width="2" />
    <rect x="${cx - 185}" y="245" width="370" height="70" rx="10" fill="#1a3358" />
    <rect x="${cx - 22}" y="245" width="44" height="295" fill="#c9a227" />
    <rect x="${cx - 22}" y="245" width="44" height="70" fill="#e4c766" />
    <g transform="translate(${cx - 120} 120) scale(2)">
      <path d="M60 64 C40 32, 6 34, 10 58 C13 76, 42 74, 60 64Z" fill="#c9a227" />
      <path d="M60 64 C80 32, 114 34, 110 58 C107 76, 78 74, 60 64Z" fill="#c9a227" />
      <path d="M60 64 C46 46, 22 44, 22 58 C22 68, 44 68, 60 64Z" fill="#e4c766" />
      <path d="M60 64 C74 46, 98 44, 98 58 C98 68, 76 68, 60 64Z" fill="#e4c766" />
      <circle cx="60" cy="64" r="10" fill="#e4c766" stroke="#a8861f" stroke-width="2" />
    </g>
    <g fill="#e4c766">
      <circle cx="${cx - 230}" cy="190" r="6" opacity="0.9" />
      <circle cx="${cx + 225}" cy="170" r="5" opacity="0.8" />
      <circle cx="${cx - 190}" cy="120" r="4" opacity="0.6" />
      <circle cx="${cx + 190}" cy="105" r="7" opacity="0.7" />
    </g>
  </g>`;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1b30" />
      <stop offset="65%" stop-color="#142a4a" />
      <stop offset="100%" stop-color="#1a3358" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <g opacity="0.08" stroke="#c9a227" stroke-width="1">
    ${Array.from({ length: 18 }, (_, i) => {
      const x = -200 + i * 90;
      return `<line x1="${x}" y1="${HEIGHT}" x2="${x + 260}" y2="0" />`;
    }).join('\n    ')}
  </g>
  ${gift}
  <rect x="80" y="150" width="64" height="4" fill="#c9a227" />
  <text x="80" y="250" font-family="Georgia, 'Source Serif 4', serif" font-size="76" font-weight="700" fill="#f7f5f1">Simulador PPR</text>
  <text x="80" y="335" font-family="Georgia, 'Source Serif 4', serif" font-size="76" font-weight="700" fill="#e4c766">gratis</text>
  <text x="80" y="410" font-family="Arial, sans-serif" font-size="30" fill="#b9c2d1">Un regalo de Jorge Sergio</text>
  <text x="80" y="480" font-family="Arial, sans-serif" font-size="20" letter-spacing="2" fill="#8a93a3">PLAN PERSONAL DE RETIRO &#183; SAT 2026</text>
</svg>
`;

await mkdir('public/og', { recursive: true });
await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile('public/og/og-simulador-ppr.jpg');
console.log('OG image generado en public/og/og-simulador-ppr.jpg');
