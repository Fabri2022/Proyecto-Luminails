import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente SOLO para el servidor: usa la clave secreta (service_role).
// Nunca importar desde un componente "use client".
export function supabaseServidor() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });
}
