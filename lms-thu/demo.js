// BẢN XEM THỬ: chạy toàn bộ cơ sở dữ liệu ngay trong trình duyệt (PGlite = Postgres chạy trên trình duyệt).
// Dùng đúng file setup.sql như máy chủ thật, nên mọi quyền và quy tắc giống hệt.
// Dữ liệu chỉ nằm trên máy này. Không cần Supabase, không cần tài khoản.
const PGL = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.3.7/dist/index.js';
const DATA = 'idb://jenny-lms-demo-v1';

export const DEMO_USERS = {
  super: { id: '00000000-0000-4000-8000-000000000001', email: 'quantri@demo.jenny', name: 'Thầy Luân (quản trị hệ thống)' },
  admin: { id: '00000000-0000-4000-8000-000000000002', email: 'trungtam@demo.jenny', name: 'Cô Mai (quản trị trung tâm)' },
  teacher: { id: '00000000-0000-4000-8000-000000000003', email: 'giaovien@demo.jenny', name: 'Cô Jenny (giáo viên)' }
};

let dbp = null;
export function db() { if (!dbp) dbp = open(); return dbp; }
// trang học sinh và trang giáo viên có thể mở ở hai tab: khi quay lại tab thì nạp lại dữ liệu mới nhất
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !dbp) return;
  const old = dbp; dbp = old.then(d => d.close()).catch(() => {}).then(open);
});

async function open() {
  const { PGlite } = await import(PGL);
  const d = new PGlite(DATA);
  const r = await d.query("select to_regclass('public.demo_seeded') is not null as ok");
  if (!r.rows[0].ok) await seed(d);
  return d;
}

async function rpcOn(d, fn, args, uid) {
  if (!/^[a-z_]+$/.test(fn)) throw new Error('Hàm không hợp lệ');
  const ks = Object.keys(args || {});
  const q = `select public.${fn}(${ks.map((k, i) => `${k} := $${i + 1}`).join(', ')}) as r`;
  return d.transaction(async tx => {
    await tx.query(`set local role ${uid ? 'authenticated' : 'anon'}`);
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [uid || '']);
    return (await tx.query(q, ks.map(k => args[k]))).rows[0].r;
  });
}

export async function rpc(fn, args, uid) {
  const d = await db();
  try {
    const r = await rpcOn(d, fn, args, uid);
    // ghi chắc xuống bộ nhớ máy trước khi trang chuyển đi
    if (d.syncToFs) await d.syncToFs();
    return r;
  }
  catch (e) { const err = new Error(e.message || 'Lỗi'); err.code = e.code; throw err; }
}

// mã bí mật của học sinh (chỉ để gợi ý trong bản xem thử)
export async function demoPin(studentId) {
  const d = await db();
  const r = await d.query('select pin from public.students where id = $1', [studentId]);
  return r.rows[0] && r.rows[0].pin;
}

export async function resetDemo() {
  const d = await db();
  await d.exec('drop schema if exists public cascade; drop schema if exists auth cascade; create schema public;');
  await seed(d);
}

async function seed(d) {
  const setup = await (await fetch(new URL('./setup.sql', import.meta.url))).text();
  await d.exec(`
    create schema if not exists auth;
    create table if not exists auth.users(id uuid primary key, email text);
    create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    do $$ begin create role anon; exception when others then null; end $$;
    do $$ begin create role authenticated; exception when others then null; end $$;
    grant usage on schema public, auth to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;`);
  await d.exec(setup.replace(/create extension if not exists pgcrypto;/i, ''));
  const U = DEMO_USERS;
  for (const u of Object.values(U)) await d.query('insert into auth.users values ($1, $2)', [u.id, u.email]);
  const call = (fn, a, who) => rpcOn(d, fn, a, who);
  for (const u of Object.values(U)) await call('set_name', { p_name: u.name }, u.id);
  await call('claim_super', {}, U.super.id);
  const c = await call('a_create_center', { p_name: 'Trung tâm Jenny (xem thử)', p_seats: 40, p_admin_email: U.admin.email }, U.super.id);
  await call('me', {}, U.admin.id);
  await call('c_invite', { p_center: c.id, p_email: U.teacher.email, p_role: 'teacher' }, U.admin.id);
  const k1 = await call('c_create_class', { p_center: c.id, p_name: 'Lá 1 – Thứ 7', p_level: 'mn', p_teacher: U.teacher.id }, U.admin.id);
  const k2 = await call('c_create_class', { p_center: c.id, p_name: 'Lớp 2A – Chủ nhật', p_level: 'th', p_teacher: U.teacher.id }, U.admin.id);
  await call('k_add_students', { p_class: k1.id, p_names: ['Bống', 'Minh Anh', 'Tít', 'Na', 'Bin'] }, U.teacher.id);
  await call('k_add_students', { p_class: k2.id, p_names: ['Khang', 'Linh', 'Phúc'] }, U.teacher.id);
  // mã lớp và mã bí mật cố định cho dễ nhớ
  await d.exec(`update public.classes set code = 'MN-DEMO' where id = '${k1.id}';
    update public.classes set code = 'TH-DEMO' where id = '${k2.id}';
    update public.students set pin = case name when 'Bống' then 'abc' when 'Minh Anh' then 'def' when 'Tít' then 'ace' when 'Na' then 'bdf' when 'Bin' then 'fed' else '1234' end;`);
  const L = await call('l_list', { p_center: c.id }, U.teacher.id);
  const dem = L.find(l => /Đếm/.test(l.title)) || L[0];
  if (dem) await call('k_assign_lesson', { p_class: k1.id, p_lesson: dem.id, p_due: null, p_note: 'Con làm cùng bố mẹ nhé' }, U.teacher.id);
  await call('k_create_assignment', { p_class: k1.id, p_title: 'Đảo Cộng Trừ · Màn 1', p_kind: 'game', p_game: 'mam-non', p_config: { isle: 2, lv: 0 }, p_url: '', p_note: '', p_due: null, p_lesson: null }, U.teacher.id);
  await call('k_create_assignment', { p_class: k1.id, p_title: 'Thám tử nhí · Khu Mê Cung · Màn 1', p_kind: 'game', p_game: 'tham-tu', p_config: { isle: 0, lv: 0 }, p_url: '', p_note: 'Con tìm đường giúp các bạn nhé', p_due: null, p_lesson: null }, U.teacher.id);
  const now = new Date(); now.setMinutes(now.getMinutes() + 5, 0, 0);
  await call('k_create_session', { p_class: k1.id, p_title: 'Buổi học thử – Đếm đến 5', p_starts: now.toISOString(), p_minutes: 60, p_link: 'https://meet.google.com/', p_lesson: null }, U.teacher.id);
  await call('k_post_notice', { p_class: k1.id, p_body: 'Chào các con! Đây là lớp xem thử. Các con bấm "Làm bài" để chơi nhé.' }, U.teacher.id);
  // vài kết quả mẫu để bảng kết quả có số liệu
  await d.exec(`
    with a as (select id from public.assignments where class_id = '${k1.id}' and kind = 'game' order by created_at limit 1),
         s as (select id, name from public.students where class_id = '${k1.id}' and name in ('Minh Anh', 'Tít', 'Na')),
         t as (insert into public.attempts(assignment_id, student_id, stars, correct, total, seconds)
               select a.id, s.id, case s.name when 'Minh Anh' then 3 when 'Tít' then 2 else 1 end, case s.name when 'Minh Anh' then 5 when 'Tít' then 4 else 2 end, 5, 180 from a, s returning id, stars)
    insert into public.answers(attempt_id, skill, correct, tries, seconds)
      select t.id, sk, (g <= t.stars + 1), case when g <= t.stars + 1 then 1 else 3 end, 20
      from t, (values ('Đếm', 1), ('Đếm', 2), ('So sánh', 3), ('Đếm', 4), ('So sánh', 5)) v(sk, g);
    create table public.demo_seeded(at timestamptz default now());
    insert into public.demo_seeded default values;`);
}
