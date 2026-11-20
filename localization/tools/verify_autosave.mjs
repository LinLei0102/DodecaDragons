// Verify built-in autosave and the endgame demo's save isolation.
// Usage: node tools/verify_autosave.mjs <baseUrl>
import { chromium } from 'playwright-core';

const base = process.argv[2] || 'http://127.0.0.1:8765';
const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function freshContext() {
  return browser.newContext({ viewport: { width: 1280, height: 800 } });
}

// 1) Chinese build: wait past the 5s interval and inspect localStorage.
{
  const ctx = await freshContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${base}/%E6%B1%89%E5%8C%96%E7%89%88/index.html`, { waitUntil: 'domcontentloaded' });
  const before = await page.evaluate(() => ({
    save: localStorage.getItem('dodecaSave'),
    last: localStorage.getItem('dodecaLastSaved'),
  }));
  await page.waitForTimeout(6200);
  const after = await page.evaluate(() => {
    let parsed = null;
    try { parsed = JSON.parse(localStorage.getItem('dodecaSave') || 'null'); } catch (e) {}
    return {
      hasSave: !!localStorage.getItem('dodecaSave'),
      last: localStorage.getItem('dodecaLastSaved'),
      lastSave: parsed && parsed.lastSave,
      gameLastSave: (typeof game !== 'undefined' && game && game.lastSave) || null,
    };
  });
  console.log('ZH_BUILTIN', JSON.stringify({ before, after, errors }));

  // Force an old timestamp, then simulate leaving the page. The injected
  // safety net should flush immediately (the game's own interval is 5s).
  await page.evaluate(() => localStorage.setItem('dodecaLastSaved', '1'));
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await page.waitForTimeout(300);
  const exitFlush = await page.evaluate(() => ({
    last: parseInt(localStorage.getItem('dodecaLastSaved') || '0', 10),
    status: (document.getElementById('ddAutosaveStatus') || {}).textContent || '',
  }));
  console.log('ZH_EXIT_FLUSH', JSON.stringify({
    flushed: exitFlush.last > 1000000000000,
    status: exitFlush.status,
    errors,
  }));
  await ctx.close();
}

// 2) Endgame demo: seed a sentinel save, wait 6s, see if it gets overwritten.
{
  const ctx = await freshContext();
  await ctx.addInitScript(() => {
    try { localStorage.setItem('dodecaSave', 'SENTINEL_DO_NOT_TOUCH'); } catch (e) {}
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/%E6%AE%8B%E5%B1%80%E8%AF%95%E7%8E%A9/index.html`, { waitUntil: 'domcontentloaded' });
  const before = await page.evaluate(() => localStorage.getItem('dodecaSave'));
  await page.waitForTimeout(6200);
  const after = await page.evaluate(() => localStorage.getItem('dodecaSave'));
  console.log('DEMO_SAVE_ISOLATION', JSON.stringify({ before, after, overwritten: before !== after }));
  await ctx.close();
}

await browser.close();
