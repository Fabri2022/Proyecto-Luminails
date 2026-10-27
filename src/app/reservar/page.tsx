import { Suspense } from "react";
import Reserva from "./Reserva";

export const metadata = { title: "Reservá tu turno · LumiNails Studio" };

export default function Reservar() {
  return (
    <Suspense fallback={<p className="p-6" role="status">Cargando…</p>}>
      <Reserva />
    </Suspense>
  );
}
