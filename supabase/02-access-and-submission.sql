-- Run after 01-private-storage.sql. No responses are deleted by this script.
begin;

create or replace function public.aal_is_facilitator()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.aal_facilitators where user_id = (select auth.uid())
  );
$$;
revoke all on function public.aal_is_facilitator() from public, anon, authenticated;
grant execute on function public.aal_is_facilitator() to authenticated;

-- Only approved signed-in accounts can read sessions or group metadata.
drop policy if exists aal_facilitator_read on public.aal_sessions;
create policy aal_facilitator_read on public.aal_sessions
  for select to authenticated using ((select public.aal_is_facilitator()));
drop policy if exists aal_facilitator_read on public.aal_collections;
create policy aal_facilitator_read on public.aal_collections
  for select to authenticated using ((select public.aal_is_facilitator()));
revoke all on table public.aal_facilitators, public.aal_sessions,
  public.aal_collections from public, anon, authenticated;
grant select on public.aal_sessions to authenticated;
grant select (id, label, created_at, expires_at, max_submissions, submissions, closed)
  on public.aal_collections to authenticated;

create or replace function public.aal_create_collection(
  p_label text, p_limit integer default 100, p_days integer default 7
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_code text := replace(gen_random_uuid()::text, '-', '');
  v_group public.aal_collections%rowtype;
begin
  if not public.aal_is_facilitator() then
    raise exception 'AAL: Facilitator access required.' using errcode = '42501';
  end if;
  if p_label is null or char_length(trim(p_label)) not between 1 and 120
    or p_limit is null or p_limit not between 1 and 500
    or p_days is null or p_days not between 1 and 30 then
    raise exception 'AAL: Enter a group label and valid collection limits.';
  end if;
  insert into public.aal_collections(label, code_hash, expires_at, max_submissions)
  values (trim(p_label), encode(sha256(convert_to(v_code, 'UTF8')), 'hex'),
    now() + make_interval(days => p_days), p_limit)
  returning * into v_group;
  return jsonb_build_object('id', v_group.id, 'code', v_code,
    'expires_at', v_group.expires_at, 'label', v_group.label);
end;
$$;

create or replace function public.aal_close_collection(p_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
begin
  if not public.aal_is_facilitator() then
    raise exception 'AAL: Facilitator access required.' using errcode = '42501';
  end if;
  update public.aal_collections set closed = true where id = p_id;
  if not found then raise exception 'AAL: Collection group not found.'; end if;
  return jsonb_build_object('closed', true);
end;
$$;

create or replace function public.aal_submit_session(
  p_id uuid, p_code text, p_payload jsonb, p_consent_version text
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_group public.aal_collections%rowtype;
  v_existing public.aal_sessions%rowtype;
  v_state jsonb;
  v_record jsonb;
  v_hash text;
  v_received timestamptz;
  v_index integer;
begin
  if p_id is null or p_consent_version is distinct from 'session-sharing-v1'
    or p_code is null or p_code !~ '^[a-f0-9]{32}$' then
    raise exception 'AAL: A valid collection code and sharing agreement are required.';
  end if;
  if p_payload is null or jsonb_typeof(p_payload) is distinct from 'object'
    or octet_length(p_payload::text) > 300000 then
    raise exception 'AAL: Invalid or oversized session. Keep your JSON copy.';
  end if;
  v_state := p_payload->'caseStudies';
  if (p_payload->>'schemaVersion') is distinct from '3'
    or (p_payload->>'participantId') is null
    or (p_payload->>'participantId') !~ '^[A-Za-z0-9_-]{1,64}$'
    or (v_state->>'caseIndex') is distinct from '3'
    or coalesce(v_state->>'status', '') not in ('submitted', 'expired')
    or jsonb_typeof(v_state->'records') is distinct from 'array'
    or jsonb_typeof(v_state->'reflection') is distinct from 'array'
    or coalesce(v_state->>'confidence', '') !~ '^(10|[1-9])$' then
    raise exception 'AAL: Finish the journey before submitting this session.';
  end if;
  if jsonb_array_length(v_state->'records') <> 3
    or jsonb_array_length(v_state->'reflection') <> 3 then
    raise exception 'AAL: The session is missing case or reflection records.';
  end if;
  for v_index in 0..2 loop
    v_record := v_state->'records'->v_index;
    if (v_record->>'caseIndex') is distinct from v_index::text
      or coalesce(v_record->>'status', '') not in ('submitted', 'expired')
      or jsonb_typeof(v_record->'decisions') is distinct from 'array'
      or jsonb_typeof(v_state->'reflection'->v_index) is distinct from 'string' then
      raise exception 'AAL: Invalid case or reflection record. Keep your JSON copy.';
    end if;
    if jsonb_array_length(v_record->'decisions') > 4
      or (v_record->>'status' = 'submitted' and jsonb_array_length(v_record->'decisions') <> 4)
      or char_length(v_state->'reflection'->>v_index) > 3000 then
      raise exception 'AAL: Invalid decision count or reflection length.';
    end if;
  end loop;
  -- Lock the group to enforce its limit even when participants submit together.
  select * into v_group from public.aal_collections
    where code_hash = encode(sha256(convert_to(p_code, 'UTF8')), 'hex') for update;
  if not found then raise exception 'AAL: Collection code not recognised.'; end if;
  v_hash := encode(sha256(convert_to(p_payload::text, 'UTF8')), 'hex');
  select * into v_existing from public.aal_sessions where id = p_id;
  if found then
    if v_existing.collection_id = v_group.id and v_existing.payload_hash = v_hash
      and v_existing.consent_version = p_consent_version then
      -- Retry receipts remain available after a group expires or fills up.
      return jsonb_build_object('id', v_existing.id, 'received_at', v_existing.received_at);
    end if;
    raise exception 'AAL: This receipt ID belongs to a different submission. Contact the facilitator.';
  end if;
  if v_group.closed or v_group.expires_at <= now()
    or v_group.submissions >= v_group.max_submissions then
    raise exception 'AAL: This collection code is closed, expired or full. Ask your facilitator for a new code.';
  end if;
  insert into public.aal_sessions(id, collection_id, collection_label,
    participant_id, reflection_status, consent_version, payload, payload_hash)
  values (p_id, v_group.id, v_group.label, p_payload->>'participantId',
    v_state->>'status', p_consent_version, p_payload, v_hash)
  returning received_at into v_received;
  update public.aal_collections set submissions = submissions + 1 where id = v_group.id;
  return jsonb_build_object('id', p_id, 'received_at', v_received);
end;
$$;

revoke all on function public.aal_create_collection(text, integer, integer)
  from public, anon, authenticated;
revoke all on function public.aal_close_collection(uuid)
  from public, anon, authenticated;
revoke all on function public.aal_submit_session(uuid, text, jsonb, text)
  from public, anon, authenticated;
grant execute on function public.aal_create_collection(text, integer, integer) to authenticated;
grant execute on function public.aal_close_collection(uuid) to authenticated;
grant execute on function public.aal_submit_session(uuid, text, jsonb, text) to anon, authenticated;

commit;
select 'Session access rules installed.' as result;
