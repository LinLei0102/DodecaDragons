# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tools'))
import extract

def covered(src, ranges, needle, nth=0):
    idx = -1
    for _ in range(nth + 1):
        idx = src.find(needle, idx + 1)
    if idx < 0:
        return None
    return any(a <= idx < b for a, b in ranges)

res = {}
sig = open('DodecaDragons/scripts/sigils.js', encoding='utf-8').read()
r = extract.code_key_ranges(sig, 'sigils.js')
res['sigils: + "Sigils"'] = covered(sig, r, '"Sigils"')
res['sigils: "SigilsToGet"'] = covered(sig, r, '"SigilsToGet"')
res['sigils: confirm text NOT covered'] = covered(sig, r, '"Are you sure you want to perform a sigil reset?"')

kn = open('DodecaDragons/scripts/knowledge.js', encoding='utf-8').read()
rk = extract.code_key_ranges(kn, 'knowledge.js')
res['knowledge: "Sigils"'] = covered(kn, rk, '"Sigils"')
res['knowledge: "Amounts"'] = covered(kn, rk, '"Amounts"')

fi = open('DodecaDragons/scripts/fire.js', encoding='utf-8').read()
rf = extract.code_key_ranges(fi, 'fire.js')
res['fire: \'fireUpgrade\' fragment'] = covered(fi, rf, "'fireUpgrade'")
res['fire: display string NOT covered'] = covered(fi, rf, '"Auto max all: On"')

sc = open('DodecaDragons/scripts/script.js', encoding='utf-8').read()
rs = extract.code_key_ranges(sc, 'script.js')
res['script: dragonName key'] = covered(sc, rs, '"dragonName"')
res['script: display "Copied to clipboard!" NOT covered'] = covered(sc, rs, '"Copied to clipboard!"')
print(res)
