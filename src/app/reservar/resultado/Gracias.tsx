"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SEGUNDOS = 35;

// Cuenta regresiva amable: después de unos segundos vuelve solo a la página principal.
export function Gracias() {
  const router = useRouter();
  const [resta, setResta] = useState(SEGUNDOS);

  useEffect(() => {
    const t = setInterval(() => setResta((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (resta <= 0) router.replace("/"); }, [resta, router]);

  return (
    <div className="mt-8">
      <div className="h-2 overflow-hidden rounded-full bg-rosa-suave" role="progressbar" aria-label="Volviendo al inicio" aria-valuemin={0} aria-valuemax={SEGUNDOS} aria-valuenow={SEGUNDOS - Math.max(resta, 0)}>
        <div className="h-full rounded-full bg-cacao transition-[width] duration-1000 ease-linear" style={{ width: `${((SEGUNDOS - resta) / SEGUNDOS) * 100}%` }} />
      </div>
      <p className="mt-3 text-sm">Volvemos al inicio en {Math.max(resta, 0)} segundos…</p>
      <Link href="/" className="btn-cta mt-4 inline-flex w-full justify-center">Volver al inicio ahora</Link>
    </div>
  );
}
