// Motor de cálculo del Simulador PPR — funciones puras, sin DOM.
// Todo se expresa en pesos de hoy: se usa un rendimiento REAL (por encima de la inflación)
// y se asume que la aportación, la UMA y la tarifa del ISR se actualizan con la inflación.

// UMA anual vigente desde el 1 de febrero de 2026 (INEGI).
const UMA_ANUAL_2026 = 42794.64;
const TOPE_DEDUCCION_PPR = UMA_ANUAL_2026 * 5; // $213,973.20

// Tarifa anual ISR 2026, art. 152 LISR (Anexo 8 RMF 2026): [límite inferior, cuota fija, % sobre excedente]
const TARIFA_ISR_ANUAL_2026 = [
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

const ESCENARIOS = {
  conservador: { nombre: "Conservador", tasaReal: 0.03 },
  moderado: { nombre: "Moderado", tasaReal: 0.05 },
  dinamico: { nombre: "Dinámico", tasaReal: 0.07 },
};

function isrAnual(ingreso) {
  if (ingreso <= 0) return 0;
  let fila = TARIFA_ISR_ANUAL_2026[0];
  for (const f of TARIFA_ISR_ANUAL_2026) if (ingreso >= f[0]) fila = f;
  return fila[1] + (ingreso - fila[0]) * fila[2];
}

function tasaMarginal(ingreso) {
  let fila = TARIFA_ISR_ANUAL_2026[0];
  for (const f of TARIFA_ISR_ANUAL_2026) if (ingreso >= f[0]) fila = f;
  return fila[2];
}

/**
 * @param {object} p
 * @param {number} p.edad            Edad actual (18–64)
 * @param {number} p.edadRetiro      Edad de retiro (65–70; el PPR deducible exige 65)
 * @param {number} p.mensual         Aportación mensual en pesos
 * @param {number} p.inicial         Ahorro inicial en pesos
 * @param {number} p.ingresoMensual  Ingreso mensual bruto (para estimar la devolución del SAT)
 * @param {number} p.tasaReal        Rendimiento anual real (0.03, 0.05 o 0.07)
 * @param {boolean} p.reinvertir     Reinvertir la devolución del SAT en el PPR
 * @param {number} [p.anosRetiro=20] Años durante los que se reparte el saldo en el retiro
 */
function simularPPR(p) {
  const anos = p.edadRetiro - p.edad;
  if (anos < 1) throw new Error("La edad de retiro debe ser mayor que tu edad actual.");
  const i = Math.pow(1 + p.tasaReal, 1 / 12) - 1;
  const ingresoAnual = Math.max(0, p.ingresoMensual) * 12;

  const deduccionAnual = Math.min(p.mensual * 12, ingresoAnual * 0.1, TOPE_DEDUCCION_PPR);
  const devolucionAnual = Math.max(0, isrAnual(ingresoAnual) - isrAnual(ingresoAnual - deduccionAnual));
  const limitadoPor =
    deduccionAnual === p.mensual * 12 ? "aportacion" : deduccionAnual === TOPE_DEDUCCION_PPR ? "tope5uma" : "diezPorciento";

  let saldo = p.inicial;
  let aportado = p.inicial;
  let devolucionesReinvertidas = 0;
  const serie = [{ edad: p.edad, saldo, aportado, devoluciones: 0 }];

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

if (typeof module !== "undefined") {
  module.exports = { simularPPR, isrAnual, tasaMarginal, ESCENARIOS, UMA_ANUAL_2026, TOPE_DEDUCCION_PPR };
}
