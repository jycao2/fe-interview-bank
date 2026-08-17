# 前端面试题库 · FE Interview Bank

一个基于 **Vue 3 + Vite + Pinia + Vue Router** 的前端技术总结与面试题库项目，收录覆盖全面的前端面试题与**详尽答案解析**，支持分类浏览、全文搜索、难度筛选、收藏、深色模式，**代码块高亮 + 一键复制 / 在线运行**，以及 **LeetCode 风格算法实战 · 在线判题**。

> 📊 当前共 **15 个分类 · 514 道题** + 模拟考试 **138 道选择题** + **算法实战 45 道手写题**，持续扩充中。

---

## ✨ 功能特性

### 核心功能
- 🗂️ **分类导航**：HTML / CSS / JavaScript / TypeScript / Vue / React / 浏览器原理 / 计算机网络 / 性能优化 / 工程化 / 数据结构与算法 / 手写代码 / AI 编程 / GIS 地理信息 / **移动端 H5 · 小程序 · uni-app**，共 15 个方向。
- 🔍 **全文搜索**：对题目、标签、答案内容做关键词检索。
- 🎯 **难度筛选**：简单 / 中等 / 困难三级过滤。
- ⭐ **收藏夹**：本地持久化（localStorage），随时回顾重点题目。
- 🌙 **深色模式**：跟随系统或手动切换，主题 CSS 变量一键换肤。
- 📱 **响应式布局**：桌面与移动端均适配。
- 🔗 **上下题导航 + 关联推荐**，便于连贯学习。
- 📝 **Markdown 富文本渲染**：答案支持代码块、表格、引用、列表等。
- 📝 **模拟考试（进阶）**：从 138 道选择题题库**按分类权重 + 难度比例**抽取 30 题，支持「简单/均衡/困难」三档模式、可选指定分类，交卷即时出分，附**分类 + 难度分布统计**、错题解析与正确答案对照。
- 💻 **算法实战 · 在线判题（新增）**：45 道 LeetCode 风格手写算法题（数组 / 字符串 / 链表 / 树 / DP / 回溯等），浏览器内 **Web Worker 沙箱**执行用户代码，**5 秒超时保护**，自动比对测试用例并通过/失败判定，支持题解查看、复杂度提示、答题进度统计。

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

## 🗂️ 题库覆盖（514 题）

| 分类 | 数量 | 核心主题 |
| --- | ---: | --- |
| 🟧 HTML | 50 | DOM、语义化、SEO、meta、表单、ARIA、响应式图片、Web Components、CSP/SRI、fetchpriority |
| 🎨 CSS | 44 | 盒模型、BFC、Flex/Grid、动画、响应式、CSS 变量、伪类/伪元素、清除浮动、隐藏元素、逻辑属性、@layer、@property、:has/@scope/@container、滚动捕捉、堆叠上下文、遮罩混合模式 |
| 🟨 JavaScript | 68 | 数据类型、闭包、原型链、this、事件循环、Promise、ES6+、模块化、防抖节流、FP、GC、正则、ES2021+、BigInt、Intl、迭代器生成器、Proxy/Reflect、结构化克隆、事件委托 |
| 🔷 TypeScript | 26 | 类型系统、接口、泛型、类型守卫、条件类型、infer、工具类型、映射类型、模板字面量类型 |
| 🟢 Vue 3 | 74 | 响应式原理、组合式 API、Pinia、Router、编译优化、Composables、编译器、SSR、diff、调度器、defineModel、自定义渲染器、自定义指令、VueUse、SFC 编译 |
| 🟦 React | 66 | Hooks、Fiber、状态管理、性能优化、React 18/19、并发渲染、Suspense、Server Components、useTransition、React Compiler、Custom Hook 模式、Zustand/Jotai |
| 🧭 浏览器原理 | 23 | 渲染流水线、事件循环、存储、同源策略、跨域、WebAssembly、Service Worker、Cookie SameSite、XSS/CSRF 进阶、浏览器指纹、COOP/COEP、BFCache、Observer 系列 |
| 🌐 计算机网络 | 32 | HTTP/HTTPS、缓存、TCP、CORS、状态码、HTTP/2/3、QUIC、TLS 1.3、OAuth2/OIDC、证书链+HSTS、gRPC/Protobuf、CDN、DNS、**WebSocket 握手/帧格式/掩码**、Ping/Pong、心跳重连指数退避、SSE 与 EventSource、Socket.IO/Engine.IO、WS 跨域鉴权与混合内容、permessage-deflate 压缩、二进制 Protobuf、广播风暴与 Redis Adapter、故障排查与 Nginx 坑 |
| ⚡ 性能优化 | 22 | Core Web Vitals、懒加载、防抖节流、构建优化、监控、长任务、Web Worker 优化、内存泄漏、INP、骨架屏、图片优化进阶（AVIF）、打包体积优化 |
| 🏗️ 工程化 | 22 | 模块系统、Webpack/Vite、CI/CD、Monorepo、代码规范、Vite vs Webpack 原理、ESBuild/Rolldown、微前端方案、PWA、错误监控与性能埋点、灰度发布与 A/B 测试 |
| 🧮 数据结构与算法 | 15 | 排序、二分、栈队列、链表、二叉树、动态规划、贪心 |
| ✍️ 手写代码 | 16 | 防抖节流、深拷贝、Promise、call/apply/bind、发布订阅 |
| 🤖 AI 编程 | 24 | AI 辅助编程、Agent、RAG、提示工程、MCP 协议、Vibe Coding |
| 🗺️ GIS 地理信息 | 41 | GeoJSON、坐标系纠偏、瓦片、Turf.js、OpenLayers、Mapbox/MapLibre、Leaflet、Cesium、Three.js、Deck.gl（分类页按框架分组） |
| 📱 移动端 / 小程序 | 18 | iOS/Android H5 兼容、viewport 与 100dvh、rem/vw/px-to-viewport 适配、微信小程序双线程与 setData、生命周期、分包、自定义组件、登录/unionid、web-view/跳转、uni-app 条件编译与 nvue、Taro 编译原理、Hybrid JSBridge、手势、跨端选型、uniCloud/easycom/uni-id |

### 📝 模拟考试题库（138 道选择题 · 全部带难度分级）

独立的单选题库（结构：`category / difficulty / question / options / answer / analysis`），覆盖 11 个核心分类，每次从 138 道中**按预设权重 + 难度比例**抽取 30 题：

| 分类 | 数量 | 分类 | 数量 |
| --- | ---: | --- | ---: |
| JavaScript | 19 | 浏览器原理 | 9 |
| CSS | 17 | 计算机网络 | 17 |
| Vue | 14 | 性能优化 | 9 |
| HTML | 12 | 工程化 | 8 |
| React | 12 | 移动端/小程序 | 10 |
| TypeScript | 11 | | |

**考试进阶配置：**
- 🎚️ **难度模式**：简单（60/30/10）、均衡（30/50/20，默认）、困难（10/40/50）
- 🗂️ **分类选择**：可选 1 个或多个分类重点练习（权重自动归一化）
- 📊 **分布统计**：结果页展示「分类分布」+「难度分布」条形图，直观了解知识结构

### 💻 算法实战题库（45 道手写题 · LeetCode 风格）

独立的手写算法题库（结构：`no / title / difficulty / tags / desc / functionName / starterCode / setup / testCases / solution / timeComplexity / spaceComplexity`），覆盖主流算法分类，浏览器内 **Web Worker 沙箱**直接运行用户代码，无需后端：

| 分类 | 题量 | 代表题目 |
| --- | ---: | --- |
| 数组 | 9 | 两数之和、三数之和、最大子数组和、合并区间、买卖股票最佳时机 |
| 字符串 | 6 | 最长回文子串、有效括号、字符串相加、反转单词 |
| 链表 | 6 | 反转链表、合并有序链表、环形链表、LRU 缓存 |
| 树 / 二叉树 | 7 | 二叉树层序遍历、最大深度、最近公共祖先、验证二叉搜索树 |
| 栈 / 队列 | 3 | 用栈实现队列、每日温度、最小栈 |
| 动态规划 | 6 | 爬楼梯、零钱兑换、最长递增子序列、不同路径 |
| 回溯 / 全排列 | 3 | 全排列、子集、N 皇后 |
| 排序 / 查找 | 3 | 二分查找、合并两个有序数组、第 K 大元素 |
| 设计题 | 2 | 最小栈、LRU 缓存 |

**算法实战特性：**
- 🧪 **在线判题**：用户代码在浏览器 **Web Worker** 沙箱中执行，主线程不受阻塞，5 秒超时保护。
- ✅ **测试用例自动比对**：深比较输出与期望，逐条标记「通过/失败」，附失败输入与期望/实际对照。
- 🔁 **输入/输出序列化**：自动处理数组 / 链表 / 二叉树等数据结构的字符串转换，无需手写 parse。
- 📋 **题解 + 复杂度**：每题附 Markdown 思路解析、时间复杂度、空间复杂度提示。
- 🎯 **答题进度**：状态机管理 `idle → taking → result` 三态，支持题目间切换、保存草稿、统一提交。
- 📱 **响应式分屏**：桌面端左右分屏（题目描述 + 代码编辑器），移动端上下堆叠。

---

## 🛠️ 技术栈

| 技术 | 用途 |
| --- | --- |
| Vue 3（`<script setup>` + Composition API） | UI 框架 |
| Vite 5 | 构建工具 / 开发服务器 |
| Pinia | 状态管理（题目、搜索、收藏、考试、算法实战） |
| Vue Router 4 | 路由 |
| Marked + highlight.js | Markdown 渲染 + 代码块语法高亮 |
| Web Worker | 算法实战在线判题的沙箱执行环境 |

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
│   ├── router/index.js         # 路由配置（首页 / 分类 / 题目 / 收藏 / 考试 / 算法实战 / 关于）
│   ├── stores/
│   │   ├── questions.js       # Pinia store：题目 / 搜索 / 收藏
│   │   ├── exam.js            # 考试状态管理（idle / taking / result 三态）
│   │   └── algorithmExam.js   # 算法实战状态管理（题目列表 / 用户代码 / 判题结果）
│   ├── composables/useTheme.js # 主题（深色模式）
│   ├── utils/markdown.js       # Markdown + 代码块（高亮/复制/运行）封装
│   ├── utils/algorithmRunner.js # Web Worker 沙箱判题器（超时保护 / 输入输出转换 / 深比较）
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
│   │   ├── AlgorithmExamView.vue # 算法实战（选题 / 答题 / 在线判题 / 结果）
│   │   └── AboutView.vue       # 关于
│   └── data/                   # 📚 题库数据（可持续扩充）
│       ├── categories.js       # 分类元信息（id/名称/图标/简介）
│       ├── html.js · css.js · javascript.js
│       ├── typescript.js · vue.js · react.js
│       ├── browser.js · network.js · performance.js
│       ├── engineering.js · algorithm.js · handwriting.js
│       ├── aicode.js           # AI 编程分类
│       ├── exam.js             # 模拟考试选择题题库（独立结构，138 题，全部带 difficulty 难度字段）
│       ├── algorithmExam.js    # 算法实战题库（独立结构，45 题，含测试用例与题解）
│       └── gis.js              # GIS 地理信息分类
├── screenshots/                # 🖼️ 系统运行截图位置（用户可手动存放展示图）
│   ├── home.png                #   首页概览（分类卡片 + 搜索 + 题量统计）
│   ├── question-detail.png     #   题目详情页（答案解析 + 代码块复制/运行）
│   ├── exam-config.png         #   模拟考试开始页（难度模式 + 分类选择）
│   ├── exam-taking.png         #   答题页（题目 + 选项 + 题号导航）
│   ├── exam-result.png         #   结果页（分数 + 分布统计 + 错题解析）
│   ├── algorithm-list.png      #   算法实战选题页（分类筛选 + 难度 badge + 题量）
│   └── algorithm-taking.png    #   算法答题页（左右分屏 + 代码编辑器 + 测试结果）
├── index.html
├── vite.config.js
├── jsconfig.json
├── package.json
└── README.md
```

### 🖼️ 系统运行截图说明

项目中预留了 **`screenshots/`** 目录用于存放系统运行时的界面截图，便于在 README 或分享文档中直接引用展示：

| 截图文件 | 说明 | 采集建议 |
| --- | --- | --- |
| `screenshots/home.png` | 首页概览：展示分类卡片、搜索框、总题量统计、深色模式切换等 | 顶部导航完整显示 + 至少 3 行分类卡片 |
| `screenshots/question-detail.png` | 题目详情页：题目标题、难度 badge、Markdown 答案、代码块高亮 + 复制/运行按钮 | 展示 1-2 个代码块效果 |
| `screenshots/exam-config.png` | 模拟考试开始页：三种难度模式卡片、10 个分类 chip 选择、规则说明 | 「均衡模式」高亮状态 |
| `screenshots/exam-taking.png` | 答题页：进度条、分类 + 难度 badge、选项 A/B/C/D、底部题号导航 | 第 5-10 题左右的答题中间状态 |
| `screenshots/exam-result.png` | 结果页：分数圆环、对/错/未答统计、分类/难度分布条形图、1-2 道错题解析 | 分数 70-85 分（含错题解析）最佳 |
| `screenshots/algorithm-list.png` | 算法实战选题页：分类筛选 chip、难度 badge、题号导航 | 至少显示 6-8 道题目卡片 |
| `screenshots/algorithm-taking.png` | 算法答题页：左侧题目描述 + 右侧代码编辑器、底部测试用例通过/失败状态 | 展示 1-2 个测试通过的题目 |

> 💡 截图建议尺寸：宽度 1400px 左右、保留顶部标题栏、配合浅色主题；如需 README 内联引用，可在下方 Markdown 表格中通过 `![首页](./screenshots/home.png)` 插入。

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

### 4. 添加算法实战题（在线判题）

算法实战题库独立于问答题库，位于 [src/data/algorithmExam.js](file:///d:/code/fe-interview-bank/src/data/algorithmExam.js)，结构如下：

```js
export const algorithmProblems = [
  {
    id: 'algo-001',
    no: '1',                      // 显示序号
    title: '两数之和',
    difficulty: '简单',            // 简单 | 中等 | 困难
    tags: ['数组', '哈希表'],
    desc: '题目描述（支持 Markdown）',
    functionName: 'twoSum',       // 用户需实现的函数名
    starterCode: 'function twoSum(nums, target) {\n  // 写你的代码\n}',
    setup: '',                    // 可选：辅助函数 / 类型定义（如链表节点）
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] }
    ],
    solution: '### 解题思路\n\n使用哈希表存储...',  // Markdown 题解
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  }
  // ...
]
```

**注意事项：**
- `testCases.input` 是数组，会作为参数依次传入用户函数（如 `twoSum(...input)`）。
- 链表 / 二叉树等复杂数据结构请在 `setup` 中提供构造函数，判题器会自动调用反序列化。
- 判题器位于 [src/utils/algorithmRunner.js](file:///d:/code/fe-interview-bank/src/utils/algorithmRunner.js)，使用 **Web Worker** 沙箱执行，**5 秒超时保护**。

---

## 📝 说明

- 题库内容为内置数据，**纯前端项目**，无后端依赖。
- 收藏 / 主题偏好保存在浏览器 `localStorage`，清理浏览器数据会丢失。
- 代码「在线运行」功能为浏览器内沙盒执行，JS 支持 `async/await`，HTML/CSS 在同源 iframe 预览，保证隔离性。
- 算法实战判题功能基于 **Web Worker**，用户代码运行在独立线程，5 秒超时保护，主线程不受阻塞。
- 内容仅供学习交流使用，欢迎补充与指正。

## License

MIT
