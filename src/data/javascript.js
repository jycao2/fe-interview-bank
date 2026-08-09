export const javascriptQuestions = [
  {
    id: 'js-001',
    category: 'javascript',
    title: 'JavaScript 有哪些数据类型？如何判断类型？',
    difficulty: '简单',
    tags: ['数据类型', 'typeof', 'instanceof'],
    answer: `## 数据类型（8 种）

**原始类型（7）**：\`string\`、\`number\`、\`boolean\`、\`undefined\`、\`null\`、\`symbol\`（ES6）、\`bigint\`（ES2020）。

**引用类型（1）**：\`object\`（含 Array、Function、Date、RegExp、Map、Set 等）。

## 类型判断方式

### 1. typeof

\`\`\`js
typeof 'a'      // 'string'
typeof 1        // 'number'
typeof null     // 'object'  ⚠️ 历史遗留 bug
typeof undefined // 'undefined'
typeof function(){} // 'function'
typeof []       // 'object'  ⚠️ 无法区分数组
\`\`\`

适合判断原始类型，无法区分对象子类型。

### 2. instanceof

判断对象的原型链上是否存在构造函数的 prototype：

\`\`\`js
[] instanceof Array       // true
new Date() instanceof Date // true
\`\`\`

只能判断引用类型，不能判断原始类型；跨 iframe / 跨 realm 时可能失效。

### 3. Object.prototype.toString.call

最准确：

\`\`\`js
Object.prototype.toString.call(null)       // '[object Null]'
Object.prototype.toString.call([])         // '[object Array]'
Object.prototype.toString.call(new Map())  // '[object Map]'
\`\`\`

### 4. Array.isArray

判断数组最可靠：\`Array.isArray([]) // true\`。

## 为什么 typeof null === 'object'

JS 早期实现中，值在底层以"类型标签 + 数据"存储，对象的标签是 \`000\`，而 null 在机器码里是全 0 指针，被误判为对象。为兼容保留至今。`
  },
  {
    id: 'js-002',
    category: 'javascript',
    title: '说说你对闭包的理解，有哪些应用场景？',
    difficulty: '中等',
    tags: ['闭包', '作用域', '内存'],
    answer: `## 定义

**闭包（Closure）** 是函数与其词法环境的组合。当一个函数访问了它外部作用域的变量时，就形成了闭包——即使外部函数已执行完毕，内部函数仍能引用那些变量。

\`\`\`js
function counter() {
  let count = 0
  return () => ++count      // 这个返回的函数就是闭包
}
const next = counter()
next() // 1
next() // 2
\`\`\`

## 本质

JS 采用**词法作用域（静态作用域）**：函数在定义时就确定了它能访问的变量范围（由代码位置决定，而非调用位置）。函数执行时携带对其定义环境的引用，环境中的变量不会被回收。

## 应用场景

1. **数据私有化 / 模块模式**：用闭包封装私有变量，外部无法直接访问。
2. **函数工厂 / 柯里化**：预置参数生成新函数。
3. **回调与事件处理**：保留上下文（防抖、节流、定时器）。
4. **缓存（memoize）**：缓存计算结果。
5. **迭代器 / 生成器**：维护内部状态。

## 经典陷阱

\`\`\`js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)  // 输出 3 3 3
}
\`\`\`

\`var\` 没有块级作用域，三个回调共享同一个 \`i\`，循环结束时 \`i=3\`。

解决：用 \`let\`（每轮迭代新建绑定）或 IIFE 捕获当前值：

\`\`\`js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)  // 0 1 2
}
\`\`\`

## 注意

闭包会持有对外部变量的引用，若使用不当可能导致**内存泄漏**（如长期存活的闭包持有大对象引用）。不再需要时应置为 \`null\` 或解绑。`
  },
  {
    id: 'js-003',
    category: 'javascript',
    title: 'var、let、const 有什么区别？',
    difficulty: '简单',
    tags: ['var', 'let', 'const', '作用域'],
    answer: `## 对比

| 特性 | var | let | const |
| --- | --- | --- | --- |
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 提升且初始化为 undefined | 提升但存在暂时性死区（TDZ） | 提升但存在 TDZ |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 允许 | 允许 | 不允许（引用类型内部可变） |
| 挂载到 window | 是（全局时） | 否 | 否 |

## 暂时性死区（TDZ）

\`let\` / \`const\` 声明的变量在**块级作用域开始到声明语句执行之前**不可访问，否则抛出 ReferenceError：

\`\`\`js
console.log(a) // ReferenceError
let a = 1
\`\`\`

而 \`var\` 会输出 \`undefined\`。

## const 的注意点

\`const\` 保证的是**变量绑定不变**，而非值不可变。对象/数组的属性仍可修改：

\`\`\`js
const obj = { a: 1 }
obj.a = 2        // ✅ 允许
obj = {}         // ❌ TypeError
\`\`\`

要真正不可变需 \`Object.freeze\`（浅冻结）或 immutable 库。

## 最佳实践

- 默认用 \`const\`，需要重新赋值时用 \`let\`，不再使用 \`var\`。
- 全局变量用 \`let\`/\`const\` 避免污染 \`window\`。`
  },
  {
    id: 'js-004',
    category: 'javascript',
    title: '说说原型与原型链。',
    difficulty: '中等',
    tags: ['原型', '原型链', '继承'],
    answer: `## 核心概念

- 每个对象都有一个隐藏属性 \`[[Prototype]]\`（可通过 \`__proto__\` 或 \`Object.getPrototypeOf\` 访问），指向它的原型。
- 每个函数都有一个 \`prototype\` 属性，指向一个对象，该对象在用 \`new\` 调用时成为实例的原型。
- \`prototype\` 对象默认有一个 \`constructor\` 属性指回函数本身。

## 关系图

\`\`\`
function Foo() {}
const f = new Foo()

f.__proto__        === Foo.prototype        // true
Foo.prototype.constructor === Foo           // true
Foo.prototype.__proto__ === Object.prototype // true
Object.prototype.__proto__ === null          // true（原型链终点）
Foo.__proto__ === Function.prototype         // true（函数本身也是对象，原型是 Function.prototype）
\`\`\`

## 原型链

访问对象属性时，先在对象自身查找，找不到就沿 \`__proto__\` 向上查找，直到 \`Object.prototype\`，再往上就是 \`null\`。这条链就是原型链。

\`\`\`js
f.toString()  // f 自身没有 → Foo.prototype 没有 → Object.prototype 有
\`\`\`

## new 做了什么

1. 创建一个新空对象。
2. 将新对象的 \`[[Prototype]]\` 指向构造函数的 \`prototype\`。
3. 以新对象为 \`this\` 执行构造函数。
4. 若构造函数返回对象则返回该对象，否则返回新对象。

## 继承的本质

ES6 \`class extends\` 本质仍是基于原型链：

\`\`\`js
class A { greet() {} }
class B extends A {}
const b = new B()
b.__proto__ === B.prototype
B.prototype.__proto__ === A.prototype  // B 继承 A 的方法
\`\`\`

## 方法

- \`Object.create(proto)\`：以指定原型创建对象。
- \`Object.getPrototypeOf(obj)\` / \`Object.setPrototypeOf(obj, proto)\`：读写原型。
- \`instanceof\`：沿原型链查找 \`prototype\`。`
  },
  {
    id: 'js-005',
    category: 'javascript',
    title: 'this 的指向规则是什么？如何改变 this？',
    difficulty: '中等',
    tags: ['this', 'bind', 'call', 'apply'],
    answer: `## this 的指向规则（按优先级从高到低）

1. **new 绑定**：\`new Foo()\` 中 \`this\` 指向新创建的对象。
2. **显式绑定**：\`fn.call(obj)\` / \`apply\` / \`bind\` 指向传入的对象。
3. **隐式绑定**：\`obj.fn()\` 指向 \`obj\`（调用时的上下文）。
4. **默认绑定**：独立函数调用，非严格模式指向 \`window\`（globalThis），严格模式 \`undefined\`。

## 箭头函数

箭头函数**没有自己的 this**，它继承定义时外层的 this，且不能用 call/apply/bind 改变：

\`\`\`js
const obj = {
  name: 'A',
  say: function() {
    const inner = () => console.log(this.name)  // 继承外层 this → obj
    inner()
  }
}
obj.say()  // 'A'
\`\`\`

## 改变 this 的方法

\`\`\`js
fn.call(obj, arg1, arg2)   // 立即调用，参数逐个传
fn.apply(obj, [arg1, arg2]) // 立即调用，参数以数组传
const bound = fn.bind(obj)   // 返回新函数，永久绑定 this
bound(arg1, arg2)
\`\`\`

## 经典坑

\`\`\`js
const obj = { name: 'A', getName() { return this.name } }
const fn = obj.getName
fn()  // undefined —— 隐式绑定丢失，变成默认绑定
\`\`\`

回调、解构取出方法后调用，会丢失 \`this\`。解决：\`fn = obj.getName.bind(obj)\` 或用箭头函数包裹。`
  },
  {
    id: 'js-006',
    category: 'javascript',
    title: '说说事件循环（Event Loop）机制。',
    difficulty: '困难',
    tags: ['事件循环', '宏任务', '微任务', '异步'],
    answer: `## 为什么需要事件循环

JS 是单线程的，为处理异步而不阻塞主线程，通过事件循环调度任务。

## 执行模型（浏览器）

1. 执行**调用栈**中的同步代码。
2. 栈清空后，检查**微任务队列**，**全部执行完**（包括执行过程中新产生的微任务）。
3. 浏览器必要时渲染（rAF 回调、样式计算、绘制）。
4. 取一个**宏任务**执行。
5. 回到第 2 步，循环往复。

## 微任务（Microtask）

- \`Promise.then/catch/finally\`
- \`queueMicrotask\`
- \`MutationObserver\`
- \`process.nextTick\`（Node 专属，优先级高于微任务）

## 宏任务（Macrotask）

- \`setTimeout\` / \`setInterval\`
- \`setImmediate\`（Node）
- I/O、UI 事件、消息事件
- \`postMessage\`

## 经典输出

\`\`\`js
console.log(1)
setTimeout(() => console.log(2), 0)
Promise.resolve().then(() => console.log(3))
console.log(4)
// 输出：1 4 3 2
\`\`\`

- 1、4 同步执行。
- 3 是微任务，在同步代码后、宏任务前执行。
- 2 是宏任务，最后执行。

## async/await

\`await\` 会暂停 async 函数，等待 Promise resolve，**后续代码相当于放进 .then 的微任务**中执行：

\`\`\`js
async function a() {
  console.log(1)
  await Promise.resolve()
  console.log(2)  // 微任务
}
console.log(0)
a()
console.log(3)
// 0 1 3 2
\`\`\`

## Node 的事件循环

Node 有自己的阶段模型（timers → pending → poll → check → close），与浏览器有差异。Node 11+ 已对齐浏览器：微任务在每个宏任务之间执行。`
  },
  {
    id: 'js-007',
    category: 'javascript',
    title: 'Promise 的原理是什么？常见 API 有哪些？',
    difficulty: '中等',
    tags: ['Promise', '异步', 'then'],
    answer: `## 核心特性

- 有三种状态：**pending（等待）**、**fulfilled（成功）**、**rejected（失败）**。
- 状态一旦从 pending 变为 fulfilled 或 rejected 就**不可逆**。
- \`then\` / \`catch\` 的回调是**微任务**，在当前执行栈清空后异步执行。

## 状态流转

\`\`\`js
const p = new Promise((resolve, reject) => {
  // 异步操作
  resolve(value)  // pending → fulfilled
  // 或 reject(reason)  // pending → rejected
})
p.then(v => {}, r => {})
\`\`\`

## 链式调用

\`then\` 返回一个新的 Promise，实现链式：

- 回调返回普通值 → 下一个 then 收到该值。
- 回调返回 Promise → 等待其 resolve/reject。
- 回调抛错 → 进入下一个 catch。

## 常见 API

| API | 作用 |
| --- | --- |
| \`Promise.all([])\` | 全部成功才成功，任一失败即失败 |
| \`Promise.allSettled([])\` | 等全部完成，返回每个结果（含状态） |
| \`Promise.race([])\` | 第一个完成的（成功或失败）即结果 |
| \`Promise.any([])\` | 第一个成功的为结果，全失败才失败（AggregateError） |
| \`Promise.resolve(v)\` / \`Promise.reject(r)\` | 快速创建已决议的 Promise |

## 手写要点

- 用 \`value\` / \`reason\` / \`state\` 保存状态。
- 用数组保存 \`onFulfilled\` / \`onRejected\` 回调（因为可能 then 多次、且需异步执行）。
- resolve/reject 时遍历执行回调，并用 \`queueMicrotask\` 包裹保证异步。

## 错误处理

\`catch\` 等价于 \`then(null, onRejected)\`，建议用 \`catch\` 集中处理，且放在链尾。`
  },
  {
    id: 'js-008',
    category: 'javascript',
    title: 'async/await 的原理与使用？',
    difficulty: '中等',
    tags: ['async', 'await', 'Generator', '异步'],
    answer: `## 语法

\`async\` 函数返回一个 Promise；\`await\` 暂停函数执行直到 Promise 决议，并取出结果。

\`\`\`js
async function getUser(id) {
  const res = await fetch('/api/' + id)
  const data = await res.json()
  return data
}
\`\`\`

## 原理

\`async/await\` 是 **Generator + Promise + 自动执行器** 的语法糖：

\`\`\`js
// async 函数大致等价于：
function* gen() {
  const res = yield fetch('/api')
  const data = yield res.json()
  return data
}
// 自动执行器不断调用 gen().next()，把 yield 的 Promise resolve 后再传回
\`\`\`

- \`await\` 后面的表达式被包成 \`Promise.resolve()\`。
- 遇到 \`await\`，函数**交出控制权**返回一个 pending Promise；Promise 决议后，把结果作为该表达式的值，恢复函数继续执行。
- \`await\` 之后的代码相当于放在 \`.then\` 回调里（微任务）。

## 错误处理

用 try/catch 捕获 await 的 reject：

\`\`\`js
try {
  const data = await api()
} catch (e) {
  // 处理错误
}
\`\`\`

## 并发优化

**串行（慢）**：

\`\`\`js
const a = await fetchA()
const b = await fetchB()
\`\`\`

**并发（快）**：

\`\`\`js
const [a, b] = await Promise.all([fetchA(), fetchB()])
\`\`\`

多个无依赖请求应并发发起，再 await 汇总。

## 顶层 await

ES2022 支持在模块顶层直接使用 \`await\`（需 \`type: module\`），常用于动态加载配置。`
  },
  {
    id: 'js-009',
    category: 'javascript',
    title: 'JS 是如何实现继承的？（几种方式与优劣）',
    difficulty: '中等',
    tags: ['继承', '原型链', 'class'],
    answer: `## 1. 原型链继承

\`\`\`js
Child.prototype = new Parent()
\`\`\`

- 缺点：所有实例共享父类的引用类型属性；无法向父构造函数传参。

## 2. 借用构造函数（call）

\`\`\`js
function Child() { Parent.call(this, args) }
\`\`\`

- 优点：可传参，不共享引用属性。
- 缺点：无法继承父类原型上的方法。

## 3. 组合继承（原型链 + 借用构造函数）

\`\`\`js
function Child() { Parent.call(this, args) }
Child.prototype = new Parent()
Child.prototype.constructor = Child
\`\`\`

- 最常用的传统方案，但 Parent 构造函数被调用两次。

## 4. 原型式继承（Object.create）

\`\`\`js
const child = Object.create(parent)
\`\`\`

- 浅复制原型，仍共享引用属性。

## 5. 寄生式继承

在 Object.create 基础上增强对象。

## 6. 寄生组合式继承（最优的传统方案）

\`\`\`js
function Child() { Parent.call(this, args) }
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
\`\`\`

只调用一次 Parent 构造函数，避免了组合继承的二次调用。

## 7. ES6 class extends

\`\`\`js
class Parent {}
class Child extends Parent {
  constructor() { super() }
}
\`\`\`

- 语法清晰，本质是寄生组合继承 + super。
- \`super()\` 必须在 constructor 中 \`this\` 之前调用。
- 推荐使用。`
  },
  {
    id: 'js-010',
    category: 'javascript',
    title: '深拷贝与浅拷贝的区别？如何实现深拷贝？',
    difficulty: '中等',
    tags: ['深拷贝', '浅拷贝', 'JSON'],
    answer: `## 区别

- **浅拷贝**：只复制一层，嵌套的引用类型仍共享同一引用。
- **深拷贝**：递归复制所有层级，新旧对象完全独立。

## 浅拷贝方式

\`\`\`js
Object.assign({}, obj)
{ ...obj }
Array.prototype.slice()
arr.concat()
Array.from(arr)
[...arr]
\`\`\`

## 深拷贝方式

### 1. JSON（最简单，有局限）

\`\`\`js
JSON.parse(JSON.stringify(obj))
\`\`\`

- 局限：无法处理 \`function\`、\`undefined\`、\`Symbol\`、\`RegExp\`、\`Date\`（变字符串）、循环引用（报错）、\`Map/Set\`。

### 2. structuredClone（原生，推荐）

\`\`\`js
structuredClone(obj)
\`\`\`

- 支持循环引用、Date、RegExp、Map、Set、ArrayBuffer 等。
- 不支持函数、DOM 节点、Symbol 属性。

### 3. 递归手写

\`\`\`js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (hash.has(obj)) return hash.get(obj)  // 处理循环引用
  const clone = Array.isArray(obj) ? [] : {}
  hash.set(obj, clone)
  Reflect.ownKeys(obj).forEach(key => {
    clone[key] = deepClone(obj[key], hash)
  })
  return clone
}
\`\`\`

### 4. lodash _.cloneDeep

功能最全，处理函数保留引用、保留原型等。

## 选择

- 简单纯数据结构 → \`structuredClone\`。
- 复杂场景 → lodash \`_.cloneDeep\`。`
  },
  {
    id: 'js-011',
    category: 'javascript',
    title: 'JS 垃圾回收机制是怎样的？',
    difficulty: '困难',
    tags: ['垃圾回收', 'GC', '内存'],
    answer: `## 回收策略

JS 采用**自动垃圾回收**，开发者无需手动释放内存。引擎通过**可达性（reachability）**判断：从根（全局对象、当前执行栈中的变量等）出发，能访问到的对象保留，不可达的对象被回收。

## 常见算法

### 1. 标记-清除（Mark-Sweep）

现代引擎主流。从根出发遍历引用链，标记可达对象，清除未标记的。

- 优点：解决循环引用问题（旧引用计数法的痛点）。
- 缺点：产生内存碎片。

### 2. 标记-整理（Mark-Compact）

标记后把存活对象移动到一端，清理边界外的内存，解决碎片问题。

### 3. 引用计数（Reference Counting，已弃用）

记录每个对象的引用数，为 0 时回收。**无法处理循环引用**，早期 IE 的 DOM 与 JS 对象循环引用曾导致严重泄漏。

## V8 的分代回收

V8 将堆分为**新生代**和**老生代**：

- **新生代（短生命周期）**：采用 Scavenge 算法（Cheney），把堆分为 From / To 两块，GC 时复制存活对象到 To，角色互换。经历一次 Scavenge 仍存活或占用空间过大的对象晋升到老生代。
- **老生代（长生命周期）**：采用标记-清除 + 标记-整理，增量标记、并发标记降低停顿。

## 常见内存泄漏

1. 意外的全局变量（未声明的赋值）。
2. 被遗忘的定时器 / 事件监听器未清理。
3. 闭包持有大对象引用。
4. 脱离 DOM 的引用（已移除但 JS 仍持有）。
5. 缓存无限增长。

## 优化建议

- 及时清理不再使用的引用（置 null、removeEventListener、clearInterval）。
- 用 WeakMap / WeakSet 持有对象引用，不阻止 GC。
- 避免在热路径创建大量临时对象。`
  },
  {
    id: 'js-012',
    category: 'javascript',
    title: 'ES6+ 有哪些常用新特性？',
    difficulty: '中等',
    tags: ['ES6', '新特性', '语法'],
    answer: `## 变量与作用域

- \`let\` / \`const\` 块级作用域、暂时性死区。
- 全局 \`let/const\` 不挂载到 window。

## 解构与展开

- 数组 / 对象解构、默认值、剩余元素 \`...\`。
- 展开运算符 \`...\`、对象展开 \`{ ...obj }\`。

## 函数

- 箭头函数（无自己的 this/arguments）。
- 默认参数、剩余参数 \`...args\`。
- \`name\` 属性。

## 模板字符串

反引号 + \`\${}\`\` 插值，支持多行。

## 类与模块

- \`class\` / \`extends\` / \`super\` / \`static\`。
- \`import\` / \`export\` ES Module（静态分析、支持 tree-shaking）。

## 数据类型与对象扩展

- \`Symbol\`、\`BigInt\`。
- \`Map\` / \`Set\` / \`WeakMap\` / \`WeakSet\`。
- \`Object.keys/values/entries\`、\`Object.assign\`、\`Object.fromEntries\`。
- 可选链 \`?.\`、空值合并 \`??\`（ES2020）。

## 异步

- \`Promise\`、\`async/await\`、\`Promise.allSettled\` / \`Promise.any\`。
- 顶层 \`await\`（ES2022）。

## 数组方法

\`map\` / \`filter\` / \`reduce\` / \`find\` / \`findIndex\` / \`some\` / \`every\` / \`includes\` / \`flat\` / \`flatMap\` / \`at\`。

## 迭代

- \`for...of\`（基于 Iterator 协议）。
- 自定义迭代器 \`[Symbol.iterator]\`。
- Generator \`function*\`。

## 其他

- Proxy / Reflect（元编程，Vue3 响应式基础）。
- \`ArrayBuffer\` / \`SharedArrayBuffer\` + \`Atomics\`（二进制 / 多线程）。
- 数值分隔符 \`1_000_000\`、\`Object.hasOwn\`、\`structuredClone\`。`
  },
  {
    id: 'js-013',
    category: 'javascript',
    title: '说说箭头函数与普通函数的区别。',
    difficulty: '简单',
    tags: ['箭头函数', 'this', 'arguments'],
    answer: `## 主要区别

| 特性 | 普通函数 | 箭头函数 |
| --- | --- | --- |
| \`this\` | 动态，由调用方式决定 | 没有自己的 this，继承外层词法作用域 |
| \`arguments\` | 有自己的 arguments | 没有，用剩余参数 \`...args\` |
| \`new\` 调用 | 可作为构造函数 | 不能用 new（无 \`[[Construct]]\`） |
| \`prototype\` | 有 | 没有 |
| \`super\` | 仅 class 方法中 | class 方法中也支持 |
| \`yield\` | 普通函数不能 | 不能作为 Generator |
| 提升 | 函数声明会提升 | 不提升（赋值语句） |

## this 行为

\`\`\`js
function Timer() {
  this.s = 0
  setInterval(() => this.s++, 1000)  // ✅ this 指向 Timer 实例
  setInterval(function() { this.s++ }, 1000)  // ❌ this 指向 window
}
\`\`\`

箭头函数的 this 在**定义时**就确定，且无法被 call/apply/bind 改变。

## 适用场景

- **适合**：回调、短小的纯函数、需要保留外层 this 的场景（setTimeout、Promise 链、事件处理中调用外部方法）。
- **不适合**：对象方法（this 不会指向对象）、需要动态 this 的场景（如事件监听器中需要 this 指向元素——但通常用 e.currentTarget 更清晰）、构造函数、Generator、Vue2 选项式 API 的 methods（this 不会指向组件实例）。`
  },
  {
    id: 'js-014',
    category: 'javascript',
    title: '什么是事件冒泡与事件捕获？事件委托的原理？',
    difficulty: '中等',
    tags: ['事件流', '事件委托', '冒泡'],
    answer: `## 事件流三个阶段

1. **捕获阶段（Capture）**：从 window 逐层向下传播到目标元素的父节点。
2. **目标阶段（Target）**：事件到达目标元素。
3. **冒泡阶段（Bubble）**：从目标元素逐层向上传播到 window。

\`addEventListener(type, fn, useCapture)\` 第三参数为 \`true\` 表示在捕获阶段触发，默认 \`false\` 在冒泡阶段触发。

## 事件冒泡

子元素事件会向上冒泡到父元素：

\`\`\`html
<div id="parent"><button id="child">click</button></div>
<script>
parent.addEventListener('click', e => console.log('parent'))
child.addEventListener('click', e => console.log('child'))
// 点击 child 输出：child → parent
</script>
\`\`\`

\`e.stopPropagation()\` 阻止冒泡；\`e.stopImmediatePropagation()\` 阻止冒泡且阻止同元素后续监听器。

## 事件委托（Event Delegation）

利用冒泡，把子元素的事件统一绑定到共同父元素，通过 \`e.target\` 判断实际触发的子元素：

\`\`\`js
ul.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    console.log(e.target.dataset.id)
  }
})
\`\`\`

## 优势

- **减少监听器数量**，节省内存，性能更好。
- **动态元素自动生效**：后续新增的 li 无需重新绑定。
- 适合列表、表格、菜单等批量元素场景。

## 局限

- 不冒泡的事件（focus/blur、mouseenter/mouseleave、load 等）无法委托，可用 focusin/focusout、mouseover/mouseout 替代。
- 层级过深时判断 target 逻辑复杂。
- target 可能是子元素的内部节点，需用 \`e.target.closest('li')\` 匹配。`
  },
  {
    id: 'js-015',
    category: 'javascript',
    title: '== 和 === 的区别？类型转换规则？',
    difficulty: '简单',
    tags: ['==', '===', '类型转换', '相等'],
    answer: `## 区别

- \`==\`（宽松相等）：会比较前进行**类型转换**。
- \`===\`（严格相等）：**不转换类型**，类型不同直接返回 false。

推荐**永远用 ===**，避免隐式转换带来的 bug。

## == 的转换规则（简要）

1. 类型相同 → 直接比较（NaN 不等于任何值，包括自己；+0 == -0）。
2. \`null == undefined\` → true（且仅与彼此相等）。
3. 数字 vs 字符串：字符串转数字。
4. 布尔 vs 其他：布尔转数字（true→1，false→0）。
5. 对象 vs 原始类型：对象转原始值（\`ToPrimitive\`，先 valueOf 再 toString）。

## 坑点示例

\`\`\`js
0 == ''            // true
0 == '0'           // true
'' == '0'          // false
false == '0'       // true
null == undefined  // true
null == 0          // false
NaN == NaN         // false
[] == ![]          // true（![] 是 false → 0，[] → '' → 0）
\`\`\`

## 对象比较

\`===\` 和 \`==\` 对对象都按**引用**比较：

\`\`\`js
[] == []   // false（不同引用）
{} === {}  // false
\`\`\`

## Object.is

更精确的相等判断，修复了 \`===\` 的两个"缺陷"：

\`\`\`js
Object.is(NaN, NaN)   // true（=== 是 false）
Object.is(+0, -0)     // false（=== 是 true）
\`\`\`

## 建议

- 用 \`===\` / \`!==\`。
- 判断 NaN 用 \`Number.isNaN\`（不要用全局 isNaN，它会先转换）。
- 判断 null/undefined：\`x == null\` 是少有的可接受用法（同时判断两者）。`
  },
  {
    id: 'js-016',
    category: 'javascript',
    title: 'Proxy 和 Reflect 是什么？有什么用？',
    difficulty: '困难',
    tags: ['Proxy', 'Reflect', '元编程'],
    answer: `## Proxy

代理对象，对外层访问进行拦截。基本用法：

\`\`\`js
const handler = {
  get(target, key, receiver) {
    console.log('读取', key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log('设置', key, value)
    return Reflect.set(target, key, value, receiver)
  }
}
const proxy = new Proxy(obj, handler)
\`\`\`

支持 13 种陷阱（trap）：\`get\` / \`set\` / \`has\` / \`deleteProperty\` / \`ownKeys\` / \`apply\` / \`construct\` 等。

## Reflect

与 Proxy 的 trap 一一对应的 API，提供**调用对象内部方法**的标准方式：

\`\`\`js
Reflect.get(obj, key)
Reflect.set(obj, key, value)
Reflect.has(obj, key)        // 等价 in
Reflect.ownKeys(obj)
Reflect.construct(Cls, args) // 等价 new
\`\`\`

## 为什么 Proxy 配合 Reflect

1. **正确传递 receiver**：\`Reflect.get(target, key, receiver)\` 能让 getter 中的 this 指向 proxy，保证继承链上的 getter 正确触发。直接 \`return target[key]\` 会丢失 receiver。
2. **避免手动实现易错**：Reflect 提供与规范一致的默认行为。
3. **返回值规范**：set 返回布尔表示成功，与 Proxy 期望一致。

## 典型应用

1. **Vue3 响应式**：\`reactive()\` 用 Proxy 拦截 get（依赖收集）/ set（触发更新），比 Vue2 的 defineProperty 更强大。
2. **校验 / 日志**：拦截属性读写做校验、埋点。
3. **私有属性**：拦截 get 阻止访问以 \`_\` 开头的属性。
4. **负数组索引**：拦截 get 把 \`arr[-1]\` 转为 \`arr[arr.length-1]\`。

## 与 Object.defineProperty 对比

| | defineProperty | Proxy |
| --- | --- | --- |
| 监听范围 | 单个属性 | 整个对象 |
| 新增属性 | 不能监听 | 能 |
| 数组索引/length | 不能 | 能 |
| 删除属性 | 不能 | 能（deleteProperty） |
| 初始化 | 需递归遍历 | 惰性（访问才代理） |

## 局限

- Proxy 不能代理原始类型（需用 ref 包装）。
- 性能略低于直接访问（但现代引擎优化很好）。
- 某些场景下与 this / 原型链交互需注意 receiver。`
  },
  {
    id: 'js-017',
    category: 'javascript',
    title: 'Map/Set 与 WeakMap/WeakSet 的区别？',
    difficulty: '中等',
    tags: ['Map', 'Set', 'WeakMap', 'WeakSet'],
    answer: `## Map

键值对集合，**键可以是任意类型**（包括对象、函数），保持插入顺序。

\`\`\`js
const m = new Map()
m.set('a', 1)
m.set(obj, 2)
m.get(obj)   // 2
m.has('a')   // true
m.size
m.forEach((v, k) => ...)
\`\`\`

与普通对象的区别：对象键只能是字符串/Symbol，且无 size / 有原型链干扰；Map 键类型任意、有序、有 size。

## Set

值的集合，**值唯一**，保持插入顺序。

\`\`\`js
const s = new Set([1, 2, 2, 3])  // {1,2,3}
s.add(4)
s.has(2)
s.delete(1)
\`\`\`

常用于去重、判断存在。

## WeakMap

- 键**必须是对象**（或 symbol），值任意。
- 键是**弱引用**：键对象没有被其他地方引用时，可被 GC 回收，对应的条目自动从 WeakMap 移除。
- **不可遍历**（无 size / forEach / keys）。

\`\`\`js
const wm = new WeakMap()
wm.set(domNode, { listeners: [...] })
\`\`\`

## WeakSet

- 值必须是对象，弱引用，不可遍历。

## 对比

| | Map/Set | WeakMap/WeakSet |
| --- | --- | --- |
| 键/值类型 | 任意 | 必须是对象 |
| 弱引用 | 否（强引用，阻止 GC） | 是 |
| 可遍历 | 是 | 否 |
| 有 size | 是 | 否 |
| 应用 | 数据存储/去重 | 关联数据、避免泄漏 |

## 典型应用

- **Map**：缓存、计数、有序键值。
- **Set**：去重、集合运算。
- **WeakMap**：
  - 给 DOM 节点关联额外数据（节点移除后自动回收）。
  - 实现"私有属性"。
  - Vue3 响应式用 WeakMap 存储对象→依赖映射，对象销毁后依赖自动释放。
- **WeakSet**：标记对象状态（如"已访问"），不阻止 GC。

## 为什么 WeakMap 不可遍历

弱引用意味着成员可能随时被 GC 移除，遍历过程中数量不确定，故不提供遍历接口。`
  },
  {
    id: 'js-018',
    category: 'javascript',
    title: '迭代器（Iterator）与生成器（Generator）是什么？',
    difficulty: '困难',
    tags: ['Iterator', 'Generator', '迭代'],
    answer: `## Iterator 协议

一个对象实现 \`[Symbol.iterator]()\` 方法，返回一个带 \`next()\` 的迭代器，每次调用 \`next()\` 返回 \`{ value, done }\`。

\`\`\`js
const iter = {
  [Symbol.iterator]() {
    let i = 0
    return {
      next() {
        return i < 3 ? { value: i++, done: false } : { value: undefined, done: true }
      }
    }
  }
}
;[...iter]              // [0,1,2]
for (const v of iter) console.log(v)
\`\`\`

## 可迭代对象

实现 \`Symbol.iterator\` 的对象：Array、String、Map、Set、arguments、NodeList 等。能用 \`for...of\`、展开运算符、解构、\`Promise.all\` 等。

普通对象默认不可迭代（需自定义 \`[Symbol.iterator]\`）。

## Generator

用 \`function*\` 定义，内部用 \`yield\` 暂停执行，返回一个迭代器：

\`\`\`js
function* gen() {
  yield 1
  yield 2
  return 3
}
const g = gen()
g.next()  // { value: 1, done: false }
g.next()  // { value: 2, done: false }
g.next()  // { value: 3, done: true }
\`\`\`

## 特性

- \`yield\` 暂停并产出值，下次 next 恢复执行。
- \`yield*\` 委托给另一个可迭代对象。
- \`next(value)\` 可向生成器内传入值（作为上一个 yield 的返回值）。
- Generator 是实现**迭代器**的语法糖，自身就是可迭代对象。

## 应用

1. **自定义遍历**：给对象实现有序遍历。
2. **惰性序列 / 无限流**：按需生成，不占内存。
   \`\`\`js
   function* naturals() { let i = 1; while (true) yield i++ }
   \`\`\`
3. **状态机**：用 yield 表达状态。
4. **async/await 的基础**：Generator + Promise + 自动执行器 = async/await 的原理。

## 与 for...in 区别

- \`for...in\` 遍历对象的**键名**（含原型链，顺序不保证）。
- \`for...of\` 遍历可迭代对象的**值**（不含原型链，按迭代器顺序）。`
  },
  {
    id: 'js-019',
    category: 'javascript',
    title: '为什么 0.1 + 0.2 !== 0.3？如何解决？',
    difficulty: '中等',
    tags: ['浮点数', '精度', 'IEEE754'],
    answer: `## 原因

JS 采用 IEEE 754 双精度浮点数（64 位）。十进制小数如 0.1 在二进制下是**无限循环小数**，存储时被截断，产生舍入误差。

\`\`\`js
0.1 + 0.2 === 0.3   // false
0.1 + 0.2           // 0.30000000000000004
\`\`\`

- 0.1 实际存储为 ≈ 0.1000000000000000055...
- 0.2 实际存储为 ≈ 0.200000000000000011...
- 相加后约为 0.30000000000000004，不等于 0.3 的存储值。

## 这不是 JS 独有

所有用 IEEE 754 的语言（Java、Python、C 等）都有此问题。

## 解决方案

### 1. 容差比较（Number.EPSILON）

\`\`\`js
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON   // true
\`\`\`

\`Number.EPSILON\`（约 2.22e-16）是 1 与大于 1 的最小浮点数之差，作为容差。

### 2. 转整数运算（金额场景）

\`\`\`js
// 以"分"为单位，避免小数
(10 + 20) / 100 === 0.3   // true
\`\`\`

### 3. toFixed（注意它返回字符串，且四舍五入有坑）

\`\`\`js
parseFloat((0.1 + 0.2).toFixed(10))   // 0.3
\`\`\`

### 4. 高精度库

- 金额、金融场景用 **decimal.js** / **big.js** / **bignumber.js**。
- 大整数用 **BigInt**（整数场景，非小数）。

## 实践

- 比较浮点数永远用容差，不要用 \`===\`。
- 金额计算用整数（分）或高精度库，不要直接用浮点运算。`
  },
  {
    id: 'js-020',
    category: 'javascript',
    title: '如何准确判断一个变量是不是数组？',
    difficulty: '简单',
    tags: ['数组判断', 'isArray', '类型'],
    answer: `## 推荐方法

\`\`\`js
Array.isArray(value)
\`\`\`

- 最准确、最可靠，能区分数组与类数组对象。
- 即使跨 iframe / 跨 realm 也正确（不同 window 的 Array 也能识别）。

## 其他方法及其局限

### 1. instanceof

\`\`\`js
value instanceof Array
\`\`\`

- 局限：跨 iframe / 多窗口时，不同 window 有不同的 Array 构造函数，可能误判为 false。

### 2. Object.prototype.toString.call

\`\`\`js
Object.prototype.toString.call(value) === '[object Array]'
\`\`\`

- 准确，能判断任意类型（\`[object Date]\`、\`[object Map]\` 等）。
- 写起来长。

### 3. constructor

\`\`\`js
value.constructor === Array
\`\`\`

- 局限：value 为 null/undefined 会报错；constructor 可被改写。

### 4. typeof

\`\`\`js
typeof value === 'object'
\`\`\`

- 数组返回 \`'object'\`，无法区分数组与对象，**不能用**。

## 为什么需要专门方法

\`\`\`js
typeof []              // 'object'（不靠谱）
[] instanceof Array    // 多窗口下可能失效
Array.isArray([])      // ✅ 始终正确
\`\`\`

## 结论

判断数组用 \`Array.isArray\`；判断其他引用类型可用 \`Object.prototype.toString.call\`。`
  },
  {
    id: 'js-021',
    category: 'javascript',
    title: '说说 JS 的作用域与作用域链。',
    difficulty: '中等',
    tags: ['作用域', '作用域链', '词法作用域'],
    answer: `## 作用域

变量与函数可被访问的范围。JS 是**词法作用域（静态作用域）**：函数的作用域在**定义时**就确定（由代码位置决定），而非调用时。

## 种类

- **全局作用域**：最外层，全局变量。
- **函数作用域**：函数内部声明的变量（var）。
- **块级作用域**：\`let\` / \`const\` 在 \`{}\` 内有效（if、for、{}）。
- **模块作用域**：ESM 中每个模块独立作用域。

## 作用域链

函数访问变量时，先在自身作用域找，找不到沿**定义时的外层作用域**逐层向上，直到全局。这条链就是作用域链。

\`\`\`js
const a = 1
function outer() {
  const b = 2
  function inner() {
    console.log(a, b)   // 沿作用域链找到 outer 的 b、全局的 a
  }
  inner()
}
\`\`\`

## 词法作用域 vs 动态作用域

- **词法作用域**（JS）：由代码书写位置决定。
- **动态作用域**（Bash 等）：由调用栈决定。

JS 中 \`this\` 是动态的（取决于调用方式），但变量查找是词法的——这是两套不同机制。

## 闭包与作用域链

闭包本质就是**函数携带其作用域链**：即使外层函数已返回，内层函数仍能访问外层变量，因为作用域链在定义时就建立了。

\`\`\`js
function counter() {
  let count = 0
  return () => ++count   // 闭包持有 counter 的作用域
}
\`\`\`

## 欺骗词法作用域（不推荐）

- \`eval\`：运行时生成代码，可能访问作用域内变量（严格模式受限）。
- \`with\`：把对象属性作为作用域变量（严格模式禁用）。

两者都影响性能与安全，现代代码避免使用。

## 变量提升与作用域

- \`var\` 声明提升到函数/全局顶部，值为 undefined。
- \`let/const\` 提升但存在**暂时性死区**（TDZ），声明前访问报错。
- 函数声明整体提升（包括函数体）。`
  },
  {
    id: 'js-022',
    category: 'javascript',
    title: 'Symbol 是什么？有哪些应用场景？',
    difficulty: '中等',
    tags: ['Symbol', '唯一性', 'ES6'],
    answer: `## 定义

Symbol 是 ES6 引入的**第 7 种原始类型**，表示**唯一且不可变**的值。

\`\`\`js
const s1 = Symbol('id')
const s2 = Symbol('id')
s1 === s2      // false（每次创建都唯一）
typeof s1      // 'symbol'
s1.description // 'id'（描述，仅用于调试）
\`\`\`

- 不能用 \`new Symbol()\`（不是对象，是原始值）。
- 会隐式转字符串：\`String(s1)\` 或 \`s1.toString()\`，但不能参与字符串拼接（\`'' + s1\` 报 TypeError）。

## 应用场景

### 1. 对象的私有 / 内部属性

Symbol 键不会出现在 \`for...in\` / \`Object.keys\` 中，适合做"内部"属性：

\`\`\`js
const INTERNAL = Symbol('internal')
const obj = { [INTERNAL]: 'secret', name: 'a' }
Object.keys(obj)            // ['name']
Object.getOwnPropertySymbols(obj)  // [Symbol(internal)]（仍可访问）
\`\`\`

> 注意：不是真正的私有（Reflect.ownKeys / getOwnPropertySymbols 能拿到），真正的私有用 #字段（ES2022）。

### 2. 防止属性名冲突

第三方库给对象扩展属性时，用 Symbol 作键不会与已有属性冲突：

\`\`\`js
obj[myLibSymbol] = data
\`\`\`

### 3. 内置 Symbol（Well-known Symbols）

定义对象的自定义行为：

- \`Symbol.iterator\`：实现可迭代（\`for...of\`）。
- \`Symbol.toPrimitive\`：控制对象转原始值。
- \`Symbol.hasInstance\`：自定义 instanceof 行为。
- \`Symbol.toStringTag\`：修改 \`Object.prototype.toString.call\` 的结果。

\`\`\`js
const obj = {
  [Symbol.toPrimitive](hint) {
    return hint === 'number' ? 42 : 'obj'
  }
}
+obj           // 42
\`\`\`

### 4. 枚举 / 常量

用 Symbol 表示枚举值，避免字符串重复：

\`\`\`js
const STATUS = { IDLE: Symbol('idle'), LOADING: Symbol('loading') }
\`\`\`

## Symbol.for（全局注册）

\`\`\`js
Symbol.for('shared') === Symbol.for('shared')  // true（全局注册，相同 key 返回同一个）
Symbol.keyFor(s)   // 反查 key
\`\`\`

- 跨模块共享同一个 Symbol。
- 与 \`Symbol()\` 的区别：后者每次新建唯一，前者按 key 复用。`
  },
  {
    id: 'js-023',
    category: 'javascript',
    title: 'ES Modules 与 CommonJS 的区别与互操作？',
    difficulty: '中等',
    tags: ['模块化', 'ES Modules', 'CommonJS', 'import', 'require'],
    answer: `## 两大模块体系

| 维度 | CommonJS (CJS) | ES Modules (ESM) |
| --- | --- | --- |
| 语法 | \`require / module.exports\` | \`import / export\` |
| 加载时机 | 运行时（动态） | 编译期（静态） |
| 输出 | 值的拷贝 | 值的引用（live binding） |
| 是否支持顶层 await | 否 | 支持（top-level await） |
| this 顶层指向 | \`module.exports\` | \`undefined\` |
| 循环依赖 | 返回已执行部分（可能不完整） | 通过引用延迟取值 |
| 适用环境 | Node（历史）、旧前端 | Node（现代）、浏览器原生、构建工具 |

## 关键区别详解

### 1. 输出"值的拷贝" vs "值的引用"

\`\`\`js
// ---------- CJS: 值的拷贝 ----------
// lib.js
let count = 0
module.exports = { count, add() { count++ } }

// main.js
const lib = require('./lib')
lib.add()
console.log(lib.count)   // 0  —— 拷贝，外部不变

// ---------- ESM: 值的引用 ----------
// lib.mjs
export let count = 0
export function add() { count++ }

// main.mjs
import { count, add } from './lib.mjs'
add()
console.log(count)        // 1  —— 引用，外部同步变化
\`\`\`

这是面试最常考的点：**ESM 的 export 是绑定（binding），读取时实时反映模块内部值**。

### 2. 静态 vs 动态

- ESM 的 \`import\` 必须在顶层、路径是字符串字面量 → 编译期就能确定依赖图 → 支持 Tree Shaking。
- CJS 的 \`require\` 可在任意位置、可用变量 → 运行时才能确定 → 无法静态分析。

\`\`\`js
// ESM 动态导入（运行时）需用 import()
const mod = await import(\`./locale/\${lang}.js\`)

// CJS 天生动态
const mod = require('./locale/' + lang)
\`\`\`

\`\`\`import()\` 是 ESM 的动态版本，返回 Promise，常用于路由懒加载、按需加载。

### 3. 顶层 await

ESM 支持（Node 14.8+、现代浏览器）：

\`\`\`js
// config.mjs
const res = await fetch('/config')
export const config = await res.json()   // 顶层直接 await
\`\`\`

CJS 不支持，必须包在 async 函数里。

## Node 中的互操作

Node 同时支持两套，靠扩展名 / package.json 的 \`type\` 字段区分：
- \`.cjs\` 或 \`type: "commonjs"\` → CJS
- \`.mjs\` 或 \`type: "module"\` → ESM

### CJS 引用 ESM

\`\`\`js
// CJS 中只能用动态 import() 引用 ESM（因为 ESM 是异步加载）
const esm = await import('./lib.mjs')
\`\`\`

### ESM 引用 CJS

\`\`\`js
// ESM 中可用默认导入引用 CJS 的 module.exports
import lib from './lib.cjs'   // lib === module.exports
// 但具名导入不可靠（CJS 是运行时确定的，无法静态分析具名）
\`\`\`

## 默认导出 vs 具名导出

\`\`\`js
// ESM
export default function() {}   // 默认（一个模块只能一个）
export const a = 1             // 具名（多个）

import x from './m'            // 拿默认
import { a } from './m'        // 拿具名
import x, { a } from './m'     // 同时拿
\`\`\`

CJS 只有 \`module.exports\` 一个对象，没有"默认"概念，互操作时 ESM 的 \`default\` 通常指向整个 \`module.exports\`。

## 常见坑

- **循环依赖**：CJS 返回已执行部分（可能 undefined）；ESM 通过 live binding 延迟取值，但引用未初始化变量会 ReferenceError（TDZ）。
- **\`\_\_dirname / \_\_filename\`**：ESM 没有这些全局变量，要用 \`import.meta.url\` + \`fileURLToPath\` 替代。
- **JSON 导入**：CJS \`require('./a.json')\` 直接可用；ESM 需 \`assert { type: 'json' }\` 或断言（实验性）。
- **Tree Shaking**：只有 ESM 静态导出可被摇掉，CJS 不行，所以库发布优先 ESM。`
  },
  {
    id: 'js-024',
    category: 'javascript',
    title: '防抖与节流的区别、应用与实现？',
    difficulty: '中等',
    tags: ['防抖', '节流', '性能优化', '事件', '闭包'],
    answer: `## 一句话区别

- **防抖（debounce）**：事件停止触发 n 秒后才执行，**重新触发就重新计时**。→ "等你说完再做"。
- **节流（throttle）**：n 秒内只执行一次，**固定频率触发**。→ "按节奏做"。

## 场景对照

| 场景 | 选哪个 | 原因 |
| --- | --- | --- |
| 搜索框输入联想 | 防抖 | 用户还在打字，等停顿再请求 |
| window resize 重新计算布局 | 防抖 | 拖动过程频繁触发，结束后算一次 |
| 按钮防重复提交 | 防抖 | 只关心最后一次点击 |
| 滚动加载更多 | 节流 | 滚动过程持续触发，按固定频率检测 |
| 鼠标拖拽 / 移动画线 | 节流 | 持续移动要实时响应，但不能每像素都算 |
| 游戏射击（按住鼠标连发） | 节流 | 固定射速 |

## 防抖实现

\`\`\`js
function debounce(fn, delay, immediate = false) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    if (immediate && !timer) {
      fn.apply(this, args)        // 首次立即执行
    }
    timer = setTimeout(() => {
      if (!immediate) fn.apply(this, args)
      timer = null
    }, delay)
  }
}

const search = debounce(e => fetchResults(e.target.value), 300)
input.addEventListener('input', search)
\`\`\`

进阶版应支持：取消（\`cancel\`）、立即执行（\`immediate\`）、返回 Promise。

## 节流实现（两种）

### 时间戳版（首次立即执行，停止后不再触发）

\`\`\`js
function throttle(fn, interval) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      fn.apply(this, args)
      last = now
    }
  }
}
\`\`\`

### 定时器版（首次不执行，停止后再触发一次尾部）

\`\`\`js
function throttle(fn, interval) {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, interval)
    }
  }
}
\`\`\`

### 综合版（首尾都触发，最常用）

\`\`\`js
function throttle(fn, interval) {
  let last = 0, timer = null
  return function (...args) {
    const now = Date.now()
    const remaining = interval - (now - last)
    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null }
      fn.apply(this, args)
      last = now
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        last = Date.now()
        timer = null
      }, remaining)
    }
  }
}
\`\`\`

## 取消功能

\`\`\`js
function debounce(fn, delay) {
  let timer
  const debounced = function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
  debounced.cancel = () => { clearTimeout(timer); timer = null }
  return debounced
}
\`\`\`

## 用闭包理解

防抖/节流的本质是**用闭包保存 timer / last 变量**，每次调用访问并修改它。这也是闭包的经典面试题。

## 实际库

- Lodash：\`_.debounce\` / \`_.throttle\`，支持 \`leading\`（首次）、\`trailing\`（尾部）、\`maxWait\`。
- React 中用 \`useMemo\` 或 \`useRef\` 持久化防抖函数，避免每次渲染重建。`
  },
  {
    id: 'js-025',
    category: 'javascript',
    title: 'XHR、Fetch、Axios 的区别与封装？',
    difficulty: '中等',
    tags: ['XHR', 'Fetch', 'Axios', 'HTTP', '请求封装'],
    answer: `## 三者对比

| 维度 | XMLHttpRequest | Fetch | Axios |
| --- | --- | --- | --- |
| 标准 | W3C 老标准 | 浏览器原生（WHATWG） | 第三方库 |
| API 风格 | 事件回调 | Promise | Promise + 拦截器 |
| 请求/响应拦截 | 手动 | 无内置 | 内置 |
| 超时控制 | \`timeout\` 属性 | \`AbortController\` | \`timeout\` 配置 |
| 上传/下载进度 | 支持（progress 事件） | 支持（Response.body 流） | 支持 |
| 自动 JSON | 否 | 否（手动 \`res.json()\`） | 是 |
| 错误处理 | 状态码 + onerror | 网络错才 reject，4xx/5xx 不报错 | 4xx/5xx 自动 reject |
| 取消请求 | \`xhr.abort()\` | \`AbortController\` | CancelToken / AbortController |
| 兼容性 | 全兼容 | 现代浏览器 | 全兼容（内部按环境切 XHR/http） |

## XHR：事件回调老大哥

\`\`\`js
const xhr = new XMLHttpRequest()
xhr.open('POST', '/api/login', true)
xhr.timeout = 5000
xhr.setRequestHeader('Content-Type', 'application/json')
xhr.upload.onprogress = e => console.log('上传', e.loaded / e.total)
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log(JSON.parse(xhr.responseText))
    }
  }
}
xhr.onerror = () => console.error('网络错误')
xhr.send(JSON.stringify({ user: 'a', pwd: 'b' }))
\`\`\`

## Fetch：现代原生

\`\`\`js
// 基础
const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user: 'a', pwd: 'b' })
})
if (!res.ok) throw new Error('HTTP ' + res.status)   // 注意：4xx 不会自动 throw
const data = await res.json()

// 超时（AbortController）
const ctrl = new AbortController()
const timer = setTimeout(() => ctrl.abort(), 5000)
try {
  const res = await fetch('/api', { signal: ctrl.signal })
} catch (e) {
  if (e.name === 'AbortError') console.log('超时或取消')
}

// 下载进度
const reader = res.body.getReader()
let received = 0
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  received += value.length
  console.log('下载', received)
}
\`\`\`

Fetch 的坑：**默认不带 cookie**（要 \`credentials: 'include'\`）、**4xx/5xx 不 reject**、**无内置超时**。

## Axios：封装层王者

\`\`\`js
import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截：加 token
http.interceptors.request.use(cfg => {
  cfg.headers.Authorization = 'Bearer ' + getToken()
  return cfg
})

// 响应拦截：统一错误处理 + token 刷新
http.interceptors.response.use(
  res => res.data,                       // 直接拿 data
  async err => {
    if (err.response?.status === 401) {
      await refreshToken()
      return http(err.config)            // 重发
    }
    return Promise.reject(err)
  }
)

const data = await http.post('/login', { user: 'a' })
\`\`\`

## 自己封装一个 Fetch

\`\`\`js
async function request(url, options = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), options.timeout || 10000)
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal, credentials: 'include' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('请求超时')
    throw e
  } finally {
    clearTimeout(timer)
  }
}
\`\`\`

## 选型建议

- **新项目**：Fetch + 自己封装（轻量、可控、原生）或 Axios（省事、生态全）。
- **需要拦截器、转换器、取消、并发\`all/race\`**：Axios。
- **流式上传/下载、Service Worker 内**：Fetch。
- **极老兼容**：XHR。`
  },
  {
    id: 'js-026',
    category: 'javascript',
    title: 'requestAnimationFrame 与 requestIdleCallback 的区别？',
    difficulty: '中等',
    tags: ['requestAnimationFrame', 'requestIdleCallback', '动画', '性能', '帧'],
    answer: `## 都是什么

两者都是浏览器提供的"按帧调度"API，把任务安排到合适的渲染时机执行。

| 维度 | requestAnimationFrame (rAF) | requestIdleCallback (rIC) |
| --- | --- | --- |
| 触发时机 | 每次重绘**前** | 浏览器**空闲**时 |
| 频率 | 跟随屏幕刷新率（60Hz / 120Hz） | 不固定，有空才调 |
| 适用 | 动画、视觉相关计算 | 不紧急的后台任务 |
| 帧预算 | 16.7ms（60fps） | 剩余时间（\`deadline.timeRemaining()\`） |
| 取消 | \`cancelAnimationFrame\` | \`cancelIdleCallback\` |
| 后台标签页 | 自动暂停（省电） | 仍可能调用（频率极低） |

## requestAnimationFrame：动画首选

\`\`\`js
let start = null
function step(timestamp) {
  if (!start) start = timestamp
  const progress = timestamp - start
  el.style.transform = \`translateX(\${Math.min(progress / 10, 200)}px)\`
  if (progress < 2000) requestAnimationFrame(step)
}
requestAnimationFrame(step)
\`\`\`

为什么不用 setInterval 做动画？
- setInterval 不和刷新率同步，可能丢帧/抖动。
- rAF 在标签页隐藏时自动暂停，省 CPU/电量。
- rAF 回调拿到精确的 \`timestamp\`，方便做缓动。

## requestIdleCallback：低优先级任务

\`\`\`js
const tasks = [parseChunk1, parseChunk2, renderList]
function work(deadline) {
  // deadline.timeRemaining() 返回当前帧剩余空闲时间（ms）
  while (deadline.timeRemaining() > 0 && tasks.length) {
    tasks.shift()()
  }
  if (tasks.length) requestIdleCallback(work)
}
requestIdleCallback(work, { timeout: 2000 })   // timeout：最多等多久
\`\`\`

\`timeout\` 表示"如果一直没空闲，最多 2s 后强制执行"，避免任务饿死。

## 典型场景

### rAF
- DOM 动画、Canvas / WebGL 渲染
- 滚动视差、跟随鼠标的元素
- 测量元素尺寸后同步改样式（避免布局抖动）

### rIC
- 数据预加载、报表数据预解析
- 大列表分块渲染（虚拟列表外的方案）
- 埋点上报、离线日志处理
- React 时间分片（React Scheduler 早期用 rIC，后改 MessageChannel）

## rIC 的局限

- 兼容性：Safari 较晚支持（16+），老环境需 polyfill（用 rAF 模拟）。
- 不能做紧急任务：\`timeRemaining()\` 通常 0~50ms，超时会被打断。
- 不要在 rIC 里改 DOM：它可能在帧之后执行，改了会触发额外重排。

## 实战：长任务分片

\`\`\`js
// 把 10w 条数据分块处理，避免阻塞主线程
function chunkProcess(items, process, done) {
  let i = 0
  function work(deadline) {
    while (i < items.length && deadline.timeRemaining() > 0) {
      process(items[i++])
    }
    if (i < items.length) requestIdleCallback(work, { timeout: 500 })
    else done()
  }
  requestIdleCallback(work)
}
\`\`\`

## 一句话总结

**rAF = 抢帧做动画（高优先级，每帧必调）；rIC = 捡空闲做杂活（低优先级，有空才调）。** 两者配合能避免长任务卡顿，是性能优化的关键工具。`
  },
  {
    id: 'js-027',
    category: 'javascript',
    title: 'Web Worker 的使用场景、通信与限制？',
    difficulty: '中等',
    tags: ['Web Worker', '多线程', 'postMessage', 'Transferable', '性能'],
    answer: `## 为什么需要 Web Worker

JS 是单线程，主线程跑 UI + 脚本。计算密集任务（解析大 JSON、图像处理、加密）会阻塞 UI 导致卡顿。

**Web Worker 让 JS 在独立线程跑**，主线程保持流畅。

## 基础用法

### 主线程

\`\`\`js
const worker = new Worker('./heavy.worker.js')
worker.postMessage({ data: bigArray })
worker.onmessage = e => console.log('结果', e.data)
worker.onerror = e => console.error('错误', e.message)
\`\`\`

### Worker 线程（heavy.worker.js）

\`\`\`js
self.onmessage = e => {
  const result = heavyCompute(e.data.data)
  self.postMessage(result)
}
\`\`\`

通信是**异步**的（postMessage 默认会结构化克隆数据）。

## 通信方式

### 1. postMessage + 结构化克隆

最常用，但**数据会被深拷贝**，大对象开销大。

\`\`\`js
worker.postMessage(bigArray)   // 主→Worker，克隆一份
\`\`\`

### 2. Transferable Objects（转移所有权，零拷贝）

\`ArrayBuffer\`、\`MessagePort\`、\`ImageBitmap\`、\`OffscreenCanvas\` 可"转移"，原线程失去访问权。

\`\`\`js
const buffer = new ArrayBuffer(1024 * 1024 * 100)  // 100MB
worker.postMessage(buffer, [buffer])   // 第二参数：transfer list
// 此后主线程的 buffer.byteLength === 0（已转移）
\`\`\`

**性能关键**：处理图像/音频/大数据，先转 ArrayBuffer 再 transfer，避免拷贝。

### 3. SharedArrayBuffer + Atomics（共享内存）

多线程共享同一段内存，配合 \`Atomics\` 做同步。需 COOP/COEP 安全头，限制较多。

\`\`\`js
const sab = new SharedArrayBuffer(1024)
const view = new Int32Array(sab)
worker.postMessage(sab)   // 共享，不转移
// Worker 内 Atomics.add(view, 0, 1)
\`\`\`

## Worker 类型

### Dedicated Worker（专用）
为一个页面服务，页面关闭即销毁。最常用。

### Shared Worker（共享）
多个标签页共享一个 Worker，\`new SharedWorker('./x.js')\`，通过 \`port\` 通信。

### Service Worker
独立，做离线缓存/推送/后台同步（PWA 核心），生命周期长于页面。

## 适合 Worker 的场景

| 场景 | 例子 |
| --- | --- |
| 数据解析 | 大 CSV / JSON / Excel 解析、papa-parse |
| 图像处理 | Canvas 像素运算、滤镜、压缩 |
| 加密 / 压缩 | AES、gzip、zstd |
| 文本处理 | Markdown 解析、语法高亮、搜索索引 |
| 复杂计算 | 物理引擎、路径规划、机器学习推理 |
| 流式处理 | WebSocket 大数据流、SSE 聚合 |

## 限制

- **不能操作 DOM**（没 window/document，只有 self）。
- **不能访问主线程变量**，只能 postMessage 通信。
- **同源限制**：Worker 脚本需同源（或 Blob URL）。
- **模块支持**：\`new Worker('./x.js', { type: 'module' })\` 可用 import（现代浏览器）。
- **资源开销**：每个 Worker 是独立线程，启动有成本，不要频繁创建/销毁，用线程池。

## 实战：JSON 大文件解析

\`\`\`js
// parse.worker.js
self.onmessage = async e => {
  const text = await e.data.file.text()
  const json = JSON.parse(text)         // 主线程不卡
  self.postMessage(json, [])             // 可转移中间 buffer
}
\`\`\`

## 配合 OffscreenCanvas（Worker 里画图）

\`\`\`js
const offscreen = canvas.transferControlToOffscreen()
const worker = new Worker('./render.worker.js')
worker.postMessage({ canvas: offscreen }, [offscreen])   // 转交 canvas
// Worker 内拿到 canvas，用 getContext('2d' / 'webgl') 绘制，主线程零负担
\`\`\`

## 坑

- **调试**：Worker 代码在 DevTools 单独的 console，需切换上下文。
- **打包**：Vite/Webpack 需配置 \`new Worker(new URL('./x.js', import.meta.url), { type: 'module' })\`。
- **内存**：Worker 不释放会泄漏，用完 \`worker.terminate()\`。
- **通信频率**：postMessage 有调度开销，高频小消息反而比主线程直接算慢，要批处理。`
  },
  {
    id: 'js-028',
    category: 'javascript',
    title: '函数式编程：纯函数、柯里化、组合与管道？',
    difficulty: '困难',
    tags: ['函数式编程', '纯函数', '柯里化', '组合', '管道', 'point-free'],
    answer: `## 函数式编程（FP）核心思想

把程序看作**数据的变换流水线**：数据流经一系列纯函数，最终得到结果。重点：
- 纯函数（无副作用、确定性）
- 不可变数据（不修改原数据，返回新数据）
- 函数是一等公民（可传参、可返回）
- 声明式（说"做什么"，不说"怎么做"）

## 纯函数

**相同输入永远相同输出，且不产生副作用**（不修改外部状态、不发请求、不写文件）。

\`\`\`js
// 纯函数
const add = (a, b) => a + b
const toUpper = s => s.toUpperCase()

// 非纯（依赖外部状态、有副作用）
let count = 0
const inc = () => ++count        // 修改外部
const random = () => Math.random()  // 不确定
const log = msg => console.log(msg) // 副作用
\`\`\`

好处：易测试、易缓存（memoize）、可并发、可推演。

## 柯里化（Currying）

把**多参数函数**转成**一连串单参数函数**：

\`\`\`js
// 普通
const add = (a, b, c) => a + b + c
add(1, 2, 3)   // 6

// 柯里化
const curriedAdd = a => b => c => a + b + c
curriedAdd(1)(2)(3)   // 6

// 通用实现
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...next) => curried(...args, ...next)
  }
}
const sum = curry((a, b, c) => a + b + c)
sum(1)(2)(3)   // 6
sum(1, 2)(3)   // 6
sum(1)(2, 3)   // 6
\`\`\`

用途：**参数复用 / 延迟执行**。

\`\`\`js
const log = curry((level, time, msg) => \`\${level} [\${time}] \${msg}\`)
const error = log('ERROR')
const errorNow = error(new Date().toISOString())
errorNow('DB 连接失败')
\`\`\`

## 组合（Composition）/ 管道（Pipeline）

把多个函数"接起来"，前一个的输出是后一个的输入。

\`\`\`js
// 组合：从右往左执行
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)

// 管道：从左往右执行（更直观）
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)

const toUpperCase = s => s.toUpperCase()
const reverse = s => s.split('').reverse().join('')
const exclaim = s => s + '!'

// "hello" → 大写 → 反转 → 加感叹号
const transform = pipe(toUpperCase, reverse, exclaim)
transform('hello')   // "OLLEH!"
\`\`\`

对照命令式写法：\`exclaim(reverse(toUpperCase('hello')))\` —— 嵌套难读；管道是"数据流向左到右"，可读性强。

## Point-Free（无参数风格）

不显式提到要操作的数据，只组合函数。

\`\`\`js
// 非 point-free
const isEven = n => n % 2 === 0
const getEvens = nums => nums.filter(n => isEven(n))

// point-free
const getEvens = nums => nums.filter(isEven)   // 不出现 n
\`\`\`

更优雅，但要小心可读性。

## 不可变数据

\`\`\`js
// 不好：直接改
user.age = 20
arr.push(item)

// 好：返回新对象/数组
const newUser = { ...user, age: 20 }
const newArr = [...arr, item]
const filtered = arr.filter(x => x > 0)
\`\`\`

库支持：Immer（\`produce\` 用 Proxy 让你"写"但产出不可变）、Ramda、Lodash/fp。

## 高阶函数

以函数为参数或返回值的函数：\`map / filter / reduce / forEach\`。

\`\`\`js
const nums = [1, 2, 3, 4]
const result = nums
  .filter(n => n % 2 === 0)        // [2, 4]
  .map(n => n * 10)                // [20, 40]
  .reduce((sum, n) => sum + n, 0)  // 60
\`\`\`

这就是 FP 的"数据流水线"。

## 实战：表单校验

\`\`\`js
const isEmpty = s => s.trim() === ''
const isShort = n => s => s.length < n
const hasAt = s => s.includes('@')

// 组合校验规则
const validators = [
  { rule: isEmpty, msg: '不能为空' },
  { rule: isShort(6), msg: '至少 6 位' },
  { rule: hasAt, msg: '需包含 @' }
]

const validate = (val, rules) =>
  rules.map(({ rule, msg }) => (rule(val) ? null : msg)).filter(Boolean)

validate('abc', validators)   // ['至少 6 位', '需包含 @']
\`\`\`

## 副作用隔离

FP 不是消除副作用（程序总要 IO），而是**把副作用推到边界**：核心逻辑纯函数，副作用在 outer 层执行。

\`\`\`js
// 纯：算出要打印什么
const buildMsg = user => \`Hello, \${user.name}\`
// 非纯：执行打印
const print = msg => console.log(msg)
print(buildMsg(user))   // 副作用只在 print 这一层
\`\`\`

## 库生态

- **Ramda**：FP 工具集，自动柯里化、point-free 友好。
- **Lodash/fp**：Lodash 的 FP 版本。
- **Immer**：不可变数据。
- **RxJS**：响应式 FP，事件流。

## 面试要点

- 纯函数 = 可测试 + 可缓存 + 可并发。
- 柯里化解决"参数复用"和"延迟执行"。
- compose/pipe 解决"函数串联"，pipe 更直观。
- Point-Free 提升表达力但别过度。
- React / Redux / Hooks 设计大量借鉴 FP（reducer 是纯函数、useMemo 缓存纯函数结果）。`
  },
  // ===== 以下为补充题目（js-029 ~ js-058）=====
  {
    id: 'js-029',
    category: 'javascript',
    title: 'JS 模块化经历了哪些阶段？IIFE/AMD/CMD/UMD/ESM 各是什么？',
    difficulty: '中等',
    tags: ['模块化', 'IIFE', 'AMD', 'CMD', 'UMD', 'ESM'],
    answer: `## 模块化演进

### 1. 全局变量 + IIFE（早期）
没有模块系统，靠全局变量约定，用立即执行函数隔离作用域：
\`\`\`js
var Module = (function () {
  var private = 'x'
  return { get() { return private } }
})()
\`\`\`
缺点：依赖靠 \`<script>\` 顺序、命名空间污染、依赖不显式。

### 2. AMD（Asynchronous Module Definition）
浏览器优先，**异步**加载依赖，代表 **RequireJS**：
\`\`\`js
define(['jquery', 'lodash'], function ($, _) {
  return { doSomething() { $.ajax(...) } }
})
\`\`\`
- 依赖前置、异步加载，适合浏览器。
- 回调写法繁琐。

### 3. CMD（Common Module Definition）
**Sea.js** 推崇，依赖**就近**、按需执行：
\`\`\`js
define(function (require, exports, module) {
  var $ = require('jquery')  // 用到才 require
  exports.doSomething = function () { ... }
})
\`\`\`
与 AMD 的区别：AMD 依赖前置提前执行，CMD 依赖就近延迟执行。

### 4. CommonJS（CJS）
Node.js 标准，**同步**加载，运行时求值：
\`\`\`js
const fs = require('fs')
module.exports = { read() { return fs.readFileSync('a') } }
\`\`\`
- 同步加载适合服务端文件系统，浏览器需打包（Webpack）。
- \`module.exports\` / \`exports\` / \`require\`。

### 5. UMD（Universal Module Definition）
兼容 CJS + AMD + 全局的"万能"包装，给库发布用：
\`\`\`js
(function (root, factory) {
  if (typeof exports === 'object') module.exports = factory(require('lodash'))
  else if (typeof define === 'function') define(['lodash'], factory)
  else root.MyLib = factory(root._)
})(this, function (_) { return { ... } })
\`\`\`

### 6. ES Modules（ESM）
ES6 语言级标准，**静态**结构，编译期确定依赖：
\`\`\`js
import $ from 'jquery'
export function doSomething() { ... }
export default { ... }
\`\`\`
- 静态结构 → 支持 Tree Shaking、静态分析。
- \`export\` 是**引用绑定**（不是值拷贝），CJS 是值拷贝。
- 浏览器原生支持 \`<script type="module">\`，Node 也已支持。

## 对比

| | CJS | ESM |
| --- | --- | --- |
| 加载 | 同步、运行时 | 异步、编译期静态分析 |
| 导出 | 值拷贝 | 引用绑定（live binding） |
| 是否可 Tree Shake | 否 | 是 |
| 顶层 \`this\` | \`module.exports\` | \`undefined\` |
| 动态 | \`require(x)\` 任意 | \`import()\` 动态、\`import\` 静态 |

## 趋势

新项目首选 **ESM**；库发布提供 ESM + CJS 双入口（package.json \`exports\` 字段）；构建工具（Vite/esbuild）原生 ESM。`
  },
  {
    id: 'js-030',
    category: 'javascript',
    title: 'call、apply、bind 的区别？能手写实现吗？',
    difficulty: '中等',
    tags: ['call', 'apply', 'bind', 'this', '手写'],
    answer: `## 三者作用

都用于**显式指定函数的 this**，区别在调用方式与是否立即执行：

| 方法 | 调用 | 是否立即执行 | 返回值 |
| --- | --- | --- | --- |
| \`call\` | \`fn.call(thisArg, arg1, arg2)\` | ✅ 立即 | 函数返回值 |
| \`apply\` | \`fn.apply(thisArg, [arg1, arg2])\` | ✅ 立即 | 函数返回值 |
| \`bind\` | \`fn.bind(thisArg, arg1)\` | ❌ 返回新函数 | 新函数 |

\`\`\`js
function greet(greeting, punct) {
  return greeting + ', ' + this.name + punct
}
const obj = { name: 'Vue' }

greet.call(obj, 'Hello', '!')      // "Hello, Vue!"
greet.apply(obj, ['Hi', '.'])      // "Hi, Vue."
const bound = greet.bind(obj, 'Hey')
bound('?')                          // "Hey, Vue?"（可继续传参）
\`\`\`

- \`call\` 参数逐个传，\`apply\` 参数数组传。
- \`bind\` 是**预设** this 和部分参数（柯里化），返回的函数可再传剩余参数。
- \`bind\` 返回的函数作为构造函数（\`new\`）时，绑定的 this 失效（以 new 的实例为准）。

## 手写 call

\`\`\`js
Function.prototype.myCall = function (thisArg, ...args) {
  // 原始值 this 包装为对象；null/undefined 指向全局
  const ctx = thisArg == null ? globalThis : Object(thisArg)
  const key = Symbol('fn')
  ctx[key] = this              // 把函数作为对象属性，调用时 this 指向该对象
  const res = ctx[key](...args)
  delete ctx[key]
  return res
}
\`\`\`

## 手写 apply

\`\`\`js
Function.prototype.myApply = function (thisArg, args = []) {
  const ctx = thisArg == null ? globalThis : Object(thisArg)
  const key = Symbol('fn')
  ctx[key] = this
  const res = ctx[key](...args)
  delete ctx[key]
  return res
}
\`\`\`

## 手写 bind

\`\`\`js
Function.prototype.myBind = function (thisArg, ...preArgs) {
  const originFn = this
  const bound = function (...restArgs) {
    // 作为构造函数时 this 指向实例，否则用绑定的 thisArg
    const isNew = new.target !== undefined
    return originFn.call(isNew ? this : thisArg, ...preArgs, ...restArgs)
  }
  // 维持原型链（new 时能继承原函数原型）
  bound.prototype = Object.create(originFn.prototype)
  return bound
}
\`\`\`

## 要点

- 实现核心思路：**把函数设为对象的属性**，通过 \`obj.fn()\` 调用让 \`this\` 指向 \`obj\`，用 \`Symbol\` 避免覆盖原有属性。
- \`bind\` 注意 \`new\` 场景与原型继承。
- 箭头函数没有自己的 this，\`call/apply/bind\` 对它无效（this 仍是定义时外层的 this）。`
  },
  {
    id: 'js-031',
    category: 'javascript',
    title: 'new 操作符做了什么？能手写一个 new 吗？',
    difficulty: '中等',
    tags: ['new', '构造函数', '原型', '手写'],
    answer: `## new 做了 4 件事

\`new Foo(...args)\` 执行流程：

1. **创建一个新对象**。
2. 将新对象的 \`[[Prototype]]\` 指向构造函数的 \`prototype\`（建立原型链）。
3. 以新对象为 \`this\` 执行构造函数（初始化实例属性）。
4. 若构造函数返回的是对象，则返回该对象；否则返回新对象。

\`\`\`js
function Person(name) {
  this.name = name
}
Person.prototype.say = function () { return this.name }

const p = new Person('Vue')
p instanceof Person  // true
p.say()              // 'Vue'
\`\`\`

## 注意第 4 点

构造函数显式 \`return\` 一个**对象**，会覆盖默认返回的实例：
\`\`\`js
function Foo() {
  this.a = 1
  return { b: 2 }   // 返回对象 → new 结果是这个对象
}
new Foo()           // { b: 2 }，a 丢失

function Bar() {
  this.a = 1
  return 42          // 返回原始值 → 被忽略，仍返回 this
}
new Bar()            // { a: 1 }
\`\`\`

## 手写 new

\`\`\`js
function myNew(Ctor, ...args) {
  // 1. 创建对象，原型指向构造函数的 prototype
  const obj = Object.create(Ctor.prototype)
  // 2. 以 obj 为 this 执行构造函数
  const res = Ctor.apply(obj, args)
  // 3. 构造函数返回对象则用之，否则用 obj
  return (res !== null && typeof res === 'object' || typeof res === 'function') ? res : obj
}
\`\`\`

\`\`\`js
const p2 = myNew(Person, 'React')
p2.say()  // 'React'
\`\`\`

## 边界

- 箭头函数不能 \`new\`（没有 \`[[Construct]]\`），\`new (() => {})\` 抛 TypeError。
- \`Symbol\` 不能 \`new\`（它是原始值包装器，但设计为不可构造）。
- 类（\`class\`）必须 \`new\` 调用，不 \`new\` 会抛错。
- \`Object.create(null)\` 创建的对象无原型，\`new\` 配合需保证 \`Ctor.prototype\` 存在。`
  },
  {
    id: 'js-032',
    category: 'javascript',
    title: 'instanceof 的原理是什么？能手写吗？',
    difficulty: '中等',
    tags: ['instanceof', '原型链', '手写'],
    answer: `## 原理

\`a instanceof B\` 沿 \`a\` 的**原型链**逐层查找，看是否有节点**全等于** \`B.prototype\`。

\`\`\`js
[] instanceof Array           // true（[].__proto__ === Array.prototype）
[] instanceof Object          // true（原型链上有 Object.prototype）
function Foo() {}
new Foo() instanceof Foo      // true

const obj = Object.create(null)
obj instanceof Object         // false（obj 无原型链）
\`\`\`

## 手写

\`\`\`js
function myInstanceof(left, right) {
  // 原始类型直接 false
  if (left == null || typeof left !== 'object' && typeof left !== 'function') {
    return false
  }
  let proto = Object.getPrototypeOf(left)  // 等价于 left.__proto__
  while (proto !== null) {
    if (proto === right.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
\`\`\`

\`\`\`js
myInstanceof([], Array)    // true
myInstanceof([], Object)   // true
myInstanceof(123, Number)  // false（原始值）
\`\`\`

## 注意

1. **只能判断引用类型**：\`'a' instanceof String\` 为 \`false\`（原始值无原型链），\`new String('a') instanceof String\` 才为 \`true\`。
2. **跨 iframe / 跨 realm 失效**：每个 iframe 有独立的 \`Array\` 构造函数，\`iframe.contentWindow.array instanceof Array\` 为 \`false\`。判断数组用 \`Array.isArray()\` 更可靠。
3. **\`instanceof\` 会触发 \`Symbol.hasInstance\`**：自定义类的判别行为可改写：
   \`\`\`js
   class Even {
     static [Symbol.hasInstance](x) { return x % 2 === 0 }
   }
   4 instanceof Even  // true
   \`\`\`
4. **修改原型会改变结果**：\`Object.setPrototypeOf(obj, B.prototype)\` 后 \`obj instanceof B\` 变 \`true\`，但不推荐运行时改原型。
5. **\`Object.create(null)\`** 创建的对象原型为 \`null\`，对所有 \`instanceof\` 返回 \`false\`，常用于纯字典对象。`
  },
  {
    id: 'js-033',
    category: 'javascript',
    title: 'Object.create 的作用？它如何实现原型式继承？',
    difficulty: '中等',
    tags: ['Object.create', '原型', '继承'],
    answer: `## 作用

\`Object.create(proto, propertiesObject)\` 创建一个新对象，指定其 \`[[Prototype]]\` 和属性描述符。

\`\`\`js
const proto = { greet() { return 'hi' } }
const obj = Object.create(proto)
obj.greet()             // 'hi'（继承自原型）
Object.getPrototypeOf(obj) === proto  // true
\`\`\`

## 原型式继承

道格拉斯·克罗克福德提出的继承模式：不通过构造函数，直接基于已有对象创建新对象。

\`\`\`js
// Object.create 的简化原理
function create(proto) {
  function F() {}
  F.prototype = proto
  return new F()
}
\`\`\`
用一个临时空构造函数，把其 \`prototype\` 指向目标对象，\`new\` 出来的实例就继承了目标。

## 与字面量/new 的区别

\`\`\`js
// 1. 字面量：原型固定是 Object.prototype
const a = {}              // Object.getPrototypeOf(a) === Object.prototype

// 2. Object.create：可指定任意原型（含 null）
const b = Object.create(null)   // 无原型，纯字典
const c = Object.create({ x: 1 }) // 原型是 { x: 1 }

// 3. new：原型是构造函数的 prototype
const d = new Foo()
\`\`\`

## 第二个参数（属性描述符）

\`\`\`js
const obj = Object.create(proto, {
  name: { value: 'Vue', enumerable: true, writable: true, configurable: true }
})
\`\`\`
等价于 \`Object.defineProperties\` 的描述符格式（不能简写为值）。

## 应用场景

### 1. 创建无原型对象（字典/Map 替代）
\`\`\`js
const dict = Object.create(null)
dict.toString  // undefined，避免原型污染与键名冲突
\`\`\`

### 2. 原型式继承（组合寄生继承）
\`\`\`js
function inherit(Sub, Sup) {
  Sub.prototype = Object.create(Sup.prototype)
  Sub.prototype.constructor = Sub
}
\`\`\`
比 \`Sub.prototype = new Sup()\` 更优：不执行父构造函数、不继承实例属性。

### 3. 防篡改的对象副本
\`\`\`js
const safe = Object.create(target)  // 在原型上读，写时新建自身属性
\`\`\`

## 注意

- \`Object.create(null)\` 对象没有 \`toString\`/\`hasOwnProperty\` 等方法，JSON.stringify 可能行为异常，慎用。
- 第二参数省略时只设原型。
- 创建的对象原型指向 \`proto\`，但 \`proto.constructor\` 仍是 \`proto\` 自己的 constructor，不会自动指向新对象。`
  },
  {
    id: 'js-034',
    category: 'javascript',
    title: 'this 的绑定优先级是怎样的？',
    difficulty: '中等',
    tags: ['this', '绑定优先级', 'call', 'bind', 'new'],
    answer: `## 四种 this 绑定

| 绑定方式 | 触发 | 优先级 |
| --- | --- | --- |
| 默认绑定 | 独立函数调用 \`fn()\` | 最低 |
| 隐式绑定 | 对象方法 \`obj.fn()\` | ↑ |
| 显式绑定 | \`call/apply/bind\` | ↑ |
| new 绑定 | \`new fn()\` | 最高 |

**优先级：new > 显式(bind/call/apply) > 隐式 > 默认**。

## 逐级演示

### 1. 默认绑定
\`\`\`js
function show() { console.log(this) }
show()  // 非严格：window；严格模式：undefined
\`\`\`

### 2. 隐式绑定（谁调用就是谁）
\`\`\`js
const obj = { show() { console.log(this) } }
obj.show()  // obj
\`\`\`
**隐式丢失**：把方法赋值再调用，this 丢失：
\`\`\`js
const fn = obj.show
fn()  // window（默认绑定）
\`\`\`

### 3. 显式绑定（call/apply/bind）
\`\`\`js
function show() { console.log(this.name) }
show.call({ name: 'A' })      // 'A'（显式 > 隐式）
const obj = { name: 'B', show }
obj.show.call({ name: 'C' })  // 'C'
\`\`\`

### 4. new 绑定（最高）
\`\`\`js
function Foo(name) { this.name = name }
const bound = Foo.bind({ name: 'X' })
const inst = new bound('Y')
inst.name  // 'Y'（new 优先级高于 bind）
\`\`\`
\`new\` 会**忽略** bind 绑定的 this，以新实例为准（但 bind 预设的参数仍生效）。

## 箭头函数（例外）

箭头函数**没有自己的 this**，继承定义处外层的 this，**无法被 call/apply/bind/new 改变**：

\`\`\`js
const arrow = () => console.log(this)
arrow.call({ x: 1 })  // 仍是外层 this（window/undefined）

const obj = {
  name: 'A',
  arrow: () => console.log(this.name),
  normal() { console.log(this.name) }
}
obj.arrow()   // undefined（this 是外层，不是 obj）
obj.normal()  // 'A'
\`\`\`

箭头函数的 this 在**定义时**确定（词法 this），普通函数在**调用时**确定（动态 this）。

## 判断口诀

1. 函数是否 \`new\` 调用？→ this 是新实例。
2. 是否 \`call/apply/bind\`？→ this 是指定对象。
3. 是否对象方法 \`obj.fn()\`？→ this 是 obj。
4. 否则默认绑定（严格 undefined，非严格 window）。
5. 箭头函数？→ 外层 this，以上规则全部失效。

## 特殊场景

- 回调函数中的 this 常丢失，用 \`bind\` 或箭头函数修复。
- 事件监听 \`addEventListener\` 回调 this 是触发元素（除非用箭头）。
- DOM 内联事件 \`<button onclick="...">\` 中 this 是该元素。`
  },
  {
    id: 'js-035',
    category: 'javascript',
    title: '严格模式（use strict）有哪些变化？',
    difficulty: '中等',
    tags: ['use strict', '严格模式'],
    answer: `## 启用

- 脚本顶部：\`'use strict'\`（整个文件）。
- 函数顶部：仅该函数严格。
- ES 模块（\`import/export\`）和 \`class\` **默认严格**，无需声明。

## 主要变化

### 1. 禁止意外全局变量
\`\`\`js
'use strict'
x = 1            // ❌ ReferenceError（必须 let/var/const）
delete window.x  // ❌
\`\`\`

### 2. 静默失败改为抛错
\`\`\`js
'use strict'
const o = {}
Object.defineProperty(o, 'a', { value: 1, writable: false })
o.a = 2          // ❌ TypeError（非严格下静默失败）

delete Object.prototype  // ❌ TypeError
\`\`\`

### 3. this 默认为 undefined
\`\`\`js
function f() { console.log(this) }
f()  // 非严格：window；严格：undefined
\`\`\`

### 4. 禁止重复参数与属性
\`\`\`js
'use strict'
function f(a, a) {}   // ❌ SyntaxError
const o = { x: 1, x: 2 }  // ❌ SyntaxError（ES6 严格模式）
\`\`\`

### 5. arguments 行为更规范
\`\`\`js
'use strict'
function f(a) {
  a = 2
  return arguments[0]  // 严格：1（不再与形参联动）
}
\`\`\`
\`arguments.callee\` / \`caller\` 禁用。

### 6. 禁用 with
\`\`\`js
'use strict'
with (obj) { x }  // ❌ SyntaxError
\`\`\`

### 7. eval 有独立作用域
\`\`\`js
'use strict'
eval('var x = 1')  // x 不泄漏到外层
console.log(x)     // ReferenceError
\`\`\`

### 8. 保留字扩展
\`implements\`、\`interface\`、\`package\` 等不能作变量名；\`let\`/\`static\`/\`yield\` 在严格模式成为保留字。

### 9. 八进制字面量
\`\`\`js
'use strict'
0123  // ❌ SyntaxError（必须用 0o123）
\`\`\`

### 10. 函数声明位置限制
严格模式下函数不能在 \`if\`/\`for\` 块顶层声明（实际现代 JS 已用块作用域）。

## 意义

- 消除 JS 一些不安全、不合理特性（如静默失败、意外全局）。
- 为未来版本预留关键字。
- **性能**：严格模式下引擎可做更激进优化（如 arguments 不别名、this 不强制包装对象）。

## 注意

- 不要拼接严格与非严格脚本（严格模式可能"泄漏"到拼接后的整体）。
- \`'use strict'\` 必须在作用域顶部才生效。
- 旧代码迁移时注意 \`this\` 为 undefined 的破坏点（如 \`fn.call(null)\`）。`
  },
  {
    id: 'js-036',
    category: 'javascript',
    title: 'V8 的垃圾回收机制是怎样的？新生代、老生代、增量、并发回收各指什么？',
    difficulty: '困难',
    tags: ['V8', '垃圾回收', 'GC', '新生代', '老生代'],
    answer: `## V8 GC 概览

V8 把堆分为**新生代**（young generation）和**老生代**（old generation），分别用不同算法回收，基于"分代假说"：多数对象朝生夕灭，少数对象长期存活。

## 1. 新生代 — Scavenge（复制算法）

- 容量小（1~8MB），存放短生命周期对象。
- 平分为 **From** 和 **To** 两个半区。

### 回收过程
1. 从根遍历，标记 From 中存活对象。
2. 把存活对象**复制**到 To，复制过程中**整理内存**（消除碎片）。
3. 清空 From，From/To 角色互换。
4. 经历一次 Scavenge 仍存活的对象晋升到**老生代**。

### 晋升条件
- 第二次 Scavenge 仍存活。
- To 空间使用超过 25%。

## 2. 老生代 — Mark-Sweep + Mark-Compact

- 容量大（GB 级），存放长生命周期对象。
- **标记清除（Mark-Sweep）**：从根遍历标记可达对象，清除未标记对象。会产生内存碎片。
- **标记整理（Mark-Compact）**：移动存活对象到一端，消除碎片（开销大，仅在碎片多时触发）。

## 3. 增量标记（Incremental Marking）

全量标记会"Stop-The-World"（暂停 JS），大堆可达百毫秒卡顿。增量标记把标记任务拆成小步，**与 JS 交替执行**（每次几毫秒），用**三色标记**（白/灰/黑）记录进度。

- 黑：已访问，可达。
- 灰：已访问，但其引用未全部处理。
- 白：未访问（回收候选）。

## 4. 并发回收（Concurrent）

V8 8+ 引入：标记/清除任务在**辅助线程**与主线程并发执行，主线程只做少量同步，进一步降低停顿。写屏障（write barrier）保证并发一致性。

## 5. 并行 Scavenge

新生代 Scavenge 也在多辅助线程并行进行。

## 触发时机

- 新生代 From 满触发 Scavenge。
- 老生代占用超过阈值触发标记清除。
- 分配失败时强制 GC。
- 可手动 \`global.gc()\`（需 \`--expose-gc\`）。

## 与开发者相关

### 内存泄漏常见原因
- 意外全局变量（\`x = 1\`）。
- 被遗忘的定时器 / 事件监听未清理。
- 闭包持有大对象。
- 脱离 DOM 的引用（节点从文档移除但 JS 仍引用）。
- 缓存无上限（Map 不断增长）。

### 排查工具
- Chrome DevTools → Memory：堆快照对比、Allocation timeline、Allocation sampling。
- Performance Monitor 观察 JS 堆大小。
- \`performance.memory\`（Chrome）读取 \`usedJSHeapSize\`。

## 关键

- 分代 + 复制（新生代）+ 标记清除/整理（老生代）+ 增量 + 并发，组合降低停顿。
- 短命对象在新生代快速回收，长命对象稳定在老生代。
- 开发者关注泄漏与避免频繁大对象分配即可，GC 细节由引擎处理。`
  },
  {
    id: 'js-037',
    category: 'javascript',
    title: '常见的 JS 内存泄漏有哪些？如何排查？',
    difficulty: '困难',
    tags: ['内存泄漏', 'GC', 'DevTools', '排查'],
    answer: `## 常见泄漏场景

### 1. 意外全局变量
\`\`\`js
function foo() {
  name = 'leak'   // 漏了 let/var → 挂到 window
  this.x = 1      // 严格模式 this 是 undefined；非严格指向 window
}
\`\`\`
修复：用 \`'use strict'\` + \`let/const\`。

### 2. 被遗忘的定时器
\`\`\`js
setInterval(() => { ref.doSomething() }, 1000)
// 组件销毁未 clearInterval → ref 与闭包永不释放
\`\`\`
修复：销毁时 \`clearInterval\` / \`clearTimeout\`。

### 3. 未清理的事件监听
\`\`\`js
window.addEventListener('resize', handler)
// 组件卸载未 removeEventListener
\`\`\`
修复：卸载时移除，或用 \`AbortController\` 统一取消：
\`\`\`js
const ac = new AbortController()
window.addEventListener('resize', h, { signal: ac.signal })
// 卸载：ac.abort()
\`\`\`

### 4. 闭包持有大对象
\`\`\`js
function outer() {
  const huge = new Array(1e6).fill(0)
  return function inner() { console.log(huge.length) }  // huge 无法释放
}
\`\`\`
修复：用完置 \`huge = null\`，或只保留必要数据。

### 5. 脱离 DOM 的引用
\`\`\`js
const btn = document.getElementById('btn')
document.body.removeChild(btn)
// btn 仍被 JS 引用 → DOM 节点与它的监听/子树都不释放
\`\`\`
修复：移除后 \`btn = null\`。

### 6. 缓存无上限
\`\`\`js
const cache = {}
function get(k) { return cache[k] ??= fetch(k) }  // 只增不减
\`\`\`
修复：用 \`WeakMap\`（key 被回收自动清理）、LRU 限制大小、TTL 过期。

### 7. WeakMap/WeakSet 用错
\`Map\` 持有强引用 key，DOM 节点作 key 仍泄漏；改用 \`WeakMap\`。

### 8. 脱离框架生命周期的副作用
Vue/React 组件卸载后异步回调仍 setState/改 ref，且闭包持有组件数据。

### 9. console.log 大对象
DevTools 控制台会保留被打印对象的引用，调试时不要留大对象日志。

### 10. WebSocket / 长连接未关闭
断开重连未清理旧连接，回调持有组件数据。

## 排查方法

### Chrome DevTools → Memory
1. **Heap snapshot**：在不同操作点拍快照（如打开/关闭弹窗前后），用 **Comparison** 视图对比，找出只增不减的对象。
2. **Allocation instrumentation on timeline**：实时看每次分配，定位泄漏点的代码位置。
3. **Allocation sampling**：按函数采样分配量，找分配大户。

### Performance Monitor
打开 Performance Monitor 观察 \`JS Heap Size\`：重复操作后若持续上涨不回落，疑似泄漏。

### 代码层面
- 强制 GC：启动加 \`--expose-gc\`，操作前后 \`global.gc()\` 再读 \`performance.memory.usedJSHeapSize\`。
- 单元测试：挂载/卸载组件 N 次，断言堆增长在阈值内。

### Lighthouse
Lighthouse 的 Performance 报告会提示"可能存在内存泄漏"。

## 关键习惯

- **配对清理**：\`addEventListener\` ↔ \`removeEventListener\`、\`setInterval\` ↔ \`clearInterval\`、\`connect\` ↔ \`disconnect\`。
- **框架钩子**：在 \`onUnmounted\` / \`useEffect cleanup\` / \`disposed\` 统一清理。
- **弱引用**：临时关联用 \`WeakMap\`/\`WeakSet\`/\`WeakRef\`。
- **避免闭包陷阱**：只捕获必要值，大对象显式置 null。`
  },
  {
    id: 'js-038',
    category: 'javascript',
    title: '浏览器与 Node.js 的事件循环有什么区别？',
    difficulty: '困难',
    tags: ['事件循环', 'Node.js', '浏览器', '微任务', '宏任务'],
    answer: `## 相同

都基于"**调用栈 → 微任务 → 宏任务**"循环：执行一个宏任务 → 清空所有微任务 → 渲染（浏览器）→ 下一个宏任务。都有 \`Promise.then\` 等微任务。

## 浏览器事件循环

- 宏任务源：\`setTimeout\`、\`setInterval\`、\`I/O\`、UI 事件、\`postMessage\` 等。
- 微任务源：\`Promise.then/catch/finally\`、\`queueMicrotask\`、\`MutationObserver\`、\`await\` 后续。

\`\`\`js
console.log(1)
setTimeout(() => console.log(2))
Promise.resolve().then(() => console.log(3))
console.log(4)
// 输出：1 4 3 2
\`\`\`

- 每个**宏任务**执行完，清空**所有**微任务，再渲染，再取下一个宏任务。

## Node.js 事件循环

Node 用 libuv，循环分**多个阶段（phases）**：

\`\`\`
┌───────────────────────────┐
│   timers（setTimeout/setInterval 到期回调）│
├───────────────────────────┤
│   pending callbacks（系统级回调）│
├───────────────────────────┤
│   idle, prepare（内部）│
├───────────────────────────┤
│   poll（I/O 回调，如 fs、net）│
├───────────────────────────┤
│   check（setImmediate）│
├───────────────────────────┤
│   close callbacks（close 事件）│
└───────────────────────────┘
\`\`\`

每轮循环按阶段顺序执行。

### Node 的关键宏任务 API
- \`setTimeout\` / \`setInterval\` → timers 阶段。
- \`setImmediate\` → check 阶段。
- I/O 回调 → poll 阶段。
- \`process.nextTick\` → **微任务，但优先级高于 Promise**（在每个阶段切换前清空）。

## 主要区别

| | 浏览器 | Node.js |
| --- | --- | --- |
| 宏任务调度 | 单一队列 | 分阶段（timers/poll/check...） |
| 微任务 | Promise 等 | Promise + \`process.nextTick\`（更高优先级） |
| \`setImmediate\` | 不支持 | 支持（check 阶段） |
| \`process.nextTick\` | 不支持 | 支持 |
| 渲染 | 有渲染帧 | 无渲染 |

## 经典面试题

\`\`\`js
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))
\`\`\`
- 在主模块直接执行：顺序**不确定**（取决于进入循环时定时器是否到期）。
- 在 **I/O 回调内**执行：\`setImmediate\` 一定先于 \`setTimeout\`（check 阶段紧跟 poll）。

\`\`\`js
Promise.resolve().then(() => console.log('promise'))
process.nextTick(() => console.log('nextTick'))
// Node 输出：nextTick promise（nextTick 优先级更高）
\`\`\`

## Node 11+ 的变化

Node 11 起，\`setTimeout\`/\`setInterval\` 回调之间也会清空微任务（与浏览器一致），但阶段间行为仍不同。

## 关键

- 微任务优先级：Node 中 \`process.nextTick\` > \`Promise\`。
- \`setImmediate\` 是 Node 独有，浏览器对应的是 \`MessageChannel\`/\`setTimeout(0)\`。
- \`await\`：\`async\` 函数 \`await x\` 后续代码相当于 \`Promise.resolve(x).then(后续)\`，是微任务。
- 跨环境代码不要依赖 \`process.nextTick\` / \`setImmediate\`。`
  },
  {
    id: 'js-039',
    category: 'javascript',
    title: '能手写一个简易 Promise（符合 Promise/A+）吗？',
    difficulty: '困难',
    tags: ['Promise', '手写', 'Promise/A+', '微任务'],
    answer: `## 核心要点

1. 三态：\`pending\` / \`fulfilled\` / \`rejected\`，状态不可逆。
2. \`then\` 注册回调，返回新 Promise 实现链式调用。
3. 回调异步执行（微任务），用 \`queueMicrotask\` 模拟。

## 简易实现

\`\`\`js
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCbs = []
    this.onRejectedCbs = []

    const resolve = (value) => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      this.value = value
      this.onFulfilledCbs.forEach(fn => fn())
    }
    const reject = (reason) => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.reason = reason
      this.onRejectedCbs.forEach(fn => fn())
    }
    try { executor(resolve, reject) }
    catch (e) { reject(e) }
  }

  then(onFulfilled, onRejected) {
    // 值穿透：非函数时把值/原因向后传
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }

    const p2 = new MyPromise((resolve, reject) => {
      const handle = (fn, val, cb) => {
        queueMicrotask(() => {
          try {
            const x = fn(val)
            // 若返回的是 Promise，等它 settle 再 resolve/reject
            if (x instanceof MyPromise) x.then(resolve, reject)
            else resolve(x)
          } catch (e) { reject(e) }
        })
      }
      if (this.state === 'fulfilled') handle(onFulfilled, this.value, resolve)
      else if (this.state === 'rejected') handle(onRejected, this.reason, reject)
      else {
        this.onFulfilledCbs.push(() => handle(onFulfilled, this.value))
        this.onRejectedCbs.push(() => handle(onRejected, this.reason))
      }
    })
    return p2
  }

  catch(fn) { return this.then(null, fn) }
  finally(fn) { return this.then(v => MyPromise.resolve(fn()).then(() => v), e => MyPromise.resolve(fn()).then(() => { throw e })) }

  static resolve(v) { return v instanceof MyPromise ? v : new MyPromise(r => r(v)) }
  static reject(e) { return new MyPromise((_, r) => r(e)) }
  static all(list) {
    return new MyPromise((resolve, reject) => {
      const res = [], n = list.length
      if (!n) return resolve([])
      list.forEach((p, i) => MyPromise.resolve(p).then(v => { res[i] = v; if (--n === 0) resolve(res) }, reject))
    })
  }
}
\`\`\`

## 验证

\`\`\`js
new MyPromise(r => r(1))
  .then(v => v + 1)
  .then(v => { console.log(v); return new MyPromise(r => r(3)) })
  .then(v => console.log(v))
// 2  3
\`\`\`

## 关键细节

1. **异步执行**：\`then\` 回调用 \`queueMicrotask\`（或 \`setTimeout\`）包裹，保证在当前同步代码后执行。
2. **值穿透**：\`then\` 不传函数时，值要继续向后传（\`Promise.resolve(1).then().then(v=>v)\` 仍得 1）。
3. **链式返回**：\`then\` 返回新 Promise；若回调返回 thenable/Promise，需"展开"（resolvePromise 递归处理）。
4. **状态不可逆**：\`resolve\`/\`reject\` 只在 pending 时生效。
5. **错误冒泡**：未捕获的 reject 沿链向后传，直到有 \`.catch\`。
6. **A+ 规范的 resolvePromise**：完整实现需处理返回 thenable 的循环引用、递归解析等，上面是简化版。

## Promise.all 实现

返回新 Promise：所有 fulfilled 才 fulfilled（保持顺序），任一 reject 立即 reject。空数组立即 fulfilled。`
  },
  {
    id: 'js-040',
    category: 'javascript',
    title: 'Promise 并发控制怎么实现？写一个并发数限制的调度器。',
    difficulty: '困难',
    tags: ['Promise', '并发控制', '调度器', '手写'],
    answer: `## 场景

批量请求 1000 个接口，但服务器限流，需**最多同时 N 个**并发。直接 \`Promise.all(list)\` 会同时发起 1000 个请求，需调度器控制。

## 实现：并发池

\`\`\`js
async function pool(tasks, limit) {
  const results = []
  const executing = new Set()  // 正在执行的 Promise

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task())
    results.push(p)
    executing.add(p)
    p.finally(() => executing.delete(p))

    // 达到上限时，等任一完成再继续
    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  // 等剩余全部完成
  return Promise.all(results)
}
\`\`\`

## 使用

\`\`\`js
const urls = [/* 1000 个 url */]
const tasks = urls.map(url => () => fetch(url))
const data = await pool(tasks, 6)  // 最多 6 个并发
\`\`\`

## 思路

1. \`tasks\` 是**返回 Promise 的函数数组**（惰性，调用才发起）。
2. 顺序遍历，每个 task 立即调用并把 Promise 加入 \`executing\` Set 与 \`results\`。
3. 当 \`executing.size\` 达到上限，\`await Promise.race(executing)\` 等最快的一个完成（会释放一个名额）。
4. \`finally\` 从 \`executing\` 移除已完成的。
5. 全部入队后 \`Promise.all\` 等所有完成，结果顺序与 tasks 一致。

## 另一种写法：递归补位

\`\`\`js
async function pool2(tasks, limit, results = [], i = 0) {
  if (i >= tasks.length) return results
  const batch = tasks.slice(i, i + limit)
  const res = await Promise.all(batch.map(t => t()))
  results.push(...res)
  return pool2(tasks, limit, results, i + limit)
}
\`\`\`
缺点：按批执行，批内完成才能下一批，**不持续补位**（慢任务拖累整批）。第一种 \`race\` 补位版更优。

## 第三方库

- \`p-limit\`：\`const limit = pLimit(6); await limit(() => fetch(url))\`
- \`p-queue\`：功能更全（优先级、暂停、动态并发数）。
- \`async\`（caolan/async）：\`async.eachLimit\`。

## 注意

1. **任务函数 vs 任务结果**：传 \`() => Promise\` 而非 \`Promise\`，否则入参时全部已发起，无法控制并发。
2. **错误处理**：任一失败 \`Promise.race\` 仍会 reject，但其他并发任务仍在跑。如需"全部尝试 + 收集错误"，用 \`Promise.allSettled\`。
3. **结果顺序**：用 \`results.push(p)\` + \`Promise.all\` 保证顺序与 tasks 一致。
4. **超时**：可给每个 task 包 \`Promise.race([task(), timeout()])\`。
5. **重试**：包一层 retry 函数，失败递增重试。`
  },
  {
    id: 'js-041',
    category: 'javascript',
    title: 'async/await 的本质是什么？它和 Generator 是什么关系？',
    difficulty: '困难',
    tags: ['async/await', 'Generator', 'Promise', '原理'],
    answer: `## 本质

\`async/await\` 是 **Generator + Promise 的语法糖**。async 函数返回 Promise，await 类似"暂停"等待 Promise 完成。

## 1. async 函数返回 Promise

\`\`\`js
async function f() { return 1 }
f()  // Promise<1>
// 等价于
function f() { return Promise.resolve(1) }
\`\`\`
- 返回值被 \`Promise.resolve\` 包装。
- 抛错 → reject：\`throw e\` 等价 \`Promise.reject(e)\`。

## 2. await 是"暂停 + 恢复"

\`await x\` 后续代码相当于 \`Promise.resolve(x).then(后续)\`，是**微任务**：

\`\`\`js
async function f() {
  console.log(1)
  await Promise.resolve()
  console.log(2)
}
f()
console.log(3)
// 1 3 2
\`\`\`

## 与 Generator 的关系

Generator 函数可暂停（\`yield\`）和恢复（\`next()\`）。用 Generator + 自动执行器能模拟 async/await：

\`\`\`js
// Generator 版"async"
function* gen() {
  const a = yield fetch('/api/a')
  const b = yield fetch('/api/b')
  return [a, b]
}

// 自动执行器（类似 co 库）
function run(gen) {
  const it = gen()
  function step(val) {
    const { value, done } = it.next(val)
    if (done) return value
    return Promise.resolve(value).then(step, e => it.throw(e))
  }
  return step()
}

run(gen).then(console.log)
\`\`\`

\`async/await\` 把这套自动化内置到引擎：
- \`async\` ≈ 自动执行的 Generator。
- \`await\` ≈ \`yield\`，但只能"yield" Promise/thenable。
- 不需要手写执行器。

## 对比

| | Generator + co | async/await |
| --- | --- | --- |
| 暂停 | \`yield\` | \`await\` |
| 自动执行 | 需 co 库 | 引擎内置 |
| 返回值 | 看实现 | Promise |
| 语义 | 通用迭代器 | 专为异步 |

## 错误处理

\`\`\`js
async function f() {
  try {
    const data = await fetch('/api').then(r => r.json())
  } catch (e) {
    // await 的 reject 可用 try/catch 捕获（比 Promise 链更直观）
  }
}
\`\`\`

## 并发优化

\`\`\`js
// ❌ 串行（慢）
const a = await fetchA()
const b = await fetchB()

// ✅ 并发（快）
const [a, b] = await Promise.all([fetchA(), fetchB()])
\`\`\`
\`await\` 会等前一个完成才执行下一个，独立任务应 \`Promise.all\` 并发。

## 关键

- async 函数**总能**用 \`Promise.then\` 重写，await 只是更同步化的写法。
- \`await\` 不阻塞主线程，只"暂停"当前 async 函数，事件循环照常。
- 顶层 await（ES2022）：模块顶层可直接 \`await\`，模块系统会处理。
- for await...of：异步迭代 \`for await (const x of asyncIterable)\`。`
  },
  {
    id: 'js-042',
    category: 'javascript',
    title: '高阶函数是什么？如何实现函数组合（compose）与管道（pipe）？',
    difficulty: '中等',
    tags: ['高阶函数', 'compose', 'pipe', '函数式编程'],
    answer: `## 高阶函数

接收函数作参数 或 返回函数的函数。常见：\`map\`/\`filter\`/\`reduce\`、\`Array.sort\`、\`Promise.then\`、\`lodash.memoize\`。

\`\`\`js
// 接收函数
[1,2,3].map(x => x * 2)
// 返回函数
const adder = n => x => x + n
adder(5)(3)  // 8
\`\`\`

## 函数组合 compose

把多个函数**从右往左**组合成一个：

\`\`\`js
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)

const add1 = x => x + 1
const double = x => x * 2
const square = x => x * x

const fn = compose(square, double, add1)
fn(3)  // square(double(add1(3))) = square(double(4)) = square(8) = 64
\`\`\`

## 管道 pipe

从左往右执行（更符合阅读顺序）：

\`\`\`js
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)

const fn = pipe(add1, double, square)
fn(3)  // square(double(add1(3))) = 64
\`\`\`

## 异步 pipe

\`\`\`js
const pipeAsync = (...fns) => x => fns.reduce(async (acc, fn) => fn(await acc), x)
\`\`\`

## 实际应用

### Redux 的 applyMiddleware
\`\`\`js
// 中间件从右往左组合，next 串联
const chain = middlewares.map(mw => mw(api)).reduceRight((next, mw) => mw(next), dispatch)
\`\`\`

### Koa 洋葱模型
\`\`\`js
app.use(async (ctx, next) => {
  console.log('A before')
  await next()
  console.log('A after')
})
// compose 把多个中间件组合成一条链，next 控制进入下一层
\`\`\`

### Lodash/Ramda
\`_.flow\`（pipe）、\`_.flowRight\`（compose）、\`R.pipe\`、\`R.compose\`。

## 优点

- **声明式**：\`pipe(format, validate, save)(data)\` 比嵌套调用 \`save(validate(format(data)))\` 清晰。
- **可组合**：小函数单一职责，自由拼装。
- **可测试**：每个小函数独立测试。

## 注意

1. **纯函数**才能安全组合（无副作用、相同输入相同输出）。
2. **类型对齐**：上一个函数的返回类型要与下一个函数的入参匹配。
3. **调试困难**：长链出错难定位，可插入 \`tap\` 辅助：
   \`\`\`js
   const tap = fn => x => { fn(x); return x }
   const f = pipe(add1, tap(console.log), double)
   \`\`\`
4. **point-free 风格**：组合天然适合无参数风格（不显式声明数据），但过度使用降低可读性。`
  },
  {
    id: 'js-043',
    category: 'javascript',
    title: '深拷贝有哪些坑？手写一个处理循环引用的深拷贝，并对比 structuredClone。',
    difficulty: '困难',
    tags: ['深拷贝', '循环引用', 'structuredClone', '手写'],
    answer: `## 浅拷贝 vs 深拷贝

- 浅拷贝：只复制一层，嵌套对象仍共享引用（\`Object.assign\`、展开 \`{...obj}\`、\`Array.slice\`）。
- 深拷贝：递归复制所有层级，完全独立。

## JSON 方案的局限

\`\`\`js
JSON.parse(JSON.stringify(obj))
\`\`\`
**无法处理**：
- 函数、\`undefined\`、\`Symbol\` → 被忽略。
- \`Date\` → 变字符串。
- \`RegExp\`、\`Error\` → 变空对象。
- \`Map\`/\`Set\` → 丢失。
- 循环引用 → 报错。
- \`NaN\`/\`Infinity\` → \`null\`。
- 丢失原型链。

## 手写深拷贝（处理循环引用）

\`\`\`js
function deepClone(obj, hash = new WeakMap()) {
  // 原始值、函数直接返回
  if (Object(obj) !== obj || typeof obj === 'function') return obj
  // Date / RegExp / Map / Set 等特殊对象
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
  if (obj instanceof Map) return new Map([...obj].map(([k,v]) => [deepClone(k,hash), deepClone(v,hash)]))
  if (obj instanceof Set) return new Set([...obj].map(v => deepClone(v, hash)))
  // 循环引用：用 WeakMap 记录已拷贝对象
  if (hash.has(obj)) return hash.get(obj)
  // 用同一构造函数创建，保留原型
  const clone = new obj.constructor()
  hash.set(obj, clone)
  // 递归拷贝自身属性（含 Symbol 键）
  Reflect.ownKeys(obj).forEach(key => {
    clone[key] = deepClone(obj[key], hash)
  })
  return clone
}
\`\`\`

\`\`\`js
const a = { x: 1 }
a.self = a  // 循环引用
const b = deepClone(a)  // 不报错，b.self === b
\`\`\`

## structuredClone（现代 API，推荐）

\`\`\`js
const clone = structuredClone(obj)
\`\`\`
- 浏览器与 Node 17+ 原生支持。
- **支持**：循环引用、Date、RegExp、Map、Set、ArrayBuffer、Blob、TypedArray、Error 等。
- **不支持**：函数（抛错）、Symbol、DOM 节点、原型链（原型不被复制）、class 实例退化为普通对象。

## 三者对比

| | JSON | 手写 | structuredClone |
| --- | --- | --- | --- |
| 循环引用 | ❌ 报错 | ✅ | ✅ |
| Date/RegExp/Map/Set | ❌ | ✅（需手写） | ✅ |
| 函数 | 忽略 | 可保留引用 | ❌ 抛错 |
| 原型链 | ❌ | ✅ | ❌ |
| 性能 | 快 | 中 | 中 |
| 依赖 | 无 | 自维护 | 原生 |

## 选择

- **简单纯数据**（无函数/循环）：\`structuredClone\` 首选，原生、安全。
- **含 class 实例/原型**：手写或用 \`lodash.cloneDeep\`（保留原型、处理函数）。
- **仅 JSON 兼容数据**：\`JSON.parse(JSON.stringify())\` 最快。
- **生产通用**：\`lodash.cloneDeep\` 最稳妥（覆盖各种边界、保留原型、处理函数为 undefined）。

## 注意

- 深拷贝**性能开销大**，避免对大对象频繁深拷贝（考虑不可变数据结构 Immer）。
- 递归实现有**栈溢出**风险（极深嵌套），可改迭代 + 栈。
- 拷贝函数无意义（闭包状态无法复制），通常保留引用或忽略。
- DOM 节点、Window 等宿主对象不应深拷贝。`
  },
  {
    id: 'js-044',
    category: 'javascript',
    title: '隐式类型转换的规则是什么？ToPrimitive、valueOf、toString 怎么参与？',
    difficulty: '困难',
    tags: ['类型转换', 'ToPrimitive', 'valueOf', 'toString'],
    answer: `## 显式 vs 隐式

- 显式：\`Number(x)\`、\`String(x)\`、\`Boolean(x)\`、\`parseInt\`。
- 隐式：\`+\`、\`==\`、\`if(x)\`、模板字符串 \`\`\${x}\`\` 等触发的自动转换。

## ToPrimitive（对象转原始值）

对象参与运算时，先经 \`ToPrimitive\` 转为原始值：

\`\`\`js
ToPrimitive(input, hint)
\`\`\`
- \`hint\`：\`'number'\` / \`'string'\` / \`'default'\`。
- 调用顺序：
  1. 若对象有 \`Symbol.toPrimitive\` 方法，优先调用它。
  2. 否则按 hint 调 \`valueOf\` → \`toString\`（number 先 valueOf）或 \`toString\` → \`valueOf\`（string 先 toString）。
  3. 仍返回对象则抛 TypeError。

\`\`\`js
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return 42
    if (hint === 'string') return 'obj'
    return 'default'
  }
}
+obj          // 42（number hint）
\`\${obj}\`      // 'obj'（string hint）
obj + ''      // 'default'（default hint）
\`\`\`

## 各类型转换规则

### 转 Boolean（Falsy）
\`false\`、\`0\`、\`-0\`、\`0n\`、\`''\`、\`null\`、\`undefined\`、\`NaN\` → \`false\`，其余 \`true\`（含 \`[]\`、\`'0'\`、\`'false'\`）。

### 转 Number
| 原始值 | 结果 |
| --- | --- |
| \`undefined\` | \`NaN\` |
| \`null\` | \`0\` |
| \`true\`/\`false\` | \`1\`/\`0\` |
| \`''\` | \`0\` |
| \`'  12 '\` | \`12\`（去空格） |
| \`'12px'\` | \`NaN\` |
| \`'0x1f'\` | \`31\`（十六进制） |

对象先 \`ToPrimitive(number)\` 再转 Number。

### 转 String
原始值直接转字符串；对象先 \`ToPrimitive(string)\`。

## 经典坑题

\`\`\`js
[] + []        // ''（两边 ToPrimitive → ''）
[] + {}        // '[object Object]'（[] → ''，{} → '[object Object]'）
{} + []        // 0（{} 被当块语句，+[] → 0）
1 + '2'        // '12'（+ 有字符串走拼接）
'5' - 2        // 3（- 走数值运算）
'5' * '2'      // 10
null == undefined  // true
null == 0      // false（特殊规则）
NaN == NaN     // false
\`\`\`

## == 的转换规则

1. 同类型直接比较（NaN 除外，对象比较引用）。
2. \`null == undefined\`（且仅这两个相等）。
3. 数字与字符串：字符串转数字。
4. 布尔与其他：布尔转数字（\`true\`→1）。
5. 对象与原始值：对象 \`ToPrimitive\`。

\`\`\`js
[] == false    // true（[] → '' → 0，false → 0）
[] == ![]      // true（![]→false，[] → 0 == 0）
\`\`\`

## 建议

- **用 ===**：避免隐式转换的坑，类型不一致直接 false。
- 需转数字用 \`Number()\`/\`parseInt\`，转字符串用 \`String()\`/\`模板字符串\`，转布尔用 \`!!\`/\`Boolean()\`。
- 自定义对象可重写 \`Symbol.toPrimitive\` 控制转换行为。
- 面试常考 \`[] + {}\`、\`1 + '2'\`、\`a == 1 && a == 2\`（用 toPrimitive/valueOf 让 a 自增）。`
  },
  {
    id: 'js-045',
    category: 'javascript',
    title: '数组方法有哪些？reduce 的高级用法有哪些？',
    difficulty: '中等',
    tags: ['数组', 'reduce', 'map', 'filter'],
    answer: `## 数组方法分类

### 会改变原数组（mutator）
\`push\`/\`pop\`/\`shift\`/\`unshift\`、\`splice\`、\`sort\`、\`reverse\`、\`fill\`、\`copyWithin\`。

### 返回新数组
\`map\`、\`filter\`、\`slice\`、\`concat\`、\`flat\`/\`flatMap\`、\`toSorted\`/\`toReversed\`（ES2023 不可变版）。

### 查找
\`find\`/\`findIndex\`/\`findLast\`（ES2023）、\`indexOf\`/\`lastIndexOf\`、\`includes\`、\`at\`。

### 判断
\`some\`、\`every\`、\`isArray\`。

### 归并
\`reduce\`、\`reduceRight\`。

### 遍历
\`forEach\`、\`entries\`/\`keys\`/\`values\`、\`join\`。

## reduce 语法

\`\`\`js
arr.reduce((acc, cur, idx, arr) => newAcc, initialValue)
\`\`\`

## reduce 高级用法

### 1. 求和/积
\`\`\`js
[1,2,3].reduce((a,b) => a+b, 0)  // 6
\`\`\`

### 2. 数组扁平化
\`\`\`js
[[1,2],[3,[4]]].reduce((a,b) => a.concat(b), [])  // 浅扁平
const deepFlat = (arr) => arr.reduce((a,b) => a.concat(Array.isArray(b) ? deepFlat(b) : b), [])
\`\`\`

### 3. 按条件分组
\`\`\`js
const groupBy = (arr, key) => arr.reduce((acc, x) => {
  (acc[x[key]] ??= []).push(x)
  return acc
}, {})
groupBy([{type:'a'},{type:'b'},{type:'a'}], 'type')
// { a: [...], b: [...] }
\`\`\`

### 4. 计数
\`\`\`js
['a','b','a','c'].reduce((acc, x) => (acc[x] = (acc[x]||0)+1, acc), {})
// { a:2, b:1, c:1 }
\`\`\`

### 5. 数组转对象（字典）
\`\`\`js
[{id:1,name:'a'},{id:2,name:'b'}].reduce((acc,x) => (acc[x.id]=x, acc), {})
// { 1: {id:1,name:'a'}, 2: {...} }
\`\`\`

### 6. 实现 map/filter
\`\`\`js
const map = (arr, fn) => arr.reduce((a,x) => [...a, fn(x)], [])
const filter = (arr, fn) => arr.reduce((a,x) => fn(x) ? [...a, x] : a, [])
\`\`\`

### 7. 管道（函数组合）
\`\`\`js
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
\`\`\`

### 8. 串行 Promise
\`\`\`js
const serial = fns => fns.reduce((p, f) => p.then(f), Promise.resolve())
\`\`\`

### 9. 去重
\`\`\`js
[1,2,2,3].reduce((a,x) => a.includes(x) ? a : [...a, x], [])
\`\`\`

## 注意

1. **不传 initialValue**：\`acc\` 取数组第一个元素，\`cur\` 从第二个开始；空数组 reduce 无初始值会报错。
2. **始终传 initialValue** 更安全（避免空数组报错、行为可预期）。
3. **纯函数**：\`reduce\` 回调应返回新 acc，不要修改原数组。
4. **可读性**：复杂 reduce（多重分支）可能不如 for 循环清晰，适度使用。
5. \`flatMap\` = map + flat(1)，常用于"一对多"映射。`
  },
  {
    id: 'js-046',
    category: 'javascript',
    title: 'Object 有哪些常用静态方法？',
    difficulty: '中等',
    tags: ['Object', '静态方法', 'keys', 'defineProperty'],
    answer: `## 创建/复制

\`\`\`js
Object.create(proto, desc)        // 指定原型创建
Object.assign(target, ...src)     // 浅合并（可枚举自身属性）
Object.fromEntries(entries)       // [[k,v]] → 对象（Map → 对象）
\`\`\`

## 遍历

\`\`\`js
Object.keys(obj)       // 自身可枚举属性键
Object.values(obj)     // 值
Object.entries(obj)    // [k, v]
Object.getOwnPropertyNames(obj)  // 自身所有字符串键（含不可枚举，不含 Symbol）
Object.getOwnPropertySymbols(obj) // 自身 Symbol 键
Reflect.ownKeys(obj)   // 自身所有键（字符串 + Symbol，含不可枚举）
\`\`\`

## 属性描述符

\`\`\`js
Object.defineProperty(obj, key, {
  value, writable, enumerable, configurable,
  // 或访问器：
  get() {}, set(v) {}
})
Object.defineProperties(obj, { key1: desc, key2: desc })
Object.getOwnPropertyDescriptor(obj, key)
Object.getOwnPropertyDescriptors(obj)
\`\`\`

描述符四要素：
- \`value\`：值。
- \`writable\`：可写。
- \`enumerable\`：可枚举（\`for...in\`/\`Object.keys\` 是否出现）。
- \`configurable\`：可配置（能否删除、改描述符）。

## 冻结/密封

| 方法 | 改值 | 增删 | 配置 |
| --- | --- | --- | --- |
| \`Object.preventExtensions\` | ✅ | ❌ | ✅ |
| \`Object.seal\` | ✅ | ❌ | ❌ |
| \`Object.freeze\` | ❌ | ❌ | ❌ |
| \`Object.isFrozen\` 等 | 检测 | | |

\`\`\`js
const o = Object.freeze({ a: 1 })
o.a = 2      // 静默失败（严格模式抛错）
o.b = 3      // 失败
\`\`\`
**浅冻结**：嵌套对象仍可改。深冻结需递归。

## 原型

\`\`\`js
Object.getPrototypeOf(obj)
Object.setPrototypeOf(obj, proto)  // 性能差，不推荐
Object.create(proto)               // 创建时指定原型（推荐）
\`\`\`

## 比较/合并

\`\`\`js
Object.is(a, b)  // 比 === 更严格：Object.is(NaN, NaN) === true，Object.is(-0, 0) === false
\`\`\`

## 判断

\`\`\`js
Object.hasOwn(obj, key)     // ES2022，比 obj.hasOwnProperty 更安全
Object.prototype.hasOwnProperty.call(obj, key)  // 兼容写法
\`\`\`

## 实用场景

### 浅拷贝
\`\`\`js
const copy = Object.assign({}, obj)
// 或
const copy = { ...obj }
\`\`\`

### 合并对象
\`\`\`js
const merged = Object.assign({}, a, b, c)
const merged = { ...a, ...b, ...c }
\`\`\`

### 对象转 Map
\`\`\`js
const map = new Map(Object.entries(obj))
const obj2 = Object.fromEntries(map)
\`\`\`

### 不可变更新
\`\`\`js
const newObj = Object.assign({}, oldObj, { key: newVal })
\`\`\`

## 注意

- \`Object.keys/values/entries\` 只返回**自身可枚举**属性，不含继承与 Symbol。
- \`for...in\` 含继承的可枚举属性。
- \`Object.assign\` 用 \`=\` 赋值（触发 setter），不复制描述符。
- \`Object.freeze\` 是浅冻结，深冻结需递归且对数组/函数也适用。`
  },
  {
    id: 'js-047',
    category: 'javascript',
    title: '正则表达式有哪些进阶用法？',
    difficulty: '困难',
    tags: ['正则', 'RegExp', '断言', '反向引用'],
    answer: `## 字符类与量词

- \`.\`（非换行）、\`\\d\`/\`\\D\`、\`\\w\`/\`\\W\`、\`\\s\`/\`\\S\`。
- \`[abc]\`、\`[^abc]\`、\`[a-z]\`。
- \`*\`（0+）、\`+\`（1+）、\`?\`（0/1）、\`{n}\`/\`{n,m}\`。
- **贪婪**（默认，尽量多）vs **非贪婪**（加 \`?\`，尽量少）：\`a+?\`、\`.*?\`。

## 分组与反向引用

\`\`\`js
// 捕获组 ()，可反向引用 \\1
'2024-01-01'.match(/(\\d{4})-(\\d{2})-(\\d{2})/)
// ['2024-01-01', '2024', '01', '01']

// 反向引用：匹配成对标签
'<b>hi</b>'.match(/<(\\w+)>.*<\\/\\1>/)  // 匹配
'<b>hi</i>'.match(/<(\\w+)>.*<\\/\\1>/)  // 不匹配
\`\`\`

## 非捕获组

\`(?:...)\` 分组但不捕获，节省内存：
\`\`\`js
'abc'.match(/(?:ab)+c/)
\`\`\`

## 命名捕获组（ES2018）

\`\`\`js
'2024-01-01'.match(/(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/)
// groups: { year: '2024', month: '01', day: '01' }
\`\`\`

## 断言（lookaround）

### 先行断言（lookahead）
- \`(?=x)\`：后面跟 x（**正向**）。
- \`(?!x)\`：后面不跟 x（**负向**）。
\`\`\`js
'1a2b3c'.match(/\\d(?=[a-z])/g)   // ['1','2','3']（数字后跟字母）
'1a2-3c'.match(/\\d(?![a-z])/g)   // ['2']（数字后不跟字母）
\`\`\`

### 后行断言（lookbehind，ES2018）
- \`(?<=x)\`：前面是 x。
- \`(?<!x)\`：前面不是 x。
\`\`\`js
'$100 €200'.match(/(?<=\\$)\\d+/g)   // ['100']（$ 后的数字）
'100 200'.match(/(?<!\\$)\\d+/g)     // ['100','200']
\`\`\`

断言**不消耗字符**，位置匹配。

## 修饰符

- \`g\`：全局（多次匹配）。
- \`i\`：忽略大小写。
- \`m\`：多行（\`^\`/\`$\` 匹配每行首尾）。
- \`s\`（dotAll）：\`.\` 匹配换行符。
- \`y\`（sticky）：从 \`lastIndex\` 开始**必须**匹配。
- \`u\`（unicode）：正确处理 Unicode（含 surrogate pair）、\`{\\u{1F600}}\`。

## String 方法

\`\`\`js
str.match(re)            // 无 g 返回匹配详情，有 g 返回所有匹配
str.matchAll(re)         // 迭代器（需 g），含捕获组
str.replace(re, fn)      // 替换，fn 接收匹配与捕获组
str.replaceAll(re, x)    // 全部替换
str.search(re)           // 返回首次匹配索引
str.split(re)            // 按正则分割
\`\`\`

## RegExp 方法

\`\`\`js
re.test(str)             // 是否匹配
re.exec(str)             // 返回匹配详情（配合 g + lastIndex 循环）
\`\`\`

## 命名反向引用替换

\`\`\`js
'2024-01-01'.replace(/(?<y>\\d{4})-(?<m>\\d{2})-(?<d>\\d{2})/, '$<d>/$<m>/$<y>')
// '01/01/2024'
\`\`\`

## 实用示例

### 邮箱（简化）
\`\`\`js
/^[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+\$/.test('a@b.com')
\`\`\`

### 千分位
\`\`\`js
'1234567'.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')  // '1,234,567'
\`\`\`

### 去首尾空格
\`\`\`js
str.replace(/^\\s+|\\s+\$/g, '')  // 等价 str.trim()
\`\`\`

## 注意

- **贪婪默认**：\`<.*>\` 会匹配到最后的 \`>\`，用 \`<.*?>\` 非贪婪匹配首个标签。
- **转义**：正则中的元字符（\`.\`、\`*\`、\`?\`、\`(\` 等）字面匹配需 \`\\\\\` 转义。
- **性能**：灾难性回溯（嵌套量词如 \`(a+)+\`）可致卡死，用原子组或限制回溯。
- **\`u\` 修饰符**：处理 emoji/中文等需加 \`u\`，否则 surrogate pair 出错。`
  },
  {
    id: 'js-048',
    category: 'javascript',
    title: 'Reflect 是什么？它和 Proxy 为什么成对出现？',
    difficulty: '困难',
    tags: ['Reflect', 'Proxy', '元编程'],
    answer: `## Reflect

\`Reflect\` 是 ES6 引入的内置对象（非函数），提供**拦截 JS 操作的静态方法**，与 \`Proxy\` 的 trap 一一对应。

\`\`\`js
Reflect.has(obj, 'a')      // 等价 'a' in obj
Reflect.get(obj, 'a')      // 等价 obj.a
Reflect.set(obj, 'a', 1)   // 等价 obj.a = 1，返回 bool
Reflect.deleteProperty(obj,'a')  // 等价 delete obj.a，返回 bool
Reflect.ownKeys(obj)       // 自身所有键（含 Symbol）
Reflect.getPrototypeOf(obj)
Reflect.apply(fn, thisArg, args)  // 等价 fn.apply，但更清晰
Reflect.construct(Ctor, args)     // 等价 new Ctor(...args)
\`\`\`

## 与 Proxy 成对出现

\`Proxy\` 的每个拦截器（trap）都有对应的 \`Reflect\` 方法，**默认行为**就由 Reflect 提供：

\`\`\`js
const proxy = new Proxy({ a: 1 }, {
  get(target, key, receiver) {
    console.log('读取', key)
    return Reflect.get(target, key, receiver)  // 默认行为
  },
  set(target, key, value, receiver) {
    console.log('设置', key, value)
    return Reflect.set(target, key, value, receiver)
  }
})
proxy.a    // 打印"读取 a"，返回 1
proxy.b = 2  // 打印"设置 b 2"
\`\`\`

## 为什么需要 Reflect（而非直接操作）

### 1. 默认行为的正确转发
\`Reflect.set/get\` 接收 \`receiver\` 参数，保证 setter/getter 的 \`this\` 正确：
\`\`\`js
// ❌ 直接 target[key] 会丢失 receiver
const proxy = new Proxy(obj, {
  set(target, key, value, receiver) {
    target[key] = value  // 若 target 的 setter 依赖 this，this 是 target 而非 receiver
    return true
  }
})
// ✅ Reflect 正确转发
set(target, key, value, receiver) {
  return Reflect.set(target, key, value, receiver)
}
\`\`\`

### 2. 返回布尔值而非抛错
\`Object.defineProperty\` 失败抛错，\`Reflect.defineProperty\` 失败返回 \`false\`，便于在 Proxy 中判断：
\`\`\`js
defineProperty(target, key, desc) {
  // 拦截 + 校验
  return Reflect.defineProperty(target, key, desc)
}
\`\`\`

### 3. 与 Proxy trap 完全对应
13 个 Proxy trap 每个都有同名 Reflect 方法，写代理时直接转发，语义清晰。

### 4. 替代老旧写法
\`\`\`js
// 旧
delete obj.a            // 语法，难组合
Function.prototype.apply.call(fn, thisArg, args)
// 新
Reflect.deleteProperty(obj, 'a')
Reflect.apply(fn, thisArg, args)
\`\`\`

## 实际应用

### 1. 响应式系统（Vue3）
\`\`\`js
function reactive(target) {
  return new Proxy(target, {
    get(t, k, r) {
      track(t, k)              // 收集依赖
      const res = Reflect.get(t, k, r)
      return isObject(res) ? reactive(res) : res
    },
    set(t, k, v, r) {
      const res = Reflect.set(t, k, v, r)
      trigger(t, k)            // 触发更新
      return res
    }
  })
}
\`\`\`

### 2. 校验代理
\`\`\`js
const validator = (target, rules) => new Proxy(target, {
  set(t, k, v, r) {
    if (rules[k] && !rules[k](v)) throw new Error('校验失败')
    return Reflect.set(t, k, v, r)
  }
})
\`\`\`

### 3. 私有属性
用 Proxy 拦截 \`_\` 开头属性的访问，实现"私有"。

## 关键

- \`Reflect\` 不构造实例，全是静态方法。
- 与 Proxy 配合是**惯例**：trap 内部用 Reflect 转发默认行为。
- \`Reflect.apply(fn, thisArg, args)\` 比 \`fn.apply\` 安全（fn 可能重写了 apply）。
- \`Reflect.construct(Ctor, args, NewTarget)\` 支持指定原型链，比 new 更灵活。`
  },
  {
    id: 'js-049',
    category: 'javascript',
    title: 'WeakRef 和 FinalizationRegistry 是什么？有什么用？',
    difficulty: '困难',
    tags: ['WeakRef', 'FinalizationRegistry', '弱引用', 'GC'],
    answer: `## WeakRef

\`WeakRef\` 创建对对象的**弱引用**，不阻止 GC 回收该对象。

\`\`\`js
let obj = { data: 'big' }
const ref = new WeakRef(obj)

ref.deref()  // 返回 obj（若未被回收），或 undefined（已被回收）
\`\`\`

普通引用（强引用）会让对象一直存活；弱引用不阻止 GC，对象可被回收，\`deref()\` 返回 \`undefined\`。

## FinalizationRegistry

对象被 GC 回收时执行回调（"终结"），用于清理关联资源。

\`\`\`js
const registry = new FinalizationRegistry((heldValue) => {
  console.log('对象被回收，清理关联资源:', heldValue)
})

let obj = { ... }
registry.register(obj, 'my-resource-id')  // 注册，heldValue 是回调参数
// 当 obj 被回收，回调被调用，传入 'my-resource-id'
\`\`\`

## 典型应用

### 1. 缓存（可被回收）
\`\`\`js
const cache = new Map()
function getCache(key) {
  const ref = cache.get(key)
  if (ref) {
    const val = ref.deref()
    if (val) return val  // 命中
    cache.delete(key)    // 已被回收，清理
  }
  const val = computeExpensive(key)
  cache.set(key, new WeakRef(val))
  return val
}
\`\`\`
内存紧张时缓存项可被 GC 自动清理，避免内存堆积。

### 2. 关联资源清理
对象被回收时关闭关联的文件句柄、取消订阅等：
\`\`\`js
const registry = new FinalizationRegistry((handle) => handle.close())

function watch(socket) {
  const handle = socket.subscribe(...)
  registry.register(socket, handle)
}
// socket 被 GC 时，handle.close() 被调用
\`\`\`

### 3. WeakMap 增强
WeakMap 的 key 必须是对象，WeakRef 可引用任意对象并在回收时获知。

## 重要限制

1. **回调时机不确定**：FinalizationRegistry 回调由 GC 决定何时触发，**可能很晚、可能不触发**（程序结束前未 GC）。
2. **不能依赖**：绝不能把关键清理逻辑放这里（如关闭数据库连接），它只是"尽力而为"的补充。
3. **回调是异步的**：在独立任务中执行，不在 GC 同步触发。
4. **回调中的对象引用**：回调参数是 \`heldValue\`（注册时给的，非被回收对象本身），否则又造成强引用。
5. **\`deref()\` 后立即可能失效**：拿到对象后到使用之间，理论上仍可能被回收（实际单线程内不会），但应避免长时间持有。
6. **慎用**：日常业务几乎用不到，主要用于库/框架的缓存、资源管理。能用 WeakMap 解决的优先用 WeakMap。

## 与 WeakMap/WeakSet 区别

| | WeakMap | WeakRef |
| --- | --- | --- |
| 用途 | key 弱引用的映射 | 显式弱引用 |
| 获取值 | \`map.get(key)\` | \`ref.deref()\` |
| 回收感知 | 不可知（key 回收后 entry 消失） | 可通过 FinalizationRegistry 感知 |

## 最佳实践

- 优先 \`WeakMap\`/\`WeakSet\` 做对象关联（更安全、引擎优化更好）。
- 只有需要"知道对象何时被回收"或"缓存值（非 key）可弱引用"时才用 WeakRef。
- FinalizationRegistry 仅用于**非关键**的辅助清理，关键资源必须显式管理。`
  },
  {
    id: 'js-050',
    category: 'javascript',
    title: 'Proxy 有哪些实际应用？',
    difficulty: '困难',
    tags: ['Proxy', '响应式', '校验', '元编程'],
    answer: `## 13 个拦截器（trap）

\`get\`、\`set\`、\`has\`、\`deleteProperty\`、\`ownKeys\`、\`getOwnPropertyDescriptor\`、\`defineProperty\`、\`preventExtensions\`、\`isExtensible\`、\`getPrototypeOf\`、\`setPrototypeOf\`、\`apply\`、\`construct\`。

## 应用 1：响应式系统（Vue3 核心）

\`\`\`js
function reactive(target) {
  return new Proxy(target, {
    get(t, k, r) {
      track(t, k)                       // 依赖收集
      const res = Reflect.get(t, k, r)
      return typeof res === 'object' && res !== null ? reactive(res) : res
    },
    set(t, k, v, r) {
      const old = t[k]
      const res = Reflect.set(t, k, v, r)
      if (old !== v) trigger(t, k)      // 触发更新
      return res
    },
    deleteProperty(t, k) {
      const res = Reflect.deleteProperty(t, k)
      trigger(t, k)
      return res
    }
  })
}
\`\`\`

## 应用 2：数据校验

\`\`\`js
function validate(target, rules) {
  return new Proxy(target, {
    set(t, k, v, r) {
      if (rules[k]) {
        for (const rule of rules[k]) {
          if (!rule.test(v)) throw new Error(\`\${k} 校验失败: \${rule.msg}\`)
        }
      }
      return Reflect.set(t, k, v, r)
    }
  })
}

const user = validate({}, {
  age: [{ test: v => v >= 0 && v <= 150, msg: '年龄 0~150' }],
  name: [{ test: v => typeof v === 'string', msg: '名字必须是字符串' }]
})
user.age = 200  // 抛错
\`\`\`

## 应用 3：私有属性

\`\`\`js
function privatize(obj) {
  return new Proxy(obj, {
    get(t, k) {
      if (k.startsWith('_')) return undefined  // 禁止访问 _ 开头
      return Reflect.get(t, k)
    },
    set(t, k, v) {
      if (k.startsWith('_')) throw new Error('不能设置私有属性')
      return Reflect.set(t, k, v)
    },
    ownKeys(t) {
      return Reflect.ownKeys(t).filter(k => !k.startsWith('_'))
    }
  })
}
\`\`\`

## 应用 4：默认值 / 计算属性

\`\`\`js
const config = new Proxy({ api: '/api' }, {
  get(t, k) {
    return k in t ? t[k] : \`默认_\${k}\`  // 未定义返回默认值
  }
})
\`\`\`

## 应用 5：日志 / 调试

\`\`\`js
function logAccess(obj, name = 'obj') {
  return new Proxy(obj, {
    get(t, k) { console.log(\`读取 \${name}.\${k}\`); return Reflect.get(t, k) },
    set(t, k, v) { console.log(\`设置 \${name}.\${k} =\`, v); return Reflect.set(t, k, v) }
  })
}
\`\`\`

## 应用 6：函数拦截（apply/construct）

\`\`\`js
function negate(fn) {
  return new Proxy(fn, {
    apply(t, thisArg, args) {
      return !Reflect.apply(t, thisArg, args)
    }
  })
}
const isEven = negate(x => x % 2 === 0)
isEven(3)  // true（取反）
\`\`\`

## 应用 7：单例 / 惰性

\`\`\`js
function lazy(create) {
  let instance
  return new Proxy({}, {
    get(_, k) {
      if (!instance) instance = create()
      return instance[k]
    }
  })
}
\`\`\`

## 应用 8：撤销代理（revoke）

\`\`\`js
const { proxy, revoke } = Proxy.revocable(target, handler)
// 用完后撤销，访问抛错
revoke()
proxy.a  // TypeError
\`\`\`
用于"用后即焚"的代理（如临时暴露内部对象）。

## 注意

1. **不是所有对象都能代理**：Proxy 只能代理普通对象，不能代理某些内部对象（如某些宿主对象）。
2. **性能**：Proxy 有开销，热路径慎用。
3. **代理后身份变化**：\`proxy instanceof OriginalClass\` 可能失效（原型链经过代理）。
4. **this 指向**：代理方法内 \`this\` 是 proxy 而非 target，需用 \`receiver\` 处理。
5. **无法拦截 \`==\`/\`===\`**：Proxy 不影响相等比较。
6. **数组代理**：数组操作会触发多次 trap（如 push 触发 get 'push'、get 'length'、set length 等），需注意去重。`
  },
  {
    id: 'js-051',
    category: 'javascript',
    title: 'BigInt 是什么？和 Number 有什么区别？',
    difficulty: '中等',
    tags: ['BigInt', 'Number', '精度', '大数'],
    answer: `## BigInt

ES2020 引入，表示**任意精度整数**，突破 Number 的安全整数范围。

\`\`\`js
const big = 9007199254740993n   // 字面量加 n
const b = BigInt('9007199254740993')  // 或构造
typeof big  // 'bigint'
\`\`\`

## 为什么需要

Number 用 IEEE 754 双精度浮点，**安全整数**范围是 \`-(2^53-1) ~ 2^53-1\`（即 \`Number.MAX_SAFE_INTEGER\` = \`9007199254740991\`）：

\`\`\`js
Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2  // true（精度丢失！）
9007199254740992 === 9007199254740993  // true（两个数在 JS 里相等）
\`\`\`

BigInt 无此限制：
\`\`\`js
9007199254740993n === 9007199254740992n  // false
2n ** 100n  // 巨大整数，精确
\`\`\`

## 区别

| | Number | BigInt |
| --- | --- | --- |
| 范围 | ±2^53-1 安全，更大精度丢失 | 任意精度（仅整数） |
| 小数 | 支持 | ❌ 不支持 |
| 数学库 | Math.max/sin... | ❌ 不支持 Math 方法 |
| 混合运算 | — | ❌ 不能与 Number 直接运算 |
| JSON | 支持 | ❌ 默认不能序列化 |
| 性能 | 快（硬件加速） | 慢（软件实现大数运算） |

## 关键限制

### 1. 不能与 Number 混合运算
\`\`\`js
1n + 1   // TypeError
1n + 1n  // 2n ✓
\`\`\`
需显式转换：\`BigInt(num)\` 或 \`Number(big)\`（注意精度丢失）。

### 2. 不支持小数
\`\`\`js
5n / 2n  // 2n（整除，不是 2.5）
\`\`\`

### 3. 不支持 Math 方法
\`\`\`js
Math.max(1n, 2n)  // TypeError
\`\`\`

### 4. JSON 序列化
\`\`\`js
JSON.stringify({ a: 1n })  // TypeError
// 需自定义 replacer
JSON.stringify({ a: 1n }, (k, v) => typeof v === 'bigint' ? v.toString() : v)
\`\`\`

### 5. 比较
\`\`\`js
1n === 1  // false（不同类型）
1n == 1   // true（宽松比较，转换后相等）
1n < 2    // true（可跨类型比较）
\`\`\`

## 应用场景

- **大整数 ID**：数据库自增 ID、雪花算法 ID 超过 2^53 时，后端返回字符串或 BigInt，前端用 BigInt 计算。
- **加密 / 哈希**：大数运算（RSA、SHA 涉及大数）。
- **精确金融计算**：以分（整数）存储，避免浮点误差。
- **时间戳**：纳秒级时间戳超出 Number 安全范围。

## 实际注意

1. **接口传参**：BigInt 不能直接 JSON 序列化，与后端交互常转为字符串。
2. **精度问题源头**：\`0.1 + 0.2 !== 0.3\` 是浮点问题，BigInt 不解决小数精度，小数用 \`decimal.js\` 或放大为整数。
3. **位运算**：BigInt 支持位运算（\`&\`、\`|\`、\`^\`、\`<<\`），但操作数必须都是 BigInt。
4. **兼容性**：现代浏览器支持，旧环境需 polyfill（\`jsbi\` 库）。`
  },
  {
    id: 'js-052',
    category: 'javascript',
    title: '动态 import() 和 import.meta 是什么？',
    difficulty: '中等',
    tags: ['动态 import', 'import.meta', 'ESM', '懒加载'],
    answer: `## 静态 import vs 动态 import()

### 静态 import（编译期）
\`\`\`js
import lodash from 'lodash'  // 顶层、必须字符串字面量、编译期确定
\`\`\`
- 模块在加载时立即求值。
- 支持 Tree Shaking（未用导出被剔除）。
- 路径必须是字面量，不能含变量。

### 动态 import()（运行时）
\`\`\`js
const mod = await import('./module.js')  // 返回 Promise<Module>
mod.namedExport  // 访问命名导出
mod.default      // 访问默认导出
\`\`\`
- **运行时求值**，按需加载。
- 参数可是变量、模板字符串：\`import(\`/locales/\${lang}.js\`)\`。
- 返回 Promise，可 \`await\`。
- 不参与 Tree Shaking（运行时才知道加载啥）。

## 用途

### 1. 代码分割 / 懒加载（最常见）
\`\`\`js
// 路由懒加载
const routes = [
  { path: '/admin', component: () => import('./Admin.vue') }
]

// 按需加载大依赖
button.onclick = async () => {
  const { exportToExcel } = await import('./excel.js')
  exportToExcel(data)
}
\`\`\`
Webpack/Vite 会把 \`import()\` 的模块拆成独立 chunk，首次访问才下载。

### 2. 条件加载
\`\`\`js
if (process.env.NODE_ENV === 'development') {
  const { default: devTools } = await import('./devtools.js')
  devTools.install()
}
\`\`\`

### 3. 国际化
\`\`\`js
const messages = await import(\`./locales/\${lang}.json\`)
\`\`\`

### 4. polyfill 按需
\`\`\`js
if (!('IntersectionObserver' in window)) {
  await import('intersection-observer-polyfill')
}
\`\`\`

## import.meta

ESM 专属的元数据对象，仅在 ES 模块内可用（CJS 用 \`__dirname\`/\`__filename\`）。

### 常用属性

\`\`\`js
import.meta.url       // 当前模块的绝对 URL（浏览器是 http(s) URL，Node 是 file:// URL）
import.meta.resolve('./mod.js')  // 解析为绝对 URL（Node 20+ / 浏览器较新）

// Vite/Webpack 扩展
import.meta.env       // Vite 环境变量（MODE/BASE_URL/DEV/PROD）
import.meta.hot       // Vite HMR API
import.meta.glob('./dir/*.js')  // Vite 批量导入
\`\`\`

### 应用

\`\`\`js
// 获取模块所在目录
const baseUrl = new URL('.', import.meta.url)

// 动态加载相对当前模块的资源
const data = await fetch(new URL('./data.json', import.meta.url))

// Node 中模拟 __dirname
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
\`\`\`

## 注意

1. **\`import()\` 返回 Promise**，顶层用需 \`await\`（顶层 await ES2022）。
2. **缓存**：同一模块只求值一次，再次 \`import()\` 返回缓存的 Promise。
3. **错误处理**：加载失败 Promise reject，需 \`.catch\` 或 try/await。
4. **\`import.meta\` 仅 ESM**：在 CJS 或非模块脚本中报错。Vite/Webpack/Rollup 各有扩展属性。
5. **预加载优化**：\`import()\` 拆出的 chunk 可用 \`<link rel="preload" href="chunk.js" as="script">\` 提前下载，缩短交互延迟。`
  },
  {
    id: 'js-053',
    category: 'javascript',
    title: 'JS 的错误体系是怎样的？Error 子类与 AggregateError 怎么用？',
    difficulty: '中等',
    tags: ['Error', '异常处理', 'AggregateError', '错误体系'],
    answer: `## Error 类型

\`\`\`js
new Error(message, options)  // options: { cause }
\`\`\`

### 内置子类
- \`Error\`：通用错误。
- \`TypeError\`：类型错误（如对 null 解引用）。
- \`RangeError\`：值越界（如栈溢出、无效数组长度）。
- \`ReferenceError\`：引用未定义变量。
- \`SyntaxError\`：语法错误（通常编译期）。
- \`URIError\`：URI 编解码错误。
- \`EvalError\`：eval 相关（已基本不用）。
- \`AggregateError\`（ES2021）：多个错误的聚合。

\`\`\`js
try { null.x } catch (e) { e instanceof TypeError }  // true
\`\`\`

## Error 实例属性

\`\`\`js
const e = new Error('失败')
e.message   // '失败'
e.name      // 'Error'（或子类名）
e.stack     // 调用栈字符串（非标准但广泛支持）
e.cause     // 原因链（ES2022）
\`\`\`

### cause（错误链）
\`\`\`js
try {
  doSomething()
} catch (e) {
  throw new Error('处理失败', { cause: e })  // 保留原始错误
}
\`\`\`
保留原始错误链，便于排查根因，避免 \`catch + throw new\` 丢失堆栈。

## 自定义错误类

\`\`\`js
class BusinessError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'BusinessError'
    this.code = code  // 自定义字段
  }
}

class ValidationError extends BusinessError {
  constructor(field, message) {
    super(message, 'VALIDATION')
    this.name = 'ValidationError'
    this.field = field
  }
}

throw new ValidationError('email', '邮箱格式错误')
\`\`\`

要点：
1. \`extends Error\`（继承原型链，\`instanceof Error\` 仍 true）。
2. 构造函数调 \`super(message)\`。
3. 手动设 \`this.name\`（默认是父类名）。
4. 可扩展 \`code\`/\`field\` 等业务字段。
5. 旧引擎需 \`Object.setPrototypeOf(this, BusinessError.prototype)\` 修复原型链，现代浏览器不用。

## AggregateError（ES2021）

聚合多个错误，\`Promise.any\` 全部 reject 时抛出：

\`\`\`js
const results = await Promise.any([
  fetch('/api1').then(r => r.json()),
  fetch('/api2').then(r => r.json())
]).catch(err => {
  err instanceof AggregateError  // true
  err.errors  // [Error, Error]（所有失败原因）
})
\`\`\`

手动创建：
\`\`\`js
const agg = new AggregateError([err1, err2], '全部失败')
\`\`\`

## 抛出非 Error 值

\`\`\`js
throw '字符串错误'  // 可抛任意值，但不推荐
throw { code: 500 }  // 同上
\`\`\`
不推荐：丢失堆栈、\`instanceof Error\` 为 false、调用方难处理。**始终抛 Error 实例**。

## 错误处理策略

1. **能恢复的就近处理**：\`try/catch\` 在能处理的层。
2. **不能处理的向上抛**：用 \`cause\` 包装后重抛，保留上下文。
3. **异步错误**：Promise reject / async throw，用 try/catch 或 \`.catch\`。
4. **全局兜底**：
   \`\`\`js
   window.addEventListener('error', e => { /* 同步错误 */ })
   window.addEventListener('unhandledrejection', e => { /* 未捕获的 Promise reject */ })
   \`\`\`
5. **业务错误码**：自定义 Error + code，上层 switch 处理。`
  },
  {
    id: 'js-054',
    category: 'javascript',
    title: '什么是尾调用优化（TCO）？为什么 JS 中常提不到？',
    difficulty: '困难',
    tags: ['尾调用', 'TCO', '递归', '优化'],
    answer: `## 尾调用（Tail Call）

函数的**最后一步**是调用另一个函数（返回值直接是该调用，无后续操作）：

\`\`\`js
// ✅ 尾调用
function f(x) { return g(x) }

// ❌ 非尾调用（调用后还有操作）
function f(x) { return g(x) + 1 }     // 加法
function f(x) { const r = g(x); return r }  // 赋值后返回（理论上是，但引擎未必优化）
function f(x) { g(x) }                 // 返回 undefined，g 的结果未用，是尾调用
\`\`\`

## 尾调用优化（TCO）

正常调用栈：A 调用 B，B 调用 C，栈不断增长，深层递归会**栈溢出**。

TCO：若调用是尾调用，调用帧可**复用**当前栈帧（不需保留 A 的状态），等价于跳转，栈不增长。

\`\`\`js
// 尾递归（递归 + 尾调用），TCO 下不会栈溢出
function factorial(n, acc = 1) {
  if (n <= 1) return acc
  return factorial(n - 1, n * acc)  // 尾调用
}
\`\`\`

## JS 中的现状

**ES6 规范要求**严格模式下实现 TCO，但**实际只有 Safari（JavaScriptCore）实现了**，V8（Chrome/Node）和 SpiderMonkey **未实现**。

\`\`\`js
'use strict'
function loop(n) {
  if (n === 0) return 0
  return loop(n - 1)  // 理论 TCO，V8 仍栈溢出
}
loop(1e6)  // Chrome/Node: RangeError: Maximum call stack
\`\`\`

### 为什么 V8 不实现
- 性能权衡：检测尾调用、改写栈帧有开销，多数场景反而变慢。
- 调试体验：TCO 会丢失调用栈，调试时看不到完整调用链。
- 实际收益小：递归深到栈溢出的场景少。

## 替代方案（递归转迭代）

### 1. 改用循环
\`\`\`js
function factorial(n) {
  let acc = 1
  for (let i = 2; i <= n; i++) acc *= i
  return acc
}
\`\`\`

### 2. 蹦床函数（trampoline）
把递归改返回"thunk"（待执行函数），用循环执行：
\`\`\`js
function trampoline(fn) {
  return function (...args) {
    let res = fn(...args)
    while (typeof res === 'function') res = res()
    return res
  }
}

const sum = trampoline(function sum(n, acc = 0) {
  if (n === 0) return acc
  return () => sum(n - 1, acc + n)  // 返回 thunk 而非直接递归
})
sum(1e6)  // 不溢出
\`\`\`

### 3. 显式栈
手动维护栈模拟递归：
\`\`\`js
function traverse(root) {
  const stack = [root], result = []
  while (stack.length) {
    const node = stack.pop()
    result.push(node.val)
    if (node.right) stack.push(node.right)
    if (node.left) stack.push(node.left)
  }
}
\`\`\`

## 实际意义

- **不要依赖 JS 的 TCO**：写递归时假设会栈溢出。
- **深递归改迭代**：树遍历、大数计算等用循环或显式栈。
- **函数式语言**（Scheme/Haskell/部分 Lisp）TCO 是标配，可放心写递归。
- ES 规范的 TCO 是"严格模式 + 尾位置"才触发，但兼容性差，生产代码不要依赖。

## 关键

- 尾调用 = 函数最后一步是调用。
- TO = 复用栈帧，避免栈溢出。
- JS：规范有，实践无（仅 Safari），用循环/trampoline/显式栈替代。`
  },
  {
    id: 'js-055',
    category: 'javascript',
    title: '变量提升和函数提升是怎么回事？let/const 有提升吗（TDZ）？',
    difficulty: '中等',
    tags: ['变量提升', '函数提升', 'TDZ', 'let', 'const'],
    answer: `## var 的提升

\`var\` 声明的变量在编译期被"提升"到作用域顶部，**赋值留在原地**：

\`\`\`js
console.log(a)  // undefined（不是 ReferenceError）
var a = 1
// 等价于：
var a
console.log(a)  // undefined
a = 1
\`\`\`

## 函数声明提升

**函数声明**（\`function foo(){}\`）整体提升（声明 + 函数体）：

\`\`\`js
foo()  // 'hi'（函数体也提升）
function foo() { console.log('hi') }
\`\`\`

**函数表达式**不提升（只提升 \`var\`，函数体是赋值）：
\`\`\`js
bar()  // TypeError: bar is not a function
var bar = function () { console.log('hi') }
\`\`\`

## 提升优先级

函数声明优先于变量提升：
\`\`\`js
console.log(typeof foo)  // 'function'
function foo() {}
var foo  // 重复声明被忽略
\`\`\`

## let/const 的"提升"与 TDZ

\`let\`/\`const\` **也会提升**（声明被识别），但在声明语句执行前处于**暂时性死区（TDZ）**，访问会抛 ReferenceError：

\`\`\`js
console.log(a)  // ReferenceError: Cannot access 'a' before initialization
let a = 1

// TDZ 也作用于 typeof
typeof b  // ReferenceError（b 在下面 let 声明）
let b
\`\`\`

### TDZ 的体现
\`\`\`js
{
  // 这里 a 在 TDZ
  console.log(a)  // ReferenceError
  let a = 2  // 此处退出 TDZ
  console.log(a)  // 2
}
\`\`\`

\`typeof\` 对未声明变量返回 \`'undefined'\`，但对 TDZ 中变量抛错——说明 \`let\` 确实"提升"了（被识别为当前作用域变量，只是不可访问）。

## var vs let/const vs function

| | var | let/const | function 声明 |
| --- | --- | --- | --- |
| 提升 | ✅ 初始化为 undefined | ✅ 但 TDZ | ✅ 整体提升 |
| 作用域 | 函数作用域 | 块作用域 | 函数作用域 |
| 重复声明 | 允许 | ❌ SyntaxError | 允许 |
| 全局对象属性 | 挂到 window | 不挂 | 挂到 window |
| 访问 TDZ | 可（undefined） | ❌ ReferenceError | 可 |

## 经典题

\`\`\`js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// 3 3 3（var 函数作用域，共享 i）

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// 0 1 2（let 块作用域，每次循环新绑定 i）
\`\`\`

\`let\` 在每次循环迭代创建新绑定，闭包捕获各自的 i。

## 全局对象属性

\`\`\`js
var x = 1
let y = 2
console.log(window.x)  // 1
console.log(window.y)  // undefined（let 不挂全局对象）
\`\`\`

## 最佳实践

- 始终用 \`let\`/\`const\`，避免 \`var\` 的提升与函数作用域陷阱。
- \`const\` 优先，需重新赋值才用 \`let\`。
- 函数声明可在使用后定义（提升），但为可读性仍建议先声明。
- 注意 TDZ：在 let/const 声明前不要访问同名变量。`
  },
  {
    id: 'js-056',
    category: 'javascript',
    title: 'setTimeout 为什么计时不准？最小延迟是多少？',
    difficulty: '中等',
    tags: ['setTimeout', '定时器', '事件循环', '精度'],
    answer: `## 为什么不准

\`setTimeout(fn, delay)\` 的 \`delay\` 是**最小延迟**，不是保证时间。实际触发受以下因素影响：

### 1. 事件循环排队
\`setTimeout\` 到期后回调进入宏任务队列，需等当前同步代码、微任务、前面的宏任务执行完才轮到。若主线程繁忙，回调被推迟。

\`\`\`js
setTimeout(() => console.log('timeout'), 0)
// 一段耗时的同步代码跑 1s
for (let i = 0; i < 1e9; i++) {}  // 阻塞 1s
// 'timeout' 1s 后才打印
\`\`\`

### 2. 嵌套 setTimeout 最小 4ms
HTML5 规范：嵌套 5 层以上的 \`setTimeout\`，最小延迟强制为 4ms（防止过多定时器拖垮页面）。即\`setTimeout(fn, 0)\` 实际至少 4ms。

### 3. 后台标签页节流
标签页不可见时，浏览器为省电把定时器最小延迟提高到 1000ms（不同浏览器策略不同）。可见后恢复。

### 4. unprioritized 节流
Chrome 对后台标签的定时器还有更激进的节流（如 1 分钟上限的"激进步进"）。

### 5. 系统休眠/省电
笔记本休眠或屏幕关闭时，定时器可能暂停或大幅延迟。

## 最小延迟

| 场景 | 最小延迟 |
| --- | --- |
| 顶层 setTimeout(fn, 0) | ~0ms（实际 0~4ms） |
| 嵌套 ≥5 层 | 4ms |
| 后台标签页 | ≥1000ms |
| 系统休眠 | 暂停 |

## 替代方案

### 1. 微任务（0 延迟）
\`\`\`js
queueMicrotask(() => console.log('micro'))
Promise.resolve().then(() => console.log('promise'))
// 比 setTimeout(0) 更快，在当前宏任务后立即执行
\`\`\`
但微任务会阻塞渲染，不适合让出主线程。

### 2. MessageChannel（比 setTimeout(0) 更快）
\`\`\`js
const ch = new MessageChannel()
ch.port1.onmessage = () => console.log('channel')
ch.port2.postMessage(null)  // 宏任务，但无 4ms 限制
\`\`\`
Vue3 的 \`nextTick\`、scheduler 库常用它做"尽快但让出微任务"的调度。

### 3. requestAnimationFrame（对齐帧）
\`\`\`js
// 需在下一帧执行动画/视觉更新
requestAnimationFrame(() => update())
\`\`\`
顺带帧节奏，不阻塞渲染，动画首选。

### 4. requestIdleCallback（空闲时执行）
\`\`\`js
requestIdleCallback(() => lowPriorityWork())
\`\`\`
浏览器空闲时执行低优先级任务。

### 5. 精确计时
- 高精度时间戳：\`performance.now()\`（微秒级，不受系统时钟调整影响）。
- Worker + \`Atomics.wait\` 实现精确延时。
- Web Audio API 的 \`AudioContext\` 可做精确节奏（如节拍器）。

## 实践

1. **别用 setTimeout 做精确计时**：用 \`performance.now()\` 计算实际耗时。
2. **动画用 rAF**：顺带刷新率，流畅且不浪费。
3. **尽快执行用微任务**：但要小心阻塞渲染。
4. **倒计时显示**：基于 \`Date.now()\` 差值更新，而非依赖定时器间隔（定时器会漂移）。
5. **后台暂停**：用 \`visibilitychange\` 主动暂停定时器，避免后台堆积回调。
6. **清理**：组件卸载 \`clearTimeout\`，防止回调操作已卸载的 DOM。`
  },
  {
    id: 'js-057',
    category: 'javascript',
    title: 'JS 异步编程经历了哪些范式演进？',
    difficulty: '中等',
    tags: ['异步', '回调', 'Promise', 'async', 'RxJS'],
    answer: `## 演进路线

回调 → Promise → Generator → async/await → 响应式（RxJS）/ 顶层 await。

## 1. 回调（Callback）

\`\`\`js
fs.readFile('a.txt', (err, data) => {
  if (err) return handleError(err)
  fs.readFile('b.txt', (err, data2) => {
    if (err) return handleError(err)
    // 嵌套...
  })
})
\`\`\`
**回调地狱**：深层嵌套、错误处理散乱、控制流难管理。

## 2. Promise（ES6）

\`\`\`js
readFile('a.txt')
  .then(data => readFile('b.txt'))
  .then(data2 => readFile('c.txt'))
  .catch(handleError)
\`\`\`
- 链式调用，扁平化。
- 统一错误处理（\`catch\` 捕获整链）。
- 状态不可逆，避免回调被多次调用。
- API：\`Promise.all\`/\`race\`/\`allSettled\`/\`any\`。

## 3. Generator（ES6）

\`\`\`js
function* readFiles() {
  const a = yield readFile('a.txt')
  const b = yield readFile('b.txt')
  return [a, b]
}
co(readFiles).then(console.log)  // 需自动执行器（co 库）
\`\`\`
能用同步写法写异步，但需执行器、语义不专一（Generator 本是迭代器）。

## 4. async/await（ES2017）

\`\`\`js
async function readFiles() {
  try {
    const a = await readFile('a.txt')
    const b = await readFile('b.txt')
    return [a, b]
  } catch (e) {
    handleError(e)
  }
}
\`\`\`
- 同步式写法 + try/catch，最直观。
- 本质是 Generator + Promise 语法糖。
- 顶层 await（ES2022）：模块顶层可直接 \`await\`。

## 5. 响应式编程（RxJS）

\`\`\`js
fromEvent(button, 'click').pipe(
  throttleTime(1000),
  map(e => e.target.value),
  switchMap(query => fetch(\`/api?q=\${query}\`))
).subscribe(res => console.log(res))
\`\`\`
- 把一切视为**数据流**（事件、请求、定时器）。
- 强大的操作符组合（map/filter/merge/switchMap...）。
- 擅长复杂异步流：取消、节流、并发切换、错误重试。
- 代价：学习曲线陡、调试复杂。

## 对比

| 范式 | 优点 | 缺点 |
| --- | --- | --- |
| 回调 | 简单直接 | 回调地狱、错误难处理 |
| Promise | 链式、统一错误 | 仍需 .then、易忘 catch |
| async/await | 同步式、可读性最好 | 串行陷阱、需注意并发 |
| RxJS | 流式、强大操作符 | 复杂、过度设计风险 |

## 实践选择

- **常规异步**：async/await（最主流）。
- **并发控制**：\`Promise.all\` + \`await\`，或 \`p-limit\`。
- **事件流 / 复杂组合**：RxJS 或 Observable（如搜索框防抖+取消+切换）。
- **取消**：\`AbortController\`（fetch、事件监听统一取消）。
- **状态机**：复杂状态流转用 XState。

## 现代趋势

- **AbortController**：统一的取消原语（fetch、监听、流）。
- **AsyncIterator / for await...of**：异步数据流遍历（分页、流式）。
- **顶层 await**：模块级异步初始化。
- **Structured concurrency**：Promise.allSettled + 取消传播（实验性）。`
  },
  {
    id: 'js-058',
    category: 'javascript',
    title: 'class 与构造函数有什么区别？static、私有字段、继承怎么用？',
    difficulty: '中等',
    tags: ['class', '构造函数', 'static', '私有字段', '继承'],
    answer: `## class 语法

\`\`\`js
class Person {
  // 实例字段（每个实例独立）
  name = 'default'  // 字段声明（ES2022）

  // 构造函数
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  // 实例方法（在原型上）
  greet() { return \`Hi, I'm \${this.name}\` }

  // 静态方法/字段（在类本身上）
  static create(name) { return new Person(name, 0) }
  static species = 'human'

  // 私有字段（ES2022，# 前缀）
  #id = Math.random()

  getId() { return this.#id }

  // 私有方法
  #validate() { return true }

  // 访问器
  get bio() { return \`\${this.name}, \${this.age}\` }
  set bio(v) { [this.name, this.age] = v.split(',') }

  // 静态块（类初始化时执行）
  static { this.defaults = { age: 0 } }
}
\`\`\`

## 与构造函数对比

\`\`\`js
// 构造函数写法
function Person(name) {
  this.name = name
}
Person.prototype.greet = function () { return 'Hi' }
Person.create = function (name) { return new Person(name) }

// class 是其语法糖，但有区别：
\`\`\`

| | class | function 构造 |
| --- | --- | --- |
| 提升 | ❌ 不提升（TDZ） | ✅ 提升 |
| 不带 new 调用 | ❌ TypeError | ✅ 当普通函数（this 指向全局） |
| 严格模式 | 默认严格 | 取决于声明位置 |
| 静态方法 | \`static\` 关键字 | 挂 \`Fn.xxx\` |
| 私有 | \`#field\` | 无（约定 \`_\` 前缀） |
| 内部方法 | 不可枚举 | prototype 上可枚举 |

## 继承

\`\`\`js
class Animal {
  constructor(name) { this.name = name }
  speak() { return \`\${this.name} makes a sound\` }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)  // 必须先调 super 才能用 this
    this.breed = breed
  }
  speak() { return \`\${this.name} barks\` }  // 覆写
  fetch() { return 'fetches' }
}

const d = new Dog('Rex', 'Lab')
d.speak()  // 'Rex barks'
d instanceof Animal  // true
\`\`\`

### super
- 子类构造函数必须先 \`super()\` 才能 \`this\`。
- 方法内 \`super.method()\` 调父类方法。
- 静态方法内 \`super\` 也能调父类静态方法。

## 私有字段（#）

\`\`\`js
class Counter {
  #count = 0          // 私有，类外不可访问
  increment() { this.#count++ }
  get value() { return this.#count }
}
const c = new Counter()
c.#count    // SyntaxError（类外访问）
c.count     // undefined
\`\`\

特点：
- \`#\` 是字段名的一部分，不是修饰符。
- 真正私有（运行时隔离），比 \`_\` 约定或 \`WeakMap\` 更强。
- 私有字段**必须先声明**才能用（不能临时 \`this.#x = 1\`）。
- 私有方法：\`#method(){}\`。
- 私有字段不能从子类直接访问（需通过方法暴露）。

## 静态成员

\`\`\`js
class MathUtil {
  static PI = 3.14
  static square(x) { return x * x }
}
MathUtil.PI           // 3.14
MathUtil.square(2)    // 4
new MathUtil().PI     // undefined（实例访问不到）
\`\`\`
- 静态方法内 \`this\` 指向类本身。
- 子类继承父类静态成员。
- \`static {}\` 块在类定义时执行一次（初始化静态状态）。

## 注意

1. **class 不提升**：先定义后使用，否则 ReferenceError（TDZ）。
2. **必须 new**：\`Person()\` 不带 new 报错。
3. **方法不可枚举**：\`Object.keys(instance)\` 不含方法。
4. **私有字段兼容性**：现代浏览器支持，旧环境需转译（TypeScript/Babel）。
5. **多继承**：JS 不支持多继承，用 mixin（\`Object.assign\`）模拟。
6. **class 本质是函数**：\`typeof Person === 'function'\`，是构造函数 + 原型方法的语法糖。`
  }
]
