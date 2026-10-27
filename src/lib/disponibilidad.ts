import { supabase } from "./supabase";
import { iniciosLibres, type Franja } from "./horarios";

// Argentina no usa horario de verano: siempre UTC-3.
const OFFSET_MS = 3 * 60 * 60 * 1000;

export type DiaLibre = { fecha: string; inicios: number[] }; // fecha "2026-10-28", inicios en minutos

const pad = (n: number) => String(n).padStart(2, "0");
export const claveFecha = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** Fecha y hora actuales en Argentina. */
export function ahoraAR() {
  const a = new Date(Date.now() - OFFSET_MS);
  return {
    y: a.getUTCFullYear(),
    m: a.getUTCMonth(),
    d: a.getUTCDate(),
    min: a.getUTCHours() * 60 + a.getUTCMinutes(),
  };
}

const aAR = (iso: string) => {
  const a = new Date(new Date(iso).getTime() - OFFSET_MS);
  return {
    fecha: claveFecha(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()),
    min: a.getUTCHours() * 60 + a.getUTCMinutes(),
  };
};

/** Horarios libres de todo un mes para un servicio de `duracionMin` minutos. */
export async function cargarMes(y: number, m: number, duracionMin: number): Promise<Record<string, number[]>> {
  const primero = claveFecha(y, m, 1);
  const ultimoDia = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const ultimo = claveFecha(y, m, ultimoDia);

  const [hor, blo, ocu] = await Promise.all([
    supabase.from("horarios_atencion").select("dia_semana,desde,hasta"),
    supabase.from("dias_bloqueados").select("fecha").gte("fecha", primero).lte("fecha", ultimo),
    supabase.rpc("horarios_ocupados", {
      desde: `${primero}T00:00:00-03:00`,
      hasta: `${ultimo}T23:59:59-03:00`,
    }),
  ]);
  if (hor.error || blo.error || ocu.error) {
    throw new Error(hor.error?.message ?? blo.error?.message ?? ocu.error?.message);
  }

  const franjas = new Map<number, Franja>();
  for (const h of hor.data ?? []) {
    franjas.set(h.dia_semana, { desde: String(h.desde).slice(0, 5), hasta: String(h.hasta).slice(0, 5) });
  }
  const bloqueados = new Set((blo.data ?? []).map((b: { fecha: string }) => b.fecha));
  const ocupadosPorDia = new Map<string, { inicio: number; fin: number }[]>();
  for (const o of (ocu.data ?? []) as { inicio: string; fin: string }[]) {
    const i = aAR(o.inicio);
    const f = aAR(o.fin);
    const lista = ocupadosPorDia.get(i.fecha) ?? [];
    lista.push({ inicio: i.min, fin: f.min === 0 ? 24 * 60 : f.min });
    ocupadosPorDia.set(i.fecha, lista);
  }

  const hoy = ahoraAR();
  const hoyClave = claveFecha(hoy.y, hoy.m, hoy.d);
  const res: Record<string, number[]> = {};
  for (let d = 1; d <= ultimoDia; d++) {
    const clave = claveFecha(y, m, d);
    if (clave < hoyClave || bloqueados.has(clave)) { res[clave] = []; continue; }
    const dow = new Date(Date.UTC(y, m, d)).getUTCDay();
    const margen = clave === hoyClave ? hoy.min + 60 : 0; // hoy: al menos 1 hora de anticipación
    res[clave] = iniciosLibres(franjas.get(dow), duracionMin, ocupadosPorDia.get(clave) ?? [], margen);
  }
  return res;
}
