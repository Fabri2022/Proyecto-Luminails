"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const CLAVE = "luminails-aviso-cookies";
const oyentes = new Set<() => void>();
const visto = () => { try { return localStorage.getItem(CLAVE) === "1"; } catch { return false; } };
const suscribir = (f: () => void) => { oyentes.add(f); return () => { oyentes.delete(f); }; };

// Aviso informativo: el sitio solo usa almacenamiento técnico (sin cookies de publicidad ni seguimiento).
export function AvisoCookies() {
  const yaVisto = useSyncExternalStore(suscribir, visto, () => true);
  if (yaVisto) return null;
  return (
    <div role="region" aria-label="Aviso de cookies" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl bg-cacao p-4 text-sm text-hueso shadow-2xl">
      <p>Usamos solo almacenamiento técnico para que el sitio funcione. No usamos cookies de publicidad ni de seguimiento. Más info en la <Link href="/privacidad" className="font-semibold underline">política de privacidad</Link>.</p>
      <button type="button" className="mt-3 min-h-11 rounded-full bg-blush px-6 font-bold text-cacao"
        onClick={() => { try { localStorage.setItem(CLAVE, "1"); } catch { /* sin almacenamiento */ } oyentes.forEach((f) => f()); }}>
        Entendido
      </button>
    </div>
  );
}
