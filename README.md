# LumiNails Studio · reservas de turnos

Web app para reservar turnos de uñas: la clienta elige servicio, día y horario, paga la seña
por Mercado Pago y recibe la confirmación. MIA, la asistente con IA, responde dudas y consulta
los horarios reales. Proyecto del concurso «Desarrollando el futuro · La Rioja 2026».

## Estado

| Parte | Estado |
|---|---|
| Landing (inicio) | ✅ lista (falta reemplazar fotos y testimonios de ejemplo) |
| Base de datos (`supabase/schema.sql`) | ✅ escrita, falta ejecutarla en Supabase |
| Calendario y reserva | ⏳ miércoles |
| Seña con Mercado Pago (prueba) | ⏳ jueves |
| MIA con Gemini | ⏳ viernes |

## Poner en marcha (paso a paso)

1. **Supabase**: crear un proyecto (región *South America*). Ir a **SQL Editor**, pegar el
   contenido de `supabase/schema.sql` y apretar **Run**.
2. **Variables**: copiar `.env.example` como `.env.local` y completar los valores
   (Supabase → *Project Settings → API*). **Las claves secretas nunca se suben a GitHub ni se
   pegan en chats.**
3. **Probar en la compu**:
   ```bash
   npm install
   npm run dev      # abrir http://localhost:3000
   ```
4. **Publicar**: subir el código a GitHub. En Vercel, *Add New → Project* y elegir el repositorio.
   Cargar las mismas variables en *Settings → Environment Variables*. Cada cambio en `main`
   se publica solo.

## Dónde cambiar cosas

- Textos y secciones de la landing: `src/app/page.tsx`
- Servicios y precios: `src/data/servicios.ts` (después salen de la base de datos)
- Testimonios: `src/data/testimonios.ts` — **solo opiniones reales con permiso**; los de ejemplo
  llevan la etiqueta «Ejemplo» hasta que se reemplacen
- Colores: `src/app/globals.css` (Rosa pétalo, Rosa suave, Cacao, Oro champagne, Blush)
- Logo e íconos: `public/` (kit completo de marca aparte)

## Reglas del proyecto

- **Datos de prueba** en la demo: nombres y teléfonos inventados. Antes de usar datos de personas
  reales hay que revisar permisos (lo pide el reglamento).
- **A la IA nunca se le envían nombres ni teléfonos**, solo la pregunta y los horarios libres.
- Mercado Pago: **credenciales de prueba** (`TEST-...`). No se cobra dinero real.
- Un solo botón principal por pantalla: «Reservá tu turno».
- Los alumnos deben poder explicar cada parte: se construye entre todos, paso a paso.

## Tecnologías

Next.js · React · Tailwind CSS · Supabase (PostgreSQL) · Mercado Pago (Checkout Pro, modo prueba) ·
Gemini (Google AI Studio) · Vercel. Fuentes: Cormorant Garamond y Montserrat (licencia SIL OFL).
