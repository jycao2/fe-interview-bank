<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuestionsStore } from '@/stores/questions'
import { categories } from '@/data/categories'
import MarkdownContent from '@/components/MarkdownContent.vue'
import DifficultyBadge from '@/components/DifficultyBadge.vue'
import TagBadge from '@/components/TagBadge.vue'

const route = useRoute()
const store = useQuestionsStore()
const { favorites } = storeToRefs(store)

const question = computed(() => store.getQuestionById(route.params.id))
const category = computed(() =>
  question.value ? categories.find((c) => c.id === question.value.category) : null
)

// 同分类下的上一题 / 下一题
const siblingList = computed(() =>
  question.value ? store.questionsByCategory(question.value.category) : []
)
const currentIndex = computed(() =>
  siblingList.value.findIndex((q) => q.id === route.params.id)
)
const prev = computed(() =>
  currentIndex.value > 0 ? siblingList.value[currentIndex.value - 1] : null
)
const next = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < siblingList.value.length - 1
    ? siblingList.value[currentIndex.value + 1]
    : null
)

const related = computed(() => store.getRelatedQuestions(question.value, 4))

const isFav = computed(() =>
  question.value ? favorites.value.includes(question.value.id) : false
)
</script>

<template>
  <div class="question-view container">
    <template v-if="question">
      <nav class="breadcrumb muted">
        <RouterLink to="/">首页</RouterLink>
        <span>/</span>
        <RouterLink v-if="category" :to="`/category/${category.id}`">{{ category.name }}</RouterLink>
        <span>/</span>
        <span>题目详情</span>
      </nav>

      <header class="q-header">
        <div class="q-meta">
          <RouterLink v-if="category" :to="`/category/${category.id}`" class="q-cat">
            <span>{{ category.icon }}</span>{{ category.name }}
          </RouterLink>
          <DifficultyBadge :level="question.difficulty" />
        </div>
        <h1 class="q-title">{{ question.title }}</h1>
        <div class="q-tags" v-if="question.tags?.length">
          <TagBadge v-for="t in question.tags" :key="t" :text="t" />
        </div>
        <div class="q-actions">
          <button class="fav-toggle" :class="{ active: isFav }" @click="store.toggleFavorite(question.id)">
            {{ isFav ? '★ 已收藏' : '☆ 收藏' }}
          </button>
        </div>
      </header>

      <article class="answer-box">
        <div class="answer-label">答案解析</div>
        <MarkdownContent :source="question.answer" />
      </article>

      <nav class="prev-next">
        <RouterLink v-if="prev" :to="`/question/${prev.id}`" class="pn-link pn-prev">
          <span class="pn-dir">← 上一题</span>
          <span class="pn-title">{{ prev.title }}</span>
        </RouterLink>
        <span v-else class="pn-link pn-disabled"></span>

        <RouterLink v-if="next" :to="`/question/${next.id}`" class="pn-link pn-next">
          <span class="pn-dir">下一题 →</span>
          <span class="pn-title">{{ next.title }}</span>
        </RouterLink>
      </nav>

      <section v-if="related.length" class="related">
        <h3 class="related-title">相关题目</h3>
        <ul class="related-list">
          <li v-for="r in related" :key="r.id">
            <RouterLink :to="`/question/${r.id}`">{{ r.title }}</RouterLink>
          </li>
        </ul>
      </section>
    </template>

    <div v-else class="not-found">
      <p>未找到该题目 😢</p>
      <RouterLink to="/" class="back-home">返回首页</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.question-view {
  padding-top: 8px;
}
.breadcrumb {
  display: flex;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 18px;
}
.q-header {
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
}
.q-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.q-cat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--text-soft);
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 3px 10px;
  text-decoration: none;
}
.q-cat:hover {
  border-color: var(--brand);
  color: var(--brand);
  text-decoration: none;
}
.q-title {
  font-size: 26px;
  font-weight: 720;
  line-height: 1.35;
  margin: 0 0 14px;
}
.q-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.q-actions {
  display: flex;
}
.fav-toggle {
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-soft);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: all 0.12s;
}
.fav-toggle:hover {
  border-color: #f5a623;
  color: #f5a623;
}
.fav-toggle.active {
  background: rgba(245, 166, 35, 0.12);
  border-color: #f5a623;
  color: #f5a623;
}
.answer-box {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 28px;
  box-shadow: var(--shadow);
}
.answer-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--brand);
  margin-bottom: 14px;
}
.prev-next {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
}
.pn-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text);
  flex: 1;
  min-width: 0;
  transition: border-color 0.12s;
}
.pn-link:hover {
  border-color: var(--brand);
  text-decoration: none;
}
.pn-next {
  text-align: right;
}
.pn-disabled {
  visibility: hidden;
}
.pn-dir {
  font-size: 12px;
  color: var(--text-muted);
}
.pn-title {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.related {
  margin-top: 32px;
  padding: 20px 22px;
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.related-title {
  font-size: 15px;
  font-weight: 650;
  margin: 0 0 12px;
}
.related-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.related-list a {
  display: block;
  padding: 8px 10px;
  font-size: 14px;
  color: var(--text-soft);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}
.related-list a:hover {
  color: var(--brand);
  border-color: var(--brand);
  text-decoration: none;
}
.not-found {
  text-align: center;
  padding: 80px 16px;
  color: var(--text-muted);
}
.back-home {
  display: inline-block;
  margin-top: 12px;
  color: var(--brand);
}
@media (max-width: 768px) {
  .answer-box {
    padding: 18px 16px;
  }
  .q-title {
    font-size: 22px;
  }
  .prev-next {
    flex-direction: column;
  }
}
</style>
