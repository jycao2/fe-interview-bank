// LeetCode 风格算法题库
// 每道题包含：描述 / 初始代码 / 测试用例 / 解题思路 / 复杂度
// 链表题目使用 LINKED_LIST_SETUP，树题目使用 TREE_SETUP（从 runner 导入）
// 题库分为 4 个片段加载，最终合并到 algorithmProblems
import { LINKED_LIST_SETUP, TREE_SETUP } from '../utils/algorithmRunner.js'
import { part1Problems } from './algo_part1.js'
import { part2Problems } from './algo_part2.js'
import { part3Problems } from './algo_part3.js'
import { part4Problems } from './algo_part4.js'

// 第 1 段：原 45 道（数组/字符串/数学/栈队列/二分/排序/DP/滑动窗口/链表/树）
const baseProblems = [
  // ====================== 数组（10 道） ======================
  {
    id: 'algo-001',
    no: '1',
    title: '两数之和',
    difficulty: '简单',
    tags: ['数组', '哈希表'],
    desc: `给定一个整数数组 \`nums\` 和一个整数目标值 \`target\`，请你在该数组中找出和为目标值 \`target\` 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。可以按任意顺序返回答案。

示例 1：
\`\`\`
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9，返回 [0,1]
\`\`\`

示例 2：
\`\`\`
输入：nums = [3,2,4], target = 6
输出：[1,2]
\`\`\`

示例 3：
\`\`\`
输入：nums = [3,3], target = 6
输出：[0,1]
\`\`\``,
    functionName: 'twoSum',
    starterCode: 'function twoSum(nums, target) {\n  // 写你的代码\n}',
    setup: '',
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], inputConvert: null, outputConvert: null },
      { input: [[3, 2, 4], 6], expected: [1, 2], inputConvert: null, outputConvert: null },
      { input: [[3, 3], 6], expected: [0, 1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用哈希表记录「值 -> 索引」。遍历数组，对每个 \`nums[i]\`，看 \`target - nums[i]\` 是否已在哈希表中：在则返回对应索引，不在则把当前值存入哈希表。一次遍历即可。

\`\`\`js
function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (map.has(need)) {
      return [map.get(need), i]
    }
    map.set(nums[i], i)
  }
  return []
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-002',
    no: '2',
    title: '移除元素',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给你一个数组 \`nums\` 和一个值 \`val\`，你需要原地移除所有数值等于 \`val\` 的元素，并返回移除后数组的新长度。

不要使用额外的数组空间，必须仅使用 O(1) 额外空间原地修改输入数组。元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。

示例 1：
\`\`\`
输入：nums = [3,2,2,3], val = 3
输出：2, nums = [2,2]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,1,2,2,3,0,4,2], val = 2
输出：5, nums = [0,1,4,0,3]
\`\`\`

示例 3：
\`\`\`
输入：nums = [1], val = 1
输出：0
\`\`\``,
    functionName: 'removeElement',
    starterCode: 'function removeElement(nums, val) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[3, 2, 2, 3], 3], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[0, 1, 2, 2, 3, 0, 4, 2], 2], expected: 5, inputConvert: null, outputConvert: null },
      { input: [[1], 1], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快慢指针：慢指针 \`i\` 指向下一个要写入的位置，快指针 \`j\` 遍历数组。当 \`nums[j] !== val\` 时，把它复制到 \`nums[i]\` 并令 \`i++\`。最后 \`i\` 即为新长度。

\`\`\`js
function removeElement(nums, val) {
  let i = 0
  for (let j = 0; j < nums.length; j++) {
    if (nums[j] !== val) {
      nums[i] = nums[j]
      i++
    }
  }
  return i
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-003',
    no: '3',
    title: '删除排序数组中的重复项',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给你一个非严格递增排列的数组 \`nums\`，请你原地删除重复出现的元素，使每个元素只出现一次，返回删除后数组的新长度。

不要使用额外的数组空间，必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。

示例 1：
\`\`\`
输入：nums = [1,1,2]
输出：2, nums = [1,2]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,0,1,1,1,2,2,3,3,4]
输出：5, nums = [0,1,2,3,4]
\`\`\`

示例 3：
\`\`\`
输入：nums = [1,1,1]
输出：1, nums = [1]
\`\`\``,
    functionName: 'removeDuplicates',
    starterCode: 'function removeDuplicates(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[1, 1, 2]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5, inputConvert: null, outputConvert: null },
      { input: [[1, 1, 1]], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快慢指针：\`i\` 指向已处理无重复部分的末尾。从 \`j = 1\` 开始遍历，若 \`nums[j] !== nums[i]\`，则 \`i++\` 并把 \`nums[j]\` 复制过去。返回 \`i + 1\`。

\`\`\`js
function removeDuplicates(nums) {
  if (nums.length === 0) return 0
  let i = 0
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++
      nums[i] = nums[j]
    }
  }
  return i + 1
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-004',
    no: '4',
    title: '加一',
    difficulty: '简单',
    tags: ['数组', '模拟'],
    desc: `给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。

最高位数字存放在数组的首位，数组中每个元素只存储单个数字。你可以假设除了整数 0 之外，这个整数不会以零开头。

示例 1：
\`\`\`
输入：digits = [1,2,3]
输出：[1,2,4]
\`\`\`

示例 2：
\`\`\`
输入：digits = [4,3,2,1]
输出：[4,3,2,2]
\`\`\`

示例 3：
\`\`\`
输入：digits = [9]
输出：[1,0]
\`\`\``,
    functionName: 'plusOne',
    starterCode: 'function plusOne(digits) {\n  // 写你的代码\n  return digits\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3]], expected: [1, 2, 4], inputConvert: null, outputConvert: null },
      { input: [[4, 3, 2, 1]], expected: [4, 3, 2, 2], inputConvert: null, outputConvert: null },
      { input: [[9]], expected: [1, 0], inputConvert: null, outputConvert: null },
      { input: [[9, 9, 9]], expected: [1, 0, 0, 0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

从末位向前遍历：当前位小于 9 则加 1 直接返回；等于 9 则置 0 继续进位。若全为 9，最后在数组头部插入 1。

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
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-005',
    no: '5',
    title: '移动零',
    difficulty: '简单',
    tags: ['数组', '双指针'],
    desc: `给定一个数组 \`nums\`，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

必须在不复制数组的情况下原地对数组进行操作。

示例 1：
\`\`\`
输入：nums = [0,1,0,3,12]
输出：[1,3,12,0,0]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0]
输出：[0]
\`\`\`

示例 3：
\`\`\`
输入：nums = [1,0,2,0,3]
输出：[1,2,3,0,0]
\`\`\``,
    functionName: 'moveZeroes',
    starterCode: 'function moveZeroes(nums) {\n  // 写你的代码\n  return nums\n}',
    setup: '',
    testCases: [
      { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0], inputConvert: null, outputConvert: null },
      { input: [[0]], expected: [0], inputConvert: null, outputConvert: null },
      { input: [[1, 0, 2, 0, 3]], expected: [1, 2, 3, 0, 0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快慢指针：\`i\` 指向下一个非零元素应放的位置。遍历数组，遇到非零就交换到 \`nums[i]\` 并 \`i++\`。最后 \`i\` 到末尾之间自动填 0（通过交换完成）。

\`\`\`js
function moveZeroes(nums) {
  let i = 0
  for (let j = 0; j < nums.length; j++) {
    if (nums[j] !== 0) {
      ;[nums[i], nums[j]] = [nums[j], nums[i]]
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
    id: 'algo-006',
    no: '6',
    title: '买卖股票的最佳时机',
    difficulty: '简单',
    tags: ['数组', '一次遍历'],
    desc: `给定一个数组 \`prices\`，它的第 \`i\` 个元素 \`prices[i]\` 表示一支给定股票第 \`i\` 天的价格。

你只能选择某一天买入并在未来的某一天卖出。设计算法计算所能获取的最大利润。返回你可以从这笔交易中获取的最大利润。如果不能获取任何利润，返回 0。

示例 1：
\`\`\`
输入：prices = [7,1,5,3,6,4]
输出：5
解释：在第 2 天（价格=1）买入，第 5 天（价格=6）卖出，利润=6-1=5
\`\`\`

示例 2：
\`\`\`
输入：prices = [7,6,4,3,1]
输出：0
\`\`\`

示例 3：
\`\`\`
输入：prices = [1,2]
输出：1
\`\`\``,
    functionName: 'maxProfit',
    starterCode: 'function maxProfit(prices) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, inputConvert: null, outputConvert: null },
      { input: [[7, 6, 4, 3, 1]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 2]], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

一次遍历维护两个变量：\`minPrice\`（历史最低价）和 \`profit\`（最大利润）。遍历到每一天：用今日价格减去 \`minPrice\` 更新利润，再用今日价格更新 \`minPrice\`。

\`\`\`js
function maxProfit(prices) {
  let minPrice = Infinity
  let profit = 0
  for (const p of prices) {
    if (p < minPrice) minPrice = p
    else if (p - minPrice > profit) profit = p - minPrice
  }
  return profit
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-007',
    no: '7',
    title: '只出现一次的数字',
    difficulty: '简单',
    tags: ['位运算', '数组'],
    desc: `给你一个非空整数数组 \`nums\`，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

你的算法应该具有线性时间复杂度，且不使用额外空间。

示例 1：
\`\`\`
输入：nums = [2,2,1]
输出：1
\`\`\`

示例 2：
\`\`\`
输入：nums = [4,1,2,1,2]
输出：4
\`\`\`

示例 3：
\`\`\`
输入：nums = [1]
输出：1
\`\`\``,
    functionName: 'singleNumber',
    starterCode: 'function singleNumber(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[2, 2, 1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[4, 1, 2, 1, 2]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

利用异或性质：\`a ^ a = 0\`，\`a ^ 0 = a\`，异或满足交换律和结合律。把所有数异或起来，出现两次的互相抵消，最后剩下的就是只出现一次的数。

\`\`\`js
function singleNumber(nums) {
  let x = 0
  for (const n of nums) x ^= n
  return x
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-008',
    no: '8',
    title: '存在重复元素',
    difficulty: '简单',
    tags: ['数组', '哈希表'],
    desc: `给你一个整数数组 \`nums\`。如果任一值在数组中出现至少两次，返回 \`true\`；如果数组中每个元素互不相同，返回 \`false\`。

示例 1：
\`\`\`
输入：nums = [1,2,3,1]
输出：true
\`\`\`

示例 2：
\`\`\`
输入：nums = [1,2,3,4]
输出：false
\`\`\`

示例 3：
\`\`\`
输入：nums = [1,1,1,3,3,4,3,2,4,2]
输出：true
\`\`\``,
    functionName: 'containsDuplicate',
    starterCode: 'function containsDuplicate(nums) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4]], expected: false, inputConvert: null, outputConvert: null },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用 Set 记录已出现元素。遍历数组，若当前元素已在 Set 中则返回 \`true\`，否则加入 Set。遍历完返回 \`false\`。

\`\`\`js
function containsDuplicate(nums) {
  const set = new Set()
  for (const n of nums) {
    if (set.has(n)) return true
    set.add(n)
  }
  return false
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-009',
    no: '9',
    title: '丢失的数字',
    difficulty: '简单',
    tags: ['数组', '数学'],
    desc: `给定一个包含 \`[0, n]\` 中 \`n\` 个数的数组 \`nums\`，找出 \`[0, n]\` 这个范围内没有出现在数组中的那个数。

示例 1：
\`\`\`
输入：nums = [3,0,1]
输出：2
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,1]
输出：2
\`\`\`

示例 3：
\`\`\`
输入：nums = [9,6,4,2,3,5,7,0,1]
输出：8
\`\`\``,
    functionName: 'missingNumber',
    starterCode: 'function missingNumber(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[3, 0, 1]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[0, 1]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

数学法：\`[0, n]\` 的和为 \`n*(n+1)/2\`，减去数组元素之和，差值即为丢失的数字。也可以用异或：把索引和值一起异或，剩下的就是缺失的数。

\`\`\`js
function missingNumber(nums) {
  const n = nums.length
  let sum = (n * (n + 1)) / 2
  for (const x of nums) sum -= x
  return sum
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-010',
    no: '10',
    title: '多数元素',
    difficulty: '简单',
    tags: ['数组', '摩尔投票'],
    desc: `给定一个大小为 \`n\` 的数组 \`nums\`，返回其中的多数元素。多数元素是指在数组中出现次数大于 \`⌊n/2⌋\` 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

示例 1：
\`\`\`
输入：nums = [3,2,3]
输出：3
\`\`\`

示例 2：
\`\`\`
输入：nums = [2,2,1,1,1,2,2]
输出：2
\`\`\`

示例 3：
\`\`\`
输入：nums = [1]
输出：1
\`\`\``,
    functionName: 'majorityElement',
    starterCode: 'function majorityElement(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[3, 2, 3]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[2, 2, 1, 1, 1, 2, 2]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

摩尔投票法：维护候选 \`candidate\` 和计数 \`count\`。遍历数组：\`count\` 为 0 时换候选；当前数等于候选则 \`count++\`，否则 \`count--\`。因为多数元素出现超过一半，最后剩下的候选一定是它。

\`\`\`js
function majorityElement(nums) {
  let candidate = 0
  let count = 0
  for (const n of nums) {
    if (count === 0) candidate = n
    count += n === candidate ? 1 : -1
  }
  return candidate
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // ====================== 字符串（6 道） ======================
  {
    id: 'algo-011',
    no: '11',
    title: '反转字符串',
    difficulty: '简单',
    tags: ['字符串', '双指针'],
    desc: `编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 \`s\` 的形式给出。

不要给另外的数组分配额外空间，必须原地修改输入数组，使用 O(1) 额外空间。

示例 1：
\`\`\`
输入：s = ["h","e","l","l","o"]
输出：["o","l","l","e","h"]
\`\`\`

示例 2：
\`\`\`
输入：s = ["H","a","n","n","a","h"]
输出：["h","a","n","n","a","H"]
\`\`\`

示例 3：
\`\`\`
输入：s = ["a"]
输出：["a"]
\`\`\``,
    functionName: 'reverseString',
    starterCode: 'function reverseString(s) {\n  // 写你的代码\n  return s\n}',
    setup: '',
    testCases: [
      { input: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'], inputConvert: null, outputConvert: null },
      { input: [['H', 'a', 'n', 'n', 'a', 'h']], expected: ['h', 'a', 'n', 'n', 'a', 'H'], inputConvert: null, outputConvert: null },
      { input: [['a']], expected: ['a'], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

双指针从两端向中间走，每次交换 \`s[i]\` 和 \`s[j]\`，直到相遇。

\`\`\`js
function reverseString(s) {
  let i = 0
  let j = s.length - 1
  while (i < j) {
    ;[s[i], s[j]] = [s[j], s[i]]
    i++
    j--
  }
  return s
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-012',
    no: '12',
    title: '有效的字母异位词',
    difficulty: '简单',
    tags: ['字符串', '哈希表'],
    desc: `给定两个字符串 \`s\` 和 \`t\`，编写一个函数来判断 \`t\` 是否是 \`s\` 的字母异位词。

若 \`s\` 和 \`t\` 中每个字母出现的次数都相同，则互为字母异位词。

示例 1：
\`\`\`
输入：s = "anagram", t = "nagaram"
输出：true
\`\`\`

示例 2：
\`\`\`
输入：s = "rat", t = "car"
输出：false
\`\`\`

示例 3：
\`\`\`
输入：s = "a", t = "a"
输出：true
\`\`\``,
    functionName: 'isAnagram',
    starterCode: 'function isAnagram(s, t) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['rat', 'car'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['a', 'a'], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用一个长度 26 的计数数组。遍历 \`s\` 让对应位置 +1，遍历 \`t\` 让对应位置 -1，最后检查数组是否全为 0。也可以先排序再比较。

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
    id: 'algo-013',
    no: '13',
    title: '验证回文串',
    difficulty: '简单',
    tags: ['字符串', '双指针'],
    desc: `如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样，则认为该短语是一个回文串。

字母和数字都属于字母数字字符。

给你一个字符串 \`s\`，如果它是回文串，返回 \`true\`；否则返回 \`false\`。

示例 1：
\`\`\`
输入：s = "A man, a plan, a canal: Panama"
输出：true
\`\`\`

示例 2：
\`\`\`
输入：s = "race a car"
输出：false
\`\`\`

示例 3：
\`\`\`
输入：s = " "
输出：true
\`\`\``,
    functionName: 'isPalindrome',
    starterCode: 'function isPalindrome(s) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['race a car'], expected: false, inputConvert: null, outputConvert: null },
      { input: [' '], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

双指针：\`i\` 从头、\`j\` 从尾。跳过非字母数字字符，比较小写化后是否相等。相遇即回文。

\`\`\`js
function isPalindrome(s) {
  let i = 0
  let j = s.length - 1
  const isAlnum = c => /[a-z0-9]/i.test(c)
  while (i < j) {
    while (i < j && !isAlnum(s[i])) i++
    while (i < j && !isAlnum(s[j])) j--
    if (s[i].toLowerCase() !== s[j].toLowerCase()) return false
    i++
    j--
  }
  return true
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-014',
    no: '14',
    title: '字符串中的第一个唯一字符',
    difficulty: '简单',
    tags: ['字符串', '哈希表'],
    desc: `给定一个字符串 \`s\`，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 \`-1\`。

示例 1：
\`\`\`
输入：s = "leetcode"
输出：0
\`\`\`

示例 2：
\`\`\`
输入：s = "loveleetcode"
输出：2
\`\`\`

示例 3：
\`\`\`
输入：s = "aabb"
输出：-1
\`\`\``,
    functionName: 'firstUniqChar',
    starterCode: 'function firstUniqChar(s) {\n  // 写你的代码\n  return -1\n}',
    setup: '',
    testCases: [
      { input: ['leetcode'], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['loveleetcode'], expected: 2, inputConvert: null, outputConvert: null },
      { input: ['aabb'], expected: -1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

两遍扫描：第一遍用长度 26 的数组统计字符频次，第二遍找到第一个频次为 1 的字符返回其索引。

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
    id: 'algo-015',
    no: '15',
    title: '实现 strStr()',
    difficulty: '简单',
    tags: ['字符串', '暴力匹配'],
    desc: `给你两个字符串 \`haystack\` 和 \`needle\`，请你在 \`haystack\` 字符串中找出 \`needle\` 字符串的第一个匹配项的下标。如果 \`needle\` 不是 \`haystack\` 的一部分，则返回 \`-1\`。

示例 1：
\`\`\`
输入：haystack = "sadbutsad", needle = "sad"
输出：0
\`\`\`

示例 2：
\`\`\`
输入：haystack = "leetcode", needle = "leeto"
输出：-1
\`\`\`

示例 3：
\`\`\`
输入：haystack = "hello", needle = "ll"
输出：2
\`\`\``,
    functionName: 'strStr',
    starterCode: 'function strStr(haystack, needle) {\n  // 写你的代码\n  return -1\n}',
    setup: '',
    testCases: [
      { input: ['sadbutsad', 'sad'], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['leetcode', 'leeto'], expected: -1, inputConvert: null, outputConvert: null },
      { input: ['hello', 'll'], expected: 2, inputConvert: null, outputConvert: null },
      { input: ['a', ''], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

暴力匹配：枚举所有起点 \`i\`，逐字符比较 \`haystack[i+k]\` 与 \`needle[k]\`。匹配成功返回 \`i\`。也可使用 KMP 算法优化到 O(n+m)。

\`\`\`js
function strStr(haystack, needle) {
  if (needle === '') return 0
  const n = haystack.length
  const m = needle.length
  for (let i = 0; i <= n - m; i++) {
    let k = 0
    while (k < m && haystack[i + k] === needle[k]) k++
    if (k === m) return i
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(n*m)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-016',
    no: '16',
    title: '罗马数字转整数',
    difficulty: '简单',
    tags: ['字符串', '哈希表'],
    desc: `罗马数字包含以下七种字符：\`I\`、\`V\`、\`X\`、\`L\`、\`C\`、\`D\` 和 \`M\`。

\`\`\`
字符   数值
I      1
V      5
X      10
L      50
C      100
D      500
M      1000
\`\`\`

通常情况下，小的数字在大的数字右边。但也存在特例：\`I\` 在 \`V\`/\`X\` 左边表示 4/9，依此类推。给定一个罗马数字，将其转换成整数。

示例 1：
\`\`\`
输入：s = "III"
输出：3
\`\`\`

示例 2：
\`\`\`
输入：s = "IV"
输出：4
\`\`\`

示例 3：
\`\`\`
输入：s = "MCMXCIV"
输出：1994
\`\`\``,
    functionName: 'romanToInt',
    starterCode: 'function romanToInt(s) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: ['III'], expected: 3, inputConvert: null, outputConvert: null },
      { input: ['IV'], expected: 4, inputConvert: null, outputConvert: null },
      { input: ['MCMXCIV'], expected: 1994, inputConvert: null, outputConvert: null },
      { input: ['LVIII'], expected: 58, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

规则：若当前字符对应值小于后一个字符，则减去；否则加上。一次遍历即可。

\`\`\`js
function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let res = 0
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]]
    const next = map[s[i + 1]] || 0
    if (cur < next) res -= cur
    else res += cur
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // ====================== 数学与模拟（4 道） ======================
  {
    id: 'algo-017',
    no: '17',
    title: 'FizzBuzz',
    difficulty: '简单',
    tags: ['数学', '模拟'],
    desc: `给你一个整数 \`n\`，找出从 1 到 \`n\` 各个数字的 Fizz Buzz 表示，并用字符串数组返回结果，其中：

- 如果 \`i\` 是 3 的倍数，输出 \`"Fizz"\`
- 如果 \`i\` 是 5 的倍数，输出 \`"Buzz"\`
- 如果 \`i\` 同时是 3 和 5 的倍数，输出 \`"FizzBuzz"\`
- 否则输出 \`i\` 的字符串形式

示例 1：
\`\`\`
输入：n = 3
输出：["1","2","Fizz"]
\`\`\`

示例 2：
\`\`\`
输入：n = 5
输出：["1","2","Fizz","4","Buzz"]
\`\`\`

示例 3：
\`\`\`
输入：n = 15
输出：["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
\`\`\``,
    functionName: 'fizzBuzz',
    starterCode: 'function fizzBuzz(n) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [3], expected: ['1', '2', 'Fizz'], inputConvert: null, outputConvert: null },
      { input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'], inputConvert: null, outputConvert: null },
      { input: [15], expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

遍历 1 到 n，按优先级判断 15 / 3 / 5。注意先判断 15（既是 3 又是 5 的倍数），避免被 3 或 5 提前命中。

\`\`\`js
function fizzBuzz(n) {
  const res = []
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) res.push('FizzBuzz')
    else if (i % 3 === 0) res.push('Fizz')
    else if (i % 5 === 0) res.push('Buzz')
    else res.push(String(i))
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-018',
    no: '18',
    title: '回文数',
    difficulty: '简单',
    tags: ['数学'],
    desc: `给你一个整数 \`x\`，如果 \`x\` 是一个回文整数，返回 \`true\`；否则返回 \`false\`。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。要求不将整数转为字符串。

示例 1：
\`\`\`
输入：x = 121
输出：true
\`\`\`

示例 2：
\`\`\`
输入：x = -121
输出：false
\`\`\`

示例 3：
\`\`\`
输入：x = 10
输出：false
\`\`\``,
    functionName: 'isPalindrome',
    starterCode: 'function isPalindrome(x) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: [121], expected: true, inputConvert: null, outputConvert: null },
      { input: [-121], expected: false, inputConvert: null, outputConvert: null },
      { input: [10], expected: false, inputConvert: null, outputConvert: null },
      { input: [0], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

负数直接 \`false\`。把数字反转一半，与另一半比较。每次取最低位 \`x % 10\` 接到 \`reverted\` 末尾，并把 \`x\` 整除 10，直到 \`reverted >= x\`。最后比较 \`x === reverted\` 或 \`x === Math.floor(reverted / 10)\`（处理奇数位）。

\`\`\`js
function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false
  let reverted = 0
  while (x > reverted) {
    reverted = reverted * 10 + (x % 10)
    x = Math.floor(x / 10)
  }
  return x === reverted || x === Math.floor(reverted / 10)
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-019',
    no: '19',
    title: 'x 的平方根',
    difficulty: '简单',
    tags: ['数学', '二分'],
    desc: `给你一个非负整数 \`x\`，计算并返回 \`x\` 的算术平方根的整数部分。

由于返回类型是整数，小数部分将被舍去。不能使用内置指数函数和算子。

示例 1：
\`\`\`
输入：x = 4
输出：2
\`\`\`

示例 2：
\`\`\`
输入：x = 8
输出：2
\`\`\`

示例 3：
\`\`\`
输入：x = 0
输出：0
\`\`\``,
    functionName: 'mySqrt',
    starterCode: 'function mySqrt(x) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [4], expected: 2, inputConvert: null, outputConvert: null },
      { input: [8], expected: 2, inputConvert: null, outputConvert: null },
      { input: [0], expected: 0, inputConvert: null, outputConvert: null },
      { input: [1], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分：在 \`[0, x]\` 中找最大的 \`mid\` 满足 \`mid * mid <= x\`。注意用除法 \`x / mid >= mid\` 防止溢出。

\`\`\`js
function mySqrt(x) {
  if (x < 2) return x
  let l = 1
  let r = Math.floor(x / 2)
  while (l <= r) {
    const mid = Math.floor((l + r) / 2)
    const sq = mid * mid
    if (sq === x) return mid
    else if (sq < x) l = mid + 1
    else r = mid - 1
  }
  return r
}
\`\`\``,
    timeComplexity: 'O(log x)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-020',
    no: '20',
    title: '阶乘后的零',
    difficulty: '中等',
    tags: ['数学'],
    desc: `给定一个整数 \`n\`，返回 \`n!\` 结果中尾随零的数量。

\`n!\` 是 \`n\` 的阶乘。要求时间复杂度是对数级别。

示例 1：
\`\`\`
输入：n = 3
输出：0
解释：3! = 6，不含尾随零
\`\`\`

示例 2：
\`\`\`
输入：n = 5
输出：1
解释：5! = 120，有一个尾随零
\`\`\`

示例 3：
\`\`\`
输入：n = 25
输出：6
\`\`\``,
    functionName: 'trailingZeroes',
    starterCode: 'function trailingZeroes(n) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [3], expected: 0, inputConvert: null, outputConvert: null },
      { input: [5], expected: 1, inputConvert: null, outputConvert: null },
      { input: [25], expected: 6, inputConvert: null, outputConvert: null },
      { input: [0], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

尾随零由 2*5 产生，而阶乘中 2 的数量远多于 5，所以统计 5 的因子个数即可。每隔 5 有一个 5，每隔 25 又多一个 5...所以答案是 \`n/5 + n/25 + n/125 + ...\`。

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

  // ====================== 栈与队列（3 道） ======================
  {
    id: 'algo-021',
    no: '21',
    title: '有效的括号',
    difficulty: '简单',
    tags: ['栈'],
    desc: `给定一个只包括 \`'('\`、\`')'\`、\`'{'\`、\`'}'\`、\`'['\`、\`']'\` 的字符串 \`s\`，判断字符串是否有效。

有效字符串需满足：左括号必须用相同类型的右括号闭合，且左括号必须以正确的顺序闭合，每个右括号都有对应的左括号。

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
    starterCode: 'function isValid(s) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: ['()'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['()[]{}'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['(]'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['([)]'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['{[]}'], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用栈：遇到左括号入栈，遇到右括号检查栈顶是否匹配。最后栈为空即有效。

\`\`\`js
function isValid(s) {
  const map = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') stack.push(c)
    else {
      if (stack.pop() !== map[c]) return false
    }
  }
  return stack.length === 0
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-022',
    no: '22',
    title: '最小栈',
    difficulty: '中等',
    tags: ['栈', '辅助栈'],
    desc: `设计一个支持 \`push\`、\`pop\`、\`top\` 操作，并能在常数时间内检索到最小元素的栈。

实现 \`MinStack\` 类。为方便测试，本题要求实现函数 \`runMinStack(operations, values)\`，它内部使用你实现的 \`MinStack\` 类按顺序执行操作，并返回每次操作的结果数组（构造函数和无返回值的操作返回 \`null\`）。

示例 1：
\`\`\`
输入：operations = ["MinStack","push","push","push","getMin","pop","top","getMin"]
     values     = [[],[-2],[0],[-3],[],[],[],[]]
输出：[null,null,null,null,-3,null,0,-2]
\`\`\`

示例 2：
\`\`\`
输入：operations = ["MinStack","push","getMin"]
     values     = [[],[1],[]]
输出：[null,null,1]
\`\`\`

示例 3：
\`\`\`
输入：operations = ["MinStack","push","push","push","getMin"]
     values     = [[],[5],[3],[7],[]]
输出：[null,null,null,null,3]
\`\`\``,
    functionName: 'runMinStack',
    starterCode: 'function runMinStack(operations, values) {\n  // 实现 MinStack 类，并按 operations 执行，返回每次操作的结果数组\n  return []\n}',
    setup: '',
    testCases: [
      { input: [['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], [[], [-2], [0], [-3], [], [], [], []]], expected: [null, null, null, null, -3, null, 0, -2], inputConvert: null, outputConvert: null },
      { input: [['MinStack', 'push', 'getMin'], [[], [1], []]], expected: [null, null, 1], inputConvert: null, outputConvert: null },
      { input: [['MinStack', 'push', 'push', 'push', 'getMin'], [[], [5], [3], [7], []]], expected: [null, null, null, null, 3], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

维护两个栈：数据栈 \`stack\` 与最小栈 \`minStack\`（同步记录当前最小值）。\`push\` 时若新值小于等于当前最小，则同步压入 \`minStack\`；\`pop\` 时若弹出的值等于 \`minStack\` 顶部，则一并弹出。

\`\`\`js
class MinStack {
  constructor() {
    this.stack = []
    this.minStack = []
  }
  push(x) {
    this.stack.push(x)
    if (this.minStack.length === 0 || x <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(x)
    }
  }
  pop() {
    const x = this.stack.pop()
    if (x === this.minStack[this.minStack.length - 1]) this.minStack.pop()
  }
  top() {
    return this.stack[this.stack.length - 1]
  }
  getMin() {
    return this.minStack[this.minStack.length - 1]
  }
}

function runMinStack(operations, values) {
  const res = []
  let stack = null
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i]
    const args = values[i]
    if (op === 'MinStack') {
      stack = new MinStack()
      res.push(null)
    } else {
      res.push(stack[op](...args))
    }
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(1)（每次操作）',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-023',
    no: '23',
    title: '每日温度',
    difficulty: '中等',
    tags: ['栈', '单调栈'],
    desc: `给定一个整数数组 \`temperatures\`，表示每天的温度。返回一个数组 \`answer\`，其中 \`answer[i]\` 是指对于第 \`i\` 天，下一个更高温度出现在几天后。如果此后没有更高的温度，则 \`answer[i] == 0\`。

示例 1：
\`\`\`
输入：temperatures = [73,74,75,71,69,72,76,73]
输出：[1,1,4,2,1,1,0,0]
\`\`\`

示例 2：
\`\`\`
输入：temperatures = [30,40,50,60]
输出：[1,1,1,0]
\`\`\`

示例 3：
\`\`\`
输入：temperatures = [30,60,90]
输出：[1,1,0]
\`\`\``,
    functionName: 'dailyTemperatures',
    starterCode: 'function dailyTemperatures(temperatures) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0], inputConvert: null, outputConvert: null },
      { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0], inputConvert: null, outputConvert: null },
      { input: [[30, 60, 90]], expected: [1, 1, 0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

单调递减栈存索引。遍历每天温度，若当前温度大于栈顶索引对应温度，则栈顶出栈，更新答案为 \`i - idx\`。所有未出栈的索引答案为 0。

\`\`\`js
function dailyTemperatures(temperatures) {
  const n = temperatures.length
  const ans = new Array(n).fill(0)
  const stack = []
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const idx = stack.pop()
      ans[idx] = i - idx
    }
    stack.push(i)
  }
  return ans
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },

  // ====================== 二分查找（3 道） ======================
  {
    id: 'algo-024',
    no: '24',
    title: '二分查找',
    difficulty: '简单',
    tags: ['数组', '二分'],
    desc: `给定一个 \`n\` 个元素有序的（升序）整型数组 \`nums\` 和一个目标值 \`target\`，写一个函数搜索 \`nums\` 中的 \`target\`，如果目标值存在返回下标，否则返回 \`-1\`。

示例 1：
\`\`\`
输入：nums = [-1,0,3,5,9,12], target = 9
输出：4
\`\`\`

示例 2：
\`\`\`
输入：nums = [-1,0,3,5,9,12], target = 2
输出：-1
\`\`\`

示例 3：
\`\`\`
输入：nums = [5], target = 5
输出：0
\`\`\``,
    functionName: 'search',
    starterCode: 'function search(nums, target) {\n  // 写你的代码\n  return -1\n}',
    setup: '',
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, inputConvert: null, outputConvert: null },
      { input: [[5], 5], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

标准二分：维护左右指针 \`l\`/\`r\`，取中点 \`mid\`，根据 \`nums[mid]\` 与 \`target\` 的关系收缩区间。

\`\`\`js
function search(nums, target) {
  let l = 0
  let r = nums.length - 1
  while (l <= r) {
    const mid = Math.floor((l + r) / 2)
    if (nums[mid] === target) return mid
    else if (nums[mid] < target) l = mid + 1
    else r = mid - 1
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-025',
    no: '25',
    title: '搜索插入位置',
    difficulty: '简单',
    tags: ['数组', '二分'],
    desc: `给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 \`O(log n)\` 的算法。

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
    starterCode: 'function searchInsert(nums, target) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[1, 3, 5, 6], 5], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[1, 3, 5, 6], 2], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[1, 3, 5, 6], 7], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[1, 3, 5, 6], 0], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

二分找第一个大于等于 \`target\` 的位置。循环结束时 \`l\` 即为插入位置。

\`\`\`js
function searchInsert(nums, target) {
  let l = 0
  let r = nums.length - 1
  while (l <= r) {
    const mid = Math.floor((l + r) / 2)
    if (nums[mid] === target) return mid
    else if (nums[mid] < target) l = mid + 1
    else r = mid - 1
  }
  return l
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-026',
    no: '26',
    title: '在排序数组中查找元素的第一个和最后一个位置',
    difficulty: '中等',
    tags: ['数组', '二分'],
    desc: `给你一个按照非递减顺序排列的整数数组 \`nums\`，和一个目标值 \`target\`。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 \`target\`，返回 \`[-1, -1]\`。必须设计并实现时间复杂度为 \`O(log n)\` 的算法。

示例 1：
\`\`\`
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
\`\`\`

示例 2：
\`\`\`
输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
\`\`\`

示例 3：
\`\`\`
输入：nums = [], target = 0
输出：[-1,-1]
\`\`\``,
    functionName: 'searchRange',
    starterCode: 'function searchRange(nums, target) {\n  // 写你的代码\n  return [-1, -1]\n}',
    setup: '',
    testCases: [
      { input: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4], inputConvert: null, outputConvert: null },
      { input: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1], inputConvert: null, outputConvert: null },
      { input: [[], 0], expected: [-1, -1], inputConvert: null, outputConvert: null },
      { input: [[1], 1], expected: [0, 0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

两次二分：一次找左边界（第一个等于 target），一次找右边界（最后一个等于 target）。找左边界时相等也收缩右侧，找右边界时相等收缩左侧。

\`\`\`js
function searchRange(nums, target) {
  const left = findBound(nums, target, true)
  if (left === -1) return [-1, -1]
  const right = findBound(nums, target, false)
  return [left, right]
}
function findBound(nums, target, isLeft) {
  let l = 0
  let r = nums.length - 1
  let res = -1
  while (l <= r) {
    const mid = Math.floor((l + r) / 2)
    if (nums[mid] === target) {
      res = mid
      if (isLeft) r = mid - 1
      else l = mid + 1
    } else if (nums[mid] < target) l = mid + 1
    else r = mid - 1
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },

  // ====================== 排序算法（5 道） ======================
  {
    id: 'algo-027',
    no: '27',
    title: '冒泡排序',
    difficulty: '简单',
    tags: ['排序'],
    desc: `实现冒泡排序算法。给定一个整数数组，返回升序排列后的数组。

冒泡排序通过相邻元素两两比较，把较大的元素逐步「冒泡」到数组末尾。

示例 1：
\`\`\`
输入：[5,2,8,1,9]
输出：[1,2,5,8,9]
\`\`\`

示例 2：
\`\`\`
输入：[3,1,4,1,5,9,2,6]
输出：[1,1,2,3,4,5,6,9]
\`\`\`

示例 3：
\`\`\`
输入：[]
输出：[]
\`\`\``,
    functionName: 'bubbleSort',
    starterCode: 'function bubbleSort(arr) {\n  // 写你的代码\n  return arr\n}',
    setup: '',
    testCases: [
      { input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9], inputConvert: null, outputConvert: null },
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 1, 2, 3, 4, 5, 6, 9], inputConvert: null, outputConvert: null },
      { input: [[]], expected: [], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

外层循环控制轮数 \`i\`，内层循环从 0 到 \`n-i-1\`，相邻比较交换。可加 \`swapped\` 标志提前退出。

\`\`\`js
function bubbleSort(arr) {
  const a = arr.slice()
  for (let i = 0; i < a.length; i++) {
    let swapped = false
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swapped = true
      }
    }
    if (!swapped) break
  }
  return a
}
\`\`\``,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-028',
    no: '28',
    title: '选择排序',
    difficulty: '简单',
    tags: ['排序'],
    desc: `实现选择排序算法。给定一个整数数组，返回升序排列后的数组。

选择排序每轮在未排序部分找到最小值，放到已排序部分的末尾。

示例 1：
\`\`\`
输入：[5,2,8,1,9]
输出：[1,2,5,8,9]
\`\`\`

示例 2：
\`\`\`
输入：[3,1,4,1,5,9,2,6]
输出：[1,1,2,3,4,5,6,9]
\`\`\`

示例 3：
\`\`\`
输入：[1]
输出：[1]
\`\`\``,
    functionName: 'selectionSort',
    starterCode: 'function selectionSort(arr) {\n  // 写你的代码\n  return arr\n}',
    setup: '',
    testCases: [
      { input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9], inputConvert: null, outputConvert: null },
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 1, 2, 3, 4, 5, 6, 9], inputConvert: null, outputConvert: null },
      { input: [[1]], expected: [1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

每轮从 \`i\` 到末尾找最小元素索引 \`minIdx\`，与 \`i\` 位置交换。共 \`n-1\` 轮。

\`\`\`js
function selectionSort(arr) {
  const a = arr.slice()
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j
    }
    ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
  }
  return a
}
\`\`\``,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-029',
    no: '29',
    title: '插入排序',
    difficulty: '简单',
    tags: ['排序'],
    desc: `实现插入排序算法。给定一个整数数组，返回升序排列后的数组。

插入排序将每个新元素插入到已排序部分的合适位置，类似整理扑克牌。

示例 1：
\`\`\`
输入：[5,2,8,1,9]
输出：[1,2,5,8,9]
\`\`\`

示例 2：
\`\`\`
输入：[3,1,4,1,5,9,2,6]
输出：[1,1,2,3,4,5,6,9]
\`\`\`

示例 3：
\`\`\`
输入：[2,1]
输出：[1,2]
\`\`\``,
    functionName: 'insertionSort',
    starterCode: 'function insertionSort(arr) {\n  // 写你的代码\n  return arr\n}',
    setup: '',
    testCases: [
      { input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9], inputConvert: null, outputConvert: null },
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 1, 2, 3, 4, 5, 6, 9], inputConvert: null, outputConvert: null },
      { input: [[2, 1]], expected: [1, 2], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

从 \`i = 1\` 开始，把 \`a[i]\` 暂存为 \`key\`，向前扫描已排序部分，把大于 \`key\` 的元素后移，最后把 \`key\` 放到空出的位置。

\`\`\`js
function insertionSort(arr) {
  const a = arr.slice()
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j]
      j--
    }
    a[j + 1] = key
  }
  return a
}
\`\`\``,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-030',
    no: '30',
    title: '快速排序',
    difficulty: '中等',
    tags: ['排序', '分治'],
    desc: `实现快速排序算法。给定一个整数数组，返回升序排列后的数组。

快速排序采用分治思想，选取一个基准元素，把数组分成小于基准和大于基准两部分，递归排序。

示例 1：
\`\`\`
输入：[5,2,8,1,9]
输出：[1,2,5,8,9]
\`\`\`

示例 2：
\`\`\`
输入：[3,1,4,1,5,9,2,6]
输出：[1,1,2,3,4,5,6,9]
\`\`\`

示例 3：
\`\`\`
输入：[3,2,1]
输出：[1,2,3]
\`\`\``,
    functionName: 'quickSort',
    starterCode: 'function quickSort(arr) {\n  // 写你的代码\n  return arr\n}',
    setup: '',
    testCases: [
      { input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9], inputConvert: null, outputConvert: null },
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 1, 2, 3, 4, 5, 6, 9], inputConvert: null, outputConvert: null },
      { input: [[3, 2, 1]], expected: [1, 2, 3], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

经典 Lomuto 分区：选最后一个元素为基准，用指针 \`i\` 维护小于基准的边界。递归处理左右子区间。平均 O(n log n)，最坏 O(n²)。

\`\`\`js
function quickSort(arr) {
  const a = arr.slice()
  function partition(l, r) {
    const pivot = a[r]
    let i = l
    for (let j = l; j < r; j++) {
      if (a[j] < pivot) {
        ;[a[i], a[j]] = [a[j], a[i]]
        i++
      }
    }
    ;[a[i], a[r]] = [a[r], a[i]]
    return i
  }
  function sort(l, r) {
    if (l >= r) return
    const p = partition(l, r)
    sort(l, p - 1)
    sort(p + 1, r)
  }
  sort(0, a.length - 1)
  return a
}
\`\`\``,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)'
  },
  {
    id: 'algo-031',
    no: '31',
    title: '归并排序',
    difficulty: '中等',
    tags: ['排序', '分治'],
    desc: `实现归并排序算法。给定一个整数数组，返回升序排列后的数组。

归并排序采用分治思想，递归地把数组对半拆分，再合并两个有序子数组。

示例 1：
\`\`\`
输入：[5,2,8,1,9]
输出：[1,2,5,8,9]
\`\`\`

示例 2：
\`\`\`
输入：[3,1,4,1,5,9,2,6]
输出：[1,1,2,3,4,5,6,9]
\`\`\`

示例 3：
\`\`\`
输入：[1]
输出：[1]
\`\`\``,
    functionName: 'mergeSort',
    starterCode: 'function mergeSort(arr) {\n  // 写你的代码\n  return arr\n}',
    setup: '',
    testCases: [
      { input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9], inputConvert: null, outputConvert: null },
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 1, 2, 3, 4, 5, 6, 9], inputConvert: null, outputConvert: null },
      { input: [[1]], expected: [1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

递归拆分到单元素，再合并两个有序子数组（双指针比较）。时间稳定 O(n log n)，需要 O(n) 额外空间。

\`\`\`js
function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice()
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  const res = []
  let i = 0
  let j = 0
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) res.push(left[i++])
    else res.push(right[j++])
  }
  while (i < left.length) res.push(left[i++])
  while (j < right.length) res.push(right[j++])
  return res
}
\`\`\``,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },

  // ====================== 动态规划（5 道） ======================
  {
    id: 'algo-032',
    no: '32',
    title: '爬楼梯',
    difficulty: '简单',
    tags: ['动态规划'],
    desc: `假设你正在爬楼梯。需要 \`n\` 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

示例 1：
\`\`\`
输入：n = 2
输出：2
解释：有两种方法（1+1 / 2）
\`\`\`

示例 2：
\`\`\`
输入：n = 3
输出：3
解释：1+1+1 / 1+2 / 2+1
\`\`\`

示例 3：
\`\`\`
输入：n = 5
输出：8
\`\`\``,
    functionName: 'climbStairs',
    starterCode: 'function climbStairs(n) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [2], expected: 2, inputConvert: null, outputConvert: null },
      { input: [3], expected: 3, inputConvert: null, outputConvert: null },
      { input: [5], expected: 8, inputConvert: null, outputConvert: null },
      { input: [1], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

斐波那契递推：\`f(n) = f(n-1) + f(n-2)\`。滚动两个变量即可，空间 O(1)。

\`\`\`js
function climbStairs(n) {
  if (n <= 2) return n
  let a = 1
  let b = 2
  for (let i = 3; i <= n; i++) {
    const c = a + b
    a = b
    b = c
  }
  return b
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-033',
    no: '33',
    title: '打家劫舍',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `你是一个专业的小偷，计划沿街偷窃房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你不触动警报装置的情况下，一夜之内能够偷窃到的最高金额。

示例 1：
\`\`\`
输入：[1,2,3,1]
输出：4
解释：偷第 1 间和第 3 间 = 1 + 3 = 4
\`\`\`

示例 2：
\`\`\`
输入：[2,7,9,3,1]
输出：12
解释：偷第 1、3、5 间 = 2 + 9 + 1 = 12
\`\`\`

示例 3：
\`\`\`
输入：[2,1,1,2]
输出：4
\`\`\``,
    functionName: 'rob',
    starterCode: 'function rob(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3, 1]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[2, 7, 9, 3, 1]], expected: 12, inputConvert: null, outputConvert: null },
      { input: [[2, 1, 1, 2]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

状态：\`dp[i]\` 表示前 i 间房能偷到的最高金额。转移：\`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`。用两个变量滚动优化到 O(1) 空间。

\`\`\`js
function rob(nums) {
  if (nums.length === 0) return 0
  if (nums.length === 1) return nums[0]
  let prev = 0
  let curr = 0
  for (const x of nums) {
    const next = Math.max(curr, prev + x)
    prev = curr
    curr = next
  }
  return curr
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-034',
    no: '34',
    title: '最大子数组和',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给你一个整数数组 \`nums\`，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

示例 1：
\`\`\`
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6
\`\`\`

示例 2：
\`\`\`
输入：nums = [1]
输出：1
\`\`\`

示例 3：
\`\`\`
输入：nums = [5,4,-1,7,8]
输出：23
\`\`\``,
    functionName: 'maxSubArray',
    starterCode: 'function maxSubArray(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[5, 4, -1, 7, 8]], expected: 23, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

Kadane 算法：维护以当前位置结尾的最大子数组和 \`cur\` 和全局最大 \`max\`。若 \`cur < 0\` 则丢弃，从当前元素重新开始。

\`\`\`js
function maxSubArray(nums) {
  let cur = nums[0]
  let max = nums[0]
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i])
    max = Math.max(max, cur)
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-035',
    no: '35',
    title: '不同路径',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `一个机器人位于一个 \`m x n\` 网格的左上角。机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角。

问总共有多少条不同的路径？

示例 1：
\`\`\`
输入：m = 3, n = 7
输出：28
\`\`\`

示例 2：
\`\`\`
输入：m = 3, n = 2
输出：3
\`\`\`

示例 3：
\`\`\`
输入：m = 1, n = 1
输出：1
\`\`\``,
    functionName: 'uniquePaths',
    starterCode: 'function uniquePaths(m, n) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [3, 7], expected: 28, inputConvert: null, outputConvert: null },
      { input: [3, 2], expected: 3, inputConvert: null, outputConvert: null },
      { input: [1, 1], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[i][j] = dp[i-1][j] + dp[i][j-1]\`，第一行第一列全为 1。可用一维数组压缩到 O(n) 空间。

\`\`\`js
function uniquePaths(m, n) {
  const dp = new Array(n).fill(1)
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1]
    }
  }
  return dp[n - 1]
}
\`\`\``,
    timeComplexity: 'O(m*n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-036',
    no: '36',
    title: '零钱兑换',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给你一个整数数组 \`coins\`，表示不同面额的硬币；以及一个整数 \`amount\`，表示总金额。

计算并返回可以凑成总金额所需的最少硬币个数。如果没有任何一种硬币组合能组成总金额，返回 \`-1\`。每种硬币的数量是无限的。

示例 1：
\`\`\`
输入：coins = [1,2,5], amount = 11
输出：3
解释：11 = 5 + 5 + 1
\`\`\`

示例 2：
\`\`\`
输入：coins = [2], amount = 3
输出：-1
\`\`\`

示例 3：
\`\`\`
输入：coins = [1], amount = 0
输出：0
\`\`\``,
    functionName: 'coinChange',
    starterCode: 'function coinChange(coins, amount) {\n  // 写你的代码\n  return -1\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[2], 3], expected: -1, inputConvert: null, outputConvert: null },
      { input: [[1], 0], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 5], 100], expected: 20, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

完全背包求最小值：\`dp[i]\` 表示金额 \`i\` 所需最少硬币数。初始 \`dp[0] = 0\`，其余 \`Infinity\`。转移：\`dp[i] = min(dp[i], dp[i - coin] + 1)\`。

\`\`\`js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i && dp[i - c] + 1 < dp[i]) {
        dp[i] = dp[i - c] + 1
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}
\`\`\``,
    timeComplexity: 'O(amount * coins.length)',
    spaceComplexity: 'O(amount)'
  },

  // ====================== 滑动窗口与双指针（3 道） ======================
  {
    id: 'algo-037',
    no: '37',
    title: '无重复字符的最长子串',
    difficulty: '中等',
    tags: ['滑动窗口', '哈希表'],
    desc: `给定一个字符串 \`s\`，请你找出其中不含有重复字符的最长子串的长度。

示例 1：
\`\`\`
输入：s = "abcabcbb"
输出：3
解释：无重复字符的最长子串是 "abc"，长度为 3
\`\`\`

示例 2：
\`\`\`
输入：s = "bbbbb"
输出：1
\`\`\`

示例 3：
\`\`\`
输入：s = "pwwkew"
输出：3
解释：最长子串是 "wke"，长度为 3
\`\`\``,
    functionName: 'lengthOfLongestSubstring',
    starterCode: 'function lengthOfLongestSubstring(s) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: ['abcabcbb'], expected: 3, inputConvert: null, outputConvert: null },
      { input: ['bbbbb'], expected: 1, inputConvert: null, outputConvert: null },
      { input: ['pwwkew'], expected: 3, inputConvert: null, outputConvert: null },
      { input: [''], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

滑动窗口 + Set/Map。右指针扩展，遇到重复字符时左指针收缩，直到窗口内无重复。维护最大窗口长度。

\`\`\`js
function lengthOfLongestSubstring(s) {
  const set = new Set()
  let left = 0
  let max = 0
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left])
      left++
    }
    set.add(s[right])
    max = Math.max(max, right - left + 1)
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, m))'
  },
  {
    id: 'algo-038',
    no: '38',
    title: '盛最多水的容器',
    difficulty: '中等',
    tags: ['双指针'],
    desc: `给定一个长度为 \`n\` 的整数数组 \`height\`，有 \`n\` 条垂线，第 \`i\` 条线的两个端点是 \`(i, 0)\` 和 \`(i, height[i])\`。

找出其中的两条线，使得它们与 \`x\` 轴共同构成的容器可以容纳最多的水。返回容器可以储存的最大水量。

示例 1：
\`\`\`
输入：height = [1,8,6,2,5,4,8,3,7]
输出：49
\`\`\`

示例 2：
\`\`\`
输入：height = [1,1]
输出：1
\`\`\`

示例 3：
\`\`\`
输入：height = [4,3,2,1,4]
输出：16
\`\`\``,
    functionName: 'maxArea',
    starterCode: 'function maxArea(height) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, inputConvert: null, outputConvert: null },
      { input: [[1, 1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[4, 3, 2, 1, 4]], expected: 16, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

双指针从两端向中间收缩：面积由较短边和距离决定。每次移动较矮的一侧，因为移动较高的一侧不可能让面积变大。过程中记录最大值。

\`\`\`js
function maxArea(height) {
  let l = 0
  let r = height.length - 1
  let max = 0
  while (l < r) {
    const h = Math.min(height[l], height[r])
    max = Math.max(max, h * (r - l))
    if (height[l] < height[r]) l++
    else r--
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-039',
    no: '39',
    title: '除自身以外数组的乘积',
    difficulty: '中等',
    tags: ['前缀和', '数组'],
    desc: `给你一个整数数组 \`nums\`，返回数组 \`answer\`，其中 \`answer[i]\` 等于 \`nums\` 中除 \`nums[i]\` 之外其余各元素的乘积。

必须在不使用除法且在 O(n) 时间复杂度内完成此题目。

示例 1：
\`\`\`
输入：nums = [1,2,3,4]
输出：[24,12,8,6]
\`\`\`

示例 2：
\`\`\`
输入：nums = [-1,1,0,-3,3]
输出：[0,0,9,0,0]
\`\`\`

示例 3：
\`\`\`
输入：nums = [2,3]
输出：[3,2]
\`\`\``,
    functionName: 'productExceptSelf',
    starterCode: 'function productExceptSelf(nums) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], inputConvert: null, outputConvert: null },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], inputConvert: null, outputConvert: null },
      { input: [[2, 3]], expected: [3, 2], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

前缀后缀乘积：先从左到右算前缀乘积存入结果数组，再从右到左用一个变量累乘后缀乘积并更新结果。空间 O(1)（不计输出数组）。

\`\`\`js
function productExceptSelf(nums) {
  const n = nums.length
  const res = new Array(n).fill(1)
  let left = 1
  for (let i = 0; i < n; i++) {
    res[i] = left
    left *= nums[i]
  }
  let right = 1
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= right
    right *= nums[i]
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // ====================== 链表（3 道） ======================
  {
    id: 'algo-040',
    no: '40',
    title: '反转链表',
    difficulty: '简单',
    tags: ['链表'],
    desc: `给你单链表的头节点 \`head\`，请你反转链表，并返回反转后的链表。

示例 1：
\`\`\`
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
\`\`\`

示例 2：
\`\`\`
输入：head = [1,2]
输出：[2,1]
\`\`\`

示例 3：
\`\`\`
输入：head = []
输出：[]
\`\`\``,
    functionName: 'reverseList',
    starterCode: 'function reverseList(head) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], inputConvert: ['arrayToList'], outputConvert: 'listToArray' },
      { input: [[1, 2]], expected: [2, 1], inputConvert: ['arrayToList'], outputConvert: 'listToArray' },
      { input: [[]], expected: [], inputConvert: ['arrayToList'], outputConvert: 'listToArray' }
    ],
    solution: `## 思路

迭代：维护 \`prev\` / \`curr\` 两个指针，每次把 \`curr.next\` 暂存，再让 \`curr.next = prev\`，然后整体后移。也可以递归。

\`\`\`js
function reverseList(head) {
  let prev = null
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-041',
    no: '41',
    title: '合并两个有序链表',
    difficulty: '简单',
    tags: ['链表', '递归'],
    desc: `将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

示例 1：
\`\`\`
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
\`\`\`

示例 2：
\`\`\`
输入：l1 = [], l2 = []
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：l1 = [], l2 = [0]
输出：[0]
\`\`\``,
    functionName: 'mergeTwoLists',
    starterCode: 'function mergeTwoLists(l1, l2) {\n  // 写你的代码\n  return l1\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4], inputConvert: ['arrayToList', 'arrayToList'], outputConvert: 'listToArray' },
      { input: [[], []], expected: [], inputConvert: ['arrayToList', 'arrayToList'], outputConvert: 'listToArray' },
      { input: [[], [0]], expected: [0], inputConvert: ['arrayToList', 'arrayToList'], outputConvert: 'listToArray' }
    ],
    solution: `## 思路

哑节点 + 双指针迭代：每次把较小节点接到结果链表末尾，最后把剩余链表直接接上。

\`\`\`js
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(-1)
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
\`\`\``,
    timeComplexity: 'O(n+m)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-042',
    no: '42',
    title: '环形链表',
    difficulty: '简单',
    tags: ['链表', '快慢指针'],
    desc: `给你一个链表的头节点 \`head\`，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 \`next\` 指针再次到达该节点，则链表中存在环。参数 \`pos\` 表示链表尾连接到的节点索引（-1 表示无环，仅用于构造测试用例，不作为参数传递）。

示例 1：
\`\`\`
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，尾部连接到第二个节点
\`\`\`

示例 2：
\`\`\`
输入：head = [1,2], pos = 0
输出：true
\`\`\`

示例 3：
\`\`\`
输入：head = [1], pos = -1
输出：false
\`\`\``,
    functionName: 'hasCycle',
    starterCode: 'function hasCycle(head) {\n  // 写你的代码\n  return false\n}',
    setup: LINKED_LIST_SETUP + `
function arrayToListWithCycle(arr, pos) {
  if (!arr || arr.length === 0) return null
  var head = new ListNode(arr[0])
  var cur = head
  var nodes = [cur]
  for (var i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i])
    cur = cur.next
    nodes.push(cur)
  }
  if (pos >= 0 && pos < nodes.length) {
    cur.next = nodes[pos]
  }
  return head
}`,
    testCases: [
      { input: [[3, 2, 0, -4], 1], expected: true, inputConvert: ['arrayToListWithCycle'], outputConvert: null },
      { input: [[1, 2], 0], expected: true, inputConvert: ['arrayToListWithCycle'], outputConvert: null },
      { input: [[1], -1], expected: false, inputConvert: ['arrayToListWithCycle'], outputConvert: null }
    ],
    solution: `## 思路

快慢指针：慢指针每次走一步，快指针每次走两步。若有环，快指针一定能追上慢指针；若快指针到达 \`null\`，则无环。空间 O(1)。

\`\`\`js
function hasCycle(head) {
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // ====================== 树（3 道） ======================
  {
    id: 'algo-043',
    no: '43',
    title: '二叉树的最大深度',
    difficulty: '简单',
    tags: ['树', '递归'],
    desc: `给定一个二叉树 \`root\`，返回其最大深度。

二叉树的最大深度是从根节点到最远叶子节点的最长路径上的节点数。

示例 1：
\`\`\`
输入：root = [3,9,20,null,null,15,7]
输出：3
\`\`\`

示例 2：
\`\`\`
输入：root = [1,null,2]
输出：2
\`\`\`

示例 3：
\`\`\`
输入：root = []
输出：0
\`\`\``,
    functionName: 'maxDepth',
    starterCode: 'function maxDepth(root) {\n  // 写你的代码\n  return 0\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: 3, inputConvert: ['arrayToTree'], outputConvert: null },
      { input: [[1, null, 2]], expected: 2, inputConvert: ['arrayToTree'], outputConvert: null },
      { input: [[]], expected: 0, inputConvert: ['arrayToTree'], outputConvert: null }
    ],
    solution: `## 思路

递归：\`maxDepth(root) = 1 + max(maxDepth(left), maxDepth(right))\`，空节点返回 0。也可以用 BFS 层序遍历计数层数。

\`\`\`js
function maxDepth(root) {
  if (!root) return 0
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-044',
    no: '44',
    title: '翻转二叉树',
    difficulty: '简单',
    tags: ['树', '递归'],
    desc: `给你一棵二叉树的根节点 \`root\`，翻转这棵二叉树，并返回其根节点。翻转即交换每个节点的左右子树。

示例 1：
\`\`\`
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
\`\`\`

示例 2：
\`\`\`
输入：root = [2,1,3]
输出：[2,3,1]
\`\`\`

示例 3：
\`\`\`
输入：root = []
输出：[]
\`\`\``,
    functionName: 'invertTree',
    starterCode: 'function invertTree(root) {\n  // 写你的代码\n  return root\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1], inputConvert: ['arrayToTree'], outputConvert: 'treeToArray' },
      { input: [[2, 1, 3]], expected: [2, 3, 1], inputConvert: ['arrayToTree'], outputConvert: 'treeToArray' },
      { input: [[]], expected: [], inputConvert: ['arrayToTree'], outputConvert: 'treeToArray' }
    ],
    solution: `## 思路

递归：对每个节点交换左右子树，再递归翻转左右子树。返回根节点。

\`\`\`js
function invertTree(root) {
  if (!root) return null
  const left = invertTree(root.left)
  const right = invertTree(root.right)
  root.left = right
  root.right = left
  return root
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-045',
    no: '45',
    title: '对称二叉树',
    difficulty: '简单',
    tags: ['树', '递归'],
    desc: `给你一个二叉树的根节点 \`root\`，检查它是否轴对称。

示例 1：
\`\`\`
输入：root = [1,2,2,3,4,4,3]
输出：true
\`\`\`

示例 2：
\`\`\`
输入：root = [1,2,2,null,3,null,3]
输出：false
\`\`\`

示例 3：
\`\`\`
输入：root = []
输出：true
\`\`\``,
    functionName: 'isSymmetric',
    starterCode: 'function isSymmetric(root) {\n  // 写你的代码\n  return false\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[1, 2, 2, 3, 4, 4, 3]], expected: true, inputConvert: ['arrayToTree'], outputConvert: null },
      { input: [[1, 2, 2, null, 3, null, 3]], expected: false, inputConvert: ['arrayToTree'], outputConvert: null },
      { input: [[]], expected: true, inputConvert: ['arrayToTree'], outputConvert: null }
    ],
    solution: `## 思路

转换为判断两棵子树是否镜像相等：左子树的左子树等于右子树的右子树，左子树的右子树等于右子树的左子树，且当前节点值相等。

\`\`\`js
function isSymmetric(root) {
  if (!root) return true
  function check(a, b) {
    if (!a && !b) return true
    if (!a || !b) return false
    return a.val === b.val && check(a.left, b.right) && check(a.right, b.left)
  }
  return check(root.left, root.right)
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  }
]

// 合并 4 个片段共 200 题
export const algorithmProblems = [
  ...baseProblems,        // 原 45 道（algo-001 ~ algo-045）
  ...part1Problems,       // 数组/字符串/数学（algo-046 ~ algo-091，46 道）
  ...part2Problems,       // 栈队列/二分/排序（algo-092 ~ algo-124，33 道）
  ...part3Problems,       // DP/滑动窗口/回溯（algo-125 ~ algo-164，40 道）
  ...part4Problems       // 链表/树/图（algo-165 ~ algo-200，36 道）
]

// 按难度统计
export const algorithmStats = {
  total: algorithmProblems.length,
  easy: algorithmProblems.filter(p => p.difficulty === '简单').length,
  medium: algorithmProblems.filter(p => p.difficulty === '中等').length,
  hard: algorithmProblems.filter(p => p.difficulty === '困难').length
}
