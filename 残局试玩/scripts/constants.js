//const arrays aren't actually constant but shhh
//I am constantly suffering
const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"]

//any DOM element with an id in this array will prevent panning when it is the active element
const panResistantFields = ["dragonNameBox", "knowledgeLevelRange", "knowledgeLevelInput", "sigilResetterType", "sigilResetterMode", "sigilResetterAmount"];

const fireUpgradeInitialCosts = [0, 50, 100, 100, 500, 500, 2e7]
const fireUpgradeBase = [0, 1.8, 2, 1.4, 1.5, 2.5, 5]
const magicUpgradeCosts = [2, 3, 8, 12, 30, 100, 300, 1500, 4000, 20000, 100000, 400000, 1e8, 3e8, 1.5e9, 3e9, 1e11, 4e12, 1e13, 1e16]
const darkMagicUpgradeCosts = ["e110", "e125", "e165", "e240", "e285", "e320", "e360", "e450", "e120000", "e140000", "e3e8", "e4.5e8", "e5e8", "e6e8", "e6.75e8", "e8e8", "e1.2e9", "e1.45e9", "e1.6e9", "e1.65e9"]
const voidMagicUpgradeCosts = ["e1.25e10", "e1.4e10", "e1.55e10", "e1.65e10", "e2e10", "e3e10", "e4e10", "e6.5e10", "e9.6e10", "e1.2e11", "e2.25e11", "e3.4e11", "e4.6e11", "e5.25e12", "e2e13", "e4.25e13", "e3.75e16"]
const sigilColours = ["cyan", "blue", "indigo", "violet", "pink", "red", "orange", "yellow"]
// display-only localized sigil colour names (code keys stay English)
const SIGIL_COLOURS_ZH = ["青色", "蓝色", "靛色", "紫色", "粉色", "红色", "橙色", "黄色"];

const sigilColoursMode1 = ["red", "orange", "yellow"]
const sigilResetterModes = ["Amount","Gold","Time"]
const sigilResetterModesFull = ["潜在符印数量", "金币数量", "距上次重置的秒数"]
const knowledgeMultipliers = [450, 112.5, 18.75, 10, 1]
const tomeUpgradeCosts = [1, 1, 2, 2, 4, 20, 75, 175, 500, 1000, 1500, 2250, 2800, 7500]
const blueFireUpgradeInitialCosts = [0, 500, 1000, 50000, 5e7, 1.5e8, 1e11]
const blueFireUpgradeBase = [0, 1.8, 2, 2.5, 1.8, 2.2, 2]
const hellLayerNames = ["灵薄狱", "色欲", "暴食", "贪婪", "愤怒", "异端", "暴力", "欺诈", "背叛"]
const hellLayerEffects = ["-<a style='color: #fd0'>金币</a>获取大幅降低（log(x)^5）<br>-<a style='color: #bff'>铂金</a>获取变为 ^0.1<br>-<a style='color: #60d'>魔法流形</a>数量恒为 1<br>-<a style='color: #8f8'>铀</a>获取变为 ^0.1",
"-<a style='color: #fd0'>金币</a>获取大幅降低（log(x)^2）<br>-<a style='color: #f80'>火焰</a>获取大幅降低（log(x)）<br>-<a style='color: #bff'>铂金</a>获取变为 ^0.01<br>-<a style='color: #60d'>魔法流形</a>数量恒为 1<br>-<a style='color: #8f8'>铀</a>获取变为 ^0.01<br>-<a style='color: #06b'>青色符印</a>升级 3 无效",
"-<a style='color: #fd0'>金币</a>获取大幅降低（log(x)）<br>-<a style='color: #f80'>火焰</a>获取大幅降低（log(x)）<br>-<a style='color: #bff'>铂金</a>获取大幅降低（log(x)）<br>-<a style='color: #60d'>魔法流形</a>数量恒为 1<br>-<a style='color: #8f8'>铀</a>获取大幅降低（log(x)）<br>-<a style='color: #06b'>青色符印</a>升级 3 无效",
"-<a style='color: #fd0'>金币</a>获取大幅降低（log(x)^0.5）<br>-<a style='color: #f80'>火焰</a>获取恒为 0<br>-<a style='color: #bff'>铂金</a>获取大幅降低（log(x)）<br>-<a style='color: #60d'>魔法流形</a>数量恒为 1<br>-<a style='color: #8f8'>铀</a>获取大幅降低（log(x)）<br>-<a style='color: #06b'>青色符印</a>升级 3 无效",
"-<a style='color: #fd0'>金币</a>获取大幅降低（log(x)^0.2）<br>-<a style='color: #f80'>火焰</a>获取恒为 0<br>-<a style='color: #bff'>铂金</a>获取大幅降低（log(x)^0.5）<br>-<a style='color: #90d'>魔法</a>数量大幅降低（log(x)）<br>-<a style='color: #60d'>魔法流形</a>数量恒为 1<br>-<a style='color: #8f8'>铀</a>获取大幅降低（log(x)^0.5）<br>-<a style='color: #06b'>青色符印</a>升级 3 无效"
]
const holyTetrahedronUpgradeCosts = [1, 1, 1, 1, 2, 2, 2, 5, 5, 15, 50, 2000, 50000]
const holyOctahedronUpgradeCosts = [1, 1, 1, 2, 4, 2, 50, 750, 25000]
const holyDodecahedronUpgradeCosts = [1, 2, 6, 12, 1000, 150000]
const holyFireUpgradeInitialCosts = [0, 500, 1000, 10000, 50000, 1e7, 1e45]
const holyFireUpgradeBase = [0, 1.8, 2, 3, 2, 2.5, 3]
const plagueUpgradeInitialCosts = [0, 25, 100, 100000, 1e6, 1e13]
const plagueUpgradeBase = [0, 2, 2.5, 3, 5, 3]
const hypergodNames = ["全宇宙超神 I：<br>KARUTH", "全宇宙超神 II：<br>TOMI", "全宇宙超神 III：<br>DOLKHOR", "全宇宙超神 IV：<br>BELKIKO", "全宇宙超神 V：<br>SHOU", "全宇宙超神 VI：<br>COANGRUATOR", "全宇宙超神 VII：<br>EXILTIK", "全宇宙超神 VIII：<br>Tom", "全宇宙超神 IX：<br>ALUSTRO", "全宇宙超神 X：<br>IKOR", "全宇宙超神 XI：<br>WITHLORN", "全宇宙超神 XII：<br>FINALIKUS"]
const hypergodDefeatCosts = ["ee20000", "ee160000", "ee400000", "ee1e6", "ee2.4e6", "ee1e7", "ee4e7", "ee7e8", "ee2e9", "ee1.5e10", "ee1e11", "ee7.5e11"]
const hypergodText = ["你贪婪的成长正在全宇宙中造成破坏，生物啊。作为这片全宇宙的至高<br>&#8202;&#8202;统治者，我命令你立即停止。", "&#8202;&#8202;立刻停止你盲目的混沌与破坏！你根本不知道自己正在对现实的结构做些什么！", "又一个贪婪的灵魂。你会被清除，就像你之前的所有人一样。", "我希望你能重新考虑自己的行为。……不过我想现在为时已晚。战斗不会停止，直到要么你消失，要么我们全部消失。", "呃啊。你竟敢把我从沉睡中叫醒？这最好事关重大，凡俗之物。", "&#8202;&#8202;才不呢！", "你！你真能想象自己造成的彻底毁灭吗！？时空的结构正在内爆，数万亿数万亿的生命死于你无知的脚下，而为了<br>&#8202;&#8202;什么！？我恳求你住手吧，有机生命！", "&#8202;&#8202;嘿，伙计，你做的事可真不酷。你最好退开点，老兄。", "你以为你能超越我的力量？我要把你像你这种微不足道的<br>&#8202;&#8202;存在一样碾碎！", "&#8202;&#8202;毁灭的化身。显然我阻止不了你，但我别无选择只能一试。<br>&#8202;&#8202;因为若你继续下去，谁也无法预料全宇宙会发生什么。", "你杀光了我的同胞，但对你而言最糟的还在后头！我要让你见识超神真正的力量！", "&#8202;&#8202;好了，我想就到此为止了。我是仅存的超神。众神的毁灭者，<br>&#8202;&#8202;万物之主，如今全宇宙归你所有，只属于你。再会。"]
const lightEssenceUpgradeInitialCosts = [0, 100, 600, 3000]
const lightEssenceUpgradeBase = [0, 2, 3, 3]
const darkEssenceUpgradeInitialCosts = [0, 100, 1000, 10000]
const darkEssenceUpgradeBase = [0, 2, 3, 3]
const deathEssenceUpgradeInitialCosts = [0, 1000, 10000, 200000, 1e7, 1e40]
const deathEssenceUpgradeBase = [0, 2, 3, 3, 2.5, 4]
const finalityEssenceUpgradeInitialCosts = [0, 1000, 4000, 1e15, 1e20]
const finalityEssenceUpgradeBase = [0, 2, 5, 4, 4]
const nuclearPastaNames = ["意式面疙瘩", "意大利面", "华夫饼", "千层面", "反意大利面", "反意式面疙瘩"]
const nuclearPastaPositiveEffects = ["光明/黑暗精华获取加成", "提升死亡精华获取", "提升宇宙瘟疫获取", "超星系团效果提升", "提升鿫获取"]
const nuclearPastaNegativeEffects = ["&#8202;&#8202;死亡精华获取归零", "&#8202;&#8202;金币数量不增加", "黑暗/光明精华获取归零", "宇宙瘟疫获取归零", "&#8202;&#8202;金币数量不增加"]
const nuclearPastaUpgradeCosts = ["ee7.5e6", "ee1.2e8", "ee2.5e8", "ee7.5e8"]

const achievementNames = [
  //Gold
  ["强劲开局", "愈加强大", "一大堆", "大金矿", "BEZOS BEZOS BEZOS", "源源不断的现金堆", "多元宇宙级", "无尽的金币国度", "腰缠万贯", "超级富有（???）", "Sbiisics", "我请客！"],
  //Fire
  ["辛辣", "燃烧之手", "熊熊烈火", "滔天炼狱", "地狱坑", "Carolina reapers", "Tartarus", "Pandemonium", "地狱霸主", "不幸事件", "全球变暖", "万物终结"],
  //Platinum
  ["炼金奇境", "珠宝匠", "辛勤耕耘", "旷世巨作", "基础化学", "镜面抛光", "银色摩天楼", "高等化学", "嬗变之神", "铂合成", "神秘咖啡师", "大功告成"],
  //Magic
  ["滑稽的巫师帽", "巫术", "魔法术！", "更大的帽子", "神迹术", "无数法术", "重塑地球", "无限潜能", "碎星者", "无尽魔典", "虚空汲取", "临界记忆"],
  //Magifolds
  ["四维", "十维", "超弦理论", "无限折叠", "难以理解", "百万次折叠", "十亿次折叠", "时空折纸", "九边形无限", "和乐瓦解", "单纯形复合体", "彻底崩溃"],
  //Uranium
  ["电离", "辐射", "中和", "骇人", "毁灭", "衰变", "湮灭", "抹除", "发光", "还原", "激励", "终结"],
  //Cyan sigils
  ["彩色", "混沌", "多彩", "灾难", "僵化", "彩色 II", "混沌 II", "多彩 II", "灾难 II", "僵化 II", "彩色 III", "混沌 III"],
  //Blue sigils
  ["双色", "基础", "生物", "野蛮", "香脂", "双色 II", "基础 II", "生物 II", "野蛮 II", "香脂 II", "双色 III", "基础 III"],
  //Indigo sigils
  ["交互动态", "理想主义", "各向同性", "等渗", "田园", "交互动态 II", "理想主义 II", "各向同性 II", "等渗 II", "田园 II", "交互动态 III", "理想主义 III"],
  //Violet sigils
  ["火山", "容积", "硫酸", "伏打", "醇酒", "火山 II", "容积 II", "硫酸 II", "伏打 II", "醇酒 II", "火山 III", "容积 III"],
  //Pink sigils
  ["全色", "疯狂", "致病", "特殊性", "柏拉图式", "全色 II", "疯狂 II", "致病 II", "特殊性 II", "柏拉图式 II", "全色 III", "疯狂 III"],
  //Knowledge
  ["脑力高光", "深思", "非物质", "未雨绸缪", "我推测", "巨脑", "递增智商", "共享脑力", "智库", "智能奇点", "思想者", "认识论的"],
  //Tomes
  ["被封存的历史", "神秘书架", "死灵之书", "全然可读", "圣经般的", "符文室", "巴别图书馆", "递归知识", "不再迷失", "雅典娜神庙", "藏书馆", "脸书"],
  //Blue fire
  ["燃烧的寒冷", "冻伤", "苔原", "以灼疗伤", "地狱冰封", "绝对零度", "还有什么比酷更酷？", "堪察加", "超流体", "冰V", "你真酷", "无尽蓝焰"],
  //Blood
  ["凝固", "残暴", "血河", "超暴力", "涡轮杀手", "当内鬼可疑时！", "地狱星雷米娜", "新鲜", "血细胞", "血色辉煌", "吸血鬼化", "无尽嗜血"],
  //Plutonium
  ["电离 II", "辐射 II", "中和 II", "恐怖 II", "毁灭 II", "衰变 II", "湮灭 II", "歼灭 II", "发光 II", "还原 II", "激励 II", "终结 II"],
  //Red sigils
  ["有节奏的", "写实的", "机械的", "浪漫的", "相对论的", "有节奏的 II", "写实的 II", "机械的 II", "浪漫的 II", "相对论的 II", "有节奏的 III", "写实的 III"],
  //Orange sigils
  ["有机的", "正字法的", "能量过剩的", "正色的", "超色的", "有机的 II", "正字法的 II", "能量过剩的 II", "正色的 II", "超色的 II", "有机的 III", "正字法的 III"],
  //Yellow sigils
  ["黄色", "非常黄", "极其黄", "超级黄", "超黄", "黄色 II", "非常黄 II", "极其黄 II", "超级黄 II", "超黄 II", "黄色 III", "非常黄 III"],
  //Holy tetrahedrons
  ["｢天堂制造｣", "一路重置到底", "多云，可能有数字", "上帝之光", "天赐", "凸复形", "不可约", "非欧几里得", "金字塔魔方", "外星建筑", "小心：锋利", "四面惊奇"],
  //Holy octahedrons
  ["对偶", "苍穹", "拉米埃尔", "切中要害", "血肉牢笼", "八进制", "魔法8面体", "八极巨富", "没有停车标志", "无法解释", "不明漂浮旋转物体", "八面惊人"],
  //Holy fire
  ["白热", "神之愤怒", "大天使", "天堂", "轨道激光", "太阳火", "10万亿度", "手枪星", "等离子态", "夸克与胶子", "焚尽一切", "你在光芒中看到了什么？"],
  //Holy dodecahedrons
  ["嘿，这就像游戏的名字！:O", "十二该死", "十二维", "十二微积分", "十二致命", "十二危险", "十二算计", "十二混沌", "十二神圣", "十二毁灭", "十二载努力", "十二圆满"],
	//Planets
	["世界先生", "系统", "时空跳跃", "极限加速", "超级木星", "褐矮星", "戴森球", "暗物质囊", "非欧几里得行星", "胖地球说", "IV型文明", "超级终极宇宙"],
	//Omniversal hypergods
	["这是最后一行成就。", "你已经走了难以置信的漫长道路。", "你对力量的渴望永无止境。", "所有试图阻止你的人都以失败告终。", "现在应该离终点不远了。", "泛宇宙究竟有多大？", "你开始感觉物理定律在身边崩塌。", "是什么在驱使你？", "你的最终目标是什么？你打算停下吗？", "现实可供你占据的只有这么多。", "当一切尘埃落定……", "完结"]
]
const achievementRequirements = [
  //Gold
  ["100", "10000", "1e6", "1e12", "1e20", "1e30", "1e100", "1e250", "1e1000", "1e3000", "1e10000", "1e100000"],
  //Fire
  ["1000", "1e6", "1e12", "1e18", "1e30", "1e100", "1e250", "1e1000", "1e4000", "1e20000", "1e500000", "e5e7"],
  //Platinum
  ["100", "100000", "2.5e6", "1e8", "1e12", "1e20", "1e30", "1e100", "1e250", "1e1000", "1e20000", "1e150000"],
  //Magic
  ["1", "5", "50", "1000", "100000", "1e8", "1e20", "1e100", "1e500", "1e10000", "1e50000", "1e1000000"],
  //Magifolds
  ["10000", "1e6", "1e20", "1e30", "1e50", "1e250", "1e1000", "1e2500", "1e10000", "1e500000", "1e2500000", "e2e7"],
  //Uranium
  ["100", "100000", "1e7", "5e8", "1e10", "1e100", "1e1000", "1e25000", "1e1000000", "e1e8", "e1e12", "e1e15"],
  //Cyan sigils
  ["1", "5", "20", "100", "500", "1000000", "1e12", "1e25", "1e100", "1e250", "1e500", "1e1000"],
  //Blue sigils
  ["1", "5", "20", "100", "500", "1000000", "1e12", "1e25", "1e100", "1e250", "1e500", "1e1000"],
  //Indigo sigils
  ["1", "5", "20", "100", "500", "1000000", "1e12", "1e25", "1e100", "1e250", "1e500", "1e1000"],
  //Violet sigils
  ["1", "5", "20", "100", "500", "1000000", "1e12", "1e25", "1e100", "1e250", "1e500", "1e1000"],
  //Pink sigils
  ["1", "5", "20", "100", "500", "1000000", "1e12", "1e25", "1e100", "1e250", "1e500", "1e1000"],
  //Knowledge
  ["1", "10", "250", "10000", "1e9", "1e30", "1e100", "1e300", "1e750", "1e1500", "1e3000", "1e6000"],
  //Tomes
  ["1", "10", "100", "1000", "5000", "15000", "30000", "75000", "150000", "350000", "750000", "2.5e6"],
  //Blue fire
  ["1000", "1e6", "1e20", "1e35", "1e60", "1e100", "1e250", "1e600", "1e1500", "1e3000", "1e20000", "1e100000"],
  //Blood
  ["1", "10000", "5e7", "1e10", "1e20", "1e30", "1e100", "1e150", "1e200", "1e500", "1e1000", "1e3000"],
  //Plutonium
  ["100", "10000", "1e6", "1e20", "1e30", "1e100", "1e500", "1e1000", "1e2500", "1e15000", "1e50000", "1e250000"],
  //Red sigils
  ["1", "20", "1000", "100000", "1e8", "1e12", "1e20", "1e50", "1e150", "1e500", "1e1200", "1e6000"],
  //Orange sigils
  ["1", "20", "1000", "100000", "1e8", "1e12", "1e20", "1e50", "1e150", "1e500", "1e1200", "1e6000"],
  //Yellow sigils
  ["1", "20", "1000", "100000", "1e8", "1e12", "1e20", "1e50", "1e150", "1e500", "1e1200", "1e6000"],
  //Holy tetrahedrons
  ["1", "3", "10", "50", "2500", "1000000", "1e9", "1e18", "1e30", "1e80", "1e250", "1e1000"],
  //Holy octahedrons
  ["1", "3", "10", "50", "2500", "1000000", "1e9", "1e18", "1e30", "1e80", "1e250", "1e1000"],
  //Holy fire
  ["1000", "100000", "1e12", "1e20", "1e50", "1e100", "1e300", "1e1000", "1e5000", "1e20000", "1e100000", "1e500000"],
  //Holy dodecahedrons
  ["1", "3", "10", "50", "2500", "1000000", "1e9", "1e18", "1e30", "1e80", "1e250", "1e1000"],
	//Planets
	["1", "5", "10", "25", "75", "250", "500", "1200", "4000", "10000", "25000", "100000"],
	//Omniversal hypergods
	["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
]
const achievementRewards = {
  //gold
  ach0x4: "解锁铂金升级的全部最大化按钮！",
  ach0x8: "解锁矿工自动购买器！重置时还可保留 1 名矿工。",
  ach0x10: "解锁魔法与黑暗魔法升级的批量购买按钮！",
  //magic
  ach3x0: "解锁火焰升级的批量购买按钮！",
  ach3x1: "解锁火焰升级的全部最大化按钮！",
  ach3x4: "魔法重置时保留所有铂金升级！",
  ach3x5: "每秒获得潜在魔法的 1%！",
  ach3x7: "每秒获得潜在魔法的 100%！",
  //uranium
  ach5x2: "解锁铀升级的全部最大化按钮！",
  ach5x3: "无需重置即可自动获得铀！",
  //cyan sigils
  ach6x0: "有空时自动陪伴你的龙！还可在冷却期间进入挑战。",
  ach6x1: "喂食你的龙会使分数按 ^0.5 缩减，而非重置！",
  ach6x2: "自动最大化所有火焰升级！",
  //blue sigils
  ach7x0: "喂食你的龙不再降低挑战分数！",
  ach7x1: "无需进入挑战即可获得挑战分数！此外，符印重置不再降低挑战分数。",
  ach7x2: "符印重置时保留铂金升级！",
  //indigo sigils
  ach8x0: "魔法与符印重置时保留铀升级！",
  //violet sigils
  ach9x0: "解锁抚摸你的龙的能力！:O",
  //pink sigils
  ach10x0: "有空时自动喂食你的龙！",
  ach10x1: "解锁符印升级的全部最大化按钮！",
  ach10x2: "符印重置时保留所有魔法与黑暗魔法升级！",
  //knowledge
  ach11x0: "解锁符印重置的部分自动化功能！",
  ach11x7: "自动最大化所有知识升级！",
  //Tomes
  ach12x2: "解锁知识升级的全部最大化按钮！",
  //Blue fire
  ach13x0: "每秒获得潜在符印的 10%！",
  ach13x2: "解锁蓝火升级的批量购买按钮！",
  ach13x4: "解锁蓝火升级的全部最大化与自动全部最大化！",
  //Blood
  ach14x1: "自动免费获得最大量的典籍！",
  //Plutonium
  ach15x0: "自动免费获得知识！",
  ach15x3: "无需重置即可自动获得钚！",
  //Yellow Sigils
  ach18x2: "自动重置器仅循环红色、橙色、黄色符印的选项",
  //Holy tetrahedrons
  ach19x0: "解锁钚升级的全部最大化按钮！",
  ach19x2: "解锁典籍升级的批量购买按钮！",
  ach19x4: "神圣重置时保留典籍升级！",
  //Holy octahedrons
  ach20x0: "自动最大化所有符印升级！",
  ach20x1: "神圣重置时保留炼金升级！",
  //Holy fire
  ach21x3: "解锁圣火升级的批量购买按钮！",
  ach21x7: "解锁圣火升级的全部最大化与自动全部最大化！",
  //Holy dodecahedrons
  ach22x0: "神圣重置时保留魔法与黑暗魔法升级！",
	//Planets
  ach23x2: "每秒获得潜在红、橙、黄符印的 100%！",
	ach23x5: "解锁行星形成的批量购买！",
	ach23x6: "解锁宇宙瘟疫升级的批量购买按钮！",
	//Omniversal hypergods
	ach24x0: "每秒获得潜在多面体的 100%！并获得 5x 瘟疫获取乘数。",
	ach24x1: "又一个 5x 瘟疫获取乘数 :)",
	ach24x2: "自动批量购买行星！并获得 10x 鿫获取乘数。",
	ach24x3: "5x 光明精华、黑暗精华获取乘数！",
	ach24x4: "10x 死亡精华获取乘数！",
	ach24x5: "解锁宇宙瘟疫升级的全部最大化与自动全部最大化！",
	ach24x6: "解锁光明、黑暗与死亡精华升级的全部最大化！",
	ach24x7: "解锁终焉精华升级的全部最大化！",
	ach24x8: "100x 终焉精华获取乘数！",
	ach24x9: "自动获得最大量核意面！并再获得 100x 终焉精华获取乘数。",
	ach24x10: "10,000,000x 终焉精华获取乘数！",
	ach24x11: "解锁某物。",
}
const achievementResources = [
  {name:"金币", shortName:"&#8202;&#8202;金币", internalName:"gold"},
  {name:"火焰", shortName:"&#8202;&#8202;火焰", internalName:"fire"},
  {name:"铂金", shortName:"铂金", internalName:"platinum"},
  {name:"魔法", shortName:"魔法", internalName:"magic"},
  {name:"魔法流形", shortName:"魔法流形", internalName:"magifolds"},
  {name:"铀", shortName:"铀", internalName:"uranium"},
  {name:"青色符印", shortName:"青色符印", internalName:"cyanSigils"},
  {name:"蓝色符印", shortName:"&#8202;&#8202;蓝色符印", internalName:"blueSigils"},
  {name:"靛色符印", shortName:"&#8202;&#8202;靛色符印", internalName:"indigoSigils"},
  {name:"紫色符印", shortName:"&#8202;&#8202;紫色符印", internalName:"violetSigils"},
  {name:"粉色符印", shortName:"粉色符印", internalName:"pinkSigils"},
  {name:"知识", shortName:"&#8202;&#8202;知识", internalName:"knowledge"},
  {name:"典籍总数", shortName:"&#8202;&#8202;典籍", internalName:"totalTomes"},
  {name:"蓝火", shortName:"&#8202;&#8202;蓝火", internalName:"blueFire"},
  {name:"血液", shortName:"血液", internalName:"blood"},
  {name:"钚", shortName:"钚", internalName:"plutonium"},
  {name:"红色符印", shortName:"红色符印", internalName:"redSigils"},
  {name:"橙色符印", shortName:"橙色符印", internalName:"orangeSigils"},
  {name:"黄色符印", shortName:"&#8202;&#8202;黄色符印", internalName:"yellowSigils"},
  {name:"神圣四面体", shortName:"四面体", internalName:"holyTetrahedrons"},
  {name:"神圣八面体", shortName:"八面体", internalName:"holyOctahedrons"},
  {name:"圣火", shortName:"圣火", internalName:"holyFire"},
  {name:"神圣十二面体", shortName:"&#8202;&#8202;十二面体", internalName:"holyDodecahedrons"},
	{name:"行星", shortName:"&#8202;&#8202;行星", internalName:"planets"},
	{name:"击败的超神", shortName:"&#8202;&#8202;泛宇宙", internalName:"hypergodsDefeated"}
]
const achievementColours = ["#fd0", "#f80", "#bff", "#90d", "#60d", "#8f8", "#06b", "#00b", "#40b", "#60b", "#b0b", "#987", "#965", "#66f", "#f00", "#25e", "#b00", "#b60", "#bb0", "#6dd", "#d6d", "#ff9", "#d66", "#62b", "#44d"]
//this array tells the display code when each achievement should be visible. each child array corresponds to a value of game.unlocks
const achievementDisplayUnlocks = [
  [3,2,1], //unlock 0 - start
  [3,2,1], //unlock 1 - dragon
  [3,2,1], //unlock 2 - fire
  [4,3,2,1], //unlock 3 - platinum
  [6,4,3,5,1], //unlock 4 - magic
  [6,4,3,5,1], //unlock 5 - magic challenges
  [7,5,4,6,2,1], //unlock 6 - more magic upgrades
  [8,6,6,7,3,1], //unlock 7 - uranium
  [10,6,7,8,4,3,1], //unlock 8 - more platinum and uranium
  [10,6,7,8,4,3,1], //unlock 9 - dark magic upgrades
  [10,6,7,9,4,4,3,1], //unlock 10 - cyan sigils
  [11,7,8,9,5,4,4,4,1], //unlock 11 - blue sigils
  [12,8,8,10,6,5,5,5,5,1], //unlock 12 - indigo sigils
  [12,8,9,11,6,5,5,5,5,5,1], //unlock 13 - violet sigils
  [12,9,9,11,7,5,5,5,5,5,5,1], //unlock 14 - pink sigils
  [12,10,10,12,8,6,6,6,6,6,6,4,1], //unlock 15 - knowledge
  [12,10,10,12,9,7,7,7,7,7,7,5,2,1], //unlock 16 - tomes
  [12,12,12,12,12,10,8,8,8,8,8,7,4,2,1], //unlock 17 - blue fire
  [12,12,12,12,12,11,9,9,9,9,9,7,5,3,2,1], //unlock 18 - blood
  [12,12,12,12,12,11,9,9,9,9,9,7,5,3,2,1], //unlock 19 - more dark magic upgrades
  [12,12,12,12,12,12,10,10,10,10,10,8,5,4,3,3,1], //unlock 20 - plutonium
  [12,12,12,12,12,12,10,10,10,10,10,8,5,5,4,3,2,1], //unlock 21 - red sigils
  [12,12,12,12,12,12,10,10,10,10,10,8,5,5,4,3,3,2,1], //unlock 22 - orange sigils
  [12,12,12,12,12,12,11,11,11,11,11,9,6,6,6,4,4,4,3,1], //unlock 23 - yellow sigils
  [12,12,12,12,12,12,12,12,12,12,12,10,7,7,6,4,4,4,4,4,1], //unlock 24 - holy tetrahedrons
  [12,12,12,12,12,12,12,12,12,12,12,11,8,8,7,5,5,5,5,4,2,1], //unlock 25 - holy octahedrons
  [12,12,12,12,12,12,12,12,12,12,12,12,9,9,7,7,6,6,6,6,4,2,1], //unlock 26 - holy fire
  [12,12,12,12,12,12,12,12,12,12,12,12,9,9,8,8,6,6,6,7,5,3,1], //unlock 27 - void magic upgrades
  [12,12,12,12,12,12,12,12,12,12,12,12,11,10,9,9,8,7,7,8,7,4,5,1], //unlock 28 - holy dodecahedrons
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,10,11,5], //unlock 29 - planets
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,10,11,5,1], //unlock 30 - Omniversal hypergods
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,7,3], //unlock 31 - Cosmic plague
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,8,4], //unlock 32 - Oganesson
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,9,5], //unlock 33 - Light and dark essences
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,10,6], //unlock 34 - Death essence
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,8], //unlock 35 - Nuclear pasta
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,10], //unlock 36 - Finality essence
	[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12], //unlock 37 - Finality cubes
]

//stores position and unlock data for each display tab. structure is [x, y, unlock]
const tabData = {
  main: [0, 0, 0],
  dragon: [0,330,1],
  fire: [-365, 365, 2],
  platinum: [320, 100, 3],
  magic: [0, -287, 4],
  magicUpgrades: [-365, 235, 4],
  magicChallenges: [390, -365, 5],
  uranium: [595, 100, 7],
  darkMagic: [-730, -130, 9],
  cyanSigils: [365, 515, 10],
  blueSigils: [730, 515, 11],
  indigoSigils: [1095, 515, 12],
  violetSigils: [365, 830, 13],
  pinkSigils: [730, 830, 14],
  sigilAutomation: [1095, 830, 14],
  knowledge: [-440, 850, 15],
  tomes: [-905, 850, 16],
  blueFire: [-780, 365, 17],
  blood: [-50, -650, 18],
  plutonium: [870, 100, 20],
  redSigils: [365, 1145, 21],
  orangeSigils: [730, 1145, 22],
  yellowSigils: [1095, 1145, 23],
  holyTetrahedrons: [830, -250, 24],
  holyTetrahedronTree: [830, -680, 24],
  holyOctahedrons: [1295, -250, 25],
  holyOctahedronTree: [1295, -520, 25],
  holyFire: [-1245, 365, 26],
  voidMagic: [-1095, -130, 27],
  holyDodecahedrons: [1760, -250, 28],
  holyDodecahedronTree: [1760, -520, 28],
	planets: [-515, -650, 29],
	omniversalHypergods: [390, -780, 30],
	cosmicPlague: [-1345, 850, 31],
	oganesson: [1145, 100, 32],
	lightEssence: [1440, 100, 33],
	darkEssence: [1755, 100, 33],
	deathEssence: [1437, 615, 34],
	nuclearPasta: [-980, -650, 35],
	finalityEssence: [1755, 615, 36],
	finalityCubes: [1541, 1105, 37],
}

//this is what I want the render function to see
/*
const tabPositions = [
  {
    main: [0, 0] //unlock 0 - dragon is handled with special case in render
  },
  {
    fire: [-365, 365] //unlock 1
  },
  {
    //etc
  }
]
*/