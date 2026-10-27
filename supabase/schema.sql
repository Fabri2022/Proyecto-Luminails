-- =====================================================================
-- LumiNails Studio · esquema de base de datos (Supabase / PostgreSQL)
-- Cómo usarlo: Supabase → SQL Editor → pegar todo → Run.
-- Se puede ejecutar de nuevo sin romper nada (usa IF NOT EXISTS / ON CONFLICT).
-- =====================================================================

create extension if not exists btree_gist;   -- necesario para impedir turnos superpuestos

-- ---------- 1. Servicios -------------------------------------------------
create table if not exists servicios (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  nombre        text not null,
  descripcion   text,
  precio        integer not null check (precio > 0),          -- en pesos
  duracion_min  integer not null check (duracion_min > 0),    -- en minutos (60, 90, 120)
  activo        boolean not null default true,
  orden         integer not null default 0
);

-- ---------- 2. Días y horarios de atención -------------------------------
-- dia_semana: 0 = domingo ... 6 = sábado
create table if not exists horarios_atencion (
  id          uuid primary key default gen_random_uuid(),
  dia_semana  integer not null check (dia_semana between 0 and 6),
  desde       time not null,
  hasta       time not null,
  activo      boolean not null default true,
  check (hasta > desde)
);

-- Días en los que no se atiende (vacaciones, enfermedad, feriados)
create table if not exists dias_bloqueados (
  fecha   date primary key,
  motivo  text
);

-- ---------- 3. Turnos ----------------------------------------------------
create table if not exists turnos (
  id                uuid primary key default gen_random_uuid(),
  servicio_id       uuid not null references servicios(id),
  cliente_nombre    text not null,
  cliente_telefono  text not null,
  inicio            timestamptz not null,
  fin               timestamptz not null,
  estado            text not null default 'pendiente'
                    check (estado in ('pendiente','confirmado','cancelado','vencido')),
  sena_monto        integer not null default 2000,
  expira_en         timestamptz,            -- el turno "pendiente" se reserva 10 minutos
  mp_preference_id  text,                   -- id de la preferencia de pago (Mercado Pago)
  mp_payment_id     text,                   -- id del pago aprobado
  creado_en         timestamptz not null default now(),
  check (fin > inicio),
  -- Dos turnos activos NUNCA pueden pisarse: la base de datos lo garantiza.
  constraint turnos_sin_superposicion
    exclude using gist (tstzrange(inicio, fin) with &&)
    where (estado in ('pendiente','confirmado'))
);

create index if not exists turnos_inicio_idx on turnos (inicio);

-- ---------- 4. Liberar reservas pendientes que vencieron -----------------
create or replace function liberar_turnos_vencidos() returns void
language sql as $$
  update turnos
     set estado = 'vencido'
   where estado = 'pendiente' and expira_en is not null and expira_en < now();
$$;

-- ---------- 5. Horarios ocupados (sin datos personales) -------------------
-- La web pública usa esta función para pintar los horarios ocupados.
-- Devuelve solo inicio y fin: nunca nombres ni teléfonos.
create or replace function horarios_ocupados(desde timestamptz, hasta timestamptz)
returns table (inicio timestamptz, fin timestamptz)
language sql security definer set search_path = public as $$
  select t.inicio, t.fin
    from turnos t
   where t.inicio < hasta and t.fin > desde
     and (t.estado = 'confirmado'
          or (t.estado = 'pendiente' and t.expira_en > now()));
$$;

-- ---------- 6. Seguridad (Row Level Security) ----------------------------
alter table servicios         enable row level security;
alter table horarios_atencion enable row level security;
alter table dias_bloqueados   enable row level security;
alter table turnos            enable row level security;

drop policy if exists "servicios visibles" on servicios;
create policy "servicios visibles" on servicios for select using (activo);

drop policy if exists "horarios visibles" on horarios_atencion;
create policy "horarios visibles" on horarios_atencion for select using (activo);

drop policy if exists "dias bloqueados visibles" on dias_bloqueados;
create policy "dias bloqueados visibles" on dias_bloqueados for select using (true);

-- `turnos` NO tiene políticas públicas: nadie desde el navegador puede leer ni escribir.
-- Las reservas se crean desde el servidor (rutas /api) con la clave de servicio.

revoke all on function liberar_turnos_vencidos() from public, anon, authenticated;
grant execute on function horarios_ocupados(timestamptz, timestamptz) to anon, authenticated;

-- ---------- 7. Datos iniciales -------------------------------------------
insert into servicios (slug, nombre, descripcion, precio, duracion_min, orden) values
  ('semipermanente', 'Semipermanente', 'Color y brillo parejos que duran semanas.', 7000,  60, 1),
  ('kapping',        'Kapping',        'Refuerzo para tus uñas naturales.',          9000,  90, 2),
  ('soft-gel',       'Soft Gel',       'Extensión liviana con acabado suave.',       10000, 120, 3)
on conflict (slug) do update
  set nombre = excluded.nombre, descripcion = excluded.descripcion,
      precio = excluded.precio, duracion_min = excluded.duracion_min, orden = excluded.orden;

-- EJEMPLO: ajustar con Agustina los días y horarios reales de atención.
-- (Si ya los cargaste, no vuelvas a ejecutar este bloque para no duplicarlos.)
insert into horarios_atencion (dia_semana, desde, hasta)
select d, time '15:00', time '20:00' from generate_series(2, 6) as d   -- martes a sábado
where not exists (select 1 from horarios_atencion);
