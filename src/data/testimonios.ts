// Testimonios.
// REGLA: solo se publican opiniones reales con autorización escrita de la clienta
// (y de su familia si es menor). Mientras no lleguen, se muestran como "Ejemplo".
// Cuando tengas una opinión real, agregala con `ejemplo: false` y borrá los de ejemplo.

export type Testimonio = {
  nombre: string; // nombre de pila + inicial del apellido
  servicio: string;
  texto: string;
  ejemplo: boolean;
};

export const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "Nombre A.",
    servicio: "Semipermanente",
    texto: "Acá va la opinión real de una clienta, con su permiso.",
    ejemplo: true,
  },
  {
    nombre: "Nombre B.",
    servicio: "Soft Gel",
    texto: "Acá va la opinión real de una clienta, con su permiso.",
    ejemplo: true,
  },
  {
    nombre: "Nombre C.",
    servicio: "Kapping",
    texto: "Acá va la opinión real de una clienta, con su permiso.",
    ejemplo: true,
  },
];
