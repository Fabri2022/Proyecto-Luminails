import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { Formulario } from "./Formulario";

export const metadata: Metadata = { title: "Botón de arrepentimiento y cancelación · LumiNails Studio" };

export default function Page() {
  return (
    <Legal titulo="Arrepentimiento y cancelación" actualizado="octubre de 2026">
      <p>Desde acá podés cancelar tu turno o pedir el arrepentimiento y la devolución de la seña. No hace falta registrarte. Al terminar te damos un código de identificación y se lo mandás a Agustina por WhatsApp.</p>
      <div className="rounded-2xl bg-rosa-suave px-4 py-3 text-sm">
        <p><strong>Recordá:</strong> cancelando con 24 horas o más te devolvemos la seña. Si no asistís o no avisás, se pierde (hay 15 minutos de tolerancia). La devolución se hace por Mercado Pago dentro de las 12 horas de aceptado tu pedido.</p>
      </div>
      <Formulario />
    </Legal>
  );
}
