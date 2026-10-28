import { Legal, CONTACTO_IG, CONTACTO_TXT } from "@/components/Legal";

export const metadata = { title: "Política de privacidad · LumiNails Studio" };

export default function Privacidad() {
  return (
    <Legal titulo="Política de privacidad" actualizado="octubre de 2026">
      <p>LumiNails Studio es un emprendimiento de Nail Art de La Rioja, Argentina. Cuidamos tus datos y los usamos solo para darte tu turno. Esta política se rige por la Ley 25.326 de Protección de los Datos Personales.</p>

      <section>
        <h2>Qué datos pedimos</h2>
        <ul>
          <li>Tu nombre y tu teléfono (WhatsApp), para identificar tu turno y poder contactarte.</li>
          <li>El servicio, el día y el horario que elegís.</li>
          <li>El estado de tu pago (si la seña se acreditó o no).</li>
        </ul>
        <p className="mt-2">No guardamos los datos de tu tarjeta ni de tu cuenta: el pago lo procesa Mercado Pago.</p>
      </section>

      <section>
        <h2>Para qué los usamos</h2>
        <p>Solo para reservar y confirmar tu turno, avisarte sobre él y llevar la agenda del estudio. No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>
      </section>

      <section>
        <h2>Quiénes intervienen</h2>
        <ul>
          <li>Mercado Pago: procesa el pago de la seña.</li>
          <li>Supabase y Vercel: guardan los datos de la agenda y alojan la aplicación.</li>
          <li>Google (Gemini): MIA, nuestra asistente, usa inteligencia artificial. Lo que escribas en el chat se envía a Google para generar la respuesta. Por eso, no escribas en el chat datos personales como teléfono, DNI o datos de tarjeta; para reservar, usá los campos de nombre y teléfono.</li>
        </ul>
      </section>

      <section>
        <h2>Cuánto tiempo los guardamos</h2>
        <p>El tiempo necesario para atenderte y llevar la agenda del estudio. Los horarios reservados que no se pagan se liberan solos a los 10 minutos.</p>
      </section>

      <section>
        <h2>Tus derechos</h2>
        <p>Podés pedirnos acceder a tus datos, corregirlos o que los borremos. Escribinos por Instagram a <a href={CONTACTO_IG} target="_blank" rel="noopener noreferrer">{CONTACTO_TXT}</a>. La Agencia de Acceso a la Información Pública es el órgano de control de la Ley 25.326 y atiende denuncias y reclamos por incumplimientos.</p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>Usamos solamente almacenamiento técnico del navegador para que el sitio funcione y para recordar que viste el aviso de cookies. No usamos cookies de publicidad ni de seguimiento. Mercado Pago puede usar sus propias cookies cuando abrís su página de pago.</p>
      </section>
    </Legal>
  );
}
