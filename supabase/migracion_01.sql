-- Migración 01: guardar adicionales y total en cada turno.
-- Ejecutar UNA vez en Supabase → SQL Editor (es seguro repetirla).
alter table turnos add column if not exists adicionales text[] not null default '{}';
alter table turnos add column if not exists total integer;
