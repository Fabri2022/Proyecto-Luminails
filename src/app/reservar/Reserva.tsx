"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ADICIONALES, SENA, SERVICIOS, formatearDuracion, formatearPrecio,
} from "@/data/servicios";
import { ahoraAR, cargarMes, claveFecha } from "@/lib/disponibilidad";
import { formatearHora } from "@/lib/horarios";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const DIAS_LARGO = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];

export default function Reserva() {
  const servicioInicial = useSearchParams().get("servicio") ?? undefined;
  const hoy = useMemo(() => ahoraAR(), []);
  const [servicioId, setServicioId] = useState(
    SERVICIOS.some((s) => s.id === servicioInicial) ? servicioInicial! : SERVICIOS[0].id,
  );
  const [extras, setExtras] = useState<string[]>([]);
  const [mes, setMes] = useState({ y: hoy.y, m: hoy.m });
  const [dias, setDias] = useState<Record<string, number[]> | null>(null);
  const [error, setError] = useState(false);
  const [fecha, setFecha] = useState<string | null>(null);
  const [hora, setHora] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const servicio = SERVICIOS.find((s) => s.id === servicioId)!;
  const total = servicio.precio + ADICIONALES.filter((a) => extras.includes(a.id)).reduce((t, a) => t + a.precio, 0);

  useEffect(() => {
    let vigente = true;
    setDias(null); setError(false); setFecha(null); setHora(null);
    cargarMes(mes.y, mes.m, servicio.duracionMin)
      .then((r) => vigente && setDias(r))
      .catch(() => vigente && setError(true));
    return () => { vigente = false; };
  }, [mes, servicio.duracionMin]);

  const primerDow = (new Date(Date.UTC(mes.y, mes.m, 1)).getUTCDay() + 6) % 7; // lunes = 0
  const cantDias = new Date(Date.UTC(mes.y, mes.m + 1, 0)).getUTCDate();
  const esMesActual = mes.y === hoy.y && mes.m === hoy.m;
  const mesesAdelante = (mes.y - hoy.y) * 12 + (mes.m - hoy.m);
  const cambiarMes = (delta: number) => {
    const t = mes.m + delta;
    setMes({ y: mes.y + Math.floor(t / 12), m: ((t % 12) + 12) % 12 });
  };

  const horas = fecha && dias ? dias[fecha] ?? [] : [];
  const telOk = telefono.replace(/\D/g, "").length >= 8;
  const listo = fecha !== null && hora !== null && nombre.trim().length >= 2 && telOk;
  const fechaTexto = fecha
    ? (() => { const [y, m, d] = fecha.split("-").map(Number); return `${DIAS_LARGO[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${d} de ${MESES[m - 1].toLowerCase()}`; })()
    : "";

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-32 pt-6">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Volver al inicio">
          <Image src="/logo/LumiNails_horizontal.svg" alt="LumiNails Studio" width={420} height={86} className="h-9 w-auto" priority />
        </Link>
        <Link href="/" className="text-sm font-semibold underline underline-offset-4">Volver</Link>
      </header>

      <h1 className="mt-6 font-serif text-4xl font-semibold">Reservá tu turno</h1>

      <section aria-labelledby="t-serv" className="mt-6">
        <h2 id="t-serv" className="text-lg font-bold">1. Elegí tu servicio</h2>
        <div className="mt-3 grid gap-2" role="radiogroup" aria-labelledby="t-serv">
          {SERVICIOS.map((s) => (
            <button key={s.id} role="radio" aria-checked={s.id === servicioId} onClick={() => setServicioId(s.id)}
              className={`flex min-h-16 items-center justify-between rounded-2xl border-2 px-4 py-3 text-left ${s.id === servicioId ? "border-cacao bg-rosa-suave" : "border-transparent bg-white"} card-suave`}>
              <span><span className="block font-bold">{s.nombre}</span><span className="text-sm">{formatearDuracion(s.duracionMin)}</span></span>
              <span className="font-serif text-2xl font-semibold">{formatearPrecio(s.precio)}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold">Sumá un adicional (opcional)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ADICIONALES.map((a) => {
            const on = extras.includes(a.id);
            return (
              <button key={a.id} aria-pressed={on} onClick={() => setExtras(on ? extras.filter((x) => x !== a.id) : [...extras, a.id])}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold ${on ? "bg-cacao text-blush" : "bg-white ring-1 ring-cacao/25"}`}>
                {on ? "✓ " : "+ "}{a.nombre} · {formatearPrecio(a.precio)}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="t-dia" className="mt-8">
        <h2 id="t-dia" className="text-lg font-bold">2. Elegí el día</h2>
        <div className="card-suave mt-3 p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => cambiarMes(-1)} disabled={esMesActual} aria-label="Mes anterior" className="h-11 w-11 rounded-full text-xl disabled:opacity-30">‹</button>
            <p className="font-serif text-2xl font-semibold">{MESES[mes.m]} {mes.y}</p>
            <button onClick={() => cambiarMes(1)} disabled={mesesAdelante >= 2} aria-label="Mes siguiente" className="h-11 w-11 rounded-full text-xl disabled:opacity-30">›</button>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold">
            {DIAS.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: primerDow }).map((_, i) => <span key={`v${i}`} />)}
            {Array.from({ length: cantDias }, (_, i) => i + 1).map((d) => {
              const clave = claveFecha(mes.y, mes.m, d);
              const libre = (dias?.[clave]?.length ?? 0) > 0;
              const sel = clave === fecha;
              return (
                <button key={d} disabled={!libre} onClick={() => { setFecha(clave); setHora(null); }}
                  aria-label={`${d} de ${MESES[mes.m]}${libre ? "" : ", sin turnos"}`}
                  className={`aspect-square min-h-11 rounded-full text-sm font-semibold ${sel ? "bg-cacao text-blush" : libre ? "bg-salvia" : "text-cacao/35"}`}>
                  {d}
                </button>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs"><span className="inline-block h-3 w-3 rounded-full bg-salvia" /> Con turnos libres</p>
          {dias === null && !error && <p className="mt-2 text-sm" role="status">Buscando horarios libres…</p>}
          {error && <p className="mt-2 text-sm font-semibold" role="alert">No pudimos cargar los horarios. Revisá tu conexión e intentá de nuevo.</p>}
        </div>
      </section>

      {fecha && (
        <section aria-labelledby="t-hora" className="mt-8">
          <h2 id="t-hora" className="text-lg font-bold">3. Elegí el horario <span className="font-medium">({fechaTexto})</span></h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {horas.map((h) => (
              <button key={h} aria-pressed={h === hora} onClick={() => setHora(h)}
                className={`min-h-12 rounded-full font-semibold ${h === hora ? "bg-cacao text-blush" : "bg-white ring-2 ring-salvia"}`}>
                {formatearHora(h)}
              </button>
            ))}
          </div>
        </section>
      )}

      {hora !== null && (
        <section aria-labelledby="t-datos" className="mt-8">
          <h2 id="t-datos" className="text-lg font-bold">4. Tus datos</h2>
          <label className="mt-3 block text-sm font-semibold">Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className="mt-1 block min-h-12 w-full rounded-2xl bg-white px-4 text-base ring-1 ring-cacao/25" />
          </label>
          <label className="mt-3 block text-sm font-semibold">Teléfono (WhatsApp)
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" autoComplete="tel" className="mt-1 block min-h-12 w-full rounded-2xl bg-white px-4 text-base ring-1 ring-cacao/25" />
          </label>
        </section>
      )}

      <div className="cta-fija !block !bg-hueso border-t border-cacao/10">
        <div className="mx-auto max-w-xl">
          <p className="mb-2 flex justify-between text-sm font-semibold">
            <span>{servicio.nombre}{hora !== null && fecha ? ` · ${fechaTexto} ${formatearHora(hora)}` : ""}</span>
            <span>Total {formatearPrecio(total)}</span>
          </p>
          <button disabled={!listo} className="btn-cta w-full disabled:opacity-50" onClick={() => alert(`Seña a pagar: ${formatearPrecio(SENA)}`)}>
            {listo ? `Continuar: seña de ${formatearPrecio(SENA)}` : "Completá los pasos para seguir"}
          </button>
        </div>
      </div>
    </main>
  );
}
