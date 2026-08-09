export const vueQuestions = [
  {
    id: 'vue-001',
    category: 'vue',
    title: 'Vue2 与 Vue3 的主要区别？',
    difficulty: '中等',
    tags: ['Vue2', 'Vue3', '响应式'],
    answer: `## 1. 响应式系统重写

- **Vue2**：基于 \`Object.defineProperty\`，对 data 的每个属性 getter/setter 劫持。
  - 缺点：无法监测对象属性的新增/删除（需 \`Vue.set\`）、无法监测数组索引/length 变化（需重写数组方法）、深度监听需递归遍历，初始化开销大。
- **Vue3**：基于 \`Proxy\` + \`Reflect\`，代理整个对象。
  - 优点：能监测属性增删、数组变化，惰性响应式（访问到才递归代理），性能更好。

## 2. Composition API

- Vue2 是 Options API（data/methods/computed/watch 分块）。
- Vue3 引入 Composition API（\`setup\` / \`<script setup>\`），逻辑可按功能聚合复用，TS 支持更好。

## 3. 性能优化

- 编译器静态分析提升：静态节点提升（hoistStatic）、patchFlag 标记动态节点，diff 时只比较动态部分。
- Block Tree：以结构指令为边界分块，减少 diff 范围。
- Tree-shaking：按需引入 API，打包体积更小。

## 4. 新特性

- Teleport（传送门）、Suspense（异步组件）、Fragment（多根节点）、\`<script setup>\` 语法糖。
- 自定义渲染器（custom renderer），可渲染到非 DOM 目标（Canvas、小程序）。

## 5. TypeScript

Vue3 源码用 TS 重写，类型支持一流；Vue2 需借助 vue-class-component / vue-property-decorator。

## 6. 生命周期

\`beforeCreate/created\` → 用 \`setup\` 替代；其余加 \`on\` 前缀（\`mounted\` → \`onMounted\`）。

## 7. 多根节点

Vue3 模板支持多根节点（Fragment），Vue2 必须单根。`
  },
  {
    id: 'vue-002',
    category: 'vue',
    title: 'Vue3 的响应式原理是怎样的？',
    difficulty: '困难',
    tags: ['响应式', 'Proxy', 'ref', 'reactive'],
    answer: `## 核心 API

- \`reactive(obj)\`：用 \`Proxy\` 把对象变成响应式。
- \`ref(value)\`：包装任意值（含原始类型）为响应式，通过 \`.value\` 访问；对象内部仍用 reactive。
- \`effect(fn)\`：注册副作用函数，内部用到的响应式数据变化时重新执行。

## 依赖收集与触发

### track（get 时收集）

Proxy 的 get 拦截器中调用 \`track(target, key)\`：以 \`target → key → effectSet\` 的三层结构（WeakMap → Map → Set）记录"谁依赖了这个属性"。当前正在执行的 effect 会被加入对应 Set。

### trigger（set 时触发）

Proxy 的 set 拦截器中调用 \`trigger(target, key)\`：从依赖映射中取出该 key 对应的 effect 集合，依次执行（调度器决定同步或异步批量）。

\`\`\`js
const handlers = {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return result
  }
}
\`\`\`

## 惰性代理

\`reactive\` 只代理对象第一层；当访问到嵌套对象属性时，在 get 中递归调用 \`reactive(child)\`，实现**惰性深度响应式**，避免初始化时全量遍历。

## effect 与调度

- 组件的渲染函数本身就是一个 effect（\`renderEffect\`），数据变化时重新渲染。
- \`computed\` 是带缓存的 effect：依赖未变时直接返回缓存值。
- \`watch\` 是带副作用的 effect。
- 调度器（scheduler）会把多个同步变更合并到一次微任务中批量更新，避免重复渲染。

## ref 为何需要 .value

原始类型无法被 Proxy 代理，ref 用一个对象 \`{ value: x }\` 包裹，\`.value\` 的 getter/setter 完成依赖收集与触发。模板中自动解包是为了书写便利。

## 与 Vue2 对比

| | Vue2 | Vue3 |
| --- | --- | --- |
| 劫持方式 | defineProperty | Proxy |
| 新增属性 | 需 Vue.set | 自动响应 |
| 数组 | 重写方法 | 原生支持 |
| 初始化 | 递归全量 | 惰性 |
| 性能 | 一般 | 更好 |`
  },
  {
    id: 'vue-003',
    category: 'vue',
    title: 'ref 和 reactive 有什么区别？何时用哪个？',
    difficulty: '中等',
    tags: ['ref', 'reactive', '响应式'],
    answer: `## reactive

- 接收**对象 / 数组**，返回 Proxy 代理的响应式对象（原对象的代理，不是新对象）。
- 对原始类型（string/number 等）无效，会被警告。
- 解构会**失去响应式**（解构出的是普通值），需用 \`toRefs\` / \`toRef\`。

\`\`\`js
const state = reactive({ count: 0 })
state.count++
\`\`\`

## ref

- 接收**任意类型**（含原始类型），返回 \`{ value }\` 包装对象，需通过 \`.value\` 访问。
- 传入对象时，内部会用 reactive 代理 \`.value\`。
- 解构 / 传递不会丢失响应式（因为传递的是 ref 对象本身）。

\`\`\`js
const count = ref(0)
count.value++
\`\`\`

## 模板中

- ref 在模板中**自动解包**，直接用 \`count\` 即可（无需 \`.value\`）。
- reactive 直接用 \`state.count\`。

## 何时用哪个

- **原始类型** → 必须用 ref。
- **对象 / 表单状态** → 两者皆可；reactive 更直观（无 .value）。
- **需要解构 / 传递 / 作为 composable 返回值** → 用 ref（或 reactive + toRefs）。
- **替换整个对象**（\`state = newObj\`）→ reactive 会丢失引用，ref 用 \`.value = newObj\` 更合适。

## 经验

- composable（自定义 hook）推荐返回 ref，避免解构丢失响应式。
- 大型表单 / 状态对象用 reactive 更清晰。
- 实际项目常混用：局部状态 reactive，跨组件 / 返回值 ref。`
  },
  {
    id: 'vue-004',
    category: 'vue',
    title: 'computed 和 watch 的区别与使用场景？',
    difficulty: '中等',
    tags: ['computed', 'watch', '侦听器'],
    answer: `## computed（计算属性）

- **有缓存**：依赖未变化时返回缓存值，多次访问只计算一次。
- **必须返回值**，用法像变量。
- **默认懒求值**：只有被访问时才计算。
- 适合**派生状态**：从已有响应式数据计算出新值。

\`\`\`js
const fullName = computed(() => firstName.value + lastName.value)
\`\`\`

可写 computed：

\`\`\`js
const fullName = computed({
  get: () => first.value + last.value,
  set: (v) => { [first.value, last.value] = v.split(' ') }
})
\`\`\`

## watch（侦听器）

- **无缓存**，数据变化时执行副作用。
- **不返回值**，用于"数据变化时做某事"（发请求、操作 DOM、本地存储等）。
- 可监听单个 / 多个源，可深度监听、立即执行。

\`\`\`js
watch(count, (newVal, oldVal) => {
  localStorage.setItem('count', newVal)
}, { immediate: true, deep: true })
\`\`\`

## watchEffect

- 类似 watch 但**无需指定依赖**，自动收集回调中用到的响应式数据。
- **立即执行一次**（首次同步运行以收集依赖）。
- 适合依赖多个数据且不关心旧值的副作用。

\`\`\`js
watchEffect(() => {
  console.log(count.value, name.value)  // 任一变化都重新执行
})
\`\`\`

## 对比

| | computed | watch | watchEffect |
| --- | --- | --- | --- |
| 缓存 | 有 | 无 | 无 |
| 返回值 | 有 | 无 | 无 |
| 依赖指定 | 自动收集 | 显式指定 | 自动收集 |
| 立即执行 | 懒 | 默认否（immediate） | 是 |
| 场景 | 派生状态 | 副作用 + 需旧值 | 副作用 |

## 选择

- 需要基于现有数据算出新值 → computed。
- 数据变化需要触发副作用 → watch / watchEffect。
- watchEffect 适合"多依赖、不关心旧值"的副作用，watch 适合需要新旧值或异步副作用。`
  },
  {
    id: 'vue-005',
    category: 'vue',
    title: 'Vue 组件间通信有哪些方式？',
    difficulty: '中等',
    tags: ['组件通信', 'props', 'emit', 'provide'],
    answer: `## 1. 父→子：props

\`\`\`vue
<!-- 父 -->
<Child :msg="text" />
<!-- 子 -->
<script setup>
const props = defineProps(['msg'])
</script>
\`\`\`

## 2. 子→父：emit 自定义事件

\`\`\`vue
<!-- 子 -->
<script setup>
const emit = defineEmits(['update'])
emit('update', data)
</script>
<!-- 父 -->
<Child @update="handleUpdate" />
\`\`\`

## 3. 双向绑定 v-model

Vue3 支持多个 v-model，本质是 prop + emit 的语法糖：

\`\`\`vue
<Child v-model:title="title" v-model:open="open" />
\`\`\`

## 4. 跨层级：provide / inject

祖先提供，后代注入，适合深层嵌套：

\`\`\`js
// 祖先
provide('theme', themeRef)
// 后代
const theme = inject('theme')
\`\`\`

> 建议提供只读 ref 或带 symbol key，并配合 TypeScript 的 InjectionKey 类型化。

## 5. 事件总线（小型项目）

Vue3 移除了 \$on/\$emit，可用 mitt / tiny-emitter 等第三方库实现。中大型项目不推荐，难追踪。

## 6. 状态管理：Pinia

跨组件、跨页面共享状态的最佳方案：

\`\`\`js
const store = useUserStore()
store.count++
\`\`\`

- 支持 Composition API 风格、TS 友好、支持模块化、DevTools 集成。

## 7. ref / \$refs（命令式）

父组件通过 ref 直接调用子组件暴露的方法（子组件需 \`defineExpose\`）：

\`\`\`js
const childRef = ref()
childRef.value.someMethod()
\`\`\`

## 选择原则

- 父子：props / emit / v-model。
- 祖孙深层：provide / inject。
- 全局共享：Pinia。
- 偶尔需要命令式：ref + defineExpose。`
  },
  {
    id: 'vue-006',
    category: 'vue',
    title: 'Vue 的生命周期钩子有哪些？',
    difficulty: '简单',
    tags: ['生命周期', '钩子'],
    answer: `## Vue3（Composition API）生命周期

| Options API | Composition API | 说明 |
| --- | --- | --- |
| beforeCreate | setup() 替代 | 实例创建前 |
| created | setup() 替代 | 实例创建后，可访问响应式数据 |
| beforeMount | onBeforeMount | 挂载到 DOM 前 |
| mounted | onMounted | 挂载完成，可访问 DOM |
| beforeUpdate | onBeforeUpdate | 响应式数据变化、DOM 更新前 |
| updated | onUpdated | DOM 更新完成 |
| beforeUnmount | onBeforeUnmount | 组件卸载前（清理定时器、事件） |
| unmounted | onUnmounted | 组件卸载完成 |

## 调试钩子

- \`onRenderTracked\`：渲染时收集依赖触发。
- \`onRenderTriggered\`：渲染被重新触发时（用于定位更新来源）。

## 常见用法

\`\`\`js
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  window.addEventListener('resize', handler)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handler)
})
\`\`\`

## 父子组件执行顺序

- 挂载：父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted。
- 更新：父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated。
- 卸载：父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted。

## 注意

- \`setup\` 在 beforeCreate 之前执行，此时还没有 this。
- \`onMounted\` 中可安全操作 DOM；\`onUpdated\` 中避免直接修改数据，否则可能死循环。`
  },
  {
    id: 'vue-007',
    category: 'vue',
    title: 'Vue 的虚拟 DOM 与 diff 算法是怎样的？',
    difficulty: '困难',
    tags: ['虚拟DOM', 'diff', '编译优化'],
    answer: `## 虚拟 DOM

用一个普通 JS 对象（VNode）描述真实 DOM 结构，数据变化时先对比新旧 VNode，计算出最小变更，再批量更新真实 DOM，减少直接 DOM 操作。

\`\`\`js
{ tag: 'div', props: { class: 'box' }, children: [...] }
\`\`\`

## diff 策略（同级比较）

为降低复杂度（O(n³) → O(n)），Vue 的 diff 采用：

1. **只比较同层节点**，不跨层比较。
2. **类型相同才复用**：标签或组件类型变了，直接替换整棵子树。
3. **key 优化列表 diff**：通过 key 识别节点身份，复用与移动。

## 列表 diff（核心算法）

对新旧两组子节点，采用**双端 + 最长递增子序列（LIS）**：

- 头头、尾尾、头尾、尾头四种快速匹配。
- 剩余部分用 key 建立 Map，找出"新节点中需要移动的最少节点"——即求**最长递增子序列**，LIS 中的节点保持不动，其余按需移动 / 插入 / 卸载。

## Vue3 编译优化

Vue3 利用编译期信息进一步优化 diff：

- **PatchFlag**：编译时标记每个 vnode 的动态部分（class/style/text/props/...），运行时 diff 只对比动态部分。
- **Block Tree**：以 v-if/v-for 等结构指令为边界划分 block，block 内的动态节点被收集到 \`dynamicChildren\`，diff 时只遍历动态节点数组，跳过静态节点。
- **静态提升（hoistStatic）**：静态节点 / 属性被提到 render 函数外，复用同一对象，避免重复创建。
- **缓存事件处理函数**：\`cacheHandlers\` 避免内联函数每次渲染都新建，减少子组件无谓更新。

## 与 React 的差异

React diff 是单向从左到右 + key 标记；Vue3 借助编译期信息，对静态内容跳过、对动态内容精准比对，理论上在模板场景下性能更优。`
  },
  {
    id: 'vue-008',
    category: 'vue',
    title: 'v-if 和 v-for 一起使用有什么问题？优先级如何？',
    difficulty: '简单',
    tags: ['v-if', 'v-for', '指令'],
    answer: `## 不建议一起用

\`v-if\` 和 \`v-for\` 同时作用于同一元素时，会带来性能和正确性问题。

## 优先级

- **Vue2**：\`v-for\` 优先级高于 \`v-if\`，即每次渲染都会先遍历所有元素再判断 v-if，浪费性能。
- **Vue3**：\`v-if\` 优先级高于 \`v-for\`，意味着 v-if 中**无法访问 v-for 的循环变量**，会报错或逻辑错误。

## Vue3 的坑

\`\`\`vue
<!-- ❌ Vue3 中 item 在 v-if 时还未定义 -->
<li v-for="item in list" v-if="item.active">{{ item.name }}</li>
\`\`\`

## 正确做法

### 1. 用计算属性预先过滤

\`\`\`js
const activeList = computed(() => list.value.filter(i => i.active))
\`\`\`

\`\`\`vue
<li v-for="item in activeList">{{ item.name }}</li>
\`\`\`

### 2. 用 template 包裹 v-for，内部 v-if

\`\`\`vue
<template v-for="item in list" :key="item.id">
  <li v-if="item.active">{{ item.name }}</li>
</template>
\`\`\`

### 3. 控制整列表显隐用外层 v-if

\`\`\`vue
<ul v-if="show">
  <li v-for="item in list">{{ item.name }}</li>
</ul>
\`\`\`

## 规范

- ESLint 的 \`vue/no-v-if-with-v-for\` 规则会直接禁止同元素混用。
- 永远优先用计算属性过滤，逻辑清晰且只算一次。`
  },
  {
    id: 'vue-009',
    category: 'vue',
    title: 'Vue3 中 keep-alive 的作用与原理？',
    difficulty: '中等',
    tags: ['keep-alive', '缓存', '组件'],
    answer: `## 作用

\`<keep-alive>\` 包裹动态组件 / 路由组件，**缓存不活动的组件实例**而非销毁，再次进入时复用实例与状态，避免重复渲染，提升性能。

\`\`\`vue
<router-view v-slot="{ Component }">
  <keep-alive :include="['UserList', 'Detail']" :max="10">
    <component :is="Component" />
  </keep-alive>
</router-view>
\`\`\`

## 属性

- \`include\` / \`exclude\`：字符串、正则或数组，按组件 name 匹配。
- \`max\`：最大缓存数，超出按 LRU（最近最少使用）淘汰。

## 缓存组件的额外生命周期

被缓存的组件会多出两个钩子：

- \`onActivated\`：从缓存激活时调用。
- \`onDeactivated\`：被缓存（ deactivate ）时调用，代替 onUnmounted。

## 原理

- keep-alive 自身不渲染 DOM，是抽象组件。
- 内部维护一个 \`cache\`（Map）和 \`keys\`（Set）。
- 组件切换时，render 函数获取内部 vnode：
  - 若 name 匹配 include 且已在缓存中 → 取出缓存实例复用。
  - 否则创建新实例，并放入 cache。
- 卸载时不是真正销毁，而是调用 \`deactivate\` 将组件从 DOM 移除但保留实例；激活时 \`activate\` 重新挂载。
- 超过 max 时按 LRU 策略淘汰最久未访问的缓存。

## 使用场景

- 列表页 ↔ 详情页来回切换，保留滚动位置和筛选条件。
- Tab 切换保留各 Tab 状态。
- 表单多步填写。

## 注意

- 缓存过多会占用内存，配合 \`max\` 控制。
- 需要刷新数据的场景应在 \`onActivated\` 中重新请求，而非依赖组件重建。`
  },
  {
    id: 'vue-010',
    category: 'vue',
    title: 'Pinia 相比 Vuex 有什么优势？',
    difficulty: '中等',
    tags: ['Pinia', 'Vuex', '状态管理'],
    answer: `## Pinia 是什么

Vue 官方推荐的下一代状态管理库，Vuex 5 的精神继任者，专为 Composition API 设计。

## 优势

### 1. 更简洁的 API

- **移除 mutation**：可直接修改 state（\`store.count++\`），也可用 action 异步修改，不再需要 mutation 中转。
- 同时支持 Options 与 Composition 两种 store 写法。

\`\`\`js
export const useCounter = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})
\`\`\`

### 2. 完美的 TypeScript 支持

- 天然类型推导，无需繁琐的类型声明（Vuex4 的类型一直是痛点）。
- state / getter / action 自动推断。

### 3. 模块化更直观

- 每个 store 独立定义，扁平结构，无需 modules 嵌套和 namespaced。
- store 之间可互相 import 调用。

### 4. 更小的体积

约 1KB，比 Vuex 小很多，且支持 tree-shaking。

### 5. DevTools 集成

支持时间旅行、状态快照、行动追踪。

### 6. SSR 友好

更简单的服务端状态注入。

### 7. 插件机制

支持插件扩展（持久化、订阅等）。

## 与 Vuex 对比

| | Vuex | Pinia |
| --- | --- | --- |
| mutation | 必须 | 不需要 |
| 模块 | 嵌套 modules + namespaced | 扁平，独立 store |
| TS 支持 | 较弱 | 优秀 |
| 体积 | 较大 | 极小 |
| Composition API | 适配 | 原生 |

## 迁移

新项目直接用 Pinia；Vue2 项目也可用 Pinia（兼容）。Vuex 进入维护模式。`
  },
﻿  {
    id: 'vue-011',
    category: 'vue',
    title: 'Composition API 和 Options API 如何取舍？',
    difficulty: '中等',
    tags: ['Composition API', 'Options API', 'setup'],
    answer: `## 两种风格

### Options API（选项式）

通过 data / methods / computed / watch / 生命周期等选项组织代码，Vue2 的经典写法。

\`\`\`js
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } },
  computed: { double() { return this.count * 2 } }
}
\`\`\`

### Composition API（组合式）

通过 setup 函数 / \`<script setup>\` 用函数组织代码，逻辑按功能聚合。

\`\`\`vue
<script setup>
import { ref, computed } from 'vue'
const count = ref(0)
const increment = () => count.value++
const double = computed(() => count.value * 2)
</script>
\`\`\`

## 核心差异

| | Options API | Composition API |
| --- | --- | --- |
| 组织方式 | 按选项类型分块 | 按功能逻辑聚合 |
| this | 组件实例 | 无 this（显式引用） |
| 逻辑复用 | mixins（易冲突） | 自定义 Hook（清晰） |
| TS 支持 | 较弱 | 优秀 |
| 学习曲线 | 低 | 略高 |

## Composition API 的优势

### 1. 逻辑复用更清晰

Options API 用 mixin 复用逻辑，存在命名冲突、来源不透明、多 mixin 难追溯等问题。Composition API 通过自定义 Hook（composable）显式导入返回值，来源清晰、无冲突。

\`\`\`js
function useCounter(initial = 0) {
  const count = ref(initial)
  const increment = () => count.value++
  return { count, increment }
}
const { count, increment } = useCounter(10)
\`\`\`

### 2. 相关逻辑聚合

同一功能的 state / method / watch / computed 可写在一起，而非散落在各选项中，大型组件更易维护。

### 3. 更好的 TS 与 tree-shaking

无 this 依赖，类型推导自然；API 按需引入，打包更小。

## Options API 仍有价值

- 小型 / 简单组件书写更快。
- 团队不熟悉 Composition API 时心智负担低。
- Vue2 老项目兼容。

## 取舍建议

- **新项目（Vue3）**：统一用 \`<script setup>\` + Composition API。
- **逻辑复用**：必用 composable。
- **大型组件**：Composition API 更易拆分。
- **老项目**：可渐进迁移，两者可在同一项目共存。

Vue3 不强制二选一，Options API 仍长期支持，但官方与新生态都倾向 Composition API。`
  },
  {
    id: 'vue-012',
    category: 'vue',
    title: 'computed 的工作原理与缓存机制是怎样的？',
    difficulty: '困难',
    tags: ['computed', '缓存', '响应式', 'effect'],
    answer: `## computed 的本质

computed 是一个**带缓存的、懒求值的 effect**。它基于 Vue 的响应式系统（reactive effect），在依赖变化时不会立即重算，而是标记为"脏"，等下次被访问时才重新计算。

## 核心机制：lazy effect + dirty flag

普通 \`effect(fn)\` 是立即执行并收集依赖；computed 用 \`effect(getter, { lazy: true })\`，**首次不执行**。内部维护：

- \`_value\`：缓存的计算结果。
- \`_dirty\`：是否需要重算（脏标记）。
- 一个 \`scheduler\`：依赖触发时调用。

\`\`\`js
function computed(getter) {
  let value, dirty = true
  const runner = effect(getter, {
    lazy: true,
    scheduler() { dirty = true }
  })
  return {
    get value() {
      if (dirty) {
        value = runner()
        dirty = false
      }
      return value
    }
  }
}
\`\`\`

## 缓存如何工作

1. **首次访问** \`computed.value\`：dirty 为 true → 执行 getter 得到 _value，dirty 置 false。期间 getter 内访问的响应式数据会把当前 computed 注册为依赖。
2. **依赖未变**再次访问：dirty 仍为 false → 直接返回 \`_value\`，**不重算**。即使访问一万次也只算一次。
3. **依赖变化**：触发 set → 调用 scheduler → dirty = true（**不立即重算**）。下次访问 \`computed.value\` 时才重算。

## 与组件渲染的联动

computed 自身被组件渲染函数（也是一个 effect）读取时，会建立"渲染 → computed → 数据"的依赖链：

- 数据变化 → computed 的 scheduler 标记 dirty 并触发渲染 effect 重新调度。
- 渲染时重新读取 computed.value → 若 dirty 则重算，否则用缓存。

## 多个 computed 链式依赖

\`c2\` 依赖 \`c1\`，\`c1\` 依赖 \`data\`：

- data 变化 → c1 scheduler 置脏 → 通知 c2 → c2 也置脏 → 通知渲染。
- 渲染读 c2 → c2 脏 → 读 c1 → c1 脏 → 重算 c1 → 重算 c2。

脏标记沿链传播，但只在被访问时才真正重算，避免无效计算。

## 可写 computed

\`\`\`js
const fullName = computed({
  get: () => first.value + ' ' + last.value,
  set: (v) => { [first.value, last.value] = v.split(' ') }
})
\`\`\`

get 走缓存机制，set 直接修改其依赖（会触发依赖的响应式更新）。

## 缓存的边界

- **依赖是响应式数据**才有缓存意义。若 getter 里用了非响应式变量，其变化不会触发重算。
- dirty 为 false 时直接返回，**不会再执行 getter**，因此也不会重复收集依赖。
- computed 不应有副作用（应保持纯函数），否则脏标记机制可能导致副作用执行次数与预期不符。

## 总结

| 特性 | 说明 |
| --- | --- |
| 懒求值 | 首次访问才计算 |
| 缓存 | dirty 为 false 期间返回旧值 |
| 触发 | 依赖变化只置脏，不立即重算 |
| 链式 | 脏标记沿依赖链传播 |
| 纯函数 | 不应产生副作用 |`
  },
  {
    id: 'vue-013',
    category: 'vue',
    title: 'defineProps / defineEmits / defineExpose 宏是什么？',
    difficulty: '中等',
    tags: ['宏', 'defineProps', 'defineEmits', 'defineExpose', 'script setup'],
    answer: `## 什么是编译器宏（macros）

\`defineProps\` / \`defineEmits\` / \`defineExpose\` / \`defineSlots\` / \`defineModel\` / \`withDefaults\` 是 Vue 编译器提供的**宏**：

- **无需导入**，在 \`<script setup>\` 中直接可用。
- **编译期处理**：编译时被替换为等价的 setup() 返回值 / 选项，运行时不存在。
- 只能在 \`<script setup>\` 顶层使用。

## defineProps：声明 props

\`\`\`vue
<script setup>
const props = defineProps(['msg', 'count'])

// 带类型与校验
const props = defineProps({
  msg: { type: String, required: true },
  count: { type: Number, default: 0 }
})
</script>
\`\`\`

TS 泛型声明（类型信息会生成等价运行时校验）：

\`\`\`vue
<script setup lang="ts">
const props = defineProps<{
  msg: string
  count?: number
}>()
</script>
\`\`\`

带默认值用 \`withDefaults\`：

\`\`\`js
const props = withDefaults(defineProps<{ msg?: string }>(), { msg: 'hi' })
\`\`\`

## defineEmits：声明事件

\`\`\`vue
<script setup>
const emit = defineEmits(['update', 'submit'])

// 带校验
const emit = defineEmits({
  update: (val) => typeof val === 'string'
})

// TS
const emit = defineEmits<{
  (e: 'update', val: string): void
  (e: 'submit'): void
}>()

emit('update', 'new')
</script>
\`\`\`

## defineExpose：暴露给父组件 ref

\`<script setup>\` 中默认组件实例**不暴露任何内部成员**（封闭更安全）。需要让父组件通过 ref 调用时，用 \`defineExpose\` 显式暴露：

\`\`\`vue
<!-- 子 -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
const reset = () => { count.value = 0 }
defineExpose({ count, reset })
</script>

<!-- 父 -->
<script setup>
import { ref, onMounted } from 'vue'
const child = ref()
onMounted(() => child.value.reset())
</script>
<template>
  <Child ref="child" />
</template>
\`\`\`

## defineModel：双向绑定语法糖（3.4+）

\`\`\`vue
<script setup>
const model = defineModel()
const title = defineModel('title')
</script>
\`\`\`

## defineSlots：声明插槽类型（TS）

\`\`\`vue
<script setup lang="ts">
defineSlots<{
  default(props: { item: any }): any
}>()
</script>
\`\`\`

## 宏的本质

编译后大致等价于：

\`\`\`js
export default {
  props: ['msg'],
  setup(__props, { expose, emit }) {
    expose({})
  }
}
\`\`\`

## 注意

- 宏**不是真实函数**，不能用 \`import\` 引入。
- 不能在条件 / 函数内部调用，必须在 \`<script setup>\` 顶层。
- 不要解构 \`defineProps\` 的返回值后再期望保持响应式（解构出的是普通值）；如需解构用 \`toRefs\`（或 3.5+ 的响应式 props 解构）。

Vue 3.5 起支持**响应式 props 解构**：\`const { msg } = defineProps()\` 解构后 \`msg\` 仍保持响应式（编译期转换）。`
  },
  {
    id: 'vue-014',
    category: 'vue',
    title: 'provide / inject 依赖注入的原理与使用？',
    difficulty: '中等',
    tags: ['provide', 'inject', '依赖注入', '组件通信'],
    answer: `## 作用

跨层级传递数据：祖先组件 \`provide\` 提供值，所有后代组件 \`inject\` 注入，无需逐层 props 透传。常用于主题、用户信息、国际化、表单上下文。

\`\`\`js
// 祖先
import { provide, ref } from 'vue'
const theme = ref('dark')
provide('theme', theme)

// 任意层级的后代
import { inject } from 'vue'
const theme = inject('theme', 'light')
\`\`\`

## 原理

- 组件实例上有一个 \`provides\` 对象。provide 时把 key/value 写入当前实例的 provides。
- Vue 在初始化实例时，会把 \`provides\` 指向**父实例 provides 的原型**（原型链），于是 inject 时若当前组件没提供该 key，会沿原型链向上找到祖先的 provides。
- inject 在 setup 中调用时，从当前实例的 \`provides\` 上取值，通过 key（字符串或 Symbol）匹配。
- 因为是原型链查找，**就近覆盖**：最近的 provide 会遮蔽上层。

## 提供响应式数据

直接 provide 一个 ref / reactive，后代修改会同步（注意这破坏了单向数据流，建议提供**修改方法**而非可变数据）：

\`\`\`js
const theme = ref('dark')
const toggleTheme = () => theme.value = theme.value === 'dark' ? 'light' : 'dark'
provide('theme', readonly(theme))
provide('toggleTheme', toggleTheme)

// 后代
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
\`\`\`

## 用 Symbol / InjectionKey 防冲突与类型化

key 用字符串可能与第三方冲突，推荐 Symbol：

\`\`\`js
import { inject, provide } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export const themeKey: InjectionKey<Ref<string>> = Symbol('theme')

provide(themeKey, ref('dark'))
const theme = inject(themeKey)
\`\`\`

## 应用级 provide

在 \`main.js\` 中 \`app.provide\`，全应用可注入：

\`\`\`js
const app = createApp(App)
app.provide('axios', instance)
\`\`\`

## 适用场景

| 场景 | 是否合适 |
| --- | --- |
| 主题 / i18n / 用户信息 | ✅ |
| 表单与内部字段通信 | ✅（如 el-form 与 el-form-item） |
| 跨多层组件共享只读配置 | ✅ |
| 替代全局状态管理 | ⚠️ 中大型项目仍建议 Pinia |
| 高频变化的细粒度状态 | ⚠️ 会触发所有注入者更新 |

## 注意

- inject 默认值只在祖先未 provide 时生效。
- 数据流单向：建议后代只读消费，通过祖先提供的方法修改。
- 与 Pinia 互补：provide/inject 适合**组件树局部**的上下文；全局应用状态用 Pinia。`
  },
  {
    id: 'vue-015',
    category: 'vue',
    title: '自定义指令（directives）的用法与场景？',
    difficulty: '中等',
    tags: ['指令', 'directives', 'v-focus', 'v-permission'],
    answer: `## 什么时候用自定义指令

指令用于**封装对底层 DOM 的复用逻辑**（聚焦、拖拽、权限按钮、懒加载、tooltip 等）。当逻辑主要操作 DOM 而非组件状态时，指令比组件更合适。

> 原则：能用组件实现的优先用组件；纯 DOM 行为复用才用指令。

## 钩子函数

\`\`\`js
const myDirective = {
  created(el, binding, vnode, prevVnode) {},
  beforeMount(el, binding) {},
  mounted(el, binding) {},
  beforeUpdate(el, binding) {},
  updated(el, binding) {},
  beforeUnmount(el, binding) {},
  unmounted(el, binding) {}
}
\`\`\`

最常用 \`mounted\` 与 \`updated\`，可简写为函数（同时作为 mounted/updated）：

\`\`\`js
const vFocus = { mounted: (el) => el.focus() }
const vFocus2 = (el) => el.focus()
\`\`\`

## binding 对象

\`\`\`js
{
  value: binding值,
  oldValue: 旧值,
  arg: 'foo',
  modifiers: { bar: true },
  instance: 组件实例,
  dir: 指令对象本身
}
\`\`\`

## 注册

### 全局

\`\`\`js
app.directive('focus', { mounted: (el) => el.focus() })
\`\`\`

### 局部（\`<script setup>\` 自动注册）

\`<script setup>\` 中以 \`vXxx\` 命名的变量会自动作为指令：

\`\`\`vue
<script setup>
const vFocus = { mounted: (el) => el.focus() }
</script>
<template>
  <input v-focus />
</template>
\`\`\`

## 典型示例

### 1. 自动聚焦

\`\`\`js
const vFocus = { mounted: (el) => el.focus() }
\`\`\`

### 2. 权限控制

\`\`\`js
const vPermission = {
  mounted(el, binding) {
    if (!hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  }
}
\`\`\`

### 3. 图片懒加载

\`\`\`js
const vLazy = {
  mounted(el, binding) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.src = binding.value
        io.unobserve(el)
      }
    })
    io.observe(el)
    el._io = io
  },
  unmounted(el) { el._io?.disconnect() }
}
\`\`\`

### 4. 防抖

\`\`\`js
const vDebounce = {
  mounted(el, binding) {
    let timer
    el.addEventListener('click', () => {
      clearTimeout(timer)
      timer = setTimeout(() => binding.value(), 300)
    })
  }
}
\`\`\`

## 注意事项

- 指令钩子在 \`<script setup>\` 中以 \`v\` 开头驼峰命名自动可用。
- 操作 DOM 时记得在 \`unmounted\` 清理事件监听 / 观察器 / 定时器。
- 指令可用于普通元素和组件根节点；用于组件时，作用于组件根 DOM。
- Vue3 移除了 Vue2 的 \`bind\` / \`inserted\` 等钩子名，改用与生命周期一致的命名。`
  },
  {
    id: 'vue-016',
    category: 'vue',
    title: 'Teleport 与 Suspense 内置组件的用法？',
    difficulty: '中等',
    tags: ['Teleport', 'Suspense', '内置组件', '异步组件'],
    answer: `## Teleport：传送门

把组件的 DOM 渲染到**指定的目标节点**下，但逻辑 / 数据仍属于当前组件。

### 场景

- 全屏 Modal / Dialog / Drawer。
- Toast / Notification。
- 全局 Tooltip。
- 避免父级 \`overflow: hidden\` / \`z-index\` / \`transform\`（transform 会创建新包含块，导致 fixed 失效）影响弹层定位。

### 用法

\`\`\`vue
<template>
  <button @click="show = true">open</button>
  <teleport to="body">
    <div v-if="show" class="modal">弹窗内容</div>
  </teleport>
</template>
\`\`\`

- \`to\`：CSS 选择器字符串或 DOM 元素，指定挂载目标。
- \`disabled\`：为 true 时不传送，留在原位。

\`\`\`vue
<teleport :to="target" :disabled="!moved">
  <Child />
</teleport>
\`\`\`

### 多个 Teleport 共享目标

会按顺序追加到目标节点下，后挂载的在后。

## Suspense：异步组件协调

用于处理**异步组件 / 异步 setup**，在等待期间显示 fallback（loading）。

### 基本用法

\`\`\`vue
<template>
  <Suspense>
    <template #default>
      <AsyncComp />
    </template>
    <template #fallback>
      <div>loading...</div>
    </template>
  </Suspense>
</template>
\`\`\`

### 异步 setup

子组件的 setup 可以是 async 函数：

\`\`\`js
export default {
  async setup() {
    const data = await fetch('/api').then(r => r.json())
    return { data }
  }
}
\`\`\`

### 事件

- \`resolve\`：异步完成。
- \`pending\`：进入等待。
- \`fallback\`：显示 fallback。

\`\`\`vue
<Suspense @resolve="onReady" @pending="onPending">
\`\`\`

### 错误处理

异步 setup 抛错会向上冒泡，可用 \`onErrorCaptured\` 捕获：

\`\`\`js
onErrorCaptured((err) => {
  errorMsg.value = err.message
  return false
})
\`\`\`

## 注意

- Suspense 目前仍是**实验性**特性，API 可能调整。
- Teleport 的目标节点需在挂载时已存在。
- Teleport 不改变组件的父子逻辑关系，props / emits / provide-inject 仍按组件树（而非 DOM 树）工作。`
  },
  {
    id: 'vue-017',
    category: 'vue',
    title: 'v-model 的原理与组件 v-model？',
    difficulty: '中等',
    tags: ['v-model', '双向绑定', '组件通信'],
    answer: `## 原生表单元素上的 v-model

v-model 是**语法糖**，本质是 \`:value\` + \`@input\`（不同元素事件不同）。

\`\`\`vue
<input v-model="text" />
<!-- 等价 -->
<input :value="text" @input="text = \$event.target.value" />
\`\`\`

| 元素 | 绑定属性 | 监听事件 |
| --- | --- | --- |
| input / textarea | value | input |
| checkbox | checked | change |
| radio | checked | change |
| select | value | change |

checkbox 绑定数组时，Vue 自动 push / remove 项。

## 组件上的 v-model（Vue3）

组件 v-model 是 \`modelValue\` prop + \`update:modelValue\` emit 的语法糖。

\`\`\`vue
<!-- 父 -->
<CustomInput v-model="text" />
<!-- 等价 -->
<CustomInput :modelValue="text" @update:modelValue="text = \$event" />

<!-- 子 CustomInput.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', \$event.target.value)"
  />
</template>
\`\`\`

## 多个 v-model

Vue3 支持给同一组件绑定多个 v-model，通过参数区分：

\`\`\`vue
<UserForm v-model:name="name" v-model:age="age" />
\`\`\`

## v-model 的修饰符

### 内置修饰符

- \`.lazy\`：同步 input 改为 change 事件。
- \`.number\`：自动转 Number。
- \`.trim\`：去首尾空格。

### 自定义修饰符（组件 v-model）

\`\`\`vue
<CustomInput v-model.capitalize="text" />
\`\`\`

\`\`\`js
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) return value.charAt(0).toUpperCase() + value.slice(1)
    return value
  }
})
\`\`\`

## Vue 3.4+：defineModel 宏

\`\`\`vue
<script setup>
const model = defineModel()
model.value = 'new'
</script>
<template>
  <input v-model="model" />
</template>
\`\`\`

带参数：\`const title = defineModel('title')\`；带默认值与类型：\`defineModel({ default: '', type: String })\`。

## 与 Vue2 的区别

| | Vue2 | Vue3 |
| --- | --- | --- |
| 默认 prop | value | modelValue |
| 默认事件 | input | update:modelValue |
| 多 v-model | 不支持（需 .sync） | 原生支持 v-model:xxx |
| 修饰符 | 仅内置 | 支持自定义 |`
  },
  {
    id: 'vue-018',
    category: 'vue',
    title: 'Vue Router 的导航守卫与原理？',
    difficulty: '中等',
    tags: ['Vue Router', '导航守卫', '路由', '原理'],
    answer: `## 路由模式

- **Hash 模式**：URL 带 \`#\`，通过 \`hashchange\` 事件监听，兼容性最好，不需要服务端配合。
- **History 模式**：使用 \`history.pushState\` / \`popstate\`，URL 干净，但需要服务端配置回退到 index.html（否则刷新 404）。
- **Memory 模式**：不操作 URL，用于 SSR / 测试。

## 导航守卫

### 全局守卫

\`\`\`js
const router = createRouter({})

router.beforeEach((to, from) => {
  if (to.meta.auth && !isLogin()) return '/login'
})
router.beforeResolve((to, from) => {})
router.afterEach((to, from) => {})
\`\`\`

### 路由独享守卫

\`\`\`js
{ path: '/admin', beforeEnter: (to, from) => {} }
\`\`\`

### 组件内守卫

\`\`\`js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  if (hasUnsaved) return confirm('未保存，确定离开？')
})
onBeforeRouteUpdate((to, from) => {})
\`\`\`

Options 写法对应 \`beforeRouteEnter\` / \`beforeRouteUpdate\` / \`beforeRouteLeave\`。

## 完整导航解析流程

1. 导航被触发。
2. 在失活组件中调用 \`beforeRouteLeave\`。
3. 调用全局 \`beforeEach\`。
4. 在重用的组件里调用 \`beforeRouteUpdate\`。
5. 调用路由配置中的 \`beforeEnter\`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 \`beforeRouteEnter\`。
8. 调用全局 \`beforeResolve\`。
9. 导航被确认。
10. 调用全局 \`afterEach\`。
11. 触发 DOM 更新 / 组件挂载。
12. 调用 \`beforeRouteEnter\` 中传给 next 的回调。

## 守卫的返回值

- \`return false\`：取消导航。
- \`return '/path'\`：重定向。
- \`return { path, replace: true }\`：重定向并替换。
- \`throw\` 或 \`return Promise.reject\`：导航失败，可被 \`router.onError\` 捕获。
- 不返回 / \`return true\`：放行。

Vue Router 4 推荐**返回值**而非 \`next\` 回调（\`next\` 仍兼容但不推荐）。

## 路由原理

- **Hash**：监听 \`window\` 的 \`hashchange\`，通过 \`location.hash\` 改变 URL，匹配路由表渲染组件。
- **History**：调用 \`history.pushState(state, '', url)\` 改变 URL 不刷新页面；监听 \`popstate\` 处理前进 / 后退。pushState 不会触发 popstate，需 router 自己接管并触发匹配。
- Router 内部维护 \`currentRoute\` 响应式对象，匹配后更新 \`<router-view>\` 渲染的组件。
- 路由匹配基于 \`path-to-regexp\`，支持动态参数（\`:id\`）、嵌套子路由、命名视图。

## 数据获取

- **导航完成前获取**：在 \`beforeEnter\` / \`beforeRouteEnter\` 中 await，等数据到位再进入。
- **导航完成后获取**：在 \`onMounted\` / \`watch(route)\` 中请求，先展示骨架屏再填充（推荐）。

## 注意

- 守卫中避免同步阻塞太久；异步操作用 \`async\` 函数返回 Promise。
- \`beforeRouteEnter\` 中无法访问 \`this\`（组件还未创建），需用 \`next(vm => {})\` 访问实例。
- 滚动行为用 \`router.scrollBehavior(to, from, savedPosition)\` 控制。`
  },
  {
    id: 'vue-019',
    category: 'vue',
    title: 'Vue3 的 Teleport 和 Suspense 内置组件是什么？',
    difficulty: '中等',
    tags: ["Teleport","Suspense","内置组件"],
    answer: `## Teleport（传送门）

将组件内容渲染到 DOM 中的其他位置，脱离当前组件的 DOM 层级。

\`\`\`html
<!-- 渲染到 body 根节点 -->
<Teleport to="body">
  <ModalDialog />
</Teleport>

<!-- 动态目标 -->
<Teleport :to="containerRef">
  <Tooltip />
</Teleport>
\`\`\`

### 适用场景

- 模态框、弹窗：需要避开父组件的 \`overflow: hidden\` 或 z-index 层叠上下文。
- Toast / 通知组件：渲染到 body 顶层，便于全局定位。
- 全局 Popover：避免被祖先元素裁切。

### 注意

- 挂载时，目标节点必须已存在（条件渲染时需用 \`<template>\` 包裹或确保目标存在）。
- SSR 下 Teleport 的 \`to\` 必须在客户端渲染后才能使用（服务端没有 DOM）。
- Teleport 只是移动 DOM 节点，组件的父子关系、生命周期不变。

## Suspense（悬念）

协调异步依赖的渲染状态，等待子树加载完成后再展示，可配合异步组件使用。

\`\`\`html
<Suspense>
  <template #default>
    <AsyncPage />
  </template>
  <template #fallback>
    <Loading />
  </template>
</Suspense>
\`\`\`

### 异步组件

\`\`\`js
const AsyncPage = defineAsyncComponent(() => import('./HeavyPage.vue'))
\`\`\`

### 特点

- 多个异步组件嵌套时，Suspense 会等待所有后代都就绪才渲染。
- Suspense 内部发生错误会冒泡到最近的错误处理（ErrorBoundary）。
- Vue3 的 Suspense 主要用于异步组件，不像 React 还支持数据 fetch 挂起。

### 实际应用

- 路由懒加载：\`() => import('./Page.vue')\` 配合 Suspense 显示 loading。
- 大型组件按需加载：把重型依赖（图表、富文本）做成异步组件。
- 骨架屏：在 fallback 中显示骨架屏。`
  },
  {
    id: 'vue-020',
    category: 'vue',
    title: 'Vue3 的 keep-alive 缓存机制？',
    difficulty: '中等',
    tags: ["keep-alive","缓存","生命周期"],
    answer: `## 作用

缓存被包裹组件的实例，在组件切换时不会销毁而是保留状态，再次进入时直接复用缓存。

\`\`\`html
<keep-alive include="Home,Profile" :max="10">
  <router-view />
</keep-alive>
\`\`\`

## 工作原理

1. \`<keep-alive>\` 内部用 \`Map\`（\`key → VNode\`）缓存组件实例。
2. 切换组件时，被包裹组件的 \`deactivated\` 钩子触发（而非 \`unmounted\`）。
3. 再次进入时，从缓存中取出 VNode，触发 \`activated\` 钩子。
4. \`include\` / \`exclude\`：按组件名白/黑名单过滤（正则、数组、逗号分隔字符串均可）。
5. \`max\`：最大缓存数，超过后用 LRU（最近最少使用）淘汰最旧的缓存。

## 生命周期钩子

| 钩子 | 时机 |
| --- | --- |
| \`activated\` | 被缓存组件激活时（首次挂载 + 每次从缓存恢复） |
| \`deactivated\` | 被缓存组件失活时（切换走但未销毁） |
| \`onMounted\` | 仅首次挂载触发一次 |
| \`onUnmounted\` | 真正从缓存中移除时才触发 |

## 应用场景

- 列表页 → 详情页 → 返回：列表页滚动位置、筛选条件保留。
- Tab 切换：每个 Tab 的表单状态保留，不用重新填写。
- 复杂表单跨步骤保存状态。

## 注意

- \`keep-alive\` 缓存的是组件实例，内存占用较高，不适合大量组件。
- 动态组件（\`<component :is="...">\`）必须配合 \`keep-alive\` 才会缓存。
- 缓存组件的全局事件监听、定时器不会因 \`deactivated\` 自动清理，需要在 \`onDeactivated\` 中手动处理。
- SSR 环境下 \`keep-alive\` 仅在客户端生效。`
  },
  {
    id: 'vue-021',
    category: 'vue',
    title: 'Vue3 自定义指令（Directives）的原理与实践？',
    difficulty: '中等',
    tags: ["指令","Directive","自定义"],
    answer: `## 什么是自定义指令

Vue 允许注册自定义指令，用于对 DOM 元素进行直接操作。内置指令如 \`v-if\`、\`v-for\`、\`v-model\` 是框架提供的，自定义指令让你能封装自己的 DOM 行为。

## 注册方式

### 局部注册

\`\`\`js
export default {
  directives: {
    focus: {
      mounted(el) { el.focus() }
    }
  }
}
\`\`\`

### 全局注册

\`\`\`js
app.directive('focus', {
  mounted(el) { el.focus() }
})
\`\`\`

## 钩子函数

\`\`\`js
const myDirective = {
  created(el, binding, vnode) {},
  beforeMount(el, binding) {},
  mounted(el, binding) {},
  beforeUpdate(el, binding) {},
  updated(el, binding) {},
  beforeUnmount(el, binding) {},
  unmounted(el, binding) {}
}
\`\`\`

钩子参数：
- \`el\`：指令绑定的 DOM 元素。
- \`binding\`：\`value\`、\`oldValue\`、\`arg\`（参数，如 \`v-loading.full\` 的 \`full\`）、\`modifiers\`（修饰符）。

## 简写形式

只需要 \`mounted\` 和 \`updated\` 时可直接写函数：

\`\`\`js
app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
\`\`\`

## 常见应用

### 1. 自动聚焦

\`\`\`js
app.directive('focus', {
  mounted(el) { el.focus() }
})
\`\`\`

### 2. 点击外部关闭

\`\`\`js
app.directive('click-outside', {
  mounted(el, binding) {
    el._handler = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._handler)
  }
})
\`\`\`

### 3. 权限控制

\`\`\`js
app.directive('permission', {
  mounted(el, binding) {
    if (!hasPermission(binding.value)) el.remove()
  }
})
\`\`\`

## 注意事项

- 指令应**尽量避免**与组件的响应式逻辑耦合，保持原子性。
- 不要在指令中修改组件的响应式数据（会造成循环更新）。
- 指令在 SSR 下不会执行（没有 DOM），需在客户端生效。
- Vue3 指令的钩子与组件生命周期对齐，比 Vue2 的 \`bind/update/unbind\` 更清晰。`
  },
  {
    id: 'vue-022',
    category: 'vue',
    title: 'Vue3 的 Transition 与过渡动画？',
    difficulty: '中等',
    tags: ["Transition","动画","过渡"],
    answer: `## 概述

Vue 的 \`<Transition>\` 组件为元素或组件的插入/移除添加过渡动画，基于 CSS transition/animation 或 JavaScript 钩子实现。

## 基本用法

\`\`\`html
<Transition name="fade">
  <div v-if="show">Hello</div>
</Transition>
\`\`\`

### CSS 过渡类名

\`\`\`css
/* 进入/离开的过渡时长 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
/* 进入的起始状态 */
.fade-enter-from {
  opacity: 0;
}
/* 离开的结束状态 */
.fade-leave-to {
  opacity: 0;
}
\`\`\`

## 过渡类名的阶段

| 阶段 | 类名（name="fade"） |
| --- | --- |
| 进入起始 | \`fade-enter-from\` |
| 进入激活 | \`fade-enter-active\` |
| 进入完成 | \`fade-enter-to\` |
| 离开起始 | \`fade-leave-from\` |
| 离开激活 | \`fade-leave-active\` |
| 离开完成 | \`fade-leave-to\` |

## JavaScript 钩子

\`\`\`html
<Transition @before-enter="fn" @enter="fn" @after-enter="fn" @enter-cancelled="fn"
            @before-leave="fn" @leave="fn" @after-leave="fn" @leave-cancelled="fn">
</Transition>
\`\`\`

\`\`\`js
methods: {
  beforeEnter(el) { el.style.opacity = '0' },
  enter(el, done) {
    requestAnimationFrame(() => {
      el.style.opacity = '1'
      done()
    })
  }
}
\`\`\`

## 列表过渡（TransitionGroup）

\`\`\`html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</TransitionGroup>
\`\`\`

列表过渡需要处理**插入/删除时其他元素的位移**，用 \`v-move\` 类实现：

\`\`\`css
.list-move {
  transition: transform .3s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
\`\`\`

## 模式（mode）

控制进入/离开元素的时序：

- \`out-in\`：旧元素先离开，新元素再进入（默认）。
- \`in-out\`：新元素先进入，旧元素再离开。

\`\`\`html
<Transition mode="out-in" name="fade">
  <component :is="view" />
</Transition>
\`\`\`

## appear 属性

让组件在初始渲染时也应用过渡：

\`\`\`html
<Transition appear name="fade">
  <div>Initial render with animation</div>
</Transition>
\`\`\`

## 原理

\`<Transition>\` 本身不产生 DOM 节点，它通过监听子元素的 \`mounted\` / \`unmounted\` 钩子，在不同阶段添加/移除 CSS 类或调用 JS 钩子，从而实现过渡效果。`
  },
  {
    id: 'vue-023',
    category: 'vue',
    title: 'Pinia 状态管理的使用与原理？',
    difficulty: '中等',
    tags: ["Pinia","状态管理","Store"],
    answer: `## 什么是 Pinia

Pinia 是 Vue3 官方推荐的状态管理库，是 Vuex 5 的继任者，更轻量、类型友好。

## 创建 Store

\`\`\`js
import { defineStore } from 'pinia'

// Setup 写法（推荐，完整 TS 支持）
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, double, increment }
})

// Options 写法
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: { double: (state) => state.count * 2 },
  actions: { increment() { this.count++ } }
})
\`\`\`

## 使用

\`\`\`js
const counter = useCounterStore()
counter.increment()
console.log(counter.count, counter.double)
\`\`\`

## 核心特性

### 1. 组件式 API

Pinia Store 本质就是一个响应式对象，可在任意组件 / JS 中使用。

### 2. Getters（计算属性）

\`\`\`js
getters: {
  double: (state) => state.count * 2,
  message(state, getters) {
    return \`count is \${getters.double}\`
  }
}
\`\`\`

### 3. Actions（支持异步）

\`\`\`js
actions: {
  async fetchData() {
    this.loading = true
    try {
      const res = await api.getData()
      this.data = res
    } finally {
      this.loading = false
    }
  }
}
\`\`\`

### 4. State 持久化

\`\`\`js
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)

export const useSettingsStore = defineStore('settings', {
  state: () => ({ theme: 'light' }),
  persist: true
})
\`\`\`

## 与 Vuex 对比

| 特性 | Pinia | Vuex |
| --- | --- | --- |
| 学习曲线 | 简单 | 复杂（mutations/actions 分离） |
| TypeScript | 一流支持 | 需要较多类型声明 |
| 多 Store | 原生支持 | 需 modules |
| Actions | 直接操作 state | 必须通过 mutations |
| 体积 | ~1KB | ~10KB |

## 原理

- Pinia Store 基于 Vue3 的 \`reactive\` / \`ref\` 实现响应式。
- \`defineStore\` 创建一个返回 Store 实例的函数，首次调用时初始化 Store（注册到全局 Store Map）。
- 再次调用时直接返回已存在的实例，确保单例。
- 通过 \`$subscribe\` 可监听 state 变化，实现持久化、日志等插件能力。

## SSR 注意

- SSR 环境下每个请求需要独立的 Store 实例（避免跨请求污染）。
- \`const pinia = createPinia()\` 在服务端每个请求都要新建。`
  },
  {
    id: 'vue-024',
    category: 'vue',
    title: 'Vue3 的 provide / inject 依赖注入？',
    difficulty: '中等',
    tags: ["provide","inject","依赖注入"],
    answer: `## 概述

\`provide\` / \`inject\` 是 Vue3 提供的**跨层级组件通信**机制，祖先组件向后代组件注入依赖，无需逐层传递 props。

## 基本用法

### 祖先组件

\`\`\`js
import { provide, ref } from 'vue'

const theme = ref('light')
provide('theme', theme)

// 可注入多个值
provide('toggleTheme', () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
})
\`\`\`

### 后代组件

\`\`\`js
import { inject } from 'vue'

const theme = inject('theme')
const toggleTheme = inject('toggleTheme')

// 提供默认值
const config = inject('config', { timeout: 3000 })
\`\`\`

## 特点

- **跨层级**：祖先 → 任意后代，中间层级不需要参与。
- **响应式**：注入 \`ref\` / \`reactive\` 时保持响应性；注入原始值则是非响应式的。
- **单向数据流**：只有后代能从祖先获取，子组件不能反向修改祖先的 provide 值（推荐通过方法修改）。
- **最近祖先匹配**：多个祖先 provide 同名 key 时，后代取最近的。

## 使用 Symbol 作 Key（推荐）

\`\`\`js
// keys.js
export const ThemeKey = Symbol('theme')
export const UserKey = Symbol('user')

// 在祖先中
provide(ThemeKey, themeRef)

// 在后代中
const theme = inject(ThemeKey)
\`\`\`

用 Symbol 作 key 可避免命名冲突，适合大型项目。

## 与 props / emit 对比

| 特性 | props/emit | provide/inject |
| --- | --- | --- |
| 层级 | 父子直接通信 | 跨任意层级 |
| 类型安全 | props 有类型校验 | 需手动用 Symbol |
| 适用场景 | 常规父子 | 主题、全局配置、跨层级状态 |
| 替代方案 | - | 可用 Pinia / 全局事件总线 |

## 典型应用

### 1. 主题注入

\`\`\`js
// App.vue
provide('theme', themeRef)
// 任意后代组件
const theme = inject('theme')
\`\`\`

### 2. 表单注入（el-form / FormItem 模式）

\`\`\`js
// Form 组件
provide('form', formContext)
// FormItem 组件
const form = inject('form')
form.validateField(modelValue)
\`\`\`

## 注意

- provide/inject 不是状态管理的替代品，复杂全局状态仍用 Pinia。
- 注入的非响应式值（如普通对象、字符串）不会随祖先变化而更新。
- 推荐用 Symbol 作为 key，配合 TS 泛型实现类型安全。`
  },
  {
    id: 'vue-025',
    category: 'vue',
    title: 'Vue3 的 nextTick 作用与原理？',
    difficulty: '中等',
    tags: ['nextTick', '异步更新', '微任务'],
    answer: `## 作用

\`nextTick(cb)\` 把回调推迟到**下一次 DOM 更新循环之后**执行。当你修改了数据，想立即拿到更新后的 DOM（如测量高度、操作新插入的元素），就需要用它。

\`\`\`js
const list = ref([1, 2, 3])
list.value.push(4)
// 此时 DOM 还没更新
console.log(document.querySelectorAll('li').length) // 3

nextTick(() => {
  // DOM 已更新
  console.log(document.querySelectorAll('li').length) // 4
})
\`\`\`

\`nextTick\` 返回 Promise，可 \`await\`：

\`\`\`js
list.value.push(4)
await nextTick()
console.log(liRef.value.children.length)
\`\`\`

## 为什么需要

Vue 的响应式更新是**异步批量**的：同一事件循环内的多次数据变更会被合并，只在微任务阶段统一触发一次重渲染，避免频繁 DOM 操作。因此修改 state 后立即读 DOM，拿到的是旧值。

## 原理

1. 修改响应式数据 → trigger 触发对应 effect。
2. effect 不会立刻重渲染，而是通过**调度器（scheduler）**把渲染 job 放进一个队列，并去重。
3. 调度器用 \`Promise.resolve().then(flushJobs)\` 把队列执行推迟到**微任务阶段**（兼容降级为 MutationObserver / setImmediate / setTimeout）。
4. \`nextTick(cb)\` 也是把 \`cb\` 追加到同一个微任务队列（或 flush 之后的微任务），所以 cb 会在 DOM 更新后执行。

简化的调度：

\`\`\`js
let isFlushing = false
const queue = []

function queueJob(job) {
  if (!queue.includes(job)) queue.push(job)
  if (!isFlushing) {
    isFlushing = true
    Promise.resolve().then(flushJobs)
  }
}

function nextTick(fn) {
  const p = Promise.resolve()
  return fn ? p.then(fn) : p
}
\`\`\`

## 使用场景

- v-if/v-for 后操作新 DOM（测量滚动、设置焦点、操作 canvas）。
- 切换路由 / 显示弹窗后获取元素尺寸。
- 测试中等待 DOM 更新断言。

## 常见误区

- 不要滥用：大多数情况用 ref 模板引用 + onMounted / watch 即可。
- SSR 中没有 DOM，nextTick 仍可用但 DOM 相关操作无效。
- await nextTick() 比回调更推荐，避免回调地狱。`
  },
  {
    id: 'vue-026',
    category: 'vue',
    title: 'Vue3 的 watch 与 watchEffect 深度对比？',
    difficulty: '中等',
    tags: ['watch', 'watchEffect', '侦听器', '副作用'],
    answer: `## watch：显式指定依赖

需要明确写"侦听谁 + 回调"，支持拿到新旧值，默认懒执行。

\`\`\`js
// 侦听单个 ref
watch(count, (newV, oldV) => {
  console.log('count changed', oldV, '→', newV)
})

// 侦听 getter（reactive 里的字段）
watch(() => user.name, (n) => {})

// 侦听多个源
watch([a, b], ([newA, newB], [oldA, oldB]) => {})
\`\`\`

## watchEffect：自动收集依赖

不指定侦听谁，回调里用到的**所有响应式数据**都会被自动追踪；**立即执行一次**。

\`\`\`js
watchEffect(() => {
  console.log('user:', user.value.name, 'count:', count.value)
})
// 首次立即打印；user 或 count 变化时再次打印
\`\`\`

## 核心对比

| 特性 | watch | watchEffect |
| --- | --- | --- |
| 依赖指定 | 显式写第一个参数 | 自动收集回调中的依赖 |
| 执行时机 | 依赖变化后（immediate 可立即） | 首次同步执行 + 依赖变化 |
| 新值 / 旧值 | ✅ 都有 | ❌ 只有新值 |
| 懒执行 | ✅ 默认是（除非 immediate） | ❌ 首帧立即跑一次 |
| 失效清理 | onCleanup | onCleanup |
| 深度监听 | 对 reactive 默认深度，ref 需 deep:true | 访问到的嵌套属性都会追踪 |
| 适用 | 需要旧值、精确控制监听对象 | 多依赖副作用、数据同步 |

## 失效清理（onCleanup）

两者都支持：当上一次副作用被重新触发 / 组件卸载前，执行清理回调。常用于取消请求、防抖。

\`\`\`js
watchEffect((onCleanup) => {
  const ctrl = new AbortController()
  fetchData(userId.value, ctrl.signal)
  onCleanup(() => ctrl.abort())  // userId 变或卸载时取消
})
\`\`\`

## flush 时机

- \`flush: 'pre'\`（默认）：组件更新前执行，此时 DOM 还是旧的。
- \`flush: 'post'\`：组件更新后执行，可访问新 DOM（等价于 watchPostEffect）。
- \`flush: 'sync'\`：同步执行（谨慎，性能差）。

\`\`\`js
watch(id, cb, { flush: 'post' })
\`\`\`

## 停止侦听

手动调用返回的 stop 函数（组件卸载时自动停止）：

\`\`\`js
const stop = watchEffect(...)
stop()
\`\`\`

## 选择建议

1. 需要旧值、只关心一个具体字段变化 → **watch**。
2. 回调里用到多个响应式数据，想"任一变化都重跑" → **watchEffect**。
3. 需要操作更新后的 DOM → watch + flush:'post' 或 watchPostEffect。
4. 请求、订阅、定时器等副作用 → 优先 watchEffect + onCleanup。
5. reactive 对象深度变化 → watch 直接传 reactive 实例（默认 deep）。

## 陷阱

- watch 侦听 reactive 对象的字段时，必须用 getter：\`watch(() => obj.x, cb)\`，否则丢失响应式。
- 解构 reactive 后再 watch 会失效（解构是普通值），需 toRefs 或 getter。
- watchEffect 中如果有条件分支，只有执行到的分支里的数据会被追踪（条件变化后依赖可能变化）。`
  },
  {
    id: 'vue-027',
    category: 'vue',
    title: 'Vue3 的 shallowRef / shallowReactive 与 triggerRef？',
    difficulty: '困难',
    tags: ['shallowRef', 'shallowReactive', 'triggerRef', '性能优化'],
    answer: `## 为什么需要浅层响应式

大型对象（地图、图表配置、树形数据）做**全量深度代理**开销大。如果只关心对象整体的替换、不关心内部字段细粒度更新，Vue 提供了"浅层 API"来减少代理成本。

## shallowRef：只代理 .value 这一层

- 传入原始类型：行为和 ref 完全一样。
- 传入对象：**对象内部不是响应式的**，只有整体替换 \`.value = newObj\` 才触发更新。

\`\`\`js
const state = shallowRef({ count: 0 })

// ❌ 内部属性变化不触发
state.value.count++
console.log(state.value.count) // 1，但不重渲染

// ✅ 整体替换触发
state.value = { count: 1 }
\`\`\`

## shallowReactive：只代理对象第一层

第一层属性的读取/写入是响应式的，**嵌套对象不做 Proxy 代理**。

\`\`\`js
const state = shallowReactive({
  foo: 1,
  nested: { bar: 2 }
})

// ✅ 第一层变化触发
state.foo++

// ❌ 嵌套变化不触发
state.nested.bar++  // 改了但 UI 不更新
\`\`\`

## triggerRef：手动强制触发 shallowRef 更新

当你用 shallowRef 保存了一个大对象，又**偶尔想在不替换整体**的情况下通知依赖更新：

\`\`\`js
const bigData = shallowRef(getHugeTree())

// 直接改了内部某个节点
bigData.value.nodes[0].label = 'new'

// 手动通知：所有依赖 bigData 的 effect/computed/watch 重新执行
triggerRef(bigData)
\`\`\`

## 对比普通 API

| API | 代理深度 | 何时触发更新 | 适用场景 |
| --- | --- | --- | --- |
| ref | 对象内部用 reactive 全量代理 | .value 替换 + 内部任意字段变化 | 小型对象、需要细粒度 |
| shallowRef | 只代理 .value | 仅 .value 替换；或 triggerRef | 大对象、整体替换居多 |
| reactive | 递归全量 Proxy | 任意层字段变化 | 普通表单/状态 |
| shallowReactive | 仅第一层 Proxy | 第一层字段变化 | 扁平配置、第一层够用 |

## 配套工具

- \`isRef() / isReactive() / isProxy()\`：判断类型。
- \`toRaw()\`：拿到代理背后的原始对象（读大对象、与第三方库交互时用）。
- \`markRaw()\`：标记一个对象"永远不要被转成 proxy"，塞进 reactive 也保持原样（用于 DOM、第三方实例等）。

\`\`\`js
const chartInstance = markRaw(echarts.init(dom))
// chartInstance 不会被转成响应式，避免破坏第三方内部
\`\`\`

## 真实使用场景

1. **v-for 大列表每项是复杂对象**：用 shallowRef 存整体 + 替换数组引用触发，减少 Proxy 数。
2. **与不可变数据 (Immer) 配合**：每次 produce 返回新引用，shallowRef 检测到替换即更新。
3. **第三方库实例（ECharts、Leaflet、mapboxgl）**：markRaw 后塞进组件状态，避免响应式干扰实例。
4. **只读配置 / 常量**：用 shallowReactive 或直接 markRaw，节省代理开销。

## 注意

- shallow* 只有在明确需要性能优化、并确认内部不依赖深层响应式时才用，否则容易出现"改了没反应"的 bug。
- triggerRef 只对 shallowRef 生效；对 shallowReactive 手动触发可用 \`trigger(target, key)\`（内部 API，慎用）。
- 调试时可用 Vue Devtools 查看对象是否被浅层代理。`
  },
  {
    id: 'vue-028',
    category: 'vue',
    title: 'Vue3 自定义 Hook（Composable）的设计模式与最佳实践？',
    difficulty: '中等',
    tags: ['Composable', '自定义Hook', 'Composition API', '复用'],
    answer: `## 什么是 Composable

以 \`use\` 开头的函数，内部用 Composition API 封装可复用逻辑。Vue3 中替代 Vue2 的 mixins / HOC，来源清晰、命名无冲突、类型友好。

## 命名约定

文件与函数名统一 **useXxx** 前缀：\`useMouse\`、\`useDebounce\`、\`useFetch\`、\`useLocalStorage\`。通常每个文件导出一个 composable。

## 基本形态：返回值的三种风格

### 1. 返回对象（具名，推荐）

字段多、调用方只需要其中几个，解构时用哪个拿哪个。

\`\`\`js
// useCounter.js
export function useCounter(initial = 0) {
  const count = ref(initial)
  const inc = () => count.value++
  const reset = () => count.value = initial
  return { count, inc, reset }
}

// 使用
const { count, inc } = useCounter(10)
\`\`\`

### 2. 返回数组（类 useState）

字段少、位置语义清晰，便于在同一组件使用多个实例时重命名。

\`\`\`js
export function useToggle(initial = false) {
  const state = ref(initial)
  const toggle = () => state.value = !state.value
  return [state, toggle]
}

const [open, toggleOpen] = useToggle()
const [visible, toggleVisible] = useToggle(true)
\`\`\`

### 3. 传入选项对象，返回对象

复杂场景：

\`\`\`js
export function useFetch(url, options = {}) {
  const { immediate = true, transform = r => r } = options
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function execute(params) {
    loading.value = true
    try {
      const res = await fetch(params ? \`\${url}?\${new URLSearchParams(params)}\` : url)
      data.value = transform(await res.json())
    } catch (e) { error.value = e }
    finally { loading.value = false }
  }

  if (immediate) execute()
  return { data, loading, error, execute }
}
\`\`\`

## 设计原则

### 1. 纯逻辑，不绑定 UI

只返回状态 + 方法，不在 composable 内部渲染或操作全局 UI。

### 2. 副作用要清理

定时器、事件监听、订阅要返回清理函数，或在 onBeforeUnmount 中自动清理：

\`\`\`js
export function useEventListener(target, event, handler) {
  const remove = () => target.removeEventListener(event, handler)
  onMounted(() => target.addEventListener(event, handler))
  onBeforeUnmount(remove)
  return remove
}
\`\`\`

### 3. 接收响应式输入时用 watch / watchEffect

输入可能是 ref，变化时要重新计算：

\`\`\`js
export function useDebouncedValue(valueRef, delay = 300) {
  const debounced = ref(valueRef.value)
  let t
  watch(valueRef, (v) => {
    clearTimeout(t)
    t = setTimeout(() => debounced.value = v, delay)
  }, { immediate: true })
  onBeforeUnmount(() => clearTimeout(t))
  return debounced
}
\`\`\`

### 4. 无副作用的参数优先接收普通值 + 依赖数组，或直接 watch 传进来的 ref。

### 5. SSR 友好

访问 window/document 的部分包裹在 onMounted 或 \`if (typeof window !== 'undefined')\`。

## 常用组合模式

### 组合多个 composable

\`\`\`js
function useSearch() {
  const query = ref('')
  const debounced = useDebouncedValue(query, 300)
  const { data, loading } = useFetch(() => \`/api/search?q=\${debounced.value}\`, { immediate: false })
  watch(debounced, () => execute())
  return { query, data, loading }
}
\`\`\`

### 状态共享（简单版全局 Store）

在模块顶层创建一次，所有组件共享：

\`\`\`js
// useTheme.js (模块作用域单例)
const theme = ref(localStorage.getItem('theme') || 'light')
export function useTheme() {
  const toggle = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }
  return { theme, toggle }
}
\`\`\`

> 复杂状态仍推荐 Pinia（DevTools、插件、模块化）。

## 常见坑

1. **不要在条件/循环里调用 composable**：和 Hook 一样，必须在 setup 顶层（保证 watch / 生命周期注册顺序稳定）。
2. **返回值保持引用稳定**：方法用普通函数定义即可（ref 变化不影响函数引用），传给 memo 子组件时再按需 useCallback。
3. **避免命名冲突**：解构时用别名 \`const { data: user } = useFetchUser()\`。
4. **过度拆分**：只在真正需要复用时抽 composable；组件内一次性逻辑直接写在 \`<script setup>\` 即可。

## 生态

- **VueUse**：官方推荐的 composable 工具库（\`useMouse\`、\`useDebounce\`、\`useIntersectionObserver\` 等 200+ 实用函数），新项目直接依赖，减少重复造轮子。`
  },
  {
    id: 'vue-029',
    category: 'vue',
    title: 'Vue 编译优化：静态提升、PatchFlag、Block Tree、缓存事件？',
    difficulty: '困难',
    tags: ['编译优化', 'PatchFlag', 'hoistStatic', 'Block Tree', 'cacheHandlers'],
    answer: `## Vue3 编译器做了什么

\`template\` 会被 \`@vue/compiler-dom\` 编译成 render 函数。Vue3 在编译期能看到模板结构，因此可做大量**静态分析优化**，减少运行时 diff 开销（这是 Vue 比 React 更"开箱即用高性能"的原因）。

编译输出类似：

\`\`\`html
<template>
  <div>
    <span class="title">Hello</span>
    <span>{{ msg }}</span>
    <button @click="inc">+1</button>
  </div>
</template>
\`\`\`

编译后：

\`\`\`js
import { createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, openBlock as _openBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createElementVNode("span", { class: "title" }, "Hello", -1 /* HOISTED */)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _hoisted_1,
    _createElementVNode("span", null, _toDisplayString(_ctx.msg), 1 /* TEXT */),
    _createElementVNode("button", {
      onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.inc && _ctx.inc(...args)))
    }, "+1")
  ]))
}
\`\`\`

## 优化一：静态提升（hoistStatic）

把**永远不变**的节点/属性从 render 函数里提取出来，只在模块加载时创建一次，避免每次渲染都重新创建 VNode。

- 纯文本节点、纯静态属性、无子节点的静态元素 → 提升为模块级常量。
- 嵌套的纯静态子树整体提升。
- 带动态绑定的当然不提升。

效果：render 函数内创建对象更少，GC 压力降低。

## 优化二：PatchFlag（动态标记）

每个带动态部分的 VNode 都会带上一个位掩码数字，运行时 diff 可以**只检查被标记的那几项**，不用逐个属性/文本对比。

常见标记位：

| 值 | 含义 | 含义 |
| --- | --- | --- |
| 1 | TEXT | 只有文本子节点动态 |
| 2 | CLASS | class 动态 |
| 4 | STYLE | style 动态 |
| 8 | PROPS | 除 class/style 外的属性动态 |
| 16 | FULL_PROPS | 属性名本身也动态（如 \`:foo="bar"\` 且 foo 也来自变量） |
| 32 | HYDRATE_EVENTS | 带事件监听（SSR hydrate 用） |
| -1 | HOISTED / BAIL | 静态或退出优化模式 |

例子：

- \`<span>{{ msg }}</span>\` → flag = 1（只需对比文本）。
- \`<div :class="c" :style="s">\` → flag = 2 | 4 = 6（只对比 class/style）。

运行时 diff 时看到 flag=1 就只取新旧文本比较，其他属性跳过——O(1) 精准定位。

## 优化三：Block Tree（块树）

以带有**结构指令**（v-if、v-for、<template> 带指令等）的节点为边界，把模板切成若干 Block。每个 Block 收集其**所有后代的动态 VNode 到 dynamicChildren 数组**，diff 时直接**遍历 dynamicChildren**，整棵 Block 的静态部分全部跳过。

传统 diff：遍历整棵 VNode 树，递归每个元素。

Block Tree diff：只遍历 dynamicChildren（只含动态节点），数量少得多。只要结构没变（指令条件没导致 Block 内部形状变化），就沿用上一次的结构，快速定位。

为什么需要边界：v-if 切换会让"结构形状"变，所以要以它为边界切成独立 Block，各自维护自己的动态节点数组。

## 优化四：cacheHandlers（事件处理缓存）

模板中的内联事件如 \`@click="handle"\` 或 \`@click="() => open(x)"\`，每次 render 都会创建新的函数引用，传给子组件会破坏 memo。Vue3 开启 cacheHandlers 后，把事件函数缓存到 \`_cache\` 数组：

\`\`\`js
onClick: _cache[0] || (_cache[0] = (e) => _ctx.handle(e))
\`\`\`

首次渲染创建并存入 \`_cache[0]\`，后续渲染直接复用同一函数引用，保证引用稳定。

## 总结：四重优化如何协作

1. **hoistStatic**：减少 VNode 创建次数。
2. **PatchFlag**：每个 VNode 标记"哪里会变"，diff 只比对被标出来的部分。
3. **Block Tree**：把整棵树按稳定结构切块，每块只维护动态节点数组，跳过整段静态 DOM。
4. **cacheHandlers**：内联事件函数引用稳定，避免子组件无谓更新。

叠加效果：模板场景下 diff 几乎只做"必要的最小工作"，手写 render 函数反而吃不到这些优化（需要自己写 cloneVNode / 标记）。

## 实际影响

- **开发体验**：无需手动 useMemo / React.memo 就能获得不错的性能。
- **SSR hydrate**：PatchFlag + Block 让客户端 hydrate 可以直接定位要处理的节点，更快。
- **与手写 render/JSX 对比**：JSX 是动态的，编译器无法做这些静态推断，所以同逻辑 JSX 通常比 template 慢一些（Vue3 的 JSX 插件会尽量补一部分 flag）。

## 验证方式

打开 Vite/Vue CLI 的 Vue 插件，在浏览器 DevTools 看编译后的 render 函数，就能看到 hoisted 常量、PatchFlag、_cache 的使用。`
  },
  {
    id: 'vue-030',
    category: 'vue',
    title: 'Vue3 动态组件、异步组件与 defineAsyncComponent？',
    difficulty: '中等',
    tags: ['动态组件', '异步组件', 'defineAsyncComponent', '代码分割'],
    answer: `## 动态组件：<component :is="...">

根据运行时条件渲染不同组件，适合 Tab 切换、多步骤表单、内容区域切换。

\`\`\`vue
<script setup>
import Home from './Home.vue'
import Profile from './Profile.vue'
const current = ref('Home')
const tabMap = { Home, Profile }
</script>

<template>
  <button @click="current = 'Home'">Home</button>
  <button @click="current = 'Profile'">Profile</button>
  <component :is="tabMap[current]" />
</template>
\`\`\`

- \`:is\` 接收：组件选项对象 / 组件定义 / 字符串名（全局注册组件可用）。
- **配合 keep-alive**：切换时保留状态，避免重建。

\`\`\`html
<keep-alive>
  <component :is="currentTab" />
</keep-alive>
\`\`\`

## 异步组件：按需加载

把组件代码拆分成独立 chunk，需要时再加载（减少首屏体积）。

### 基础：动态 import

Vue3 直接识别返回 Promise 的组件定义：

\`\`\`js
const Admin = () => import('./Admin.vue')
\`\`\`

### defineAsyncComponent：增强能力

\`\`\`js
import { defineAsyncComponent } from 'vue'

const Admin = defineAsyncComponent({
  loader: () => import('./Admin.vue'),
  loadingComponent: Loading,
  errorComponent: ErrorView,
  delay: 200,        // 多久后显示 loading（避免快请求闪烁）
  timeout: 10000,    // 超时判定失败，显示 errorComponent
  suspensible: true, // 可被上层 Suspense 接管
  onError(error, retry, fail, attempts) {
    if (error.message.includes('fetch') && attempts <= 2) retry()
    else fail()
  }
})
\`\`\`

## 代码分割原理

Vite / Webpack 看到 \`import('./Xxx.vue')\` 这种动态导入，会自动把 Xxx.vue 及其依赖抽成**单独 chunk**（文件），首屏不下载。首次访问时浏览器才请求该 chunk，下载并解析后渲染。

配合路由做懒加载最常见：

\`\`\`js
// router.js
const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/admin', component: defineAsyncComponent({
      loader: () => import('./views/Admin.vue'),
      loadingComponent: Loading
    })
  }
]
\`\`\`

## 与 Suspense 配合

suspensible 开启后（默认），异步组件的加载期会冒泡到父 Suspense，父 Suspense 显示 fallback：

\`\`\`vue
<Suspense>
  <template #default>
    <Admin />  <!-- 里面可能嵌套多个异步组件 -->
  </template>
  <template #fallback>
    <AppLoading />
  </template>
</Suspense>
\`\`\`

与 Suspense 相比 loadingComponent 的区别：
- \`loadingComponent\` 作用在**单个异步组件**局部。
- Suspense 可以**等待一整棵子树**的多个异步组件 / async setup 全部就绪再展示。
- 两者不冲突：Suspense 没提供 fallback 时就走组件自己的 loading。

## 常见模式

### 1. 按用户权限异步加载后台模块

\`\`\`js
const modules = {
  admin: defineAsyncComponent({ loader: () => import('./admin/index.vue') }),
  user: defineAsyncComponent({ loader: () => import('./user/index.vue') })
}
const Role = modules[userRole.value]
\`\`\`

### 2. 重型图表 / 编辑器延迟加载

\`\`\`js
const MonacoEditor = defineAsyncComponent({
  loader: () => import('./MonacoEditor.vue'),
  loadingComponent: () => h('div', '编辑器加载中...'),
  delay: 100,
  timeout: 15000
})
\`\`\`

### 3. 加载失败后手动重试

\`\`\`js
const LazyComp = defineAsyncComponent({
  loader: () => import('./Lazy.vue'),
  onError(err, retry, fail, n) {
    n < 3 ? setTimeout(retry, 1000 * n) : fail()
  }
})
\`\`\`

## 注意事项

1. **首屏关键组件不要异步**：异步加载 = 首屏看到的更晚，首屏要同步或 SSR 直出。
2. **chunk 过小反而多请求**：合理用 Vite 的 build.rollupOptions.manualChunks 聚合。
3. **defineAsyncComponent 返回的是"组件包装器"**，传给 \`<component :is>\`、路由 component 都可直接用。
4. **SSR 中 loader 会在服务端同步执行**（因为要渲染出 HTML），异步在客户端 hydration 后才生效。
5. **全局注册**：\`app.component('Lazy', defineAsyncComponent(...))\` 也可以。

## 动态组件 vs 条件渲染 vs 路由

| 场景 | 方案 |
| --- | --- |
| 两块区域根据状态切换，有状态保留需求 | \<component> + keep-alive |
| 简单二选一切换、状态不关心 | v-if / v-show |
| 独立 URL、可分享链接、浏览器前进后退 | 路由懒加载 |
| 体积大、非首屏需要的组件 | defineAsyncComponent |
| 大型子树等待多个异步资源 + 统一 loading | Suspense + 异步组件 |`
  },
  {
    id: 'vue-031',
    category: 'vue',
    title: 'toRef / toRefs / toValue 与响应式解构丢失问题？',
    difficulty: '中等',
    tags: ['toRef', 'toRefs', 'toValue', '解构', '响应式'],
    answer: `## 问题：为什么解构 reactive 会丢响应式

\`\`\`js
import { reactive } from 'vue'

const state = reactive({ count: 0, name: 'vue' })

// ❌ 解构后丢失响应式（基本类型被拷贝出去）
let { count, name } = state
count++          // 改的是局部变量，视图不变
state.count++    // 才会触发更新
\`\`\`

原因：\`reactive\` 是对**对象**的 Proxy 代理，解构时基本类型属性被**值拷贝**出来，断开了与代理对象的引用。

\`ref\` 没这问题（解构出来还是 ref 对象，\`.value\` 访问），所以 \`setup\` 习惯 return ref。

## toRef：把对象的某个属性变成 ref

\`\`\`js
import { reactive, toRef } from 'vue'

const state = reactive({ count: 0 })
const count = toRef(state, 'count')   // 与 state.count 双向绑定
count.value++          // 等价于 state.count++
console.log(state.count)   // 1
\`\`\`

\`toRef\` 不创建新响应式，只是给已有属性套一个 ref 引用，**修改任一方都同步**。

## toRefs：把整个对象转成 ref 集合

\`\`\`js
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0, name: 'vue' })
const { count, name } = toRefs(state)   // ✅ 现在解构保持响应式

count.value++
console.log(state.count)   // 1
\`\`\`

\`toRefs\` 遍历对象每个属性，都生成一个 \`toRef\`，返回普通对象（每个属性是 ref）。**解构后每个变量都是 ref，要用 \`.value\`**。

模板里自动解包，所以 \`{{ count }}\` 直接用。

## 经典场景：Composable 返回值

\`\`\`js
// useUser.js
import { reactive, toRefs } from 'vue'

export function useUser() {
  const state = reactive({ user: null, loading: false, error: null })

  async function fetchUser(id) {
    state.loading = true
    try { state.user = await api.getUser(id) }
    catch (e) { state.error = e }
    finally { state.loading = false }
  }

  // ✅ 返回 toRefs，调用方解构后仍响应式
  return { ...toRefs(state), fetchUser }
}

// 使用
const { user, loading, fetchUser } = useUser()
\`\`\`

## toValue（Vue 3.3+）：归一化 ref / getter / 原始值

\`\`\`js
import { toValue, ref, computed } from 'vue'

const r = ref(1)
const g = () => 2
const v = 3

toValue(r)   // 1   ref → .value
toValue(g)   // 2   getter → 调用
toValue(v)   // 3   原始值 → 本身
\`\`\`

用途：写 Composable 时让参数**同时支持 ref / getter / 原始值**，提升灵活性。

\`\`\`js
// 以前要写三种判断，现在一个 toValue 搞定
function useDouble(source) {
  return computed(() => toValue(source) * 2)
}

useDouble(5)              // 原始值
useDouble(ref(5))         // ref
useDouble(() => 5)        // getter
useDouble(computed(() => 5))  // computed（也是 getter）
\`\`\`

Vue 3.3+ 的 \`watch / computed / watchEffect\` 也原生支持这三种参数，内部就用 \`toValue\`。

## 易错点

- **\`toRef(state, '不存在的key')\`**：返回一个无效 ref（\`.value\` undefined），后续赋值会写到 state 上（自动创建）。
- **\`toRefs\` 是浅层**：只处理顶层属性，嵌套对象不会递归（嵌套仍是 reactive，但解构嵌套会丢）。
- **解构 props 失去响应式**：\`const { title } = props\` 失去响应式，要用 \`toRefs(props)\`（但 props 是只读，别用 toRef 写）。
- **\`toValue\` vs \`unref\`**：\`unref\` 只处理 ref，getter 不调；\`toValue\` 三种都处理。新代码优先 \`toValue\`。

## 一句话记忆

- \`toRef\`：单属性 → ref（保持引用）。
- \`toRefs\`：整个对象 → ref 集合（解构友好）。
- \`toValue\`：ref/getter/值 → 值（参数归一化）。`
  },
  {
    id: 'vue-032',
    category: 'vue',
    title: 'v-memo 指令的作用、原理与使用场景？',
    difficulty: '困难',
    tags: ['v-memo', '指令', '编译优化', '性能', '缓存'],
    answer: `## v-memo 是什么

Vue 3.2 引入的**编译期指令**，给元素/组件加一个"依赖数组"，只有依赖变化时才重新 patch，否则复用上次结果。

\`\`\`html
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <span>{{ item.name }}</span>
  <span>{{ item.desc }}</span>
  <heavy-comp :data="item" />
</div>
\`\`\`

只有 \`item.id\` 或 \`item.selected\` 变化时，这个 \`div\` 子树才会重新渲染；其他情况（如 \`item.name/desc\` 变了但 id/selected 没变）直接跳过 patch。

## 解决什么问题

Vue 的编译优化（PatchFlag、Block Tree）已经很高效，但**大列表**场景仍有瓶颈：
- 1000 项列表，某一项更新，diff 仍要遍历所有 vnode 做比较。
- 单个 item 内部组件多，每次 patch 成本不低。

\`v-memo\` 让你能"显式声明这块子树只有这几个依赖变了才更新"，跳过整个 diff。

## 原理：编译产物

\`\`\`html
<div v-memo="[item.id, item.selected]">{{ item.name }}</div>
\`\`\`

编译后大致：

\`\`\`js
// 缓存上次依赖 + vnode
let memoized = null
// ...
if (
  !memoized ||
  memoized[0] !== item.id ||
  memoized[1] !== item.selected
) {
  // 依赖变了，重新创建 vnode
  vnode = createVNode('div', null, item.name)
  memoized = [item.id, item.selected]
}
// 否则复用 vnode，跳过 patch
\`\`\`

实际是用 \`withMemo\` 包装，对比依赖数组决定是否复用上次的 vnode。

## 适用场景

### 1. 海量列表 + 单项复杂

\`\`\`html
<div v-for="item in hugeList" :key="item.id" v-memo="[item.id, item.updatedAt]">
  <复杂子树 />
</div>
\`\`\`

列表 1w 项，更新其中 1 项时，其余 9999 项因 \`v-memo\` 跳过，性能提升明显。

### 2. 不常变化的重量级组件

\`\`\`html
<expensive-chart v-memo="[dataset, theme]" :data="dataset" :theme="theme" />
\`\`\`

明确这块只在数据/主题变时重渲染。

### 3. 配合 v-for 的选中态

\`\`\`html
<li
  v-for="item in list"
  :key="item.id"
  v-memo="[item.id, activeId === item.id]"
  :class="{ active: activeId === item.id }"
>
  {{ item.name }}
</li>
\`\`\`

切换 activeId 时，只有两项（新选中 + 旧选中）重新 patch，其余跳过。

## 不该用的场景

- **依赖数组几乎每次都变**：v-memo 比较依赖也要开销，没收益。
- **小列表 / 简单子树**：编译优化已够快，v-memo 反而增加复杂度。
- **依赖写漏**：漏了某个真正影响渲染的依赖，会导致该更新时不更新（数据视图不一致 bug）。

## 与 computed / memo 对比

| 机制 | 层级 | 粒度 |
| --- | --- | --- |
| computed | 数据 | 单个值缓存 |
| v-memo | 视图 | 整个子树 vnode 缓存 |
| React useMemo | 数据/视图 | 单个值 |

v-memo 是**视图层的 memo**，直接跳过 vnode 创建和 diff，比数据层缓存更彻底。

## 与 key 的关系

- \`key\`：列表项身份标识，影响复用/销毁。
- \`v-memo\`：子树内容缓存，影响是否 patch。
- 两者正交，可同时用：\`key\` 管身份，\`v-memo\` 管更新。

## 坑

- **依赖必须是响应式数据的快照**，别把整个对象放进去（引用变化频繁）。
- **调试困难**：v-memo 跳过更新时不打任何日志，视图不更新难定位，排查时先临时去掉 v-memo。
- **不能用于根节点以外的非 v-for 场景**：技术上能用，但单元素加 v-memo 收益有限。
- **v-memo 一旦写错依赖，是最隐蔽的"数据视图不一致"bug 来源**，慎用。

## 一句话

\`v-memo\` 是 Vue 给大列表/重子树的"逃生舱"——常规优化够用时别用，遇到 v-for + 复杂子树卡顿时再上，且依赖数组务必写全。`
  },
  {
    id: 'vue-033',
    category: 'vue',
    title: 'effectScope 作用域管理与副作用清理？',
    difficulty: '困难',
    tags: ['effectScope', '副作用', '清理', 'Composable', '响应式'],
    answer: `## 痛点：副作用散落难清理

Vue 的响应式副作用（watch / watchEffect / computed）通常随组件销毁自动清理。但在 **Composable / 全局逻辑** 中，副作用生命周期不一定绑定组件：

\`\`\`js
function useMouse() {
  const x = ref(0), y = ref(0)
  window.addEventListener('mousemove', handler)   // ❌ 谁来移除？
  watchEffect(() => console.log(x.value, y.value))
  return { x, y }
}
\`\`\`

如果在多处调用，监听器堆积、watch 泄漏。

## effectScope：统一管理一组副作用

\`\`\`js
import { effectScope, watch, watchEffect, ref } from 'vue'

const scope = effectScope()

scope.run(() => {
  // 这里的所有 effect / computed / watch 都被 scope 收集
  const doubled = computed(() => state.count * 2)

  watchEffect(() => {
    document.title = state.title
  })

  watch(() => state.count, (n) => {
    console.log('count 变了', n)
  })
})

// 一次性停止 scope 内所有副作用
scope.stop()
\`\`\`

\`scope.stop()\` 后，里面的 watch / watchEffect 全部停止，computed 重新求值时也会断开依赖。

## 在 Composable 里用：自动随组件销毁

\`\`\`js
import { effectScope, onScopeDispose, ref, watchEffect } from 'vue'

export function useSharedState() {
  // 持久 scope（脱离组件也能用）
  const scope = effectScope(true)   // detached: true，不挂到父 scope
  const state = scope.run(() => {
    const count = ref(0)
    watchEffect(() => console.log('count:', count.value))
    return { count }
  })

  // 提供手动停止
  function dispose() { scope.stop() }

  return { ...state, dispose }
}
\`\`\`

## onScopeDispose：scope 级清理钩子

类似 \`onUnmounted\`，但绑定的是当前 effectScope，不一定是组件：

\`\`\`js
import { onScopeDispose } from 'vue'

export function useMouse() {
  const x = ref(0), y = ref(0)
  const handler = e => { x.value = e.x; y.value = e.y }
  window.addEventListener('mousemove', handler)

  // 当前 scope（通常是组件）停止时自动清理
  onScopeDispose(() => {
    window.removeEventListener('mousemove', handler)
  })

  return { x, y }
}
\`\`\`

**Composable 里推荐用 \`onScopeDispose\` 替代 \`onUnmounted\`**：不依赖组件实例，更通用（可在 effectScope 里复用）。

## 作用域嵌套与 detached

- effectScope 默认会挂到**父 scope**（当前激活的 scope 或组件 scope），父 stop 时子也 stop。
- \`effectScope(true)\` 创建**脱离** scope，不随父级停止，需手动 \`stop()\`。

\`\`\`js
const parent = effectScope()
parent.run(() => {
  const child = effectScope()       // 挂到 parent
  const detached = effectScope(true) // 脱离，parent.stop 不影响它
})
parent.stop()   // child 也 stop，detached 仍活
\`\`\`

## 实战：全局单例 store

\`\`\`js
// useGlobalTheme.js
import { effectScope, ref, watchEffect } from 'vue'

let scope
let state

export function useGlobalTheme() {
  if (!state) {
    scope = effectScope(true)       // 脱离任何组件，长期存活
    state = scope.run(() => {
      const theme = ref('light')
      watchEffect(() => {
        document.documentElement.dataset.theme = theme.value
      })
      return { theme }
    })
  }
  return state
}

// 真正不需要时手动释放
export function disposeGlobalTheme() {
  scope?.stop()
  state = null
}
\`\`\`

这就是 Pinia 内部实现 store 的核心机制：每个 store 一个 effectScope，\`$dispose\` 时停止。

## 与组件生命周期的关系

| 场景 | 清理时机 |
| --- | --- |
| 组件 setup 内的 watchEffect | 组件 unmount 自动 |
| 组件内调用的 Composable（含 onScopeDispose） | 组件 unmount 自动 |
| 全局 effectScope(detached) | 手动 stop() |
| effectScope() 挂父级 | 父级 stop 自动 |

## 坑

- **\`onScopeDispose\` 必须在 effect/effectScope 激活时调**，在 setTimeout / Promise 回调里调会失效（拿不到当前 scope）。
- **detached scope 忘记 stop**：内存泄漏，常用于全局单例要配 dispose。
- **scope.run 返回值**：返回回调的返回值，但响应式副作用是自动收集的，不需要手动处理。

## 一句话

\`effectScope\` 是 Vue 副作用管理的"垃圾桶"——把一堆 watch/watchEffect 丢进去，\`stop()\` 一键全清。写复杂 Composable / 全局 store 时必备。`
  },
  {
    id: 'vue-034',
    category: 'vue',
    title: 'Vue3 编译器原理：template → AST → render 函数？',
    difficulty: '困难',
    tags: ['编译器', 'AST', 'render', 'transform', 'codegen'],
    answer: `## 编译三阶段

Vue 模板编译遵循经典编译器三段式：

\`\`\`
template (字符串)
   │  ① Parse（解析）
   ▼
AST（抽象语法树）
   │  ② Transform（转换）
   ▼
JavaScript AST（带渲染信息）
   │  ③ Codegen（生成）
   ▼
render 函数（字符串 → 真正的函数）
\`\`\`

包：\`@vue/compiler-core\`（平台无关）、\`@vue/compiler-dom\`（DOM 专用）、\`@vue/compiler-sfc\`（单文件组件）。

## ① Parse：模板 → AST

用状态机扫描模板字符串，生成 AST 节点。

\`\`\`html
<div class="box" @click="onClick">{{ msg }}</div>
\`\`\`

解析后大致：

\`\`\`js
{
  type: 'Element',
  tag: 'div',
  props: [
    { type: 'Attribute', name: 'class', value: { content: 'box' } },
    { type: 'Directive', name: 'on', arg: 'click', exp: { content: 'onClick' } }
  ],
  children: [
    { type: 'Interpolation', content: { content: 'msg' } }
  ]
}
\`\`\`

节点类型：Element / Text / Interpolation（插值）/ Comment / Directive 等。

## ② Transform：AST 转换 + 静态分析

遍历 AST，做一系列转换插件（transform plugin）：

1. **静态提升（hoistStatic）**：纯静态节点提到 render 函数外，复用 vnode。
2. **PatchFlag 标记**：分析动态绑定，给 vnode 打 patchFlag（TEXT / CLASS / PROPS 等）。
3. **Block Tree 构建**：把动态节点收集到根 block 的 dynamicChildren，diff 时只遍历这些。
4. **指令转换**：\`v-if\` → 三元表达式，\`v-for\` → \`renderList\`，\`v-model\` → \`value + @input\`。
5. **缓存事件（cacheHandlers）**：内联函数提取到缓存，避免每次渲染新建。

\`\`\`js
// v-if 转换
{ "v-if": "ok", children: [X] }
// →
ok ? X : null
\`\`\`

## ③ Codegen：生成 render 字符串

\`\`\`js
import { createElementVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = { class: "box" }   // 静态提升

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode("span", null, _toDisplayString(_ctx.msg), 1 /* TEXT */)
  ], 2 /* CLASS */))
}
\`\`\`

\`_ctx\` 是组件实例代理（模板变量从这里取），\`_cache\` 是事件缓存。

## 关键优化产物

### PatchFlag

\`\`\`js
_createElementVNode("div", { class: _ctx.cls }, null, 2 /* CLASS */)
\`\`\`

数字 2 是 PatchFlag，告诉运行时"这个 vnode 只有 class 可能变"，diff 时只比 class。

常用值：
- \`1\` TEXT（文本内容）
- \`2\` CLASS
- \`4\` STYLE
- \`8\` PROPS（已知属性）
- \`16\` FULL_PROPS（动态 key，要全比）
- \`32\` HYDRATE_EVENTS
- \`64\` STABLE_FRAGMENT

### Block Tree

\`_openBlock()\` 开启一个 block，记录其下所有动态 vnode 到 \`dynamicChildren\`。diff 时只遍历 \`dynamicChildren\`，跳过静态子树，复杂度从 O(子树大小) 降到 O(动态节点数)。

### 静态提升

\`\`\`js
const _hoisted_1 = { class: "box" }
\`\`\`

纯静态 vnode 提到模块顶层，每次 render 复用同一个对象，不再每次新建。

### cacheHandlers

\`\`\`html
<button @click="count++">+</button>
\`\`\`

\`\`\`js
// 不缓存：每次渲染新建函数 → 子组件 memo 失效
onClick: () => _ctx.count++
// 缓存：从 _cache 取，引用稳定
onClick: _cache[0] || (_cache[0] = () => _ctx.count++)
\`\`\`

## 运行时：render → vnode → patch

\`\`\`js
// 组件渲染
const vnode = Component.render(ctx, cache)   // 调 render 得到 vnode
patch(prevVnode, vnode, container)            // diff 旧新 vnode，更新 DOM
\`\`\`

\`patch\` 对比新旧 vnode：
1. 类型相同 → 走 \`patchElement / patchChildren\`。
2. 有 PatchFlag → 只比标记的动态部分。
3. Block → 只遍历 \`dynamicChildren\`。
4. 类型不同 → 卸载旧的，挂载新的。

## SFC 编译：单文件组件

\`.vue\` 文件由 \`@vue/compiler-sfc\` 处理：

\`\`\`
<template>  → render 函数
<script>    → 普通 JS export default
<style>     → 单独 CSS（可 scoped）
\`\`\`

scoped CSS 通过给元素加 \`data-v-xxxx\` 属性 + CSS 选择器加 \`[data-v-xxxx]\` 实现隔离。

## 调试 / 查看

- **Vue SFC Playground**：https://play.vuejs.org，可实时看编译产物。
- **\`vue-template-explorer\`**：本地工具看 template → render。
- 模板里写 \`<!-- vue-content -->\` 不影响，但能看 AST 结构。

## 面试要点

- 三阶段：Parse → Transform → Codegen。
- Vue3 三大编译优化：静态提升、PatchFlag、Block Tree（+ cacheHandlers）。
- render 函数是**字符串生成的函数**，运行时调用得到 vnode。
- 模板本质是 render 的语法糖，手写 render / jsx 可绕过编译，但失去自动优化。

## 一句话

Vue 编译器把模板"预计算"成高效的 render 函数：能提的提（静态提升）、能跳的跳（Block Tree）、能省的省（PatchFlag），运行时只需做最小 diff。`
  },
  {
    id: 'vue-035',
    category: 'vue',
    title: 'Vue SSR 原理、hydration 与 Nuxt 同构渲染？',
    difficulty: '困难',
    tags: ['SSR', 'hydration', 'Nuxt', '同构', '首屏'],
    answer: `## 为什么 SSR

CSR（客户端渲染）：浏览器拿空 HTML + JS，JS 跑完才看到内容。问题：首屏白屏、SEO 差。

SSR（服务端渲染）：服务器跑 Vue 组件生成 HTML 字符串返回，浏览器直接看到内容，再"注水"激活交互。

| 维度 | CSR | SSR |
| --- | --- | --- |
| 首屏 | 慢（等 JS 加载执行） | 快（HTML 直出） |
| SEO | 差（爬虫看不到内容） | 好（HTML 有内容） |
| 服务器压力 | 低（静态） | 高（每请求渲染） |
| 交互就绪 | JS 加载完即可 | 需 hydration |

## 原生 Vue SSR 流程

### 1. 同构组件

组件要能在 Node 和浏览器都跑：
- 不用 \`window / document\`（Node 没有）。
- 生命周期只用 SSR 支持的（\`beforeCreate / created\`，不能用 \`mounted\`，服务端不挂载）。
- \`onMounted\` 只在客户端执行，\`setup\` 两端都跑（注意别在 setup 顶层访问 window）。

### 2. 服务端：renderToString

\`\`\`js
// server.js
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'

const app = createSSRApp(App)
const html = await renderToString(app)
res.send(\`
  <!DOCTYPE html><html><body>
    <div id="app">\${html}</div>
    <script src="/client.js"></script>
  </body></html>
\`)
\`\`\`

### 3. 客户端：createApp + hydrate

\`\`\`js
// client.js
import { createSSRApp } from 'vue'
import App from './App.vue'

const app = createSSRApp(App)
app.mount('#app')   // Vue 检测到服务端 HTML，做 hydration 而非重新渲染
\`\`\`

\`createSSRApp\` 表示这是 SSR 应用，客户端 mount 时走 hydration。

## Hydration（注水）：关键概念

服务器返回的 HTML 是"死"的（无事件）。hydration 做两件事：
1. **复用 DOM**：不重建 DOM，直接接管现有节点（避免闪烁）。
2. **绑定事件 / 响应式**：把 Vue 的响应式系统、事件监听"挂"到现有 DOM 上。

\`\`\`js
// Vue 内部：hydration 不是 patch，是 walk 现有 DOM 验证匹配
// 如果服务端 HTML 和客户端 render 结果不一致 → hydration mismatch 警告
\`\`\`

### Hydration Mismatch（注水不匹配）

\`\`\`js
// ❌ 服务端和客户端渲染结果不一样
<template>
  <div>{{ Date.now() }}</div>   <!-- 服务端渲染时间和客户端不同 -->
</template>
\`\`\`

Vue 会警告并**丢弃服务端 DOM 重新渲染**，丧失 SSR 优势。解决：
- 时间/随机等用 \`onMounted\` 里赋值（只客户端执行）。
- 用 \`<ClientOnly>\` 包裹只客户端渲染的部分。

## 数据预取：SSR 的核心难题

SSR 时组件要带数据渲染，但 \`mounted\` 不执行。两种方案：

### 方案 1：组件静态方法 \`serverPrefetch\`

\`\`\`js
// 组件内
export default {
  async serverPrefetch() {
    this.posts = await fetchPosts()   // 服务端渲染前拉数据
  }
}
\`\`\`

### 方案 2：路由级数据预取（Nuxt 用）

\`\`\`js
// 路由组件导出 asyncData
export default {
  async asyncData({ params }) {
    const post = await fetch(\`/api/posts/\${params.id}\`).then(r => r.json())
    return { post }   // 合并到 data，SSR 用它渲染
  }
}
\`\`\`

\`asyncData\` 在服务端执行，结果序列化到 HTML（\`__NUXT__\` 全局变量），客户端 hydrate 时直接用，不再请求。

## 状态序列化与同步

\`\`\`js
// 服务端：把 store 状态塞进 HTML
const state = store.state
res.send(\`
  <script>window.__INITIAL_STATE__ = \${JSON.stringify(state)}</script>
\`)

// 客户端：读取并初始化 store
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
\`\`\`

避免客户端 hydrate 时重复请求 + 保证两端数据一致。

## Nuxt：SSR 框架集大成

Nuxt 把上述流程全封装：

| 目录 | 作用 |
| --- | --- |
| \`pages/\` | 文件路由（\`pages/users/[id].vue\` → \`/users/:id\`） |
| \`layouts/\` | 布局组件 |
| \`components/\` | 自动注册 |
| \`server/api/\` | 后端 API（Nitro） |
| \`nuxt.config.ts\` | 配置 |

特性：
- **自动 SSR**：默认服务端渲染，可配 \`ssr: false\` 改 SPA。
- **混合渲染**：路由级 SSR / SSG / SWR（Nuxt 3 \`routeRules\`）。
- **Nitro 服务端**：基于 h3，可部署 Vercel / Cloudflare / Node / 静态。
- **useFetch / useAsyncData**：内置数据获取，自动处理 SSR 预取 + 客户端同步。

\`\`\`js
// Nuxt 组件里数据获取
const { data: posts } = await useFetch('/api/posts')
// SSR 时服务端拉，结果自动序列化；客户端 hydrate 时直接用，不重复拉
\`\`\`

## 性能要点

- **流式渲染**：\`renderToNodeStream\` 边渲染边输出，TTFB 更快。
- **组件级缓存**：Nuxt \`<ServerOnly>\` + server components。
- **部分 hydration**：Vue 3.5+ / Nuxt 3 支持岛屿组件（islands），只 hydrate 交互部分。
- **预渲染**：构建时生成静态 HTML（SSG），适合内容站。

## 坑

- **生命周期差异**：服务端只跑 setup + beforeCreate/created，mounted/updated 不跑。
- **window / document**：服务端没有，访问就崩，用 \`import.meta.env.SSR\` 判断或放 onMounted。
- **第三方库**：有些库依赖 window，要用 \`<ClientOnly\` 包或动态 import。
- **数据一致性**：SSR 拉的数据和客户端 hydrate 时拉的不一致 → mismatch。
- **内存泄漏**：服务端长期跑，全局单例（Pinia）要每请求重新创建，避免请求间状态污染。

## 一句话

SSR = 服务端跑 Vue 出 HTML（快首屏/SEO）+ 客户端 hydration 激活交互。难点在数据预取与状态同步，Nuxt 把这套流程工程化，是 Vue SSR 的事实标准。`
  },
  {
    id: 'vue-036',
    category: 'vue',
    title: 'defineModel 宏、useAttrs / useSlots 与透传属性？',
    difficulty: '中等',
    tags: ['defineModel', 'useAttrs', 'useSlots', '透传', '宏'],
    answer: `## defineModel：双向绑定的语法糖（3.4+ 稳定）

### 老写法：组件 v-model 要手写 prop + emit

\`\`\`js
// Child.vue
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
const value = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
\`\`\`

\`\`\`html
<!-- 父组件 -->
<Child v-model="text" />
\`\`\`

\`v-model\` 是 \`modelValue\` prop + \`update:modelValue\` emit 的语法糖。

### 新写法：defineModel 一行搞定

\`\`\`html
<script setup>
const model = defineModel()   // 自动声明 modelValue + update:modelValue
</script>

<template>
  <input :value="model" @input="model = $event.target.value" />
</template>
\`\`\`

\`defineModel()\` 返回一个 ref，读 = 拿 prop，写 = 触发 emit，父组件 \`v-model\` 自动同步。

### 多个 v-model（v-model:name）

\`\`\`js
const firstName = defineModel('firstName')   // v-model:firstName
const lastName = defineModel('lastName')     // v-model:lastName
\`\`\`

\`\`\`html
<UserForm v-model:firstName="f" v-model:lastName="l" />
\`\`\`

### 修饰符

\`\`\`js
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.trim) value = value.trim()
    if (modifiers.uppercase) value = value.toUpperCase()
    return value
  }
})
\`\`\`

\`\`\`html
<MyInput v-model.uppercase.trim="text" />
\`\`\`

### 默认值与类型

\`\`\`js
const model = defineModel({ default: '', type: String, required: true })
\`\`\`

## useAttrs：访问透传属性

### 透传（Fallthrough）规则

父组件传给子组件但**未在 props/emits 声明**的属性，会自动"透传"到子组件根元素：

\`\`\`html
<!-- 父 -->
<MyInput class="big" placeholder="请输入" data-test="x" />

<!-- 子 MyInput.vue，根元素是 input -->
<input class="big" placeholder="请输入" data-test="x" />   <!-- 自动加上 -->
\`\`\`

透传包括：class、style、id、data-*、aria-* 等普通属性。

### useAttrs：手动获取透传属性

\`\`\`js
<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs()
// attrs.class, attrs.placeholder, attrs['data-test']...
</script>

<template>
  <!-- 想把透传属性给非根元素，或禁用自动透传 -->
  <input v-bind="attrs" />
</template>
\`\`\`

### 禁用自动透传

\`\`\`js
// 多根节点组件不自动透传（Vue 不知道给谁）
// 或显式禁用
export default {
  inheritAttrs: false   // 关闭自动透传，全靠 useAttrs 手动分发
}
\`\`\`

\`\`\`html
<script setup>
defineOptions({ inheritAttrs: false })   // setup 里用 defineOptions
const attrs = useAttrs()
</script>

<template>
  <div class="wrapper">
    <input v-bind="attrs" />   <!-- 手动指定给 input -->
  </div>
</template>
\`\`\`

### attrs vs props

| | props | attrs |
| --- | --- | --- |
| 声明 | defineProps | 未声明的部分 |
| 响应式 | ✅ | ✅（但不是深度） |
| 类型校验 | ✅ | ❌ |
| 默认值 | ✅ | ❌ |
| 透传到根 | ❌ | ✅（自动或手动） |

## useSlots：编程式访问插槽

\`\`\`html
<script setup>
import { useSlots } from 'vue'
const slots = useSlots()
// slots.default?.()  slots.header?.()  slots.footer?.()
</script>

<template>
  <div>
    <header v-if="slots.header"><slot name="header" /></header>
    <main><slot /></main>
  </div>
</template>
\`\`\`

常用于：根据插槽是否存在渲染不同结构、在 JS 里把插槽内容传给子组件、高阶组件转发插槽。

## 实战：封装 Input 组件

\`\`\`html
<script setup>
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const model = defineModel({ default: '' })
const attrs = useAttrs()

defineProps({
  label: String,
  error: String
})
</script>

<template>
  <label class="field">
    <span class="label">{{ label }}</span>
    <input
      v-model="model"
      v-bind="attrs"
      :class="{ error: !!error }"
    />
    <span v-if="error" class="err">{{ error }}</span>
  </label>
</template>
\`\`\`

\`\`\`html
<!-- 父组件 -->
<MyInput
  v-model="form.name"
  label="姓名"
  error="必填"
  type="text"
  placeholder="请输入"
  maxlength="20"
/>
\`\`\`

\`type/placeholder/maxlength\` 没在 props 声明 → 进 attrs → 透传到 input。

## 坑

- **\`defineModel\` 需要编译器支持**：3.4+ 稳定，老版本要用 \`defineModel\` 实验宏或手写。
- **attrs 不是响应式深度对象**：改 attrs 内部属性不触发更新，整体替换才行。
- **class/style 透传特殊**：会与子组件根元素的 class 合并（不是覆盖）。
- **多根节点透传失效**：必须显式 v-bind 到某节点，Vue 不会猜。
- **事件透传**：\`@click\` 等不在 emits 声明的事件也会进 attrs，会作为 native 事件绑到根元素。

## 一句话

- \`defineModel\` 让组件 v-model 一行写完，支持多绑定和修饰符。
- \`useAttrs\` 拿未声明的透传属性，配 \`inheritAttrs: false\` 精确分发。
- \`useSlots\` 编程式判断/转发插槽。三者合用，能写干净的"包裹型"组件。`
  },
  // ===== 以下为补充题目（vue-037 ~ vue-066）=====
  {
    id: 'vue-037',
    category: 'vue',
    title: 'v-model 的原理是什么？有哪些修饰符？组件上如何实现 v-model？',
    difficulty: '中等',
    tags: ['v-model', '双向绑定', '修饰符', '组件通信'],
    answer: `## 原理

\`v-model\` 本质是 **语法糖**：合并了一个 \`value\` 绑定 + 一个 \`input\` 事件监听。

\`\`\`html
<!-- 原生 input 上 -->
<input v-model="msg" />
<!-- 等价于 -->
<input :value="msg" @input="msg = $event.target.value" />
\`\`\`

它根据表单元素类型自动选择绑定的属性和事件：
- \`text/textarea\` → \`value\` + \`input\`
- \`checkbox\` → \`checked\` + \`change\`
- \`radio/select\` → \`value\` + \`change\`

## 修饰符

| 修饰符 | 作用 |
| --- | --- |
| \`.lazy\` | 改为 \`change\` 事件同步（失焦/回车才更新），而非每次 \`input\` |
| \`.number\` | 自动 \`parseFloat\`，无法转成数字则保留原值 |
| \`.trim\` | 自动去除首尾空格 |

\`\`\`html
<input v-model.lazy.number.trim="age" />
\`\`\`

## 组件上的 v-model（Vue 3）

Vue 3 默认绑定 **\`modelValue\`** 和监听 **\`update:modelValue\`**：

\`\`\`vue
<!-- 父组件 -->
<ChildComp v-model="msg" />
<!-- 等价于 -->
<ChildComp :modelValue="msg" @update:modelValue="msg = $event" />

<!-- 子组件 ChildComp.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
function onInput(e) { emit('update:modelValue', e.target.value) }
</script>
<template>
  <input :value="modelValue" @input="onInput" />
</template>
\`\`\`

### 多个 v-model

Vue 3 支持指定参数，实现多个双向绑定：

\`\`\`html
<UserForm v-model:name="name" v-model:age="age" />
\`\`\`

### 自定义修饰符

\`\`\`html
<MyInput v-model.capitalize="text" />
\`\`\`

子组件通过 \`modelModifiers\` prop 接收修饰符对象，在写入前处理。

## 一句话

\`v-model = :value + @input\` 的语法糖；Vue 3 组件版基于 \`modelValue\` + \`update:modelValue\`，支持多绑定和自定义修饰符。`
  },
  {
    id: 'vue-038',
    category: 'vue',
    title: 'provide / inject 依赖注入怎么用？如何保证响应式？',
    difficulty: '中等',
    tags: ['provide', 'inject', '依赖注入', '响应式'],
    answer: `## 作用

跨层级向下传递数据，**祖先组件 provide，所有后代组件 inject**，无需逐层 props 透传。常用于主题、i18n、表单上下文。

\`\`\`js
// 祖先
import { provide, ref } from 'vue'
const theme = ref('dark')
provide('theme', theme)

// 后代（任意层级）
import { inject } from 'vue'
const theme = inject('theme', 'light') // 第二个参数为默认值
\`\`\`

## 响应式保证

**直接传响应式对象**（\`ref\` / \`reactive\`），后代拿到的就是同一个对象，修改会触发更新：

\`\`\`js
const theme = ref('dark')
provide('theme', theme)
// 后代：theme.value = 'light' ✅ 响应式
\`\`\`

❌ 错误：传普通值，后代修改不会同步：

\`\`\`js
provide('count', 0) // 后代 inject 拿到的是快照，修改无效
\`\`\`

如果后代**只读**祖先的值、由祖先修改，可传 \`ref\`；若要后代也能改，**提供修改方法**而非直接暴露 ref：

\`\`\`js
const count = ref(0)
provide('count', count)
provide('increment', () => count.value++) // 推荐：通过方法修改
\`\`\`

## 只读保护

用 \`readonly\` 包裹，防止后代直接篡改：

\`\`\`js
import { readonly } from 'vue'
provide('config', readonly(config))
\`\`\`

后代修改只读对象会报警告。

## TypeScript

\`inject\` 默认返回 \`unknown\`，需用泛型 + \`InjectionKey\` 约束：

\`\`\`ts
import { InjectionKey, provide, inject } from 'vue'
const key = Symbol() as InjectionKey<Ref<string>>
provide(key, ref('dark'))
const theme = inject(key) // Ref<string> | undefined
\`\`\`

## 响应式丢失注意

\`inject\` 后**解构会丢失响应式**（除非用 \`toRefs\`），保留 ref 对象本身即可。

## 一句话

\`provide/inject\` 跨层传值；**传 ref/reactive 才有响应式**；改值走方法 + \`readonly\` 保护；TS 用 \`InjectionKey\`。`
  },
  {
    id: 'vue-039',
    category: 'vue',
    title: 'Vue 3 自定义指令有哪些钩子？如何注册和使用？',
    difficulty: '中等',
    tags: ['自定义指令', 'directive', '钩子'],
    answer: `## 何时用

对普通 DOM 元素进行**底层操作**（聚焦、拖拽、权限按钮、复制、水印、懒加载）时，比组件更轻量。

## 钩子（Vue 3）

\`\`\`js
const myDirective = {
  created(el, binding, vnode, prevVnode) {},     // 元素属性和事件监听设置前
  beforeMount(el, binding) {},                    // 挂载前
  mounted(el, binding) {},                        // 挂载后（最常用）
  beforeUpdate(el, binding) {},                   // 更新前
  updated(el, binding) {},                        // 更新后
  beforeUnmount(el, binding) {},                  // 卸载前
  unmounted(el, binding) {}                       // 卸载后
}
\`\`\`

### Vue 2 → Vue 3 钩子变化

| Vue 2 | Vue 3 |
| --- | --- |
| bind | beforeMount |
| inserted | mounted |
| update | ❌（用 updated） |
| componentUpdated | updated |
| unbind | unmounted |

## binding 对象

\`\`\`js
{
  value,        // 指令绑定的值 v-x="1" → 1
  oldValue,     // 前一个值（update/updated 中可用）
  arg,          // 参数 v-x:foo → 'foo'
  modifiers,    // 修饰符 v-x.a.b → { a: true, b: true }
  instance,     // 组件实例
  dir           // 指令定义对象
}
\`\`\`

## 使用

\`\`\`html
<div v-focus></div>
<div v-permission="'admin'"></div>
<input v-model.lazy.focus.trim="text" />
\`\`\`

## 注册

### 全局

\`\`\`js
const app = createApp(App)
app.directive('focus', {
  mounted(el) { el.focus() }
})
\`\`\`

### 局部（组合式 API 简写）

任何以 \`v\` 开头的驼峰命名变量都会被当作指令：

\`\`\`vue
<script setup>
// 对象形式
const vFocus = { mounted: (el) => el.focus() }
// 函数简写：在 mounted 和 updated 都执行
const vColor = (el, binding) => { el.style.color = binding.value }
</script>
<template>
  <input v-focus />
  <span v-color="'red'">hi</span>
</template>
\`\`\`

## 示例：复制指令

\`\`\`js
const vCopy = {
  mounted(el, { value }) {
    el.addEventListener('click', () => navigator.clipboard.writeText(value))
  }
}
// <button v-copy="text">复制</button>
\`\`\`

## 一句话

指令操作 DOM；Vue 3 钩子为 \`beforeMount/mounted/beforeUpdate/updated/beforeUnmount/unmounted\`；\`<script setup>\` 中 \`vXxx\` 变量即局部指令。`
  },
  {
    id: 'vue-040',
    category: 'vue',
    title: 'Teleport 传送门的作用、原理与使用场景？',
    difficulty: '中等',
    tags: ['Teleport', '内置组件', '弹窗'],
    answer: `## 作用

把组件的**渲染 DOM 输出**传送到页面其他位置（通常是 \`document.body\`），但**逻辑/响应式/上下文仍属于原组件树**。

\`\`\`vue
<template>
  <button @click="open = true">打开</button>
  <teleport to="body">
    <div v-if="open" class="modal">弹窗内容</div>
  </teleport>
</template>
\`\`\`

- \`to\`：CSS 选择器或 DOM 元素，指定挂载目标。
- \`disabled\`：布尔，为 true 时不传送（在原位渲染）。

## 解决什么问题

Modal、Toast、Tooltip 这类**全屏遮罩/浮层**，如果在组件内部渲染：

1. 父级有 \`transform / overflow: hidden / z-index\` 时，\`position: fixed\` 失效（CSS 规范：transform 会建立包含块）。
2. 层级嵌套深，z-index 难管理。
3. 样式被父级污染。

Teleport 把 DOM 物理移到 \`body\`，规避以上问题，而**事件、props、插槽、响应式全部正常**——因为逻辑上它还是当前组件的子节点。

## 多个 Teleport 共享目标

多个 \`<teleport to="body">\` 会**按出现顺序追加**到目标容器，而非覆盖。

## 原理

- 编译时给 Teleport 节点打标记。
- 运行时 VNode 仍挂在原组件树（保留父子关系，patch/生命周期正常）。
- 渲染阶段把真实 DOM insert 到 \`to\` 指定的容器。

## disabled 动态切换

\`\`\`html
<teleport :disabled="isMobile">
  <div class="drawer">...</div>
</teleport>
\`\`\`

移动端在原位渲染（用 \`position: absolute\`），桌面端传送到 body（\`fixed\`）。

## 一句话

Teleport 让 DOM "物理迁移、逻辑不变"，专治弹窗层级与 fixed 失效问题。`
  },
  {
    id: 'vue-041',
    category: 'vue',
    title: 'Suspense 和 defineAsyncComponent 怎么配合处理异步？',
    difficulty: '困难',
    tags: ['Suspense', 'defineAsyncComponent', '异步组件', 'fallback'],
    answer: `## defineAsyncComponent：异步加载组件

按需加载组件代码（路由懒加载、大组件分包）：

\`\`\`js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => import('./Heavy.vue'))
\`\`\`

完整配置：

\`\`\`js
const AsyncComp = defineAsyncComponent({
  loader: () => import('./Heavy.vue'),
  loadingComponent: Loading,        // 加载中
  errorComponent: Error,            // 加载失败
  delay: 200,                       // 显示 loading 前等待（避免闪烁）
  timeout: 3000,                    // 超时显示 error
  suspensible: true,                // 是否参与 Suspense（默认 true）
  onError(err, retry, fail, attempts) {
    if (attempts <= 3) retry()
    else fail()
  }
})
\`\`\`

## Suspense：编排异步子树

\`<Suspense>\` 等待其**异步子组件**（含异步 setup）全部就绪后再渲染，期间显示 \`fallback\`。

\`\`\`vue
<Suspense>
  <template #default>
    <AsyncComp />
  </template>
  <template #fallback>
    <Loading />
  </template>
</Suspense>
\`\`\`

## 异步 setup（顶层 await）

组件 \`<script setup>\` 中可直接 \`await\`，Vue 会把它视为 async setup：

\`\`\`vue
<script setup>
const data = await fetch('/api/user').then(r => r.json()) // 顶层 await
</script>
\`\`\`

此时组件必须被 \`Suspense\` 包裹，否则 Vue 警告；await 期间 Suspense 显示 fallback。

## 事件

- \`resolve\`：所有异步子组件就绪
- \`pending\`：从 resolved 再次进入 pending（子组件切换）

\`\`\`html
<Suspense @resolve="onReady" @pending="onPending">
\`\`\`

## 错误处理

async setup 抛错或异步组件加载失败，会向上冒泡，可用 \`errorCaptured\` 捕获并降级：

\`\`\`vue
<script setup>
import { onErrorCaptured, ref } from 'vue'
const err = ref(null)
onErrorCaptured((e) => { err.value = e; return false }) // 阻止继续冒泡
</script>
\`\`\`

## 注意

- **Suspense 仍是实验性 API**（3.x 可用但可能调整），生产慎用复杂嵌套。
- 与异步路由组件配合时，路由器自己有加载状态，可不用 Suspense。
- fallback 切换会触发组件卸载/重建，注意状态丢失。

## 一句话

\`defineAsyncComponent\` 异步加载单个组件；\`Suspense\` 编排多个异步子组件（含 async setup）的加载/错误/完成状态，统一显示 fallback。`
  },
  {
    id: 'vue-042',
    category: 'vue',
    title: 'KeepAlive 的原理是什么？include/exclude 和生命周期怎么用？',
    difficulty: '困难',
    tags: ['KeepAlive', '缓存', '组件状态', '生命周期'],
    answer: `## 作用

缓存不活动的组件实例，切换时**不销毁**，保留状态与 DOM，避免重复渲染。常用于 Tab 切换、列表 ↔ 详情往返。

\`\`\`vue
<KeepAlive>
  <component :is="currentTab" />
</KeepAlive>
\`\`\`

## props

| prop | 说明 |
| --- | --- |
| \`include\` | 字符串/正则/数组，只缓存匹配的组件（按 name 匹配） |
| \`exclude\` | 不缓存匹配的组件 |
| \`max\` | 最大缓存数，LRU 淘汰最久未访问的 |

\`\`\`html
<KeepAlive :include="['UserList','UserDetail']" :max="10">
  <component :is="view" />
</KeepAlive>
\`\`\`

⚠️ 匹配依据是组件的 **\`name\`** 选项，\`<script setup>\` 组件默认无 name，需用 \`defineOptions({ name: 'UserList' })\` 或单独的 \`<script>\` 块声明。

## 专属生命周期

被缓存的组件多了两个钩子：

| 钩子 | 触发时机 |
| --- | --- |
| \`onActivated\` | 被插入 DOM（首次挂载也会触发，在 mounted 之后） |
| \`onDeactivated\` | 被移出 DOM 但未销毁（缓存起来） |

\`\`\`js
import { onActivated, onDeactivated } from 'vue'
onActivated(() => { /* 重新连接 socket */ })
onDeactivated(() => { /* 断开 socket，避免后台消耗 */ })
\`\`\`

注意：\`mounted/unmounted\` 在缓存场景下**不再每次切换都触发**，因此定时器/订阅应放在 \`onActivated/onDeactivated\` 而非 \`mounted/unmounted\`。

## 原理

- KeepAlive 内部维护 \`cache\`（Map）和 \`keys\`（Set）。
- 子组件切换时，不调用 \`unmount\`，而是执行 \`move\`（DOM 移走）+ 标记 \`__v_cache\`。
- 重新激活时从缓存取回 VNode，执行 \`mount\` 但复用已存在的 DOM（patch）。
- \`max\` 超限时按 LRU（最近最少使用）淘汰：清理最久没被访问的缓存项，触发其 \`unmounted\`。

## 与过渡配合

\`\`\`vue
<Transition>
  <KeepAlive>
    <component :is="view" />
  </KeepAlive>
</Transition>
\`\`\`

## 坑

- **内存泄漏**：缓存过多大组件会占用内存，配合 \`max\`。
- **缓存了不该缓存的**：列表页带查询条件切换详情再回来，状态可能"脏"，需在 \`onActivated\` 里刷新。
- **name 缺失导致 include 失效**：务必给组件起 name。

## 一句话

KeepAlive 用 cache + LRU 缓存组件实例；匹配靠 \`name\`；切换触发 \`onActivated/onDeactivated\` 而非 mount/unmount；用 \`max\` 控制内存。`
  },
  {
    id: 'vue-043',
    category: 'vue',
    title: 'v-for 中 key 的作用是什么？为什么不建议用 index？',
    difficulty: '中等',
    tags: ['key', 'v-for', 'diff', '性能'],
    answer: `## 作用

\`key\` 是 VNode 的**唯一标识**，diff 时用来判断"这个节点是否还是原来的节点"。

\`\`\`html
<li v-for="item in list" :key="item.id">{{ item.name }}</li>
\`\`\`

## diff 的复用逻辑

Vue 同层 diff 时，根据 \`key\` 把新旧子节点配对：

- key 相同 → 复用 DOM，仅 patch 变化的属性/子节点。
- key 不存在（旧）→ 新节点。
- key 存在（旧）但新列表没了 → 删除。

**没有 key** 时，Vue 采用"就地复用"策略：按索引顺序 patch，DOM 不动，只更新文本/属性。

## 为什么不建议用 index

示例：列表 \`[A, B, C]\`，在头部插入 \`X\` → \`[X, A, B, C]\`。

| index 作 key | id 作 key |
| --- | --- |
| index 0：A→X，复用 li，改文本 | key=X 新建 li |
| index 1：B→A，复用 li，改文本 | key=A 复用原 li，不动 |
| index 2：C→B，改文本 | key=B 复用原 li，不动 |
| index 3：无→C，新建 li | key=C 复用原 li，不动 |

index 作 key 的后果：
1. **性能差**：所有 li 都被 patch（实际只该新增一个）。
2. **状态错乱**：如果 li 内有 input 且未随数据绑定，输入框会跟着索引走，A 的输入跑到 X 上。
3. **动画异常**：Transition 无法正确识别新增/删除的元素。

## 必须用 key 的场景

- 列表会有**插入/删除/排序**操作。
- 列表项包含**表单等有内部状态**的子组件。
- 配合 \`<TransitionGroup>\` 做动画。

## 何时可用 index

- 列表**只渲染、永不增删排序**（静态展示）。
- 项内**无状态**组件。

## key 的要求

- **唯一**（同层兄弟间）。
- **稳定**：不随渲染变化（不要用 \`Math.random()\` 或 \`Date.now()\`，会导致每次都重建，性能更差且状态丢失）。
- 用业务 id（\`item.id\`）最佳。

## 一句话

key 让 diff 精准复用节点；index 作 key 在增删/排序时会导致性能损耗与状态错乱，应使用稳定的唯一业务 id。`
  },
  {
    id: 'vue-044',
    category: 'vue',
    title: 'Vue 3 虚拟 DOM diff 采用了什么策略？最长递增子序列有何作用？',
    difficulty: '困难',
    tags: ['虚拟DOM', 'diff', '最长递增子序列', '算法'],
    answer: `## diff 总体策略

1. **同层比较**：只比较同一层级的兄弟节点，不跨层。
2. **类型相同才复用**：不同类型（如 \`div\`→\`span\`）直接销毁重建。
3. **依靠 key 复用**：同类型 + 同 key → 复用并 patch。

## Vue 3 的 diff 流程（带 key 的子节点）

假设新旧两组子节点，Vue 3 采用 **"首尾预处理 + 最长递增子序列"** 算法：

### 1. 头部预处理

从前往后，新旧的 VNode 若 key+type 相同，直接 patch，指针后移。

### 2. 尾部预处理

从后往前，相同则 patch，指针前移。

> 头尾预处理能高效处理"纯前插 / 纯后插 / 纯前删 / 纯后删"的常见场景，O(n)。

### 3. 中间乱序部分

对剩余的新节点建索引（key → index），然后为旧节点在新节点中的位置生成一个数组，求其**最长递增子序列（LIS）**。

\`\`\`
旧: [a, b, c, d, e, f, g]
新: [a, d, b, c, e, f, g]
预处理后剩中间: 旧 [b,c,d] → 新 [d,b,c]
旧节点在新中的位置: b→2, c→3, d→1 → 序列 [2,3,1]
LIS = [2,3] (b,c) → 这些节点相对位置不变，只需移动 d
\`\`\`

### 4. 移动 + 挂载/卸载

- **LIS 中的节点**：保持不动（它们已经是有序的）。
- **不在 LIS 中的节点**：移动到正确位置。
- 新节点中没匹配到的：挂载。
- 旧节点中没匹配到的：卸载。

## 为什么要 LIS

\`\`\`LIS = 不需要移动的节点的最大集合\`\`\`。让尽量多的节点原地不动，只移动最少的节点，是**最少操作次数**的保证。Vue 2 是逐个"找新位置 + insert"，最坏 O(n²)；Vue 3 用 LIS 降到 O(n log n)。

## 无 key 的 diff

采用就地复用：按索引 patch，不移动 DOM，只更新属性。性能"看起来"快但语义易错（见 key 题目）。

## Block Tree 与 PatchFlag

编译器为动态节点打 \`PatchFlag\`（如 \`TEXT\`/\`CLASS\`/\`PROPS\`），运行时 diff 时**只对比动态部分**，跳过静态节点，进一步降低 diff 成本。

## 一句话

Vue 3 diff = 头尾预处理 + 中间用最长递增子序列求"不需移动的节点"，使 DOM 移动次数最少；配合 PatchFlag 跳过静态节点。`
  },
  {
    id: 'vue-045',
    category: 'vue',
    title: 'ref 和 reactive 该如何选择？解构 reactive 为什么会丢失响应式？',
    difficulty: '中等',
    tags: ['ref', 'reactive', '解构', '响应式'],
    answer: `## ref vs reactive

| | \`ref\` | \`reactive\` |
| --- | --- | --- |
| 适用 | 任意值（含原始类型） | 仅对象/数组 |
| 访问 | 需 \`.value\`（模板自动解包） | 直接访问属性 |
| 重新赋值 | \`.value = x\` ✅ | \`obj = x\` ❌（丢响应式） |
| 解构 | 解构后仍是 ref（响应式保留） | 解构后变普通值（**丢失响应式**） |
| 模板 | 自动解包，不用写 \`.value\` | 直接用 |

\`\`\`js
const count = ref(0)
count.value++                 // 改值要 .value
const state = reactive({ a: 1 })
state.a = 2                   // 直接改属性
\`\`\`

## 解构 reactive 为什么丢响应式

\`reactive\` 的响应式建立在 **Proxy 代理对象**上。解构是把对象的属性值**复制**一份给新变量：

\`\`\`js
const state = reactive({ count: 0 })
const { count } = state  // count 现在是普通数字 0，与 state 的代理无关
count++                  // 改的是局部变量，不触发 state 的 set
\`\`\`

等价于：\`const count = state.count\`，拿到的就是原始值，丢失了代理引用。

## 解决：toRefs / toRef

\`toRefs\` 把 reactive 对象的每个属性转成对应的 ref，**解构后仍是 ref**，响应式保留：

\`\`\`js
import { reactive, toRefs } from 'vue'
const state = reactive({ count: 0, name: 'Vue' })
const { count, name } = toRefs(state)  // count/name 都是 Ref
count.value++                           // ✅ 触发更新
\`\`\`

单个属性用 \`toRef\`：

\`\`\`js
const count = toRef(state, 'count')
\`\`\`

## reactive 重新赋值的误区

\`\`\`js
let state = reactive({ count: 0 })
state = reactive({ count: 1 })  // ❌ state 指向新对象，旧代理被丢弃，模板里若绑定旧 state 会失效
\`\`\`

正确做法：改属性，或用 \`Object.assign\`：

\`\`\`js
Object.assign(state, { count: 1 })   // ✅ 在原代理上改属性
\`\`\`

或直接用 \`ref\`：

\`\`\`js
const state = ref({ count: 0 })
state.value = { count: 1 }   // ✅ ref 可整体替换
\`\`\`

## 选择建议

- **原始类型** → \`ref\`。
- **对象/数组且不需要整体替换** → \`reactive\`（语法更自然）。
- **需要整体替换、解构、从 composable 返回多个状态** → \`ref\` + \`toRefs\`。
- 团队统一风格即可，**不必教条**；很多项目全用 \`ref\` 也能写好。

## 一句话

\`ref\` 包任意值需 \`.value\`，\`reactive\` 仅对象且不能整体替换；reactive 解构丢响应式，用 \`toRefs\` 解决。`
  },
  {
    id: 'vue-046',
    category: 'vue',
    title: 'computed 的缓存原理是什么？和 methods 有何区别？',
    difficulty: '中等',
    tags: ['computed', '缓存', '依赖收集', 'methods'],
    answer: `## 基本用法

\`\`\`js
const fullName = computed(() => \`\${first.value} \${last.value}\`)
console.log(fullName.value)
\`\`\`

可写 computed：

\`\`\`js
const fullName = computed({
  get: () => \`\${first.value} \${last.value}\`,
  set: (v) => { [first.value, last.value] = v.split(' ') }
})
\`\`\`

## 缓存原理

computed 本质是一个 **惰性 effect**（\`ReactiveEffect\`）：

1. 首次访问 \`.value\` 时，执行 getter，期间访问到的响应式数据会被**收集为依赖**，并标记 \`dirty = false\`，缓存结果。
2. 当依赖变化时，触发 effect 的 scheduler（而非立即重算），仅把 \`dirty = true\`，**通知依赖该 computed 的 effect**。
3. 下次访问 \`.value\`：发现 \`dirty === true\` 才重新执行 getter；否则直接返回缓存。

> 关键：依赖变 → 只置脏，不立刻算；用到才算。这就是**惰性求值 + 缓存**。

## 与 methods 区别

| | computed | methods |
| --- | --- | --- |
| 缓存 | ✅ 依赖不变不重算 | ❌ 每次调用都执行 |
| 调用 | 像属性 \`.value\`（模板里直接用） | 像函数 \`fn()\` |
| 适用 | 派生状态（过滤、排序、合计） | 动作/事件处理 |
| 响应式 | 自动追踪依赖 | 无依赖追踪 |

\`\`\`html
<!-- computed: list 不变时多次读取只算一次 -->
<p>{{ filtered }}</p>
<p>{{ filtered }}</p>
<!-- method: 读两次算两次 -->
<p>{{ filterList() }}</p>
<p>{{ filterList() }}</p>
\`\`\`

## 缓存失效场景

- 依赖变化（即使新值与旧值相同，浅比较不等也会置脏；Vue 3 对某些场景做了优化）。
- getter 内**有副作用**（请求、定时器）会破坏纯函数假设，应避免。
- getter 内访问了**非响应式数据**（如普通变量），其变化不会触发更新。

## 链式 computed

computed 可依赖另一个 computed，依赖关系自动传递，仍按需重算。

## 性能建议

- 重计算昂贵（大数组排序、复杂计算）→ 用 computed 缓存。
- getter 保持**纯函数**，无副作用。
- 若需"变化时执行动作"，用 \`watch\` 而非 computed。

## 一句话

computed 是惰性 effect，依赖不变则返回缓存；methods 每次都执行；派生状态用 computed，事件动作用 methods。`
  },
  {
    id: 'vue-047',
    category: 'vue',
    title: 'watch 的 immediate/deep/flush 等选项怎么用？监听多个源怎么写？',
    difficulty: '中等',
    tags: ['watch', 'deep', 'flush', '监听'],
    answer: `## 基本用法

\`\`\`js
watch(source, (newVal, oldVal) => {}, options)
\`\`\`

\`source\` 可以是：ref、reactive、返回值的 getter 函数、或它们的数组。

\`\`\`js
watch(count, (n, o) => {})                      // ref
watch(() => state.count, (n, o) => {})          // reactive 的某属性（用 getter）
watch(state, (n, o) => {})                       // reactive 整体（隐式 deep）
watch([a, b, () => c.value], ([na, nb, nc], [oa, ob, oc]) => {})  // 多源
\`\`\`

## 常用选项

| 选项 | 作用 |
| --- | --- |
| \`immediate: true\` | 立即执行一次回调（oldVal 为 undefined） |
| \`deep: true\` | 深度遍历对象的所有嵌套属性，任意层变化都触发 |
| \`flush: 'pre' \| 'post' \| 'sync'\` | 触发时机（默认 \`pre\`） |
| \`once: true\` | 只触发一次后自动停止（3.4+） |

## deep

\`reactive\` 默认深度监听，但 \`ref(对象)\` 不是；getter 返回对象也只比较引用：

\`\`\`js
const state = ref({ a: { b: 1 } })
watch(state, (n) => {}, { deep: true })  // 不加 deep，改 a.b 不触发
\`\`\`

⚠️ \`deep\` 会遍历整棵对象树收集依赖，**大对象性能差**，能避免就避免（改为监听具体属性 getter）。

## flush

| 值 | 时机 |
| --- | --- |
| \`'pre'\`（默认） | 组件更新**前**（DOM 还是旧的） |
| \`'post'\` | 组件更新**后**（DOM 已更新，可读取最新 DOM） |
| \`'sync'\` | 同步执行（不推荐，可能多次触发） |

\`\`\`js
watch(visible, () => {
  // 需要操作更新后的 DOM
}, { flush: 'post' })
\`\`\`

## immediate 与 onCleanup

\`immediate\` 时回调会立即跑一次，注意此时可能拿不到组件实例；可配合 \`onCleanup\` 处理副作用：

\`\`\`js
watch(id, (newId, oldId, onCleanup) => {
  const ctrl = new AbortController()
  fetch('/api/' + newId, { signal: ctrl.signal }).then(...)
  onCleanup(() => ctrl.abort())  // id 变化或组件卸载时取消
}, { immediate: true })
\`\`\`

## 停止监听

\`watch\` 返回一个 stop 函数，调用即停止：

\`\`\`js
const stop = watch(x, cb)
stop()  // 组件内通常自动停止，手动停止用于一次性场景
\`\`\`

## watchEffect 的区别

\`watchEffect\` **自动收集依赖**，无需显式声明 source，立即执行一次；适合"多个依赖 + 不关心旧值"的场景。需要旧值、需要懒执行、需要明确依赖时用 \`watch\`。

## 一句话

\`watch\` 显式声明源；\`immediate\` 立即跑、\`deep\` 深度、\`flush\` 控时机；多源用数组；副作用配 \`onCleanup\` 防竞态与泄漏。`
  },
  {
    id: 'vue-048',
    category: 'vue',
    title: 'Vue 3 的生命周期钩子有哪些？Options API 与 Composition API 如何对应？',
    difficulty: '中等',
    tags: ['生命周期', 'Options API', 'Composition API'],
    answer: `## 完整对照表

| Options API | Composition API（setup） | 说明 |
| --- | --- | --- |
| beforeCreate | （setup 本身） | 实例创建前，setup 在此与 created 之间执行 |
| created | （setup 本身） | 实例创建后，data/computed 已就绪 |
| beforeMount | \`onBeforeMount\` | 挂载到 DOM 前 |
| mounted | \`onMounted\` | 挂载完成，可访问 DOM |
| beforeUpdate | \`onBeforeUpdate\` | 响应式数据变化、DOM 更新前 |
| updated | \`onUpdated\` | DOM 更新完成 |
| beforeUnmount | \`onBeforeUnmount\` | 卸载前（清理定时器/事件） |
| unmounted | \`onUnmounted\` | 卸载完成 |
| errorCaptured | \`onErrorCaptured\` | 捕获后代组件错误 |
| activated | \`onActivated\` | KeepAlive 激活 |
| deactivated | \`onDeactivated\` | KeepAlive 停用 |
| renderTracked | \`onRenderTracked\` | 调试用：render 依赖收集 |
| renderTriggered | \`onRenderTriggered\` | 调试用：render 重渲染触发 |

## 用法

\`\`\`js
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('DOM ready')
  window.addEventListener('resize', handler)
})

onUnmounted(() => {
  window.removeEventListener('resize', handler)
})
\`\`\`

- 钩子**只能在 setup 同步执行期间注册**（依靠当前实例的内部全局变量），异步回调里调用 \`onMounted\` 会失败。
- 一个钩子可注册多次，按顺序执行。

## 父子组件执行顺序

挂载：
\`\`\`
父 beforeCreate → created → beforeMount
  → 子 beforeCreate → created → beforeMount → mounted
父 mounted
\`\`\`

更新：
\`\`\`
父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
\`\`\`

卸载：
\`\`\`
父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted
\`\`\`

> 子组件先挂载/卸载，父组件后挂载/卸载；更新则父先开始、子先完成。

## 与异步结合的坑

\`\`\`js
// ❌ 错误：onMounted 在 await 之后，此时已脱离 setup 同步上下文
await fetchData()
onMounted(() => {})  // 报错：onMounted is called when there is no active component instance
\`\`\`

解决：把生命周期注册放在 await 之前，或用 \`Suspense\`。

## 一句话

Composition API 用 \`onXxx\` 注册钩子，与 Options 一一对应；必须在 setup 同步阶段注册；父子顺序遵循"子先挂载/卸载"。`
  },
  {
    id: 'vue-049',
    category: 'vue',
    title: 'Vue 组件通信有哪些方式？各适用什么场景？',
    difficulty: '中等',
    tags: ['组件通信', 'props', 'emit', 'provide/inject', 'pinia'],
    answer: `## 通信方式总览

| 方式 | 方向 | 适用场景 |
| --- | --- | --- |
| props / emit | 父↔子 | 父传子数据，子触发父事件 |
| v-model | 父↔子 | 双向绑定（本质 props+emit） |
| refs / expose | 父→子 | 父直接调用子方法/读子状态 |
| provide / inject | 祖先→后代 | 跨多层传值（主题、i18n、表单上下文） |
| EventBus / mitt | 任意 | 简单跨组件事件（小项目） |
| Pinia / Vuex | 任意 | 全局状态管理（推荐） |
| \$attrs 透传 | 祖先→中间→后代 | 属性透传（包裹组件） |
| slot | 父→子 | 父向子传模板内容 |

## 1. props / emit

\`\`\`js
// 子
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'confirm'])
// 父
<Child :modelValue="x" @confirm="onConfirm" />
\`\`\`

## 2. v-model

见 vue-037，双向绑定。

## 3. ref + defineExpose（父调子）

\`\`\`js
// 子
function focus() {}
defineExpose({ focus })
// 父
const childRef = ref()
childRef.value.focus()
\`\`\`

## 4. provide / inject（跨层）

见 vue-038，适合全局上下文。

## 5. 事件总线 mitt

Vue 3 移除了实例上的 \$on/\$emit，需用第三方（如 mitt）：

\`\`\`js
import mitt from 'mitt'
export const bus = mitt()
// A
bus.emit('login', user)
// B
bus.on('login', (user) => {})
\`\`\`

⚠️ 事件总线易失控（难追踪、内存泄漏），中大型项目优先用 Pinia。

## 6. Pinia（推荐全局状态）

\`\`\`js
const store = useUserStore()
store.login()
\`\`\`

适合多组件共享的状态（用户信息、购物车、主题）。

## 7. attrs 透传

\`\`\`js
// 中间包裹组件把未声明的属性透传给内部
<input v-bind="\$attrs" />
\`\`\`

## 8. slot（内容分发）

\`\`\`html
<Card>
  <template #header>标题</template>
  <p>内容</p>
</Card>
\`\`\`

## 选型建议

- 父子：props/emit、v-model、ref。
- 跨层：provide/inject。
- 全局：Pinia。
- 兄弟/无关系：通过 Pinia 或事件总线。

## 一句话

近的用 props/emit/v-model/ref，深的用 provide/inject，全局的用 Pinia，慎用事件总线。`
  },
  {
    id: 'vue-050',
    category: 'vue',
    title: 'Vue Router 4 的路由模式、动态路由、导航守卫和懒加载怎么用？',
    difficulty: '中等',
    tags: ['Vue Router', '路由模式', '导航守卫', '懒加载'],
    answer: `## 安装与基本配置

\`\`\`js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),   // 路由模式
  routes: [
    { path: '/', component: Home },
    { path: '/user/:id', component: User, props: true },
    { path: '/about', component: () => import('./About.vue') } // 懒加载
  ]
})
\`\`\`

## 路由模式

| 模式 | API | URL 形态 | 是否需要后端配置 |
| --- | --- | --- | --- |
| HTML5 history | \`createWebHistory\` | \`/user/1\` | ✅ 需 fallback 到 index.html |
| hash | \`createWebHashHistory\` | \`/#/user/1\` | ❌ |
| memory | \`createMemoryHistory\` | 无 URL 变化 | SSR/测试用 |

## 动态路由与参数

\`\`\`js
{ path: '/user/:id', component: User, props: true }
// /user/42 → route.params.id = '42'
\`\`\`

- 可选参数：\`/user/:id?\`
- 多级：\`/user/:id/post/:postId\`
- \`props: true\` 把 params 作为 props 传入组件，解耦 \`\$route\`。
- 捕获所有：\`/:pathMatch(.*)*\` → 404。

## 嵌套路由

\`\`\`js
{
  path: '/user/:id',
  component: UserLayout,
  children: [
    { path: '', component: Profile },           // /user/1
    { path: 'posts', component: Posts }         // /user/1/posts
  ]
}
\`\`\`

\`UserLayout\` 内需要 \`<router-view />\`。

## 命名路由 + 编程式导航

\`\`\`js
{ name: 'user', path: '/user/:id', component: User }

router.push({ name: 'user', params: { id: 42 } })
router.replace('/login')
router.go(-1)
\`\`\`

## 导航守卫

### 全局

\`\`\`js
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isLogin()) return '/login'
  // 返回 false/路由取消导航；返回路径/对象跳转；不返回继续
})
router.afterEach((to) => { /* 埋点、改标题 */ })
\`\`\`

### 路由独享

\`\`\`js
{ path: '/admin', beforeEnter: (to) => requireAdmin() }
\`\`\`

### 组件内

\`\`\`js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
onBeforeRouteLeave((to) => {
  if (hasUnsaved()) return confirm('确定离开？')
})
onBeforeRouteUpdate(() => { /* 同组件不同参数时 */ })
\`\`\`

### 解析顺序

\`beforeEach\` → \`beforeEnter\` → \`beforeRouteEnter\` → \`beforeResolve\` → \`afterEach\`。

## 懒加载与代码分包

\`\`\`js
{ path: '/about', component: () => import('./About.vue') }
\`\`\`

每个路由单独打包，首屏只加载用到的。配合 \`webpackPrefetch\` / Vite 的 prefetch 进一步优化。

## meta 与 TS 类型扩展

\`\`\`ts
declare module 'vue-router' {
  interface RouteMeta { requiresAuth?: boolean; title?: string }
}
\`\`\`

## 一句话

Router 4 用 \`createRouter\`；模式 history/hash/memory；\`:id\` 动态参数；\`beforeEach\` 守卫鉴权；\`() => import()\` 懒加载分包。`
  },
  {
    id: 'vue-051',
    category: 'vue',
    title: 'Pinia 的核心概念？setup store、持久化和模块化怎么组织？',
    difficulty: '中等',
    tags: ['Pinia', '状态管理', 'setup store', '持久化'],
    answer: `## 核心

Pinia 是 Vue 3 官方状态管理库，相比 Vuex：去掉了 mutation、TS 友好、按需引入、无嵌套模块。

### 三个核心

- **state**：数据
- **getters**：派生（类似 computed）
- **actions**：方法（同步/异步均可）

## 定义 store

### Options 风格

\`\`\`js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, list: [] }),
  getters: {
    double: (state) => state.count * 2,
    // 依赖其他 getter
    quadruple() { return this.double * 2 }
  },
  actions: {
    increment() { this.count++ },
    async fetchList() { this.list = await api.get() }
  }
})
\`\`\`

### Setup 风格（推荐，更灵活）

\`\`\`js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const list = ref([])
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  async function fetchList() { list.value = await api.get() }
  return { count, list, double, increment, fetchList }
})
\`\`\`

## 使用

\`\`\`js
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()
store.increment()
const { count, double } = storeToRefs(store)  // 解构保持响应式
\`\`\`

⚠️ 直接解构 \`const { count } = store\` 会丢响应式，必须用 \`storeToRefs\`（actions 普通解构即可）。

## 模块化

Pinia **没有模块嵌套**，每个 store 是独立的，按文件拆分即可：

\`\`\`
src/stores/
  user.js
  cart.js
  settings.js
\`\`\`

跨 store 调用：在 action 内 \`useOtherStore()\`。

\`\`\`js
export const useCartStore = defineStore('cart', () => {
  function checkout() {
    const user = useUserStore()
    if (!user.isLogin) return router.push('/login')
  }
})
\`\`\`

## 持久化

Pinia 无内置持久化，常用插件 \`pinia-plugin-persistedstate\`：

\`\`\`js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
\`\`\`

\`\`\`js
defineStore('user', {
  state: () => ({ token: '' }),
  persist: true   // 默认存 localStorage，key 为 store id
})
\`\`\`

也可手写：在 \`watch\` 或 action 里 \`localStorage.setItem\`。

## 跨组件响应式

Pinia store 本质是 reactive，所有组件共享同一实例，修改即更新所有订阅者。

## 重置 state

- Options store：\`store.\$reset()\` 内置。
- Setup store：无 \$reset，需自己实现（保存初始值 + 手动赋值）。

## 一句话

Pinia 用 \`defineStore\`，setup 风格更灵活；解构用 \`storeToRefs\`；按文件拆模块；持久化用插件；无 mutation，actions 直写同步异步。`
  },
  {
    id: 'vue-052',
    category: 'vue',
    title: '如何开发一个 Vue 3 插件？app.use / directive / provide / 全局组件怎么做？',
    difficulty: '中等',
    tags: ['插件', 'app.use', '全局注册', 'directive'],
    answer: `## 插件本质

一个带 \`install\` 方法的对象，或直接是一个函数。调用 \`app.use(plugin, ...options)\` 时执行，用于一次性注册全局组件、指令、provide、配置等。

\`\`\`js
const MyPlugin = {
  install(app, options) {
    // app: 应用实例；options: app.use 传的参数
  }
}
app.use(MyPlugin, { theme: 'dark' })
\`\`\`

## 注册全局组件

\`\`\`js
import MyButton from './MyButton.vue'

const plugin = {
  install(app) {
    app.component('MyButton', MyButton)
  }
}
\`\`\`

模板中可直接 \`<MyButton />\`。

## 注册全局指令

\`\`\`js
app.directive('focus', {
  mounted(el) { el.focus() }
})
\`\`\`

## 全局 provide

\`\`\`js
app.provide('theme', options.theme)
// 任意组件 inject('theme')
\`\`\`

## 全局属性 / 配置

\`\`\`js
app.config.globalProperties.\$toast = (msg) => { /* ... */ }
// 组件内：this.\$toast('hi')（Options API）；
// Composition API 用 getCurrentInstance().proxy.\$toast，但更推荐 provide
\`\`\`

## 完整插件示例：Toast

\`\`\`js
// plugins/toast.js
import ToastContainer from './ToastContainer.vue'

export default {
  install(app, options = {}) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    // 挂载容器组件
    import('vue').then(({ createApp }) => {
      createApp(ToastContainer).mount(container)
    })
    app.config.globalProperties.\$toast = (msg) => toastEventBus.emit('show', msg)
    app.provide('toast', (msg) => toastEventBus.emit('show', msg))
  }
}

// main.js
import Toast from './plugins/toast'
app.use(Toast)
\`\`\`

## 使用 composable 暴露 API

更现代的方式：插件内部用 composable，组件里直接调用：

\`\`\`js
// plugins/toast.js
export const useToast = () => { /* ... */ }
export default {
  install(app) {
    app.provide('toast', useToast())
  }
}
// 组件
const toast = inject('toast')
toast('hello')
\`\`\`

## 多次 use 的幂等性

\`app.use\` 对同一个插件**只执行一次**（按引用去重），重复 use 不会重复 install。

## 与库的关系

- UI 库（Element Plus、Naive UI）都是插件，\`app.use(ElementPlus)\` 注册所有组件。
- 也可按需 \`app.use(ElButton)\` 只注册单个。

## 一句话

插件 = \`install(app, options)\` 函数；在其中 \`app.component/directive/provide/config.globalProperties\` 注册全局能力；\`app.use\` 幂等执行一次。`
  },
  {
    id: 'vue-053',
    category: 'vue',
    title: 'render 函数、h 函数和 JSX 在 Vue 3 中怎么用？函数式组件还有吗？',
    difficulty: '困难',
    tags: ['render', 'h函数', 'JSX', '函数式组件'],
    answer: `## 何时需要 render

模板适合声明式 UI；但以下场景用 render 更合适：
- 根据复杂条件动态拼装结构（如表格列配置）。
- 高阶组件、按 props 渲染不同标签。
- 类型安全的复杂逻辑。

## h 函数（createVNode 的简写）

\`h(type, props, children)\`：

\`\`\`js
import { h } from 'vue'

export default {
  render() {
    return h('div', { class: 'box' }, [
      h('h1', this.title),
      h('p', '内容')
    ])
  }
}
\`\`\`

### props

\`class\`/\`style\` 支持对象/数组；事件用 \`onClick\`/\`onInput\`；attrs 直接传。

### children

- 字符串/数字 → 文本节点。
- 数组 → 多个子节点。
- 对象 → 插槽（\`{ default: () => ..., header: () => ... }\`）。

## 在 setup 中返回 render

\`\`\`js
import { h, ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return () => h('button', { onClick: () => count.value++ }, \`count: \${count.value}\`)
  }
}
\`\`\`

返回函数（而非对象）即表示用 render 渲染，setup 内的 ref 自动解包。

## JSX

配置 \`@vitejs/plugin-vue-jsx\` 后可直接写 JSX：

\`\`\`jsx
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const count = ref(0)
    return () => (
      <button onClick={() => count.value++}>count: {count.value}</button>
    )
  }
})
\`\`\`

JSX 编译后等价于一系列 \`h()\` 调用。指令在 JSX 中用 \`v-model\` 不便，可写展开形式或用 \`v-slots\` 等。

## 函数式组件（Vue 3）

Vue 3 中**所有组件都是函数式组件**（无状态、无实例的概念弱化），不再需要 \`functional: true\`。一个返回 VNode 的纯函数就是函数式组件：

\`\`\`js
const Btn = (props, { slots, emit, attrs }) =>
  h('button', { onClick: emit('click') }, slots.default?.())

// 使用
<Btn onClick={handler}>点我</Btn>
\`\`\`

- 没有状态（无 data）、没有生命周期（除非用 setup 包装）。
- 适合纯展示/无状态包装。

## 模板 vs render 选择

| | 模板 | render/JSX |
| --- | --- | --- |
| 可读性 | 高 | 中（JSX 较好） |
| 灵活性 | 受限于指令 | 完全 JS |
| 编译优化 | ✅ 静态提升/PatchFlag | 需手动优化 |
| TS | 较弱 | JSX 强 |

优先模板，复杂动态结构用 JSX。

## 一句话

\`h(type, props, children)\` 创建 VNode；setup 返回函数即 render；配 \`plugin-vue-jsx\` 写 JSX；Vue 3 函数式组件就是返回 VNode 的函数，无需 \`functional\` 标记。`
  },
  {
    id: 'vue-054',
    category: 'vue',
    title: 'Transition 和 TransitionGroup 怎么实现动画？CSS 与 JS 钩子如何配合？',
    difficulty: '中等',
    tags: ['Transition', 'TransitionGroup', '动画', '过渡'],
    answer: `## Transition：单元素/组件过渡

对 **v-if / v-show / 单组件切换** 的进入/离开加过渡。

\`\`\`vue
<Transition name="fade">
  <p v-if="show">hello</p>
</Transition>
\`\`\`

\`\`\`css
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
\`\`\`

### 过程类名

| 阶段 | 类名 |
| --- | --- |
| 进入起点 | \`v-enter-from\`（\`name-enter-from\`） |
| 进入过渡 | \`v-enter-active\` |
| 进入终点 | \`v-enter-to\` |
| 离开起点 | \`v-leave-from\` |
| 离开过渡 | \`v-leave-active\` |
| 离开终点 | \`v-leave-to\` |

\`name\` 替换 \`v\` 前缀，可用 \`enter-active-class\` 等自定义。

### 常用属性

- \`appear\`：首次渲染也触发进入过渡。
- \`mode="out-in"\`：先离开再进入（避免同时占位）。
- \`type="transition"\` / \`"animation"\`：监听哪种事件结束。
- \`duration\`：强制时长。

\`\`\`html
<Transition mode="out-in" appear>
  <component :is="view" />
</Transition>
\`\`\`

## JS 钩子

\`\`\`vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  :css="false"
>
  <div v-if="show">...</div>
</Transition>
\`\`\`

\`:css="false"\` 告诉 Vue 跳过 CSS 过渡检测，完全由 JS 控制；回调需手动调用 \`done\`：

\`\`\`js
import gsap from 'gsap'
function onEnter(el, done) {
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5, onComplete: done })
}
\`\`\`

## TransitionGroup：列表过渡

对 **v-for 列表** 的增删和移动加过渡。

\`\`\`vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</TransitionGroup>
\`\`\`

- \`tag\`：渲染成什么标签（默认 \`<span>\`）。
- 必须给每个子元素 **key**。
- 多了 **\`v-move\`** 类：元素移动时的过渡（用 \`transform\` 配合 \`FLIP\`）。

\`\`\`css
.list-move { transition: transform .4s; }
.list-enter-active, .list-leave-active { transition: all .4s; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }
.list-leave-active { position: absolute; } /* 离开元素脱离布局，让移动过渡生效 */
\`\`\`

## 原理

- **FLIP 技术**：记录 First（初始位置）→ Last（最终位置）→ Invert（立即反转到初始）→ Play（过渡到最终）。
- TransitionGroup 用 FLIP 实现元素位置变化的平滑动画。

## 一句话

\`Transition\` 用于单元素进出场，6 个类名控制；\`TransitionGroup\` 用于列表增删+移动（\`v-move\`）；JS 钩子配 \`:css="false"\` 接 GSAP 等库。`
  },
  {
    id: 'vue-055',
    category: 'vue',
    title: 'Vue 3 的错误处理机制？errorCaptured 和全局 errorHandler 怎么用？',
    difficulty: '中等',
    tags: ['错误处理', 'errorCaptured', 'errorHandler', '生命周期'],
    answer: `## 错误传播路径

Vue 组件渲染/生命周期/事件处理中抛出的错误，会沿组件树**向上冒泡**，直到被捕获或到达顶层。

## 1. 组件内：errorCaptured / onErrorCaptured

捕获**后代组件**抛出的错误（不含自身）。

\`\`\`js
// Options API
errorCaptured(err, instance, info) {
  // err: 错误对象
  // instance: 出错组件实例
  // info: 描述（如 'render function'、'setup function'）
  return false  // 阻止继续向上冒泡
}

// Composition API
import { onErrorCaptured } from 'vue'
onErrorCaptured((err, instance, info) => {
  console.error(err)
  return false
})
\`\`\`

### 返回值

- \`return false\`：停止向上传播。
- \`return undefined\` 或不返回：继续冒泡。
- 抛出新错误：替换原错误继续冒泡。

## 2. 全局：app.config.errorHandler

捕获整个应用**未被组件拦截**的错误：

\`\`\`js
app.config.errorHandler = (err, instance, info) => {
  // 上报到监控（Sentry、自建日志）
  trackError(err, info)
}
\`\`\`

优先级：组件 \`errorCaptured\` → 全局 \`errorHandler\`。若组件返回 false 则不进全局。

## 3. app.config.warnHandler

捕获 Vue 的开发警告（仅 dev 生效）：

\`\`\`js
app.config.warnHandler = (msg, instance, trace) => {}
\`\`\`

## 4. 异步错误

- \`setTimeout\` / \`Promise\` 内抛错**不会**进 Vue 的错误处理（脱离组件上下文），需 try/catch 或 \`window.onerror\` / \`unhandledrejection\`。
- 组件内 \`await\` 的错误会被捕获（仍在上下文内）。

## 5. 与 Suspense 配合

async setup 抛错 → Suspense 的 \`errorCaptured\` 可捕获，显示降级 UI：

\`\`\`vue
<script setup>
import { ref, onErrorCaptured } from 'vue'
const err = ref(null)
onErrorCaptured((e) => { err.value = e; return false })
</script>
<template>
  <Suspense v-if="!err">
    <template #default><AsyncComp /></template>
    <template #fallback><Loading /></template>
  </Suspense>
  <ErrorView v-else :error="err" />
</template>
\`\`\`

## 实战：错误边界组件

封装一个 ErrorBoundary：

\`\`\`vue
<script setup>
import { ref, onErrorCaptured } from 'vue'
const err = ref(null)
onErrorCaptured((e) => { err.value = e; return false })
</script>
<template>
  <slot v-if="!err" />
  <div v-else class="error">出错了：{{ err.message }}</div>
</template>
\`\`\`

## 一句话

错误沿组件树向上冒泡；\`errorCaptured\` 捕获后代错误（return false 阻断）；\`app.config.errorHandler\` 兜底全局；异步脱离上下文的错误需 try/catch。`
  },
  {
    id: 'vue-056',
    category: 'vue',
    title: 'Vue 3 事件修饰符有哪些？编译后是什么样？',
    difficulty: '中等',
    tags: ['事件', '修饰符', 'v-on', '编译'],
    answer: `## 修饰符列表

\`\`\`html
<!-- 阻止默认行为 -->
<a @click.prevent="fn">  等价 e.preventDefault()
<!-- 阻止冒泡 -->
<div @click.stop="fn">   等价 e.stopPropagation()
<!-- 仅当事件 target 是当前元素时触发 -->
<div @click.self="fn">
<!-- 只触发一次 -->
<button @click.once="fn">
<!-- 捕获阶段监听 -->
<div @click.capture="fn">
<!-- 滚动不阻塞（passive） -->
<div @scroll.passive="fn">
<!-- 按键/系统修饰 -->
<input @keyup.enter="fn">
<input @keyup.ctrl.s="fn">
<!-- 鼠标按键 -->
<div @click.left/.right/.middle="fn">
<!-- exact 精确修饰 -->
<input @click.ctrl.exact="fn">  <!-- 仅 ctrl，不能有其他键 -->
\`\`\`

## 链式修饰符

\`\`\`html
<a @click.prevent.stop="fn">  <!-- 先 prevent 再 stop，顺序即书写顺序 -->
\`\`\`

## v-model 修饰符

\`.lazy\` \`.number\` \`.trim\`（见 v-model 题）。

## 编译结果

修饰符不是运行时字符串解析，而是**编译期**生成对应的包装函数：

\`\`\`html
<!-- 模板 -->
<button @click.prevent="fn">x</button>
\`\`\`

编译后大致：

\`\`\`js
h('button', {
  onClick: withModifiers(fn, ['prevent'])
})
\`\`\`

\`withModifiers(fn, modifiers)\` 返回一个包装函数，按修饰符顺序执行对应操作：

\`\`\`js
function withModifiers(fn, modifiers) {
  return (e, ...args) => {
    if (modifiers.includes('stop')) e.stopPropagation()
    if (modifiers.includes('prevent')) e.preventDefault()
    if (modifiers.includes('self') && e.target !== e.currentTarget) return
    // ...按键/系统修饰判断
    return fn(e, ...args)
  }
}
\`\`\`

\`withKeys\` 处理按键修饰符（\`@keyup.enter\`）。

## .passive 的意义

\`\`@scroll.passive\` 编译为 \`addEventListener('scroll', fn, { passive: true })\`，告诉浏览器不会 \`preventDefault\`，可优化滚动性能（移动端尤其明显）。

## .capture 与 .once

\`.capture\` → \`addEventListener\` 第三个参数 \`{ capture: true }\`；
\`.once\` → \`{ once: true }\`，触发后自动解绑。

## 自定义组件事件修饰符

组件上的 \`@click.native\` 在 Vue 3 已移除（根元素自动继承）。自定义事件可用 \`emit\`，修饰符由开发者自行处理（通过 \`emit\` 的第二参数 \`modifiers\`）。

## 一句话

事件修饰符 \`.stop/.prevent/.self/.once/.capture/.passive\` + 按键/系统修饰符；编译期生成 \`withModifiers\`/\`withKeys\` 包装函数；\`.passive\` 优化滚动。`
  },
  {
    id: 'vue-057',
    category: 'vue',
    title: 'customRef 是什么？如何用它实现防抖 ref？',
    difficulty: '困难',
    tags: ['customRef', '防抖', '响应式', '底层'],
    answer: `## 作用

\`customRef\` 让你**自定义依赖追踪和触发更新**的逻辑，返回一个 ref 对象。签名：

\`\`\`js
import { customRef } from 'vue'
const myRef = customRef((track, trigger) => ({
  get() { track(); return value },
  set(newVal) { value = newVal; trigger() }
}))
\`\`\`

- \`track()\`：在 get 中调用，告诉 Vue "此处依赖此 ref"。
- \`trigger()\`：在 set 中调用，通知 Vue "此 ref 变了，请更新"。

默认 ref 自动做这两件事，customRef 让你能**插入额外逻辑**（延迟触发、条件触发、副作用）。

## 实现：防抖 ref

需求：搜索框输入时，ref 值立即变，但**触发组件更新延迟**（防抖），避免每次按键都重渲染。

\`\`\`js
import { customRef } from 'vue'

function debouncedRef(value, delay = 300) {
  let timer
  return customRef((track, trigger) => ({
    get() {
      track()                  // 依赖收集
      return value
    },
    set(newVal) {
      value = newVal           // 值立即更新
      clearTimeout(timer)
      timer = setTimeout(() => {
        trigger()              // 延迟触发更新
      }, delay)
    }
  }))
}

// 使用
const keyword = debouncedRef('', 300)
\`\`\`

模板中 \`<input v-model="keyword" />\`，每次输入 \`keyword\` 值立刻变（get 返回最新），但 trigger 被防抖，组件 300ms 内只更新一次。

## 与 watch 防抖的区别

- \`watch\` + 防抖：值变化立即触发依赖更新，watch 回调防抖。**组件仍每次重渲染**，只是回调延迟。
- \`customRef\` 防抖：**触发更新本身**被防抖，组件不重渲染，更彻底。

## 应用场景

- **输入防抖**：搜索框、保存草稿。
- **自定义存储**：ref 与 localStorage 同步，get 读缓存，set 写存储 + trigger。
- **条件触发**：仅当值满足条件才 trigger。
- **批量更新**：多个 set 合并为一次 trigger。

## 与 ref 的区别

| | ref | customRef |
| --- | --- | --- |
| 追踪/触发 | 自动 | 手动 track/trigger |
| 灵活性 | 低 | 高 |
| 典型用途 | 普通响应式值 | 需要定制追踪/触发时机 |

## 一句话

\`customRef\` 自定义 track/trigger 时机；用它实现防抖 ref 可让"触发更新"本身被延迟，比 watch 防抖更彻底。`
  },
  {
    id: 'vue-058',
    category: 'vue',
    title: 'markRaw / readonly / toRaw / unref 这些工具 API 有什么用？',
    difficulty: '中等',
    tags: ['markRaw', 'readonly', 'toRaw', 'unref', '工具API'],
    answer: `## toRaw：取代理的原对象

\`reactive\` 返回 Proxy，\`toRaw\` 取回被代理的原始对象。

\`\`\`js
import { reactive, toRaw } from 'vue'
const state = reactive({ a: 1 })
toRaw(state) === rawObj  // true（原始对象）
\`\`\`

用途：传给**不需要响应式**的第三方库（如 Map 实例、echarts、地图组件），避免被代理干扰；或做引用比较。

⚠️ 不应通过 toRaw 修改数据来"绕过响应式"，会让状态不可预测。

## markRaw：永久标记不被代理

标记一个对象**永远不转成响应式**：

\`\`\`js
import { reactive, markRaw } from 'vue'
class ThirdParty { /* ... */ }
const state = reactive({
  instance: markRaw(new ThirdParty())  // 不会被代理
})
\`\`\`

用途：
- 第三方类实例（地图、图表、复杂对象），代理它们无意义且可能出错。
- 大对象不需要响应式追踪（性能）。

\`markRaw\` 设置 \`__v_skip\` 标记，reactive 见此标记直接返回原对象。

## readonly：只读代理

返回一个**只读**响应式代理，修改会报警告：

\`\`\`js
import { reactive, readonly } from 'vue'
const original = reactive({ count: 0 })
const copy = readonly(original)
copy.count = 1  // ⚠️ Set operation on key "count" failed: target is readonly
\`\`\`

- readonly 仍**响应式**：original 改了，copy 触发更新。
- 常配合 \`provide\` 给后代只读数据，防止误改。

\`shallowReadonly\`：只读第一层，嵌套属性可改。

## unref：取 ref 的值

\`unref(x)\`：若 x 是 ref 返回 \`.value\`，否则返回 x。等价 \`isRef(x) ? x.value : x\`。

\`\`\`js
import { ref, unref } from 'vue'
const count = ref(0)
unref(count)  // 0
unref(5)      // 5
\`\`\`

用途：函数参数可能是 ref 也可能是普通值时，统一取值。

## 其他常用工具

| API | 作用 |
| --- | --- |
| \`isRef\` | 是否为 ref |
| \`isReactive\` | 是否为 reactive |
| \`isReadonly\` | 是否为 readonly |
| \`isProxy\` | 是否为 reactive 或 readonly |
| \`toRef\` | 把 reactive 属性转成 ref（保持联动） |
| \`toRefs\` | 把 reactive 所有属性转成 ref 集合 |
| \`shallowRef\` | 浅 ref（.value 替换才触发，不深层追踪） |
| \`shallowReactive\` | 浅 reactive（只代理第一层） |
| \`triggerRef\` | 手动触发 shallowRef 的更新 |

## 典型搭配

- 传给第三方库：\`markRaw\` 或 \`toRaw\`。
- 对外暴露只读配置：\`readonly\` + \`provide\`。
- 通用工具函数参数：\`unref\` 取值。

## 一句话

\`toRaw\` 取原对象、\`markRaw\` 永久跳过代理、\`readonly\` 只读响应式、\`unref\` 安全取 ref 值；常用于第三方库交互与防御性编程。`
  },
  {
    id: 'vue-059',
    category: 'vue',
    title: 'Vue 3 相比 Vue 2 有哪些核心变化？',
    difficulty: '中等',
    tags: ['Vue2', 'Vue3', '对比', '响应式', '编译'],
    answer: `## 1. 响应式：Object.defineProperty → Proxy

| | Vue 2 | Vue 3 |
| --- | --- | --- |
| 实现 | \`Object.defineProperty\` 递归遍历 | \`Proxy\` + \`Reflect\` |
| 新增属性 | 需 \`Vue.set\` / \`this.\$set\` | 直接赋值即可（Proxy 拦截） |
| 删除属性 | 需 \`Vue.delete\` | 直接 \`delete\` |
| 数组索引/长度 | 需重写 7 个方法 | 原生支持 |
| Map/Set | 不支持 | 支持 |
| 初始化 | 全量递归（性能损耗） | 惰性代理（访问到才代理子层） |

## 2. API 风格：Options → Composition

- Vue 2：\`data/methods/computed/watch\` 按选项组织，逻辑分散。
- Vue 3：\`setup\` + 组合式函数，按**功能**聚合，可提取为 composable 复用。
- 仍兼容 Options API，两者可混用。

## 3. 模板：单根 → 多根（Fragment）

Vue 2 模板必须有**单个根节点**；Vue 3 支持多根（Fragment），减少无意义包裹 div。

## 4. 编译优化

- **静态提升**：静态节点提取到 render 函数外，只创建一次。
- **PatchFlag**：动态节点打标记，diff 时只对比动态部分。
- **Block Tree**：以动态节点为根组织，跳过静态子树。
- **缓存事件处理函数**：\`@click="fn"\` 内联函数被缓存。
- 模板编译产物体积更小、运行时更快。

## 5. TypeScript

- Vue 2 用 \`vue-class-component\` / \`Vue.extend\`，TS 支持有限。
- Vue 3 源码用 TS 重写，组件、props、emit、ref、provide/inject 均有完善类型推导。

## 6. 新增内置组件

- \`<Teleport>\`：DOM 传送。
- \`<Suspense>\`：异步组件编排。
- \`<Transition>\` / \`<TransitionGroup>\` 从独立包并入核心。

## 7. 全局 API 重构

| Vue 2 | Vue 3 |
| --- | --- |
| \`new Vue()\` | \`createApp()\` |
| \`Vue.use\` | \`app.use\` |
| \`Vue.component\` | \`app.component\` |
| \`Vue.directive\` | \`app.directive\` |
| \`Vue.prototype.\$x\` | \`app.config.globalProperties.\$x\` |
| \$on/\$emit/\$once（事件总线） | **移除**，用 mitt/Pinia |
| \`Vue.set\`/\$set | 移除（Proxy 直接支持） |

每个 app 实例独立，不再污染全局，便于多实例。

## 8. 生命周期改名

\`destroyed\` → \`unmounted\`，\`beforeDestroy\` → \`beforeUnmount\`，新增 setup 钩子 \`onXxx\`。

## 9. v-model 变化

- Vue 2：\`value\` + \`input\`，\`.sync\` 修饰符实现多绑定。
- Vue 3：\`modelValue\` + \`update:modelValue\`，支持 \`v-model:title\` 多绑定，移除 \`.sync\`。

## 10. Filter 移除

Vue 2 的 \`{{ x | filter }}\` 被移除，用 \`computed\` 或方法替代。

## 11. Tree-shaking

Vue 3 大量 API 改为按需引入（\`import { ref, computed } from 'vue'\`），未使用的部分被 tree-shake，打包更小。

## 12. 自定义指令钩子改名

见 vue-039。

## 一句话

Vue 3 = Proxy 响应式 + Composition API + Fragment + 编译优化（静态提升/PatchFlag/Block）+ 完善 TS + 全局 API 重构 + 新增 Teleport/Suspense + 移除事件总线/Filter/.sync。`
  },
  {
    id: 'vue-060',
    category: 'vue',
    title: 'Vue 3 响应式源码：依赖收集与派发更新的流程是怎样的？',
    difficulty: '困难',
    tags: ['响应式原理', 'track', 'trigger', 'effect', '源码'],
    answer: `## 核心 API

- \`reactive(obj)\`：返回 Proxy。
- \`effect(fn)\`：把 fn 包装成响应式 effect，首次执行时收集依赖，依赖变化时重新执行。
- \`track(target, key)\`：get 时调用，记录"当前 effect 依赖了 target.key"。
- \`trigger(target, key)\`：set 时调用，找出依赖 target.key 的所有 effect 并执行。

## 数据结构

\`\`\`
targetMap: WeakMap<target, Map<key, Set<effect>>>
\`\`\`

- 外层 WeakMap：以原始对象为 key（不阻止 GC）。
- 中层 Map：以属性 key 为 key。
- 内层 Set（dep）：依赖此属性的所有 effect。

\`\`\`js
targetMap.get(obj).get('count')  // Set<effect>
\`\`\`

## 依赖收集（track）

1. \`effect(fn)\` 执行 fn 前，把 fn 设为"当前活跃 effect"（\`activeEffect\`）。
2. fn 执行中访问 \`state.count\` → 触发 Proxy 的 get 拦截。
3. get 中调用 \`track(state, 'count')\`：
   - 取出 \`targetMap.get(state).get('count')\`（dep Set）。
   - 把 \`activeEffect\` 加入 dep。
   - 同时把 dep 加入 effect 的依赖列表（用于清理过期依赖）。
4. fn 执行完，清空 \`activeEffect\`。

## 派发更新（trigger）

1. \`state.count = 2\` → 触发 Proxy 的 set 拦截。
2. set 中调用 \`trigger(state, 'count')\`：
   - 取出 \`dep = targetMap.get(state).get('count')\`。
   - 遍历 dep 中的每个 effect，执行（但**不是立即同步执行**，见调度）。

## effect 的 scheduler 与调度

\`effect(fn, { scheduler })\`：若提供 scheduler，依赖变化时**调用 scheduler 而非直接重跑 fn**。

Vue 的组件渲染 effect、computed、watch 都基于此：

- **组件渲染**：scheduler 把 effect 放入**微任务队列**（\`Promise.then\`，即 nextTick），同一 tick 内多次修改只渲染一次。
- **computed**：scheduler 仅置 \`dirty = true\`，惰性重算。
- **watch**：scheduler 调用用户回调（按 flush 选项决定时机）。

## 完整流程示例

\`\`\`js
const state = reactive({ count: 0 })
effect(() => { console.log(state.count) })  // 打印 0
state.count = 1   // set → trigger → effect 重跑 → 打印 1
\`\`\`

\`\`\`
effect 执行 → 访问 state.count → track 记录 activeEffect 到 dep
state.count = 1 → trigger → 找到 dep 中的 effect → scheduler 入队微任务
微任务执行 → effect 重跑 → 重新 track（先清理旧依赖再收集新依赖）
\`\`\`

## 依赖清理（避免过期依赖）

effect 每次重跑前会**先清空自己上一次的依赖**（dep.delete(this)），然后重新收集。这样当 fn 内的条件分支变化（如 if 改变了访问的属性），旧的依赖会被移除，避免"已不再访问的属性变化仍触发更新"。

## 嵌套 effect 与 scope

- 嵌套 effect 用栈管理 \`activeEffect\`（外层压栈，内层执行完恢复）。
- \`effectScope\` 统一管理一组 effect 的生命周期，便于批量停止。

## computed / watch 与 effect 的关系

- \`computed\` = \`effect\`（惰性 + 缓存 + dirty 标记）。
- \`watch\` = \`effect\`（显式 source + scheduler 回调 + 旧值收集）。
- 组件渲染 = \`effect\`（render 函数 + scheduler 入队 nextTick）。

三者底层都是 \`ReactiveEffect\`。

## 一句话

\`targetMap\` 存储 target→key→dep(effect 集合)；get 时 \`track\` 把当前 effect 加入 dep，set 时 \`trigger\` 通知 dep 中的 effect；通过 scheduler 实现异步批量更新与 computed/watch 的不同行为。`
  },
  {
    id: 'vue-061',
    category: 'vue',
    title: 'Vue 3 的调度器（scheduler）与 nextTick 是什么关系？',
    difficulty: '困难',
    tags: ['调度器', 'scheduler', 'nextTick', '微任务', '异步更新'],
    answer: `## 为什么需要调度

响应式数据变化会触发 \`trigger\`，但**直接同步重跑所有 effect** 有问题：

1. **性能**：同一 tick 内多次修改 \`state.a = 1; state.a = 2\`，应只渲染一次。
2. **一致性**：组件渲染应等所有同步代码改完数据后再统一执行，避免中间态。
3. **顺序**：watch 回调、组件渲染、computed 重新计算需按特定时机。

调度器（scheduler）负责**收集、去重、排队、按时机执行**这些任务。

## 三种队列

Vue 3 内部维护：

1. **pre 队列**：组件更新**前**执行（\`flush: 'pre'\` 的 watch）。
2. **job**（组件渲染）：组件的 render effect。
3. **post 队列**：组件更新**后**执行（\`flush: 'post'\` 的 watch、Transition 钩子）。

每个 job 有 \`id\`（组件实例 id），按 id 升序执行，保证**父组件先于子组件**更新。

## 调度流程

1. 数据变化 → trigger → 把 job 加入对应队列（若已在队列则跳过去重）。
2. 标记 \`isFlushPending = true\`，通过 \`Promise.resolve().then(flushJobs)\` 把刷新动作排入**微任务**。
3. 当前同步代码继续执行（可能继续往队列加 job）。
4. 同步代码结束 → 微任务执行 \`flushJobs\`：
   - 排序（pre → job → post，按 id）。
   - 去重后依次执行。
   - 清空 \`isFlushPending\`。

## nextTick 的本质

\`nextTick(fn)\` 返回一个 Promise，\`fn\` 在**下一次 flush 之后**执行：

\`\`\`js
const resolvedPromise = Promise.resolve()
let currentFlushPromise = null

export function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(fn) : p
}
\`\`\`

- 首次入队时创建 \`currentFlushPromise = resolvedPromise.then(flushJobs)\`。
- \`nextTick\` 把你的回调接在 \`currentFlushPromise\` 之后，因此**在组件渲染之后**执行，此时 DOM 已更新。

\`\`\`js
import { nextTick } from 'vue'
state.count = 1
nextTick(() => { /* DOM 已是更新后的 */ })
\`\`\`

## 为什么是微任务

微任务在当前同步任务结束后、下一次宏任务前执行，时延最短且不阻塞渲染。Vue 2 用 \`MutationObserver\` / \`Promise.then\`，Vue 3 统一用 \`Promise.resolve().then\`。

## flush 选项与调度

\`watch\` 的 \`flush\` 决定回调进哪个队列：

- \`'pre'\`（默认）：组件更新前。
- \`'post'\`：组件更新后（DOM 已更新），等价于在 nextTick 后。
- \`'sync'\`：跳过调度，trigger 时同步执行（不推荐，可能多次执行）。

## 顺序保证

- 父组件 id < 子组件 id → 父先更新，符合直觉。
- 多次修改同一数据 → 队列去重 → 只渲染一次。
- \`nextTick\` 永远在所有 job 之后。

## 一句话

调度器把数据变化触发的 effect 收集到队列，通过 \`Promise.resolve().then\` 异步批量执行；\`nextTick\` 把回调接在 flush 的 Promise 之后，确保 DOM 已更新；\`flush\` 选项决定 watch 回调在更新前/后执行。`
  },
  {
    id: 'vue-062',
    category: 'vue',
    title: 'Vue 3 编译器三大阶段 parse / transform / generate 各做什么？',
    difficulty: '困难',
    tags: ['编译器', 'parse', 'transform', 'generate', 'AST'],
    answer: `## 整体流程

模板字符串 → \`parse\` → AST → \`transform\` → 转换后 AST → \`generate\` → render 函数代码。

\`\`\`
<template>...</template>
   │ compile
   ▼
[parse]      词法/语法分析 → 模板 AST（描述 HTML 结构）
   ▼
[transform]  语义分析 + 优化 → 转换后 AST（含动态信息、PatchFlag、静态提升）
   ▼
[generate]   代码生成 → render 函数字符串
\`\`\`

## 1. parse：解析

把模板字符串解析成**抽象语法树（AST）**，节点类型有 Root / Element / Text / Interpolation（插值） / Comment 等。

\`\`\`html
<div>{{ msg }}</div>
\`\`\`

AST：

\`\`\`js
{
  type: 'Root',
  children: [{
    type: 'Element', tag: 'div',
    children: [{ type: 'Interpolation', content: { content: 'msg' } }]
  }]
}
\`\`\`

- 用状态机逐字符扫描，识别标签、属性、指令、插值、注释。
- 容错：处理自闭合、未闭合标签等。
- Vue 3 用手写解析器（非正则），性能与错误恢复更好。

## 2. transform：转换

遍历 AST，进行**语义分析与优化**，这是 Vue 3 编译优化的核心：

### 主要 transform

- **指令转换**：\`v-if\` → 三元/条件，\`v-for\` → \`renderList\`，\`v-model\` → \`value+onInput\`，\`v-on\` → \`onXxx\`。
- **静态提升（hoistStatic）**：纯静态节点提取为模块级常量 \`_hoisted_1\`，render 时复用，不参与 diff。
- **PatchFlag**：分析动态绑定，给元素打标记（\`TEXT\` / \`CLASS\` / \`PROPS\` / \`FULL_PROPS\` / \`KEYED_FRAGMENT\` 等），diff 时只比较标记部分。
- **Block Tree**：以动态节点为根组织 \`openBlock\`/\`createBlock\`，收集动态子节点，跳过静态子树。
- **缓存事件**：\`@click="fn"\` 内联函数用 \`cacheHandlers\` 缓存，避免每次 render 创建新函数。
- **文本合并**：相邻静态文本合并。

转换后的 AST 节点带上 \`codegenNode\`，包含生成代码所需的所有信息。

## 3. generate：代码生成

遍历转换后的 AST，拼接成 **JavaScript 代码字符串**：

\`\`\`js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = { class: "box" }   // 静态提升

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("p", null, _toDisplayString(_ctx.msg), 1 /* TEXT */)
  ]))
}
\`\`\`

- 用 \`_ctx\` 访问组件状态，\`_cache\` 缓存事件处理函数。
- PatchFlag 作为 \`createVNode\` 的第 4 参数（\`1\` = TEXT）。

## 三大阶段的协作

| 阶段 | 输入 | 输出 | 关注点 |
| --- | --- | --- | --- |
| parse | 模板字符串 | 模板 AST | 结构正确、容错 |
| transform | 模板 AST | 转换后 AST | 语义、优化 |
| generate | 转换后 AST | render 代码 | 代码生成 |

## 与运行时的关系

编译产物（render 函数）在运行时执行，调用 \`createVNode\`/\`createElementBlock\` 等运行时 API 生成 VNode 树，再由 patcher 渲染/更新 DOM。PatchFlag、Block Tree 等编译期信息直接被运行时 diff 利用。

## 一句话

\`parse\` 把模板变 AST，\`transform\` 做指令转换 + 静态提升 + PatchFlag + Block Tree 优化，\`generate\` 拼出调用运行时 API 的 render 函数——这就是 Vue 3 编译期性能优化的来源。`
  },
  {
    id: 'vue-063',
    category: 'vue',
    title: 'v-if、v-show、v-for 该如何选用？为什么 v-if 和 v-for 不建议一起用？',
    difficulty: '简单',
    tags: ['v-if', 'v-show', 'v-for', '条件渲染'],
    answer: `## v-if vs v-show

| | v-if | v-show |
| --- | --- | --- |
| 实现 | 条件为 false 时**不渲染**（DOM 不存在） | 始终渲染，切换 \`display: none\` |
| 初始开销 | 低（不渲染） | 高（先渲染再隐藏） |
| 切换开销 | 高（创建/销毁组件） | 低（改 CSS） |
| 适用 | 不频繁切换、初始可能不显示 | 频繁切换 |
| 触发生命周期 | 切换时 mount/unmount | 不触发（首次后） |
| 支持 \`<template>\` | ✅ | ❌（需真实元素） |

\`\`\`html
<div v-if="show">条件渲染</div>
<div v-show="show">显示控制</div>
\`\`\`

### 选择

- 权限控制、路由级显隐、首次大概率不显示 → **v-if**（省首屏渲染）。
- Tab 切换、折叠面板、tooltip → **v-show**（切换快、保留状态）。
- 含重型子组件且切换频繁 → v-show（避免反复创建销毁）。
- 含重型子组件且切换少 → v-if（避免一直占内存）。

## v-for

\`\`\`html
<li v-for="item in list" :key="item.id">{{ item.name }}</li>
\`\`\`

- 必须给 **key**（见 vue-043）。
- 建议用 \`v-for\` 的元素同层不要再加 \`v-if\`。

## 为什么 v-if 和 v-for 不建议一起用

### Vue 2 vs Vue 3 优先级

| | 优先级 |
| --- | --- |
| Vue 2 | \`v-for\` > \`v-if\`（先循环再判断） |
| Vue 3 | \`v-if\` > \`v-for\`（先判断再循环） |

### 问题

Vue 2 中：

\`\`\`html
<!-- Vue 2：每次循环都执行 v-if，即使大部分被过滤，仍遍历整个 list -->
<li v-for="user in users" v-if="user.active" :key="user.id">{{ user.name }}</li>
\`\`\`

性能差：每次渲染都全量遍历再过滤。应改为 computed 预过滤：

\`\`\`js
const activeUsers = computed(() => users.value.filter(u => u.active))
\`\`\`

\`\`\`html
<li v-for="user in activeUsers" :key="user.id">{{ user.name }}</li>
\`\`\`

Vue 3 中 \`v-if\` 优先级更高，但 \`v-if\` 无法访问 \`v-for\` 的循环变量：

\`\`\`html
<!-- Vue 3：v-if 先执行，此时 user 还未定义 → 报错 -->
<li v-for="user in users" v-if="user.active">{{ user.name }}</li>
\`\`\`

### 正确做法

- **过滤**：用 computed 预过滤列表，再 v-for。
- **整体控制**：若要控制整个列表显隐，把 v-if 放到外层包裹元素：

\`\`\`html
<ul v-if="showList">
  <li v-for="user in users" :key="user.id">{{ user.name }}</li>
</ul>
\`\`\`

- 或用 \`<template v-for>\` + 内层 \`v-if\`（仍不推荐，computed 更清晰）。

## 一句话

v-if 控制存在（适合低频/首屏省渲染），v-show 控制 display（适合高频切换）；v-if 与 v-for 同元素有优先级陷阱且性能差，用 computed 预过滤或外层包裹分离。`
  },
  {
    id: 'vue-064',
    category: 'vue',
    title: 'scoped 样式隔离原理是什么？:deep / :slotted / :global 怎么用？',
    difficulty: '中等',
    tags: ['scoped', '样式隔离', ':deep', 'CSS'],
    answer: `## scoped 原理

\`<style scoped>\` 让样式只作用于当前组件。Vue 通过：

1. 给当前组件模板的每个元素加一个**唯一 data 属性**，如 \`data-v-abc123\`。
2. 把选择器编译为**属性选择器**：

\`\`\`css
/* 写法 */
.btn { color: red; }
/* 编译后 */
.btn[data-v-abc123] { color: red; }
\`\`\`

子组件根元素会同时带**父和子**的 data 属性（便于父组件覆盖子组件根元素样式），但子组件内部元素只有子组件的 data 属性。

## 为什么需要 :deep

scoped 下，父组件无法影响子组件内部元素（因为它们的 data 属性不同）。要穿透：

\`\`\`css
/* 父组件，影响子组件 .el-input 内部 */
:deep(.el-input__inner) { border-color: red; }
\`\`\`

编译后（注意 :deep 后的选择器**不加** data 属性）：

\`\`\`css
[data-v-父] .el-input__inner { border-color: red; }
\`\`\`

### Vue 2 vs Vue 3 写法

| | Vue 2 | Vue 3 |
| --- | --- | --- |
| 穿透 | \`>>>\` / \`/deep/\` / \`::v-deep\` | \`::v-deep(.x)\` / \`:deep(.x)\`（推荐） |

\`\`\`css
/* Vue 3 推荐 */
:deep(.el-input__inner) { }
/* 也支持 */
::v-deep(.el-input__inner) { }
\`\`\`

## :slotted：影响插槽内容

父组件传入子组件插槽的内容，渲染在子组件作用域，但数据属性是**父组件的**。\`:slotted\` 让子组件的 scoped 样式能影响传进来的插槽内容：

\`\`\`css
/* 子组件 <style scoped> */
:slotted(.item) { color: blue; }
\`\`\`

编译后选择器带子组件 data 属性 + 父传入元素也带子组件 data 属性（slot 内容特殊处理）。

## :global：全局样式

scoped 块内声明全局样式：

\`\`\`css
<style scoped>
:global(.global-class) { z-index: 9999; }
</style>
\`\`\`

或单独写一个不带 scoped 的 \`<style>\` 块。

## CSS Modules 替代方案

\`<style module>\` 把类名编译成哈希，JS 中通过 \`$style.className\` 访问，作用域更严格、可编程：

\`\`\`html
<template>
  <div :class="\$style.box"></div>
</template>
<style module>
.box { color: red; }
</style>
\`\`\`

## 常见坑

- **scoped 优先级**：属性选择器优先级 = 类 + 属性，覆盖第三方库时可能不够，需提高特异性或用 \`!important\` 或 \`:deep\`。
- **影响子组件根元素**：可直接写选择器（根元素带父 data 属性），但内部元素需 \`:deep\`。
- **动态 class 与 scoped**：动态绑定的 class 仍会带 data 属性，正常生效。

## 一句话

scoped 靠 \`data-v-xxx\` 属性选择器隔离；\`:deep\` 穿透到子组件内部，\`:slotted\` 影响插槽内容，\`:global\` 声明全局；Vue 3 推荐函数式写法 \`:deep(.x)\`。`
  },
  {
    id: 'vue-065',
    category: 'vue',
    title: 'Vue 3 常见的性能优化手段有哪些？',
    difficulty: '中等',
    tags: ['性能优化', 'v-once', 'KeepAlive', '虚拟滚动', '懒加载'],
    answer: `## 一、渲染优化

### 1. v-once / v-memo

- \`v-once\`：元素只渲染一次，后续更新跳过（静态内容、不再变化的标题）。
- \`v-memo\`：根据依赖数组决定是否跳过子树更新，适合"大列表项 + 偶尔更新"。

\`\`\`html
<header v-once>{{ title }}</header>
<div v-memo="[item.id, item.selected]" v-for="item in list">...</div>
\`\`\`

### 2. KeepAlive 缓存组件

切换时复用实例，避免重建（见 vue-042）。配合 \`max\` 控制内存。

### 3. 大列表虚拟滚动

万级数据不要全量渲染，用虚拟滚动只渲染可视区域：\`vue-virtual-scroller\`、\`@tanstack/vue-virtual\`。

### 4. shallowRef / shallowReactive

大对象只追踪第一层，避免深层代理开销（见 vue-058）。

### 5. computed 缓存

派生数据用 computed，避免 methods 每次重算（见 vue-046）。

## 二、编译优化（自动）

Vue 3 编译器已做：静态提升、PatchFlag、Block Tree、缓存事件。**保证用 SFC + 模板**而非纯手写 h 函数，才能享受这些优化。

## 三、资源/分包

### 1. 路由懒加载

\`\`\`js
{ path: '/about', component: () => import('./About.vue') }
\`\`\`

### 2. 异步组件

\`\`\`js
const Heavy = defineAsyncComponent(() => import('./Heavy.vue'))
\`\`\`

### 3. 图片懒加载

\`\`\`html
<img loading="lazy" src="..." />
\`\`\`

### 4. 预加载/预连接

\`\`\`html
<link rel="preload" as="image" href="hero.jpg">
<link rel="preconnect" href="https://cdn.x.com">
\`\`\`

## 四、响应式优化

### 1. 避免不必要的响应式

第三方实例（地图、echarts）用 \`markRaw\`；纯展示的大数据用 \`shallowRef\`。

### 2. 减少模板中的复杂表达式

重计算移到 computed，模板只做简单展示。

### 3. v-for 的 key

正确 key 减少 diff 开销（见 vue-043）。

### 4. 拆分组件

大组件拆小，使更新范围更小（响应式变化只重渲染对应子树）。

## 五、加载与运行

### 1. 首屏指标（LCP/CLS/INP）

- 关键 CSS 内联。
- 字体 \`font-display: swap\`。
- 避免 layout shift（图片设宽高）。

### 2. 防抖节流

搜索输入、resize/scroll 用 \`lodash\` 或自写防抖节流。

### 3. 事件销毁

定时器、订阅、addEventListener 必须在 \`onUnmounted\` 清理，避免内存泄漏。

## 六、SSR / 预渲染

- 内容站 SEO + 首屏：用 Nuxt 或 \`vite-ssg\` 预渲染。
- 首屏直出 HTML，避免空白等待 JS。

## 七、构建优化

- Vite 自动分包、tree-shake。
- 按需引入 UI 库（如 Element Plus 的 unplugin-vue-components）。
- 压缩、gzip/brotli、CDN。

## 检查清单

- [ ] 路由懒加载 + 异步组件
- [ ] 大列表虚拟滚动
- [ ] 静态内容 v-once / 大列表 v-memo
- [ ] computed 缓存派生数据
- [ ] key 正确
- [ ] shallowRef/markRaw 处理大对象
- [ ] 清理定时器/订阅
- [ ] 图片懒加载 + 尺寸
- [ ] 拆分组件控制更新范围
- [ ] 按需引入第三方库

## 一句话

Vue 3 性能优化 = 用模板享编译优化 + v-once/v-memo/KeepAlive/虚拟滚动控渲染 + 懒加载分包 + shallow/markRaw 减响应式开销 + 清理副作用防泄漏。`
  },
  {
    id: 'vue-066',
    category: 'vue',
    title: 'defineExpose、defineOptions、defineSlots 等 compiler macros 有哪些？',
    difficulty: '中等',
    tags: ['compiler macros', 'defineExpose', 'defineOptions', 'defineSlots'],
    answer: `## 什么是 compiler macros

\`<script setup>\` 中以 \`define\` 开头的"函数"是**编译器宏**——它们不是真实运行时函数，由编译器在编译期处理，转换成等价的 Options API 配置。因此**只能在 \`<script setup>\` 顶层使用**，不能在普通 JS 文件中调用，也不需要 import。

## 1. defineProps / defineEmits

声明 props 和 emits：

\`\`\`js
const props = defineProps({
  msg: String,
  count: { type: Number, default: 0 }
})
const emit = defineEmits(['update', 'close'])
\`\`\`

### 类型声明（TS）

\`\`\`ts
const props = defineProps<{ msg: string; count?: number }>()
const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'close'): void
}>()
// 3.3+ 更简洁
const emit = defineEmits<{ update: [value: number]; close: [] }>()
\`\`\`

### 运行时默认值（TS + withDefaults）

\`\`\`ts
const props = withDefaults(defineProps<{ msg?: string }>(), {
  msg: 'hello'
})
\`\`\`

## 2. defineExpose

\`<script setup>\` 默认**不暴露**任何内容给父组件 ref。用 \`defineExpose\` 显式暴露：

\`\`\`js
function focus() {}
function reset() {}
defineExpose({ focus, reset })
// 父：childRef.value.focus()
\`\`\`

## 3. defineOptions

\`<script setup>\` 无法直接写 Options（name、inheritAttrs 等），用 \`defineOptions\`（3.3+）：

\`\`\`js
defineOptions({
  name: 'UserCard',
  inheritAttrs: false
})
\`\`\`

也可定义局部 \`emits\`/\`props\` 之外的选项。3.3 之前需另写 \`<script>\` 块声明 name。

## 4. defineSlots（3.3+）

为插槽声明类型，便于在 TS 中约束插槽 props：

\`\`\`ts
defineSlots<{
  default(props: { item: Item }): any
  header?(): any
}>()
\`\`\`

配合 \`<slot :item="item" />\`，使用方有类型提示。

## 5. defineModel（3.4+）

一行实现 v-model（见 vue-037）：

\`\`\`js
const model = defineModel<string>()           // modelValue
const title = defineModel<string>('title')    // v-model:title
const capped = defineModel<string>({ get: v => v, set: v => v.toUpperCase() }) // 修饰符/转换
\`\`\`

## 6. defineProps / defineEmits 的运行时声明 vs 类型声明

- 运行时声明：\`defineProps({ msg: String })\`，运行时校验，生产可用。
- 类型声明：\`defineProps<Props>()\`，编译期擦除，无运行时校验（除非配 \`withDefaults\` 或声明 \`validators\`）。

两者**不能混用**，二选一。

## 7. useSlots / useAttrs（运行时 API，非宏）

虽非宏但常配合：

\`\`\`js
import { useSlots, useAttrs } from 'vue'
const slots = useSlots()
const attrs = useAttrs()
\`\`\`

## 宏的编译产物

\`\`\`js
// <script setup>
const props = defineProps(['msg'])
defineExpose({ foo: 1 })
\`\`\`

编译后大致：

\`\`\`js
export default {
  props: ['msg'],
  setup(__props, { expose }) {
    expose({ foo: 1 })
    // ...
  }
}
\`\`\`

## 一句话

\`defineProps/defineEmits/defineExpose/defineOptions/defineSlots/defineModel\` 是 \`<script setup>\` 专用编译器宏，编译期转为 Options；无需 import、只能在顶层用，TS 项目优先用类型声明形式。`
  }

]