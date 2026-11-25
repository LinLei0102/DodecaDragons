#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rebuild 残局试玩/ (endgame demo) from the freshly built 汉化版/.

The demo is the Chinese build with two changes:
  1. localStorage writes are blocked (window.DD_DEMO) so the demo can never
     overwrite the player's real save;
  2. load() is replaced by an inline reset()+loadGame(<endgame save>) so it
     boots straight into the finished game.
"""
import os, re, json, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZH = os.path.join(ROOT, "汉化版")
DEMO = os.path.join(ROOT, "残局试玩")
DEMO_HTML = os.path.join(DEMO, "index.html")

SAVE_ANCHOR_RE = re.compile(r"var saveObj = (\{.*?\});\r?\n", re.S)

DEMO_BLOCK = """  <script>
  /* 残局试玩：屏蔽存档写入，避免内置自动保存覆盖正式存档 */
  (function(){
    window.DD_DEMO = true;
    var orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k, v){
      if (k === 'dodecaSave' || k === 'dodecaLastSaved') return;
      return orig.apply(this, arguments);
    };
  })();
  </script>"""


def main():
    if not os.path.exists(DEMO_HTML):
        print("existing demo index.html not found", DEMO_HTML, file=sys.stderr)
        sys.exit(2)
    old = open(DEMO_HTML, encoding="utf-8", newline="").read()
    m = SAVE_ANCHOR_RE.search(old)
    if not m:
        print("embedded endgame save not found in demo", file=sys.stderr)
        sys.exit(3)
    save_obj = m.group(1)
    json.loads(save_obj)  # sanity check

    if os.path.exists(DEMO):
        shutil.rmtree(DEMO)
    shutil.copytree(ZH, DEMO)

    path = os.path.join(DEMO, "index.html")
    src = open(path, encoding="utf-8", newline="").read()
    eol = "\r\n" if "\r\n" in src else "\n"

    loader = (
        "  <script>" + eol
        + "  /* 一键试玩：直接载入通关残局，不写入 localStorage，正式版存档不受影响 */" + eol
        + "  (function(){" + eol
        + "    var saveObj = " + save_obj + ";" + eol
        + '    try { reset(); loadGame(saveObj); document.getElementById("loadingScreenCover").style.display = "none"; }' + eol
        + '    catch(e) { console.error("残局载入失败", e); }' + eol
        + "  })();" + eol
        + "  </script>"
    )
    boot = "<script>load(); if (!isDevVersion) setAutoSave()</script>"
    if boot not in src:
        print("boot anchor not found", path, file=sys.stderr)
        sys.exit(4)
    src = src.replace(boot, loader, 1)

    anchor = "  <!--List o' scripts-->"
    i = src.find(anchor)
    if i < 0:
        print("script-list anchor not found", path, file=sys.stderr)
        sys.exit(5)
    i += len(anchor)
    src = src[:i] + eol + DEMO_BLOCK.replace("\n", eol) + src[i:]

    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(src)
    print("demo rebuilt:", DEMO)


if __name__ == "__main__":
    main()
