const assert = require("node:assert/strict");
const Engine = require("../dist/path-engine.js");

const goals = ["us", "etf", "crypto", "hold", "ipo", "overseas", "sim", "general"];
const experiences = ["beginner", "familiar", "active"];
const expectedCounts = { "10": 1, "30": 3, deep: 4 };
const allowedHosts = new Set([
  "www.wise-invest.org",
  "chain.wise-invest.org",
  "crypto.wise-invest.org",
  "www.wise-etf.com",
  "www.wise-hold.com",
  "www.wise-ipo.com",
  "www.wise-witness.com",
  "www.wise-sim.org"
]);

for (const goal of goals) {
  const firstUrls = experiences.map((experience) => Engine.buildPlan({ goal, experience, time: "10" }).steps[0].url);
  assert.equal(new Set(firstUrls).size, 3, `${goal}: each experience must start at a different URL`);

  for (const experience of experiences) {
    for (const [time, count] of Object.entries(expectedCounts)) {
      const plan = Engine.buildPlan({ goal, experience, time });
      assert.equal(plan.steps.length, count, `${goal}/${experience}/${time}: wrong step count`);
      assert.equal(new Set(plan.steps.map((step) => step.url)).size, count, `${goal}/${experience}/${time}: duplicate URL`);
      assert.ok(plan.steps.every((step) => allowedHosts.has(new URL(step.url).hostname)), `${goal}/${experience}/${time}: unknown host`);
      assert.ok(plan.steps.every((step) => step.title && step.desc && step.site), `${goal}/${experience}/${time}: incomplete card`);
      if (time === "30") assert.ok(plan.totalMinutes <= 30, `${goal}/${experience}: 30-minute plan exceeds budget`);
      if (time === "deep") assert.ok(plan.totalMinutes > 30, `${goal}/${experience}: deep plan should be longer`);
    }
  }
}

assert.equal(Engine.inferGoal("我想买一张海外手机卡收验证码", "us"), "sim");
assert.equal(Engine.inferGoal("今天 ETF 溢价高不高", "us"), "etf");
assert.equal(Engine.inferGoal("我想看机构 13F 持仓", "us"), "hold");
assert.equal(Engine.buildPlan({ goal: "us", experience: "active", time: "10" }).steps[0].url, "https://chain.wise-invest.org/signals");
assert.equal(Engine.buildPlan({ goal: "us", experience: "beginner", time: "10" }).steps[0].url, "https://www.wise-invest.org/start");

console.log(`path-engine: ${goals.length * experiences.length * Object.keys(expectedCounts).length} combinations passed`);
