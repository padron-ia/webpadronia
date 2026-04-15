-- =============================================================================
-- PADRÓN IA — Schema completo del CRM
-- =============================================================================
-- Ejecutar en Supabase SQL Editor. Script idempotente: puede ejecutarse
-- múltiples veces sin romper datos existentes.
--
-- Estructura:
--   BLOQUE 0 — Extensiones y tablas core existentes (profiles, leads, lead_notes)
--   BLOQUE 1 — Entidades comerciales (companies, contacts, client_users)
--   BLOQUE 2 — Pipeline (opportunities)
--   BLOQUE 3 — Proyectos y operativa (projects, team, milestones, tasks, time_entries)
--   BLOQUE 4 — Deliverables, propuestas, contratos, actividad
--   BLOQUE 5 — Facturación (catalog, series, invoices, lines, payments, expenses)
--   BLOQUE 6 — Documentos
--   BLOQUE 7 — Configuración de la organización (Padrón IA)
--   BLOQUE 8 — Funciones auxiliares + triggers
--   BLOQUE 9 — Row Level Security
-- =============================================================================

create extension if not exists "pgcrypto";

-- =============================================================================
-- BLOQUE 0 — Tablas existentes (se mantienen)
-- =============================================================================

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    role text not null default 'client' check (role in ('admin', 'client')),
    created_at timestamptz not null default now()
);

create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    name text,
    company text,
    contact text,
    sector text,
    objective text,
    urgency text,
    budget_range text,
    lead_volume text,
    decision_role text,
    message text,
    lead_score int,
    lead_grade text,
    source text default 'landing',
    status text default 'new',
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now()
);

alter table public.leads add column if not exists assigned_to uuid references public.profiles(id) on delete set null;
alter table public.leads add column if not exists last_contact_at timestamptz;
alter table public.leads add column if not exists next_action_at timestamptz;
alter table public.leads add column if not exists estimated_value numeric(12, 2);
alter table public.leads add column if not exists lost_reason text;
alter table public.leads add column if not exists updated_at timestamptz not null default now();

create table if not exists public.lead_notes (
    id uuid primary key default gen_random_uuid(),
    lead_id uuid not null references public.leads(id) on delete cascade,
    author_id uuid references auth.users(id) on delete set null,
    note text not null,
    created_at timestamptz not null default now()
);

-- =============================================================================
-- BLOQUE 1 — Entidades comerciales (empresas, contactos, acceso al portal)
-- =============================================================================

create table if not exists public.companies (
    id uuid primary key default gen_random_uuid(),
    legal_name text not null,
    commercial_name text,
    tax_id text,
    tax_id_type text default 'NIF',
    billing_address jsonb,
    shipping_address jsonb,
    phone text,
    email text,
    website text,
    sector text,
    company_size text,
    annual_revenue_range text,
    tax_regime text,
    default_vat numeric(5,2) default 21,
    default_irpf numeric(5,2) default 0,
    currency text default 'EUR',
    logo_url text,
    notes text,
    lifecycle_stage text default 'prospect' check (lifecycle_stage in ('prospect', 'lead', 'opportunity', 'client', 'former', 'partner', 'vendor')),
    source text,
    owner_id uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_companies_lifecycle on public.companies(lifecycle_stage);
create index if not exists idx_companies_owner on public.companies(owner_id);
create index if not exists idx_companies_legal_name on public.companies(legal_name);

create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    company_id uuid references public.companies(id) on delete cascade,
    full_name text not null,
    email text,
    phone_mobile text,
    phone_landline text,
    job_title text,
    department text,
    is_primary boolean default false,
    is_decision_maker boolean default false,
    is_signer boolean default false,
    linkedin_url text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_contacts_company on public.contacts(company_id);
create index if not exists idx_contacts_email on public.contacts(email);

-- Mapeo: un usuario de Supabase Auth representa a una empresa cliente
create table if not exists public.client_users (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    company_id uuid not null references public.companies(id) on delete cascade,
    contact_id uuid references public.contacts(id) on delete set null,
    access_level text default 'view' check (access_level in ('view', 'edit', 'admin_company')),
    invited_by uuid references auth.users(id) on delete set null,
    invited_at timestamptz,
    accepted_at timestamptz,
    created_at timestamptz not null default now(),
    unique (user_id, company_id)
);

create index if not exists idx_client_users_user on public.client_users(user_id);
create index if not exists idx_client_users_company on public.client_users(company_id);

-- =============================================================================
-- BLOQUE 2 — Pipeline comercial
-- =============================================================================

create table if not exists public.opportunities (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies(id) on delete cascade,
    primary_contact_id uuid references public.contacts(id) on delete set null,
    name text not null,
    description text,
    stage text default 'qualification' check (stage in ('qualification', 'discovery', 'proposal', 'negotiation', 'won', 'lost')),
    probability int default 20 check (probability between 0 and 100),
    estimated_value numeric(12, 2),
    currency text default 'EUR',
    expected_close_date date,
    actual_close_date date,
    lost_reason text,
    source text,
    owner_id uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_opportunities_company on public.opportunities(company_id);
create index if not exists idx_opportunities_stage on public.opportunities(stage);
create index if not exists idx_opportunities_owner on public.opportunities(owner_id);

-- Enlazar leads a companies (cuando se convierte un lead del formulario)
alter table public.leads add column if not exists company_id uuid references public.companies(id) on delete set null;
alter table public.leads add column if not exists opportunity_id uuid references public.opportunities(id) on delete set null;
alter table public.leads add column if not exists converted_at timestamptz;

-- =============================================================================
-- BLOQUE 3 — Proyectos y operativa
-- =============================================================================

create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies(id) on delete cascade,
    opportunity_id uuid references public.opportunities(id) on delete set null,
    code text,
    title text not null,
    slug text not null,
    description text,
    status text default 'active' check (status in ('kickoff', 'active', 'paused', 'completed', 'archived')),
    health text default 'on_track' check (health in ('on_track', 'at_risk', 'off_track')),
    start_date date,
    end_date date,
    manager_id uuid references auth.users(id) on delete set null,
    budget_hours numeric(8,2),
    budget_amount numeric(12,2),
    currency text default 'EUR',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (company_id, slug)
);

create index if not exists idx_projects_company on public.projects(company_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_manager on public.projects(manager_id);

create table if not exists public.project_team (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text default 'member' check (role in ('owner', 'manager', 'member', 'reviewer')),
    allocation_pct int default 100 check (allocation_pct between 0 and 100),
    hourly_rate numeric(8,2),
    created_at timestamptz not null default now(),
    unique (project_id, user_id)
);

create table if not exists public.project_milestones (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    title text not null,
    description text,
    due_date date,
    completed_at timestamptz,
    position int default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_milestones_project on public.project_milestones(project_id);

create table if not exists public.tasks (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade,
    milestone_id uuid references public.project_milestones(id) on delete set null,
    title text not null,
    description text,
    assignee_id uuid references auth.users(id) on delete set null,
    status text default 'todo' check (status in ('todo', 'in_progress', 'review', 'done', 'blocked')),
    priority text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
    due_date date,
    completed_at timestamptz,
    client_visible boolean default false,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_assignee on public.tasks(assignee_id);
create index if not exists idx_tasks_status on public.tasks(status);

create table if not exists public.time_entries (
    id uuid primary key default gen_random_uuid(),
    task_id uuid references public.tasks(id) on delete set null,
    project_id uuid not null references public.projects(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    description text,
    hours numeric(5,2) not null check (hours > 0),
    entry_date date not null default current_date,
    billable boolean default true,
    billed boolean default false,
    invoice_line_id uuid,
    created_at timestamptz not null default now()
);

create index if not exists idx_time_entries_project on public.time_entries(project_id);
create index if not exists idx_time_entries_user_date on public.time_entries(user_id, entry_date);

-- =============================================================================
-- BLOQUE 4 — Deliverables, propuestas, contratos, actividad
-- =============================================================================

create table if not exists public.deliverables (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    type text not null check (type in ('audit', 'report', 'prototype', 'document', 'presentation', 'dashboard', 'training')),
    title text not null,
    slug text not null,
    description text,
    content_type text default 'internal' check (content_type in ('internal', 'external_url', 'iframe', 'file', 'markdown')),
    content_ref text,
    status text default 'published' check (status in ('draft', 'published', 'archived')),
    position int default 0,
    client_visible boolean default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (project_id, slug)
);

create index if not exists idx_deliverables_project on public.deliverables(project_id);
create index if not exists idx_deliverables_status on public.deliverables(status);

create table if not exists public.proposals (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete set null,
    opportunity_id uuid references public.opportunities(id) on delete set null,
    company_id uuid references public.companies(id) on delete set null,
    title text not null,
    summary text,
    content jsonb default '{}'::jsonb,
    total_amount numeric(12,2),
    currency text default 'EUR',
    valid_until date,
    status text default 'draft' check (status in ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'revised', 'expired')),
    sent_at timestamptz,
    viewed_at timestamptz,
    decided_at timestamptz,
    decision_notes text,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_proposals_project on public.proposals(project_id);
create index if not exists idx_proposals_opportunity on public.proposals(opportunity_id);
create index if not exists idx_proposals_status on public.proposals(status);

create table if not exists public.contracts (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete set null,
    company_id uuid not null references public.companies(id) on delete cascade,
    proposal_id uuid references public.proposals(id) on delete set null,
    title text not null,
    type text default 'fixed_fee' check (type in ('fixed_fee', 'hourly', 'retainer', 'success_fee', 'mixed')),
    total_amount numeric(12,2),
    currency text default 'EUR',
    start_date date,
    end_date date,
    auto_renewal boolean default false,
    status text default 'draft' check (status in ('draft', 'active', 'completed', 'terminated')),
    signed_at timestamptz,
    document_url text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_contracts_company on public.contracts(company_id);
create index if not exists idx_contracts_project on public.contracts(project_id);

create table if not exists public.activity_log (
    id uuid primary key default gen_random_uuid(),
    company_id uuid references public.companies(id) on delete cascade,
    project_id uuid references public.projects(id) on delete cascade,
    opportunity_id uuid references public.opportunities(id) on delete set null,
    contact_id uuid references public.contacts(id) on delete set null,
    actor_id uuid references auth.users(id) on delete set null,
    type text not null,
    title text not null,
    body text,
    meta jsonb,
    client_visible boolean default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_activity_company on public.activity_log(company_id, created_at desc);
create index if not exists idx_activity_project on public.activity_log(project_id, created_at desc);

-- =============================================================================
-- BLOQUE 5 — Facturación
-- =============================================================================

create table if not exists public.catalog_items (
    id uuid primary key default gen_random_uuid(),
    sku text unique,
    name text not null,
    description text,
    unit text default 'u',
    unit_price numeric(10,2) not null,
    currency text default 'EUR',
    default_vat numeric(5,2) default 21,
    category text,
    active boolean default true,
    created_at timestamptz not null default now()
);

create table if not exists public.invoice_series (
    id uuid primary key default gen_random_uuid(),
    code text not null,
    name text not null,
    prefix text,
    next_number int default 1,
    year int not null default extract(year from now()),
    active boolean default true,
    created_at timestamptz not null default now(),
    unique (code, year)
);

create table if not exists public.invoices (
    id uuid primary key default gen_random_uuid(),
    series_id uuid references public.invoice_series(id) on delete set null,
    number int,
    full_number text,
    company_id uuid not null references public.companies(id) on delete restrict,
    project_id uuid references public.projects(id) on delete set null,
    contract_id uuid references public.contracts(id) on delete set null,
    issue_date date not null default current_date,
    due_date date,
    payment_terms text,
    currency text default 'EUR',
    subtotal numeric(12,2) default 0,
    vat_amount numeric(12,2) default 0,
    irpf_amount numeric(12,2) default 0,
    total_amount numeric(12,2) default 0,
    paid_amount numeric(12,2) default 0,
    status text default 'draft' check (status in ('draft', 'issued', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'void')),
    notes text,
    internal_notes text,
    pdf_url text,
    rectifies_invoice_id uuid references public.invoices(id) on delete set null,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_invoices_company on public.invoices(company_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_invoices_issue_date on public.invoices(issue_date desc);

create table if not exists public.invoice_lines (
    id uuid primary key default gen_random_uuid(),
    invoice_id uuid not null references public.invoices(id) on delete cascade,
    catalog_item_id uuid references public.catalog_items(id) on delete set null,
    description text not null,
    quantity numeric(10,2) not null default 1,
    unit_price numeric(10,2) not null,
    discount_pct numeric(5,2) default 0,
    vat_pct numeric(5,2) default 21,
    irpf_pct numeric(5,2) default 0,
    subtotal numeric(12,2),
    position int default 0
);

create index if not exists idx_invoice_lines_invoice on public.invoice_lines(invoice_id);

create table if not exists public.payments (
    id uuid primary key default gen_random_uuid(),
    invoice_id uuid not null references public.invoices(id) on delete cascade,
    amount numeric(12,2) not null check (amount > 0),
    payment_date date not null default current_date,
    method text check (method in ('transfer', 'card', 'direct_debit', 'cash', 'other')),
    reference text,
    notes text,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now()
);

create index if not exists idx_payments_invoice on public.payments(invoice_id);
create index if not exists idx_payments_date on public.payments(payment_date desc);

create table if not exists public.expenses (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete set null,
    company_id uuid references public.companies(id) on delete set null,
    description text not null,
    amount numeric(12,2) not null,
    vat_amount numeric(12,2) default 0,
    currency text default 'EUR',
    expense_date date not null default current_date,
    category text,
    billable boolean default false,
    billed boolean default false,
    receipt_url text,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now()
);

create index if not exists idx_expenses_project on public.expenses(project_id);
create index if not exists idx_expenses_date on public.expenses(expense_date desc);

-- =============================================================================
-- BLOQUE 6 — Documentos (adjuntos genéricos)
-- =============================================================================

create table if not exists public.documents (
    id uuid primary key default gen_random_uuid(),
    company_id uuid references public.companies(id) on delete cascade,
    project_id uuid references public.projects(id) on delete cascade,
    entity_type text,
    entity_id uuid,
    title text not null,
    file_url text not null,
    file_size bigint,
    mime_type text,
    category text,
    client_visible boolean default false,
    uploaded_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now()
);

create index if not exists idx_documents_company on public.documents(company_id);
create index if not exists idx_documents_project on public.documents(project_id);

-- =============================================================================
-- BLOQUE 7 — Configuración de la organización (Padrón IA)
-- =============================================================================

create table if not exists public.org_settings (
    id uuid primary key default gen_random_uuid(),
    legal_name text not null,
    commercial_name text,
    tax_id text,
    address jsonb,
    phone text,
    email text,
    website text,
    bank_account text,
    default_vat numeric(5,2) default 21,
    default_irpf numeric(5,2) default 0,
    default_payment_terms text default '30 días',
    logo_url text,
    brand_colors jsonb,
    singleton boolean default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint org_settings_singleton_unique unique (singleton)
);

-- =============================================================================
-- BLOQUE 8 — Funciones y triggers
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Trigger de updated_at en todas las tablas que lo tienen
do $$
declare
    t text;
begin
    for t in
        select tbl from unnest(array[
            'leads', 'companies', 'contacts', 'opportunities',
            'projects', 'tasks', 'proposals', 'contracts',
            'invoices', 'org_settings'
        ]) as tbl
    loop
        execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
        execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
    end loop;
end;
$$;

-- Función: ¿es el usuario admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'admin'
    );
$$;

-- Función: empresas que el usuario puede ver (vía client_users)
create or replace function public.user_company_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
    select company_id
    from public.client_users
    where user_id = auth.uid();
$$;

-- Helper para chequear acceso a un proyecto
create or replace function public.user_can_view_project(project_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.projects p
        where p.id = project_uuid
          and p.company_id in (select public.user_company_ids())
    );
$$;

-- Helper para chequear acceso a una empresa
create or replace function public.user_can_view_company(company_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select company_uuid in (select public.user_company_ids());
$$;

-- Trigger: cuando se añade un pago, actualizar paid_amount y status de la factura
create or replace function public.recalc_invoice_paid()
returns trigger
language plpgsql
as $$
declare
    v_invoice_id uuid;
    v_total numeric(12,2);
    v_paid numeric(12,2);
begin
    v_invoice_id := coalesce(new.invoice_id, old.invoice_id);

    select coalesce(sum(amount), 0)
      into v_paid
      from public.payments
     where invoice_id = v_invoice_id;

    select total_amount into v_total from public.invoices where id = v_invoice_id;

    update public.invoices
       set paid_amount = v_paid,
           status = case
                        when v_paid >= coalesce(v_total, 0) and v_total > 0 then 'paid'
                        when v_paid > 0 then 'partial'
                        else status
                    end
     where id = v_invoice_id;

    return coalesce(new, old);
end;
$$;

drop trigger if exists payments_recalc_invoice on public.payments;
create trigger payments_recalc_invoice
after insert or update or delete on public.payments
for each row execute function public.recalc_invoice_paid();

-- Trigger: recalcular subtotal de invoice_lines automáticamente
create or replace function public.recalc_invoice_line_subtotal()
returns trigger
language plpgsql
as $$
begin
    new.subtotal := round(
        (new.quantity * new.unit_price * (1 - coalesce(new.discount_pct, 0) / 100))::numeric,
        2
    );
    return new;
end;
$$;

drop trigger if exists invoice_lines_subtotal on public.invoice_lines;
create trigger invoice_lines_subtotal
before insert or update on public.invoice_lines
for each row execute function public.recalc_invoice_line_subtotal();

-- Trigger: recalcular totales de la factura cuando se tocan líneas
create or replace function public.recalc_invoice_totals()
returns trigger
language plpgsql
as $$
declare
    v_invoice_id uuid;
    v_subtotal numeric(12,2);
    v_vat numeric(12,2);
    v_irpf numeric(12,2);
begin
    v_invoice_id := coalesce(new.invoice_id, old.invoice_id);

    select
        coalesce(sum(subtotal), 0),
        coalesce(sum(subtotal * vat_pct / 100), 0),
        coalesce(sum(subtotal * irpf_pct / 100), 0)
      into v_subtotal, v_vat, v_irpf
      from public.invoice_lines
     where invoice_id = v_invoice_id;

    update public.invoices
       set subtotal = v_subtotal,
           vat_amount = v_vat,
           irpf_amount = v_irpf,
           total_amount = v_subtotal + v_vat - v_irpf
     where id = v_invoice_id;

    return coalesce(new, old);
end;
$$;

drop trigger if exists invoice_lines_recalc_totals on public.invoice_lines;
create trigger invoice_lines_recalc_totals
after insert or update or delete on public.invoice_lines
for each row execute function public.recalc_invoice_totals();

-- =============================================================================
-- BLOQUE 9 — Row Level Security
-- =============================================================================

-- Activar RLS en todas las tablas
alter table public.profiles          enable row level security;
alter table public.leads             enable row level security;
alter table public.lead_notes        enable row level security;
alter table public.companies         enable row level security;
alter table public.contacts          enable row level security;
alter table public.client_users      enable row level security;
alter table public.opportunities     enable row level security;
alter table public.projects          enable row level security;
alter table public.project_team      enable row level security;
alter table public.project_milestones enable row level security;
alter table public.tasks             enable row level security;
alter table public.time_entries      enable row level security;
alter table public.deliverables      enable row level security;
alter table public.proposals         enable row level security;
alter table public.contracts         enable row level security;
alter table public.activity_log      enable row level security;
alter table public.catalog_items     enable row level security;
alter table public.invoice_series    enable row level security;
alter table public.invoices          enable row level security;
alter table public.invoice_lines     enable row level security;
alter table public.payments          enable row level security;
alter table public.expenses          enable row level security;
alter table public.documents         enable row level security;
alter table public.org_settings      enable row level security;

-- ----- profiles (existente) -----
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
    for select using (auth.uid() = id);

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles
    for select to authenticated using (public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
    for insert with check (auth.uid() = id);

-- ----- leads (existente) -----
drop policy if exists "leads_insert_anon_or_auth" on public.leads;
create policy "leads_insert_anon_or_auth" on public.leads
    for insert to anon, authenticated with check (true);

drop policy if exists "leads_select_own" on public.leads;
create policy "leads_select_own" on public.leads
    for select to authenticated using (created_by = auth.uid());

drop policy if exists "leads_select_admin" on public.leads;
create policy "leads_select_admin" on public.leads
    for select to authenticated using (public.is_admin());

drop policy if exists "leads_update_admin" on public.leads;
create policy "leads_update_admin" on public.leads
    for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads_delete_admin" on public.leads;
create policy "leads_delete_admin" on public.leads
    for delete to authenticated using (public.is_admin());

-- ----- lead_notes (admin only) -----
drop policy if exists "lead_notes_all_admin" on public.lead_notes;
create policy "lead_notes_all_admin" on public.lead_notes
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ----- Patrón reutilizable para tablas admin-only + cliente-lectura-propia -----
-- Companies: admin todo, cliente solo las suyas
drop policy if exists "companies_admin_all" on public.companies;
create policy "companies_admin_all" on public.companies
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "companies_client_select" on public.companies;
create policy "companies_client_select" on public.companies
    for select to authenticated using (id in (select public.user_company_ids()));

-- Contacts
drop policy if exists "contacts_admin_all" on public.contacts;
create policy "contacts_admin_all" on public.contacts
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contacts_client_select" on public.contacts;
create policy "contacts_client_select" on public.contacts
    for select to authenticated using (company_id in (select public.user_company_ids()));

-- client_users
drop policy if exists "client_users_admin_all" on public.client_users;
create policy "client_users_admin_all" on public.client_users
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "client_users_select_own" on public.client_users;
create policy "client_users_select_own" on public.client_users
    for select to authenticated using (user_id = auth.uid());

-- Opportunities (admin only)
drop policy if exists "opportunities_admin_all" on public.opportunities;
create policy "opportunities_admin_all" on public.opportunities
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Projects
drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all" on public.projects
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_client_select" on public.projects;
create policy "projects_client_select" on public.projects
    for select to authenticated using (company_id in (select public.user_company_ids()));

-- Project team (admin)
drop policy if exists "project_team_admin_all" on public.project_team;
create policy "project_team_admin_all" on public.project_team
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Project milestones
drop policy if exists "milestones_admin_all" on public.project_milestones;
create policy "milestones_admin_all" on public.project_milestones
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "milestones_client_select" on public.project_milestones;
create policy "milestones_client_select" on public.project_milestones
    for select to authenticated using (public.user_can_view_project(project_id));

-- Tasks
drop policy if exists "tasks_admin_all" on public.tasks;
create policy "tasks_admin_all" on public.tasks
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tasks_client_select" on public.tasks;
create policy "tasks_client_select" on public.tasks
    for select to authenticated using (
        client_visible = true and public.user_can_view_project(project_id)
    );

-- Time entries (admin only)
drop policy if exists "time_entries_admin_all" on public.time_entries;
create policy "time_entries_admin_all" on public.time_entries
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Deliverables
drop policy if exists "deliverables_admin_all" on public.deliverables;
create policy "deliverables_admin_all" on public.deliverables
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "deliverables_client_select" on public.deliverables;
create policy "deliverables_client_select" on public.deliverables
    for select to authenticated using (
        client_visible = true
        and status = 'published'
        and public.user_can_view_project(project_id)
    );

-- Proposals
drop policy if exists "proposals_admin_all" on public.proposals;
create policy "proposals_admin_all" on public.proposals
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "proposals_client_select" on public.proposals;
create policy "proposals_client_select" on public.proposals
    for select to authenticated using (
        status in ('sent', 'viewed', 'accepted', 'rejected', 'revised')
        and company_id in (select public.user_company_ids())
    );

-- Contracts
drop policy if exists "contracts_admin_all" on public.contracts;
create policy "contracts_admin_all" on public.contracts
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contracts_client_select" on public.contracts;
create policy "contracts_client_select" on public.contracts
    for select to authenticated using (
        status in ('active', 'completed')
        and company_id in (select public.user_company_ids())
    );

-- Activity log
drop policy if exists "activity_admin_all" on public.activity_log;
create policy "activity_admin_all" on public.activity_log
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "activity_client_select" on public.activity_log;
create policy "activity_client_select" on public.activity_log
    for select to authenticated using (
        client_visible = true
        and company_id in (select public.user_company_ids())
    );

-- Catalog / series / invoices / lines / payments / expenses (admin only)
drop policy if exists "catalog_admin_all" on public.catalog_items;
create policy "catalog_admin_all" on public.catalog_items
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "series_admin_all" on public.invoice_series;
create policy "series_admin_all" on public.invoice_series
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "invoices_admin_all" on public.invoices;
create policy "invoices_admin_all" on public.invoices
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Cliente puede ver SUS facturas emitidas/pagadas
drop policy if exists "invoices_client_select" on public.invoices;
create policy "invoices_client_select" on public.invoices
    for select to authenticated using (
        status in ('issued', 'sent', 'viewed', 'paid', 'partial', 'overdue')
        and company_id in (select public.user_company_ids())
    );

drop policy if exists "invoice_lines_admin_all" on public.invoice_lines;
create policy "invoice_lines_admin_all" on public.invoice_lines
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "invoice_lines_client_select" on public.invoice_lines;
create policy "invoice_lines_client_select" on public.invoice_lines
    for select to authenticated using (
        exists (
            select 1 from public.invoices i
            where i.id = invoice_lines.invoice_id
              and i.status in ('issued', 'sent', 'viewed', 'paid', 'partial', 'overdue')
              and i.company_id in (select public.user_company_ids())
        )
    );

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all" on public.payments
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "expenses_admin_all" on public.expenses;
create policy "expenses_admin_all" on public.expenses
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Documents
drop policy if exists "documents_admin_all" on public.documents;
create policy "documents_admin_all" on public.documents
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "documents_client_select" on public.documents;
create policy "documents_client_select" on public.documents
    for select to authenticated using (
        client_visible = true
        and (
            company_id in (select public.user_company_ids())
            or (project_id is not null and public.user_can_view_project(project_id))
        )
    );

-- Org settings: admin puede todo, cualquier autenticado puede leer (para mostrar emisor)
drop policy if exists "org_settings_admin_all" on public.org_settings;
create policy "org_settings_admin_all" on public.org_settings
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "org_settings_select_auth" on public.org_settings;
create policy "org_settings_select_auth" on public.org_settings
    for select to authenticated using (true);

-- =============================================================================
-- Seeds mínimos iniciales
-- =============================================================================

-- Organización (Padrón IA) — solo si no existe
insert into public.org_settings (legal_name, commercial_name, email, website, default_vat, default_irpf, default_payment_terms)
select 'Padrón IA', 'Padrón IA', 'hola@padronia.com', 'https://padronia.com', 21, 0, '30 días'
where not exists (select 1 from public.org_settings);

-- Serie de facturación por defecto para el año actual
insert into public.invoice_series (code, name, prefix, next_number, year, active)
select 'A', 'Serie A (principal)', 'FAC', 1, extract(year from now())::int, true
where not exists (
    select 1 from public.invoice_series
    where code = 'A' and year = extract(year from now())::int
);

-- =============================================================================
-- NOTAS DE MANTENIMIENTO
-- =============================================================================
-- 1. Para asignar un usuario como admin después de crearlo en Auth:
--      update public.profiles set role = 'admin' where id = '<USER_UUID>';
--
-- 2. Si compartiste la service_role key en algún chat o repo, rotala ya desde
--    Supabase Dashboard > Settings > API.
--
-- 3. El flujo de invitar a un cliente es:
--      a) Admin crea la company y el contact en la BD
--      b) Admin invita al usuario a Supabase Auth (magic link)
--      c) Cuando el usuario acepta, admin crea el client_users vinculando
--         user_id + company_id + contact_id
-- =============================================================================
