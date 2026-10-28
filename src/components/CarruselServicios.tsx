"use client";

import Image from "next/image";
import { CarruselInfinito } from "@/components/CarruselInfinito";

export type TarjetaCarrusel = {
  id: string;
  nombre: string;
  descripcion: string;
  foto: string;
  fotoAlt: string;
  precio: string;
  detalle: string;
};

export function CarruselServicios({ tarjetas }: { tarjetas: TarjetaCarrusel[] }) {
  return (
    <CarruselInfinito etiqueta="Servicios de LumiNails Studio" items={tarjetas.map((t) => ({
      id: t.id,
      contenido: (
        <>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-rosa-suave">
            <Image src={t.foto} alt={t.fotoAlt} fill sizes="(min-width: 768px) 33vw, 78vw" draggable={false}
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
        </>
      ),
    }))} />
  );
}
