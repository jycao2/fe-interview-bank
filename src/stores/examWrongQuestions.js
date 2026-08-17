import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { examQuestions } from '@/data/exam'

const STORAGE_KEY = 'exam-wrong-questions-v1'
const HISTORY_LIMIT = 10 // 每题最多保留最近 10 次答题记录

// 从 localStorage 加载选择题错题集
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
  } catch (e) {
    console.warn('[examWrongQuestions] 加载选择题错题集失败', e)
    return []
  }
}

function saveToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('[examWrongQuestions] 保存选择题错题集失败', e)
  }
}

/**
 * 选择题错题项数据结构：
 * {
 *   id: 'mcq-001',
 *   addedAt: 1700000000000,
 *   lastAttemptAt: 1700000000000,
 *   history: [
 *     {
 *       time: 1700000000000,
 *       passed: false,
 *       selected: 1,        // 用户选择（-1 表示未答）
 *       correctIndex: 2     // 正确答案索引
 *     }
 *   ]
 * }
 */

export const useExamWrongQuestionsStore = defineStore('examWrongQuestions', () => {
  const items = ref(loadFromStorage())

  function persist() {
    saveToStorage(items.value)
  }

  // ─── Getters ────────────────────────────────────────
  const count = computed(() => items.value.length)

  // 按分类统计
  const statsByCategory = computed(() => {
    const out = {}
    for (const item of items.value) {
      const q = examQuestions.find(q => q.id === item.id)
      if (!q) continue
      out[q.category] = (out[q.category] || 0) + 1
    }
    return out
  })

  // 按难度统计
  const statsByDifficulty = computed(() => {
    const out = { 简单: 0, 中等: 0, 困难: 0 }
    for (const item of items.value) {
      const q = examQuestions.find(q => q.id === item.id)
      if (q && out[q.difficulty] !== undefined) out[q.difficulty]++
    }
    return out
  })

  // 错题列表（带题目详情）
  const wrongList = computed(() => {
    return items.value
      .map(item => {
        const question = examQuestions.find(q => q.id === item.id)
        if (!question) return null
        return {
          ...item,
          question,
          attempts: item.history.length,
          lastPassed: item.history[0]?.passed ?? false
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b.lastAttemptAt || 0) - (a.lastAttemptAt || 0))
  })

  function has(id) {
    return items.value.some(it => it.id === id)
  }

  function get(id) {
    return items.value.find(it => it.id === id) || null
  }

  // ─── Actions ────────────────────────────────────────

  /**
   * 记录一次选择题答题
   * @param {string} id - 题目 id（如 'mcq-001'）
   * @param {object} attempt - { passed, selected, correctIndex }
   */
  function recordAttempt(id, attempt) {
    const now = Date.now()
    const record = {
      time: now,
      passed: !!attempt.passed,
      selected: attempt.selected ?? -1,
      correctIndex: attempt.correctIndex ?? 0
    }

    const idx = items.value.findIndex(it => it.id === id)
    if (idx === -1) {
      // 仅在答错时新增
      if (!record.passed) {
        items.value.push({
          id,
          addedAt: now,
          lastAttemptAt: now,
          history: [record]
        })
        persist()
      }
    } else {
      // 已存在：插入最新到头部，限制长度
      items.value[idx].history.unshift(record)
      if (items.value[idx].history.length > HISTORY_LIMIT) {
        items.value[idx].history = items.value[idx].history.slice(0, HISTORY_LIMIT)
      }
      items.value[idx].lastAttemptAt = now
      // 答对则自动移除；答错则保留并持久化
      if (record.passed) {
        removeOne(id)
      } else {
        persist()
      }
    }
  }

  /**
   * 批量记录一次考试的所有题目结果
   * @param {Array} questions - 本次考试题目数组
   * @param {Array} answers - 用户答案数组（-1 表示未答）
   */
  function recordExamResult(questions, answers) {
    questions.forEach((q, i) => {
      const sel = answers[i] ?? -1
      const passed = sel === q.answer
      recordAttempt(q.id, {
        passed,
        selected: sel,
        correctIndex: q.answer
      })
    })
  }

  function removeOne(id) {
    const idx = items.value.findIndex(it => it.id === id)
    if (idx !== -1) {
      items.value.splice(idx, 1)
      persist()
    }
  }

  function clearAll() {
    items.value = []
    persist()
  }

  /**
   * 从选择题错题集生成新考试（返回题目数组）
   * @param {object} options - { limit, shuffle }
   */
  function generateExam(options = {}) {
    const limit = options.limit || 20
    const shuffle = options.shuffle !== false
    let list = items.value.slice()
    if (shuffle) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[list[i], list[j]] = [list[j], list[i]]
      }
    }
    const ids = list.slice(0, limit).map(it => it.id)
    return ids
      .map(id => examQuestions.find(q => q.id === id))
      .filter(Boolean)
  }

  return {
    items,
    count,
    statsByCategory,
    statsByDifficulty,
    wrongList,
    has,
    get,
    recordAttempt,
    recordExamResult,
    removeOne,
    clearAll,
    generateExam
  }
})
