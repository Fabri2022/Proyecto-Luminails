import Image from "next/image";
import { Cta } from "@/components/Cta";
import {
  SERVICIOS,
  SENA,
  formatearDuracion,
  formatearPrecio,
} from "@/data/servicios";
import { TESTIMONIOS } from "@/data/testimonios";

function Destello({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0Q12.9 11.1 24 12Q12.9 12.9 12 24Q11.1 12.9 0 12Q11.1 11.1 12 0Z" />
    </svg>
  );
}

function Encabezado() {
  return (
    <header className="sticky top-0 z-20 border-b border-rosa-suave/70 bg-blush/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
        <a href="#inicio" aria-label="LumiNails Studio, ir al inicio">
          <Image
            src="/logo/LumiNails_horizontal.svg"
            alt="LumiNails Studio"
            width={420}
            height={86}
            className="h-9 w-auto sm:h-11"
            priority
          />
        </a>
        <span className="hidden md:inline-flex"><Cta className="sm" /></span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="mx-auto max-w-5xl px-5 pb-14 pt-10 md:grid md:grid-cols-2 md:items-center md:gap-10 md:pb-20 md:pt-16">
      <div>
        <p className="inline-block rounded-full bg-rosa-suave px-4 py-1.5 text-sm font-semibold">
          Nail art · La Rioja
        </p>
        <h1 className="mt-5 font-serif text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl">
          Reservá tu turno de uñas en un minuto
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed">
          Elegí tu servicio, mirá los horarios libres de verdad y confirmá con una
          seña de {formatearPrecio(SENA)}. Sin escribir por WhatsApp.
        </p>
        <div className="mt-8">
          <Cta />
        </div>
        <p className="mt-4 text-sm font-medium">
          Semipermanente · Kapping · Soft Gel — los horarios se ocupan rápido.
        </p>
      </div>
      <div className="relative mx-auto mt-12 flex aspect-square w-72 items-center justify-center rounded-full bg-rosa-suave md:mt-0 md:w-full md:max-w-sm" aria-hidden="true">
        <Image src="/logo/LumiNails_simbolo.svg" alt="" width={256} height={256} className="w-3/4" />
        <Destello className="absolute right-2 top-10 h-7 w-7 text-oro" />
        <Destello className="absolute bottom-12 left-1 h-5 w-5 text-oro" />
      </div>
    </section>
  );
}

const BENEFICIOS = [
  {
    titulo: "Horarios reales",
    texto: "Ves al instante qué días y horas están libres. Sin preguntar ni esperar respuesta.",
  },
  {
    titulo: "Tu lugar asegurado",
    texto: `Con una seña de ${formatearPrecio(SENA)} por Mercado Pago, tu turno queda confirmado.`,
  },
  {
    titulo: "MIA te ayuda",
    texto: "Nuestra asistente responde precios, duración y horarios cuando lo necesitás.",
  },
];

function Beneficios() {
  return (
    <section className="bg-white/60 py-14">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Pensado para que reserves fácil</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {BENEFICIOS.map((b) => (
            <li key={b.titulo} className="card-suave p-6">
              <Destello className="h-5 w-5 text-oro" />
              <h3 className="mt-3 text-lg font-bold">{b.titulo}</h3>
              <p className="mt-2 leading-relaxed">{b.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Servicios() {
  return (
    <section id="servicios" className="mx-auto max-w-5xl px-5 py-14">
      <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Nuestros servicios</h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {SERVICIOS.map((s) => (
          <li key={s.id} className="card-suave overflow-hidden">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={s.foto}
                alt={s.fotoAlt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold">{s.nombre}</h3>
              <p className="mt-1 leading-relaxed">{s.descripcion}</p>
              <p className="mt-4 flex items-baseline justify-between">
                <span className="font-serif text-3xl font-semibold">{formatearPrecio(s.precio)}</span>
                <span className="text-sm font-medium">{formatearDuracion(s.duracionMin)}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 rounded-2xl bg-rosa-suave px-5 py-4 text-center font-medium">
        Seña para confirmar tu turno: <strong>{formatearPrecio(SENA)}</strong> (se paga con Mercado Pago).
      </p>
    </section>
  );
}

const PASOS = [
  { n: 1, titulo: "Elegí tu servicio", texto: "Semipermanente, Kapping o Soft Gel." },
  { n: 2, titulo: "Elegí día y horario", texto: "Solo ves los horarios que están libres." },
  { n: 3, titulo: "Pagá la seña", texto: "Recibís tu confirmación al instante." },
];

function ComoFunciona() {
  return (
    <section className="bg-white/60 py-14">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Cómo funciona</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {PASOS.map((p) => (
            <li key={p.n} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rosa-petalo font-serif text-2xl font-semibold shadow-[inset_0_2px_0_rgb(255_255_255/0.45)]">
                {p.n}
              </span>
              <div>
                <h3 className="text-lg font-bold">{p.titulo}</h3>
                <p className="mt-1 leading-relaxed">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Mia() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 md:grid md:grid-cols-2 md:items-center md:gap-10">
      <div>
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Conocé a MIA, tu asistente de turnos</h2>
        <p className="mt-4 max-w-md text-lg leading-relaxed">
          Preguntale por precios, duración o disponibilidad. MIA consulta la agenda real antes
          de responderte, así que nunca te ofrece un horario que no existe.
        </p>
      </div>
      <div className="card-suave mt-8 space-y-3 p-5 md:mt-0" role="img" aria-label="Ejemplo de conversación con MIA">
        <p className="text-xs font-semibold uppercase tracking-widest">Ejemplo de conversación</p>
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-blush px-4 py-3">
          ¿Cuánto dura el Kapping?
        </p>
        <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-rosa-suave px-4 py-3">
          El Kapping dura 1 hora y 30 minutos y cuesta {formatearPrecio(9000)}. ¿Querés que te
          muestre los horarios libres?
        </p>
      </div>
    </section>
  );
}

function Testimonios() {
  const hayEjemplos = TESTIMONIOS.some((t) => t.ejemplo);
  return (
    <section className="bg-white/60 py-14">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Lo que dicen nuestras clientas</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {TESTIMONIOS.map((t) => (
            <li key={t.nombre} className="card-suave p-6">
              {t.ejemplo && (
                <span className="mb-3 inline-block rounded-full bg-rosa-suave px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Ejemplo
                </span>
              )}
              <p className="leading-relaxed">“{t.texto}”</p>
              <p className="mt-4 text-sm font-bold">
                {t.nombre} <span className="font-medium">· {t.servicio}</span>
              </p>
            </li>
          ))}
        </ul>
        {hayEjemplos && (
          <p className="mt-4 text-sm">Opiniones de ejemplo: se reemplazan por opiniones reales de clientas.</p>
        )}
      </div>
    </section>
  );
}

// Solo nombre y rol: no se publican DNI, teléfonos ni redes personales de los integrantes.
const EQUIPO = [
  { nombre: "Génesis Tiziana Marín", rol: "Estudiante · Desarrollo" },
  { nombre: "Agustina Guadalupe Monrroy Carvajal", rol: "Estudiante · Dueña de LumiNails Studio" },
  { nombre: "Víctor Santiago Palacios", rol: "Estudiante · Desarrollo" },
  { nombre: "Fabricio Paez Manrique", rol: "Tutor del proyecto" },
];

function Equipo() {
  return (
    <section id="equipo" className="bg-white/60 py-14">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Quiénes lo hicimos</h2>
        <p className="mt-3 max-w-xl leading-relaxed">
          LumiNails Studio es un proyecto creado por estudiantes de 5° año para el concurso de innovación
          tecnológica de La Rioja, a partir de un emprendimiento de uñas real.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {EQUIPO.map((p) => (
            <li key={p.nombre} className="card-suave p-6">
              <Destello className="h-5 w-5 text-oro" />
              <p className="mt-3 text-lg font-bold">{p.nombre}</p>
              <p className="mt-1 text-sm font-medium">{p.rol}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const TRATAMIENTOS_VARONES = ["Uñas", "Depilación", "Limpieza facial"];

function Proximamente() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14">
      <div className="text-center">
        <span className="inline-block rounded-full bg-oro/25 px-4 py-1.5 text-sm font-bold">Próximamente</span>
        <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">Lo que viene en LumiNails</h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card-suave p-8 text-center">
          <h3 className="font-serif text-2xl font-semibold">Tienda LumiNails</h3>
          <p className="mx-auto mt-3 max-w-md leading-relaxed">
            Esmaltes, limas y todo lo que necesitás para cuidar tus uñas en casa.
          </p>
        </div>
        <div className="card-suave p-8 text-center">
          <h3 className="font-serif text-2xl font-semibold">Tratamientos para varones</h3>
          <p className="mx-auto mt-3 max-w-md leading-relaxed">
            Cuidado personal pensado para ellos. Pronto vas a poder reservar también estos turnos:
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {TRATAMIENTOS_VARONES.map((t) => (
              <li key={t} className="rounded-full bg-rosa-suave px-4 py-1.5 text-sm font-semibold">{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CtaFinal() {
  return (
    <section className="bg-cacao py-16 text-blush">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 text-center">
        <Destello className="h-7 w-7 text-oro" />
        <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">Tu próximo turno está a un toque</h2>
        <p className="mt-4 text-lg">Elegí tu horario ahora y confirmá con una seña de {formatearPrecio(SENA)}.</p>
        <div className="mt-8">
          <Cta />
        </div>
      </div>
    </section>
  );
}

function Pie() {
  return (
    <footer className="bg-cacao pb-28 md:pb-10 text-center text-sm text-blush/90">
      <div className="mx-auto max-w-5xl border-t border-blush/20 px-5 pt-8">
        <Image
          src="/logo/LumiNails_horizontal_sobre-oscuro.svg"
          alt="LumiNails Studio"
          width={420}
          height={86}
          className="mx-auto h-10 w-auto"
        />
        <a
          href="https://www.instagram.com/luminails._studio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seguinos en Instagram: @luminails._studio"
          className="mx-auto mt-5 inline-flex min-h-12 items-center gap-3 rounded-full border border-blush/40 py-1.5 pl-1.5 pr-5 font-semibold hover:bg-blush/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush text-cacao">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          </span>
          Seguinos
          <span className="font-normal opacity-80">@luminails._studio</span>
        </a>
        <p className="mt-2">La Rioja, Argentina · © 2026 LumiNails Studio</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Encabezado />
      <main>
        <Hero />
        <Beneficios />
        <Servicios />
        <ComoFunciona />
        <Mia />
        <Testimonios />
        <Proximamente />
        <Equipo />
        <CtaFinal />
      </main>
      <Pie />
      <div className="cta-fija"><Cta className="w-full" /></div>
    </>
  );
}
