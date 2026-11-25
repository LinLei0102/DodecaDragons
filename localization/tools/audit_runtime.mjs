import { chromium } from 'playwright-core';
import fs from 'fs';

const base = 'http://127.0.0.1:8799';
const SAVE = Buffer.from(fs.readFileSync('残局存档.b64.txt', 'utf8').trim(), 'base64').toString('utf8');

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true, args: ['--no-sandbox'],
});

async function open(url, saveText) {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await ctx.addInitScript((s) => { try { localStorage.setItem('dodecaSave', s); } catch (e) {} }, saveText);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  page.on('dialog', (d) => d.accept().catch(() => {}));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);
  return { ctx, page, errs };
}

const dump = () => {
  const shape = (v) => {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array:' + v.length;
    if (typeof v === 'object') {
      if (typeof v.mag === 'number' && typeof v.sign === 'number') return 'Decimal';
      const keys = Object.keys(v);
      return 'object:' + (keys.length === 2 && 'mantissa' in v ? 'Decimal2' : keys.length);
    }
    return typeof v;
  };
  const g = {};
  for (const k of Object.keys(game).sort()) g[k] = shape(game[k]);
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id).sort();
  const sels = [...document.querySelectorAll('select')].map((s) => [s.id || '(noid)', s.selectedIndex, s.value, s.options.length]);
  return { keys: g, ids, sels, idCount: ids.length };
};

const pristine = await open(base + '/DodecaDragons/index.html', SAVE);
const p = await pristine.page.evaluate(dump);
const zh = await open(base + '/%E6%B1%89%E5%8C%96%E7%89%88/index.html', SAVE);
const z = await zh.page.evaluate(dump);

const missingKeys = Object.keys(p.keys).filter((k) => !(k in z.keys));
const extraKeys = Object.keys(z.keys).filter((k) => !(k in p.keys));
const shapeDiff = Object.keys(p.keys).filter((k) => k in z.keys && p.keys[k] !== z.keys[k])
  .map((k) => ({ key: k, pristine: p.keys[k], zh: z.keys[k] }));
const missingIds = p.ids.filter((id) => !z.ids.includes(id));
const extraIds = z.ids.filter((id) => !p.ids.includes(id));
const selDiff = p.sels.map((s, i) => ({ pristine: s, zh: z.sels[i] }))
  .filter((x) => JSON.stringify(x.pristine) !== JSON.stringify(x.zh));

// exercise the automatic sigil resetter end to end in the zh build
const resetter = await zh.page.evaluate(() => {
  const out = {};
  const selType = document.getElementById('sigilResetterType');
  const selMode = document.getElementById('sigilResetterMode');
  const amount = document.getElementById('sigilResetterAmount');
  out.options = [...selType.options].map((o) => o.textContent + '/' + o.value);
  out.modeOptions = [...selMode.options].map((o) => o.textContent + '/' + o.value);
  selType.selectedIndex = 0; // Cyan
  updateSigilResetter();
  out.typeIndex0 = game.sigilResetterType;
  selType.selectedIndex = 4; // Pink
  updateSigilResetter();
  out.typeIndex4 = game.sigilResetterType;
  for (const i of [0, 1, 2]) {
    selMode.selectedIndex = i;
    updateSigilResetter(true);
    out['mode' + i] = game.sigilResetterMode;
  }
  // enable amount mode with a tiny threshold, then let the resetter fire
  selMode.selectedIndex = 0;
  updateSigilResetter(true);
  amount.value = '1';
  updateSigilResetter();
  document.getElementById('sigilResetterActive').checked = true;
  document.getElementById('sigilResetterCycle').checked = true;
  updateSigilResetter();
  const before = { type: game.sigilResetterType, reset: String(game.lastSigilReset), cyan: game.cyanSigils.toString() };
  sigilAutoResetter();
  out.auto = {
    before,
    after: { type: game.sigilResetterType, reset: String(game.lastSigilReset), cyan: game.cyanSigils.toString() },
    selectShows: document.getElementById('sigilResetterType').value,
  };
  return out;
});

await browser.close();
console.log(JSON.stringify({
  gameKeys: { pristine: Object.keys(p.keys).length, zh: Object.keys(z.keys).length, missingKeys, extraKeys, shapeDiff },
  dom: { pristine: p.idCount, zh: z.idCount, missingIds, extraIds },
  selects: selDiff,
  resetter,
  errors: { pristine: pristine.errs, zh: zh.errs },
}, null, 1));
