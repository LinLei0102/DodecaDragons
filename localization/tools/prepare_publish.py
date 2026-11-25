#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prepare the zh-branch publish tree inside _publish_zh/.

Layout on the zh branch:
  <root>            = 汉化版 game (playable, works as GitHub Pages site root)
  英文版/            = pristine English build
  残局试玩/          = endgame demo build
  localization/     = tools, dictionary, extraction/verification data, docs
"""
import os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGE = os.path.join(ROOT, "_publish_zh")

def cp(src, dst):
    if os.path.isdir(src):
        shutil.copytree(src, dst)
    else:
        shutil.copy2(src, dst)

def rm(path):
    if os.path.isdir(path):
        shutil.rmtree(path)
    elif os.path.exists(path):
        os.remove(path)

# 1) wipe everything except .git
for name in os.listdir(STAGE):
    if name != ".git":
        rm(os.path.join(STAGE, name))

# 2) root = 汉化版
zh = os.path.join(ROOT, "汉化版")
for name in os.listdir(zh):
    cp(os.path.join(zh, name), os.path.join(STAGE, name))

# 3) English build + demo as subfolders
cp(os.path.join(ROOT, "英文版"), os.path.join(STAGE, "英文版"))
cp(os.path.join(ROOT, "残局试玩"), os.path.join(STAGE, "残局试玩"))

# 4) build assets & docs
loc = os.path.join(STAGE, "localization")
os.makedirs(loc)
for name in ["tools", "translated", "extracted", "verification"]:
    cp(os.path.join(ROOT, name), os.path.join(loc, name))
for name in ["glossary.md", "验收报告.md", "残局存档.b64.txt", "build-report.json"]:
    cp(os.path.join(ROOT, name), os.path.join(loc, name))

# 5) make sure no node_modules sneaks in
for dirpath, dirnames, _ in os.walk(STAGE):
    if ".git" in dirnames:
        dirnames.remove(".git")
    for d in list(dirnames):
        if d == "node_modules":
            rm(os.path.join(dirpath, d))
            dirnames.remove(d)

# 6) rewrite the language-switch function for the new layout.
#    root=ZH, 英文版/=EN, 残局试玩/=demo(ZH)
def patch_switch(path, zh_url, en_url):
    p = os.path.join(STAGE, path)
    s = open(p, encoding="utf-8", newline="").read()
    start = s.find("function ddSwitchLang(){")
    end = s.find("</script>", start)
    if start < 0 or end < 0:
        print("WARN switch not found in", path)
        return
    new_fn = (
        "function ddSwitchLang(){\n"
        "  var cur = document.documentElement.getAttribute('data-dd-lang') || 'en';\n"
        "  var next = (cur === 'zh') ? 'en' : 'zh';\n"
        "  try { localStorage.setItem('dd_lang', next); } catch(e) {}\n"
        "  location.href = new URL(next === 'zh' ? %s : %s, location.href).href;\n"
        "}\n" % (repr(zh_url).replace("'", "'"), repr(en_url))
    )
    # repr() uses single quotes; fine for JS strings here (paths have no quotes)
    s = s[:start] + new_fn + s[end:]
    open(p, "w", encoding="utf-8", newline="").write(s)
    print("switch patched:", path, "->", zh_url, "/", en_url)

patch_switch("index.html", "index.html", "%E8%8B%B1%E6%96%87%E7%89%88/index.html")
patch_switch("英文版/index.html", "../index.html", "index.html")
patch_switch("残局试玩/index.html", "index.html", "%E8%8B%B1%E6%96%87%E7%89%88/index.html")

# 7) .nojekyll so GitHub Pages serves all files verbatim
open(os.path.join(STAGE, ".nojekyll"), "w").write("")

# 8) README
readme = """# 十二龙（DodecaDragons）简体中文汉化版

一款增量放置网页游戏的完整简体中文汉化。仓库根目录即中文版游戏入口。

## 在线游玩

本仓库的 `zh` 分支可直接用作 GitHub Pages 站点（已附 `.nojekyll`）：
在仓库 Settings → Pages 中把 Source 设为 `zh` 分支 / root 即可。

## 本地运行

用浏览器打开根目录下的 `index.html` 即可游玩。若浏览器对 `localStorage` 有限制，
建议用本地 HTTP 服务（例如在仓库根目录执行 `python -m http.server 8000`，
再访问 `http://localhost:8000/`）。

## 界面与语言

- **语言切换**：打开左上角「设置」面板，点击其中的「中文 / EN」按钮。
  中文版在游戏窗口标题栏显示「十二龙」；英文版显示 `DodecaDragons`。
- **中英对照**：`英文版/` 目录是与原版逐字一致的英文版，切换按钮可在两版间跳转，
  两版共用同一个存档键 `dodecaSave`。
- **一键试玩**：`残局试玩/index.html` 是内置通关存档的演示版（金币 ee1e12、
  全内容解锁），打开即可看到后期全部面板；已屏蔽存档写入，不会覆盖正式存档。

## 存档与自动保存

- 游戏本体自带每 5 秒自动保存；实测在汉化版中正常写入 `localStorage.dodecaSave`。
- 本次额外加入一层**运行时保险**（不改游戏源码）：在关闭页面、切换标签页离开时
  立即补存一次，并在「设置」面板显示最近保存时间。
- 针对“有自动保存仍丢档”做了三重防护：慢加载时禁止在 `load()` 完成前写空档；
  `load()` 失败（坏档/旧档）时保留原档并阻断自动覆盖；检测到其他标签页写入更新
  存档时，旧标签页自动停止保存并提示关闭。
- 手动保存、导入 / 导出存档、中英切换共用同一个存档键，互不干扰。
- **文件存档**：设置面板里「导出文件 / 导入文件」可把存档下载成 `.txt`
  （UTF-8 base64，与剪贴板串同格式）或从 `.txt` / `.json` 文件导入，切换设备、
  备份、备份回滚都不再依赖剪贴板。
- **中文龙名**：龙名可放心用中文。旧版 `btoa(JSON.stringify(game))` 遇到中文字符
  会抛 `InvalidCharacterError` 导致导出失效，现已改为 UTF-8 安全编解码，并兼容
  旧档（纯 ASCII base64）导入。

## 汉化说明

- 游戏本体无内置语言系统、文本硬编码，故采用源码补丁方式汉化：
  提取全部界面文本到词典，统一翻译后按偏移回填，产出中英两套完整入口。
- 词典 1325 条，替换 1910 处；HTML 标签、大数记号、占位符原样保留。
- 作为代码键使用的字符串（如符印重置模式、颜色数组值、下拉框选项值）
  刻意保留英文，以免破坏存档加载。
- 详细术语表见 `localization/glossary.md`，验收细节见 `localization/验收报告.md`。
- 构建工具（提取 / 回填 / 校验 / 浏览器探针）在 `localization/tools/`。

## 已知限制

- `changelog.txt`、`savebank.txt` 为原版英文纯文本附件，未纳入界面汉化。
- 少量专有名词与梗名（如 `BEZOS BEZOS BEZOS`、`CSP/BSP` 等符印缩写）
  按约定保留英文。

## 致谢

原作者 Demonin，联合开发 Cornucanis，美术 Zaxolotl。
本仓库为简体中文汉化，基于上游 DemoninCG/DodecaDragons 制作。
"""
open(os.path.join(STAGE, "README.md"), "w", encoding="utf-8").write(readme)

print("publish tree ready:", STAGE)
print("top level:", sorted(os.listdir(STAGE)))
