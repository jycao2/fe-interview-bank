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
  },
  {
    id: 'browser-017',
    category: 'browser',
    title: 'WebAssembly 是什么？它的运行原理与适用场景？',
    difficulty: '困难',
    tags: ['WebAssembly', 'WASM', '性能'],
    answer: `## WebAssembly（WASM）定义

一种**低级二进制指令格式**，可在浏览器中以接近原生的速度执行，作为 JS 的补充而非替代。

- **WASM** 不是语言，是**编译目标**。C/C++/Rust/Go/AssemblyScript 等语言可编译到 WASM，在浏览器运行。
- 由 W3C 标准化，所有现代浏览器支持。

## 关键特性

1. **接近原生性能**：二进制格式，启动快、执行快，利用硬件能力（SIMD、多线程提案）。
2. **可移植**：一次编译，在任意 WASM 运行时（浏览器、Node、服务端 WasmEdge/Wasmer）运行。
3. **安全**：沙箱执行，无法直接访问 DOM/系统资源，通过导入函数与宿主交互。
4. **紧凑**：二进制体积比同等 JS 小，下载快。
5. **与 JS 互操作**：JS 可调用 WASM 导出函数，WASM 可调用 JS 导入函数。

## 运行原理

### 1. 编译流水线

\`\`\`
C/C++/Rust 源码
  →（emscripten / rustc）→
.wasm 二进制
  →（浏览器）→
解码 → 验证 → 编译（JIT/AOT）→ 机器码执行
\`\`\`

浏览器中的三个阶段：
- **解码（Decode）**：把二进制字节转为内部模块结构，校验魔数与版本。
- **验证（Validate）**：检查类型安全、栈平衡、内存访问合法，防止非法指令。
- **编译 + 执行**：
  - 多数引擎用 **分层编译**：先 Baseline（快速编译低优化），运行中热点函数重编译为优化 Tier。
  - V8 用 Liftoff（基线）+ TurboFan（优化）。

### 2. 内存模型

- **线性内存（Linear Memory）**：一段连续的可增长字节数组（\`WebAssembly.Memory\`），JS 与 WASM 共享。
- 传大数组时**零拷贝**：直接在共享内存里读写，避免序列化开销。
- 无 GC 内存：WASM 自己管理内存（malloc/free 由运行时提供，如 emmalloc）。

### 3. 与 JS 互操作

\`\`\`js
// JS 加载 WASM
const { instance } = await WebAssembly.instantiateStreaming(fetch('add.wasm'), {
  env: {
    // JS 函数导入给 WASM 调用
    log: (n) => console.log(n)
  }
})
// 调用 WASM 导出
console.log(instance.exports.add(1, 2))
\`\`\`

\`\`\`wat
;; add.wat（文本格式）
(module
  (import "env" "log" (func $log (param i32)))
  (func (export "add") (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add)
)
\`\`\`

## 适用场景

1. **计算密集型任务**：音视频编解码、密码学、3D 渲染、物理模拟、机器学习推理。
2. **移植现有 C/C++ 库**：FFmpeg、OpenCV、SQLite、libpng、PDF 渲染（PDFium）。
3. **游戏引擎**：Unity WebGL、Unreal HTML5 导出本质 WASM。
4. **代码沙箱**：运行不可信代码（插件、用户代码）。
5. **服务端 Wasm**：边缘计算（Cloudflare Workers、Fastly Compute@Edge）、插件系统。

## 不适用场景

- 直接操作 DOM（仍需桥接 JS，无优势）。
- 简单业务逻辑（JS 已足够，WASM 有桥接成本）。
- 对启动体积极敏感的首屏（WASM runtime 有基础开销）。

## 常见工具链

| 语言 | 工具链 |
| --- | --- |
| C/C++ | Emscripten（提供 POSIX/SDL 等 API 模拟，生成带胶水 JS 的 HTML） |
| Rust | wasm-pack + wasm-bindgen，生成 ESM 包友好 |
| Go | TinyGo（体积优）或官方 GOOS=js GOARCH=wasm（体积大） |
| TS/JS 风格 | AssemblyScript（类 TS 语法，新手友好） |

## 提案与未来

- **SIMD**：单指令多数据，向量计算 128bit（已稳定）。
- **Threads**：SharedArrayBuffer + 原子操作（需 COOP/COEP 头）。
- **Exception Handling**：原生异常处理，减少 try/catch 桥接。
- **Reference Types**：直接引用 JS 对象，减少 JS-WASM 拷贝。
- **GC**：WASM 自己的 GC，便于托管语言（Java/C#→WASM）。
- **WASI**：系统接口，让 WASM 能在服务端访问文件/网络，脱离浏览器运行。

## 性能对比

- 数值计算：接近原生 C，比 JS 快 1.5~5x（JS JIT 也在进步）。
- 启动：冷启动有解码+编译成本，适合常驻或预热后场景。
- 桥接：频繁 JS↔WASM 调用有开销，应尽量批量调用、减少边界穿越。`
  },
  {
    id: 'browser-018',
    category: 'browser',
    title: 'Service Worker 常见缓存策略（Cache First / Network First / SWR 等）的选择与实现？',
    difficulty: '中等',
    tags: ['Service Worker', '缓存策略', 'PWA'],
    answer: `## 核心概念

Service Worker 在 fetch 事件中拦截请求，根据资源类型决定"从缓存拿 / 从网络拿 / 先拿哪个 / 是否回写缓存"。Cache 存储由 \`Cache API\`（\`window.caches\`，SW 中 \`self.caches\`）提供。

常见策略：

| 策略 | 行为 | 适用资源 | 特点 |
| --- | --- | --- | --- |
| Cache Only | 只用缓存 | 版本化静态资源（预缓存） | 最快，但离线前必须已缓存 |
| Network Only | 只用网络 | 实时 API、支付请求 | 保证最新，不支持离线 |
| Cache First, Network Fallback | 缓存命中就用，否则走网络 | 静态资源（JS/CSS/图片） | 最快，离线可用，更新靠版本号 |
| Network First, Cache Fallback | 网络成功就用并更新缓存，失败用缓存 | API 数据、HTML 入口 | 尽量最新，网络差兜底离线 |
| Stale While Revalidate (SWR) | 先回缓存（快），后台发网络更新缓存下次用 | 非严格实时数据、统计接口 | 平衡速度与新鲜度 |

## 1. Cache First（缓存优先）

静态资源（带 contenthash 的 JS/CSS/字体/图片）最常用：

\`\`\`js
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((resp) => {
        const clone = resp.clone()
        caches.open('static-v1').then(cache => cache.put(e.request, clone))
        return resp
      })
    })
  )
})
\`\`\`

- 命中缓存立即返回，无网络请求。
- 未命中时走网络并把响应写入缓存，下次即命中。
- 资源更新靠**文件名 hash 变化**（SWR 场景则不用 CF）。

## 2. Network First（网络优先）

尽量拿最新数据，网络失败才兜底旧缓存，适合 HTML 入口、频繁更新的 API：

\`\`\`js
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const clone = resp.clone()
        caches.open('api-v1').then(cache => cache.put(e.request, clone))
        return resp
      })
      .catch(() => caches.match(e.request))
  )
})
\`\`\`

- 离线时仍能展示上一次的数据。
- 缺点：弱网下要等网络超时才兜底，首次响应慢。

## 3. Stale While Revalidate（陈旧即复用 + 后台刷新）

用户感知"秒开" + 后台默默更新下次用，折中方案：

\`\`\`js
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request).then(resp => {
        caches.open('swr-v1').then(cache => cache.put(e.request, resp.clone()))
        return resp
      })
      // 有缓存先返回缓存；同时后台发网络刷新缓存
      return cached || fetchPromise
    })
  )
})
\`\`\`

特点：
- 首请求返回缓存（快），同时异步发起网络请求更新缓存。
- 下一次访问即拿到新版本（典型"最多落后一版"）。
- 适合：非实时数据、列表页内容、统计接口、文章详情。

## 4. Cache Only / Network Only

\`\`\`js
// Cache Only：只返回 install 时预缓存的内容
caches.match(e.request)  // 不回源，不返回网络

// Network Only：不做任何缓存，直接 fetch
fetch(e.request)
\`\`\`

- Cache Only：完全离线可用，更新靠发新版 SW + 预缓存列表变化。
- Network Only：支付、登录、POST 请求、实时流。

## 按资源匹配策略（推荐模板）

\`\`\`js
self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // 同域静态资源：Cache First
  if (url.origin === location.origin && /\.(js|css|woff2|png|jpg|avif|webp)$/i.test(url.pathname)) {
    e.respondWith(cacheFirst(request, 'static-v1'))
    return
  }

  // HTML 文档：Network First
  if (request.mode === 'navigate') {
    e.respondWith(networkFirst(request, 'html-v1'))
    return
  }

  // GET API（非实时）：SWR
  if (request.method === 'GET' && url.pathname.startsWith('/api/feed')) {
    e.respondWith(staleWhileRevalidate(request, 'api-v1'))
    return
  }

  // 其他（POST、跨域等）：Network Only
})
\`\`\`

## 预缓存（Precaching）

在 install 事件中把核心资源一次性缓存，实现离线秒开：

\`\`\`js
const PRECACHE = ['/', '/index.html', '/app.js', '/styles.css']
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('precache-v1').then(c => c.addAll(PRECACHE)))
  self.skipWaiting() // 立即激活，不等旧 SW 退出
})
\`\`\`

## 缓存版本与清理

激活时删除旧版本缓存，避免无限堆积：

\`\`\`js
const CURRENT = ['static-v1', 'api-v1']
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !CURRENT.includes(k)).map(k => caches.delete(k)))
    )
  )
  self.clients.claim() // 立刻接管页面
})
\`\`\`

## 常见坑

1. **响应只能消费一次**：\`resp.clone()\` 后一份入缓存一份返回。
2. **只缓存成功响应**：\`resp.ok === true\` 才写缓存，避免把 404/500 永久写入。
3. **POST 请求不可缓存**：Cache API 只支持 GET/HEAD（可用 IndexedDB 自实现）。
4. **不透明响应（跨域 no-cors）**：status 为 0，体积虚大，慎重缓存。
5. **SW 更新机制**：浏览器检测到 sw.js 字节级变化就安装新版，但要**所有标签页关闭**才激活。策略：\`skipWaiting + clients.claim\` 或提示用户刷新。
6. **Workbox**：Google 出品的 SW 库，已封装所有策略 + 路由 + 预缓存，生产强烈建议用 Workbox 而非手写。`
  },
  {
    id: 'browser-019',
    category: 'browser',
    title: 'Cookie 的 SameSite 属性深入：Strict/Lax/None 的行为、跨站与跨域的区别？',
    difficulty: '中等',
    tags: ['Cookie', 'SameSite', 'CSRF', '安全'],
    answer: `## SameSite 解决什么问题

CSRF（跨站请求伪造）利用"浏览器发请求自动带目标域 Cookie"的特性，诱导用户在恶意站点击提交。SameSite 通过限制**跨站请求**携带 Cookie，从客户端层缓解 CSRF。

## 跨站 vs 跨域（关键区分）

同源策略用"协议 + 域名 + 端口"完全相同判断同源；但 SameSite 按"**站点（Site）**"判断：

- **站点（Site）** = 可注册域名（eTLD+1 / PSL）。
  - eTLD：有效顶级域，如 \`.com\`、\`.co.uk\`（公共后缀列表 PSL 维护）。
  - eTLD+1：\`example.com\`、\`example.co.uk\`、\`a.example.com\` 的站点都是 \`example.com\`。
- **Origin** = 协议 + 主机 + 端口（如 \`https://a.example.com:8443\`）。

结论：
- **同站 ≠ 同源**。\`https://a.example.com\` 与 \`https://b.example.com\` 是**同站不同源**（SameSite 放行）。
- **跨站 ≠ 跨域**。\`https://app.example.com\` 与 \`https://api.example.com\` 是同站不同域，但不是跨站，SameSite 不限制 Cookie 携带。
- 完全不同 eTLD+1（\`foo.com\` vs \`bar.com\`）才是**跨站**，SameSite 生效。

## 三个取值详解

### 1. SameSite=Strict

最严格：**任何跨站请求都不携带 Cookie**，包括顶层导航（点击链接、地址栏跳转）。

\`\`\`
Set-Cookie: sessionId=abc; SameSite=Strict; Secure; HttpOnly; Path=/
\`\`\`

行为：
- 用户在 \`evil.com\` 点击跳转到 \`bank.com\` → **不带** bank.com 的 Cookie（跳过去是未登录态）。
- 外链从微信/钉钉点进企业后台，用户体验差（需重新登录）。
- 跨站 \`<img>\`、\`<iframe>\`、\`fetch\`、表单 POST **全不带**。

适用：极高安全业务（银行后台、核心管理），但体验代价高。

### 2. SameSite=Lax（Chrome 80+ 默认）

平衡安全与体验：**顶层 GET 导航携带，其他跨站请求不带**。

\`\`\`
Set-Cookie: sessionId=abc; SameSite=Lax; Secure; HttpOnly
\`\`\`

携带规则：

| 跨站场景 | 方法/上下文 | 是否带 Cookie（Lax） |
| --- | --- | --- |
| 点击链接顶层跳转 | GET（导航） | ✅ 带 |
| 302 跨站重定向到 GET | GET（导航） | ✅ 带（Chrome 81+ 有 2min 例外） |
| 地址栏直接输入 / 书签 | GET（导航） | ✅ 带（非跨站发起） |
| 跨站子资源 \`<img>\` / \`<script>\` | GET（嵌入） | ❌ 不带 |
| 跨站 iframe 加载 | GET（嵌入） | ❌ 不带 |
| 跨站 \`<form method="GET">\` 提交跳转 | 顶层 GET 导航 | ✅ 带（浏览器行为存在分歧） |
| 跨站 \`<form method="POST">\` 提交 | POST | ❌ 不带 |
| 跨站 fetch / XHR | 任意方法 | ❌ 不带 |

对 CSRF 的效果：
- 传统 POST 表单攻击被挡住（POST 不带 Cookie）。
- 顶层 GET 虽带 Cookie，但只读操作通常无副作用；若 GET 路由存在写操作就危险（所以**GET 必须幂等安全**）。

Chrome 80+ 对未显式声明 SameSite 的 Cookie 视为 Lax，且给出一个"2 分钟 POST 例外"（设置后 2 分钟内跨站 POST 仍带，兼容老旧登录回调，超过则严格 Lax）。

### 3. SameSite=None

跨站请求**也携带** Cookie，必须**同时加 Secure**（Chrome 强制），否则被拒。

\`\`\`
Set-Cookie: third-party-tkn=xyz; SameSite=None; Secure; HttpOnly; Partitioned
\`\`\`

适用场景（需要第三方 Cookie 的）：
- SSO 跨站登录态保持（OAuth/OIDC 多个子系统）。
- 嵌入第三方的购物车、评论、客服 widget。
- 广告追踪、埋点像素、A/B 平台跨站保留用户标识。

注意：
- **Partitioned 属性（CHIPS）**：Chrome 逐步淘汰第三方 Cookie，SameSite=None 的 Cookie 必须加 \`Partitioned\` 才能在第三方上下文中保留（按顶级站点分区隔离），否则未来将被阻止。
- 浏览器必须 HTTPS，localhost 开发可豁免。
- iOS Safari 早期对 SameSite=None 有 Bug，可能误拒绝，需做 UA 兼容或备选方案。

## 携带跨域 Cookie 的完整条件（CORS 场景）

前端 JS 发起跨站请求时，要让 Cookie 被发送并被接收：

\`\`\`js
// 前端
fetch('https://api.another.com/data', {
  credentials: 'include',  // fetch
  // withCredentials: true (XMLHttpRequest / axios)
  mode: 'cors'
})
\`\`\`

同时必须满足：

1. Cookie 上设置 \`SameSite=None; Secure\`（跨站时）。
2. 服务端响应头：
   - \`Access-Control-Allow-Credentials: true\`
   - \`Access-Control-Allow-Origin\` **不能为 \`*\`**，必须具体域名。
   - \`Access-Control-Allow-Headers\` 允许自定义头（如 Authorization）。
3. 预检 OPTIONS 请求通过。

## 与 CSRF Token 的关系

SameSite 大大降低 CSRF 风险，但**不能完全替代 CSRF Token**：

- SameSite 对同站跨子域的攻击（\`a.example.com\` 被注入指向 \`b.example.com\` 的表单）不防护（因为同站）。
- 旧浏览器不支持 SameSite（或用户降级）。
- 浏览器 BUG（如 Chrome 80 早期 Lax 默认的兼容问题）。

生产建议：**SameSite + CSRF Token 双重防御**，配合 Referer/Origin 校验。

## 子域共享 Cookie

- 设置 \`Domain=.example.com\`（带点前缀，兼容老浏览器）时，所有子域 \`a.example.com\`、\`b.example.com\` 都能读写该 Cookie。
- 不设 Domain 则仅当前域（host-only）。
- 但这是"同站"范围，不影响 SameSite 判定（仍是同站）。

## 诊断工具

- DevTools → Application → Cookies → 查看 SameSite 列。
- Network 面板每条请求的 Cookies 标签可看"显示发送的 vs 被阻止的"原因（如 SameSite 拦截）。
- \`chrome://settings/cookies\` 查看站点 Cookie 详情。
- Issues 面板会提示"Some cookies are misusing the recommended SameSite attribute"。`
  },
  {
    id: 'browser-020',
    category: 'browser',
    title: 'XSS 与 CSRF 进阶防护：CSP 指令详解、Trusted Types、CSRF Token 架构与 SameSite 组合策略？',
    difficulty: '困难',
    tags: ['XSS', 'CSRF', 'CSP', 'Trusted Types', '安全'],
    answer: `## XSS 进阶：从"转义"到"纵深防御"

基础的输出转义只能防御反射/存储型注入；现代 XSS 攻击通过 DOM 型、第三方脚本、属性注入绕过。需要**多层防护**：

### 第一层：CSP（Content Security Policy）

HTTP 响应头（或 \`<meta http-equiv>\`）声明信任来源，浏览器**禁止加载/执行不在白名单中的资源**，从根本上拦注入脚本。

#### 常用指令

\`\`\`http
Content-Security-Policy:
  default-src 'self';                         # 默认策略：只信任同源
  script-src 'self' 'nonce-abc123' 'strict-dynamic' https://cdn.example.com;  # JS 来源
  style-src 'self' 'unsafe-inline';           # CSS 来源
  img-src 'self' data: https:;                # 图片：同源、data、任意 https
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com; # fetch/XHR/WebSocket 目标
  frame-ancestors 'none';                     # 禁止 iframe 嵌入（防点击劫持）
  base-uri 'self';                            # 限制 <base> 篡改
  form-action 'self';                         # 限制 form 提交目标
  object-src 'none';                          # 禁止 Flash/插件
  upgrade-insecure-requests;                  # 自动把 HTTP 请求升级 HTTPS
  report-uri /csp-report; report-to default   # 违规上报
\`\`\`

关键字：

| 值 | 含义 | 注意 |
| --- | --- | --- |
| \`'self'\` | 同源（同协议+域+端口） | 不含子域 |
| \`'none'\` | 不允许任何来源 | 用于 object-src 等禁用插件 |
| \`'unsafe-inline'\` | 允许内联脚本/样式 | 降低安全，尽量避免 |
| \`'unsafe-eval'\` | 允许 eval/new Function/setTimeout 字符串 | XSS 重灾区，绝不要开 |
| \`'nonce-xxx'\` | 允许带对应 nonce 属性的内联脚本 | 每次请求随机生成，防重放 |
| \`'sha256-xxx'\` | 允许脚本内容哈希匹配的内联块 | 脚本不变可使用 |
| \`'strict-dynamic'\` | 信任由合法脚本动态加载的脚本 | 配合 nonce/hash 使用 |

#### Nonce 模式（推荐 SPA）

每次响应随机生成 nonce 注入到 CSP 与所有 \`<script nonce="xxx">\` 中：

\`\`\`html
<meta CSP 不支持 → 用 Header>
<script nonce="t8X2p9m...">/* 内联启动脚本 */</script>
\`\`\`

攻击者无法预知 nonce，注入的 \`<script>\` 不带正确 nonce 被 CSP 阻止。

strict-dynamic 可进一步**放宽白名单域名**：只要是"由已信任脚本通过 \`appendChild(createElement('script'))\` 动态引入的"都放行，减少维护具体 CDN 域名列表。

#### Report-Only 模式

先观察不拦截，用于灰度上线 CSP：

\`\`\`
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
\`\`\`

收集一段时间违规后，再切换成强制模式，避免误伤。

### 第二层：Trusted Types

Chrome 83+ 支持，为 DOM 型 XSS 而生。它要求所有"危险 sink"（\`innerHTML\`、\`document.write\`、\`setTimeout(字符串)\`、\`eval\` 等）的入参必须是**Trusted Type 对象**（而非字符串），把"XSS 风险"从转义时前置到 API 的类型系统。

启用：

\`\`\`http
Content-Security-Policy: require-trusted-types-for 'script'; trusted-types myPolicy;
\`\`\`

代码中创建策略：

\`\`\`js
if (window.trustedTypes) {
  const myPolicy = trustedTypes.createPolicy('myPolicy', {
    createHTML: (input) => DOMPurify.sanitize(input),
    createScript: (input) => input,
    createScriptURL: (input) => input
  })

  // ✅ 使用 TrustedHTML
  el.innerHTML = myPolicy.createHTML(userInput)
  // ❌ 直接传字符串：CSP 会在 enforce 模式下抛错
  el.innerHTML = userInput  // "Trusted Type expected" 违规
}
\`\`\`

效果：DOM 型 XSS 的漏洞点在运行时被直接阻断，配合静态扫描（ESLint \`no-unsanitized\`）能把风险降到极低。

### 第三层：输出转义与 API 选择

- 文本用 \`textContent\` 而非 \`innerHTML\`。
- 属性用 \`setAttribute\` 而非字符串拼接 HTML。
- 事件用 \`addEventListener\` 而非 \`onclick="..."\`。
- URL 用 \`new URL(userInput, location.origin)\` 校验协议。
- 第三方富文本必须走白名单 HTML 净化（DOMPurify 而非自写正则）。

## CSRF 进阶：四层防御组合

SameSite Cookie 是第一道，但单独使用不够。推荐架构：

### 1. SameSite=Lax（默认）或 Strict

拦截绝大多数跨站 POST 表单攻击；Strict 用于极高安全业务。

### 2. 同步 CSRF Token（表单/传统 Web）

服务端在渲染 HTML 时下发 token：
- 存到用户 Session 中；
- 写入到 \`<input type="hidden" name="_csrf_token">\` 和 \`<meta>\`。

提交时前端把 token 放入表单字段或自定义 \`X-CSRF-Token\` 请求头；服务端对比 Session 中值（SameSite 不影响同域请求，自定义头不受自动携带）。

### 3. 双提交 Cookie（Double Submit Cookie，SPA 无 Session 场景）

- 登录响应时下发两个：HttpOnly Cookie（含 JWT/会话 ID）+ 普通可读 Cookie（\`csrf_token=随机串\`）。
- 前端请求时读出 \`csrf_token\` Cookie 值，放到自定义头 \`X-CSRF-Token\` 中。
- 服务端校验"请求头中 token"与"Cookie 中 token 是否相等"。

原理：CSRF 攻击者只能让浏览器自动带 Cookie，但**无法读出 Cookie 内容**构造自定义头，所以必失败。

配合 CORS：自定义头会触发预检，预检通过才会携带 Cookie，进一步提升门槛。

### 4. Origin / Referer 校验 + 关键操作二次验证

- 服务端校验 \`Origin\` 或 \`Referer\` 头是否来自可信白名单（注意：Referer 可被用户/浏览器禁用，作为辅助）。
- 转账、修改密码、删库操作要：短信验证码、邮箱 Token、密码二次输入、人脸验证。

## 组合矩阵（最佳实践）

| 能力 | 必选 | 推荐 | 进阶 |
| --- | --- | --- | --- |
| XSS 防护 | 输出转义、HttpOnly Cookie、禁止 unsafe-eval | 严格 CSP + nonce、DOMPurify | Trusted Types、CSP violation 监控 |
| CSRF 防护 | SameSite=Lax 默认、HttpOnly+Secure | 双提交 Cookie / CSRF Token、Origin 校验 | SameSite=Strict（核心）、操作二次确认、验证码 |
| 配合 | — | 全站 HTTPS + HSTS | COOP/COEP、CORS 精细配置 |

## 常见误区

1. **"开了 CSP 就不会被 XSS"**：攻击者仍可能借被允许的第三方域名（如允许了未严格校验的 CDN）发动，要最小权限原则。
2. **"SameSite=Lax 完全防住 CSRF"**：同站跨子域、浏览器旧版、2 分钟例外等仍可能有口子，必须加 CSRF Token 双保险。
3. **"CSP 直接上 enforce"**：先 Report-Only 收集两周，修掉所有违规（包括第三方脚本）再 enforce，否则直接白屏。
4. **"Vue/React 自动转义，不用 CSP"**：仍有 \`v-html\`/\`dangerouslySetInnerHTML\`、\`href=javascript:\`、内联事件、第三方组件漏洞等风险。`
  },
  {
    id: 'browser-021',
    category: 'browser',
    title: '浏览器指纹（Canvas/字体/WebGL/Audio）原理？如何识别与反追踪？',
    difficulty: '中等',
    tags: ['浏览器指纹', '指纹识别', '隐私'],
    answer: `## 定义

浏览器指纹（Browser Fingerprinting）：通过采集浏览器与设备暴露的一系列特征，组合成一个"指纹"，无需 Cookie 即可唯一或高概率识别用户/设备。

- **被动指纹**：仅用浏览器发送的请求头（UA、Accept、IP、语言等）即可生成。
- **主动指纹**：执行 JS 主动查询浏览器 API（Canvas、字体、WebGL、插件、时区…），特征维度更高、识别更准。

## 主要特征维度

### 1. 基础头属性（被动）

\`\`\`
User-Agent / Accept / Accept-Language / Accept-Encoding
Connection / Referer
DNT（Do Not Track）/ 升级不安全请求标识
\`\`\`

单一 UA 不够唯一，组合后可筛大量人群。

### 2. 屏幕与系统

- 屏幕分辨率、色深、DPR（\`window.devicePixelRatio\`）。
- 时区（\`Intl.DateTimeFormat().resolvedOptions().timeZone\`、\`new Date().getTimezoneOffset()\`）。
- 语言与地区：\`navigator.language\` / \`navigator.languages\`。
- 平台：\`navigator.platform\`（Win32 / MacIntel / iPhone）。

### 3. 字体指纹（Font Enumeration）

用 JS 尝试测量各字体在 canvas 中的宽度，判断字体是否存在：

\`\`\`js
function hasFont(fontName) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = '72px "' + fontName + '", monospace'
  ctx.fillText('mmmmmmlli', 0, 100)
  const w = canvas.toDataURL().length
  return w !== baseWidth  // 与后备字体基准比较
}
\`\`\`

Windows、Mac、Office、Adobe 套件安装不同字体，组合数百种字体可极高区分用户。

### 4. Canvas 指纹

绘制一段复杂图形（含阴影、曲线、渐变色、非等宽字体）到 canvas，导出数据哈希：

\`\`\`js
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
ctx.textBaseline = 'top'
ctx.font = '14px Arial'
ctx.fillStyle = '#f60'
ctx.fillRect(0, 0, 80, 20)
ctx.fillText('BrowserFingerprint, 😀 测试', 2, 2)
ctx.strokeStyle = '#06f'
ctx.beginPath(); ctx.arc(50, 50, 30, 0, Math.PI * 2); ctx.stroke()
const fingerprint = canvas.toDataURL()  // → SHA256
\`\`\`

差异来源：
- **操作系统字体渲染**（DirectWrite / CoreText / FreeType）对同样字的像素不同。
- **显卡 / GPU 驱动**抗锯齿算法、像素对齐差异。
- **浏览器版本** Canvas API 实现差别。

同样的代码在不同设备上产生的 toDataURL 字节不同，哈希几乎唯一。

### 5. WebGL 指纹

- \`gl.getParameter(gl.RENDERER)\`、\`VENDOR\`、\`VERSION\` → 显卡型号（如 "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)"）。
- 支持的扩展数（WEBGL_draw_buffers、OES_texture_float 等）。
- 绘制一个带复杂着色器的场景，导出哈希。

高端独显 vs 核显 vs 虚拟机差异巨大。

### 6. Audio 指纹

利用 Web Audio API 生成动态压缩器/振荡器，处理后的音频样本哈希：

- 不同音频栈（CoreAudio / WASAPI / ALSA）+ DAC 差异造成浮点采样末尾微差。
- 指纹脚本通常用离线 AudioContext 处理并哈希。

### 7. 其他维度

- 插件列表：\`navigator.plugins\`（Chrome 已固定列表，但仍有细微差）。
- MIME 类型。
- 触摸屏支持：\`navigator.maxTouchPoints\`。
- 硬件并发数：\`navigator.hardwareConcurrency\`。
- 设备内存：\`navigator.deviceMemory\`（Chrome 暴露粗略档位）。
- 电池 API、蓝牙权限、WebRTC 本地 IP（泄露内网 IP）。
- 已安装权限（通知、摄像头、麦克风）。

## 指纹的组合与稳定度

- 单一特征区分度有限（UA 重复度高），但 20+ 维度组合后，**熵值可达 15~20 bit**，平均每数十万甚至百万用户才出现重复。
- Panopticlick 研究显示：约 80~90% 的浏览器指纹在样本中唯一。

稳定性问题：用户升级浏览器、改系统语言、换分辨率会让指纹变。方案：
- 对变化特征做"宽容匹配"（Levenshtein 距离、加权匹配）。
- 取多个时间窗口的指纹快照"并集"，允许少数维度变化。

## 跨浏览器识别（跨指纹）

同一台设备上 Chrome、Edge、Firefox 的指纹不同（因字体渲染栈、WebGL 暴露差异）。但研究（如 Safari 反追踪指纹、Apple PSI）表明：
- 通过更底层硬件信号（GPU vendor id、屏幕 DPR、CPU 性能 timing、电池状态）仍可跨浏览器关联。
- 第三方库 FingerprintJS Pro 号称跨浏览器 99.5% 准确率。

## 反追踪 / 降低指纹度

### 1. 浏览器内置保护

- **Safari Intelligent Tracking Prevention（ITP）**：限制第三方 Cookie、简化字体枚举、WebGL 限制、隐藏部分参数。
- **Firefox 隐私浏览 + Enhanced Tracking Protection**：rFPS（Resist Fingerprinting，Tor 移植）。
- **Tor Browser**：最严格的反指纹——所有用户返回统一的 UA/时区/屏幕/字体列表/Canvas（返回白屏）/WebGL 参数，做到"所有人指纹一样"。

### 2. Firefox ResistFingerprinting（privacy.resistFingerprinting = true）

- 固定 UA 为 ESR 版本。
- 时区强制 UTC。
- 屏幕分辨率 rounded。
- 字体返回白名单子集，字体测量不准。
- Canvas 返回空哈希，WebGL 返回通用渲染器。
- 代价：部分网站体验下降（时区错乱、字体奇怪、Canvas 应用白屏）。

### 3. 扩展级

- **uBlock Origin**：网络过滤器 + 第三方脚本拦截，减少指纹脚本运行。
- **CanvasBlocker / Canvas Defender**：在 toDataURL 调用时注入噪声（加微小像素偏移或哈希扰动），让每次哈希不同但视觉不影响。
- **NoScript**：全局禁 JS，指纹脚本根本跑不了（极端）。

### 4. 技术对抗"反指纹"

指纹脚本逐步引入抗噪策略：
- 用多次测量比较稳定性，剔除会变的特征。
- 用"特征哈希组"，允许少数位变化仍匹配。
- Canvas 指纹采用"矢量级"而非"位图像素级"（更稳定）。
- 引入行为指纹（鼠标轨迹、键盘节奏、滚动速度）与设备指纹互补。

## 合规

- GDPR、CCPA、国内《个人信息保护法》对"可识别到自然人"的指纹数据视为个人信息，须用户授权同意。
- 不少站点的指纹脚本（FingerprintJS、百度统计等）存在合规风险。
- 浏览器厂商逐步收紧可访问的高风险 API：WebRTC 本地 IP 隐藏、限制 \`navigator.plugins\`、强制分区存储。

## 实际用途 vs 滥用

- 合法：账号风控（异常登录识别）、支付防欺诈、反爬虫。
- 灰色：无 Cookie 跨站广告追踪、绕过 Cookie 黑名单的用户追踪、敏感人群画像。`
  },
  {
    id: 'browser-022',
    category: 'browser',
    title: 'COOP / COEP / CORP 安全头是什么？它们如何让站点更安全与启用 SharedArrayBuffer？',
    difficulty: '困难',
    tags: ['COOP', 'COEP', 'CORP', '安全头', 'Isolation'],
    answer: `## 背景：Spectre 与站点隔离

2018 年 Spectre/Meltdown 处理器漏洞被披露后，浏览器开始把"不同站点的内容"严格隔离到不同进程/地址空间（Site Isolation）。但同源策略仍允许页面与跨源 iframe、window.open 的子窗口共享进程与部分内存，无法防御侧信道攻击。

W3C 提出一系列"Cross-Origin"安全头，让站点主动声明隔离策略。

## 三个核心头总览

| 头 | 全称 | 作用 |
| --- | --- | --- |
| COOP | Cross-Origin-Opener-Policy | 隔离顶层窗口（window.open / 弹窗）的进程 |
| COEP | Cross-Origin-Embedder-Policy | 强制嵌入的跨源资源声明"允许被嵌入" |
| CORP | Cross-Origin-Resource-Policy | 资源本身声明"允许被谁嵌入" |

配合使用后，该页面成为"**跨源隔离上下文（cross-origin isolated）**"，从而解锁：
- **SharedArrayBuffer**（跨线程共享内存，被 Spectre 风险关闭后重新启用）。
- **WebAssembly Threads / Atomics**（WASM 多线程提案）。
- 更高精度的 \`performance.now()\`（放宽精度降级）。
- 更强的侧信道攻击防御。

## 1. COOP（Cross-Origin-Opener-Policy）

控制顶层 window.open 打开的新窗口与 opener 之间的**引用与进程隔离**。

\`\`\`http
Cross-Origin-Opener-Policy: same-origin
\`\`\`

取值：

| 值 | 行为 |
| --- | --- |
| \`unsafe-none\`（默认） | 跨站弹窗仍可互相访问 \`window.opener\` |
| \`same-origin-allow-popups\` | opener 可打开新弹窗，但被打开窗口无法回访问 opener |
| \`same-origin\` | 完全隔离：同源共享上下文；跨源弹窗放入独立进程，\`window.opener\` 置 null |

效果：
- 跨站打开的 B 站窗口无法通过 \`opener.location = evil\` 改 A 站地址（防 tab-nabbing）。
- 跨站弹窗与原页面进程独立，防止 Spectre 跨站读内存。

典型：A（设 same-origin）调用 \`window.open('https://evil.com')\`，evil.com 里的 \`window.opener\` 为 null，也拿不到 A 站的全局变量引用。

## 2. COEP（Cross-Origin-Embedder-Policy）

强制本页面中嵌入的**跨源资源**必须显式声明"允许被我嵌入"，否则浏览器直接拒绝加载。

\`\`\`http
Cross-Origin-Embedder-Policy: require-corp
\`\`\`

取值：
- \`unsafe-none\`（默认）：不限制。
- \`require-corp\`：所有跨源嵌入资源（img、script、style、iframe、fetch）必须带 CORP 或 CORS 允许，否则阻断。
- \`credentialless\`（Chrome 实验性）：跨源无凭证加载资源，放宽 CORP 要求但失去 Cookie/Authorization（适配部分第三方资源）。

被阻断的典型：
- \`<img src="https://other.com/pic.png">\` → other.com 必须给 pic.png 加 \`Cross-Origin-Resource-Policy: cross-origin\` 或 \`Access-Control-Allow-Origin\` + 前端加 \`crossorigin\` 属性，否则显示失败。
- 跨源 iframe：对方必须带 CORP \`same-site / cross-origin\`。

## 3. CORP（Cross-Origin-Resource-Policy）

**资源端**声明允许被谁嵌入（由资源响应头发出）：

\`\`\`http
Cross-Origin-Resource-Policy: same-site
\`\`\`

取值：

| 值 | 允许加载方 |
| --- | --- |
| \`same-site\`（推荐默认） | 仅同站（同 eTLD+1）页面可嵌入 |
| \`same-origin\` | 仅同源（协议+域+端口全同）可嵌入 |
| \`cross-origin\` | 任意跨源都可嵌入（需配合 CSP 等） |

注意：未声明 CORP 的资源在 COEP=require-corp 的上下文中**默认被阻止**。

## 三者联动启用跨源隔离

最小配置：

\`\`\`http
# 你网站的响应头
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp

# 所有加载的跨源静态资源的响应头必须包含其中之一：
Cross-Origin-Resource-Policy: cross-origin   # 或 same-site / same-origin
# 或者
Access-Control-Allow-Origin: *               # 对应 HTML 中加 crossorigin 属性
\`\`\`

前端 JS 验证是否启用：

\`\`\`js
console.log(crossOriginIsolated)  // true → 已进入隔离上下文
\`\`\`

为 true 后，以下能力可用：
- \`new SharedArrayBuffer(1024)\` 不报 TypeError。
- \`Atomics.wait / notify\` 可正常工作。
- WASM Threads（wasm-bindgen-rayon、C++ 编译时 -pthread）。

## 实际启用的常见坑

### 坑 1：第三方资源没 CORP/CORS

CDN 图片、第三方脚本、Google Fonts、Gravatar、iframe 嵌入等需逐一检查：

- 图片/脚本/CSS：在资源服务端加 \`CORP: cross-origin\` 或允许 CORS，HTML 里对应加 \`crossorigin\` 属性（或 anonymous）。
- 常用 CDN（unpkg、jsdelivr、Cloudflare Images）已默认允许 CORS，只需前端加 \`crossorigin\`。
- 广告/统计 iframe 不支持的，要么换 COEP 到 credentialless，要么移除。

### 坑 2：download / blob URL

- 下载跨域文件会被 COEP 拦截，可改用 \`<a download>\` 同源代理下载。
- Worker / Service Worker 注册的脚本也要满足 COEP 与 COOP（同源或带 CORP + CORS + \`crossorigin\`）。

### 坑 3：弹出登录回调

- OAuth 登录弹出第三方窗口时，双方 COOP 不一致会让 \`window.opener.postMessage\` 失效。可设 COOP=same-origin-allow-popups 折中。

### 坑 4：开发环境

- Vite / Webpack dev server 要加响应头：

\`\`\`js
// vite.config.js
export default {
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
}
\`\`\`

## CORB / CORS / COEP 的关系对比

| 机制 | 作用层级 | 目标 |
| --- | --- | --- |
| CORS | 显式允许跨源读 | 开放资源给选定源（白名单） |
| CORP | 资源声明允许谁嵌入 | 阻止自己的资源被其他站嵌入（黑名单/默认拒绝） |
| COEP | 嵌入方强制资源声明 | 在页面侧强制资源必须自证清白 |
| CORB（Cross-Origin Read Blocking） | 浏览器内部 | 拦截"应该是 HTML/JSON 但被当作脚本/图片加载"的响应，防止 XS-Leaks |
| COOP | 顶层窗口隔离 | 防止 opener 引用泄漏 + Spectre 侧信道 |

## 典型启用站点

- Google Docs / Figma（需要 WASM 多线程 + SharedArrayBuffer 做协同编辑）。
- 复杂 Figma 类设计工具、视频编辑器、协同白板。
- 银行 & 高安全站点（即使不用 SharedArrayBuffer，也用来加固 opener 与 iframe 隔离）。

## 快速自查清单

1. 主站响应加 COOP=same-origin + COEP=require-corp。
2. 所有跨源 img/script/style 加 \`crossorigin\`，且资源服务端支持 CORS / CORP。
3. 跨源 iframe 对方加 CORP=cross-origin 或 same-site。
4. 验证 crossOriginIsolated === true。
5. 控制台 Console / Network 面板排查被拦截的资源（有明确 COEP 报错）。`
  },
  {
    id: 'browser-023',
    category: 'browser',
    title: 'BFCache（往返缓存 / Back-Forward Cache）原理？如何兼容与禁用？',
    difficulty: '中等',
    tags: ['BFCache', '往返缓存', '页面缓存'],
    answer: `## 什么是 BFCache

BFCache（Back-Forward Cache，直译为"后退前进缓存"）是浏览器的**内存级页面缓存**：当用户离开一个页面（点击链接跳转 A→B、history.pushState）时，浏览器把**整个页面的完整状态（DOM + JS 堆 + 定时器 + WebSocket、甚至滚动位置、表单输入）冻结保存在内存**；用户点"后退/前进"（B/F）回来时，直接**从内存还原而不是重新加载**，实现"瞬间"恢复。

- 典型使用场景：列表 → 详情 → 后退列表。
- Chrome / Safari / Firefox 原生支持，移动端更积极（移动端后退前进使用频率高）。
- 与 HTTP 缓存不同：HTTP 缓存只存响应内容，仍要重渲染执行 JS；BFCache 是**进程级快照**，完全恢复运行状态。

## 触发与失效条件

### 可以进入 BFCache 的条件

1. 导航是**同源**的跨文档导航（跨文档跳转，不是 SPA 的 pushState）。
2. 页面未注册 \`unload\` 事件监听器（Firefox 允许、Chrome 多数情况拒绝，因 unload 不可靠）。
3. 无正在使用的非 HTTP/1.1 keepalive 连接、WebSocket、WebRTC、EventSource、BroadcastChannel（Chrome 最新版本支持冻结并恢复部分连接，要看具体实现）。
4. 无 IndexedDB 事务、未决的 fetch/Service Worker、Service Worker 正在控制的部分特殊子资源。
5. 页面无 \`Cache-Control: no-store\`（Chrome 强约束；Safari 更激进）。
6. 无 opener 引用其他窗口 / 被其他窗口引用。
7. 未使用 \`window.showModalDialog\` 等废弃 API。
8. 页面不是隐私模式 / 扩展特殊上下文。

浏览器使用 LRU 策略缓存最近 3~10 个页面（Chrome 桌面默认 ~10 个，移动端看内存，少于 3 个），内存不足自动淘汰。

### 页面生命周期

\`\`\`
导航离开页面：pagehide（→ 进入 BFCache frozen）
                     └─ 未进 BFCache → unload → 销毁

后退/前进回到页面：pageshow（persisted: true）
\`\`\`

事件顺序对比：

| 场景 | 事件 |
| --- | --- |
| 普通首次加载 | load → pageshow (persisted:false) |
| 跳走 | pagehide → (可能进入 BFCache) → 可选 unload |
| BFCache 返回 | pageshow (persisted:true) → 无 load/DOMContentLoaded |
| 未用 BFCache 返回 | DOMContentLoaded → load → pageshow |

判断是否从 BFCache 恢复：

\`\`\`js
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    console.log('从 BFCache 恢复')
  }
})
\`\`\`

## 常见"兼容性 Bug"场景（踩坑指南）

### 1. 定时器 / 轮训没有重启

BFCache 冻结期间，setInterval/setTimeout、requestAnimationFrame、rIC 全部暂停；恢复后继续计时（但中间时间完全跳过）。如果业务依赖"时间差"（如倒计时、token 过期检查、会话心跳），就会出现"后端 token 过期但前端还在显示已登录"。

修复：pageshow 时重新计算时间、重启心跳：

\`\`\`js
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    restartHeartbeat()
    validateTokenExpiry()
    restartCountdown()
  }
})
\`\`\`

### 2. WebSocket / EventSource / SSE 连接失效

进入 BFCache 时，浏览器通常会强制切断 WebSocket / EventSource 连接；恢复后页面以为连接还在，发送消息失败。

修复：pageshow 时检测 readyState 并重连：

\`\`\`js
window.addEventListener('pageshow', (e) => {
  if (e.persisted && socket.readyState !== WebSocket.OPEN) {
    reconnectSocket()
  }
})
\`\`\`

### 3. 表单输入 / 滚动位置错乱与过期数据

BFCache 会保留 DOM + 输入值。用户可能：
- 提交订单后跳转支付 → 后退 → 表单还显示已提交的旧值 → 用户重复提交。
- 列表页滚动到 2000 条 → 进详情 → 后端数据已更新 → 后退仍看旧 2000 条快照。

修复：
- 提交成功后禁用表单 / 重定向到结果页（避免用户回到提交页）。
- pageshow 时刷新列表数据 / 重新拉取消息未读数。

### 4. 全局状态与页面可见性

BFCache 页面被冻结时：
- 不触发 visibilitychange（与后台标签页不同）。
- Storage 事件、BroadcastChannel 在冻结期间不会触发。
- Service Worker fetch 拦截不涉及已冻结文档。

修复：pageshow 时手动同步（读取 localStorage 最新值、重连 BroadcastChannel）。

### 5. unload 里的上报丢失

很多项目在 \`unload\` 里做日志上报。如果页面进 BFCache 根本不触发 unload。改用 \`visibilitychange\` + \`pagehide\` 组合：

\`\`\`js
const report = () => navigator.sendBeacon('/report', data)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') report()
})
window.addEventListener('pagehide', report)
\`\`\`

## 主动禁用 BFCache（不推荐）

部分旧项目为了"每次进入都刷新"，硬禁用 BFcache。方法：

1. 注册空的 unload 监听器（Chrome 老版本会禁用 BFCache；Safari 仍可能缓存）：
   \`\`\`js
   window.addEventListener('unload', () => {})
   \`\`\`

2. 响应头加 \`Cache-Control: no-store\`（所有浏览器都不缓存此页面到 BFCache）。

3. pageshow 时判断 persisted 后立刻 reload：
   \`\`\`js
   window.addEventListener('pageshow', (e) => {
     if (e.persisted) location.reload()
   })
   \`\`\`

> **强烈不建议禁用**。BFCache 对用户感知性能的提升非常巨大：回退前进时间从"几百 ms~几秒"降到"几 ms"，是 Core Web Vitals 之外的体验杀手级优化。90% 的业务问题都可以通过 pageshow 事件处理。

## 最佳实践清单

1. **页面初始化逻辑分两类**：
   - "只执行一次的 DOM 构建"放在 \`DOMContentLoaded / load\`。
   - "每次进入页面都要检查"（登录态、数据刷新、重连）放在 \`pageshow\`。
2. **移除 unload 监听器**：所有收尾工作迁移到 pagehide + visibilitychange。
3. **WebSocket / SSE / 轮询**：pageshow 重连 + 重置；pagehide 清理（可选，避免 BFCache 判定不通过）。
4. **表单/购物车页**：提交后 Post/Redirect/Get 模式，防止"后退重提交"。
5. **会话与权限**：pageshow 时验证 token 是否过期、重新拉取用户权限（避免后台修改权限后 BFCache 回来仍是旧态）。
6. **使用 NotRestoredReasons API** 排查没进入 BFCache 的原因（Chrome 109+）：
   \`\`\`js
   window.addEventListener('pagehide', (e) => {
     if (e.persisted === false && performance.getEntriesByType) {
       const nav = performance.getEntriesByType('navigation')[0]
       console.log(nav?.notRestoredReasons) // 框架阻止、unload listener 等
     }
   })
   \`\`\`
7. **Chrome DevTools 测试**：Application → Background services → Back/forward cache → 点击"Run test"查看当前页 BFCache 资格与失败原因。

## 与 SPA 路由 / prerender 的关系

- SPA 内部路由（\`history.pushState\` / \`hashchange\`）不是跨文档导航，**不走 BFCache**，是框架自己的组件卸载/恢复。
- BFCache 发生在整页跨文档（非 SPA pushState）的前进后退。
- Prerender（Chrome 的预渲染、Speculation Rules prerender）与 BFCache 是两个机制；预渲染成功激活后跳转会更快，也可与 BFCache 配合。`
  }
]
