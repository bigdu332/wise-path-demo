(function attachWisePathEngine(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.WisePathEngine = api;
})(typeof window !== "undefined" ? window : globalThis, function createWisePathEngine() {
  const experienceLabels = {
    beginner: "第一次接触",
    familiar: "有些基础",
    active: "正在实操"
  };

  const timeRules = {
    "10": { label: "10 分钟", stepCount: 1 },
    "30": { label: "30 分钟", stepCount: 3 },
    deep: { label: "系统学习", stepCount: 4 }
  };

  const experienceLogic = {
    beginner: { tag: "保留基础入口", summary: "保留概念和风险边界，从最容易理解的入口开始。" },
    familiar: { tag: "跳过通识介绍", summary: "跳过宽泛介绍，直接进入比较、验证和专题页面。" },
    active: { tag: "直达工具与数据", summary: "跳过入门内容，直接进入数据、工具和执行入口。" }
  };

  const r = (site, type, title, desc, url, deepMinutes = 20, auth = false) => ({
    site, type, title, desc, url, quickMinutes: 10, deepMinutes, auth
  });

  const goalConfigs = {
    us: {
      label: "美股学习",
      resources: {
        start: r("WISE INVEST", "新手入口", "先判断自己在哪一步", "用主站四步路线确认需求、账户与下一次行动。", "https://www.wise-invest.org/start", 15),
        home: r("CHAIN", "认识体系", "先看 CHAIN 如何组织研究", "理解市场学习、产业地图、公司研究与事件检索的分工。", "https://chain.wise-invest.org/", 15),
        glossary: r("CHAIN", "补齐概念", "用关键词索引扫清术语", "先理解研究中反复出现的宏观、产业与财报概念。", "https://chain.wise-invest.org/learn/glossary", 20, true),
        macro: r("CHAIN", "形成框架", "沿宏观传导理解市场", "把利率、经济背景、盈利预期与估值放在一起。", "https://chain.wise-invest.org/learn/macro", 25, true),
        map: r("CHAIN", "产业验证", "进入产业地图核对关系", "从产品和环节定位公司，避免只按新闻标题找标的。", "https://chain.wise-invest.org/chain?industry=ai", 25, true),
        companies: r("CHAIN", "公司研究", "回到公司经营结果", "核对产品、客户、产能、收入与公司指引。", "https://chain.wise-invest.org/companies", 25, true),
        lab: r("CHAIN", "情景推演", "用宏观实验室做变量推演", "改变关键变量，观察政策、盈利与估值的传导。", "https://chain.wise-invest.org/learn/macro/lab", 25, true),
        signals: r("CHAIN", "事件检索", "直接检索近期市场事件", "从实时事件出发，判断影响环节与待验证公司。", "https://chain.wise-invest.org/signals", 15, true),
        point: r("WISE INVEST", "点位观察", "把判断落到观察位置", "用点位页面建立持续观察和复盘节奏。", "https://www.wise-invest.org/point", 20)
      },
      tracks: {
        beginner: { title: "先建立框架，再追一条产业链", steps: ["start", "home", "glossary", "macro"] },
        familiar: { title: "跳过通识，直接验证宏观与产业关系", steps: ["macro", "map", "companies", "lab"] },
        active: { title: "从事件和数据出发，形成可复查结论", steps: ["signals", "companies", "point", "map"] }
      }
    },
    etf: {
      label: "ETF / QDII",
      resources: {
        chooser: r("WISE ETF", "路径判断", "先判断场内还是场外", "把额度、溢价、费率和使用场景放进同一个选择。", "https://www.wise-etf.com/chooser", 20),
        lazy: r("WISE ETF", "组合入门", "从懒人组合理解配置", "先看组合结构，再决定是否需要更复杂的选择。", "https://www.wise-etf.com/lazy", 20),
        valuation: r("WISE ETF", "估值理解", "查看指数估值与历史位置", "把当前数据放进历史区间，而不是只看单日涨跌。", "https://www.wise-etf.com/qdii", 25),
        nasdaq: r("WISE INVEST", "系统阅读", "补充纳指长期投资框架", "用主站专题理解指数、周期与长期执行。", "https://www.wise-invest.org/book/nasdaq", 25),
        limits: r("WISE ETF", "额度核对", "直接查看今日 QDII 额度", "先确认能否申购，再比较后续路径。", "https://www.wise-etf.com/today/qdii-limits", 15),
        premium: r("WISE ETF", "溢价监控", "直接查看今日场内溢价", "先识别异常溢价，避免为同一资产支付过高价格。", "https://www.wise-etf.com/today/etf-premium", 15),
        export: r("WISE ETF", "数据导出", "导出数据做自己的复盘", "把公开数据带入个人表格，建立可重复的观察流程。", "https://www.wise-etf.com/export", 20)
      },
      tracks: {
        beginner: { title: "先学会选择路径，再理解估值", steps: ["chooser", "lazy", "valuation", "nasdaq"] },
        familiar: { title: "直接比较额度、溢价与估值", steps: ["limits", "premium", "chooser", "valuation"] },
        active: { title: "从实时数据开始，完成当天的执行判断", steps: ["premium", "limits", "export", "valuation"] }
      }
    },
    crypto: {
      label: "加密市场",
      resources: {
        overview: r("WISE CRYPTO", "公共总览", "先认识加密工作台", "理解行情、工具、学习与开户路径分别解决什么问题。", "https://crypto.wise-invest.org/", 15),
        futures: r("WISE CRYPTO", "风险入门", "用合约课程理解规则", "先理解杠杆、保证金和强平，再考虑任何操作。", "https://crypto.wise-invest.org/learn/futures-intro", 25, true),
        learn: r("WISE CRYPTO", "学习入口", "从学习区补齐基础概念", "按主题建立市场、交易和风险的基本框架。", "https://crypto.wise-invest.org/learn", 20),
        market: r("WISE CRYPTO", "行情观察", "查看 BTC / ETH 的位置", "结合趋势、均线与关键位置形成可解释判断。", "https://crypto.wise-invest.org/btc", 20, true),
        tools: r("WISE CRYPTO", "风险工具", "先把仓位和盈亏算清楚", "用仓位、杠杆、盈亏比与定投工具明确边界。", "https://crypto.wise-invest.org/tools", 20, true),
        exchanges: r("WISE CRYPTO", "行动入口", "比较交易所与开户路径", "确认平台、费用和使用场景，再进入注册流程。", "https://crypto.wise-invest.org/exchanges", 15),
        dca: r("WISE INVEST", "长期复盘", "回到真实定投记录", "用成本、收益曲线和明细校准长期执行。", "https://www.wise-invest.org/practice/dca-investment", 25)
      },
      tracks: {
        beginner: { title: "先理解规则与风险，再看价格", steps: ["overview", "learn", "futures", "market"] },
        familiar: { title: "从行情与风险工具进入具体判断", steps: ["market", "tools", "futures", "exchanges"] },
        active: { title: "先算风险，再进入行情与执行入口", steps: ["tools", "market", "exchanges", "dca"] }
      }
    },
    hold: {
      label: "聪明资金",
      resources: {
        wisdom: r("WISE HOLD", "投资原则", "先读智慧文集建立边界", "理解能力圈和长期主义，避免把持仓披露当成抄作业。", "https://www.wise-hold.com/wisdom", 20),
        celebrities: r("WISE HOLD", "人物线索", "查看政商名人的公开持仓", "从人物变化中发现问题，再回到公司基本面核对。", "https://www.wise-hold.com/celebrities", 20),
        institutions: r("WISE HOLD", "机构数据", "追踪机构 13F 变化", "比较新建、增持、减持与清仓，识别共识和分歧。", "https://www.wise-hold.com/institutions", 25),
        mag7: r("WISE HOLD", "集中研究", "查看七巨头持仓版图", "把大型科技公司的机构暴露放进同一视图比较。", "https://www.wise-hold.com/mag7", 20),
        trump: r("WISE HOLD", "事件专题", "查看特朗普公开持仓", "把人物、政策与持仓线索分开核对。", "https://www.wise-hold.com/trump", 20),
        tweets: r("WISE INVEST", "逻辑核对", "回到文章库补充研究背景", "结合公司、估值和市场环境复核持仓变化。", "https://www.wise-invest.org/tweets", 25)
      },
      tracks: {
        beginner: { title: "先建立原则，再理解持仓披露", steps: ["wisdom", "celebrities", "institutions", "tweets"] },
        familiar: { title: "从人物与机构变化中寻找研究线索", steps: ["celebrities", "institutions", "mag7", "wisdom"] },
        active: { title: "直接进入机构数据，核对集中暴露", steps: ["institutions", "mag7", "trump", "tweets"] }
      }
    },
    ipo: {
      label: "新股机会",
      resources: {
        guides: r("WISE IPO", "规则入门", "先看打新攻略", "理解不同市场的门槛、流程和主要风险。", "https://www.wise-ipo.com/guides", 20),
        home: r("WISE IPO", "机会总览", "查看当前可参与机会", "先浏览当前项目，再决定进入哪个市场。", "https://www.wise-ipo.com/", 15),
        us: r("WISE IPO", "美股市场", "进入美股打新列表", "查看美股新股信息与相关分析。", "https://www.wise-ipo.com/markets/us", 20),
        hk: r("WISE IPO", "港股市场", "进入港股打新列表", "查看港股新股信息与相关分析。", "https://www.wise-ipo.com/markets/hk", 20),
        cn: r("WISE IPO", "A 股市场", "进入 A 股打新列表", "查看近期申购安排和项目资料。", "https://www.wise-ipo.com/markets/cn", 20),
        broker: r("WISE INVEST", "账户准备", "核对券商与账户入口", "在参与前确认账户、资金和市场条件。", "https://www.wise-invest.org/perk/broker", 20)
      },
      tracks: {
        beginner: { title: "先看规则，再比较三个市场", steps: ["guides", "home", "us", "hk"] },
        familiar: { title: "先看当前机会，再核对市场与账户", steps: ["home", "us", "guides", "broker"] },
        active: { title: "直接进入市场列表完成机会筛选", steps: ["us", "hk", "cn", "home"] }
      }
    },
    overseas: {
      label: "境外开户",
      resources: {
        start: r("WISE INVEST", "需求分流", "先确认账户用途与资金路径", "从收款、入金和日常使用场景判断真实需求。", "https://www.wise-invest.org/start", 15),
        bank: r("WISE INVEST", "银行入口", "浏览境外银行办理入口", "比较门槛、账户用途和后续资金链路。", "https://www.wise-invest.org/perk/bank", 20),
        compare: r("WISE WITNESS", "银行对比", "集中比较五家银行", "把门槛、时间、用途和服务方式放在一起。", "https://www.wise-witness.com/#banks", 20),
        locator: r("WISE WITNESS", "网点查询", "直接查询可办理网点", "按地区和银行定位下一步办理地点。", "https://www.wise-witness.com/#locator", 15),
        process: r("WISE WITNESS", "办理流程", "核对见证开户完整流程", "从咨询、见证到审批和收卡逐步准备。", "https://www.wise-witness.com/#process", 20),
        faq: r("WISE WITNESS", "风险排查", "先看常见问题", "提前核对材料、时间和可能遇到的限制。", "https://www.wise-witness.com/#faq", 15),
        contact: r("WISE WITNESS", "咨询入口", "带着明确问题进入咨询", "已经完成比较后，再提交具体需求。", "https://www.wise-witness.com/#contact", 15)
      },
      tracks: {
        beginner: { title: "先确认用途，再理解银行和流程", steps: ["start", "bank", "faq", "compare"] },
        familiar: { title: "直接比较银行、网点与办理流程", steps: ["compare", "locator", "process", "faq"] },
        active: { title: "从网点和流程开始，准备实际办理", steps: ["locator", "process", "contact", "bank"] }
      }
    },
    sim: {
      label: "海外通信",
      resources: {
        guides: r("WISE SIM", "激活入门", "先看激活与使用教程", "先理解激活、充值和保号，再选择产品。", "https://www.wise-sim.org/guides", 20),
        home: r("WISE SIM", "场景判断", "了解海外号码适合什么场景", "从收码、保号、出行和长期使用判断需求。", "https://www.wise-sim.org/", 15),
        shop: r("WISE SIM", "产品比较", "进入手机卡商城", "根据国家、套餐与使用周期比较产品。", "https://www.wise-sim.org/shop", 20),
        giffgaff: r("WISE SIM", "具体产品", "查看 giffgaff 产品页", "核对价格、套餐和购买条件。", "https://www.wise-sim.org/shop/giffgaff", 15),
        orders: r("WISE SIM", "订单管理", "直接查看我的订单", "已购买用户从订单页继续激活和售后。", "https://www.wise-sim.org/account/orders", 15, true)
      },
      tracks: {
        beginner: { title: "先学会激活与保号，再选择产品", steps: ["guides", "home", "shop", "giffgaff"] },
        familiar: { title: "直接比较产品，再补充激活教程", steps: ["shop", "giffgaff", "guides", "home"] },
        active: { title: "进入订单和教程，完成购买后操作", steps: ["orders", "guides", "giffgaff", "shop"] }
      }
    },
    general: {
      label: "完整入门",
      resources: {
        start: r("WISE INVEST", "路线起点", "从投资入门路线开始", "先判断问题，再进入对应教程、产品与工具。", "https://www.wise-invest.org/start", 15),
        roadmap: r("WISE INVEST", "资金地图", "看清账户与资金链路", "理解银行卡、银行、券商、交易所和长期投资的位置。", "https://www.wise-invest.org/roadmap", 20),
        websites: r("WISE INVEST", "站点地图", "认识 Wise 系列站点", "快速了解每个站点分别解决什么问题。", "https://www.wise-invest.org/website", 15),
        practice: r("WISE INVEST", "长期实践", "进入真实定投记录", "用成本和收益曲线建立长期复盘节奏。", "https://www.wise-invest.org/practice/dca-investment", 25),
        tweets: r("WISE INVEST", "内容筛选", "直接浏览精选内容", "从真实市场问题进入专题和判断。", "https://www.wise-invest.org/tweets", 20),
        tools: r("WISE INVEST", "工具箱", "把模糊判断变成数字", "使用仓位、复利、补仓与收益率工具。", "https://www.wise-invest.org/tools", 20),
        point: r("WISE INVEST", "点位观察", "进入点位观察页面", "把已有判断落到持续观察和复盘。", "https://www.wise-invest.org/point", 20),
        get: r("WISE INVEST", "行动入口", "直接进入产品与福利入口", "已经知道目标时，跳过浏览并完成下一步。", "https://www.wise-invest.org/get", 15)
      },
      tracks: {
        beginner: { title: "先看全局地图，再完成第一个行动", steps: ["start", "roadmap", "websites", "practice"] },
        familiar: { title: "从内容和工具进入持续实践", steps: ["tweets", "websites", "tools", "practice"] },
        active: { title: "直达行动、点位与复盘工具", steps: ["get", "point", "tools", "tweets"] }
      }
    }
  };

  function inferGoal(text, fallback = "general") {
    const value = String(text || "").trim().toLowerCase();
    if (!value) return goalConfigs[fallback] ? fallback : "general";
    const rules = [
      ["sim", /手机卡|电话卡|流量|保号|收码|giffgaff|esim|sim/],
      ["crypto", /加密|比特币|btc|eth|以太坊|合约|交易所|币安|okx/],
      ["etf", /etf|qdii|纳指|标普|指数|溢价|定投/],
      ["hold", /持仓|13f|机构|巴菲特|名人|聪明资金/],
      ["ipo", /ipo|新股|打新|上市/],
      ["overseas", /银行|开户|见证|跨境|入金|境外账户/],
      ["us", /美股|ai|人工智能|产业链|公司|财报|宏观|降息|股票/]
    ];
    return rules.find(([, pattern]) => pattern.test(value))?.[0] || (goalConfigs[fallback] ? fallback : "general");
  }

  function buildPlan(input = {}) {
    const requestedGoal = goalConfigs[input.goal] ? input.goal : "general";
    const experience = experienceLabels[input.experience] ? input.experience : "beginner";
    const time = timeRules[input.time] ? input.time : "30";
    const question = String(input.question || "").trim().slice(0, 120);
    const goal = question ? inferGoal(question, requestedGoal) : requestedGoal;
    const config = goalConfigs[goal];
    const track = config.tracks[experience];
    const rule = timeRules[time];
    const keys = track.steps.slice(0, rule.stepCount);
    const steps = keys.map((key) => {
      const item = config.resources[key];
      const minutes = time === "deep" ? item.deepMinutes : item.quickMinutes;
      return { ...item, key, minutes, time: `${minutes} MIN` };
    });
    const totalMinutes = steps.reduce((sum, step) => sum + step.minutes, 0);
    const timeSummary = time === "10"
      ? "只保留 1 个现在就能打开的页面。"
      : time === "30"
        ? "用 3 个页面完成理解、判断和下一步。"
        : `用 4 个页面补齐方法、工具和复盘，预计 ${totalMinutes} 分钟。`;
    const title = time === "10"
      ? `10 分钟只做一件事：${steps[0].title}`
      : time === "deep"
        ? `系统路线：${track.title}`
        : track.title;
    const queryText = question ? `你输入的是“${question}”。` : "";

    return {
      goal,
      experience,
      time,
      question,
      label: config.label,
      title,
      summary: `${queryText}${experienceLogic[experience].summary}${timeSummary}`,
      steps,
      totalMinutes,
      matchText: question ? "关键词已识别 · 3/3" : "已匹配 3/3 条件",
      reasonTags: [config.label, experienceLogic[experience].tag, time === "10" ? "单一入口" : time === "30" ? "三步闭环" : "四步系统路线"]
    };
  }

  return {
    buildPlan,
    inferGoal,
    goalConfigs,
    experienceLabels,
    timeRules,
    hasGoal: (goal) => Boolean(goalConfigs[goal])
  };
});
