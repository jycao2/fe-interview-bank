<script setup>
import { storeToRefs } from 'pinia'
import { useQuestionsStore } from '@/stores/questions'
import { difficulties } from '@/data/categories'

const store = useQuestionsStore()
const { keyword, activeDifficulty, filteredQuestions } = storeToRefs(store)
</script>

<template>
  <div class="search-bar">
    <div class="search-input">
      <span class="icon">🔍</span>
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索题目、标签或答案内容…"
        aria-label="搜索题目"
      />
      <button v-if="keyword" class="clear" @click="keyword = ''" title="清空">✕</button>
    </div>

    <div class="filters">
      <button
        v-for="d in [{ id: 'all', label: '全部' }, ...difficulties.map((x) => ({ id: x.id, label: x.id }))]"
        :key="d.id"
        class="filter-btn"
        :class="{ active: activeDifficulty === d.id }"
        @click="activeDifficulty = d.id"
      >
        {{ d.label }}
      </button>
      <span class="result-count muted">共 {{ filteredQuestions.length }} 条结果</span>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 22px;
}
.search-input {
  position: relative;
  display: flex;
  align-items: center;
}
.icon {
  position: absolute;
  left: 14px;
  font-size: 14px;
  opacity: 0.6;
  pointer-events: none;
}
.search-input input {
  width: 100%;
  height: 44px;
  padding: 0 40px 0 40px;
  font-size: 15px;
  color: var(--text);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input input::placeholder {
  color: var(--text-muted);
}
.search-input input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-soft);
}
.clear {
  position: absolute;
  right: 10px;
  width: 24px;
  height: 24px;
  border: none;
  background: var(--bg-sunken);
  color: var(--text-soft);
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.clear:hover {
  background: var(--border-strong);
}
.filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 5px 14px;
  font-size: 13px;
  color: var(--text-soft);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 999px;
  transition: all 0.12s;
}
.filter-btn:hover {
  border-color: var(--border-strong);
  color: var(--text);
}
.filter-btn.active {
  background: var(--brand-soft);
  border-color: var(--brand);
  color: var(--brand);
  font-weight: 600;
}
.result-count {
  font-size: 13px;
  margin-left: 6px;
}
</style>
