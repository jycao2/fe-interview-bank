// 移动端 / 小程序 / uni-app Q&A 题库
// 分类 id: mobile（统一一个大分类，tags 区分方向：移动端H5、微信小程序、uni-app、Taro、Hybrid、RN、Flutter 等）
export const mobileQuestions = [
  {
    id: 'mob-001',
    category: 'mobile',
    title: '移动端 H5 常见的兼容问题有哪些？如何处理 iOS/Android 差异？',
    difficulty: '中等',
    tags: ['移动端H5', '兼容性', 'iOS', 'Android', 'WebKit'],
    answer: `## 一、iOS 与 Android 常见差异

| 问题 | iOS | Android | 处理方式 |
| --- | --- | --- | --- |
| 点击延迟 300ms | 历史存在（禁用双击缩放时消失） | 通常无 | 加 \`<meta name="viewport" content="user-scalable=no">\` 或 CSS \`touch-action: manipulation\` |
| \`100vh\` 被地址栏挤占 | ✅ 典型问题（Safari 视口高度不包含地址栏） | 较少 | 使用 \`100dvh\`（动态 vh），或 JS 读取 \`window.innerHeight\` 设为 CSS 变量 |
| fixed 元素被键盘顶起 | 常见（尤其是旧版 iOS） | 部分机型 | 聚焦时改为 absolute，或使用 \`visualViewport\` 事件 |
| 弹性滚动（橡皮筋） | 系统自带，需加 \`-webkit-overflow-scrolling: touch\` 到内部滚动容器 | 多数支持 | 统一内部容器样式 + overflow: auto + 上述属性 |
| 时间格式 \`new Date('2024-05-01 10:00')\` | ❌ 返回 Invalid Date（只接受 \`YYYY/MM/DD HH:mm:ss\` 或 ISO8601） | 部分 OK | 统一替换为 \`new Date('2024-05-01T10:00:00')\`，或使用 dayjs/date-fns |
| 表单元素默认样式 | \`input/button\` 有圆角、阴影 | 默认较扁平 | \`-webkit-appearance: none; appearance: none\` 重置 |
| 视频自动播放 | 必须 \`muted playsinline\` | 策略不同但相对宽松 | 统一加 \`<video muted playsinline autoplay loop>\`，首帧用 poster |
| 安全区域刘海屏 | \`env(safe-area-inset-*)\` 必须加 \`viewport-fit=cover\` | 少数异形屏 | \`padding-bottom: env(safe-area-inset-bottom)\` + viewport meta |

## 二、通用移动端 H5 兼容点

1. **Retina 1px 边框**：
   - 原因：\`border: 1px\` 在 dpr=2/3 的屏幕显示为 2/3 物理像素，视觉上偏粗。
   - 方案：伪元素 + scale(0.5 / 0.333)，或 \`border-image\`，或 CSS \`@supports (-webkit-mask-box-image)\` + 细线图。

2. **图片模糊**：
   - dpr>1 下普通尺寸图片会糊，用 @2x/@3x 图，或根据 \`window.devicePixelRatio\` 动态切换 URL。

3. **\`input type=search\` iOS 自动圆角**：
   - 需加 \`-webkit-appearance: none\` 才能重写样式。

4. **禁止缩放 / 双击放大 / 长按弹出菜单 / 选中**：
   \`\`\`css
   html { touch-action: manipulation; }
   body { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
   \`\`\`

5. **\`position: fixed\` 下输入框光标错位（iOS）**：
   - 原因：软键盘弹出时，WebKit 对 fixed 容器做特殊合成。
   - 方案：聚焦时把弹层改为 \`position: absolute\`，或使用 scrollIntoView + translateY。

## 三、检测与降级

- 特性检测：Modernizr、\`CSS.supports\`、\`'ontouchstart' in window\`（⚠️ 仅表示支持触摸，不代表就是移动设备）。
- UA 检测：\`/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)\` 做兜底，iPad iOS13+ UA 含 Macintosh 需结合 \`navigator.maxTouchPoints > 1\` 识别。
`
  },
  {
    id: 'mob-002',
    category: 'mobile',
    title: '谈谈 viewport 原理：width=device-width、initial-scale、viewport-fit=cover 的作用',
    difficulty: '简单',
    tags: ['viewport', '移动端', 'meta标签', '适配'],
    answer: `## 为什么需要 viewport

早期手机浏览器把页面放到一个宽约 980px 的"虚拟视口（layout viewport）"里渲染，再整体缩放到屏幕，导致桌面页面在手机上极小。\`<meta name="viewport">\` 告诉浏览器用多大的虚拟视口来渲染。

## 标准写法

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
\`\`\`

## 各属性解析

| 属性 | 作用 |
| --- | --- |
| \`width=device-width\` | 虚拟视口宽度 = 设备独立像素宽度（逻辑像素，如 iPhone 14 为 390px） |
| \`initial-scale=1.0\` | 初始缩放 100%（与 width=device-width 一起写，兼容不同浏览器对默认值的实现） |
| \`maximum-scale=1.0 / minimum-scale=1.0\` | 限制最大/最小缩放，配合禁止缩放 |
| \`user-scalable=no\` | 禁止用户双指/双击缩放（iOS 部分新版本会忽略，但仍建议写；会消除 300ms 点击延迟） |
| \`viewport-fit=cover\` | iOS 11+，让页面延伸到刘海/底部安全区域；配合 \`env(safe-area-inset-*)\` 用 |

## 三种视口的关系

1. **视觉视口（visual viewport）**：用户当前看到的区域（会随缩放、键盘弹出变化）。
2. **布局视口（layout viewport）**：CSS 百分比计算的基准，由 viewport meta 控制。
3. **理想视口（ideal viewport）**：设备的最佳视口宽度（\`width=device-width\` 就是取它）。

## 响应式像素换算

- \`物理像素 = 逻辑像素 × devicePixelRatio\`。
- 设计稿常给 750px（2 倍图，对应 375 逻辑宽的 iPhone 6/7/8），代码用 375 基准即可，1:2 换算。
- 方案可用 **rem + flexible**（老方案，已不推荐），推荐 **vw/vh + px + PostCSS px-to-viewport**，或 Tailwind 断点。

## 常见坑

- Android 微信/QWebView 部分机型不响应 viewport meta：检查是否被 X5 内核覆盖，可加 \`QWebView\` 强制内核属性。
- iPad iOS 13+ 默认"请求桌面网站"，UA 看起来是 Mac，需加 viewport meta 才会正常显示移动端。
`
  },
  {
    id: 'mob-003',
    category: 'mobile',
    title: '移动端 H5 适配方案有哪些？rem、vw、flexible、postcss-px-to-viewport 的原理与区别？',
    difficulty: '中等',
    tags: ['适配', 'rem', 'vw', 'postcss', 'lib-flexible'],
    answer: `## 一、几种主流方案对比

| 方案 | 原理 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **固定宽度**（如 width:320px + margin:auto） | 所有设备居中显示，两侧留白 | 实现最简单 | 大屏留白多，体验差 |
| **百分比布局** + 媒体查询 | \`%\` 相对父容器；\`@media\` 断点适配 | 无需额外工具 | 高度难按比例；文字尺寸难统一 |
| **rem + flexible**（手淘方案） | 以 \`<html>\` 的 \`font-size\` 作为换算基准（1rem = 屏幕宽/10），JS 动态设置 | 当年兼容性好、生态全 | 依赖 JS 首屏闪烁；非等比屏幕变形；iPad 横屏爆炸；已被官方废弃 |
| **vw/vh 方案**（当前主流） | 1vw = 视口宽/100；1vh = 视口高/100 | 纯 CSS，原生支持，无 JS；dpr 无关 | 无法锁定最大宽度；\`1px\` 问题仍要单独处理；小数精度差 |
| **混合方案**（推荐） | \`px\`（不缩放的文字边框）+ \`vw\`（布局宽度）+ \`@media\` 断点 + 最大宽度夹取 | 兼顾设计稿还原与可维护 | 需要团队约定 |

## 二、rem + flexible 原理（回顾）

1. flexible 会读取 \`window.innerWidth\`，设置 \`html.style.fontSize = width/10 + 'px'\`。
2. 设计稿 750px 宽度下，1rem = 75px；于是 750px 设计稿元素宽 150px → 150/75 = **2rem**。
3. 同时根据 dpr 设置 \`<meta viewport scale=1/dpr>\` 解决 1px 问题（副作用：字体非等比，需二次换算）。

缺点：**iOS 11 已全面支持 vw，阿里团队 2018 年宣布废弃 flexible，全面转向 vw**。

## 三、postcss-px-to-viewport 工作流

1. 开发时照常写 **px**（设计稿尺寸）。
2. PostCSS 构建时把 \`px\` 自动转换成 \`vw\`（基于设计稿宽度 750）：\`100vw / 750 * Npx = ?vw\`。
3. 可配置：
   - \`unitPrecision: 5\`：保留 5 位小数。
   - \`selectorBlackList: ['.ignore']\`：哪些选择器不转换。
   - \`minPixelValue: 1\`：≤1px 不转换（保留 1px 细线）。
   - \`mediaQuery: true\`：媒体查询里也转。

示例配置：
\`\`\`js
// postcss.config.js
export default {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 750,
      unitPrecision: 5,
      viewportUnit: 'vw',
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/node_modules/]
    }
  }
}
\`\`\`

## 四、推荐的现代适配组合

1. **布局容器**：用 \`vw\` 控制宽/内边距/栅格。
2. **字号/圆角/边框**：用 \`px\` 固定（文字在大屏更易读，无需按比例放大）。
3. **安全区域**：\`env(safe-area-inset-*)\` + \`viewport-fit=cover\`。
4. **1px 细线**：\`transform: scaleY(0.5)\` 或 PostCSS 插件。
5. **横屏 / 平板**：加 \`@media (min-width: 768px)\` 走独立样式，或设置页面最大宽度夹取：\`.app { max-width: 750px; margin: 0 auto; }\`。
`
  },
  {
    id: 'mob-004',
    category: 'mobile',
    title: '微信小程序的运行架构是什么？双线程模型（View 层 + AppService 层）是如何通信的？',
    difficulty: '中等',
    tags: ['微信小程序', '双线程', '运行架构', 'View', 'AppService', 'WebView', 'JSCore'],
    answer: `## 一、小程序运行架构总览

微信小程序并不是跑在浏览器里的 H5，它是一套**双线程 + 原生能力桥接**的运行时：

\`\`\`
┌──────────────────────────────────────────────────┐
│                   微信 App（客户端）               │
│  ┌────────────────────┐   ┌───────────────────┐  │
│  │   View 层（渲染层）  │   │ AppService（逻辑层）│  │
│  │  * 基于 WebView     │   │  * 基于 JSCore /    │  │
│  │  * 一个页面一个 WV  │   │    V8（无 DOM/BOM） │  │
│  │  * 执行 WXML/WXSS   │   │  * 执行 JS 逻辑、   │  │
│  │    渲染、事件绑定    │   │    生命周期、数据   │  │
│  └─────────┬──────────┘   └─────────┬─────────┘  │
│            │   Native（WeixinJSBridge / 消息通道）│
│            └──────────┬──────────────┘            │
│                       │                           │
│              原生能力层：相机/支付/定位/存储…       │
└──────────────────────────────────────────────────┘
\`\`\`

## 二、为什么是"双线程"

1. **安全管控**：把 JS 放到没有 DOM/BOM 的 JSCore/V8 沙箱里跑，从源头上禁止动态脚本、DOM 操作、iframe、eval 等越权能力。
2. **性能隔离**：渲染与逻辑不抢主线程。H5 里 JS 执行阻塞渲染是常见痛点；小程序把它们放到两个线程并行。
3. **统一可控**：WXML/WXSS 先经微信侧 DSL 编译，再下发渲染，便于跨平台与版本管控。

## 三、两线程的分工

### View 层（渲染层）
- **技术**：iOS 用 WKWebView，Android 早期 X5 WebView，现也有自研渲染器（Skyline）。
- **职责**：
  - 解析 WXML → 生成 Virtual DOM → 渲染成真实节点。
  - 处理用户交互（tap/scroll/input），把事件**封装成消息**发给逻辑层。
  - 接收逻辑层的 \`setData\` 数据差量，合并后 diff 更新 UI。

### AppService 层（逻辑层）
- **技术**：iOS = JavaScriptCore，Android = V8，开发工具 = NW.js。
- **职责**：
  - 执行 \`App() / Page() / Component()\` 注册代码。
  - 维护 \`data\`、生命周期钩子、事件处理函数。
  - 调用 wx.* API → 通过 Native Bridge 调原生。
  - 数据变化通过 \`setData\` 序列化后发给 View 层。

## 四、双线程如何通信（核心）

1. **通道**：通过**微信客户端提供的 Native Bridge**（开发者工具里是 WebSocket + postMessage 模拟）。
2. **数据形态**：所有数据必须**可 JSON 序列化**（不能有 Function / undefined / 循环引用），因此 \`setData\` 里不能直接传函数。
3. **View → AppService**：
   - 用户点击按钮 → View 层捕获事件 → 打包成 \`{type:'event', name:'tap', dataset:{...}, ...}\` → 走 Bridge → AppService 层触发对应 Page 的 handler。
4. **AppService → View**：
   - 调用 \`this.setData({ a: 1 }) \` → 逻辑层 diff（只传变化键，且路径压缩）→ JSON 序列化 → Bridge → View 层合并到自己的 shadow tree → 触发 Virtual DOM patch → 渲染。
5. **典型性能杀手**：
   - \`setData\` 传**大量数据**（列表一次性上万条），Bridge 序列化/传输成本高。
   - 高频 \`setData\`（scroll 回调里每帧都调），导致消息队列堆积，渲染掉帧。

## 五、引申：Skyline 渲染引擎（2022 后）

微信 2022 年推出的新渲染器，把 View 层从 WebView 替换为**自研的类 Flutter 渲染管线**（Skia 绘制 + 自绘组件），好处：
- 首屏更快（不需要启动 WebView）。
- 渲染性能更高，列表更丝滑。
- 支持 Worklet（在渲染线程跑轻量动画，不跨线程通信）。

但开发者写的 WXML/WXSS/JS 基本不用改，双线程模型保持不变，只是 View 层实现换了。
`
  },
  {
    id: 'mob-005',
    category: 'mobile',
    title: '小程序 setData 的原理、常见误区与性能优化技巧？',
    difficulty: '中等',
    tags: ['小程序', 'setData', '性能优化', 'diff', '数据传输'],
    answer: `## 一、setData 做了什么

调用 \`this.setData({ key: value })\` 会依次经过：

1. **逻辑层**：把新 data 和旧 data 做**浅层 diff**（按 key 对比，记录 changed keys）。
2. **序列化**：changed keys 对应的值 JSON 序列化，构造成数据差量包。
3. **跨线程传输**：走 Native Bridge（底层是 IPC / socket），从 AppService 发到 View。
4. **View 层合并**：用路径把差量合并到自己的渲染数据树上。
5. **V-DOM diff & patch**：WXML 渲染引擎计算最小 DOM 变更，更新 UI。
6. **回调**：触发 \`setData\` 第二个参数（rendered 回调）。

**所以 setData 的开销 ≈ 序列化开销 + IPC 开销 + 渲染开销，三者都和"变化数据的大小 + 调用频率"正相关。**

## 二、常见误区

| ❌ 错误写法 | 问题 | ✅ 建议 |
| --- | --- | --- |
| 每次 \`setData({ list: [...newItems] })\` 覆盖整个长列表 | 全量序列化/传输 | 用 \`setData({ 'list[3].name': 'x' })\` 路径写法；新增用 \`list.splice(...)\` 后再更新对应 index |
| scroll/input 每帧都 \`setData\` | 队列堆积、掉帧、输入延迟 | 节流/防抖；非展示数据**不要放到 data 里**，挂到 this.xxx 上 |
| 把 \`undefined / Function / RegExp / DOM\` 塞进 data | 序列化丢值或报错 | data 只放可 JSON 化的纯数据 |
| 单次 setData 传 几百 KB | IPC 卡顿，低内存机型崩溃 | 单次 ≤ 256KB（官方建议）；列表分页 |
| 后台页面还在 setData（被 onShow 之前的定时器触发） | 用户感知不到却消耗资源 | onHide/onUnload 里清定时器与订阅 |

## 三、优化技巧清单

1. **只 set 变化的字段，且用路径语法**：
   \`\`\`js
   // ❌ 整对象更新
   this.setData({ user: { ...this.data.user, name: 'New' } })
   // ✅ 路径精确更新
   this.setData({ 'user.name': 'New' })
   // ✅ 数组索引
   this.setData({ 'list[2].title': '新标题' })
   \`\`\`

2. **把不需要渲染的中间态放到 this 上，而非 data**：
   \`\`\`js
   // ✅ 推荐
   onLoad() { this.timer = setInterval(...) }
   onUnload() { clearInterval(this.timer) }
   // data 里只放模板要用的字段
   \`\`\`

3. **列表优化**：
   - **长列表**：\`<scroll-view>\` + \`enhanced show-scrollbar\` + 虚拟化（或者 \`recycle-view\` 官方组件）。
   - **无限加载**：分页追加，不要重置全量；用 \`this.data.list.push(...)\` 后再以索引范围 setData。
   - **图片**：\`<image>\` 加 \`lazy-load\` + 固定宽高比（避免重排）。

4. **频率控制**：
   - 对 scroll 回调使用 \`throttle 16~32ms\`。
   - 动画/拖拽过程中若无需精确渲染，用 **WXS 响应事件**（WXS 直接运行在 View 层，不跨线程，典型如 movable-view）。
   - 搜索输入用 debounce。

5. **避免重复渲染**：
   - 子组件使用 \`pureDataPattern\` 或 \`observers\` 只监听必要字段。
   - 模板里 \`wx:if\` vs \`hidden\`：频繁切换用 \`hidden\`，一次判断用 \`wx:if\`。

6. **官方工具**：
   - 开发者工具 → 性能面板，抓 setData 的 size 与频率。
   - "Audits → 体验评分" 会直接给出 setData 相关问题。
`
  },
  {
    id: 'mob-006',
    category: 'mobile',
    title: '小程序生命周期（App/Page/Component）有哪些？执行顺序是怎样的？',
    difficulty: '简单',
    tags: ['小程序', '生命周期', 'App', 'Page', 'Component', '执行顺序'],
    answer: `## 一、App 级（全局）

\`\`\`js
App({
  onLaunch(options) {}  // 1. 冷启动时调用一次，热启动不触发；options 含启动参数（scene、query、shareTicket）
  onShow(options)   {}  // 2. 小程序从后台切前台或冷启动完成
  onHide()          {}  // 3. 小程序从前台切后台（点左上角/锁屏/Home）
  onError(msg)      {}  // 全局 JS 报错兜底
  onUnhandledRejection(res) {} // Promise 未捕获 reject
  onPageNotFound(res){} // 页面不存在（可做兜底跳转）
  globalData: { ... }
})
\`\`\`

冷启动顺序：**onLaunch → onShow**；热启动（切回前台）只会触发 **onShow**。

## 二、Page 级（页面）

| 钩子 | 触发时机 | 能做什么 | 不能做 |
| --- | --- | --- | --- |
| \`onLoad(query)\` | 页面加载一次 | 获取路由参数、发起首屏请求 | 不能操作 DOM；setData 会被收进首帧一起渲染 |
| \`onShow\` | 页面显示（每次进入） | 埋点曝光、刷新数据 | — |
| \`onReady\` | 初次渲染完成（一次） | \`wx.createSelectorQuery\`、\`wx.createVideoContext\` 获取节点上下文 | — |
| \`onHide\` | 页面被遮住（navigateTo / tab 切走 / App onHide） | 清定时器、取消订阅 | — |
| \`onUnload\` | 页面销毁（redirectTo / navigateBack 超栈） | 清理所有订阅 | — |

### 附加路由钩子
- \`onPullDownRefresh()\`：下拉刷新（需在 json 里配置 \`enablePullDownRefresh: true\`）。
- \`onReachBottom()\`：触底加载。
- \`onPageScroll({ scrollTop })\`：滚动回调（注意节流）。
- \`onShareAppMessage\` / \`onShareTimeline\`：右上角分享配置。
- \`onResize({ size })\`：屏幕尺寸变化（横竖屏切换）。
- \`onTabItemTap\`：tabBar 页面点击 tab 时触发。

## 三、Component 级（自定义组件）

| 钩子 | 触发时机 |
| --- | --- |
| \`created\` | 组件实例刚创建，**还不能 setData**，只能挂 this 上 |
| \`attached\` | 组件进入页面节点树，可 setData（常用） |
| \`ready\` | 组件布局完成，可获取节点信息 \`this.createSelectorQuery\` |
| \`moved\` | 组件在节点树中被移动 |
| \`detached\` | 组件从节点树移除（清理订阅） |
| \`error\` | 组件方法抛错，\`observers\` 抛错也会进 |
| \`lifetimes: { ... }\` | 推荐写法（新规范），放到 \`lifetimes\` 里，与旧写法同时存在时以它为准 |

Component 还有 **页面级生命周期**（组件监听所在页面的钩子）：
\`\`\`js
Component({
  pageLifetimes: {
    show() {},     // 页面 onShow
    hide() {},     // 页面 onHide
    resize() {}    // 页面 onResize
  }
})
\`\`\`

## 四、典型执行顺序

### 冷启动打开首页面 A（A 里用了组件 C）：
\`\`\`
App.onLaunch
App.onShow
  PageA.onLoad
    C.created
    C.attached
  PageA.onShow
    C.ready
  PageA.onReady
\`\`\`

### navigateTo 跳转到页面 B：
\`\`\`
PageA.onHide
  PageB.onLoad
  PageB.onShow
  PageB.onReady
\`\`\`

### navigateBack 回 A：
\`\`\`
PageB.onUnload
  PageA.onShow
\`\`\`

### Home 切后台再切回：
\`\`\`
App.onHide → PageA.onHide
（回来）
App.onShow → PageA.onShow
\`\`\`
`
  },
  {
    id: 'mob-007',
    category: 'mobile',
    title: '微信小程序和 H5 的区别？小程序对比 Taro / uni-app / RN / Flutter 的选型建议？',
    difficulty: '困难',
    tags: ['小程序', 'H5', 'Taro', 'uni-app', 'React Native', 'Flutter', '选型'],
    answer: `## 一、小程序 vs H5

| 维度 | H5（移动端 WebView） | 微信小程序 |
| --- | --- | --- |
| **运行环境** | 浏览器内核，有完整 window/document/DOM/BOM | 双线程：View=WebView/Skyline，逻辑=JSCore/V8（无 DOM/BOM） |
| **启动速度** | 受网络 + 资源加载影响，白屏久 | 冷启动需下载包，但小程序框架常驻、分包预加载，通常更快 |
| **系统权限** | 相机/定位/蓝牙需用户授权，且浏览器限制多 | wx.* API 直接调原生，能力完整、体验统一 |
| **发布方式** | 发服务器，随时更新 | 必须经过微信审核（1~7 天），灰度可通过"体验版 + 灰度发布" |
| **分享/流量** | 分享链接，流量入口依赖广告/H5 跳转 | 朋友圈/会话/扫一扫/搜索/附近小程序，入口极多，裂变友好 |
| **包大小** | 无严格限制，取决于加载性能 | 主包 ≤ 2MB，总包 ≤ 20MB（依赖分包与独立分包） |
| **技术栈自由** | 任何前端框架都行 | 原生 WXML/WXSS，或 Taro/uni-app 等编译层 |
| **支付/登录** | 走 H5 支付，需额外域名；登录需 OAuth 跳转 | wx.login + 服务端 code2Session；wx.requestPayment 一键拉起 |

## 二、几种跨端/小程序框架对比

### 1. uni-app（Vue 生态）
- **出品**：DCloud（HBuilderX 团队）。
- **原理**：一套 Vue 3 / 2 代码 → 编译到 H5、微信/支付宝/抖音/快手小程序、App（iOS/Android，双端基于 WebView+原生桥，也可选 nvue/UTS 原生渲染）。
- **优势**：
  - 国内**小程序平台覆盖最全**（含各家小程序、快应用）。
  - Vue 语法上手极快，生态组件（uni-ui、uView）成熟。
  - H5 端输出为标准 Vue SPA，浏览器下无额外运行时。
  - App 端：可搭配 UTS（类似 TS→原生语言）写高性能插件。
- **劣势**：
  - 各平台差异仍需条件编译（\`#ifdef MP-WEIXIN ... #endif\`）。
  - App 端非完全原生（默认 WebView，性能与 RN/Flutter 有差距）。

### 2. Taro（京东出品，React/Vue 双栈）
- **原理**：一套 React / Vue 3 代码 → 编译输出小程序、H5、RN、鸿蒙。
- **优势**：
  - 编译期做得非常彻底，代码产物更接近原生小程序手写（体积/性能友好）。
  - 支持 React 语法（Hooks、Redux/Zustand）与 TS 一流。
  - 与 React Native 打通较好（同构代码复用率高）。
- **劣势**：
  - 历史版本升级较"重"（1/2/3 大版本断裂多，4.x 后趋稳）。
  - 国内非微信小程序平台覆盖率略低于 uni-app。

### 3. React Native
- **定位**：真正的跨端**原生渲染**框架（不跑 WebView，控件是系统原生 View/UIView），不是专门为小程序准备。
- **原理**：React 描述 UI → JS 线程生成 Shadow Tree → Bridge 传到 UI 线程 → 系统原生控件渲染。新架构（Fabric/TurboModules）已改为 JSI 直接绑定 C++，减少 Bridge 开销。
- **优势**：性能接近原生；iOS/Android 共享代码率 70%~90%；大型团队成熟。
- **劣势**：Bridge/JSI 问题；原生能力仍需写 Objective-C/Java/Kotlin 桥接；小程序端不能直接跑，需要 Taro 转译一层。

### 4. Flutter
- **定位**：Google 出品的**自绘 UI 框架**（Skia/Impeller 直接绘像素，不使用系统控件）。
- **原理**：Dart 语言 AOT 编译到 ARM 机器码，UI 树直接在渲染线程绘制。
- **优势**：
  - iOS/Android/Web 几乎像素级一致。
  - 性能最高（复杂动画、大列表碾压 RN）。
  - 语言 + 渲染引擎统一，"一次编写处处运行"贯彻得最彻底。
- **劣势**：
  - **不能直接出小程序**（需用 Flutter→小程序的实验性编译如 flutter\_mp、flutter\_wechat，生态不成熟）。
  - Dart 语言生态小于 JS；包体积相对大。

## 三、选型建议（实用版）

| 业务需求 | 首选方案 |
| --- | --- |
| 只做微信小程序，团队 Vue | uni-app 或原生小程序 |
| 只做微信小程序，团队 React | Taro 或原生小程序 |
| 需同时覆盖 **多家小程序**（抖音/支付宝/百度）+ H5 | **uni-app**（国内最全） |
| 需同时出 **小程序 + App（高性能）** | **Taro + RN**（小程序走 Taro，App 走 RN 同构） |
| 只做 App（iOS/Android），性能要求极高 | **Flutter** 优先 |
| 公司是 JS/Vue 生态，需 App + H5 + 小程序都要，性能要求中等 | **uni-app**，App 端上 UTS 补性能 |
| 强依赖定制能力 + 极致体验 + 无跨平台执念 | 双端原生（Swift/Kotlin） |
`
  },
  {
    id: 'mob-008',
    category: 'mobile',
    title: 'uni-app 的运行原理、条件编译、跨端适配策略？pages.json / manifest.json 的作用？',
    difficulty: '中等',
    tags: ['uni-app', '跨端', '条件编译', 'pages.json', 'manifest.json', '编译原理'],
    answer: `## 一、uni-app 运行原理

uni-app 本质是**"同一套 Vue 代码 → 多个编译目标 → 各端独立运行时"**的架构：

\`\`\`
┌────────────────────────────────────────────────────────────┐
│                    用户代码（Vue SFC / API）                 │
├────────────────────────────────────────────────────────────┤
│                    uni-app 编译器（@dcloudio/uni-cli）       │
│  模板层：把 <template> 编译到目标端 DSL（WXML/JSX/HTML...）  │
│  样式层：把 <style lang=scss> 处理到 WXSS/CSS/rn-sty…        │
│  脚本层：把 Vue 脚本/组合 API → 对应端 JS 运行时             │
│  API 层：uni.* 多态分发（各端独立实现 + 原生插件桥）         │
└───────────┬──────────┬───────────┬────────────┬─────────────┘
            ▼          ▼           ▼            ▼
        微信小程序   支付宝/抖音   H5(Vite+Vue)  App(5+Runtime/nvue)
        (WXML/WXSS)  (AXML/ACSS)  (SPA)         (WebView桥原生 / UTS)
\`\`\`

关键：**uni 不是"一次运行到处跨"，而是"一次编译到处分发"**。每个平台都有独立的产物与独立的运行时，能最大限度贴合平台规范。

## 二、pages.json & manifest.json

### 1. pages.json（路由 / 全局外观 / 原生能力开关）

描述了应用由哪些页面组成、每个页面路径和窗口表现：
\`\`\`json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": { "navigationBarTitleText": "首页", "enablePullDownRefresh": true }
    }
  ],
  "globalStyle": {               // 所有页面共用的样式
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {                    // 底部 tab（仅当用 tab 切换时配置）
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "...", "selectedIconPath": "..." }
    ]
  },
  "subPackages": [               // 分包（小程序/App 都支持，主包变小启动更快）
    { "root": "pages/mine", "pages": [{ "path": "profile" }] }
  ],
  "easycom": {                   // 自动按需注册组件
    "autoscan": true,
    "custom": { "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue" }
  }
}
\`\`\`

### 2. manifest.json（发布 / 包名 / 权限 / SDK 配置）

描述"这个应用本身是什么、如何打包、需要哪些权限"：
- **name/appid/versionName/versionCode**：应用名、DCloud AppID、版本号。
- **mp-weixin**：小程序 appid、是否使用云函数、es6 转 es5、插件列表、权限声明（scope.userLocation 等）。
- **app-plus**：App 端包名/签名/权限/模块（支付、推送、地图 SDK 配置）、启动图、是否使用 UTS。
- **h5**：H5 端 title/路由模式/publicPath/devServer/跨域代理。

## 三、条件编译（跨端差异的核心机制）

当某端有独有的 API/组件/样式时，用 \`#ifdef / #ifndef / #endif\` 在同一文件里写分支，编译时只保留目标平台的代码。

### 1. JS 里
\`\`\`js
// 只在微信小程序生效
// #ifdef MP-WEIXIN
wx.navigateToMiniProgram({ appId: 'xxx' })
// #endif

// 只在 H5 生效
// #ifdef H5
window.open(url)
// #endif

// App（双端）生效
// #ifdef APP-PLUS
plus.geolocation.getCurrentPosition(...)
// #endif

// 除了 H5 都生效
// #ifndef H5
uni.login(...)
// #endif
\`\`\`

### 2. template 里
\`\`\`vue
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <open-data type="userAvatarUrl"></open-data>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <img :src="avatar" />
    <!-- #endif -->
  </view>
</template>
\`\`\`

### 3. style 里
\`\`\`scss
.box {
  /* #ifdef H5 */
  background-attachment: fixed;   /* H5 支持视差滚动背景 */
  /* #endif */
  /* #ifdef MP-WEIXIN */
  background-color: #fff;         /* 小程序不支持 fixed attachment */
  /* #endif */
}
\`\`\`

### 常用平台宏
| 宏 | 对应平台 |
| --- | --- |
| \`H5\` | H5 |
| \`MP-WEIXIN\` | 微信小程序 |
| \`MP-ALIPAY\` | 支付宝小程序 |
| \`MP-TOUTIAO\` | 抖音/字节跳动小程序 |
| \`MP\` | 所有小程序（排除 H5/App） |
| \`APP-PLUS\` | App（iOS+Android） |
| \`APP-PLUS-NVUE\` | App 端原生渲染 nvue 页 |

## 四、跨端适配最佳实践

1. **能不用条件编译就不用**：优先用 \`uni.*\` 的抽象 API（uni.request / uni.navigateTo / uni.setStorage 等），不用平台原生命令。
2. **差异收敛到 service/adapter**：把平台特定逻辑抽到单独目录 \`/src/adapters/{weixin,h5,app}\`，通过 index 按平台导出，业务层 import 用统一接口。
3. **样式统一用 rpx / upx**：uni 内置 rpx（微信标准）、upx（uni 通用），编译时自动换算；H5 端自动转 vw。
4. **Tab、列表、表单**用 uni-ui 等跨端组件库，避免手写原生组件。
5. **云能力**：如用 uniCloud，可把后端逻辑也跨端统一（直接兼容微信云开发 + 自建服务空间）。
`
  },
  {
    id: 'mob-009',
    category: 'mobile',
    title: 'Hybrid App（WebView + 原生）与 JSBridge 的原理？如何实现 JS 与 Native 双向调用？',
    difficulty: '困难',
    tags: ['Hybrid', 'JSBridge', 'WebView', 'Native', 'WKWebView', 'addJavascriptInterface'],
    answer: `## 一、Hybrid App 是什么

混合应用：核心页面用 H5（WebView 承载），壳是原生（iOS/Android），通过 **JSBridge** 在 H5 与原生之间双向调用。
- 优点：迭代快（H5 可热更）、跨平台复用；
- 缺点：性能略低于纯原生；复杂动画/列表体验差。

典型壳能力：相机/扫码/支付/推送/通讯录/文件下载/离线包管理。

## 二、JSBridge 双向通信原理

### 1. Native → Web（调 H5 里的 JS）
两边原生都提供直接执行 JS 字符串的 API：

| 平台 | API |
| --- | --- |
| iOS WKWebView | \`webView.evaluateJavaScript("window.onNativeReady({ ... })")\` |
| Android WebView | \`webView.evaluateJavascript("window.onNativeReady({...})", callback)\` |

### 2. Web → Native（H5 调原生能力）—— 核心，有 4 种常见方案：

#### 方案 A：Android \`addJavascriptInterface\`（仅安卓）
Android 把一个 Java 对象注入到 WebView 的 JS 上下文，名字如 \`AndroidBridge\`，H5 直接 \`AndroidBridge.foo('x')\` 调用。
- 优点：**简单直接，支持返回值**。
- 缺点：早期（< Android 4.2）存在严重安全漏洞（JS 反射 Java 对象执行任意命令）；iOS 无此机制。

#### 方案 B：URL Scheme 拦截（通用，最老最兼容）
1. H5 构造一个特殊 URL：\`jsbridge://camera/scan?callbackId=123\`，通过 \`iframe.src\` 或 \`location.href\` 发起请求。
2. Native 在 WebView 的 \`shouldOverrideUrlLoading\`（Android）或 \`decidePolicyForNavigationAction\`（iOS）里拦截 URL。
3. 解析 scheme/host/path/query，执行对应原生能力，结果再通过方案 1（evaluateJavaScript）回传给 H5 的回调映射表。
- 优点：跨平台、兼容性极好。
- 缺点：URL 长度限制；连续调用 iframe.src 会丢消息；参数必须序列化在 URL。

#### 方案 C：prompt / console / alert 劫持
H5 调用 \`prompt('jsbridge:xxx', payload)\`，Native 拦截 \`onJsPrompt\`（Android）或 \`runJavaScriptTextInputPanelWithPrompt\`（iOS WKWebView）：
- 第一个参数识别为 bridge 协议，第二个参数当数据。
- 优点：比 URL Scheme **参数更长、更可靠**。
- 缺点：prompt 语义奇怪；某些 WebView 环境可能禁用。

#### 方案 D：WKScriptMessageHandler（iOS 推荐）/ \`console.addMessageListener\`（新版 Chrome/Android WebView）
iOS WKWebView 最优雅：
\`\`\`swift
let handler = MyScriptMessageHandler()
webView.configuration.userContentController.add(handler, name: "nativeBridge")
\`\`\`
H5 直接：
\`\`\`js
window.webkit.messageHandlers.nativeBridge.postMessage({ action: 'scan', cbId: 1 })
\`\`\`
iOS 在 \`userContentController(_:didReceive:)\` 中拿到消息对象，直接解析字典。
- 优点：**性能最好、协议清晰、支持任意可序列化数据**。
- 缺点：iOS-only，Android 需另一条路。

## 三、生产级 JSBridge 结构（参考 DSBridge / JsBridge / WebViewJavascriptBridge）

通用流程：

\`\`\`
H5 侧:
  callNative(action, payload, callback)
    → 生成 cbId = uid()，window.__CB_MAP__[cbId] = callback
    → 构造 msg = { cbId, action, payload }
    → 根据平台走 ①WKScriptMessageHandler / ②addJavascriptInterface / ③prompt / ④URL Scheme

Native 侧:
  收到 msg → 执行 action 对应模块（Camera/Scan/Pay…）→ 结果包装 { cbId, data, error }
    → 执行 evaluateJavaScript("window.__native_respond__({ cbId, data, error })")

H5 侧:
  __native_respond__(msg) → 从 window.__CB_MAP__[msg.cbId] 取回调并调用 → 删除回调
\`\`\`

要点：
1. **回调映射表（Callback Map）**：跨线程异步返回值的标准做法。
2. **超时兜底**：Native 未回调时 cbId 要清理，避免回调内存泄漏。
3. **初始化时序**：H5 调 Bridge 前必须确认 Native 已注入，通常先发 \`bridgeReady\` 握手。
4. **安全校验**：只允许已授权的 H5 域名调用，避免加载任意第三方页面调用相机/支付。

## 四、与小程序双线程 Bridge 的对比

小程序本质上也是 JS↔View↔Native 的桥，但它把 Bridge 集成到运行时（框架内），开发不用自己写；Hybrid App 需要你自己实现或接入 DSBridge 等第三方 Bridge。
`
  },
  {
    id: 'mob-010',
    category: 'mobile',
    title: '移动端性能优化：首屏加载、白屏、滚动流畅、长列表、图片/缓存优化策略清单？',
    difficulty: '中等',
    tags: ['性能优化', '移动端', '首屏', '白屏', '长列表', '图片', '缓存'],
    answer: `## 一、首屏 / 白屏优化

### 1. H5 侧
- **资源大小**：路由级 code splitting + Tree-shaking；产物 gzip/brotli；分析产物体积（rollup-plugin-visualizer / webpack-bundle-analyzer）。
- **资源顺序/加载方式**：
  - CSS 放 \`<head>\`，避免 JS 阻塞 CSSOM（首屏前不出现闪动）。
  - 业务脚本 \`<script defer async>\`。第三方统计/埋点脚本放到 \`requestIdleCallback\` 或 \`DOMContentLoaded\` 后动态注入。
  - 首屏直出 SSR / 预渲染（prerender-spa-plugin / vite-plugin-prerender）：直接输出带内容 HTML，爬虫&体验双赢。
- **内联首屏**：关键 CSS 内联（critical CSS），小图转 base64 内联。
- **静态资源 CDN + DNS 预解析**：
  \`\`\`html
  <link rel="dns-prefetch" href="//cdn.xxx.com">
  <link rel="preconnect" href="https://cdn.xxx.com" crossorigin>
  \`\`\`
- **离线缓存**：Service Worker 缓存核心文件；弱网下直接从缓存渲染。

### 2. 小程序侧
- **分包 + 独立分包 + 分包预下载**：主包只保留 tabBar 页与公共代码。
- **代码体积**：无用文件/组件清理；npm 包 tree-shaking；图片走 CDN 不打进包体。
- **启动性能**：\`onLaunch/onLoad\` 里不要做大计算；首屏请求并发限制（建议 ≤ 6 个，其余延后）；骨架屏。
- **开发者工具 → 详情 → 本地设置**：开启"启动性能分析"查看首屏瓶颈。

## 二、滚动流畅 / 掉帧

1. **避免在 onPageScroll / touchmove 中做重活**：任何同步任务 > 10ms 就会掉帧（60fps 下每帧预算 16.6ms）。节流 16~50ms。
2. **让合成器处理动画**：只动画 \`transform / opacity\`（走 GPU 合成层，不触发 layout/paint）。避免动画 \`width/height/top/left/margin/padding\`。
3. **开启 will-change / 3D 硬件加速**：\`will-change: transform\`（注意过度使用会爆显存，用完要移除）。
4. **避免频繁强制同步布局（Layout Thrashing）**：
   \`\`\`js
   // ❌ 读-写-读-写 → 浏览器被迫多次重排
   for (el of list) { const w = el.clientWidth; el.style.width = (w+10)+'px' }
   // ✅ 先批量读、再批量写
   const widths = list.map(el => el.clientWidth)
   list.forEach((el, i) => el.style.width = (widths[i]+10)+'px')
   \`\`\`

## 三、长列表

| 方案 | 适用场景 |
| --- | --- |
| **虚拟列表（Virtual Scroll）**：只渲染可视区 N 行 | 数据量 ≥ 500，或每行 DOM 复杂。Vue 用 vue-virtual-scroller；React 用 react-window；小程序用 recycle-view / u-list |
| **分页加载 + 简单渲染**：每页 ≤ 50 | 普通 Feed 流，卡片 DOM 简单 |
| **减少每行 DOM 深度**：去掉嵌套无用 view/div | 任何列表（渲染引擎 O(n) 遍历） |
| **图片懒加载**：\`<img loading="lazy">\` / 小程序 \`<image lazy-load>\` + 固定宽高 | 所有图片列表 |

小程序端建议：
- 使用 \`<scroll-view enhanced>\` 增强模式。
- 列表组件 \`pureDataPattern: /^_\|^list/\` 减少渲染面。
- 不要在 item 里用 computed 每次计算（在取数时算好，直接用）。

## 四、图片优化

- **格式**：JPEG→AVIF/WebP（体积 -30%~60%），透明 PNG→WebP/AVIF 透明；小 icon→SVG。
- **尺寸**：CDN 动态裁剪（如 Aliyun：\`?x-oss-process=image/resize,w_375\`），不要加载原图再 CSS 缩。
- **质量**：JPEG 质量 75~80 肉眼通常无差。
- **懒加载 + 占位**：\`loading="lazy"\` + LQIP/SQIP（极低保真占位图）。
- **缓存**：HTTP 长缓存（文件名带 hash）+ Service Worker + 小程序本地缓存图片。

## 五、缓存

| 层 | 技术 | 控制 |
| --- | --- | --- |
| 浏览器 HTTP 缓存 | \`Cache-Control: max-age=31536000, immutable\` + 带 hash 文件名 | 后端/CDN 响应头 |
| HTML 不缓存 | \`Cache-Control: no-cache, must-revalidate\` | 防止发版后用户看旧壳 |
| Service Worker（H5） | Stale-While-Revalidate：先给缓存，后台异步更新 | Workbox |
| 小程序本地存储 | \`wx.setStorageSync('cachedData', data)\`，TLL 自管 | 业务代码 |
| 小程序文件缓存 | \`wx.downloadFile\` + \`wx.saveFile\` / 临时目录自动清理 | 文件 API |
| App 端 | 图片 SDWebImage/Glide；接口数据库（Realm/SQLite）；WebView 离线包 | 原生 SDK |

## 六、监控指标

- **Web Vitals**（H5）：LCP < 2.5s、INP < 200ms、CLS < 0.1。
- **小程序性能面板**：打开"性能"面板观察启动耗时、setData 大小、WXML 节点数。
- **A/B 实验**：任何优化都用灰度验证，避免"优化越做越慢"。
`
  },
  {
    id: 'mob-011',
    category: 'mobile',
    title: '小程序分包加载、独立分包、分包预下载分别是什么？怎么用？',
    difficulty: '中等',
    tags: ['小程序', '分包', '独立分包', '分包预下载', '主包', '性能'],
    answer: `## 一、为什么要分包

微信小程序硬性限制：
- **主包 + 分包** 总代码 ≤ **20MB**；
- **单个主包/分包** ≤ **2MB**。

不分包会导致：
- 首屏必须把所有代码下载完才能进首页，白屏时间长；
- 体积超限无法上传/审核。

## 二、分包（Regular Subpackage）—— 常规拆分

把代码按功能模块拆成多个包。首次只下载主包，访问分包页面前才去下载分包。

### app.json 配置
\`\`\`json
{
  "pages": [ "pages/index/index", "pages/about/index" ], // 主包页面
  "subpackages": [
    {
      "root": "pages/user",     // 分包根目录
      "name": "userPkg",        // 分包别名（用于预下载）
      "pages": [
        "profile",              // 相对 root：pages/user/profile
        "settings"
      ]
    },
    {
      "root": "pages/order",
      "name": "orderPkg",
      "pages": [ "list", "detail" ],
      "independent": false     // 默认 false，普通分包
    }
  ]
}
\`\`\`

### 规则
- **tabBar 页面必须放在主包**。
- 主包可以引用主包内的资源；**分包可以引用主包和自己分包里的资源；分包之间不能相互引用**（需放主包共享，或用分包异步化）。
- 从用户点击进入首个分包页面开始下载分包，用户会看到 1 次 loading（可配置分包下载的 loading 文案）。

## 三、独立分包（Independent Subpackage）

一种特殊的分包，**不依赖主包也能独立运行**。

### 场景
- 运营活动页（从外部分享卡片/广告直接进入，不需要先打开整个应用）。
- 多个团队协作，各自维护一个独立小程序功能模块，互不依赖。
- 需要"分享后直接打开功能页 + 首屏极快"。

### 用法
\`\`\`json
{
  "subpackages": [
    {
      "root": "pages/activity",
      "name": "activity",
      "pages": [ "summer-sale" ],
      "independent": true
    }
  ]
}
\`\`\`

### 关键区别
1. **不依赖主包**：启动独立分包时，不会先去下载主包，直接下分包。
2. **不能引用主包资源**：要用到的公共组件/工具类 **必须复制一份到独立分包内**（或用"分包异步化 require 主包资源"，但有额外开销）。
3. **\`getApp()\` 可能拿不到**：用户直接从独立分包进入时，App 实例可能还没创建，需要加兜底 \`getApp({ allowDefault: true })\`。
4. **跳转规则**：独立分包 ↔ 主包 的跳转必须用 \`wx.navigateTo\` 的 url，且系统会在跳转时再下载对方。

## 四、分包预下载（PreloadRule）

解决"点击进入分包页面才下载，用户会看到 loading"的痛点。在用户仍在主包某个页面时，**预判接下来大概率要进入哪个分包，后台静默下载**，进入时秒开。

### app.json 配置
\`\`\`json
{
  "preloadRule": {
    "pages/index/index": {                          // 【触发页面】：进入哪个页面时触发预下载
      "network": "all",                             // all / wifi，默认 wifi
      "packages": [ "orderPkg" ]                    // 预下载哪些分包名（对应 subpackages[].name）
    },
    "pages/user/profile": {
      "network": "wifi",
      "packages": [ "userPkg", "activity" ]
    }
  }
}
\`\`\`

### 限制
- 同时存在预下载的分包总大小 ≤ **2MB**。
- 已下载的分包会自动缓存，不用重复下载。

## 五、分包异步化（进阶）

"分包 A 想引用分包 B 的组件/模块"的新能力：
- 页面 JSON 里用 \`componentPlaceholder\` 先占位，进入页面后再去加载目标分包组件；
- 代码里用异步 require：\`require.async('/subB/xxx.js').then(m => ...)\`。
- 适合大型多团队项目，避免大量公共组件被重复打进多个分包。

## 六、落地建议流程

1. **拆分**：tabBar 首页进主包；其余功能模块按业务线拆包；活动/营销页用独立分包。
2. **体量检查**：开发者工具 → 详情 → 基本信息查看每个包大小；主包尽量 < 1MB 首屏才快。
3. **预下载**：分析用户路径，比如"首页→列表→详情"，那么在首页预下载列表分包，列表页预下载详情分包。
4. **发布**：用体验版验收预下载效果 → 在"小程序后台 → 运维中心 → 性能监控"观察启动耗时趋势。
`
  },
  {
    id: 'mob-012',
    category: 'mobile',
    title: 'uni-app 的 nvue 是什么？它与普通 vue 页、原生小程序、Flutter/RN 的区别？',
    difficulty: '中等',
    tags: ['uni-app', 'nvue', '原生渲染', 'Weex', 'UTS'],
    answer: `## 一、nvue 是什么

**nvue = native vue**，是 uni-app 在 App 端（iOS/Android）特有的一种页面/组件格式：
- **底层引擎**：继承自 **Weex**（阿里 2016 开源），把 <template>/<style> 的子集渲染成 iOS/Android 的**原生控件**（不是 WebView）。
- **脚本层**：仍用 V8/JSCore 执行 JS（与普通 vue 页一致）。
- **适用范围**：仅 uni-app App 端生效；编译到 H5/小程序时 nvue 会**自动降级**为普通 vue（或者你用条件编译把 nvue 专用语法包起来）。

## 二、nvue vs 普通 vue（uni-app App 端）

| 维度 | 普通 .vue 页（App 端） | .nvue 页（Weex 渲染） |
| --- | --- | --- |
| **渲染引擎** | WebView 渲染 HTML/CSS | Weex → 系统原生控件（UIView/ViewGroup） |
| **布局** | 支持所有 CSS（浮动/定位/Grid/百分比…） | 只支持 **Flex 布局**（默认纵向），CSS 子集 |
| **样式隔离** | scoped 可选 | 组件自带隔离，且样式不能写 \`\* {}\`、不支持 class 选择器嵌套过深 |
| **长列表性能** | 长列表/复杂动画会掉帧 | 很好（Weex 原生列表组件 \`<list>/<cell>\` + 回收复用） |
| **文字** | 支持全局字体、emoji、富文本 HTML | 必须用 \`<text>\` 包住文本（否则不显示），文本样式继承更严格 |
| **起步开销** | 首次启动要加载 WebView 内核 | 原生渲染起步稍慢，但滚动/动画稳 |
| **开发成本** | 接近 H5，Web 经验可复用 | 要遵守 Weex 约束，踩坑成本高 |

## 三、nvue 的使用要点

1. **布局：Flex 强制 + 默认方向是 column**
   \`\`\`vue
   <template>
     <list>
       <cell v-for="(item,i) in list" :key="i">
         <div class="row">
           <text class="title">{{ item.title }}</text>
         </div>
       </cell>
     </list>
   </template>
   \`\`\`
2. **所有文字必须包在 \`<text>\` 内**，这是与 vue 页最大的语法差异。
3. **图片必须写死宽高**（\`<image>\` 不会自适应，Weex 特性）。
4. **单位**：默认 750px 设计稿，写 \`height: 100px\` 会按屏幕宽度换算；不支持 vw/vh，需要用 \`weex.config.env.deviceWidth\` 动态计算。
5. **全局样式不可用**：写在 App.vue 的全局 CSS 对 nvue 页不生效，要在每个 nvue 里定义或引入全局样式文件。
6. **条件编译**：
   \`\`\`js
   // #ifdef APP-PLUS-NVUE
   const dom = weex.requireModule('dom')
   dom.scrollToElement(this.$refs.box, { animated: true })
   // #endif
   \`\`\`

## 四、nvue vs 小程序 vs RN vs Flutter

| | uni-app nvue | 微信小程序 Skyline | React Native (Fabric) | Flutter (Impeller) |
| --- | --- | --- | --- | --- |
| **是否原生控件** | 是（Weex） | 部分（自绘+系统混合） | 是（系统 UIView/ViewGroup） | **否**（Skia 自绘） |
| **语言** | Vue + JS/TS + Weex 样式子集 | WXML/WXSS/JS/TS/WXS | JSX/TS + 可选 Fabric/TurboModules | Dart |
| **跨端覆盖** | uni-app 体系下：App 端 nvue + 小程序/H5 自动降级 | 仅微信小程序（以及用同样技术的 QQ 小程序等） | iOS / Android / Web（React Native Web） | iOS / Android / Web / Windows / macOS / Linux / 嵌入式 |
| **性能** | 中+（滚动强于 WebView，弱于 RN/Flutter） | 中（小程序内最流畅） | 高（Fabric/JSI 后接近原生） | 极高（同屏千项列表、复杂动画） |
| **生态/坑** | 小厂维护、资料偏少；大量历史问题 | 微信自家，文档完整 + 社区大 | Meta 家，大厂背书，社区极成熟 | Google 家，社区爆发增长，学习曲线稍陡 |

## 五、uni-app App 端选型建议

- **大多数页面**：用普通 .vue（H5/小程序/App 三端同一码）即可，维护成本低；
- **长列表页、瀑布流、大动画页（如视频 Feed）**：单独写 .nvue，或者"App 端用 nvue，其余端 fallback vue"；
- **需要极致性能 + 原生能力深度定制**：考虑切换到 Flutter（代价是放弃小程序同构）；
- **团队 RN 熟 + 要微信小程序**：Taro 3 RN 端同构 更合适。
`
  },
  {
    id: 'mob-013',
    category: 'mobile',
    title: '小程序自定义组件：Component 构造器、behaviors、observers、relations、slot、externalClasses 的用法？',
    difficulty: '中等',
    tags: ['小程序', '自定义组件', 'Component', 'behaviors', 'observers', 'relations', 'slot', 'externalClasses'],
    answer: `## 一、Component 基础

\`\`\`js
// components/my-card/index.js
Component({
  // 1. 属性（父传子）
  properties: {
    title: {
      type: String,
      value: '默认标题'
    },
    count: {
      type: Number,
      value: 0,
      // 属性变化的回调（另一种方式是 observers）
      observer(newVal, oldVal) { console.log('count', newVal) }
    }
  },

  // 2. 内部数据（和 properties 一起供模板使用）
  data: {
    loading: false
  },

  // 3. 组件生命周期
  lifetimes: {
    attached() { console.log('进节点树') },
    ready()    { console.log('布局完成') },
    detached() { console.log('移除节点树') }
  },

  // 4. 监听所在页面生命周期
  pageLifetimes: {
    show() {}, hide() {}, resize() {}
  },

  // 5. 方法
  methods: {
    handleTap(e) {
      this.triggerEvent('change', { val: e.detail }, { bubbles: false, composed: false })
    }
  }
})
\`\`\`

子→父通信通过 **\`triggerEvent(name, detail, options)\`**：
\`\`\`xml
<!-- 父 -->
<my-card count="{{count}}" bind:change="onChange" />
<!-- 父 JS -->
onChange(e) { console.log(e.detail.val) }
\`\`\`

## 二、behaviors（混入 / Mixin）

抽出组件间共享的 properties/data/methods/lifetimes：

\`\`\`js
// behaviors/form-field.js
module.exports = Behavior({
  properties: { disabled: Boolean, name: String, value: null },
  data: { focus: false },
  methods: {
    emitChange(val) { this.triggerEvent('change', { value: val }) }
  }
})
\`\`\`
组件使用：
\`\`\`js
const FormField = require('../behaviors/form-field')
Component({
  behaviors: [FormField]
})
\`\`\`

- 支持多级继承（behavior 再引用 behavior）。
- 冲突规则：properties / methods / data 以组件内定义优先；生命周期按 behaviors 先、组件后依次执行。

内置 behaviors：\`wx://form-field\`、\`wx://form-field-button\`，可让自定义组件被 \`<form>\` 收集 value，像官方 input 一样参与 submit。

## 三、observers（数据监听器）

比 properties.observer 更强大：支持多字段、路径、通配符。

\`\`\`js
Component({
  observers: {
    // 监听单个属性
    'count'(val) { console.log('count=', val) },

    // 监听对象字段
    'user.name, user.age'(name, age) { console.log(name, age) },

    // 监听数组下标的某项
    'list[2]'(item) {},

    // 监听对象任意字段
    'user.**'(patch) {},

    // 多条变化触发一次（批处理）
    'a, b, c'(a, b, c) {}
  }
})
\`\`\`

⚠️ 注意：**observer 里再 setData 同一字段会触发死循环**，必须加条件判断或用 \`_开头私有属性\` 配合 \`pureDataPattern\`。

## 四、relations（组件间关系）

解决一组组件联动：比如 \`<tabs>/<tab-item>\`、\`<radio-group>/<radio>\`、\`<custom-table>/<custom-cell>\`。

\`\`\`js
// tabs.js（父）
Component({
  relations: {
    './tab-item': {        // 子组件路径
      type: 'child',       // child / parent / ancestor / descendant
      linked(target) {     // 子 linked 时回调（target = 子实例）
        this.children.push(target)
      },
      unlinked(target) { this.children = this.children.filter(x => x !== target) }
    }
  }
})

// tab-item.js（子）
Component({
  relations: {
    './tabs': {
      type: 'parent',
      linked(parent) { this.parent = parent }
    }
  }
})
\`\`\`

规则：
- 路径必须写"相对路径字符串"，基于**被引用者相对于定义者的位置**。
- \`linked\` 触发时机是"子组件 attached 之后，父组件 ready 之前"。

## 五、slot（插槽）

默认单 slot：
\`\`\`xml
<!-- card.wxml -->
<view class="card">
  <view class="hd"><slot name="header"></slot></view>
  <view class="bd"><slot></slot></view>      <!-- 默认 slot -->
</view>

<!-- 父使用 -->
<card>
  <view slot="header">我是头</view>
  <view>我是主体</view>
</card>
\`\`\`

**多 slot 必须开启**：
\`\`\`js
Component({ options: { multipleSlots: true } })
\`\`\`

## 六、externalClasses（外部样式类）

让父页面可以传 class 给子组件，定制子组件内部某块样式：

\`\`\`js
// 子组件声明
Component({
  externalClasses: ['head-class', 'body-class']
})
\`\`\`
\`\`\`xml
<!-- 子组件模板 -->
<view class="head head-class">头</view>
<view class="body body-class">体</view>

<!-- 父页面传 -->
<my-card head-class="custom-hd" body-class="custom-bd" />
\`\`\`
\`\`\`css
/* 父 page.wxss */
.custom-hd { color: red; font-size: 36rpx; }
.custom-bd { padding: 24rpx; }
\`\`\`

比直接 \`!important\` 覆盖优雅，是组件"样式开放"的官方手段。

## 七、其他常用选项

- **\`options: { styleIsolation: 'isolated' | 'apply-shared' | 'shared' }\`**：
  - \`isolated\`（默认）：外部 page class 不影响组件，组件 externalClasses 除外。
  - \`apply-shared\`：外部 page class 可渗透进组件；组件样式不会影响外界。
  - \`shared\`：双向互通，基本等于全局样式。
- **\`pureDataPattern: /^_/\`**：以 \`_\` 开头的 data 不渲染到模板，只在逻辑层使用（减少渲染树体积，提高 setData 性能）。
- **\`dataFields: {...}\`**：为抽象节点提供类型推断，高阶组件开发时使用。
`
  },
  {
    id: 'mob-014',
    category: 'mobile',
    title: '移动端手势与触摸事件：touchstart/move/end、tap、longpress、手势识别原理？',
    difficulty: '中等',
    tags: ['移动端', '触摸事件', '手势识别', 'touchstart', 'tap', 'longpress'],
    answer: `## 一、原生事件

### H5 触摸事件（移动端 WebView & 普通移动端浏览器）
每个 TouchEvent 携带 **touches / changedTouches / targetTouches** 三个 TouchList：
- \`touches\`：当前屏幕上所有手指。
- \`changedTouches\`：**本次事件**变化的手指（end/cancel 时只有这个有值）。
- \`targetTouches\`：当前元素上的手指。

\`\`\`js
el.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0]
  console.log(t.clientX, t.clientY, t.identifier)   // 坐标 + 手指编号（多指时区分）
  e.preventDefault()   // 阻止默认滚动/缩放（视业务）
}, { passive: false })
\`\`\`

### 小程序里
小程序不用 addEventListener，而是在模板绑定：
\`\`\`xml
<view bindtouchstart="onStart" bindtouchmove="onMove" bindtouchend="onEnd">
  拖我
</view>
\`\`\`
参数格式与 Web 几乎一致。额外的语义化事件由框架合成：\`bindtap / bindlongpress / bindtransitionend\` 等。

## 二、tap vs click（移动端 H5 著名陷阱）

| | click | tap（touch 合成） |
| --- | --- | --- |
| **触发** | 手指按下 → 抬起 → 浏览器等待 ~300ms 确认不是双击 | 按下→抬起且位移 < 阈值（如 10px）立即触发 |
| **延迟** | 有 300ms（未禁用缩放时） | 无 |
| **H5 推荐** | 加 viewport 禁用缩放，现代浏览器已去掉 300ms；或全局 \`touch-action: manipulation\` | 用 fastclick 等库合成（2020+ 已不推荐，除非兼容老 iOS）|
| **小程序** | 只有 tap/longpress，没有 click | 直接用 bindtap |

## 三、手势识别的基本流程（自己写简易版）

一个通用手势识别器，状态机 = **Down → Move → Up**，每阶段做阈值判定：

\`\`\`
Start
  ↓ touchstart
记录 startX/startY/startTime，状态=PENDING
  ↓ touchmove
计算 dx = curX-startX, dy = curY-startY, distance=√(dx²+dy²)
if |dx|>10 && |dx|>|dy|: 判定为 SWIPE_H（左右滑动）
if |dy|>10 && |dy|>|dx|: 判定为 SWIPE_V（上下滑动）
  ↓ touchend
计算 dt = endTime-startTime
if distance < 10 && dt < 250ms   : TAP
if distance < 10 && 500 < dt < 2000 : LONGPRESS
if 之前判定为 SWIPE 且 speed > 0.3px/ms : 快速滑动（惯性滚动）
\`\`\`

示例代码（JS 简化版）：
\`\`\`js
class Gesture {
  constructor(el) {
    let sx, sy, st
    el.addEventListener('touchstart', e => {
      const t = e.changedTouches[0]
      sx = t.clientX; sy = t.clientY; st = Date.now()
    })
    el.addEventListener('touchend', e => {
      const t = e.changedTouches[0]
      const dx = t.clientX - sx, dy = t.clientY - sy
      const dt = Date.now() - st, dist = Math.hypot(dx, dy)
      if (dist < 10 && dt < 250) el.dispatchEvent(new CustomEvent('gtap'))
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) && dt < 300) {
        el.dispatchEvent(new CustomEvent('gswipe', { detail: dx > 0 ? 'right' : 'left' }))
      }
    })
  }
}
\`\`\`

## 四、常见坑

1. **\`passive: true\` 导致 preventDefault 无效**：
   Chrome 80+ 默认给 touchstart/touchmove 加 passive，目的是让滚动不被 JS 阻塞。但你若要在处理函数里阻止默认行为，必须显式 \`{ passive: false }\`。
2. **touch 事件里不要做耗时逻辑**：会直接让页面卡顿。
3. **iOS 下 body \`overflow: hidden\` 仍能滚**：解决思路是"把滚动放到一个指定的内部容器，并在 touchstart 阶段处理边界位置"。
4. **微信小程序里 move 回调不要 setData 大对象**：60fps 下每 16ms 一次，Bridge 会爆。需要拖动的元素尽量用 \`movable-view\`（在 View 层合成，不走 Bridge）。
5. **长按和滑动冲突**：用户手指一滑，就取消 longpress 计时器；只有一直静止才触发。
6. **多指手势**：用 \`touches.length\` 做 2 指捏合缩放（pinch）：两次触摸距离变化 = 缩放系数。

## 五、现成库

- **H5**：hammer.js（手势库，成熟）、alloyFinger（腾讯出品，轻量）。
- **小程序**：miniprogram-gesture（npm 包），或直接用官方 \`movable-area / movable-view / scroll-view\` 满足 90% 场景。
- **uni-app / Taro**：推荐 \`renderjs / WXS\` 实现手势（在 View 层计算，不跨 Bridge，最丝滑）。
`
  },
  {
    id: 'mob-015',
    category: 'mobile',
    title: '小程序登录流程：wx.login / code2Session / unionid / openid / 解密手机号的标准实现？',
    difficulty: '中等',
    tags: ['小程序', '登录', 'wx.login', 'code2Session', 'unionid', 'openid', '手机号解密'],
    answer: `## 一、核心概念

| 字段 | 含义 |
| --- | --- |
| **openid** | 用户在**当前小程序**的唯一标识（同一用户在不同小程序 openid 不同）。存用户表主键即可。 |
| **unionid** | 用户在**同一微信开放平台账号下（小程序 + 公众号 + App + 网站）** 的统一标识。做跨产品互通才需要，需在开放平台把应用绑定在一起。 |
| **session_key** | 微信给的"当前会话密钥"（有生命周期）。用于：① 解密 wx.getUserProfile / wx.getPhoneNumber 返回的加密数据；② 后端签发自定义登录态的凭证。**不能下发给前端，必须存在服务端。** |

## 二、静默登录（获取 openid + 自定义登录态）

最小化登录，不打扰用户：

\`\`\`
小程序                          你的后端                        微信 API
  │                               │                               │
  │── 1. wx.login() ──────────────┼──────────────────────────────▶│
  │   拿到 code（5 分钟有效临时票据）                              │
  │                               │                               │
  │── 2. POST /api/wx-login { code } ──▶                          │
  │                               │                               │
  │                               │── 3. code2Session(appid, secret, code) ──▶
  │                               │                               │  返回 { openid, session_key, unionid? }
  │                               │                               │
  │                               │ 4. 查/建用户，生成 token（JWT 或 Redis Session）
  │◀──────── 5. 返回 { token, user } ─────────────────────────────│
  │
  │ 6. 后续请求头: Authorization: Bearer <token>
\`\`\`

后端 code2Session 接口示例（Node）：
\`\`\`js
// services/wechat.js
const fetch = require('node-fetch')
exports.code2Session = async (code) => {
  const url = \`https://api.weixin.qq.com/sns/jscode2session\`
    + \`?appid=\${APPID}&secret=\${SECRET}&js_code=\${code}&grant_type=authorization_code\`
  const r = await fetch(url).then(r => r.json())
  if (r.errcode) throw new Error(\`wx code2Session err \${r.errcode} \${r.errmsg}\`)
  return { openid: r.openid, sessionKey: r.session_key, unionid: r.unionid }
}
\`\`\`

## 三、获取手机号（需要用户主动点击按钮）

微信 2023 年下半年之后要求：手机号获取必须用户主动点 \`<button open-type="getPhoneNumber">\`，**不允许静默获取**。

\`\`\`xml
<button type="primary" open-type="getPhoneNumber" bindgetphonenumber="onGetPhone">
  微信一键登录
</button>
\`\`\`

\`\`\`js
onGetPhone(e) {
  // 新版本直接返回明文手机号（但需按钮触发）
  if (e.detail && e.detail.code) {
    // 2023+ 新版：拿到 phone code，后端调接口换手机号
    api.bindPhone({ phoneCode: e.detail.code, token: this.data.token })
  } else if (e.detail && e.detail.encryptedData) {
    // 老版本（兼容）：用 session_key 解密 encryptedData + iv
    api.decryptPhone({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      token: this.data.token
    })
  }
}
\`\`\`

后端手机号解密（Node，crypto）：
\`\`\`js
const crypto = require('crypto')
function decryptPhone(encryptedData, iv, sessionKey) {
  const sessionKeyBuf = Buffer.from(sessionKey, 'base64')
  const ivBuf = Buffer.from(iv, 'base64')
  const encryptedBuf = Buffer.from(encryptedData, 'base64')
  const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyBuf, ivBuf)
  decipher.setAutoPadding(true)
  let decoded = Buffer.concat([decipher.update(encryptedBuf), decipher.final()])
  const payload = JSON.parse(decoded.toString('utf8'))
  if (payload.watermark.appid !== APPID) throw new Error('appid mismatch')
  return payload  // { phoneNumber, purePhoneNumber, countryCode, watermark }
}
\`\`\`

## 四、unionid 获取条件

需同时满足：
1. 小程序/公众号/App 已绑定到**同一开放平台主体**（一个公司一套）。
2. 用户满足以下任一：
   - 用户在公众号下关注过（公众号和小程序同一开放平台）；
   - 用户在 App/网站/小程序**任一端登录过**，微信才会下发 unionid；
   - 开发者在小程序内用 \`wx.getUserProfile\`（2022 后已大幅收敛权限）并通过加密数据拿到 unionid。

拿到 unionid 后才能做"公众号关注后小程序自动识别已登录用户"这类场景。

## 五、登录态续期 & 安全

- **自定义 token** 建议短期（3~7 天），用 **refresh_token**（更长）机制续期；不要长期有效。
- **session_key 不要下发**，存 Redis：\`key=session:{openid}\`，过期与微信一致（约 3 天）。
- **防重放**：code 是一次性的，code2Session 调用过就失效；后端可加幂等缓存。
- **HTTPS 必开**：code、token、手机号明文传输风险大；小程序线上还要求业务域名+可信证书。
- **换设备/风险校验**：高敏感操作（改密码、支付）前要求再次 \`wx.login\` + code2Session 拿最新会话。
`
  },
  {
    id: 'mob-016',
    category: 'mobile',
    title: 'H5 与小程序之间的跳转（小程序 ↔ H5 web-view、公众号菜单、App、唤起 App）链路与限制？',
    difficulty: '中等',
    tags: ['小程序', 'H5', 'web-view', '跳转', '唤起App', '公众号', 'URL Scheme'],
    answer: `## 一、小程序 ↔ H5（小程序内嵌 H5）

小程序官方提供 \`<web-view>\` 组件，能承载一个 H5 页面，**个人小程序不可用**，企业小程序需要：
1. 把 H5 域名配置到"小程序后台 → 开发管理 → 开发设置 → 业务域名"（并上传校验文件）。
2. 配置后 \`<web-view src="https://h5.example.com/act">\` 即可。

### 1. 小程序 → H5（传参）
\`\`\`xml
<!-- 小程序 A 页面 -->
<web-view src="https://h5.example.com/act?from=mp&uid=123"></web-view>
\`\`\`

### 2. H5 → 小程序（回跳）
H5 引入官方 JS-SDK：
\`\`\`html
<script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
\`\`\`
\`\`\`js
// 跳回小程序指定页（仅当 H5 在 web-view 内运行有效）
wx.miniProgram.navigateTo({ url: '/pages/order/detail?id=777' })

// 取小程序 ENV（判断是否在小程序里）
wx.miniProgram.getEnv(res => {
  if (res.miniprogram) { /* 确实在小程序 web-view 里 */ }
})
\`\`\`

## 二、H5 → 小程序（外部 H5 打开小程序）

外部浏览器、公众号 H5 打开小程序的方式：

### 方式 A：URL Link / URL Scheme（通用）
- **URL Scheme**：\`weixin://dl/business/?t=xxxxx\`，支持 App 外唤起。在小程序后台"工具 → 生成 URL Scheme"生成，或服务端调用 \`https://api.weixin.qq.com/wxa/generatescheme?access_token=...\` 批量生成。
- **URL Link**：\`https://wxaurl.cn/xxxxx\`，短链形式，在微信内点击可直接打开小程序页，在微信外浏览器会跳中间页再拉起微信。
- **小程序码**：不限场景，扫码进入。

### 方式 B：微信开放标签（公众号 H5）
已认证服务号配置 JS 接口安全域名后，可在网页写：
\`\`\`html
<wx-open-launch-weapp
  id="launch-btn"
  appid="wxAppId"
  path="pages/act/index?a=1">
  <template><style>.btn{...}</style><button class="btn">打开小程序</button></template>
</wx-open-launch-weapp>
\`\`\`
必须用户手动点击（不能自动跳）。

### 方式 C：公众号菜单直接配"小程序路径"
公众号后台 → 自定义菜单 → 菜单内容选"跳转小程序"，选 AppID 与路径即可。

## 三、小程序 ↔ App

### 小程序打开 App
只能通过 **\`<button open-type="launchApp">\`**，且需 App 侧通过微信开放标签注册：
1. 小程序/App 绑定到同一开放平台；
2. App 在微信注册 Link：iOS 用 Universal Link，Android 用 App Link（assetlinks.json）。

### App 打开小程序
App 集成微信 SDK：
- iOS：\`WXLaunchMiniProgramReq\` 发请求，指定 userName（小程序原始 ID gh_xxx）与 path。
- Android：\`SendMessageToWX.Req\` 的 WXMiniProgramObject，设置 userName/path。

## 四、H5 ↔ App（App Link / Universal Link / Scheme）

| 技术 | 平台 | 原理 |
| --- | --- | --- |
| **Custom Scheme** | iOS + Android | \`myapp://order/123\`，App 注册 scheme；缺点：未安装 App 时会报错，不能判断是否安装 |
| **Universal Links（iOS 9+）** | iOS | 站点根目录放 \`apple-app-site-association\`，声明"https://myapp.com/order/* 属于 com.xxx.app"；HTTPS 点击 → 已安装 App 直接进 → 未安装走 Safari 原网页 |
| **Android App Links** | Android 6+ | 根目录放 \`.well-known/assetlinks.json\`，用签名做校验；与 Universal Links 体验一致 |
| **Chrome Intents** | Android Chrome | \`intent://...#Intent;scheme=...;package=...;S.browser_fallback_url=...;end\`，未安装跳指定 fallback URL |

### 推荐 H5 → App 体验：
用户点击"打开 App 查看详情"按钮：
1. 尝试跳转 Universal Link / App Link（成功 → 直接进 App，失败不中断）；
2. 2~3 秒后未收到 App 切后台消息，自动"下载页引导"或"应用商店跳转"；
3. Android 端保底用 Chrome Intent 带 fallback。

## 五、重要限制汇总（面试高频）

1. **web-view 不支持个人小程序**，需要企业主体 + 配置业务域名（白名单机制）。
2. **小程序不能随意跳转外部 H5**，只能用 \`<web-view>\` 加载且域名必须在白名单；外部浏览器跳转小程序必须用 URL Link/Scheme。
3. **小程序不能静默唤起 App**：必须用户点击按钮；App 之间互跳需 Universal Link / App Links。
4. **微信支付 / 公众号支付 / App 支付** 三套是不同的支付产品（支付权限不一致），前端要注意下单接口的参数差异。
5. **iOS Safari 禁止自动打开自定义 Scheme**：必须由用户手势触发（click 事件回调内触发才有效）。
`
  },
  {
    id: 'mob-017',
    category: 'mobile',
    title: 'uni-app 的 easycom 自动按需引入组件、uniCloud 云开发、uni-id 用户体系是什么？',
    difficulty: '中等',
    tags: ['uni-app', 'easycom', 'uniCloud', 'uni-id', '云开发'],
    answer: `## 一、easycom：组件自动按需引入

uni-app 默认启用的组件自动注册机制（2.5.5+），目的是"用组件不用写 import/usingComponents"。

### 默认规则
只要组件路径符合以下规则，**任意页面使用时不用 import，直接写标签**：
\`\`\`
src/components/组件名/组件名.vue
或
src/components/uni-xxx/uni-xxx.vue  （uni-ui 官方库就是这种结构）
\`\`\`

比如你有 \`src/components/my-btn/my-btn.vue\`，页面里直接：
\`\`\`vue
<template>
  <my-btn type="primary">点我</my-btn>
</template>
\`\`\`
**不需要 import，不需要 components 注册**，就像全局组件一样。

### 自定义规则（pages.json）
当你的组件路径不符合默认结构时，在 pages.json 中用 \`easycom.custom\` 正则匹配：
\`\`\`json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^u-(.*)": "@/uview-plus/components/u-$1/u-$1.vue",
      "^my-(.*)": "@/lib/my-ui/components/my-$1/index.vue"
    }
  }
}
\`\`\`
- \`autoscan: true\`：运行时还会扫 components 目录做兜底。
- 键是**正则**，值是**组件路径**（支持 \`$1\` 捕获组）。

### 优点
1. 减少模板代码（不用每个页面 import 一堆组件）。
2. 产物按需打包（没用到的组件不会进包）。
3. 第三方组件库接入非常干净（uni-ui / uview / vant-weapp 的 uni 版都靠它）。

## 二、uniCloud：DCloud 的 Serverless 云开发

类似"微信云开发"，但**跨端**（H5/小程序/App 都能用一套云函数/云数据库/云存储），底层在阿里云和腾讯云上都有实例。

### 三块核心能力
| 能力 | 对应产品 | 说明 |
| --- | --- | --- |
| **云函数**（Node.js） | AWS Lambda / 微信云函数 | 处理业务逻辑，自带鉴权；可上传 public 模块 |
| **云数据库**（MongoDB 协议） | DynamoDB / 微信云数据库 | 前端和云函数都能 CRUD，权限基于 Schema 的 \`permission.read/write\` |
| **云存储**（OSS/COS） | S3 / 微信云存储 | 上传图片/文件，返回 CDN URL；支持 \`uniCloud.uploadFile\` |

### 典型流程
1. HBuilderX 新建 "uniCloud 项目"，选择服务空间（aliyun 或 tencent）。
2. 在 \`uniCloud/cloudfunctions/login/index.js\` 写云函数：
   \`\`\`js
   'use strict';
   const uniId = require('uni-id');
   exports.main = async (event, context) => {
     const { code } = event
     const uniIdToken = event.uniIdToken
     // 用 uni-id 做鉴权 & 登录
     const { token, userInfo } = await uniId.loginByWeixin({ code })
     return { token, userInfo }
   };
   \`\`\`
3. 前端调用：
   \`\`\`js
   const res = await uniCloud.callFunction({
     name: 'login',
     data: { code: 'xxx' }
   })
   \`\`\`

### 与自建后端的对比
- 不用买服务器、不用配域名/HTTPS/nginx；项目启动快（MVP 首选）。
- 与 uni-id、uni-admin、uni-starter 一体化，用户、权限、管理后台都现成。
- 缺点：强依赖 DCloud 生态，后期迁出自建服务需要把云函数改写为 Express/Nest 等。

## 三、uni-id：DCloud 出品的全端统一用户体系 SDK

基于 uniCloud 的云函数 + 数据库，提供 **登录/注册/权限角色/多端互通** 全家桶：

### 功能清单
- 注册：邮箱、手机号验证码、用户名、邀请码；
- 登录：账号密码、手机号验证码、**微信小程序 code（uni.login → code）**、微信公众号 OAuth、App 微信登录、Apple 登录；
- Token：签发 JWT 风格的 \`uniIdToken\`，自动续签；
- 权限：\`role / permission\` 两张表，前端/云函数里都能 \`uniId.hasPermission('order:list')\`；
- 安全：图片验证码、滑块、接口限流、密码强度校验。

### 数据库 3 张核心表
- \`uni-id-users\`：用户（含 openid / unionid / mobile / email / password_hash）。
- \`uni-id-roles\`：角色 → 权限集合映射。
- \`uni-id-permissions\`：权限树（菜单级 / 接口级）。

### 接入流程（小程序微信登录举例）
1. 云函数端启用 uni-id：
   \`\`\`js
   const uniId = require('uni-id')
   uniId.init({ context })
   const { token, userInfo } = await uniId.loginByWeixin({ code, needPermission: true })
   \`\`\`
2. 前端保存 token：
   \`\`\`js
   uni.setStorageSync('uni_id_token', res.result.token)
   // 后续请求会自动附带（uni.request 里拦截器注入）
   \`\`\`
3. 任意云函数里取当前登录用户：
   \`\`\`js
   const { uid, role, permission } = await uniId.checkToken(event.uniIdToken)
   \`\`\`

## 四、三者关系图

\`\`\`
┌─────────────────────────────────────┐
│      uni-app 前端（H5/小程序/App）    │  ← easycom：自动找组件 + 按需打包
└──────────────┬──────────────────────┘
               │ callFunction / uploadFile
┌──────────────▼──────────────────────┐
│            uniCloud 后端             │  ← 云函数 + 云数据库 + 云存储
│   ┌─────────────────────────────┐   │
│   │     uni-id 用户体系 SDK      │   │  ← 登录 + 权限 + 多端互通
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
\`\`\`

**一句话总结**：easycom 帮你省"组件 import"，uniCloud 帮你省"服务器运维"，uni-id 帮你省"用户体系轮子"。
`
  },
  {
    id: 'mob-018',
    category: 'mobile',
    title: 'Taro 的设计思路？它如何把 React/Vue 代码编译成小程序？编译期 vs 运行时方案对比？',
    difficulty: '困难',
    tags: ['Taro', '编译原理', '小程序', 'React', 'Vue', 'AST'],
    answer: `## 一、Taro 是什么

京东凹凸实验室出品的**多端统一开发解决方案**：
- 一套代码（React 18 / Vue 3 任意选）；
- 产物编译到 **微信小程序 / 支付宝 / 抖音 / H5 / React Native / 鸿蒙** 等。

Taro 的核心哲学是"**Write Once, Run Anywhere，而不是 Learn Once, Write Anywhere**"——用社区最熟悉的 React/Vue 语法去写，编译产物尽可能接近各端原生代码。

## 二、Taro 的两大阶段：编译期 + 运行时

\`\`\`
用户代码（.tsx / .vue）
      │  ① 编译期（Node）
      ▼
  Parser 解析 AST
      │  ② AST 转换：把 JSX / Vue Template 转换成目标端 DSL 语法树
      ▼
  Generator 输出产物：.wxml / .wxss / .js（小程序） or .html / .css / .js（H5） or RN 桥接模块
      │  ③ 运行时（端上）
      ▼
  @tarojs/runtime + 对应端适配器：
  - 小程序：把 React 的调度器 Scheduler 与小程序 setData 绑定
  - H5：直接跑 React/Vue + 路由/API polyfill
  - RN：走 Native 渲染
\`\`\`

## 三、编译期做了什么（核心）

1. **入口分析**：扫描 \`src/app.config.ts\` 里的 pages 配置，确定所有页面、分包、全局配置。
2. **每个页面（.tsx/.vue）独立编译**：
   - Parser：
     - React 代码用 Babel 解析成 TSX AST（@babel/parser，支持 TS + Decorators）。
     - Vue 代码用 \`@vue/compiler-sfc\` 解析。
   - Transformer：
     - 把 React 的 JSX \`<View className="a" onClick={fn}>xxx</View>\` 转换为小程序 WXML 的：
       \`\`\`xml
       <view class="a" bindtap="e1">{{ t0 }}</view>
       \`\`\`
       同时在页面 JS 生成一份 **静态模板 + 动态数据绑定映射**。
     - 把 \`useState / props.children / Context / useMemo\` 等 React 概念映射到小程序的 Component / Behavior / observers。
     - 样式：\`className + scoped CSS hash\` → \`wxss class + 前缀 hash\`；\`<style jsx / styled-components>\` 也会做转换。
   - Code Generator：基于目标端插件输出文件（mp-weixin 插件输出 wxss/axml 等；h5 插件输出 SPA 路由）。
3. **构建优化**：Taro 4.x 基于 Vite / Rspack（按需切换），提供 **预编译**、**依赖 DCE**、**分包同步**、**自动按需引入**（Vant/antd-mobile）等。

## 四、运行时做了什么

小程序端 React 运行时（\`@tarojs/react\` + \`@tarojs/runtime\`）最关键：
- 保留了 React 的 Fiber、Hooks、Context 等**完整语义**。
- 把 React 渲染器（Renderer）对接"小程序 Component"抽象：
  - 每次 React 提交 commit 后，把 diff 结果通过小程序的 \`setData\` 发送到 View 层。
  - \`onClick / onChange\` 在小程序端是合成事件：小程序 native 事件 → Taro 合成事件 → React 事件系统。
- 小程序没有 DOM，Taro 用一棵"虚拟 DOM 树"在内存维护状态，再映射到小程序 WXML 里已生成的"模板槽位"。

Vue 3 端类似：保留 Vue 响应式 + 运行时语义，把 Vue Renderer 的 patch 流程映射到小程序 setData。

## 五、编译期方案 vs 运行时方案对比（面试高频）

| 维度 | 编译期方案（Taro / uni-app 主要采用） | 运行时方案（比如早期小程序自定义 DSL解释器，或 Kbone 把 Vue/React 跑在小程序 JSCore 里再驱动 DOM）|
| --- | --- | --- |
| **产物** | 接近**原生小程序**（直接生成 WXML/WXSS/小程序 JS） | 一个通用"小程序页面" + 你的 JS 代码在 JSCore 动态构建 V-DOM 后再驱动统一 WXML |
| **性能** | 高：模板在编译期就确定，运行时只 setData 数据差 | 较低：V-DOM diff 在逻辑层完成后，还需要 patch 统一模板，模板层级深，数据大 |
| **包体积** | 模板生成可能略冗余，但可 Tree-shaking | 需附带"通用渲染内核"，基础体积较大 |
| **特性支持** | 受限于模板能否表达（部分动态 JSX 写法受限） | 运行时动态，JSX/动态组件自由度高 |
| **典型代表** | Taro、uni-app | Kbone（微信官方出品，兼容 web 生态运行时）、Remax（React 运行时） |

**Taro 3+ 走"编译期模板 + React 运行时 Hooks"的混合路线**，兼顾性能与生态完整度：
- 模板在编译期生成（性能）；
- Hooks/Context/调度器在运行时保留完整语义（兼容 React 生态）。

## 六、使用 Taro 的常见限制（面试要能讲出来）

1. **不能在 JSX 中写任意动态结构**：比如 \`React.createElement(unknown, props)\` 动态组件名，编译期无法确定，需要 fallback 到 runtime slot，会有性能成本。
2. **小程序特性差异**：条件编译 \`\`\`js
/* #ifdef MP-WEIXIN */ wx.createSelectorQuery()
/* #endif */
\`\`\`（Taro 用 process.env.TARO_ENV 做跨端分支）。
3. **CSS 限制**：小程序样式隔离（与 Taro 的 CSS Modules/Hashed 策略）决定了跨组件 \`/deep/ ::v-deep\` 等写法按平台做兼容。
4. **原生组件接第三方 SDK**：用 Taro 的 \`config.enableExtractor = true\` 把页面编译为原生页，或写一个原生 CustomElement 用 \`\$\{原生组件路径\}\` 方式引入。
`
  }
]
