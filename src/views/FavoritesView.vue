<script setup>
import { storeToRefs } from 'pinia'
import { useQuestionsStore } from '@/stores/questions'
import QuestionCard from '@/components/QuestionCard.vue'

const store = useQuestionsStore()
const { favoriteQuestions } = storeToRefs(store)
</script>

<template>
  <div class="favorites-view container">
    <header class="fv-header">
      <h1>我的收藏</h1>
      <p class="muted">已收藏 {{ favoriteQuestions.length }} 道题目，数据保存在本地浏览器。</p>
    </header>

    <div v-if="favoriteQuestions.length" class="qgrid">
      <QuestionCard v-for="q in favoriteQuestions" :key="q.id" :question="q" />
    </div>

    <div v-else class="empty">
      <div class="empty-icon"> ☆</div>
      <p>还没有收藏任何题目。</p>
      <RouterLink to="/" class="go-browse">去浏览题库 →</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.favorites-view {
  padding-top: 8px;
}
.fv-header {
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.fv-header h1 {
  font-size: 24px;
  margin: 0 0 6px;
}
.fv-header p {
  margin: 0;
  font-size: 14px;
}
.qgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}
.empty {
  text-align: center;
  padding: 64px 16px;
  color: var(--text-muted);
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.go-browse {
  display: inline-block;
  margin-top: 10px;
  color: var(--brand);
  font-weight: 600;
}
</style>
