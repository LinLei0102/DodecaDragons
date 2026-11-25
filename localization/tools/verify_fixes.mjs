// Verify: sigil reset keys, UTF-8 safe save export/import, file save round trip.
// Usage: node tools/verify_fixes.mjs [baseUrl] [saveB64File]
import { chromium } from 'playwright-core';
import fs from 'fs';
import os from 'os';
import path from 'path';

const base = process.argv[2] || 'http://127.0.0.1:8799';
const saveFile = process.argv[3] || '残局存档.b64.txt';
const ZH = base + '/%E6%B1%89%E5%8C%96%E7%89%88/index.html';
const EN = base + '/%E8%8B%B1%E6%96%87%E7%89%88/index.html';

let rawB64 = fs.readFileSync(saveFile, 'utf8').trim();
const saveJson = Buffer.from(rawB64, 'base64').toString('utf8');
const saveObj = JSON.parse(saveJson);

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const report = { checks: [], errors: [] };
const ok = (name, pass, detail) => report.checks.push({ name, pass: !!pass, detail });

async function newPage(url, save) {
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1400, height: 900 } });
  await context.addInitScript((s) => {
    try { localStorage.setItem('dodecaSave', s); localStorage.setItem('dodecaLastSaved', String(Date.now())); } catch (e) {}
  }, save);
  const page = await context.newPage();
  page.on('pageerror', (e) => report.errors.push('PAGEERROR[' + url.split('/').pop() + ']: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') report.errors.push('CONSOLE: ' + m.text()); });
  page.on('dialog', (d) => d.accept().catch(() => {}));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2200);
  return { context, page };
}

// ---------- ZH build ----------
const zhSave = JSON.parse(saveJson);
const zh = await newPage(ZH, JSON.stringify(zhSave));
const page = zh.page;

ok('zh loaded game', await page.evaluate(() => typeof game === 'object' && !!game.cyanSigils), await page.evaluate(() => game.unlocks));

// 1) sigil reset via the real button
const sigil = await page.evaluate(() => {
  const btn = document.querySelector('button[onclick="sigilCheck(1)"]');
  if (!btn) return { missing: true };
  const before = game.cyanSigils.toString();
  const toGet = game.cyanSigilsToGet.toString();
  window.confirm = () => true;
  try { btn.click(); } catch (e) { return { threw: String(e) }; }
  return { before, toGet, after: game.cyanSigils.toString(), lastSigilReset: String(game.lastSigilReset) };
});
ok('sigil reset runs (no throw, gains added)', !sigil.missing && !sigil.threw && sigil.after !== sigil.before, sigil);

// 2) Chinese dragon name -> export string -> decode -> import
const roundtrip = await page.evaluate(() => {
  const box = document.getElementById('dragonNameBox');
  box.value = '测试龙·小红';
  changeDragonName();
  window.alert = () => {};
  exportGame();
  const encoded = document.getElementById('exportField').value;
  let decodedName = null, decodeErr = null;
  try { decodedName = ddDecodeSave(encoded).dragonName; } catch (e) { decodeErr = String(e); }
  game.dragonName = 'zzz-before-import';
  importGame();
  return {
    encodedLen: encoded.length, isBase64: /^[A-Za-z0-9+/=]+$/.test(encoded),
    decodedName, decodeErr, nameAfterImport: game.dragonName,
  };
});
ok('export encodes Chinese name (btoa no longer throws)', roundtrip.isBase64 && roundtrip.decodedName === '测试龙·小红', roundtrip);
ok('import restores Chinese name', roundtrip.nameAfterImport === '测试龙·小红', roundtrip.nameAfterImport);

// 3) file export -> download -> file import
const dlDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ddsave-'));
let dlPath = null;
try {
  const [dl] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    page.evaluate(() => { window.alert = () => {}; ddDownloadSave(); }),
  ]);
  dlPath = path.join(dlDir, dl.suggestedFilename());
  await dl.saveAs(dlPath);
} catch (e) {
  report.errors.push('DOWNLOAD: ' + e.message);
}
const fileInfo = dlPath && fs.existsSync(dlPath)
  ? { name: path.basename(dlPath), bytes: fs.statSync(dlPath).size, head: fs.readFileSync(dlPath, 'utf8').slice(0, 24) }
  : null;
ok('file export produced a .txt save', !!fileInfo && fileInfo.bytes > 100, fileInfo);

if (dlPath) {
  await page.evaluate(() => { game.dragonName = 'zzz-file'; });
  await page.setInputFiles('#ddSaveFileInput', dlPath);
  await page.waitForTimeout(800);
  const name = await page.evaluate(() => game.dragonName);
  ok('file import restores save (Chinese name kept)', name === '测试龙·小红', name);
}

// 4) legacy Latin-1 base64 save (old btoa output) still imports
const legacyObj = JSON.parse(saveJson);
legacyObj.dragonName = 'Legacy Dragon';
const legacyB64 = Buffer.from(JSON.stringify(legacyObj), 'latin1').toString('base64');
const legacy = await page.evaluate((b64) => {
  document.getElementById('exportField').value = b64;
  window.alert = () => {};
  importGame();
  return { name: game.dragonName, unlocks: game.unlocks };
}, legacyB64);
ok('legacy base64 save still imports', legacy.name === 'Legacy Dragon' && legacy.unlocks === legacyObj.unlocks, legacy);

// 5) settings UI has the file buttons
const ui = await page.evaluate(() => ({
  exportBtn: !!document.querySelector('button[onclick="ddDownloadSave()"]'),
  importBtn: !!document.querySelector('button[onclick="ddPickSaveFile()"]'),
  input: !!document.getElementById('ddSaveFileInput'),
  label: (document.querySelector('button[onclick="ddDownloadSave()"]') || {}).textContent,
}));
ok('settings panel has file save UI', ui.exportBtn && ui.importBtn && ui.input, ui);

// ---------- EN build ----------
const enSave = JSON.parse(saveJson);
enSave.dragonName = '英文版测试龙';
const en = await newPage(EN, JSON.stringify(enSave));
const enRes = await en.page.evaluate(() => {
  window.alert = () => {};
  game.dragonName = '英文版测试龙';
  exportGame();
  const encoded = document.getElementById('exportField').value;
  let decodedName = null, err = null;
  try { decodedName = ddDecodeSave(encoded).dragonName; } catch (e) { err = String(e); }
  return { decodedName, err, isBase64: /^[A-Za-z0-9+/=]+$/.test(encoded) };
});
ok('EN build export keeps Chinese name', enRes.isBase64 && enRes.decodedName === '英文版测试龙', enRes);

await browser.close();
report.pass = report.checks.every((c) => c.pass);
console.log(JSON.stringify(report, null, 1));
process.exit(report.pass ? 0 : 1);
