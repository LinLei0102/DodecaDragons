import { chromium } from 'playwright-core';
import fs from 'fs';
const base = 'http://127.0.0.1:8799';
const SAVE = Buffer.from(fs.readFileSync('残局存档.b64.txt', 'utf8').trim(), 'base64').toString('utf8');
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--no-sandbox'] });
async function run(url) {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await ctx.addInitScript((s) => { try { localStorage.setItem('dodecaSave', s); } catch (e) {} }, SAVE);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  page.on('dialog', (d) => d.accept().catch(() => {}));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2200);
  const tabs = await page.evaluate(() => {
    const out = [];
    for (let i = 0; i <= 20; i++) {
      try { changeTab(i); out.push(i); } catch (e) { break; }
    }
    return out;
  });
  await page.waitForTimeout(1500);
  // click every visible button that does not reset/wipe progress
  const clicked = await page.evaluate(() => {
    let n = 0;
    for (const b of document.querySelectorAll('button')) {
      const t = (b.textContent || '');
      if (/重置|reset|hardReset|删除/i.test(t)) continue;
      if (b.offsetParent === null) continue;
      if (/ddSwitchLang|exportGame|importGame|ddDownloadSave|ddPickSaveFile/.test(b.getAttribute('onclick') || '')) continue;
      try { b.click(); n++; } catch (e) {}
    }
    return n;
  });
  await page.waitForTimeout(2500);
  const state = await page.evaluate(() => ({ keys: Object.keys(game).length, unlocks: game.unlocks, tab: game.currentTab }));
  await ctx.close();
  return { tabs: tabs.length, clicked, state, errs };
}
const pristine = await run(base + '/DodecaDragons/index.html');
const zh = await run(base + '/%E6%B1%89%E5%8C%96%E7%89%88/index.html');
await browser.close();
console.log(JSON.stringify({ pristine: { tabs: pristine.tabs, clicked: pristine.clicked, errs: pristine.errs }, zh: { tabs: zh.tabs, clicked: zh.clicked, errs: zh.errs, state: zh.state } }, null, 1));
