/*
 * Constantes fiscales del Simulador PPR. Es el ÚNICO archivo que se actualiza
 * cada febrero (nueva UMA y, si cambia, la tarifa anual del ISR). Después de
 * actualizarlo, corre `npm run test` y ajusta las cifras de ejemplo de
 * src/pages/simulador-ppr.astro, src/content/faq.json y calc.test.ts.
 *
 * Última actualización: 15 de octubre de 2026.
 */

/**
 * UMA anual vigente desde el 1 de febrero de 2026.
 * Fuente: INEGI, https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/uma/uma2026.pdf
 */
export const UMA_ANUAL_2026 = 42794.64;

/**
 * Tope anual de deducción del PPR: 5 UMA anuales ($213,973.20 en 2026).
 * Fuente: art. 151, fracción V, LISR.
 */
export const TOPE_DEDUCCION_PPR = UMA_ANUAL_2026 * 5;

/** Fila de la tarifa: [límite inferior, cuota fija, % sobre el excedente del límite inferior]. */
export type FilaTarifaISR = readonly [limiteInferior: number, cuotaFija: number, tasaExcedente: number];

/**
 * Tarifa anual del ISR 2026 para personas físicas, art. 152 LISR (Anexo 8 RMF 2026).
 * Fuentes: https://sdv.com.mx/recursos/tablas-isr-2026/, confirmada con
 * https://www.satfacil.com.mx/blog/tabla-isr-2026-personas-fisicas
 */
export const TARIFA_ISR_ANUAL_2026: readonly FilaTarifaISR[] = [
  [0.01, 0.0, 0.0192],
  [10135.12, 194.59, 0.064],
  [86022.12, 5051.37, 0.1088],
  [151176.2, 12140.13, 0.16],
  [175735.67, 16069.64, 0.1792],
  [210403.7, 22282.14, 0.2136],
  [424353.98, 67981.92, 0.2352],
  [668840.15, 125485.07, 0.3],
  [1276925.99, 307910.81, 0.32],
  [1702567.98, 444116.23, 0.34],
  [5107703.93, 1601862.46, 0.35],
];
