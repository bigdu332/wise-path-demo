const destinations = [
  { id: "invest", mark: "WI", name: "Wise Invest", role: "主站与统一入口", desc: "投资学习路线、内容、工具、福利与 Wise ID。", url: "https://www.wise-invest.org/" },
  { id: "chain", mark: "CH", name: "CHAIN", role: "美股与产业研究", desc: "从宏观、产业、公司与事件理解美股。", url: "https://chain.wise-invest.org/" },
  { id: "etf", mark: "ET", name: "Wise ETF", role: "ETF / QDII 数据", desc: "比较场内外路径、溢价、费率与市场温度。", url: "https://www.wise-etf.com/" },
  { id: "crypto", mark: "CR", name: "Wise Crypto", role: "加密市场工作台", desc: "行情观察、风险工具、合约学习与开户路径。", url: "https://crypto.wise-invest.org/" },
  { id: "hold", mark: "HD", name: "Wise Hold", role: "聪明资金追踪", desc: "机构 13F、公开人物持仓与公司线索。", url: "https://www.wise-hold.com/" },
  { id: "ipo", mark: "IP", name: "Wise IPO", role: "新股机会", desc: "美股、港股与 A 股新股信息和分析。", url: "https://www.wise-ipo.com/" },
  { id: "witness", mark: "WT", name: "Wise Witness", role: "境外银行开户", desc: "见证服务比较、银行选择与办理流程。", url: "https://www.wise-witness.com/" },
  { id: "sim", mark: "SM", name: "Wise SIM", role: "海外通信", desc: "海外手机卡选购、教程与售后入口。", url: "https://www.wise-sim.org/" }
];

const pathData = {
  us: {
    label: "美股学习",
    title: "先建立框架，再追一条产业链",
    fit: 94,
    steps: [
      { site: "WISE INVEST", type: "建立框架", title: "用学习路线确认起点", desc: "先理解资产、账户、风险与长期投资的基本关系。", time: "8 MIN", url: "https://www.wise-invest.org/roadmap" },
      { site: "CHAIN", type: "形成方法", title: "从市场学习进入宏观与产业", desc: "把消息拆成政策、行业、公司与财报四层。", time: "12 MIN", url: "https://chain.wise-invest.org/learn" },
      { site: "CHAIN", type: "开始研究", title: "沿产业地图找到真实关系", desc: "从产品与环节出发，再核对公司、客户和经营结果。", time: "10 MIN", url: "https://chain.wise-invest.org/chain" }
    ]
  },
  etf: {
    label: "ETF / QDII",
    title: "先确认路径，再比较价格与执行",
    fit: 96,
    steps: [
      { site: "WISE INVEST", type: "建立框架", title: "确定指数投资的目标与节奏", desc: "先把长期目标、风险和投入频率说清楚。", time: "7 MIN", url: "https://www.wise-invest.org/roadmap" },
      { site: "WISE ETF", type: "比较路径", title: "同屏看场内、场外与溢价", desc: "把额度、溢价、费率、跟踪误差放在同一决策里。", time: "14 MIN", url: "https://www.wise-etf.com/" },
      { site: "WISE INVEST", type: "开始执行", title: "用 DCA 页面建立复盘节奏", desc: "观察长期投入过程，避免把单次价格当成全部决策。", time: "9 MIN", url: "https://www.wise-invest.org/practice" }
    ]
  },
  crypto: {
    label: "加密市场",
    title: "先认识风险，再观察行情和工具",
    fit: 97,
    steps: [
      { site: "WISE CRYPTO", type: "理解规则", title: "从加密学习区建立风险意识", desc: "先理解现货、合约、杠杆与强平机制。", time: "10 MIN", url: "https://crypto.wise-invest.org/learn" },
      { site: "WISE CRYPTO", type: "观察行情", title: "看 BTC / ETH 的位置和趋势", desc: "结合价格、均线与关键位置形成可解释判断。", time: "10 MIN", url: "https://crypto.wise-invest.org/btc" },
      { site: "WISE CRYPTO", type: "量化风险", title: "用计算工具明确仓位边界", desc: "在行动前算清仓位、杠杆、盈亏比与定投计划。", time: "10 MIN", url: "https://crypto.wise-invest.org/tools" }
    ]
  },
  hold: {
    label: "聪明资金",
    title: "把持仓线索变成可验证的研究问题",
    fit: 91,
    steps: [
      { site: "WISE INVEST", type: "建立原则", title: "先理解价值投资与能力圈", desc: "用经典文集建立看公司而非抄作业的基本原则。", time: "9 MIN", url: "https://www.wise-invest.org/roadmap" },
      { site: "WISE HOLD", type: "发现线索", title: "追踪机构与公开人物持仓", desc: "从 13F 与公开披露里找变化、共识和分歧。", time: "12 MIN", url: "https://www.wise-hold.com/" },
      { site: "WISE INVEST", type: "补充判断", title: "回到内容库核对投资逻辑", desc: "把持仓变化与公司、估值和长期逻辑放在一起。", time: "9 MIN", url: "https://www.wise-invest.org/tweets" }
    ]
  },
  ipo: {
    label: "新股机会",
    title: "先看规则，再筛选值得跟踪的新股",
    fit: 92,
    steps: [
      { site: "WISE INVEST", type: "明确边界", title: "建立风险与账户准备清单", desc: "先确认市场规则、账户条件和可承受风险。", time: "8 MIN", url: "https://www.wise-invest.org/roadmap" },
      { site: "WISE IPO", type: "机会筛选", title: "聚合查看不同市场的新股", desc: "把美股、港股与 A 股机会放进统一观察清单。", time: "13 MIN", url: "https://www.wise-ipo.com/" },
      { site: "WISE INVEST", type: "持续跟踪", title: "回到内容流补充市场背景", desc: "用最新内容核对热度、行业位置与关键风险。", time: "9 MIN", url: "https://www.wise-invest.org/tweets" }
    ]
  },
  overseas: {
    label: "境外开户",
    title: "从需求判断开始，减少跨境办理试错",
    fit: 93,
    steps: [
      { site: "WISE INVEST", type: "需求分流", title: "先确认账户用途与资金路径", desc: "从开户、收款、入金和日常使用场景确定需求。", time: "7 MIN", url: "https://www.wise-invest.org/roadmap" },
      { site: "WISE WITNESS", type: "服务比较", title: "比较银行、条件与办理流程", desc: "集中查看见证服务、适合人群和关键步骤。", time: "14 MIN", url: "https://www.wise-witness.com/" },
      { site: "WISE INVEST", type: "准备行动", title: "回到福利页整理申请入口", desc: "在行动前复核材料、成本与可用入口。", time: "9 MIN", url: "https://www.wise-invest.org/perk" }
    ]
  },
  sim: {
    label: "海外通信",
    title: "先看使用场景，再选择长期可用号码",
    fit: 95,
    steps: [
      { site: "WISE INVEST", type: "找到入口", title: "从 Wise 网站地图进入服务站", desc: "了解 Wise 系列站点分工和相关使用场景。", time: "5 MIN", url: "https://www.wise-invest.org/website" },
      { site: "WISE SIM", type: "产品选择", title: "比较海外手机卡与套餐", desc: "按收码、保号、出行与长期使用场景选择。", time: "15 MIN", url: "https://www.wise-sim.org/" },
      { site: "WISE SIM", type: "完成设置", title: "按教程完成激活与使用", desc: "把购买、激活、充值和常见问题一次走完。", time: "10 MIN", url: "https://www.wise-sim.org/" }
    ]
  },
  general: {
    label: "完整入门",
    title: "从全局地图进入你的第一个行动",
    fit: 88,
    steps: [
      { site: "WISE INVEST", type: "选择路线", title: "从投资学习路线开始", desc: "按资产、账户、工具与风险建立整体框架。", time: "10 MIN", url: "https://www.wise-invest.org/roadmap" },
      { site: "WISE INVEST", type: "建立判断", title: "读一组精选内容", desc: "用真实市场问题理解方法如何落到判断。", time: "12 MIN", url: "https://www.wise-invest.org/tweets" },
      { site: "WISE INVEST", type: "开始实践", title: "选择一个长期跟踪对象", desc: "从 DCA 或工具页建立自己的记录和复盘节奏。", time: "8 MIN", url: "https://www.wise-invest.org/practice" }
    ]
  }
};

const state = { goal: "us", experience: "beginner", time: "30", question: "" };
const experienceLabels = { beginner: "第一次接触", familiar: "有些基础", active: "正在实操" };
const timeLabels = { "10": "10 分钟", "30": "30 分钟", deep: "系统学习" };

const pathList = document.querySelector("#path-list");
const titleEl = document.querySelector("#result-title");
const kickerEl = document.querySelector("#result-kicker");
const summaryEl = document.querySelector("#result-summary");
const fitEl = document.querySelector("#result-fit");
const questionEl = document.querySelector("#question");

function inferGoal(text, fallback = state.goal) {
  const value = text.trim().toLowerCase();
  if (!value) return fallback;
  const rules = [
    ["sim", /手机卡|电话卡|流量|保号|收码|giffgaff|esim|sim/],
    ["crypto", /加密|比特币|btc|eth|以太坊|合约|交易所|币安|okx/],
    ["etf", /etf|qdii|纳指|标普|指数|溢价|定投/],
    ["hold", /持仓|13f|机构|巴菲特|名人|聪明资金/],
    ["ipo", /ipo|新股|打新|上市/],
    ["overseas", /银行|开户|见证|跨境|入金|境外账户/],
    ["us", /美股|ai|人工智能|产业链|公司|财报|宏观|降息|股票/]
  ];
  return rules.find(([, pattern]) => pattern.test(value))?.[0] || fallback || "general";
}

function adjustedSteps(route) {
  const steps = route.steps.map(step => ({ ...step }));
  if (state.time === "10") {
    return steps.map((step, index) => ({
      ...step,
      time: `${index === 0 ? 4 : 3} MIN`,
      desc: index === 0 ? step.desc : `快速浏览：${step.desc}`
    }));
  }
  if (state.time === "deep") {
    return steps.map((step, index) => ({
      ...step,
      time: `${[25, 45, 30][index]} MIN`,
      desc: `${step.desc} 建议记录一个问题和一个下一步。`
    }));
  }
  return steps;
}

function summaryFor(route) {
  const lead = {
    beginner: "你是第一次接触，路径会先补齐概念和风险边界。",
    familiar: "你已有基础，路径会减少概念浏览，把更多时间放在比较与验证。",
    active: "你正在实操，路径会直接进入工具、数据与复盘环节。"
  }[state.experience];
  const query = state.question ? `你输入的是“${state.question.trim()}”。` : "";
  return `${query}${lead} 预计用 ${timeLabels[state.time]} 完成这条 ${route.label} 路径。`;
}

function renderPath(goal = state.goal) {
  state.goal = pathData[goal] ? goal : "general";
  const route = pathData[state.goal];
  const steps = adjustedSteps(route);
  kickerEl.textContent = `${route.label} · ${timeLabels[state.time]}`;
  titleEl.textContent = route.title;
  summaryEl.textContent = summaryFor(route);
  fitEl.textContent = `匹配度 ${route.fit}%`;
  pathList.innerHTML = steps.map((step, index) => `
    <article class="path-card">
      <span class="step-index">0${index + 1}</span>
      <div class="path-card-main">
        <div class="path-meta"><span class="site-pill">${step.site}</span><span>${step.type}</span><span>·</span><span>${step.time}</span></div>
        <h4>${step.title}</h4>
        <p>${step.desc}</p>
      </div>
      <a class="path-open" href="${step.url}" target="_blank" rel="noreferrer" aria-label="打开 ${step.title}">↗</a>
    </article>
  `).join("");
  document.querySelectorAll(".goal-option").forEach(button => {
    const visualGoal = state.goal === "sim" ? "overseas" : state.goal;
    button.classList.toggle("active", button.dataset.goal === visualGoal);
  });
  return { goal: state.goal, title: route.title, steps: steps.map(({ title, site, url }) => ({ title, site, url })) };
}

function setSegment(control, value) {
  document.querySelectorAll(`[data-control="${control}"] button`).forEach(button => {
    button.classList.toggle("active", button.dataset.value === value);
  });
}

document.querySelectorAll(".goal-option").forEach(button => {
  button.addEventListener("click", () => {
    state.goal = button.dataset.goal;
    state.question = "";
    questionEl.value = "";
    renderPath();
  });
});

document.querySelectorAll(".segmented").forEach(group => {
  group.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const control = group.dataset.control;
    state[control] = button.dataset.value;
    setSegment(control, button.dataset.value);
    renderPath();
  });
});

document.querySelector("#path-form").addEventListener("submit", event => {
  event.preventDefault();
  state.question = questionEl.value;
  renderPath(inferGoal(state.question, state.goal));
});

document.querySelector("#copy-path").addEventListener("click", async () => {
  const route = pathData[state.goal];
  const text = [
    `Wise Path｜${route.title}`,
    ...adjustedSteps(route).map((step, index) => `${index + 1}. ${step.title}（${step.url}）`)
  ].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    const toast = document.querySelector("#toast");
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1700);
  } catch {
    window.prompt("复制下面的路径摘要", text);
  }
});

document.querySelector("#site-map").innerHTML = destinations.map((site, index) => `
  <article class="site-card">
    <div class="site-card-top"><span class="site-monogram">${site.mark}</span><span>0${index + 1}</span></div>
    <h3>${site.name}</h3>
    <p><strong>${site.role}</strong><br />${site.desc}</p>
    <a href="${site.url}" target="_blank" rel="noreferrer">访问原站 ↗</a>
  </article>
`).join("");

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const register = (tool) => Promise.resolve(context.registerTool(tool)).catch(() => {});

  register({
    name: "generate_wise_learning_path",
    title: "生成 Wise 学习路径",
    description: "根据目标、经验和可用时间更新页面中的三步 Wise 跨站学习路径。",
    inputSchema: {
      type: "object",
      properties: {
        goal: { type: "string", enum: ["us", "etf", "crypto", "hold", "ipo", "overseas", "sim", "general"] },
        experience: { type: "string", enum: ["beginner", "familiar", "active"] },
        time: { type: "string", enum: ["10", "30", "deep"] },
        question: { type: "string", maxLength: 120 }
      },
      required: ["goal", "experience", "time"],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!pathData[input.goal] || !experienceLabels[input.experience] || !timeLabels[input.time]) {
        throw new Error("Unsupported goal, experience, or time value.");
      }
      state.goal = input.goal;
      state.experience = input.experience;
      state.time = input.time;
      state.question = typeof input.question === "string" ? input.question.slice(0, 120) : "";
      questionEl.value = state.question;
      setSegment("experience", state.experience);
      setSegment("time", state.time);
      return renderPath(state.question ? inferGoal(state.question, state.goal) : state.goal);
    }
  });

  register({
    name: "list_wise_destinations",
    title: "列出 Wise 站点",
    description: "返回这个概念 Demo 所整理的公开 Wise 站点及其定位。",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      return destinations.map(({ name, role, url }) => ({ name, role, url }));
    }
  });
}

renderPath("us");
registerWebMCP();
