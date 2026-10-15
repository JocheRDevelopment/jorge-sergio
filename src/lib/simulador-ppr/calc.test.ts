// Cifras de prueba de docs/seo/simulador-ppr/simulador-ppr.brief.md ("Cifras de prueba"),
// más las cifras de ejemplo que aparecen en el texto de /simulador-ppr/. Si cambian la UMA
// o la tarifa del ISR, estas pruebas avisan qué textos de la página hay que actualizar.
import { describe, expect, it } from 'vitest';
import { isrAnual, simularPPR, tasaMarginal, type EntradaSimulacion } from './calc';
import { TOPE_DEDUCCION_PPR } from './constantes-fiscales';

const pesos = (n: number) => Math.round(n);

const base: EntradaSimulacion = {
  edad: 40,
  edadRetiro: 65,
  mensual: 3000,
  inicial: 0,
  ingresoMensual: 50000,
  tasaReal: 0.05,
  reinvertir: true,
};

describe('caso base: 40 años, $3,000/mes, $50,000/mes de ingreso, 5%, reinvierte', () => {
  const r = simularPPR(base);

  it('saldo, aportado, devolución, deducción e ingreso mensual', () => {
    expect(pesos(r.saldoFinal)).toBe(2152851);
    expect(pesos(r.totalAportado)).toBe(900000);
    expect(pesos(r.devolucionAnual)).toBe(8467);
    expect(pesos(r.deduccionAnual)).toBe(36000);
    expect(pesos(r.ingresoMensualRetiro)).toBe(14076);
    expect(r.limitadoPor).toBe('aportacion');
    expect(r.anos).toBe(25);
    expect(r.serie).toHaveLength(26);
  });

  it('el saldo se descompone en aportado + devoluciones + rendimientos', () => {
    expect(r.totalAportado + r.devolucionesReinvertidas + r.rendimientos).toBeCloseTo(r.saldoFinal, 6);
    // La devolución del último año llega después del retiro: se reinvierten 24, no 25.
    expect(r.devolucionesReinvertidas).toBeCloseTo(r.devolucionAnual * 24, 6);
  });
});

describe('escenarios del caso base', () => {
  it.each([
    [0.03, 1630725, 9011],
    [0.05, 2152851, 14076],
    [0.07, 2876201, 21929],
  ])('tasa real %d → saldo %d e ingreso mensual %d', (tasaReal, saldo, mensual) => {
    const r = simularPPR({ ...base, tasaReal });
    expect(pesos(r.saldoFinal)).toBe(saldo);
    expect(pesos(r.ingresoMensualRetiro)).toBe(mensual);
  });

  it('5% sin reinvertir → $1,757,204', () => {
    expect(pesos(simularPPR({ ...base, reinvertir: false }).saldoFinal)).toBe(1757204);
  });

  it.each([
    [30, 4081682],
    [50, 968717],
  ])('empezando a los %d → %d a los 65', (edad, saldo) => {
    expect(pesos(simularPPR({ ...base, edad }).saldoFinal)).toBe(saldo);
  });
});

describe('$100,000 únicos durante 25 años', () => {
  it.each([
    [0.03, 209378],
    [0.05, 338635],
    [0.07, 542743],
  ])('tasa real %d → %d', (tasaReal, saldo) => {
    const r = simularPPR({ ...base, mensual: 0, inicial: 100000, ingresoMensual: 0, tasaReal });
    expect(pesos(r.saldoFinal)).toBe(saldo);
  });
});

describe('ISR anual 2026', () => {
  it('ISR de $600,000 − ISR de $540,000 = $14,112 (tasa marginal 23.52%)', () => {
    expect(pesos(isrAnual(600000) - isrAnual(540000))).toBe(14112);
    expect(tasaMarginal(600000)).toBe(0.2352);
  });

  it('ingreso 0 o negativo → ISR 0', () => {
    expect(isrAnual(0)).toBe(0);
    expect(isrAnual(-1000)).toBe(0);
  });
});

describe('validaciones y límites de la deducción', () => {
  it('edad de retiro menor o igual a la edad actual → error', () => {
    expect(() => simularPPR({ ...base, edad: 65, edadRetiro: 65 })).toThrow(/mayor que tu edad actual/);
    expect(() => simularPPR({ ...base, edad: 66, edadRetiro: 65 })).toThrow(/mayor que tu edad actual/);
  });

  it('ingreso 0 → deducción y devolución 0', () => {
    const r = simularPPR({ ...base, ingresoMensual: 0 });
    expect(r.deduccionAnual).toBe(0);
    expect(r.devolucionAnual).toBe(0);
    expect(r.devolucionesReinvertidas).toBe(0);
  });

  it('aportación anual mayor que el 10% del ingreso → limitadoPor "diezPorciento"', () => {
    const r = simularPPR({ ...base, mensual: 10000 });
    expect(r.limitadoPor).toBe('diezPorciento');
    expect(pesos(r.deduccionAnual)).toBe(60000);
  });

  it('ingreso muy alto → limitadoPor "tope5uma"', () => {
    const r = simularPPR({ ...base, mensual: 30000, ingresoMensual: 500000 });
    expect(r.limitadoPor).toBe('tope5uma');
    expect(r.deduccionAnual).toBe(TOPE_DEDUCCION_PPR);
    expect(TOPE_DEDUCCION_PPR).toBeCloseTo(213973.2, 2);
  });

  it('edad 64 con retiro a los 65 → un año, sin devoluciones reinvertidas', () => {
    const r = simularPPR({ ...base, edad: 64 });
    expect(r.anos).toBe(1);
    expect(r.devolucionesReinvertidas).toBe(0);
  });
});
