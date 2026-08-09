# 前端面试题库 · FE Interview Bank

一个基于 **Vue 3 + Vite + Pinia + Vue Router** 的前端技术总结与面试题库项目，收录覆盖全面的前端面试题与**详尽答案解析**，支持分类浏览、全文搜索、难度筛选、收藏、深色模式，以及**代码块高亮 + 一键复制 / 在线运行**。

> 📊 当前共 **14 个分类 · 426 道题** + 模拟考试 **89 道选择题**，持续扩充中。

---

## ✨ 功能特性

### 核心功能
- 🗂️ **分类导航**：HTML / CSS / JavaScript / TypeScript / Vue / React / 浏览器原理 / 计算机网络 / 性能优化 / 工程化 / 数据结构与算法 / 手写代码 / AI 编程 / GIS 地理信息，共 14 个方向。
- 🔍 **全文搜索**：对题目、标签、答案内容做关键词检索。
- 🎯 **难度筛选**：简单 / 中等 / 困难三级过滤。
- ⭐ **收藏夹**：本地持久化（localStorage），随时回顾重点题目。
- 🌙 **深色模式**：跟随系统或手动切换，主题 CSS 变量一键换肤。
- 📱 **响应式布局**：桌面与移动端均适配。
- 🔗 **上下题导航 + 关联推荐**，便于连贯学习。
- 📝 **Markdown 富文本渲染**：答案支持代码块、表格、引用、列表等。
- 📝 **模拟考试**：从选择题题库随机抽取 30 题，交卷即时出分，附错题解析与正确答案对照。

### 代码区增强（✨ v2）
答案中所有代码块自带工具栏，支持：
- 🎨 **语法高亮**：基于 highlight.js，主流语言均支持。
- 📋 **一键复制**：自动提示复制成功/失败。
- ▶️ **在线运行**：
  - **JavaScript / TypeScript**：在沙盒中执行，自动补齐未写 `console.log` 的表达式结果，支持 `async`。
  - **HTML / CSS**：在 iframe 中独立预览，不受父页面样式污染。
  - **JSON**：格式化展示。
- 🔖 **语言标签**：代码块左上显示语言类型。

---

## 🗂️ 题库覆盖（426 题）

| 分类 | 数量 | 核心主题 |
| --- | ---: | --- |
| 🟧 HTML | 44 | DOM、语义化、SEO、meta、表单、ARIA、响应式图片、Web Components |
| 🎨 CSS | 36 | 盒模型、BFC、Flex/Grid、动画、响应式、CSS 变量、伪类/伪元素、清除浮动、隐藏元素、逻辑属性、@layer、@property、clip-path/mask |
| 🟨 JavaScript | 58 | 数据类型、闭包、原型链、this、事件循环、Promise、ES6+、模块化、防抖节流、FP、GC、正则 |
| 🔷 TypeScript | 26 | 类型系统、接口、泛型、类型守卫、条件类型、infer、工具类型、映射类型、模板字面量类型 |
| 🟢 Vue 3 | 66 | 响应式原理、组合式 API、Pinia、Router、编译优化、Composables、编译器、SSR、diff、调度器 |
| 🟦 React | 58 | Hooks、Fiber、状态管理、性能优化、React 18/19、并发渲染、Suspense、Server Components |
| 🧭 浏览器原理 | 16 | 渲染流水线、事件循环、存储、同源策略、跨域 |
| 🌐 计算机网络 | 16 | HTTP/HTTPS、缓存、TCP、CORS、状态码、HTTP/2/3 |
| ⚡ 性能优化 | 15 | Core Web Vitals、懒加载、防抖节流、构建优化、监控 |
| 🏗️ 工程化 | 15 | 模块系统、Webpack/Vite、CI/CD、Monorepo、代码规范 |
| 🧮 数据结构与算法 | 15 | 排序、二分、栈队列、链表、二叉树、动态规划、贪心 |
| ✍️ 手写代码 | 16 | 防抖节流、深拷贝、Promise、call/apply/bind、发布订阅 |
| 🤖 AI 编程 | 24 | AI 辅助编程、Agent、RAG、提示工程、MCP 协议、Vibe Coding |
| 🗺️ GIS 地理信息 | 21 | GeoJSON、坐标系纠偏、瓦片、Turf.js、OpenLayers、Mapbox/MapLibre、Leaflet、Cesium、Three.js、Deck.gl（分类页按框架分组） |

### 📝 模拟考试题库（89 道选择题）

独立的单选题库（结构与 Q&A 不同：`question / options / answer / analysis`），覆盖 10 个分类，一次考试随机抽取 30 题：

| 分类 | 数量 | 分类 | 数量 |
| --- | ---: | --- | ---: |
| JavaScript | 15 | 浏览器原理 | 6 |
| CSS | 13 | 计算机网络 | 6 |
| Vue | 11 | 性能优化 | 6 |
| HTML | 9 | 工程化 | 5 |
| React | 9 | | |
| TypeScript | 9 | | |

---

## 🛠️ 技术栈

| 技术 | 用途 |
| --- | --- |
| Vue 3（`<script setup>` + Composition API） | UI 框架 |
| Vite 5 | 构建工具 / 开发服务器 |
| Pinia | 状态管理（题目、搜索、收藏） |
| Vue Router 4 | 路由 |
| Marked + highlight.js | Markdown 渲染 + 代码块语法高亮 |

---

## 🚀 快速开始

> ⚠️ Windows 若遇到「禁止运行脚本」（PowerShell 执行策略），先执行：
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本到 dist/
npm run build

# 本地预览构建产物
npm run preview
```

启动后浏览器访问 **http://localhost:5173/** 即可使用。

---

## 📁 项目结构

```
.
├── public/                     # 静态资源（favicon 等）
├── scripts/                    # ⚙️ 工具脚本目录
│   ├── tests/                  #   调试与临时代码片段（git 忽略）
│   ├── drafts/                 #   题目草稿 txt（git 忽略）
│   ├── legacy/                 #   历史追加脚本（git 忽略）
│   ├── validate-data.mjs       #   🧪 题库数据校验（必跑）
│   ├── insert-vue.cjs          #   Vue 题目批量插入辅助
│   ├── insert-react.cjs        #   React 题目批量插入辅助
│   ├── ts-helper.mjs           #   TS 题目插入辅助
│   ├── gen-ts-questions.mjs    #   TS 题目生成
│   └── append-ts-questions.mjs #   TS 题目追加
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 根组件（Header + Sidebar + RouterView）
│   ├── router/index.js         # 路由配置（首页 / 分类 / 题目 / 收藏 / 考试 / 关于）
│   ├── stores/
│   │   ├── questions.js       # Pinia store：题目 / 搜索 / 收藏
│   │   └── exam.js            # 考试状态管理（idle / taking / result 三态）
│   ├── composables/useTheme.js # 主题（深色模式）
│   ├── utils/markdown.js       # Markdown + 代码块（高亮/复制/运行）封装
│   ├── assets/styles/
│   │   ├── main.css            # 全局样式
│   │   └── variables.css       # CSS 变量（亮 / 暗主题）
│   ├── components/
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── SearchBar.vue
│   │   ├── QuestionCard.vue
│   │   ├── MarkdownContent.vue # Markdown 渲染 + 复制/运行按钮
│   │   ├── DifficultyBadge.vue
│   │   └── TagBadge.vue
│   ├── views/
│   │   ├── HomeView.vue        # 首页：概览 + 全部题目
│   │   ├── CategoryView.vue    # 分类列表
│   │   ├── QuestionView.vue    # 题目详情 + 答案解析
│   │   ├── FavoritesView.vue   # 收藏夹
│   │   ├── ExamView.vue        # 模拟考试（开始页 / 答题页 / 结果页）
│   │   └── AboutView.vue       # 关于
│   └── data/                   # 📚 题库数据（可持续扩充）
│       ├── categories.js       # 分类元信息（id/名称/图标/简介）
│       ├── html.js · css.js · javascript.js
│       ├── typescript.js · vue.js · react.js
│       ├── browser.js · network.js · performance.js
│       ├── engineering.js · algorithm.js · handwriting.js
│       ├── aicode.js           # AI 编程分类
│       ├── exam.js             # 模拟考试选择题题库（独立结构，89 题）
│       └── gis.js              # GIS 地理信息分类
├── index.html
├── vite.config.js
├── jsconfig.json
├── package.json
└── README.md
```

---

## ➕ 如何添加新题目

### 1. 追加到已有分类
在 `src/data/` 下对应分类文件中，按统一结构追加对象：

```js
export const xxxQuestions = [
  {
    id: 'xxx-001',           // 唯一 ID，建议「分类缩写-序号」
    category: 'xxx',         // 与 categories.js 中 id 一致
    title: '题目标题',
    difficulty: '中等',      // 简单 | 中等 | 困难
    tags: ['标签1', '标签2'],
    answer: `## 标题
支持 **Markdown**：

\`\`\`javascript
// 代码块自带复制 & 运行
console.log('Hello')
\`\`\``
  }
  // ...
]
```

### 2. 新增一个分类
1. 在 `src/data/` 下新建 `yourCategory.js`，导出 `yourCategoryQuestions` 数组。
2. 在 [src/data/categories.js](file:///d:/code/fe-interview-bank/src/data/categories.js) 中追加分类元信息：
   ```js
   { id: 'yourcategory', name: '分类名', icon: '🔖', desc: '分类简介' }
   ```
3. 在 [src/stores/questions.js](file:///d:/code/fe-interview-bank/src/stores/questions.js) 中导入并合并：
   ```js
   import { yourCategoryQuestions } from '@/data/yourCategory'
   const allQuestions = [ ..., ...yourCategoryQuestions ]
   ```

### 3. 提交前必跑校验
```bash
node scripts/validate-data.mjs
```
校验内容：14 个数据文件能否被正确 `import`、每题的 `id/title/answer` 类型是否正确、Markdown 代码围栏是否闭合；**全部通过后再构建**。

---

## 📝 说明

- 题库内容为内置数据，**纯前端项目**，无后端依赖。
- 收藏 / 主题偏好保存在浏览器 `localStorage`，清理浏览器数据会丢失。
- 代码「在线运行」功能为浏览器内沙盒执行，JS 支持 `async/await`，HTML/CSS 在同源 iframe 预览，保证隔离性。
- 内容仅供学习交流使用，欢迎补充与指正。

## License

MIT
