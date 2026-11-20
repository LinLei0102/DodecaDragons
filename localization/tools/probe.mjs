// Headless DOM residual probe for the Chinese build.
// Usage: node tools/probe.mjs <url> <label> [saveFile]
import { chromium } from 'playwright-core';
import fs from 'fs';

const url = process.argv[2] || 'http://127.0.0.1:8765/index.html';
const label = process.argv[3] || 'zh';
const saveFile = process.argv[4];

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
if (saveFile && fs.existsSync(saveFile)) {
  let save = fs.readFileSync(saveFile, 'utf8').trim();
  try { save = Buffer.from(save, 'base64').toString('utf8'); } catch (e) {}
  await context.addInitScript((s) => {
    try { localStorage.setItem('dodecaSave', s); } catch (e) {}
  }, save);
}
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);

const data = await page.evaluate(() => {
  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    const t = n.nodeValue.trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el) continue;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    out.push({ text: t, id: el.id || '', cls: el.className || '' });
  }
  return {
    nodes: out,
    title: document.title,
    langSwitch: !!document.getElementById('dd-lang-switch'),
    bodyText: document.body.innerText.slice(0, 4000),
  };
});

// English residual heuristic: 2+ consecutive alphabetic words of length>=3
const STOP = new Set(['the','a','an','of','to','and','or','in','on','at','is','are','you','your','this','it','for','with','from','as','by','be','has','have','s','x']);
const residual = [];
for (const node of data.nodes) {
  const words = (node.text.match(/[A-Za-z]{3,}/g) || []).map(w => w.toLowerCase());
  let run = 0;
  for (const w of words) {
    if (STOP.has(w)) { continue; }
    run++;
    if (run >= 2) { residual.push(node); break; }
  }
}
const report = {
  label, url, title: data.title, langSwitch: data.langSwitch,
  visibleTextNodes: data.nodes.length,
  englishResidualNodes: residual.length,
  residual: residual.slice(0, 80),
  errors: errors.slice(0, 30),
};
fs.writeFileSync(`D:/自制产物/十二龙 汉化/verification/${label}-probe.json`, JSON.stringify(report, null, 1));
await page.screenshot({ path: `D:/自制产物/十二龙 汉化/verification/${label}-shot.png`, fullPage: false });
console.log(JSON.stringify({ label, nodes: data.nodes.length, residual: residual.length, errors: errors.length, langSwitch: data.langSwitch }, null, 1));
await browser.close();
