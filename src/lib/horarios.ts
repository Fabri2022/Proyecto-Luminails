// Cálculo de horarios libres. Función pura: no toca la base, así se puede probar sola.
// Reglas: los turnos arrancan cada 30 min, el turno tiene que terminar antes del cierre
// y no puede pisarse con otro turno (pendiente vigente o confirmado) ni con un día bloqueado.

export const PASO_MIN = 30;

export type Franja = { desde: string; hasta: string }; // "15:00", "17:30"
export type Ocupado = { inicio: Date; fin: Date };

const aMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Inicios libres (en minutos desde 00:00) de un día, dada su franja y los turnos ocupados. */
export function iniciosLibres(
  franja: Franja | undefined,
  duracionMin: number,
  ocupadosMin: { inicio: number; fin: number }[],
  minimoMin = 0, // no ofrecer horarios que ya pasaron (si es hoy)
): number[] {
  if (!franja) return [];
  const abre = aMin(franja.desde);
  const cierra = aMin(franja.hasta);
  const libres: number[] = [];
  for (let t = abre; t + duracionMin <= cierra; t += PASO_MIN) {
    if (t < minimoMin) continue;
    const pisa = ocupadosMin.some((o) => t < o.fin && t + duracionMin > o.inicio);
    if (!pisa) libres.push(t);
  }
  return libres;
}

export const formatearHora = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
