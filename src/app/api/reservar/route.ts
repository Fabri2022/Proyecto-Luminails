import { NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase-servidor";
import { iniciosLibres } from "@/lib/horarios";
import { ADICIONALES, SENA } from "@/data/servicios";

const OFFSET_MS = 3 * 60 * 60 * 1000; // Argentina: UTC-3 todo el año
const RETENCION_MIN = 10;

type Cuerpo = { servicio?: string; adicionales?: string[]; fecha?: string; hora?: number; nombre?: string; telefono?: string };

export async function POST(req: Request) {
  let c: Cuerpo;
  try { c = await req.json(); } catch { return NextResponse.json({ error: "Datos inválidos" }, { status: 400 }); }

  // 1) Validar entrada (nunca confiar en el navegador)
  const nombre = (c.nombre ?? "").trim().slice(0, 80);
  const telefono = (c.telefono ?? "").replace(/[^\d+]/g, "").slice(0, 20);
  if (nombre.length < 2 || telefono.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Revisá tu nombre y teléfono" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.fecha ?? "") || !Number.isInteger(c.hora) || c.hora! < 0 || c.hora! >= 1440) {
    return NextResponse.json({ error: "Fecha u hora inválida" }, { status: 400 });
  }
  const extras = ADICIONALES.filter((a) => (c.adicionales ?? []).includes(a.id));

  try {
    const db = supabaseServidor();

    // 2) Precio y duración salen de la base, no del navegador
    const { data: serv, error: errServ } = await db.from("servicios").select("id,precio,duracion_min").eq("slug", c.servicio ?? "").eq("activo", true).single();
    if (errServ && errServ.code !== "PGRST116") throw new Error(`servicios: ${errServ.code} ${errServ.message}`);
    if (!serv) return NextResponse.json({ error: "Servicio inexistente" }, { status: 400 });

    // 3) Verificar que ese horario realmente esté libre (misma regla que el calendario)
    const { error: errLib } = await db.rpc("liberar_turnos_vencidos");
    if (errLib) throw new Error(`liberar_turnos_vencidos: ${errLib.code} ${errLib.message}`);
    const [y, m, d] = c.fecha!.split("-").map(Number);
    const inicio = new Date(Date.UTC(y, m - 1, d, 0, c.hora!) + OFFSET_MS);
    const fin = new Date(inicio.getTime() + serv.duracion_min * 60000);
    if (inicio.getTime() < Date.now() + 30 * 60000) {
      return NextResponse.json({ error: "Ese horario ya pasó" }, { status: 409 });
    }
    const [{ data: hor }, { data: blo }, { data: ocu }] = await Promise.all([
      db.from("horarios_atencion").select("desde,hasta").eq("dia_semana", new Date(Date.UTC(y, m - 1, d)).getUTCDay()).eq("activo", true),
      db.from("dias_bloqueados").select("fecha").eq("fecha", c.fecha!),
      db.rpc("horarios_ocupados", { desde: `${c.fecha}T00:00:00-03:00`, hasta: `${c.fecha}T23:59:59-03:00` }),
    ]);
    const franja = hor?.[0] ? { desde: String(hor[0].desde).slice(0, 5), hasta: String(hor[0].hasta).slice(0, 5) } : undefined;
    const aMin = (iso: string) => { const a = new Date(new Date(iso).getTime() - OFFSET_MS); return a.getUTCHours() * 60 + a.getUTCMinutes(); };
    const ocupados = ((ocu ?? []) as { inicio: string; fin: string }[]).map((o) => ({ inicio: aMin(o.inicio), fin: aMin(o.fin) || 1440 }));
    const libres = blo?.length ? [] : iniciosLibres(franja, serv.duracion_min, ocupados);
    if (!libres.includes(c.hora!)) {
      return NextResponse.json({ error: "Ese horario ya no está disponible. Elegí otro." }, { status: 409 });
    }

    // 4) Reservar 10 minutos. Si dos personas llegan juntas, la base rechaza a la segunda.
    const total = serv.precio + extras.reduce((t, a) => t + a.precio, 0);
    const { data: turno, error } = await db.from("turnos").insert({
      servicio_id: serv.id, cliente_nombre: nombre, cliente_telefono: telefono,
      inicio: inicio.toISOString(), fin: fin.toISOString(), estado: "pendiente",
      sena_monto: SENA, adicionales: extras.map((a) => a.id), total,
      expira_en: new Date(Date.now() + RETENCION_MIN * 60000).toISOString(),
    }).select("id,expira_en").single();

    if (error && error.code !== "23P01") console.error("[reservar] insert:", error.code, error.message);
    if (error) {
      const choque = error.code === "23P01"; // exclusion_violation: otro turno ganó de mano
      return NextResponse.json({ error: choque ? "Alguien acaba de reservar ese horario. Elegí otro." : "No pudimos reservar. Probá de nuevo." }, { status: choque ? 409 : 500 });
    }
    return NextResponse.json({ turnoId: turno.id, expiraEn: turno.expira_en, total, sena: SENA });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[reservar] fallo:", msg); // visible en Vercel → Logs
    const config = msg.includes("SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json({
      error: "Problema técnico. Probá de nuevo en un momento.",
      codigo: config ? "FALTA_CLAVE_SERVIDOR" : "ERROR_INTERNO", // sin datos sensibles
    }, { status: 500 });
  }
}
