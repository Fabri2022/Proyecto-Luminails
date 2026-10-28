// MIA, la asistente virtual de LumiNails Studio.
// Usa Gemini con "function calling": para hablar de horarios SIEMPRE consulta la agenda real
// (la misma que usa el calendario de reservas). Si la consulta falla, no inventa nada.

import { SERVICIOS, ADICIONALES, SENA, formatearDuracion, formatearPrecio } from "@/data/servicios";
import { ahoraAR, cargarMes, claveFecha } from "./disponibilidad";
import { formatearHora } from "./horarios";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

export type Mensaje = { rol: "user" | "mia"; texto: string };

export const MENSAJE_FALLA =
  "Perdoná, estoy teniendo problemas técnicos y no puedo consultar la agenda en este momento. Probá de nuevo en unos minutos o mirá los horarios directo en el calendario de la pantalla.";

function sistema(): string {
  const a = ahoraAR();
  const dow = new Date(Date.UTC(a.y, a.m, a.d)).getUTCDay();
  const servicios = SERVICIOS.map((s) => `- ${s.nombre}: ${formatearPrecio(s.precio)}, dura ${formatearDuracion(s.duracionMin)}`).join("\n");
  const extras = ADICIONALES.map((x) => `- ${x.nombre}: +${formatearPrecio(x.precio)} (se suma a un servicio)`).join("\n");
  return `Sos MIA, la asistente virtual oficial de LumiNails Studio, un emprendimiento de Nail Art en La Rioja, Argentina. Tu objetivo es resolver dudas frecuentes y guiar a las clientas en la reserva de turnos.

Tono: amable, profesional y cercano, con voseo argentino (vos, tenés, podés). Respuestas cortas (2 o 3 frases), claras y al grano. Sin lenguaje robótico. Escribí texto plano: sin asteriscos, sin negritas, sin listas con símbolos.

Hoy es ${DIAS[dow]} ${claveFecha(a.y, a.m, a.d)} y son las ${formatearHora(a.min)} (hora de Argentina).

Servicios (los únicos que ofrece el estudio):
${servicios}
Adicionales:
${extras}
Seña para confirmar cualquier turno: ${formatearPrecio(SENA)}, se paga únicamente con Mercado Pago desde la aplicación.
Días de atención generales: lunes y martes de 15:00 a 17:30, miércoles a viernes de 15:00 a 18:00, sábados de 14:00 a 21:00, domingos cerrado. Los turnos arrancan cada 30 minutos. Instagram del estudio: @luminails._studio.

Reglas estrictas:
1. CERO ALUCINACIONES. Bajo ningún concepto inventes horarios ni días disponibles. Para cualquier pregunta de disponibilidad (por ejemplo "el viernes") tenés que usar la herramienta de disponibilidad antes de responder, y ofrecer SOLO los horarios que devuelve. Si la clienta no dijo qué servicio quiere, preguntáselo antes de consultar, porque la duración cambia los horarios.
2. Si la herramienta falla o no devuelve datos, pedí disculpas e indicá que estás teniendo problemas técnicos. No des horarios de memoria.
3. Si preguntan por cancelaciones, cuidados posteriores u otra cosa que no esté en este mensaje, decí que no tenés esa información y que le escriban a Agustina por Instagram (@luminails._studio). No inventes políticas.
4. Si preguntan cosas que no tienen relación con uñas, turnos o el salón, respondé cortésmente que solo podés ayudar con la agenda de LumiNails Studio.
5. Tu objetivo final es que la clienta elija el turno en la pantalla: cuando le confirmes horarios disponibles, decile que toque "Ir al calendario" (o el calendario de la pantalla) para elegir el horario y pagar la seña. Vos no reservás ni cobrás.
6. No pidas ni repitas datos personales como teléfono, DNI o tarjetas.`;
}

// ---------- Herramientas (lo único que MIA puede consultar) ----------

const DECLARACIONES = [
  {
    name: "consultar_disponibilidad",
    description:
      "Devuelve los horarios libres REALES de la agenda para un servicio en un día. Usala siempre antes de mencionar horarios.",
    parameters: {
      type: "OBJECT",
      properties: {
        servicio: { type: "STRING", description: "Uno de: semipermanente, kapping, soft-gel" },
        dia: { type: "STRING", description: "Una fecha AAAA-MM-DD, o: hoy, mañana, lunes, martes, miércoles, jueves, viernes, sábado, domingo (el próximo que llegue)" },
      },
      required: ["servicio", "dia"],
    },
  },
  {
    name: "proximos_dias_libres",
    description: "Devuelve los próximos días que tienen horarios libres para un servicio. Usala cuando la clienta no dice un día o pide 'lo primero que haya'.",
    parameters: {
      type: "OBJECT",
      properties: { servicio: { type: "STRING", description: "Uno de: semipermanente, kapping, soft-gel" } },
      required: ["servicio"],
    },
  },
];

function servicioPor(texto: unknown) {
  const t = norm(String(texto ?? "")).replace(/\s+/g, "-");
  return SERVICIOS.find((s) => s.id === t || norm(s.nombre).replace(/\s+/g, "-") === t);
}

function resolverDia(dia: unknown): string | null {
  const t = norm(String(dia ?? ""));
  const a = ahoraAR();
  const base = Date.UTC(a.y, a.m, a.d);
  const aClave = (ms: number) => { const f = new Date(ms); return claveFecha(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate()); };
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  if (t === "hoy") return aClave(base);
  if (t === "manana") return aClave(base + 86400000);
  const idx = DIAS.map(norm).indexOf(t);
  if (idx < 0) return null;
  const hoyDow = new Date(base).getUTCDay();
  const falta = (idx - hoyDow + 7) % 7; // hoy cuenta si todavía quedan horarios
  return aClave(base + falta * 86400000);
}

async function consultarDisponibilidad(args: Record<string, unknown>) {
  const s = servicioPor(args.servicio);
  if (!s) return { error: "Servicio desconocido. Los servicios son: semipermanente, kapping, soft-gel." };
  const fecha = resolverDia(args.dia);
  if (!fecha) return { error: "No se entendió el día." };
  const [y, m, d] = fecha.split("-").map(Number);
  const mes = await cargarMes(y, m - 1, s.duracionMin);
  const libres = mes[fecha];
  const nombreDia = DIAS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  if (!libres) return { error: "Fecha fuera de rango." };
  return { servicio: s.nombre, fecha, dia: nombreDia, horarios_libres: libres.map(formatearHora), hay_lugar: libres.length > 0 };
}

async function proximosDiasLibres(args: Record<string, unknown>) {
  const s = servicioPor(args.servicio);
  if (!s) return { error: "Servicio desconocido. Los servicios son: semipermanente, kapping, soft-gel." };
  const a = ahoraAR();
  const dias: { fecha: string; dia: string; horarios_libres: string[] }[] = [];
  for (let k = 0; k < 2 && dias.length < 4; k++) {
    const y = a.y + Math.floor((a.m + k) / 12), m = (a.m + k) % 12;
    const mes = await cargarMes(y, m, s.duracionMin);
    for (const fecha of Object.keys(mes).sort()) {
      if (mes[fecha].length && dias.length < 4) {
        const [yy, mm, dd] = fecha.split("-").map(Number);
        dias.push({ fecha, dia: DIAS[new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay()], horarios_libres: mes[fecha].map(formatearHora) });
      }
    }
  }
  return { servicio: s.nombre, proximos_dias: dias };
}

async function ejecutar(nombre: string, args: Record<string, unknown>) {
  try {
    if (nombre === "consultar_disponibilidad") return await consultarDisponibilidad(args);
    if (nombre === "proximos_dias_libres") return await proximosDiasLibres(args);
    return { error: "Herramienta desconocida" };
  } catch (e) {
    console.error("[mia] herramienta:", nombre, e instanceof Error ? e.message : e);
    return { error: "No se pudo consultar la agenda (problema técnico)." };
  }
}

// ---------- Conversación con Gemini ----------

type Parte = { text?: string; functionCall?: { name: string; args?: Record<string, unknown> }; functionResponse?: unknown; [k: string]: unknown };
type Contenido = { role: "user" | "model"; parts: Parte[] };

export async function responderMia(historial: Mensaje[]): Promise<string> {
  const clave = process.env.GEMINI_API_KEY;
  if (!clave) throw new Error("Falta GEMINI_API_KEY");
  const base = process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com";
  const modelo = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  const contents: Contenido[] = historial.map((m) => ({ role: m.rol === "user" ? "user" : "model", parts: [{ text: m.texto }] }));

  for (let vuelta = 0; vuelta < 5; vuelta++) {
    const r = await fetch(`${base}/v1beta/models/${modelo}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": clave },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sistema() }] },
        contents,
        tools: [{ functionDeclarations: DECLARACIONES }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) throw new Error(`Gemini ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const j = await r.json();
    const cand = j.candidates?.[0]?.content as Contenido | undefined;
    if (!cand?.parts?.length) throw new Error("Gemini sin respuesta");

    const llamadas = cand.parts.filter((p) => p.functionCall);
    if (!llamadas.length) {
      const texto = cand.parts.map((p) => p.text ?? "").join("").trim();
      if (!texto) throw new Error("Gemini respondió vacío");
      return texto.replace(/\*+/g, "").replace(/^#+\s*/gm, "");
    }
    contents.push(cand);
    const respuestas = await Promise.all(
      llamadas.map(async (p) => ({
        functionResponse: { name: p.functionCall!.name, response: { resultado: await ejecutar(p.functionCall!.name, p.functionCall!.args ?? {}) } },
      })),
    );
    contents.push({ role: "user", parts: respuestas });
  }
  throw new Error("Demasiadas vueltas de herramientas");
}
