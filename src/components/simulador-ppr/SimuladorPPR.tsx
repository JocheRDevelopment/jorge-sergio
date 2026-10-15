import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ESCENARIOS, simularPPR, type EscenarioId, type ResultadoSimulacion } from '../../lib/simulador-ppr/calc';
import { TOPE_DEDUCCION_PPR } from '../../lib/simulador-ppr/constantes-fiscales';
import { agendaUrl } from '../../lib/simulador-ppr/utm';
import GraficaPPR, { COLORES_LEYENDA } from './GraficaPPR';
import s from './SimuladorPPR.module.css';

interface Props {
  /** Foto de Jorge (named slot "foto"), ya optimizada por <Image> de Astro. */
  foto?: ReactNode;
}

const mxn = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Math.round(n));

const SLIDER_MIN = 500;
const SLIDER_MAX = 30000;

const input =
  'w-full rounded-[4px] border-[1.5px] border-line-200 bg-white px-3 py-[11px] text-[16px] font-medium text-ink-base focus:border-gold-500 focus:outline-none focus:ring-[3px] focus:ring-gold-500/25';
const labelCls = 'mb-1.5 block text-[14.5px] font-semibold text-navy-800';
const help = 'mt-1 block text-[12.5px] text-ink-700';
const btnGold =
  'inline-flex min-h-[48px] items-center justify-center rounded-[3px] bg-gold-500 font-semibold text-navy-900 transition-colors duration-150 hover:bg-gold-300 hover:text-navy-900';

const ESCENARIO_OPCIONES: { id: EscenarioId; etiqueta: string }[] = [
  { id: 'conservador', etiqueta: '3% real anual' },
  { id: 'moderado', etiqueta: '5% real anual' },
  { id: 'dinamico', etiqueta: '7% real anual' },
];

const TEXTO_LIMITE = {
  aportacion: 'tu aportación anual completa',
  diezPorciento: 'el 10% de tus ingresos (el resto de tu aportación ya no es deducible)',
  tope5uma: `el tope de 5 UMA anuales (${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(TOPE_DEDUCCION_PPR)})`,
};

interface Calculo {
  r: ResultadoSimulacion;
  edadRetiro: number;
  escenario: string;
  reinvertir: boolean;
}

export default function SimuladorPPR({ foto }: Props) {
  const [edad, setEdad] = useState('40');
  const [edadRetiro, setEdadRetiro] = useState('65');
  const [mensual, setMensual] = useState('3000');
  const [inicial, setInicial] = useState('0');
  const [ingreso, setIngreso] = useState('50000');
  const [escenario, setEscenario] = useState<EscenarioId>('moderado');
  const [reinvertir, setReinvertir] = useState(true);
  const [error, setError] = useState('');

  const [calculo, setCalculo] = useState<Calculo | null>(null);
  const [intento, setIntento] = useState(0);
  const [resultadoVisible, setResultadoVisible] = useState(false);
  const [cajaLista, setCajaLista] = useState(false);

  const revealRef = useRef<HTMLElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  // Animación: la caja se abre, aparece el resultado y la caja se colapsa.
  useEffect(() => {
    if (!intento) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    revealRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    tituloRef.current?.focus({ preventScroll: true });
    const t1 = setTimeout(() => setResultadoVisible(true), reduce ? 0 : 650);
    const t2 = setTimeout(() => setCajaLista(true), reduce ? 0 : 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [intento]);

  // La barra fija solo existe después de calcular; el body reserva su espacio.
  useEffect(() => {
    if (!calculo) return;
    document.body.classList.add('simulador-sticky');
    return () => document.body.classList.remove('simulador-sticky');
  }, [calculo]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const p = {
      edad: Number(edad),
      edadRetiro: Number(edadRetiro),
      mensual: Number(mensual),
      inicial: Number(inicial) || 0,
      ingresoMensual: Number(ingreso) || 0,
      tasaReal: ESCENARIOS[escenario].tasaReal,
      reinvertir,
    };
    if (!(edad.trim() && p.edad >= 18 && p.edad <= 64)) return setError('Escribe una edad entre 18 y 64 años.');
    if (!(p.mensual >= 500)) return setError('La aportación mensual mínima del simulador es de $500.');
    if (p.inicial < 0) return setError('El ahorro inicial no puede ser negativo.');
    if (p.ingresoMensual < 0) return setError('El ingreso mensual no puede ser negativo.');

    let r: ResultadoSimulacion;
    try {
      r = simularPPR(p);
    } catch (err) {
      return setError((err as Error).message);
    }

    const nombreEscenario = ESCENARIOS[escenario].nombre.toLowerCase();
    setCalculo({ r, edadRetiro: p.edadRetiro, escenario: nombreEscenario, reinvertir });
    setResultadoVisible(false);
    setCajaLista(false);
    setIntento((n) => n + 1);

    // Analytics: nunca se envía el ingreso.
    const evento = { edad: p.edad, aportacion: p.mensual, escenario };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'simulador_ppr_calculado', ...evento });
    window.dispatchEvent(new CustomEvent('simulador_ppr_calculado', { detail: evento }));
  }

  const r = calculo?.r;
  const textoDeduccion = !r
    ? ''
    : r.devolucionAnual > 0
      ? `Puedes deducir ${mxn(r.deduccionAnual)} al año: ${TEXTO_LIMITE[r.limitadoPor]}.` +
        // Con un solo año no hay nada que reinvertir: la devolución llega después del retiro.
        (calculo.reinvertir && r.devolucionesReinvertidas > 0
          ?` Reinvirtiendo tus devoluciones sumas ${mxn(r.devolucionesReinvertidas)} a tu PPR.`
          : ` En ${r.anos} años, el SAT te devolvería unos ${mxn(r.devolucionTotal)} en total.`)
      : 'Sin ingreso capturado no estimamos devolución del SAT.';

  return (
    <>
      <div className={s.gift}>
        <svg className={s.bow} viewBox="0 0 120 70" aria-hidden="true">
          <path d="M60 36 C40 4, 6 6, 10 30 C13 48, 42 46, 60 36Z" fill="#c9a227" />
          <path d="M60 36 C80 4, 114 6, 110 30 C107 48, 78 46, 60 36Z" fill="#c9a227" />
          <path d="M60 36 C46 18, 22 16, 22 30 C22 40, 44 40, 60 36Z" fill="#e4c766" />
          <path d="M60 36 C74 18, 98 16, 98 30 C98 40, 76 40, 60 36Z" fill="#e4c766" />
          <path d="M56 38 L44 68 L52 64 L58 70 L60 40Z" fill="#a8861f" />
          <path d="M64 38 L76 68 L68 64 L62 70 L60 40Z" fill="#a8861f" />
          <circle cx="60" cy="36" r="9" fill="#e4c766" stroke="#a8861f" strokeWidth="2" />
        </svg>
        <div className={s.giftInner}>
          <form
            className="rounded-[6px] bg-white p-5 text-ink-base md:p-7"
            onSubmit={onSubmit}
            noValidate
            aria-labelledby="form-title"
          >
            <h2 id="form-title" className="mb-1 font-serif text-[24px] font-semibold text-navy-800">
              Calculadora PPR: tus datos
            </h2>
            <p className="mb-5 text-[15px] text-ink-700">
              Llena seis datos y abre tu regalo. Los resultados se muestran en pesos de hoy.
            </p>

            <div className="grid gap-x-[22px] gap-y-[18px] md:grid-cols-2">
              <div>
                <label htmlFor="edad" className={labelCls}>Tu edad actual</label>
                <input
                  id="edad" name="edad" type="number" inputMode="numeric" min={18} max={64} required
                  className={input} value={edad} onChange={(e) => setEdad(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="edadRetiro" className={labelCls}>Edad a la que te quieres retirar</label>
                <select
                  id="edadRetiro" name="edadRetiro" className={input}
                  value={edadRetiro} onChange={(e) => setEdadRetiro(e.target.value)}
                >
                  <option value="65">65 años (edad del PPR deducible)</option>
                  {[66, 67, 68, 69, 70].map((a) => (
                    <option key={a} value={a}>{a} años</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="mensual" className={labelCls}>¿Cuánto aportarías al mes?</label>
                <div className={s.money}>
                  <input
                    id="mensual" name="mensual" type="number" inputMode="numeric" min={500} step={500} required
                    className={input} value={mensual} onChange={(e) => setMensual(e.target.value)}
                  />
                </div>
                <input
                  type="range" min={SLIDER_MIN} max={SLIDER_MAX} step={500} aria-label="Aportación mensual"
                  className="mt-2 w-full accent-gold-500"
                  value={Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, Number(mensual) || SLIDER_MIN))}
                  onChange={(e) => setMensual(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="inicial" className={labelCls}>Ahorro inicial (opcional)</label>
                <div className={s.money}>
                  <input
                    id="inicial" name="inicial" type="number" inputMode="numeric" min={0} step={1000}
                    className={input} value={inicial} onChange={(e) => setInicial(e.target.value)}
                    aria-describedby="inicial-help"
                  />
                </div>
                <span id="inicial-help" className={help}>Lo que ya tengas para tu retiro fuera de la Afore.</span>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="ingreso" className={labelCls}>Tu ingreso mensual bruto</label>
                <div className={s.money}>
                  <input
                    id="ingreso" name="ingreso" type="number" inputMode="numeric" min={0} step={1000}
                    className={input} value={ingreso} onChange={(e) => setIngreso(e.target.value)}
                    aria-describedby="ingreso-help"
                  />
                </div>
                <span id="ingreso-help" className={help}>
                  Lo usamos solo para estimar cuánto te devolvería el SAT por deducir tu PPR. No se guarda.
                </span>
              </div>
              <fieldset className="m-0 border-0 p-0 md:col-span-2">
                <legend className={labelCls}>Escenario de rendimiento (por encima de la inflación)</legend>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {ESCENARIO_OPCIONES.map((op) => (
                    <div key={op.id} className={`relative ${s.pill}`}>
                      <input
                        type="radio" name="escenario" id={`esc-${op.id}`} value={op.id}
                        checked={escenario === op.id} onChange={() => setEscenario(op.id)}
                      />
                      <label
                        htmlFor={`esc-${op.id}`}
                        className="m-0 block cursor-pointer rounded-[4px] border-[1.5px] border-line-200 bg-white px-3 py-2.5 text-center"
                      >
                        <b className="block text-[15px] text-navy-800">{ESCENARIOS[op.id].nombre}</b>
                        <span className="text-[13px] text-ink-700">{op.etiqueta}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              <label className="flex items-start gap-2.5 text-[15px] md:col-span-2">
                <input
                  type="checkbox" id="reinvertir" className="mt-0.5 h-5 w-5 shrink-0 accent-gold-500"
                  checked={reinvertir} onChange={(e) => setReinvertir(e.target.checked)}
                />
                Reinvertir cada año en mi PPR la devolución del SAT
              </label>
            </div>

            <p role="alert" className="mt-3 min-h-[1.4em] text-center text-[14.5px] font-semibold text-[#b42318]">
              {error}
            </p>
            <div className="mt-3 flex flex-col items-center gap-2">
              <button type="submit" className={`${btnGold} px-[34px] py-4 text-[17px]`}>
                Abrir mi regalo
              </button>
              <small className="text-[13px] text-ink-700">Gratis, sin registro. Tus datos no salen de tu navegador.</small>
            </div>
          </form>
        </div>
      </div>

      <section
        ref={revealRef}
        aria-live="polite"
        aria-label="Resultado de tu simulación"
        className="mx-auto mt-7 max-w-[820px] scroll-mt-[96px]"
      >
        {calculo && r && (
          <>
            <div className={`${s.boxAnim} ${cajaLista ? s.done : ''}`} aria-hidden="true">
              <div key={intento} className={`${s.box} ${s.open}`}>
                <div className={s.base} />
                <div className={s.lid} />
                <span className={s.spark} />
                <span className={s.spark} />
                <span className={s.spark} />
                <span className={s.spark} />
              </div>
            </div>

            <div
              className={`${s.result} ${resultadoVisible ? s.in : ''} rounded-[6px] border-[1.5px] border-gold-500 bg-white px-5 py-7 shadow-[0_18px_50px_rgba(13,27,48,0.12)] md:px-7`}
            >
              <p className="text-center text-[13px] font-bold uppercase tracking-[1.4px] text-[#8a6a10]">Tu regalo</p>
              <h2
                ref={tituloRef}
                tabIndex={-1}
                className="mt-1.5 text-center font-serif text-[21px] font-semibold text-navy-800 focus:outline-none"
              >
                A los {calculo.edadRetiro} años podrías tener
              </h2>
              <p className="my-1.5 text-center font-serif text-[clamp(2.4rem,7vw,3.8rem)] font-bold leading-[1.05] text-navy-800">
                {mxn(r.saldoFinal)}
              </p>
              <p className="mb-5 text-center text-ink-700">
                en pesos de hoy, con el escenario <b>{calculo.escenario}</b>
              </p>

              <div className="my-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ['Lo que tú aportas', r.totalAportado, false],
                  ['Rendimientos y devoluciones del SAT', r.rendimientos + r.devolucionesReinvertidas, false],
                  ['Te devuelve el SAT al año', r.devolucionAnual, true],
                  [`Ingreso mensual por ${r.anosRetiro} años de retiro`, r.ingresoMensualRetiro, true],
                ].map(([etiqueta, valor, dorado]) => (
                  <div
                    key={etiqueta as string}
                    className={`rounded-[4px] border p-3.5 ${dorado ? 'border-gold-500 bg-gold-100' : 'border-line-200 bg-white'}`}
                  >
                    <small className="block text-[12.5px] leading-[1.3] text-ink-700">{etiqueta as string}</small>
                    <b className="mt-1 block text-[18px] text-navy-800">{mxn(valor as number)}</b>
                  </div>
                ))}
              </div>

              <GraficaPPR
                serie={r.serie}
                ariaLabel={`Gráfica del crecimiento de tu PPR por edad, de los ${r.serie[0].edad} a los ${calculo.edadRetiro} años, hasta ${mxn(r.saldoFinal)}.`}
              />
              <div className="flex flex-wrap gap-4 text-[13px] text-ink-700">
                {[
                  ['Tus aportaciones', COLORES_LEYENDA.aportaciones],
                  ['Devoluciones del SAT reinvertidas', COLORES_LEYENDA.devoluciones],
                  ['Rendimientos', COLORES_LEYENDA.rendimientos],
                ].map(([t, c]) => (
                  <span key={t}>
                    <i className="mr-1.5 inline-block h-3 w-3 rounded-[3px] align-[-1px]" style={{ background: c }} />
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[13px] leading-[1.5] text-ink-700">{textoDeduccion}</p>

              <div className="mt-6 grid gap-4 rounded-[6px] bg-navy-800 p-[22px] text-bone-50 sm:grid-cols-[72px_1fr]">
                <div className="h-[72px] w-[72px] overflow-hidden rounded-full border-[3px] border-gold-300 bg-gold-500 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                  {foto}
                </div>
                <div>
                  <p className="mb-2.5 text-slate-100">
                    Este número es un buen comienzo, pero un plan de retiro es más que un simulador: hay que elegir el
                    PPR correcto, cuidar la deducción cada año y sumar tu Afore y tu pensión.
                  </p>
                  <p className="mb-2.5 text-slate-100">
                    Te regalo también 30 minutos de mi tiempo para revisarlo contigo y convertir este número en un plan.
                  </p>
                  <div className={s.signature}>Jorge Sergio</div>
                  <a href={agendaUrl('resultado')} className={`${btnGold} mt-3.5 px-6 py-3.5 text-[15px]`}>
                    Agenda tu Estrategia Patrimonial sin costo
                  </a>
                  <small className="mt-2 block text-[13px] text-slate-400">Llamada en línea de 30 minutos. Sin compromiso.</small>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-[1.5] text-ink-700">
                Simulación ilustrativa en pesos de hoy. Los rendimientos no están garantizados y dependen del
                instrumento que elijas. La devolución del SAT se estima con la tarifa anual del ISR 2026 y la UMA 2026,
                considerando solo la deducción del PPR (hasta el 10% de tus ingresos, máximo 5 UMA anuales); no
                incluye otras deducciones, comisiones ni impuestos al retirar. No sustituye asesoría fiscal o
                financiera personalizada.
              </p>
            </div>
          </>
        )}
      </section>

      {calculo && (
        <div className={s.sticky}>
          <a href={agendaUrl('sticky')} className={`${btnGold} w-full px-6 text-[15px]`}>
            Agenda tu Estrategia Patrimonial
          </a>
        </div>
      )}
    </>
  );
}
