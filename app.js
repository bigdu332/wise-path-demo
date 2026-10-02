const Engine = window.WisePathEngine;

if (!Engine) throw new Error("WisePathEngine failed to load.");

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

const state = { goal: "us", focus: "default", experience: "beginner", time: "30", question: "" };
let currentPlan = null;

const pathList = document.querySelector("#path-list");
const titleEl = document.querySelector("#result-title");
const kickerEl = document.querySelector("#result-kicker");
const summaryEl = document.querySelector("#result-summary");
const fitEl = document.querySelector("#result-fit");
const questionEl = document.querySelector("#question");
const stepCountEl = document.querySelector("#step-count");
const routeReasonEl = document.querySelector("#route-reason");
const focusOptionsEl = document.querySelector("#focus-options");
const resultNoteEl = document.querySelector("#result-note");

function setSegment(control, value) {
  document.querySelectorAll(`[data-control="${control}"] button`).forEach((button) => {
    button.classList.toggle("active", button.dataset.value === value);
    button.setAttribute("aria-pressed", String(button.dataset.value === value));
  });
}

function renderPath() {
  currentPlan = Engine.buildPlan(state);
  state.goal = currentPlan.goal;
  state.focus = currentPlan.focus;

  kickerEl.textContent = `${currentPlan.label} · ${Engine.experienceLabels[currentPlan.experience]} · ${Engine.timeRules[currentPlan.time].label}`;
  titleEl.textContent = currentPlan.title;
  summaryEl.textContent = currentPlan.summary;
  fitEl.textContent = currentPlan.matchText;
  stepCountEl.textContent = String(currentPlan.steps.length);
  routeReasonEl.innerHTML = currentPlan.reasonTags.map((tag) => `<span>${tag}</span>`).join("");
  resultNoteEl.textContent = currentPlan.note;
  focusOptionsEl.innerHTML = Engine.goalConfigs[currentPlan.goal].options.map(option => `
    <button type="button" class="focus-option ${option.id === currentPlan.focus ? "active" : ""}"
      data-focus="${option.id}" aria-pressed="${option.id === currentPlan.focus}">${option.label}</button>
  `).join("");

  pathList.innerHTML = currentPlan.steps.map((step, index) => `
    <article class="path-card">
      <span class="step-index">0${index + 1}</span>
      <div class="path-card-main">
        <div class="path-meta">
          <span class="site-pill">${step.site}</span>
          <span>${step.type}</span><span>·</span><span>${step.time}</span>
          ${step.access ? `<span class="auth-pill">${step.access}</span>` : ""}
        </div>
        <h4>${step.title}</h4>
        <p>${step.desc}</p>
      </div>
      <a class="path-open" href="${step.url}" target="_blank" rel="noreferrer" aria-label="打开 ${step.title}">↗</a>
    </article>
  `).join("");

  document.querySelectorAll(".goal-option").forEach((button) => {
    const visualGoal = currentPlan.goal === "sim" ? "overseas" : currentPlan.goal;
    button.classList.toggle("active", button.dataset.goal === visualGoal);
    button.setAttribute("aria-pressed", String(button.dataset.goal === visualGoal));
  });

  return currentPlan;
}

document.querySelectorAll(".goal-option").forEach((button) => {
  button.addEventListener("click", () => {
    state.goal = button.dataset.goal;
    state.focus = "default";
    state.question = "";
    questionEl.value = "";
    renderPath();
  });
});

focusOptionsEl.addEventListener("click", event => {
  const button = event.target.closest("button[data-focus]");
  if (!button) return;
  state.focus = button.dataset.focus;
  if (state.goal === "overseas" && state.focus === "sim") {
    state.goal = "sim";
    state.focus = "default";
  }
  state.question = "";
  questionEl.value = "";
  renderPath();
});

document.querySelectorAll(".segmented").forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const control = group.dataset.control;
    state[control] = button.dataset.value;
    setSegment(control, button.dataset.value);
    renderPath();
  });
});

document.querySelector("#path-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state.question = questionEl.value;
  renderPath();
});

document.querySelector("#copy-path").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const plan = currentPlan || renderPath();
  const text = [
    `Wise Path｜${plan.title}`,
    `目标：${plan.label} / ${plan.focusLabel}｜经验：${Engine.experienceLabels[plan.experience]}｜时间：${Engine.timeRules[plan.time].label}｜预计阅读：${plan.totalMinutes} 分钟`,
    plan.question ? `问题：${plan.question}` : "",
    ...plan.steps.map((step, index) => `${index + 1}. ${step.title}（${step.site} · ${step.time}${step.access ? ` · ${step.access}` : ""}）\n${step.desc}\n${step.url}`),
    plan.note
  ].filter(Boolean).join("\n");

  try {
    await navigator.clipboard.writeText(text);
    const toast = document.querySelector("#toast");
    const previous = button.textContent;
    button.textContent = "已复制";
    toast.classList.add("show");
    window.setTimeout(() => {
      toast.classList.remove("show");
      button.textContent = previous;
    }, 1700);
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
    description: "根据目标、具体任务、经验和阅读时间更新 Wise 路径。各时间预算有独立路线，不为凑数增加页面；question 中识别到的任务优先于 goal 和 focus。",
    inputSchema: {
      type: "object",
      properties: {
        goal: { type: "string", enum: ["us", "etf", "crypto", "hold", "ipo", "overseas", "sim", "general"] },
        experience: { type: "string", enum: ["beginner", "familiar", "active"] },
        time: { type: "string", enum: ["10", "30", "deep"] },
        question: { type: "string", maxLength: 120 },
        focus: { type: "string", description: "可选具体任务：us 为 default/industry/macro/company；etf 为 default/limits/premium/dca；crypto 为 default/dca/futures/exchange；hold 为 default/people/strategy；ipo 为 default/hk/us/cn；overseas 为 default/broker/witness/sim；sim 为 default/use/esim/orders。" }
      },
      required: ["goal", "experience", "time"],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!Engine.hasGoal(input.goal) || !Engine.experienceLabels[input.experience] || !Engine.timeRules[input.time]) {
        throw new Error("Unsupported goal, experience, or time value.");
      }
      state.goal = input.goal;
      state.focus = typeof input.focus === "string" ? input.focus : "default";
      state.experience = input.experience;
      state.time = input.time;
      state.question = typeof input.question === "string" ? input.question.slice(0, 120) : "";
      questionEl.value = state.question;
      setSegment("experience", state.experience);
      setSegment("time", state.time);
      return renderPath();
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

renderPath();
setSegment("experience", state.experience);
setSegment("time", state.time);
registerWebMCP();
