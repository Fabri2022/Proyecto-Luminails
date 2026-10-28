import Link from "next/link";

// Aviso importante sobre asistencia y seña. Se muestra antes de pagar y al confirmar el turno.
export function AvisoAsistencia({ compacto = false }: { compacto?: boolean }) {
  return (
    <div role="note" className="rounded-2xl border-2 border-cacao bg-rosa-suave px-4 py-3 text-left text-sm leading-relaxed">
      <p className="font-bold">⚠️ Importante sobre tu seña</p>
      <p className="mt-1">
        Si no asistís o no avisás, <strong>la seña de $2.000 se pierde</strong>. Hay <strong>15 minutos de tolerancia</strong>.
        {!compacto && <> Cancelando con <strong>24 horas o más</strong> te la devolvemos o la pasamos a otro turno.</>}
        {" "}<Link href="/terminos" target="_blank" className="font-semibold underline underline-offset-2">Ver condiciones</Link>
      </p>
    </div>
  );
}
