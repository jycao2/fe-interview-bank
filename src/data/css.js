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
  },
  {
    id: 'css-037',
    category: 'css',
    title: 'CSS :has() 伪类有哪些高级用法？能替代哪些 JS 逻辑？',
    difficulty: '中等',
    tags: [':has', '伪类', '父选择器', '关系选择器'],
    answer: `## 基本回顾

\`:has()\` 称为"父选择器"或"关系选择器"，根据**后代/兄弟**元素的状态来选择当前元素。它是 CSS 最强大的新特性之一（2023 年主流浏览器支持）。

\`\`\`css
/* 含有 img 的 .card 加阴影 */
.card:has(img) { box-shadow: 0 2px 12px #0001 }
\`\`\`

## 一、结构关系组合

### 1. 父子 + 伪类状态联动

\`\`\`css
/* 表单有必填项未填时，提交按钮变灰 */
.form:has(input:required:invalid) .submit-btn {
  opacity: .5;
  pointer-events: none;
}

/* 有一个 checkbox 被选中时，全选按钮打勾 */
.table:has(input[type="checkbox"]:checked) .select-all {
  background: #1890ff;
}
\`\`\`

### 2. 相邻兄弟关系（+ 和 ~）

\`\`\`css
/* h1 后面紧跟 h2 时，缩小 h1 的下边距 */
h1:has(+ h2) { margin-bottom: .25em }

/* p 后面有 p 时，给当前 p 加分隔线 */
p:has(~ p) { border-bottom: 1px solid #eee }
\`\`\`

### 3. 多层嵌套：has 里嵌 has

\`\`\`css
/* 卡片组中至少有一张卡片被选中（含 .selected），给组加激活边框 */
.card-group:has(.card:has(.selected)) {
  outline: 2px solid #1890ff;
  outline-offset: 4px;
}
\`\`\`

## 二、替代常见 JS 交互

### 1. 纯 CSS 选项卡（Tab）

\`\`\`html
<div class="tabs">
  <input type="radio" name="tab" id="t1" checked><label for="t1">首页</label>
  <input type="radio" name="tab" id="t2"><label for="t2">文章</label>
  <div class="panels">
    <div class="panel p1">首页内容</div>
    <div class="panel p2">文章内容</div>
  </div>
</div>
\`\`\`

\`\`\`css
.tabs:has(#t1:checked) .p1 { display: block }
.tabs:has(#t2:checked) .p2 { display: block }
.panel { display: none }
\`\`\`

### 2. 纯 CSS 模态框 / 抽屉

\`\`\`html
<input type="checkbox" id="modal-toggle" hidden>
<label for="modal-toggle">打开</label>
<div class="modal">弹窗内容<label for="modal-toggle">X</label></div>
\`\`\`

\`\`\`css
body:has(#modal-toggle:checked) .modal {
  transform: translateY(0);
  opacity: 1;
}
.modal { transition: all .3s; transform: translateY(100%); opacity: 0 }
\`\`\`

### 3. 主题切换（跟随复选框）

\`\`\`css
:root:has(#theme-dark:checked) {
  --bg: #1a1a1a;
  --text: #eee;
}
\`\`\`

## 三、表单验证可视化

\`\`\`css
/* 每个输入框在有焦点或有效/无效时，给外层 label 不同颜色 */
.field:has(input:focus) { border-color: #1890ff }
.field:has(input:valid)   { border-color: #52c41a }
.field:has(input:invalid:not(:placeholder-shown)) { border-color: #ff4d4f }
\`\`\`

## 四、与 :is / :not 组合

\`\`\`css
/* 卡片"不含按钮"时加底部内边距 */
.card:not(:has(button)) { padding-bottom: 1rem }

/* 任意标题含链接时，整段变色 */
:is(h1, h2, h3):has(a) { color: #1890ff }
\`\`\`

## 五、 specificity（优先级）

\`:has()\` 的优先级取**参数中选择器的最高值**，与 \`:is()\` / \`:not()\` 一致。

\`\`\`css
/* specificity = (0,1,1)：.card 的 (0,1,0) + :has(#x) 取 #x 的 (1,0,0) → 取最高 (1,0,0) 再加 .card → (1,1,0) */
.card:has(#submit-btn) { ... }
\`\`\`

## 性能注意

\`:has()\` 浏览器需要**从后向前**匹配：先找所有符合条件的后代，再回溯定位父元素。

- 避免 \`:has(*)\` 或极宽泛选择器（如 \`:has(div)\`）。
- 尽量缩小作用域，前缀加父容器。
- 复杂页面 / 长列表频繁变化可能引起性能问题，必要时加 JS 兜底。

## 兼容性

- Chrome 105+、Safari 15.4+、Firefox 121+（2023 年底起主流支持）。
- 降级：使用 \`@supports not selector(:has(*))\` 提供 JS fallback。

\`\`\`css
@supports not selector(:has(*)) {
  /* 老浏览器用 JS 添加类名 */
  .card-has-img { box-shadow: 0 2px 12px #0001 }
}
\`\`\`

## 小结

- \`:has()\` 让 CSS 具备"根据子/兄弟状态选父"的能力，解锁大量纯 CSS 交互。
- 典型替代 JS：Tab、模态框、表单联动视觉、主题切换、多选状态。
- 结合 \`:valid\` / \`:checked\` / \`:focus\` 可实现丰富的表单可视化。
- 注意性能和兼容性，复杂场景仍需 JS 兜底。`
  },
  {
    id: 'css-038',
    category: 'css',
    title: 'CSS @scope 和 color-mix() 怎么用？解决了什么问题？',
    difficulty: '中等',
    tags: ['@scope', 'color-mix', 'CSS新特性', '作用域', '颜色'],
    answer: `## 一、@scope：样式作用域的原生解决方案

### 解决的问题

CSS 是全局作用域。为了解决冲突，人们用 BEM、CSS Modules、CSS-in-JS、Scoped CSS 等方案。\`@scope\` 提供**浏览器原生的样式隔离**，无需编译、无需 hash。

### 基本语法

\`\`\`css
@scope (.card) {
  /* 以下样式仅作用于 .card 内部 */
  .title { font-size: 1.25rem; font-weight: 600 }
  .body  { color: #555 }
  button { padding: .5em 1em; border-radius: 4px }
}
\`\`\`

等价于给内部每个选择器**自动加上祖先前缀**，但更优雅、语义化。

### 与 scoped / CSS Modules 的区别

| | @scope | Vue scoped | CSS Modules |
| --- | --- | --- | --- |
| 原理 | 原生 CSS，浏览器匹配 | 编译加 \`data-v-xxx\` 属性选择器 | 编译类名加 hash |
| 是否编译 | 否 | 是 | 是 |
| 运行时 | 原生支持 | 编译产物 | 编译产物 |
| 深层穿透 | \`:scope\` 精细控制 | \`:deep()\` | \`:global()\` |

### scoped 样式边界：@scope (起点) to (终点)

可以指定"作用域从哪开始、到哪结束"，实现 Donut Scope（环形作用域）。

\`\`\`css
/* .card 内生效，但遇到 .nested-card 就停止（不穿透嵌套卡片） */
@scope (.card) to (.nested-card) {
  .title { color: blue }
}
\`\`\`

\`\`\`html
<div class="card">
  <h3 class="title">我是蓝色</h3>
  <div class="nested-card">
    <h3 class="title">我不受影响（默认色）</h3>
  </div>
</div>
\`\`\`

这是 @scope 独有的能力，编译型方案很难优雅实现。

### @scope 内的 :scope

在 @scope 块内，\`:scope\` 指向作用域根：

\`\`\`css
@scope (.card) {
  :scope { border: 1px solid #ddd; border-radius: 8px } /* .card 本身 */
  :scope:hover { box-shadow: 0 4px 12px #0001 }
  .title { ... }
}
\`\`\`

### 优先级

@scope 内的样式 specificity 正常计算，**不额外提升**。若与全局样式冲突，按源码顺序（后写赢）。

### 兼容性

Chrome 118+、Safari 17.4+、Firefox 132+（2024 年主流支持）。

---

## 二、color-mix()：颜色插值函数

### 解决的问题

以前要混合两种颜色（如主色 + 白变浅），必须用预处理器的 \`lighten()\` / \`mix()\` 或 JS。\`color-mix()\` 是**原生 CSS 颜色混合**。

### 语法

\`\`\`css
color-mix(in <colorspace>, <color1> <p1>%, <color2> <p2>%)
\`\`\`

\`\`\`css
/* 蓝色 + 白色 各 50% → 浅蓝 */
background: color-mix(in srgb, #1890ff 50%, white);

/* 主色 + 10% 黑 → 暗主色 */
--primary-dark: color-mix(in oklch, var(--primary) 90%, black);
\`\`\`

### 色彩空间（colorspace）

不同色彩空间的混合结果差异很大：

| 空间 | 特点 |
| --- | --- |
| \`srgb\` | 标准 RGB，简单直接 |
| \`srgb-linear\` | 线性 RGB，物理更准确 |
| \`oklch\` | ✅ 推荐！感知均匀，混合自然，不会变灰 |
| \`lab\` | 感知均匀 |
| \`hsl\` | 以色相渐变，适合色相过渡 |

**推荐使用 oklch**，混合结果更符合人眼感知：

\`\`\`css
/* srgb 混合红+蓝会变脏灰；oklch 会得到鲜艳的紫 */
.good: color-mix(in oklch, red 50%, blue);
.bad:  color-mix(in srgb,  red 50%, blue);
\`\`\`

### 实战场景

#### 1. 主题色阶系统（替代预处理器函数）

\`\`\`css
:root {
  --brand: #1890ff;
  --brand-50:  color-mix(in oklch, var(--brand) 5%,  white);
  --brand-100: color-mix(in oklch, var(--brand) 15%, white);
  --brand-200: color-mix(in oklch, var(--brand) 30%, white);
  --brand-400: color-mix(in oklch, var(--brand) 70%, white);
  --brand-600: color-mix(in oklch, var(--brand) 85%, black);
  --brand-900: color-mix(in oklch, var(--brand) 50%, black);
}
\`\`\`

纯原生生成 Tailwind 风格色阶，无需 Sass。

#### 2. Hover / Active 状态

\`\`\`css
.btn {
  background: var(--primary);
  transition: background .2s;
}
.btn:hover  { background: color-mix(in oklch, var(--primary) 85%, white) }
.btn:active { background: color-mix(in oklch, var(--primary) 80%, black) }
\`\`\`

无需维护多个颜色变量。

#### 3. 半透明背景（与 white 混合 vs opacity）

\`\`\`css
/* 与 white 混合：颜色变浅但不透明，背景不会透出 */
.card { background: color-mix(in oklch, var(--brand) 10%, white) }

/* opacity：元素整体透明，背后内容会透出 */
.card { background: var(--brand); opacity: .1 }
\`\`\`

#### 4. 暗色模式适配

\`\`\`css
:root[data-theme="dark"] {
  /* 暗色下品牌色与 20% 白混合，避免在深背景上太刺眼 */
  --brand: color-mix(in oklch, #1890ff 80%, white);
}
\`\`\`

### 与相对颜色语法（Relative Colors）配合

\`\`\`css
/* rgb(from ...) 语法也能实现颜色变换，但 color-mix 语义更直观 */
--brand-dark: rgb(from var(--brand) calc(r * 0.8) calc(g * 0.8) calc(b * 0.8));
\`\`\`

### 兼容性

Chrome 111+、Safari 16.2+、Firefox 113+（2023 年主流支持）。

## 小结

- **@scope**：原生 CSS 作用域，支持 to 边界（环形作用域），无需编译。
- **color-mix()**：原生颜色混合，优先用 oklch 空间。
- 两者结合：@scope 写组件局部样式 + color-mix 从主色派生色阶，接近摆脱预处理器。
- 注意浏览器版本，渐进增强使用。`
  },
  {
    id: 'css-039',
    category: 'css',
    title: 'CSS 容器查询 @container 有哪些进阶用法？与媒体查询如何配合？',
    difficulty: '困难',
    tags: ['@container', '容器查询', 'container-type', '响应式', '组件化'],
    answer: `## 一、核心概念回顾

**媒体查询 @media**：基于**视口**（浏览器窗口）响应。
**容器查询 @container**：基于**父容器**的尺寸响应——同一组件在宽容器里横向排列、在窄容器里纵向排列，真正实现"组件级响应式"。

\`\`\`css
.card-wrapper {
  container-type: inline-size;   /* 声明为查询容器：基于宽度查询 */
  container-name: card;          /* 可选：命名，便于定向查询 */
}
@container card (min-width: 400px) {
  .card { display: flex; gap: 1rem }
  .card-cover { width: 40% }
}
\`\`\`

---

## 二、container-type 的三个值

| 值 | 含义 |
| --- | --- |
| \`normal\`（默认） | 不是查询容器 |
| \`inline-size\` | 基于**行内轴尺寸**（水平书写时 = 宽度）查询 ✅ 最常用 |
| \`size\` | 基于**宽 + 高**双向查询。需要容器有明确高度，慎用 |

为什么 \`inline-size\` 最常用？因为布局通常由宽度驱动，高度是内容自适应的；若设 \`size\`，容器必须有确定高度（否则高度为 0，查询永远不匹配）。

---

## 三、命名容器 container-name

页面有多个嵌套容器时，通过命名让 \`@container\` 明确查询哪一层：

\`\`\`css
.page        { container-type: inline-size; container-name: page }
.card-wrapper{ container-type: inline-size; container-name: card }

/* 查询 card 容器，不是 page */
@container card (min-width: 500px) {
  .card-title { font-size: 1.5rem }
}
/* 查询 page 容器 */
@container page (min-width: 1000px) {
  .layout { display: grid; grid-template-columns: 300px 1fr }
}
\`\`\`

---

## 四、容器查询单位 cqw / cqh / cqi / cqb

类似 vw/vh，但相对**查询容器**而非视口：

| 单位 | 含义 |
| --- | --- |
| \`cqw\` | 容器宽度的 1% |
| \`cqh\` | 容器高度的 1% |
| \`cqi\` | 容器行内尺寸 1%（≈ cqw） |
| \`cqb\` | 容器块尺寸 1%（≈ cqh） |
| \`cqmin\` | min(cqw, cqh) |
| \`cqmax\` | max(cqw, cqh) |

组件内部字号、间距完全自包含：

\`\`\`css
@container card (min-width: 0) {
  .card-title { font-size: clamp(1rem, 5cqi, 1.5rem) }
  .card-body  { padding: calc(2cqi + 4px) }
}
\`\`\`

组件无论被放进 200px 侧栏还是 800px 主区，字号间距都按容器宽度平滑缩放。

---

## 五、高阶布局模式

### 1. 容器查询 + Grid auto-fit 组合（双自适应）

\`\`\`css
.card-grid {
  container-type: inline-size;
  container-name: grid;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
/* 容器自身变宽时，增大内部元素的最小宽度 */
@container grid (min-width: 800px) {
  .card-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) }
}
\`\`\`

外层容器变化 → 内层列数 + 最小宽度双重自适应。

### 2. 组件内部布局方向切换

\`\`\`css
.stat-box { container-type: inline-size }

/* 窄容器：上下结构 */
@container (max-width: 249px) {
  .stat { display: grid; grid-template-rows: auto auto }
}
/* 中等容器：左右结构 */
@container (min-width: 250px) and (max-width: 499px) {
  .stat { display: flex; align-items: center; gap: 1rem }
}
/* 宽容器：图标 + 标题 + 数值三列展开 */
@container (min-width: 500px) {
  .stat { display: grid; grid-template-columns: 48px 1fr auto; align-items: center }
}
\`\`\`

### 3. 嵌套容器查询（多层组件）

\`\`\`css
/* 外层页面级 */
.page   { container-type: inline-size; container-name: page }
/* 内层卡片级 */
.card-w { container-type: inline-size; container-name: card }

/* 页面够宽时，卡片字体整体放大 */
@container page (min-width: 1200px) {
  .card-w { font-size: 18px }
}
/* 卡片容器自身宽度决定布局 */
@container card (min-width: 400px) {
  .card { display: flex }
}
\`\`\`

每个组件独立响应，互不干扰。

---

## 六、@container 能查什么（查询条件）

不只宽度，还支持：

| 条件 | 示例 |
| --- | --- |
| 行内尺寸 | \`min-width: 400px\`、\`max-inline-size\` |
| 块尺寸 | \`min-height: 300px\`（需 container-type: size） |
| 纵横比 | \`aspect-ratio > 16/9\` |
| 朝向 | \`orientation: landscape\`（基于容器） |
| 逻辑运算 | \`and\` / 逗号（or） / \`not\` |

\`\`\`css
@container (min-width: 400px) and (aspect-ratio >= 2/1) {
  /* 容器"又宽又扁"时启用 */
}
\`\`\`

---

## 七、常见坑

### 1. 最近容器原则

子元素查询的是**最近的、匹配 container-name 的容器祖先**。若没设 container-name，则找最近的任意查询容器。一定要显式命名避免嵌套错乱。

### 2. 容器自身样式不会被 @container 修改

\`\`\`css
.card-wrapper {
  container-type: inline-size;
}
/* ❌ 无效：@container 里改容器自身的样式不生效（只改容器内部项目） */
@container (min-width: 400px) {
  .card-wrapper { padding: 1rem }
}
/* ✅ 给容器再包一层，查询外层容器 */
\`\`\`

容器查询作用于**容器内部的后代**，而不是容器本身。

### 3. container-type: size 导致高度坍塌

设 \`size\` 后容器布局会"失去内容驱动高度的能力"，必须手动指定高度。绝大多数场景用 \`inline-size\` 即可。

### 4. 与 display: contents 冲突

父元素 \`display: contents\` 会跳过该元素作为容器，查询会继续向上找。

---

## 八、与媒体查询配合（最佳实践）

\`\`\`css
/* 1. 媒体查询：整页骨架 */
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr }   /* 侧栏改上方 */
  .page { font-size: 15px }
}
/* 2. 容器查询：组件内部自适应（组件与放置位置解耦） */
.sidebar-item { container-type: inline-size }
@container (min-width: 240px) {
  .sidebar-item { display: flex; gap: .75rem }
}
\`\`\`

- 宏观布局骨架 → **媒体查询**
- 组件内部样式（字号、方向、间距） → **容器查询**
- 容器查询单位 + clamp() 实现平滑缩放 → 替代多套断点

---

## 九、兼容性与降级

- Chrome 105+、Safari 16+、Firefox 110+（2023 年普遍支持）。
- 降级：\`@supports not (container-type: inline-size)\` 里写媒体查询 fallback。

\`\`\`css
@supports not (container-type: inline-size) {
  /* 没有容器查询时，退化为按视口宽度媒体查询 */
  @media (min-width: 768px) {
    .card { display: flex }
  }
}
\`\`\`

## 小结

- \`container-type: inline-size\` 声明查询容器；\`container-name\` 命名避免嵌套混乱。
- **cqw/cqi 等单位**实现组件内部尺寸完全自包含。
- 组件级布局切换、嵌套层级独立响应、与 Grid auto-fit 双剑合璧。
- 注意：@container 不改容器自身样式；最近容器原则；size 慎用。
- **媒体查询管骨架，容器查询管组件**，组合效果最佳。`
  },
  {
    id: 'css-040',
    category: 'css',
    title: 'CSS 遮罩 mask 与混合模式 mix-blend-mode / background-blend-mode 怎么用？',
    difficulty: '中等',
    tags: ['mask', 'mix-blend-mode', 'background-blend-mode', '遮罩', '混合模式', '合成'],
    answer: `## 一、mask：基于透明度的可见度控制

### 原理

用另一张图像/渐变的**Alpha 通道（透明度）**控制元素的可见部分：
- 遮罩的不透明区域 → 元素可见
- 遮罩的透明区域 → 元素不可见
- 遮罩的半透明区域 → 元素半可见

### 基础用法

\`\`\`css
.box {
  -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent);
  mask-image: linear-gradient(to bottom, #000 60%, transparent);
}
\`\`\`

> **必须加 \`-webkit-\` 前缀**，Safari 只认带前缀的属性。生产环境两套都写。

### 完整属性

\`\`\`css
.element {
  -webkit-mask-image: url(mask.png);              /* 遮罩图：图片 / 渐变 / SVG */
  -webkit-mask-size: cover;                       /* 尺寸，同 background-size */
  -webkit-mask-position: center;                  /* 位置 */
  -webkit-mask-repeat: no-repeat;                 /* 平铺 */
  -webkit-mask-origin: border-box;                /* 定位原点 */
  -webkit-mask-clip: border-box;                  /* 裁剪区域 */
  -webkit-mask-composite: source-over;            /* 多重遮罩混合方式 */
  mask-mode: alpha;                               /* alpha / luminance / match-source */
}
\`\`\`

### mask 常见应用

#### 1. 底部渐隐（文字淡出）

\`\`\`css
.article-preview {
  height: 200px;
  overflow: hidden;
  -webkit-mask: linear-gradient(to bottom, #000 70%, transparent);
  mask: linear-gradient(to bottom, #000 70%, transparent);
}
\`\`\`

#### 2. 图片裁剪为任意形状（支持半透明边缘）

\`\`\`css
/* 圆形边缘羽化 */
.avatar {
  -webkit-mask: radial-gradient(circle at 50% 50%, #000 60%, transparent 72%);
  mask: radial-gradient(circle at 50% 50%, #000 60%, transparent 72%);
}
\`\`\`

相比 \`clip-path\`（硬边界二值裁剪），\`mask\` 可以有羽化渐变边缘。

#### 3. 多重 mask（逗号分隔，前叠后）

\`\`\`css
.torn-paper {
  -webkit-mask:
    linear-gradient(to bottom, #000 85%, transparent),   /* 底部撕边 */
    linear-gradient(to right,  transparent 2%, #000 6%, #000 94%, transparent 98%); /* 左右撕边 */
}
\`\`\`

---

## 二、mix-blend-mode：元素与背后内容混合

### 原理

控制当前元素的像素与它**下方已渲染内容**的像素，按某种算法合成。类似 Photoshop 图层混合模式。

### 语法

\`\`\`css
.element { mix-blend-mode: <mode> }
\`\`\`

### 常用混合模式

| 类别 | 模式 | 效果 |
| --- | --- | --- |
| 基础 | \`normal\` | 默认，不混合 |
| 变暗 | \`multiply\`（正片叠底） | 白不变、黑变黑，适合叠阴影/纹理 |
| 变暗 | \`darken\` | 逐通道取更暗的 |
| 变亮 | \`screen\`（滤色） | 黑不变、白变白，适合叠光效/光晕 |
| 变亮 | \`lighten\` | 逐通道取更亮的 |
| 对比 | \`overlay\` | 背景亮→更亮，背景暗→更暗 |
| 对比 | \`soft-light\` / \`hard-light\` | 柔光 / 强光 |
| 反色 | \`difference\`（差值） | 相同变黑、相反变白，可做反色 |
| 反色 | \`exclusion\` | 差值的低对比版 |
| 色彩 | \`hue\` / \`saturation\` / \`color\` / \`luminosity\` | 保留其中一个色彩维度 |

### 经典应用

#### 1. 文字自动反色（永远与背景对比清晰）

\`\`\`css
.hero-title {
  color: #fff;
  mix-blend-mode: difference;
}
/* 背景浅处文字自动变深，背景深处文字自动变浅 */
\`\`\`

#### 2. 图片叠染色调（复古滤镜）

\`\`\`css
.photo-wrap { position: relative }
.photo-wrap::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  mix-blend-mode: overlay;
}
\`\`\`

#### 3. 镂空文字（用 difference 做）

\`\`\`css
.cutout-text {
  background: url(texture.jpg);
  background-clip: text;
  color: #fff;
}
/* 或用 mix-blend-mode 做更复杂的叠字效果 */
\`\`\`

---

## 三、background-blend-mode：同一元素内多层背景混合

### 区别

| 属性 | 混合对象 |
| --- | --- |
| \`mix-blend-mode\` | **元素**与**下方其他元素**（跨图层） |
| \`background-blend-mode\` | **同一元素内部**的多个 background-image / background-color 之间（单图层内部） |

### 语法

\`\`\`css
.banner {
  background:
    linear-gradient(45deg, #f00, #00f),   /* 层 1 */
    url(photo.jpg);                        /* 层 2 */
  background-blend-mode: overlay;          /* 层1 与 层2 叠加 */
  background-color: #fff;                  /* backgroundColor 也参与混合 */
}
\`\`\`

也可每个背景层单独指定模式（逗号分隔，对应每层）：

\`\`\`css
background-blend-mode: multiply, screen;
\`\`\`

### 典型应用：统一图片色调 + 文字可读

\`\`\`css
.hero {
  background:
    linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)),  /* 统一压暗遮罩 */
    url(banner.jpg);
  background-blend-mode: multiply;  /* 压暗同时保留细节 */
  color: #fff;
}
\`\`\`

相比直接给渐变层 \`opacity\`，\`multiply\` 能让阴影更有质感。

---

## 四、三者对比

| | mask | mix-blend-mode | background-blend-mode |
| --- | --- | --- | --- |
| 控制维度 | **可见度**（透明度裁剪） | **颜色**（跨图层合成） | **颜色**（单层内多背景合成） |
| 作用层级 | 单个元素 | 元素 vs 下方内容 | 同一元素的多背景 |
| 典型结果 | 变透明 / 羽化边 | 变色 / 反色 / 叠加 | 染色 / 蒙层 |
| 是否隔离 | - | 可用 \`isolation: isolate\` 创建独立组 | 天然作用在元素内 |

---

## 五、isolation: isolate —— 隔离混合组

\`mix-blend-mode\` 默认**混合视口下所有可见内容**。如果只想让某个小组内部混合，不影响更外层，需要给组加：

\`\`\`css
.card-group { isolation: isolate }
\`\`\`

这会创建一个新的层叠上下文 + 合成组，混合模式被限制在该组内。

---

## 六、性能与兼容性

### 性能

- mask 和混合模式都会触发 **Paint 和 Composite**，且需要 GPU 做像素级合成。
- 避免在长列表、滚动区域的每一项都大面积使用，尤其移动端。
- 动画时优先放在独立合成层（\`will-change\` / \`transform: translateZ(0)\`）。

### 兼容性

| 属性 | 兼容情况 |
| --- | --- |
| mask | Safari 只认 \`-webkit-mask\`；Chrome/Firefox 两者都认。必须写前缀。 |
| mix-blend-mode | 现代浏览器全支持；IE 不支持。 |
| background-blend-mode | 现代浏览器支持；Safari 早期版本对多层支持有 bug。 |

### 通用降级写法

\`\`\`css
/* mask 前缀 */
.box {
  -webkit-mask: linear-gradient(#000, transparent);
          mask: linear-gradient(#000, transparent);
}
/* 混合模式降级：不支持时给纯色覆盖 */
@supports not (mix-blend-mode: multiply) {
  .photo-wrap::after { background: rgba(0,0,0,.4) }
}
\`\`\`

---

## 七、综合实战：质感卡片

\`\`\`css
.glass-card {
  background:
    linear-gradient(135deg, rgba(255,255,255,.3), rgba(255,255,255,.05)),
    url(texture.jpg);
  background-blend-mode: overlay;
  backdrop-filter: blur(10px);
  -webkit-mask: linear-gradient(135deg, #000 85%, transparent 100%);
          mask: linear-gradient(135deg, #000 85%, transparent 100%);
  isolation: isolate;
}
.glass-card .tag {
  mix-blend-mode: difference;
  color: #fff;
}
\`\`\`

## 小结

- **mask**：用图像/渐变的透明度控制可见度（遮罩、渐隐、羽化裁剪）。
- **mix-blend-mode**：元素与背后跨图层颜色合成（反色、叠加、滤色）。
- **background-blend-mode**：同一元素内多背景之间混合（染色、统一压暗）。
- **前缀**：mask 必加 \`-webkit-\`。
- **隔离**：用 \`isolation: isolate\` 限制混合范围。
- 组合使用可实现极具质感的视觉，但要注意性能与降级。`
  },
  {
    id: 'css-041',
    category: 'css',
    title: 'CSS Grid 进阶：subgrid 与命名区域（grid-template-areas）怎么用？',
    difficulty: '中等',
    tags: ['Grid', 'subgrid', '命名区域', 'grid-template-areas', '布局'],
    answer: `## 一、命名区域（grid-template-areas）

### 定义

用**字符串矩阵**给 Grid 划分"语义化区域"，并让项目通过 \`grid-area\` 直接放入对应区域。比数字网格线更直观。

### 基本用法

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  gap: 1rem;
}
.header  { grid-area: header }
.sidebar { grid-area: sidebar }
.main    { grid-area: main }
.footer  { grid-area: footer }
\`\`\`

矩阵规则：
- 每行字符串代表一行轨道，字符串中空格分隔的每个名字代表一列。
- 同名区域**必须组成矩形**（不能 L 形）。
- 想留空位置用 \`.\`（一个或多个点都行）。

\`\`\`css
grid-template-areas:
  "header header header"
  "left   .      right"   /* 中间一列留空 */
  "footer footer footer";
\`\`\`

### 优点

1. **语义清晰**：看 \`grid-template-areas\` 一眼就能想象布局形状。
2. **响应式重构简单**：媒体查询里重写矩阵即可。
3. **顺序解耦**：视觉位置与 DOM 顺序无关。

### 响应式下重排

\`\`\`css
.layout { grid-template-areas:
  "header"
  "main"
  "sidebar"
  "footer" }
@media (min-width: 768px) {
  .layout {
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header  header"
      "sidebar main"
      "footer  footer";
  }
}
\`\`\`

### 命名区域的隐式网格线

命名区域会自动生成对应的网格线（\`-start\` / \`-end\` 后缀），可混用：

\`\`\`css
/* header 区域自动生成两条线：header-start / header-end */
.special { grid-row: header-start / footer-end } /* 跨到 header 顶到 footer 底 */
\`\`\`

---

## 二、subgrid：继承父级轨道的嵌套 Grid

### 痛点：嵌套 Grid 轨道对齐难

传统 Grid 中，子 Grid 与父 Grid 是两套独立的轨道系统，**无法自动对齐**：

\`\`\`html
<div class="grid-parent">      <!-- 三列：[A][B][C] -->
  <div class="card">           <!-- 想让卡片内部 3 列也跟父级对齐 → 传统做不到 -->
    <div class="card-inner-grid"></div>
  </div>
</div>
\`\`\`

### subgrid 语法

让子 Grid 的行/列**直接使用父 Grid 的轨道定义**，完美对齐：

\`\`\`css
.grid-parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 1rem;
}
.card {
  grid-column: span 2;          /* 卡片占父级两列 */
  grid-row: span 2;             /* 占两行 */
  display: grid;
  grid-template-columns: subgrid;  /* ✅ 这两列直接继承父级的轨道 */
  grid-template-rows: subgrid;     /* ✅ 这两行也继承 */
  gap: inherit;                    /* 继承间距 */
}
.card .thumb  { grid-column: 1; grid-row: 1 / 3 }
.card .title  { grid-column: 2 }
.card .desc   { grid-column: 2 }
\`\`\`

卡片内部的"列 1 / 列 2"就是父 Grid 的那两列——所以所有卡片内部元素都在**同一条竖直线上**，哪怕每张卡片自身跨的列数不同。

### subgrid 行与列可分开指定

\`\`\`css
.nested {
  display: grid;
  grid-template-columns: subgrid;   /* 列继承父 */
  grid-template-rows: repeat(3, 1fr); /* 行自己定义 */
}
\`\`\`

### 典型应用 1：卡片内容统一对齐

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.card {
  display: grid;
  grid-template-rows: subgrid;   /* 行与父网格共享，所有卡片头/体/尾对齐 */
  grid-row: span 3;              /* 每张卡占 3 行（头+体+尾） */
}
.card-header { /* ... */ }
.card-body   { /* ... */ }
.card-footer { /* ... */ }
\`\`\`

痛点：之前卡片高度不等时，每张卡片内部标题/内容/按钮位置参差不齐。用 **subgrid + span N** 后，所有卡片的标题行高度一致、正文行高度一致、底部按钮行高度一致——完美横平竖直。

### 典型应用 2：复杂仪表盘 / 表格布局

\`\`\`css
.dashboard {
  display: grid;
  grid-template-columns: 80px repeat(6, 1fr);
  grid-template-rows: repeat(12, minmax(2rem, auto));
}
.panel {
  grid-column: 2 / 6;
  grid-row: 2 / 8;
  display: grid;
  grid-template-columns: subgrid;   /* 继承父级 4 列（2-5） */
  grid-template-rows: subgrid;      /* 继承父级 6 行（2-7） */
}
/* panel 内部可以精确对齐父级的列和行 */
\`\`\`

### subgrid 的关键点

1. **必须声明跨度**：子项先在父级 \`grid-column: span N\` / \`grid-row: span M\` 占好空间，再 subgrid 继承这 N 列 / M 行。
2. **gap 继承**：subgrid 不自动继承 gap，需要显式 \`gap: inherit\` 或重新指定。
3. **命名区域传递**：父级的命名区域和命名线，subgrid 里可以直接用。
4. **多层 subgrid**：可以层层嵌套 subgrid，所有层级共用根级轨道。
5. **不支持 auto-fit / auto-fill**：subgrid 只能继承**明确的轨道数量**。

---

## 三、命名区域 + subgrid 组合实战

\`\`\`css
/* 1. 根级：命名区域 + 明确轨道 */
.page {
  display: grid;
  grid-template-columns: 240px repeat(4, 1fr);
  grid-template-rows: 64px auto 48px;
  grid-template-areas:
    "side head head head head head"
    "side main main main main main"
    "side foot foot foot foot foot";
  gap: 1rem;
}
.aside { grid-area: side }
.header{ grid-area: head }
.main  { grid-area: main }
.footer{ grid-area: foot }

/* 2. main 区域做 subgrid，精确切分 */
.main {
  display: grid;
  grid-template-columns: subgrid;   /* 继承 main 所在的 4 列 */
  grid-template-rows: repeat(2, 200px);
}
.article  { grid-column: 1 / 4 }  /* main 里的列 1-3 = 页面的第 2-4 列 */
.sidebar2 { grid-column: 4 }      /* main 里的列 4   = 页面的第 5 列 */
\`\`\`

---

## 四、命名区域 vs 数字网格线 vs 命名网格线

| 方式 | 适用 | 优点 | 缺点 |
| --- | --- | --- | --- |
| 数字线 \`1 / 3\` | 简单跨格 | 简短 | 语义弱 |
| 命名线 \`col-a / col-c\` | 语义 + 精细控制 | 精确 | 定义繁琐 |
| **命名区域** | 页面骨架/整体布局 | 可读性极强，一眼懂 | 必须矩形 |
| **subgrid** | 嵌套层级对齐 | 跨层级像素级对齐 | 需浏览器支持 |

最佳实践：**整体结构用命名区域 + 内部嵌套用 subgrid + 微调用数字线**。

---

## 五、兼容性

| 特性 | 支持情况 |
| --- | --- |
| grid-template-areas | 全现代浏览器（2017+），非常稳 |
| subgrid | Firefox 71+（2019）、Safari 16+（2022）、Chrome 117+（2023 年底）。主流齐了。 |

### subgrid 降级

\`\`\`css
.card {
  display: grid;
  grid-template-rows: auto 1fr auto;   /* fallback：自定义三行 */
}
@supports (grid-template-rows: subgrid) {
  .card { grid-template-rows: subgrid } /* 支持就启用 */
}
\`\`\`

## 小结

- **命名区域**：\`grid-template-areas\` 矩阵语义化布局骨架，媒体查询里重写矩阵即可重排。
- **subgrid**：嵌套 Grid 的行/列继承父 Grid 轨道，解决卡片内容不齐、嵌套对不齐的老难题。
- 组合：顶层 \`grid-template-areas\` 画骨架，内部大组件 subgrid 对齐，细节用网格线 span。
- subgrid 是 Grid 布局的"最后一块拼图"，让多层 Grid 真正成为一个二维系统。`
  },
  {
    id: 'css-042',
    category: 'css',
    title: 'CSS 滚动捕捉 scroll-snap 怎么用？实现轮播、全屏滑页、相册浏览',
    difficulty: '简单',
    tags: ['scroll-snap', '滚动捕捉', '轮播', '全屏滑动'],
    answer: `## 原理

scroll-snap 让容器在滚动结束时**自动吸附**到某个子元素的边缘/中心，避免滚动停在"半中间"的尴尬位置。纯 CSS 实现轮播、全屏滑页、相册浏览等滚动对齐交互。

---

## 核心属性（容器）

\`\`\`css
.scroll-container {
  /* 1. 滚动方向上启用捕捉 */
  scroll-snap-type: x mandatory;
  /* 取值：x / y / both  +  mandatory / proximity / none */
}
\`\`\`

### scroll-snap-type 的两个关键字

**轴（x / y / both）**：
- \`x\`：横向捕捉（轮播）
- \`y\`：纵向捕捉（全屏滑页）
- \`both\`：双轴（相册网格）

**严格度（mandatory / proximity）**：
| 模式 | 含义 |
| --- | --- |
| \`mandatory\`（强制） | 滚动一停就**必须**吸附到最近的捕捉点。稳定，轮播滑页推荐。 |
| \`proximity\`（邻近） | 离捕捉点够近才吸附，否则随便停。适合长正文的章节间对齐。 |

> \`mandatory\` 的坑：内容很高、跨屏幕时，中途刷新或动态插入元素可能导致强制跳到某个位置，跳屏。长列表慎用。

---

## 核心属性（子项）

\`\`\`css
.scroll-item {
  /* 2. 子项声明捕捉位置 */
  scroll-snap-align: center;
  /* 取值：none / start / center / end */
}
\`\`\`

| 值 | 含义 |
| --- | --- |
| \`start\` | 子项**起始边**与容器可视区起始边对齐 |
| \`center\` | 子项**中心**与容器可视区中心对齐 ✅ 卡片轮播最常用 |
| \`end\` | 子项**终止边**对齐 |

---

## 辅助属性

### scroll-padding（容器） / scroll-margin（子项）

吸附时给容器或子项加"偏移缓冲"，避免被固定头部遮挡或留出视觉边距：

\`\`\`css
/* 容器：顶部留出 80px 给吸顶头，不吸附到最顶端 */
.page {
  scroll-snap-type: y mandatory;
  scroll-padding-top: 80px;
}
/* 子项：每个 section 顶部分界线比真实 start 高 20px（留白） */
.section { scroll-margin-top: 20px }
\`\`\`

### scroll-snap-stop

\`\`\`css
.item { scroll-snap-stop: always }
\`\`\`

- \`normal\`（默认）：快速滑动可**一次跳过多个**捕捉点（像轮播猛滑滑过好几张）。
- \`always\`：**每个捕捉点都必须停一次**，一次滑动最多过一个点。相册/全屏滑页推荐，不会滑过头。

---

## 实战 1：横向卡片轮播

\`\`\`html
<div class="carousel">
  <div class="slide"><img src="1.jpg"></div>
  <div class="slide"><img src="2.jpg"></div>
  <div class="slide"><img src="3.jpg"></div>
</div>
\`\`\`

\`\`\`css
.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 1rem;     /* 左右留边距，首尾卡也能贴边对齐 */
  scrollbar-width: none;     /* 隐藏滚动条 Firefox */
}
.carousel::-webkit-scrollbar { display: none }  /* Chrome/Safari */
.carousel .slide {
  flex: 0 0 80%;                       /* 每张卡占 80% 宽 */
  scroll-snap-align: center;           /* 居中对齐 */
  scroll-snap-stop: always;            /* 每次滑动只过一张 */
  border-radius: 8px;
  overflow: hidden;
}
.carousel .slide img { width: 100%; display: block }
\`\`\`

不需要 JS 就实现了"居中对齐 + 一次一张"的轮播效果。

### 进阶：加指示点（JS 可选）

\`\`\`js
// 监听滚动位置，高亮当前对应 dot
carousel.addEventListener('scroll', () => {
  const i = Math.round(carousel.scrollLeft / carousel.clientWidth)
  dots.forEach((d, idx) => d.classList.toggle('active', idx === i))
})
\`\`\`

---

## 实战 2：全屏竖滑页（H5 引导页 / App 介绍）

\`\`\`css
html, body { height: 100%; margin: 0 }
.slides {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}
.slides section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: grid;
  place-items: center;
  font-size: 3rem;
}
\`\`\`

每滑一次停在整屏边界。

---

## 实战 3：双轴相册浏览

\`\`\`css
.gallery {
  height: 100vh;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(3, 100%);
  grid-auto-rows: 100vh;
  scroll-snap-type: both mandatory;
}
.gallery img {
  width: 100%; height: 100%; object-fit: cover;
  scroll-snap-align: center;
}
\`\`\`

横滑和竖滑都能精确吸附到每张图。

---

## 实战 4：长文章节吸附（proximity）

\`\`\`css
article {
  scroll-snap-type: y proximity;   /* 靠近才吸附，不强制 */
}
article h2 {
  scroll-snap-align: start;
  scroll-margin-top: 80px;         /* 避开 sticky header */
}
\`\`\`

用户滚动停在章节标题附近时自动对齐，方便阅读；中途停留不会被硬拉走。

---

## 与其他滚动特性组合

### + scroll-behavior: smooth

\`\`\`css
html { scroll-behavior: smooth }
/* 点击锚点跳转时，吸附过程是平滑滚动，体验更好 */
\`\`\`

### + overscroll-behavior

\`\`\`css
.carousel { overscroll-behavior-x: contain }
/* 横向滑到尽头时，不要触发浏览器的前进/后退手势 */
\`\`\`

---

## 常见坑

### 1. 捕捉失效：子项高度/宽度没设好

子项如果完全靠内容撑、尺寸差异大，吸附位置会飘忽。建议统一尺寸或给容器明确视口宽高。

### 2. mandatory 跳屏

动态添加内容或切换页面时，mandatory 可能导致强制跳回之前的捕捉点。解决：动态列表用 \`proximity\`，或先改 \`snap-type: none\` 更新后再改回。

### 3. 固定头部遮挡

Sticky header + scroll-snap 时，start 对齐会被头盖住——必须配 \`scroll-padding-top: headerH\` 或 \`scroll-margin-top\`。

### 4. 移动端手势冲突

与 \`touch-action\` 配合避免缩放、双指手势干扰：

\`\`\`css
.carousel { touch-action: pan-y pinch-zoom }  /* 允许横向滑动的同时保留纵向页面滚动和缩放 */
\`\`\`

---

## 兼容性

- 现代浏览器（2020+）普遍支持。
- Safari 早期版本对 \`scroll-snap-stop: always\` 支持有坑，iOS 上可跳过多个点。
- 早期语法差异较大（\`scroll-snap-coordinate\` 等老属性），新项目直接用新版。

### 降级

不支持时回退为普通滚动——用户只是停在中间位置，功能仍可用，体验渐进增强即可。

## 小结

- 容器：\`scroll-snap-type: [x|y|both] [mandatory|proximity]\`。
- 子项：\`scroll-snap-align: [start|center|end]\` + 可选 \`scroll-snap-stop: always\`。
- 对齐偏移：容器 \`scroll-padding\` / 子项 \`scroll-margin\`。
- 典型场景：轮播（x center + always）、全屏页（y start + always）、相册（both）、章节标题（y proximity）。
- 纯 CSS 替代大量 JS 轮播库代码，但要注意 mandatory 的跳屏坑和 sticky header 遮挡。`
  },
  {
    id: 'css-043',
    category: 'css',
    title: 'CSS 计数器 counter-reset / counter-increment 怎么用？纯 CSS 序号、目录、章节编号',
    difficulty: '简单',
    tags: ['counter-reset', 'counter-increment', 'CSS计数器', 'counters'],
    answer: `## 原理

CSS 计数器是一组"在样式里维护的变量"，可以根据元素在文档中的层级和顺序自动增减，再通过 \`counter()\` / \`counters()\` 函数把数值显示出来。纯 CSS 实现多级编号、目录、榜单排名等。

---

## 三步使用流程

\`\`\`css
/* 1. 在父元素上声明（重置）计数器 */
.todo-list {
  counter-reset: task;  /* 声明计数器 task，初始值 0 */
  /* counter-reset: task 10  也可指定起始值 */
  /* counter-reset: a 0 b 5  可一次声明多个 */
}
/* 2. 在子元素上递增 */
.todo-list li {
  counter-increment: task;   /* 每出现一个 li，task +1 */
  /* counter-increment: task 2   可自定义步长 */
  /* counter-increment: task -1  可递减 */
}
/* 3. 在伪元素里显示 */
.todo-list li::before {
  content: counter(task) '. ';  /* 输出：1. / 2. / 3. ... */
}
\`\`\`

\`\`\`html
<ol class="todo-list">
  <li>起床</li>    <!-- 1. 起床 -->
  <li>吃饭</li>    <!-- 2. 吃饭 -->
  <li>写代码</li>  <!-- 3. 写代码 -->
</ol>
\`\`\`

> 计数器通常配合 \`::before\` / \`::after\` 的 \`content\` 显示，但也可配合 \`target-counter\` 等用于引用页码。

---

## counter() 的编号样式

\`counter(name, style)\` 第二个参数指定数字风格，同 \`list-style-type\`：

\`\`\`css
/* 中文数字：一、二、三…… */
li::before { content: counter(task, cjk-ideographic) '、' }

/* 罗马数字：I / II / III */
li::before { content: 'Part ' counter(task, upper-roman) ': ' }

/* 小写字母：a / b / c */
li::before { content: counter(task, lower-latin) ') ' }
\`\`\`

常见 style：\`decimal\`（默认 1,2,3）、\`lower-alpha\` / \`upper-alpha\`、\`lower-roman\` / \`upper-roman\`、\`cjk-ideographic\`（中文）、\`simp-chinese-formal\`（大写中文壹贰叁）、\`hiragana\`、\`katakana\`、\`disc\` 等。

---

## 嵌套编号（多级目录）：counters()

**目录层级**要输出 \`1.1\`、\`2.3.1\` 这种复合编号，用 \`counters()\`（注意复数，带 s）。

\`\`\`css
/* 父级重置 */
.toc, .toc ul {
  counter-reset: chapter;   /* 每一层 ul 都重置自己的 chapter 计数器 */
  list-style: none;
  padding-left: 1.5em;
}
.toc li {
  counter-increment: chapter;
}
.toc li::marker {   /* 或 ::before */
  content: counters(chapter, '.') '  ';  /* 把所有层级的 chapter 用点连起来 */
  font-weight: 600;
}
\`\`\`

\`\`\`html
<ul class="toc">
  <li>入门
    <ul>
      <li>环境搭建</li>      <!-- 1.1  环境搭建 -->
      <li>Hello World</li>   <!-- 1.2  Hello World -->
    </ul>
  </li>
  <li>进阶
    <ul>
      <li>路由
        <ul>
          <li>动态路由</li>  <!-- 2.1.1  动态路由 -->
        </ul>
      </li>
      <li>状态管理</li>      <!-- 2.2  状态管理 -->
    </ul>
  </li>
</ul>
\`\`\`

**原理**：每个嵌套的 \`ul\` 都会创建一个新的 \`chapter\` 作用域。\`counters(chapter, '.')\` 会把"从外到内所有同名计数器当前值"用分隔符拼接。

\`counters(name, separator, style)\` 也支持第三个参数编号样式。

---

## 组合多个计数器

可以同时维护多个独立计数器：

\`\`\`css
.article {
  counter-reset: h2-counter h3-counter fig-counter;
}
.article h2 {
  counter-increment: h2-counter;
  counter-reset: h3-counter 0;  /* h2 一出现，h3 归零重新计 */
}
.article h2::before { content: '第 ' counter(h2-counter) ' 章 ' }
.article h3 {
  counter-increment: h3-counter;
}
.article h3::before { content: counter(h2-counter) '.' counter(h3-counter) '  ' }
.article figure {
  counter-increment: fig-counter;
}
.article figcaption::before { content: '图 ' counter(h2-counter) '-' counter(fig-counter) '：' }
/* 输出：图 2-3：xxx */
\`\`\`

---

## 非 \`content\` 场景（实验性）

新标准支持在除 \`content\` 外的属性中使用计数器，通过 \`counter-set\` 直接赋值：

\`\`\`css
.item {
  counter-increment: rank;
  /* 用 attr 或自定义属性引用 */
  --rank: counter(rank);  /* 目前兼容性有限 */
}
\`\`\`

主流还是 \`::before/::after + content\` 的组合。

---

## 实战：带括号的榜单 + 末尾总计

\`\`\`css
.rank-list {
  list-style: none;
  counter-reset: rank total 0;
}
.rank-list li {
  counter-increment: rank total;   /* 同时递增两个 */
  padding: .25em 0;
}
.rank-list li::before {
  content: 'TOP ' counter(rank, decimal-leading-zero);
  /* decimal-leading-zero 补零：01 / 02 … */
  display: inline-block;
  width: 4em;
  color: #1890ff;
  font-weight: 600;
}
.rank-list::after {
  content: '— 共 ' counter(total) ' 名获奖者 —';
  display: block;
  margin-top: 1rem;
  text-align: center;
  color: #999;
}
\`\`\`

\`counter(total)\` 会在最后读取到等于列表长度的值，**无需 JS 就显示总数**。

---

## 与 display: none / visibility 的关系

| 元素状态 | counter 是否计数 |
| --- | --- |
| 正常显示 | ✅ 计数 |
| \`display: none\` | ❌ **不计数**（完全从渲染树移除） |
| \`visibility: hidden\` | ✅ 计数（仍占位置） |
| \`opacity: 0\` | ✅ 计数 |
| \`content-visibility: hidden\` | ✅ 计数（保留布局） |

利用这点："只显示前 N，其余 display: none"时，计数器会自动跳过隐藏项，序号不会断层。

---

## 与 ol 原生编号对比

| | ol > li 原生编号 | CSS 计数器 |
| --- | --- | --- |
| 单级 | ✅ 方便 | 稍繁琐 |
| 多级 | ❌ 需 type 属性嵌套 + 自定义麻烦 | ✅ 灵活（1.1 / 1.1.1 / 中文混合） |
| 跨章节跳号 | ❌ 不易 | ✅ counter-reset 精准控制 |
| 与样式联动 | ❌ 难 | ✅ 可按条件 increment |
| 显示总数 | ❌ | ✅ 末尾 counter(total) |

结论：简单单级 → 原生 ol；复杂多级 / 跨章节 / 要显示总数 / 定制编号内容 → CSS 计数器。

---

## 常见坑

### 1. counter-reset 的作用域

计数器跟随**最近的声明它的祖先**。若把 counter-reset 写在 \`body\`，整页只有一个计数器，每个 li 都会累加跨多个 ul 的编号——通常我们想每个 ul 独立，所以 reset 一定写在**直接父级容器**。

### 2. 递增位置要在"显示之前"

\`counter-increment\` 要写在**同一个元素或其子元素的 counter() 引用之前**。浏览器按源码顺序：先 reset（父） → 再 increment（当前 li） → 再 counter() 显示（当前 li::before）。若顺序反会显示错误值。

### 3. 步长为 0 的 increment 无效

\`counter-increment: x 0\` 等于没写，不会"重置"。重置要用 \`counter-reset\` 或新标准 \`counter-set\`。

---

## 兼容性

- \`counter-reset\` / \`counter-increment\` / \`counter()\` / \`counters()\`：**IE8+ 全支持**，非常稳。
- \`counter-set\`（直接赋值，不常用）：Chrome 85+ / Safari 16+ / Firefox 68+。

## 小结

- **三步**：父级 \`counter-reset\` → 子级 \`counter-increment\` → \`::before\` 里 \`counter()\` 显示。
- **多级目录**：每层容器都 reset 同名计数器，显示用 \`counters(name, '.')\` 字符串拼接。
- **编号样式**：counter 第二参数传 \`cjk-ideographic\` / \`upper-roman\` 等。
- **跨章节**：h2 里重置 h3 子计数，实现"第 N 章 → N.M 节"效果。
- 极稳的老特性（IE8+），纯 CSS 解决编号、目录、榜单，无任何 JS 开销。`
  },
  {
    id: 'css-044',
    category: 'css',
    title: '深入层叠上下文（Stacking Context）：形成条件、层叠顺序、常见 z-index 陷阱',
    difficulty: '困难',
    tags: ['层叠上下文', 'z-index', '堆叠顺序', 'isolation'],
    answer: `## 一、什么是层叠上下文

把页面想象成叠起来的透明胶片：每张胶片是一个"层叠上下文"，胶片里的元素按顺序排；不同胶片之间按"胶片优先级"叠。\`z-index\` 只在**同一张胶片里比较**才有意义——跨胶片无论多大值都没用。

> 根元素 \`<html>\` 默认就是一张最底层的胶片（根层叠上下文）。

---

## 二、形成层叠上下文的全部条件（2025 版）

满足**任意一条**就会创建独立层叠上下文：

### 1. 经典定位 + z-index
- \`position: relative / absolute\` 且 \`z-index\` 不为 \`auto\`
- \`position: fixed / sticky\`（**无论 z-index 是否 auto 都会创建**，许多人踩坑）

### 2. Flex / Grid 项 + z-index
- Flex / Grid 的直接子元素，且 \`z-index\` 不为 \`auto\`

### 3. 特殊属性值（不依赖 position！）
- \`opacity < 1\`（哪怕 0.999）
- \`transform\` 不为 \`none\`
- \`filter\` 不为 \`none\`
- \`perspective\` 不为 \`none\`
- \`backdrop-filter\` 不为 \`none\`（毛玻璃必创建）
- \`mix-blend-mode\` 不为 \`normal\`
- \`clip-path\` 不为 \`none\`
- \`mask\` / \`mask-image\` 不为 \`none\`

### 4. will-change
- \`will-change\` 设了任意会创建层叠上下文的属性值（如 \`will-change: transform, opacity\`）

### 5. 隔离与布局
- \`isolation: isolate\`（**最干净的手动创建方式，无副作用**）
- \`contain: layout / paint / strict / content\`
- \`content-visibility: auto\`

### 6. 容器（新）
- \`container-type: size\` 或 \`inline-size\`（容器查询容器）

### 7. 特定元素
- \`<video>\`、\`<canvas>\`、WebGL、\`<iframe>\` 等替换元素

> 加粗记忆：**定位+z、fixed/sticky、flex/grid 子+z、opacity<1、transform、filter、mix-blend、clip-path、mask、backdrop-filter、will-change、isolation、contain、container-type**。

---

## 三、同一层叠上下文内的层叠顺序（从下→上）

理解顺序才能解释"为什么 \`z-index: 999\` 反而在下面"：

| 层级 | 元素类别 | 说明 |
| --- | --- | --- |
| 1 最底 | 背景与边框 | 层叠上下文根元素自身的背景和边框 |
| 2 | 负 z-index 子项 | \`z-index: -1\` |
| 3 | 块级元素（正常流） | 没有定位的 block |
| 4 | float 元素 | 浮动元素（仍在正常流之上） |
| 5 | inline / inline-block 元素 | 行内文字 |
| 6 | \`z-index: auto / z-index: 0\` 的定位项 | 及其他创建了层叠上下文但 z-index 未设置的 |
| 7 最顶 | 正 z-index 定位项（值越大越上） | \`z-index: 1 / 2 / 999\` |

**核心口诀**：负→块→浮→行→auto→正。inline 比 float 高，所以浮动能被文字环绕（文字在上层能盖过浮动块）。

---

## 四、3 个经典 z-index 陷阱

### 陷阱 1：父层叠上下文低，子 z-index 再大也白搭

\`\`\`html
<div class="A" style="position: relative; z-index: 1">
  <div class="A-child" style="position: absolute; z-index: 999">我是 A 儿子</div>
</div>
<div class="B" style="position: relative; z-index: 2">我是 B</div>
\`\`\`

**结果**：A-child(999) **永远被 B 盖住**，不管 z-index 多大。

**原因**：
- A 创建了层叠上下文（z=1），B 也创建（z=2）。
- A-child 的 z-index **只在 A 内部比较**。
- A 整体 vs B 整体比较：A(1) < B(2) → B 在上。
- 所以 A 的所有子元素（包括 999 那个）都整整齐齐待在 B 下方。

**解决**：把 A 的 z-index 提到 ≥ B 的 z-index，或重新组织 DOM 让需要在上的元素出现在后。

### 陷阱 2：opacity / transform 隐式创建了上下文（最常见）

\`\`\`html
<div class="modal-mask" style="opacity: .9">
  <div class="modal" style="position: absolute; z-index: 999">弹窗</div>
</div>
<div class="nav" style="position: fixed; z-index: 100">导航</div>
\`\`\`

期望：modal(999) 盖住 nav(100)。
**结果**：nav 反而盖住了 modal！

**原因**：
- \`.modal-mask\` 有 \`opacity: .9 < 1\` → 隐式创建层叠上下文，它自身的 z-index 是 **auto（= 0）**。
- \`.nav\` 是 fixed + z=100 → 独立层叠上下文。
- 根层叠上下文里比较：modal-mask(0) vs nav(100) → nav(100) 在上。
- modal 的 z=999 **被关在 mask 那层里**，没法跳出来和 nav 比。

**解决**：
- 给 \`.modal-mask\` 显式设足够大的 z-index：\`position: relative; z-index: 1000\`（让整个 mask 组在上）。
- 或避免 mask 和 modal 嵌套：两个元素同级，各自独立 z-index。

### 陷阱 3：isolation: isolate 意外"封印"内部 z-index

\`\`\`css
.card-group { isolation: isolate }  /* 本意是隔离混合模式渲染 */
.card .tag { position: absolute; z-index: 999 }   /* 期望盖在组外的 tooltip 上 */
.tooltip-outside { z-index: 500 }
\`\`\`

结果：tag(999) 盖不住 tooltip(500)。

**原因**：\`isolation: isolate\` 本来是给 \`mix-blend-mode\` 做渲染隔离的，但副作用是**创建独立层叠上下文**。card-group 整体 z 为 auto(0)，内部 999 出不来。

**解决**：理解 isolation 会创建层叠上下文，合理设置容器整体 z-index，或将 tooltip 移入同组。

---

## 五、调试方法

Chrome DevTools → Layers 面板（或 More tools → Layers）：
- 查看所有合成层，按三维 z 方向堆叠展示。
- 鼠标悬停高亮页面对应元素。
- Memory 栏查看每层的显存占用。

Elements → Styles → 右侧点 "Layers" 图标（新版本），可直接看当前元素所在层叠上下文的祖先链。

---

## 六、管理 z-index 的最佳实践

### 1. 分层命名 + 集中定义

不要散落魔术数字，统一在一处声明：

\`\`\`css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-drawer: 500;
  --z-modal-mask: 900;
  --z-modal: 1000;
  --z-message: 1500;
  --z-tooltip: 2000;
}
.dropdown { z-index: var(--z-dropdown) }
.modal-mask { position: fixed; z-index: var(--z-modal-mask) }
.modal      { position: fixed; z-index: var(--z-modal) }
\`\`\`

### 2. 层级扁平化，避免嵌套过深

模态框、抽屉、消息等**挂到 body 根级**（Portal / Teleport），不要包在有 z-index 的组件内。

### 3. 用 isolation: isolate 手动隔离（最干净）

需要"内部 z-index 不泄漏、也不受外部干扰"时，给容器加：

\`\`\`css
/* 这一层所有 z 都独立，相当于新建一张干净的胶片 */
.card-slider { isolation: isolate }
\`\`\`

相比 \`transform/opacity/filter\` 的隐式创建，\`isolation: isolate\` 没有渲染副作用，是**最纯粹、语义最明确**的创建方式。

### 4. 不要用巨型 z-index（99999）

一旦有一个 99999，后面的人只能用 999999，最后全是 6 个 9。集中定义分层常量就不会走到这一步。

### 5. 需要置顶时排查"隐式创建祖先"

元素设了 z-index 仍不上来 → 往上检查每一层祖先：
1. 是否 \`position: fixed/sticky\`
2. 是否 \`opacity < 1\`
3. 是否 \`transform\` / \`filter\` / \`backdrop-filter\` / \`mix-blend-mode\`
4. 是否 \`isolation\` / \`contain\` / \`container-type\`
5. Flex/Grid 子且设了 z-index

**找到第一个创建层叠上下文的祖先，给它提升 z-index，或把需要置顶的元素移到那个祖先之外。**

---

## 七、快速解题模板（面试题"为什么 z-index 不生效"）

1. **z-index 没生效**：检查元素是不是定位元素 / flex-grid 子 → z-index 只对它们有效。
2. **z-index 大反而在下面**：八成是**父层叠上下文的 z 更低**，或祖先被 \`opacity/transform/backdrop-filter\` 隐式创建了低 z 上下文。
3. **z-index 小反而在上面**：检查 DOM 顺序，同层级 z-index 相同时后写的在上。或它的父级是不同层叠上下文、父级 z 更高。

---

## 小结

- 层叠上下文 = 一张"独立 z 胶片"，\`z-index\` 只在同一张内有效。
- 触发条件远远不止"定位 + z-index"，尤其是 **opacity/transform/filter/backdrop-filter/fixed/sticky/isolation/container-type** 这些"静默创建"最容易踩坑。
- 内部层叠顺序：负 z → 块 → 浮 → 行 → auto/0 → 正 z。
- 三大经典陷阱：父上下文 z 低、隐式上下文关住子 z、isolation 意外封层。
- 治理：集中 z-index 变量、扁平化 DOM（Portal/Teleport）、用 \`isolation: isolate\` 显式隔离。
- 调试：Chrome DevTools Layers 面板。`
  }
]
