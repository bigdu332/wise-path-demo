const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
// Authoring uses dist/; GitHub Pages serves the same files at the root.
const rootEngine = path.join(__dirname, "../path-engine.js");
const Engine = require(fs.existsSync(rootEngine) ? rootEngine : "../dist/path-engine.js");
const experiences = ["beginner", "familiar", "active"];
const times = ["10", "30", "deep"];
const allowedHosts = new Set([
  "www.wise-invest.org", "chain.wise-invest.org", "crypto.wise-invest.org", "www.wise-etf.com",
  "www.wise-hold.com", "www.wise-ipo.com", "www.wise-witness.com", "www.wise-sim.org"
]);
let combinations = 0;
for (const [goal, config] of Object.entries(Engine.goalConfigs)) {
  for (const { id: focus } of config.options) {
    for (const experience of experiences) {
      for (const time of times) {
        const plan = Engine.buildPlan({ goal, focus, experience, time });
        const context = `${goal}/${focus}/${experience}/${time}`;
        assert.equal(plan.focus, focus, context);
        assert.ok(plan.steps.length > 0 && plan.steps.length <= 5, context);
        assert.equal(new Set(plan.steps.map(step => step.url)).size, plan.steps.length, `${context}: duplicate destination`);
        assert.ok(plan.steps.every(step => allowedHosts.has(new URL(step.url).hostname)), context);
        assert.ok(plan.steps.every(step => step.title && step.desc && step.site && step.minutes > 0), context);
        assert.equal(plan.totalMinutes, plan.steps.reduce((sum, step) => sum + step.minutes, 0), context);
        if (time === "10") assert.equal(plan.steps.length, 1, context);
        if (time !== "deep") assert.ok(plan.totalMinutes <= Number(time), `${context}: exceeds reading budget`);
        assert.deepEqual(Engine.buildPlan({ goal, focus, experience, time }), plan, `${context}: non-deterministic`);
        if (goal === "crypto" && ["default", "dca"].includes(focus)) {
          assert.ok(plan.steps.every(step => !["futures", "contract", "position", "exchanges", "cryptoGuides"].includes(step.key)), `${context}: unexpected derivatives/account path`);
        }
        if (goal === "overseas" && focus === "default") assert.ok(plan.steps.every(step => !step.url.startsWith("https://www.wise-witness.com")), context);
        if (goal === "sim" && focus !== "orders") assert.ok(plan.steps.every(step => step.key !== "orders"), context);
        if (goal === "ipo") {
          const marketPages = plan.steps.filter(step => step.url.includes("/markets/"));
          assert.ok(marketPages.every(step => step.url.endsWith(`/markets/${focus}`)), `${context}: wrong market`);
        }
        combinations++;
      }
    }
  }
}
const scenarios = [
  ["港股打新开户", "ipo", "hk"], ["美股 IPO 申购", "ipo", "us"], ["A 股新股怎么申购", "ipo", "cn"],
  ["美股开户", "overseas", "broker"], ["我想开美股账户", "overseas", "broker"], ["开个盈透账户", "overseas", "broker"], ["境外银行开户", "overseas", "default"],
  ["香港见证开户", "overseas", "witness"], ["不考虑见证，了解银行开户", "overseas", "default"],
  ["BTC 定投", "crypto", "dca"], ["不做合约，只想 BTC 定投", "crypto", "dca"],
  ["我想学合约", "crypto", "futures"], ["币安注册", "crypto", "exchange"],
  ["ETF 溢价是多少", "etf", "premium"], ["QDII 限购", "etf", "limits"], ["纳指定投计划", "etf", "dca"],
  ["没有证券账户，买 ETF", "etf", "limits"], ["机构 13F 持仓", "hold", "default"],
  ["巴菲特持仓", "hold", "people"], ["七巨头投资版图", "hold", "strategy"],
  ["我想学美股 AI 产业链", "us", "industry"], ["AI 公司的财报", "us", "company"],
  ["降息怎么影响美股", "us", "macro"], ["英伟达财报", "us", "company"],
  ["海外手机卡怎么选", "sim", "default"], ["手机卡收不到验证码", "sim", "use"],
  ["giffgaff 保号", "sim", "use"], ["giffgaff 订单物流", "sim", "orders"], ["Xesim 兼容吗", "sim", "esim"]
];
for (const [question, goal, focus] of scenarios) {
  const plan = Engine.buildPlan({ goal: "us", question });
  assert.equal(plan.goal, goal, question);
  assert.equal(plan.focus, focus, question);
}
const build = input => Engine.buildPlan({ experience: "beginner", time: "30", ...input });
assert.equal(build({ goal: "us", time: "10" }).steps[0].key, "basics");
assert.ok(build({ goal: "us", time: "30" }).steps.some(step => step.key === "risk"));
assert.equal(build({ goal: "us", question: "AI 产业链" }).steps.find(step => step.key === "ai").url, "https://chain.wise-invest.org/chain?industry=ai");
assert.equal(build({ goal: "sim", question: "giffgaff 保号", time: "10" }).steps[0].key, "giffgaff");
assert.ok(build({ goal: "etf", question: "没有证券账户，买 ETF", time: "deep" }).steps.every(step => step.key !== "premium"));
assert.equal(build({ goal: "sim", focus: "orders" }).steps[0].access, "需 Wise ID");
assert.ok(build({ goal: "us", time: "deep" }).steps.every(step => step.access === "可能需 Wise ID"));
for (const [question, sector] of [["存储产业链", "storage"], ["机器人产业链", "robotics"], ["航天产业链", "space"], ["核电产业链", "energy"]]) {
  const plan = build({ goal: "us", question, time: "deep" });
  for (const key of ["map", "company"]) assert.equal(new URL(plan.steps.find(step => step.key === key).url).searchParams.get("industry"), sector, question);
}
const unknown = build({ goal: "etf", focus: "premium", question: "随便问一下" });
assert.equal(unknown.focus, "premium");
assert.equal(unknown.matchText, "按所选条件生成");
assert.equal(Engine.hasGoal("constructor"), false);
assert.equal(build({ goal: "__proto__", experience: "constructor", time: "toString" }).goal, "general");
assert.equal(build({ goal: "ipo", focus: "not-a-market" }).focus, "default");
// The 30-minute beginner route includes risk context instead of truncating the deep curriculum.
const shortStocks = build({ goal: "us" }).steps.map(step => step.key);
const deepStocks = build({ goal: "us", time: "deep" }).steps.map(step => step.key);
assert.notDeepEqual(shortStocks, deepStocks.slice(0, shortStocks.length));
console.log(`path-engine: ${combinations} task/experience/time combinations and ${scenarios.length} intent scenarios passed`);
