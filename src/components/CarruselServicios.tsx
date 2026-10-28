"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type TarjetaCarrusel = {
  id: string;
  nombre: string;
  descripcion: string;
  foto: string;
  fotoAlt: string;
  precio: string;
  detalle: string;
};

const CONSULTA = "(prefers-reduced-motion: reduce)";
function suscribir(cb: () => void) {
  const m = window.matchMedia(CONSULTA); m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

// Carrusel infinito: gira solo, se arrastra con el dedo o el mouse y se detiene al tocarlo.
export function CarruselServicios({ tarjetas }: { tarjetas: TarjetaCarrusel[] }) {
  const vp = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [pausada, setPausada] = useState(false);
  const reducir = useSyncExternalStore(suscribir, () => window.matchMedia(CONSULTA).matches, () => false);
  const andando = !pausada && !reducir;
  const movRef = useRef({ playing: true, mover: (() => {}) as (d: number) => void });
  useEffect(() => { movRef.current.playing = andando; }, [andando]);
  const n = tarjetas.length;

  useEffect(() => {
    const vpe = vp.current!, tr = track.current!;
    const cards = Array.from(tr.children) as HTMLElement[];
    const VEL = 45;
    let offset = 0, v = 0, dragging = false, hover = false, visible = true, hold = 0;
    let tween: { from: number; to: number; t0: number; dur: number } | null = null;
    let lastX = 0, lastT = 0, last = performance.now(), raf = 0;
    const w = () => cards[n].offsetLeft - cards[0].offsetLeft;
    const paso = () => cards[1].offsetLeft - cards[0].offsetLeft;
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    const envolver = () => {
      const W = w(); if (W <= 0) return;
      const nuevo = ((offset % W) + W) % W, d = nuevo - offset;
      if (d) { offset = nuevo; if (tween) { tween.from += d; tween.to += d; } }
    };
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!dragging) {
        if (tween) {
          const p = Math.min(1, (t - tween.t0) / tween.dur);
          offset = tween.from + (tween.to - tween.from) * ease(p);
          if (p >= 1) tween = null;
        } else {
          if (Math.abs(v) > 2) { offset += v * dt; v *= Math.pow(0.04, dt); } else v = 0;
          if (movRef.current.playing && !hover && visible && t > hold && !document.hidden) offset += VEL * dt;
        }
      }
      envolver();
      tr.style.transform = `translate3d(${-(w() + offset)}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    movRef.current.mover = (d: number) => { v = 0; tween = { from: offset, to: offset + d * paso(), t0: performance.now(), dur: 450 }; hold = performance.now() + 2500; };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true; tween = null; v = 0; lastX = e.clientX; lastT = performance.now();
      vpe.classList.add("arrastrando");
      try { vpe.setPointerCapture(e.pointerId); } catch {}
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const ahora = performance.now(), dx = e.clientX - lastX, dtm = Math.max(0.008, (ahora - lastT) / 1000);
      offset -= dx; v = 0.7 * v + 0.3 * (-dx / dtm); lastX = e.clientX; lastT = ahora;
    };
    const soltar = () => {
      if (!dragging) return; dragging = false; vpe.classList.remove("arrastrando");
      v = Math.max(-2500, Math.min(2500, v)); hold = performance.now() + 2000;
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { movRef.current.mover(1); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { movRef.current.mover(-1); e.preventDefault(); }
    };
    const enter = () => { hover = true; }, leave = () => { hover = false; };
    const focusin = () => { hold = performance.now() + 3000; };
    const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.1 });
    io.observe(vpe);
    vpe.addEventListener("pointerdown", down); vpe.addEventListener("pointermove", move);
    vpe.addEventListener("pointerup", soltar); vpe.addEventListener("pointercancel", soltar);
    vpe.addEventListener("keydown", key); vpe.addEventListener("mouseenter", enter);
    vpe.addEventListener("mouseleave", leave); vpe.addEventListener("focusin", focusin);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      vpe.removeEventListener("pointerdown", down); vpe.removeEventListener("pointermove", move);
      vpe.removeEventListener("pointerup", soltar); vpe.removeEventListener("pointercancel", soltar);
      vpe.removeEventListener("keydown", key); vpe.removeEventListener("mouseenter", enter);
      vpe.removeEventListener("mouseleave", leave); vpe.removeEventListener("focusin", focusin);
    };
  }, [n]);

  const alternar = () => setPausada((p) => !p);
  const copias = [0, 1, 2];

  return (
    <div role="region" aria-roledescription="carrusel" aria-label="Servicios de LumiNails Studio">
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={alternar} aria-pressed={!andando}
          className="min-h-11 rounded-full border-[1.5px] border-cacao/20 px-4 text-sm font-semibold hover:bg-rosa-suave">
          {andando ? "Pausar movimiento" : "Reanudar movimiento"}
        </button>
        <button type="button" aria-label="Ver tarjetas anteriores" onClick={() => movRef.current.mover(-1)}
          className="grid size-11 place-items-center rounded-full border-[1.5px] border-cacao/20 bg-white hover:bg-rosa-suave">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" aria-label="Ver más tarjetas" onClick={() => movRef.current.mover(1)}
          className="grid size-11 place-items-center rounded-full border-[1.5px] border-cacao/20 bg-white hover:bg-rosa-suave">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div ref={vp} tabIndex={0} aria-label="Servicios. Arrastrá hacia los costados o usá las flechas del teclado."
        className="carrusel-vp mt-4 cursor-grab select-none overflow-hidden pt-1.5 pb-6 [touch-action:pan-y] [&.arrastrando]:cursor-grabbing">
        <ul ref={track} className="flex gap-4 will-change-transform md:gap-5">
          {copias.flatMap((c) => tarjetas.map((t, i) => (
            <li key={`${c}-${t.id}`} {...(c === 0 ? { role: "group", "aria-roledescription": "tarjeta", "aria-label": `${i + 1} de ${n}` } : { "aria-hidden": true })}
              className="card-suave flex min-w-0 flex-[0_0_78%] flex-col overflow-hidden min-[620px]:flex-[0_0_calc((100%-1rem)/2)] md:flex-[0_0_calc((100%-2.5rem)/3)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-rosa-suave">
                <Image src={t.foto} alt={c === 0 ? t.fotoAlt : ""} fill sizes="(min-width: 768px) 33vw, 78vw" draggable={false}
                  className="pointer-events-none object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold">{t.nombre}</h3>
                <p className="mt-1 leading-relaxed">{t.descripcion}</p>
                <p className="mt-auto flex items-baseline justify-between gap-3 pt-4">
                  <span className="font-serif text-3xl font-semibold">{t.precio}</span>
                  <span className="text-sm font-medium">{t.detalle}</span>
                </p>
              </div>
            </li>
          )))}
        </ul>
      </div>
    </div>
  );
}
