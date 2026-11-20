#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build 汉化版/ and 英文版/ from the pristine clone + translated dictionary."""
import os, sys, json, shutil, re, hashlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "DodecaDragons")
ZH = os.path.join(ROOT, "汉化版")
EN = os.path.join(ROOT, "英文版")
GAME_TITLE = "十二龙"  # DodecaDragons -> localized game name (all display occurrences)

# sigilColours values ("cyan","blue",...) are used BOTH as display text and as
# code keys (game[sigilColour+"Sigils"], select .value matching). Translating
# the array itself breaks saves, so we add a display-only Chinese array and swap
# it in solely at the display concatenation in knowledge.js.
SIGIL_COLOURS_ZH_DECL = (
    '\r\n// display-only localized sigil colour names (code keys stay English)\r\n'
    'const SIGIL_COLOURS_ZH = ["青色", "蓝色", "靛色", "紫色", "粉色", "红色", "橙色", "黄色"];\r\n'
)

# Language-switch button now lives INSIDE the Settings panel window-body,
# injected right before the (globally unique) save() button.
LANG_BUTTON = """      <button style="width: 142px; margin-top: 4px" onclick="ddSwitchLang()" title="中文 / English">&#8202;&#8202;中文 / EN</button><br>
"""

LANG_SCRIPT = """
<script>
function ddSwitchLang(){
  var cur = document.documentElement.getAttribute('data-dd-lang') || 'en';
  var next = (cur === 'zh') ? 'en' : 'zh';
  try { localStorage.setItem('dd_lang', next); } catch(e) {}
  location.href = (next === 'zh')
    ? new URL('../%E6%B1%89%E5%8C%96%E7%89%88/index.html', location.href).href
    : new URL('../%E8%8B%B1%E6%96%87%E7%89%88/index.html', location.href).href;
}
</script>
"""

ZH_STYLE = """
<style>
body, button, input, select, textarea, .title-bar-text { font-family: 'Microsoft YaHei', 'MS Sans Serif', sans-serif !important; }
</style>
"""

# Runtime-only safety net for saves. It does NOT touch any game source file:
# the existing 5s autosave keeps running; this only adds an immediate flush on
# page exit / tab hide, plus a small status line inside the Settings panel.
AUTOSAVE_STATUS = {
    True:  '<div id="ddAutosaveStatus" style="font-size:11px;margin:2px 0 4px;color:#444">'
           '自动存档：开启（每 5 秒，关闭时补存）</div>',
    False: '<div id="ddAutosaveStatus" style="font-size:11px;margin:2px 0 4px;color:#444">'
           'Autosave: on (every 5s, plus on exit)</div>',
}


def autosave_guard_script(is_zh):
    """Block save writes until load() has completed, and stop stale tabs."""
    stale = ("检测到其他标签页更新了存档，本页已停止自动保存，请关闭本页。"
             if is_zh else
             "Another tab updated the save. Autosave stopped here; close this tab.")
    return """<script>
(function(){
  if (window.DD_DEMO === true) return;
  window.__ddLoaded = false;
  window.__ddStale = false;
  window.__ddGuardMsg = '';
  var orig = Storage.prototype.setItem;
  Storage.prototype.setItem = function(k, v){
    if (k === 'dodecaSave' || k === 'dodecaLastSaved') {
      if (!window.__ddLoaded || window.__ddStale) return;
    }
    return orig.apply(this, arguments);
  };
  window.addEventListener('storage', function(e){
    if (e.key !== 'dodecaSave' || !e.newValue) return;
    try {
      var incoming = JSON.parse(e.newValue);
      var mine = (typeof game !== 'undefined' && game && game.lastSave) || 0;
      if (incoming.lastSave > mine) {
        window.__ddStale = true;
        window.__ddGuardMsg = %s;
      }
    } catch(err) {}
  });
})();
</script>
""" % json.dumps(stale, ensure_ascii=False)


def autosave_script(is_zh):
    saved = "已保存 {time}" if is_zh else "Saved {time}"
    live = "自动存档：开启 · 上次保存 {time}" if is_zh else "Autosave: on · last {time}"
    loadfail = "存档加载失败，已保留原档；请勿自动覆盖。" if is_zh else "Save load failed; original kept, autosave blocked."
    stale = "检测到其他标签页更新了存档，本页已停止自动保存，请关闭本页。" if is_zh else "Another tab updated the save. Autosave stopped here; close this tab."
    return """<script>
(function(){
  if (window.DD_DEMO === true || window.ddAutosaveShield) return;
  window.ddAutosaveShield = true;
  var SAVED = %s, LIVE = %s, LOADFAIL = %s, STALE = %s;
  function stamp(ms){
    var d = new Date(ms);
    function p(n){ return n < 10 ? '0' + n : '' + n; }
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }
  function status(){
    return document.getElementById('ddAutosaveStatus');
  }
  function show(text){
    var el = status();
    if (el && text) el.textContent = text;
  }
  function lastSaved(){
    try { return parseInt(localStorage.getItem('dodecaLastSaved') || '0', 10) || 0; }
    catch(e) { return 0; }
  }
  function flush(){
    if (!window.__ddLoaded || window.__ddStale) return;
    var now = Date.now();
    if (now - lastSaved() < 1000) return;
    try {
      if (typeof save === 'function') save();
      show(SAVED.replace('{time}', stamp(Date.now())));
    } catch(e) {}
  }
  // Only allow save writes once load()/loadGame() has finished. If load()
  // threw (malformed/old save), the guard stays on and the original is kept.
  var cover = document.getElementById('loadingScreenCover');
  if (cover && cover.style.display === 'none') {
    window.__ddLoaded = true;
  } else {
    show(LOADFAIL);
  }
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'hidden') flush();
  });
  setInterval(function(){
    if (window.__ddStale) { show(window.__ddGuardMsg || STALE); return; }
    if (!window.__ddLoaded) return;
    var t = lastSaved();
    if (t > 0) show(LIVE.replace('{time}', stamp(t)));
  }, 2000);
})();
</script>
""" % (json.dumps(saved, ensure_ascii=False), json.dumps(live, ensure_ascii=False),
       json.dumps(loadfail, ensure_ascii=False), json.dumps(stale, ensure_ascii=False))


def merge_dictionary():
    d = {}
    for fn in sorted(os.listdir(os.path.join(ROOT, "translated", "chunks"))):
        if not fn.endswith(".json"):
            continue
        part = json.load(open(os.path.join(ROOT, "translated", "chunks", fn), encoding="utf-8"))
        for k, v in part.items():
            if k in d and d[k] != v:
                print("CONFLICT", fn, repr(k), repr(d[k]), repr(v), file=sys.stderr)
            d[k] = v
    with open(os.path.join(ROOT, "translated", "dictionary.json"), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    return d


def esc_literal(text, quote):
    """Escape quote characters that would close the JS literal."""
    out = []
    for i, ch in enumerate(text):
        if ch == quote:
            # count preceding backslashes
            j = i - 1
            n = 0
            while j >= 0 and text[j] == "\\":
                n += 1
                j -= 1
            if n % 2 == 0:
                out.append("\\")
        out.append(ch)
    return "".join(out)


def apply_translations(dst_root, dictionary):
    worklist = json.load(open(os.path.join(ROOT, "extracted", "worklist.json"), encoding="utf-8"))
    by_file = {}
    for it in worklist:
        by_file.setdefault(it["file"], []).append(it)
    report = {}
    for rel, items in by_file.items():
        path = os.path.join(dst_root, rel.replace("/", os.sep))
        src = open(path, encoding="utf-8", newline="").read()
        # apply from end to start so offsets stay valid
        items = sorted(items, key=lambda x: x["start"], reverse=True)
        applied = missing = 0
        for it in items:
            en = it["en"]
            zh = dictionary.get(en)
            if not zh or zh == en:
                missing += 1
                continue
            if it["kind"] == "js-string":
                repl = it["quote"] + esc_literal(zh, it["quote"]) + it["quote"]
            else:
                repl = zh
            before = src[it["start"]:it["end"]]
            expect = (it["quote"] + en + it["quote"]) if it["kind"] == "js-string" else en
            if before != expect:
                print("OFFSET MISMATCH", rel, it["id"], repr(before[:60]), repr(expect[:60]), file=sys.stderr)
                sys.exit(2)
            src = src[:it["start"]] + repl + src[it["end"]:]
            applied += 1
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(src)
        report[rel] = {"applied": applied, "unchanged": missing, "total": len(items)}
    return report


def inject_switch(dst_root, is_zh):
    path = os.path.join(dst_root, "index.html")
    src = open(path, encoding="utf-8", newline="").read()
    if "ddSwitchLang" in src:
        return
    # set language marker on <html>
    m = re.search(r"<html[^>]*>", src)
    if m:
        tag = m.group(0)
        newtag = tag[:-1] + ' data-dd-lang="%s">' % ("zh" if is_zh else "en")
        src = src[:m.start()] + newtag + src[m.end():]

    if is_zh:
        # Localize the game title everywhere, incl. <title>, window title bar,
        # big title, final screen and <meta og:title> (the last one is an
        # attribute, so the text-node extractor never sees it). No JS code key
        # uses this name, so a global display replace is safe.
        src = src.replace("DodecaDragons", GAME_TITLE)

    # Put the language switch INSIDE the Settings panel of BOTH builds, at the
    # top of its window-body, right before the manual-save button. Keeping it
    # in both builds preserves a two-way switch (EN build can go back to ZH).
    anchor = '<button style="width: 142px; margin-top: 4px" onclick="save()">'
    q = src.find(anchor)
    if q < 0:
        print("settings save() anchor not found", path, file=sys.stderr)
        sys.exit(4)
    src = src[:q] + LANG_BUTTON + src[q:]

    # script for the switch function goes before </body>
    inject = (ZH_STYLE if is_zh else "") + LANG_SCRIPT
    idx = src.rfind("</body>")
    if idx < 0:
        print("no </body>", path, file=sys.stderr)
        sys.exit(3)
    src = src[:idx] + inject + src[idx:]
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(src)


def inject_autosave(dst_root, is_zh):
    """Add a runtime-only save safety net; game source files are untouched."""
    path = os.path.join(dst_root, "index.html")
    src = open(path, encoding="utf-8", newline="").read()
    if "ddAutosaveShield" in src:
        return
    eol = "\r\n" if "\r\n" in src else "\n"

    anchor = '<button style="width: 142px; margin-top: 4px" onclick="save()">'
    q = src.find(anchor)
    if q < 0:
        print("settings save() anchor not found for autosave", path, file=sys.stderr)
        sys.exit(5)
    status = AUTOSAVE_STATUS[is_zh].replace("\n", eol)
    src = src[:q] + status + eol + src[q:]

    # Guard must run BEFORE game scripts so the built-in 5s interval cannot
    # write a reset/empty save while a slow-loading page has not called load().
    guard_anchor = "  <!--List o' scripts-->"
    g = src.find(guard_anchor)
    if g < 0:
        print("script list anchor not found for autosave guard", path, file=sys.stderr)
        sys.exit(7)
    g += len(guard_anchor)
    guard = autosave_guard_script(is_zh).replace("\n", eol)
    src = src[:g] + eol + guard + src[g:]

    script = autosave_script(is_zh).replace("\n", eol)
    idx = src.rfind("</body>")
    if idx < 0:
        print("no </body> for autosave", path, file=sys.stderr)
        sys.exit(6)
    src = src[:idx] + script + src[idx:]
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(src)


def patch_display_colours(dst_root):
    """Chinese sigil colour names in DISPLAY-only spots; keep code keys English."""
    # 1) define display array in constants.js (place it right after sigilColours)
    cpath = os.path.join(dst_root, "scripts", "constants.js")
    csrc = open(cpath, encoding="utf-8", newline="").read()
    anchor = 'const sigilColours = ["cyan", "blue", "indigo", "violet", "pink", "red", "orange", "yellow"]'
    if anchor in csrc and "SIGIL_COLOURS_ZH" not in csrc:
        eol = "\r\n" if "\r\n" in csrc else "\n"
        decl = SIGIL_COLOURS_ZH_DECL.replace("\r\n", eol)
        csrc = csrc.replace(anchor, anchor + decl, 1)
        with open(cpath, "w", encoding="utf-8", newline="") as f:
            f.write(csrc)

    # 2) swap only the display concatenations in knowledge.js innerHTML
    kpath = os.path.join(dst_root, "scripts", "knowledge.js")
    ksrc = open(kpath, encoding="utf-8", newline="").read()
    disp = '+ " " + sigilColours['
    if disp in ksrc:
        n = ksrc.count(disp)
        ksrc = ksrc.replace(disp, '+ " " + SIGIL_COLOURS_ZH[')
        with open(kpath, "w", encoding="utf-8", newline="") as f:
            f.write(ksrc)
        print("display colour names localized:", n)


def md5(path):
    return hashlib.md5(open(path, "rb").read()).hexdigest()


def main():
    dictionary = merge_dictionary()
    print("dictionary entries:", len(dictionary))
    for dst, is_zh in ((EN, False), (ZH, True)):
        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(SRC, dst, ignore=shutil.ignore_patterns(".git"))
    # apply translations FIRST (offsets are based on pristine source)
    report = apply_translations(ZH, dictionary)
    # then inject the language switch into both entries
    inject_switch(EN, False)
    inject_switch(ZH, True)
    # runtime-only save safety net (no game source file is modified)
    inject_autosave(EN, False)
    inject_autosave(ZH, True)
    # localize sigil colour names in display-only spots (code keys stay English)
    patch_display_colours(ZH)
    print(json.dumps(report, ensure_ascii=False, indent=1))
    # baseline record
    base = {
        "commit": open(os.path.join(SRC, ".git", "HEAD"), encoding="utf-8").read().strip(),
        "source_md5_index": md5(os.path.join(SRC, "index.html")),
        "dictionary_entries": len(dictionary),
        "apply_report": report,
    }
    json.dump(base, open(os.path.join(ROOT, "build-report.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
