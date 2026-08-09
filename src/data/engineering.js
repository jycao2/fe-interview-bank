export const engineeringQuestions = [
  {
    id: 'eng-001',
    category: 'engineering',
    title: '前端模块化方案有哪些？CommonJS 与 ES Module 的区别？',
    difficulty: '中等',
    tags: ['模块化', 'CommonJS', 'ESM'],
    answer: `## 主要方案

- **CommonJS（CJS）**：Node 早期标准，\`require/module.exports\`。
- **AMD / UMD**：早期浏览器异步模块（RequireJS），UMD 兼容两者，现已少见。
- **ES Module（ESM）**：ES6 官方标准，\`import/export\`，现代浏览器与 Node 均支持。

## CJS vs ESM

| | CommonJS | ES Module |
| --- | --- | --- |
| 语法 | require / module.exports | import / export |
| 加载 | 运行时动态加载 | 编译期静态分析 |
| 输出 | 值的拷贝（基本类型） | 值的引用（live binding） |
| 是否支持 tree-shaking | 否 | 是 |
| 顶层 this | module | undefined |
| 顶层 await | 不支持 | 支持 |
| 循环依赖 | 能运行但可能拿到未完成导出 | 静态分析，引用在用到时取值 |
| 使用场景 | Node 服务端、老旧 npm 包 | 现代浏览器、构建工具、新代码 |

## 值的拷贝 vs 值的引用

\`\`\`js
// CJS：导出值的拷贝
// lib.js
let count = 0
setTimeout(() => count = 1, 100)
module.exports = { count }
// main.js
const { count } = require('./lib')
setTimeout(() => console.log(count), 200)  // 0（不变）

// ESM：导出值的引用
// lib.mjs
export let count = 0
setTimeout(() => count = 1, 100)
// main.mjs
import { count } from './lib.mjs'
setTimeout(() => console.log(count), 200)  // 1（同步）
\`\`\`

## Tree-shaking

ESM 的静态结构让构建工具（webpack、Rollup、Vite/esbuild）能在编译期分析哪些导出未被使用并删除，减小体积。CJS 是动态的，无法可靠分析。

## 实践

- 新项目统一用 ESM。
- package.json 设置 \`"type": "module"\`。
- 兼容旧包时构建工具会处理互操作（CJS 可被 import，反之需 default）。`
  },
  {
    id: 'eng-002',
    category: 'engineering',
    title: 'Webpack 和 Vite 的区别？为什么 Vite 更快？',
    difficulty: '中等',
    tags: ['Webpack', 'Vite', '构建工具'],
    answer: `## 构建方式差异

### Webpack

- **打包式**：启动时从入口递归分析依赖，把所有模块打包成 bundle 再启动服务。
- 大项目冷启动慢（要处理所有模块）。
- HMR：修改后需重新打包受影响的 chunk。

### Vite

- **开发期不打包**：利用浏览器原生 ESM，按需加载模块——浏览器请求哪个文件，Vite 才转换并返回哪个。
- 启动极快（只启动服务器，不预打包业务代码）。
- HMR：精确到模块，改一个只更新一个。
- 生产构建用 Rollup（打包 + tree-shaking），输出优化后的 bundle。

## Vite 快的原因

1. **冷启动不打包**：跳过 webpack 最耗时的依赖图构建与打包。
2. **按需编译**：用 esbuild（Go 编写，极快）做依赖预构建（把 CJS 转 ESM、合并小依赖）。
3. **原生 ESM**：浏览器自己负责模块加载，服务器只做转换。
4. **HMR 精准**：基于 ESM 模块图，只失效受影响模块。

## 依赖预构建（esbuild）

- 把 node_modules 中的 CJS / UMD 转为 ESM。
- 合并多入口的小依赖（如 lodash-es 多文件）减少请求。
- 用 esbuild 速度比 webpack 快 10-100 倍。

## 生产构建

Vite 生产用 Rollup（而非 esbuild，因 Rollup 产物更干净、tree-shaking 更好），输出与 webpack 类似的 hash bundle。

## 对比

| | Webpack | Vite |
| --- | --- | --- |
| 冷启动 | 慢（全量打包） | 快（按需） |
| HMR | 需重新打包 chunk | 精准模块更新 |
| 配置 | 复杂 | 简洁 |
| 生态 | 最成熟 | 快速追赶 |
| 生产打包 | 自研 | Rollup |
| 适用 | 老项目、复杂定制 | 新项目、SPA / 组件库 |

## 选择

- 新项目优先 Vite。
- 老项目 / 极复杂定制场景仍可用 Webpack。`
  },
  {
    id: 'eng-003',
    category: 'engineering',
    title: 'Webpack 的构建流程是怎样的？核心概念？',
    difficulty: '困难',
    tags: ['Webpack', '构建流程', 'loader', 'plugin'],
    answer: `## 核心概念

- **Entry**：入口，构建依赖图的起点。
- **Output**：输出配置（路径、文件名）。
- **Loader**：把非 JS 文件转成模块（CSS、图片、TS、Vue 等）。链式调用，从后往前。
- **Plugin**：扩展构建流程，监听生命周期钩子（compiler/compilation）执行任务（压缩、HTML 生成、拷贝、环境变量）。
- **Module**：一切皆模块。
- **Chunk**：打包过程中的代码块（entry、splitChunks、动态 import 产生）。
- **Bundle**：最终输出的文件。

## 构建流程（三大阶段）

### 1. 初始化

- 读取配置合并参数，创建 \`Compiler\` 对象。
- 注册所有插件（插件在此时订阅 hooks）。

### 2. 编译（make）

- 从 entry 出发，调用 loader 转译每个模块。
- 递归解析依赖（import / require），构建**模块依赖图（ModuleGraph）**。
- 每个模块经过 loader 转换后生成 AST、收集依赖。

### 3. 输出（seal → emit）

- **seal**：根据依赖图组装 chunk，应用优化（tree-shaking、splitChunks、作用域提升）。
- 通过模板把 chunk 转成最终 asset。
- **emit**：把 asset 写入 output 目录。
- 插件可在各钩子介入（如 emit 钩子修改 asset）。

## Loader 与 Plugin 区别

- **Loader**：文件级转换，输入输出都是模块内容（字符串 / AST）。
- **Plugin**：构建流程级，监听钩子做更广的事（生成文件、优化、环境注入）。

## 常用配置示例

\`\`\`js
module.exports = {
  entry: './src/main.js',
  output: { filename: '[name].[contenthash].js', path: dist },
  module: {
    rules: [
      { test: /\\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\\.vue$/, loader: 'vue-loader' }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  optimization: { splitChunks: { chunks: 'all' } }
}
\`\`\`

## 优化手段

- 缓存：cache-loader / 持久化缓存（webpack5 \`cache: { type: 'filesystem' }\`）。
- 多线程：thread-loader。
- include/exclude 缩小 loader 范围。
- splitChunks 拆包、externals 外链大库。
- 按需加载动态 import。`
  },
  {
    id: 'eng-004',
    category: 'engineering',
    title: '前端代码规范与工程化工具有哪些？',
    difficulty: '简单',
    tags: ['代码规范', 'ESLint', 'Prettier'],
    answer: `## 代码规范

### 1. ESLint

- 静态检查 JS/TS 代码，发现语法错误、不规范写法。
- 可自动修复（--fix）。
- 常用配置：eslint-config-airbnb、eslint:recommended、typescript-eslint。
- Vue 用 eslint-plugin-vue，React 用 eslint-plugin-react-hooks。

### 2. Prettier

- 代码格式化工具（不检查逻辑，只管格式：缩进、引号、换行）。
- 与 ESLint 配合：用 eslint-config-prettier 关闭冲突规则。

### 3. Stylelint

- CSS / SCSS / Vue 样式规范检查。

### 4. TypeScript

- 类型约束本身就是强规范。

## Git 提交规范

- **Husky**：Git hooks 工具（pre-commit、commit-msg）。
- **lint-staged**：只对暂存区文件执行 lint / 格式化，速度快。
- **commitlint + commitizen**：规范 commit message（Conventional Commits：feat/fix/docs/...）。
- **commitlint-config-conventional**：约定式提交校验。

\`\`\`json
// package.json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
\`\`\`

## 类型与质量

- **TypeScript** 类型检查。
- **单元测试**：Jest、Vitest。
- **E2E 测试**：Playwright、Cypress。
- **覆盖率**：c8、istanbul。

## CI/CD

- **GitHub Actions / GitLab CI**：PR 时跑 lint、test、build。
- **预提交钩子**：本地拦截低级错误。

## 文档与组件库

- **Storybook**：组件文档与隔离开发。
- **VitePress**：技术文档站。

## 一键脚手架

- Vue CLI、create-vue、Vite 模板、自定义脚手架（plop / hygen）统一团队项目结构。`
  },
  {
    id: 'eng-005',
    category: 'engineering',
    title: '前端如何做错误监控与日志上报？',
    difficulty: '中等',
    tags: ['错误监控', 'Sentry', '日志上报'],
    answer: `## 错误类型

1. **JS 运行时错误**：未捕获异常、语法错误。
2. **资源加载错误**：图片、JS、CSS 加载失败。
3. **接口错误**：HTTP 请求失败 / 业务错误码。
4. **Promise 未捕获 rejection**。
5. **白屏 / 渲染异常**。

## 捕获方式

### 1. window.onerror

捕获 JS 运行时错误（同步、异步）：

\`\`\`js
window.onerror = (msg, url, line, col, error) => {
  report({ type: 'js', msg, url, line, col, stack: error?.stack })
}
\`\`\`

### 2. window.addEventListener('error', ...)

捕获资源加载错误（img/script/link 的 error 不会冒泡到 window.onerror，但 capture 阶段能捕获）：

\`\`\`js
window.addEventListener('error', (e) => {
  const target = e.target
  if (target instanceof HTMLElement) {
    report({ type: 'resource', tag: target.tagName, src: target.src })
  }
}, true)  // 必须用捕获
\`\`\`

### 3. unhandledrejection

捕获未处理的 Promise rejection：

\`\`\`js
window.addEventListener('unhandledrejection', (e) => {
  report({ type: 'promise', reason: e.reason })
})
\`\`\`

### 4. 接口错误

封装 fetch / axios，在 catch / 响应拦截器中上报。

### 5. 框架错误边界

React ErrorBoundary、Vue \`app.config.errorHandler\` 捕获组件渲染错误。

## 上报方式

- **navigator.sendBeacon(url, data)**：页面卸载时也能可靠发送，推荐。
- **fetch keepalive**：类似 sendBeacon 但更灵活。
- **Image GET**：\`new Image().src = url?data=...\`，兼容性好，受 URL 长度限制。
- **fetch POST**：常规场景。

## 数据内容

- 错误信息、堆栈、文件行列。
- 用户信息（uid）、设备、浏览器、版本。
- 发生时间、页面 URL、路由。
- 用户行为轨迹（点击、路由跳转）便于复现。
- SourceMap 还原压缩代码位置。

## SourceMap

- 生产打包生成 source map 但**不上传到 CDN**（避免暴露源码）。
- 上传到错误监控平台，平台用 map 还原真实堆栈。

## 成熟方案

- **Sentry**：开源 / SaaS，全功能错误监控、性能、回放。
- **自研**：采集 SDK + 上报服务 + 存储（ES / ClickHouse）+ 看板。

## 性能 / 行为监控

- 性能指标上报（Web Vitals）。
- 用户行为埋点（点击、曝光、停留）。
- 长任务、慢接口监控。

## 注意

- 上报需**采样、节流、聚合**，避免海量日志。
- 去重、限频防止雪崩。
- 敏感信息脱敏。`
  },
  {
    id: 'eng-006',
    category: 'engineering',
    title: '前端如何实现 CI/CD 与自动化部署？',
    difficulty: '中等',
    tags: ['CI/CD', '部署', '自动化'],
    answer: `## CI/CD 概念

- **CI（持续集成）**：代码提交后自动跑 lint、test、build，及早发现问题。
- **CD（持续交付 / 部署）**：构建产物自动部署到测试 / 预发 / 生产环境。

## 典型流程

\`\`\`
提交代码 / PR
  → 触发 CI（lint + test + build）
  → 合并主干
  → 构建 Docker 镜像 / 静态资源
  → 部署到测试环境（自动）
  → 验收 → 部署预发 → 部署生产（手动 / 自动）
\`\`\`

## 工具

### 1. GitHub Actions

\`\`\`yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist }
\`\`\`

### 2. GitLab CI / Jenkins

类似流程，配置文件不同。

## 部署方式

### 静态资源部署

- 构建产物上传到 CDN / OSS / S3 / Nginx 静态目录。
- 文件名带 contenthash，配合强缓存。
- HTML 不缓存或短缓存，确保入口能更新。

### 容器化部署

- 多阶段 Dockerfile：构建阶段用 node 镜像打包，运行阶段用 nginx 镜像托管静态文件。
- 镜像推送仓库，K8s / Docker 部署。

\`\`\`dockerfile
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
\`\`\`

## 部署策略

- **滚动发布**：逐步替换实例。
- **蓝绿部署**：两套环境切换，快速回滚。
- **灰度 / 金丝雀**：小流量先验证再全量。

## 前端特有

- **环境变量**：构建时注入（VITE_API_URL），区分多环境。
- **多环境构建**：\`build:staging\` / \`build:prod\`。
- **版本回滚**：保留历史镜像 / 静态资源版本，秒级回滚。
- **预渲染 / SSR**：需要 Node 运行时，部署比纯静态复杂。

## 质量门禁

- PR 必须通过 CI + 代码审查才能合并。
- 测试覆盖率阈值。
- Lighthouse 分数卡点（可选）。`
  },
  {
    id: 'eng-007',
    category: 'engineering',
    title: 'Tree-shaking 的原理与前提？',
    difficulty: '困难',
    tags: ['Tree-shaking', 'ESM', '构建优化'],
    answer: `## 定义

Tree-shaking（摇树优化）：构建时**静态分析模块依赖，删除未被使用的导出代码**，减小产物体积。形象比喻：摇树让枯叶（无用代码）掉落。

## 前提条件

1. **必须使用 ES Module**（\`import/export\`）。
   - CJS 是动态的（require 可在条件分支里），无法静态确定用了哪些导出。
2. **无副作用**或正确标记副作用。
   - 模块顶层执行了有副作用的操作（修改全局变量、写文件、原型污染），构建工具不敢删除。

## 原理

- 构建工具（Rollup / Webpack / esbuild）解析 ESM 的静态结构，构建模块依赖图。
- 标记每个 export 是否被 import 引用。
- 未被引用的 export 在压缩阶段被删除（minifier 如 terser / esbuild 做死代码消除 DCE）。

## 副作用标记

\`\`\`json
// package.json
{
  "sideEffects": false   // 整个包无副作用，可放心 tree-shake
}
\`\`\`

或指定有副作用的文件：

\`\`\`json
{ "sideEffects": ["./src/polyfill.js", "*.css"] }
\`\`\`

## 常见阻碍

1. **使用 CJS**：\`require()\` / \`module.exports\` 无法 tree-shake。
2. **导出整个对象**：\`export default { a, b, c }\` 后只用具名访问，难以分析。
3. **函数有副作用**：工具保守保留。
4. **动态 import / 动态属性访问**：\`obj[someKey]\` 难静态分析。
5. **类的方法**：未直接调用的方法可能被保留（难确定是否被反射使用）。

## 最佳实践

- 库作者用 ESM 导出，\`sideEffects\` 标注准确。
- 业务代码按需引入：\`import { debounce } from 'lodash-es'\`（lodash-es 支持，lodash CJS 不支持）。
- 避免整包 \`import _ from 'lodash'\`。
- 用具名导出而非默认导出对象。

## 验证

- 构建后检查产物是否包含未使用代码。
- Vite / Rollup 可分析打包体积（rollup-plugin-visualizer）。`
  },
  {
    id: 'eng-008',
    category: 'engineering',
    title: 'Webpack 中 Loader 与 Plugin 的区别？如何编写？',
    difficulty: '中等',
    tags: ['Webpack', 'Loader', 'Plugin'],
    answer: `## 概念区别

| | Loader | Plugin |
| --- | --- | --- |
| 作用 | 文件级转换 | 流程级扩展 |
| 输入输出 | 单个模块内容（字符串/AST） | 任意 |
| 调用时机 | 模块被解析时 | 整个构建生命周期 |
| 配置位置 | module.rules | plugins |
| 能力 | 转换源码 | 改 bundle、生成文件、注入环境、优化 |

## Loader

把非 JS 文件（CSS、TS、图片、Vue）转换成 JS 模块。链式调用，**从后往前**执行。

\`\`\`js
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
      // 执行顺序：css-loader → style-loader
    ]
  }
}
\`\`\`

### Loader 类型

- **同步 Loader**：

\`\`\`js
module.exports = function (source) {
  return source.replace(/foo/g, 'bar')
}
\`\`\`

- **异步 Loader**：

\`\`\`js
module.exports = function (source) {
  const callback = this.async()
  setTimeout(() => callback(null, source.replace(/foo/g, 'bar')), 100)
}
\`\`\`

- **Pitching Loader**：从前往后执行 pitch 方法，可用于拦截。

### 内联 Loader

\`\`\`js
import 'style-loader!css-loader!./style.css'
\`\`\`

## Plugin

监听 Webpack 生命周期钩子（compiler/compilation）执行任务。

### 常用 Plugin

- \`HtmlWebpackPlugin\`：生成 HTML 并注入 bundle。
- \`MiniCssExtractPlugin\`：抽取 CSS 到独立文件。
- \`DefinePlugin\`：注入环境变量。
- \`CopyWebpackPlugin\`：拷贝静态文件。
- \`CleanWebpackPlugin\`：清理输出目录。
- \`TerserPlugin\`：压缩 JS。
- \`BundleAnalyzerPlugin\`：可视化产物。

### 编写 Plugin

Plugin 是一个类，有 \`apply\` 方法接收 \`compiler\`：

\`\`\`js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, cb) => {
      // 修改或新增 asset
      compilation.assets['note.txt'] = {
        source: () => 'hello',
        size: () => 5
      }
      cb()
    })
  }
}
\`\`\`

### Hook 类型

- \`tap\`：同步。
- \`tapAsync\`：异步（callback）。
- \`tapPromise\`：异步（Promise）。

常用钩子：

| 钩子 | 时机 |
| --- | --- |
| \`entryOption\` | 入口配置后 |
| \`beforeRun\` / \`run\` | 构建开始 |
| \`compilation\` | 创建 compilation |
| \`make\` | 添加入口、构建模块图 |
| \`emit\` | 输出 asset 前 |
| \`afterEmit\` | 输出后 |
| \`done\` | 构建完成 |

## 选用

- 想转换文件内容 → Loader。
- 想介入构建流程、生成额外文件、注入变量、做优化 → Plugin。

## 经典组合

- 处理 CSS：\`css-loader\` + \`style-loader\`（开发）或 \`MiniCssExtractPlugin\`（生产）。
- 处理图片：\`asset/resource\`（webpack5 内置）或 \`file-loader\`（旧）。
- 处理 Vue：\`vue-loader\` + \`VueLoaderPlugin\`。`
  },
  {
    id: 'eng-009',
    category: 'engineering',
    title: 'Webpack 热更新（HMR）的原理是什么？',
    difficulty: '困难',
    tags: ['Webpack', 'HMR', '热更新'],
    answer: `## HMR（Hot Module Replacement）

代码修改后**只替换变更的模块**，无需刷新整个页面，保留页面状态（如 form 输入、路由）。

## 整体架构

\`\`\`
Webpack 编译器 ──(文件变化)─→ 重新编译 ──→ 生成 manifest + update chunk
                                            │
Dev Server ──(WebSocket)─→ 通知浏览器 ────┘
                                            │
浏览器 HMR Runtime ──(JSONP/HTTP)─→ 拉取 update ──→ 应用模块替换
\`\`\`

## 关键组件

### 1. webpack-dev-server（WDS）

- 启动 Express 服务器托管静态资源。
- 启动 WebSocket 服务，与浏览器保持长连接。
- 监听 webpack 编译完成事件。

### 2. HMR Runtime（注入到 bundle）

- 在浏览器中运行，与 WDS 通过 WebSocket 通信。
- 接收变更通知，拉取 update chunk，应用模块替换。

### 3. webpack-dev-middleware

- 把 webpack 编译产物放在内存中（不写磁盘），WDS 直接 serve。
- 监听文件变化触发重新编译。

## 工作流程

1. **启动**：webpack 编译，生成 bundle（含 HMR runtime），WDS 启动并建立 WebSocket。
2. **文件改动**：webpack 监听到变化，重新编译受影响模块。
3. **生成更新**：输出两个文件：
   - \`[hash].hot-update.json\`：manifest，列出变更的 chunk。
   - \`[hash].hot-update.js\`：变更模块的新代码。
4. **通知浏览器**：WDS 通过 WebSocket 发送 \`{hash, action: 'sync'}\`。
5. **拉取更新**：HMR Runtime 用 JSONP（或 fetch）请求 manifest 与 update chunk。
6. **应用更新**：
   - 调用 \`module.hot.accept\` 注册的回调。
   - 旧模块被新模块替换。
   - 若无 accept，向上冒泡到入口，最终触发整页刷新。

## 模块级 accept

\`\`\`js
if (module.hot) {
  module.hot.accept('./App', () => {
    // App 模块更新时调用
    render()
  })
}
\`\`\`

- 框架（React/Vue）的 HMR loader 已自动处理：
  - Vue：vue-loader 注入 accept，重新挂载组件。
  - React：react-refresh 在保留 hooks 状态下重渲染组件。

## Manifest 示例

\`\`\`json
{
  "c": { "main": "abc123" },
  "r": "old-hash",
  "m": []
}
\`\`\`

- \`c\`：变更的 chunk 与 hash。
- \`r\`：要移除的模块。

## 与 Vite HMR 对比

| | Webpack HMR | Vite HMR |
| --- | --- | --- |
| 编译 | 重新打包受影响 chunk | 仅转换改动模块（esbuild） |
| 通信 | WebSocket | WebSocket |
| 模块获取 | JSONP 拉 update chunk | 浏览器直接 import 单文件 |
| 速度 | 中等项目很快，大项目略慢 | 极快（无打包） |

## 注意

- HMR 配置 \`hot: true\` 与 \`HotModuleReplacementPlugin\`（webpack5 dev-server 自动）。
- 生产构建不能含 HMR runtime（tree-shaking 移除）。
- 全局状态（Redux、Pinia）默认不重置，需配合 redux-persist 或手动处理。
- 样式 HMR：\`style-loader\` 已支持，CSS 改动无需刷新即可看到。`
  },
  {
    id: 'eng-010',
    category: 'engineering',
    title: 'Vite 的依赖预构建（esbuild）与按需编译是如何工作的？',
    difficulty: '困难',
    tags: ['Vite', 'esbuild', '预构建'],
    answer: `## 背景

Vite 开发期不打包业务代码，利用浏览器原生 ESM 按需加载。但有两类问题：

1. **第三方包多是 CJS / UMD**：浏览器无法直接 import。
2. **大量小模块（如 lodash-es 有 600+ 文件）**：浏览器并发请求多，网络开销大。

Vite 用**依赖预构建**解决。

## 依赖预构建（Dependency Pre-bundling）

### 流程

1. 启动 dev server 时，Vite 扫描入口 HTML 与代码，找出依赖（import 自 node_modules 的）。
2. 用 **esbuild**（Go 编写，比 webpack 快 10-100x）把依赖：
   - CJS / UMD → ESM。
   - 合并多文件为单文件（如 lodash-es 合成一个）。
3. 输出到 \`node_modules/.vite/deps/\`。
4. 浏览器请求时，重写到该路径。

### 缓存

- 缓存到 \`node_modules/.vite/deps/\`。
- 失效条件：lockfile 变化、\`vite.config.js\` 的 optimizeDeps 配置变化、相关包版本变化。
- 强制重建：删除缓存或 \`--force\`。

### 配置

\`\`\`js
export default {
  optimizeDeps: {
    include: ['lodash-es'],   // 强制预构建
    exclude: ['my-local-pkg'] // 排除
  }
}
\`\`\`

### 为什么用 esbuild

- 速度极快（Go 单线程秒级 vs JS 工具分钟级）。
- 内置 CJS → ESM 转换。
- 不做 type-check 与最小化，只做转换。

## 按需编译

业务代码（src/）不预构建，浏览器请求时才转换：

\`\`\`
浏览器 import './App.vue'
  ↓
Vite server 拦截 .vue 请求
  ↓
@vitejs/plugin-vue 编译 SFC → JS
  ↓
返回浏览器
\`\`\`

### 转换流程

1. 浏览器 \`import './App.vue'\`。
2. Vite 拦截请求，识别后缀。
3. 调用插件链（vite:vue、vite:react、vite:esbuild 等）转译：
   - \`.vue\` → 编译 SFC。
   - \`.tsx/.jsx/.ts\` → esbuild 转 JS。
   - \`.css\` → 注入 style 标签（开发）。
   - \`.scss\` → sass 编译。
4. 返回转译后的 ESM JS。
5. 浏览器解析 import，递归请求依赖。

### import 重写

源码中的 bare import（如 \`import vue from 'vue'\`）会被重写到预构建路径：

\`\`\`js
// 源码
import { ref } from 'vue'

// 重写后
import { ref } from '/node_modules/.vite/deps/vue.js?v=abc'
\`\`\`

## 生产构建

生产环境不用预构建与按需编译，而是用 **Rollup** 打包：

- 完整 bundle + 代码分割 + tree-shaking。
- 输出 hash 文件，部署到 CDN。

为什么不直接用 esbuild 生产打包？esbuild 在代码分割与 CSS 处理上不够成熟，Rollup 产物更优。

## 优势

1. **冷启动快**：只需预构建依赖，业务代码按需。
2. **HMR 精准**：改一个文件只更新该文件，无重新打包。
3. **大项目无性能衰退**：项目越大，按需加载优势越明显。

## 注意

1. **首次访问稍慢**：第一次预构建需时间，后续命中缓存。
2. **新增依赖需重启或自动发现**：Vite 5 已支持运行时发现新依赖并触发重新预构建。
3. **CJS 包互操作问题**：少数 CJS 包导入需配置 optimizeDeps.include。
4. **SSR 模式**：依赖预构建逻辑不同，node 端按需加载。`
  },
  {
    id: 'eng-011',
    category: 'engineering',
    title: 'Babel 的工作原理是什么？preset 与 plugin 的区别？',
    difficulty: '困难',
    tags: ['Babel', '编译', 'AST', 'preset'],
    answer: `## Babel 是什么

JavaScript 编译器：把高版本语法（ES2024、JSX、TS）转成浏览器/Node 能运行的低版本 JS（如 ES5）。

## 三大阶段

### 1. Parse（解析）

源码 → **AST**（抽象语法树）。

- 词法分析（Lexer）：源码 → Token 流。
- 语法分析（Parser）：Token → AST。

Babel 用 \`@babel/parser\`（基于 acorn）。

\`\`\`js
const ast = parser.parse('const a = 1', { sourceType: 'module' })
\`\`\`

### 2. Transform（转换）

遍历 AST，按插件修改节点。

- \`@babel/traverse\` 遍历 AST。
- 每个插件定义 visitor，匹配节点类型时回调。

\`\`\`js
traverse(ast, {
  ArrowFunctionExpression(path) {
    // 把箭头函数转成 function
    path.replaceWith(t.functionExpression(...))
  }
})
\`\`\`

### 3. Generate（生成）

AST → 代码字符串 + source map。

- \`@babel/generator\`。

\`\`\`js
const output = generate(ast, {}, code)
console.log(output.code)
\`\`\`

## Plugin

一个 plugin 完成一个具体的转换规则：

\`\`\`js
export default function myPlugin({ types: t }) {
  return {
    name: 'my-plugin',
    visitor: {
      ArrowFunctionExpression(path) {
        // 转换箭头函数
      }
    }
  }
}
\`\`\`

例如 \`@babel/plugin-transform-arrow-functions\` 专门把箭头函数转成普通函数。

## Preset

一组 plugin 的集合，方便一键启用。

\`\`\`json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
\`\`\`

常见 preset：

- \`@babel/preset-env\`：根据目标环境（browserslist）智能选择需要的转换 plugin。
- \`@babel/preset-react\`：JSX 转换。
- \`@babel/preset-typescript\`：TS 转换（去掉类型，不检查类型）。

## preset-env 关键选项

\`\`\`json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead",
      "useBuiltIns": "usage",
      "corejs": 3,
      "modules": false
    }]
  ]
}
\`\`\`

- \`targets\`：目标环境（browserslist 语法）。
- \`useBuiltIns\`：
  - \`false\`：不注入 polyfill。
  - \`'entry'\`：在入口处全量注入。
  - \`'usage'\`：按需注入（仅用到的 API）。
- \`corejs\`：使用 core-js 提供 polyfill。
- \`modules\`：是否把 ESM 转成 CJS（webpack 项目设 false，让打包器处理）。

## polyfill vs transform

| | 转换语法 | polyfill |
| --- | --- | --- |
| 例子 | 箭头函数、解构、class | Promise、Array.includes、Object.assign |
| 方式 | 改写代码 | 注入运行时实现 |
| 工具 | Babel plugin | core-js / regenerator |

## Babel 与 SWC / esbuild

| | Babel | SWC | esbuild |
| --- | --- | --- | --- |
| 语言 | JS | Rust | Go |
| 速度 | 慢 | 快 20x+ | 快 100x+ |
| 插件 | 丰富 | 增长中 | 少 |
| 类型检查 | 不做 | 不做 | 不做 |
| 用途 | 编译 | 编译 / 压缩 | 编译 / 打包 |

新工具（SWC、esbuild）在速度上有数量级优势，但 Babel 生态成熟，复杂自定义场景仍是首选。

## 与 TypeScript 的关系

- Babel 不做类型检查，只剥离类型（\`@babel/preset-typescript\`）。
- 类型检查仍需 \`tsc --noEmit\` 或 IDE。
- swc / esbuild 同理：转换快，但不验证类型。

## 实践

- 业务项目：\`preset-env\` + \`preset-react\` + \`preset-typescript\`，配合 core-js polyfill。
- 库开发：用 \`@babel/plugin-transform-runtime\` 避免内联 helper 重复。
- CI/IDE 单独跑 \`tsc --noEmit\` 做类型检查。`
  },
  {
    id: 'eng-012',
    category: 'engineering',
    title: 'Source Map 的原理与作用是什么？',
    difficulty: '中等',
    tags: ['Source Map', '调试', '构建'],
    answer: `## 作用

打包/压缩后的代码（minified、bundled）几乎不可读。Source Map 是一个映射文件，记录"压缩后位置 ↔ 源码位置"的对应关系，让浏览器/调试器能还原原始代码位置。

用途：

- 错误堆栈还原（线上 bug 定位）。
- DevTools 调试压缩代码。
- IDE 中断点调试。

## 文件结构

打包产物末尾会有一行注释：

\`\`\`js
//# sourceMappingURL=bundle.js.map
\`\`\`

或内联（base64）：

\`\`\`js
//# sourceMappingURL=data:application/json;base64,xxx
\`\`\`

\`.map\` 文件内容：

\`\`\`json
{
  "version": 3,
  "sources": ["main.js", "utils.js"],
  "sourcesContent": ["const a=1...", "..."],
  "names": ["foo", "bar"],
  "mappings": "AAAA,SAASA...",
  "file": "bundle.js"
}
\`\`\`

- \`version\`：source map 规范版本（当前 3）。
- \`sources\`：原始文件路径。
- \`sourcesContent\`：原始内容（可选）。
- \`names\`：变量名映射（压缩时改名用）。
- \`mappings\`：核心，VLQ 编码的位置映射。

## mappings 字段（VLQ）

\`mappings\` 是用 **VLQ（Variable Length Quantity）** 编码的字符串，每一段表示一个映射点，包含 5 个字段：

1. 生成代码的列（起点）。
2. 源文件索引（对应 sources）。
3. 源文件的行（起点）。
4. 源文件的列。
5. 名字索引（对应 names，可选）。

行与行用 \`;\` 分隔，段与段用 \`,\` 分隔。所有值都是相对前一个值的差值（节省体积）。

## 生成方式

构建工具配置：

\`\`\`js
// Vite
export default {
  build: {
    sourcemap: true   // 或 'hidden'、'inline'
  }
}

// Webpack
module.exports = {
  devtool: 'source-map'  // 或 'eval-source-map'、'hidden-source-map' 等
}
\`\`\`

## devtool 模式（Webpack）

| 模式 | 速度 | 体积 | 适用 |
| --- | --- | --- | --- |
| \`eval\` | 最快 | 中 | 开发 |
| \`eval-source-map\` | 快 | 大 | 开发 |
| \`cheap-source-map\` | 较快 | 中 | 开发 |
| \`source-map\` | 慢 | 大 | 生产 |
| \`hidden-source-map\` | 慢 | 大 | 生产（不在产物中暴露） |
| \`inline-source-map\` | 慢 | 大（内联） | 小项目 |
| \`nosources-source-map\` | 慢 | 中 | 不暴露源码内容 |

## 生产环境的处理

线上代码暴露 source map 会泄漏源码。常见策略：

1. **不生成 source map**：完全无法还原堆栈，不推荐。
2. **生成但不上传 CDN**：构建产物带 \`.map\` 文件但部署时不发布，只上传到错误监控平台（如 Sentry）。
3. **hidden-source-map**：生成 map 但不在 bundle 中加 sourceMappingURL 注释，浏览器不自动加载，平台手动还原。
4. **nosources-source-map**：保留行列映射但不含源码内容，堆栈能定位到文件行列但看不到代码。

## 错误监控集成

Sentry 等平台：

1. 构建时上传 source map 到平台（与 release 版本绑定）。
2. 上报错误时附带 release 版本与压缩堆栈。
3. 平台用 source map 还原真实堆栈。

\`\`\`bash
# Sentry CLI
sentry-cli sourcemaps upload --release=v1.2.3 ./dist
\`\`\`

## 注意

1. **生产环境务必不要在产物中暴露 source map**。
2. CI 中保留每次构建的 source map 归档，便于事后排查。
3. source map 仅用于调试/定位，不影响运行性能（浏览器只在 DevTools 打开时加载）。
4. 第三方库的 source map 也应保留以便调试。`
  },
  {
    id: 'eng-013',
    category: 'engineering',
    title: 'Monorepo 是什么？pnpm workspace / Turborepo / Nx 如何选择？',
    difficulty: '中等',
    tags: ['Monorepo', 'pnpm', 'Turborepo', 'Nx'],
    answer: `## Monorepo 概念

**单一仓库管理多个项目/包**。与"每个项目一个仓库（Polyrepo）"相对。

适合场景：组件库、工具集、微前端、多端共享代码、内部 SDK。

## 优势与劣势

### 优势

- **代码共享**：公共逻辑、UI、类型一处维护。
- **原子提交**：跨包改动一个 PR 完成，避免版本不同步。
- **统一工程**：ESLint / TS / 构建配置统一。
- **依赖管理**：统一升级版本，避免碎片化。

### 劣势

- 仓库体积大、clone 慢。
- 权限控制粗（无法限制只访问某子包）。
- CI 复杂（需要增量构建与受影响范围分析）。
- 工具链学习成本。

## 常见方案

### 1. pnpm workspace（轻量）

\`pnpm-workspace.yaml\`：

\`\`\`yaml
packages:
  - 'packages/*'
  - 'apps/*'
\`\`\`

特点：

- **原生 workspace 协议**：\`"utils": "workspace:*"\`。
- **软链 node_modules**：节省磁盘、避免重复安装、避免幽灵依赖。
- 适合中小型 monorepo，无需复杂任务编排。

### 2. Turborepo（任务编排）

Vercel 出品，专注**任务并行与缓存**。

\`\`\`json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {},
    "lint": {}
  }
}
\`\`\`

特点：

- **依赖图任务调度**：自动按拓扑顺序执行 \`^build\`（先构建依赖的包）。
- **本地+远程缓存**：相同输入（源码 hash）跳过重复构建。
- **远程缓存**：团队共享缓存，CI 加速明显。
- 配合 pnpm workspace 使用。

### 3. Nx（全功能）

特点：

- **生成器（Generator）**：脚手架生成新包、新组件，统一模板。
- **代码生成器与迁移**：自动升级依赖。
- **受影响范围分析**：\`nx affected\` 只构建/测试受影响的包。
- **插件生态**：React、Vue、Node、Nest、Cypress、Storybook 等。
- 适合大型、复杂、需要强约束的 monorepo。

### 4. Lerna（已合并到 Nx）

早期方案，2022 年起由 Nx 团队维护，新项目建议用 Nx 或 pnpm + Turbo。

## 选择

| 场景 | 推荐 |
| --- | --- |
| 小型、几个包 | pnpm workspace 足够 |
| 中型、需要任务缓存与并行 | pnpm + Turborepo |
| 大型、需要生成器/迁移/affected | Nx |
| 已用 Lerna | 评估迁移到 Nx 或 pnpm+Turbo |

## 典型结构

\`\`\`
my-monorepo/
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── apps/
│   ├── web/
│   └── admin/
├── packages/
│   ├── ui/
│   ├── utils/
│   └── tsconfig/
\`\`\`

## 包间引用

\`\`\`json
// apps/web/package.json
{
  "dependencies": {
    "@my/ui": "workspace:*",
    "@my/utils": "workspace:*"
  }
}
\`\`\`

发布时由 changesets 等工具自动改写版本号：

\`\`\`bash
pnpm add @changesets/cli
\`\`\`

## 增量构建

\`\`\`bash
# Turborepo
turbo run build --filter=...           # 只构建某包及其依赖
turbo run build --filter=...^...       # 包含依赖
turbo run build --since=origin/main    # 自上次提交起受影响的

# Nx
nx affected -t build
\`\`\`

## 实践建议

1. 统一 tsconfig、eslint、prettier 配置（根目录 + 继承）。
2. 公共依赖（如 react）提到根目录 workspace 配置。
3. 包版本管理用 changesets 或 nx release。
4. CI 用 affected 跑增量，节省时间。
5. 文档与 README 在根目录统一维护。`
  },
  {
    id: 'eng-014',
    category: 'engineering',
    title: '常见的 Git 工作流有哪些？如何选择？',
    difficulty: '简单',
    tags: ['Git', '工作流', '协作'],
    answer: `## 主要工作流

### 1. Git Flow（经典）

分支结构：

- \`main\`：生产代码。
- \`develop\`：开发主干。
- \`feature/*\`：从 develop 拉，合并回 develop。
- \`release/*\`：发布准备。
- \`hotfix/*\`：生产紧急修复，合并到 main 和 develop。

特点：

- 流程严谨，适合有明确发布周期的产品（如 App、桌面软件）。
- 分支多、流程重，不适合持续部署的 Web 项目。

### 2. GitHub Flow（轻量）

分支结构：

- \`main\`：始终可部署。
- \`feature/*\`：从 main 拉，PR 审核后合并回 main，立即部署。

特点：

- 简单，适合 Web/SaaS 持续部署。
- 单一主干，PR 驱动。
- GitHub 官方推荐。

### 3. Trunk-based Development（主干开发）

- 所有人在 \`main\`（trunk）上频繁提交（每天多次）。
- 短期 feature 分支（<1 天）或直接提交主干。
- 强依赖：CI、自动化测试、feature flag。
- 大厂（Google、Facebook）常用。

特点：

- 持续集成度最高。
- 适合大型团队 + 强工程能力。
- feature flag 控制未完成功能上线。

### 4. GitLab Flow

- \`main\` + 环境分支（\`production\`、\`staging\`、\`pre-prod\`）。
- 上游→下游：main → pre-prod → production。
- 适合需要部署到多个环境的项目。

## 对比

| | Git Flow | GitHub Flow | Trunk-based |
| --- | --- | --- | --- |
| 分支数 | 多 | 少（main + feature） | 极少（main 为主） |
| 发布周期 | 固定周期 | 频繁 | 持续 |
| 适合 | 版本化产品 | Web 应用 | 大型团队、CI 强 |
| 学习成本 | 高 | 低 | 中 |
| Hotfix | 单独分支 | main 直接修 | main 直接修 |

## 选择建议

- **Web/SaaS 应用**：GitHub Flow 或 Trunk-based。
- **移动端 / 桌面应用**：Git Flow（有版本化发布周期）。
- **大型团队、强 CI/CD**：Trunk-based + feature flag。
- **多环境部署**：GitLab Flow。

## 关键实践

1. **PR / MR 审核**：所有改动经 PR，至少 1-2 人审核。
2. **CI 卡点**：PR 必须通过 lint/test/build 才能合并。
3. **Squash merge**：保持 main 历史线性、清晰。
4. **小步快跑**：feature 拆小，快速合并。
5. **保护分支**：main 不允许直接 push，必须 PR。
6. **代码所有者（CODEOWNERS）**：关键路径自动指派审核人。
7. **feature flag**：未完成功能合并到 main 但默认关闭，逐步灰度。

## Commit 规范（Conventional Commits）

\`\`\`
<type>(<scope>): <subject>

feat(auth): add OAuth login
fix(api): handle null response
docs: update README
chore: bump deps
\`\`\`

类型：feat / fix / docs / style / refactor / test / chore / perf / build / ci。

配合 commitlint + commitizen 自动校验、生成 CHANGELOG、自动版本号。`
  },
  {
    id: 'eng-015',
    category: 'engineering',
    title: 'npm / yarn / pnpm 的区别？为什么推荐 pnpm？',
    difficulty: '中等',
    tags: ['包管理器', 'npm', 'yarn', 'pnpm'],
    answer: `## 三大包管理器

### npm

- Node 自带，最普及。
- v7+ 支持 workspaces、lockfile v2（与 yarn 格式接近）。
- 历史包袱：早期 v5 之前没有 lockfile、速度慢。

### yarn

- Facebook 2016 年推出，解决早期 npm 速度与一致性问题。
- yarn classic（v1）：仍是 JS 实现，广泛使用。
- yarn berry（v2+）：Plug'n'Play（PnP）模式，**不生成 node_modules**，直接从 zip 加载，速度更快、磁盘省。

### pnpm

- 设计核心：**硬链接 + 软链接**，全局 store + 项目级 node_modules。
- 节省磁盘空间、安装快、严格依赖（杜绝幽灵依赖）。
- Monorepo workspace 原生支持优秀。

## node_modules 结构对比

### npm / yarn classic：扁平化（hoisting）

\`\`\`
node_modules/
├── react/              # hoisted 到顶层
├── lodash/
└── my-dep/
    └── node_modules/
        └── (只有版本冲突时才放这)
\`\`\`

问题：

1. **幽灵依赖**：项目未声明但能 require 顶层依赖（因为被 hoist 上来）。
2. **重复安装**：不同子项目装同一包的多个版本，磁盘占用大。
3. **不确定性**：相同 package.json 在不同环境可能 hoist 出不同结构。

### pnpm：软链接结构

\`\`\`
node_modules/
├── .pnpm/                       # 真实存放处（硬链接到全局 store）
│   ├── react@18.0.0/
│   │   └── node_modules/
│   │       ├── react/           # 硬链接
│   │       └── lodash/          # 软链接到 .pnpm/lodash@4.17.21
│   └── lodash@4.17.21/
└── react/                       # 软链接到 .pnpm/react@18.0.0/...
\`\`\`

特点：

1. **真实依赖隔离**：只能 import package.json 里声明的包（无幽灵依赖）。
2. **硬链接全局 store**：所有项目共享 \`~/.pnpm-store\`，相同包只存一份。
3. **磁盘与安装速度大幅提升**。

### yarn PnP：无 node_modules

- 直接从 \`.yarn/cache/*.zip\` 加载模块。
- 需要工具支持（IDE、bundler）。
- 优势：极快、磁盘省。
- 劣势：生态兼容性仍有问题。

## 速度与磁盘

通常安装速度与磁盘占用：

\`\`\`
pnpm ≤ yarn berry(PnP) < yarn classic ≈ npm
\`\`\`

磁盘占用（多个项目用同依赖）：

\`\`\`
pnpm（共享 store，硬链接）<< yarn classic ≈ npm（每项目独立副本）
\`\`\`

## 功能对比

| | npm | yarn classic | yarn berry | pnpm |
| --- | --- | --- | --- | --- |
| lockfile | ✓ | ✓ | ✓ | ✓ |
| workspaces | ✓ | ✓ | ✓ | ✓（最佳） |
| 即时缓存 | 部分 | ✓ | ✓ | ✓ |
| 即插即用 PnP | ✗ | ✗ | ✓ | ✗ |
| 严格依赖 | ✗ | ✗ | ✓ | ✓ |
| 硬链接省磁盘 | ✗ | ✗ | ✓（zip） | ✓ |
| 安全（防幽灵依赖） | 弱 | 弱 | 强 | 强 |

## 为什么推荐 pnpm

1. **快**：硬链接避免重复下载与磁盘写入。
2. **省磁盘**：多项目共享 store，10 个项目用 react 只占一份空间。
3. **严格依赖**：消除幽灵依赖，让隐藏的依赖问题尽早暴露。
4. **monorepo 友好**：workspace 协议、过滤、并行安装体验好。
5. **生态兼容**：仍是标准 node_modules，IDE/工具零改动。

## 实践注意

1. 切换包管理器需删除 lockfile 与 node_modules 重新装。
2. pnpm 默认严格，老项目可能有幽灵依赖报错，可用 \`.npmrc\` 的 \`shamefully-hoist=true\` 临时缓解（不推荐长期）。
3. monorepo 用 \`pnpm-workspace.yaml\`，跨包引用用 \`workspace:*\`。
4. 锁定包管理器：\`package.json\` 加 \`"packageManager": "pnpm@9.x"\`，配合 corepack 强制团队统一。
5. CI 用 \`--frozen-lockfile\` 保证依赖一致性。`
  }
]
