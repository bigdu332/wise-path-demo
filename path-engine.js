(function attachWisePathEngine(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.WisePathEngine = api;
})(typeof window !== "undefined" ? window : globalThis, function createWisePathEngine() {
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const experienceLabels = { beginner: "第一次接触", familiar: "有些基础", active: "正在实操" };
  const timeRules = { "10": { label: "10 分钟" }, "30": { label: "30 分钟" }, deep: { label: "系统学习" } };
  const I = "https://www.wise-invest.org";
  const C = "https://chain.wise-invest.org";
  const E = "https://www.wise-etf.com";
  const R = "https://crypto.wise-invest.org";
  const H = "https://www.wise-hold.com";
  const P = "https://www.wise-ipo.com";
  const W = "https://www.wise-witness.com";
  const S = "https://www.wise-sim.org";

  // Page purposes and access states reviewed on 2026-10-02; see route-review.json.
  // Minutes are an editorial reading budget, never a claim about completing a course or transaction.
  const r = (site, type, title, desc, url, deepMinutes = 20, access = "") => ({
    site, type, title, desc, url, deepMinutes,
    access: access || (url.startsWith(C + "/") ? "可能需 Wise ID" : "")
  });
  const resources = {
    basics: r("CHAIN", "第一课", "从股票权益与交易基础开始", "打开第一单元，分清股东权益、公司利润与个人回报；时间充足再继续报价和交易机制。", C + "/learn/lessons/stock-trading-basics"),
    business: r("CHAIN", "公司入门", "弄清一家公司靠什么赚钱", "围绕产品、客户、收入和成本整理一条商业逻辑，再进入产业或财报研究。", C + "/learn/lessons/business-drivers"),
    statements: r("CHAIN", "财报方法", "用三张报表检验经营逻辑", "先读报告期、币种与单位，再连接利润、资产和现金；按课内方法回到公司正式披露。", C + "/learn/lessons/read-three-statements", 25),
    valuation: r("CHAIN", "估值方法", "补上现金流与价格之间的联系", "从时间价值与折现入手，写清估值依赖的假设，给公司研究加上价格维度。", C + "/learn/lessons/time-value-and-discounting", 25),
    risk: r("CHAIN", "风险与组合", "把单家公司放回整个组合", "读风险与组合基础，记录集中度和可承受损失，避免研究结论直接变成仓位。", C + "/learn/lessons/risk-and-portfolio-basics"),
    map: r("CHAIN", "产业结构", "沿产品和环节定位公司", "在产业地图选择 AI、存储、机器人等主题，追踪需求传到哪些环节，再选一家公司验证。", C + "/chain", 25),
    ai: r("CHAIN", "AI 产业", "沿 AI 投入追踪产业链", "从资本开支走到芯片、集群与应用回报，选一个环节，记下需求如何转成收入。", C + "/chain?industry=ai", 25),
    company: r("CHAIN", "公司资料", "核对产品、客户与产业位置", "在公司目录搜索目标公司，核对业务关系；未覆盖的公司需回到其正式披露继续研究。", C + "/companies", 25),
    macro: r("CHAIN", "宏观关系", "先看变化通过什么渠道传导", "从利率、通胀或增长选择一个起点，解释金融条件怎样影响公司，保留相反条件。", C + "/learn/macro"),
    lab: r("CHAIN", "情景练习", "用相反情景检验宏观判断", "在宏观实验室改变政策方向与预期，比较两种结果，写出判断成立所需条件。", C + "/learn/macro/lab", 25),
    signals: r("CHAIN", "事件线索", "从有日期和来源的事件开始", "先检查同步状态和原始来源，再沿产业链拆解影响；没有有效事件时，从公司目录选题。", C + "/signals", 20, "研究预览"),
    research: r("CHAIN", "研究记录", "留下证据、反例和下次验证点", "在原站建立一条研究记录：对象、假设、来源与失效条件。记录仅保存在当前浏览器。", C + "/research"),
    suitability: r("WISE INVEST", "投入前提", "先确认这笔钱适不适合长期投入", "打开蓝皮书第 18 章，按资金用途、期限与承受能力列出开始或暂缓的理由。", I + "/book/nasdaq#chapter-18", 15),
    product: r("WISE INVEST", "指数与产品", "先分清指数、基金与购买渠道", "直达蓝皮书第 12 章，画清指数到产品的层次，再使用场内外比较工具。", I + "/book/nasdaq#chapter-12", 15),
    qdii: r("WISE INVEST", "QDII 基础", "理解 QDII 与额度的关系", "读蓝皮书第 13 章，再去额度表核对具体产品与日期，避免把产品名称当成申购资格。", I + "/book/nasdaq#chapter-13", 15),
    onexchange: r("WISE INVEST", "场内基础", "弄清场内价格为什么会偏离净值", "读蓝皮书第 15 章，区分交易价格、净值和溢价，再查看收盘数据。", I + "/book/nasdaq#chapter-15", 20),
    compare: r("WISE ETF", "路径比较", "按自己的条件比较场内与场外", "填写指数、金额和账户条件，比较额度、费用与溢价；数据待确认时先记录缺项。", E + "/chooser"),
    limits: r("WISE ETF", "申购状态", "核对额度、状态和数据日期", "筛选目标指数，记录可申购状态与日期；“待确认”不等于开放，最终以销售渠道显示为准。", E + "/today/qdii-limits", 15),
    premium: r("WISE ETF", "收盘快照", "同时检查溢价和两侧日期", "对照场内价格日期与净值日期，再比较同指数产品；此处不是盘中实时 IOPV。", E + "/today/etf-premium", 15),
    costs: r("WISE INVEST", "筛选方法", "把费率、跟踪和流动性一起比较", "直达蓝皮书第 16 章，用同一口径整理候选产品，给比较结果补上长期成本。", I + "/book/nasdaq#chapter-16", 20),
    schedule: r("WISE INVEST", "定投设计", "先写一份能执行的定投安排", "打开蓝皮书第 11 章，记录资金来源、频率和中断条件，再比较产品渠道。", I + "/book/nasdaq#chapter-11", 20),
    drawdown: r("WISE INVEST", "压力情景", "检验下跌时计划还能否成立", "用蓝皮书第 20 章的情景检查现金流与承受能力，补全计划中的调整条件。", I + "/book/nasdaq#chapter-20", 20),
    plan: r("WISE INVEST", "计划落纸", "把比较结果收束成一张计划", "直达蓝皮书第 22 章，写下资金、渠道、频率与复查条件；有缺项就先保留。", I + "/book/nasdaq#chapter-22", 20),
    cryptoHome: r("WISE CRYPTO", "工作台导览", "先分清行情、工具和课程的用途", "读公开总览，选定本次要观察的对象和问题；行情与工具需要 Wise ID 登录。", R + "/", 15),
    market: r("WISE CRYPTO", "市场观察", "进入 BTC / ETH 行情工作台", "按公开功能介绍，查看趋势、均线与关键位置；先确认时间口径，再记录观察条件。", R + "/btc", 20, "需 Wise ID"),
    cryptoTools: r("WISE CRYPTO", "计算工具", "把计划的投入与损失边界算清", "公开介绍包含仓位、盈亏比与定投工具。登录后选择与当前任务相符的工具。", R + "/tools", 20, "需 Wise ID"),
    futures: r("WISE CRYPTO", "合约专题", "从保证金与强平规则开始学习", "仅在明确选择合约学习时进入此课。短时先读一节，系统学习按原站课程继续。", R + "/learn/futures-intro", 40, "需 Wise ID"),
    contract: r("WISE INVEST", "情景计算", "用合约计算器检验风险假设", "按假设输入保证金、杠杆和价格变化，比较盈亏与强平结果，保留计算条件。", I + "/tools/contract-calculator"),
    position: r("WISE INVEST", "风险预算", "核算仓位与可承受损失", "先设定风险预算，再用仓位工具检查规模和止损假设，记录极端情形下的差异。", I + "/tools/position-calculator"),
    dca: r("WISE INVEST", "定投案例", "读懂 BTC / ETH 的定投记录", "核对记录更新日、逐期投入和回撤；这是作者的历史案例，先练习复盘方法。", I + "/practice/dca-investment", 25),
    compound: r("WISE INVEST", "计划测算", "比较不同投入与回报假设", "在复利计算器改变投入、期限和收益假设，记录多种结果；测算值不是预期回报。", I + "/tools/compound-calculator"),
    cryptoGuides: r("WISE INVEST", "账户教程", "按平台找注册与使用教程", "在交易所教程目录核对所需材料、费用和服务范围，再决定需要阅读哪篇。", I + "/articles/crypto", 25),
    exchanges: r("WISE INVEST", "平台入口", "核对所选平台的入口与条件", "比较原站列出的交易所入口和费用说明，再到平台确认当前适用条件。", I + "/perk/crypto", 15),
    institutions: r("WISE HOLD", "机构披露", "比较同一报告期的机构持仓", "选一家机构，看报告期、股数变化与来源；申报市值变化不能直接当作净买卖额。", H + "/institutions", 25),
    people: r("WISE HOLD", "人物披露", "先弄清人物持仓的披露口径", "区分 13F 与政界财务披露，检查报告期和提交日，再选一条线索做公司研究。", H + "/celebrities", 25),
    wisdom: r("WISE HOLD", "研究阅读", "围绕当前问题查一篇投资原文", "在智慧库按人物、公司或概念检索，找能支持或反驳当前假设的材料。", H + "/wisdom", 25),
    strategy: r("WISE HOLD", "战略投资", "看巨头投了谁、收购了什么", "此页是科技巨头、伯克希尔与软银的战略投资版图。沿年报和公开披露核对资本流向。", H + "/mag7", 25),
    ipoHome: r("WISE IPO", "市场选择", "先确定参与哪个新股市场", "比较美股、港股和 A 股入口，先确认已有账户与目标市场，再切换下方对应路线。", P + "/", 15),
    ipoGuides: r("WISE IPO", "申购流程", "核对所用券商的申购流程", "在打新攻略中选择对应市场与券商教程，检查材料、入金和申购步骤。已有账户也需核对支持范围。", P + "/guides", 25),
    ipoHK: r("WISE IPO", "港股快照", "只看港股招股与历史表现", "在港股页检查项目日期、近期新股与历史回顾；以发行文件和券商当前安排复核。", P + "/markets/hk", 25),
    ipoUS: r("WISE IPO", "美股快照", "核对美股发行定价与配售条件", "在美股页检查发行日期、价格区间与券商是否开放认购；本地快照可能滞后。", P + "/markets/us", 25),
    ipoCN: r("WISE IPO", "A 股快照", "核对 A 股申购日、权限与额度", "在 A 股页查看申购代码、日期和账户条件，再以券商及发行文件复核有效额度。", P + "/markets/cn", 25),
    banks: r("WISE INVEST", "银行教程", "按账户用途筛选银行教程", "先写清收付款、储蓄或券商入金用途，再在银行教程目录核对所在地、材料和费用。", I + "/articles/bank", 25),
    roadmap: r("WISE INVEST", "资金路径", "核对银行与目标账户能否衔接", "在资金路线图查看银行、券商之间的路径，记录币种、转账条件和待确认费用。", I + "/roadmap", 20),
    brokers: r("WISE INVEST", "券商教程", "按目标市场和资格筛选券商", "从券商教程目录核对开户材料、支持市场与入金要求，先选符合自身条件的路径。", I + "/articles/broker", 25),
    witnessBanks: r("WISE WITNESS", "适用门槛", "先判断是否适合见证开户", "比较银行的存款要求、持有期与费用。原站列有较高资金门槛，核对后再规划办理。", W + "/#banks", 15),
    witnessFaq: r("WISE WITNESS", "材料与限制", "提前核对证件和费用问题", "在常见问题里整理本人到场、所需材料和费用疑问，带着清单向银行确认。", W + "/#faq", 15),
    witnessProcess: r("WISE WITNESS", "流程准备", "按办理阶段列出准备清单", "读咨询、见证、审批与激活流程，标明各阶段条件；阅读时间不等于开户时间。", W + "/#process", 20),
    witnessLocator: r("WISE WITNESS", "网点定位", "在条件确认后查可办理网点", "按已选银行和地区查询网点；预约与资格仍需向银行确认。", W + "/#locator", 10),
    simHome: r("WISE SIM", "用途判断", "先区分长期号码和出行流量", "按收码、保号或旅行需求认识手机卡服务，再比较设备支持与持续使用成本。", S + "/", 10),
    simShop: r("WISE SIM", "产品比较", "按国家、设备和用途比较手机卡", "比较卡种、设备兼容、套餐与激活条件，先列候选，再读对应教程。", S + "/shop", 20),
    simGuides: r("WISE SIM", "激活与使用", "按已有卡种找到使用教程", "从教程目录选择对应卡种，核对激活、充值、保号与故障处理步骤。", S + "/guides", 30),
    giffgaff: r("WISE SIM", "指定卡种", "直达 giffgaff 激活与保号教程", "按当前问题阅读注册、激活、保号或收码章节；费用和保号条件再向运营商核对。", S + "/guides/giffgaff-complete-guide", 30),
    esim: r("WISE SIM", "设备与配置", "核对 Xesim 的设备与开通条件", "先读硬件和设备兼容要求，再看绑定与写入 eSIM 的步骤，确认是否符合实际用途。", S + "/guides/xesim", 20),
    orders: r("WISE SIM", "订单查询", "已在 Wise SIM 购买，查看订单", "使用 Wise ID 查询本站订单；旧账户订单不自动同步，其他渠道购买的卡请回原渠道查单。", S + "/account/orders", 10, "需 Wise ID"),
    start: r("WISE INVEST", "任务分流", "从实际需求选一个起点", "在主站入门页选账户、支付或长期跟踪任务，再回到本页细化目标。", I + "/start", 15),
    sites: r("WISE INVEST", "站点地图", "看清各个 Wise 站点负责什么", "按内容研究、数据工具和出海服务定位站点，选定一个任务后再深入。", I + "/website", 15),
    tools: r("WISE INVEST", "工具目录", "按需要计算的问题选择工具", "从复利、收益率或风险计算中选一个工具，保留输入假设和结果口径。", I + "/tools", 20)
  };

  // Each time budget has an explicit route. No prefix slicing and no forced page count.
  const t = (title, why, short, medium, deep) => ({ title, why, routes: { "10": short.split(" "), "30": medium.split(" "), deep: deep.split(" ") } });
  const profiles = {
    stocks: {
      beginner: t("先理解股票与公司，再学会控制风险", "第一次接触时先学权益和生意，30 分钟优先补上风险意识。", "basics", "basics business risk", "basics business statements valuation risk"),
      familiar: t("把产业关系接到公司和研究记录", "已有基础后，用一家公司贯穿产业定位、业务验证与记录。", "map", "map company research", "map company statements valuation research"),
      active: t("沿事件追到公司，留下下一次验证点", "已有研究对象时先核对事件来源，再验证影响链路。", "signals", "signals company research", "signals map company statements research")
    },
    industry: {
      beginner: t("从一门生意进入一条产业链", "先理解客户与收入，才能判断产业关系怎样影响经营。", "map", "business map company", "business map company statements research"),
      familiar: t("从产业环节找到可验证的公司", "先定位环节，再查公司，最后把关系写成待验证假设。", "map", "map company research", "map company strategy statements research"),
      active: t("用事件与经营证据校准产业判断", "先锁定产业位置，再核对事件是否真正改变需求与收入。", "map", "map signals company", "map signals company statements research")
    },
    macro: {
      beginner: t("先理解传导，再比较相反情景", "从宏观关系图建立因果顺序，再用实验室练习条件变化。", "macro", "macro lab", "macro lab business research"),
      familiar: t("用情景推演检验宏观解释", "已有概念后直接比较情景，再验证影响怎样进入公司经营。", "lab", "lab company research", "macro lab company statements research"),
      active: t("把宏观假设落到公司和验证条件", "围绕一个变量推演，用公司证据约束结论。", "lab", "lab company research", "lab signals company research")
    },
    company: {
      beginner: t("先懂生意，再读三张报表", "先建立业务语言，再用报告期与三表关系阅读公司材料。", "business", "business statements company", "business statements company valuation risk"),
      familiar: t("带着经营问题回到财报证据", "先选公司，再用三表方法核对实际经营，留下研究记录。", "company", "company statements research", "company statements valuation risk research"),
      active: t("复核公司假设与财报口径", "围绕当前研究公司检查证据和估值假设，记录失效条件。", "company", "company statements research", "company statements valuation research")
    },
    etf: {
      beginner: t("先看投入前提，再比较购买路径", "先确认资金适用性和产品层次，再使用场内外比较工具。", "product", "suitability product compare", "suitability product compare costs plan"),
      familiar: t("同一指数下比较额度、溢价与成本", "已有基础后先设自己的条件，再核对两条路径的数据。", "compare", "compare limits premium", "compare limits premium costs plan"),
      active: t("先核对有效数据，再复查路径", "先检查申购状态和收盘溢价，再把有效数据带入比较。", "compare", "limits premium compare", "limits premium compare costs plan")
    },
    limits: {
      beginner: t("先懂 QDII，再查申购条件", "先理解产品与额度，再核对能否按计划投入。", "limits", "qdii limits compare", "qdii limits costs compare"),
      familiar: t("从额度约束反推购买路径", "先查目标基金状态，再比较额度不足时的可选路径。", "limits", "limits compare", "limits costs compare plan"),
      active: t("核对本次申购的额度和日期", "先以有效状态核对计划投入，缺数据就保留待确认项。", "limits", "limits compare", "limits compare costs plan")
    },
    premium: {
      beginner: t("先理解溢价，再比较替代路径", "先分清价格和净值，再阅读同口径的溢价数据。", "premium", "onexchange premium compare", "onexchange premium limits compare"),
      familiar: t("核对溢价口径，再比较成本", "从价格与净值日期开始，比较同指数产品的购买摩擦。", "premium", "premium compare", "premium limits compare costs"),
      active: t("先核对溢价，再检查可用替代渠道", "把收盘快照与实际渠道核对，避免按错位数据作判断。", "premium", "premium limits compare", "premium limits compare costs")
    },
    etfDca: {
      beginner: t("先设计可持续的指数定投计划", "先看资金适用性和投入节奏，再选产品渠道。", "schedule", "suitability schedule compare", "suitability schedule compare drawdown plan"),
      familiar: t("把定投节奏与渠道约束接起来", "先核对计划，再把额度、成本和压力情景纳入执行条件。", "schedule", "schedule compare plan", "schedule compare costs drawdown plan"),
      active: t("先核对本期可执行性，再复查计划", "已有定投计划时先查额度与渠道，再回看调整条件。", "limits", "limits compare plan", "limits compare drawdown plan")
    },
    crypto: {
      beginner: t("从市场用途进入观察和风险计算", "先认识工作台，再看行情与计算边界，围绕一个观察问题继续。", "cryptoHome", "cryptoHome market cryptoTools", "cryptoHome market cryptoTools"),
      familiar: t("先观察行情，再核对风险假设", "已有基础时从市场工作台开始，围绕观察条件使用工具。", "market", "market cryptoTools", "market cryptoTools"),
      active: t("带着风险预算检查市场条件", "先把风险边界算清，再检查市场是否符合自己的观察条件。", "cryptoTools", "cryptoTools market", "cryptoTools market")
    },
    cryptoDca: {
      beginner: t("先读定投记录，再练习投入测算", "用历史案例理解成本与回撤，再用自己的假设做测算。", "dca", "dca compound", "dca compound cryptoTools"),
      familiar: t("从历史明细检查定投假设", "先读真实记录的时间口径，再比较投入节奏与假设。", "dca", "dca cryptoTools compound", "dca compound cryptoTools"),
      active: t("复查定投成本和持续投入能力", "先核对成本记录，再测算下一阶段投入的约束。", "dca", "dca cryptoTools", "dca cryptoTools compound")
    },
    futures: {
      beginner: t("先学合约规则，再做风险练习", "明确选择合约学习后，先读保证金与强平课程，再使用计算器。", "futures", "futures contract", "futures contract position"),
      familiar: t("把合约规则转换成风险算例", "用计算器对照保证金和强平假设，再检查仓位规模。", "contract", "contract position futures", "futures contract position"),
      active: t("先核对仓位和强平假设", "实操阶段从风险预算和情景计算开始，有概念缺口再回课程。", "position", "position contract", "position contract futures")
    },
    exchange: {
      beginner: t("先核对平台条件，再读账户教程", "开户任务先检查资格、材料与费用，不由行情波动决定平台开户。", "cryptoGuides", "cryptoGuides exchanges", "cryptoGuides exchanges cryptoHome"),
      familiar: t("按使用需求核对平台与教程", "选定平台后再检查对应注册与使用流程。", "exchanges", "exchanges cryptoGuides", "exchanges cryptoGuides"),
      active: t("直接找到所用平台的操作教程", "已有目标平台时直达教程，按需要复核入口与条件。", "cryptoGuides", "cryptoGuides exchanges", "cryptoGuides exchanges")
    },
    institutions: {
      beginner: t("从报告期读懂一份机构披露", "先学会辨认披露口径，再把一条持仓线索接到公司研究。", "institutions", "institutions business company", "institutions business company statements research"),
      familiar: t("从机构变化追到公司证据", "持仓只提供研究线索，继续核对业务与财报。", "institutions", "institutions company research", "institutions company statements research"),
      active: t("验证机构变化背后的经营假设", "比较同口径股数变化，再用公司材料验证，最后写下反例。", "institutions", "institutions company research", "institutions company statements valuation research")
    },
    people: {
      beginner: t("先区分披露口径，再理解人物线索", "人物页含多种披露制度，先看报告时间，再研究对应公司。", "people", "people business company", "people wisdom company statements"),
      familiar: t("把人物披露转成公司研究问题", "从人物持仓提取一个问题，再查业务与证据。", "people", "people company research", "people company statements research"),
      active: t("核对人物线索的时点与经营证据", "先判断披露是否可比，再把线索接到公司假设。", "people", "people company research", "people company statements research")
    },
    strategy: {
      beginner: t("从巨头投资看懂业务关系", "战略投资与基金持仓用途不同，先认识资本投向，再接产业地图。", "strategy", "strategy map company", "strategy business map company"),
      familiar: t("沿巨头资本投向验证产业关系", "从战略投资版图提取关系，再看产业位置与公司业务。", "strategy", "strategy map company", "strategy map company research"),
      active: t("核对战略投资能否转成经营结果", "从公开战略布局出发，再核对公司材料和研究假设。", "strategy", "strategy company research", "strategy map company statements research")
    },
    ipo: {
      beginner: t("先选市场，再看对应申购流程", "先根据已有账户和参与条件确定市场，再核对该市场的申购流程。", "ipoHome", "ipoHome ipoGuides", "ipoHome ipoGuides"),
      familiar: t("先确定账户可参与的市场", "先在总览确定市场，再核对对应券商流程；可在左侧直接选市场。", "ipoHome", "ipoHome ipoGuides", "ipoHome ipoGuides"),
      active: t("按本次申购市场进入对应列表", "先选本次目标市场；已有账户仍需核对该券商是否开放具体项目。", "ipoHome", "ipoHome ipoGuides", "ipoHome ipoGuides")
    },
    bank: {
      beginner: t("先确认用途与材料，再检查资金路径", "从银行教程和适用条件开始，再核对资金怎样进入目标账户。", "banks", "banks roadmap", "banks roadmap"),
      familiar: t("先检查资金路径，再筛银行教程", "已有基础时优先核对目标账户、币种与转账衔接。", "roadmap", "roadmap banks", "roadmap banks"),
      active: t("按所选银行核对材料和后续入金", "已有办理目标时直达教程，按自己的资金路径补齐缺项。", "banks", "banks roadmap", "banks roadmap")
    },
    broker: {
      beginner: t("先确认券商资格，再规划账户衔接", "从目标市场、材料与开户资格开始，再核对银行和券商的入金衔接。", "brokers", "brokers roadmap", "brokers banks roadmap"),
      familiar: t("对照券商要求核对入金路径", "已有基础时按目标市场筛券商，再核对已有银行是否可衔接。", "brokers", "brokers roadmap", "brokers roadmap banks"),
      active: t("直达券商教程核对当前步骤", "按所选券商找材料与入金步骤，遇到链路缺口再查银行。", "brokers", "brokers roadmap", "brokers roadmap")
    },
    witness: {
      beginner: t("先核对见证门槛，再了解流程", "资金、证件和所在地决定是否适用，符合条件后再安排网点。", "witnessBanks", "witnessBanks witnessFaq witnessProcess", "witnessBanks witnessFaq witnessProcess witnessLocator"),
      familiar: t("把银行条件接到材料和办理顺序", "先完成银行条件比较，再整理材料与流程。", "witnessBanks", "witnessBanks witnessFaq witnessProcess", "witnessBanks witnessFaq witnessProcess witnessLocator"),
      active: t("带着已选银行准备流程和网点", "短时先核对所处办理阶段，完整路线先复核资格与材料，再查网点。", "witnessProcess", "witnessBanks witnessProcess witnessLocator", "witnessBanks witnessFaq witnessProcess witnessLocator")
    },
    sim: {
      beginner: t("先按用途选卡，再核对激活条件", "收码与出行流量用途不同，先比较设备和使用条件。", "simHome", "simShop simGuides", "simHome simShop simGuides"),
      familiar: t("比较卡种与持续使用成本", "先按国家和设备筛候选，再查对应教程。", "simShop", "simShop simGuides", "simShop simGuides"),
      active: t("核对卡种与激活条件是否匹配", "先比较产品和教程的使用条件；已有卡可切换到激活与保号。", "simShop", "simShop simGuides", "simShop simGuides")
    },
    simUse: {
      beginner: t("按卡种找到激活与保号步骤", "这是使用任务，先找对应教程，无需再走购卡路径。", "simGuides", "simGuides", "simGuides"),
      familiar: t("直达已有手机卡的使用教程", "围绕激活、保号或收码问题查对应章节。", "simGuides", "simGuides", "simGuides"),
      active: t("定位当前激活或收码问题", "在对应卡种教程内查当前步骤，保留待向运营商确认的问题。", "simGuides", "simGuides", "simGuides")
    },
    esim: {
      beginner: t("先确认 eSIM 兼容，再看开通方式", "原站有 Xesim 具体教程，先核对它是否适合自己的设备和用途。", "esim", "esim simShop", "esim simShop"),
      familiar: t("从设备兼容检查 eSIM 方案", "先核对硬件与配置要求，再比较产品条件。", "esim", "esim simShop", "esim simShop"),
      active: t("核对 Xesim 绑定和写入步骤", "已有设备时直接读操作教程，其他产品需用对应教程。", "esim", "esim", "esim")
    },
    orders: {
      beginner: t("查询 Wise SIM 本站订单", "只适用于已在 Wise SIM 下单的用户；查单不需要附加学习路线。", "orders", "orders", "orders"),
      familiar: t("查询 Wise SIM 本站订单", "使用购买时对应的账户查询订单状态，保留需要联系售后的问题。", "orders", "orders", "orders"),
      active: t("查询 Wise SIM 本站订单", "核对本站订单状态，其他购买渠道需回原渠道查询。", "orders", "orders", "orders")
    },
    general: {
      beginner: t("先确定任务，再认识对应站点", "目标尚未明确时，先从主站的需求入口分流。", "start", "start sites", "start sites"),
      familiar: t("按任务找到合适的 Wise 站点", "已有基础时用站点地图定位，不强行加入某一种资产的学习路线。", "sites", "sites tools", "sites tools"),
      active: t("从具体工具定位当前问题", "已经在实践时先找所需工具，任务明确后再细化路线。", "tools", "tools sites", "tools sites")
    }
  };
  for (const [focus, key, label] of [["hk", "ipoHK", "港股"], ["us", "ipoUS", "美股"], ["cn", "ipoCN", "A 股"]]) {
    profiles["ipo" + focus] = {
      beginner: t(`围绕${label}核对资格、项目与流程`, "先看目标市场的项目和参与条件，再找相应券商教程。", key, `${key} ipoGuides`, `ipoGuides ${key}`),
      familiar: t(`在${label}完成项目与流程核对`, "只围绕所选市场比较近期和历史项目，再检查所用券商流程。", key, `${key} ipoGuides`, `${key} ipoGuides`),
      active: t(`直达${label}，核对本次项目条件`, "以项目日期和发行条件为起点，再核对申购渠道，不跳转其他市场。", key, `${key} ipoGuides`, `${key} ipoGuides`)
    };
  }
  const option = (id, label, profile) => ({ id, label, profile });
  const goalConfigs = {
    us: { label: "美股学习", options: [option("default", "综合学习", "stocks"), option("industry", "产业链", "industry"), option("macro", "宏观传导", "macro"), option("company", "公司与财报", "company")] },
    etf: { label: "ETF / QDII", options: [option("default", "场内外比较", "etf"), option("limits", "查申购额度", "limits"), option("premium", "查场内溢价", "premium"), option("dca", "制定定投计划", "etfDca")] },
    crypto: { label: "加密市场", options: [option("default", "市场与风险", "crypto"), option("dca", "BTC / ETH 定投", "cryptoDca"), option("futures", "合约学习", "futures"), option("exchange", "平台与开户", "exchange")] },
    hold: { label: "聪明资金", options: [option("default", "机构 13F", "institutions"), option("people", "人物披露", "people"), option("strategy", "巨头战略投资", "strategy")] },
    ipo: { label: "新股机会", options: [option("default", "尚未选市场", "ipo"), option("hk", "港股", "ipohk"), option("us", "美股", "ipous"), option("cn", "A 股", "ipocn")] },
    overseas: { label: "出海服务", options: [option("default", "银行账户", "bank"), option("broker", "港美股券商", "broker"), option("witness", "见证开户", "witness"), option("sim", "海外通信", "sim")] },
    sim: { label: "海外通信", options: [option("default", "选择手机卡", "sim"), option("use", "激活与保号", "simUse"), option("esim", "eSIM 兼容", "esim"), option("orders", "本站订单", "orders")] },
    general: { label: "任务导航", options: [option("default", "先找到方向", "general")] }
  };

  function inferIntent(text, fallback = "general") {
    const raw = String(text || "").trim().toLowerCase();
    // Remove explicit excluded activities before keyword matching, so “不做合约，只看 BTC 定投” stays on DCA.
    const value = raw.replace(/(?:不做|不想做|不碰|不要|不需要|不考虑|不学|不玩|不看|不买)(?:任何)?(?:合约|杠杆|期货|开户|手机卡|定投|打新|见证)/g, "");
    const result = (goal, focus = "default") => ({ goal, focus, recognized: true });
    if (/手机卡|电话卡|保号|收码|验证码|giffgaff|xesim|\besim\b|\bsim\b/.test(value)) {
      if (/订单|物流|发货|查单/.test(value)) return result("sim", "orders");
      if (/giffgaff|激活|保号|收码失败|收不到/.test(value)) return result("sim", "use");
      if (/xesim|\besim\b/.test(value)) return result("sim", "esim");
      return result("sim");
    }
    if (/ipo|新股|打新/.test(value)) return result("ipo", /港股|香港/.test(value) ? "hk" : /a\s*股|沪市|深市|科创|创业板|北交/.test(value) ? "cn" : /美股|美國|美国/.test(value) ? "us" : "default");
    if (/巨头.*(?:投资|收购|布局)|战略投资|mag7|七巨头/.test(value)) return result("hold", "strategy");
    if (/13f|机构.*持仓|聪明资金|巴菲特|段永平|芒格|名人|佩洛西|政界|持仓披露/.test(value)) return result("hold", /巴菲特|段永平|芒格|名人|佩洛西|政界/.test(value) ? "people" : "default");
    if (/加密|比特币|\bbtc\b|\beth\b|以太坊|合约|交易所|币安|okx|买币/.test(value)) return result("crypto", /合约|杠杆|强平/.test(value) ? "futures" : /定投|dca/.test(value) ? "dca" : /开户|注册|交易所|币安|okx/.test(value) ? "exchange" : "default");
    if (/etf|qdii|纳指|标普|溢价|指数基金|定投/.test(value)) return result("etf", /溢价|折价/.test(value) ? "premium" : /额度|限购|申购|场外|没有证券账户/.test(value) ? "limits" : /定投|dca/.test(value) ? "dca" : "default");
    if (/见证/.test(value)) return result("overseas", "witness");
    if (/券商|盈透|嘉信|长桥|(?:美股|港股|港美股).*(?:开户|开通|账户)/.test(value)) return result("overseas", "broker");
    if (/银行|开户|跨境|入金|境外账户|汇丰|中银/.test(value)) return result("overseas");
    if (/宏观|降息|加息|通胀|cpi|非农|美联储/.test(value)) return result("us", "macro");
    if (/财报|估值/.test(value)) return result("us", "company");
    if (/产业|\bai\b|人工智能|半导体|存储|内存|hbm|机器人|robot|航天|太空|卫星|spacex|核电|核能/.test(value)) return result("us", "industry");
    if (/公司|英伟达|nvda|微软/.test(value)) return result("us", "company");
    if (/美股|股票/.test(value)) return result("us");
    return { goal: own(goalConfigs, fallback) ? fallback : "general", focus: "default", recognized: false };
  }
  const inferGoal = (text, fallback) => inferIntent(text, fallback).goal;

  function buildPlan(input = {}) {
    const requestedGoal = own(goalConfigs, input.goal) ? input.goal : "general";
    const experience = own(experienceLabels, input.experience) ? input.experience : "beginner";
    const time = own(timeRules, input.time) ? input.time : "30";
    const question = String(input.question || "").trim().slice(0, 120);
    const intent = inferIntent(question, requestedGoal);
    const goal = intent.recognized ? intent.goal : requestedGoal;
    const config = goalConfigs[goal];
    const requestedFocus = intent.recognized ? intent.focus : input.focus;
    const selection = config.options.find(item => item.id === requestedFocus) || config.options[0];
    const track = profiles[selection.profile][experience];
    let keys = [...track.routes[time]];
    if (goal === "us" && selection.id === "industry" && /\bai\b|人工智能/i.test(question)) keys = keys.map(key => key === "map" ? "ai" : key);
    if (goal === "sim" && selection.id === "use" && /giffgaff/i.test(question)) keys = keys.map(key => key === "simGuides" ? "giffgaff" : key);
    const noBroker = goal === "etf" && /(?:没有|还没|无)(?:有|开通|开)?证券账户/.test(question);
    if (noBroker) keys = keys.filter(key => key !== "premium");
    const sector = goal === "us" ? [
      { pattern: /存储|内存|hbm/i, id: "storage", label: "存储" },
      { pattern: /机器人|robot/i, id: "robotics", label: "机器人" },
      { pattern: /航天|太空|卫星|spacex/i, id: "space", label: "航天" },
      { pattern: /核电|核能/i, id: "energy", label: "核电" }
    ].find(item => item.pattern.test(question)) : null;
    const steps = keys.map(key => {
      let item = resources[key];
      if (sector && ["map", "ai", "company"].includes(key)) {
        item = { ...item, url: `${C}/${key === "company" ? "companies" : "chain"}?industry=${sector.id}`,
          title: key === "company" ? `在${sector.label}目录核对公司业务` : `沿${sector.label}产业链定位环节`,
          desc: key === "company" ? `已定位${sector.label}公司目录，围绕产品、客户与经营证据筛选研究对象。` : `已定位${sector.label}产业图谱，从需求、产品与交付关系选一个环节，再核对公司。` };
      }
      const minutes = time === "deep" ? item.deepMinutes : keys.length === 1 && time === "30" ? Math.min(30, item.deepMinutes) : 10;
      return { ...item, key, minutes, time: `约 ${minutes} 分钟`, auth: item.access.includes("Wise ID") };
    });
    const totalMinutes = steps.reduce((sum, step) => sum + step.minutes, 0);
    const scope = time === "10" ? "本次只浏览一个入口，完成卡片中的第一项核对。"
      : time === "30" ? `用约 ${totalMinutes} 分钟聚焦 ${steps.length} 个必要入口，先看相关单元。`
        : `用约 ${totalMinutes} 分钟完成这条专题阅读路径，可分次进行；完整课程仍按原站进度继续。`;
    const queryNote = question ? intent.recognized ? "已按输入中的具体任务细分。" : "未识别到明确任务，暂按当前选项生成，可用左侧具体任务修正。" : "";
    const note = goal === "ipo" ? "新股页面含本地快照，项目日期与参与条件需在发行文件或券商处复核。"
      : goal === "hold" ? "持仓披露有时间差；先核对报告期与来源，再做公司研究。"
        : goal === "etf" ? "动态数据缺失时保留待确认项，不把历史额度或收盘溢价当作实时可执行数据。"
          : steps.some(step => step.auth) ? "原站可能要求 Wise ID 或相应权限，具体以打开时的页面提示为准。时间为阅读与核对预算。" : "时间为阅读与核对预算，不包含开户、审批、交易或完整课程的完成时间。";
    return {
      goal, focus: selection.id, experience, time, question,
      label: config.label, focusLabel: selection.label,
      title: time === "10" ? `10 分钟：${steps[0].title}` : track.title,
      summary: `${queryNote}${track.why}${noBroker ? "未有证券账户，优先核对场外渠道。" : ""}${scope}`,
      steps, totalMinutes, note,
      matchText: question ? intent.recognized ? "已识别具体任务" : "按所选条件生成" : "已按任务安排",
      reasonTags: [selection.label, experienceLabels[experience], `${steps.length} 个入口 · 约 ${totalMinutes} 分钟`]
    };
  }
  return { buildPlan, inferGoal, inferIntent, goalConfigs, experienceLabels, timeRules, resources, hasGoal: goal => own(goalConfigs, goal) };
});
