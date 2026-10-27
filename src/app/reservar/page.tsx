import Link from "next/link";
import Image from "next/image";

// Pantalla provisoria: el calendario real se construye el miércoles.
export const metadata = { title: "Reservá tu turno · LumiNails Studio" };

export default function Reservar() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src="/logo/LumiNails_simbolo.svg" alt="" width={96} height={96} />
      <h1 className="font-serif text-4xl font-semibold">Estamos preparando tu calendario</h1>
      <p className="max-w-sm text-lg">
        Muy pronto vas a poder elegir servicio, día y horario acá mismo.
      </p>
      <Link href="/" className="underline underline-offset-4">
        Volver al inicio
      </Link>
    </main>
  );
}
