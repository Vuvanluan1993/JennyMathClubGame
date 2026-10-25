// Kiểm tra firebase/firestore.rules trên Firebase emulator (P-04, 25/10/2026; P-20 ví xu ca 35–48, thêm ~15 giây chờ luật 3 giây). Không cần mạng, không đụng dữ liệu thật.
//   node src/lop-hoc-ao/tools/test/rules.test.js
//     → tự bật emulator (cần Java 11+ và firebase-tools); không có Java thì in "BỎ QUA" và thoát 0 (máy thầy chưa có Java).
//   Chạy thẳng trong emulator:
//   npx firebase-tools emulators:exec --only firestore --project demo-jenny --config src/lop-hoc-ao/firebase/firebase.json \
//       "node src/lop-hoc-ao/tools/test/rules.test.js"
// Cần trong package.json (devDependencies): firebase, @firebase/rules-unit-testing; firebase-tools tải qua npx khi chạy.
// Mỗi ca ghi rõ điều gì được phép ("cho") hay bị chặn ("cam"); in ✔/✘ và thoát 1 nếu có ca sai.
// File .js dạng CommonJS để tools/test/chay-tat-ca.mjs (glob *.js) tự nhặt; các gói Firebase nạp bằng import() động.
const {readFileSync} = require('node:fs');
const {spawnSync} = require('node:child_process');
const path = require('node:path');

const TOI = __filename;
const FB_DIR = path.resolve(path.dirname(TOI), '..', '..', 'firebase');
const RULES = path.join(FB_DIR, 'firestore.rules');

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  // firebase-tools (từ 14.x) đòi JDK 21+; thiếu hoặc cũ hơn thì bỏ qua có báo (CI cài Java 21 bằng actions/setup-java)
  const java = spawnSync('java', ['-version'], {encoding: 'utf8'});
  const ver = java.status === 0 ? (((java.stderr || '') + (java.stdout || '')).match(/version "(\d+)/) || [])[1] : null;
  if (!ver || +ver < 21) {
    console.log(`Rules: BỎ QUA — ${ver ? 'Java ' + ver + ' cũ hơn 21' : 'máy này không có Java'} nên không bật được Firebase emulator (CI cài Java 21 và chạy ca này).`);
    process.exit(0);
  }
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const r = spawnSync(cmd, ['--yes', 'firebase-tools', 'emulators:exec', '--only', 'firestore', '--project', 'demo-jenny',
    '--config', path.join(FB_DIR, 'firebase.json'), `node ${JSON.stringify(TOI)}`], {stdio: 'inherit'});
  process.exit(r.status ?? 1);
}

(async () => {
const {initializeTestEnvironment, assertSucceeds, assertFails} = await import('@firebase/rules-unit-testing');
const {doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where, serverTimestamp, Timestamp, writeBatch} = await import('firebase/firestore');

const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
const env = await initializeTestEnvironment({projectId: 'demo-jenny', firestore: {rules: readFileSync(RULES, 'utf8'), host, port: +port}});
await env.clearFirestore();

/* Dữ liệu mẫu: 1 quản lý, 2 cô (co1 dạy 1A, co2 dạy 2A), 2 em (em1 lớp 1A, em2 lớp 2A), 1 phụ huynh của em1, 1 người lạ đã đăng nhập nhưng không có hồ sơ */
await env.withSecurityRulesDisabled(async c => {
  const db = c.firestore(), T = serverTimestamp();
  await setDoc(doc(db, 'users/ql1'), {role: 'ql', tk: 'quanly', ten: 'Quản lý', gvId: 'quanly'});
  await setDoc(doc(db, 'users/gv1'), {role: 'gv', tk: 'co1', ten: 'Cô 1', gvId: 'co1'});
  await setDoc(doc(db, 'users/gv2'), {role: 'gv', tk: 'co2', ten: 'Cô 2', gvId: 'co2'});
  await setDoc(doc(db, 'users/hs1'), {role: 'hs', tk: 'em1', ten: 'Em 1', khoi: 1});
  await setDoc(doc(db, 'users/hs2'), {role: 'hs', tk: 'em2', ten: 'Em 2', khoi: 2});
  await setDoc(doc(db, 'users/ph1'), {role: 'ph', tk: 'ph1', ten: 'Phụ huynh Em 1', con: ['em1']});
  await setDoc(doc(db, 'org/main'), {j: '{"ten":"Clb"}', gd: {em1: '1A', em2: '2A'}, pc: {co1: ['1A'], co2: ['2A']}, admins: ['ql1'], t: T});
  await setDoc(doc(db, 'hs/em1'), {j: '{"coins":5}', ev: '[]', lop: '1A', t: T});
  await setDoc(doc(db, 'hs/em2'), {j: '{"coins":5}', ev: '[]', lop: '2A', t: T});
  await setDoc(doc(db, 'hsgv/em1'), {j: '{}', t: T});
  await setDoc(doc(db, 'asg/a1'), {j: '{"id":"a1"}', lop: '1A', t: T});
  await setDoc(doc(db, 'asg/a2'), {j: '{"id":"a2"}', lop: '2A', t: T});
  await setDoc(doc(db, 'login/em1'), {email: 'em1.r1@jenny-lop-hoc-ao.firebaseapp.com', t: T});
  /* dữ liệu v3 (P-06a) */
  await setDoc(doc(db, 'lop/1A'), {ten: '1A', khoi: 1, gv: ['co1'], tj: {on: true, han: '31/05/2027'}, mo: {j1: true}, t: T});
  await setDoc(doc(db, 'lop/2A'), {ten: '2A', khoi: 2, gv: ['co2'], tj: {on: false}, mo: {}, t: T});
  await setDoc(doc(db, 'hsdm/em1'), {ten: 'Em 1', khoi: 1, lop: '1A', ph: 'ph1', t: T});
  await setDoc(doc(db, 'hsdm/em2'), {ten: 'Em 2', khoi: 2, lop: '2A', ph: '', t: T});
  await setDoc(doc(db, 'hoso/em1'), {gt: 'nu', ng: 1, th: 2, nam: 2019, dt: '0912345678', mail: 'ph1@gmail.com', t: T});
  await setDoc(doc(db, 'ph/ph1'), {ten: 'Phụ huynh Em 1', dt: '0912345678', mail: 'ph1@gmail.com', t: T});
  await setDoc(doc(db, 'gv/co1'), {ten: 'Cô 1', tk: 'co1', t: T});
  await setDoc(doc(db, 'nk/n1'), {d: 1, ai: 'Quản lý trung tâm', t: 'Tạo lớp 1A', luc: T});
  /* P-20: ví xu, bảng giá. vi/em1.t đặt lùi 10 giây để lần ghi đầu qua được luật "cách 3 giây" */
  await setDoc(doc(db, 'cfg/shop'), {tranMan: 40, items: {palm: 40, seed: 5, 'game:bowl': 150, ve: 60, 'Vòng cổ vàng': 0}, pets: {chick: 150, turtle: 250}, tudo: {s_lime: 120, bow: 60}, t: T});
  await setDoc(doc(db, 'vi/em1'), {coins: 500, items: {seed: 2}, pets: {}, tudo: {}, t: Timestamp.fromMillis(Date.now() - 10000)});
  await setDoc(doc(db, 'vi/em2'), {coins: 10, items: {}, pets: {}, tudo: {}, t: Timestamp.fromMillis(Date.now() - 10000)});
  await setDoc(doc(db, 'ev/em1/d/e1'), {k: 'man', d: 5, ref: 'j1', t: T});
});

const as = uid => env.authenticatedContext(uid).firestore();
const khach = env.unauthenticatedContext().firestore();
const la = as('la1'), ql = as('ql1'), gv1 = as('gv1'), gv2 = as('gv2'), hs1 = as('hs1'), hs2 = as('hs2'), ph1 = as('ph1');
const hsDoc = (them = {}) => Object.assign({j: '{"coins":9}', ev: '[]', lop: '1A', t: serverTimestamp()}, them);

const CA = [];
const ca = (ten, mong, f) => CA.push({ten, mong, f});

/* LH-C1 — org/main */
ca('1  người lạ đã đăng nhập (không có hồ sơ users) KHÔNG đọc được org/main', 'cam', () => getDoc(doc(la, 'org/main')));
ca('2  học sinh, cô, phụ huynh có hồ sơ đọc được org/main', 'cho', async () => {
  await getDoc(doc(hs1, 'org/main')); await getDoc(doc(gv1, 'org/main')); await getDoc(doc(ph1, 'org/main')); });
/* LH-H2 — users */
ca('3  cô KHÔNG đọc được hồ sơ users của người khác', 'cam', () => getDoc(doc(gv1, 'users/hs1')));
ca('4  chính chủ và quản lý đọc được users', 'cho', async () => { await getDoc(doc(gv1, 'users/gv1')); await getDoc(doc(ql, 'users/hs1')); });
ca('5  người lạ KHÔNG tự tạo hồ sơ quản lý (không nằm trong org.admins)', 'cam', () => setDoc(doc(la, 'users/la1'), {role: 'ql', tk: 'la'}));
/* LH-C2 — hs/{tk} */
ca('6  em ghi hs/{tk} đúng 4 khoá j, ev, lop, t (lop giữ nguyên) ĐƯỢC', 'cho', () => setDoc(doc(hs1, 'hs/em1'), hsDoc()));
ca('7  em đổi lop sang lớp khác BỊ CHẶN', 'cam', () => setDoc(doc(hs1, 'hs/em1'), hsDoc({lop: '2A'})));
ca('8  em ghi j không phải chuỗi BỊ CHẶN', 'cam', () => setDoc(doc(hs1, 'hs/em1'), hsDoc({j: {coins: 1e6}})));
ca('9  em ghi thêm khoá lạ (coins) BỊ CHẶN', 'cam', () => setDoc(doc(hs1, 'hs/em1'), hsDoc({coins: 1e6})));
ca('10 em ghi j quá 900 000 kí tự BỊ CHẶN', 'cam', () => setDoc(doc(hs1, 'hs/em1'), hsDoc({j: 'x'.repeat(900001)})));
ca('11 em khác KHÔNG đọc, KHÔNG ghi hs/em1', 'cam', async () => {
  await assertFails(getDoc(doc(hs2, 'hs/em1'))); await setDoc(doc(hs2, 'hs/em1'), hsDoc()); });
ca('12 quản lý ghi hs/{tk} tuỳ ý (gộp chỉ j, t) ĐƯỢC; cô lớp 1A đọc hs/em1 ĐƯỢC, cô lớp 2A KHÔNG', 'cho', async () => {
  await setDoc(doc(ql, 'hs/em1'), {j: '{"coins":5}', t: serverTimestamp()}, {merge: true});
  await getDoc(doc(gv1, 'hs/em1')); await assertFails(getDoc(doc(gv2, 'hs/em1'))); });
/* LH-H2 — login/{tk} */
ca('13 login: KHÔNG liệt kê được (khách lẫn học sinh)', 'cam', async () => {
  await assertFails(getDocs(collection(khach, 'login'))); await getDocs(collection(hs1, 'login')); });
ca('14 login: khách get đúng 1 bản ghi theo tên đăng nhập ĐƯỢC (để đăng nhập sau khi QL đặt lại mật khẩu); cô KHÔNG ghi', 'cho', async () => {
  await getDoc(doc(khach, 'login/em1')); await assertFails(setDoc(doc(gv1, 'login/em1'), {email: 'x@y'})); });
/* LH-M4 — asg */
ca('15 em đọc bài về nhà lớp mình qua truy vấn where lop ĐƯỢC; đọc cả kho KHÔNG', 'cho', async () => {
  await getDocs(query(collection(hs1, 'asg'), where('lop', '==', '1A'))); await assertFails(getDocs(collection(hs1, 'asg'))); });
ca('16 em KHÔNG đọc bài lớp khác', 'cam', () => getDoc(doc(hs1, 'asg/a2')));
ca('17 cô 1 ghi bài cho lớp 1A ĐƯỢC', 'cho', () => setDoc(doc(gv1, 'asg/a3'), {j: '{"id":"a3"}', lop: '1A', t: serverTimestamp()}));
ca('18 cô 1 ghi bài cho lớp 2A, bài không có lớp, xoá bài lớp 2A đều BỊ CHẶN', 'cam', async () => {
  await assertFails(setDoc(doc(gv1, 'asg/a4'), {j: '{}', lop: '2A', t: serverTimestamp()}));
  await assertFails(setDoc(doc(gv1, 'asg/a5'), {j: '{}', lop: '', t: serverTimestamp()}));
  await deleteDoc(doc(gv1, 'asg/a2')); });
ca('19 phụ huynh đọc bài lớp của con (1A) ĐƯỢC; lớp khác và ghi đều KHÔNG', 'cho', async () => {
  await getDocs(query(collection(ph1, 'asg'), where('lop', '==', '1A')));
  await assertFails(getDoc(doc(ph1, 'asg/a2'))); await assertFails(setDoc(doc(ph1, 'asg/a1'), {j: '{}', lop: '1A', t: serverTimestamp()})); });
ca('20 quản lý đọc cả kho bài, xoá bài ĐƯỢC', 'cho', async () => { await getDocs(collection(ql, 'asg')); await deleteDoc(doc(ql, 'asg/a3')); });
/* LH-H1 còn lại cho P-06: cô vẫn ghi j, nhưng không đụng gd/pc/admins */
ca('21 (v2) cô sửa org/main chỉ j, t ĐƯỢC; sửa gd BỊ CHẶN', 'cho', async () => {
  await updateDoc(doc(gv1, 'org/main'), {j: '{"ten":"Clb 2"}', t: serverTimestamp()});
  await assertFails(updateDoc(doc(gv1, 'org/main'), {gd: {em1: '2A'}})); });
/* P-05 — users.mustChange */
ca('23 chính chủ tắt cờ mustChange (→ false) ĐƯỢC', 'cho', async () => {
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'users/hs2'), {role: 'hs', tk: 'em2', ten: 'Em 2', khoi: 2, mustChange: true}));
  await updateDoc(doc(hs2, 'users/hs2'), {mustChange: false}); });
ca('24 chính chủ bật lại mustChange = true, hoặc tự đổi role/tk BỊ CHẶN', 'cam', async () => {
  await assertFails(updateDoc(doc(hs2, 'users/hs2'), {mustChange: true}));
  await assertFails(updateDoc(doc(hs2, 'users/hs2'), {mustChange: false, role: 'ql'}));
  await updateDoc(doc(hs2, 'users/hs2'), {tk: 'em9'}); });
ca('25 người khác không tắt mustChange hộ; QL đặt mustChange = true ĐƯỢC', 'cho', async () => {
  await assertFails(updateDoc(doc(hs1, 'users/hs2'), {mustChange: false}));
  await updateDoc(doc(ql, 'users/hs2'), {mustChange: true}); });
/* P-06a — các collection v3 */
ca('26 lop: em, cô, phụ huynh đọc được; cô dạy 1A chỉ sửa mo (và t) của lớp 1A', 'cho', async () => {
  await getDoc(doc(hs1, 'lop/1A')); await getDoc(doc(ph1, 'lop/1A')); await getDocs(collection(gv1, 'lop'));
  await updateDoc(doc(gv1, 'lop/1A'), {mo: {j1: true, j2: true}, t: serverTimestamp()}); });
ca('27 lop: cô sửa tj/gv/khoi, sửa lớp khác, tạo/xoá lớp đều BỊ CHẶN; người lạ không đọc', 'cam', async () => {
  await assertFails(updateDoc(doc(gv1, 'lop/1A'), {tj: {on: false}}));
  await assertFails(updateDoc(doc(gv1, 'lop/1A'), {gv: ['co1', 'co2']}));
  await assertFails(updateDoc(doc(gv1, 'lop/2A'), {mo: {j1: true}}));
  await assertFails(setDoc(doc(gv1, 'lop/1C'), {ten: '1C', khoi: 1, gv: ['co1'], tj: {on: false}, mo: {}}));
  await assertFails(deleteDoc(doc(gv1, 'lop/2A')));
  await getDoc(doc(la, 'lop/1A')); });
ca('28 hsdm: cô truy vấn where lop == lớp mình ĐƯỢC; phụ huynh đọc con; em đọc mình; QL ghi', 'cho', async () => {
  await getDocs(query(collection(gv1, 'hsdm'), where('lop', '==', '1A'))); await getDoc(doc(ph1, 'hsdm/em1')); await getDoc(doc(hs1, 'hsdm/em1'));
  await setDoc(doc(ql, 'hsdm/em3'), {ten: 'Em 3', khoi: 1, lop: '1A', ph: '', t: serverTimestamp()}); });
ca('29 hsdm: cô đọc lớp khác / cả kho, cô ghi, phụ huynh đọc em khác, em đọc em khác đều BỊ CHẶN', 'cam', async () => {
  await assertFails(getDoc(doc(gv1, 'hsdm/em2'))); await assertFails(getDocs(collection(gv1, 'hsdm')));
  await assertFails(updateDoc(doc(gv1, 'hsdm/em1'), {lop: '2A'})); await assertFails(getDoc(doc(ph1, 'hsdm/em2')));
  await getDoc(doc(hs1, 'hsdm/em2')); });
ca('30 hoso (PII): chỉ QL đọc/ghi; cô lớp, phụ huynh, em đều KHÔNG', 'cam', async () => {
  await assertSucceeds(getDoc(doc(ql, 'hoso/em1'))); await assertSucceeds(updateDoc(doc(ql, 'hoso/em1'), {dt: '0900000000'}));
  await assertFails(getDoc(doc(gv1, 'hoso/em1'))); await assertFails(getDoc(doc(ph1, 'hoso/em1'))); await getDoc(doc(hs1, 'hoso/em1')); });
ca('31 ph: phụ huynh đọc bản ghi của mình ĐƯỢC, của người khác KHÔNG; cô KHÔNG; chỉ QL ghi', 'cho', async () => {
  await getDoc(doc(ph1, 'ph/ph1')); await assertFails(getDoc(doc(ph1, 'ph/ph2'))); await assertFails(getDoc(doc(gv1, 'ph/ph1')));
  await assertFails(setDoc(doc(ph1, 'ph/ph1'), {ten: 'x'})); await setDoc(doc(ql, 'ph/ph2'), {ten: 'PH 2', dt: '', mail: '', t: serverTimestamp()}); });
ca('32 gv: ai có hồ sơ đọc được; người lạ và cô không ghi', 'cho', async () => {
  await getDocs(collection(hs1, 'gv')); await getDocs(collection(ph1, 'gv'));
  await assertFails(getDocs(collection(la, 'gv'))); await assertFails(setDoc(doc(gv1, 'gv/co9'), {ten: 'x', tk: 'co9'})); });
ca('33 nk: QL và cô thêm dòng ĐƯỢC; sửa/xoá KHÔNG; chỉ QL đọc; em không thêm', 'cho', async () => {
  await setDoc(doc(ql, 'nk/n2'), {d: 2, ai: 'Quản lý trung tâm', t: 'Chuyển lớp', luc: serverTimestamp()});
  await setDoc(doc(gv1, 'nk/n3'), {d: 2, ai: 'Cô 1', t: 'Mở đảo', luc: serverTimestamp()});
  await assertFails(updateDoc(doc(ql, 'nk/n1'), {t: 'sửa'})); await assertFails(deleteDoc(doc(ql, 'nk/n1')));
  await assertFails(getDocs(collection(gv1, 'nk'))); await assertFails(setDoc(doc(hs1, 'nk/n4'), {d: 2, ai: 'em', t: 'x', luc: serverTimestamp()}));
  await getDocs(query(collection(ql, 'nk'), where('d', '>=', 0))); });
ca('34 org/main v3 (v == 3): cô KHÔNG còn sửa được j; QL vẫn ghi', 'cam', async () => {
  await env.withSecurityRulesDisabled(c => updateDoc(doc(c.firestore(), 'org/main'), {v: 3}));
  await assertSucceeds(updateDoc(doc(ql, 'org/main'), {ten: 'Clb v3', t: serverTimestamp()}));
  await updateDoc(doc(gv1, 'org/main'), {j: '{}', t: serverTimestamp()}); });
/* QL vừa chuyển lớp cho em: em ghi lop mới theo org.gd ĐƯỢC */
ca('22 QL chuyển em1 sang 1B rồi em ghi lop = 1B ĐƯỢC', 'cho', async () => {
  await updateDoc(doc(ql, 'org/main'), {gd: {em1: '1B', em2: '2A'}});
  await setDoc(doc(hs1, 'hs/em1'), hsDoc({lop: '1B'})); });

/* P-20 — ví xu vi/{tk}, sổ ev/{tk}/d, bảng giá cfg/shop. Ca 35–48 chạy theo thứ tự; giữa hai lần ghi vi/em1 phải chờ > 3 giây (luật viCach). */
const cho3s = () => new Promise(ok => setTimeout(ok, 3200));
const viSet = (c, tk, them) => setDoc(doc(c, 'vi/' + tk), Object.assign({coins: 500, items: {seed: 2}, pets: {}, tudo: {}, t: serverTimestamp()}, them));
ca('35 vi: em đọc ví mình, cô lớp 1A, phụ huynh, QL đọc ĐƯỢC; cô lớp 2A, em khác KHÔNG; ai có hồ sơ đọc cfg/shop', 'cho', async () => {
  await updateDoc(doc(ql, 'org/main'), {gd: {em1: '1A', em2: '2A'}}); /* ca 22 đã chuyển em1 sang 1B */
  await getDoc(doc(hs1, 'vi/em1')); await getDoc(doc(gv1, 'vi/em1')); await getDoc(doc(ph1, 'vi/em1')); await getDoc(doc(ql, 'vi/em1'));
  await assertFails(getDoc(doc(gv2, 'vi/em1'))); await assertFails(getDoc(doc(hs2, 'vi/em1')));
  await getDoc(doc(hs1, 'cfg/shop')); await assertFails(getDoc(doc(la, 'cfg/shop'))); await assertFails(setDoc(doc(hs1, 'cfg/shop'), {tranMan: 9999})); });
ca('36 vi: em cộng 40 xu (= tranMan) với t = serverTimestamp, cách lần trước > 3 giây ĐƯỢC (500 → 540)', 'cho', () => viSet(hs1, 'em1', {coins: 540}));
ca('37 vi: em cộng lần nữa ngay (chưa đủ 3 giây) BỊ CHẶN', 'cam', () => viSet(hs1, 'em1', {coins: 580}));
ca('38 vi: em cộng 41 xu (quá tranMan) BỊ CHẶN; cộng 1 000 000 BỊ CHẶN; bớt xu không mua gì BỊ CHẶN', 'cam', async () => {
  await cho3s();
  await assertFails(viSet(hs1, 'em1', {coins: 581})); await assertFails(viSet(hs1, 'em1', {coins: 1000000})); await viSet(hs1, 'em1', {coins: 500}); });
ca('39 vi: t không phải serverTimestamp (giờ máy em) BỊ CHẶN; thiếu khoá / thêm khoá lạ BỊ CHẶN', 'cam', async () => {
  await assertFails(viSet(hs1, 'em1', {coins: 560, t: Timestamp.now()}));
  await assertFails(setDoc(doc(hs1, 'vi/em1'), {coins: 560, t: serverTimestamp()}));
  await setDoc(doc(hs1, 'vi/em1'), {coins: 560, items: {seed: 2}, pets: {}, tudo: {}, t: serverTimestamp(), la: 1}); });
ca('40 vi: em vừa cộng xu vừa thêm đồ BỊ CHẶN', 'cam', () => viSet(hs1, 'em1', {coins: 560, items: {seed: 2, palm: 1}}));
ca('41 vi: em mua Cây dừa (palm 40 xu) đúng giá, số lượng 1, có m ĐƯỢC (540 → 500)', 'cho', async () => {
  await cho3s(); await viSet(hs1, 'em1', {coins: 500, items: {seed: 2, palm: 1}, m: {loai: 'items', id: 'palm'}}); });
ca('42 vi: mua món không có trong cfg/shop BỊ CHẶN', 'cam', async () => {
  await cho3s(); await viSet(hs1, 'em1', {coins: 400, items: {seed: 2, palm: 1, rong: 1}, m: {loai: 'items', id: 'rong'}}); });
ca('43 vi: mua trả sai giá (palm 40 mà chỉ trừ 1) BỊ CHẶN; trả giá đúng nhưng ghi m sai món BỊ CHẶN', 'cam', async () => {
  await assertFails(viSet(hs1, 'em1', {coins: 499, items: {seed: 2, palm: 2}, m: {loai: 'items', id: 'palm'}}));
  await viSet(hs1, 'em1', {coins: 460, items: {seed: 2, palm: 2}, m: {loai: 'items', id: 'seed'}}); });
ca('44 vi: mua một lần hai món, hoặc tăng số lượng +2 BỊ CHẶN', 'cam', async () => {
  await assertFails(viSet(hs1, 'em1', {coins: 455, items: {seed: 3, palm: 2}, m: {loai: 'items', id: 'palm'}}));
  await viSet(hs1, 'em1', {coins: 460, items: {seed: 2, palm: 3}, m: {loai: 'items', id: 'palm'}}); });
ca('45 vi: mua thú cưng chick 150 ĐƯỢC (500 → 350); mua khi không đủ xu (coins âm) BỊ CHẶN', 'cho', async () => {
  await viSet(hs1, 'em1', {coins: 350, items: {seed: 2, palm: 1}, pets: {chick: 1}, m: {loai: 'pets', id: 'chick'}});
  await assertFails(viSet(hs2, 'em2', {coins: -140, items: {}, pets: {chick: 1}, tudo: {}, m: {loai: 'pets', id: 'chick'}})); });
ca('46 vi: em tạo ví mới chỉ với 0 xu, đồ rỗng ĐƯỢC; tạo ví có sẵn xu BỊ CHẶN; QL đặt xu tuỳ ý ĐƯỢC', 'cho', async () => {
  await assertFails(setDoc(doc(hs2, 'vi/em9'), {coins: 100, items: {}, pets: {}, tudo: {}, t: serverTimestamp()}));
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'users/hs9'), {role: 'hs', tk: 'em9', ten: 'Em 9', khoi: 1}));
  await setDoc(doc(as('hs9'), 'vi/em9'), {coins: 0, items: {}, pets: {}, tudo: {}, t: serverTimestamp()});
  await setDoc(doc(ql, 'vi/em2'), {coins: 10000, items: {}, pets: {}, tudo: {}, t: serverTimestamp()}); });
ca('47 ev: em thêm dòng k=man d=5 với t = serverTimestamp ĐƯỢC; cùng một batch với vi ĐƯỢC; cô lớp, PH, QL đọc sổ', 'cho', async () => {
  await setDoc(doc(hs1, 'ev/em1/d/e2'), {k: 'man', d: 5, ref: 'j1', t: serverTimestamp()});
  await cho3s();
  const b = writeBatch(hs1); b.set(doc(hs1, 'vi/em1'), {coins: 360, items: {seed: 2, palm: 1}, pets: {chick: 1}, tudo: {}, m: {loai: 'pets', id: 'chick'}, t: serverTimestamp()});
  b.set(doc(hs1, 'ev/em1/d/e3'), {k: 'man', d: 10, ref: 'j1', t: serverTimestamp()}); await b.commit();
  await getDocs(collection(gv1, 'ev/em1/d')); await getDocs(collection(ph1, 'ev/em1/d')); await getDocs(query(collection(ql, 'ev/em1/d'), where('t', '>=', Timestamp.fromMillis(0)))); });
ca('48 ev: sửa, xoá dòng BỊ CHẶN (cả QL); k lạ, d quá 400, t giờ máy, ghi sổ em khác, cô lớp 2A đọc đều BỊ CHẶN', 'cam', async () => {
  await assertFails(updateDoc(doc(hs1, 'ev/em1/d/e1'), {d: 400})); await assertFails(deleteDoc(doc(hs1, 'ev/em1/d/e1')));
  await assertFails(updateDoc(doc(ql, 'ev/em1/d/e1'), {d: 400})); await assertFails(deleteDoc(doc(ql, 'ev/em1/d/e1')));
  await assertFails(setDoc(doc(hs1, 'ev/em1/d/e4'), {k: 'hack', d: 5, ref: '', t: serverTimestamp()}));
  await assertFails(setDoc(doc(hs1, 'ev/em1/d/e5'), {k: 'man', d: 401, ref: '', t: serverTimestamp()}));
  await assertFails(setDoc(doc(hs1, 'ev/em1/d/e6'), {k: 'man', d: 5, ref: '', t: Timestamp.now()}));
  await assertFails(setDoc(doc(hs1, 'ev/em2/d/e7'), {k: 'man', d: 5, ref: '', t: serverTimestamp()}));
  await getDocs(collection(gv2, 'ev/em1/d')); });

let sai = 0;
for (const {ten, mong, f} of CA) {
  try { await (mong === 'cho' ? assertSucceeds(f()) : assertFails(f())); console.log('   ✔ ' + ten); }
  catch (e) { sai++; console.log('   ✘ ' + ten + '\n      ' + String(e && e.message || e).split('\n')[0]); }
}
await env.cleanup();
console.log(`Rules: ${sai ? 'CHƯA ĐẠT' : 'ĐẠT'} · ${CA.length - sai}/${CA.length} ca`);
process.exit(sai ? 1 : 0);
})().catch(e => { console.error('Rules: CHƯA ĐẠT —', e && e.message || e); process.exit(1); });
