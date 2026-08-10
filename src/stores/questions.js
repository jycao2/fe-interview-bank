import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { categories } from '@/data/categories'
import { htmlQuestions } from '@/data/html'
import { cssQuestions } from '@/data/css'
import { javascriptQuestions } from '@/data/javascript'
import { typescriptQuestions } from '@/data/typescript'
import { vueQuestions } from '@/data/vue'
import { reactQuestions } from '@/data/react'
import { browserQuestions } from '@/data/browser'
import { networkQuestions } from '@/data/network'
import { performanceQuestions } from '@/data/performance'
import { engineeringQuestions } from '@/data/engineering'
import { algorithmQuestions } from '@/data/algorithm'
import { handwritingQuestions } from '@/data/handwriting'
import { aicodeQuestions } from '@/data/aicode'
import { gisQuestions } from '@/data/gis'
import { mobileQuestions } from '@/data/mobile'

const FAV_KEY = 'feib-favorites'

const allQuestions = [
  ...htmlQuestions,
  ...cssQuestions,
  ...javascriptQuestions,
  ...typescriptQuestions,
  ...vueQuestions,
  ...reactQuestions,
  ...browserQuestions,
  ...networkQuestions,
  ...performanceQuestions,
  ...engineeringQuestions,
  ...algorithmQuestions,
  ...handwritingQuestions,
  ...aicodeQuestions,
  ...gisQuestions,
  ...mobileQuestions
]

export const useQuestionsStore = defineStore('questions', () => {
  const questions = ref(allQuestions)
  const keyword = ref('')
  const activeDifficulty = ref('all')
  const favorites = ref(loadFavorites())

  const totalCount = computed(() => questions.value.length)

  const categoryStats = computed(() =>
    categories.map((c) => ({
      ...c,
      count: questions.value.filter((q) => q.category === c.id).length
    }))
  )

  const filteredQuestions = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    return questions.value.filter((q) => {
      const matchKw =
        !kw ||
        q.title.toLowerCase().includes(kw) ||
        (q.tags || []).some((t) => t.toLowerCase().includes(kw)) ||
        q.answer.toLowerCase().includes(kw)
      const matchDiff =
        activeDifficulty.value === 'all' || q.difficulty === activeDifficulty.value
      return matchKw && matchDiff
    })
  })

  const favoriteQuestions = computed(() =>
    questions.value.filter((q) => favorites.value.includes(q.id))
  )

  function questionsByCategory(categoryId) {
    return questions.value.filter((q) => q.category === categoryId)
  }

  function getQuestionById(id) {
    return questions.value.find((q) => q.id === id) || null
  }

  function getRelatedQuestions(question, limit = 5) {
    if (!question) return []
    return questions.value
      .filter(
        (q) =>
          q.id !== question.id &&
          (q.category === question.category ||
            (q.tags || []).some((t) => (question.tags || []).includes(t)))
      )
      .slice(0, limit)
  }

  function isFavorite(id) {
    return favorites.value.includes(id)
  }

  function toggleFavorite(id) {
    if (favorites.value.includes(id)) {
      favorites.value = favorites.value.filter((f) => f !== id)
    } else {
      favorites.value = [...favorites.value, id]
    }
    saveFavorites()
  }

  function loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
    } catch {
      return []
    }
  }

  function saveFavorites() {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites.value))
  }

  return {
    questions,
    keyword,
    activeDifficulty,
    favorites,
    totalCount,
    categoryStats,
    filteredQuestions,
    favoriteQuestions,
    questionsByCategory,
    getQuestionById,
    getRelatedQuestions,
    isFavorite,
    toggleFavorite
  }
})
