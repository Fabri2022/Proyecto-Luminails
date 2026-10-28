// TEMPORAL: mide cuánto tarda Gemini. Se borra apenas se resuelva la demora.
import { NextResponse } from "next/server";
export const maxDuration = 60;

export async function GET() {
  const clave = process.env.GEMINI_API_KEY ?? "";
  const base = "https://generativelanguage.googleapis.com";
  const decl = [{ name: "hora", description: "devuelve la hora", parameters: { type: "OBJECT", properties: { x: { type: "STRING" } } } }];
  const variantes: { n: string; modelo: string; cfg?: object; tools?: boolean }[] = [
    { n: "A principal, sin extras", modelo: "gemini-3.8-flash" },
    { n: "B principal, razonamiento bajo", modelo: "gemini-3.8-flash", cfg: { thinkingConfig: { thinkingLevel: "low" } } },
    { n: "C principal, con herramientas", modelo: "gemini-3.8-flash", cfg: { thinkingConfig: { thinkingLevel: "low" } }, tools: true },
    { n: "D respaldo, sin extras", modelo: "gemini-flash-latest" },
    { n: "E flash-lite", modelo: "gemini-flash-lite-latest" },
  ];
  const res = await Promise.all(variantes.map(async (v) => {
    const t0 = Date.now();
    try {
      const r = await fetch(`${base}/v1beta/models/${v.modelo}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": clave },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Decí hola en una palabra." }] }],
          ...(v.tools ? { tools: [{ functionDeclarations: decl }] } : {}),
          generationConfig: { maxOutputTokens: 100, ...(v.cfg ?? {}) },
        }),
        signal: AbortSignal.timeout(45000),
      });
      const t = await r.text();
      return { variante: v.n, ms: Date.now() - t0, estado: r.status, detalle: t.replace(/\s+/g, " ").slice(0, 160) };
    } catch (e) {
      return { variante: v.n, ms: Date.now() - t0, estado: "error", detalle: e instanceof Error ? e.message : String(e) };
    }
  }));
  return NextResponse.json(res);
}
