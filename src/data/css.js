export const cssQuestions = [
  {
    id: 'css-001',
    category: 'css',
    title: 'CSS 盒模型有几种？区别是什么？',
    difficulty: '简单',
    tags: ['盒模型', 'box-sizing'],
    answer: `## 两种盒模型

1. **标准盒模型（content-box）**：\`width\` / \`height\` 只包含 **content**。\`box-sizing\` 默认值。
2. **IE 盒模型（border-box）**：\`width\` / \`height\` 包含 **content + padding + border**。

## 计算

\`\`\`css
/* content-box: 实际宽度 = width + padding*2 + border*2 */
.box { width: 100px; padding: 10px; border: 2px solid; } /* 实际 124px */

/* border-box: 实际宽度 = width，content 被压缩 */
.box { box-sizing: border-box; width: 100px; padding: 10px; border: 2px solid; } /* 实际 100px */
\`\`\`

## 推荐

全局使用 \`border-box\`，避免布局计算混乱：

\`\`\`css
*,
*::before,
*::after {
  box-sizing: border-box;
}
\`\`\`

\`margin\` 在两种盒模型中都不算入 \`width/height\`。`
  },
  {
    id: 'css-002',
    category: 'css',
    title: 'BFC 是什么？如何创建？解决了什么问题？',
    difficulty: '中等',
    tags: ['BFC', '块级格式化上下文', '布局'],
    answer: `## 定义

**BFC（Block Formatting Context，块级格式化上下文）** 是一个独立的渲染区域，内部元素的布局不影响外部，外部也不影响内部。它是页面 CSS 视觉渲染的一个"隔离容器"。

## 创建 BFC 的条件

- 根元素 \`<html>\`
- \`float\` 不为 \`none\`
- \`position\` 为 \`absolute\` / \`fixed\`
- \`display\` 为 \`inline-block\` / \`flex\` / \`grid\` / \`table-cell\` / \`flow-root\` 等
- \`overflow\` 不为 \`visible\` / \`clip\`（如 \`hidden\`、\`auto\`、\`scroll\`）
- \`contain\` 为 \`layout\` / \`content\` / \`paint\`

> 推荐用 \`display: flow-root\` 创建 BFC，它没有副作用（不会像 overflow 那样裁剪、像 float 那样脱离文档流）。

## BFC 的布局规则

1. 内部的 Box 会在垂直方向上一个接一个放置。
2. 属于同一个 BFC 的两个相邻 Box 的 margin 会发生折叠。
3. BFC 区域不会与 float 元素重叠。
4. 计算 BFC 高度时，浮动元素也参与计算。

## 解决的问题

1. **清除浮动**：父元素触发 BFC 后会包含浮动子元素，撑开高度。
2. **避免 margin 折叠**：将其中一个元素放进新的 BFC。
3. **实现自适应两栏布局**：左侧浮动，右侧触发 BFC 不与浮动重叠。

\`\`\`css
.left { float: left; width: 200px; }
.right { overflow: hidden; } /* 形成 BFC，自动占据剩余宽度 */
\`\`\``
  },
  {
    id: 'css-003',
    category: 'css',
    title: '实现水平垂直居中有哪些方式？',
    difficulty: '简单',
    tags: ['居中', 'flex', 'grid'],
    answer: `## 1. Flex（最常用）

\`\`\`css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

## 2. Grid

\`\`\`css
.parent { display: grid; place-items: center; }
\`\`\`

## 3. 绝对定位 + transform（不需知道子元素尺寸）

\`\`\`css
.child {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\`

## 4. 绝对定位 + margin auto（需定宽高）

\`\`\`css
.child {
  position: absolute;
  inset: 0;            /* top/right/bottom/left: 0 */
  margin: auto;
  width: 100px;
  height: 100px;
}
\`\`\`

## 5. 绝对定位 + 负 margin（需知道尺寸）

\`\`\`css
.child {
  position: absolute;
  top: 50%; left: 50%;
  width: 100px; height: 100px;
  margin-top: -50px; margin-left: -50px;
}
\`\`\`

## 6. 行内元素

父级 \`line-height\` 等于高度、\`text-align: center\` 实现行内垂直水平居中。

> 优先使用 Flex / Grid，语义清晰、兼容性好。`
  },
  {
    id: 'css-004',
    category: 'css',
    title: 'flex: 1 代表什么？flex 属性的完整含义？',
    difficulty: '中等',
    tags: ['flex', 'flex-grow', 'flex-shrink'],
    answer: `\`flex\` 是 \`flex-grow\`、\`flex-shrink\`、\`flex-basis\` 三个属性的简写。

## 三个属性

- **flex-grow**：放大比例（默认 0）。容器有剩余空间时，按各项目的 grow 值分配剩余空间。
- **flex-shrink**：缩小比例（默认 1）。空间不足时，按 shrink 值（加权 basis）缩小。
- **flex-basis**：初始大小（默认 auto，即以 content/width 为准）。

## flex: 1 的含义

\`flex: 1\` 等价于 \`flex: 1 1 0%\`：

- grow=1：参与分配剩余空间
- shrink=1：允许收缩
- basis=0%：不考虑自身内容大小，完全按 grow 比例分配

> 注意：\`flex: 1\` 与 \`flex: 1 1 auto\` 不同。\`basis: auto\` 会先按内容大小占位，再分配剩余空间，导致各项目宽度可能不一致。

## 常见预设值

| 写法 | 等价 | 含义 |
| --- | --- | --- |
| \`flex: 0 1 auto\` | \`initial\`（默认） | 不放大、可收缩 |
| \`flex: 1\` | \`1 1 0%\` | 等比放大缩小 |
| \`flex: auto\` | \`1 1 auto\` | 放大，按内容 |
| \`flex: none\` | \`0 0 auto\` | 不放大不缩小 |
| \`flex: 0\` | \`0 0 0%\` | 不参与伸缩（可能塌缩为 0） |`
  },
  {
    id: 'css-005',
    category: 'css',
    title: 'CSS 选择器优先级如何计算？',
    difficulty: '中等',
    tags: ['选择器', '优先级', 'specificity'],
    answer: `## 优先级（特异性 specificity）

用一个四位数 \`(a, b, c, d)\` 表示（实际是按位比较，不是简单相加）：

| 级别 | 来源 | 示例 |
| --- | --- | --- |
| a | 行内样式 \`style\` | \`<div style="">\` |
| b | ID 选择器 | \`#id\` |
| c | 类、伪类、属性选择器 | \`.cls\`、\`:hover\`、\`[type]\` |
| d | 元素、伪元素选择器 | \`div\`、\`::before\` |

> 通配符 \`*\`、组合符（\`>\` \`+\` \`~\`）、\`:where()\` 不影响优先级；\`:is()\` / \`:not()\` 取参数中**最高**优先级计入。

## 比较规则

从左到右逐位比较，左边大的整体就大。例如 \`#a .b\`（1,1,0）> \`#a\`（1,0,0）> \`.a.b.c\`（0,3,0）> \`div p\`（0,0,2）。

## 其他规则

1. \`!important\` 会覆盖普通声明（尽量避免滥用）。
2. 相同优先级时，**后写的覆盖先写的**（源码顺序）。
3. 用户样式表、作者样式表、浏览器默认样式的优先级关系：作者 > 用户 > 浏览器（\`!important\` 时用户优先级提升）。
4. 继承的属性没有特异性，任何直接声明的规则都优先于继承值。`
  },
  {
    id: 'css-006',
    category: 'css',
    title: '重绘（Repaint）和回流/重排（Reflow）的区别？如何减少？',
    difficulty: '中等',
    tags: ['重绘', '回流', '性能'],
    answer: `## 概念

- **回流 / 重排（Reflow）**：当元素的**几何信息**（位置、尺寸）变化时，浏览器需要重新计算布局，并可能引发连锁反应。
- **重绘（Repaint）**：元素**外观**变化（颜色、背景、阴影等）但布局不变，浏览器只需重新绘制像素。

> 回流一定触发重绘，重绘不一定触发回流。回流的开销远大于重绘。

## 常见触发

**触发回流**：增删 DOM、修改尺寸（width/height/padding/margin）、修改位置、读取 offsetWidth/scrollTop 等强制同步布局的属性、窗口 resize、改变字体。

**只触发重绘**：color、background、visibility、outline、box-shadow 等。

## 减少回流的方法

1. **批量修改样式**：用 class 切换，而不是逐条修改 style 属性。
2. **脱离文档流修改**：先 \`display: none\`（一次回流）→ 修改 → 显示（一次回流），或使用绝对定位 / DocumentFragment。
3. **避免强制同步布局**：不要在循环中先读布局属性再写样式。
4. **使用 transform / opacity 做动画**：它们只触发合成层，不触发布局（合成器线程处理）。
5. **will-change / translateZ(0)** 提升为独立合成层（谨慎使用）。
6. **现代框架的虚拟 DOM diff** 已经在批量更新上做了优化。`
  },
  {
    id: 'css-007',
    category: 'css',
    title: 'CSS 动画与 transition / animation 的区别？',
    difficulty: '中等',
    tags: ['动画', 'transition', 'animation'],
    answer: `## transition（过渡）

用于**状态切换**时的平滑过渡，需要触发条件（如 :hover、class 变化）。

\`\`\`css
.box { transition: transform 0.3s ease; }
.box:hover { transform: scale(1.1); }
\`\`\`

- 只能定义起止状态，不能定义中间关键帧。
- 需要"属性变化"才触发。

## animation（动画）

通过 \`@keyframes\` 定义**关键帧序列**，可自动播放、循环、控制方向。

\`\`\`css
@keyframes spin {
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
}
.box { animation: spin 2s linear infinite; }
\`\`\`

- 支持多个关键帧、循环、暂停、延迟、方向（alternate）。
- 不依赖状态变化，可自动运行。

## 主要区别

| | transition | animation |
| --- | --- | --- |
| 触发 | 需要状态变化 | 可自动播放 |
| 关键帧 | 仅起止两点 | 多个关键帧 |
| 循环 | 不支持 | 支持 |
| 暂停 | 不支持 | \`animation-play-state\` |
| 适用 | 简单过渡 | 复杂动画 |

## 性能建议

优先动画 \`transform\` 和 \`opacity\`（只触发合成），避免动画 \`top/left/width\` 等触发布局的属性。`
  },
  {
    id: 'css-008',
    category: 'css',
    title: '响应式布局有哪些常见方案？',
    difficulty: '中等',
    tags: ['响应式', '媒体查询', 'rem', 'vw'],
    answer: `## 1. 媒体查询 @media

根据视口宽度应用不同样式：

\`\`\`css
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}
\`\`\`

## 2. 弹性单位

- **百分比 %**：相对父元素。
- **rem / em**：相对根字号 / 父字号。rem 适合做整体缩放。
- **vw / vh / vmin / vmax**：相对视口，适合全屏自适应。

## 3. Flexbox

一维弹性布局，适合组件内自适应排列：

\`\`\`css
.row { display: flex; flex-wrap: wrap; gap: 16px; }
.item { flex: 1 1 200px; }
\`\`\`

## 4. CSS Grid

二维布局，适合整体页面结构，配合 \`minmax\` / \`auto-fit\` 实现自适应列数：

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
\`\`\`

## 5. 容器查询 @container

根据**父容器**宽度响应（而非视口），组件级响应式更精准：

\`\`\`css
.card-container { container-type: inline-size; }
@container (min-width: 400px) { .card { ... } }
\`\`\`

## 6. 图片自适应

\`\`\`css
img { max-width: 100%; height: auto; }
<picture> 配合 <source> 做断点图片
\`\`\`

## 实践

通常组合使用：Grid/Flex 做布局骨架 + 媒体查询/容器查询做断点微调 + rem/vw 做字号缩放。`
  },
  {
    id: 'css-009',
    category: 'css',
    title: 'CSS 中 position 各值的区别？',
    difficulty: '简单',
    tags: ['position', '定位'],
    answer: `## 五种取值

| 值 | 定位参照 | 是否脱离文档流 | 说明 |
| --- | --- | --- | --- |
| \`static\`（默认） | 无 | 否 | 按 normal flow 排列，top/left 无效 |
| \`relative\` | 自身原位置 | 否 | 相对原位置偏移，原位置仍保留 |
| \`absolute\` | 最近的非 static 祖先 | 是 | 相对定位祖先定位，无则相对初始包含块 |
| \`fixed\` | 视口（或 transform 祖先） | 是 | 固定在视口位置 |
| \`sticky\` | 最近滚动祖先 | 否（滚动到阈值前为 relative，到阈值后为 fixed） | 滚动吸顶 |

## 关键点

- \`absolute\` / \`fixed\` 脱离文档流，不占位。
- \`sticky\` 需指定 \`top/left\` 等阈值才生效；父级不能 \`overflow: hidden\` 否则失效。
- \`fixed\` 在祖先有 \`transform\` / \`filter\` / \`will-change\` 时，参照物变为该祖先（坑点）。
- 设置 \`z-index\` 只对非 static 的定位元素（及 flex/grid 项）生效。

## sticky 吸顶示例

\`\`\`css
.header { position: sticky; top: 0; z-index: 10; }
\`\`\``
  },
  {
    id: 'css-010',
    category: 'css',
    title: 'CSS Grid 布局的核心概念与常用属性？',
    difficulty: '中等',
    tags: ['Grid', '布局', '二维'],
    answer: `## 什么是 Grid

CSS Grid 是**二维布局**系统，可同时控制行和列，适合整体页面结构与复杂网格。

## 核心概念

- **容器（container）**：\`display: grid\` 的元素。
- **项目（item）**：容器的直接子元素。
- **行 / 列轨道**：由 \`grid-template-rows\` / \`grid-template-columns\` 定义。
- **单元格 / 区域（area）**：交叉形成的格子，可命名组合。
- **间距**：\`gap\`（行列间距）。
- **网格线**：行列的编号线，从 1 开始。

## 常用属性

### 容器

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);     /* 3 等宽列 */
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  justify-items: center;   /* 单元格内水平对齐 */
  align-items: center;     /* 垂直对齐 */
  justify-content: center; /* 整个网格在容器内水平 */
  align-content: center;
}
\`\`\`

### 项目

\`\`\`css
.item {
  grid-column: 1 / 3;       /* 从第 1 条线到第 3 条线（跨 2 列） */
  grid-row: 1 / span 2;     /* 跨 2 行 */
  grid-area: header;        /* 命名区域 */
}
\`\`\`

## 自适应列数（最实用）

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
\`\`\`

- \`auto-fit\`：自动填充列数，容器变宽时自动增加列，无需媒体查询。
- \`minmax(240px, 1fr)\`：每列最小 240px、最大平分剩余。

## 命名区域布局

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
}
.header { grid-area: header; }
\`\`\`

## Grid vs Flexbox

- **Flex**：一维（行或列），适合组件内对齐与流式排列。
- **Grid**：二维，适合整体布局、不规则网格。
- 常组合使用：Grid 做页面骨架，Flex 做组件内部。`
  },
  {
    id: 'css-011',
    category: 'css',
    title: '什么是层叠上下文（stacking context）与 z-index？',
    difficulty: '困难',
    tags: ['层叠上下文', 'z-index', '定位'],
    answer: `## 层叠上下文

页面上元素的渲染顺序由**层叠上下文**决定。层叠上下文是一个三维概念，某些元素会形成独立的层叠上下文，其内部子元素的 z-index 只在该上下文内比较。

## 形成层叠上下文的条件

- 根元素 \`<html>\`。
- \`position\` 为 \`absolute / relative\` 且 \`z-index\` 不为 \`auto\`。
- \`position: fixed / sticky\`。
- \`opacity\` 小于 1。
- \`transform / filter / perspective / will-change\` 不为 \`none\`。
- \`mix-blend-mode\` 不为 \`normal\`。
- \`isolation: isolate\`。
- \`contain: layout / paint\`。

## z-index 生效前提

\`z-index\` **只对定位元素（非 static）或 flex/grid 项生效**，否则即使设了也不起作用。

## 层叠顺序（同一上下文内，从低到高）

1. 背景与边框（层叠上下文自身）。
2. 负 z-index 子元素。
3. block 级元素（正常流）。
4. float 元素。
5. inline 元素。
6. z-index: auto / 0 的定位元素。
7. 正 z-index 定位元素（值越大越在上）。

## 经典坑

\`\`\`html
<div class="A" style="position:relative; z-index:1">
  <div class="A-child" style="position:relative; z-index:999"></div>
</div>
<div class="B" style="position:relative; z-index:2"></div>
\`\`\`

- A-child 的 z-index 999 很大，但它在 A 的层叠上下文内。
- A 的 z-index 是 1，B 是 2，B 整体在 A 之上。
- 所以 **A-child 会被 B 遮挡**，无论它的 z-index 多大。

## 解决

- 把需要置顶的元素提到与比较对象同一层叠上下文。
- 或给父级设 \`isolation: isolate\` 隔离，避免内部 z-index 外泄影响。
- 理解"层叠上下文是层级隔离的"，z-index 不能跨上下文比较。`
  },
  {
    id: 'css-012',
    category: 'css',
    title: 'CSS 变量（自定义属性）的用法与优势？',
    difficulty: '简单',
    tags: ['CSS变量', '自定义属性', '主题'],
    answer: `## 定义与使用

\`\`\`css
:root {
  --brand: #42b883;
  --radius: 10px;
}
.btn {
  background: var(--brand);
  border-radius: var(--radius, 4px);  /* 第二参数为默认值 */
}
\`\`\`

## 与预处理器变量的区别

| | CSS 变量 | Sass/Less 变量 |
| --- | --- | --- |
| 运行时 | 是（动态） | 否（编译期替换） |
| 作用域 | 跟随 DOM 层级 | 静态作用域 |
| 媒体查询内可变 | ✅ | ❌ |
| JS 可读写 | ✅ | ❌ |
| 浏览器原生 | ✅ | 需编译 |

## 优势

1. **主题切换**：切换 \`data-theme\` 即可全局换肤，无需重新编译。
2. **响应式**：媒体查询内重定义变量，所有引用处自动更新。
   \`\`\`css
   :root { --gap: 24px; }
   @media (max-width: 768px) { :root { --gap: 12px; } }
   \`\`\`
3. **JS 联动**：动态修改变量驱动样式。
   \`\`\`js
   document.documentElement.style.setProperty('--brand', color)
   \`\`\`
4. **继承与作用域**：子元素继承父级变量，可局部覆盖。

## 注意

- 必须以 \`--\` 开头，区分大小写。
- \`var()\` 不能用于属性名，只能用于值。
- 存在细微性能开销（动态计算），但通常可忽略。
- 兼容性良好（IE 不支持，现代浏览器全支持）。`
  },
  {
    id: 'css-013',
    category: 'css',
    title: '如何实现一个三角形 / 气泡？',
    difficulty: '简单',
    tags: ['三角形', 'border', '技巧'],
    answer: `## 原理

利用 \`border\` 在宽高为 0 时呈现为三角形：四条 border 交汇于中心，每条是一个三角形。

\`\`\`css
.triangle-up {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 50px solid #42b883;
  /* 上 / 左 / 右透明，只显示下边 → 向上的三角形 */
}
\`\`\`

## 不同方向

- 向上：\`border-bottom\` 有色，其余透明。
- 向下：\`border-top\` 有色。
- 向左 / 右：对应 \`border-right / border-left\` 有色。

## 直角三角形

\`\`\`css
.right-tri {
  width: 0;
  height: 0;
  border-top: 50px solid #42b883;
  border-left: 50px solid transparent;
}
\`\`\`

## 现代方案：clip-path

更灵活，可任意多边形：

\`\`\`css
.triangle {
  width: 100px;
  height: 100px;
  background: #42b883;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
\`\`\`

## 气泡（带小三角）

容器 + \`::before\` 伪元素做三角，定位到边缘：

\`\`\`css
.bubble {
  position: relative;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
}
.bubble::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 20px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #ddd;
}
\`\`\``
  },
  {
    id: 'css-014',
    category: 'css',
    title: 'CSS 中 margin 折叠（合并）的规则与避免方法？',
    difficulty: '中等',
    tags: ['margin折叠', 'margin', '布局'],
    answer: `## 什么是 margin 折叠

相邻块级元素的**垂直外边距**会合并（取较大值），而非叠加。仅发生在**垂直方向**的**块级元素**之间。

## 三种折叠场景

### 1. 相邻兄弟

\`\`\`css
.a { margin-bottom: 20px; }
.b { margin-top: 30px; }
/* 两者间距 = 30px（取大），不是 50px */
\`\`\`

### 2. 父与第一个/最后一个子元素

\`\`\`html
<div class="parent">
  <div class="child" style="margin-top: 30px"></div>
</div>
\`\`\`

若无 border / padding / inline-block 隔离，子元素的 \`margin-top\` 会"穿透"到父元素外部，表现为父元素顶部有 30px 外边距。

### 3. 空块元素

空元素的 \`margin-top\` 与 \`margin-bottom\` 自身折叠。

## 折叠规则

- 取两者中**较大值**（都为负则取绝对值较大的负值）。
- 同号相加？**不是**，是取大值。
- 仅垂直方向，水平不折叠。
- 仅块级元素，inline / inline-block / flex / grid 项不折叠。

## 如何避免

1. **触发 BFC**：父元素 \`overflow: hidden\`、\`display: flow-root\`（推荐，无副作用）。
2. **父元素加 border / padding**：阻断父子折叠。
3. **用 padding 代替 margin**。
4. **使用 flex / grid 布局**：flex / grid 项之间不发生 margin 折叠。
5. **浮动 / 绝对定位**元素不参与折叠。

\`\`\`css
.parent {
  display: flow-root;   /* 创建 BFC，阻止子 margin 穿透 */
}
\`\`\`

## 实践

- 现代布局多用 flex/grid，margin 折叠问题大大减少。
- 遇到间距异常（比预期小），先想到 margin 折叠。`
  },
  {
    id: 'css-015',
    category: 'css',
    title: '1px 问题（移动端细线）如何解决？',
    difficulty: '中等',
    tags: ['1px', '移动端', '边框'],
    answer: `## 问题来源

移动端 \`devicePixelRatio\` 通常是 2 或 3，CSS 的 \`1px\` 在物理屏幕上对应 2~3 个物理像素，渲染出来的边框看起来偏粗。设计师期望的"1 物理像素细线"用 CSS \`1px\` 做不到。

## 常见方案

### 1. transform 缩放（推荐）

用伪元素画 200% / 300% 高度的元素再缩放：

\`\`\`css
.hairline {
  position: relative;
}
.hairline::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 1px;
  background: #ccc;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}
\`\`\`

- DPR=2 缩放 0.5，DPR=3 缩放 0.333。
- 配合 media query 按动态比缩放更精准。

### 2. viewport 缩放

动态修改 \`<meta viewport>\` 的 \`scale\`，整体缩放后再放大字体 / 布局补偿（rem 方案）。较复杂，老项目用得多。

### 3. border-image / 渐变背景

\`\`\`css
.border {
  border: 1px solid transparent;
  border-image: linear-gradient(#ccc, #ccc) 1;
}
\`\`\`

### 4. box-shadow 模拟

\`\`\`css
.line { box-shadow: 0 0.5px 0 #ccc; }
\`\`\`

- 简单，但部分安卓机型不支持小数 shadow。

## 推荐实践

- 用 \`transform: scaleY()\` 伪元素方案，兼容性与效果最好。
- 现代项目可考虑直接用 CSS \`0.5px\`（Safari / 新 Chrome 已支持），但兼容性不全面。`
  },
  {
    id: 'css-016',
    category: 'css',
    title: 'CSS 媒体查询与容器查询的区别？',
    difficulty: '中等',
    tags: ['媒体查询', '容器查询', '响应式'],
    answer: `## 媒体查询 @media

根据**视口（viewport）**尺寸响应，整页级别：

\`\`\`css
@media (max-width: 768px) {
  .card { grid-template-columns: 1fr; }
}
\`\`\`

- 依据：浏览器窗口宽度。
- 问题：组件在不同位置被嵌入不同宽度容器时，无法精准适配——同一个组件在宽容器应横向布局、窄容器应纵向，但媒体查询只知道视口宽度。

## 容器查询 @container

根据**父容器**尺寸响应，组件级：

\`\`\`css
.card-container {
  container-type: inline-size;   /* 声明为查询容器 */
}
@container (min-width: 400px) {
  .card { display: flex; }
}
\`\`\`

- 依据：最近的 \`container-type\` 祖先的尺寸。
- 组件可在任何位置自适应：被放进侧栏（窄）就纵向，放进主区（宽）就横向。

## 关键属性

- \`container-type: inline-size\`：基于行内尺寸（宽度）查询（最常用）。
- \`container-type: size\`：基于宽高（需容器有明确尺寸）。
- \`container-name\`：命名容器，便于 \`@container name (min-width: ...)\` 定向查询。

## 区别

| | 媒体查询 | 容器查询 |
| --- | --- | --- |
| 依据 | 视口 | 父容器 |
| 粒度 | 整页 | 组件 |
| 复用性 | 组件依赖外部视口 | 组件自包含 |
| 适用 | 整体布局断点 | 组件级自适应 |

## 实践

- 整体页面骨架用媒体查询。
- 可复用组件用容器查询，使其与放置位置解耦。
- 现代浏览器已普遍支持容器查询（2023 起）。`
  },
  // ===== 以下为补充题目（css-017 ~ css-036）=====
  {
    id: 'css-017',
    category: 'css',
    title: 'CSS 预处理器（Sass / Less / Stylus）有什么区别？现在还需要吗？',
    difficulty: '中等',
    tags: ['预处理器', 'Sass', 'Less', 'Stylus'],
    answer: `## 共同能力

变量、嵌套、混入（mixin）、继承（extend）、函数、模块化 \`@import\`、条件循环等。

## 对比

| | Sass (SCSS) | Less | Stylus |
| --- | --- | --- | --- |
| 语法 | SCSS（兼容 CSS）/ 缩进式 | 类 CSS | 自由（可省括号/分号/冒号） |
| 实现 | Dart Sass（编译） | JS（Less.js） | Node.js |
| 变量 | \`$\` / \`@use\` | \`@\` | 不用前缀 |
| 生态 | 最强（Bootstrap、Vuepress 等） | 较强（antd v3） | 小众 |
| 运行 | 编译为 CSS | 浏览器端可运行 | 编译 |

## 示例（SCSS）

\`\`\`scss
$primary: #1890ff;
@mixin button($bg) {
  background: $bg;
  &:hover { background: darken($bg, 10%); }
}
.btn { @include button($primary); }
\`\`\`

## 现在还需要吗

**原生 CSS 已覆盖大部分能力**：
- 变量 → CSS 自定义属性 \`--x\`（甚至可在运行时改）。
- 嵌套 → CSS Nesting（2023 主流浏览器支持）。
- 模块化 → CSS Modules / \`@import\` / 构建工具。

但预处理器仍在用的优势：
- 复杂的 \`@mixin\` / 函数 / 循环（生成多套主题、栅格）。
- 工程化成熟、团队已有基建。
- \`darken()\` 等颜色函数（CSS 的 \`color-mix()\` / 相对颜色 \`rgb(from ...)\` 也能做，但兼容性新）。

## 选择建议

- 新项目 / 组件库 → 优先原生 CSS + CSS 变量 + 构建（Vite），或 Tailwind/UnoCSS。
- 需要复杂逻辑 / 已有基建 → Sass（生态最好）。
- Less 主要在 antd v4 及之前用，新项目少用；Stylus 小众不推荐新项目。`
  },
  {
    id: 'css-018',
    category: 'css',
    title: 'CSS 组织方案有哪些？CSS Modules / CSS-in-JS / 原子化 CSS（Tailwind/UnoCSS）如何选？',
    difficulty: '中等',
    tags: ['CSS Modules', 'CSS-in-JS', 'Tailwind', 'UnoCSS', '原子化'],
    answer: `## 几种方案

### 1. 传统 CSS / BEM
全局类名 + 命名规范（BEM）。简单但易冲突、难维护。

### 2. CSS Modules
编译期把类名加 hash（\`.btn\` → \`.btn_x7y2k\`），实现**局部作用域**。

\`\`\`jsx
import s from './Button.module.css'
<button className={s.btn}>OK</button>
\`\`\`

- ✅ 零运行时、作用域隔离、学习成本低。
- ❌ 动态样式不方便（需靠 props 切换类名）。

### 3. CSS-in-JS（styled-components / Emotion / Stitches）
在 JS 里写 CSS，享受 JS 的全部能力（变量、条件、props 驱动）。

\`\`\`jsx
const Box = styled.div\`color: \${p => p.danger ? 'red' : 'black'}\`
\`\`\`

- ✅ 动态样式强、与组件耦合、主题方便。
- ❌ 运行时开销（部分库 0-runtime 如 vanilla-extract / Linaria）；SSR 复杂；与 RSC 不兼容。

### 4. 原子化 CSS（Tailwind / UnoCSS / WindiCSS）
预设大量小类，组合使用，**不写自定义 CSS**。

\`\`\`jsx
<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white">OK</button>
\`\`\`

- ✅ 极少写 CSS、产物小（按需生成）、约束设计系统、心智负担低。
- ❌ 类名长、HTML 可读性下降、学习常用类名。

### 5. CSS-in-Template（Vue \`<style scoped>\`）
Vue SFC 内置，编译期加 \`data-v-xxx\` 属性选择器实现作用域。

\`\`\`vue
<style scoped>
.btn { color: red }
</style>
\`\`\`

## 选择建议

| 场景 | 推荐 |
| --- | --- |
| React 新项目，追求极致开发体验 | Tailwind / UnoCSS + CSS Modules（少量动态） |
| Vue 项目 | \`<style scoped>\` + UnoCSS/Tailwind |
| 需要重度动态样式 / 设计系统 | CSS-in-JS（优先 0-runtime：vanilla-extract、Stitches、Panda） |
| 后台管理系统 | Tailwind + 组件库 |
| 大型多人协作 | CSS Modules + 命名规范 |

## 趋势

- 原子化 CSS + CSS 变量 + 原生 CSS Nesting 越来越主流。
- CSS-in-JS 因 RSC（React Server Components）不兼容，热度下降，转向 0-runtime 方案。
- UnoCSS 比 Tailwind 更快、更灵活（预设可组合、按需）。`
  },
  {
    id: 'css-019',
    category: 'css',
    title: '伪类（pseudo-class）和伪元素（pseudo-element）有什么区别？',
    difficulty: '简单',
    tags: ['伪类', '伪元素', '选择器'],
    answer: `## 本质区别

- **伪类**：选择处于**特定状态**的元素（单冒号 \`:hover\`）。它匹配的是已有元素的某种状态。
- **伪元素**：创建**不存在于文档树中的虚拟元素**（双冒号 \`::before\`）。它代表一段原本没有的内容/结构。

## 伪类示例

\`\`\`css
a:visited { color: purple }      /* 访问过的链接 */
input:focus { border-color: blue } /* 获得焦点 */
li:nth-child(odd) { background: #eee } /* 奇数项 */
.btn:not(.disabled) { cursor: pointer } /* 排除 */
:root { --primary: #1890ff }     /* 文档根元素 */
\`\`\`

## 伪元素示例

\`\`\`css
p::first-line { font-weight: bold }   /* 第一行 */
p::first-letter { font-size: 2em }    /* 首字母 */
.clearfix::after {                     /* 在元素内部末尾生成内容 */
  content: '';
  display: block;
  clear: both;
}
.tooltip::before {                     /* 生成气泡箭头 */
  content: '';
  ...
}
::selection { background: yellow }     /* 选中文本 */
::-webkit-scrollbar { width: 8px }     /* 滚动条 */
\`\`\`

## 关键差异

| | 伪类 | 伪元素 |
| --- | --- | --- |
| 语法 | \`:xxx\` | \`::xxx\`（CSS3 起推荐双冒号） |
| 数量 | 一个元素可有多个伪类 | 一个元素每种伪元素只能有一个 |
| 作用 | 匹配状态 | 创建新"虚拟元素" |
| 是否产生新盒子 | 否 | 是（有 content 才生成） |

## 历史遗留

CSS1/CSS2 中伪元素也用单冒号（\`:before\`），CSS3 为了区分改为双冒号。浏览器对 \`:before\` 仍向后兼容，但新代码应写 \`::before\`。

## 注意

- 伪元素必须配合 \`content\` 属性（即使空字符串）才会渲染。
- 伪元素默认是**行内元素**，需要设 \`display: block/inline-block\` 才能设宽高。
- 伪元素生成的内容**不可被选中、不可被屏幕阅读器读取**（部分场景），重要信息不要只放伪元素里。`
  },
  {
    id: 'css-020',
    category: 'css',
    title: '现代 CSS 伪类：:is / :where / :not / :has 各有什么用？',
    difficulty: '中等',
    tags: [':is', ':where', ':not', ':has', '选择器'],
    answer: `## :is() — 分组匹配（带 specificity）

把多个选择器合并，减少重复书写。

\`\`\`css
/* 旧写法 */
header h1, main h1, aside h1 { color: #333 }
/* 新写法 */
:is(header, main, aside) h1 { color: #333 }
\`\`\`

容错：参数里无效选择器会被忽略而不是整条失效。

## :where() — 与 :is 相同，但 specificity 为 0

\`\`\`css
:where(header, main, aside) h1 { color: #333 }
\`\`\`

差异：\`:where\` 的**优先级永远是 0**。用于写"可被轻松覆盖"的默认样式 / 基础样式。

\`\`\`css
/* 默认样式，易被覆盖 */
:where(.card) { padding: 1rem }
.card.special { padding: 2rem }   /* 轻松覆盖，因为上条 specificity = 0 */
\`\`\`

## :not() — 反向匹配

\`\`\`css
/* 排除最后一个元素的边框 */
li:not(:last-child) { border-bottom: 1px solid #eee }

/* CSS4 支持列表 */
button:not(.disabled, .loading) { cursor: pointer }
\`\`\`

注意：\`:not\` 接受选择器列表后，其 specificity 取列表中**最高**的那个。

## :has() — "父选择器"（关系选择器，CSS4）

根据**子元素/后代**的状态来选择父元素，是 CSS 期待已久的能力（2023 主流浏览器支持）。

\`\`\`css
/* 含 img 的卡片加阴影 */
.card:has(img) { box-shadow: 0 2px 8px #0001 }

/* 选中"后面跟着 h2 的 h1" */
h1:has(+ h2) { margin-bottom: 0 }

/* 表单必填项未填时高亮 */
form:has(input:required:invalid) .submit { opacity: .5 }
\`\`\`

甚至能实现以前只能用 JS 的交互：

\`\`\`css
/* 选中状态纯 CSS 实现 */
.checkbox:checked ~ .label { color: green }
\`\`\`

## specificity 总结

| 函数 | 优先级 |
| --- | --- |
| \`:is()\` | 取参数中最高的 |
| \`:not()\` | 取参数中最高的 |
| \`:where()\` | 始终为 0 |
| \`:has()\` | 取参数中最高的 |

## 小结

- \`:is\` 简化分组；\`:where\` 写易覆盖的默认样式；\`:not\` 排除；\`:has\` 实现父子关系。
- 用好这四个函数可以大幅减少重复 CSS 和对 JS 的依赖。
- 注意兼容性：\`:has\` 较新（2023 起），老项目需确认浏览器支持或加 fallback。`
  },
  {
    id: 'css-021',
    category: 'css',
    title: '实现三栏布局（左定宽、右定宽、中间自适应）有哪些方案？',
    difficulty: '中等',
    tags: ['三栏布局', '圣杯', '双飞翼', 'Flex', 'Grid'],
    answer: `需求：左、右两栏定宽，中间自适应且**中间内容优先渲染**（HTML 中间栏在前）。

## 1. Flex（最简单现代方案）

\`\`\`html
<div class="container">
  <div class="center">中间</div>
  <div class="left">左</div>
  <div class="right">右</div>
</div>
\`\`\`

\`\`\`css
.container { display: flex }
.center { flex: 1; order: 2 }      /* 自适应，排中间 */
.left { width: 200px; order: 1 }
.right { width: 200px; order: 3 }
\`\`\`

## 2. Grid

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
.center { order: 2 }
.left { order: 1 }
.right { order: 3 }
\`\`\`

\`1fr\` 自适应剩余空间。

## 3. 圣杯布局（经典，float + 负 margin）

\`\`\`css
.container { padding: 0 200px }
.center { width: 100%; float: left }
.left { width: 200px; float: left; margin-left: -100%; position: relative; left: -200px }
.right { width: 200px; float: left; margin-left: -200px; position: relative; right: -200px }
\`\`\`

原理：中间栏 100% 宽，左右栏用负 margin 拉到同一行，再用 relative 偏移到两侧 padding 区。

## 4. 双飞翼布局（经典，中间栏再加一层）

\`\`\`css
.center { width: 100%; float: left }
.center-inner { margin: 0 200px }   /* 内容区留出左右 */
.left { width: 200px; float: left; margin-left: -100% }
.right { width: 200px; float: left; margin-left: -200px }
\`\`\`

与圣杯区别：双飞翼不在外层 padding，而是在中间栏**内部加一层**用 margin 让出空间，避免 relative 定位，更稳健。

## 5. 绝对定位

\`\`\`css
.container { position: relative }
.center { margin: 0 200px }
.left { position: absolute; left: 0; top: 0; width: 200px }
.right { position: absolute; right: 0; top: 0; width: 200px }
\`\`\`

简单，但父元素高度需处理（绝对定位脱离文档流），且中间栏不能比侧栏矮。

## 选择建议

- **现代项目**：Flex / Grid，代码少、易维护。
- 圣杯/双飞翼是面试经典，理解 float + 负 margin 的原理即可，实际很少用。
- 绝对定位适合侧栏定高的简单场景。

## 中间优先渲染的意义

把 center 放 HTML 最前，可以让主要内容先下载渲染，提升首屏体验（SEO 也更友好）。Flex/Grid 用 \`order\` 调整视觉顺序即可。`
  },
  {
    id: 'css-022',
    category: 'css',
    title: '隐藏元素有几种方式？它们的区别是什么？',
    difficulty: '中等',
    tags: ['隐藏元素', 'display', 'visibility', 'opacity', 'hidden'],
    answer: `## 常见方式

### 1. display: none

\`\`\`css
.hidden { display: none }
\`\`\`

- **不占据空间**，从渲染树移除。
- **不响应事件**。
- 不会触发过渡动画。
- 子元素一并隐藏，且子元素设 \`display: block\` 也无法显示。
- 引发**回流**（重排）。

### 2. visibility: hidden

\`\`\`css
.hidden { visibility: hidden }
\`\`\`

- **仍占据空间**（保持布局）。
- 不响应事件。
- **只引发重绘**，性能比 display 好。
- 子元素可单独设 \`visibility: visible\` 显示出来。
- 可触发过渡（\`visibility\` 是可动画属性）。

### 3. opacity: 0

\`\`\`css
.hidden { opacity: 0 }
\`\`\`

- **仍占据空间**。
- **仍然响应事件**（点击、hover 都生效！）。
- 可触发过渡/动画，常用于淡入淡出。
- 只引发重绘（合成）。

### 4. transform / position 移出视口

\`\`\`css
.hidden { transform: translateX(-9999px) }
/* 或 */
.hidden { position: absolute; left: -9999px }
\`\`\`

- 元素仍在文档流中（transform 不影响布局）或脱离（absolute）。
- 不响应事件（移出视口）。
- 常用于"屏幕阅读器可见、视觉隐藏"的无障碍文本。

### 5. clip-path / clip

\`\`\`css
.hidden { clip-path: circle(0) }
\`\`\`

- 元素仍在布局中，但视觉上裁剪掉。
- 不响应事件（裁剪区外）。

### 6. hidden 属性（HTML5）

\`\`\`html
<div hidden>不可见</div>
\`\`\`

等价于 \`display: none\`，但语义化，屏幕阅读器也忽略。可被 CSS \`display: block\` 覆盖。

### 7. content-visibility: hidden（新）

\`\`\`css
.hidden { content-visibility: hidden }
\`\`\`

跳过内容渲染，提升性能（长列表场景）。

## 对比表

| 方式 | 占空间 | 响应事件 | 触发动画 | 性能 |
| --- | --- | --- | --- | --- |
| \`display: none\` | ❌ | ❌ | ❌ | 回流 |
| \`visibility: hidden\` | ✅ | ❌ | ✅ | 重绘 |
| \`opacity: 0\` | ✅ | ✅ | ✅ | 合成（最佳） |
| \`transform\` 移出 | ✅ | ❌ | ✅ | 合成 |
| \`clip-path\` | ✅ | ❌ | ✅ | 重绘 |
| \`hidden\` 属性 | ❌ | ❌ | ❌ | 回流 |

## 无障碍"视觉隐藏"技巧

需要让**屏幕阅读器读但视觉不可见**的文本（如图标按钮的说明）：

\`\`\`css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\`\`\`

## 选择建议

- 完全移除 → \`display: none\` 或 \`hidden\` 属性。
- 需要动画淡入淡出 → \`opacity\` + \`visibility\` 组合（opacity 动画，visibility 控制事件）。
- 频繁切换、性能敏感 → \`visibility\` / \`opacity\` / \`transform\`（避免 reflow）。
- 无障碍隐藏文本 → \`.sr-only\`。`
  },
  {
    id: 'css-023',
    category: 'css',
    title: '清除浮动有哪些方式？为什么需要清除浮动？',
    difficulty: '中等',
    tags: ['清除浮动', 'float', 'clearfix', 'BFC'],
    answer: `## 为什么需要清除浮动

子元素全部 \`float\` 后会**脱离文档流**，父元素高度坍塌（height 变 0），导致后续布局错乱。

\`\`\`html
<div class="parent">
  <div class="child" style="float:left">1</div>
  <div class="child" style="float:left">2</div>
</div>
<!-- parent 高度坍塌，下方元素会顶上来重叠 -->
\`\`\`

## 方式 1：额外标签法（不推荐）

在末尾加一个空标签清除浮动：

\`\`\`html
<div style="clear: both"></div>
\`\`\`

缺点：引入无语义的冗余标签。

## 方式 2：父元素触发 BFC

\`\`\`css
.parent { overflow: hidden }   /* 或 auto/scroll */
/* 或 */
.parent { display: flow-root }  /* 现代推荐，专为清除浮动设计，无副作用 */
\`\`\`

原理：BFC 计算高度时会包含浮动子元素。\`display: flow-root\` 是最干净的方案（无 overflow 副作用）。

## 方式 3：::after 伪元素 clearfix（最常用）

\`\`\`css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
\`\`\`

\`\`\`html
<div class="parent clearfix">...</div>
\`\`\`

## 方式 4：现代 clearfix（兼容更好）

\`\`\`css
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
}
.clearfix::after { clear: both }
.clearfix { *zoom: 1 }   /* 触发 hasLayout，IE6/7 兼容，现代可去掉 */
\`\`\`

\`::before\` 防止 margin 折叠，\`display: table\` 生成匿名表格。

## 方式 5：直接给父元素设固定高度

\`\`\`css
.parent { height: 100px; overflow: hidden }
\`\`\`

简单但不灵活，不推荐。

## 现代还需要清除浮动吗

**实际上，flex / grid 时代几乎不用 float 做布局了**。float 现在主要用于：
- 文字环绕图片（\`img { float: left }\`）。
- 少量兼容旧代码。

flex/grid 容器会自动撑开高度，不存在坍塌问题：

\`\`\`css
.parent { display: flex }   /* 子元素无需 float，父元素自动撑高 */
\`\`\`

## 选择建议

- 新项目直接用 flex/grid，**不用 float 布局**，也就不用清除浮动。
- 老代码维护用 \`::after\` clearfix。
- 单纯清除浮动（无副作用）→ \`display: flow-root\`。
- 面试要求能手写 \`::after\` clearfix 版本。`
  },
  {
    id: 'css-024',
    category: 'css',
    title: '如何实现单行 / 多行文本溢出省略号？',
    difficulty: '简单',
    tags: ['文本溢出', '省略号', 'ellipsis', 'line-clamp'],
    answer: `## 单行省略

\`\`\`css
.ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
\`\`\`

三个属性缺一不可：
- \`white-space: nowrap\`：不换行。
- \`overflow: hidden\`：溢出隐藏。
- \`text-overflow: ellipsis\`：溢出处显示 \`...\`。

## 多行省略（标准 line-clamp）

\`\`\`css
.ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;     /* 显示行数 */
  overflow: hidden;
}
\`\`\`

- \`display: -webkit-box\` + \`-webkit-box-orient: vertical\` 是旧 flexbox 的盒子模型。
- \`-webkit-line-clamp\` 早期是 WebKit 私有，现已标准化为 \`line-clamp\`（但浏览器仍普遍用带前缀写法）。
- 兼容性：现代浏览器都支持，包括 Firefox、Safari。

## 纯标准写法（兼容性新）

\`\`\`css
.ellipsis-2 {
  line-clamp: 2;
  /* 仍需配合 -webkit-box 写法，纯 line-clamp 浏览器支持还不全 */
}
\`\`\`

实际项目里**仍推荐 -webkit- 前缀写法**，兼容性最好。

## 注意事项

1. **多行省略的 \`...\` 位置**：浏览器在最后一行末尾截断，无法自定义（如想加"展开"按钮需用 JS 测量）。
2. **高度计算**：多行省略时不要写死 \`height\`，让它由行高 × 行数决定，否则可能截断不完整。
3. **包含 HTML 标签**：line-clamp 对纯文本生效，标签内的换行 \`<br>\` 等可能影响效果。
4. **英文长单词**：单行省略对超长单词（URL）可能不截断，需配合 \`word-break: break-all\` 或 \`overflow-wrap: break-word\`。

\`\`\`css
.ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;   /* 长单词也能断开 */
}
\`\`\`

## "展开/收起"实现思路

纯 CSS 较难精确判断是否溢出，常用 JS：

\`\`\`js
const el = document.querySelector('.text')
const isOverflow = el.scrollHeight > el.clientHeight
if (isOverflow) showExpandButton()
\`\`\`

点击展开时去掉 \`-webkit-line-clamp\` 即可。`
  },
  {
    id: 'css-025',
    category: 'css',
    title: '如何用 CSS 绘制常见图形（三角形、圆形、扇形、梯形）？',
    difficulty: '中等',
    tags: ['图形', '三角形', 'border', 'clip-path', 'transform'],
    answer: `## 三角形（经典 border 法）

利用边框交接处的 45° 切角，把其他三条边设为透明：

\`\`\`css
.triangle-up {
  width: 0; height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}
\`\`\`

原理：宽高为 0，四条 border 拼成四个三角形，只显示底部那条。

## 圆形

\`\`\`css
.circle {
  width: 100px; height: 100px;
  border-radius: 50%;
  background: red;
}
\`\`\`

\`border-radius: 50%\` 让正方形变圆。若是矩形会变椭圆。

## 扇形

### 方法 1：border-radius 配合隐藏边

\`\`\`css
.sector {
  width: 0; height: 0;
  border: 100px solid transparent;
  border-top-color: red;
  border-radius: 100px;   /* 圆角 */
}
\`\`\`

### 方法 2：conic-gradient（推荐，精确角度）

\`\`\`css
.sector {
  width: 200px; height: 200px;
  border-radius: 50%;
  background: conic-gradient(red 0 90deg, transparent 90deg);
}
\`\`\`

90° 扇形。改角度即可。

## 梯形

\`\`\`css
.trapezoid {
  width: 100px; height: 0;
  border-bottom: 100px solid red;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
}
\`\`\`

与三角形同理，保留底部 border 的宽度即可。

## 平行四边形

\`\`\`css
.parallelogram {
  width: 150px; height: 100px;
  transform: skewX(-20deg);
  background: red;
}
\`\`\`

注意：skew 会让内容也倾斜，可在子元素反向 skew 矫正：

\`\`\`css
.parallelogram > span { display: inline-block; transform: skewX(20deg) }
\`\`\`

## 五角星 / 心形等复杂图形

用 \`clip-path\` 或 SVG。

\`\`\`css
.star {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
\`\`\`

## 现代：clip-path 通用方案

\`\`\`css
/* 任意多边形 */
.shape { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }

/* 圆形 */
.shape { clip-path: circle(50% at 50% 50%) }

/* 椭圆 */
.shape { clip-path: ellipse(50% 30% at 50% 50%) }
\`\`\`

## 小结

- 简单三角形/梯形 → border 法（兼容性最好）。
- 圆/椭圆 → \`border-radius\`。
- 扇形/饼图 → \`conic-gradient\`。
- 复杂多边形 → \`clip-path\`（注意兼容性，必要时可降级 SVG）。
- 倾斜类 → \`transform: skew\`。
- 面试常考三角形 border 法原理，务必理解"边框交接 45° 切角"。`
  },
  {
    id: 'css-026',
    category: 'css',
    title: 'filter 和 backdrop-filter 有什么区别？使用时有什么注意点？',
    difficulty: '中等',
    tags: ['filter', 'backdrop-filter', '滤镜', '性能'],
    answer: `## filter：对元素本身应用滤镜

作用于**元素自身的渲染结果**（包括内容、背景、边框）。

\`\`\`css
.img {
  filter: blur(4px) grayscale(50%) brightness(1.2);
}
\`\`\`

常用函数：
- \`blur(px)\`：高斯模糊。
- \`brightness()\` / \`contrast()\` / \`saturate()\`：亮度/对比度/饱和度。
- \`grayscale()\` / \`sepia()\` / \`hue-rotate(deg)\`：色调。
- \`drop-shadow()\`：阴影（沿透明轮廓，比 box-shadow 更贴合 PNG 图形）。
- \`url(svg)\`：引用 SVG 滤镜。

\`\`\`css
/* drop-shadow 适配透明 PNG 轮廓 */
.icon { filter: drop-shadow(2px 2px 2px rgba(0,0,0,.5)) }
\`\`\`

## backdrop-filter：对元素**背后**的内容应用滤镜

毛玻璃（ frosted glass）效果——透过当前元素看到背后内容被模糊/变色。

\`\`\`css
.glass {
  background: rgba(255,255,255,0.3);
  backdrop-filter: blur(10px) saturate(180%);
}
\`\`\`

典型场景：iOS 风格毛玻璃导航栏、弹窗背景模糊。

## 关键区别

| | \`filter\` | \`backdrop-filter\` |
| --- | --- | --- |
| 作用对象 | 元素自身 | 元素背后的内容 |
| 是否需要半透明背景 | 不需要 | **需要**（否则看不到背后） |
| 性能 | 中等 | 较高（需采样背景） |
| 兼容性 | 好 | 较新（需 -webkit- 前缀，Firefox 103+） |

## 注意事项

### 1. backdrop-filter 必须有半透明背景

\`\`\`css
.glass {
  background: rgba(255,255,255,0.2);  /* 半透明才有效果 */
  backdrop-filter: blur(10px);
}
\`\`\`

完全透明或 \`background: transparent\` 在某些浏览器下不触发。

### 2. 性能开销

- 两者都会**创建合成层**，过多使用会占用 GPU 显存。
- \`backdrop-filter\` 需要持续采样背后内容，**滚动时性能更差**。
- 大面积使用 / 低端机 / 复杂页面 → 卡顿。

优化：限制使用区域、加 \`will-change: filter\`、避免在长滚动列表里用。

### 3. 兼容性

- Safari 需要 \`-webkit-backdrop-filter\`。
- 老版 Firefox 不支持，需 fallback：

\`\`\`css
.glass {
  background: rgba(255,255,255,0.8);          /* fallback */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
@supports (backdrop-filter: blur(10px)) {
  .glass { background: rgba(255,255,255,0.2) }  /* 支持时再调透明 */
}
\`\`\`

### 4. filter 引发合成层

\`filter\` 会让元素提升为合成层（类似 \`transform\`），不会引发重排，但首次创建有开销。

### 5. 与 overflow 的关系

\`backdrop-filter\` 元素若父级 \`overflow: hidden\` 且有 \`transform\`，可能渲染异常（已知 bug）。

## 小结

- 改元素自身 → \`filter\`（模糊图片、阴影、变色）。
- 毛玻璃看背后 → \`backdrop-filter\`（导航栏、弹窗）。
- 性能敏感场景慎用，注意加 fallback 和前缀。`
  },
  {
    id: 'css-027',
    category: 'css',
    title: 'GPU 加速与合成层（composite layer）原理？will-change 怎么用？',
    difficulty: '困难',
    tags: ['GPU加速', '合成层', 'will-change', 'transform', '性能'],
    answer: `## 浏览器渲染流水线

\`\`\`
DOM → Style → Layout（布局）→ Paint（绘制）→ Composite（合成）
\`\`\`

- **Layout**：计算元素几何位置（回流/重排）。
- **Paint**：绘制像素到图层（重绘）。
- **Composite**：把多个图层合并输出到屏幕。

**性能代价**：Layout > Paint > Composite。优化目标是把动画尽量只触发 Composite（GPU 完成）。

## 哪些属性只触发合成

\`\`\`css
/* 推荐动画属性（不触发 layout/paint） */
transform: translate / scale / rotate
opacity
filter
\`\`\`

这些属性改变时，浏览器只需在 GPU 上重新合成图层，CPU 几乎无负担。

**避免**动画 \`top/left/width/height/margin\`（触发 layout）和 \`background/color/box-shadow\`（触发 paint）。

## 合成层（Composite Layer）

某些元素会被提升为**独立的合成层**，由 GPU 单独管理，修改时只重绘该层：

触发条件（部分）：
- \`transform: translate3d/translateZ\`（硬件加速 hack）。
- \`will-change: transform/opacity\`。
- \`position: fixed\` + 滚动。
- \`<video>\`、\`<canvas>\`、WebGL。
- 3D \`transform\`。
- \`opacity < 1\` + 动画。
- \`filter\`。

\`\`\`css
.animated {
  transform: translateZ(0);   /* 老 hack：强制提升为合成层 */
  /* 现代写法 */
  will-change: transform;
}
\`\`\`

## will-change 的正确用法

告知浏览器"这个属性将要变化"，让它**提前**为该元素创建合成层、优化。

\`\`\`css
.modal { will-change: transform, opacity }
\`\`\`

### 注意事项

1. **不要滥用**：每个 \`will-change\` 都会占用内存（独立图层），过多会导致**显存爆炸、反而变卡**。
2. **不要长期设置**：应在变化前设置，变化后移除。常配合 JS：

\`\`\`js
el.addEventListener('mouseenter', () => {
  el.style.willChange = 'transform'
})
el.addEventListener('transitionend', () => {
  el.style.willChange = 'auto'   // 用完移除
})
\`\`\`

3. **不要给太多属性**：只写即将变化的 1-2 个。
4. **不要给静态元素设**：没意义的开销。

## 层爆炸（Layer Explosion）

过多元素被提升为合成层，或大元素 + 多层，会导致：
- 显存占用过高（每个层都是位图）。
- 合成开销变大。
- 移动端尤其明显（显存有限）。

排查：Chrome DevTools → Layers 面板查看层数和大小。

## 实战建议

\`\`\`css
/* 动画用 transform/opacity */
.fade { transition: opacity .3s; will-change: opacity }
.slide { transition: transform .3s; will-change: transform }

/* 移动端列表项避免大面积 will-change */
\`\`\`

\`\`\`js
// 主动管理 will-change 生命周期
function beforeAnimate(el) { el.style.willChange = 'transform' }
function afterAnimate(el) { el.style.willChange = 'auto' }
\`\`\`

## 小结

- 动画优先用 \`transform / opacity / filter\`（只触发合成，GPU 加速）。
- \`will-change\` 是"提前告知"，用完要移除，不可滥用。
- \`translateZ(0)\` 是老 hack，现代用 \`will-change\`。
- 过多合成层会导致层爆炸，用 DevTools Layers 面板排查。`
  },
  {
    id: 'css-028',
    category: 'css',
    title: '如何实现暗色模式（Dark Mode）？有哪些方案？',
    difficulty: '中等',
    tags: ['暗色模式', 'prefers-color-scheme', 'CSS变量', '主题'],
    answer: `## 方案 1：CSS 变量 + prefers-color-scheme（推荐）

\`\`\`css
:root {
  --bg: #fff;
  --text: #333;
  --primary: #1890ff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #eee;
    --primary: #40a9ff;
  }
}

body { background: var(--bg); color: var(--text) }
\`\`\`

跟随**系统**设置自动切换。优点：纯 CSS、零 JS、性能好。

## 方案 2：用户手动切换（data-theme 属性）

支持"跟随系统 / 强制亮 / 强制暗"三态切换。

\`\`\`css
:root[data-theme="light"] { --bg: #fff; --text: #333 }
:root[data-theme="dark"] { --bg: #1a1a1a; --text: #eee }
\`\`\`

\`\`\`js
// 用户点击切换
document.documentElement.setAttribute('data-theme', 'dark')
localStorage.setItem('theme', 'dark')   // 持久化
\`\`\`

\`\`\`js
// 初始化：读取用户偏好，否则跟随系统
const saved = localStorage.getItem('theme')
const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
document.documentElement.setAttribute('data-theme', theme)
\`\`\`

## 方案 3：混合（推荐生产用）

\`prefers-color-scheme\` 设默认，\`data-theme\` 覆盖：

\`\`\`css
:root { --bg: #fff; --text: #333 }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #1a1a1a; --text: #eee }
}

/* 用户显式选择覆盖 */
:root[data-theme="dark"] { --bg: #1a1a1a; --text: #eee }
:root[data-theme="light"] { --bg: #fff; --text: #333 }
\`\`\`

## 避免闪烁（FOUC）

页面加载时若主题由 JS 设置，会先显示默认色再切换，闪烁。解决：

\`\`\`html
<head>
  <script>
    // 在 CSS 渲染前同步执行
    const t = localStorage.getItem('theme')
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', t)
  </script>
</head>
\`\`\`

## 方案 4：CSS color-scheme（新）

告知浏览器原生控件的配色，无需为每个控件重写样式：

\`\`\`css
:root { color-scheme: light dark }
:root[data-theme="dark"] { color-scheme: dark }
\`\`\`

滚动条、表单控件、\`<dialog>\` 等会自动适配。

## 设计要点

1. **对比度**：暗色背景文字对比度 ≥ 4.5:1（WCAG AA）。
2. **不用纯黑**：\`#1a1a1a\` 比 \`#000\` 更柔和，减少视觉疲劳。
3. **降低饱和度**：暗色背景上的高饱和色刺眼，主色调暗一点。
4. **图片处理**：可用 \`filter: brightness(.9)\` 让图片在暗色下不刺眼。
5. **阴影调整**：暗色下阴影不明显，改用更深的背景层级区分。
6. **保留语义色**：success/warning/error 色调保持识别度。

## 图片暗色适配

\`\`\`css
@media (prefers-color-scheme: dark) {
  img { opacity: .85; filter: brightness(.9) }
  /* 或为暗色提供单独图片 */
  .logo { content: url(./logo-dark.png) }
}
\`\`\`

## 小结

- 跟随系统 → \`prefers-color-scheme\` + CSS 变量。
- 用户可切换 → \`data-theme\` 属性 + localStorage + 防闪烁脚本。
- 配合 \`color-scheme\` 让原生控件自动适配。
- 注意对比度、饱和度、阴影、图片等设计细节。`
  },
  {
    id: 'css-029',
    category: 'css',
    title: '什么是 CSS 逻辑属性（Logical Properties）？为什么需要它？',
    difficulty: '困难',
    tags: ['逻辑属性', 'margin-inline', 'padding-block', 'RTL', '国际化'],
    answer: `## 物理属性 vs 逻辑属性

- **物理属性**：固定方向，如 \`margin-left\`、\`padding-top\`、\`width\`。
- **逻辑属性**：相对于**书写方向**（writing-mode / direction），如 \`margin-inline-start\`、\`padding-block-start\`。

## 为什么需要

不同语言书写方向不同：
- 英文/中文：\`direction: ltr\`（从左到右），\`writing-mode: horizontal-tb\`。
- 阿拉伯文/希伯来文：\`direction: rtl\`（从右到左）。
- 日文竖排：\`writing-mode: vertical-rl\`。

物理属性（\`margin-left\`）在 RTL 下会出现在**错误的一侧**，需要单独写 RTL 样式。逻辑属性自动适配，一套样式通吃。

## 逻辑属性对照

### inline 轴（行内方向，水平书写时 = 水平）

\`\`\`css
margin-inline-start   /* = margin-left (LTR) / margin-right (RTL) */
margin-inline-end
margin-inline         /* 简写：左右 */
padding-inline-start
border-inline-start
inset-inline-start    /* = left/right */
\`\`\`

### block 轴（块方向，水平书写时 = 垂直）

\`\`\`css
margin-block-start    /* = margin-top */
margin-block-end
padding-block-start
border-block-start
inset-block-start     /* = top */
\`\`\`

### 尺寸

\`\`\`css
inline-size   /* = width（水平书写） */
block-size    /* = height */
\`\`\`

## 示例对比

\`\`\`css
/* 物理属性：LTR 专属，RTL 需重写 */
.card {
  margin-left: 10px;
  padding-right: 20px;
  text-align: left;
}

/* 逻辑属性：自动适配 RTL */
.card {
  margin-inline-start: 10px;   /* LTR 左、RTL 右 */
  padding-inline-end: 20px;
  text-align: start;           /* 替代 left */
}
\`\`\`

只需在根元素设 \`dir="rtl"\`，所有逻辑属性自动镜像：

\`\`\`html
<html dir="rtl">
  <div class="card">...</div>   <!-- 自动 RTL 布局 -->
</html>
\`\`\`

## 简写

\`\`\`css
margin: 10px 20px;               /* 物理：上下10 左右20 */
margin-block: 10px;              /* 逻辑：block 上下 */
margin-inline: 20px;             /* 逻辑：inline 左右 */
margin: logical 10px 20px;       /* 显式逻辑简写（部分支持） */
\`\`\`

## 完整对照表

| 物理 | 逻辑 (LTR) | 逻辑 (RTL) |
| --- | --- | --- |
| \`margin-left\` | \`margin-inline-start\` | \`margin-inline-start\`（实际在右） |
| \`margin-right\` | \`margin-inline-end\` | \`margin-inline-end\`（实际在左） |
| \`margin-top\` | \`margin-block-start\` | \`margin-block-start\` |
| \`width\` | \`inline-size\` | \`inline-size\` |
| \`height\` | \`block-size\` | \`block-size\` |
| \`left\` (inset) | \`inset-inline-start\` | \`inset-inline-start\` |
| \`text-align: left\` | \`text-align: start\` | \`text-align: start\` |
| \`float: left\` | \`float: inline-start\` | \`float: inline-start\` |

## 兼容性

- 现代浏览器（2021+）普遍支持。
- IE 完全不支持。
- 老项目兼容可用 PostCSS 插件自动转换。

## 实践建议

1. **新项目优先用逻辑属性**，特别是组件库，天然支持国际化。
2. \`text-align: start/end\` 替代 \`left/right\`。
3. \`inset\` 简写替代 \`top/right/bottom/left\`：\`inset: 0\`。
4. \`gap\`、\`place-items\` 等本身就是逻辑属性。
5. 不需要国际化的纯中文/英文项目也可以用，未来扩展更方便。

## 小结

- 逻辑属性相对于**书写方向**而非物理方向，一套样式自动适配 LTR/RTL/竖排。
- 关键替换：\`left/right\`→\`inline-start/end\`，\`top/bottom\`→\`block-start/end\`，\`width/height\`→\`inline-size/block-size\`，\`text-align: left\`→\`start\`。
- 组件库、国际化项目必备，新项目建议养成使用习惯。`
  },
  {
    id: 'css-030',
    category: 'css',
    title: 'calc / min / max / clamp 函数怎么用？解决了什么问题？',
    difficulty: '中等',
    tags: ['calc', 'min', 'max', 'clamp', '函数', '响应式'],
    answer: `## calc()：四则运算

支持 + - * /，可混合不同单位。

\`\`\`css
.sidebar { width: calc(100% - 250px) }          /* 全宽减去固定侧栏 */
.box { padding: calc(1rem + 2px) }              /* 混合单位 */
.grid { grid-template-columns: repeat(3, calc(100% / 3)) }
\`\`\`

注意：\`+\` 和 \`-\` 两边必须有空格，\`*\` 和 \`/\` 不要求。

## min()：取最小值

从一组值中取最小的，常用于"最大不超过某值，但优先用流式值"。

\`\`\`css
/* 宽度优先 100%，但屏幕大时不超过 800px */
.container { width: min(100%, 800px) }
/* 等价于：width: 100%; max-width: 800px */
\`\`\`

\`\`\`css
/* 字号随视口缩放，但不超过 24px */
h1 { font-size: min(5vw, 24px) }
\`\`\`

## max()：取最大值

\`\`\`css
/* 宽度优先 100%，但屏幕小时不低于 320px */
.box { width: max(100%, 320px) }
/* 等价于：width: 100%; min-width: 320px */
\`\`\`

## clamp()：夹在区间内

\`clamp(MIN, PREFERRED, MAX)\`，首选值在区间内时用首选，否则取边界。

\`\`\`css
/* 字号最小 16px、首选 4vw、最大 24px */
h1 { font-size: clamp(16px, 4vw, 24px) }
\`\`\`

**流式排版利器**：屏幕小→16px，中等→4vw，屏幕大→24px，全程平滑过渡，无需媒体查询。

\`\`\`css
/* 响应式间距 */
.section { padding: clamp(1rem, 5vw, 3rem) }
\`\`\`

## 实战场景

### 1. 流式排版（无需媒体查询）

\`\`\`css
h1 { font-size: clamp(1.5rem, 2vw + 1rem, 3rem) }
p  { font-size: clamp(1rem, 0.5vw + 0.8rem, 1.25rem) }
\`\`\`

### 2. 全宽减固定栏

\`\`\`css
.main { width: calc(100% - var(--sidebar-width)) }
\`\`\`

### 3. 卡片宽度自适应

\`\`\`css
.card {
  width: clamp(280px, 30vw, 400px);
}
\`\`\`

### 4. 配合 CSS 变量

\`\`\`css
:root { --gap: 1rem }
.grid { gap: calc(var(--gap) * 2) }
\`\`\`

## 与媒体查询对比

| | 媒体查询 | calc/min/max/clamp |
| --- | --- | --- |
| 平滑过渡 | 阶梯式跳变 | 连续平滑 |
| 代码量 | 多断点 | 一行搞定 |
| 单位限制 | 受断点约束 | 可混合 vw/rem/px |
| 兼容性 | 极好 | 较新（2020+主流支持） |

## 注意

1. \`calc()\` 嵌套：\`calc(calc(100% - 20px) / 2)\` 可简化为 \`calc((100% - 20px) / 2)\`。
2. \`calc()\` 内可用 CSS 变量：\`calc(var(--w) * 2)\`。
3. \`min/max/clamp\` 可传多个值：\`min(100vw, 800px, 90%)\`。
4. \`clamp\` 的首选值通常用 \`vw\` + \`rem\` 组合，兼顾视口与根字号。

## 小结

- \`calc\`：单位混合运算。
- \`min\`：上限（替代 max-width）。
- \`max\`：下限（替代 min-width）。
- \`clamp\`：上下限 + 首选值，**流式排版神器**，减少媒体查询。
- 现代响应式布局必备，配合 CSS 变量更灵活。`
  },
  {
    id: 'css-031',
    category: 'css',
    title: 'position: sticky 粘性定位的原理？有哪些常见坑？',
    difficulty: '中等',
    tags: ['sticky', '定位', '粘性', '滚动'],
    answer: `## 原理

\`position: sticky\` 是 \`relative\` 和 \`fixed\` 的结合：元素在**滚动到阈值前**是 relative（占位），**达到阈值后**变为 fixed（吸附），**超出父容器范围后**又恢复 relative（跟随父容器滚出）。

\`\`\`css
.header {
  position: sticky;
  top: 0;          /* 必须指定阈值：top/right/bottom/left 至少一个 */
  z-index: 10;
}
\`\`\`

## 典型场景

- 滚动吸顶导航栏。
- 表头固定，表体滚动。
- 侧边栏吸顶 / 吸底。
- 阅读进度条章节标题。

## 与 fixed 区别

| | \`sticky\` | \`fixed\` |
| --- | --- | --- |
| 脱离文档流 | 否（仍占位） | 是 |
| 参考系 | 最近的滚动容器 + 父元素边界 | 视口（默认） |
| 触发条件 | 滚动到阈值 | 始终 |
| 父元素限制 | 受父容器高度约束 | 不受 |

## 常见坑

### 1. 必须指定 top/right/bottom/left

\`\`\`css
.sticky { position: sticky }        /* ❌ 不生效，没有阈值 */
.sticky { position: sticky; top: 0 } /* ✅ */
\`\`\`

### 2. 父元素 overflow 非 visible 则失效

最常见的失效原因：**任一祖先** \`overflow: hidden/auto/scroll\` 会让 sticky 相对该祖先滚动，如果该祖先没有滚动空间，看起来就像失效。

\`\`\`css
.parent { overflow: hidden }   /* ⚠️ sticky 子元素可能失效 */
\`\`\`

排查：往上找所有祖先的 \`overflow\`，确认 sticky 元素的滚动容器是预期的那个。

### 3. 父元素高度不够

sticky 的吸附范围是**父元素的内容区**。若父元素高度 = 子元素高度（无多余空间），sticky 没有吸附空间，看起来失效。

\`\`\`html
<div style="height: 100px">    <!-- 父元素太矮 -->
  <div style="position: sticky; top: 0">吸顶</div>
</div>
\`\`\`

### 4. 同一滚动容器内多个 sticky 叠加

多个 sticky 元素会**叠在一起**而非依次替换。需要 JS 或巧妙结构实现"替换式"吸顶。

### 5. 父元素有 transform/filter

\`transform\` / \`filter\` / \`will-change\` 会创建**包含块**，sticky 的参考系变成该祖先而非视口，可能行为异常。

### 6. 与 flex/grid 配合

flex 容器的子元素设 sticky 时，需注意 \`align-items: stretch\` 会拉伸高度，可能影响吸附效果。可设 \`align-self: flex-start\`。

## 实战技巧

### 表头固定

\`\`\`css
thead th {
  position: sticky;
  top: 0;
  background: #fff;   /* 必须设背景，否则透出表格内容 */
  z-index: 1;
}
\`\`\`

### 多级吸顶（导航 + 子导航）

\`\`\`css
.nav   { position: sticky; top: 0; z-index: 2 }
.subnav { position: sticky; top: 56px; z-index: 1 }   /* 56px = nav 高度 */
\`\`\`

### 滚动监听激活状态

sticky 元素本身不触发滚动事件，监听 \`scroll\` + \`getBoundingClientRect\` 判断是否吸附。

## 兼容性

现代浏览器普遍支持（2020+）。老版本 Safari 需要 \`-webkit-sticky\`：

\`\`\`css
.header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
\`\`\`

## 小结

- sticky = relative + fixed，吸附于阈值与父容器之间。
- 必须设阈值（top 等）；**祖先 overflow** 是最常见的失效原因。
- 父元素要有足够高度；注意 flex/grid/transform 的影响。
- 替代了大量 JS 滚动监听吸顶逻辑，性能更好。`
  },
  {
    id: 'css-032',
    category: 'css',
    title: 'CSS 渐变（linear / radial / conic）怎么用？各有什么应用？',
    difficulty: '中等',
    tags: ['渐变', 'linear-gradient', 'radial-gradient', 'conic-gradient'],
    answer: `## 三种渐变

### 1. linear-gradient 线性渐变

\`\`\`css
.bg { background: linear-gradient(to right, red, blue) }
/* 或用角度 */
.bg { background: linear-gradient(45deg, red, blue) }
/* 多色 + 位置 */
.bg { background: linear-gradient(90deg, red 0%, yellow 50%, green 100%) }
\`\`\`

- \`to right\` / \`to bottom right\` / \`0deg~360deg\`。
- 0deg 向上，90deg 向右，顺时针。

### 2. radial-gradient 径向渐变

从中心向外辐射。

\`\`\`css
.bg { background: radial-gradient(circle, red, blue) }
/* 椭圆 + 大小 */
.bg { background: radial-gradient(ellipse 50% 50% at 30% 30%, red, blue) }
\`\`\`

- \`circle\` / \`ellipse\`。
- \`at X Y\` 指定圆心。

### 3. conic-gradient 锥形渐变

围绕中心点旋转。

\`\`\`css
.bg { background: conic-gradient(red, yellow, green, blue, red) }
/* 从指定角度开始 */
.bg { background: conic-gradient(from 0deg at 50% 50%, red 0 90deg, blue 90deg 360deg) }
\`\`\`

## 实用应用

### 1. 渐变文字

\`\`\`css
.gradient-text {
  background: linear-gradient(90deg, #f00, #ff0, #0f0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;     /* 文字本身透明，露出背景 */
}
\`\`\`

### 2. 渐变边框（border-image）

\`\`\`css
.box {
  border: 2px solid;
  border-image: linear-gradient(90deg, #f00, #00f) 1;
}
\`\`\`

### 3. 锥形渐变做饼图

\`\`\`css
.pie {
  border-radius: 50%;
  background: conic-gradient(red 0 30%, blue 30% 70%, green 70% 100%);
}
\`\`\`

无 JS 实现饼图，配合 CSS 变量可动态：

\`\`\`css
.pie { background: conic-gradient(red var(--p), transparent 0) }
\`\`\`

### 4. 棋盘格背景（透明背景占位）

\`\`\`css
.checker {
  background:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
}
\`\`\`

### 5. 加载动画（渐变 + 动画）

\`\`\`css
.loading {
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  to { background-position: -200% 0 }
}
\`\`\`

骨架屏 shimmer 效果。

### 6. 渐变遮罩

\`\`\`css
.fade-out {
  -webkit-mask: linear-gradient(to bottom, #000 70%, transparent);
  mask: linear-gradient(to bottom, #000 70%, transparent);
}
\`\`\`

底部渐隐效果。

## 多重渐变叠加

\`\`\`css
.bg {
  background:
    linear-gradient(to bottom, transparent, #000),   /* 暗角 */
    url(photo.jpg);                                  /* 图片 */
}
\`\`\`

多个 background 用逗号分隔，**前面的在上层**。

## 重复渐变

\`\`\`css
.stripes { background: repeating-linear-gradient(45deg, #000 0 10px, #fff 10px 20px) }
.dots   { background: repeating-radial-gradient(circle, #000 0 5px, #fff 5px 10px) }
\`\`\`

斑马线、点阵。

## 小结

- \`linear\` 线性、\`radial\` 径向、\`conic\` 锥形。
- 渐变是 \`background-image\`，可与背景色、图片叠加。
- 应用：渐变文字、饼图、棋盘格、骨架屏 shimmer、遮罩、渐变边框。
- 配合 CSS 变量和动画可实现丰富的纯 CSS 效果。`
  },
  {
    id: 'css-033',
    category: 'css',
    title: 'clip-path 和 mask 有什么用？两者有什么区别？',
    difficulty: '困难',
    tags: ['clip-path', 'mask', '遮罩', '裁剪'],
    answer: `## clip-path：裁剪元素的可视区域

按几何形状裁剪，**区域外完全不可见**，不占交互区域。

\`\`\`css
/* 基本形状 */
.circle { clip-path: circle(50% at 50% 50%) }
.ellipse { clip-path: ellipse(50% 30% at 50% 50%) }
.triangle { clip-path: polygon(50% 0, 0 100%, 100% 100%) }
.inset { clip-path: inset(10px 20px 30px 40px round 10px) }
\`\`\`

### polygon 多边形

\`\`\`css
.star { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) }
\`\`\`

### SVG 路径

\`\`\`css
.shape { clip-path: path('M10 10 H 90 V 90 H 10 L 10 10 Z') }
\`\`\`

### 引用 SVG clipPath

\`\`\`html
<svg width="0" height="0">
  <defs>
    <clipPath id="myClip" clipPathUnits="objectBoundingBox">
      <circle cx="0.5" cy="0.5" r="0.5"/>
    </clipPath>
  </defs>
</svg>
<img src="..." style="clip-path: url(#myClip)">
\`\`\`

## mask：用图像做遮罩

用图片/渐变的**透明度**决定元素的可见度，**支持半透明渐变**。

\`\`\`css
.fade {
  -webkit-mask: linear-gradient(to bottom, #000 70%, transparent);
  mask: linear-gradient(to bottom, #000 70%, transparent);
}
\`\`\`

底部淡出效果。遮罩的黑色（不透明）区域可见，透明区域不可见，半透明区域半可见。

### mask-image

\`\`\`css
.box {
  -webkit-mask-image: url(mask.png);
  mask-image: url(mask.png);
  -webkit-mask-size: cover;
  mask-size: cover;
}
\`\`\`

### mask 多重叠加

\`\`\`css
.box {
  -webkit-mask:
    linear-gradient(to right, #000, transparent),
    linear-gradient(to bottom, #000, transparent);
  -webkit-mask-composite: source-in;   /* 交集 */
}
\`\`\`

## 关键区别

| | \`clip-path\` | \`mask\` |
| --- | --- | --- |
| 裁剪方式 | 矢量几何路径 | 位图/渐变（透明度） |
| 是否支持半透明 | ❌ 二值（要么可见要么不可见） | ✅ 支持渐变过渡 |
| 锐利度 | 矢量，缩放无损 | 取决于遮罩图 |
| 性能 | 较好（几何计算） | 较高（位图采样） |
| 典型用途 | 形状裁剪、动画 | 淡出、复杂遮罩、图像合成 |
| 兼容性 | 较好（polygon 等） | 需 \`-webkit-\` 前缀，部分属性较新 |

## 实用场景

### 1. clip-path 做形状动画

\`\`\`css
.btn { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }     /* 矩形 */
.btn:hover { clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%) } /* 变箭头 */
.btn { transition: clip-path .3s }
\`\`\`

形状变化动画。

### 2. clip-path 实现扩展开启效果

\`\`\`css
.reveal { clip-path: circle(0 at 50% 50%) }
.reveal.show { clip-path: circle(150% at 50% 50%) }
.reveal { transition: clip-path .6s }
\`\`\`

圆形展开揭示内容，常见于 Material Design。

### 3. mask 做图片淡入背景

\`\`\`css
.hero {
  background: url(bg.jpg);
  -webkit-mask: linear-gradient(to bottom, #000 60%, transparent);
  mask: linear-gradient(to bottom, #000 60%, transparent);
}
\`\`\`

### 4. mask 做文字遮罩

\`\`\`css
.text {
  background: url(texture.jpg);
  -webkit-background-clip: text;
  color: transparent;
}
\`\`\`

## 兼容性

- \`clip-path\`：现代浏览器支持 polygon/circle/ellipse/inset/path；SVG url 兼容性好。
- \`mask\`：Safari 必须 \`-webkit-\` 前缀且属性名不同（\`-webkit-mask\`），Firefox/Chrome 同时支持标准与 -webkit-。
- 生产环境 mask 一定要加前缀。

## 小结

- 锐利几何裁剪 → \`clip-path\`（形状、动画、展开揭示）。
- 渐变/位图透明合成 → \`mask\`（淡出、复杂遮罩）。
- clip-path 矢量高效；mask 灵活但需前缀、性能较高。
- 两者都不影响布局（仍占空间），只影响可见区域。`
  },
  {
    id: 'css-034',
    category: 'css',
    title: '什么是 @layer（Cascade Layers）？它解决了什么问题？',
    difficulty: '困难',
    tags: ['@layer', '层叠层', '优先级', 'CSS架构'],
    answer: `## 解决的问题

大型项目里 CSS 优先级混乱：第三方库、组件库、业务样式、覆盖样式互相打架，靠堆选择器、\`!important\`、加载顺序管理，难维护。

\`@layer\` 让开发者**显式声明样式的层级**，层级内的样式优先级**低于**层级外的样式，且层级之间有明确的优先顺序。

## 基本语法

\`\`\`css
/* 声明层级顺序（先声明的优先级低） */
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box }
}

@layer base {
  body { font-size: 16px; line-height: 1.6 }
}

@layer components {
  .btn { padding: .5em 1em; border-radius: 4px }
}

@layer utilities {
  .mt-4 { margin-top: 1rem }
}
\`\`\`

## 优先级规则

1. **未分层的样式（unlayered）优先级最高**，高于所有 \`@layer\`。
2. **层级之间**：按声明顺序，**后声明的层级优先级更高**。
3. **同一层级内**：按原有的 specificity 规则。

\`\`\`css
@layer a, b, c;   /* 优先级：unlayered > c > b > a */
\`\`\`

## 为什么这样设计

- 框架/库的样式放低层级，业务样式放高层级，业务可轻松覆盖框架。
- \`!important\` 反转：\`@layer\` 内的 \`!important\` 优先级**反而高于**未分层的 \`!important\`（防止框架被业务意外覆盖关键样式）。

## 实战示例

### 引入第三方库

\`\`\`css
@layer theme, bootstrap, components, utilities;

/* bootstrap 整体放进一个 layer */
@import url("bootstrap.css") layer(bootstrap);

/* 业务样式在更高层级，无需 !important 即可覆盖 */
@layer components {
  .btn-primary { background: #1890ff }   /* 轻松覆盖 bootstrap */
}
\`\`\`

业务样式天然高于 bootstrap，告别 specificity 战争。

### 与 Tailwind 配合

Tailwind v4 默认用 \`@layer\`：

\`\`\`css
@layer theme, base, components, utilities;

@layer utilities {
  /* utilities 优先级最高，原子类总能覆盖 */
}
\`\`\`

## 层级嵌套

\`\`\`css
@layer outer {
  @layer inner {
    .x { color: red }
  }
}
/* 引用时写全名 */
@layer outer.inner {
  .x { color: blue }
}
\`\`\`

嵌套层级的优先级按声明顺序，外层声明顺序决定内层组的优先级。

## 与 unlayered 的关系

\`\`\`css
@layer base {
  .btn { color: red }    /* 层级内 */
}
.btn { color: blue }     /* unlayered，优先级更高 */
\`\`\`

最终 \`.btn\` 是蓝色。**unlayered 总是赢**，所以建议**所有样式都分层**，否则 unlayered 会破坏层级体系。

## layer 与 specificity

\`\`\`css
@layer base {
  /* 高 specificity 也输给低 specificity 的 unlayered */
  body div.x.y.z { color: red }
}
.x { color: blue }   /* unlayered，赢 */
\`\`\`

层级优先级**先于** specificity 比较。

## 兼容性

- 现代浏览器 2022+ 支持（Chrome 99+、Firefox 97+、Safari 15.4+）。
- IE 不支持，需评估目标浏览器。

## 何时用

- 大型项目、多套样式（框架 + 业务 + 工具类）混合。
- 组件库设计者，让使用者易覆盖。
- 摆脱 \`!important\` 滥用。

## 小结

- \`@layer\` 显式管理 CSS 优先级，告别 specificity 战争。
- 顺序：声明越后优先级越高；unlayered 最高；\`!important\` 在 layer 内反向提升。
- 适合大型项目与组件库，让"业务覆盖框架"变得自然。
- 新特性，注意兼容性，可逐步采用。`
  },
  {
    id: 'css-035',
    category: 'css',
    title: '@property 是什么？它能解决 CSS 变量的什么问题？',
    difficulty: '困难',
    tags: ['@property', '自定义属性', '动画', '类型', 'Houdini'],
    answer: `## 背景：CSS 变量的局限

普通 CSS 变量是**字符串**，浏览器不知道它的类型和初始值，导致：

\`\`\`css
:root { --angle: 0deg }
.box { transform: rotate(var(--angle)) }
.box:hover { --angle: 360deg; transition: --angle 1s }  /* ❌ 不生效！ */
\`\`\`

CSS 变量**默认不可被动画**（除了少数浏览器实验），因为浏览器不知道 \`0deg\` 到 \`360deg\` 该如何插值（字符串无法插值）。

\`@property\`（Houdini API 的一部分）让开发者**注册**自定义属性，声明其类型、初始值、是否继承，使变量可被动画化、可被类型检查。

## 语法

\`\`\`css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
\`\`\`

- \`syntax\`：值类型，如 \`<angle>\`、\`<color>\`、\`<length>\`、\`<number>\`、\`<percentage>\`、\`<url>\` 等，或 \`*\`（任意）。
- \`initial-value\`：初始值。
- \`inherits\`：是否继承。

## 作用

### 1. 让变量可被动画/过渡

\`\`\`css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.spin {
  transform: rotate(var(--angle));
  transition: --angle 1s;
}
.spin:hover { --angle: 360deg }   /* ✅ 平滑旋转 */
\`\`\`

### 2. 渐变色的动画

普通 CSS 无法 transition \`background\` 的渐变变化，\`@property\` 让颜色/角度变量可动画：

\`\`\`css
@property --hue {
  syntax: '<number>';
  initial-value: 0;
  inherits: false;
}

.rainbow {
  background: linear-gradient(hsl(var(--hue) 100% 50%), hsl(calc(var(--hue) + 60) 100% 50%));
  transition: --hue 1s;
}
.rainbow:hover { --hue: 360 }
\`\`\`

### 3. 类型检查与回退

\`\`\`css
@property --size {
  syntax: '<length>';
  initial-value: 0px;
  inherits: false;
}

.box { --size: 100px; width: var(--size) }
.box { --size: abc }   /* ❌ 浏览器拒绝，回退到 initial-value 0px */
\`\`\`

避免了普通变量"赋错值导致整条样式失效"的问题。

### 4. 复杂动画（无法用 transform 实现的）

如让 \`conic-gradient\` 的角度旋转：

\`\`\`css
@property --p {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

.progress {
  background: conic-gradient(cyan var(--p), transparent 0);
  transition: --p 1s;
}
.progress.done { --p: 75% }
\`\`\`

纯 CSS 实现进度环动画，以前必须用 JS。

## 与普通变量的对比

| | 普通 CSS 变量 | \`@property\` 注册 |
| --- | --- | --- |
| 类型 | 无（字符串） | 有（syntax） |
| 可动画 | ❌（部分实验） | ✅ |
| 初始值 | 无（未设为空） | 有 |
| 类型校验 | ❌ | ✅ |
| 继承控制 | 总是继承 | 可配置 |
| 性能 | 一般 | 略好（类型已知） |

## 兼容性

- Chrome 85+、Edge 85+、Safari 16.4+、Firefox 128+ 支持。
- Houdini Paint API 等更广泛特性的子集。
- 不支持时降级：变量退化为普通变量（无动画、无类型检查），样式仍可用，只是动画失效。

## JS 注册（等价）

\`\`\`js
CSS.registerProperty({
  name: '--angle',
  syntax: '<angle>',
  initialValue: '0deg',
  inherits: false
})
\`\`\`

## 小结

- \`@property\` 注册自定义属性，赋予类型、初始值、继承性。
- 核心价值：**让 CSS 变量可动画**，解锁渐变、conic、calc 等的过渡。
- 提供类型校验和回退，提升健壮性。
- Houdini 的一部分，现代浏览器支持，老浏览器优雅降级。
- 是"纯 CSS 实现复杂动画"的关键能力。`
  },
  {
    id: 'css-036',
    category: 'css',
    title: '常见的 CSS 命名规范（BEM / OOCSS / SMACSS）是什么？',
    difficulty: '中等',
    tags: ['BEM', 'OOCSS', 'SMACSS', '命名规范', '架构'],
    answer: `## 为什么需要命名规范

CSS 全局作用域，类名冲突、样式复用难、维护混乱。命名规范通过约定类名结构，让样式**可读、可复用、可维护**。

## BEM（最流行）

\`Block__Element--Modifier\`：块、元素、修饰符。

\`\`\`html
<div class="card">
  <div class="card__title">标题</div>
  <div class="card__body">内容</div>
  <button class="card__button card__button--disabled">按钮</button>
</div>
<div class="card card--featured">高亮卡片</div>
\`\`\`

- \`Block\`：独立的组件（\`card\`）。
- \`Element\`：块内的子部分，双下划线（\`card__title\`）。
- \`Modifier\`：状态/变体，双连字符（\`card--featured\`）。

优点：结构清晰、避免嵌套选择器、复用性强。
缺点：类名长、HTML 臃肿。

\`\`\`css
/* BEM 推荐扁平选择器 */
.card { ... }
.card__title { ... }
.card__button { ... }
.card__button--disabled { ... }
.card--featured { ... }

/* 不推荐嵌套 */
.card .card__title .xxx { ... }   /* ❌ 失去 BEM 优势 */
\`\`\`

## OOCSS（面向对象 CSS）

两大原则：

### 1. 结构与皮肤分离

\`\`\`css
/* 结构 */
.box { width: 100px; height: 100px; overflow: hidden }

/* 皮肤 */
.skin-red { background: red; color: white }
.skin-blue { background: blue; color: white }
\`\`\`

\`\`\`html
<div class="box skin-red"></div>
<div class="box skin-blue"></div>
\`\`\`

结构与皮肤组合复用。

### 2. 容器与内容分离

\`\`\`css
/* 不推荐：依赖容器 */
.sidebar .title { font-size: 14px }

/* 推荐：独立于容器 */
.title { font-size: 14px }
\`\`\`

类名不依赖位置，可在任何地方复用。

## SMACSS（可扩展模块化架构）

把 CSS 分为 5 类：

1. **Base**：基础样式（reset、element 默认样式）。
   \`\`\`css
   body { margin: 0 }
   a { color: blue }
   \`\`\`
2. **Layout**：布局（header、sidebar、grid）。
   \`\`\`css
   .l-header { ... }
   .l-sidebar { ... }
   \`\`\`
   前缀 \`l-\`。
3. **Module**：可复用组件。
   \`\`\`css
   .card { ... }
   \`\`\`
4. **State**：状态类（隐藏、激活、错误）。
   \`\`\`css
   .is-hidden { display: none }
   .is-active { ... }
   \`\`\`
   前缀 \`is-\`。
5. **Theme**：主题（皮肤）。
   \`\`\`css
   .theme-dark { ... }
   \`\`\`

强调**按职责分类**，每类有命名约定。

## 对比

| | BEM | OOCSS | SMACSS |
| --- | --- | --- | --- |
| 核心思想 | 块/元素/修饰符命名 | 结构/皮肤分离 | 按 5 类组织 |
| 命名 | 严格双下划线/连字符 | 自由组合类 | 前缀分类 |
| 学习成本 | 低 | 中 | 中 |
| 适合 | 组件化项目 | 大量皮肤变体 | 大型站点架构 |
| 与预处理器 | 配合好 | 配合好 | 配合好 |

## 现代：与工具结合

### + CSS Modules / Scoped CSS

\`\`\`vue
<style scoped>
.btn { ... }   <!-- 自动加 hash，无需 BEM 防冲突 -->
</style>
\`\`\`

CSS Modules / Vue scoped 已解决命名冲突，BEM 的"防冲突"价值降低，但**结构清晰**仍有用。

### + 原子化 CSS（Tailwind）

直接组合原子类，几乎不写自定义 CSS：

\`\`\`html
<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">按钮</button>
\`\`\`

不需要 BEM，但复杂组件仍可抽取成组件 + 局部样式。

### + 组件框架

组件本身就是"块"，状态用 props 驱动 className：

\`\`\`jsx
<button className={cn('btn', { 'btn--disabled': disabled })}>按钮</button>
\`\`\`

## 实践建议

1. **小项目**：BEM 足够，简单清晰。
2. **组件化项目**：CSS Modules/Scoped 解决冲突，BEM 思维用于内部结构。
3. **大型站点**：SMACSS 分类 + BEM 命名 + 工具类。
4. **状态类**：统一 \`is-\`/\`has-\` 前缀（\`is-active\`、\`has-error\`）。
5. **JS 钩子**：用 \`js-\` 前缀单独标识（\`js-toggle\`），与样式类分离，避免改样式影响 JS。

## 小结

- BEM：最实用的命名约定，块/元素/修饰符。
- OOCSS：结构与皮肤、容器与内容分离。
- SMACSS：Base/Layout/Module/State/Theme 五类组织。
- 现代配合 CSS Modules/原子化/组件化，命名规范侧重"结构清晰"而非"防冲突"。
- 状态类用 \`is-\`，JS 钩子用 \`js-\`，是通用的良好实践。`
  }
]
