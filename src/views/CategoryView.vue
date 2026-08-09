<script setup>
import { computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuestionsStore } from '@/stores/questions'
import { categories, gisFrameworks } from '@/data/categories'
import QuestionCard from '@/components/QuestionCard.vue'

const route = useRoute()
const store = useQuestionsStore()
const { activeDifficulty, keyword } = storeToRefs(store)

const categoryId = computed(() => route.params.category)
const category = computed(() => categories.find((c) => c.id === categoryId.value))

const list = computed(() => store.questionsByCategory(categoryId.value))
const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return list.value.filter((q) => {
    const matchKw =
      !kw ||
      q.title.toLowerCase().includes(kw) ||
      (q.tags || []).some((t) => t.toLowerCase().includes(kw))
    const matchDiff = activeDifficulty.value === 'all' || q.difficulty === activeDifficulty.value
    return matchKw && matchDiff
  })
})

// GIS 分类按框架分组展示；其他分类走平铺
const isGis = computed(() => categoryId.value === 'gis')
const grouped = computed(() => {
  if (!isGis.value) return []
  return gisFrameworks
    .map((fw) => ({
      ...fw,
      questions: filtered.value.filter((q) => (q.framework || 'general') === fw.id)
    }))
    .filter((g) => g.questions.length > 0)
})

// 进入分类页时清空全局搜索词，避免干扰
watch(
  categoryId,
  () => {
    keyword.value = ''
    activeDifficulty.value = 'all'
  },
  { immediate: true }
)
</script>

<template>
  <div class="category-view container">
    <nav class="breadcrumb muted">
      <RouterLink to="/">首页</RouterLink>
      <span>/</span>
      <span>{{ category?.name || '分类' }}</span>
    </nav>

    <header v-if="category" class="cat-header">
      <span class="cat-big-icon">{{ category.icon }}</span>
      <div>
        <h1>{{ category.name }}</h1>
        <p class="muted">{{ category.desc }} · 共 {{ list.length }} 题</p>
      </div>
    </header>

    <div class="cat-filters">
      <button
        v-for="d in ['all', '简单', '中等', '困难']"
        :key="d"
        class="filter-btn"
        :class="{ active: activeDifficulty === d }"
        @click="activeDifficulty = d"
      >
        {{ d === 'all' ? '全部' : d }}
      </button>
    </div>

    <!-- GIS 分类：按框架分组 -->
    <template v-if="isGis">
      <section v-for="g in grouped" :key="g.id" class="fw-group">
        <div class="fw-group-head">
          <span class="fw-icon">{{ g.icon }}</span>
          <h2 class="fw-name">{{ g.name }}</h2>
          <span class="fw-count muted">{{ g.questions.length }} 题</span>
          <span class="fw-desc muted">{{ g.desc }}</span>
        </div>
        <div class="qgrid">
          <QuestionCard v-for="q in g.questions" :key="q.id" :question="q" />
        </div>
      </section>
      <div v-if="!grouped.length" class="empty muted">
        该分类下暂无符合条件的题目。
      </div>
    </template>

    <!-- 其他分类：平铺 -->
    <template v-else>
      <div v-if="filtered.length" class="qgrid">
        <QuestionCard v-for="q in filtered" :key="q.id" :question="q" />
      </div>
      <div v-else class="empty muted">
        该分类下暂无符合条件的题目。
      </div>
    </template>
  </div>
</template>

<style scoped>
.category-view {
  padding-top: 8px;
}
.breadcrumb {
  display: flex;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 18px;
}
.cat-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}
.cat-big-icon {
  font-size: 44px;
}
.cat-header h1 {
  font-size: 26px;
  margin: 0 0 4px;
}
.cat-header p {
  margin: 0;
  font-size: 14px;
}
.cat-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
.filter-btn {
  padding: 5px 14px;
  font-size: 13px;
  color: var(--text-soft);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 999px;
}
.filter-btn:hover {
  color: var(--text);
  border-color: var(--border-strong);
}
.filter-btn.active {
  background: var(--brand-soft);
  border-color: var(--brand);
  color: var(--brand);
  font-weight: 600;
}
.qgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}
.empty {
  padding: 48px 0;
  text-align: center;
}
/* 框架分组 */
.fw-group {
  margin-bottom: 28px;
}
.fw-group-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 14px;
  margin-bottom: 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  border-left: 4px solid var(--brand);
}
.fw-icon {
  font-size: 20px;
}
.fw-name {
  font-size: 17px;
  margin: 0;
}
.fw-count {
  font-size: 12px;
}
.fw-desc {
  font-size: 12px;
  flex-basis: 100%;
}
</style>
