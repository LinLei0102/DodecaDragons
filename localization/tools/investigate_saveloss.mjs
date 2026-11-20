// Reproduce the plausible "autosave exists but save is lost" paths.
// Usage: node tools/investigate_saveloss.mjs <baseUrl>
import { chromium } from 'playwright-core';
import fs from 'fs';

const base = process.argv[2] || 'http://127.0.0.1:8765';
const ZH = `${base}/%E6%B1%89%E5%8C%96%E7%89%88/index.html`;
const seedRaw = fs.readFileSync('D:/自制产物/十二龙 汉化/残局存档.b64.txt', 'utf8').trim();
const seed = JSON.parse(Buffer.from(seedRaw, 'base64').toString('utf8'));

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

function named(name) {
  const s = JSON.parse(JSON.stringify(seed));
  s.dragonName = name;
  return JSON.stringify(s);
}

async function ctxWith(save) {
  const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await c.addInitScript((s) => {
    try { localStorage.setItem('dodecaSave', s); } catch (e) {}
  }, save);
  return c;
}

// ---- A. Script load slower than the 5s autosave interval ----
{
  const ctx = await ctxWith(named('KEEPME_A'));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/scripts/achievements.js', async route => {
    await new Promise(r => setTimeout(r, 6500));
    await route.continue();
  });
  await page.goto(ZH, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const el = document.getElementById('loadingScreenCover');
    return el && el.style.display === 'none';
  }, { timeout: 30000 }).catch(() => {});
  const result = await page.evaluate(() => {
    let s = null;
    try { s = JSON.parse(localStorage.getItem('dodecaSave') || 'null'); } catch (e) {}
    return { dragonName: s && s.dragonName, unlocks: s && s.unlocks };
  });
  console.log('A_SLOW_LOAD', JSON.stringify({ ...result, errors }));
  await ctx.close();
}

// ---- B. A malformed save makes load() throw before loadGame(), while the
//         autosave interval (started earlier in script.js) keeps running ----
{
  const ctx = await ctxWith('{"dragonName":"KEEPME_B","unlocks":37,');
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(ZH, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6200);
  const result = await page.evaluate(() => {
    const raw = localStorage.getItem('dodecaSave') || '';
    let s = null;
    try { s = JSON.parse(raw); } catch (e) {}
    return { rawPrefix: raw.slice(0, 40), parsed: !!s, preserved: raw.indexOf('KEEPME_B') >= 0 };
  });
  console.log('B_BAD_SAVE', JSON.stringify({ ...result, errors }));
  await ctx.close();
}

// ---- C. Two tabs: a stale tab overwrites a newer save ----
{
  const ctx = await ctxWith(named('KEEPME_C'));
  const p1 = await ctx.newPage();
  await p1.goto(ZH, { waitUntil: 'domcontentloaded' });
  await p1.waitForTimeout(1200);
  const p2 = await ctx.newPage();
  await p2.goto(ZH, { waitUntil: 'domcontentloaded' });
  await p2.waitForTimeout(1200);
  // Tab 1 makes a change and saves.
  await p1.evaluate(() => { game.dragonName = 'TAB_A_NEWER'; save(); });
  await p1.close();
  const mid = await p2.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('dodecaSave')).dragonName; } catch (e) { return 'ERR'; }
  });
  // Tab 2's own 5s autosave now writes its stale state.
  await p2.waitForTimeout(5600);
  const after = await p2.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('dodecaSave')).dragonName; } catch (e) { return 'ERR'; }
  });
  console.log('C_TWO_TABS', JSON.stringify({ mid, after, staleWon: mid !== after }));
  await ctx.close();
}

await browser.close();
