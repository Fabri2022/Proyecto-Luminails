"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CLAVE = "luminails-instalar-cerrado";
type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const cerrado = () => { try { return localStorage.getItem(CLAVE) === "1"; } catch { return false; } };
const recordarCierre = () => { try { localStorage.setItem(CLAVE, "1"); } catch { /* sin almacenamiento */ } };

// Cartel para instalar la app: aparece una sola vez. Si lo cierran (o la instalan), no vuelve.
// Chrome/Android/PC: botón "Instalar". iPhone (Safari) no permite instalar con un botón: mostramos cómo hacerlo.
export function InstalarApp() {
  const [modo, setModo] = useState<null | "instalar" | "ios">(null);
  const evento = useRef<EventoInstalar | null>(null);

  useEffect(() => {
    const instalada = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (instalada || cerrado()) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const mostrar = (m: "instalar" | "ios") => { clearTimeout(timer); timer = setTimeout(() => setModo(m), 3500); };

    const ua = navigator.userAgent;
    const esIos = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && navigator.maxTouchPoints > 1);
    if (esIos) mostrar("ios");

    const alOfrecer = (e: Event) => { e.preventDefault(); evento.current = e as EventoInstalar; mostrar("instalar"); };
    // El navegador puede avisar antes de que la página termine de cargar: lo guardó un script temprano del layout.
    const temprano = (window as unknown as { __bip?: Event }).__bip;
    if (temprano) alOfrecer(temprano);
    const alInstalar = () => { clearTimeout(timer); recordarCierre(); setModo(null); };
    window.addEventListener("beforeinstallprompt", alOfrecer);
    window.addEventListener("appinstalled", alInstalar);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", alOfrecer);
      window.removeEventListener("appinstalled", alInstalar);
    };
  }, []);

  if (!modo) return null;
  const cerrar = () => { recordarCierre(); setModo(null); };
  async function instalar() {
    const e = evento.current;
    if (!e) return;
    await e.prompt();
    await e.userChoice.catch(() => null);
    evento.current = null;
    cerrar();
  }

  return (
    <div role="region" aria-label="Instalar la app"
      className="fixed inset-x-3 top-3 z-[55] mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-cacao p-3.5 text-hueso shadow-2xl">
      <Image src="/icon-192.png" alt="" width={48} height={48} className="size-12 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 leading-snug">
        <p className="font-bold">Instalá LumiNails</p>
        <p className="text-sm">{modo === "ios" ? "Tocá Compartir y después “Agregar a pantalla de inicio”." : "Reservá más rápido desde tu pantalla de inicio."}</p>
      </div>
      {modo === "instalar" && (
        <button type="button" onClick={instalar} className="min-h-11 shrink-0 rounded-full bg-rosa-petalo px-5 font-bold text-cacao">Instalar</button>
      )}
      <button type="button" onClick={cerrar} aria-label="Cerrar" className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-white/10">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current stroke-[2.2]" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  );
}
