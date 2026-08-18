-- Aplicada el 2026-08-18. Latido diario para que el plan free no pause el proyecto.
-- Ver docs/latido-y-leads.md

create table if not exists public.latido (
  id smallint primary key default 1,
  ultimo timestamptz not null default now(),
  origen text,
  constraint latido_una_sola_fila check (id = 1)
);

insert into public.latido (id, ultimo, origen)
values (1, now(), 'migracion')
on conflict (id) do nothing;

alter table public.latido enable row level security;
revoke all on public.latido from anon, authenticated;

create or replace function public.fn_latido(p_origen text default null)
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_ahora timestamptz := now();
begin
  update public.latido set ultimo = v_ahora, origen = coalesce(left(p_origen, 60), 'desconocido') where id = 1;
  if not found then
    insert into public.latido (id, ultimo, origen) values (1, v_ahora, coalesce(left(p_origen, 60), 'desconocido'));
  end if;
  return v_ahora;
end;
$$;

revoke all on function public.fn_latido(text) from public;
grant execute on function public.fn_latido(text) to anon, authenticated, service_role;
