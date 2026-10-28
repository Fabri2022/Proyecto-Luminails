import { NextResponse } from "next/server";
import { MENSAJE_FALLA, responderMia, type Mensaje } from "@/lib/mia";

export const maxDuration = 60; // segundos: deja tiempo a Gemini y a un reintento

// Límite simple por IP (en memoria; alcanza para frenar abusos básicos en la demo).
const ventanas = new Map<string, number[]>();
const MAX = 20, VENTANA_MS = 10 * 60 * 1000;

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const ahora = Date.now();
  const recientes = (ventanas.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (recientes.length >= MAX) {
    return NextResponse.json({ respuesta: "Estás escribiendo muy rápido. Esperá unos minutos y seguimos." }, { status: 429 });
  }
  recientes.push(ahora); ventanas.set(ip, recientes);

  let cuerpo: { mensajes?: Mensaje[] };
  try { cuerpo = await req.json(); } catch { return NextResponse.json({ error: "Datos inválidos" }, { status: 400 }); }

  const mensajes = (Array.isArray(cuerpo.mensajes) ? cuerpo.mensajes : [])
    .filter((m) => (m?.rol === "user" || m?.rol === "mia") && typeof m.texto === "string" && m.texto.trim())
    .slice(-12)
    .map((m) => ({ rol: m.rol, texto: m.texto.trim().slice(0, 500) }));
  while (mensajes.length && mensajes[0].rol === "mia") mensajes.shift(); // el chat tiene que empezar por la clienta
  if (!mensajes.length || mensajes[mensajes.length - 1].rol !== "user") {
    return NextResponse.json({ error: "Escribí tu consulta" }, { status: 400 });
  }

  try {
    const { texto, opciones } = await responderMia(mensajes);
    return NextResponse.json({ respuesta: texto, opciones });
  } catch (e) {
    console.error("[mia]", e instanceof Error ? e.message : e);
    return NextResponse.json({ respuesta: MENSAJE_FALLA, falla: true });
  }
}
