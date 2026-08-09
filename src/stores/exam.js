import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { examQuestions } from '@/data/exam'

// 一次考试的题目数量
const EXAM_SIZE = 30
// 每题分值
const SCORE_PER_Q = 100 / EXAM_SIZE

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const useExamStore = defineStore('exam', () => {
  // idle: 开始页 | taking: 答题中 | result: 结果页
  const phase = ref('idle')
  // 本次考试的题目（随机抽取 30 题）
  const questions = ref([])
  // 答案：按题目在本次考试中的位置存选项索引，-1 表示未答
  const answers = ref([])
  const currentIndex = ref(0)
  const startTime = ref(0)
  const endTime = ref(0)

  const total = computed(() => questions.value.length)
  const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
  const currentAnswer = computed(() => answers.value[currentIndex.value] ?? -1)
  const answeredCount = computed(() => answers.value.filter((a) => a >= 0).length)
  const progress = computed(() =>
    total.value ? Math.round((answeredCount.value / total.value) * 100) : 0
  )

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

  function startExam() {
    questions.value = shuffle(examQuestions).slice(0, EXAM_SIZE)
    answers.value = new Array(EXAM_SIZE).fill(-1)
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
    EXAM_SIZE,
    startExam,
    selectOption,
    next,
    prev,
    goTo,
    submitExam,
    resetExam
  }
})
