import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { examQuestions } from '@/data/exam'

// 一次考试的题目数量
const EXAM_SIZE = 30
// 每题分值
const SCORE_PER_Q = 100 / EXAM_SIZE

/**
 * 分类抽题权重（比例）
 * 总和建议 = 1（或接近，最终按比例换算）
 * 侧重 JS/CSS/HTML 基础 + Vue/React 框架 + 浏览器/网络/性能/工程化
 */
const CATEGORY_WEIGHTS = {
  javascript: 0.18,   // 18% ~ 5~6 题
  css: 0.12,          // 12% ~ 3~4 题
  html: 0.08,         // 8%  ~ 2~3 题
  typescript: 0.07,   // 7%  ~ 2 题
  vue: 0.12,          // 12% ~ 3~4 题
  react: 0.12,        // 12% ~ 3~4 题
  browser: 0.08,      // 8%  ~ 2~3 题
  network: 0.08,      // 8%  ~ 2~3 题
  performance: 0.07,  // 7%  ~ 2 题
  engineering: 0.06,  // 6%  ~ 2 题
  algorithm: 0.01,    // 1%  ~ 0~1 题
  handwriting: 0.01   // 1%  ~ 0~1 题
}

/**
 * 难度权重（比例）
 * 默认组合：简单 30% / 中等 50% / 困难 20%
 */
const DIFFICULTY_WEIGHTS = {
  'balanced': { '简单': 0.30, '中等': 0.50, '困难': 0.20 },
  'easy':     { '简单': 0.60, '中等': 0.30, '困难': 0.10 },
  'hard':     { '简单': 0.10, '中等': 0.40, '困难': 0.50 }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * 按权重从池中抽取 n 个元素
 * @param {Array} pool   候选池
 * @param {Number} n      要抽取的数量
 * @returns {Array}       抽取结果（可能不足 n 个，由外层补足）
 */
function pickN(pool, n) {
  if (n <= 0 || !pool.length) return []
  return shuffle(pool).slice(0, Math.min(n, pool.length))
}

/**
 * 按分类 + 难度权重抽题
 * @param {Object} opts
 * @param {Number} opts.total      目标题量
 * @param {String} opts.mode       难度模式：balanced / easy / hard
 * @param {String[]} opts.categories 可选：限定分类（不传则使用全部默认权重）
 */
function selectQuestionsByWeight({ total = EXAM_SIZE, mode = 'balanced', categories: catFilter = null } = {}) {
  const diffW = DIFFICULTY_WEIGHTS[mode] || DIFFICULTY_WEIGHTS.balanced

  // 第一步：按分类权重计算每个分类要抽多少题
  const catTargets = {}
  let accounted = 0
  let remaining = total
  const activeCats = catFilter && catFilter.length
    ? catFilter
    : Object.keys(CATEGORY_WEIGHTS)

  // 计算实际参与权重总和（若用户选择了部分分类，则要归一化）
  const weightSum = activeCats.reduce((s, c) => s + (CATEGORY_WEIGHTS[c] || 0.05), 0)
  for (const cat of activeCats) {
    const w = (CATEGORY_WEIGHTS[cat] || 0.05) / weightSum
    const t = Math.round(total * w)
    catTargets[cat] = t
    accounted += t
  }
  // 调整误差到第一个分类
  const diff = total - accounted
  if (diff !== 0 && activeCats.length) {
    catTargets[activeCats[0]] = (catTargets[activeCats[0]] || 0) + diff
  }

  // 第二步：在每个分类内按难度权重分配
  const result = []
  const usedIds = new Set()

  const allDiffs = ['简单', '中等', '困难']
  for (const cat of activeCats) {
    const catPool = examQuestions.filter(q => q.category === cat)
    let catNeed = catTargets[cat] || 0
    if (!catPool.length || catNeed <= 0) continue

    // 按难度切分子池
    const diffPools = { '简单': [], '中等': [], '困难': [] }
    for (const q of catPool) {
      const d = q.difficulty || '中等'
      if (diffPools[d]) diffPools[d].push(q)
    }

    // 对该分类按难度权重分派，先按比例取整，剩余用随机
    let catPicked = 0
    const catDiffTargets = {}
    let catAccounted = 0
    for (const d of allDiffs) {
      const t = Math.max(0, Math.floor(catNeed * diffW[d]))
      catDiffTargets[d] = t
      catAccounted += t
    }
    const catRemain = catNeed - catAccounted
    // 剩余名额优先分给中等，再困难，再简单
    if (catRemain > 0) {
      const priority = ['中等', '困难', '简单']
      for (const d of priority) {
        if (catRemain <= 0) break
        const slots = diffPools[d].length - catDiffTargets[d]
        if (slots > 0) {
          const add = Math.min(slots, 1)
          catDiffTargets[d] += add
        }
      }
    }

    for (const d of allDiffs) {
      const need = catDiffTargets[d] || 0
      if (!need) continue
      const available = diffPools[d].filter(q => !usedIds.has(q.id))
      const picked = pickN(available, need)
      for (const q of picked) {
        result.push(q)
        usedIds.add(q.id)
        catPicked++
      }
    }

    // 若该分类不足目标（某难度题库空），从该分类其它难度补足
    while (catPicked < catNeed) {
      const fallback = catPool.filter(q => !usedIds.has(q.id))
      if (!fallback.length) break
      const q = shuffle(fallback)[0]
      result.push(q)
      usedIds.add(q.id)
      catPicked++
    }
    remaining -= catPicked
  }

  // 第三步：若仍不足（题库/分类限制），从全局未用题目随机补足
  if (remaining > 0) {
    const fallback = examQuestions.filter(q => !usedIds.has(q.id))
    const more = pickN(fallback, remaining)
    result.push(...more)
  }

  // 最终洗牌打乱顺序
  return shuffle(result)
}

export const useExamStore = defineStore('exam', () => {
  // idle: 开始页 | taking: 答题中 | result: 结果页
  const phase = ref('idle')
  // 本次考试的题目
  const questions = ref([])
  // 答案：按题目在本次考试中的位置存选项索引，-1 表示未答
  const answers = ref([])
  const currentIndex = ref(0)
  const startTime = ref(0)
  const endTime = ref(0)

  // 用户配置
  const difficultyMode = ref('balanced')     // easy / balanced / hard
  const selectedCategories = ref(null)       // null = 全部

  const total = computed(() => questions.value.length)
  const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
  const currentAnswer = computed(() => answers.value[currentIndex.value] ?? -1)
  const answeredCount = computed(() => answers.value.filter((a) => a >= 0).length)
  const progress = computed(() =>
    total.value ? Math.round((answeredCount.value / total.value) * 100) : 0
  )

  // 本次考试的分类分布统计
  const categoryBreakdown = computed(() => {
    const map = {}
    for (const q of questions.value) {
      map[q.category] = (map[q.category] || 0) + 1
    }
    return Object.entries(map)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
  })

  // 本次考试的难度分布统计
  const difficultyBreakdown = computed(() => {
    const map = {}
    for (const q of questions.value) {
      const d = q.difficulty || '中等'
      map[d] = (map[d] || 0) + 1
    }
    return { '简单': map['简单'] || 0, '中等': map['中等'] || 0, '困难': map['困难'] || 0 }
  })

  // 结果统计
  const result = computed(() => {
    if (phase.value !== 'result') return null
    let correct = 0
    let wrong = 0
    let unanswered = 0
    const wrongList = []
    questions.value.forEach((q, i) => {
      const sel = answers.value[i]
      if (sel < 0) {
        unanswered++
        wrongList.push({ question: q, selected: -1, correctIndex: q.answer })
      } else if (sel === q.answer) {
        correct++
      } else {
        wrong++
        wrongList.push({ question: q, selected: sel, correctIndex: q.answer })
      }
    })
    const score = Math.round(correct * SCORE_PER_Q)
    return { score, correct, wrong, unanswered, wrongList, total: total.value }
  })

  const usedSeconds = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value || Date.now()
    return Math.floor((end - startTime.value) / 1000)
  })

  function setDifficultyMode(mode) {
    difficultyMode.value = mode
  }
  function setSelectedCategories(cats) {
    selectedCategories.value = cats && cats.length ? cats : null
  }

  function startExam() {
    questions.value = selectQuestionsByWeight({
      total: EXAM_SIZE,
      mode: difficultyMode.value,
      categories: selectedCategories.value
    })
    answers.value = new Array(questions.value.length).fill(-1)
    currentIndex.value = 0
    startTime.value = Date.now()
    endTime.value = 0
    phase.value = 'taking'
  }

  function selectOption(optionIndex) {
    answers.value[currentIndex.value] = optionIndex
  }

  function next() {
    if (currentIndex.value < total.value - 1) currentIndex.value++
  }
  function prev() {
    if (currentIndex.value > 0) currentIndex.value--
  }
  function goTo(index) {
    if (index >= 0 && index < total.value) currentIndex.value = index
  }

  function submitExam() {
    endTime.value = Date.now()
    phase.value = 'result'
  }

  function resetExam() {
    phase.value = 'idle'
    questions.value = []
    answers.value = []
    currentIndex.value = 0
    startTime.value = 0
    endTime.value = 0
  }

  return {
    phase,
    questions,
    answers,
    currentIndex,
    startTime,
    endTime,
    total,
    currentQuestion,
    currentAnswer,
    answeredCount,
    progress,
    result,
    usedSeconds,
    difficultyMode,
    selectedCategories,
    categoryBreakdown,
    difficultyBreakdown,
    EXAM_SIZE,
    setDifficultyMode,
    setSelectedCategories,
    startExam,
    selectOption,
    next,
    prev,
    goTo,
    submitExam,
    resetExam
  }
})
