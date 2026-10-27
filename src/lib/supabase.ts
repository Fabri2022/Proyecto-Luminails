import { createClient } from "@supabase/supabase-js";

// Cliente del navegador: usa solo la clave pública (publishable/anon).
// La seguridad la dan las políticas RLS de supabase/schema.sql.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
);
