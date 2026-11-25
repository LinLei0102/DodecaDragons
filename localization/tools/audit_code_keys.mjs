// Static audit v2: only literals that are PROPERTY KEYS (inside obj[...]),
// DOM selectors, storage keys or comparison operands. Reports every literal
// the Chinese build no longer carries in the same role.
import fs from 'fs';
import path from 'path';

const SRC = 'DodecaDragons';
const ZH = '汉化版';
const DOM_FNS = new Set(['getElementById', 'getElementsByClassName', 'getElementsByName', 'querySelector', 'querySelectorAll']);
const CMP_OPS = new Set(['===', '==', '!==', '!=']);
const TICK = String.fromCharCode(96);

function scan(src) {
  const out = [];
  const prev = [];
  const ctx = [];
  const push = (t) => { prev.push(t); if (prev.length > 8) prev.shift(); };
  const last = (n) => prev[prev.length - 1 - (n || 0)];
  let i = 0;
  const nextChar = (j) => { while (j < src.length && /\s/.test(src[j])) j++; return src[j] || ''; };
  const readString = (q) => {
    let j = i + 1, s = '';
    while (j < src.length) {
      const c = src[j];
      if (c === '\\') { s += src[j + 1] || ''; j += 2; continue; }
      if (c === q) break;
      s += c; j++;
    }
    return { s, end: j + 1 };
  };
  const isRegexPos = () => {
    const p = last();
    if (!p) return true;
    if (p.t === 'num' || p.t === 'str' || p.t === 're') return false;
    if (p.t === 'id') return ['return', 'typeof', 'case', 'in', 'of', 'new', 'delete', 'void', 'instanceof', 'else', 'do'].includes(p.v);
    if (p.t === 'op') return !(p.v === ')' || p.v === ']');
    return true;
  };
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '"' || c === "'") {
      const { s, end } = readString(c);
      const p1 = last(0), p2 = last(1), p3 = last(2);
      const nx = nextChar(end);
      const top = ctx[ctx.length - 1];
      if (top && top.access) out.push({ cat: 'key', value: s });
      for (let k = ctx.length - 1; k >= 0; k--) {
        if (ctx[k].assignName) { out.push({ cat: 'array:' + ctx[k].assignName, value: s }); break; }
        if (ctx[k].access) break;
      }
      if (p1 && p1.t === 'op' && p1.v === '+' && p2 && p2.t !== 'str' && p2.t !== 'num') out.push({ cat: 'fragment', value: s });
      if (src.slice(end).trimStart().startsWith('+') && !/^\+\s*['"]/.test(src.slice(end).trimStart())) out.push({ cat: 'fragment', value: s });
      if (p1 && p1.t === 'op' && p1.v === '(' && p2 && p2.t === 'id' && DOM_FNS.has(p2.v)) out.push({ cat: 'dom', value: s });
      if (p1 && p1.t === 'op' && p1.v === '(' && p2 && p2.t === 'id' && ['setItem', 'getItem', 'removeItem'].includes(p2.v)) out.push({ cat: 'storage', value: s });
      if (p1 && p1.t === 'id' && p1.v === 'case') out.push({ cat: 'switch', value: s });
      if ((p1 && p1.t === 'op' && CMP_OPS.has(p1.v)) || /^(===|==|!==|!=)/.test(src.slice(end).trimStart())) out.push({ cat: 'compare', value: s });
      push({ t: 'str' });
      i = end;
      continue;
    }
    if (c === TICK) {
      let j = i + 1, s = '';
      while (j < src.length) {
        const ch = src[j];
        if (ch === '\\') { s += src[j + 1] || ''; j += 2; continue; }
        if (ch === TICK) break;
        if (ch === '$' && src[j + 1] === '{') { while (j < src.length && src[j] !== '}') j++; j++; continue; }
        s += ch; j++;
      }
      const top = ctx[ctx.length - 1];
      if (top && top.access) out.push({ cat: 'key', value: s });
      push({ t: 'str' });
      i = j + 1;
      continue;
    }
    if (c === '/') {
      if (isRegexPos()) {
        let j = i + 1, inClass = false;
        while (j < src.length) {
          const ch = src[j];
          if (ch === '\\') { j += 2; continue; }
          if (ch === '[') inClass = true;
          else if (ch === ']') inClass = false;
          else if (ch === '/' && !inClass) break;
          j++;
        }
        i = j + 1; push({ t: 're' }); continue;
      }
      i++; push({ t: 'op', v: '/' }); continue;
    }
    if (c === '[') {
      const p = last(), p2 = last(1);
      const access = !!(p && (p.t === 'id' || (p.t === 'op' && (p.v === ')' || p.v === ']'))));
      const assignName = (p && p.t === 'op' && p.v === '=' && p2 && p2.t === 'id') ? p2.v : null;
      ctx.push({ access, assignName, depth: ctx.length });
      push({ t: 'op', v: '[' }); i++; continue;
    }
    if (c === '(' || c === '{') { ctx.push({ access: false, depth: ctx.length }); push({ t: 'op', v: c }); i++; continue; }
    if (c === ')' || c === ']' || c === '}') { ctx.pop(); push({ t: 'op', v: c }); i++; continue; }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_$]/.test(src[j])) j++;
      push({ t: 'id', v: src.slice(i, j) }); i = j; continue;
    }
    if (/[0-9]/.test(c)) { let j = i; while (j < src.length && /[0-9a-fxX.]/.test(src[j])) j++; push({ t: 'num' }); i = j; continue; }
    const three = src.slice(i, i + 3);
    if (three === '===' || three === '!==') { push({ t: 'op', v: three }); i += 3; continue; }
    const two = src.slice(i, i + 2);
    if (['==', '!=', '=>', '+=', '-=', '>=', '<='].includes(two)) { push({ t: 'op', v: two }); i += 2; continue; }
    if (/\s/.test(c)) { i++; continue; }
    push({ t: 'op', v: c }); i++;
  }
  return out;
}

function multiset(entries) {
  const m = new Map();
  for (const e of entries) {
    const k = e.cat + '|' + e.value;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
}
function diffSets(base, other) {
  const missing = [];
  for (const [k, n] of base) {
    const m = other.get(k) || 0;
    if (m < n) missing.push({ cat: k.split('|')[0], value: k.split('|').slice(1).join('|'), count: n - m });
  }
  return missing;
}

const report = { files: [], summary: { literalRoles: 0, missing: 0 } };
const files = fs.readdirSync(path.join(SRC, 'scripts')).filter(f => f.endsWith('.js')).sort();
for (const f of files) {
  const a = multiset(scan(fs.readFileSync(path.join(SRC, 'scripts', f), 'utf8')));
  const b = multiset(scan(fs.readFileSync(path.join(ZH, 'scripts', f), 'utf8')));
  const missing = diffSets(a, b);
  report.summary.literalRoles += a.size;
  if (missing.length) {
    report.summary.missing += missing.length;
    report.files.push({ file: f, missing });
  }
}
const CODE_ARRAYS = new Set(['panResistantFields', 'keysToDelete', 'sigilColours', 'sigilColoursMode1', 'sigilResetterModes']);
function isCodeRole(e) {
  if (['key', 'dom', 'storage', 'switch'].includes(e.cat)) return true;
  if (e.cat.startsWith('array:')) return CODE_ARRAYS.has(e.cat.slice(6));
  if (e.cat === 'fragment') return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(e.value) && e.value.length >= 4;
  return false;
}
report.codeOnly = report.files
  .map((f) => ({ file: f.file, missing: f.missing.filter(isCodeRole) }))
  .filter((f) => f.missing.length);
report.codeOnlyTotal = report.codeOnly.reduce((a, f) => a + f.missing.length, 0);

// category totals (sanity: dom should be in the hundreds)
const catTotals = {};
for (const f of files) {
  for (const e of scan(fs.readFileSync(path.join(SRC, 'scripts', f), 'utf8'))) {
    catTotals[e.cat] = (catTotals[e.cat] || 0) + 1;
  }
}
report.categoryTotals = catTotals;
console.log(JSON.stringify(report, null, 1));
