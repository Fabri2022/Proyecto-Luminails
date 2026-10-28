"use client";

import { useState } from "react";
import { CONTACTO_IG, CONTACTO_TXT, WHATSAPP_TXT, urlWhatsApp } from "@/components/Legal";

const TIPOS = [
  { id: "cancelar", texto: "Cancelar mi turno", frase: "cancelar mi turno" },
  { id: "arrepentimiento", texto: "Arrepentimiento y devolución de la seña", frase: "ejercer el arrepentimiento y que me devuelvan la seña" },
] as const;

// Código de identificación del pedido (se muestra al instante y viaja en el mensaje).
function generarCodigo() {
  const f = new Date();
  const dia = `${String(f.getFullYear()).slice(2)}${String(f.getMonth() + 1).padStart(2, "0")}${String(f.getDate()).padStart(2, "0")}`;
  const azar = Array.from(crypto.getRandomValues(new Uint8Array(4)), (n) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[n % 32]).join("");
  return `LN-${dia}-${azar}`;
}

const campo = "mt-1 block min-h-12 w-full rounded-2xl bg-white px-4 text-base ring-1 ring-cacao/25";

export function Formulario() {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]["id"]>("cancelar");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nota, setNota] = useState("");
  const [codigo, setCodigo] = useState("");

  const ok = nombre.trim().length >= 2 && telefono.replace(/\D/g, "").length >= 8;
  const frase = TIPOS.find((t) => t.id === tipo)!.frase;
  const mensaje = [
    `Hola Agustina, soy ${nombre.trim()}. Quiero ${frase}.`,
    fecha ? `Turno: ${fecha.split("-").reverse().join("/")}${hora ? ` a las ${hora} hs` : ""}.` : "",
    `Mi teléfono: ${telefono.trim()}.`,
    nota.trim() ? `Comentario: ${nota.trim()}` : "",
    `Código de pedido: ${codigo}`,
  ].filter(Boolean).join("\n");

  if (codigo) {
    return (
      <div className="card-suave mt-6 p-6 text-center">
        <p className="font-serif text-2xl font-semibold">Tu pedido está listo para enviar</p>
        <p className="mt-2">Código de identificación:</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-wider">{codigo}</p>
        <p className="mt-3 text-sm">Tocá el botón para mandarle el mensaje a Agustina por WhatsApp. El pedido se registra cuando lo enviás. Te responde y, si corresponde, te devuelve la seña dentro de las 12 horas.</p>
        <a href={urlWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-cacao px-6 font-bold text-blush">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.200c.1.200.1.400 0 .600l-.4.600c-.1.200-.3.400-.1.700.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.400 2.400 1.500.3.100.5.100.6-.1l.9-1.100c.2-.3.4-.2.700-.1l2 1c.3.100.5.200.5.300.1.200.1.800-.2 1.500Z" /></svg>
          Enviar por WhatsApp
        </a>
        <p className="mt-4 text-sm">¿Preferís Instagram? Escribile a <a href={CONTACTO_IG} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{CONTACTO_TXT}</a> y pasale el código.</p>
        <button type="button" onClick={() => setCodigo("")} className="mt-4 text-sm font-semibold underline">Volver a editar</button>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); if (ok) setCodigo(generarCodigo()); }}>
      <fieldset>
        <legend className="font-semibold">¿Qué querés hacer?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {TIPOS.map((t) => (
            <label key={t.id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-4 py-2 ring-1 ${tipo === t.id ? "bg-white ring-2 ring-cacao" : "bg-white/60 ring-cacao/25"}`}>
              <input type="radio" name="tipo" checked={tipo === t.id} onChange={() => setTipo(t.id)} className="size-5 accent-[#4a2e35]" />
              <span>{t.texto}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block font-semibold">Tu nombre
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className={campo} />
      </label>
      <label className="block font-semibold">Tu teléfono
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" autoComplete="tel" className={campo} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block font-semibold">Día del turno
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={campo} />
        </label>
        <label className="block font-semibold">Hora
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={campo} />
        </label>
      </div>
      <label className="block font-semibold">Comentario (opcional)
        <textarea value={nota} onChange={(e) => setNota(e.target.value.slice(0, 300))} rows={3} className={`${campo} py-3`} />
      </label>
      <button type="submit" disabled={!ok} className="min-h-12 w-full rounded-full bg-cacao px-6 font-bold text-blush disabled:opacity-40">
        Generar mi pedido
      </button>
      <p className="text-sm">También podés escribirle directo a Agustina por WhatsApp al <a href={urlWhatsApp("Hola Agustina, quiero cancelar mi turno.")} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{WHATSAPP_TXT}</a>.</p>
    </form>
  );
}
