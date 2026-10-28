import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseServidor } from "@/lib/supabase-servidor";
import { confirmarPago, esUuid } from "@/lib/mercadopago";
import { formatearPrecio } from "@/data/servicios";
import { Gracias } from "./Gracias";
import { AvisoAsistencia } from "@/components/AvisoAsistencia";

export const metadata = { title: "Tu turno · LumiNails Studio" };

const ZONA = "America/Argentina/Buenos_Aires";
const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

type Params = Promise<Record<string, string | string[] | undefined>>;

// Con "Cache Components" los datos del momento (query, base de datos) van dentro de <Suspense>.
export default function Resultado({ searchParams }: { searchParams: Params }) {
  return (
    <Suspense fallback={<p className="p-6 text-center" role="status">Confirmando tu pago…</p>}>
      <Contenido searchParams={searchParams} />
    </Suspense>
  );
}

async function Contenido({ searchParams }: { searchParams: Params }) {
  const q = await searchParams;
  const turnoId = uno(q.turno);
  const pagoId = uno(q.payment_id) ?? uno(q.collection_id);

  // Al volver de Mercado Pago confirmamos el pago acá mismo (además del aviso automático).
  if (pagoId) { try { await confirmarPago(pagoId); } catch (e) { console.error("[resultado] confirmar:", e instanceof Error ? e.message : e); } }

  let turno: { estado: string; inicio: string; sena_monto: number; servicio: string } | null = null;
  if (esUuid(turnoId)) {
    const { data } = await supabaseServidor().from("turnos")
      .select("estado,inicio,sena_monto,servicios(nombre)").eq("id", turnoId).maybeSingle();
    if (data) {
      const s = data.servicios as unknown as { nombre: string } | { nombre: string }[] | null;
      turno = { estado: data.estado, inicio: data.inicio, sena_monto: data.sena_monto, servicio: (Array.isArray(s) ? s[0]?.nombre : s?.nombre) ?? "Turno" };
    }
  }

  const estadoMp = uno(q.status) ?? uno(q.collection_status);
  const confirmado = turno?.estado === "confirmado";
  const enProceso = !confirmado && (estadoMp === "pending" || estadoMp === "in_process");

  const cuando = turno ? new Date(turno.inicio) : null;
  const dia = cuando?.toLocaleDateString("es-AR", { timeZone: ZONA, weekday: "long", day: "numeric", month: "long" });
  const hora = cuando?.toLocaleTimeString("es-AR", { timeZone: ZONA, hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <main className="mx-auto w-full max-w-xl px-4 pt-10 pb-16 text-center">
      <Image src="/logo/LumiNails_simbolo.svg" alt="" width={80} height={80} className="mx-auto" />
      {confirmado && turno ? (
        <>
          <h1 className="mt-4 font-serif text-4xl font-semibold">¡Turno confirmado!</h1>
          <p className="mt-2 font-serif text-2xl">Gracias por confiar en nosotros ✨</p>
          <p className="mt-1">Recibimos tu seña. Te esperamos.</p>
          <div className="card-suave mt-6 p-5 text-left">
            <p className="font-bold">{turno.servicio}</p>
            <p className="capitalize">{dia} · {hora} hs</p>
            <p className="mt-3 flex justify-between font-bold"><span>Seña abonada</span><span>{formatearPrecio(turno.sena_monto)}</span></p>
          </div>
          <div className="mt-4"><AvisoAsistencia /></div>
          <p className="mt-3 text-sm">¿Necesitás cancelar? <Link href="/arrepentimiento" className="font-semibold underline">Hacelo acá</Link> o escribile a Agustina por WhatsApp.</p>
          <p className="mt-2 text-sm">Cuando tengas tus uñas, <Link href="/opinion" className="font-semibold underline">dejanos tu opinión ★</Link></p>
          <Gracias />
        </>
      ) : enProceso ? (
        <>
          <h1 className="mt-4 font-serif text-4xl font-semibold">Estamos esperando tu pago</h1>
          <p className="mt-2">Mercado Pago todavía no nos confirmó la seña. Apenas se acredite, tu turno queda confirmado.</p>
        </>
      ) : (
        <>
          <h1 className="mt-4 font-serif text-4xl font-semibold">No pudimos confirmar tu pago</h1>
          <p className="mt-2">Tu turno todavía no está confirmado. Podés intentar de nuevo con otro medio de pago.</p>
          <Link href="/reservar" className="btn-cta mt-6 inline-flex w-full justify-center">Volver a reservar</Link>
        </>
      )}
      <p className="mt-8"><Link href="/" className="text-sm font-semibold underline underline-offset-4">Volver al inicio</Link></p>
    </main>
  );
}
