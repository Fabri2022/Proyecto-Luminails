// Servicios y precios de LumiNails Studio.
// Fuente: definiciones del proyecto (Agustina). Los precios se muestran en pesos argentinos.
// Más adelante estos datos salen de la tabla `servicios` de Supabase.

export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number;
  foto: string;
  fotoAlt: string;
};

export const SENA = 2000;

export const SERVICIOS: Servicio[] = [
  {
    id: "semipermanente",
    foto: "/trabajos/semipermanente-1.jpg",
    fotoAlt: "Uñas cortas con esmalte semipermanente rosa perlado",
    nombre: "Semipermanente",
    descripcion: "Color y brillo parejos que duran semanas.",
    duracionMin: 60,
    precio: 7000,
  },
  {
    id: "kapping",
    foto: "/trabajos/kapping-2.jpg",
    fotoAlt: "Uñas almendradas en rosa claro con acabado de kapping",
    nombre: "Kapping",
    descripcion: "Refuerzo para tus uñas naturales.",
    duracionMin: 90,
    precio: 9000,
  },
  {
    id: "soft-gel",
    foto: "/trabajos/soft-gel-2.jpg",
    fotoAlt: "Uñas soft gel largas con degradé gris y azul",
    nombre: "Soft Gel",
    descripcion: "Extensión liviana con acabado suave.",
    duracionMin: 120,
    precio: 10000,
  },
];

export function formatearPrecio(valor: number): string {
  return "$" + valor.toLocaleString("es-AR");
}

export function formatearDuracion(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return h === 1 ? "1 hora" : `${h} horas`;
  return `${h} h ${m} min`;
}

// Adicionales: se suman a un servicio (no se reservan solos).
export type Adicional = { id: string; nombre: string; precio: number; foto: string };

export const ADICIONALES: Adicional[] = [
  { id: "nail-art", nombre: "Nail Art", precio: 2000, foto: "/trabajos/nail-art-1.jpg" },
  { id: "pedreria", nombre: "Pedrería", precio: 1000, foto: "/trabajos/pedreria-2.jpg" },
];
