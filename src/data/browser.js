export const browserQuestions = [
  {
    id: 'browser-001',
    category: 'browser',
    title: '从输入 URL 到页面展示发生了什么？',
    difficulty: '困难',
    tags: ['导航', '渲染', '网络'],
    answer: `这是一道综合题，覆盖网络、浏览器原理的多个环节：

## 1. URL 解析

- 浏览器解析输入：是搜索词还是 URL？是 URL 则补全协议。
- 解析 URL 的协议、主机、端口、路径、查询、hash。

## 2. DNS 解析

- 逐级查询域名 IP：浏览器 DNS 缓存 → 操作系统 hosts → 本地 DNS → 根 → 顶级域 → 权威 DNS。
- 多级缓存（浏览器、OS、路由器、ISP）。

## 3. 建立 TCP 连接

- 三次握手建立 TCP 连接（HTTPS 还需 TLS 握手：证书校验、密钥协商）。
- 可能复用连接（HTTP keep-alive、HTTP/2 多路复用）。

## 4. 发送 HTTP 请求

- 构造请求行、请求头、请求体。
- 服务端处理并返回响应（状态码、响应头、响应体）。

## 5. 浏览器解析与渲染

1. **解析 HTML** → 构建 **DOM 树**。
2. **解析 CSS** → 构建 **CSSOM 树**。
3. DOM + CSSOM 合成 **渲染树（Render Tree）**（不含不可见节点如 head、display:none）。
4. **布局（Layout / Reflow）**：计算每个节点的几何位置。
5. **绘制（Paint）**：将渲染树转为屏幕像素（绘制各层）。
6. **合成（Composite）**：将多个图层合成最终画面。

## 6. 执行 JS

- 遇到 \`<script>\` 阻塞解析（除非 async/defer），下载执行 JS。
- JS 可能修改 DOM / CSSOM，触发回流重绘。

## 7. 资源加载

- 图片、字体、视频等异步加载，加载完成后回流重绘。

## 8. 触发事件

- \`DOMContentLoaded\`：DOM 解析完成。
- \`load\`：所有资源加载完成。

## 优化点

- DNS 预解析、预连接。
- 减少 HTTP 请求 / 用 HTTP2、CDN。
- 关键 CSS 内联、JS 用 defer。
- 资源压缩、缓存、懒加载。
- 服务端渲染 / 静态化减少首屏 JS。`
  },
  {
    id: 'browser-002',
    category: 'browser',
    title: '浏览器的渲染过程是怎样的？关键渲染路径？',
    difficulty: '困难',
    tags: ['渲染', 'DOM', 'CSSOM', '布局'],
    answer: `## 关键渲染路径（Critical Rendering Path）

浏览器把 HTML / CSS / JS 转化为像素的过程：

\`\`\`
HTML → DOM
CSS  → CSSOM
DOM + CSSOM → Render Tree
Render Tree → Layout（布局/回流）→ Paint（绘制）→ Composite（合成）
\`\`\`

## 1. 构建 DOM

- 字节 → 字符 → Token → Node → DOM 树。
- HTML 解析是**增量**的，能边下载边解析。

## 2. 构建 CSSOM

- CSS 解析为 CSSOM。CSS 下载和解析**会阻塞渲染**（不阻塞 HTML 解析，但阻塞渲染树构建）。
- CSS 层叠、继承计算。

## 3. 渲染树（Render Tree）

- DOM + CSSOM 合成，**只包含可见节点**（排除 head、\`display:none\`；\`visibility:hidden\` 仍在）。

## 4. 布局（Layout / Reflow）

- 计算渲染树中每个节点的**位置和大小**（盒模型）。
- 视口尺寸变化、节点尺寸变化都会触发重新布局。

## 5. 绘制（Paint）

- 将每个节点绘制到**图层**上：文本、颜色、图像、边框、阴影等。
- 可能分多个图层（z-index、transform、opacity 触发独立图层）。

## 6. 合成（Composite）

- 各图层按顺序合成最终画面，由合成线程 / GPU 完成，不阻塞主线程。

## 阻塞关系

- **HTML 解析**：被 \`<script>\`（无 async/defer）阻塞。
- **渲染**：被 CSS 阻塞（CSS 未就绪不会渲染）。
- **JS 执行**：会等待 CSSOM 就绪（因为 JS 可能查询样式）。

## 优化

- **减少关键资源**：内联关键 CSS、异步加载非关键 CSS。
- **减少关键路径长度**：defer JS、预加载关键资源。
- **减少回流**：避免读写布局属性交替、用 transform 做动画。
- **利用合成层**：transform/opacity 动画只触发合成，性能最佳。`
  },
  {
    id: 'browser-003',
    category: 'browser',
    title: '浏览器的存储机制有哪些？',
    difficulty: '中等',
    tags: ['存储', 'localStorage', 'Cookie', 'IndexedDB'],
    answer: `## 主要存储方式

| 方式 | 容量 | 生命周期 | 是否随请求发送 | API |
| --- | --- | --- | --- | --- |
| Cookie | ~4KB | 可设过期时间 | ✅ 自动带 | document.cookie |
| localStorage | ~5-10MB | 永久（手动清除） | ❌ | 同步 |
| sessionStorage | ~5-10MB | 当前会话（标签关闭） | ❌ | 同步 |
| IndexedDB | 几百 MB+ | 永久 | ❌ | 异步，事务型 NoSQL |
| Cache API | 较大 | 永久 | ❌ | 配合 Service Worker |

## Cookie

- 主要用于**身份认证 / 会话**（虽然现代更推荐 token + Authorization 头）。
- 属性：\`HttpOnly\`（JS 不可读，防 XSS 窃取）、\`Secure\`（仅 HTTPS）、\`SameSite\`（防 CSRF）、\`Max-Age/Expires\`、\`Domain/Path\`。
- 每次请求自动携带同域 Cookie，增大请求体积，不适合存大量数据。

## localStorage / sessionStorage

- 同源策略下共享；sessionStorage 还需同标签页。
- 存字符串（对象需 JSON 序列化）。
- 同步 API，主线程阻塞，**不要存大数据**。
- localStorage 跨标签页共享，可配合 \`storage\` 事件实现跨页通信。

## IndexedDB

- 异步、事务型、支持索引、可存对象、容量大。
- 适合离线应用、大量结构化数据（如 PWA、富客户端缓存）。
- API 较繁琐，常用 Dexie.js / idb 等封装。

## Cache API

- 配合 Service Worker 实现离线缓存、请求拦截响应。
- 是 PWA 的核心。

## 选择

- 认证态 → Cookie（HttpOnly）或 token 存 memory + 刷新。
- 简单配置 / 标记 → localStorage。
- 临时会话 → sessionStorage。
- 大数据 / 离线 → IndexedDB。
- 资源缓存 → Cache API。`
  },
  {
    id: 'browser-004',
    category: 'browser',
    title: '浏览器的同源策略与跨域解决方案？',
    difficulty: '中等',
    tags: ['同源策略', '跨域', 'CORS'],
    answer: `## 同源策略

**同源** = 协议 + 域名 + 端口完全相同。同源策略限制：

- **DOM 访问**：不同源的页面不能互相读取 DOM（iframe、window）。
- **Cookie / localStorage / IndexedDB**：同源才能访问。
- **AJAX 请求**：默认不能跨域请求（实际能发，但响应被拦截）。

> 目的：隔离恶意文档，防止 CSRF / XSS 数据窃取。\`<img>\` \`<script>\` \`<link>\` 等标签不受同源限制（这是 JSONP 的基础，也是 CSRF 能利用的点）。

## 跨域解决方案

### 1. CORS（主流）

服务端设置响应头允许跨域：

\`\`\`
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
\`\`\`

- **简单请求**：GET/HEAD/POST + 限定 header / Content-Type，直接发送。
- **预检请求（Preflight）**：非简单请求先发 OPTIONS 预检，通过后才发实际请求。
- 携带 Cookie 时，\`Allow-Origin\` 不能为 \`*\`，必须指定具体域名，且前端 \`credentials: 'include'\`。

### 2. 代理服务器

开发环境用 Vite / webpack devServer proxy，生产用 Nginx 反向代理，让浏览器以为同源：

\`\`\`js
// vite.config.js
server: { proxy: { '/api': { target: 'http://backend', changeOrigin: true } } }
\`\`\`

### 3. JSONP（老旧）

利用 \`<script>\` 不受同源限制，服务端返回调用回调函数的 JS。只支持 GET，有安全风险，已基本淘汰。

### 4. postMessage

跨窗口（iframe / window.open）通信：

\`\`\`js
otherWindow.postMessage(data, targetOrigin)
window.addEventListener('message', e => { if (e.origin === ...) ... })
\`\`\`

### 5. WebSocket

WebSocket 不受同源策略限制（但有自身的安全机制）。

## 跨域相关安全

- CSRF：利用 Cookie 自动携带，用 SameSite、CSRF Token 防御。
- XSS：注入脚本窃取数据，与同源策略配合防御。`
  },
  {
    id: 'browser-005',
    category: 'browser',
    title: '什么是 XSS 和 CSRF？如何防御？',
    difficulty: '中等',
    tags: ['XSS', 'CSRF', '安全'],
    answer: `## XSS（跨站脚本攻击）

攻击者向页面注入恶意脚本，在受害者浏览器中执行，窃取数据 / 劫持操作。

### 类型

1. **存储型**：恶意脚本存入数据库（如评论），他人访问时执行。
2. **反射型**：恶意代码在 URL 参数中，服务端原样返回并执行。
3. **DOM 型**：纯前端 JS 把不可信数据插入 DOM（如 innerHTML）。

### 危害

窃取 Cookie / localStorage、劫持会话、篡改页面、键盘记录、挖矿。

### 防御

1. **输出转义**：渲染用户数据时按上下文转义（HTML / 属性 / JS / URL）。
2. **CSP（Content Security Policy）**：限制脚本来源、禁止内联脚本。
   \`\`\`
   Content-Security-Policy: default-src 'self'; script-src 'self'
   \`\`\`
3. **HttpOnly Cookie**：防止 JS 读取会话 Cookie。
4. **避免 innerHTML / v-html / dangerouslySetInnerHTML** 透传不可信内容。
5. **输入校验**：限制输入格式（白名单）。

## CSRF（跨站请求伪造）

攻击者诱导已登录用户在不知情下向目标站点发送请求，利用浏览器自动携带 Cookie 完成操作（如转账）。

### 防御

1. **SameSite Cookie**：\`SameSite=Lax/Strict\` 限制跨站携带 Cookie（现代浏览器默认 Lax）。
2. **CSRF Token**：服务端下发一次性 token，前端请求带上，服务端校验。
3. **Referer / Origin 校验**：验证请求来源。
4. **关键操作二次确认**：验证码、密码。

## 区别

| | XSS | CSRF |
| --- | --- | --- |
| 本质 | 注入脚本执行 | 伪造请求 |
| 利用 | 信任用户输入 | 信任已登录用户 |
| 防御核心 | 转义 + CSP | Token + SameSite |`
  },
  {
    id: 'browser-006',
    category: 'browser',
    title: '浏览器的事件循环与 Node 事件循环有何不同？',
    difficulty: '困难',
    tags: ['事件循环', 'Node', '浏览器'],
    answer: `## 浏览器事件循环

1. 执行调用栈同步代码。
2. 清空**微任务队列**（Promise.then、queueMicrotask、MutationObserver）。
3. 必要时渲染（rAF 回调 → 样式 → 布局 → 绘制）。
4. 取一个**宏任务**（setTimeout、I/O、UI 事件、postMessage）执行。
5. 回到 2 循环。

关键：**每执行完一个宏任务，就清空所有微任务**，再渲染，再取下一个宏任务。

## Node 事件循环（libuv）

Node 有分阶段的循环，每个阶段有对应队列：

\`\`\`
timers → pending callbacks → idle/prepare → poll → check → close callbacks
\`\`\`
- **timers**：setTimeout / setInterval 回调。
- **poll**：I/O 事件回调。
- **check**：setImmediate 回调。
- **close callbacks**：close 事件。

每个阶段之间会清空微任务（nextTick 优先级最高，先于 Promise 微任务）。

## 主要差异

| 方面 | 浏览器 | Node |
| --- | --- | --- |
| 模型 | 宏任务 + 微任务两队列 | 多阶段 + 微任务 |
| 微任务时机 | 每个宏任务后 | 每个阶段切换时 |
| process.nextTick | 无 | 有，优先级高于微任务 |
| setImmediate | 无 | 有，check 阶段 |
| 渲染 | 有 rAF / 渲染 | 无 |

## Node 11+ 对齐

Node 11 起，\`setTimeout\` / \`setInterval\` 的回调执行后**立即清空微任务**（与浏览器一致），而非等本阶段所有 timer 回调执行完。但不同阶段之间的微任务时机仍是 Node 特有。

## 经典题

\`\`\`js
setTimeout(() => console.log('timeout'))
setImmediate(() => console.log('immediate'))
// Node：在主模块中顺序不确定（取决于事件循环启动时 1ms 是否到）；
//       在 I/O 回调中 setImmediate 一定先于 setTimeout
// 浏览器：无 setImmediate
\`\`\``
  },
  {
    id: 'browser-007',
    category: 'browser',
    title: '浏览器垃圾回收与内存泄漏场景？',
    difficulty: '困难',
    tags: ['内存', 'GC', '泄漏'],
    answer: `## 浏览器内存分区

- **栈**：原始类型、函数调用帧（自动管理，函数返回即释放）。
- **堆**：对象、闭包变量（由 GC 管理）。

## V8 分代回收

- **新生代（Scavenge）**：短命对象，From/To 复制算法，存活少时高效。
- **老生代（标记清除 + 标记整理）**：长命对象，增量 / 并发标记降低停顿。

详见 [JS 垃圾回收机制](#) 一题。

## 常见内存泄漏

1. **意外全局变量**：未声明直接赋值（\`function fn(){ leaked = 'x' }\`）→ 挂到 window。
2. **被遗忘的定时器**：setInterval 未 clear，回调持有闭包。
3. **事件监听未移除**：addEventListener 后组件卸载未 removeEventListener。
4. **闭包持有大对象**：长期存活的闭包引用不再需要的数据。
5. **脱离 DOM 的引用**：DOM 已从文档移除，但 JS 仍持有引用（如变量缓存了节点）。
6. **缓存无限增长**：Map / 对象做缓存未设上限与过期。
7. **WebSocket / 长连接未关闭**。

## 排查工具

- Chrome DevTools → Memory：Heap snapshot 对比、Allocation timeline、Allocation sampling。
- Performance Monitor 观察内存增长曲线。
- Lighthouse 检测长任务 / 内存。

## 预防

- 用 WeakMap / WeakSet 持有可回收引用。
- 组件卸载时清理（clearInterval、removeEventListener、disconnect observer、abort fetch）。
- 缓存设 LRU 上限。
- 避免在闭包中持有大对象。`
  },
  {
    id: 'browser-008',
    category: 'browser',
    title: 'Service Worker 与 PWA 是什么？',
    difficulty: '中等',
    tags: ['Service Worker', 'PWA', '离线'],
    answer: `## Service Worker

- 是浏览器在后台独立线程运行的**脚本**（非主线程），充当网页与网络之间的**可编程代理**。
- 可拦截页面发出的请求，决定从缓存返回还是发往网络，从而实现**离线访问、资源缓存、消息推送、后台同步**。
- 生命周期：install → activate → fetch/message 事件。
- 必须在 HTTPS 下运行（localhost 除外），有作用域限制。
- 不能直接操作 DOM，通过 postMessage 与页面通信。

\`\`\`js
// 注册
navigator.serviceWorker.register('/sw.js')

// sw.js
self.addEventListener('install', e => { /* 预缓存 */ })
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
})
\`\`\`

## Cache API

- 配合 Service Worker 存储 Request / Response，可离线复用。
- 常见策略：Cache First、Network First、Stale While Revalidate、Cache Only、Network Only。

## PWA（Progressive Web App）

利用 Web 技术提供**类原生体验**的应用：

### 核心能力

1. **可安装**：通过 manifest.json 添加到主屏幕，独立窗口运行。
2. **离线可用**：Service Worker + Cache API。
3. **推送通知**：Push API + Notification API。
4. **后台同步**：Background Sync。
5. **响应式 + 安全**：HTTPS、自适应布局。

### manifest.json

\`\`\`json
{
  "name": "My App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fff",
  "icons": [...]
}
\`\`\`

## 适用场景

- 内容型应用、工具站、需要离线能力的业务。
- 对性能与体验要求高但不想发原生包的场景。

## 注意

- Service Worker 更新需"关闭所有标签页激活"，需处理版本与缓存清理。
- iOS 对 PWA 部分能力支持有限。`
  },
  {
    id: 'browser-009',
    category: 'browser',
    title: '重排（reflow）与重绘（repaint）的区别？如何触发与避免？',
    difficulty: '中等',
    tags: ['渲染', '重排', '重绘', '性能'],
    answer: `## 概念

- **重排（Reflow / Layout）**：当元素的**几何属性**（位置、尺寸）变化，浏览器需要重新计算布局，更新渲染树。
- **重绘（Repaint）**：元素外观变化（颜色、背景、阴影等）但**不影响布局**时，重新绘制像素。

> 重排必然引发重绘，重绘不一定引发重排。重排的开销远大于重绘。

\`\`\`
DOM/CSSOM 变化 → Render Tree 更新 → Layout（重排）→ Paint（重绘）→ Composite（合成）
\`\`\`

## 触发重排的操作

1. **修改几何属性**：\`width\`、\`height\`、\`margin\`、\`padding\`、\`border\`、\`position\`（\`top\`/\`left\` 等）。
2. **修改布局相关样式**：\`display\`、\`float\`、\`overflow\`、\`font-size\`、\`text-align\`、\`line-height\`。
3. **增删可见 DOM 节点**：\`appendChild\`、\`removeChild\`、\`innerHTML\` 改变。
4. **读取布局属性**（强制同步布局 / Layout Thrashing）：
   - \`offsetTop/offsetLeft/offsetWidth/offsetHeight\`、\`scrollTop\`、\`clientWidth\`、\`getComputedStyle\`、\`getBoundingClientRect\`。
   - 这些读取会强制浏览器刷新挂起的样式变更，立即计算布局。
5. **窗口变化**：\`resize\`、字体加载完成。
6. **激活伪类**：\`:hover\` 改变布局。

## 触发重绘的操作

- \`color\`、\`background\`、\`box-shadow\`、\`text-decoration\`、\`visibility\`（\`visibility:hidden\` 仍占位，不重排）、\`outline\`。

## 性能优化

1. **避免逐条修改样式**：集中修改 class 或一次设 \`cssText\`，减少重排次数。
2. **避免读写交替（Layout Thrashing）**：

\`\`\`js
// ❌ 每次读取都触发重排
for (let i = 0; i < els.length; i++) {
  els[i].style.left = els[i].offsetLeft + 10 + 'px'
}
// ✓ 先读后写
const lefts = els.map(el => el.offsetLeft)
els.forEach((el, i) => { el.style.left = lefts[i] + 10 + 'px' })
\`\`\`

3. **使用 transform / opacity 做动画**：只触发合成层，不重排不重绘（GPU 加速）。
   - 用 \`transform: translate\` 代替 \`left\`/\`top\`；用 \`scale\` 代替 \`width\`/\`height\`。
4. **脱离文档流动画**：\`position: absolute\` / \`fixed\` 的元素重排不影响其他元素。
5. **批量 DOM 操作**：用 \`DocumentFragment\`、\`display:none\` 后操作再显示、复制节点修改后替换。
6. **避免 table 布局**：table 中任一单元格变化可能触发整表重排。
7. **防抖 \`resize\` / \`scroll\`**。
8. **使用 \`will-change\` 提前提升为合成层**（注意内存开销，不要滥用）。`
  },
  {
    id: 'browser-010',
    category: 'browser',
    title: '浏览器的进程与线程模型是怎样的？',
    difficulty: '困难',
    tags: ['进程', '线程', '架构'],
    answer: `## 多进程架构（Chrome 为例）

现代浏览器采用**多进程架构**，主要进程：

| 进程 | 职责 |
| --- | --- |
| **Browser 进程**（主进程） | 浏览器 UI（地址栏、书签、前进后退）、网络请求调度、子进程管理、文件存储 |
| **Renderer 进程** | 页面渲染、JS 执行、DOM/CSSOM 构建（默认每标签页一个，site isolation 后按站点隔离） |
| **GPU 进程** | 负责 GPU 任务（合成图层、WebGL、视频解码），全局唯一 |
| **Plugin 进程** | 运行插件（Flash 等，已基本淘汰） |
| **Network 进程** | 网络资源加载（部分版本从 Browser 拆出） |
| **Storage 进程** | \`localStorage\`、\`IndexedDB\`、\`Cookie\` 等存储 |
| **Utility 进程** | 音视频解码、CRASH 隔离等辅助任务 |

## 渲染进程内的线程

1. **JS 引擎线程（主线程）**：执行 JS、解析 HTML/CSS、布局绘制。与 GUI 渲染线程**互斥**（JS 执行时渲染暂停）。
2. **GUI 渲染线程**：解析 HTML/CSS、布局、绘制。
3. **事件触发线程**：归 dispatch 事件到主线程的事件队列（鼠标、键盘、定时器等）。
4. **定时器线程**：\`setTimeout\` / \`setInterval\` 计时，到时间把回调推入宏任务队列。
5. **网络请求线程**：XHR / fetch 发起请求，响应回来后回调入队。
6. **合成线程（Compositor）**：接收绘制指令合成图层，独立于主线程，滚动 / transform 动画可在此完成。

## 为什么多进程

1. **稳定性**：一个标签崩溃不影响其他标签和浏览器。
2. **安全性**：沙箱隔离，渲染进程无文件 / 网络权限，防止恶意网页攻击系统。
3. **性能 / 资源**：进程间不共享内存，避免相互影响；可按需启停。代价是内存占用更高。
4. **站点隔离（Site Isolation）**：不同站点的 iframe 跑在不同渲染进程，防止 Spectre 等侧信道攻击窃取跨站数据。

## 关键点

- **JS 与渲染互斥**：长任务（>50ms）会阻塞渲染导致掉帧，应拆分（用 setTimeout / rAF / Scheduler）或放 Web Worker。
- **Web Worker** 运行在独立线程，不阻塞主线程渲染，但不能操作 DOM。
- **GPU 加速**：\`transform\` / \`opacity\` / \`will-change\` 提升合成层，由合成线程 + GPU 处理，主线程不参与。
- **导航**：Browser 进程接收输入 → DNS → 网络 → 创建/复用 Renderer 进程 → 提交数据 → 渲染。`
  },
  {
    id: 'browser-011',
    category: 'browser',
    title: '事件冒泡与事件捕获、事件委托是什么？',
    difficulty: '中等',
    tags: ['事件', '事件冒泡', '事件委托'],
    answer: `## DOM 事件流

一个事件传播分三个阶段：

\`\`\`
捕获阶段（Capture）→ 目标阶段（Target）→ 冒泡阶段（Bubbling）
\`\`\`

- **捕获**：从 \`window\` 一路向下到目标元素的父节点。
- **目标**：触发在目标元素本身（注册的监听器按注册顺序触发，不分捕获/冒泡）。
- **冒泡**：从目标向上回传到 \`window\`。

\`\`\`js
// 第三个参数 useCapture
el.addEventListener('click', fn, false) // 默认冒泡阶段监听
el.addEventListener('click', fn, true)  // 捕获阶段监听
\`\`\`

## 事件冒泡

子元素触发的事件会逐级向上传递，父元素也能收到。

- \`e.stopPropagation()\`：阻止事件继续传播（捕获 / 冒泡都停）。
- \`e.stopImmediatePropagation()\`：阻止传播 + 阻止同元素上后续监听器执行。
- \`e.target\`：真正触发事件的元素；\`e.currentTarget\`：当前绑定监听器的元素。

## 事件委托（Event Delegation）

利用事件冒泡，把多个子元素的事件统一绑到父元素上，通过 \`e.target\` 判断来源。

\`\`\`js
// ❌ 给每个 li 绑定
listItems.forEach(li => li.addEventListener('click', handleClick))

// ✓ 委托给 ul
ul.addEventListener('click', e => {
  const li = e.target.closest('li')
  if (!li) return
  handleClick(li)
})
\`\`\`

### 优点

1. **减少监听器数量**，节省内存与注册时间（尤其动态列表）。
2. **动态元素自动生效**：后续新增的子元素无需重新绑定。
3. 适合大量同类元素的统一处理（表格行、列表项）。

### 不适用

- \`focus\` / \`blur\` 等不冒泡的事件（需用 \`focusin\` / \`focusout\` 替代，或用 capture）。
- 需要精确控制每个元素独立逻辑时。
- 子元素内有复杂结构需 \`closest\` 判断时注意性能。

## 注意

- 少数事件不冒泡：\`mouseenter\` / \`mouseleave\` 不冒泡，\`mouseover\` / \`mouseout\` 会冒泡。
- 老版本 IE 用 \`attachEvent\`，事件只有冒泡阶段；现代 \`addEventListener\` 已统一。`
  },
  {
    id: 'browser-012',
    category: 'browser',
    title: 'requestAnimationFrame 与 requestIdleCallback 的区别？',
    difficulty: '中等',
    tags: ['rAF', 'rIC', '性能', '事件循环'],
    answer: `## requestAnimationFrame（rAF）

- 在**下一次浏览器重绘前**调用回调，频率对齐屏幕刷新率（通常 60Hz，约 16.67ms 一次）。
- 适合**视觉动画**：CSS JS 动画、Canvas 绘制，保证帧同步、不丢帧。
- 回调参数是高精度时间戳 \`DOMHighResTimeStamp\`。
- 标签页不可见时会自动暂停（节省资源）。

\`\`\`js
function loop(t) {
  // 更新动画状态
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
\`\`\`

## requestIdleCallback（rIC）

- 在浏览器**空闲时段**调用回调（事件循环无事可做时），用于低优先级任务，不阻塞关键渲染。
- 回调参数是 \`IdleDeadline\`，有 \`timeRemaining()\` 查询剩余空闲时间、\`didTimeout\` 判断是否超时。
- 可设 timeout：\`requestIdleCallback(fn, { timeout: 2000 })\`，超时后强制调度。

\`\`\`js
requestIdleCallback(deadline => {
  while (deadline.timeRemaining() > 0 && tasks.length) {
    doWork(tasks.shift())
  }
  if (tasks.length) requestIdleCallback(handler)
})
\`\`\`

## 对比

| | requestAnimationFrame | requestIdleCallback |
| --- | --- | --- |
| 触发时机 | 每帧渲染前 | 空闲时段 |
| 频率 | 与刷新率一致（~60fps） | 不固定，忙时可能不触发 |
| 优先级 | 高（视觉相关） | 低（可延迟） |
| 适合 | 动画 / 绘制 | 数据预取、日志上报、离屏计算、延迟非关键任务 |
| 不可见时 | 暂停 | 可能暂停 / 大幅降频 |

## 拆分长任务

主线程长任务（>50ms）会阻塞渲染导致掉帧。可拆成小块用 rIC 或 \`scheduler.postTask()\` / \`setTimeout\` 分片执行：

- rIC：不紧急，可等空闲。
- rAF：要保证每帧更新一次。
- 注意：rIC 中**不要操作 DOM**（可能在渲染后才回调，时序不对）。

## 兼容性

- rAF 兼容性好。
- rIC 在 Safari 较晚才支持，必要时用 setTimeout polyfill 模拟。`
  },
  {
    id: 'browser-013',
    category: 'browser',
    title: '虚拟 DOM 与真实 DOM 的区别？',
    difficulty: '中等',
    tags: ['虚拟DOM', 'DOM', '渲染'],
    answer: `## 概念

- **真实 DOM**：浏览器解析 HTML 后生成的文档对象模型，每个节点是一个对象，附带大量属性和方法。
- **虚拟 DOM（Virtual DOM）**：用普通 JS 对象描述 UI 树的轻量副本（如 React Element、Vue VNode），由框架维护，与真实 DOM 形成映射。

\`\`\`js
// 真实 DOM 节点：对象庞大，属性几百个
const div = document.createElement('div')
div.nodeName // 'DIV'

// 虚拟 DOM：普通对象
const vnode = { type: 'div', props: { className: 'box' }, children: ['hi'] }
\`\`\`

## 核心流程

1. 首次渲染：用虚拟 DOM 树**创建**真实 DOM 并插入文档。
2. 状态更新：生成**新**虚拟 DOM 树。
3. **Diff**：对比新旧虚拟 DOM 树，找出最小变更。
4. **Patch**：只把变更部分应用到真实 DOM（批量、最小化操作）。

## 优势

1. **性能**：直接操作 DOM 触发布局/重绘，频繁操作代价大；虚拟 DOM 通过 diff + 批量更新减少真实 DOM 操作次数。
2. **跨平台**：虚拟 DOM 与平台无关，可渲染到 DOM、原生（React Native）、SSR、Canvas。
3. **声明式编程**：开发者描述"UI 应该是什么样"，框架负责如何更新，无需手动操作 DOM。
4. **批量 / 异步更新**：状态多次变更会被合并，最终一次 diff。

## 误区

- **"虚拟 DOM 比直接操作 DOM 快"**：不准确。手写的、精准的最优 DOM 操作永远更快；虚拟 DOM 的优势在于**可维护性 + 大多数场景下的"够快"**，是性能与开发体验的折中。
- 虚拟 DOM 仍有 diff 开销（O(n) 同层比较 + key 优化），超大规模列表可能不如手动优化。

## Diff 策略（简化）

- **同层比较**：不跨层级移动，只同层 diff。
- **类型相同**复用节点，比对 props / children；类型不同直接替换整个子树。
- **列表用 key**：帮助识别哪些元素是移动 / 新增 / 删除，避免不必要的重建。

\`\`\`
旧：[A, B, C]
新：[A, C, B]
无 key：B→C、C→B（两次重建）
有 key：识别为 B/C 位置交换（仅移动）
\`\`\`

## 现代演进

- React Fiber：将递归 diff 拆成可中断的链表结构，支持时间切片。
- Vue 3 编译时优化：基于模板静态分析，标记动态节点，跳过静态部分 diff（Block Tree / PatchFlag）。
- Svelte：编译期生成精准更新代码，无运行时虚拟 DOM。`
  },
  {
    id: 'browser-014',
    category: 'browser',
    title: 'MutationObserver、IntersectionObserver、ResizeObserver 的区别？',
    difficulty: '中等',
    tags: ['Observer', 'MutationObserver', 'IntersectionObserver'],
    answer: `## 三者总览

都是浏览器提供的异步观察 API，回调在微任务（MutationObserver）或独立任务中触发。

| Observer | 观察对象 | 典型用途 |
| --- | --- | --- |
| MutationObserver | DOM 节点的子树变化（增删节点、属性、文本） | 第三方脚本响应、框架联动、自定义元素 |
| IntersectionObserver | 元素与视口 / 容器的**相交状态** | 图片懒加载、无限滚动、曝光埋点 |
| ResizeObserver | 元素**尺寸**变化 | 自适应组件、容器查询、Canvas 自适应 |

## MutationObserver

\`\`\`js
const ob = new MutationObserver(mutations => {
  for (const m of mutations) {
    // m.type: 'childList' | 'attributes' | 'characterData'
    // m.addedNodes / m.removedNodes / m.attributeName
  }
})
ob.observe(target, {
  childList: true,        // 子节点增删
  attributes: true,       // 属性变化
  subtree: true,          // 观察后代
  attributeFilter: ['class'],
  characterData: true
})
// ob.disconnect() // 停止观察
\`\`\`

- 回调在**微任务**中触发（一批变化合并）。
- 相比已废弃的 \`Mutation Events\`（如 \`DOMNodeInserted\`，同步触发、性能差），异步批量更高效。

## IntersectionObserver

\`\`\`js
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src // 懒加载
      io.unobserve(e.target)
    }
  })
}, { root: null, rootMargin: '100px', threshold: 0.1 })
document.querySelectorAll('img[data-src]').forEach(img => io.observe(img))
\`\`\`

- \`root\`：相对的视口（默认浏览器视口）；\`rootMargin\`：预加载边距；\`threshold\`：相交比例阈值。
- \`entries\` 含 \`isIntersecting\`、\`intersectionRatio\`、\`boundingClientRect\`。
- 不监听 scroll 事件，避免频繁触发，性能远优于 scroll + \`getBoundingClientRect\`。

## ResizeObserver

\`\`\`js
const ro = new ResizeObserver(entries => {
  for (const e of entries) {
    // e.contentRect.width / height
    // e.target
  }
})
ro.observe(el)
\`\`\`

- 观察元素 content box 尺寸变化。
- 比 \`window.resize\` 更细粒度，可观察任意元素（不依赖 window）。
- 注意：回调中改变尺寸可能引发循环，避免在回调里同步写回触发尺寸的样式。

## 通用注意

1. **不再用时 disconnect / unobserve**，避免内存泄漏（尤其组件卸载）。
2. 回调是异步的，不要假设实时性。
3. 避免在回调里做重操作触发新的观察变化（循环）。`
  },
  {
    id: 'browser-015',
    category: 'browser',
    title: 'Web Worker、SharedWorker、ServiceWorker 的区别？',
    difficulty: '中等',
    tags: ['Web Worker', 'SharedWorker', 'ServiceWorker'],
    answer: `## 共同点

- 都在**独立线程**运行 JS，不阻塞主线程。
- 都不能直接操作 DOM（无 \`window\` / \`document\`，可用 postMessage 通信）。
- 同源策略限制。

## 对比

| | Web Worker | SharedWorker | ServiceWorker |
| --- | --- | --- | --- |
| 作用域 | 单个页面 | 多页面共享 | 整个站点（作用域内） |
| 生命周期 | 随页面 | 随所有引用页面 | 独立，浏览器后台长期存在 |
| 通信 | postMessage（一对一） | MessagePort（多对一） | fetch 拦截 / message |
| 主要用途 | CPU 密集计算 | 多标签共享状态 / 数据 | 离线缓存、推送、后台同步 |
| 协议 | 任意 | 任意 | 必须 HTTPS（localhost 除外） |
| 可否拦截请求 | 否 | 否 | 是 |

## Web Worker（Dedicated Worker）

- 最常用，专属于创建它的页面，页面关闭即销毁。
- 适合大数据处理、图片 / 视频解码、复杂计算。

\`\`\`js
// 主线程
const worker = new Worker('/worker.js')
worker.postMessage({ data })
worker.onmessage = e => console.log(e.data)

// worker.js
self.onmessage = e => self.postMessage(heavyCompute(e.data))
\`\`\`

## SharedWorker

- 多个标签页共享同一个 Worker 实例，可做跨标签状态同步、连接池。
- 通过 \`MessagePort\` 通信，需要显式 \`port.start()\`。
- 兼容性一般（Safari 曾长期不支持，现已支持但移动端注意）。

\`\`\`js
const sw = new SharedWorker('/shared.js')
sw.port.onmessage = e => console.log(e.data)
sw.port.postMessage('hi')
\`\`\`

## ServiceWorker

- 充当网页与网络间的**可编程代理**，可拦截 fetch、缓存资源、实现离线 / 推送 / 后台同步。
- 有完整生命周期（install → activate → fetch/push/sync），独立于页面存活。
- 是 PWA 的核心。详见 Service Worker 与 PWA 一题。

\`\`\`js
// 注册
navigator.serviceWorker.register('/sw.js')
// sw.js
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
})
\`\`\`

## 选择

- **单纯计算** → Web Worker。
- **多标签共享数据 / 连接** → SharedWorker（或用 BroadcastChannel / localStorage 事件）。
- **离线 / 缓存 / 推送** → ServiceWorker。

## 注意

- Worker 间数据默认**结构化克隆**传递（大对象有拷贝开销）；可用 \`Transferable\`（ArrayBuffer 等）转移所有权零拷贝。
- Worker 内可用 fetch、IndexedDB、Cache API，但无 DOM / window。`
  },
  {
    id: 'browser-016',
    category: 'browser',
    title: '前端路由的 hash 模式与 history 模式原理是什么？',
    difficulty: '中等',
    tags: ['路由', 'hash', 'history', 'SPA'],
    answer: `## 前端路由本质

SPA 中通过 JS 监听 URL 变化、切换对应组件，**不向服务器发起新请求**。两种实现方式：

## hash 模式

URL 中 \`#\` 后面为 hash（如 \`http://example.com/#/user/1\`）。

- **特点**：hash 变化**不会发请求**到服务器（\`#\` 后部分不会进入 HTTP 请求），也不会刷新页面。
- 监听 \`hashchange\` 事件即可响应路由变化。
- 兼容性好，无需服务端配合。

\`\`\`js
window.addEventListener('hashchange', () => {
  render(location.hash.slice(1))
})
location.hash = '/user/1' // 改变路由
\`\`\`

- 缺点：URL 带 \`#\` 不美观；SEO 不友好；部分第三方服务（如 OAuth 回调）可能丢失 hash。

## history 模式

基于 HTML5 History API：

- \`pushState(state, title, url)\`：添加历史记录，**改变 URL 但不刷新页面、不发请求**。
- \`replaceState\`：替换当前记录。
- \`popstate\` 事件：用户点击前进 / 后退时触发（注意 pushState/replaceState **不会**触发 popstate，需手动调用渲染）。

\`\`\`js
history.pushState({ }, '', '/user/1')
render('/user/1')

window.addEventListener('popstate', e => {
  render(location.pathname)
})
\`\`\`

- URL 干净美观（无 \`#\`），利于 SEO。
- **必须服务端配合**：用户刷新 / 直接访问 \`/user/1\` 时，浏览器会向服务器请求该路径，服务器需配置**回退到 index.html**（fallback），否则 404。

\`\`\`nginx
# Nginx 配置
location / {
  try_files $uri $uri/ /index.html;
}
\`\`\`

## 对比

| | hash | history |
| --- | --- | --- |
| URL | 带 # | 干净 |
| 服务器 | 无需配置 | 需 fallback 到 index.html |
| 兼容性 | 好（IE8+） | IE10+ |
| SEO | 差 | 好 |
| 刷新 | 正常 | 不配置会 404 |
| 实现复杂度 | 低 | 略高 |

## 注意

- history 模式部署到子路径时需配置 \`base\`（如 Vue Router 的 \`createWebHistory('/app/')\`），否则路由匹配错误。
- 现代 SPA 默认 history 模式；老项目或无服务端配置场景用 hash。
- 部分场景（如微信支付回调、分享链接）对 hash 兼容差，优先 history。`
  }
]
