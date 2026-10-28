import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { Formulario } from "./Formulario";

export const metadata: Metadata = { title: "Dejá tu opinión · LumiNails Studio" };

export default function Page() {
  return (
    <Legal titulo="Dejá tu opinión" actualizado="octubre de 2026">
      <p>Contanos cómo te fue. Elegí tus estrellas, escribí tu opinión y mandásela a Agustina por WhatsApp. Ella la revisa y la publica en la página.</p>
      <Formulario />
    </Legal>
  );
}
