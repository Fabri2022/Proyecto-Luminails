import Link from "next/link";
import { Legal, CONTACTO_IG, CONTACTO_TXT, WHATSAPP_TXT, urlWhatsApp } from "@/components/Legal";

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
        <ul>
          <li><strong>Cancelás con 24 horas o más de anticipación:</strong> te devolvemos la seña completa o la pasamos a otro turno sin costo, como prefieras.</li>
          <li><strong>Cancelás con menos de 24 horas:</strong> la seña no se devuelve, pero queda como crédito para reprogramar una sola vez.</li>
          <li><strong>No asistís sin avisar:</strong> se pierde la seña. Hay una tolerancia de 15 minutos; pasado ese tiempo, el turno se da por perdido y también la seña. Si tuviste un inconveniente importante y avisás, lo evaluamos.</li>
          <li><strong>Si cancela el estudio:</strong> te devolvemos la seña completa o reprogramamos, como elijas.</li>
          <li><strong>Pago duplicado o con error:</strong> se devuelve la seña completa.</li>
          <li><strong>Cómo se devuelve:</strong> por Mercado Pago, al mismo medio con el que pagaste, dentro de las 12 horas de recibido y aceptado tu pedido.</li>
          <li><strong>Cómo pedirlo:</strong> por WhatsApp al <a href={urlWhatsApp("Hola Agustina, quiero cancelar mi turno.")} target="_blank" rel="noopener noreferrer">{WHATSAPP_TXT}</a>, desde el <Link href="/arrepentimiento">formulario de arrepentimiento y cancelación</Link> o por Instagram en <a href={CONTACTO_IG} target="_blank" rel="noopener noreferrer">{CONTACTO_TXT}</a>. Indicá tu nombre y la fecha del turno.</li>
        </ul>
      </section>

      <section>
        <h2>Botón de arrepentimiento</h2>
        <p>Si contrataste por esta aplicación y querés arrepentirte, podés pedirlo en cualquier momento desde el enlace <Link href="/arrepentimiento">Botón de arrepentimiento</Link> del pie de la página, sin registrarte. Al enviarlo recibís un código de identificación y te contestamos por WhatsApp. Esto se aplica según la Ley 24.240 de Defensa del Consumidor y la Resolución 424/2020.</p>
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
