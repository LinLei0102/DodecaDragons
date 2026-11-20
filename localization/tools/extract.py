#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract English display strings from DodecaDragons source with exact offsets.

Outputs extracted/worklist.json:
  [{id, file, start, end, en, kind, context}, ...]

kind: js-string | html-text | html-attr
"""
import sys, os, re, json, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "DodecaDragons")
SKILL_SCRIPTS = r"C:/Users/Administrator/.workbuddy/skills/game-localization/scripts"
sys.path.insert(0, SKILL_SCRIPTS)
import jslex  # noqa

SKIP_JS = {"break_eternity.js", "Mousetrap.js"}

CSS_TOKENS = {
    "inline-block", "block", "none", "absolute", "relative", "center", "left", "right",
    "top", "bottom", "bold", "italic", "normal", "pointer", "hidden", "visible", "auto",
    "solid", "dotted", "dashed", "outset", "inset", "middle", "baseline", "text-top",
    "transparent", "white", "black", "red", "green", "blue", "yellow", "orange", "purple",
    "click", "keydown", "keyup", "mousedown", "mouseup", "mousemove", "touchstart",
    "touchmove", "touchend", "change", "input", "load", "resize", "scroll", "focus", "blur",
    "true", "false", "null", "undefined", "on", "off",
}

# string literal is not display text if immediately preceded by these code contexts
NON_DISPLAY_PREFIX = re.compile(
    r"(getElementById|getElementsByClassName|getElementsByTagName|querySelector|querySelectorAll"
    r"|createElement|createTextNode|getAttribute|setAttribute|classList\.(add|remove|toggle|contains)"
    r"|addEventListener|removeEventListener|localStorage\.(getItem|setItem|removeItem)"
    r"|\.style\.[A-Za-z]+\s*=\s*|\.id\s*=\s*|\.className\s*=\s*|\.type\s*=\s*"
    r"|\.name\s*=\s*|\.value\s*=\s*|\.src\s*=\s*|\.href\s*=\s*|\.dataset\.)"
    r"\s*\(\s*['\"]?$"
)


def is_probably_display(raw):
    s = raw.strip()
    if not s or len(s) < 2:
        return False
    if not re.search(r"[A-Za-z]", s):
        return False
    # fragments with intentional leading/trailing whitespace are display text
    if raw != s and not re.search(r"\.(png|jpg|gif|svg|css|js)", raw, re.I):
        return True
    if re.fullmatch(r"#[0-9a-fA-F]{3,8}", s):
        return False
    if re.fullmatch(r"-?[\d.]+(px|em|rem|%|ms|s)?", s):
        return False
    if re.search(r"\.(png|jpg|jpeg|gif|svg|woff2?|js|css|html)$", s, re.I):
        return False
    if re.match(r"^(https?:|data:|img/|fonts/)", s):
        return False
    if s.lower() in CSS_TOKENS:
        return False
    # big-number notation strings (e5, ee10, e1.5e10 etc.)
    if re.fullmatch(r"e{1,2}[+-]?[\d.,eE+]+", s):
        return False
    # roman numerals
    if re.fullmatch(r"I{1,4}V?I{0,4}|X{1,4}", s):
        return False
    # hex-ish / variable-name-ish
    if re.fullmatch(r"[A-Za-z_$][A-Za-z0-9_$]*", s) and s not in {
        "Gold", "Fire", "Platinum", "Magic", "Uranium", "Plutonium", "Oganesson",
        "Magifolds", "Knowledge", "Tomes", "Blood", "Sigils", "Planets", "Essence",
        "On", "Off", "Yes", "No", "None", "Reset", "Save", "Load", "Import", "Export",
    }:
        return False
    # must have a space OR be a known short display word, OR contain HTML entity/tag
    if " " not in s and not re.search(r"[<&]", s) and s not in {
        "Gold", "Fire", "Platinum", "Magic", "Uranium", "Plutonium", "Oganesson",
        "Magifolds", "Knowledge", "Tomes", "Blood", "Sigils", "Planets", "Essence",
        "On", "Off", "Yes", "No", "None", "Reset", "Save", "Load", "Import", "Export",
    }:
        return False
    return True


DISPLAY_ARRAY_RE = re.compile(r"(Names|Texts?|Text|Effects|Modes|Descriptions|Messages|Resources|Rewards|Titles|Labels)$", re.I)
DISPLAY_ARRAY_EXPLICIT = {
    "hellLayerNames", "hellLayerEffects", "hypergodNames", "hypergodText",
    "nuclearPastaNames", "nuclearPastaPositiveEffects", "nuclearPastaNegativeEffects",
    "achievementNames", "sigilResetterModes", "sigilResetterModesFull",
}


def display_array_spans(src, fn):
    """Return (start, end) spans of array literals that hold display text."""
    spans = []
    for m in re.finditer(r"\b(?:const|var|let)\s+([A-Za-z_$][\w$]*)\s*=\s*\[", src):
        name = m.group(1)
        if name not in DISPLAY_ARRAY_EXPLICIT and not DISPLAY_ARRAY_RE.search(name):
            continue
        depth = 0
        i = m.end() - 1
        while i < len(src):
            c = src[i]
            if c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    spans.append((m.start(1), i + 1, name))
                    break
            i += 1
    return spans


# These data arrays are consumed as CODE KEYS (object suffixes / indexOf on raw
# option values), not as pure display text. Their values must remain English.
CODE_KEY_ARRAYS = {"sigilResetterModes"}
# <option> texts inside these <select>s are matched against English arrays via
# .value.toLowerCase() / .indexOf, so they must stay English too.
CODE_KEY_SELECT_IDS = {"sigilResetterType"}


def code_key_ranges(src, fn):
    """Return (start,end) absolute ranges that must never be translated."""
    ranges = []
    for m in re.finditer(r"\b(?:const|var|let)\s+([A-Za-z_$][\w$]*)\s*=\s*\[", src):
        if m.group(1) not in CODE_KEY_ARRAYS:
            continue
        depth, i = 0, m.end() - 1
        while i < len(src):
            if src[i] == "[":
                depth += 1
            elif src[i] == "]":
                depth -= 1
                if depth == 0:
                    ranges.append((m.start(), i + 1))
                    break
            i += 1
    if fn.lower() == "index.html":
        for m in re.finditer(r'<select[^>]*\bid=["\']([^"\']+)["\'][^>]*>(.*?)</select>', src, re.I | re.S):
            if m.group(1) in CODE_KEY_SELECT_IDS:
                ranges.append((m.start(), m.end()))
    return ranges


def display_object_field_spans(src):
    """Spans of value literals for name:/shortName: fields (not internalName)."""
    spans = []
    for m in re.finditer(r"(?<!internal)(?<!\w)(name|shortName|description|desc|effect|text)\s*:\s*(['\"])", src):
        q = m.group(2)
        j = m.end()
        while j < len(src):
            if src[j] == "\\":
                j += 2
                continue
            if src[j] == q:
                spans.append((m.end(), j + 1, m.group(1)))
                break
            j += 1
    return spans


def extract_js():
    out = []
    for fn in sorted(os.listdir(os.path.join(SRC, "scripts"))):
        if not fn.endswith(".js") or fn in SKIP_JS:
            continue
        path = os.path.join(SRC, "scripts", fn)
        src = open(path, encoding="utf-8", errors="replace", newline="").read()
        strings, comments = jslex.scan(src)
        cset = set()
        for a, b in comments:
            cset.update(range(a, b))
        force_spans = display_array_spans(src, fn) + display_object_field_spans(src)
        protected = code_key_ranges(src, fn)
        for s in strings:
            if s["start"] in cset:
                continue
            if any(a <= s["start"] < b for a, b in protected):
                continue
            raw = s["raw"]
            forced = any(a <= s["start"] < b for a, b, _ in force_spans)
            # inside internalName field -> never translate
            if re.search(r"\binternalName\s*:\s*$", src[max(0, s["start"] - 40):s["start"]]):
                continue
            if not forced and not is_probably_display(raw):
                continue
            if forced and not re.search(r"[A-Za-z]", raw):
                continue
            if forced and (re.fullmatch(r"e{1,2}[\d.eE+-]+", raw) or re.fullmatch(r"[IVX]+", raw)):
                continue
            before = src[max(0, s["start"] - 160):s["start"]]
            if NON_DISPLAY_PREFIX.search(before):
                continue
            after = src[s["end"]:s["end"] + 30]
            if re.match(r"\s*\(", after):  # function call name
                continue
            # object key string: "foo":  -> usually not display (but tabFormat keys are; handle later)
            if re.match(r"\s*:\s*[^:=]", after) and re.search(r"[{,]\s*$", before):
                continue
            out.append({
                "file": "scripts/" + fn,
                "start": s["start"],
                "end": s["end"],
                "quote": s["quote"],
                "en": raw,
                "kind": "js-string",
                "context": before[-90:].replace("\n", " ") + " >>> " + raw[:60],
            })
    return out


# ---- HTML extraction: text nodes and title/placeholder/alt/value attributes ----
TAG_RE = re.compile(r"<[^>]+>")
ATTR_RE = re.compile(r"""(title|placeholder|alt|aria-label)\s*=\s*(["'])(.*?)\2""", re.I | re.S)


def is_html_display(s):
    """HTML text nodes are display text; only exclude obvious non-text."""
    if not re.search(r"[A-Za-z]{2}", s):
        return False
    if re.fullmatch(r"[A-Fa-f0-9]{6,}", s):  # hex colors
        return False
    if re.match(r"^(https?:|data:|img/|fonts/)", s):
        return False
    if re.search(r"\.(png|jpg|gif|svg|woff2?|js|css|html)$", s, re.I):
        return False
    return True


def extract_html():
    out = []
    path = os.path.join(SRC, "index.html")
    src = open(path, encoding="utf-8", errors="replace", newline="").read()
    protected = code_key_ranges(src, "index.html")
    # attributes
    for m in ATTR_RE.finditer(src):
        raw = m.group(3)
        if raw.strip() and is_probably_display(raw.strip()) and not any(a <= m.start(3) < b for a, b in protected):
            out.append({
                "file": "index.html", "start": m.start(3), "end": m.end(3),
                "en": raw, "kind": "html-attr",
                "context": src[max(0, m.start() - 80):m.start()].replace("\n", " ") + " >>> " + raw[:60],
            })
    # text nodes (segments outside tags and outside script/style blocks)
    skip_ranges = []
    for m in re.finditer(r"<(script|style)\b[^>]*>.*?</\1\s*>", src, re.I | re.S):
        skip_ranges.append((m.start(), m.end()))
    pos = 0
    for m in TAG_RE.finditer(src):
        seg = src[pos:m.start()]
        if seg and not any(a <= pos < b for a, b in skip_ranges):
            for tm in re.finditer(r"[^\n<]+", seg):
                raw = tm.group(0)
                stripped = raw.strip()
                if not stripped or not is_html_display(stripped):
                    continue
                if any(a <= (pos + tm.start()) < b for a, b in protected):
                    continue
                # keep leading/trailing whitespace and entities untouched by only replacing core
                lead = len(raw) - len(raw.lstrip())
                trail = len(raw) - len(raw.rstrip())
                out.append({
                    "file": "index.html",
                    "start": pos + tm.start() + lead,
                    "end": pos + tm.end() - trail if trail else pos + tm.end(),
                    "en": stripped,
                    "kind": "html-text",
                    "context": seg[max(0, tm.start() - 60):tm.start()].replace("\n", " ") + " >>> " + stripped[:60],
                })
        pos = m.end()
    return out


def main():
    items = extract_js() + extract_html()
    # stable id
    for i, it in enumerate(items):
        it["id"] = "s%04d" % i
    items.sort(key=lambda x: (x["file"], x["start"]))
    for i, it in enumerate(items):
        it["id"] = "s%04d" % i
    with open(os.path.join(ROOT, "extracted", "worklist.json"), "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    # unique strings for translation
    seen = {}
    for it in items:
        seen.setdefault(it["en"], []).append(it["id"])
    uniq = [{"en": k, "ids": v} for k, v in seen.items()]
    with open(os.path.join(ROOT, "extracted", "unique.json"), "w", encoding="utf-8") as f:
        json.dump(uniq, f, ensure_ascii=False, indent=1)
    print("worklist items:", len(items), "unique strings:", len(uniq))
    from collections import Counter
    print(Counter(it["kind"] for it in items))
    print(Counter(it["file"] for it in items).most_common())


if __name__ == "__main__":
    main()
