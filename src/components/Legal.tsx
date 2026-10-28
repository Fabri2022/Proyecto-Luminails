import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export const CONTACTO_IG = "https://www.instagram.com/luminails._studio";
export const CONTACTO_TXT = "@luminails._studio";
export const WHATSAPP_NUM = "5493804867622";
export const WHATSAPP_TXT = "+54 9 3804 86-7622";
export const urlWhatsApp = (texto: string) => `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(texto)}`;

export function Legal({ titulo, actualizado, children }: { titulo: string; actualizado: string; children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-32 pt-6">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Volver al inicio">
          <Image src="/logo/LumiNails_horizontal.svg" alt="LumiNails Studio" width={420} height={86} className="h-9 w-auto" priority />
        </Link>
        <Link href="/" className="text-sm font-semibold underline underline-offset-4">Volver</Link>
      </header>
      <h1 className="mt-6 font-serif text-4xl font-semibold">{titulo}</h1>
      <p className="mt-1 text-sm">Última actualización: {actualizado}</p>
      <div className="mt-6 space-y-6 leading-relaxed [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </main>
  );
}
