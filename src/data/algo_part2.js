// 算法题库片段 2：栈与队列 / 二分查找 / 排序算法（共 33 题，ID algo-092 到 algo-124）
export const part2Problems = [
  // ====================== 栈与队列（13 道，id 092-104） ======================
  // ---- 简单 5 ----
  {
    id: 'algo-092',
    no: '92',
    title: '有效的括号',
    difficulty: '简单',
    tags: ['栈', '字符串'],
    desc: `给定一个只包括 \`'('\`、\`')'\`、\`'{'\`、\`'}'\`、\`'['\`、\`']'\` 的字符串 \`s\`，判断字符串是否有效。

有效字符串需满足：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

示例 1：
\`\`\`
输入：s = "()"
输出：true
\`\`\`

示例 2：
\`\`\`
输入：s = "()[]{}"
输出：true
\`\`\`

示例 3：
\`\`\`
输入：s = "(]"
输出：false
\`\`\``,
    functionName: 'isValid',
    starterCode: 'function isValid(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['()'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['()[]{}'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['(]'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['([)]'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['{[]}'], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用栈模拟。遍历字符串，遇到左括号入栈，遇到右括号时弹出栈顶并检查是否匹配。若不匹配或栈为空则无效。最后栈必须为空。

\`\`\`js
function isValid(s) {
  const stack = []
  const map = { ')': '(', '}': '{', ']': '[' }
  for (const c of s) {
    if (c === '(' || c === '{' || c === '[') {
      stack.push(c)
    } else {
      if (stack.length === 0 || stack.pop() !== map[c]) return false
    }
  }
  return stack.length === 0
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-093',
    no: '93',
    title: '最小栈',
    difficulty: '简单',
    tags: ['栈', '设计'],
    desc: `设计一个支持 \`push\`、\`pop\`、\`top\` 操作，并能在常数时间内检索到最小元素的栈。

实现 \`MinStack\` 类：
- \`MinStack()\` 初始化栈对象。
- \`push(val)\` 将元素压入栈顶。
- \`pop()\` 移除栈顶元素。
- \`top()\` 获取栈顶元素。
- \`getMin()\` 获取栈中最小元素。

本题以操作序列形式输入：第一个数组为操作名，第二个数组为参数（无参操作传空数组）。

示例：
\`\`\`
输入：operations = ["MinStack","push","push","push","getMin","pop","top","getMin"]
      params       = [[],[-2],[0],[-3],[],[],[],[]]
输出：[null,null,null,null,-3,null,0,-2]
\`\`\``,
    functionName: 'minStack',
    starterCode: 'function minStack(operations, params) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], [[], [-2], [0], [-3], [], [], [], []]], expected: [null, null, null, null, -3, null, 0, -2], inputConvert: null, outputConvert: null },
      { input: [['MinStack', 'push', 'push', 'getMin', 'push', 'getMin'], [[], [1], [2], [], [0], []]], expected: [null, null, null, 1, null, 0], inputConvert: null, outputConvert: null },
      { input: [['MinStack', 'push', 'push', 'pop', 'getMin'], [[], [3], [5], [], []]], expected: [null, null, null, null, 3], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

使用两个栈：主栈存数据，辅助栈存当前最小值。push 时若值 ≤ 辅助栈顶则同步入栈；pop 时若值等于辅助栈顶则同步出栈。getMin 直接读辅助栈顶。

\`\`\`js
function minStack(operations, params) {
  const results = []
  const stack = []
  const minStack = []
  for (let i = 0; i < operations.length; i++) {
    switch (operations[i]) {
      case 'MinStack':
        results.push(null)
        break
      case 'push':
        stack.push(params[i][0])
        if (minStack.length === 0 || params[i][0] <= minStack[minStack.length - 1]) {
          minStack.push(params[i][0])
        }
        results.push(null)
        break
      case 'pop': {
        const val = stack.pop()
        if (val === minStack[minStack.length - 1]) minStack.pop()
        results.push(null)
        break
      }
      case 'top':
        results.push(stack[stack.length - 1])
        break
      case 'getMin':
        results.push(minStack[minStack.length - 1])
        break
    }
  }
  return results
}
\`\`\``,
    timeComplexity: 'O(1) 每个操作',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-094',
    no: '94',
    title: '用栈实现队列',
    difficulty: '简单',
    tags: ['栈', '设计', '队列'],
    desc: `请你仅使用两个栈实现一个先入先出（FIFO）的队列。

实现 \`MyQueue\` 类：
- \`MyQueue()\` 初始化队列。
- \`push(x)\` 将元素 x 推到队列末尾。
- \`pop()\` 从队列开头移除并返回元素。
- \`peek()\` 返回队列开头的元素。
- \`empty()\` 判断队列是否为空。

以操作序列形式输入。

示例：
\`\`\`
输入：operations = ["MyQueue","push","push","peek","pop","empty"]
      params       = [[],[1],[2],[],[],[]]
输出：[null,null,null,1,1,false]
\`\`\``,
    functionName: 'myQueue',
    starterCode: 'function myQueue(operations, params) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [['MyQueue', 'push', 'push', 'peek', 'pop', 'empty'], [[], [1], [2], [], [], []]], expected: [null, null, null, 1, 1, false], inputConvert: null, outputConvert: null },
      { input: [['MyQueue', 'empty'], [[], []]], expected: [null, true], inputConvert: null, outputConvert: null },
      { input: [['MyQueue', 'push', 'pop', 'empty'], [[], [5], [], []]], expected: [null, null, 5, true], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

两个栈：入栈 \`inStack\` 和出栈 \`outStack\`。push 直接入 inStack；pop/peek 时若 outStack 为空，把 inStack 全部倒入 outStack 再操作，保证 FIFO 顺序。

\`\`\`js
function myQueue(operations, params) {
  const results = []
  const inStack = []
  const outStack = []
  for (let i = 0; i < operations.length; i++) {
    switch (operations[i]) {
      case 'MyQueue':
        results.push(null)
        break
      case 'push':
        inStack.push(params[i][0])
        results.push(null)
        break
      case 'pop':
        if (outStack.length === 0) {
          while (inStack.length > 0) outStack.push(inStack.pop())
        }
        results.push(outStack.pop())
        break
      case 'peek':
        if (outStack.length === 0) {
          while (inStack.length > 0) outStack.push(inStack.pop())
        }
        results.push(outStack[outStack.length - 1])
        break
      case 'empty':
        results.push(inStack.length === 0 && outStack.length === 0)
        break
    }
  }
  return results
}
\`\`\``,
    timeComplexity: 'O(1) 均摊',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-095',
    no: '95',
    title: '下一个更大元素 I',
    difficulty: '简单',
    tags: ['栈', '单调栈', '哈希表'],
    desc: `给你两个没有重复元素的数组 \`nums1\` 和 \`nums2\`，其中 \`nums1\` 是 \`nums2\` 的子集。

请你找出 \`nums1\` 中每个元素在 \`nums2\` 中的下一个比其大的值。如果不存在，返回 -1。

示例 1：
\`\`\`
输入：nums1 = [4,1,2], nums2 = [1,3,4,2]
输出：[-1,3,-1]
\`\`\`

示例 2：
\`\`\`
输入：nums1 = [2,4], nums2 = [1,2,3,4]
输出：[3,-1]
\`\`\``,
    functionName: 'nextGreaterElement',
    starterCode: 'function nextGreaterElement(nums1, nums2) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[4, 1, 2], [1, 3, 4, 2]], expected: [-1, 3, -1], inputConvert: null, outputConvert: null },
      { input: [[2, 4], [1, 2, 3, 4]], expected: [3, -1], inputConvert: null, outputConvert: null },
      { input: [[1], [1]], expected: [-1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

对 \`nums2\` 用单调栈预处理每个元素的下一个更大元素，存入哈希表。再遍历 \`nums1\` 查表即可。

\`\`\`js
function nextGreaterElement(nums1, nums2) {
  const map = {}
  const stack = []
  for (const num of nums2) {
    while (stack.length > 0 && stack[stack.length - 1] < num) {
      map[stack.pop()] = num
    }
    stack.push(num)
  }
  return nums1.map(n => (map[n] !== undefined ? map[n] : -1))
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-096',
    no: '96',
    title: '棒球比赛',
    difficulty: '简单',
    tags: ['栈', '数组'],
    desc: `你现在是一场棒球比赛的记录员。给定一个字符串列表 \`ops\`，记录了该场比赛的所有操作。有效操作如下：

- 整数：表示本轮得分。
- \`"+"\`：表示本轮得分是前两轮得分的总和。
- \`"D"\`：表示本轮得分是前一轮得分的两倍。
- \`"C"\`：表示前一轮得分无效，将其移除。

请返回所有轮次得分的总和。

示例 1：
\`\`\`
输入：ops = ["5","2","C","D","+"]
输出：30
\`\`\`

示例 2：
\`\`\`
输入：ops = ["5","-2","4","C","D","9","+","+"]
输出：27
\`\`\``,
    functionName: 'calPoints',
    starterCode: 'function calPoints(ops) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [['5', '2', 'C', 'D', '+']], expected: 30, inputConvert: null, outputConvert: null },
      { input: [['5', '-2', '4', 'C', 'D', '9', '+', '+']], expected: 27, inputConvert: null, outputConvert: null },
      { input: [['1']], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用栈模拟。整数入栈，\`"C"\` 弹栈，\`"D"\` 入栈顶 ×2，\`"+\"\` 入栈顶两个之和。最后求栈元素总和。

\`\`\`js
function calPoints(ops) {
  const stack = []
  for (const op of ops) {
    if (op === '+') {
      stack.push(stack[stack.length - 1] + stack[stack.length - 2])
    } else if (op === 'D') {
      stack.push(stack[stack.length - 1] * 2)
    } else if (op === 'C') {
      stack.pop()
    } else {
      stack.push(parseInt(op))
    }
  }
  return stack.reduce((a, b) => a + b, 0)
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  // ---- 中等 5 ----
  {
    id: 'algo-097',
    no: '97',
    title: '每日温度',
    difficulty: '中等',
    tags: ['栈', '单调栈'],
    desc: `请根据每日气温列表 \`temperatures\`，重新生成一个列表，要求其对应位置的输出为：要想观测到更高的气温，至少需要等待的天数。如果之后没有更高的气温，则用 0 代替。

示例 1：
\`\`\`
输入：temperatures = [73,74,75,71,69,72,76,73]
输出：[1,1,4,2,1,1,0,0]
\`\`\`

示例 2：
\`\`\`
输入：temperatures = [30,40,50,60]
输出：[1,1,1,0]
\`\`\``,
    functionName: 'dailyTemperatures',
    starterCode: 'function dailyTemperatures(temperatures) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0], inputConvert: null, outputConvert: null },
      { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0], inputConvert: null, outputConvert: null },
      { input: [[30, 60, 90]], expected: [1, 1, 0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

单调递减栈存下标。遍历温度，当当前温度 > 栈顶下标对应温度时，弹出栈顶，该下标的答案 = 当前下标 - 栈顶下标。

\`\`\`js
function dailyTemperatures(temperatures) {
  const n = temperatures.length
  const result = new Array(n).fill(0)
  const stack = []
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const idx = stack.pop()
      result[idx] = i - idx
    }
    stack.push(i)
  }
  return result
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-098',
    no: '98',
    title: '下一个更大元素 II',
    difficulty: '中等',
    tags: ['栈', '单调栈'],
    desc: `给定一个循环整数数组 \`nums\`（数组的最后一个元素的下一个元素是数组的第一个元素），输出每个元素的下一个更大元素。如果不存在，输出 -1。

示例 1：
\`\`\`
输入：nums = [1,2,1]
输出：[2,-1,2]
\`\`\`

示例 2：
\`\`\`
输入：nums = [1,2,3,4,3]
输出：[2,3,4,-1,4]
\`\`\``,
    functionName: 'nextGreaterElements',
    starterCode: 'function nextGreaterElements(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 1]], expected: [2, -1, 2], inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4, 3]], expected: [2, 3, 4, -1, 4], inputConvert: null, outputConvert: null },
      { input: [[5, 4, 3, 2, 1]], expected: [-1, 5, 5, 5, 5], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

将数组虚拟拼接成两倍长度（用取模实现），用单调栈遍历两圈，第一圈只入栈不下标，第二圈正常处理。

\`\`\`js
function nextGreaterElements(nums) {
  const n = nums.length
  const result = new Array(n).fill(-1)
  const stack = []
  for (let i = 0; i < 2 * n; i++) {
    const idx = i % n
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[idx]) {
      result[stack.pop()] = nums[idx]
    }
    if (i < n) stack.push(idx)
  }
  return result
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-099',
    no: '99',
    title: '字符串解码',
    difficulty: '中等',
    tags: ['栈', '字符串'],
    desc: `给定一个经过编码的字符串，返回它解码后的字符串。编码规则为 \`k[encoded_string]\`，表示其中 \`encoded_string\` 重复 \`k\` 次。输入字符串保证格式合法，数字只表示重复次数。

示例 1：
\`\`\`
输入：s = "3[a]2[bc]"
输出："aaabcbc"
\`\`\`

示例 2：
\`\`\`
输入：s = "3[a2[c]]"
输出："accaccacc"
\`\`\`

示例 3：
\`\`\`
输入：s = "2[abc]3[cd]ef"
输出："abcabccdcdcdef"
\`\`\``,
    functionName: 'decodeString',
    starterCode: 'function decodeString(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['3[a]2[bc]'], expected: 'aaabcbc', inputConvert: null, outputConvert: null },
      { input: ['3[a2[c]]'], expected: 'accaccacc', inputConvert: null, outputConvert: null },
      { input: ['2[abc]3[cd]ef'], expected: 'abcabccdcdcdef', inputConvert: null, outputConvert: null },
      { input: ['abc3[cd]xyz'], expected: 'abccdcdcdxyz', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用栈。遇到 \`[\` 时把当前字符串和数字压栈并重置；遇到 \`]\` 时弹出，将当前字符串重复对应次数后拼到前一段字符串后面。

\`\`\`js
function decodeString(s) {
  const stack = []
  let num = 0
  let str = ''
  for (const c of s) {
    if (c >= '0' && c <= '9') {
      num = num * 10 + parseInt(c)
    } else if (c === '[') {
      stack.push([str, num])
      str = ''
      num = 0
    } else if (c === ']') {
      const [prevStr, prevNum] = stack.pop()
      str = prevStr + str.repeat(prevNum)
    } else {
      str += c
    }
  }
  return str
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-100',
    no: '100',
    title: '栈排序',
    difficulty: '中等',
    tags: ['栈', '排序'],
    desc: `给定一个由整数组成的栈（数组表示，末尾为栈顶），请使用一个辅助栈对其进行排序，使最小元素位于栈顶。返回排序后的栈（数组表示，末尾为栈顶，即数组降序排列）。

示例 1：
\`\`\`
输入：stack = [3,1,2]
输出：[3,2,1]
解释：栈顶为 1（最小），栈底为 3（最大）
\`\`\`

示例 2：
\`\`\`
输入：stack = [5,3,8,1]
输出：[8,5,3,1]
\`\`\``,
    functionName: 'sortStack',
    starterCode: 'function sortStack(stack) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[3, 1, 2]], expected: [3, 2, 1], inputConvert: null, outputConvert: null },
      { input: [[5, 3, 8, 1]], expected: [8, 5, 3, 1], inputConvert: null, outputConvert: null },
      { input: [[1]], expected: [1], inputConvert: null, outputConvert: null },
      { input: [[2, 1]], expected: [2, 1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

辅助栈保持降序（栈顶最小）。从原栈弹出一个元素，若辅助栈顶比它大，就把辅助栈顶逐一弹回原栈，直到辅助栈顶 ≤ 该元素，再压入辅助栈。最后把辅助栈倒回原栈。

\`\`\`js
function sortStack(stack) {
  stack = [...stack]
  const temp = []
  while (stack.length > 0) {
    const cur = stack.pop()
    while (temp.length > 0 && temp[temp.length - 1] > cur) {
      stack.push(temp.pop())
    }
    temp.push(cur)
  }
  while (temp.length > 0) {
    stack.push(temp.pop())
  }
  return stack
}
\`\`\``,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-101',
    no: '101',
    title: '基本计算器 II',
    difficulty: '中等',
    tags: ['栈', '数学', '字符串'],
    desc: `给你一个字符串表达式 \`s\`，请你实现一个基本计算器来计算并返回它的值。整数除法只保留整数部分。` + '`s`' + ` 由整数和运算符 \`'+'\`、\`'-'\`、\`'*'\`、\`'/'\` 组成，可能有空格。

示例 1：
\`\`\`
输入：s = "3+2*2"
输出：7
\`\`\`

示例 2：
\`\`\`
输入：s = " 3/2 "
输出：1
\`\`\`

示例 3：
\`\`\`
输入：s = " 3+5 / 2 "
输出：5
\`\`\``,
    functionName: 'calculate',
    starterCode: 'function calculate(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['3+2*2'], expected: 7, inputConvert: null, outputConvert: null },
      { input: [' 3/2 '], expected: 1, inputConvert: null, outputConvert: null },
      { input: [' 3+5 / 2 '], expected: 5, inputConvert: null, outputConvert: null },
      { input: ['1-1+1'], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用栈处理乘除优先级。遍历字符串累积数字，遇到运算符或末尾时根据前一个运算符处理：\`+\`/\`-\` 直接入栈（负数入栈），\`*\`/\`'/'\` 与栈顶运算后入栈。最后栈求和。

\`\`\`js
function calculate(s) {
  const stack = []
  let num = 0
  let sign = '+'
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c >= '0' && c <= '9') {
      num = num * 10 + parseInt(c)
    }
    if ((c < '0' || c > '9') && c !== ' ' || i === s.length - 1) {
      if (sign === '+') stack.push(num)
      else if (sign === '-') stack.push(-num)
      else if (sign === '*') stack.push(stack.pop() * num)
      else if (sign === '/') stack.push(Math.trunc(stack.pop() / num))
      sign = c
      num = 0
    }
  }
  return stack.reduce((a, b) => a + b, 0)
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  // ---- 困难 3 ----
  {
    id: 'algo-102',
    no: '102',
    title: '柱状图中最大的矩形',
    difficulty: '困难',
    tags: ['栈', '单调栈'],
    desc: `给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1。求在该柱状图中，能够勾勒出来的矩形的最大面积。

示例 1：
\`\`\`
输入：heights = [2,1,5,6,2,3]
输出：10
\`\`\`

示例 2：
\`\`\`
输入：heights = [2,4]
输出：4
\`\`\``,
    functionName: 'largestRectangleArea',
    starterCode: 'function largestRectangleArea(heights) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[2, 1, 5, 6, 2, 3]], expected: 10, inputConvert: null, outputConvert: null },
      { input: [[2, 4]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0]], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

单调递增栈存下标。当遇到比栈顶矮的柱子时，弹出栈顶作为高度，计算以该高度为最矮的矩形面积。宽度 = 当前下标 - 新栈顶下标 - 1。末尾补一个高度 0 的虚拟柱子触发收尾。

\`\`\`js
function largestRectangleArea(heights) {
  const stack = []
  let maxArea = 0
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i]
    while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
      const height = heights[stack.pop()]
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1
      maxArea = Math.max(maxArea, height * width)
    }
    stack.push(i)
  }
  return maxArea
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-103',
    no: '103',
    title: '接雨水',
    difficulty: '困难',
    tags: ['栈', '单调栈'],
    desc: `给定 n 个非负整数表示每个柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。要求使用栈解法。

示例 1：
\`\`\`
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
\`\`\`

示例 2：
\`\`\`
输入：height = [4,2,0,3,2,5]
输出：9
\`\`\``,
    functionName: 'trap',
    starterCode: 'function trap(height) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, inputConvert: null, outputConvert: null },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[3, 2, 1]], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

单调递减栈存下标。当前柱高于栈顶时，弹出栈顶作为凹槽底部，新栈顶为左边界，当前为右边界，水量 = (min(左, 右) - 底部) × 宽度。

\`\`\`js
function trap(height) {
  const stack = []
  let water = 0
  for (let i = 0; i < height.length; i++) {
    while (stack.length > 0 && height[stack[stack.length - 1]] < height[i]) {
      const bottom = stack.pop()
      if (stack.length === 0) break
      const left = stack[stack.length - 1]
      const h = Math.min(height[left], height[i]) - height[bottom]
      const w = i - left - 1
      water += h * w
    }
    stack.push(i)
  }
  return water
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-104',
    no: '104',
    title: '滑动窗口最大值',
    difficulty: '困难',
    tags: ['队列', '单调队列'],
    desc: `给你一个整数数组 \`nums\`，有一个大小为 \`k\` 的滑动窗口从数组的最左侧移动到最右侧。你只能看到滑动窗口内的 \`k\` 个数字，窗口每次向右移动一位。返回每个窗口中的最大值。

示例 1：
\`\`\`
输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
\`\`\`

示例 2：
\`\`\`
输入：nums = [1], k = 1
输出：[1]
\`\`\``,
    functionName: 'maxSlidingWindow',
    starterCode: 'function maxSlidingWindow(nums, k) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7], inputConvert: null, outputConvert: null },
      { input: [[1], 1], expected: [1], inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4, 5], 3], expected: [3, 4, 5], inputConvert: null, outputConvert: null },
      { input: [[7, 6, 5, 4, 3, 2, 1], 3], expected: [7, 6, 5, 4, 3], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

双端单调队列存下标，保证队首是当前窗口最大值。新元素入队前从队尾弹出所有比它小的下标；队首下标超出窗口范围则移除。

\`\`\`js
function maxSlidingWindow(nums, k) {
  const result = []
  const deque = []
  for (let i = 0; i < nums.length; i++) {
    while (deque.length > 0 && deque[0] <= i - k) {
      deque.shift()
    }
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop()
    }
    deque.push(i)
    if (i >= k - 1) {
      result.push(nums[deque[0]])
    }
  }
  return result
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)'
  },
  // ====================== 二分查找（11 道，id 105-115） ======================
  // ---- 简单 4 ----
  {
    id: 'algo-105',
    no: '105',
    title: '二分查找',
    difficulty: '简单',
    tags: ['二分查找', '数组'],
    desc: `给定一个升序排列的整数数组 \`nums\` 和一个目标值 \`target\`，写一个函数搜索 \`nums\` 中的 \`target\`，如果目标值存在则返回下标，否则返回 -1。

示例 1：
\`\`\`
输入：nums = [-1,0,3,5,9,12], target = 9
输出：4
\`\`\`

示例 2：
\`\`\`
输入：nums = [-1,0,3,5,9,12], target = 2
输出：-1
\`\`\``,
    functionName: 'search',
    starterCode: 'function search(nums, target) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, inputConvert: null, outputConvert: null },
      { input: [[5], 5], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[5], -5], expected: -1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

标准二分查找。左闭右闭区间 \`[left, right]\`，取中点比较后缩小区间。

\`\`\`js
function search(nums, target) {
  let left = 0, right = nums.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) return mid
    else if (nums[mid] < target) left = mid + 1
    else right = mid - 1
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-106',
    no: '106',
    title: '搜索插入位置',
    difficulty: '简单',
    tags: ['二分查找', '数组'],
    desc: `给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。请必须使用时间复杂度为 O(log n) 的算法。

示例 1：
\`\`\`
输入：nums = [1,3,5,6], target = 5
输出：2
\`\`\`

示例 2：
\`\`\`
输入：nums = [1,3,5,6], target = 2
输出：1
\`\`\`

示例 3：
\`\`\`
输入：nums = [1,3,5,6], target = 7
输出：4
\`\`\``,
    functionName: 'searchInsert',
    starterCode: 'function searchInsert(nums, target) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 3, 5, 6], 5], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[1, 3, 5, 6], 2], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[1, 3, 5, 6], 7], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[1, 3, 5, 6], 0], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

左闭右开区间 \`[left, right)\`，找第一个 ≥ target 的位置。循环结束时 \`left\` 即为插入位置。

\`\`\`js
function searchInsert(nums, target) {
  let left = 0, right = nums.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] < target) left = mid + 1
    else right = mid
  }
  return left
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-107',
    no: '107',
    title: '有效的完全平方数',
    difficulty: '简单',
    tags: ['二分查找', '数学'],
    desc: `给定一个正整数 \`num\`，编写一个函数，如果 \`num\` 是一个完全平方数则返回 true，否则返回 false。

示例 1：
\`\`\`
输入：num = 16
输出：true
解释：4 × 4 = 16
\`\`\`

示例 2：
\`\`\`
输入：num = 14
输出：false
\`\`\``,
    functionName: 'isPerfectSquare',
    starterCode: 'function isPerfectSquare(num) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [16], expected: true, inputConvert: null, outputConvert: null },
      { input: [14], expected: false, inputConvert: null, outputConvert: null },
      { input: [1], expected: true, inputConvert: null, outputConvert: null },
      { input: [4], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分查找 1 到 num 之间的数，判断其平方是否等于 num。

\`\`\`js
function isPerfectSquare(num) {
  let left = 0, right = num
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const sq = mid * mid
    if (sq === num) return true
    else if (sq < num) left = mid + 1
    else right = mid - 1
  }
  return false
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-108',
    no: '108',
    title: '猜数字大小',
    difficulty: '简单',
    tags: ['二分查找'],
    desc: `猜数字游戏的规则如下：从 1 到 n 选择一个数字 \`pick\`。你需要猜我选的是哪个数字。每次你猜错了，我会告诉你猜的数字是大了还是小了。

你调用一个预定义的接口 \`guess(num)\`，它返回：
- -1：我选的数字比你猜的小（即 pick < num）
- 1：我选的数字比你猜的大（即 pick > num）
- 0：猜对了

函数接收 \`n\` 和 \`pick\` 两个参数，返回猜中的数字。

示例 1：
\`\`\`
输入：n = 10, pick = 6
输出：6
\`\`\`

示例 2：
\`\`\`
输入：n = 1, pick = 1
输出：1
\`\`\``,
    functionName: 'guessNumber',
    starterCode: 'function guessNumber(n, pick) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [10, 6], expected: 6, inputConvert: null, outputConvert: null },
      { input: [1, 1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [2, 1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [100, 50], expected: 50, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分查找。根据 \`guess(mid)\` 的返回值缩小区间。

\`\`\`js
function guessNumber(n, pick) {
  const guess = (num) => (num === pick ? 0 : num < pick ? 1 : -1)
  let left = 1, right = n
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const res = guess(mid)
    if (res === 0) return mid
    else if (res === -1) right = mid - 1
    else left = mid + 1
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  // ---- 中等 5 ----
  {
    id: 'algo-109',
    no: '109',
    title: '在排序数组中查找元素的第一个和最后一个位置',
    difficulty: '中等',
    tags: ['二分查找', '数组'],
    desc: `给你一个按照非递减顺序排列的整数数组 \`nums\`，和一个目标值 \`target\`。请你找出给定目标值在数组中的开始位置和结束位置。如果数组中不存在目标值 \`target\`，返回 [-1, -1]。必须设计并实现时间复杂度为 O(log n) 的算法。

示例 1：
\`\`\`
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
\`\`\`

示例 2：
\`\`\`
输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
\`\`\``,
    functionName: 'searchRange',
    starterCode: 'function searchRange(nums, target) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4], inputConvert: null, outputConvert: null },
      { input: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1], inputConvert: null, outputConvert: null },
      { input: [[], 0], expected: [-1, -1], inputConvert: null, outputConvert: null },
      { input: [[1], 1], expected: [0, 0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

两次二分：一次找左边界（命中后继续往左找），一次找右边界（命中后继续往右找）。

\`\`\`js
function searchRange(nums, target) {
  function findFirst() {
    let left = 0, right = nums.length - 1, result = -1
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (nums[mid] === target) { result = mid; right = mid - 1 }
      else if (nums[mid] < target) left = mid + 1
      else right = mid - 1
    }
    return result
  }
  function findLast() {
    let left = 0, right = nums.length - 1, result = -1
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (nums[mid] === target) { result = mid; left = mid + 1 }
      else if (nums[mid] < target) left = mid + 1
      else right = mid - 1
    }
    return result
  }
  return [findFirst(), findLast()]
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-110',
    no: '110',
    title: '搜索旋转排序数组',
    difficulty: '中等',
    tags: ['二分查找', '数组'],
    desc: `整数数组 \`nums\` 按升序排列，数组中的值互不相同。在传递给函数之前，\`nums\` 在预先未知的某个下标 \`k\` 上进行了旋转。例如，[0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2]。给你旋转后的数组 \`nums\` 和一个整数 \`target\`，如果 \`nums\` 中存在 \`target\` 则返回其下标，否则返回 -1。必须设计 O(log n) 的算法。

示例 1：
\`\`\`
输入：nums = [4,5,6,7,0,1,2], target = 0
输出：4
\`\`\`

示例 2：
\`\`\`
输入：nums = [4,5,6,7,0,1,2], target = 3
输出：-1
\`\`\``,
    functionName: 'searchRotated',
    starterCode: 'function searchRotated(nums, target) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, inputConvert: null, outputConvert: null },
      { input: [[1], 0], expected: -1, inputConvert: null, outputConvert: null },
      { input: [[3, 1], 1], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分时判断哪半部分有序：若 \`nums[left] <= nums[mid]\` 则左半有序，判断 target 是否在左半范围内来决定方向；否则右半有序，同理判断。

\`\`\`js
function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) return mid
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1
      else left = mid + 1
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1
      else right = mid - 1
    }
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-111',
    no: '111',
    title: '寻找峰值',
    difficulty: '中等',
    tags: ['二分查找', '数组'],
    desc: `峰值元素是指其值严格大于左右相邻值的元素。给你一个整数数组 \`nums\`，找到峰值元素并返回其索引。数组可能包含多个峰值，返回任何一个所在位置即可。你可以假设 \`nums[-1] = nums[n] = -∞\`。必须实现 O(log n) 的算法。

示例 1：
\`\`\`
输入：nums = [1,2,3,1]
输出：2
\`\`\`

示例 2：
\`\`\`
输入：nums = [1,2,1,3,5,6,4]
输出：5
\`\`\``,
    functionName: 'findPeakElement',
    starterCode: 'function findPeakElement(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3, 1]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 1, 3, 5, 6, 4]], expected: 5, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 2]], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分。若 \`nums[mid] > nums[mid+1]\`，说明峰值在 mid 或其左侧，令 \`right = mid\`；否则峰值在右侧，令 \`left = mid + 1\`。

\`\`\`js
function findPeakElement(nums) {
  let left = 0, right = nums.length - 1
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] > nums[mid + 1]) right = mid
    else left = mid + 1
  }
  return left
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-112',
    no: '112',
    title: 'x 的平方根',
    difficulty: '中等',
    tags: ['二分查找', '数学'],
    desc: `给你一个非负整数 \`x\`，计算并返回 \`x\` 的算术平方根的整数部分。由于返回类型是整数，结果只保留整数部分，小数部分将被舍去。不允许使用内置指数函数和算符。

示例 1：
\`\`\`
输入：x = 4
输出：2
\`\`\`

示例 2：
\`\`\`
输入：x = 8
输出：2
解释：8 的平方根是 2.828...，整数部分为 2
\`\`\``,
    functionName: 'mySqrt',
    starterCode: 'function mySqrt(x) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [4], expected: 2, inputConvert: null, outputConvert: null },
      { input: [8], expected: 2, inputConvert: null, outputConvert: null },
      { input: [0], expected: 0, inputConvert: null, outputConvert: null },
      { input: [1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [15], expected: 3, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分查找。在 1 到 x 范围内找最大的 \`mid\` 使 \`mid * mid <= x\`。

\`\`\`js
function mySqrt(x) {
  if (x <= 1) return x
  let left = 1, right = x
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const sq = mid * mid
    if (sq === x) return mid
    else if (sq < x) left = mid + 1
    else right = mid - 1
  }
  return right
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-113',
    no: '113',
    title: '排列硬币',
    difficulty: '中等',
    tags: ['二分查找', '数学'],
    desc: `你总共有 n 枚硬币，并计划将它们排列成阶梯形状（第 k 行必须正好有 k 枚硬币）。给定整数 n，返回可形成完整阶梯行的总行数。

示例 1：
\`\`\`
输入：n = 5
输出：2
解释：第 1 行放 1 枚，第 2 行放 2 枚，第 3 行需要 3 枚但只剩 2 枚，不完整。
\`\`\`

示例 2：
\`\`\`
输入：n = 8
输出：3
\`\`\``,
    functionName: 'arrangeCoins',
    starterCode: 'function arrangeCoins(n) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [5], expected: 2, inputConvert: null, outputConvert: null },
      { input: [8], expected: 3, inputConvert: null, outputConvert: null },
      { input: [1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [0], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分查找。前 k 行共需 \`k * (k + 1) / 2\` 枚硬币，找最大的 k 使其 ≤ n。

\`\`\`js
function arrangeCoins(n) {
  let left = 0, right = n
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const coins = (mid * (mid + 1)) / 2
    if (coins === n) return mid
    else if (coins < n) left = mid + 1
    else right = mid - 1
  }
  return right
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  // ---- 困难 2 ----
  {
    id: 'algo-114',
    no: '114',
    title: '寻找两个正序数组的中位数',
    difficulty: '困难',
    tags: ['二分查找', '数组'],
    desc: `给定两个大小分别为 m 和 n 的正序（从小到大）数组 \`nums1\` 和 \`nums2\`。请你找出并返回这两个正序数组的中位数。算法的时间复杂度应该为 O(log (m+n))。

示例 1：
\`\`\`
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
\`\`\`

示例 2：
\`\`\`
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并后数组为 [1,2,3,4]，中位数 (2+3)/2 = 2.5
\`\`\``,
    functionName: 'findMedianSortedArrays',
    starterCode: 'function findMedianSortedArrays(nums1, nums2) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 3], [2]], expected: 2.0, inputConvert: null, outputConvert: null },
      { input: [[1, 2], [3, 4]], expected: 2.5, inputConvert: null, outputConvert: null },
      { input: [[], [1]], expected: 1.0, inputConvert: null, outputConvert: null },
      { input: [[2], []], expected: 2.0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

在较短数组上二分切分点 i，另一数组切分点 j = (m+n+1)/2 - i。保证左半最大 ≤ 右半最小。奇数取左半最大，偶数取左右平均。

\`\`\`js
function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1]
  }
  const m = nums1.length, n = nums2.length
  let left = 0, right = m
  while (left <= right) {
    const i = Math.floor((left + right) / 2)
    const j = Math.floor((m + n + 1) / 2) - i
    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1]
    const minRight1 = i === m ? Infinity : nums1[i]
    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1]
    const minRight2 = j === n ? Infinity : nums2[j]
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2)
      else return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2
    } else if (maxLeft1 > minRight2) {
      right = i - 1
    } else {
      left = i + 1
    }
  }
  return 0
}
\`\`\``,
    timeComplexity: 'O(log(min(m,n)))',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-115',
    no: '115',
    title: '寻找旋转排序数组中的最小值 II',
    difficulty: '困难',
    tags: ['二分查找', '数组'],
    desc: `已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次旋转后，得到输入数组。注意数组中可能存在重复元素。请返回数组中的最小元素。

示例 1：
\`\`\`
输入：nums = [1,3,5]
输出：1
\`\`\`

示例 2：
\`\`\`
输入：nums = [2,2,2,0,1]
输出：0
\`\`\``,
    functionName: 'findMin',
    starterCode: 'function findMin(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 3, 5]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[2, 2, 2, 0, 1]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[3, 3, 1, 3]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分。比较 \`nums[mid]\` 与 \`nums[right]\`：大于则最小在右半；小于则最小在左半（含 mid）；相等时无法确定，\`right--\` 缩小范围。

\`\`\`js
function findMin(nums) {
  let left = 0, right = nums.length - 1
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] > nums[right]) left = mid + 1
    else if (nums[mid] < nums[right]) right = mid
    else right--
  }
  return nums[left]
}
\`\`\``,
    timeComplexity: 'O(log n) 平均，最坏 O(n)',
    spaceComplexity: 'O(1)'
  },
  // ====================== 排序算法（9 道，id 116-124） ======================
  // ---- 简单 4 ----
  {
    id: 'algo-116',
    no: '116',
    title: '合并两个有序数组',
    difficulty: '简单',
    tags: ['排序', '双指针', '数组'],
    desc: `给你两个按非递减顺序排列的整数数组 \`nums1\` 和 \`nums2\`，另有两个整数 \`m\` 和 \`n\`，分别表示 \`nums1\` 和 \`nums2\` 中的元素数目。请合并 \`nums2\` 到 \`nums1\` 中，使合并后的数组同样按非递减顺序排列。` + '`nums1`' + ` 的初始长度为 \`m + n\`，其中前 m 个元素表示应合并的元素，后 n 个元素为 0（占位）。返回合并后的数组。

示例 1：
\`\`\`
输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
输出：[1,2,2,3,5,6]
\`\`\`

示例 2：
\`\`\`
输入：nums1 = [1], m = 1, nums2 = [], n = 0
输出：[1]
\`\`\``,
    functionName: 'merge',
    starterCode: 'function merge(nums1, m, nums2, n) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6], inputConvert: null, outputConvert: null },
      { input: [[1], 1, [], 0], expected: [1], inputConvert: null, outputConvert: null },
      { input: [[0], 0, [1], 1], expected: [1], inputConvert: null, outputConvert: null },
      { input: [[2, 0], 1, [1], 1], expected: [1, 2], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

从后往前双指针填充。i 指向 nums1 有效末尾，j 指向 nums2 末尾，k 指向合并末尾，每次取较大的放入 k 位置。

\`\`\`js
function merge(nums1, m, nums2, n) {
  nums1 = [...nums1]
  let i = m - 1, j = n - 1, k = m + n - 1
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) nums1[k--] = nums1[i--]
    else nums1[k--] = nums2[j--]
  }
  while (j >= 0) nums1[k--] = nums2[j--]
  return nums1
}
\`\`\``,
    timeComplexity: 'O(m+n)',
    spaceComplexity: 'O(m+n)'
  },
  {
    id: 'algo-117',
    no: '117',
    title: '数组相对名次',
    difficulty: '简单',
    tags: ['排序', '哈希表'],
    desc: `给你一个长度为 n 的整数数组 \`score\`，其中 \`score[i]\` 是第 i 位运动员在比赛中的得分。所有得分各不相同。运动员将根据得分决定名次：第 1 名获 "Gold Medal"，第 2 名获 "Silver Medal"，第 3 名获 "Bronze Medal"，第 4 名及之后获名次数字字符串。返回答案数组。

示例 1：
\`\`\`
输入：score = [5,4,3,2,1]
输出：["Gold Medal","Silver Medal","Bronze Medal","4","5"]
\`\`\`

示例 2：
\`\`\`
输入：score = [10,3,8,9,4]
输出：["Gold Medal","5","Bronze Medal","Silver Medal","4"]
\`\`\``,
    functionName: 'findRelativeRanks',
    starterCode: 'function findRelativeRanks(score) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[5, 4, 3, 2, 1]], expected: ['Gold Medal', 'Silver Medal', 'Bronze Medal', '4', '5'], inputConvert: null, outputConvert: null },
      { input: [[10, 3, 8, 9, 4]], expected: ['Gold Medal', '5', 'Bronze Medal', 'Silver Medal', '4'], inputConvert: null, outputConvert: null },
      { input: [[1]], expected: ['Gold Medal'], inputConvert: null, outputConvert: null },
      { input: [[3, 2]], expected: ['Gold Medal', 'Silver Medal'], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

将分数降序排序后建「值→名次」映射，再遍历原数组查表。

\`\`\`js
function findRelativeRanks(score) {
  const sorted = [...score].sort((a, b) => b - a)
  const map = {}
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) map[sorted[i]] = 'Gold Medal'
    else if (i === 1) map[sorted[i]] = 'Silver Medal'
    else if (i === 2) map[sorted[i]] = 'Bronze Medal'
    else map[sorted[i]] = String(i + 1)
  }
  return score.map(s => map[s])
}
\`\`\``,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-118',
    no: '118',
    title: '按奇偶排序数组',
    difficulty: '简单',
    tags: ['排序', '数组'],
    desc: `给你一个整数数组 \`nums\`，将 nums 中的所有偶数移动到数组的前面，所有奇数移动到数组后面。返回任意满足此条件的数组。

示例 1：
\`\`\`
输入：nums = [3,1,2,4]
输出：[2,4,3,1]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0]
输出：[0]
\`\`\``,
    functionName: 'sortArrayByParity',
    starterCode: 'function sortArrayByParity(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[3, 1, 2, 4]], expected: [2, 4, 3, 1], inputConvert: null, outputConvert: null },
      { input: [[0]], expected: [0], inputConvert: null, outputConvert: null },
      { input: [[0, 2]], expected: [0, 2], inputConvert: null, outputConvert: null },
      { input: [[1, 3, 5]], expected: [1, 3, 5], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用 filter 分离偶数和奇数，偶数在前拼接即可。

\`\`\`js
function sortArrayByParity(nums) {
  const even = nums.filter(n => n % 2 === 0)
  const odd = nums.filter(n => n % 2 === 1)
  return [...even, ...odd]
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-119',
    no: '119',
    title: '高度检查器',
    difficulty: '简单',
    tags: ['排序', '数组'],
    desc: `学校打算为每位学生拍年度照片。要求学生按非递减身高站成一排，用数组 \`heights\` 表示当前站位顺序。请你返回能让所有学生按非递减身高排好序所需的最少移动次数（即与正确顺序不同的位置数）。

示例 1：
\`\`\`
输入：heights = [1,1,4,2,1,3]
输出：3
\`\`\`

示例 2：
\`\`\`
输入：heights = [5,1,2,3,4]
输出：5
\`\`\``,
    functionName: 'heightChecker',
    starterCode: 'function heightChecker(heights) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 1, 4, 2, 1, 3]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[5, 1, 2, 3, 4]], expected: 5, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4, 5]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

将正确排序后的数组与原数组逐位比较，统计不同的位置数。

\`\`\`js
function heightChecker(heights) {
  const expected = [...heights].sort((a, b) => a - b)
  let count = 0
  for (let i = 0; i < heights.length; i++) {
    if (heights[i] !== expected[i]) count++
  }
  return count
}
\`\`\``,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  // ---- 中等 3 ----
  {
    id: 'algo-120',
    no: '120',
    title: '颜色分类',
    difficulty: '中等',
    tags: ['排序', '双指针'],
    desc: `给定一个包含红色、白色和蓝色（共 n 个元素）的数组 \`nums\`，原地对它们进行排序，使得相同颜色的元素相邻，并按红色、白色、蓝色顺序排列。使用整数 0、1、2 分别表示红色、白色、蓝色。必须使用常数空间的一趟扫描算法。

示例 1：
\`\`\`
输入：nums = [2,0,2,1,1,0]
输出：[0,0,1,1,2,2]
\`\`\`

示例 2：
\`\`\`
输入：nums = [2,0,1]
输出：[0,1,2]
\`\`\``,
    functionName: 'sortColors',
    starterCode: 'function sortColors(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2], inputConvert: null, outputConvert: null },
      { input: [[2, 0, 1]], expected: [0, 1, 2], inputConvert: null, outputConvert: null },
      { input: [[0]], expected: [0], inputConvert: null, outputConvert: null },
      { input: [[1, 0, 2]], expected: [0, 1, 2], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

荷兰国旗问题。三指针：\`low\` 指向 0 的右边界，\`high\` 指向 2 的左边界，\`mid\` 遍历。遇到 0 与 low 交换并都右移；遇到 1 只右移 mid；遇到 2 与 high 交换，high 左移，mid 不动（交换来的元素需重新判断）。

\`\`\`js
function sortColors(nums) {
  nums = [...nums]
  let low = 0, mid = 0, high = nums.length - 1
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]]
      low++
      mid++
    } else if (nums[mid] === 1) {
      mid++
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]]
      high--
    }
  }
  return nums
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-121',
    no: '121',
    title: '前 K 个高频元素',
    difficulty: '中等',
    tags: ['排序', '哈希表', '堆'],
    desc: `给你一个整数数组 \`nums\` 和一个整数 \`k\`，请你返回出现频率前 k 高的元素。可以按任意顺序返回答案。

示例 1：
\`\`\`
输入：nums = [1,1,1,2,2,3], k = 2
输出：[1,2]
\`\`\`

示例 2：
\`\`\`
输入：nums = [1], k = 1
输出：[1]
\`\`\``,
    functionName: 'topKFrequent',
    starterCode: 'function topKFrequent(nums, k) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], inputConvert: null, outputConvert: null },
      { input: [[1], 1], expected: [1], inputConvert: null, outputConvert: null },
      { input: [[1, 2, 2, 3, 3, 3], 1], expected: [3], inputConvert: null, outputConvert: null },
      { input: [[3, 3, 3, 2, 2, 1], 2], expected: [3, 2], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用哈希表统计频率，按频率降序排序，取前 k 个的元素。

\`\`\`js
function topKFrequent(nums, k) {
  const map = {}
  for (const num of nums) {
    map[num] = (map[num] || 0) + 1
  }
  const entries = Object.entries(map).map(([num, freq]) => [Number(num), freq])
  entries.sort((a, b) => b[1] - a[1])
  return entries.slice(0, k).map(e => e[0])
}
\`\`\``,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-122',
    no: '122',
    title: '最接近的三数之和',
    difficulty: '中等',
    tags: ['排序', '双指针'],
    desc: `给你一个长度为 n 的整数数组 \`nums\` 和一个目标值 \`target\`。请你从 \`nums\` 中选出三个整数，使它们的和与 \`target\` 最接近。返回这三个数的和。假定每组输入只存在唯一答案。

示例 1：
\`\`\`
输入：nums = [-1,2,1,-4], target = 1
输出：2
解释：与 target 最接近的和是 2（-1 + 2 + 1 = 2）
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,0,0], target = 1
输出：0
\`\`\``,
    functionName: 'threeSumClosest',
    starterCode: 'function threeSumClosest(nums, target) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[-1, 2, 1, -4], 1], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0], 1], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 1, 1, 0], 100], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3], 1], expected: 6, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

排序后固定第一个数，用左右双指针找两数之和。比较当前三数之和与 target 的差，更新最接近值。根据和与 target 的大小关系移动指针。

\`\`\`js
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b)
  let closest = nums[0] + nums[1] + nums[2]
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1, right = nums.length - 1
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum
      if (sum < target) left++
      else if (sum > target) right--
      else return sum
    }
  }
  return closest
}
\`\`\``,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  // ---- 困难 2 ----
  {
    id: 'algo-123',
    no: '123',
    title: '数组中的第K个最大元素',
    difficulty: '困难',
    tags: ['排序', '快速选择', '分治'],
    desc: `给定整数数组 \`nums\` 和整数 \`k\`，请返回数组中第 \`k\` 个最大的元素。要求使用快速选择（QuickSelect）算法，时间复杂度平均 O(n)。

示例 1：
\`\`\`
输入：nums = [3,2,1,5,6,4], k = 2
输出：5
\`\`\`

示例 2：
\`\`\`
输入：nums = [3,2,3,1,2,4,5,5,6], k = 4
输出：4
\`\`\``,
    functionName: 'findKthLargest',
    starterCode: 'function findKthLargest(nums, k) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5, inputConvert: null, outputConvert: null },
      { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[1], 1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[7, 6, 5, 4, 3, 2, 1], 5], expected: 3, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快速选择。将问题转化为找第 \`n - k\` 小的元素。每次 partition 确定一个元素最终位置，递归只在目标所在的一侧继续。

\`\`\`js
function findKthLargest(nums, k) {
  function partition(left, right) {
    const pivot = nums[right]
    let i = left
    for (let j = left; j < right; j++) {
      if (nums[j] <= pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]]
        i++
      }
    }
    [nums[i], nums[right]] = [nums[right], nums[i]]
    return i
  }
  function quickSelect(left, right, k) {
    if (left === right) return nums[left]
    const pIndex = partition(left, right)
    if (k === pIndex) return nums[k]
    else if (k < pIndex) return quickSelect(left, pIndex - 1, k)
    else return quickSelect(pIndex + 1, right, k)
  }
  return quickSelect(0, nums.length - 1, nums.length - k)
}
\`\`\``,
    timeComplexity: 'O(n) 平均，O(n²) 最坏',
    spaceComplexity: 'O(log n)'
  },
  {
    id: 'algo-124',
    no: '124',
    title: '最大数',
    difficulty: '困难',
    tags: ['排序', '自定义排序'],
    desc: `给定一组非负整数 \`nums\`，重新排列每个数的顺序（不可拆分每个数内部数字），使它们组成一个最大的整数。返回结果是字符串。

示例 1：
\`\`\`
输入：nums = [10,2]
输出："210"
\`\`\`

示例 2：
\`\`\`
输入：nums = [3,30,34,5,9]
输出："9534330"
\`\`\``,
    functionName: 'largestNumber',
    starterCode: 'function largestNumber(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[10, 2]], expected: '210', inputConvert: null, outputConvert: null },
      { input: [[3, 30, 34, 5, 9]], expected: '9534330', inputConvert: null, outputConvert: null },
      { input: [[0, 0]], expected: '0', inputConvert: null, outputConvert: null },
      { input: [[1]], expected: '1', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

自定义排序：比较 \`a + b\` 和 \`b + a\`（字符串拼接），大的排前面。注意处理全 0 的情况返回 "0"。

\`\`\`js
function largestNumber(nums) {
  const strs = nums.map(String)
  strs.sort((a, b) => (b + a) - (a + b))
  const result = strs.join('')
  return result[0] === '0' ? '0' : result
}
\`\`\``,
    timeComplexity: 'O(n log n × k)',
    spaceComplexity: 'O(n)'
  }
]
