import { chromium } from 'playwright-core';
const base='http://127.0.0.1:8799';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:1200,height:900},acceptDownloads:true});
const page=await ctx.newPage();
const errs=[];page.on('pageerror',e=>errs.push('PAGEERROR: '+e.message));page.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE: '+m.text());});
page.on('dialog',d=>d.accept().catch(()=>{}));
await page.goto(base+'/%E6%AE%8B%E5%B1%80%E8%AF%95%E7%8E%A9/index.html',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(2000);
const out=await page.evaluate(()=>{
  const r={demo:window.DD_DEMO===true, unlocks:game.unlocks};
  const btn=document.querySelector('button[onclick="sigilCheck(1)"]');
  const b=game.cyanSigils.toString(); window.confirm=()=>true; window.alert=()=>{};
  try{btn.click();}catch(e){r.threw=String(e);}
  r.sigil={before:b,after:game.cyanSigils.toString()};
  document.getElementById('dragonNameBox').value='残局测试龙';
  changeDragonName(); exportGame();
  const enc=document.getElementById('exportField').value;
  r.name=ddDecodeSave(enc).dragonName; r.isB64=/^[A-Za-z0-9+/=]+$/.test(enc);
  r.writeBlocked = (()=>{ try{localStorage.setItem('dodecaSave','x'); return localStorage.getItem('dodecaSave')!=='x'; }catch(e){ return 'err'; } })();
  return r;
});
await browser.close();
console.log(JSON.stringify({out,errs},null,1));
