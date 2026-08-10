export const htmlQuestions = [
  {
    id: 'html-001',
    category: 'html',
    title: '什么是 HTML 语义化？为什么要语义化？',
    difficulty: '简单',
    tags: ['语义化', '可访问性', 'SEO'],
    answer: `## 语义化的含义

语义化是指使用**恰当的 HTML 标签**来表达内容的含义，而不是滥用 \`div\` / \`span\`。例如用 \`<header>\`、\`<nav>\`、\`<main>\`、\`<article>\`、\`<section>\`、\`<footer>\` 等结构化标签。

## 为什么要语义化

1. **可访问性（A11y）**：屏幕阅读器等辅助设备依赖语义标签来导航页面，语义化能让视障用户更好地理解结构。
2. **SEO 友好**：搜索引擎爬虫能更准确地理解页面内容与权重分布。
3. **代码可读性与可维护性**：结构清晰，团队协作更高效。
4. **利于样式与脚本**：标签本身带有默认样式和语义钩子，减少无意义的 class。

## 常见语义标签

\`\`\`html
<header>   页眉 / 顶部区域
<nav>      导航
<main>     页面主要内容（每页唯一）
<article>  独立可分发的内容（文章、评论）
<section>  主题分组，通常带标题
<aside>    侧边栏、广告、相关链接
<footer>   页脚
<figure>   图文组合（配 <figcaption>）
<time>     时间
<mark>     高亮标记
\`\`\`

## 注意点

- \`<section>\` 与 \`<article>\` 的区别：\`<article>\` 能独立存在并被引用（如一篇文章），\`<section>\` 是对相关内容的主题分组。
- 不要为了语义而语义：\`<b>\` / \`<i>\` 在 HTML5 中被重新赋予了语义（分别表示"引人注意"和"不同语态"），纯样式应交给 CSS。`
  },
  {
    id: 'html-002',
    category: 'html',
    title: '简述 DOCTYPE 的作用，HTML5 的 DOCTYPE 为什么这么写？',
    difficulty: '简单',
    tags: ['DOCTYPE', '标准模式'],
    answer: `## 作用

\`<!DOCTYPE>\` 声明位于文档最前面，用来告诉浏览器以**何种模式**解析文档（标准模式 / 怪异模式 / 近似标准模式）。它本身不是 HTML 标签，而是一条指令。

## 两种模式

- **标准模式（Standards Mode）**：以 W3C 标准解析和渲染，行为一致。
- **怪异模式（Quirks Mode）**：模拟旧浏览器（IE5 等）的非标准行为，如盒模型用 \`border-box\`、行高计算不同等。

如果不写 DOCTYPE，浏览器会进入怪异模式，导致布局错乱。

## HTML5 的写法

\`\`\`html
<!DOCTYPE html>
\`\`\`

HTML5 并不基于 SGML，因此不需要引用 DTD，写法被简化为最小形式。浏览器看到这行就进入标准模式。而在 HTML4 / XHTML 中，需要声明具体的 DTD：

\`\`\`html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
\`\`\`}`
  },
  {
    id: 'html-003',
    category: 'html',
    title: 'meta viewport 的作用是什么？各参数含义？',
    difficulty: '简单',
    tags: ['viewport', '移动端', '响应式'],
    answer: `## 作用

控制移动端浏览器的**视口（viewport）**，让页面在手机上正确缩放与布局，避免桌面版页面被压缩成极小字显示。

## 典型写法

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
\`\`\`

## 参数含义

| 参数 | 含义 |
| --- | --- |
| \`width\` | 视口宽度，可为像素值或 \`device-width\` |
| \`height\` | 视口高度，一般为 \`device-height\` |
| \`initial-scale\` | 初始缩放比例 |
| \`minimum-scale\` | 最小缩放比例 |
| \`maximum-scale\` | 最大缩放比例 |
| \`user-scalable\` | 是否允许用户手动缩放（yes/no） |

## 注意

- \`user-scalable=no\` 与 \`maximum-scale=1\` 会损害可访问性，WCAG 建议允许用户放大页面，谨慎使用。
- 不写 viewport 时，移动端默认视口宽度通常为 980px，导致页面被缩放。`
  },
  {
    id: 'html-004',
    category: 'html',
    title: 'src 和 href 的区别？',
    difficulty: '简单',
    tags: ['src', 'href', '资源加载'],
    answer: `## src（source）

指向**会被嵌入/替换**到当前文档的资源，请求会**阻塞**当前资源的解析下载。

- \`<script src="a.js">\`：下载并执行，会阻塞 HTML 解析（无 \`async/defer\` 时）。
- \`<img src="a.png">\`：图片嵌入。
- \`<iframe src="a.html">\` / \`<video src="a.mp4">\`：嵌入外部资源。

## href（hypertext reference）

指向**超链接引用**，建立当前文档与外部资源之间的**关联**，不阻塞解析。

- \`<a href="b.html">\`：跳转链接。
- \`<link href="a.css" rel="stylesheet">\`：并行下载 CSS。
- \`<link href="icon.svg" rel="icon">\`：关联图标。

## 核心区别

- \`src\` 用于"替换当前元素内容"，会下载并嵌入；\`href\` 用于"建立链接关系"。
- \`<script>\` 用 \`src\` 时阻塞解析；\`<link>\` 用 \`href\` 时并行加载。`
  },
  {
    id: 'html-005',
    category: 'html',
    title: 'script 标签的 defer 和 async 有什么区别？',
    difficulty: '中等',
    tags: ['script', 'defer', 'async', '加载策略'],
    answer: `## 三种加载方式

| 属性 | 下载时机 | 执行时机 | 执行顺序 | 是否阻塞 HTML 解析 |
| --- | --- | --- | --- | --- |
| 无属性 | 解析到标签时 | 下载完立即执行 | 按文档顺序 | 下载+执行都阻塞 |
| \`async\` | 并行下载 | 下载完立即执行，暂停解析 | 不保证顺序（谁先下完谁先执行） | 仅执行时短暂阻塞 |
| \`defer\` | 并行下载 | HTML 解析完成后、\`DOMContentLoaded\` 之前 | 按文档顺序 | 不阻塞 |

## 图示

\`\`\`
HTML 解析 ──────►
  无属性:  ──[下载][执行]──►继续
  async:   ─────────►[下载] ─[执行]─►继续   (执行时暂停)
  defer:   ─────────►[下载]───────► [按顺序执行]
\`\`\`

## 使用建议

- **无依赖的独立脚本**（统计、广告）：用 \`async\`。
- **有依赖关系或操作 DOM 的脚本**：用 \`defer\`，按顺序执行更安全。
- **模块脚本** \`<script type="module">\` 默认就是 \`defer\` 行为。
- \`async\` 与 \`defer\` 同时存在时，\`async\` 优先（在不支持 async 的旧浏览器回退到 defer）。`
  },
  {
    id: 'html-006',
    category: 'html',
    title: '行内元素、块级元素、空元素（void）有哪些区别？举例说明。',
    difficulty: '简单',
    tags: ['元素分类', '块级', '行内'],
    answer: `## 块级元素（block）

独占一行，可设置宽高、内外边距上下生效。

\`<div>\`、\`<p>\`、\`<h1>-<h6>\`、\`<ul>\`、\`<ol>\`、\`<li>\`、\`<table>\`、\`<form>\`、\`<section>\`、\`<header>\` 等。

## 行内元素（inline）

不独占一行，宽高由内容决定，设置 \`width/height\` 无效，上下 margin/padding 不影响布局（视觉上可能溢出但不占位）。

\`<span>\`、\`<a>\`、\`<strong>\`、\`<em>\`、\`<code>\`、\`<b>\`、\`<i>\` 等。

## 行内块元素（inline-block）

兼具两者特点：可设宽高，且不独占一行。\`<img>\`、\`<input>\`、\`<button>\`、\`<select>\` 等。

## 空元素 / void 元素

没有内容、没有闭合标签的元素。

\`<br>\`、\`<hr>\`、\`<img>\`、\`<input>\`、\`<meta>\`、\`<link>\`、\`<area>\`、\`<base>\`、\`<col>\`、\`<source>\`、\`<wbr>\` 等。

## 注意

HTML5 中已不强调"块级/行内"的严格分类，更推荐按**内容模型**（flow / phrasing / heading 等）理解。但 CSS 的 \`display\` 才是真正决定渲染行为的因素。`
  },
  {
    id: 'html-007',
    category: 'html',
    title: 'HTML5 新增了哪些重要特性？',
    difficulty: '中等',
    tags: ['HTML5', '新特性', '语义化'],
    answer: `## 1. 语义化结构标签

\`<header>\`、\`<nav>\`、\`<main>\`、\`<article>\`、\`<section>\`、\`<aside>\`、\`<footer>\`、\`<figure>\` 等。

## 2. 媒体与图形

- \`<audio>\` / \`<video>\` 原生媒体播放。
- \`<canvas>\` 位图绘图 API。
- \`<svg>\` 矢量图（XML 描述）。

## 3. 表单增强

新增输入类型：\`email\`、\`url\`、\`number\`、\`range\`、\`date\`、\`color\`、\`tel\`、\`search\` 等；新增属性 \`placeholder\`、\`required\`、\`pattern\`、\`autofocus\`、\`min/max/step\`；新增 \`<datalist>\`、\`<output>\`。

## 4. 新 API（Web APIs）

- **地理定位** Geolocation
- **拖放** Drag and Drop API
- **本地存储** localStorage / sessionStorage / IndexedDB
- **Web Worker** 多线程
- **WebSocket** 全双工通信
- **History API**（pushState/replaceState）支撑 SPA 路由
- **File API** 文件读取
- **requestAnimationFrame** 动画

## 5. 离线与缓存

Application Cache（已废弃，被 Service Worker 取代）。

## 6. 文档简化

DOCTYPE、字符集声明简化：\`<meta charset="UTF-8">\`。`
  },
  {
    id: 'html-008',
    category: 'html',
    title: 'iframe 有哪些优缺点？',
    difficulty: '中等',
    tags: ['iframe', '隔离', '安全'],
    answer: `## 优点

1. **隔离**：iframe 内的样式、脚本与父页面隔离，适合嵌入第三方内容（广告、播放器、沙箱）。
2. **并行加载**：可配合 \`loading="lazy"\` 懒加载。
3. **复用**：可嵌入同源或跨源的完整页面。
4. **历史管理独立**：iframe 有自己的 history。

## 缺点

1. **性能开销大**：每个 iframe 相当于一个独立的 document，创建成本高，阻塞 \`onload\` 事件。
2. **SEO 不友好**：搜索引擎难以抓取 iframe 内容。
3. **通信复杂**：跨域时只能用 \`postMessage\` 通信。
4. **布局问题**：高度自适应需要额外脚本。
5. **安全风险**：可能被用于点击劫持；需用 \`sandbox\` 属性限制能力。

## sandbox 属性

\`\`\`html
<iframe src="untrusted.html" sandbox="allow-scripts allow-same-origin"></iframe>
\`\`\`

不设置时默认禁用脚本、表单、弹窗、同源访问等；按需开放。

## 现代替代方案

- 微前端：qiankun、Module Federation、Web Components。
- 嵌入内容：用组件或 \`<portal>\`（实验性）。`
  },
  {
    id: 'html-009',
    category: 'html',
    title: 'Canvas 和 SVG 的区别？如何选择？',
    difficulty: '中等',
    tags: ['Canvas', 'SVG', '图形'],
    answer: `## 核心区别

| | Canvas | SVG |
| --- | --- | --- |
| 类型 | 位图（像素） | 矢量图（XML 描述） |
| 渲染 | 通过 JS API 逐像素绘制 | 浏览器解析 DOM 节点渲染 |
| DOM | 画布是单个节点，内部元素无 DOM | 每个图形是独立 DOM 节点，可绑定事件 |
| 缩放 | 放大会失真（位图） | 无损缩放（矢量） |
| 性能 | 元素多时性能稳定（像素操作） | 元素多时 DOM 开销大，变慢 |
| 可访问性 | 差（无语义结构） | 好（可读、可搜索） |
| 动画 | 需手动 requestAnimationFrame 重绘 | 可用 CSS / SMIL 动画 |

## 选择

- **Canvas**：复杂图形、大量粒子、游戏、热力图、实时数据可视化（如 echarts 默认 canvas）。
- **SVG**：图标、图表（元素少）、需要交互/缩放/可访问性的图形、Logo。

## 示例

\`\`\`html
<!-- Canvas -->
<canvas id="c" width="200" height="200"></canvas>
<script>
  const ctx = c.getContext('2d')
  ctx.fillRect(10, 10, 50, 50)
</script>

<!-- SVG -->
<svg width="100" height="100">
  <rect x="10" y="10" width="50" height="50" fill="red"/>
</svg>
\`\`\``
  },
  {
    id: 'html-010',
    category: 'html',
    title: 'data-* 自定义属性的作用与局限？',
    difficulty: '简单',
    tags: ['data-*', '自定义属性'],
    answer: `## 作用

在 HTML 元素上存储**自定义数据**，供 JS / CSS 读取，常用于"把数据绑定到 DOM 节点"。

\`\`\`html
<div id="item" data-user-id="42" data-role="admin">Tom</div>
\`\`\`

\`\`\`js
// JS 读取（dataset 自动转驼峰）
el.dataset.userId    // '42'
el.dataset.role      // 'admin'

// 写入
el.dataset.role = 'editor'
\`\`\`

\`\`\`css
/* CSS 可用属性选择器 */
[data-role="admin"] { color: red; }
\`\`\`

## 属性名规则

- 小写、不能大写（\`data-userId\` 会被浏览器转为 \`data-userid\`）。
- \`dataset\` 访问时自动转驼峰：\`data-user-id\` → \`dataset.userId\`。
- 值只能是字符串（数字、布尔也会被存为字符串）。

## 局限

1. **只能存字符串**：对象 / 数组需 \`JSON.stringify\`，读取再 parse。
2. **不适合存大量或敏感数据**：暴露在 HTML 中，可被查看 / 篡改。
3. **不应用于关键业务逻辑**：它是 DOM 附加数据，不应作为状态管理手段，复杂状态应用 Pinia / Redux。
4. **性能**：大量读取 dataset 不如直接变量快。

## 替代方案

- 复杂数据用框架的状态管理或 JS 闭包维护，不要堆在 DOM 上。`
  },
  {
    id: 'html-011',
    category: 'html',
    title: 'label 标签的作用？如何使用？',
    difficulty: '简单',
    tags: ['label', '表单', '可访问性'],
    answer: `## 作用

\`<label>\` 为表单控件提供**说明文字**，并与之关联，提升**可访问性**和**可用性**：

1. 点击 label 文字会**自动聚焦 / 触发**关联的控件（扩大点击区域）。
2. 屏幕阅读器会将 label 读给用户，知道控件的用途。
3. 对复选框 / 单选框尤其有用——点击文字即可选中。

## 两种关联方式

### 1. 显式（推荐）

用 \`for\` 指向控件的 \`id\`：

\`\`\`html
<label for="username">用户名</label>
<input type="text" id="username">
\`\`\`

### 2. 隐式

把控件包在 label 内部：

\`\`\`html
<label>用户名 <input type="text"></label>
\`\`\`

## 注意

- \`for\` 与 \`id\` 必须一致，且页面内 \`id\` 唯一。
- 显式关联兼容性更好，推荐使用。
- 一个 label 只能关联一个控件。

## 可访问性收益

- 键盘用户、视障用户依赖 label 识别控件。
- 移动端点击文字即可操作，体验更好。`
  },
  {
    id: 'html-012',
    category: 'html',
    title: 'href="#" 与 href="javascript:void(0)" 有什么区别？',
    difficulty: '中等',
    tags: ['a标签', 'href', '导航'],
    answer: `## href="#"

- 跳转到当前页面锚点 \`#\`（空锚点），副作用：
  - **URL 末尾追加 \`#\`**。
  - **页面跳到顶部**（触发默认锚点行为）。
  - 会向 history 增加一条记录。

\`\`\`html
<a href="#" onclick="doSomething(); return false;">点击</a>
\`\`\`

## href="javascript:void(0)"

- 执行 \`void(0)\`（返回 \`undefined\`），**不导航、不跳转、不修改 URL**。
- 常用于"只想用 onclick 触发 JS，不要默认跳转"。

\`\`\`html
<a href="javascript:void(0)" onclick="doSomething()">点击</a>
\`\`\`

## 对比

| | \`#\` | \`javascript:void(0)\` |
| --- | --- | --- |
| 跳转 | 跳到顶部 | 不跳转 |
| URL 改变 | 追加 \`#\` | 不变 |
| history | 增加记录 | 不增加 |

## 现代推荐做法

- **用 button 代替 a**：如果不需要导航，语义上应该用 \`<button>\`，而不是 a + 阻止默认行为。

\`\`\`html
<button onclick="doSomething()">点击</button>
\`\`\`

- 必须用 a 时，用 \`href="#"\` 配合 \`e.preventDefault()\`，避免 \`javascript:\` 协议（CSP 会拦截内联 JS，且 \`javascript:\` 在新窗口 / 非激活上下文有兼容问题）。

\`\`\`js
link.addEventListener('click', (e) => {
  e.preventDefault()
  doSomething()
})
\`\`\``
  },
  {
    id: 'html-013',
    category: 'html',
    title: '常见的 HTML5 表单增强有哪些？',
    difficulty: '中等',
    tags: ['表单', 'HTML5', 'input'],
    answer: `## 新增 input 类型

\`email\`、\`url\`、\`tel\`、\`number\`、\`range\`、\`date\`、\`time\`、\`month\`、\`week\`、\`color\`、\`search\`。

- 移动端会自动弹出对应键盘（email 带 @、number 带数字键盘）。
- 部分类型自带校验（email / url 格式）。

\`\`\`html
<input type="email" required>
<input type="number" min="0" max="100" step="1">
<input type="date">
\`\`\`

## 新增属性

- \`placeholder\`：占位提示。
- \`required\`：必填。
- \`pattern\`：正则校验。
- \`min / max / step\`：数值范围。
- \`maxlength / minlength\`：长度限制。
- \`autofocus\`：自动聚焦。
- \`autocomplete\`：自动填充（on/off 或具体 token 如 \`email\`、\`current-password\`）。
- \`multiple\`：多选（file / email）。
- \`form\`：让控件可脱离 \`<form>\` 标签层级仍归属某表单。
- \`formaction / formmethod / formenctype\`：提交按钮覆盖表单默认行为。

## 新增元素

- \`<datalist>\`：输入框的下拉建议（可输入也可选择）。
- \`<output>\`：计算结果展示。
- \`<progress>\` / \`<meter>\`：进度条 / 度量。

\`\`\`html
<input list="browsers" name="b">
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
</datalist>
\`\`\`

## 校验 API

\`\`\`js
input.checkValidity()   // 触发校验，返回布尔
input.validity          // 校验状态对象（valueMissing/typeMismatch/...）
input.setCustomValidity(msg)  // 自定义错误提示
form.reportValidity()   // 报告所有字段校验
\`\`\`

## 注意

- 浏览器原生校验可被绕过，**服务端校验不可省**。
- 样式上可用 \`:valid\` / \`:invalid\` 伪类提示。`
  },
  {
    id: 'html-014',
    category: 'html',
    title: '如何优化 HTML 以提升 SEO 与性能？',
    difficulty: '中等',
    tags: ['SEO', '性能', '语义化'],
    answer: `## SEO 优化

1. **语义化标签**：\`<header>\` \`<main>\` \`<article>\` \`<nav>\` 等，帮助爬虫理解结构。
2. **title / meta description**：每页唯一、含关键词。
   \`\`\`html
   <title>页面标题 - 站点</title>
   <meta name="description" content="页面摘要">
   \`\`\`
3. **合理的标题层级**：一个 \`<h1>\`，\`<h2>-<h6>\` 层级递进，不跳级。
4. **img 必须有 alt**：图片描述，利于图片搜索和无障碍。
5. **canonical**：避免重复内容惩罚。
   \`\`\`html
   <link rel="canonical" href="https://example.com/article">
   \`\`\`
6. **Open Graph / Twitter Card**：社交分享卡片。
7. **结构化数据 JSON-LD**：让爬虫理解内容（面包屑、文章、产品）。
8. **sitemap.xml / robots.txt**：引导爬虫。
9. **语义化 URL** + **SSR / 预渲染**：保证爬虫能看到内容（SPA 对 SEO 不友好）。

## 性能优化

1. **CSS 在 head、JS 在 body 末尾或 defer**：不阻塞首屏。
2. **关键 CSS 内联**，非关键异步加载。
3. **资源预连接 / 预加载**：
   \`\`\`html
   <link rel="preconnect" href="https://cdn.example.com">
   <link rel="preload" as="image" href="hero.jpg">
   \`\`\`
4. **字体 \`font-display: swap\`**，避免文字不可见。
5. **图片懒加载 + 尺寸属性**：
   \`\`\`html
   <img src="a.jpg" loading="lazy" decoding="async" width="400" height="300">
   \`\`\`
6. **减少 DOM 嵌套层级**：精简结构，加快解析与样式计算。
7. **避免空 src / href**：部分浏览器会发起对当前页的请求。
8. **合理使用 \`async\` / \`defer\`** 加载第三方脚本。

## 可访问性（间接利好 SEO）

- label 关联、aria 属性、键盘可达、对比度，搜索引擎与辅助设备同样受益。`
  },
  // ===== 以下为补充题目（html-015 ~ html-044）=====
  {
    id: 'html-015',
    category: 'html',
    title: 'HTML 实体是什么？常见的字符实体有哪些？',
    difficulty: '简单',
    tags: ['实体', '转义', '字符编码'],
    answer: `## HTML 实体

HTML 实体（Character Entity）是用 \`&name;\` 或 \`&#数字;\` 形式表示的特殊字符，用于：
1. **转义保留字符**（\`<\`、\`>\`、\`&\`、\`"\`、\`'\`），避免被解析为标签或属性分隔符；
2. **输入键盘无法直接打出的字符**（如 \`©\`、\`®\`、\`™\`、空格等）。

## 常见实体

| 实体 | 字符 | 说明 |
| --- | --- | --- |
| \`&lt;\` | \`<\` | 小于号 |
| \`&gt;\` | \`>\` | 大于号 |
| \`&amp;\` | \`&\` | 和号（必须转义） |
| \`&quot;\` | \`"\` | 双引号 |
| \`&apos;\` | \`'\` | 单引号（HTML5） |
| \`&nbsp;\` | 不间断空格 | 防止换行、合并空格 |
| \`&copy;\` | \`©\` | 版权 |
| \`&reg;\` | \`®\` | 注册商标 |
| \`&trade;\` | \`™\` | 商标 |
| \`&hellip;\` | \`…\` | 省略号 |
| \`&mdash;\` | \`—\` | 破折号 |
| \`&#x1F600;\` | 😀 | Unicode 码点（十六进制） |

## 关键点

- \`&amp;\` 必须最先转义，否则 \`&lt;\` 会被解析成 \`&lt;\` 的字面量（先遇到 \`&\`）。
- **数字实体**（\`&#60;\` / \`&#x3C;\`）通用性最强，不受编码影响；命名实体依赖 DOCTYPE 定义。
- \`&nbsp;\` 是\u00a0不间断空格，多个会被保留（普通空格在 HTML 中会合并为一个），但不要用它做布局间距，间距应交给 CSS。
- 在 \`<script>\` / \`<style>\` 内部**不需要**转义实体（它们是 CDATA 上下文），但 \`</script>\` 字符串需写成 \`<\\/script>\` 防止提前结束。`
  },
  {
    id: 'html-016',
    category: 'html',
    title: 'img 的 alt 和 title 属性有什么区别？alt 可以省略吗？',
    difficulty: '简单',
    tags: ['img', '可访问性', 'SEO', 'alt'],
    answer: `## 区别

- **\`alt\`（替代文本）**：图片**加载失败**或用户使用屏幕阅读器时显示，是**内容的等价替代**，属于无障碍与 SEO 的核心。
- **\`title\`（提示文本）**：鼠标悬停时浏览器显示的**附加说明**，是"补充信息"，不是必需的。

\`\`\`html
<img src="logo.png" alt="公司 Logo" title="点击返回首页">
\`\`\`

## alt 能不能省略

**不能省略属性本身**，但内容可以为空（装饰性图片）：

\`\`\`html
<!-- 内容图片：必须有描述性 alt -->
<img src="chart.png" alt="2024 年 Q3 营收同比增长 18% 的柱状图">

<!-- 装饰性图片：alt="" 告诉屏幕阅读器跳过 -->
<img src="divider.png" alt="">

<!-- ❌ 错误：缺少 alt 属性，屏幕阅读器会朗读文件名 -->
<img src="bg.png">
\`\`\`

## 要点

- \`alt=""\` ≠ 没有 \`alt\`：前者明确表示"这是装饰，忽略我"；后者会被读屏朗读冗长的文件名/URL。
- 不要在 \`alt\` 里写"图片"二字（读屏本身会说"image"），应描述内容。
- \`title\` 在移动端几乎无意义（无悬停），且对 SEO 影响很小，不要把重要信息放 \`title\`。
- 图标字体/背景图等纯装饰应通过 CSS 实现，不在 HTML 里出现，自然无需 \`alt\`。`
  },
  {
    id: 'html-017',
    category: 'html',
    title: '说说 HTML 文档大纲（outline）与 h1~h6 标题层级。',
    difficulty: '中等',
    tags: ['语义化', '大纲', '标题层级', 'SEO'],
    answer: `## 文档大纲

HTML 的标题元素 \`h1\` ~ \`h6\` 构成页面的**逻辑大纲**（outline），类似书的目录。搜索引擎与屏幕阅读器据此理解页面结构与权重。

\`\`\`html
<body>
  <h1>网站标题</h1>
  <section>
    <h2>产品介绍</h2>
    <section>
      <h3>核心功能</h3>
    </section>
    <section>
      <h3>定价</h3>
    </section>
  </section>
  <section>
    <h2>关于我们</h2>
  </section>
</body>
\`\`\`

## 层级规则

1. **每个页面建议只有一个 \`h1\`**（主标题），虽然 HTML5 允许多个（每个 sectioning root 一个），但实际中单 h1 对 SEO 更稳妥。
2. **不要跳级**：\`h1\` 后应接 \`h2\`，不要直接 \`h4\`，会破坏大纲。
3. **用 \`section\` / \`article\` 包裹**：HTML5 的隐式大纲算法会基于 sectioning 元素重新计算层级，使每个 section 内部可重新从 h1 开始（但浏览器支持不完善，实践中仍建议整体递增）。
4. **不要用标题做样式**：要大字用 CSS，而不是 \`<h1>\` 仅为视觉。

## 与 SEO

- \`h1\` 权重最高，应包含页面核心关键词。
- \`h2~h3\` 划分内容板块，搜索引擎据此识别主题分布。
- 标题层级混乱会降低可访问性与 SEO 评分。

## 检测工具

- Chrome DevTools → Lighthouse 的 Accessibility 报告。
- 浏览器扩展 "Headings Map" 可可视化页面大纲。`
  },
  {
    id: 'html-018',
    category: 'html',
    title: 'ARIA 是什么？常见的 aria 属性有哪些？何时该用？',
    difficulty: '中等',
    tags: ['ARIA', '可访问性', 'a11y'],
    answer: `## ARIA 简介

**ARIA**（Accessible Rich Internet Applications）是 W3C 的一组属性，用于增强 HTML 的**可访问性**，让动态组件（弹窗、菜单、Tab、轮播等）能被辅助设备正确识别和操作。

> 第一法则：**No ARIA is better than bad ARIA.** 能用原生语义标签就别用 ARIA。\`<button>\` 天然可聚焦、可回车，比 \`<div role="button">\` 强得多。

## 三类 ARIA 属性

### 1. role（角色）— 元素是什么
\`\`\`html
<div role="button">点我</div>
<div role="dialog">弹窗</div>
<ul role="tablist"><li role="tab">标签1</li></ul>
\`\`\`

### 2. aria-* 状态/属性 — 元素的额外信息
| 属性 | 作用 |
| --- | --- |
| \`aria-label\` | 给无文字元素加可读标签（如图标按钮） |
| \`aria-labelledby\` | 用另一个元素的 ID 作为标签 |
| \`aria-describedby\` | 指向更详细的说明元素 |
| \`aria-hidden\` | 对辅助设备隐藏（如纯装饰） |
| \`aria-expanded\` | 展开/折叠状态（手风琴、菜单） |
| \`aria-disabled\` | 表示禁用（区别于 \`disabled\` 属性） |
| \`aria-live\` | 动态内容播报（\`polite\`/\`assertive\`） |
| \`aria-current\` | 当前所在项（导航高亮） |
| \`aria-required\` / \`aria-invalid\` | 表单必填/校验状态 |

### 3. 动态组件示例
\`\`\`html
<button aria-expanded="false" aria-controls="menu" onclick="toggle()">菜单</button>
<ul id="menu" role="menu" hidden>
  <li role="menuitem">新建</li>
</ul>
\`\`\`
切换时 JS 同步更新 \`aria-expanded\`，屏幕阅读器会播报"展开/折叠"。

## 使用原则

1. **优先原生标签**：\`<button>\` 优于 \`role="button"\`，\`<nav>\` 优于 \`role="navigation"\`。
2. **不改变语义**：不要给 \`<h2>\` 加 \`role="button"\`，应反过来。
3. **所有交互元素可键盘操作**：加了 \`role="button"\` 就必须支持 Enter/Space。
4. **不要在可见可聚焦元素上用 \`aria-hidden\`**（会屏蔽键盘焦点）。
5. **动态内容用 \`aria-live\`** 播报，如 toast、加载状态。`
  },
  {
    id: 'html-019',
    category: 'html',
    title: 'HTML5 表单验证怎么做？说说 required、pattern 与约束验证 API。',
    difficulty: '中等',
    tags: ['表单', '验证', '约束验证', 'HTML5'],
    answer: `## 原生表单验证

HTML5 内置**约束验证（Constraint Validation）**，浏览器在表单提交时自动校验，失败则阻止提交并显示气泡提示。

\`\`\`html
<form>
  <input type="email" required placeholder="邮箱">
  <input type="tel" pattern="[0-9]{11}" title="请输入 11 位手机号">
  <input type="number" min="0" max="100" step="5">
  <input type="text" minlength="2" maxlength="20">
  <button>提交</button>
</form>
\`\`\`

## 常见约束属性

| 属性 | 作用 |
| --- | --- |
| \`required\` | 必填 |
| \`pattern\` | 正则约束（type=text/search/tel/url/email） |
| \`min\` / \`max\` | 数值/日期范围 |
| \`minlength\` / \`maxlength\` | 文本长度 |
| \`step\` | 步进值 |
| \`type\` | email/url/number/date 自带格式校验 |

## 约束验证 API

JS 可手动检查与控制：

\`\`\`js
const input = document.querySelector('input')

input.validity          // ValidityState 对象
input.validity.valid    // 是否全部通过
input.validity.valueMissing   // required 但为空
input.validity.typeMismatch   // type 不匹配
input.validity.patternMismatch // pattern 不匹配
input.validity.rangeUnderflow // 小于 min
input.validity.tooShort       // 短于 minlength

input.checkValidity()   // 校验，失败触发 invalid 事件
input.reportValidity()  // 校验并显示浏览器提示
input.setCustomValidity('两次密码不一致') // 自定义错误
input.setCustomValidity('')               // 清除自定义错误
\`\`\`

\`\`\`js
input.addEventListener('invalid', (e) => {
  e.preventDefault()          // 阻止默认气泡
  showMyError(input.validationMessage)
})
\`\`\`

## 注意

- 原生验证**只是体验层**，**服务端必须重新校验**（可被绕过：\`<form novalidate>\` 或直接改 DOM）。
- \`setCustomValidity\` 设非空字符串后 \`validity.valid\` 变 false，清空需传空串。
- 想完全自定义 UI 用 \`novalidate\` 关闭浏览器提示，再用 API 自己判断。
- \`type=email\` 的默认正则较宽松，严格场景用 \`pattern\` 补充。`
  },
  {
    id: 'html-020',
    category: 'html',
    title: 'input 的 type 属性有哪些类型？HTML5 新增了哪些？',
    difficulty: '中等',
    tags: ['input', '表单', 'HTML5'],
    answer: `## input type 全览

### 传统类型
\`text\`、\`password\`、\`radio\`、\`checkbox\`、\`submit\`、\`reset\`、\`button\`、\`file\`、\`hidden\`、\`image\`（图片提交按钮）。

### HTML5 新增类型
| type | 作用 | 移动端键盘 |
| --- | --- | --- |
| \`email\` | 邮箱，自带校验 | 带 @ 的键盘 |
| \`url\` | 网址 | 带 / 的键盘 |
| \`tel\` | 电话号码 | 数字拨号盘 |
| \`number\` | 数字，带 spinner | 数字键盘 |
| \`search\` | 搜索框（可能带清除按钮） | 搜索键 |
| \`date\` / \`month\` / \`week\` | 日期选择器 | 原生日历 |
| \`time\` / \`datetime-local\` | 时间选择器 | 原生时间 |
| \`range\` | 滑块 | — |
| \`color\` | 颜色选择器 | 调色板 |
| \`image\` | 图片提交按钮 | — |

\`\`\`html
<input type="range" min="0" max="100" step="10">
<input type="color" value="#42b883">
<input type="datetime-local">
<input type="file" accept="image/*" multiple>
\`\`\`

## 价值

1. **移动端自动唤起合适键盘**，提升体验（\`type=tel\` 弹数字盘）。
2. **原生校验**（email/url/number 格式）。
3. **原生 UI 控件**（日期/颜色/滑块），免依赖、性能好。
4. **语义化**，利于自动填充（浏览器识别 \`type=email\` 可填充账号）。

## 兼容性注意

- 旧浏览器对新增 type 会**优雅降级为 text**，不会报错。
- 日期/颜色选择器各浏览器 UI 差异大，对 UI 一致性要求高的项目常仍用组件库。
- \`type=number\` 对非数字输入会"静默失败"（不显示但也不录入），且无法限制前导 0，电话号/卡号建议用 \`type=tel\` 或 \`inputmode\`。

## 相关：inputmode

\`inputmode\` 只影响移动端键盘，不改类型与校验，适合"想弹数字盘但要文本框"的场景：\`<input inputmode="numeric">\`。`
  },
  {
    id: 'html-021',
    category: 'html',
    title: 'details/summary 和 dialog 元素怎么用？能替代 JS 交互组件吗？',
    difficulty: '中等',
    tags: ['details', 'summary', 'dialog', '原生组件', 'HTML5'],
    answer: `## details / summary — 原生折叠面板

\`\`\`html
<details>
  <summary>常见问题</summary>
  <p>这里是答案内容，默认折叠，点击 summary 展开。</p>
</details>

<!-- 默认展开 -->
<details open>
  <summary>已展开</summary>
  <p>内容</p>
</details>
\`\`\`

- 无需 JS 即可折叠/展开，浏览器原生支持键盘操作。
- \`toggle\` 事件监听状态变化：\`details.addEventListener('toggle', e => e.target.open)\`。
- 可嵌套实现多级菜单/手风琴。

## dialog — 原生对话框

\`\`\`html
<dialog id="d">
  <p>这是一个对话框</p>
  <form method="dialog"><button>关闭</button></form>
</dialog>

<button onclick="d.showModal()">打开模态</button>
\`\`\`

\`\`\`js
const d = document.getElementById('d')
d.show()        // 非模态显示（不遮罩、可点外部）
d.showModal()   // 模态显示：顶层、自动遮罩、聚焦陷阱、Esc 关闭
d.close()       // 关闭
d.returnValue   // form method="dialog" 提交的值

// ::backdrop 伪元素自定义遮罩
\`\`\`

\`\`\`css
dialog::backdrop { background: rgba(0,0,0,.5); }
dialog { border-radius: 12px; padding: 24px; }
\`\`\`

## 能否替代 JS 组件

**简单场景完全可以**：
- FAQ 折叠、 disclosure → \`details\`
- 简单弹窗、确认框 → \`dialog\`

**复杂场景仍有局限**：
- \`details\` 难以做"手风琴互斥"（点开一个关闭其他）、动画过渡需 JS/CSS 配合。
- \`dialog\` 在 Safari 15.4 前不支持 \`showModal\`；自定义动画、嵌套弹窗焦点管理需补充。
- 复杂表单弹窗、Toast 队列仍推荐组件库。

## 优势

- **无障碍**：原生支持 ARIA、键盘交互，免去手写焦点管理。
- **零依赖**：减少 JS 体积，首屏更快。
- **顶层渲染**：\`dialog\` 在 top layer，天然避免 \`z-index\` 堆叠问题。`
  },
  {
    id: 'html-022',
    category: 'html',
    title: '响应式图片怎么做？说说 srcset、sizes 与 picture。',
    difficulty: '中等',
    tags: ['响应式图片', 'srcset', 'picture', '性能'],
    answer: `## 为什么需要响应式图片

同一张图在手机（小屏、高 DPI）和桌面（大屏）需求不同：尺寸、分辨率、甚至裁剪方向都不同。固定 \`src\` 会导致手机下载过大图、桌面图模糊，浪费带宽。

## 1. srcset + sizes — 分辨率/视口自适应

\`\`\`html
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="...">
\`\`\`

- \`srcset\` 列出同一张图的不同宽度版本（\`480w\` 表示图宽 480px）。
- \`sizes\` 告诉浏览器：在哪些断点下这张图显示多宽（\`100vw\` = 视口宽）。
- 浏览器根据**设备 DPR + sizes 计算的实际显示宽度**，自动选最合适的图下载。

## 2. 分辨率自适应（DPR）

\`\`\`html
<img src="logo.png" srcset="logo@2x.png 2x, logo@3x.png 3x" alt="logo">
\`\`\`
\`2x\`/\`3x\` 描述像素密度，Retina 屏自动选高清版。

## 3. picture — 艺术指导（Art Direction）

不同断点用**不同裁剪/比例**的图（手机竖图、桌面横图）：

\`\`\`html
<picture>
  <source media="(max-width: 600px)" srcset="mobile.jpg">
  <source media="(min-width: 1200px)" srcset="desktop.jpg">
  <img src="desktop.jpg" alt="...">
</picture>
\`\`\`

## 4. 格式自适应

\`\`\`html
<picture>
  <source type="image/avif" srcset="hero.avif">
  <source type="image/webp" srcset="hero.webp">
  <img src="hero.jpg" alt="...">
</picture>
\`\`\`
浏览器按顺序选第一个支持的格式，AVIF → WebP → JPG 降级。

## 选择建议

| 需求 | 方案 |
| --- | --- |
| 同图不同尺寸 | \`srcset\` + \`sizes\` |
| 同图不同 DPI | \`srcset\` + \`Nx\` |
| 不同裁剪/构图 | \`<picture>\` + \`media\` |
| 现代格式降级 | \`<picture>\` + \`type\` |
| 加载占位 | 配合 \`loading="lazy"\`、\`decoding="async"\` |

## 注意

- \`<picture>\` 内**必须有一个 \`<img>\`** 作为兜底，否则不显示。
- \`srcset\` 让浏览器选，开发者无法强制；\`<picture>\` 用 \`media\` 是开发者指定的规则。
- 始终给 \`<img>\` 设 \`width\`/\`height\` 避免布局抖动（CLS）。`
  },
  {
    id: 'html-023',
    category: 'html',
    title: '资源提示（Resource Hints）有哪些？preload/prefetch/preconnect/dns-prefetch 区别？',
    difficulty: '困难',
    tags: ['资源提示', 'preload', 'prefetch', 'preconnect', '性能'],
    answer: `## 资源提示总览

通过 \`<link rel="...">\` 告诉浏览器**提前**做某些网络/加载动作，优化性能。

| 指令 | 时机 | 目的 | 缓存 |
| --- | --- | --- | --- |
| \`dns-prefetch\` | 立即 | 提前 DNS 解析 | — |
| \`preconnect\` | 立即 | DNS + TCP + TLS 握手 | — |
| \`preload\` | 当前页**必需** | 高优先级预加载关键资源 | 是 |
| \`prefetch\` | 空闲 | 预取**下一页**可能用的资源 | 是 |
| \`modulepreload\` | 立即 | 预加载 ES 模块及其依赖 | 是 |
| \`prerender\`（已废弃→Speculation Rules） | 空闲 | 预渲染整页 | — |

## 用法

\`\`\`html
<!-- 1. dns-prefetch：只解析域名（轻量） -->
<link rel="dns-prefetch" href="//cdn.example.com">

<!-- 2. preconnect：完整建立连接（DNS+TCP+TLS），适合关键第三方 -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

<!-- 3. preload：高优先级加载当前页关键资源 -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">
<link rel="preload" href="/js/app.js" as="script">

<!-- 4. prefetch：空闲时低优先级预取下页资源 -->
<link rel="prefetch" href="/next-page.js">

<!-- 5. modulepreload：预加载模块及其 import 依赖 -->
<link rel="modulepreload" href="/app.js">
\`\`\`

## 关键区别

### preload vs prefetch
- **\`preload\`**：当前页**一定会用**的资源（关键字体、首屏 CSS/JS、hero 图），高优先级，**必须写 \`as\`**。
- **\`prefetch\`**：**未来页面**可能用的资源（路由预取），低优先级，空闲时下载。

### dns-prefetch vs preconnect
- \`dns-prefetch\` 只解析 DNS（最便宜）。
- \`preconnect\` 完成连接建立（含 TLS），对 HTTPS 第三方域名收益大（省几百 ms）。
- 两者都只对**跨域**有意义，同域浏览器本就会做。

### crossorigin
字体、\`fetch\` 的资源必须加 \`crossorigin\`，否则预连接/预加载的缓存无法复用（CORS 缓存键不同）。

## Speculation Rules（新）

替代已废弃的 \`prerender\`，用于预渲染整个页面：

\`\`\`html
<script type="speculationrules">
{ "prerender": [{ "where": { "href_matches": "/next/*" } }] }
</script>
\`\`\`

## 注意

- **不要滥用**：preload 太多会挤占首屏带宽，反而变慢。只 preload 关键路径资源。
- preload 了但 3s 内没用上的资源，浏览器会**控制台警告**（浪费）。
- \`as\` 必须准确，否则优先级和 CSP 校验会出错。`
  },
  {
    id: 'html-024',
    category: 'html',
    title: 'postMessage 的作用是什么？如何安全地进行跨文档通信？',
    difficulty: '中等',
    tags: ['postMessage', '跨域', '通信', '安全'],
    answer: `## 作用

\`window.postMessage\` 是浏览器提供的**跨源通信** API，允许不同窗口（iframe、window.open、Web Worker）之间安全传递消息，不受同源策略限制。

\`\`\`js
// 父页面向内嵌 iframe 发送
const iframe = document.querySelector('iframe')
iframe.contentWindow.postMessage({ type: 'hello' }, 'https://child.com')

// iframe 内接收
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://parent.com') return  // ✅ 校验来源
  console.log(e.data, e.source)
})
\`\`\`

## 参数

\`\`\`js
targetWindow.postMessage(message, targetOrigin, [transfer])
\`\`\`
- \`message\`：任意结构化克隆可处理的数据（对象、数组等，**不能是函数**）。
- \`targetOrigin\`：指定接收方源（协议+主机+端口），**不要写 \`*\`**（安全风险）。
- \`transfer\`：可转移对象（如 ArrayBuffer、MessagePort），转移后原窗口无法再访问。

## 安全要点

1. **发送时指定 targetOrigin**，避免消息泄露给恶意页面：
   \`\`\`js
   // ❌ 危险
   win.postMessage(data, '*')
   // ✅ 安全
   win.postMessage(data, 'https://expected.com')
   \`\`\`
2. **接收时校验 e.origin**，只信任预期来源：
   \`\`\`js
   window.addEventListener('message', (e) => {
     if (e.origin !== 'https://trusted.com') return
     // 处理
   })
   \`\`\`
3. **校验 data 结构**，不要直接 eval 或 innerHTML。
4. 双向通信用 MessageChannel 更清晰、避免广播。

## MessageChannel（点对点）

\`\`\`js
const ch = new MessageChannel()
ch.port1.onmessage = e => console.log('收到', e.data)
otherWin.postMessage('port', 'https://other.com', [ch.port2])
\`\`\`
端口转移后，只有持有 port 的双方能通信，比全局 message 事件更安全、更高效。

## 应用场景

- iframe 嵌入第三方组件通信（广告、编辑器、支付）。
- \`window.open\` 弹窗与父窗口通信（OAuth 回调）。
- Web Worker 通信（Worker 本身也用 postMessage）。
- 微前端框架（qiankun、single-spa）主子应用通信。`
  },
  {
    id: 'html-025',
    category: 'html',
    title: 'HTML5 拖放 API（Drag and Drop）怎么用？',
    difficulty: '中等',
    tags: ['拖放', 'Drag', 'Drop', 'HTML5'],
    answer: `## 基本用法

HTML5 原生拖放基于事件 + \`dataTransfer\` 数据传递。

\`\`\`html
<div id="src" draggable="true">拖我</div>
<div id="dst">放这里</div>
\`\`\`

\`\`\`js
const src = document.getElementById('src')
const dst = document.getElementById('dst')

// 源元素
src.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', 'source-data')
  e.dataTransfer.effectAllowed = 'move'
})

// 目标元素
dst.addEventListener('dragover', (e) => {
  e.preventDefault()  // ✅ 必须 preventDefault 才能触发 drop
  e.dataTransfer.dropEffect = 'move'
})
dst.addEventListener('drop', (e) => {
  e.preventDefault()
  const data = e.dataTransfer.getData('text/plain')
  dst.textContent = '收到: ' + data
})
\`\`\`

## 事件流

**拖动源**：\`dragstart\` → \`drag\`（持续）→ \`dragend\`
**放置目标**：\`dragenter\` → \`dragover\`（持续）→ \`dragleave\` / \`drop\`

## dataTransfer

- \`setData(type, data)\` / \`getData(type)\`：传递数据，常用 \`text/plain\`、\`text/uri-list\`、\`text/html\`。
- \`effectAllowed\` / \`dropEffect\`：控制光标样式（copy/move/link）。
- \`setDragImage(el, x, y)\`：自定义拖动时的预览图。
- \`files\`：拖入的文件列表（文件拖放）。

## 文件拖放

\`\`\`js
dst.addEventListener('drop', (e) => {
  e.preventDefault()
  const files = e.dataTransfer.files
  for (const f of files) {
    console.log(f.name, f.size, f.type)
  }
})
\`\`\`

## 注意

1. **\`dragover\` 必须 \`preventDefault\`**，否则浏览器默认不允许 drop（drop 事件不会触发）。
2. \`draggable="true"\` 让元素可拖动；图片、链接默认可拖动。
3. **移动端支持差**：HTML5 拖放基于鼠标事件，触摸设备需配合 Pointer Events 或用库（如 SortableJS）。
4. 可访问性：原生拖放对键盘不友好，需额外实现"选中→移动→放置"的键盘交互，或提供替代方式。
5. 拖动到不同窗口/标签页也可工作（\`dragend\` 的 \`dataTransfer.dropEffect\` 反映结果）。`
  },
  {
    id: 'html-026',
    category: 'html',
    title: 'History API 有哪些方法？SPA 路由是如何基于它实现的？',
    difficulty: '中等',
    tags: ['History', 'SPA', '路由', 'pushState'],
    answer: `## History API

\`window.history\` 提供操作浏览器会话历史的能力。

\`\`\`js
history.back()        // 后退
history.forward()     // 前进
history.go(-2)        // 前进/后退 n 步

history.pushState(state, title, url)   // 压入新历史记录（不刷新页面）
history.replaceState(state, title, url) // 替换当前记录

history.state         // 当前状态对象
history.length        // 会话历史长度
\`\`\`

## pushState vs replaceState

- \`pushState\`：**新增**一条历史记录，地址栏 URL 变化但页面不跳转，可点后退回到前一页。
- \`replaceState\`：**替换**当前记录，不产生新历史项，后退不会回到替换前的 URL。

\`\`\`js
history.pushState({ page: 'list' }, '', '/list')
history.pushState({ page: 'detail' }, '', '/detail/1')
// 地址栏变 /detail/1，点后退回到 /list
\`\`\`

## popstate 事件

**点前进/后退按钮**（或 JS 调用 back/go）时触发 \`popstate\`，但 \`pushState\`/\`replaceState\` **不会**触发。

\`\`\`js
window.addEventListener('popstate', (e) => {
  console.log('导航到', location.pathname, '状态', e.state)
  render(location.pathname)
})
\`\`\`

## SPA 路由实现

\`\`\`js
// 1. 拦截 a 链接点击
document.addEventListener('click', (e) => {
  const a = e.target.closest('a')
  if (!a || a.target === '_blank') return
  if (a.origin !== location.origin) return
  e.preventDefault()
  navigate(a.pathname)
})

// 2. 导航：pushState + 渲染
function navigate(path) {
  history.pushState({ path }, '', path)
  render(path)
}

// 3. 监听前进后退
window.addEventListener('popstate', () => render(location.pathname))

// 4. 首次渲染
render(location.pathname)
\`\`\`

## hash 路由 vs history 路由

| | hash 路由 | history 路由 |
| --- | --- | --- |
| URL | \`/#/list\` | \`/list\` |
| 实现 | 监听 \`hashchange\` | 监听 \`popstate\` + pushState |
| 服务器 | 无需配置 | **需配置回退到 index.html** |
| SEO | 不友好（# 后内容忽略） | 友好 |

## 注意

- \`pushState\` 的 \`url\` **必须同源**，否则抛 SecurityError。
- \`title\` 参数目前浏览器基本忽略，传空串即可。
- 部署 history 路由必须让服务器对所有路由返回 \`index.html\`（Nginx \`try_files\`），否则刷新 404。
- 状态对象会被序列化、有大小限制（约 640KB）。`
  },
  {
    id: 'html-027',
    category: 'html',
    title: 'File 和 Blob 是什么？如何实现文件上传与预览？',
    difficulty: '中等',
    tags: ['File', 'Blob', '文件上传', 'FormData'],
    answer: `## Blob 与 File

- **\`Blob\`**（Binary Large Object）：表示不可变的二进制数据，\`{ size, type }\`。
- **\`File\`**：继承自 Blob，增加 \`name\`、\`lastModified\`，通常来自 \`<input type="file">\` 或拖放。

\`\`\`js
const blob = new Blob(['hello'], { type: 'text/plain' })
blob.size   // 5
blob.type   // 'text/plain'
\`\`\`

## 文件上传

\`\`\`html
<input type="file" id="f" multiple accept="image/*">
\`\`\`

\`\`\`js
const input = document.getElementById('f')
input.addEventListener('change', async () => {
  const files = input.files  // FileList
  const fd = new FormData()
  for (const f of files) fd.append('files', f, f.name)
  await fetch('/upload', { method: 'POST', body: fd })
})
\`\`\`

> \`FormData\` 自动设置 \`Content-Type: multipart/form-data\` 与边界，**不要手动设**。

## 图片预览

### FileReader（base64）
\`\`\`js
function preview(file, imgEl) {
  const reader = new FileReader()
  reader.onload = e => imgEl.src = e.target.result
  reader.readAsDataURL(file)
}
\`\`\`

### URL.createObjectURL（blob URL，更高效）
\`\`\`js
const url = URL.createObjectURL(file)
imgEl.src = url
// 用完释放
URL.revokeObjectURL(url)
\`\`\`
\`createObjectURL\` 同步、不读文件内容、内存占用低，预览大图首选；\`FileReader\` 适合需要 base64 内容（如本地处理、上传前压缩）的场景。

## Blob 常用操作

\`\`\`js
// 读取文本
blob.text().then(t => console.log(t))

// 下载文件
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url; a.download = 'data.json'; a.click()
URL.revokeObjectURL(url)

// Blob 切片（大文件分片上传）
file.slice(0, 1024 * 1024)  // 返回新 Blob
\`\`\`

## 大文件分片上传

\`\`\`js
async function uploadChunked(file, chunkSize = 5 * 1024 * 1024) {
  for (let i = 0; i < file.size; i += chunkSize) {
    const chunk = file.slice(i, i + chunkSize)
    const fd = new FormData()
    fd.append('chunk', chunk)
    fd.append('index', i / chunkSize)
    await fetch('/upload-chunk', { method: 'POST', body: fd })
  }
}
\`\`\`

## 拖拽上传

监听 \`drop\` 事件，从 \`e.dataTransfer.files\` 获取文件，与 input 流程一致。`
  },
  {
    id: 'html-028',
    category: 'html',
    title: 'contenteditable 是什么？如何用它实现富文本编辑？',
    difficulty: '中等',
    tags: ['contenteditable', '富文本', '编辑器'],
    answer: `## contenteditable

给任意元素加 \`contenteditable="true"\`，该元素即可像输入框一样**直接编辑内容**。

\`\`\`html
<div contenteditable="true">点这里直接编辑文字</div>
\`\`\`

## 富文本编辑原理

1. 一个 \`contenteditable\` 容器作为编辑区。
2. 用 \`document.execCommand\`（已废弃但仍可用）执行加粗、插入链接等格式化。
3. 现代编辑器改用 **Selection API + 自定义模型**。

### 旧式 execCommand（简单但已废弃）
\`\`\`js
document.execCommand('bold')          // 加粗
document.execCommand('italic')        // 斜体
document.execCommand('insertImage', false, url)
document.execCommand('formatBlock', false, 'h2')
\`\`\`
\`\`\`html
<div contenteditable id="editor"></div>
<button onclick="document.execCommand('bold')">B</button>
\`\`\`

### 读取结果
\`\`\`js
const html = editor.innerHTML   // 富文本 HTML
const text = editor.innerText   // 纯文本
\`\`\`

## 现代富文本编辑器架构

\`execCommand\` 的问题：标准不统一、生成 HTML 不可控、难以协同。现代编辑器（Slate、ProseMirror、Quill、TipTap、Lexical）采用：

1. **自定义数据模型**：内部维护 JSON 树结构（而非直接操作 DOM）。
2. **Selection API**：\`window.getSelection()\` 获取光标范围，手动增删节点。
3. **模型 → 视图渲染**：状态驱动，类似 React 的虚拟 DOM。
4. **协同编辑**：基于 CRDT/OT 同步模型变更。

## 注意

1. **\`contenteditable\` 的坑**：浏览器对回车、复制粘贴、列表的处理差异巨大（Chrome 插 \`<div>\`、Firefox 插 \`<br>\`），是富文本编辑器难写的主因。
2. **XSS 风险**：粘贴的内容含任意 HTML，必须**净化**（DOMPurify）后再存/渲染。
3. **光标管理**：失焦再恢复光标位置需用 Range/Selection 保存还原。
4. **占位符**：用 \`:empty::before { content: attr(data-placeholder) }\` 实现占位提示。
5. **单行编辑**：\`contenteditable="plaintext-only"\` 限制只能纯文本（Chrome 支持），或监听 \`keydown\` 阻止回车。`
  },
  {
    id: 'html-029',
    category: 'html',
    title: 'Web Components 由哪几部分组成？它的优缺点是什么？',
    difficulty: '困难',
    tags: ['Web Components', 'Custom Elements', 'Shadow DOM', '组件化'],
    answer: `## Web Components

浏览器原生支持的组件化方案，由三大规范组成：

### 1. Custom Elements（自定义元素）
\`\`\`js
class MyToast extends HTMLElement {
  constructor() { super() }
  connectedCallback() { this.render() }
  disconnectedCallback() { /* 清理 */ }
  static get observedAttributes() { return ['type'] }
  attributeChangedCallback(name, oldV, newV) { this.render() }
  render() { this.innerHTML = '<p>toast</p>' }
}
customElements.define('my-toast', MyToast)
\`\`\`
\`\`\`html
<my-toast type="success"></my-toast>
\`\`\`

- 生命周期：\`connectedCallback\`、\`disconnectedCallback\`、\`adoptedCallback\`、\`attributeChangedCallback\`。
- 自动以 \`-\` 命名（避免与原生标签冲突）。

### 2. Shadow DOM（影子 DOM）
封装样式与结构，外部 CSS 无法穿透，内部样式不泄漏：
\`\`\`js
const shadow = this.attachShadow({ mode: 'open' })
shadow.innerHTML = \`
  <style>:host { display: block } p { color: red }</style>
  <p>隔离的内容</p>
\`
\`\`\`

### 3. HTML Templates（模板）
\`<template>\` 内容不渲染但可被 JS 克隆复用，\`<slot>\` 实现内容分发：
\`\`\`html
<template id="card">
  <style>...</style>
  <div class="card"><slot name="title">默认标题</slot></div>
</template>
\`\`\`

## 完整示例
\`\`\`js
class UserCard extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    const tpl = document.getElementById('card').content
    shadow.appendChild(tpl.cloneNode(true))
  }
}
customElements.define('user-card', UserCard)
\`\`\`
\`\`\`html
<user-card>
  <span slot="title">张三</span>
</user-card>
\`\`\`

## 优点

- **框架无关**：原生 API，Vue/React/Angular 都能用，跨技术栈复用。
- **样式隔离**：Shadow DOM 天然防止样式冲突，做组件库/微前端理想。
- **无依赖**：不打包框架运行时，体积小。
- **标准化**：浏览器内置，长期稳定。

## 缺点

- **API 偏底层**：无响应式数据、模板语法、列表渲染，需手写大量样板，相比 Vue/React 开发效率低。
- **SSR 困难**：Shadow DOM 在服务端无法生成。
- **SEO 不友好**：自定义元素的初始内容为空，爬虫难索引。
- **表单集成**：要让自定义元素参与表单需实现 \`ElementInternals\`（\`attachInternals\`）。
- **样式穿透限制**：外部难以定制内部样式，需借助 CSS 变量、\`::part()\`。

## 实践

通常不直接写原生 Web Components，而用 **Lit、Stencil、Fast** 等库提供响应式装饰与模板，再编译为标准 Web Components，兼顾原生复用与开发体验。`
  },
  {
    id: 'html-030',
    category: 'html',
    title: 'HTML 转义与 XSS 防护怎么做？',
    difficulty: '中等',
    tags: ['XSS', '安全', '转义', 'CSP'],
    answer: `## XSS（跨站脚本攻击）

攻击者把恶意脚本注入到页面中，在其他用户浏览器执行，可窃取 Cookie、伪造操作、挂马。分三类：

- **存储型**：恶意代码存入数据库，他人访问时执行（如评论里插 \`<script>\`）。
- **反射型**：恶意代码在 URL 参数里，服务端回显到页面（\`?q=<script>\`）。
- **DOM 型**：纯前端 JS 把不可信数据插入 DOM（\`innerHTML = userInput\`）。

## 核心防护：按上下文转义

### 1. HTML 上下文（元素内容/属性）
转义 \`<\`、\`>\`、\`&\`、\`"\`、\`'\`：
\`\`\`js
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  }[c]))
}
div.textContent = userInput  // ✅ 自动转义，首选
div.innerHTML = escapeHtml(userInput)  // ✅ 显式转义
\`\`\`

### 2. 属性上下文
\`\`\`html
<!-- ✅ 用引号包裹 + 转义引号 -->
<div data-name="\${escapeHtml(name)}">
\`\`\`
注意 \`javascript:\` 协议：\`<a href="\${url}">\`，若 url 来自用户，需校验协议是 http/https。

### 3. JS 上下文
\`\`\`html
<script>
  const data = \${JSON.stringify(userInput)}  // ✅ JSON.stringify 处理
</script>
\`\`\`
\`</script>\` 序列需额外处理（\`<\\/script>\`）。

### 4. URL 上下文
\`\`\`js
a.href = 'https://example.com/?q=' + encodeURIComponent(userInput)
\`\`\`

## 危险 API（DOM 型 XSS 来源）

| API | 风险 | 安全替代 |
| --- | --- | --- |
| \`innerHTML\` | 解析 HTML，执行脚本 | \`textContent\` / \`insertAdjacentText\` |
| \`outerHTML\` | 同上 | — |
| \`document.write\` | 解析 HTML | DOM API |
| \`eval\` / \`Function\` | 执行任意代码 | JSON.parse |
| \`setTimeout(str)\` | 类似 eval | 函数引用 |
| \`setAttribute('onclick', x)\` | 注入事件 | addEventListener |

> 现代 API（\`innerText\`、\`textContent\`）**不会**解析 HTML，安全。Vue 的 \`{{}}\`、React 的 \`{x}\` 默认转义，需 \`v-html\`/\`dangerouslySetInnerHTML\` 才会裸渲染。

## CSP（内容安全策略）

深度防御，限制脚本来源：
\`\`\`http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.com; object-src 'none'
\`\`\`
- 禁止内联脚本、\`eval\`、外部域脚本，即使有注入也无法执行。
- 配置 \`nonce\` 或 \`hash\` 允许指定内联脚本。

## 其他防护

- **HttpOnly Cookie**：JS 无法读取，防窃取。
- **输入校验**：白名单优于黑名单（如只允许数字）。
- **富文本场景**：用 DOMPurify 等库净化 HTML，按白名单保留标签/属性。
- **框架默认安全**：Vue/React 默认转义，少用 \`v-html\`/\`dangerouslySetInnerHTML\`。`
  },
  {
    id: 'html-031',
    category: 'html',
    title: 'meta 标签有哪些重要作用？聊聊 charset、http-equiv 与 SEO 相关 meta。',
    difficulty: '中等',
    tags: ['meta', 'charset', 'SEO', 'viewport'],
    answer: `## meta 标签

\`<meta>\` 提供文档元信息，不显示在页面上，分为三类属性：\`charset\`、\`name+content\`、\`http-equiv+content\`。

## 1. charset — 字符编码
\`\`\`html
<meta charset="UTF-8">
\`\`\`
必须放在 \`<head>\` 最前面（前 1024 字节内），否则浏览器可能用默认编码解析导致乱码。建议 UTF-8。

## 2. name + content — 文档元信息

### SEO 相关
\`\`\`html
<meta name="description" content="前端面试题库，覆盖 Vue/React/JS...">
<meta name="keywords" content="前端,面试,Vue,React">  <!-- 已被搜索引擎忽略 -->
<meta name="author" content="xxx">
<meta name="robots" content="index, follow">  <!-- 允许索引/跟踪链接 -->
\`\`\`

### 移动端
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
\`\`\`
\`width=device-width\` 视口宽=设备宽，\`initial-scale=1\` 初始缩放，是响应式必备。

### 移动端特有
\`\`\`html
<!-- iOS 添加到主屏的 Web App 模式 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">

<!-- 主题色（浏览器地址栏颜色） -->
<meta name="theme-color" content="#42b883">
\`\`\`

### Open Graph（社交分享）
\`\`\`html
<meta property="og:title" content="前端面试题库">
<meta property="og:description" content="...">
<meta property="og:image" content="https://.../cover.png">
<meta property="og:url" content="https://...">
<meta name="twitter:card" content="summary_large_image">
\`\`\`
分享到微信/Twitter/Facebook 时显示标题、描述、封面图。

## 3. http-equiv + content — 模拟 HTTP 头
\`\`\`html
<!-- 重定向 -->
<meta http-equiv="refresh" content="3;url=https://example.com">

<!-- 安全头（部分） -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
\`\`\`

## 结构化数据（JSON-LD）

比 meta 更强的 SEO 方式，告诉搜索引擎页面类型：
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." }
}
</script>
\`\`\`
可获 Google 富媒体搜索结果（评分、面包屑、FAQ 折叠）。

## 注意

- \`description\` 影响**搜索结果摘要**（非排名），应每页独特、含关键词、≤160 字。
- \`keywords\` 因滥用已被主流搜索引擎忽略，不必花精力。
- \`viewport\` 是响应式基石，缺失会导致移动端显示桌面版缩略图。
- 现代 SEO 更看重内容质量、性能、移动友好、结构化数据，而非堆砌 meta。`
  },
  {
    id: 'html-032',
    category: 'html',
    title: 'PWA 是什么？manifest 和 Service Worker 各起什么作用？',
    difficulty: '困难',
    tags: ['PWA', 'manifest', 'Service Worker', '离线'],
    answer: `## PWA

**PWA**（Progressive Web App）是一套技术方案，让网页具备**类原生应用**体验：可安装到桌面、离线可用、推送通知、全屏启动。核心三件套：HTTPS + Manifest + Service Worker。

## 1. Web App Manifest

\`manifest.json\` 描述应用的图标、名称、启动方式，让浏览器提示"添加到主屏"：
\`\`\`json
{
  "name": "前端题库",
  "short_name": "题库",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#42b883",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
\`\`\`
\`\`\`html
<link rel="manifest" href="/manifest.json">
\`\`\`
\`display: standalone\` 隐藏浏览器 UI，像独立 App；\`fullscreen\` 全屏；\`minimal-ui\` 保留少量控件。

## 2. Service Worker

独立线程的 JS，作为浏览器与网络之间的**代理**，可拦截请求、缓存资源、实现离线。

\`\`\`js
// 注册
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
\`\`\`

\`\`\`js
// sw.js
const CACHE = 'v1'

// 安装：预缓存关键资源
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/app.js', '/style.css']))
    .then(() => self.skipWaiting()))
})

// 激活：清理旧缓存
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()))
})

// 拦截请求：缓存优先，回退网络
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone()
      caches.open(CACHE).then(c => c.put(e.request, copy))
      return res
    }).catch(() => caches.match('/offline.html')))
  )
})
\`\`\`

## 缓存策略

| 策略 | 适用 |
| --- | --- |
| **Cache First** | 静态资源（CSS/JS/图片） |
| **Network First** | 动态内容（API），网络失败用缓存 |
| **Stale While Revalidate** | 即时响应 + 后台更新 |
| **Network Only** / **Cache Only** | 强一致 / 完全离线 |

用 Workbox 库可声明式实现这些策略。

## 其他能力

- **推送通知**：\`self.registration.showNotification()\` + Push API（需后端配合 VAPID）。
- **后台同步**：\`SyncManager\`，断网时排队，恢复后执行。
- **周期性后台任务**：Periodic Sync。
- **离线存储**：IndexedDB（Service Worker 内可用）。

## 限制

- **必须 HTTPS**（localhost 除外）。
- **不能操作 DOM**：通过 \`postMessage\` 与页面通信。
- **生命周期长**：注意版本与缓存更新（\`skipWaiting\` + \`clients.claim\`）。
- **iOS 限制**：推送、后台同步支持不完整。
- 首次访问无缓存（SW 需安装后才生效），不能保证 100% 离线。`
  },
  {
    id: 'html-033',
    category: 'html',
    title: 'video/audio 媒体元素怎么用？常见事件与属性有哪些？',
    difficulty: '中等',
    tags: ['video', 'audio', '媒体', '事件'],
    answer: `## 基本用法

\`\`\`html
<video src="movie.mp4" controls width="640" poster="cover.jpg">
  你的浏览器不支持 video
</video>

<!-- 多源 + 字幕 -->
<video controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.webm" type="video/webm">
  <track src="sub-zh.vtt" kind="subtitles" srclang="zh" label="中文字幕">
</video>

<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  <source src="song.ogg" type="audio/ogg">
</audio>
\`\`\`

## 常用属性

| 属性 | 作用 |
| --- | --- |
| \`src\` / \`<source>\` | 视频源（多 source 浏览器选第一个支持的） |
| \`controls\` | 显示原生控制条 |
| \`autoplay\` | 自动播放（多数浏览器需 \`muted\` 才允许） |
| \`muted\` | 静音 |
| \`loop\` | 循环 |
| \`poster\` | 封面图（加载前显示） |
| \`preload\` | \`auto\`/\`metadata\`/\`none\` 预加载策略 |
| \`width\`/\`height\` | 尺寸（设了避免布局抖动） |
| \`playsinline\` | iOS 内联播放（不全屏） |
| \`crossorigin\` | 跨域资源（Canvas 截图需要） |

## 常用 JS 属性/方法
\`\`\`js
video.play()          // 播放（返回 Promise）
video.pause()         // 暂停
video.currentTime     // 当前时间（秒，可读写跳转）
video.duration        // 总时长
video.volume          // 音量 0~1
video.playbackRate    // 播放速率（1 正常，2 两倍速）
video.muted           // 是否静音
video.buffered        // 已缓冲区间
video.readyState      // 0~4 数据就绪程度
video.networkState    // 网络状态
\`\`\`

## 常见事件

| 事件 | 时机 |
| --- | --- |
| \`loadstart\` | 开始加载 |
| \`loadedmetadata\` | 元数据（时长/尺寸）就绪 |
| \`canplay\` / \`canplaythrough\` | 可播放 / 可流畅播放到底 |
| \`play\` / \`pause\` | 播放/暂停 |
| \`playing\` | 缓冲后恢复播放 |
| \`waiting\` | 缓冲中 |
| \`timeupdate\` | currentTime 变化（约 4 次/秒） |
| \`ended\` | 播放结束 |
| \`volumechange\` | 音量/静音变化 |
| \`ratechange\` | 倍速变化 |
| \`error\` | 加载错误（看 \`video.error.code\`） |

## 自动播放策略

浏览器禁止带声音的自动播放（用户体验/广告骚扰）。解决方案：
- \`<video autoplay muted>\`：静音可自动播放。
- 先 \`muted autoplay\`，再引导用户点击"取消静音"。
- 监听 \`play()\` 返回的 Promise，捕获拒绝：
\`\`\`js
video.play().catch(() => { /* 被拦截，显示播放按钮 */ })
\`\`\`

## 注意

- **格式兼容**：MP4(H.264) 通用性最好；WebM 体积小但 Safari 支持晚。用多 \`<source>\` 降级。
- **跨域 Canvas 截图**：要 \`crossorigin="anonymous"\` 且服务器发 CORS 头，否则 \`drawImage\` 后 canvas 被"污染"无法 \`toDataURL\`。
- **流媒体**：HLS(\`.m3u8\`)/DASH 需 Media Source Extensions 或 hls.js/dash.js 库，原生 \`<video>\` 不直接支持（Safari 原生支持 HLS）。
- **可访问性**：提供 \`<track>\` 字幕；不要把 controls 藏起来又没替代键盘控制。`
  },
  {
    id: 'html-034',
    category: 'html',
    title: 'Page Visibility API 是什么？visibilitychange 有哪些应用？',
    difficulty: '简单',
    tags: ['Page Visibility', 'visibilitychange', '性能'],
    answer: `## Page Visibility API

检测页面是否对用户可见（切换标签页、最小化窗口）。

\`\`\`js
document.visibilityState   // 'visible' | 'hidden' | 'prerender'
document.hidden            // true/false（旧 API）
\`\`\`

\`\`\`js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('页面被切到后台')
  } else {
    console.log('页面回到前台')
  }
})
\`\`\`

## 应用场景

### 1. 暂停/恢复资源消耗
切到后台时暂停视频、轮播、动画、WebSocket 重连、定时器：
\`\`\`js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    video.pause()
    clearInterval(timer)
  } else {
    video.play()
    startPolling()
  }
})
\`\`\`

### 2. 节省轮询/请求频率
后台时降低数据拉取频率，前台恢复：
\`\`\`js
let interval = 5000
document.addEventListener('visibilitychange', () => {
  interval = document.hidden ? 60000 : 5000
})
\`\`\`

### 3. 准确的停留时长统计
传统 \`unload\` 在移动端不可靠，且后台时间不应计入"活跃停留"。用 visibilitychange 区分：
\`\`\`js
let activeStart = Date.now(), activeTime = 0
document.addEventListener('visibilitychange', () => {
  if (document.hidden) activeTime += Date.now() - activeStart
  else activeStart = Date.now()
})
window.addEventListener('pagehide', () => {
  if (!document.hidden) activeTime += Date.now() - activeStart
  navigator.sendBeacon('/stats', { activeTime })
})
\`\`\`

### 4. 回前台时刷新数据
切回标签页时拉取最新消息（聊天/通知应用）：
\`\`\`js
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) fetchLatest()
})
\`\`\`

### 5. 暂停游戏 / 实验倒计时
防止后台"挂机"，保证公平与正确性。

## 注意

- 移动端切后台系统可能直接冻结页面，\`visibilitychange\` 仍会先触发 \`hidden\`，是保存状态的可靠时机。
- 配合 \`sendBeacon\`（页面卸载时发送数据）做埋点最稳。
- 不要依赖 \`blur\`/\`focus\`（切标签页不一定触发 focus 变化，且弹窗会触发 blur）。
- \`prerender\` 状态已逐步废弃，主流是 \`visible\`/\`hidden\`。`
  },
  {
    id: 'html-035',
    category: 'html',
    title: 'Fullscreen API 怎么用？有哪些注意事项？',
    difficulty: '简单',
    tags: ['Fullscreen', '全屏', 'API'],
    answer: `## Fullscreen API

让任意元素（或整个文档）进入全屏显示。

\`\`\`js
const el = document.getElementById('player')

// 进入全屏（注意前缀与 Promise）
async function enter() {
  try {
    await (el.requestFullscreen || el.webkitRequestFullscreen).call(el)
  } catch (e) { console.log('全屏失败', e) }
}

// 退出全屏
document.exitFullscreen?.()

// 当前全屏元素
document.fullscreenElement   // Element 或 null
\`\`\`

\`\`\`js
// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  console.log('全屏元素:', document.fullscreenElement)
})
\`\`\`

## 样式

\`\`\`css
/* 全屏元素样式 */
:fullscreen { background: #000; }
:-webkit-full-screen { background: #000; }

/* 仅在全屏时显示的控件 */
.controls { display: none; }
:fullscreen .controls { display: flex; }
\`\`\`

## 注意事项

1. **用户手势触发**：必须由用户交互（click/keydown）调用 \`requestFullscreen\`，不能自动全屏（类似 autoplay 限制）。
2. **前缀**：Safari 用 \`webkitRequestFullscreen\`、\`webkitExitFullscreen\`、\`webkitFullscreenElement\`；旧版 IE/Edge 有 \`ms\` 前缀。实际项目可用 screenfull.js 屏蔽差异。
3. **Esc 退出**：浏览器强制 Esc/F11 退出全屏，无法阻止（安全设计）。
4. **全屏后键盘限制**：部分浏览器在全屏下限制键盘输入（除方向键等），需配合键盘锁定 API（Keyboard Lock）。
5. **iOS Safari 不支持任意元素全屏**：只支持 \`<video>\` 的 \`webkitEnterFullscreen\`，且只能视频全屏，普通 div 全屏在 iOS 上长期受限。
6. **样式隔离**：全屏元素被提升到顶层，\`z-index\` 失效；用 \`:fullscreen\` 伪类定制。
7. **退出事件**：用户按 Esc 退出会触发 \`fullscreenchange\`（\`fullscreenElement\` 变 null），据此恢复 UI。

## 典型场景

- 视频播放器全屏按钮。
- 在线幻灯片/PPT 演示。
- 代码编辑器/设计工具的"专注模式"。
- 小游戏全屏体验。`
  },
  {
    id: 'html-036',
    category: 'html',
    title: 'Clipboard API 怎么用？如何实现复制到剪贴板？',
    difficulty: '简单',
    tags: ['Clipboard', '剪贴板', '复制', 'navigator'],
    answer: `## 复制文本

### 现代 API（推荐）
\`\`\`js
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    console.log('已复制')
  } catch (e) {
    // 降级
    legacyCopy(text)
  }
}
\`\`\`

### 降级方案（execCommand）
\`\`\`js
function legacyCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}
\`\`\`

## 读取剪贴板

\`\`\`js
async function paste() {
  try {
    const text = await navigator.clipboard.readText()
    console.log('剪贴板:', text)
  } catch (e) {
    // 读取通常被拦截
  }
}
\`\`\`

## 复制富文本/图片

\`ClipboardItem\` 支持多种 MIME：
\`\`\`js
async function copyImage(blob) {
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob })
  ])
}

// 富文本
await navigator.clipboard.write([
  new ClipboardItem({
    'text/html': new Blob(['<b>粗体</b>'], { type: 'text/html' }),
    'text/plain': new Blob(['粗体'], { type: 'text/plain' })
  })
])
\`\`\`

## 监听复制/粘贴事件

\`\`\`js
document.addEventListener('copy', e => {
  e.preventDefault()
  e.clipboardData.setData('text/plain', '自定义复制内容')
})

document.addEventListener('paste', e => {
  const items = e.clipboardData.items
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()  // 粘贴的图片
    }
  }
})
\`\`\`

## 权限与限制

1. **安全上下文**：\`navigator.clipboard\` 仅在 **HTTPS**（或 localhost）可用。
2. **用户手势**：\`writeText\` 需用户点击等手势触发；\`readText\` 还需 \`clipboard-read\` 权限授权，常弹权限提示。
3. **execCommand 已废弃**但仍可用，是兼容旧浏览器的降级手段。
4. **焦点要求**：\`execCommand('copy')\` 需页面有焦点，后台标签页会失败。
5. **\`ClipboardItem\`** 类型值必须是 Blob，且同一项需提供 \`text/plain\` 兜底（部分浏览器要求）。

## 应用

- 一键复制代码块、分享链接、邀请码。
- 粘贴图片直接上传（聊天框、富文本编辑器）。
- 复制表格为 Excel 友好的 tab 分隔文本。`
  },
  {
    id: 'html-037',
    category: 'html',
    title: 'URL 和 URLSearchParams 怎么用？',
    difficulty: '简单',
    tags: ['URL', 'URLSearchParams', '查询参数'],
    answer: `## URL 接口

解析与构造 URL，比字符串拼接可靠：

\`\`\`js
const u = new URL('https://user:pass@example.com:8080/a/b?x=1&y=2#hash')

u.origin      // 'https://example.com:8080'
u.protocol    // 'https:'
u.host        // 'example.com:8080'
u.hostname    // 'example.com'
u.port        // '8080'
u.pathname    // '/a/b'
u.search      // '?x=1&y=2'
u.hash        // '#hash'
u.username    // 'user'
u.password    // 'pass'
u.href        // 完整 URL

u.searchParams  // URLSearchParams 对象
\`\`\`

## 修改 URL
\`\`\`js
u.pathname = '/c/d'
u.searchParams.set('z', '3')
u.toString()  // 序列化
\`\`\`

## URLSearchParams — 查询参数

\`\`\`js
const p = new URLSearchParams('?a=1&b=2&b=3')

p.get('a')           // '1'
p.getAll('b')         // ['2', '3']  同名多值
p.has('a')            // true
p.set('c', '4')
p.append('b', '4')
p.delete('a')
p.toString()          // 'b=2&b=3&c=4&b=4'
\`\`\`

## 遍历
\`\`\`js
for (const [k, v] of p) console.log(k, v)
\`\`\`

## 从 location 便捷获取
\`\`\`js
const p = new URLSearchParams(location.search)
const id = p.get('id')
\`\`\`

## 编码

\`\`\`js
encodeURIComponent('a b&c')  // 'a%20b%26c'  编码组件
encodeURI('https://x.com/a b')  // 编码整 URL（保留 :/?# 等）
decodeURIComponent('%20')   // ' '
\`\`\`

- \`encodeURIComponent\`：编码查询参数值（编码所有特殊字符），**拼 URL 参数时用它**。
- \`encodeURI\`：编码完整 URL，保留分隔符，**不会破坏 URL 结构**。

## 实用：拼接查询参数

\`\`\`js
// ❌ 容易出错
fetch('/api?id=' + id + '&name=' + name)

// ✅ 推荐
const p = new URLSearchParams({ id, name })
fetch('/api?' + p)  // 自动编码
\`\`\`

## 注意

- \`new URL()\` 会校验格式，非法 URL 抛 TypeError，可用 \`try/catch\` 做校验。
- 相对路径解析需传 base：\`new URL('/api', location.origin)\`。
- URLSearchParams 会自动 \`encodeURIComponent\`，无需手动编码。
- IE 不支持，需 polyfill（或用 \`new URLSearchParams\` 的 URL 版本检测）。`
  },
  {
    id: 'html-038',
    category: 'html',
    title: 'tabindex 的作用是什么？如何保证组件的键盘可达性？',
    difficulty: '中等',
    tags: ['tabindex', '可访问性', '键盘导航', 'a11y'],
    answer: `## tabindex

\`tabindex\` 全局属性控制元素能否被 Tab 键聚焦及顺序：

| 值 | 行为 |
| --- | --- |
| 无 tabindex | \`<button>\`、\`<a>\`、\`<input>\` 等原生可交互元素**默认可聚焦**，顺序按 DOM |
| \`tabindex="0"\` | 让**任意元素**可聚焦，加入 Tab 序列（按 DOM 顺序） |
| \`tabindex="-1"\` | 可聚焦（JS focus），但**不在 Tab 序列**中 |
| \`tabindex="1+"\`（正数） | ❌ 不推荐：打乱自然顺序，维护困难 |

\`\`\`html
<!-- 让 div 可被 Tab 聚焦 -->
<div tabindex="0" role="button" onkeydown="handleKey(event)">自定义按钮</div>

<!-- 模态框打开时聚焦它，关闭后焦点还原 -->
<div class="modal" tabindex="-1" ref="modal"></div>
\`\`\`

## 键盘可达性原则

### 1. 优先用原生交互元素
\`<button>\`、\`<a href>\`、\`<input>\` 天然支持 Tab、Enter、Space，无需 tabindex：
\`\`\`html
<!-- ✅ 推荐 -->
<button onclick="save()">保存</button>

<!-- ❌ 别这样 -->
<div class="btn" onclick="save()">保存</div>
\`\`\`

### 2. 自定义组件必须支持键盘
用 \`role\` 声明语义 + 监听键盘事件：
\`\`\`js
function handleKey(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    activate()
  }
}
\`\`\`

### 3. 焦点管理（弹窗/路由）
- 打开 Modal：保存当前 \`document.activeElement\`，聚焦 Modal 首个可聚焦元素（\`tabindex="-1"\`）。
- Modal 内**焦点陷阱**：Tab 到最后一个元素时回到第一个。
- 关闭 Modal：焦点还原到触发按钮。

\`\`\`js
function trapFocus(container) {
  const focusable = container.querySelectorAll('button, a, input, [tabindex="0"]')
  const first = focusable[0], last = focusable[focusable.length - 1]
  container.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus()
    }
  })
}
\`\`\`

### 4. 可见焦点
不要 \`outline: none\` 后不给替代，键盘用户需要看到焦点：
\`\`\`css
/* ❌ 危险 */
button { outline: none }

/* ✅ 用 :focus-visible 只给键盘用户显示焦点 */
button:focus { outline: none }
button:focus-visible { outline: 2px solid var(--brand); }
\`\`\`

### 5. 跳过链接（Skip Link）
让键盘用户跳过重复导航：
\`\`\`html
<a href="#main" class="skip-link">跳到主内容</a>
<main id="main" tabindex="-1">...</main>
\`\`\`

## 顺序原则

- Tab 顺序应与**视觉/DOM 顺序一致**，避免正数 tabindex。
- DOM 顺序 = 视觉顺序（CSS 改变顺序时要同步调整 DOM 或用 \`tabindex="0"\` 串联）。
- 隐藏元素（\`display:none\`、\`visibility:hidden\`）自动从 Tab 序列移除，无需额外处理。`
  },
  {
    id: 'html-039',
    category: 'html',
    title: 'fieldset/legend/optgroup 等表单语义化元素有什么用？',
    difficulty: '简单',
    tags: ['fieldset', 'legend', 'optgroup', '表单', '语义化'],
    answer: `## fieldset / legend — 表单分组

\`<fieldset>\` 把相关表单控件分组，\`<legend>\` 作为分组标题。屏幕阅读器朗读每个控件时会带上 legend，提升可访问性。

\`\`\`html
<form>
  <fieldset>
    <legend>个人信息</legend>
    <label>姓名 <input name="name"></label>
    <label>邮箱 <input type="email" name="email"></label>
  </fieldset>

  <fieldset>
    <legend>偏好设置</legend>
    <label><input type="radio" name="theme" value="light"> 浅色</label>
    <label><input type="radio" name="theme" value="dark"> 深色</label>
  </fieldset>
</form>
\`\`\`

- 单选/多选组用 fieldset 包裹，legend 描述这一组，避免每个 radio 重复说明。
- \`<fieldset disabled>\` 可一次性禁用整组控件。

## optgroup — select 选项分组

\`\`\`html
<select>
  <optgroup label="广东省">
    <option>广州</option>
    <option>深圳</option>
  </optgroup>
  <optgroup label="浙江省">
    <option>杭州</option>
    <option>宁波</option>
  </optgroup>
</select>
\`\`\`
\`<optgroup label="...">\` 显示不可选的分组标题，长选项列表更清晰。\`disabled\` 属性可禁用整个分组。

## 其他表单语义元素

### datalist — 输入建议
\`\`\`html
<label>城市 <input list="cities" name="city"></label>
<datalist id="cities">
  <option value="北京">
  <option value="上海">
</datalist>
\`\`\`
输入框可自由输入，下拉显示建议项（比 select 灵活）。

### output — 计算结果
\`\`\`html
<form oninput="result.value = +a.value + +b.value">
  <input type="number" id="a"> +
  <input type="number" id="b">
  = <output name="result" for="a b">0</output>
</form>
\`\`\`
语义化展示计算结果，屏幕阅读器会播报变化。

### progress / meter — 进度与度量
\`\`\`html
<progress value="70" max="100">70%</progress>
<meter value="0.6" min="0" max="1" low="0.3" high="0.7" optimum="0.5">60%</meter>
\`\`\`
- \`progress\`：任务进度（无具体含义阈值）。
- \`meter\`：已知范围的度量（磁盘占用、评分），可设 low/high/optimum 颜色分区。

## 价值

1. **可访问性**：legend/optgroup 给屏幕阅读器提供分组上下文。
2. **语义化**：比 \`<div class="group">\` 更有意义，浏览器/辅助技术识别。
3. **原生交互**：\`disabled\`、\`form\` 关联等行为免费获得。
4. **样式可控**：可自定义 fieldset/legend 样式（注意部分浏览器默认有边框）。`
  },
  {
    id: 'html-040',
    category: 'html',
    title: 'document.write 为什么不推荐使用？',
    difficulty: '中等',
    tags: ['document.write', '性能', '反模式'],
    answer: `## document.write 的问题

\`document.write()\` 向文档流直接写入 HTML。它在文档加载阶段可用，但**加载完成后调用会清空整个文档**，是出了名的反模式。

\`\`\`js
// 加载中：在当前位置插入
document.write('<script src="ad.js"><\\/script>')

// 加载完成后调用：清空页面！
setTimeout(() => document.write('hi'), 1000)  // ❌ 整个 DOM 被替换
\`\`\`

## 主要危害

### 1. 阻塞解析
\`document.write\` 写入的内容会被立即解析，**阻塞 HTML 后续解析**。若写入的是外部脚本（广告、统计常用），会强制浏览器停下等待下载执行，严重拖慢首屏。

### 2. 破坏文档流
页面加载完成后调用，浏览器会自动调用 \`document.open()\`，**清空当前文档**再写入，等于摧毁整个页面。

### 3. 与异步加载冲突
现代浏览器对 \`document.write\` 注入的跨域脚本会**干预**（Intervention）：在慢速网络下直接不执行，导致依赖它的功能失效（Chrome 已对 2G/慢网络这样做）。

### 4. 破坏 SPA
SPA 依赖 History API 局部更新，\`document.write\` 直接重写文档，会摧毁框架挂载的 DOM 与事件，破坏应用状态。

### 5. 难以维护与 CSP 冲突
- 代码注入式，可读性差、易出错。
- CSP 开启 \`default-src\` 时，\`document.write\` 注入的内联脚本可能被拦截。

## 正确替代方案

| 场景 | 替代 |
| --- | --- |
| 动态插入脚本 | \`const s = document.createElement('script'); s.src=...; document.head.appendChild(s)\` |
| 插入 HTML | \`el.insertAdjacentHTML('beforeend', html)\` 或 \`innerHTML\` |
| 插入文本 | \`el.textContent\` |
| 第三方广告 | 让广告 SDK 支持异步加载（多数现代 SDK 已支持） |
| 模板渲染 | 框架的响应式渲染，或 \`<template>\` + clone |

\`\`\`js
// ✅ 异步加载脚本
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}
\`\`\`

## 何时还能用

- **文档加载阶段的同步脚本**（如 polyfill 在 \`<head>\` 中按顺序注入）——但即便如此，也有更优的 \`preload\` / 模块方案。
- **iframe 内的初始化**（隔离环境，不影响主文档）。
- 极少数遗留广告代码。

> 现代开发中，\`document.write\` 几乎没有正当用例，**默认避免**。Lighthouse 也会将其列为性能问题。`
  },
  {
    id: 'html-041',
    category: 'html',
    title: 'Shadow DOM 是什么？open 和 closed 模式有何区别？slot 怎么用？',
    difficulty: '困难',
    tags: ['Shadow DOM', 'slot', 'Web Components', '样式隔离'],
    answer: `## Shadow DOM

Shadow DOM 是 Web Components 的核心，给元素挂载一个**独立的 DOM 子树**，其内部样式与结构对外隔离，外部 CSS 无法穿透，内部样式也不泄漏。

\`\`\`js
class MyCard extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = \`
      <style>
        :host { display: block; border: 1px solid #ccc; padding: 12px; }
        p { color: red; }   /* 只影响内部，不污染外部 */
      </style>
      <p>内部内容</p>
      <slot></slot>
    \`
  }
}
customElements.define('my-card', MyCard)
\`\`\`
\`\`\`html
<my-card>
  <span>这段会被分发到 slot</span>
</my-card>
\`\`\`

## open vs closed

\`attachShadow({ mode: 'open' | 'closed' })\`：

| 模式 | \`element.shadowRoot\` | 外部能否访问内部 |
| --- | --- | --- |
| \`open\` | 返回 ShadowRoot | ✅ 可通过 \`el.shadowRoot.querySelector\` 访问 |
| \`closed\` | 返回 \`null\` | ❌ 外部无法访问内部 DOM |

- **closed 并非安全机制**：只是让外部拿不到引用，仍可被开发者工具查看，不能用来"保护"代码。
- 实践中**绝大多数库用 \`open\`**，方便测试、调试、集成（如 Vue 的 \`mount\` 到 shadowRoot）。closed 反而给自动化测试和辅助技术添麻烦。

## slot — 内容分发

\`<slot>\` 是 Shadow DOM 中的"占位符"，把外部 light DOM 的子节点**分发**到内部指定位置。

### 默认 slot
\`\`\`html
<!-- 组件定义 -->
<template>
  <div class="card"><slot>默认内容</slot></div>
</template>

<!-- 使用 -->
<my-card>用户填的内容</my-card>
\`\`\`

### 具名 slot
\`\`\`html
<!-- 定义 -->
<div class="layout">
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>
  <footer><slot name="footer"></slot></footer>
</div>

<!-- 使用 -->
<my-layout>
  <template #header><h1>标题</h1></template>
  <p>主内容</p>
  <template #footer><span>页脚</span></template>
</my-layout>
\`\`\`

> 注意：上面 \`#header\` 是 Vue 语法。原生 Web Components 用 \`slot="header"\` 属性：
> \`\`\`html
> <my-layout>
>   <h1 slot="header">标题</h1>
>   <p>主内容</p>
> </my-layout>
> \`\`\`

### slot 事件
- \`slotchange\`：分发内容变化时触发，可据此初始化子节点。

## 样式边界

- 外部样式**默认无法**影响 Shadow DOM 内部（除 [继承属性](https://developer.mozilla.org) 如 color/font）。
- 内部用 \`:host\` 选宿主元素，\`::slotted(...)\` 选被分发的 light DOM 节点。
- **CSS 变量可穿透**：外部定义 \`--brand\`，内部使用 \`var(--brand)\`，是定制组件主题的主要手段。
- \`::part(name)\`：内部用 \`part="x"\` 标记，外部用 \`::part(x)\` 样式化，提供受控的样式入口。

\`\`\`css
/* 外部 */
my-card::part(title) { color: blue; }
my-card { --card-border: red; }
\`\`\`
\`\`\`js
// 内部
shadow.innerHTML = '<h1 part="title">...</h1><div style="border:1px solid var(--card-border)">'
\`\`\`

## 限制

- **focus 限制**：Tab 进入 Shadow DOM 后内部自行管理焦点序列。
- **事件重定向**：内部事件冒泡到外部时，\`event.target\` 会被重定向为宿主元素（closed 下更彻底）。
- **表单集成**：需 \`attachInternals()\` 才能让内部 input 参与 \`<form>\`。
- **SEO**：爬虫对 Shadow DOM 内容索引有限，关键内容别只放 Shadow DOM。`
  },
  {
    id: 'html-042',
    category: 'html',
    title: '浏览器是如何解析 HTML 并构建 DOM 树的？',
    difficulty: '困难',
    tags: ['HTML 解析', 'DOM', '渲染流水线'],
    answer: `## HTML 解析流程

浏览器从网络拿到 HTML 字节流后，经过以下步骤构建 DOM：

\`\`\`
字节 → 字符 → Token（标签/文本） → Node → DOM 树
Bytes → Characters → Tokens → Nodes → DOM
\`\`\`

### 1. 字节 → 字符（解码）
根据响应头 \`Content-Type: text/html; charset=UTF-8\` 或 \`<meta charset>\` 决定编码，把字节流转为字符串。

### 2. 字符 → Token（分词）
**分词器（Tokenizer）** 状态机逐字符扫描，识别出开始标签、结束标签、属性、注释、文本等 Token：
\`\`\`
<div class="a">hi</div>
→ StartTag(div, class=a) → Characters(hi) → EndTag(div)
\`\`\`
HTML5 规范定义了容错的分词算法（如自动补 \`<html><head><body>\`、修复未闭合标签），所以"错误"的 HTML 也能渲染。

### 3. Token → Node → DOM 树（树构建）
**树构建器**根据 Token 创建 Node，按嵌套关系组装：
- 遇到 StartTag 创建元素节点，压栈；
- 遇到 EndTag 弹栈；
- 文本节点作为当前栈顶元素子节点。

最终得到一棵以 \`document\` 为根的树。

## 关键：解析可被阻塞

### 阻塞 HTML 解析的情况
1. **\`<script>\`（无 defer/async）**：解析暂停 → 下载 → 执行 → 再继续。因为脚本可能 \`document.write\` 修改后续 DOM。放在 \`</body>\` 前。
2. **\`<link rel="stylesheet">\`**：不阻塞 HTML 解析，但**阻塞脚本执行**（JS 可能读取样式），间接阻塞渲染。
3. **\`<script defer>\`**：下载不阻塞解析，按顺序在 \`DOMContentLoaded\` 前执行。
4. **\`<script async>\`**：下载不阻塞解析，下载完立即执行（可能中断解析），执行顺序不定。

## 预解析（Preload Scanner）

主解析器被脚本阻塞时，浏览器另起一个**预扫描器**快速扫剩余 HTML，提前发现 CSS/JS/图片等资源并发起下载，不浪费时间。这是 \`<script>\` 放头部仍能用 preload 的原因。

## DOM 构建完成

- **\`DOMContentLoaded\`（DCL）**：DOM 构建完成触发，不等图片等子资源，defer 脚本已执行。
- **\`load\`**：所有资源（图片、样式、iframe）加载完触发。
- **\`readystatechange\`**：\`loading\` → \`interactive\`（≈DCL）→ \`complete\`（≈load）。

## 优化要点

1. **CSS 放 \`<head>\`**：尽早下载，避免渲染阻塞与 FOUC（无样式闪烁）。
2. **JS 放 \`</body>\` 前或用 defer/async**：减少对解析的阻塞。
3. **关键 JS 用 defer**：保持执行顺序且不阻塞解析。
4. **避免 \`document.write\`**：它会重置解析器，破坏预加载优化。
5. **减少嵌套层级与无用节点**：DOM 越大，解析、样式计算、布局越慢。
6. **预连接/预加载关键资源**：\`preconnect\`/\`preload\` 让网络与解析并行。`
  },
  {
    id: 'html-043',
    category: 'html',
    title: 'MutationObserver 是什么？如何监听 DOM 变化？',
    difficulty: '中等',
    tags: ['MutationObserver', 'DOM', '监听'],
    answer: `## MutationObserver

异步监听 DOM 变化的 API，相比已废弃的 \`Mutation Events\`（\`DOMNodeInserted\` 等，同步触发、性能差），它**批量异步**回调，性能友好。

\`\`\`js
const observer = new MutationObserver((mutations, obs) => {
  for (const m of mutations) {
    if (m.type === 'childList') {
      console.log('新增节点:', m.addedNodes, '移除节点:', m.removedNodes)
    } else if (m.type === 'attributes') {
      console.log('属性变化:', m.attributeName, '旧值:', m.oldValue)
    }
  }
})

observer.observe(target, {
  childList: true,        // 子节点增删
  attributes: true,       // 属性变化
  subtree: true,          // 监听后代（默认只监听直接子节点）
  characterData: true,    // 文本内容变化
  attributeOldValue: true, // 记录属性旧值
  characterDataOldValue: true,
  attributeFilter: ['class', 'style']  // 只监听指定属性
})

// 停止
observer.disconnect()
// 立即触发剩余回调
observer.takeRecords()
\`\`\`

## 配置项说明

| 选项 | 作用 |
| --- | --- |
| \`childList\` | 子节点增删 |
| \`attributes\` | 属性变化 |
| \`characterData\` | 文本节点内容变化 |
| \`subtree\` | 扩展到所有后代 |
| \`attributeOldValue\` / \`characterDataOldValue\` | 回调中提供旧值 |
| \`attributeFilter\` | 只关注指定属性（性能优化） |

## MutationRecord

每条变更记录含：
- \`type\`：\`childList\` / \`attributes\` / \`characterData\`
- \`target\`：受影响节点
- \`addedNodes\` / \`removedNodes\`：\`NodeList\`
- \`previousSibling\` / \`nextSibling\`：变更前后兄弟
- \`attributeName\` / \`oldValue\`：属性场景

## 异步批处理

变更不会立即回调，而是在当前微任务结束后、下次渲染前**批量**触发。一次多次 DOM 操作合并为一组 records，避免频繁回调。这也是它比 Mutation Events 性能好的关键。

## 典型应用

### 1. 第三方组件库 / 埋点
监听 DOM 变化，自动初始化新插入的组件（如 \`data-toggle\` 自动绑定）。

### 2. 虚拟列表 / 懒加载
监听容器子节点变化，触发可见性计算。

### 3. 反爬 / 内容保护
检测节点被删除/修改，恢复内容（作用有限，可被绕过）。

### 4. 富文本编辑器
监听编辑区变化，同步到数据模型。

### 5. 自动注入样式（Shadow DOM 外观增强）
监听第三方组件插入，注入自定义 CSS。

## 注意

1. **避免在回调里同步修改 DOM**：可能引发循环触发（改 DOM → 触发回调 → 再改），应做条件判断或异步处理。
2. **\`subtree: true\` 性能成本高**：大范围监听要谨慎，配合 \`attributeFilter\` 收窄。
3. **不能监听 style 属性的子属性变化**：\`style.color\` 改变会触发 \`attributes\`（\`style\` 整体），但拿不到具体改了哪个 CSS 属性。
4. ** disconnect 后无法恢复**，需重新 \`observe\`。
5. **\`takeRecords()\`** 取出已累积但未回调的记录，常在 disconnect 前调用确保不丢事件。`
  },
  {
    id: 'html-044',
    category: 'html',
    title: 'DOMContentLoaded、load、readystatechange 有什么区别？',
    difficulty: '中等',
    tags: ['DOMContentLoaded', 'load', '事件', '生命周期'],
    answer: `## 三个关键事件

| 事件 | 触发时机 | 等待资源 |
| --- | --- | --- |
| \`DOMContentLoaded\` (DCL) | HTML 解析完、DOM 树构建完成 | 不等图片/iframe 等子资源 |
| \`load\` (\`window.onload\`) | 所有资源（图片/CSS/iframe）加载完成 | 等全部资源 |
| \`readystatechange\` | \`document.readyState\` 变化 | 多次触发 |

## readyState 状态

\`\`\`js
document.readyState
// 'loading'   → 仍在解析
// 'interactive' → DOM 解析完成（≈ DOMContentLoaded 前）
// 'complete'    → 所有资源加载完（≈ load 前）
\`\`\`

\`\`\`js
document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') { /* DOM 就绪 */ }
  if (document.readyState === 'complete') { /* 全部加载完 */ }
})
\`\`\`

## 时序

\`\`\`
HTML 解析中 (loading)
  ↓ defer 脚本按顺序执行
  ↓ DOM 构建完成 → readyState=interactive → DOMContentLoaded
  ↓ 图片/CSS/iframe 继续加载
  ↓ 全部完成 → readyState=complete → window.load
\`\`\`

\`\`\`js
document.addEventListener('DOMContentLoaded', () => {
  console.log('1. DOM 就绪，可操作节点')
})
window.addEventListener('load', () => {
  console.log('2. 所有资源加载完')
})
\`\`\`

## 区别要点

### 1. DOMContentLoaded vs load
- **DCL**：DOM 可用即可，不等图片。**业务初始化（绑定事件、渲染列表）放这里**。
- **load**：图片等也加载完。**需要元素尺寸（如初始化轮播、Canvas 绘图依赖图片）放这里**。
- DCL 远早于 load（图片多时差距可达数秒），优先用 DCL 提速交互可用时间。

### 2. defer 脚本与 DCL
\`defer\` 脚本在 DOM 解析完后、DCL **之前**按顺序执行。所以 defer 脚本里能安全访问 DOM，且早于 DCL 监听器。现代框架入口多用 defer。

### 3. async 脚本
\`async\` 脚本下载完立即执行，可能在 DCL 前或后，顺序不定，不保证 DOM 就绪。

## 实践建议

1. **业务代码用 DCL 或 defer**：脚本放 \`<head>\` + \`defer\`，比放 body 末尾更好（能更早下载）。
2. **不要用 load 做常规初始化**：会让交互可用时间延后到图片加载完。
3. **判断脚本加载完否**：动态脚本用 \`onload\`；模块用 \`import().then\`。
4. **已就绪后再监听 DCL 不会触发**：若 \`readyState\` 已是 interactive/complete，需手动执行：
   \`\`\`js
   if (document.readyState !== 'loading') {
     init()
   } else {
     document.addEventListener('DOMContentLoaded', init)
   }
   \`\`\`
5. **\`unload\`/\`beforeunload\`** 是页面卸载事件，与加载无关；现代浏览器对它们降权（移动端常不触发），埋点改用 \`pagehide\` + \`sendBeacon\`。`
  },
  {
    id: 'html-045',
    category: 'html',
    title: 'Web Components 详解：Custom Elements 与 Shadow DOM 的原理与实践？',
    difficulty: '困难',
    tags: ['Web Components', 'Custom Elements', 'Shadow DOM', '组件化'],
    answer: `## Web Components 是什么

Web Components 是浏览器**原生支持的组件化规范**，无需框架即可封装可复用的 UI 组件，由三大技术组成：

1. **Custom Elements**：自定义 HTML 标签。
2. **Shadow DOM**：封装组件内部 DOM 与样式，隔离外部影响。
3. **HTML Templates**：用 \`<template>\` / \`<slot>\` 声明可复用模板。

---

## 一、Custom Elements（自定义元素）

### 两种类型

1. **Autonomous Custom Elements**（独立自定义元素）：继承 \`HTMLElement\`，完全自定义标签。
2. **Customized Built-in Elements**（扩展内置元素）：继承 \`HTMLButtonElement\` 等，扩展原生标签行为（Safari 不支持）。

### 基本用法

\`\`\`js
class MyButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  // 元素被挂载到 DOM
  connectedCallback() {
    this.shadowRoot.innerHTML = \`
      <style>button { background: #42b883; color: #fff; padding: 8px 16px; border: none; border-radius: 4px; }</style>
      <button><slot></slot></button>
    \`
  }

  // 元素被移除
  disconnectedCallback() { /* 清理订阅 */ }

  // 元素被移动到新 document
  adoptedCallback() {}

  // 监听的属性变化
  static get observedAttributes() { return ['type'] }
  attributeChangedCallback(name, oldVal, newVal) {
    console.log(\`\${name}: \${oldVal} -> \${newVal}\`)
  }
}

customElements.define('my-button', MyButton)
\`\`\`

\`\`\`html
<my-button type="primary">提交</my-button>
\`\`\`

### 生命周期

| 钩子 | 触发时机 |
| --- | --- |
| \`constructor\` | 元素实例创建时（还未挂载，不能访问属性/子元素） |
| \`connectedCallback\` | 首次挂载到 DOM（可安全操作 DOM、绑定事件） |
| \`disconnectedCallback\` | 从 DOM 移除（清理定时器、订阅） |
| \`adoptedCallback\` | \`document.adoptNode()\` 移入另一个文档 |
| \`attributeChangedCallback\` | \`observedAttributes\` 列表中的属性变化 |

### 命名规则

- 必须包含**连字符** \`-\`（避免与原生标签冲突）：\`<my-card>\` ✅ / \`<card>\` ❌。
- 不能重复注册，重复定义抛 \`NotSupportedError\`。
- 用 \`customElements.whenDefined('my-button').then(() => {})\` 等待元素注册完成。

---

## 二、Shadow DOM（影子 DOM）

Shadow DOM 将组件的内部 DOM 树与外部文档**隔离**，实现样式和 DOM 的封装，解决：

1. **样式冲突**：外部 CSS 不影响 Shadow 内部，内部样式也不泄漏。
2. **DOM 封装**：\`document.querySelector\` 无法直接选中 Shadow 内元素。
3. **ID 不冲突**：内部 ID 可重复。

### 模式（mode）

\`\`\`js
const shadow = el.attachShadow({ mode: 'open' })
// open:  外部可通过 el.shadowRoot 访问（推荐用于可交互组件）
// closed: 外部无法访问，只能在组件内部操作（极少见场景）
\`\`\`

### 样式隔离

\`\`\`html
<my-card></my-card>

<script>
class MyCard extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = \`
      <style>
        :host { display: block; border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
        :host([theme="dark"]) { background: #333; color: #fff; }
        ::slotted(h2) { margin-top: 0; } /* 选中 slot 分发的 h2 */
        .title { color: #42b883; }
      </style>
      <h2 class="title"><slot name="title">默认标题</slot></h2>
      <slot></slot>
    \`
  }
}
customElements.define('my-card', MyCard)
</script>

<!-- 使用 -->
<style>
  .title { color: red; } /* ❌ 不生效，被 Shadow 隔离 */
</style>
<my-card theme="dark">
  <span slot="title">自定义标题</span>
  <p>正文内容</p>
</my-card>
\`\`\`

### 关键 CSS 伪类/伪元素

| 选择器 | 作用 |
| --- | --- |
| \`:host\` | 选中 Shadow 的宿主元素（即自定义元素本身） |
| \`:host(selector)\` | 宿主元素匹配 selector 时生效 |
| \`:host-context(selector)\` | 宿主祖先匹配 selector 时生效（如暗黑模式） |
| \`::slotted(selector)\` | 选中通过 slot 分发进来的外部元素 |

### 事件穿透

- Shadow 内触发的**冒泡事件**会"重定向 target"：外部监听器中 \`e.target\` 指向**宿主元素**而非内部子元素，避免内部结构泄漏。
- 非冒泡事件（如 \`focus\`）不会逃逸出 Shadow。
- 可用 \`composed: true\` 的自定义事件强制穿透：
  \`\`\`js
  this.dispatchEvent(new CustomEvent('change', { detail: data, bubbles: true, composed: true }))
  \`\`\`

---

## 三、Template 与 Slot

\`<template>\` 内容不会被渲染，实例化时克隆节点：

\`\`\`html
<template id="tpl">
  <style>...</style>
  <div class="card">
    <slot name="header"></slot>
    <slot></slot>
  </div>
</template>

<script>
class XCard extends HTMLElement {
  constructor() {
    super()
    const tpl = document.getElementById('tpl').content.cloneNode(true)
    this.attachShadow({ mode: 'open' }).appendChild(tpl)
  }
}
</script>
\`\`\`

Slot 与 Web Components 的 slot 语义同 Vue/React，支持**具名插槽**与**默认插槽**。

---

## 四、与框架对比

| 特性 | Web Components | React / Vue |
| --- | --- | --- |
| 原生支持 | ✅ 浏览器原生，零依赖 | ❌ 需要运行时 |
| 样式隔离 | ✅ Shadow DOM 原生隔离 | CSS-in-JS / Scoped CSS |
| 生态/工具链 | 弱 | 强（DevTools、测试、路由） |
| 状态管理 | 手动实现（属性 + 事件） | 响应式 / Hooks |
| SSR 支持 | 较麻烦（Declarative Shadow DOM） | 成熟 |
| 跨框架复用 | ✅ 在任意框架中都能用 | ❌ 只在自家生态 |

### 最佳适用场景

- **设计系统 / UI 组件库**：一套组件在 React、Vue、Angular、原生项目中通用。
- **微前端**：子应用独立发布组件，宿主框架无关。
- **浏览器扩展**：Shadow DOM 隔离宿主页面样式污染。
- **第三方嵌入组件**（如评论、聊天、播放器）：样式不受宿主影响。

---

## 五、Declarative Shadow DOM（DSD，SSR 方案）

传统 Shadow DOM 只能在客户端 JS 里创建，SSR 会出现闪烁。DSD 允许直接在服务端 HTML 中声明 Shadow：

\`\`\`html
<my-card>
  <template shadowrootmode="open">
    <style>...</style>
    <slot></slot>
  </template>
  <p>我是内容</p>
</my-card>
\`\`\`

浏览器解析到 \`<template shadowrootmode>\` 会**自动 attachShadow**，无需 JS。Chrome 90+、Firefox 123+ 已支持。

---

## 六、注意事项与坑

1. **属性 vs 数据**：Custom Elements 只能通过**字符串属性**传值，复杂数据（对象/数组）建议用 \`.property = obj\` 或 postMessage 式事件通信。
2. **\`<img>\` / \`<link>\` 等外部资源路径**在 Shadow DOM 中是**相对于宿主文档 URL** 而非组件路径，资源需用绝对路径或 CSS \`url()\` 处理。
3. **表单关联**：自定义表单控件需用 \`ElementInternals\` API 才能参与原生表单校验、\`formdata\` 事件、标签关联。
4. **兼容性**：主流现代浏览器已全面支持（Chrome 67+、Safari 10.1+、Firefox 63+），旧项目可加 polyfill（@webcomponents/webcomponentsjs）。
5. **不要 over-engineer**：业务级组件仍推荐框架（React/Vue）开发效率高；跨生态复用才选 Web Components。`
  },
  {
    id: 'html-046',
    category: 'html',
    title: 'HTML 表单新特性有哪些？（formdata 事件、requestSubmit、ElementInternals、Popover 等）',
    difficulty: '中等',
    tags: ['表单新特性', 'formdata', 'requestSubmit', 'ElementInternals', 'Popover'],
    answer: `## 近年 HTML 表单/交互相关的原生新特性大盘点

现代浏览器持续强化 HTML 原生能力，很多过去需要库的功能现在可以直接用。

---

## 1. formdata 事件（拦截表单数据）

\`<form>\` 在构造 FormData 准备提交时会触发 \`formdata\` 事件，可以**修改/追加字段**，无需再拦截 submit 手动 new FormData。

\`\`\`html
<form id="f">
  <input name="name" value="Tom">
  <button>提交</button>
</form>

<script>
const form = document.getElementById('f')
form.addEventListener('formdata', (e) => {
  const fd = e.formData
  fd.append('csrf', getToken())   // 追加隐藏字段
  fd.set('name', fd.get('name').trim())  // 修改已有字段
})
</script>
\`\`\`

触发时机：\`form.submit()\`、\`form.requestSubmit()\`、点击 \`<button type="submit">\` **之前**。

---

## 2. form.requestSubmit() vs form.submit()

| 方法 | 触发 submit 事件 | 触发表单校验 | 要求 submit 按钮可交互 |
| --- | --- | --- | --- |
| \`.submit()\` | ❌ 不触发 | ❌ 不校验 | — |
| \`.requestSubmit(submitter?)\` | ✅ 触发 | ✅ 正常校验 | ✅ 若 submitter 被禁用会失败 |

\`requestSubmit(submitter)\` 允许指定**以哪个按钮的名义提交**（按钮的 \`formaction\` / \`formmethod\` 等覆盖生效）：

\`\`\`js
const btn = form.querySelector('button[formaction="/draft"]')
form.requestSubmit(btn)  // 走 /draft 而不是 form.action
\`\`\`

> 过去用 \`form.submit()\` 会跳过验证与事件，是 XSS/绕过校验的常见入口；新代码统一用 \`requestSubmit()\`。

---

## 3. ElementInternals（自定义表单元素）

让自定义元素（Custom Elements）成为**合格的表单控件**，参与原生表单校验、提交、标签关联，不再只能 div+input 模拟。

\`\`\`js
class MySwitch extends HTMLElement {
  static formAssociated = true  // ✅ 声明为"表单关联自定义元素"
  #internals

  constructor() {
    super()
    this.#internals = this.attachInternals()  // 获取 ElementInternals
    this._value = 'off'
  }

  connectedCallback() {
    this.innerHTML = \`<button type="button" role="switch" aria-checked="false">OFF</button>\`
    this.querySelector('button').onclick = () => this.toggle()
  }

  toggle() {
    this._value = this._value === 'on' ? 'off' : 'on'
    this.#internals.setFormValue(this._value)  // 写入表单值
    const on = this._value === 'on'
    this.querySelector('button').setAttribute('aria-checked', on)
    this.querySelector('button').textContent = on ? 'ON' : 'OFF'
    this.#internals.setValidity({})  // 校验状态，可传 ValidityState
    this.#internals.reportValidity()
  }

  // 表单重置时调用
  formResetCallback() { this._value = 'off'; /* 重置 UI */ }

  // 所在 <form> 的 id/form 属性变化时
  formAssociatedCallback(form) {}
  formDisabledCallback(disabled) {}
  formStateRestoreCallback(state, reason) {}
}
customElements.define('my-switch', MySwitch)
\`\`\`

使用方式与原生 input 完全一致：

\`\`\`html
<form>
  <label for="sw">启用</label>
  <my-switch id="sw" name="enabled"></my-switch>
  <button>提交</button>
</form>
\`\`\`

提交时表单里会带 \`enabled=on/off\`，且支持 \`form.elements.namedItem('enabled')\` 访问。

---

## 4. Popover API（原生弹出层）

实验但已在 Chrome 114+ / Safari 17+ 落地，**零 JS 做 tooltip、菜单、弹窗**（非模态）：

\`\`\`html
<button popovertarget="menu">菜单</button>
<div id="menu" popover>
  <ul>
    <li>新建</li>
    <li>打开</li>
    <li><button popovertarget="menu" popovertargetaction="hide">关闭</button></li>
  </ul>
</div>
\`\`\`

### 属性/行为

- \`popover="auto"\`（默认）：点击外部 / Esc 自动关闭；一次只开一个。
- \`popover="manual"\`：需手动关闭，不抢焦点。
- \`popovertargetaction="show | hide | toggle"\`：按钮触发动作。
- 支持 \`:popover-open\` CSS 伪类自定义样式。
- JS 控制：\`el.showPopover()\` / \`el.hidePopover()\` / \`el.togglePopover()\`。
- 事件：\`beforetoggle\`、\`toggle\`。

与 \`<dialog>\` 的区别：
| | Popover | Dialog |
| --- | --- | --- |
| 类型 | 非模态浮动层（Tooltip / Menu） | 模态/非模态对话框 |
| 焦点陷阱 | ❌ 不抢焦点 | ✅ \`showModal()\` 有焦点陷阱 |
| 遮罩 | ❌ 无 ::backdrop | ✅ 有 ::backdrop |
| 顶层渲染 | ✅ top layer | ✅ top layer |

---

## 5. Invokers（调用者协议）

更通用的"按钮→目标"调用协议（Chrome 129+），取代零散的 \`popovertarget\` / \`showModal()\`：

\`\`\`html
<button invoketarget="dlg" invokeaction="showModal">打开对话框</button>
<dialog id="dlg">内容</dialog>
\`\`\`

支持的 invokeaction：\`showPopover\` / \`hidePopover\` / \`togglePopover\` / \`showModal\` / \`close\`。

JS 监听 \`invoke\` 事件自定义行为：

\`\`\`js
el.addEventListener('invoke', (e) => {
  if (e.action === 'custom-action') doSomething()
})
\`\`\`

---

## 6. 输入类型增强

### inputmode（只影响移动端键盘，不校验）

比 \`type="number"\` 更灵活——想保留文本框但弹数字键盘：

\`\`\`html
<input inputmode="numeric">       <!-- 数字键盘 -->
<input inputmode="decimal">       <!-- 数字+小数点 -->
<input inputmode="tel">           <!-- 电话键盘 -->
<input inputmode="email">         <!-- 邮箱键盘 -->
<input inputmode="url">           <!-- 带斜杠的键盘 -->
<input inputmode="search">        <!-- 带搜索键 -->
\`\`\`

### Enterkeyhint（软键盘"回车"按钮文案）

\`\`\`html
<input enterkeyhint="search">     <!-- iOS 右下显示"搜索" -->
<input enterkeyhint="send">       <!-- "发送" -->
<input enterkeyhint="next">       <!-- "下一项" -->
<input enterkeyhint="done">       <!-- "完成" -->
\`\`\`

---

## 7. 校验新能力

### reportValidity() / checkValidity()

不仅 input，整个 form 也能手动触发校验：

\`\`\`js
form.reportValidity()  // 校验并显示浏览器原生气泡提示
form.checkValidity()   // 只返回布尔，不显示 UI
\`\`\`

### :user-invalid 伪类（用户交互后才报错的样式）

过去 \`:invalid\` 页面一加载就显示红框，体验差。\`:user-invalid\` 只在**用户已修改过且校验未通过**时生效：

\`\`\`css
input:user-invalid { border-color: red; }
\`\`\`

配套 \`:user-valid\`、\`:valid\`、\`:invalid\`、\`:required\`、\`:optional\`，组合可覆盖大部分表单样式需求。

---

## 8. <selectmenu> / <combobox>（完全可定制的下拉）

原生 \`<select>\` 样式定制受限，\`<selectmenu>\`（Chrome 126+ 实验）允许替换按钮、下拉列表、选项的每一部位：

\`\`\`html
<selectmenu>
  <button slot="button" behavior="button">
    <selectedoption></selectedoption>
    <span>▼</span>
  </button>
  <listbox slot="listbox" class="my-listbox">
    <option>北京</option>
    <option>上海</option>
    <option>广州</option>
  </listbox>
</selectmenu>
\`\`\`

---

## 9. Inert 属性（整棵子树不可交互）

标记某个 DOM 子树为"惰性"：内容不可点击、不可聚焦、不可被辅助技术访问，常用于打开弹窗时冻结背景页面：

\`\`\`js
document.getElementById('app').inert = true  // 背景全冻结
dialog.showModal()
\`\`\`

比手动遍历 aria-hidden + pointer-events 更彻底（也会禁用 Tab 键聚焦子元素）。

---

## 10. View Transitions API（页面/路由过渡动画）

原生提供"截图 → 做动画 → 切新内容"的页面切换过渡，甚至跨文档：

\`\`\`js
// SPA 切换路由
document.startViewTransition(() => {
  renderNewRoute()
})
\`\`\`

\`\`\`css
::view-transition-old(root) { animation: fade-out .3s; }
::view-transition-new(root) { animation: fade-in .3s; }
\`\`\`

---

## 小结

原生 HTML 在"少 JS 甚至零 JS 实现交互"上进步飞快：

| 场景 | 建议替代方案 | 旧方案 |
| --- | --- | --- |
| 下拉菜单 / Tooltip | Popover API | JS + z-index |
| 对话框 | \<dialog> + showModal | 模态组件库 |
| 自定义表单控件 | ElementInternals | 模拟 + 手动同步 |
| 拦截表单数据 | formdata 事件 | submit + new FormData |
| 冻结背景交互 | inert 属性 | aria-hidden + 样式 |
| 移动端键盘 | inputmode / enterkeyhint | type="number" 各种坑 |

用原生的好处：**无障碍默认友好、代码少、体积小、性能好、不被升级破坏**。`
  },
  {
    id: 'html-047',
    category: 'html',
    title: 'Web 安全：CSP（内容安全策略）与 SRI（子资源完整性）如何配置？',
    difficulty: '困难',
    tags: ['安全', 'CSP', 'SRI', 'XSS'],
    answer: `## 为什么需要 CSP 与 SRI

XSS（跨站脚本）是 OWASP Top 10 常客，传统防御是输入转义 + HttpOnly Cookie，但仍难防：

- 内联脚本被注入（\`<script>steal()</script>\`）。
- 第三方 CDN 被劫持，加载恶意脚本。
- 打包产物被篡改。

**CSP（Content Security Policy）** 是浏览器层面的白名单机制，限制页面能加载哪些来源的脚本、样式、图片、接口等；**SRI（Subresource Integrity）** 则保证第三方资源内容与预期哈希一致，防 CDN 被篡改。两者常配合使用。

---

## 一、CSP（内容安全策略）

### 启用方式二选一

#### 方式 1：HTTP 响应头（推荐，更安全）

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
\`\`\`

#### 方式 2：HTML meta 标签

\`\`\`html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
\`\`\`

> ⚠️ meta 方式**不支持**：\`frame-ancestors\`、\`report-uri\`、\`sandbox\` 指令；也**不能覆盖**已在响应头设置的更严格规则。

### 报告模式（仅监控不拦截）

先用 \`Content-Security-Policy-Report-Only\` 观察日志，全绿后再切正式：

\`\`\`
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
\`\`\`

所有违约会 POST JSON 到 \`/csp-report\`，开发者借此迭代白名单。

---

### 核心指令（常用）

CSP 指令按资源类型划分，一条策略里可以写多个指令，分号分隔。

| 指令 | 作用 |
| --- | --- |
| \`default-src\` | 未显式指定指令的**默认兜底**（脚本/样式/图片/字体等） |
| \`script-src\` | 脚本来源 |
| \`style-src\` | 样式来源 |
| \`img-src\` | 图片来源 |
| \`font-src\` | 字体来源 |
| \`connect-src\` | fetch / XHR / WebSocket / SSE 接口来源 |
| \`media-src\` | video / audio 来源 |
| \`frame-src\` / \`child-src\` | iframe 来源 |
| \`worker-src\` | Web Worker / Service Worker |
| \`object-src\` | \<object> / \<embed> / \<applet>（Flash 等），一般设为 \`'none'\` |
| \`base-uri\` | 限制 \<base> 能指向的 URL |
| \`form-action\` | 限制 \<form> 能提交到的 URL |
| \`frame-ancestors\` | 限制哪些页面可把本站点嵌入 iframe（替代 X-Frame-Options） |
| \`manifest-src\` | PWA manifest 来源 |
| \`report-uri\` / \`report-to\` | 上报违规地址 |

### 源值（来源格式）

| 值 | 含义 |
| --- | --- |
| \`'self'\` | 同源（同协议/域名/端口） |
| \`'none'\` | 完全禁止该类型资源 |
| \`'unsafe-inline'\` | 允许内联脚本/样式（**不建议**，削弱 XSS 防护） |
| \`'unsafe-eval'\` | 允许 \`eval()\` / \`new Function\`（**强烈不建议**） |
| \`https://cdn.example.com\` | 允许该具体来源 |
| \`https://*.example.com\` | 允许任意子域（通配） |
| \`'nonce-xxxxxx'\` | 只允许携带对应 nonce 的内联脚本（更安全替代 unsafe-inline） |
| \`'sha256-xxxxxx'\` | 只允许内容哈希匹配的内联脚本 |
| \`data:\` | 允许 data: URL（内联 base64 图/字体） |
| \`blob:\` | 允许 Blob URL |

---

### 最佳实践策略示例

\`\`\`
Content-Security-Policy:
  default-src 'self';
  script-src  'self' 'nonce-a8F3k2D' https://cdn.jsdelivr.net;
  style-src   'self' 'unsafe-inline' https://cdn.jsdelivr.net;   # CSS 库常用注入样式
  img-src     'self' data: https: blob:;                          # https: = 任意 HTTPS 图
  font-src    'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  object-src  'none';                                             # 禁 Flash 等
  base-uri    'self';
  form-action 'self';
  frame-ancestors 'none';                                         # 禁止被嵌入 iframe，相当于 DENY
  upgrade-insecure-requests;                                      # 自动把 http 升级成 https
  report-uri    /csp-report;
\`\`\`

#### nonce 机制（替代 unsafe-inline）

当业务**必须**有内联脚本（如 SSR 注入初始数据），不要用 \`'unsafe-inline'\`，改用 **nonce**：

服务端每次请求生成**随机、一次性、不可预测**的 nonce 字符串：

1. 塞进 CSP 响应头：\`script-src 'nonce-Xc2k9'\`
2. 内联脚本加属性：\`<script nonce="Xc2k9">window.__DATA = {...}</script>\`

哈希匹配同理（\`'sha256-...'\`），用于内联内容固定不变的场景。

---

### 常见踩坑

1. **第三方分析/广告脚本**：Google Analytics、Sentry、热图等通常来自多域名，需仔细加白名单（建议看它们的 CSP 文档）。
2. **打包工具 sourceMap**：inline-source-map 会把 map 塞进 data URL，正式环境禁用或加 \`'self'\` 允许。
3. **SPA 外链跳转**：\`window.open('https://...')\` 不受 CSP 影响（那是跨文档跳转），但 fetch/XHR/iframe 受影响。
4. **script 里动态创建 script**：动态脚本的 src 仍需在白名单里，且非同源不允许用 \`document.write('<script>...')\`。
5. **\`'strict-dynamic'\`**：允许已被信任的脚本（nonce/hash 验证通过的）动态加载其他脚本，避免列出庞大的子依赖白名单。

\`\`\`
script-src 'nonce-abc' 'strict-dynamic';
\`\`\`

---

## 二、SRI（Subresource Integrity，子资源完整性）

用于**校验第三方 CDN 资源内容是否被篡改**，浏览器在下载脚本/样式后先做哈希比对，不一致就拒绝执行。

### 基本用法

\`\`\`html
<link
  rel="stylesheet"
  href="https://cdn.example.com/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
  crossorigin="anonymous">

<script
  src="https://cdn.example.com/vue@3.4.27/dist/vue.global.prod.js"
  integrity="sha256-jE8w+L7i7A4a4jT1oAeQpK4P45yG271mJ9n6RqKvKzY="
  crossorigin="anonymous"></script>
\`\`\`

### integrity 值的格式

\`\`\`
sha256-<base64编码的哈希值>
sha384-<base64编码的哈希值>
sha512-<base64编码的哈希值>
\`\`\`

推荐用 **SHA-384**（安全性/长度平衡），同时可以写多个用空格分隔以提供降级。

### 生成 SRI 哈希

#### 1. 命令行（openssl）

\`\`\`bash
cat vue.global.prod.js | openssl dgst -sha384 -binary | openssl base64 -A
\`\`\`

#### 2. 在线工具

<https://www.srihash.org/> 直接输入资源 URL，生成带 integrity 的标签。

#### 3. 打包插件

- **Webpack / Vite**：\`webpack-subresource-integrity\` 自动为产物生成 SRI。
- **Rollup**：\`rollup-plugin-sri\`。

---

### 为什么必须有 crossorigin 属性？

SRI 需要读取资源的原始字节做哈希，但跨域脚本默认浏览器不暴露内容给 JS，因此需要：

\`\`\`html
<script src="跨域URL" integrity="..." crossorigin="anonymous"></script>
\`\`\`

- \`crossorigin="anonymous"\`：不带 Cookie/凭证发起 CORS 请求。
- \`crossorigin="use-credentials"\`：带凭证（需要资源服务器 \`Access-Control-Allow-Credentials: true\`）。

> 若缺少 \`crossorigin\`，即使写了 integrity，SRI 校验也会**直接跳过**不生效！

### 降级与兜底（fallback）

CDN 挂了或 SRI 校验失败怎么办？可以用 onerror 切自建源：

\`\`\`html
<script
  src="https://cdn.example.com/vue@3.4.27/dist/vue.global.prod.js"
  integrity="sha384-..."
  crossorigin="anonymous"
  onerror="this.onerror=null;this.src='/lib/vue.global.prod.js'"></script>
\`\`\`

---

## 三、CSP + SRI 配合方案（生产推荐）

\`\`\`
# 响应头
Content-Security-Policy:
  default-src 'self';
  script-src  'self' 'nonce-{RANDOM_NONCE}' https://cdn.example.com 'strict-dynamic';
  style-src   'self' https://cdn.example.com 'unsafe-inline';
  img-src     'self' data: https:;
  connect-src 'self' https://api.example.com;
  object-src  'none';
  base-uri    'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
  report-uri /csp-report;
\`\`\`

HTML 里引用 CDN 资源：

\`\`\`html
<script nonce="{RANDOM_NONCE}">
  window.__INITIAL_STATE__ = {...};
</script>

<script
  src="https://cdn.example.com/app.abc123.js"
  integrity="sha384-xxxxxx"
  crossorigin="anonymous"></script>
\`\`\`

### 层层防线总结

| 层 | 手段 | 防什么 |
| --- | --- | --- |
| 1 | 输入转义 / 模板默认转义 | 基础 XSS |
| 2 | CSP 白名单 + nonce | 即使注入了脚本，也因来源/nonce 不对无法执行 |
| 3 | SRI 哈希校验 | CDN 脚本被篡改时拒绝执行 |
| 4 | HttpOnly + Secure Cookie | XSS 后仍拿不到登录 Cookie |
| 5 | Trusted Types（现代浏览器） | 字符串不能直接赋给 innerHTML，进一步减少注入面 |

---

## 四、额外相关：Trusted Types（实验）

浏览器进一步把**可注入 HTML/脚本的"危险 sink"**（innerHTML、outerHTML、document.write、eval、setTimeout(string)、iframe srcdoc 等）保护起来：

\`\`\`
Content-Security-Policy: require-trusted-types-for 'script'; trusted-types myPolicy
\`\`\`

开启后直接写 \`el.innerHTML = userInput\` 会抛错，必须走自定义清洗策略：

\`\`\`js
const p = trustedTypes.createPolicy('myPolicy', {
  createHTML: (s) => DOMPurify.sanitize(s)
})
el.innerHTML = p.createHTML(userInput)  // ✅ 合法
\`\`\`

---

## 五、开发调试

- Chrome DevTools → Console / Network 会用红色直接标 CSP/SRI 违规原因。
- \`chrome://csp-internals\`（内部页面）查看当前页面解析后的 CSP 规则。
- 先上 **Report-Only**，收集一两周日志把漏网的域名补齐，再切正式强制模式。
- 正则、哈希、nonce 的正确格式建议用官方 W3C CSP 校验器或 Mozilla Observatory 在线打分。`
  },
  {
    id: 'html-048',
    category: 'html',
    title: 'ARIA 无障碍进阶：role / aria-* / 键盘焦点管理与常见反模式？',
    difficulty: '中等',
    tags: ['ARIA', '无障碍', 'a11y', '键盘导航'],
    answer: `## 再强调一次 ARIA 第一法则

> **No ARIA is better than bad ARIA.**

优先用**原生 HTML**。能用 \`<button>\` 就别写 \`<div role="button"> + tabindex + 键盘事件\`——后者需要手动补齐 10 多项原生默认行为，99% 的人写不全。

---

## 一、ARIA 三类属性再梳理

### 1. role = "它是什么"

告诉辅助技术这个元素是什么**角色**。

#### 文档结构角色

\`role="article"\`、\`role="complementary"\`、\`role="directory"\`、\`role="document"\`、\`role="feed"\`、\`role="figure"\`、\`role="group"\`、\`role="heading"\`、\`role="img"\`、\`role="list"\`、\`role="listitem"\`、\`role="math"\`、\`role="note"\`、\`role="presentation"\`、\`role="region"\`、\`role="row"\`、\`role="table"\`、\`role="term"\`、\`role="toolbar"\`。

#### 组件角色（最常用，需配合键盘实现）

| 组件 | 推荐 role 及子结构 |
| --- | --- |
| Tabs 标签页 | \`tablist\` > \`tab\` + \`tabpanel\`（aria-controls / aria-selected / aria-labelledby） |
| 手风琴 | \`button aria-expanded + aria-controls\` + \`region\`（不是 role=accordion，原生无此 role） |
| 对话框 | \`role="dialog" aria-modal="true"\` + aria-labelledby + 焦点陷阱 |
| 菜单 | \`menubar / menu / menuitem\`（仅适用于"应用式菜单"，导航栏别用） |
| 面包屑 | \`role="navigation" aria-label="面包屑"\` + \`aria-current="page"\` |
| 状态徽章 | \`role="status"\`（自动播报）、\`role="alert"\`（中断式播报） |
| 进度条 | \`role="progressbar" aria-valuenow aria-valuemin aria-valuemax\` |
| 开关 | \`role="switch" aria-checked="true/false"\` |
| 单选组 | \`role="radiogroup"\` + \`role="radio" aria-checked\` |

### 2. aria-label / aria-labelledby / aria-describedby = "它的标签/描述"

| 属性 | 用途 | 示例 |
| --- | --- | --- |
| \`aria-label\` | 直接给元素一个**字符串**标签（元素自身无可见文字，如图标按钮） | \`<button aria-label="关闭">×</button>\` |
| \`aria-labelledby\` | 引用**其他元素的 ID**做标签（屏幕阅读器会读对应元素的文字） | \`<dialog aria-labelledby="dlg-title">\` + \`<h2 id="dlg-title">\` |
| \`aria-describedby\` | 引用其他元素作为**补充描述**（读标签后再读描述） | 密码输入框下的"8-20 位，包含字母数字"说明 |

\`\`\`html
<!-- 关闭按钮：只有一个 ×，读屏用户不知道是什么 -->
<button aria-label="关闭对话框" aria-describedby="close-desc">×</button>
<span id="close-desc" hidden>关闭后未保存的更改将丢失</span>
\`\`\`

### 3. aria-* 状态 = "它现在怎么样"

| 属性 | 作用域 | 说明 |
| --- | --- | --- |
| \`aria-expanded\` | 可展开控件 | true/false/undefined，菜单、手风琴、Details 切换 |
| \`aria-current\` | 导航项 | \`page / step / location / date / time\`，指示当前位置（面包屑/步骤条） |
| \`aria-hidden\` | 任意元素 | true 对辅助设备隐藏（**可见可聚焦元素绝不能加**） |
| \`aria-disabled\` | 交互元素 | 逻辑禁用，可接收焦点（原生 disabled 更推荐，会彻底移除焦点） |
| \`aria-selected\` | 选项卡/选项 | 当前被选中 |
| \`aria-checked\` | 复选框、开关、radio | 三态（true / false / mixed） |
| \`aria-invalid\` | 表单控件 | 校验错误，常配合 aria-describedby 指错误提示 |
| \`aria-required\` | 表单控件 | 必填（优先用原生 required 属性） |
| \`aria-live\` | 动态区域 | \`off / polite / assertive\`，内容变更时自动播报 |
| \`aria-busy\` | 任意 | 正在加载，读屏暂停播报 |
| \`aria-controls\` | 触发元素 | "我控制哪个 ID 元素"（如 Tab 控制 TabPanel） |
| \`aria-owns\` | 父子不在同一 DOM 层级时 | 声明"视觉上我拥有这个子元素"（可访问性树重排） |
| \`aria-modal\` | 对话框 | true 表示模态，读屏不访问背景内容 |

---

## 二、动态内容自动播报：aria-live 区域

异步加载、toast、搜索结果数、购物车数量变化等**非用户直接操作引起的 UI 变更**，屏幕阅读器默认不知道。需要把变更放 live 区域：

\`\`\`html
<!-- polite：等用户空闲时再播报，默认首选 -->
<div aria-live="polite" id="status">共找到 24 条结果</div>

<!-- assertive：立即打断播报（仅紧急信息，如"表单提交失败"） -->
<div role="alert">网络错误，请重试</div>  <!-- role=alert 等价于 assertive + atomic -->
\`\`\`

**关键点**：
- **live 区域必须在 DOM 中预先存在**（哪怕空着）。动态新建 live 区域很多读屏不播报。
- \`aria-atomic="true"\`：每次变更时读**整个区域**而非仅变更部分。
- 内容是"追加"的：消息列表加一条新消息，读屏自动读新加的那条。
- 不要滥用：满屏都是 live 会让读屏不停念，用户崩溃。

---

## 三、键盘可访问性（很多组件挂在这里）

**规则：所有能点鼠标的交互元素，必须能用 Tab 到达、能用键盘触发。**

### 1. Tab 顺序与可见焦点

- 原生可交互元素（button / a / input / select / textarea）**默认**可 Tab 聚焦，不要破坏。
- 自定义组件需 \`tabindex="0"\` 加入 Tab 序列；\`tabindex="-1"\` 只能编程聚焦（\`el.focus()\`），不进 Tab 序列。
- **千万不要用 tabindex > 0**（强制 Tab 顺序），会和 DOM 顺序脱节——改 DOM 顺序而非 tabindex。
- **必须有明显的焦点环样式**！不要为了好看写 \`:focus { outline: none }\` 又不补替代样式：

\`\`\`css
:focus-visible { /* 键盘聚焦才显示环，鼠标不显示 */
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  border-radius: 2px;
}
\`\`\`

### 2. 常用组件键盘语义

写自定义组件时，下面这些键位不实现就是"有 ARIA 但完全不可用"：

#### Button (\`role="button"\`)
- Enter / Space：触发点击
- Tab：可聚焦

#### Checkbox (\`role="checkbox"\`)
- Tab：聚焦
- Space：切换
- ←/→ 有时也用于切换（单选组）

#### Radio Group (\`role="radiogroup"\`)
- Tab：进入组（聚焦当前选中项）
- ←/↑/→/↓：在组内切换并自动选中
- 组容器 \`aria-label / aria-labelledby\`

#### Tabs (\`role="tablist"\`)
- Tab：焦点从 tab 跳入 tabpanel（不是停在 tab 列表）
- ←/→：上/下一个 tab
- Home / End：首/末 tab
- 当前 tab 要 \`aria-selected="true" tabindex="0"\`，其余为 \`tabindex="-1"\`（Roving Tabindex 模式）

#### Dialog (Modal)
- 打开时焦点移到对话框的第一个可聚焦元素 / 主按钮
- **焦点陷阱**：Tab / Shift+Tab 不允许焦点跑出对话框（需 JS 实现）
- Esc：关闭对话框
- 关闭后焦点回到**触发它的按钮**
- 背景内容加 \`inert\` 或 \`aria-hidden="true"\` 并移除 Tab 可达

#### Menu / Dropdown
- ↑/↓：切换项
- Enter / Space：选中
- Esc：关闭
- Home / End：首/末项

> 复杂组件建议直接用 **Headless UI**（Radix UI / Headless UI / React Aria），它们把 ARIA 和键盘行为都写对了，你只套样式即可。

---

## 四、Screen Reader 焦点 vs DOM 焦点

屏幕阅读器有两种"光标"：

1. **DOM 焦点（系统焦点）**：Tab 键移动，有焦点环，绑定事件，仅交互元素能获焦。
2. **虚拟光标（浏览光标）**：读屏专用，方向键/快捷键移动，任何元素（标题、段落、图片）都能被读到。

常见误区：
- 纯文本信息（错误提示）不要 \`focus()\`——用 **aria-live** 区域播报，因为用户不在表单里操作。
- SPA 路由切换后，应该把"页面主标题"（\`<h1>\`）设为 \`tabindex="-1"\` 再 \`focus()\`，让读屏告知"现在到了什么页面"。
- Skip Link（跳到主内容链接）：页面顶部第一个链接，键盘用户按一次 Tab 就能看到，点了直接跳 \`<main>\`，避免每次都读导航。

\`\`\`html
<a href="#main" class="skip-link">跳到主内容</a>
<main id="main" tabindex="-1">...</main>
\`\`\`

---

## 五、典型 ARIA 反模式（面试常考点）

### ❌ 反模式 1：用错 role 覆盖原生语义

\`\`\`html
<!-- 错误：h2 变成按钮，读屏不再认为是标题 -->
<h2 role="button">点击展开</h2>

<!-- 正确：按钮包住文字，保留 h2 语义 -->
<h2><button>点击展开</button></h2>
\`\`\`

### ❌ 反模式 2：可见可聚焦元素加 aria-hidden

\`\`\`html
<!-- 错误：按钮还能 Tab 到，但读屏说"不存在"，精神分裂 -->
<button aria-hidden="true">确定</button>
\`\`\`

**aria-hidden 只加给纯装饰 / 真正不想被读屏访问且不可聚焦的内容。**

### ❌ 反模式 3：多余重复的标签

\`\`\`html
<!-- 错误：冗余，读屏念三遍"搜索 搜索 搜索" -->
<button aria-label="搜索">
  <svg role="img" aria-label="搜索">...</svg>
  <span class="sr-only">搜索</span>
</button>
\`\`\`

选择一种即可：
- 图标按钮里放 sr-only 文字（最通用、SEO 友好）。
- 或给 svg 加 \`aria-hidden="true"\` + 给 button 加 \`aria-label\`。

### ❌ 反模式 4：占位符代替 label

\`\`\`html
<!-- 错误：placeholder 一点击就消失，读屏不读 placeholder 当 label -->
<input placeholder="邮箱地址">

<!-- 正确：用 label 关联，placeholder 仅提示格式 -->
<label for="email">邮箱地址</label>
<input id="email" placeholder="name@example.com">
\`\`\`

### ❌ 反模式 5：img alt 描述写"图片"二字

\`\`\`html
<!-- 错误：读屏会念"图像 公司 Logo 图片" -->
<img alt="公司 Logo 图片">

<!-- 正确：直接描述内容 -->
<img alt="Acme 公司 Logo">
\`\`\`

### ❌ 反模式 6：纯装饰图漏写空 alt

\`\`\`html
<!-- 错误：读屏念"bg-divider-dashed.png"一串文件名 -->
<img src="divider.png">

<!-- 正确：装饰图明确 alt=""，读屏直接跳过 -->
<img src="divider.png" alt="">
\`\`\`

### ❌ 反模式 7：用 role="presentation" 粗暴隐藏语义

\`\`\`html
<!-- 错误：table 变纯布局，读屏丢行列关系 -->
<table role="presentation">
  <tr><td>产品</td><td>价格</td></tr>
</table>
\`\`\`

真要布局就用 CSS Grid / Flex，别糟蹋数据表格。

### ❌ 反模式 8：颜色作为唯一信息传达

表单错误把边框变红 + 只放一张红色感叹号图——色盲用户看不出。必须**加文字错误提示**（aria-describedby 关联到 input）。

---

## 六、验证工具链

1. **Lighthouse（Chrome DevTools → 灯塔）**：一键审计 Accessibility 项，80% 的低级错误直接抓出。
2. **axe DevTools / axe-core**：业界最强可访问性扫描器，集成到 CI 防止 PR 合入退化。
3. **Screen Reader 实测**：
   - Windows + NVDA + Firefox（最常见组合）。
   - macOS + VoiceOver + Safari。
   - 手机：iOS VoiceOver（侧滑读屏）/ Android TalkBack。
4. **仅键盘走通一遍**：拔鼠标，Tab 过所有交互，Enter/Space 触发，Esc 关闭，列表能用方向键。
5. **WCAG 2.1 AA 是合规基线**：4 大原则 POUR（可感知 / 可操作 / 可理解 / 健壮性）。

**一句话总结**：ARIA 是"描述不是替代"。能用原生标签就别加 role；加了 role 必须把对应的键盘行为补齐；最终用读屏+键盘实际验证。`
  },
  {
    id: 'html-049',
    category: 'html',
    title: 'iframe 的 sandbox 属性详解：如何安全地嵌入不受信任内容？',
    difficulty: '中等',
    tags: ['iframe', 'sandbox', '安全', '嵌入'],
    answer: `## iframe sandbox 是什么

\`sandbox\` 是 \`<iframe>\` 的属性，用于对嵌入的页面施加**额外安全限制**，把 iframe 放进一个"沙箱"里，即使嵌入页被攻破也难以危害父页面和访问者。沙箱**默认是全限制**（所有能力都关），通过空格分隔的 token 逐项开放。

---

## 基本用法

\`\`\`html
<!-- 最严格：完全沙箱化，无任何能力（连脚本都不能跑） -->
<iframe src="untrusted.html" sandbox></iframe>

<!-- 按需开能力 -->
<iframe
  src="https://third-party.com/widget.html"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups">
</iframe>
\`\`\`

> **安全原则**：给最小必要权限。宁可少开，不要为了省事全开。

---

## sandbox Token 完整清单与影响

### 1. allow-same-origin（允许同源）

- 不开时（默认）：iframe 内页面**强制独立源**（opaque origin），即使它和父页面同域名也被当成不同源。无法读取父页面 \`localStorage\`、无法访问父 DOM、cookie 被隔离。
- 开了后：iframe 按**真实 URL 的源**算（和父同域就能互相访问）。

⚠️ **危险组合**：\`allow-scripts\` + \`allow-same-origin\` 同时开启时，沙箱页面可以通过脚本取到 \`parent.location\`、读写 \`document.cookie\`、甚至 \`parent.postMessage\` 伪造消息，基本等于撤销了大部分沙箱保护。

**建议**：第三方内容绝不要同时开这两个。如果要开 allow-scripts，就必须关掉 allow-same-origin（或者把第三方内容放到专门的不信任子域）。

### 2. allow-scripts（允许脚本）

- 默认：禁用 JS。\`<script>\`、\`onclick\`、\`javascript:\` 协议、定时器、XHR/fetch 大部分都失效。
- 开了后：能跑脚本。

注意：即使关了 allow-scripts，\`<a href="javascript:...">\` 仍可能在某些旧浏览器被触发，配合 target 漏洞；内容如果完全不信任，建议 HTTP 层再上 CSP \`script-src: none\` 双重保险。

### 3. allow-forms（允许提交表单）

默认禁止 \`<form>\` 提交（\`form.submit()\` / 按钮都被禁用）。只在你相信 iframe 内部表单不会向恶意站点 POST 时开启。

### 4. allow-popups（允许弹窗 / window.open）

- 默认：\`window.open\`、\`<a target="_blank">\`、\`showModalDialog\` 全部失效。
- 开了后：允许弹窗。
- **\`allow-popups-to-escape-sandbox\`**：弹窗出来的新窗口**不再继承沙箱**（新窗口按正常源对待）。适合"沙箱里点链接打开正常新标签"的场景。

### 5. allow-modals（允许模态对话框）

默认屏蔽 \`alert\`、\`confirm\`、\`prompt\`、\`print()\`、\`BeforeUnloadEvent\`（关页面前的"确定离开？"）。这些会阻塞用户，恶意 iframe 很爱弹不停。

### 6. allow-top-navigation（允许跳顶层导航）

默认：iframe 内的 \`location.href = 'evil'\` 或 \`<a target="_top">\` **不能改变父页面的 URL**。开了后允许。

⚠️ **高危**：开了后嵌入页可把整个网站偷偷替换成钓鱼页面。只在绝对信任时开。

变种：**\`allow-top-navigation-by-user-activation\`**——只在用户真实点击/按键后才能跳顶层（比 allow-top-navigation 安全）。

### 7. allow-orientation-lock（允许锁定屏幕方向）

允许全屏游戏/视频用 \`screen.orientation.lock()\` 强制横屏。移动端才相关。

### 8. allow-pointer-lock（允许指针锁定）

允许 \`element.requestPointerLock()\`（3D 游戏、沉浸式画布把鼠标锁在画面里）。

### 9. allow-presentation（允许 Presentation API）

允许用 \`navigator.presentation\` 投屏到第二屏幕（会议/演示类需求）。

### 10. allow-downloads（允许下载）

默认禁止：\`<a download>\`、JS 触发的 blob download、Content-Disposition: attachment 响应等都被挡。

变种：**\`allow-downloads-without-user-activation\`**——不需要用户点击也能自动下载（更危险，谨慎用）。

### 11. allow-storage-access-by-user-activation（允许存储访问请求）

现代浏览器对第三方 iframe 的 cookie/storage 有双重隔离（ITP 等隐私保护），该 token 允许 iframe 调用 \`document.requestStorageAccess()\`，在用户点击后申请临时访问第一方存储权限（用于单点登录、支付 SDK 等场景）。

### 12. allow-clipboard-read / allow-clipboard-write（允许剪贴板）

允许 iframe 用 Async Clipboard API（\`navigator.clipboard.readText()\` / \`writeText()\`）。默认禁用避免读密码/写恶意内容。

### 13. 许可令牌（Permission Policy，旧 Feature Policy）

虽然不在 sandbox 属性里，但通常 iframe 会**配合 \`allow\` 属性**限制更现代的 API 访问：

\`\`\`html
<iframe
  src="..."
  sandbox="allow-scripts"
  allow="camera 'none'; microphone 'none'; geolocation 'none'; fullscreen 'self'">
</iframe>
\`\`\`

camera / microphone / geolocation / fullscreen / payment / usb / web-share 等几十种细粒度权限都可以单独控制。

---

## 常见场景推荐配置

### 1. 嵌入广告 / 第三方营销代码（最不信任）

\`\`\`html
<iframe
  srcdoc="..."
  sandbox
  loading="lazy"
  referrerpolicy="no-referrer"
  allow="camera 'none'; microphone 'none'; geolocation 'none'">
</iframe>
\`\`\`

**不开任何 token**：广告不需要脚本（静态图）就别开；实在需要 JS 最多加 \`allow-scripts allow-popups\`。

### 2. 嵌入用户投稿的 HTML（UGC 预览）

\`\`\`html
<iframe
  srcdoc="\${userHTML}"
  sandbox="allow-popups"
  referrerpolicy="no-referrer"
  csp="default-src 'self'; img-src data: https:;">
</iframe>
\`\`\`

甚至连 allow-scripts 都不要开，富文本只保留静态渲染。如果必须开脚本：**托管到完全独立的无权限域名**（如 \`usercontent.yourcorp-nopriv.com\`，和主站 cookie/Session 完全不沾边）。

### 3. 嵌入第三方支付 / SSO（需要跨域通信和跳转）

\`\`\`html
<iframe
  src="https://pay.example.com/checkout"
  sandbox="allow-scripts allow-forms allow-popups allow-same-origin allow-storage-access-by-user-activation"
  allow="payment 'self'">
</iframe>
\`\`\`

### 4. 嵌入自家微前端子应用（相对信任）

\`\`\`html
<iframe
  src="https://sub.example.com"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation allow-downloads"
  allow="fullscreen 'self'; clipboard-write 'self'">
</iframe>
\`\`\`

自家应用也不要开 allow-top-navigation，用 by-user-activation 版本更稳。

---

## 多层防御（Don't Trust Sandbox Blindly）

sandbox 是第一道门，**组合拳**才安全：

| 层 | 技术 | 作用 |
| --- | --- | --- |
| 1 | sandbox | iframe 级能力限制 |
| 2 | \`allow="camera 'none'; ..."\` | 细粒度 Permission Policy |
| 3 | \`referrerpolicy="no-referrer"\` | 不把本站 URL/referrer 泄露给第三方 |
| 4 | \`csp="..."\`（iframe CSP） | 对 iframe 内部再施一层内容安全策略（Chrome 支持） |
| 5 | 独立不信任域名托管 | 即使 allow-same-origin 也危害不到主站 cookie |
| 6 | CSP frame-ancestors（响应头） | **反过来限制**：iframe 内容方可以设置"只允许哪些域嵌我"，防点击劫持 |
| 7 | X-Frame-Options（兼容旧浏览器） | SAMEORIGIN / DENY，frame-ancestors 的前任 |
| 8 | \`permissions-policy\`（父页面响应头） | 父页面全站级默认权限关闭白名单 |

---

## 配合 postMessage 通信的安全守则

沙箱 iframe 经常需要和父页面通信，**安全写 postMessage 是关键**：

\`\`\`js
// ❌ 错误：滥发滥收
iframe.contentWindow.postMessage(data, '*')
window.addEventListener('message', (e) => handle(e.data))

// ✅ 正确：双向严格校验
// 父发子
iframe.contentWindow.postMessage(
  { type: 'INIT', payload: cfg },
  'https://trusted-child.example.com'  // 指定 targetOrigin，绝不写 *
)

// 子收父
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://parent.example.com') return   // ✅ 校验来源
  if (!e.data || typeof e.data !== 'object') return       // ✅ 校验结构
  if (e.data.type !== 'INIT') return
  // 不要把 e.data 直接赋 innerHTML / eval
  handleTrusted(e.data.payload)
})
\`\`\`

复杂通信场景建议用 **MessageChannel**：两端各持一个 port，收发自成通道，避免全局 message 广播。

---

## 点击劫持与 Frame 防护（被嵌入方视角）

反过来，**你自己的网站**要防止被别人用 iframe 套一层来做点击劫持（透明浮层骗用户点转账）：

1. 响应头加：
   \`\`\`
   Content-Security-Policy: frame-ancestors 'self' https://trusted.com;
   X-Frame-Options: SAMEORIGIN;
   \`\`\`
   frame-ancestors 支持更细粒度白名单，优先用它；X-Frame-Options 兼容旧浏览器。

2. 前端兜底（古老浏览器仍有用）：\`frame-busting\` 脚本——如果 \`top !== self\` 就把自己顶出去：
   \`\`\`html
   <style>html{display:none;}</style>
   <script>
     if (top === self) { document.documentElement.style.display = 'block'; }
     else { top.location = self.location; }
   </script>
   \`\`\`
   （注意：iframe 方可以用 \`sandbox="allow-top-navigation"\` 不开放的话，JS 也跳不出去，所以**以响应头为主**）

---

## 常见问答误区

**Q：sandbox 加了是不是就绝对安全了？**
A：不是。历史上 Chrome/Safari 都出过沙箱绕过的 0day（如通过特殊协议、file://、Blob URL、srcdoc 组合拳），只是攻击门槛大大提高。对真正敌意内容（黑客上传的完整 HTML），最好跑在独立域名 + 子进程级隔离的服务端渲染截图，不要直接 iframe。

**Q：sandbox 空属性和完全无 sandbox 属性有什么区别？**
A：天壤之别。写 \`sandbox=""\`（或仅 \`sandbox\`）是**全开限制**；不写 sandbox 属性是**完全无限制**，和普通页面一样所有权限都有。

**Q：srcdoc 和 src 有什么安全差异？**
A：\`srcdoc\` 直接把 HTML 写在属性里，**默认走 opaque origin**（即使开了 allow-same-origin 也不会和父同源），更适合嵌入完全不信任的 HTML。但是**记得 HTML 转义** srcdoc 的内容（不然 XSS 直接打进父页面）。

**Q：移动端 WebView 里 sandbox 生效吗？**
A：Android WebView 和 iOS WKWebView 大部分 token 是生效的（allow-scripts / allow-forms 等），但一些桌面端的新 token（storage-access、clipboard-read 等）在旧系统 WebView 上不生效，需要测试矩阵。`
  },
  {
    id: 'html-050',
    category: 'html',
    title: 'fetchpriority 属性是什么？（配合 preload / lazy / async / 图片优先级详解）',
    difficulty: '简单',
    tags: ['fetchpriority', '性能优化', '资源加载', 'preload'],
    answer: `## 浏览器的"资源加载优先级"机制

浏览器在解析 HTML 时，会对不同资源自动赋予**加载优先级（Network Priority）**，通常分 5 档：Highest / High / Medium / Low / Lowest。

默认的推断规则大致是：
- **CSS**（在 head 中且无 media=print）：**Highest**。
- **首屏字体 / preload 资源**：High。
- **\`<script defer/async>\`**：Medium 或 Low。
- **普通 \`<img>\`**（初始视口内）：Medium；视口外：Low。
- **iframe / 预取（prefetch）**：Lowest。

问题在于：**浏览器的默认推断并不总是符合业务的真实重要性**——比如：
- 首屏 Hero Banner 图：浏览器把它当普通 Medium 优先级，但它是 LCP 核心元素，应该 Highest。
- 首屏下方的视频预览图：默认 Medium，但我们想让它让路给关键字体。
- 早期插入的第三方统计脚本：默认 High，但它不重要。
- **\`<link rel="preload">\` 会把优先级硬拉到 High**，导致真正关键的 LCP 资源反而被抢带宽。

\`fetchpriority\` 就是用来**显式告诉浏览器：这个资源的相对优先级我要手动调一下**。

---

## 基本语法

\`\`\`html
<img src="hero.jpg" fetchpriority="high" alt="首屏大图">
<iframe src="video.html" fetchpriority="low"></iframe>
<link rel="preload" as="image" href="banner.jpg" fetchpriority="high">
<script src="non-critical.js" async fetchpriority="low"></script>
\`\`\`

可选值：
| 值 | 含义 |
| --- | --- |
| \`high\` | 相对同级其他资源**提高**优先级 |
| \`low\` | 相对同级其他资源**降低**优先级 |
| \`auto\` | 默认，让浏览器自己决定 |

\`fetchpriority\` **只影响"什么时候发请求"**，**不改变加载顺序的绝对语义**。它是相对的"调度建议"，不是硬指令。

---

## 支持的元素和属性

\`fetchpriority\` 可用于以下元素（Chrome 102+、Edge 102+、Firefox 119+、Safari 17.4+；2024 年后基本可用）：

| 元素 | 关联属性 | 说明 |
| --- | --- | --- |
| \`<img>\` | — | 图片，最常见用途 |
| \`<link>\` | \`rel="preload"\` 或 \`rel="modulepreload"\` | 预加载资源的优先级 |
| \`<script>\` | 传统/模块脚本 | 调 JS 优先级 |
| \`<iframe>\` | — | iframe 内文档 |

实验中：\`<audio>\`、\`<video>\`、\`<embed>\`、\`<object>\`。

---

## 实战优化场景

### 场景 1：提升 LCP（最大内容绘制）元素优先级（最常用）

LCP 元素通常是首屏大图/视频封面，浏览器默认把视口内图片放在 Medium，导致它和一堆普通 JS/CSS 抢并发。手动提升：

\`\`\`html
<link rel="preload" as="image" href="hero.jpg" fetchpriority="high">
<img src="hero.jpg" alt="产品主视觉" fetchpriority="high" width="1200" height="600">
\`\`\`

配合 \`<link rel="preload">\` + \`fetchpriority="high"\` 可以让图片在 CSS/字体之前就早早发请求，极大提前 LCP 时间（尤其是弱网、HTTP/1.1 场景）。

> ⚠️ **不要滥用 high**。一个页面只给 **LCP 元素 + 关键字体**这种真正影响首屏体验的 1-3 个资源标 high，太多等于没标。

### 场景 2：降低非关键图片 / 轮播非首屏的优先级

轮播图除了第一张，第 2、3 张虽然也在视口附近但不必首屏就加载；商品列表下方的推荐图不必在用户没滚动时就高并发请求：

\`\`\`html
<div class="carousel">
  <img src="slide1.jpg" fetchpriority="high">
  <img src="slide2.jpg" fetchpriority="low" loading="lazy">
  <img src="slide3.jpg" fetchpriority="low" loading="lazy">
</div>
\`\`\`

### 场景 3：调整异步脚本之间的相对优先级

A/B 测试 / 统计 / 埋点脚本很多，想让"主业务 SDK 比第三方统计早拉到"：

\`\`\`html
<!-- 支付/登录 SDK，先下 -->
<script src="https://sdk.example.com/client.js" async fetchpriority="high"></script>
<!-- 第三方统计，不着急 -->
<script src="https://track.analytics.cn/beacon.js" async fetchpriority="low"></script>
\`\`\`

### 场景 4：preload 过多？把非关键 preload 降档

很多项目 preload 了 7-8 个资源，preload 默认是 High，挤爆了首屏带宽。把非关键的预加载降回 low：

\`\`\`html
<!-- 关键：首屏字体 high -->
<link rel="preload" as="font" href="/fonts/main.woff2" type="font/woff2" crossorigin fetchpriority="high">

<!-- 非关键：下一页路由的 JS，low 即可 -->
<link rel="preload" as="script" href="/chunks/checkout.js" fetchpriority="low">
\`\`\`

### 场景 5：动态插入图片时控制优先级

瀑布流首屏先加载头 20 条 high，剩下的延后 low：

\`\`\`js
items.forEach((item, i) => {
  const img = new Image()
  img.fetchpriority = i < 20 ? 'high' : 'low'
  img.loading = i < 20 ? 'eager' : 'lazy'
  img.src = item.pic
})
\`\`\`

---

## 和 loading / async / defer / preload / prefetch 的关系

很多人混淆。一张表搞清：

| 属性 | 做什么 | 何时生效 | 范围 |
| --- | --- | --- | --- |
| \`loading="lazy/eager"\` | **发不发请求**（是否等到进入视口） | 决定请求发起时机 | img / iframe |
| \`fetchpriority\` | **发请求时在调度队列里排第几**（高/低） | 请求入队时排序 | 资源下载阶段 |
| \`async / defer\` | 脚本**什么时候执行**（解析到立刻执行 / DOM 后） | 脚本已下载后执行 | 仅 script |
| \`preload\` | **提前发起请求**（提前到解析到 link 立刻请求，不等实际用到） | 触发请求时间 | link |
| \`prefetch\` | **空闲时**预取未来页面可能用的资源 | 浏览器空闲时间 | link |

### 常见组合范式

#### 图片（LCP）：preload + fetchpriority=high + 显式尺寸

\`\`\`html
<link rel="preload" as="image" href="hero.avif" fetchpriority="high">
<img src="hero.avif" fetchpriority="high" width="1200" height="600" decoding="async" alt="">
\`\`\`

**目标**：请求能最早发、发了就抢在最前面、不触发布局抖动（CLS）。

#### 非首屏次要图：loading=lazy + fetchpriority=low

\`\`\`html
<img src="rec-1.jpg" loading="lazy" fetchpriority="low" width="300" height="300" alt="">
\`\`\`

**目标**：既不提前发（等进入视口），发了也不抢首屏带宽。

#### 关键业务脚本：defer + fetchpriority=high

\`\`\`html
<script src="app.js" defer fetchpriority="high"></script>
\`\`\`

#### 第三方统计脚本：async + fetchpriority=low

\`\`\`html
<script src="https://third-party.com/analytics.js" async fetchpriority="low"></script>
\`\`\`

**目标**：统计脚本永远别和主业务抢首屏关键时刻。

#### 路由预取：prefetch（天然 Lowest，不用加）

\`\`\`html
<link rel="prefetch" href="/next-page.js">
\`\`\`

prefetch 默认最低优先级，一般不用再写 fetchpriority。

---

## 配合 Hints（推测加载）更精准

Chrome 128+ 引入了 **Hints（推测式加载）**，让 \`<img>\` / \`<script>\` 延迟渲染但提前下资源：

\`\`\`html
<img blocking="render" src="hero.jpg">  <!-- 阻塞渲染，等图到位再画（LCP 更快） -->
<script blocking="render" src="critical.js"></script>
\`\`\`

但这个非常激进，只有对"不到位就先别渲染"的极关键资源才考虑。

---

## 观察优先级是否生效（DevTools 验证）

1. 打开 DevTools → Network。
2. 刷新页面，表头右键勾选 **Priority** 列。
3. 观察资源的 Priority 列，看是否和你的 fetchpriority 设置一致。

HTTP/2 的 h2 列也可以看并发发送顺序：
- fetchpriority=high 的图片应该和 CSS/首屏脚本一起在最早的一批请求里。
- fetchpriority=low 的资源排在队列后段。

Lighthouse 也开始在 Performance 诊断中提示：
- 「LCP image was not preloaded with fetchpriority=high」——有这一条直接加就能加分。

---

## 常见误区

### ❌ 误区 1：fetchpriority 能强制让资源先加载完

它只是**调度优先级建议**。浏览器实际还要受连接数限制（HTTP/1.1 每域 6 连接）、拥塞窗口、TCP 慢启动影响。high 只是"谁先从队列里出队发 SYN"，不保证谁先收完字节。

### ❌ 误区 2：给所有资源全标 high

这就像全公司所有人都是 P0 紧急——等于没有优先级。首屏关键资源 1~3 个标 high 就够了，其他该 lazy lazy，该 low low。

### ❌ 误区 3：用 fetchpriority 替代 preload

preload 是**提前触发请求的时机**（例如字体藏在 CSS 里，默认要等 CSS 解析完才发现字体；preload 能提前），fetchpriority 是**排队先后**。两者作用于不同环节，关键资源应该两者都用。

### ❌ 误区 4：fetchpriority 能省流量

它只是调度顺序，**不减少任何字节**，总流量不变。优化目标是**关键字节先到**，缩短 LCP / INP，而不是降总带宽。

### ❌ 误区 5：loading=lazy 和 fetchpriority=high 一起写在 LCP 上

LCP 元素**绝不能 lazy**。lazy 会让它等进入视口才发请求，首屏延迟几百毫秒，得不偿失。LCP 元素应该是 eager（默认）+ fetchpriority=high + preload。

---

## 总结：一张"资源优先级清单"速查

| 资源类型 | 建议 |
| --- | --- |
| 首屏关键 CSS | 内联 或 不加（默认 Highest 已足够） |
| 首屏字体 | \`rel="preload" as="font" crossorigin fetchpriority="high"\` |
| LCP 图 | \`<link rel="preload" as="image">\` + \`<img fetchpriority="high">\` |
| 首屏业务 JS | \`defer fetchpriority="high"\` |
| 第三方统计脚本 | \`async fetchpriority="low"\` |
| 非首屏普通图 | \`loading="lazy" fetchpriority="low"\` |
| 轮播图（非第一张） | \`loading="lazy" fetchpriority="low"\` |
| iframe（第三方广告） | \`loading="lazy" fetchpriority="low"\` |
| 下一页面路由 JS | \`rel="prefetch"\`（默认 Lowest） |
| preload 过多时，次要 preload | \`rel="preload" fetchpriority="low"\` |

\`fetchpriority\` 是**零成本、语义友好、收益直接**的性能优化点，在 2024 年后的浏览器支持已经非常好，值得在每个关注 LCP 的项目里加一下 LCP 资源的 high 和首屏下方资源的 low。`
  }
]
