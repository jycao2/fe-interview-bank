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
  },
  {
    id: 'eng-016',
    category: 'engineering',
    title: 'Vite 原理深度 vs Webpack 对比：依赖图、HMR、生产构建、生态完整对比？',
    difficulty: '困难',
    tags: ['Vite', 'Webpack', '构建原理', 'Rollup', 'esbuild'],
    answer: `## 一、架构本质差异

| 维度 | Webpack | Vite |
| --- | --- | --- |
| **开发期模式** | 打包式：从入口递归依赖 → 全量打包成 bundle → 启动 Dev Server | 按需 ESM：原生 ESM 按需加载 + 依赖预构建 + 按需转译 |
| **模块图** | webpack 自建 ModuleGraph，以 chunk 为单位 | 开发用浏览器 ESM Module Map + Node 侧依赖分析；生产 Rollup ModuleGraph |
| **冷启动瓶颈** | 依赖越多，打包越慢（分钟级） | 仅预构建依赖（秒级），业务模块 0 开销启动 |
| **HMR 粒度** | 修改模块 → 重新打包受影响 chunk → 替换 chunk | 修改模块 → 仅转译该模块 → 浏览器 ESM HMR 精准失效 |
| **生产构建** | webpack runtime + 自研打包算法 + Terser/esbuild 压缩 | Rollup（打包+tree-shaking 更优）+ Terser/esbuild 压缩 |

## 二、开发期流程对比

### Webpack 开发流程

\`\`\`
启动
  ↓
创建 Compiler、注册 Plugin/Loader
  ↓
从 entry 递归解析依赖（调 loader 转译每个文件）
  ↓
构建 ModuleGraph → 组装 chunks → 生成 bundle（内存中）
  ↓
webpack-dev-middleware 托管内存 bundle
  ↓
启动 WDS + WebSocket 监听 HMR
  ↓
浏览器请求 → 返回打包后的 bundle.js（含所有模块）
\`\`\`

### Vite 开发流程

\`\`\`
启动
  ↓
分析 entry / 扫描源码，收集 bare import（node_modules 依赖）
  ↓
esbuild 预构建依赖：CJS/UMD → ESM，合并多文件 → 输出 .vite/deps/
  ↓
启动 Koa 中间件 HTTP 服务（无打包）
  ↓
浏览器请求 index.html → 注入 HMR client
  ↓
浏览器 import './App.vue' → Vite server 拦截
  ↓
插件链按需转译 .vue/.tsx/.ts → 返回 ESM JS
  ↓
浏览器解析 import，递归请求依赖
\`\`\`

## 三、HMR 机制深度对比

### Webpack HMR

1. 文件变更 → webpack 重新编译受影响模块 → 生成 \`hash.hot-update.json\`（manifest） + \`hash.hot-update.js\`（代码）。
2. WDS 通过 WebSocket 推送 \`{hash, action: 'sync'}\`。
3. 浏览器 HMR Runtime 用 JSONP 拉 update chunk。
4. 调用 \`module.hot.accept\` 注册的回调。
5. 无 accept 冒泡到 entry → 整页刷新。

**问题**：大项目 chunk 打包本身就慢，HMR 更新延迟随项目增大而变长。

### Vite HMR

1. 文件变更 → Vite 用 Chokidar 监听。
2. 通过模块图（ESM graph）定位**精确受影响边界**：
   - 单文件模块 → 标记该模块为 invalid。
   - \`.vue\` SFC → 区分 template/script/style 分别失效。
   - CSS 模块 → 直接 style 替换（无需刷新）。
3. WebSocket 推送 \`{type: 'js-update'/'css-update', id, timestamp}\`。
4. 浏览器 HMR Client 收到后：
   - **import.meta.hot.accept** 回调重新请求该模块（HTTP 304 + ETag）。
   - 仅重新执行该模块及边界 accept 链。
5. 完全没有"打包 chunk"这一步，模块级精确更新。

**优势**：大项目（> 1000 模块）下 HMR 仍保持毫秒级，Webpack 可能数秒到几十秒。

## 四、代码分割与打包策略

### Webpack 核心能力

- \`SplitChunksPlugin\`：chunks/cacheGroups/priority/minSize/maxSize 精细控制。
- RuntimeChunk：独立 webpack runtime，避免业务改动影响 vendors hash。
- Module Federation / DllPlugin / Externals。

### Vite 核心能力

- 开发期**不做代码分割**，浏览器原生 ESM 已天然按需加载。
- 生产用 \`rollupOptions.output.manualChunks\`：
  \`\`\`js
  output: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom'],
      'ui-antd': ['antd']
    }
  }
  \`\`\`
- Rollup 代码分割能力更简洁，但复杂分包场景 Webpack 的 SplitChunks 生态更成熟。

## 五、Loader / Plugin 体系

| | Webpack | Vite |
| --- | --- | --- |
| **文件转换** | Loader（链式，最后往前），返回字符串/AST | Plugin（Rollup 风格钩子 + Vite 独有钩子） |
| **扩展能力** | Plugin（Compiler/Compilation 40+ 生命周期钩子） | Plugin：dev + build 统一 API，通用 Rollup 插件直接可用 |
| **通用性** | 仅 Webpack | Rollup 生态 + Vite 扩展，一套插件同时覆盖 dev/build |
| **典型插件** | HtmlWebpackPlugin、MiniCssExtractPlugin、BundleAnalyzer | @vitejs/plugin-vue/react/legacy，rollup-plugin-visualizer |

**学习曲线**：Vite 插件基于 Rollup + 少量扩展，比 Webpack 插件简单很多。

## 六、生态与兼容性

| 能力 | Webpack | Vite |
| --- | --- | --- |
| **存量生态** | 最丰富（十年级），各种 loader/plugin 齐全 | Rollup 插件 80% 可用，Vite 专用插件快速追赶 |
| **Module Federation** | webpack 原生，成熟 | \`@originjs/vite-plugin-federation\` 社区实现，兼容不错 |
| **微前端（qiankun）** | 完美 | 需要少量沙箱兼容配置（Vite 子应用需改 base） |
| **SSR** | Next.js（Webpack5）、自建 | Nuxt 3、SvelteKit、Astro 都基于 Vite；自建可用 vite-ssr |
| **老项目迁移** | 基准 | 有 webpack → vite 迁移插件（\`vite-plugin-webpack-import\`）、alias 几乎 1:1 |
| **框架支持** | 全部（Vue/React/Angular） | Vue/React/Preact/Svelte/Solid 一等公民，Angular 需社区插件 |

## 七、构建速度（实测数据，千级模块项目）

| 阶段 | Webpack 5 (cache: filesystem) | Vite 5 |
| --- | --- | --- |
| 首次冷启动 | 60-120s | 2-5s（取决于 esbuild 预构建依赖数） |
| 二次启动（缓存命中） | 10-20s | < 1s |
| HMR 更新 | 500ms - 5s（模块数越多越慢） | 20-100ms（几乎与项目规模无关） |
| 生产 build | 40-80s | 20-40s（Rollup + esbuild minify 并行） |

Vite 的速度优势在 1000 模块以上项目尤其明显。

## 八、生产产物质量

| 维度 | Webpack | Vite (Rollup) |
| --- | --- | --- |
| **Tree-shaking** | 好（ESM + sideEffects） | 更好（Rollup 静态分析更彻底） |
| **Runtime 开销** | 大（webpack runtime + async module map） | 小（原生 ESM 或简洁 iife） |
| **首屏产物** | 差不多 | 通常比 Webpack 小 5-15% |
| **Source Map** | 模式多（eval/cheap-module/...） | 类型略少但够用（hidden/inline 等） |
| **复杂分包** | 更强（SplitChunks 细粒度参数） | 够用，复杂场景需手动配置 manualChunks + 插件 |

两者 gzip 后差异不大，Rollup 对 ESM 的处理更干净。

## 九、典型场景选型建议

### 优先选择 Vite

- 新项目、SPA、组件库。
- 需要开发期快反馈（秒启动、ms 级 HMR）。
- Vue / React / Svelte / Solid 现代框架。
- SSR 新项目（Nuxt 3、Astro、SvelteKit）。
- Monorepo：配合 pnpm workspace。

### 仍然建议 Webpack

- 存量大型 Webpack 项目（迁移成本 > 开发收益）。
- 极复杂定制化构建（深度依赖特定 Plugin/Loader）。
- 重度依赖 Module Federation（等生态对齐后再换）。
- Angular 老项目（Angular 17+ 推荐 esbuild builder）。
- 企业内部基建完全基于 Webpack 且短期无法迁移。

## 十、迁移实践建议

Webpack → Vite 的常见迁移步骤：

\`\`\`
1. 删除 webpack 相关依赖，加 vite + @vitejs/plugin-vue/react
2. 新建 vite.config.js：映射 alias（与 webpack resolve.alias 一致）
3. index.html 移到项目根（Vite 把 index.html 当入口），改 %PUBLIC_URL% 为 import.meta.env.BASE_URL
4. 环境变量：从 process.env.XXX → import.meta.env.VITE_XXX（VITE_ 前缀才能暴露给前端）
5. 全局变量：webpack.DefinePlugin → vite define({ 'process.env.NODE_ENV': JSON.stringify(...) })
6. 特殊 Loader：
   - require.context → import.meta.glob/globEager
   - raw-loader → import xxx from '?raw'
   - url-loader → import xxx from '?url'
   - worker-loader → new URL('./worker.js', import.meta.url, { with: { type: 'worker' } })
7. SVG / 图片：asset 内置（无需 file-loader）
8. 跑 dev，逐一修复兼容问题
9. 跑 build，对比产物体积，修复 manualChunks
\`\`\`

大多数中小型 SPA 可在 1-3 天完成迁移。

## 总结

| | Vite | Webpack |
| --- | --- | --- |
| **核心哲学** | 原生 ESM，开发不打包，生产交给 Rollup | 全阶段打包，runtime 统一 |
| **速度** | 开发极快，HMR 与规模无关 | 开发慢，HMR 随项目恶化 |
| **生态深度** | 追赶中，够用 | 最深，极端场景优势 |
| **配置复杂度** | 简单，0 配置可用 | 复杂，全配 300+ 行常见 |
| **未来趋势** | 社区重心，现代框架首选 | 稳定维护，存量市场巨大 |

前端构建工具的演进方向：**开发用原生 ESM（Vite 模式），生产 Rollup 打包**，这是行业共识。除非有特殊存量包袱，新项目默认 Vite 是更省心的选择。`
  },
  {
    id: 'eng-017',
    category: 'engineering',
    title: 'ESBuild、SWC、Rolldown 深度解析：Rust/Go 构建工具原理与取舍？',
    difficulty: '困难',
    tags: ['esbuild', 'SWC', 'Rolldown', 'Rust', 'Go', '构建工具'],
    answer: `## 背景：为什么 JS 工具要重写

历史上 Babel、Webpack、Terser 都是 JS 实现，问题：

1. **语言瓶颈**：JS 单线程 + 解释执行，百万行代码项目需分钟级。
2. **摩尔定律结束**：CPU 主频不升，只能靠并行与底层语言。
3. **大项目痛点**：每次构建/TypeCheck 10 分钟，CI 流水线严重阻塞。

社区"RIIR（Rewrite It In Rust）/ Go 重写"成为趋势。三大代表：

| 工具 | 语言 | 作者/公司 | 定位 |
| --- | --- | --- | --- |
| **esbuild** | Go | Evan Wallace (Figma CTO) | 极速 bundler + minify + TS/JSX 转译 |
| **SWC** | Rust | Vercel 收购 | 编译器（Babel/TSC 替代）+ bundler（Turbopack） + minify |
| **Rolldown** | Rust | 字节跳动 / Rolldown 团队 | Rollup 的 Rust 重写（性能 10-100x） |
| **Biome** | Rust | Biome 团队 | Rome 后续，Lint/Format/TS 诊断一体 |
| **Turbopack** | Rust | Vercel（Next.js） | Webpack 精神继任者，增量 bundler |
| **Oxc** | Rust | 社区 | Parser/Linter/Minifier/Bundler 全栈套件 |

## esbuild（Go）深度解析

### 核心能力

1. **TS / JSX / 现代 JS 转译**：语法降级到 ES2015+。
2. **Bundler**：多入口 + 代码分割 + tree-shaking。
3. **Minifier**：压缩率接近 Terser，速度快 100x。
4. **插件系统**（JS/Go 两种）。

### 为什么这么快

| 设计点 | 说明 |
| --- | --- |
| **Go 语言** | 编译为机器码，无 JIT 预热；goroutine 廉价并行。 |
| **全并行** | 解析/绑定/打印全部阶段并行；Go runtime 调度 N 核 × goroutine。 |
| **无垃圾 GC 压力** | AST、字符串、Symbol 用 arena 批量分配，减少 GC。 |
| **统一内存布局** | AST 节点、Source map、String 都是紧凑结构体。 |
| **自己写 TS parser 极简实现** | 只做语法转换（不做类型检查，只剥离类型）。 |

### 基准测试（官方）

\`\`\`
转换 10 × three.js 生产包（≈ 57MB 源码）：
  esbuild:     0.37 秒
  Rollup + Terser: 36.14 秒   （约 100x 慢）
  Parcel 2:    24.35 秒
  Webpack 5:   49.50 秒
\`\`\`

### 适用场景

- Vite 依赖预构建（CJS → ESM）。
- Vite 开发期 .tsx/.ts 转译。
- 小型 CLI、库、Node 工具的单文件打包。
- 超快速 minify（生产可用）。

### 不适用场景

- 需要类型检查：esbuild 不检查 TS 类型，仍需 tsc。
- 复杂代码分割 / Module Federation：Rollup/Webpack 更成熟。
- CSS 处理、HMR、Dev Server：都比较弱或没有。
- 自定义插件生态弱于 Babel/Rollup。

## SWC（Rust）深度解析

SWC = **Speedy Web Compiler**，2023 年被 Vercel 收购。

### 三层架构

\`\`\`
┌─────────────────────────────────────────┐
│  上层能力（可独立使用）                   │
│  nextjs_swc / turbopack / deno_swc ...  │
├─────────────────────────────────────────┤
│  绑定层（swc_bundler / swc_minifier）    │
├─────────────────────────────────────────┤
│  核心层（Rust）                          │
│  swc_ecmascript(parser/ast/transforms)  │
│  swc_css / swc_html                      │
└─────────────────────────────────────────┘
\`\`\`

### 能力覆盖

| 能力 | 说明 |
| --- | --- |
| **TS/JSX/JS 编译** | 完整 Babel 替代（preset-env、react-jsx、decorators 等）。 |
| **Minifier**（@swc/core/minify） | 压缩率接近 Terser，速度 ~100x。 |
| **Bundler**（swc_bundler / Turbopack） | 内建树摇 + 代码分割 + HMR。 |
| **Node API / CLI / WASM** | 三种调用方式。 |
| **插件系统** | Rust 侧 trait + WASM 插件（实验性）。 |

### SWC vs Babel 兼容性

主流插件生态基本都有 SWC 实现：
- \`@swc/plugin-loadable-components\`
- \`@swc/plugin-styled-components\`
- \`@swc/plugin-emotion\`

极少数深度定制的 Babel 插件需要迁移（Rust 写或 WASM 插件）。

### Next.js 集成

Next.js 12+ 默认用 SWC 替换 Babel + Terser：
- 本地开发快 3 倍。
- 生产构建快 5 倍以上。
- Next.js 13+ App Router 深度耦合 Turbopack 实验版。

### Turbopack（Webpack 继任者）

- 基于 SWC bundler 内核 + 增量缓存架构。
- Next.js 15 已稳定（Vercel 自家生产使用）。
- 目标：大项目冷启动比 Webpack 快 10-700x。
- 目前定位 Next/Vite 级上层框架集成，暂不适合独立作为通用 bundler。

## Rolldown（Rust）深度解析

Rolldown 是 **Rollup 的 Rust 重新实现**，Rollup 团队官方背书，目标：

1. **100% Rollup 兼容**：同样的配置、同样的插件 API（JS plugin 可直接用）。
2. **性能 10-100x**。
3. **统一 Vite/Rollup 底层**：未来 Vite 生产构建可从 Rollup 切到 Rolldown，速度飙升。

### 架构：Rust 核心 + JS/TS FFI 绑定

\`\`\`
用户 JS 代码 (Vite / 直接调用)
  │
  ▼
Rolldown JS Binding (napi-rs / wasm)
  │
  ▼
Rust 内核
  ├─ oxc-parser: 解析 TS/JSX （借用 Oxc）
  ├─ resolver: 模块解析
  ├─ scanner: import/export 分析
  ├─ bundler: 模块图 / 打包 / tree-shaking
  ├─ plugin driver: 调用 JS plugin（FFI 桥）
  └─ codegen: 输出 + sourcemap
\`\`\`

### 性能数据（官方基准）

\`\`\`
构建 three.js 单入口 × 10
  Rollup (Node):     42.40s
  Rolldown (Rust):    1.70s   （约 25x 快）

构建 todomvc vue (100 modules)
  Rollup:     0.40s
  Rolldown:   0.05s   （约 8x 快）
\`\`\`

### 插件兼容性

Rolldown 设计时**主动兼容 Rollup 插件 API**：
- \`buildStart\`、\`resolveId\`、\`load\`、\`transform\`、\`generateBundle\` 等全部钩子一致。
- 现有 Rollup 插件（如 @rollup/plugin-node-resolve、visualizer）在迁移测试中 90%+ 可用。
- 性能注意：JS 插件调用需要 Rust↔JS FFI 开销，瓶颈时可改写为 Rust 原生插件。

### Roadmap 与意义

- Rolldown 稳定后，**Vite 生产构建可以切到 Rolldown**，冷启动和 HMR（Vite）+ 生产打包（Rolldown）全部是 Rust/Go 极速工具链。
- Vite 6 之后生产构建预计从分钟级降到秒级。

## 选型矩阵

| 场景 | esbuild | SWC | Rolldown | Turbopack |
| --- | --- | --- | --- | --- |
| **TS/JSX 转译（不检查类型）** | ✅✅ 首选 | ✅✅ 次选 | - | - |
| **Babel 生态兼容替换** | 部分 | ✅✅ 首选（插件多） | - | - |
| **Minify（代码压缩）** | ✅ 快，压缩率稍低 | ✅ 快，压缩率接近 Terser | - | ✅ |
| **小项目打包（CLI/库）** | ✅✅ 首选 | 可用 | 可用 | 重 |
| **Rollup 替换（Vite 生产）** | 功能不足 | 不做 bundler | ✅✅ 未来最佳 | 不兼容 |
| **Webpack 替换（大型 SPA）** | 不够成熟 | 生态中 | 不兼容 | ✅ Next.js 首选 |
| **Next.js 项目** | 可用 | ✅✅ 默认 | - | ✅ 最新版本内置 |
| **自定义插件深度** | 弱（Go/JS） | 中（Rust/WASM） | 强（Rollup 生态） | 强（Rust） |

## 工程化落地建议

### 1. 新项目（Vite 栈）

- 开发期：Vite → **esbuild** 做依赖预构建 + TS 转译。
- 生产压缩：Vite \`build.minify: 'esbuild'\` 够用；极限压缩率再切 Terser。
- 关注 Rolldown 进展：稳定后替换 Rollup 生产构建即可提速数倍。

### 2. 新项目（Next.js 栈）

- 直接默认配置：**SWC**（转译+压缩）+ **Turbopack**（实验性 bundler）。
- 老 Babel 配置迁移到 \`next.config.js\` 的 \`experimental.swcPlugins\`。

### 3. 存量 Webpack 项目

- 不建议立刻换 bundler：
  1. 先把 Babel → SWC（\`swc-loader\`），立刻拿到 10-30x 编译提速。
  2. Terser → \`esbuild-loader\` minify，压缩再提速。
  3. cache: filesystem 缓存构建结果。
  4. 稳定后再评估 Vite 或 Next.js Turbopack 大迁移。

### 4. 类型检查始终保留

\`\`\`json
// package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc --noEmit && vite build"
  }
}
\`\`\`

esbuild / SWC 都**不做类型检查**，CI 单独跑 tsc。

### 5. 避免过度迁移

- 小项目（< 50 模块）工具链不是瓶颈，不必追新。
- 需要极致兼容 Babel 插件的老项目，先测迁移成本，可能反而不划算。

## 未来趋势

- **全 Rust 工具链**：Oxc/Rolldown/SWC/Biome 正在吞噬原来 JS 工具的生态。
- **Rust 内核 + JS 插件**：平衡性能（Rust 计算密集）+ 灵活（JS 自定义插件）。
- **统一接口（Rollup Plugin Standard）**：Rolldown/Vite/Rollup 共用一套插件体系。
- 5 年内，大部分主流前端工具（打包/编译/lint/格式化/minify）都会是 **Rust/Go 底层 + Node/TS 插件层**。`
  },
  {
    id: 'eng-018',
    category: 'engineering',
    title: '微前端方案对比：qiankun、Module Federation、wujie、Garfish 架构与选型？',
    difficulty: '困难',
    tags: ['微前端', 'qiankun', 'Module Federation', 'wujie', 'Garfish'],
    answer: `## 为什么需要微前端

微前端把巨型前端应用拆成若干**独立交付、独立部署、独立技术栈**的子应用，组合成统一用户体验。

典型驱动：
- 大型 B 端系统（几百人团队协作）。
- 不同业务用不同技术栈（旧 Angular + 新 React/Vue）。
- 存量系统渐进式重构（替换模块而非重写）。
- 多团队并行，减少发布耦合。

## 四大主流方案总览

| 方案 | 实现思路 | 核心原理 | 沙箱 | 样式隔离 | 代表用户 |
| --- | --- | --- | --- | --- | --- |
| **qiankun**（阿里） | 路由级微前端 | single-spa + HTML entry + import-html-entry | JS 沙箱（proxy/snapshot） | Scoped CSS / strictStyleIsolation | 蚂蚁、字节内部、阿里系 |
| **Module Federation**（Webpack/Zack Jackson） | 构建期模块共享 | Webpack 运行时：远程模块通过 HTTP 动态 import | 无沙箱（同源同全局） | 无原生隔离，需自己处理 | 字节、腾讯、京东 |
| **wujie**（腾讯） | Web Components + iframe | Shadow DOM + iframe 做 JS 沙箱 | iframe 天然沙箱 | Shadow DOM 天然隔离 | 腾讯、美团、京东 |
| **Garfish**（字节跳动） | 微应用框架 | HTML entry + 虚拟模块 + 沙箱隔离 | JS Context 隔离 + 快照 | Scope CSS + 严格模式 | 字节、抖音电商 |

## 方案深度解析

### 一、qiankun（single-spa 增强）

#### 架构

\`\`\`
主应用（基座）
  ├─ qiankun 核心：registerMicroApps / start()
  │    ├─ 路由匹配（URL → 子应用）
  │    ├─ import-html-entry：请求子应用 HTML，抽取 JS/CSS
  │    ├─ 沙箱：执行子应用 JS 在沙箱环境
  │    └─ 挂载/卸载：子应用 mount() / unmount()
  └─ 子应用 A/B/C：任意技术栈（Vue/React/Angular）
       ├─ 生命周期：bootstrap → mount → unmount
       └─ 打包配置：输出 HTML entry + library 配置
\`\`\`

#### 两大 Entry 模式

| 模式 | 说明 | 优缺点 |
| --- | --- | --- |
| **HTML Entry（推荐）** | 主应用请求子应用 \`index.html\`，解析出 JS/CSS 执行 | 子应用独立开发/部署，0 耦合，支持独立访问 |
| JS Entry | 主应用直接配置子应用 JS URL | 子应用需额外维护导出 manifest，耦合高 |

#### 三种 JS 沙箱

1. **LegacySandbox（单实例，快照）**：diff window，卸载时回滚 → 兼容性好但只支持单实例。
2. **ProxySandbox（多实例 Proxy）**：Proxy 代理 fakeWindow，多实例同时跑无冲突。
3. **StrictIsolationSandbox（严格隔离）**：新增 iframe 做 window 隔离 → 最安全但通信开销大。

#### 样式隔离方案

1. **默认**：子应用样式注入主应用，靠约定（BEM、前缀）避免冲突。
2. **experimentalStyleIsolation**：Shadow DOM 包裹子应用 DOM → 天然隔离，但弹窗/dropdown 穿透到 body 会丢样式。
3. **严格 postcss 插件**：自动加 \`[data-qiankun-app=xxx]\` 前缀。

#### 通信

- Props 下发（主→子）。
- Actions 全局状态库（qiankun 自带 initGlobalState）。
- 自定义 EventBus / window.dispatchEvent。
- localStorage/sessionStorage（跨子应用）。

#### 优缺点

✅ 优点：
- 国内生态最成熟，文档/案例多。
- HTML Entry 接入成本低，任意技术栈无缝。
- 沙箱/样式隔离方案较完整。
- 主应用和子应用可以独立开发/部署。

⚠️ 缺点：
- JS 沙箱 Proxy 虽然完善，但部分原生 API（定时器、全局变量、iframe 通信）仍需白名单处理。
- 子应用 publicPath、路由 base、静态资源路径必须配置规范，否则容易出 404。
- 主子应用同域需要处理跨子应用登录态、Cookie、资源。

---

### 二、Module Federation（MF）

#### 架构（Webpack 5 原生能力，Vite 有社区插件）

\`\`\`
Host（主应用）             Remote（子应用）
  ┌─ exposes: [无]           exposes: { './Button', './App' }
  ├─ remotes: {              remotes: { ... }
  │   'appA': 'appA@http://cdn/appA/remoteEntry.js'
  │  }
  └─ shared: ['react', 'vue']  // 公共依赖去重共享
\`\`\`

#### 核心概念

| 能力 | 说明 |
| --- | --- |
| **exposes** | 我暴露给其他应用的模块。 |
| **remotes** | 我从哪些远程应用消费模块。 |
| **shared** | 依赖共享（react、vue、lodash 等，单例+版本校验）。 |
| **remoteEntry** | 每个 remote 生成的 manifest JS（十几 KB），描述哪些模块可加载。 |

消费方式跟本地 import 一模一样：

\`\`\`js
// Host：像本地模块一样引入
import('appA/Button').then(mod => {
  render(mod.default)
})
// 实际：Webpack runtime 异步请求 appA 的 remoteEntry → 再请求对应 chunk
\`\`\`

#### 特点：**运行时动态模块共享**

MF 不是"微应用"而是"微模块"：
- 可以消费一个按钮。
- 也可以消费一整个页面（App 根组件）→ 当路由微前端用。
- 也可以 Host ↔ Remote 相互消费模块（双向依赖、循环依赖）。

#### Shared 去重策略

多个 remote 都 expose react，Webpack 在运行时选：
1. 符合 semver 最高版本。
2. 配置 singleton 时强制全局单例。
3. 冲突时 fallback 到各自版本。

#### 优缺点

✅ 优点：
- **模块级共享**：比路由级更细粒度，可以精确到组件级复用。
- Webpack 5 原生能力，无额外 runtime 依赖（除 runtime 本身）。
- 共享依赖自动去重，没有 qiankun 那种重复注入 react/vue。
- 部署解耦：remote 更新只需发布自己，host 不用重启。
- Vite 支持：\`@originjs/vite-plugin-federation\`。

⚠️ 缺点：
- **无原生沙箱/样式隔离**：子应用代码直接在主应用 window 执行，JS/样式冲突靠约定。
- 耦合 Webpack（或 MF 插件）：所有应用必须是同类型构建工具 + 同版本。
- 版本问题：shared 的版本不兼容时运行时报错。
- 公共库升级需要多应用协调。
- 监控、错误边界、路由元信息需要自己封装一套上层框架。

---

### 三、wujie（Web Components + iframe）

腾讯出品，核心设计：**"Web Components 做样式隔离，iframe 做 JS 沙箱"**。

#### 架构

\`\`\`
主应用
  └─ <wujie-app name="xxx" url="http://sub-app/" />  // 自定义元素（Shadow DOM）
        ├─ Shadow DOM Root：承载子应用 DOM → 样式 100% 隔离
        └─ hidden iframe：承载子应用 JS 执行
             │  JS 在 iframe 的独立 window 运行
             └─ 操作 DOM：同步 proxy 到上层 Shadow DOM
\`\`\`

关键点：
- **JS 沙箱 = iframe window**：天然隔离，定时器、全局变量、fetch 都在 iframe 内，卸载即销毁，无 Proxy 白名单问题。
- **样式 = Shadow DOM**：\`<style>\` 注入到 shadow root，主应用样式不穿透进来，子应用样式不泄漏出去。
- **DOM 渲染在宿主**：实际显示在主应用页面，不是 iframe 的视图（无 iframe 滚动问题）。

#### 优缺点

✅ 优点：
- **最严格的 JS 沙箱**：iframe 天然隔离，兼容老代码（jQuery 时代全局污染也能跑）。
- **最严格的样式隔离**：Shadow DOM 没有任何样式互相污染。
- 接入简单：基本不需要改子应用构建配置。
- 多实例并行：完全没问题。

⚠️ 缺点：
- iframe 自身开销：每个子应用一个 iframe（虽然是 hidden），内存占用比 Proxy 沙箱高。
- 主/子应用通信跨 iframe：需要 postMessage，wujie 做了封装，但仍比 Proxy 慢。
- 浏览器 API 一致性：某些全局对象（如 PerformanceObserver、ResizeObserver）需在宿主和 iframe 之间做代理。
- input、弹层、拖拽等有时遇到 iframe 边界行为怪异。
- 生态略小于 qiankun。

---

### 四、Garfish（字节）

综合了 qiankun（HTML Entry 易用）和 MF（模块共享）的优点，定位是**工业级微前端框架**。

#### 核心特性

| 能力 | 说明 |
| --- | --- |
| HTML Entry | 同 qiankun，子应用独立部署。 |
| JS 沙箱 | VM 上下文 + 快照（比 Proxy 方案更严格）。 |
| 样式隔离 | Scope + 严格模式双模式。 |
| 虚拟模块（模块共享） | 主/子 app 之间共享组件 / 工具，避免重复打包。 |
| 资源预加载 | 基于路由空闲预取子应用资源，降低切屏白屏。 |
| 数据采集 | 内建性能/错误埋点上报钩子。 |
| 安全性 | CSP、黑名单 API 可配置。 |

#### 通信与状态

- Props 注入（主→子）。
- Store 插件（全局状态，类 Vuex/Pinia API）。
- EventBus。

Garfish 更像"企业级全家桶"，把共享模块、监控、预加载、安全统一封好。

## 方案选型矩阵

| 维度 | qiankun | Module Federation | wujie | Garfish |
| --- | --- | --- | --- | --- |
| **架构粒度** | 应用/路由级 | 模块级（组件到页面） | 应用/路由级 | 应用级 + 模块级 |
| **接入成本** | 中（改子应用打包 + 生命周期） | 中（改 webpack/vite MF 配置） | 低（子应用基本零改） | 中（与 qiankun 接近） |
| **JS 沙箱** | 好（Proxy/快照） | 无（同全局） | 最佳（iframe） | 好（VM Context） |
| **样式隔离** | 中（Shadow DOM/前缀） | 无 | 最佳（Shadow DOM） | 好（Scope + 严格） |
| **模块共享** | 弱（只能全局挂 window） | 强（构建期 shared + 运行时） | 弱 | 中（虚拟模块） |
| **多技术栈兼容** | 完美（任意栈） | 同构建工具限制 | 完美 | 完美 |
| **生态/资料** | 最丰富 | 中（英文资料多） | 中 | 少（主要字节系） |
| **监控/埋点** | 需自建 | 需自建 | 需自建 | 内建钩子 |
| **跨子应用调试** | 中 | 弱（模块边界散） | 中 | 好 |
| **独立子应用访问** | ✅ | ❌（模块级，不能直接） | ✅ | ✅ |

## 典型场景推荐

### 场景 1：大型 B 端系统，多团队，技术栈混合（Vue2 + React + Angular）

→ **qiankun** 或 **Garfish**。HTML Entry 低耦合接入、生命周期规范好，团队文档多。

### 场景 2：中后台 + 组件库希望跨应用运行时共享（不同团队各自发布组件，相互引用）

→ **Module Federation**。天然模块级共享，跨团队复用组件/页面。

### 场景 3：老系统（含历史 jQuery/全局污染严重的脚本）要嵌入新平台

→ **wujie**。iframe 沙箱天然兜住老代码的全局污染问题。

### 场景 4：集团级统一基建，需要监控/权限/灰度/多团队协作全链路

→ **Garfish**（字节经验） 或 在 **qiankun** 之上封装上层平台。

### 场景 5：微前端 + Monorepo + 极致共享

→ **Module Federation + Monorepo (pnpm workspace + Turbo)**。同一仓库内各 app 通过 MF 相互消费模块，开发体验最优。

## 通用落地建议

### 1. 通信 & 状态设计原则

- 主→子：Props 下发配置（token、菜单、主题、路由 base）。
- 子→主：EventBus / Callbacks 回传事件（标题、面包屑、跳转）。
- 共享状态：**越少越好**。跨子应用全局状态（用户、权限、主题）集中在主应用 Pinia/Redux，子应用不要直接操作。

### 2. 部署解耦

- 每个子应用独立域名（\`app-a.example.com\`）或独立目录，支持独立部署。
- 跨域必须配好 CORS。图片/字体等静态资源必须走绝对 URL。
- 子应用打包配置：publicPath 要能动态拼接（qiankun 有 API）。

### 3. 路由规范

- 主应用分配路由命名空间：/a/* → 子应用 A，/b/* → 子应用 B。
- 子应用路由 base 必须设为命名空间，否则刷新 404。
- 跨应用跳转统一走主应用 router.push()，避免硬编码。

### 4. 性能

- 预加载：首屏空闲时 prefetch 常用子应用资源（qiankun prefetchApp、Garfish 配置）。
- 子应用按需拆包：首屏只 mount 一个 chunk。
- 公共依赖用 CDN 外链（或 Garfish/MF 的共享能力），避免重复打包 react/vue 10 份。

### 5. 常见坑清单

- 子应用打包 UMD 模式、生命周期导出正确。
- 子应用 publicPath 动态注入（不要写死）。
- 路由模式：主应用 history，子应用也 history，注意 base 一致。
- 样式：全局样式（reset、字体）只在主应用打一份，子应用避免重复引入。
- 弹层挂到 body 会逃出 qiankun 的 Shadow DOM，需要配置 container 回传。
- 监控：子应用错误必须冒泡到主应用统一上报（window.onerror + 框架 errorHandler）。

## 总结

微前端没有银弹。**架构选择本质是权衡：接入成本 × 隔离强度 × 共享能力 × 生态成熟度**。

- 团队小、系统不复杂（< 5 子应用） → 可能根本不需要微前端，SPA + Monorepo 更简单。
- 需要强隔离 + 历史遗留多 → **wujie**。
- 需要模块共享 + 同构建工具栈 → **Module Federation**。
- 需要最多资料 + 任意技术栈通用 → **qiankun**。
- 企业级全家桶 + 字节生态 → **Garfish**。`
  },
  {
    id: 'eng-019',
    category: 'engineering',
    title: '代码规范体系建设：ESLint/Prettier/TS + Husky + CI 的完整工程化闭环？',
    difficulty: '中等',
    tags: ['代码规范', 'ESLint', 'Prettier', 'Husky', 'commitlint'],
    answer: `## 规范体系的目标

规范不是"写一份 Markdown 放 wiki"，而是**工程化 + 自动化闭环**：
- **本地写代码时**：编辑器即时提示，保存自动格式化。
- **Git 提交时**：自动 lint + 格式化 + commit message 校验，不通过拦截提交。
- **PR 合并时**：CI 跑 lint/test/build，门禁拦截。
- **运行时**：TypeScript 类型 + 框架规则提前暴露错误。

最终目标：低级错误 0 人工评审，团队代码风格一致如一人。

## 完整工具链全家福

\`\`\`
  Editor (VS Code)           Git Hooks            CI (PR)
       │                        │                   │
  ┌────┴────┐              ┌────┴────┐         ┌────┴────┐
  │ESLint   │──fix────────▶│ Husky   │  lint  │ESLint   │
  │Stylelint│ 格式化       │  +      │─format▶│Stylelint│
  │Prettier │              │lint-staged│      │TSC      │
  │TS 语言服务│             │  +      │  type  │Test     │
  └────┬────┘              │commitlint│ check │Build    │
       │                   └────┬────┘         └────┬────┘
       │                        │                   │
  开发者即时反馈         提交时拦截，本地过      合并前最终兜底
\`\`\`

## 第 1 层：代码格式（Prettier + EditorConfig）

统一"空格/引号/换行/分号/尾逗号"等纯格式问题。

### .prettierrc

\`\`\`json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "all",
  "arrowParens": "always",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": false
}
\`\`\`

### .prettierignore

\`\`\`
dist
node_modules
package-lock.json
pnpm-lock.yaml
*.min.js
\`\`\`

### EditorConfig（跨编辑器统一）

\`\`\`ini
# .editorconfig
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
[*.md]
trim_trailing_whitespace = false
\`\`\`

> 格式类规则**全交给 Prettier**，ESLint/Stylelint 只管逻辑，避免冲突。
> 配置：\`eslint-config-prettier\` + \`stylelint-config-prettier\` 关闭冲突规则。

## 第 2 层：静态检查（ESLint + Stylelint）

### ESLint（JS/TS/Vue/React）

#### 典型配置

\`\`\`js
// eslint.config.js (Flat Config, Vite/TS 推荐)
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,   // 放最后，关闭与 prettier 冲突的规则
  {
    languageOptions: {
      parserOptions: { parser: tseslint.parser, ecmaVersion: 'latest' }
    },
    rules: {
      // TS 严格
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // 最佳实践
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      // Vue 规范
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn'
    },
    ignores: ['dist/**', '*.config.*']
  }
]
\`\`\`

#### 常见插件搭配

| 场景 | 插件 |
| --- | --- |
| Vue 3 | \`eslint-plugin-vue\` + Vue 官方 flat config |
| React | \`eslint-plugin-react\` + \`eslint-plugin-react-hooks\` + \`eslint-plugin-react-refresh\` |
| TS | \`typescript-eslint\`（\`@typescript-eslint/parser\` + rules） |
| 导入规范 | \`eslint-plugin-import\`（顺序、循环依赖） / \`eslint-plugin-simple-import-sort\` |
| a11y | \`eslint-plugin-jsx-a11y\`（可访问性） |
| Unicorn | \`eslint-plugin-unicorn\`（更多实用规则） |
| 未使用导入 | \`eslint-plugin-unused-imports\`（自动 fix） |

#### .vscode/settings.json（团队共享）

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit",
    "source.organizeImports": "never"
  },
  "eslint.validate": ["javascript", "typescript", "vue", "html"]
}
\`\`\`

把 settings.json 和 .vscode/extensions.json 放到仓库，新成员 clone 后自动推荐插件。

### Stylelint（CSS/SCSS/Vue 样式）

\`\`\`js
// stylelint.config.js
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',  // CSS 属性顺序（推荐）
    'stylelint-config-recommended-vue/scoped',
    'stylelint-config-prettier'       // 避免与 prettier 冲突
  ],
  rules: {
    'selector-class-pattern': null,   // 可按团队 BEM/命名约定调整
    'no-descending-specificity': null
  }
}
\`\`\`

## 第 3 层：类型安全（TypeScript）

TS 既是开发时语言服务，也是 CI 中的"类型门禁"。

### tsconfig 严格模式推荐

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src", "vite.config.*"]
}
\`\`\`

开启 \`strict: true\` 相当于一次性打开 10+ 条严格规则，收益最大。

### 类型门禁命令

\`\`\`json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint . && stylelint \"src/**/*.{css,vue,scss}\"",
    "format": "prettier --write .",
    "lint:all": "pnpm typecheck && pnpm lint"
  }
}
\`\`\`

## 第 4 层：Git 提交拦截（Husky + lint-staged + commitlint）

> 保证"**提交到仓库的代码必须是规范的**"，把问题挡在本地。

### 安装

\`\`\`bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
pnpm exec husky init
\`\`\`

### .husky/pre-commit

\`\`\`bash
# 只对暂存区文件执行 lint + format + typecheck（轻量）
pnpm exec lint-staged
\`\`\`

### lint-staged.config.js

\`\`\`js
export default {
  // JS/TS/Vue/React：先 ESLint 修复，再 Prettier 格式化
  '*.{js,ts,vue,tsx,jsx}': ['eslint --fix', 'prettier --write'],
  // CSS/SCSS：Stylelint 修复 + Prettier
  '*.{css,scss,vue}': ['stylelint --fix', 'prettier --write'],
  // Markdown/JSON 等纯格式
  '*.{md,json,yml,yaml}': ['prettier --write'],
  // 全量类型检查（改动 TS/Vue 才跑，可选）
  '*.{ts,vue,tsx}': () => 'tsc --noEmit'
}
\`\`\`

### commitlint.config.js（规范 commit message）

\`\`\`js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'perf', 'refactor', 'docs',
      'test', 'chore', 'build', 'ci', 'style', 'revert'
    ]],
    'subject-case': [0],
    'header-max-length': [2, 'always', 120]
  }
}
\`\`\`

### .husky/commit-msg

\`\`\`bash
pnpm exec commitlint --edit "$1"
\`\`\`

### Conventional Commits 规范速查

\`\`\`
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>

feat(auth): add OAuth login   # 新功能
fix(api): handle null response when offline  # 修复 bug
perf(list): virtual scroll, render 10x faster  # 性能优化
refactor(router): extract route guards  # 重构，无功能变化
docs: update README with dev guide
test(login): add e2e happy path
chore(deps): bump vite from 5 to 6
build: adjust rollup manualChunks
ci: add size-limit step to workflow
style: fix ESLint warnings
revert: revert "feat: xxx"
\`\`\`

> 自动化收益：commit 规范后可以
> - 自动生成 CHANGELOG（\`standard-version\` / \`changesets\`）。
> - 自动打语义化版本号（feat=minor，fix=patch，breaking=major）。
> - 自动触发发布流水线。

## 第 5 层：CI 门禁（GitHub Actions 示例）

\`\`\`yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  lint-typecheck-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile

      # 1. 代码规范
      - name: Lint
        run: pnpm lint

      # 2. 类型检查
      - name: TypeScript Check
        run: pnpm typecheck

      # 3. 单元测试
      - name: Unit Test (Vitest)
        run: pnpm test:run --coverage

      # 4. 构建
      - name: Build
        run: pnpm build

      # 5. 体积门禁（可选）
      - name: Size Limit
        run: npx size-limit
\`\`\`

**PR 不通过不能合并**，保护分支（Branch Protection）打开：
- Require status checks to pass before merging。
- Require branches to be up to date before merging。

## 第 6 层：团队规范与文档

技术工具之外，还需要轻量约定：

1. **命名约定**（README/CONTRIBUTING）：
   - 组件：PascalCase（UserCard.vue）。
   - 工具函数：camelCase（formatDate.ts）。
   - 常量：UPPER_SNAKE_CASE（MAX_PAGE_SIZE）。
   - Hooks：use 开头（useDebounce）。
   - 自定义事件名：Vue kebab-case，React onXxx 命名。

2. **目录结构**（团队模板一致）：
   \`\`\`
   src/
     components/        公共组件
     pages/             页面
     stores/            Pinia/Redux
     composables/       hooks
     utils/             工具函数
     api/               接口层
     assets/            静态资源
   \`\`\`

3. **接口层规范**：统一 request 封装（拦截器、错误处理、类型）。
4. **组件设计原则**：props 尽量完整 + TS 类型，单职责。
5. **注释规范**：复杂逻辑必须注释，JSDoc 公共 API。
6. **CHANGELOG / releases.md**：版本发布后自动生成。

## 常见落地陷阱

| 陷阱 | 对策 |
| --- | --- |
| 规则太严 → 团队抵触 | 渐进接入：先 warn 不 error，跑 2 周再升级；禁用争议规则 |
| 规则与项目实际不符 | 定制本地 rules，不要盲目抄 airbnb 全套 |
| lint-staged 跑 typecheck 太慢 | 把 typecheck 挪到 CI，本地只 lint/format |
| 老项目一次性接入报错几千条 | eslint-nibble 按文件逐步修复 / 分模块改 |
| VS Code 本地和命令行 lint 结果不一致 | 统一 ESLint 版本 + workspace settings |
| 成员关了编辑器 lint | CI 兜底，不规范提交被 CI 拦截 |
| 提交不规范 → 合入乱码 | commitlint + squash merge 到主线保持线性 |

## 验证闭环是否跑通

- [ ] 新成员 clone 项目后，按 README 一条命令就能跑 dev。
- [ ] 保存文件自动格式化 + ESLint 修复。
- [ ] 提交不规范 commit 被拦截。
- [ ] 提交 lint 错误文件被拦截。
- [ ] PR typecheck/lint/test 任意失败不可合并。
- [ ] 发布自动出版本号 + CHANGELOG。

做到这几条，规范才算"体系化落地"，而不是一份文档。`
  },
  {
    id: 'eng-020',
    category: 'engineering',
    title: 'PWA 核心能力：Service Worker、离线缓存、Manifest、推送与安装体验？',
    difficulty: '中等',
    tags: ['PWA', 'Service Worker', '离线', 'Web App Manifest', '推送'],
    answer: `## PWA 定义

Progressive Web App = **渐进式 Web 应用**，通过标准 Web API 赋予网页 Native App 级体验：
- 可安装到桌面/主屏，独立窗口打开。
- 离线可用（弱网/断网照样打开）。
- 后台消息推送。
- 秒开启动、操作流畅。
- 渐进增强：非 PWA 浏览器仍是普通网站。

Google 的三大硬性指标（安装 PWA 的门槛）：
1. **HTTPS**（或 localhost）。
2. **有效的 Web App Manifest**。
3. **已注册可工作的 Service Worker**，至少提供离线 fallbacks。

## 核心能力 1：Web App Manifest（安装描述）

\`/manifest.webmanifest\`（或 .json）描述应用元信息：

\`\`\`json
{
  "name": "我的待办",
  "short_name": "待办",
  "description": "优雅的跨端待办 PWA",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#111827",
  "theme_color": "#6366f1",
  "orientation": "portrait",
  "lang": "zh-CN",
  "dir": "ltr",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "shortcuts": [
    { "name": "新建任务", "url": "/new", "icons": [{ "src": "/icons/new.png", "sizes": "96x96" }] },
    { "name": "今日视图", "url": "/today", "icons": [{ "src": "/icons/today.png", "sizes": "96x96" }] }
  ],
  "categories": ["productivity", "utilities"]
}
\`\`\`

### 关键字段

| 字段 | 说明 |
| --- | --- |
| \`display: standalone\` | 独立窗口，无浏览器地址栏（最像 App）。其他：\`minimal-ui\`、\`fullscreen\`、\`browser\` |
| \`start_url\` | 从桌面图标启动时打开的 URL（建议加 UTM 区分来源） |
| \`scope\` | PWA 作用的 URL 范围，超出范围回落到浏览器 |
| \`icons\` + **maskable** | Android 适配不同形状图标（圆形、方形、水滴），必须提供 maskable 图标 |
| \`shortcuts\` | 桌面长按应用图标弹出快捷入口（Android） |
| \`theme_color\` | 状态栏/地址栏颜色，配合 CSS \`theme-color\` meta |

### 注入方式

\`\`\`html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#6366f1">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
\`\`\`

苹果 iOS/iPadOS 有一套私有 meta，需要单独配置才能完美安装。

## 核心能力 2：Service Worker（网络代理 + 缓存引擎）

Service Worker 是**运行在独立线程、可拦截所有请求、持久离线工作**的特殊 Worker。

生命周期：

\`\`\`
注册(register)
  └─ installing（install 事件）
       ├─ 预缓存关键资源
       └─ skipWaiting() 立即生效
  └─ waiting → 所有旧 tab 关闭后才激活（防止版本错乱）
  └─ activating（activate 事件）
       └─ 清理旧缓存版本
  └─ activated（开始拦截 fetch / sync / push）
       ├─ fetch：拦截请求，从缓存/网络/合成返回
       ├─ sync：后台同步
       └─ push：推送消息
\`\`\`

### 注册

\`\`\`js
// main.js（在主线程）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => console.log('SW 注册成功', reg.scope))
      .catch(err => console.error('SW 注册失败', err))
  })
}
\`\`\`

### 5 种经典缓存策略

| 策略 | 逻辑 | 适用资源 | 代码示意 |
| --- | --- | --- | --- |
| **Cache First**（缓存优先） | 有缓存就返回，没有才走网络 | 静态资源（JS/CSS/图片/字体，带 hash 长期缓存） | caches.match(e.request) \|\| fetch(e.request) 并缓存 |
| **Network First**（网络优先） | 先网络请求，成功并缓存，失败回退缓存 | 接口数据、经常变动的 HTML | fetch 成功写缓存，catch 返回缓存 |
| **Stale While Revalidate**（缓存+后台更新） | 立即返回缓存，同时后台请求更新下一次用 | 折衷方案：非关键接口、统计数据 | 同时返回缓存 + 异步更新 |
| **Network Only**（只用网络） | 永远走网络，失败就挂 | 敏感操作（付款、提交表单） | 直接 fetch |
| **Cache Only**（只用缓存） | 只在 SW install 时预缓存 | 离线首屏壳资源 | caches.match |

#### Cache First 实现

\`\`\`js
// sw.js
const CACHE = 'static-v1'
const PRECACHE = ['/', '/index.html', '/assets/main.js', '/assets/style.css']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  // 清理旧缓存版本
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  // GET 请求才缓存
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // 同源静态资源：Cache First
  if (url.origin === location.origin && req.destination !== '') {
    e.respondWith(
      caches.match(req).then(cached => cached || (async () => {
        const res = await fetch(req)
        const copy = res.clone()
        caches.open(CACHE).then(c => c.put(req, copy))
        return res
      })())
    )
    return
  }

  // 接口 GET：Stale While Revalidate
  if (req.headers.get('accept')?.includes('application/json')) {
    e.respondWith(
      caches.match(req).then(async cached => {
        const network = fetch(req).then(res => {
          const copy = res.clone()
          caches.open('api-v1').then(c => c.put(req, copy))
          return res
        }).catch(() => cached)
        return cached || network
      })
    )
  }
})
\`\`\`

### Workbox（Google 官方库，别自己造 SW）

手写 SW 易出错，用 \`workbox\` 或 Vite 插件 \`vite-plugin-pwa\`：

\`\`\`bash
pnpm add -D vite-plugin-pwa
\`\`\`

\`\`\`js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'
export default {
  plugins: [VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt'],
    manifest: { /* 前面 manifest 内容 */ },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === 'https://cdn.example.com',
          handler: 'CacheFirst',
          options: { cacheName: 'cdn', expiration: { maxEntries: 200, maxAgeSeconds: 30*24*3600 } }
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'images', expiration: { maxEntries: 50 } }
        }
      ]
    }
  })]
}
\`\`\`

### SW 更新策略

| 模式 | 说明 |
| --- | --- |
| prompt | 检测到新版 SW 时提示用户"点击刷新"（推荐，避免打断操作） |
| autoUpdate | 下载后自动 skipWaiting + reload（内部系统可用） |

## 核心能力 3：离线数据能力

### 接口离线策略（Navigation Preload + Background Sync）

1. **导航预加载**：service worker 启动前就开始发请求，减少 SW 启动开销。
   \`\`\`js
   self.addEventListener('activate', e => {
     e.waitUntil(self.registration.navigationPreload.enable())
   })
   \`\`\`

2. **Background Sync**：用户离线提交表单 → SW 登记 sync 标签 → 联网后后台自动重试。
   \`\`\`js
   // 主线程：用户点击提交
   async function submit(data) {
     const reg = await navigator.serviceWorker.ready
     await reg.sync.register('send-message')
     saveToIndexedDB('outbox', data)   // 本地存一份
   }
   // sw.js
   self.addEventListener('sync', e => {
     if (e.tag === 'send-message') {
       e.waitUntil(
         readAllFromIndexedDB('outbox').then(items =>
           Promise.all(items.map(x => fetch('/api/msg', { method: 'POST', body: JSON.stringify(x) })))
         )
       )
     }
   })
   \`\`\`

3. **IndexedDB**：大规模结构化本地持久化。
   - 简单用 \`idb\`（Jake Archibald 的 Promise 封装库）。
   - 可缓存 100MB+ 数据，真正"离线版 Web App"。

## 核心能力 4：安装提示（beforeinstallprompt）

\`\`\`js
let promptEvent
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()       // 阻止浏览器默认弹
  promptEvent = e
  // 展示 UI 上"安装应用"按钮
  installBtn.style.display = 'inline-block'
})
installBtn.addEventListener('click', async () => {
  await promptEvent.prompt()
  const choice = await promptEvent.userChoice
  if (choice.outcome === 'accepted') console.log('用户已安装')
  promptEvent = null
})
\`\`\`

浏览器自动触发条件：
- HTTPS + manifest + service worker。
- 用户与站点有一定交互（Chrome 策略，防止滥用）。

## 核心能力 5：推送通知（Push + Notification）

### 流程

\`\`\`
1. 主线程请求授权 Notification.requestPermission()
2. 注册 SW 后订阅 push：reg.pushManager.subscribe() → 得到 endpoint + keys
3. 把订阅对象发送给后端保存
4. 后端调用 Push Service（Firebase/浏览器厂商服务）发消息
5. 浏览器即使页面关闭也能收到 → SW push 事件触发
6. SW 调用 self.registration.showNotification() 弹系统通知
7. 用户点击通知 → SW notificationclick 事件，clients.openWindow
\`\`\`

### SW 代码

\`\`\`js
self.addEventListener('push', e => {
  const data = e.data?.json() ?? { title: '新消息', body: '' }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge.png',
      data: { url: data.url },
      actions: [{ action: 'open', title: '查看' }, { action: 'dismiss', title: '忽略' }]
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  if (e.action === 'open' || !e.action) {
    e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
      const target = list.find(c => c.url === e.notification.data.url)
      return target?.focus() || clients.openWindow(e.notification.data.url)
    }))
  }
})
\`\`\`

## 核心能力 6：启动体验优化

- **App Shell**：SW install 阶段缓存 HTML 壳（骨架屏 + 导航 + 侧边栏），离线秒开。
- **缓存首屏 API 数据**：进入页面立刻展示缓存数据 + 后台拉新。
- **streaming SSR + SW**：服务端流式 HTML 与 SW 缓存并行工作。

## 性能/收益数据（Google 官方案例）

| 指标 | 优化前 | 引入 PWA 后 |
| --- | --- | --- |
| 首屏加载 | 4.2s | 1.6s（App Shell 缓存） |
| 离线访问 | 白屏/错误页 | 秒开 + 本地数据展示 |
| 会话时长 | 3min | 5.8min（安装后 +93%） |
| 转化率 | 2.1% | 3.4%（+62%） |

## 常见坑

1. **小心 SW 缓存无限**：版本号必须变更，新 SW activate 时清理旧 cache。
2. **不要缓存 HTML（强 cache-first）**：否则用户永远拿不到新版。HTML 建议 Network First + 短 TTL。
3. **SW 作用域**：/app 的 SW 管不了 /admin，manifest scope 要和注册目录匹配。
4. **Samesite + Cookie**：跨域 fetch 在 SW 中默认不带 Cookie，手动 \`credentials: 'include'\`。
5. **iOS 兼容坑**：Safari 16.4+ 才支持 Push API、之前的版本安装入口藏得深（"添加到主屏幕"手动）。
6. **存储额度**：Chrome 只允许 PWA 用总磁盘 6%-10%，超限自动驱逐，关键数据加 \`persist()\`。

## 实践建议

- **是否需要 PWA？**：非必要不做。如果你的站点是内部工具/低频访问网站，收益不高。如果是内容/工具型、移动端用户多，收益非常大。
- **最快接入方式**：Vite 项目用 \`vite-plugin-pwa\`，5 行配置开启 80% PWA 能力。
- **最小心 SW 更新**：用户体验优先级 > 新功能立即发布，建议 prompt 模式让用户选择刷新。
- **渐进增强**：先做 Manifest + 安装，再加 App Shell 缓存，最后接口离线与推送，逐步引入，不要一口吃成胖子。`
  },
  {
    id: 'eng-021',
    category: 'engineering',
    title: '错误监控与性能埋点：Sentry SDK 原理、前端全链路监控、RUM 指标上报方案？',
    difficulty: '困难',
    tags: ['错误监控', 'Sentry', '性能埋点', 'RUM', 'Web Vitals'],
    answer: `## 监控体系三层架构

\`\`\`
┌────────── 采集层（浏览器） ──────────┐
│ 错误采集 + 性能采集 + 行为采集      │
│  (SDK 0 侵入/少侵入)                │
└───────────────────┬─────────────────┘
                    │  fetch/sendBeacon/Image GET
                    ▼
┌────────── 接收/清洗层（服务端） ─────┐
│ 鉴权 → 反爬 → 去重 → 清洗 → 富化    │
│ （Geo/UA/版本/环境）                │
└───────────────────┬─────────────────┘
                    │
                    ▼
┌────────── 存储与分析层 ─────────────┐
│ ClickHouse / ES / Kafka             │
│ 看板（Grafana / Sentry / 自研）     │
└─────────────────────────────────────┘
\`\`\`

## 一、错误监控完整采集

### 需要捕获的 6 类错误

| 错误类型 | 触发 API | 说明 |
| --- | --- | --- |
| JS 运行时错误 | \`window.onerror\` | 同步/异步运行时异常（含语法错误） |
| 资源加载错误 | \`window.addEventListener('error', fn, true)\` | img/script/css 加载失败（必须 capture） |
| Promise rejection | \`window.addEventListener('unhandledrejection')\` | async/await、fetch 未 catch |
| 框架渲染错误 | React ErrorBoundary / Vue \`app.config.errorHandler\` | 组件渲染期 |
| 接口业务错误 | fetch/axios 响应拦截器 | HTTP 200 但业务 code !== 0 |
| 白屏/崩溃 | \`load\` 事件后检测容器节点是否空 | 兜底 |

### 完整采集 SDK（原理）

\`\`\`js
// monitor.js 精简版 SDK
const report = (payload) => {
  // sendBeacon: 页面卸载时也能可靠发送；失败降级 fetch keepalive
  const data = { ...payload, ts: Date.now(), path: location.href, release: __APP_VERSION__ }
  const ok = navigator.sendBeacon?.(MONITOR_URL, JSON.stringify(data))
  if (!ok) fetch(MONITOR_URL, { method: 'POST', body: JSON.stringify(data), keepalive: true })
}

// 1. JS 运行时错误
window.onerror = (msg, url, line, col, err) => {
  report({
    type: 'error',
    level: 'error',
    message: msg,
    filename: url, line, col,
    stack: err?.stack || new Error(msg).stack,
    breadcrumbs: getBreadcrumbs()
  })
}

// 2. 资源加载失败（capture: true）
window.addEventListener('error', (e) => {
  const target = e.target
  if (target instanceof HTMLElement && (target.tagName.match(/IMG|SCRIPT|LINK/))) {
    report({
      type: 'resource',
      level: 'warning',
      tagName: target.tagName,
      src: target.src || target.href,
      outerHTML: target.outerHTML.slice(0, 500)
    })
  }
}, true)

// 3. Promise 未捕获 rejection
window.addEventListener('unhandledrejection', (e) => {
  report({
    type: 'promise',
    level: 'error',
    reason: typeof e.reason === 'string' ? e.reason : (e.reason?.message || JSON.stringify(e.reason).slice(0, 500)),
    stack: e.reason?.stack
  })
})

// 4. 框架层（以 Vue 3 为例）
app.config.errorHandler = (err, vm, info) => {
  report({ type: 'vue', level: 'error', message: err.message, stack: err.stack, info, component: vm?.$options?.name })
}

// 5. 接口错误（axios 拦截器）
axios.interceptors.response.use(
  (res) => {
    if (res.data.code && res.data.code !== 0) {
      report({ type: 'api_biz', level: 'warning', url: res.config.url, code: res.data.code, msg: res.data.msg })
    }
    return res
  },
  (err) => {
    report({
      type: 'api_http',
      level: 'error',
      url: err.config?.url,
      status: err.response?.status,
      statusText: err.response?.statusText,
      duration: Date.now() - (err.config?.startTime || 0)
    })
    return Promise.reject(err)
  }
)
axios.interceptors.request.use((config) => { config.startTime = Date.now(); return config })

// 6. 白屏检测
window.addEventListener('load', () => {
  setTimeout(() => {
    const app = document.querySelector('#app')
    const hasContent = app?.children.length > 0 && app?.innerText.trim().length > 10
    if (!hasContent) report({ type: 'blank_screen', level: 'critical' })
  }, 5000)
})
\`\`\`

### 用户行为面包屑（Breadcrumbs）

为每个错误附带"之前发生了什么"，便于复现：

\`\`\`js
const breadcrumbs = []
const pushBreadcrumb = (cat, data) => {
  breadcrumbs.push({ cat, ts: Date.now(), data })
  if (breadcrumbs.length > 30) breadcrumbs.shift()
}
// 监听点击、路由跳转、接口调用
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-track]') || e.target.closest('button,a')
  if (t) pushBreadcrumb('click', { tag: t.tagName, text: t.innerText?.slice(0, 40), id: t.id })
}, true)
// 路由 change / fetch 调用同理 push
function getBreadcrumbs() { return breadcrumbs.slice(-30) }
\`\`\`

### Source Map 还原堆栈

问题：线上代码被压缩/打包后，堆栈只有 bundle.js:1:99999，无法定位源码。

做法：
1. 构建时生成 source map 但**不随 CDN 发布**。
2. 只上传到监控平台，与 release 版本绑定。
3. 平台收到错误后，用 source-map 库把行列映射回真实文件 + 代码行。

\`\`\`bash
# Sentry CLI 上传 source map 示例（CI 中执行）
sentry-cli releases new "$APP_VERSION"
sentry-cli releases files "$APP_VERSION" upload-sourcemaps ./dist --rewrite
sentry-cli releases finalize "$APP_VERSION"
\`\`\`

### Sentry 最佳实践

\`\`\`js
import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: 'https://xxx@xxx.ingest.sentry.io/xxx',
  release: __APP_VERSION__,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // 敏感字段脱敏
    if (event.request?.cookies) delete event.request.cookies
    if (event.user) event.user.email = maskEmail(event.user.email)
    return event
  },
  integrations: [new BrowserTracing({
    // 分布式追踪：前端 + 后端联调
    tracePropagationTargets: ['/api/', /^https:\/\/api\.example\.com/]
  })],
  tracesSampleRate: 0.2,    // 20% 采样性能追踪
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})
// 设置用户
Sentry.setUser({ id: uid, username, segment: 'vip' })
// 手动上报
try { ... } catch (e) { Sentry.captureException(e, { tags: { module: 'checkout' } }) }
\`\`\`

## 二、性能埋点（RUM = Real User Monitoring）

### Core Web Vitals 上报

\`\`\`js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals'

function sendVitals({ name, value, id, rating }) {
  report({
    type: 'web_vitals', name, value: Math.round(name === 'CLS' ? value * 1000 : value),
    rating, id, path: getShortPath(), dpr: window.devicePixelRatio,
    net: navigator.connection?.effectiveType, ua: getBrowserOS()
  })
}
onLCP(sendVitals)
onINP(sendVitals)
onCLS(sendVitals)
onFCP(sendVitals)
onTTFB(sendVitals)
\`\`\`

### 自定义性能指标（User Timing）

\`\`\`js
// 关键业务流程："首屏数据渲染完成"
performance.mark('data-start')
await fetchList()
renderList()
performance.mark('data-rendered')
performance.measure('首屏数据', 'data-start', 'data-rendered')
const measure = performance.getEntriesByName('首屏数据')[0]
report({ type: 'custom_perf', name: '首屏数据', duration: Math.round(measure.duration) })
\`\`\`

### 接口性能埋点

\`\`\`js
axios.interceptors.response.use(
  res => {
    const { url, method } = res.config
    const dur = Date.now() - res.config.startTime
    if (dur > 1500) report({ type: 'slow_api', level: 'warning', url, method, dur })
    report({ type: 'api_perf', url, method, dur, status: res.status })
    return res
  }, err => err
)
\`\`\`

### 长任务监控

\`\`\`js
new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 200) {
      report({ type: 'longtask', duration: Math.round(entry.duration), attribution: entry.attribution?.[0] })
    }
  }
}).observe({ type: 'longtask', buffered: true })
\`\`\`

### 上报时机优化

- **去重节流**：相同堆栈错误 1 分钟内只报 1 次。
- **采样**：错误全量；性能按 5-20% 采样；用户行为 1-10%。
- **批量**：先攒数组，满 10 条或每 5s 合并一次 sendBeacon。
- **页面卸载时**：\`visibilitychange → hidden\` + sendBeacon 强制 flush。

## 三、行为埋点（点击/曝光/转化）

### 声明式埋点（推荐）

在元素上打属性：

\`\`\`html
<button data-track="click" data-event="add_to_cart" data-sku="A001">加入购物车</button>
<li data-track="expose" data-event="goods_card_expose" data-sku="A001">...</li>
\`\`\`

全局监听：

\`\`\`js
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track="click"]')
  if (el) report({ type: 'click', event: el.dataset.event, ...el.dataset, path: getShortPath() })
}, true)
\`\`\`

曝光用 IntersectionObserver（比 scroll 监听性能好太多）：

\`\`\`js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio >= 0.5 && !e.target.dataset.exposed) {
      e.target.dataset.exposed = 1
      report({ type: 'expose', event: e.target.dataset.event, ...e.target.dataset })
    }
  })
}, { threshold: 0.5 })
document.querySelectorAll('[data-track="expose"]').forEach(el => io.observe(el))
\`\`\`

## 四、全链路追踪（Distributed Tracing）

打通前端 → 网关 → 服务 → DB：

\`\`\`
请求 ID（trace-id）贯穿整个链路：
  浏览器生成 trace-id + span-id
    → Fetch/XHR 注入 header（traceparent: 00-{traceid}-{spanid}-01）
      → 网关透传 → 服务（OpenTelemetry SDK）
        → DB / 外部调用
          → 统一写入 OpenTelemetry / Jaeger / Tempo
\`\`\`

前端实现：
\`\`\`js
function genTraceId() {
  return crypto.getRandomValues(new Uint8Array(16)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')
}
axios.interceptors.request.use((config) => {
  const traceId = window.__TRACE_ID__ ||= genTraceId()
  const spanId = crypto.getRandomValues(new Uint8Array(8)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')
  config.headers['traceparent'] = \`00-\${traceId}-\${spanId}-01\`
  return config
})
\`\`\`

Sentry 自动做了类似事（BrowserTracing），可接入后端 Sentry SDK 直接看到全链路瀑布。

## 五、监控看板 & 告警

### 关注指标

| 类别 | 关键指标 | 告警阈值示例 |
| --- | --- | --- |
| 错误 | JS 错误率（错误数 / PV） | > 0.5% 触发告警 |
| 错误 | 白屏率 | > 1% |
| 性能 | LCP P75 | > 4s |
| 性能 | INP P75 | > 500ms |
| 性能 | API P95 耗时 | > 2s |
| 资源 | 静态资源加载失败率 | > 2% |
| 转化 | 核心转化漏斗步数异常 | 环比波动 > 20% |

### 工具选型

| 层次 | 开源 / 自研 | SaaS |
| --- | --- | --- |
| 错误监控（JS） | Sentry Self-Hosted（免费） | Sentry SaaS、Bugsnag、Rollbar |
| RUM 性能 | OpenTelemetry + Grafana + ClickHouse | Datadog RUM、New Relic、Cloudflare Web Analytics |
| APM（后端+前端全链路） | Jaeger / Tempo + Grafana | Datadog、New Relic、Sentry Tracing |
| 行为分析（埋点） | Umami、Plausible、Matomo | Google Analytics、Mixpanel、GrowingIO |
| 用户会话回放 | rrweb（开源录制库） | Sentry Session Replay、FullStory、LogRocket |

### rrweb 轻量回放

\`\`\`js
import * as rrweb from 'rrweb'
let stopFn = rrweb.record({
  emit(event) {
    // 只保留最近 30s 的事件；错误发生时只上传最近 30s 回放
    events.push(event)
    if (events.length > 3000) events.shift()
  }
})
// 发生错误时随错误一并上传 events
window.onerror = () => {
  uploadReplay(events.slice(-1000))
}
\`\`\`

## 六、反滥用 & 隐私合规

- **采样上报**：防止大流量项目爆库。
- **User-Agent / IP 限流**：防刷。
- **敏感字段过滤**：手机号、邮箱、银行卡、密码、Cookie 一律不要上报。
- **GDPR / 个人信息保护法**：首次访问弹同意，用户可选择关闭监控。
- **SDK 允许关闭**：\`window.__MONITOR_DISABLED__ = true\` 停止上报。

## 落地顺序（由浅入深）

1. **错误监控**（Sentry 0 配置 → 立刻有收益）。
2. **Web Vitals 性能**（web-vitals 3 行代码上报）。
3. **接口性能 + 慢接口**（拦截器 + 日志）。
4. **Source Map 还原**（与 CI 绑定）。
5. **用户行为 + 漏斗**（data-track + IO）。
6. **全链路追踪 + 回放**（复杂场景）。
7. **告警与值班**（P0 错误电话告警）。

从 Sentry 开始通常 1 天就能搭好基础架子，后续按需渐进。`
  },
  {
    id: 'eng-022',
    category: 'engineering',
    title: '灰度发布与 A/B 测试：流量切分方案、Feature Flag、实验平台、统计显著性？',
    difficulty: '中等',
    tags: ['灰度发布', 'A/B测试', 'Feature Flag', '金丝雀发布', '流量切分'],
    answer: `## 术语澄清

| 方案 | 目的 | 本质 |
| --- | --- | --- |
| **灰度发布（Canary / 金丝雀）** | 降低发布风险：先给少量人上新版本，观察后全量 | 新版本 vs 旧版本，按比例切流量 |
| **蓝绿发布** | 秒级回滚：蓝版本在线，绿版本部署完成后流量一切到底 | 两套完整环境切换 |
| **滚动发布** | 无停机：实例一台台升级新版本 | 同一环境逐个替换 |
| **A/B 测试（实验）** | 验证假设："新按钮转化率 vs 旧按钮"谁更好 | 多种变体（Variant）等比/不等比长期跑 |
| **Feature Flag（功能开关）** | 代码级开关：逻辑分支按条件生效 | 同一代码版本，IF 分支切换 |
| **暗发布 / Dark Launch** | 后端功能上线但前端隐藏入口 | 用 Feature Flag 包住 |

**灰度发布 ≠ A/B 测试**：
- 灰度目标 = 稳定，100% 用户最终都会上新版。
- A/B 测试目标 = 决策，跑完实验后只保留获胜版本。

## 方案 1：Feature Flag（功能开关，一切的基础）

把功能逻辑包在 flag 里，即使上线也可随时开关：

\`\`\`js
// featureFlags.js
const flags = {
  newCheckout: {
    rollout: 0.1,     // 10% 用户开启
    cohorts: ['whale', 'beta'],  // 这些用户组强制开启
    allowlist: ['uid_1001', 'uid_1002'], // 白名单
    blocklist: ['uid_0001']
  },
  darkMode: { defaultValue: false, overrideByUser: true },
  earlyAccess: { defaultValue: false, betaUsersOnly: true }
}

// 决策函数：根据用户上下文返回开关布尔值
function isOn(flagName, user) {
  const f = flags[flagName]
  if (!f) return false
  if (f.blocklist?.includes(user.uid)) return false
  if (f.allowlist?.includes(user.uid)) return true
  if (f.cohorts?.some(c => user.cohorts?.includes(c))) return true
  if (f.rollout !== undefined) {
    // 稳定 hash：同一用户始终命中同一种，刷新不变
    const h = hash(\`\${user.uid}:\${flagName}\`) % 1000 / 1000
    return h < f.rollout
  }
  return f.defaultValue
}

// 使用
function renderCheckout() {
  if (isOn('newCheckout', currentUser)) return <NewCheckout />
  return <OldCheckout />
}
\`\`\`

稳定 hash 的关键：**按用户维度分片**，保证用户刷新/重进始终同版本，不会跳来跳去体验割裂。

### Flag 的四种用法

1. **Kill Switch（一键回滚）**：新功能上线，发现异常直接 off，无需重新部署。
2. **Canary（灰度）**：1% → 10% → 30% → 50% → 100%，观察错误/性能。
3. **A/B 实验**：多实验组分别命中不同分支。
4. **权限/特性分级**：VIP、Beta 用户提前体验。

### Flag 生命周期管理

- **短期 Flag**（发布用）：上线稳定后立即从代码删除，避免技术债堆积。
- **长期 Flag**（权限/开关）：保留在配置中心。
- Flag 过多是新的技术债，需要定期"扫地"移除过期 flag。

## 方案 2：灰度发布（Canary）流量切分

### 常见切流维度

| 维度 | 示例 | 适用 |
| --- | --- | --- |
| **用户比例**（最常见） | 1% → 5% → 20% → 50% → 100% | 全局功能 |
| **用户 ID Hash** | uid 尾号 0-9 的用户先上 | 按账号稳定性好 |
| **地域** | 先上海、再北京、最后全国 | CDN 下沉、本地化 |
| **设备/浏览器** | 先 Chrome、再全浏览器 | 存在浏览器兼容性 |
| **用户分组** | 内部员工 → 白名单种子用户 → 公众 | 敏感功能、尝鲜 |
| **Cookie/Header** | 带 \`canary=1\` 的请求命中 | 手动测试（QA 强制走新版） |

### 三层切流架构

\`\`\`
┌─────────┐
│  CDN    │   → 边缘切分：按 IP/地理位置 先到 canary 集群
└────┬────┘
     ▼
┌─────────┐
│  网关   │   → Nginx/Ingress：按权重/cookie/header 切流量
│ (Nginx) │     A 集群 v1.0 (90%)  vs  B 集群 v1.1 (10%)
└────┬────┘
     ▼
┌─────────┐
│  前端   │   → Feature Flag：页面内按用户再次细粒度切分
└─────────┘
\`\`\`

### Nginx 权重切流示例

\`\`\`nginx
upstream app_pool {
  server old_version:3000 weight=90;
  server new_version:3000 weight=10;
}
# 或按 cookie 透传：访问带 canary=true 的用户 100% 去新版
map $cookie_canary $version_pool {
  default  old_pool;
  true     canary_pool;
}
server {
  location / {
    proxy_pass http://$version_pool;
    # 顺便埋点：返回响应带版本号 header
    add_header X-App-Version $version;
  }
}
\`\`\`

### 前端静态资源灰度

Vite/Webpack 构建产物按版本目录：
\`\`\`
dist/
  v1.0.0/
    index.html
    assets/*.js
  v1.1.0-canary/
    index.html
    assets/*.js
\`\`\`

Nginx 根据切流规则，把请求 \`/\` 指向不同目录的 HTML。注意：
- HTML 用 Network First + 短缓存，不能 Cache First。
- 静态资源带 contenthash，强缓存即可。

## 方案 3：A/B 实验平台设计

### 实验流程

\`\`\`
1. 提出假设："购物车按钮改红色，支付转化率提升 ≥ 1%"
2. 设计实验：2 组（对照组 50% + 实验组 50%），跑 14 天
3. 分流：用户首次进入被分组（稳定哈希），埋点上报 group_id
4. 采集：所有相关事件（按钮点击、下单完成、页面停留）
5. 分析：P-value、置信区间、统计显著性
6. 决策：显著（P < 0.05）→ 上线胜者；不显著 → 关闭/迭代
\`\`\`

### 分流实现

哈希 + 盐值，保证稳定且跨实验独立：

\`\`\`js
function assignVariant(userId, experimentId, weights) {
  // 盐值 + 实验ID：同一用户在不同实验被独立分配
  const digest = murmurhash3(\`\${experimentId}:\${userId}:v2\`)
  const r = digest % 1000 / 1000
  let acc = 0
  for (const [name, w] of Object.entries(weights)) {
    acc += w
    if (r < acc) return name
  }
  return Object.keys(weights)[0]
}

// 使用：实验组 50% / 对照组 50%
const variant = assignVariant(user.uid, 'checkout_button_color', { control: 0.5, variantA: 0.5 })
document.getElementById('payBtn').style.background = variant === 'variantA' ? '#dc2626' : '#2563eb'

// 随所有埋点事件附带实验信息
report({ ...payload, experiments: { 'checkout_button_color': variant } })
\`\`\`

### 统计显著性（避免拍脑袋）

常用检验方法：
- **转化率类（二元 0/1）**：**Z 检验 / Chi-Square 检验**（点击/转化/留存率）。
- **连续数值类**：**T 检验 / Mann–Whitney U（非正态）**（用户时长、消费金额、ARPU）。

核心指标：

| 概念 | 含义 | 常用值 |
| --- | --- | --- |
| **P-value** | 观测差异纯随机导致的概率 | < 0.05 视为"统计显著" |
| **置信区间** | 真实值有 95% 概率落在的范围 | 95% 置信区间不包含 0 → 显著 |
| **统计功效（Power）** | 真实有差异时能检测出的概率 | ≥ 80% |
| **最小可检测效应（MDE）** | 想检测 1% 的变化，需要更大样本量 | 事前计算样本量 |

**样本量估算公式（近似）**：

\`\`\`
每组样本 n ≈ 16 × p × (1 − p) / Δ²  （α=0.05, Power=0.8）
其中 p 为基线转化率，Δ 为你希望检测的绝对差异
\`\`\`

例：基线转化率 p = 5%，希望检测 Δ = 1%（升到 6%），则 n ≈ 16 × 0.05 × 0.95 / 0.01² ≈ 7,600 / 组，共 1.5 万样本。

**常见误判**：
- 太早下结论（样本不够就停实验）。→ 用"序贯检验"或固定样本量。
- 多重比较（20 个子指标总有一个碰巧显著）。→ 用 Bonferroni / FDR 校正。
- 辛普森悖论：整体 A 胜，但每个细分渠道 B 胜（分流不均）。→ 检查各分组是否平衡。

### 平台架构（常见 A/B 方案）

| 层次 | 功能 | 开源/商业 |
| --- | --- | --- |
| 分流服务 | 实验创建、分流、版本控制 | GrowthBook（开源）、Unleash |
| 事件采集 | click/expose/转化事件上报 | 自研（埋点 SDK）+ ClickHouse |
| 统计引擎 | 显著性分析、贝叶斯概率 | GrowthBook Stats / 自研（scipy/statsmodels） |
| 实验看板 | 实验列表、图表、报告 | GrowthBook UI / Metabase / 自研 |

**GrowthBook（开源首选）**：支持前端 SDK、Feature Flag、实验分流、显著性分析一键部署，企业版提供更多权限管理。

## 方案 4：蓝绿发布 & 回滚

### 蓝绿 vs 滚动

| | 蓝绿 | 滚动 | 金丝雀（灰度） |
| --- | --- | --- | --- |
| 资源 | 2× 完整环境 | 同一环境逐台替换 | 少量实例先上新版 |
| 回滚 | 切流量秒回 | 重新部署旧版（慢） | 切旧版本流量 |
| 风险 | 低 | 中（中间态版本共存） | 最低（小流量验证） |
| 成本 | 高 | 低 | 低 |

## 发布步骤 SOP（推荐）

### 新功能上线（完整灰度流程）

\`\`\`
Day 0  代码合入主干
       │
Day 1  预发环境 QA 回归 + 性能回归
       │
Day 2  生产发布，Feature Flag 默认 off
       │ 埋点自检（按钮点击、接口、错误率）
       │
Day 2+ 白名单验证：内部员工 / 种子用户 100% 开启
       │ 观察 2 小时：错误率、日志、性能
       │
Day 3  金丝雀放量 1% → 5% → 20%
       │ 每个阶段观察 2-4 小时，重点关注
       │   · JS 错误率（同比）
       │   · 核心 API P95
       │   · 核心转化率漏斗
       │   · 用户反馈 / 客服工单
       │  出现异常 → 一键 Flag off → 回到 Flag 前状态
       │
Day 4  放量 50% → 跑 24 小时
       │
Day 5  全量 100%
       │
Day 5+ 保留 Flag 3 天，观察
       │
Day 8  代码清理：删除旧分支 + Flag 逻辑
\`\`\`

### 紧急回滚流程

出现 P0 故障（错误率飙升 / 核心链路不可用）：
1. **立刻 Flag off**（0 秒回滚，优先）。
2. Flag 无效 → **网关切回旧版本集群**（蓝绿 10 秒内）。
3. 静态资源问题 → **Nginx 指回旧版本 HTML**。
4. 回滚后**立刻拉群复盘**，24 小时内出 RCA（根因报告）。

## 前端配合：埋点与观测

做灰度/A/B 前提是**有观测能力**，否则放量了全瞎：

### 最少观测指标（必做）

- **JS 错误率**：分版本（v1 vs v2）对比。
- **页面性能**：LCP/INP/CLS 分版本分桶。
- **接口错误率 + 耗时**：分版本。
- **核心漏斗**：首页 → 详情 → 加购 → 支付 → 完成，每步转化率分版本对比。
- **Crash / 白屏率**：分版本。

### 常见错误

1. **没有先埋点就放量** → 跑了一周也不知道好不好。
2. **所有版本共用指标** → 问题出现不知道是谁的锅。
3. **手动放量，不留记录** → 出问题无法回溯。
4. **Flag 忘了删除** → 3 个月后代码里 100 个 if/else 混乱。
5. **A/B 没算样本量就停** → 以为新方案好，实际只是随机波动。

## 选型建议

| 团队规模 | 方案 |
| --- | --- |
| **小团队（< 10 前端）** | 简单版：Feature Flag（代码里写配置 + 管理后台开关） + 权重路由（Nginx） |
| **中团队（10-50 前端）** | 引入 Unleash / Flagsmith（开源 Flag 服务） + 自研埋点 + Metabase 看板 |
| **大团队（50+ 前端，重视实验）** | GrowthBook（开源实验平台）或 Optimizely / 字节 DataTester（商业） |
| **超大规模** | 自建实验平台 + Feature Store + 实时分析（Flink/ClickHouse） |

## 推荐工具速查

- **Feature Flag**：Unleash、Flagsmith、LaunchDarkly（商业）。
- **A/B 实验**：GrowthBook（开源 + 商业）、Optimizely、Google Optimize（已下线→建议 GrowthBook）。
- **版本发布**：Argo Rollouts（K8s 原生金丝雀、蓝绿）、Flagger。
- **流量切分**：Nginx split_clients、Kong Gateway、AWS ALB 权重路由。

**核心原则**：先有 Feature Flag + 可观测，再谈灰度；先有统计意识 + 埋点，再谈 A/B。`
  }
]
