-- KinSignal initial tenant-isolated storage. Apply ONLY in a dedicated KinSignal project.
-- Unreviewed migration: DO NOT apply to other applications' production databases.
create table if not exists public.ks_cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(title) between 1 and 120),
  category text not null check (category in ('message','account','payment','privacy','recovery')),
  country_code text,
  case_payload jsonb not null default '{}'::jsonb,
  version integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ks_cases_owner_updated_idx on public.ks_cases(owner_id,updated_at desc);
alter table public.ks_cases enable row level security;
revoke all on public.ks_cases from public, anon;
grant select,insert,update,delete on public.ks_cases to authenticated;
create policy "ks_cases_owner_select" on public.ks_cases for select to authenticated using ((select auth.uid()) = owner_id);
create policy "ks_cases_owner_insert" on public.ks_cases for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "ks_cases_owner_update" on public.ks_cases for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "ks_cases_owner_delete" on public.ks_cases for delete to authenticated using ((select auth.uid()) = owner_id);

create table if not exists public.ks_case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.ks_cases(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  event_payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index if not exists ks_case_events_case_idx on public.ks_case_events(case_id,occurred_at);
alter table public.ks_case_events enable row level security;
revoke all on public.ks_case_events from public, anon;
grant select,insert on public.ks_case_events to authenticated;
create policy "ks_events_owner_select" on public.ks_case_events for select to authenticated
  using ((select auth.uid())=owner_id and exists(select 1 from public.ks_cases c where c.id=case_id and c.owner_id=(select auth.uid())));
create policy "ks_events_owner_insert" on public.ks_case_events for insert to authenticated
  with check ((select auth.uid())=owner_id and exists(select 1 from public.ks_cases c where c.id=case_id and c.owner_id=(select auth.uid())));
-- Events are append-only: deliberately no update/delete policies.

create table if not exists public.ks_contact_invitations (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.ks_cases(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  invitation_token_hash text not null unique,
  recipient_hint text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  accepted_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  constraint ks_invitations_expiry check (expires_at > created_at)
);
alter table public.ks_contact_invitations enable row level security;
revoke all on public.ks_contact_invitations from public, anon;
grant select,insert,update,delete on public.ks_contact_invitations to authenticated;
create policy "ks_invitation_owner_select" on public.ks_contact_invitations for select to authenticated
 using ((select auth.uid())=owner_id and exists(select 1 from public.ks_cases c where c.id=case_id and c.owner_id=(select auth.uid())));
create policy "ks_invitation_owner_insert" on public.ks_contact_invitations for insert to authenticated
 with check ((select auth.uid())=owner_id and exists(select 1 from public.ks_cases c where c.id=case_id and c.owner_id=(select auth.uid())));
create policy "ks_invitation_owner_update" on public.ks_contact_invitations for update to authenticated
 using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
create policy "ks_invitation_owner_delete" on public.ks_contact_invitations for delete to authenticated using ((select auth.uid())=owner_id);
-- No recipient read/acceptance policy yet. The invitation workflow is disabled
-- until secure server-side redemption and narrow case-grant policies are implemented.

create table if not exists public.ks_content_resources (
 id uuid primary key default gen_random_uuid(),
 country_code text not null,
 category text not null,
 title text not null,
 official_url text not null,
 source_url text not null,
 source_verified_at timestamptz,
 review_status text not null default 'NEEDS_REVIEW' check (review_status in ('NEEDS_REVIEW','VERIFIED_SOURCE','STALE','REMOVED')),
 reviewer_id uuid references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.ks_content_resources enable row level security;
revoke all on public.ks_content_resources from public, anon, authenticated;
grant select on public.ks_content_resources to anon,authenticated;
create policy "ks_public_reviewed_resources" on public.ks_content_resources for select
 to anon,authenticated using (review_status='VERIFIED_SOURCE' and source_verified_at is not null);
-- No public write policy: privileged ingestion/review requires separately built controls.

-- Important: case_payload remains only server/database-side for authenticated users;
-- no public sharing, evidence buckets or realtime exposure permitted by this migration.
