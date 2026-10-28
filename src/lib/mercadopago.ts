import "server-only";
import { supabaseServidor } from "@/lib/supabase-servidor";

// Mercado Pago (Checkout Pro) — solo servidor. El Access Token nunca sale de acá.
const API = "https://api.mercadopago.com";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const esUuid = (v: unknown): v is string => typeof v === "string" && UUID.test(v);

function cabeceras() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MP_ACCESS_TOKEN");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

/** Crea la preferencia de pago de la seña y devuelve el link de Mercado Pago. */
export async function crearPreferencia(p: { turnoId: string; titulo: string; monto: number; origen: string }) {
  const volver = `${p.origen}/reservar/resultado?turno=${p.turnoId}`;
  const r = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: cabeceras(),
    body: JSON.stringify({
      items: [{ id: p.turnoId, title: p.titulo, quantity: 1, unit_price: p.monto, currency_id: "ARS" }],
      external_reference: p.turnoId,
      back_urls: { success: volver, failure: volver, pending: volver },
      auto_return: "approved",
      notification_url: `${p.origen}/api/mp-webhook`,
      statement_descriptor: "LUMINAILS",
    }),
  });
  if (!r.ok) throw new Error(`MP preferencia ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = (await r.json()) as { id: string; init_point: string };
  return { id: j.id, url: j.init_point };
}

export type ResultadoPago =
  | { estado: "confirmado"; turnoId: string }
  | { estado: "pendiente" | "rechazado" | "conflicto" | "monto_invalido" | "ignorado" | "no_encontrado" };

/**
 * Confirma un pago consultando a Mercado Pago (la fuente de verdad), nunca confiando en lo que
 * manda el navegador o el aviso. Es seguro llamarla varias veces para el mismo pago.
 */
export async function confirmarPago(paymentId: string): Promise<ResultadoPago> {
  if (!/^\d+$/.test(paymentId)) return { estado: "ignorado" };
  const r = await fetch(`${API}/v1/payments/${paymentId}`, { headers: cabeceras(), cache: "no-store" });
  if (r.status === 404) return { estado: "no_encontrado" };
  if (!r.ok) throw new Error(`MP pago ${r.status}`);
  const pago = (await r.json()) as {
    id: number; status: string; currency_id: string; transaction_amount: number; external_reference?: string;
  };

  if (!esUuid(pago.external_reference)) return { estado: "ignorado" };
  const turnoId = pago.external_reference;
  const db = supabaseServidor();

  const { data: turno, error } = await db.from("turnos").select("id,estado,sena_monto").eq("id", turnoId).maybeSingle();
  if (error) throw new Error(`turnos: ${error.code} ${error.message}`);
  if (!turno) return { estado: "ignorado" };

  if (pago.status !== "approved") {
    return { estado: ["rejected", "cancelled", "refunded", "charged_back"].includes(pago.status) ? "rechazado" : "pendiente" };
  }
  if (pago.currency_id !== "ARS" || Number(pago.transaction_amount) !== turno.sena_monto) {
    console.error("[pago] monto o moneda no coinciden", { turnoId, monto: pago.transaction_amount, moneda: pago.currency_id });
    return { estado: "monto_invalido" };
  }
  if (turno.estado === "confirmado") return { estado: "confirmado", turnoId };

  // Si el pago aprobó justo después de vencer la reserva, se confirma igual mientras el horario siga libre.
  const { data: filas, error: errUpd } = await db.from("turnos")
    .update({ estado: "confirmado", mp_payment_id: String(pago.id), expira_en: null })
    .eq("id", turnoId).in("estado", ["pendiente", "vencido"]).select("id");
  if (errUpd) {
    if (errUpd.code === "23P01") {
      console.error("[pago] horario ocupado por otro turno; hay que devolver la seña", { turnoId, pago: pago.id });
      return { estado: "conflicto" };
    }
    throw new Error(`confirmar: ${errUpd.code} ${errUpd.message}`);
  }
  return filas?.length ? { estado: "confirmado", turnoId } : { estado: "ignorado" };
}
