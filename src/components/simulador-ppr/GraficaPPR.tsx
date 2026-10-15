import { useEffect, useRef, useState } from 'react';
import type { PuntoSerie } from '../../lib/simulador-ppr/calc';

// Mismos valores que tokens.css (navy-800, gold-300, gold-500, line-200, ink-700).
const COLOR = {
  aportaciones: '#0d1b30',
  devoluciones: '#e4c766',
  rendimientos: '#c9a227',
  linea: '#e6e2d8',
  texto: '#5c6577',
};

/** Monto compacto para los ejes: "$2.2 M", "$540 mil". */
export const montoCorto = (v: number) =>
  v >= 1e6 ? `$${(v / 1e6).toFixed(1)} M` : v >= 1e3 ? `$${Math.round(v / 1e3)} mil` : `$${Math.round(v)}`;

interface Props {
  serie: PuntoSerie[];
  ariaLabel: string;
}

/**
 * Barras apiladas por edad. El viewBox mide lo mismo que el contenedor en
 * píxeles CSS, así los textos de 12 px se ven de 12 px también en móvil.
 */
export default function GraficaPPR({ serie, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setAncho(Math.round(el.clientWidth));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = Math.max(300, ancho || 760);
  const H = W < 500 ? 220 : 260;
  const pl = 58, pr = 8, pt = 14, pb = 30;
  const n = serie.length - 1;
  const max = Math.max(...serie.map((s) => s.saldo)) || 1;
  const bw = (W - pl - pr) / serie.length;
  const gap = Math.min(4, bw * 0.25);
  const y = (v: number) => pt + (H - pt - pb) * (1 - v / max);
  const h = (v: number) => (H - pt - pb) * (v / max);
  const etiquetas = [0, Math.round(n / 2), n];

  return (
    <div ref={ref} role="img" aria-label={ariaLabel} className="my-2">
      {ancho > 0 && (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block h-auto w-full" aria-hidden="true">
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={pl} x2={W - pr} y1={y(max * t)} y2={y(max * t)} stroke={COLOR.linea} />
              <text x={pl - 8} y={y(max * t) + 4} textAnchor="end" fontSize="12" fill={COLOR.texto}>
                {montoCorto(max * t)}
              </text>
            </g>
          ))}
          {serie.map((s, k) => {
            const x = pl + k * bw + gap / 2;
            const w = Math.max(1, bw - gap);
            const a = Math.min(s.aportado, s.saldo);
            const d = Math.min(s.devoluciones, Math.max(0, s.saldo - a));
            const r = Math.max(0, s.saldo - a - d);
            return (
              <g key={s.edad}>
                <rect x={x} y={y(a)} width={w} height={h(a)} fill={COLOR.aportaciones} rx="1.5" />
                <rect x={x} y={y(a + d)} width={w} height={h(d)} fill={COLOR.devoluciones} />
                <rect x={x} y={y(a + d + r)} width={w} height={h(r)} fill={COLOR.rendimientos} rx="1.5" />
              </g>
            );
          })}
          {etiquetas.map((k, j) => (
            <text
              key={j}
              x={j === 0 ? pl : j === 2 ? W - pr : pl + k * bw + bw / 2}
              y={H - 8}
              textAnchor={j === 0 ? 'start' : j === 2 ? 'end' : 'middle'}
              fontSize="12"
              fill={COLOR.texto}
            >
              {serie[k].edad} años
            </text>
          ))}
        </svg>
      )}
    </div>
  );
}

export const COLORES_LEYENDA = COLOR;
