import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { algorithmProblems } from '@/data/algorithmExam'
import { runAlgorithm } from '@/utils/algorithmRunner'

export const useAlgorithmExamStore = defineStore('algorithmExam', () => {
  // ─── State ──────────────────────────────────────
  const phase = ref('idle')           // idle | taking | result
  const problems = ref([])             // 当前会话的题目列表
  const currentIndex = ref(0)
  const userCodes = ref({})            // { [problemId]: codeString }
  const problemStatus = ref({})       // { [problemId]: 'unattempted' | 'passed' | 'failed' }
  const lastRunResult = ref(null)      // 最近一次运行/提交的结果
  const isRunning = ref(false)         // 正在执行判题
  const startTime = ref(0)
  const endTime = ref(0)

  // ─── Getters ────────────────────────────────────
  const currentProblem = computed(() => problems.value[currentIndex.value] || null)

  const currentUserCode = computed(() => {
    const p = currentProblem.value
    if (!p) return ''
    return userCodes.value[p.id] ?? p.starterCode
  })

  const total = computed(() => problems.value.length)
  const passedCount = computed(() => Object.values(problemStatus.value).filter(s => s === 'passed').length)
  const attemptedCount = computed(() => Object.values(problemStatus.value).filter(s => s !== 'unattempted').length)
  const usedSeconds = computed(() => endTime.value ? Math.floor((endTime.value - startTime.value) / 1000) : Math.floor((Date.now() - startTime.value) / 1000))

  // ─── Actions ───────────────────────────────────
  function startExam(selectedProblems) {
    problems.value = selectedProblems.length ? selectedProblems : [...algorithmProblems]
    phase.value = 'taking'
    currentIndex.value = 0
    startTime.value = Date.now()
    endTime.value = 0
    lastRunResult.value = null
    // 初始化用户代码和状态
    for (const p of problems.value) {
      if (!userCodes.value[p.id]) {
        userCodes.value[p.id] = p.starterCode
      }
      problemStatus.value[p.id] = 'unattempted'
    }
  }

  function setCode(code) {
    const p = currentProblem.value
    if (p) userCodes.value[p.id] = code
  }

  async function runTests(submitAll = false) {
    const p = currentProblem.value
    if (!p || isRunning.value) return null
    isRunning.value = true
    try {
      const code = userCodes.value[p.id] || p.starterCode
      // "运行"只跑前 3 个用例，"提交"跑全部
      const testCases = submitAll
        ? p.testCases
        : p.testCases.slice(0, Math.min(3, p.testCases.length))

      const result = await runAlgorithm(code, p.functionName, testCases, p.setup || '', 5000)
      lastRunResult.value = { ...result, submitAll }

      if (submitAll) {
        problemStatus.value[p.id] = result.passed ? 'passed' : 'failed'
      }

      return result
    } catch (e) {
      lastRunResult.value = {
        passed: false,
        error: '运行出错: ' + (e && e.message ? e.message : String(e)),
        results: [],
        submitAll
      }
      return lastRunResult.value
    } finally {
      isRunning.value = false
    }
  }

  function next() {
    if (currentIndex.value < problems.value.length - 1) {
      currentIndex.value++
      lastRunResult.value = null
    }
  }

  function prev() {
    if (currentIndex.value > 0) {
      currentIndex.value--
      lastRunResult.value = null
    }
  }

  function goTo(index) {
    if (index >= 0 && index < problems.value.length) {
      currentIndex.value = index
      lastRunResult.value = null
    }
  }

  function submitExam() {
    endTime.value = Date.now()
    phase.value = 'result'
  }

  function resetExam() {
    phase.value = 'idle'
    problems.value = []
    currentIndex.value = 0
    lastRunResult.value = null
    startTime.value = 0
    endTime.value = 0
  }

  function resetCode() {
    const p = currentProblem.value
    if (p) {
      userCodes.value[p.id] = p.starterCode
      lastRunResult.value = null
    }
  }

  return {
    // state
    phase, problems, currentIndex, userCodes, problemStatus,
    lastRunResult, isRunning, startTime, endTime,
    // getters
    currentProblem, currentUserCode, total, passedCount, attemptedCount, usedSeconds,
    // actions
    startExam, setCode, runTests, next, prev, goTo, submitExam, resetExam, resetCode
  }
})
