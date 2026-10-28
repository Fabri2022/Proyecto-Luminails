"use client";

import { useState } from "react";
import { urlWhatsApp, WHATSAPP_TXT } from "@/components/Legal";

const campo = "mt-1 block min-h-12 w-full rounded-2xl bg-white px-4 text-base ring-1 ring-cacao/25";

export function Formulario() {
  const [nombre, setNombre] = useState("");
  const [servicio, setServicio] = useState("");
  const [estrellas, setEstrellas] = useState(0);
  const [texto, setTexto] = useState("");
  const [mayor, setMayor] = useState(false);
  const [autoriza, setAutoriza] = useState(false);
  const [listoEnviar, setListoEnviar] = useState(false);

  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  const ok = palabras.length >= 2 && estrellas > 0 && texto.trim().length >= 10 && mayor && autoriza;
  const mensaje = [
    "Hola Agustina, te dejo mi opinión de LumiNails Studio:",
    `${"★".repeat(estrellas)}${"☆".repeat(5 - estrellas)} (${estrellas} de 5)`,
    `“${texto.trim()}”`,
    `Nombre: ${nombre.trim()}`,
    servicio.trim() ? `Servicio: ${servicio.trim()}` : "",
    "Soy mayor de 18 años y autorizo que publiquen mi opinión en la página y en sus redes.",
  ].filter(Boolean).join("\n");

  if (listoEnviar) {
    return (
      <div className="card-suave mt-6 p-6 text-center">
        <p className="font-serif text-2xl font-semibold">¡Gracias por tu opinión!</p>
        <p className="mt-2 text-sm">Tocá el botón para mandársela a Agustina por WhatsApp. Ella la revisa y la publica en la página.</p>
        <a href={urlWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cacao px-6 font-bold text-blush">
          Enviar por WhatsApp
        </a>
        <button type="button" onClick={() => setListoEnviar(false)} className="mt-4 text-sm font-semibold underline">Volver a editar</button>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); if (ok) setListoEnviar(true); }}>
      <fieldset>
        <legend className="font-semibold">¿Cuántas estrellas le das?</legend>
        <div className="mt-1 flex gap-1" role="radiogroup" aria-label="Estrellas del 1 al 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={estrellas === n} aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
              onClick={() => setEstrellas(n)}
              className={`flex size-12 items-center justify-center text-4xl leading-none ${n <= estrellas ? "text-oro" : "text-cacao/25"}`}>
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block font-semibold">Nombre y apellido
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className={campo} />
        <span className="mt-1 block text-sm font-normal">En la página figurás con tu nombre y la inicial del apellido.</span>
      </label>
      <label className="block font-semibold">Servicio que te hiciste (opcional)
        <input value={servicio} onChange={(e) => setServicio(e.target.value)} placeholder="Semipermanente, Kapping, Soft Gel…" className={campo} />
      </label>
      <label className="block font-semibold">Tu opinión
        <textarea value={texto} onChange={(e) => setTexto(e.target.value.slice(0, 400))} rows={5} className={`${campo} py-3`} />
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" checked={mayor} onChange={(e) => setMayor(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[#4a2e35]" />
        <span>Declaro que soy <strong>mayor de 18 años</strong>.</span>
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" checked={autoriza} onChange={(e) => setAutoriza(e.target.checked)} className="mt-0.5 size-6 shrink-0 accent-[#4a2e35]" />
        <span>Autorizo a LumiNails Studio a publicar mi opinión y mi nombre en la página y en sus redes.</span>
      </label>
      <button type="submit" disabled={!ok} className="min-h-12 w-full rounded-full bg-cacao px-6 font-bold text-blush disabled:opacity-40">
        Preparar mi opinión
      </button>
      {!ok && <p className="text-sm">Completá estrellas, nombre y apellido, tu opinión y tildá las dos casillas.</p>}
      <p className="text-sm">Se envía por WhatsApp a Agustina ({WHATSAPP_TXT}) y se publica después de que ella la revisa.</p>
    </form>
  );
}
