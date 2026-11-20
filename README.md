# 十二龙（DodecaDragons）简体中文汉化版

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
  全内容解锁），打开即可看到后期全部面板，不写入本地存档。

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
