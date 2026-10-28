"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";
function suscribir(cb: () => void) {
  const m = window.matchMedia(CONSULTA); m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

// Carrusel infinito: gira solo y sin frenarse, y se arrastra con el dedo o el mouse.
export type ItemCarrusel = { id: string; contenido: ReactNode; claseTarjeta?: string };

export function CarruselInfinito({ items, etiqueta }: { items: ItemCarrusel[]; etiqueta: string }) {
  const vp = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const reducir = useSyncExternalStore(suscribir, () => window.matchMedia(CONSULTA).matches, () => false);
    const movRef = useRef({ lento: false, mover: (() => {}) as (d: number) => void });
  useEffect(() => { movRef.current.lento = reducir; }, [reducir]);
  const n = items.length;

  useEffect(() => {
    const vpe = vp.current!, tr = track.current!;
    const cards = Array.from(tr.children) as HTMLElement[];
    const VEL = 55; // px por segundo
    let offset = 0, v = 0, dragging = false, visible = true;
    let tween: { from: number; to: number; t0: number; dur: number } | null = null;
    let lastX = 0, lastT = 0, last = performance.now(), raf = 0;
    const x = (i: number) => cards[i].getBoundingClientRect().left;
    const w = () => x(n) - x(0);
    const paso = () => x(1) - x(0);
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
          if (visible && !document.hidden) offset += (movRef.current.lento ? VEL * 0.55 : VEL) * dt; // gira siempre, sin frenarse al scrollear, pasar el mouse ni soltar
        }
      }
      envolver();
      // Se ajusta a píxeles reales de la pantalla para que las fotos no tiemblen.
      const dpr = window.devicePixelRatio || 1;
      tr.style.transform = `translate3d(${Math.round(-(w() + offset) * dpr) / dpr}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    movRef.current.mover = (d: number) => { v = 0; tween = { from: offset, to: offset + d * paso(), t0: performance.now(), dur: 450 }; };
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
      v = Math.max(-2500, Math.min(2500, v));
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { movRef.current.mover(1); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { movRef.current.mover(-1); e.preventDefault(); }
    };
    const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.1 });
    io.observe(vpe);
    vpe.addEventListener("pointerdown", down); vpe.addEventListener("pointermove", move);
    vpe.addEventListener("pointerup", soltar); vpe.addEventListener("pointercancel", soltar);
    vpe.addEventListener("keydown", key);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      vpe.removeEventListener("pointerdown", down); vpe.removeEventListener("pointermove", move);
      vpe.removeEventListener("pointerup", soltar); vpe.removeEventListener("pointercancel", soltar);
      vpe.removeEventListener("keydown", key);
    };
  }, [n]);

    const copias = [0, 1, 2];

  return (
    <div role="region" aria-roledescription="carrusel" aria-label={etiqueta}>
      <div ref={vp} tabIndex={0} aria-label={`${etiqueta}. Arrastrá hacia los costados o usá las flechas del teclado.`}
        className="carrusel-vp mt-6 cursor-grab select-none overflow-hidden pt-1.5 pb-6 [touch-action:pan-y] [&.arrastrando]:cursor-grabbing">
        <ul ref={track} className="flex gap-4 will-change-transform md:gap-5">
          {copias.flatMap((c) => items.map((t, i) => (
            <li key={`${c}-${t.id}`} {...(c === 0 ? { role: "group", "aria-roledescription": "tarjeta", "aria-label": `${i + 1} de ${n}` } : { "aria-hidden": true })}
              className={`card-suave flex min-w-0 flex-[0_0_78%] flex-col overflow-hidden min-[620px]:flex-[0_0_calc((100%-1rem)/2)] md:flex-[0_0_calc((100%-2.5rem)/3)] ${t.claseTarjeta ?? ""}`}>
              {t.contenido}
            </li>
          )))}
        </ul>
      </div>
    </div>
  );
}
