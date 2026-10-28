import { NextResponse } from "next/server";
import { confirmarPago } from "@/lib/mercadopago";

// Aviso de Mercado Pago ("webhook"). No confiamos en el contenido: solo tomamos el número de pago
// y se lo preguntamos a Mercado Pago con nuestro token antes de confirmar el turno.
export async function POST(req: Request) {
  const url = new URL(req.url);
  let id = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  let tipo = url.searchParams.get("type") ?? url.searchParams.get("topic");
  if (!id) {
    try {
      const cuerpo = await req.json();
      id = cuerpo?.data?.id != null ? String(cuerpo.data.id) : null;
      tipo = tipo ?? cuerpo?.type ?? null;
    } catch { /* sin cuerpo */ }
  }
  if (tipo !== "payment" || !id) return NextResponse.json({ ok: true });

  try {
    await confirmarPago(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[mp-webhook] fallo:", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ ok: false }, { status: 500 }); // Mercado Pago reintenta
  }
}
