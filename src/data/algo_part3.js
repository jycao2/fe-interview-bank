// 算法题库片段 3：动态规划 / 滑动窗口与双指针 / 回溯算法（共 40 题，ID algo-125 到 algo-164）
export const part3Problems = [
  // ====================== 动态规划（19 道，id 125-143） ======================
  {
    id: 'algo-125',
    no: '125',
    title: '爬楼梯',
    difficulty: '简单',
    tags: ['动态规划'],
    desc: `假设你正在爬楼梯。需要 \`n\` 阶你才能到达楼顶。每次你可以爬 \`1\` 或 \`2\` 个台阶。你有多少种不同的方法可以爬到楼顶呢？

示例 1：
\`\`\`
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶：1 阶 + 1 阶，或 2 阶
\`\`\`

示例 2：
\`\`\`
输入：n = 3
输出：3
\`\`\`

示例 3：
\`\`\`
输入：n = 1
输出：1
\`\`\``,
    functionName: 'climbStairs',
    starterCode: 'function climbStairs(n) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [2], expected: 2, inputConvert: null, outputConvert: null },
      { input: [3], expected: 3, inputConvert: null, outputConvert: null },
      { input: [1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [5], expected: 8, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

到达第 \`n\` 阶的方法 = 到第 \`n-1\` 阶的方法 + 到第 \`n-2\` 阶的方法，即斐波那契数列。用两个滚动变量记录前两步的值，迭代到 \`n\` 即可，空间优化到 O(1)。

\`\`\`js
function climbStairs(n) {
  if (n <= 2) return n
  let a = 1, b = 2
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-126',
    no: '126',
    title: '买卖股票的最佳时机',
    difficulty: '简单',
    tags: ['动态规划'],
    desc: `给定一个数组 \`prices\`，它的第 \`i\` 个元素 \`prices[i]\` 表示一支给定股票第 \`i\` 天的价格。你只能选择某一天买入并在未来的某一天卖出。设计算法计算你能获取的最大利润。返回最大利润，若不能获利返回 0。

示例 1：
\`\`\`
输入：prices = [7,1,5,3,6,4]
输出：5
解释：在第 2 天买入（price = 1），第 5 天卖出（price = 6），利润 = 6 - 1 = 5
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
      { input: [[1, 2]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[2, 4, 1]], expected: 2, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

一次遍历：维护历史最低价 \`minPrice\` 与当前最大利润 \`maxProfit\`。对每个价格 \`p\`，先用它减去历史最低价更新利润，再更新历史最低价。这种「在最低点买入、之后任意高点卖出」的贪心等价于 DP。

\`\`\`js
function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0
  for (const p of prices) {
    minPrice = Math.min(minPrice, p)
    maxProfit = Math.max(maxProfit, p - minPrice)
  }
  return maxProfit
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-127',
    no: '127',
    title: '最大子数组和',
    difficulty: '简单',
    tags: ['动态规划'],
    desc: `给你一个整数数组 \`nums\`，请你找出一个具有最大和的连续子数组（子数组至少包含一个元素），返回其最大和。

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
输入：nums = [-1]
输出：-1
\`\`\``,
    functionName: 'maxSubArray',
    starterCode: 'function maxSubArray(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[-1]], expected: -1, inputConvert: null, outputConvert: null },
      { input: [[5, 4, -1, 7, 8]], expected: 23, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

Kadane 算法：\`cur\` 表示以当前位置结尾的最大子数组和，\`max\` 记录全局最大。对每个 \`nums[i]\`，要么把它接在前一段后面 (\`cur + nums[i]\`)，要么从它重新开始 (\`nums[i]\`)，取较大值。

\`\`\`js
function maxSubArray(nums) {
  let cur = nums[0], max = nums[0]
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
    id: 'algo-128',
    no: '128',
    title: '打家劫舍',
    difficulty: '简单',
    tags: ['动态规划'],
    desc: `你是一个专业的小偷，计划沿街偷窃。沿街排列的房屋，每间房内都藏有一定的现金。相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被偷窃，系统会自动报警。给定一个代表每个房屋存放金额的非负整数数组 \`nums\`，计算不触动警报装置的情况下一夜之内能偷窃到的最高金额。

示例 1：
\`\`\`
输入：nums = [1,2,3,1]
输出：4
解释：偷窃第 1 间和第 3 间房屋，金额 = 1 + 3 = 4
\`\`\`

示例 2：
\`\`\`
输入：nums = [2,7,9,3,1]
输出：12
\`\`\`

示例 3：
\`\`\`
输入：nums = [2,1,1,2]
输出：4
\`\`\``,
    functionName: 'rob',
    starterCode: 'function rob(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 3, 1]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[2, 7, 9, 3, 1]], expected: 12, inputConvert: null, outputConvert: null },
      { input: [[2, 1, 1, 2]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[5]], expected: 5, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

对第 \`i\` 间房：偷，则金额为 \`prev2 + nums[i]\`（前两间的最优）；不偷，则金额为 \`prev1\`（前一间的最优）。两者取较大值。用两个滚动变量记录前两步的最优解。

\`\`\`js
function rob(nums) {
  if (nums.length === 0) return 0
  if (nums.length === 1) return nums[0]
  let prev2 = nums[0], prev1 = Math.max(nums[0], nums[1])
  for (let i = 2; i < nums.length; i++) {
    [prev2, prev1] = [prev1, Math.max(prev1, prev2 + nums[i])]
  }
  return prev1
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-129',
    no: '129',
    title: '不同路径',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `一个机器人位于 \`m x n\` 网格的左上角，每次只能向下或者向右移动一步。机器人试图达到网格的右下角。问共有多少条不同的路径？

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
      { input: [1, 1], expected: 1, inputConvert: null, outputConvert: null },
      { input: [3, 3], expected: 6, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[j]\` 表示当前行第 \`j\` 列的路径数，转移为 \`dp[j] = dp[j]（从上方来）+ dp[j-1]（从左方来）\`。第一行/第一列初始化为 1，逐行累加即可，空间压缩为一维数组。

\`\`\`js
function uniquePaths(m, n) {
  const dp = Array(n).fill(1)
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1]
    }
  }
  return dp[n - 1]
}
\`\`\``,
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-130',
    no: '130',
    title: '最小路径和',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给定一个包含非负整数的 \`m x n\` 网格 \`grid\`，请找出一条从左上角到右下角的路径，使得路径上的数字总和最小。每次只能向下或向右移动一步。

示例 1：
\`\`\`
输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
输出：7
解释：路径 1→3→1→1→1 总和最小，为 7
\`\`\`

示例 2：
\`\`\`
输入：grid = [[1,2,3],[4,5,6]]
输出：12
\`\`\`

示例 3：
\`\`\`
输入：grid = [[1]]
输出：1
\`\`\``,
    functionName: 'minPathSum',
    starterCode: 'function minPathSum(grid) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7, inputConvert: null, outputConvert: null },
      { input: [[[1, 2, 3], [4, 5, 6]]], expected: 12, inputConvert: null, outputConvert: null },
      { input: [[[1]]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[[1, 2], [1, 1]]], expected: 3, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

原地 DP（或一维滚动）：\`dp[j]\` 表示到达当前行第 \`j\` 列的最小和。第一行只从左累加，第一列只从上累加，其余位置取上方和左方的较小值加上当前格子。

\`\`\`js
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length
  const dp = Array(n).fill(0)
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) dp[j] = grid[0][0]
      else if (i === 0) dp[j] = dp[j - 1] + grid[i][j]
      else if (j === 0) dp[j] = dp[j] + grid[i][j]
      else dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j]
    }
  }
  return dp[n - 1]
}
\`\`\``,
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-131',
    no: '131',
    title: '零钱兑换',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给你一个整数数组 \`coins\` 表示不同面额的硬币，以及一个整数 \`amount\` 表示总金额。计算并返回可以凑成总金额所需的最少硬币个数。如果没有任何一种硬币组合能组成该金额，返回 \`-1\`。每种硬币数量不限。

示例 1：
\`\`\`
输入：coins = [1,2,5], amount = 11
输出：3
解释：11 = 5 + 5 + 1，共用 3 枚
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

完全背包 DP：\`dp[i]\` 表示凑成金额 \`i\` 的最少硬币数。初始化 \`dp[0]=0\`，其余为正无穷。对每个金额 \`i\`，枚举每枚硬币 \`c\`，若 \`i >= c\` 则 \`dp[i] = min(dp[i], dp[i-c]+1)\`。最后看 \`dp[amount]\` 是否还是正无穷。

\`\`\`js
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1)
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}
\`\`\``,
    timeComplexity: 'O(amount * n)',
    spaceComplexity: 'O(amount)'
  },
  {
    id: 'algo-132',
    no: '132',
    title: '最长递增子序列',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给你一个整数数组 \`nums\`，找到其中最长严格递增子序列的长度。子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。

示例 1：
\`\`\`
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，长度为 4
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,1,0,3,2,3]
输出：4
\`\`\`

示例 3：
\`\`\`
输入：nums = [7,7,7,7]
输出：1
\`\`\``,
    functionName: 'lengthOfLIS',
    starterCode: 'function lengthOfLIS(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[0, 1, 0, 3, 2, 3]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[7, 7, 7, 7]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4, 5]], expected: 5, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[i]\` 表示以 \`nums[i]\` 结尾的最长递增子序列长度。对每个 \`i\`，枚举 \`j < i\`，若 \`nums[j] < nums[i]\` 则 \`dp[i] = max(dp[i], dp[j]+1)\`。答案为所有 \`dp[i]\` 的最大值。

\`\`\`js
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0
  const dp = Array(nums.length).fill(1)
  let max = 1
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1)
    }
    max = Math.max(max, dp[i])
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-133',
    no: '133',
    title: '最长公共子序列',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给定两个字符串 \`text1\` 和 \`text2\`，返回这两个字符串的最长公共子序列的长度。子序列是在不改变字符相对顺序的情况下删除某些（或不去掉任何）字符后形成的新字符串。

示例 1：
\`\`\`
输入：text1 = "abcde", text2 = "ace"
输出：3
解释：最长公共子序列是 "ace"
\`\`\`

示例 2：
\`\`\`
输入：text1 = "abc", text2 = "abc"
输出：3
\`\`\`

示例 3：
\`\`\`
输入：text1 = "abc", text2 = "def"
输出：0
\`\`\``,
    functionName: 'longestCommonSubsequence',
    starterCode: 'function longestCommonSubsequence(text1, text2) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: ['abcde', 'ace'], expected: 3, inputConvert: null, outputConvert: null },
      { input: ['abc', 'abc'], expected: 3, inputConvert: null, outputConvert: null },
      { input: ['abc', 'def'], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['bl', 'yby'], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[j]\` 表示 \`text1\` 前 \`i\` 个字符与 \`text2\` 前 \`j\` 个字符的 LCS 长度。若 \`text1[i-1] === text2[j-1]\`，则 \`dp = prev + 1\`（左上对角线值 +1）；否则取上方和左方的较大值。用一维数组 + 一个 \`prev\` 变量保存左上角值。

\`\`\`js
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length
  const dp = Array(n + 1).fill(0)
  for (let i = 1; i <= m; i++) {
    let prev = 0
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      if (text1[i - 1] === text2[j - 1]) dp[j] = prev + 1
      else dp[j] = Math.max(dp[j], dp[j - 1])
      prev = temp
    }
  }
  return dp[n]
}
\`\`\``,
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-134',
    no: '134',
    title: '解码方法',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `一条包含字母 \`A-Z\` 的消息通过以下映射编码为数字串：\`'A' -> 1\`、\`'B' -> 2\`、…、\`'Z' -> 26\`。给定一个只含数字的非空字符串 \`s\`，请计算解码方法的总数。

示例 1：
\`\`\`
输入：s = "12"
输出：2
解释：可以解码为 "AB"（1 2）或 "L"（12）
\`\`\`

示例 2：
\`\`\`
输入：s = "226"
输出：3
\`\`\`

示例 3：
\`\`\`
输入：s = "0"
输出：0
\`\`\``,
    functionName: 'numDecodings',
    starterCode: 'function numDecodings(s) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: ['12'], expected: 2, inputConvert: null, outputConvert: null },
      { input: ['226'], expected: 3, inputConvert: null, outputConvert: null },
      { input: ['0'], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['06'], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['11106'], expected: 2, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[i]\` 表示前 \`i\` 个字符的解码数。若当前一位字符在 1~9 之间，可单独解码，累加 \`dp[i-1]\`；若当前两位字符在 10~26 之间，可组合解码，累加 \`dp[i-2]\`。以 0 开头直接返回 0。

\`\`\`js
function numDecodings(s) {
  const n = s.length
  if (n === 0 || s[0] === '0') return 0
  const dp = Array(n + 1).fill(0)
  dp[0] = 1
  dp[1] = 1
  for (let i = 2; i <= n; i++) {
    const one = parseInt(s.slice(i - 1, i))
    const two = parseInt(s.slice(i - 2, i))
    if (one >= 1 && one <= 9) dp[i] += dp[i - 1]
    if (two >= 10 && two <= 26) dp[i] += dp[i - 2]
  }
  return dp[n]
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-135',
    no: '135',
    title: '单词拆分',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给你一个字符串 \`s\` 和一个字符串列表 \`wordDict\` 作为字典。请你判断是否可以利用字典中出现的单词拼接出 \`s\`。字典中的单词可以重复使用。

示例 1：
\`\`\`
输入：s = "leetcode", wordDict = ["leet","code"]
输出：true
\`\`\`

示例 2：
\`\`\`
输入：s = "applepenapple", wordDict = ["apple","pen"]
输出：true
\`\`\`

示例 3：
\`\`\`
输入：s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
输出：false
\`\`\``,
    functionName: 'wordBreak',
    starterCode: 'function wordBreak(s, wordDict) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: ['leetcode', ['leet', 'code']], expected: true, inputConvert: null, outputConvert: null },
      { input: ['applepenapple', ['apple', 'pen']], expected: true, inputConvert: null, outputConvert: null },
      { input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false, inputConvert: null, outputConvert: null },
      { input: ['', ['a']], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[i]\` 表示 \`s[0..i-1]\` 能否被拆分。\`dp[0]=true\`（空串）。对每个结束位置 \`i\`，枚举起始位置 \`j\`，若 \`dp[j]\` 为真且 \`s.slice(j,i)\` 在字典中，则 \`dp[i]=true\`。用 Set 加速字典查询。

\`\`\`js
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict)
  const n = s.length
  const dp = Array(n + 1).fill(false)
  dp[0] = true
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j, i))) {
        dp[i] = true
        break
      }
    }
  }
  return dp[n]
}
\`\`\``,
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-136',
    no: '136',
    title: '最大正方形',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `在一个由 \`'0'\` 和 \`'1'\` 组成的二维矩阵内，找到只包含 \`'1'\` 的最大正方形，并返回其面积。

示例 1：
\`\`\`
输入：matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
输出：4
\`\`\`

示例 2：
\`\`\`
输入：matrix = [["0"]]
输出：0
\`\`\`

示例 3：
\`\`\`
输入：matrix = [["1"]]
输出：1
\`\`\``,
    functionName: 'maximalSquare',
    starterCode: 'function maximalSquare(matrix) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[['0']]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[['1']]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[['0', '0'], ['0', '0']]], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[j]\` 表示以当前位置为右下角的最大正方形边长。若 \`matrix[i-1][j-1]==='1'\`，则 \`dp[j] = min(dp[j], dp[j-1], prev) + 1\`（取上、左、左上三者的最小值 +1）；否则置 0。\`prev\` 保存上一行左上角的旧值。最终答案为最大边长的平方。

\`\`\`js
function maximalSquare(matrix) {
  if (matrix.length === 0) return 0
  const m = matrix.length, n = matrix[0].length
  const dp = Array(n + 1).fill(0)
  let maxLen = 0, prev = 0
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      if (matrix[i - 1][j - 1] === '1') {
        dp[j] = Math.min(dp[j], dp[j - 1], prev) + 1
        maxLen = Math.max(maxLen, dp[j])
      } else {
        dp[j] = 0
      }
      prev = temp
    }
  }
  return maxLen * maxLen
}
\`\`\``,
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-137',
    no: '137',
    title: '最长回文子串',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给你一个字符串 \`s\`，找到 \`s\` 中最长的回文子串。

示例 1：
\`\`\`
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案，本题返回最先找到的
\`\`\`

示例 2：
\`\`\`
输入：s = "cbbd"
输出："bb"
\`\`\`

示例 3：
\`\`\`
输入：s = "a"
输出："a"
\`\`\``,
    functionName: 'longestPalindrome',
    starterCode: 'function longestPalindrome(s) {\n  // 写你的代码\n  return ""\n}',
    setup: '',
    testCases: [
      { input: ['babad'], expected: 'bab', inputConvert: null, outputConvert: null },
      { input: ['cbbd'], expected: 'bb', inputConvert: null, outputConvert: null },
      { input: ['a'], expected: 'a', inputConvert: null, outputConvert: null },
      { input: ['ac'], expected: 'a', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

中心扩展法：枚举每个位置作为回文中心，分别尝试奇数长度（单字符中心）和偶数长度（双字符中心）向外扩展。用 \`start\` 和 \`maxLen\` 记录最长回文的起点与长度。只在严格更长时更新，保证返回最先找到的解。

\`\`\`js
function longestPalindrome(s) {
  if (s.length < 2) return s
  let start = 0, maxLen = 1
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > maxLen) {
        start = l
        maxLen = r - l + 1
      }
      l--
      r++
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i)
    expand(i, i + 1)
  }
  return s.slice(start, start + maxLen)
}
\`\`\``,
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-138',
    no: '138',
    title: '编辑距离',
    difficulty: '中等',
    tags: ['动态规划'],
    desc: `给你两个单词 \`word1\` 和 \`word2\`，请返回将 \`word1\` 转换成 \`word2\` 所使用的最少操作数。可对一个单词进行三种操作：插入一个字符、删除一个字符、替换一个字符。

示例 1：
\`\`\`
输入：word1 = "horse", word2 = "ros"
输出：3
解释：horse -> rorse -> rose -> ros
\`\`\`

示例 2：
\`\`\`
输入：word1 = "intention", word2 = "execution"
输出：5
\`\`\`

示例 3：
\`\`\`
输入：word1 = "", word2 = ""
输出：0
\`\`\``,
    functionName: 'minDistance',
    starterCode: 'function minDistance(word1, word2) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: ['horse', 'ros'], expected: 3, inputConvert: null, outputConvert: null },
      { input: ['intention', 'execution'], expected: 5, inputConvert: null, outputConvert: null },
      { input: ['', ''], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['a', 'b'], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[j]\` 表示 \`word1\` 前 \`i\` 个字符转换到 \`word2\` 前 \`j\` 个字符的最少操作数。若 \`word1[i-1]===word2[j-1]\` 则 \`dp[j]=prev\`（左上角）；否则 \`dp[j]=min(prev, dp[j], dp[j-1])+1\` 分别对应替换、删除、插入。用一维数组 + \`prev\` 保存左上值。

\`\`\`js
function minDistance(word1, word2) {
  const m = word1.length, n = word2.length
  const dp = Array(n + 1).fill(0).map((_, j) => j)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      if (word1[i - 1] === word2[j - 1]) dp[j] = prev
      else dp[j] = Math.min(prev, dp[j], dp[j - 1]) + 1
      prev = temp
    }
  }
  return dp[n]
}
\`\`\``,
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-139',
    no: '139',
    title: '最长有效括号',
    difficulty: '困难',
    tags: ['动态规划'],
    desc: `给你一个只包含 \`'('\` 和 \`')'\` 的字符串 \`s\`，找出最长的格式正确的括号子串的长度。

示例 1：
\`\`\`
输入：s = "(()"
输出：2
\`\`\`

示例 2：
\`\`\`
输入：s = ")()())"
输出：4
\`\`\`

示例 3：
\`\`\`
输入：s = ""
输出：0
\`\`\``,
    functionName: 'longestValidParentheses',
    starterCode: 'function longestValidParentheses(s) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: ['(()'], expected: 2, inputConvert: null, outputConvert: null },
      { input: [')()())'], expected: 4, inputConvert: null, outputConvert: null },
      { input: [''], expected: 0, inputConvert: null, outputConvert: null },
      { input: ['()(()'], expected: 2, inputConvert: null, outputConvert: null },
      { input: ['()()'], expected: 4, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

DP：\`dp[i]\` 表示以 \`s[i]\` 结尾的最长有效括号长度。当 \`s[i]=')'\`：若 \`s[i-1]='('\` 则 \`dp[i]=dp[i-2]+2\`；若 \`s[i-1]=')'\` 且 \`s[i-dp[i-1]-1]='('\` 则 \`dp[i]=dp[i-1]+2+dp[i-dp[i-1]-2]\`，把内层有效段和它前面相邻的有效段拼接起来。取所有 \`dp[i]\` 的最大值。

\`\`\`js
function longestValidParentheses(s) {
  const n = s.length
  if (n === 0) return 0
  const dp = Array(n).fill(0)
  let max = 0
  for (let i = 1; i < n; i++) {
    if (s[i] === ')') {
      if (s[i - 1] === '(') {
        dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2
      } else if (i - dp[i - 1] - 1 >= 0 && s[i - dp[i - 1] - 1] === '(') {
        const before = i - dp[i - 1] - 2 >= 0 ? dp[i - dp[i - 1] - 2] : 0
        dp[i] = dp[i - 1] + 2 + before
      }
      max = Math.max(max, dp[i])
    }
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-140',
    no: '140',
    title: '戳气球',
    difficulty: '困难',
    tags: ['动态规划'],
    desc: `有 \`n\` 个气球，编号为 \`0\` 到 \`n-1\`，每个气球上都标有数字 \`nums[i]\`。戳破第 \`i\` 个气球可以获得 \`nums[i-1] * nums[i] * nums[i+1]\` 枚硬币（边界外视为 1）。求能获得硬币的最大数量。

示例 1：
\`\`\`
输入：nums = [3,1,5,8]
输出：167
\`\`\`

示例 2：
\`\`\`
输入：nums = [1,5]
输出：10
\`\`\`

示例 3：
\`\`\`
输入：nums = [1]
输出：1
\`\`\``,
    functionName: 'maxCoins',
    starterCode: 'function maxCoins(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[3, 1, 5, 8]], expected: 167, inputConvert: null, outputConvert: null },
      { input: [[1, 5]], expected: 10, inputConvert: null, outputConvert: null },
      { input: [[1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[2, 4, 6]], expected: 66, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

逆向思考：把「戳破」改为「添加」。在两端补 1，设 \`dp[i][j]\` 表示开区间 (i,j) 内全部戳完的最多硬币。枚举最后一个被戳破的气球 \`k\`，则 \`dp[i][j]=max(dp[i][j], arr[i]*arr[k]*arr[j]+dp[i][k]+dp[k][j])\`。按区间长度从小到大枚举。

\`\`\`js
function maxCoins(nums) {
  const n = nums.length
  const arr = [1, ...nums, 1]
  const m = n + 2
  const dp = Array.from({ length: m }, () => Array(m).fill(0))
  for (let len = 2; len < m; len++) {
    for (let i = 0; i + len < m; i++) {
      const j = i + len
      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.max(dp[i][j], arr[i] * arr[k] * arr[j] + dp[i][k] + dp[k][j])
      }
    }
  }
  return dp[0][m - 1]
}
\`\`\``,
    timeComplexity: 'O(n^3)',
    spaceComplexity: 'O(n^2)'
  },
  {
    id: 'algo-141',
    no: '141',
    title: '环形子数组的最大和',
    difficulty: '困难',
    tags: ['动态规划'],
    desc: `给定一个长度为 \`n\` 的环形整数数组 \`nums\`（数组的末端与开头相连），返回 \`nums\` 的非空子数组可能的最大累加和。

示例 1：
\`\`\`
输入：nums = [1,-2,3,-2]
输出：3
\`\`\`

示例 2：
\`\`\`
输入：nums = [5,-3,5]
输出：10
\`\`\`

示例 3：
\`\`\`
输入：nums = [-3,-2,-3]
输出：-2
\`\`\``,
    functionName: 'maxSubarraySumCircular',
    starterCode: 'function maxSubarraySumCircular(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[1, -2, 3, -2]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[5, -3, 5]], expected: 10, inputConvert: null, outputConvert: null },
      { input: [[-3, -2, -3]], expected: -2, inputConvert: null, outputConvert: null },
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

最大子数组和中段最大 (\`maxSum\`) 与跨首尾的最大 (用总和减去最小子数组和 \`sum - minSum\`) 两种情况取较大值。若最大和为负（全负数组），则直接返回 \`maxSum\`，避免用空段。

\`\`\`js
function maxSubarraySumCircular(nums) {
  const n = nums.length
  if (n === 0) return 0
  let curMax = nums[0], curMin = nums[0], sum = nums[0], maxSum = nums[0], minSum = nums[0]
  for (let i = 1; i < n; i++) {
    const x = nums[i]
    curMax = Math.max(x, curMax + x)
    maxSum = Math.max(maxSum, curMax)
    curMin = Math.min(x, curMin + x)
    minSum = Math.min(minSum, curMin)
    sum += x
  }
  if (maxSum > 0) {
    return Math.max(maxSum, sum - minSum)
  }
  return maxSum
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-142',
    no: '142',
    title: '正则表达式匹配',
    difficulty: '困难',
    tags: ['动态规划'],
    desc: `给你一个字符串 \`s\` 和一个字符规律 \`p\`，请你实现一个支持 \`'.'\` 和 \`'*'\` 的正则表达式匹配。\`'.'\` 匹配任意单个字符，\`'*'\` 匹配零个或多个前面的那一个元素。所谓匹配是要涵盖整个字符串 \`s\` 的。

示例 1：
\`\`\`
输入：s = "aa", p = "a"
输出：false
\`\`\`

示例 2：
\`\`\`
输入：s = "aa", p = "a*"
输出：true
\`\`\`

示例 3：
\`\`\`
输入：s = "ab", p = ".*"
输出：true
\`\`\``,
    functionName: 'isMatch',
    starterCode: 'function isMatch(s, p) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: ['aa', 'a'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['aa', 'a*'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['ab', '.*'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['aab', 'c*a*b'], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[i][j]\` 表示 \`s\` 前 \`i\` 个字符与 \`p\` 前 \`j\` 个字符是否匹配。若 \`p[j-1]='*'\`：\`dp[i][j]=dp[i][j-2]\`（不匹配）或 (\`dp[i-1][j]\` 且 \`p[j-2]\` 等于 \`s[i-1]\` 或 \`'.'\`)（匹配多个）；否则看当前字符是否相等或为 \`'.'\`。

\`\`\`js
function isMatch(s, p) {
  const m = s.length, n = p.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false))
  dp[0][0] = true
  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2]
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2] || (dp[i - 1][j] && (p[j - 2] === s[i - 1] || p[j - 2] === '.'))
      } else {
        dp[i][j] = dp[i - 1][j - 1] && (p[j - 1] === s[i - 1] || p[j - 1] === '.')
      }
    }
  }
  return dp[m][n]
}
\`\`\``,
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)'
  },
  {
    id: 'algo-143',
    no: '143',
    title: '交错字符串',
    difficulty: '困难',
    tags: ['动态规划'],
    desc: `给定三个字符串 \`s1\`、\`s2\` 和 \`s3\`，请判断 \`s3\` 是否由 \`s1\` 和 \`s2\` 交错组成。\`s1\` 和 \`s2\` 中字符的相对顺序在 \`s3\` 中保持不变，且不会交叉使用同一字符。

示例 1：
\`\`\`
输入：s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
输出：true
\`\`\`

示例 2：
\`\`\`
输入：s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
输出：false
\`\`\`

示例 3：
\`\`\`
输入：s1 = "", s2 = "", s3 = ""
输出：true
\`\`\``,
    functionName: 'isInterleave',
    starterCode: 'function isInterleave(s1, s2, s3) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: ['aabcc', 'dbbca', 'aadbbcbcac'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['aabcc', 'dbbca', 'aadbbbaccc'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['', '', ''], expected: true, inputConvert: null, outputConvert: null },
      { input: ['a', '', 'a'], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

\`dp[j]\` 表示 \`s1\` 前 \`i\` 个字符与 \`s2\` 前 \`j\` 个字符能否交错组成 \`s3\` 前 \`i+j\` 个字符。转移：\`dp[j]\` 来自上方 (\`s1[i-1]===s3[i+j-1]\`) 或左方 (\`s2[j-1]===s3[i+j-1]\`)。先长度不等直接返回 false。

\`\`\`js
function isInterleave(s1, s2, s3) {
  const m = s1.length, n = s2.length
  if (m + n !== s3.length) return false
  const dp = Array(n + 1).fill(false)
  dp[0] = true
  for (let j = 1; j <= n; j++) dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1]
  for (let i = 1; i <= m; i++) {
    dp[0] = dp[0] && s1[i - 1] === s3[i - 1]
    for (let j = 1; j <= n; j++) {
      dp[j] = (dp[j] && s1[i - 1] === s3[i + j - 1]) || (dp[j - 1] && s2[j - 1] === s3[i + j - 1])
    }
  }
  return dp[n]
}
\`\`\``,
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(n)'
  },
  // ====================== 滑动窗口与双指针（13 道，id 144-156） ======================
  {
    id: 'algo-144',
    no: '144',
    title: '移除元素',
    difficulty: '简单',
    tags: ['滑动窗口', '双指针'],
    desc: `给你一个数组 \`nums\` 和一个值 \`val\`，你需要原地移除所有数值等于 \`val\` 的元素，并返回移除后数组的新长度。不要使用额外的数组空间，元素的顺序可以改变。

示例 1：
\`\`\`
输入：nums = [3,2,2,3], val = 3
输出：2, nums = [2,2]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,1,2,2,3,0,4,2], val = 2
输出：5
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
      { input: [[1], 1], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[], 0], expected: 0, inputConvert: null, outputConvert: null }
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
    id: 'algo-145',
    no: '145',
    title: '反转字符串',
    difficulty: '简单',
    tags: ['双指针'],
    desc: `编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 \`s\` 的形式给出。你必须原地修改输入数组，并返回反转后的数组。

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
      { input: [['a']], expected: ['a'], inputConvert: null, outputConvert: null },
      { input: [['a', 'b']], expected: ['b', 'a'], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

双指针交换：左指针从 0、右指针从末尾出发，每次交换两指针所指字符并向中间靠拢，直到相遇。

\`\`\`js
function reverseString(s) {
  let l = 0, r = s.length - 1
  while (l < r) {
    [s[l], s[r]] = [s[r], s[l]]
    l++
    r--
  }
  return s
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-146',
    no: '146',
    title: '删除排序数组中的重复项',
    difficulty: '简单',
    tags: ['双指针'],
    desc: `给你一个非严格递增排列的数组 \`nums\`，请你原地删除重复出现的元素，使每个元素只出现一次，返回删除后数组的新长度。不要使用额外的数组空间。

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
输出：1
\`\`\``,
    functionName: 'removeDuplicates',
    starterCode: 'function removeDuplicates(nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[1, 1, 2]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5, inputConvert: null, outputConvert: null },
      { input: [[1, 1, 1]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3]], expected: 3, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快慢指针：\`i\` 指向已处理无重复部分的末尾。从 \`j=1\` 开始遍历，若 \`nums[j] !== nums[i]\`，则 \`i++\` 并把 \`nums[j]\` 复制过去。返回 \`i+1\`。

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
    id: 'algo-147',
    no: '147',
    title: '移动零',
    difficulty: '简单',
    tags: ['双指针', '滑动窗口'],
    desc: `给定一个数组 \`nums\`，编写一个函数将所有 \`0\` 移动到数组的末尾，同时保持非零元素的相对顺序。必须在不复制数组的情况下原地对数组进行操作，并返回移动后的数组。

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
输入：nums = [1,2,3]
输出：[1,2,3]
\`\`\``,
    functionName: 'moveZeroes',
    starterCode: 'function moveZeroes(nums) {\n  // 写你的代码\n  return nums\n}',
    setup: '',
    testCases: [
      { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0], inputConvert: null, outputConvert: null },
      { input: [[0]], expected: [0], inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3]], expected: [1, 2, 3], inputConvert: null, outputConvert: null },
      { input: [[0, 0, 1]], expected: [1, 0, 0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

快慢指针：\`i\` 指向下一个非零元素应放置的位置。遍历数组，遇到非零元素就与 \`nums[i]\` 交换并 \`i++\`。这样非零元素按原顺序前移，零自然被交换到后面。

\`\`\`js
function moveZeroes(nums) {
  let i = 0
  for (let j = 0; j < nums.length; j++) {
    if (nums[j] !== 0) {
      [nums[i], nums[j]] = [nums[j], nums[i]]
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
    id: 'algo-148',
    no: '148',
    title: '长按键入',
    difficulty: '简单',
    tags: ['双指针'],
    desc: `你的朋友正在键盘上输入他的名字 \`name\`。偶尔，在键入某个字符时，按键可能会被长按，该字符会被输入一次或多次。给你字符串 \`typed\`，判断它是否可能是你的朋友长按键入 \`name\` 的结果。

示例 1：
\`\`\`
输入：name = "alex", typed = "aaleex"
输出：true
\`\`\`

示例 2：
\`\`\`
输入：name = "saeed", typed = "ssaaedd"
输出：false
\`\`\`

示例 3：
\`\`\`
输入：name = "leelee", typed = "lleeelee"
输出：true
\`\`\``,
    functionName: 'isLongPressedName',
    starterCode: 'function isLongPressedName(name, typed) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: ['alex', 'aaleex'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['saeed', 'ssaaedd'], expected: false, inputConvert: null, outputConvert: null },
      { input: ['leelee', 'lleeelee'], expected: true, inputConvert: null, outputConvert: null },
      { input: ['abc', 'abc'], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

双指针：\`i\` 走 \`name\`，\`j\` 走 \`typed\`。若两指针所指字符相等，则同时前进；否则若 \`typed[j]\` 与上一个 \`typed\` 字符相同（长按），则 \`j\` 前进；否则返回 false。最后 \`i\` 必须走完整个 \`name\`。

\`\`\`js
function isLongPressedName(name, typed) {
  let i = 0, j = 0
  while (j < typed.length) {
    if (i < name.length && name[i] === typed[j]) {
      i++
      j++
    } else if (j > 0 && typed[j] === typed[j - 1]) {
      j++
    } else {
      return false
    }
  }
  return i === name.length
}
\`\`\``,
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-149',
    no: '149',
    title: '无重复字符的最长子串',
    difficulty: '中等',
    tags: ['滑动窗口'],
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
\`\`\``,
    functionName: 'lengthOfLongestSubstring',
    starterCode: 'function lengthOfLongestSubstring(s) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: ['abcabcbb'], expected: 3, inputConvert: null, outputConvert: null },
      { input: ['bbbbb'], expected: 1, inputConvert: null, outputConvert: null },
      { input: ['abacd'], expected: 4, inputConvert: null, outputConvert: null },
      { input: [''], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

滑动窗口 + 哈希表：\`right\` 扩展窗口，用哈希表记录字符上次出现位置。若当前字符已在窗口内（位置 >= \`left\`），则把 \`left\` 跳到该位置 +1。每次更新窗口长度最大值。

\`\`\`js
function lengthOfLongestSubstring(s) {
  const map = new Map()
  let left = 0, max = 0
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) {
      left = map.get(s[right]) + 1
    }
    map.set(s[right], right)
    max = Math.max(max, right - left + 1)
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, 字符集))'
  },
  {
    id: 'algo-150',
    no: '150',
    title: '长度最小的子数组',
    difficulty: '中等',
    tags: ['滑动窗口'],
    desc: `给定一个含有 \`n\` 个正整数的数组和一个正整数 \`target\`，找出该数组中满足其和 ≥ \`target\` 的长度最小的连续子数组，并返回其长度。若不存在符合条件的子数组，返回 0。

示例 1：
\`\`\`
输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的最短子数组
\`\`\`

示例 2：
\`\`\`
输入：target = 4, nums = [1,4,4]
输出：1
\`\`\`

示例 3：
\`\`\`
输入：target = 11, nums = [1,1,1,1,1,1,1,1]
输出：0
\`\`\``,
    functionName: 'minSubArrayLen',
    starterCode: 'function minSubArrayLen(target, nums) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [7, [2, 3, 1, 2, 4, 3]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [4, [1, 4, 4]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0, inputConvert: null, outputConvert: null },
      { input: [15, [1, 2, 3, 4, 5]], expected: 5, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

可变长滑动窗口：\`right\` 扩展累加 \`sum\`，一旦 \`sum >= target\` 就尝试收缩 \`left\` 并更新最小长度。窗口始终保持和 ≥ target 时尝试最小化。

\`\`\`js
function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, min = Infinity
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right]
    while (sum >= target) {
      min = Math.min(min, right - left + 1)
      sum -= nums[left]
      left++
    }
  }
  return min === Infinity ? 0 : min
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-151',
    no: '151',
    title: '盛最多水的容器',
    difficulty: '中等',
    tags: ['双指针'],
    desc: `给定一个长度为 \`n\` 的整数数组 \`height\`，有 \`n\` 条垂线，第 \`i\` 条线的两个端点是 \`(i, 0)\` 和 \`(i, height[i])\`。找出其中的两条线，使得它们与 \`x\` 轴共同构成的容器可以容纳最多的水。返回容器可以储存的最大水量。

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
      { input: [[4, 3, 2, 1, 4]], expected: 16, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 1]], expected: 2, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

左右指针：每次计算当前面积，然后移动较短的一边向中间靠拢。因为面积由较短边决定，移动较长边不可能让面积变大，只有移动较短边才有可能。

\`\`\`js
function maxArea(height) {
  let l = 0, r = height.length - 1, max = 0
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
    id: 'algo-152',
    no: '152',
    title: '三数之和',
    difficulty: '中等',
    tags: ['双指针'],
    desc: `给你一个整数数组 \`nums\`，判断是否存在三元组 \`[nums[i], nums[j], nums[k]]\` 满足 \`i != j\`、\`i != k\` 且 \`j != k\`，同时还满足 \`nums[i] + nums[j] + nums[k] == 0\`。返回所有和为 0 且不重复的三元组。

示例 1：
\`\`\`
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0,1,1]
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：nums = [0,0,0]
输出：[[0,0,0]]
\`\`\``,
    functionName: 'threeSum',
    starterCode: 'function threeSum(nums) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], inputConvert: null, outputConvert: null },
      { input: [[0, 1, 1]], expected: [], inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0]], expected: [[0, 0, 0]], inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0, 0]], expected: [[0, 0, 0]], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

排序后枚举第一个数 \`nums[i]\`，对剩余部分用左右指针找两数之和等于 \`-nums[i]\`。找到后跳过相邻重复元素避免重复三元组。\`i\` 也跳过与前一个相同的值。

\`\`\`js
function threeSum(nums) {
  const res = []
  nums.sort((a, b) => a - b)
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue
    let l = i + 1, r = nums.length - 1
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r]
      if (sum < 0) l++
      else if (sum > 0) r--
      else {
        res.push([nums[i], nums[l], nums[r]])
        while (l < r && nums[l] === nums[l + 1]) l++
        while (l < r && nums[r] === nums[r - 1]) r--
        l++
        r--
      }
    }
  }
  return res
}
\`\`\``,
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(log n)'
  },
  {
    id: 'algo-153',
    no: '153',
    title: '最接近的三数之和',
    difficulty: '中等',
    tags: ['双指针'],
    desc: `给你一个长度为 \`n\` 的整数数组 \`nums\` 和一个目标值 \`target\`。请你从 \`nums\` 中选出三个整数，使它们的和与 \`target\` 最接近。返回这三个数的和。假定每组输入只存在恰好一个解。

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
\`\`\`

示例 3：
\`\`\`
输入：nums = [1,1,1,1], target = 0
输出：3
\`\`\``,
    functionName: 'threeSumClosest',
    starterCode: 'function threeSumClosest(nums, target) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[-1, 2, 1, -4], 1], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[0, 0, 0], 1], expected: 0, inputConvert: null, outputConvert: null },
      { input: [[1, 1, 1, 1], 0], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 4, 5], 10], expected: 10, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

排序后枚举第一个数 \`nums[i]\`，再用左右指针逼近 \`target\`。每次比较当前和与 \`target\` 的差距，更新最接近值。若和等于 \`target\` 直接返回。

\`\`\`js
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b)
  let closest = nums[0] + nums[1] + nums[2]
  for (let i = 0; i < nums.length - 2; i++) {
    let l = i + 1, r = nums.length - 1
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r]
      if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum
      if (sum < target) l++
      else if (sum > target) r--
      else return sum
    }
  }
  return closest
}
\`\`\``,
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(log n)'
  },
  {
    id: 'algo-154',
    no: '154',
    title: '水果成篮',
    difficulty: '中等',
    tags: ['滑动窗口'],
    desc: `你正在探访一家农场，农场从左到右种植了一排果树。给你一个整数数组 \`fruits\`，其中 \`fruits[i]\` 是第 \`i\` 棵树上的水果种类。你只有两个篮子，每个篮子只能装一种水果，但可装任意数量。从任意一棵树开始，每棵树只能摘一次。求最多可以摘多少个水果。

示例 1：
\`\`\`
输入：fruits = [1,2,1]
输出：3
\`\`\`

示例 2：
\`\`\`
输入：fruits = [0,1,2,2]
输出：3
\`\`\`

示例 3：
\`\`\`
输入：fruits = [1,2,3,2,2]
输出：4
\`\`\``,
    functionName: 'totalFruit',
    starterCode: 'function totalFruit(fruits) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 1]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[0, 1, 2, 2]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3, 2, 2]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]], expected: 5, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

滑动窗口 + 计数哈希：\`right\` 扩展，统计窗口内水果种类数。当种类超过 2 时收缩 \`left\`，直到只剩 2 种。窗口最大长度即为答案。

\`\`\`js
function totalFruit(fruits) {
  const count = new Map()
  let left = 0, max = 0
  for (let right = 0; right < fruits.length; right++) {
    count.set(fruits[right], (count.get(fruits[right]) || 0) + 1)
    while (count.size > 2) {
      count.set(fruits[left], count.get(fruits[left]) - 1)
      if (count.get(fruits[left]) === 0) count.delete(fruits[left])
      left++
    }
    max = Math.max(max, right - left + 1)
  }
  return max
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-155',
    no: '155',
    title: '最小覆盖子串',
    difficulty: '困难',
    tags: ['滑动窗口'],
    desc: `给你一个字符串 \`s\`、一个字符串 \`t\`。返回 \`s\` 中涵盖 \`t\` 所有字符的最小子串。如果 \`s\` 中不存在这样的子串，返回空字符串 \`""\`。

示例 1：
\`\`\`
输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
\`\`\`

示例 2：
\`\`\`
输入：s = "a", t = "a"
输出："a"
\`\`\`

示例 3：
\`\`\`
输入：s = "a", t = "aa"
输出：""
\`\`\``,
    functionName: 'minWindow',
    starterCode: 'function minWindow(s, t) {\n  // 写你的代码\n  return ""\n}',
    setup: '',
    testCases: [
      { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC', inputConvert: null, outputConvert: null },
      { input: ['a', 'a'], expected: 'a', inputConvert: null, outputConvert: null },
      { input: ['a', 'aa'], expected: '', inputConvert: null, outputConvert: null },
      { input: ['aa', 'aa'], expected: 'aa', inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

滑动窗口 + 双哈希计数：\`need\` 记录 \`t\` 中字符需求，\`window\` 记录窗口内字符数。用 \`formed\` 表示窗口中已满足需求数的字符种类数。当 \`formed === required\` 时尝试收缩 \`left\`，并记录最短窗口。

\`\`\`js
function minWindow(s, t) {
  const need = new Map()
  for (const c of t) need.set(c, (need.get(c) || 0) + 1)
  const required = need.size
  const window = new Map()
  let left = 0, formed = 0, minLen = Infinity, minStart = 0
  for (let right = 0; right < s.length; right++) {
    const c = s[right]
    window.set(c, (window.get(c) || 0) + 1)
    if (need.has(c) && window.get(c) === need.get(c)) formed++
    while (formed === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1
        minStart = left
      }
      const d = s[left]
      window.set(d, window.get(d) - 1)
      if (need.has(d) && window.get(d) < need.get(d)) formed--
      left++
    }
  }
  return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen)
}
\`\`\``,
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(字符集)'
  },
  {
    id: 'algo-156',
    no: '156',
    title: '滑动窗口最大值',
    difficulty: '困难',
    tags: ['滑动窗口', '队列'],
    desc: `给你一个整数数组 \`nums\`，有一个大小为 \`k\` 的滑动窗口从数组的最左侧移动到最右侧。滑动窗口每次只移动一位，返回每个窗口中的最大值。

示例 1：
\`\`\`
输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
\`\`\`

示例 2：
\`\`\`
输入：nums = [1], k = 1
输出：[1]
\`\`\`

示例 3：
\`\`\`
输入：nums = [7,2,4], k = 2
输出：[7,4]
\`\`\``,
    functionName: 'maxSlidingWindow',
    starterCode: 'function maxSlidingWindow(nums, k) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7], inputConvert: null, outputConvert: null },
      { input: [[1], 1], expected: [1], inputConvert: null, outputConvert: null },
      { input: [[7, 2, 4], 2], expected: [7, 4], inputConvert: null, outputConvert: null },
      { input: [[1, -1], 1], expected: [1, -1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

单调递减双端队列：队列存下标，保证队首始终是当前窗口最大值的下标。新元素入队前，把队尾所有比它小的元素弹出（它们不可能再成为最大值）。每次弹出超出窗口范围的队首，再取队首对应的值。

\`\`\`js
function maxSlidingWindow(nums, k) {
  const n = nums.length
  if (n === 0) return []
  const res = []
  const dq = []
  for (let i = 0; i < n; i++) {
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
  // ====================== 回溯算法（8 道，id 157-164） ======================
  {
    id: 'algo-157',
    no: '157',
    title: '电话号码的字母组合',
    difficulty: '简单',
    tags: ['回溯算法'],
    desc: `给定一个仅包含数字 \`2-9\` 的字符串 \`digits\`，返回所有它能表示的字母组合。电话按键的数字到字母映射如下：\`2->abc, 3->def, 4->ghi, 5->jkl, 6->mno, 7->pqrs, 8->tuv, 9->wxyz\`。按任意顺序返回。

示例 1：
\`\`\`
输入：digits = "23"
输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
\`\`\`

示例 2：
\`\`\`
输入：digits = ""
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：digits = "2"
输出：["a","b","c"]
\`\`\``,
    functionName: 'letterCombinations',
    starterCode: 'function letterCombinations(digits) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: ['23'], expected: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'], inputConvert: null, outputConvert: null },
      { input: [''], expected: [], inputConvert: null, outputConvert: null },
      { input: ['2'], expected: ['a', 'b', 'c'], inputConvert: null, outputConvert: null },
      { input: ['7'], expected: ['p', 'q', 'r', 's'], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

回溯：维护一个映射表，从第 0 位开始枚举每位数字对应的字母。当 \`idx === digits.length\` 时把当前路径加入结果。每位选一个字母后递归下一位，再回溯。

\`\`\`js
function letterCombinations(digits) {
  if (digits.length === 0) return []
  const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' }
  const res = []
  const backtrack = (idx, path) => {
    if (idx === digits.length) {
      res.push(path.join(''))
      return
    }
    for (const c of map[digits[idx]]) {
      path.push(c)
      backtrack(idx + 1, path)
      path.pop()
    }
  }
  backtrack(0, [])
  return res
}
\`\`\``,
    timeComplexity: 'O(4^n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-158',
    no: '158',
    title: '组合',
    difficulty: '简单',
    tags: ['回溯算法'],
    desc: `给定两个整数 \`n\` 和 \`k\`，返回范围 \`[1, n]\` 中所有可能的 \`k\` 个数的组合。按字典顺序返回。

示例 1：
\`\`\`
输入：n = 4, k = 2
输出：[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
\`\`\`

示例 2：
\`\`\`
输入：n = 1, k = 1
输出：[[1]]
\`\`\`

示例 3：
\`\`\`
输入：n = 3, k = 2
输出：[[1,2],[1,3],[2,3]]
\`\`\``,
    functionName: 'combine',
    starterCode: 'function combine(n, k) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [4, 2], expected: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]], inputConvert: null, outputConvert: null },
      { input: [1, 1], expected: [[1]], inputConvert: null, outputConvert: null },
      { input: [3, 2], expected: [[1, 2], [1, 3], [2, 3]], inputConvert: null, outputConvert: null },
      { input: [4, 1], expected: [[1], [2], [3], [4]], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

回溯：从 \`start\` 开始枚举，把当前数加入路径后递归下一个数 (\`i+1\`)，再回溯弹出。当路径长度等于 \`k\` 时收集结果。为保证字典序且不重复，下一层从 \`i+1\` 开始选。

\`\`\`js
function combine(n, k) {
  const res = []
  const backtrack = (start, path) => {
    if (path.length === k) {
      res.push([...path])
      return
    }
    for (let i = start; i <= n; i++) {
      path.push(i)
      backtrack(i + 1, path)
      path.pop()
    }
  }
  backtrack(1, [])
  return res
}
\`\`\``,
    timeComplexity: 'O(C(n,k) * k)',
    spaceComplexity: 'O(k)'
  },
  {
    id: 'algo-159',
    no: '159',
    title: '组合总和',
    difficulty: '简单',
    tags: ['回溯算法'],
    desc: `给你一个无重复元素的整数数组 \`candidates\` 和一个目标数 \`target\`，找出 \`candidates\` 中可以使数字之和为 \`target\` 的所有不同组合。同一个数字可以无限制重复被选取。

示例 1：
\`\`\`
输入：candidates = [2,3,6,7], target = 7
输出：[[2,2,3],[7]]
\`\`\`

示例 2：
\`\`\`
输入：candidates = [2,3,5], target = 8
输出：[[2,2,2,2],[2,3,3],[3,5]]
\`\`\`

示例 3：
\`\`\`
输入：candidates = [2], target = 1
输出：[]
\`\`\``,
    functionName: 'combinationSum',
    starterCode: 'function combinationSum(candidates, target) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]], inputConvert: null, outputConvert: null },
      { input: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]], inputConvert: null, outputConvert: null },
      { input: [[2], 1], expected: [], inputConvert: null, outputConvert: null },
      { input: [[1], 1], expected: [[1]], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

排序后回溯：每层从 \`start\` 枚举候选，因为可重复选取同一元素，下一层 \`start\` 仍为 \`i\`（不是 \`i+1\`）。若剩余 \`remain===0\` 收集结果；若 \`candidates[i] > remain\` 则剪枝跳出（已排序）。

\`\`\`js
function combinationSum(candidates, target) {
  const res = []
  candidates.sort((a, b) => a - b)
  const backtrack = (start, remain, path) => {
    if (remain === 0) {
      res.push([...path])
      return
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remain) break
      path.push(candidates[i])
      backtrack(i, remain - candidates[i], path)
      path.pop()
    }
  }
  backtrack(0, target, [])
  return res
}
\`\`\``,
    timeComplexity: 'O(2^target)',
    spaceComplexity: 'O(target)'
  },
  {
    id: 'algo-160',
    no: '160',
    title: '全排列 II',
    difficulty: '中等',
    tags: ['回溯算法'],
    desc: `给定一个可包含重复数字的整数序列 \`nums\`，按任意顺序返回所有不重复的全排列。

示例 1：
\`\`\`
输入：nums = [1,1,2]
输出：[[1,1,2],[1,2,1],[2,1,1]]
\`\`\`

示例 2：
\`\`\`
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
\`\`\`

示例 3：
\`\`\`
输入：nums = [1]
输出：[[1]]
\`\`\``,
    functionName: 'permuteUnique',
    starterCode: 'function permuteUnique(nums) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [[1, 1, 2]], expected: [[1, 1, 2], [1, 2, 1], [2, 1, 1]], inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], inputConvert: null, outputConvert: null },
      { input: [[1]], expected: [[1]], inputConvert: null, outputConvert: null },
      { input: [[2, 2]], expected: [[2, 2]], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

排序 + 回溯 + 剪枝：用 \`used\` 数组标记某下标是否已使用。若 \`nums[i]===nums[i-1]\` 且 \`nums[i-1]\` 未被使用，则跳过当前 \`i\`（保证重复元素只按从前往后的顺序选取一次）。

\`\`\`js
function permuteUnique(nums) {
  const res = []
  nums.sort((a, b) => a - b)
  const used = Array(nums.length).fill(false)
  const backtrack = (path) => {
    if (path.length === nums.length) {
      res.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue
      used[i] = true
      path.push(nums[i])
      backtrack(path)
      path.pop()
      used[i] = false
    }
  }
  backtrack([])
  return res
}
\`\`\``,
    timeComplexity: 'O(n * n!)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-161',
    no: '161',
    title: '括号生成',
    difficulty: '中等',
    tags: ['回溯算法'],
    desc: `数字 \`n\` 代表生成括号的对数，请你设计一个函数，生成所有可能的并且有效的括号组合。

示例 1：
\`\`\`
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
\`\`\`

示例 2：
\`\`\`
输入：n = 1
输出：["()"]
\`\`\`

示例 3：
\`\`\`
输入：n = 2
输出：["(())","()()"]
\`\`\``,
    functionName: 'generateParenthesis',
    starterCode: 'function generateParenthesis(n) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'], inputConvert: null, outputConvert: null },
      { input: [1], expected: ['()'], inputConvert: null, outputConvert: null },
      { input: [2], expected: ['(())', '()()'], inputConvert: null, outputConvert: null },
      { input: [4], expected: ['(((())))', '((()()))', '((())())', '((()))()', '(()(()))', '(()()())', '(()())()', '(())(())', '(())()()', '()((()))', '()(()())', '()(())()', '()()(())', '()()()()'], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

回溯：用 \`open\` 和 \`close\` 记录已使用的左右括号数。只要 \`open < n\` 就可以加左括号；只要 \`close < open\` 就可以加右括号。当路径长度等于 \`2n\` 时收集结果。

\`\`\`js
function generateParenthesis(n) {
  const res = []
  const backtrack = (open, close, path) => {
    if (path.length === 2 * n) {
      res.push(path.join(''))
      return
    }
    if (open < n) {
      path.push('(')
      backtrack(open + 1, close, path)
      path.pop()
    }
    if (close < open) {
      path.push(')')
      backtrack(open, close + 1, path)
      path.pop()
    }
  }
  backtrack(0, 0, [])
  return res
}
\`\`\``,
    timeComplexity: 'O(4^n / sqrt(n))',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-162',
    no: '162',
    title: '子集 II',
    difficulty: '中等',
    tags: ['回溯算法'],
    desc: `给你一个整数数组 \`nums\`，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。解集不能包含重复的子集。返回的解集中，子集可以按任意顺序排列。

示例 1：
\`\`\`
输入：nums = [1,2,2]
输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
\`\`\`

示例 2：
\`\`\`
输入：nums = [0]
输出：[[],[0]]
\`\`\`

示例 3：
\`\`\`
输入：nums = [1,1,2,2]
输出：[[],[1],[1,1],[1,1,2],[1,1,2,2],[1,2],[1,2,2],[2],[2,2]]
\`\`\``,
    functionName: 'subsetsWithDup',
    starterCode: 'function subsetsWithDup(nums) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [[1, 2, 2]], expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]], inputConvert: null, outputConvert: null },
      { input: [[0]], expected: [[], [0]], inputConvert: null, outputConvert: null },
      { input: [[1, 1, 2, 2]], expected: [[], [1], [1, 1], [1, 1, 2], [1, 1, 2, 2], [1, 2], [1, 2, 2], [2], [2, 2]], inputConvert: null, outputConvert: null },
      { input: [[1, 2, 3]], expected: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

排序 + 回溯：每进入一层都先把当前路径加入结果（子集问题每个节点都要收集）。同一层中若 \`nums[i]===nums[i-1]\` 且 \`i>start\`，则跳过避免重复子集。下一层从 \`i+1\` 开始。

\`\`\`js
function subsetsWithDup(nums) {
  const res = []
  nums.sort((a, b) => a - b)
  const backtrack = (start, path) => {
    res.push([...path])
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue
      path.push(nums[i])
      backtrack(i + 1, path)
      path.pop()
    }
  }
  backtrack(0, [])
  return res
}
\`\`\``,
    timeComplexity: 'O(2^n * n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-163',
    no: '163',
    title: 'N 皇后',
    difficulty: '困难',
    tags: ['回溯算法'],
    desc: `按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。\`n\` 皇后问题研究的是如何将 \`n\` 个皇后放置在 \`n x n\` 的棋盘上，并且使皇后彼此之间不能相互攻击。给你一个整数 \`n\`，返回所有不同的解决方案。每种解法用一个字符矩阵表示，\`'Q'\` 代表皇后，\`'.'\` 代表空位。

示例 1：
\`\`\`
输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
\`\`\`

示例 2：
\`\`\`
输入：n = 1
输出：[["Q"]]
\`\`\`

示例 3：
\`\`\`
输入：n = 2
输出：[]
\`\`\``,
    functionName: 'solveNQueens',
    starterCode: 'function solveNQueens(n) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [4], expected: [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']], inputConvert: null, outputConvert: null },
      { input: [1], expected: [['Q']], inputConvert: null, outputConvert: null },
      { input: [2], expected: [], inputConvert: null, outputConvert: null },
      { input: [3], expected: [], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

逐行回溯：用三个集合分别记录已占用的列、主对角线（\`row-col\`）、副对角线（\`row+col\`）。每行枚举列，若该位置三集合都不冲突就放 Q 并递归下一行。到达第 \`n\` 行时把棋盘转成字符串数组收集。

\`\`\`js
function solveNQueens(n) {
  const res = []
  const cols = new Set(), diag1 = new Set(), diag2 = new Set()
  const board = []
  const backtrack = (row) => {
    if (row === n) {
      res.push(board.map(r => r.join('')))
      return
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue
      cols.add(col)
      diag1.add(row - col)
      diag2.add(row + col)
      const arr = Array(n).fill('.')
      arr[col] = 'Q'
      board.push(arr)
      backtrack(row + 1)
      board.pop()
      cols.delete(col)
      diag1.delete(row - col)
      diag2.delete(row + col)
    }
  }
  backtrack(0)
  return res
}
\`\`\``,
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-164',
    no: '164',
    title: '解数独',
    difficulty: '困难',
    tags: ['回溯算法'],
    desc: `编写一个程序，通过填充空格来解数独问题。数独的解法需遵循如下规则：数字 1-9 在每一行、每一列、每一个 3x3 宫内都只能出现一次。空格用 \`'.'\` 表示。题目保证给定数独只有一个解。函数原地填充棋盘并返回填充后的棋盘。

示例 1：
\`\`\`
输入：board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
输出：[["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]
\`\`\``,
    functionName: 'solveSudoku',
    starterCode: 'function solveSudoku(board) {\n  // 写你的代码\n  return board\n}',
    setup: '',
    testCases: [
      {
        input: [[['5', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'], ['.', '9', '8', '.', '.', '.', '.', '6', '.'], ['8', '.', '.', '.', '6', '.', '.', '.', '3'], ['4', '.', '.', '8', '.', '3', '.', '.', '1'], ['7', '.', '.', '.', '2', '.', '.', '.', '6'], ['.', '6', '.', '.', '.', '.', '2', '8', '.'], ['.', '.', '.', '4', '1', '9', '.', '.', '5'], ['.', '.', '.', '.', '8', '.', '.', '7', '9']]],
        expected: [['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']],
        inputConvert: null,
        outputConvert: null
      },
      {
        input: [[['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']]],
        expected: [['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']],
        inputConvert: null,
        outputConvert: null
      },
      {
        input: [[['.', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']]],
        expected: [['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'], ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'], ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9']],
        inputConvert: null,
        outputConvert: null
      }
    ],
    solution: `## 思路

回溯：遍历棋盘找到第一个空格 \`'.'\`，尝试填入 1~9 中合法的数字（同行、同列、所在 3x3 宫都不重复），递归求解；若失败则回溯置空。若无空格则说明已解出。

\`\`\`js
function solveSudoku(board) {
  const isValid = (row, col, c) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === c) return false
      if (board[i][col] === c) return false
      const br = 3 * Math.floor(row / 3) + Math.floor(i / 3)
      const bc = 3 * Math.floor(col / 3) + (i % 3)
      if (board[br][bc] === c) return false
    }
    return true
  }
  const solve = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === '.') {
          for (let n = 1; n <= 9; n++) {
            const c = String(n)
            if (isValid(i, j, c)) {
              board[i][j] = c
              if (solve()) return true
              board[i][j] = '.'
            }
          }
          return false
        }
      }
    }
    return true
  }
  solve()
  return board
}
\`\`\``,
    timeComplexity: 'O(9^(n^2))',
    spaceComplexity: 'O(n^2)'
  }
]
