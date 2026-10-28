// Testimonios.
// REGLA: solo se publican opiniones reales con autorización de la clienta
// (y de su familia si es menor). Texto tal cual lo escribió la clienta.
// Las capturas de WhatsApp con el permiso se guardan aparte, nunca en la página.

export type Testimonio = {
  nombre: string; // nombre de pila + inicial del apellido
  servicio?: string;
  estrellas: number; // 1 a 5
  texto: string;
  ejemplo: boolean;
};

export const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "Cristhel C.",
    estrellas: 5,
    texto: "Me encantó el servicio. En lo personal le daría más que 5 estrellas.",
    ejemplo: false,
  },
  {
    nombre: "Sabrina A.",
    estrellas: 5,
    texto:
      "Me encantó muchísimo el resultado, quedé súper conforme con el trabajo. Se nota la dedicación, el cuidado y el amor que le pone a cada detalle. Las uñas quedaron hermosas y la experiencia fue muy grata. ¡La recomiendo un montón!",
    ejemplo: false,
  },
  {
    nombre: "Melina O.",
    estrellas: 5,
    texto: "Me encantó el servicio y me sentí súper cómoda con todo. En lo personal le daría 5 estrellas, súper recomendado.",
    ejemplo: false,
  },
];
