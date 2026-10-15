# Brief SEO y especificación — Simulador PPR ("un regalo de Jorge Sergio")

> Referencia para Claude Code. **No se publica.** Archivos que lo acompañan:
> - `simulador-ppr.html`: prototipo funcional. Es la **fuente del texto final** (copy) y del diseño.
> - `calc.js`: motor de cálculo con funciones puras, probado.

## Decisión de formato

El artículo #5 del calendario ("Simulador PPR") se convierte en una **página-herramienta independiente**, no en un post del blog. Google posiciona herramientas interactivas para "ppr simulador" (Fintual, Skandia y segurosmexico.mx tienen su simulador en el top), y una herramienta atrae enlaces y conversiones mejor que un artículo.

| Campo | Valor |
| --- | --- |
| URL | `https://jorgesergio.com/simulador-ppr/` (raíz, no dentro de `/blog/`) |
| Title tag | Simulador PPR 2026: calcula tu plan de retiro gratis (52 caracteres) |
| H1 | Simulador PPR: calcula tu Plan Personal de Retiro gratis |
| Meta description | Simulador PPR gratis: calcula cuánto tendrías a los 65 con tu Plan Personal de Retiro y cuánto te devolvería el SAT en 2026. Un regalo de Jorge Sergio Ramírez. (159 caracteres) |
| Conversión | **Todo apunta a `/agenda/`** (Estrategia Patrimonial), con 5 CTAs y UTMs (ver abajo) |
| Concepto visual | "Un regalo de Jorge Sergio": etiqueta de regalo, formulario envuelto con listón dorado y moño, botón "Abrir mi regalo", animación de caja que se abre y nota firmada por Jorge con el CTA |

## Mapa de keywords

Datos de Ahrefs, México, consultados el 15 de octubre de 2026. KD = dificultad (0–100).

### Cluster principal: unas 4,950 búsquedas al mes combinadas

| Keyword | Volumen/mes | KD | Dónde va |
| --- | --- | --- | --- |
| ppr simulador | 2,500 | 0 | Title, URL, H1, meta description, primera línea, H2 "Cómo usar el simulador PPR", FAQ |
| plan personal de retiro simulador | 600 | 0 | H1 ("Simulador PPR: calcula tu Plan Personal de Retiro") |
| simulador ppr | 300 | 4 | H1, H2, FAQs |
| calculadora ppr | 300 | 2 | H2 del formulario ("Calculadora PPR: tus datos"), H2 "Cómo calcula esta calculadora PPR" |
| calculadora de ppr / ppr calculadora | 150 + 150 | 1 / 0 | Mismos H2 |
| simulador plan personal de retiro | 150 | 6 | Párrafo de "Simulador PPR gratis vs simuladores de las instituciones" |
| calculadora de retiro | 150 (potencial 2,800) | 2 | Schema `WebApplication` (`alternateName`) y texto de "Cómo calcula…" |
| calculadora de ahorro para el retiro | 150 (potencial 2,900) | 9 | Schema (`alternateName`) |
| simulador de ppr | 100 | 2 | Primera línea de "Cómo usar…" ("Este simulador de PPR…") |
| ppr simulador gratis / calculadora ppr gratis | 100 + 40 | — | Title, H1 ("gratis"), H2 "Simulador PPR gratis vs…", FAQ "¿Es gratis?" |
| calculadora plan personal de retiro | 50 | 0 | Schema (`alternateName`) |
| simulador de ahorro para el retiro | 50 | — | Schema (`alternateName`) |
| calcular ppr / calculo ppr | 40 + 20 | — | Cubiertas por la herramienta |
| plan de retiro simulador / simulador de retiro | 30 + 30 | 2 / — | Cubiertas por el H1 |

### Preguntas de Google ("Otras preguntas")

| Pregunta | Dónde va |
| --- | --- |
| ¿Cuánto rendimiento te da un PPR? | H2 propio + escenarios del 3%, 5% y 7% real |
| ¿Cuánto me dan si invierto 100 mil pesos? | H2 propio + tabla con 3 escenarios a 25 años |
| ¿Qué es el PPR? | Enlace al artículo #1 (pendiente, ver abajo) |

### Keywords de marca: no se atacan

"ppr allianz simulador" (150), "simulador ppr allianz" (100), "ppr simulador sura" (100), "ppr gnp simulador" (90), "ppr bbva simulador" (60), "ppr simulador profuturo" (60) y similares. Son búsquedas de clientes de esas marcas y usar sus nombres en la página puede generar problemas de marca. **Excepción a decidir con Jorge:** si el PPR que ofrece es de GNP (el sitio muestra a Grupo Jezreel GNP), las búsquedas de GNP suman unas 270 al mes y se podría agregar una sección "¿Tienes o quieres un PPR de GNP?".

### Intención a evitar

"simulador / calculadora de retiro por desempleo" (más de 1,800 búsquedas al mes) es retirar dinero de la Afore por desempleo, no ahorro para el retiro. No se usa en ningún texto.

## Competencia en el top 10 de "ppr simulador"

Fintual, Skandia, segurosmexico.mx, estrategiaspatrimoniales.com.mx y GBM son herramientas de instituciones o asesores. Después aparecen gambroker.com (**DR 2, posición 2**, con 896 visitas), networth.mx (DR 15), limitlezz.com.mx (**DR 0**), miplanafuturo.com (**DR 0**) e invierteyahorrasura (DR 5). Con autoridad baja se puede llegar a la primera página si la herramienta es buena.

**Ventajas de este simulador frente a la competencia:**

- Calcula la **devolución real del SAT con la tarifa ISR 2026**; la mayoría usa una tasa fija.
- Muestra resultados **en pesos de hoy** (rendimiento real), algo que casi nadie explica.
- Es **independiente** de cualquier producto.
- No pide registro.
- Responde las dos preguntas de "Otras preguntas" con tablas.

## Especificación funcional

### Entradas

| Campo | Tipo | Default | Validación |
| --- | --- | --- | --- |
| Edad actual | number | 40 | 18–64 |
| Edad de retiro | select | 65 | 65–70 (65 = edad del PPR deducible) |
| Aportación mensual | number + slider | 3,000 | mínimo 500; slider de 500 a 30,000, paso 500 (el campo numérico acepta más) |
| Ahorro inicial | number | 0 | ≥ 0 |
| Ingreso mensual bruto | number | 50,000 | ≥ 0 (si es 0, no se estima devolución) |
| Escenario | radio | Moderado | Conservador 3%, Moderado 5%, Dinámico 7% **real** anual |
| Reinvertir devolución del SAT | checkbox | sí | — |

### Lógica (ver `calc.js`)

1. Tasa mensual = (1 + tasa real)^(1/12) − 1. Interés compuesto mensual con aportación al final de cada mes.
2. Deducción anual = mínimo entre: aportación anual, 10% del ingreso anual y 5 UMA anuales ($213,973.20; UMA 2026 = $42,794.64).
3. Devolución anual del SAT = ISR(ingreso anual) − ISR(ingreso anual − deducción), con la tarifa anual del art. 152, 2026 (Anexo 8 RMF 2026).
4. Si se reinvierte, la devolución se suma al saldo al cierre de cada año, excepto el último (llega después del retiro).
5. Ingreso mensual en el retiro = anualidad de 240 meses (20 años) con la misma tasa real.
6. Todo en pesos de hoy: se asume que la aportación, la UMA y la tarifa se actualizan con la inflación.

### Salidas

Monto a la edad de retiro (número grande), total aportado, rendimientos más devoluciones, devolución anual del SAT, ingreso mensual por 20 años, gráfica de barras apiladas por edad (aportaciones, devoluciones y rendimientos), texto con la deducción anual y por qué está limitada, nota de Jorge con CTA y aviso legal.

### Cifras de prueba (para tests)

| Caso | Resultado esperado |
| --- | --- |
| 40 años, $3,000/mes, $50,000/mes de ingreso, 5%, reinvierte | Saldo $2,152,851 · aportado $900,000 · devolución anual $8,467 · deducción $36,000 · ingreso mensual $14,076 |
| Mismo caso, 3% / 7% | $1,630,725 / $2,876,201 |
| Mismo caso, 5%, sin reinvertir | $1,757,204 |
| $100,000 únicos, 25 años, 3% / 5% / 7% | $209,378 / $338,635 / $542,743 |
| ISR anual de $600,000 − ISR de $540,000 | $14,112 |

## CTAs y medición

Todos llevan a `/agenda/?utm_source=simulador-ppr&utm_medium=herramienta&utm_campaign=regalo-jorge&utm_content=<ubicación>`:

| Ubicación (`utm_content`) | Texto |
| --- | --- |
| header | Agenda tu sesión |
| resultado | Agenda tu Estrategia Patrimonial sin costo (dentro de la nota de Jorge) |
| sticky | Agenda tu Estrategia Patrimonial (barra fija en móvil, aparece después de calcular) |
| ejemplo | Agenda tu Estrategia Patrimonial sin costo (caja después del ejemplo) |
| final | Agenda tu Estrategia Patrimonial sin costo (bloque final) |

Evento de analytics `simulador_ppr_calculado` (edad, aportación, escenario) al calcular. No se envía el ingreso.

## Schema (JSON-LD)

- `WebApplication`: `name` "Simulador PPR", `alternateName` ["Calculadora PPR", "Simulador de Plan Personal de Retiro", "Calculadora de retiro", "Calculadora de ahorro para el retiro"], `applicationCategory` "FinanceApplication", `operatingSystem` "Web", `offers` con precio 0 MXN, `inLanguage` "es-MX", `author` → `Person` Jorge Sergio Ramírez Lizárraga.
- `FAQPage` con las 6 preguntas del prototipo.
- `BreadcrumbList`: Inicio › Simulador PPR.

## Enlazado interno

| Desde | Ancla | Hacia |
| --- | --- | --- |
| Header o footer del sitio | Simulador PPR | `/simulador-ppr/` |
| Página `/plan-personal-de-retiro-ppr/` | calcula tu PPR con el simulador | `/simulador-ppr/` |
| Artículo #1 `que-es-un-ppr` (al publicarse) | simulador PPR | `/simulador-ppr/` (en "Cómo empezar tu PPR", paso 1) |
| Artículo #2 `ppr-sat-deducible-de-impuestos` (al publicarse) | calcula tu devolución en el simulador PPR | `/simulador-ppr/` (en "¿Cuánto te devuelve el SAT…?") |
| Simulador | qué es un PPR / deducir tu PPR | Artículos #1 y #2, **solo cuando estén publicados** |

## Pendientes

- [ ] Foto real de Jorge en la nota firmada (hoy dice "JS"). Usar la imagen que ya existe en el sitio.
- [ ] Imagen OG de 1200×630: caja de regalo con moño dorado y el texto "Simulador PPR gratis · Un regalo de Jorge Sergio".
- [ ] Decidir con Jorge la sección opcional de PPR de GNP.
- [ ] Cada febrero: actualizar la UMA, la tarifa del ISR y las cifras de ejemplo (correr los tests).
- [ ] Un contador revisa el cálculo de la devolución y los avisos.

## Corrección aplicada al artículo #1

En `que-es-un-ppr.md`, el ejemplo de $600,000 de ingresos usaba una tasa marginal de 30%. Con la tarifa 2026, a ese nivel corresponde 23.52%. El texto ya dice **23.52% y $14,112**. Si el artículo #1 ya está en el repo, reemplazar esa línea.

## Fuentes

- [INEGI — UMA 2026](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/uma/uma2026.pdf)
- [SDV — Tarifa ISR 2026, art. 152](https://sdv.com.mx/recursos/tablas-isr-2026/), confirmada con [SAT Fácil — Tabla ISR 2026](https://www.satfacil.com.mx/blog/tabla-isr-2026-personas-fisicas)
- [SAT — Deducción de aportaciones complementarias y PPR](https://sat.gob.mx/minisitio/DeduccionesPersonales/aportaciones_complementarias.html)
