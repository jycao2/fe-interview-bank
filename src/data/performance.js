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
  }
]
