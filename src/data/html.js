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
  }
]
