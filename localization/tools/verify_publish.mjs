import { chromium } from 'playwright-core';
import fs from 'fs';
const base='http://127.0.0.1:8799/_publish_zh/';
const saveJson=Buffer.from(fs.readFileSync('残局存档.b64.txt','utf8').trim(),'base64').toString('utf8');
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:1200,height:900},acceptDownloads:true});
await ctx.addInitScript((s)=>{try{localStorage.setItem('dodecaSave',s);}catch(e){}},saveJson);
const page=await ctx.newPage();
const errs=[];page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));page.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE: '+m.text());});
page.on('dialog',d=>d.accept().catch(()=>{}));
await page.goto(base+'index.html',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(2000);
const out=await page.evaluate(()=>{
  window.alert=()=>{}; window.confirm=()=>true;
  const b=game.cyanSigils.toString();
  const btn=document.querySelector('button[onclick="sigilCheck(1)"]');
  let threw=null; try{btn.click();}catch(e){threw=String(e);}
  document.getElementById('dragonNameBox').value='发布版龙';
  changeDragonName(); exportGame();
  const enc=document.getElementById('exportField').value;
  return {unlocks:game.unlocks, threw, sigil:[b,game.cyanSigils.toString()],
    files:!!document.querySelector('button[onclick="ddDownloadSave()"]'),
    name:ddDecodeSave(enc).dragonName, lang:document.documentElement.getAttribute('data-dd-lang')};
});
const download=await (async()=>{ try{ const [dl]=await Promise.all([page.waitForEvent('download',{timeout:10000}), page.evaluate(()=>ddDownloadSave())]); return dl.suggestedFilename(); }catch(e){ return 'FAIL: '+e.message; } })();
await browser.close();
console.log(JSON.stringify({out,download,errs},null,1));
