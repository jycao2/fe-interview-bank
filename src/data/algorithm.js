export const algorithmQuestions = [
  {
    id: 'algo-001',
    category: 'algorithm',
    title: '时间复杂度与空间复杂度如何分析？',
    difficulty: '简单',
    tags: ['复杂度', 'Big O'],
    answer: `## 大 O 表示法

描述算法在最坏情况下，运行时间 / 空间随输入规模 n 增长的**渐进上界**，忽略常数与低阶项。

## 常见复杂度（从快到慢）

| 复杂度 | 名称 | 示例 |
| --- | --- | --- |
| O(1) | 常数 | 数组下标访问、哈希表查询 |
| O(log n) | 对数 | 二分查找 |
| O(n) | 线性 | 遍历数组 |
| O(n log n) | 线性对数 | 快排、归并排序 |
| O(n²) | 平方 | 冒泡、选择、插入排序 |
| O(n³) | 立方 | 三重循环 |
| O(2ⁿ) | 指数 | 暴力斐波那契递归 |
| O(n!) | 阶乘 | 全排列暴力 |

## 分析规则

1. **加法取最大**：\`O(f) + O(g) = O(max(f, g))\`。
2. **乘法相乘**：嵌套循环复杂度相乘。
3. **忽略常数与低阶**：\`O(2n+3) = O(n)\`，\`O(n² + n) = O(n²)\`。
4. **看最坏情况**，除非题目要求平均 / 最好。

## 空间复杂度

- 额外开辟的内存随 n 的增长。
- 递归的调用栈也算空间（递归深度）。
- 原地算法 O(1) 空间。

## 示例

\`\`\`js
// O(n)
for (let i = 0; i < n; i++) { ... }

// O(n²)
for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++) { ... }

// O(log n) —— 每次折半
while (n > 1) { n = n / 2 }

// O(log n) 递归斐波那契用备忘录后
\`\`\`

## 注意

- 哈希表查询平均 O(1)，最坏 O(n)。
- 排序下界：基于比较的排序最快 O(n log n)。
- 实际工程中常数项也重要（小数据下 O(n²) 可能比 O(n log n) 快）。`
  },
  {
    id: 'algo-002',
    category: 'algorithm',
    title: '常见排序算法的复杂度与稳定性？',
    difficulty: '中等',
    tags: ['排序', '快排', '归并'],
    answer: `## 对比表

| 算法 | 平均 | 最坏 | 空间 | 稳定 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 冒泡 | O(n²) | O(n²) | O(1) | ✅ | 简单，可提前终止 |
| 选择 | O(n²) | O(n²) | O(1) | ❌ | 交换次数少 |
| 插入 | O(n²) | O(n²) | O(1) | ✅ | 小数据 / 近有序最快 |
| 希尔 | O(n^1.3) | O(n²) | O(1) | ❌ | 分组插入 |
| 快排 | O(n log n) | O(n²) | O(log n) | ❌ | 实践最快， pivot 影响大 |
| 归并 | O(n log n) | O(n log n) | O(n) | ✅ | 稳定，适合链表 / 外排 |
| 堆排 | O(n log n) | O(n log n) | O(1) | ❌ | 原地，建堆 O(n) |
| 计数 | O(n+k) | O(n+k) | O(k) | ✅ | 整数范围小 |
| 基数 | O(d(n+k)) | 同 | O(n+k) | ✅ | 多关键字 |

> 稳定：相等元素的相对顺序不变。

## 快排核心（分治）

\`\`\`js
function quickSort(arr, l = 0, r = arr.length - 1) {
  if (l >= r) return arr
  const pivot = arr[l]
  let i = l, j = r
  while (i < j) {
    while (i < j && arr[j] >= pivot) j--
    while (i < j && arr[i] <= pivot) i++
    if (i < j) [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  [arr[l], arr[i]] = [arr[i], arr[l]]
  quickSort(arr, l, i - 1)
  quickSort(arr, i + 1, r)
  return arr
}
\`\`\`

- 最坏 O(n²) 出现在已排序 + 取端点 pivot，可用随机 pivot / 三数取中优化。
- 工程实现用迭代 + 小区间插入排序（如 V8 的 TimSort）。

## 归并核心

\`\`\`js
function mergeSort(arr) {
  if (arr.length < 2) return arr
  const mid = arr.length >> 1
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}
function merge(a, b) {
  const res = []
  while (a.length && b.length) res.push(a[0] <= b[0] ? a.shift() : b.shift())
  return res.concat(a, b)
}
\`\`\`

## 实践

- JS 引擎 \`Array.prototype.sort\` 现代用 TimSort（归并 + 插入），稳定且高效。
- 面试常考快排手写、归并手写、第 K 大（快选）。`
  },
  {
    id: 'algo-003',
    category: 'algorithm',
    title: '二分查找的写法与边界处理？',
    difficulty: '中等',
    tags: ['二分查找', '查找'],
    answer: `## 适用条件

- **有序**数组 / 单调序列。
- 能根据中间值判断目标在哪一侧。

## 标准模板（左闭右闭）

\`\`\`js
function search(arr, target) {
  let l = 0, r = arr.length - 1
  while (l <= r) {
    const mid = l + ((r - l) >> 1)  // 防溢出
    if (arr[mid] === target) return mid
    else if (arr[mid] < target) l = mid + 1
    else r = mid - 1
  }
  return -1
}
\`\`\`

## 关键点

1. **循环条件**：\`l <= r\`（闭区间）或 \`l < r\`（左闭右开），与区间定义一致。
2. **mid 计算**：\`l + (r - l) / 2\` 防止 \`(l+r)\` 溢出；用 \`>> 1\` 整除。
3. **边界更新**：\`l = mid + 1\` / \`r = mid - 1\`（闭区间），避免死循环。

## 变体：查找第一个 / 最后一个等于目标

\`\`\`js
// 第一个等于 target
function first(arr, target) {
  let l = 0, r = arr.length - 1, ans = -1
  while (l <= r) {
    const mid = (l + r) >> 1
    if (arr[mid] >= target) r = mid - 1
    else l = mid + 1
    if (arr[mid] === target) ans = mid
  }
  return ans
}
\`\`\`

## 变体：在单调函数上二分答案

二分不只用于数组，凡是**具有单调性**的判定都可以二分（如"最小化最大值"问题）：

\`\`\`js
while (l < r) {
  const mid = (l + r) >> 1
  if (check(mid)) r = mid
  else l = mid + 1
}
\`\`\`

## 复杂度

- 时间 O(log n)，空间 O(1)。

## 易错点

- 死循环（边界更新不对）。
- 整数溢出（l + r）。
- 开闭区间不一致。`
  },
  {
    id: 'algo-004',
    category: 'algorithm',
    title: '数组去重有哪些方法？',
    difficulty: '简单',
    tags: ['数组去重', 'Set'],
    answer: `## 1. Set（最简洁）

\`\`\`js
const unique = [...new Set(arr)]
// 或 Array.from(new Set(arr))
\`\`\`

- 利用 Set 元素唯一性。
- 不能去重对象（引用不同）。
- 保留首次出现顺序。

## 2. indexOf / includes

\`\`\`js
arr.filter((item, index) => arr.indexOf(item) === index)
\`\`\`

- O(n²)，简单直观。

## 3. Map / 对象

\`\`\`js
const map = new Map()
arr.forEach(item => map.set(item, true))
return [...map.keys()]
\`\`\`

- O(n)，适合原始类型。

## 4. 排序后去重

\`\`\`js
arr.sort().filter((item, i, a) => i === 0 || item !== a[i - 1])
\`\`\`

- O(n log n)，会改变顺序。

## 对象数组去重

按某个字段去重：

\`\`\`js
const map = new Map()
list.forEach(item => map.set(item.id, item))
return [...map.values()]
\`\`\`

## 选择

- 原始类型：\`new Set\` 最优。
- 对象按字段：Map。
- 需要保留特定顺序 / 条件：filter + Set 缓存。`
  },
  {
    id: 'algo-005',
    category: 'algorithm',
    title: '如何判断链表有环？如何找环入口？',
    difficulty: '中等',
    tags: ['链表', '快慢指针', '环'],
    answer: `## 判断有环：快慢指针（Floyd）

- 慢指针每次走 1 步，快指针每次走 2 步。
- 若有环，快指针一定会追上慢指针（在环内相遇）。
- 若无环，快指针先到 null。

\`\`\`js
function hasCycle(head) {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}
\`\`\`

- 时间 O(n)，空间 O(1)。

## 找环入口

设：
- 链头到环入口距离 a。
- 环入口到相遇点距离 b。
- 环长 L。

相遇时：慢指针走了 \`a + b\`，快指针走了 \`a + b + nL\`（n 圈）。快指针是慢指针 2 倍：

\`2(a + b) = a + b + nL\` → \`a + b = nL\` → \`a = nL - b\`。

即从链头走 a 步 = 从相遇点走 \`nL - b\` 步（即绕回环入口）。所以让一个指针回链头，两指针同速走，相遇点即环入口。

\`\`\`js
function detectCycle(head) {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      // 相遇，慢指针回链头
      slow = head
      while (slow !== fast) {
        slow = slow.next
        fast = fast.next
      }
      return slow  // 环入口
    }
  }
  return null
}
\`\`\`

## 其他方法

- **Set 记录访问节点**：遇到已访问即有环。简单但空间 O(n)。

## 相似问题

- 链表中间节点：快慢指针，快到尾时慢在中点。
- 倒数第 k 个：快指针先走 k 步，再同速走。`
  },
  {
    id: 'algo-006',
    category: 'algorithm',
    title: '常见的动态规划思想？举例说明。',
    difficulty: '困难',
    tags: ['动态规划', 'DP', '递推'],
    answer: `## 核心思想

动态规划（DP）把复杂问题分解为**重叠子问题**，记录子问题解（状态），通过**状态转移方程**递推求解，避免重复计算。

## 适用条件

1. **最优子结构**：问题的最优解由子问题的最优解构成。
2. **重叠子问题**：子问题被重复计算（区别于分治的独立子问题）。

## 解题步骤

1. **定义状态**：\`dp[i]\` 或 \`dp[i][j]\` 代表什么。
2. **推导状态转移方程**。
3. **确定初始条件与边界**。
4. **确定计算顺序**（自底向上递推 / 自顶向下记忆化）。
5. **（可选）空间优化**：滚动数组。

## 经典：爬楼梯

每次爬 1 或 2 阶，爬到 n 阶有多少种方法？

- 状态：\`dp[i]\` = 爬到 i 阶的方法数。
- 转移：\`dp[i] = dp[i-1] + dp[i-2]\`。
- 初始：\`dp[0]=1, dp[1]=1\`。

\`\`\`js
function climbStairs(n) {
  let a = 1, b = 1
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b]
  return b
}
\`\`\`

## 经典：0-1 背包

n 个物品，每个有重量 w[i] 和价值 v[i]，背包容量 W，求最大价值。

- 状态：\`dp[i][j]\` = 前 i 个物品、容量 j 的最大价值。
- 转移：\`dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i]] + v[i])\`（不放 / 放第 i 个）。
- 空间优化为一维：\`dp[j] = max(dp[j], dp[j-w[i]] + v[i])\`，**逆序遍历** j。

## 经典：最长公共子序列 LCS

\`dp[i][j]\` = s1 前 i 与 s2 前 j 的 LCS 长度。

\`\`\`js
if (s1[i-1] === s2[j-1]) dp[i][j] = dp[i-1][j-1] + 1
else dp[i][j] = max(dp[i-1][j], dp[i][j-1])
\`\`\`

## 常见 DP 类型

- 一维：爬楼梯、打家劫舍、最长递增子序列。
- 二维：背包、LCS、编辑距离、矩阵路径。
- 区间 DP：戳气球、回文子串。
- 状态压缩：用位掩码表示集合（旅行商）。

## 与贪心区别

- 贪心：每步取局部最优，不回头，需证明贪心选择性质。
- DP：考虑所有子问题，保证全局最优。`
  },
  {
    id: 'algo-007',
    category: 'algorithm',
    title: '前端常见的算法应用场景？',
    difficulty: '中等',
    tags: ['应用场景', '树', '栈'],
    answer: `## 1. 树的遍历：DOM 操作 / 虚拟 DOM diff

- 递归 / 迭代遍历 DOM 树、组件树。
- diff 算法本质是树的对比（同层比较）。

## 2. 栈：括号匹配 / 撤销重做 / 路由历史

\`\`\`js
// 有效括号
function isValid(s) {
  const stack = [], map = { ')': '(', ']': '[', '}': '{' }
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') stack.push(c)
    else if (stack.pop() !== map[c]) return false
  }
  return !stack.length
}
\`\`\`

- 撤销栈（undo/redo 双栈）、浏览器 history 栈。

## 3. 队列：任务调度 / 消息队列

- 事件循环的宏 / 微任务队列。
- 消息推送队列、请求并发控制。

## 4. 哈希表：缓存 / 计数 / 去重

- LRU 缓存（Map + 双向链表）。
- 依赖收集（Vue 的 dep Map）。
- 两数之和、频率统计。

## 5. 防抖节流：时间相关

- 见相关题目，本质是定时器 + 闭包。

## 6. 二分：查找 / 答案

- 虚拟列表二分查找可视范围。
- 版本号区间定位。

## 7. 深拷贝 / 扁平化：递归 + 栈

- 深拷贝对象图（处理循环引用用 WeakMap）。
- 数组扁平化（递归 / 栈迭代）。

\`\`\`js
function flatten(arr) {
  const stack = [...arr], res = []
  while (stack.length) {
    const item = stack.pop()
    Array.isArray(item) ? stack.push(...item) : res.push(item)
  }
  return res.reverse()
}
\`\`\`

## 8. 动态规划

- 编辑距离（diff 工具、拼写检查）。
- 最长公共子序列（代码 diff）。

## 9. 字符串

- 模板字符串解析、转义。
- 字符串匹配（KMP 用于编辑器搜索）。

## 10. 并发控制

- Promise 并发限制（队列 + 调度）。

> 前端算法题集中在数组、字符串、树、栈队列、哈希、二分、DP，与业务场景结合。`
  },
  {
    id: 'algo-008',
    category: 'algorithm',
    title: '冒泡、选择、插入排序的原理与实现对比？',
    difficulty: '简单',
    tags: ['排序', '冒泡', '选择', '插入'],
    answer: `## 三种基础排序对比

| 算法 | 思想 | 最好 | 最坏 | 平均 | 稳定 | 空间 |
| --- | --- | --- | --- | --- | --- | --- |
| 冒泡 | 相邻比较交换 | O(n) | O(n²) | O(n²) | ✅ | O(1) |
| 选择 | 每轮选最小放前 | O(n²) | O(n²) | O(n²) | ❌ | O(1) |
| 插入 | 逐个插入有序区 | O(n) | O(n²) | O(n²) | ✅ | O(1) |

## 冒泡排序

每轮遍历比较相邻元素，逆序则交换，每轮把最大元素冒泡到末尾。

\`\`\`js
function bubbleSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
      }
    }
    if (!swapped) break
  }
  return arr
}
\`\`\`

- 优化点：\`swapped\` 标志位，已有序时提前退出，最好 O(n)。

## 选择排序

每轮在未排序区找最小值，与未排序区起点交换。

\`\`\`js
function selectionSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
  }
  return arr
}
\`\`\`

- 交换次数最少（每轮最多 1 次），但不稳定（跨距离交换）。
- 最好最坏都是 O(n²)。

## 插入排序

把每个元素插入到已排序区的合适位置（类似整理扑克牌）。

\`\`\`js
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const cur = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > cur) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = cur
  }
  return arr
}
\`\`\`

- 近有序数组最快（接近 O(n)），小数据下常优于快排。
- 稳定（只与更大元素交换）。
- 工程上常作为快排 / TimSort 的小区间排序方案。

## 选择建议

- 数据量小（< 几十）：插入排序最实用。
- 需要稳定性：冒泡 / 插入。
- 减少交换次数：选择排序（牺牲稳定性）。
- 大数据：用 O(n log n) 算法（快排、归并、堆排）。`
  },
  {
    id: 'algo-009',
    category: 'algorithm',
    title: '二叉树的前中后序与层序遍历（递归 + 迭代）？',
    difficulty: '中等',
    tags: ['二叉树', '遍历', '栈', '队列'],
    answer: `## 节点定义

\`\`\`js
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}
\`\`\`

## 递归版（最直观）

\`\`\`js
// 前序：根 → 左 → 右
function preorder(root, res = []) {
  if (!root) return res
  res.push(root.val)
  preorder(root.left, res)
  preorder(root.right, res)
  return res
}

// 中序：左 → 根 → 右（BST 得到升序）
function inorder(root, res = []) {
  if (!root) return res
  inorder(root.left, res)
  res.push(root.val)
  inorder(root.right, res)
  return res
}

// 后序：左 → 右 → 根
function postorder(root, res = []) {
  if (!root) return res
  postorder(root.left, res)
  postorder(root.right, res)
  res.push(root.val)
  return res
}
\`\`\`

- 时间 O(n)，空间 O(h)（递归栈，h 为树高）。

## 迭代版（用栈模拟）

前序迭代：

\`\`\`js
function preorder(root) {
  if (!root) return []
  const res = [], stack = [root]
  while (stack.length) {
    const node = stack.pop()
    res.push(node.val)
    if (node.right) stack.push(node.right)
    if (node.left) stack.push(node.left)
  }
  return res
}
\`\`\`

中序迭代：

\`\`\`js
function inorder(root) {
  const res = [], stack = []
  let cur = root
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur)
      cur = cur.left
    }
    cur = stack.pop()
    res.push(cur.val)
    cur = cur.right
  }
  return res
}
\`\`\`

后序迭代（前序变体：根右左 → 反转）：

\`\`\`js
function postorder(root) {
  if (!root) return []
  const res = [], stack = [root]
  while (stack.length) {
    const node = stack.pop()
    res.push(node.val)
    if (node.left) stack.push(node.left)
    if (node.right) stack.push(node.right)
  }
  return res.reverse()
}
\`\`\`

## 层序遍历（BFS，用队列）

\`\`\`js
function levelOrder(root) {
  if (!root) return []
  const res = [], queue = [root]
  while (queue.length) {
    const level = []
    const size = queue.length
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      level.push(node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    res.push(level)
  }
  return res
}
\`\`\`

- 时间 O(n)，空间 O(w)（w 为树最大宽度）。

## 应用

- 前序：复制树、序列化。
- 中序：BST 升序遍历、验证 BST。
- 后序：计算目录大小、表达式求值。
- 层序：ZigZag 打印、最短路径（无权图 BFS）。

## 进阶

- Morris 遍历：O(1) 空间，利用线索指针。
- 锯齿形层序：奇偶层交替 reverse。`
  },
  {
    id: 'algo-010',
    category: 'algorithm',
    title: '反转链表与合并两个有序链表？',
    difficulty: '中等',
    tags: ['链表', '反转', '合并'],
    answer: `## 节点定义

\`\`\`js
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val
    this.next = next
  }
}
\`\`\`

## 反转链表（迭代）

用三个指针 prev / cur / next 逐个翻转。

\`\`\`js
function reverseList(head) {
  let prev = null, cur = head
  while (cur) {
    const next = cur.next
    cur.next = prev
    prev = cur
    cur = next
  }
  return prev
}
\`\`\`

- 时间 O(n)，空间 O(1)。

## 反转链表（递归）

\`\`\`js
function reverseList(head) {
  if (!head || !head.next) return head
  const newHead = reverseList(head.next)
  head.next.next = head
  head.next = null
  return newHead
}
\`\`\`

- 递归到尾节点，回溯时翻转指针。
- 空间 O(n)（递归栈）。

## 反转区间 [m, n]

\`\`\`js
function reverseBetween(head, m, n) {
  const dummy = new ListNode(0, head)
  let prev = dummy
  for (let i = 1; i < m; i++) prev = prev.next
  let cur = prev.next
  for (let i = 0; i < n - m; i++) {
    const next = cur.next
    cur.next = next.next
    next.next = prev.next
    prev.next = next
  }
  return dummy.next
}
\`\`\`

- 头插法：把后续节点逐个插到反转区间起点之前。

## 合并两个有序链表

\`\`\`js
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode()
  let cur = dummy
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      cur.next = l1
      l1 = l1.next
    } else {
      cur.next = l2
      l2 = l2.next
    }
    cur = cur.next
  }
  cur.next = l1 || l2
  return dummy.next
}
\`\`\`

- 哑节点简化头节点处理。
- 时间 O(n + m)，空间 O(1)。

## 合并 K 个有序链表

- 暴力：依次两两合并，O(kN)。
- 分治：归并式合并，O(N log k)。
- 最小堆：每次取最小节点，O(N log k)。

\`\`\`js
function mergeKLists(lists) {
  if (!lists.length) return null
  const merge = (a, b) => {
    const dummy = new ListNode()
    let cur = dummy
    while (a && b) {
      if (a.val <= b.val) { cur.next = a; a = a.next }
      else { cur.next = b; b = b.next }
      cur = cur.next
    }
    cur.next = a || b
    return dummy.next
  }
  while (lists.length > 1) {
    const next = []
    for (let i = 0; i < lists.length; i += 2) {
      next.push(merge(lists[i], lists[i + 1] || null))
    }
    lists = next
  }
  return lists[0]
}
\`\`\`

## 相似问题

- 分隔链表、回文链表、K 个一组反转。`
  },
  {
    id: 'algo-011',
    category: 'algorithm',
    title: '栈与队列的经典应用（用栈实现队列、滑动窗口最大值）？',
    difficulty: '中等',
    tags: ['栈', '队列', '单调队列', '单调栈'],
    answer: `## 用栈实现队列

两个栈：输入栈 push 数据，输出栈 pop 数据。输出栈空时把输入栈全部倒入。

\`\`\`js
class MyQueue {
  constructor() {
    this.inStack = []
    this.outStack = []
  }
  push(x) {
    this.inStack.push(x)
  }
  pop() {
    this.peek()
    return this.outStack.pop()
  }
  peek() {
    if (!this.outStack.length) {
      while (this.inStack.length) {
        this.outStack.push(this.inStack.pop())
      }
    }
    return this.outStack[this.outStack.length - 1]
  }
  empty() {
    return !this.inStack.length && !this.outStack.length
  }
}
\`\`\`

- 均摊 O(1)：每个元素最多入栈两次、出栈两次。
- 同理可用两个队列实现栈。

## 滑动窗口最大值

给定数组和窗口大小 k，返回每个窗口的最大值。

### 暴力法 O(nk)

每个窗口扫一遍找最大，超时。

### 单调队列 O(n)

维护一个单调递减的双端队列，队首始终是当前窗口最大值。

\`\`\`js
function maxSlidingWindow(nums, k) {
  const res = []
  const deque = []
  for (let i = 0; i < nums.length; i++) {
    if (deque[0] <= i - k) deque.shift()
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop()
    }
    deque.push(i)
    if (i >= k - 1) res.push(nums[deque[0]])
  }
  return res
}
\`\`\`

- 每个元素最多入队出队各一次，O(n)。

## 单调栈：每日温度

求每个位置下一个更高温度的距离。

\`\`\`js
function dailyTemperatures(T) {
  const res = new Array(T.length).fill(0)
  const stack = []
  for (let i = 0; i < T.length; i++) {
    while (stack.length && T[i] > T[stack[stack.length - 1]]) {
      const top = stack.pop()
      res[top] = i - top
    }
    stack.push(i)
  }
  return res
}
\`\`\`

- 单调栈适合下一个更大或更小元素问题。

## 其他经典应用

- 函数调用栈、表达式求值（双栈：数值栈 + 运算符栈）。
- 括号匹配（见 algo-007）。
- 撤销 / 重做双栈。
- BFS 用队列、拓扑排序用入度队列。

## 单调队列 vs 单调栈

| 结构 | 维护方向 | 用途 |
| --- | --- | --- |
| 单调栈 | 入栈时弹栈尾 | 下一个更大 / 更小元素 |
| 单调队列 | 入队时弹队尾 + 出队首 | 滑动窗口最值 |`
  },
  {
    id: 'algo-012',
    category: 'algorithm',
    title: '回溯算法思想（全排列、子集、N 皇后）？',
    difficulty: '困难',
    tags: ['回溯', 'DFS', '全排列'],
    answer: `## 核心思想

回溯 = DFS + 撤销选择。在搜索过程中做选择 → 递归 → 撤销选择，本质是遍历决策树。

## 模板

\`\`\`js
function backtrack(path, choices) {
  if (满足结束条件) {
    res.push([...path])
    return
  }
  for (const choice of choices) {
    做选择（path.push / 标记）
    backtrack(path, 新的choices)
    撤销选择（path.pop / 取消标记）
  }
}
\`\`\`

## 全排列

给定不重复数字，返回所有全排列。

\`\`\`js
function permute(nums) {
  const res = [], used = new Array(nums.length).fill(false)
  const dfs = (path) => {
    if (path.length === nums.length) {
      res.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      used[i] = true
      path.push(nums[i])
      dfs(path)
      path.pop()
      used[i] = false
    }
  }
  dfs([])
  return res
}
\`\`\`

- 时间 O(n * n!)，空间 O(n)。
- 含重复元素：先排序，同层相同元素跳过。

## 子集

返回数组所有子集（无重复元素）。

\`\`\`js
function subsets(nums) {
  const res = []
  const dfs = (start, path) => {
    res.push([...path])
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i])
      dfs(i + 1, path)
      path.pop()
    }
  }
  dfs(0, [])
  return res
}
\`\`\`

- 用 start 保证不回头选前面的元素，避免重复。
- 含重复元素：排序后 \`if (i > start && nums[i] === nums[i-1]) continue\`。

## 组合总和

\`\`\`js
function combinationSum(candidates, target) {
  const res = []
  const dfs = (start, path, sum) => {
    if (sum === target) { res.push([...path]); return }
    if (sum > target) return
    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i])
      dfs(i, path, sum + candidates[i])
      path.pop()
    }
  }
  dfs(0, [], 0)
  return res
}
\`\`\`

## N 皇后

在 N×N 棋盘放 N 个皇后，互不攻击（同行同列同对角线不能有两个）。

\`\`\`js
function solveNQueens(n) {
  const res = []
  const cols = new Set(), diag1 = new Set(), diag2 = new Set()
  const board = []
  const dfs = (row) => {
    if (row === n) {
      res.push(board.map(c => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)))
      return
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue
      cols.add(col); diag1.add(row - col); diag2.add(row + col)
      board.push(col)
      dfs(row + 1)
      board.pop()
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col)
    }
  }
  dfs(0)
  return res
}
\`\`\`

- 时间 O(n!)，空间 O(n)。
- 用三个集合快速判重：列、主对角线（row-col）、副对角线（row+col）。

## 剪枝优化

- 排序 + 提前终止（如组合总和 sum > target 直接 return）。
- 对称性剪枝。
- 优先选择分支少的路径。

## 适用场景

排列、组合、子集、棋盘问题、数独、切割问题。`
  },
  {
    id: 'algo-013',
    category: 'algorithm',
    title: '贪心算法思想（找零、跳跃游戏、区间问题）？',
    difficulty: '中等',
    tags: ['贪心', '跳跃游戏', '区间'],
    answer: `## 核心思想

每一步选择当前最优（局部最优），希望累积成全局最优。不回头、不撤销。

## 适用条件

1. 贪心选择性质：局部最优能导致全局最优。
2. 最优子结构：问题的最优解包含子问题的最优解。

> 与 DP 区别：DP 会枚举所有子问题，贪心只选一个；贪心更快但不一定得到最优解，需要证明。

## 找零问题

给定硬币面额 [1, 5, 10, 25]，凑 amount 最少硬币数。

\`\`\`js
function coinChangeGreedy(coins, amount) {
  coins.sort((a, b) => b - a)
  let count = 0
  for (const coin of coins) {
    const k = Math.floor(amount / coin)
    count += k
    amount -= k * coin
    if (amount === 0) return count
  }
  return amount === 0 ? count : -1
}
\`\`\`

- 仅对特殊面额（如美元 1/5/10/25）最优。
- 一般面额（如 [1, 3, 4] 凑 6）贪心得 4+1+1=3 枚，实际最优是 3+3=2 枚 → 需用 DP。

## 跳跃游戏

判断能否跳到末尾：每个位置 nums[i] 表示最多能跳几步。

\`\`\`js
function canJump(nums) {
  let maxReach = 0
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false
    maxReach = Math.max(maxReach, i + nums[i])
    if (maxReach >= nums.length - 1) return true
  }
  return true
}
\`\`\`

- 贪心维护能到达的最远位置。
- 时间 O(n)。

## 跳跃游戏 II（最少跳跃次数）

\`\`\`js
function jump(nums) {
  let steps = 0, end = 0, maxReach = 0
  for (let i = 0; i < nums.length - 1; i++) {
    maxReach = Math.max(maxReach, i + nums[i])
    if (i === end) {
      steps++
      end = maxReach
    }
  }
  return steps
}
\`\`\`

- 维护当前跳跃能到的边界，到边界就 +1 步。
- 时间 O(n)，空间 O(1)。

## 区间调度（最多不重叠区间）

按右端点排序，每次选结束最早的能选区间。

\`\`\`js
function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1])
  let count = 0, end = -Infinity
  for (const [s, e] of intervals) {
    if (s >= end) { end = e }
    else count++
  }
  return count
}
\`\`\`

## 合并区间

按左端点排序，依次合并重叠区间。

\`\`\`js
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0])
  const res = [intervals[0]]
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1]
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1])
    } else {
      res.push(intervals[i])
    }
  }
  return res
}
\`\`\`

## 其他经典

- 分发饼干（小孩胃口 vs 饼干大小，都排序后双指针）。
- 摆动序列、买卖股票（每段上升都加）。
- Huffman 编码、Dijkstra、Prim。

## 贪心 vs DP

| 维度 | 贪心 | DP |
| --- | --- | --- |
| 选择 | 当前最优 | 枚举所有 |
| 复杂度 | 通常 O(n log n) | O(n²) / O(nk) |
| 正确性 | 需证明 | 保证最优 |
| 适用 | 明确贪心性质 | 最优化问题 |`
  },
  {
    id: 'algo-014',
    category: 'algorithm',
    title: 'LRU 缓存的设计思路（双向链表 + 哈希表）？',
    difficulty: '困难',
    tags: ['LRU', '设计', '双向链表', '哈希表'],
    answer: `## 需求

实现 get(key) 和 put(key, value)，都要求 O(1)，且容量超限时淘汰最久未使用。

## 数据结构选择

单一结构都无法满足：
- 哈希表：O(1) 查找，但无顺序，无法判断最久未使用。
- 链表：有顺序，但查找 O(n)。

组合：哈希表存 key → 节点指针，双向链表维护使用顺序。

| 操作 | 哈希表 | 双向链表 |
| --- | --- | --- |
| get | O(1) 定位节点 | O(1) 移到头部 |
| put | O(1) | O(1) 加头 / 淘汰尾 |

## 为什么用双向链表

- 删除节点需要 O(1)，必须知道前驱 → 双向。
- 单向链表删节点需要遍历找前驱 O(n)。

## 哨兵节点

用 dummy head / tail 简化边界判断（空链、首尾节点）：

\`\`\`
dummyHead ⇄ real nodes ⇄ dummyTail
\`\`\`

## 完整实现

\`\`\`js
class Node {
  constructor(key = 0, val = 0) {
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

  get(key) {
    if (!this.map.has(key)) return -1
    const node = this.map.get(key)
    this._remove(node)
    this._addToHead(node)
    return node.val
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key)
      node.val = value
      this._remove(node)
      this._addToHead(node)
    } else {
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev
        this._remove(lru)
        this.map.delete(lru.key)
      }
      const node = new Node(key, value)
      this.map.set(key, node)
      this._addToHead(node)
    }
  }
}
\`\`\`

## JS 简化版（利用 Map 顺序）

JS Map 的迭代顺序 = 插入顺序，delete + set 可重置顺序：

\`\`\`js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()
  }
  get(key) {
    if (!this.cache.has(key)) return -1
    const v = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, v)
    return v
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key)
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, value)
  }
}
\`\`\`

- 面试手写最快方案，但本质依赖 Map 的有序特性。

## 复杂度

- get / put：O(1) 时间，O(capacity) 空间。

## 演进：LFU 缓存

- LFU（最不经常使用）：维护频率，需要两个哈希表 + 双向链表（频率 → 节点链表 + key → 节点）。
- LRU-K：记录最近 K 次访问，更精准但实现复杂。

## 应用

- CPU 缓存、Redis 淘汰策略（allkeys-lru）。
- Vue keep-alive、图片缓存、接口数据缓存。`
  },
  {
    id: 'algo-015',
    category: 'algorithm',
    title: '防抖节流与深拷贝的算法视角？',
    difficulty: '中等',
    tags: ['防抖', '节流', '深拷贝', '图遍历'],
    answer: `## 防抖节流：滑动窗口 + 状态机

防抖节流本质是在事件流上做时间窗口控制。

### 防抖

连续触发时只保留最后一次，等空闲期到达才执行。类似滑动窗口清零：每来一个事件就重置计时。

\`\`\`js
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}
\`\`\`

### 节流

固定窗口内最多执行一次。用时间戳判断是否跨过窗口边界：

\`\`\`js
function throttle(fn, delay) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= delay) {
      fn.apply(this, args)
      last = now
    }
  }
}
\`\`\`

### 算法视角

- 防抖 = 延迟执行 + 每次事件重置定时器。
- 节流 = 滑动窗口 / 固定窗口限流。
- 应用：搜索框、resize、scroll、按钮防连点。

## 深拷贝：图的遍历

对象图是一个有向图（属性引用其他对象），深拷贝就是遍历这个图并复制每个节点。

### 循环引用 = 图中的环

\`\`\`js
const a = { x: 1 }
a.self = a  // 自引用，形成环
\`\`\`

朴素递归会栈溢出，需要记录已访问节点（visited 集合）。

### 实现（DFS + WeakMap 记忆化）

\`\`\`js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (hash.has(obj)) return hash.get(obj)

  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  const clone = Array.isArray(obj) ? [] : {}
  hash.set(obj, clone)

  Reflect.ownKeys(obj).forEach((key) => {
    clone[key] = deepClone(obj[key], hash)
  })
  return clone
}
\`\`\`

### 关键点

1. WeakMap 记录原对象 → 克隆对象映射，遇到已访问对象直接返回引用，破除环。
2. 先 set 再递归（不能递归完再 set，否则环会死循环）。
3. WeakMap 而非 Map：原对象可被回收，不阻止 GC。
4. \`Reflect.ownKeys\` 包含 Symbol 属性。

### 复杂度

- 时间 O(V + E)：每个节点 / 每条边访问一次（图遍历）。
- 空间 O(V)：visited 表 + 递归栈。

## 其他循环引用处理方式

### BFS 实现

\`\`\`js
function deepCloneBFS(root) {
  if (root === null || typeof root !== 'object') return root
  const map = new Map()
  const clone = Array.isArray(root) ? [] : {}
  map.set(root, clone)
  const queue = [root]
  while (queue.length) {
    const original = queue.shift()
    const copy = map.get(original)
    Reflect.ownKeys(original).forEach((key) => {
      const val = original[key]
      if (val !== null && typeof val === 'object') {
        if (!map.has(val)) {
          map.set(val, Array.isArray(val) ? [] : {})
          queue.push(val)
        }
        copy[key] = map.get(val)
      } else {
        copy[key] = val
      }
    })
  }
  return clone
}
\`\`\`

### 原生 structuredClone

\`\`\`js
structuredClone(obj)
\`\`\`

- 原生支持循环引用、Date、Map、Set、ArrayBuffer。
- 不支持函数、DOM 节点、特殊原型对象。

## 算法关联

| 问题 | 本质 |
| --- | --- |
| 深拷贝循环引用 | 图遍历 + 环检测 |
| 防抖节流 | 事件流时间窗口 |
| 对象扁平化 | 树遍历 |
| 依赖收集 | 图遍历 + 拓扑排序 |`
  }
]
