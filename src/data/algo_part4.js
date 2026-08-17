// 算法题库片段 4：链表 / 树 / 图与并查集（共 36 题，ID algo-165 到 algo-200）
// 注意：链表题需要 setup，从 algorithmRunner 导入
import { LINKED_LIST_SETUP, TREE_SETUP } from '../utils/algorithmRunner.js'

export const part4Problems = [
  // ====================== 链表（13 道，id 165-177）======================
  {
    id: 'algo-165',
    no: '165',
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
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1, 2]], expected: [2, 1], inputConvert: 'list', outputConvert: 'list' },
      { input: [[]], expected: [], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

迭代法：维护 \`prev\` / \`curr\` 两个指针，每次先暂存 \`curr.next\`，再把 \`curr.next\` 指向 \`prev\`，然后整体后移一步。也可以用递归，但迭代空间更优。

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
    id: 'algo-166',
    no: '166',
    title: '合并两个有序链表',
    difficulty: '简单',
    tags: ['链表'],
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
      { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4], inputConvert: 'list', outputConvert: 'list' },
      { input: [[], []], expected: [], inputConvert: 'list', outputConvert: 'list' },
      { input: [[], [0]], expected: [0], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

哑节点（dummy）+ 双指针迭代：每次比较两个链表当前节点值，把较小者接到结果链表末尾，最后把尚未遍历完的链表直接接到末尾。

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
    id: 'algo-167',
    no: '167',
    title: '环形链表',
    difficulty: '简单',
    tags: ['链表', '快慢指针'],
    desc: `给定一个链表，判断链表中是否有环。参数 \`arr\` 表示链表节点值序列，\`pos\` 表示链表尾节点连接到的节点索引（-1 表示无环）。函数内部会根据 \`arr\` 与 \`pos\` 构造链表，再判断是否存在环。

示例 1：
\`\`\`
输入：arr = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点（索引 1）
\`\`\`

示例 2：
\`\`\`
输入：arr = [1,2], pos = 0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点
\`\`\`

示例 3：
\`\`\`
输入：arr = [1], pos = -1
输出：false
\`\`\``,
    functionName: 'hasCycle',
    starterCode: 'function hasCycle(arr, pos) {\n  // 写你的代码\n  return false\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[3, 2, 0, -4], 1], expected: true, inputConvert: null, outputConvert: null },
      { input: [[1, 2], 0], expected: true, inputConvert: null, outputConvert: null },
      { input: [[1], -1], expected: false, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先用 \`arr\` 与 \`pos\` 构造带环链表（\`pos >= 0\` 时把尾节点连到索引为 \`pos\` 的节点），再用快慢指针判断：慢指针走一步，快指针走两步，若相遇则有环，若快指针走到 null 则无环。

\`\`\`js
function hasCycle(arr, pos) {
  if (!arr || arr.length === 0) return false
  let head = new ListNode(arr[0])
  let cur = head
  let entry = pos === 0 ? head : null
  for (let i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i])
    cur = cur.next
    if (pos === i) entry = cur
  }
  if (pos >= 0) cur.next = entry
  let slow = head, fast = head
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
  {
    id: 'algo-168',
    no: '168',
    title: '删除排序链表中的重复元素',
    difficulty: '简单',
    tags: ['链表'],
    desc: `给定一个已排序的链表的头 \`head\`，删除所有重复的元素，使每个元素只出现一次。返回已排序的链表。

示例 1：
\`\`\`
输入：head = [1,1,2]
输出：[1,2]
\`\`\`

示例 2：
\`\`\`
输入：head = [1,1,2,3,3]
输出：[1,2,3]
\`\`\`

示例 3：
\`\`\`
输入：head = []
输出：[]
\`\`\``,
    functionName: 'deleteDuplicates',
    starterCode: 'function deleteDuplicates(head) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 1, 2]], expected: [1, 2], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1, 1, 2, 3, 3]], expected: [1, 2, 3], inputConvert: 'list', outputConvert: 'list' },
      { input: [[]], expected: [], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

由于链表已排序，重复元素一定相邻。一次遍历，比较当前节点与下一节点值，相等则跳过下一节点，否则后移。

\`\`\`js
function deleteDuplicates(head) {
  let cur = head
  while (cur && cur.next) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next
    } else {
      cur = cur.next
    }
  }
  return head
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-169',
    no: '169',
    title: '链表的中间节点',
    difficulty: '简单',
    tags: ['链表', '快慢指针'],
    desc: `给定一个头结点为 \`head\` 的非空单链表，返回链表的中间结点。如果有两个中间结点，则返回第二个中间结点。

示例 1：
\`\`\`
输入：head = [1,2,3,4,5]
输出：[3,4,5]
\`\`\`

示例 2：
\`\`\`
输入：head = [1,2,3,4,5,6]
输出：[4,5,6]
\`\`\`

示例 3：
\`\`\`
输入：head = [1]
输出：[1]
\`\`\``,
    functionName: 'middleNode',
    starterCode: 'function middleNode(head) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [3, 4, 5], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1]], expected: [1], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

快慢指针：慢指针走一步，快指针走两步。快指针到尾时慢指针正好在中间。当节点数为偶数时，慢指针落在第二个中间节点。

\`\`\`js
function middleNode(head) {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }
  return slow
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-170',
    no: '170',
    title: '两数相加',
    difficulty: '中等',
    tags: ['链表', '数学'],
    desc: `给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序方式存储的，并且每个节点只能存储一位数字。请你将两个数相加，并以相同形式返回一个表示和的链表。

示例 1：
\`\`\`
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807，返回 [7,0,8]
\`\`\`

示例 2：
\`\`\`
输入：l1 = [0], l2 = [0]
输出：[0]
\`\`\`

示例 3：
\`\`\`
输入：l1 = [9,9,9,9], l2 = [9,9,9]
输出：[8,9,9,0,1]
\`\`\``,
    functionName: 'addTwoNumbers',
    starterCode: 'function addTwoNumbers(l1, l2) {\n  // 写你的代码\n  return l1\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8], inputConvert: 'list', outputConvert: 'list' },
      { input: [[0], [0]], expected: [0], inputConvert: 'list', outputConvert: 'list' },
      { input: [[9, 9, 9, 9], [9, 9, 9]], expected: [8, 9, 9, 0, 1], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

模拟竖式加法：同时遍历两条链表，逐位相加并维护进位 \`carry\`。用哑节点简化头节点处理，遍历直到两条链表都走完且进位为 0。

\`\`\`js
function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0)
  let cur = dummy
  let carry = 0
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry
    carry = Math.floor(sum / 10)
    cur.next = new ListNode(sum % 10)
    cur = cur.next
    l1 = l1 ? l1.next : null
    l2 = l2 ? l2.next : null
  }
  return dummy.next
}
\`\`\``,
    timeComplexity: 'O(max(n,m))',
    spaceComplexity: 'O(max(n,m))'
  },
  {
    id: 'algo-171',
    no: '171',
    title: '删除链表的倒数第N个节点',
    difficulty: '中等',
    tags: ['链表', '双指针'],
    desc: `给你一个链表，删除链表的倒数第 \`n\` 个结点，并且返回链表的头结点。要求一趟扫描完成。

示例 1：
\`\`\`
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
\`\`\`

示例 2：
\`\`\`
输入：head = [1], n = 1
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：head = [1,2], n = 1
输出：[1]
\`\`\``,
    functionName: 'removeNthFromEnd',
    starterCode: 'function removeNthFromEnd(head, n) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1], 1], expected: [], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1, 2], 1], expected: [1], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

哑节点 + 双指针：让 \`fast\` 先走 \`n+1\` 步，然后 \`slow\` 与 \`fast\` 一起走，\`fast\` 到末尾时 \`slow\` 恰好指向待删节点的前驱，直接跳过即可。哑节点用于处理删除头节点的边界。

\`\`\`js
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0)
  dummy.next = head
  let fast = dummy, slow = dummy
  for (let i = 0; i <= n; i++) fast = fast.next
  while (fast) {
    fast = fast.next
    slow = slow.next
  }
  slow.next = slow.next.next
  return dummy.next
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-172',
    no: '172',
    title: '两两交换链表中的节点',
    difficulty: '中等',
    tags: ['链表'],
    desc: `给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须实际修改节点，而不能仅仅是改变节点内部的值。

示例 1：
\`\`\`
输入：head = [1,2,3,4]
输出：[2,1,4,3]
\`\`\`

示例 2：
\`\`\`
输入：head = []
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：head = [1]
输出：[1]
\`\`\``,
    functionName: 'swapPairs',
    starterCode: 'function swapPairs(head) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [2, 1, 4, 3], inputConvert: 'list', outputConvert: 'list' },
      { input: [[]], expected: [], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1]], expected: [1], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

哑节点 + 迭代：\`prev\` 指向待交换一对节点的前驱，每次把 \`first\` / \`second\` 两个节点交换指针指向，然后 \`prev\` 后移到 \`first\`。

\`\`\`js
function swapPairs(head) {
  const dummy = new ListNode(0)
  dummy.next = head
  let prev = dummy
  while (prev.next && prev.next.next) {
    const first = prev.next
    const second = prev.next.next
    first.next = second.next
    second.next = first
    prev.next = second
    prev = first
  }
  return dummy.next
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-173',
    no: '173',
    title: '旋转链表',
    difficulty: '中等',
    tags: ['链表', '双指针'],
    desc: `给你一个链表的头节点 \`head\`，旋转链表，将链表每个节点向右移动 \`k\` 个位置。

示例 1：
\`\`\`
输入：head = [1,2,3,4,5], k = 2
输出：[4,5,1,2,3]
\`\`\`

示例 2：
\`\`\`
输入：head = [0,1,2], k = 4
输出：[2,0,1]
\`\`\`

示例 3：
\`\`\`
输入：head = [1,2], k = 0
输出：[1,2]
\`\`\``,
    functionName: 'rotateRight',
    starterCode: 'function rotateRight(head, k) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3], inputConvert: 'list', outputConvert: 'list' },
      { input: [[0, 1, 2], 4], expected: [2, 0, 1], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1, 2], 0], expected: [1, 2], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

先求长度 \`len\`，\`k = k % len\`。若 \`k\` 为 0 直接返回。然后把尾节点连到头形成环，再从新头位置前断开：新尾是原链表第 \`len - k\` 个节点。

\`\`\`js
function rotateRight(head, k) {
  if (!head || !head.next || k === 0) return head
  let len = 1, tail = head
  while (tail.next) { tail = tail.next; len++ }
  k = k % len
  if (k === 0) return head
  tail.next = head
  let newTail = head
  for (let i = 1; i < len - k; i++) newTail = newTail.next
  const newHead = newTail.next
  newTail.next = null
  return newHead
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-174',
    no: '174',
    title: '分隔链表',
    difficulty: '中等',
    tags: ['链表', '双指针'],
    desc: `给你一个链表的头节点 \`head\` 和一个特定值 \`x\`，请你对链表进行分隔，使得所有小于 \`x\` 的节点都出现在大于或等于 \`x\` 的节点之前。你应当保留两个分区中每个节点的初始相对位置。

示例 1：
\`\`\`
输入：head = [1,4,3,2,5,2], x = 3
输出：[1,2,2,4,3,5]
\`\`\`

示例 2：
\`\`\`
输入：head = [2,1], x = 2
输出：[1,2]
\`\`\`

示例 3：
\`\`\`
输入：head = [], x = 0
输出：[]
\`\`\``,
    functionName: 'partition',
    starterCode: 'function partition(head, x) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 4, 3, 2, 5, 2], 3], expected: [1, 2, 2, 4, 3, 5], inputConvert: 'list', outputConvert: 'list' },
      { input: [[2, 1], 2], expected: [1, 2], inputConvert: 'list', outputConvert: 'list' },
      { input: [[], 0], expected: [], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

拆成两条链表：\`small\` 收集小于 \`x\` 的节点，\`large\` 收集大于等于 \`x\` 的节点，最后把 \`large\` 接到 \`small\` 末尾。两条链表各用哑节点简化头处理。

\`\`\`js
function partition(head, x) {
  const sDummy = new ListNode(0), lDummy = new ListNode(0)
  let small = sDummy, large = lDummy
  while (head) {
    if (head.val < x) { small.next = head; small = small.next }
    else { large.next = head; large = large.next }
    head = head.next
  }
  large.next = null
  small.next = lDummy.next
  return sDummy.next
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-175',
    no: '175',
    title: '奇偶链表',
    difficulty: '中等',
    tags: ['链表'],
    desc: `给定单链表的头节点 \`head\`，将所有索引为奇数的节点和索引为偶数的节点分别组合在一起，然后返回重新排序的列表。第一个节点的索引被认为是奇数，第二个节点的索引为偶数，以此类推。请使用原地算法完成。

示例 1：
\`\`\`
输入：head = [1,2,3,4,5]
输出：[1,3,5,2,4]
\`\`\`

示例 2：
\`\`\`
输入：head = [2,1,3,5,6,4,7]
输出：[2,3,6,7,1,5,4]
\`\`\`

示例 3：
\`\`\`
输入：head = []
输出：[]
\`\`\``,
    functionName: 'oddEvenList',
    starterCode: 'function oddEvenList(head) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [1, 3, 5, 2, 4], inputConvert: 'list', outputConvert: 'list' },
      { input: [[2, 1, 3, 5, 6, 4, 7]], expected: [2, 3, 6, 7, 1, 5, 4], inputConvert: 'list', outputConvert: 'list' },
      { input: [[]], expected: [], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

用 \`odd\` / \`even\` 两个指针分别串联奇数位和偶数位节点，\`evenHead\` 记录偶数链表头。遍历完后把偶数链表接到奇数链表末尾。

\`\`\`js
function oddEvenList(head) {
  if (!head || !head.next) return head
  let odd = head, even = head.next, evenHead = even
  while (even && even.next) {
    odd.next = even.next
    odd = odd.next
    even.next = odd.next
    even = even.next
  }
  odd.next = evenHead
  return head
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-176',
    no: '176',
    title: '合并K个升序链表',
    difficulty: '困难',
    tags: ['链表', '堆'],
    desc: `给你一个链表数组 \`lists\`，其中每个链表已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表（以数组形式返回）。

示例 1：
\`\`\`
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
\`\`\`

示例 2：
\`\`\`
输入：lists = []
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：lists = [[],[1]]
输出：[1]
\`\`\``,
    functionName: 'mergeKLists',
    starterCode: 'function mergeKLists(lists) {\n  // 写你的代码\n  return []\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6], inputConvert: null, outputConvert: null },
      { input: [[]], expected: [], inputConvert: null, outputConvert: null },
      { input: [[[], [1]]], expected: [1], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先把每个数组转成链表，再借助分治（两两合并）或小顶堆合并。这里采用每次从所有链表头中选最小值接到结果链表，最后转回数组返回。时间复杂度 O(N·K)，用堆可优化到 O(N log K)。

\`\`\`js
function mergeKLists(lists) {
  const heads = (lists || []).map(arr => arrayToList(arr))
  const dummy = new ListNode(0)
  let cur = dummy
  while (true) {
    let minIdx = -1
    for (let i = 0; i < heads.length; i++) {
      if (heads[i] && (minIdx === -1 || heads[i].val < heads[minIdx].val)) minIdx = i
    }
    if (minIdx === -1) break
    cur.next = heads[minIdx]
    cur = cur.next
    heads[minIdx] = heads[minIdx].next
  }
  cur.next = null
  return listToArray(dummy.next)
}
\`\`\``,
    timeComplexity: 'O(N·K)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'algo-177',
    no: '177',
    title: '反转链表 II',
    difficulty: '困难',
    tags: ['链表'],
    desc: `给你单链表的头指针 \`head\` 和两个整数 \`left\` 和 \`right\`，其中 \`left <= right\`。请你反转从位置 \`left\` 到位置 \`right\` 的链表节点，返回反转后的链表。

示例 1：
\`\`\`
输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]
\`\`\`

示例 2：
\`\`\`
输入：head = [5], left = 1, right = 1
输出：[5]
\`\`\`

示例 3：
\`\`\`
输入：head = [1,2,3,4,5], left = 1, right = 5
输出：[5,4,3,2,1]
\`\`\``,
    functionName: 'reverseBetween',
    starterCode: 'function reverseBetween(head, left, right) {\n  // 写你的代码\n  return head\n}',
    setup: LINKED_LIST_SETUP,
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2, 4], expected: [1, 4, 3, 2, 5], inputConvert: 'list', outputConvert: 'list' },
      { input: [[5], 1, 1], expected: [5], inputConvert: 'list', outputConvert: 'list' },
      { input: [[1, 2, 3, 4, 5], 1, 5], expected: [5, 4, 3, 2, 1], inputConvert: 'list', outputConvert: 'list' }
    ],
    solution: `## 思路

哑节点 + 头插法：先走到 \`left\` 前一个节点 \`prev\`，然后对 \`right - left\` 个节点执行头插：把 \`cur.next\` 摘下插到 \`prev\` 之后，逐个把区间反转。

\`\`\`js
function reverseBetween(head, left, right) {
  const dummy = new ListNode(0)
  dummy.next = head
  let prev = dummy
  for (let i = 1; i < left; i++) prev = prev.next
  let cur = prev.next
  for (let i = 0; i < right - left; i++) {
    const next = cur.next
    cur.next = next.next
    next.next = prev.next
    prev.next = next
  }
  return dummy.next
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // ====================== 树（13 道，id 178-190）======================
  {
    id: 'algo-178',
    no: '178',
    title: '二叉树的最大深度',
    difficulty: '简单',
    tags: ['树', '递归'],
    desc: `给定一个二叉树 \`root\`，返回其最大深度。二叉树的最大深度是指从根节点到最远叶子节点的最长路径上的节点数。

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
      { input: [[3, 9, 20, null, null, 15, 7]], expected: 3, inputConvert: 'tree', outputConvert: null },
      { input: [[1, null, 2]], expected: 2, inputConvert: 'tree', outputConvert: null },
      { input: [[]], expected: 0, inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

递归：一棵树的最大深度等于 1 + max(左子树深度, 右子树深度)，空树深度为 0。

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
    id: 'algo-179',
    no: '179',
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
      { input: [[1, 2, 2, 3, 4, 4, 3]], expected: true, inputConvert: 'tree', outputConvert: null },
      { input: [[1, 2, 2, null, 3, null, 3]], expected: false, inputConvert: 'tree', outputConvert: null },
      { input: [[]], expected: true, inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

转化为判断左右子树是否互为镜像：两棵树镜像当且仅当根值相等，且 A 的左子树与 B 的右子树镜像、A 的右子树与 B 的左子树镜像。

\`\`\`js
function isSymmetric(root) {
  if (!root) return true
  function isMirror(a, b) {
    if (!a && !b) return true
    if (!a || !b) return false
    return a.val === b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left)
  }
  return isMirror(root.left, root.right)
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-180',
    no: '180',
    title: '翻转二叉树',
    difficulty: '简单',
    tags: ['树', '递归'],
    desc: `给你一棵二叉树的根节点 \`root\`，翻转这棵二叉树，并返回其根节点。翻转即将每个节点的左右子树交换。

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
      { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1], inputConvert: 'tree', outputConvert: 'tree' },
      { input: [[2, 1, 3]], expected: [2, 3, 1], inputConvert: 'tree', outputConvert: 'tree' },
      { input: [[]], expected: [], inputConvert: 'tree', outputConvert: 'tree' }
    ],
    solution: `## 思路

递归翻转：先翻转左右子树，再交换当前节点的左右孩子，最后返回当前节点。

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
    id: 'algo-181',
    no: '181',
    title: '二叉树的前序遍历',
    difficulty: '简单',
    tags: ['树', '遍历'],
    desc: `给你二叉树的根节点 \`root\`，返回它节点值的前序遍历（根 → 左 → 右）。

示例 1：
\`\`\`
输入：root = [1,null,2,3]
输出：[1,2,3]
\`\`\`

示例 2：
\`\`\`
输入：root = []
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：root = [1]
输出：[1]
\`\`\``,
    functionName: 'preorderTraversal',
    starterCode: 'function preorderTraversal(root) {\n  // 写你的代码\n  return []\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[1, null, 2, 3]], expected: [1, 2, 3], inputConvert: 'tree', outputConvert: null },
      { input: [[]], expected: [], inputConvert: 'tree', outputConvert: null },
      { input: [[1]], expected: [1], inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

递归：先访问根，再遍历左子树，最后遍历右子树。也可用栈做迭代版本。

\`\`\`js
function preorderTraversal(root) {
  const result = []
  function dfs(node) {
    if (!node) return
    result.push(node.val)
    dfs(node.left)
    dfs(node.right)
  }
  dfs(root)
  return result
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-182',
    no: '182',
    title: '平衡二叉树',
    difficulty: '简单',
    tags: ['树', '递归'],
    desc: `给定一个二叉树，判断它是否是高度平衡的二叉树。本题中，一棵高度平衡二叉树定义为：一个二叉树每个节点的左右两个子树的高度差的绝对值不超过 1。

示例 1：
\`\`\`
输入：root = [3,9,20,null,null,15,7]
输出：true
\`\`\`

示例 2：
\`\`\`
输入：root = [1,2,2,3,3,null,null,4,4]
输出：false
\`\`\`

示例 3：
\`\`\`
输入：root = []
输出：true
\`\`\``,
    functionName: 'isBalanced',
    starterCode: 'function isBalanced(root) {\n  // 写你的代码\n  return false\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: true, inputConvert: 'tree', outputConvert: null },
      { input: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false, inputConvert: 'tree', outputConvert: null },
      { input: [[]], expected: true, inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

自底向上递归：\`check\` 返回子树高度，若某子树已不平衡则返回 -1 提前剪枝；否则比较左右子树高度差是否超过 1。

\`\`\`js
function isBalanced(root) {
  function check(node) {
    if (!node) return 0
    const left = check(node.left)
    if (left === -1) return -1
    const right = check(node.right)
    if (right === -1) return -1
    if (Math.abs(left - right) > 1) return -1
    return 1 + Math.max(left, right)
  }
  return check(root) !== -1
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-183',
    no: '183',
    title: '二叉树的中序遍历',
    difficulty: '中等',
    tags: ['树', '遍历'],
    desc: `给定一个二叉树的根节点 \`root\`，返回它的中序遍历（左 → 根 → 右）。

示例 1：
\`\`\`
输入：root = [1,null,2,3]
输出：[1,3,2]
\`\`\`

示例 2：
\`\`\`
输入：root = []
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：root = [1]
输出：[1]
\`\`\``,
    functionName: 'inorderTraversal',
    starterCode: 'function inorderTraversal(root) {\n  // 写你的代码\n  return []\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[1, null, 2, 3]], expected: [1, 3, 2], inputConvert: 'tree', outputConvert: null },
      { input: [[]], expected: [], inputConvert: 'tree', outputConvert: null },
      { input: [[1]], expected: [1], inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

递归：先遍历左子树，再访问根，最后遍历右子树。也可用栈模拟迭代过程。

\`\`\`js
function inorderTraversal(root) {
  const result = []
  function dfs(node) {
    if (!node) return
    dfs(node.left)
    result.push(node.val)
    dfs(node.right)
  }
  dfs(root)
  return result
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-184',
    no: '184',
    title: '二叉树的层序遍历',
    difficulty: '中等',
    tags: ['树', 'BFS'],
    desc: `给你二叉树的根节点 \`root\`，返回其节点值的层序遍历（即逐层地，从左到右访问所有节点）。

示例 1：
\`\`\`
输入：root = [3,9,20,null,null,15,7]
输出：[[3],[9,20],[15,7]]
\`\`\`

示例 2：
\`\`\`
输入：root = [1]
输出：[[1]]
\`\`\`

示例 3：
\`\`\`
输入：root = []
输出：[]
\`\`\``,
    functionName: 'levelOrder',
    starterCode: 'function levelOrder(root) {\n  // 写你的代码\n  return []\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]], inputConvert: 'tree', outputConvert: null },
      { input: [[1]], expected: [[1]], inputConvert: 'tree', outputConvert: null },
      { input: [[]], expected: [], inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

BFS：用队列，每次取当前层全部节点（记录队列长度），把值放入当前层结果，孩子入队。

\`\`\`js
function levelOrder(root) {
  if (!root) return []
  const result = []
  const queue = [root]
  while (queue.length) {
    const level = []
    const size = queue.length
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      level.push(node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    result.push(level)
  }
  return result
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-185',
    no: '185',
    title: '验证二叉搜索树',
    difficulty: '中等',
    tags: ['树', '二叉搜索树'],
    desc: `给你一个二叉树的根节点 \`root\`，判断其是否是一个有效的二叉搜索树（BST）。有效 BST 定义：节点的左子树只包含小于当前节点的数；节点的右子树只包含大于当前节点的数；所有左子树和右子树自身必须也是 BST。

示例 1：
\`\`\`
输入：root = [2,1,3]
输出：true
\`\`\`

示例 2：
\`\`\`
输入：root = [5,1,4,null,null,3,6]
输出：false
\`\`\`

示例 3：
\`\`\`
输入：root = []
输出：true
\`\`\``,
    functionName: 'isValidBST',
    starterCode: 'function isValidBST(root) {\n  // 写你的代码\n  return false\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[2, 1, 3]], expected: true, inputConvert: 'tree', outputConvert: null },
      { input: [[5, 1, 4, null, null, 3, 6]], expected: false, inputConvert: 'tree', outputConvert: null },
      { input: [[]], expected: true, inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

递归传递上下界 \`(low, high)\`：每个节点值必须严格落在 \`(low, high)\` 区间内，左子树更新上界为当前值，右子树更新下界为当前值。

\`\`\`js
function isValidBST(root) {
  function validate(node, low, high) {
    if (!node) return true
    if (node.val <= low || node.val >= high) return false
    return validate(node.left, low, node.val) && validate(node.right, node.val, high)
  }
  return validate(root, -Infinity, Infinity)
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-186',
    no: '186',
    title: '二叉搜索树中第K小的元素',
    difficulty: '中等',
    tags: ['树', '二叉搜索树'],
    desc: `给定一个二叉搜索树的根节点 \`root\`，和一个整数 \`k\`，请你设计一个算法查找其中第 \`k\` 小的元素（1 <= k <= 树中元素个数）。

示例 1：
\`\`\`
输入：root = [3,1,4,null,2], k = 1
输出：1
\`\`\`

示例 2：
\`\`\`
输入：root = [5,3,6,2,4,null,null,1], k = 3
输出：3
\`\`\`

示例 3：
\`\`\`
输入：root = [1], k = 1
输出：1
\`\`\``,
    functionName: 'kthSmallest',
    starterCode: 'function kthSmallest(root, k) {\n  // 写你的代码\n  return 0\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[3, 1, 4, null, 2], 1], expected: 1, inputConvert: 'tree', outputConvert: null },
      { input: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3, inputConvert: 'tree', outputConvert: null },
      { input: [[1], 1], expected: 1, inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

BST 中序遍历得到升序序列。用栈模拟中序遍历，每弹出一个节点就令 \`k--\`，\`k\` 为 0 时返回该节点值。

\`\`\`js
function kthSmallest(root, k) {
  const stack = []
  let cur = root
  while (cur || stack.length) {
    while (cur) { stack.push(cur); cur = cur.left }
    cur = stack.pop()
    k--
    if (k === 0) return cur.val
    cur = cur.right
  }
}
\`\`\``,
    timeComplexity: 'O(h+k)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-187',
    no: '187',
    title: '二叉树的最近公共祖先',
    difficulty: '中等',
    tags: ['树', '递归'],
    desc: `给定一个二叉树，找到该树中两个指定节点的最近公共祖先（LCA）。最近公共祖先定义为：「对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大」。这里 p、q 以节点值给出，函数返回 LCA 的节点值。

示例 1：
\`\`\`
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出：3
\`\`\`

示例 2：
\`\`\`
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
输出：5
\`\`\`

示例 3：
\`\`\`
输入：root = [1,2], p = 1, q = 2
输出：1
\`\`\``,
    functionName: 'lowestCommonAncestor',
    starterCode: 'function lowestCommonAncestor(root, p, q) {\n  // 写你的代码\n  return 0\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3, inputConvert: 'tree', outputConvert: null },
      { input: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], expected: 5, inputConvert: 'tree', outputConvert: null },
      { input: [[1, 2], 1, 2], expected: 1, inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

递归：若当前节点等于 p 或 q，则返回当前节点值；否则在左右子树中查找。若左右子树各返回非空，说明当前节点就是 LCA；若只有一侧非空，则 LCA 在那一侧。

\`\`\`js
function lowestCommonAncestor(root, p, q) {
  if (!root) return null
  if (root.val === p || root.val === q) return root.val
  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)
  if (left !== null && right !== null) return root.val
  return left !== null ? left : right
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-188',
    no: '188',
    title: '路径总和 II',
    difficulty: '中等',
    tags: ['树', '回溯'],
    desc: `给你二叉树的根节点 \`root\` 和一个整数目标和 \`targetSum\`，找出所有从根节点到叶子节点路径总和等于给定目标和的路径。叶子节点是指没有子节点的节点。

示例 1：
\`\`\`
输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
输出：[[5,4,11,7],[5,8,4,5]]
\`\`\`

示例 2：
\`\`\`
输入：root = [1,2,3], targetSum = 3
输出：[[1,2]]
\`\`\`

示例 3：
\`\`\`
输入：root = [], targetSum = 1
输出：[]
\`\`\``,
    functionName: 'pathSum',
    starterCode: 'function pathSum(root, targetSum) {\n  // 写你的代码\n  return []\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22], expected: [[5, 4, 11, 2], [5, 8, 4, 5]], inputConvert: 'tree', outputConvert: null },
      { input: [[1, 2, 3], 3], expected: [[1, 2]], inputConvert: 'tree', outputConvert: null },
      { input: [[], 1], expected: [], inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

DFS 回溯：维护当前路径与剩余目标和，到达叶子且剩余值等于节点值时记录一条路径。递归返回时记得回溯（弹出当前节点）。

\`\`\`js
function pathSum(root, targetSum) {
  const result = []
  function dfs(node, path, remaining) {
    if (!node) return
    path.push(node.val)
    if (!node.left && !node.right && remaining === node.val) {
      result.push([...path])
    }
    dfs(node.left, path, remaining - node.val)
    dfs(node.right, path, remaining - node.val)
    path.pop()
  }
  dfs(root, [], targetSum)
  return result
}
\`\`\``,
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-189',
    no: '189',
    title: '二叉树中的最大路径和',
    difficulty: '困难',
    tags: ['树', '递归'],
    desc: `二叉树中的路径被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中至多出现一次。该路径至少包含一个节点，且不一定经过根节点。路径和是路径中各节点值的总和。给你一个二叉树的根节点 \`root\`，返回其最大路径和。

示例 1：
\`\`\`
输入：root = [1,2,3]
输出：6
\`\`\`

示例 2：
\`\`\`
输入：root = [-10,9,20,null,null,15,7]
输出：42
\`\`\`

示例 3：
\`\`\`
输入：root = [-3]
输出：-3
\`\`\``,
    functionName: 'maxPathSum',
    starterCode: 'function maxPathSum(root) {\n  // 写你的代码\n  return 0\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[1, 2, 3]], expected: 6, inputConvert: 'tree', outputConvert: null },
      { input: [[-10, 9, 20, null, null, 15, 7]], expected: 42, inputConvert: 'tree', outputConvert: null },
      { input: [[-3]], expected: -3, inputConvert: 'tree', outputConvert: null }
    ],
    solution: `## 思路

递归计算以每个节点为「最高点」的路径和（左贡献 + 节点值 + 右贡献），同时返回以该节点为端点向下的最大单链贡献（节点值 + max(左, 右)）。负贡献按 0 处理。用全局变量维护最大值。

\`\`\`js
function maxPathSum(root) {
  let maxSum = -Infinity
  function gain(node) {
    if (!node) return 0
    const left = Math.max(gain(node.left), 0)
    const right = Math.max(gain(node.right), 0)
    maxSum = Math.max(maxSum, node.val + left + right)
    return node.val + Math.max(left, right)
  }
  gain(root)
  return maxSum
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'algo-190',
    no: '190',
    title: '序列化和反序列化二叉树',
    difficulty: '困难',
    tags: ['树', '设计'],
    desc: `序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境。请设计一个算法来实现二叉树的序列化与反序列化。这里函数 \`serializeDeserialize\` 接收一棵树，先将其序列化为字符串，再反序列化回树并返回，要求结果与原树等价（以数组形式比对）。

示例 1：
\`\`\`
输入：root = [1,2,3]
输出：[1,2,3]
\`\`\`

示例 2：
\`\`\`
输入：root = []
输出：[]
\`\`\`

示例 3：
\`\`\`
输入：root = [1,2,3,null,null,4,5]
输出：[1,2,3,null,null,4,5]
\`\`\``,
    functionName: 'serializeDeserialize',
    starterCode: 'function serializeDeserialize(root) {\n  // 写你的代码\n  return root\n}',
    setup: TREE_SETUP,
    testCases: [
      { input: [[1, 2, 3]], expected: [1, 2, 3], inputConvert: 'tree', outputConvert: 'tree' },
      { input: [[]], expected: [], inputConvert: 'tree', outputConvert: 'tree' },
      { input: [[1, 2, 3, null, null, 4, 5]], expected: [1, 2, 3, null, null, 4, 5], inputConvert: 'tree', outputConvert: 'tree' }
    ],
    solution: `## 思路

用层序（BFS）序列化为 JSON 数组字符串（null 占位，末尾去多余 null），反序列化时再用队列按层序重建。本题为可测试性把两个过程串成一个函数：先序列化再反序列化，返回重建后的树。

\`\`\`js
function serializeDeserialize(root) {
  function serialize(node) {
    if (!node) return '[]'
    const result = []
    const queue = [node]
    while (queue.length) {
      const cur = queue.shift()
      if (cur) {
        result.push(cur.val)
        queue.push(cur.left)
        queue.push(cur.right)
      } else {
        result.push(null)
      }
    }
    while (result.length && result[result.length - 1] === null) result.pop()
    return JSON.stringify(result)
  }
  function deserialize(data) {
    const arr = JSON.parse(data)
    if (!arr || arr.length === 0) return null
    const root = new TreeNode(arr[0])
    const queue = [root]
    let i = 1
    while (queue.length && i < arr.length) {
      const node = queue.shift()
      if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left) }
      i++
      if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right) }
      i++
    }
    return root
  }
  return deserialize(serialize(root))
}
\`\`\``,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },

  // ====================== 图与并查集（10 道，id 191-200）======================
  {
    id: 'algo-191',
    no: '191',
    title: '找到小镇的法官',
    difficulty: '简单',
    tags: ['图'],
    desc: `小镇里有 \`n\` 个人，编号从 1 到 n。其中有一个人是法官。法官满足：所有人都信任法官（除他自己外），法官不信任任何人。给定数组 \`trust\`，其中 \`trust[i] = [a, b]\` 表示编号为 a 的人信任编号为 b 的人。如果法官存在且唯一，返回法官编号；否则返回 -1。

示例 1：
\`\`\`
输入：n = 2, trust = [[1,2]]
输出：2
\`\`\`

示例 2：
\`\`\`
输入：n = 3, trust = [[1,3],[2,3]]
输出：3
\`\`\`

示例 3：
\`\`\`
输入：n = 1, trust = []
输出：1
\`\`\``,
    functionName: 'findJudge',
    starterCode: 'function findJudge(n, trust) {\n  // 写你的代码\n  return -1\n}',
    setup: '',
    testCases: [
      { input: [2, [[1, 2]]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [3, [[1, 3], [2, 3]]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [1, []], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

用一个信任分数数组：a 信任 b 时 \`score[a]--\`、\`score[b]++\`。法官不信任任何人且被所有人信任，所以 \`score[judge] === n - 1\`。

\`\`\`js
function findJudge(n, trust) {
  const score = new Array(n + 1).fill(0)
  for (const [a, b] of trust) {
    score[a]--
    score[b]++
  }
  for (let i = 1; i <= n; i++) {
    if (score[i] === n - 1) return i
  }
  return -1
}
\`\`\``,
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-192',
    no: '192',
    title: '连通分量个数',
    difficulty: '简单',
    tags: ['图', '并查集'],
    desc: `给定编号从 0 到 n-1 的 n 个节点和一个无向边数组 \`edges\`，其中 \`edges[i] = [a, b]\` 表示节点 a 和 b 之间有一条边。返回图中连通分量的个数。

示例 1：
\`\`\`
输入：n = 5, edges = [[0,1],[1,2],[3,4]]
输出：2
\`\`\`

示例 2：
\`\`\`
输入：n = 3, edges = [[0,1],[1,2],[0,2]]
输出：1
\`\`\`

示例 3：
\`\`\`
输入：n = 1, edges = []
输出：1
\`\`\``,
    functionName: 'countComponents',
    starterCode: 'function countComponents(n, edges) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [3, [[0, 1], [1, 2], [0, 2]]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [1, []], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

并查集：初始每个节点自成一集合（共 n 个），遍历每条边把两端 union，最后统计 parent[i] === i 的根节点个数即为连通分量数。带路径压缩让 find 近似 O(1)。

\`\`\`js
function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i)
  function find(x) {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] }
    return x
  }
  function union(x, y) {
    const px = find(x), py = find(y)
    if (px !== py) parent[px] = py
  }
  for (const [a, b] of edges) union(a, b)
  let count = 0
  for (let i = 0; i < n; i++) if (parent[i] === i) count++
  return count
}
\`\`\``,
    timeComplexity: 'O(n + m·α(n))',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-193',
    no: '193',
    title: '岛屿数量',
    difficulty: '中等',
    tags: ['图', 'DFS'],
    desc: `给你一个由 \`'1'\`（陆地）和 \`'0'\`（水）组成的二维网格 \`grid\`，请你计算网格中岛屿的数量。岛屿总是被水包围，并且每座岛屿只能由水平方向和/或垂直方向上相邻的陆地连接形成。

示例 1：
\`\`\`
输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1
\`\`\`

示例 2：
\`\`\`
输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3
\`\`\`

示例 3：
\`\`\`
输入：grid = [["0"]]
输出：0
\`\`\``,
    functionName: 'numIslands',
    starterCode: 'function numIslands(grid) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[["0"]]], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

遍历每个格子，遇到 \`'1'\` 就把岛屿计数加 1，并用 DFS 把与之相连的所有陆地标记为 \`'0'\`（沉岛），避免重复计数。

\`\`\`js
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0
  const rows = grid.length, cols = grid[0].length
  let count = 0
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return
    grid[r][c] = '0'
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; dfs(r, c) }
    }
  }
  return count
}
\`\`\``,
    timeComplexity: 'O(r·c)',
    spaceComplexity: 'O(r·c)'
  },
  {
    id: 'algo-194',
    no: '194',
    title: '岛屿的最大面积',
    difficulty: '中等',
    tags: ['图', 'DFS'],
    desc: `给你一个大小为 \`m x n\` 的二进制矩阵 \`grid\`。岛屿是由一些相邻的 \`1\`（土地）构成的组合，这里的「相邻」要求两个 \`1\` 必须在水平或垂直方向上相邻。岛屿的面积是岛上值为 1 的单元格的数目。返回最大岛屿的面积，没有岛屿时返回 0。

示例 1：
\`\`\`
输入：grid = [[1,1],[1,1]]
输出：4
\`\`\`

示例 2：
\`\`\`
输入：grid = [[1,0],[0,1]]
输出：1
\`\`\`

示例 3：
\`\`\`
输入：grid = [[0,0],[0,0]]
输出：0
\`\`\``,
    functionName: 'maxAreaOfIsland',
    starterCode: 'function maxAreaOfIsland(grid) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[[1, 1], [1, 1]]], expected: 4, inputConvert: null, outputConvert: null },
      { input: [[[1, 0], [0, 1]]], expected: 1, inputConvert: null, outputConvert: null },
      { input: [[[0, 0], [0, 0]]], expected: 0, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

遍历每个格子，遇到 1 就用 DFS 累计当前岛屿面积（同时把访问过的格子置 0 防重复），更新最大值。

\`\`\`js
function maxAreaOfIsland(grid) {
  if (!grid || grid.length === 0) return 0
  const rows = grid.length, cols = grid[0].length
  let maxArea = 0
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 1) return 0
    grid[r][c] = 0
    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) maxArea = Math.max(maxArea, dfs(r, c))
    }
  }
  return maxArea
}
\`\`\``,
    timeComplexity: 'O(r·c)',
    spaceComplexity: 'O(r·c)'
  },
  {
    id: 'algo-195',
    no: '195',
    title: '克隆图',
    difficulty: '中等',
    tags: ['图', 'DFS'],
    desc: `给你无向连通图中一个节点的引用，请你返回该图的深拷贝（克隆）。图以邻接表 \`adjList\` 给出，\`adjList[i]\` 表示节点 i+1 的邻居列表（节点值从 1 到 n）。函数返回克隆图的邻接表（与输入结构一致）。

示例 1：
\`\`\`
输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
输出：[[2,4],[1,3],[2,4],[1,3]]
\`\`\`

示例 2：
\`\`\`
输入：adjList = [[]]
输出：[[]]
\`\`\`

示例 3：
\`\`\`
输入：adjList = []
输出：[]
\`\`\``,
    functionName: 'cloneGraph',
    starterCode: 'function cloneGraph(adjList) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]], inputConvert: null, outputConvert: null },
      { input: [[[]]], expected: [[]], inputConvert: null, outputConvert: null },
      { input: [[]], expected: [], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

先按邻接表构建原图节点，用哈希表建立「原节点 → 克隆节点」映射；再遍历每个节点，把邻居的克隆加入克隆节点的邻居列表。最后按节点值顺序输出邻接表。

\`\`\`js
function cloneGraph(adjList) {
  if (!adjList || adjList.length === 0) return []
  const n = adjList.length
  const map = new Map()
  function getNode(val) {
    if (!map.has(val)) map.set(val, { val, neighbors: [] })
    return map.get(val)
  }
  for (let i = 0; i < n; i++) {
    const node = getNode(i + 1)
    for (const nb of adjList[i]) node.neighbors.push(getNode(nb))
  }
  const result = []
  for (let i = 1; i <= n; i++) {
    result.push(map.get(i).neighbors.map(x => x.val).sort((a, b) => a - b))
  }
  return result
}
\`\`\``,
    timeComplexity: 'O(n + e)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-196',
    no: '196',
    title: '课程表',
    difficulty: '中等',
    tags: ['图', '拓扑排序'],
    desc: `你这个学期必须选修 \`numCourses\` 门课程，记为 0 到 numCourses-1。\`prerequisites[i] = [a, b]\` 表示要先修 b 才能修 a。请你判断是否可能完成所有课程的学习。

示例 1：
\`\`\`
输入：numCourses = 2, prerequisites = [[1,0]]
输出：true
\`\`\`

示例 2：
\`\`\`
输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
输出：false
\`\`\`

示例 3：
\`\`\`
输入：numCourses = 1, prerequisites = []
输出：true
\`\`\``,
    functionName: 'canFinish',
    starterCode: 'function canFinish(numCourses, prerequisites) {\n  // 写你的代码\n  return false\n}',
    setup: '',
    testCases: [
      { input: [2, [[1, 0]]], expected: true, inputConvert: null, outputConvert: null },
      { input: [2, [[1, 0], [0, 1]]], expected: false, inputConvert: null, outputConvert: null },
      { input: [1, []], expected: true, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

拓扑排序（Kahn 算法）：建邻接表与入度数组，把入度为 0 的节点入队，每次出队一个节点并把它的后继入度减 1，入度为 0 再入队。若最终访问的节点数等于课程数则可完成。

\`\`\`js
function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => [])
  const inDegree = new Array(numCourses).fill(0)
  for (const [c, p] of prerequisites) { adj[p].push(c); inDegree[c]++ }
  const queue = []
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i)
  let count = 0
  while (queue.length) {
    const cur = queue.shift()
    count++
    for (const next of adj[cur]) {
      if (--inDegree[next] === 0) queue.push(next)
    }
  }
  return count === numCourses
}
\`\`\``,
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)'
  },
  {
    id: 'algo-197',
    no: '197',
    title: '课程表 II',
    difficulty: '中等',
    tags: ['图', '拓扑排序'],
    desc: `现在你总共有 \`numCourses\` 门课需要选，记为 0 到 numCourses-1。\`prerequisites[i] = [a, b]\` 表示要先修 b 才能修 a。返回你为了学完所有课程所安排的学习顺序。如果不可能完成所有课程，返回空数组。如果存在多个合法顺序，返回其中任意一个。

示例 1：
\`\`\`
输入：numCourses = 2, prerequisites = [[1,0]]
输出：[0,1]
\`\`\`

示例 2：
\`\`\`
输入：numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
输出：[0,1,2,3]
\`\`\`

示例 3：
\`\`\`
输入：numCourses = 1, prerequisites = []
输出：[0]
\`\`\``,
    functionName: 'findOrder',
    starterCode: 'function findOrder(numCourses, prerequisites) {\n  // 写你的代码\n  return []\n}',
    setup: '',
    testCases: [
      { input: [2, [[1, 0]]], expected: [0, 1], inputConvert: null, outputConvert: null },
      { input: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: [0, 1, 2, 3], inputConvert: null, outputConvert: null },
      { input: [1, []], expected: [0], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

与「课程表」相同的 Kahn 拓扑排序，区别在于把每次出队的节点依次记录到结果数组；若结果长度等于课程数则返回结果，否则返回空数组（存在环）。

\`\`\`js
function findOrder(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => [])
  const inDegree = new Array(numCourses).fill(0)
  for (const [c, p] of prerequisites) { adj[p].push(c); inDegree[c]++ }
  const queue = []
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i)
  const result = []
  while (queue.length) {
    const cur = queue.shift()
    result.push(cur)
    for (const next of adj[cur]) {
      if (--inDegree[next] === 0) queue.push(next)
    }
  }
  return result.length === numCourses ? result : []
}
\`\`\``,
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)'
  },
  {
    id: 'algo-198',
    no: '198',
    title: '省份数量',
    difficulty: '中等',
    tags: ['图', '并查集'],
    desc: `有 \`n\` 个城市，其中一些彼此相连，另一些没有相连。如果城市 a 与城市 b 直接相连，且城市 b 与城市 c 直接相连，那么城市 a 与城市 c 间接相连。省份是一组直接或间接相连的城市，组内不含其他没有相连的城市。给你一个 \`n x n\` 的矩阵 \`isConnected\`，其中 \`isConnected[i][j] = 1\` 表示第 i 个城市和第 j 个城市直接相连，返回矩阵中省份的数量。

示例 1：
\`\`\`
输入：isConnected = [[1,1,0],[1,1,0],[0,0,1]]
输出：2
\`\`\`

示例 2：
\`\`\`
输入：isConnected = [[1,0,0],[0,1,0],[0,0,1]]
输出：3
\`\`\`

示例 3：
\`\`\`
输入：isConnected = [[1,0,0,1],[0,1,1,0],[0,1,1,1],[1,0,1,1]]
输出：1
\`\`\``,
    functionName: 'findCircleNum',
    starterCode: 'function findCircleNum(isConnected) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expected: 2, inputConvert: null, outputConvert: null },
      { input: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], expected: 3, inputConvert: null, outputConvert: null },
      { input: [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]], expected: 1, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

DFS：把每个城市看作节点，遍历每个未访问城市，启动 DFS 标记与之直接相连的所有城市，一次 DFS 就找到一个省份。也可用并查集实现。

\`\`\`js
function findCircleNum(isConnected) {
  const n = isConnected.length
  const visited = new Array(n).fill(false)
  let count = 0
  function dfs(i) {
    for (let j = 0; j < n; j++) {
      if (isConnected[i][j] === 1 && !visited[j]) {
        visited[j] = true
        dfs(j)
      }
    }
  }
  for (let i = 0; i < n; i++) {
    if (!visited[i]) { count++; visited[i] = true; dfs(i) }
  }
  return count
}
\`\`\``,
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-199',
    no: '199',
    title: '单词接龙',
    difficulty: '困难',
    tags: ['图', 'BFS'],
    desc: `字典 \`wordList\` 中从单词 \`beginWord\` 到 \`endWord\` 的转换序列是一个按下述规格构成的序列：序列中第一个单词是 \`beginWord\`，最后一个单词是 \`endWord\`，每次转换只能改变一个字母，转换过程中的中间单词必须存在于 \`wordList\` 中。返回从 \`beginWord\` 到 \`endWord\` 的最短转换序列的长度。如果不存在，返回 0。

示例 1：
\`\`\`
输入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
输出：5
解释：hit -> hot -> dot -> dog -> cog，共 5 个单词
\`\`\`

示例 2：
\`\`\`
输入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
输出：0
解释：endWord "cog" 不在字典中，无法转换
\`\`\`

示例 3：
\`\`\`
输入：beginWord = "a", endWord = "c", wordList = ["a","b","c"]
输出：2
\`\`\``,
    functionName: 'ladderLength',
    starterCode: 'function ladderLength(beginWord, endWord, wordList) {\n  // 写你的代码\n  return 0\n}',
    setup: '',
    testCases: [
      { input: ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]], expected: 5, inputConvert: null, outputConvert: null },
      { input: ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]], expected: 0, inputConvert: null, outputConvert: null },
      { input: ["a", "c", ["a", "b", "c"]], expected: 2, inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

BFS 求最短路径：从 \`beginWord\` 出发，对每个单词逐位替换 a-z 字母，若新单词在字典中且未访问过则入队，层数加 1，直到遇到 \`endWord\`。用 Set 加速查找与去重。

\`\`\`js
function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList)
  if (!wordSet.has(endWord)) return 0
  const queue = [[beginWord, 1]]
  const visited = new Set([beginWord])
  while (queue.length) {
    const [word, level] = queue.shift()
    if (word === endWord) return level
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const ch = String.fromCharCode(c)
        if (ch === word[i]) continue
        const newWord = word.slice(0, i) + ch + word.slice(i + 1)
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord)
          queue.push([newWord, level + 1])
        }
      }
    }
  }
  return 0
}
\`\`\``,
    timeComplexity: 'O(L·26·n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'algo-200',
    no: '200',
    title: '被围绕的区域',
    difficulty: '困难',
    tags: ['图', 'DFS'],
    desc: `给你一个 \`m x n\` 的矩阵 \`board\`，由若干字符 \`'X'\` 和 \`'O'\` 组成。找到所有被 \`'X'\` 围绕的区域，并将这些区域里所有的 \`'O'\` 用 \`'X'\` 填充。不被围绕的 \`'O'\` 是指与边界相连的 \`'O'\`。函数返回修改后的棋盘。

示例 1：
\`\`\`
输入：board = [
  ["X","X","X","X"],
  ["X","O","O","X"],
  ["X","X","O","X"],
  ["X","O","X","X"]
]
输出：[
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","O","X","X"]
]
\`\`\`

示例 2：
\`\`\`
输入：board = [["X"]]
输出：[["X"]]
\`\`\`

示例 3：
\`\`\`
输入：board = [["O","O"],["O","O"]]
输出：[["O","O"],["O","O"]]
\`\`\``,
    functionName: 'solve',
    starterCode: 'function solve(board) {\n  // 写你的代码\n  return board\n}',
    setup: '',
    testCases: [
      { input: [[["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]]], expected: [["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]], inputConvert: null, outputConvert: null },
      { input: [[["X"]]], expected: [["X"]], inputConvert: null, outputConvert: null },
      { input: [[["O", "O"], ["O", "O"]]], expected: [["O", "O"], ["O", "O"]], inputConvert: null, outputConvert: null }
    ],
    solution: `## 思路

逆向思考：从棋盘四条边上的 \`'O'\` 出发 DFS，把与之相连的 \`'O'\` 临时标记为 \`'#'\`（这些不被围绕）；然后遍历全棋盘，把剩下的 \`'O'\` 变 \`'X'\`，把 \`'#'\` 还原为 \`'O'\`。

\`\`\`js
function solve(board) {
  if (!board || board.length === 0) return board
  const rows = board.length, cols = board[0].length
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== 'O') return
    board[r][c] = '#'
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
  }
  for (let r = 0; r < rows; r++) { dfs(r, 0); dfs(r, cols - 1) }
  for (let c = 0; c < cols; c++) { dfs(0, c); dfs(rows - 1, c) }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'O') board[r][c] = 'X'
      else if (board[r][c] === '#') board[r][c] = 'O'
    }
  }
  return board
}
\`\`\``,
    timeComplexity: 'O(r·c)',
    spaceComplexity: 'O(r·c)'
  }
]
