#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Split unique.json into translation chunks."""
import os, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
uniq = json.load(open(os.path.join(ROOT, "extracted", "unique.json"), encoding="utf-8"))
chunk_dir = os.path.join(ROOT, "extracted", "chunks")
os.makedirs(chunk_dir, exist_ok=True)
N = 90
chunks = [uniq[i:i + N] for i in range(0, len(uniq), N)]
for i, ch in enumerate(chunks, 1):
    with open(os.path.join(chunk_dir, "chunk_%02d.json" % i), "w", encoding="utf-8") as f:
        json.dump(ch, f, ensure_ascii=False, indent=1)
print("chunks:", len(chunks), "sizes:", [len(c) for c in chunks])
