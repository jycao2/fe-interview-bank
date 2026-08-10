export const performanceQuestions = [
  {
    id: 'perf-001',
    category: 'performance',
    title: '前端性能优化的总体思路是怎样的？',
    difficulty: '中等',
    tags: ['性能优化', '方法论'],
    answer: `## 三个维度

1. **加载性能**：让页面更快地"出现"。
2. **渲染性能**：让页面交互更流畅、不卡顿。
3. **运行时性能**：减少长任务、内存占用。

## 加载优化

- **减少请求数**：合并、雪碧图（HTTP/1）、内联关键资源。
- **减小体积**：压缩（gzip/brotli）、Tree-shaking、按需加载、图片压缩 / WebP / AVIF。
- **缓存**：HTTP 强缓存 + 协商缓存、Service Worker、CDN。
- **并行化**：HTTP/2 多路复用、域名预解析、预连接、资源 preload / prefetch。
- **按需加载**：路由懒加载、组件懒加载、动态 import。
- **首屏优先**：关键 CSS 内联、非关键资源 defer / async。
- **服务端渲染 / 预渲染**：减少首屏 JS 执行与白屏。

## 渲染优化

- **减少回流重绘**：批量样式修改、避免强制同步布局、用 transform/opacity 动画。
- **虚拟列表**：长列表只渲染可见区域。
- **防抖节流**：限制高频事件触发频率。
- **Web Worker**：把耗时计算移出主线程。
- **requestAnimationFrame / requestIdleCallback**：合理安排任务。

## 运行时优化

- **避免内存泄漏**：清理定时器、监听器、引用。
- **减少重渲染**：React memo / Vue shallow、合理 key。
- **节流大计算**：分片（time slicing）、缓存结果。

## 度量

- **核心 Web 指标**：LCP / FID（或 INP）/ CLS。
- **其他**：FCP、TTFB、TBT、TTI。
- **工具**：Lighthouse、Chrome DevTools Performance、Web Vitals、PerformanceObserver。

## 方法论

1. **度量** → 找到瓶颈（不要盲目优化）。
2. **定位** → DevTools 分析具体原因。
3. **优化** → 针对性施策。
4. **验证** → 对比指标、A/B。
5. **监控** → 上线后持续跟踪（RUM 真实用户监控）。`
  },
  {
    id: 'perf-002',
    category: 'performance',
    title: 'Core Web Vitals 是什么？',
    difficulty: '中等',
    tags: ['Core Web Vitals', 'LCP', 'INP', 'CLS'],
    answer: `## 定义

Google 提出的**核心 Web 指标**，衡量用户体验的关键指标，影响搜索排名（SEO）。

## 三大核心指标

### 1. LCP（Largest Contentful Paint）最大内容绘制

- 测量**加载性能**：页面最大内容元素（图片、视频、文本块）渲染完成的时间。
- 目标：**≤ 2.5s**（良好），> 4s 差。

### 2. INP（Interaction to Next Paint）下次绘制交互（2024 年取代 FID）

- 测量**交互响应性**：用户所有交互（点击、键盘）到下一帧绘制的最坏延迟。
- 目标：**≤ 200ms**（良好），> 500ms 差。
- 比 FID（仅首次输入延迟）更全面，反映整个生命周期交互流畅度。

### 3. CLS（Cumulative Layout Shift）累积布局偏移

- 测量**视觉稳定性**：页面生命周期内意外布局偏移的累积分数。
- 目标：**≤ 0.1**（良好），> 0.25 差。

## 其他常见指标

- **TTFB**（Time to First Byte）：首字节时间，≤ 800ms。
- **FCP**（First Contentful Paint）：首次内容绘制，≤ 1.8s。
- **TBT**（Total Blocking Time）：总阻塞时间，长任务超过 50ms 部分之和。
- **TTI**（Time to Interactive）：可交互时间。

## 测量

\`\`\`js
import { onLCP, onINP, onCLS } from 'web-vitals'
onLCP(console.log)
onINP(console.log)
onCLS(console.log)
\`\`\`

或用 PerformanceObserver 直接监听对应 entry。

## 优化方向

- **LCP**：优化最大资源（图片、字体）、CDN、SSR、减少阻塞 JS。
- **INP**：减少长任务、拆分任务、Web Worker、避免主线程阻塞。
- **CLS**：为图片 / 广告位预留尺寸（aspect-ratio）、避免动态插入内容、字体加载策略（font-display）。`
  },
  {
    id: 'perf-003',
    category: 'performance',
    title: '图片优化有哪些手段？',
    difficulty: '中等',
    tags: ['图片优化', '懒加载', 'WebP'],
    answer: `## 1. 选择合适格式

| 格式 | 适用 | 特点 |
| --- | --- | --- |
| WebP | 照片 / 透明图 | 比 JPEG/PNG 小 25-35%，现代浏览器支持 |
| AVIF | 照片 | 压缩率更高，编码慢，新浏览器 |
| JPEG | 照片 | 兼容性最好 |
| PNG | 透明 / 图标 | 无损，体积大 |
| SVG | 图标 / 图形 | 矢量，可缩放，体积小，可 CSS/JS 操作 |
| GIF | 动图 | 体积大，建议用视频替代 |

用 \`<picture>\` 按浏览器能力提供不同格式：

\`\`\`html
<picture>
  <source srcset="a.avif" type="image/avif">
  <source srcset="a.webp" type="image/webp">
  <img src="a.jpg" alt="...">
</picture>
\`\`\`

## 2. 懒加载

\`\`\`html
<img src="a.jpg" loading="lazy" decoding="async" width="..." height="..." />
\`\`\`

- \`loading="lazy"\`：进入视口附近才加载（原生）。
- \`decoding="async"\`：异步解码不阻塞主线程。
- 始终设置 \`width/height\`（或 aspect-ratio）避免 CLS。

## 3. 响应式图片

根据屏幕尺寸加载不同分辨率：

\`\`\`html
<img srcset="a-480.jpg 480w, a-960.jpg 960w" sizes="(max-width: 600px) 480px, 960px" src="a-960.jpg">
\`\`\`

## 4. 压缩

- 工具压缩（tinypng、imagemin、squoosh）。
- 构建时自动压缩（vite-plugin-imagemin）。

## 5. CDN + 缓存

- 图片走 CDN，就近加速。
- 文件名带 hash，强缓存。

## 6. 雪碧图 / 图标字体 / SVG sprite

- 小图标用 SVG 或 icon font，减少 HTTP 请求（HTTP/2 后雪碧图收益降低）。

## 7. 占位与渐进

- 低质量占位图（LQIP）、模糊占位、骨架屏。
- JPEG 渐进式加载。

## 8. 预加载关键图

\`\`\`html
<link rel="preload" as="image" href="hero.jpg">
\`\`\`

优先加载首屏大图，提升 LCP。`
  },
  {
    id: 'perf-004',
    category: 'performance',
    title: '防抖（debounce）和节流（throttle）的原理与区别？',
    difficulty: '中等',
    tags: ['防抖', '节流', '高频事件'],
    answer: `## 防抖（Debounce）

**事件停止触发 n 秒后才执行**，若在 n 秒内再次触发则重新计时。比喻：电梯等人。

\`\`\`js
function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
\`\`\`

- 场景：搜索框输入联想、resize、按钮防连点、表单校验。

## 节流（Throttle）

**每 n 秒最多执行一次**，稀释执行频率。比喻：水龙头滴水。

\`\`\`js
// 定时器版
function throttle(fn, delay) {
  let timer
  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}
// 时间戳版（首次立即执行）
function throttle(fn, delay) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= delay) {
      fn.apply(this, args)
      last = now
    }
  }
}
\`\`\`

- 场景：滚动加载、鼠标移动拖拽、播放进度更新。

## 区别

| | 防抖 | 节流 |
| --- | --- | --- |
| 执行时机 | 停止后执行一次 | 固定间隔执行 |
| 高频下 | 只执行最后一次 | 匀速执行 |
| 侧重 | "等用户停下来" | "控制频率" |

## 进阶

- 支持立即执行选项（leading）。
- 支持取消（cancel）。
- lodash 的 \`_.debounce\` / \`_.throttle\` 提供完整功能（maxWait、leading、trailing）。`
  },
  {
    id: 'perf-005',
    category: 'performance',
    title: '虚拟列表的原理？什么场景下需要？',
    difficulty: '困难',
    tags: ['虚拟列表', '长列表', '渲染优化'],
    answer: `## 问题

渲染上万条数据的列表时，全量创建 DOM 会导致：

- 首屏渲染极慢（DOM 节点过多）。
- 滚动卡顿（大量节点参与布局 / 绘制）。
- 内存占用高。

## 原理

**只渲染可视区域内的少量元素**，滚动时动态替换内容，用少量 DOM 模拟超长列表。

\`\`\`
容器（固定高度，可滚动）
 └─ 内容区（总高度 = 数据数 * 行高，撑出滚动条）
     └─ 可视区（绝对定位，translateY 偏移）
         └─ 仅渲染 [start, end] 范围的项
\`\`\`

## 实现要点

1. **容器高度固定**，\`overflow: auto\`。
2. **总高度占位**：用一个占位元素（或 padding）撑起 \`totalHeight = count * itemHeight\`，使滚动条正确。
3. **计算可视范围**：监听 scrollTop，根据 \`itemHeight\` 计算：
   \`\`\`js
   const start = Math.floor(scrollTop / itemHeight)
   const end = start + visibleCount
   \`\`\`
4. **偏移可视区**：用 \`transform: translateY(start * itemHeight)\` 让可视项对齐滚动位置。
5. **只渲染切片数据**：\`data.slice(start, end)\`。

## 变高场景

- 行高不固定时，需**预估高度 + 缓存实际高度**，渲染后测量并修正位置（动态高度虚拟列表）。
- 维护一个位置缓存数组（top/bottom），二分查找可视范围。

## 现成方案

- React：react-virtualized、react-window、@tanstack/react-virtual。
- Vue：vue-virtual-scroller、@vueuse/core 的 useVirtualList。

## 适用场景

- 千级以上数据列表、表格。
- 时间轴、聊天记录、日志。
- 大数据看板。

## 注意

- 项需有稳定 key。
- 搜索 / 筛选后需重置滚动位置。
- 配合骨架屏避免滚动时空白闪烁。`
  },
  {
    id: 'perf-006',
    category: 'performance',
    title: '首屏加载优化有哪些具体手段？',
    difficulty: '中等',
    tags: ['首屏', '加载优化', '白屏'],
    answer: `## 资源层面

1. **路由 / 组件懒加载**：动态 import，按需加载：
   \`\`\`js
   const Home = () => import('./Home.vue')
   \`\`\`
2. **第三方库按需引入**：tree-shaking、避免整包引入（如 lodash 按需、echarts 按模块）。
3. **代码分割**：webpack SplitChunks、Vite 自动分包。
4. **压缩**：gzip / brotli、图片压缩、代码 minify。
5. **Tree-shaking**：删除无用代码（ESM 静态分析）。

## 网络层面

1. **CDN**：静态资源就近分发。
2. **HTTP/2**：多路复用、头部压缩。
3. **强缓存**：带 hash 资源 \`max-age\` 长缓存。
4. **预加载**：
   - \`<link rel="preload">\`：关键资源提前加载（字体、首屏图、关键 CSS/JS）。
   - \`<link rel="prefetch">\`：空闲时预取下一页资源。
   - \`dns-prefetch\` / \`preconnect\`：提前 DNS / 建连。

## 渲染层面

1. **SSR / 预渲染**：服务端直出 HTML，减少白屏与 JS 执行。
2. **骨架屏**：降低白屏感知。
3. **关键 CSS 内联**：首屏样式内联到 HTML，避免阻塞渲染。
4. **非关键 CSS 异步**：\`<link rel="preload" as="style" onload="...">\`。
5. **JS defer / async**：不阻塞 HTML 解析。
6. **字体优化**：\`font-display: swap\`、字体子集化。

## 服务端层面

1. **TTFB 优化**：服务端响应快、缓存、CDN 边缘计算。
2. **BFF 聚合**：减少串行请求。
3. **HTTP 缓存 / Service Worker**。

## 度量与验证

- Lighthouse 跑分。
- 关注 LCP / FCP / TTI。
- 真实用户监控（RUM）追踪实际首屏。

## 优先级

先做"高收益低风险"：路由懒加载 + 资源压缩 + CDN + 缓存，再考虑 SSR 等重构。`
  },
  {
    id: 'perf-007',
    category: 'performance',
    title: '什么是长任务？如何优化主线程？',
    difficulty: '困难',
    tags: ['长任务', '主线程', 'time slicing'],
    answer: `## 长任务（Long Task）

执行时间超过 **50ms** 的任务。超过 50ms 会阻塞主线程，导致：

- 动画掉帧（>16.7ms 一帧即可能掉帧，50ms 是"用户感知延迟"阈值）。
- 交互无响应（INP 变差）。
- 输入延迟。

## 检测

\`\`\`js
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('长任务', entry.duration)
  })
})
observer.observe({ type: 'longtask', buffered: true })
\`\`\`

或用 DevTools Performance 面板的"Main"线程火焰图定位。

## 优化手段

### 1. 任务拆分（Time Slicing）

把大任务拆成多个小任务，用 \`setTimeout\` / \`scheduler.yield()\` / requestIdleCallback 在帧间执行，让出主线程处理交互与渲染：

\`\`\`js
function chunkedProcess(items) {
  let i = 0
  function step() {
    const end = performance.now() + 20  // 每片约 20ms
    while (i < items.length && performance.now() < end) {
      process(items[i++])
    }
    if (i < items.length) {
      setTimeout(step)  // 让出主线程
    }
  }
  step()
}
\`\`\`

### 2. Web Worker

把纯计算任务移到 Worker 线程（数据解析、加密、大计算），主线程只负责 UI。

### 3. 减少同步工作

- 缓存计算结果（memoize）。
- 延迟非关键初始化。
- 避免在主线程做 JSON.parse 巨大数据、正则灾难回溯。

### 4. 优化渲染

- 减少 DOM 节点数。
- 避免大型选择器、复杂样式计算。
- 用 content-visibility: auto 跳过离屏渲染。

### 5. 合理调度

- \`requestAnimationFrame\` 做动画。
- \`requestIdleCallback\` 做低优先级任务。
- \`scheduler.postTask()\`（实验性）按优先级调度。

## React 的协作调度

React Fiber 把渲染拆成可中断单元，时间切片在每帧留出时间响应交互，Concurrent 模式 / useTransition 标记低优先级更新，正是为了解决长任务问题。`
  },
  {
    id: 'perf-008',
    category: 'performance',
    title: '浏览器首屏性能指标 FP / FCP / TTI / TBT 是什么？',
    difficulty: '中等',
    tags: ['性能指标', 'FCP', 'TTI', 'TBT'],
    answer: `## 加载过程指标

浏览器从导航到页面可交互，会经历一系列阶段，每个阶段对应一个性能指标。

## 主要指标

### FP（First Paint）首次绘制

- 浏览器首次将任何内容（文本、图片、背景）绘制到屏幕的时间。
- 用户看到"白屏结束"。
- 但内容可能只是背景色，意义有限。

### FCP（First Contentful Paint）首次内容绘制

- 浏览器首次绘制**来自 DOM 的内容**（文本、图片、SVG、非白色 canvas）。
- 用户看到"有内容了"。
- 目标：≤ 1.8s（良好），> 3s 差。
- 比 FP 更有意义。

### LCP（Largest Contentful Paint）最大内容绘制

- 视口内最大元素绘制完成时间。
- 反映"主要内容加载完毕"。
- 目标：≤ 2.5s。

### TTI（Time to Interactive）可交互时间

- 页面可以稳定响应用户输入的时间。
- 条件：FCP 已完成；主线程长任务（>50ms）已结束并持续 5s；页面已开始响应输入。
- 反映"页面真正可用了"。
- 目标：≤ 3.8s。

### TBT（Total Blocking Time）总阻塞时间

- FCP 与 TTI 之间，所有长任务超过 50ms 部分之和。
- 例如一个 200ms 长任务贡献 150ms（200-50）。
- 反映"主线程被阻塞程度"。
- 目标：≤ 200ms（良好），> 600ms 差。
- TBT 与 TTI 相关但更适合实验室测量（TTI 计算成本高）。

### FID（First Input Delay）首次输入延迟

- 用户首次交互到主线程开始响应的延迟。
- 仅测量首次。
- 2024 年被 INP 取代。

## 指标关系

| 指标 | 衡量 | 时机 |
| --- | --- | --- |
| FP | 首次绘制 | 早期 |
| FCP | 首次内容 | 早期 |
| LCP | 主要内容完成 | 加载 |
| TBT | 阻塞程度 | FCP-TTI 之间 |
| TTI | 可交互 | 较晚 |
| FID/INP | 交互响应 | 全程 |

## 测量

\`\`\`js
// FCP
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('FCP', entry.startTime)
  }
}).observe({ type: 'paint', buffered: true })

// TBT 通过 longtask 计算
let blocking = 0
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    blocking += Math.max(0, entry.duration - 50)
  }
}).observe({ type: 'longtask', buffered: true })
\`\`\`

## 优化方向

- **FCP / LCP**：减少阻塞资源、SSR、CDN、关键 CSS 内联、字体优化。
- **TBT**：减少长任务、按需加载、Web Worker、代码分割。
- **TTI**：减少主线程占用、延后非关键脚本。

## 实验室 vs 真实用户

- **实验室数据**（Lighthouse）：固定环境，可复现，但与真实用户有差距。
- **真实用户数据**（RUM）：采集真实环境，看 P75/P95，更代表实际体验。
- 上线后两者结合看，不要只看实验室分数。`
  },
  {
    id: 'perf-009',
    category: 'performance',
    title: '资源预加载 preload / prefetch / preconnect / dns-prefetch 有什么区别？',
    difficulty: '中等',
    tags: ['预加载', 'preload', 'prefetch', '网络优化'],
    answer: `## 概念

都是 \`<link>\` 标签的 \`rel\` 属性，用于提前做一些网络准备工作，但**目的和时机不同**。

## 四种类型

### 1. dns-prefetch

- 提前做 **DNS 解析**。
- 适用于第三方域名（如 CDN、统计、字体）。
- 代价小，几乎无副作用。

\`\`\`html
<link rel="dns-prefetch" href="//cdn.example.com">
\`\`\`

### 2. preconnect

- 提前完成 **DNS + TCP + TLS** 握手。
- 比 dns-prefetch 更彻底，但消耗资源，建议只对最关键的 1-2 个域名。
- 浏览器会自动关闭空闲连接（10-15s）。

\`\`\`html
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
\`\`\`

### 3. preload

- **当前页面必用**的关键资源，提前高优先级加载。
- 必须指定 \`as\`（script/style/font/image/...）。
- 浏览器不会自动用，需要页面里有引用，否则浪费。
- 常用于首屏字体、Hero 图、关键 CSS/JS。

\`\`\`html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/img/hero.jpg" as="image">
\`\`\`

### 4. prefetch

- **下一个页面可能用到**的资源，浏览器空闲时低优先级预取。
- 用于路由预取、下一页资源。
- 可能因用户切换网络或离开页面被取消。

\`\`\`html
<link rel="prefetch" href="/next-page.js">
\`\`\`

### 5. modulepreload（特例）

- 专门预加载 ESM 模块及其依赖。
- Vite 用它来预取路由模块。

\`\`\`html
<link rel="modulepreload" href="/chunk.js">
\`\`\`

## 对比

| 类型 | 时机 | 做什么 | 优先级 | 用途 |
| --- | --- | --- | --- | --- |
| dns-prefetch | 早 | DNS | 低 | 第三方域名 |
| preconnect | 早 | DNS+TCP+TLS | 中 | 关键第三方 |
| preload | 当前页 | 完整下载 | 高 | 当前页关键资源 |
| prefetch | 空闲 | 完整下载 | 低 | 下一页资源 |
| modulepreload | 当前页 | 下载+解析 ESM | 高 | 关键模块 |

## 使用场景

\`\`\`html
<head>
  <!-- 关键第三方域名 -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- 首屏字体 -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <!-- 首屏大图 -->
  <link rel="preload" href="/hero.jpg" as="image" fetchpriority="high">
</head>
\`\`\`

## fetchpriority（新属性）

HTML 标准 \`fetchpriority\` 补充控制优先级：

\`\`\`html
<img src="hero.jpg" fetchpriority="high">
<img src="below-fold.jpg" fetchpriority="low">
\`\`\`

## 路由级预取

- React/Vue 路由配置中可声明数据预取。
- 鼠标 hover 链接时触发 prefetch，提升下一页 LCP。

## 注意事项

1. **不要滥用 preload**：每多一个，会和其他资源抢带宽，可能反而拖慢首屏。
2. **preload 的资源必须被使用**，否则会触发 Chrome 警告。
3. **跨域字体必须加 \`crossorigin\`**，否则 preload 与实际字体请求是两份。
4. **prefetch 在弱网/省流模式下可能被忽略**。
5. Service Worker 缓存的资源不一定需要 preload。
6. \`preconnect\` 数量建议不超过 3 个，否则收益递减。`
  },
  {
    id: 'perf-010',
    category: 'performance',
    title: 'GPU 加速与合成层是什么？will-change / transform 如何工作？',
    difficulty: '困难',
    tags: ['GPU加速', '合成层', 'will-change', '动画优化'],
    answer: `## 浏览器渲染流水线

\`\`\`
Style → Layout（布局/回流） → Paint（绘制/重绘） → Composite（合成）
\`\`\`

- **回流（Layout）**：重新计算元素几何位置。代价最高。
- **重绘（Paint）**：重新绘制像素（颜色、阴影等）。
- **合成（Composite）**：把已绘制的图层合并输出到屏幕。代价最低。

## 合成层（Compositing Layer）

浏览器把页面分成多个**图层（Layer）**，各自绘制后由合成器（compositor）合并。某些元素会被提升为独立的**合成层**，由 GPU 处理。

### 提升为合成层的触发条件

- 有 3D 变换：\`transform: translateZ(0)\` / \`translate3d\`。
- 使用 \`transform\`、\`opacity\`、\`filter\` 做动画。
- \`<video>\`、\`<canvas>\`、WebGL。
- \`will-change: transform\` 等明确提示。
- position: fixed、sticky（部分浏览器）。
- 与已有合成层重叠且 z-index 排序在前。

## GPU 加速的好处

合成层的绘制与动画在 GPU 完成：

1. **动画不触发回流/重绘**：\`transform\`、\`opacity\` 只影响合成，主线程不参与。
2. **主线程让出**：动画期间 JS 长任务不会卡顿动画。
3. **硬件加速**：GPU 擅长图层变换与纹理混合。

## 经典优化技巧

\`\`\`css
/* 用 transform 代替 top/left 动画 */
.bad { transition: left .3s; left: 100px; }
.good { transition: transform .3s; transform: translateX(100px); }

/* 用 opacity 代替 visibility/display 做淡入淡出 */
.fade { transition: opacity .3s; opacity: 0; }
\`\`\`

## will-change

\`\`\`css
.card:hover {
  will-change: transform;
}
\`\`\`

- 提示浏览器"这个属性将要变化"，提前创建合成层、准备资源。
- **不要常驻使用**：占用内存、可能层爆炸。
- 用完应移除（动画结束后取消）。

\`\`\`js
el.style.willChange = 'transform'
// 动画结束后
el.style.willChange = 'auto'
\`\`\`

## 层爆炸（Layer Explosion）

过多合成层会：

- 占用大量 GPU 内存（每层都是一张纹理）。
- 层间重叠会触发连锁提升。
- 移动端尤其敏感。

DevTools → Layers 面板可查看层数量与原因。

## 调试

- Chrome DevTools → Layers：查看图层结构。
- Performance 面板：看 Paint / Composite 占比。
- Rendering 面板 → Paint flashing：高亮重绘区域。

## 注意事项

1. **不要无脑 \`translateZ(0)\`**：可能制造无意义的层。
2. **动画优先用 transform / opacity**：天然走合成层。
3. **大图层代价高**：单层越大，重绘越慢，避免整页大背景动画。
4. **\`contain: layout style paint\`**：限制重渲染范围，配合合成层使用。
5. **will-change 是"将来时"**：提前告知，而非"现在改变"。
6. **避免频繁切换合成层**：提升/降级也有开销。`
  },
  {
    id: 'perf-011',
    category: 'performance',
    title: 'Performance API 与前端性能监控怎么做？',
    difficulty: '中等',
    tags: ['Performance API', '性能监控', 'PerformanceObserver'],
    answer: `## Performance API 概览

W3C 标准，浏览器提供 \`window.performance\` 与 \`PerformanceObserver\`，用于采集性能数据。

## 1. Navigation Timing

页面加载各阶段时间戳：

\`\`\`js
const [nav] = performance.getEntriesByType('navigation')
console.log(nav)
// 关键时间点：
// startTime, fetchStart, domainLookupStart/End,
// connectStart/End, responseStart/End,
// domInteractive, domContentLoadedEventEnd, loadEventEnd
\`\`\`

派生指标：

\`\`\`js
const ttfb = nav.responseStart - nav.startTime
const fcp = performance.getEntriesByType('paint')
  .find(e => e.name === 'first-contentful-paint')?.startTime
const domReady = nav.domContentLoadedEventEnd - nav.startTime
const load = nav.loadEventEnd - nav.startTime
\`\`\`

## 2. Resource Timing

每个资源（脚本、图片、接口）的加载时间：

\`\`\`js
performance.getEntriesByType('resource').forEach(r => {
  console.log(r.name, r.duration, r.transferSize)
})
\`\`\`

可定位慢请求、大资源、跨域资源。

## 3. User Timing

自定义打点：

\`\`\`js
performance.mark('start')
// ... 业务
performance.mark('end')
performance.measure('myTask', 'start', 'end')
performance.getEntriesByType('measure')
\`\`\`

## 4. PerformanceObserver

异步监听各类 entry（推荐，不阻塞）：

\`\`\`js
const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.entryType, entry.startTime, entry.duration)
  }
})
obs.observe({ entryTypes: ['paint', 'longtask', 'resource', 'measure'] })
\`\`\`

## 5. Web Vitals

核心指标用 \`web-vitals\` 库或直接 observer：

\`\`\`js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals'
onLCP(metric => report(metric))
onINP(metric => report(metric))
onCLS(metric => report(metric))
\`\`\`

## 6. 长任务监控

\`\`\`js
new PerformanceObserver(list => {
  list.getEntries().forEach(entry => {
    reportLongTask(entry.duration, entry.startTime)
  })
}).observe({ type: 'longtask', buffered: true })
\`\`\`

## 7. 内存监控

\`\`\`js
// Chrome 非标准 API
if (performance.memory) {
  console.log(performance.memory.usedJSHeapSize) // 已用
  console.log(performance.memory.jsHeapSizeLimit) // 上限
}
\`\`\`

## RUM 真实用户监控

采集真实用户数据上报，比实验室 Lighthouse 更代表真实情况：

\`\`\`js
window.addEventListener('load', () => {
  setTimeout(() => {
    const nav = performance.getEntriesByType('navigation')[0]
    fetch('/report', {
      method: 'POST',
      body: JSON.stringify({
        ttfb: nav.responseStart - nav.startTime,
        domReady: nav.domContentLoadedEventEnd - nav.startTime,
        load: nav.loadEventEnd - nav.startTime,
        url: location.pathname,
        ua: navigator.userAgent
      }),
      keepalive: true
    })
  }, 0)
})
\`\`\`

## 上报时机

- 页面加载完成（load 事件）。
- 页面隐藏时（\`visibilitychange\` → hidden），用 \`navigator.sendBeacon\` 确保卸载时也发出。
- Web Vitals 在指标稳定后回调（如 CLS 在 hidden 时才最终确定）。

## 注意

1. **采样上报**：海量用户全量上报成本高，按比例（如 1-10%）采样。
2. **聚合统计**：看 P75 / P95，不只看平均。
3. **跨域资源时间**：需对方返回 \`Timing-Allow-Origin\` 响应头，否则部分字段为 0。
4. **缓冲区上限**：默认 entries 缓冲有限，用 \`buffered: true\` 读取初始，必要时手动清理。
5. **与错误监控联动**：慢请求、长任务常与接口报错相关。`
  },
  {
    id: 'perf-012',
    category: 'performance',
    title: '前端内存泄漏的原因、检测与避免？',
    difficulty: '中等',
    tags: ['内存泄漏', '垃圾回收', '性能'],
    answer: `## 内存泄漏

不再使用的对象仍被引用，无法被垃圾回收（GC）回收，导致堆内存持续增长，最终可能：

- 页面越来越卡（GC 频繁、停顿）。
- 占用系统内存升高，浏览器甚至崩溃（OOM）。
- 间接拖慢其他逻辑。

## 常见泄漏原因

### 1. 未清理的定时器

\`\`\`js
setInterval(() => { /* ... */ }, 1000)
// 组件销毁时忘了 clearInterval，回调与闭包引用了组件数据
\`\`\`

### 2. 未移除的事件监听

\`\`\`js
window.addEventListener('resize', handler)
// 销毁时未 removeEventListener
\`\`\`

### 3. 闭包持有变量

\`\`\`js
function outer() {
  const huge = new Array(1e6).fill(0)
  return function inner() { console.log('hi') }
  // huge 被 inner 闭包引用，无法释放
}
\`\`\`

### 4. 脱离 DOM 的引用

\`\`\`js
let detached
function create() {
  const el = document.createElement('div')
  document.body.appendChild(el)
  detached = el  // 外部引用
}
function remove() {
  document.body.removeChild(detached)
  // DOM 树里没了，但 detached 仍引用 el，el 关联的 listener/数据无法回收
}
\`\`\`

### 5. 全局变量

\`\`\`js
function foo() {
  leak = data  // 忘记 let/var/const，挂到 window
}
\`\`\`

### 6. Map / Set / 数组无限增长

缓存不清理、消息队列不消费、监听列表只 push 不 remove。

### 7. Promise / 回调悬挂

长时间未 resolve 的 Promise 闭包持有大量上下文。

### 8. 框架中

- React：未在 \`useEffect\` 返回清理函数。
- Vue：未在 \`beforeUnmount\` / \`unmounted\` 清理。
- 全局 store 持有组件实例引用。

## 检测

### Chrome DevTools

1. **Memory 面板**：
   - Heap snapshot：拍快照，对比两次之间增长的对象。
   - Allocation timeline：实时看分配。
   - Allocation instrumentation on timeline：定位具体代码。
2. **Performance Monitor**（Ctrl+Shift+P → Performance Monitor）：看 JS Heap size 走势。

### 代码层

\`\`\`js
// 周期记录
setInterval(() => {
  if (performance.memory) {
    console.log('heap:', performance.memory.usedJSHeapSize)
  }
}, 5000)
\`\`\`

## 排查思路

1. 复现场景（反复进/出某页面、长时间停留）。
2. 拍快照 A → 操作 N 次 → 拍快照 B → 比较。
3. 按"Delta"排序，找出持续增长的对象类型。
4. 看 Retainers 链，找出是谁在引用。

## 避免规范

1. **定时器必清**：\`clearInterval\` / \`clearTimeout\`。
2. **监听必移除**：\`removeEventListener\`，或用 \`AbortController\` 一次性移除多个。
3. **WeakMap / WeakSet**：缓存对象引用不阻碍 GC。
4. **框架生命周期清理**：useEffect return、onUnmounted。
5. **避免长期持有大对象**：用完置 null。
6. **限制缓存大小**：LRU、TTL 过期。
7. **WeakRef / FinalizationRegistry**：可观察对象回收（高级）。

## 影响示例

一个 SPA 长时间不刷新，每次路由切换泄漏 1MB，运行 1 小时后泄漏 60MB+，触发：

- GC 频繁触发，主线程停顿。
- 页面卡顿、滚动掉帧。
- 移动端更容易 OOM 闪退。

定期回归测试 + 监控上报，能尽早发现泄漏问题。`
  },
  {
    id: 'perf-013',
    category: 'performance',
    title: 'Webpack 如何实现代码分割（Code Splitting）与懒加载？',
    difficulty: '中等',
    tags: ['Webpack', 'Code Splitting', '懒加载'],
    answer: `## 为什么需要代码分割

默认打包成单个 bundle：

- 首屏要下载全部代码，体积大、白屏长。
- 改一行代码，整个 bundle hash 变化，缓存全失效。
- 不同页面共用代码无法复用。

代码分割把 bundle 拆成多个 chunk，按需加载、合理缓存。

## 三种主要方式

### 1. 入口分割（Entry）

\`\`\`js
module.exports = {
  entry: { main: './src/main.js', admin: './src/admin.js' },
  output: { filename: '[name].[contenthash].js' }
}
\`\`\`

- 适合多页应用。
- 缺点：公共依赖会被各 entry 重复打包。

### 2. 动态 import（懒加载）

\`\`\`js
// 点击时才加载
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js')
  module.doSomething()
})
\`\`\`

- Webpack 自动把动态 import 的模块拆成独立 chunk。
- 配合魔法注释命名：

\`\`\`js
const mod = import(/* webpackChunkName: "chart" */ './chart.js')
\`\`\`

- React/Vue 路由懒加载本质就是动态 import：

\`\`\`js
const Home = React.lazy(() => import('./Home'))
const routes = [{ path: '/', component: () => import('./Home.vue') }]
\`\`\`

### 3. SplitChunksPlugin（公共依赖抽取）

\`\`\`js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        vendors: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
\`\`\`

- 自动抽取 node_modules 到 vendors chunk。
- 多处复用的模块抽到 common chunk。
- \`maxSize\` 进一步拆分大 chunk（接近 244KB）。

## chunk 类型

| 类型 | 来源 |
| --- | --- |
| initial | 入口直接依赖 |
| async | 动态 import |
| all | 两者都处理 |

## 文件名与缓存

\`\`\`js
output: {
  filename: '[name].[contenthash].js',
  chunkFilename: '[name].[contenthash].js'
}
\`\`\`

- contenthash：基于内容，不变则 hash 不变，可强缓存。
- runtime chunk 单独抽出，避免修改业务代码影响 vendors：

\`\`\`js
optimization: { runtimeChunk: 'single' }
\`\`\`

## 预加载（prefetch / preload）

\`\`\`js
import(/* webpackPrefetch: true */ './next-page')
import(/* webpackPreload: true */ './critical')
\`\`\`

- prefetch：浏览器空闲时低优先级加载。
- preload：当前页高优先级加载。

## 按需加载 CSS

\`\`\`js
import('./styles.css')  // 配合 MiniCssExtractPlugin 拆出独立 CSS chunk
\`\`\`

## 检查产物

- \`webpack-bundle-analyzer\`：可视化各 chunk 体积。
- \`speed-measure-webpack-plugin\`：看构建耗时。

## 实践建议

1. 第三方库（react、vue、lodash）抽 vendors，长期缓存。
2. 路由级懒加载，首屏只加载当前路由。
3. 大依赖（图表、编辑器、PDF）动态加载。
4. 共用业务模块（>2 处使用）抽 common。
5. 合理设置 maxSize 防止单 chunk 过大。
6. 用 contenthash + 长缓存策略。

## 与 Vite 的对比

Vite 开发期不需要手动配置代码分割，浏览器原生 ESM 自动按需加载；生产构建用 Rollup 的 \`manualChunks\` 实现类似效果。`
  },
  {
    id: 'perf-014',
    category: 'performance',
    title: 'Tree Shaking 如何减少前端包体积？有哪些注意事项？',
    difficulty: '中等',
    tags: ['Tree Shaking', '构建优化', '包体积'],
    answer: `## 定义

Tree Shaking：构建时静态分析模块依赖，**删除未被引用的导出代码**，减小最终产物体积。形象比喻：摇树让枯叶（无用代码）掉落。

## 为什么影响性能

包体积直接关系：

- **下载时间**：大 bundle → TTFB 后下载久 → FCP/LCP 慢。
- **解析与执行**：JS 下载后还需解析、编译、执行，体积大主线程耗时长，影响 TBT/TTI。
- **缓存命中率**：大 bundle 改动后 hash 变化，缓存失效。

每减少 100KB JS（gzip 后约 30-40KB），在 3G 弱网下能省数百毫秒。

## 前提条件

1. **必须使用 ES Module**（\`import/export\`）。
   - CJS 是动态的（\`require\` 可在条件分支里），无法静态分析。
2. **模块无副作用** 或正确标记。

## 副作用标记

\`\`\`json
// package.json
{
  "sideEffects": false
}
\`\`\`

或指定有副作用的文件：

\`\`\`json
{ "sideEffects": ["./src/polyfill.js", "*.css"] }
\`\`\`

## 工作原理

1. 构建工具（Rollup / Webpack / esbuild）解析 ESM 静态结构，构建模块依赖图。
2. 标记每个 export 是否被 import 引用。
3. 未被引用的 export 在压缩阶段被删除（minifier 如 terser / esbuild 做死代码消除 DCE）。

## 常见阻碍

| 问题 | 说明 |
| --- | --- |
| 使用 CJS | \`require()\` / \`module.exports\` 无法 tree-shake |
| 整包默认导出 | \`export default { a, b, c }\` 后用具名访问，难以分析 |
| 函数有副作用 | 工具保守保留 |
| 动态属性访问 | \`obj[someKey]\` 难静态分析 |
| 类未直接调用的方法 | 可能被反射使用，难删除 |
| 引入了 polyfill / 全局 CSS | 有副作用必须保留 |

## 最佳实践

- 业务按需引入：\`import { debounce } from 'lodash-es'\`（lodash-es 支持，lodash CJS 不支持）。
- 避免整包 \`import _ from 'lodash'\`。
- 库作者用 ESM 导出，\`sideEffects\` 标注准确。
- 用具名导出而非默认导出对象。
- 引入 polyfill 用 \`@babel/preset-env\` + \`useBuiltIns: 'usage'\` 按需。

## 验证

- 构建后检查产物（搜索未使用的函数名）。
- Vite / Rollup 可视化：\`rollup-plugin-visualizer\`。
- Webpack：\`webpack-bundle-analyzer\`。
- 对比开启/关闭 tree-shaking 的体积差异。

## 与代码分割协作

- Tree-shaking：去掉未引用代码。
- Code Splitting：把代码拆成按需加载的 chunk。
- 二者结合：每个 chunk 都只包含真正用到的代码，按需加载，体积最小。

## 常见误区

1. "我用了 ESM 就一定 tree-shake 生效"——还取决于副作用标记与写法。
2. "类的方法没用到会自动删除"——多数情况不会，因为可能被反射使用。
3. "整包 import 后只用具名访问就行"——默认导出对象难以分析，用具名导出更可靠。`
  },
  {
    id: 'perf-015',
    category: 'performance',
    title: 'Core Web Vitals 进阶：FID 与 INP 的区别、LCP 元素如何定位？',
    difficulty: '困难',
    tags: ['Core Web Vitals', 'INP', 'FID', 'LCP'],
    answer: `## 背景

Core Web Vitals 三大指标：LCP、INP、CLS。本篇深入**测量与优化细节**。

## FID vs INP

### FID（First Input Delay）已弃用

- 只测量**首次**输入到主线程开始响应的延迟。
- 不包含事件处理执行时间，也不包含下一帧绘制时间。
- 缺陷：只反映第一次，后续卡顿无法体现；很多页面首次输入在 idle 时段，FID 看起来很好但实际交互卡。

### INP（Interaction to Next Paint）2024 年 3 月正式取代 FID

- 测量**所有**交互（点击、键盘、指针）从触发到下一帧绘制的延迟。
- 取所有交互的**最坏值**（近似 P98）。
- 反映整个页面生命周期交互流畅度。

| | FID | INP |
| --- | --- | --- |
| 范围 | 仅首次输入 | 所有交互 |
| 包含 | 仅延迟 | 延迟 + 处理 + 绘制 |
| 目标 | ≤ 100ms | ≤ 200ms |
| 反映 | 早期响应 | 整体交互体验 |

## INP 的三个阶段

一次交互延迟 = Input Delay + Processing Time + Presentation Delay

1. **Input Delay**：输入到达主线程前的等待（主线程被长任务占用）。
2. **Processing Time**：事件处理器执行时间。
3. **Presentation Delay**：处理器返回到下一帧绘制的时间（渲染工作）。

定位时需分析是哪一段慢。

## 测量 INP

\`\`\`js
import { onINP } from 'web-vitals'
onINP(metric => {
  console.log('INP', metric.value, metric.attribution)
  // attribution 包含：target（触发元素）、interactionType、loadState 等
})
\`\`\`

或用 PerformanceObserver 监听 \`event\` entry：

\`\`\`js
new PerformanceObserver(list => {
  for (const e of list.getEntries()) {
    if (e.interactionId) {
      console.log({
        target: e.target,
        duration: e.duration,
        startTime: e.startTime,
        processingStart: e.processingStart
      })
    }
  }
}).observe({ type: 'event', buffered: true })
\`\`\`

## INP 优化

1. **拆分长任务**：\`scheduler.yield()\`、\`setTimeout\`、\`postMessage\` 切片。
2. **减少 JS 体积**：按需加载、tree-shaking。
3. **避免主线程拥挤**：第三方脚本用 Worker、\`requestIdleCallback\` 延后。
4. **优化事件处理器**：缓存计算、避免同步重排。
5. **使用 \`startTransition\`**（React）标记非紧急更新。
6. **\`content-visibility: auto\`** 减少离屏渲染开销。

## LCP 元素定位

LCP 元素是首屏最大的内容元素（图片、视频、文本块、背景图）。

\`\`\`js
import { onLCP } from 'web-vitals'
onLCP(metric => {
  console.log('LCP', metric.value)
  console.log('element', metric.attribution.element)
  console.log('url', metric.attribution.url)
  console.log('TTFB', metric.attribution.timeToFirstByte)
  console.log('resourceLoadDelay', metric.attribution.resourceLoadDelay)
  console.log('resourceLoadTime', metric.attribution.resourceLoadTime)
  console.log('elementRenderDelay', metric.attribution.elementRenderDelay)
})
\`\`\`

或 PerformanceObserver：

\`\`\`js
new PerformanceObserver(list => {
  const entries = list.getEntries()
  const last = entries[entries.length - 1]
  console.log('LCP element', last.element, last.size, last.startTime)
}).observe({ type: 'largest-contentful-paint', buffered: true })
\`\`\`

## LCP 优化路径

LCP 时间 = TTFB + 资源加载延迟 + 资源加载时间 + 元素渲染延迟

每一段都可能成为瓶颈：

| 阶段 | 优化 |
| --- | --- |
| TTFB | CDN、SSR、边缘缓存、服务端响应优化 |
| Resource Load Delay | preload 关键资源、避免链式加载 |
| Resource Load Time | 压缩、CDN、WebP/AVIF、HTTP/2 |
| Element Render Delay | 减少阻塞 JS、关键 CSS 内联、字体 \`font-display: swap\` |

## CLS 优化细节

CLS = 所有意外布局偏移的累积分数（影响分数 × 距离分数）。

常见原因与对策：

| 原因 | 对策 |
| --- | --- |
| 图片无尺寸 | 设 \`width\`/\`height\` 或 \`aspect-ratio\` |
| 字体加载切换（FOIT/FOUT） | \`font-display: swap\` + 字体尺寸匹配、预加载字体 |
| 动态插入内容（广告、弹窗） | 预留占位容器、避免在已渲染内容上方插入 |
| 异步 DOM 注入 | 用 \`min-height\` 占位 |
| 动画用 width/top | 改用 \`transform\` |

测量：

\`\`\`js
import { onCLS } from 'web-vitals'
onCLS(metric => {
  console.log('CLS', metric.value, metric.attribution)
  // 查看每次 shift 的 sources
})
\`\`\`

## 实战建议

- 用 RUM（真实用户监控）采集 P75 数据，而非只看 Lighthouse 实验室数据。
- 优先优化 P75 不达标的指标。
- INP 是当前最易踩坑的指标（多由第三方脚本与长任务导致）。
- 改动后 A/B 验证指标变化。
- 分批次优化：先达到"良好"门槛，再追求更优。`
  },
  {
    id: 'perf-016',
    category: 'performance',
    title: '长任务（Long Task）深度优化：分片、让出主线程、调度 API 有哪些实践？',
    difficulty: '困难',
    tags: ['长任务', 'Time Slicing', 'scheduler', '主线程'],
    answer: `## 长任务的危害

主线程单次执行超过 **50ms** 即为长任务。超过阈值会：
- 阻塞交互响应（INP 飙升）。
- 掉帧（动画/滚动卡顿）。
- 输入事件排队，延迟累加。

50ms 是 RAIL 模型的"可感知"阈值，实际每帧只有约 16.6ms（60fps）用于 JS 执行 + 样式 + 布局 + 绘制。

## 定位长任务

### PerformanceObserver 捕获

\`\`\`js
new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log({
      duration: entry.duration,
      startTime: entry.startTime,
      name: entry.name,          // 'self' | 'same-origin' | 'cross-origin'
      attribution: entry.attribution // Chrome 118+，定位具体脚本
    })
  }
}).observe({ type: 'longtask', buffered: true })
\`\`\`

### Chrome DevTools 定位

- Performance 面板录制 → Main 线程火焰图 → 选中宽条 → 看 Bottom-Up 排序。
- Long Tasks 面板（DevTools Experiments 中可开启）。

## 拆分策略

### 1. 循环分片（Time Slicing）

把大循环拆成多片，每片 ~20ms，剩余留给渲染与交互：

\`\`\`js
async function processChunked(items, processFn, budget = 20) {
  let i = 0
  while (i < items.length) {
    const start = performance.now()
    while (i < items.length && performance.now() - start < budget) {
      processFn(items[i++])
    }
    // 让出主线程
    await yieldToMain()
  }
}

function yieldToMain() {
  return new Promise(resolve => setTimeout(resolve, 0))
}
\`\`\`

### 2. 使用 scheduler.yield()（现代浏览器）

Chrome 115+ 的 \`scheduler.yield()\` 比 setTimeout 更智能，会把后续任务插入高优队列而非末尾：

\`\`\`js
async function processChunked(items, processFn) {
  for (let i = 0; i < items.length; i++) {
    processFn(items[i])
    if (i % 100 === 0 && 'scheduler' in window) {
      await scheduler.yield()
    }
  }
}
\`\`\`

### 3. requestIdleCallback 做低优任务

\`\`\`js
function processWhenIdle(items, processFn) {
  let i = 0
  function work(deadline) {
    while (i < items.length && deadline.timeRemaining() > 0) {
      processFn(items[i++])
    }
    if (i < items.length) requestIdleCallback(work)
  }
  requestIdleCallback(work, { timeout: 5000 })
}
\`\`\`

### 4. scheduler.postTask 优先级调度

\`\`\`js
scheduler.postTask(() => renderCriticalUI(), { priority: 'user-blocking' })
scheduler.postTask(() => analyticsFlush(),    { priority: 'background' })
scheduler.postTask(() => preloadNextPage(),   { priority: 'user-visible' })
\`\`\`

## 常见长任务来源与对策

| 来源 | 典型场景 | 对策 |
| --- | --- | --- |
| 大数据渲染 | 大列表、万级节点 | 虚拟列表 + 分片 + content-visibility |
| JSON 解析 | 接口返回 10MB+ JSON | 流式解析（NDJSON）、后端分页、Worker 中 parse |
| 正则回溯 | \`(a+)+b\` 类灾难回溯 | 限制输入长度、改用字符串方法、RE2 |
| 同步计算 | 加密、hash、diff、排序 | Web Worker、WASM、分片 |
| 样式/布局 | 大量节点 + 频繁读取 offsetTop | 批量读取 + 批量写入、避免强制同步布局 |
| 第三方脚本 | 统计、广告、SDK | 异步加载、defer、Worker 化、延迟初始化 |

## 防止阻塞渲染

### 强制同步布局（FSL）陷阱

\`\`\`js
// 错误：写→读→写→读，每轮强制重新布局
for (const el of elements) {
  el.style.width = (el.offsetWidth + 10) + 'px'
}

// 正确：先全部读取，再统一写入
const widths = elements.map(el => el.offsetWidth)
elements.forEach((el, i) => {
  el.style.width = (widths[i] + 10) + 'px'
})
\`\`\`

## content-visibility 减少离屏工作

\`\`\`css
.card-item {
  content-visibility: auto;   /* 离屏时跳过渲染（布局/绘制） */
  contain-intrinsic-size: 200px; /* 预留高度防滚动条跳动 */
}
\`\`\`

长列表配合虚拟列表使用，双重减少渲染工作。

## 验证效果

- Performance 录制对比前后长任务数量与总时长。
- \`web-vitals\` 观察 INP 变化。
- \`Total Blocking Time\`（Lighthouse）是否下降。
- RUM 采集 P75 INP，真实用户体感是否改善。

## 总结流程

1. **发现**：PerformanceObserver + RUM 识别长任务热点。
2. **定位**：DevTools 火焰图确定具体代码。
3. **分类处理**：计算→Worker/分片；渲染→虚拟列表/contain；样式→避免 FSL；第三方→延迟/defer。
4. **调度**：scheduler API / rIC / rAF 合理排布任务。
5. **验证**：指标 + RUM 双重验证。`
  },
  {
    id: 'perf-017',
    category: 'performance',
    title: 'Web Worker 优化实践：适用场景、通信开销与 SharedArrayBuffer？',
    difficulty: '困难',
    tags: ['Web Worker', 'SharedArrayBuffer', '多线程', '并行计算'],
    answer: `## Worker 家族

| 类型 | 特点 | 场景 |
| --- | --- | --- |
| **Dedicated Worker** | 单页面专用，一对一 | 通用计算卸载 |
| **Shared Worker** | 同域多 Tab 共享 | 多页共享状态 / 计算 |
| **Service Worker** | 网络代理 + 缓存 | PWA、离线缓存、拦截请求 |
| **Worklet** | 渲染/音频线程钩子 | CSS Houdini、Audio Worklet |
| **Navigator.hardwareConcurrency** | 逻辑核心数 | 决定并行 Worker 数量 |

## 典型适用场景（什么适合移到 Worker）

- 纯计算、与 DOM 无关：
  - 大数据排序/过滤/聚合（1w+ 条）。
  - 加解密（AES、RSA、哈希）。
  - 图片处理（Canvas 像素操作、压缩、滤镜）。
  - 复杂算法（PathFinding、Markdown 解析、模板编译）。
  - 数据序列化/反序列化（大 JSON parse）。
  - WebAssembly 实例运行。

**不适合**：DOM 操作、依赖 window/document、需要高频小数据（通信开销反超收益）。

## Worker 基础使用

\`\`\`js
// main.js
const worker = new Worker('./worker.js', { type: 'module' })
worker.postMessage({ type: 'sort', data: bigArray })
worker.onmessage = (e) => renderSorted(e.data)
worker.onerror = (e) => console.error(e.message)

// 用完销毁
worker.terminate()

// worker.js
self.onmessage = (e) => {
  if (e.data.type === 'sort') {
    const result = e.data.data.sort(customComparator)
    self.postMessage(result)
  }
}
\`\`\`

## 结构化克隆与传输代价

\`postMessage\` 默认使用 **Structured Clone Algorithm**，对大数据有拷贝开销：

| 数据量 | 克隆 1 次耗时（估算） | 建议 |
| --- | --- | --- |
| < 10KB | < 1ms | 直接 postMessage |
| 10KB - 1MB | 1 - 20ms | 可接受，评估频率 |
| > 1MB | > 20ms | 考虑 Transferable / SAB |

### Transferable Objects（转移所有权，零拷贝）

\`\`\`js
const u8 = new Uint8Array(10 * 1024 * 1024) // 10MB
// 第二个参数是 Transferable 列表，转移后主线程无法再访问
worker.postMessage(u8, [u8.buffer])
\`\`\`

适用类型：\`ArrayBuffer\`、\`MessagePort\`、\`ImageBitmap\`、\`OffscreenCanvas\`。

## 通信模式

### 1. 请求-响应（RPC 封装）

\`\`\`js
// main.js 简易 RPC
class WorkerRPC {
  constructor(url) {
    this.worker = new Worker(url, { type: 'module' })
    this.id = 0
    this.pending = new Map()
    this.worker.onmessage = ({ data }) => {
      const { id, result, error } = data
      const p = this.pending.get(id)
      error ? p.reject(error) : p.resolve(result)
      this.pending.delete(id)
    }
  }
  call(method, payload) {
    const id = ++this.id
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.worker.postMessage({ id, method, payload })
    })
  }
}
\`\`\`

### 2. 流式数据（MessageChannel / ReadableStream）

适合大文件处理、音视频帧：

\`\`\`js
const channel = new MessageChannel()
worker.postMessage({ type: 'stream', port: channel.port2 }, [channel.port2])
// 主线程通过 channel.port1 持续发送分片
\`\`\`

### 3. OffscreenCanvas（主线程/Worker 同一张画布）

\`\`\`js
// 主线程
const canvas = document.querySelector('canvas')
const offscreen = canvas.transferControlToOffscreen()
worker.postMessage({ canvas: offscreen }, [offscreen])

// Worker 中直接绘制，不阻塞主线程
self.onmessage = ({ data }) => {
  const ctx = data.canvas.getContext('2d')
  renderHeavyAnimation(ctx)
}
\`\`\`

## SharedArrayBuffer（SAB）共享内存

SAB 让主线程与 Worker、Worker 与 Worker 之间**直接共享同一块内存**，免去序列化。

### 前提条件（COOP/COEP 安全头）

\`\`\`http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
\`\`\`

否则浏览器禁用 SAB 以防 Spectre 漏洞。

### 使用

\`\`\`js
// main.js
const sab = new SharedArrayBuffer(1024 * 1024) // 1MB
const view = new Float32Array(sab)
worker.postMessage({ sab, length: view.length })

// 原子操作避免竞争
Atomics.store(view, 0, 3.14)
Atomics.load(view, 0)
Atomics.add(view, 1, 1)
Atomics.wait(view, 2, 0)   // 等待第 2 位不为 0
Atomics.notify(view, 2, 1) // 唤醒 1 个等待者
\`\`\`

### 多 Worker 并行

\`\`\`js
const CORES = navigator.hardwareConcurrency || 4
const workers = Array.from({ length: CORES }, () => new Worker('./slice.js'))
// 每个 Worker 处理数据的一段，用 SAB 写入同一个结果数组
\`\`\`

## 性能陷阱

1. **通信 vs 计算权衡**：数据小、计算简单，主线程更快（postMessage 有开销）。经验法则：计算 > 50ms 才考虑 Worker。
2. **Worker 启动开销**：创建 Worker 需要几 ms 到几十 ms，复用 Worker 池而非每次新建。
3. **序列化代价**：大对象走 Transferable 或 SAB，否则克隆比计算还慢。
4. **不要滥用 Worker**：过多 Worker 导致调度开销 + 内存占用，上限通常 \`hardwareConcurrency - 1\`。
5. **内存占用**：每个 Worker 独立 JS Heap，通常占用几 MB。

## Worker 池模式

\`\`\`js
class WorkerPool {
  constructor(size, url) {
    this.queue = []
    this.workers = Array.from({ length: size }, () => ({
      worker: new Worker(url, { type: 'module' }),
      busy: false
    }))
    this.workers.forEach(w => {
      w.worker.onmessage = ({ data }) => {
        w.busy = false
        w.current?.resolve(data)
        this.runNext()
      }
    })
  }
  submit(task) {
    return new Promise(resolve => {
      this.queue.push({ task, resolve })
      this.runNext()
    })
  }
  runNext() {
    const free = this.workers.find(w => !w.busy)
    const item = this.queue.shift()
    if (free && item) {
      free.busy = true
      free.current = item
      free.worker.postMessage(item.task)
    }
  }
}
\`\`\`

## 诊断与调试

- Chrome DevTools → **Sources → Page → Workers**：给 Worker 打断点。
- **Memory 面板**：分别看 Main 与各 Worker 的 Heap。
- **Performance 面板**：Worker 线程会独立出现（WebWorker 轨道）。

## 框架生态

- React：\`@shopify/react-web-worker\`、\`use-worker\`。
- Vue：\`useWebWorker\`（@vueuse/core）。
- 通用：\`Comlink\`（Google，简化 RPC）、\`workerize\`（函数自动转 Worker）。
- 构建：Vite 的 \`new URL('./worker', import.meta.url, { with: { type: 'worker' } })\`。

## 决策树

\`\`\`
JS 任务慢？
 ├─ < 50ms → 主线程 + 分片即可
 ├─ 50-500ms，纯计算 + 小数据 → 单个 Dedicated Worker
 ├─ 纯计算 + 大数据 (MB 级) → Worker + Transferable / SAB
 ├─ 可并行，CPU 密集 → 多个 Worker + SAB 汇总
 ├─ 需要绘图 → OffscreenCanvas Worker
 └─ 需要跨 Tab 共享 → Shared Worker（兼容性注意）
\`\`\``
  },
  {
    id: 'perf-018',
    category: 'performance',
    title: '前端内存泄漏排查实战：常见泄漏模式、Chrome 工具、步骤化定位？',
    difficulty: '困难',
    tags: ['内存泄漏', 'Heap Snapshot', '性能排查', 'GC'],
    answer: `## 何时怀疑泄漏

出现以下现象之一，很可能存在内存问题：

1. 页面长时间运行后越来越卡（GC 频繁）。
2. Performance Monitor 的 JS Heap 曲线阶梯式攀升、不回落。
3. 控制台出现 \`out of memory\` 或 Tab 崩溃。
4. SPA 路由来回切换后，任务管理器中内存只增不减。

## 垃圾回收基础

V8 使用**分代式 GC**：
- **新生代（Scavenge）**：短生命周期对象，复制算法，频繁但很快。
- **老生代（Mark-Sweep / Mark-Compact）**：长生命周期对象，标记-清除-压缩。
- **大对象区**：大对象直接进入老生代。

内存泄漏的本质：**对象虽然不再被业务使用，但仍然被某个引用链可达，GC 无法回收**。

## 定位工具

### 1. Performance Monitor（实时看走势）

Ctrl+Shift+P → Show Performance Monitor：
- **JS Heap size**：关注是否持续上涨、是否在 GC 后下降。
- **DOM Nodes / JS Event Listeners**：两者不降反升通常意味着 DOM 泄漏。

### 2. Performance 面板（录制 + 内存轨道）

录制 1-2 分钟典型操作（进出页面、重复交互），打开 **Memory** 轨道：
- 正常：锯齿形（GC 定期回收）。
- 泄漏：只升不降，或 GC 后基线不断抬高。

### 3. Heap Snapshot 对比（最精确）

步骤：
1. DevTools → Memory → 选 **Heap snapshot**。
2. 操作前 → 拍快照 **Snapshot 1**。
3. 重复典型操作 5-10 次（让泄漏放大）。
4. 手动 GC（垃圾桶按钮 Collect garbage）。
5. 拍快照 **Snapshot 2**。
6. 切到 Snapshot 2，顶部下拉选 **Comparison**，对比 Snapshot 1。
7. 按 **# Delta**（新增数量）降序，找异常增长的类型。

重点关注：
- **Detached DOM tree / HTMLDivElement** 等：DOM 被移除但仍被 JS 引用。
- **Closure / System / Context**：闭包持有变量。
- **Array / Object / Set / Map**：无限追加不清理。
- 构造函数名（自定义类、组件实例）。

### 4. Retainers 链（找到谁在引用）

选中可疑对象 → 下方 Retainers：
- 从对象沿引用链反推到根（window、全局变量、闭包、定时器、事件监听）。
- 距离（Distance）越小，离根越近。
- 典型根：\`window\` 属性、定时器列表、事件监听器表、全局 Store。

### 5. Allocation instrumentation on timeline（定位分配代码）

录制操作后，按时间看哪些函数分配了最多的对象。配合调用栈直接定位代码行。

## 常见泄漏模式（实战清单）

### ① 未清理定时器

\`\`\`js
// 坏：组件销毁未清理
setInterval(() => { tick(store.state) }, 1000)

// 好：保存 ID + 生命周期清理
const timer = setInterval(...)
onUnmounted(() => clearInterval(timer))
\`\`\`

Heap 中表现为闭包引用的对象无法释放。

### ② 未移除的事件监听（含全局）

\`\`\`js
// 坏：只 add，没有 remove
window.addEventListener('resize', handleResize)

// 好：保存引用 + 匹配移除
window.addEventListener('resize', handleResize)
onUnmounted(() => window.removeEventListener('resize', handleResize))

// 更好：AbortController 一次性清理多个
const ac = new AbortController()
window.addEventListener('resize', handleResize, { signal: ac.signal })
el.addEventListener('click', onClick, { signal: ac.signal })
onUnmounted(() => ac.abort())
\`\`\`

匿名函数导致 removeEventListener 无法匹配，这是最常见错误之一。

### ③ 脱离 DOM 的引用（Detached DOM）

\`\`\`js
// 坏：组件级变量缓存 DOM
let el
function mount() {
  el = document.createElement('div')
  document.body.appendChild(el)
}
function unmount() {
  document.body.removeChild(el)
  // 漏了 el = null，el 仍持有整个 DOM 子树 + 监听器
}
\`\`\`

Snapshot 里搜 "Detached" 可直接看到。

### ④ 闭包持有大对象 / 外部作用域

\`\`\`js
// 坏：虽然只用到 log，但闭包保留了整个 huge
function setup() {
  const huge = new Array(1e6).fill('x')
  return function log() { console.log('hi') }
}
const fn = setup() // huge 常驻

// 好：把不用的变量拆出去，或手动置 null
\`\`\`

### ⑤ 无限增长的集合

\`\`\`js
// 坏：全局消息队列 / 缓存只 push 不 pop
const history = []
socket.on('msg', (m) => history.push(m))  // 没上限

// 好：LRU 或 固定长度
const MAX = 500
socket.on('msg', (m) => {
  history.push(m)
  if (history.length > MAX) history.shift()
})
\`\`\`

### ⑥ Map / Set 键持有对象

\`\`\`js
// 坏：即使 user 没用了，map 还持有引用
const cache = new Map()
function compute(user) {
  if (!cache.has(user)) cache.set(user, heavyCalc(user))
  return cache.get(user)
}

// 好：WeakMap / WeakSet（键为弱引用，不妨碍 GC）
const cache = new WeakMap()  // user 被回收时，对应 entry 自动消失
\`\`\`

### ⑦ 框架中的泄漏

- **React**：useEffect 忘记 return 清理函数；useRef 长期持有大对象/DOM。
  \`\`\`js
  useEffect(() => {
    const onResize = () => {}
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize) // ✅ 必须
  }, [])
  \`\`\`

- **Vue**：在 setup/生命周期注册的监听器、定时器未在 onBeforeUnmount 清理；Pinia 持有组件回调。
- **事件总线 / mitt**：只 on 不 off。

### ⑧ 第三方库泄漏

- 图表库（echarts）忘记 \`dispose\`。
- 富文本编辑器（Quill/Tiptap）忘记销毁。
- 地图 SDK 实例未 destroy。
- Swiper、视频播放器同理。

## 排查步骤（SOP）

1. **复现**：写一份最小操作脚本（如路由 A → B → A 重复 10 次）。
2. **基线**：拍 Snapshot 1。
3. **操作**：执行复现步骤。
4. **GC**：手动触发回收（点垃圾桶），排除可被 GC 但暂未回收的噪音。
5. **拍 Snapshot 2 → 对比 Snapshot 1**。
6. **按 Delta 降序** → 点可疑类型 → 看 Retainers → 定位根引用。
7. **修复 → 重新对比** → Delta 明显下降即验证成功。

## 上线后监控（RUM）

不可能每个场景都在本地验证。生产通过采样上报：

\`\`\`js
// 每 30 秒采样一次（1% 用户）
if (Math.random() < 0.01 && performance.memory) {
  setInterval(() => {
    sendBeacon('/monitor', {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      path: location.pathname,
      ts: Date.now()
    })
  }, 30000)
}
\`\`\`

配合路由埋点，能识别"进入某页面内存持续上涨"的趋势。

## 辅助 API

- \`performance.memory\`（Chrome）：usedJSHeapSize / totalJSHeapSize。
- \`WeakRef\`：观察对象是否被 GC。
- \`FinalizationRegistry\`：对象被回收时触发回调（高级诊断）。
  \`\`\`js
  const reg = new FinalizationRegistry(msg => console.log('被回收：', msg))
  const obj = {}
  reg.register(obj, 'my obj')
  \`\`\`

## 常见误区

1. **"内存涨了就是泄漏"**：浏览器 GC 有惰性，先手动点 Collect garbage 再判断。
2. **"用了框架就不会泄漏"**：框架只帮你管组件内监听器，全局事件/定时器/第三方实例要自己清理。
3. **"快照对比 Delta 全是字符串/数组，没线索"**：点进 Retainers，看外层引用链。
4. **"只看单页"**：SPA 常见是路由切换时泄漏，要多次进出对比。

内存泄漏排查是**重复性对比 + Retainers 链分析**的过程，按步骤执行，基本都能定位到根因。`
  },
  {
    id: 'perf-019',
    category: 'performance',
    title: 'INP（Interaction to Next Paint）深度优化：从测量到三阶段拆解？',
    difficulty: '困难',
    tags: ['INP', 'Core Web Vitals', '交互优化', 'Event Timing'],
    answer: `## INP 背景

INP 在 2024 年 3 月正式取代 FID 成为 Core Web Vitals 三大指标之一。

**定义**：取页面生命周期内**所有用户交互**（点击、键盘、指针）延迟的 **P98 近似值**，从输入触发到下一帧绘制完成。

\`\`\`
INP = max(P98(all interactions))  （2024 年后 Google 调整为类 P98 而非最大值）
\`\`\`

门槛：
- **≤ 200ms**：良好
- **200ms - 500ms**：需改善
- **> 500ms**：差

## INP 三段组成

\`\`\`
交互延迟 = Input Delay + Processing Time + Presentation Delay
\`\`\`

| 阶段 | 含义 | 原因 |
| --- | --- | --- |
| **Input Delay（输入延迟）** | 事件到达 → 主线程开始处理的等待 | 主线程被长任务、渲染、其他事件占用 |
| **Processing Time（处理时间）** | 事件处理器执行到结束的耗时 | 事件回调中同步工作过多、重排、复杂计算 |
| **Presentation Delay（呈现延迟）** | 处理结束 → 浏览器把新帧提交到屏幕 | 样式/布局/绘制工作量大，或动画链式等待 |

## 采集与归因

### web-vitals（推荐）

\`\`\`js
import { onINP } from 'web-vitals'
onINP(metric => {
  const { value, attribution } = metric
  console.log('INP =', value)
  // 关键归因
  console.log('交互类型:', attribution.interactionType)   // 'pointer' | 'keyboard' | 'tap/click'
  console.log('目标元素:', attribution.eventTarget)       // 触发的 DOM
  console.log('输入延迟:', attribution.inputDelay)
  console.log('处理时间:', attribution.processingDuration)
  console.log('呈现延迟:', attribution.presentationDelay)
  console.log('事件名:', attribution.eventType)           // 'click'、'keydown' 等
  console.log('对应事件:', attribution.eventEntries)      // PerformanceEventTiming 数组
})
\`\`\`

### PerformanceObserver 直接监听 Event Timing

\`\`\`js
new PerformanceObserver(list => {
  for (const e of list.getEntries()) {
    if (e.interactionId) {
      const inputDelay = e.processingStart - e.startTime
      const processing = e.processingEnd - e.processingStart
      const presentation = e.startTime + e.duration - e.processingEnd
      console.log(e.name, {
        total: e.duration,
        inputDelay, processing, presentation,
        target: e.target, interactionId: e.interactionId
      })
    }
  }
}).observe({ type: 'event', buffered: true, durationThreshold: 40 })
\`\`\`

## 优化策略（分阶段）

### 一、优化 Input Delay（输入延迟）

**核心：让主线程尽量空闲**。

| 手段 | 说明 |
| --- | --- |
| 拆分长任务 | 把 > 50ms 任务切分（见 perf-016 分片） |
| 延迟第三方脚本 | 统计/广告/CMP 弹窗延迟到 idle 或交互后 |
| Web Worker 化计算 | 加密/大数据/解析移出主线程 |
| \`scheduler.yield\` | 关键流程主动让出 |
| \`requestIdleCallback\` | 非关键工作（埋点、预取）放 idle |
| 减少渲染工作 | 避免初次渲染就处理几千节点 |

### 二、优化 Processing Time（事件处理时间）

**核心：事件回调只做最少必要工作**。

#### 常见热点：

1. **复杂同步计算**
   \`\`\`js
   // 坏：点击时立即处理 1 万条数据
   onClick={() => {
     const result = process(hugeData)  // 200ms
     setResult(result)
   }}
   // 好：分阶段（先 loading，后异步计算 + Worker）
   onClick={async () => {
     setLoading(true)
     const result = await worker.process(hugeData)
     setLoading(false); setResult(result)
   }}
   \`\`\`

2. **同步 setState 太多次**
   \`\`\`js
   // 坏：每次 setter 触发一次调度
   setA(...)
   setB(...)
   setC(...)
   // React 18 通常自动批处理，但事件回调外（Promise、定时器）需手动 flushSync / 合并
   // 好：合并成单个对象或 useReducer
   \`\`\`

3. **大列表重新渲染**
   - 用 \`React.memo\` / \`Vue shallowRef\` / 稳定 key。
   - 避免"点击就 setList 所有项"，只修改变化项。
   - 虚拟列表渲染可见区域。

4. **强制同步布局 / 重复 Layout**
   \`\`\`js
   // 坏：写-读-写-读循环
   boxes.forEach(b => { b.style.top = b.offsetHeight + 'px' })
   \`\`\`

5. **DOM 操作量大**
   - 批量插入用 DocumentFragment。
   - 先 \`display:none\` 再批量改，或 clone 后替换。

6. **事件委托 vs 单项绑定**
   - 长列表用容器级事件委托，避免几千个监听器初始化开销。

### 三、优化 Presentation Delay（呈现延迟）

**核心：让样式/布局/绘制快**。

常见原因：
1. **DOM 节点过多** → 虚拟列表 / 分页 / \`content-visibility: auto\`。
2. **CSS 选择器复杂** → 减少深层后代、\`:has()\` 注意范围。
3. **昂贵的布局** → Flex/Grid 本身很快，但千级子节点递归布局耗时。
4. **阴影/滤镜/混合模式** → 触发重绘慢，大图层尤其注意。
5. **动画用 width/top/margin** → 改用 \`transform\` / \`opacity\`。

\`\`\`css
/* 好：只触发合成 */
transform: translateX(100px);
opacity: 0.5;
/* 配合 will-change 提示（动画前加） */
will-change: transform;
\`\`\`

## 针对不同交互类型的专项

### 点击

- 避免在 click 中做重计算，先给即时反馈（loading 态、涟漪）。
- 300ms 延迟已随 viewport meta 消失，但仍注意 \`pointerdown\` vs \`click\`。

### 键盘输入

- input/textarea 的 input 事件如果触发重计算（搜索联想、富文本），务必**防抖 100-200ms**。
- React 受控组件大量输入卡：考虑 \`useDeferredValue\` / \`startTransition\` 标记低优。

### 滚动 / 拖拽

- scroll 事件中只做 transform 类合成操作，不要读布局属性。
- 可用 \`scroll-linked-animations\` API（新）或 CSS \`animation-timeline\`。

## React 专项

\`\`\`js
// 用 useTransition 把非紧急更新标为低优先级，不阻塞输入
const [isPending, startTransition] = useTransition()
const [query, setQuery] = useState('')
const [list, setList] = useState([])

function onInput(e) {
  setQuery(e.target.value)
  // 搜索结果是"可等待"的，放到 Transition
  startTransition(() => {
    setList(search(e.target.value))
  })
}
\`\`\`

\`\`\`js
// useDeferredValue：让大列表渲染滞后于输入
const deferredQuery = useDeferredValue(query)
const results = useMemo(() => search(deferredQuery), [deferredQuery])
\`\`\`

## Vue 专项

- 大型列表用 \`v-memo\` 条件性跳过重渲染。
- 大计算属性改 computed（有缓存）+ 主动拆分。
- v-for 使用稳定 key（不要 index 当 key）。
- 大响应式数据对象用 \`markRaw\` 或 \`shallowRef\` 跳过深层代理。

## 排查流程（Chrome DevTools）

1. **打开 Performance 面板，勾选"Interactions"**。
2. 录制操作，在时间轴上找红色小三角（慢交互）。
3. 选中 Interactions 条目，下方看 Input / Processing / Presentation 三段时间。
4. 点选具体事件，展开 Bottom-Up，看**Self Time** 最大的函数。
5. 结合 React DevTools Profiler（如果有）看渲染耗时。
6. Rendering → Paint flashing 看是否大面积重绘。

## 常见 INP 杀手 TOP 5

1. **第三方脚本**：广告/CMP/统计同步加载，吞掉几百 ms。→ 用 \`defer\` / \`async\` / 延迟到交互后。
2. **首屏加载后立即执行大量脚本**（Hydration）：→ 流式 SSR、Hydration 按需（Islands）。
3. **点击/输入中立即重算大列表**：→ 防抖 / 分片 / Worker。
4. **动画用 JS 改布局属性**（top/width）：→ 改 transform。
5. **组件渲染过深、未 memo**：→ 组件树 Profiler 定位 + memo / 拆分。

## 验证

- Lighthouse 的 INP 模拟数据（实验室数据仅供参考，真实 INP 靠 RUM）。
- RUM 采集 P75 INP：优化前基线 → 优化后灰度 → 比较 P75 是否下降 20%+。
- 保证 95%+ 的交互 < 200ms。

INP 优化的精髓：**让主线程随时空着迎接用户交互**，所有"大"的工作（计算、渲染、第三方）都要想办法拆分、延后、移出。`
  },
  {
    id: 'perf-020',
    category: 'performance',
    title: '骨架屏（Skeleton Screen）原理与实现：服务端注入、自动化生成、视觉一致性？',
    difficulty: '中等',
    tags: ['骨架屏', '首屏优化', '感知性能', 'SSR'],
    answer: `## 骨架屏的价值

骨架屏是一种**感知性能优化**：在内容真正加载完成前，用占位图块提前"形似"渲染，让用户产生"页面在快速渲染"的错觉。

指标层面主要改善：
- **FCP（首次内容绘制）** → 更早出现内容。
- **LCP（最大内容绘制）** → 如果骨架是 LCP 元素，会提前。
- **CLS（布局偏移）** → 骨架占住位置，加载后替换不抖动。
- 用户等待耐心，降低跳出率。

骨架屏 > Loading 转圈 > 白屏。

## 主流实现方案对比

| 方案 | 原理 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **手写 CSS/SVG** | 工程师按 UI 手写结构 | 精准、体积小 | 每页面要写，维护成本高 |
| **组件化骨架** | UI 库 Skeleton 组件组合 | 开发方便 | 首屏依赖 JS，出骨架晚 |
| **页面结构自动生成** | 编译/构建时解析真实 DOM 生成骨架 | 自动化、视觉一致 | 实现复杂 |
| **SSR 直出骨架** | 服务端首屏返回 HTML 骨架（无数据）+ 异步注水 | 出骨架最快 | 改造 SSR 架构 |
| **预渲染骨架** | 构建时预渲染空状态页，塞进 index.html | 无 SSR 也能用 | 多路由需多 HTML |

## 手写骨架屏（CSS 方案）

\`\`\`html
<style>
.skeleton-block {
  background: linear-gradient(
    90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0   50%; }
}
</style>

<div class="card">
  <div class="skeleton-block" style="height: 200px; margin-bottom: 16px;"></div>
  <div class="skeleton-block" style="width: 60%; height: 24px;"></div>
  <div class="skeleton-block" style="width: 90%; height: 16px; margin-top: 8px;"></div>
  <div class="skeleton-block" style="width: 40%; height: 32px; margin-top: 16px;"></div>
</div>
\`\`\`

要点：
- **宽高匹配真实元素**，防止替换时 CLS。
- 动画用**背景位移动画**比 opacity 闪屏更自然。
- 移动端用 \`aspect-ratio\` 保持比例。

## 自动化生成骨架屏

### 方案 A：无头浏览器（Puppeteer/Playwright）

构建时启动浏览器 → 打开页面（数据 mock 为空）→ 截图或抽取样式 → 生成骨架 HTML。

\`\`\`js
// 构建脚本示例
const puppeteer = require('puppeteer')
async function genSkeleton(url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on('request', r => {
    // 拦截接口，返回空数据
    if (r.url().includes('/api/')) r.respond({ body: '[]', contentType: 'application/json' })
    else r.continue()
  })
  await page.goto(url, { waitUntil: 'networkidle0' })

  // 注入脚本：遍历 DOM，把文本/图片换成占位块
  const skeleton = await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      // 识别可见元素，按类型替换为骨架块
    })
    return document.body.innerHTML
  })
  // 输出到 skeleton.html 或注入到 index.html
  await browser.close()
}
\`\`\`

### 方案 B：Vue/React 编译期插件（如 vue-skeleton-webpack-plugin）

构建时用 SSR 渲染指定路由的空状态组件，注入 HTML 的 \`<!-- shell -->\` 占位符。

优点：骨架和 UI 同源，视觉高度一致。

## SSR 骨架屏 + 注水（最佳性能体验）

传统 SSR 首屏 HTML 包含真实数据，问题是：
- 服务端等待接口数据 → TTFB 慢。
- 首字节晚 → FCP / LCP 晚。

**"SSR 骨架"变种**：
1. 服务端**不等待业务接口**，立刻返回包含骨架的 HTML。
2. 浏览器先看到骨架（FCP 极早）。
3. JS 拉取数据后 hydrate，替换骨架为真实内容。

\`\`\`js
// server
app.get('/', async (req, res) => {
  // 先返回骨架 HTML，不等待接口
  const html = renderAppShell() // <div id="app"><!-- 骨架 --></div>
  res.type('html').write(html)
  // 后台异步拉取数据，通过 stream 追加到 HTML（Streaming SSR）
  const data = await fetchData()
  res.write(\`<script>window.__INITIAL_STATE__=\${JSON.stringify(data)}</script>\`)
  res.end()
})
\`\`\`

配合 **Streaming SSR + Selective Hydration**（React 18 / Vue 3）体验最佳。

## 骨架屏切换到内容

### 避免 CLS

\`\`\`css
.skeleton, .real-content {
  /* 关键：尺寸必须一致 */
  aspect-ratio: 16 / 9;
  min-height: 200px;
}
.real-content[hidden] { display: none; }   /* 不用 visibility，否则仍占布局干扰测量 */
\`\`\`

### 动画过渡（可选）

\`\`\`css
.skeleton { transition: opacity .3s; }
.skeleton.hide { opacity: 0; pointer-events: none; position: absolute; }
\`\`\`

替换时机：
- 列表接口 resolve 后、setState 前 20-50ms 淡出骨架，避免闪烁。
- 图片骨架用 LQIP（低质量占位）+ 真实图 onload 切换。

## 图片骨架

### LQIP（Low Quality Image Placeholder）

\`\`\`html
<picture>
  <!-- 20x20 压缩缩略图转 base64 做占位，极体积极快 -->
  <img src="data:image/jpeg;base64,/9j/4AAQ..." 
       data-src="real.jpg"
       loading="lazy"
       decoding="async"
       class="lqip" onload="this.classList.add('loaded')">
</picture>
<style>
.lqip { filter: blur(20px); transform: scale(1.05); transition: .5s; }
.lqip.loaded { filter: blur(0); transform: scale(1); }
</style>
\`\`\`

或 SQIP（SVG 轮廓占位）、SVG 平均色。

## 何时不该用骨架屏

1. **加载 < 50ms**：骨架一闪而过反而干扰。
2. **接口不稳定/常失败**：骨架出现后立刻出错，体验比"重试按钮"差。
3. **内容高度不可预知**：骨架与真实布局差太多，产生明显 CLS。
4. **低性能设备**：骨架动画本身增加 GPU 负担。

替代方案：
- 渐进式内容（真实标题先出、列表逐个渲染）。
- 内容本地缓存（Cache First / SW），优先展示旧数据。
- 乐观更新（点击后直接显示 UI，后台同步）。

## 骨架屏埋点验证

\`\`\`js
// 骨架显示到内容显示的时间，优化效果直接可测
performance.mark('skeleton-show')
// 内容 ready 时
performance.mark('content-ready')
performance.measure('skeleton-2-content', 'skeleton-show', 'content-ready')
// 上报该指标，对比优化前后是否改善"感知首屏"
\`\`\`

## 工程化推荐方案

- **单页、少量页面**：手写 + UI 库 Skeleton 组件，成本低。
- **多页面 + 统一风格**：用无头浏览器编译期生成骨架，注入到各路由 HTML。
- **SSR 项目**：Streaming SSR 骨架 + 数据注水，TTFB 与 FCP 双优。
- **关注 CLS**：骨架 → 真实内容的尺寸必须一致，切换动画用 opacity 避免影响布局。`
  },
  {
    id: 'perf-021',
    category: 'performance',
    title: '图片优化进阶：AVIF/WebP 编解码、响应式策略、CDN 动态裁剪？',
    difficulty: '困难',
    tags: ['AVIF', 'WebP', '响应式图片', '图片优化', 'CDN'],
    answer: `## 现代图片格式对比

| 格式 | 压缩效率 | 解码速度 | 兼容性 | 最佳场景 |
| --- | --- | --- | --- | --- |
| **AVIF** | 最高（比 JPEG 小 ~50%，WebP ~20%） | 慢（CPU 编码更慢） | Chrome 85+、Firefox 93+、Safari 16+ | 照片、复杂图像 |
| **WebP** | 高（比 JPEG 小 25-35%） | 快 | Chrome 8+、Firefox 65+、Safari 14+ | 通用、照片/透明 |
| **JPEG XL** | 高、无损支持好 | 中等 | Chrome 试点后撤回 | 暂无（保留技术栈） |
| **JPEG** | 低 | 最快 | 全部 | 兜底、老浏览器 |
| **PNG** | 低（无损） | 快 | 全部 | 图标、简单透明图 |
| **SVG** | 矢量无损 | 快 | 全部 | 图标、Logo、图形 |
| **GIF** | 极低 | 慢 | 全部 | 用 WebM/MP4 替代 |

**结论**：优先 AVIF，其次 WebP，最后 JPEG/PNG 兜底。

## <picture> 多重回退

\`\`\`html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <!-- 兜底 -->
  <img src="hero.jpg" width="1200" height="800" alt="Hero"
       loading="eager" decoding="async" fetchpriority="high">
</picture>
\`\`\`

浏览器按顺序选择第一个能解码的 source。

## 响应式图片策略

### 固定尺寸，多分辨率（Retina 适配）

\`\`\`html
<!-- 固定宽 300px，提供 1x / 2x / 3x 版本 -->
<img srcset="logo@1x.png 1x, logo@2x.png 2x, logo@3x.png 3x"
     src="logo@1x.png" width="300" height="60" alt="Logo">
\`\`\`

适合：Logo、头像、图标（DPR 决定）。

### 自适应宽度，按视口切换尺寸

\`\`\`html
<img
  srcset="
    pic-480w.avif   480w,
    pic-960w.avif   960w,
    pic-1440w.avif 1440w,
    pic-2000w.avif 2000w"
  sizes="
    (max-width: 640px)  100vw,
    (max-width: 1024px) 75vw,
                         960px"
  src="pic-960w.jpg"
  alt="Product"
  width="960" height="600"
  loading="lazy">
\`\`\`

**两个关键属性**：
- \`srcset\`：列出所有可用版本 + 各自像素宽。
- \`sizes\`：告诉浏览器"在不同媒体条件下，图片占视口的 CSS 宽度"。

浏览器公式：
\`\`\`
选择的 src = 满足 (w >= CSS宽 * DPR) 的最小版本
\`\`\`

例：iPhone 14 Pro（DPR=3）390px 视口 → CSS 宽 390px × 3 = 1170px → 选 1440w 那档。

## art-direction（布局级不同图）

不同屏幕用**不同构图**的图片（手机剪特写、桌面用全景）：

\`\`\`html
<picture>
  <source media="(max-width: 640px)" srcset="close-up.avif" type="image/avif">
  <source media="(min-width: 641px)" srcset="wide.avif" type="image/avif">
  <img src="wide.jpg" alt="Banner">
</picture>
\`\`\`

## 图片加载策略

### fetchpriority 分配带宽

\`\`\`html
<!-- 首屏大图：高优先 -->
<img src="hero.jpg" fetchpriority="high" loading="eager">

<!-- 列表首屏下方的图：主动降优先，抢 LCP 带宽 -->
<img src="card1.jpg" fetchpriority="low" loading="lazy">
\`\`\`

### loading 懒加载

\`loading="lazy"\` 由浏览器判断"进入视口前多少像素才加载"，兼容：
- Chrome 77+、Firefox 115+、Safari 15.4+。
- 列表页、详情页下方非首屏图必备。

### decoding="async"

异步解码，不阻塞主线程渲染其他内容。现代浏览器大多默认，但显式声明更稳妥。

### preload 关键 LCP 图

\`\`\`html
<link rel="preload" as="image" href="hero.avif"
      imagesrcset="hero-960.avif 960w, hero-1600.avif 1600w"
      imagesizes="100vw"
      type="image/avif">
\`\`\`

能把 LCP 提早 100-500ms。

## CDN 动态裁剪与格式自动

主流 CDN（七牛、阿里云、Cloudflare、imgix）支持 **URL 参数**在边缘节点动态生成：

\`\`\`
https://cdn.example.com/img.jpg?imageMogr2/
  /thumbnail/!960x600r/          # 尺寸
  /format/avif                   # 输出格式（或 auto）
  /quality/75                    # 质量
  /blur/1x0/quality/20           # LQIP 模式
\`\`\`

### 配合浏览器自动选格式

CDN 根据 \`Accept\` 请求头判断：
\`\`\`http
Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*
\`\`\`

命中后 CDN 自动返回 AVIF → WebP → JPEG 最优解。业务端只需一张原图 URL，省心。

## 编码质量与体积权衡

### 质量参数经验值

| 类型 | JPEG q | WebP q | AVIF q |
| --- | --- | --- | --- |
| 照片 | 75-85 | 70-80 | 55-65 |
| 缩略图 | 60-70 | 55-65 | 45-55 |
| 产品图 / 细节敏感 | 85-90 | 80-90 | 70-80 |

质量下降是"体积优化之王"，肉眼几乎分辨不出 q75 vs q95，体积差 2-3 倍。

### 编码工具

- **Squoosh**（谷歌在线）：手动对比多格式视觉差异。
- **sharp**（Node，libvips 封装）：构建时批量转码。
  \`\`\`js
  const sharp = require('sharp')
  sharp('in.jpg')
    .resize(1200)
    .avif({ quality: 60, effort: 6 })  // effort 越高越慢压缩越好
    .toFile('out.avif')
  \`\`\`
- Vite 插件：\`vite-plugin-imagemin\` 构建时处理。

### AVIF 注意事项

- **编码慢**（比 WebP 慢 10x+）：务必预生成，不要在请求时生成。
- **高 effort 提升小**：effort 6 是性价比甜点，7/9 收益递减。
- **动画 AVIF（aGIF 替代）**：兼容不如 WebP 动图普及。

## 背景图片优化

\`\`\`css
/* 选格式 + 分辨率 + DPR */
.bg {
  background-image: url('hero.jpg');                       /* 兜底 */
}
@supports (background-image: image-set(url('a') type('image/webp'))) {
  .bg {
    background-image: image-set(
      url('hero.avif') type('image/avif') 1x,
      url('hero@2x.avif') type('image/avif') 2x,
      url('hero.webp') type('image/webp') 1x,
      url('hero.jpg') 1x
    );
  }
}
\`\`\`

## 图像元素优化

### <img> 始终设 width/height 防 CLS

\`\`\`html
<img width="800" height="600" ...>
<!-- 或 CSS 替代 -->
<div style="aspect-ratio: 4/3;"><img style="width:100%;height:100%" ...></div>
\`\`\`

### SVG 优化

\`\`\`bash
# svgo 压缩 SVG（去无用 group、path、元数据）
npx svgo -i in.svg -o out.svg
\`\`\`

小图标走 inline SVG 或 SVG Sprite，避免 HTTP 请求。

## <video> 替代 GIF

\`\`\`html
<!-- GIF 体积 2.2MB → WebM 180KB -->
<video autoplay loop muted playsinline>
  <source src="anim.webm" type="video/webm">
  <source src="anim.mp4"  type="video/mp4">
</video>
\`\`\`

## 工程化清单

发布前用 Lighthouse 或 \`unlighthouse\` 扫一遍，常见问题自动出：
- 图片未按现代格式。
- 尺寸远大于显示尺寸。
- 缺 width/height 引起 CLS。
- 首屏可延迟加载。
- 能压缩 25%+ 的图。

**落地步骤**：
1. 静态图：构建时 sharp 批量出 AVIF/WebP/JPEG 三档。
2. 动态图：CDN 自动格式 + 按参数裁剪。
3. srcset + sizes + lazy + async + aspect-ratio 标配。
4. LCP 图 preload + fetchpriority=high。
5. SVG 走 svgo，GIF 转 WebM。

图片通常占首屏体积 50-70%，优化图片是 LCP 改善最高收益的动作之一。`
  },
  {
    id: 'perf-022',
    category: 'performance',
    title: '打包体积分析与优化：分析工具、依赖治理、去重、代码分割、压缩全流程？',
    difficulty: '困难',
    tags: ['包体积', 'bundle analysis', '代码分割', '压缩优化'],
    answer: `## 为什么关注体积

- **下载慢**：体积 × 带宽决定首屏等待。弱网 3G 下 100KB ~ 1 秒。
- **解析/编译慢**：V8 解析 JS 速率约几 MB/s，移动端更慢，1MB JS 需 50-200ms。
- **执行慢**：更多代码 = 更多启动期初始化 = 更长 TBT/TTI。
- **缓存失效代价大**：大包改动 hash 变化，缓存命中率低。

经验：gzip 后每减少 100KB，首屏可快 200-500ms（弱网更明显）。

## 第 1 步：分析体积（先度量再优化）

### 可视化分析工具

| 工具 | 用途 |
| --- | --- |
| **rollup-plugin-visualizer**（Vite/Rollup） | 生成 treemap sunburst HTML，交互式看各模块占比 |
| **webpack-bundle-analyzer**（Webpack） | 经典 3D 矩形树图 |
| **vite-bundle-visualizer** | Vite 一键开箱 |
| **source-map-explorer** | 基于 source map 定位到源码行 |
| **Bundlephobia**（在线） | 查看任意 npm 包体积（打包后 gzip） |

### Vite 示例

\`\`\`bash
npx vite-bundle-visualizer
# 或配置插件
npm i -D rollup-plugin-visualizer
\`\`\`

\`\`\`js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'
export default {
  plugins: [visualizer({ open: true, filename: 'stats.html', gzipSize: true })]
}
\`\`\`

### Webpack 示例

\`\`\`bash
npm i -D webpack-bundle-analyzer
# webpack.config.js 配置后
WEBPACK_ANALYZE=true npm run build
\`\`\`

### 重点关注

1. **Top N 大模块**：通常 2-3 个包会占总体积 50%+。
2. **重复出现的依赖**：moment.js、lodash、core-js 多版本并存。
3. **"预期之外"的大块**：例如只 import 一个组件，却引入了整个 Antd / Element Plus。
4. **gzip 与原始大小**：可压缩比低（< 30%）说明已压缩/非文本，需进一步处理。

## 第 2 步：依赖治理

### 替换重依赖

| 常见大依赖 | 小体积替代 |
| --- | --- |
| moment.js（300KB+，含所有 locale） | dayjs（2KB） / date-fns（按需） |
| lodash（70KB+） | lodash-es 按需 / 直接写工具函数 |
| axios（17KB） | 原生 fetch（封装一下即可）/ ky（2KB） |
| 全量 echarts（800KB+） | 按需引入（echarts/core + 具体图表）/ 走 CDN |
| babel-polyfill 全量 | core-js + useBuiltIns: usage 按需 |
| 富文本（CKEditor/TinyMCE 大几百 KB） | 轻量 Tiptap / 懒加载 |

**实战技巧**：Bundlephobia 搜包看体积，优先选 gzip < 10KB 的库。

### 检测多版本并存

\`\`\`bash
# pnpm / npm 都可用
pnpm why lodash          # 看谁依赖了哪个版本
npx dedupe-check         # 检查重复
pnpm dedupe              # 尝试合并到同一版本（兼容 semver 时）
\`\`\`

### 外部化（Externals / CDN）

大库且被多页面共用，走 CDN + 外链：

\`\`\`js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'vue']
    }
  }
}
// index.html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
\`\`\`

适合：C 端流量大 + 利用用户浏览器公共缓存。

## 第 3 步：Tree Shaking 彻底生效

### 必要条件清单

1. **使用 ESM**：所有业务代码 \`import/export\`。
2. **package.json 标注 sideEffects**：
   \`\`\`json
   { "sideEffects": ["*.css", "*.scss", "./src/polyfill*"] }
   \`\`\`
3. **不要整包 import 默认导出对象**：
   \`\`\`js
   // 坏：难以 tree-shake
   import _ from 'lodash'
   // 好：lodash-es 具名导入
   import { debounce, throttle } from 'lodash-es'
   \`\`\`
4. **第三方库用 ESM 版本**：用 \`xxx-es\`（如 lodash-es）或看 package.json 的 module 字段。
5. **避免动态属性访问**：\`obj[computedKey]\` 难静态分析。

### 验证 Tree-shaking

Vite 构建后产物里 \`grep\` 未使用的函数名是否存在。或用 \`agadoo\` 检查库是否可 tree-shake。

## 第 4 步：代码分割（Code Splitting）

### 路由级懒加载（最有效）

\`\`\`js
// React
const Home = React.lazy(() => import('./pages/Home'))
const Admin = React.lazy(() => import('./pages/Admin'))

// Vue
const routes = [
  { path: '/', component: () => import('./pages/Home.vue') }
]
\`\`\`

通常能把首屏包缩小 30-70%（取决于路由数量）。

### 大依赖 / 功能模块懒加载

- 图表（echarts）：点击"数据面板"时再 import。
- 富文本编辑器（Tiptap）：进入编辑页再加载。
- PDF 预览、Excel 导入导出：按需加载。
- 国际化语言包：只加载当前语言。

### Vite/Rollup manualChunks

把公共依赖拆到独立 chunk，方便缓存：

\`\`\`js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 框架长期缓存
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI 库
          'ui-antd': ['antd', '@ant-design/icons-vue'],
          // 大工具单独拆
          'vendor-chart': ['echarts', 'echarts-wordcloud']
        }
      }
    }
  }
}
\`\`\`

**拆包原则**：
- 长期不换的依赖 → 单独 chunk（vendors）。
- 多个路由共用 → 抽 common。
- 单路由用的大依赖 → 跟路由 chunk 在一起或独立。
- 单个 chunk gzip 后建议 ≤ 200-300KB（过大会被 HTTP/2 单流阻塞）。

## 第 5 步：压缩与优化

### JS / CSS 压缩

Vite 默认用 esbuild（开发/构建）+ Terser/esbuild（生产）。可更激进：

\`\`\`js
// vite.config.js
export default {
  build: {
    minify: 'esbuild',   // 或 'terser'（压缩率稍高，慢）
    target: 'es2015',    // 根据目标浏览器调整，目标现代可 es2020+
    cssMinify: 'esbuild'
  }
}
\`\`\`

Terser 更激进配置（可选）：
\`\`\`js
terserOptions: {
  compress: { drop_console: true, drop_debugger: true, pure_funcs: ['console.log'] },
  format: { comments: false }
}
\`\`\`

### 传输层压缩（必开）

Nginx / CDN 配置：

- **Brotli (br)**：比 gzip 小 15-25%，现代浏览器 95%+ 支持。
- **gzip**：兜底。

\`\`\`nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_types text/plain text/css text/xml application/json application/javascript application/xml;
brotli on;
brotli_types text/css application/javascript application/json image/svg+xml;
\`\`\`

Vite 构建时可提前生成 .gz/.br 预压缩（Nginx 直接读文件，不耗 CPU）：

\`\`\`bash
npm i -D vite-plugin-compression
\`\`\`

### HTML 压缩

Vite 构建默认已压缩 HTML，注意减少内联冗余脚本。

## 第 6 步：移除未使用与无用代码

### 1. 无用 import

\`\`\`bash
# 工具扫描
npx eslint-plugin-unused-imports --fix
npx depcheck   # 检查 package.json 中声明但未使用的依赖
\`\`\`

### 2. TypeScript 类型

确认 TS 产物中类型已被剥离（\`tsconfig\` 的 \`importsNotUsedAsValues: 'error'\`）。

### 3. i18n 语言包

只打包当前语言，其他语言懒加载或服务端注入。

### 4. polyfill 范围精确

\`\`\`json
// babel + preset-env
{
  "presets": [["@babel/preset-env", {
    "targets": { "browsers": ["last 2 versions", "> 1%", "not dead"] },
    "useBuiltIns": "usage",
    "corejs": 3
  }]]
}
\`\`\`

targets 越精确，注入越少 polyfill。

## 第 7 步：环境变量与死代码消除

\`\`\`js
// vite 自动注入 mode，条件分支会在生产构建被消除
if (import.meta.env.DEV) {
  enableMock()
  console.log('mock running')
}
// 生产包不会包含 enableMock 相关代码
\`\`\`

Webpack 用 DefinePlugin 做同样事情。

## 第 8 步：监控与防止回归

### 每次构建检查清单

| 指标 | 红线 |
| --- | --- |
| 首屏 entry gzip 后 | ≤ 200KB，超了要拆包 |
| 单 chunk gzip 后 | ≤ 300KB |
| Lighthouse Performance | ≥ 90 |
| 未使用代码（Coverage 面板） | JS 使用率 > 50% |

### PR 门禁

\`\`\`yaml
# GitHub Actions：超阈值发警告
- name: Size Limit
  run: npx size-limit
\`\`\`

\`size-limit\` 配置 webpack/vite 输出大小上限，超了阻塞合并。

### 基线追踪

- 版本迭代对比历史体积曲线。
- 每次升级大依赖前先看 Bundlephobia 体积变化。

## 完整优化实战流程示例

\`\`\`
1. 初始构建：首屏 JS 1.6MB gzip 600KB
    ↓ 分析：moment 200KB，lodash 全量 100KB，echarts 全量 300KB
2. 依赖替换：moment→dayjs（-200KB）、lodash-es 按需（-80KB）
    ↓  echarts 按需引入（-250KB）
3. 路由懒加载：5 个路由拆分，首屏仅剩当前页（-250KB）
4. vendors 拆分：react / antd 独立，升级缓存命中（架构收益）
5. 开 brotli：整体 -20%
    ↓
6. 结果：首屏 JS 300KB gzip → brotli 后 120KB
   Lighthouse Performance 68 → 94
   TTI 5.6s → 2.1s
\`\`\`

体积优化是**分析 → 治理 → 拆分 → 压缩 → 守红线**的循环，每次大版本升级都要过一遍分析工具。`
  }
]
