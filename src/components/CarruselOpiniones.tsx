"use client";

import { CarruselInfinito } from "@/components/CarruselInfinito";
import type { Testimonio } from "@/data/testimonios";

function Estrellas({ n }: { n: number }) {
  return (
    <p className="text-xl leading-none tracking-widest text-oro" role="img" aria-label={`${n} de 5 estrellas`}>
      {"★".repeat(n)}<span className="opacity-25">{"★".repeat(5 - n)}</span>
    </p>
  );
}

export function CarruselOpiniones({ opiniones }: { opiniones: Testimonio[] }) {
  return (
    <CarruselInfinito etiqueta="Opiniones de clientas" items={opiniones.map((t) => ({
      id: t.nombre,
      contenido: (
        <div className="flex flex-1 flex-col p-6">
          {t.ejemplo && (
            <span className="mb-3 inline-block w-fit rounded-full bg-rosa-suave px-3 py-1 text-xs font-bold uppercase tracking-wider">Ejemplo</span>
          )}
          <Estrellas n={t.estrellas} />
          <p className="mt-3 leading-relaxed">“{t.texto}”</p>
          <p className="mt-auto pt-4 text-sm font-bold">
            {t.nombre}{t.servicio && <span className="font-medium"> · {t.servicio}</span>}
          </p>
        </div>
      ),
    }))} />
  );
}
