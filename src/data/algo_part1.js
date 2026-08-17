// 算法题库片段 1：数组 / 字符串 / 数学与模拟（共 46 题，ID algo-046 到 algo-091）
// 不需要 import，直接 export 一个数组
export const part1Problems = [
  // ====================== 数组·简单（12 道） ======================
  {
    id: 'algo-046',
    no: '46',
    title: '合并两个有序数组',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给你两个有序整数数组 \`nums1\` 和 \`nums2\`，其中 \`nums1\` 的末尾预留了足够空间（长度为 \`m + n\`，前 \`m\` 个为有效元素，后 \`n\` 个为占位 \`0\`），\`nums2\` 长度为 \`n\`。

请把 \`nums2\` 合并到 \`nums1\` 中，使合并后的数组同样按非递减排列。要求原地修改 \`nums1\` 并将其返回。

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
      { input: [[2, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], expected: [1, 2, 2, 3, 5, 6], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

从后往前填。用三个指针 \`i\` 指向 \`nums1\` 有效尾部、\`j\` 指向 \`nums2\` 尾部、\`p\` 指向合并位置尾部。每次取较大者放到 \`p\` 位置，避免覆盖未处理的元素。

\`\`\`js
function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, p = m + n - 1
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[p--] = nums1[i--]
    } else {
      nums1[p--] = nums2[j--]
    }
  }
  return nums1
}
\`\`\``,
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-047',
    no: '47',
    title: '数组去重',
    difficulty: '简单',
    tags: ['数组', '哈希表'],
    desc: `给定一个整数数组 \`nums\`，请去除其中重复的元素，保持每个元素**第一次出现**的相对顺序，返回去重后的新数组。

示例 1：
\`\`\`
输入：nums = [1,1,2]
输出：[1,2]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,0,1,1,1,2,2,3,3,4]
输出：[0,1,2,3,4]
\`\`\``,
    functionName: 'removeDuplicates',
    starterCode: 'function removeDuplicates(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 1, 2]], expected: [1, 2], inputConvert: null, outputConvert: null },
      { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: [0, 1, 2, 3, 4], inputConvert: null, outputConvert: null },
      { input: [[1]], expected: [1], inputConvert: null, outputConvert: null },
      { input: [[]], expected: [], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用 \`Set\` 记录已出现过的值，遍历数组，遇到未出现过的元素就追加到结果数组中，可保证顺序与去重。

\`\`\`js
function removeDuplicates(nums) {
  const seen = new Set()
  const res = []
  for (const x of nums) {
    if (!seen.has(x)) {
      seen.add(x)
      res.push(x)
    }
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-048',
    no: '48',
    title: '移动零',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给定一个数组 \`nums\`，编写一个函数将所有 \`0\` 移动到数组的末尾，同时保持非零元素的相对顺序。要求原地操作并返回修改后的数组。

示例 1：
\`\`\`
输入：nums = [0,1,0,3,12]
输出：[1,3,12,0,0]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0]
输出：[0]
\`\`\``,
    functionName: 'moveZeroes',
    starterCode: 'function moveZeroes(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0], inputConvert: null, outputConvert: null },
      { input: [[0]], expected: [0], inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3]], expected: [1, 2, 3], inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0]], expected: [0, 0, 0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快慢指针：\`j\` 指向下一个非零元素应放的位置。遍历数组，遇到非零元素就与 \`j\` 位置交换并 \`j++\`，零自然被换到后面。

\`\`\`js
function moveZeroes(nums) {
  let j = 0
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      ;[nums[j], nums[i]] = [nums[i], nums[j]]
      j++
    }
  }
  return nums
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-049',
    no: '49',
    title: '最大连续 1 的个数',
    difficulty: '简单',
    tags: ['数组'],
    desc: `给定一个二进制数组 \`nums\`（只含 \`0\` 和 \`1\`），返回其中连续 \`1\` 的最长长度。

示例 1：
\`\`\`
输入：nums = [1,1,0,1,1,1]
输出：3
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,0,0]
输出：0
\`\`\``,
    functionName: 'findMaxConsecutiveOnes',
    starterCode: 'function findMaxConsecutiveOnes(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 1, 0, 1, 1, 1]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[1, 0, 1, 1, 0, 1]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 1, 1, 1]], expected: 4, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

一次遍历，维护当前连续 1 的长度 \`cur\` 与历史最大 \`max\`。遇到 1 则 \`cur++\` 并更新 \`max\`，遇到 0 则 \`cur\` 归零。

\`\`\`js
function findMaxConsecutiveOnes(nums) {
  let max = 0, cur = 0
  for (const x of nums) {
    if (x === 1) {
      cur++
      max = Math.max(max, cur)
    } else {
      cur = 0
    }
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-050',
    no: '50',
    title: '删除排序数组中的重复项',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给定一个**已按非递减排序**的数组 \`nums\`，请原地删除重复元素，使每个元素只出现一次，返回删除后数组的新长度 \`k\`（不需要考虑 \`k\` 之后的元素）。

示例 1：
\`\`\`
输入：nums = [1,1,2]
输出：2
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,0,1,1,1,2,2,3,3,4]
输出：5
\`\`\``,
    functionName: 'removeDuplicatesInPlace',
    starterCode: 'function removeDuplicatesInPlace(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 1, 2]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3]], expected: 3, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快慢指针：\`j\` 指向「下一个可写入位置」。从第二个元素开始，只要当前元素不等于前一个元素（说明是新值），就写入 \`j\` 位置并 \`j++\`。

\`\`\`js
function removeDuplicatesInPlace(nums) {
  if (nums.length === 0) return 0
  let j = 1
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[j++] = nums[i]
    }
  }
  return j
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-051',
    no: '51',
    title: '买卖股票的最佳时机 II',
    difficulty: '简单',
    tags: ['数组', '贪心'],
    desc: `给定一个数组 \`prices\` 表示某支股票每天的价格。你可以**多次**买卖该股票（同一天不能既买又卖），求能获得的最大利润。

示例 1：
\`\`\`
输入：prices = [7,1,5,3,6,4]
输出：7
解释：第 2 天买入第 3 天卖出赚 4，第 4 天买入第 5 天卖出赚 3，共 7。
\`\`\`

示例 2：
\`\`\`
输入：prices = [1,2,3,4,5]
输出：4
\`\`\``,
    functionName: 'maxProfit',
    starterCode: 'function maxProfit(prices) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 7, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4, 5]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[7, 6, 4, 3, 1]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

贪心：只要今天比昨天高，就把这段差价累加。等价于把所有上升段的利润都吃掉。

\`\`\`js
function maxProfit(prices) {
  let profit = 0
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1]
    }
  }
  return profit
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-052',
    no: '52',
    title: '加一',
    difficulty: '简单',
    tags: ['数组', '数学'],
    desc: `给定一个由整数组成的非空数组 \`digits\` 表示一个非负整数（最高位在最前面）。给这个整数加上一并返回结果数组。

示例 1：
\`\`\`
输入：digits = [1,2,3]
输出：[1,2,4]
\`\`\`

示例 2：
\`\`\`
输入：digits = [9,9,9]
输出：[1,0,0,0]
\`\`\``,
    functionName: 'plusOne',
    starterCode: 'function plusOne(digits) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3]], expected: [1, 2, 4], inputConvert: null, outputConvert: null },
      { input: [[4, 3, 2, 1]], expected: [4, 3, 2, 2], inputConvert: null, outputConvert: null },
      { input: [[9, 9, 9]], expected: [1, 0, 0, 0], inputConvert: null, outputConvert: null },
      { input: [[0]], expected: [1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

从最低位开始向高位进位。若当前位小于 9，直接加 1 返回；若为 9，则置 0 继续进位。若所有位都进位（全 9），则在最前面补 1。

\`\`\`js
function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++
      return digits
    }
    digits[i] = 0
  }
  return [1, ...digits]
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)（最坏进位）'
  },
  {
    id: 'algo-053',
    no: '53',
    title: '旋转数组',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给定一个数组 \`nums\` 和整数 \`k\`，将数组向右旋转 \`k\` 步（非原地也行，但要求返回旋转后的数组）。

示例 1：
\`\`\`
输入：nums = [1,2,3,4,5,6,7], k = 3
输出：[5,6,7,1,2,3,4]
\`\`\`

示例 2：
\`\`\`
输入：nums = [-1,-100,3,99], k = 2
输出：[3,99,-1,-100]
\`\`\``,
    functionName: 'rotate',
    starterCode: 'function rotate(nums, k) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4], inputConvert: null, outputConvert: null },
      { input: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100], inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3], 0], expected: [1, 2, 3], inputConvert: null, outputConvert: null },
      { input: [[1, 2], 3], expected: [2, 1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先 \`k = k % n\`。整体反转 → 反转前 \`k\` 个 → 反转剩余部分，即可得到右旋结果。

\`\`\`js
function rotate(nums, k) {
  const n = nums.length
  k = k % n
  const reverse = (a, s, e) => {
    while (s < e) { [a[s], a[e]] = [a[e], a[s]]; s++; e-- }
  }
  reverse(nums, 0, n - 1)
  reverse(nums, 0, k - 1)
  reverse(nums, k, n - 1)
  return nums
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-054',
    no: '54',
    title: '提莫攻击',
    difficulty: '简单',
    tags: ['数组', '模拟'],
    desc: `在游戏里，提莫每隔一段时间发起攻击使目标中毒 \`duration\` 秒。给定一个严格递增的时间序列 \`timeSeries\` 表示攻击时间点，以及中毒持续时长 \`duration\`，返回目标总共中毒的时长（攻击会刷新中毒时间）。

示例 1：
\`\`\`
输入：timeSeries = [1,4], duration = 2
输出：4
\`\`\`

示例 2：
\`\`\`
输入：timeSeries = [1,2], duration = 2
输出：3
\`\`\``,
    functionName: 'findPoisonedDuration',
    starterCode: 'function findPoisonedDuration(timeSeries, duration) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 4], 2], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[1, 2], 2], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[], 3], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4, 5], 5], expected: 9, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

相邻两次攻击之间，实际中毒时长为 \`min(duration, next - cur)\`。最后一段攻击一定满 \`duration\`。累加即可。

\`\`\`js
function findPoisonedDuration(timeSeries, duration) {
  if (timeSeries.length === 0) return 0
  let total = 0
  for (let i = 0; i < timeSeries.length - 1; i++) {
    total += Math.min(duration, timeSeries[i + 1] - timeSeries[i])
  }
  return total + duration
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-055',
    no: '55',
    title: '数组中重复的数字',
    difficulty: '简单',
    tags: ['数组', '哈希表'],
    desc: `给定一个长度为 \`n + 1\` 的数组 \`nums\`，元素取值范围 \`0..n\`。数组中至少有一个重复数字，请返回**任意一个**重复的数字。

示例 1：
\`\`\`
输入：nums = [2,3,1,0,2,5,3]
输出：2
\`\`\`

示例 2：
\`\`\`
输入：nums = [1,1]
输出：1
\`\`\``,
    functionName: 'findRepeatNumber',
    starterCode: 'function findRepeatNumber(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[2, 3, 1, 0, 2, 5, 3]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[1, 1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[3, 4, 2, 0, 1, 4]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4, 5, 2]], expected: 2, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用 \`Set\` 顺序遍历：若元素已在集合中出现，即为重复值，直接返回。

\`\`\`js
function findRepeatNumber(nums) {
  const set = new Set()
  for (const x of nums) {
    if (set.has(x)) return x
    set.add(x)
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-056',
    no: '56',
    title: '两数之和 II - 输入有序数组',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给定一个已按**非递减**排序的整数数组 \`numbers\` 和目标值 \`target\`，找出和等于 \`target\` 的两个元素，返回它们的**1 开始**下标 \`[index1, index2]\`（保证恰好有一个答案）。

示例 1：
\`\`\`
输入：numbers = [2,7,11,15], target = 9
输出：[1,2]
\`\`\`

示例 2：
\`\`\`
输入：numbers = [2,3,4], target = 6
输出：[1,3]
\`\`\``,
    functionName: 'twoSum',
    starterCode: 'function twoSum(numbers, target) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [1, 2], inputConvert: null, outputConvert: null },
      { input: [[2, 3, 4], 6], expected: [1, 3], inputConvert: null, outputConvert: null },
      { input: [[-1, 0], -1], expected: [1, 2], inputConvert: null, outputConvert: null },
      { input: [[5, 25, 75], 100], expected: [2, 3], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

左右双指针：若两数之和小于目标，左指针右移；大于目标，右指针左移；相等则返回下标（加 1）。

\`\`\`js
function twoSum(numbers, target) {
  let l = 0, r = numbers.length - 1
  while (l < r) {
    const s = numbers[l] + numbers[r]
    if (s === target) return [l + 1, r + 1]
    if (s < target) l++
    else r--
  }
  return [-1, -1]
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-057',
    no: '57',
    title: '有序数组的平方',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给定一个按**非递减**排序的整数数组 \`nums\`（可能含负数），返回每个元素平方后按非递减排序的新数组。

示例 1：
\`\`\`
输入：nums = [-4,-1,0,3,10]
输出：[0,1,9,16,100]
\`\`\`

示例 2：
\`\`\`
输入：nums = [-7,-3,2,3,11]
输出：[4,9,9,49,121]
\`\`\``,
    functionName: 'sortedSquares',
    starterCode: 'function sortedSquares(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[-4, -1, 0, 3, 10]], expected: [0, 1, 9, 16, 100], inputConvert: null, outputConvert: null },
      { input: [[-7, -3, 2, 3, 11]], expected: [4, 9, 9, 49, 121], inputConvert: null, outputConvert: null },
      { input: [[0]], expected: [0], inputConvert: null, outputConvert: null },
      { input: [[-5, -3]], expected: [9, 25], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

平方后的最大值一定出现在两端（负数的平方也可能很大）。从两端取绝对值较大者放入结果数组末尾，逆序填充。

\`\`\`js
function sortedSquares(nums) {
  const n = nums.length
  const res = new Array(n)
  let l = 0, r = n - 1, p = n - 1
  while (l <= r) {
    if (Math.abs(nums[l]) > Math.abs(nums[r])) {
      res[p--] = nums[l] * nums[l++]
    } else {
      res[p--] = nums[r] * nums[r--]
    }
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  // ====================== 数组·中等（6 道） ======================
  {
    id: 'algo-058',
    no: '58',
    title: '三数之和',
    difficulty: '中等',
    tags: ['数组', '双指针'],
    desc: `给定整数数组 \`nums\`，返回所有和为 \`0\` 且**不重复**的三元组 \`[a,b,c]\`。

示例 1：
\`\`\`
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,0,0]
输出：[[0,0,0]]
\`\`\``,
    functionName: 'threeSum',
    starterCode: 'function threeSum(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0]], expected: [[0, 0, 0]], inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0, 0]], expected: [[0, 0, 0]], inputConvert: null, outputConvert: null },
      { input: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

排序后固定一个数 \`nums[i]\`，再用左右双指针在右侧找两数之和为 \`-nums[i]\`。通过跳过相同值来去重，且 \`nums[i] > 0\` 时可直接提前结束。

\`\`\`js
function threeSum(nums) {
  nums.sort((a, b) => a - b)
  const res = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue
    if (nums[i] > 0) break
    let l = i + 1, r = nums.length - 1
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r]
      if (s === 0) {
        res.push([nums[i], nums[l], nums[r]])
        while (l < r && nums[l] === nums[l + 1]) l++
        while (l < r && nums[r] === nums[r - 1]) r--
        l++; r--
      } else if (s < 0) l++
      else r--
    }
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(log n)（排序栈）'
  },
  {
    id: 'algo-059',
    no: '59',
    title: '盛最多水的容器',
    difficulty: '中等',
    tags: ['数组', '双指针'],
    desc: `给定一个长度为 \`n\` 的整数数组 \`height\`，其中 \`height[i]\` 表示第 \`i\` 条垂线的高度。选择两条垂线与 x 轴构成容器，求能容纳的最大水量。

示例 1：
\`\`\`
输入：height = [1,8,6,2,5,4,8,3,7]
输出：49
\`\`\`

示例 2：
\`\`\`
输入：height = [1,1]
输出：1
\`\`\``,
    functionName: 'maxArea',
    starterCode: 'function maxArea(height) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, inputConvert: null, outputConvert: null },
      { input: [[1, 1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[4, 3, 2, 1, 4]], expected: 16, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 1]], expected: 2, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

左右双指针。面积 = \`min(h[l], h[r]) * (r - l)\`。每次移动较矮的一边，逐步逼近可能更大的面积。

\`\`\`js
function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0
  while (l < r) {
    const h = Math.min(height[l], height[r])
    best = Math.max(best, h * (r - l))
    if (height[l] < height[r]) l++
    else r--
  }
  return best
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-060',
    no: '60',
    title: '跳跃游戏',
    difficulty: '中等',
    tags: ['数组', '贪心'],
    desc: `给定非负整数数组 \`nums\`，\`nums[i]\` 表示从位置 \`i\` 最多能跳的步数。判断是否能够跳到最后一个下标。

示例 1：
\`\`\`
输入：nums = [2,3,1,1,4]
输出：true
\`\`\`

示例 2：
\`\`\`
输入：nums = [3,2,1,0,4]
输出：false
\`\`\``,
    functionName: 'canJump',
    starterCode: 'function canJump(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[2, 3, 1, 1, 4]], expected: true, inputConvert: null, outputConvert: null },
      { input: [[3, 2, 1, 0, 4]], expected: false, inputConvert: null, outputConvert: null },
      { input: [[0]], expected: true, inputConvert: null, outputConvert: null },
      { input: [[2, 0, 0]], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

贪心维护当前能到达的最远位置 \`maxReach\`。遍历时若 \`i > maxReach\` 则失败；否则更新 \`maxReach\`，若能覆盖末尾则成功。

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
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-061',
    no: '61',
    title: '区间合并',
    difficulty: '中等',
    tags: ['数组', '排序'],
    desc: `给定若干区间的集合 \`intervals\`，其中每个区间为 \`[start, end]\`。合并所有重叠的区间，返回不重叠的区间数组。

示例 1：
\`\`\`
输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
\`\`\`

示例 2：
\`\`\`
输入：intervals = [[1,4],[4,5]]
输出：[[1,5]]
\`\`\``,
    functionName: 'mergeIntervals',
    starterCode: 'function mergeIntervals(intervals) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], inputConvert: null, outputConvert: null },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]], inputConvert: null, outputConvert: null },
      { input: [[[1, 4], [0, 4]]], expected: [[0, 4]], inputConvert: null, outputConvert: null },
      { input: [[]], expected: [], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先按区间起点排序。遍历时若当前区间起点 \`<=\` 结果最后一个区间的终点，则合并（取较大终点）；否则作为新区间加入。

\`\`\`js
function mergeIntervals(intervals) {
  if (intervals.length === 0) return []
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
\`\`\``,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-062',
    no: '62',
    title: '颜色分类',
    difficulty: '中等',
    tags: ['数组', '双指针'],
    desc: `给定一个只含 \`0\`、\`1\`、\`2\` 的数组 \`nums\`，要求原地排序使相同颜色相邻（红白蓝荷兰国旗问题），并返回排序后的数组。

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
      { input: [[1, 1, 1]], expected: [1, 1, 1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

三指针荷兰国旗：\`l\` 指向 0 的右边界、\`r\` 指向 2 的左边界、\`i\` 遍历。遇 0 与 \`l\` 交换并双双右移；遇 2 与 \`r\` 交换且 \`r\` 左移（\`i\` 不动，因为换过来的元素还需判断）；遇 1 则仅 \`i++\`。

\`\`\`js
function sortColors(nums) {
  let l = 0, r = nums.length - 1, i = 0
  while (i <= r) {
    if (nums[i] === 0) {
      [nums[l], nums[i]] = [nums[i], nums[l]]
      l++; i++
    } else if (nums[i] === 2) {
      [nums[r], nums[i]] = [nums[i], nums[r]]
      r--
    } else {
      i++
    }
  }
  return nums
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-063',
    no: '63',
    title: '寻找峰值',
    difficulty: '中等',
    tags: ['数组', '二分查找'],
    desc: `给定数组 \`nums\`（相邻元素互不相等），返回**任意一个**峰值的下标。峰值指严格大于相邻邻居的元素，首尾越界处视为 \`-∞\`。要求时间复杂度 \`O(log n)\`。

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

二分：若 \`nums[mid] > nums[mid+1]\`，说明峰值在左半（含 mid），向左收；否则峰值在右半（含 mid+1），向右收。最终 \`l\` 即为峰值下标。

\`\`\`js
function findPeakElement(nums) {
  let l = 0, r = nums.length - 1
  while (l < r) {
    const mid = (l + r) >> 1
    if (nums[mid] > nums[mid + 1]) r = mid
    else l = mid + 1
  }
  return l
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  // ====================== 数组·困难（2 道） ======================
  {
    id: 'algo-064',
    no: '64',
    title: '接雨水',
    difficulty: '困难',
    tags: ['数组', '双指针'],
    desc: `给定非负整数数组 \`height\` 表示柱子高度，计算按此排列的柱子能接多少雨水。

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
      { input: [[]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

双指针维护两侧最高 \`lmax\` / \`rmax\`。哪边较矮就处理哪边：若当前柱低于该侧最高，则可接二者之差；否则更新该侧最高，并向中间逼近。

\`\`\`js
function trap(height) {
  let l = 0, r = height.length - 1
  let lmax = 0, rmax = 0, water = 0
  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= lmax) lmax = height[l]
      else water += lmax - height[l]
      l++
    } else {
      if (height[r] >= rmax) rmax = height[r]
      else water += rmax - height[r]
      r--
    }
  }
  return water
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-065',
    no: '65',
    title: '滑动窗口最大值',
    difficulty: '困难',
    tags: ['数组', '单调队列'],
    desc: `给定数组 \`nums\` 和窗口大小 \`k\`，窗口从左端滑动到右端，返回每个窗口内的最大值数组。

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
      { input: [[7, 6, 5, 4, 3, 2, 1], 2], expected: [7, 6, 5, 4, 3, 2], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

单调递减双端队列存下标。每次入队前先把队尾比当前小的弹出，保证队首为窗口最大；队首下标超出窗口则弹出。当 \`i >= k-1\` 时把队首值入结果。

\`\`\`js
function maxSlidingWindow(nums, k) {
  const res = []
  const dq = []
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && dq[0] <= i - k) dq.shift()
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop()
    dq.push(i)
    if (i >= k - 1) res.push(nums[dq[0]])
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)'
  },
  // ====================== 字符串·简单（7 道） ======================
  {
    id: 'algo-066',
    no: '66',
    title: '有效的字母异位词',
    difficulty: '简单',
    tags: ['字符串', '哈希表'],
    desc: `给定两个字符串 \`s\` 和 \`t\`（只含小写字母），判断 \`t\` 是否是 \`s\` 的字母异位词（字符重排）。

示例 1：
\`\`\`
输入：s = "anagram", t = "nagaram"
输出：true
\`\`\`

示例 2：
\`\`\`
输入：s = "rat", t = "car"
输出：false
\`\`\``,
    functionName: 'isAnagram',
    starterCode: 'function isAnagram(s, t) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['rat', 'car'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['a', 'a'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['ab', 'a'], expected: false, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

长度不同直接 false。用长度 26 的计数数组，遍历 \`s\` 自增、遍历 \`t\` 自减，最后看是否全为 0。

\`\`\`js
function isAnagram(s, t) {
  if (s.length !== t.length) return false
  const cnt = new Array(26).fill(0)
  for (let i = 0; i < s.length; i++) {
    cnt[s.charCodeAt(i) - 97]++
    cnt[t.charCodeAt(i) - 97]--
  }
  return cnt.every(v => v === 0)
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-067',
    no: '67',
    title: '反转字符串',
    difficulty: '简单',
    tags: ['字符串', '双指针'],
    desc: `给定一个字符数组 \`s\`，原地反转它并返回。不要使用额外空间分配另一数组。

示例 1：
\`\`\`
输入：s = ["h","e","l","l","o"]
输出：["o","l","l","e","h"]
\`\`\`

示例 2：
\`\`\`
输入：s = ["H","a","n","n","a","h"]
输出：["h","a","n","n","a","H"]
\`\`\``,
    functionName: 'reverseString',
    starterCode: 'function reverseString(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'], inputConvert: null, outputConvert: null },
      { input: [['H', 'a', 'n', 'n', 'a', 'h']], expected: ['h', 'a', 'n', 'n', 'a', 'H'], inputConvert: null, outputConvert: null },
      { input: [['a']], expected: ['a'], inputConvert: null, outputConvert: null },
      { input: [[]], expected: [], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

双指针左右交换并向中间靠拢即可。

\`\`\`js
function reverseString(s) {
  let l = 0, r = s.length - 1
  while (l < r) {
    [s[l], s[r]] = [s[r], s[l]]
    l++; r--
  }
  return s
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-068',
    no: '68',
    title: '字符串中的第一个唯一字符',
    difficulty: '简单',
    tags: ['字符串', '哈希表'],
    desc: `给定字符串 \`s\`（只含小写字母），返回第一个不重复字符的下标；若不存在返回 \`-1\`。

示例 1：
\`\`\`
输入：s = "leetcode"
输出：0
\`\`\`

示例 2：
\`\`\`
输入：s = "loveleetcode"
输出：2
\`\`\``,
    functionName: 'firstUniqChar',
    starterCode: 'function firstUniqChar(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['leetcode'], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['loveleetcode'], expected: 2, inputConvert: null, outputConvert: null },
      { input: ['aabb'], expected: -1, inputConvert: null, outputConvert: null },
      { input: ['abcabc'], expected: -1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先统计各字符频次，再遍历找到第一个频次为 1 的位置。

\`\`\`js
function firstUniqChar(s) {
  const cnt = new Array(26).fill(0)
  for (const c of s) cnt[c.charCodeAt(0) - 97]++
  for (let i = 0; i < s.length; i++) {
    if (cnt[s.charCodeAt(i) - 97] === 1) return i
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-069',
    no: '69',
    title: '实现 strStr',
    difficulty: '简单',
    tags: ['字符串', '双指针'],
    desc: `给你两个字符串 \`haystack\` 和 \`needle\`，返回 \`needle\` 在 \`haystack\` 中第一次出现的下标；不存在返回 \`-1\`；\`needle\` 为空串返回 \`0\`。

示例 1：
\`\`\`
输入：haystack = "hello", needle = "ll"
输出：2
\`\`\`

示例 2：
\`\`\`
输入：haystack = "aaaaa", needle = "bba"
输出：-1
\`\`\``,
    functionName: 'strStr',
    starterCode: 'function strStr(haystack, needle) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['hello', 'll'], expected: 2, inputConvert: null, outputConvert: null },
      { input: ['aaaaa', 'bba'], expected: -1, inputConvert: null, outputConvert: null },
      { input: ['', ''], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['abc', 'c'], expected: 2, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

朴素匹配：外层枚举起点 \`i\`，内层逐字符比较 \`needle\`，全部匹配则返回 \`i\`。

\`\`\`js
function strStr(haystack, needle) {
  if (needle.length === 0) return 0
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let j = 0
    for (; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) break
    }
    if (j === needle.length) return i
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(n·m)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-070',
    no: '70',
    title: '最长公共前缀',
    difficulty: '简单',
    tags: ['字符串'],
    desc: `给定字符串数组 \`strs\`，返回其中所有字符串的最长公共前缀；不存在则返回空串。

示例 1：
\`\`\`
输入：strs = ["flower","flow","flight"]
输出："fl"
\`\`\`

示例 2：
\`\`\`
输入：strs = ["dog","racecar","car"]
输出：""
\`\`\``,
    functionName: 'longestCommonPrefix',
    starterCode: 'function longestCommonPrefix(strs) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [['flower', 'flow', 'flight']], expected: 'fl', inputConvert: null, outputConvert: null },
      { input: [['dog', 'racecar', 'car']], expected: '', inputConvert: null, outputConvert: null },
      { input: [['a']], expected: 'a', inputConvert: null, outputConvert: null },
      { input: [['ab', 'a']], expected: 'a', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

以第一个串为前缀，依次与后续每个串比较：若前缀不是其前缀，就不断砍掉末位，直到匹配或为空。

\`\`\`js
function longestCommonPrefix(strs) {
  if (strs.length === 0) return ''
  let prefix = strs[0]
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1)
      if (prefix === '') return ''
    }
  }
  return prefix
}
\`\`\``,
    timeComplexity: 'O(S)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-071',
    no: '71',
    title: '验证回文串',
    difficulty: '简单',
    tags: ['字符串', '双指针'],
    desc: `给定字符串 \`s\`，只考虑其中的字母和数字字符，忽略大小写，判断是否为回文。

示例 1：
\`\`\`
输入：s = "A man, a plan, a canal: Panama"
输出：true
\`\`\`

示例 2：
\`\`\`
输入：s = "race a car"
输出：false
\`\`\``,
    functionName: 'isPalindrome',
    starterCode: 'function isPalindrome(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['race a car'], expected: false, inputConvert: null, outputConvert: null },
      { input: [' '], expected: true, inputConvert: null, outputConvert: null },
      { input: ['0P'], expected: false, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先转小写并剔除非字母数字，再用双指针从两端向中间比较。

\`\`\`js
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  let l = 0, r = s.length - 1
  while (l < r) {
    if (s[l] !== s[r]) return false
    l++; r--
  }
  return true
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-072',
    no: '72',
    title: '反转字符串 II',
    difficulty: '简单',
    tags: ['字符串'],
    desc: `给定字符串 \`s\` 和整数 \`k\`，每 \`2k\` 个字符为一组：反转前 \`k\` 个，保留后 \`k\` 个；若剩余不足 \`k\` 则全部反转，若在 \`k\` 到 \`2k\` 之间则反转前 \`k\` 个。返回结果字符串。

示例 1：
\`\`\`
输入：s = "abcdefg", k = 2
输出："bacdfeg"
\`\`\`

示例 2：
\`\`\`
输入：s = "abcd", k = 2
输出："bacd"
\`\`\``,
    functionName: 'reverseStr',
    starterCode: 'function reverseStr(s, k) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['abcdefg', 2], expected: 'bacdfeg', inputConvert: null, outputConvert: null },
      { input: ['abcd', 2], expected: 'bacd', inputConvert: null, outputConvert: null },
      { input: ['a', 2], expected: 'a', inputConvert: null, outputConvert: null },
      { input: ['abcdef', 3], expected: 'cbadef', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

每步前进 \`2k\`，对 \`[i, min(i+k-1, n-1)]\` 区间做反转即可统一所有情况。

\`\`\`js
function reverseStr(s, k) {
  const arr = s.split('')
  for (let i = 0; i < arr.length; i += 2 * k) {
    let l = i, r = Math.min(i + k - 1, arr.length - 1)
    while (l < r) {
      [arr[l], arr[r]] = [arr[r], arr[l]]
      l++; r--
    }
  }
  return arr.join('')
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  // ====================== 字符串·中等（6 道） ======================
  {
    id: 'algo-073',
    no: '73',
    title: '字符串转换整数 (atoi)',
    difficulty: '中等',
    tags: ['字符串', '数学'],
    desc: `实现一个 \`myAtoi(s)\`：丢弃前导空格；可选识别一个 \`+\` / \`-\` 号；读取数字直至非数字或末尾；若超出 32 位有符号整型范围则截断到 \`[-2³¹, 2³¹-1]\`；无有效数字返回 \`0\`。

示例 1：
\`\`\`
输入：s = "   -42"
输出：-42
\`\`\`

示例 2：
\`\`\`
输入：s = "4193 with words"
输出：4193
\`\`\``,
    functionName: 'myAtoi',
    starterCode: 'function myAtoi(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['42'], expected: 42, inputConvert: null, outputConvert: null },
      { input: ['   -42'], expected: -42, inputConvert: null, outputConvert: null },
      { input: ['4193 with words'], expected: 4193, inputConvert: null, outputConvert: null },
      { input: ['-91283472332'], expected: -2147483648, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先 \`trim\` 去空格，识别符号位，然后逐字符读取数字。累加前判断是否会越界，越界则直接返回对应边界。

\`\`\`js
function myAtoi(s) {
  s = s.trim()
  if (s.length === 0) return 0
  let sign = 1, i = 0
  if (s[0] === '-' || s[0] === '+') {
    sign = s[0] === '-' ? -1 : 1
    i = 1
  }
  let num = 0
  const INT_MAX = 2147483647, INT_MIN = -2147483648
  for (; i < s.length; i++) {
    const code = s.charCodeAt(i)
    if (code < 48 || code > 57) break
    const d = code - 48
    if (num > (INT_MAX - d) / 10) {
      return sign === 1 ? INT_MAX : INT_MIN
    }
    num = num * 10 + d
  }
  return sign * num
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-074',
    no: '74',
    title: '字符串相乘',
    difficulty: '中等',
    tags: ['字符串', '数学'],
    desc: `给定两个非负整数的字符串 \`num1\` 和 \`num2\`，返回它们乘积的字符串（不能直接用大数 API 转换）。

示例 1：
\`\`\`
输入：num1 = "2", num2 = "3"
输出："6"
\`\`\`

示例 2：
\`\`\`
输入：num1 = "123", num2 = "456"
输出："56088"
\`\`\``,
    functionName: 'multiply',
    starterCode: 'function multiply(num1, num2) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['2', '3'], expected: '6', inputConvert: null, outputConvert: null },
      { input: ['123', '456'], expected: '56088', inputConvert: null, outputConvert: null },
      { input: ['0', '0'], expected: '0', inputConvert: null, outputConvert: null },
      { input: ['999', '999'], expected: '998001', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

模拟竖式：结果数组长度为 \`m+n\`。两两相乘后把进位累加到 \`res[i+j+1]\`，再统一处理进位并去掉前导零。

\`\`\`js
function multiply(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0'
  const m = num1.length, n = num2.length
  const res = new Array(m + n).fill(0)
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48)
      const sum = mul + res[i + j + 1]
      res[i + j + 1] = sum % 10
      res[i + j] += Math.floor(sum / 10)
    }
  }
  let k = 0
  while (k < res.length && res[k] === 0) k++
  return res.slice(k).join('')
}
\`\`\``,
    timeComplexity: 'O(m·n)',
    spaceComplexity: 'O(m+n)'
  },
  {
    id: 'algo-075',
    no: '75',
    title: '最长回文子串',
    difficulty: '中等',
    tags: ['字符串', '双指针'],
    desc: `给定字符串 \`s\`，返回其中最长的回文子串。

示例 1：
\`\`\`
输入：s = "babad"
输出："bab"
\`\`\`

示例 2：
\`\`\`
输入：s = "cbbd"
输出："bb"
\`\`\``,
    functionName: 'longestPalindrome',
    starterCode: 'function longestPalindrome(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['babad'], expected: 'bab', inputConvert: null, outputConvert: null },
      { input: ['cbbd'], expected: 'bb', inputConvert: null, outputConvert: null },
      { input: ['a'], expected: 'a', inputConvert: null, outputConvert: null },
      { input: ['ac'], expected: 'a', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

中心扩展：对每个位置分别尝试奇数长度和偶数长度两种中心，向两侧扩展得到回文长度，记录最长起止。

\`\`\`js
function longestPalindrome(s) {
  if (s.length < 2) return s
  let start = 0, maxLen = 1
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++ }
    return r - l - 1
  }
  for (let i = 0; i < s.length; i++) {
    const len = Math.max(expand(i, i), expand(i, i + 1))
    if (len > maxLen) {
      maxLen = len
      start = i - Math.floor((len - 1) / 2)
    }
  }
  return s.slice(start, start + maxLen)
}
\`\`\``,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-076',
    no: '76',
    title: 'Z 字形变换',
    difficulty: '中等',
    tags: ['字符串'],
    desc: `给定字符串 \`s\` 和行数 \`numRows\`，按从上到下、再从下到上的 Z 字形排列后，按行依次读取，得到新字符串。

示例 1：
\`\`\`
输入：s = "PAYPALISHIRING", numRows = 3
输出："PAHNAPLSIIGYIR"
\`\`\`

示例 2：
\`\`\`
输入：s = "PAYPALISHIRING", numRows = 4
输出："PINALSIGYAHRPI"
\`\`\``,
    functionName: 'convert',
    starterCode: 'function convert(s, numRows) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['PAYPALISHIRING', 3], expected: 'PAHNAPLSIIGYIR', inputConvert: null, outputConvert: null },
      { input: ['PAYPALISHIRING', 4], expected: 'PINALSIGYAHRPI', inputConvert: null, outputConvert: null },
      { input: ['A', 1], expected: 'A', inputConvert: null, outputConvert: null },
      { input: ['AB', 1], expected: 'AB', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用 \`numRows\` 个字符串桶模拟，方向变量在到顶 / 到底时翻转。最后拼接所有行。

\`\`\`js
function convert(s, numRows) {
  if (numRows < 2) return s
  const rows = new Array(numRows).fill('')
  let i = 0, dir = -1
  for (const c of s) {
    rows[i] += c
    if (i === 0 || i === numRows - 1) dir = -dir
    i += dir
  }
  return rows.join('')
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-077',
    no: '77',
    title: '简化路径',
    difficulty: '中等',
    tags: ['字符串', '栈'],
    desc: `给定一个 Unix 风格的绝对路径 \`path\`，把它简化为规范路径（无末尾 \`/\`，无连续 \`//\`，\`.\` 忽略，\`..\` 回到上级，根目录不能再回退）。

示例 1：
\`\`\`
输入：path = "/home/"
输出："/home"
\`\`\`

示例 2：
\`\`\`
输入：path = "/a/./b/../../c/"
输出："/c"
\`\`\``,
    functionName: 'simplifyPath',
    starterCode: 'function simplifyPath(path) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['/home/'], expected: '/home', inputConvert: null, outputConvert: null },
      { input: ['/../'], expected: '/', inputConvert: null, outputConvert: null },
      { input: ['/home//foo/'], expected: '/home/foo', inputConvert: null, outputConvert: null },
      { input: ['/a/./b/../../c/'], expected: '/c', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

以 \`/\` 切分，用栈处理每段：空串或 \`.\` 忽略；\`..\` 弹出栈顶；其余入栈。最后用 \`/\` 拼接并补前导 \`/\`。

\`\`\`js
function simplifyPath(path) {
  const stack = []
  for (const p of path.split('/')) {
    if (p === '' || p === '.') continue
    if (p === '..') stack.pop()
    else stack.push(p)
  }
  return '/' + stack.join('/')
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-078',
    no: '78',
    title: '压缩字符串',
    difficulty: '中等',
    tags: ['字符串', '双指针'],
    desc: `给定字符数组 \`chars\`，对其进行原地压缩：把连续重复字符写成「字符 + 出现次数」（数量为 1 时省略数字），返回压缩后新长度对应的前缀数组。

示例 1：
\`\`\`
输入：chars = ["a","a","b","b","c","c","c"]
输出：["a","2","b","2","c","3"]
\`\`\`

示例 2：
\`\`\`
输入：chars = ["a"]
输出：["a"]
\`\`\``,
    functionName: 'compress',
    starterCode: 'function compress(chars) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [['a', 'a', 'b', 'b', 'c', 'c', 'c']], expected: ['a', '2', 'b', '2', 'c', '3'], inputConvert: null, outputConvert: null },
      { input: [['a']], expected: ['a'], inputConvert: null, outputConvert: null },
      { input: [['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']], expected: ['a', 'b', '1', '1'], inputConvert: null, outputConvert: null },
      { input: [['a', 'a', 'a', 'a', 'a', 'a', 'b', 'b', 'b', 'b', 'b', 'b']], expected: ['a', '6', 'b', '6'], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

读指针 \`i\` 跳过连续相同字符，写指针 \`write\` 写入字符与其计数字符串。最后返回写好的前缀片段。

\`\`\`js
function compress(chars) {
  let write = 0, i = 0
  while (i < chars.length) {
    const ch = chars[i]
    let count = 0
    while (i < chars.length && chars[i] === ch) { i++; count++ }
    chars[write++] = ch
    if (count > 1) {
      for (const d of String(count)) chars[write++] = d
    }
  }
  return chars.slice(0, write)
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  // ====================== 字符串·困难（1 道） ======================
  {
    id: 'algo-079',
    no: '79',
    title: '最小覆盖子串',
    difficulty: '困难',
    tags: ['字符串', '滑动窗口'],
    desc: `给定字符串 \`s\` 和 \`t\`，返回 \`s\` 中涵盖 \`t\` 所有字符（含重复）的最小子串；不存在返回空串。

示例 1：
\`\`\`
输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
\`\`\`

示例 2：
\`\`\`
输入：s = "a", t = "aa"
输出：""
\`\`\``,
    functionName: 'minWindow',
    starterCode: 'function minWindow(s, t) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC', inputConvert: null, outputConvert: null },
      { input: ['a', 'a'], expected: 'a', inputConvert: null, outputConvert: null },
      { input: ['a', 'aa'], expected: '', inputConvert: null, outputConvert: null },
      { input: ['aa', 'aa'], expected: 'aa', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

滑动窗口：右指针扩展加入字符，当窗口覆盖 \`t\` 时左指针收缩以最小化长度。用 \`need\` 计数与已满足字符数 \`have\` 判断是否全覆盖。

\`\`\`js
function minWindow(s, t) {
  if (t.length === 0 || s.length < t.length) return ''
  const need = {}
  for (const c of t) need[c] = (need[c] || 0) + 1
  const needCnt = Object.keys(need).length
  const window = {}
  let have = 0, l = 0, minLen = Infinity, start = 0
  for (let r = 0; r < s.length; r++) {
    const c = s[r]
    window[c] = (window[c] || 0) + 1
    if (need[c] !== undefined && window[c] === need[c]) have++
    while (have === needCnt) {
      if (r - l + 1 < minLen) { minLen = r - l + 1; start = l }
      const lc = s[l]
      window[lc]--
      if (need[lc] !== undefined && window[lc] === need[lc] - 1) have--
      l++
    }
  }
  return minLen === Infinity ? '' : s.slice(start, start + minLen)
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)'
  },
  // ====================== 数学与模拟·简单（3 道） ======================
  {
    id: 'algo-080',
    no: '80',
    title: '罗马数字转整数',
    difficulty: '简单',
    tags: ['数学', '字符串'],
    desc: `给定一个合法罗马数字字符串 \`s\`（含 \`I V X L C D M\`），将其转换为整数。规则：若小值出现在大值左侧则减去小值，否则累加。

示例 1：
\`\`\`
输入：s = "III"
输出：3
\`\`\`

示例 2：
\`\`\`
输入：s = "MCMXCIV"
输出：1994
\`\`\``,
    functionName: 'romanToInt',
    starterCode: 'function romanToInt(s) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: ['III'], expected: 3, inputConvert: null, outputConvert: null },
      { input: ['IV'], expected: 4, inputConvert: null, outputConvert: null },
      { input: ['LVIII'], expected: 58, inputConvert: null, outputConvert: null },
      { input: ['MCMXCIV'], expected: 1994, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

遍历时若当前字符值小于下一个字符值，说明是「减」组合，做减法并跳过下一个；否则直接累加。

\`\`\`js
function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && map[s[i]] < map[s[i + 1]]) {
      total += map[s[i + 1]] - map[s[i]]
      i++
    } else {
      total += map[s[i]]
    }
  }
  return total
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-081',
    no: '81',
    title: '整数反转',
    difficulty: '简单',
    tags: ['数学'],
    desc: `给定 32 位有符号整数 \`x\`，将其数字部分反转。若反转后超出 \`[-2³¹, 2³¹-1]\` 范围则返回 \`0\`。

示例 1：
\`\`\`
输入：x = 123
输出：321
\`\`\`

示例 2：
\`\`\`
输入：x = -123
输出：-321
\`\`\``,
    functionName: 'reverse',
    starterCode: 'function reverse(x) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [123], expected: 321, inputConvert: null, outputConvert: null },
      { input: [-123], expected: -321, inputConvert: null, outputConvert: null },
      { input: [120], expected: 21, inputConvert: null, outputConvert: null },
      { input: [1534236469], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

不断取末位 \`x % 10\` 拼到结果 \`rev\`，\`x\` 整除 10。最后带上符号并做 32 位范围校验。

\`\`\`js
function reverse(x) {
  const sign = x < 0 ? -1 : 1
  let n = Math.abs(x), rev = 0
  while (n > 0) {
    rev = rev * 10 + n % 10
    n = Math.floor(n / 10)
  }
  const result = sign * rev
  if (result < -2147483648 || result > 2147483647) return 0
  return result
}
\`\`\``,
    timeComplexity: 'O(log x)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-082',
    no: '82',
    title: '回文数',
    difficulty: '简单',
    tags: ['数学'],
    desc: `给定一个整数 \`x\`，判断它是否为回文数（不转为字符串）。

示例 1：
\`\`\`
输入：x = 121
输出：true
\`\`\`

示例 2：
\`\`\`
输入：x = -121
输出：false
\`\`\``,
    functionName: 'isPalindromeNumber',
    starterCode: 'function isPalindromeNumber(x) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [121], expected: true, inputConvert: null, outputConvert: null },
      { input: [-121], expected: false, inputConvert: null, outputConvert: null },
      { input: [10], expected: false, inputConvert: null, outputConvert: null },
      { input: [0], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

负数或末位为 0（非 0 本身）直接 false。反转后半部分数字，与前半部分比较，相等或差一位（奇数长度）即为回文。

\`\`\`js
function isPalindromeNumber(x) {
  if (x < 0) return false
  if (x !== 0 && x % 10 === 0) return false
  let n = x, rev = 0
  while (n > rev) {
    rev = rev * 10 + n % 10
    n = Math.floor(n / 10)
  }
  return n === rev || n === Math.floor(rev / 10)
}
\`\`\``,
    timeComplexity: 'O(log x)',
    spaceComplexity: 'O(1)'
  },
  // ====================== 数学与模拟·中等（6 道） ======================
  {
    id: 'algo-083',
    no: '83',
    title: 'x 的平方根',
    difficulty: '中等',
    tags: ['数学', '二分查找'],
    desc: `给定非负整数 \`x\`，计算并返回其算术平方根的整数部分（只取整数部分，不保留小数）。

示例 1：
\`\`\`
输入：x = 4
输出：2
\`\`\`

示例 2：
\`\`\`
输入：x = 8
输出：2
\`\`\``,
    functionName: 'mySqrt',
    starterCode: 'function mySqrt(x) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [4], expected: 2, inputConvert: null, outputConvert: null },
      { input: [8], expected: 2, inputConvert: null, outputConvert: null },
      { input: [0], expected: 0, inputConvert: null, outputConvert: null },
      { input: [2147395600], expected: 46340, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分答案：在 \`[1, x]\` 区间内找最大的 \`mid\` 满足 \`mid*mid <= x\`，最终 \`r\` 即为整数平方根。

\`\`\`js
function mySqrt(x) {
  if (x < 2) return x
  let l = 1, r = x
  while (l <= r) {
    const mid = (l + r) >> 1
    if (mid * mid === x) return mid
    if (mid * mid < x) l = mid + 1
    else r = mid - 1
  }
  return r
}
\`\`\``,
    timeComplexity: 'O(log x)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-084',
    no: '84',
    title: '两数之和（不用加减号）',
    difficulty: '中等',
    tags: ['数学', '位运算'],
    desc: `给定两个整数 \`a\` 和 \`b\`，不使用 \`+\` / \`-\` 运算符，返回它们的和。

示例 1：
\`\`\`
输入：a = 1, b = 2
输出：3
\`\`\`

示例 2：
\`\`\`
输入：a = -2, b = 3
输出：1
\`\`\``,
    functionName: 'getSum',
    starterCode: 'function getSum(a, b) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [1, 2], expected: 3, inputConvert: null, outputConvert: null },
      { input: [-2, 3], expected: 1, inputConvert: null, outputConvert: null },
      { input: [0, 0], expected: 0, inputConvert: null, outputConvert: null },
      { input: [5, 7], expected: 12, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

位运算模拟加法：异或 \`a ^ b\` 得到无进位和，\`(a & b) << 1\` 得到进位；把进位作为新的 \`b\` 反复迭代，直到进位为 0。JS 位运算以 32 位有符号整数处理，因此可正确处理负数。

\`\`\`js
function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1
    a = a ^ b
    b = carry
  }
  return a
}
\`\`\``,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-085',
    no: '85',
    title: '两数相除',
    difficulty: '中等',
    tags: ['数学', '位运算'],
    desc: `给定两个整数 \`dividend\` 和 \`divisor\`，在不使用乘法、除法和取模运算符的情况下，返回 \`dividend / divisor\` 的**向零截断**商。若结果超出 32 位有符号范围则截断到边界。

示例 1：
\`\`\`
输入：dividend = 10, divisor = 3
输出：3
\`\`\`

示例 2：
\`\`\`
输入：dividend = 7, divisor = -3
输出：-2
\`\`\``,
    functionName: 'divide',
    starterCode: 'function divide(dividend, divisor) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [10, 3], expected: 3, inputConvert: null, outputConvert: null },
      { input: [7, -3], expected: -2, inputConvert: null, outputConvert: null },
      { input: [1, 1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [-2147483648, -1], expected: 2147483647, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用「指数衰减」减法：每次尝试减去最大的 \`divisor << k\`，对应商累加 \`1 << k\`。符号单独处理，溢出特判。

\`\`\`js
function divide(dividend, divisor) {
  const INT_MAX = 2147483647, INT_MIN = -2147483648
  if (dividend === INT_MIN && divisor === -1) return INT_MAX
  const sign = ((dividend < 0) ^ (divisor < 0)) ? -1 : 1
  let a = Math.abs(dividend), b = Math.abs(divisor)
  let quotient = 0
  while (a >= b) {
    let temp = b, multiple = 1
    while (a >= (temp << 1) && (temp << 1) > 0) {
      temp <<= 1
      multiple <<= 1
    }
    a -= temp
    quotient += multiple
  }
  return sign === 1 ? quotient : -quotient
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-086',
    no: '86',
    title: '分数到小数',
    difficulty: '中等',
    tags: ['数学', '哈希表'],
    desc: `给定两个整数 \`numerator\` 和 \`denominator\`，以字符串形式返回分数对应的小数。若小数部分有循环节，则用括号把循环节括起来。

示例 1：
\`\`\`
输入：numerator = 2, denominator = 3
输出："0.(6)"
\`\`\`

示例 2：
\`\`\`
输入：numerator = 4, denominator = 333
输出："0.(012)"
\`\`\``,
    functionName: 'fractionToDecimal',
    starterCode: 'function fractionToDecimal(numerator, denominator) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [1, 2], expected: '0.5', inputConvert: null, outputConvert: null },
      { input: [2, 1], expected: '2', inputConvert: null, outputConvert: null },
      { input: [2, 3], expected: '0.(6)', inputConvert: null, outputConvert: null },
      { input: [4, 333], expected: '0.(012)', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先处理符号和整数部分。余数用哈希表记录其出现位置；若同一余数再次出现，说明从该位置开始循环，用括号包裹即可。

\`\`\`js
function fractionToDecimal(numerator, denominator) {
  if (numerator === 0) return '0'
  let res = ''
  if ((numerator < 0) ^ (denominator < 0)) res += '-'
  let n = Math.abs(numerator), d = Math.abs(denominator)
  res += Math.floor(n / d)
  let rem = n % d
  if (rem === 0) return res
  res += '.'
  const map = {}
  while (rem !== 0) {
    if (map[rem] !== undefined) {
      res = res.slice(0, map[rem]) + '(' + res.slice(map[rem]) + ')'
      return res
    }
    map[rem] = res.length
    rem *= 10
    res += Math.floor(rem / d)
    rem = rem % d
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-087',
    no: '87',
    title: 'Pow(x, n)',
    difficulty: '中等',
    tags: ['数学', '分治'],
    desc: `实现 \`myPow(x, n)\`，计算 \`x\` 的 \`n\` 次幂（即 \`xⁿ\`）。\`n\` 为 32 位有符号整数，可能为负。

示例 1：
\`\`\`
输入：x = 2, n = 10
输出：1024
\`\`\`

示例 2：
\`\`\`
输入：x = 2, n = -2
输出：0.25
\`\`\``,
    functionName: 'myPow',
    starterCode: 'function myPow(x, n) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [2, 10], expected: 1024, inputConvert: null, outputConvert: null },
      { input: [2, -2], expected: 0.25, inputConvert: null, outputConvert: null },
      { input: [2, 0], expected: 1, inputConvert: null, outputConvert: null },
      { input: [3, 4], expected: 81, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快速幂：若 \`n\` 为奇数则把结果多乘一次 \`x\`，每次 \`x\` 自平方、\`n\` 折半。负指数转为其倒数后处理。

\`\`\`js
function myPow(x, n) {
  let N = n
  if (N < 0) {
    x = 1 / x
    N = -N
  }
  let result = 1
  while (N > 0) {
    if (N % 2 === 1) result *= x
    x *= x
    N = Math.floor(N / 2)
  }
  return result
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-088',
    no: '88',
    title: '阶乘后的零',
    difficulty: '中等',
    tags: ['数学'],
    desc: `给定一个非负整数 \`n\`，返回 \`n!\` 结果末尾连续的 \`0\` 的个数。

示例 1：
\`\`\`
输入：n = 5
输出：1
\`\`\`

示例 2：
\`\`\`
输入：n = 25
输出：6
\`\`\``,
    functionName: 'trailingZeroes',
    starterCode: 'function trailingZeroes(n) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [3], expected: 0, inputConvert: null, outputConvert: null },
      { input: [5], expected: 1, inputConvert: null, outputConvert: null },
      { input: [25], expected: 6, inputConvert: null, outputConvert: null },
      { input: [100], expected: 24, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

末尾 0 的个数取决于因子中 5 的个数（2 充足）。统计 \`n/5 + n/25 + n/125 + ...\` 即可。

\`\`\`js
function trailingZeroes(n) {
  let count = 0
  while (n >= 5) {
    n = Math.floor(n / 5)
    count += n
  }
  return count
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  // ====================== 数学与模拟·困难（3 道） ======================
  {
    id: 'algo-089',
    no: '89',
    title: '最大间距',
    difficulty: '困难',
    tags: ['数组', '基数排序'],
    desc: `给定一个无序数组 \`nums\`，返回其排序后相邻元素之间的最大差值。要求在线性时间与线性额外空间内完成。

示例 1：
\`\`\`
输入：nums = [3,6,9,1]
输出：3
\`\`\`

示例 2：
\`\`\`
输入：nums = [10]
输出：0
\`\`\``,
    functionName: 'maximumGap',
    starterCode: 'function maximumGap(nums) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[3, 6, 9, 1]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[10]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 1, 1, 1]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 100]], expected: 99, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

桶排序思想：把 \`[min, max]\` 分成若干桶，最大间距一定出现在相邻桶之间（桶内间距不超过桶宽）。记录每个桶的 min/max，相邻非空桶的「下桶 min - 上桶 max」取最大。

\`\`\`js
function maximumGap(nums) {
  if (nums.length < 2) return 0
  let lo = Math.min(...nums), hi = Math.max(...nums)
  if (lo === hi) return 0
  const n = nums.length
  const bucketSize = Math.max(1, Math.floor((hi - lo) / (n - 1)))
  const bucketCount = Math.floor((hi - lo) / bucketSize) + 1
  const buckets = Array.from({ length: bucketCount }, () => [Infinity, -Infinity])
  for (const num of nums) {
    const idx = Math.floor((num - lo) / bucketSize)
    buckets[idx][0] = Math.min(buckets[idx][0], num)
    buckets[idx][1] = Math.max(buckets[idx][1], num)
  }
  let maxGap = 0, prev = lo
  for (const [bmin, bmax] of buckets) {
    if (bmin === Infinity) continue
    maxGap = Math.max(maxGap, bmin - prev)
    prev = bmax
  }
  return maxGap
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-090',
    no: '90',
    title: '直线上最多的点',
    difficulty: '困难',
    tags: ['数学', '几何', '哈希表'],
    desc: `给定一个点数组 \`points\`（每个点为 \`[x, y]\`），求位于同一条直线上的最多点数。

示例 1：
\`\`\`
输入：points = [[1,1],[2,2],[3,3]]
输出：3
\`\`\`

示例 2：
\`\`\`
输入：points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
输出：4
\`\`\``,
    functionName: 'maxPoints',
    starterCode: 'function maxPoints(points) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[[1, 1], [2, 2], [3, 3]]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[[0, 0]]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[[1, 1], [1, 1], [1, 1]]], expected: 3, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

以每个点为基准，向其它点统计「斜率」出现次数。斜率用约分后的最简分数 \`(dx/g, dy/g)\` 并统一符号做 key。相同坐标的点单独计数累加。取最大值。

\`\`\`js
function maxPoints(points) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
  if (points.length <= 2) return points.length
  let max = 0
  for (let i = 0; i < points.length; i++) {
    const slopes = {}
    let same = 1, localMax = 0
    for (let j = i + 1; j < points.length; j++) {
      let dx = points[j][0] - points[i][0]
      let dy = points[j][1] - points[i][1]
      if (dx === 0 && dy === 0) { same++; continue }
      const g = gcd(Math.abs(dx), Math.abs(dy))
      let sx = dx / g, sy = dy / g
      if (sx < 0 || (sx === 0 && sy < 0)) { sx = -sx; sy = -sy }
      const key = sx + ',' + sy
      slopes[key] = (slopes[key] || 0) + 1
      localMax = Math.max(localMax, slopes[key])
    }
    max = Math.max(max, localMax + same)
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-091',
    no: '91',
    title: 'N 皇后 II（计数版）',
    difficulty: '困难',
    tags: ['回溯', '数学'],
    desc: `给定整数 \`n\`，返回 \`n\` 皇后问题的不同解法数量（在 \`n×n\` 棋盘上放置 \`n\` 个皇后，使其彼此不能互相攻击）。

示例 1：
\`\`\`
输入：n = 4
输出：2
\`\`\`

示例 2：
\`\`\`
输入：n = 8
输出：92
\`\`\``,
    functionName: 'totalNQueens',
    starterCode: 'function totalNQueens(n) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [4], expected: 2, inputConvert: null, outputConvert: null },
      { input: [8], expected: 92, inputConvert: null, outputConvert: null },
      { input: [2], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

逐行回溯，用三个集合记录已占用的列、主对角线（row-col）、副对角线（row+col）。能放则递归下一行，不能放则跳过。到末行时计数加一。

\`\`\`js
function totalNQueens(n) {
  let count = 0
  const cols = new Set(), diag1 = new Set(), diag2 = new Set()
  const backtrack = (row) => {
    if (row === n) { count++; return }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue
      cols.add(col); diag1.add(row - col); diag2.add(row + col)
      backtrack(row + 1)
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col)
    }
  }
  backtrack(0)
  return count
}
\`\`\``,
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)'
  }
]
