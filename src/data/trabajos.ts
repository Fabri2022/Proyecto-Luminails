// Fotos reales de los trabajos de LumiNails Studio (archivos en /public/trabajos).
// Para cambiar una foto: reemplazá el archivo (900 px de ancho, JPG liviano) o editá el texto alternativo.

export type GrupoTrabajos = {
  id: string;            // coincide con el id del servicio o adicional
  titulo: string;
  adicional?: boolean;   // los adicionales se suman a un servicio
  fotos: { src: string; alt: string }[];
};

export const TRABAJOS: GrupoTrabajos[] = [
  {
    id: "soft-gel", titulo: "Soft Gel",
    fotos: [
      { src: "/trabajos/soft-gel-1.jpg", alt: "Uñas largas con diseño animal print marrón y detalles blancos" },
      { src: "/trabajos/soft-gel-2.jpg", alt: "Uñas largas con degradé gris y azul y un dije metálico" },
    ],
  },
  {
    id: "semipermanente", titulo: "Semipermanente",
    fotos: [
      { src: "/trabajos/semipermanente-1.jpg", alt: "Uñas cortas con esmalte rosa perlado" },
      { src: "/trabajos/semipermanente-2.jpg", alt: "Uñas largas con brillos en rosa y lila" },
      { src: "/trabajos/semipermanente-3.jpg", alt: "Uñas largas en rosa traslúcido brillante" },
    ],
  },
  {
    id: "kapping", titulo: "Kapping",
    fotos: [
      { src: "/trabajos/kapping-1.jpg", alt: "Uñas cortas con espirales en blanco y negro" },
      { src: "/trabajos/kapping-2.jpg", alt: "Uñas almendradas en rosa claro" },
      { src: "/trabajos/kapping-3.jpg", alt: "Uñas almendradas en gris lila con detalles nacarados" },
    ],
  },
  {
    id: "nail-art", titulo: "Nail Art", adicional: true,
    fotos: [
      { src: "/trabajos/nail-art-1.jpg", alt: "Uñas con diseños pintados a mano en tonos verdes y celestes" },
      { src: "/trabajos/nail-art-2.jpg", alt: "Uñas largas con animal print y esmalte marrón" },
      { src: "/trabajos/nail-art-3.jpg", alt: "Uñas con animal print, marrón y piedras brillantes" },
    ],
  },
  {
    id: "pedreria", titulo: "Pedrería", adicional: true,
    fotos: [
      { src: "/trabajos/pedreria-1.jpg", alt: "Uñas largas con flores y piedras en tonos rosa" },
      { src: "/trabajos/pedreria-2.jpg", alt: "Uñas cortas con french blanco y florcitas" },
      { src: "/trabajos/pedreria-3.jpg", alt: "Uñas nude con pequeñas piedras plateadas" },
    ],
  },
];
