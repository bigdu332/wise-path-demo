# Wise Path Demo

面向 Wise 网站开发兼职岗位制作的跨站学习导航概念原型。

## 在线 Demo

https://bigdu332.github.io/wise-path-demo/

## 核心假设

Wise 的单站内容和功能已经较完整；增加一层按用户目标、经验与时间生成路径的统一入口，可以降低首次访问者理解站点结构的成本，并提升跨站内容流转。

路由不是只替换文案：

- 目标决定主题站点。
- 经验决定入口层级与页面序列。
- 时间决定路径长度：10 分钟 1 步、30 分钟 3 步、系统学习 4 步。
- 目前覆盖 8 个目标、3 个经验层级与 3 种时间预算，共 72 种组合。

## 本地预览

```bash
python3 -m http.server 4173 --directory dist
```

打开 `http://localhost:4173`。

## 规则测试

```bash
node tests/path-engine.test.js
```
