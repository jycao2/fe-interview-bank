import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { algorithmProblems } from '@/data/algorithmExam'

const STORAGE_KEY = 'algo-wrong-questions-v1'
const HISTORY_LIMIT = 10 // 每题最多保留最近 10 次答题记录

// 从 localStorage 加载错题集
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
  } catch (e) {
    console.warn('[wrongQuestions] 加载错题集失败', e)
    return []
  }
}

function saveToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('[wrongQuestions] 保存错题集失败', e)
  }
}

/**
 * 错题项数据结构：
 * {
 *   id: 'algo-001',              // 题目 id
 *   addedAt: 1700000000000,      // 首次加入错题集时间戳
 *   lastAttemptAt: 1700000000000, // 最近一次答题时间戳
 *   history: [                    // 历史答题记录（按时间倒序，最新在前）
 *     {
 *       time: 1700000000000,
 *       passed: false,
 *       duration: 120,            // 用时（秒）
 *       failedCase: 2,            // 失败用例编号（若 passed 则为 null）
 *       userCode: 'function...',  // 用户提交的代码
 *       error: null               // 执行错误（若有）
 *     }
 *   ]
 * }
 */

export const useWrongQuestionsStore = defineStore('wrongQuestions', () => {
  const items = ref(loadFromStorage())

  // 持久化（任何修改后都自动保存）
  function persist() {
    saveToStorage(items.value)
  }

  // ─── Getters ────────────────────────────────────────
  const count = computed(() => items.value.length)

  // 按难度分组统计
  const statsByDifficulty = computed(() => {
    const out = { 简单: 0, 中等: 0, 困难: 0 }
    for (const item of items.value) {
      const p = algorithmProblems.find(p => p.id === item.id)
      if (p && out[p.difficulty] !== undefined) out[p.difficulty]++
    }
    return out
  })

  // 错题列表（带题目详情）
  const wrongList = computed(() => {
    return items.value
      .map(item => {
        const problem = algorithmProblems.find(p => p.id === item.id)
        if (!problem) return null
        return {
          ...item,
          problem,
          attempts: item.history.length,
          lastPassed: item.history[0]?.passed ?? false
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b.lastAttemptAt || 0) - (a.lastAttemptAt || 0))
  })

  // 判断某题是否在错题集中
  function has(id) {
    return items.value.some(it => it.id === id)
  }

  // 获取某题的错题记录
  function get(id) {
    return items.value.find(it => it.id === id) || null
  }

  // ─── Actions ────────────────────────────────────────

  /**
   * 添加或更新错题记录
   * @param {string} id - 题目 id
   * @param {object} attempt - 本次答题记录 { passed, duration, failedCase, userCode, error }
   */
  function recordAttempt(id, attempt) {
    const now = Date.now()
    const record = {
      time: now,
      passed: !!attempt.passed,
      duration: attempt.duration || 0,
      failedCase: attempt.failedCase ?? null,
      userCode: attempt.userCode || '',
      error: attempt.error || null
    }

    const idx = items.value.findIndex(it => it.id === id)
    if (idx === -1) {
      // 新增
      items.value.push({
        id,
        addedAt: now,
        lastAttemptAt: now,
        history: [record]
      })
    } else {
      // 已存在：插入最新到头部，限制长度
      items.value[idx].history.unshift(record)
      if (items.value[idx].history.length > HISTORY_LIMIT) {
        items.value[idx].history = items.value[idx].history.slice(0, HISTORY_LIMIT)
      }
      items.value[idx].lastAttemptAt = now
    }

    // 如果本次通过，从错题集移除
    if (record.passed) {
      removeOne(id)
    } else {
      persist()
    }
  }

  /**
   * 手动移除单个错题
   */
  function removeOne(id) {
    const idx = items.value.findIndex(it => it.id === id)
    if (idx !== -1) {
      items.value.splice(idx, 1)
      persist()
    }
  }

  /**
   * 清空所有错题
   */
  function clearAll() {
    items.value = []
    persist()
  }

  /**
   * 从错题集生成新的考试（返回题目 id 数组）
   * @param {object} options - { limit, shuffle }
   */
  function generateExam(options = {}) {
    const limit = options.limit || 20
    const shuffle = options.shuffle !== false
    let list = items.value.slice()
    if (shuffle) {
      // Fisher-Yates 洗牌
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[list[i], list[j]] = [list[j], list[i]]
      }
    }
    return list.slice(0, limit).map(it => it.id)
  }

  return {
    items,
    count,
    statsByDifficulty,
    wrongList,
    has,
    get,
    recordAttempt,
    removeOne,
    clearAll,
    generateExam
  }
})
