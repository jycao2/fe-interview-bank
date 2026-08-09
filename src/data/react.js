export const reactQuestions = [
  {
    id: 'react-001',
    category: 'react',
    title: 'React 的设计理念是什么？',
    difficulty: '中等',
    tags: ['设计理念', '声明式', '组件化'],
    answer: `## 核心理念

1. **声明式**：描述"UI 应该是什么样子"，而非"如何一步步操作 DOM"。状态变化时 React 自动更新视图。

\`\`\`jsx
// 声明式：根据 state 渲染
<div>{count}</div>
\`\`\`

2. **组件化**：UI 拆分为独立、可复用的组件，组件管理自己的状态，组合成页面。
3. **单向数据流**：数据自上而下（props）流动，状态变化可预测、易调试。
4. **Learn once, write anywhere**：Web 用 React DOM，Native 用 React Native，理念一致。

## 重要原则

- **UI = f(state)**：视图是状态的函数映像。给定相同状态，渲染结果一致（纯函数思想）。
- **不可变数据**：通过返回新对象触发更新，避免直接 mutate。
- **组合优于继承**：通过 props 组合复用，而非类继承。

## Fiber 架构

React16 引入 Fiber，把渲染工作拆成可中断、可恢复的单元，支持时间切片（concurrent 模式），让大更新不阻塞主线程。`
  },
  {
    id: 'react-002',
    category: 'react',
    title: 'React Hooks 是什么？解决了什么问题？',
    difficulty: '中等',
    tags: ['Hooks', '函数组件', '状态'],
    answer: `## 定义

Hooks 是 React 16.8 引入的特性，让**函数组件**也能使用 state 和生命周期等能力，无需写 class。

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0)
  useEffect(() => { document.title = count }, [count])
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
\`\`\`

## 解决的问题

1. **逻辑复用难**：class 时代用 HOC / render props 复用状态逻辑，导致"嵌套地狱"。Hooks 通过自定义 Hook 抽离逻辑，组合自然。
2. **复杂组件难以理解**：class 中相关逻辑散落在不同生命周期方法里（componentDidMount / componentDidUpdate / componentWillUnmount），Hooks 按功能聚合。
3. **class 心智负担**：this 绑定、绑定事件处理函数、编译步骤等。

## 常用内置 Hooks

- \`useState\` / \`useReducer\`：状态。
- \`useEffect\`：副作用（订阅、请求、操作 DOM）。
- \`useLayoutEffect\`：同步执行（DOM 测量后、浏览器绘制前）。
- \`useMemo\` / \`useCallback\`：缓存值 / 函数，优化性能。
- \`useRef\`：跨渲染保留可变值、访问 DOM。
- \`useContext\`：消费 Context。
- \`useId\` / \`useTransition\` / \`useDeferredValue\` / \`useSyncExternalStore\`：并发与外部 store。

## 两条铁律

1. **只在顶层调用**，不要在循环、条件、嵌套函数里调用（依赖调用顺序的链表实现）。
2. **只在函数组件或自定义 Hook 中调用**。`
  },
  {
    id: 'react-003',
    category: 'react',
    title: 'useEffect 的依赖数组与清理函数？',
    difficulty: '中等',
    tags: ['useEffect', '副作用', '依赖'],
    answer: `## 基本用法

\`\`\`jsx
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)  // 清理函数
}, [deps])
\`\`\`

## 依赖数组的含义

| 写法 | 执行时机 |
| --- | --- |
| \`[a, b]\` | 首次 + a 或 b 变化时 |
| \`[]\` | 仅首次（mount） |
| 不传 | 每次渲染后都执行 |

## 清理函数

- 返回的函数在组件卸载时、以及**下次 effect 执行前**调用。
- 用于清理订阅、定时器、事件监听、请求取消，避免内存泄漏和脏数据。

## 常见陷阱

1. **依赖遗漏**：用了某变量却没加入依赖 → 闭包捕获旧值（stale closure）。React ESLint 的 \`exhaustive-deps\` 规则会警告。
2. **依赖引用变化**：对象 / 函数每次渲染都是新引用，会导致 effect 频繁执行。用 \`useMemo\` / \`useCallback\` 稳定引用。
3. **无限循环**：在 effect 里 setState 且依赖该 state → 死循环。

\`\`\`jsx
// ❌ 无限循环
useEffect(() => { setCount(c => c + 1) }, [count])

// ✅ 用函数式更新或正确依赖
useEffect(() => { setCount(c => c + 1) }, [])  // 仅 mount 时
\`\`\`

## 异步请求

effect 回调不能直接是 async，需内部定义或用 IIFE：

\`\`\`jsx
useEffect(() => {
  let cancelled = false
  fetchData().then(d => { if (!cancelled) setData(d) })
  return () => { cancelled = true }
}, [id])
\`\`\`

## useEffect vs useLayoutEffect

- \`useEffect\`：异步，浏览器绘制后执行，不阻塞视觉。
- \`useLayoutEffect\`：同步，DOM 变更后、绘制前执行，适合需要测量 DOM 并同步更新以避免闪烁的场景。`
  },
  {
    id: 'react-004',
    category: 'react',
    title: 'React 的 diff 算法与 key 的作用？',
    difficulty: '中等',
    tags: ['diff', 'key', ' reconciliation'],
    answer: `## diff 的三个假设（将 O(n³) 降为 O(n)）

1. **跨层级忽略**：只比较同一层级的节点，不考虑跨层移动（鼓励稳定的层级结构）。
2. **类型不同直接替换**：标签 / 组件类型变化，卸载旧树、新建新树。
3. **同类型用 key 标识**：列表中通过 key 复用节点。

## key 的作用

key 是 vnode 的"身份标识"，帮助 diff 识别哪些元素变化、新增、删除、移动。

### 没有 key（或用 index）

列表更新时，React 按顺序复用节点，可能导致：

- **状态错位**：组件内部 state 被错误地套到其他项上。
- **性能下降**：无法识别"移动"，只能逐个更新。
- **输入框串值**：受控 / 非受控切换错乱。

### 用稳定唯一 key

\`\`\`jsx
{list.map(item => <Item key={item.id} data={item} />)}
\`\`\`

React 能精准识别：相同 key 复用并更新 props，删除的 key 卸载，新增的 key 创建，移动的 key 调整位置。

## key 的要求

- **稳定**：同一项的 key 在多次渲染间不变（不要用 \`Date.now()\` / \`Math.random()\`）。
- **唯一**：同级兄弟间不重复。
- **避免用 index**：除非列表纯展示且不会增删 / 重排。

## 为什么 index 不好

\`\`\`jsx
// 列表 [A, B, C]，删除 A → [B, C]
// 用 index 做 key：B 的 key 从 1→0，React 以为 B 变成 A，复用错组件状态
\`\`\`

用稳定的 id 才能正确识别"A 被删了，B、C 不变"。`
  },
  {
    id: 'react-005',
    category: 'react',
    title: 'React Fiber 架构是什么？解决了什么问题？',
    difficulty: '困难',
    tags: ['Fiber', '调度', '并发'],
    answer: `## 旧架构的问题（Stack Reconciler）

React15 的协调过程是**同步递归**的，一旦开始更新就一口气跑完，无法中断。大型应用的一次更新可能耗时几十甚至上百毫秒，期间主线程被占用，动画卡顿、交互无响应。

## Fiber 是什么

Fiber 是 React16 引入的**新的协调架构**，核心思想：

1. **把渲染工作拆分为多个小任务（fiber 单元）**，可中断、可恢复、可优先级调度。
2. **利用时间切片**：每帧留出时间给浏览器绘制 / 处理输入，剩余时间继续 reconcile，避免长时间阻塞主线程。

## Fiber 节点

每个组件对应一个 Fiber 节点，构成链表树（child / sibling / return 指针）。Fiber 节点保存了组件的类型、状态、副作用、与 DOM 的关系等，便于中断后恢复。

## 双缓冲（Double Buffering）

- \`current\` 树：当前屏幕上的。
- \`workInProgress\` 树：正在构建的。
- 两棵树通过 alternate 指针互相引用，构建完成后直接替换 root 指针，类似显卡双缓冲，避免中间状态闪烁。

## 两个阶段

1. **Render 阶段（可中断）**：构建 workInProgress 树，计算变更（effect list）。纯计算、无副作用，可被高优先级任务打断重来。
2. **Commit 阶段（不可中断）**：同步把变更应用到 DOM（beforeMutation / mutation / layout），执行生命周期 / effect。

## 优先级调度（Concurrent）

- 不同更新有不同优先级（用户输入 > 数据请求 > 同步任务）。
- 高优先级更新可"插队"，先渲染；低优先级任务可被打断或重做。
- \`useTransition\` / \`useDeferredValue\` 让开发者主动标记低优先级更新。

## 带来的能力

- Concurrent Rendering（并发渲染）。
- Suspense（异步数据 / 组件）。
- 流式 SSR（renderToNodeStream → renderToPipeableStream）。
- 大列表虚拟化与渐进渲染更顺滑。`
  },
  {
    id: 'react-006',
    category: 'react',
    title: 'React 组件间通信有哪些方式？',
    difficulty: '简单',
    tags: ['组件通信', 'props', 'Context'],
    answer: `## 1. 父→子：props

\`\`\`jsx
<Child msg={text} />
\`\`\`

## 2. 子→父：回调函数

父组件传一个回调给子组件，子组件调用它传数据：

\`\`\`jsx
function Parent() {
  const handle = (data) => console.log(data)
  return <Child onSend={handle} />
}
function Child({ onSend }) {
  return <button onClick={() => onSend('hi')}>send</button>
}
\`\`\`

## 3. 兄弟组件：状态提升

把共享状态提到共同父组件，通过 props + 回调分别传给两个兄弟。

## 4. 跨层级：Context

\`\`\`jsx
const ThemeCtx = createContext()
function App() {
  return <ThemeCtx.Provider value={theme}><Deep /></ThemeCtx.Provider>
}
function Deep() {
  const theme = useContext(ThemeCtx)
}
\`\`\`

适合主题、用户信息、国际化等全局数据。避免 props 逐层透传。

## 5. 全局状态管理

Redux / Zustand / Jotai / Recoil 等，适合跨组件、跨页面复杂状态。

## 6. ref / useImperativeHandle（命令式）

父组件通过 ref 调用子组件暴露的方法：

\`\`\`jsx
const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({ focus: () => ... }))
})
\`\`\`

## 7. 自定义事件 / 发布订阅

小型场景用 mitt 等事件总线，或基于 ref 的 EventEmitter 模式。

## 选择

- 父子 → props / 回调。
- 兄弟 → 状态提升。
- 跨层 → Context。
- 复杂全局 → 状态管理库。`
  },
  {
    id: 'react-007',
    category: 'react',
    title: 'useMemo 和 useCallback 的区别与使用场景？',
    difficulty: '中等',
    tags: ['useMemo', 'useCallback', '性能'],
    answer: `## 区别

- \`useMemo(() => computeValue, [deps])\`：**缓存一个值**（计算结果）。
- \`useCallback(fn, [deps])\`：**缓存一个函数引用**，等价于 \`useMemo(() => fn, [deps])\`。

\`\`\`jsx
const sorted = useMemo(() => list.sort(), [list])
const handleClick = useCallback(() => doSomething(id), [id])
\`\`\`

## 使用场景

### 1. 避免子组件无谓重渲染

把函数 / 对象作为 props 传给子组件时，若每次渲染都新建引用，子组件即使 memo 了也会重渲染：

\`\`\`jsx
const Heavy = memo(({ onClick, config }) => { ... })

function Parent() {
  const onClick = useCallback(() => {...}, [deps])  // 稳定引用
  const config = useMemo(() => ({ ... }), [deps])
  return <Heavy onClick={onClick} config={config} />
}
\`\`\`

### 2. 缓存昂贵计算

\`\`\`jsx
const result = useMemo(() => expensiveCalc(bigData), [bigData])
\`\`\`

## 不要滥用

- 简单计算 / 非传递给子组件的函数，用 useMemo/useCallback 反而**增加开销**（记忆本身有成本）。
- 子组件未用 \`memo\` 包裹时，传 useMemo 的 props 也没意义（每次父渲染子都重渲染）。

## 依赖陷阱

- 依赖数组写错会导致缓存失效或闭包陈旧。
- 用 ESLint 的 exhaustive-deps 规则辅助。

## 经验

- 仅在"计算昂贵"或"引用稳定性影响下游 memo"时使用。
- 优先让组件本身保持轻量，再考虑缓存。`
  },
  {
    id: 'react-008',
    category: 'react',
    title: '受控组件与非受控组件的区别？',
    difficulty: '简单',
    tags: ['受控', '非受控', '表单'],
    answer: `## 受控组件（Controlled）

表单元素的值由 React state 控制，用户输入触发 onChange 更新 state，state 再驱动 value。**数据单一来源是 state**。

\`\`\`jsx
function Form() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
\`\`\`

- 优点：数据与 UI 同步、易校验、易组合、易提交。
- 缺点：每次输入都触发渲染，大量字段时可能影响性能。

## 非受控组件（Uncontrolled）

表单元素由 DOM 自己管理状态，React 通过 \`ref\` 在需要时读取值。**数据源是 DOM**。

\`\`\`jsx
function Form() {
  const inputRef = useRef()
  const submit = () => console.log(inputRef.current.value)
  return <input ref={inputRef} defaultValue="hello" />
}
\`\`\`

- 用 \`defaultValue\` / \`defaultChecked\` 设置初始值（不能用 \`value\`，否则变受控）。
- 优点：无需为每个字段维护 state、性能好、与第三方表单库集成方便。
- 缺点：难以即时校验、难以响应输入变化、不便于动态联动。

## 选择

- 需要**实时校验、联动、受控提交** → 受控。
- **简单表单、一次性提交、性能敏感** → 非受控（或用 react-hook-form 等库，内部用非受控 + ref 提升性能）。
- 实际项目多用受控组件，配合表单库（Formik / react-hook-form）。`
  },
﻿  {
    id: 'react-009',
    category: 'react',
    title: 'React 18 并发模式与 useTransition / useDeferredValue？',
    difficulty: '困难',
    tags: ['Concurrent', 'useTransition', 'useDeferredValue', 'React 18'],
    answer: `## 并发模式（Concurrent Rendering）

React 18 默认开启并发渲染（通过 \`createRoot\`）。核心：**渲染过程可中断、可恢复、可让位**给更高优先级任务，避免长时间阻塞主线程，让交互保持流畅。

\`\`\`jsx
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(<App />);
\`\`\`

并发模式不是"多线程"，仍是单线程；只是把渲染拆成可中断的小任务，由调度器（基于优先级 + 时间切片）管理。

## 并发特性

- **自动批处理（Automatic Batching）**：所有事件 / promise / timeout 中的多次 setState 都会被合并为一次渲染（React 17 只在事件处理函数中批处理）。
- **Suspense 改进**：支持服务端流式 SSR。
- **useTransition / useDeferredValue**：把昂贵更新标记为低优先级。
- **选择性 hydration**：SSR 时可在 hydration 前响应交互。

## useTransition

把一次状态更新标记为**低优先级（transition）**，让高优先级（如输入框输入）先响应。

\`\`\`jsx
import { useState, useTransition } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const onChange = (e) => {
    setQuery(e.target.value);  // 高优先级：输入框立即更新
    startTransition(() => {
      setList(filterHuge(e.target.value));  // 低优先级：列表可延迟
    });
  };

  return (
    <>
      <input value={query} onChange={onChange} />
      {isPending && <span>filtering...</span>}
      <List data={list} />
    </>
  );
}
\`\`\`

- \`isPending\`：transition 进行中，可用于展示 loading。
- 适合"输入 → 重算大列表 / 切 Tab 重渲染"等场景。

## useDeferredValue

返回一个**延迟版本**的值，让基于该值的昂贵渲染延后。

\`\`\`jsx
function Search({ query }) {
  const deferredQuery = useDeferredValue(query);
  const items = useMemo(() => filterHuge(deferredQuery), [deferredQuery]);
  return <List data={items} />;
}
\`\`\`

与 \`useTransition\` 的区别：

- useTransition 是**主动**标记某次更新为低优先级（有 setter 控制）。
- useDeferredValue 是**被动**接收一个值，让消费它的渲染延后（适合无法控制 setState 的子组件）。

两者底层都基于并发调度，效果类似：能控制 setter 用 useTransition，只能拿到值用 useDeferredValue。

## 适用与不适用

| 场景 | 适合 |
| --- | --- |
| 大列表筛选 / 排序 | ✅ useTransition |
| Tab 切换重内容 | ✅ useTransition |
| 第三方受控组件延迟 | ✅ useDeferredValue |
| 简单 setState | ❌ 无收益，徒增复杂度 |
| 需要立即一致的场景（如金额） | ❌ 不应延迟 |

## 注意

- transition 内的 setState 仍是同步调用，只是渲染被延后；多次合并后只会渲染最终结果。
- 低优先级更新可被高优先级打断后重做。
- 不要在 transition 里做必须立即生效的副作用（如导航）。`
  },
  {
    id: 'react-010',
    category: 'react',
    title: 'useReducer 与 useState 的区别与选择？',
    difficulty: '中等',
    tags: ['useReducer', 'useState', '状态管理'],
    answer: `## useState：单值状态

适合**独立、简单**的状态，每次直接设置新值。

\`\`\`jsx
const [count, setCount] = useState(0);
const [name, setName] = useState("tom");
\`\`\`

- 更新方式：\`setCount(1)\` / \`setCount(c => c + 1)\`。
- 多个相关字段通常拆成多个 useState，或合并成一个对象。

## useReducer：reducer 模式

适合**多字段相互关联、状态流转复杂**的场景，类似 Redux。

\`\`\`jsx
const initialState = { count: 0, step: 1 };
function reducer(state, action) {
  switch (action.type) {
    case "inc": return { ...state, count: state.count + state.step };
    case "setStep": return { ...state, step: action.step };
    case "reset": return initialState;
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <button onClick={() => dispatch({ type: "inc" })}>{state.count}</button>;
}
\`\`\`

## 对比

| | useState | useReducer |
| --- | --- | --- |
| 状态形态 | 单值 / 少量独立 | 复杂对象 / 多字段联动 |
| 更新方式 | 直接设值 | dispatch action |
| 逻辑位置 | 散落各处 | 集中在 reducer（可独立测试） |
| 适用场景 | 简单状态 | 状态机、表单、复杂表单/向导 |
| 性能 | 对象更新需手动展开 | 同样需返回新对象 |

## 何时用 useReducer

1. **多个状态字段需要一起变化**（如表单：填一个字段影响校验状态、提交按钮可用性）。
2. **状态流转有明确"事件/动作"语义**（如下棋、游戏、向导步骤、文件上传状态机）。
3. **下一状态依赖复杂逻辑**或多个前值。
4. **需要把更新逻辑抽离复用 / 单测**：reducer 是纯函数，易测试。
5. **深层组件需要触发顶层更新**：可传 \`dispatch\`（引用稳定）给子组件，配合 useReducer 比 useState + useCallback 更省心。

## useReducer 的优势

- \`dispatch\` 引用**永远稳定**，不需要 useCallback 包裹。
- 状态更新逻辑集中、可测试、可预测（纯函数）。
- 适合配合 Context 实现"局部 Redux"。

\`\`\`jsx
const StoreCtx = createContext(null);
function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);
  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}
\`\`\`

## 惰性初始化

\`\`\`jsx
const [state, dispatch] = useReducer(reducer, initialArg, init);
// init(initialArg) 在挂载时执行一次，适合从 localStorage 读取
\`\`\`

useState 也有惰性初始化：\`useState(() => expensiveInit())\`。

## 选择建议

- 一个组件只有 1-2 个独立字段 → useState。
- 状态对象字段多且联动 → useReducer。
- 不确定时先用 useState，复杂度上升再重构为 useReducer。`
  },
  {
    id: 'react-011',
    category: 'react',
    title: 'useRef 的用途有哪些？',
    difficulty: '中等',
    tags: ['useRef', 'DOM', '可变值'],
    answer: `## useRef 是什么

返回一个 \`{ current: initialValue }\` 的可变对象，**跨渲染保持同一引用**，修改 \`current\` 不会触发重新渲染。

\`\`\`jsx
const ref = useRef(0);
ref.current++;  // 不触发渲染
\`\`\`

## 用途一：访问 DOM 元素

最常见的用途，把 ref 挂到 DOM 上拿到原生节点。

\`\`\`jsx
function Input() {
  const inputRef = useRef();
  useEffect(() => inputRef.current.focus(), []);
  return <input ref={inputRef} />;
}
\`\`\`

## 用途二：存储可变值（不触发渲染的"实例变量"）

适合保存定时器 id、上一次的值、是否首次渲染标记等。

\`\`\`jsx
function Timer() {
  const [count, setCount] = useState(0);
  const timerRef = useRef();
  useEffect(() => {
    timerRef.current = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);
  return <button onClick={() => clearInterval(timerRef.current)}>stop</button>;
}
\`\`\`

记录前一次 state：

\`\`\`jsx
const prevRef = useRef();
useEffect(() => { prevRef.current = value });
\`\`\`

## 用途三：保存"最新的"回调 / 数据，避免闭包陈旧

在长生命周期的 effect / 异步回调里拿到最新值：

\`\`\`jsx
function Poll({ userId }) {
  const userIdRef = useRef(userId);
  useEffect(() => { userIdRef.current = userId });
  useEffect(() => {
    const id = setInterval(() => fetch("/api?u=" + userIdRef.current), 1000);
    return () => clearInterval(id);
  }, []);
}
\`\`\`

或更通用的"最新函数"模式：

\`\`\`jsx
function useEvent(fn) {
  const ref = useRef(fn);
  useEffect(() => { ref.current = fn });
  return useCallback((...args) => ref.current(...args), []);
}
\`\`\`

## 用途四：forwardRef + useImperativeHandle 暴露方法

父组件通过 ref 调用子组件方法：

\`\`\`jsx
const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus()
  }));
});
\`\`\`

## useRef vs useState

| | useRef | useState |
| --- | --- | --- |
| 修改触发渲染 | 否 | 是 |
| 跨渲染保持 | 是 | 是 |
| 用途 | DOM、可变实例值 | 驱动 UI 的状态 |
| 更新方式 | 直接 \`ref.current = x\` | \`setState(x)\` |

## 注意

- **不要在渲染过程中读写 ref.current**（除懒初始化），渲染应是纯函数。在 effect / 事件 / 回调中读写。
- ref 不适合存"会影响 UI"的值——那种值应该用 state。
- 函数组件的 ref 与 class 的 \`this.xxx\` 角色类似。`
  },
  {
    id: 'react-012',
    category: 'react',
    title: '如何编写高质量的自定义 Hook？',
    difficulty: '中等',
    tags: ['自定义Hook', 'useXxx', '复用', '最佳实践'],
    answer: `## 自定义 Hook 是什么

以 \`use\` 开头的函数，内部调用其他 Hook，**抽取组件逻辑复用**。本质是函数，不是 React 特殊机制——但约定命名让 lint 能校验规则。

\`\`\`jsx
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const inc = () => setCount(c => c + 1);
  const reset = () => setCount(initial);
  return { count, inc, reset };
}
\`\`\`

## 解决的问题

替代 class 时代的 mixin / HOC / render props，避免嵌套地狱，逻辑可自然组合。

## 设计原则

### 1. 单一职责

一个 Hook 只做一件事：\`useFetch\`、\`useDebounce\`、\`useLocalStorage\`、\`useWindowSize\`。需要组合就在组件里组合多个 Hook。

### 2. 命名以 use 开头

强制约定，便于 lint 校验、IDE 识别、阅读时一眼看出是 Hook。

### 3. 返回值清晰

- 返回**数组**：当返回值少且位置易记时（\`[value, setValue]\`，如 useState）。
- 返回**对象**：当返回值多或需具名访问时（\`{ data, loading, error, refetch }\`）。

### 4. 参数设计

- 接收依赖作为参数（而非依赖闭包外部变量），便于内部 useEffect 正确处理依赖。
- 提供合理默认值。

\`\`\`jsx
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url, options)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setError(null); } })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true };
  }, [url]);

  return { data, loading, error };
}
\`\`\`

### 5. 处理副作用与清理

定时器、订阅、事件监听必须返回清理函数，避免内存泄漏。

\`\`\`jsx
function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return w;
}
\`\`\`

### 6. 依赖完整

effect 内用到的 props / state 都要进依赖数组（用 eslint exhaustive-deps 辅助），否则闭包陈旧。

## 典型示例

### useDebounce

\`\`\`jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
\`\`\`

### useLocalStorage

\`\`\`jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
\`\`\`

### usePrevious

\`\`\`jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value });
  return ref.current;
}
\`\`\`

## 组合：Hook 之间互相调用

\`\`\`jsx
function useUser(id) {
  const debouncedId = useDebounce(id, 300);
  return useFetch("/api/user/" + debouncedId);
}
\`\`\`

## 反模式

- 在 Hook 内做与渲染相关的副作用（应放 effect）。
- 返回会每次新建的函数 / 对象却不稳定（影响下游 memo）——可用 useCallback / useMemo。
- 把 \`use\` 用于非 Hook 函数（违反规则）。
- Hook 内调用条件 Hook（违反顶层调用规则）。

## 测试

自定义 Hook 是纯函数，可用 \`renderHook\`（React 18+）测试：

\`\`\`jsx
const { result } = renderHook(() => useCounter(0));
act(() => result.current.inc());
expect(result.current.count).toBe(1);
\`\`\``
  },
  {
    id: 'react-013',
    category: 'react',
    title: 'React 中的错误边界（Error Boundaries）？',
    difficulty: '中等',
    tags: ['Error Boundary', '错误边界', 'componentDidCatch'],
    answer: `## 错误边界是什么

React 组件树中**捕获子组件渲染过程中的 JavaScript 错误**，展示降级 UI 而非整页白屏崩溃的组件。

> 仅类组件可成为错误边界（Hooks 目前没有等价 API，但可用 react-error-boundary 库）。

## 实现：两个生命周期

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    logErrorToService(error, info.componentStack);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

<ErrorBoundary fallback={<h1>出错了</h1>}>
  <App />
</ErrorBoundary>
\`\`\`

- \`getDerivedStateFromError\`：渲染阶段调用，返回 state 触发降级 UI。
- \`componentDidCatch\`：副作用阶段，可上报错误、打印 \`componentStack\`。

## 能捕获的错误

- 子组件**渲染期间**的错误（render、构造函数、生命周期）。

## 不能捕获的错误

- 事件处理函数中的错误（需要 try/catch 自行处理）。
- 异步代码：\`setTimeout\` / \`requestAnimationFrame\` / \`Promise\` 回调。
- 服务端渲染（SSR）期间的错误。
- 错误边界**自身**抛出的错误（只能被上层边界捕获）。

| 错误来源 | 错误边界能否捕获 |
| --- | --- |
| 子组件 render / 构造函数 / 生命周期 | ✅ |
| 事件 onClick 内部 | ❌ |
| setTimeout / Promise 内 | ❌ |
| 边界自身 | ❌ |
| SSR 渲染 | ❌ |

## 用法策略

- **顶层边界**：包裹整个 App，提供全局兜底。
- **区域边界**：包裹独立模块（侧边栏、聊天框、列表），局部出错不影响其他区域。
- **细粒度边界**：包裹单个易错组件。

\`\`\`jsx
<ErrorBoundary fallback={<AppError />}>
  <Header />
  <main>
    <ErrorBoundary fallback={<WidgetError />}>
      <Widget />
    </ErrorBoundary>
  </main>
</ErrorBoundary>
\`\`\`

## 恢复

错误边界一旦触发，state 持有 \`hasError\`。可通过 \`key\` 重置或自定义 \`reset\` 方法：

\`\`\`jsx
reset = () => this.setState({ hasError: false });
// <ErrorBoundary key={resetKey}>
\`\`\`

## 推荐库

\`react-error-boundary\` 提供了函数式 API、\`onReset\`、\`resetKeys\` 等增强能力，避免手写类组件：

\`\`\`jsx
import { ErrorBoundary } from "react-error-boundary";
<ErrorBoundary FallbackComponent={MyFallback} onReset={() => {}}>
  <App />
</ErrorBoundary>
\`\`\`

## 注意

- React 16+：未被捕获的错误会卸载整棵组件树（避免显示错误状态造成误导），所以建议至少有一个顶层边界。
- 错误边界 ≠ 全局 \`window.onerror\` / \`unhandledrejection\`，两者互补。`
  },
  {
    id: 'react-014',
    category: 'react',
    title: 'React 的合成事件（SyntheticEvent）与原生事件？',
    difficulty: '中等',
    tags: ['合成事件', 'SyntheticEvent', '事件机制'],
    answer: `## 合成事件是什么

React 把浏览器原生事件包装成统一的 \`SyntheticEvent\` 对象，提供跨浏览器一致的 API（\`e.target\`、\`e.stopPropagation\`、\`e.preventDefault\` 等），抹平 IE 与标准浏览器差异。

\`\`\`jsx
<button onClick={(e) => {
  e.preventDefault();
  console.log(e.target);
}}>click</button>
\`\`\`

## 事件委托机制

- **React 17 之前**：所有事件委托到 \`document\` 上。
- **React 17+**：委托目标改为**组件树根容器**（\`createRoot\` 挂载的节点），而非 \`document\`。

这样多个 React 应用同页面共存时不会互相干扰，也方便与第三方库配合。

## 优势

1. **跨浏览器一致性**：无需关心 IE 的 \`attachEvent\` / 事件对象差异。
2. **性能**：只在根节点挂载一个监听器，避免为每个元素都 \`addEventListener\`，内存开销小。
3. **与虚拟 DOM 集成**：事件分发沿组件树，能与 React 的事件系统、状态更新协同。

## SyntheticEvent 的特性

- **池化（React 16 及以前）**：事件对象会被复用，事件回调结束后属性会被清空。异步访问需 \`e.persist()\` 或提前取出需要的字段。
- **React 17+ 已移除事件池**：\`SyntheticEvent\` 不再被回收复用，可安全异步访问，\`persist()\` 变成空操作（保留兼容）。
- \`e.nativeEvent\`：访问底层原生事件对象。
- \`e.stopPropagation()\` / \`e.preventDefault()\` 与原生行为一致。

## 合成事件 vs 原生事件

| | 合成事件 | 原生事件 |
| --- | --- | --- |
| 注册方式 | JSX \`onClick\` | \`addEventListener\` |
| 事件对象 | SyntheticEvent | native Event |
| 委托位置 | 根容器（17+） | 注册的元素 |
| 命名 | onClick / onChange | click / change |
| 池化 | 17+ 已移除 | 无 |

## 执行顺序

- 原生事件（按注册顺序）冒泡到根容器 → React 合成事件系统接管 → 捕获阶段合成事件 → 目标 → 冒泡阶段合成事件 → 继续冒泡到 document。
- 在同一元素上同时绑 \`onClick\` 与 \`addEventListener("click")\`：原生先执行（因为冒泡到根容器时，React 才在根容器触发合成事件）。

## 注意事项

- 不要混用合成事件和原生事件绑定同一行为，容易出现顺序与解绑问题。
- 原生监听（\`window\` / \`document\`）必须手动 \`removeEventListener\`，否则泄漏。
- 阻止合成事件冒泡不会阻止 document 上的原生监听；如需阻止 document，用 \`e.nativeEvent.stopImmediatePropagation()\`。`
  },
  {
    id: 'react-015',
    category: 'react',
    title: 'React 状态管理方案对比（Context / Redux / Zustand / Jotai）？',
    difficulty: '困难',
    tags: ['状态管理', 'Context', 'Redux', 'Zustand', 'Jotai'],
    answer: `## 为什么需要状态管理

当状态需要跨多层组件共享、或涉及复杂交互（如全局用户、购物车、主题、表单状态），单纯 props / 状态提升会变得难以维护，需要专门的状态管理方案。

## Context（内置）

\`createContext\` + \`useContext\`，React 内置，无依赖。

\`\`\`jsx
const Ctx = createContext(null);
function Provider({ children }) {
  const [user, setUser] = useState(null);
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>;
}
function Child() {
  const { user } = useContext(Ctx);
  return <div>{user?.name}</div>;
}
\`\`\`

- 优点：内置、简单、无依赖。
- 缺点：**Provider value 变化会让所有消费的组件全部重新渲染**，高频更新场景性能差；缺少中间件、DevTools。
- 适合：低频变化的全局数据（主题、用户信息、i18n、路由）。

## Redux

经典可预测状态容器，单向数据流 + 单一 store + reducer + action。

\`\`\`jsx
import { createSlice, configureStore } from "@reduxjs/toolkit";
const counter = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    inc: (s) => { s.value++; }
  }
});
const store = configureStore({ reducer: { counter: counter.reducer } });
// 组件
const count = useSelector(s => s.counter.value);
const dispatch = useDispatch();
dispatch(counter.actions.inc());
\`\`\`

- 优点：生态成熟、DevTools 强大（时间旅行）、中间件丰富（thunk / saga）、可预测。
- 缺点：模板代码多、学习曲线高、对小型项目偏重。
- 适合：大型应用、需要复杂异步流、强可追踪性。

## Zustand

极简的基于 Hook 的状态库，无 Provider，直接用 store。

\`\`\`jsx
import { create } from "zustand";
const useStore = create((set) => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 }))
}));
// 组件
const count = useStore(s => s.count);  // 选择器，仅订阅 count
const inc = useStore(s => s.inc);
\`\`\`

- 优点：API 极简、无 Provider、TS 友好、选择器精准订阅（性能好）、支持中间件（persist / devtools）。
- 缺点：大型项目结构需自行约定。
- 适合：中小型项目、替代 Context 解决重渲染问题、需要轻量全局状态。

## Jotai

原子化（atomic）状态，自底向上的状态管理。

\`\`\`jsx
import { atom, useAtom } from "jotai";
const countAtom = atom(0);
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
// 派生 atom
const doubleAtom = atom(get => get(countAtom) * 2);
\`\`\`

- 优点：原子粒度订阅、派生 atom 自动缓存、无需 reducer、非常适合细粒度依赖。
- 缺点：状态分散，全局视图不如 Redux 直观。
- 适合：状态分散且依赖关系复杂、需要细粒度更新的场景。

## 横向对比

| 方案 | 模式 | Provider | 模板代码 | 性能（精准订阅） | 适合规模 |
| --- | --- | --- | --- | --- | --- |
| Context | 树状广播 | 需要 | 极少 | 差（全量重渲染） | 小 / 低频 |
| Redux | 单 store + reducer | 需要 | 多 | 好（selector） | 大型 |
| Zustand | Hook store | 不需要 | 少 | 好（selector） | 中小型 |
| Jotai | 原子 | 可选 | 少 | 极好（atom） | 中 / 细粒度 |

## 其他常见方案

- **MobX**：响应式（observable），自动追踪依赖，写法接近 Vue。
- **Valtio**：基于 Proxy 的响应式 store。
- **TanStack Query / SWR**：专管**服务端状态**（请求、缓存、失效），常与本地状态库互补使用。

## 选型建议

- 仅低频全局数据 → Context。
- 中小型、要轻量且性能好 → Zustand。
- 状态分散、细粒度依赖 → Jotai。
- 大型团队、复杂异步流、强可追踪 → Redux Toolkit。
- 服务端数据 → TanStack Query / SWR（可与上面任一组合）。`
  },
  {
    id: 'react-016',
    category: 'react',
    title: 'React Server Components（RSC）是什么？',
    difficulty: '困难',
    tags: ['RSC', 'Server Components', 'React 18', '服务端'],
    answer: `## React Server Components 是什么

RSC 是 React 18 引入（实验，Next.js App Router 已广泛应用）的一种**在服务端运行、永不发送到客户端**的组件，能直接访问后端资源（数据库、文件系统），且**不增加 bundle 体积**。

\`\`\`jsx
// server component（默认）
async function ArticleList() {
  const data = await db.query("SELECT * FROM articles");
  return data.map(a => <Item key={a.id} {...a} />);
}
\`\`\`

## 服务端组件 vs 客户端组件

| | Server Component | Client Component |
| --- | --- | --- |
| 运行环境 | 服务器 | 浏览器 |
| 文件标识 | 默认 | 文件顶部 \`"use client"\` |
| 能否用 useState / useEffect | ❌ | ✅ |
| 能否 await 异步 | ✅（直接 await） | ❌（用 Suspense + effect） |
| 能访问后端资源 | ✅ | ❌ |
| 是否进入客户端 bundle | ❌（仅发送渲染结果） | ✅ |

\`\`\`jsx
"use client";
import { useState } from "react";
export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
\`\`\`

## 工作原理

1. 服务端渲染 RSC，产出**序列化的 React 元素树（RSC payload，非 HTML）**。
2. 客户端接收 payload，重建 React 树，与客户端组件混合（hydration 仅作用于 client components）。
3. RSC **不会**被下载到客户端的 JS bundle——客户端只拿到渲染后的 UI 描述，大幅减小体积。
4. RSC 可嵌套 client component；client component 也可在 children 中接收 RSC（通过 props 传递，避免边界冲突）。

## 优势

1. **零成本数据获取**：直接 await 数据库 / 内部 API，无需 \`useEffect\` + loading 状态，无请求瀑布。
2. **零依赖体积**：大型库（markdown 渲染、日期格式化）只在服务端用，不进客户端 bundle。
3. **安全**：密钥、数据库连接只留在服务端。
4. **SEO + 流式渲染**：配合 Suspense 流式输出 HTML，首屏更快。
5. **自动代码分割**：client components 视为分离的 chunk。

## 限制

- 不能用 hooks（state、effect）、不能绑定事件（onClick 等）。
- 不能用 Context（服务端没有客户端的 context 概念）。
- Client component 不能 import server component 直接渲染（但可作为 children / props 传入）。

\`\`\`jsx
// Server.js
import Client from "./Client";
export default function Server() {
  return <Client><ServerChild /></Client>;
}
\`\`\`

## 与 SSR 的区别

| | SSR（传统） | RSC |
| --- | --- | --- |
| 输出 | HTML（hydrated 后是普通组件） | RSC payload + 混合 client 组件 |
| 组件运行位置 | 服务端渲染 HTML，客户端 hydrate 后全套组件代码下载 | 服务端组件永不下发到客户端 |
| 交互 | hydrate 后 | client components 正常 hydrate |
| 数据 | 服务端取一次 | 可流式、可重新获取 |

RSC 不是替代 SSR，而是与 SSR 协作（Next.js App Router 同时用：RSC 产出 payload，SSR 把它渲染成 HTML 流式发送）。

## 何时用

- 数据密集、依赖重、不需要交互的展示组件 → Server Component。
- 需要交互、状态、事件 → Client Component。
- 框架支持：Next.js App Router、Remix（部分）、Waku 等。

## 注意

- RSC 仍是相对新的能力，生态与最佳实践在演进。
- 与现有 SSR / CSR 心智不同，需要重新划分服务端 / 客户端边界。`
  },
  {
    id: 'react-017',
    category: 'react',
    title: 'React 的合成事件（SyntheticEvent）与原生事件有什么区别？',
    difficulty: '中等',
    tags: ["合成事件","SyntheticEvent","事件系统"],
    answer: `## 什么是合成事件

React 不是直接使用原生 DOM 事件，而是**在原生事件之上封装了一层合成事件系统**（SyntheticEvent），所有事件都经过统一的处理和转换。

## 工作原理

1. React 在根节点（React 17+ 是容器节点，之前是 \`document\`）上用**事件委托**监听所有原生事件。
2. 收到原生事件后，React 根据 Fiber 树构建 **SyntheticEvent** 对象。
3. React 模拟事件冒泡/捕获，按组件层级分发到对应的处理函数。
4. 所有处理函数执行完毕后，SyntheticEvent 对象被复用（对象池）。

## 对比

| 特性 | 原生事件 | 合成事件 |
| --- | --- | --- |
| 监听位置 | 各元素独立监听 | 根节点事件委托 |
| 触发时机 | 真实 DOM 事件 | React 批处理后 |
| 冒泡/捕获 | 原生支持 | React 模拟 |
| 对象生命周期 | 持久 | 对象池复用，异步不可用 |
| 阻止冒泡 | \`stopPropagation\` | \`stopPropagation\`（在 React 层生效，原生层也会被阻止） |

## 重要区别

### 1. 事件委托

React 把所有事件监听器统一绑定在根节点上，通过 Fiber 树查找对应的处理函数。这样做的好处：
- 减少内存占用（不需要每个 DOM 元素都绑事件）。
- 统一管理，便于事件优化。

### 2. 对象池复用

SyntheticEvent 对象会被 React 放入对象池，事件处理完后回收。这意味着：

\`\`\`jsx
// ❌ 错误：异步读取 event
onClick={(e) => {
  setTimeout(() => {
    console.log(e.target)  // event 对象已被回收，target 为 null
  }, 1000)
}}

// ✅ 正确：异步场景保存需要的属性
onClick={(e) => {
  const target = e.target
  setTimeout(() => {
    console.log(target)
  }, 1000)
}}
\`\`\`

> React 17+ 中对象池已被移除（因性能问题），但仍建议遵循最佳实践。

### 3. 阻止冒泡的双重性

\`\`\`jsx
// 阻止 React 合成事件的冒泡
onClick={(e) => {
  e.stopPropagation()  // 阻止 React 层继续冒泡
}}
\`\`\`

如果要阻止**原生事件**冒泡（例如第三方库在元素上绑了原生事件）：
\`\`\`jsx
// React 17+ 用 onEvent 绑定原生事件（布尔前缀）
<div onMouseDownCapture={...} />
// 或使用 e.nativeEvent.stopPropagation()
\`\`\`

### 4. 事件类型扩展

SyntheticEvent 支持跨浏览器的统一事件接口，还扩展了 \`nativeEvent\` 属性以访问原生事件。

## React 17+ 事件绑定变更

- React 17 之前：事件绑定在 \`document\` 上。
- React 17+：事件绑定到 React 应用的**根 DOM 容器**上（\`root.render()\` 的容器）。
- 多个 React 应用可共存，互不干扰。

## 常见事件对比

- \`onClick\` → 原生 \`click\`
- \`onChange\` → React 对 \`input\`/SELECT/TEXTAREA 的 change 事件封装（含 \`input\`、\`change\`、\`blur\` 的组合）
- \`onFocus\` / \`onBlur\` → 原生 \`focusin\` / \`focusout\`（支持冒泡）
- \`onKeyDown\` / \`onKeyUp\` → 原生 \`keydown\` / \`keyup\`

## 总结

合成事件是 React 为了**跨浏览器兼容、性能优化、统一事件管理**而设计的抽象层，对开发者透明，使用方式与原生事件类似，但需注意对象池、冒泡模型等差异。`
  },
  {
    id: 'react-018',
    category: 'react',
    title: 'React 的虚拟 DOM Diff 算法？',
    difficulty: '困难',
    tags: ["虚拟DOM","Diff算法","Reconciliation"],
    answer: `## 什么是虚拟 DOM

虚拟 DOM（Virtual DOM）是真实 DOM 的 JavaScript 对象表示，包含元素类型、属性、子节点等信息。当组件 state/props 变化时，React 会：

1. 重新执行组件函数，生成新的虚拟 DOM 树。
2. 通过 Diff 算法对比新旧两棵树的差异。
3. 将差异批量更新到真实 DOM。

## 为什么用虚拟 DOM

- **跨平台**：虚拟 DOM 是 JS 对象，可在非浏览器环境运行（React Native、SSR）。
- **批量更新**：可合并多次状态更新，减少 DOM 操作。
- **声明式**：开发者只需关心"目标状态"，Diff 自动计算最小变更。

## Diff 算法核心策略

React 不做最优 Diff（O(n³)），而是基于以下假设做**高效启发式 Diff**（O(n)）：

### 1. 不同类型的节点 → 直接替换

\`\`\`jsx
// 旧：<div />
// 新：<span />
// 结果：卸载 div，创建 span
\`\`\`

- 不同类型的 DOM 元素（div → span）。
- 不同类型的组件（User → Admin）。
- 直接销毁旧树、创建新树。

### 2. 同类型节点 → 复用 + 属性更新

\`\`\`jsx
// 旧：<div className="a" title="x" />
// 新：<div className="b" title="x" />
// 结果：复用 div，只更新 className
\`\`\`

- 同类型 DOM：复用 DOM 元素，对比属性差异。
- 同类型组件：保留组件实例/props，递归 Diff 子树。

### 3. 子节点列表 Diff → 用 key 优化

对于列表 Diff，React 用 **key** 辅助识别节点：

\`\`\`jsx
// 旧：[A, B, C]
// 新：[B, A, C]
// 有 key：只交换 A 和 B
// 无 key：逐个对比，可能导致错误复用
\`\`\`

#### 没有 key 时的 Diff

React 按位置逐个对比（头部插入简单，尾部插入需要重新 Diff 所有）。

#### 有 key 时的 Diff（React 17+ 双端 Diff）

1. **头部同节点**：从左往右，key 相同则移动指针。
2. **尾部同节点**：从右往左，key 相同则移动指针。
3. **中间节点**：构建剩余节点的 Map，用 \`lastIndex\` 记录已处理节点的最大索引，判断是否需要移动。

#### key 的选择

- 用**唯一且稳定的 ID**（如数据库 id）。
- 不要用数组下标（列表变动时会导致错误复用，触发不必要的重渲染）。

## Fiber 架构对 Diff 的影响

React 16+ 的 Fiber 架构把 Diff（Reconciliation）拆成可中断的单元：

- **协调阶段（Reconciliation）**：可中断、可恢复。遍历 Fiber 树计算差异。
- **提交阶段（Commit）**：不可中断。将差异提交到 DOM（insert/update/delete）。

### 双缓存技术

React 同时维护两棵树：
- **current 树**：当前屏幕显示的 Fiber 树。
- **workInProgress 树**：正在构建的新 Fiber 树。

构建完成后通过 \`alternate\` 指针交换，实现快速切换。

## 优化 Diff 的策略

1. **合理使用 key**：避免用 index 作 key。
2. **React.memo**：对组件进行浅比较，props 不变时跳过渲染。
3. **useMemo / useCallback**：缓存计算值和函数引用。
4. **虚拟列表**：大数据量只渲染可视区域的 DOM。
5. **减少嵌套层级**：扁平化组件结构，减少 Diff 深度。

## 与 Vue Diff 的对比

| 方面 | React | Vue3 |
| --- | --- | --- |
| 同层对比 | 类型相同即复用 | 类型相同即复用 |
| 列表 Diff | 双端 Diff（key） | 双端 Diff + 最长递增子序列 |
| 静态优化 | 用户手动 memo | 编译器自动 patchFlag / hoistStatic |
| 中断恢复 | Fiber 时间切片 | 无（同步） |

## 总结

React Diff 基于**同类型复用**和**key 辅助列表匹配**两大策略，实现 O(n) 的高效比对。开发者通过合理的 key、memo、拆分组件等方式可进一步优化性能。`
  },
  {
    id: 'react-019',
    category: 'react',
    title: 'React 的 Context API 是什么？如何使用？',
    difficulty: '中等',
    tags: ["Context","跨层级通信","全局状态"],
    answer: `## 什么是 Context

Context 提供了一种跨层级组件共享数据的方式，而不必逐层传递 props（"prop drilling"）。

## 基本用法

### 1. 创建 Context

\`\`\`jsx
import { createContext } from 'react'

const ThemeContext = createContext('light')
// 默认值 'light'，仅在没有 Provider 时使用
\`\`\`

### 2. 提供 Context

\`\`\`jsx
function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  )
}
\`\`\`

### 3. 消费 Context

\`\`\`jsx
// 方式一：useHook（推荐）
function Button() {
  const { theme } = useContext(ThemeContext)
  return <button>{theme}</button>
}

// 方式二：Consumer 组件
function Button() {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => <button>{theme}</button>}
    </ThemeContext.Consumer>
  )
}

// 方式三：contextType（类组件）
class Button extends React.Component {
  static contextType = ThemeContext
  render() {
    return <button>{this.context.theme}</button>
  }
}
\`\`\`

## 多 Context

可以在组件中使用多个 Context：

\`\`\`jsx
function App() {
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <Page />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}
\`\`\`

## 性能问题

Context 的 value 变化会导致**所有消费组件重新渲染**，即使它们用了 React.memo。

### 优化方案

#### 1. 拆分 Context

把大 Context 拆成多个小 Context，按消费频率分离：

\`\`\`jsx
const ThemeContext = createContext()  // 低频变化
const UserContext = createContext()  // 高频变化
\`\`\`

#### 2. 使用 useMemo 缓存 value

\`\`\`jsx
const value = useMemo(() => ({ theme, setTheme }), [theme])
<ThemeContext.Provider value={value}>
\`\`\`

#### 3. 使用 useReducer + Context

\`\`\`jsx
const [state, dispatch] = useReducer(reducer, initial)
const value = useMemo(() => ({ state, dispatch }), [state])
<StoreContext.Provider value={value}>
\`\`\`

#### 4. 使用第三方库

- **Zustand**：基于原生 React，轻量，API 极简。
- **Jotai**：原子化状态管理，自动优化重渲染。
- **Redux Toolkit**：大型应用，强约束。

## Context vs props vs 状态管理

| 方式 | 适用场景 | 性能 | 复杂度 |
| --- | --- | --- | --- |
| props | 父子组件通信 | 最优 | 低 |
| Context | 跨层级低频数据 | 一般 | 低 |
| Redux/Zustand | 全局高频状态 | 最优 | 中 |
| React Query | 服务端数据 | 自动优化 | 低 |

## 典型场景

- 主题（深色/浅色模式）
- 当前语言（国际化）
- 认证信息（用户 ID、角色）
- 路由信息
- UI 配置（尺寸、布局）

## 注意事项

- Context 值应尽量稳定（引用类型用 useMemo/useCallback 包裹）。
- 不要滥用 Context，每个 Context 都会让子树订阅。
- 复杂状态（异步、持久化、devtools）应使用专业状态管理库。
- Server Components 中 Context 只能在 Client Component 中使用。`
  },
  {
    id: 'react-020',
    category: 'react',
    title: 'React 的 useMemo / useCallback / memo 有什么区别？',
    difficulty: '中等',
    tags: ["useMemo","useCallback","memo","性能优化"],
    answer: `## 三个 API 的核心区别

| Hook | 缓存内容 | 解决的问题 |
| --- | --- | --- |
| \`React.memo\` | 整个组件的渲染结果 | 避免组件不必要的重渲染 |
| \`useMemo\` | 计算值 | 避免昂贵计算重复执行 |
| \`useCallback\` | 函数引用 | 避免函数引用变化导致子组件重渲染 |

## React.memo

\`\`\`jsx
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  return <div>{data.map(d => d.name).join(', ')}</div>
})
\`\`\`

- 对 props 做**浅比较**，props 不变时跳过渲染。
- 可自定义比较函数：\`React.memo(Component, areEqual)\`。
- **不适用于**：组件渲染非常快（memo 本身有比较开销）、props 总是变化。

### 自定义比较

\`\`\`jsx
const UserList = React.memo(
  function UserList({ users }) { ... },
  (prevProps, nextProps) => prevProps.users.length === nextProps.users.length
)
\`\`\`

## useMemo

\`\`\`jsx
function Dashboard({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value)
  }, [items])  // 依赖变化时重新计算
  return <List items={sortedItems} />
}
\`\`\`

- 缓存**计算结果**（值）。
- 依赖数组为空 \`[]\` → 只计算一次。
- 依赖变化 → 重新计算。
- 常用于：昂贵计算、避免子组件重渲染（作为 Context/Redux value）。

### 典型场景

\`\`\`jsx
// 1. 昂贵计算
const filteredList = useMemo(() => expensiveFilter(list), [list])

// 2. Context value 稳定
const value = useMemo(() => ({ user, setUser }), [user])

// 3. 避免子组件重渲染（配合 memo）
<Child config={useMemo(() => ({ theme }), [theme])} />
\`\`\`

## useCallback

\`\`\`jsx
function Parent() {
  const handleClick = useCallback(() => {
    doSomething(id)
  }, [id])  // 依赖变化时重建函数
  return <Child onClick={handleClick} />
}
\`\`\`

- 缓存**函数引用**（而不是函数结果）。
- \`useCallback(fn, deps)\` ≡ \`useMemo(() => fn, deps)\`。
- 仅在函数需要传递给子组件、且子组件用了 \`React.memo\` 时才有意义。

### useCallback vs useMemo

\`\`\`jsx
// 两者等价：
const fn1 = useCallback(() => doSomething(a), [a])
const fn2 = useMemo(() => () => doSomething(a), [a])
\`\`\`

## 何时使用

### 应该使用

1. **子组件重渲染频繁**：父组件每次渲染都导致子组件（用了 memo）不必要渲染。
2. **计算开销大**：排序、过滤、复杂转换。
3. **Context value 不稳定**：导致所有消费者重渲染。
4. **自定义 Hook 返回值**：避免每次调用都返回新引用。

### 不应使用

1. 简单的计算 / 直接使用：\`const value = a + b\` 不需要 useMemo。
2. 内联回调：\`onClick={() => setCount(c => c + 1)}\` 简短且不传给 memo 子组件。
3. 依赖总是变化：useMemo 不如直接计算。

## 常见陷阱

### 1. 依赖数组遗漏

\`\`\`jsx
const result = useMemo(() => a + b, [a])  // 缺 b
// 当 b 变化但 a 不变时，result 不会更新
\`\`\`

可用 ESLint 插件 \`eslint-plugin-react-hooks\` 的 \`exhaustive-deps\` 规则自动检查。

### 2. 过度优化

\`\`\`jsx
// ❌ 简单计算不需要
const x = useMemo(() => 1 + 1, [])
\`\`\`

### 3. 对象/数组的稳定引用

\`\`\`jsx
const config = useMemo(() => ({ theme }), [theme])  // ✅
const config = { theme }  // ❌ 每次渲染都是新对象
\`\`\`

## 总结口诀

- **memo**：缓存组件渲染 → 避免子组件重渲染。
- **useMemo**：缓存计算值 → 避免昂贵计算、稳定引用。
- **useCallback**：缓存函数引用 → 避免子组件重渲染。

三者的核心都是**引用稳定性**——在引用不变时跳过计算或渲染。`
  },
  {
    id: 'react-021',
    category: 'react',
    title: 'React 的错误边界（Error Boundaries）是什么？',
    difficulty: '中等',
    tags: ["ErrorBoundary","错误处理","React"],
    answer: `## 什么是错误边界

错误边界是 React 提供的一种机制，用于**捕获组件树中渲染期间的 JavaScript 错误**，防止整个应用崩溃，并显示降级 UI。

## 基本用法

\`\`\`jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // 可以在这里上报错误
    console.error('Error caught:', error, errorInfo)
    // reportError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} />
    }
    return this.props.children
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
\`\`\`

## 两个关键生命周期

### getDerivedStateFromError

- 静态方法，在渲染阶段被调用。
- 用于**更新 state**，触发降级 UI。
- 必须返回一个对象（state 更新），或返回 \`null\`。

### componentDidCatch

- 实例方法，在提交阶段被调用。
- 用于**副作用**（日志上报、通知等）。
- 不应在此调用 setState（会触发额外渲染，应使用 getDerivedStateFromError）。

## 错误边界能捕获的错误

- ✅ 子组件渲染期间的错误。
- ✅ 子组件生命周期方法中的错误。
- ✅ 子组件构造函数中的错误。

## 错误边界不能捕获的错误

- ❌ 自身渲染的错误（只能捕获子组件错误）。
- ❌ 事件处理函数中的错误（\`onClick\` 等，不在渲染阶段）。
- ❌ 异步代码中的错误（\`setTimeout\`、Promise）。
- ❌ 服务端渲染错误。
- ❌ 非 React 代码错误（如第三方库错误）。

## 组合多个错误边界

\`\`\`jsx
function App() {
  return (
    <GlobalErrorBoundary>
      <Layout>
        <ErrorBoundary fallback={<ProfileError />}>
          <Profile />
        </ErrorBoundary>
        <ErrorBoundary fallback={<FeedError />}>
          <Feed />
        </ErrorBoundary>
      </Layout>
    </GlobalErrorBoundary>
  )
}
\`\`\`

- 全局错误边界：最外层，防止整个应用崩溃。
- 局部错误边界：关键区域独立降级，不影响其他功能。

## 函数组件的错误边界

React 官方只支持**类组件**定义错误边界。函数组件需要用第三方库：

\`\`\`bash
npm install react-error-boundary
\`\`\`

\`\`\`jsx
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>出错了：{error.message}</p>
      <button onClick={resetErrorBoundary}>重试</button>
    </div>
  )
}

<ErrorBoundary FallbackComponent={ErrorFallback} onError={reportError}>
  <MyComponent />
</ErrorBoundary>
\`\`\`

## 使用建议

1. **分层设置**：全局 + 局部，关键页面单独包一层。
2. **上报错误**：配合 Sentry、LogRocket 等监控系统。
3. **友好降级**：fallback UI 应提供重试、返回首页等操作。
4. **不要过度使用**：错误边界有性能开销，只在需要的地方使用。
5. **主动处理**：在容易出错的地方（API 调用、复杂计算）主动 try-catch，不要完全依赖错误边界。

## 与 React 18 的关系

React 18 的并发模式下，错误边界在组件树重新渲染时仍能正确工作。但在 Transition 中，错误边界的行为可能与预期不同——Transition 中的错误不会立刻触发边界，而是在 Transition 完成后触发。`
  },
  {
    id: 'react-022',
    category: 'react',
    title: 'React 的 RSC、Next.js App Router 与传统 SSR/SSG 的区别？',
    difficulty: '困难',
    tags: ["RSC","SSR","SSG","Next.js","App Router"],
    answer: `## 渲染方式全景

| 方式 | 运行位置 | 数据获取 | 何时执行 |
| --- | --- | --- | --- |
| CSR | 浏览器 | useEffect | 客户端 |
| SSR | 服务器 | getServerSideProps | 每次请求 |
| SSG | 构建时 | getStaticProps | 构建时 |
| ISR | 构建 + 定时 | getStaticProps + revalidate | 构建后定时重生成 |
| RSC | 服务器 | 直接 await | 每次请求 |
| RSC + Streaming | 服务器 | 流式 | 每次请求 |

## 传统 SSR（Next.js Pages Router）

\`\`\`jsx
// pages/profile.js
export async function getServerSideProps(context) {
  const user = await fetchUser(context.params.id)
  return { props: { user } }
}

export default function Profile({ user }) {
  return <div>{user.name}</div>
}
\`\`\`

- 服务器执行 \`getServerSideProps\`，获取数据。
- 服务器渲染完整 HTML（包括组件）。
- 客户端 hydrate，组件逻辑全部下载执行。
- **组件代码会被发送到客户端**，即使它只在服务端用到。

## SSG（静态生成）

\`\`\`jsx
export async function getStaticProps() {
  const data = await fetchData()
  return { props: { data }, revalidate: 60 }  // ISR：60秒重新生成
}
\`\`\`

- 构建时生成 HTML，可配合 ISR 定时重生成。
- 纯静态，CDN 分发，性能最佳。
- 适合内容基本不变的页面（博客、文档）。

## RSC（React Server Components）

RSC 解决了传统 SSR 的几个核心痛点：

### 1. 组件代码不下发到客户端

\`\`\`jsx
// app/page.js（默认 Server Component）
async function Page() {
  // 直接访问数据库，不进客户端 bundle
  const posts = await db.posts.findMany()
  return <PostList posts={posts} />
}
\`\`\`

- 大型库（marked、moment、图表库）只在服务端用，不打包到客户端。

### 2. 无客户端 JS 的首屏

\`\`\`html
<!-- 首屏 HTML 直接来自服务端，不需要等待 JS 加载 -->
<main>
  <h1>Hello</h1>
  <article>...</article>
</main>
\`\`\`

### 3. 减少 Waterfall

传统 SSR：
\`\`\`
请求 → 服务端渲染 → 客户端 hydrate → useEffect fetch → 渲染
\`\`\`

RSC：
\`\`\`
请求 → 服务端直接 await 数据 → 流式推送 → 客户端逐步展示
\`\`\`

### 4. 混合 Server + Client

\`\`\`jsx
// Server Component（默认）
import Counter from './Counter'  // Client Component

async function Page() {
  const data = await fetchData()  // 服务端获取
  return (
    <div>
      <ServerData list={data} />  // 纯服务端组件
      <Counter />                  // 客户端组件，可交互
    </div>
  )
}
\`\`\`

## Next.js App Router 核心概念

### 文件约定路由

\`\`\`
app/
  layout.js    → 根布局（所有页面共享）
  page.js      → 首页
  about/
    page.js    → /about 页面
  blog/
    [id]/
      page.js  → /blog/:id 动态路由
\`\`\`

### 嵌套布局

\`\`\`jsx
// app/blog/layout.js
export default function BlogLayout({ children }) {
  return (
    <div>
      <h1>Blog</h1>
      {children}
    </div>
  )
}
\`\`\`

### Client Component

\`\`\`jsx
'use client'  // 声明为 Client Component

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
\`\`\`

### 数据获取

\`\`\`jsx
// Server Component 中直接 fetch
async function Page() {
  const res = await fetch('https://api.example.com/data', { cache: 'no-store' })
  const data = await res.json()
  return <ListView data={data} />
}
\`\`\`

### Suspense + Streaming

\`\`\`jsx
async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  )
}
\`\`\`

- 服务端流式输出，首屏更快。
- 客户端逐步 hydrate，用户更早看到内容。

## 渲染模式选择

| 场景 | 推荐 |
| --- | --- |
| 静态内容（博客、文档） | SSG / ISR |
| 个性化内容（首页、仪表板） | SSR + RSC |
| 纯交互（表单、编辑器） | CSR |
| 重数据轻交互（商品列表） | RSC |
| 重交互轻数据（编辑器） | CSR |

## RSC 的限制

- 不能用 \`useState\`、\`useEffect\`、\`useRef\`。
- 不能绑定事件（\`onClick\` 等）。
- 不能用 Context（服务端没有 Context 概念）。
- 不能直接引用浏览器 API（\`window\`、\`document\`）。
- 只能在 Server Component 中 \`import\` Client Component，反之不行。

## 与传统 SSR 的迁移成本

- Pages Router → App Router 需要重构路由、Layout、数据获取方式。
- Server Component 与 Client Component 的边界需要清晰划分。
- 第三方库需要检查是否兼容 RSC（不能在 Server Component 中使用仅客户端的 API）。

## 总结

RSC + App Router 是 React/Next.js 的未来方向，通过**服务端/客户端组件边界**、**流式渲染**、**零体积数据获取**，解决了传统 SSR 的包体积、瀑布流、首屏慢等核心问题。`
  },
  {
    id: 'react-023',
    category: 'react',
    title: 'React 的 forwardRef 与 useImperativeHandle？',
    difficulty: '中等',
    tags: ['forwardRef', 'useImperativeHandle', 'ref', '命令式'],
    answer: `## 为什么需要 forwardRef

函数组件默认**没有实例**，父组件直接用 \`ref\` 绑函数组件会报错。\`forwardRef\` 让函数组件能**接收 ref 并把它转发到内部 DOM 或子组件**。

## 基本用法

\`\`\`jsx
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} {...props} />
})

// 父组件
function App() {
  const inputRef = useRef()
  useEffect(() => inputRef.current.focus(), [])
  return <MyInput ref={inputRef} />
}
\`\`\`

- forwardRef 把第二个参数 \`ref\` 透传给内部真实 DOM。
- \`MyInput\` 在 DevTools 中显示的名字取自函数名（不要用匿名函数，否则显示 "ForwardRef"）。

## useImperativeHandle：暴露自定义方法

直接把 DOM ref 暴露给父组件会让父组件可以任意操作内部 DOM（破坏封装）。\`useImperativeHandle\` 让你**自定义暴露给父组件的命令式接口**，只暴露必要的方法。

\`\`\`jsx
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef()

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' },
    getValue: () => inputRef.current.value
  }))

  return <input ref={inputRef} {...props} />
})

// 父组件只能调用暴露的方法
inputRef.current.focus()    // ✅
inputRef.current.clear()    // ✅
inputRef.current.value      // ❌ undefined，真实 DOM 没暴露
\`\`\`

## 为什么推荐用 useImperativeHandle

- **封装性**：父组件拿不到完整 DOM，避免被依赖私有结构。
- **稳定 API**：内部 DOM 重构时只要方法签名不变，父组件不感知。
- **跨框架 / 第三方库**：自定义组件要对外提供方法时（视频播放器暴露 play/pause、表单暴露 validate/submit）。

## 真实场景

### 1. 弹窗（Modal）暴露 open/close

\`\`\`jsx
const Modal = forwardRef(function Modal(props, ref) {
  const [open, setOpen] = useState(false)
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false)
  }))
  return open && <div className="modal">{props.children}</div>
})

// 父：modalRef.current.open()
\`\`\`

### 2. 表单组件暴露 validate/submit

### 3. 视频/音频播放器暴露 play/pause/seek

## 陷阱

1. **不要滥用命令式 API**：大多数情况下用 props/状态驱动更 React（声明式）。例如不要用 ref 调用 "setText"，而用 value prop 控制。
2. **ref.current 可能为 null**：组件挂载前或卸载后访问，需要空判断。
3. **在 Server Component 中不能用 ref**（ref 是客户端概念），forwardRef/useImperativeHandle 只能在 Client Component 使用（加 \`'use client'\`）。
4. **函数组件名**：forwardRef 包裹的函数给个具名，DevTools 更好调试。

## forwardRef vs 自定义 ref prop

有时不用 forwardRef，自定义一个 prop 叫 \`inputRef\` 也行：

\`\`\`jsx
<MyInput inputRef={inputRef} />
\`\`\`

但 forwardRef 是 React 约定，和 \`<input ref>\` 使用方式一致，第三方库更统一。能用 forwardRef 就别自定义 ref 名字。

## 总结

| API | 作用 | 场景 |
| --- | --- | --- |
| forwardRef | 让函数组件能接收 ref 并转发 | 需要穿透 ref 到内部 DOM/子组件 |
| useImperativeHandle | 自定义暴露给 ref 的对象 | 限制父组件可调用的命令式接口，封装内部 |

- 设计思想：暴露最小必要接口，不要把完整 DOM 丢出去。`
  },
  {
    id: 'react-024',
    category: 'react',
    title: 'React 的 useEffect、useLayoutEffect 与执行时机？',
    difficulty: '困难',
    tags: ['useEffect', 'useLayoutEffect', '生命周期', '执行时机'],
    answer: `## React 18 中的两个阶段

React 渲染分两阶段：

1. **Render 阶段（可中断）**：执行组件函数，计算新的 UI 描述（纯计算，不做副作用）。
2. **Commit 阶段（不可中断）**：把变化真正写入 DOM，然后依次执行布局副作用 → 浏览器绘制 → 普通副作用。

Commit 阶段又分：

- **BeforeMutation**：DOM 变更前（read 旧 DOM 如高度）。
- **Mutation**：实际 DOM 增删改。
- **Layout**：DOM 已变但浏览器还没绘制 → 同步执行 useLayoutEffect。
- **浏览器 Paint**：绘制新 UI。
- **Passive Effects**：异步执行 useEffect。

## useEffect：异步、绘制后

\`\`\`jsx
useEffect(() => {
  // DOM 已经更新到页面上了，用户能看到
  document.title = \`Count: \${count}\`
  return () => {}
}, [count])
\`\`\`

- **执行时机**：浏览器完成绘制之后的微任务/宏任务（React 会用 postMessage/scheduler 延迟一点），**不会阻塞绘制**。
- **适合场景**：数据请求、订阅、日志上报、非关键 DOM 操作。绝大多数副作用用它。
- **清理函数**：下次 effect 执行前 + 组件卸载时调用（异步执行，不阻塞下次 layout）。

## useLayoutEffect：同步、绘制前

\`\`\`jsx
useLayoutEffect(() => {
  // DOM 已更新，但浏览器还没绘制，用户看不到中间态
  const h = ref.current.clientHeight
  ref.current.style.marginTop = \`\${-h / 2}px\`  // 居中
  return () => {}
}, [deps])
\`\`\`

- **执行时机**：DOM mutation 完成后、浏览器 Paint 之前**同步执行**（和 componentDidMount/componentDidUpdate 同时机）。会阻塞绘制，别做耗时操作。
- **适合场景**：需要测量 DOM 并立即修改样式以**避免闪烁**（tooltip 定位、弹层居中、滚动条高度补偿、把元素挪到可视区域等）。

## 执行顺序示例

\`\`\`jsx
function Demo() {
  console.log('render')

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    return () => console.log('cleanup: useLayoutEffect')
  })

  useEffect(() => {
    console.log('useEffect')
    return () => console.log('cleanup: useEffect')
  })

  return null
}

// 首次挂载输出：
// render → useLayoutEffect → (浏览器绘制) → useEffect

// 更新：
// render → cleanup: useLayoutEffect → useLayoutEffect → (浏览器绘制) → cleanup: useEffect → useEffect

// 卸载：
// cleanup: useLayoutEffect → cleanup: useEffect
\`\`\`

## 典型对比

### 场景 1：测量并设置位置（避免闪烁）

用 **useLayoutEffect**。

用户打开 tooltip，先挂载到默认位置 → 测量实际宽高 → 调整到目标位置。如果用 useEffect，用户会短暂看到 tooltip 在错误位置"跳一下"。

### 场景 2：请求数据、改标题

用 **useEffect**，延迟执行也不影响视觉，不阻塞绘制。

### 场景 3：同步订阅外部 store（Zustand/Redux 内部）

用 **useSyncExternalStore**（React 18 新增，专门处理外部订阅，内部在 layout 阶段订阅）。

## 常见坑

### 1. useEffect 里 set DOM 样式导致闪烁

改为 useLayoutEffect。

### 2. SSR 警告

服务端没有 DOM，useLayoutEffect 在 SSR 时会警告（它只在客户端执行）。若组件可能被 SSR，用：

\`\`\`jsx
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
\`\`\`

或把需要 layout effect 的组件标记成 Client Component。

### 3. useLayoutEffect 里写死循环/重计算

会阻塞浏览器绘制，导致**页面卡住**，尽量保持轻量（测量 + 简单设置）。

### 4. useEffect 依赖写不全

形成 stale closure，旧值被读取。用 eslint exhaustive-deps。

## 与 React 18 并发 / Transition 的关系

- 在 Transition 中，useEffect 的执行会被推迟到 Transition 完成后；useLayoutEffect 仍在每次 commit 后同步执行。
- useLayoutEffect 一定阻塞绘制，所以 Transition 里的 layout effect 也会拖慢——尽量把样式计算移到渲染或 useEffect。

## 选型小抄

| 需求 | 选哪个 |
| --- | --- |
| 请求 / 订阅 / 非视觉副作用 | useEffect ✅ |
| DOM 测量 + 立即改样式防闪烁 | useLayoutEffect ✅ |
| 第三方同步 store 订阅 | useSyncExternalStore ✅ |
| 首屏前需完成的 DOM 调整 | useLayoutEffect ✅ |
| 能延后到用户看到 UI 之后 | useEffect ✅ |

**经验**：默认用 useEffect；出了闪烁/位置跳动再换 useLayoutEffect，并确保回调函数足够轻。`
  },
  {
    id: 'react-025',
    category: 'react',
    title: 'React 渲染性能优化：memo / useMemo / useCallback / key？',
    difficulty: '中等',
    tags: ['memo', 'useMemo', 'useCallback', '性能优化', '重渲染'],
    answer: `## 重渲染的根因

React 默认：**父组件重新渲染，所有子组件递归重渲染**（即使子组件 props 没变）。优化的本质就是：**让"不需要重渲染的组件"跳过渲染**。

## 工具 1：React.memo（组件级跳过）

对组件 props 做浅比较，props 不变则跳过重渲染。

\`\`\`jsx
const Child = memo(function Child({ name, onClick }) {
  console.log('Child render')
  return <button onClick={onClick}>{name}</button>
})
\`\`\`

- **浅比较**：对 props 逐个用 \`Object.is\` 比较。原始类型按值，对象/数组/函数按引用。
- **传了新引用**（每次渲染新建的对象/函数），memo 失效。
- **不要滥用**：浅比较本身也有开销，简单组件 memo 了反而更慢。

自定义比较函数（谨慎用，比较逻辑本身可能比渲染更贵）：

\`\`\`jsx
memo(Chart, (prevProps, nextProps) =>
  prevProps.data === nextProps.data && prevProps.config.id === nextProps.config.id
)
\`\`\`

## 工具 2：useCallback（稳定函数引用）

返回一个稳定引用的函数，依赖不变则引用不变。通常配合 memo 传 props 用。

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0)
  // ❌ 每次渲染新建函数，Child memo 失效
  const handleClick1 = () => setCount(c => c + 1)
  // ✅ 引用稳定
  const handleClick2 = useCallback(() => setCount(c => c + 1), [])

  return <Child onClick={handleClick2} />
}
const Child = memo(({ onClick }) => <button onClick={onClick}>go</button>)
\`\`\`

> useCallback 不是"缓存避免函数执行"，是**稳定引用**便于 memo 比较。单独用它没有收益，必须配合 memo / useMemo 的下游消费。

## 工具 3：useMemo（缓存值 / 昂贵计算）

两种用法：

### A. 缓存昂贵计算结果

\`\`\`jsx
const sorted = useMemo(
  () => list.sort(/* 复杂排序 O(n log n) */),
  [list]
)
\`\`\`

避免每次渲染都重算。

### B. 稳定对象/数组引用

\`\`\`jsx
// ❌ 每次都是新对象，子组件 memo 失效
const style = { width: \`\${w}px\`, height: \`\${h}px\` }

// ✅ 依赖不变时引用稳定
const style = useMemo(() => ({ width: \`\${w}px\`, height: \`\${h}px\` }), [w, h])

return <ExpensiveChart style={style} />
\`\`\`

## 工具 4：正确的 key（列表 Diff）

列表中 **key 稳定且唯一**，避免 React 错误复用节点，减少不必要的 DOM 操作。

\`\`\`jsx
// ❌ 用 index：列表增删时顺序变，key 错位
items.map((item, i) => <Item key={i} data={item} />)

// ✅ 用业务 ID
items.map(item => <Item key={item.id} data={item} />)
\`\`\`

## 组合使用示例

\`\`\`jsx
function TodoApp() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')

  // 1. 过滤：只在 todos/filter 变时重算
  const visible = useMemo(() => {
    switch (filter) {
      case 'done': return todos.filter(t => t.done)
      case 'active': return todos.filter(t => !t.done)
      default: return todos
    }
  }, [todos, filter])

  // 2. 添加：引用稳定
  const handleAdd = useCallback((text) => {
    setTodos(prev => [...prev, { id: uid(), text, done: false }])
  }, [])

  // 3. 切换：引用稳定
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  return (
    <>
      <TodoList items={visible} onToggle={handleToggle} />
      <AddTodo onAdd={handleAdd} />
    </>
  )
}

// 4. 子组件 memo
const TodoList = memo(function TodoList({ items, onToggle }) {
  return <ul>{items.map(t => <TodoItem key={t.id} todo={t} onToggle={onToggle} />)}</ul>
})
\`\`\`

## 常见误区

### ❌ 过度缓存

\`\`\`jsx
// 没必要：a+b 几纳秒，useMemo 本身有开销
const sum = useMemo(() => a + b, [a, b])
\`\`\`

### ❌ memo 了子组件但没稳定函数/对象引用

只包 memo 不配合 useCallback/useMemo，90% 的情况下 memo 白包（对象/函数每次是新引用）。

### ❌ 以为 memo 能阻止 Context 变化的重渲染

不能。Context 变了消费组件必然重渲染，即使 memo 了也没用（Context 不经过 props）。Context 的优化看拆分 Context 或用 memo + selector。

### ❌ 用 key={Math.random()} 让组件"重置"

看似方便，但每次渲染都卸载+挂载子组件，性能差。正确做法：用真实业务 ID；要重置时把 key 设成已知标识（如 \`key={userId}\`，用户切换就重建）。

## 诊断工具

- React DevTools Profiler：查看哪些组件重渲染、耗时多久。
- "Highlight updates when components render"：开启后重渲染的组件会高亮，一眼看到多余渲染。
- \`<React.StrictMode>\`：开发时双调用，帮你发现 effect 没清理、纯函数不纯等问题。

## 优先级（性价比从高到低）

1. **正确的 key** → 零成本，列表必备。
2. **拆分大组件** → 大组件变小组件，state 局部化，自然减少重渲染范围。
3. **状态下放到需要它的子组件** → 避免"父组件 state 导致全树重渲染"。
4. **memo + useCallback + useMemo（配套）** → 确实有多余渲染的场景再上。
5. **虚拟列表、懒加载** → 超大数据量时。

> 核心思想：先架构优化（拆分、下沉），再局部缓存优化。没 profiler 证据就不要加缓存。`
  },
  {
    id: 'react-026',
    category: 'react',
    title: 'React 18 的自动批处理、Transitions 与 Suspense 新能力？',
    difficulty: '困难',
    tags: ['React 18', '批处理', 'Transitions', 'Suspense', '并发'],
    answer: `## 升级入口：createRoot

React 18 要求用 \`createRoot\` 替换旧的 \`ReactDOM.render\`，才会启用并发特性。

\`\`\`jsx
import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')).render(<App />)
\`\`\`

## 一、自动批处理（Automatic Batching）

合并**同一事件循环内**的多次 setState，只触发一次重渲染。

### React 17 的批处理：只在 React 事件中

\`\`\`jsx
function handleClick() {
  setA(1)
  setB(2)
  // 合一次渲染 ✅（React 事件处理函数内）
}

setTimeout(() => {
  setA(1)
  setB(2)
  // 渲染两次 ❌（setTimeout 里 React 管不到）
}, 0)
\`\`\`

### React 18 的批处理：自动合并 **任何地方** 的更新

Promise、setTimeout、原生事件、微任务等全部自动批处理。

\`\`\`jsx
setTimeout(() => {
  setA(1)
  setB(2)
  // 合一次渲染 ✅（React 18 自动）
})

fetch('/api').then(() => {
  setData(d)
  setLoading(false)
  // 合一次渲染 ✅
})
\`\`\`

原理：所有 setState 都走统一的调度器，调度器用微任务合并。

> 极少数场景需要同步更新（立刻读 DOM），可用 \`flushSync(cb)\` 强制把 cb 里的更新同步刷新：
>
> \`\`\`jsx
> flushSync(() => setCount(c + 1))
> // 这里已经是最新 DOM 了
> \`\`\`

## 二、Transitions：区分紧急/非紧急更新

把更新分成两类：

- **紧急更新（Urgent）**：输入、点击、拖拽等需要立即响应。
- **过渡更新（Transition）**：列表筛选、路由切换、Tab 切换等可以延迟一点、允许中间显示旧状态。

### useTransition

\`\`\`jsx
function Search() {
  const [query, setQuery] = useState('')
  const [list, setList] = useState([])
  const [isPending, startTransition] = useTransition()

  const onChange = (e) => {
    // 紧急：输入框立刻显示用户输入
    setQuery(e.target.value)
    // 过渡：大列表筛选可以慢一点
    startTransition(() => {
      setList(filterHugeList(e.target.value))
    })
  }

  return (
    <>
      <input value={query} onChange={onChange} />
      {isPending && <Spinner />}
      <List data={list} />
    </>
  )
}
\`\`\`

- \`isPending\`：过渡中，可展示"加载中"或保留旧 UI（不阻塞输入）。
- 过渡中的更新可被**中断**：用户继续输入，上一次筛选还没算完就废弃，只算最新的。
- 可嵌套：startTransition 里再调 startTransition，后者继承低优先级。

### useDeferredValue

被动版 useTransition。当你**只能拿到值、不能控制 setter**（第三方组件、Context 值）时用。

\`\`\`jsx
function Search({ query }) {
  const deferred = useDeferredValue(query)
  const items = useMemo(() => slowFilter(deferred), [deferred])
  return <List data={items} />
}
\`\`\`

等价于：值变化时，把消费该值的渲染标记为过渡。

### 选哪个

| 场景 | 用 |
| --- | --- |
| 你能控制 setState | useTransition（明确、主动） |
| 你只能拿到值（Context/props/第三方） | useDeferredValue |
| 只渲染一次的简单操作 | 直接 setState，不需要过渡 |

## 三、Suspense 能力扩展

### 1. Suspense for Data Fetching（数据加载）

组件内部通过支持 Suspense 的数据源（Relay、SWR、React Query v5）读取数据，未就绪时 Suspense 边界接管显示 fallback。

\`\`\`jsx
<Suspense fallback={<Skeleton />}>
  <ArticlePage id={123} />   {/* 内部 await 数据（Suspense-enabled） */}
</Suspense>
\`\`\`

相比 useEffect + loading：
- 声明式，不用每个组件写 loading。
- 支持嵌套 Suspense 分层 fallback。
- 配合流式 SSR 可边渲染边推。

### 2. 服务端流式 SSR + 选择性 Hydration

传统 SSR：
\`\`\`
服务端整块吐 HTML → 客户端整块 hydrate → 才能交互
\`\`\`

React 18 + Suspense SSR：
\`\`\`
服务端先吐首屏 HTML → 流式吐各个 Suspense 边界的 HTML
客户端边收边 hydrate，用户可先点已 hydrate 的区域
\`\`\`

极大改善 TTI（可交互时间）。

### 3. useTransition + Suspense 结合

\`\`\`jsx
function App() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  const switchTab = (next) => {
    startTransition(() => setTab(next))
  }

  return (
    <>
      <TabBar active={tab} onChange={switchTab} />
      {/* 切换 Tab 时保持旧 Tab UI，不显示 fallback，避免闪烁 */}
      <Suspense fallback={<BigSpinner />}>
        {tab === 'home' && <HomePage />}
        {tab === 'profile' && <ProfilePage />}
      </Suspense>
      {isPending && <MiniIndicator />}
    </>
  )
}
\`\`\`

切换时不跳 fallback，保留旧内容，等新内容就绪再切换，体验更顺滑。

## 新 Hooks 一览

| Hook | 作用 |
| --- | --- |
| useId | 生成 SSR 安全的唯一 ID（无障碍 aria-*、表单 label） |
| useTransition | 低优先级更新 |
| useDeferredValue | 延迟消费某个值 |
| useSyncExternalStore | 订阅外部同步 store（Redux/Zustand 底层都换它了） |
| useInsertionEffect | CSS-in-JS 库注入样式用（比 layout 还早，业务代码几乎不用） |

## 迁移注意

- StrictMode 开发下 mount → unmount → mount 双调用（帮你发现 effect 没清理），不要觉得是 bug。
- 第三方库需要支持 React 18（Redux 8、React Router 6.4+、MUI 5+ 等已适配）。
- useEffect 的清理函数现在**严格在下次 effect 执行前**调用，并且开发模式双调用，不要依赖它"只在卸载时跑一次"的语义。

## 总览

| 能力 | 解决的痛点 |
| --- | --- |
| 自动批处理 | Promise/setTimeout 里 setState 多次渲染 |
| useTransition/useDeferredValue | 输入/渲染冲突，列表卡顿 |
| Suspense + 流式 SSR | 白屏、TTI 慢、瀑布请求 |
| useId/useSyncExternalStore | SSR ID 不一致、外部 store tearing |

React 18 的核心主题是**并发（Concurrency）**：让渲染过程可中断、可让位，保证用户交互优先。`
  },
  {
    id: 'react-027',
    category: 'react',
    title: 'React 状态管理新趋势：Zustand、Jotai、Redux Toolkit、RTK Query？',
    difficulty: '中等',
    tags: ['Zustand', 'Jotai', 'Redux Toolkit', 'RTK Query', '状态管理'],
    answer: `## 状态管理版图的演进

| 阶段 | 代表 | 特征 |
| --- | --- | --- |
| React 内置 | useState/useReducer/Context | 轻量、无依赖、无选择器、Context 全量重渲染 |
| Redux 时代 | Redux + thunk/saga | 强约束、单向数据流、模板多、学习曲线陡 |
| 现代轻量 | Zustand / Jotai / Recoil / Valtio | 少模板、TS 友好、精准订阅、体积小 |
| 服务端状态 | React Query (TanStack Query) / SWR / RTK Query | 缓存、失效、重试、乐观更新、后台刷新 |

> **趋势**：本地状态和服务端状态分开管。本地状态用 Zustand/Jotai；服务端请求数据用 TanStack Query / RTK Query。

## 方案一：Zustand（极简 Hook Store）

\`\`\`bash
npm i zustand
\`\`\`

\`\`\`jsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCounter = create(
  persist(
    (set, get) => ({
      count: 0,
      inc: () => set(s => ({ count: s.count + 1 })),
      async load() {
        const r = await fetch('/api/count')
        set({ count: (await r.json()).value })
      }
    }),
    { name: 'counter-storage' }  // localStorage 持久化
  )
)

// 组件里按需选择，选择器不同时才重渲染
const count = useCounter(s => s.count)
const inc = useCounter(s => s.inc)
// 或直接拿整个 store（不推荐，任何字段变都会重渲染）
const store = useCounter()
\`\`\`

特点：
- **无 Provider**，直接 import 用；跨项目/微前端也能共享。
- **选择器精准订阅**（\`shallow\` 中间件支持对象浅比较）。
- 中间件生态：persist、devtools、immer、subscribeWithSelector。
- 体积小（< 2KB gzipped），TS 一流支持。

适合：中小型项目，替换 Context 性能问题。

## 方案二：Jotai（原子化）

\`\`\`jsx
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'

// 原子 1：基础值
const countAtom = atom(0)
// 原子 2：派生（自动追踪依赖、缓存）
const doubleAtom = atom(get => get(countAtom) * 2)
// 原子 3：可写（含副作用）
const incAtom = atom(null, (get, set, arg) => {
  set(countAtom, get(countAtom) + (arg ?? 1))
})

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  const double = useAtomValue(doubleAtom)
  const inc = useSetAtom(incAtom)
  return (
    <>
      <button onClick={() => inc(2)}>inc</button>
      {count} × 2 = {double}
    </>
  )
}
\`\`\`

特点：
- **原子粒度**，天然精准订阅（不会一个大 store 牵动全身）。
- **派生 atom 缓存**，等价 computed。
- 异步 atom 支持 Suspense。
- Provider 可选（用于 SSR / 隔离作用域）。

适合：状态分散、细粒度依赖、复杂派生关系。

## 方案三：Redux Toolkit（RTK，"规范版 Redux"）

Redux 官方推荐写法，解决了原生 Redux 模板多的问题。

\`\`\`jsx
import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit'

const fetchUser = createAsyncThunk('user/fetch', async (id) => (await fetch(\`/u/\${id}\`)).json())

const userSlice = createSlice({
  name: 'user',
  initialState: { loading: false, data: null },
  reducers: {
    logout: (s) => { s.data = null }  // 内部 immer，可直接写
  },
  extraReducers: (b) => {
    b.addCase(fetchUser.pending, s => { s.loading = true })
    b.addCase(fetchUser.fulfilled, (s, a) => { s.loading = false; s.data = a.payload })
  }
})

const store = configureStore({
  reducer: { user: userSlice.reducer },
  devTools: true
})
// 组件
const data = useSelector(s => s.user.data)
const dispatch = useDispatch()
dispatch(fetchUser(1))
\`\`\`

特点：
- **createSlice + immer**：不用写展开运算符，reducer 可"直接改"。
- **configureStore**：默认加了 devtools、thunk、immutable 检查。
- **生态成熟**：时间旅行、Redux DevTools、企业级约定强。
- 体积 ~10KB + react-redux。

适合：大型团队、复杂异步流、需要强可追溯 + 时间旅行。

## 方案四：RTK Query（RTK 内置的数据层）

专管**服务端状态**，和 RTK 无缝集成。

\`\`\`jsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (b) => ({
    getUser: b.query({ query: (id) => \`user/\${id}\` }),
    updateUser: b.mutation({
      query: (body) => ({ url: \`user/\${body.id}\`, method: 'PUT', body }),
      invalidatesTags: ['User']
    }),
  })
})

// 自动生成 Hook
const { useGetUserQuery, useUpdateUserMutation } = api

function Profile({ id }) {
  const { data, isFetching, error } = useGetUserQuery(id)
  const [update, { isLoading }] = useUpdateUserMutation()
  return (
    <div>
      <h1>{data?.name}</h1>
      <button disabled={isLoading} onClick={() => update({ id, name: 'New' })}>save</button>
    </div>
  )
}
\`\`\`

特点：
- 自动缓存、去重、轮询、乐观更新、失效（tag invalidation）。
- 与 React Query 对齐的能力，但与 RTK 一个生态内。
- 自动生成 TS 类型 Hook。

适合：已有 Redux/RTK 项目 + 需要服务端缓存。

## 横向对比

| 方案 | 模式 | 体积 | 模板 | 精准订阅 | 服务端缓存 | 推荐场景 |
| --- | --- | --- | --- | --- | --- | --- |
| Context | 内置广播 | 0 | 极少 | ❌ | ❌ | 低频全局值（主题、i18n） |
| Zustand | Hook store | <2KB | 少 | ✅ 选择器 | ❌ | 中小型、替换 Context |
| Jotai | 原子 | <3KB | 少 | ✅ 原子级 | ❌ | 分散状态、派生复杂 |
| Redux Toolkit | 单向数据流 | ~10KB | 中 | ✅ useSelector | 搭配 RTK Query | 大型团队、强规范 |
| RTK Query | 请求层 | +~10KB | 中 | ✅ | ✅ 一流 | 已用 RTK 的项目 |
| TanStack Query | 请求层 | ~8KB | 少 | ✅ | ✅ 一流 | 任意项目（与 Zustand 等绝配） |

## 选型组合建议

**新项目常用组合：**

| 项目规模 | 本地状态 | 服务端状态 |
| --- | --- | --- |
| 小工具 / H5 | useState/useReducer + Context | SWR / TanStack Query |
| 中型 Web App | **Zustand** | **TanStack Query** |
| 状态依赖复杂 / 大量派生 | **Jotai** | **TanStack Query** |
| 大型团队 / 大厂规范 | **Redux Toolkit** | **RTK Query 或 TanStack Query** |

**反模式：**

- 用 Context 管高频变化的大对象（全量重渲染）。
- 把所有请求数据塞进本地 store（应该放请求缓存层）。
- 新项目直接用原生 Redux（没用 RTK）。

> 一句话心法：**状态分层**——组件级用 useState，跨层级全局用 Zustand/Jotai/RTK，服务端数据用 RTK Query/TanStack Query。`
  },
  {
    id: 'react-028',
    category: 'react',
    title: 'React 的 StrictMode、副作用清理与竞态问题处理？',
    difficulty: '中等',
    tags: ['StrictMode', '竞态', 'useEffect', '副作用', '清理函数'],
    answer: `## StrictMode 是什么

React 18 开发环境下，StrictMode 会**故意双调用**组件函数和一些生命周期（mount → unmount → mount），帮你发现：
- effect 清理函数缺失（订阅没移除）。
- 不纯的渲染（同一 state 渲染出不同结果）。
- 旧字符串 ref、过时 API 的使用。

不是 bug，是故意行为。生产环境不会双调用。

\`\`\`jsx
<React.StrictMode>
  <App />
</React.StrictMode>
\`\`\`

## 副作用的黄金法则：写了 effect 一定写清理

### 计时器

\`\`\`jsx
// ❌ 不清理：卸载后还在 tick，内存泄漏
useEffect(() => {
  setInterval(() => setCount(c => c + 1), 1000)
}, [])

// ✅ 清理
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000)
  return () => clearInterval(id)
}, [])
\`\`\`

### 事件监听

\`\`\`jsx
useEffect(() => {
  const onResize = () => setW(window.innerWidth)
  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
}, [])
\`\`\`

### 订阅（Web Socket、EventEmitter）

\`\`\`jsx
useEffect(() => {
  const sub = socket.on('msg', handleMsg)
  return () => sub.off()
}, [])
\`\`\`

## 最经典的 Bug：请求竞态（Race Condition）

用户先查 \`id=1\`，再快速切到 \`id=2\`；接口 2 先返回，接口 1 后返回 → 页面显示 id=1 的数据。

\`\`\`jsx
// ❌ 竞态
function User({ id }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(\`/api/user/\${id}\`)
      .then(r => r.json())
      .then(d => setUser(d))  // 哪个先到哪个写，后到覆盖先到
  }, [id])
}
\`\`\`

### 修复 1：用忽略标记（AbortController 思想）

\`\`\`jsx
useEffect(() => {
  let alive = true
  fetch(\`/api/user/\${id}\`)
    .then(r => r.json())
    .then(d => { alive && setUser(d) })
  return () => { alive = false }
}, [id])
\`\`\`

### 修复 2：用 AbortController（还能真正取消请求）

\`\`\`jsx
useEffect(() => {
  const ctrl = new AbortController()
  fetch(\`/api/user/\${id}\`, { signal: ctrl.signal })
    .then(r => r.json())
    .then(d => setUser(d))
    .catch(e => { /* AbortError 忽略 */ })
  return () => ctrl.abort()
}, [id])
\`\`\`

### 修复 3：交给请求库（强烈推荐）

React Query / SWR / RTK Query 内置取消、去重、竞态保护：

\`\`\`jsx
const { data } = useQuery({ queryKey: ['user', id], queryFn: () => fetchUser(id) })
\`\`\`

## 常见竞态场景与修复

### 1. 搜索框防抖 + 请求

\`\`\`jsx
useEffect(() => {
  const t = setTimeout(async () => {
    const ctrl = new AbortController()
    try {
      const res = await fetch(\`/search?q=\${q}\`, { signal: ctrl.signal })
      setList(await res.json())
    } catch {}
  }, 300)
  return () => {
    clearTimeout(t)  // 新输入先取消旧 timeout
    // 注意：这里不能简单 abort，因为异步函数还没执行。更推荐：
  }
}, [q])
\`\`\`

最佳实践：直接用 \`useDebounce\` + React Query。

### 2. WebSocket 消息按 id 顺序

用序列号 + 丢弃老消息：

\`\`\`jsx
useEffect(() => {
  let maxSeq = 0
  const handler = (msg) => {
    if (msg.seq > maxSeq) {
      maxSeq = msg.seq
      setState(msg.payload)
    }
  }
  ws.on('data', handler)
  return () => ws.off('data', handler)
}, [])
\`\`\`

## effect 依赖写全的正确姿势

### 反模式：为了满足 eslint 乱加依赖 / 关 eslint

\`\`\`jsx
// ❌ 用外部 obj，没写依赖 → 闭包陈旧
useEffect(() => { obj.onChange() }, [])  // eslint-disable-line

// ✅ 用 ref 保存最新引用
const objRef = useRef(obj)
useEffect(() => { objRef.current = obj })
useEffect(() => {
  const id = setInterval(() => objRef.current.onChange(), 1000)
  return () => clearInterval(id)
}, [])
\`\`\`

### 新 API：useEvent（实验性 / RFC）

当你需要"一个引用永远稳定但内部始终访问最新 state/props"的函数：

\`\`\`jsx
const onTick = useEvent(() => {
  console.log('latest:', count, user.name)
})
useEffect(() => {
  const id = setInterval(onTick, 1000)
  return () => clearInterval(id)
}, [])  // 空依赖也能读到最新值（useEvent 内部实现 ref 模式）
\`\`\`

若还没稳定可用，手动用 useRef + useLayoutEffect 实现等价逻辑。

## 自测清单（写 effect 后过一遍）

1. 返回 cleanup 了吗？（timer / listener / subscription / abort）
2. 依赖数组包含回调中引用的**所有响应式值**了吗？（exhaustive-deps 过）
3. 如果有请求，是否处理了**组件卸载 / 参数变化**时的旧结果覆盖？（alive flag / AbortController）
4. 双调用下（StrictMode）清理逻辑正确吗？会不会重复订阅、重复绑定？

一个清理良好的 effect 应该支持 **setup → cleanup → setup** 被连跑两次，结果和只 setup 一次一致。

## 小结

| 问题 | 解法 |
| --- | --- |
| 订阅/定时器泄漏 | cleanup + 组件卸载时清 |
| 请求竞态覆盖 | alive flag / AbortController / 请求库 |
| 依赖写不全但又不想每次都重建 effect | useRef 存最新值 / useEvent（RFC） |
| StrictMode 双调用暴露 Bug | 补 cleanup、保持纯渲染 |

一句话：**把 effect 当成可随时被取消和重建的资源申请/释放机制**来写。`
  },
  // ===== 以下为补充题目（react-029 ~ react-058）=====
  {
    id: 'react-029',
    category: 'react',
    title: 'useState 的更新机制是怎样的？为什么更新可能是异步的？',
    difficulty: '中等',
    tags: ['useState', '批处理', '函数式更新', '状态'],
    answer: `## 基本用法

\`\`\`jsx
const [count, setCount] = useState(0)
setCount(count + 1)
\`\`\`

## 更新可能是异步的（批处理）

React 会把多次 setState **合并为一次重渲染**（batching），因此连续调用看不到中间态：

\`\`\`jsx
function handleClick() {
  setCount(count + 1)  // count 还是 0
  setCount(count + 1)  // count 还是 0 → 最终只 +1
}
\`\`\`

这不是"异步"的 Promise，而是 React 故意**延迟应用更新**，等当前事件处理完再统一 flush，避免每次 setState 都重渲染。

## 函数式更新（解决连续依赖）

当新值依赖前一次值时，传入函数：

\`\`\`jsx
setCount(prev => prev + 1)
setCount(prev => prev + 1)  // ✅ 最终 +2
\`\`\`

函数参数 \`prev\` 是 React 保证的最新值，避免闭包捕获旧值。

## 何时同步、何时异步

- **React 事件处理函数内**：批处理（异步）。
- **原生事件 / setTimeout / Promise.then 内**：React 17 及以前不批处理（同步，每次 setState 都重渲染）；**React 18 起所有更新都自动批处理**（automatic batching）。
- 需要立即拿到最新值：用 \`flushSync\` 强制同步刷新（慎用）。

\`\`\`jsx
import { flushSync } from 'react-dom'
flushSync(() => setCount(c => c + 1))  // 此行之后 count 已更新并重渲染
\`\`\`

## 闭包陷阱

\`\`\`jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1)  // ❌ count 始终是 effect 创建时的 0
  }, 1000)
  return () => clearInterval(id)
}, [])  // 空依赖 → count 闭包永远是 0
\`\`\`

解决：用函数式更新 \`setCount(c => c + 1)\`，或把 count 加入依赖（但会导致定时器重建），或用 useRef 存最新值。

## 对象/数组状态

React 状态必须**不可变更新**：

\`\`\`jsx
setUser({ ...user, name: 'Tom' })              // 对象：展开
setList([...list, item])                         // 数组：展开
setList(prev => prev.filter(x => x.id !== id))   // 过滤
\`\`\`

直接 \`user.name = 'Tom'\` 不会触发更新（引用未变）。用 Immer 的 \`produce\` 可简化。

## 懒初始化

\`useState(initFn)\` 传函数，只在首次渲染执行，避免每次渲染都跑昂贵的初始化：

\`\`\`jsx
const [data, setData] = useState(() => loadFromLocalStorage())  // 只跑一次
\`\`\`

## 一句话

setState 多次调用会被批处理合并；连续依赖用函数式更新 \`setX(prev => ...)\`；状态必须不可变更新；空依赖闭包陷阱用函数式更新或 useRef。`
  },
  {
    id: 'react-030',
    category: 'react',
    title: 'useEffect 的完整使用指南：依赖、清理与常见陷阱？',
    difficulty: '中等',
    tags: ['useEffect', '副作用', '清理', '依赖'],
    answer: `## 基本形式

\`\`\`jsx
useEffect(() => {
  // 副作用：订阅、请求、定时器、操作 DOM
  return () => {
    // 清理函数：组件卸载或依赖变化重新执行前调用
  }
}, [deps])
\`\`\`

## 依赖数组的含义

| 形式 | 执行时机 |
| --- | --- |
| \`useEffect(fn)\` | 每次渲染后都执行 |
| \`useEffect(fn, [])\` | 仅首次渲染后执行 |
| \`useEffect(fn, [a, b])\` | 首次 + a/b 变化时执行 |

## 清理函数的调用时机

1. 组件**卸载**时。
2. 依赖变化、effect **重新执行前**（先清理上一次，再跑新的）。

\`\`\`jsx
useEffect(() => {
  const ctrl = new AbortController()
  fetch(url, { signal: ctrl.signal }).then(...)
  return () => ctrl.abort()  // url 变化或卸载时取消旧请求
}, [url])
\`\`\`

## 常见陷阱

### 1. 依赖写漏

ESLint 的 \`react-hooks/exhaustive-deps\` 规则会警告。漏写依赖会导致用旧值（闭包陷阱）：

\`\`\`jsx
useEffect(() => {
  fetchData(filter)  // filter 变了但没在依赖里 → 用旧 filter
}, [])  // ❌ 应加 filter
\`\`\`

### 2. 把 effect 当生命周期

\`\`\`jsx
// ❌ 思维：组件挂载时做 X
useEffect(() => { doX() }, [])
\`\`\`

正确思维：**"当依赖 X 变化时，同步副作用"**。不是"挂载时"，而是"首次+X变化时"。

### 3. 每次都重建昂贵资源

\`\`\`jsx
useEffect(() => {
  const chart = initChart(data)  // data 变就重建 → 慢
}, [data])
\`\`\`

改用 useRef 持有实例，effect 内只更新数据。

### 4. 在 effect 里直接 setState 引发循环

\`\`\`jsx
useEffect(() => {
  setX(deriveFrom(x))  // x 变 → setX → 重渲染 → x 又"变"？需确认 derive 不会循环
}, [x])
\`\`\`

若 derive 结果每次不同会无限循环。优先用 \`useMemo\` 派生。

### 5. 依赖数组里的对象/函数引用

每次渲染新建的对象/函数引用不同，会导致 effect 每次都跑：

\`\`\`jsx
useEffect(() => { fetch(options) }, [options])  // options 每次新对象 → 每次都请求
\`\`\`

用 \`useMemo\` 稳定 options，或把需要的原始字段作为依赖。

### 6. 异步函数

effect 不能直接 async（需返回清理函数），需内部定义 async：

\`\`\`jsx
useEffect(() => {
  let cancelled = false
  ;(async () => {
    const data = await fetch(url).then(r => r.json())
    if (!cancelled) setData(data)
  })()
  return () => { cancelled = true }
}, [url])
\`\`\`

## 与 useLayoutEffect

- \`useEffect\`：渲染后**异步**执行，不阻塞浏览器绘制。
- \`useLayoutEffect\`：DOM 变更后**同步**执行，会阻塞绘制。用于读取/修改 DOM 布局（如测量元素尺寸再调整样式），避免闪烁。
- SSR 中 \`useLayoutEffect\` 报 warning，可用 \`useIsomorphicLayoutEffect\` 封装。

## 一句话

effect = "依赖变化时同步副作用"；依赖要写全；清理函数处理订阅/请求/定时器；避免每次重建昂贵资源；异步用内部 async + cancelled 标志。`
  },
  {
    id: 'react-031',
    category: 'react',
    title: 'useMemo 和 useCallback 何时该用、何时不该用？',
    difficulty: '中等',
    tags: ['useMemo', 'useCallback', '性能', '记忆化'],
    answer: `## 作用

- \`useMemo(() => compute, deps)\`：记忆**计算结果**，deps 不变时返回缓存值。
- \`useCallback(fn, deps)\`：记忆**函数引用**，等价 \`useMemo(() => fn, deps)\`。

\`\`\`jsx
const sorted = useMemo(() => list.sort(), [list])
const handleClick = useCallback(() => { ... }, [id])
\`\`\`

## 什么时候该用

### 1. 作为子组件的 props（避免子组件重渲染）

\`\`\`jsx
const Child = React.memo(({ onClick }) => { ... })
const Parent = () => {
  const handleClick = useCallback(() => {}, [id])  // 引用稳定
  return <Child onClick={handleClick} />  // Child 不会因 Parent 重渲染而重渲染
}
\`\`\`

### 2. 作为其他 Hook 的依赖

\`\`\`jsx
const fetcher = useCallback(() => api.get(id), [id])
useEffect(() => { fetcher() }, [fetcher])  // 不稳定会每次跑
\`\`\`

### 3. 昂贵的计算

\`\`\`jsx
const result = useMemo(() => heavyCompute(data), [data])  // data 不变不重算
\`\`\`

## 什么时候不该用

### 1. 计算很便宜

\`\`\`jsx
const total = useMemo(() => a + b, [a, b])  // ❌ 加法比 useMemo 开销小
\`\`\`

useMemo 本身有开销（存 deps、比较、闭包），简单计算反而更慢。

### 2. 记忆的值/函数没传给子组件或别的 Hook

\`\`\`jsx
const handleClick = useCallback(() => { ... }, [])
<button onClick={handleClick}>x</button>  // 原生元素，引用变不变无所谓
\`\`\`

原生 DOM 元素每次新建 onClick 函数也无性能影响。

### 3. 子组件没被 memo

若子组件没 \`React.memo\`，父组件重渲染它必然重渲染，传 memoized props 也没用。

## React Compiler（React 19+）

React Compiler 自动记忆化组件内的值和函数，未来可能不再需要手动 useMemo/useCallback。但目前仍需手写。

## 判断流程

\`\`\`
该值/函数是否传给子组件？
  否 → 多半不需要 memo（除非是昂贵计算）
  是 → 子组件是否 React.memo？
    否 → 不需要 memo
    是 → 用 useCallback/useMemo 稳定引用
\`\`\`

## 一句话

useMemo/useCallback 用于"昂贵计算""传给 memo 子组件""作为 Hook 依赖"三场景；简单计算和无 memo 子组件时反而增加开销，不要无脑加。`
  },
  {
    id: 'react-032',
    category: 'react',
    title: 'useRef 有哪些用途？它和 state 有什么区别？',
    difficulty: '中等',
    tags: ['useRef', 'DOM', '可变值', '不触发渲染'],
    answer: `## 基本用法

\`\`\`jsx
const ref = useRef(initialValue)
ref.current  // 读取
ref.current = newValue  // 修改（不触发重渲染）
\`\`\`

\`useRef\` 返回一个**固定的对象** {\`.current\`}，整个组件生命周期内引用不变，修改 \`.current\` 不会触发重渲染。

## 三大用途

### 1. 访问 DOM 元素

\`\`\`jsx
const inputRef = useRef()
useEffect(() => inputRef.current?.focus(), [])
return <input ref={inputRef} />
\`\`\`

### 2. 存可变值（不触发渲染）

\`\`\`jsx
const timerRef = useRef(null)
useEffect(() => {
  timerRef.current = setInterval(() => ..., 1000)
  return () => clearInterval(timerRef.current)
}, [])
\`\`\`

定时器 ID、订阅句柄、上一次的值等"不需要驱动 UI"的数据放 ref。

### 3. 存"最新值"供闭包读取

解决闭包陷阱：

\`\`\`jsx
const latestCount = useRef(count)
latestCount.current = count  // 每次渲染更新
useEffect(() => {
  const id = setInterval(() => {
    console.log(latestCount.current)  // 始终最新
  }, 1000)
  return () => clearInterval(id)
}, [])  // 空依赖，定时器只建一次
\`\`\`

## useRef vs useState

| | useState | useRef |
| --- | --- | --- |
| 修改触发渲染 | ✅ | ❌ |
| 用于驱动 UI 的数据 | ✅ | ❌ |
| 用于非 UI 的可变值 | ❌（会多余渲染） | ✅ |
| 读取时机 | 渲染后才能拿到新值 | 立即 |
| 渲染期间读取 | 可 | 可，但**渲染期间不要写** ref |

## 渲染期间不要写 ref

\`\`\`jsx
function Comp() {
  ref.current = 1  // ❌ 渲染期间写 ref（React 不保证渲染次数）
  return <div />
}
\`\`\`

渲染应是纯函数，副作用（写 ref）放 effect 或事件处理。唯一例外：**懒初始化** ref：

\`\`\`jsx
if (ref.current === null) ref.current = createNode()  // 首次渲染时初始化
\`\`\`

## forwardRef：把 ref 转发给子组件

\`\`\`jsx
const Input = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} />
))
// 父：const ref = useRef(); <Input ref={ref} />
\`\`\`

## useImperativeHandle：自定义暴露给父的 ref

\`\`\`jsx
React.forwardRef((props, ref) => {
  const innerRef = useRef()
  useImperativeHandle(ref, () => ({ focus: () => innerRef.current.focus() }))
  return <input ref={innerRef} />
})
\`\`\`

## 一句话

\`useRef\` 存"不驱动 UI 的可变值"和"DOM 引用"，修改不触发渲染；闭包陷阱用它存最新值；渲染期间不写 ref（懒初始化除外）；转发用 forwardRef + useImperativeHandle。`
  },
  {
    id: 'react-033',
    category: 'react',
    title: 'useReducer 和 useState 该如何选择？',
    difficulty: '中等',
    tags: ['useReducer', 'useState', '状态管理'],
    answer: `## 基本用法

\`\`\`jsx
const [state, dispatch] = useReducer(reducer, initialState)

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 }
    case 'reset': return { count: 0 }
    default: return state
  }
}
// dispatch({ type: 'increment' })
\`\`\`

## 何时用 useReducer

### 1. 状态逻辑复杂、相互关联

多个字段联动（如表单各字段校验、购物车总价/数量/折扣联动），用 reducer 集中管理比多个 useState 清晰：

\`\`\`jsx
function cartReducer(state, action) {
  switch (action.type) {
    case 'add': return { items: [...state.items, action.item], total: state.total + action.item.price }
    case 'remove': return { ... }
  }
}
\`\`\`

### 2. 下一个状态依赖前一个

useState 连续依赖要函数式更新，reducer 天然处理：

\`\`\`jsx
// useState
setCount(c => c + 1); setCount(c => c + 2)
// reducer
dispatch({ type: 'add', n: 1 }); dispatch({ type: 'add', n: 2 })
\`\`\`

### 3. 需要把状态逻辑传给子组件

把 dispatch 传下去（引用稳定，不必 useCallback），子组件 dispatch，比传多个 setState 更简洁。

### 4. 易于测试

reducer 是纯函数，独立测试：

\`\`\`js
expect(reducer({ count: 0 }, { type: 'add', n: 1 })).toEqual({ count: 1 })
\`\`\`

## 何时用 useState

- 状态简单（数字、布尔、单字段）。
- 状态间无联动。
- 快速原型。

## 选择标准

\`\`\`
状态数量少且独立 → useState
状态多/联动复杂/需集中逻辑/需测试 → useReducer
\`\`\`

## 惰性初始化

\`useReducer(reducer, initialArg, init)\` 第三参数 init 用于惰性初始化（常用于从 localStorage 恢复）：

\`\`\`jsx
const [state, dispatch] = useReducer(reducer, {}, () => loadFromStorage())
\`\`\`

## 与 Context 配合

reducer + Context 是轻量全局状态方案：

\`\`\`jsx
const StateContext = createContext()
const DispatchContext = createContext()

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}
// 子组件：const state = useContext(StateContext); const dispatch = useContext(DispatchContext)
\`\`\`

拆两个 Context 避免 dispatch 不变时也触发 state 变化的重渲染。

## 一句话

简单独立状态用 useState；复杂联动/需测试/传子组件用 useReducer；reducer + Context 可做轻量全局状态。`
  },
  {
    id: 'react-034',
    category: 'react',
    title: 'useContext 的性能陷阱在哪？如何优化？',
    difficulty: '困难',
    tags: ['useContext', 'Context', '性能', 'memo'],
    answer: `## 问题：Context 变化导致全量重渲染

\`useContext\` 的组件，当 Context value 变化时**必然重渲染**，即使只用 value 的一部分：

\`\`\`jsx
const AppContext = createContext({ user: null, theme: 'light' })

function UserBar() {
  const { user } = useContext(AppContext)  // theme 变了也会重渲染
  return <div>{user?.name}</div>
}
\`\`\`

React 无法知道 UserBar 只用 user，value 引用一变就重渲染所有消费者。Context 值是对象时尤其严重（每次 new 对象引用都变）。

## 优化手段

### 1. 拆分 Context

把不相关的状态拆到不同 Context：

\`\`\`jsx
const UserContext = createContext()
const ThemeContext = createContext()
// UserBar 只 useContext(UserContext)，theme 变不影响它
\`\`\`

### 2. value 用 useMemo 稳定引用

\`\`\`jsx
const value = useMemo(() => ({ user, setUser }), [user])
<UserContext.Provider value={value}>
\`\`\`

避免每次渲染新建对象导致引用变化。

### 3. selector 模式（use-context-selector 库）

第三方库支持"只订阅部分"：

\`\`\`jsx
import { useContextSelector } from 'use-context-selector'
const user = useContextSelector(UserContext, s => s.user)  // 只在 user 变化时重渲染
\`\`\`

### 4. 拆分 state 与 dispatch Context

dispatch 引用永远不变，单独一个 Context，state 单独一个，避免 dispatch 消费者被 state 变化波及（见 useReducer 题）。

### 5. 组合 memo + 精确 props

把 Context 消费收敛在顶层，把值通过 props 传给 memo 子组件：

\`\`\`jsx
function Parent() {
  const { user } = useContext(UserContext)
  return <Child name={user.name} />  // Child 是 memo，name 不变不渲染
}
\`\`\`

### 6. 状态库替代（Redux/Zustand）

Context 适合**低频变化**的状态（主题、用户信息、i18n）。**高频变化**（实时数据、动画）用 Zustand/Redux 等，它们支持订阅 selector，性能更好：

\`\`\`jsx
const user = useStore(state => state.user)  // 只订阅 user
\`\`\`

## 何时该用 Context

- 主题、用户登录态、i18n、路由等**全局、低频**数据。
- 跨多层传值避免 prop drilling。
- 配合 useState/useReducer 做中小型应用状态。

## 何时不用 Context

- 高频更新（实时股价、拖拽位置）。
- 大量组件只关心 value 的一小部分。
- 这些场景用 Zustand/Jotai/Redux。

## 一句话

Context value 变化会让所有 useContext 消费者重渲染；优化靠拆分 Context、useMemo 稳定 value、selector 模式、memo 子组件；高频/精细订阅场景换 Zustand/Redux。`
  },
  {
    id: 'react-035',
    category: 'react',
    title: '如何设计一个好的自定义 Hook？举几个实用例子。',
    difficulty: '中等',
    tags: ['自定义Hook', 'useFetch', 'useDebounce', '复用'],
    answer: `## 设计原则

1. **单一职责**：一个 Hook 只做一件事（\`useFetch\` 只管请求，\`useDebounce\` 只管防抖）。
2. **返回值清晰**：返回值组或对象，命名表达用途。
3. **依赖要全**：内部用 useEffect/useMemo 时依赖写全，让 ESLint exhaustive-deps 通过。
4. **处理边界**：loading/error/cleanup/取消请求。
5. **命名以 use 开头**：让 ESLint hooks 规则识别。
6. **可配置**：通过参数开放配置，提供合理默认值。

## 例子 1：useDebounce

\`\`\`jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)  // 每次重新设置前清旧定时器
  }, [value, delay])
  return debounced
}
// 使用
const [kw, setKw] = useState('')
const debouncedKw = useDebounce(kw, 500)
useEffect(() => { if (debouncedKw) search(debouncedKw) }, [debouncedKw])
\`\`\`

## 例子 2：useFetch

\`\`\`jsx
function useFetch(url, options) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    fetch(url, { ...options, signal: ctrl.signal })
      .then(r => r.json())
      .then(d => { setData(d); setError(null) })
      .catch(e => { if (e.name !== 'AbortError') setError(e) })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [url, JSON.stringify(options)])

  return { data, error, loading }
}
\`\`\`

注意 options 是对象引用问题，用 JSON.stringify 或要求调用方 useMemo。

## 例子 3：useLocalStorage

\`\`\`jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial }
    catch { return initial }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}
\`\`\`

## 例子 4：useEventListener

\`\`\`jsx
function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef(handler)
  useEffect(() => { savedHandler.current = handler }, [handler])
  useEffect(() => {
    const listener = (e) => savedHandler.current(e)
    element.addEventListener(eventName, listener)
    return () => element.removeEventListener(eventName, listener)
  }, [eventName, element])
}
\`\`\`

用 ref 存最新 handler，避免 handler 变化导致反复 add/remove。

## 例子 5：usePrevious

\`\`\`jsx
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => { ref.current = value }, [value])
  return ref.current  // 返回的是更新前的值（effect 在渲染后执行）
}
\`\`\`

## 例子 6：useWindowSize

\`\`\`jsx
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ w: innerWidth, h: innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}
\`\`\`

## 复用与组合

Hook 可组合：\`useFetch\` 内部用 \`useDebounce\` 的结果；\`useAuth\` 内部用 \`useLocalStorage\` + \`useFetch\`。

## 一句话

自定义 Hook 遵循单一职责、依赖写全、处理边界（loading/error/cleanup）、use 开头命名；常见轮子有 useDebounce/useFetch/useLocalStorage/useEventListener/usePrevious/useWindowSize。`
  },
  {
    id: 'react-036',
    category: 'react',
    title: 'React 18 的并发渲染（Concurrent Rendering）是什么？',
    difficulty: '困难',
    tags: ['并发渲染', 'Concurrent', '时间切片', '可中断'],
    answer: `## 传统渲染的问题

React 17 及以前，渲染是**同步且不可中断**的：一旦开始 reconcile + commit，必须跑完。大组件树渲染会长时间占用主线程，导致输入卡顿、动画掉帧。

## 并发渲染核心

React 18 引入**可中断、可恢复、可暂停**的渲染：

- 渲染过程可被**更高优先级任务打断**（如用户输入）。
- 渲染可**分片**进行（时间切片），让出主线程给浏览器处理交互。
- 可**丢弃**过期渲染（如又来了新状态）。

## 底层：Fiber + Lane

- **Fiber**：把组件树拆成可中断的链表节点，支持暂停/恢复。
- **Lane**（优先级模型）：用二进制位表示多种优先级（同步、离散事件、连续事件、空闲等），高优先级可打断低优先级。

## 开启并发渲染

\`createRoot\` 自动启用：

\`\`\`jsx
import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')).render(<App />)
\`\`\`

（旧的 \`ReactDOM.render\` 仍是同步，且会警告。）

## 并发特性 API

### 1. startTransition / useTransition

把某个状态更新标记为**低优先级 transition**，可被用户输入等高优先级打断：

\`\`\`jsx
import { useTransition } from 'react'
const [isPending, startTransition] = useTransition()

function onChange(e) {
  setInput(e.target.value)              // 高优先级：输入框立即响应
  startTransition(() => {
    setResults(filter(hugeList, e.target.value))  // 低优先级：列表过滤可中断
  })
}
\`\`\`

\`isPending\` 表示 transition 是否在进行，可用于显示 loading。

### 2. useDeferredValue

返回一个"延迟"的值，React 在空闲时才用新值重渲染：

\`\`\`jsx
const deferredKw = useDeferredValue(kw)
<List filter={deferredKw} />  // 列表用延迟值，输入框用 kw 实时响应
\`\`\`

### 3. Suspense + 并发数据获取

\`\`\`jsx
<Suspense fallback={<Spinner />}>
  <ComponentThatSuspends />  // 数据未就绪时显示 fallback，就绪后切换
</Suspense>
\`\`\`

并发模式下，Suspense 可协调多个数据源、避免瀑布流。

### 4. 自动批处理（Automatic Batching）

所有更新（含 setTimeout、Promise）都批处理，减少重渲染。

### 5. selectively hydration / progressive SSR

SSR 时大页面可逐步 hydrate，优先 hydrate 用户正在交互的部分。

## 何时打断

- 用户输入、点击（离散/连续事件）→ 高优先级。
- \`startTransition\` 包裹的更新 → 低优先级。
- 当高优先级进来时，正在进行的低优先级渲染被丢弃重做。

## 注意

- 并发渲染**不改变组件 API**，仍是纯函数、不可变更新。
- 渲染函数必须是**纯函数**（无副作用），因为可能被打断重跑多次（StrictMode 故意双调用以暴露问题）。
- effect 只在 commit 后执行一次，不受中断影响。

## 一句话

并发渲染让 React 渲染可中断/分片/可恢复，基于 Fiber + Lane 优先级；通过 startTransition/useDeferredValue/Suspense 暴露并发能力，保证高优先级交互不被大渲染阻塞。`
  },
  {
    id: 'react-037',
    category: 'react',
    title: 'useTransition 和 useDeferredValue 有什么区别？怎么选？',
    difficulty: '困难',
    tags: ['useTransition', 'useDeferredValue', '并发', '优先级'],
    answer: `## 共同点

两者都是 React 18 并发特性，把某个更新降为**低优先级 transition**，让高优先级更新（用户输入）不被阻塞。

## useTransition：主动包裹

把**状态更新代码**包在 startTransition 里，标记为低优先级：

\`\`\`jsx
const [isPending, startTransition] = useTransition()

function onChange(e) {
  setInput(e.target.value)            // 高优先级
  startTransition(() => {
    setResults(filter(list, e.target.value))  // 低优先级
  })
}
\`\`\`

- 返回 \`isPending\`：transition 是否在进行（可显示 loading 态）。
- 适合：**你能控制 setState 的调用**，想明确区分"紧急更新"和"非紧急更新"。

## useDeferredValue：延迟值

对**已有的值**做延迟，React 在空闲时用新值重渲染：

\`\`\`jsx
function Search({ kw }) {
  const deferredKw = useDeferredValue(kw)
  return <ExpensiveList filter={deferredKw} />  // 列表用延迟值
}
\`\`\`

- 没有 isPending（可用 \`useDeferredValue\` + 对比新旧值判断是否 stale）。
- 适合：**值来自上层（props 或已 setState）**，你无法改 setState 逻辑，只能在消费端延迟。

## 对比

| | useTransition | useDeferredValue |
| --- | --- | --- |
| 作用对象 | setState 调用 | 已有的值 |
| 控制点 | 产生更新的地方 | 消费值的地方 |
| isPending | ✅ | ❌（需手动判断） |
| 适合 | 你能改更新逻辑 | 值来自 props/无法改 setState |

## 等价关系

两者底层都是 transition，效果类似。下面两种写法近似：

\`\`\`jsx
// useTransition
const [kw, setKw] = useState('')
const [r, setR] = useState([])
const [, startT] = useTransition()
function onChange(e) {
  setKw(e.target.value)
  startT(() => setR(filter(list, e.target.value)))
}
return <List items={r} />

// useDeferredValue（更简洁，适合 List 组件内部）
const deferred = useDeferredValue(kw)
return <List items={filter(list, deferred)} />
\`\`\`

## 选择

- **你能包裹 setState** → useTransition（拿 isPending 更友好）。
- **值来自 props 或已有状态、只想延迟渲染** → useDeferredValue。
- **第三方组件/库内部 setState 无法改** → useDeferredValue 在消费端延迟。

## 视觉反馈

- useTransition：\`isPending\` → 显示 spinner / 降低透明度。
- useDeferredValue：对比 \`kw !== deferredKw\` → 给列表加 \`opacity: 0.7\` + \`transition\` 表示 stale。

\`\`\`jsx
const deferred = useDeferredValue(kw)
const isStale = kw !== deferred
<List style={{ opacity: isStale ? 0.7 : 1 }} items={filter(list, deferred)} />
\`\`\`

## 性能前提

两者让大列表渲染不阻塞输入，但**前提是 ExpensiveList 渲染确实慢**。简单列表加 useTransition/useDeferredValue 无收益甚至更慢（调度本身有开销）。

## 一句话

useTransition 包裹 setState 标记低优先级（有 isPending）；useDeferredValue 延迟已有值（适合 props/无法改 setState）；能控 setState 用前者，只能延迟消费用后者。`
  },
  {
    id: 'react-038',
    category: 'react',
    title: 'React Server Components（RSC）是什么？和 SSR 有何区别？',
    difficulty: '困难',
    tags: ['RSC', 'Server Components', 'SSR', '服务端'],
    answer: `## 什么是 RSC

React Server Components 是**在服务端渲染、从不发送到客户端**的组件。它们的代码、依赖都不进客户端 bundle，直接在服务端执行生成 UI 描述，传输给客户端。

\`\`\`jsx
// Server Component（默认，在 app 目录下）
async function Article({ id }) {
  const post = await db.posts.find(id)  // 直接访问数据库，无 API 层
  return <div>{post.title}</div>
}
\`\`\`

## 与 SSR 的区别

| | SSR | RSC |
| --- | --- | --- |
| 执行时机 | 每次请求（或构建时） | 每次请求（或构建时） |
| 产物 | HTML 字符串 | RSC payload（序列化的 React 元素树） |
| 是否 hydrate | 是（HTML + JS hydrate） | Server Component 不 hydrate（无 JS） |
| 客户端 JS | 包含组件代码 | Server Component 代码不进 bundle |
| 数据获取 | 在 getServerSideProps 等地方 | 组件内直接 await |
| 交互 | hydrate 后可交互 | 需配合 Client Component 才有交互 |

关键区别：**SSR 产出 HTML 再 hydrate（组件代码仍要发到客户端）；RSC 产出的 Server Component 永远不进客户端 bundle**，大幅减小 JS 体积。

## Server vs Client Component

\`\`\`jsx
// Server Component（默认）
import db from './db'
export default async function Page() {
  const data = await db.query()  // ✅ 服务端数据访问
  return <div>{data.map(...)}</div>
}

// Client Component（顶部声明）
'use client'
import { useState } from 'react'
export default function Counter() {
  const [n, setN] = useState(0)  // ✅ 客户端交互
  return <button onClick={() => setN(n+1)}>{n}</button>
}
\`\`\`

- Server Component 可 import Client Component。
- Client Component **不能**直接 import Server Component（但可通过 children prop 传入）。
- Server Component 不能用 useState/useEffect/浏览器 API/事件处理。

## 何时用 RSC

- 数据获取密集的页面（列表、详情、仪表盘）：直接在组件 await 查询，省 API 层。
- 依赖大库只读展示（markdown 渲染、语法高亮）：库不进客户端 bundle。
- 静态内容为主、少量交互：Server 渲染主体，Client 处理交互岛。

## 与 Suspense 配合

\`\`\`jsx
<Page>
  <Suspense fallback={<Spinner />}>
    <SlowList />  {/* 服务端 async 组件，数据就绪前显示 fallback */}
  </Suspense>
</Page>
\`\`\`

Suspense 在 RSC 中协调数据流式传输，避免整页等待。

## 框架支持

- Next.js App Router 是 RSC 的主要落地。
- 纯 React 也支持（需自建 RSC 服务端协议）。

## 限制

- 不能有客户端状态/事件。
- 不能用 Context（Server 间无法共享）。
- 需框架/构建支持（不能裸用）。

## 一句话

RSC 是服务端执行、代码不进客户端 bundle 的组件，直接 await 取数据；区别于 SSR（HTML+hydrate）；与 Client Component（\`'use client'\`）协作，Server 取数据、Client 处理交互。`
  },
  {
    id: 'react-039',
    category: 'react',
    title: 'React 事件系统：合成事件是什么？和原生事件有何区别？',
    difficulty: '中等',
    tags: ['合成事件', '事件系统', '事件委托', 'SyntheticEvent'],
    answer: `## 合成事件（SyntheticEvent）

React 自己实现的一套**跨浏览器兼容的事件对象**，包装原生事件，提供统一 API：

\`\`\`jsx
function handleClick(e) {
  e.preventDefault()
  e.stopPropagation()
  console.log(e.target, e.currentTarget)
}
<button onClick={handleClick}>x</button>
\`\`\`

- \`e\` 是 SyntheticEvent，不是原生 Event，但 API 与 W3C 标准一致。
- \`e.nativeEvent\` 可拿到原生事件。

## 事件委托机制

### React 17 之前

所有事件委托到 \`document\`：

\`\`\`
document.addEventListener('click', handler)
\`\`\`

点击按钮 → 冒泡到 document → React 按 e.target 找对应组件的 onClick 执行。

### React 17+

事件委托到**渲染容器的根节点**（\`createRoot\` 的容器），而非 document：

\`\`\`jsx
createRoot(document.getElementById('root')).render(<App />)
// 事件绑在 #root 上
\`\`\`

好处：
- 多个 React 应用同页面不冲突（各自绑自己根）。
- 与原生事件混用时更可控。

## 合成事件 vs 原生事件

| | 合成事件 | 原生事件 |
| --- | --- | --- |
| 绑定 | JSX \`onClick\` | \`addEventListener\` |
| 对象 | SyntheticEvent | 原生 Event |
| 池化 | React 16 及以前池化复用（异步访问需 persist） | 无 |
| 传播 | 模拟捕获+冒泡 | 原生 |
| 兼容 | 跨浏览器统一 | 需自己处理兼容 |

## 事件池（React 16 及以前）

为性能，SyntheticEvent 对象被复用，事件回调结束后属性被清空：

\`\`\`jsx
function handleClick(e) {
  setTimeout(() => console.log(e.target), 0)  // ❌ React 16 中 e.target 已被清空
  e.persist()  // 保留事件对象
}
\`\`\`

**React 17 已移除事件池**，事件对象不再复用，无需 persist。

## 执行顺序

原生事件（捕获）→ React 合成事件（捕获）→ 目标阶段 → React 合成事件（冒泡）→ 原生事件（冒泡）。

混用原生与合成事件时注意顺序：原生绑在比 React 根更外层（如 document）会先于/后于合成事件触发。

## 合成事件的 stopPropagation

\`e.stopPropagation()\` 只阻止 React 合成事件的传播，**不阻止**已绑在更外层 document 的原生事件：

\`\`\`jsx
// document 上的原生事件不会被合成事件的 stopPropagation 阻止
document.addEventListener('click', () => console.log('doc'))
<button onClick={e => e.stopPropagation()}>x</button>  // 仍会打印 doc
\`\`\`

需用 \`e.nativeEvent.stopImmediatePropagation()\` 或在原生层处理。

## React 17+ 事件委托变更的影响

- 第三方库在 document 绑的事件，现在可能比 React 事件先/后触发（因委托位置变了）。
- 更容易与 jQuery 等老库共存。

## 一句话

合成事件是 React 跨浏览器统一的事件包装；React 17+ 委托到根容器（非 document）；17 起移除事件池无需 persist；合成事件的 stopPropagation 不影响更外层原生事件。`
  },
  {
    id: 'react-040',
    category: 'react',
    title: 'React Fiber 架构是什么？为什么要引入？',
    difficulty: '困难',
    tags: ['Fiber', '架构', '时间切片', '可中断'],
    answer: `## 引入背景

React 15 的 reconciliation 是**同步递归**（stack reconciler），一旦开始不可中断。大组件树更新会长时间占用主线程，导致：
- 用户输入延迟。
- 动画掉帧。
- 交互卡顿。

## Fiber 是什么

Fiber 是 React 16 引入的**新的协调架构**，核心是把渲染工作拆成**可中断、可恢复的单元**。

### Fiber 节点

每个组件对应一个 Fiber 节点，构成**链表树**（不再是纯递归树）：

\`\`\`
Fiber {
  type,        // 组件类型
  key,
  stateNode,   // 真实 DOM / 类实例
  child,       // 第一个子节点
  sibling,     // 下一个兄弟
  return,      // 父节点
  pendingProps, memoizedProps, memoizedState,
  alternate,   // 指向另一棵树（双缓冲）
  flags,       // 副作用标记（插入/更新/删除）
  lanes        // 优先级
}
\`\`\`

child/sibling/return 三个指针让遍历可**随时暂停**并恢复（链表比递归栈灵活）。

## 双缓冲（Double Buffering）

React 维护两棵 Fiber 树：
- **current**：当前屏幕上的。
- **workInProgress**：正在构建的新树。

更新时在 workInProgress 上构建，完成后切换 root 指针，workInProgress 变 current。中途可中断，下次从 alternate 指针恢复。

## 工作循环（work loop）

\`\`\`
while (nextUnitOfWork) {
  nextUnitOfWork = performUnitOfWork(nextUnitOfWork)  // 处理一个 fiber
  if (shouldYield()) break  // 时间片用完，让出主线程
}
\`\`\`

\`shouldYield\` 检查距上一帧是否超过 5ms（\`Scheduler\` 用 MessageChannel 模拟 requestIdleCallback），超时则让出，等浏览器空闲继续。

## 两个阶段

1. **Render/Reconcile 阶段**（可中断）：遍历 Fiber，diff，标记副作用（flags）。**纯计算，无 DOM 操作**，可被打断重跑。
2. **Commit 阶段**（不可中断）：根据 flags 提交 DOM 变更、执行生命周期/useEffect（passive）/useLayoutEffect。必须同步完成。

> 这就是为什么 render 函数和 reconcile 阶段逻辑必须**纯函数无副作用**——可能被重跑。

## Lane 优先级模型

React 18 用 Lane（二进制位）表示多档优先级：
- 同步（SyncLane）：必须立即完成。
- 离散事件（onClick）：高。
- 连续事件（onMouseMove）：中。
- 过渡（transition）：低。
- 空闲：最低。

高优先级可打断低优先级的进行中渲染。

## 有了 Fiber 才能实现

- 时间切片（Time Slicing）。
- 并发渲染（Concurrent Rendering）。
- Suspense。
- startTransition / useDeferredValue。
- 优先级调度。

## 一句话

Fiber 用链表树 + 双缓冲 + 可中断 work loop，把同步递归 reconciliation 改为可暂停/恢复/优先级调度，是 React 16+ 并发能力（时间切片、Suspense、transition）的基础。`
  },
  {
    id: 'react-041',
    category: 'react',
    title: 'React 的 Diff 算法是怎样的？key 为什么重要？',
    difficulty: '中等',
    tags: ['Diff', '协调', 'key', '算法'],
    answer: `## 三个假设（降低复杂度）

理论 diff 两棵树是 O(n³)，React 用三个假设降到 O(n)：

1. **不同类型的元素产生不同树**：\`<div>\` → \`<span>\` 直接销毁重建。
2. **同类型元素保留节点，更新属性**：\`<div className="a">\` → \`<div className="b">\` 只更新 className。
3. **列表通过 key 标识**：同层兄弟节点靠 key 复用。

## Tree Diff（同层比较）

只比较**同一层级**的节点，不跨层移动。如果某节点不存在了，整个子树被销毁，不会复用到别处。

⚠️ 跨层移动（把 A 从父 P1 移到 P2）会被当作"P1 删除 A、P2 新增 A"，React 不会真的移动。所以**避免不必要的跨层 DOM 移动**。

## Component Diff

- 同类型组件：继续 diff 子节点。
- 不同类型组件（\`<A>\` → \`<B>\`）：卸载 A 挂载 B。
- \`shouldComponentUpdate\`/\`React.memo\` 返回 false 时跳过子树 diff。

## Element Diff（列表同层）

同层多个子节点变化（增删改顺序）时，靠 **key** 匹配：

\`\`\`jsx
// 旧
<li key="A">A</li>
<li key="B">B</li>
<li key="C">C</li>
// 新
<li key="A">A</li>
<li key="D">D</li>
<li key="B">B</li>
\`\`\`

有 key：A 复用，B 移到后面，C 删除，D 新增——只做必要移动。

无 key：React 按顺序逐个 patch（A→A、B→D 改、C→B 改、新增 C），无法识别"哪个是原来的"，性能差且状态错乱。

## key 的要求

- **唯一**（同层兄弟间）。
- **稳定**：不随渲染变化。
- 不要用 \`index\`：列表增删/排序时 index 变化导致 key 错配，组件状态串台、性能差。
- 不要用随机值（\`Math.random()\`）：每次都重建。
- 用业务 id 最佳。

## 为什么 index 作 key 有问题

列表 \`[A,B,C]\` 头部插 X → \`[X,A,B,C]\`：
- index 作 key：key=0 的 li 从 A 变 X（复用 li，改内容+内部状态），key=1 从 B 变 A……全部被 patch，且若 li 内有受控/非受控 input，输入框状态跟着 index 走，A 的输入"跑到"X 上。
- id 作 key：X 新建，A/B/C 复用不动，只新增一个。

## 示例：state 串台

\`\`\`jsx
items.map((item, i) => (
  <li key={i}>
    <input />  {/* 非受控 input，有内部 DOM 状态 */}
    {item.name}
  </li>
))
\`\`\`

删第一项时，index key 让所有 li 的内容上移，但 input 的 DOM 实例没换，导致 input 值与 name 不匹配。

## 一句话

React diff 基于三层假设（类型不同重建、同类型更新属性、列表靠 key）；同层比较不跨层；key 让列表复用准确，index 作 key 在增删排序时引发性能差与状态错乱。`
  },
  {
    id: 'react-042',
    category: 'react',
    title: 'React 的渲染流程：render → reconcile → commit 各做什么？',
    difficulty: '困难',
    tags: ['渲染流程', 'reconcile', 'commit', 'Fiber'],
    answer: `## 三大阶段

\`\`\`
状态/props 变化
  → Schedule（调度，决定优先级）
  → Render/Reconcile（协调，可中断）
  → Commit（提交，不可中断）
\`\`\`

## 1. Schedule（调度）

React 18 的 Scheduler 根据**优先级（Lane）**决定何时开始渲染：
- 高优先级（用户输入）：立即。
- 低优先级（transition）：空闲时。
- 进行中的低优先级渲染可被高优先级打断。

## 2. Render / Reconcile（协调，可中断）

遍历 Fiber 树，对每个组件：

1. **调用 render 函数**（函数组件）或类组件的 render，得到新的子元素（React 元素/JSX）。
2. **Diff**：与上次渲染的 Fiber（current 的 alternate）对比，决定更新/新增/删除，在 workInProgress Fiber 上打 **flags**（Placement/Update/Deletion）。
3. **收集副作用链**：把有 flags 的 Fiber 串成链表，供 commit 用。

⚠️ 此阶段：
- **纯计算**，不碰真实 DOM。
- **可中断**：时间片用完或高优先级进来时暂停，下次恢复（从 workInProgress 继续，或丢弃重做）。
- render 函数因此**必须纯函数**（无副作用），可能被调用多次。

## 3. Commit（提交，不可中断）

根据副作用链，**同步**完成 DOM 操作，分三个子阶段：

### beforeMutation
- 读取 DOM 状态（如 getSnapshotBeforeUpdate）。

### Mutation
- 执行 DOM 增删改（按 flags）。
- ref 挂载/卸载。

### Layout
- 同步执行 \`useLayoutEffect\` / \`componentDidMount/Update\`。
- 此时 DOM 已更新，可安全读取布局。

之后异步执行 \`useEffect\`（passive effects），不阻塞绘制。

\`\`\`
Commit:
  beforeMutation → Mutation（DOM 操作）→ Layout（useLayoutEffect）
  → 浏览器绘制
  → passive effects（useEffect 异步）
\`\`\`

## 同步 vs 并发渲染

- **同步模式**（legacy）：Schedule 直接进入 Reconcile，跑完才 Commit，不可中断。
- **并发模式**：Reconcile 可中断分片，Commit 仍同步。

## 触发渲染的原因

- setState/dispatch（useReducer）。
- 父组件重渲染导致子组件重渲染。
- Context value 变化导致消费者重渲染。
- forceUpdate（类组件）。

## 为什么 useEffect 在 commit 后异步

useEffect 不应阻塞浏览器绘制，commit 完成后先让浏览器画屏，再异步跑 effect。若 effect 需在绘制前完成（如读 DOM 布局调整样式避免闪烁），用 useLayoutEffect。

## 一句话

渲染 = Schedule（按优先级）→ Reconcile（调用 render + diff，打 flags，可中断，须纯函数）→ Commit（同步执行 DOM 变更 + useLayoutEffect，之后异步 useEffect）；理解三阶段是理解 React 性能与副作用时机的基础。`
  },
  {
    id: 'react-043',
    category: 'react',
    title: 'React 错误边界（Error Boundaries）怎么用？能捕获哪些错误？',
    difficulty: '中等',
    tags: ['错误边界', 'ErrorBoundary', 'componentDidCatch', '错误处理'],
    answer: `## 作用

捕获**子组件树**在渲染、生命周期、构造函数中抛出的错误，展示降级 UI，避免整个应用白屏。

## 实现（类组件）

只有类组件可做错误边界，需实现 \`static getDerivedStateFromError\` 或 \`componentDidCatch\`：

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }  // 渲染阶段调用，更新 state 显示降级 UI
  }
  componentDidCatch(error, info) {
    // commit 阶段调用，可上报
    logError(error, info.componentStack)
  }
  render() {
    if (this.state.hasError) {
      return <this.props.fallback error={this.state.error} />
    }
    return this.props.children
  }
}

// 使用
<ErrorBoundary fallback={({ error }) => <p>出错了：{error.message}</p>}>
  <Widget />
</ErrorBoundary>
\`\`\`

- \`getDerivedStateFromError\`：渲染期调用，用于更新 state 触发降级 UI。
- \`componentDidCatch\`：commit 期调用，用于副作用（上报日志），能拿到 \`info.componentStack\`。

## 能捕获的错误

- 渲染阶段（render）抛错。
- 生命周期方法抛错。
- 子组件构造函数抛错。

## 不能捕获的错误

- **事件处理函数**中的错误（\`onClick\` 里 throw 不会被边界捕获，需 try/catch）。
- **异步代码**（setTimeout、Promise.then、async/await、requestAnimationFrame）。
- **服务端渲染**（SSR）。
- **错误边界自身**抛错（边界只能捕获子树，不能捕获自己）。

## 与 React 19 的 onErrorCaptured

React 19 新增全局错误处理：

\`\`\`jsx
import { onErrorCaptured } from 'react'
// 在组件内注册（仍需 ErrorBoundary 配合）
\`\`\`

也可用 \`createRoot\` 的 \`onUncaughtError\` / \`onCaughtError\` 回调全局上报。

## 实践

- 在关键区域（路由页、复杂 widget、第三方组件）包裹 ErrorBoundary。
- 顶层兜底一个全局 ErrorBoundary 防白屏。
- 错误上报到 Sentry 等。
- 降级 UI 提供"重试"按钮（重置 state）。

\`\`\`jsx
class ErrorBoundary extends React.Component {
  reset = () => this.setState({ hasError: false })
  render() {
    if (this.state.hasError) return <button onClick={this.reset}>重试</button>
    return this.props.children
  }
}
\`\`\`

## 与 Vue 对比

Vue 用 \`errorCaptured\` 钩子 + \`onErrorCaptured\` 实现类似能力，错误沿组件树冒泡；React 错误边界只捕获子树渲染错误，事件/异步错误需另处理。

## 一句话

错误边界是类组件，用 \`getDerivedStateFromError\`（更新 state）+ \`componentDidCatch\`（上报）捕获子树渲染/生命周期错误；不能捕获事件、异步、SSR 错误，那些需 try/catch 或全局 handler。`
  },
  {
    id: 'react-044',
    category: 'react',
    title: 'React 中的不可变数据为什么重要？Immer 怎么帮忙？',
    difficulty: '中等',
    tags: ['不可变数据', 'Immer', 'setState', '浅比较'],
    answer: `## 为什么强调不可变

React 判断"状态是否变化"主要靠**引用比较**（===）：

\`\`\`jsx
const [user, setUser] = useState({ name: 'a', age: 1 })
user.age = 2
setUser(user)  // ❌ 引用没变，React 认为没变化，不重渲染
\`\`\`

必须创建新对象/数组：

\`\`\`jsx
setUser({ ...user, age: 2 })           // ✅ 新引用
setList([...list, item])                // ✅
setList(list.filter(x => x.id !== id))  // ✅
\`\`\`

## 不可变的好处

1. **触发更新**：新引用让 React 检测到变化。
2. **性能优化**：\`React.memo\`/\`shouldComponentUpdate\` 用浅比较（引用相等），不可变让浅比较可靠。
3. **时间旅行/撤销**：旧状态保留，可回溯。
4. **并发安全**：React 18 并发渲染可能重跑，不可变保证重跑结果一致。
5. **可预测**：不被多处意外修改。

## 手写不可变的痛点

嵌套深时，展开运算符很丑：

\`\`\`jsx
setState({
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'BJ'
    }
  }
})
\`\`\`

## Immer：用可变语法写不可变更新

\`\`\`js
import { produce } from 'immer'

const nextState = produce(state, draft => {
  draft.user.address.city = 'BJ'  // 看似直接改，实则产生新对象
  draft.list.push(item)
})
\`\`\`

- \`produce\` 把 state 转成 draft（Proxy 代理）。
- 你"直接修改" draft，Immer 记录变更。
- 返回**新对象**，未改部分复用旧引用（结构共享）。

## 在 React 中用 Immer

\`\`\`jsx
import { useImmer } from 'use-immer'
const [user, setUser] = useImmer({ name: 'a', address: { city: 'SH' } })
setUser(draft => { draft.address.city = 'BJ' })  // 简洁
\`\`\`

或 \`useImmerReducer\` 简化 reducer。

## Redux Toolkit 内置 Immer

\`\`\`js
const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add(state, action) {
      state.items.push(action.payload)  // 看似可变，Immer 处理
    }
  }
})
\`\`\`

## 不可变操作速查

| 操作 | 写法 |
| --- | --- |
| 更新对象字段 | \`{ ...obj, key: val }\` |
| 更新嵌套 | Immer / 多层展开 |
| 数组追加 | \`[...arr, item]\` |
| 数组前插 | \`[item, ...arr]\` |
| 删除 | \`arr.filter(...)\` |
| 修改某项 | \`arr.map(x => x.id === id ? { ...x, v } : x)\` |
| 排序 | \`[...arr].sort()\`（先复制再排，原数组不变） |

## 一句话

React 靠引用比较判断变化，状态必须不可变更新（创建新对象/数组）才能触发重渲染和可靠浅比较；深嵌套用 Immer 的 produce 以可变语法产生不可变结果，Redux Toolkit 内置。`
  },
  {
    id: 'react-045',
    category: 'react',
    title: 'React.memo / PureComponent / shouldComponentUpdate 有何区别？',
    difficulty: '中等',
    tags: ['React.memo', 'PureComponent', 'shouldComponentUpdate', '浅比较'],
    answer: `## 三者作用

都是**避免不必要重渲染**的优化手段，基于浅比较跳过子树 diff。

## 1. React.memo（函数组件）

高阶组件，对 props 做**浅比较**，相等则跳过重渲染：

\`\`\`jsx
const Child = React.memo(({ name, onClick }) => {
  return <div>{name}</div>
})
\`\`\`

可传第二参数自定义比较：

\`\`\`jsx
const Child = React.memo(Component, (prevProps, nextProps) => {
  // 返回 true 表示相等（跳过渲染），false 表示需要渲染
  return prevProps.id === nextProps.id
})
\`\`\`

## 2. PureComponent（类组件）

继承 \`React.PureComponent\`，自动对 props 和 state 浅比较：

\`\`\`jsx
class Child extends React.PureComponent {
  render() { return <div>{this.props.name}</div> }
}
\`\`\`

等价于 \`Component\` + 实现了默认 \`shouldComponentUpdate\`。

## 3. shouldComponentUpdate（类组件）

手动控制是否重渲染：

\`\`\`jsx
class Child extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.id !== this.props.id  // 返回 false 跳过
  }
  render() { return <div /> }
}
\`\`\`

## 区别对照

| | React.memo | PureComponent | shouldComponentUpdate |
| --- | --- | --- | --- |
| 适用 | 函数组件 | 类组件 | 类组件 |
| 比较 | props 浅比较（默认） | props + state 浅比较 | 自定义 |
| 灵活度 | 可自定义比较 | 固定浅比较 | 完全自定义 |

## 浅比较的含义

浅比较 = 逐个 \`===\` 比较 props 的每个 key，全部相等才认为相等。

⚠️ 因此：
- 传**对象/数组/函数**作为 props 时，每次新建引用不同 → 浅比较失败 → memo 失效。
- 需配合 \`useMemo\`/\`useCallback\` 稳定引用。

\`\`\`jsx
// ❌ memo 失效：onClick 每次新引用
const Child = React.memo(({ onClick }) => <button onClick={onClick}>x</button>)
const Parent = () => <Child onClick={() => {}} />

// ✅ 用 useCallback 稳定
const Parent = () => {
  const handleClick = useCallback(() => {}, [])
  return <Child onClick={handleClick} />
}
\`\`\`

## 何时用

- **纯展示组件、props 少且为原始类型** → memo 效果好。
- **props 含对象/函数** → 配合 useMemo/useCallback。
- **重渲染成本 > 浅比较成本** → 值得 memo。
- **简单组件** → 不必 memo，浅比较本身有开销。

## memo 不是万能

- props 总在变 → memo 没用（每次都比较失败）。
- 子组件依赖 context → memo 挡不住 context 变化导致的重渲染。
- 浅比较对嵌套对象无效（需自定义比较或用 Immer + 引用稳定）。

## 一句话

\`React.memo\`（函数组件，props 浅比较）、\`PureComponent\`（类组件，props+state 浅比较）、\`shouldComponentUpdate\`（类组件，自定义）都是浅比较跳过渲染；props 含对象/函数需 useMemo/useCallback 稳定引用，否则 memo 失效。`
  },
  {
    id: 'react-046',
    category: 'react',
    title: 'Redux 的核心概念与 Redux Toolkit 怎么用？',
    difficulty: '中等',
    tags: ['Redux', 'Redux Toolkit', '状态管理', 'reducer'],
    answer: `## Redux 三大原则

1. **单一数据源**：整个应用的状态在一棵 \`store\` 树里。
2. **状态只读**：只能通过 dispatch action 改变。
3. **纯函数 reducer**：\`(state, action) => newState\`，不可变更新。

## 核心 API

\`\`\`js
// reducer
function counter(state = 0, action) {
  switch (action.type) {
    case 'increment': return state + 1
    default: return state
  }
}
// store
const store = createStore(counter)
store.dispatch({ type: 'increment' })
store.subscribe(() => console.log(store.getState()))
\`\`\`

## 数据流

\`\`\`
UI dispatch(action) → reducer(newState) → store notify subscribers → UI re-render
\`\`\`

单向、可预测、可回放（时间旅行）。

## Redux Toolkit（RTK，官方推荐）

简化 Redux 模板代码：内置 Immer（可变语法写不可变）、自动 createAction/createReducer、配置中间件。

### createSlice

\`\`\`js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    // 看似可变，Immer 处理成不可变
    increment(state) { state.value += 1 },
    add(state, action) { state.value += action.payload }
  }
})
export const { increment, add } = counterSlice.actions
export default counterSlice.reducer
\`\`\`

### configureStore

\`\`\`js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'

export const store = configureStore({
  reducer: { counter: counterReducer }
})
\`\`\`

### 在 React 中用

\`\`\`jsx
import { Provider, useSelector, useDispatch } from 'react-redux'

<Provider store={store}><App /></Provider>

function Counter() {
  const value = useSelector(state => state.counter.value)  // 订阅 selector
  const dispatch = useDispatch()
  return <button onClick={() => dispatch(increment())}>{value}</button>
}
\`\`\`

\`useSelector\` 只订阅 selector 返回的部分，变化才重渲染（需返回新引用才触发）。

### 异步：createAsyncThunk

\`\`\`js
const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  return await api.getUser(id)
})

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (s) => { s.status = 'loading' })
      .addCase(fetchUser.fulfilled, (s, a) => { s.data = a.payload; s.status = 'done' })
      .addCase(fetchUser.rejected, (s) => { s.status = 'error' })
  }
})
// dispatch(fetchUser(1))
\`\`\`

### RTK Query（数据获取）

自动生成缓存、请求、失效逻辑，替代手写 thunk：

\`\`\`js
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query({ query: (id) => \`/user/\${id}\` })
  })
})
// const { data } = api.endpoints.getUser.useQuery(1)
\`\`\`

## 何时用 Redux

- 大型应用、状态被多处共享且交互复杂。
- 需要时间旅行、状态回放、持久化。
- 中大型团队需要规范化的状态流。

中小项目可用 Context + useReducer 或 Zustand。

## 一句话

Redux 遵循单一数据源/只读/纯 reducer 三原则；RTK 用 createSlice（Immer 可变语法）+ configureStore 简化模板；异步用 createAsyncThunk，数据获取用 RTK Query；React 中用 useSelector/useDispatch 订阅与派发。`
  },
  {
    id: 'react-047',
    category: 'react',
    title: '常见状态管理方案对比：Context / Redux / Zustand / Jotai 怎么选？',
    difficulty: '困难',
    tags: ['状态管理', 'Context', 'Redux', 'Zustand', 'Jotai'],
    answer: `## 方案概览

| 方案 | 模式 | 适用 | 学习成本 |
| --- | --- | --- | --- |
| Context + useReducer | 内置，Provider 树 | 中小、低频全局 | 低 |
| Redux / RTK | 单 store + action/reducer | 大型、复杂交互、需回放 | 中高 |
| Zustand | 单 store + hook 订阅 | 中大型、灵活 | 低 |
| Jotai | 原子化（atom） | 细粒度、派生多 | 中 |
| Recoil | 原子化（Facebook） | 细粒度 | 中 |
| MobX | 可观察对象（响应式） | 偏 OOP、自动追踪 | 中 |

## 1. Context + useReducer

\`\`\`jsx
const [state, dispatch] = useReducer(reducer, init)
<AppContext.Provider value={{ state, dispatch }}>
\`\`\`

- ✅ 内置无依赖。
- ✅ 适合主题、用户、i18n 等低频全局。
- ❌ value 变化导致所有 useContext 消费者重渲染（性能差，见 react-034）。
- ❌ 高频更新不适合。

## 2. Redux / RTK

- ✅ 单一 store，时间旅行，生态成熟。
- ✅ 中间件、DevTools 强大。
- ✅ 适合大型应用、团队协作。
- ❌ 模板多（RTK 已简化）。
- ❌ 小项目过重。

## 3. Zustand（推荐中小项目）

极简的 store + hook：

\`\`\`js
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}))

// 组件
const count = useStore(state => state.count)  // 只订阅 count
const increment = useStore(state => state.increment)
\`\`\`

- ✅ API 极简，无 Provider。
- ✅ selector 订阅，性能好（只订阅需要的部分）。
- ✅ 可在组件外访问 store。
- ✅ 支持 middleware（persist、devtools）。
- ❌ 状态组织靠开发者自觉。

## 4. Jotai（原子化）

把状态拆成最小原子，组件订阅原子，派生原子自动更新：

\`\`\`js
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)
const doubleAtom = atom(get => get(countAtom) * 2)  // 派生

function Comp() {
  const [count, setCount] = useAtom(countAtom)
  const [double] = useAtom(doubleAtom)
}
\`\`\`

- ✅ 细粒度订阅，性能极佳。
- ✅ 派生状态天然支持。
- ✅ 适合状态间依赖复杂的场景。
- ❌ 概念多（atom family、async atom）。
- ❌ 全局状态组织不如 Redux 直观。

## 选型建议

\`\`\`
小型 / 低频全局 → Context + useReducer
中小 / 灵活 / 高频 → Zustand
大型 / 复杂交互 / 需回放 / 团队 → Redux Toolkit
细粒度 / 大量派生 → Jotai
偏 OOP / 自动追踪 → MobX
\`\`\`

## 性能维度

- Context：value 变全量重渲染（差）。
- Redux/Zustand：selector 订阅（好）。
- Jotai/Recoil：原子订阅（最好）。

## 数据获取

若主要需求是"从服务端取数据并缓存"，优先 RTK Query / React Query / SWR，而非用状态管理库存原始数据。

## 一句话

Context 适合低频全局；Redux/RTK 适合大型复杂；Zustand 极简灵活适合中小；Jotai 原子化细粒度适合大量派生；数据获取优先 React Query/RTK Query。`
  },
  {
    id: 'react-048',
    category: 'react',
    title: 'React Router v6 的路由、嵌套、loader/action 和数据加载怎么用？',
    difficulty: '中等',
    tags: ['React Router', 'v6', 'loader', 'action', '嵌套路由'],
    answer: `## 基本配置

\`\`\`jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'user/:id', element: <User /> }
    ]
  }
])

<RouterProvider router={router} />
\`\`\`

## 嵌套路由与 Outlet

父路由用 \`<Outlet />\` 渲染子路由：

\`\`\`jsx
function Layout() {
  return (
    <div>
      <nav>...</nav>
      <Outlet />
    </div>
  )
}
\`\`\`

## 动态参数与 useParams

\`\`\`jsx
function User() {
  const { id } = useParams()
  return <div>User {id}</div>
}
\`\`\`

## 编程式导航

\`\`\`jsx
import { useNavigate, Link, NavLink } from 'react-router-dom'
const navigate = useNavigate()
navigate('/user/1')
navigate(-1)
<Link to="/about">About</Link>
\`\`\`

## loader：路由级数据加载（v6.4+）

在路由跳转前加载数据，组件直接用 \`useLoaderData\`：

\`\`\`jsx
const router = createBrowserRouter([{
  path: '/user/:id',
  loader: async ({ params }) => {
    return await api.getUser(params.id)
  },
  Component: User
}])

function User() {
  const user = useLoaderData()  // 已加载好的数据
  return <div>{user.name}</div>
}
\`\`\`

- loader 在导航时执行，数据就绪后才渲染组件。
- 配合 \`<Suspense>\` + \`defer\` 实现流式加载。

## action：表单提交与 mutation（v6.4+）

\`\`\`jsx
{
  path: '/login',
  action: async ({ request }) => {
    const formData = await request.formData()
    const user = await api.login(formData)
    return user  // 或 redirect('/dashboard')
  }
}
\`\`\`

配合 \`<Form>\` 组件自动提交到 action：

\`\`\`jsx
<Form method="post" action="/login">
  <input name="username" />
  <button type="submit">登录</button>
</Form>
\`\`\`

## 错误处理

\`\`\`jsx
{
  path: '/user/:id',
  loader: () => fetch(...),
  ErrorBoundary: UserError  // 该路由出错时显示
}
\`\`\`

\`useRouteError\` 拿到错误对象。

## 嵌套路由与相对路径

子路由 path 不以 \`/\` 开头则为相对路径，自动拼接父路径：

\`\`\`jsx
{ path: 'user/:id', children: [{ path: 'posts', element: <Posts /> }] }
// /user/1/posts
\`\`\`

## 守卫/鉴权

\`\`\`jsx
{
  path: '/admin',
  loader: () => {
    if (!isAuth()) throw redirect('/login')
    return null
  },
  Component: Admin
}
\`\`\`

或在 Layout 组件内判断后 \`<Navigate to="/login" />\`。

## 懒加载

\`\`\`jsx
{ path: 'about', lazy: () => import('./About').then(m => ({ Component: m.default })) }
\`\`\`

## 与 v5 区别

- \`<Switch>\` → \`<Routes>\`，\`<Route>\` 用 \`element\` 而非 \`component\`。
- 路由匹配更严格，无 \`exact\`。
- \`useNavigate\` 替代 \`useHistory\`。
- v6.4+ 引入 loader/action/data router。

## 一句话

Router v6 用 createBrowserRouter + RouterProvider；嵌套靠 children + \`<Outlet />\`；v6.4+ 的 loader/action 在路由层做数据加载与 mutation，配合 \`<Form>\`/useLoaderData/useRouteError 实现 React Router 全栈数据流。`
  },
  {
    id: 'react-049',
    category: 'react',
    title: 'React 中如何避免不必要的重渲染？',
    difficulty: '中等',
    tags: ['重渲染', '性能', 'memo', '优化'],
    answer: `## 什么时候会重渲染

1. 组件自身 state 变化。
2. 父组件重渲染 → 所有子组件默认重渲染（无论 props 是否变）。
3. Context value 变化 → 所有 useContext 消费者重渲染。
4. dispatch setState。

## 优化手段

### 1. React.memo 子组件

\`\`\`jsx
const Child = React.memo(({ data }) => <div>{data}</div>)
\`\`\`

props 浅比较相等则跳过。**前提**：props 引用稳定。

### 2. useMemo / useCallback 稳定 props

\`\`\`jsx
const handleClick = useCallback(() => {}, [])
const data = useMemo(() => ({ a: 1 }), [])
return <Child onClick={handleClick} data={data} />
\`\`\`

避免每次渲染新建引用导致 memo 失效。

### 3. state 下沉

把状态放到真正需要它的子组件，避免顶层 state 变化波及整棵树：

\`\`\`jsx
// ❌ 顶部 state 变化导致所有子组件重渲染
function App() {
  const [input, setInput] = useState('')
  return <><Header /><Search input={input} /><List /></>
}
// ✅ input 状态放 Search 内部
function App() {
  return <><Header /><Search /><List /></>
}
\`\`\`

### 4. 拆分 Context

把频繁变化和低频变化的 state 分到不同 Context（见 react-034）。

### 5. 列表 key

正确 key 让列表 diff 精准，减少 DOM 操作（见 react-041）。

### 6. 虚拟化长列表

万级数据用 \`react-window\`/\`react-virtualized\` 只渲染可见项。

### 7. useTransition / useDeferredValue

把昂贵更新降为低优先级，不阻塞输入（见 react-036/037）。

### 8. useMemo 昂贵计算

\`\`\`jsx
const sorted = useMemo(() => heavySort(data), [data])
\`\`\`

### 9. 避免在渲染中创建大对象/函数

把静态配置提到组件外：

\`\`\`jsx
const OPTIONS = { /* 大对象 */ }  // 模块级，不随渲染重建
function Comp() { return <Chart options={OPTIONS} /> }
\`\`\`

### 10. useRef 存不需要驱动 UI 的值

定时器 ID、上一次值等放 ref，避免 setState 触发多余渲染。

### 11. 不可变更新

保证 memo 浅比较可靠（见 react-044）。

## 判断是否需要优化

- **不是所有重渲染都需要优化**：React 本身很快，简单组件重渲染成本极低。
- 用 React DevTools Profiler 测量：找到耗时 > 几 ms 的组件再优化。
- 过度 memo 反而增加开销（比较成本 + 代码复杂度）。

## 常见误区

- "加了 memo 就一定快"：props 不稳定时 memo 失效。
- "useCallback 总是好"：传给原生元素的回调不需要。
- "useMemo 任意值都缓存"：简单计算缓存比直接算慢。

## 优化决策树

\`\`\`
1. Profiler 是否显示该组件耗时？
  否 → 不优化
  是 → 2
2. 重渲染原因是 props 变化还是父组件？
  父组件 → 用 memo + 稳定 props
  props 变化 → props 是否本就该变？是则合理；否则用 useMemo/useCallback 稳定
3. 列表/大计算 → key/useMemo/虚拟化
\`\`\`

## 一句话

避免不必要重渲染 = memo 子组件 + useMemo/useCallback 稳定 props + state 下沉 + 拆 Context + 虚拟化长列表 + useTransition；但应先用 Profiler 定位再优化，避免过度优化。`
  },
  {
    id: 'react-050',
    category: 'react',
    title: 'React 高阶组件（HOC）和 Render Props 模式怎么用？',
    difficulty: '困难',
    tags: ['HOC', 'Render Props', '复用', '设计模式'],
    answer: `## 共同目标

复用**组件逻辑**（状态、副作用、数据处理），把逻辑与 UI 分离。Hook 出现后这两种模式用得少了，但仍需理解（尤其读老代码、写库）。

## HOC（高阶组件）

HOC 是**接收组件返回新组件**的函数：

\`\`\`jsx
function withLoading(Wrapped) {
  return function WrappedWithLoading({ isLoading, ...rest }) {
    if (isLoading) return <Spinner />
    return <Wrapped {...rest} />
  }
}

const UserList = withLoading(({ users }) => <ul>{users.map(...)}</ul>)
// <UserList isLoading={...} users={...} />
\`\`\`

### 经典：withRouter / connect（Redux）

\`\`\`jsx
const ConnectedComp = connect(mapStateToProps, mapDispatchToProps)(Comp)
\`\`\`

### HOC 注意事项

- **不要修改原组件**（应组合而非继承）。
- **透传无关 props**：\`{...rest}\`，避免吞掉 props。
- **ref 透传**：HOC 包裹后 ref 指向 HOC，需 forwardRef 转发。
- **displayName**：方便 DevTools 调试。

\`\`\`jsx
function withX(Wrapped) {
  function HOC(props) { return <Wrapped {...props} /> }
  HOC.displayName = \`withX(\${Wrapped.displayName || Wrapped.name})\`
  return HOC
}
\`\`\`

- **静态方法丢失**：HOC 返回的新组件没有原组件的静态方法，需手动复制。
- **多个 HOC 嵌套**：\`withA(withB(withC(Comp)))\`，顺序敏感，调试难。

## Render Props

通过一个**返回 React 元素的函数 prop**（通常叫 render）共享逻辑：

\`\`\`jsx
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 }
  handleMove = (e) => this.setState({ x: e.clientX, y: e.clientY })
  render() {
    return (
      <div onMouseMove={this.handleMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

<MouseTracker render={({ x, y }) => <p>{x},{y}</p>} />
\`\`\`

### children 作为 render prop

\`\`\`jsx
<MouseTracker>{({ x, y }) => <p>{x},{y}</p>}</MouseTracker>
// 内部：this.props.children(this.state)
\`\`\`

React Router v5 的 \`<Route>\`、动画库 \`<Motion>\` 都用此模式。

### Render Props 注意

- **PureComponent 与内联函数**：内联 render prop 每次新建，若 MouseTracker 是 PureComponent 会失效。可在渲染外定义函数或用其他方式。
- **回调地狱**：嵌套深时难读。

## Hook 取代两者

\`\`\`jsx
// 用 Hook 复用鼠标位置逻辑
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return pos
}

function App() {
  const { x, y } = useMouse()
  return <p>{x},{y}</p>
}
\`\`\`

Hook 优势：
- 无嵌套地狱。
- 无 wrapper 层（DevTools 组件树更干净）。
- 无 props 透传/静态方法丢失问题。
- 更易 TS 类型推导。

## 三者对比

| | HOC | Render Props | Hook |
| --- | --- | --- | --- |
| 形式 | 函数包组件 | 函数 prop | 函数 |
| 嵌套 | wrapper 嵌套 | 回调嵌套 | 扁平 |
| props 冲突 | 可能 | 少 | 无 |
| TS | 弱 | 中 | 强 |
| 现代推荐 | 少用 | 少用 | 首选 |

## 何时仍用 HOC

- 在组件外部拦截/增强（错误边界、权限、埋点）。
- 需要返回新组件类型（第三方库 API 约定）。

## 一句话

HOC 是"组件 → 组件"的函数，注意透传 props/ref/静态方法和 displayName；Render Props 用函数 prop 共享逻辑；两者在现代 React 多被自定义 Hook 取代，Hook 更扁平、TS 更友好，但 HOC 仍在拦截增强场景有用。`
  },
  {
    id: 'react-051',
    category: 'react',
    title: 'React Portals 怎么用？常见的使用场景？',
    difficulty: '中等',
    tags: ['Portals', 'createPortal', '弹窗', '事件冒泡'],
    answer: `## 作用

\`createPortal\` 把子节点渲染到 **DOM 树的其他位置**（通常是 body 下的容器），但**逻辑上仍属于当前组件树**——保留 context、事件冒泡等 React 语义。

\`\`\`jsx
import { createPortal } from 'react-dom'

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.body  // 渲染目标
  )
}
\`\`\`

## 为什么需要

弹窗、Tooltip、Toast 等浮层，如果在组件内部渲染：

1. **父级有 \`transform/overflow:hidden/z-index\` 时 \`position:fixed\` 失效**（transform 建立包含块）。
2. 层级嵌套深，z-index 难管理。
3. 样式被父级污染。

Portal 把 DOM 物理移到 body，规避以上问题。

## 事件冒泡仍按 React 树

即使 DOM 在 body 下，**React 事件仍按组件树冒泡**：

\`\`\`jsx
function App() {
  const handleClick = () => console.log('app click')
  return (
    <div onClick={handleClick}>
      <Modal>
        <button>点我</button>  {/* 点击会冒泡到 App 的 onClick */}
      </Modal>
    </div>
  )
}
\`\`\`

因为 React 事件委托到根容器，按 Fiber 树（而非 DOM 树）冒泡。这是 Portal 与直接 DOM 操作的关键区别——上下文/context/事件都正常。

## context 仍可访问

Portal 内的组件仍能 useContext 父级 Provider，因为它在 React 树里没动。

## 常见场景

- **Modal/Dialog**：遮罩 + 居中弹窗。
- **Tooltip/Popover**：跟随元素但避免被父级裁切。
- **Toast/Notification**：固定在角落。
- **Select 下拉**：长列表下拉避免被父 \`overflow:hidden\` 截断。

## 实现 Modal 示例

\`\`\`jsx
function Modal({ open, onClose, children }) {
  if (!open) return null
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}
\`\`\`

## 与 Vue Teleport 对比

Vue 的 \`<Teleport to="body">\` 几乎是同一概念，连 API 思路都一致。

## 注意

- 目标容器需存在（\`document.body\` 总在）。
- SSR 中 \`document\` 不存在，需在 effect 内创建或用条件。
- 卸载时 React 自动清理 Portal 的 DOM。

## 一句话

\`createPortal(children, container)\` 把 DOM 渲染到别处但保留 React 树语义（事件冒泡、context）；专治弹窗/浮层的 fixed 失效与层级问题，概念同 Vue Teleport。`
  },
  {
    id: 'react-052',
    category: 'react',
    title: 'React StrictMode 有什么作用？为什么会有双调用？',
    difficulty: '中等',
    tags: ['StrictMode', '双调用', '开发模式', '副作用'],
    answer: `## 作用

\`<StrictMode>\` 是开发模式下的**辅助检查工具**，不渲染可见 UI，仅在生产构建中被移除。它帮助发现：

1. **不安全的生命周期**（ componentWillMount 等已废弃）。
2. **过时/ref API 警告**（string ref、findDOMNode）。
3. **意外的副作用**（通过双调用暴露）。
4. **legacy context API 警告**。

\`\`\`jsx
import { StrictMode } from 'react'

<StrictMode>
  <App />
</StrictMode>
\`\`\`

## 双调用（开发期）

StrictMode 在开发模式下**故意双调用**以下函数，以暴露副作用问题：

- 函数组件**渲染函数**（render）。
- \`useState\`/\`useMemo\`/\`useReducer\` 的**初始化函数**。
- \`useEffect\` 的 setup 和 cleanup（setup → cleanup → setup）。
- \`useLayoutEffect\` 同理。

## 为什么要双调用

React 18 的**并发渲染**可能中断、恢复、重跑渲染。因此：

- **渲染函数必须是纯函数**：不能有副作用（改全局变量、写 localStorage、发请求）。双调用让副作用暴露（你会看到请求发两次、变量被改两次）。
- **effect 的 setup/cleanup 必须可重复**：订阅 → 取消 → 再订阅应等价于只订阅一次。双调用验证 cleanup 正确性。

\`\`\`jsx
// ❌ 渲染函数有副作用（双调用暴露）
let counter = 0
function Bad() {
  counter++  // 渲染期改全局 → 双调用变成 +2
  return <div />
}

// ✅ 副作用放 effect
function Good() {
  useEffect(() => { logMount() }, [])
  return <div />
}
\`\`\`

## 生产环境

StrictMode **只影响开发**，生产构建无任何额外调用/开销，可放心保留。

## 常见"惊吓"

- effect 跑两次 → 检查是否漏 cleanup（订阅/请求/定时器）。
- API 被调用两次 → 把请求移到事件处理或加幂等，或仅作开发期现象理解。
- useState 初始化函数跑两次 → 确保它是纯函数（如 \`loadFromStorage\` 读取无害）。

## 不应规避 StrictMode

- ❌ 不要为消除双调用而删除 StrictMode。
- ❌ 不要用 ref 标记"已执行"绕过双调用（这会掩盖真实 bug，且并发模式下仍可能出错）。
- ✅ 正确做法：写纯渲染函数 + 完整 cleanup 的 effect。

## 与并发渲染的关系

并发模式下渲染可中断重跑，StrictMode 的双调用正是模拟这种情况，让你的代码在并发模式下安全。

## 一句话

StrictMode 是开发期检查工具，通过双调用渲染/effect 暴露副作用与 cleanup 问题，确保代码在并发渲染下安全；生产无影响；不要规避，应写出纯渲染函数和可重复的 effect setup/cleanup。`
  },
  {
    id: 'react-053',
    category: 'react',
    title: 'React 中的 Suspense 如何用于数据获取？',
    difficulty: '困难',
    tags: ['Suspense', '数据获取', '并发', 'fallback'],
    answer: `## Suspense 基本用法

让组件"挂起"等待异步资源，期间显示 fallback：

\`\`\`jsx
<Suspense fallback={<Spinner />}>
  <Profile />
</Suspense>
\`\`\`

\`Profile\` 内部若抛出 Promise（"挂起"），Suspense 显示 \`<Spinner />\`，Promise resolve 后重新渲染 \`<Profile />\`。

## 早期 Suspense：code-splitting

最初只用于 \`React.lazy\` 异步组件：

\`\`\`jsx
const LazyComp = React.lazy(() => import('./Heavy'))
<Suspense fallback={<Spinner />}><LazyComp /></Suspense>
\`\`\`

## React 18：Suspense for Data Fetching

并发模式下，Suspense 可用于**任意数据获取**，配合"抛 Promise"的协议：

\`\`\`jsx
function fetchData(url) {
  const cache = ...
  if (cache.has(url)) return cache.get(url)  // 已就绪直接返回
  throw fetch(url).then(r => cache.set(url, r))  // 未就绪抛 Promise
}

function Profile({ id }) {
  const user = fetchData(\`/api/user/\${id}\`)  // 内部可能 throw Promise
  return <div>{user.name}</div>
}

<Suspense fallback={<Spinner />}><Profile id={1} /></Suspense>
\`\`\`

数据未就绪 → \`fetchData\` throw Promise → Suspense 显示 fallback → Promise resolve → 重渲染 \`Profile\` → \`fetchData\` 返回数据。

## 配合 React Query / SWR / RTK Query

这些库内置 Suspense 支持，无需手写抛 Promise：

\`\`\`jsx
const { useQuery } = ... // React Query
function Profile() {
  const { data } = useQuery({ queryKey: ['user'], queryFn: ..., suspense: true })
  return <div>{data.name}</div>
}
<Suspense fallback={<Spinner />}><Profile /></Suspense>
\`\`\`

## 嵌套 Suspense

\`\`\`jsx
<Suspense fallback={<PageSpinner />}>
  <Header />
  <Suspense fallback={<ListSpinner />}>
    <List />  {/* List 慢，只显示局部 spinner，Header 已显示 */}
  </Suspense>
</Suspense>
\`\`\`

内层挂起不影响外层已就绪部分，实现"流式"渲染。

## 与 transitions 配合

\`\`\`jsx
const [isPending, startTransition] = useTransition()
function navigate(id) {
  startTransition(() => setId(id))  // 低优先级
}
<Suspense fallback={<Spinner />}><Profile id={id} /></Suspense>
\`\`\`

切换数据时，旧内容保持显示直到新数据就绪（避免 spinner 闪烁），\`isPending\` 指示进行中。

## 与 ErrorBoundary 配合

数据获取失败抛 Error，需 ErrorBoundary 捕获：

\`\`\`jsx
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Spinner />}>
    <Profile />
  </Suspense>
</ErrorBoundary>
\`\`\`

## RSC 中的 Suspense

Server Component 可直接 \`await\`，Suspense 协调流式传输：

\`\`\`jsx
<Suspense fallback={<Skeleton />}>
  <SlowServerList />  {/* 服务端 async 组件 */}
</Suspense>
\`\`\`

## 注意

- **手写 Suspense 数据源较复杂**（需缓存 + 抛 Promise 协议），实践中用 React Query/SWR/RTK Query。
- Suspense 不替代 loading 状态管理的所有场景，适合"声明式等待资源"。
- 并发模式下才能发挥完整能力（需 createRoot）。

## 一句话

Suspense 让组件"抛 Promise"挂起、外层显示 fallback、就绪后恢复渲染；React 18 起可用于数据获取，配合 React Query/RTK Query 声明式等待资源，支持嵌套流式渲染与 transitions 协同。`
  },
  {
    id: 'react-054',
    category: 'react',
    title: 'React 中 forwardRef 和 useImperativeHandle 怎么配合使用？',
    difficulty: '中等',
    tags: ['forwardRef', 'useImperativeHandle', 'ref', '组件通信'],
    answer: `## 背景

React 默认**不允许给函数组件传 ref**（ref 是特殊 prop，不会被普通 props 接收）。要让子组件能接收父组件的 ref，需 \`forwardRef\`。

## forwardRef 基本用法

\`\`\`jsx
const Input = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} />
))

// 父
const inputRef = useRef()
<Input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>聚焦</button>
\`\`\`

第二参数 \`ref\` 就是父传来的 ref，转发给内部 DOM。

## useImperativeHandle：自定义暴露的方法

默认 ref 指向 DOM 元素。若想**只暴露特定方法**（而非整个 DOM），用 \`useImperativeHandle\`：

\`\`\`jsx
const FancyInput = React.forwardRef((props, ref) => {
  const inputRef = useRef()
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' }
    // 不暴露整个 input，只暴露 focus/clear
  }), [])
  return <input ref={inputRef} />
})

// 父
const ref = useRef()
<FancyInput ref={ref} />
ref.current.focus()  // ✅
ref.current.value    // ❌ undefined，没暴露
\`\`\`

## 签名

\`\`\`js
useImperativeHandle(ref, createHandle, deps?)
\`\`\`

- \`ref\`：父传来的 ref。
- \`createHandle\`：返回暴露对象的函数。
- \`deps\`：依赖数组，变化时重建 handle（不传则每次渲染都重建，建议传依赖或 \`[]\`）。

## 类组件对比

类组件的 ref 直接指向实例，可访问实例方法/属性。函数组件无实例，\`forwardRef + useImperativeHandle\` 是等价方案。

## 应用场景

- 表单组件暴露 \`focus/validate/reset\`。
- 播放器组件暴露 \`play/pause/seek\`。
- 自定义滚动组件暴露 \`scrollTo\`。
- 高阶组件转发 ref（HOC 包裹后 ref 默认丢失）。

## HOC 中转发 ref

\`\`\`jsx
function withLog(Wrapped) {
  class HOC extends React.Component {
    render() {
      const { forwardedRef, ...rest } = this.props
      return <Wrapped ref={forwardedRef} {...rest} />
    }
  }
  return React.forwardRef((props, ref) => <HOC {...props} forwardedRef={ref} />)
}
\`\`\`

## React 19 的简化

React 19 起，**ref 可作为普通 prop** 传递，函数组件可直接接收 \`ref\` prop，不再需要 forwardRef：

\`\`\`jsx
// React 19
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
<Input ref={inputRef} />
\`\`\`

\`forwardRef\` 仍可用（兼容），但新代码可省略。

## 注意

- 优先用 **props 传递方法**而非 ref 命令式调用，保持声明式。
- ref 命令式交互用于"props 难以表达"的场景（聚焦、滚动到位置、触发动画）。
- \`useImperativeHandle\` 的 deps 要写对，否则 handle 不更新。

## 一句话

\`forwardRef\` 让函数组件能接收并转发 ref；\`useImperativeHandle\` 自定义暴露给父的对象（只暴露特定方法）；React 19 起 ref 可作普通 prop，forwardRef 可省。`
  },
  {
    id: 'react-055',
    category: 'react',
    title: 'Class 组件的生命周期有哪些？和函数组件如何对应？',
    difficulty: '中等',
    tags: ['生命周期', 'Class组件', '函数组件', 'Hooks'],
    answer: `## Class 组件生命周期三阶段

### 1. 挂载

- \`constructor\`：初始化 state、绑定方法。
- \`static getDerivedStateFromProps\`：从 props 派生 state（少用）。
- \`render\`：返回 JSX（纯函数）。
- \`componentDidMount\`：挂载后，发请求、订阅、操作 DOM。

### 2. 更新

- \`static getDerivedStateFromProps\`
- \`shouldComponentUpdate\`：返回 false 跳过渲染（性能优化）。
- \`render\`
- \`getSnapshotBeforeUpdate\`：DOM 更新前读取布局信息（如滚动位置），传给 componentDidUpdate。
- \`componentDidUpdate\`：更新后，副作用（慎，易死循环）。

### 3. 卸载

- \`componentWillUnmount\`：清理定时器、订阅、请求。

### 错误处理

- \`static getDerivedStateFromError\`：渲染期，更新 state 显示降级 UI。
- \`componentDidCatch\`：commit 期，上报错误。

## 与函数组件对应

| Class | 函数组件（Hooks） |
| --- | --- |
| constructor（state 初始化） | \`useState\` |
| componentDidMount | \`useEffect(fn, [])\` |
| componentDidUpdate | \`useEffect(fn, [deps])\`（首次也跑） |
| componentWillUnmount | \`useEffect\` 的 cleanup |
| shouldComponentUpdate | \`React.memo\` |
| getSnapshotBeforeUpdate | \`useLayoutEffect\` |
| getDerivedStateFromProps | 渲染中根据 props 计算（或 \`useMemo\`） |
| getDerivedStateFromError / componentDidCatch | 错误边界（仍需类组件） |
| this.state / this.setState | \`useState\` / \`useReducer\` |
| this.forceUpdate | \`useReducer\` 的 \`{ type: 'force' }\` 或 \`useState\` 翻转 |

## 关键差异

### 副作用时机

\`\`\`jsx
// Class：componentDidMount + componentDidUpdate 分开
componentDidMount() { fetchData() }
componentDidUpdate(prev) { if (prev.id !== this.props.id) fetchData() }

// 函数：useEffect 统一
useEffect(() => { fetchData() }, [id])  // 首次+id变化都跑
\`\`\`

### 清理

\`\`\`jsx
// Class
componentDidMount() { this.sub = subscribe() }
componentWillUnmount() { this.sub.unsubscribe() }

// 函数：setup + return cleanup
useEffect(() => {
  const sub = subscribe()
  return () => sub.unsubscribe()
}, [])
\`\`\`

## 已废弃的钩子（React 17+）

- \`componentWillMount\` / \`componentWillReceiveProps\` / \`componentWillUpdate\`：在并发渲染下不安全（可能多次调用），加 \`UNSAFE_\` 前缀警告，建议迁移。

## 函数组件的优势

- 逻辑按**功能**聚合（一个 useEffect 处理一个副作用），而非按生命周期分散。
- 无 \`this\` 绑定问题。
- 状态复用靠自定义 Hook，比 HOC/render props 简洁。

## 何时仍用 Class

- 错误边界（函数组件暂不能做）。
- 老项目维护。
- 需要 \`PureComponent\` 的特殊情况（多数用 \`React.memo\` 替代）。

## 一句话

Class 生命周期分挂载/更新/卸载/错误四阶段；函数组件用 useEffect（setup+cleanup+deps）统一替代 mount/update/unmount，React.memo 替代 shouldComponentUpdate，useLayoutEffect 替代 getSnapshotBeforeUpdate；错误边界仍需 Class。`
  },
  {
    id: 'react-056',
    category: 'react',
    title: 'React 中受控组件与非受控组件的区别？',
    difficulty: '简单',
    tags: ['受控组件', '非受控组件', '表单', 'ref'],
    answer: `## 受控组件（Controlled）

表单元素的值由 **React state** 驱动，通过 \`onChange\` 同步：

\`\`\`jsx
function Form() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
\`\`\`

- 数据源：React state。
- 修改：通过 setState。
- 可即时校验、格式化、条件禁用。

## 非受控组件（Uncontrolled）

表单元素自己维护状态，React 通过 **ref** 读取：

\`\`\`jsx
function Form() {
  const inputRef = useRef()
  return (
    <>
      <input defaultValue="hello" ref={inputRef} />
      <button onClick={() => console.log(inputRef.current.value)}>提交</button>
    </>
  )
}
\`\`\`

- 用 \`defaultValue\`/\`defaultChecked\` 设初值（非 value/checked）。
- 提交时用 ref 读取。
- 更接近传统 HTML 表单。

## 对比

| | 受控 | 非受控 |
| --- | --- | --- |
| 数据源 | React state | DOM |
| 读取 | state | ref.current.value |
| 即时校验/格式化 | ✅ 容易 | ❌ 难 |
| 重置 | setState | 操作 DOM |
| 性能（每次按键重渲染） | 每次触发 | 不触发 |
| 集成非 React 代码 | 难 | 易 |

## 何时用受控

- 需要即时校验、格式化、禁用。
- 值驱动其他 UI（如根据输入显示建议）。
- 提交前需要处理数据。
- 多个表单联动。

## 何时用非受控

- 一次性提交，不需中间处理。
- 集成非 React 代码（如 jQuery 插件表单）。
- 大型表单避免每次按键重渲染。
- 文件输入 \`<input type="file">\`（只能非受控，value 只读）。

## 混合：受控字段 + 非受控提交

\`\`\`jsx
function Form() {
  const [name, setName] = useState('')   // 受控（需校验）
  const notesRef = useRef()              // 非受控（备注，不处理）
  const submit = () => api.post({ name, notes: notesRef.current.value })
  return <><input value={name} onChange={...} /><textarea ref={notesRef} /></>
}
\`\`\`

## 文件上传

\`\`\`jsx
const fileRef = useRef()
<input type="file" ref={fileRef} />
const file = fileRef.current.files[0]  // 读取
\`\`\`

\`<input type="file">\` 的 value 只读，必须非受控。

## 性能考量

受控输入每次按键 → setState → 重渲染。大表单可能卡顿，可：
- 用非受控 + 提交时校验。
- 用 debounce 减少 state 更新。
- 用 useDeferredValue 降低优先级。

## 一句话

受控组件由 state 驱动 + onChange 同步，适合需即时校验/联动的字段；非受控组件由 DOM 维护 + ref 读取，适合一次性提交/集成非 React 代码/文件上传；可混合使用。`
  },
  {
    id: 'react-057',
    category: 'react',
    title: 'React 19 有哪些重要新特性？',
    difficulty: '困难',
    tags: ['React 19', 'Actions', 'useFormStatus', 'useOptimistic', '新特性'],
    answer: `## 概述

React 19（2024 稳定）聚焦：Actions 简化异步提交、ref 作 prop、资源加载、文档元数据、Server Components 稳定等。

## 1. Actions（异步动作）

把异步函数传给 \`<form action>\` 或 \`useTransition\`，React 自动管理 pending/error/optimistic 状态：

\`\`\`jsx
async function submit(formData) {
  await api.post(formData)
}
<form action={submit}>  {/* 自动处理 pending */}
  <button>提交</button>
</form>
\`\`\`

配合 \`useFormStatus\`/\`useFormState\`/\`useOptimistic\` 读取状态。

## 2. useFormStatus

在表单内部子组件读取提交状态（无需手动传 pending prop）：

\`\`\`jsx
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? '提交中...' : '提交'}</button>
}
<form action={submit}><SubmitButton /></form>
\`\`\`

## 3. useActionState（原 useFormState）

管理 action 的状态与返回值：

\`\`\`jsx
const [state, formAction, isPending] = useActionState(async (prev, formData) => {
  const result = await api.post(formData)
  return result.error ? { error: result.error } : { success: true }
}, { error: null })

<form action={formAction}>...</form>
\`\`\`

\`isPending\` 替代手动 useTransition。

## 4. useOptimistic

乐观更新：提交时立即显示预期结果，失败再回滚：

\`\`\`jsx
function ThumbsUp({ likes }) {
  const [optimisticLikes, addOptimistic] = useOptimistic(likes, (state, newLike) => state + newLike)
  async function action() {
    addOptimistic(1)              // 立即 +1（乐观）
    await api.like()              // 真实请求
  }
  return <form action={action}><button>👍 {optimisticLikes}</button></form>
}
\`\`\`

请求失败自动回滚到真实 state。

## 5. ref 作普通 prop

函数组件可直接接收 \`ref\` prop，省去 forwardRef：

\`\`\`jsx
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
<Input ref={myRef} />
\`\`\`

## 6. 文档元数据支持

组件内可直接写 \`<title>\`/\`<meta>\`/\`<link>\`，React 自动 hoist 到 \`<head>\`：

\`\`\`jsx
function Page() {
  return (
    <>
      <title>页面标题</title>
      <meta name="description" content="..." />
      <Content />
    </>
  )
}
\`\`\`

无需 react-helmet。

## 7. 资源加载 API

\`preload\`/\`preinit\`/\`prefetchDNS\`/\`preconnect\` 程序化预加载：

\`\`\`jsx
import { preload, preinit } from 'react-dom'
preload('/font.woff2', { as: 'font' })
preinit('/style.css', { as: 'style' })
\`\`\`

## 8. use() 读取 Promise / Context

\`\`\`jsx
const data = use(promise)   // 可在条件/循环中调用（比 hooks 灵活）
const theme = use(Context)  // 读取 context
\`\`\`

\`use\` 可在 if/循环内调用，不像其他 hooks 必须顶层。

## 9. Server Components / Actions 稳定

RSC 与 Server Actions（\`'use server'\`）稳定，Next.js App Router 全面落地。

## 10. React Compiler（逐步）

自动 memoization，减少手动 useMemo/useCallback（实验/逐步推出）。

## 11. Context 简化

\`<Context>\` 可直接用（不必 \`<Context.Provider>\`）：

\`\`\`jsx
<Theme value="dark">...</Theme>
\`\`\`

## 12. 清理 ref callback

ref callback 可返回清理函数：

\`\`\`jsx
<div ref={el => { /* setup */; return () => { /* cleanup */ } }} />
\`\`\`

## 一句话

React 19 用 Actions（\`<form action={asyncFn}>\`）+ useFormStatus/useActionState/useOptimistic 简化异步提交与乐观更新；ref 作 prop 省 forwardRef；原生支持 title/meta/资源预加载；use() 灵活读 Promise/Context；RSC/Server Actions 稳定。`
  },
  {
    id: 'react-058',
    category: 'react',
    title: 'React 和 Vue 的设计哲学有何异同？',
    difficulty: '困难',
    tags: ['React', 'Vue', '对比', '设计哲学'],
    answer: `## 核心差异

| | React | Vue |
| --- | --- | --- |
| 理念 | UI = f(state)，纯函数 + 不可变 | 响应式 + 模板，可变状态 |
| 视图 | JSX（JS 写 UI） | 模板（SFC）+ 少量 render |
| 状态 | 不可变（setState 新对象） | 可变（直接改 ref/reactive） |
| 响应式 | 显式（setState/useReducer 触发） | 隐式（Proxy 自动追踪） |
| 模板 | JSX 编译为 render 函数 | 模板编译为 render + 编译优化 |
| 作用域 | CSS Modules/styled/无内置 | scoped 内置 |
| API 风格 | 函数式（Hooks） | Options + Composition |

## React：函数式 + 不可变

- **UI = f(state)**：给定相同 state 渲染相同 UI，强调纯函数。
- **不可变更新**：\`setState({...state, x: 1})\`，靠引用变化检测。
- **显式触发**：必须调用 setState/dispatch 才更新。
- **JSX = JS**：UI 是 JS，灵活，类型用 TS 强化。
- **Hooks**：逻辑复用单元，但需遵守规则（顶层调用、依赖数组）。
- **生态自治**：路由、状态、表单都靠社区库（React Router、Redux、React Query）。

优点：灵活、生态丰富、TS 友好、并发渲染能力强。
缺点：心智负担（依赖数组、memo、闭包陷阱）、样板多、决策疲劳。

## Vue：响应式 + 模板

- **响应式**：Proxy 自动追踪依赖，改值即更新，无需显式触发。
- **可变状态**：\`state.count++\` 直接改。
- **模板**：声明式，编译期可做大量优化（静态提升、PatchFlag、Block Tree）。
- **内置能力**：路由（Vue Router）、状态（Pinia）、过渡、scoped、指令都官方。
- **SFC**：template/script/style 三段式，约定优于配置。

优点：上手快、模板编译优化强、内置齐全、文档好、少踩坑。
缺点：模板不如 JSX 灵活、TS 历史较弱（3.x 大幅改善）、生态不如 React 庞大。

## 响应式机制对比

\`\`\`jsx
// React：显式 setState
const [count, setCount] = useState(0)
setCount(count + 1)

// Vue：可变，自动追踪
const count = ref(0)
count.value++
\`\`\`

- React 靠 setState 触发整个组件重渲染（再 diff），不可变保证可预测。
- Vue 靠 Proxy 精确知道哪个属性变了，只更新依赖它的 effect（更细粒度）。

## 编译优化对比

- **Vue 模板**：编译期知道哪些是静态/动态，静态提升、Block Tree、PatchFlag，运行时 diff 只看动态部分。
- **React JSX**：JSX 是 JS，编译期难以静态分析（除非 React Compiler），运行时全量 diff + memo。

Vue 在"模板可静态分析"上有先天优势；React 靠 React Compiler 逐步补齐。

## 逻辑复用

- React：自定义 Hook（函数）。
- Vue：Composable（函数，与 Hook 极像）。

两者趋同，Vue 的 Composition API 明显借鉴了 Hooks。

## 性能

- Vue：细粒度响应式 + 编译优化，默认性能好。
- React：需手动 memo/useMemo 优化，但并发渲染（startTransition）处理大更新更优。

## 适用场景

- **React**：大型复杂应用、重度 TS、需要灵活定制、团队偏好函数式、生态驱动。
- **Vue**：中小型到大型、快速上手、模板偏好、内置齐全、文档驱动。

## 共同趋势

- 都向函数式 + 组合式 API 靠拢（Hooks / Composition）。
- 都在编译期做优化（React Compiler / Vue 模板优化）。
- 都支持 SSR/SSG/Server Components。
- 都拥抱 TS。

## 一句话

React 偏函数式与不可变（UI=f(state)、JSX、显式 setState、生态自治）；Vue 偏响应式与模板（Proxy 自动追踪、可变状态、编译优化、内置齐全）；两者在组合式 API 与编译优化上趋同，选择看团队偏好与场景。`
  }

]