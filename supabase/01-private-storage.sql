-- Step 1 only: private storage. This does not enable online submission.
begin;

create table if not exists public.aal_facilitators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.aal_collections (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(label) between 1 and 120),
  code_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  max_submissions integer not null check (max_submissions between 1 and 500),
  submissions integer not null default 0 check (submissions >= 0),
  closed boolean not null default false
);

create table if not exists public.aal_sessions (
  id uuid primary key,
  collection_id uuid not null references public.aal_collections(id),
  collection_label text not null,
  participant_id text not null check (participant_id ~ '^[A-Za-z0-9_-]{1,64}$'),
  received_at timestamptz not null default now(),
  reflection_status text not null check (reflection_status in ('submitted', 'expired')),
  consent_version text not null,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  payload_hash text not null
);

create index if not exists aal_sessions_received_idx
  on public.aal_sessions (received_at desc, id desc);

alter table public.aal_facilitators enable row level security;
alter table public.aal_collections enable row level security;
alter table public.aal_sessions enable row level security;

revoke all on table public.aal_facilitators,
  public.aal_collections, public.aal_sessions
  from public, anon, authenticated;

commit;

select 'Private storage created. Online submission is not enabled yet.' as result;
