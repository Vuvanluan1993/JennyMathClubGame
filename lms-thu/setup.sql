-- =====================================================================
--  JENNY LMS – BẢN THỬ (nhiều trung tâm)
--  Dán TOÀN BỘ file này vào Supabase → SQL Editor → Run.
--  Chạy lại nhiều lần cũng được: bảng cũ và dữ liệu được giữ nguyên.
--
--  Vai trò:
--    • Quản trị hệ thống (anh): thấy mọi trung tâm, tạo trung tâm, kho bài học chung.
--    • Quản trị trung tâm: thêm/bớt giáo viên, lớp, học sinh, lịch học của trung tâm mình.
--    • Giáo viên: lớp mình dạy: học sinh, giao bài, lịch học, điểm danh, kết quả.
--    • Học sinh: vào bằng mã lớp + tên + mã bí mật (không cần email).
--
--  Bảo vệ dữ liệu: mọi bảng bật Row Level Security và KHÔNG có policy, nên
--  trình duyệt không đọc/ghi thẳng vào bảng. Trình duyệt chỉ gọi các hàm dưới
--  đây; mỗi hàm tự kiểm tra quyền của người gọi.
-- =====================================================================

create extension if not exists pgcrypto;

-- ============ BẢNG ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.platform_admins (
  user_id uuid primary key references public.profiles(id) on delete cascade
);
create table if not exists public.centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  seats int not null default 50,                       -- số học sinh tối đa (gói đã mua)
  created_at timestamptz not null default now()
);
create table if not exists public.members (
  center_id uuid not null references public.centers(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'teacher')),
  primary key (center_id, user_id)
);
create table if not exists public.invites (
  center_id uuid not null references public.centers(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'teacher')),
  created_at timestamptz not null default now(),
  primary key (center_id, email)
);
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  name text not null,
  level text not null check (level in ('mn', 'th', 'thcs')),
  code text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  name text not null,
  pin text not null,
  student_code text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.sessions (
  token uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '60 days'
);
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  center_id uuid references public.centers(id) on delete cascade,     -- null = kho chung của hệ thống
  title text not null,
  level text not null default 'mn',
  description text not null default '',
  items jsonb not null default '[]'::jsonb,           -- [{"kind":"game","game":"mam-non","config":{"isle":2,"lv":3},"title":"…"}, {"kind":"link","url":"…","title":"…"}]
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  kind text not null default 'game' check (kind in ('game', 'link')),
  game text not null default '',
  config jsonb not null default '{}'::jsonb,
  url text not null default '',
  note text not null default '',
  due date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  stars int not null check (stars between 0 and 3),
  correct int not null default 0,
  total int not null default 0,
  seconds int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.answers (
  id bigint generated always as identity primary key,
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  skill text not null,
  correct boolean not null,
  tries int not null default 1,
  seconds int not null default 0
);
create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  minutes int not null default 60,
  link text not null default '',                       -- link Google Meet / Zoom
  created_at timestamptz not null default now()
);
create table if not exists public.attendance (
  session_id uuid not null references public.class_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null check (status in ('present', 'late', 'absent', 'excused')),
  joined_at timestamptz,
  primary key (session_id, student_id)
);
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  body text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.codes (                -- mã kích hoạt: mỗi mã cộng thêm chỗ học sinh cho trung tâm
  code text primary key,
  seats int not null check (seats > 0),
  center_id uuid references public.centers(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  user_id uuid,
  center_id uuid,
  action text not null,
  detail jsonb not null default '{}'::jsonb
);

create index if not exists classes_center_idx on public.classes(center_id);
create index if not exists students_class_idx on public.students(class_id);
create index if not exists assignments_class_idx on public.assignments(class_id);
create index if not exists attempts_assign_idx on public.attempts(assignment_id, student_id);
create index if not exists answers_attempt_idx on public.answers(attempt_id);
create index if not exists csess_class_idx on public.class_sessions(class_id, starts_at);

do $$ declare t text; begin
  foreach t in array array['profiles','platform_admins','centers','members','invites','classes','students','sessions','lessons','assignments','attempts','answers','class_sessions','attendance','notices','codes','audit_log'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ============ TIỆN ÍCH & KIỂM TRA QUYỀN ============
create or replace function public._rand(n int, alphabet text)
returns text language sql volatile set search_path = public as $$
  select string_agg(substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1), '') from generate_series(1, n);
$$;
create or replace function public._new_pin(p_level text)
returns text language sql volatile set search_path = public as $$
  select case when p_level = 'mn'
    then (select string_agg(x, '') from (select x from unnest(array['a','b','c','d','e','f']) x order by random() limit 3) s)
    else lpad((floor(random() * 10000))::int::text, 4, '0') end;
$$;
create or replace function public._log(p_center uuid, p_action text, p_detail jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = public as $$
  insert into audit_log(user_id, center_id, action, detail) values (auth.uid(), p_center, p_action, coalesce(p_detail, '{}'::jsonb));
$$;

-- người đang đăng nhập (tạo hồ sơ + nhận lời mời ở lần đầu)
create or replace function public._me()
returns uuid language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); em text;
begin
  if uid is null then raise exception 'Chưa đăng nhập' using errcode = '28000'; end if;
  select lower(email) into em from auth.users where id = uid;
  insert into profiles(id, email) values (uid, coalesce(em, '')) on conflict (id) do update set email = excluded.email;
  insert into members(center_id, user_id, role)
    select i.center_id, uid, i.role from invites i where lower(i.email) = em
    on conflict (center_id, user_id) do nothing;
  delete from invites where lower(email) = em;
  return uid;
end $$;
create or replace function public._is_super(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from platform_admins where user_id = uid);
$$;
-- quyền trên trung tâm: 'super' | 'admin' | 'teacher' | null
create or replace function public._center_role(p_center uuid)
returns text language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); r text;
begin
  if _is_super(uid) then return 'super'; end if;
  select role into r from members where center_id = p_center and user_id = uid;
  return r;
end $$;
create or replace function public._need_center_admin(p_center uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce(_center_role(p_center), '') not in ('super', 'admin') then raise exception 'Chỉ quản trị trung tâm được làm việc này' using errcode = '42501'; end if;
end $$;
-- quyền trên lớp: GV của lớp, quản trị trung tâm, quản trị hệ thống
create or replace function public._class(p_class uuid)
returns public.classes language plpgsql security definer set search_path = public as $$
declare c classes; r text;
begin
  select * into c from classes where id = p_class;
  if not found then raise exception 'Không tìm thấy lớp' using errcode = '42501'; end if;
  r := _center_role(c.center_id);
  if r in ('super', 'admin') or (r = 'teacher' and c.teacher_id = auth.uid()) then return c; end if;
  raise exception 'Bạn không phụ trách lớp này' using errcode = '42501';
end $$;

-- ============ TÀI KHOẢN ============
create or replace function public.me()
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := _me(); sup boolean := _is_super(uid);
begin
  return json_build_object(
    'id', uid,
    'name', (select name from profiles where id = uid),
    'email', (select email from profiles where id = uid),
    'super', sup,
    'super_claimable', not exists (select 1 from platform_admins),
    'centers', (select coalesce(json_agg(json_build_object('id', c.id, 'name', c.name, 'role', x.role) order by c.name), '[]'::json)
                from (select center_id, role from members where user_id = uid and not sup
                      union all select id, 'super' from centers where sup) x join centers c on c.id = x.center_id)
  );
end $$;
create or replace function public.set_name(p_name text)
returns void language plpgsql security definer set search_path = public as $$
begin perform _me(); update profiles set name = left(trim(p_name), 60) where id = auth.uid(); end $$;
-- người đầu tiên gọi hàm này trở thành quản trị hệ thống (chỉ được 1 lần)
create or replace function public.claim_super()
returns boolean language plpgsql security definer set search_path = public as $$
declare uid uuid := _me();
begin
  lock table platform_admins in exclusive mode;
  if exists (select 1 from platform_admins) then return false; end if;
  insert into platform_admins(user_id) values (uid);
  perform _log(null, 'claim_super');
  return true;
end $$;

-- ============ QUẢN TRỊ HỆ THỐNG ============
create or replace function public.a_centers()
returns json language plpgsql security definer set search_path = public as $$
begin
  if not _is_super(_me()) then raise exception 'Chỉ quản trị hệ thống' using errcode = '42501'; end if;
  return (select coalesce(json_agg(json_build_object('id', c.id, 'name', c.name, 'seats', c.seats,
      'teachers', (select count(*) from members m where m.center_id = c.id),
      'classes', (select count(*) from classes k where k.center_id = c.id),
      'students', (select count(*) from students s where s.center_id = c.id and s.active)) order by c.created_at), '[]'::json) from centers c);
end $$;
create or replace function public.a_create_center(p_name text, p_seats int, p_admin_email text)
returns json language plpgsql security definer set search_path = public as $$
declare c centers;
begin
  if not _is_super(_me()) then raise exception 'Chỉ quản trị hệ thống' using errcode = '42501'; end if;
  if coalesce(trim(p_name), '') = '' then raise exception 'Cần tên trung tâm'; end if;
  insert into centers(name, seats) values (left(trim(p_name), 80), greatest(1, coalesce(p_seats, 50))) returning * into c;
  if coalesce(trim(p_admin_email), '') <> '' then perform c_invite(c.id, p_admin_email, 'admin'); end if;
  perform _log(c.id, 'create_center', json_build_object('name', c.name)::jsonb);
  return row_to_json(c);
end $$;
create or replace function public.a_update_center(p_center uuid, p_name text, p_seats int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not _is_super(_me()) then raise exception 'Chỉ quản trị hệ thống' using errcode = '42501'; end if;
  update centers set name = coalesce(nullif(trim(p_name), ''), name), seats = coalesce(p_seats, seats) where id = p_center;
end $$;

-- ============ QUẢN TRỊ TRUNG TÂM ============
create or replace function public.c_center(p_center uuid)
returns json language plpgsql security definer set search_path = public as $$
declare r text := _center_role(p_center); c centers;
begin
  if r is null then raise exception 'Bạn không thuộc trung tâm này' using errcode = '42501'; end if;
  select * into c from centers where id = p_center;
  return json_build_object(
    'center', json_build_object('id', c.id, 'name', c.name, 'seats', c.seats, 'used', (select count(*) from students s where s.center_id = c.id and s.active)),
    'role', r,
    'members', (select coalesce(json_agg(json_build_object('id', p.id, 'name', p.name, 'email', p.email, 'role', m.role) order by m.role, p.name), '[]'::json)
                from members m join profiles p on p.id = m.user_id where m.center_id = c.id),
    'invites', (select coalesce(json_agg(json_build_object('email', i.email, 'role', i.role)), '[]'::json) from invites i where i.center_id = c.id),
    'classes', (select coalesce(json_agg(json_build_object('id', k.id, 'name', k.name, 'level', k.level, 'code', k.code,
                  'teacher_id', k.teacher_id, 'teacher', (select coalesce(nullif(p.name, ''), p.email) from profiles p where p.id = k.teacher_id),
                  'students', (select count(*) from students s where s.class_id = k.id and s.active),
                  'mine', k.teacher_id = auth.uid()) order by k.name), '[]'::json)
                from classes k where k.center_id = c.id and (r in ('super', 'admin') or k.teacher_id = auth.uid())),
    'unassigned', (select coalesce(json_agg(json_build_object('id', s.id, 'name', s.name, 'code', s.student_code) order by s.name), '[]'::json)
                   from students s where s.center_id = c.id and s.class_id is null and s.active and r in ('super', 'admin'))
  );
end $$;
create or replace function public.c_invite(p_center uuid, p_email text, p_role text)
returns text language plpgsql security definer set search_path = public as $$
declare em text := lower(trim(p_email)); uid uuid;
begin
  perform _need_center_admin(p_center);
  if em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Email không hợp lệ'; end if;
  if p_role not in ('admin', 'teacher') then raise exception 'Vai trò không hợp lệ'; end if;
  select id into uid from auth.users where lower(email) = em;
  if uid is not null then
    insert into profiles(id, email) values (uid, em) on conflict (id) do nothing;
    insert into members(center_id, user_id, role) values (p_center, uid, p_role)
      on conflict (center_id, user_id) do update set role = excluded.role;
    perform _log(p_center, 'add_member', json_build_object('email', em, 'role', p_role)::jsonb);
    return 'added';
  end if;
  insert into invites(center_id, email, role) values (p_center, em, p_role) on conflict (center_id, email) do update set role = excluded.role;
  perform _log(p_center, 'invite', json_build_object('email', em, 'role', p_role)::jsonb);
  return 'invited';
end $$;
create or replace function public.c_remove_member(p_center uuid, p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform _need_center_admin(p_center);
  if p_user = auth.uid() then raise exception 'Không thể tự xoá chính mình'; end if;
  update classes set teacher_id = null where center_id = p_center and teacher_id = p_user;
  delete from members where center_id = p_center and user_id = p_user;
  perform _log(p_center, 'remove_member', json_build_object('user', p_user)::jsonb);
end $$;
create or replace function public.c_cancel_invite(p_center uuid, p_email text)
returns void language plpgsql security definer set search_path = public as $$
begin perform _need_center_admin(p_center); delete from invites where center_id = p_center and email = lower(trim(p_email)); end $$;

create or replace function public.c_create_class(p_center uuid, p_name text, p_level text, p_teacher uuid)
returns json language plpgsql security definer set search_path = public as $$
declare r text := _center_role(p_center); v text; k classes; t uuid := p_teacher;
begin
  if r is null then raise exception 'Bạn không thuộc trung tâm này' using errcode = '42501'; end if;
  if r = 'teacher' then t := auth.uid(); end if;                 -- giáo viên tự tạo lớp của mình
  if t is not null and not exists (select 1 from members where center_id = p_center and user_id = t) and not _is_super(t) then
    raise exception 'Giáo viên không thuộc trung tâm'; end if;
  if coalesce(trim(p_name), '') = '' then raise exception 'Cần tên lớp'; end if;
  if p_level not in ('mn', 'th', 'thcs') then raise exception 'Cấp học không hợp lệ'; end if;
  loop v := upper(p_level) || '-' || _rand(4, 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'); exit when not exists (select 1 from classes where code = v); end loop;
  insert into classes(center_id, teacher_id, name, level, code) values (p_center, t, left(trim(p_name), 60), p_level, v) returning * into k;
  perform _log(p_center, 'create_class', json_build_object('name', k.name)::jsonb);
  return row_to_json(k);
end $$;
create or replace function public.c_update_class(p_class uuid, p_name text, p_teacher uuid)
returns void language plpgsql security definer set search_path = public as $$
declare k classes;
begin
  select * into k from classes where id = p_class;
  if not found then raise exception 'Không tìm thấy lớp'; end if;
  perform _need_center_admin(k.center_id);
  if p_teacher is not null and not exists (select 1 from members where center_id = k.center_id and user_id = p_teacher) then raise exception 'Giáo viên không thuộc trung tâm'; end if;
  update classes set name = coalesce(nullif(trim(p_name), ''), name), teacher_id = p_teacher where id = p_class;
  perform _log(k.center_id, 'update_class', json_build_object('class', p_class)::jsonb);
end $$;
create or replace function public.c_delete_class(p_class uuid)
returns void language plpgsql security definer set search_path = public as $$
declare k classes;
begin
  select * into k from classes where id = p_class;
  if not found then return; end if;
  perform _need_center_admin(k.center_id);
  delete from classes where id = p_class;               -- học sinh của lớp chuyển thành "chưa xếp lớp"
  perform _log(k.center_id, 'delete_class', json_build_object('name', k.name)::jsonb);
end $$;
create or replace function public.c_log(p_center uuid)
returns json language plpgsql security definer set search_path = public as $$
begin
  perform _need_center_admin(p_center);
  return (select coalesce(json_agg(json_build_object('at', l.at, 'who', (select coalesce(nullif(p.name, ''), p.email) from profiles p where p.id = l.user_id), 'action', l.action, 'detail', l.detail) order by l.at desc), '[]'::json)
          from (select * from audit_log where center_id = p_center and action <> 's_login_fail' order by at desc limit 100) l);
end $$;

-- ============ LỚP (giáo viên của lớp hoặc quản trị) ============
create or replace function public.k_class(p_class uuid)
returns json language plpgsql security definer set search_path = public as $$
declare k classes := _class(p_class);
begin
  return json_build_object(
    'class', json_build_object('id', k.id, 'name', k.name, 'level', k.level, 'code', k.code, 'center_id', k.center_id,
       'teacher', (select coalesce(nullif(p.name, ''), p.email) from profiles p where p.id = k.teacher_id)),
    'role', _center_role(k.center_id),
    'students', (select coalesce(json_agg(json_build_object('id', s.id, 'name', s.name, 'pin', s.pin, 'code', s.student_code) order by s.name), '[]'::json)
                 from students s where s.class_id = k.id and s.active),
    'assignments', (select coalesce(json_agg(json_build_object('id', a.id, 'title', a.title, 'kind', a.kind, 'game', a.game, 'config', a.config, 'url', a.url,
                      'note', a.note, 'due', a.due, 'created_at', a.created_at,
                      'done', (select count(distinct t.student_id) from attempts t where t.assignment_id = a.id)) order by a.created_at desc), '[]'::json)
                    from assignments a where a.class_id = k.id),
    'sessions', (select coalesce(json_agg(json_build_object('id', x.id, 'title', x.title, 'starts_at', x.starts_at, 'minutes', x.minutes, 'link', x.link,
                    'att', (select coalesce(json_agg(json_build_object('s', at.student_id, 'status', at.status, 'joined_at', at.joined_at)), '[]'::json) from attendance at where at.session_id = x.id))
                  order by x.starts_at desc), '[]'::json)
                 from class_sessions x where x.class_id = k.id),
    'best', (select coalesce(json_agg(json_build_object('s', y.student_id, 'a', y.assignment_id, 'stars', y.stars, 'n', y.n)), '[]'::json)
             from (select t.student_id, t.assignment_id, max(t.stars) stars, count(*) n from attempts t join assignments a on a.id = t.assignment_id
                   where a.class_id = k.id group by 1, 2) y),
    'skills', (select coalesce(json_agg(json_build_object('s', z.student_id, 'skill', z.skill, 'ok', z.ok, 'n', z.n)), '[]'::json)
               from (select t.student_id, an.skill, sum(case when an.correct then 1 else 0 end) ok, count(*) n
                     from answers an join attempts t on t.id = an.attempt_id join assignments a on a.id = t.assignment_id
                     where a.class_id = k.id group by 1, 2) z),
    'notices', (select coalesce(json_agg(json_build_object('id', n.id, 'body', n.body, 'at', n.created_at) order by n.created_at desc), '[]'::json)
                from (select * from notices where class_id = k.id order by created_at desc limit 20) n),
    'other_classes', (select coalesce(json_agg(json_build_object('id', o.id, 'name', o.name) order by o.name), '[]'::json)
                      from classes o where o.center_id = k.center_id and o.id <> k.id)
  );
end $$;
create or replace function public.k_add_students(p_class uuid, p_names text[])
returns json language plpgsql security definer set search_path = public as $$
declare k classes := _class(p_class); n text; v text; added int := 0; cap int; used int;
begin
  select seats into cap from centers where id = k.center_id;
  select count(*) into used from students where center_id = k.center_id and active;
  foreach n in array p_names loop
    n := left(trim(n), 40);
    continue when n = '';
    if used >= cap then raise exception 'Trung tâm đã dùng hết % chỗ học sinh của gói. Liên hệ quản trị để mở thêm.', cap; end if;
    loop v := 'JN-' || _rand(5, '0123456789'); exit when not exists (select 1 from students where student_code = v); end loop;
    insert into students(center_id, class_id, name, pin, student_code) values (k.center_id, k.id, n, _new_pin(k.level), v);
    added := added + 1; used := used + 1;
  end loop;
  perform _log(k.center_id, 'add_students', json_build_object('class', k.name, 'n', added)::jsonb);
  return json_build_object('added', added);
end $$;
create or replace function public._student_in_my_class(p_student uuid)
returns public.students language plpgsql security definer set search_path = public as $$
declare s students;
begin
  select * into s from students where id = p_student;
  if not found then raise exception 'Không tìm thấy học sinh'; end if;
  if s.class_id is not null then perform _class(s.class_id); else perform _need_center_admin(s.center_id); end if;
  return s;
end $$;
create or replace function public.k_rename_student(p_student uuid, p_name text)
returns void language plpgsql security definer set search_path = public as $$
begin perform _student_in_my_class(p_student); update students set name = left(trim(p_name), 40) where id = p_student and trim(p_name) <> ''; end $$;
create or replace function public.k_reset_pin(p_student uuid)
returns text language plpgsql security definer set search_path = public as $$
declare s students := _student_in_my_class(p_student); lv text; v text;
begin
  select level into lv from classes where id = s.class_id;
  v := _new_pin(coalesce(lv, 'th'));
  update students set pin = v where id = s.id;
  delete from sessions where student_id = s.id;
  return v;
end $$;
-- bỏ học sinh khỏi lớp (giữ hồ sơ ở trung tâm, xếp lớp khác sau)
create or replace function public.k_remove_student(p_student uuid)
returns void language plpgsql security definer set search_path = public as $$
declare s students := _student_in_my_class(p_student);
begin
  update students set class_id = null where id = s.id;
  delete from sessions where student_id = s.id;
  perform _log(s.center_id, 'remove_from_class', json_build_object('student', s.name)::jsonb);
end $$;
-- chuyển / xếp lớp (quản trị trung tâm)
create or replace function public.c_move_student(p_student uuid, p_class uuid)
returns void language plpgsql security definer set search_path = public as $$
declare s students; k classes;
begin
  select * into s from students where id = p_student;
  if not found then raise exception 'Không tìm thấy học sinh'; end if;
  perform _need_center_admin(s.center_id);
  if p_class is not null then
    select * into k from classes where id = p_class and center_id = s.center_id;
    if not found then raise exception 'Lớp không thuộc trung tâm'; end if;
  end if;
  update students set class_id = p_class, pin = case when p_class is null then pin else _new_pin(k.level) end where id = s.id;
  delete from sessions where student_id = s.id;
  perform _log(s.center_id, 'move_student', json_build_object('student', s.name, 'to', k.name)::jsonb);
end $$;
-- xoá hẳn học sinh (giải phóng chỗ trong gói)
create or replace function public.c_delete_student(p_student uuid)
returns void language plpgsql security definer set search_path = public as $$
declare s students;
begin
  select * into s from students where id = p_student;
  if not found then return; end if;
  perform _need_center_admin(s.center_id);
  delete from students where id = s.id;
  perform _log(s.center_id, 'delete_student', json_build_object('student', s.name)::jsonb);
end $$;

create or replace function public.k_create_assignment(p_class uuid, p_title text, p_kind text, p_game text, p_config jsonb, p_url text, p_note text, p_due date, p_lesson uuid)
returns json language plpgsql security definer set search_path = public as $$
declare k classes := _class(p_class); a assignments;
begin
  if p_kind not in ('game', 'link') then raise exception 'Loại bài không hợp lệ'; end if;
  if p_kind = 'link' and coalesce(p_url, '') !~ '^https?://' then raise exception 'Đường link phải bắt đầu bằng http'; end if;
  insert into assignments(class_id, lesson_id, title, kind, game, config, url, note, due, created_by)
  values (k.id, p_lesson, left(coalesce(nullif(trim(p_title), ''), 'Bài mới'), 80), p_kind, coalesce(p_game, ''), coalesce(p_config, '{}'::jsonb),
          coalesce(p_url, ''), left(coalesce(p_note, ''), 300), p_due, auth.uid())
  returning * into a;
  return row_to_json(a);
end $$;
create or replace function public.k_delete_assignment(p_assignment uuid)
returns void language plpgsql security definer set search_path = public as $$
declare a assignments;
begin select * into a from assignments where id = p_assignment; if not found then return; end if; perform _class(a.class_id); delete from assignments where id = p_assignment; end $$;

-- giao cả bài học trong kho (mỗi mục của bài học thành một bài giao)
create or replace function public.k_assign_lesson(p_class uuid, p_lesson uuid, p_due date, p_note text)
returns json language plpgsql security definer set search_path = public as $$
declare k classes := _class(p_class); l lessons; it jsonb; n int := 0;
begin
  select * into l from lessons where id = p_lesson and (center_id is null or center_id = k.center_id);
  if not found then raise exception 'Không tìm thấy bài học'; end if;
  for it in select * from jsonb_array_elements(l.items) loop
    insert into assignments(class_id, lesson_id, title, kind, game, config, url, note, due, created_by)
    values (k.id, l.id, left(l.title || ' · ' || coalesce(it->>'title', 'phần ' || (n + 1)), 80),
            case when it->>'kind' = 'link' then 'link' else 'game' end, coalesce(it->>'game', ''), coalesce(it->'config', '{}'::jsonb),
            coalesce(it->>'url', ''), left(coalesce(p_note, ''), 300), p_due, auth.uid());
    n := n + 1;
  end loop;
  return json_build_object('added', n);
end $$;

create or replace function public.k_create_session(p_class uuid, p_title text, p_starts timestamptz, p_minutes int, p_link text, p_lesson uuid)
returns json language plpgsql security definer set search_path = public as $$
declare k classes := _class(p_class); x class_sessions;
begin
  if coalesce(p_link, '') <> '' and p_link !~ '^https://' then raise exception 'Link lớp học phải bắt đầu bằng https://'; end if;
  insert into class_sessions(class_id, lesson_id, title, starts_at, minutes, link)
  values (k.id, p_lesson, left(coalesce(nullif(trim(p_title), ''), 'Buổi học'), 80), p_starts, greatest(10, least(300, coalesce(p_minutes, 60))), coalesce(p_link, ''))
  returning * into x;
  return row_to_json(x);
end $$;
create or replace function public.k_delete_session(p_session uuid)
returns void language plpgsql security definer set search_path = public as $$
declare x class_sessions;
begin select * into x from class_sessions where id = p_session; if not found then return; end if; perform _class(x.class_id); delete from class_sessions where id = p_session; end $$;
create or replace function public.k_set_attendance(p_session uuid, p_student uuid, p_status text)
returns void language plpgsql security definer set search_path = public as $$
declare x class_sessions;
begin
  select * into x from class_sessions where id = p_session; if not found then raise exception 'Không tìm thấy buổi học'; end if;
  perform _class(x.class_id);
  if p_status is null then delete from attendance where session_id = p_session and student_id = p_student; return; end if;
  insert into attendance(session_id, student_id, status) values (p_session, p_student, p_status)
    on conflict (session_id, student_id) do update set status = excluded.status;
end $$;

-- thông báo cho học sinh / phụ huynh của lớp
create or replace function public.k_post_notice(p_class uuid, p_body text)
returns void language plpgsql security definer set search_path = public as $$
declare k classes := _class(p_class);
begin
  if coalesce(trim(p_body), '') = '' then raise exception 'Cần nội dung thông báo'; end if;
  insert into notices(class_id, body, created_by) values (k.id, left(trim(p_body), 500), auth.uid());
end $$;
create or replace function public.k_delete_notice(p_notice uuid)
returns void language plpgsql security definer set search_path = public as $$
declare n notices;
begin select * into n from notices where id = p_notice; if not found then return; end if; perform _class(n.class_id); delete from notices where id = p_notice; end $$;

-- ============ GÓI & MÃ KÍCH HOẠT ============
create or replace function public.a_make_codes(p_seats int, p_n int)
returns json language plpgsql security definer set search_path = public as $$
declare v text; out text[] := '{}'; i int;
begin
  if not _is_super(_me()) then raise exception 'Chỉ quản trị hệ thống' using errcode = '42501'; end if;
  for i in 1 .. greatest(1, least(50, coalesce(p_n, 1))) loop
    loop v := 'JENNY-' || _rand(4, 'ABCDEFGHJKMNPQRSTUVWXYZ23456789') || '-' || _rand(4, 'ABCDEFGHJKMNPQRSTUVWXYZ23456789');
      exit when not exists (select 1 from codes where code = v); end loop;
    insert into codes(code, seats) values (v, greatest(1, coalesce(p_seats, 10)));
    out := out || v;
  end loop;
  return to_json(out);
end $$;
create or replace function public.a_codes()
returns json language plpgsql security definer set search_path = public as $$
begin
  if not _is_super(_me()) then raise exception 'Chỉ quản trị hệ thống' using errcode = '42501'; end if;
  return (select coalesce(json_agg(json_build_object('code', c.code, 'seats', c.seats, 'center', (select name from centers where id = c.center_id), 'used_at', c.used_at) order by c.created_at desc), '[]'::json)
          from (select * from codes order by created_at desc limit 200) c);
end $$;
create or replace function public.c_redeem(p_center uuid, p_code text)
returns int language plpgsql security definer set search_path = public as $$
declare c codes;
begin
  perform _need_center_admin(p_center);
  select * into c from codes where code = upper(trim(p_code)) for update;
  if not found or c.used_at is not null then raise exception 'Mã không đúng hoặc đã dùng'; end if;
  update codes set center_id = p_center, used_at = now() where code = c.code;
  update centers set seats = seats + c.seats where id = p_center;
  perform _log(p_center, 'redeem_code', json_build_object('seats', c.seats)::jsonb);
  return c.seats;
end $$;

-- ============ KHO BÀI HỌC ============
create or replace function public.l_list(p_center uuid)
returns json language plpgsql security definer set search_path = public as $$
declare r text := _center_role(p_center);
begin
  if r is null then raise exception 'Bạn không thuộc trung tâm này' using errcode = '42501'; end if;
  return (select coalesce(json_agg(json_build_object('id', l.id, 'title', l.title, 'level', l.level, 'description', l.description, 'items', l.items,
            'shared', l.center_id is null, 'can_edit', (l.center_id is null and r = 'super') or (l.center_id = p_center and r in ('super', 'admin')))
          order by (l.center_id is null) desc, l.level, l.title), '[]'::json)
          from lessons l where l.center_id is null or l.center_id = p_center);
end $$;
create or replace function public.l_save(p_id uuid, p_center uuid, p_title text, p_level text, p_description text, p_items jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare l lessons; uid uuid := _me();
begin
  if p_center is null then if not _is_super(uid) then raise exception 'Chỉ quản trị hệ thống sửa kho chung' using errcode = '42501'; end if;
  else perform _need_center_admin(p_center); end if;
  if jsonb_typeof(coalesce(p_items, '[]'::jsonb)) <> 'array' then raise exception 'Nội dung bài học không hợp lệ'; end if;
  if p_id is null then
    insert into lessons(center_id, title, level, description, items, created_by)
    values (p_center, left(coalesce(nullif(trim(p_title), ''), 'Bài học mới'), 100), coalesce(p_level, 'mn'), left(coalesce(p_description, ''), 1000), coalesce(p_items, '[]'::jsonb), uid)
    returning * into l;
  else
    update lessons set title = left(coalesce(nullif(trim(p_title), ''), title), 100), level = coalesce(p_level, level),
      description = left(coalesce(p_description, ''), 1000), items = coalesce(p_items, items)
    where id = p_id and center_id is not distinct from p_center returning * into l;
    if not found then raise exception 'Không tìm thấy bài học'; end if;
  end if;
  return row_to_json(l);
end $$;
create or replace function public.l_delete(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare l lessons;
begin
  select * into l from lessons where id = p_id; if not found then return; end if;
  if l.center_id is null then if not _is_super(_me()) then raise exception 'Chỉ quản trị hệ thống' using errcode = '42501'; end if;
  else perform _need_center_admin(l.center_id); end if;
  delete from lessons where id = p_id;
end $$;

-- ============ HỌC SINH ============
create or replace function public.s_class(p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare k classes;
begin
  select * into k from classes where code = upper(trim(p_code));
  if not found then return null; end if;
  return json_build_object('name', k.name, 'level', k.level, 'code', k.code,
    'students', (select coalesce(json_agg(json_build_object('id', s.id, 'name', s.name) order by s.name), '[]'::json) from students s where s.class_id = k.id and s.active));
end $$;
create or replace function public.s_login(p_code text, p_student uuid, p_pin text)
returns json language plpgsql security definer set search_path = public as $$
declare s students; k classes; tk uuid; fails int;
begin
  select st.* into s from students st join classes cl on cl.id = st.class_id where st.id = p_student and cl.code = upper(trim(p_code)) and st.active;
  if not found then return null; end if;
  -- chặn đoán mò: tối đa 10 lần sai trong 10 phút
  select count(*) into fails from audit_log where action = 's_login_fail' and detail->>'s' = s.id::text and at > now() - interval '10 minutes';
  if fails >= 10 then raise exception 'Sai quá nhiều lần, em chờ 10 phút hoặc nhờ cô đặt lại mã nhé'; end if;
  if s.pin <> p_pin then insert into audit_log(center_id, action, detail) values (s.center_id, 's_login_fail', json_build_object('s', s.id)::jsonb); return null; end if;
  select * into k from classes where id = s.class_id;
  delete from sessions where student_id = s.id and expires_at < now();
  insert into sessions(student_id) values (s.id) returning token into tk;
  return json_build_object('token', tk, 'name', s.name, 'code', s.student_code, 'class', k.name, 'level', k.level);
end $$;
create or replace function public._student(p_token uuid)
returns public.students language plpgsql security definer set search_path = public as $$
declare s students;
begin
  select st.* into s from sessions se join students st on st.id = se.student_id where se.token = p_token and se.expires_at > now() and st.active and st.class_id is not null;
  if not found then raise exception 'Phiên đăng nhập đã hết, em đăng nhập lại nhé' using errcode = '28000'; end if;
  return s;
end $$;
create or replace function public.s_home(p_token uuid)
returns json language plpgsql security definer set search_path = public as $$
declare s students := _student(p_token);
begin
  return json_build_object(
    'me', json_build_object('name', s.name, 'code', s.student_code, 'class', (select name from classes where id = s.class_id), 'level', (select level from classes where id = s.class_id)),
    'tasks', (select coalesce(json_agg(json_build_object('id', a.id, 'title', a.title, 'kind', a.kind, 'game', a.game, 'config', a.config, 'url', a.url, 'note', a.note, 'due', a.due,
        'stars', (select max(t.stars) from attempts t where t.assignment_id = a.id and t.student_id = s.id),
        'plays', (select count(*) from attempts t where t.assignment_id = a.id and t.student_id = s.id)) order by a.due nulls last, a.created_at desc), '[]'::json)
      from assignments a where a.class_id = s.class_id),
    'sessions', (select coalesce(json_agg(json_build_object('id', x.id, 'title', x.title, 'starts_at', x.starts_at, 'minutes', x.minutes, 'has_link', x.link <> '') order by x.starts_at), '[]'::json)
      from class_sessions x where x.class_id = s.class_id and x.starts_at + make_interval(mins => x.minutes) > now() - interval '30 minutes' and x.starts_at < now() + interval '14 days'),
    'notices', (select coalesce(json_agg(json_build_object('body', n.body, 'at', n.created_at) order by n.created_at desc), '[]'::json)
      from (select * from notices where class_id = s.class_id order by created_at desc limit 5) n)
  );
end $$;
create or replace function public.s_submit(p_token uuid, p_assignment uuid, p_stars int, p_correct int, p_total int, p_seconds int, p_answers jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare s students := _student(p_token); a assignments; att uuid; x jsonb;
begin
  select * into a from assignments where id = p_assignment and class_id = s.class_id;
  if not found then raise exception 'Bài này không thuộc lớp của em'; end if;
  insert into attempts(assignment_id, student_id, stars, correct, total, seconds)
  values (a.id, s.id, greatest(0, least(3, coalesce(p_stars, 0))), greatest(0, coalesce(p_correct, 0)), greatest(0, coalesce(p_total, 0)), greatest(0, least(36000, coalesce(p_seconds, 0))))
  returning id into att;
  for x in select * from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb)) limit 50 loop
    insert into answers(attempt_id, skill, correct, tries, seconds)
    values (att, left(coalesce(x->>'skill', '?'), 40), coalesce((x->>'correct')::boolean, false),
            greatest(1, least(20, coalesce((x->>'tries')::int, 1))), greatest(0, least(3600, coalesce((x->>'seconds')::int, 0))));
  end loop;
  return json_build_object('ok', true);
end $$;
-- vào buổi học trực tuyến: tự điểm danh rồi trả về link phòng
create or replace function public.s_join(p_token uuid, p_session uuid)
returns text language plpgsql security definer set search_path = public as $$
declare s students := _student(p_token); x class_sessions; st text;
begin
  select * into x from class_sessions where id = p_session and class_id = s.class_id;
  if not found then raise exception 'Không tìm thấy buổi học'; end if;
  if now() < x.starts_at - interval '15 minutes' then raise exception 'Chưa đến giờ vào lớp, em quay lại sau nhé'; end if;
  st := case when now() > x.starts_at + interval '10 minutes' then 'late' else 'present' end;
  insert into attendance(session_id, student_id, status, joined_at) values (x.id, s.id, st, now())
    on conflict (session_id, student_id) do update set joined_at = coalesce(attendance.joined_at, now()),
      status = case when attendance.status in ('absent') then excluded.status else attendance.status end;
  return x.link;
end $$;

-- ============ QUYỀN GỌI HÀM ============
revoke all on all functions in schema public from public, anon, authenticated;
grant execute on function
  public.me(), public.set_name(text), public.claim_super(),
  public.a_centers(), public.a_create_center(text, int, text), public.a_update_center(uuid, text, int),
  public.c_center(uuid), public.c_invite(uuid, text, text), public.c_remove_member(uuid, uuid), public.c_cancel_invite(uuid, text),
  public.c_create_class(uuid, text, text, uuid), public.c_update_class(uuid, text, uuid), public.c_delete_class(uuid), public.c_log(uuid),
  public.c_move_student(uuid, uuid), public.c_delete_student(uuid),
  public.k_class(uuid), public.k_add_students(uuid, text[]), public.k_rename_student(uuid, text), public.k_reset_pin(uuid), public.k_remove_student(uuid),
  public.k_create_assignment(uuid, text, text, text, jsonb, text, text, date, uuid), public.k_delete_assignment(uuid), public.k_assign_lesson(uuid, uuid, date, text),
  public.k_create_session(uuid, text, timestamptz, int, text, uuid), public.k_delete_session(uuid), public.k_set_attendance(uuid, uuid, text),
  public.l_list(uuid), public.l_save(uuid, uuid, text, text, text, jsonb), public.l_delete(uuid),
  public.k_post_notice(uuid, text), public.k_delete_notice(uuid), public.a_make_codes(int, int), public.a_codes(), public.c_redeem(uuid, text)
  to authenticated;
grant execute on function public.s_class(text), public.s_login(text, uuid, text), public.s_home(uuid),
  public.s_submit(uuid, uuid, int, int, int, int, jsonb), public.s_join(uuid, uuid)
  to anon, authenticated;

-- ============ BÀI HỌC MẪU TRONG KHO CHUNG ============
insert into lessons(center_id, title, level, description, items)
select null, x.t, 'mn', x.d, x.i::jsonb from (values
  ('Đếm đến 5', 'Đếm số lượng, nối nhóm với số, so sánh nhiều hơn – ít hơn.', '[{"kind":"game","game":"mam-non","config":{"isle":1,"lv":0},"title":"Đảo Đếm Số – màn 1"},{"kind":"game","game":"mam-non","config":{"isle":1,"lv":1},"title":"Đảo Đếm Số – màn 2"}]'),
  ('Thêm – bớt trong phạm vi 5', 'Thêm vào, bớt đi, tách gộp bằng hình.', '[{"kind":"game","game":"mam-non","config":{"isle":2,"lv":0},"title":"Đảo Cộng Trừ – màn 1"},{"kind":"game","game":"mam-non","config":{"isle":2,"lv":1},"title":"Đảo Cộng Trừ – màn 2"}]'),
  ('Hình và màu', 'Hình khác biệt, tô màu theo yêu cầu, quy luật.', '[{"kind":"game","game":"mam-non","config":{"isle":0,"lv":0},"title":"Đảo Hình và Màu – màn 1"}]')
) as x(t, d, i)
where not exists (select 1 from lessons where center_id is null);
