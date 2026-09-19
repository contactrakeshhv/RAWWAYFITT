-- RAWWAYFITT Supabase setup
-- Run this AFTER your existing feedback table SQL.
-- It is safe to run repeatedly.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admin_users enable row level security;

grant select on public.admin_users to authenticated;

drop policy if exists "Admins can see their own admin record" on public.admin_users;
create policy "Admins can see their own admin record"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

-- Replace the earlier feedback policies with the secure versions below.
drop policy if exists "Anyone can submit feedback" on public.feedback;
drop policy if exists "Anyone can view approved feedback" on public.feedback;
drop policy if exists "Admins can view all feedback" on public.feedback;
drop policy if exists "Admins can update feedback" on public.feedback;

create policy "Anyone can submit feedback"
on public.feedback
for insert
to anon, authenticated
with check (
  status = 'pending'
  and permission = true
);

create policy "Anyone can view approved feedback"
on public.feedback
for select
to anon, authenticated
using (
  status = 'approved'
);

create policy "Admins can view all feedback"
on public.feedback
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

create policy "Admins can update feedback"
on public.feedback
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

grant select, insert, update on public.feedback to anon, authenticated;

-- IMPORTANT:
-- After creating your admin account in feedback-admin.html,
-- copy your displayed UUID and run:
--
-- insert into public.admin_users (user_id)
-- values ('YOUR-SUPABASE-AUTH-USER-UUID');
