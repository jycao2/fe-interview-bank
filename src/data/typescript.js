export const typescriptQuestions = [
  {
    id: 'ts-001',
    category: 'typescript',
    title: 'TypeScript 相比 JavaScript 有什么优势？',
    difficulty: '简单',
    tags: ['TS', '类型系统', '优势'],
    answer: `## 核心优势

1. **静态类型检查**：在编译期发现类型错误，避免运行时才暴露的 bug。
2. **更好的 IDE 支持**：智能补全、重构、跳转定义、即时错误提示，开发效率提升。
3. **代码即文档**：类型注解让函数签名、接口契约一目了然，提升可读性与可维护性。
4. **重构更安全**：大规模重构时，类型系统能帮你找出所有受影响的位置。
5. **团队协作更顺畅**：接口定义清晰，减少口头沟通成本。
6. **渐进式**：TS 是 JS 的超集，可逐步迁移；允许 any 渐进式改造。

## 代价

- 学习曲线、编译构建成本、类型定义维护成本。
- 对小型 / 快速原型项目可能过重。

## 编译

TS 不能直接运行，需通过 \`tsc\` 或 Babel / Vite（esbuild / SWC）转译为 JS。类型信息在编译后会被擦除（类型只在编译期起作用，运行时无类型）。`
  },
  {
    id: 'ts-002',
    category: 'typescript',
    title: 'interface 和 type 有什么区别？该如何选择？',
    difficulty: '中等',
    tags: ['interface', 'type', '类型别名'],
    answer: `## 共同点

都能描述对象类型，且都支持扩展。

## 区别

| 特性 | interface | type |
| --- | --- | --- |
| 语法 | 只能描述对象 / 类形状 | 可描述任意类型（联合、交叉、原始、元组等） |
| 扩展 | \`extends\` / 同名合并 | \`&\` 交叉类型 |
| 同名声明 | 自动合并（declaration merging） | 报错（不能重复） |
| 计算属性 | 不支持 | 支持（映射类型） |

## 示例

\`\`\`ts
// interface 合并
interface Box { width: number }
interface Box { height: number }
const b: Box = { width: 1, height: 2 }  // 合并后两者都有

// type 联合
type Status = 'idle' | 'loading' | 'done'
type Pair = [string, number]
type Foo = A & B
\`\`\`

## 选择建议

- 描述对象 / 类的形状、需要被 implements / extends、需要声明合并 → **interface**。
- 联合类型、元组、映射类型、工具类型组合 → **type**。
- 团队统一风格即可，二者多数场景可互换。`
  },
  {
    id: 'ts-003',
    category: 'typescript',
    title: 'any、unknown、never、void 的区别？',
    difficulty: '中等',
    tags: ['any', 'unknown', 'never', 'void'],
    answer: `## any（任意类型，放弃类型检查）

可以赋给任何类型、也可被任何类型赋值。等于关闭了类型检查，应尽量避免。

\`\`\`ts
let a: any = 1
a = 'x'
a.foo()  // 不报错（运行时可能崩）
\`\`\`

## unknown（安全的 any）

是类型安全的顶部类型：**可以接收任何值，但使用前必须先收窄（类型守卫）**。

\`\`\`ts
let u: unknown = JSON.parse(s)
u.toFixed()  // ❌ 报错
if (typeof u === 'number') u.toFixed()  // ✅
\`\`\`

> unknown 是 any 的安全替代，推荐用于"不确定类型"的入口（如 JSON.parse、第三方数据）。

## void（无返回值）

函数没有返回值时为 void。声明变量为 void 意义不大（只能赋 undefined/null）。

\`\`\`ts
function log(msg: string): void { console.log(msg) }
\`\`\`

## never（永不存在的值）

表示永远不会出现的值，是**底部类型**：

- 抛异常的函数、无限循环函数的返回类型。
- 用于穷尽检查（exhaustive check）：

\`\`\`ts
type Shape = 'circle' | 'square'
function area(s: Shape) {
  switch (s) {
    case 'circle': return ...
    case 'square': return ...
    default:
      const _exhaustive: never = s  // 若漏了分支，这里会报错
      return _exhaustive
  }
}
\`\`\`

## 类型层级

\`never < 具体类型 < unknown < any\`（any 既可上又可下，是逃生舱）。`
  },
  {
    id: 'ts-004',
    category: 'typescript',
    title: '什么是泛型？举例说明其使用场景。',
    difficulty: '中等',
    tags: ['泛型', 'generics', '类型参数'],
    answer: `## 定义

泛型是**类型的参数**——在定义时不指定具体类型，使用时再传入，从而实现"类型可复用、类型可推断、类型安全"。

\`\`\`ts
function identity<T>(value: T): T {
  return value
}
identity<number>(1)   // 显式
identity('hi')        // 推断 T = string
\`\`\`

## 常见场景

### 1. 通用函数

\`\`\`ts
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
\`\`\`

### 2. 泛型接口 / 类

\`\`\`ts
interface Box<T> { value: T }
class Stack<T> {
  private items: T[] = []
  push(v: T) { this.items.push(v) }
}
\`\`\`

### 3. 多个类型参数与约束

\`\`\`ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
getProperty({ a: 1, b: 'x' }, 'a')  // K 被约束为 'a' | 'b'
\`\`\`

### 4. 泛型默认值

\`\`\`ts
interface Result<T = unknown> { data: T; code: number }
\`\`\`

### 5. Promise / 异步

\`\`\`ts
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json()
}
\`\`\`

## 价值

- 类型复用：一份逻辑适用于多种类型。
- 类型安全：调用处类型被推断，避免 any。
- 自文档化：调用方清楚输入输出类型关系。`
  },
  {
    id: 'ts-005',
    category: 'typescript',
    title: '常用的工具类型有哪些？',
    difficulty: '中等',
    tags: ['工具类型', 'Partial', 'Pick', 'Omit'],
    answer: `## 常用内置工具类型

\`\`\`ts
Partial<T>          // 所有属性变可选
Required<T>         // 所有属性变必选
Readonly<T>         // 所有属性变只读
Pick<T, K>          // 从 T 中挑选部分属性
Omit<T, K>          // 从 T 中剔除部分属性
Record<K, V>        // 构造键为 K、值为 V 的对象类型
ReturnType<F>       // 函数 F 的返回值类型
Parameters<F>       // 函数 F 的参数元组
Awaited<P>          // 解包 Promise（递归取最终类型）
NonNullable<T>      // 剔除 null/undefined
Exclude<T, U>       // 从联合 T 中排除可赋给 U 的
Extract<T, U>       // 从联合 T 中提取可赋给 U 的
keyof T             // T 的所有键的联合类型
\`\`\`

## 示例

\`\`\`ts
interface User { id: number; name: string; age?: number }

type UserPreview = Pick<User, 'id' | 'name'>
type CreateUserDTO = Omit<User, 'id'>
type UserMap = Record<string, User>
type Name = NonNullable<User['name']>
\`\`\`

## 自定义工具类型

\`\`\`ts
// 把对象所有属性变为可空深一层
type Nullable<T> = { [K in keyof T]: T[K] | null }

// 获取 Promise 返回类型
type Data = Awaited<Promise<{ a: number }>>  // { a: number }
\`\`\`

## 实现原理（Partial 为例）

\`\`\`ts
type Partial<T> = {
  [K in keyof T]?: T[K]
}
\`\`\`

映射类型 \`{ [K in keyof T]: ... }\` 遍历 T 的所有键重新构造类型，是类型体操的基础。`
  },
  {
    id: 'ts-006',
    category: 'typescript',
    title: 'type 与 enum 如何选择？常量枚举是什么？',
    difficulty: '中等',
    tags: ['enum', '常量枚举', 'type'],
    answer: `## enum（枚举）

\`\`\`ts
enum Direction { Up, Down, Left, Right }
enum Status { Idle = 'idle', Loading = 'loading' }
\`\`\`

- 数字枚举会生成**正向 + 反向映射**的运行时对象（\`Direction[0] === 'Up'\`）。
- 字符串枚举只生成正向映射。
- 编译后会保留为真实 JS 对象（除非 \`const enum\`）。

## const enum（常量枚举）

\`\`\`ts
const enum Color { Red, Green, Blue }
const c = Color.Red  // 编译为 const c = 0
\`\`\`

- 编译时**内联**为具体值，不生成运行时对象，体积更小、性能更好。
- 不能包含计算成员，不能与字符串枚举的反向映射混用。
- 注意：isolatedModules / Babel 下 \`const enum\` 支持有坑，新项目建议用 \`as const\` 对象替代。

## type 联合字面量（推荐）

\`\`\`ts
type Direction = 'up' | 'down' | 'left' | 'right'
type Status = 'idle' | 'loading' | 'done'
\`\`\`

- 纯类型，编译后被完全擦除，无运行时开销。
- 支持 tree-shaking、可读性好。
- 缺点：运行时无法引用（若需要值 + 类型，用对象 + typeof）。

## 对象 + typeof（运行时 + 类型）

\`\`\`ts
const Direction = { Up: 'up', Down: 'down' } as const
type Direction = typeof Direction[keyof typeof Direction]  // 'up' | 'down'
\`\`\`

## 选择建议

- 只需类型约束 → \`type\` 联合字面量（最推荐）。
- 需要运行时值且要可扩展 → 对象 \`as const\` + \`typeof\`。
- \`enum\` 适合需要反向映射或与旧代码兼容的场景。`
  },
  {
    id: 'ts-007',
    category: 'typescript',
    title: 'TypeScript 的类型推断（type inference）与类型断言（as）有何区别？',
    difficulty: '中等',
    tags: ['类型推断', '类型断言', 'as const'],
    answer: `## 类型推断（Type Inference）

TS 在没有显式注解时会自动推断类型：

\`\`\`ts
let x = 10              // number
const y = 10            // 10（字面量类型）
const arr = [1, 'a']    // (string | number)[]
const obj = { a: 1 }    // { a: number }
\`\`\`

### 最佳公共类型（Best Common Type）

推断联合类型时会寻找"最佳公共类型"，数组会取所有元素的联合，对象属性取每个属性各自的推断。

### 上下文类型（Contextual Typing）

类型也会"反向"从使用位置推断：

\`\`\`ts
window.onmousedown = (e) => {  // e 被推断为 MouseEvent
  console.log(e.button)
}
\`\`\`

## 类型断言（Type Assertion）

告诉编译器"我比你更清楚这个值的类型"，**只在编译期起作用，运行时不做任何转换**。

### 两种语法

\`\`\`ts
let s: unknown = 'hi'
const len1 = (s as string).length    // JSX / TS 通用，推荐
const len2 = (<string>s).length      // 不能在 JSX 中使用
\`\`\`

### as const（断言为只读字面量）

\`\`\`ts
const obj = { x: 1, y: 2 } as const
// 类型: { readonly x: 1; readonly y: 2 }

const arr = [1, 2, 3] as const
// 类型: readonly [1, 2, 3]
\`\`\`

### 非空断言 !（Non-null Assertion）

\`\`\`ts
const el = document.querySelector('#app')!  // 排除 null / undefined
\`\`\`

> 风险：若运行时实际为 null，仍会抛错。建议优先用类型守卫或可选链。

### 双重断言

当类型差异较大时，先转 unknown 再转目标类型：

\`\`\`ts
const a = expr as unknown as Foo
\`\`\`

## 断言 ≠ 类型转换

断言只改变静态类型，运行时不变；真正的转换需要显式调用 \`Number()\`、\`String()\`、\`parseInt()\` 等。

## 使用建议

- 谨慎使用断言，能用类型守卫 / 泛型收窄就别用 \`as\`。
- unknown 入口（\`JSON.parse\`、第三方数据）应配合运行时校验（如 zod）后再断言。
- 优先用 \`satisfies\`（TS 4.9+）替代部分 \`as\` 场景。`
  },
  {
    id: 'ts-008',
    category: 'typescript',
    title: '联合类型（union）与交叉类型（intersection）的区别？',
    difficulty: '中等',
    tags: ['联合类型', '交叉类型', 'distributive'],
    answer: `## 联合类型（Union）

\`A | B\` 表示值是 A 或 B 之一。

\`\`\`ts
type ID = string | number
function f(id: ID) {
  // id.toUpperCase()  ❌ number 没有该方法
  if (typeof id === 'string') id.toUpperCase()  // ✅ 收窄后可用
}
\`\`\`

访问联合类型的成员时，只能访问**所有成员共有的属性**。

## 交叉类型（Intersection）

\`A & B\` 表示同时具备 A 和 B 的全部成员。

\`\`\`ts
interface Named { name: string }
interface Aged { age: number }
type Person = Named & Aged
const p: Person = { name: 'Tom', age: 18 }
\`\`\`

## 同名字段冲突

同名字段类型冲突时，交叉结果为 \`never\`：

\`\`\`ts
type A = { x: string }
type B = { x: number }
type C = A & B  // x: never（string & number 不存在）
\`\`\`

## 对比

| 类型 | 语义 | 对象属性集 | 取值范围 |
| --- | --- | --- | --- |
| A \| B | 或 | 共有属性 | 并集 |
| A & B | 且 | 全部属性 | 交集 |

## 条件类型对联合的分布（Distributive）

条件类型对联合类型会**分发**：

\`\`\`ts
type ToArray<T> = T extends any ? T[] : never
type R = ToArray<string | number>  // string[] | number[]
\`\`\`

若不想分发，用方括号包裹阻止：

\`\`\`ts
type ToArray<T> = [T] extends [any] ? T[] : never
type R = ToArray<string | number>  // (string | number)[]
\`\`\`

## 应用场景

- 联合：状态字面量、可选参数、配置枚举、错误类型集合。
- 交叉：mixin、合并多接口、给现有类型扩展属性（\`T & { extra: string }\`）。`
  }
  ,
  {
    id: 'ts-009',
    category: 'typescript',
    title: 'TypeScript 中有哪些类型守卫（Type Guards）？',
    difficulty: '中等',
    tags: ['类型守卫', 'typeof', 'instanceof', 'in', '类型谓词'],
    answer: `## 类型守卫

在运行时检查值，并在编译期**收窄类型**的机制。

## 1. typeof

\`\`\`ts
function f(x: string | number) {
  if (typeof x === 'string') x.toUpperCase()  // string
  else x.toFixed()  // number
}
\`\`\`

支持：\`string\` / \`number\` / \`boolean\` / \`bigint\` / \`symbol\` / \`undefined\` / \`object\` / \`function\`。注意 \`null\` 也返回 \`'object'\`。

## 2. instanceof

用于类实例的收窄，沿原型链判断：

\`\`\`ts
function f(e: Error | Date) {
  if (e instanceof Date) e.getTime()
  else e.message
}
\`\`\`

## 3. in

判断属性是否存在于对象：

\`\`\`ts
interface Bird { fly(): void }
interface Fish { swim(): void }

function move(a: Bird | Fish) {
  if ('fly' in a) a.fly()
  else a.swim()
}
\`\`\`

## 4. 自定义类型谓词（User-Defined Type Predicates）

\`\`\`ts
function isFish(a: Bird | Fish): a is Fish {
  return (a as Fish).swim !== undefined
}

if (isFish(a)) a.swim()  // 这里 a 收窄为 Fish
\`\`\`

\`x is Foo\` 是返回值类型，表示"函数返回 true 时 x 就是 Foo"。

## 5. asserts 断言函数

\`\`\`ts
function assertNonNull<T>(x: T): asserts x is NonNullable<T> {
  if (x == null) throw new Error('null')
}

assertNonNull(val)  // 之后 val 收窄为 NonNullable<T>
\`\`\`

- \`asserts x is Foo\`：函数正常返回时，后续代码认为 x 是 Foo。
- \`asserts x\`：表示断言 x 为真值。

## 选择

| 场景 | 推荐 |
| --- | --- |
| 原始类型 | typeof |
| 类实例 | instanceof |
| 接口区分（无类） | in 或自定义谓词 |
| 复杂判断 / 跨函数 | 自定义类型谓词 / asserts |
| 可能为 null | 可选链 \`?.\` 或非空断言 \`!\` |`
  },
  {
    id: 'ts-010',
    category: 'typescript',
    title: 'TypeScript 的函数重载（overloads）怎么实现？',
    difficulty: '中等',
    tags: ['函数重载', 'overloads', '签名'],
    answer: `## 函数重载（Overloads）

为同一个函数提供**多个类型签名**，调用时按入参类型精确推断返回类型。

## 问题

\`\`\`ts
function f(x: string | number): string | number {
  return x
}
const r = f('a')  // 类型是 string | number，丢失了精确性
\`\`\`

## 重载写法

\`\`\`ts
function f(x: string): string
function f(x: number): number
function f(x: string | number): string | number {
  return x
}
const r1 = f('a')   // string
const r2 = f(1)     // number
\`\`\`

- 前 1~N 行是**重载签名**（对外可见，不带实现）。
- 最后一行是**实现签名**（对外不可见，必须兼容所有重载）。

## 注意事项

- 实现签名不会暴露给调用方，对外类型完全由重载签名决定。
- 重载顺序很重要：更具体的写在前面（TS 自上而下匹配）。
- 不要用 \`any\` 在实现里滥竽充数，会破坏类型安全。

## 方法重载（对象 / 接口）

\`\`\`ts
interface Calc {
  add(a: number, b: number): number
  add(a: string, b: string): string
}

const calc: Calc = {
  add(a: any, b: any) { return a + b }
}
\`\`\`

## 替代方案

- 联合类型 + 条件类型：\`function f<T extends string | number>(x: T): T\`。
- 函数重载适合**返回类型与入参类型强相关、但无法用泛型简单表达**的场景，如不同参数个数 / 不同类型的重载。`
  }
  ,
  {
    id: 'ts-011',
    category: 'typescript',
    title: 'keyof 和 typeof 操作符的作用与组合用法？',
    difficulty: '中等',
    tags: ['keyof', 'typeof', '操作符'],
    answer: `## keyof 操作符

取一个类型的**所有键的联合**：

\`\`\`ts
interface User { id: number; name: string }
type K = keyof User  // 'id' | 'name'

type T = keyof any   // string | number | symbol
\`\`\`

对于索引签名：

\`\`\`ts
interface MapLike { [k: string]: number }
type K = keyof MapLike  // string | number（数字键会被转字符串）
\`\`\`

## typeof 操作符（类型上下文）

在**类型上下文**中取一个**值的类型**：

\`\`\`ts
const config = { port: 3000, host: 'localhost' }
type Config = typeof config  // { port: number; host: string }
\`\`\`

> 注意：类型上下文的 \`typeof\` 与 JS 运行时的 \`typeof\` 完全不同，前者只在编译期、取静态类型。

## 组合使用

### 1. 配合 as const 拿到字面量联合

\`\`\`ts
const Direction = { Up: 'up', Down: 'down' } as const
type Dir = typeof Direction[keyof typeof Direction]  // 'up' | 'down'
\`\`\`

### 2. 安全访问对象属性

\`\`\`ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
get({ a: 1, b: 'x' }, 'a')  // 返回 number
// get({ a: 1 }, 'c')       // ❌ 编译期就能发现拼写错误
\`\`\`

### 3. 工具类型的底层

\`\`\`ts
type Partial<T> = { [K in keyof T]?: T[K] }
type Readonly<T> = { readonly [K in keyof T]: T[K] }
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
\`\`\`

## 应用场景

- 限定函数参数为对象已有键（避免拼写错误）。
- 把运行时对象转成枚举联合类型。
- 作为映射类型与工具类型的基础构建块。`
  },
  {
    id: 'ts-012',
    category: 'typescript',
    title: '什么是映射类型（Mapped Types）和条件类型（Conditional Types）？',
    difficulty: '困难',
    tags: ['映射类型', '条件类型', '类型体操'],
    answer: `## 映射类型（Mapped Types）

用 \`{ [K in ...]: ... }\` 语法遍历键构造新类型。

\`\`\`ts
type Nullable<T> = { [K in keyof T]: T[K] | null }
\`\`\`

## 修饰符 + / -

\`+\` 添加修饰符，\`-\` 移除修饰符（\`?\` 可选、\`readonly\` 只读）：

\`\`\`ts
type Required<T> = { [K in keyof T]-?: T[K] }        // 移除可选
type Mutable<T>  = { -readonly [K in keyof T]: T[K] } // 移除只读
\`\`\`

## 键重映射（Key Remapping, TS 4.1+）

\`as\` 子句可重命名或过滤键：

\`\`\`ts
// 过滤掉非 string 类型的键
type StringKeys<T> = {
  [K in keyof T as K extends string ? K : never]: T[K]
}

// 结合 Uppercase 把键名转大写
type UpperKeys<T> = {
  [K in keyof T as Uppercase<string & K>]: T[K]
}
\`\`\`

## 条件类型（Conditional Types）

\`T extends U ? X : Y\`，类似三元运算符：

\`\`\`ts
type IsString<T> = T extends string ? true : false
type A = IsString<'hi'>  // true
type B = IsString<1>     // false
\`\`\`

## 分布式条件类型（Distributive）

当 \`T\` 是裸类型参数且为联合类型时，会**分发**：

\`\`\`ts
type ToArray<T> = T extends any ? T[] : never
type R = ToArray<string | number>  // string[] | number[]
\`\`\`

用 \`[T]\` 阻止分发，得到整体数组。

## 常见内置工具类型的实现

\`\`\`ts
type Exclude<T, U> = T extends U ? never : T
type Extract<T, U> = T extends U ? T : never
type NonNullable<T> = T extends null | undefined ? never : T
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never
\`\`\`

## 小结

映射类型 + 条件类型 + \`infer\` 是 TS 类型体操的三大基石，几乎所有工具类型都由它们组合而来。`
  }
  ,
  {
    id: 'ts-013',
    category: 'typescript',
    title: 'infer 关键字的用法？给几个类型体操示例。',
    difficulty: '困难',
    tags: ['infer', '类型体操', '条件类型'],
    answer: `## infer 关键字

在条件类型的 \`extends\` 子句中**声明一个待推断的类型变量**。

\`\`\`ts
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never
\`\`\`

这里 \`infer R\` 表示"如果 F 是函数，把它的返回值类型赋给 R"。

## 经典类型体操

### 1. 提取函数参数

\`\`\`ts
type Parameters<F> = F extends (...args: infer P) => any ? P : never
type P = Parameters<(a: string, b: number) => void>  // [string, number]
\`\`\`

### 2. 递归解包 Promise

\`\`\`ts
type Unpack<T> = T extends Promise<infer U> ? Unpack<U> : T
type R = Unpack<Promise<Promise<number>>>  // number
\`\`\`

### 3. 提取数组元素

\`\`\`ts
type Item<T> = T extends (infer I)[] ? I : never
type R = Item<string[]>  // string
\`\`\`

### 4. 元组首项 / 反转

\`\`\`ts
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never
type Reverse<T extends any[]> =
  T extends [infer F, ...infer R] ? [...Reverse<R>, F] : []
type R = Reverse<[1, 2, 3]>  // [3, 2, 1]
\`\`\`

### 5. 获取构造函数的实例类型

\`\`\`ts
type InstanceType<C> = C extends new (...args: any[]) => infer I ? I : never
\`\`\`

### 6. 提取对象某属性的值类型

\`\`\`ts
type ValueType<T> = T extends { value: infer V } ? V : never
type R = ValueType<{ value: string }>  // string
\`\`\`

## 注意事项

- \`infer\` 只能在条件类型的 \`extends\` 子句中使用。
- 同名 \`infer\` 出现多次时：在协变位置取**联合**，在逆变位置取**交叉**。
- TS 4.7+ 支持在 \`infer\` 上加约束：\`infer R extends string\`。
- 复杂类型体操可读性差，需适度，团队项目里应配合注释。`
  },
  {
    id: 'ts-014',
    category: 'typescript',
    title: 'declare module、.d.ts 声明文件与全局类型扩展怎么用？',
    difficulty: '困难',
    tags: ['declare', 'd.ts', '模块声明', '全局类型'],
    answer: `## 声明文件 .d.ts

只包含类型声明、不含运行时代码的文件，用于描述 JS 库的类型。

\`\`\`ts
// math.d.ts
export function add(a: number, b: number): number
export const PI: number
\`\`\`

## ambient 声明（declare）

表示"运行时已存在该变量 / 函数 / 类，TS 只声明类型"：

\`\`\`ts
declare const VERSION: string
declare function greet(name: string): void
declare class Foo {}
declare namespace MyLib {
  function init(): void
}
\`\`\`

## declare module（模块声明 / 扩展）

### 1. 给无类型的 JS 库补类型

\`\`\`ts
declare module 'old-lib' {
  export function doSomething(x: number): void
  export const version: string
}
\`\`\`

### 2. 扩展已有模块的类型

\`\`\`ts
import 'express'

declare module 'express' {
  interface Request {
    user?: { id: string; name: string }
  }
}
\`\`\`

扩展后，所有 \`import { Request } from 'express'\` 都能访问 \`req.user\`。

## declare global（全局类型扩展）

\`\`\`ts
// 必须写在模块里（顶层要有 import 或 export）
export {}

declare global {
  interface Window {
    myApp: { init(): void }
  }
  const __DEV__: boolean
}
\`\`\`

注意：\`declare global\` 必须位于**模块**文件中，否则会被当作全局脚本。

## 三斜线指令（Triple-slash Directives）

\`\`\`ts
/// <reference types="node" />
/// <reference path="./foo.d.ts" />
\`\`\`

早期用于声明文件之间声明依赖，现多被 \`import\` / \`import type\` 取代，新代码尽量少用。

## @types 与 tsconfig

许多库的类型由 DefinitelyTyped 维护：

\`\`\`bash
npm i -D @types/lodash @types/node
\`\`\`

tsconfig 中 \`typeRoots\` 控制 @types 查找目录，\`types\` 字段可限定只加载哪些。

## 实践建议

- 优先找官方 \`@types\` 包或库自带的类型。
- 自定义声明放 \`types/\` 或 \`typings/\` 目录，并在 tsconfig \`include\` 中包含。
- 慎用 \`any\` 扩展，能用具体类型就用具体类型。
- 模块扩展需在入口处 \`import\` 一次才会生效。`
  }
  ,
  {
    id: 'ts-015',
    category: 'typescript',
    title: '结构类型与标称类型有什么区别？TS 中的协变与逆变是什么？',
    difficulty: '困难',
    tags: ['结构类型', '标称类型', '协变', '逆变', '类型兼容性'],
    answer: `## 结构类型（Structural Typing）

TS 采用**结构类型系统**：类型兼容看"形状"而非"名字"。只要结构满足，就兼容。

\`\`\`ts
interface Point { x: number; y: number }
const p = { x: 1, y: 2, z: 3 }
const a: Point = p  // ✅ 有 x、y 即可，多余属性不影响赋值
\`\`\`

这与 Java / C# 的标称类型不同。

## 标称类型（Nominal Typing）

类型由"名字"决定，结构相同也不兼容。TS 默认不是这样，但可以模拟。

## 模拟标称类型：品牌类型（Branded Types）

\`\`\`ts
type UserId = string & { readonly __brand: 'UserId' }
type OrderId = string & { readonly __brand: 'OrderId' }

function getUser(id: UserId) {}
getUser('123' as UserId)        // ✅
// getUser('123' as OrderId)    // ❌ 不同品牌，编译报错
\`\`\`

通过交叉类型打"标签"，避免不同语义的 string 混用（如用户 ID 和订单 ID）。

## 协变与逆变

讨论**函数类型**的兼容性时：

### 协变（Covariant）—— 返回值

返回更具体的子类型是兼容的：

\`\`\`ts
type F1 = () => Animal
type F2 = () => Dog  // Dog 是 Animal 的子类型
const f: F1 = (() => dog) as F2  // ✅ F2 可赋给 F1
\`\`\`

### 逆变（Contravariant）—— 参数

参数应该接收更宽泛的父类型：

\`\`\`ts
type F1 = (x: Dog) => void
type F2 = (x: Animal) => void
const f: F1 = ((x: Animal) => {}) as F2  // ✅ F2 可赋给 F1（参数逆变）
\`\`\`

直觉：能处理任意 Animal 的函数，当然能处理 Dog。

## TS 的"双变"陷阱

TS 默认对**方法参数**采用**双变**（bivariant），即既协变又逆变，这是为兼容性牺牲了安全性。

开启 \`strictFunctionTypes\` 后，**函数类型字面量**的参数变为严格逆变；但 \`method(): void\` 这种方法签名仍是双变：

\`\`\`ts
// strictFunctionTypes: true
type Handler = (x: { a: string }) => void
const h: Handler = (x: { a: string; b: number }) => {}  // ❌ 参数逆变报错
\`\`\`

## 总结

| 概念 | 说明 |
| --- | --- |
| 结构类型 | 看形状，不看名字（TS 默认） |
| 标称类型 | 看名字，需品牌类型模拟 |
| 协变 | 子类型可替换父类型（函数返回值） |
| 逆变 | 父类型可替换子类型（函数参数） |
| 双变 | TS 方法默认行为，安全性较弱 |
| strictFunctionTypes | 让函数参数严格逆变，提升安全性 |`
  },
  {
    id: 'ts-016',
    category: 'typescript',
    title: 'satisfies 操作符（TS 4.9+）的作用是什么？与 as 有何区别？',
    difficulty: '困难',
    tags: ['satisfies', 'as', '类型推断'],
    answer: `## satisfies 操作符

让一个值"满足"某个类型，**同时保留最精确的字面量类型**。

\`\`\`ts
type Colors = 'red' | 'green' | 'blue'
const palette = {
  primary: 'red',
  secondary: 'green'
} satisfies Record<string, Colors>

palette.primary  // 类型是 'red'（字面量保留），不是 Colors
\`\`\`

## 与其他写法对比

### 1. 类型注解

\`\`\`ts
const palette: Record<string, Colors> = { primary: 'red' }
palette.primary  // 类型是 Colors（被拓宽，丢失字面量）
\`\`\`

类型注解会把值类型拓宽为注解类型，丢失精确信息。

### 2. as 断言

\`\`\`ts
const palette = { primary: 'red' } as Record<string, Colors>
\`\`\`

\`as\` 是断言，不做严格检查，可能"撒谎"；\`satisfies\` 会真实校验值是否满足类型。

### 三者对比

| 写法 | 检查值满足类型 | 保留字面量 |
| --- | --- | --- |
| 类型注解 | ✅ | ❌ 拓宽 |
| as 断言 | ❌ 不严格 | 部分 |
| satisfies | ✅ | ✅ |

## 经典场景

### 1. 配置对象

\`\`\`ts
const config = {
  port: 3000,
  host: 'localhost'
} satisfies Config

config.port  // 类型 3000（字面量），可参与更精确推断
\`\`\`

### 2. 路由表

\`\`\`ts
type Route = '/' | '/user' | '/about'
const routes = {
  home: '/',
  user: '/user',
  about: '/about'
} satisfies Record<string, Route>

routes.home  // '/' 字面量，不是 Route
\`\`\`

### 3. 主题 / 颜色映射

\`\`\`ts
const theme = {
  dark: { bg: '#000', fg: '#fff' },
  light: { bg: '#fff', fg: '#000' }
} satisfies Record<ThemeName, Theme>
\`\`\`

既保证主题齐全（缺一个就报错），又能在使用时享受字面量类型。

### 4. 区分联合的实现

\`\`\`ts
type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'scroll'; top: number }

const e = { type: 'click', x: 1, y: 2 } satisfies Event
e.type  // 'click' 字面量
\`\`\`

## 小结

- 想让值"符合"某类型，又不想丢失精确类型 → \`satisfies\`。
- \`as\` 是断言（可能撒谎），\`satisfies\` 是验证（真实检查）。
- TS 4.9+ 可用，是替代部分 \`as\` 的更安全写法。`
  },
  // ===== 以下为补充题目（ts-017 ~ ts-026）=====
  {
    id: 'ts-017',
    category: 'typescript',
    title: '常用内置工具类型（Utility Types）有哪些？如何手写实现 Partial/ Pick/ Omit？',
    difficulty: '中等',
    tags: ['工具类型', 'Partial', 'Pick', 'Omit', 'Record'],
    answer: `## 常用内置工具类型

| 工具类型 | 作用 |
| --- | --- |
| \`Partial<T>\` | 所有属性变可选 |
| \`Required<T>\` | 所有属性变必填 |
| \`Readonly<T>\` | 所有属性变只读 |
| \`Pick<T, K>\` | 从 T 中挑选一组属性 K |
| \`Omit<T, K>\` | 从 T 中剔除属性 K |
| \`Record<K, V>\` | 构造键为 K、值为 V 的对象类型 |
| \`ReturnType<F>\` | 取函数返回值类型 |
| \`Parameters<F>\` | 取函数参数元组类型 |
| \`Awaited<T>\` | 递归解包 Promise |
| \`NonNullable<T>\` | 剔除 null/undefined |
| \`Exclude<T, U>\` / \`Extract<T, U>\` | 联合类型的排除 / 提取 |

## 手写实现

\`\`\`ts
// Partial：遍历键，加 ? 修饰符
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

// Required：用 -? 移除可选修饰符
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

// Readonly：加 readonly 修饰符
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Pick：只保留 K 中的键
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// Omit：Pick + Exclude
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>

// Record
type MyRecord<K extends keyof any, V> = {
  [P in K]: V
}

// ReturnType：用 infer 提取返回值
type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never

// Parameters：用 infer 提取参数元组
type MyParameters<F> = F extends (...args: infer P) => any ? P : never
\`\`\`

## 用法示例

\`\`\`ts
interface User { id: number; name: string; age?: number }

type UserPatch = Partial<User>           // { id?: number; name?: string; age?: number }
type UserBasic = Pick<User, 'id' | 'name'> // { id: number; name: string }
type UserNoId = Omit<User, 'id'>          // { name: string; age?: number }
type UserMap = Record<string, User>       // { [k: string]: User }

function getUser() { return { id: 1, name: 'Tom' } }
type U = ReturnType<typeof getUser>       // { id: number; name: string }
\`\`\`

## 小结

- 工具类型本质是**类型层面的函数**：接收类型，返回新类型。
- 关键能力：\`keyof\`（取键的联合）、\`in\`（映射遍历）、\`infer\`（类型推断提取）、修饰符 \`+?/-?/+readonly/-readonly\`。`
  },
  {
    id: 'ts-018',
    category: 'typescript',
    title: 'keyof 和 typeof 操作符分别有什么作用？',
    difficulty: '中等',
    tags: ['keyof', 'typeof', '类型查询'],
    answer: `## keyof：取对象类型的所有键（组成联合类型）

\`\`\`ts
interface User { id: number; name: string; age: number }
type UserKey = keyof User   // 'id' | 'name' | 'age'

const k: UserKey = 'name'
\`\`\`

应用：约束泛型参数、实现安全的属性访问。

\`\`\`ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
get({ id: 1, name: 'Tom' }, 'name')   // OK，返回 string
get({ id: 1, name: 'Tom' }, 'foo')    // ❌ 编译报错
\`\`\`

## typeof：取**值**的类型（反向推类型）

注意区分 JS 的 \`typeof\`（运行时判断）和 TS 的 \`typeof\`（编译期取类型）。在类型位置使用就是后者。

\`\`\`ts
const config = { host: 'localhost', port: 3306, debug: true }
type Config = typeof config
// 等价于 { host: string; port: number; debug: boolean }

// 配合 as const 得到字面量类型
const colors = ['red', 'green', 'blue'] as const
type Color = typeof colors[number]   // 'red' | 'green' | 'blue'
\`\`\`

## 常见组合

\`\`\`ts
// 取枚举的键
enum Direction { Up, Down, Left, Right }
type DirKey = keyof typeof Direction   // 'Up' | 'Down' | 'Left' | 'Right'

// 取数组元素类型
const arr = [1, 2, 3]
type Item = typeof arr[number]         // number
\`\`\`

## 区别总结

| | \`keyof T\` | \`typeof v\` |
| --- | --- | --- |
| 输入 | 类型 \`T\` | 值 \`v\` |
| 输出 | T 的键的联合类型 | v 的类型 |
| 位置 | 类型位置 | 类型位置 |

二者常配合使用：\`keyof typeof obj\` 从一个对象值反推键的联合，是"以值定类型"的常用技巧。`
  },
  {
    id: 'ts-019',
    category: 'typescript',
    title: 'enum、const enum、字符串枚举、联合字面量类型，该怎么选？',
    difficulty: '中等',
    tags: ['enum', 'const enum', '字面量联合', 'isolatedModules'],
    answer: `## 几种形式

\`\`\`ts
// 1. 数字枚举（默认从 0 递增，可双向映射）
enum Direction { Up, Down, Left, Right }
Direction.Up      // 0
Direction[0]      // 'Up'（反向映射）

// 2. 字符串枚举（无反向映射，更安全）
enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }

// 3. const enum（编译期完全内联，不生成运行时对象）
const enum Color { Red, Green, Blue }
const c = Color.Red   // 编译为 const c = 0

// 4. 联合字面量类型（无运行时开销）
type Status2 = 'ACTIVE' | 'INACTIVE'
\`\`\`

## 对比

| | 数字 enum | 字符串 enum | const enum | 字面量联合 |
| --- | --- | --- | --- | --- |
| 运行时产物 | 对象 | 对象 | 无（内联） | 无 |
| 反向映射 | ✅ | ❌ | — | — |
| 可扩展 | 可追加 | 可追加 | 可追加 | 易扩展 |
| 跨文件隔离编译 | OK | OK | ⚠️ 受限 | OK |
| 序列化可读性 | 差（数字） | 好（字符串） | — | 好 |

## 注意事项

### 1. const enum 与 isolatedModules

\`const enum\` 在 \`isolatedModules: true\`（Babel、Vite/esbuild 默认开启）下**不可靠**，因为隔离编译模式下编译器无法内联其他文件的 \`const enum\`。Vite 项目中通常**避免使用 const enum**。

### 2. 数字枚举的反向映射陷阱

\`\`\`ts
enum E { A, B }
E[0] === 'A'   // ✅
\`\`\`

反向映射容易引入 bug（如把数字当 key），且序列化为 JSON 时是数字，可读性差。

### 3. 字符串枚举 vs 字面量联合

\`\`\`ts
// 字符串枚举：有运行时对象，可做类型也可做值
enum Role { Admin = 'admin' }
const r: Role = Role.Admin

// 字面量联合：纯类型，无运行时对象
type RoleT = 'admin' | 'user'
const r2: RoleT = 'admin'
\`\`\`

## 推荐选择

1. **小型项目 / 需要运行时枚举对象** → 字符串枚举（可读性好、避免反向映射坑）。
2. **大型项目 / Vite / 需要隔离编译** → **字面量联合类型 + as const 常量对象**：

\`\`\`ts
const ROLES = ['admin', 'user', 'guest'] as const
type Role = typeof ROLES[number]   // 'admin' | 'user' | 'guest'
\`\`\`

既有运行时数组（可遍历、可校验），又有精确类型，是当前社区最推荐的做法。
3. **避免**：数字枚举的反向映射、\`const enum\`（在 Babel/esbuild 环境下）。`
  },
  {
    id: 'ts-020',
    category: 'typescript',
    title: 'TypeScript 有哪些类型守卫（Narrowing）？如何自定义类型谓词？',
    difficulty: '中等',
    tags: ['类型守卫', 'Narrowing', 'typeof', 'instanceof', 'in', '类型谓词'],
    answer: `## 类型缩窄（Narrowing）

TS 在控制流中根据判断条件，自动收窄变量的类型。常见方式：

### 1. typeof

\`\`\`ts
function f(x: string | number) {
  if (typeof x === 'string') {
    x.toUpperCase()   // x: string
  } else {
    x.toFixed(2)      // x: number
  }
}
\`\`\`

注意：\`typeof null === 'object'\`，判 null 用 \`=== null\`。

### 2. instanceof

\`\`\`ts
function f(e: Error | Date) {
  if (e instanceof Date) {
    e.getTime()       // e: Date
  } else {
    e.message         // e: Error
  }
}
\`\`\`

只能用于 class / 构造函数，且要求右侧是构造函数类型。

### 3. in

判断属性是否存在，缩窄联合类型中的不同形状。

\`\`\`ts
type Cat = { meow: () => void }
type Dog = { bark: () => void }

function speak(a: Cat | Dog) {
  if ('meow' in a) a.meow()
  else a.bark()
}
\`\`\`

### 4. 字面量类型判断

\`\`\`ts
type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }

function area(sh: Shape) {
  if (sh.kind === 'circle') return Math.PI * sh.r ** 2
  return sh.s ** 2
}
\`\`\`

这种"标签 + 联合"叫**可辨识联合（Discriminated Union）**，是非常稳健的设计模式。

### 5. 自定义类型谓词（User-Defined Type Guard）

用 \`x is T\` 声明一个返回布尔值的函数，告诉 TS 缩窄规则。

\`\`\`ts
function isString(x: unknown): x is string {
  return typeof x === 'string'
}

function isFish(a: Cat | Dog): a is Fish {
  return (a as Fish).swim !== undefined
}

const v: unknown = 'hi'
if (isString(v)) {
  v.toUpperCase()   // v: string
}
\`\`\`

### 6. assertion function（断言函数）

\`\`\`ts
function assertNonNull<T>(x: T): asserts x is NonNullable<T> {
  if (x == null) throw new Error('null')
}
const n: string | null = 'a'
assertNonNull(n)
n.toUpperCase()      // n: string
\`\`\`

也可断言条件：

\`\`\`ts
function assert(x: unknown): asserts x {
  if (!x) throw new Error('falsy')
}
\`\`\`

## 小结

- 优先用 \`typeof\` / \`instanceof\` / \`in\` / 字面量判别，简单够用。
- 复杂结构用**自定义类型谓词** \`x is T\`，把校验逻辑封装起来。
- 不可恢复的错误用 **asserts**，省去 if/throw 重复代码。
- 设计数据时优先用**可辨识联合**，让缩窄自然且穷尽（结合 never 检查）。`
  },
  {
    id: 'ts-021',
    category: 'typescript',
    title: '什么是模板字面量类型（Template Literal Types）？有哪些实用场景？',
    difficulty: '困难',
    tags: ['模板字面量类型', '映射类型', '类型体操'],
    answer: `## 基本概念

模板字面量类型是 TS 4.1 引入的能力：用反引号在**类型层面**拼接字符串，配合联合类型会自动展开。

\`\`\`ts
type Greeting = \`hello \${'world' | 'ts'}\`
// 'hello world' | 'hello ts'

type T = \`\${'a' | 'b'}-\${1 | 2}\`
// 'a-1' | 'a-2' | 'b-1' | 'b-2'
\`\`\`

## 关键能力：结合 keyof 与映射类型

### 1. 把所有属性名加上前缀 / 后缀

\`\`\`ts
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

interface User { id: number; name: string }
type UserGetters = Getters<User>
// { getId: () => number; getName: () => string }
\`\`\`

\`Capitalize\` 是内置工具类型，把首字母大写；还有 \`Uncapitalize\`、\`Uppercase\`、\`Lowercase\`。

### 2. 事件监听器类型自动生成

\`\`\`ts
type EventName = 'click' | 'change'
type Listener<T extends string> = {
  [K in \`on\${Capitalize<T>}\`]: (e: Event) => void
}
type L = Listener<EventName>   // { onClick: ...; onChange: ... }
\`\`\`

### 3. 路径 / 选择器类型

\`\`\`ts
type Path<T> = T extends object
  ? { [K in keyof T & string]: K | \`\${K}.\${Path<T[K]>}\` }[keyof T & string]
  : never

interface Conf { db: { host: string; port: number } }
type P = Path<Conf>   // 'db' | 'db.host' | 'db.port'
\`\`\`

### 4. setter 生成

\`\`\`ts
type Setters<T> = {
  [K in keyof T as \`set\${Capitalize<string & K>}\`]: (v: T[K]) => void
}
\`\`\`

### 5. 类型安全的路径访问（lodash \_.get 风格）

\`\`\`ts
function get<T, P extends Path<T>>(obj: T, path: P): PathValue<T, P>
\`\`\`

## 小结

- 模板字面量类型把"字符串拼接"放到了**类型层**，让我们能基于现有类型自动生成新的字符串联合。
- 与映射类型 \`as\` 子句、\`keyof\`、\`Capitalize\` 等结合，可自动生成 getter/setter/事件名等。
- 在框架/库的类型设计中非常有用，如 Tailwind 类名推断、路由参数类型、SQL 查询构建器等。
- 是"类型体操"的核心武器，但也注意可读性，复杂场景建议加注释。`
  },
  {
    id: 'ts-022',
    category: 'typescript',
    title: '什么是映射类型（Mapped Types）？如何用 as 子句做键的重映射？',
    difficulty: '困难',
    tags: ['映射类型', 'Mapped Types', 'as', '修饰符'],
    answer: `## 基本语法

映射类型基于**已有类型的键集合**，对每个键重新定义值类型，语法形如 \`{ [K in U]: V }\`，其中 \`U\` 通常是 \`keyof T\` 或字符串联合。

\`\`\`ts
type Stringify<T> = { [K in keyof T]: string }
// 把 T 的每个属性值类型都替换为 string

interface User { id: number; name: string }
type S = Stringify<User>   // { id: string; name: string }
\`\`\`

## 修饰符：+ / - 与 ? / readonly

\`\`\`ts
// 加可选
type MyPartial<T> = { [K in keyof T]?: T[K] }

// 移除可选（-?）
type MyRequired<T> = { [K in keyof T]-?: T[K] }

// 加只读
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }

// 移除只读（-readonly）
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
\`\`\`

\`+\` 是默认（可省略），\`-\` 表示移除。

## as 子句：键的重映射（TS 4.1+）

\`\`\`ts
type Mapped<T> = {
  [K in keyof T as NewKey<K>]: T[K]
}
\`\`\`

\`as\` 后面是一个**新键类型**，可以是：
- 模板字面量（加前缀/后缀）
- 过滤（返回 never 则该键被剔除）
- 联合展开（返回联合则一个键变成多个）

### 示例 1：生成 getter

\`\`\`ts
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}
\`\`\`

### 示例 2：过滤特定键

\`\`\`ts
type RemoveKind<T> = {
  [K in keyof T as Exclude<K, 'kind'>]: T[K]
}
// kind 键被剔除
\`\`\`

### 示例 3：从对象值反推键

\`\`\`ts
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}

interface Conf { a: string; b: number; c: string }
type Strings = PickByValue<Conf, string>   // { a: string; c: string }
\`\`\`

## 同态 vs 非同态映射

- **同态（Homomorphic）**：\`{ [K in keyof T]: ... }\`，保留原类型的修饰符（readonly / ?）。
- **非同态**：\`{ [K in U]: ... }\`（U 是普通联合），不保留修饰符。

\`\`\`ts
interface A { readonly x?: number }
type H = { [K in keyof A]: A[K] }   // 同态：保留 readonly 和 ?
type N = { [K in 'x']: number }     // 非同态：没有修饰符
\`\`\`

## 小结

- 映射类型是工具类型的基石：Partial/Required/Pick/Record 本质都是映射。
- 三大能力：遍历键、调整修饰符（\`+/-\` 配 \`?/readonly\`）、用 \`as\` 重映射/过滤键。
- 同态映射会"继承"原类型修饰符，这是它与普通索引签名的关键差别。`
  },
  {
    id: 'ts-023',
    category: 'typescript',
    title: '条件类型（Conditional Types）与 infer 关键字怎么用？',
    difficulty: '困难',
    tags: ['条件类型', 'infer', '分发', '类型体操'],
    answer: `## 条件类型语法

形如 \`T extends U ? X : Y\`，根据 \`T\` 是否可赋值给 \`U\` 决定结果。

\`\`\`ts
type IsString<T> = T extends string ? true : false
type A = IsString<'hi'>   // true
type B = IsString<42>     // false
\`\`\`

## 分布式条件类型（Distributive）

当 \`T\` 是**裸类型参数**且传入的是联合类型时，条件类型会**分发**到每个成员再合并。

\`\`\`ts
type ToArray<T> = T extends any ? T[] : never
type R = ToArray<string | number>
// 等价于 ToArray<string> | ToArray<number>
// = string[] | number[]
\`\`\`

阻止分发：用方括号包裹 \`[T]\`：

\`\`\`ts
type ToArrayND<T> = [T] extends [any] ? T[] : never
type R = ToArrayND<string | number>   // (string | number)[]
\`\`\`

## infer：在条件类型中"声明并推断"一个类型变量

\`\`\`ts
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never
type Parameters<F> = F extends (...args: infer P) => any ? P : never
type InstanceType<C> = C extends new (...args: any[]) => infer I ? I : never
type ElementOf<T> = T extends (infer E)[] ? E : never
type PromiseValue<T> = T extends Promise<infer V> ? V : never
\`\`\`

## 经典：递归解包 Promise（Awaited）

\`\`\`ts
type Awaited<T> =
  T extends null | undefined ? T :
  T extends object & { then(method: (v: infer V) => any): any }
    ? Awaited<V>
    : T

type R = Awaited<Promise<Promise<number>>>   // number
\`\`\`

## 经典：提取函数的第一个参数类型

\`\`\`ts
type FirstArg<F> = F extends (a: infer A, ...rest: any[]) => any ? A : never
type T = FirstArg<(x: number, y: string) => void>   // number
\`\`\`

## 经典：Tuple 转对象

\`\`\`ts
type TupleToObject<T extends readonly any[]> = {
  [K in T[number]]: K
}
const t = ['a', 'b', 'c'] as const
type O = TupleToObject<typeof t>   // { a: 'a'; b: 'b'; c: 'c' }
\`\`\`

## 与 never 的关系

\`\`\`ts
type Exclude<T, U> = T extends U ? never : T
type Extract<T, U> = T extends U ? T : never

type R = Exclude<'a' | 'b' | 'c', 'a'>   // 'b' | 'c'
\`\`\`

分发 + \`never\` = 过滤联合成员。

## 小结

- 条件类型是**类型层面的 if-else**，是构建复杂工具类型的核心。
- \`infer\` 用于"从右边的模式中捕获一个未知类型"，是 ReturnType/Parameters 等的基础。
- **裸参数会分发**，用 \`[T] extends [U]\` 阻止分发。
- 复杂场景会递归，注意递归深度限制（TS 默认 50 层左右），过深会报错。
- 配合 \`keyof\`、映射类型、模板字面量，构成"类型体操"的四大武器。`
  },
  {
    id: 'ts-024',
    category: 'typescript',
    title: 'unknown、any、never、void 各代表什么？如何选择？',
    difficulty: '中等',
    tags: ['unknown', 'any', 'never', 'void', '类型安全'],
    answer: `## 四者的含义

| 类型 | 含义 | 是否类型安全 |
| --- | --- | --- |
| \`any\` | 任意类型，**关闭类型检查** | ❌ 不安全 |
| \`unknown\` | 任意类型，但**使用前必须缩窄** | ✅ 安全 |
| \`never\` | **永不存在的值**（永不返回 / 不可能的类型） | — |
| \`void\` | 函数**无返回值**（返回 undefined 也算） | — |

## any：逃生舱，慎用

\`\`\`ts
let a: any = 1
a.toUpperCase()   // 编译通过，运行时可能报错（数字无 toUpperCase）
a = {}
a()               // 也能"编译通过"
\`\`\`

\`any\` 完全放弃类型检查，等同于回到 JS。会污染传递（赋给别的变量也是 any）。

## unknown：类型安全的 any

\`\`\`ts
let u: unknown = JSON.parse('...')
u.toUpperCase()   // ❌ 报错：Object is of type 'unknown'

// 必须先缩窄
if (typeof u === 'string') u.toUpperCase()   // ✅
\`\`\`

\`unknown\` 是顶类型（Top Type），任何值都能赋给它，但它只能赋给 \`unknown\` / \`any\` 自身。使用前必须通过类型守卫缩窄，强制处理未知数据。

**推荐：用 unknown 代替 any 接收外部数据（API、JSON.parse、用户输入）。**

## never：底类型（Bottom Type）

\`never\` 表示"永远不会出现的值"。

### 用法 1：永不返回的函数

\`\`\`ts
function fail(msg: string): never {
  throw new Error(msg)
}

function infiniteLoop(): never {
  while (true) {}
}
\`\`\`

### 用法 2：穷尽检查（Exhaustiveness）

\`\`\`ts
type Shape = 'circle' | 'square'
function area(s: Shape): number {
  switch (s) {
    case 'circle': return 1
    case 'square': return 2
    default:
      // 如果将来加了 'triangle' 但忘了处理，
      // s 的类型会变成 'triangle'，无法赋给 never → 编译报错
      const _exhaustive: never = s
      return _exhaustive
  }
}
\`\`\`

### 用法 3：过滤联合

\`\`\`ts
type T = Exclude<'a' | 'b', 'a'>   // 'b'（'a' 被 never 替换后从联合中消失）
\`\`\`

\`never\` 在联合类型中会被自动忽略：\`never | string\` = \`string\`。

## void：函数返回值

\`\`\`ts
function log(msg: string): void { console.log(msg) }
\`\`\`

\`void\` 表示"调用方不应关心返回值"。函数实际返回 undefined 也兼容 \`void\`。

注意回调签名：

\`\`\`ts
type Callback = () => void
const cb: Callback = () => 42   // ✅ 允许返回非 void 值
// 这是为了让回调可以返回任意值，调用方只是忽略它
\`\`\`

但显式声明的 void 函数返回值会被忽略：

\`\`\`ts
function f(): void { return 42 }   // ❌ 报错
\`\`\`

## 选择建议

- **接收外部不可信数据** → \`unknown\` + 类型守卫。
- **永不返回的函数 / 穷尽检查** → \`never\`。
- **函数无返回值** → \`void\`。
- **any** → 尽量避免，只在临时迁移 / 确实无法类型化时使用，并加注释。
- 顶类型用 \`unknown\`，底类型用 \`never\`，二者配合可实现很多类型体操。`
  },
  {
    id: 'ts-025',
    category: 'typescript',
    title: 'TypeScript 的函数重载（Function Overloads）怎么写？有哪些坑？',
    difficulty: '中等',
    tags: ['函数重载', 'overloads', '签名'],
    answer: `## 为什么需要重载

JS 函数常根据参数类型 / 数量返回不同结果，单一签名无法精确描述。重载允许为一个函数提供多个**类型签名**，TS 会按顺序匹配最合适的一个。

\`\`\`ts
// 经典例子：根据输入返回不同类型
function parse(x: string): object
function parse(x: number): number
function parse(x: string | number): unknown {
  if (typeof x === 'string') return JSON.parse(x)
  return x * 2
}
const a = parse('{}')    // object
const b = parse(3)       // number
\`\`\`

## 写法规则

1. **多个重载签名 + 一个实现签名**。
2. 实现签名对外不可见，调用方只能用重载签名。
3. 实现签名必须能兼容所有重载（参数要兼容联合，返回值要够宽）。

\`\`\`ts
function makeDate(timestamp: number): Date
function makeDate(y: number, m: number, d: number): Date
function makeDate(yOrTs: number, m?: number, d?: number): Date {
  if (m === undefined) return new Date(yOrTs)
  return new Date(yOrTs, m, d)
}
makeDate(123456789)        // ✅
makeDate(2024, 5, 1)       // ✅
makeDate(2024, 5)          // ❌ 没有匹配的重载
\`\`\`

## 常见坑

### 1. 实现签名不算重载

\`\`\`ts
function f(x: string): string
function f(x: number): number
function f(x: string | number): string | number { return x }
// 实现签名 'string | number' 不对外可见
f(true)   // ❌ 报错
\`\`\`

调用方只能看到前两个签名。

### 2. 重载顺序很重要

TS 自上而下匹配，更具体的签名要写在前面，否则会被宽泛的签名"抢走"。

\`\`\`ts
function f(x: any): any       // ❌ 应放在后面
function f(x: string): string // 永远匹配不到
\`\`\`

### 3. 用对象/联合类型常可替代重载

很多时候不必写重载，用联合 + 条件类型即可：

\`\`\`ts
function parse<T extends string | number>(x: T): T extends string ? object : number
function parse(x: string | number) {
  if (typeof x === 'string') return JSON.parse(x)
  return x * 2
}
\`\`\`

### 4. 方法重载 vs 函数重载

interface 中可以重载方法：

\`\`\`ts
interface Elem {
  addEventListener(type: 'click', cb: (e: MouseEvent) => void): void
  addEventListener(type: 'scroll', cb: (e: Event) => void): void
  addEventListener(type: string, cb: (e: any) => void): void
}
\`\`\`

这就是 \`addEventListener\` 的真实类型——重载让它对不同事件类型给出精确的回调参数。

## 小结

- 重载提供**多个对外签名 + 一个内部实现**，让 API 类型更精确。
- 实现签名要兼容所有重载；顺序：具体在前，宽泛在后。
- 现代代码可用**联合参数 + 条件类型返回值**简化，避免重载带来的实现签名维护成本。
- 库设计（如事件监听、fetch、querySelector）大量使用重载以提供最佳类型推断。`
  },
  {
    id: 'ts-026',
    category: 'typescript',
    title: 'TypeScript 声明文件（.d.ts）、declare 关键字、@types 与三斜杠指令是怎么回事？',
    difficulty: '中等',
    tags: ['.d.ts', 'declare', '@types', '三斜杠指令', ' ambient'],
    answer: `## 声明文件 .d.ts

\`.d.ts\` 文件**只包含类型声明**，没有任何运行时代码（不会被编译为 JS）。它描述 JS 代码的"类型形状"，让 TS 能理解第三方 JS 库、全局变量等。

\`\`\`ts
// my-lib.d.ts
declare function greet(name: string): string
declare const VERSION: number
declare namespace MyLib {
  function init(): void
  interface Options { debug?: boolean }
}
\`\`\`

引入后，TS 就认识 \`greet\`、\`VERSION\`、\`MyLib\` 这些标识符。

## declare 关键字

\`declare\` 用于声明**已存在但 TS 看不到**的变量/函数/类/命名空间（通常来自 JS、全局、CDN script）。

\`\`\`ts
declare var $: (sel: string) => any      // jQuery 全局变量
declare function foo(): void
declare class Bar { x: number }
declare module 'legacy-lib' {
  export function f(): void
}
declare global {
  interface Window { myFlag: boolean }
}
\`\`\`

### 全局声明 vs 模块声明

- 文件**没有顶层的 import/export** → 视为全局脚本，其中的 declare 直接全局可见。
- 文件有顶层 import/export → 视为模块，要扩展全局需用 \`declare global\`。

## @types 生态

许多 JS 库本身不带类型，社区在 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 维护类型声明，通过 \`@types/xxx\` 安装：

\`\`\`bash
npm i -D @types/lodash @types/node
\`\`\`

安装后 TS 会自动按 \`typeRoots\`/\`types\` 解析，无需手动引用。

查看库是否自带类型：
- \`package.json\` 有 \`types\` 或 \`typings\` 字段 → 自带，无需 \`@types\`。
- 否则去 [npm](https://www.npmjs.com/) 搜 \`@types/xxx\`。

## 自己写声明文件的场景

1. 引入 CDN script（如 jQuery、百度地图 SDK）暴露的全局变量。
2. 老旧 JS 库无类型且无 \`@types\`。
3. import 非代码资源（\`.css\`、\`.svg\`、\`.vue\`）。

\`\`\`ts
// env.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const c: DefineComponent<{}, {}, any>
  export default c
}
declare module '*.png' {
  const src: string
  export default src
}
\`\`\`

## 三斜杠指令（Triple-Slash Directives）

形如 \`/// <reference ... />\`，是早期的依赖声明方式，编译器优先使用 ES import，三斜杠主要用于：

\`\`\`ts
/// <reference types="node" />            // 引入 @types/node 全局声明
/// <reference path="./common.d.ts" />    // 显式包含另一个声明文件
/// <reference lib="ES2022" />            // 显式依赖某个 lib
\`\`\`

现代项目里，\`tsconfig\` 的 \`types\`、\`lib\`、\`include\` 已能覆盖大部分需求，三斜杠多见于 \`@types\` 内部或自动生成的 \`.d.ts\`。

## tsconfig 相关配置

\`\`\`jsonc
{
  "compilerOptions": {
    "declaration": true,          // 编译时生成 .d.ts
    "emitDeclarationOnly": true,  // 只产声明文件（如用 Vite/esbuild 转译 JS）
    "declarationDir": "types",    // 声明文件输出目录
    "typeRoots": ["./node_modules/@types"],  // 类型查找根
    "types": ["node", "vite/client"]         // 显式包含的全局类型
  }
}
\`\`\`

## 小结

- \`.d.ts\` 只放类型，描述"看不见的"运行时代码。
- \`declare\` 声明已存在的全局/模块；\`declare global\` 在模块中扩展全局。
- 优先用 \`@types/xxx\`，第三方缺失再自己写。
- 三斜杠指令是历史遗留，理解即可，新代码用 import 和 tsconfig。
- 自己发 npm 包时，\`declaration: true\` 自动产 \`.d.ts\` 是发布库的标准做法。`
  }

]
