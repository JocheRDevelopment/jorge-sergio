// Motor de cálculo del Simulador PPR — funciones puras, sin DOM.
// Todo se expresa en pesos de hoy: se usa un rendimiento REAL (por encima de la inflación)
// y se asume que la aportación, la UMA y la tarifa del ISR se actualizan con la inflación.
import { TARIFA_ISR_ANUAL_2026, TOPE_DEDUCCION_PPR } from './constantes-fiscales';

export type EscenarioId = 'conservador' | 'moderado' | 'dinamico';

export const ESCENARIOS: Record<EscenarioId, { nombre: string; tasaReal: number }> = {
  conservador: { nombre: 'Conservador', tasaReal: 0.03 },
  moderado: { nombre: 'Moderado', tasaReal: 0.05 },
  dinamico: { nombre: 'Dinámico', tasaReal: 0.07 },
};

export type LimitadoPor = 'aportacion' | 'tope5uma' | 'diezPorciento';

export interface EntradaSimulacion {
  /** Edad actual (18–64). */
  edad: number;
  /** Edad de retiro (65–70; el PPR deducible exige 65). */
  edadRetiro: number;
  /** Aportación mensual en pesos. */
  mensual: number;
  /** Ahorro inicial en pesos. */
  inicial: number;
  /** Ingreso mensual bruto (para estimar la devolución del SAT). */
  ingresoMensual: number;
  /** Rendimiento anual real (0.03, 0.05 o 0.07). */
  tasaReal: number;
  /** Reinvertir la devolución del SAT en el PPR. */
  reinvertir: boolean;
  /** Años durante los que se reparte el saldo en el retiro (20 por defecto). */
  anosRetiro?: number;
}

export interface PuntoSerie {
  edad: number;
  saldo: number;
  aportado: number;
  devoluciones: number;
}

export interface ResultadoSimulacion {
  anos: number;
  saldoFinal: number;
  totalAportado: number;
  devolucionesReinvertidas: number;
  rendimientos: number;
  deduccionAnual: number;
  devolucionAnual: number;
  devolucionTotal: number;
  tasaMarginal: number;
  limitadoPor: LimitadoPor;
  ingresoMensualRetiro: number;
  anosRetiro: number;
  serie: PuntoSerie[];
}

function filaTarifa(ingreso: number) {
  let fila = TARIFA_ISR_ANUAL_2026[0];
  for (const f of TARIFA_ISR_ANUAL_2026) if (ingreso >= f[0]) fila = f;
  return fila;
}

export function isrAnual(ingreso: number): number {
  if (ingreso <= 0) return 0;
  const fila = filaTarifa(ingreso);
  return fila[1] + (ingreso - fila[0]) * fila[2];
}

export function tasaMarginal(ingreso: number): number {
  return filaTarifa(ingreso)[2];
}

export function simularPPR(p: EntradaSimulacion): ResultadoSimulacion {
  const anos = p.edadRetiro - p.edad;
  if (anos < 1) throw new Error('La edad de retiro debe ser mayor que tu edad actual.');
  const i = Math.pow(1 + p.tasaReal, 1 / 12) - 1;
  const ingresoAnual = Math.max(0, p.ingresoMensual) * 12;

  const deduccionAnual = Math.min(p.mensual * 12, ingresoAnual * 0.1, TOPE_DEDUCCION_PPR);
  const devolucionAnual = Math.max(0, isrAnual(ingresoAnual) - isrAnual(ingresoAnual - deduccionAnual));
  const limitadoPor: LimitadoPor =
    deduccionAnual === p.mensual * 12 ? 'aportacion' : deduccionAnual === TOPE_DEDUCCION_PPR ? 'tope5uma' : 'diezPorciento';

  let saldo = p.inicial;
  let aportado = p.inicial;
  let devolucionesReinvertidas = 0;
  const serie: PuntoSerie[] = [{ edad: p.edad, saldo, aportado, devoluciones: 0 }];

  for (let y = 1; y <= anos; y++) {
    for (let m = 0; m < 12; m++) {
      saldo = saldo * (1 + i) + p.mensual;
      aportado += p.mensual;
    }
    // La devolución del SAT llega en la declaración anual (abril del año siguiente).
    // Se reinvierte al cierre de cada año, salvo la del último año, que llega después del retiro.
    if (p.reinvertir && y < anos) {
      saldo += devolucionAnual;
      devolucionesReinvertidas += devolucionAnual;
    }
    serie.push({ edad: p.edad + y, saldo, aportado, devoluciones: devolucionesReinvertidas });
  }

  const anosRetiro = p.anosRetiro ?? 20;
  const meses = anosRetiro * 12;
  const ingresoMensualRetiro = i > 0 ? (saldo * i) / (1 - Math.pow(1 + i, -meses)) : saldo / meses;

  return {
    anos,
    saldoFinal: saldo,
    totalAportado: aportado,
    devolucionesReinvertidas,
    rendimientos: saldo - aportado - devolucionesReinvertidas,
    deduccionAnual,
    devolucionAnual,
    devolucionTotal: devolucionAnual * anos,
    tasaMarginal: tasaMarginal(ingresoAnual),
    limitadoPor,
    ingresoMensualRetiro,
    anosRetiro,
    serie,
  };
}
