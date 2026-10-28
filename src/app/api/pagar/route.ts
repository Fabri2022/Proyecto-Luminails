import { NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase-servidor";
import { crearPreferencia, esUuid } from "@/lib/mercadopago";

function origen(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host) return `${req.headers.get("x-forwarded-proto") ?? "https"}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
}

// Crea el link de pago de la seña para un turno que sigue reservado (pendiente y sin vencer).
export async function POST(req: Request) {
  let turnoId: unknown;
  try { turnoId = (await req.json()).turnoId; } catch { /* cuerpo inválido */ }
  if (!esUuid(turnoId)) return NextResponse.json({ error: "Reserva inválida" }, { status: 400 });

  try {
    const db = supabaseServidor();
    const { error: errLib } = await db.rpc("liberar_turnos_vencidos");
    if (errLib) throw new Error(`liberar_turnos_vencidos: ${errLib.code} ${errLib.message}`);

    const { data, error } = await db.from("turnos")
      .select("id,estado,expira_en,sena_monto,servicios(nombre)").eq("id", turnoId).maybeSingle();
    if (error) throw new Error(`turnos: ${error.code} ${error.message}`);
    if (!data) return NextResponse.json({ error: "No encontramos tu reserva" }, { status: 404 });
    if (data.estado === "confirmado") return NextResponse.json({ error: "Este turno ya está pagado" }, { status: 409 });
    if (data.estado !== "pendiente" || !data.expira_en || new Date(data.expira_en).getTime() < Date.now()) {
      return NextResponse.json({ error: "Tu reserva venció. Elegí un horario de nuevo." }, { status: 409 });
    }

    const serv = data.servicios as unknown as { nombre: string } | { nombre: string }[] | null;
    const nombre = (Array.isArray(serv) ? serv[0]?.nombre : serv?.nombre) ?? "turno";
    const pref = await crearPreferencia({
      turnoId, titulo: `Seña ${nombre} · LumiNails Studio`, monto: data.sena_monto, origen: origen(req),
    });
    await db.from("turnos").update({ mp_preference_id: pref.id }).eq("id", turnoId);
    return NextResponse.json({ url: pref.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pagar] fallo:", msg); // visible en Vercel → Logs (nunca incluye el token)
    return NextResponse.json({
      error: "No pudimos iniciar el pago. Probá de nuevo en un momento.",
      codigo: msg.includes("MP_ACCESS_TOKEN") ? "FALTA_CLAVE_MP" : "ERROR_PAGO",
    }, { status: 500 });
  }
}
