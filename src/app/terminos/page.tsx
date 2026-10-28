import { Legal, CONTACTO_IG, CONTACTO_TXT } from "@/components/Legal";

export const metadata = { title: "Términos y condiciones · LumiNails Studio" };

export default function Terminos() {
  return (
    <Legal titulo="Términos y condiciones" actualizado="octubre de 2026">
      <p>Al reservar un turno en LumiNails Studio aceptás estas condiciones.</p>

      <section>
        <h2>Servicios y precios</h2>
        <p>Ofrecemos Semipermanente, Kapping y Soft Gel, con los precios y duraciones que ves en la página. Los adicionales se suman al precio del servicio. El precio final se abona en el estudio.</p>
      </section>

      <section>
        <h2>Reserva y seña</h2>
        <ul>
          <li>Para confirmar el turno se abona una seña de $2.000, únicamente con Mercado Pago desde la aplicación.</li>
          <li>Al elegir un horario te lo guardamos 10 minutos. Si en ese tiempo no se acredita la seña, el horario se libera para otras personas.</li>
          <li>El turno queda confirmado recién cuando Mercado Pago nos avisa que la seña se acreditó.</li>
        </ul>
      </section>

      <section>
        <h2>Cancelaciones y devolución de la seña</h2>
        <p>Las condiciones para cancelar, reprogramar o recuperar la seña las define el estudio. Consultalas por Instagram, en <a href={CONTACTO_IG} target="_blank" rel="noopener noreferrer">{CONTACTO_TXT}</a>, antes de reservar.</p>
      </section>

      <section>
        <h2>Asistente MIA</h2>
        <p>MIA es una asistente con inteligencia artificial que consulta la agenda real. Puede equivocarse: el horario vale cuando lo ves en el calendario o cuando tu turno figura confirmado. MIA no cobra ni reserva por su cuenta.</p>
      </section>

      <section>
        <h2>Tus datos</h2>
        <p>Cómo cuidamos tus datos está explicado en la <a href="/privacidad">política de privacidad</a>.</p>
      </section>
    </Legal>
  );
}
