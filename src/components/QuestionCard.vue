<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuestionsStore } from '@/stores/questions'
import { categories } from '@/data/categories'
import DifficultyBadge from './DifficultyBadge.vue'
import TagBadge from './TagBadge.vue'

const props = defineProps({
  question: { type: Object, required: true }
})

const store = useQuestionsStore()
const { favorites } = storeToRefs(store)

const category = categories.find((c) => c.id === props.question.category)

function onFav(e) {
  e.preventDefault()
  e.stopPropagation()
  store.toggleFavorite(props.question.id)
}
</script>

<template>
  <RouterLink :to="`/question/${question.id}`" class="qcard">
    <div class="qcard-head">
      <span class="qcat" v-if="category">
        <span class="qcat-icon">{{ category.icon }}</span>
        {{ category.name }}
      </span>
      <DifficultyBadge :level="question.difficulty" />
    </div>

    <h3 class="qtitle">{{ question.title }}</h3>

    <div class="qtags" v-if="question.tags?.length">
      <TagBadge v-for="t in question.tags" :key="t" :text="t" />
    </div>

    <div class="qcard-foot">
      <span class="read-more">查看解析 →</span>
      <button
        class="fav-btn"
        :class="{ active: favorites.includes(question.id) }"
        :title="favorites.includes(question.id) ? '取消收藏' : '收藏'"
        @click="onFav"
      >
        {{ favorites.includes(question.id) ? '★' : '☆' }}
      </button>
    </div>
  </RouterLink>
</template>

<style scoped>
.qcard {
  display: block;
  padding: 18px 18px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text);
  transition: border-color 0.15s, transform 0.12s, box-shadow 0.15s;
}
.qcard:hover {
  border-color: var(--brand);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  text-decoration: none;
}
.qcard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.qcat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}
.qcat-icon {
  font-size: 14px;
}
.qtitle {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.45;
  margin: 0 0 12px;
  color: var(--text);
}
.qtags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.qcard-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border);
  padding-top: 10px;
  margin-top: auto;
}
.read-more {
  font-size: 13px;
  color: var(--brand);
  font-weight: 500;
}
.fav-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  color: var(--text-muted);
  line-height: 1;
  padding: 2px 4px;
  transition: color 0.12s, transform 0.1s;
}
.fav-btn:hover {
  transform: scale(1.15);
}
.fav-btn.active {
  color: #f5a623;
}
</style>
