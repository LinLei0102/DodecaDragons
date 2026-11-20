#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validate translation dictionary: coverage, tags/entities, numbers, identifiers."""
import os, re, json, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TOKEN_RES = {
    "tag": re.compile(r"</?[A-Za-z][^>]*>"),
    "entity": re.compile(r"&(?:#\d+|[A-Za-z]+);"),
    "number": re.compile(r"\b\d[\d,.]*\b"),
    "bignum": re.compile(r"\be{1,2}[+-]?[\d][\d.,]*(?:e[\d.,]+)?"),
    "unit": re.compile(r"/(?:s|click)\b"),
    "code": re.compile(r"\b(?:getElementById|innerHTML|textContent|localStorage|function|var|const)\b"),
}

STOPWORDS = {
    "the", "a", "an", "of", "to", "and", "or", "in", "on", "at", "is", "are", "you",
    "your", "this", "it", "for", "with", "from", "as", "by", "be", "has", "have",
}


def tokens(s):
    out = {}
    for name, rx in TOKEN_RES.items():
        out[name] = Counter(x.lower() for x in rx.findall(s))
    return out


def main():
    uniq = json.load(open(os.path.join(ROOT, "extracted", "unique.json"), encoding="utf-8"))
    expected = [x["en"] for x in uniq]
    dpath = os.path.join(ROOT, "translated", "dictionary.json")
    if not os.path.exists(dpath):
        print("missing dictionary", file=sys.stderr)
        sys.exit(2)
    d = json.load(open(dpath, encoding="utf-8"))
    missing = [k for k in expected if k not in d]
    extra = [k for k in d if k not in set(expected)]
    print("expected=%d dict=%d missing=%d extra=%d" % (len(expected), len(d), len(missing), len(extra)))
    if missing:
        print("MISSING sample:", [m[:80] for m in missing[:15]])

    problems = []
    leakage = []
    for en, zh in d.items():
        te, tz = tokens(en), tokens(zh)
        for name in te:
            if te[name] != tz[name]:
                problems.append((en, name, te[name], tz[name]))
        # English leakage: 3+ consecutive English words (allow glossary proper nouns)
        words = re.findall(r"\b[A-Za-z]{3,}\b", zh)
        low = [w.lower() for w in words]
        run = 0
        for w in low:
            if w in STOPWORDS:
                continue
            run += 1
            if run >= 3:
                leakage.append((en, zh))
                break
        else:
            continue
    print("token-mismatch entries:", len(problems))
    for p in problems[:30]:
        print("  TOKEN", p[1], repr(p[0][:70]), dict(p[2]), "->", dict(p[3]))
    print("english-leakage entries:", len(leakage))
    for en, zh in leakage[:30]:
        print("  LEAK", repr(en[:70]), "->", repr(zh[:90]))
    if missing or problems:
        sys.exit(1)


if __name__ == "__main__":
    main()
