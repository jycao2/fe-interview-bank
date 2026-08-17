// 校验所有算法题（直接 import 4 个 part 文件，绕过 @/ 别名）
import { part1Problems } from '../src/data/algo_part1.js'
import { part2Problems } from '../src/data/algo_part2.js'
import { part3Problems } from '../src/data/algo_part3.js'
import { part4Problems } from '../src/data/algo_part4.js'
import { LINKED_LIST_SETUP, TREE_SETUP } from '../src/utils/algorithmRunner.js'

// 模拟原 algorithmExam.js 中的 baseProblems（45 题用 import 链表/树 setup 字符串）
// 由于 @ 别名问题，这里把 setup 字段空着，仅校验 part1-4（共 155 道）的题解正确性
const allProblems = [
  ...part1Problems,
  ...part2Problems,
  ...part3Problems,
  ...part4Problems
]

let totalProblems = 0
let totalCases = 0
let failedProblems = 0
const failures = []

function extractCode(solution) {
  const m = String(solution || '').match(/```js\n([\s\S]*?)```/)
  return m ? m[1] : ''
}

function deepEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== typeof b) return false
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    return a.every((v, i) => deepEqual(v, b[i]))
  }
  if (typeof a === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b)
    if (ka.length !== kb.length) return false
    return ka.every(k => deepEqual(a[k], b[k]))
  }
  return false
}

// 链表反序列化（来自 algorithmRunner）
function buildList(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null
  const dummy = {}
  let cur = dummy
  for (const v of arr) {
    cur.next = { val: v, next: null }
    cur = cur.next
  }
  return dummy.next
}
function listToArray(head) {
  const out = []
  let cur = head, n = 0
  while (cur && n < 1000) { out.push(cur.val); cur = cur.next; n++ }
  return out
}
// 树反序列化（LeetCode 风格 [1,2,null,3]）
function buildTree(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null
  const root = { val: arr[0], left: null, right: null }
  const queue = [root]
  let i = 1
  while (queue.length && i < arr.length) {
    const node = queue.shift()
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.left = { val: arr[i], left: null, right: null }
      queue.push(node.left)
    }
    i++
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = { val: arr[i], left: null, right: null }
      queue.push(node.right)
    }
    i++
  }
  return root
}
function treeToArray(root) {
  if (!root) return []
  const out = []
  const queue = [root]
  while (queue.length) {
    const node = queue.shift()
    if (node) out.push(node.val); else { out.push(null); continue }
    queue.push(node.left)
    queue.push(node.right)
  }
  while (out.length && out[out.length - 1] === null) out.pop()
  return out
}

function convertInput(inputArr, type) {
  if (!type) return inputArr
  if (type === 'list') return inputArr.map(v => Array.isArray(v) ? buildList(v) : v)
  if (type === 'tree') return inputArr.map(v => Array.isArray(v) ? buildTree(v) : v)
  return inputArr
}
function convertOutput(out, type) {
  if (!type) return out
  if (type === 'list') return listToArray(out)
  if (type === 'tree') return treeToArray(out)
  return out
}

// 三个难度统计
const stats = { 简单: 0, 中等: 0, 困难: 0, 其他: 0 }
const tagStats = {}

for (const p of allProblems) {
  totalProblems++
  stats[p.difficulty] = (stats[p.difficulty] || stats['其他']) + 1
  for (const t of p.tags || []) {
    tagStats[t] = (tagStats[t] || 0) + 1
  }

  if (!p.id || !p.title || !p.functionName || !Array.isArray(p.testCases)) {
    failedProblems++
    failures.push({ id: p.id, title: p.title, reason: '结构字段缺失' })
    continue
  }
  const code = extractCode(p.solution)
  if (!code) {
    failedProblems++
    failures.push({ id: p.id, title: p.title, reason: 'solution 缺少 js 代码块' })
    continue
  }

  // 链表/树题：在用户代码前注入构造函数
  let fullCode = ''
  if (p.setup === LINKED_LIST_SETUP) fullCode = LINKED_LIST_SETUP + '\n' + code
  else if (p.setup === TREE_SETUP) fullCode = TREE_SETUP + '\n' + code
  else fullCode = code

  let fn
  try {
    // eslint-disable-next-line no-new-func
    fn = new Function(`${fullCode}\n; return typeof ${p.functionName} !== 'undefined' ? ${p.functionName} : null`)()
  } catch (e) {
    failedProblems++
    failures.push({ id: p.id, title: p.title, reason: '函数定义失败: ' + e.message })
    continue
  }
  if (typeof fn !== 'function') {
    failedProblems++
    failures.push({ id: p.id, title: p.title, reason: `函数 ${p.functionName} 未定义` })
    continue
  }

  for (let i = 0; i < p.testCases.length; i++) {
    const tc = p.testCases[i]
    totalCases++
    try {
      const args = Array.isArray(tc.input) ? tc.input : [tc.input]
      const convArgs = convertInput(args, tc.inputConvert)
      let out = fn(...convArgs)
      out = convertOutput(out, tc.outputConvert)
      if (!deepEqual(out, tc.expected)) {
        failures.push({
          id: p.id, title: p.title,
          reason: `用例 ${i + 1} 期望 ${JSON.stringify(tc.expected)} 实际 ${JSON.stringify(out)}`
        })
        failedProblems++
        break
      }
    } catch (e) {
      failures.push({ id: p.id, title: p.title, reason: `用例 ${i + 1} 抛错: ${e.message}` })
      failedProblems++
      break
    }
  }
}

console.log('────────────────────────────────────')
console.log('题库校验结果 (part1-4, 共 155 道)')
console.log('────────────────────────────────────')
console.log(`总题数: ${totalProblems}`)
console.log(`测试用例总数: ${totalCases}`)
console.log(`通过题数: ${totalProblems - failedProblems}`)
console.log(`失败题数: ${failedProblems}`)
console.log('难度分布:', stats)
console.log('标签分布:', tagStats)
console.log('────────────────────────────────────')
if (failures.length) {
  console.log('\n失败明细 (前 30 条):')
  failures.slice(0, 30).forEach(f => {
    console.log(`  ${f.id} ${f.title} → ${f.reason}`)
  })
  process.exit(1)
} else {
  console.log('✅ 全部通过')
  process.exit(0)
}
