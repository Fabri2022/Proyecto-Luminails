import Link from "next/link";

// Único botón principal de toda la página: siempre el mismo texto y el mismo destino.
export const CTA_TEXTO = "Reservá tu turno";
export const CTA_HREF = "/reservar";

export function Cta({ className = "" }: { className?: string }) {
  return (
    <Link href={CTA_HREF} className={`btn-cta ${className}`}>
      {CTA_TEXTO}
    </Link>
  );
}
