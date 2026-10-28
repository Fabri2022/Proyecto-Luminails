"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Opcion = { servicio: string; servicioNombre: string; fecha: string; hora: number; etiqueta: string };
type Msg = { rol: "user" | "mia"; texto: string; opciones?: Opcion[]; local?: boolean };

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const cuando = (o: Opcion) => {
  const [y, m, d] = o.fecha.split("-").map(Number);
  return `${DIAS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${d} de ${MESES[m - 1]} · ${hhmm(o.hora)} hs`;
};

const SALUDO: Msg = {
  rol: "mia",
  texto: "¡Hola! Soy MIA, la asistente de LumiNails Studio. Te cuento precios y duraciones, o busco horarios libres para tu turno. ¿En qué te ayudo?",
};
const SUGERENCIAS = ["¿Qué horarios hay el viernes?", "¿Cuánto dura el Kapping?", "¿Cuánto cuesta el Soft Gel?"];

export function Mia() {
  const [abierta, setAbierta] = useState(false);
  const [arriba, setArriba] = useState(true); // en el celular el botón solo se ve al entrar, arriba de todo
  const [msgs, setMsgs] = useState<Msg[]>([SALUDO]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [elegida, setElegida] = useState<Opcion | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [yendo, setYendo] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const fin = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const alScroll = () => setArriba(window.scrollY < 80);
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);
  useEffect(() => { fin.current?.scrollIntoView({ block: "end" }); }, [msgs, cargando, abierta, elegida]);
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
      const r = await fetch("/api/mia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensajes: nuevos.filter((m) => !m.local) }) });
      const j = await r.json();
      setMsgs([...nuevos, { rol: "mia", texto: j.respuesta ?? "Perdoná, estoy teniendo problemas técnicos. Probá de nuevo en unos minutos.", opciones: Array.isArray(j.opciones) ? j.opciones : [] }]);
    } catch {
      setMsgs([...nuevos, { rol: "mia", texto: "Perdoná, estoy teniendo problemas técnicos. Probá de nuevo en unos minutos." }]);
    } finally { setCargando(false); }
  }

  function elegir(o: Opcion) {
    setElegida(o); setErrorPago("");
    setMsgs((ms) => [...ms, { rol: "user", texto: `Quiero el turno de ${o.servicioNombre} el ${cuando(o)}`, local: true }]);
  }

  // Reserva el horario (10 minutos) y abre Mercado Pago para pagar la seña.
  async function reservarYPagar() {
    if (!elegida || yendo) return;
    setYendo(true); setErrorPago("");
    try {
      const r = await fetch("/api/reservar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicio: elegida.servicio, adicionales: [], fecha: elegida.fecha, hora: elegida.hora, nombre, telefono }),
      });
      const j = await r.json();
      if (!r.ok) { setErrorPago(j.error ?? "No pudimos reservar. Probá de nuevo."); setYendo(false); return; }
      const p = await fetch("/api/pagar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ turnoId: j.turnoId }) });
      const k = await p.json();
      if (p.ok && k.url) { window.location.href = k.url; return; }
      setErrorPago(k.error ?? "No pudimos iniciar el pago. Probá de nuevo.");
    } catch { setErrorPago("Sin conexión. Probá de nuevo."); }
    setYendo(false);
  }
  const datosOk = nombre.trim().length >= 2 && telefono.replace(/\D/g, "").length >= 8 && acepta;

  return (
    <>
      {!abierta && (
        <button type="button" onClick={() => setAbierta(true)} aria-label="Hablar con MIA, la asistente de turnos"
          className={`fixed right-4 bottom-24 z-40 inline-flex min-h-14 items-center gap-2 rounded-full bg-cacao px-5 font-bold text-hueso shadow-lg transition-[opacity,transform] duration-300 md:bottom-6 md:translate-y-0 md:opacity-100 md:pointer-events-auto ${arriba ? "" : "pointer-events-none translate-y-6 opacity-0"} focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cacao`}>
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
              <div key={i} className={m.rol === "user" ? "ml-auto max-w-[85%]" : "max-w-[92%]"}>
                <p className={`whitespace-pre-line rounded-2xl px-4 py-2.5 leading-relaxed ${m.rol === "user" ? "bg-hueso" : "bg-rosa-suave/60"}`}>{m.texto}</p>
                {m.opciones && m.opciones.length > 0 && !elegida && i === msgs.length - 1 && (
                  <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Horarios libres">
                    {m.opciones.map((o) => (
                      <button key={o.servicio + o.fecha + o.hora} type="button" onClick={() => elegir(o)}
                        className="min-h-11 rounded-full bg-white px-4 text-sm font-semibold ring-2 ring-salvia hover:bg-salvia">{o.etiqueta}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {elegida && (
              <div className="rounded-2xl bg-rosa-suave/60 p-4">
                <p className="font-bold">{elegida.servicioNombre}</p>
                <p className="capitalize">{cuando(elegida)}</p>
                <p className="mt-1 text-sm">Para guardarte el horario necesitamos tus datos. Después pagás la seña de $2.000 con Mercado Pago.</p>
                <label className="mt-3 block text-sm font-semibold">Nombre
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className="mt-1 block min-h-11 w-full rounded-xl bg-white px-3 text-base ring-1 ring-cacao/25" />
                </label>
                <label className="mt-2 block text-sm font-semibold">Teléfono (WhatsApp)
                  <input value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" autoComplete="tel" className="mt-1 block min-h-11 w-full rounded-xl bg-white px-3 text-base ring-1 ring-cacao/25" />
                </label>
                <label className="mt-3 flex items-start gap-2 text-xs">
                  <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#4a2e35]" />
                  <span>Acepto los <Link href="/terminos" target="_blank" className="font-semibold underline">términos</Link> y la <Link href="/privacidad" target="_blank" className="font-semibold underline">política de privacidad</Link>.</span>
                </label>
                {errorPago && <p className="mt-2 text-sm font-semibold" role="alert">{errorPago}</p>}
                <button type="button" onClick={reservarYPagar} disabled={!datosOk || yendo} className="btn-cta mt-3 w-full disabled:opacity-50">
                  {yendo ? "Abriendo Mercado Pago…" : "Pagar seña de $2.000"}
                </button>
                <button type="button" onClick={() => { setElegida(null); setErrorPago(""); }} className="mt-2 block w-full text-center text-sm font-semibold underline underline-offset-4">Elegir otro horario</button>
              </div>
            )}
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
