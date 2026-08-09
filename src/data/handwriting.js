export const handwritingQuestions = [
  {
    id: 'hw-001',
    category: 'handwriting',
    title: '手写防抖（debounce）与节流（throttle）',
    difficulty: '中等',
    tags: ['防抖', '节流', '手写'],
    answer: `## 防抖 debounce

\`\`\`js
function debounce(fn, delay, immediate = false) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    if (immediate && !timer) {
      fn.apply(this, args)
    }
    timer = setTimeout(() => {
      timer = null
      if (!immediate) fn.apply(this, args)
    }, delay)
  }
}
\`\`\`

- 支持立即执行选项。
- 返回函数保持 this 与参数。

## 节流 throttle

\`\`\`js
function throttle(fn, delay) {
  let last = 0
  let timer = null
  return function (...args) {
    const now = Date.now()
    const remaining = delay - (now - last)
    if (remaining <= 0) {
      // 已超过间隔，立即执行
      if (timer) { clearTimeout(timer); timer = null }
      fn.apply(this, args)
      last = now
    } else if (!timer) {
      // 保证最后一次触发也能执行（尾随）
      timer = setTimeout(() => {
        fn.apply(this, args)
        last = Date.now()
        timer = null
      }, remaining)
    }
  }
}
\`\`\`

- 时间戳 + 定时器结合：首次立即执行 + 尾随执行。

## 进阶：可取消版本

\`\`\`js
function debounce(fn, delay) {
  let timer
  const debounced = function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}
\`\`\``
  },
  {
    id: 'hw-002',
    category: 'handwriting',
    title: '手写深拷贝（处理循环引用）',
    difficulty: '困难',
    tags: ['深拷贝', 'WeakMap', '手写'],
    answer: `\`\`\`js
function deepClone(obj, hash = new WeakMap()) {
  // 原始类型 / null / function 直接返回
  if (obj === null || typeof obj !== 'object') return obj
  // 函数保留引用（一般不深拷贝函数）
  if (typeof obj === 'function') return obj

  // 处理 Date / RegExp
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  // 处理循环引用：已拷贝过直接返回
  if (hash.has(obj)) return hash.get(obj)

  // 处理 Map / Set
  if (obj instanceof Map) {
    const map = new Map()
    hash.set(obj, map)
    obj.forEach((v, k) => map.set(deepClone(k, hash), deepClone(v, hash)))
    return map
  }
  if (obj instanceof Set) {
    const set = new Set()
    hash.set(obj, set)
    obj.forEach((v) => set.add(deepClone(v, hash)))
    return set
  }

  // 数组 / 普通对象
  const clone = Array.isArray(obj) ? [] : {}
  hash.set(obj, clone)

  // 用 Reflect.ownKeys 包含 Symbol 属性
  Reflect.ownKeys(obj).forEach((key) => {
    clone[key] = deepClone(obj[key], hash)
  })
  return clone
}
\`\`\`

## 关键点

1. **WeakMap 记录已访问对象**，处理循环引用（a 引用 b，b 引用 a）。
2. **特殊类型处理**：Date、RegExp、Map、Set。
3. **Symbol 属性**：用 \`Reflect.ownKeys\` 而非 \`Object.keys\`。
4. **函数**：通常保留引用不深拷贝（也可选择克隆函数对象属性）。
5. **递归终止**：原始类型直接返回。

## 替代方案

- \`structuredClone(obj)\`：原生，支持循环引用、Date、Map、Set、ArrayBuffer，不支持函数。
- \`JSON.parse(JSON.stringify(obj))\`：简单但有诸多限制。
- lodash \`_.cloneDeep\`：最全面。`
  },
  {
    id: 'hw-003',
    category: 'handwriting',
    title: '手写 Promise（简易版）',
    difficulty: '困难',
    tags: ['Promise', '手写', '微任务'],
    answer: `\`\`\`js
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'
      this.value = value
      this.onFulfilledCallbacks.forEach((fn) => fn())
    }
    const reject = (reason) => {
      if (this.state !== 'pending') return
      this.state = 'rejected'
      this.reason = reason
      this.onRejectedCallbacks.forEach((fn) => fn())
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => { throw e }

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledTask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      const rejectedTask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.state === 'fulfilled') fulfilledTask()
      else if (this.state === 'rejected') rejectedTask()
      else {
        this.onFulfilledCallbacks.push(fulfilledTask)
        this.onRejectedCallbacks.push(rejectedTask)
      }
    })
    return promise2
  }

  catch(fn) {
    return this.then(null, fn)
  }
}

// 处理 then 回调返回 Promise 的情况
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError('Chaining cycle'))
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else if (x !== null && typeof x === 'object') {
    let then
    try {
      then = x.then
    } catch (e) {
      return reject(e)
    }
    if (typeof then === 'function') {
      let called = false
      try {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (e) {
        if (called) return
        reject(e)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}
\`\`\`

## 关键点

1. **状态不可逆**：pending → fulfilled/rejected 后不再变。
2. **回调异步执行**：用 \`queueMicrotask\` 保证 then 回调在微任务中执行。
3. **支持链式**：then 返回新 Promise，根据回调返回值决定其状态。
4. **值穿透**：非函数的 onFulfilled/onRejected 透传值 / 抛错。
5. **resolvePromise**：处理 thenable 与循环引用。`
  },
  {
    id: 'hw-004',
    category: 'handwriting',
    title: '手写 call / apply / bind',
    difficulty: '中等',
    tags: ['call', 'apply', 'bind', '手写'],
    answer: `## call

\`\`\`js
Function.prototype.myCall = function (context, ...args) {
  context = context == null ? globalThis : Object(context)
  const key = Symbol('fn')
  Object.defineProperty(context, key, {
    value: this,
    enumerable: false
  })
  const result = context[key](...args)
  delete context[key]
  return result
}
\`\`\`

## apply

\`\`\`js
Function.prototype.myApply = function (context, args = []) {
  context = context == null ? globalThis : Object(context)
  const key = Symbol('fn')
  Object.defineProperty(context, key, {
    value: this,
    enumerable: false
  })
  const result = context[key](...args)
  delete context[key]
  return result
}
\`\`\`

## bind

\`\`\`js
Function.prototype.myBind = function (context, ...args) {
  const fn = this
  const bound = function (...rest) {
    // 作为构造函数时 this 指向实例，忽略 context
    return fn.apply(this instanceof fn ? this : context, [...args, ...rest])
  }
  // 维持原型链（new 时能继承原函数原型）
  bound.prototype = Object.create(fn.prototype)
  return bound
}
\`\`\`

## 原理核心

- 把函数作为 context 的一个临时属性调用，从而让 \`this\` 指向 context。
- 用 Symbol 避免覆盖原属性。
- \`Object(context)\` 包装原始类型（如数字 → Number 对象）。
- bind 需处理"作为构造函数"的场景，且支持柯里化（预置参数）。`
  },
  {
    id: 'hw-005',
    category: 'handwriting',
    title: '手写 new 的实现',
    difficulty: '中等',
    tags: ['new', '手写', '原型'],
    answer: `\`\`\`js
function myNew(Constructor, ...args) {
  // 1. 创建新对象，原型指向构造函数的 prototype
  const obj = Object.create(Constructor.prototype)
  // 2. 以新对象为 this 执行构造函数
  const result = Constructor.apply(obj, args)
  // 3. 若构造函数返回对象，则返回该对象；否则返回新对象
  return result instanceof Object ? result : obj
}
\`\`\`

## new 做的事

1. 创建一个空对象。
2. 将对象的 \`__proto__\` 指向构造函数的 \`prototype\`。
3. 以该对象为 \`this\` 执行构造函数（初始化属性）。
4. 如果构造函数显式返回了一个**对象**，则返回该对象；否则返回新创建的对象。

## 验证

\`\`\`js
function Person(name) { this.name = name }
Person.prototype.say = function () { return this.name }
const p = myNew(Person, 'Tom')
p.say()  // 'Tom'
p instanceof Person  // true
\`\`\`

## 注意

- 构造函数返回原始类型（string/number 等）会被忽略，仍返回新对象。
- 返回 null 也算 object（typeof null === 'object'），但按规范应返回新对象，可用 \`result && typeof result === 'object'\` 判断更严谨。`
  },
  {
    id: 'hw-006',
    category: 'handwriting',
    title: '手写 instanceof',
    difficulty: '简单',
    tags: ['instanceof', '原型链', '手写'],
    answer: `\`\`\`js
function myInstanceof(left, right) {
  // 原始类型直接返回 false
  if (left == null || (typeof left !== 'object' && typeof left !== 'function')) {
    return false
  }
  let proto = Object.getPrototypeOf(left)
  while (proto !== null) {
    if (proto === right.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
\`\`\`

## 原理

沿对象的原型链（\`__proto__\`）向上查找，看是否能找到构造函数的 \`prototype\`。

\`\`\`
left.__proto__ === right.prototype ?  → true
left.__proto__.__proto__ === ...      → 继续找
直到 null                              → false
\`\`\`

## 验证

\`\`\`js
myInstanceof([], Array)        // true
myInstanceof([], Object)       // true
myInstanceof('a', String)      // false（原始类型）
myInstanceof(new String('a'), String)  // true
\`\`\`

## 注意

- 原始类型不参与 instanceof（\`'a' instanceof String\` 也是 false）。
- \`Object.getPrototypeOf\` 比 \`__proto__\` 更标准。`
  },
  {
    id: 'hw-007',
    category: 'handwriting',
    title: '手写发布订阅（EventEmitter）',
    difficulty: '中等',
    tags: ['发布订阅', 'EventEmitter', '手写'],
    answer: `\`\`\`js
class EventEmitter {
  constructor() {
    this.events = new Map()
  }

  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, [])
    this.events.get(event).push(listener)
    return this
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args)
      this.off(event, wrapper)
    }
    // off 通过引用移除，需把 wrapper 关联到原 listener
    wrapper.raw = listener
    this.on(event, wrapper)
    return this
  }

  emit(event, ...args) {
    const listeners = this.events.get(event)
    if (!listeners) return false
    // 拷贝一份，避免回调中 off 导致索引错乱
    [...listeners].forEach((fn) => fn(...args))
    return true
  }

  off(event, listener) {
    const listeners = this.events.get(event)
    if (!listeners) return this
    this.events.set(
      event,
      listeners.filter((fn) => fn !== listener && fn.raw !== listener)
    )
    if (this.events.get(event).length === 0) this.events.delete(event)
    return this
  }
}
\`\`\`

## 关键点

1. **on 注册、emit 触发、off 移除**。
2. **once**：执行一次后自动 off，需处理 off 时的引用匹配（wrapper.raw）。
3. **emit 时拷贝 listeners**：避免回调中 off / on 改变数组导致遍历异常。
4. **返回 this** 支持链式。

## 应用场景

- 自定义事件总线（跨组件通信）。
- Node 的 events 模块。
- Vue2 的 \$emit / \$on 原型。`
  },
  {
    id: 'hw-008',
    category: 'handwriting',
    title: '手写 Promise 并发控制（限制并发数）',
    difficulty: '困难',
    tags: ['并发控制', 'Promise', '手写'],
    answer: `## 需求

给定一组返回 Promise 的函数，限制同时执行的数量（如最多 3 个并发），全部完成并按顺序返回结果。

## 实现

\`\`\`js
async function limitConcurrency(tasks, limit) {
  const results = new Array(tasks.length)
  let index = 0       // 下一个要执行的任务下标
  let completed = 0   // 已完成数量

  async function worker() {
    while (index < tasks.length) {
      const i = index++   // 领取当前任务
      try {
        results[i] = await tasks[i]()
      } catch (e) {
        results[i] = e    // 失败也记录（按需可改为 reject）
      }
      completed++
    }
  }

  // 启动 limit 个 worker 并发执行
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
  await Promise.all(workers)
  return results
}
\`\`\`

## 使用

\`\`\`js
const tasks = urls.map((url) => () => fetch(url).then((r) => r.json()))
const data = await limitConcurrency(tasks, 3)
\`\`\`

## 关键点

1. **任务以函数形式提供**（惰性），调用时才真正发起。
2. **共享 index 指针**：每个 worker 领取下一个任务，自然实现并发上限。
3. **结果按下标保存**：保证顺序，与完成先后无关。
4. **错误处理**：可记录错误或整体 reject，按业务定。

## 变体：带回调 / 进度

\`\`\`js
async function pool(tasks, limit, onProgress) {
  // ... 在 completed++ 后调用 onProgress(completed, tasks.length)
}
\`\`\`

## 现成方案

- \`p-limit\`、\`p-queue\`、\`async\` 的 parallelLimit。

## 应用

- 批量请求 / 图片上传 / 爬虫限速，避免一次性发起过多请求导致浏览器 / 服务器压力过大或被限流。`
  },
  {
    id: 'hw-009',
    category: 'handwriting',
    title: '手写 LRU 缓存',
    difficulty: '困难',
    tags: ['LRU', 'Map', '双向链表', '手写'],
    answer: `## 用 Map 实现（JS 简洁版）

利用 Map 的迭代顺序 = 插入顺序，每次访问把 key 移到最新：

\`\`\`js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key) {
    if (!this.cache.has(key)) return -1
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)  // 重新 set 放到末尾（最新）
    return value
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 删除最久未使用（Map 第一个）
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, value)
  }
}
\`\`\`

## 标准实现：双向链表 + 哈希表

面试常要求 O(1) 且不用 Map：

\`\`\`js
class Node {
  constructor(key, val) {
    this.key = key
    this.val = val
    this.prev = null
    this.next = null
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map()
    // 哨兵头尾节点
    this.head = new Node()
    this.tail = new Node()
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  _remove(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  _addToHead(node) {
    node.next = this.head.next
    node.prev = this.head
    this.head.next.prev = node
    this.head.next = node
  }

  _moveToHead(node) {
    this._remove(node)
    this._addToHead(node)
  }

  get(key) {
    if (!this.map.has(key)) return -1
    const node = this.map.get(key)
    this._moveToHead(node)
    return node.val
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key)
      node.val = value
      this._moveToHead(node)
    } else {
      if (this.map.size >= this.capacity) {
        // 淘汰尾部
        const removed = this.tail.prev
        this._remove(removed)
        this.map.delete(removed.key)
      }
      const node = new Node(key, value)
      this.map.set(key, node)
      this._addToHead(node)
    }
  }
}
\`\`\`

## 关键点

- **哈希表 O(1) 查找** + **双向链表 O(1) 调整顺序**。
- 访问 / 写入都把节点移到头部（最近使用）。
- 容量超限时淘汰尾部（最久未使用）。
- 哨兵节点简化边界处理。`
  },
  {
    id: 'hw-010',
    category: 'handwriting',
    title: '手写数组扁平化（flatten）',
    difficulty: '简单',
    tags: ['扁平化', 'flatten', '手写'],
    answer: `## 1. 递归

\`\`\`js
function flatten(arr) {
  const res = []
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      res.push(...flatten(item))
    } else {
      res.push(item)
    }
  })
  return res
}
\`\`\`

## 2. reduce

\`\`\`js
const flatten = (arr) =>
  arr.reduce((acc, cur) =>
    acc.concat(Array.isArray(cur) ? flatten(cur) : cur), [])
\`\`\`

## 3. 迭代（栈）

\`\`\`js
function flatten(arr) {
  const stack = [...arr]
  const res = []
  while (stack.length) {
    const item = stack.pop()
    if (Array.isArray(item)) {
      stack.push(...item)
    } else {
      res.unshift(item)
    }
  }
  return res
}
\`\`\`

## 4. 指定深度

\`\`\`js
function flatten(arr, depth = 1) {
  if (depth <= 0) return arr.slice()
  return arr.reduce((acc, cur) =>
    acc.concat(Array.isArray(cur) ? flatten(cur, depth - 1) : cur), [])
}
\`\`\`

## 5. 原生 flat

\`\`\`js
arr.flat(Infinity)  // 完全扁平化
\`\`\`

## 6. toString（仅数字数组）

\`\`\`js
arr.toString().split(',').map(Number)
\`\`\`
- 有局限：元素须能转字符串，丢失类型。

## 关键点

- 递归最直观。
- 栈迭代避免递归栈溢出（极深嵌套）。
- 需要指定深度时控制递归层数。`
  },
  {
    id: 'hw-011',
    category: 'handwriting',
    title: '手写 Promise.all / allSettled / race / any',
    difficulty: '困难',
    tags: ['Promise', 'all', 'race', '手写'],
    answer: `## Promise.all

全部成功才成功，按顺序返回结果；任一失败立即 reject。

\`\`\`js
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises)
    const result = new Array(arr.length)
    let count = 0
    if (arr.length === 0) return resolve([])
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          result[i] = v
          if (++count === arr.length) resolve(result)
        },
        reject
      )
    })
  })
}
\`\`\`

- 用 count 计数而非 result.length（稀疏数组会误判）。
- 用 Promise.resolve(p) 兼容非 Promise 值。

## Promise.allSettled

等所有完成（无论成功失败），返回每个的状态与值。

\`\`\`js
Promise.myAllSettled = function (promises) {
  return new Promise((resolve) => {
    const arr = Array.from(promises)
    const result = new Array(arr.length)
    let count = 0
    if (arr.length === 0) return resolve([])
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          result[i] = { status: 'fulfilled', value }
          if (++count === arr.length) resolve(result)
        },
        (reason) => {
          result[i] = { status: 'rejected', reason }
          if (++count === arr.length) resolve(result)
        }
      )
    })
  })
}
\`\`\`

- 永远 resolve，不会 reject。

## Promise.race

第一个完成（成功或失败）即决定结果。

\`\`\`js
Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises)
    arr.forEach((p) => {
      Promise.resolve(p).then(resolve, reject)
    })
  })
}
\`\`\`

- 应用：请求超时控制 Promise.race([fetch(url), timeout(5000)])。

## Promise.any

第一个成功决定结果；全部失败才 reject（AggregateError）。

\`\`\`js
Promise.myAny = function (promises) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises)
    const errors = new Array(arr.length)
    let count = 0
    if (arr.length === 0) {
      return reject(new AggregateError([], 'All promises rejected'))
    }
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        resolve,
        (e) => {
          errors[i] = e
          if (++count === arr.length) {
            reject(new AggregateError(errors, 'All promises rejected'))
          }
        }
      )
    })
  })
}
\`\`\`

## 对比表

| 方法 | 成功条件 | 失败条件 | 返回 |
| --- | --- | --- | --- |
| all | 全部成功 | 任一失败 | 值数组 |
| allSettled | 永远成功 | 不失败 | {status, value/reason}[] |
| race | 第一个完成 | 第一个失败 | 第一个的值/原因 |
| any | 第一个成功 | 全部失败 | 第一个成功的值 |

## 验证

\`\`\`js
Promise.myAll([1, Promise.resolve(2), Promise.resolve(3)])
  .then(console.log)  // [1, 2, 3]
Promise.myAllSettled([Promise.resolve(1), Promise.reject('err')])
  .then(console.log)
  // [{status:'fulfilled',value:1},{status:'rejected',reason:'err'}]
\`\`\`

## 易错点

1. 用 Array.from 处理可迭代输入。
2. Promise.resolve(p) 包裹非 Promise 值。
3. 空数组：allSettled 立即 resolve([])，race 永远 pending，any 直接 reject。
4. 用计数器 + 下标，不要用 result.length 判断完成。`
  },
  {
    id: 'hw-012',
    category: 'handwriting',
    title: '手写 async/await（generator 自动执行）',
    difficulty: '困难',
    tags: ['async', 'await', 'generator', '手写'],
    answer: `## 原理

async/await 是 Generator 的语法糖：
- async 函数 = 包装 generator 的自动执行器。
- await = yield，暂停等待 Promise resolve 后把值传回。

## generator 基础

\`\`\`js
function* gen() {
  const a = yield 1
  const b = yield a + 2
  return a + b
}
const g = gen()
g.next()        // {value: 1, done: false}
g.next(10)      // a = 10, {value: 12, done: false}
g.next(20)      // b = 20, {value: 30, done: true}
\`\`\`

- next(val) 把 val 作为上一个 yield 的返回值。

## 自动执行器（Promise 版 = async/await 本质）

\`\`\`js
function asyncToGenerator(generatorFn) {
  return function (...args) {
    const gen = generatorFn.apply(this, args)
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let res
        try {
          res = gen[key](arg)
        } catch (e) {
          return reject(e)
        }
        const { value, done } = res
        if (done) return resolve(value)
        Promise.resolve(value).then(
          (v) => step('next', v),
          (e) => step('throw', e)
        )
      }
      step('next', undefined)
    })
  }
}
\`\`\`

## 使用

把 async 改成 function*，await 改成 yield：

\`\`\`js
const fetchUser = asyncToGenerator(function* () {
  try {
    const user = yield fetch('/api/user').then((r) => r.json())
    const posts = yield fetch('/api/posts?uid=' + user.id).then((r) => r.json())
    return { user, posts }
  } catch (e) {
    console.error('failed', e)
  }
})
fetchUser().then(console.log)
\`\`\`

## co 库简化版

TJ 的 co 库核心也是自动执行，但支持 yield Promise / 数组 / 对象 / generator：

\`\`\`js
function co(gen) {
  return new Promise((resolve, reject) => {
    const g = gen()
    function next(val) {
      let res
      try { res = g.next(val) } catch (e) { return reject(e) }
      if (res.done) return resolve(res.value)
      Promise.resolve(res.value).then(next, reject)
    }
    next()
  })
}
\`\`\`

## 关键点

1. 自动执行器：递归调用 next，每次等 Promise resolve 后继续。
2. 值回传：next(value) 把 Promise 结果作为 yield 表达式的值。
3. 错误传递：gen.throw(e) 让 generator 内部 try/catch 捕获。
4. 本质：async 函数 = generator + 自动执行器 + Promise。

## Babel 编译

Babel 把 async function 编译成 asyncToGenerator + function*，与上面手写一致。

## 注意

- await 只能在 async 内（generator 内的 yield 也只能在内）。
- 多个独立 await 串行执行，可用 Promise.all 并行优化。
- 错误冒泡：未捕获的 reject 会变成外层 Promise 的 reject。`
  },
  {
    id: 'hw-013',
    category: 'handwriting',
    title: '手写函数柯里化（curry）',
    difficulty: '中等',
    tags: ['柯里化', 'curry', '函数式', '手写'],
    answer: `## 柯里化

把多参数函数 f(a, b, c) 转为逐步接收的形式 f(a)(b)(c)，参数足够时执行。

## 基础实现

\`\`\`js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return function (...args2) {
      return curried.apply(this, [...args, ...args2])
    }
  }
}
\`\`\`

- fn.length 是函数形参个数（不含默认值、rest）。
- this 透传。

## 使用

\`\`\`js
function add(a, b, c) { return a + b + c }
const curriedAdd = curry(add)
curriedAdd(1)(2)(3)      // 6
curriedAdd(1, 2)(3)      // 6
curriedAdd(1)(2, 3)      // 6
curriedAdd(1, 2, 3)      // 6
\`\`\`

## 进阶：支持占位符

允许预留参数位置后续填充：

\`\`\`js
function curry(fn, placeholder) {
  const _ = placeholder || curry.placeholder || Symbol('placeholder')
  return function curried(...args) {
    const filled = args.filter((a) => a !== _).length
    if (filled >= fn.length && !args.includes(_)) {
      return fn.apply(this, args)
    }
    return function (...args2) {
      const merged = args.map((a) => {
        if (a === _ && args2.length) return args2.shift()
        return a
      })
      return curried.apply(this, [...merged, ...args2])
    }
  }
}
curry.placeholder = Symbol('placeholder')

const fn = curry((a, b, c) => [a, b, c])
fn(1, curry.placeholder, 3)(2)  // [1, 2, 3]
\`\`\`

## 应用

### 1. 参数复用

\`\`\`js
const log = curry((level, time, msg) => '[' + level + '][' + time + '] ' + msg)
const errorLog = log('ERROR')
errorLog('10:00', 'fail')
\`\`\`

### 2. 延迟执行

参数攒够才执行，类似工厂模式。

### 3. 函数组合 compose

\`\`\`js
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x)
const f = compose(toUpperCase, trim, reverse)
\`\`\`

- 函数式编程核心：把多参函数拆为单参链，便于组合。

### 4. 偏函数 vs 柯里化

- 偏函数：partial(f, a) 固定部分参数返回新函数 f(a, ?)。
- 柯里化：逐步接单参，参数满才执行。

\`\`\`js
const partial = (fn, ...preset) => (...rest) => fn(...preset, ...rest)
\`\`\`

## 关键点

1. 闭包保存已收集参数。
2. fn.length 判断参数是否充足。
3. this 透传（apply(this, ...)）。
4. 占位符让柯里化更灵活（lodash _.curry 支持）。`
  },
  {
    id: 'hw-014',
    category: 'handwriting',
    title: '手写 LazyMan（链式任务调度器）',
    difficulty: '困难',
    tags: ['LazyMan', '调度器', '链式调用', '手写'],
    answer: `## 需求

实现 LazyMan：
\`\`\`js
lazyMan('Hank')
// Hi! I am Hank

lazyMan('Hank').sleep(10).eat('dinner')
// Hi! I am Hank
// （等待 10 秒）
// Wake up after 10s
// Eat dinner

lazyMan('Hank').sleepFirst(5).eat('supper')
// （等待 5 秒）
// Wake up after 5s
// Hi! I am Hank
// Eat supper
\`\`\`

## 分析

- 链式调用：每个方法返回 this。
- 任务队列：把每个操作当任务入队，最终统一执行。
- sleepFirst 优先级最高 → 插入队首。
- 同步任务直接执行，异步任务（sleep）用 setTimeout。

## 实现

\`\`\`js
class _LazyMan {
  constructor(name) {
    this.tasks = []
    this.tasks.push(() => {
      console.log('Hi! I am ' + name)
      this.next()
    })
    setTimeout(() => this.next())
  }

  next() {
    const task = this.tasks.shift()
    if (task) task()
  }

  eat(food) {
    this.tasks.push(() => {
      console.log('Eat ' + food)
      this.next()
    })
    return this
  }

  sleep(seconds) {
    this.tasks.push(() => {
      setTimeout(() => {
        console.log('Wake up after ' + seconds + 's')
        this.next()
      }, seconds * 1000)
    })
    return this
  }

  sleepFirst(seconds) {
    this.tasks.unshift(() => {
      setTimeout(() => {
        console.log('Wake up after ' + seconds + 's')
        this.next()
      }, seconds * 1000)
    })
    return this
  }
}

function lazyMan(name) {
  return new _LazyMan(name)
}
\`\`\`

## 关键点

1. 任务队列 + next 链式触发：每个任务末尾调用 next 驱动下一个，类似中间件机制。
2. 异步启动：构造函数用 setTimeout(() => this.next())，让链式调用全部入队后才开始执行。
3. sleepFirst 用 unshift 插队首。
4. 异步任务在 setTimeout 回调里调 next，保证顺序。

## 进阶：Promise 化

\`\`\`js
class _LazyManP {
  constructor(name) {
    this.queue = [() => {
      console.log('Hi! I am ' + name)
      return Promise.resolve()
    }]
    setTimeout(async () => {
      for (const fn of this.queue) await fn()
    })
  }
  eat(food) {
    this.queue.push(() => {
      console.log('Eat ' + food)
      return Promise.resolve()
    })
    return this
  }
  sleep(s) {
    this.queue.push(() => new Promise((r) => setTimeout(r, s * 1000)))
    return this
  }
  sleepFirst(s) {
    this.queue.unshift(() => new Promise((r) => setTimeout(r, s * 1000)))
    return this
  }
}
function lazyMan(name) {
  return new _LazyManP(name)
}
\`\`\`

- 用 async/await 串行执行，更直观。

## 相似问题

- 链式调用 + 队列：jQuery 链式、Promise 链。
- 任务调度器：事件循环、中间件（Koa onion 模型）。`
  },
  {
    id: 'hw-015',
    category: 'handwriting',
    title: '手写 JSON.stringify / JSON.parse 简易版',
    difficulty: '困难',
    tags: ['JSON', 'stringify', 'parse', '手写'],
    answer: `## JSON.stringify 简易版

\`\`\`js
function jsonStringify(value) {
  if (value === null) return 'null'
  const type = typeof value
  if (type === 'undefined' || type === 'function' || type === 'symbol') return undefined
  if (type === 'boolean') return String(value)
  if (type === 'number') return Number.isFinite(value) ? String(value) : 'null'
  if (type === 'string') return quote(value)
  if (type === 'bigint') throw new TypeError('BigInt not serializable')
  if (value instanceof Date) return quote(value.toISOString())
  if (typeof value.toJSON === 'function') return jsonStringify(value.toJSON())

  if (Array.isArray(value)) {
    return '[' + value.map(v => jsonStringify(v) ?? 'null').join(',') + ']'
  }
  const pairs = []
  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) continue
    const v = jsonStringify(value[key])
    if (v === undefined) continue
    pairs.push(quote(key) + ':' + v)
  }
  return '{' + pairs.join(',') + '}'
}

// 字符串转义：用字符码构建反斜杠，避免源码中出现裸反斜杠
function quote(s) {
  const B = String.fromCharCode(92)
  let out = '"'
  for (const ch of s) {
    const code = ch.charCodeAt(0)
    if (ch === '"') out += B + '"'
    else if (ch === B) out += B + B
    else if (code === 10) out += B + 'n'
    else if (code === 9) out += B + 't'
    else if (code === 13) out += B + 'r'
    else out += ch
  }
  return out + '"'
}
\`\`\`

## 关键规则

1. undefined / function / symbol：作为值返回 undefined，作为数组元素变 null，作为对象属性被忽略。
2. NaN / Infinity → null。
3. Date → ISO 字符串。
4. RegExp / Error → {}。
5. 循环引用抛错。
6. toJSON 优先调用。
7. BigInt 抛 TypeError。
8. 键名会被字符串化。

## JSON.parse 简易版

完整 parser 较复杂（涉及词法 + 语法分析），这里实现一个递归下降版本：

\`\`\`js
function jsonParse(str) {
  let i = 0
  const B = String.fromCharCode(92)
  function isWS(c) {
    const code = c.charCodeAt(0)
    return code === 32 || code === 9 || code === 10 || code === 13
  }
  function skipWS() {
    while (i < str.length && isWS(str[i])) i++
  }
  function parseValue() {
    skipWS()
    const c = str[i]
    if (c === '{') return parseObject()
    if (c === '[') return parseArray()
    if (c === '"') return parseString()
    if (c === '-' || (c >= '0' && c <= '9')) return parseNumber()
    if (c === 't') { i += 4; return true }
    if (c === 'f') { i += 5; return false }
    if (c === 'n') { i += 4; return null }
    throw new SyntaxError('Unexpected token ' + c + ' at position ' + i)
  }
  function parseObject() {
    const obj = {}
    i++
    skipWS()
    if (str[i] === '}') { i++; return obj }
    while (true) {
      skipWS()
      const key = parseString()
      skipWS()
      if (str[i] !== ':') throw new SyntaxError('Expected :')
      i++
      obj[key] = parseValue()
      skipWS()
      if (str[i] === ',') { i++; continue }
      if (str[i] === '}') { i++; return obj }
      throw new SyntaxError('Expected , or }')
    }
  }
  function parseArray() {
    const arr = []
    i++
    skipWS()
    if (str[i] === ']') { i++; return arr }
    while (true) {
      arr.push(parseValue())
      skipWS()
      if (str[i] === ',') { i++; continue }
      if (str[i] === ']') { i++; return arr }
      throw new SyntaxError('Expected , or ]')
    }
  }
  function parseString() {
    if (str[i] !== '"') throw new SyntaxError('Expected "')
    i++
    let result = ''
    while (i < str.length && str[i] !== '"') {
      if (str[i] === B) {
        i++
        const next = str[i]
        if (next === 'n') result += String.fromCharCode(10)
        else if (next === 't') result += String.fromCharCode(9)
        else if (next === 'r') result += String.fromCharCode(13)
        else if (next === B) result += B
        else result += next
      } else {
        result += str[i]
      }
      i++
    }
    i++
    return result
  }
  function parseNumber() {
    let num = ''
    while (i < str.length && /[-+0-9.eE]/.test(str[i])) {
      num += str[i]
      i++
    }
    return Number(num)
  }
  const result = parseValue()
  skipWS()
  if (i < str.length) throw new SyntaxError('Unexpected trailing characters')
  return result
}
\`\`\`

## 替代方案

- eval('(' + str + ')')：能解析但不安全（任意代码执行）。
- new Function('return ' + str)()：同样不安全。

## 验证

\`\`\`js
jsonParse('{"a":1,"b":[2,3,true],"c":null}')
// { a: 1, b: [2, 3, true], c: null }
jsonStringify({ a: 1, b: [2, 3] })  // '{"a":1,"b":[2,3]}'
\`\`\`

## 关键点

1. 递归下降：每种类型一个解析函数。
2. 位置指针 i：贯穿整个解析过程。
3. 错误处理：非法字符 / 结构抛 SyntaxError。
4. 转义：字符串解析需处理反斜杠、引号、控制字符等转义。`
  },
  {
    id: 'hw-016',
    category: 'handwriting',
    title: '手写 Object.create / Object.assign',
    difficulty: '中等',
    tags: ['Object.create', '原型', '手写'],
    answer: `## Object.create

创建一个新对象，使用现有对象作为原型。

\`\`\`js
function create(proto, propertyObject) {
  function F() {}
  F.prototype = proto
  const obj = new F()
  if (propertyObject !== undefined && propertyObject !== null) {
    Object.defineProperties(obj, propertyObject)
  }
  return obj
}
\`\`\`

## 原理

1. 用一个临时构造函数 F，让其 prototype 指向传入的 proto。
2. new F() 创建的对象，__proto__ 就是 proto。
3. 借用构造函数实现原型继承，无需调用构造函数。

\`\`\`js
const proto = { greet() { return 'hi' } }
const obj = Object.create(proto)
obj.greet()         // 'hi'
Object.getPrototypeOf(obj) === proto  // true
\`\`\`

## 第二个参数：属性描述符

与 Object.defineProperties 一致：

\`\`\`js
const obj = Object.create({}, {
  x: { value: 1, writable: true, enumerable: true, configurable: true }
})
obj.x  // 1
\`\`\`

## Object.create(null) 的特殊用途

创建一个没有原型的干净对象（无 toString / hasOwnProperty 等方法）：

\`\`\`js
const map = Object.create(null)
map.key = 'value'
// 常用作纯净字典，避免原型属性干扰
\`\`\`

- 手写 create(null)：F.prototype = null，new F() 的对象 __proto__ 为 null。

## 手写 Object.assign

\`\`\`js
function assign(target, ...sources) {
  if (target == null) throw new TypeError('Cannot convert undefined or null to object')
  target = Object(target)
  for (const source of sources) {
    if (source == null) continue
    for (const key of Reflect.ownKeys(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}
\`\`\`

- 只拷贝可枚举自有属性。
- 浅拷贝。
- 原始类型 target 会被包装（如 string → String 对象）。

## 相关：手写 instanceof（见 hw-006）

原型链查找：

\`\`\`js
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left)
  while (proto !== null) {
    if (proto === right.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
\`\`\`

## 三者关联

| 方法 | 作用 |
| --- | --- |
| new | 创建实例 + 绑定原型 + 执行构造函数 |
| Object.create | 创建实例 + 绑定原型（不执行构造函数） |
| Object.assign | 浅合并可枚举属性 |

- new Constructor(...args) = Object.create(Constructor.prototype) + Constructor.call(obj, ...args)。
- Object.create 是实现原型继承的基础（class extends 的 super() 内部即 Object.create）。`
  }
]
