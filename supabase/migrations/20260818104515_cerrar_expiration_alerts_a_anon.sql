-- Aplicada el 2026-08-18. Cierra la unica vista que la clave publica podia leer.
--
-- expiration_alerts NO filtra por empresa (lista contratos, dominios y suscripciones de
-- TODOS los clientes con su nombre comercial) y tenia SELECT concedido a anon. La clave
-- publica viaja dentro del JavaScript de la web, asi que era legible por cualquiera.
-- Estaba vacia, de modo que no hubo fuga; la habria habido con el primer contrato con fecha.

revoke all on public.expiration_alerts from anon;
revoke all on public.expiration_alerts from public;

-- security_invoker=on: deja de ejecutarse como postgres (que se salta la RLS) y pasa a
-- respetar las politicas de contracts / projects / companies / project_subscriptions.
alter view public.expiration_alerts set (security_invoker = on);

grant select on public.expiration_alerts to authenticated, service_role;

comment on view public.expiration_alerts is
  'Vencimientos (contratos, dominios, suscripciones) para el panel de administracion. NO filtra por empresa por si misma: el recorte lo hace la RLS de las tablas base, por eso lleva security_invoker=on. Cerrada a anon el 18-ago-2026. Si algun dia se hace CREATE OR REPLACE VIEW sobre ella, VOLVER A PONER security_invoker=on: el REPLACE se lo lleva por delante.';

-- NO se toca client_invoices / client_invoice_lines / client_proposals: son vistas con
-- security_invoker=off A PROPOSITO. Las tablas base (invoices, proposals, invoice_lines)
-- solo tienen politica de admin, asi que la vista ES la frontera de seguridad del cliente:
-- filtran por dentro con user_company_ids() y excluyen columnas internas. Ponerles
-- security_invoker=on dejaria el portal del cliente a cero filas, en silencio.
