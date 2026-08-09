<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuestionsStore } from '@/stores/questions'
import { categories } from '@/data/categories'

const store = useQuestionsStore()
const { totalCount, favorites } = storeToRefs(store)
const route = useRoute()
</script>

<template>
  <aside class="sidebar">
    <div class="side-section">
      <div class="side-title">题库概览</div>
      <div class="overview">
        <div class="stat">
          <span class="stat-num">{{ totalCount }}</span>
          <span class="stat-label">题目总数</span>
        </div>
        <div class="stat">
          <span class="stat-num">{{ favorites.length }}</span>
          <span class="stat-label">已收藏</span>
        </div>
      </div>
    </div>

    <div class="side-section">
      <div class="side-title">分类导航</div>
      <ul class="cat-list">
        <li v-for="c in store.categoryStats" :key="c.id">
          <RouterLink
            :to="`/category/${c.id}`"
            class="cat-link"
            :class="{ active: route.params.category === c.id }"
          >
            <span class="cat-icon">{{ c.icon }}</span>
            <span class="cat-name">{{ c.name }}</span>
            <span class="cat-count">{{ c.count }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="side-footer muted">
      持续完善中 · 内容仅供学习
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  background: var(--bg-elevated);
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  position: sticky;
  top: var(--header-h);
  height: calc(100vh - var(--header-h));
  overflow-y: auto;
}
.side-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding: 0 6px;
}
.overview {
  display: flex;
  gap: 8px;
}
.stat {
  flex: 1;
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 8px;
  text-align: center;
}
.stat-num {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--brand);
}
.stat-label {
  font-size: 11px;
  color: var(--text-muted);
}
.cat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.cat-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  color: var(--text-soft);
  text-decoration: none;
  font-size: 14px;
  transition: background 0.12s, color 0.12s;
}
.cat-link:hover {
  background: var(--bg-sunken);
  color: var(--text);
  text-decoration: none;
}
.cat-link.active {
  background: var(--brand-soft);
  color: var(--brand);
  font-weight: 600;
}
.cat-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}
.cat-name {
  flex: 1;
}
.cat-count {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0 7px;
  line-height: 18px;
}
.cat-link.active .cat-count {
  background: var(--bg-elevated);
  color: var(--brand);
}
.side-footer {
  margin-top: auto;
  font-size: 12px;
  padding: 0 6px;
  line-height: 1.5;
}
@media (max-width: 900px) {
  .sidebar {
    display: none;
  }
}
</style>
