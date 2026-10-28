"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Msg = { rol: "user" | "mia"; texto: string };

const SALUDO: Msg = {
  rol: "mia",
  texto: "¡Hola! Soy MIA, la asistente de LumiNails Studio. Te cuento precios y duraciones, o busco horarios libres para tu turno. ¿En qué te ayudo?",
};
const SUGERENCIAS = ["¿Qué horarios hay el viernes?", "¿Cuánto dura el Kapping?", "¿Cuánto cuesta el Soft Gel?"];

export function Mia() {
  const [abierta, setAbierta] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([SALUDO]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const fin = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => { fin.current?.scrollIntoView({ block: "end" }); }, [msgs, cargando, abierta]);
  useEffect(() => { if (abierta) campo.current?.focus(); }, [abierta]);
  useEffect(() => {
    if (!abierta) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setAbierta(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [abierta]);

  async function enviar(t: string) {
    const limpio = t.trim();
    if (!limpio || cargando) return;
    const nuevos: Msg[] = [...msgs, { rol: "user", texto: limpio }];
    setMsgs(nuevos); setTexto(""); setCargando(true);
    try {
      const r = await fetch("/api/mia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensajes: nuevos }) });
      const j = await r.json();
      setMsgs([...nuevos, { rol: "mia", texto: j.respuesta ?? "Perdoná, estoy teniendo problemas técnicos. Probá de nuevo en unos minutos." }]);
    } catch {
      setMsgs([...nuevos, { rol: "mia", texto: "Perdoná, estoy teniendo problemas técnicos. Probá de nuevo en unos minutos." }]);
    } finally { setCargando(false); }
  }

  return (
    <>
      {!abierta && (
        <button type="button" onClick={() => setAbierta(true)} aria-label="Hablar con MIA, la asistente de turnos"
          className="fixed right-4 bottom-24 z-40 inline-flex min-h-14 items-center gap-2 rounded-full bg-cacao px-5 font-bold text-hueso shadow-lg md:bottom-6 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cacao">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-rosa-suave" fill="currentColor"><path d="M12 0Q12.9 11.1 24 12Q12.9 12.9 12 24Q11.1 12.9 0 12Q11.1 11.1 12 0Z" /></svg>
          Hablá con MIA
        </button>
      )}
      {abierta && (
        <section role="dialog" aria-label="MIA, asistente de turnos"
          className="fixed inset-x-0 bottom-0 z-50 flex h-[min(34rem,88dvh)] flex-col overflow-hidden rounded-t-3xl border border-cacao/10 bg-white shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[24rem] sm:rounded-3xl">
          <header className="flex items-center justify-between gap-3 bg-rosa-suave px-5 py-3">
            <div>
              <p className="font-bold">MIA · Asistente de turnos</p>
              <p className="text-xs">Consulta la agenda real de LumiNails</p>
            </div>
            <button type="button" onClick={() => setAbierta(false)} aria-label="Cerrar el chat"
              className="grid size-11 place-items-center rounded-full hover:bg-white/60">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current stroke-[2.2]" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m, i) => (
              <p key={i} className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 leading-relaxed ${m.rol === "user" ? "ml-auto bg-hueso" : "bg-rosa-suave/60"}`}>{m.texto}</p>
            ))}
            {cargando && <p className="max-w-[85%] rounded-2xl bg-rosa-suave/60 px-4 py-2.5" role="status">MIA está mirando la agenda…</p>}
            <div ref={fin} />
          </div>
          <div className="border-t border-cacao/10 px-4 pt-3 pb-4">
            {msgs.length === 1 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {SUGERENCIAS.map((s) => (
                  <button key={s} type="button" onClick={() => enviar(s)} className="rounded-full border border-cacao/25 px-3 py-1.5 text-sm font-medium hover:bg-rosa-suave">{s}</button>
                ))}
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); enviar(texto); }} className="flex gap-2">
              <input ref={campo} value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={500} placeholder="Escribí tu consulta"
                aria-label="Escribí tu consulta" className="min-h-12 flex-1 rounded-full border border-cacao/25 px-4 outline-none focus:border-cacao" />
              <button type="submit" disabled={cargando || !texto.trim()} className="min-h-12 rounded-full bg-rosa-petalo px-5 font-bold disabled:opacity-50">Enviar</button>
            </form>
            <Link href="/reservar" className="mt-3 block text-center text-sm font-semibold underline underline-offset-4">Ir al calendario para reservar</Link>
          </div>
        </section>
      )}
    </>
  );
}
