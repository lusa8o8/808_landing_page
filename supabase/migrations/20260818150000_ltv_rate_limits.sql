create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table if not exists private.ltv_rate_limits (
  quota_key text not null,
  window_started_at timestamptz not null,
  window_seconds integer not null check (window_seconds > 0),
  request_count integer not null check (request_count > 0),
  expires_at timestamptz not null,
  primary key (quota_key, window_started_at, window_seconds)
);

alter table private.ltv_rate_limits enable row level security;

create or replace function public.consume_ltv_rate_limit(
  p_client_hash text,
  p_client_burst_limit integer default 20,
  p_client_burst_seconds integer default 600,
  p_client_daily_limit integer default 60,
  p_global_daily_limit integer default 500
)
returns table (
  allowed boolean,
  retry_after_seconds integer,
  scope text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window_start timestamptz;
  v_window_end timestamptz;
  v_count integer;
begin
  if p_client_hash is null or length(p_client_hash) <> 64 then
    raise exception 'A SHA-256 client hash is required';
  end if;

  if p_client_burst_limit <= 0 or p_client_burst_seconds <= 0
     or p_client_daily_limit <= 0 or p_global_daily_limit <= 0 then
    return query select false, 86400, 'service_disabled'::text;
    return;
  end if;

  if random() < 0.01 then
    delete from private.ltv_rate_limits where expires_at < v_now;
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from v_now) / p_client_burst_seconds) * p_client_burst_seconds
  );
  v_window_end := v_window_start + make_interval(secs => p_client_burst_seconds);

  insert into private.ltv_rate_limits (
    quota_key, window_started_at, window_seconds, request_count, expires_at
  ) values (
    'client:burst:' || p_client_hash,
    v_window_start,
    p_client_burst_seconds,
    1,
    v_window_end + interval '48 hours'
  )
  on conflict (quota_key, window_started_at, window_seconds)
  do update set request_count = private.ltv_rate_limits.request_count + 1
  returning request_count into v_count;

  if v_count > p_client_burst_limit then
    return query select false,
      greatest(1, ceil(extract(epoch from (v_window_end - v_now)))::integer),
      'client_burst'::text;
    return;
  end if;

  v_window_start := date_trunc('day', v_now at time zone 'UTC') at time zone 'UTC';
  v_window_end := v_window_start + interval '1 day';

  insert into private.ltv_rate_limits (
    quota_key, window_started_at, window_seconds, request_count, expires_at
  ) values (
    'client:daily:' || p_client_hash,
    v_window_start,
    86400,
    1,
    v_window_end + interval '48 hours'
  )
  on conflict (quota_key, window_started_at, window_seconds)
  do update set request_count = private.ltv_rate_limits.request_count + 1
  returning request_count into v_count;

  if v_count > p_client_daily_limit then
    return query select false,
      greatest(1, ceil(extract(epoch from (v_window_end - v_now)))::integer),
      'client_daily'::text;
    return;
  end if;

  insert into private.ltv_rate_limits (
    quota_key, window_started_at, window_seconds, request_count, expires_at
  ) values (
    'global:daily',
    v_window_start,
    86400,
    1,
    v_window_end + interval '48 hours'
  )
  on conflict (quota_key, window_started_at, window_seconds)
  do update set request_count = private.ltv_rate_limits.request_count + 1
  returning request_count into v_count;

  if v_count > p_global_daily_limit then
    return query select false,
      greatest(1, ceil(extract(epoch from (v_window_end - v_now)))::integer),
      'global_daily'::text;
    return;
  end if;

  return query select true, 0, 'allowed'::text;
end;
$$;

revoke all on function public.consume_ltv_rate_limit(text, integer, integer, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_ltv_rate_limit(text, integer, integer, integer, integer)
  to service_role;

comment on table private.ltv_rate_limits is
  'Short-lived salted identifiers and counters for the public LTV assistant.';
comment on function public.consume_ltv_rate_limit(text, integer, integer, integer, integer) is
  'Atomically enforces client burst, client daily, and service daily quotas.';
