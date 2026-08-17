/**
 * 算法判题器 —— 基于 Web Worker 的沙箱执行引擎
 *
 * 特性：
 * 1. 用户代码在独立 Worker 线程执行，不影响主线程 UI
 * 2. 超时自动 terminate（防死循环卡死）
 * 3. 支持 setup 预定义代码（ListNode / TreeNode 等辅助结构）
 * 4. 支持 inputConvert / outputConvert（链表/树与数组的互转）
 * 5. deepEqual 深度对比返回值与期望值
 */

// ─── Worker 内联代码（运行在 Worker 线程） ──────────────────────
const WORKER_CODE = `
self.onmessage = function(e) {
  var data = e.data
  var setup = data.setup || ''
  var userCode = data.userCode
  var functionName = data.functionName
  var testCases = data.testCases

  try {
    // 合并 setup + 用户代码并 eval
    var fullCode = setup + '\\n' + userCode
    eval(fullCode)

    // 取出目标函数
    var fn = eval(functionName)
    if (typeof fn !== 'function') {
      self.postMessage({ type: 'error', error: '函数 ' + functionName + ' 未定义或不是函数' })
      return
    }

    var results = []

    for (var i = 0; i < testCases.length; i++) {
      var tc = testCases[i]
      try {
        // 输入参数转换（如 arrayToList）
        var args = []
        for (var j = 0; j < tc.input.length; j++) {
          var arg = tc.input[j]
          if (tc.inputConvert && tc.inputConvert[j]) {
            var conv = eval(tc.inputConvert[j])
            if (typeof conv === 'function') arg = conv(arg)
          }
          args.push(arg)
        }

        // 调用用户函数
        var output = fn.apply(null, args)

        // 输出转换（如 listToArray）
        var finalOutput = output
        if (tc.outputConvert) {
          var outConv = eval(tc.outputConvert)
          if (typeof outConv === 'function') finalOutput = outConv(output)
        }

        // 深度对比
        var passed = deepEqual(finalOutput, tc.expected)

        results.push({
          index: i,
          passed: passed,
          input: formatValue(tc.input),
          expected: formatValue(tc.expected),
          output: formatValue(finalOutput),
          error: null
        })
      } catch (err) {
        results.push({
          index: i,
          passed: false,
          input: formatValue(tc.input),
          expected: formatValue(tc.expected),
          output: '',
          error: err.message
        })
      }
    }

    self.postMessage({ type: 'done', results: results })
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message })
  }
}

function deepEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return a === b
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    return a.every(function(v, i) { return deepEqual(v, b[i]) })
  }
  var ka = Object.keys(a), kb = Object.keys(b)
  if (ka.length !== kb.length) return false
  return ka.every(function(k) { return deepEqual(a[k], b[k]) })
}

function formatValue(v) {
  if (v === null) return 'null'
  if (v === undefined) return 'undefined'
  if (typeof v === 'string') return '"' + v + '"'
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) return '[' + v.map(formatValue).join(', ') + ']'
  if (typeof v === 'object') {
    try { return JSON.stringify(v) } catch(e) { return String(v) }
  }
  return String(v)
}
`

// ─── 预定义 setup 代码（链表 / 树辅助结构） ──────────────────
export const LINKED_LIST_SETUP = `function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val)
  this.next = (next === undefined ? null : next)
}
function arrayToList(arr) {
  if (!arr || arr.length === 0) return null
  var head = new ListNode(arr[0])
  var cur = head
  for (var i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i])
    cur = cur.next
  }
  return head
}
function listToArray(head) {
  var arr = []
  while (head) {
    arr.push(head.val)
    head = head.next
  }
  return arr
}`

export const TREE_SETUP = `function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}
function arrayToTree(arr) {
  if (!arr || arr.length === 0) return null
  var root = new TreeNode(arr[0])
  var queue = [root]
  var i = 1
  while (queue.length && i < arr.length) {
    var node = queue.shift()
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.left = new TreeNode(arr[i])
      queue.push(node.left)
    }
    i++
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = new TreeNode(arr[i])
      queue.push(node.right)
    }
    i++
  }
  return root
}
function treeToArray(root) {
  if (!root) return []
  var result = []
  var queue = [root]
  while (queue.length) {
    var node = queue.shift()
    if (node) {
      result.push(node.val)
      queue.push(node.left)
      queue.push(node.right)
    } else {
      result.push(null)
    }
  }
  while (result[result.length - 1] === null) result.pop()
  return result
}`

// ─── 对外 API ──────────────────────────────────────────────
/**
 * 运行算法判题
 * @param {string} userCode - 用户编写的代码
 * @param {string} functionName - 要调用的函数名
 * @param {Array} testCases - 测试用例数组
 * @param {string} setup - 预定义代码（辅助结构）
 * @param {number} timeout - 超时毫秒数
 * @returns {Promise<{passed: boolean, error: string|null, results: Array}>}
 */
export function runAlgorithm(userCode, functionName, testCases, setup = '', timeout = 5000) {
  return new Promise((resolve) => {
    let blob, url, worker, timer

    try {
      blob = new Blob([WORKER_CODE], { type: 'application/javascript' })
      url = URL.createObjectURL(blob)
      worker = new Worker(url)
    } catch (e) {
      resolve({ passed: false, error: '无法创建 Worker: ' + e.message, results: [] })
      return
    }

    const cleanup = () => {
      clearTimeout(timer)
      try { worker.terminate() } catch (_) {}
      URL.revokeObjectURL(url)
    }

    timer = setTimeout(() => {
      cleanup()
      resolve({
        passed: false,
        error: '执行超时（超过 ' + (timeout / 1000) + ' 秒，可能存在死循环）',
        results: []
      })
    }, timeout)

    worker.onmessage = (e) => {
      cleanup()
      const data = e.data
      if (data.type === 'error') {
        resolve({ passed: false, error: data.error, results: [] })
      } else {
        const results = Array.isArray(data.results) ? data.results : []
        resolve({
          passed: results.length > 0 && results.every(r => r.passed),
          error: null,
          results
        })
      }
    }

    worker.onerror = (e) => {
      cleanup()
      resolve({
        passed: false,
        error: e.message || 'Worker 执行错误',
        results: []
      })
    }

    // 关键修复：testCases 来自 Pinia store 是 reactive Proxy，无法被 structured clone
    // 必须先转成纯对象/数组才能 postMessage 到 Worker
    let plainTestCases
    try {
      plainTestCases = JSON.parse(JSON.stringify(testCases))
    } catch (e) {
      resolve({ passed: false, error: '测试用例序列化失败: ' + e.message, results: [] })
      cleanup()
      return
    }

    try {
      worker.postMessage({
        setup: String(setup || ''),
        userCode: String(userCode || ''),
        functionName: String(functionName || ''),
        testCases: plainTestCases
      })
    } catch (e) {
      cleanup()
      resolve({ passed: false, error: 'Worker 通信失败: ' + e.message, results: [] })
    }
  })
}
