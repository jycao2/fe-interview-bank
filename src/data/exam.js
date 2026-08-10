// 考试模块选择题题库
// 结构与 Q&A 题库不同：question(题干) / options(选项数组) / answer(正确选项索引，0 起) / analysis(解析)
// 一次考试从中随机抽取 30 题
export const examQuestions = [
  // ===== JavaScript =====
  {
    id: 'mcq-001',
    category: 'javascript',
    difficulty: '简单',
    question: '以下哪个不属于 JavaScript 的原始类型（primitive）？',
    options: ['string', 'number', 'object', 'symbol'],
    answer: 2,
    analysis: '原始类型有 7 种：string、number、boolean、null、undefined、symbol、bigint。object 是引用类型，不是原始类型。'
  },
  {
    id: 'mcq-002',
    category: 'javascript',
    difficulty: '简单',
    question: 'typeof null 的返回值是？',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    answer: 2,
    analysis: '这是 JS 的一个著名历史 bug。null 在底层二进制表示中低三位为 000，与对象标志相同，所以 typeof null 返回 "object"。判断 null 应该用 value === null。'
  },
  {
    id: 'mcq-003',
    category: 'javascript',
    difficulty: '中等',
    question: '以下代码输出什么？\nconsole.log([1, 2, 3].map(parseInt))',
    options: ['[1, 2, 3]', '[1, NaN, NaN]', '[1, 2, NaN]', '[NaN, NaN, NaN]'],
    answer: 1,
    analysis: 'map 回调接收 (item, index, array)。parseInt 接收 (string, radix)。所以实际调用：parseInt(1,0)=1、parseInt(2,1)=NaN（radix 1 非法）、parseInt(3,2)=NaN（3 不是二进制有效数字）。结果 [1, NaN, NaN]。'
  },
  {
    id: 'mcq-004',
    category: 'javascript',
    difficulty: '简单',
    question: '关于 let / const / var，下列说法错误的是？',
    options: [
      'var 声明的变量存在变量提升，let/const 也有提升但存在暂时性死区',
      'const 声明后必须立即初始化，且不能再重新赋值',
      'let 和 const 声明的变量不会成为 window 对象的属性',
      'const 声明的对象，其内部属性也不能被修改'
    ],
    answer: 3,
    analysis: 'const 限制的是变量绑定（不能重新赋值），但对象的内部属性仍可修改。若要冻结对象内容需用 Object.freeze()。'
  },
  {
    id: 'mcq-005',
    category: 'javascript',
    difficulty: '中等',
    question: '以下代码输出什么？\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}',
    options: ['0 1 2', '3 3 3', '0 0 0', '1 2 3'],
    answer: 1,
    analysis: 'var 是函数作用域，循环结束后 i 变为 3。setTimeout 回调在循环结束后才执行，三个回调都引用同一个 i，输出 3 3 3。改用 let（块作用域，每次迭代新绑定）输出 0 1 2。'
  },
  {
    id: 'mcq-006',
    category: 'javascript',
    difficulty: '中等',
    question: '关于闭包，下列说法正确的是？',
    options: [
      '闭包会导致内存泄漏，应尽量避免使用',
      '闭包是函数与其词法环境的组合，能访问外部函数的变量',
      '闭包只能在箭头函数中形成',
      '闭包无法访问已销毁函数的变量'
    ],
    answer: 1,
    analysis: '闭包是函数与其词法作用域的组合，使内部函数能访问外部函数的变量。闭包本身不是内存泄漏，只有在不当使用（如长期持有不释放）时才可能造成内存占用。'
  },
  {
    id: 'mcq-007',
    category: 'javascript',
    difficulty: '简单',
    question: 'Promise.all 和 Promise.race 的区别是？',
    options: [
      'all 等待全部成功，race 等待第一个完成（无论成功失败）',
      'all 等待全部完成，race 只等第一个成功',
      'all 遇到 reject 仍继续，race 遇到 reject 立即返回',
      '两者完全相同'
    ],
    answer: 0,
    analysis: 'Promise.all：所有 Promise 都 fulfilled 才 fulfilled，任一 reject 立即 reject。Promise.race：第一个 settle（fulfilled 或 rejected）的 Promise 决定结果。'
  },
  {
    id: 'mcq-008',
    category: 'javascript',
    difficulty: '中等',
    question: '事件循环中，以下执行顺序是？\nconsole.log(1)\nsetTimeout(() => console.log(2))\nPromise.resolve().then(() => console.log(3))\nconsole.log(4)',
    options: ['1 2 3 4', '1 4 3 2', '1 4 2 3', '1 3 4 2'],
    answer: 1,
    analysis: '同步代码先执行：1、4。微任务（Promise.then）在当前宏任务结束后执行：3。宏任务（setTimeout）最后执行：2。顺序 1 4 3 2。'
  },
  {
    id: 'mcq-009',
    category: 'javascript',
    difficulty: '中等',
    question: '关于 this 指向，下列说法错误的是？',
    options: [
      '普通函数的 this 在调用时确定，取决于调用方式',
      '箭头函数的 this 在定义时继承外层作用域',
      'call/apply/bind 可以改变函数的 this 指向',
      '构造函数中的 this 指向原型对象'
    ],
    answer: 3,
    analysis: '构造函数中的 this 指向新创建的实例对象（new 操作符创建的实例），不是原型对象。原型对象上的方法被实例调用时 this 才指向实例。'
  },
  {
    id: 'mcq-010',
    category: 'javascript',
    difficulty: '简单',
    question: '0.1 + 0.2 === 0.3 的结果是？',
    options: ['true', 'false', '报错', 'undefined'],
    answer: 1,
    analysis: '浮点数采用 IEEE 754 双精度，0.1 和 0.2 无法精确表示，相加得到 0.30000000000000004，不等于 0.3。比较应用 Math.abs(a - b) < Number.EPSILON。'
  },
  {
    id: 'mcq-011',
    category: 'javascript',
    difficulty: '简单',
    question: '以下哪个方法不能用于判断数组？',
    options: [
      'Array.isArray([])',
      '[] instanceof Array',
      'Object.prototype.toString.call([]) === "[object Array]"',
      'typeof [] === "array"'
    ],
    answer: 3,
    analysis: 'typeof 对数组返回 "object"，不能区分数组。其他三种都可以：Array.isArray 最推荐，instance 在多 iframe 下可能失效，toString 最通用。'
  },
  {
    id: 'mcq-012',
    category: 'javascript',
    difficulty: '中等',
    question: '关于 Proxy 和 Object.defineProperty，下列说法错误的是',
    options: [
      'Proxy 能监听新增属性，defineProperty 不能',
      'Proxy 能监听数组下标修改和 length，defineProperty 不能（需重写数组方法）',
      'Proxy 是深度监听，defineProperty 是浅监听',
      'Vue3 用 Proxy 实现响应式，Vue2 用 defineProperty'
    ],
    answer: 2,
    analysis: 'Proxy 本身也是浅监听（只代理一层），深度监听需要递归（懒代理：访问时才代理）。两者的关键区别是 Proxy 能拦截更多操作（新增/删除属性、数组操作），且性能更好（无需遍历初始化）。'
  },

  // ===== CSS =====
  {
    id: 'mcq-013',
    category: 'css',
    difficulty: '简单',
    question: 'CSS 盒模型 box-sizing: border-box 的特点是？',
    options: [
      'width 只包含 content',
      'width 包含 content + padding + border',
      'width 包含 content + padding + border + margin',
      'width 只包含 content + padding'
    ],
    answer: 1,
    analysis: 'border-box：width 包含 content + padding + border（不含 margin）。content-box（默认）：width 只含 content。border-box 让布局更可控，常作为全局重置。'
  },
  {
    id: 'mcq-014',
    category: 'css',
    difficulty: '中等',
    question: '以下哪种方式可以触发 BFC（块级格式化上下文）？',
    options: [
      'position: static',
      'overflow: hidden',
      'display: block',
      'float: none'
    ],
    answer: 1,
    analysis: '触发 BFC 的方式：overflow 非 visible（hidden/auto/scroll）、float 非 none、position 为 absolute/fixed、display 为 flow-root/flex/grid/inline-block 等。BFC 常用于清除浮动、避免 margin 塌陷。'
  },
  {
    id: 'mcq-015',
    category: 'css',
    difficulty: '简单',
    question: 'Flex 布局中，justify-content 和 align-items 分别控制？',
    options: [
      '主轴对齐 / 交叉轴对齐',
      '交叉轴对齐 / 主轴对齐',
      '都是主轴对齐',
      '都是交叉轴对齐'
    ],
    answer: 0,
    analysis: 'justify-content 控制主轴（main axis）方向对齐，align-items 控制交叉轴（cross axis）方向对齐。主轴由 flex-direction 决定（默认 row 时水平为主轴）。'
  },
  {
    id: 'mcq-016',
    category: 'css',
    difficulty: '简单',
    question: 'CSS 选择器优先级从高到低，正确的是？',
    options: [
      '!important > 内联 > ID > 类/伪类/属性 > 标签/伪元素',
      'ID > 类 > 标签 > 内联 > !important',
      '内联 > ID > !important > 类 > 标签',
      '!important > 类 > ID > 内联 > 标签'
    ],
    answer: 0,
    analysis: '优先级：!important > 内联样式(1000) > ID(100) > 类/伪类/属性(10) > 标签/伪元素(1) > 通配符(0)。相同优先级时后写的覆盖。'
  },
  {
    id: 'mcq-017',
    category: 'css',
    difficulty: '简单',
    question: '实现元素水平垂直居中，以下哪个方案不适用？',
    options: [
      'display: flex; justify-content: center; align-items: center',
      'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)',
      'position: absolute; margin: auto; 配合 top/right/bottom/left: 0',
      'text-align: center; line-height: 等于高度'
    ],
    answer: 3,
    analysis: 'text-align + line-height 只适用于单行文本水平垂直居中，不适用于块级元素。前三种都是通用居中方案。'
  },
  {
    id: 'mcq-017b',
    category: 'css',
    difficulty: '中等',
    question: '关于 CSS 动画 transform 和直接改 left/top 的区别，正确的是？',
    options: [
      '两者性能相同',
      'transform 触发重排，left/top 只触发重绘',
      'transform 只触发合成（不重排不重绘），性能更好',
      'left/top 性能更好'
    ],
    answer: 2,
    analysis: 'transform 在 GPU 合成层处理，不触发布局（重排）和绘制（重绘），直接合成，性能最好。改 left/top 会触发重排（layout），性能差。动画优先用 transform/opacity。'
  },
  {
    id: 'mcq-018',
    category: 'css',
    difficulty: '简单',
    question: 'rem 和 em 的区别是？',
    options: [
      'rem 相对根元素字体大小，em 相对父元素字体大小',
      'rem 相对父元素，em 相对根元素',
      '两者都相对根元素',
      '两者都相对父元素'
    ],
    answer: 0,
    analysis: 'rem 相对 html 根元素 font-size（1rem = 根字号）。em 相对父元素 font-size（用在 font-size 时相对父，用在其他属性时相对自身字号）。rem 更适合做整体缩放响应式。'
  },

  // ===== HTML =====
  {
    id: 'mcq-019',
    category: 'html',
    difficulty: '简单',
    question: '以下哪个 HTML 标签是语义化标签？',
    options: ['div', 'span', 'article', 'b'],
    answer: 2,
    analysis: 'article 是 HTML5 语义化标签，表示独立的文章内容。div/span 是无语义容器，b 是样式标签（应用 CSS 而非 b）。语义化利于 SEO 和可访问性。'
  },
  {
    id: 'mcq-020',
    category: 'html',
    difficulty: '简单',
    question: 'localStorage、sessionStorage、cookie 的描述错误的是？',
    options: [
      'localStorage 持久存储，除非手动清除',
      'sessionStorage 关闭标签页后清除',
      'cookie 存储容量大（约 5MB），用于存储大量数据',
      'cookie 每次请求自动携带到同源服务器'
    ],
    answer: 2,
    analysis: 'cookie 容量很小（约 4KB），主要用于会话标识，每次 HTTP 请求自动携带。localStorage 和 sessionStorage 容量约 5MB，不自动发送到服务器。'
  },
  {
    id: 'mcq-021',
    category: 'html',
    difficulty: '中等',
    question: 'script 标签的 async 和 defer 属性的区别是？',
    options: [
      '两者完全相同',
      'async 下载完立即执行（不保证顺序），defer 等文档解析完后按顺序执行',
      'defer 下载完立即执行，async 等文档解析完执行',
      '两者都会阻塞 HTML 解析'
    ],
    answer: 1,
    analysis: 'async：下载不阻塞，下载完立即执行（执行时阻塞），执行顺序不确定，适合独立脚本（如统计）。defer：下载不阻塞，等 HTML 解析完后按顺序执行，适合有依赖的脚本。'
  },
  {
    id: 'mcq-022',
    category: 'html',
    difficulty: '简单',
    question: '关于 DOCTYPE 声明，正确的是？',
    options: [
      'HTML5 用 <!DOCTYPE html>，必须严格小写',
      '<!DOCTYPE html> 声明 HTML5，大小写不敏感',
      'HTML5 不需要 DOCTYPE',
      'DOCTYPE 只影响 JavaScript 行为'
    ],
    answer: 1,
    analysis: '<!DOCTYPE html> 是 HTML5 声明，大小写不敏感。它的作用是触发浏览器的标准模式（standards mode），不写会进入怪异模式（quirks mode），影响盒模型等渲染行为。'
  },
  {
    id: 'mcq-023',
    category: 'html',
    difficulty: '简单',
    question: '以下哪个属性能让 input 在表单提交时必填？',
    options: ['placeholder', 'required', 'mandatory', 'must'],
    answer: 1,
    analysis: 'required 属性标记表单字段为必填，提交时若为空浏览器会阻止提交并提示。placeholder 是占位提示文字，不影响验证。'
  },

  // ===== Vue =====
  {
    id: 'mcq-024',
    category: 'vue',
    difficulty: '中等',
    question: 'Vue3 中 ref 和 reactive 的区别，正确的是？',
    options: [
      'ref 用于基本类型，reactive 用于对象',
      'ref 包装后需用 .value 访问，reactive 直接访问',
      'ref 不能用于对象，reactive 不能用于基本类型',
      '两者完全等价'
    ],
    answer: 1,
    analysis: '核心区别：ref 需 .value 访问（模板自动解包），reactive 直接访问。ref 可用于任何类型（对象内部也用 reactive 代理），reactive 只能用于对象/数组（基本类型会警告且无响应式）。'
  },
  {
    id: 'mcq-025',
    category: 'vue',
    difficulty: '简单',
    question: 'Vue3 相比 Vue2 的主要改进不包括以下哪项？',
    options: [
      '用 Proxy 替代 Object.defineProperty 实现响应式',
      'Composition API 解决逻辑复用问题',
      '自动删除所有 Options API',
      '编译优化（PatchFlag、Block Tree、静态提升）'
    ],
    answer: 2,
    analysis: 'Vue3 仍保留 Options API（向后兼容），并未删除。改进包括：Proxy 响应式、Composition API、编译优化、Tree-shaking 友好、TypeScript 支持等。'
  },
  {
    id: 'mcq-026',
    category: 'vue',
    difficulty: '中等',
    question: 'v-if 和 v-show 的区别，错误的是？',
    options: [
      'v-if 是真正的条件渲染，v-show 只是切换 display',
      'v-if 切换开销大，v-show 初始渲染开销大',
      'v-if 为 false 时元素不渲染到 DOM，v-show 元素始终在 DOM',
      'v-show 适合频繁切换，v-if 适合不常切换'
    ],
    answer: 1,
    analysis: '题描述本身有误：v-if 初始渲染开销小（false 时不渲染），切换开销大（销毁/重建）；v-show 初始渲染开销大（无论真假都渲染），切换开销小（只改 display）。选项 B 把"初始渲染"说反了，故错误。'
  },
  {
    id: 'mcq-027',
    category: 'vue',
    difficulty: '中等',
    question: 'Vue 中 key 的作用是？',
    options: [
      '仅用于 CSS 选择器',
      '帮助 diff 算法识别节点，避免就地复用导致的状态错乱',
      '加速事件绑定',
      '只有 v-for 才需要'
    ],
    answer: 1,
    analysis: 'key 是节点的身份标识，diff 时通过 key 判断节点是否可复用。无 key 会就地复用（按索引），可能导致输入框状态错乱等 bug。用唯一且稳定的 id，避免用 index。'
  },
  {
    id: 'mcq-028',
    category: 'vue',
    difficulty: '中等',
    question: 'computed 和 watch 的区别，正确的是？',
    options: [
      'computed 有缓存，watch 没有',
      'computed 用于副作用（如发请求），watch 用于派生值',
      '两者完全等价',
      'watch 支持异步，computed 不支持'
    ],
    answer: 0,
    analysis: 'computed：有缓存、必须返回值、用于派生状态、不应有副作用。watch：无缓存、监听值变化执行副作用（可异步）、不返回值。选项 D 错误：computed 不应异步但技术上能，watch 才是处理异步的。'
  },
  {
    id: 'mcq-029',
    category: 'vue',
    difficulty: '简单',
    question: 'Vue3 中父子组件通信方式不包括？',
    options: [
      'props / emits',
      'provide / inject',
      'v-model',
      '直接修改父组件状态（子组件 this.$parent.data = xxx）'
    ],
    answer: 3,
    analysis: '直接修改父组件状态违背单向数据流，应通过 emit 事件通知父组件修改。正确方式：props(下行)/emits(上行)、v-model、provide/inject、ref + defineExpose、Pinia。'
  },
  {
    id: 'mcq-030',
    category: 'vue',
    difficulty: '中等',
    question: 'Vue 的 nextTick 的作用是？',
    options: [
      '延迟执行代码到下一次事件循环',
      '在 DOM 更新之后执行回调',
      '取消上一次的操作',
      '触发组件重新渲染'
    ],
    answer: 1,
    analysis: 'nextTick 在下次 DOM 更新循环结束后执行回调。Vue 异步更新 DOM，修改响应式数据后立即读 DOM 还是旧值，用 nextTick 确保拿到更新后的 DOM。'
  },
  {
    id: 'mcq-031',
    category: 'vue',
    difficulty: '简单',
    question: '关于 Pinia 和 Vuex，错误的是？',
    options: [
      'Pinia 去掉了 mutation，直接修改 state',
      'Pinia 对 TypeScript 支持更好',
      'Pinia 支持模块化，无需嵌套模块',
      'Pinia 不支持开发工具调试'
    ],
    answer: 3,
    analysis: 'Pinia 完整支持 Vue DevTools 调试（时间旅行、状态追踪）。Pinia 优势：无 mutation、TS 友好、扁平化 store、体积小、支持组合式写法。是 Vue3 官方推荐。'
  },

  // ===== React =====
  {
    id: 'mcq-032',
    category: 'react',
    difficulty: '简单',
    question: 'React Hooks 不能在以下哪种场景使用？',
    options: [
      '函数组件顶层',
      '自定义 Hook 中',
      '类组件的方法中',
      '条件语句之外的位置'
    ],
    answer: 2,
    analysis: 'Hooks 只能在函数组件或自定义 Hook 的顶层调用，不能在类组件、条件/循环/嵌套函数中调用（依赖调用顺序的链表实现）。类组件用 this.state 和生命周期。'
  },
  {
    id: 'mcq-033',
    category: 'react',
    difficulty: '简单',
    question: 'useEffect 的第二个参数（依赖数组）为空数组 [] 时，effect 执行时机是？',
    options: [
      '每次渲染后都执行',
      '只在组件挂载后执行一次',
      '不执行',
      '只在卸载时执行'
    ],
    answer: 1,
    analysis: '空数组 [] 表示无依赖，effect 只在挂载后执行一次，返回的清理函数在卸载时执行。不传第二个参数则每次渲染都执行。传具体依赖则在依赖变化时执行。'
  },
  {
    id: 'mcq-034',
    category: 'react',
    difficulty: '中等',
    question: 'React 中 key 的作用错误的是？',
    options: [
      '帮助 React 识别哪些元素变化，提升 diff 性能',
      '应使用唯一稳定的 id，避免用数组索引',
      'key 必须全局唯一',
      'key 改变会导致组件卸载重建'
    ],
    answer: 2,
    analysis: 'key 只需在兄弟节点间唯一，不需要全局唯一。key 用于 diff 算法识别节点身份，用 index 会导致状态错乱（重排时）。key 变化会触发卸载重建。'
  },
  {
    id: 'mcq-035',
    category: 'react',
    difficulty: '中等',
    question: 'React 18 的并发特性（Concurrent）不包括？',
    options: [
      'useTransition',
      'useDeferredValue',
      '自动批处理（Automatic Batching）',
      'useSyncExternalStore 替代 useEffect'
    ],
    answer: 3,
    analysis: 'useSyncExternalStore 是 React 18 新增的 Hook，用于安全订阅外部 store（解决 tearing 问题），但不是"替代 useEffect"。并发特性包括：自动批处理、useTransition、useDeferredValue、Suspense for data fetching、Streaming SSR。'
  },
  {
    id: 'mcq-036',
    category: 'react',
    difficulty: '中等',
    question: '关于 useMemo 和 useCallback，正确的是？',
    options: [
      'useMemo 缓存值，useCallback 缓存函数',
      'useMemo 缓存函数，useCallback 缓存值',
      '两者完全相同',
      'useCallback 是 useMemo 的语法糖，等价 useMemo(() => fn, deps)'
    ],
    answer: 0,
    analysis: 'useMemo 缓存计算结果（值），useCallback 缓存函数引用。实际上 useCallback(fn, deps) 等价于 useMemo(() => fn, deps)。用于避免子组件不必要的重渲染（配合 React.memo）。'
  },
  {
    id: 'mcq-037',
    category: 'react',
    difficulty: '中等',
    question: 'React Fiber 架构的主要目的是？',
    options: [
      '让渲染更快',
      '将渲染工作拆分为可中断、可恢复的单元，支持优先级调度',
      '减少代码体积',
      '替代虚拟 DOM'
    ],
    answer: 1,
    analysis: 'Fiber 是链表结构的虚拟 DOM，核心目的是把不可中断的同步渲染拆分为可中断/可恢复的工作单元，支持时间分片和优先级调度（并发模式），避免长任务阻塞交互。'
  },

  // ===== TypeScript =====
  {
    id: 'mcq-038',
    category: 'typescript',
    difficulty: '中等',
    question: 'TypeScript 中 interface 和 type 的区别，错误的是？',
    options: [
      'interface 支持声明合并（同名自动合并），type 不支持',
      'type 可以定义联合类型、元组等，interface 不能直接定义',
      'interface 只能描述对象类型，type 能描述任意类型',
      'interface 和 type 完全等价，可互换'
    ],
    answer: 3,
    analysis: '两者不完全等价。interface 支持声明合并、可被 implements 多个；type 更灵活（联合/交叉/映射/条件类型）。对象类型优先 interface，复杂类型用 type。'
  },
  {
    id: 'mcq-039',
    category: 'typescript',
    difficulty: '中等',
    question: 'TS 中 any 和 unknown 的区别是？',
    options: [
      '两者完全相同',
      'any 允许任意操作不报错，unknown 允许接收任意值但操作前必须类型检查',
      'unknown 允许任意操作，any 需类型检查',
      'any 是类型安全的，unknown 不安全'
    ],
    answer: 1,
    analysis: 'any 放弃类型检查（不安全）。unknown 是类型安全的 any：可接收任意值，但操作（访问属性、调用）前必须先收窄（typeof、instanceof、类型断言）。推荐用 unknown 替代 any。'
  },
  {
    id: 'mcq-040',
    category: 'typescript',
    difficulty: '中等',
    question: '泛型（Generics）的主要作用是？',
    options: [
      '减少代码体积',
      '创建可复用的、类型可参数化的组件，保留类型信息',
      '提升运行时性能',
      '替代 any'
    ],
    answer: 1,
    analysis: '泛型让类型成为参数，实现"类型可复用"的组件/函数，输入输出类型关联，保留类型安全。如 function identity<T>(x: T): T。泛型是编译时特性，不影响运行时。'
  },
  {
    id: 'mcq-041',
    category: 'typescript',
    difficulty: '简单',
    question: 'TS 中类型断言语法正确的是？',
    options: [
      'value as Type 和 <Type>value 都可以',
      '只能用 value as Type',
      '只能用 <Type>value',
      '用 value: Type'
    ],
    answer: 0,
    analysis: '两种语法：value as Type（推荐，JSX 中也兼容）和 <Type>value（在 JSX 中与组件歧义，不推荐）。类型断言是告诉编译器"我知道类型"，不进行运行时转换。'
  },
  {
    id: 'mcq-042',
    category: 'typescript',
    difficulty: '中等',
    question: '关于 TS 的 enum，下列说法正确的是？',
    options: [
      'enum 只能是数字枚举',
      '数字枚举有反向映射（值 → 名），字符串枚举没有',
      'enum 会被完全擦除，不生成运行时代码',
      'const enum 与普通 enum 完全相同'
    ],
    answer: 1,
    analysis: '数字枚举会生成反向映射对象（可由值查名），字符串枚举只有正向映射。enum 会编译为运行时对象。const enum 会被内联（不生成对象），但可能在隔离编译时出问题，新项目常用联合类型替代。'
  },

  // ===== 浏览器原理 =====
  {
    id: 'mcq-043',
    category: 'browser',
    difficulty: '简单',
    question: '浏览器从输入 URL 到页面展示的大致流程，正确顺序是？',
    options: [
      'DNS 解析 → TCP 连接 → HTTP 请求 → 响应 → 解析 → 渲染',
      'TCP 连接 → DNS 解析 → HTTP 请求 → 渲染 → 解析',
      'HTTP 请求 → DNS 解析 → 渲染 → TCP 连接 → 解析',
      '渲染 → 解析 → DNS 解析 → TCP 连接 → HTTP 请求'
    ],
    answer: 0,
    analysis: '流程：DNS 解析（域名→IP）→ TCP 三次握手（HTTPS 还有 TLS）→ HTTP 请求 → 服务器响应 → HTML 解析构建 DOM/CSSOM → 渲染树 → 布局 → 绘制 → 合成。'
  },
  {
    id: 'mcq-044',
    category: 'browser',
    difficulty: '中等',
    question: '重排（reflow）和重绘（repaint）的关系是？',
    options: [
      '重排一定触发重绘，重绘不一定触发重排',
      '重绘一定触发重排',
      '两者互不触发',
      '两者完全相同'
    ],
    answer: 0,
    analysis: '重排（布局变化，如改 width/位置）必然导致重绘（重新绘制像素）。重绘（外观变化不影响布局，如 color/background）不会触发重排。重排开销远大于重绘，应尽量避免。'
  },
  {
    id: 'mcq-045',
    category: 'browser',
    difficulty: '简单',
    question: '同源策略中的"同源"是指？',
    options: [
      '协议、域名、端口三者都相同',
      '只要域名相同',
      '只要 IP 相同',
      '协议和端口相同即可'
    ],
    answer: 0,
    analysis: '同源 = 协议（http/https）+ 域名 + 端口 三者完全相同。不同源的请求受同源策略限制（不能读响应、不能访问 DOM）。跨域用 CORS、代理、postMessage 等方式解决。'
  },
  {
    id: 'mcq-046',
    category: 'browser',
    difficulty: '中等',
    question: '关于 Cookie 的 SameSite 属性，正确的是？',
    options: [
      'SameSite=None 可任意跨站携带，需配合 Secure',
      'SameSite=Strict 阻止所有跨站请求携带',
      'SameSite=Lax 是默认值，阻止第三方 cookie',
      '以上都对'
    ],
    answer: 3,
    analysis: 'SameSite=None：跨站携带（需 Secure）；Strict：绝不跨站；Lax：默认值，顶层导航 GET 携带，阻止第三方 cookie 防 CSRF。三者描述都正确。'
  },
  {
    id: 'mcq-047',
    category: 'browser',
    difficulty: '中等',
    question: '浏览器的垃圾回收机制主要采用？',
    options: [
      '引用计数',
      '标记清除（Mark-Sweep）为主，分代回收',
      '手动回收',
      '引用计数 + 手动回收'
    ],
    answer: 1,
    analysis: '现代浏览器（V8）主要用标记清除（从根可达性标记）+ 分代回收（新生代 Scavenge、老生代标记清除/整理）。引用计数有循环引用问题，已弃用。'
  },

  // ===== 计算机网络 =====
  {
    id: 'mcq-048',
    category: 'network',
    difficulty: '简单',
    question: 'HTTP 状态码 301 和 302 的区别是？',
    options: [
      '301 永久重定向，302 临时重定向',
      '301 临时，302 永久',
      '两者完全相同',
      '301 是客户端错误，302 是服务端错误'
    ],
    answer: 0,
    analysis: '301 Moved Permanently 永久重定向（浏览器缓存，下次直接跳新地址，SEO 权重转移）。302 Found 临时重定向（不缓存，每次都请求原地址）。3xx 都是重定向类。'
  },
  {
    id: 'mcq-049',
    category: 'network',
    difficulty: '简单',
    question: 'HTTP 和 HTTPS 的区别，错误的是？',
    options: [
      'HTTPS = HTTP + SSL/TLS，数据加密传输',
      'HTTPS 默认端口 443，HTTP 默认 80',
      'HTTPS 需要证书，HTTP 不需要',
      'HTTPS 比 HTTP 速度快'
    ],
    answer: 3,
    analysis: 'HTTPS 因加解密和握手开销，比 HTTP 慢（但 HTTP/2 + 会话复用已大幅缩小差距）。HTTPS 优势是安全（加密、完整性、身份认证）。其余选项都正确。'
  },
  {
    id: 'mcq-050',
    category: 'network',
    difficulty: '中等',
    question: '关于 HTTP 缓存，下列说法正确的是？',
    options: [
      'Cache-Control: no-cache 表示不缓存',
      'ETag 是资源的唯一标识，配合 If-None-Match 协商',
      '强缓存失效后会直接返回资源',
      'Last-Modified 比 ETag 更精确'
    ],
    answer: 1,
    analysis: 'no-cache 是"缓存但每次需协商验证"（不是不缓存），no-store 才是不缓存。ETag 配合 If-None-Match 做协商缓存。ETag 精度高于 Last-Modified（Last-Modified 只精确到秒）。'
  },
  {
    id: 'mcq-051',
    category: 'network',
    difficulty: '中等',
    question: 'TCP 三次握手的原因是？',
    options: [
      '为了确认双方的收发能力都正常',
      '三次比两次快',
      'TCP 协议规定必须三次',
      '为了加密数据'
    ],
    answer: 0,
    analysis: '三次握手确认双方都有发送和接收能力：SYN（客户端→服务端，确认客户端发送/服务端接收）、SYN+ACK（服务端→客户端，确认双向）、ACK（客户端→服务端，确认服务端发送/客户端接收）。两次无法确认客户端接收能力。'
  },
  {
    id: 'mcq-052',
    category: 'network',
    difficulty: '简单',
    question: 'GET 和 POST 的区别，错误的是？',
    options: [
      'GET 参数在 URL，POST 在请求体',
      'GET 可被缓存/收藏，POST 不可',
      'GET 有长度限制，POST 理论上无限制',
      'POST 比 GET 更安全（加密传输）'
    ],
    answer: 3,
    analysis: 'GET 和 POST 在 HTTPS 下都加密，安全性无差异。POST 参数在 body 不易被看到但不等于"安全"。真正的安全靠 HTTPS。其余选项基本正确（GET 长度限制是浏览器/服务器限制，非协议）。'
  },

  // ===== 性能优化 =====
  {
    id: 'mcq-053',
    category: 'performance',
    difficulty: '简单',
    question: 'Core Web Vitals 的三大核心指标是？',
    options: [
      'LCP（最大内容绘制）、FID（首次输入延迟）、CLS（累积布局偏移）',
      'FCP、TTFB、LCP',
      'DOM 树构建时间、白屏时间、首屏时间',
      '页面加载时间、资源体积、请求数'
    ],
    answer: 0,
    analysis: 'Core Web Vitals：LCP（加载，目标 <2.5s）、CLS（视觉稳定，目标 <0.1）。2024 年 INP 替代 FID 作为交互指标（目标 <200ms）。FCP/TTFB 是辅助指标。'
  },
  {
    id: 'mcq-054',
    category: 'performance',
    difficulty: '简单',
    question: '图片懒加载的实现思路是？',
    options: [
      '所有图片同时加载',
      '图片进入视口时才加载（IntersectionObserver 或监听 scroll）',
      '只加载第一张图片',
      '图片转 base64 内联'
    ],
    answer: 1,
    analysis: '懒加载：用 IntersectionObserver 监听图片是否进入视口，进入时把 data-src 赋给 src 触发加载。现代浏览器也可用 loading="lazy" 原生属性。减少首屏请求数。'
  },
  {
    id: 'mcq-055',
    category: 'performance',
    difficulty: '简单',
    question: '以下哪种方式不能减少首屏加载时间？',
    options: [
      '代码分割（路由懒加载）',
      '图片压缩 + 使用 WebP',
      '关键 CSS 内联，非关键 CSS 异步加载',
      '把所有 JS 打包成单个大文件并同步加载'
    ],
    answer: 3,
    analysis: '单个大文件同步加载会阻塞渲染，加长首屏时间。优化方向：代码分割、按需加载、压缩、缓存、懒加载、关键资源内联、HTTP/2 多路复用。'
  },

  // ===== 工程化 =====
  {
    id: 'mcq-056',
    category: 'engineering',
    difficulty: '中等',
    question: 'Webpack 中的 Tree Shaking 依赖的前提是？',
    options: [
      '使用 CommonJS 模块',
      '使用 ES Modules（静态结构），且 package.json 配置 sideEffects',
      '开启代码压缩',
      '使用动态 import'
    ],
    answer: 1,
    analysis: 'Tree Shaking 依赖 ES Modules 的静态结构（import/export 在编译期可分析）。需在 package.json 配置 "sideEffects": false（或指定有副作用的文件），并设置 mode: production。CJS 是动态的，无法摇树。'
  },
  {
    id: 'mcq-057',
    category: 'engineering',
    difficulty: '简单',
    question: 'Vite 比 Webpack 开发启动快的主要原因是？',
    options: [
      'Vite 不做任何编译',
      'Vite 开发期用浏览器原生 ESM 按需加载，只编译请求的模块，无需打包',
      'Vite 用 Go 编写',
      'Vite 不支持第三方依赖'
    ],
    answer: 1,
    analysis: 'Vite 开发期利用浏览器原生 ESM：启动时不打包，请求某模块时即时编译该模块（esbuild 预构建依赖）。Webpack 需先打包整个 bundle 才能启动。生产环境 Vite 用 Rollup 打包。'
  },
  {
    id: 'mcq-058',
    category: 'engineering',
    difficulty: '中等',
    question: '关于 Source Map，正确的是？',
    options: [
      'Source Map 是源码与构建产物的映射，用于调试和生产环境报错定位',
      'Source Map 会增加生产环境体积，必须禁用',
      'Source Map 只在开发环境有用',
      'Source Map 是一种压缩算法'
    ],
    answer: 0,
    analysis: 'Source Map 建立打包后代码与源码的映射，用于调试和线上错误还原（如 Sentry）。生产环境可用 hidden-source-map（不暴露给用户但上传到错误监控平台）兼顾调试与安全。'
  },

  // ===== 补充题目（mcq-059 ~ mcq-088）=====
  // ----- CSS -----
  {
    id: 'mcq-059',
    category: 'css',
    difficulty: '中等',
    question: '关于清除浮动，下列说法错误的是？',
    options: [
      '父元素设置 overflow: hidden 可以清除子元素浮动导致的高度坍塌',
      'display: flow-root 是现代清除浮动的方式，无副作用',
      '在父元素末尾用 ::after 伪元素设置 clear: both 可清除浮动',
      '子元素设置 clear: both 可以清除自身的浮动'
    ],
    answer: 3,
    analysis: 'clear 是用来清除**自身**受到的浮动影响（让自己不被浮动元素挤开），不能清除自身的浮动。清除浮动是解决父元素高度坍塌，针对的是包含浮动子元素的父容器。A/B/C 都是给父元素清除浮动的正确做法。'
  },
  {
    id: 'mcq-060',
    category: 'css',
    difficulty: '中等',
    question: '关于 display:none、visibility:hidden、opacity:0 的区别，正确的是？',
    options: [
      '三者都会让元素脱离文档流不再占位',
      'opacity:0 的元素仍占据空间且仍能响应点击事件',
      'visibility:hidden 的元素不占位且不响应事件',
      'display:none 的元素会触发重绘但不触发重排'
    ],
    answer: 1,
    analysis: 'opacity:0 元素仍占位、仍响应事件，只引发合成，常用于淡入淡出。visibility:hidden 占位但不响应事件，子元素可设 visible 单独显示。display:none 不占位、不响应事件，会引发重排。三者中只有 opacity:0 占位且响应事件。'
  },
  {
    id: 'mcq-061',
    category: 'css',
    difficulty: '中等',
    question: '下列关于伪类和伪元素的说法，错误的是？',
    options: [
      '伪类用单冒号（如 :hover）选择元素的某种状态',
      '伪元素用双冒号（如 ::before）创建虚拟元素',
      '伪元素必须设置 content 属性才会渲染',
      '伪类和伪元素都能创建文档树中不存在的新元素'
    ],
    answer: 3,
    analysis: '只有伪元素创建新虚拟元素，伪类只是匹配已有元素的状态，不创建新元素。A/B/C 均正确。CSS3 起伪元素推荐双冒号以与伪类区分。'
  },
  {
    id: 'mcq-062',
    category: 'css',
    difficulty: '中等',
    question: '关于 CSS position 属性，下列说法错误的是？',
    options: [
      'position: sticky 必须指定 top/right/bottom/left 之一才生效',
      'position: fixed 相对于最近的已定位祖先元素定位',
      'position: absolute 相对于最近的已定位（非 static）祖先元素定位',
      'position: relative 相对自身原来位置偏移，仍占据原空间'
    ],
    answer: 1,
    analysis: 'position: fixed 默认相对于**视口**定位（除非祖先有 transform/filter/will-change 等创建包含块）。相对最近已定位祖先定位的是 absolute，不是 fixed。sticky 需指定阈值，relative 占据原空间，均正确。'
  },
  {
    id: 'mcq-063',
    category: 'css',
    difficulty: '中等',
    question: '关于 CSS 自定义属性（变量），下列说法错误的是？',
    options: [
      'CSS 变量声明在 :root 上可全局使用，且可被继承',
      'CSS 变量可在运行时通过 JS 修改：element.style.setProperty("--x", "10px")',
      'CSS 变量遵循层叠规则，可被媒体查询覆盖以实现响应式',
      'CSS 变量可用于任何 CSS 属性，包括属性名本身'
    ],
    answer: 3,
    analysis: 'CSS 变量可作为**属性值**使用，但不能作为属性名。如 `padding: var(--gap)` 可以，但 `var(--prop): 10px` 非法。A/B/C 均正确：CSS 变量可继承、可被 JS 动态修改、可被层叠和媒体查询覆盖。'
  },
  {
    id: 'mcq-064',
    category: 'css',
    difficulty: '困难',
    question: '关于层叠上下文（stacking context）和 z-index，下列说法正确的是？',
    options: [
      'z-index 值越大的元素一定显示在 z-index 值小的元素之上，无论层级关系',
      'position: static 的元素设置 z-index 也能创建层叠上下文',
      '子元素的 z-index 只在父元素的层叠上下文内生效，无法超越父级层叠上下文',
      'opacity: 1 的元素一定会创建新的层叠上下文'
    ],
    answer: 2,
    analysis: '层叠上下文是"层叠环境"，子元素的 z-index 只在父级层叠上下文内比较，无法超越父级。即使子元素 z-index 极大，若父级层叠上下文整体在另一元素之下，子元素仍被遮挡。A 错（受层叠上下文限制）；B 错（static 不创建层叠上下文，z-index 对 static 无效）；D 错（opacity 小于 1 才创建层叠上下文，等于 1 不创建）。'
  },

  // ----- HTML -----
  {
    id: 'mcq-065',
    category: 'html',
    difficulty: '中等',
    question: '关于 iframe 的 sandbox 属性，下列说法正确的是？',
    options: [
      '设置 sandbox 后默认允许脚本、表单、同源访问等所有能力',
      'sandbox="" 会禁用所有能力，需按需开放如 sandbox="allow-scripts"',
      'sandbox 只能防止点击劫持，不能限制脚本执行',
      'iframe 默认就有 sandbox 行为，无需显式设置'
    ],
    answer: 1,
    analysis: 'sandbox="" 默认禁用脚本、表单、弹窗、同源访问、顶层导航等所有能力，需按需开放（如 allow-scripts、allow-same-origin、allow-forms）。这是隔离不可信内容的安全机制。iframe 默认不开启 sandbox。'
  },
  {
    id: 'mcq-066',
    category: 'html',
    difficulty: '中等',
    question: '关于 meta viewport，下列说法错误的是？',
    options: [
      'width=device-width 让视口宽度等于设备宽度',
      'initial-scale=1 设置初始缩放比例为 1',
      'user-scalable=no 禁止用户手动缩放，符合可访问性最佳实践',
      '不写 viewport 时移动端默认视口宽度通常为 980px'
    ],
    answer: 2,
    analysis: 'user-scalable=no 或 maximum-scale=1 会损害可访问性，WCAG 建议允许用户放大页面，应谨慎使用。A/B/D 均正确。移动端不设 viewport 会导致桌面版页面被压缩显示。'
  },
  {
    id: 'mcq-067',
    category: 'html',
    difficulty: '中等',
    question: '关于 Web Components，下列说法错误的是？',
    options: [
      'Custom Elements 允许开发者定义自定义 HTML 标签',
      'Shadow DOM 提供样式和 DOM 的隔离，避免外部样式污染',
      'HTML Templates 的 <template> 内容在页面加载时立即渲染',
      '自定义元素的标签名必须包含连字符（如 my-button）'
    ],
    answer: 2,
    analysis: '<template> 的内容是**惰性**的，不会在页面加载时渲染，需通过 JS 克隆并插入 DOM 才会显示。这是它作为"模板"的核心特性。A/B/D 均正确：Custom Elements 定义自定义标签、Shadow DOM 隔离样式、自定义元素名必须含连字符以避免与原生标签冲突。'
  },
  {
    id: 'mcq-068',
    category: 'html',
    difficulty: '中等',
    question: '关于响应式图片，下列做法正确的是？',
    options: [
      '用 <img srcset> 可根据设备像素比（DPR）加载不同分辨率图片',
      '用 <picture> 的 <source> 无法针对不同视口宽度切换图片',
      'loading="lazy" 只能用于 <picture>，不能用于 <img>',
      'decoding="async" 会让图片不加载'
    ],
    answer: 0,
    analysis: '<img srcset="a.jpg 1x, b.jpg 2x"> 可根据 DPR 选择合适图片；<picture> + <source media="..."> 可针对视口宽度切换图片（艺术指导）；loading="lazy" 可用于 <img> 实现懒加载；decoding="async" 只是异步解码，不影响加载。'
  },

  // ----- TypeScript -----
  {
    id: 'mcq-069',
    category: 'typescript',
    difficulty: '中等',
    question: '关于 TS 工具类型，下列说法错误的是？',
    options: [
      'Partial<T> 把 T 的所有属性变为可选',
      'Pick<T, K> 从 T 中挑选属性 K 组成新类型',
      'Omit<T, K> 从 T 中剔除属性 K，等价于 Pick<T, Exclude<keyof T, K>>',
      'Record<K, V> 把 T 类型的所有属性值类型替换为 V'
    ],
    answer: 3,
    analysis: 'Record<K, V> 是**构造**一个键为 K、值为 V 的新对象类型，不是"替换 T 的属性"。它不接收现有类型 T，而是从键 K 和值 V 创建。如 Record<string, User> = { [k: string]: User }。A/B/C 均正确。'
  },
  {
    id: 'mcq-070',
    category: 'typescript',
    difficulty: '中等',
    question: '下列哪个不是 TS 的类型守卫（Narrowing）方式？',
    options: [
      'typeof x === "string"',
      'x instanceof Date',
      '"swim" in x',
      'typeof x === "string" as string'
    ],
    answer: 3,
    analysis: 'typeof、instanceof、in 都是类型守卫，能在分支中缩窄类型。"as string" 是类型断言（assertion），不是类型守卫——它只是告诉编译器"按 string 处理"，不做任何检查，也不缩窄类型。断言可能撒谎，守卫真实检查。'
  },
  {
    id: 'mcq-071',
    category: 'typescript',
    difficulty: '困难',
    question: '关于条件类型与 infer，下列等价关系正确的是？',
    options: [
      'ReturnType<F> = F extends () => any ? F : never',
      'ReturnType<F> = F extends (...args: any[]) => infer R ? R : never',
      'ReturnType<F> = F extends infer R ? R : never',
      'ReturnType<F> = F extends any ? infer R : never'
    ],
    answer: 1,
    analysis: 'ReturnType 用 infer 在函数签名的返回值位置"捕获"类型：`F extends (...args: any[]) => infer R ? R : never`。infer R 声明一个待推断的类型变量 R，当 F 匹配该函数模式时，R 被推断为返回值类型。其他选项语法错误或语义不对。'
  },
  {
    id: 'mcq-072',
    category: 'typescript',
    difficulty: '中等',
    question: '关于 TS 的 never 类型，下列说法错误的是？',
    options: [
      'never 是所有类型的子类型，可赋值给任何类型',
      '抛出异常或无限循环的函数返回值类型可声明为 never',
      'never 可用于联合类型的穷尽检查（exhaustiveness check）',
      'never 类型可以接受任意值赋值（如 const x: never = 42）'
    ],
    answer: 3,
    analysis: 'never 表示"永不存在的值"，**没有任何值能赋给 never**（除了 never 本身）。`const x: never = 42` 会报错。反过来 never 可赋给任何类型（never 是底类型）。A/B/C 正确：never 是底类型、永不返回的函数用 never、穷尽检查时未处理的分支会是具体类型无法赋给 never 从而报错。'
  },

  // ----- JavaScript -----
  {
    id: 'mcq-073',
    category: 'javascript',
    difficulty: '中等',
    question: '关于 ES Modules 和 CommonJS，下列说法错误的是？',
    options: [
      'ESM 是静态的，import 在编译期确定依赖，支持 Tree Shaking',
      'CommonJS 的 require 是动态的，可在任意位置调用',
      'ESM 的 import 是异步加载，CommonJS 的 require 是同步加载',
      'ESM 导出的是值的引用，CommonJS 导出的是值的拷贝'
    ],
    answer: 2,
    analysis: 'ESM 的 import 看起来"异步"是因为模块加载过程异步，但 import 本身是**静态提升**的（编译期确定），不能在条件块里。说"import 是异步加载"不准确——它是静态声明。A/B/D 正确：ESM 静态可 Tree Shake、CommonJS 动态 require、ESM 引用而 CommonJS 拷贝。'
  },
  {
    id: 'mcq-074',
    category: 'javascript',
    difficulty: '中等',
    question: '以下 async/await 代码的输出是？\nasync function f() {\n  console.log(1)\n  await Promise.resolve()\n  console.log(2)\n}\nf()\nconsole.log(3)',
    options: ['1 2 3', '1 3 2', '3 1 2', '3 2 1'],
    answer: 1,
    analysis: 'f() 同步执行到 await 前，输出 1；遇到 await 暂停返回控制权；主线程继续输出 3；await 后的代码（输出 2）作为微任务在当前同步代码结束后执行。所以顺序是 1 3 2。await 之后的代码相当于放在 .then 里。'
  },
  {
    id: 'mcq-075',
    category: 'javascript',
    difficulty: '中等',
    question: '关于原型链，下列说法错误的是？',
    options: [
      '每个对象都有 __proto__ 指向其构造函数的 prototype',
      'Object.prototype.__proto__ === null，是原型链的终点',
      '实例的 constructor 属性始终指向其构造函数本身',
      '修改构造函数的 prototype 会影响已创建和新创建的实例'
    ],
    answer: 2,
    analysis: 'constructor 是 prototype 对象上的属性，实例通过原型链找到它，**通常**指向构造函数，但可被重写或覆盖，并非"始终指向构造函数本身"。如 `Person.prototype = {}` 后 constructor 会丢失或指向 Object。A/B/D 正确：__proto__ 指向构造函数的 prototype、Object.prototype.__proto__ 为 null、prototype 修改影响共享它的所有实例。'
  },

  // ----- React -----
  {
    id: 'mcq-076',
    category: 'react',
    difficulty: '中等',
    question: '关于 useReducer 和 useState，下列说法错误的是？',
    options: [
      'useReducer 适合管理多个相互关联的状态或复杂状态逻辑',
      'useState 是 useReducer 的简化版，内部就是基于 useReducer 实现',
      'useReducer 的 reducer 必须是纯函数，不能有副作用',
      'useReducer 总是比 useState 性能更好，应优先使用'
    ],
    answer: 3,
    analysis: 'useReducer 并非总是性能更好，对于简单状态 useState 更简洁直观。两者性能相当。useReducer 适合复杂状态、状态间依赖、或下一个状态依赖前一个时。A/B/C 正确：useReducer 适合关联状态、useState 内部确实基于 useReducer、reducer 应为纯函数。'
  },
  {
    id: 'mcq-077',
    category: 'react',
    difficulty: '中等',
    question: '关于 React Context，下列说法正确的是？',
    options: [
      'Context 值变化时，所有使用该 Context 的组件都会重新渲染',
      'Context 完全可以替代所有状态管理库（如 Redux）',
      'Context 的 Provider value 变化不会触发消费者重新渲染',
      'useContext 性能优于手动 props 传递，无性能问题'
    ],
    answer: 0,
    analysis: 'Context 值变化时，所有消费该 Context 的组件会重新渲染，即使它们只用了 value 的一部分——这是 Context 的性能陷阱。B 错（复杂场景 Redux 仍有优势如中间件、时间旅行）；C 错（Provider value 变化会触发消费者渲染）；D 错（Context 有性能问题，需拆分 Context 或用 useMemo 优化）。'
  },
  {
    id: 'mcq-078',
    category: 'react',
    difficulty: '中等',
    question: '关于 React 的 Suspense 和 React.lazy，下列说法错误的是？',
    options: [
      'React.lazy 用于组件的代码分割（懒加载）',
      'Suspense 的 fallback 在子组件"挂起"时显示',
      'React.lazy 加载的组件必须被 Suspense 包裹才能使用',
      'Suspense 只能用于 React.lazy，不能用于数据获取'
    ],
    answer: 3,
    analysis: 'Suspense 不仅能用于 React.lazy 的代码分割，还可用于**数据获取**（配合支持 Suspense 的数据库/框架如 Relay、React Query v5、Next.js）和流式 SSR。React 18 起 Suspense for Data Fetching 是核心特性。A/B/C 正确。'
  },

  // ----- Vue -----
  {
    id: 'mcq-079',
    category: 'vue',
    difficulty: '中等',
    question: '关于 Vue 的 v-model，下列说法错误的是？',
    options: [
      'v-model 本质是 :value 绑定 + @input 事件监听的语法糖',
      'Vue3 中组件上使用 v-model 默认绑定 modelValue 并监听 update:modelValue',
      'Vue3 支持多个 v-model，如 v-model:firstName 和 v-model:lastName',
      'v-model 的 .lazy 修饰符让数据在 input 时同步更新'
    ],
    answer: 3,
    analysis: '.lazy 修饰符把同步时机从 input 事件改为 **change 事件**（即失去焦点或回车时才同步），不是 input 时同步。A/B/C 正确：v-model 是 value+input 语法糖、Vue3 默认 modelValue、支持多 v-model。'
  },
  {
    id: 'mcq-080',
    category: 'vue',
    difficulty: '中等',
    question: '关于 Vue 的 provide/inject，下列说法错误的是？',
    options: [
      'provide/inject 用于跨层级组件通信，无需层层传递 props',
      'Vue3 中 provide 推荐传入响应式数据（如 ref/reactive）以保持响应性',
      'inject 的数据默认就是响应式的，即使 provide 传的是普通值',
      '可用 Symbol 作为 provide 的 key 避免命名冲突'
    ],
    answer: 2,
    analysis: 'provide 传**普通值**时，inject 接收的也非响应式；只有 provide 传 ref/reactive 等**响应式数据**，inject 才能享受响应性。响应性不是自动的，取决于 provide 的内容。A/B/D 正确：跨层级通信、推荐传响应式数据、用 Symbol 作 key。'
  },
  {
    id: 'mcq-081',
    category: 'vue',
    difficulty: '中等',
    question: '关于 Vue 的 KeepAlive，下列说法错误的是？',
    options: [
      'KeepAlive 缓存不活动的组件实例，避免重复渲染',
      '被缓存的组件切换时会触发 onActivated 和 onDeactivated 钩子',
      'include/exclude 可按组件名或正则控制缓存范围',
      'KeepAlive 会缓存所有传入的子组件，无法限制最大缓存数量'
    ],
    answer: 3,
    analysis: 'KeepAlive 支持 **max** 属性限制最大缓存数量，超过时按 LRU（最近最少使用）策略淘汰最久未访问的缓存。A/B/C 正确：缓存实例、触发 activated/deactivated 钩子、用 include/exclude 控制范围。'
  },

  // ----- 性能优化 -----
  {
    id: 'mcq-082',
    category: 'performance',
    difficulty: '中等',
    question: '下列哪种做法不能有效减少重排（reflow）？',
    options: [
      '批量修改 DOM 时先用 display:none 隐藏，修改完再显示',
      '使用 DocumentFragment 一次性插入多个节点',
      '频繁读写交替访问 offsetWidth 等几何属性',
      '用 transform 代替 top/left 做动画'
    ],
    answer: 2,
    analysis: '频繁读写交替访问 offsetWidth/offsetTop 等会强制**同步布局**（layout thrashing）：每次写后读都强制浏览器立即重排以返回准确值，性能极差。应先集中读再集中写。A/B/D 都是减少重排的正确做法：隐藏后批量改、Fragment 一次性插入、transform 只触发合成不重排。'
  },
  {
    id: 'mcq-083',
    category: 'performance',
    difficulty: '中等',
    question: '关于防抖（debounce）和节流（throttle），下列说法正确的是？',
    options: [
      '防抖是在固定时间间隔内只执行第一次，节流是只执行最后一次',
      '防抖是延迟执行，事件停止触发一段时间后才执行；节流是固定频率执行',
      '搜索框输入联想应用节流，滚动加载应用防抖',
      '防抖和节流效果完全相同，只是名字不同'
    ],
    answer: 1,
    analysis: '防抖：事件停止触发 N 秒后才执行（延迟），期间再次触发则重新计时，适合"只关心最后一次"（搜索联想、resize）。节流：固定时间间隔最多执行一次，适合"持续触发但降低频率"（滚动加载、鼠标移动）。A 描述反了；C 应互换（搜索用防抖、滚动用节流）；D 错。'
  },
  {
    id: 'mcq-084',
    category: 'performance',
    difficulty: '中等',
    question: '下列哪种情况最可能导致前端内存泄漏？',
    options: [
      '在组件卸载时清理了事件监听器和定时器',
      '使用 let/const 替代 var 声明变量',
      '从全局变量引用了已卸载组件的 DOM 节点且未释放',
      '使用箭头函数作为事件回调'
    ],
    answer: 2,
    analysis: '全局变量引用 DOM 节点会阻止垃圾回收，即使组件卸载 DOM 节点仍被引用无法释放，是典型的内存泄漏。常见场景：全局 Map/数组缓存 DOM、闭包持有 DOM 引用、未清理的事件监听器持有 DOM。A 是正确的防泄漏做法；B/D 与内存泄漏无关。'
  },

  // ----- 工程化 -----
  {
    id: 'mcq-085',
    category: 'engineering',
    difficulty: '中等',
    question: '关于 Monorepo（单仓库多项目），下列说法错误的是？',
    options: [
      'Monorepo 把多个相关项目放在一个 Git 仓库中管理',
      'pnpm、Turborepo、Nx 是常见的 Monorepo 管理工具',
      'Monorepo 适合所有项目，无论规模和团队都应采用',
      'Monorepo 便于共享代码、统一配置和依赖版本管理'
    ],
    answer: 2,
    analysis: 'Monorepo 并非适合所有项目。它增加仓库体积、构建复杂度、权限管理难度，对小项目或独立团队可能过重。是否采用取决于项目规模、团队协作模式和工程基建能力。A/B/D 正确：单仓库多项目、有专门工具、便于共享和统一管理。'
  },
  {
    id: 'mcq-086',
    category: 'engineering',
    difficulty: '简单',
    question: '关于 ESLint 和 Prettier，下列说法正确的是？',
    options: [
      'ESLint 主要负责代码格式化，Prettier 负责代码质量检查',
      'Prettier 主要负责代码格式化，ESLint 负责代码质量和逻辑问题检查',
      'ESLint 和 Prettier 功能完全重叠，只需用一个',
      'Prettier 能检测未使用变量、隐式全局变量等代码质量问题'
    ],
    answer: 1,
    analysis: 'Prettier 是**代码格式化工具**（缩进、引号、换行），关心"长什么样"；ESLint 是**代码质量检查工具**（未使用变量、隐式全局、最佳实践），关心"对不对"。两者分工不同，常配合使用（用 eslint-config-prettier 关闭 ESLint 中与 Prettier 冲突的格式规则）。A 描述反了；C/D 错。'
  },

  // ----- 浏览器原理 -----
  {
    id: 'mcq-087',
    category: 'browser',
    difficulty: '中等',
    question: '关于浏览器事件循环，下列执行顺序正确的是？\nsetTimeout(() => console.log(1))\nPromise.resolve().then(() => console.log(2))\nqueueMicrotask(() => console.log(3))\nconsole.log(4)',
    options: ['4 1 2 3', '4 2 3 1', '4 3 2 1', '1 2 3 4'],
    answer: 1,
    analysis: '同步代码先执行输出 4。然后清空微任务队列：Promise.then 和 queueMicrotask 都是微任务，按入队顺序执行，输出 2、3。最后执行宏任务 setTimeout 输出 1。整体顺序 4 2 3 1。微任务优先级高于宏任务，且每轮宏任务前会清空所有微任务。'
  },

  // ----- 计算机网络 -----
  {
    id: 'mcq-088',
    category: 'network',
    difficulty: '中等',
    question: '关于 HTTP/2 相比 HTTP/1.1 的改进，下列说法错误的是？',
    options: [
      'HTTP/2 支持多路复用，一个 TCP 连接可并行多个请求',
      'HTTP/2 使用二进制分帧，比 HTTP/1.1 的文本协议更高效',
      'HTTP/2 支持 Server Push，服务器可主动推送资源',
      'HTTP/2 彻底解决了队头阻塞问题，包括 TCP 层的队头阻塞'
    ],
    answer: 3,
    analysis: 'HTTP/2 解决了**应用层**的队头阻塞（多路复用让请求并行），但**未解决 TCP 层**的队头阻塞——单个 TCP 包丢失会阻塞整个连接的所有流。这正是 HTTP/3 改用 QUIC（基于 UDP）的原因。A/B/C 正确：多路复用、二进制分帧、Server Push 都是 HTTP/2 的改进。'
  },

  // ===== 新增题目（mcq-089 ~ mcq-120）=====
  // ===== JavaScript 4 道（mcq-089~092）=====
  {
    id: 'mcq-089',
    category: 'javascript',
    difficulty: '中等',
    question: '关于 ES2021 新增的 WeakRef 和 FinalizationRegistry，下列说法正确的是？',
    options: [
      'WeakRef 允许创建对对象的强引用，防止对象被 GC',
      'WeakRef.deref() 总是返回原对象',
      'FinalizationRegistry 可以在对象被 GC 后执行回调，用于资源清理',
      'WeakRef 和普通引用一样，会阻止垃圾回收'
    ],
    answer: 2,
    analysis: 'WeakRef 是对对象的**弱引用**，不阻止 GC（A/D 错）；deref() 在对象被回收后返回 undefined（B 错）。FinalizationRegistry 注册清理回调，当被注册的对象被 GC 后触发，适合释放与对象关联的外部资源（如 WebAssembly 内存、native 资源）。两者都是高级特性，日常开发慎用。'
  },
  {
    id: 'mcq-090',
    category: 'javascript',
    difficulty: '中等',
    question: '关于 JavaScript BigInt，下列说法错误的是？',
    options: [
      'BigInt 可以表示超过 Number.MAX_SAFE_INTEGER 的整数',
      'BigInt 字面量在数字末尾加 n，如 9007199254740993n',
      'BigInt 和 Number 可以直接混合运算，结果自动提升',
      'typeof 1n === "bigint"'
    ],
    answer: 2,
    analysis: 'BigInt 不能与 Number 直接混合运算，会抛 TypeError：不能混合 BigInt 和其他类型。需要先显式转换：BigInt(num) 或 Number(bigint)（转换可能丢精度）。A 正确：BigInt 支持任意精度整数；B 正确：字面量后缀 n；D 正确：typeof 返回 "bigint"。'
  },
  {
    id: 'mcq-091',
    category: 'javascript',
    difficulty: '中等',
    question: '关于 structuredClone() 结构化克隆，下列说法错误的是？',
    options: [
      '可以克隆 RegExp、Error、Function、DOM 节点等所有类型',
      '可以处理循环引用，而 JSON.parse(JSON.stringify) 不能',
      '支持克隆 Map、Set、Date、ArrayBuffer 等多种内置类型',
      '是浏览器和 Node.js 的原生 API，比手写深拷贝更可靠'
    ],
    answer: 0,
    analysis: 'structuredClone **不能**克隆 Function、Error、RegExp 的 lastIndex 等属性、DOM 节点、Symbol、属性描述符/原型链。这些类型会抛异常或被忽略（如 prototype 不保留）。B 正确：能处理循环引用；C 正确：支持 Map/Set/Date/ArrayBuffer 等；D 正确：原生 API 覆盖大多数场景。'
  },
  {
    id: 'mcq-092',
    category: 'javascript',
    difficulty: '困难',
    question: '关于迭代器（Iterator）和生成器（Generator），以下代码输出什么？\nfunction* gen() {\n  const a = yield 1;\n  console.log("a:", a);\n  const b = yield 2;\n  console.log("b:", b);\n}\nconst g = gen();\nconsole.log(g.next("x").value);\nconsole.log(g.next("y").value);\nconsole.log(g.next("z").value);',
    options: ['1, a:x, 2, b:y, undefined', '1, a:y, 2, b:z, undefined', '1, a:undefined, 2, b:undefined, undefined', 'undefined, a:y, 2, b:z, 1'],
    answer: 1,
    analysis: 'next("x")：首次调用时，传入的参数被忽略（因为还没有 yield 表达式接收），执行到第一个 yield 返回 1。next("y")：恢复执行，"y" 作为第一个 yield 表达式的返回值赋给 a，打印 a:y，执行到第二个 yield 返回 2。next("z")：恢复执行，"z" 赋给 b，打印 b:z，函数结束返回 { value: undefined, done: true }。所以输出顺序是 1、a:y、2、b:z、undefined。'
  },

  // ===== CSS 4 道（mcq-093~096）=====
  {
    id: 'mcq-093',
    category: 'css',
    difficulty: '中等',
    question: '关于 CSS :has() 伪类选择器，下列说法错误的是？',
    options: [
      ':has() 被称为"父选择器"，可以根据后代元素选中祖先元素',
      ':has(.a, .b) 表示同时含有 .a 和 .b 两个后代时才匹配',
      'article:has(> img) 可以选中直接子元素是 img 的 article',
      ':has() 可以与其他选择器组合使用，如 button:has(.icon:hover)'
    ],
    answer: 1,
    analysis: ':has(.a, .b) 中的逗号是**或**的关系（符合 Selectors Level 4 规范），表示含有 .a **或**含有 .b 即匹配。要求同时含有的写法是 :has(.a):has(.b)。A 正确：实现了父选择能力；C 正确：支持子组合器 >；D 正确：可组合多种选择器包括 hover 等伪类。'
  },
  {
    id: 'mcq-094',
    category: 'css',
    difficulty: '中等',
    question: '关于 CSS 滚动捕捉（Scroll Snap），下列说法错误的是？',
    options: [
      'scroll-snap-type: x mandatory 表示横向滚动，强制捕捉到捕捉点',
      'scroll-snap-align: start 表示元素的起始位置与容器捕捉位置对齐',
      '子元素必须设置 scroll-snap-stop: always 才能在快速滑动时停住每个捕捉点',
      'scroll-snap-type 只能设置在根元素（html/body）上'
    ],
    answer: 3,
    analysis: 'scroll-snap-type 可设置在**任意滚动容器**上（如 overflow: auto 的 div），不只是根元素。A 正确：mandatory 强制捕捉、proximity 接近时捕捉；B 正确：align 取值 start/center/end；C 正确：scroll-snap-stop: always 强制每个捕捉点都停，否则快速滑动可能越过多个点。'
  },
  {
    id: 'mcq-095',
    category: 'css',
    difficulty: '困难',
    question: '下列哪种情况**不会**创建新的层叠上下文（Stacking Context）？',
    options: [
      '元素设置 position: relative 且 z-index: 1',
      '元素设置 opacity: 0.5',
      '元素设置 transform: scale(1)',
      '元素设置 z-index: 999，但 position 为 static'
    ],
    answer: 3,
    analysis: 'z-index 只对 position 非 static 的元素生效，且只有在 z-index 为数值（非 auto）时才创建层叠上下文。position: static + z-index: 999 **不创建**层叠上下文，z-index 被忽略。A 创建（非 static + 数值 z-index）；B 创建（opacity < 1）；C 创建（transform 非 none）。'
  },
  {
    id: 'mcq-096',
    category: 'css',
    difficulty: '中等',
    question: '关于 CSS 容器查询（Container Queries），下列说法正确的是？',
    options: [
      '容器查询的语法与媒体查询完全相同，都是 @media',
      '使用 @container 前需要先在祖先元素上用 container-type 声明该元素为查询容器',
      '容器查询仍然是针对视口宽度的查询，只是写法不同',
      '容器查询中无法使用容器的高度或方向作为查询条件'
    ],
    answer: 1,
    analysis: '容器查询分两步：先给祖先设 container-type: inline-size（或 size）声明为查询容器；再用 @container (min-width: 400px) { ... } 根据**该容器的尺寸**（而非视口）响应式。A 错：用 @container 不是 @media；C 错：针对的是容器尺寸非视口；D 错：支持 height、aspect-ratio、orientation 等多种条件。'
  },

  // ===== HTML 3 道（mcq-097~099）=====
  {
    id: 'mcq-097',
    category: 'html',
    difficulty: '困难',
    question: '关于 Web Components 的 Shadow DOM，下列说法错误的是？',
    options: [
      'Shadow DOM 的样式默认与外部文档隔离，外部 CSS 不会影响内部',
      '可以通过 ::part() 伪元素让外部样式有选择地穿透到 Shadow DOM',
      'Shadow DOM 内部的元素的事件不会冒泡到外部文档',
      'attachShadow({ mode: "closed" }) 会让外部 JS 无法通过 shadowRoot 属性访问 Shadow DOM'
    ],
    answer: 2,
    analysis: 'Shadow DOM 中的事件（如 click、input）默认**会冒泡到外部文档**，但 event.target 会被重定向（retarget）为宿主元素（Shadow DOM 内具体 target 对外部不可见，显露出 host）。可以用 stopPropagation 阻止。A 正确：样式隔离；B 正确：exportparts + ::part 允许样式穿透；D 正确：closed 模式外部 JS 无法拿到 shadowRoot 引用。'
  },
  {
    id: 'mcq-098',
    category: 'html',
    difficulty: '困难',
    question: '关于 CSP（内容安全策略）和 SRI（子资源完整性），下列说法错误的是？',
    options: [
      'CSP 的 Content-Security-Policy: script-src "self" 会禁止执行内联脚本和 eval',
      "SRI 通过 <script integrity='sha256-xxx'> 验证资源内容哈希，被篡改则拒绝执行",
      "CSP 的 'unsafe-inline' 会同时允许内联脚本和 eval()",
      '当使用 CSP require-sri-for script; 时，所有外部脚本必须带 SRI 属性，否则不加载'
    ],
    answer: 2,
    analysis: "'unsafe-inline' 只允许内联脚本/样式。允许 eval() 需要单独的 'unsafe-eval' 指令——两者是独立的。A 正确：script-src 'self' 默认不允许 inline 和 eval；B 正确：SRI 用哈希校验 CDN 资源完整性，防篡改；D 正确：require-sri-for 强制要求 script/style 带 SRI 属性。"
  },
  {
    id: 'mcq-099',
    category: 'html',
    difficulty: '中等',
    question: '关于 HTML 的 fetchpriority 属性，下列说法正确的是？',
    options: [
      'fetchpriority 只能用于 <img>，不能用于 <link>、<script>',
      'fetchpriority="high" 保证该资源会比其他任何资源先下载完成',
      'fetchpriority 仅作为浏览器的"提示"，不强制，但可以帮助浏览器优化资源下载顺序',
      'fetchpriority="low" 会阻止该资源下载，直到页面完全加载'
    ],
    answer: 2,
    analysis: 'fetchpriority 是一个**提示（hint）**，不是强制指令，用于给浏览器传递资源优先级信号。支持的元素包括 img、link(rel=preload/stylesheet)、script、iframe。A 错：可用于多种元素；B 错：不保证先完成，只是提升优先级；D 错：low 只是降低优先级，不会阻止下载或延迟到页面加载完。'
  },

  // ===== TypeScript 3 道（mcq-100~102）=====
  {
    id: 'mcq-100',
    category: 'typescript',
    difficulty: '困难',
    question: '关于 TS 条件类型（Conditional Types）的分配律（Distributive），下列哪个类型会得到 "a" | "b" ？\ntype Test<T> = T extends any ? [T] : never;\ntype R = Test<"a" | "b">;',
    options: [
      'R = ["a" | "b"]，因为条件类型不会分配',
      'R = ["a"] | ["b"]，条件类型默认对裸类型参数分配',
      'R = [["a"], ["b"]]，嵌套数组',
      'R = "a" | "b"，去掉了包裹'
    ],
    answer: 1,
    analysis: '条件类型在 T 是**裸类型参数**（直接出现在 extends 左侧、未被元组/数组/Promise 等包裹）时会对联合类型**分配**：Test<A|B> = Test<A>|Test<B>。所以 Test<"a"|"b"> = ["a"]|["b"]。若想阻止分配，可写 [T] extends [any]（用方括号包裹），此时 R = ["a" | "b"]。掌握分配律是进阶 TS 类型体操的关键。'
  },
  {
    id: 'mcq-101',
    category: 'typescript',
    difficulty: '困难',
    question: '关于 TS 模板字面量类型（Template Literal Types），下列类型推导结果正确的是？\ntype EventName<T extends string> = `on${Capitalize<T>}`;\ntype R = EventName<"click" | "focus">;',
    options: [
      'R = `on${Capitalize<"click" | "focus">}`，不会展开',
      'R = "onClick" | "onFocus"',
      'R = "onclick" | "onfocus"（首字母未大写）',
      '编译报错：Capitalize 只能用于单个字符串，不能用于联合'
    ],
    answer: 1,
    analysis: '模板字面量类型对联合类型是**分配**的，且 Capitalize<T> 对联合类型也逐个成员作用。因此等价于 `on${Capitalize<"click">}` | `on${Capitalize<"focus">}` = "onClick" | "onFocus"。A 错：会展开；C 错：Capitalize 会把首字母大写；D 错：Capitalize 接受 string 的子类型包括联合。'
  },
  {
    id: 'mcq-102',
    category: 'typescript',
    difficulty: '中等',
    question: '关于 TypeScript 的 satisfies 操作符，下列说法错误的是？',
    options: [
      "const obj = { a: 1, b: 'x' } satisfies Record<string, string | number>; 这样写既验证类型又保留字面量推断",
      'satisfies 与 as 功能相同，都是类型断言',
      'satisfies 只做右侧类型的"匹配校验"，不会把左侧的类型收窄为右侧类型',
      'satisfies 可以避免使用 as 导致的过度断言（把不匹配的值也撒谎通过）'
    ],
    answer: 1,
    analysis: 'satisfies ≠ as。as 是**类型断言**（可能撒谎、跳过校验）；satisfies 是**类型校验**（仅验证兼容但不改变推断出的类型）。A 正确：obj 的类型仍是 { a: number; b: string }，而非宽泛的 Record；C 正确：obj.a 仍是 number 字面量推断；D 正确：satisfies 不匹配会报错，as 可能不会。'
  },

  // ===== Vue 3 道（mcq-103~105）=====
  {
    id: 'mcq-103',
    category: 'vue',
    difficulty: '中等',
    question: '关于 Vue3.4+ 的 defineModel 宏，下列说法错误的是？',
    options: [
      "defineModel() 返回一个 ref，可直接 .value 读写，无需再写 props.modelValue + emit('update:modelValue')",
      'defineModel 可以指定多个参数：defineModel<boolean>({ default: true }) 可以加默认值和类型',
      'defineModel 本质上仍然编译成声明 props 和 emits 的代码，只是语法糖',
      'defineModel 不支持自定义修饰符（如 v-model.myMod.capitalize）'
    ],
    answer: 3,
    analysis: 'defineModel **支持**自定义修饰符。第二个参数可以传 options，包含 get/set 转换器；对于修饰符，可通过解构 [model, modifiers] = defineModel<...>() 拿到 modifiers 对象（如 modifiers.capitalize），并配合 options.get/set 应用修饰逻辑。A/B/C 均正确：defineModel 是减少样板代码的重要语法糖。'
  },
  {
    id: 'mcq-104',
    category: 'vue',
    difficulty: '中等',
    question: '关于 Pinia store，下列说法正确的是？',
    options: [
      'Pinia 的 store 只能用 defineStore + Option Store 的写法，不支持 Composition API 风格',
      '在组件中使用 storeToRefs(store) 是为了解构出保持响应式的 state/getters',
      'Pinia 中直接修改 store.state 是非法的，必须通过 action 或 mutation',
      'Pinia 的 store 是单例，全应用只能实例化一次'
    ],
    answer: 1,
    analysis: '直接解构 store（const { count } = useCounterStore()）会丢失响应性，需要用 storeToRefs 包裹才保持响应式（类似 Vue 的 toRefs）。A 错：defineStore 支持 Setup Store（Composition 风格：return 出 state 和方法）；C 错：Pinia 没有 mutation，可直接修改 state 或通过 action 改；D 错：调用 useXxxStore() 得到的是单例实例，但可以在不同组件/地方多次调用（返回同一实例）。'
  },
  {
    id: 'mcq-105',
    category: 'vue',
    difficulty: '困难',
    question: '关于 Vue3 自定义渲染器（Custom Renderer / createRenderer），下列说法错误的是？',
    options: [
      'createRenderer 允许把 Vue 渲染到非 DOM 目标，如 Canvas、WebGL、终端、原生小程序',
      '自定义渲染器需要实现 createElement、patchProp、insert、remove、createText 等基础平台操作',
      '自定义渲染器中的虚拟节点（VNode）结构与 DOM 渲染器的 VNode 完全不同，需自行设计',
      '@vue/runtime-core 提供 createRenderer，而 @vue/runtime-dom 是基于它实现的 DOM 渲染器'
    ],
    answer: 2,
    analysis: '自定义渲染器复用的是 Vue **同一套 VNode / 响应式 / diff 机制**，只是把"渲染到哪一层"（即对真实宿主节点的操作）抽象成 platform API 交给开发者实现。VNode 结构完全相同（都在 runtime-core 中定义），不同的只是宿主元素类型。A 正确：这是 custom renderer 的核心用途；B 正确：必须实现平台相关的节点操作；D 正确：runtime-dom = runtime-core + DOM 平台 API 实现。'
  },

  // ===== React 3 道（mcq-106~108）=====
  {
    id: 'mcq-106',
    category: 'react',
    difficulty: '困难',
    question: '关于 React Server Components（RSC），下列说法错误的是？',
    options: [
      'Server Components 只在服务器运行，不会把组件代码发送到客户端，可减少客户端 bundle 体积',
      'Server Components 中不能使用 useState/useEffect/browser API，但可以直接访问数据库和文件系统',
      'Server Components 可以直接 import 并渲染 Client Components，Client Components 也可以直接 import 并渲染 Server Components',
      'Server Components 的渲染产物是一个特殊的序列化流（RSC Payload），不是 HTML'
    ],
    answer: 2,
    analysis: 'Server Component 可以渲染 Client Component，但 **Client Component 不能直接 import Server Component**——这是单向边界。客户端模块中无法执行服务端专属逻辑（直接 DB 访问等）。若需要把 Server Component 作为子组件传给 Client Component，应通过 props（如 children / slot）传入（父 Server 先渲染后把结果传给 Client）。A/B/D 均正确。'
  },
  {
    id: 'mcq-107',
    category: 'react',
    difficulty: '中等',
    question: '关于 React 的 useTransition Hook，下列说法正确的是？',
    options: [
      'useTransition 让状态更新变成"紧急更新"，优先于普通 setState',
      'const [isPending, startTransition] = useTransition(); startTransition(() => setCount(c+1)) 中的 setCount 被标记为非紧急，可被更紧急更新打断',
      'useTransition 会让状态更新延迟至少 500ms 再执行',
      'startTransition 回调中的代码会在 Web Worker 中运行，不阻塞主线程'
    ],
    answer: 1,
    analysis: 'useTransition 把回调里的状态更新标记为**过渡（transition）**——非紧急、可被更高优先级更新中断、期间可显示 isPending 的加载 UI。A 错：正好相反，是降低优先级；C 错：没有固定延迟，取决于调度器；D 错：仍在主线程，只是被切成可中断的片段（并发特性）。适合搜索联想、tab 切换等场景：输入框保持响应而结果延迟过渡。'
  },
  {
    id: 'mcq-108',
    category: 'react',
    difficulty: '中等',
    question: '关于 React Compiler（React Forget），下列说法错误的是？',
    options: [
      'React Compiler 是一个编译期工具，自动为组件添加缓存，避免手动写 useMemo/useCallback',
      '它通过静态分析追踪值的依赖关系，自动把计算和函数用缓存等价物包裹',
      '使用 React Compiler 后，React.memo、useMemo、useCallback 这几个 API 会被废弃并删除',
      'React Compiler 需要代码遵循纯函数的写法（遵循 React 的纯渲染规则）才能正确工作'
    ],
    answer: 2,
    analysis: 'React Compiler 是**增量式、渐进式**的优化——它在现有 API 基础上自动补充缓存，并不意味着废弃/删除 useMemo/useCallback/React.memo。旧项目可以继续手工写，新项目/重构时编译器帮你自动做。A 正确：自动缓存是核心目的；B 正确：依赖追踪 + 编译优化；D 正确：不纯的副作用/突变会影响编译器判断，需配合 React 的 lint 规则。'
  },

  // ===== 浏览器原理 3 道（mcq-109~111）=====
  {
    id: 'mcq-109',
    category: 'browser',
    difficulty: '中等',
    question: '关于 BFCache（Back/Forward Cache，往返缓存），下列说法正确的是？',
    options: [
      'BFCache 就是普通的 HTTP 缓存，存储的是响应体',
      '页面被存入 BFCache 后，JS 的定时器（setTimeout）会继续正常运行，事件监听也保持触发',
      '使用 BFCache 时，离开页面会触发 pagehide，回退返回会重新触发 pageshow（event.persisted === true），不会重新执行页面完整的加载流程',
      'BFCache 对所有站点都无条件启用，开发者无法控制或禁用'
    ],
    answer: 2,
    analysis: 'BFCache 把**整个页面内存状态（含 JS 堆）**缓存起来，回退/前进时瞬时恢复，不走 HTTP、不重跑 JS。A 错：不是 HTTP 缓存；B 错：存入 BFCache 后 JS 运行被"冻结"，定时器与任务队列暂停，恢复后继续；D 错：有多个条件可能让页面不支持 BFCache（未禁用 unload 事件、未优化的 Cache-Control、存在未完成请求等），可用 Chrome DevTools 的 Back-forward cache 测试。'
  },
  {
    id: 'mcq-110',
    category: 'browser',
    difficulty: '中等',
    question: '关于 Service Worker，下列说法错误的是？',
    options: [
      'Service Worker 是独立于网页主线程的 Worker，可以拦截和处理网络请求（做离线缓存）',
      'Service Worker 支持持久离线存储（CacheStorage + IndexedDB），可以让 PWA 离线访问',
      'Service Worker 可以直接访问 DOM 和 window 对象，与页面主线程共享内存',
      'Service Worker 生命周期包括 install → waiting → activate → fetch 等阶段，更新时需要等待旧 SW 控制的所有页面关闭'
    ],
    answer: 2,
    analysis: 'Service Worker **没有 DOM / window 访问权**，不能直接操作页面 UI；它与主线程通过 postMessage 通信。A 正确：拦截请求做缓存是核心；B 正确：PWA 的基础能力；D 正确：新版 SW 先 install 后进入 waiting，旧 SW 退出后才 activate，可使用 skipWaiting() + clients.claim() 立即生效。'
  },
  {
    id: 'mcq-111',
    category: 'browser',
    difficulty: '困难',
    question: '关于 COOP（Cross-Origin Opener Policy）和 COEP（Cross-Origin Embedder Policy），下列说法错误的是？',
    options: [
      'COOP: same-origin 会让跨域打开的弹出窗口处于独立的浏览上下文组，无法互相访问 window.opener',
      'COEP: require-corp 强制页面加载的跨域资源必须显式声明 CORP: cross-origin 或 CORS 头才能嵌入',
      'COOP + COEP 搭配使用可以启用浏览器的更强安全特性，如 SharedArrayBuffer',
      '设置 COOP/COEP 之后，页面仍可无改动地嵌入任意第三方 iframe 和图片，没有任何兼容风险'
    ],
    answer: 3,
    analysis: 'COEP: require-corp 会**阻止**嵌入没有 CORP/CORS 头的跨域资源（第三方 iframe、img、script 等都会报错被拦截），因此启用前需要与资源提供方协作并充分测试。A 正确：COOP 隔离弹窗，防止跨站窗口攻击；B 正确：COEP 强制嵌入资源声明可被嵌入；C 正确：两者配合即"跨域隔离"（crossOriginIsolated=true），解锁 SharedArrayBuffer、高分辨率计时器等高风险 API。'
  },

  // ===== 计算机网络 3 道（mcq-112~114）=====
  {
    id: 'mcq-112',
    category: 'network',
    difficulty: '困难',
    question: '关于 HTTP/3 与 QUIC，下列说法错误的是？',
    options: [
      'QUIC 基于 UDP，在用户态实现了可靠传输、拥塞控制、加密、多路复用，避免 TCP 层队头阻塞',
      'QUIC 的连接建立集成了 TLS 握手，0-RTT / 1-RTT 即可完成建立 + 加密，比 TCP + TLS 的 2/3-RTT 更快',
      'QUIC 连接由 Connection ID 标识，在客户端网络切换（Wi-Fi 切 5G）时可以保持连接不中断',
      'HTTP/3 仍然沿用 HTTP/2 的二进制分帧和多路复用，所以依然存在 TCP 层队头阻塞'
    ],
    answer: 3,
    analysis: 'HTTP/3 基于 QUIC（UDP），**不再依赖 TCP**，因此没有 TCP 层的队头阻塞。单个流丢包只影响该流，其他流可以继续传输，这正是 QUIC 相对 HTTP/2 的最大收益。A 正确：QUIC 在 UDP 上实现可靠传输；B 正确：0-RTT 握手优势；C 正确：Connection ID 支持连接迁移（mobile roaming）。'
  },
  {
    id: 'mcq-113',
    category: 'network',
    difficulty: '困难',
    question: '关于 TLS 1.3 相比 TLS 1.2 的改进，下列说法错误的是？',
    options: [
      'TLS 1.3 支持 0-RTT 握手，客户端在第一个包就可以携带应用数据（需会话票据/PSK）',
      'TLS 1.3 删除了大量弱加密和不安全的算法（如 RC4、SHA-1、RSA 密钥交换等），强制前向保密',
      'TLS 1.3 完整握手只需 1-RTT（TLS 1.2 完整握手需要 2-RTT）',
      'TLS 1.3 的握手报文全部以明文传输，为了便于调试和中间人分析'
    ],
    answer: 3,
    analysis: 'TLS 1.3 反而**把握手更多地加密**：ServerHello 之后的所有握手消息（包括 Certificate）都在 handshake_traffic_secret 保护下加密，减少信息泄露。A 正确：0-RTT（Early Data）是 TLS1.3 亮点（虽有重放风险）；B 正确：算法白名单化，必须 PFS（ECDHE）；C 正确：1-RTT vs 2-RTT。'
  },
  {
    id: 'mcq-114',
    category: 'network',
    difficulty: '中等',
    question: '关于 OAuth 2.0 的授权码模式（Authorization Code Grant）流程，下列步骤顺序正确的是？',
    options: [
      '①用户授权 → ②客户端跳转授权服务器 → ③授权服务器返回授权码到回调 → ④客户端用授权码换 access_token → ⑤客户端携带 token 访问资源',
      '①客户端携带 client_id 跳授权服务器 → ②用户登录并同意授权 → ③授权服务器回调客户端并带 code → ④客户端后端用 code+client_secret 换 access_token → ⑤客户端用 token 调资源 API',
      '①客户端直接请求用户密码 → ②发给授权服务器换 token → ③资源服务器验 token',
      '①资源服务器下发 token → ②客户端保存 → ③后续请求带 token'
    ],
    answer: 1,
    analysis: 'OAuth2 授权码模式正确流程：客户端发起 /authorize（带着 client_id、redirect_uri、scope、response_type=code）→ 用户登录授权 → 授权服务器 302 回 redirect_uri + code → 客户端后端用 POST /token 带 code + client_secret + redirect_uri（防止 code 被截获）换取 access_token（通常还有 refresh_token）→ 用 access_token 访问资源服务器。A 顺序颠倒；C 是密码模式（已废弃）；D 根本不是 OAuth。'
  },

  // ===== 性能优化 3 道（mcq-115~117）=====
  {
    id: 'mcq-115',
    category: 'performance',
    difficulty: '中等',
    question: '关于 INP（Interaction to Next Paint，已替代 FID 成为 Core Web Vitals 交互指标），下列说法错误的是？',
    options: [
      'INP 衡量用户从交互操作（点击/键盘/触摸）到页面下一帧响应绘制之间的延迟，目标 <200ms 为良好',
      'INP 只记录每次页面生命周期中第一次交互的延迟，取第一次值作为最终分数',
      '优化 INP 主要思路：减少主线程长任务、拆分繁重的输入处理、避免阻塞的 JS 同步 DOM 读写、使用 CSS 动画而非 JS 动画',
      'INP 观察的是页面生命周期中所有交互的 p98（98 分位），对重复触发的交互（如拖拽）也会采样'
    ],
    answer: 1,
    analysis: 'INP 不是只取第一次，而是**记录整个页面生命周期所有交互的 p98**（即"慢交互"作为最终值），比 FID 更严格。FID 只测首次输入延迟且只测到开始处理；INP 还包含处理时间和下一帧绘制时间。A 正确：阈值 200ms 良好 / 500ms 差；C 正确：长任务是核心瓶颈；D 正确：p98 统计。'
  },
  {
    id: 'mcq-116',
    category: 'performance',
    difficulty: '中等',
    question: '关于浏览器长任务（Long Task），下列说法正确的是？',
    options: [
      '长任务指执行时间超过 100ms 的 JS 任务（阻塞主线程），会导致交互延迟、掉帧',
      '长任务无法被浏览器检测，只能用第三方 JS 库观察',
      '解决长任务的唯一办法是把代码移入 setInterval 循环执行',
      '长任务只会影响加载阶段，用户交互阶段不会出现长任务'
    ],
    answer: 0,
    analysis: '长任务 = 持续 ≥ 50ms 的主线程任务（Long Tasks API 定义），浏览器提供 PerformanceObserver 观测。主线程被占据时，交互（INP）和渲染（60fps=16.7ms/帧）都会延迟。B 错：浏览器原生 Long Tasks API；C 错：正确做法是用 Scheduler API / isInputPending / requestIdleCallback / Web Worker 拆分；D 错：任何阶段都可能。'
  },
  {
    id: 'mcq-117',
    category: 'performance',
    difficulty: '中等',
    question: '关于骨架屏（Skeleton Screen）的实现与效果，下列说法错误的是？',
    options: [
      '骨架屏的核心目的是减少"感知加载时间"，用近似内容占位降低白屏焦虑，属于感知性能优化',
      '服务端渲染（SSR）或静态骨架屏 HTML 首屏直接返回，比纯客户端动态插入骨架屏更好地降低 FCP/LCP',
      '骨架屏图片越大越好（像素级对齐真实内容），无论多少请求数和体积',
      '常见实现方式：首屏 HTML 注入静态占位结构、SVG/组件自动生成骨架、Puppeteer/构建时预渲染抽取'
    ],
    answer: 2,
    analysis: '骨架屏本身需要"轻"——如果骨架屏引入了多张大图或沉重 CSS，反而**拖慢 FCP/LCP**，违背优化目的。要做到：体积小、DOM 结构简单、关键 CSS 内联。A 正确：感知性能（perceived performance）是主要收益；B 正确：SSR/内联骨架能让首屏立即显示；D 正确：多种成熟实现手段。'
  },

  // ===== 工程化 3 道（mcq-118~120）=====
  {
    id: 'mcq-118',
    category: 'engineering',
    difficulty: '中等',
    question: '关于 Vite 与 Webpack 的对比，下列说法错误的是？',
    options: [
      '开发环境：Vite 用 ESM 按需编译启动快，Webpack 需要先打包 Bundle 再启动',
      '生产构建：Vite 用 Rollup，Webpack 用自己的打包器，两者都支持代码分割、Tree-Shaking、CSS 处理',
      'Vite 完全不需要任何配置，开箱即用；Webpack 必须手写几百行配置才能工作',
      '两者的预构建与 HMR 机制不同：Vite 用 esbuild 预构建依赖，HMR 基于 ESM；Webpack 的 HMR 基于 bundle 的模块补丁'
    ],
    answer: 2,
    analysis: 'Vite 同样需要配置（vite.config.ts：别名、插件、server.proxy、build.target、optimizeDeps 等），只是约定优于配置，默认覆盖了常见场景。Webpack 也有脚手架（如 Vue CLI、CRA）封装，未必手写复杂配置。A/B/D 均正确：核心差异在于开发期模块体系和依赖预构建策略。'
  },
  {
    id: 'mcq-119',
    category: 'engineering',
    difficulty: '困难',
    question: '关于微前端的常见方案（Module Federation、qiankun、single-spa、Web Components），下列说法错误的是？',
    options: [
      'qiankun 基于 single-spa 封装，提供了 HTML Entry、JS 沙箱、样式隔离等更实用的能力，上手简单',
      'Module Federation（Webpack5 内置）是构建期联邦，允许应用在运行时动态加载其他应用暴露的模块，共享依赖',
      'Web Components 方案可以做到真正的样式和 DOM 隔离，且不需要宿主框架集成，可独立发布',
      '以上方案都可以无条件地让 React、Vue、Angular 等任何技术栈混跑，无需做任何通信约定'
    ],
    answer: 3,
    analysis: '技术栈混跑需要处理**跨框架的通信、路由、状态、生命周期、公共依赖**等问题，不是"无条件混跑"。需要约定全局 EventBus、Custom Events、共享状态管理接口、路由基座规则等。A 正确：qiankun 是国内最流行的包裹层；B 正确：MF 是构建+运行时一体化方案；C 正确：Web Components 方案隔离度最高但工程上也需要约定 props/events API。'
  },
  {
    id: 'mcq-120',
    category: 'engineering',
    difficulty: '困难',
    question: '关于 ESBuild 与 Rolldown，下列说法正确的是？',
    options: [
      'ESBuild 是 Go 写的 JS/TS 打包器，速度极快，但插件生态、复杂代码分割、HMR 等成熟度目前弱于 Rollup/Webpack',
      'Rolldown 是一个基于 Rust 的 Rollup 兼容实现，目标是在保持 Rollup API/插件兼容的前提下大幅提升性能',
      'Vite 5+ 在开发预构建阶段使用 esbuild，生产构建阶段仍使用 Rollup；未来 Rolldown 可能替代 Rollup 成为 Vite 的生产构建器',
      '以上都正确'
    ],
    answer: 3,
    analysis: '三者均正确。A：ESBuild 速度碾压（Go 并行+避免 AST 多次遍历），但在 HMR、插件复杂场景、CSS 处理、复杂 code splitting 上生态成熟度仍不及 Rollup/Webpack；B：Rolldown 是 Rolldown 组织/Rolldown 团队主导的 Rust 实现，设计目标是 Rollup 兼容的高性能替代；C：Vite 采用双引擎策略（esbuild 用于 dev 预构建，Rollup 用于 production），Rolldown 是后续可能的升级路径以统一引擎并加速生产构建。'
  }
]

// 题库总数（用于首页/考试页统计）
export const examQuestionCount = examQuestions.length
